import { useState } from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_UI_SETTINGS, MOBILE_GRID_PRESETS, DESKTOP_GRID_PRESETS } from '../utils/uiSettings';

async function compressWallpaper(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read wallpaper file.'));
    reader.readAsDataURL(file);
  });

  const image = await new Promise((resolve, reject) => {
    const next = new Image();
    next.onload = () => resolve(next);
    next.onerror = () => reject(new Error('Unable to load wallpaper image.'));
    next.src = dataUrl;
  });

  const maxSize = 1600;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.fillStyle = '#0a0a1a';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.82);
}

const cardStyle = {
  background: 'var(--window-bg)',
  border: '1px solid var(--border)',
  borderRadius: 18,
  padding: 18,
  boxShadow: '0 18px 42px rgba(0,0,0,0.18)',
};

export default function SettingsApp({ settings, onUpdateSettings, mode }) {
  const safeSettings = settings || DEFAULT_UI_SETTINGS;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleWallpaperChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      const wallpaper = await compressWallpaper(file);
      onUpdateSettings({ wallpaper });
    } catch (uploadError) {
      setError(uploadError.message || 'Wallpaper upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div
      style={{
        minHeight: '100%',
        color: 'var(--text)',
        fontFamily: "'Rajdhani', sans-serif",
        display: 'grid',
        gap: 18,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 12,
              letterSpacing: 2,
              color: 'var(--text-dim)',
              marginBottom: 6,
            }}
          >
            {'>'} SHELL_SETTINGS
          </div>
          <div
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--primary)',
            }}
          >
            Personalize Portfolio OS
          </div>
        </div>
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 999,
            border: '1px solid var(--border)',
            background: 'rgba(0,0,0,0.12)',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11,
            color: 'var(--text-dim)',
          }}
        >
          Theme: {safeSettings.theme.toUpperCase()}
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.32 }}
        style={cardStyle}
      >
        <div style={sectionHeaderStyle}>Theme</div>
        <div style={sectionHintStyle}>Switch the shell between dark and light mode.</div>
        <div style={buttonGroupStyle}>
          {['dark', 'light'].map((themeName) => {
            const active = safeSettings.theme === themeName;
            return (
              <button
                key={themeName}
                type="button"
                onClick={() => onUpdateSettings({ theme: themeName })}
              style={{
                  ...selectButtonStyle,
                  borderColor: active ? 'var(--primary)' : 'var(--border)',
                  color: active ? 'var(--primary)' : 'var(--text)',
                  background: active ? 'rgba(0,240,255,0.12)' : 'var(--surface)',
                }}
              >
                {themeName === 'dark' ? 'Dark Theme' : 'Light Theme'}
              </button>
            );
          })}
        </div>
      </motion.section>

      {mode === 'desktop' && (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.32 }}
          style={cardStyle}
        >
          <div style={sectionHeaderStyle}>Desktop Grid</div>
          <div style={sectionHintStyle}>
            Choose the desktop icon grid layout.
          </div>
          <div style={buttonGroupStyle}>
            {Object.entries(DESKTOP_GRID_PRESETS).map(([key, preset]) => {
              const active = safeSettings.desktopGridPreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onUpdateSettings({ desktopGridPreset: key })}
                  style={{
                    ...selectButtonStyle,
                    borderColor: active ? 'var(--primary)' : 'var(--border)',
                    color: active ? 'var(--primary)' : 'var(--text)',
                    background: active ? 'rgba(0,240,255,0.12)' : 'var(--surface)',
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </motion.section>
      )}

      {mode !== 'desktop' && (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.32 }}
          style={cardStyle}
        >
          <div style={sectionHeaderStyle}>Mobile Grid</div>
          <div style={sectionHintStyle}>
            Choose how many icons stay visible on the mobile home screen.
          </div>
          <div style={buttonGroupStyle}>
            {Object.entries(MOBILE_GRID_PRESETS).map(([key, preset]) => {
              const active = safeSettings.mobileGridPreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onUpdateSettings({ mobileGridPreset: key })}
                  style={{
                    ...selectButtonStyle,
                    borderColor: active ? 'var(--primary)' : 'var(--border)',
                    color: active ? 'var(--primary)' : 'var(--text)',
                    background: active ? 'rgba(0,240,255,0.12)' : 'var(--surface)',
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.32 }}
        style={cardStyle}
      >
        <div style={sectionHeaderStyle}>Wallpaper</div>
        <div style={sectionHintStyle}>
          Upload a custom wallpaper for desktop and mobile shell background.
        </div>

        <div
          style={{
            marginTop: 14,
            border: '1px dashed var(--border)',
            borderRadius: 18,
            padding: 16,
            background: safeSettings.wallpaper
              ? `linear-gradient(rgba(10,10,26,0.25), rgba(10,10,26,0.25)), url(${safeSettings.wallpaper}) center / cover no-repeat`
              : 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(191,0,255,0.08))',
            minHeight: 180,
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 16,
                color: 'var(--text)',
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {safeSettings.wallpaper ? 'Custom wallpaper active' : 'No wallpaper selected'}
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--text-dim)',
                maxWidth: 320,
              }}
            >
              Recommended: a wide image with clean contrast behind the icons.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <label style={{ ...actionButtonStyle, cursor: uploading ? 'wait' : 'pointer' }}>
              {uploading ? 'Uploading...' : 'Upload Wallpaper'}
              <input
                type="file"
                accept="image/*"
                onChange={handleWallpaperChange}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            <button
              type="button"
              onClick={() => onUpdateSettings({ wallpaper: '' })}
              disabled={!safeSettings.wallpaper}
              style={{
                ...actionButtonStyle,
                opacity: safeSettings.wallpaper ? 1 : 0.45,
                cursor: safeSettings.wallpaper ? 'pointer' : 'not-allowed',
              }}
            >
              Reset Wallpaper
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: 12,
              color: '#ff8c8c',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 11,
            }}
          >
            {error}
          </div>
        )}
      </motion.section>
    </div>
  );
}

const sectionHeaderStyle = {
  fontFamily: "'Orbitron', sans-serif",
  fontSize: 18,
  color: 'var(--primary)',
  fontWeight: 700,
  marginBottom: 6,
};

const sectionHintStyle = {
  color: 'var(--text-dim)',
  fontSize: 14,
  lineHeight: 1.5,
};

const buttonGroupStyle = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  marginTop: 16,
};

const selectButtonStyle = {
  minWidth: 110,
  padding: '12px 14px',
  borderRadius: 14,
  border: '1px solid var(--border)',
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: 12,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const actionButtonStyle = {
  padding: '12px 16px',
  borderRadius: 14,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: 12,
};
