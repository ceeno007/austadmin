import React, { useRef, useEffect, useState } from 'react';
import { useOptimizedList } from '../hooks/useOptimizedList';
import ProgramCard from './ProgramCard';

interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
}

interface OptimizedProgramListProps {
  programs: Program[];
  className?: string;
}

const ITEM_HEIGHT = 400; // Approximate height of each program card
const OVERSCAN = 3; // Number of items to render outside the visible area

const OptimizedProgramList: React.FC<OptimizedProgramListProps> = ({
  programs,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(window.innerHeight - 300); // Default height

  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        setContainerHeight(height > 0 ? height : window.innerHeight - 300);
      }
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);

  const { optimizedVisibleItems, totalHeight, offsetY } = useOptimizedList({
    items: programs,
    itemHeight: ITEM_HEIGHT,
    containerHeight,
    overscan: OVERSCAN,
  });

  // If no programs are available, show a message
  if (!programs || programs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No programs available in this category.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`optimized-list-container relative ${className}`}
      style={{ 
        height: '100%', 
        overflow: 'auto',
        minHeight: '400px' // Ensure minimum height
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {optimizedVisibleItems.map((program) => (
            <div
              key={program.id}
              style={{ height: ITEM_HEIGHT }}
              className="mb-6"
            >
              <ProgramCard {...program} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptimizedProgramList; 