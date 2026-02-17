/**
 * Astrology Readings - Main API
 * Complete chart generation with all ADS/FREE Theory calculations
 */

import { calculateAllPlanets } from './core/astronomy.js';
import { findAllAspects, checkCluster } from './engine/aspects.js';
import { interpretFullChart } from './engine/interpretation.js';
import { PLANET_SYMBOLS, SIGN_SYMBOLS, MAJOR_ASPECTS } from './core/constants.js';

/**
 * Generate a complete natal chart reading
 * @param {Object} birthData - Birth information
 * @param {Date} birthData.date - Birth date and time
 * @param {number} birthData.latitude - Birth location latitude
 * @param {number} birthData.longitude - Birth location longitude
 * @param {string} birthData.locationName - Human-readable location name
 * @returns {Object} Complete chart data with interpretations
 */
export function generateNatalChart(birthData) {
    const { date, latitude, longitude, locationName } = birthData;

    // 1. Calculate all planetary positions using Whole Sign Houses
    const chartData = calculateAllPlanets(date, latitude, longitude);

    // 2. Find all aspects using the Aspect Spectrum System
    const aspects = findAllAspects(chartData);

    // 3. Check for stelliums/satellitiums
    const clusters = checkCluster(chartData);

    // 4. Generate full PHSR interpretations
    const interpretations = interpretFullChart(chartData);

    // 5. Compile the complete reading
    return {
        meta: {
            generatedAt: new Date().toISOString(),
            system: 'ADS/FREE Theory',
            houseSystem: 'Whole Sign (mandatory)',
            birthData: {
                date: date.toISOString(),
                latitude,
                longitude,
                locationName: locationName || 'Unknown'
            }
        },

        chart: {
            ...chartData,
            planetSymbols: PLANET_SYMBOLS,
            signSymbols: SIGN_SYMBOLS
        },

        aspects: {
            list: aspects,
            summary: generateAspectSummary(aspects)
        },

        clusters: clusters,

        interpretations: interpretations,

        guidance: generateGuidance(chartData, aspects, interpretations)
    };
}

/**
 * Generate aspect summary by type
 */
function generateAspectSummary(aspects) {
    const summary = {
        conjunctions: [],
        oppositions: [],
        squares: [],
        trines: [],
        sextiles: [],
        quincunxes: [],
        semiSextiles: []
    };

    for (const aspect of aspects) {
        const key = aspect.type + 's';
        if (summary[key]) {
            summary[key].push({
                planets: `${aspect.planetOne.name} ${aspect.symbol} ${aspect.planetTwo.name}`,
                keyword: aspect.keyword,
                phase: aspect.phase,
                orb: aspect.orb + '°'
            });
        }
    }

    return summary;
}

/**
 * Generate personalized guidance based on chart
 */
function generateGuidance(chartData, aspects, interpretations) {
    const guidance = {
        strengths: [],
        challenges: [],
        lifeThemes: [],
        actionItems: []
    };

    // Analyze aspects for strengths and challenges
    for (const aspect of aspects) {
        const majorAspect = MAJOR_ASPECTS[aspect.type];

        if (majorAspect.nature === 'harmony' || majorAspect.nature === 'opportunity') {
            guidance.strengths.push({
                aspect: `${capitalize(aspect.planetOne.name)} ${aspect.symbol} ${capitalize(aspect.planetTwo.name)}`,
                description: `Natural flow between ${aspect.planetOne.name} and ${aspect.planetTwo.name}`,
                advice: aspect.resolution
            });
        } else if (majorAspect.nature === 'challenge' || majorAspect.nature === 'adjustment') {
            guidance.challenges.push({
                aspect: `${capitalize(aspect.planetOne.name)} ${aspect.symbol} ${capitalize(aspect.planetTwo.name)}`,
                perception: aspect.perception,
                reality: aspect.reality,
                resolution: aspect.resolution
            });
        }
    }

    // Identify retrograde planets for special guidance
    for (const [planet, data] of Object.entries(chartData.planets)) {
        if (data.motionState === 'retrograde') {
            const interp = interpretations.planets[planet];
            if (interp?.retrograde) {
                guidance.lifeThemes.push({
                    theme: `${capitalize(planet)} Retrograde: ${interp.retrograde.theme}`,
                    description: interp.retrograde.description,
                    gift: interp.retrograde.gift,
                    challenge: interp.retrograde.challenge
                });
            }
        }
    }

    // Generate action items from challenging aspects
    for (const challenge of guidance.challenges.slice(0, 3)) {
        guidance.actionItems.push({
            focus: challenge.aspect,
            action: challenge.resolution
        });
    }

    return guidance;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export for browser usage
if (typeof window !== 'undefined') {
    window.AstrologyReadings = {
        generateNatalChart
    };
}

export default { generateNatalChart };
