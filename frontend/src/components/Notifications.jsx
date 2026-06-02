import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const desktopNotifications = [
  { id: 1, title: 'Welcome!', message: 'Welcome to SACHIN_OS - explore my portfolio!', delay: 1500, duration: 5000 },
  { id: 2, title: 'Tip', message: 'Drag icons anywhere - right click for menu - try the Terminal.', delay: 4000, duration: 6000 },
  { id: 3, title: 'Shortcuts', message: 'Ctrl+T = Terminal, Ctrl+P = Projects, Ctrl+A = About.', delay: 8000, duration: 5000 },
];

const mobileNotifications = [
  { id: 1, title: 'Welcome!', message: 'Welcome to SACHIN_OS - explore my portfolio!', delay: 1500, duration: 5000 },
  { id: 2, title: 'Tip', message: 'Hold and drag icons to move them between fixed home screen slots.', delay: 4000, duration: 6000 },
  { id: 3, title: 'Shortcuts', message: 'Bottom dock now opens About, Settings, and the voice assistant.', delay: 8000, duration: 5000 },
];

const mobileVariants = {
  hidden: { y: -70, opacity: 0, scale: 0.96 },
  visible: { y: 0, opacity: 1, scale: 1 },
  exit: (direction) => ({
    x: direction < 0 ? -320 : 320,
    opacity: 0,
    scale: 0.94,
  }),
};

const desktopVariants = {
  hidden: { x: 320, opacity: 0, scale: 0.9 },
  visible: { x: 0, opacity: 1, scale: 1 },
  exit: { x: 320, opacity: 0, scale: 0.9 },
};

export default function Notifications() {
  const [active, setActive] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [swipeDirections, setSwipeDirections] = useState({});

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width <= 480;
  const isTabletOrMobile = width <= 1024;

  useEffect(() => {
    const notifications = isMobile ? mobileNotifications : desktopNotifications;
    const timers = [];

    notifications.forEach((notification) => {
      timers.push(setTimeout(() => {
        setActive((prev) => [...prev, notification]);
      }, notification.delay));

      timers.push(setTimeout(() => {
        setActive((prev) => prev.filter((item) => item.id !== notification.id));
      }, notification.delay + notification.duration));
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [isMobile]);

  const dismissNotification = (id, direction = 1) => {
    setSwipeDirections((prev) => ({ ...prev, [id]: direction }));
    setActive((prev) => prev.filter((item) => item.id !== id));
    window.setTimeout(() => {
      setSwipeDirections((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 320);
  };

  const containerStyle = isTabletOrMobile
    ? {
        position: 'fixed',
        top: 40,
        left: 8,
        right: 8,
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }
    : {
        position: 'fixed',
        top: 60,
        right: 15,
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 340,
        width: '100%',
      };

  return (
    <div style={containerStyle}>
      <AnimatePresence>
        {active.map((notification) => (
          <motion.div
            key={notification.id}
            custom={swipeDirections[notification.id] || 1}
            variants={isTabletOrMobile ? mobileVariants : desktopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            drag={isTabletOrMobile ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (!isTabletOrMobile) {
                return;
              }
              if (Math.abs(info.offset.x) > 90) {
                dismissNotification(notification.id, info.offset.x < 0 ? -1 : 1);
              }
            }}
            style={{
              background: 'rgba(15,15,40,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,240,255,0.2)',
              borderLeft: '3px solid #00f0ff',
              borderRadius: 10,
              padding: '14px 16px',
              boxShadow: '0 5px 30px rgba(0,0,0,0.5), 0 0 15px rgba(0,240,255,0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 700, color: '#00f0ff', marginBottom: 5 }}>
                  {notification.title}
                </div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: '#c0c0e0', lineHeight: 1.4 }}>
                  {notification.message}
                </div>
              </div>
              {!isTabletOrMobile && (
                <button
                  type="button"
                  onClick={() => dismissNotification(notification.id)}
                  style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 16, padding: '0 2px' }}
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

