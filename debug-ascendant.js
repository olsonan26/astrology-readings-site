
import { calculateAllPlanets } from './src/core/astronomy.js';

// Test Date: July 17, 1992
// Test Location: Los Angeles (User's seemingly likely location or standard test)
// Lat: 34.0522, Lon: -118.2437
const START_DATE = '1992-07-17';
const LAT = 34.0522;
const LON = -118.2437;

console.log('--- DEBUGGING ASCENDANT CALCULATION ---');

// Case 1: 8:01 AM
const dateAM = new Date(`${START_DATE}T08:01:00`);
const chartAM = calculateAllPlanets(dateAM, LAT, LON);
console.log(`\n8:01 AM Local Time:`);
console.log(`Ascendant Sign: ${chartAM.angles.ascendant.sign}`);
console.log(`Sun Sign: ${chartAM.planets.sun.sign}`);
console.log(`Sun House: ${chartAM.planets.sun.house}`);

// Case 2: 8:01 PM (20:01)
const datePM = new Date(`${START_DATE}T20:01:00`);
const chartPM = calculateAllPlanets(datePM, LAT, LON);
console.log(`\n8:01 PM Local Time:`);
console.log(`Ascendant Sign: ${chartPM.angles.ascendant.sign}`);
console.log(`Sun Sign: ${chartPM.planets.sun.sign}`);
console.log(`Sun House: ${chartPM.planets.sun.house}`);

// Check if Logic holds
if (chartAM.angles.ascendant.sign === 'cancer' || chartAM.angles.ascendant.sign === 'leo') {
    console.log('\n[INFO] 8:01 AM produces Cancer/Leo Rising (Expected for Sunrise/Morning)');
}

if (chartPM.angles.ascendant.sign === 'capricorn') {
    console.log('\n[INFO] 8:01 PM produces Capricorn Rising (Expected for Sunset)');
} else {
    console.log(`\n[ERROR] 8:01 PM produced ${chartPM.angles.ascendant.sign} Rising!`);
}
