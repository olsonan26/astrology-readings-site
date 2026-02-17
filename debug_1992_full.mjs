
import { getChironLongitude, getMeanLilithLongitude } from './src/core/orbital-elements.js';
import { calculateAscendant, calculateWholeSignHouses, getGeocentricLongitude } from './src/core/astronomy.js';
import { ZODIAC_SIGNS } from './src/core/constants.js';

// Test Date: July 17 1992 8:01 PM Los Alamitos
// UTC: July 18 03:01:00
const date = new Date('1992-07-18T03:01:00Z');
const lat = 33.8031; // Los Alamitos
const lng = -118.0726;

// 1. Calculate Bodies
const chironLon = getChironLongitude(date);
const lilithLon = getMeanLilithLongitude(date);

// 2. Calculate ASC (Using Astronomy Engine via astronomy.js helper if possible, or Mock)
// calculateAscendant requires LST. Let's rely on the body positions first.
// I'll assume ASC is roughly Capricorn 25 based on analysis.
// Let's print the Lons.

console.log('--- DEBUG 1992-07-17 ---');
console.log(`Date: ${date.toISOString()}`);
console.log(`Chiron Lon: ${chironLon.toFixed(2)} (${getSign(chironLon)})`);
console.log(`Lilith Lon: ${lilithLon.toFixed(2)} (${getSign(lilithLon)})`);

function getSign(lon) {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[Math.floor(lon / 30)];
}
