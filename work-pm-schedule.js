/* =========================================================
   업무관리 > PM 배정 / 일정
   - 실장 권한: 접수 프로젝트 리스트, PM 지정, 스케쥴 1·2안 검토/승인/반려
   - PM / Leader 권한: 스케쥴 1·2안 편집 및 제출
   - 스케쥴 1·2안은 별도 모달 창에서 가로 비교/편집
========================================================= */

const pmScheduleDeptManagerMap = {
  "마감": "조한빈 실장",
  "구조팀": "장범선 실장",
  "BIM 파트": "장범 실장",
  "토목ㆍ조경파트": "장범선 실장",
  "인테리어·철거": "조한빈 실장",
  "비교내역서": "조한빈 실장",
  "단가작업": "조한빈 실장",
  "기계/전기": "조한빈 실장"
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
  "Horizon / Foundation",
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

function getPmScheduleTenureText(joinDate) {
  const raw = String(joinDate || "").trim();
  const parsed = Date.parse(raw);
  if (!Number.isFinite(parsed)) return "입사연차 미등록";
  const join = new Date(parsed);
  const now = new Date();
  let years = now.getFullYear() - join.getFullYear() + 1;
  if (years < 1) years = 1;
  return `입사 ${years}년차`;
}

function formatPmSchedulePersonName(emp) {
  const name = emp.name || "";
  const koreanName = emp.koreanName || "";
  const combinedName = koreanName ? `${name}(${koreanName})` : name;
  return {
    empNo: emp.empNo,
    name,
    combinedName,
    grade: emp.grade || "",
    koreanName,
    join: emp.join || "",
    tenureText: getPmScheduleTenureText(emp.join)
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
  return role === "PM" || role === "Staff" || role === "Leader" || role === "Asst.Leader" || role.includes("Team Leader");
}

function isPmScheduleStaffRole() {
  return getPmScheduleRole() === "Staff" || getPmScheduleRole() === "사원" || getPmScheduleRole() === "수석" || getPmScheduleRole() === "선임" || getPmScheduleRole() === "책임";
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
      displayName: person.combinedName,
      grade: person.grade,
      koreanName: person.koreanName,
      join: person.join,
      tenureText: person.tenureText,
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

function applyPmScheduleSuwonApprovedDummy(item) {
  const name = item?.project?.projectName || "";
  const no = item?.project?.projectNo || "";
  if (!name.includes("수원아이파크시티") && no !== "2026042") return;
  normalizeExistingPmScheduleRows(item);
  item.status = "approved";
  item.selectedProposal = "plan1";
  item.submittedCategory = "Structure";
  item.approvedPlan = "plan1";
  item.scheduleStartDate = "2026.05.11";
  item.scheduleApprovedAt = "2026.05.11 17:30";
  item.proposals.plan1.author = "한국 PM 작성안";
  item.proposals.plan1.submittedAt = "2026.05.11 16:41";
  item.proposals.plan2.author = "한국 PM 작성안";
  item.proposals.plan2.submittedAt = "2026.05.11 16:41";
  item.proposals.plan1.rows.forEach((row, idx) => {
    if (getPmScheduleCategoryForDept(row.dept) === "Structure") {
      row.plan1 = { rc:true, sc:false, people:"1", workDays:"5", totalDays:"5" };
      row.scope = row.scope || "";
    }
    const p2 = item.proposals.plan2.rows[idx];
    if (p2 && getPmScheduleCategoryForDept(p2.dept) === "Structure") {
      const usePlan2 = idx % 3 !== 1;
      p2.plan2 = { rc:usePlan2, sc:false, people:usePlan2 ? "1" : "", workDays:usePlan2 ? "7" : "", totalDays:usePlan2 ? "7" : "" };
      p2.scope = row.scope || "";
    }
  });
  item.history = [
    "2026.05.11 17:30 · 실장 승인: 1안이 선택되어 프로젝트 일정으로 확정되었습니다.",
    "2026.05.11 16:41 · 한국 PM: 스케쥴 1ㆍ2안 작성 완료 결재를 올렸습니다.",
    ...(item.history || []).filter(line => !String(line).includes("스케쥴"))
  ];
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
      pmBim: project.pmBim || "",
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
    pmScheduleProjects.forEach(item => { normalizeExistingPmScheduleRows(item); applyPmScheduleSuwonApprovedDummy(item); });
    return;
  }
  pmScheduleProjects = buildPmScheduleSeedProjects();
  if (!pmScheduleProjects.length && typeof projectReceiveState !== "undefined") {
    pmScheduleProjects = [makePmScheduleProject(projectReceiveState, "프로젝트 접수", "pending")];
  }
  pmScheduleProjects.forEach(item => { normalizeExistingPmScheduleRows(item); applyPmScheduleSuwonApprovedDummy(item); });
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
  list.innerHTML = `
    <div class="pm-project-list-table">
      <div class="pm-project-list-head">
        <span>상태</span>
        <span>프로젝트명</span>
        <span>접수번호 / 의뢰처</span>
        <span>작업범위</span>
      </div>
      ${filtered.map(item => {
        const realIndex = pmScheduleProjects.indexOf(item);
        const scope = getPmScheduleScopeText(item.project);
        return `
          <button class="pm-project-list-row ${realIndex === pmScheduleSelectedIndex ? "active" : ""}" type="button" onclick="selectPmScheduleProject(${realIndex})">
            <span class="pm-project-state ${item.status}">${getPmScheduleStatusLabel(item.status)}</span>
            <strong>${escapePmScheduleHtml(item.project.projectName || "프로젝트명 미입력")}</strong>
            <em>${escapePmScheduleHtml(item.project.projectNo || "NO 미입력")} · ${escapePmScheduleHtml(item.project.client || "의뢰처 미입력")}</em>
            <small>${escapePmScheduleHtml(scope)}</small>
          </button>
        `;
      }).join("")}
    </div>
  `;
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
  fillPmScheduleSelect("pmFinishSelect", getConCostPmCandidatesByDept(item.project, "마감팀"), item.assignment.pmFinish, "마감팀 PM 선택");
  fillPmScheduleSelect("pmStructureSelect", getConCostPmCandidatesByDept(item.project, "구조팀"), item.assignment.pmStructure, "구조팀 PM 선택");
  fillPmScheduleSelect("pmBimSelect", getConCostPmCandidatesByDept(item.project, "BIM파트"), item.assignment.pmBim, "BIM파트 PM 선택");
  fillPmScheduleSelect("pmCivilSelect", getConCostPmCandidatesByDept(item.project, "토목ㆍ조경파트"), item.assignment.pmCivil, "토목ㆍ조경파트 PM 선택");
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
      if (scope === "토목ㆍ조경파트") return dept.includes("토목") || dept.includes("조경");
      return true;
    });
  });
  return matched.length ? matched : staff;
}

function isVietTeamLeaderOnly(emp) {
  const grade = String(emp?.grade || "");
  return grade.includes("Team Leader") && !grade.includes("Asst. Team Leader");
}

function formatVietTeamLeaderRequestName(emp) {
  const englishName = String(emp?.name || "").trim();
  const koreanName = String(emp?.koreanName || "").trim();
  if (englishName && koreanName) return `${englishName}(${koreanName})`;
  return englishName || koreanName || "이름 미등록";
}

function getVietTeamLeaderCandidates() {
  return (typeof employees !== "undefined" ? employees : [])
    .filter(emp => emp.company === "Viet QS" && emp.status === "재직" && isVietTeamLeaderOnly(emp))
    .sort(comparePmScheduleEmployees)
    .slice(0, 24);
}

function normalizePmScheduleDept(value) {
  return String(value || "").replace(/[ㆍ·\/\s]/g, "");
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
    const pmDeptOptions = ["마감팀", "구조팀", "BIM파트", "토목ㆍ조경파트"];
    if (pmSchedulePmRequestDeptFilter === "BIM 파트") pmSchedulePmRequestDeptFilter = "BIM파트";
    const pmTargets = getConCostPmCandidatesByDept(item.project, pmSchedulePmRequestDeptFilter);
    pmList.innerHTML = `
      <div class="pm-request-filter-row">
        <label><span>부서</span><select onchange="setPmSchedulePmRequestDeptFilter(this.value)">
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
    const groupedLeaders = groupPmScheduleVietTeamLeadersByDept(leaders);
    tlList.innerHTML = `
      <div class="pm-request-filter-row pm-request-filter-row-title-right">
        <label><span>부서</span><select onchange="setPmScheduleTlRequestDeptFilter(this.value)">
          ${tlDeptOptions.map(dept => `<option value="${escapePmScheduleAttr(dept)}" ${pmScheduleTlRequestDeptFilter === dept ? "selected" : ""}>${escapePmScheduleHtml(dept)}</option>`).join("")}
        </select></label>
      </div>
      <div class="pm-check-list-inner pm-teamleader-list-inner pm-teamleader-group-list pm-teamleader-category-${escapePmScheduleAttr(pmScheduleTlRequestDeptFilter.toLowerCase())}">
        ${leaders.length ? groupedLeaders.map(group => `
          <div class="pm-teamleader-dept-group dept-${getPmScheduleTeamLeaderDeptClass(group.dept)}">
            <div class="pm-teamleader-dept-title">${formatPmScheduleTeamLeaderDeptTitle(group.dept)}</div>
            <div class="pm-teamleader-dept-items">
              ${group.members.map(emp => {
                const value = formatVietTeamLeaderRequestName(emp);
                return `<label class="pm-check-item"><input type="checkbox" ${item.requestTargets.teamLeaders.includes(value) ? "checked" : ""} onchange="togglePmScheduleRequestTarget('teamLeaders', '${escapePmScheduleAttr(value)}', this.checked)" /> <span>${escapePmScheduleHtml(value)}</span></label>`;
              }).join("")}
            </div>
          </div>
        `).join("") : `<div class="pm-empty-box small">선택한 부서의 Team Leader가 없습니다.</div>`}
      </div>`;
  }
}



function getPmScheduleTeamLeaderDisplayDept(emp) {
  const rawDept = normalizePmScheduleVietDeptName(emp?.dept);
  const englishName = String(emp?.name || "").trim();
  const koreanName = String(emp?.koreanName || "").trim();

  // 조직도 기준 보정: Dinh Phi(피)는 Internal 1 하위 Team Leader로 표기
  if (englishName === "Dinh Phi" || koreanName === "피") return "Internal 1";

  // 화면 표기는 사용자가 확인한 조직도 명칭 기준으로 통일
  if (rawDept === "Horizon / Foundation") return "Horizontal/Foundation";
  return rawDept;
}

function formatPmScheduleTeamLeaderDeptTitle(dept) {
  if (dept === "Partition&Opening") return "Partition<br>&amp;Opening";
  if (dept === "Horizontal/Foundation" || dept === "Horizon / Foundation") return "Horizontal<br>&amp;Foundation";
  return escapePmScheduleHtml(dept);
}

function getPmScheduleTeamLeaderDeptClass(dept) {
  const normalized = String(dept || "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
  return normalized || "none";
}

function groupPmScheduleVietTeamLeadersByDept(leaders) {
  const map = new Map();
  leaders.forEach(emp => {
    const dept = getPmScheduleTeamLeaderDisplayDept(emp);
    if (!map.has(dept)) map.set(dept, []);
    map.get(dept).push(emp);
  });

  const used = new Set();
  const categoryOrder = pmScheduleTlRequestDeptFilter === "Structure"
    ? ["Vertical", "Horizontal/Foundation"]
    : pmScheduleTlRequestDeptFilter === "Finish"
      ? ["Internal 1", "Internal 2", "Partition&Opening", "External"]
      : ["Civil"];

  const ordered = categoryOrder.map(dept => {
    used.add(dept);
    return { dept, members: map.get(dept) || [] };
  });

  map.forEach((members, dept) => {
    if (!used.has(dept)) ordered.push({ dept, members });
  });
  return ordered;
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

function getConCostOrgEmployeeIdsByDeptName(deptName) {
  const targetKey = normalizePmScheduleDept(deptName);
  const structures = typeof orgStructures !== "undefined" ? orgStructures : null;
  const roots = structures ? Object.values(structures).filter(Boolean) : [];
  const ids = new Set();

  function collectEmployeeIds(node) {
    if (!node) return;
    if (node.employeeId) ids.add(node.employeeId);
    (node.children || []).forEach(collectEmployeeIds);
  }

  function walk(node) {
    if (!node) return;
    const nodeName = normalizePmScheduleDept(node.displayName || node.title || "");
    if (nodeName === targetKey) {
      collectEmployeeIds(node);
      return;
    }
    (node.children || []).forEach(walk);
  }

  roots.forEach(walk);
  return ids;
}

function getConCostPmCandidatesByDept(project, deptFilter) {
  const staff = (typeof employees !== "undefined" ? employees : []).filter(emp => emp.company === "CON-COST" && emp.status === "재직");
  const key = normalizePmScheduleDept(deptFilter);
  const orgSearchNames = {
    "마감팀": ["마감팀", "마감"],
    "구조팀": ["구조팀"],
    "BIM파트": ["BIM파트", "BIM 파트"],
    "토목조경파트": ["토목ㆍ조경파트", "토목·조경파트", "토목 조경파트"]
  };
  const searchNames = orgSearchNames[key] || [deptFilter];
  const orgIds = new Set();
  searchNames.forEach(name => getConCostOrgEmployeeIdsByDeptName(name).forEach(id => orgIds.add(id)));

  if (orgIds.size) {
    const byOrg = staff.filter(emp => orgIds.has(emp.empNo));
    if (byOrg.length) return sortConCostPmCandidates(byOrg);
  }

  const matched = staff.filter(emp => {
    const dept = normalizePmScheduleDept(emp.dept);
    if (key.includes("BIM")) return dept.includes("BIM");
    if (key.includes("마감")) return dept.includes("마감");
    if (key.includes("토목") || key.includes("조경")) return dept.includes("토목조경") && !dept.includes("구조토목조경");
    if (key.includes("구조")) return dept.includes("구조토목조경") || (dept.includes("구조") && !dept.includes("토목조경파트"));
    return false;
  });
  return sortConCostPmCandidates(matched);
}

function sortConCostPmCandidates(list) {
  const rank = { "실장": 1, "팀장": 2, "파트장": 3, "수석": 4, "책임": 5, "선임": 6, "프로": 7, "사원": 8 };
  return [...list].sort((a, b) => {
    const gradeA = rank[a.grade] || 99;
    const gradeB = rank[b.grade] || 99;
    if (gradeA !== gradeB) return gradeA - gradeB;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
}

function getVietTeamLeaderCandidatesByCategory(category) {
  const allowed = getPmScheduleCategoryDeptMap()[category] || [];
  return (typeof employees !== "undefined" ? employees : [])
    .filter(emp => emp.company === "Viet QS" && emp.status === "재직" && isVietTeamLeaderOnly(emp))
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
      <td class="pm-sheet-name"><div class="pm-person-name-wrap"><strong class="pm-person-name">${escapePmScheduleHtml(row.displayName || row.name)}</strong><small class="pm-person-tenure">${escapePmScheduleHtml(row.tenureText || getPmScheduleTenureText(row.join))}</small>${row.grade ? `<em class="pm-person-grade">${escapePmScheduleHtml(row.grade)}</em>` : ""}</div></td>
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
  applyPmScheduleSuwonApprovedDummy(item);
  const info = document.getElementById("pmScheduleEditorProjectInfo");
  if (info) {
    info.innerHTML = `
      <div><span>프로젝트명</span><strong>${escapePmScheduleHtml(item.project.projectName || "프로젝트명 미입력")}</strong></div>
      <div><span>작업범위</span><strong>${escapePmScheduleHtml(getPmScheduleScopeText(item.project))}</strong></div>
      <div><span>요청 메모</span><strong>${escapePmScheduleHtml(item.requestMemo || "요청 메모 없음")}</strong></div>
    `;
  }
  if (isPmScheduleStaffRole()) {
    renderPmScheduleStaffView(item);
  } else {
    renderPmScheduleProposals(item, true);
  }
  renderPmAssignedProjectButton();
  renderPmScheduleApprovedBoard(item);
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


function getPmScheduleApprovedRows(item) {
  const planId = item?.approvedPlan || item?.selectedProposal || "plan1";
  const category = item?.submittedCategory || "Structure";
  return getPmScheduleVisibleRows(item, category, "").map(({ row, index }) => {
    const planData = planId === "plan1" ? row.plan1 : item.proposals.plan2.rows[index]?.plan2;
    const days = Number(calculatePmScheduleRowTotal(planData));
    if (!Number.isFinite(days) || days <= 0) return null;
    return { row, index, planData, totalDays: days };
  }).filter(Boolean);
}

function getPmScheduleDateAddText(startText, addDays) {
  const raw = String(startText || "2026.05.11").replaceAll(".", "-");
  const date = new Date(raw);
  if (!Number.isFinite(date.getTime())) return startText || "-";
  date.setDate(date.getDate() + Math.max(0, Number(addDays || 0) - 1));
  const pad = n => String(n).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth()+1)}.${pad(date.getDate())}`;
}

function renderPmScheduleApprovedBoard(item) {
  const grid = document.getElementById("pmScheduleEditorGrid");
  if (!grid) return;
  let board = document.getElementById("pmScheduleApprovedBoard");
  if (!board) {
    board = document.createElement("section");
    board.id = "pmScheduleApprovedBoard";
    board.className = "pm-approved-board";
    grid.insertAdjacentElement("afterend", board);
  }
  if (item.status !== "approved") {
    board.innerHTML = "";
    board.style.display = "none";
    return;
  }
  board.style.display = "block";
  const rows = getPmScheduleApprovedRows(item);
  const maxDays = Math.max(...rows.map(r => r.totalDays), 1);
  const start = item.scheduleStartDate || "2026.05.11";
  const role = getPmScheduleRole();
  const isStaff = isPmScheduleStaffRole();
  const visibleRows = isStaff ? rows.slice(0, 1) : rows;
  board.innerHTML = `
    <div class="pm-approved-head">
      <div><strong>승인 일정 진행 현황</strong><span>${escapePmScheduleHtml(item.project.projectName || "프로젝트")} · ${escapePmScheduleHtml(item.approvedPlan === "plan2" ? "2안" : "1안")} 승인 · 시작일 ${escapePmScheduleHtml(start)}</span></div>
      <em>${escapePmScheduleHtml(item.scheduleApprovedAt || "2026.05.11")}</em>
    </div>
    <div class="pm-approved-history"><b>처리 이력</b><span>${escapePmScheduleHtml((item.history || [])[0] || "2026.05.11 · 1안 승인")}</span></div>
    <div class="pm-approved-chart">
      ${visibleRows.map((entry, idx) => {
        const width = Math.max(8, Math.round(entry.totalDays / maxDays * 100));
        const progress = Math.min(100, Math.max(12, idx % 4 === 0 ? 70 : idx % 4 === 1 ? 52 : idx % 4 === 2 ? 35 : 18));
        const end = getPmScheduleDateAddText(start, entry.totalDays);
        return `<div class="pm-approved-row">
          <div class="pm-approved-person"><strong>${escapePmScheduleHtml(entry.row.displayName || entry.row.name)}</strong><span>${escapePmScheduleHtml(entry.row.grade || "")} · ${escapePmScheduleHtml(entry.row.dept || "")}</span></div>
          <div class="pm-approved-timeline"><div class="pm-approved-bar" style="width:${width}%"><i style="width:${progress}%"></i></div><small>${escapePmScheduleHtml(start)} ~ ${escapePmScheduleHtml(end)} / ${entry.totalDays}일 / 진행 ${progress}%</small></div>
        </div>`;
      }).join("")}
    </div>
  `;
}

function renderPmScheduleStaffView(item) {
  const grid = document.getElementById("pmScheduleEditorGrid");
  if (!grid) return;
  const state = getPmScheduleEditorStatus(item);
  grid.innerHTML = `
    <div class="pm-staff-schedule-card">
      <div><strong>본인 스케쥴</strong><span>배정받은 프로젝트의 승인 일정만 표시됩니다.</span></div>
      <em class="pm-editor-status ${state.className}">${state.label}</em>
    </div>
  `;
}

function submitPmScheduleEditor() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  const now = (item.project.projectName || "").includes("수원아이파크시티") ? "2026.05.11 16:41" : getPmScheduleNowText();
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
  item.approvedPlan = item.selectedProposal;
  item.scheduleStartDate = item.scheduleStartDate || "2026.05.11";
  item.scheduleApprovedAt = item.scheduleApprovedAt || getPmScheduleNowText();
  item.history.unshift(`${item.scheduleApprovedAt} · ${plan?.title || "선택안"}이 승인되어 프로젝트 일정으로 확정되었습니다.`);
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
