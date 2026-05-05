import { useEffect, useState } from 'react';
import './RippleBackground.css';

const RippleBackground = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="ripple-container">
      <div 
        className="cursor-glow"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      />
      <div className="mesh-gradient"></div>
    </div>
  );
};

export default RippleBackground;
