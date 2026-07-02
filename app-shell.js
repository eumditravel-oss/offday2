/* =========================
   App Shell (窸蛭� 諈刺�)
   ========================= */
function switchTopModule(moduleName) {
  document.querySelectorAll(".module-view").forEach(view => view.classList.remove("active"));
  document.querySelectorAll("[data-module-tab]").forEach(tab => tab.classList.remove("active"));

  const support = document.getElementById("supportModule");
  const work = document.getElementById("workModule");
  const mail = document.getElementById("mailModule");

  if (moduleName === "mail") {
    mail?.classList.add("active");
    document.querySelector('[data-module-tab="mail"]')?.classList.add("active");
    renderMailInbox(currentMailFilter || "��眼");
    return;
  }

  if (moduleName === "work") {
    work?.classList.add("active");
    document.querySelector('[data-module-tab="work"]')?.classList.add("active");

    switchWorkPanel("workDashboard");
  } else {
    support?.classList.add("active");
    document.querySelector('[data-module-tab="support"]')?.classList.add("active");
  }
}

let reviewNotificationRead = false;

function openReviewNotificationPanel() {
  const panel = document.getElementById("reviewNotificationPanel");
  const list = document.getElementById("reviewNotificationList");
  if (!panel || !list) return;

  // mailStore에서 '검토요청' 타입 중 안 읽은 메일을 가져옴
  let requests = window.mailStore ? window.mailStore.list({ type: '검토요청' }).filter(m => !m.read).slice().reverse() : [];

  list.innerHTML = requests.length ? requests.slice(0, 6).map(req => `
    <article class="review-popover-item" onclick="openMailDetail('${escapeJs(req.id)}'); closeReviewNotificationPanel();">
      <div class="review-popover-title">
        <strong>${escapeHtml(req.title)}</strong>
        <span>검토요청</span>
      </div>
      <p>${escapeHtml(req.body || req.item || "")}</p>
      <small>${escapeHtml(req.createdAt)} · 발신: ${escapeHtml(req.sender)}</small>
    </article>
  `).join("") : `<div class="empty-mail-box">새로 도착한 검토 요청이 없습니다.</div>`;

  panel.classList.toggle("active");
}

function closeReviewNotificationPanel() {
  document.getElementById("reviewNotificationPanel")?.classList.remove("active");
}

function markReviewNotificationsRead() {
  if (window.mailStore) {
    window.mailStore.list({ type: '검토요청' }).forEach(m => {
      if (!m.read) window.mailStore.markRead(m.id);
    });
  }
  closeReviewNotificationPanel();
  if (typeof updateBellReviewCount === 'function') updateBellReviewCount();
}

function updateBellReviewCount() {
  const bell = document.querySelector(".bell");
  if (!bell) return;
  const count = window.mailStore ? window.mailStore.list({ type: '검토요청' }).filter(m => !m.read).length : 0;
  bell.setAttribute("data-count", String(count));
  bell.classList.toggle("has-count", count > 0);
  bell.title = `새로운 검토요청 ${count}건`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("active");
  setTimeout(() => toast.classList.remove("active"), 2200);
}
function togglePermissionDropdown(event) {
  event?.stopPropagation?.();
  const dropdown = document.getElementById("permissionDropdown");
  const button = document.querySelector(".permission-user-btn");
  if (!dropdown) return;
  const willOpen = !dropdown.classList.contains("open");
  dropdown.classList.toggle("open", willOpen);
  if (button) button.setAttribute("aria-expanded", willOpen ? "true" : "false");
  if (willOpen) renderPermissionRoleDropdown();
}


/* =========================
   瞪羲 等檜攪 葬撢 (Phase 0)
   ========================= */
window.resetDemoData = function() {
  if(confirm('賅萇 等賅 等檜攪蒂 蟾晦�ビ堅 億煎堅藹ビ衛啊蝗棲梱?')) {
    if(window.employeeStore) window.employeeStore.reset();
    if(window.mailStore) window.mailStore.reset();
    if(window.centralProjectStore) window.centralProjectStore.clear();
    location.reload();
  }
};
