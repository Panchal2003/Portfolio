import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { normalizeEducationList, normalizeProfile, splitDescription } from '../utils/portfolioData';

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_PADDING_X = 48;
const PAGE_PADDING_Y = 52;
const PAGE_CONTENT_HEIGHT = PAGE_HEIGHT - (PAGE_PADDING_Y * 2);

const SKILL_CATEGORY_ORDER = ['Frontend', 'Backend', 'Database', 'Languages', 'Auth & Security', 'DevOps', 'Tools'];

const SECTION_LABELS = {
  experience: 'PROFESSIONAL EXPERIENCE',
  projects: 'KEY PROJECTS',
  education: 'EDUCATION',
  achievements: 'CERTIFICATIONS & ACHIEVEMENTS',
};

function normalizeTechStack(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,\-|]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function areMapsEqual(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => left[key] === right[key]);
}

function buildSkillGroups(skills = []) {
  const grouped = new Map();

  skills.forEach((skill) => {
    const category = skill?.category || 'Other';
    const name = String(skill?.name || '').trim();

    if (!name) {
      return;
    }

    if (!grouped.has(category)) {
      grouped.set(category, []);
    }

    const current = grouped.get(category);
    if (!current.includes(name)) {
      current.push(name);
    }
  });

  const orderedCategories = [
    ...SKILL_CATEGORY_ORDER.filter((category) => grouped.has(category)),
    ...Array.from(grouped.keys()).filter((category) => !SKILL_CATEGORY_ORDER.includes(category)),
  ];

  return orderedCategories.map((category) => ({
    category,
    names: grouped.get(category),
  }));
}

function buildBlocks({ profile, skillGroups, experience, projects, education, achievements }) {
  const blocks = [];

  blocks.push({
    id: 'header',
    type: 'header',
    data: {
      name: profile?.name || 'Sachin Kumar Panchal',
      title: profile?.title || 'Software Developer',
    },
  });

  if (profile?.bio) {
    blocks.push({
      id: 'summary',
      type: 'summary',
      data: { bio: profile.bio },
    });
  }

  if (skillGroups.length > 0) {
    blocks.push({
      id: 'skills',
      type: 'skills',
      data: { groups: skillGroups },
    });
  }

  experience.forEach((item, index) => {
    blocks.push({
      id: `experience-${item?._id || index}`,
      type: 'experience',
      section: SECTION_LABELS.experience,
      data: {
        role: item?.role || 'Software Developer',
        company: item?.company || '',
        duration: item?.duration || '',
        points: splitDescription(item?.description),
      },
    });
  });

  projects.forEach((item, index) => {
    blocks.push({
      id: `project-${item?._id || index}`,
      type: 'project',
      section: SECTION_LABELS.projects,
      data: {
        title: item?.title || 'Project',
        techStack: normalizeTechStack(item?.techStack),
        description: splitDescription(item?.description),
        liveUrl: item?.liveUrl || '',
      },
    });
  });

  education.forEach((item, index) => {
    blocks.push({
      id: `education-${item?._id || index}`,
      type: 'education',
      section: SECTION_LABELS.education,
      data: {
        degree: item?.degree || '',
        institution: item?.institution || '',
        year: item?.year || '',
        description: item?.description || '',
      },
    });
  });

  achievements.forEach((item, index) => {
    blocks.push({
      id: `achievement-${item?._id || index}`,
      type: 'achievement',
      section: SECTION_LABELS.achievements,
      data: {
        title: item?.title || 'Achievement',
        description: item?.description || '',
      },
    });
  });

  return blocks;
}

function paginateBlocks(blocks, blockHeights, sectionHeights) {
  if (!blocks.length) {
    return [];
  }

  const pages = [];
  let pageItems = [];
  let remaining = PAGE_CONTENT_HEIGHT;
  let sectionsOnPage = new Set();

  blocks.forEach((block) => {
    const blockHeight = blockHeights[block.id] || 0;
    const needsSectionTitle = Boolean(block.section) && !sectionsOnPage.has(block.section);
    const sectionHeight = needsSectionTitle ? (sectionHeights[block.section] || 0) : 0;
    const requiredHeight = blockHeight + sectionHeight;

    if (pageItems.length > 0 && requiredHeight > remaining) {
      pages.push(pageItems);
      pageItems = [];
      remaining = PAGE_CONTENT_HEIGHT;
      sectionsOnPage = new Set();
    }

    const showSectionTitle = Boolean(block.section) && !sectionsOnPage.has(block.section);
    const titleHeight = showSectionTitle ? (sectionHeights[block.section] || 0) : 0;

    pageItems.push({
      ...block,
      showSectionTitle,
    });

    if (block.section) {
      sectionsOnPage.add(block.section);
    }

    remaining = Math.max(0, remaining - blockHeight - titleHeight);
  });

  if (pageItems.length > 0) {
    pages.push(pageItems);
  }

  return pages;
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        margin: '0 0 14px',
        paddingLeft: '10px',
        borderLeft: '4px solid #2563eb',
        fontSize: '14px',
        lineHeight: 1.2,
        letterSpacing: '0.08em',
        fontWeight: 800,
        color: '#0f172a',
      }}
    >
      {children}
    </h2>
  );
}

function BlockShell({ children, compact = false }) {
  return (
    <div
      style={{
        marginBottom: compact ? '14px' : '18px',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      {children}
    </div>
  );
}

function ResumeBlock({ block }) {
  if (!block) {
    return null;
  }

  switch (block.type) {
    case 'header':
      return (
        <BlockShell>
          <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '16px' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '31px',
                lineHeight: 1.1,
                fontWeight: 800,
                color: '#111827',
              }}
            >
              {block.data.name}
            </h1>
            <div
              style={{
                marginTop: '7px',
                fontSize: '16px',
                lineHeight: 1.3,
                fontWeight: 600,
                color: '#2563eb',
              }}
            >
              {block.data.title}
            </div>
          </div>
        </BlockShell>
      );

    case 'summary':
      return (
        <BlockShell>
          <SectionTitle>SUMMARY</SectionTitle>
          <p style={bodyParagraphStyle}>{block.data.bio}</p>
        </BlockShell>
      );

    case 'skills':
      return (
        <BlockShell>
          <SectionTitle>TECHNICAL SKILLS</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {block.data.groups.map((group) => (
              <div key={group.category} style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#374151' }}>
                <span style={{ fontWeight: 700, color: '#111827' }}>{group.category}: </span>
                <span>{group.names.join(', ')}</span>
              </div>
            ))}
          </div>
        </BlockShell>
      );

    case 'experience':
      return (
        <BlockShell>
          <div style={headingRowStyle}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={itemTitleStyle}>
                {block.data.role}
                {block.data.company ? <span style={{ color: '#2563eb' }}> @ {block.data.company}</span> : null}
              </div>
            </div>
            {block.data.duration ? <div style={metaStyle}>{block.data.duration}</div> : null}
          </div>
          {block.data.points.length > 0 ? (
            <ul style={listStyle}>
              {block.data.points.map((point, index) => (
                <li key={`${block.id}-point-${index}`} style={listItemStyle}>
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </BlockShell>
      );

    case 'project':
      return (
        <BlockShell>
          <div style={itemTitleStyle}>{block.data.title}</div>
          {block.data.techStack.length > 0 ? (
            <div style={{ marginTop: '4px', fontSize: '12.5px', lineHeight: 1.5, color: '#2563eb', fontWeight: 600 }}>
              {block.data.techStack.join(', ')}
            </div>
          ) : null}
          <ul style={{ ...listStyle, marginTop: '6px' }}>
            {block.data.description.map((point, index) => (
              <li key={`${block.id}-description-${index}`} style={listItemStyle}>
                {point}
              </li>
            ))}
            {block.data.liveUrl ? (
              <li style={listItemStyle}>
                Live: {block.data.liveUrl}
              </li>
            ) : null}
          </ul>
        </BlockShell>
      );

    case 'education':
      return (
        <BlockShell compact>
          <div style={itemTitleStyle}>{block.data.degree}</div>
          <div style={{ ...bodyTextStyle, marginTop: '4px' }}>
            {[block.data.institution, block.data.year].filter(Boolean).join(' | ')}
          </div>
          {block.data.description ? (
            <p style={{ ...bodyParagraphStyle, marginTop: '6px' }}>
              {block.data.description}
            </p>
          ) : null}
        </BlockShell>
      );

    case 'achievement':
      return (
        <BlockShell compact>
          <div style={itemTitleStyle}>{block.data.title}</div>
          {block.data.description ? (
            <p style={{ ...bodyParagraphStyle, marginTop: '4px' }}>
              {block.data.description}
            </p>
          ) : null}
        </BlockShell>
      );

    default:
      return null;
  }
}

function ResumePaper({ page, scale = 1, preview = false }) {
  const paper = (
    <div
      style={{
        width: `${PAGE_WIDTH}px`,
        minHeight: `${PAGE_HEIGHT}px`,
        padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
        boxSizing: 'border-box',
        background: '#ffffff',
        color: '#111827',
        borderRadius: preview ? '10px' : '0',
        boxShadow: preview ? '0 18px 48px rgba(0, 0, 0, 0.22)' : 'none',
        overflow: 'hidden',
      }}
    >
      {page.map((block) => (
        <div key={block.id}>
          {block.showSectionTitle ? <SectionTitle>{block.section}</SectionTitle> : null}
          <ResumeBlock block={block} />
        </div>
      ))}
    </div>
  );

  if (!preview || scale === 1) {
    return paper;
  }

  return (
    <div
      style={{
        width: `${PAGE_WIDTH * scale}px`,
        height: `${PAGE_HEIGHT * scale}px`,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${PAGE_WIDTH}px`,
          minHeight: `${PAGE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {paper}
      </div>
    </div>
  );
}

export default function ResumeApp({
  profile,
  skills = [],
  experience = [],
  education = [],
  projects = [],
  achievements = [],
}) {
  const previewHostRef = useRef(null);
  const exportRef = useRef(null);
  const blockMeasureRefs = useRef({});
  const sectionMeasureRefs = useRef({});
  const [previewWidth, setPreviewWidth] = useState(PAGE_WIDTH);
  const [blockHeights, setBlockHeights] = useState({});
  const [sectionHeights, setSectionHeights] = useState({});
  const [generating, setGenerating] = useState(false);

  const normalizedProfile = useMemo(() => normalizeProfile(profile || {}), [profile]);
  const normalizedEducation = useMemo(() => normalizeEducationList(education || []), [education]);
  const orderedExperience = useMemo(
    () => [...experience].sort((left, right) => (left?.order || 0) - (right?.order || 0)),
    [experience],
  );
  const orderedProjects = useMemo(
    () => [...projects].sort((left, right) => Number(Boolean(right?.featured)) - Number(Boolean(left?.featured))),
    [projects],
  );
  const orderedAchievements = useMemo(
    () => [...achievements].sort((left, right) => (left?.order || 0) - (right?.order || 0)),
    [achievements],
  );
  const skillGroups = useMemo(() => buildSkillGroups(skills), [skills]);
  const blocks = useMemo(
    () => buildBlocks({
      profile: normalizedProfile,
      skillGroups,
      experience: orderedExperience,
      projects: orderedProjects,
      education: normalizedEducation,
      achievements: orderedAchievements,
    }),
    [normalizedProfile, skillGroups, orderedExperience, orderedProjects, normalizedEducation, orderedAchievements],
  );
  const sectionLabels = useMemo(
    () => Array.from(new Set(blocks.map((block) => block.section).filter(Boolean))),
    [blocks],
  );

  useLayoutEffect(() => {
    if (!previewHostRef.current) {
      return undefined;
    }

    const host = previewHostRef.current;
    const updateWidth = () => {
      setPreviewWidth(host.clientWidth || PAGE_WIDTH);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const nextBlockHeights = {};
      const nextSectionHeights = {};

      const blocksReady = blocks.every((block) => {
        const node = blockMeasureRefs.current[block.id];
        if (!node) {
          return false;
        }

        nextBlockHeights[block.id] = Math.ceil(node.getBoundingClientRect().height);
        return true;
      });

      const sectionsReady = sectionLabels.every((label) => {
        const node = sectionMeasureRefs.current[label];
        if (!node) {
          return false;
        }

        nextSectionHeights[label] = Math.ceil(node.getBoundingClientRect().height);
        return true;
      });

      if (blocksReady && !areMapsEqual(blockHeights, nextBlockHeights)) {
        setBlockHeights(nextBlockHeights);
      }

      if (sectionsReady && !areMapsEqual(sectionHeights, nextSectionHeights)) {
        setSectionHeights(nextSectionHeights);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [blocks, sectionLabels, blockHeights, sectionHeights]);

  const pages = useMemo(() => {
    const haveAllBlocks = blocks.every((block) => blockHeights[block.id]);
    const haveAllSections = sectionLabels.every((label) => sectionHeights[label]);

    if (!haveAllBlocks || !haveAllSections) {
      return [];
    }

    return paginateBlocks(blocks, blockHeights, sectionHeights);
  }, [blocks, blockHeights, sectionHeights, sectionLabels]);

  const previewScale = useMemo(() => {
    const availableWidth = Math.max(280, previewWidth - 24);
    return Math.min(1, availableWidth / PAGE_WIDTH);
  }, [previewWidth]);

  const downloadPDF = async () => {
    if (!pages.length || !exportRef.current) {
      return;
    }

    setGenerating(true);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const pageNodes = Array.from(exportRef.current.querySelectorAll('[data-resume-page]'));
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let index = 0; index < pageNodes.length; index += 1) {
        const canvas = await html2canvas(pageNodes[index], {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          windowWidth: PAGE_WIDTH,
          windowHeight: PAGE_HEIGHT,
        });

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }

      const safeName = String(normalizedProfile?.name || 'Sachin_Kumar_Panchal')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');

      pdf.save(`${safeName}_Resume.pdf`);
    } catch (error) {
      console.error('Resume PDF generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: window.innerWidth <= 768 ? '12px' : '22px',
        color: '#e2e8f0',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: '#94a3b8',
            }}
          >
            RESUME PREVIEW
          </div>
          <div
            style={{
              marginTop: '6px',
              fontSize: '14px',
              lineHeight: 1.5,
              color: '#cbd5e1',
            }}
          >
            Clean multi-page preview with full white pages and block-safe PDF export.
          </div>
        </div>

        <button
          type="button"
          onClick={downloadPDF}
          disabled={generating || pages.length === 0}
          style={{
            padding: '11px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(59, 130, 246, 0.55)',
            background: generating ? 'rgba(59, 130, 246, 0.18)' : 'rgba(15, 23, 42, 0.9)',
            color: '#dbeafe',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '12px',
            letterSpacing: '0.08em',
            cursor: generating || pages.length === 0 ? 'wait' : 'pointer',
            opacity: generating || pages.length === 0 ? 0.75 : 1,
          }}
        >
          {generating ? 'GENERATING PDF...' : 'DOWNLOAD RESUME'}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        ref={previewHostRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: window.innerWidth <= 768 ? '10px 6px 24px' : '20px 16px 30px',
          borderRadius: '16px',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          background: 'linear-gradient(180deg, rgba(7, 10, 24, 0.88), rgba(15, 23, 42, 0.78))',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
          {pages.length === 0 ? (
            <div
              style={{
                width: `${PAGE_WIDTH * previewScale}px`,
                height: `${PAGE_HEIGHT * previewScale}px`,
                borderRadius: '10px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px',
                color: '#475569',
                boxShadow: '0 18px 48px rgba(0, 0, 0, 0.22)',
              }}
            >
              Preparing resume pages...
            </div>
          ) : (
            pages.map((page, index) => (
              <ResumePaper
                key={`resume-page-preview-${index + 1}`}
                page={page}
                preview
                scale={previewScale}
              />
            ))
          )}
        </div>
      </motion.div>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-100000px',
          top: 0,
          width: `${PAGE_WIDTH}px`,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: `${PAGE_WIDTH}px`,
            padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
            boxSizing: 'border-box',
            background: '#ffffff',
          }}
        >
          {sectionLabels.map((label) => (
            <div
              key={`measure-section-${label}`}
              ref={(node) => {
                if (node) {
                  sectionMeasureRefs.current[label] = node;
                }
              }}
            >
              <SectionTitle>{label}</SectionTitle>
            </div>
          ))}

          {blocks.map((block) => (
            <div
              key={`measure-block-${block.id}`}
              ref={(node) => {
                if (node) {
                  blockMeasureRefs.current[block.id] = node;
                }
              }}
            >
              <ResumeBlock block={block} />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={exportRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-100000px',
          top: 0,
          width: `${PAGE_WIDTH}px`,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {pages.map((page, index) => (
          <div key={`resume-page-export-${index + 1}`} data-resume-page style={{ marginBottom: 0 }}>
            <ResumePaper page={page} />
          </div>
        ))}
      </div>
    </div>
  );
}

const headingRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '18px',
};

const itemTitleStyle = {
  fontSize: '15px',
  lineHeight: 1.35,
  fontWeight: 700,
  color: '#111827',
};

const metaStyle = {
  fontSize: '12.5px',
  lineHeight: 1.4,
  fontWeight: 600,
  color: '#6b7280',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

const bodyTextStyle = {
  margin: 0,
  fontSize: '13.5px',
  lineHeight: 1.6,
  color: '#374151',
};

const bodyParagraphStyle = {
  ...bodyTextStyle,
  margin: 0,
};

const listStyle = {
  margin: '8px 0 0',
  paddingLeft: '18px',
  fontSize: '13.5px',
  lineHeight: 1.6,
  color: '#374151',
};

const listItemStyle = {
  marginBottom: '3px',
};
