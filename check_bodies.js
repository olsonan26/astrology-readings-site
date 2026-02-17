
const Astronomy = require('astronomy-engine');

console.log('Available Bodies:');
try {
    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron', 'Lilith', 'MeanLilith', 'TrueLilith'];

    bodies.forEach(body => {
        try {
            const bodyObj = Astronomy.Body[body];
            if (bodyObj) {
                console.log(`${body}: Supported`);
                // Try a calc
                const date = new Date();
                const time = Astronomy.MakeTime(date);
                const vec = Astronomy.GeoVector(bodyObj, time, true);
                console.log(` - Calculation successful for ${body}`);
            } else {
                console.log(`${body}: NOT in Astronomy.Body enumeration`);
            }
        } catch (e) {
            console.log(`${body}: Error accessing or calculating - ${e.message}`);
        }
    });

} catch (err) {
    console.error('General Error:', err);
}
