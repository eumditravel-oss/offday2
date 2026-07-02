const fs = require('fs');
let qcJs = fs.readFileSync('work-qc-checklist.js', 'utf8');

// 1. Remove getChecklistReviewRequestRows
qcJs = qcJs.replace(/function getChecklistReviewRequestRows\(\) \{[\s\S]*?    \}\);\n\}/, '');

// 2. Add [메일로 검토 요청] button to renderChecklistGroupBand
const oldRenderBand = /function renderChecklistGroupBand\(group\) \{[\s\S]*?\}\n\}/;
const matchRenderBand = qcJs.match(oldRenderBand);
if (matchRenderBand) {
  let bandBody = matchRenderBand[0];
  const newButtonLogic = `
  if (group === "제출자료 검토사항(PM→작업자)") {
    controls.push(\`<button class="btn btn-primary group-mini-btn" \${locked ? "disabled" : ""} onclick="event.stopPropagation(); sendChecklistReviewMails('\${escapeJs(group)}')">메일로 검토 요청</button>\`);
  }
  `;
  bandBody = bandBody.replace(/controls\.push\(\`<button class="btn btn-line group-mini-btn group-add-row-btn".*?\);\n/, (m) => m + newButtonLogic);
  qcJs = qcJs.replace(oldRenderBand, bandBody);
}

fs.writeFileSync('work-qc-checklist.js', qcJs);
console.log('work-qc-checklist.js fixed');
