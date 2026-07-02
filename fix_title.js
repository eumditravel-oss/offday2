const fs = require('fs');

let appJs = fs.readFileSync('app-shell.js', 'utf8');

// The file currently has a corrupted string: bell.title = `窶 䇹痍 𣕑汝 ${count}穇循;
// We will replace everything from "bell.title = " to the end of that line with the correct code.
const lines = appJs.split('\n');
const newLines = lines.map(line => {
  if (line.includes('bell.title =')) {
    return '  bell.title = `새로운 검토요청 ${count}건`;';
  }
  return line;
});

fs.writeFileSync('app-shell.js', newLines.join('\n'));
console.log("Fixed app-shell.js safely.");
