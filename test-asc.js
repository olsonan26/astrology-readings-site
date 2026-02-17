// Test Ascendant calculation
import * as Astronomy from 'astronomy-engine';

const ZODIAC_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

function normalizeDegrees(degrees) {
    let normalized = degrees % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
}

function getSignFromLongitude(longitude) {
    const signIndex = Math.floor(longitude / 30);
    return ZODIAC_SIGNS[signIndex];
}

function calculateLST(date, longitude) {
    const time = Astronomy.MakeTime(date);
    const gmst = Astronomy.SiderealTime(time);
    const lst = gmst + (longitude / 15);
    return ((lst % 24) + 24) % 24;
}

function calculateAscendant(date, latitude, longitude) {
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

// Test for July 17, 1992, 8:01 PM PDT in Los Angeles
// Los Angeles: 34.0537° N, 118.2428° W
const LA_LAT = 34.0537;
const LA_LON = -118.2428;

console.log('Testing multiple times to find when ASC is in Sagittarius...\n');

// Test different times around 8:01 PM
const times = [
    { label: '6:00 PM PDT', hour: 18, min: 0 },
    { label: '7:00 PM PDT', hour: 19, min: 0 },
    { label: '7:30 PM PDT', hour: 19, min: 30 },
    { label: '8:01 PM PDT', hour: 20, min: 1 },
    { label: '8:30 PM PDT', hour: 20, min: 30 },
    { label: '9:00 PM PDT', hour: 21, min: 0 },
];

for (const t of times) {
    // PDT is UTC-7
    const utcHour = t.hour + 7;
    const day = utcHour >= 24 ? 18 : 17;
    const hour = utcHour % 24;

    const dateStr = `1992-07-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${t.min.toString().padStart(2, '0')}:00Z`;
    const testDate = new Date(dateStr);

    const ascendant = calculateAscendant(testDate, LA_LAT, LA_LON);
    const ascSign = getSignFromLongitude(ascendant);
    const ascDegreeInSign = ascendant % 30;

    console.log(`${t.label}: ${ascSign.toUpperCase()} ${ascDegreeInSign.toFixed(1)}° (${ascendant.toFixed(1)}°)`);
}
