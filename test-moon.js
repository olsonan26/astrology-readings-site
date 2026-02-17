// Test Moon calculation
import * as Astronomy from 'astronomy-engine';

const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

function testDate(dateStr, label) {
    const date = new Date(dateStr);
    console.log(`\n--- ${label} ---`);
    console.log('Local:', date.toString());
    console.log('UTC:', date.toISOString());

    const time = Astronomy.MakeTime(date);

    // Moon
    const moonEcliptic = Astronomy.EclipticGeoMoon(time);
    const moonSignIdx = Math.floor(moonEcliptic.lon / 30);
    const moonDegree = moonEcliptic.lon % 30;
    console.log(`Moon: ${signs[moonSignIdx]} ${moonDegree.toFixed(1)}° (raw: ${moonEcliptic.lon.toFixed(2)}°)`);

    // Sun
    const sunPos = Astronomy.SunPosition(time);
    const sunSignIdx = Math.floor(sunPos.elon / 30);
    const sunDegree = sunPos.elon % 30;
    console.log(`Sun: ${signs[sunSignIdx]} ${sunDegree.toFixed(1)}° (raw: ${sunPos.elon.toFixed(2)}°)`);
}

// Test with explicit UTC times for July 17, 1992
testDate('1992-07-17T00:00:00Z', 'July 17, 1992 00:00 UTC (midnight UTC)');
testDate('1992-07-17T12:00:00Z', 'July 17, 1992 12:00 UTC (noon UTC)');
testDate('1992-07-18T03:01:00Z', 'July 18, 1992 03:01 UTC (= 8:01 PM PDT July 17)');

// Also test what the user might have expected - when Moon was in Sagittarius
testDate('1992-07-11T03:01:00Z', 'July 11, 1992 - checking if Moon was in Sagittarius');
testDate('1992-07-12T03:01:00Z', 'July 12, 1992');
testDate('1992-07-13T03:01:00Z', 'July 13, 1992');
