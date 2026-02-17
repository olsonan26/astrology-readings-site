const fs = require('fs');
let content = fs.readFileSync('src/engine/profile-report.js', 'utf8');

// Find line 496 and replace the problematic text
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("what") && lines[i].includes("completing")) {
        console.log('Found line', i + 1, ':', lines[i].substring(0, 100));
        // Replace with escaped apostrophe or just reword
        lines[i] = lines[i].replace(/what.*completing/, 'what is completing');
    }
}
content = lines.join('\n');
fs.writeFileSync('src/engine/profile-report.js', content, 'utf8');
console.log('Done fixing');
