const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

let startStr = '<div id="history-a4-preview"';
let startIdx = code.indexOf(startStr);

// Find the matching closing div for history-a4-preview
let stack = 0;
let endIdx = -1;
let i = startIdx;
while (i < code.length) {
    if (code.substring(i, i + 4) === '<div') {
        stack++;
        i += 4;
    } else if (code.substring(i, i + 5) === '</div') {
        stack--;
        if (stack === 0) {
            endIdx = i + 6;
            break;
        }
        i += 5;
    } else {
        i++;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    let previewCode = code.substring(startIdx, endIdx);
    fs.writeFileSync('preview_snippet.txt', previewCode, 'utf8');
    console.log(`Extracted preview snippet, length: ${previewCode.length}`);
} else {
    console.log("Failed to find preview block.");
}
