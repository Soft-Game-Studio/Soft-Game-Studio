const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'data/knowledge');

// Load index
const indexPath = path.join(BASE_DIR, 'index.json');
if (!fs.existsSync(indexPath)) {
    console.error('CRITICAL: index.json not found!');
    process.exit(1);
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
console.log(`Loaded index.json with ${index.length} entries.`);

let errors = 0;

// Helper to load domain files
const domainCache = {};
const getDomainData = (domain) => {
    if (domainCache[domain]) return domainCache[domain];

    const filePath = path.join(BASE_DIR, `${domain}.json`);
    if (!fs.existsSync(filePath)) {
        console.error(`ERROR: Domain file ${domain}.json not found.`);
        errors++;
        return null;
    }

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        domainCache[domain] = data;
        return data;
    } catch (e) {
        console.error(`ERROR: Failed to parse ${domain}.json`);
        errors++;
        return null;
    }
};

// Check each entry
index.forEach((entry, idx) => {
    if (!entry.source) {
        console.error(`Entry ${idx} missing source.`);
        errors++;
        return;
    }

    const parts = entry.source.split('.');
    const domain = parts[0];

    const data = getDomainData(domain);
    if (!data) return; // Error already logged

    let current = data;
    for (let i = 1; i < parts.length; i++) {
        if (current === undefined || current === null) {
            console.error(`Entry ${idx} (${entry.intent}): Path broken at '${parts[i - 1]}' -> '${parts[i]}'`);
            errors++;
            break;
        }
        current = current[parts[i]];
    }

    if (current === undefined) {
        console.error(`Entry ${idx} (${entry.intent}): Resolved to undefined for source '${entry.source}'`);
        errors++;
    }
});

if (errors === 0) {
    console.log('✅ Verification Passed: All index sources resolve correctly.');
    process.exit(0);
} else {
    console.error(`❌ Verification Failed with ${errors} errors.`);
    process.exit(1);
}
