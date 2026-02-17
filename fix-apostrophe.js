const fs = require('fs');
let content = fs.readFileSync('src/engine/profile-report.js', 'utf8');
// Replace curly apostrophe with escaped version
content = content.replace(/what\u2019s/g, 'what is');
fs.writeFileSync('src/engine/profile-report.js', content, 'utf8');
console.log('Fixed apostrophe');
