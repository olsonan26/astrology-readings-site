/**
 * Astrology Readings - Browser Bundle Entry Point
 * This file imports all modules and exposes them for browser use
 */

// Core modules
export {
    PLANETARY_ORBS, PLANETARY_TIERS, PLANET_TO_TIER, ZODIAC_SIGNS,
    SIGN_SYMBOLS, PLANET_SYMBOLS, SIGN_RULERS, SIGN_ELEMENTS,
    SIGN_MODALITIES, MAJOR_ASPECTS, MOTION_STATES, DECANS, HOUSE_THEMES
} from './src/core/constants.js';

export {
    dateToAstroTime, getGeocentricLongitude, normalizeDegrees,
    getSignFromLongitude, getDegreeInSign, getDecan,
    calculateLST, calculateAscendant, calculateMidheaven,
    calculateWholeSignHouses, getHouseFromLongitude, getMotionState,
    calculateAllPlanets
} from './src/core/astronomy.js';

export {
    checkAspect, determineAspectPhase, analyzeAspect,
    findAllAspects, checkCluster
} from './src/engine/aspects.js';

export {
    interpretPlacement, traceRulership, interpretAngles,
    interpretFullChart
} from './src/engine/interpretation.js';

// Re-export main API
export { generateNatalChart } from './src/index.js';

// Export Lenses System and Rich Aspects
export { LENSES_PHILOSOPHY, LOVE_LENS, CAREER_LENS, CHILDREN_LENS } from './src/data/class4-lenses-system.js';
export { COURSE_3_ASPECTS } from './src/data/course3-aspect-library.js';
export { ChatEngine } from './src/engine/chat-engine.js';
export { calculateManifestationProfile } from './src/engine/manifestation.js';
export { calculateMoneyProfile } from './src/engine/money.js';
export { generateProfileReport, generateReportHTML } from './src/engine/profile-report.js';
export { TRANSCRIPT_KNOWLEDGE, searchKnowledge } from './src/data/transcript-knowledge.js';
export {
    DISCOVERY_CATEGORIES, FOLLOW_UP_QUESTIONS, ANALYSIS_ROUTING,
    buildAnalysisPlan, inferPlanFromQuestion, generateFocusedReading,
    SessionContext
} from './src/engine/question-discovery.js';
export { generateDeepReport, generateDeepReportHTML } from './src/engine/deep-report.js';
