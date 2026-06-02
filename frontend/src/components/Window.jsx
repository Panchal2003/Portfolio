import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '../context/useWindows';

export default function Window({ id, title, icon, children, zIndex, minimized, maximized, position }) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition } = useWindows();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    focusWindow(id);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newX = Math.max(0, e.clientX - dragOffset.x);
      const newY = Math.max(0, e.clientY - dragOffset.y);
      updateWindowPosition(id, { x: newX, y: newY });
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, id, updateWindowPosition]);

  const handleTouchStart = (e) => {
    if (e.target.closest('.window-controls')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
    focusWindow(id);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const newX = Math.max(0, touch.clientX - dragOffset.x);
      const newY = Math.max(0, touch.clientY - dragOffset.y);
      updateWindowPosition(id, { x: newX, y: newY });
    };

    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset, id, updateWindowPosition]);

  if (minimized) return null;

  const isMobile = window.innerWidth <= 1024;

  const windowStyle = {
    position: maximized || isMobile ? 'fixed' : 'absolute',
    left: maximized || isMobile ? 0 : position.x,
    top: maximized || isMobile ? 0 : position.y,
    width: maximized || isMobile ? '100vw' : '800px',
    height: maximized || isMobile ? '100vh' : '550px',
    maxWidth: maximized || isMobile ? '100vw' : 'calc(100vw - 20px)',
    maxHeight: maximized || isMobile ? '100vh' : 'calc(100vh - 80px)',
    zIndex: isMobile ? 10001 : zIndex,
    background: 'var(--window-bg)',
    backdropFilter: 'blur(20px)',
    border: isMobile ? 'none' : '1px solid var(--border)',
    borderRadius: maximized || isMobile ? '0' : '8px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: isMobile ? 'none' : '0 0 30px rgba(0, 240, 255, 0.15), 0 0 60px rgba(0, 0, 0, 0.5)',
  };

  const titleBarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    padding: isMobile ? '38px 16px 10px 16px' : '8px 12px',
    background: isMobile
      ? 'linear-gradient(180deg, rgba(10,10,30,0.98), rgba(10,10,30,0.92))'
      : 'linear-gradient(90deg, rgba(0, 240, 255, 0.1), rgba(191, 0, 255, 0.1))',
    borderBottom: '1px solid var(--border)',
    cursor: isMobile ? 'default' : (isDragging ? 'grabbing' : 'grab'),
    userSelect: 'none',
    minHeight: isMobile ? '52px' : '40px',
  };

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '14px',
    color: 'var(--primary)',
    fontWeight: 600,
  };

  const controlsStyle = {
    display: 'flex',
    gap: '8px',
  };

  const btnBase = {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
    ...(isMobile && { paddingBottom: '80px' }),
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={windowRef}
        style={windowStyle}
        initial={isMobile ? { y: '100%', opacity: 0 } : { scale: 0.8, opacity: 0 }}
        animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
        exit={isMobile ? { y: '100%', opacity: 0 } : { scale: 0.8, opacity: 0 }}
        transition={isMobile
          ? { type: 'spring', stiffness: 300, damping: 30 }
          : { type: 'spring', stiffness: 300, damping: 25 }
        }
        onClick={() => focusWindow(id)}
      >
        {/* Title Bar */}
        <div
          style={titleBarStyle}
          onMouseDown={isMobile ? undefined : handleMouseDown}
          onTouchStart={isMobile ? undefined : handleTouchStart}
        >
          <div style={titleStyle}>
            {isMobile && (
              <span
                style={{
                  fontSize: '20px', cursor: 'pointer', marginRight: 6,
                  color: 'var(--primary)', lineHeight: 1,
                  WebkitTapHighlightColor: 'transparent',
                  padding: '4px',
                }}
                onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
              >‹</span>
            )}
            <span style={{ fontSize: '16px' }}>{icon}</span>
            <span>{title}</span>
          </div>
          {!isMobile && (
            <div className="window-controls" style={controlsStyle}>
              <button
                style={{ ...btnBase, background: '#ffaa00' }}
                onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                title="Minimize"
              />
              <button
                style={{ ...btnBase, background: '#00ff88' }}
                onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
                title="Maximize"
              />
              <button
                style={{ ...btnBase, background: '#ff3366' }}
                onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                title="Close"
              />
            </div>
          )}
        </div>
        {/* Content */}
        <div style={contentStyle}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
