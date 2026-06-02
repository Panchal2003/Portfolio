import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/index';
import { LINKEDIN_URL, normalizeProfile } from '../utils/portfolioData';
import {
  HiUser, HiCode, HiCollection, HiBriefcase, HiAcademicCap,
  HiStar, HiLogout, HiPlus, HiPencil, HiTrash, HiSave, HiArrowLeft,
  HiChevronDown, HiX,
} from 'react-icons/hi';

// ─── Admin Window Context ───
const AdminWinCtx = createContext();
const useAdminWin = () => useContext(AdminWinCtx);

function AdminWinProvider({ children }) {
  const [windows, setWindows] = useState([]);
  const [nextZ, setNextZ] = useState(100);

  const openWin = useCallback((id, title, icon) => {
    setWindows(prev => {
      const exists = prev.find(w => w.id === id);
      if (exists) return prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZ + 1 } : w);
      const count = prev.length;
      const offset = (count % 5) * 30;
      return [...prev, { id, title, icon, minimized: false, maximized: false, zIndex: nextZ + 1, pos: { x: 300 + offset, y: 60 + offset } }];
    });
    setNextZ(p => p + 1);
  }, [nextZ]);

  const closeWin = useCallback((id) => setWindows(p => p.filter(w => w.id !== id)), []);
  const minimizeWin = useCallback((id) => setWindows(p => p.map(w => w.id === id ? { ...w, minimized: true } : w)), []);
  const maximizeWin = useCallback((id) => setWindows(p => p.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w)), []);
  const focusWin = useCallback((id) => {
    setWindows(p => p.map(w => w.id === id ? { ...w, zIndex: nextZ + 1, minimized: false } : w));
    setNextZ(p => p + 1);
  }, [nextZ]);
  const updatePos = useCallback((id, pos) => setWindows(p => p.map(w => w.id === id ? { ...w, pos } : w)), []);

  return (
    <AdminWinCtx.Provider value={{ windows, openWin, closeWin, minimizeWin, maximizeWin, focusWin, updatePos }}>
      {children}
    </AdminWinCtx.Provider>
  );
}

// ─── Admin Window ───
function AdminWindow({ id, title, icon, zIndex, minimized, maximized, pos, children }) {
  const { closeWin, minimizeWin, maximizeWin, focusWin, updatePos } = useAdminWin();
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => updatePos(id, { x: Math.max(0, e.clientX - offset.x), y: Math.max(44, e.clientY - offset.y) });
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [dragging, offset, id, updatePos]);

  if (minimized) return null;

  const isFullScreen = maximized || isMobile;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={() => focusWin(id)}
      style={{
        position: isFullScreen ? 'fixed' : 'absolute',
        left: isFullScreen ? 0 : pos.x,
        top: isFullScreen ? 44 : pos.y,
        width: isFullScreen ? '100vw' : 'min(920px, calc(100vw - 40px))',
        height: isFullScreen ? 'calc(100vh - 92px)' : 'min(640px, calc(100vh - 120px))',
        zIndex,
        background: 'rgba(10, 10, 30, 0.98)',
        backdropFilter: 'blur(25px)',
        border: isFullScreen ? 'none' : '1px solid rgba(0,240,255,0.15)',
        borderRadius: isFullScreen ? 0 : 16,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: isFullScreen ? 'none' : '0 0 60px rgba(0,240,255,0.15), 0 25px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={(e) => {
          if (e.target.closest('.wctrl')) return;
          setDragging(true);
          setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
          focusWin(id);
        }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px', minHeight: 48,
          background: 'linear-gradient(90deg, rgba(0,240,255,0.08) 0%, rgba(191,0,255,0.08) 100%)',
          borderBottom: '1px solid rgba(0,240,255,0.1)',
          cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.span
            style={{ fontSize: 20 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {icon}
          </motion.span>
          <span style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: '#00f0ff',
            fontWeight: 700, letterSpacing: 1.5,
            textShadow: '0 0 10px rgba(0,240,255,0.3)',
          }}>{title}</span>
        </div>
        <div className="wctrl" style={{ display: 'flex', gap: 8 }}>
          <motion.button
            onClick={() => minimizeWin(id)}
            style={winBtn('#ffaa00')}
            title="Minimize"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <motion.button
            onClick={() => maximizeWin(id)}
            style={winBtn('#00ff88')}
            title={maximized ? 'Restore' : 'Maximize'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <motion.button
            onClick={() => closeWin(id)}
            style={winBtn('#ff3366')}
            title="Close"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        </div>
      </div>

      {/* Content */}
      <motion.div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: isMobile ? '16px 14px 24px' : '24px 22px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,240,255,0.02), transparent 60%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const winBtn = (bg) => ({
  width: 14, height: 14, borderRadius: '50%', background: bg, border: 'none',
  cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
});

// ─── Form Field ───
function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  textarea,
  placeholder,
  checkbox,
  checkboxLabel,
  accept,
  helpText,
}) {
  if (checkbox) {
    return (
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
          <input
            type="checkbox"
            name={name}
            checked={value === true || value === 'true'}
            onChange={(e) => onChange({ target: { name, value: e.target.checked } })}
            style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
          />
          <span style={{
            position: 'absolute', inset: 0,
            background: value ? 'linear-gradient(135deg, #00f0ff, #bf00ff)' : '#1a1a3e',
            borderRadius: 24, transition: 'all 0.3s',
            border: `1px solid ${value ? '#00f0ff' : '#2a2a4a'}`,
          }}>
            <span style={{
              position: 'absolute', top: 3, left: value ? 22 : 3,
              width: 16, height: 16, borderRadius: '50%', background: '#fff',
              transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }} />
          </span>
        </label>
        <label style={{
          color: '#8888aa', fontSize: '0.78rem',
          fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase', letterSpacing: 1.5,
          cursor: 'pointer',
        }}>{checkboxLabel || label}</label>
      </div>
    );
  }

  if (type === 'file') {
    return (
      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block', marginBottom: 6, color: '#8888aa', fontSize: '0.78rem',
          fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase', letterSpacing: 1.5,
        }}>{label}</label>
        <input
          type="file"
          name={name}
          accept={accept || 'image/*'}
          onChange={onChange}
          onClick={(e) => {
            e.target.value = null;
          }}
          style={{
            ...fieldStyle,
            padding: '10px 12px',
            cursor: 'pointer',
          }}
        />
        {helpText && (
          <div style={{
            marginTop: 6,
            color: '#666688',
            fontSize: '0.72rem',
            fontFamily: "'Rajdhani', sans-serif",
          }}>
            {helpText}
          </div>
        )}
        {value && (
          <div style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 10,
            border: '1px solid #1a1a3e',
            background: '#080818',
          }}>
            <img
              src={value}
              alt={`${label} preview`}
              style={{
                display: 'block',
                width: '100%',
                maxHeight: 220,
                objectFit: 'contain',
                borderRadius: 8,
                background: '#050510',
              }}
            />
            <button
              type="button"
              onClick={() => onChange({ target: { name, value: '' } })}
              style={{
                marginTop: 10,
                padding: '8px 12px',
                background: 'transparent',
                border: '1px solid #ff336644',
                borderRadius: 8,
                color: '#ff3366',
                cursor: 'pointer',
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 600,
              }}
            >
              Remove image
            </button>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', marginBottom: 6, color: '#8888aa', fontSize: '0.78rem',
        fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase', letterSpacing: 1.5,
      }}>{label}</label>
      {textarea ? (
        <textarea name={name} value={value || ''} onChange={onChange} rows={4}
          placeholder={placeholder}
          style={fieldStyle}
          onFocus={focusField} onBlur={blurField}
        />
      ) : (
        <input type={type} name={name} value={value || ''} onChange={onChange}
          placeholder={placeholder}
          style={fieldStyle}
          onFocus={focusField} onBlur={blurField}
        />
      )}
    </div>
  );
}

const fieldStyle = {
  width: '100%', padding: '11px 14px',
  background: '#080818', border: '1px solid #2a2a4a', borderRadius: 8,
  color: '#e0e0ff', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.95rem',
  outline: 'none', transition: 'border 0.25s, box-shadow 0.25s', resize: 'vertical',
};
const focusField = (e) => {
  e.target.style.borderColor = '#00f0ff';
  e.target.style.boxShadow = '0 0 12px rgba(0,240,255,0.12), inset 0 0 4px rgba(0,240,255,0.05)';
};
const blurField = (e) => {
  e.target.style.borderColor = '#2a2a4a';
  e.target.style.boxShadow = 'none';
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

function loadImageFromSource(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to process the selected image.'));
    image.src = src;
  });
}

async function prepareImageUpload(file) {
  if (!file) {
    return '';
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file.');
  }

  if (file.size > 4 * 1024 * 1024) {
    throw new Error('Please upload an image smaller than 4 MB.');
  }

  const source = await readFileAsDataUrl(file);
  const image = await loadImageFromSource(source);
  const maxWidth = 1600;
  const maxHeight = 1600;
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Image upload is not supported in this browser.');
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/webp', 0.88);
}

// ─── Save Button ───
const SaveBtn = ({ onClick, label = 'Save', icon }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ boxShadow: '0 0 25px rgba(0,240,255,0.35)', y: -1 }}
    whileTap={{ scale: 0.97 }}
    style={{
      fontFamily: "'Orbitron', sans-serif", fontSize: '0.72rem', fontWeight: 700,
      padding: '11px 24px', background: 'linear-gradient(135deg, #00f0ff, #bf00ff)',
      color: '#0a0a1a', border: 'none', borderRadius: 8, cursor: 'pointer',
      textTransform: 'uppercase', letterSpacing: 1.5,
      display: 'flex', alignItems: 'center', gap: 7, transition: 'box-shadow 0.3s',
    }}
  >
    {icon} {label}
  </motion.button>
);

// ─── Profile Form ───
function ProfileForm() {
  const [p, setP] = useState({
    name: '', title: '', bio: '', email: '', phone: '', location: '', github: '', linkedin: LINKEDIN_URL,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/profile').then(({ data }) => {
      const profile = normalizeProfile(data || {});
      setP(prev => ({ ...prev, ...profile, github: profile.socialLinks?.github || '', linkedin: profile.socialLinks?.linkedin || LINKEDIN_URL }));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const h = (e) => setP({ ...p, [e.target.name]: e.target.value });

  const save = async () => {
    try {
      await API.put('/profile', { ...p, socialLinks: { github: p.github, linkedin: p.linkedin } });
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div style={{ color: '#555', textAlign: 'center', padding: 40 }}>Loading profile...</div>;

  return (
    <div>
      <Field label="Full Name" name="name" value={p.name} onChange={h} placeholder="Your full name" />
      <Field label="Title / Designation" name="title" value={p.title} onChange={h} placeholder="e.g. Software Engineer" />
      <Field label="Bio / Summary" name="bio" value={p.bio} onChange={h} textarea placeholder="Tell about yourself..." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
        <Field label="Email" name="email" value={p.email} onChange={h} type="email" placeholder="email@example.com" />
        <Field label="Phone" name="phone" value={p.phone} onChange={h} placeholder="+91-XXXXX" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
        <Field label="GitHub URL" name="github" value={p.github} onChange={h} placeholder="https://github.com/..." />
        <Field label="LinkedIn URL" name="linkedin" value={p.linkedin} onChange={h} placeholder="https://linkedin.com/in/..." />
      </div>
      <Field label="Location" name="location" value={p.location} onChange={h} placeholder="City, Country" />

      <SaveBtn onClick={save} label="Save Profile" icon={<HiSave size={14} />} />
    </div>
  );
}

// ─── CRUD Section ───
function CrudSection({ endpoint, fields, title, extraFields = [] }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const readItems = useCallback(async () => {
    try {
      const { data } = await API.get(`/${endpoint}`);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }, [endpoint]);

  const load = useCallback(async () => {
    setItems(await readItems());
  }, [readItems]);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const nextItems = await readItems();
      if (active) {
        setItems(nextItems);
      }
    };

    hydrate();

    return () => {
      active = false;
    };
  }, [readItems]);
  const h = async (e) => {
    const { name, type, value, files } = e.target;

    if (type === 'file') {
      const file = files?.[0];

      if (!file) {
        return;
      }

      try {
        const image = await prepareImageUpload(file);
        setForm(prev => ({ ...prev, [name]: image }));
        toast.success('Certificate image added.');
      } catch (error) {
        toast.error(error.message || 'Image upload failed.');
      }

      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    try {
      if (editId) { await API.put(`/${endpoint}/${editId}`, form); toast.success(`${title} updated!`); }
      else { await API.post(`/${endpoint}`, form); toast.success(`${title} added!`); }
      setForm({}); setEditId(null); setShowForm(false); load();
    } catch { toast.error(`Failed to save`); }
  };

 const edit = (item) => {
  setEditId(item._id);

  const d = {};

  if (Array.isArray(fields)) {
    fields.forEach(f => {
      d[f.name] = item[f.name] || '';
    });
  }

  if (Array.isArray(extraFields)) {
    extraFields.forEach(f => {
      d[f.name] = item[f.name] || false;
    });
  }

  setForm(d);
  setShowForm(true);
};

  const del = async (id) => {
    if (!confirm(`Delete this ${title.toLowerCase()}?`)) return;
    try { await API.delete(`/${endpoint}/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const cancel = () => { setEditId(null); setForm({}); setShowForm(false); };

  // Get badges for an item based on extra fields
const getBadges = (item) => {
  const badges = [];

  if (Array.isArray(extraFields)) {
    extraFields.forEach(f => {
      if (f.badge && (item[f.name] === true || item[f.name] === 'true')) {
        badges.push({
          label: f.badgeLabel || f.name,
          color: f.badgeColor || '#00f0ff'
        });
      }
    });
  }

  return badges;
};

  return (
    <div>
      {/* Add/Edit Form Toggle */}
      {!showForm ? (
        <motion.button
          onClick={() => setShowForm(true)}
          whileHover={{ boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
            padding: '10px 20px', background: 'rgba(0,240,255,0.06)',
            border: '1px dashed rgba(0,240,255,0.3)', borderRadius: 10,
            color: '#00f0ff', fontFamily: "'Orbitron', sans-serif", fontSize: '0.72rem',
            fontWeight: 600, cursor: 'pointer', letterSpacing: 1, width: '100%',
            justifyContent: 'center',
          }}
        >
          <HiPlus size={16} /> ADD NEW {title.toUpperCase()}
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            marginBottom: 20, padding: 20,
            background: 'rgba(0,240,255,0.02)', border: '1px solid #1a1a3e', borderRadius: 12,
            position: 'relative',
          }}
        >
          <button onClick={cancel} style={{
            position: 'absolute', top: 12, right: 12, background: 'none', border: 'none',
            color: '#666', cursor: 'pointer', fontSize: 18,
          }}><HiX /></button>

          <div style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: '0.8rem', color: '#00f0ff',
            marginBottom: 16, letterSpacing: 1,
          }}>
            {editId ? `✏️ EDIT ${title.toUpperCase()}` : `➕ NEW ${title.toUpperCase()}`}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {fields.map(f => (
              <div key={f.name} style={{ gridColumn: f.textarea || f.type === 'file' ? '1 / -1' : 'auto' }}>
                <Field {...f} value={form[f.name]} onChange={h} />
              </div>
            ))}
          </div>
          
          {/* Extra fields like checkboxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: 16 }}>
            {extraFields.map(f => (
              <Field key={f.name} {...f} value={form[f.name]} onChange={h} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <SaveBtn onClick={submit} label={editId ? 'Update' : 'Add'} icon={editId ? <HiSave size={14} /> : <HiPlus size={14} />} />
            {editId && (
              <button onClick={cancel} style={{
                padding: '10px 20px', background: '#222', border: '1px solid #333',
                borderRadius: 8, color: '#888', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.9rem', fontWeight: 600,
              }}>Cancel</button>
            )}
          </div>
        </motion.div>
      )}

      {/* Items List */}
      <div style={{
        fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#555',
        marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase',
      }}>
        {title}s ({items.length})
      </div>

      {items.length === 0 && (
        <div style={{ color: '#444', textAlign: 'center', padding: '30px 0', fontStyle: 'italic' }}>
          No {title.toLowerCase()}s added yet
        </div>
      )}

      {items.map((item, i) => {
        const badges = getBadges(item);
        return (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
            padding: '14px 18px', background: '#0d0d22',
            border: '1px solid #1a1a3e', borderRadius: 10, marginBottom: 8,
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2a2a5a'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1a1a3e'}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                {item[fields[0]?.name] || 'Untitled'}
              </span>
              {badges.map((badge, idx) => (
                <span key={idx} style={{
                  padding: '2px 8px', fontSize: '0.65rem', fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700, borderRadius: 4,
                  background: badge.isOrder ? 'rgba(255,149,0,0.15)' : `${badge.color}22`,
                  color: badge.color, border: `1px solid ${badge.color}44`,
                  letterSpacing: 0.5,
                }}>
                  {badge.label}
                </span>
              ))}
            </div>
            {fields[1] && (
              <div style={{
                color: '#7777aa', fontSize: '0.82rem', marginTop: 3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item[fields[1].name]}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 'auto' }}>
            <motion.button
              onClick={() => edit(item)}
              whileHover={{ borderColor: '#00f0ff', background: 'rgba(0,240,255,0.08)' }}
              style={actionBtn('#00f0ff')}
              title="Edit"
            ><HiPencil /></motion.button>
            <motion.button
              onClick={() => del(item._id)}
              whileHover={{ borderColor: '#ff3366', background: 'rgba(255,51,102,0.08)' }}
              style={actionBtn('#ff3366')}
              title="Delete"
            ><HiTrash /></motion.button>
          </div>
        </motion.div>
      );
      })}
    </div>
  );
}

const actionBtn = (c) => ({
  background: 'transparent', border: `1px solid ${c}44`, color: c,
  width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s',
});

// ─── Admin Apps Config ───
const adminApps = [
  { id: 'profile', title: 'Profile', icon: '👤', desc: 'Edit personal info' },
  { id: 'skills', title: 'Skills', icon: '⚡', desc: 'Manage tech stack' },
  { id: 'projects', title: 'Projects', icon: '🚀', desc: 'Add/edit projects' },
  { id: 'experience', title: 'Experience', icon: '💼', desc: 'Work history' },
  { id: 'education', title: 'Education', icon: '🎓', desc: 'Degrees & certs' },
  { id: 'achievements', title: 'Achievements', icon: '🏆', desc: 'Awards & milestones' },
  { id: 'contact', title: 'Contacts', icon: '📬', desc: 'View messages' },
  { id: 'settings', title: 'Settings', icon: '⚙️', desc: 'Site configuration' },
  { id: 'analytics', title: 'Analytics', icon: '📊', desc: 'View statistics' },
];

// ─── Admin Desktop ───
function AdminDesktop() {
  const { windows, openWin, focusWin } = useAdminWin();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out');
    navigate('/admin');
  };

  const getContent = (id) => {
    switch (id) {
      case 'profile': return <ProfileForm />;
      case 'skills': return <CrudSection endpoint="skills" title="Skill" fields={[{ name: 'name', label: 'Skill Name' }, { name: 'category', label: 'Category (Frontend / Backend / Database / Languages / Auth & Security / DevOps / Tools)' }, { name: 'proficiency', label: 'Proficiency (0-100)' }]} />;
      case 'projects': return (
        <CrudSection 
          endpoint="projects" 
          title="Project" 
          fields={[
            { name: 'title', label: 'Project Title' }, 
            { name: 'description', label: 'Description', textarea: true }, 
            { name: 'techStack', label: 'Tech Stack (comma separated)' }, 
            { name: 'liveUrl', label: 'Live URL' }, 
            { name: 'githubUrl', label: 'GitHub URL' }
          ]}
          extraFields={[
            { name: 'order', label: 'Position/Order', type: 'number', placeholder: 'e.g. 1, 2, 3...' },
            { name: 'featured', label: 'Featured', checkbox: true, checkboxLabel: 'Mark as Featured Project', badge: true, badgeLabel: '⭐ FEATURED', badgeColor: '#bf00ff' }
          ]}
        />
      );
      case 'experience': return (
        <CrudSection 
          endpoint="experience" 
          title="Experience" 
          fields={[
            { name: 'company', label: 'Company Name' }, 
            { name: 'role', label: 'Your Role' }, 
            { name: 'duration', label: 'Duration (e.g. Jan 2026 - Present)' }, 
            { name: 'description', label: 'Description (one point per line)', textarea: true }
          ]}
          extraFields={[
            { name: 'order', label: 'Position/Order', type: 'number', placeholder: 'e.g. 1, 2, 3...' },
            { name: 'current', label: 'Currently Working', checkbox: true, checkboxLabel: 'I currently work here (Present)', badge: true, badgeLabel: '💼 CURRENT', badgeColor: '#00ff88' }
          ]}
        />
      );
      case 'education': return <CrudSection endpoint="education" title="Education" fields={[{ name: 'degree', label: 'Degree' }, { name: 'institution', label: 'Institution' }, { name: 'year', label: 'Year' }]} />;
      case 'achievements': return (
        <CrudSection 
          endpoint="achievements" 
          title="Certificate" 
          fields={[
            { name: 'title', label: 'Title' }, 
            { name: 'description', label: 'Description', textarea: true }, 
            { name: 'date', label: 'Date' },
            { name: 'image', label: 'Certificate Image', type: 'file', accept: 'image/*', helpText: 'Upload certificate image. It will be resized automatically.' },
            { name: 'link', label: 'Certificate Link (optional)', placeholder: 'https://...' }
          ]}
          extraFields={[
            { name: 'order', label: 'Position/Order', type: 'number', placeholder: 'e.g. 1, 2, 3...' }
          ]}
        />
      );
      case 'contact': return (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00f0ff', marginBottom: 8 }}>Contact Messages</h3>
          <p style={{ color: '#8888aa' }}>Contact form submissions will appear here. Connect this to your backend to receive messages.</p>
          <div style={{ marginTop: 20, padding: 20, background: 'rgba(0,240,255,0.05)', borderRadius: 12, border: '1px dashed rgba(0,240,255,0.2)' }}>
            <p style={{ color: '#666', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.85rem' }}>
              No messages yet. Messages from the contact form will be displayed here.
            </p>
          </div>
        </div>
      );
      case 'settings': return (
        <div>
          <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00f0ff', marginBottom: 16, fontSize: '1rem' }}>Site Settings</h3>
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Site Title" name="siteTitle" value="Sachin Kumar Panchal" placeholder="Your name" />
            <Field label="Site Description" name="siteDesc" value="Software Engineer | Full Stack MERN Developer" textarea placeholder="Brief description" />
            <Field label="Meta Keywords" name="keywords" value="portfolio, developer, react, node.js" placeholder="Comma separated keywords" />
            <SaveBtn onClick={() => toast.success('Settings saved!')} label="Save Settings" icon={<HiSave size={14} />} />
          </div>
        </div>
      );
      case 'analytics': return (
        <div>
          <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00f0ff', marginBottom: 16, fontSize: '1rem' }}>Analytics Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Views', value: '1,234', icon: '👁️', color: '#00f0ff' },
              { label: 'Projects', value: '4', icon: '🚀', color: '#bf00ff' },
              { label: 'Skills', value: '20', icon: '⚡', color: '#ff0080' },
              { label: 'Experience', value: '2', icon: '💼', color: '#00ff88' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '20px 18px', background: 'rgba(12,12,34,0.6)',
                  border: '1px solid rgba(42,42,74,0.3)', borderRadius: 14,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: stat.color, marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#666', letterSpacing: 1 }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ padding: 20, background: 'rgba(0,240,255,0.03)', borderRadius: 12, border: '1px solid rgba(0,240,255,0.1)' }}>
            <p style={{ color: '#8888aa', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem' }}>
              📊 Analytics tracking can be integrated with Google Analytics, Vercel Analytics, or custom tracking solutions.
            </p>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 25% 35%, rgba(0,240,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 75% 65%, rgba(191,0,255,0.04) 0%, transparent 50%), #080818',
    }}>
      {/* Subtle grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,240,255,0.008) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.008) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {/* ─── Top Bar ─── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 44, zIndex: 9990,
        background: 'rgba(8,8,24,0.96)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1a1a3a',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px',
        flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, color: '#00f0ff', fontWeight: 800, letterSpacing: 2 }}>⬡ ADMIN</span>
          <span style={{ width: 1, height: 18, background: '#2a2a4a' }} />
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#444', letterSpacing: 1 }}>SACHIN_OS // CONTROL PANEL</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ borderColor: '#00f0ff', color: '#00f0ff' }}
            style={{
              background: 'none', border: '1px solid #2a2a4a', color: '#777',
              padding: '5px 14px', borderRadius: 6, fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              transition: 'all 0.2s',
            }}
          >
            <HiArrowLeft size={14} /> Portfolio
          </motion.button>
          <motion.button
            onClick={handleLogout}
            whileHover={{ background: 'rgba(255,51,102,0.1)' }}
            style={{
              background: 'none', border: '1px solid #ff336644', color: '#ff3366',
              padding: '5px 14px', borderRadius: 6, fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              transition: 'all 0.2s',
            }}
          >
            <HiLogout size={14} /> Logout
          </motion.button>
        </div>
      </div>

      {/* ─── Desktop Icons ─── */}
      <div style={{
        position: 'absolute', top: 64, left: 16, right: 16,
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: 16, zIndex: 2,
        width: 'min(600px, calc(100vw - 32px))', margin: '0 auto',
      }}>
        {adminApps.map((app, i) => {
          const glowColors = ['#00f0ff', '#bf00ff', '#ff0080', '#00ff88', '#ffaa00', '#00aaff'];
          const glow = glowColors[i % glowColors.length];
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
              onClick={() => openWin(app.id, app.title, app.icon)}
              whileHover={{
                scale: 1.08,
                y: -5,
                boxShadow: `0 0 30px ${glow}40, 0 10px 40px rgba(0,0,0,0.3)`,
                borderColor: `${glow}60`
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                minHeight: 140, padding: '22px 14px', borderRadius: 18,
                background: 'linear-gradient(180deg, rgba(12,12,34,0.8) 0%, rgba(8,8,24,0.9) 100%)',
                border: '1px solid rgba(42,42,74,0.3)',
                backdropFilter: 'blur(12px)', cursor: 'pointer',
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
            >
              {/* Glow effect on hover */}
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at 50% 0%, ${glow}15, transparent 70%)`,
                  opacity: 0,
                  transition: 'opacity 0.3s',
                }}
                whileHover={{ opacity: 1 }}
              />
              
              {/* Icon with glow */}
              <motion.span
                style={{
                  fontSize: 42,
                  position: 'relative', zIndex: 1,
                  filter: `drop-shadow(0 0 8px ${glow}60)`,
                }}
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 2 + (i * 0.3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2
                }}
              >
                {app.icon}
              </motion.span>
              
              {/* Title */}
              <span style={{
                fontSize: 12,
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                color: '#e0e0ff',
                textAlign: 'center',
                letterSpacing: 1,
                position: 'relative', zIndex: 1,
                textShadow: `0 0 10px ${glow}40`,
              }}>
                {app.title}
              </span>
              
              {/* Description */}
              <span style={{
                fontSize: 9,
                fontFamily: "'Share Tech Mono', monospace",
                color: '#666688',
                textAlign: 'center',
                position: 'relative', zIndex: 1,
                letterSpacing: 0.5,
              }}>
                {app.desc}
              </span>
              
              {/* Bottom accent line */}
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40%',
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${glow}, transparent)`,
                  borderRadius: 1,
                }}
                whileHover={{ width: '60%' }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ─── Windows ─── */}
      <AnimatePresence>
        {windows.map(win => (
          <AdminWindow key={win.id} {...win}>{getContent(win.id)}</AdminWindow>
        ))}
      </AnimatePresence>

      {/* ─── Taskbar ─── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 48, zIndex: 9999,
        background: 'rgba(8,8,24,0.96)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid #1a1a3a',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 6,
      }}>
        {/* Admin badge */}
        <div style={{
          padding: '5px 14px', background: 'rgba(0,240,255,0.04)',
          border: '1px solid #1a1a3a', borderRadius: 5,
          fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: '#00f0ff',
          fontWeight: 700, letterSpacing: 1.5, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ⬡ ADMIN
        </div>

        <div style={{ width: 1, height: 24, background: '#1a1a3a', margin: '0 4px' }} />

        {/* Open windows */}
        <div style={{ display: 'flex', gap: 3, flex: 1, overflow: 'auto' }}>
          {windows.map(win => (
            <motion.button
              key={win.id}
              onClick={() => focusWin(win.id)}
              whileHover={{ background: 'rgba(0,240,255,0.08)' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', height: 34,
                background: !win.minimized ? 'rgba(0,240,255,0.08)' : 'transparent',
                borderBottom: !win.minimized ? '2px solid #00f0ff' : '2px solid transparent',
                border: 'none', borderRadius: '5px 5px 0 0',
                color: !win.minimized ? '#00f0ff' : '#555',
                fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 14 }}>{win.icon}</span>
              <span>{win.title}</span>
            </motion.button>
          ))}
        </div>

        <div style={{ width: 1, height: 24, background: '#1a1a3a', margin: '0 4px' }} />

        {/* Clock */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
          color: '#555', textAlign: 'right', lineHeight: 1.4,
        }}>
          <div style={{ color: '#00f0ff', fontWeight: 600 }}>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
          <div>{time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ───
const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/admin');
    document.body.classList.add('admin-page');
    return () => document.body.classList.remove('admin-page');
  }, [navigate]);

  return (
    <AdminWinProvider>
      <AdminDesktop />
    </AdminWinProvider>
  );
};

export default AdminDashboard;
