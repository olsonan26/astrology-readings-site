/**
 * Astrology Readings - Core Constants
 * Based on ADS (Astronomical Doctrine of Signatures) and FREE Theory
 */

// ============================================
// PLANETARY ORBS (Reach Values)
// ============================================
// ============================================
// PLANETARY ORBS (Reach Values - Strict Limits)
// ============================================
export const PLANETARY_ORBS = {
  sun: 10,      // User specified: 10°
  moon: 3,      // User specified: 3° (Strict)
  mercury: 5,   // Standard
  venus: 5,     // Standard
  mars: 5,      // Standard
  jupiter: 6,   // Reduced from 9
  saturn: 8,    // Updated to 8 per Part 2 transcript
  uranus: 4,    // Reduced from 5
  neptune: 4,   // Reduced from 5
  pluto: 2,     // User specified: 2° (Strict Limit)
  chiron: 1.5,  // User specified: 1.5° (Asteroid)
  meanLilith: 1.5, // Asteroid/Point
  trueLilith: 1.5  // Asteroid/Point
};

// ============================================
// PLANETARY TIERS (Classification)
// ============================================
export const PLANETARY_TIERS = {
  ultrapersonal: ['sun', 'moon'],
  personal: ['mercury', 'venus'],
  extrapersonal: ['mars'],
  transpersonal: ['jupiter', 'saturn'],
  metapersonal: ['uranus', 'neptune', 'pluto'],
  other: ['chiron', 'meanLilith', 'trueLilith']
};

export const PLANET_TO_TIER = {
  sun: 'ultrapersonal',
  moon: 'ultrapersonal',
  mercury: 'personal',
  venus: 'personal',
  mars: 'extrapersonal',
  jupiter: 'transpersonal',
  saturn: 'transpersonal',
  uranus: 'metapersonal',
  neptune: 'metapersonal',
  pluto: 'metapersonal',
  chiron: 'other',
  meanLilith: 'other',
  trueLilith: 'other'
};

// ============================================
// ZODIAC SIGNS (in order)
// ============================================
export const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

export const SIGN_SYMBOLS = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
};

export const PLANET_SYMBOLS = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
  mars: '♂', jupiter: '♃', saturn: '♄', uranus: '♅',
  neptune: '♆', pluto: '♇',
  chiron: '⚷', meanLilith: '⚸', trueLilith: '⚸'
};

// ============================================
// SIGN RULERS (Traditional + Modern)
// ============================================
export const SIGN_RULERS = {
  aries: 'mars',
  taurus: 'venus',
  gemini: 'mercury',
  cancer: 'moon',
  leo: 'sun',
  virgo: 'mercury',
  libra: 'venus',
  scorpio: 'pluto',      // Modern (Traditional: Mars)
  sagittarius: 'jupiter',
  capricorn: 'saturn',
  aquarius: 'uranus',    // Modern (Traditional: Saturn)
  pisces: 'neptune'      // Modern (Traditional: Jupiter)
};

// ============================================
// ELEMENTS & MODALITIES
// ============================================
export const SIGN_ELEMENTS = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water'
};

export const SIGN_MODALITIES = {
  aries: 'cardinal', cancer: 'cardinal', libra: 'cardinal', capricorn: 'cardinal',
  taurus: 'fixed', leo: 'fixed', scorpio: 'fixed', aquarius: 'fixed',
  gemini: 'mutable', virgo: 'mutable', sagittarius: 'mutable', pisces: 'mutable'
};

// ============================================
// ASPECTS (Major + Creative Quintiles)
// Based on Uber Newbie Basics & Course 3 transcript
// ============================================
export const MAJOR_ASPECTS = {
  conjunction: { degrees: 0, symbol: '☌', nature: 'power', keyword: 'TOGETHER', maxOrb: null },
  semiSextile: { degrees: 30, symbol: '⚺', nature: 'growth', keyword: 'HARD STOP', maxOrb: 2 },
  sextile: { degrees: 60, symbol: '⚹', nature: 'companion', keyword: 'COMPANION', maxOrb: 2 },
  quintile: { degrees: 72, symbol: 'Q', nature: 'creative', keyword: 'CREATIVE MANIFESTOR', maxOrb: 2 },
  square: { degrees: 90, symbol: '□', nature: 'growth', keyword: 'CONFLICT/GROWTH', maxOrb: null },
  trine: { degrees: 120, symbol: '△', nature: 'direct', keyword: 'DIRECT EFFECT', maxOrb: null },
  biQuintile: { degrees: 144, symbol: 'bQ', nature: 'creative', keyword: 'INTERNAL PROBLEM-SOLVER', maxOrb: 2 },
  quincunx: { degrees: 150, symbol: '⚻', nature: 'toggle', keyword: 'TOGGLE', maxOrb: 2 },
  opposition: { degrees: 180, symbol: '☍', nature: 'balance', keyword: 'COUNTERBALANCE', maxOrb: null }
};

// ============================================
// MOTION STATES
// ============================================
export const MOTION_STATES = {
  prograde: { name: 'Prograde', description: 'Normal forward motion - energy flows outward naturally' },
  pregrade: { name: 'Pre-grade', description: 'Slowing before retrograde - preparing for internal review' },
  retrograde: { name: 'Retrograde', description: 'Inward motion - internalized energy, review period' },
  postgrade: { name: 'Post-grade', description: 'Implementing after retrograde - integrating lessons learned' }
};

// ============================================
// DECANS (Traditional - 10° subdivisions)
// ============================================
export const DECANS = {
  aries: ['aries', 'leo', 'sagittarius'],
  taurus: ['taurus', 'virgo', 'capricorn'],
  gemini: ['gemini', 'libra', 'aquarius'],
  cancer: ['cancer', 'scorpio', 'pisces'],
  leo: ['leo', 'sagittarius', 'aries'],
  virgo: ['virgo', 'capricorn', 'taurus'],
  libra: ['libra', 'aquarius', 'gemini'],
  scorpio: ['scorpio', 'pisces', 'cancer'],
  sagittarius: ['sagittarius', 'aries', 'leo'],
  capricorn: ['capricorn', 'taurus', 'virgo'],
  aquarius: ['aquarius', 'gemini', 'libra'],
  pisces: ['pisces', 'cancer', 'scorpio']
};

// ============================================
// HOUSE THEMES (Fields) - with beginner explanations
// ============================================
export const HOUSE_THEMES = {
  1: {
    name: 'Emergence/Vitality Anchor',
    keywords: ['physical body', 'immediate reaction', 'emergence', 'survival style'],
    beginnerExplanation: 'The "Vitality Anchor"—your physical body and your immediate reaction to the world. It is the style in which your authentic self first emerged into a potentially stressful reality.'
  },
  2: {
    name: 'Internal Value/Resources',
    keywords: ['self-worth', 'personal resources', 'consumption', 'survival security'],
    beginnerExplanation: 'Your "Internal Value." It is not just money, but your sense of self-worth that was forged in response to how you were valued as a child.'
  },
  3: {
    name: 'Mental Identity/Local Field',
    keywords: ['processing style', 'local environment', 'early learning', 'communication as safety'],
    beginnerExplanation: 'The "Local Field"—how your mind learned to process information and communicate to navigate your immediate childhood environment.'
  },
  4: {
    name: 'Emotional Foundations/Roots',
    keywords: ['mother attachment', 'home environment', 'private roots', 'foundational safety'],
    beginnerExplanation: 'Your "Foundational Safety"—the roots of your emotional world and your primary attachment (often the mother). It is the base from which you grow.'
  },
  5: {
    name: 'Vitality Spark/Authentic Play',
    keywords: ['creative expression', 'romance', 'risk', 'the inner child'],
    beginnerExplanation: 'The "Vitality Spark"—where you seek to be "seen" and where your inner child expresses its authentic joy and creative risk.'
  },
  6: {
    name: 'Daily Reality/Efficiency',
    keywords: ['routine', 'daily work', 'health as stress management', 'service'],
    beginnerExplanation: 'The "Daily Reality"—how you manage the survival burdens of life. It reveals your relationship to efficiency and how stress manifests in your daily routine.'
  },
  7: {
    name: 'Submergence/The Mirror',
    keywords: ['partnership', 'marriage', 'contracts', 'the other as reflection'],
    beginnerExplanation: 'The "Mirror of the Other"—how you submerge your individual self into partnerships. It reveals your adaptations for maintaining attachment in one-on-one relationships.'
  },
  8: {
    name: 'Intimacy/Deep Psychology',
    keywords: ['shared power', 'intimacy', 'transformation', 'unconscious bonding'],
    beginnerExplanation: 'The "Deep Bond"—where your ego dissolves into shared resources or psychological intimacy. It is where you face your deepest fears and transformations.'
  },
  9: {
    name: 'Expansion/The Search for Meaning',
    keywords: ['philosophy', 'higher learning', 'belief systems', 'flight from the local'],
    beginnerExplanation: 'The "Search for Meaning"—your drive to expand beyond your early environment to find a larger philosophical or spiritual truth.'
  },
  10: {
    name: 'Authority/Public Identity',
    keywords: ['career as status', 'public reputation', 'father energy', 'legitimacy'],
    beginnerExplanation: 'The "Public Identity"—how you seek legitimacy and authority in the world. It often reflects your adaptation to the expectations of "the father" or society.'
  },
  11: {
    name: 'Community/Future Vision',
    keywords: ['hopes', 'networks', 'group attachment', 'social contribution'],
    beginnerExplanation: 'The "Social Field"—where you seek a sense of belonging in a larger community and how you envision your future contribution to the collective.'
  },
  12: {
    name: 'The Subconscious/Sacred Isolation',
    keywords: ['hidden self', 'spirituality', 'dissolution', 'undoing of ego'],
    beginnerExplanation: 'The "Sacred Isolation"—the place where you keep what was "hidden" to survive. It is your direct line to the subconscious and the spiritual dissolution of the self.'
  }
};
