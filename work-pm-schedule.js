/* =========================================================
   업무관리 > PM 배정 / 일정
   - 실장 권한: 접수 프로젝트 리스트, PM 지정, 스케쥴 1·2안 검토/승인/반려
   - PM / Leader 권한: 스케쥴 1·2안 편집 및 제출
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

const pmScheduleGroupRows = [
  { group: "AS", names: ["PHONG(퐁)", "CƯỜNG(늣끄엉)", "ĐAN(단)", "MAI(마이)", "Ngoc bich(옥 빛)"] },
  { group: "PS", names: ["NGÂN(응언)", "KIM THOA(김 톼)", "NAM(남)", "NGỌC THOA(옥 토)", "HUY(휘)", "Hoàng(호앙)"] },
  { group: "AW", names: ["TUẤN(뚜언)", "XUÂN(수언)", "MINH TƯ(민 뚜)", "CHÂU(쩌우)", "CẨM TÚ(깜 뚜)", "THỊNH(띤)", "KHẢI(카이)", "Thảo(타오)", "Vy(비)"] },
  { group: "PW", names: ["TOÀN(또안)", "HƯNG(흥)", "Hiếu(민 히에우)", "Duy(유이)", "Thùy(투이)"] },
  { group: "FT", names: ["THÁI(휴 타이)", "HUY(휘)"] }
];

function clonePmScheduleData(data) {
  return JSON.parse(JSON.stringify(data || {}));
}

function getPmScheduleRole() {
  return typeof currentPermissionRoleValue !== "undefined" ? currentPermissionRoleValue : "PM";
}

function isPmScheduleManagerRole() {
  return getPmScheduleRole() === "실장";
}

function isPmScheduleEditorRole() {
  const role = getPmScheduleRole();
  return role === "PM" || role === "Leader" || role === "Asst.Leader" || role.includes("Team Leader");
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

function createPmSchedulePlanRows() {
  return pmScheduleGroupRows.flatMap(section => section.names.map((name, index) => ({
    group: index === 0 ? section.group : "",
    groupKey: section.group,
    name,
    plan1: { rc: true, sc: false, people: "1", workDays: "", totalDays: index === 0 ? "0" : "", ratio: index === 0 ? "-" : "" },
    plan2: { rc: false, sc: false, people: "", workDays: "", totalDays: index === 0 ? "0" : "", ratio: index === 0 ? "-" : "" },
    scope: index === 0 ? "" : ""
  })));
}

function createPmScheduleProposals() {
  return {
    plan1: {
      id: "plan1",
      title: "1안 (전체 투입)",
      author: "작성 전",
      submittedAt: "미제출",
      rows: createPmSchedulePlanRows()
    },
    plan2: {
      id: "plan2",
      title: "2안 (최적화 배치)",
      author: "작성 전",
      submittedAt: "미제출",
      rows: createPmSchedulePlanRows()
    }
  };
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
      pmFinish: project.pmFinish || "",
      pmStructure: project.pmStructure || "",
      pmCivil: project.pmCivil || ""
    },
    requestTargets: {
      pm: [],
      teamLeaders: []
    },
    requestMemo: "",
    selectedProposal: "plan1",
    proposals: createPmScheduleProposals(),
    history: [
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
  showToast("신규 프로젝트가 접수되었습니다. PM 배정 화면에 등록했습니다.");
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

  const roleMessage = document.getElementById("pmScheduleRoleMessage");
  const managerView = document.getElementById("pmScheduleManagerView");
  const editorView = document.getElementById("pmScheduleEditorView");
  const role = getPmScheduleRole();

  if (isPmScheduleManagerRole()) {
    if (roleMessage) roleMessage.style.display = "none";
    if (managerView) managerView.style.display = "grid";
    if (editorView) editorView.style.display = "none";
    renderPmScheduleProjectList();
    renderPmScheduleDetail();
    return;
  }

  if (isPmScheduleEditorRole()) {
    if (roleMessage) roleMessage.style.display = "none";
    if (managerView) managerView.style.display = "none";
    if (editorView) editorView.style.display = "block";
    renderPmScheduleEditorView();
    return;
  }

  if (managerView) managerView.style.display = "none";
  if (editorView) editorView.style.display = "none";
  if (roleMessage) {
    roleMessage.style.display = "block";
    roleMessage.innerHTML = `<strong>권한 설정 화면 구현중</strong><span>현재 선택 권한: ${escapePmScheduleHtml(role)}</span>`;
  }
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
  renderPmScheduleProposals(item, false);
}

function renderPmScheduleAssignmentSelects(item) {
  const employeesForPm = getConCostPmCandidates(item.project);
  fillPmScheduleSelect("pmFinishSelect", employeesForPm, item.assignment.pmFinish, "마감 PM 선택");
  fillPmScheduleSelect("pmStructureSelect", employeesForPm, item.assignment.pmStructure, "구조 PM 선택");
  fillPmScheduleSelect("pmCivilSelect", employeesForPm, item.assignment.pmCivil, "토목ㆍ조경 PM 선택");
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
    .slice(0, 24);
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
    const pmTargets = [item.assignment.pmFinish, item.assignment.pmStructure, item.assignment.pmCivil].filter(Boolean);
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

function renderPmScheduleProposals(item, editable = false) {
  const grid = editable ? document.getElementById("pmScheduleEditorGrid") : document.getElementById("pmScheduleProposalGrid");
  if (!grid) return;
  const plans = [item.proposals.plan1, item.proposals.plan2];
  grid.innerHTML = plans.map(plan => editable ? renderPmScheduleEditablePlan(plan) : renderPmScheduleReadonlyPlan(plan, item)).join("");
}

function renderPmScheduleReadonlyPlan(plan, item) {
  return `
    <label class="pm-proposal-card pm-schedule-sheet-card ${item.selectedProposal === plan.id ? "active" : ""}">
      <input type="radio" name="pmScheduleProposal" value="${plan.id}" ${item.selectedProposal === plan.id ? "checked" : ""} onchange="selectPmScheduleProposal('${plan.id}')" />
      <div class="pm-proposal-head"><strong>${escapePmScheduleHtml(plan.title)}</strong><span>${escapePmScheduleHtml(plan.author)} · ${escapePmScheduleHtml(plan.submittedAt)}</span></div>
      ${renderPmScheduleSheetTable(plan, false)}
    </label>
  `;
}

function renderPmScheduleEditablePlan(plan) {
  return `
    <div class="pm-proposal-card pm-schedule-sheet-card">
      <div class="pm-proposal-head"><strong>${escapePmScheduleHtml(plan.title)}</strong><span>${escapePmScheduleHtml(getPmScheduleRole())} 작성 화면</span></div>
      ${renderPmScheduleSheetTable(plan, true)}
    </div>
  `;
}

function renderPmScheduleSheetTable(plan, editable) {
  return `
    <div class="pm-schedule-sheet-wrap">
      <table class="pm-schedule-sheet-table">
        <thead>
          <tr>
            <th rowspan="2">구분</th>
            <th rowspan="2">성명</th>
            <th colspan="2">작업범위</th>
            <th colspan="4">${plan.id === "plan1" ? "1안 (전체 투입)" : "2안 (최적화 배치)"}</th>
            <th rowspan="2">업무범위</th>
          </tr>
          <tr>
            <th>RC</th><th>SC</th><th>투입인원</th><th>작업일수</th><th>전체일수</th><th>비율(%)</th>
          </tr>
        </thead>
        <tbody>
          ${plan.rows.map((row, rowIndex) => renderPmScheduleSheetRow(plan, row, rowIndex, editable)).join("")}
          <tr class="pm-sheet-total-row"><th colspan="2">전체일수</th><td colspan="2"></td><th colspan="2">${plan.id === "plan1" ? "1안 합계" : "2안 합계"}</th><td>0</td><td>-</td><td></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderPmScheduleSheetRow(plan, row, rowIndex, editable) {
  const data = plan.id === "plan1" ? row.plan1 : row.plan2;
  const attrBase = `${plan.id},${rowIndex}`;
  const input = (field, value, className = "") => editable
    ? `<input class="pm-sheet-input ${className}" value="${escapePmScheduleAttr(value)}" oninput="updatePmSchedulePlanCell('${plan.id}', ${rowIndex}, '${field}', this.value)" />`
    : `<span>${escapePmScheduleHtml(value)}</span>`;
  const checkbox = (field, checked) => editable
    ? `<input type="checkbox" ${checked ? "checked" : ""} onchange="updatePmSchedulePlanCell('${plan.id}', ${rowIndex}, '${field}', this.checked)" />`
    : `<input type="checkbox" ${checked ? "checked" : ""} disabled />`;
  return `
    <tr>
      <th class="pm-sheet-group">${escapePmScheduleHtml(row.group)}</th>
      <td class="pm-sheet-name">${escapePmScheduleHtml(row.name)}</td>
      <td>${checkbox("rc", data.rc)}</td>
      <td>${checkbox("sc", data.sc)}</td>
      <td>${input("people", data.people, "center")}</td>
      <td>${input("workDays", data.workDays, "center")}</td>
      <td>${input("totalDays", data.totalDays, "center")}</td>
      <td>${input("ratio", data.ratio, "center")}</td>
      <td>${input("scope", row.scope)}</td>
    </tr>
  `;
}

function updatePmSchedulePlanCell(planId, rowIndex, field, value) {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const plan = item.proposals[planId];
  const row = plan?.rows?.[rowIndex];
  if (!row) return;
  if (field === "scope") row.scope = value;
  else row[planId][field] = value;
}

function selectPmScheduleProposal(planId) {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  item.selectedProposal = planId;
  renderPmScheduleProposals(item, false);
}

function renderPmScheduleEditorView() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const info = document.getElementById("pmScheduleEditorProjectInfo");
  if (info) {
    info.innerHTML = `
      <div><span>프로젝트명</span><strong>${escapePmScheduleHtml(item.project.projectName || "프로젝트명 미입력")}</strong></div>
      <div><span>작업범위</span><strong>${escapePmScheduleHtml(getPmScheduleScopeText(item.project))}</strong></div>
      <div><span>요청 메모</span><strong>${escapePmScheduleHtml(item.requestMemo || "요청 메모 없음")}</strong></div>
    `;
  }
  renderPmScheduleProposals(item, true);
}

function submitPmScheduleEditor() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const now = getPmScheduleNowText();
  const role = getPmScheduleRole();
  Object.values(item.proposals).forEach(plan => {
    plan.author = role === "PM" ? "한국 PM 작성안" : "Viet QS Team Leader 작성안";
    plan.submittedAt = now;
  });
  item.status = "submitted";
  item.history.unshift(`${item.project.projectName} 스케쥴 작성 완료 결재 알림이 도착했습니다.`);
  renderPmScheduleDashboard();
  showToast(`${item.project.projectName} 스케쥴 작성 완료`);
}

function approvePmScheduleProposal() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const plan = item.proposals[item.selectedProposal];
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

function getPmScheduleNowText() {
  const now = new Date();
  const pad = num => String(num).padStart(2, "0");
  return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
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
