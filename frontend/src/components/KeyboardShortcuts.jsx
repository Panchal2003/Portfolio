import { useEffect } from 'react';
import { useWindows } from '../context/useWindows';
import { keyboardShortcuts } from '../config/shortcuts';

export default function KeyboardShortcuts() {
  const { openWindow } = useWindows();

useEffect(() => {
  const map = {};

if (Array.isArray(keyboardShortcuts)) {
  keyboardShortcuts.forEach(s => {
    if (!s?.keys) return;

    const parts = s.keys.split(' + ');
    const key = parts[1]?.toLowerCase();

    if (key) {
      map[key] = s;
    }
  });
}

  const handler = (e) => {
    if (!e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

    const s = map[e.key.toLowerCase()];
    if (s) {
      e.preventDefault();
      openWindow(s.appId, s.title, s.icon, s.appId);
    }
  };

  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [openWindow]);

  return null;
}
