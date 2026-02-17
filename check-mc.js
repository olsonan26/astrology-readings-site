
import { calculateAllPlanets } from './src/core/astronomy.js';

const date = new Date('1992-07-17T20:01:00');
const LAT = 33.8031;
const LON = -118.0726;

const chart = calculateAllPlanets(date, LAT, LON);

console.log(`Ascendant (AC): ${chart.angles.ascendant.sign}`);
console.log(`Midheaven (MC): ${chart.angles.midheaven.sign}`);
console.log(`Sun Sign: ${chart.planets.sun.sign} | House: ${chart.planets.sun.house}`);
console.log(`Moon Sign: ${chart.planets.moon.sign} | House: ${chart.planets.moon.house}`);
