import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MOBILE_GRID_PRESETS } from '../utils/uiSettings';

const glowColors = [
  'rgba(0, 240, 255, 0.56)',
  'rgba(191, 0, 255, 0.56)',
  'rgba(255, 0, 128, 0.56)',
  'rgba(0, 255, 136, 0.56)',
  'rgba(255, 170, 0, 0.56)',
];

function moveItem(items, fromIndex, toIndex) {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function getStoredOrder(storageKey, apps) {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const validIds = new Set(apps.map((app) => app.id));
  const ordered = saved.filter((id) => validIds.has(id));
  const missing = apps.map((app) => app.id).filter((id) => !ordered.includes(id));
  return [...ordered, ...missing];
}

function getGridConfig(mode, width, height, presetKey) {
  const preset = MOBILE_GRID_PRESETS[presetKey] || MOBILE_GRID_PRESETS['4x3'];
  const sidePadding = mode === 'mobile' ? 8 : 20;
  const horizontalGap = mode === 'mobile' ? 8 : 14;
  const verticalGap = mode === 'mobile' ? 10 : 14;
  const columns = preset.columns;
  const rows = preset.rows;

  const rawWidth = (width - (sidePadding * 2) - (horizontalGap * (columns - 1))) / columns;
  const itemWidth = Math.max(mode === 'mobile' ? 70 : 90, Math.floor(rawWidth));
  const rawHeight = (height - (verticalGap * (rows - 1))) / rows;
  const itemHeight = Math.max(mode === 'mobile' ? 92 : 104, Math.floor(rawHeight));
  const iconSize = mode === 'mobile' ? 28 : 34;
  const labelSize = mode === 'mobile' ? 9.5 : 11;

  return {
    columns,
    rows,
    sidePadding,
    horizontalGap,
    verticalGap,
    itemWidth,
    itemHeight,
    iconSize,
    labelSize,
  };
}

function createSlots(count, width, height, mode, presetKey) {
  const config = getGridConfig(mode, width, height, presetKey);
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / config.columns);
    const column = index % config.columns;
    return {
      x: config.sidePadding + (column * (config.itemWidth + config.horizontalGap)),
      y: row * (config.itemHeight + config.verticalGap),
    };
  });
}

export default function MobileHomeGrid({
  apps,
  mode,
  onOpenApp,
  storageKey,
  gridPreset = '4x3',
}) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState(() => ({
    width: window.innerWidth,
    height: Math.max(window.innerHeight - 320, 280),
  }));
  const [orderedIds, setOrderedIds] = useState(() => getStoredOrder(storageKey, apps));
  const [dragState, setDragState] = useState(null);

  const orderedApps = useMemo(
    () => orderedIds.map((id) => apps.find((app) => app.id === id)).filter(Boolean),
    [apps, orderedIds]
  );
  const slots = useMemo(
    () => createSlots(orderedApps.length, containerSize.width, containerSize.height, mode, gridPreset),
    [containerSize.height, containerSize.width, gridPreset, mode, orderedApps.length]
  );
  const config = useMemo(
    () => getGridConfig(mode, containerSize.width, containerSize.height, gridPreset),
    [containerSize.height, containerSize.width, gridPreset, mode]
  );

  useEffect(() => {
    setOrderedIds(getStoredOrder(storageKey, apps));
  }, [apps, storageKey]);

  useEffect(() => {
    const handleResize = () => {
      const width = containerRef.current?.offsetWidth || window.innerWidth;
      const height = containerRef.current?.offsetHeight || Math.max(window.innerHeight - 320, 280);
      setContainerSize({ width, height });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!dragState) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      setDragState((current) => {
        if (!current) {
          return current;
        }

        const nextX = event.clientX - rect.left - current.offsetX;
        const nextY = event.clientY - rect.top - current.offsetY;
        const moved = current.moved
          || Math.abs(nextX - current.startX) > 6
          || Math.abs(nextY - current.startY) > 6;

        return {
          ...current,
          x: nextX,
          y: nextY,
          moved,
        };
      });
    };

    const handlePointerUp = () => {
      setDragState((current) => {
        if (!current) {
          return null;
        }

        if (!current.moved) {
          const app = apps.find((item) => item.id === current.appId);
          if (app) {
            onOpenApp(app);
          }
          return null;
        }

        const dragCenter = {
          x: current.x + (config.itemWidth / 2),
          y: current.y + (config.itemHeight / 2),
        };

        let targetIndex = current.index;
        let nearestDistance = Number.POSITIVE_INFINITY;

        slots.forEach((slot, index) => {
          const slotCenterX = slot.x + (config.itemWidth / 2);
          const slotCenterY = slot.y + (config.itemHeight / 2);
          const distance = Math.hypot(dragCenter.x - slotCenterX, dragCenter.y - slotCenterY);

          if (distance < nearestDistance) {
            nearestDistance = distance;
            targetIndex = index;
          }
        });

        if (targetIndex !== current.index) {
          const nextOrder = moveItem(orderedIds, current.index, targetIndex);
          setOrderedIds(nextOrder);
          localStorage.setItem(storageKey, JSON.stringify(nextOrder));
        }

        return null;
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [apps, config.itemHeight, config.itemWidth, onOpenApp, orderedIds, slots, storageKey, dragState]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: mode === 'mobile' ? 'calc(138px + env(safe-area-inset-top, 0px))' : 'calc(156px + env(safe-area-inset-top, 0px))',
        left: 0,
        right: 0,
        bottom: 'calc(98px + env(safe-area-inset-bottom, 0px))',
        overflow: 'hidden',
      }}
    >
      {orderedApps.map((app, index) => {
        const slot = slots[index] || { x: 0, y: 0 };
        const isDragging = dragState?.appId === app.id;
        const glow = glowColors[index % glowColors.length];
        const x = isDragging ? dragState.x : slot.x;
        const y = isDragging ? dragState.y : slot.y;

        return (
          <motion.button
            key={app.id}
            type="button"
            onPointerDown={(event) => {
              const rect = containerRef.current?.getBoundingClientRect();
              if (!rect) {
                return;
              }

              event.preventDefault();
              setDragState({
                appId: app.id,
                index,
                offsetX: event.clientX - rect.left - slot.x,
                offsetY: event.clientY - rect.top - slot.y,
                startX: slot.x,
                startY: slot.y,
                x: slot.x,
                y: slot.y,
                moved: false,
              });
            }}
            animate={{
              x,
              y,
              scale: isDragging ? 1.04 : 1,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            style={{
              position: 'absolute',
              width: config.itemWidth,
              minHeight: config.itemHeight,
              border: '1px solid rgba(42,42,74,0.24)',
              borderRadius: 18,
              background: `linear-gradient(180deg, ${glow.replace('0.56', '0.14')}, rgba(17,17,40,0.38))`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              color: '#e0e0ff',
              cursor: 'grab',
              boxShadow: isDragging
                ? `0 16px 36px ${glow.replace('0.56', '0.18')}`
                : '0 12px 26px rgba(0,0,0,0.16)',
              backdropFilter: 'blur(14px)',
              touchAction: 'none',
              zIndex: isDragging ? 20 : 2,
              padding: mode === 'mobile' ? '11px 6px' : '12px 8px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: config.iconSize, lineHeight: 1 }}>{app.icon}</span>
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: config.labelSize,
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.3,
                letterSpacing: '0.2px',
              }}
            >
              {app.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
