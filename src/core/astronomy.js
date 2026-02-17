/**
 * Astrology Readings - Astronomy Calculations
 * Geocentric planetary positions using astronomy-engine
 */

import * as Astronomy from 'astronomy-engine';
import { ZODIAC_SIGNS, SIGN_RULERS } from './constants.js';
import { getChironLongitude, getMeanLilithLongitude } from './orbital-elements.js';

// ============================================
// CORE CALCULATION FUNCTIONS
// ============================================

/**
 * Convert Date to Astronomy.js AstroTime
 * IMPORTANT: The astronomy-engine expects dates to be in UTC.
 * JavaScript Date objects store time internally as UTC, so we use that directly.
 */
export function dateToAstroTime(date) {
    // Make sure we're using the exact UTC time from the Date object
    return Astronomy.MakeTime(date);
}

/**
 * Get geocentric ecliptic longitude for a body
 */
export function getGeocentricLongitude(body, date) {
    const time = dateToAstroTime(date);
    let lon;

    if (body === 'sun') {
        // SunPosition returns ecliptic coordinates directly
        const sunPos = Astronomy.SunPosition(time);
        lon = sunPos.elon;
    } else if (body === 'moon') {
        // Use EclipticGeoMoon for direct ecliptic coordinates of the Moon
        // This is the proper function for the Moon's ecliptic longitude
        const moonEcliptic = Astronomy.EclipticGeoMoon(time);
        lon = moonEcliptic.lon; // EclipticGeoMoon returns {lon, lat, dist}
    } else {
        const bodyName = body.charAt(0).toUpperCase() + body.slice(1);

        // Handle Alchemystic specific bodies not in standard library
        if (['Chiron', 'MeanLilith', 'TrueLilith'].includes(bodyName)) {
            if (['Chiron', 'MeanLilith', 'TrueLilith'].includes(bodyName)) {
                if (bodyName === 'Chiron') {
                    return getChironLongitude(date);
                }
                if (bodyName === 'MeanLilith') {
                    return getMeanLilithLongitude(date);
                }
                if (bodyName === 'TrueLilith') {
                    // Use mean for now as fallback, or implement oscillating if needed
                    return getMeanLilithLongitude(date);
                }
                return 0; // Fallback
            }
        }

        const geo = Astronomy.GeoVector(Astronomy.Body[bodyName], time, true);
        const ecliptic = Astronomy.Ecliptic(geo);
        lon = ecliptic.elon;
    }

    return normalizeDegrees(lon);
}

/**
 * Normalize degrees to 0-360 range
 */
export function normalizeDegrees(degrees) {
    let normalized = degrees % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
}

/**
 * Get zodiac sign from ecliptic longitude
 */
export function getSignFromLongitude(longitude) {
    const signIndex = Math.floor(longitude / 30);
    return ZODIAC_SIGNS[signIndex];
}

/**
 * Get degree within sign (0-29)
 */
export function getDegreeInSign(longitude) {
    return longitude % 30;
}

/**
 * Get decan (1, 2, or 3) from degree in sign
 */
export function getDecan(degreeInSign) {
    if (degreeInSign < 10) return 1;
    if (degreeInSign < 20) return 2;
    return 3;
}

// ============================================
// ASCENDANT & MIDHEAVEN CALCULATIONS
// ============================================

/**
 * Calculate Local Sidereal Time
 */
export function calculateLST(date, longitude) {
    const time = dateToAstroTime(date);
    const gmst = Astronomy.SiderealTime(time);
    const lst = gmst + (longitude / 15);
    return ((lst % 24) + 24) % 24; // Normalize to 0-24
}

/**
 * Calculate Ascendant (Rising Sign)
 * Using simplified formula with obliquity
 */
export function calculateAscendant(date, latitude, longitude) {
    const lst = calculateLST(date, longitude);
    const ramc = lst * 15; // Right Ascension of MC in degrees

    // Obliquity of ecliptic (approximate)
    const obliquity = 23.4397;

    // Convert to radians
    const latRad = latitude * Math.PI / 180;
    const oblRad = obliquity * Math.PI / 180;
    const ramcRad = ramc * Math.PI / 180;

    // Calculate Ascendant
    const y = Math.cos(ramcRad);
    const x = -(Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad));

    let asc = Math.atan2(y, x) * 180 / Math.PI;
    asc = normalizeDegrees(asc);

    return asc;
}

/**
 * Calculate Midheaven (MC)
 */
export function calculateMidheaven(date, longitude) {
    const lst = calculateLST(date, longitude);
    const ramc = lst * 15;

    const obliquity = 23.4397;
    const oblRad = obliquity * Math.PI / 180;
    const ramcRad = ramc * Math.PI / 180;

    let mc = Math.atan(Math.tan(ramcRad) / Math.cos(oblRad)) * 180 / Math.PI;

    // Ensure MC is in correct quadrant
    if (ramc >= 90 && ramc < 270) {
        mc += 180;
    } else if (ramc >= 270) {
        mc += 360;
    }

    return normalizeDegrees(mc);
}

// ============================================
// WHOLE SIGN HOUSE SYSTEM
// ============================================

/**
 * Calculate Whole Sign Houses
 * The entire sign containing the ASC becomes the 1st House
 * Each subsequent sign becomes the next house
 */
export function calculateWholeSignHouses(ascendant) {
    const ascSign = getSignFromLongitude(ascendant);
    const ascSignIndex = ZODIAC_SIGNS.indexOf(ascSign);

    const houses = {};

    for (let i = 0; i < 12; i++) {
        const houseNumber = i + 1;
        const signIndex = (ascSignIndex + i) % 12;
        const sign = ZODIAC_SIGNS[signIndex];

        houses[houseNumber] = {
            sign: sign,
            startDegree: signIndex * 30,
            endDegree: (signIndex + 1) * 30
        };
    }

    return houses;
}

/**
 * Get house number from ecliptic longitude (Whole Sign)
 */
export function getHouseFromLongitude(longitude, houses) {
    const sign = getSignFromLongitude(longitude);

    for (const [houseNum, houseData] of Object.entries(houses)) {
        if (houseData.sign === sign) {
            return parseInt(houseNum);
        }
    }

    return 1; // Default
}

// ============================================
// MOTION STATE DETECTION
// ============================================

/**
 * Check if planet is retrograde by comparing positions
 */
export function getMotionState(body, date) {
    if (body === 'sun' || body === 'moon') {
        return 'prograde'; // Luminaries never retrograde
    }

    const dayBefore = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    const dayAfter = new Date(date.getTime() + 24 * 60 * 60 * 1000);

    const longBefore = getGeocentricLongitude(body, dayBefore);
    const longNow = getGeocentricLongitude(body, date);
    const longAfter = getGeocentricLongitude(body, dayAfter);

    // Calculate daily motion (accounting for 0/360 boundary)
    const motionYesterday = calculateMotion(longBefore, longNow);
    const motionTomorrow = calculateMotion(longNow, longAfter);

    // Determine motion state
    if (motionYesterday < 0 && motionTomorrow < 0) {
        return 'retrograde';
    } else if (motionYesterday > 0 && motionTomorrow < 0) {
        return 'pregrade'; // Slowing down, about to go retrograde
    } else if (motionYesterday < 0 && motionTomorrow > 0) {
        return 'postgrade'; // Just went direct
    } else {
        // Check if speed is significantly reduced (pre/post grade threshold)
        const avgSpeed = getAverageDailyMotion(body);
        if (Math.abs(motionTomorrow) < avgSpeed * 0.3) {
            return motionTomorrow < 0 ? 'pregrade' : 'postgrade';
        }
        return 'prograde';
    }
}

/**
 * Calculate motion between two longitudes
 */
function calculateMotion(from, to) {
    let motion = to - from;
    if (motion > 180) motion -= 360;
    if (motion < -180) motion += 360;
    return motion;
}

/**
 * Get average daily motion for a planet
 */
function getAverageDailyMotion(body) {
    const speeds = {
        mercury: 1.2,
        venus: 1.0,
        mars: 0.5,
        jupiter: 0.08,
        saturn: 0.03,
        uranus: 0.01,
        neptune: 0.005,
        pluto: 0.004
    };
    return speeds[body] || 1;
}

// ============================================
// FULL PLANETARY POSITIONS
// ============================================

/**
 * Get all planetary positions for a given date/location
 */
export function calculateAllPlanets(date, latitude, longitude) {
    const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'meanLilith', 'trueLilith'];

    const ascendant = calculateAscendant(date, latitude, longitude);
    const midheaven = calculateMidheaven(date, longitude);
    const houses = calculateWholeSignHouses(ascendant);

    const positions = {};

    for (const planet of planets) {
        const longitude = getGeocentricLongitude(planet, date);
        const sign = getSignFromLongitude(longitude);
        const degreeInSign = getDegreeInSign(longitude);
        const house = getHouseFromLongitude(longitude, houses);
        const decan = getDecan(degreeInSign);
        const motionState = getMotionState(planet, date);

        positions[planet] = {
            longitude: longitude,
            sign: sign,
            degreeInSign: degreeInSign,
            degrees: Math.floor(degreeInSign),
            minutes: Math.round((degreeInSign % 1) * 60),
            house: house,
            decan: decan,
            motionState: motionState
        };
    }

    // ---------------------------------------------------------
    // ALCHEMYSTIC ASTROLOGY: TRUE PLACEMENT LAYERS (Pass 2)
    // ---------------------------------------------------------
    // Needed because Base calculation depends on houses of rulers
    for (const planet of planets) {
        const data = positions[planet];

        // 1. TONE: The Zodiac Sign
        data.tone = data.sign;

        // 2. FIELD: The House Number
        data.field = data.house;

        // 3. BASE (Source Code): House governed by the sign the planet rules
        // Get the sign this planet rules (e.g. Sun rules Leo)
        // Note: For modern planets, use modern rulership.
        // Reverse lookup SIGN_RULERS
        let signsRuled = [];
        for (const [s, ruler] of Object.entries(SIGN_RULERS)) {
            if (ruler === planet) signsRuled.push(s);
        }

        // If planet rules signs, find which HOUSE those signs are on.
        // If multiple signs (Mercury rules Gemini/Virgo), typically the one relevant to the chart or both?
        // Prompt says: "Identify the house governed by the sign the planet rules. (e.g., If Sun is in 7th, but Leo is the 8th House, the Base is 8th House)."
        // For dual rulership (Mercury), we likely list both or primary?
        // Let's pick the first one or join them if multiple.
        if (signsRuled.length > 0) {
            const baseHouses = signsRuled.map(s => {
                // Find house with this sign
                for (const [hNum, hData] of Object.entries(houses)) {
                    if (hData.sign === s) return hNum;
                }
                return '?';
            });
            data.base = baseHouses.join('/'); // e.g. "3/6" for Mercury
        } else {
            // For Chiron/Lilith (no rulership defined in SIGN_RULERS usually), Base is N/A or self?
            data.base = 'N/A';
        }

        // 4. SPARK (Entry Point): Modular Arithmetic
        // Logic: 
        // If Sign index is ODD (Aries=0, Gemini=2... Wait. Indices: Aries=0, Taurus=1, Gemini=2)
        // Prompt says: "If Sign is ODD (Aries, Gemini, etc.)"
        // Usually Aries is 1st sign (Odd), Taurus 2nd (Even).
        // Let's align with user's "Aries, Gemini" as ODD.
        // My array `ZODIAC_SIGNS` has Aries at 0.
        // So User's "Odd" corresponds to my even indices (0, 2, 4...) if 1-based counting.
        // Wait. Aries(1)=Odd. Gemini(3)=Odd.
        // My index: Aries=0, Gemini=2.
        // So `(index + 1) % 2 !== 0` is Odd.

        const signIndex = ZODIAC_SIGNS.indexOf(data.sign);
        const signNumber = signIndex + 1;
        const isOdd = signNumber % 2 !== 0;

        const remainder = data.degreeInSign % 12; // "Degree" likely means degree in sign? Or total longitude? Prompt: "Degree ÷ 12". Context implies degree of sign.
        // "Count Remainder forward from Aries (0) or Libra (0)."
        // Does "Count forward" mean signs or degrees?
        // "Start at Aries (0)... Count Remainder forward from Aries."
        // If remainder is 5. Aries + 5?
        // Usually "Spark" implies a sub-tone or degree.
        // "Calculate using Modular Arithmetic... Count Remainder forward".
        // Let's assume it returns a DEGREE value in the starting sign?
        // OR it returns a SIGN?
        // Let's assume it's a micro-zodiac logic.
        // If remainder is 5.5.
        // Odd -> Start Aries (0). + 5.5 degrees? Or 5.5 signs?
        // Given it's "Spark (Entry Point)", typically a specific degree or sign.
        // Let's interpret: "Count Remainder [Signs?] forward".
        // NO, "Degree / 12 = Remainder".
        // Wait. 25 / 12 = 2.08.
        // Remainder usually means Modulo. 25 % 12 = 1.
        // If degree is 13. 13 % 12 = 1.
        // If degree is 1. 1 % 12 = 1.
        // "Count Remainder forward from..."
        // Maybe it's counting *Degrees* from 0 of Aries/Libra?
        // "Spark" becomes "Aries 1°" or "Libra 1°".
        // Result is a position.

        let sparkStartSign = isOdd ? 'aries' : 'libra';
        let sparkDegree = remainder;
        data.spark = {
            sign: sparkStartSign,
            degree: sparkDegree,
            text: `${capitalize(sparkStartSign)} ${sparkDegree.toFixed(2)}°`
        };

        // 5. FUSION CUSP AREA (FCA)
        // Flag if between 28.5° and 1.5° (of next sign? i.e. 0-1.5° or 28.5-30°?)
        // Prompt: "Flag any planet between 28.5° and 1.5° of the next sign."
        // This implies [28.5, 30] OR [0, 1.5].
        if (data.degreeInSign >= 28.5 || data.degreeInSign <= 1.5) {
            data.isFCA = true;
            // Identify blended signs
            let prevSign = ZODIAC_SIGNS[(signIndex + 11) % 12];
            let nextSign = ZODIAC_SIGNS[(signIndex + 1) % 12];
            if (data.degreeInSign >= 28.5) {
                data.fcaBlend = `${data.sign}/${nextSign}`;
            } else {
                data.fcaBlend = `${prevSign}/${data.sign}`;
            }
        } else {
            data.isFCA = false;
        }

    }

    // Lilith Corridor Check
    // If Mean and True Lilith are in different signs
    if (positions['meanLilith'] && positions['trueLilith']) {
        if (positions['meanLilith'].sign !== positions['trueLilith'].sign) {
            positions['meanLilith'].isLilithCorridor = true;
            positions['trueLilith'].isLilithCorridor = true;
        }
    }

    return {
        planets: positions,
        angles: {
            ascendant: {
                longitude: ascendant,
                sign: getSignFromLongitude(ascendant),
                degreeInSign: getDegreeInSign(ascendant)
            },
            midheaven: {
                longitude: midheaven,
                sign: getSignFromLongitude(midheaven),
                degreeInSign: getDegreeInSign(midheaven)
            },
            descendant: {
                longitude: normalizeDegrees(ascendant + 180),
                sign: getSignFromLongitude(normalizeDegrees(ascendant + 180)),
                degreeInSign: getDegreeInSign(normalizeDegrees(ascendant + 180))
            },
            ic: {
                longitude: normalizeDegrees(midheaven + 180),
                sign: getSignFromLongitude(normalizeDegrees(midheaven + 180)),
                degreeInSign: getDegreeInSign(normalizeDegrees(midheaven + 180))
            }
        },
        houses: houses
    };
}


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
