/**
 * MANIFESTATION & TRANSMUTATION ENGINE
 * Based on Rebel Academy Class #5
 * 
 * Core Philosophy:
 * "What you believe is what you achieve."
 * - Sun: Your "Why", Happiness, and Vitality (The Goal).
 * - Pluto: Your "Power Source", Obsession, and Regeneration (The Engine).
 * - Chiron: Your "Blocker", Wound, and Limitation ( The Obstacle).
 * - Transmutation: Turning "Hard Aspects" (Squares/Oppositions) into kinetic energy.
 */

import { SIGN_ELEMENTS, SIGN_RULERS, HOUSE_THEMES, PLANET_SYMBOLS } from '../core/constants.js';

export function calculateManifestationProfile(chart, aspects) {
    const sun = chart.planets.sun;
    const pluto = chart.planets.pluto;
    const chiron = chart.planets.chiron; // Ensure Chiron is calculated in main app
    const moon = chart.planets.moon;
    const neptune = chart.planets.neptune;

    return {
        core: {
            why: getSunManifestation(sun),
            power: getPlutoPower(pluto),
            blocker: getChironBlocker(chiron),
            fear: getFearProfile(moon, neptune)
        },
        transmutation: findTransmutableAspects(aspects),
        divineTiming: calculateProgressions(chart)
    };
}

/**
 * DIVINE TIMING: Progressions
 * Rule: The Sun moves ~1 degree per year.
 * This determines the "Current Life Season".
 */
function calculateProgressions(chart) {
    const birthYear = chart.birthData ? new Date(chart.birthData.date).getFullYear() : new Date().getFullYear() - 30; // Fallback if no date
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    const sun = chart.planets.sun;
    const signs = [
        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
        'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    // Calculate total degrees from 0 Aries
    let startSignIndex = signs.indexOf(sun.sign.toLowerCase());
    let startAbsDegree = (startSignIndex * 30) + parseFloat(sun.degree);

    // Add 1 degree per year
    let progressedAbsDegree = startAbsDegree + age;

    // Normalize to 0-360
    progressedAbsDegree = progressedAbsDegree % 360;

    // Find new sign
    const newSignIndex = Math.floor(progressedAbsDegree / 30);
    const newSign = signs[newSignIndex];
    const newDegree = Math.floor(progressedAbsDegree % 30);

    return {
        age: age,
        natalSign: sun.sign,
        progressedSign: newSign,
        progressedDegree: newDegree,
        seasonTheme: getSeasonTheme(newSign),
        guidance: `You were born to be **${sun.sign}**, but right now you are in your **${newSign} Season** (Age ${age}). This is the "Divine Timing" overlay. You must use ${newSign} methods to achieve your ${sun.sign} goals.`
    };
}

function getSeasonTheme(sign) {
    const themes = {
        aries: "Action & Initiation",
        taurus: "Building & Stabilizing",
        gemini: "Learning & Connecting",
        cancer: "Nurturing & Home",
        leo: "Shining & Creating",
        virgo: "Refining & Perfecting",
        libra: "Relating & Balancing",
        scorpio: "Transforming & Deepening",
        sagittarius: "Expanding & Exploring",
        capricorn: "Achieving & Structuring",
        aquarius: "Innovating & Liberating",
        pisces: "Dreaming & Releasing"
    };
    return themes[sign] || "Growth";
}

/**
 * SUN: The "Why" - Happiness & Vitality
 */
function getSunManifestation(sun) {
    const desires = {
        aries: "Autonomy, Conquest, and Being First",
        taurus: "Stability, sensual pleasure, and material abundance",
        gemini: "Variety, Connection, and Intellectual Stimulation",
        cancer: "Emotional Safety, Family, and Nurturing",
        leo: "Recognition, Creative Expression, and Legacy",
        virgo: "Order, Service, and Perfection",
        libra: "Harmony, Partnership, and Beauty",
        scorpio: "Deep Intimacy, Power, and Transformation",
        sagittarius: "Freedom, Adventure, and Wisdom",
        capricorn: "Respect, Achievement, and Structure",
        aquarius: "Innovation, Community, and Uniqueness",
        pisces: "Spiritual Connection, Unity, and Dreams"
    };

    return {
        sign: sun.sign,
        house: sun.house,
        desire: desires[sun.sign] || "Self-Expression",
        guidance: `To truly manifest, you must align with your **${sun.sign}** nature. You aren't happy unless you have **${desires[sun.sign]}**. Don't manifest for others; manifest for this.`
    };
}

/**
 * PLUTO: The "Power Source" - Obsession & Regeneration
 */
function getPlutoPower(pluto) {
    const powers = {
        aries: "Unstoppable Willpower",
        taurus: "Unshakable Persistence",
        gemini: "Psychological Deconstruction",
        cancer: "Emotional Resilience",
        leo: "Creative domination",
        virgo: "Critical Analysis",
        libra: "Strategic Diplomacy",
        scorpio: "Total Transformation",
        sagittarius: "Ideological Zeal",
        capricorn: "Authoritative Control",
        aquarius: "Revolutionary Change",
        pisces: "Spiritual Dissolution"
    };

    return {
        sign: pluto.sign,
        house: pluto.house,
        powerType: powers[pluto.sign] || "Transformation",
        guidance: `Your superpower is **${powers[pluto.sign]}**. When you need to push through a wall, channel this energy in the **${HOUSE_THEMES[pluto.house].name}** sector.`
    };
}

/**
 * CHIRON: The "Blocker" - Wounds & Limitations
 */
function getChironBlocker(chiron) {
    if (!chiron) return null;

    const wounds = {
        aries: "Fear of taking up space",
        taurus: "Fear of scarcity/loss",
        gemini: "Fear of being unintelligent",
        cancer: "Fear of clear abandonement",
        leo: "Fear of being ignored",
        virgo: "Fear of imperfection",
        libra: "Fear of conflict/isolation",
        scorpio: "Fear of betrayal/powerlessness",
        sagittarius: "Fear of meaninglessness",
        capricorn: "Fear of failure/status loss",
        aquarius: "Fear of not belonging",
        pisces: "Fear of boundaries/reality"
    };

    return {
        sign: chiron.sign,
        house: chiron.house,
        wound: wounds[chiron.sign] || "Deep Insecurity",
        guidance: `Your manifestation is often blocked by a **${wounds[chiron.sign]}**. Acknowledge this wound in the **${HOUSE_THEMES[chiron.house].name}** area, but do not let it drive the car.`
    };
}

/**
 * FEAR PROFILE: Moon (Conditioning) + Neptune (The Unknown)
 */
function getFearProfile(moon, neptune) {
    return {
        emotionalFear: `Comfort zone addiction (${moon.sign})`,
        abstractFear: `Fear of the fog/unknown (${neptune.sign})`
    };
}

/**
 * TRANSMUTATION: Finding the "Hard" aspects to use as fuel
 * Squares = Friction/Action
 * Oppositions = Tension/Balance
 */
function findTransmutableAspects(aspects) {
    // Filter for Squares (90) and Oppositions (180) involving personal planets
    const hardAspects = aspects.filter(a =>
        (a.type === 'square' || a.type === 'opposition') &&
        (isPersonal(a.planetOne.name) || isPersonal(a.planetTwo.name))
    );

    // Sort by tightness of orb (most potent first)
    hardAspects.sort((a, b) => parseFloat(a.orb) - parseFloat(b.orb));

    return hardAspects.slice(0, 3).map(aspect => ({
        pair: `${aspect.planetOne.name} ${aspect.symbol} ${aspect.planetTwo.name}`,
        type: aspect.type,
        planets: [aspect.planetOne.name, aspect.planetTwo.name],
        guidance: generateTransmutationGuidance(aspect)
    }));
}

function isPersonal(planetName) {
    return ['sun', 'moon', 'mercury', 'venus', 'mars'].includes(planetName);
}

function generateTransmutationGuidance(aspect) {
    const p1 = aspect.planetOne.name;
    const p2 = aspect.planetTwo.name;

    if (aspect.type === 'square') {
        return `This **Square** creates friction between **${p1}** and **${p2}**. Friction creates HEAT. Use this heat to propel you forward. Don't avoid the conflict—lean into it to generate momentum.`;
    } else {
        return `This **Opposition** creates a tug-of-war. You are oscillating between **${p1}** and **${p2}**. Stop swinging and become the fulcrum. Use the tension to launch yourself like a slingshot.`;
    }
}
