/**
 * Calculate Cassie's Chart
 * Born: Aug 11, 1997 at 3:00 PM in Red Deer, Alberta, Canada
 */

import { calculateAllPlanets, findAllAspects } from './dist/astrology-bundle.js';

// Red Deer, Alberta coordinates
const latitude = 52.2681;
const longitude = -113.8111;

// Birth date: Aug 11, 1997, 3:00 PM local time
const birthDate = new Date(1997, 7, 11, 15, 0, 0); // Month is 0-indexed (7 = August)

console.log('========================================');
console.log('CASSIE\'S CHART CALCULATION');
console.log('========================================');
console.log('Birth Data:');
console.log('  Date: August 11, 1997');
console.log('  Time: 3:00 PM (15:00)');
console.log('  Location: Red Deer, Alberta, Canada');
console.log('  Coordinates:', latitude, longitude);
console.log('  JavaScript Date:', birthDate.toString());
console.log('  UTC:', birthDate.toISOString());
console.log('========================================\n');

try {
    const chart = calculateAllPlanets(birthDate, latitude, longitude);
    const aspects = findAllAspects(chart);

    console.log('CHART RESULTS:\n');

    // Debug: log the full chart structure
    console.log('Chart Structure:', JSON.stringify(chart, null, 2).substring(0, 500));

    console.log('\nANGLES:');
    if (chart.angles) {
        if (chart.angles.ascendant) {
            console.log('  Ascendant:', chart.angles.ascendant.sign?.toUpperCase() || 'N/A',
                chart.angles.ascendant.degrees?.toFixed(2) || chart.angles.ascendant.degree?.toFixed(2) || 'N/A');
        }
        if (chart.angles.midheaven) {
            console.log('  Midheaven:', chart.angles.midheaven.sign?.toUpperCase() || 'N/A',
                chart.angles.midheaven.degrees?.toFixed(2) || chart.angles.midheaven.degree?.toFixed(2) || 'N/A');
        }
        if (chart.angles.descendant) {
            console.log('  Descendant:', chart.angles.descendant.sign?.toUpperCase() || 'N/A',
                chart.angles.descendant.degrees?.toFixed(2) || chart.angles.descendant.degree?.toFixed(2) || 'N/A');
        }
        if (chart.angles.ic) {
            console.log('  IC:', chart.angles.ic.sign?.toUpperCase() || 'N/A',
                chart.angles.ic.degrees?.toFixed(2) || chart.angles.ic.degree?.toFixed(2) || 'N/A');
        }
    }

    console.log('\nPLANETS:');
    for (const [name, data] of Object.entries(chart.planets)) {
        console.log(`  ${name.toUpperCase().padEnd(10)}: ${data.sign.toUpperCase().padEnd(12)} ${data.degrees.toFixed(2)}° in House ${data.house}`);
    }

    console.log('\nHOUSES (Whole Sign):');
    for (let i = 1; i <= 12; i++) {
        const house = chart.houses[i];
        console.log(`  House ${i}: ${house.sign.toUpperCase()}`);
    }

    console.log('\nCURRENT TRANSITS (Jan 28, 2026):');
    const now = new Date(2026, 0, 28); // Current date
    const transits = calculateAllPlanets(now, latitude, longitude);

    console.log('  Uranus:', transits.planets.uranus.sign.toUpperCase(),
        transits.planets.uranus.degrees.toFixed(2) + '°');

    // Check if North Node exists (South Node is opposite)
    if (transits.planets.northNode) {
        console.log('  North Node:', transits.planets.northNode.sign.toUpperCase(),
            transits.planets.northNode.degrees.toFixed(2) + '°');

        // Calculate opposite sign for South Node
        const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
            'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        const northIndex = signs.indexOf(transits.planets.northNode.sign);
        const southIndex = (northIndex + 6) % 12;
        console.log('  South Node (calculated):', signs[southIndex].toUpperCase());
    }

    console.log('\n✅ VERIFICATION FOR READING:');
    console.log('  1. Rising Sign:', chart.angles.ascendant.sign.toUpperCase());
    console.log('  2. 6th House (Work):', chart.houses[6].sign.toUpperCase());
    console.log('  3. 11th House (Friends):', chart.houses[11].sign.toUpperCase());
    console.log('  4. Moon Sign:', chart.planets.moon.sign.toUpperCase(), '~', chart.planets.moon.degrees.toFixed(0) + '°');
    console.log('  5. Moon in House:', chart.planets.moon.house);
    console.log('  6. Uranus Transit:', transits.planets.uranus.sign.toUpperCase());

} catch (error) {
    console.error('ERROR:', error);
    console.error(error.stack);
}
