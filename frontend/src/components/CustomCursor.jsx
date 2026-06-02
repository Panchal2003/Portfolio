import { useEffect, useRef, useState } from 'react';

const TRAIL_COUNT = 5;

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const pos = useRef({ x: -100, y: -100 });
  const trails = useRef(Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 })));
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Add custom-cursor class to body to hide native cursor
    document.body.classList.add('custom-cursor');
    return () => document.body.classList.remove('custom-cursor');
  }, []);

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top = `${e.clientY}px`;
      }
    };
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    document.addEventListener('mousemove', move);
    document.addEventListener('mousedown', down);
    document.addEventListener('mouseup', up);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);

    let animId;
    const animate = () => {
      if (!Array.isArray(trails.current)) return;

      trails.current.forEach((trail, i) => {
        const prev = i === 0 ? pos.current : trails.current[i - 1];

        trail.x += (prev.x - trail.x) * (0.3 - i * 0.04);
        trail.y += (prev.y - trail.y) * (0.3 - i * 0.04);

        if (trailRefs.current && trailRefs.current[i]) {
          trailRefs.current[i].style.left = `${trail.x}px`;
          trailRefs.current[i].style.top = `${trail.y}px`;
        }
      });

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mousedown', down);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999,
      opacity: visible ? 1 : 0, transition: 'opacity 0.15s',
    }}>
      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          style={{
            position: 'fixed',
            width: 7 - i,
            height: 7 - i,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#00f0ff' : '#bf00ff',
            opacity: 0.5 - i * 0.08,
            boxShadow: `0 0 ${8 - i}px ${i % 2 === 0 ? '#00f0ff' : '#bf00ff'}`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Main dot */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: clicked ? 16 : 10,
          height: clicked ? 16 : 10,
          borderRadius: '50%',
          background: '#00f0ff',
          boxShadow: '0 0 8px #00f0ff, 0 0 18px rgba(0,240,255,0.5)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.12s, height 0.12s',
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: clicked ? 38 : 30,
          height: clicked ? 38 : 30,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,240,255,0.5)',
          boxShadow: '0 0 6px rgba(0,240,255,0.2)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      />
    </div>
  );
}
