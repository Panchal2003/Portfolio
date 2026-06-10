import { LINKEDIN_URL } from '../utils/portfolioData';

export const fallbackProfile = {
  name: 'Sachin Kumar Panchal',
  title: 'Software Engineer | Full Stack MERN Developer | Project Lead',
  email: 'sachinpanchal080103@gmail.com',
  phone: '+91-9540805588',
  bio: 'Software Engineer with nearly 1 year of hands-on experience in full-stack development using the MERN Stack and Laravel. Proven ability to design, develop, and deploy production-grade web applications independently. Experienced in role-based authentication systems, backend business logic implementation, system migration, hardware-software integration, and end-to-end project delivery.',
  socialLinks: {
    github: 'https://github.com/Panchal2003',
    linkedin: LINKEDIN_URL,
  },
  profileImage: '',
};

export const fallbackSkills = [
  { name: 'React.js', category: 'Frontend', proficiency: 90 },
  { name: 'Tailwind CSS', category: 'Frontend', proficiency: 85 },
  { name: 'Bootstrap', category: 'Frontend', proficiency: 80 },
  { name: 'Node.js', category: 'Backend', proficiency: 85 },
  { name: 'Express.js', category: 'Backend', proficiency: 85 },
  { name: 'Laravel', category: 'Backend', proficiency: 75 },
  { name: 'MongoDB', category: 'Database', proficiency: 85 },
  { name: 'MySQL', category: 'Database', proficiency: 80 },
  { name: 'JavaScript', category: 'Languages', proficiency: 90 },
  { name: 'PHP', category: 'Languages', proficiency: 70 },
  { name: 'HTML5', category: 'Languages', proficiency: 95 },
  { name: 'CSS3', category: 'Languages', proficiency: 90 },
  { name: 'JWT', category: 'Auth & Security', proficiency: 85 },
  { name: 'Role-Based Access Control', category: 'Auth & Security', proficiency: 80 },
  { name: 'Hosting', category: 'DevOps', proficiency: 80 },
  { name: 'DNS Configuration', category: 'DevOps', proficiency: 75 },
  { name: 'Domain Setup', category: 'DevOps', proficiency: 80 },
  { name: 'cPanel', category: 'DevOps', proficiency: 75 },
  { name: 'Git', category: 'Tools', proficiency: 85 },
  { name: 'GitHub', category: 'Tools', proficiency: 85 },
  { name: 'VS Code', category: 'Tools', proficiency: 90 },
];

export const fallbackProjects = [
  {
    _id: '1',
    title: 'Biswas Manpower Official Website',
    description: 'Developed and deployed a full-scale production website independently using the MERN stack. Managed complete front-end, back-end, database integration, hosting, and domain configuration. Designed responsive user interface and implemented secure backend data handling mechanisms. Executed full project lifecycle from requirement analysis to production deployment.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    liveUrl: 'https://biswasmanpower.com',
    image: '',
    featured: true,
  },
  {
    _id: '2',
    title: 'Biswas Agro Foods Official Website',
    description: 'Developed a responsive corporate website for an agro-food brand showcasing pure mustard oil products, company information, product catalog, and customer reviews. Implemented structured product pages, contact forms, and mobile-friendly UI to highlight brand authenticity, quality assurance, and direct customer engagement.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    liveUrl: 'https://biswasagrofoods.in/',
    image: '',
    featured: true,
  },
  {
    _id: '3',
    title: 'Vivek Contractor & Engineering',
    description: 'Designed and developed a responsive company website to showcase contracting services and project information. Implemented modular React components and clean UI structure for maintainability. Integrated optimized layouts and responsive design to ensure seamless performance across devices. Deployed on Vercel for fast global delivery and reliable hosting.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    liveUrl: 'https://vivek-contractors.vercel.app/',
    githubUrl: 'https://github.com/Panchal2003/Vivek-Contractor-Engineer',
    image: '',
    featured: true,
  },
  {
    _id: '4',
    title: 'Attendance Management System',
    description: 'Designed JWT-based role authentication (Admin, Sub-Admin, Employee). Built attendance tracking with monthly register and salary deduction automation. Implemented payroll logic with paid leave handling and deduction rules. Optimized MongoDB schema and REST APIs for efficient data processing.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    liveUrl: 'https://attendence-system-nine.vercel.app/',
    githubUrl: 'https://github.com/officialbiswasmanpower/Attendence_System',
    image: '',
    featured: false,
  },
];

export const fallbackExperience = [
  {
    _id: '1',
    company: 'Biswas Group of Companies',
    role: 'Software Engineer & Project Manager',
    duration: 'Jan 2026 - Present',
    description: [
      'Led end-to-end development and deployment of 2 production business websites using MERN stack.',
      'Managed complete system architecture including frontend, backend APIs, database design, hosting, and domain configuration.',
      'Implemented secure backend services and dynamic user interfaces aligned with business requirements.',
      'Recognized by senior management for outstanding technical performance and successful project execution.',
    ],
    current: true,
    order: 1,
  },
  {
    _id: '2',
    company: 'Vinayan India Consulting & Services Pvt. Ltd.',
    role: 'Software Development Engineer',
    duration: 'Jul 2025 - Dec 2025',
    description: [
      'Developed and maintained software modules for Laser Speed Gun system used in real-time vehicle speed detection.',
      'Re-engineered and migrated system software from Ubuntu to Windows environment for improved deployment flexibility.',
      'Integrated additional hardware components including noise meter and automated audio feedback module.',
      'Provided technical troubleshooting, calibration support, and system validation for operational reliability.',
    ],
    current: false,
    order: 2,
  },
];

export const fallbackEducation = [
  {
    _id: '1',
    degree: 'Bachelor of Technology (Computer Science & Engineering)',
    institution: 'Sunderdeep Engineering College, Ghaziabad',
    year: 'Completed June 2025 • First Division',
    description: 'B.Tech in Computer Science & Engineering completed with First Division.',
  },
];

export const fallbackAchievements = [
  {
    _id: '1',
    title: 'Full Stack MERN Developer',
    description: 'Successfully delivered multiple production-grade web applications using MongoDB, Express.js, React.js, and Node.js.',
    date: '2025',
    icon: '🚀',
  },
  {
    _id: '2',
    title: 'Project Lead',
    description: 'Led end-to-end development and deployment of business websites for Biswas Group of Companies.',
    date: '2025-2026',
    icon: '👨‍💼',
  },
  {
    _id: '3',
    title: 'Hardware-Software Integration',
    description: 'Integrated laser speed gun systems with software solutions for real-time vehicle speed detection.',
    date: '2025',
    icon: '🔧',
  },
];
