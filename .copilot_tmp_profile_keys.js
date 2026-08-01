const fs = require('fs');
const path = require('path');
const root = process.cwd();
const profileFile = path.join(root, 'src', 'app', 'profile', 'ProfileClient.tsx');
const enFile = path.join(root, 'src', 'locales', 'en.json');
const arFile = path.join(root, 'src', 'locales', 'ar.json');
const content = fs.readFileSync(profileFile, 'utf8');
const keys = new Set();
const regex = /t\(\"(profile_[^\"\\]+)\"\)/g;
let match;
while ((match = regex.exec(content)) !== null) {
  keys.add(match[1]);
}
const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arFile, 'utf8'));
const keysEn = new Set(Object.keys(en).filter(k => k.startsWith('profile_')));
const keysAr = new Set(Object.keys(ar).filter(k => k.startsWith('profile_')));
const missingInEn = [...keys].filter(k => !keysEn.has(k)).sort();
const missingInAr = [...keysEn].filter(k => !keysAr.has(k)).sort();
console.log('Missing in en.json:');
console.log(missingInEn.length ? missingInEn.join('\n') : '(none)');
console.log('---');
console.log('profile keys in en.json not in ar.json:');
console.log(missingInAr.length ? missingInAr.join('\n') : '(none)');
console.log('---');
console.log('Total profile keys used in ProfileClient:', keys.size);
console.log('Total profile keys in en.json:', keysEn.size);
console.log('Total profile keys in ar.json:', keysAr.size);
