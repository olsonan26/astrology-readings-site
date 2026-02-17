/**
 * Current Transits for Cassie - January 28, 2026
 * Comparing current planetary positions to her natal chart
 */

import { calculateAllPlanets } from './dist/astrology-bundle.js';

// Red Deer, Alberta coordinates
const latitude = 52.2681;
const longitude = -113.8111;

// Cassie's birth date
const birthDate = new Date(1997, 7, 11, 15, 0, 0);

// Current date - Jan 28, 2026
const now = new Date(2026, 0, 28);

console.log('==========================================================');
console.log('CASSIE\'S CURRENT TRANSITS - January 28, 2026');
console.log('==========================================================\n');

// Calculate natal chart
const natal = calculateAllPlanets(birthDate, latitude, longitude);

// Calculate current transits
const transits = calculateAllPlanets(now, latitude, longitude);

console.log('NATAL CHART REFERENCE:');
console.log('----------------------');
console.log('Rising: Scorpio');
console.log('Sun: Leo 19° (House 10)');
console.log('Moon: Scorpio 23° (House 1)');
console.log('Mercury: Virgo 14° (House 11)');
console.log('Venus: Virgo 23° (House 11)');
console.log('Mars: Libra 28° (House 12)');
console.log('Jupiter: Aquarius 16° (House 4)');
console.log('Saturn: Aries 20° (House 6)');
console.log('Uranus: Aquarius 6° (House 4)');
console.log('Neptune: Capricorn 28° (House 3)');
console.log('Pluto: Sagittarius 2° (House 2)');
console.log('Chiron: Scorpio 14° (House 1)');
console.log('\n==========================================================\n');

console.log('CURRENT TRANSITING PLANETS (Jan 28, 2026):');
console.log('-------------------------------------------');

// Helper to determine which natal house a transit is in
function getNatalHouse(transitSign) {
    const houses = {
        'scorpio': 1, 'sagittarius': 2, 'capricorn': 3, 'aquarius': 4,
        'pisces': 5, 'aries': 6, 'taurus': 7, 'gemini': 8,
        'cancer': 9, 'leo': 10, 'virgo': 11, 'libra': 12
    };
    return houses[transitSign];
}

for (const [planet, data] of Object.entries(transits.planets)) {
    const house = getNatalHouse(data.sign);
    console.log(`${planet.toUpperCase().padEnd(12)}: ${data.sign.toUpperCase().padEnd(12)} ${data.degrees.toFixed(2).padStart(6)}° → Transiting Cassie's House ${house}`);
}

console.log('\n==========================================================\n');

console.log('KEY TRANSITS TO NATAL PLANETS:');
console.log('-------------------------------');

// Check significant aspects (using 8° orb for transits)
function checkAspect(transitDeg, natalDeg, aspectDeg, orb = 8) {
    const diff = Math.abs(transitDeg - natalDeg);
    const diff360 = Math.abs(diff - 360);
    const actualDiff = Math.min(diff, diff360);

    if (Math.abs(actualDiff - aspectDeg) <= orb) {
        return actualDiff.toFixed(1);
    }
    return null;
}

const aspects = {
    0: 'Conjunction',
    60: 'Sextile',
    90: 'Square',
    120: 'Trine',
    180: 'Opposition'
};

// Check each transit against natal planets
const significantTransits = [];

for (const [tPlanet, tData] of Object.entries(transits.planets)) {
    for (const [nPlanet, nData] of Object.entries(natal.planets)) {
        for (const [aspectDeg, aspectName] of Object.entries(aspects)) {
            const diff = checkAspect(tData.longitude, nData.longitude, parseInt(aspectDeg));
            if (diff !== null) {
                significantTransits.push({
                    transit: tPlanet,
                    transitSign: tData.sign,
                    transitDeg: tData.degrees,
                    natal: nPlanet,
                    natalSign: nData.sign,
                    natalDeg: nData.degrees,
                    aspect: aspectName,
                    orb: diff
                });
            }
        }
    }
}

// Sort by orb (tightest aspects first)
significantTransits.sort((a, b) => parseFloat(a.orb) - parseFloat(b.orb));

if (significantTransits.length > 0) {
    significantTransits.forEach(t => {
        const house = getNatalHouse(t.transitSign);
        console.log(`\n🔥 Transit ${t.transit.toUpperCase()} ${t.aspect} Natal ${t.natal.toUpperCase()}`);
        console.log(`   ${t.transit} in ${t.transitSign.toUpperCase()} ${t.transitDeg.toFixed(0)}° (House ${house}) → ${t.aspect} → ${t.natal} in ${t.natalSign.toUpperCase()} ${t.natalDeg.toFixed(0)}°`);
        console.log(`   Orb: ${t.orb}°`);
    });
} else {
    console.log('No major aspects within 8° orb currently.');
}

console.log('\n==========================================================\n');

console.log('SLOW-MOVING TRANSITS (Most Important):');
console.log('---------------------------------------');

const slowMovers = ['saturn', 'uranus', 'neptune', 'pluto'];
slowMovers.forEach(planet => {
    if (transits.planets[planet]) {
        const data = transits.planets[planet];
        const house = getNatalHouse(data.sign);
        const natalData = natal.planets[planet];
        console.log(`\n${planet.toUpperCase()}:`);
        console.log(`  Transit: ${data.sign.toUpperCase()} ${data.degrees.toFixed(2)}° in House ${house}`);
        console.log(`  Natal: ${natalData.sign.toUpperCase()} ${natalData.degrees.toFixed(2)}° in House ${natalData.house}`);
    }
});

console.log('\n==========================================================\n');
console.log('HOUSE FOCUS (Where the action is):');
console.log('-----------------------------------');

const houseThemes = {
    1: 'Self, Identity, Physical Body',
    2: 'Money, Values, Self-Worth',
    3: 'Communication, Siblings, Short Trips',
    4: 'Home, Family, Roots, Private Life',
    5: 'Creativity, Romance, Children, Fun',
    6: 'Work, Health, Daily Routine, Service',
    7: 'Partnerships, Marriage, One-on-One',
    8: 'Transformation, Shared Resources, Sex, Death',
    9: 'Higher Education, Travel, Philosophy, Belief',
    10: 'Career, Public Life, Reputation, Authority',
    11: 'Friends, Groups, Networks, Hopes, Dreams',
    12: 'Subconscious, Hidden Enemies, Spirituality, Isolation'
};

const houseCounts = {};
for (let i = 1; i <= 12; i++) houseCounts[i] = [];

for (const [planet, data] of Object.entries(transits.planets)) {
    const house = getNatalHouse(data.sign);
    houseCounts[house].push(planet);
}

console.log('\nPlanets by House:');
for (let i = 1; i <= 12; i++) {
    if (houseCounts[i].length > 0) {
        console.log(`House ${i} (${houseThemes[i]}): ${houseCounts[i].map(p => p.toUpperCase()).join(', ')}`);
    }
}

console.log('\n==========================================================');
