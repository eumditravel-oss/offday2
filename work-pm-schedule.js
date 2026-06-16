/* =========================================================
   업무관리 > PM 배정 / 일정
   - 실장 권한: 접수 프로젝트 리스트, PM 지정, 스케쥴 1·2안 검토/승인/반려
   - PM / Leader 권한: 스케쥴 1·2안 편집 및 제출
   - 스케쥴 1·2안은 별도 모달 창에서 가로 비교/편집
========================================================= */

const pmScheduleDeptManagerMap = {
  "마감": "조한빈 실장",
  "구조팀": "장범선 실장",
  "BIM 파트": "장범선 실장",
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
let pmScheduleActiveSection = "assign";

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
  return typeof currentPermissionRoleValue !== "undefined" ? currentPermissionRoleValue : "구조PM";
}

function getPmScheduleRoleProfile(role = getPmScheduleRole()) {
  const text = String(role || "").trim();
  const profile = { raw: text, base: text, domain: "all", category: "", middleDept: "" };

  if (["실장", "팀장"].includes(text)) {
    profile.base = "manager";
    profile.domain = "structure";
    return profile;
  }
  if (text === "구조실장" || text === "구조팀장") {
    profile.base = "manager";
    profile.domain = "structure";
    return profile;
  }
  if (text === "마감실장") {
    profile.base = "manager";
    profile.domain = "finish";
    return profile;
  }
  if (text === "PM") {
    profile.base = "pm";
    profile.domain = "structure";
    profile.category = "Structure";
    return profile;
  }
  if (text === "구조PM") {
    profile.base = "pm";
    profile.domain = "structure";
    profile.category = "Structure";
    return profile;
  }
  if (text === "마감PM") {
    profile.base = "pm";
    profile.domain = "finish";
    profile.category = "Finish";
    return profile;
  }
  if (text === "토목ㆍ조경PM") {
    profile.base = "pm";
    profile.domain = "civil";
    profile.category = "Civil";
    return profile;
  }
  if (text === "Leader" || text.includes("Team Leader")) {
    profile.base = "leader";
    profile.domain = "structure";
    profile.category = "Structure";
    return profile;
  }
  if (text === "Asst.Leader") {
    profile.base = "leader";
    profile.domain = "structure";
    profile.category = "Structure";
    return profile;
  }
  if (text.startsWith("Leader-Finish-")) {
    profile.base = "leader";
    profile.domain = "finish";
    profile.category = "Finish";
    profile.middleDept = text.replace("Leader-Finish-", "");
    return profile;
  }
  if (text.startsWith("Leader-Structure-")) {
    profile.base = "leader";
    profile.domain = "structure";
    profile.category = "Structure";
    profile.middleDept = text.replace("Leader-Structure-", "");
    return profile;
  }
  if (text === "Leader-Civil") {
    profile.base = "leader";
    profile.domain = "civil";
    profile.category = "Civil";
    return profile;
  }
  if (text === "Staff" || ["사원", "수석", "선임", "책임"].includes(text)) {
    profile.base = "staff";
  }
  return profile;
}

function isPmScheduleManagerRole() {
  return getPmScheduleRoleProfile().base === "manager";
}

function isPmScheduleEditorRole() {
  const base = getPmScheduleRoleProfile().base;
  return base === "pm" || base === "leader" || base === "staff";
}

function isPmScheduleStaffRole() {
  return getPmScheduleRoleProfile().base === "staff";
}

function getPmScheduleRoleCategory() {
  return getPmScheduleRoleProfile().category || "Structure";
}

function getPmScheduleRoleMiddleDept() {
  const middle = getPmScheduleRoleProfile().middleDept || "";
  return normalizePmScheduleVietDeptName(middle);
}

function getPmScheduleRoleDomainScopes() {
  const domain = getPmScheduleRoleProfile().domain;
  if (domain === "finish") return ["마감", "인테리어·철거", "비교내역서", "단가작업", "기계/전기", "골조성"];
  if (domain === "civil") return ["토목ㆍ조경파트", "토목", "조경"];
  if (domain === "structure") return ["구조팀", "BIM 파트", "토목ㆍ조경파트", "구조", "BIM", "토목", "조경"];
  return [];
}

function isPmScheduleProjectInRoleDomain(item) {
  const profile = getPmScheduleRoleProfile();
  if (!["manager", "pm", "leader"].includes(profile.base)) return true;
  const scopes = (item?.project?.scopes || []).filter(scope => scope.checked).map(scope => String(scope.label || ""));
  const allowed = getPmScheduleRoleDomainScopes();
  if (!allowed.length || !scopes.length) return true;
  return scopes.some(scope => allowed.some(key => scope.includes(key) || key.includes(scope)));
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
  const fixedMiddle = getPmScheduleRoleMiddleDept();
  if (fixedMiddle && options.map(normalizePmScheduleVietDeptName).includes(fixedMiddle)) return fixedMiddle;
  if (options.includes(pmScheduleModalMiddleDept)) return pmScheduleModalMiddleDept;
  return options[0] || "";
}

function isPmScheduleLeaderRole() {
  return getPmScheduleRoleProfile().base === "leader";
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
  const fixedCategory = getPmScheduleRoleCategory();
  pmScheduleModalCategory = isPmScheduleLeaderRole() || getPmScheduleRoleProfile().base === "pm" ? fixedCategory : (value || "Structure");
  const fixedMiddle = getPmScheduleRoleMiddleDept();
  pmScheduleModalMiddleDept = fixedMiddle || getPmScheduleMiddleDeptOptions(pmScheduleModalCategory)[0] || "";
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
      pmAuthority: [],
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
  // 연계 테스트를 위해 PM 배정 / 일정 초기 더미데이터는 생성하지 않습니다.
  return [];
}

function initPmScheduleProjects() {
  if (pmScheduleProjects.length) {
    pmScheduleProjects.forEach(item => { normalizeExistingPmScheduleRows(item); applyPmScheduleSuwonApprovedDummy(item); });
    return;
  }
  pmScheduleProjects = buildPmScheduleSeedProjects();
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
  const base = pmScheduleActiveSection === "approval"
    ? getPmScheduleApprovalProjects()
    : (pmScheduleFilter === "all" ? pmScheduleProjects : pmScheduleProjects.filter(item => item.status === pmScheduleFilter));
  return base.filter(item => isPmScheduleProjectInRoleDomain(item));
}

function getPmScheduleApprovalProjects() {
  initPmScheduleProjects();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return pmScheduleProjects.filter(item => {
    if (item.status === "submitted") return true;
    if (item.status !== "approved") return false;
    const approvedAt = parsePmScheduleDate(item.scheduleApprovedAt || item.approvedAt || item.receivedAt);
    return approvedAt && approvedAt >= sevenDaysAgo;
  });
}

function parsePmScheduleDate(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  const normalized = text.replace(/\./g, "-").replace(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/, "$1T$2");
  const parsed = new Date(normalized);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return null;
}

function getCurrentPmScheduleProject() {
  initPmScheduleProjects();
  return pmScheduleProjects[pmScheduleSelectedIndex] || pmScheduleProjects[0];
}


function setPmScheduleSection(section = "assign") {
  pmScheduleActiveSection = ["assign", "approval", "all"].includes(section) ? section : "assign";
  const shell = document.getElementById("pmScheduleShell");
  if (shell) shell.dataset.pmSection = pmScheduleActiveSection;

  const pmPanelActive = document.getElementById("pmSchedule")?.classList.contains("active");
  document.querySelectorAll(".pm-schedule-sub-menu").forEach(menu => menu.classList.toggle("active", !!pmPanelActive));
  document.querySelectorAll("[data-pm-section]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.pmSection === pmScheduleActiveSection);
  });

  document.querySelectorAll("[data-pm-section-view]").forEach(el => {
    const views = String(el.dataset.pmSectionView || "").split(/\s+/);
    el.style.display = views.includes(pmScheduleActiveSection) ? "" : "none";
  });

  document.querySelectorAll(".pm-section-assign-only").forEach(el => {
    el.style.display = (pmScheduleActiveSection === "assign" && isPmScheduleManagerRole()) ? "" : "none";
  });

  renderPmScheduleProjectList();
  renderPmScheduleDetail();
  updatePmScheduleListHeader();
  if (pmScheduleActiveSection === "all") renderPmScheduleAllSchedule();
}

function syncPmScheduleHeroButtons() {
  document.querySelectorAll(".pm-manager-only").forEach(el => {
    el.style.display = isPmScheduleManagerRole() ? "" : "none";
  });
  document.querySelectorAll(".pm-section-assign-only").forEach(el => {
    el.style.display = (pmScheduleActiveSection === "assign" && isPmScheduleManagerRole()) ? "" : "none";
  });
  document.querySelectorAll(".pm-section-approval-only").forEach(el => {
    el.style.display = (pmScheduleActiveSection === "approval" && isPmScheduleManagerRole()) ? "" : "none";
  });
}

function updatePmScheduleListHeader() {
  const title = document.getElementById("pmScheduleListTitle");
  const sub = document.getElementById("pmScheduleListSub");
  const filters = document.getElementById("pmScheduleFilterRow");
  if (title) title.textContent = pmScheduleActiveSection === "approval" ? "작업일정 결재 리스트" : "접수 프로젝트 리스트";
  if (sub) sub.textContent = pmScheduleActiveSection === "approval"
    ? "최근 7일 내 일정확정 건과 PM 스케쥴 결재 요청 건"
    : "실장 권한 기준 배정 대기";
  if (filters) filters.style.display = pmScheduleActiveSection === "approval" ? "none" : "flex";
}

function renderPmScheduleDashboard() {
  if (!document.getElementById("pmScheduleShell")) return;
  initPmScheduleProjects();

  const roleMessage = document.getElementById("pmScheduleRoleMessage");
  const managerView = document.getElementById("pmScheduleManagerView");
  const editorView = document.getElementById("pmScheduleEditorView");
  const role = getPmScheduleRole();
  syncPmScheduleHeroButtons();
  injectPmGanttToggleButton();

  if (isPmScheduleManagerRole()) {
    if (roleMessage) roleMessage.style.display = "none";
    if (managerView) managerView.style.display = "grid";
    if (editorView) editorView.style.display = "none";
    renderPmScheduleProjectList();
    renderPmScheduleDetail();
    updatePmScheduleListHeader();
    setPmScheduleSection(pmScheduleActiveSection);
    return;
  }

  if (isPmScheduleEditorRole()) {
    if (roleMessage) roleMessage.style.display = "none";
    if (managerView) managerView.style.display = "none";
    if (editorView) editorView.style.display = "block";
    renderPmScheduleEditorView();
    syncPmScheduleHeroButtons();
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
    list.innerHTML = `<div class="pm-empty-box">${pmScheduleActiveSection === "approval" ? "결재 요청 또는 최근 일정확정 프로젝트가 없습니다." : "해당 조건의 프로젝트가 없습니다."}</div>`;
    return;
  }
  const isApproval = pmScheduleActiveSection === "approval";
  list.innerHTML = `
    <div class="pm-project-list-table ${isApproval ? "approval-list" : ""}">
      <div class="pm-project-list-head">
        <span>상태</span>
        <span>프로젝트명</span>
        <span>${isApproval ? "요청일 / 확정일" : "접수번호 / 의뢰처"}</span>
        <span>${isApproval ? "검토구분" : "작업범위"}</span>
      </div>
      ${filtered.map(item => {
        const realIndex = pmScheduleProjects.indexOf(item);
        const scope = getPmScheduleScopeText(item.project);
        const approvalDate = item.status === "approved" ? (item.scheduleApprovedAt || "확정일 미등록") : (item.proposals?.plan1?.submittedAt || "요청일 미등록");
        const reviewScope = item.status === "approved" ? `${item.approvedPlan === "plan2" ? "2안" : "1안"} 일정확정` : `${item.submittedCategory || "Structure"} 1ㆍ2안 결재 요청`;
        return `
          <button class="pm-project-list-row ${realIndex === pmScheduleSelectedIndex ? "active" : ""}" type="button" onclick="selectPmScheduleProject(${realIndex})">
            <span class="pm-project-state ${item.status}">${getPmScheduleStatusLabel(item.status)}</span>
            <strong>${escapePmScheduleHtml(item.project.projectName || "프로젝트명 미입력")}</strong>
            <em>${isApproval ? escapePmScheduleHtml(approvalDate) : `${escapePmScheduleHtml(item.project.projectNo || "NO 미입력")} · ${escapePmScheduleHtml(item.project.client || "의뢰처 미입력")}`}</em>
            <small>${escapePmScheduleHtml(isApproval ? reviewScope : scope)}</small>
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

function ensurePmAssignmentBackdrop() {
  let backdrop = document.getElementById("pmAssignmentPanelBackdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "pmAssignmentPanelBackdrop";
    backdrop.className = "pm-assignment-panel-backdrop";
    backdrop.addEventListener("click", closePmAssignmentPanel);
    document.body.appendChild(backdrop);
  }
  return backdrop;
}

function openPmAssignmentPanel() {
  if (!isPmScheduleManagerRole()) return;
  pmScheduleActiveSection = "assign";
  renderPmScheduleDetail();
  setPmScheduleSection("assign");
  const detail = document.querySelector("#pmScheduleManagerView .pm-schedule-detail");
  const backdrop = ensurePmAssignmentBackdrop();
  if (detail) detail.classList.add("pm-assignment-panel-open");
  if (backdrop) backdrop.classList.add("active");
}

function closePmAssignmentPanel() {
  const detail = document.querySelector("#pmScheduleManagerView .pm-schedule-detail");
  const backdrop = document.getElementById("pmAssignmentPanelBackdrop");
  if (detail) detail.classList.remove("pm-assignment-panel-open");
  if (backdrop) backdrop.classList.remove("active");
}

function openPmScheduleApprovalRequest() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  if (!["submitted", "approved"].includes(item.status)) {
    showToast("검토할 결재 요청 또는 확정 일정이 없습니다.");
    return;
  }
  pmScheduleModalEditable = false;
  openPmSchedulePlanModal(false);
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
      <div class="pm-simple-timeline" style="grid-column:1 / -1">
        <span class="active">접수</span>
        <span class="${item.status === "pending" ? "active" : ""}">PM 지정</span>
        <span class="${item.status === "requested" ? "active" : ""}">작성요청</span>
        <span class="${["submitted", "approved"].includes(item.status) ? "active" : ""}">검토/확정</span>
      </div>
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
  renderPmScheduleAssignmentWarnings(item);
}

function getPmScheduleRequiredAssignmentGroups(item) {
  const scopes = (item?.project?.scopes || [])
    .filter(scope => scope.checked)
    .map(scope => normalizePmScheduleDept(scope.label));

  const required = {
    finish: scopes.some(scope => scope.includes("마감")),
    structure: scopes.some(scope => scope.includes("구조") || scope.includes("BIM")),
    civil: scopes.some(scope => scope.includes("토목") || scope.includes("조경"))
  };

  return required;
}

function hasAnyPmScheduleAssignment(item) {
  const assignment = item?.assignment || {};
  return Boolean(assignment.pmFinish || assignment.pmStructure || assignment.pmBim || assignment.pmCivil);
}

function getPmScheduleMissingAssignmentKeys(item) {
  const assignment = item?.assignment || {};
  const required = getPmScheduleRequiredAssignmentGroups(item);
  const missing = [];

  if (required.finish && !assignment.pmFinish) missing.push("pmFinish");
  if (required.structure && !assignment.pmStructure && !assignment.pmBim) {
    missing.push("pmStructure", "pmBim");
  }
  if (required.civil && !assignment.pmCivil) missing.push("pmCivil");

  return missing;
}

function setPmScheduleAssignmentWarningState(item, missingKeys) {
  const warningMap = {
    pmFinish: "pmFinishWarning",
    pmStructure: "pmStructureWarning",
    pmBim: "pmBimWarning",
    pmCivil: "pmCivilWarning"
  };

  Object.entries(warningMap).forEach(([key, elementId]) => {
    const warning = document.getElementById(elementId);
    const field = document.getElementById(key + "Field");
    const select = document.getElementById(key + "Select");
    const isMissing = missingKeys.includes(key);

    if (warning) warning.style.display = isMissing ? "block" : "none";
    if (field) field.classList.toggle("pm-assignment-missing", isMissing);
    if (select) select.classList.toggle("pm-assignment-select-missing", isMissing);
  });
}

function renderPmScheduleAssignmentWarnings(item) {
  const missingKeys = hasAnyPmScheduleAssignment(item) ? getPmScheduleMissingAssignmentKeys(item) : [];
  setPmScheduleAssignmentWarningState(item, missingKeys);
}

function confirmPmScheduleAssignment() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;

  const missingKeys = getPmScheduleMissingAssignmentKeys(item);

  if (!hasAnyPmScheduleAssignment(item)) {
    setPmScheduleAssignmentWarningState(item, missingKeys);
    showToast("우선 지정할 PM을 선택해 주세요.");
    return;
  }

  // 일부 부서만 PM 지정된 경우에도 우선 저장한다.
  // 미지정 부서는 경고 문구만 유지하고, 지정된 부서는 경고를 제거한다.
  setPmScheduleAssignmentWarningState(item, missingKeys);

  if (typeof applyPmScheduleAssignmentToProjectReceiveData === "function") {
    applyPmScheduleAssignmentToProjectReceiveData(item.project?.projectNo, item.assignment);
  }

  const assignedLabels = [];
  if (item.assignment.pmFinish) assignedLabels.push("마감팀");
  if (item.assignment.pmStructure || item.assignment.pmBim) assignedLabels.push("구조/BIM");
  if (item.assignment.pmCivil) assignedLabels.push("토목ㆍ조경파트");

  const message = missingKeys.length
    ? `PM 부분 지정 저장 완료: ${assignedLabels.join(" · ")} / 미지정 부서는 추후 지정 필요`
    : "PM 지정 확인이 완료되었습니다.";

  item.history.unshift(message);
  showToast(message);
  renderPmScheduleDetail();
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
  if (typeof applyPmScheduleAssignmentToProjectReceiveData === "function") {
    applyPmScheduleAssignmentToProjectReceiveData(item.project?.projectNo, item.assignment);
  }
  renderPmScheduleAssignmentWarnings(item);
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
      ? ["Internal 1", "Internal 2", "Internal 3", "External", "Partition&Opening"]
      : ["Civil"];

  const ordered = categoryOrder
    .filter(dept => map.has(dept) && !used.has(dept) && used.add(dept))
    .map(dept => ({ dept, members: map.get(dept) }));

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


function getPmSchedulePmAuthorityTargets(item) {
  if (!item) return [];
  if (!item.requestTargets) item.requestTargets = { pm: [], pmAuthority: [], teamLeaders: [] };
  if (!Array.isArray(item.requestTargets.pm)) item.requestTargets.pm = [];
  item.requestTargets.pmAuthority = item.requestTargets.pm.map(value => ({
    displayName: value,
    permissionRole: "PM",
    requestedAt: item.pmAuthorityRequestedAt || "미전송"
  }));
  return item.requestTargets.pmAuthority;
}

function syncPmSchedulePmAuthorityTargets(item) {
  if (!item) return [];
  const targets = getPmSchedulePmAuthorityTargets(item);
  item.pmAuthorityTargets = targets;
  return targets;
}

function getPmSchedulePmAuthorityText(item) {
  const targets = syncPmSchedulePmAuthorityTargets(item);
  return targets.length
    ? targets.map(target => `${target.displayName} · PM 권한`).join(" / ")
    : "PM 권한 수신자 없음";
}

function togglePmScheduleRequestTarget(group, value, checked) {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  if (!item.requestTargets) item.requestTargets = { pm: [], pmAuthority: [], teamLeaders: [] };
  const list = item.requestTargets[group] || [];
  if (checked && !list.includes(value)) list.push(value);
  if (!checked) item.requestTargets[group] = list.filter(name => name !== value);

  // 한국 PM 요청에서 선택된 인원은 실제 직급과 무관하게 해당 프로젝트의 PM 권한 수신자로 처리한다.
  // 즉, 수석/책임/선임/팀장 등 어떤 직급을 선택해도 권한 화면에서는 PM 작성요청 대상으로 표시된다.
  if (group === "pm") syncPmSchedulePmAuthorityTargets(item);
}

function requestPmScheduleDrafts() {
  const item = getCurrentPmScheduleProject();
  if (!item) return;
  item.requestMemo = document.getElementById("pmScheduleRequestMemo")?.value || "";
  item.pmAuthorityRequestedAt = getPmScheduleNowText();
  syncPmSchedulePmAuthorityTargets(item);
  const totalTargets = [...item.requestTargets.pm, ...item.requestTargets.teamLeaders];
  if (!totalTargets.length) {
    showToast("스케쥴 작성 요청 대상을 먼저 선택하세요.");
    return;
  }
  item.status = "requested";
  const pmAuthorityText = item.requestTargets.pm.length ? ` / 한국 PM 권한 수신자: ${getPmSchedulePmAuthorityText(item)}` : "";
  item.history.unshift(`${totalTargets.join(", ")}에게 스케쥴 1·2안 작성 요청 알림을 보냈습니다.${pmAuthorityText}`);
  closePmAssignmentPanel();
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
  if (body) body.innerHTML = `${!pmScheduleModalEditable ? renderPmScheduleModalTimeline(item) : ""}${renderPmScheduleCombinedSheet(item, pmScheduleModalEditable)}`;
  if (foot) {
    foot.innerHTML = pmScheduleModalEditable
      ? `<button class="btn btn-line" type="button" onclick="closePmSchedulePlanModal()">닫기</button><button class="btn btn-primary" type="button" onclick="submitPmScheduleEditor()">스케쥴 작성 완료</button>`
      : renderPmScheduleApprovalControls(item);
  }
}

function renderPmScheduleModalTimeline(item) {
  const selectedPlan = item.approvedPlan || item.selectedProposal || "plan1";
  const rows = [
    ["접수", item.receivedAt || "접수일 미등록"],
    ["PM 지정", hasAnyPmScheduleAssignment(item) ? "PM 지정 저장" : "PM 미지정"],
    ["작성요청", item.pmAuthorityRequestedAt || (item.status === "requested" ? "요청 완료" : "요청 전")],
    ["결재요청", item.proposals?.plan1?.submittedAt || "미제출"],
    ["검토/확정", item.status === "approved" ? `${selectedPlan === "plan2" ? "2안" : "1안"} 확정 · ${item.scheduleApprovedAt || "확정일 미등록"}` : "검토 대기"]
  ];
  return `
    <div class="pm-modal-timeline-panel">
      <div class="pm-modal-timeline-head">
        <strong>프로젝트 타임라인</strong>
        <span>${escapePmScheduleHtml(item.project?.projectName || "프로젝트명 미입력")}</span>
      </div>
      <div class="pm-modal-timeline-list">
        ${rows.map(([label, value], index) => `<div class="pm-modal-timeline-step ${index === 0 || value !== "요청 전" && value !== "미제출" ? "active" : ""}"><b>${escapePmScheduleHtml(label)}</b><span>${escapePmScheduleHtml(value)}</span></div>`).join("")}
      </div>
    </div>
  `;
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
      ${getPmScheduleRole() === "PM" ? `<div><span>PM 작성요청</span><strong>${escapePmScheduleHtml(getPmSchedulePmAuthorityText(item))}</strong></div>` : ""}
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
  const role = getPmScheduleRole();
  const indexedProjects = pmScheduleProjects.map((item, index) => ({ item, index }));
  const visibleProjects = role === "PM"
    ? indexedProjects.filter(({ item }) => {
        syncPmSchedulePmAuthorityTargets(item);
        return (item.requestTargets?.pm || []).length || item.assignment?.pmFinish || item.assignment?.pmStructure || item.assignment?.pmBim || item.assignment?.pmCivil;
      })
    : indexedProjects;

  if (!visibleProjects.length) {
    body.innerHTML = `<div class="pm-empty-box">현재 권한에서 수신된 작성요청 프로젝트가 없습니다.</div>`;
    return;
  }

  body.innerHTML = `<div class="pm-assigned-project-list">${visibleProjects.map(({ item, index }) => {
    const state = getPmScheduleEditorStatus(item);
    const canWrite = item.status !== "approved" && item.status !== "submitted";
    const pmAuthorityLine = role === "PM" && (item.requestTargets?.pm || []).length
      ? `<small>PM 권한 수신: ${escapePmScheduleHtml(getPmSchedulePmAuthorityText(item))}</small>`
      : "";
    return `<button class="pm-assigned-project-item" type="button" onclick="selectPmAssignedProject(${index})">
      <strong>${escapePmScheduleHtml(item.project.projectName || "프로젝트명 미입력")}</strong>
      <span>${escapePmScheduleHtml(item.project.projectNo || "-")} · ${escapePmScheduleHtml(getPmScheduleScopeText(item.project))}</span>
      ${pmAuthorityLine}
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


function getPmScheduleAllScheduleMonths() {
  return ["2026.01", "2026.02", "2026.03", "2026.04", "2026.05", "2026.06", "2026.07", "2026.08", "2026.09", "2026.10", "2026.11", "2026.12"];
}

function getPmScheduleAllTeamCategory() {
  const value = document.getElementById("pmScheduleAllTeamFilter")?.value || "Finish";
  if (value === "Structure") return "Structure";
  if (value === "Civil") return "Civil";
  return "Finish";
}

function getPmScheduleProjectMonthKey(item) {
  const raw = String(item?.project?.firstDelivery || item?.project?.startDate || item?.scheduleStartDate || "").trim();
  const match = raw.match(/(20\d{2})[.\/-]?(\d{1,2})/);
  if (!match) return "미정";
  return `${match[1]}.${String(match[2]).padStart(2, "0")}`;
}

function getPmScheduleAllScheduleItemsForEmployee(emp, category) {
  initPmScheduleProjects();
  const items = [];
  pmScheduleProjects.forEach(project => {
    const planId = project.approvedPlan || project.selectedProposal || "plan1";
    const proposal = project.proposals?.[planId] || project.proposals?.plan1;
    const rows = proposal?.rows || [];
    const row = rows.find(r => r.empNo === emp.empNo && getPmScheduleCategoryForDept(r.dept) === category);
    if (!row) return;
    const planData = planId === "plan2" ? row.plan2 : row.plan1;
    const isAssigned = Boolean(planData?.rc || planData?.sc || Number(planData?.people || 0) > 0 || Number(planData?.totalDays || 0) > 0);
    if (!isAssigned) return;
    items.push({
      month: getPmScheduleProjectMonthKey(project),
      projectNo: project.project?.projectNo || "-",
      projectName: project.project?.projectName || "프로젝트명 미입력",
      days: planData?.totalDays || planData?.workDays || "",
      status: getPmScheduleStatusLabel(project.status)
    });
  });
  return items;
}

function renderPmScheduleAllSchedule() {
  const board = document.getElementById("pmScheduleAllScheduleBoard");
  if (!board) return;
  const category = getPmScheduleAllTeamCategory();
  const employees = getPmScheduleVietEmployeesByCategory(category).filter(emp => String(emp.grade || "").includes("Team Leader") || String(emp.grade || "").includes("Staff") || String(emp.grade || "").includes("Asst."));
  const months = getPmScheduleAllScheduleMonths();

  if (!employees.length) {
    board.innerHTML = `<div class="pm-empty-box">선택한 팀 구분에 표시할 직원 인사카드가 없습니다.</div>`;
    return;
  }

  const employeeRows = employees.map(emp => {
    const items = getPmScheduleAllScheduleItemsForEmployee(emp, category);
    const totalDays = items.reduce((sum, item) => sum + Number(item.days || 0), 0);
    const activeMonths = new Set(items.map(item => item.month)).size;
    return { emp, items, totalDays, activeMonths };
  });
  const assignedEmployees = employeeRows.filter(row => row.items.length).length;
  const projectCount = new Set(employeeRows.flatMap(row => row.items.map(item => item.projectNo || item.projectName))).size;
  const busiest = employeeRows.reduce((max, row) => Math.max(max, row.totalDays), 1);

  board.innerHTML = `
    <div class="pm-all-resource-board">
      <div class="pm-all-resource-summary">
        <div><strong>${escapePmScheduleHtml(category)}</strong><span>선택 팀</span></div>
        <div><strong>${employees.length}</strong><span>인사카드</span></div>
        <div><strong>${assignedEmployees}</strong><span>배정 인원</span></div>
        <div><strong>${projectCount}</strong><span>프로젝트</span></div>
      </div>
      <div class="pm-all-month-legend">
        <span>직원</span>
        <div>${months.map(month => `<b>${escapePmScheduleHtml(month.replace("2026.", ""))}</b>`).join("")}</div>
      </div>
      <div class="pm-all-resource-list">
        ${employeeRows.map(row => {
          const emp = row.emp;
          const percent = Math.min(100, Math.round((row.totalDays / busiest) * 100));
          return `<article class="pm-all-resource-row">
            <div class="pm-all-person-profile">
              <strong>${escapePmScheduleHtml(emp.name || "-")}</strong>
              <span>${escapePmScheduleHtml(emp.koreanName || emp.grade || "")}</span>
              <em>${escapePmScheduleHtml(normalizePmScheduleVietDeptName(emp.dept))}</em>
            </div>
            <div class="pm-all-load-cell">
              <div class="pm-all-load-bar"><i style="width:${percent}%"></i></div>
              <span>${row.totalDays || 0}일 · ${row.activeMonths || 0}개월</span>
            </div>
            <div class="pm-all-month-rail">
              ${months.map(month => {
                const monthItems = row.items.filter(item => item.month === month);
                return `<div class="pm-all-month-cell ${monthItems.length ? "filled" : ""}">
                  ${monthItems.map(item => `<button type="button" class="pm-all-schedule-chip" title="${escapePmScheduleHtml(item.projectName)}">
                    <b>${escapePmScheduleHtml(item.projectNo)}</b>
                    <span>${escapePmScheduleHtml(item.projectName)}</span>
                    ${item.days ? `<em>${escapePmScheduleHtml(item.days)}일</em>` : ""}
                  </button>`).join("")}
                </div>`;
              }).join("")}
            </div>
          </article>`;
        }).join("")}
      </div>
    </div>`;
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

/* =========================================================
   2026-05-28 PM배정/일정 = 프로젝트 리스트 1:1 미러링 패치
   - 프로젝트 리스트에 없는 프로젝트는 PM배정/일정에 표시하지 않음
   - 프로젝트 접수/리스트 저장값을 기준으로 upsert
   - PM배정 입력값은 프로젝트 리스트/DB관리로 역반영
   ========================================================= */
function pmScheduleLinkKeyFromData(data = {}) {
  if (typeof projectReceiveLinkKey === "function") return projectReceiveLinkKey(data);
  const no = String(data.projectNo || data.pjNo || "").trim();
  if (no) return `NO:${no}`;
  return `NAME:${String(data.projectName || "").trim()}::${String(data.client || "").trim()}`;
}
function pmScheduleCanonicalReceiveItems() {
  if (typeof projectReceiveGetCanonicalListItems === "function") return projectReceiveGetCanonicalListItems();
  if (typeof getProjectReceiveListItems === "function") return getProjectReceiveListItems();
  return [];
}
buildPmScheduleSeedProjects = function buildPmScheduleSeedProjectsFromProjectList() {
  return pmScheduleCanonicalReceiveItems().map(item => makePmScheduleProject(item.data || item, item.sourceFile || "프로젝트 리스트 연계", "pending"));
};
initPmScheduleProjects = function initPmScheduleProjectsFromProjectList() {
  const items = pmScheduleCanonicalReceiveItems();
  const validKeys = new Set(items.map(item => pmScheduleLinkKeyFromData(item.data || item)));
  const existingMap = new Map((pmScheduleProjects || []).map(item => [pmScheduleLinkKeyFromData(item.project || {}), item]));
  const next = [];
  items.forEach(item => {
    const data = item.data || item;
    const key = pmScheduleLinkKeyFromData(data);
    const old = existingMap.get(key);
    const project = old || makePmScheduleProject(data, item.sourceFile || "프로젝트 리스트 연계", "pending");
    project.project = clonePmScheduleData({ ...(project.project || {}), ...data });
    project.id = project.id || `${data.projectNo || "PROJECT"}-${Date.now()}`;
    project.source = item.sourceFile || project.source || "프로젝트 리스트 연계";
    project.assignment = {
      pmFinish: project.assignment?.pmFinish || data.pmFinish || "",
      pmStructure: project.assignment?.pmStructure || data.pmStructure || "",
      pmBim: project.assignment?.pmBim || data.pmBim || "",
      pmCivil: project.assignment?.pmCivil || data.pmCivil || ""
    };
    normalizeExistingPmScheduleRows(project);
    applyPmScheduleSuwonApprovedDummy(project);
    next.push(project);
  });
  pmScheduleProjects = next.filter(item => validKeys.has(pmScheduleLinkKeyFromData(item.project || {})));
};
registerPmScheduleProjectFromReceive = function registerPmScheduleProjectFromReceiveUpsert(data) {
  initPmScheduleProjects();
  const key = pmScheduleLinkKeyFromData(data);
  let idx = pmScheduleProjects.findIndex(item => pmScheduleLinkKeyFromData(item.project || {}) === key);
  if (idx < 0) {
    pmScheduleProjects.unshift(makePmScheduleProject(data, "프로젝트 접수 저장", "pending"));
    idx = 0;
  } else {
    pmScheduleProjects[idx].project = clonePmScheduleData({ ...(pmScheduleProjects[idx].project || {}), ...data });
  }
  pmScheduleSelectedIndex = idx;
  renderPmScheduleDashboard();
};
window.registerPmScheduleProjectFromReceive = registerPmScheduleProjectFromReceive;
window.initPmScheduleProjects = initPmScheduleProjects;

/* =========================================================
   2026-05-28 PM 배정 최신값/공란 저장 보정
   - 프로젝트 리스트 completed 데이터만 PM배정/일정에 1:1 표시
   - receiveId 기준으로 PJ NO 변경 전/후 연결 유지
   - PM배정 화면에서 공란으로 삭제한 값도 최신값으로 인정
   ========================================================= */
(function installPmScheduleStableMirrorPatch(){
  function txt(v){ return String(v ?? '').replace(/\s+/g, ' ').trim(); }
  function keyFromData(data = {}){
    if (typeof projectReceiveLinkKey === 'function') return projectReceiveLinkKey(data);
    const receiveId = txt(data.receiveId || data.internalReceiveId || data.linkedReceiveId);
    if (receiveId) return `RCV:${receiveId}`;
    const no = txt(data.projectNo || data.pjNo);
    if (no) return `NO:${no}`;
    return `LEGACY:${txt(data.projectName)}::${txt(data.client)}`;
  }
  pmScheduleLinkKeyFromData = keyFromData;
  window.pmScheduleLinkKeyFromData = pmScheduleLinkKeyFromData;
  pmScheduleCanonicalReceiveItems = function pmScheduleCanonicalReceiveItemsCompletedOnly(){
    if (typeof projectReceiveGetCanonicalListItems === 'function') return projectReceiveGetCanonicalListItems();
    if (typeof getProjectReceiveListItems === 'function') return getProjectReceiveListItems().filter(item => item.source === 'completed' || item.status === '작성완료');
    return [];
  };
  window.pmScheduleCanonicalReceiveItems = pmScheduleCanonicalReceiveItems;
  initPmScheduleProjects = function initPmScheduleProjectsStableMirror(){
    const items = pmScheduleCanonicalReceiveItems();
    const validKeys = new Set(items.map(item => keyFromData(item.data || item)));
    const existingMap = new Map((pmScheduleProjects || []).map(item => [keyFromData(item.project || {}), item]));
    const next = [];
    items.forEach(item => {
      const data = item.data || item;
      const key = keyFromData(data);
      const old = existingMap.get(key);
      const project = old || makePmScheduleProject(data, item.sourceFile || '프로젝트 리스트 연계', 'pending');
      const touched = project.assignmentTouched || {};
      project.project = clonePmScheduleData({ ...(project.project || {}), ...data, receiveId: data.receiveId || data.internalReceiveId || project.project?.receiveId });
      project.id = project.id || `${data.projectNo || data.receiveId || 'PROJECT'}-${Date.now()}`;
      project.source = item.sourceFile || project.source || '프로젝트 리스트 연계';
      project.assignmentTouched = touched;
      project.assignment = {
        pmFinish: touched.pmFinish ? (project.assignment?.pmFinish ?? '') : (project.assignment?.pmFinish ?? data.pmFinish ?? ''),
        pmStructure: touched.pmStructure ? (project.assignment?.pmStructure ?? '') : (project.assignment?.pmStructure ?? data.pmStructure ?? ''),
        pmBim: touched.pmBim ? (project.assignment?.pmBim ?? '') : (project.assignment?.pmBim ?? data.pmBim ?? ''),
        pmCivil: touched.pmCivil ? (project.assignment?.pmCivil ?? '') : (project.assignment?.pmCivil ?? data.pmCivil ?? '')
      };
      normalizeExistingPmScheduleRows(project);
      applyPmScheduleSuwonApprovedDummy(project);
      next.push(project);
    });
    pmScheduleProjects = next.filter(item => validKeys.has(keyFromData(item.project || {})));
  };
  window.initPmScheduleProjects = initPmScheduleProjects;
  registerPmScheduleProjectFromReceive = function registerPmScheduleProjectFromReceiveStable(data){
    initPmScheduleProjects();
    const key = keyFromData(data);
    let idx = pmScheduleProjects.findIndex(item => keyFromData(item.project || {}) === key);
    if (idx < 0) {
      const project = makePmScheduleProject(data, '프로젝트 접수 저장', 'pending');
      project.project.receiveId = data.receiveId || data.internalReceiveId || project.project.receiveId;
      project.assignmentTouched = {};
      pmScheduleProjects.unshift(project);
      idx = 0;
    } else {
      pmScheduleProjects[idx].project = clonePmScheduleData({ ...(pmScheduleProjects[idx].project || {}), ...data });
    }
    pmScheduleSelectedIndex = idx;
    renderPmScheduleDashboard?.();
  };
  window.registerPmScheduleProjectFromReceive = registerPmScheduleProjectFromReceive;
  updatePmScheduleAssignment = function updatePmScheduleAssignmentStable(key, value){
    const item = getCurrentPmScheduleProject();
    if (!item) return;
    item.assignment = item.assignment || {};
    item.assignmentTouched = item.assignmentTouched || {};
    item.assignment[key] = value ?? '';
    item.assignmentTouched[key] = true;
    if (typeof applyPmScheduleAssignmentToProjectReceiveData === 'function') {
      applyPmScheduleAssignmentToProjectReceiveData(item.project?.receiveId || item.project?.projectNo, item.assignment);
    }
    renderPmScheduleAssignmentWarnings(item);
    renderPmScheduleRequestTargets(item);
  };
  window.updatePmScheduleAssignment = updatePmScheduleAssignment;

// ─── 월간 스케줄표 (Gantt Calendar) ────────────────────────────────────────
let pmGanttYear = new Date().getFullYear();
let pmGanttMonth = new Date().getMonth() + 1;

function injectPmGanttToggleButton() {
  const shell = document.getElementById('pmScheduleShell');
  if (!shell || document.getElementById('pmGanttToggleBtn')) return;
  const wrapper = document.createElement('div');
  wrapper.id = 'pmGanttWrapper';
  wrapper.className = 'pm-gantt-wrapper';
  wrapper.innerHTML = `
    <div class="pm-gantt-toolbar">
      <button id="pmGanttToggleBtn" class="pm-gantt-toggle-btn" onclick="togglePmGanttView()">
        <span>월간 스케줄표</span>
      </button>
      <div class="pm-gantt-month-controls">
        <button id="pmGanttPrevBtn" class="pm-gantt-nav-btn" onclick="pmGanttNav(-1)" hidden>‹</button>
        <span id="pmGanttMonthLabel" hidden></span>
        <button id="pmGanttNextBtn" class="pm-gantt-nav-btn" onclick="pmGanttNav(1)" hidden>›</button>
      </div>
      <div class="pm-gantt-toolbar-note">팀별 인력 배정과 프로젝트 기간을 월 단위로 확인합니다.</div>
    </div>
    <div id="pmGanttView" class="pm-gantt-view" hidden></div>
  `;
  shell.prepend(wrapper);
  injectPmGanttCss();
}

function togglePmGanttView() {
  const view = document.getElementById('pmGanttView');
  const label = document.getElementById('pmGanttMonthLabel');
  const prev = document.getElementById('pmGanttPrevBtn');
  const next = document.getElementById('pmGanttNextBtn');
  const toggle = document.getElementById('pmGanttToggleBtn');
  if (!view) return;
  const showing = !view.hidden;
  view.hidden = showing;
  view.classList.toggle('open', !showing);
  if (label) label.hidden = showing;
  if (prev) prev.hidden = showing;
  if (next) next.hidden = showing;
  if (toggle) toggle.classList.toggle('active', !showing);
  if (!showing) renderPmGanttCalendar(pmGanttYear, pmGanttMonth);
}

function pmGanttNav(delta) {
  pmGanttMonth += delta;
  if (pmGanttMonth > 12) { pmGanttMonth = 1; pmGanttYear++; }
  if (pmGanttMonth < 1) { pmGanttMonth = 12; pmGanttYear--; }
  renderPmGanttCalendar(pmGanttYear, pmGanttMonth);
}

function getPmGanttDateWindow(year, month) {
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 0),
    days: new Date(year, month, 0).getDate()
  };
}

function getPmGanttClampedDay(date, monthStart, monthEnd) {
  if (!date || !Number.isFinite(date.getTime())) return null;
  if (date < monthStart) return 1;
  if (date > monthEnd) return monthEnd.getDate();
  return date.getDate();
}

function getPmGanttAssignments(year, month, colors) {
  const { start: monthStart, end: monthEnd } = getPmGanttDateWindow(year, month);
  const byEmployee = {};
  const legend = [];

  (pmScheduleProjects || []).forEach((item, idx) => {
    const project = item?.project || {};
    const projectNo = project.projectNo || '';
    const projectName = project.projectName || projectNo || `프로젝트 ${idx + 1}`;
    const color = colors[idx % colors.length];
    const startRaw = String(project.startDate || project.firstDelivery || '').trim();
    const endRaw = String(project.firstDelivery || project.startDate || '').trim();
    let startDate = parsePmScheduleDate(startRaw);
    let endDate = parsePmScheduleDate(endRaw);

    if (!startDate && !endDate) {
      startDate = new Date(monthStart);
      endDate = new Date(monthEnd);
    } else if (!startDate) {
      startDate = new Date(endDate);
    } else if (!endDate) {
      endDate = new Date(startDate);
    }
    if (endDate < startDate) [startDate, endDate] = [endDate, startDate];
    if (endDate < monthStart || startDate > monthEnd) return;

    const startDay = getPmGanttClampedDay(startDate, monthStart, monthEnd);
    const endDay = getPmGanttClampedDay(endDate, monthStart, monthEnd);
    if (!startDay || !endDay) return;

    const selectedPlan = item.approvedPlan || item.selectedProposal || 'plan1';
    const rows = item?.proposals?.[selectedPlan]?.rows || [];
    let hasVisibleAssignment = false;
    rows.forEach(row => {
      const planData = selectedPlan === 'plan2' ? row.plan2 : row.plan1;
      const assigned = Boolean(
        row.rc ||
        row.sc ||
        Number(planData?.people || 0) > 0 ||
        Number(planData?.totalDays || planData?.workDays || 0) > 0
      );
      if (!assigned || !row.empNo) return;
      hasVisibleAssignment = true;
      if (!byEmployee[row.empNo]) byEmployee[row.empNo] = [];
      byEmployee[row.empNo].push({
        startDay,
        endDay,
        projectNo,
        projectName,
        scope: row.scope || row.dept || '',
        color
      });
    });
    if (hasVisibleAssignment) legend.push({ projectNo, projectName, color });
  });

  return { byEmployee, legend };
}

function layoutPmGanttAssignmentBars(assignments) {
  const lanes = [];
  return [...assignments]
    .sort((a, b) => a.startDay - b.startDay || a.endDay - b.endDay)
    .map(assignment => {
      let lane = lanes.findIndex(lastEnd => assignment.startDay > lastEnd);
      if (lane === -1) {
        lane = lanes.length;
        lanes.push(assignment.endDay);
      } else {
        lanes[lane] = assignment.endDay;
      }
      return { ...assignment, lane };
    });
}

function renderPmGanttDayHeader(year, month, daysInMonth) {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const now = new Date();
  const isThisMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dow = new Date(year, month - 1, day).getDay();
    const classes = [
      'pm-gantt-day-head',
      dow === 0 || dow === 6 ? 'weekend' : '',
      isThisMonth && now.getDate() === day ? 'today' : ''
    ].filter(Boolean).join(' ');
    return `<div class="${classes}"><b>${day}</b><span>${dayNames[dow]}</span></div>`;
  }).join('');
}

function renderPmGanttDayCells(year, month, daysInMonth) {
  const now = new Date();
  const isThisMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dow = new Date(year, month - 1, day).getDay();
    const classes = [
      'pm-gantt-day-cell',
      dow === 0 || dow === 6 ? 'weekend' : '',
      isThisMonth && now.getDate() === day ? 'today' : ''
    ].filter(Boolean).join(' ');
    return `<span class="${classes}"></span>`;
  }).join('');
}

function renderPmGanttCalendar(year, month) {
  const view = document.getElementById('pmGanttView');
  const label = document.getElementById('pmGanttMonthLabel');
  if (!view) return;
  const { days: daysInMonth } = getPmGanttDateWindow(year, month);
  if (label) label.textContent = `${year}년 ${month}월`;

  const colors = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#ea580c', '#65a30d', '#db2777'];
  const allStaff = typeof getPmScheduleVietEmployees === 'function' ? getPmScheduleVietEmployees() : [];
  if (!allStaff.length) {
    view.innerHTML = '<div class="pm-gantt-empty">배정된 직원 데이터가 없습니다.<br><small>프로젝트 배정 후 스케줄표가 생성됩니다.</small></div>';
    return;
  }

  const { byEmployee, legend } = getPmGanttAssignments(year, month, colors);
  const deptGroups = {};
  allStaff.forEach(emp => {
    const dept = (typeof normalizePmScheduleVietDeptName === 'function'
      ? normalizePmScheduleVietDeptName(emp.dept)
      : (emp.dept || '기타'));
    if (!deptGroups[dept]) deptGroups[dept] = [];
    deptGroups[dept].push(emp);
  });

  const dayHeader = renderPmGanttDayHeader(year, month, daysInMonth);
  const dayCells = renderPmGanttDayCells(year, month, daysInMonth);
  const assignedEmployeeCount = allStaff.filter(emp => (byEmployee[emp.empNo] || []).length).length;

  const body = Object.entries(deptGroups).map(([dept, employees]) => {
    const deptAssigned = employees.filter(emp => (byEmployee[emp.empNo] || []).length).length;
    const rows = employees.map(emp => {
      const name = emp.combinedName || emp.name || emp.koreanName || '-';
      const grade = emp.grade || '-';
      const assignments = layoutPmGanttAssignmentBars(byEmployee[emp.empNo] || []);
      const laneCount = Math.max(1, ...assignments.map(item => item.lane + 1));
      const bars = assignments.map(item => {
        const title = [item.projectNo, item.projectName, item.scope].filter(Boolean).join(' · ');
        return `<div class="pm-gantt-bar" style="--pm-color:${item.color};--pm-lane:${item.lane};grid-column:${item.startDay} / ${item.endDay + 1};" title="${escapePmScheduleHtml(title)}">
          <strong>${escapePmScheduleHtml(item.projectNo || item.projectName)}</strong>
          <span>${escapePmScheduleHtml(item.scope || item.projectName)}</span>
        </div>`;
      }).join('');
      return `<div class="pm-gantt-row" style="--pm-gantt-lanes:${laneCount};--pm-days:${daysInMonth};">
        <div class="pm-gantt-person">
          <strong>${escapePmScheduleHtml(name)}</strong>
          <span>${escapePmScheduleHtml(grade)}</span>
        </div>
        <div class="pm-gantt-timeline">
          ${dayCells}
          ${bars || '<em class="pm-gantt-no-plan">배정 없음</em>'}
        </div>
      </div>`;
    }).join('');
    return `<section class="pm-gantt-team">
      <div class="pm-gantt-team-head">
        <strong>${escapePmScheduleHtml(dept)}</strong>
        <span>${employees.length}명 · 배정 ${deptAssigned}명</span>
      </div>
      ${rows}
    </section>`;
  }).join('');

  const legendHtml = legend.length
    ? `<div class="pm-gantt-legend">${legend.map(item => `<span class="pm-gantt-legend-item" style="--pm-color:${item.color};"><i></i>${escapePmScheduleHtml(item.projectNo || item.projectName)}</span>`).join('')}</div>`
    : '<div class="pm-gantt-legend muted">해당 월에 표시할 배정 프로젝트가 없습니다.</div>';

  view.innerHTML = `
    <div class="pm-gantt-panel" style="--pm-days:${daysInMonth};">
      <div class="pm-gantt-summary">
        <span><b>${Object.keys(deptGroups).length}</b>팀</span>
        <span><b>${allStaff.length}</b>명</span>
        <span><b>${assignedEmployeeCount}</b>명 배정</span>
        <span><b>${legend.length}</b>개 프로젝트</span>
      </div>
      <div class="pm-gantt-scroll">
        <div class="pm-gantt-head" style="--pm-days:${daysInMonth};">
          <div class="pm-gantt-person-head">직원</div>
          <div class="pm-gantt-days">${dayHeader}</div>
        </div>
        ${body}
      </div>
      ${legendHtml}
    </div>`;
}

function injectPmGanttCss() {
  if (document.getElementById('pmGanttCss')) return;
  const style = document.createElement('style');
  style.id = 'pmGanttCss';
  style.textContent = `
    .pm-gantt-wrapper {
      padding: 0 16px 12px;
    }
    .pm-gantt-toolbar {
      display: grid;
      grid-template-columns: auto auto minmax(220px, 1fr);
      align-items: center;
      gap: 10px;
      padding: 10px 0 8px;
    }
    .pm-gantt-toggle-btn,
    .pm-gantt-nav-btn {
      border: 1px solid #dbe4ef;
      background: #fff;
      color: #0f172a;
      box-shadow: 0 6px 18px rgba(15, 23, 42, .06);
      cursor: pointer;
      font-weight: 900;
    }
    .pm-gantt-toggle-btn {
      min-height: 34px;
      border-radius: 9px;
      padding: 0 14px;
    }
    .pm-gantt-toggle-btn.active {
      background: #0f172a;
      border-color: #0f172a;
      color: #fff;
    }
    .pm-gantt-month-controls {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .pm-gantt-month-controls span {
      min-width: 92px;
      color: #475569;
      font-size: 13px;
      font-weight: 900;
      text-align: center;
    }
    .pm-gantt-nav-btn {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      font-size: 18px;
      line-height: 1;
    }
    .pm-gantt-toolbar-note {
      justify-self: end;
      color: #64748b;
      font-size: 12px;
      font-weight: 800;
    }
    .pm-gantt-view {
      margin-top: 2px;
    }
    .pm-gantt-panel {
      border: 1px solid #dbe4ef;
      border-radius: 14px;
      background: #fff;
      box-shadow: 0 12px 30px rgba(15, 23, 42, .08);
      overflow: hidden;
    }
    .pm-gantt-summary {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 11px 12px;
      border-bottom: 1px solid #e5edf6;
      background: #f8fafc;
    }
    .pm-gantt-summary span,
    .pm-gantt-legend-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      border: 1px solid #dbe4ef;
      border-radius: 999px;
      background: #fff;
      color: #475569;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 900;
    }
    .pm-gantt-summary b {
      color: #0f172a;
    }
    .pm-gantt-scroll {
      max-height: 660px;
      overflow: auto;
      background: #f8fafc;
    }
    .pm-gantt-head,
    .pm-gantt-row {
      display: grid;
      grid-template-columns: 240px max-content;
      min-width: max-content;
    }
    .pm-gantt-head {
      position: sticky;
      top: 0;
      z-index: 8;
      background: #fff;
      border-bottom: 1px solid #dbe4ef;
    }
    .pm-gantt-person-head,
    .pm-gantt-person {
      position: sticky;
      left: 0;
      z-index: 4;
      border-right: 1px solid #dbe4ef;
      background: #fff;
    }
    .pm-gantt-person-head {
      display: flex;
      align-items: center;
      padding: 0 16px;
      color: #0f172a;
      font-size: 12px;
      font-weight: 900;
    }
    .pm-gantt-days,
    .pm-gantt-timeline {
      display: grid;
      grid-template-columns: repeat(var(--pm-days), 36px);
      min-width: calc(var(--pm-days) * 36px);
    }
    .pm-gantt-day-head {
      min-height: 48px;
      border-right: 1px solid #e5edf6;
      display: grid;
      place-items: center;
      align-content: center;
      gap: 2px;
      background: #fff;
      color: #334155;
      font-size: 11px;
      font-weight: 900;
    }
    .pm-gantt-day-head b {
      font-size: 13px;
      line-height: 1;
    }
    .pm-gantt-day-head span {
      color: #64748b;
      font-size: 10px;
    }
    .pm-gantt-day-head.weekend,
    .pm-gantt-day-cell.weekend {
      background: #eef4fb;
      color: #1d4ed8;
    }
    .pm-gantt-day-head.today {
      background: #fff7ed;
      color: #c2410c;
      box-shadow: inset 0 -3px 0 #f97316;
    }
    .pm-gantt-team-head {
      position: sticky;
      left: 0;
      z-index: 5;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      border-top: 1px solid #dbe4ef;
      border-bottom: 1px solid #dbe4ef;
      background: #e9f0f8;
      color: #0f172a;
      font-size: 12px;
      font-weight: 900;
    }
    .pm-gantt-team-head span {
      color: #64748b;
      font-size: 11px;
    }
    .pm-gantt-person {
      display: grid;
      align-content: center;
      gap: 3px;
      min-height: calc(52px + (var(--pm-gantt-lanes) - 1) * 28px);
      padding: 10px 14px;
      background: #fbfdff;
    }
    .pm-gantt-person strong {
      color: #0f172a;
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
    }
    .pm-gantt-person span {
      color: #64748b;
      font-size: 11px;
      font-weight: 800;
    }
    .pm-gantt-timeline {
      position: relative;
      min-height: calc(52px + (var(--pm-gantt-lanes) - 1) * 28px);
      background: #fff;
    }
    .pm-gantt-row + .pm-gantt-row .pm-gantt-person,
    .pm-gantt-row + .pm-gantt-row .pm-gantt-timeline {
      border-top: 1px solid #edf2f7;
    }
    .pm-gantt-day-cell {
      min-height: 100%;
      border-right: 1px solid #edf2f7;
      background: #fff;
    }
    .pm-gantt-day-cell.today {
      background: linear-gradient(90deg, rgba(249, 115, 22, .14), rgba(249, 115, 22, .06));
      box-shadow: inset 0 0 0 1px rgba(249, 115, 22, .28);
    }
    .pm-gantt-bar {
      align-self: start;
      z-index: 2;
      height: 24px;
      min-width: 0;
      margin: calc(12px + var(--pm-lane) * 28px) 3px 0;
      border: 1px solid var(--pm-color);
      border-radius: 7px;
      background: var(--pm-color);
      color: #fff;
      box-shadow: 0 6px 12px rgba(15, 23, 42, .13);
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 8px;
      overflow: hidden;
      font-size: 11px;
      font-weight: 900;
      white-space: nowrap;
    }
    .pm-gantt-bar strong,
    .pm-gantt-bar span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pm-gantt-bar strong {
      flex: 0 0 auto;
      max-width: 74px;
    }
    .pm-gantt-bar span {
      opacity: .92;
      min-width: 0;
    }
    .pm-gantt-no-plan {
      grid-column: 1 / -1;
      align-self: center;
      justify-self: start;
      margin-left: 12px;
      color: #94a3b8;
      font-size: 11px;
      font-style: normal;
      font-weight: 800;
    }
    .pm-gantt-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      padding: 10px 12px;
      border-top: 1px solid #e5edf6;
      background: #fff;
    }
    .pm-gantt-legend.muted {
      color: #94a3b8;
      font-size: 12px;
      font-weight: 900;
    }
    .pm-gantt-legend-item i {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      background: var(--pm-color);
    }
    .pm-gantt-empty {
      border: 1px dashed #cbd5e1;
      border-radius: 14px;
      margin: 10px 0 0;
      padding: 28px;
      color: #64748b;
      background: #fff;
      text-align: center;
      font-weight: 900;
    }
    .pm-gantt-empty small {
      display: block;
      margin-top: 5px;
      color: #94a3b8;
    }
    @media (max-width: 1180px) {
      .pm-gantt-toolbar {
        grid-template-columns: 1fr;
        align-items: stretch;
      }
      .pm-gantt-toolbar-note {
        justify-self: start;
      }
      .pm-gantt-head,
      .pm-gantt-row {
        grid-template-columns: 200px max-content;
      }
      .pm-gantt-person-head,
      .pm-gantt-person {
        width: 200px;
      }
    }
  `;
  document.head.appendChild(style);
}

window.togglePmGanttView = togglePmGanttView;
window.pmGanttNav = pmGanttNav;
window.renderPmGanttCalendar = renderPmGanttCalendar;
window.injectPmGanttToggleButton = injectPmGanttToggleButton;
// ─── End Gantt Calendar ───────────────────────────────────────────────────────

})();
