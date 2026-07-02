/* =========================
   전자메일 모듈
   ========================= */
let currentMailFilter = "전체";
let currentMailBox = "inbox";
function getMailItems() {
  const reviewRequests = getChecklistReviewRequestRows();
  const projectName = document.getElementById("checklistProject")?.value || "ㅇㅇ시설 신축공사";
  const staticMails = [
    {
      id: "mail-checklist-001",
      type: "체크리스트",
      sender: "QC TEAM",
      title: `${projectName} 체크리스트 확인 요청`,
      createdAt: "2026-04-29 09:00",
      item: "프로젝트 초기 체크리스트",
      method: "체크리스트 구분별 확인 필요",
      comment: ""
    },
    {
      id: "mail-question-001",
      type: "질의사항",
      sender: "PM",
      title: `${projectName} 질의사항(1차) 확인 요청`,
      createdAt: "2026-04-30 13:00",
      item: "동구분 관련 질의사항",
      method: "발주처 회신 후 반영 예정",
      comment: ""
    },
    {
      id: "mail-delivery-001",
      type: "납품메일",
      sender: "PM",
      title: `${projectName} 납품자료 송부 확인`,
      createdAt: "2026-04-30 15:30",
      item: "납품자료 체크",
      method: "송부 전 최종 확인",
      comment: ""
    }
  ];
  return [...reviewRequests, ...staticMails];
}

function setMailBox(boxName) {
  currentMailBox = boxName || "inbox";
  document.querySelectorAll("[data-mail-box]").forEach(btn => btn.classList.toggle("active", btn.dataset.mailBox === currentMailBox));
  renderMailInbox(currentMailFilter || "전체");
}

function clearMailFilters() {
  const search = document.getElementById("mailSearchInput");
  const project = document.getElementById("mailProjectFilter");
  const tag = document.getElementById("mailTagFilter");
  if (search) search.value = "";
  if (project) project.value = "전체";
  if (tag) tag.value = "전체";
  renderMailInbox("전체");
}

function getFilteredMailItems(filter = "전체") {
  const searchValue = (document.getElementById("mailSearchInput")?.value || "").trim().toLowerCase();
  const projectValue = document.getElementById("mailProjectFilter")?.value || "전체";
  const tagValue = document.getElementById("mailTagFilter")?.value || "전체";

  let items = getMailItems();
  if (currentMailBox && currentMailBox !== "inbox") items = [];
  if (filter !== "전체") items = items.filter(mail => mail.type === filter);
  if (tagValue !== "전체") items = items.filter(mail => mail.type === tagValue);
  if (projectValue !== "전체") items = items.filter(mail => (mail.project || "").includes(projectValue));
  if (searchValue) {
    items = items.filter(mail => [mail.sender, mail.title, mail.item, mail.method, mail.project, mail.type]
      .join(" ").toLowerCase().includes(searchValue));
  }
  return items;
}

function renderMailInbox(filter = "전체") {
  currentMailFilter = filter;
  document.querySelectorAll(".mail-filter").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mailFilter === filter);
  });

  const list = document.getElementById("mailInboxList");
  const badge = document.getElementById("mailCountBadge");
  const sideCount = document.getElementById("mailInboxSideCount");
  if (!list) return;

  const inboxTotal = getMailItems().length;
  if (sideCount) sideCount.textContent = inboxTotal;

  const items = getFilteredMailItems(filter);
  if (badge) badge.textContent = `이메일 1~${items.length}개 표시 / 총 ${items.length}개`;

  if (!items.length) {
    list.innerHTML = `<tr><td colspan="5"><div class="empty-mail-box">표시할 메일이 없습니다.</div></td></tr>`;
    return;
  }

  list.innerHTML = items.map(mail => `
    <tr class="mail-row ${mail.type === "검토요청" ? "review-mail" : ""}" onclick="openMailDetail('${escapeJs(mail.id)}')">
      <td class="mail-star-col">☆</td>
      <td><strong>${escapeHtml(mail.sender)}</strong></td>
      <td><span class="mail-type-chip ${mail.type === "검토요청" ? "review" : ""}">${escapeHtml(mail.type)}</span></td>
      <td>
        <div class="mail-subject-line">
          <strong>${escapeHtml(mail.title)}</strong>
          <span>${escapeHtml(mail.method || mail.item || "")}</span>
        </div>
      </td>
      <td class="mail-time-cell">${escapeHtml(formatMailTime(mail.createdAt))}</td>
    </tr>
  `).join("");
}

function formatMailTime(value) {
  const text = String(value || "");
  if (!text) return "-";
  const datePart = text.split(" ")[0];
  return datePart.replace(/^2026-/, "").replace(/-/g, "/");
}

function openMailDetail(mailId) {
  const mail = getMailItems().find(item => item.id === mailId);
  if (!mail) return;
  if (mail.type === "검토요청") {
    openReviewNotificationPanel(mail.rowIndex);
    return;
  }
  showToast(`${mail.title} 메일을 열었습니다.`);
}