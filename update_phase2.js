const fs = require('fs');

// 1. Update mail-module.js
let mailJs = fs.readFileSync('mail-module.js', 'utf8');

const newGetMailItems = `function getMailItems() {
  if (!window.mailStore) return [];
  // 역순 정렬 (최신이 위로 오도록)
  return window.mailStore.list().slice().reverse();
}`;
mailJs = mailJs.replace(/function getMailItems\(\) \{[\s\S]*?return \[\.\.\.reviewRequests, \.\.\.staticMails\];\n\}/, newGetMailItems);

const oldOpenMailDetail = /function openMailDetail\([\s\S]*?\n\}/;
const newOpenMailDetail = `function openMailDetail(mailId) {
  const mail = getMailItems().find(item => item.id === mailId);
  if (!mail) return;
  if (window.mailStore) window.mailStore.markRead(mailId);
  
  if (mail.type === "검토요청") {
    if (typeof switchTopModule === "function") switchTopModule('qc');
    if (typeof openChecklistCheckWindow === "function" && typeof mail.rowIndex !== "undefined") {
      openChecklistCheckWindow(mail.rowIndex);
    } else {
      showToast('연결된 체크리스트 항목을 열 수 없습니다.');
    }
    return;
  }
  showToast(\`\${mail.title} 메일을 열었습니다.\`);
}`;
mailJs = mailJs.replace(oldOpenMailDetail, newOpenMailDetail);
fs.writeFileSync('mail-module.js', mailJs);


// 2. Update app-shell.js
let appJs = fs.readFileSync('app-shell.js', 'utf8');

const newOpenReviewNotification = `function openReviewNotificationPanel() {
  const panel = document.getElementById("reviewNotificationPanel");
  const list = document.getElementById("reviewNotificationList");
  if (!panel || !list) return;

  // mailStore에서 '검토요청' 타입 중 안 읽은 메일을 가져옴
  let requests = window.mailStore ? window.mailStore.list({ type: '검토요청' }).filter(m => !m.read).slice().reverse() : [];

  list.innerHTML = requests.length ? requests.slice(0, 6).map(req => \`
    <article class="review-popover-item" onclick="openMailDetail('\${escapeJs(req.id)}'); closeReviewNotificationPanel();">
      <div class="review-popover-title">
        <strong>\${escapeHtml(req.title)}</strong>
        <span>검토요청</span>
      </div>
      <p>\${escapeHtml(req.body || req.item || "")}</p>
      <small>\${escapeHtml(req.createdAt)} · 발신: \${escapeHtml(req.sender)}</small>
    </article>
  \`).join("") : \`<div class="empty-mail-box">새로 도착한 검토 요청이 없습니다.</div>\`;

  panel.classList.toggle("active");
}`;
appJs = appJs.replace(/function openReviewNotificationPanel\([\s\S]*?\n\}/, newOpenReviewNotification);

const newReviewCount = `const count = window.mailStore ? window.mailStore.list({ type: '검토요청' }).filter(m => !m.read).length : 0;`;
appJs = appJs.replace(/const count = reviewNotificationRead \? 0 : getChecklistReviewRequestRows\(\)\.length;/, newReviewCount);
fs.writeFileSync('app-shell.js', appJs);


// 3. Update work-qc-checklist.js
let qcJs = fs.readFileSync('work-qc-checklist.js', 'utf8');

// remove getChecklistReviewRequestRows completely
qcJs = qcJs.replace(/function getChecklistReviewRequestRows\(\) \{[\s\S]*?\}\n\}/, '');

const oldRenderBand = /function renderChecklistGroupBand\(group\) \{[\s\S]*?\}\n\}/;
const matchRenderBand = qcJs.match(oldRenderBand);
if (matchRenderBand) {
  let bandBody = matchRenderBand[0];
  
  // Add sendReviewRequestMails button
  const newButtonLogic = `
  if (group === "제출자료 검토사항(PM→작업자)") {
    controls.push(\`<button class="btn btn-primary group-mini-btn" \${locked ? "disabled" : ""} onclick="event.stopPropagation(); sendChecklistReviewMails('\${escapeJs(group)}')">메일로 검토 요청</button>\`);
  }
  `;
  bandBody = bandBody.replace(/controls\.push\(\`<button class="btn btn-line group-mini-btn group-add-row-btn".*?\);\n/, (m) => m + newButtonLogic);
  
  qcJs = qcJs.replace(oldRenderBand, bandBody);
}

const sendReviewRequestMailsLogic = `
function sendChecklistReviewMails(group) {
  if (!window.mailStore) {
    showToast("메일 스토어가 없습니다.");
    return;
  }
  let count = 0;
  const projectInput = document.getElementById("checklistProject");
  const fallbackProject = projectInput?.value || "ㅇㅇ시설 신축공사";
  
  checklistRows.forEach((row, index) => {
    if (normalizeChecklistGroupName(row.group) === group && !row.eliminated) {
      const itemText = String(row.item || "검토항목").replace(/\\s+/g, " ").trim();
      const existingMails = window.mailStore.list().filter(m => m.type === "검토요청" && m.rowIndex === index);
      // 이미 같은 rowIndex로 보낸 메일이 있다면 중복 발송하지 않음 (간단한 방어)
      if (existingMails.length === 0) {
        window.mailStore.add({
          type: "검토요청",
          sender: row.creator || "PM",
          projectName: row.project || fallbackProject,
          title: \`\${row.project || fallbackProject} 검토요청_\${itemText}\`,
          body: row.method || "-",
          rowIndex: index
        });
        count++;
      }
    }
  });
  
  if (count > 0) {
    showToast(\`\${count}건의 검토 요청 메일을 발송했습니다.\`);
    // UI 업데이트 트리거
    if (typeof refreshShellAlerts === "function") refreshShellAlerts();
  } else {
    showToast("새로 발송할 검토 요청 항목이 없습니다.");
  }
}
`;

qcJs += "\n" + sendReviewRequestMailsLogic;

fs.writeFileSync('work-qc-checklist.js', qcJs);

console.log("Updated files for Phase 2.");
