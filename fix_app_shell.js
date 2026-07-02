const fs = require('fs');

let appJs = fs.readFileSync('app-shell.js', 'utf8');

const newMarkRead = `function markReviewNotificationsRead() {
  if (window.mailStore) {
    window.mailStore.list({ type: '검토요청' }).forEach(m => {
      if (!m.read) window.mailStore.markRead(m.id);
    });
  }
  closeReviewNotificationPanel();
  if (typeof updateBellReviewCount === 'function') updateBellReviewCount();
}`;

appJs = appJs.replace(/function markReviewNotificationsRead\([\s\S]*?\n\}/, newMarkRead);
fs.writeFileSync('app-shell.js', appJs);

console.log("markReviewNotificationsRead is fixed!");
