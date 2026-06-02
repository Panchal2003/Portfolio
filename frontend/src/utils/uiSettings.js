export const UI_SETTINGS_STORAGE_KEY = 'portfolio-ui-settings:v1';

export const MOBILE_GRID_PRESETS = {
  '3x4': { columns: 3, rows: 4, label: '3 x 4' },
  '4x3': { columns: 4, rows: 3, label: '4 x 3' },
  '4x4': { columns: 4, rows: 4, label: '4 x 4' },
};

export const DESKTOP_GRID_PRESETS = {
  '3x3': { columns: 3, rows: 3, label: '3 x 3' },
  '3x4': { columns: 3, rows: 4, label: '3 x 4' },
  '4x3': { columns: 4, rows: 3, label: '4 x 3' },
  '4x4': { columns: 4, rows: 4, label: '4 x 4' },
};

export const THEME_PRESETS = {
  dark: {
    bg: '#0a0a1a',
    surface: '#111128',
    surfaceLight: '#1a1a3e',
    primary: '#00f0ff',
    secondary: '#bf00ff',
    accent: '#ff0080',
    text: '#e0e0ff',
    textDim: '#8888aa',
    border: '#2a2a4a',
    windowBg: 'rgba(10, 10, 30, 0.95)',
    taskbarBg: 'rgba(15, 15, 40, 0.95)',
    shellOverlay: 'rgba(10,10,26,0.64)',
  },
  light: {
    bg: '#eef4ff',
    surface: '#ffffff',
    surfaceLight: '#dbe6ff',
    primary: '#1d4ed8',
    secondary: '#4338ca',
    accent: '#f97316',
    text: '#0f172a',
    textDim: '#52607a',
    border: '#c6d3eb',
    windowBg: 'rgba(255, 255, 255, 0.96)',
    taskbarBg: 'rgba(244, 247, 255, 0.95)',
    shellOverlay: 'rgba(238,244,255,0.68)',
  },
};

export const DEFAULT_UI_SETTINGS = {
  theme: 'dark',
  wallpaper: '',
  mobileGridPreset: '4x3',
  desktopGridPreset: '3x3',
};

function sanitizeSettings(value) {
  const next = {
    ...DEFAULT_UI_SETTINGS,
    ...(value && typeof value === 'object' ? value : {}),
  };

  if (!THEME_PRESETS[next.theme]) {
    next.theme = DEFAULT_UI_SETTINGS.theme;
  }

  if (!MOBILE_GRID_PRESETS[next.mobileGridPreset]) {
    next.mobileGridPreset = DEFAULT_UI_SETTINGS.mobileGridPreset;
  }

  if (!DESKTOP_GRID_PRESETS[next.desktopGridPreset]) {
    next.desktopGridPreset = DEFAULT_UI_SETTINGS.desktopGridPreset;
  }

  if (typeof next.wallpaper !== 'string') {
    next.wallpaper = '';
  }

  return next;
}

export function loadUiSettings() {
  if (typeof window === 'undefined') {
    return DEFAULT_UI_SETTINGS;
  }

  try {
    const saved = JSON.parse(localStorage.getItem(UI_SETTINGS_STORAGE_KEY) || '{}');
    return sanitizeSettings(saved);
  } catch {
    return DEFAULT_UI_SETTINGS;
  }
}

export function applyThemeVariables(themeName) {
  if (typeof document === 'undefined') {
    return THEME_PRESETS.dark;
  }

  const palette = THEME_PRESETS[themeName] || THEME_PRESETS.dark;
  const root = document.documentElement;

  root.style.setProperty('--bg', palette.bg);
  root.style.setProperty('--surface', palette.surface);
  root.style.setProperty('--surface-light', palette.surfaceLight);
  root.style.setProperty('--primary', palette.primary);
  root.style.setProperty('--secondary', palette.secondary);
  root.style.setProperty('--accent', palette.accent);
  root.style.setProperty('--text', palette.text);
  root.style.setProperty('--text-dim', palette.textDim);
  root.style.setProperty('--border', palette.border);
  root.style.setProperty('--window-bg', palette.windowBg);
  root.style.setProperty('--taskbar-bg', palette.taskbarBg);
  document.body.style.backgroundColor = palette.bg;
  document.documentElement.dataset.theme = themeName;

  return palette;
}

