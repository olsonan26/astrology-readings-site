
// Mock Astronomy Engine for the vector part cause we can't import easily in a standalone test script without modules setup
// We will just test the Helio position logic first, or approximate the Earth vector.
// Actually, let's try to run as Module using .mjs extension

import * as Astronomy from 'astronomy-engine';

const CHIRON_ELEMENTS = {
    a: 13.70,        // Semi-major axis (AU)
    e: 0.383,        // Eccentricity
    i: 6.93,         // Inclination (deg)
    om: 209.39,      // Longitude of Ascending Node (deg)
    w: 339.56,       // Argument of Perihelion (deg)
    M0: 72.84,       // Mean Anomaly at Epoch (deg)
    n: 0.0197        // Mean Motion (deg/day)
};

function degToRad(deg) { return deg * (Math.PI / 180); }
function radToDeg(rad) { return rad * (180 / Math.PI); }

function getChironLongitude(date) {
    const j2000 = new Date('2000-01-01T12:00:00Z');
    const dayMs = 1000 * 60 * 60 * 24;
    const daysSinceJ2000 = (date - j2000) / dayMs;
    const time = Astronomy.MakeTime(date);

    // 1. Calculate Mean Anomaly (M)
    let M = CHIRON_ELEMENTS.M0 + (CHIRON_ELEMENTS.n * daysSinceJ2000);
    M = degToRad(M);

    // 2. Solve Kepler's Equation for Eccentric Anomaly (E)
    let E = M;
    const e = CHIRON_ELEMENTS.e;
    for (let k = 0; k < 10; k++) {
        const deltaM = M - (E - e * Math.sin(E));
        const deltaE = deltaM / (1 - e * Math.cos(E));
        E = E + deltaE;
        if (Math.abs(deltaE) < 1e-6) break;
    }

    // 3. Radius Vector (r) and True Anomaly (v)
    const a = CHIRON_ELEMENTS.a;
    const x_orb = a * (Math.cos(E) - e);
    const y_orb = a * Math.sqrt(1 - e * e) * Math.sin(E);

    // 4. Transform to Helio-Centric Ecliptic
    const i = degToRad(CHIRON_ELEMENTS.i);
    const om = degToRad(CHIRON_ELEMENTS.om);
    const w = degToRad(CHIRON_ELEMENTS.w);

    const cos_om = Math.cos(om);
    const sin_om = Math.sin(om);
    const cos_w = Math.cos(w);
    const sin_w = Math.sin(w);
    const cos_i = Math.cos(i);
    const sin_i = Math.sin(i);

    const Px = cos_w * cos_om - sin_w * sin_om * cos_i;
    const Py = cos_w * sin_om + sin_w * cos_om * cos_i;
    const Pz = sin_w * sin_i;

    const Qx = -sin_w * cos_om - cos_w * sin_om * cos_i;
    const Qy = -sin_w * sin_om + cos_w * cos_om * cos_i;
    const Qz = cos_w * sin_i;

    // Helio Coordinates
    const x_helio = x_orb * Px + y_orb * Qx;
    const y_helio = x_orb * Py + y_orb * Qy;
    // const z_helio = x_orb * Pz + y_orb * Qz;

    // 5. Earth Vector (using Astronomy Engine)
    const earthVector = Astronomy.HelioVector(Astronomy.Body.Earth, time);

    // 6. Geocentric
    const x_geo = x_helio - earthVector.x;
    const y_geo = y_helio - earthVector.y;

    // 7. Longitude
    let lonRad = Math.atan2(y_geo, x_geo);
    let lonDeg = radToDeg(lonRad);

    lonDeg = lonDeg % 360;
    if (lonDeg < 0) lonDeg += 360;

    return lonDeg;
}

// MEAN LILITH CHECK
function getMeanLilithLongitude(date) {
    const j2000 = new Date('2000-01-01T12:00:00Z');
    const dayMs = 1000 * 60 * 60 * 24;
    const daysSinceJ2000 = (date - j2000) / dayMs;
    // J. Meeus formula: 297.8502 + 0.11140356 * days
    let lon = 297.8501921 + (0.1114040803 * daysSinceJ2000);
    lon = lon % 360;
    if (lon < 0) lon += 360;
    return lon;
}

function getSign(lon) {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[Math.floor(lon / 30)];
}

// TEST CASE
// July 17, 1992, 8:01 PM Los Alamitos
// UTC: July 18, 1992, 03:01:00
const testDate = new Date('1992-07-18T03:01:00Z');

console.log(`Test Date: ${testDate.toISOString()}`);
const chironLon = getChironLongitude(testDate);
const lilithLon = getMeanLilithLongitude(testDate);

console.log(`Chiron Longitude: ${chironLon.toFixed(2)} (${getSign(chironLon)})`);
console.log(`Mean Lilith Longitude: ${lilithLon.toFixed(2)} (${getSign(lilithLon)})`);

// Expected Chiron 1992: Leo (~120-150)
// Expected Lilith 1992: Capricorn or Aquarius? 
