
import { useSound } from '@/context/SoundContext';
import { useState } from 'react';

export default function Tooltip({ children, text, description, position = 'bottom' }) {
  const { play } = useSound();
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => {
          play('hover');
          setIsVisible(true);
        }}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          style={{ 
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div className="bg-gray-08 border border-gray-20 rounded-lg px-3 py-2 shadow-xl min-w-max">
            <div className="text-white text-sm font-medium">{text}</div>
            {description && (
              <div className="text-gray-60 text-xs mt-0.5">{description}</div>
            )}
          </div>
          {/* Arrow */}
          <div className={`absolute w-2 h-2 bg-gray-08 border-gray-20 rotate-45 ${
            position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-t border-l' :
            position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b border-r' :
            position === 'right' ? 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-t border-l' :
            'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-b border-r'
          }`}></div>
        </div>
      )}
    </div>
  );
}