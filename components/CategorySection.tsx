import React, { useState, useEffect, useRef } from 'react';
import { CategoryData, SourceItem } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { SidebarItem } from './SidebarItem';
import { Plus, ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  category: CategoryData;
  onAddItem: (item: SourceItem) => void;
  onGenerateAI: (category: CategoryData) => void;
  onUploadImage: (file: File) => void;
  onDeleteItem: (itemId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, onAddItem, onGenerateAI, onUploadImage, onDeleteItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);

  // Detect mobile layout to change arc direction
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Click Outside to Close logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Reset scroll when closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setScrollIndex(0), 300);
    }
  }, [isOpen]);

  // Theme Styles
  const themeColors = {
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200', shadow: 'shadow-pink-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', shadow: 'shadow-orange-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', shadow: 'shadow-green-200' },
  }[category.themeColor];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Data Preparation ---
  // Content Items: Real items only (AI Button Hidden)
  const contentItems = [
    ...category.items.map(item => ({ type: 'item', data: item })),
  ];
  
  // Fixed Item: Upload Button
  const uploadItem = { type: 'action-upload', data: { id: 'upload-btn', name: 'Upload Image' } };

  // --- Layout & Scroll Logic ---
  const VISIBLE_COUNT = 6;
  
  // Dynamic Upload Index: 
  // If we have fewer items than slots, Upload sits right after the last item.
  // If we have many items, it sits at index 5 (the last visible slot).
  const uploadSlotIndex = Math.min(contentItems.length, VISIBLE_COUNT - 1);
  
  // Logic for scrolling limits
  // We want to scroll until the last content item is visible just before the upload button.
  const maxScroll = Math.max(0, contentItems.length - uploadSlotIndex);

  // Geometry
  const RADIUS = 155; // Reduced radius for tighter fit
  
  // Fan out angles: Mobile (Down), Desktop (Right)
  // Reduced angles to shrink spacing
  const START_ANGLE = isMobile ? 40 : -50; 
  const END_ANGLE = isMobile ? 140 : 50;
  const totalSpan = END_ANGLE - START_ANGLE;
  
  const stepAngle = totalSpan / (VISIBLE_COUNT - 1);

  const handleWheel = (e: React.WheelEvent) => {
    if (!isOpen) return;
    e.stopPropagation();
    
    const direction = e.deltaY > 0 ? 1 : -1;
    setScrollIndex(prev => Math.max(0, Math.min(prev + direction, maxScroll)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current === null || !isOpen) return;
    
    const currentY = e.touches[0].clientY;
    const diff = touchStartRef.current - currentY;
    const threshold = 20; // Lower threshold for smoother feel

    if (Math.abs(diff) > threshold) {
      const direction = diff > 0 ? 1 : -1; 
      setScrollIndex(prev => Math.max(0, Math.min(prev + direction, maxScroll)));
      touchStartRef.current = currentY; 
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  // Helper to calculate position for a visual index
  const getPosition = (visualIndex: number) => {
    const angleDeg = START_ANGLE + (visualIndex * stepAngle);
    const angleRad = (angleDeg * Math.PI) / 180;
    const tx = Math.round(RADIUS * Math.cos(angleRad));
    const ty = Math.round(RADIUS * Math.sin(angleRad));
    return { tx, ty };
  };

  return (
    <div 
      ref={containerRef} 
      className="relative flex items-center justify-center lg:justify-start h-36 w-full" 
      style={{ zIndex: isOpen ? 50 : 1 }}
    >
      
      {/* Main Category Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative z-20 w-32 h-32 rounded-full flex flex-col items-center justify-center gap-1
          shadow-lg border-4 border-white transition-all duration-300 ease-spring
          ${isOpen ? 'scale-110 ring-4 ring-opacity-50' : 'hover:scale-105'}
          ${themeColors.bg} ${themeColors.text} ${isOpen ? 'ring-' + category.themeColor + '-300' : ''}
        `}
      >
        <div className="transform scale-150">{CATEGORY_ICONS[category.id]}</div>
        
        {/* Category Title with Cartoon Font */}
        <span 
          className="text-xl mt-2 tracking-wide" 
          style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
        >
          {category.title}
        </span>
        
        {/* Chevron indicator */}
        <div className={`absolute -right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isMobile ? 'rotate-90 top-auto -bottom-2 right-1/2 translate-x-1/2 translate-y-0' : ''}`}>
           <ChevronRight size={14} className="text-gray-400" />
        </div>
      </button>

      {/* Popping Items Container (The Arc) */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full z-10 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 
            Render Loop:
            We iterate through a visual window larger than visible count to handle entering/exiting "ghosts".
            Range: -2 to 7 (buffer on both ends)
        */}
        {Array.from({ length: 10 }, (_, i) => i - 2).map((visualIndex) => {
          
          // --- 1. Render Content Items (The scrolling list) ---
          // Map visual index to data index: visualIndex 0 shows content[scrollIndex]
          const contentDataIndex = scrollIndex + visualIndex;
          const contentNode = (contentDataIndex >= 0 && contentDataIndex < contentItems.length) 
            ? contentItems[contentDataIndex] 
            : null;

          // --- 2. Render Fixed Upload Item ---
          // It only appears strictly at the dynamic upload slot index
          const isFixedUploadSlot = visualIndex === uploadSlotIndex;

          const elementsToRender = [];

          // Add Content Node if it exists
          if (contentNode) {
             elementsToRender.push({
               type: 'content',
               node: contentNode,
               // If this slot is the fixed upload slot, the content is "behind" it, so treat as ghost
               forceGhost: visualIndex >= uploadSlotIndex 
             });
          }

          // Add Upload Button if this is the slot
          if (isFixedUploadSlot) {
            elementsToRender.push({
              type: 'upload',
              node: uploadItem,
              forceGhost: false
            });
          }

          return elementsToRender.map((el, idx) => {
             const key = el.type === 'upload' ? 'fixed-upload' : el.node.data.id;
             const { tx, ty } = getPosition(visualIndex);
             
             // Determine Visual State
             // A slot is "Active" if it's between 0 and (uploadSlotIndex - 1)
             // The uploadSlotIndex is active for Upload, but ghost for content.
             // Slot < 0 is ghost.
             const isVisualGhost = visualIndex < 0 || visualIndex > (uploadSlotIndex - 1);
             const isGhost = el.forceGhost || isVisualGhost;
             
             // Special case: Upload button is never a ghost if it's in the right slot
             const finalIsGhost = el.type === 'upload' ? false : isGhost;

             // Z-Index Logic
             let zIndex = 10;
             if (el.type === 'upload') {
               zIndex = 60; 
             } else if (!finalIsGhost) {
               // 50 - visualIndex ensures 0 is above 1, 1 above 2, etc.
               zIndex = 50 - visualIndex;
             }
             
             const style: React.CSSProperties = {
                transform: isOpen 
                  ? `translate(${tx}px, ${ty}px) scale(${finalIsGhost ? 0.7 : 1})` 
                  : `translate(0px, 0px) scale(0)`,
                opacity: isOpen ? (finalIsGhost ? 0.3 : 1) : 0,
                filter: isOpen && finalIsGhost ? 'blur(2px) grayscale(50%)' : 'none',
                left: '50%',
                top: '50%',
                marginLeft: -32, 
                marginTop: -32,
                zIndex: zIndex,
                pointerEvents: finalIsGhost ? 'none' : 'auto',
             };

             return (
               <div 
                 key={key}
                 // Added hover:z-[100] to fix selection issues when items overlap
                 className="absolute transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) hover:z-[100]"
                 style={style}
               >
                 {el.node.type === 'item' && (
                    <SidebarItem 
                      item={el.node.data as SourceItem} 
                      onDoubleClick={() => { onAddItem(el.node.data as SourceItem); }} 
                      variant="bubble"
                      onDelete={() => onDeleteItem(el.node.data.id)}
                    />
                 )}
                 
                 {el.node.type === 'action-upload' && (
                   <>
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*"
                       onChange={handleFileChange}
                     />
                     <button
                       onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                       className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white"
                       title="Upload Image"
                     >
                       <Plus size={28} strokeWidth={3} />
                     </button>
                   </>
                 )}
               </div>
             );
          });
        })}
      </div>
    </div>
  );
};