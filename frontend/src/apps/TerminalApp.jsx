import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HELP_TEXT = [
  { type: 'success', text: 'Available Commands' },
  { type: 'output', text: '' },
  { type: 'info', text: 'help       - Show command list with details and usage examples' },
  { type: 'info', text: 'whoami     - Print short profile summary' },
  { type: 'info', text: 'skills     - List core technical skills with proficiency' },
  { type: 'info', text: 'projects   - Show recent projects and stacks' },
  { type: 'info', text: 'experience - Show work experience timeline' },
  { type: 'info', text: 'education  - Show education details' },
  { type: 'info', text: 'contact    - Show email, phone, and location' },
  { type: 'info', text: 'social     - Show GitHub and LinkedIn links' },
  { type: 'info', text: 'resume     - Explain resume download options' },
  { type: 'info', text: 'certs      - Show certificates section info' },
  { type: 'info', text: 'date       - Show current date and time' },
  { type: 'info', text: 'echo text  - Print text back to terminal' },
  { type: 'info', text: 'clear      - Clear terminal output' },
  { type: 'info', text: 'admin      - Open admin login page' },
  { type: 'output', text: '' },
  { type: 'dim', text: 'Examples:' },
  { type: 'dim', text: '  skills' },
  { type: 'dim', text: '  echo portfolio ready' },
  { type: 'dim', text: '  admin' },
  { type: 'output', text: '' },
];

function getWelcomeLines(isMobile) {
  return [
    { type: 'success', text: 'SACHIN_OS Terminal v2.0' },
    { type: 'output', text: isMobile ? 'Mobile shell ready.' : 'Interactive portfolio shell ready.' },
    { type: 'output', text: "Type 'help' to explore commands." },
    { type: 'output', text: '' },
  ];
}

function getLineColor(type) {
  switch (type) {
    case 'prompt':
      return '#00ff88';
    case 'success':
      return '#00f0ff';
    case 'error':
      return '#ff6262';
    case 'warn':
      return '#ffaa00';
    case 'info':
      return '#d7e5ff';
    case 'dim':
      return '#8489a9';
    default:
      return '#cccccc';
  }
}

export default function TerminalApp({ data = {} }) {
  const { profile = {}, skills = [], projects = [], experience = [], education = [] } = data;
  const isMobile = window.innerWidth <= 480;
  const [lines, setLines] = useState(() => getWelcomeLines(isMobile));
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const promptText = useMemo(
    () => (isMobile ? 'sachin@os' : 'sachin@portfolio:~$'),
    [isMobile]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const processCommand = (cmd) => {
    const trimmed = cmd.trim();
    const parts = trimmed.split(/\s+/);
    const command = (parts[0] || '').toLowerCase();
    const args = parts.slice(1).join(' ');
    const promptLine = { type: 'prompt', text: `${promptText} ${trimmed}` };
    let output = [];

    switch (command) {
      case '':
        return [promptLine];

      case 'help':
        output = HELP_TEXT;
        break;

      case 'whoami':
        output = [
          { type: 'success', text: `${profile.name || 'Sachin Kumar Panchal'}` },
          { type: 'output', text: `${profile.title || 'Software Developer'}` },
          { type: 'output', text: profile.email || 'Email unavailable' },
          { type: 'output', text: profile.phone || 'Phone unavailable' },
          { type: 'output', text: '' },
          ...(profile.bio ? [{ type: 'info', text: profile.bio }] : []),
          { type: 'output', text: '' },
        ];
        break;

      case 'skills':
        output = skills.length === 0
          ? [{ type: 'warn', text: 'No skills data available.' }]
          : [
              { type: 'success', text: `Core skills (${skills.length})` },
              { type: 'output', text: '' },
              ...skills.map((skill) => ({
                type: 'info',
                text: `${skill.name} - ${skill.category || 'General'} - ${skill.proficiency || 0}%`,
              })),
              { type: 'output', text: '' },
            ];
        break;

      case 'projects':
        output = projects.length === 0
          ? [{ type: 'warn', text: 'No project data available.' }]
          : [
              { type: 'success', text: `Projects (${projects.length})` },
              { type: 'output', text: '' },
              ...projects.flatMap((project, index) => [
                { type: 'info', text: `${index + 1}. ${project.title}` },
                { type: 'output', text: project.description || 'No description available.' },
                ...(project.techStack?.length ? [{ type: 'dim', text: `Stack: ${project.techStack.join(', ')}` }] : []),
                { type: 'output', text: '' },
              ]),
            ];
        break;

      case 'experience':
        output = experience.length === 0
          ? [{ type: 'warn', text: 'No experience data available.' }]
          : [
              { type: 'success', text: `Experience (${experience.length})` },
              { type: 'output', text: '' },
              ...experience.flatMap((entry) => [
                { type: 'info', text: `${entry.role}` },
                { type: 'dim', text: `${entry.duration || 'Duration unavailable'}` },
                ...((Array.isArray(entry.description) ? entry.description : []).map((point) => ({
                  type: 'output',
                  text: `- ${point}`,
                }))),
                { type: 'output', text: '' },
              ]),
            ];
        break;

      case 'education':
        output = education.length === 0
          ? [{ type: 'warn', text: 'No education data available.' }]
          : [
              { type: 'success', text: `Education (${education.length})` },
              { type: 'output', text: '' },
              ...education.flatMap((entry) => [
                { type: 'info', text: entry.degree || 'Degree unavailable' },
                { type: 'output', text: `${entry.institution || 'Institution unavailable'} - ${entry.year || 'Year unavailable'}` },
                ...(entry.description ? [{ type: 'dim', text: entry.description }] : []),
                { type: 'output', text: '' },
              ]),
            ];
        break;

      case 'contact':
        output = [
          { type: 'success', text: 'Contact Details' },
          { type: 'output', text: '' },
          { type: 'info', text: `Email: ${profile.email || 'N/A'}` },
          { type: 'info', text: `Phone: ${profile.phone || 'N/A'}` },
          { type: 'info', text: `Location: ${profile.location || 'India'}` },
          { type: 'output', text: '' },
        ];
        break;

      case 'social':
        output = [
          { type: 'success', text: 'Social Links' },
          { type: 'output', text: '' },
          { type: 'info', text: `GitHub: ${profile.socialLinks?.github || 'N/A'}` },
          { type: 'info', text: `LinkedIn: ${profile.socialLinks?.linkedin || 'N/A'}` },
          { type: 'output', text: '' },
        ];
        break;

      case 'resume':
        output = [
          { type: 'success', text: 'Resume App' },
          { type: 'output', text: 'Open the Resume app to preview or download the latest resume PDF.' },
          { type: 'output', text: '' },
        ];
        break;

      case 'certs':
      case 'certificates':
        output = [
          { type: 'success', text: 'Certificates App' },
          { type: 'output', text: 'Open the Certificates app to view uploaded achievements and certificate images.' },
          { type: 'output', text: '' },
        ];
        break;

      case 'date':
        output = [
          { type: 'success', text: new Date().toString() },
          { type: 'output', text: '' },
        ];
        break;

      case 'echo':
        output = [
          { type: 'output', text: args || '' },
          { type: 'output', text: '' },
        ];
        break;

      case 'clear':
        setLines([]);
        return null;

      case 'admin':
        output = [
          { type: 'success', text: 'Opening admin login...' },
          { type: 'output', text: '' },
        ];
        window.setTimeout(() => navigate('/admin'), 700);
        break;

      default:
        output = [
          { type: 'error', text: `Command not found: ${command || '(empty)'}. Type 'help'.` },
          { type: 'output', text: '' },
        ];
    }

    return [promptLine, ...output];
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = processCommand(input);
    if (result !== null) {
      setLines((prev) => [...prev, ...result]);
    }
    if (input.trim()) {
      setHistory((prev) => [input, ...prev]);
    }
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      if (history[nextIndex] !== undefined) {
        setInput(history[nextIndex]);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      setInput(nextIndex === -1 ? '' : history[nextIndex]);
    }
  };

  return (
    <div
      onClick={focusInput}
      style={{
        background: '#000000',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: isMobile ? '12px' : '13px',
        cursor: 'text',
      }}
    >
      <div style={{
        padding: isMobile ? '10px 12px' : '10px 14px',
        background: '#0a0a0a',
        borderBottom: '1px solid #1a1a2a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        color: '#8888aa',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ color: '#00ff88', fontSize: 10 }}>●</span>
          <span style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: isMobile ? 11 : 12,
          }}>
            SACHIN_OS Terminal
          </span>
        </div>
        <span style={{ fontSize: 10, color: '#5e6485' }}>
          {isMobile ? 'mobile-shell' : 'interactive-shell'}
        </span>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: isMobile ? '12px' : '14px',
        }}
      >
        {lines.map((line, index) => (
          <div
            key={`${line.type}-${index}`}
            style={{
              color: getLineColor(line.type),
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              minHeight: line.text === '' ? '14px' : 'auto',
            }}
          >
            {line.text}
          </div>
        ))}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gap: 6,
            color: '#00ff88',
            marginTop: 6,
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>{promptText}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            style={{
              background: '#040404',
              border: '1px solid #1d253a',
              outline: 'none',
              color: '#cccccc',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: isMobile ? '12px' : '13px',
              width: '100%',
              caretColor: '#00ff88',
              padding: '10px 12px',
              borderRadius: 8,
            }}
          />
        </form>
      </div>
    </div>
  );
}

