export const LINKEDIN_URL = 'https://www.linkedin.com/in/sachin-panchal-b8ab03215?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app';

const monthMap = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function parseMonthToken(token = '') {
  return monthMap[token.trim().toLowerCase()] ?? null;
}

function normalizeDash(value = '') {
  return value.replace(/[\u2013\u2014]/g, '-');
}

export function splitDescription(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function parseDurationToRange(duration = '') {
  const normalized = normalizeDash(duration);
  const match = normalized.match(/([A-Za-z]+)\s+(\d{4})\s*-\s*([A-Za-z]+|Present)\s*(\d{4})?/i);

  if (!match) {
    return null;
  }

  const startMonth = parseMonthToken(match[1]);
  const startYear = Number.parseInt(match[2], 10);
  const endToken = match[3];
  const isPresent = /present/i.test(endToken);
  const endMonth = isPresent ? new Date().getMonth() : parseMonthToken(endToken);
  const endYear = isPresent ? new Date().getFullYear() : Number.parseInt(match[4], 10);

  if (startMonth === null || Number.isNaN(startYear) || endMonth === null || Number.isNaN(endYear)) {
    return null;
  }

  return {
    startMonth,
    startYear,
    endMonth,
    endYear,
  };
}

export function calculateMonthsFromDuration(duration = '') {
  const range = parseDurationToRange(duration);

  if (!range) {
    return 0;
  }

  const startTotal = (range.startYear * 12) + range.startMonth;
  const endTotal = (range.endYear * 12) + range.endMonth;
  return Math.max(0, (endTotal - startTotal) + 1);
}

export function calculateTotalExperienceMonths(experience = []) {
  return experience.reduce((total, item) => total + calculateMonthsFromDuration(item?.duration || ''), 0);
}

export function formatMonthsAsExperience(totalMonths = 0, short = false) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (short) {
    if (years > 0 && months > 0) {
      return `${years}y ${months}m`;
    }
    if (years > 0) {
      return `${years}y`;
    }
    return months > 0 ? `${months}m` : '0m';
  }

  if (years > 0 && months > 0) {
    return `${years} yr ${months} mo`;
  }
  if (years > 0) {
    return years === 1 ? '1 yr' : `${years} yrs`;
  }
  return months === 1 ? '1 mo' : `${months} mos`;
}

export function formatRoleDuration(duration = '') {
  const months = calculateMonthsFromDuration(duration);
  if (!months) {
    return duration;
  }
  return `${normalizeDash(duration)} • ${formatMonthsAsExperience(months)}`;
}

export function normalizeProfile(profile = {}) {
  return {
    ...profile,
    socialLinks: {
      ...(profile.socialLinks || {}),
      linkedin: LINKEDIN_URL,
    },
  };
}

export function normalizeEducationEntry(entry = {}) {
  const next = { ...entry };
  const isBTech = /bachelor of technology|b\.?tech/i.test(next.degree || '');
  const needsCompletionCopy = /expected|pursu/i.test(next.year || '') || /pursu/i.test(next.description || '');

  if (isBTech) {
    next.degree = 'Bachelor of Technology (Computer Science & Engineering)';
  }

  if (isBTech && needsCompletionCopy) {
    next.year = 'Completed June 2025 • First Division';
    next.description = 'B.Tech in Computer Science & Engineering completed with First Division.';
  }

  return next;
}

export function normalizeEducationList(education = []) {
  return education.map((entry) => normalizeEducationEntry(entry));
}

