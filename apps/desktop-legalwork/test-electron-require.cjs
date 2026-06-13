
const electron = require('electron');
console.log('electron keys:', Object.keys(electron).filter(k => k.includes('ative')).join(', '));
console.log('typeof nativeImage:', typeof electron.nativeImage);
