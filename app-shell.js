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
    <article class="review-popover-item" onclick="switchTopModule('mail'); renderMailInbox('窶��𥔱�麮�'); closeReviewNotificationPanel();">
      <div class="review-popover-title">
        <strong>${escapeHtml(req.title)}</strong>
        <span>窶��𥔱�麮�</span>
      </div>
      <p>${escapeHtml(req.method || req.item || "")}</p>
      <small>${escapeHtml(req.createdAt)} 繚 諻𨰰��� ${escapeHtml(req.sender)}</small>
    </article>
  `).join("") : `<div class="empty-mail-box">��骨�� 窶��� �䇹痍�� ��𠽌��𠹻.</div>`;

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
  bell.title = `窶��� �䇹痍 �𣕑汝 ${count}穇循;
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
