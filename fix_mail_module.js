const fs = require('fs');
let mailJs = fs.readFileSync('mail-module.js', 'utf8');

const newGetMailItems = `function getMailItems() {
  if (!window.mailStore) return [];
  // 역순 정렬 (최신이 위로 오도록)
  return window.mailStore.list().slice().reverse();
}`;

// Fix getMailItems
mailJs = mailJs.replace(/function getMailItems\(\) \{[\s\S]*?return \[\.\.\.reviewRequests, \.\.\.staticMails\];\n\}/, newGetMailItems);

// Check if openMailDetail was actually replaced
if (!mailJs.includes('if (window.mailStore) window.mailStore.markRead(mailId);')) {
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
}

fs.writeFileSync('mail-module.js', mailJs);
console.log('mail-module.js fixed');
