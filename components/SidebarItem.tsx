import React from 'react';
import { SourceItem } from '../types';
import { X } from 'lucide-react';

interface SidebarItemProps {
  item: SourceItem;
  onDoubleClick: (item: SourceItem) => void;
  variant?: 'default' | 'bubble';
  className?: string;
  onDelete?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, onDoubleClick, variant = 'default', className = '', onDelete }) => {
  const handleDragStart = (e: React.DragEvent) => {
    // Pass ID and Type to locate the original object in App.tsx
    e.dataTransfer.setData('itemId', item.id);
    e.dataTransfer.setData('itemType', item.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const isBubble = variant === 'bubble';

  // Determine background styles
  const hasImage = !!item.imageUrl;
  const hasGradient = item.gradient && item.gradient !== 'none';
  
  const containerStyle: React.CSSProperties = {};
  
  if (hasImage) {
    containerStyle.backgroundImage = `url(${item.imageUrl})`;
    containerStyle.backgroundSize = 'cover';
    containerStyle.backgroundPosition = 'center';
    containerStyle.backgroundColor = 'white'; // Fallback for transparent images
  } else if (hasGradient) {
    containerStyle.background = item.gradient;
  }
  
  // Use tailwind class for color if no image/gradient overrides it
  const bgColorClass = (!hasImage && !hasGradient) ? item.color : '';

  return (
    <div 
      className={`flex flex-col items-center gap-2 group cursor-grab active:cursor-grabbing ${className}`} 
      onDoubleClick={() => onDoubleClick(item)}
      draggable
      onDragStart={handleDragStart}
      title={item.name} // Tooltip for bubble mode
    >
      <div 
        className={`
          ${isBubble ? 'w-16 h-16 rounded-full border-2' : 'w-24 h-24 rounded-xl border-4'} 
          shadow-md transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-xl 
          relative overflow-hidden flex items-center justify-center border-white ${bgColorClass}
        `}
        style={containerStyle}
      >
        {/* Icon - Only show if no image is present */}
         {item.icon && !hasImage && (
           <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isBubble ? 'opacity-90 scale-75' : 'opacity-80'}`}>
             {item.icon}
           </div>
         )}
         
         {/* Label overlay - Only for default variant */}
         {!isBubble && (
           <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] py-1 text-center truncate px-1 pointer-events-none">
             {item.name}
           </div>
         )}

         {/* Delete Button */}
         {onDelete && (
           <button
             onClick={(e) => {
               e.stopPropagation(); // Prevent drag/select
               e.preventDefault();
               onDelete();
             }}
             className="absolute top-0 right-0 m-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
             title="删除素材"
           >
             <X size={12} strokeWidth={3} />
           </button>
         )}
      </div>
    </div>
  );
};