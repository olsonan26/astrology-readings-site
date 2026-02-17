
const esbuild = require('esbuild');

console.log("Starting Build...");

esbuild.build({
    entryPoints: ['bundle-entry.js'],
    bundle: true,
    outfile: 'dist/astrology-bundle.js',
    format: 'esm',
    platform: 'browser',
    logLevel: 'info'
}).then(() => {
    console.log("Build OK!");
}).catch((e) => {
    console.error("Build Failed:", e);
    process.exit(1);
});
