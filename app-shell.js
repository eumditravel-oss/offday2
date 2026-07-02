/* =========================
   App Shell (ê³µí†µ ëª¨ë“ˆ)
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
    renderMailInbox(currentMailFilter || "ì „ì²´");
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

function openReviewNotificationPanel(focusRowIndex = null) {
  const panel = document.getElementById("reviewNotificationPanel");
  const list = document.getElementById("reviewNotificationList");
  if (!panel || !list) return;

  let requests = getChecklistReviewRequestRows();
  if (focusRowIndex !== null && focusRowIndex !== undefined) {
    const focused = requests.find(item => String(item.rowIndex) === String(focusRowIndex));
    if (focused) requests = [focused, ...requests.filter(item => item.rowIndex !== focused.rowIndex)];
  }

  list.innerHTML = requests.length ? requests.slice(0, 6).map(req => `
    <article class="review-popover-item" onclick="switchTopModule('mail'); renderMailInbox('ê²€í† ìš”ì²­'); closeReviewNotificationPanel();">
      <div class="review-popover-title">
        <strong>${escapeHtml(req.title)}</strong>
        <span>ê²€í† ìš”ì²­</span>
      </div>
      <p>${escapeHtml(req.method || req.item || "")}</p>
      <small>${escapeHtml(req.createdAt)} Â· ë°œì‹ ì ${escapeHtml(req.sender)}</small>
    </article>
  `).join("") : `<div class="empty-mail-box">ë„ì°©í•œ ê²€í†  ìš”ì²­ì´ ì—†ìŠµë‹ˆë‹¤.</div>`;

  panel.classList.toggle("active");
}

function closeReviewNotificationPanel() {
  document.getElementById("reviewNotificationPanel")?.classList.remove("active");
}

function markReviewNotificationsRead() {
  reviewNotificationRead = true;
  closeReviewNotificationPanel();
  updateBellReviewCount();
}

function updateBellReviewCount() {
  const bell = document.querySelector(".bell");
  if (!bell) return;
  const count = reviewNotificationRead ? 0 : getChecklistReviewRequestRows().length;
  bell.setAttribute("data-count", String(count));
  bell.classList.toggle("has-count", count > 0);
  bell.title = `ê²€í†  ìš”ì²­ ì•Œë¦¼ ${count}ê±´`;
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
   Àü¿ª µ¥ÀÌÅÍ ¸®¼Â (Phase 0)
   ========================= */
window.resetDemoData = function() {
  if(confirm('¸ğµç µ¥¸ğ µ¥ÀÌÅÍ¸¦ ÃÊ±âÈ­ÇÏ°í »õ·Î°íÄ§ÇÏ½Ã°Ú½À´Ï±î?')) {
    if(window.employeeStore) window.employeeStore.reset();
    if(window.mailStore) window.mailStore.reset();
    if(window.centralProjectStore) window.centralProjectStore.reset();
    location.reload();
  }
};
