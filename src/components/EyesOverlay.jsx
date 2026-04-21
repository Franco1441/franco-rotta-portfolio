import { useEffect, useMemo, useState } from 'react';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function EyesOverlay({ containerRef, eyes }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event) => {
      setPointer({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  const pupils = useMemo(() => {
    const element = containerRef.current;
    if (!element) {
      return eyes.map(() => ({ x: 0, y: 0 }));
    }

    const bounds = element.getBoundingClientRect();
    return eyes.map((eye) => {
      const centerX = bounds.left + bounds.width * eye.x;
      const centerY = bounds.top + bounds.height * eye.y;
      const deltaX = pointer.x - centerX;
      const deltaY = pointer.y - centerY;
      const distance = Math.max(Math.hypot(deltaX, deltaY), 1);
      const limit = eye.radius ?? 5;

      return {
        x: clamp((deltaX / distance) * limit, -limit, limit),
        y: clamp((deltaY / distance) * limit, -limit, limit),
      };
    });
  }, [containerRef, eyes, pointer.x, pointer.y]);

  return (
    <div className="avatar-eyes" aria-hidden="true">
      {eyes.map((eye, index) => (
        <div
          key={`${eye.x}-${eye.y}`}
          className="avatar-eye"
          style={{
            left: `${eye.x * 100}%`,
            top: `${eye.y * 100}%`,
            width: `${eye.size}px`,
            height: `${eye.size}px`,
          }}
        >
          <div
            className="avatar-eye__pupil"
            style={{
              transform: `translate(calc(-50% + ${pupils[index].x}px), calc(-50% + ${pupils[index].y}px))`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
