import React, { useRef, useState, useEffect } from 'react';
import { WorkspaceItem } from '../types';
import { ZoomIn, ZoomOut, RotateCw, Trash2, ArrowUp, ArrowDown, Layers } from 'lucide-react';

interface CanvasItemProps {
  item: WorkspaceItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WorkspaceItem>) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
}

export const CanvasItem: React.FC<CanvasItemProps> = ({ item, isSelected, onSelect, onUpdate, onDelete, onReorder }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Pointer tracking for multi-touch gestures
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  
  // Store initial state when a gesture starts
  const gestureRef = useRef<{
    startDist: number;
    startAngle: number;
    startScale: number;
    startRotation: number;
    startX: number;
    startY: number;
    itemStartX: number;
    itemStartY: number;
  } | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    
    onSelect(item.uniqueId);

    // Track this pointer
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const ptrs: { x: number; y: number }[] = Array.from(pointersRef.current.values());

    // Initialize gesture based on number of active pointers
    if (ptrs.length === 1) {
      // Single finger/mouse: Drag Setup
      gestureRef.current = {
        startDist: 0,
        startAngle: 0,
        startScale: item.scale,
        startRotation: item.rotation,
        startX: e.clientX,
        startY: e.clientY,
        itemStartX: item.x,
        itemStartY: item.y
      };
    } else if (ptrs.length === 2) {
      // Two fingers: Pinch/Rotate Setup
      const p1 = ptrs[0];
      const p2 = ptrs[1];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
      
      gestureRef.current = {
        ...gestureRef.current!, // Keep existing position data if transitioning
        startDist: dist,
        startAngle: angle,
        startScale: item.scale,
        startRotation: item.rotation,
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;

    // Update the moving pointer's position
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const ptrs: { x: number; y: number }[] = Array.from(pointersRef.current.values());
    const gesture = gestureRef.current;
    
    if (!gesture) return;

    if (ptrs.length === 1) {
      // DRAG Logic
      const dx = e.clientX - gesture.startX;
      const dy = e.clientY - gesture.startY;
      onUpdate(item.uniqueId, { x: gesture.itemStartX + dx, y: gesture.itemStartY + dy });
    } else if (ptrs.length === 2) {
      // GESTURE Logic (Pinch + Rotate)
      const p1 = ptrs[0];
      const p2 = ptrs[1];
      
      // Calculate new distance for scale
      const newDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const scaleFactor = newDist / gesture.startDist;
      
      // Calculate new angle for rotation
      const newAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
      const angleDiff = newAngle - gesture.startAngle;

      onUpdate(item.uniqueId, {
        scale: Math.max(0.2, gesture.startScale * scaleFactor),
        rotation: gesture.startRotation + angleDiff
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    e.currentTarget.releasePointerCapture(e.pointerId);

    const ptrs: { x: number; y: number }[] = Array.from(pointersRef.current.values());
    
    if (ptrs.length === 1) {
      const p = ptrs[0];
      if (gestureRef.current) {
          gestureRef.current.startX = p.x;
          gestureRef.current.startY = p.y;
          gestureRef.current.itemStartX = item.x;
          gestureRef.current.itemStartY = item.y;
      }
    } else if (ptrs.length === 0) {
      gestureRef.current = null;
    }
  };

  // Hover handlers for Desktop
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsHovered(true);
    }
  };
  
  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 300); // 300ms delay to allow crossing gaps
    }
  };

  // Control handlers
  const handleScale = (delta: number) => {
    onUpdate(item.uniqueId, { scale: Math.max(0.2, item.scale + delta) });
  };
  
  // Continuous Rotation Logic
  const handleRotateStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsRotating(true);
  };

  const handleRotateMove = (e: React.PointerEvent) => {
    if (!isRotating || !itemRef.current) return;
    e.stopPropagation();

    const rect = itemRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate angle from center to mouse
    // adding 90 degrees so that "up" (12 o'clock) corresponds to 0 rotation visually if handle is at top
    const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degrees = radians * (180 / Math.PI);
    
    onUpdate(item.uniqueId, { rotation: degrees + 90 });
  };

  const handleRotateEnd = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsRotating(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };


  // Show controls if Selected OR Hovered
  const showControls = isSelected || isHovered || isRotating;

  return (
    <div
      ref={itemRef}
      className="absolute select-none group"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
        zIndex: isSelected ? 50 : 1,
        touchAction: 'none', // Critical: prevents browser scrolling/zooming gestures
        cursor: 'grab',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Visual Content */}
      <div 
        className={`w-full h-full rounded-xl shadow-md transition-all duration-200 overflow-hidden relative flex items-center justify-center ${isSelected ? 'ring-4 ring-blue-500 shadow-2xl' : ''}`}
        style={{ 
            background: item.gradient || item.color,
            backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : item.gradient,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: item.shape === 'circle' ? '50%' : '12px'
        }}
      >
        {item.icon && !item.imageUrl && <div className="opacity-80 transform scale-150">{item.icon}</div>}
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div 
            className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-2 flex gap-2 items-center min-w-[240px] z-[100]"
            onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking controls
            onPointerEnter={handlePointerEnter} // Keep visible when hovering controls
            onPointerLeave={handlePointerLeave} // Hide with delay when leaving controls
        >
             {/* Layer Controls */}
             <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                <div className="px-1 text-gray-400" title="图层优先级"><Layers size={16} /></div>
                <div className="flex flex-col gap-0.5">
                   <button onClick={() => onReorder(item.uniqueId, 'up')} className="p-0.5 hover:bg-orange-100 text-orange-600 rounded" title="图层上移 (Bring Forward)">
                     <ArrowUp size={16}/>
                   </button>
                   <button onClick={() => onReorder(item.uniqueId, 'down')} className="p-0.5 hover:bg-orange-100 text-orange-600 rounded" title="图层下移 (Send Backward)">
                     <ArrowDown size={16}/>
                   </button>
                </div>
            </div>

            <div className="h-8 w-px bg-gray-300 mx-1"></div>

            {/* Scale Controls */}
            <div className="flex flex-col gap-1">
                <button onClick={() => handleScale(0.1)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg" title="Zoom In"><ZoomIn size={18} /></button>
                <button onClick={() => handleScale(-0.1)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg" title="Zoom Out"><ZoomOut size={18} /></button>
            </div>

            {/* Rotate Controls (Continuous Handle) */}
            <div className="flex flex-col gap-1 items-center justify-center">
                <button 
                  onPointerDown={handleRotateStart}
                  onPointerMove={handleRotateMove}
                  onPointerUp={handleRotateEnd}
                  onPointerCancel={handleRotateEnd}
                  className={`p-2 hover:bg-purple-50 text-purple-600 rounded-lg cursor-grab active:cursor-grabbing ${isRotating ? 'bg-purple-100 ring-2 ring-purple-300' : ''}`} 
                  title="Drag to Rotate"
                >
                  <RotateCw size={24} />
                </button>
            </div>

            <div className="h-8 w-px bg-gray-300 mx-1"></div>

            {/* Delete */}
            <button onClick={() => onDelete(item.uniqueId)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors" title="Delete">
                <Trash2 size={20} />
            </button>
        </div>
      )}
    </div>
  );
};