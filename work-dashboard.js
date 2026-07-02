/* =========================
   업무관리 대시보드
   ========================= */
function workDashboardSetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function workDashboardEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
}

function workDashboardCollectMetrics() {
  let estimateRows = [];
  let receiveRows = [];
  let scheduleRows = [];
  let reviewRows = [];
  let centralRows = [];

  try {
    if (typeof estimateRequestLoadRows === "function") estimateRequestLoadRows();
    if (typeof estimateRequestRows !== "undefined" && Array.isArray(estimateRequestRows)) estimateRows = estimateRequestRows;
  } catch (_) {}

  try {
    if (typeof projectReceiveGetCanonicalListItems === "function") receiveRows = projectReceiveGetCanonicalListItems();
    else if (typeof getProjectReceiveListItems === "function") receiveRows = getProjectReceiveListItems();
  } catch (_) {}

  try {
    if (typeof initPmScheduleProjects === "function") initPmScheduleProjects();
    if (typeof pmScheduleProjects !== "undefined" && Array.isArray(pmScheduleProjects)) scheduleRows = pmScheduleProjects;
  } catch (_) {}

  try {
    if (typeof getChecklistReviewRequestRows === "function") reviewRows = getChecklistReviewRequestRows();
  } catch (_) {}

  try {
    if (window.centralProjectStore && typeof window.centralProjectStore.getProjects === "function") centralRows = window.centralProjectStore.getProjects();
  } catch (_) {}

  const deliveryCount = centralRows.reduce((sum, project) => {
    const files = Array.isArray(project?.delivery?.files) ? project.delivery.files.length : 0;
    const records = Array.isArray(project?.delivery?.records) ? project.delivery.records.length : 0;
    return sum + files + records;
  }, 0);
  const dailyCount = centralRows.reduce((sum, project) => sum + (Array.isArray(project?.dailyReports) ? project.dailyReports.length : 0), 0);

  return {
    estimateCount: estimateRows.length,
    receiveCount: receiveRows.length || centralRows.length,
    scheduleCount: scheduleRows.length,
    reviewCount: reviewRows.length,
    deliveryCount,
    dailyCount
  };
}

function renderWorkDashboard() {
  if (!document.getElementById("workDashboard")) return;
  const metrics = workDashboardCollectMetrics();
  workDashboardSetText("workDashEstimateCount", metrics.estimateCount);
  workDashboardSetText("workDashReceiveCount", metrics.receiveCount);
  workDashboardSetText("workDashScheduleCount", metrics.scheduleCount);
  workDashboardSetText("workDashReviewCount", metrics.reviewCount);
  workDashboardSetText("workDashDeliveryCount", metrics.deliveryCount);
  workDashboardSetText("workDashDailyCount", metrics.dailyCount);
  workDashboardSetText("workDashFlowEstimate", `${metrics.estimateCount}건`);
  workDashboardSetText("workDashFlowReceive", `${metrics.receiveCount}건`);
  workDashboardSetText("workDashFlowSchedule", `${metrics.scheduleCount}건`);
  workDashboardSetText("workDashUpdatedAt", new Date().toLocaleString("ko-KR", { month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit" }));

  const queue = document.getElementById("workDashboardQueueList");
  if (!queue) return;
  const items = [
    { label:"견적 의뢰관리", count:metrics.estimateCount, note:"접수와 견적서 작성 요청", target:"estimateRequestManage" },
    { label:"프로젝트 접수", count:metrics.receiveCount, note:"수주 정보와 착수 조건", target:"projectReceiveList" },
    { label:"PM 배정 / 일정", count:metrics.scheduleCount, note:"배정·결재·전체 일정", target:"pmSchedule", section:"assign" },
    { label:"질의응답 관리", count:metrics.reviewCount, note:"검토 요청과 견적조건", target:"qcReview" },
    { label:"납품 및 데이터", count:metrics.deliveryCount, note:"납품 파일과 승인 기록", target:"deliveryData" },
    { label:"업무일지 / 진행률", count:metrics.dailyCount, note:"일일 진행률 누적", target:"dailyReport" }
  ];
  queue.innerHTML = items.map(item => {
    const sectionAttr = item.section ? ` data-pm-section="${workDashboardEscape(item.section)}"` : "";
    const valueText = item.count ? `${item.count}건` : "대기 없음";
    return `<button type="button" class="work-dashboard-queue-item" data-work-main="${workDashboardEscape(item.target)}"${sectionAttr}>
      <span><strong>${workDashboardEscape(item.label)}</strong><em>${workDashboardEscape(item.note)}</em></span>
      <b>${workDashboardEscape(valueText)}</b>
    </button>`;
  }).join("");
}
function syncWorkSideAccordion(targetPanelId) {
  const target = String(targetPanelId || "estimateDbManage");
  const estimatePanels = ["estimateRequestManage", "estimateSheetManage", "estimatePeriodManage", "estimateDbManage", "estimateQuote", "estimateQuoteList"];
  const projectReceivePanels = ["projectReceive", "projectReceiveList"];
  const pmSchedulePanels = ["pmSchedule"];
  const isEstimateQuote = estimatePanels.includes(target);
  const isProjectReceive = projectReceivePanels.includes(target);
  const isPmSchedule = pmSchedulePanels.includes(target);

  // 모든 대분류/중분류 상태를 먼저 완전히 초기화합니다.
  // 기존에는 다른 버튼 클릭 후에도 .project-receive-sub-menu의 active 상태가 남아
  // "프로젝트 작성 / 프로젝트 리스트"가 계속 펼쳐지는 문제가 발생할 수 있었습니다.
  document.querySelectorAll(".side-sub, .estimate-quote-sub-menu, .project-receive-sub-menu, .pm-schedule-sub-menu").forEach(menu => {
    menu.classList.remove("active");
  });
  document.querySelectorAll(".side-main, .side-item, [data-work-main]").forEach(btn => {
    btn.classList.remove("active", "work-side-selected");
    btn.removeAttribute("data-work-selected");
  });

  if (target === "workDashboard") {
    document.querySelector(`.side-main[data-work-main="workDashboard"]`)?.classList.add("active");
    return;
  }

  if (isEstimateQuote) {
    document.querySelectorAll(".estimate-quote-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".estimate-quote-side-group > .side-main[data-work-main]").forEach(btn => btn.classList.add("active"));
  } else if (isProjectReceive) {
    document.querySelectorAll(".project-receive-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".side-main[data-work-main='projectReceive']").forEach(btn => btn.classList.add("active"));
  } else if (isPmSchedule) {
    document.querySelectorAll(".pm-schedule-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".side-main[data-work-main='pmSchedule']").forEach(btn => btn.classList.add("active"));
  } else {
    document.querySelector(`.side-main[data-work-main="${target}"]`)?.classList.add("active");
  }
}

function activateWorkSideSelection(targetPanelId) {
  const target = String(targetPanelId || "estimateRequestManage");
  const estimatePanels = ["estimateRequestManage", "estimateSheetManage", "estimatePeriodManage", "estimateDbManage", "estimateQuote", "estimateQuoteList"];
  const projectReceivePanels = ["projectReceive", "projectReceiveList"];
  const markSelected = (el) => {
    if (!el) return;
    el.classList.add("active", "work-side-selected");
    el.setAttribute("data-work-selected", "true");
  };

  document.querySelectorAll(".work-side-selected, [data-work-selected='true']").forEach(el => {
    el.classList.remove("work-side-selected");
    el.removeAttribute("data-work-selected");
  });

  if (target === "workDashboard") {
    markSelected(document.querySelector(`.side-main[data-work-main="workDashboard"]`));
    return;
  }

  if (estimatePanels.includes(target)) {
    document.querySelectorAll(".estimate-quote-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".estimate-quote-side-group > .side-main[data-work-main]").forEach(markSelected);
    markSelected(document.querySelector(`.estimate-quote-sub-menu .side-item[data-work-main="${target}"]`));
    return;
  }

  if (projectReceivePanels.includes(target)) {
    document.querySelectorAll(".project-receive-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".project-receive-side-group > .side-main[data-work-main]").forEach(markSelected);
    markSelected(document.querySelector(`.project-receive-sub-menu .side-item[data-work-main="${target}"]`));
    return;
  }

  if (target === "pmSchedule") {
    const activeSection = typeof pmScheduleActiveSection !== "undefined" ? pmScheduleActiveSection : "assign";
    document.querySelectorAll(".pm-schedule-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".pm-schedule-side-group > .side-main[data-work-main]").forEach(markSelected);
    markSelected(document.querySelector(`.pm-schedule-sub-menu .side-item[data-work-main="pmSchedule"][data-pm-section="${activeSection}"]`));
    return;
  }

  markSelected(document.querySelector(`.side-main[data-work-main="${target}"]`));
}

function switchWorkPanel(panelId) {
  const targetPanelId = panelId || "workDashboard";

  document.querySelectorAll(".work-panel").forEach(panel => panel.classList.remove("active"));
  document.querySelectorAll("[data-work-main]").forEach(btn => {
    btn.classList.remove("active", "work-side-selected");
    btn.removeAttribute("data-work-selected");
  });
  document.querySelectorAll(".side-sub").forEach(menu => menu.classList.remove("active"));

  document.getElementById(targetPanelId)?.classList.add("active");
  syncWorkSideAccordion(targetPanelId);

  if (typeof activateWorkSideSelection === "function") {
    activateWorkSideSelection(targetPanelId);
  }

  const meta = workPageMeta[targetPanelId] || workPageMeta.workDashboard || workPageMeta.estimateDbManage || workPageMeta.projectReceive;
  setText("workPageTitle", meta[0]);
  setText("workPageDesc", meta[1]);

  if (targetPanelId === "workDashboard" && typeof renderWorkDashboard === "function") {
    renderWorkDashboard();
  }

  if (targetPanelId === "estimateRequestManage" && typeof renderEstimateRequestManage === "function") {
    renderEstimateRequestManage();
  }

  if (targetPanelId === "estimateSheetManage" && typeof renderEstimateSheetManage === "function") {
    renderEstimateSheetManage();
  }

  if (targetPanelId === "estimatePeriodManage" && typeof renderEstimatePeriodManage === "function") {
    renderEstimatePeriodManage();
  }

  if (targetPanelId === "estimateDbManage" && typeof renderEstimateDbManage === "function") {
    renderEstimateDbManage();
  }

  if (targetPanelId === "estimateQuote" && typeof renderEstimateQuoteDashboard === "function") {
    renderEstimateQuoteDashboard();
  }

  if (targetPanelId === "estimateQuoteList" && typeof renderEstimateQuoteList === "function") {
    renderEstimateQuoteList();
  }

  if (targetPanelId === "projectReceive" && typeof renderProjectReceiveDashboard === "function") {
    renderProjectReceiveDashboard();
  }

  if (targetPanelId === "projectReceiveList" && typeof renderProjectReceiveListView === "function") {
    renderProjectReceiveListView();
  }

  if (targetPanelId === "projectManage" && typeof initProjectManage === "function") {
    initProjectManage();
  }

  if (targetPanelId === "pmSchedule" && typeof renderPmScheduleDashboard === "function") {
    renderPmScheduleDashboard();
    if (typeof setPmScheduleSection === "function") setPmScheduleSection(typeof pmScheduleActiveSection !== "undefined" ? pmScheduleActiveSection : "assign");
  }

  if (targetPanelId === "qcReview" || targetPanelId === "quantityChecklist") {
    renderChecklistCategoryButtons();
    renderChecklistGrid();
  }

  if (targetPanelId === "deliveryData" && typeof renderDeliveryData === "function") {
    renderDeliveryData();
  }

  if (targetPanelId === "dailyReport" && typeof renderDailyReport === "function") {
    renderDailyReport();
  }
}

