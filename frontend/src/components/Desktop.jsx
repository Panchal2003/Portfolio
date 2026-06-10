import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '../context/useWindows';
import { DraggableIcon } from './DesktopIcon';
import DesktopGrid from './DesktopGrid';
import Window from './Window';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import AboutApp from '../apps/AboutApp';
import SkillsApp from '../apps/SkillsApp';
import ProjectsApp from '../apps/ProjectsApp';
import ExperienceApp from '../apps/ExperienceApp';
import EducationApp from '../apps/EducationApp';
import TerminalApp from '../apps/TerminalApp';
import ContactApp from '../apps/ContactApp';
import InspectApp from '../apps/InspectApp';
import SystemInfoApp from '../apps/SystemInfoApp';
import ResumeApp from '../apps/ResumeApp';
import AchievementsApp from '../apps/AchievementsApp';
import SettingsApp from '../apps/SettingsApp';
import CustomCursor from './CustomCursor';
import Notifications from './Notifications';
import KeyboardShortcuts from './KeyboardShortcuts';
import MobileDock from './MobileDock';
import MobileHomeGrid from './MobileHomeGrid';
import VoiceAssistant from './VoiceAssistant';
import { desktopApps } from '../config/shortcuts';
import API from '../api/index';
import {
  fallbackProfile,
  fallbackSkills,
  fallbackProjects,
  fallbackExperience,
  fallbackEducation,
  fallbackAchievements,
} from '../data/fallbackData';
import {
  normalizeEducationList,
  normalizeProfile,
} from '../utils/portfolioData';
import {
  applyThemeVariables,
  DEFAULT_UI_SETTINGS,
  THEME_PRESETS,
  UI_SETTINGS_STORAGE_KEY,
  loadUiSettings,
} from '../utils/uiSettings';

function pseudoRandom(seed) {
  const value = Math.sin(seed * 43758.5453123) * 10000;
  return value - Math.floor(value);
}

function getIconLayout(mode) {
  if (mode === 'mobile') {
    return {
      columns: 4,
      iconWidth: 72,
      iconHeight: 92,
      leftPad: 12,
      rightPad: 12,
      topPad: 148,
      rowGap: 22,
    };
  }

  if (mode === 'tablet') {
    return {
      columns: 5,
      iconWidth: 88,
      iconHeight: 104,
      leftPad: 24,
      rightPad: 24,
      topPad: 164,
      rowGap: 24,
    };
  }

  return {
    columns: 2,
    iconWidth: 125,
    iconHeight: 145,
    leftPad: 60,
    rightPad: 60,
    topPad: 40,
    rowGap: 20,
    columnGap: 160,
  };
}

function getStorageKey(mode) {
  return `iconPositions:${mode}`;
}

function createDefaultPositions(mode) {
  const layout = getIconLayout(mode);

  return desktopApps.map((_, index) => {
    const row = Math.floor(index / layout.columns);
    const col = index % layout.columns;
    const gapX = layout.columnGap ?? (
      layout.columns > 1
        ? Math.max(window.innerWidth - layout.leftPad - layout.rightPad - layout.iconWidth, 0) / (layout.columns - 1)
        : 0
    );

    return {
      x: Math.round(layout.leftPad + (col * gapX)),
      y: Math.round(layout.topPad + (row * (layout.iconHeight + layout.rowGap))),
    };
  });
}

function getIconPositions(mode) {
  const saved = JSON.parse(localStorage.getItem(getStorageKey(mode)) || '{}');
  const defaults = createDefaultPositions(mode);
  return desktopApps.map((app, index) => saved[app.title] || defaults[index]);
}

function useResponsive() {
  const [mode, setMode] = useState(() => {
    const width = window.innerWidth;
    return width <= 480 ? 'mobile' : width <= 1024 ? 'tablet' : 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setMode(width <= 480 ? 'mobile' : width <= 1024 ? 'tablet' : 'desktop');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return mode;
}

function FloatingParticles({ mode }) {
  const count = mode === 'mobile' ? 12 : mode === 'tablet' ? 20 : 35;
  const particles = useMemo(() => (
    Array.from({ length: count }, (_, index) => ({
      id: index,
      left: `${pseudoRandom(index + 1) * 100}%`,
      top: `${pseudoRandom(index + 101) * 100}%`,
      size: 2 + pseudoRandom(index + 201) * 4,
      duration: 3 + pseudoRandom(index + 301) * 7,
      delay: pseudoRandom(index + 401) * 5,
      color: ['#00f0ff', '#bf00ff', '#ff0080', '#00ff88', '#ffaa00'][index % 5],
      opacity: 0.15 + pseudoRandom(index + 501) * 0.3,
    }))
  ), [count]);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 4}px ${particle.color}`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{ y: [-20, 20, -20], x: [-12, 12, -12], opacity: [particle.opacity, particle.opacity * 0.2, particle.opacity] }}
          transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut', delay: particle.delay }}
        />
      ))}
    </>
  );
}

function NeonLines() {
  return (
    <>
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.12), transparent)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{ top: ['-2%', '102%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          height: '100%',
          width: 1,
          background: 'linear-gradient(180deg, transparent, rgba(191,0,255,0.1), transparent)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{ left: ['-2%', '102%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 2 }}
      />
    </>
  );
}

function WelcomeWidget({ mode }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = time.getHours() < 12 ? 'Good Morning' : time.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  if (mode !== 'desktop') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 1 }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -55%)',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'clamp(300px,35vw,500px)',
          height: 'clamp(300px,35vw,500px)',
          transform: 'translate(-50%,-50%)',
          border: '1px solid rgba(0,240,255,0.06)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'clamp(380px,45vw,600px)',
          height: 'clamp(380px,45vw,600px)',
          transform: 'translate(-50%,-50%)',
          border: '1px dashed rgba(191,0,255,0.04)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 5, repeat: Infinity }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(10px,1.3vw,14px)', color: 'rgba(0,240,255,0.25)', letterSpacing: 6, textTransform: 'uppercase', marginBottom: 8 }}>
          // {greeting}
        </div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(32px,6vw,72px)', fontWeight: 900, background: 'linear-gradient(135deg,#00f0ff 0%,#bf00ff 40%,#ff0080 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, marginBottom: 6 }}>
          SACHIN_OS
        </div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(10px,1.5vw,16px)', color: 'rgba(191,0,255,0.3)', letterSpacing: 3, marginBottom: 10 }}>
          FULL STACK DEVELOPER
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(9px,1.2vw,12px)', color: 'rgba(136,136,170,0.3)', letterSpacing: 2 }}>
          [ drag icons | click to open | right-click menu | Ctrl+T terminal ]
        </div>
      </motion.div>
    </motion.div>
  );
}

function HUDOverlay({ mode }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (mode !== 'desktop') {
    return null;
  }

  return (
    <>
      <div style={{ position: 'absolute', top: 12, left: 14, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 35, height: 2, background: 'rgba(0,240,255,0.4)' }} />
          <div style={{ width: 10, height: 2, background: 'rgba(0,240,255,0.2)' }} />
        </div>
        <div style={{ width: 2, height: 35, background: 'rgba(0,240,255,0.4)' }} />
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(0,240,255,0.3)', marginTop: 8, letterSpacing: 1 }}>
          SACHIN_OS v2.0.26
        </div>
      </div>
      <div style={{ position: 'absolute', top: 12, right: 14, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
          <div style={{ width: 10, height: 2, background: 'rgba(191,0,255,0.2)' }} />
          <div style={{ width: 35, height: 2, background: 'rgba(191,0,255,0.4)' }} />
        </div>
        <div style={{ width: 2, height: 35, background: 'rgba(191,0,255,0.4)', marginLeft: 'auto' }} />
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(191,0,255,0.3)', textAlign: 'right', marginTop: 8 }}>
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </div>
      <motion.div
        style={{ position: 'absolute', bottom: 58, right: 15, fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(0,240,255,0.2)', letterSpacing: 1, pointerEvents: 'none', zIndex: 0, display: 'flex', alignItems: 'center', gap: 6 }}
        animate={{ opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <motion.div
          style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88' }}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        SYS_STATUS: ONLINE | MERN_STACK
      </motion.div>
      <motion.div
        style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: 'rgba(0,240,255,0.2)', letterSpacing: 2, pointerEvents: 'none', zIndex: 0 }}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        PORTFOLIO DESKTOP ENVIRONMENT
      </motion.div>
    </>
  );
}

function FloatingBadges() {
  const badges = useMemo(() => ([
    { label: 'React', color: '#61dafb', x: '78%', y: '75%' },
    { label: 'Node', color: '#68a063', x: '88%', y: '18%' },
    { label: 'MongoDB', color: '#4db33d', x: '12%', y: '82%' },
    { label: 'Express', color: '#888', x: '35%', y: '88%' },
  ]), []);

  return (
    <>
      {badges.map((badge, index) => (
        <motion.div
          key={badge.label}
          style={{ position: 'absolute', left: badge.x, top: badge.y, fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: badge.color, opacity: 0.2, letterSpacing: 1, border: `1px solid ${badge.color}33`, padding: '3px 8px', borderRadius: 4, pointerEvents: 'none', zIndex: 0 }}
          animate={{ y: [-8, 8, -8], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.8 }}
        >
          {'<'}{badge.label}{' />'}
        </motion.div>
      ))}
    </>
  );
}

function AppLoadingSkeleton({ title }) {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '12px',
        color: '#666688',
        marginBottom: '18px',
        letterSpacing: '1px',
      }}>
        LOADING {title.toUpperCase()}
      </div>
      <div style={{ display: 'grid', gap: 14 }}>
        {[140, 96, 120, 84].map((height, index) => (
          <motion.div
            key={height + index}
            animate={{ opacity: [0.45, 0.85, 0.45] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.12 }}
            style={{
              height,
              borderRadius: 18,
              background: 'linear-gradient(90deg, rgba(17,17,40,0.9), rgba(0,240,255,0.08), rgba(17,17,40,0.9))',
              border: '1px solid rgba(42,42,74,0.45)',
              boxShadow: '0 0 28px rgba(0,240,255,0.08)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MobileClockWidget({ mode }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (mode === 'desktop') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      style={{
        position: 'absolute',
        top: mode === 'tablet' ? 26 : 22,
        left: 0,
        right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <div
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: mode === 'tablet' ? 54 : 44,
          fontWeight: 900,
          color: 'rgba(224,224,255,0.85)',
          lineHeight: 1,
          marginBottom: 2,
          textShadow: '0 0 30px rgba(0,240,255,0.15)',
        }}
      >
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
      </div>
      <div
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: mode === 'tablet' ? 15 : 13,
          color: 'rgba(224,224,255,0.35)',
          letterSpacing: 0.5,
        }}
      >
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </motion.div>
  );
}

export default function Desktop() {
  const {
    windows,
    openWindow,
    showContextMenu,
    hideContextMenu,
    contextMenu,
    startMenuOpen,
    toggleStartMenu,
  } = useWindows();
  const mode = useResponsive();
  const iconStorageKey = useMemo(() => getStorageKey(mode), [mode]);
  const [iconPositions, setIconPositions] = useState(() => getIconPositions(mode));
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [uiSettings, setUiSettings] = useState(() => loadUiSettings());
  const [dataLoading, setDataLoading] = useState(true);
  const [data, setData] = useState({
    profile: fallbackProfile,
    skills: fallbackSkills,
    projects: fallbackProjects,
    experience: fallbackExperience,
    education: fallbackEducation,
    achievements: fallbackAchievements,
  });

  const activeTheme = THEME_PRESETS[uiSettings.theme] || THEME_PRESETS.dark;

  useEffect(() => {
    setIconPositions(getIconPositions(mode));
  }, [mode]);

  useEffect(() => {
    const nextSettings = { ...DEFAULT_UI_SETTINGS, ...uiSettings };
    localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
    applyThemeVariables(nextSettings.theme);
  }, [uiSettings]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, skills, projects, experience, education, achievements] = await Promise.allSettled([
          API.get('/profile'),
          API.get('/skills'),
          API.get('/projects'),
          API.get('/experience'),
          API.get('/education'),
          API.get('/achievements'),
        ]);

        setData({
          profile: normalizeProfile(profile.status === 'fulfilled' ? profile.value.data : fallbackProfile),
          skills: skills.status === 'fulfilled' ? skills.value.data : fallbackSkills,
          projects: projects.status === 'fulfilled' ? projects.value.data : fallbackProjects,
          experience: experience.status === 'fulfilled' ? experience.value.data : fallbackExperience,
          education: normalizeEducationList(education.status === 'fulfilled' ? education.value.data : fallbackEducation),
          achievements: achievements.status === 'fulfilled' && Array.isArray(achievements.value.data) ? achievements.value.data : fallbackAchievements,
        });
      } catch {
        // Keep fallback data when API calls fail.
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenApp = useCallback((app) => {
    if (!app) {
      return;
    }
    openWindow(app.id, app.title, app.icon, app.id);
  }, [openWindow]);

  const handleUpdateSettings = useCallback((patch) => {
    setUiSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const mobileDockItems = useMemo(() => {
    const aboutApp = desktopApps.find((app) => app.id === 'about');
    const terminalApp = desktopApps.find((app) => app.id === 'terminal');

    return [
      {
        id: 'dock-terminal',
        label: 'Terminal',
        icon: terminalApp?.icon || '💻',
        onClick: () => handleOpenApp(terminalApp),
      },
      {
        id: 'dock-about',
        label: 'About',
        icon: aboutApp?.icon || '👤',
        onClick: () => handleOpenApp(aboutApp),
      },
      {
        id: 'dock-voice',
        label: 'Assistant',
        icon: '🎙️',
        onClick: () => setVoiceAssistantOpen((prev) => !prev),
      },
    ];
  }, [handleOpenApp]);

  const mobileGridApps = useMemo(
    () => desktopApps.filter((app) => app.id !== 'terminal'),
    []
  );

  const shellBackground = useMemo(() => {
    const fallbackBackground = uiSettings.theme === 'light'
      ? 'radial-gradient(ellipse at 20% 30%, rgba(29,78,216,0.14) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(67,56,202,0.10) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(249,115,22,0.08) 0%, transparent 40%), rgba(238,244,255,0.70)'
      : 'radial-gradient(ellipse at 20% 30%, rgba(0,240,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(191,0,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(255,0,128,0.04) 0%, transparent 40%), rgba(10,10,26,0.60)';

    if (!uiSettings.wallpaper) {
      return fallbackBackground;
    }

    const overlay = uiSettings.theme === 'light'
      ? 'linear-gradient(rgba(238,244,255,0.36), rgba(238,244,255,0.46))'
      : 'linear-gradient(rgba(10,10,26,0.34), rgba(10,10,26,0.54))';

    return `${overlay}, url(${uiSettings.wallpaper}) center / cover no-repeat`;
  }, [uiSettings.theme, uiSettings.wallpaper]);

  const getAppComponent = (appId) => {
    if (dataLoading && !['inspect', 'terminal', 'settings', 'sysinfo'].includes(appId)) {
      const app = desktopApps.find((item) => item.id === appId);
      return <AppLoadingSkeleton title={app?.title || appId} />;
    }

    switch (appId) {
      case 'about':
        return (
          <AboutApp
            profile={data.profile}
            experience={data.experience}
            stats={{
              projects: data.projects.length > 0 ? `${data.projects.length}+` : '2+',
              technologies: data.skills.length > 0 ? `${data.skills.length}+` : '10+',
            }}
          />
        );
      case 'skills':
        return <SkillsApp skills={data.skills} />;
      case 'projects':
        return <ProjectsApp projects={data.projects} />;
      case 'experience':
        return <ExperienceApp experience={data.experience} />;
      case 'education':
        return <EducationApp education={data.education} />;
      case 'terminal':
        return <TerminalApp data={data} />;
      case 'contact':
        return <ContactApp profile={data.profile} />;
      case 'inspect':
        return <InspectApp />;
      case 'sysinfo':
        return <SystemInfoApp profile={data.profile} />;
      case 'resume':
        return <ResumeApp profile={data.profile} skills={data.skills} experience={data.experience} education={data.education} projects={data.projects} achievements={data.achievements} />;
      case 'achievements':
        return <AchievementsApp achievements={data.achievements} />;
      case 'settings':
        return <SettingsApp settings={uiSettings} onUpdateSettings={handleUpdateSettings} mode={mode} />;
      default:
        return null;
    }
  };

  const handleDesktopClick = () => {
    hideContextMenu();
    if (startMenuOpen) {
      toggleStartMenu();
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: shellBackground,
      }}
      onClick={handleDesktopClick}
      onContextMenu={mode === 'desktop' ? showContextMenu : (event) => event.preventDefault()}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: uiSettings.theme === 'light'
            ? 'linear-gradient(rgba(29,78,216,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(29,78,216,0.03) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,240,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.012) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: activeTheme.shellOverlay,
        }}
      />

      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>

      <FloatingParticles mode={mode} />
      <NeonLines />
      {mode === 'desktop' && <FloatingBadges />}
      <WelcomeWidget mode={mode} />
      <HUDOverlay mode={mode} />

      <MobileClockWidget mode={mode} />

      {mode === 'desktop' ? (
        <DesktopGrid apps={desktopApps} onOpenApp={handleOpenApp} gridPreset={uiSettings.desktopGridPreset} />
      ) : (
        <MobileHomeGrid
          apps={mobileGridApps}
          mode={mode}
          onOpenApp={handleOpenApp}
          storageKey={`${iconStorageKey}:grid`}
          gridPreset={uiSettings.mobileGridPreset}
        />
      )}

      {windows.map((win) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          icon={win.icon}
          zIndex={win.zIndex}
          minimized={win.minimized}
          maximized={win.maximized}
          position={win.position}
        >
          {getAppComponent(win.id)}
        </Window>
      ))}

      {startMenuOpen && <StartMenu apps={desktopApps} onOpenApp={handleOpenApp} />}
      {mode === 'desktop' && contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} profile={data.profile} />}

      {mode === 'desktop' && <CustomCursor />}
      <Notifications />
      <VoiceAssistant
        data={data}
        mode={mode}
        open={mode === 'desktop' ? undefined : voiceAssistantOpen}
        onToggle={mode === 'desktop' ? undefined : setVoiceAssistantOpen}
        showLauncher={mode === 'desktop'}
      />
      {mode === 'desktop' && <KeyboardShortcuts />}
      {mode === 'desktop' && <Taskbar apps={desktopApps} />}
      {mode !== 'desktop' && <MobileDock items={mobileDockItems} />}
    </div>
  );
}
