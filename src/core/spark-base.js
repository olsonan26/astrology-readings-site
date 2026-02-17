/**
 * ALCHEMYSTIC ASTROLOGY: SPARK & BASE CALCULATIONS
 * 
 * This module calculates the "True Identity" of placements using:
 * 1. SPARK (Entry Point): The secondary sign derived from the degree.
 * 2. BASE (Energy Source): The house archetype where the planet's ruled sign falls.
 * 
 * These are NOT standard astrology. This is the advanced layer.
 */

import { ZODIAC_SIGNS, SIGN_RULERS } from './constants.js';

// ============================================
// SPARK CALCULATION
// ============================================

/**
 * Calculate the "Spark" (Entry Point) for a planet.
 * The Spark is the sign the planet operates FROM, derived from its degree.
 * 
 * Rules:
 * - ODD Signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius): Count from Aries.
 * - EVEN Signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces): Count from Libra.
 * - Formula: (Degree ÷ 12) = Quotient with Remainder. Count forward by Remainder.
 * 
 * @param {string} sign - The zodiac sign the planet is in (e.g., 'cancer')
 * @param {number} degreeInSign - The degree within that sign (0-29.99)
 * @returns {object} Spark information
 */
export function calculateSpark(sign, degreeInSign) {
    const signIndex = ZODIAC_SIGNS.indexOf(sign.toLowerCase());
    if (signIndex === -1) return null;

    // Determine if the sign is ODD (1,3,5,7,9,11) or EVEN (2,4,6,8,10,12)
    // signIndex is 0-indexed, so we add 1 for the natural count
    const isEven = (signIndex + 1) % 2 === 0;

    // Starting point for counting
    // ODD signs start from Aries (index 0)
    // EVEN signs start from Libra (index 6)
    const startIndex = isEven ? 6 : 0;

    // Calculate the Spark offset
    // Divide the degree by 12 to get the number of signs to count forward
    const sparkOffset = Math.floor(degreeInSign / 12);

    // Calculate the Spark sign index
    const sparkIndex = (startIndex + sparkOffset) % 12;
    const sparkSign = ZODIAC_SIGNS[sparkIndex];

    return {
        spark: sparkSign,
        sparkSymbol: getSparkSymbol(sparkSign),
        tone: sign, // The original sign is the "Tone" or "Paint"
        calculation: {
            originalSign: capitalize(sign),
            degree: degreeInSign.toFixed(2),
            isEven: isEven,
            startSign: isEven ? 'Libra' : 'Aries',
            offset: sparkOffset,
            formula: `${Math.floor(degreeInSign)} ÷ 12 = ${Math.floor(degreeInSign / 12)} remainder ${Math.floor(degreeInSign) % 12}`
        },
        interpretation: `While the "paint" (Tone) is ${capitalize(sign)}, the operating system (Spark) is ${capitalize(sparkSign)}.`
    };
}

// ============================================
// BASE CALCULATION
// ============================================

/**
 * Calculate the "Base" (Energy Source) for a planet.
 * The Base is the house archetype where the planet's RULED SIGN falls in the chart.
 * 
 * Example: Sun rules Leo. In a Capricorn Rising chart, Leo is the 8th House.
 *          8th House Archetype = Scorpio. So the Sun's Base is Scorpio.
 * 
 * @param {string} planetName - The planet (e.g., 'sun')
 * @param {object} houses - The houses object from the chart (keyed by number)
 * @returns {object} Base information
 */
export function calculateBase(planetName, houses) {
    // Find the sign(s) this planet rules
    const ruledSigns = [];
    for (const [sign, ruler] of Object.entries(SIGN_RULERS)) {
        if (ruler === planetName.toLowerCase()) {
            ruledSigns.push(sign);
        }
    }

    if (ruledSigns.length === 0) {
        // Planets like Chiron or Lilith don't rule signs in the standard model
        return {
            base: null,
            interpretation: `${capitalize(planetName)} does not rule a standard sign, so Base is N/A.`
        };
    }

    // Find which house(s) contain the ruled sign(s)
    const bases = ruledSigns.map(ruledSign => {
        for (const [houseNum, houseData] of Object.entries(houses)) {
            if (houseData.sign === ruledSign) {
                // The Base is the ARCHETYPE of this house
                const houseNumber = parseInt(houseNum);
                const baseSign = ZODIAC_SIGNS[houseNumber - 1]; // House 1 = Aries (index 0), etc.
                return {
                    ruledSign: capitalize(ruledSign),
                    houseNumber: houseNumber,
                    baseSign: capitalize(baseSign)
                };
            }
        }
        return null;
    }).filter(Boolean);

    if (bases.length === 0) {
        return {
            base: null,
            interpretation: `Could not determine Base for ${capitalize(planetName)}.`
        };
    }

    // For planets that rule one sign (most), take the first. For Mercury/Venus (two), list both.
    const primaryBase = bases[0];

    return {
        base: primaryBase.baseSign.toLowerCase(),
        baseSymbol: getSparkSymbol(primaryBase.baseSign.toLowerCase()),
        ruledSign: primaryBase.ruledSign,
        houseNumber: primaryBase.houseNumber,
        allBases: bases,
        interpretation: `${capitalize(planetName)} rules ${primaryBase.ruledSign}, which is the ${ordinal(primaryBase.houseNumber)} House (${primaryBase.baseSign} Archetype). The Base is ${primaryBase.baseSign}.`
    };
}

// ============================================
// FULL IDENTITY CALCULATION
// ============================================

/**
 * Calculate the full Alchemystic identity for a planet placement.
 * Returns Tone, Spark, Field, and Base.
 * 
 * @param {string} planetName - The planet name
 * @param {object} planetData - The planet's data (sign, degreeInSign, house)
 * @param {object} houses - The chart's houses
 * @returns {object} Full identity breakdown
 */
export function calculateFullIdentity(planetName, planetData, houses) {
    const spark = calculateSpark(planetData.sign, planetData.degreeInSign);
    const base = calculateBase(planetName, houses);

    return {
        planet: capitalize(planetName),

        // Standard PHSR components
        tone: capitalize(planetData.sign), // S - Sign
        field: planetData.house, // H - House

        // Advanced Alchemystic components
        spark: spark?.spark ? capitalize(spark.spark) : null,
        base: base?.base ? capitalize(base.base) : null,

        // Detailed breakdown
        sparkDetails: spark,
        baseDetails: base,

        // Narrative summary
        summary: generateIdentitySummary(planetName, planetData, spark, base)
    };
}

/**
 * Generate a narrative summary of the full identity.
 */
function generateIdentitySummary(planetName, planetData, spark, base) {
    let summary = `**${capitalize(planetName)}**: `;

    if (spark?.spark) {
        summary += `${capitalize(spark.spark)} ${capitalize(planetName)}`;
        if (spark.tone !== spark.spark) {
            summary += ` (with ${capitalize(spark.tone)} paint)`;
        }
    } else {
        summary += `${capitalize(planetData.sign)} ${capitalize(planetName)}`;
    }

    if (base?.base) {
        summary += ` with a ${capitalize(base.base)} Base`;
    }

    summary += `.`;

    return summary;
}

// ============================================
// TRAUMA TIMELINE CALCULATION
// ============================================

/**
 * Calculate significant ages based on planetary cycles and progressions.
 * This helps identify when trauma or significant events likely occurred.
 * 
 * @param {object} chartData - The full chart data
 * @returns {array} Timeline of significant ages
 */
export function calculateTraumaTimeline(chartData) {
    const timeline = [];

    // Saturn Squares (Ages ~7, ~14, ~21 - Challenge/Growth)
    timeline.push({
        ageRange: '7-8',
        event: 'First Saturn Square',
        description: 'First major test of authority and structure. Early discipline/punishment themes.',
        type: 'saturn'
    });
    timeline.push({
        ageRange: '14-15',
        event: 'Saturn Opposition',
        description: 'Peak rebellion/teenage crisis. Identity vs. Authority conflict.',
        type: 'saturn'
    });
    timeline.push({
        ageRange: '21-22',
        event: 'Third Saturn Square',
        description: 'Transition to adulthood. Taking on adult responsibilities.',
        type: 'saturn'
    });
    timeline.push({
        ageRange: '28-30',
        event: 'Saturn Return',
        description: 'Major life restructuring. End of "youth" phase.',
        type: 'saturn'
    });

    // Jupiter Cycles (12-year expansion/philosophy shifts)
    timeline.push({
        ageRange: '11-12',
        event: 'First Jupiter Return',
        description: 'First expansion of belief systems. Puberty. "Becoming aware."',
        type: 'jupiter'
    });
    timeline.push({
        ageRange: '23-24',
        event: 'Second Jupiter Return',
        description: 'Philosophy solidifies. Seeking truth and higher education.',
        type: 'jupiter'
    });

    // Chiron (Wound Activation)
    // Note: Chiron's cycle is ~50 years, but key aspects happen earlier
    timeline.push({
        ageRange: '12-13',
        event: 'Chiron Square (Waxing)',
        description: 'First major wound activation. Insecurities become conscious.',
        type: 'chiron'
    });
    timeline.push({
        ageRange: '20-21',
        event: 'Chiron Opposition',
        description: 'Wound is reflected back through relationships/others.',
        type: 'chiron'
    });

    // Lilith Cycle (~9 years)
    timeline.push({
        ageRange: '9',
        event: 'First Lilith Return',
        description: 'First cycle of suppressed instincts. Shadow begins to form.',
        type: 'lilith'
    });
    timeline.push({
        ageRange: '18',
        event: 'Second Lilith Return',
        description: 'Shadow themes resurface. Sexuality/power dynamics. "Coming out" of hiding.',
        type: 'lilith'
    });

    // Sort by starting age
    timeline.sort((a, b) => parseInt(a.ageRange) - parseInt(b.ageRange));

    return timeline;
}

/**
 * Calculate specific trauma ages based on chart indicators.
 * Uses Chiron, Lilith, and Saturn placements to narrow down.
 * 
 * @param {object} chartData - The full chart data
 * @returns {array} Specific trauma indicators
 */
export function calculateSpecificTraumaIndicators(chartData) {
    const indicators = [];
    const chiron = chartData.planets.chiron;
    const lilith = chartData.planets.meanLilith;
    const saturn = chartData.planets.saturn;

    // If Chiron is in a sensitive house (4th, 8th, 12th)
    if (chiron && [4, 8, 12].includes(chiron.house)) {
        indicators.push({
            planet: 'Chiron',
            house: chiron.house,
            ageRange: '11-13 and 20-22',
            description: `Chiron in House ${chiron.house} suggests deep wounding in ${getHouseTheme(chiron.house)}. Activation likely around first square and opposition.`,
            severity: 'high'
        });
    }

    // If Lilith is conjunct Moon (within 8 degrees)
    if (lilith && chartData.planets.moon) {
        const moonLong = chartData.planets.moon.longitude;
        const lilithLong = lilith.longitude;
        const diff = Math.abs(moonLong - lilithLong);
        const normalizedDiff = diff > 180 ? 360 - diff : diff;

        if (normalizedDiff <= 8) {
            indicators.push({
                planet: 'Lilith-Moon Conjunction',
                house: lilith.house,
                ageRange: '9, 18, 27',
                description: 'Lilith conjunct Moon fuses Safety and Shame. Mother-wound or early gender-based trauma likely. Recurring at 9-year intervals.',
                severity: 'high'
            });
        }
    }

    // Saturn in 4th or 8th House
    if (saturn && [4, 8].includes(saturn.house)) {
        indicators.push({
            planet: 'Saturn',
            house: saturn.house,
            ageRange: '7, 14, 21, 29',
            description: `Saturn in House ${saturn.house} suggests authority/father issues tied to ${getHouseTheme(saturn.house)}. Discipline events at Saturn squares.`,
            severity: 'medium'
        });
    }

    return indicators;
}

// ============================================
// DELEGATE FLOW ANALYSIS
// ============================================

/**
 * Analyze how energy flows from one house to another through Delegation.
 * This is the "Why" behind patterns.
 * 
 * Example: Sun in 7th rules 8th (Leo on 8th). Trauma (8th) is delegated to Partnership (7th).
 * 
 * @param {string} planetName - The planet to analyze
 * @param {object} planetData - The planet's data
 * @param {object} houses - The chart's houses
 * @returns {object} Delegate flow analysis
 */
export function analyzeDelegateFlow(planetName, planetData, houses) {
    const base = calculateBase(planetName, houses);

    if (!base?.houseNumber) {
        return {
            flow: null,
            interpretation: `Cannot trace delegate flow for ${capitalize(planetName)}.`
        };
    }

    const sourceHouse = base.houseNumber;
    const placementHouse = planetData.house;

    // The flow is: Source House → Placement House
    const flow = {
        source: {
            house: sourceHouse,
            theme: getHouseTheme(sourceHouse),
            archetype: capitalize(ZODIAC_SIGNS[sourceHouse - 1])
        },
        destination: {
            house: placementHouse,
            theme: getHouseTheme(placementHouse),
            archetype: capitalize(ZODIAC_SIGNS[placementHouse - 1])
        }
    };

    return {
        planet: capitalize(planetName),
        flow: flow,
        interpretation: `${capitalize(planetName)} pulls its energy from the ${ordinal(sourceHouse)} House (${flow.source.theme}) and delegates it into the ${ordinal(placementHouse)} House (${flow.destination.theme}). This means that ${flow.source.theme.toLowerCase()} themes are unconsciously pushed into ${flow.destination.theme.toLowerCase()} matters.`,
        warning: sourceHouse === 8 || sourceHouse === 12 ?
            `⚠️ The source is House ${sourceHouse} (${flow.source.theme}). This often indicates deep psychological material being delegated into conscious life.` : null
    };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getSparkSymbol(sign) {
    const symbols = {
        aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
        leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
        sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
    };
    return symbols[sign.toLowerCase()] || '';
}

function getHouseTheme(houseNumber) {
    const themes = {
        1: 'Self/Emergence',
        2: 'Value/Resources',
        3: 'Mind/Communication',
        4: 'Home/Roots/Mother',
        5: 'Vitality/Creation',
        6: 'Routine/Health',
        7: 'Partnership/Marriage',
        8: 'Trauma/Intimacy/Shared Resources',
        9: 'Expansion/Philosophy',
        10: 'Public Standing/Father',
        11: 'Future/Community',
        12: 'Subconscious/Hidden'
    };
    return themes[houseNumber] || `House ${houseNumber}`;
}

// ============================================
// EXPORT ALL
// ============================================

export default {
    calculateSpark,
    calculateBase,
    calculateFullIdentity,
    calculateTraumaTimeline,
    calculateSpecificTraumaIndicators,
    analyzeDelegateFlow
};
