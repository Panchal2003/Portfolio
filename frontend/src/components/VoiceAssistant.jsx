import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateTotalExperienceMonths, formatMonthsAsExperience } from '../utils/portfolioData';

function buildReply(query, data) {
  const prompt = query.toLowerCase().trim();
  const profile = data.profile || {};
  const skills = data.skills || [];
  const projects = data.projects || [];
  const experience = data.experience || [];
  const education = data.education || [];
  const achievements = data.achievements || [];
  const totalExperience = formatMonthsAsExperience(calculateTotalExperienceMonths(experience));

  const name = profile.name || 'Sachin Kumar Panchal';
  const title = profile.title || 'Software Engineer | Full Stack MERN Developer | Project Lead';
  const bio = profile.bio || '';
  const email = profile.email || 'sachinpanchal080103@gmail.com';
  const phone = profile.phone || '+91-9540805588';
  const location = profile.location || 'India';
  const linkedin = profile.socialLinks?.linkedin || 'https://linkedin.com/in/sachin-panchal';
  const github = profile.socialLinks?.github || 'https://github.com/Panchal2003';

  // Greeting patterns
  if (/^(hi|hello|hey|howdy|greetings|good\s*(morning|afternoon|evening))/.test(prompt)) {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${timeGreeting}! I'm ${name}'s personal AI assistant. I have complete knowledge about his professional background, skills, projects, and experience. What would you like to know?`;
  }

  // Name / About / Introduction
  if (/^(what('s| is)\s+your\s+name|who\s+are\s+you|tell\s+me\s+about\s+yourself|introduce\s+yourself|about\s+you)/.test(prompt) || /^about$/.test(prompt)) {
    return `I'm the virtual assistant for ${name}. ${name} is ${title} based in ${location}. ${bio}`;
  }

  if (/^(who\s+is\s+sachin|tell\s+me\s+about\s+sachin|about\s+sachin|sachin\s+kaun\s+hai|sachin\s+ke\s+baare\s+mein)/.test(prompt)) {
    return `${name} is ${title} based in ${location}. ${bio} He specializes in full-stack web development with the MERN stack and has experience in Laravel.`;
  }

  // Contact / Phone / Number / Email
  if (/phone|number|call|mobile|contact\s+number|whatsapp|text\s+him|reach\s+by\s+phone/.test(prompt)) {
    return `You can reach ${name} directly at ${phone}. For professional inquiries, you can also email him at ${email} or connect on LinkedIn at ${linkedin}.`;
  }

  if (/email|mail|e-mail|send\s+email|contact\s+via\s+email/.test(prompt)) {
    return `${name}'s email address is ${email}. You can reach out to him there for professional opportunities, collaborations, or any inquiries.`;
  }

  if (/linkedin|linked\s+in|professional\s+network|connect\s+on\s+linkedin/.test(prompt)) {
    return `You can find ${name} on LinkedIn at ${linkedin}. Feel free to connect with him for professional networking and career opportunities.`;
  }

  if (/github|git\s+hub|code\s+repository|projects\s+on\s+github|source\s+code/.test(prompt)) {
    return `${name}'s GitHub profile is ${github}. You can explore his code repositories, open-source contributions, and project source code there.`;
  }

  if (/contact|reach\s+out|get\s+in\s+touch|connect\s+with|message\s+him|how\s+to\s+contact/.test(prompt)) {
    return `You can contact ${name} through multiple channels: Phone: ${phone}, Email: ${email}, LinkedIn: ${linkedin}, GitHub: ${github}. He's based in ${location} and open to professional opportunities.`;
  }

  // Skills / Tech Stack
  if (/skill|tech|stack|technology|technologies|programming\s+language|framework|tool|expertise|proficient|knows|work\s+with|uses/.test(prompt)) {
    if (skills.length === 0) return 'Skills data is currently unavailable. Please check back later.';

    const categories = {};
    skills.forEach((skill) => {
      const cat = skill.category || 'Other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(skill.name);
    });

    const categorySummary = Object.entries(categories)
      .map(([cat, items]) => `${cat}: ${items.join(', ')}`)
      .join('; ');

    const topSkills = skills.slice(0, 5).map((s) => s.name).join(', ');

    if (/all\s+skills|complete\s+skill|full\s+stack|every\s+skill|list\s+all/.test(prompt)) {
      return `${name} has a comprehensive skill set including ${categorySummary}. His core strengths are in ${topSkills} and related technologies.`;
    }

    if (/frontend|front\s*end|react|ui|user\s+interface|css|html/.test(prompt)) {
      const frontend = categories['Frontend'] || categories['Languages'] || [];
      return `${name}'s frontend skills include: ${frontend.join(', ')}. He specializes in React.js, Tailwind CSS, and modern UI development.`;
    }

    if (/backend|back\s*end|server|api|node|express|laravel|php/.test(prompt)) {
      const backend = categories['Backend'] || [];
      return `${name}'s backend expertise includes: ${backend.join(', ')}. He builds scalable server-side applications using Node.js, Express.js, and Laravel.`;
    }

    if (/database|db|mongo|mysql|sql|data\s+storage/.test(prompt)) {
      const db = categories['Database'] || [];
      return `${name} works with databases including: ${db.join(', ')}. He has experience with both SQL and NoSQL databases.`;
    }

    if (/auth|security|jwt|rbac|login|authentication|authorization/.test(prompt)) {
      const auth = categories['Auth & Security'] || [];
      return `${name} has strong knowledge of authentication and security: ${auth.join(', ')}. He implements secure authentication systems in his applications.`;
    }

    return `${name} specializes in ${categorySummary}. His primary tech stack includes ${topSkills} and related modern web technologies.`;
  }

  // Experience / Work / Jobs
  if (/experience|work|company|job|role|position|career|employment|work\s+history|professional\s+background|where\s+does\s+he\s+work|current\s+job|current\s+role/.test(prompt)) {
    if (experience.length === 0) return 'Experience details are currently unavailable.';

    const current = experience.find((item) => item.current) || experience[0];
    const currentText = current
      ? `Currently, ${name} works as ${current.role} at ${current.company} (${current.duration}).`
      : '';

    const allRoles = experience
      .map((item) => `${item.role} at ${item.company} (${item.duration})`)
      .join('; ');

    const detailedExperience = experience.map((item) => {
      const desc = item.description && item.description.length > 0
        ? item.description.slice(0, 2).join('. ')
        : '';
      return `${item.role} at ${item.company} (${item.duration})${desc ? ` - ${desc}` : ''}`;
    }).join('; ');

    if (/current|present|now|today|latest/.test(prompt)) {
      return currentText + ` Total experience: ${totalExperience}.`;
    }

    if (/all|complete|full|every|detailed|tell\s+me\s+more|describe/.test(prompt)) {
      return `${name} has ${totalExperience} of professional experience. ${detailedExperience}.`;
    }

    return `${name} has ${totalExperience} of experience. ${currentText} Previous roles include ${allRoles}.`;
  }

  // Projects / Portfolio / Work samples
  if (/project|portfolio|build|develop|created|made|application|app|website|site|work\s+sample|github\s+project/.test(prompt)) {
    if (projects.length === 0) return 'Projects are currently unavailable.';

    const featured = projects.filter((p) => p.featured);
    const list = featured.length > 0 ? featured : projects;

    if (/all|every|complete|list|all\s+project|how\s+many|total\s+project/.test(prompt)) {
      const allProjects = projects.map((p) => `${p.title} (${p.techStack?.join(', ') || 'MERN Stack'})`).join('; ');
      return `${name} has built ${projects.length} projects including: ${allProjects}. Featured projects: ${featured.map(p => p.title).join(', ')}.`;
    }

    if (/latest|recent|new|current/.test(prompt)) {
      const recent = list.slice(0, 2);
      const recentInfo = recent.map((p) => `${p.title} - ${p.description?.slice(0, 100) || 'A web application'}...`).join('; ');
      return `${name}'s recent projects include: ${recentInfo}. Technologies used: ${recent.map(p => p.techStack?.join(', ') || 'MERN Stack').join('; ')}.`;
    }

    const names = list.slice(0, 3).map((p) => `${p.title} (${p.techStack?.join(', ') || 'MERN Stack'})`).join('; ');
    return `Key projects by ${name} include ${names}. ${featured.length > 0 ? `Featured projects: ${featured.map(p => p.title).join(', ')}.` : ''}`;
  }

  // Specific project query
  if (/biswas|attendance|vivek|contractor|agro|manpower/.test(prompt)) {
    const matched = projects.find((p) => prompt.includes(p.title.toLowerCase().split(' ')[0]) || p.title.toLowerCase().includes(prompt.split(' ')[0]));
    if (matched) {
      return `${matched.title}: ${matched.description}. Built with ${matched.techStack?.join(', ') || 'MERN Stack'}. ${matched.liveUrl ? `Live at: ${matched.liveUrl}` : ''} ${matched.githubUrl ? `GitHub: ${matched.githubUrl}` : ''}`;
    }
  }

  // Education
  if (/education|college|btech|degree|study|university|school|qualification|academic|b\.?tech|graduation/.test(prompt)) {
    if (education.length === 0) return 'Education details are currently unavailable.';
    const edu = education[0];
    const allEdu = education.map((e) => `${e.degree} from ${e.institution} (${e.year})`).join('; ');
    if (/all|complete|every|full|tell\s+me\s+more|detailed/.test(prompt)) {
      return `${name}'s education: ${allEdu}. ${education.map(e => e.description).filter(Boolean).join(' ')}`;
    }
    return `${name} completed ${edu.degree} from ${edu.institution} (${edu.year}). ${edu.description || ''}`.trim();
  }

  // Achievements / Certificates / Awards
  if (/achievement|certificate|award|honor|recognition|accomplishment|accolade/.test(prompt)) {
    if (achievements.length === 0) return 'No achievements or certificates are currently listed in the portfolio.';
    const names = achievements.map((item) => item.title || item.name).join(', ');
    const details = achievements.map((item) => `${item.title || item.name}: ${item.description || 'Achievement'}`).join('; ');
    if (/all|complete|every|detailed|tell\s+me\s+more/.test(prompt)) {
      return `${name}'s achievements include: ${details}.`;
    }
    return `${name} has earned achievements including: ${names}.`;
  }

  // Resume / CV
  if (/resume|cv|download|pdf|curriculum\s+vitae/.test(prompt)) {
    return `You can view or download ${name}'s full resume from the Resume app. It contains complete details about projects, skills, education, experience, and achievements.`;
  }

  // Location / Where
  if (/location|city|country|where\s+does\s+he\s+live|where\s+is\s+he\s+from|based\s+in|hometown|address/.test(prompt)) {
    return `${name} is based in ${location}. He is available for remote work and collaborations worldwide.`;
  }

  // Title / Role / What does he do
  if (/what\s+does\s+he\s+do|what\s+is\s+his\s+role|what\s+is\s+his\s+job|what\s+is\s+his\s+position|what\s+does\s+sachin\s+do|profession|occupation/.test(prompt)) {
    return `${name} is a ${title}. He specializes in full-stack web development using the MERN stack (MongoDB, Express.js, React.js, Node.js) and also has experience with Laravel.`;
  }

  // Bio / Personal
  if (/bio|personal|about\s+him|tell\s+me\s+more\s+about|background|summary|overview/.test(prompt)) {
    return `${name} - ${title}. ${bio} He is based in ${location} and passionate about building scalable web applications.`;
  }

  // Age / Experience length
  if (/how\s+old|age|birthday|born/.test(prompt)) {
    return `I don't have ${name}'s exact age or birth date in my knowledge base. However, he has nearly 1 year of professional experience in full-stack development.`;
  }

  // Salary / Expectations
  if (/salary|pay|compensation|expected\s+salary|how\s+much\s+does\s+he\s+earn|income/.test(prompt)) {
    return `I don't have salary information in my knowledge base. For compensation details, please contact ${name} directly via email at ${email} or LinkedIn at ${linkedin}.`;
  }

  // Availability
  if (/available|hiring|freelance|open\s+to\s+work|looking\s+for\s+job|job\s+opportunity/.test(prompt)) {
    return `${name} is a Software Engineer with hands-on experience in full-stack development. For job opportunities or collaborations, please reach out via email at ${email} or LinkedIn at ${linkedin}.`;
  }

  // Languages spoken
  if (/language|languages\s+spoken|speak|communication|spoken/.test(prompt)) {
    return `${name} is proficient in English and Hindi. He communicates effectively in both languages for professional and technical discussions.`;
  }

  // Hobbies / Interests
  if (/hobby|hobbies|interest|interests|free\s+time|leisure|passion|outside\s+work/.test(prompt)) {
    return `${name} is passionate about technology and software development. He enjoys building web applications, learning new technologies, and solving complex technical challenges.`;
  }

  // General portfolio question
  if (/portfolio|website|this\s+site|about\s+this|what\s+is\s+this/.test(prompt)) {
    return `This is ${name}'s personal portfolio website showcasing his professional work as a ${title}. It features his skills, projects, experience, education, achievements, and contact information.`;
  }

  // Thank you
  if (/thank|thanks|thankyou|thx|appreciate/.test(prompt)) {
    return `You're welcome! Feel free to ask me anything else about ${name}'s skills, projects, experience, or any other professional details.`;
  }

  // Goodbye
  if (/bye|goodbye|see\s+you|exit|quit|close/.test(prompt)) {
    return `Goodbye! It was great helping you. If you need more information about ${name}, feel free to ask anytime. Have a great day!`;
  }

  // Help
  if (/help|what\s+can\s+you\s+do|how\s+can\s+you\s+help|capabilities|features/.test(prompt)) {
    return `I can provide detailed information about ${name} including: his professional background, technical skills (React.js, Node.js, MongoDB, etc.), work experience at Biswas Group and Vinayan India, key projects like Biswas Manpower Website and Attendance Management System, education (B.Tech CSE), contact details, and achievements. Just ask me anything!`;
  }

  // Fallback - try to find relevant info
  const lowerPrompt = prompt.toLowerCase();

  // Check if question contains any skill name
  const matchedSkill = skills.find((s) => lowerPrompt.includes(s.name.toLowerCase()));
  if (matchedSkill) {
    return `${name} has expertise in ${matchedSkill.name} (${matchedSkill.category}) with ${matchedSkill.proficiency}% proficiency.`;
  }

  // Check if question contains any project keyword
  const matchedProject = projects.find((p) => lowerPrompt.includes(p.title.toLowerCase().split(' ')[0]) || p.title.toLowerCase().includes(lowerPrompt));
  if (matchedProject) {
    return `${matchedProject.title}: ${matchedProject.description}. Built with ${matchedProject.techStack?.join(', ') || 'MERN Stack'}. ${matchedProject.liveUrl ? `Live URL: ${matchedProject.liveUrl}` : ''}`;
  }

  // Check if question contains any company name
  const matchedExp = experience.find((e) => lowerPrompt.includes(e.company.toLowerCase().split(' ')[0]) || e.company.toLowerCase().includes(lowerPrompt));
  if (matchedExp) {
    return `${name} worked at ${matchedExp.company} as ${matchedExp.role} (${matchedExp.duration}). ${matchedExp.description?.slice(0, 2).join('. ') || ''}`;
  }

  // Default professional response
  return `I'm here to help you learn about ${name}. I can provide detailed information about his professional background, technical skills, work experience, projects, education, achievements, and contact details. Could you please ask a more specific question? For example: "What are Sachin's skills?" or "Tell me about his projects" or "How can I contact him?"`;
}

export default function VoiceAssistant({
  data,
  mode = 'desktop',
  open: controlledOpen,
  onToggle,
  showLauncher = true,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: `Hello! I'm ${data.profile?.name || "Sachin"}'s personal AI assistant. I have complete knowledge about his professional background, skills, projects, and experience. What would you like to know?`,
    },
  ]);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const SpeechRecognition = useMemo(
    () => window.SpeechRecognition || window.webkitSpeechRecognition || null,
    []
  );

  const open = controlledOpen ?? internalOpen;
  const setOpen = useCallback((nextValue) => {
    const value = typeof nextValue === 'function' ? nextValue(open) : nextValue;
    if (typeof controlledOpen === 'boolean') {
      onToggle?.(value);
      return;
    }
    setInternalOpen(value);
    onToggle?.(value);
  }, [controlledOpen, onToggle, open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    setSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) => voice.name.includes('Google US English'))
      || voices.find((voice) => voice.name.includes('Samantha'))
      || voices.find((voice) => voice.name.includes('Microsoft David'))
      || voices.find((voice) => voice.lang === 'en-US' && voice.localService)
      || voices.find((voice) => voice.lang.startsWith('en'));
    if (preferred) {
      utterance.voice = preferred;
    }

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const ask = useCallback((value) => {
    const question = value.trim();
    if (!question) {
      return;
    }

    const reply = buildReply(question, data);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: question },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: reply },
      ]);
      setTimeout(() => speak(reply), 350);
    }, 200);
    setInput('');
  }, [data, speak]);

  useEffect(() => {
    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        ask(transcript);
      }
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.onerror = () => {
      setListening(false);
    };
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [SpeechRecognition, ask]);

  return (
    <>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }`}</style>
      {showLauncher && (
        <motion.button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(0,240,255,0.25)' }}
          whileTap={{ scale: 0.96 }}
          style={{
            position: 'fixed',
            right: mode === 'desktop' ? 20 : 16,
            bottom: mode === 'desktop' ? 64 : 116,
            zIndex: 10002,
            width: mode === 'desktop' ? 56 : 52,
            height: mode === 'desktop' ? 56 : 52,
            borderRadius: '50%',
            border: '1px solid rgba(0,240,255,0.45)',
            background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(191,0,255,0.2))',
            color: '#e0e0ff',
            fontSize: 22,
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
          }}
        >
          {open ? '×' : '🎙️'}
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed',
              right: mode === 'desktop' ? 20 : 12,
              left: mode === 'desktop' ? 'auto' : 12,
              bottom: mode === 'desktop' ? 130 : 96,
              width: mode === 'desktop' ? 380 : 'auto',
              maxWidth: 'calc(100vw - 24px)',
              zIndex: 10002,
              background: 'rgba(10,10,30,0.98)',
              border: '1px solid rgba(0,240,255,0.35)',
              borderRadius: 20,
              boxShadow: '0 30px 60px rgba(0,0,0,0.45), 0 0 40px rgba(0,240,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
              overflow: 'hidden',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(42,42,74,0.7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, background: 'linear-gradient(180deg, rgba(0,240,255,0.06), transparent)' }}>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: '#00f0ff', fontWeight: 700, letterSpacing: 1 }}>VOICE ASSISTANT</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: '#8888aa', marginTop: 2 }}>Ask anything about Sachin</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (!SpeechRecognition) {
                      const reply = 'Voice recognition is not supported in this browser. You can still type your question here.';
                      setMessages((prev) => [...prev, { id: Date.now(), role: 'assistant', text: reply }]);
                      return;
                    }
                    if (listening) {
                      recognitionRef.current?.stop();
                      return;
                    }
                    setListening(true);
                    recognitionRef.current?.start();
                  }}
                  style={{
                    ...headerButtonStyle(listening),
                    background: listening ? 'rgba(0,240,255,0.25)' : 'transparent',
                    boxShadow: listening ? '0 0 20px rgba(0,240,255,0.4)' : 'none',
                    animation: listening ? 'pulse 1.5s infinite' : 'none',
                  }}
                >
                  {listening ? 'Listening...' : 'Mic'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (listening) {
                      recognitionRef.current?.stop();
                    }
                    window.speechSynthesis?.cancel();
                    setSpeaking(false);
                    setInput('');
                  }}
                  style={{
                    ...headerButtonStyle(false),
                    background: speaking ? 'rgba(255,170,0,0.2)' : 'transparent',
                    borderColor: speaking ? 'rgba(255,170,0,0.5)' : 'rgba(0,240,255,0.35)',
                    color: speaking ? '#ffaa00' : '#00f0ff',
                    boxShadow: speaking ? '0 0 16px rgba(255,170,0,0.3)' : 'none',
                  }}
                >
                  {speaking ? 'Speaking...' : 'Stop'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setOpen(false);
                  }}
                  style={{
                    ...headerButtonStyle(false),
                    background: 'rgba(255,51,102,0.12)',
                    borderColor: 'rgba(255,51,102,0.4)',
                    color: '#ff3366',
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              style={{
                maxHeight: mode === 'desktop' ? 320 : 260,
                overflowY: 'auto',
                padding: '16px 18px',
                display: 'grid',
                gap: 12,
                background: 'radial-gradient(ellipse at 50% 0%, rgba(0,240,255,0.03), transparent 60%)',
              }}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    justifySelf: message.role === 'user' ? 'end' : 'start',
                    maxWidth: '88%',
                    padding: '12px 14px',
                    borderRadius: 16,
                    background: message.role === 'user'
                      ? 'linear-gradient(135deg, rgba(0,240,255,0.18), rgba(0,240,255,0.08))'
                      : 'linear-gradient(135deg, rgba(17,17,40,0.98), rgba(17,17,40,0.9))',
                    border: message.role === 'user'
                      ? '1px solid rgba(0,240,255,0.35)'
                      : '1px solid rgba(42,42,74,0.7)',
                    color: '#e0e0ff',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.5,
                    boxShadow: message.role === 'user'
                      ? '0 4px 16px rgba(0,240,255,0.1)'
                      : '0 4px 16px rgba(0,0,0,0.2)',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  {message.text}
                </motion.div>
              ))}
            </div>

            <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(42,42,74,0.7)', display: 'flex', gap: 10, background: 'rgba(8,8,24,0.6)' }}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    ask(input);
                  }
                }}
                placeholder="Ask about skills, projects, experience..."
                style={{
                  flex: 1,
                  background: 'rgba(8,8,24,0.8)',
                  border: '1px solid rgba(42,42,74,0.9)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#e0e0ff',
                  outline: 'none',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 14,
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(0,240,255,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(42,42,74,0.9)'}
              />
              <motion.button
                type="button"
                onClick={() => ask(input)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  border: 'none',
                  borderRadius: 12,
                  padding: '0 18px',
                  background: 'linear-gradient(135deg, #00f0ff, #bf00ff)',
                  color: '#050510',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                  boxShadow: '0 4px 16px rgba(0,240,255,0.25)',
                }}
              >
                Ask
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function headerButtonStyle(active) {
  return {
    border: '1px solid rgba(0,240,255,0.35)',
    background: active ? 'rgba(0,240,255,0.2)' : 'transparent',
    color: '#00f0ff',
    borderRadius: 999,
    padding: '8px 14px',
    cursor: 'pointer',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
    transition: 'all 0.2s ease',
  };
}
