
import { calculateAllPlanets } from './src/core/astronomy.js';
import { interpretFullChart } from './src/engine/interpretation.js';

// Test: July 17, 1992, 8:01 PM, Los Alamitos, CA
const DATE_STR = '1992-07-17T20:01:00';
const LAT = 33.8031;
const LON = -118.0726;

console.log('--- DEBUGGING INTERPRETATION ENGINE ---');

const date = new Date(DATE_STR);
const chart = calculateAllPlanets(date, LAT, LON);
const reading = interpretFullChart(chart);

const sunInterp = reading.planets.sun;

console.log('SUN INTERPRETATION DEBUG:');
console.log(`Sun House: ${sunInterp.house.number} (Type: ${sunInterp.house._debug_house_type})`);
console.log(`Knowledge Lookup Found: ${sunInterp.house._debug_lookup}`);
console.log(`Natural Sign: ${sunInterp.house.naturalSign}`);
console.log(`True Identity: ${sunInterp.house.trueIdentity}`);

if (sunInterp.house.trueIdentity === 'Libra') {
    console.log('[SUCCESS] True Identity logic is working in Engine.');
} else {
    console.log('[FAILURE] True Identity logic failed.');
}
