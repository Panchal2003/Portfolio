import { useState, useCallback } from 'react';
import { WindowContext } from './WindowContextBase';

export function WindowProvider({ children }) {
  const [windows, setWindows] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const openWindow = useCallback((appId, title, icon, component) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === appId);
      if (existing) {
        return prev.map(w =>
          w.id === appId
            ? { ...w, minimized: false, zIndex: nextZIndex + 1 }
            : w
        );
      }
      const offset = (prev.length % 6) * 30;
      return [...prev, {
        id: appId,
        title,
        icon,
        component,
        minimized: false,
        maximized: false,
        position: { x: 100 + offset, y: 50 + offset },
        size: { width: 800, height: 550 },
        zIndex: nextZIndex + 1,
      }];
    });
    setNextZIndex(prev => prev + 1);
    setStartMenuOpen(false);
  }, [nextZIndex]);

  const closeWindow = useCallback((appId) => {
    setWindows(prev => prev.filter(w => w.id !== appId));
  }, []);

  const minimizeWindow = useCallback((appId) => {
    setWindows(prev => prev.map(w =>
      w.id === appId ? { ...w, minimized: true } : w
    ));
  }, []);

  const maximizeWindow = useCallback((appId) => {
    setWindows(prev => prev.map(w =>
      w.id === appId ? { ...w, maximized: !w.maximized } : w
    ));
  }, []);

  const focusWindow = useCallback((appId) => {
    setWindows(prev => prev.map(w =>
      w.id === appId ? { ...w, zIndex: nextZIndex + 1, minimized: false } : w
    ));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const updateWindowPosition = useCallback((appId, position) => {
    setWindows(prev => prev.map(w =>
      w.id === appId ? { ...w, position } : w
    ));
  }, []);

  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen(prev => !prev);
    setContextMenu(null);
  }, []);

  const showContextMenu = useCallback((e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
    setStartMenuOpen(false);
  }, []);

  const hideContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <WindowContext.Provider value={{
      windows, openWindow, closeWindow, minimizeWindow, maximizeWindow,
      focusWindow, updateWindowPosition, startMenuOpen, toggleStartMenu,
      contextMenu, showContextMenu, hideContextMenu,
    }}>
      {children}
    </WindowContext.Provider>
  );
}
