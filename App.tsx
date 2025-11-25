import React, { useState, useRef } from 'react';
import { INITIAL_CATEGORIES } from './constants';
import { CategorySection } from './components/CategorySection';
import { CanvasItem } from './components/CanvasItem';
import { WorkspaceItem, SourceItem, CategoryType, CategoryData } from './types';
import { AIModal } from './components/AIModal';

const App: React.FC = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // AI Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activeCategoryForAI, setActiveCategoryForAI] = useState<CategoryType>('fabric');

  // Teacher Message State
  const [showTeacherMessage, setShowTeacherMessage] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleAddToWorkspace = (sourceItem: SourceItem) => {
    // If adding via click (not drag), place somewhat randomly in center
    const workspaceRect = workspaceRef.current?.getBoundingClientRect();
    const centerX = workspaceRect ? workspaceRect.width / 2 : window.innerWidth / 2;
    const centerY = workspaceRect ? workspaceRect.height / 2 : window.innerHeight / 2;
    
    const newItem: WorkspaceItem = {
      ...sourceItem,
      uniqueId: `${sourceItem.id}-${Date.now()}`,
      x: centerX - 60 + (Math.random() * 40 - 20),
      y: centerY - 60 + (Math.random() * 40 - 20),
      width: 120,
      height: 120,
      rotation: 0,
      scale: 1,
    };
    setWorkspaceItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.uniqueId); // Auto-select new item
  };

  const handleUpdateItem = (id: string, updates: Partial<WorkspaceItem>) => {
    setWorkspaceItems((prev) =>
      prev.map((item) => (item.uniqueId === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setWorkspaceItems((prev) => prev.filter((item) => item.uniqueId !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleReorderItem = (id: string, direction: 'up' | 'down') => {
    setWorkspaceItems((prev) => {
      const index = prev.findIndex((item) => item.uniqueId === id);
      if (index === -1) return prev;

      const newItems = [...prev];
      const item = newItems[index];

      // Remove from current position
      newItems.splice(index, 1);

      if (direction === 'up') {
        // Move forward one step (render later in array -> higher z-index)
        const newIndex = Math.min(newItems.length, index + 1);
        newItems.splice(newIndex, 0, item);
      } else if (direction === 'down') {
        // Move backward one step (render earlier -> lower z-index)
        const newIndex = Math.max(0, index - 1);
        newItems.splice(newIndex, 0, item);
      }
      return newItems;
    });
  };
  
  const handleDeleteCategoryItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.filter((item) => item.id !== itemId),
          };
        }
        return cat;
      })
    );
  };

  const openAIModal = (category: CategoryData) => {
    setActiveCategoryForAI(category.id);
    setIsAIModalOpen(true);
  };

  const handleAIImageGenerated = (newItem: SourceItem) => {
    // Add to category list
    setCategories(prev => prev.map(cat => {
        if (cat.id === newItem.type) {
            return { ...cat, items: [...cat.items, newItem] };
        }
        return cat;
    }));
    // Auto add to workspace
    handleAddToWorkspace(newItem);
  };

  const handleUploadImage = (categoryType: CategoryType, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const newItem: SourceItem = {
          id: `upload-${Date.now()}`,
          name: file.name.substring(0, 8), // Keep name short
          type: categoryType,
          color: 'bg-white',
          shape: 'rounded-rect',
          gradient: 'none',
          imageUrl: result,
        };

        setCategories((prev) =>
          prev.map((cat) => {
            if (cat.id === categoryType) {
              return { ...cat, items: [...cat.items, newItem] };
            }
            return cat;
          })
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const itemType = e.dataTransfer.getData('itemType');

    if (!itemId || !itemType) return;

    // Find the original item from categories
    const category = categories.find(c => c.id === itemType);
    const sourceItem = category?.items.find(i => i.id === itemId);

    if (sourceItem && workspaceRef.current) {
      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      
      // Calculate position relative to workspace
      const x = e.clientX - workspaceRect.left - 60; // 60 = 120/2
      const y = e.clientY - workspaceRect.top - 60;

      const newItem: WorkspaceItem = {
        ...sourceItem,
        uniqueId: `${sourceItem.id}-${Date.now()}`,
        x,
        y,
        width: 120,
        height: 120,
        rotation: 0,
        scale: 1,
      };

      setWorkspaceItems((prev) => [...prev, newItem]);
      setSelectedId(newItem.uniqueId);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-[#FFFDF5]">
      
      {/* 1. Workspace (Background Layer) */}
      <div 
        ref={workspaceRef}
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          // Craft mat texture: warm background with subtle dot grid
          backgroundColor: '#FFFDF5',
          backgroundImage: 'radial-gradient(#E3D5CA 2px, transparent 2px)',
          backgroundSize: '30px 30px'
        }}
        onClick={() => setSelectedId(null)} // Click empty space to deselect
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Subtle Watermark/Instruction */}
        {workspaceItems.length === 0 && (
          <div 
            className="absolute inset-0 flex items-center justify-center text-[#E3D5CA] text-3xl pointer-events-none select-none opacity-50"
            style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
          >
             点击左侧图标开始创作吧！
          </div>
        )}

        {/* Canvas Items */}
        {workspaceItems.map((item) => (
          <CanvasItem
            key={item.uniqueId}
            item={item}
            isSelected={selectedId === item.uniqueId}
            onSelect={setSelectedId}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
            onReorder={handleReorderItem}
          />
        ))}
      </div>

      {/* 2. Header (Floating Top) */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-center items-center pointer-events-none pt-6">
        <div className="relative flex items-center">
          <h1 
            className="text-5xl md:text-7xl tracking-wider text-amber-800 pointer-events-auto cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => setShowTeacherMessage(prev => !prev)}
            style={{
              fontFamily: '"ZCOOL KuaiLe", cursive',
              WebkitTextStroke: '2px #FFF', 
              textShadow: '3px 3px 0px rgba(139, 69, 19, 0.1), 5px 5px 10px rgba(0,0,0,0.05)', // Warm brown shadow
              padding: '10px 20px'
            }}
            title="点击召唤昕昕老师！"
          >
            昕昕老师创意小工坊
          </h1>

          {/* Teacher Message Bubble */}
          <div 
            className={`
              absolute left-full ml-4 whitespace-nowrap
              bg-white px-6 py-3 rounded-2xl rounded-bl-none shadow-xl border-4 border-orange-200 
              flex items-center justify-center pointer-events-auto
              transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) origin-left
              ${showTeacherMessage ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-0 -translate-x-8'}
            `}
          >
            <span 
              className="text-2xl text-orange-500 font-bold tracking-wide" 
              style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
            >
              一起创作吧！✨
            </span>
          </div>
        </div>
      </div>

      {/* 3. Sidebar (Floating Left) */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-8 pointer-events-none">
        {/* Child elements enable pointer events so the container doesn't block clicks on the canvas behind/around it */}
        {categories.map((category) => (
          <div key={category.id} className="pointer-events-auto">
            <CategorySection
              category={category}
              onAddItem={handleAddToWorkspace}
              onGenerateAI={openAIModal}
              onUploadImage={(file) => handleUploadImage(category.id, file)}
              onDeleteItem={(itemId) => handleDeleteCategoryItem(category.id, itemId)}
            />
          </div>
        ))}
      </div>

      <AIModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        categoryType={activeCategoryForAI}
        onImageGenerated={handleAIImageGenerated}
      />
    </div>
  );
};

export default App;