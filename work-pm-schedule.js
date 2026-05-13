/* =========================================================
   업무관리 > PM 배정 / 일정
   - 실장 권한: 접수 프로젝트 리스트, PM 지정, 스케쥴 1·2안 검토/승인/반려
   - PM / Leader 권한: 스케쥴 1·2안 편집 및 제출
   - 스케쥴 1·2안은 별도 모달 창에서 가로 비교/편집
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
let pmScheduleModalEditable = false;
let pmScheduleModalPlanScope = "current";
let pmScheduleModalCategory = "Structure";
let pmSchedulePmRequestDeptFilter = "구조팀";
let pmScheduleTlRequestDeptFilter = "Structure";
let pmScheduleModalMiddleDept = "";

const pmScheduleDeptOrder = [
  "Internal 1",
  "Internal 2",
  "Internal 3",
  "Partition&Opening",
  "External",
  "Vertical",
  "Horizontal/Foundation",
  "Civil",
  "Development"
];


function getPmScheduleGradeRank(grade) {
  const text = String(grade || "");
  if (text.includes("Asst. Team Leader")) return 2;
  if (text.includes("Team Leader")) return 1;
  if (text.includes("Staff")) return 3;
  return 9;
}

function getPmScheduleJoinValue(emp) {
  const join = String(emp?.join || "9999-12-31");
  const time = Date.parse(join);
  return Number.isFinite(time) ? time : Date.parse("9999-12-31");
}

function comparePmScheduleEmployees(a, b) {
  const deptA = pmScheduleDeptOrder.indexOf(normalizePmScheduleVietDeptName(a.dept));
  const deptB = pmScheduleDeptOrder.indexOf(normalizePmScheduleVietDeptName(b.dept));
  const orderA = deptA >= 0 ? deptA : 999;
  const orderB = deptB >= 0 ? deptB : 999;
  if (orderA !== orderB) return orderA - orderB;

  const gradeA = getPmScheduleGradeRank(a.grade);
  const gradeB = getPmScheduleGradeRank(b.grade);
  if (gradeA !== gradeB) return gradeA - gradeB;

  const joinA = getPmScheduleJoinValue(a);
  const joinB = getPmScheduleJoinValue(b);
  if (joinA !== joinB) return joinA - joinB;

  return String(a.name || "").localeCompare(String(b.name || ""));
}

function formatPmSchedulePersonName(emp) {
  return {
    empNo: emp.empNo,
    name: emp.name || "",
    grade: emp.grade || "",
    koreanName: emp.koreanName || "",
    join: emp.join || ""
  };
}

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

function getPmScheduleVietEmployees() {
  const list = (typeof employees !== "undefined" ? employees : [])
    .filter(emp => emp.company === "Viet QS" && emp.status === "재직")
    .filter(emp => !["경영진", "Management Support"].includes(emp.dept));

  return list.sort(comparePmScheduleEmployees);
}

function getPmScheduleCategoryDeptMap() {
  return {
    Structure: ["Vertical", "Horizon / Foundation", "Horizontal/Foundation"],
    Finish: ["Internal 1", "Internal 2", "Internal 3", "Partition&Opening", "External"],
    Civil: ["Civil"]
  };
}

function normalizePmScheduleVietDeptName(value) {
  const text = String(value || "").trim();
  if (text === "Horizontal/Foundation") return "Horizon / Foundation";
  return text;
}

function getPmScheduleCategoryForDept(dept) {
  const normalized = normalizePmScheduleVietDeptName(dept);
  const map = getPmScheduleCategoryDeptMap();
  return Object.keys(map).find(category => map[category].includes(normalized)) || "Finish";
}

function getPmScheduleVietEmployeesByCategory(category = pmScheduleModalCategory) {
  const allowed = getPmScheduleCategoryDeptMap()[category] || [];
  return getPmScheduleVietEmployees().filter(emp => allowed.includes(normalizePmScheduleVietDeptName(emp.dept)));
}

function getPmScheduleMiddleDeptOptions(category = pmScheduleModalCategory) {
  return getPmScheduleCategoryDeptMap()[category] || [];
}

function getPmScheduleEffectiveMiddleDept(category = pmScheduleModalCategory) {
  const options = getPmScheduleMiddleDeptOptions(category);
  if (!isPmScheduleLeaderRole()) return "";
  if (options.includes(pmScheduleModalMiddleDept)) return pmScheduleModalMiddleDept;
  return options[0] || "";
}

function isPmScheduleLeaderRole() {
  const role = getPmScheduleRole();
  return role === "Leader" || role === "Asst.Leader" || role.includes("Team Leader");
}

function setPmScheduleModalMiddleDept(value) {
  pmScheduleModalMiddleDept = value || "";
  renderPmSchedulePlanModal();
}

function getPmScheduleVisibleRows(item, category = pmScheduleModalCategory, middleDept = "") {
  const allowed = getPmScheduleCategoryDeptMap()[category] || [];
  const targetMiddle = middleDept ? normalizePmScheduleVietDeptName(middleDept) : "";
  const rows = item?.proposals?.plan1?.rows || [];
  let prevDept = "";
  return rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => {
      const dept = normalizePmScheduleVietDeptName(row.dept);
      if (!allowed.includes(dept)) return false;
      return !targetMiddle || dept === targetMiddle;
    })
    .map(({ row, index }) => {
      const dept = normalizePmScheduleVietDeptName(row.dept);
      const group = dept !== prevDept ? dept : "";
      prevDept = dept;
      return { row: { ...row, group }, index };
    });
}

function setPmScheduleModalCategory(value) {
  pmScheduleModalCategory = value || "Structure";
  pmScheduleModalMiddleDept = getPmScheduleMiddleDeptOptions(pmScheduleModalCategory)[0] || "";
  renderPmSchedulePlanModal();
}

function createPmSchedulePlanRows() {
  const staff = getPmScheduleVietEmployees();
  return staff.map((emp, index, array) => {
    const dept = normalizePmScheduleVietDeptName(emp.dept);
    const prevDept = index > 0 ? normalizePmScheduleVietDeptName(array[index - 1].dept) : "";
    const firstInDept = index === 0 || prevDept !== dept;
    const person = formatPmSchedulePersonName(emp);
    return {
      empNo: person.empNo,
      dept,
      group: firstInDept ? dept : "",
      name: person.name,
      grade: person.grade,
      koreanName: person.koreanName,
      join: person.join,
      plan1: { rc: true, sc: false, people: "1", workDays: "", totalDays: "" },
      plan2: { rc: false, sc: false, people: "", workDays: "", totalDays: "" },
      scope: ""
    };
  });
}

function createPmScheduleProposals() {
  const rows = createPmSchedulePlanRows();
  return {
    plan1: {
      id: "plan1",
      title: "1안 (전체 투입)",
      author: "작성 전",
      submittedAt: "미제출",
      rows
    },
    plan2: {
      id: "plan2",
      title: "2안 (최적화 배치)",
      author: "작성 전",
      submittedAt: "미제출",
      rows: rows.map(row => ({
        ...clonePmScheduleData(row),
        plan1: clonePmScheduleData(row.plan1),
        plan2: clonePmScheduleData(row.plan2)
      }))
    }
  };
}

function normalizeExistingPmScheduleRows(item) {
  if (!item?.proposals?.plan1?.rows?.length) return;
  const freshRows = createPmSchedulePlanRows();
  const oldPlan1 = item.proposals.plan1.rows || [];
  const oldPlan2 = item.proposals.plan2?.rows || [];
  const oldPlan1Map = new Map(oldPlan1.map(row => [row.empNo, row]));
  const oldPlan2Map = new Map(oldPlan2.map(row => [row.empNo, row]));

  item.proposals.plan1.rows = freshRows.map(row => {
    const oldRow = oldPlan1Map.get(row.empNo) || {};
    return {
      ...row,
      plan1: clonePmScheduleData(oldRow.plan1 || row.plan1),
      plan2: clonePmScheduleData(oldRow.plan2 || row.plan2),
      scope: oldRow.scope || row.scope
    };
  });

  item.proposals.plan2.rows = freshRows.map(row => {
    const oldRow = oldPlan2Map.get(row.empNo) || oldPlan1Map.get(row.empNo) || {};
    return {
      ...row,
      plan1: clonePmScheduleData(oldRow.plan1 || row.plan1),
      plan2: clonePmScheduleData(oldRow.plan2 || row.plan2),
      scope: oldRow.scope || row.scope
    };
  });
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
  if (pmScheduleProjects.length) {
    pmScheduleProjects.forEach(normalizeExistingPmScheduleRows);
    return;
  }
  pmScheduleProjects = buildPmScheduleSeedProjects();
  if (!pmScheduleProjects.length && typeof projectReceiveState !== "undefined") {
    pmScheduleProjects = [makePmScheduleProject(projectReceiveState, "프로젝트 접수", "pending")];
  }
  pmScheduleProjects.forEach(normalizeExistingPmScheduleRows);
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
  normalizeExistingPmScheduleRows(item);
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
    .sort(comparePmScheduleEmployees)
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
    const pmDeptOptions = ["구조팀", "마감팀", "토목ㆍ조경팀"];
    const pmTargets = getConCostPmCandidatesByDept(item.project, pmSchedulePmRequestDeptFilter);
    pmList.innerHTML = `
      <div class="pm-request-filter-row">
        <label><span>대상 부서</span><select onchange="setPmSchedulePmRequestDeptFilter(this.value)">
          ${pmDeptOptions.map(dept => `<option value="${escapePmScheduleAttr(dept)}" ${pmSchedulePmRequestDeptFilter === dept ? "selected" : ""}>${escapePmScheduleHtml(dept)}</option>`).join("")}
        </select></label>
      </div>
      <div class="pm-check-list-inner">
        ${pmTargets.length ? pmTargets.map(emp => {
          const value = `${emp.name} ${emp.grade}`;
          return `<label class="pm-check-item"><input type="checkbox" ${item.requestTargets.pm.includes(value) ? "checked" : ""} onchange="togglePmScheduleRequestTarget('pm', '${escapePmScheduleAttr(value)}', this.checked)" /> <span>${escapePmScheduleHtml(value)} · ${escapePmScheduleHtml(emp.dept)}</span></label>`;
        }).join("") : `<div class="pm-empty-box small">선택한 부서의 PM 후보가 없습니다.</div>`}
      </div>`;
  }
  if (tlList) {
    const tlDeptOptions = ["Structure", "Finish", "Civil"];
    const leaders = getVietTeamLeaderCandidatesByCategory(pmScheduleTlRequestDeptFilter);
    tlList.innerHTML = `
      <div class="pm-request-filter-row">
        <label><span>대상 부서</span><select onchange="setPmScheduleTlRequestDeptFilter(this.value)">
          ${tlDeptOptions.map(dept => `<option value="${escapePmScheduleAttr(dept)}" ${pmScheduleTlRequestDeptFilter === dept ? "selected" : ""}>${escapePmScheduleHtml(dept)}</option>`).join("")}
        </select></label>
      </div>
      <div class="pm-check-list-inner pm-teamleader-list-inner">
        ${leaders.length ? leaders.map(emp => {
          const value = `${emp.koreanName ? emp.koreanName + ' / ' : ''}${emp.name} ${emp.grade} · ${normalizePmScheduleVietDeptName(emp.dept)}`;
          return `<label class="pm-check-item"><input type="checkbox" ${item.requestTargets.teamLeaders.includes(value) ? "checked" : ""} onchange="togglePmScheduleRequestTarget('teamLeaders', '${escapePmScheduleAttr(value)}', this.checked)" /> <span>${escapePmScheduleHtml(value)}</span></label>`;
        }).join("") : `<div class="pm-empty-box small">선택한 부서의 Team Leader가 없습니다.</div>`}
      </div>`;
  }
}

function setPmSchedulePmRequestDeptFilter(value) {
  pmSchedulePmRequestDeptFilter = value || "구조팀";
  const item = getCurrentPmScheduleProject();
  if (item) renderPmScheduleRequestTargets(item);
}

function setPmScheduleTlRequestDeptFilter(value) {
  pmScheduleTlRequestDeptFilter = value || "Structure";
  const item = getCurrentPmScheduleProject();
  if (item) renderPmScheduleRequestTargets(item);
}

function getConCostPmCandidatesByDept(project, deptFilter) {
  const staff = (typeof employees !== "undefined" ? employees : []).filter(emp => emp.company === "CON-COST" && emp.status === "재직");
  const key = normalizePmScheduleDept(deptFilter);
  const matched = staff.filter(emp => {
    const dept = normalizePmScheduleDept(emp.dept);
    if (key.includes("구조")) return dept.includes("구조");
    if (key.includes("마감")) return dept.includes("마감");
    if (key.includes("토목") || key.includes("조경")) return dept.includes("토목") || dept.includes("조경");
    return true;
  });
  return matched.length ? matched : staff;
}

function getVietTeamLeaderCandidatesByCategory(category) {
  const allowed = getPmScheduleCategoryDeptMap()[category] || [];
  return (typeof employees !== "undefined" ? employees : [])
    .filter(emp => emp.company === "Viet QS" && emp.status === "재직" && String(emp.grade).includes("Team Leader"))
    .filter(emp => allowed.includes(normalizePmScheduleVietDeptName(emp.dept)))
    .sort(comparePmScheduleEmployees);
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
  const p1 = item.proposals.plan1;
  const p2 = item.proposals.plan2;
  const editableText = editable ? "편집하기" : "1·2안 한꺼번에 보기";
  grid.innerHTML = `
    <div class="pm-plan-open-card">
      <div>
        <strong>스케쥴 1ㆍ2안 작성 ${editable ? `<em class="pm-editor-status ${getPmScheduleEditorStatus(item).className}">${getPmScheduleEditorStatus(item).label}</em>` : ""}</strong>
        <span>1안: ${escapePmScheduleHtml(p1.author)} · ${escapePmScheduleHtml(p1.submittedAt)} / 2안: ${escapePmScheduleHtml(p2.author)} · ${escapePmScheduleHtml(p2.submittedAt)}</span>
      </div>
      <button class="btn btn-primary" type="button" onclick="openPmSchedulePlanModal(${editable ? 'true' : 'false'})">${editableText}</button>
    </div>
  `;
}

function openPmSchedulePlanModal(editable = false) {
  pmScheduleModalEditable = Boolean(editable);
  ensurePmSchedulePlanModal();
  const modal = document.getElementById("pmSchedulePlanModal");
  if (!modal) return;
  renderPmSchedulePlanModal();
  modal.classList.add("active");
}

function closePmSchedulePlanModal() {
  document.getElementById("pmSchedulePlanModal")?.classList.remove("active");
}

function ensurePmSchedulePlanModal() {
  if (document.getElementById("pmSchedulePlanModal")) return;
  const modal = document.createElement("div");
  modal.id = "pmSchedulePlanModal";
  modal.className = "modal-backdrop pm-plan-modal-backdrop";
  modal.innerHTML = `
    <div class="modal pm-plan-modal">
      <div class="modal-head">
        <div>
          <h3 id="pmSchedulePlanModalTitle">스케쥴 1안 / 2안</h3>
          <p id="pmSchedulePlanModalSub" class="subcopy"></p>
        </div>
        <button class="close" type="button" onclick="closePmSchedulePlanModal()">×</button>
      </div>
      <div class="modal-body pm-plan-modal-body" id="pmSchedulePlanModalBody"></div>
      <div class="modal-foot" id="pmSchedulePlanModalFoot"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closePmSchedulePlanModal();
  });
}

function renderPmSchedulePlanModal() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  normalizeExistingPmScheduleRows(item);
  const title = document.getElementById("pmSchedulePlanModalTitle");
  const sub = document.getElementById("pmSchedulePlanModalSub");
  const body = document.getElementById("pmSchedulePlanModalBody");
  const foot = document.getElementById("pmSchedulePlanModalFoot");
  if (title) title.textContent = "스케쥴 1안 / 2안 가로 비교";
  if (sub) sub.textContent = `${item.project.projectName || "프로젝트명 미입력"} · Viet QS 부서/인사카드 기준`;
  if (body) body.innerHTML = renderPmScheduleCombinedSheet(item, pmScheduleModalEditable);
  if (foot) {
    foot.innerHTML = pmScheduleModalEditable
      ? `<button class="btn btn-line" type="button" onclick="closePmSchedulePlanModal()">닫기</button><button class="btn btn-primary" type="button" onclick="submitPmScheduleEditor()">스케쥴 작성 완료</button>`
      : renderPmScheduleApprovalControls(item);
  }
}

function renderPmScheduleApprovalControls(item) {
  return `
    <div class="pm-modal-approval-panel">
      <div class="pm-modal-approval-choice">
        <label><input type="checkbox" name="pmModalSelectedProposal" value="plan1" onclick="togglePmScheduleModalApprovalPlan(this, 'plan1')" /> <span>1안 선택</span></label>
        <label><input type="checkbox" name="pmModalSelectedProposal" value="plan2" onclick="togglePmScheduleModalApprovalPlan(this, 'plan2')" /> <span>2안 선택</span></label>
      </div>
      <label class="pm-modal-reject-reason"><span>반려 사유</span><textarea id="pmScheduleModalRejectReason" rows="2" placeholder="반려 시 PM 또는 Team Leader에게 전달할 사유를 작성하세요."></textarea></label>
      <div class="pm-modal-approval-actions">
        <button class="btn btn-primary" id="pmScheduleModalApproveBtn" type="button" onclick="approvePmScheduleProposal()" disabled>선택안 승인</button>
        <button class="btn btn-danger" type="button" onclick="rejectPmScheduleProposal()">반려</button>
        <button class="btn btn-line" type="button" onclick="closePmSchedulePlanModal()">닫기</button>
      </div>
    </div>
  `;
}

function togglePmScheduleModalApprovalPlan(input, planId) {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const wasSelected = item.selectedProposal === planId && !input.checked;
  document.querySelectorAll('input[name="pmModalSelectedProposal"]').forEach(el => {
    if (el !== input) el.checked = false;
  });
  item.selectedProposal = wasSelected ? "" : (input.checked ? planId : "");
  const approveBtn = document.getElementById("pmScheduleModalApproveBtn");
  if (approveBtn) approveBtn.disabled = !item.selectedProposal;
}

function setPmScheduleModalApprovalPlan(planId) {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  item.selectedProposal = planId;
  const approveBtn = document.getElementById("pmScheduleModalApproveBtn");
  if (approveBtn) approveBtn.disabled = !planId;
}

function renderPmScheduleCombinedSheet(item, editable) {
  const activeCategory = editable ? pmScheduleModalCategory : (item.submittedCategory || pmScheduleModalCategory || "Structure");
  const isLeaderEditor = editable && isPmScheduleLeaderRole();
  const effectiveMiddle = isLeaderEditor ? getPmScheduleEffectiveMiddleDept(activeCategory) : "";
  if (isLeaderEditor && !pmScheduleModalMiddleDept) pmScheduleModalMiddleDept = effectiveMiddle;
  const oldCategory = pmScheduleModalCategory;
  pmScheduleModalCategory = activeCategory;
  const visibleRows = getPmScheduleVisibleRows(item, activeCategory, effectiveMiddle);
  const plan1Total = getPmSchedulePlanTotal(item, "plan1", activeCategory, effectiveMiddle);
  const plan2Total = getPmSchedulePlanTotal(item, "plan2", activeCategory, effectiveMiddle);
  const showScopeColumns = activeCategory === "Structure";
  const showGroupColumn = !isLeaderEditor;
  const middleOptions = getPmScheduleMiddleDeptOptions(activeCategory);
  const categoryControl = editable ? `
      <div class="pm-plan-category-controls">
        <label class="pm-plan-category-select">
          <b>대분류 부서</b>
          <select onchange="setPmScheduleModalCategory(this.value)">
            ${["Structure", "Finish", "Civil"].map(category => `<option value="${category}" ${activeCategory === category ? "selected" : ""}>${category}</option>`).join("")}
          </select>
        </label>
        ${isLeaderEditor ? `<label class="pm-plan-category-select"><b>중분류 부서</b><select onchange="setPmScheduleModalMiddleDept(this.value)">${middleOptions.map(dept => `<option value="${escapePmScheduleAttr(dept)}" ${effectiveMiddle === dept ? "selected" : ""}>${escapePmScheduleHtml(dept)}</option>`).join("")}</select></label>` : ""}
      </div>` : `<span>검토 대분류: <b>${escapePmScheduleHtml(activeCategory)}</b></span>`;
  const baseColgroup = `${showGroupColumn ? '<col class="pm-col-group" />' : ''}<col class="pm-col-name" />`;
  const structureColgroup = `
          ${baseColgroup}
          <col class="pm-col-check" />
          <col class="pm-col-check" />
          <col class="pm-col-people" />
          <col class="pm-col-days" />
          <col class="pm-col-total" />
          <col class="pm-col-check" />
          <col class="pm-col-check" />
          <col class="pm-col-people" />
          <col class="pm-col-days" />
          <col class="pm-col-total" />
          <col class="pm-col-scope" />`;
  const simpleColgroup = `
          ${baseColgroup}
          <col class="pm-col-people" />
          <col class="pm-col-days" />
          <col class="pm-col-total" />
          <col class="pm-col-people" />
          <col class="pm-col-days" />
          <col class="pm-col-total" />
          <col class="pm-col-scope" />`;
  const firstColumns = `${showGroupColumn ? '<th rowspan="2">구분</th>' : ''}<th rowspan="2">성명</th>`;
  const structureHeader = `
          <tr>
            ${firstColumns}
            <th colspan="2" class="pm-scope-header">작업범위</th>
            <th colspan="3">1안 (전체 투입)</th>
            <th colspan="2" class="pm-scope-header">작업범위</th>
            <th colspan="3">2안 (최적화 배치)</th>
            <th rowspan="2">비고</th>
          </tr>
          <tr>
            <th class="pm-scope-cell">RC</th><th class="pm-scope-cell">SC</th><th>투입인원</th><th>작업일수</th><th>전체일수</th>
            <th class="pm-scope-cell">RC</th><th class="pm-scope-cell">SC</th><th>투입인원</th><th>작업일수</th><th>전체일수</th>
          </tr>`;
  const simpleHeader = `
          <tr>
            ${firstColumns}
            <th colspan="3">1안 (전체 투입)</th>
            <th colspan="3">2안 (최적화 배치)</th>
            <th rowspan="2">비고</th>
          </tr>
          <tr>
            <th>투입인원</th><th>작업일수</th><th>전체일수</th>
            <th>투입인원</th><th>작업일수</th><th>전체일수</th>
          </tr>`;
  const groupSpan = showGroupColumn ? 2 : 1;
  const structureTotal = `
          <tr class="pm-sheet-total-row">
            <th colspan="${groupSpan}">전체일수</th>
            <td colspan="2"></td>
            <th colspan="2">1안 합계</th>
            <td data-pm-total="plan1">${plan1Total}</td>
            <td colspan="2"></td>
            <th colspan="2">2안 합계</th>
            <td data-pm-total="plan2">${plan2Total}</td>
            <td></td>
          </tr>`;
  const simpleTotal = `
          <tr class="pm-sheet-total-row">
            <th colspan="${groupSpan}">전체일수</th>
            <th colspan="2">1안 합계</th>
            <td data-pm-total="plan1">${plan1Total}</td>
            <th colspan="2">2안 합계</th>
            <td data-pm-total="plan2">${plan2Total}</td>
            <td></td>
          </tr>`;
  const html = `
    <div class="pm-plan-guide">
      <div class="pm-plan-guide-left">
        <span>계산식: 투입인원 × 작업일수 = 전체일수</span>
        <span>1안 합계: <b data-pm-total="plan1">${plan1Total}</b></span>
        <span>2안 합계: <b data-pm-total="plan2">${plan2Total}</b></span>
      </div>
      ${categoryControl}
    </div>
    <div class="pm-schedule-sheet-wrap pm-combined-sheet-wrap pm-schedule-soft-table-wrap">
      <table class="pm-schedule-sheet-table pm-combined-sheet-table pm-schedule-soft-table ${showScopeColumns ? "has-scope" : "no-scope"} ${showGroupColumn ? "with-group" : "without-group"}">
        <colgroup>
          ${showScopeColumns ? structureColgroup : simpleColgroup}
        </colgroup>
        <thead>
          ${showScopeColumns ? structureHeader : simpleHeader}
        </thead>
        <tbody>
          ${visibleRows.map(({ row, index }, visibleIndex) => renderPmScheduleCombinedRow(item, row, index, editable, showScopeColumns, showGroupColumn, visibleIndex)).join("")}
          ${showScopeColumns ? structureTotal : simpleTotal}
        </tbody>
      </table>
    </div>
  `;
  pmScheduleModalCategory = oldCategory;
  return html;
}

function renderPmScheduleCombinedRow(item, row, rowIndex, editable, showScopeColumns = true, showGroupColumn = true, visibleIndex = rowIndex) {
  const plan1 = row.plan1 || {};
  const plan2 = item.proposals.plan2.rows[rowIndex]?.plan2 || row.plan2 || {};
  let navCol = 0;
  const navAttrs = () => `data-pm-row="${visibleIndex}" data-pm-col="${navCol++}" onkeydown="handlePmScheduleCellKey(event)"`;
  const input = (planId, field, value, className = "") => editable
    ? `<input class="pm-sheet-input pm-nav-cell ${className}" ${navAttrs()} value="${escapePmScheduleAttr(value)}" oninput="updatePmSchedulePlanCell('${planId}', ${rowIndex}, '${field}', this.value)" />`
    : `<span>${escapePmScheduleHtml(value || "")}</span>`;
  const total = (planId, value) => `<span class="pm-sheet-calculated" id="pm-${planId}-total-${rowIndex}">${escapePmScheduleHtml(value || "")}</span>`;
  const checkbox = (planId, field, checked) => editable
    ? `<input class="pm-nav-cell" ${navAttrs()} type="checkbox" ${checked ? "checked" : ""} onchange="updatePmSchedulePlanCell('${planId}', ${rowIndex}, '${field}', this.checked)" />`
    : `<input type="checkbox" ${checked ? "checked" : ""} disabled />`;
  const scopeInput = editable
    ? `<input class="pm-sheet-input pm-nav-cell" ${navAttrs()} value="${escapePmScheduleAttr(row.scope || "")}" oninput="updatePmSchedulePlanCell('plan1', ${rowIndex}, 'scope', this.value)" />`
    : `<span>${escapePmScheduleHtml(row.scope || "")}</span>`;

  return `
    <tr>
      ${showGroupColumn ? `<th class="pm-sheet-group">${escapePmScheduleHtml(row.group)}</th>` : ""}
      <td class="pm-sheet-name"><div class="pm-person-name-wrap"><strong class="pm-person-name">${escapePmScheduleHtml(row.name)}</strong>${row.grade ? `<em class="pm-person-grade">${escapePmScheduleHtml(row.grade)}</em>` : ""}${row.koreanName ? `<small class="pm-person-korean">${escapePmScheduleHtml(row.koreanName)}</small>` : ""}${row.join ? `<small class="pm-person-join">입사 ${escapePmScheduleHtml(row.join)}</small>` : ""}</div></td>
      ${showScopeColumns ? `<td class="pm-scope-cell">${checkbox("plan1", "rc", plan1.rc)}</td><td class="pm-scope-cell">${checkbox("plan1", "sc", plan1.sc)}</td>` : ""}
      <td>${input("plan1", "people", plan1.people, "center")}</td>
      <td>${input("plan1", "workDays", plan1.workDays, "center")}</td>
      <td>${total("plan1", calculatePmScheduleRowTotal(plan1))}</td>
      ${showScopeColumns ? `<td class="pm-scope-cell">${checkbox("plan2", "rc", plan2.rc)}</td><td class="pm-scope-cell">${checkbox("plan2", "sc", plan2.sc)}</td>` : ""}
      <td>${input("plan2", "people", plan2.people, "center")}</td>
      <td>${input("plan2", "workDays", plan2.workDays, "center")}</td>
      <td>${total("plan2", calculatePmScheduleRowTotal(plan2))}</td>
      <td class="pm-scope-text-cell">${scopeInput}</td>
    </tr>
  `;
}

function calculatePmScheduleRowTotal(data) {
  const people = Number(String(data?.people ?? "").replace(/,/g, ""));
  const days = Number(String(data?.workDays ?? "").replace(/,/g, ""));
  if (!Number.isFinite(people) || !Number.isFinite(days) || people <= 0 || days <= 0) return "";
  const value = people * days;
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.00$/, "");
}

function getPmSchedulePlanTotal(item, planId, category = pmScheduleModalCategory, middleDept = "") {
  const visible = getPmScheduleVisibleRows(item, category, middleDept);
  const sum = visible.reduce((acc, { row, index }) => {
    const data = planId === "plan1" ? row.plan1 : item.proposals.plan2.rows[index]?.plan2;
    const value = Number(calculatePmScheduleRowTotal(data));
    return acc + (Number.isFinite(value) ? value : 0);
  }, 0);
  return Number.isInteger(sum) ? String(sum) : sum.toFixed(2).replace(/\.00$/, "");
}

function handlePmScheduleCellKey(event) {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (!keys.includes(event.key)) return;
  const current = event.currentTarget;
  const row = Number(current.dataset.pmRow || 0);
  const col = Number(current.dataset.pmCol || 0);
  const targetRow = row + (event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0);
  const targetCol = col + (event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0);
  const target = document.querySelector(`.pm-combined-sheet-table .pm-nav-cell[data-pm-row="${targetRow}"][data-pm-col="${targetCol}"]`);
  if (!target) return;
  event.preventDefault();
  target.focus();
  if (typeof target.select === "function" && target.type !== "checkbox") {
    try { target.select(); } catch (error) {}
  }
}

function updatePmSchedulePlanCell(planId, rowIndex, field, value) {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const mainRow = item.proposals.plan1.rows[rowIndex];
  const plan2Row = item.proposals.plan2.rows[rowIndex];
  if (!mainRow || !plan2Row) return;

  if (field === "scope") {
    mainRow.scope = value;
    plan2Row.scope = value;
  } else if (planId === "plan1") {
    mainRow.plan1[field] = value;
  } else if (planId === "plan2") {
    plan2Row.plan2[field] = value;
  }

  updatePmSchedulePlanTotalsInDom(item, rowIndex);
}

function updatePmSchedulePlanTotalsInDom(item, rowIndex) {
  const row = item?.proposals?.plan1?.rows?.[rowIndex];
  const plan2Row = item?.proposals?.plan2?.rows?.[rowIndex];
  const p1Cell = document.getElementById(`pm-plan1-total-${rowIndex}`);
  const p2Cell = document.getElementById(`pm-plan2-total-${rowIndex}`);
  if (p1Cell && row) p1Cell.textContent = calculatePmScheduleRowTotal(row.plan1);
  if (p2Cell && plan2Row) p2Cell.textContent = calculatePmScheduleRowTotal(plan2Row.plan2);
  document.querySelectorAll('[data-pm-total="plan1"]').forEach(el => { el.textContent = getPmSchedulePlanTotal(item, "plan1"); });
  document.querySelectorAll('[data-pm-total="plan2"]').forEach(el => { el.textContent = getPmSchedulePlanTotal(item, "plan2"); });
}

function selectPmScheduleProposal(planId) {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  item.selectedProposal = item.selectedProposal === planId ? "" : planId;
  renderPmScheduleProposals(item, false);
}

function renderPmScheduleEditorView() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  normalizeExistingPmScheduleRows(item);
  const info = document.getElementById("pmScheduleEditorProjectInfo");
  if (info) {
    info.innerHTML = `
      <div><span>프로젝트명</span><strong>${escapePmScheduleHtml(item.project.projectName || "프로젝트명 미입력")}</strong></div>
      <div><span>작업범위</span><strong>${escapePmScheduleHtml(getPmScheduleScopeText(item.project))}</strong></div>
      <div><span>요청 메모</span><strong>${escapePmScheduleHtml(item.requestMemo || "요청 메모 없음")}</strong></div>
    `;
  }
  renderPmScheduleProposals(item, true);
  renderPmAssignedProjectButton();
}

function getPmScheduleEditorStatus(item) {
  if (!item || item.status === "pending" || item.status === "requested" || item.status === "rejected") return { label:"미작성", className:"red" };
  if (item.status === "submitted") return { label:"대기중", className:"yellow" };
  if (item.status === "approved") return { label:"승인", className:"green" };
  return { label:"미작성", className:"red" };
}

function renderPmAssignedProjectButton() {
  const holder = document.getElementById("pmAssignedProjectButtonHolder");
  if (!holder) return;
  holder.innerHTML = `<button class="btn btn-line" type="button" onclick="openPmAssignedProjectModal()">배정받은 프로젝트</button>`;
}

function openPmAssignedProjectModal() {
  ensurePmAssignedProjectModal();
  renderPmAssignedProjectModal();
  document.getElementById("pmAssignedProjectModal")?.classList.add("active");
}

function closePmAssignedProjectModal() {
  document.getElementById("pmAssignedProjectModal")?.classList.remove("active");
}

function ensurePmAssignedProjectModal() {
  if (document.getElementById("pmAssignedProjectModal")) return;
  const modal = document.createElement("div");
  modal.id = "pmAssignedProjectModal";
  modal.className = "modal-backdrop pm-assigned-modal-backdrop";
  modal.innerHTML = `
    <div class="modal pm-assigned-modal">
      <div class="modal-head"><h3>배정받은 프로젝트</h3><button class="close" type="button" onclick="closePmAssignedProjectModal()">×</button></div>
      <div class="modal-body" id="pmAssignedProjectModalBody"></div>
    </div>`;
  document.body.appendChild(modal);
}

function renderPmAssignedProjectModal() {
  const body = document.getElementById("pmAssignedProjectModalBody");
  if (!body) return;
  initPmScheduleProjects();
  body.innerHTML = `<div class="pm-assigned-project-list">${pmScheduleProjects.map((item, index) => {
    const state = getPmScheduleEditorStatus(item);
    const canWrite = item.status !== "approved" && item.status !== "submitted";
    return `<button class="pm-assigned-project-item" type="button" onclick="selectPmAssignedProject(${index})">
      <strong>${escapePmScheduleHtml(item.project.projectName || "프로젝트명 미입력")}</strong>
      <span>${escapePmScheduleHtml(item.project.projectNo || "-")} · ${escapePmScheduleHtml(getPmScheduleScopeText(item.project))}</span>
      <em class="pm-editor-status ${state.className}">${state.label}</em>
      ${canWrite ? `<b>스케쥴 1ㆍ2안 작성</b>` : `<b class="muted">스케쥴 1ㆍ2안 작성</b>`}
    </button>`;
  }).join("")}</div>`;
}

function selectPmAssignedProject(index) {
  pmScheduleSelectedIndex = index;
  closePmAssignedProjectModal();
  renderPmScheduleDashboard();
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
  item.submittedCategory = pmScheduleModalCategory;
  item.history.unshift(`${item.project.projectName} ${pmScheduleModalCategory} 스케쥴 작성 완료 결재 알림이 도착했습니다.`);
  closePmSchedulePlanModal();
  renderPmScheduleDashboard();
  showToast(`${item.project.projectName} 스케쥴 작성 완료`);
}

function approvePmScheduleProposal() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  if (!item.selectedProposal || !["plan1", "plan2"].includes(item.selectedProposal)) {
    showToast("승인할 1안 또는 2안을 먼저 선택하세요.");
    return;
  }
  const plan = item.proposals[item.selectedProposal];
  item.status = "approved";
  item.history.unshift(`${plan?.title || "선택안"}이 승인되어 프로젝트 일정으로 확정되었습니다.`);
  closePmSchedulePlanModal();
  renderPmScheduleDashboard();
  showToast("선택한 스케쥴 안을 승인하고 일정화했습니다.");
}

function rejectPmScheduleProposal() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const reason = (document.getElementById("pmScheduleModalRejectReason")?.value || document.getElementById("pmScheduleRejectReason")?.value || "").trim();
  if (!reason) {
    showToast("반려 사유를 먼저 작성하세요.");
    return;
  }
  const targets = [...item.requestTargets.pm, ...item.requestTargets.teamLeaders].join(", ") || "작성자";
  item.status = "rejected";
  item.history.unshift(`${targets}에게 반려 알림을 전송했습니다. 사유: ${reason}`);
  closePmSchedulePlanModal();
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
