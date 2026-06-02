const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Achievement = require('./models/Achievement');

const seedDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio'
    );
    console.log('MongoDB Connected for seeding...');

    // Clear all collections
    await Admin.deleteMany({});
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Achievement.deleteMany({});
    console.log('All collections cleared.');

    // Seed Admin
    await Admin.create({
      email: 'sachinpanchal080103@gmail.com',
      password: 'admin123',
    });
    console.log('Admin user created.');

    // Seed Profile
    await Profile.create({
      name: 'Sachin Kumar Panchal',
      title: 'Software Engineer | Full Stack MERN Developer | Project Lead',
      email: 'sachinpanchal080103@gmail.com',
      phone: '+91-9540805588',
      location: 'India',
      bio: 'Software Engineer with nearly 1 year of hands-on experience in full-stack development using the MERN Stack and Laravel. Proven ability to design, develop, and deploy production-grade web applications independently.',
      socialLinks: {
        github: 'https://github.com/Panchal2003',
        linkedin: 'https://linkedin.com/in/sachin-panchal',
      },
    });
    console.log('Profile seeded.');

    // Seed Skills
    const skills = [
      { name: 'React.js', category: 'Frontend', proficiency: 90 },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 88 },
      { name: 'Bootstrap', category: 'Frontend', proficiency: 85 },
      { name: 'HTML5', category: 'Frontend', proficiency: 95 },
      { name: 'CSS3', category: 'Frontend', proficiency: 90 },
      { name: 'Node.js', category: 'Backend', proficiency: 85 },
      { name: 'Express.js', category: 'Backend', proficiency: 85 },
      { name: 'Laravel', category: 'Backend', proficiency: 80 },
      { name: 'JWT', category: 'Backend', proficiency: 80 },
      { name: 'RBAC', category: 'Backend', proficiency: 75 },
      { name: 'MongoDB', category: 'Database', proficiency: 85 },
      { name: 'MySQL', category: 'Database', proficiency: 80 },
      { name: 'JavaScript', category: 'Languages', proficiency: 90 },
      { name: 'PHP', category: 'Languages', proficiency: 80 },
      { name: 'Git', category: 'Tools', proficiency: 85 },
      { name: 'GitHub', category: 'Tools', proficiency: 85 },
      { name: 'VS Code', category: 'Tools', proficiency: 90 },
      { name: 'Hosting', category: 'Tools', proficiency: 78 },
      { name: 'DNS', category: 'Tools', proficiency: 75 },
      { name: 'cPanel', category: 'Tools', proficiency: 78 },
    ];
    await Skill.insertMany(skills);
    console.log('Skills seeded.');

    // Seed Experience
    const experiences = [
      {
        company: 'Biswas Group',
        role: 'Software Engineer & Project Manager',
        duration: 'Jan 2026 - Present',
        description: [
          'Leading full-stack web development projects using MERN Stack',
          'Managing project timelines and team coordination',
          'Designing and implementing scalable web applications',
          'Overseeing deployment and production maintenance',
        ],
        current: true,
        order: 1,
      },
      {
        company: 'Vinayan India',
        role: 'Software Development Engineer',
        duration: 'July 2025 - Dec 2025',
        description: [
          'Developed full-stack web applications using MERN Stack and Laravel',
          'Built RESTful APIs and integrated third-party services',
          'Collaborated with cross-functional teams for project delivery',
          'Implemented authentication and authorization systems',
        ],
        current: false,
        order: 2,
      },
    ];
    await Experience.insertMany(experiences);
    console.log('Experience seeded.');

    // Seed Projects
    const projects = [
      {
        title: 'Biswas Manpower Website',
        description:
          'A complete corporate website for Biswas Manpower services with dynamic content management, responsive design, and admin panel for content updates.',
        techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
        featured: true,
        order: 1,
      },
      {
        title: 'Attendance Management System',
        description:
          'A comprehensive attendance tracking system with role-based access control, real-time reporting, and automated notifications for managing employee attendance.',
        techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'RBAC'],
        featured: true,
        order: 2,
      },
    ];
    await Project.insertMany(projects);
    console.log('Projects seeded.');

    // Seed Education
    await Education.create({
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Sunderdeep Engineering College',
      year: 'Expected June 2025',
      description:
        'Pursuing Bachelor of Technology in Computer Science and Engineering with focus on web development and software engineering.',
    });
    console.log('Education seeded.');

    console.log('\n✅ Database seeded successfully!');
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDB();
