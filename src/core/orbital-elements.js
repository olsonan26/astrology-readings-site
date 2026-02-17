/**
 * Orbital Elements and Ephemeris Data
 * Provides interpolated positions for Chiron and Mean Lilith (1950-2050)
 */

// ==========================================
// DATA POINTS (Jan 1st of each year)
// ==========================================

// Chiron Longitude (Approximate Geocentric)
// Corrected for 1990s accuracy
const CHIRON_DATA = {
    1950: 265, // Sag
    1952: 275,
    1955: 295, // Cap
    1960: 332, // Pisces
    1965: 355, // Pisces/Aries
    1968: 10,  // Aries
    1970: 25,  // Aries
    1975: 48,  // Taurus
    1980: 60,  // Gemini (Aphelion slow)
    1985: 85,  // Gemini/Cancer
    1988: 102, // Cancer
    1990: 112, // Cancer 22
    1991: 122, // Leo 2
    1992: 128, // Leo 8
    1993: 139, // Leo 19
    1994: 154, // Virgo 4
    1995: 174, // Virgo 24
    1996: 192, // Libra 12 (Perihelion Fast)
    1997: 212, // Scorpio 2
    1998: 232, // Scorpio 22
    1999: 250, // Sag 10
    2000: 265, // Sag 25
    2005: 295, // Cap
    2010: 330, // Pisces
    2015: 355, // Pisces
    2020: 10,  // Aries
    2025: 30,  // Aries
    2030: 55,  // Taurus
    2040: 95   // Cancer
};

// ==========================================
// INTERPOLATION LOGIC
// ==========================================

export function getChironLongitude(date) {
    const year = date.getUTCFullYear();
    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const dayOfYear = (date - startOfYear) / (1000 * 60 * 60 * 24);
    const fraction = dayOfYear / 365.25;

    // Get Start and End values
    const p1 = getChironPoint(year);
    const p2 = getChironPoint(year + 1);

    // Linear Interpolation
    let lon = interpolate(p1, p2, fraction);
    return normalize(lon);
}

export function getMeanLilithLongitude(date) {
    // Mean Lilith Motion: ~40.69 degrees/year
    // Reference: Jan 1 1992 approx Capricorn 18 (288.0)
    // Formula: L = L0 + rate * years_since_epoch
    const epoch = new Date('1992-01-01T00:00:00Z');
    const dayMs = 1000 * 60 * 60 * 24;
    const daysSinceEpoch = (date - epoch) / dayMs;
    const yearsSince = daysSinceEpoch / 365.25;

    const L0 = 288.0; // Capricorn 18
    const rate = 40.6903;

    let lon = L0 + (rate * yearsSince);
    return normalize(lon);
}

// Helper: Get Chiron point from map or interpolate if missing
function getChironPoint(year) {
    if (CHIRON_DATA[year]) return CHIRON_DATA[year];

    // Find nearest neighbors
    const years = Object.keys(CHIRON_DATA).map(Number).sort((a, b) => a - b);

    // Extrapolate if out of bounds (simple clamp for now, or projection)
    if (year < years[0]) return CHIRON_DATA[years[0]];
    if (year > years[years.length - 1]) return CHIRON_DATA[years[years.length - 1]];

    // Interpolate between gaps
    let y1, y2;
    for (let i = 0; i < years.length - 1; i++) {
        if (year > years[i] && year < years[i + 1]) {
            y1 = years[i];
            y2 = years[i + 1];
            break;
        }
    }

    if (y1 && y2) {
        const span = y2 - y1;
        const frac = (year - y1) / span;
        const val1 = CHIRON_DATA[y1];
        const val2 = CHIRON_DATA[y2];
        return interpolate(val1, val2, frac);
    }

    return 0; // Fallback
}

function interpolate(v1, v2, fraction) {
    // Handle wrapping (350 -> 10 should move forward +20, not back -340)
    let diff = v2 - v1;
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;

    return v1 + (diff * fraction);
}

function normalize(deg) {
    deg = deg % 360;
    if (deg < 0) deg += 360;
    return deg;
}
