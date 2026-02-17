
import { calculateAllPlanets } from './src/core/astronomy.js';

// Test: July 17, 1992, 8:01 PM, Los Alamitos, CA
const DATE_STR = '1992-07-17T20:01:00';
const LAT = 33.8031; // Los Alamitos
const LON = -118.0726;

console.log('--- VERIFYING EARTH ARC (HOUSE POSITIONS) ---');

const date = new Date(DATE_STR);
const chart = calculateAllPlanets(date, LAT, LON);

console.log(`Ascendant: ${chart.angles.ascendant.sign} (${chart.angles.ascendant.longitude.toFixed(2)}°)`);

// SUN
const sun = chart.planets.sun;
console.log(`\nSUN:`);
console.log(`- Zodiac Sign: ${sun.sign}`);
console.log(`- House: ${sun.house}`);
console.log(`- Earth Arc Identity (Expected: Libra/7th): ${sun.house === 7 ? 'MATCH (Libra)' : 'MISMATCH'}`);

// MOON
const moon = chart.planets.moon;
console.log(`\nMOON:`);
console.log(`- Zodiac Sign: ${moon.sign}`);
console.log(`- House: ${moon.house}`);
console.log(`- Earth Arc Identity (Expected: Gemini/3rd): ${moon.house === 3 ? 'MATCH (Gemini)' : 'MISMATCH'}`);

// CHIRON (Need to find where Chiron is to explain "Scorpio base")
// Since astrology-engine might not have Chiron, checking implied logic.
console.log(`\nNote: Checking for Chiron or 8th house occupants...`);
const house8Planets = Object.entries(chart.planets).filter(([k, v]) => v.house === 8).map(([k]) => k);
console.log(`Planets in 8th House (Scorpio Energy): ${house8Planets.join(', ') || 'None'}`);

// Check 1st House for "Base"
const house1Planets = Object.entries(chart.planets).filter(([k, v]) => v.house === 1).map(([k]) => k);
console.log(`Planets in 1st House (Capricorn Energy): ${house1Planets.join(', ') || 'None'}`);
