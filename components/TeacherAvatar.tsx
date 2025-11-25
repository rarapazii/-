import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface TeacherAvatarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay unmounting for exit animation
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end pointer-events-none">
      
      {/* Character Container with Slide Up Animation */}
      <div 
        className={`
          relative flex flex-col items-end
          transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) transform origin-bottom
          ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}
        `}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-orange-500 rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform z-20 border-2 border-orange-100 pointer-events-auto"
        >
          <X size={18} strokeWidth={3} />
        </button>

        {/* Speech Bubble */}
        <div className="absolute bottom-[95%] right-4 bg-white px-5 py-3 rounded-2xl rounded-br-none shadow-xl border-4 border-orange-200 z-10 animate-bounce-slow mb-2 pointer-events-auto">
            <p 
                className="text-xl text-orange-500 font-bold tracking-wide whitespace-nowrap"
                style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
            >
                一起创作吧！✨
            </p>
        </div>

        {/* Avatar Image */}
        <div className="relative pointer-events-auto group">
            <img 
                src="https://aistudiocdn.com/d/25/7133744654516757117/36553805-4f4a-4e2b-bb2a-f11909a349bc.jpg" 
                alt="昕昕老师" 
                className="h-[250px] w-auto min-w-[150px] bg-orange-50 rounded-3xl border-4 border-white shadow-2xl object-cover hover:rotate-2 transition-transform duration-300 block"
            />
            {/* Shine effect overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};