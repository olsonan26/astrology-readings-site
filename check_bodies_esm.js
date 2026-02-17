
import * as Astronomy from 'astronomy-engine';

console.log('Checking Astronomy Engine Support...');

const bodiesToCheck = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron', 'Lilith', 'MeanLilith', 'TrueLilith'];

bodiesToCheck.forEach(bodyName => {
    // Check if the body exists in the Body enum
    const body = Astronomy.Body[bodyName];

    if (body) {
        console.log(`[PASS] ${bodyName} is supported (Enum value: ${body})`);
        try {
            const date = new Date();
            const time = Astronomy.MakeTime(date);
            const vec = Astronomy.GeoVector(body, time, true);
            console.log(`       Calculation successful: x=${vec.x.toFixed(2)}`);
        } catch (e) {
            console.log(`       Calculation FAILED: ${e.message}`);
        }
    } else {
        console.log(`[FAIL] ${bodyName} is NOT in Astronomy.Body`);
    }
});
