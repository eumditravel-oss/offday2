/* =========================================================
   업무관리 > PM 배정 / 일정
   프로젝트 접수 데이터 기반 PM 지정, 스케쥴 1·2안 요청/검토 화면입니다.
========================================================= */

const pmScheduleDeptManagerMap = {
  "마감": "장범선 실장",
  "구조팀": "장범선 실장",
  "BIM 파트": "장범선 실장",
  "토목ㆍ조경 파트": "장범선 실장",
  "인테리어·철거": "장범선 실장",
  "비교내역서": "장범선 실장",
  "단가작업": "장범선 실장",
  "기계/전기": "장범선 실장"
};

let pmScheduleFilter = "all";
let pmScheduleSelectedIndex = 0;
let pmScheduleProjects = [];

function clonePmScheduleData(data) {
  return JSON.parse(JSON.stringify(data || {}));
}

function getPmScheduleScopeText(project) {
  const scopes = project?.scopes || [];
  return scopes.filter(item => item.checked).map(item => item.label).join(" · ") || "미선택";
}

function getPmScheduleManagerText(project) {
  const managers = [...new Set((project?.scopes || [])
    .filter(item => item.checked)
    .map(item => pmScheduleDeptManagerMap[item.label] || "장범선 실장"))];
  return managers.join(" · ") || "장범선 실장";
}

function makePmScheduleProject(data, source = "프로젝트 접수", status = "pending") {
  const project = clonePmScheduleData(data);
  return {
    id: `${project.projectNo || "NEW"}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    source,
    status,
    receivedAt: "2026.05.13 13:21",
    manager: getPmScheduleManagerText(project),
    project,
    assignment: {
      pmTotal: project.pmTotal || "",
      pmFinish: project.pmFinish || "",
      pmStructure: project.pmStructure || ""
    },
    requestTargets: {
      pm: [],
      teamLeaders: []
    },
    requestMemo: "",
    selectedProposal: "plan1",
    proposals: [
      {
        id: "plan1",
        title: "1안",
        author: "PM 작성안",
        duration: "2026.05.12 ~ 2026.06.05",
        rows: [
          ["착수/자료검토", "05.12 ~ 05.14", "도면·내역서·시방서 접수 확인"],
          ["수량산출", "05.15 ~ 05.26", "구조팀·BIM 파트 우선 산출"],
          ["QC 및 보완", "05.27 ~ 06.02", "오류 검토 및 수정"],
          ["납품", "06.05", "1차 납품 기준"]
        ]
      },
      {
        id: "plan2",
        title: "2안",
        author: "Viet QS Team Leader 작성안",
        duration: "2026.05.12 ~ 2026.06.05",
        rows: [
          ["착수/범위확정", "05.12 ~ 05.13", "한국 PM 범위 정리 후 전달"],
          ["Viet QS 산출", "05.14 ~ 05.28", "Team Leader별 파트 분배"],
          ["한국 PM 취합", "05.29 ~ 06.02", "취합·검토·보완"],
          ["납품", "06.05", "최종 납품 기준"]
        ]
      }
    ],
    history: [
      "신규 프로젝트가 접수 되었습니다.",
      `${getPmScheduleManagerText(project)}에게 PM 배정 대기 건으로 표시되었습니다.`
    ]
  };
}

function buildPmScheduleSeedProjects() {
  const list = [];
  if (typeof projectReceiveCompletedProjects !== "undefined") {
    projectReceiveCompletedProjects.forEach(item => list.push(makePmScheduleProject(item.data, item.sourceFile, "pending")));
  }
  if (typeof projectReceiveSampleData !== "undefined") {
    list.unshift(makePmScheduleProject(projectReceiveSampleData, "현재 작성 중인 프로젝트 접수", "pending"));
  }
  return list;
}

function initPmScheduleProjects() {
  if (pmScheduleProjects.length) return;
  pmScheduleProjects = buildPmScheduleSeedProjects();
  if (!pmScheduleProjects.length && typeof projectReceiveState !== "undefined") {
    pmScheduleProjects = [makePmScheduleProject(projectReceiveState, "프로젝트 접수", "pending")];
  }
}

function registerPmScheduleProjectFromReceive(data) {
  initPmScheduleProjects();
  const project = makePmScheduleProject(data, "프로젝트 접수 저장", "pending");
  pmScheduleProjects.unshift(project);
  pmScheduleSelectedIndex = 0;
  renderPmScheduleDashboard();
  showToast("신규 프로젝트가 접수 되었습니다. PM 배정 화면에 배정 대기 건으로 등록했습니다.");
}

function setPmScheduleFilter(filter, button) {
  pmScheduleFilter = filter;
  document.querySelectorAll(".pm-filter-chip").forEach(item => item.classList.remove("active"));
  button?.classList.add("active");
  renderPmScheduleProjectList();
}

function getPmScheduleFilteredProjects() {
  initPmScheduleProjects();
  if (pmScheduleFilter === "all") return pmScheduleProjects;
  return pmScheduleProjects.filter(item => item.status === pmScheduleFilter);
}

function getCurrentPmScheduleProject() {
  initPmScheduleProjects();
  return pmScheduleProjects[pmScheduleSelectedIndex] || pmScheduleProjects[0];
}

function renderPmScheduleDashboard() {
  if (!document.getElementById("pmScheduleShell")) return;
  initPmScheduleProjects();
  renderPmScheduleProjectList();
  renderPmScheduleDetail();
}

function renderPmScheduleProjectList() {
  const list = document.getElementById("pmScheduleProjectList");
  if (!list) return;
  const filtered = getPmScheduleFilteredProjects();
  if (!filtered.length) {
    list.innerHTML = `<div class="pm-empty-box">해당 조건의 프로젝트가 없습니다.</div>`;
    return;
  }
  list.innerHTML = filtered.map(item => {
    const realIndex = pmScheduleProjects.indexOf(item);
    const scope = getPmScheduleScopeText(item.project);
    return `
      <button class="pm-project-card ${realIndex === pmScheduleSelectedIndex ? "active" : ""}" type="button" onclick="selectPmScheduleProject(${realIndex})">
        <span class="pm-project-state ${item.status}">${getPmScheduleStatusLabel(item.status)}</span>
        <strong>${escapePmScheduleHtml(item.project.projectName || "프로젝트명 미입력")}</strong>
        <em>${escapePmScheduleHtml(item.project.projectNo || "NO 미입력")} · ${escapePmScheduleHtml(item.project.client || "의뢰처 미입력")}</em>
        <small>${escapePmScheduleHtml(scope)}</small>
      </button>
    `;
  }).join("");
}

function selectPmScheduleProject(index) {
  pmScheduleSelectedIndex = index;
  renderPmScheduleDashboard();
}

function getPmScheduleStatusLabel(status) {
  return {
    pending: "PM 미배정",
    requested: "작성요청",
    submitted: "검토대기",
    approved: "일정확정",
    rejected: "반려"
  }[status] || "대기";
}

function renderPmScheduleDetail() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const project = item.project;
  setText("pmScheduleProjectTitle", project.projectName || "프로젝트명 미입력");
  setText("pmScheduleProjectSub", `${project.projectNo || "NO 미입력"} · ${project.client || "의뢰처 미입력"} · 담당 실장: ${item.manager}`);
  setText("pmScheduleProjectStatus", getPmScheduleStatusLabel(item.status));

  const summary = document.getElementById("pmScheduleSummaryGrid");
  if (summary) {
    summary.innerHTML = `
      <div><span>접수번호</span><strong>${escapePmScheduleHtml(project.projectNo || "-")}</strong></div>
      <div><span>작업범위</span><strong>${escapePmScheduleHtml(getPmScheduleScopeText(project))}</strong></div>
      <div><span>상위조직 실장</span><strong>${escapePmScheduleHtml(item.manager)}</strong></div>
      <div><span>납품기준</span><strong>${escapePmScheduleHtml(project.firstDelivery || "미입력")}</strong></div>
    `;
  }

  renderPmScheduleAssignmentSelects(item);
  renderPmScheduleRequestTargets(item);
  renderPmScheduleProposals(item);
}

function renderPmScheduleAssignmentSelects(item) {
  const employeesForPm = getConCostPmCandidates(item.project);
  fillPmScheduleSelect("pmTotalSelect", employeesForPm, item.assignment.pmTotal, "총괄 PM 선택");
  fillPmScheduleSelect("pmFinishSelect", employeesForPm, item.assignment.pmFinish, "마감 PM 선택");
  fillPmScheduleSelect("pmStructureSelect", employeesForPm, item.assignment.pmStructure, "구조팀 PM 선택");
}

function fillPmScheduleSelect(id, candidates, selectedValue, placeholder) {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = `<option value="">${placeholder}</option>` + candidates.map(emp => {
    const value = `${emp.name} ${emp.grade}`;
    return `<option value="${escapePmScheduleHtml(value)}" ${selectedValue === value ? "selected" : ""}>${escapePmScheduleHtml(value)} · ${escapePmScheduleHtml(emp.dept)}</option>`;
  }).join("");
}

function getConCostPmCandidates(project) {
  const selectedScopes = (project?.scopes || []).filter(item => item.checked).map(item => item.label);
  const staff = (typeof employees !== "undefined" ? employees : []).filter(emp => emp.company === "CON-COST" && emp.status === "재직");
  const matched = staff.filter(emp => {
    const dept = normalizePmScheduleDept(emp.dept);
    return selectedScopes.some(scope => {
      if (scope === "마감") return dept.includes("마감");
      if (scope === "구조팀") return dept.includes("구조");
      if (scope === "BIM 파트") return dept.includes("BIM");
      if (scope === "토목ㆍ조경 파트") return dept.includes("토목") || dept.includes("조경");
      return true;
    });
  });
  return matched.length ? matched : staff;
}

function getVietTeamLeaderCandidates() {
  return (typeof employees !== "undefined" ? employees : [])
    .filter(emp => emp.company === "Viet QS" && emp.status === "재직" && String(emp.grade).includes("Team Leader"))
    .slice(0, 18);
}

function normalizePmScheduleDept(value) {
  return String(value || "").replaceAll("ㆍ", "·").replaceAll(" ", "");
}

function updatePmScheduleAssignment(key, value) {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  item.assignment[key] = value;
  renderPmScheduleRequestTargets(item);
}

function renderPmScheduleRequestTargets(item) {
  const pmList = document.getElementById("pmSchedulePmRequestList");
  const tlList = document.getElementById("pmScheduleTeamLeaderList");
  if (pmList) {
    const pmTargets = [item.assignment.pmTotal, item.assignment.pmFinish, item.assignment.pmStructure].filter(Boolean);
    const uniquePmTargets = [...new Set(pmTargets)];
    pmList.innerHTML = uniquePmTargets.length ? uniquePmTargets.map(name => `
      <label class="pm-check-item"><input type="checkbox" ${item.requestTargets.pm.includes(name) ? "checked" : ""} onchange="togglePmScheduleRequestTarget('pm', '${escapePmScheduleAttr(name)}', this.checked)" /> <span>${escapePmScheduleHtml(name)}</span></label>
    `).join("") : `<div class="pm-empty-box small">먼저 PM을 지정하세요.</div>`;
  }
  if (tlList) {
    const leaders = getVietTeamLeaderCandidates();
    tlList.innerHTML = leaders.map(emp => {
      const value = `${emp.koreanName ? emp.koreanName + ' / ' : ''}${emp.name} · ${emp.dept}`;
      return `<label class="pm-check-item"><input type="checkbox" ${item.requestTargets.teamLeaders.includes(value) ? "checked" : ""} onchange="togglePmScheduleRequestTarget('teamLeaders', '${escapePmScheduleAttr(value)}', this.checked)" /> <span>${escapePmScheduleHtml(value)}</span></label>`;
    }).join("");
  }
}

function togglePmScheduleRequestTarget(group, value, checked) {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const list = item.requestTargets[group] || [];
  if (checked && !list.includes(value)) list.push(value);
  if (!checked) item.requestTargets[group] = list.filter(name => name !== value);
}

function requestPmScheduleDrafts() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  item.requestMemo = document.getElementById("pmScheduleRequestMemo")?.value || "";
  const totalTargets = [...item.requestTargets.pm, ...item.requestTargets.teamLeaders];
  if (!totalTargets.length) {
    showToast("스케쥴 작성 요청 대상을 먼저 선택하세요.");
    return;
  }
  item.status = "requested";
  item.history.unshift(`${totalTargets.join(", ")}에게 스케쥴 1·2안 작성 요청 알림을 보냈습니다.`);
  renderPmScheduleDashboard();
  showToast("스케쥴 관리 1·2안 작성 요청 알림을 전송했습니다.");
}

function completePmScheduleDraftDemo() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  item.status = "submitted";
  item.history.unshift(`${item.project.projectName} 스케쥴 작성 완료 결재 알림이 도착했습니다.`);
  renderPmScheduleDashboard();
  showToast(`${item.project.projectName} 스케쥴 작성 완료`);
}

function renderPmScheduleProposals(item) {
  const grid = document.getElementById("pmScheduleProposalGrid");
  if (!grid) return;
  grid.innerHTML = item.proposals.map(plan => `
    <label class="pm-proposal-card ${item.selectedProposal === plan.id ? "active" : ""}">
      <input type="radio" name="pmScheduleProposal" value="${plan.id}" ${item.selectedProposal === plan.id ? "checked" : ""} onchange="selectPmScheduleProposal('${plan.id}')" />
      <div class="pm-proposal-head"><strong>${escapePmScheduleHtml(plan.title)}</strong><span>${escapePmScheduleHtml(plan.author)}</span></div>
      <em>${escapePmScheduleHtml(plan.duration)}</em>
      <table class="pm-mini-table">
        <tbody>
          ${plan.rows.map(row => `<tr><th>${escapePmScheduleHtml(row[0])}</th><td>${escapePmScheduleHtml(row[1])}</td><td>${escapePmScheduleHtml(row[2])}</td></tr>`).join("")}
        </tbody>
      </table>
    </label>
  `).join("");
}

function selectPmScheduleProposal(planId) {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  item.selectedProposal = planId;
  renderPmScheduleProposals(item);
}

function approvePmScheduleProposal() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const plan = item.proposals.find(p => p.id === item.selectedProposal);
  item.status = "approved";
  item.history.unshift(`${plan?.title || "선택안"}이 승인되어 프로젝트 일정으로 확정되었습니다.`);
  renderPmScheduleDashboard();
  showToast("선택한 스케쥴 안을 승인하고 일정화했습니다.");
}

function rejectPmScheduleProposal() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const reason = document.getElementById("pmScheduleRejectReason")?.value || "반려 사유 미입력";
  const targets = [...item.requestTargets.pm, ...item.requestTargets.teamLeaders].join(", ") || "작성자";
  item.status = "rejected";
  item.history.unshift(`${targets}에게 반려 알림을 전송했습니다. 사유: ${reason}`);
  renderPmScheduleDashboard();
  showToast("반려 알림을 전송했습니다.");
}

function escapePmScheduleHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapePmScheduleAttr(value) {
  return escapePmScheduleHtml(value).replaceAll("`", "&#096;");
}

document.addEventListener("DOMContentLoaded", () => {
  renderPmScheduleDashboard();
});
