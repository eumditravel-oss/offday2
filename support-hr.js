function switchPanel(panelId) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".side-main, .side-item").forEach(b => b.classList.remove("active"));

  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add("active");

  const activeBtn = document.querySelector(`[data-main="${panelId}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const meta = pageMeta[panelId] || pageMeta.ledger;
  setText("pageTitle", meta[0]);
  setText("pageDesc", meta[1]);
}

document.querySelectorAll(".side-main").forEach(btn => {
  btn.addEventListener("click", () => {
    const groupId = btn.dataset.group;
    const panelId = btn.dataset.main;

    if (groupId) {
      document.querySelectorAll(".side-sub").forEach(s => s.classList.remove("active"));
      document.getElementById(groupId)?.classList.add("active");
      document.querySelectorAll(".side-main").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    }

    if (panelId) {
      switchPanel(panelId);
    }
  });
});

document.querySelectorAll(".side-item").forEach(btn => {
  btn.addEventListener("click", () => {
    switchPanel(btn.dataset.main);
  });
});

document.querySelectorAll(".inner-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".inner-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".detail-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.detail)?.classList.add("active");
  });
});

function renderKpis() {
  setText("kpiTotal", employees.length);
  setText("kpiConcost", employees.filter(e => e.company === "CON-COST").length);
  setText("kpiVietqs", employees.filter(e => e.company === "Viet QS").length);
  setText("kpiActive", employees.filter(e => e.status === "재직").length);
  setText("kpiExpected", employees.filter(e => e.status === "입사예정").length);
}

function getSortValue(emp, key) {
  if (key === "name") return displayName(emp);
  if (key === "gradeOrder") return gradeOrder[emp.grade] || 999;
  return emp[key] || "";
}

function sortList(list) {
  return [...list].sort((a, b) => {
    const av = getSortValue(a, currentSortKey);
    const bv = getSortValue(b, currentSortKey);
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * sortDirection;
    return String(av).localeCompare(String(bv), "ko") * sortDirection;
  });
}

function toggleSort(key) {
  if (currentSortKey === key) {
    sortDirection *= -1;
  } else {
    currentSortKey = key;
    sortDirection = 1;
  }
  applyLedgerFilters(false);
}

function renderLedger(list = employees) {
  const tbody = document.getElementById("ledgerBody");
  if (!tbody) return;

  tbody.innerHTML = sortList(list).map(emp => `
    <tr>
      <td><div class="emp-photo">${displayName(emp)[0]}</div></td>
      <td>${emp.empNo}</td>
      <td><strong>${displayName(emp)}</strong></td>
      <td>${companyBadge(emp.company)}</td>
      <td>${emp.id}</td>
      <td>${emp.dept}</td>
      <td>${emp.grade}</td>
      <td>${statusBadge(emp.status)}</td>
      <td>${emp.join}</td>
      <td><span class="badge blue">${emp.eval}</span></td>
      <td>${emp.project}</td>
      <td><button class="btn btn-line" onclick="openCard('${emp.empNo}')">상세</button></td>
    </tr>
  `).join("");
}

function renderEmployeeList(list = employees) {
  const box = document.getElementById("employeeList");
  if (!box) return;

  if (!list.length) {
    box.innerHTML = `<div class="employee-empty">검색 결과가 없습니다.</div>`;
    return;
  }

  box.innerHTML = list.map(emp => `
    <button type="button" class="employee-item ${emp.empNo === selectedEmployeeId ? "active" : ""}" onclick="selectEmployee('${emp.empNo}', this, true)">
      <div class="emp-name">${displayName(emp)}</div>
      <div class="emp-meta">${emp.company} · ${emp.dept} · ${emp.grade} · ${emp.status}</div>
      <div class="emp-no">${emp.empNo}</div>
    </button>
  `).join("");
}

function setEmployeeTopListCollapsed(collapsed) {
  const card = document.getElementById("employeeTopCard");
  const btn = document.getElementById("employeeListToggleBtn");
  if (!card || !btn) return;

  card.classList.toggle("collapsed", collapsed);
  btn.textContent = collapsed ? "직원 목록 펼치기" : "직원 목록 접기";
}

function toggleEmployeeTopList() {
  const card = document.getElementById("employeeTopCard");
  if (!card) return;
  setEmployeeTopListCollapsed(!card.classList.contains("collapsed"));
}

function selectEmployee(empNo, el, autoCollapse = false) {
  const emp = employees.find(e => e.empNo === empNo);
  if (!emp) return;

  selectedEmployeeId = empNo;

  document.querySelectorAll(".employee-item").forEach(item => item.classList.remove("active"));
  if (el) el.classList.add("active");
  if (autoCollapse) setEmployeeTopListCollapsed(true);

  setText("profilePhoto", displayName(emp)[0]);
  setText("profileName", displayName(emp));
  setText("quickTenure", formatMonths(monthDiff(emp.join)));
  setText("quickCareer", formatMonths(monthDiff(emp.join) + emp.externalCareerMonths));
  setText("quickProject", emp.project);
  setText("quickGrade", emp.eval);

  const profileTags = document.getElementById("profileTags");
  if (profileTags) {
    profileTags.innerHTML = `
      ${companyBadge(emp.company)}
      <span class="badge blue">${emp.dept}</span>
      <span class="badge gray">${emp.grade}</span>
      ${statusBadge(emp.status)}
      <span class="badge blue">${emp.join} 입사</span>
      <span class="badge gray">${emp.empNo}</span>
    `;
  }

  setFormValue("cardName", emp.name);
  setFormValue("cardLocalName", emp.localName);
  setFormValue("cardKoreanName", emp.koreanName);
  setFormValue("cardEmpNo", emp.empNo);
  setFormValue("cardUserId", emp.id);
  setFormValue("cardCompany", emp.company);
  setFormValue("cardDept", emp.dept);
  setFormValue("cardGrade", emp.grade);
  setFormValue("cardPosition", emp.position);
  setFormValue("cardStatus", emp.status);
  setFormValue("cardJoin", emp.join);
  setFormValue("cardEndDate", emp.endDate);
  setFormValue("cardCorp", emp.company === "Viet QS" ? "베트남 지사" : "한국 본사");
  setFormValue("cardWorkplace", emp.workplace);
  setFormValue("cardEmail", emp.email);
  setFormValue("phoneCountry", emp.phoneCountry);
  setFormValue("phoneInput", emp.phone);
  setFormValue("cardAddress", emp.address);
  setFormValue("cardEmergency", emp.emergency);
  setFormValue("idCountry", emp.idCountry);
  setFormValue("nationalId", emp.nationalId);
  setFormValue("cardBirthday", emp.birthday);
  setFormValue("cardWedding", emp.wedding);
  setFormValue("cardNationality", emp.nationality);
  setFormValue("orgPath", emp.orgPath);
  setFormValue("reportLine", emp.reportLine);
  setFormValue("pmRole", emp.pmRole);
  setFormValue("multiDept", emp.multiDept);
  setText("basicAudit", emp.audit.basic);
  setText("detailAudit", emp.audit.detail);

  renderHistories(emp);
  renderRepeat(emp);
  renderEmployeeAssets(emp);
  renderWorklogs(emp);
  renderFiles(emp);
}

function renderHistories(emp) {
  renderHistoryRows("joinHistoryBody", emp.histories.join);
  renderHistoryRows("orgHistoryBody", emp.histories.org);
  renderHistoryRows("leaveHistoryBody", emp.histories.leave);
}

function renderHistoryRows(targetId, rows) {
  const tbody = document.getElementById(targetId);
  if (!tbody) return;

  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">등록된 이력이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(row => `
    <tr>
      <td>${row.type}</td>
      <td>${row.before}</td>
      <td>${row.after}</td>
      <td>${row.date}</td>
      <td>${row.reason}</td>
      <td>${row.manager}</td>
    </tr>
  `).join("");
}

function renderRepeat(emp) {
  const tbody = document.getElementById("repeatBody");
  if (!tbody) return;

  if (!emp.repeat || emp.repeat.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">등록된 반복 정보가 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = emp.repeat.map(row => `
    <tr>
      <td>${row.type}</td>
      <td>${row.content}</td>
      <td>${row.start}</td>
      <td>${row.end}</td>
      <td>${row.period}</td>
      <td>${row.file}</td>
      <td>${row.note}</td>
    </tr>
  `).join("");
}

function renderEmployeeAssets(emp) {
  const tbody = document.getElementById("employeeAssetBody");
  if (!tbody) return;

  const assets = assetLedger.filter(a => a.owner === emp.name || a.owner === emp.localName || a.owner === displayName(emp));

  if (assets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">배정된 자산이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = assets.map(a => `
    <tr>
      <td>${a.category}</td>
      <td>${a.name}</td>
      <td>${a.code}</td>
      <td>${a.date}</td>
      <td>-</td>
      <td><span class="badge green">${a.status}</span></td>
    </tr>
  `).join("");
}

function renderWorklogs(emp) {
  setText("usedLeave", emp.usedLeave);
  setText("otTotal", emp.otTotal);
  setText("mainOtProject", emp.mainOtProject);

  const tbody = document.getElementById("worklogBody");
  if (!tbody) return;

  if (!emp.worklogs || emp.worklogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">등록된 업무/야근 이력이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = emp.worklogs.map(row => `
    <tr>
      <td>${row.date}</td>
      <td>${row.type}</td>
      <td>${row.project}</td>
      <td>${row.time}</td>
      <td>${row.reason}</td>
      <td>${row.approver}</td>
    </tr>
  `).join("");
}

function renderFiles(emp) {
  const tbody = document.getElementById("fileBody");
  if (!tbody) return;

  if (!emp.files || emp.files.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">등록된 파일이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = emp.files.map(file => `
    <tr>
      <td>${file.type}</td>
      <td>${file.name}</td>
      <td>${file.date}</td>
      <td><span class="badge ${file.status === "승인완료" ? "green" : "yellow"}">${file.status}</span></td>
      <td><button class="btn btn-line">다운로드</button></td>
      <td><button class="btn btn-line">변경신청</button></td>
    </tr>
  `).join("");
}

function openCard(empNo) {
  switchPanel("card");
  setTimeout(() => selectEmployee(empNo), 0);
}

function filterEmployees(keyword = "") {
  const q = keyword.trim().toLowerCase();
  const company = document.getElementById("companyFilter")?.value || "전체";
  const dept = document.getElementById("deptFilter")?.value || "전체";
  const grade = document.getElementById("gradeFilter")?.value || "전체";
  const status = document.getElementById("statusFilter")?.value || "재직";
  const year = document.getElementById("yearFilter")?.value || "전체";

  return employees.filter(emp => {
    const searchTarget = [emp.name, emp.localName, emp.koreanName, emp.empNo, emp.id, emp.company, emp.dept, emp.email].join(" ").toLowerCase();

    return (!q || searchTarget.includes(q)) &&
      (company === "전체" || emp.company === company) &&
      (dept === "전체" || emp.dept === dept) &&
      (grade === "전체" || emp.grade === grade) &&
      (status === "전체" || emp.status === status) &&
      (year === "전체" || emp.join.startsWith(year));
  });
}

function applyLedgerFilters(show = true) {
  const keyword = document.getElementById("ledgerSearch")?.value || "";
  renderLedger(filterEmployees(keyword));
  if (show) showToast("검색 조건이 적용되었습니다.");
}

function filterEmployeesForList(keyword) {
  const q = keyword.trim().toLowerCase();
  return employees.filter(emp =>
    emp.name.toLowerCase().includes(q) ||
    emp.localName.toLowerCase().includes(q) ||
    emp.koreanName.toLowerCase().includes(q) ||
    emp.empNo.toLowerCase().includes(q) ||
    emp.id.toLowerCase().includes(q) ||
    emp.dept.toLowerCase().includes(q) ||
    emp.company.toLowerCase().includes(q) ||
    emp.email.toLowerCase().includes(q)
  );
}

function renderAnalysis() {
  const body = document.getElementById("analysisBody");
  const careerBody = document.getElementById("careerSummaryBody");
  if (!body || !careerBody) return;

  const companies = ["CON-COST", "Viet QS"];
  body.innerHTML = companies.map(company => {
    const target = employees.filter(e => e.company === company);
    return `
      <tr>
        <td>${company}</td>
        <td>${target.filter(e => e.status === "재직").length}</td>
        <td>${target.filter(e => e.join.startsWith("2026")).length}</td>
        <td>${target.filter(e => ["퇴사", "계약만료"].includes(e.status)).length}</td>
        <td>${target.filter(e => e.status === "입사예정").length}</td>
        <td>${target.filter(e => e.status === "휴직").length}</td>
      </tr>
    `;
  }).join("");

  careerBody.innerHTML = employees.map(emp => {
    const tenureMonths = monthDiff(emp.join);
    const totalCareer = tenureMonths + emp.externalCareerMonths;
    const rejoin = emp.histories.join.some(h => h.type === "재입사") ? "있음" : "없음";

    return `
      <tr>
        <td>${displayName(emp)}</td>
        <td>${companyBadge(emp.company)}</td>
        <td>${emp.join}</td>
        <td>${formatMonths(tenureMonths)}</td>
        <td>${formatMonths(emp.externalCareerMonths)}</td>
        <td>${formatMonths(totalCareer)}</td>
        <td>${rejoin}</td>
      </tr>
    `;
  }).join("");

  const join2026 = employees.filter(e => e.join.startsWith("2026")).length;
  const exit2026 = employees.filter(e => ["퇴사", "계약만료"].includes(e.status)).length;
  const avgTenure = Math.round(employees.reduce((sum, e) => sum + monthDiff(e.join), 0) / employees.length);
  const avgCareer = Math.round(employees.reduce((sum, e) => sum + monthDiff(e.join) + e.externalCareerMonths, 0) / employees.length);

  setText("analysisJoin", join2026);
  setText("analysisExit", exit2026);
  setText("analysisExitRate", `${Math.round((exit2026 / employees.length) * 100)}%`);
  setText("analysisAvgTenure", formatMonths(avgTenure));
  setText("analysisAvgCareer", formatMonths(avgCareer));
}

function renderAssetLedger() {
  const tbody = document.getElementById("assetLedgerBody");
  if (!tbody) return;

  tbody.innerHTML = assetLedger.map(a => `
    <tr>
      <td>${a.category}</td>
      <td>${a.name}</td>
      <td>${a.code}</td>
      <td>${a.owner}</td>
      <td>${a.date}</td>
      <td><span class="badge ${a.status === "사용중" ? "green" : "yellow"}">${a.status}</span></td>
      <td><button class="btn btn-line" onclick="showToast('자산 배정/반납 관리 예시입니다.')">관리</button></td>
    </tr>
  `).join("");
}

function renderPermissionRows() {
  const tbody = document.getElementById("permissionBody");
  if (!tbody) return;

  tbody.innerHTML = permissionRows.map(row => `
    <tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td>${row[3]}</td>
      <td>${row[4]}</td>
      <td>${row[5]}</td>
    </tr>
  `).join("");
}

function getActiveOrderRows(category) {
  return orderRows
    .filter(row => row[0] === category && row[4] === "사용")
    .sort((a, b) => Number(a[3]) - Number(b[3]));
}

function syncOrderRowsToOrgSettings() {
  Object.keys(gradeOrder).forEach(key => delete gradeOrder[key]);
  getActiveOrderRows("직급").forEach(row => {
    gradeOrder[row[2]] = Number(row[3]) || 999;
  });

  applyCodeOrderToSelects();
}

function applyCodeOrderToSelects() {
  const gradeNames = getActiveOrderRows("직급").map(row => row[2]);
  const gradeSelectIds = ["gradeFilter", "cardGrade"];

  gradeSelectIds.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;

    const previousValue = select.value;
    const hasAll = id === "gradeFilter";
    select.innerHTML = `${hasAll ? '<option value="전체">전체</option>' : ''}${gradeNames.map(name => `<option value="${name}">${name}</option>`).join("")}`;

    if ([...select.options].some(option => option.value === previousValue)) {
      select.value = previousValue;
    } else if (hasAll) {
      select.value = "전체";
    }
  });
}

function renderOrderRows() {
  const tbody = document.getElementById("orderBody");
  if (!tbody) return;

  syncOrderRowsToOrgSettings();

  const sortedRows = orderRows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const categoryCompare = String(a.row[0]).localeCompare(String(b.row[0]), "ko");
      if (categoryCompare !== 0) return categoryCompare;
      return Number(a.row[3]) - Number(b.row[3]);
    });

  tbody.innerHTML = sortedRows.map(({ row, index }) => `
    <tr>
      <td>
        <select class="order-cell-select" onchange="updateOrderRow(${index}, 0, this.value)">
          ${["직급", "직책", "부서", "재직상태"].map(category => `<option value="${category}" ${row[0] === category ? "selected" : ""}>${category}</option>`).join("")}
        </select>
      </td>
      <td><input class="order-code-input" value="${row[1]}" onchange="updateOrderRow(${index}, 1, this.value)"></td>
      <td><input value="${row[2]}" onchange="updateOrderRow(${index}, 2, this.value)"></td>
      <td><input type="number" min="1" value="${row[3]}" onchange="updateOrderRow(${index}, 3, this.value)"></td>
      <td>
        <select class="order-cell-select" onchange="updateOrderRow(${index}, 4, this.value)">
          <option value="사용" ${row[4] === "사용" ? "selected" : ""}>사용</option>
          <option value="미사용" ${row[4] === "미사용" ? "selected" : ""}>미사용</option>
        </select>
      </td>
      <td>
        <div class="order-actions">
          <button class="btn btn-line" onclick="moveOrderRow(${index}, -1)">↑</button>
          <button class="btn btn-line" onclick="moveOrderRow(${index}, 1)">↓</button>
          <button class="btn btn-danger" onclick="deleteOrderRow(${index})">삭제</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function updateOrderRow(index, cellIndex, value) {
  if (!orderRows[index]) return;
  orderRows[index][cellIndex] = cellIndex === 3 ? Number(value) || 999 : value.trim();
  normalizeOrderRows(orderRows[index][0]);
  renderOrderRows();
  refreshOrderLinkedViews();
  showToast("표시순서가 조직관리 화면에 반영되었습니다.");
}

function normalizeOrderRows(category) {
  const rows = orderRows
    .filter(row => row[0] === category)
    .sort((a, b) => Number(a[3]) - Number(b[3]));

  rows.forEach((row, idx) => {
    row[3] = idx + 1;
  });
}

function moveOrderRow(index, direction) {
  const row = orderRows[index];
  if (!row) return;

  const sameCategory = orderRows
    .map((target, targetIndex) => ({ target, targetIndex }))
    .filter(item => item.target[0] === row[0])
    .sort((a, b) => Number(a.target[3]) - Number(b.target[3]));

  const currentPosition = sameCategory.findIndex(item => item.targetIndex === index);
  const next = sameCategory[currentPosition + direction];
  if (!next) return;

  const currentOrder = row[3];
  row[3] = next.target[3];
  next.target[3] = currentOrder;

  renderOrderRows();
  refreshOrderLinkedViews();
  showToast("표시순서가 변경되어 조직관리 화면에 반영되었습니다.");
}

function getNextOrderCode(category) {
  const prefixMap = { 직급: "G", 직책: "R", 부서: "D", 재직상태: "S" };
  const prefix = prefixMap[category] || "C";
  const maxNumber = orderRows
    .filter(row => row[0] === category && String(row[1]).startsWith(prefix))
    .map(row => Number(String(row[1]).replace(prefix, "")) || 0)
    .reduce((max, value) => Math.max(max, value), 0);
  return `${prefix}${String(maxNumber + 1).padStart(3, "0")}`;
}

function addOrderRow() {
  const category = document.getElementById("orderAddCategory")?.value || "직급";
  const nameInput = document.getElementById("orderAddName");
  const name = (nameInput?.value || "").trim();

  if (!name) {
    showToast("추가할 표시명을 입력하세요.");
    nameInput?.focus();
    return;
  }

  const nextOrder = orderRows.filter(row => row[0] === category).length + 1;
  orderRows.push([category, getNextOrderCode(category), name, nextOrder, "사용"]);

  if (nameInput) nameInput.value = "";
  renderOrderRows();
  refreshOrderLinkedViews();
  showToast(`${category} 코드가 추가되고 조직관리 화면에 반영되었습니다.`);
}

function deleteOrderRow(index) {
  const row = orderRows[index];
  if (!row) return;

  if (!confirm(`${row[2]} 항목을 삭제할까요?`)) return;

  const category = row[0];
  orderRows.splice(index, 1);
  normalizeOrderRows(category);
  renderOrderRows();
  refreshOrderLinkedViews();
  showToast("표시순서 항목이 삭제되고 조직관리 화면에 반영되었습니다.");
}

function refreshOrderLinkedViews() {
  syncOrderRowsToOrgSettings();
  applyLedgerFilters(false);
  renderEmployeeList(filterEmployeesForList(document.getElementById("employeeSearch")?.value || ""));
  renderOrgEditor();
}

function validateRequired() {
  const activePanel = document.querySelector(".detail-panel.active");
  if (!activePanel) return;

  const requiredInputs = activePanel.querySelectorAll("[required]");
  let valid = true;

  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add("invalid");
      valid = false;
    } else {
      input.classList.remove("invalid");
    }
  });

  showToast(valid ? "필수 입력값 검증 완료. 저장 처리 예시입니다." : "* 필수 입력값을 확인해 주세요.");
}

function validateModal() {
  const modal = document.getElementById("employeeModal");
  if (!modal) return;

  const requiredInputs = modal.querySelectorAll("[required]");
  let valid = true;

  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add("invalid");
      valid = false;
    } else {
      input.classList.remove("invalid");
    }
  });

  if (valid) {
    closeModal();
    showToast("신규 직원 등록 예시가 저장되었습니다.");
  } else {
    showToast("* 필수 입력값을 확인해 주세요.");
  }
}

function openModal() {
  document.getElementById("employeeModal")?.classList.add("active");
}

function closeModal() {
  document.getElementById("employeeModal")?.classList.remove("active");
}

function openExcelModal() {
  document.getElementById("excelModal")?.classList.add("active");
}

function closeExcelModal() {
  document.getElementById("excelModal")?.classList.remove("active");
}

function openPermissionModal() {
  document.getElementById("permissionModal")?.classList.add("active");
}

function closePermissionModal() {
  document.getElementById("permissionModal")?.classList.remove("active");
}


function employeeById(empNo) {
  return employees.find(e => e.empNo === empNo);
}

function isOrgDepartmentNode(node) {
  return String(node?.nodeType || node?.type || "").toLowerCase() === "department";
}

function orgNodeLabel(node) {
  const isDepartment = isOrgDepartmentNode(node);
  const emp = !isDepartment && node?.employeeId ? employeeById(node.employeeId) : null;
  const title = isDepartment ? "부서명" : (node?.title || (emp ? emp.position || emp.grade : "조직"));
  const name = isDepartment ? (node?.displayName || node?.title || "부서명") : (emp ? displayName(emp) : (node?.displayName || ""));
  return { emp, title, name };
}

function renderOrgPersonButton(node, extraClass = "") {
  const { emp, title, name } = orgNodeLabel(node);
  const labelName = name || title;
  const labelTitle = emp ? (emp.position || emp.grade || title) : title;
  const company = emp ? emp.company : "";
  const dept = emp ? emp.dept : "";
  const onclick = emp ? ` onclick="openMiniCardPopup('${emp.empNo}')"` : "";
  return `
    <button class="org-mini-person ${extraClass} ${emp ? "clickable" : ""}"${onclick}>
      <span>${labelTitle}</span>
      <strong>${labelName}</strong>
      ${company ? `<small>${company} · ${dept}</small>` : ""}
    </button>
  `;
}

function collectOrgMembers(node, rows = []) {
  if (node?.employeeId) rows.push(node);
  (node?.children || []).forEach(child => collectOrgMembers(child, rows));
  return rows;
}

function renderOrgBranchCard(node) {
  const { emp, title, name } = orgNodeLabel(node);
  const children = node.children || [];
  const directLead = emp ? renderOrgPersonButton(node, "lead") : "";
  const childMembers = children.flatMap(child => collectOrgMembers(child, []));
  const childOnly = childMembers.filter(child => child.employeeId !== node.employeeId);

  return `
    <section class="org-overview-card">
      <div class="org-overview-card-title">${title}</div>
      ${directLead || (name ? `<div class="org-overview-lead">${name}</div>` : "")}
      <div class="org-overview-members">
        ${childOnly.map(child => renderOrgPersonButton(child)).join("") || `<div class="org-empty">하위 인원 없음</div>`}
      </div>
    </section>
  `;
}

function splitOrgColumns(nodes, maxColumns = 3) {
  const list = (nodes || []).filter(Boolean);
  const columns = Math.min(maxColumns, Math.max(1, Math.ceil(list.length / 4)));
  const buckets = Array.from({ length: columns }, () => []);
  list.forEach((node, index) => buckets[index % columns].push(node));
  return buckets;
}

function renderOrgMemberColumns(nodes, maxColumns = 3) {
  const list = (nodes || []).filter(Boolean);
  if (!list.length) return `<div class="org-empty">하위 인원 없음</div>`;
  return `
    <div class="org-member-column-wrap cols-${Math.min(maxColumns, Math.max(1, Math.ceil(list.length / 4)))}">
      ${splitOrgColumns(list, maxColumns).map(col => `
        <div class="org-member-column">
          ${col.map(child => renderOrgPersonButton(child)).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

function renderOrgDepartmentBlock(node, options = {}) {
  if (!node) return "";
  const { emp, title, name } = orgNodeLabel(node);
  const children = (node.children || []).filter(child => child.employeeId !== node.employeeId);
  const subGroups = children.filter(child => (child.children || []).length);
  const directMembers = children.filter(child => !(child.children || []).length);
  const colCount = options.columns || 3;

  return `
    <section class="org-chart-block ${options.className || ""}">
      <div class="org-block-title">${title}</div>
      ${emp ? renderOrgPersonButton(node, "lead") : (name ? `<div class="org-overview-lead">${name}</div>` : "")}
      ${directMembers.length ? `<div class="org-block-members">${renderOrgMemberColumns(directMembers, colCount)}</div>` : ""}
      ${subGroups.length ? `
        <div class="org-subpart-grid ${subGroups.length > 2 ? "wide" : ""}">
          ${subGroups.map(group => renderOrgDepartmentBlock(group, { className: "subpart", columns: 2 })).join("")}
        </div>
      ` : ""}
      ${!directMembers.length && !subGroups.length ? `<div class="org-empty">하위 인원 없음</div>` : ""}
    </section>
  `;
}


function isOrgActualLeaf(node) {
  return !(node?.children || []).length;
}

function actualOrgNodeClass(node, depth = 0) {
  const cls = [node.className || ""];
  if (depth === 0) cls.push("primary");
  if (depth === 1) cls.push("secondary");
  if (isOrgActualLeaf(node)) cls.push("leaf");
  if ((node.children || []).length) cls.push("branch");
  return cls.filter(Boolean).join(" ");
}

function renderActualOrgCard(node, depth = 0) {
  const { emp, title, name } = orgNodeLabel(node);
  const displayTitle = title || (emp ? emp.position || emp.grade : "조직");
  const displayNameText = emp ? displayName(emp) : (name || "직원 미연결");
  const meta = emp ? `${emp.company} · ${emp.dept}` : "조직 노드";
  const onclick = emp ? ` onclick="openMiniCardPopup('${emp.empNo}')"` : "";

  return `
    <button class="actual-org-card ${actualOrgNodeClass(node, depth)}"${onclick}>
      <span>${displayTitle}</span>
      <strong>${displayNameText}</strong>
      <small>${meta}</small>
    </button>
  `;
}

function renderActualOrgTreeNode(node, depth = 0, path = "0") {
  const { emp, title, name } = orgNodeLabel(node);
  const children = node.children || [];
  const info = typeof getOrgDisplayInfo === "function"
    ? getOrgDisplayInfo(node, emp, title, name)
    : {
      displayTitle: title || (emp ? emp.position || emp.grade : "조직"),
      displayPerson: emp ? displayName(emp) : (name || "직원 미연결"),
      meta: emp ? `${emp.company} · ${emp.dept}` : "조직 노드"
    };
  const displayTitle = info.displayTitle;
  const displayPerson = info.displayPerson;
  const meta = info.meta;
  const onclick = emp && !(typeof isOrgDepartmentNode === "function" && isOrgDepartmentNode(node)) ? ` onclick="openMiniCardPopup('${emp.empNo}')"` : "";
  const typeClass = node.className || "";
  const layoutClass = getOrgPopupNodeClass(node, depth).replaceAll("org-popup-", "actual-view-");
  const childCount = children.length;
  const childColumnCount = childCount ? Math.min(childCount, getOrgMemberColumnCount(node)) : 1;

  return `
    <div class="actual-view-node-wrap ${layoutClass} depth-${depth}" data-path="${path}">
      <button class="actual-view-node ${typeClass} depth-${depth}"${onclick}>
        <span>${displayTitle}</span>
        <strong>${displayPerson}</strong>
        <em>${meta}</em>
      </button>

      ${childCount ? `
        <div class="actual-view-unified-children depth-${depth} count-${childCount} cols-${childColumnCount}" style="--org-child-count:${childCount};--org-child-cols:${childColumnCount};grid-template-columns:repeat(${childColumnCount}, max-content) !important;">
          ${children.map((child, index) => renderActualOrgTreeNode(child, depth + 1, `${path}-${index}`)).join("")}
        </div>
      ` : ""}
    </div>
  `;
}


/* === Topbar 권한 등급 선택 === */
const permissionRoleOptions = [
  "CEO",
  "COO",
  "경영지원(이서진상무)",
  "경영지원(강동균실장)",
  "경영지원(김영은책임)",
  "경영지원(김태영선임)",
  "경영지원(현예은선임)",
  "본부장",
  "구조실장",
  "마감실장",
  "구조팀장",
  "파트장",
  "T/F팀",
  "구조PM",
  "마감PM",
  "토목ㆍ조경PM",
  "Leader-Finish-Internal1",
  "Leader-Finish-Internal2",
  "Leader-Finish-Internal3",
  "Leader-Finish-Partition&Opening",
  "Leader-Finish-External",
  "Leader-Structure-Vertical",
  "Leader-Structure-Horizontal/Foundation",
  "Leader-Civil",
  "Asst.Leader",
  "Staff"
];
let currentPermissionRoleValue = "구조PM";

function renderPermissionRoleDropdown() {
  const list = document.getElementById("permissionRoleList");
  const label = document.getElementById("currentPermissionRole");
  if (!list) return;
  list.innerHTML = permissionRoleOptions.map(role => `
    <button
      type="button"
      class="permission-role-btn ${role === currentPermissionRoleValue ? "active" : ""}"
      onclick="selectPermissionRole('${role.replace(/'/g, "\'")}')"
    >${role}</button>
  `).join("");
  if (label) label.textContent = `권한: ${currentPermissionRoleValue}`;
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

function selectPermissionRole(role) {
  currentPermissionRoleValue = role;
  renderPermissionRoleDropdown();
  const dropdown = document.getElementById("permissionDropdown");
  const button = document.querySelector(".permission-user-btn");
  if (dropdown) dropdown.classList.remove("open");
  if (button) button.setAttribute("aria-expanded", "false");
  showToast(`현재 권한 등급이 '${role}'로 설정되었습니다.`);
  if (typeof renderPmScheduleDashboard === "function") renderPmScheduleDashboard();
  window.dispatchEvent(new CustomEvent("permissionRole:changed", { detail: { role } }));
  if (typeof profitAnalysisModule !== "undefined") {
    profitAnalysisModule.setRoleFromPermission?.(role);
    if (document.getElementById("profitAnalysis")?.classList.contains("active")) profitAnalysisModule.render?.();
  }
}

document.addEventListener("click", event => {
  const wrap = document.getElementById("permissionUserWrap");
  const dropdown = document.getElementById("permissionDropdown");
  const button = document.querySelector(".permission-user-btn");
  if (!wrap || !dropdown || wrap.contains(event.target)) return;
  dropdown.classList.remove("open");
  if (button) button.setAttribute("aria-expanded", "false");
});

document.addEventListener("DOMContentLoaded", renderPermissionRoleDropdown);

/* === 2026-06-16 인사카드 기반 권한 카테고리 설정 === */
(function installEmployeePermissionConsole(){
  const STORAGE_KEY = "concost.employeePermissionSettings.v1";
  const permissionActions = [
    ["view", "보기"],
    ["create", "작성"],
    ["edit", "수정"],
    ["approve", "승인"],
    ["export", "내보내기"],
    ["delete", "삭제"],
    ["admin", "관리"]
  ];
  const permissionCategories = [
    {
      key: "mail",
      title: "전자메일",
      visual: "MAIL",
      desc: "수신함, 발신함, 검토요청, 예약메일",
      modules: [
        ["mail.inbox", "받은편지함", "검토요청/납품메일/일반 수신함"],
        ["mail.sent", "보낸편지함", "발신 이력과 재발송"],
        ["mail.review", "검토요청 메일", "QC/견적/납품 검토 알림"],
        ["mail.reserve", "예약/중요메일", "예약 발송과 중요 표시"]
      ]
    },
    {
      key: "approval",
      title: "전자결재",
      visual: "APRV",
      desc: "상신, 승인, 반려, 대리결재",
      modules: [
        ["approval.draft", "결재 상신", "문서 작성과 상신"],
        ["approval.review", "승인/반려", "상위 승인 처리"],
        ["approval.proxy", "대리결재", "위임 승인과 긴급 처리"],
        ["approval.archive", "결재 이력", "완료/반려 문서 열람"]
      ]
    },
    {
      key: "work",
      title: "업무관리",
      visual: "WORK",
      desc: "프로젝트 접수부터 수지분석까지",
      modules: [
        ["work.project", "프로젝트 관리", "견적 의뢰관리와 프로젝트 목록"],
        ["work.receive", "프로젝트 접수", "업체/프로젝트 가등록과 착수 조건"],
        ["work.pm", "PM배정/일정", "PM 배정, 작성요청, 전체일정"],
        ["work.approval", "작업일정 결재", "스케줄 1·2안 승인/반려"],
        ["work.operation", "프로젝트 운영현황", "수주/착수/납품 운영 정보"],
        ["work.qc", "프로젝트 질의응답", "체크리스트와 견적조건 최종"],
        ["work.delivery", "납품 및 데이터관리", "납품차수/파일/승인"],
        ["work.daily", "업무일지/진행률", "일지, 야근, 진행률"],
        ["work.profit", "수지분석", "투입 인원과 손익 분석"]
      ]
    },
    {
      key: "support",
      title: "경영지원",
      visual: "HR",
      desc: "인사카드, 조직도, 관리자 설정",
      modules: [
        ["support.ledger", "사원대장", "직원 목록과 기본정보"],
        ["support.card", "인사카드", "상세 인사정보와 첨부"],
        ["support.analysis", "직원증감분석", "입퇴사/근속/경력 분석"],
        ["support.approval", "승인관리", "증명서/정보변경 승인"],
        ["support.org", "조직도관리", "조직 편집과 직원 연결"],
        ["support.admin", "관리자 설정", "권한/정책/표시순서"]
      ]
    },
    {
      key: "sensitive",
      title: "민감정보/출력",
      visual: "DATA",
      desc: "개인정보, 평가, 연봉, 파일 반출",
      modules: [
        ["sensitive.id", "주민등록/신분증", "개인 식별 정보"],
        ["sensitive.pay", "평가/연봉", "평가등급과 보상 정보"],
        ["sensitive.bank", "계좌정보", "급여/정산 계좌"],
        ["sensitive.file", "첨부파일", "계약서, 증명서, 자산 파일"],
        ["sensitive.export", "엑셀/PDF 내보내기", "파일 생성과 외부 반출"],
        ["sensitive.audit", "변경 이력", "수정자/수정일/변경 항목"]
      ]
    }
  ];

  let permissionSelectedCategory = "work";
  let permissionCompanyFilter = "all";
  let currentPermissionEmployeeId = selectedEmployeeId || employees?.[0]?.empNo || "";
  let employeePermissionSettings = loadEmployeePermissionSettings();

  function permissionHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[ch]));
  }

  function permissionDisplayName(emp) {
    return typeof displayName === "function" ? displayName(emp) : (emp?.name || emp?.empNo || "-");
  }

  function permissionEmployee(empNo = currentPermissionEmployeeId) {
    return (employees || []).find(emp => emp.empNo === empNo) || employees?.[0] || null;
  }

  function permissionRoleTextForEmployee(emp) {
    if (!emp) return "Staff";
    const name = permissionDisplayName(emp);
    const dept = String(emp.dept || "");
    const grade = String(emp.grade || "");
    const position = String(emp.position || "");
    const text = `${dept} ${grade} ${position} ${name}`;

    if (/CEO|대표/.test(text)) return "CEO";
    if (/COO|부사장/.test(text)) return "COO";
    if (dept.includes("경영지원")) return `경영지원(${name}${grade})`;
    if (grade.includes("본부장") || position.includes("본부장")) return "본부장";
    if (grade.includes("실장") || position.includes("실장")) return dept.includes("마감") ? "마감실장" : "구조실장";
    if (emp.pmRole === "사용" || /PM|BIM|구조/.test(text)) return dept.includes("마감") ? "마감PM" : "구조PM";
    if (emp.company === "Viet QS") {
      if (grade.includes("Asst.")) return "Asst.Leader";
      if (grade.includes("Team Leader")) {
        const normalized = typeof normalizePmScheduleVietDeptName === "function" ? normalizePmScheduleVietDeptName(dept) : dept;
        if (/Internal|Partition|External/.test(normalized)) return `Leader-Finish-${normalized.replace(/\s+/g, "")}`;
        if (/Civil/.test(normalized)) return "Leader-Civil";
        return `Leader-Structure-${normalized || "Vertical"}`;
      }
      return "Staff";
    }
    if (grade.includes("팀장")) return "구조팀장";
    if (grade.includes("파트장") || position.includes("파트")) return "파트장";
    return "Staff";
  }

  function getPermissionRoleOptions() {
    return [...new Set([
      ...(Array.isArray(permissionRoleOptions) ? permissionRoleOptions : []),
      ...(employees || []).map(permissionRoleTextForEmployee)
    ])].filter(Boolean);
  }

  function roleLevel(role = "") {
    const text = String(role);
    if (/CEO|COO|대표|부사장/.test(text)) return 5;
    if (/경영지원|본부장|실장/.test(text)) return 4;
    if (/PM|팀장|파트장|Leader/.test(text)) return 3;
    if (/Asst/.test(text)) return 2;
    return 1;
  }

  function defaultActionState(role, categoryKey, moduleKey, action) {
    const level = roleLevel(role);
    if (level >= 5) return true;
    if (level >= 4) {
      if (action === "delete") return categoryKey === "support" || categoryKey === "sensitive";
      return true;
    }
    if (level >= 3) {
      if (categoryKey === "support" || categoryKey === "sensitive") return action === "view" || action === "export";
      if (action === "delete" || action === "admin") return false;
      if (action === "approve") return /pm|approval|operation|delivery/.test(moduleKey);
      return true;
    }
    if (level >= 2) {
      if (categoryKey === "work") return ["view", "create", "edit"].includes(action);
      return action === "view";
    }
    return action === "view";
  }

  function buildDefaultPermissionRecord(emp) {
    const role = permissionRoleTextForEmployee(emp);
    const modules = {};
    permissionCategories.forEach(category => {
      category.modules.forEach(([moduleKey]) => {
        modules[moduleKey] = {};
        permissionActions.forEach(([action]) => {
          modules[moduleKey][action] = defaultActionState(role, category.key, moduleKey, action);
        });
      });
    });
    return { role, modules, updatedAt: "" };
  }

  function loadEmployeePermissionSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
    } catch (err) {
      console.warn("권한 설정 로드 실패", err);
      return {};
    }
  }

  function persistEmployeePermissionSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employeePermissionSettings));
    } catch (err) {
      console.warn("권한 설정 저장 실패", err);
    }
  }

  function getPermissionRecord(empNo = currentPermissionEmployeeId) {
    const emp = permissionEmployee(empNo);
    if (!emp) return { role: "Staff", modules: {} };
    if (!employeePermissionSettings[emp.empNo]) {
      employeePermissionSettings[emp.empNo] = buildDefaultPermissionRecord(emp);
    }
    return employeePermissionSettings[emp.empNo];
  }

  function setPermissionRole(role, options = {}) {
    currentPermissionRoleValue = role || "Staff";
    const label = document.getElementById("currentPermissionRole");
    if (label) label.textContent = `권한: ${currentPermissionRoleValue}`;
    const emp = permissionEmployee();
    const nameLabel = document.getElementById("currentUserName");
    if (nameLabel && emp) nameLabel.textContent = `${permissionDisplayName(emp)} ${emp.grade || ""}`.trim();
    if (!options.silentToast && typeof showToast === "function") showToast(`현재 권한이 '${currentPermissionRoleValue}'로 적용되었습니다.`);
    if (typeof renderPmScheduleDashboard === "function") renderPmScheduleDashboard();
    window.dispatchEvent(new CustomEvent("permissionRole:changed", {
      detail: {
        role: currentPermissionRoleValue,
        employeeId: currentPermissionEmployeeId,
        permissions: getPermissionRecord(currentPermissionEmployeeId)
      }
    }));
    if (typeof profitAnalysisModule !== "undefined") {
      profitAnalysisModule.setRoleFromPermission?.(currentPermissionRoleValue);
      if (document.getElementById("profitAnalysis")?.classList.contains("active")) profitAnalysisModule.render?.();
    }
  }

  window.selectPermissionEmployee = function(empNo, options = {}) {
    const emp = permissionEmployee(empNo);
    if (!emp) return;
    currentPermissionEmployeeId = emp.empNo;
    const record = getPermissionRecord(emp.empNo);
    setPermissionRole(record.role || permissionRoleTextForEmployee(emp), { silentToast: options.silentToast });
    if (options.closeDropdown !== false) {
      document.getElementById("permissionDropdown")?.classList.remove("open");
      document.querySelector(".permission-user-btn")?.setAttribute("aria-expanded", "false");
    }
    renderPermissionRoleDropdown();
    renderEmployeePermissionConsole();
  };

  const previousSelectPermissionRole = typeof selectPermissionRole === "function" ? selectPermissionRole : null;
  selectPermissionRole = function(role) {
    const record = getPermissionRecord(currentPermissionEmployeeId);
    record.role = role;
    record.updatedAt = new Date().toISOString();
    persistEmployeePermissionSettings();
    setPermissionRole(role);
    document.getElementById("permissionDropdown")?.classList.remove("open");
    document.querySelector(".permission-user-btn")?.setAttribute("aria-expanded", "false");
    renderPermissionRoleDropdown();
    renderEmployeePermissionConsole();
    if (!previousSelectPermissionRole) return;
  };

  renderPermissionRoleDropdown = function renderEmployeePermissionRoleDropdown() {
    const list = document.getElementById("permissionRoleList");
    const label = document.getElementById("currentPermissionRole");
    const emp = permissionEmployee();
    if (label) label.textContent = `권한: ${currentPermissionRoleValue}`;
    if (!list) return;
    const groups = ["CON-COST", "Viet QS"];
    list.innerHTML = `
      <div class="permission-dropdown-active">
        <strong>${permissionHtml(emp ? permissionDisplayName(emp) : "직원 선택")}</strong>
        <span>${permissionHtml(emp ? `${emp.company} · ${emp.dept} · ${emp.grade}` : "")}</span>
      </div>
      ${groups.map(company => {
        const rows = (employees || []).filter(item => item.company === company);
        return `<div class="permission-dropdown-group">
          <b>${company}</b>
          ${rows.map(item => {
            const record = getPermissionRecord(item.empNo);
            return `<button
              type="button"
              class="permission-role-btn permission-employee-role-btn ${item.empNo === currentPermissionEmployeeId ? "active" : ""}"
              onclick="selectPermissionEmployee('${permissionHtml(item.empNo)}')"
            >
              <span>${permissionHtml(permissionDisplayName(item))}</span>
              <small>${permissionHtml(item.dept)} · ${permissionHtml(item.grade)} · ${permissionHtml(record.role)}</small>
            </button>`;
          }).join("")}
        </div>`;
      }).join("")}
    `;
    const nameLabel = document.getElementById("currentUserName");
    if (nameLabel && emp) nameLabel.textContent = `${permissionDisplayName(emp)} ${emp.grade || ""}`.trim();
  };

  function filteredPermissionEmployees() {
    const keyword = String(document.getElementById("permissionEmployeeSearch")?.value || "").trim().toLowerCase();
    return (employees || []).filter(emp => {
      if (permissionCompanyFilter !== "all" && emp.company !== permissionCompanyFilter) return false;
      if (!keyword) return true;
      const haystack = [permissionDisplayName(emp), emp.empNo, emp.company, emp.dept, emp.grade, emp.position, emp.id].join(" ").toLowerCase();
      return haystack.includes(keyword);
    });
  }

  function renderPermissionCompanyTabs() {
    const target = document.getElementById("permissionCompanyTabs");
    if (!target) return;
    const tabs = [
      ["all", "전체"],
      ["CON-COST", "CON-COST"],
      ["Viet QS", "Viet QS"]
    ];
    target.innerHTML = tabs.map(([key, label]) => `
      <button type="button" class="${permissionCompanyFilter === key ? "active" : ""}" onclick="setPermissionCompanyFilter('${key}')">${label}</button>
    `).join("");
  }

  window.setPermissionCompanyFilter = function(key) {
    permissionCompanyFilter = key || "all";
    renderEmployeePermissionConsole();
  };

  function renderPermissionEmployeeList() {
    const target = document.getElementById("permissionEmployeeList");
    const count = document.getElementById("permissionEmployeeCount");
    if (!target) return;
    const rows = filteredPermissionEmployees();
    if (count) count.textContent = `${(employees || []).length}명`;
    target.innerHTML = rows.map(emp => {
      const record = getPermissionRecord(emp.empNo);
      return `<button type="button" class="permission-employee-card ${emp.empNo === currentPermissionEmployeeId ? "active" : ""}" onclick="selectPermissionEmployee('${permissionHtml(emp.empNo)}', { closeDropdown:false, silentToast:true })">
        <span class="permission-avatar">${permissionHtml(permissionDisplayName(emp).slice(0, 1))}</span>
        <span class="permission-employee-meta">
          <strong>${permissionHtml(permissionDisplayName(emp))}</strong>
          <small>${permissionHtml(emp.company)} · ${permissionHtml(emp.dept)} · ${permissionHtml(emp.grade)}</small>
          <em>${permissionHtml(record.role)}</em>
        </span>
      </button>`;
    }).join("") || `<div class="permission-empty">검색된 직원이 없습니다.</div>`;
  }

  function renderPermissionSummary() {
    const target = document.getElementById("permissionEditorSummary");
    if (!target) return;
    const emp = permissionEmployee();
    const record = getPermissionRecord();
    const modules = Object.values(record.modules || {});
    const approvedCount = modules.reduce((sum, module) => sum + Object.values(module || {}).filter(Boolean).length, 0);
    target.innerHTML = `
      <div class="permission-person-summary">
        <span class="permission-avatar large">${permissionHtml(emp ? permissionDisplayName(emp).slice(0, 1) : "-")}</span>
        <div>
          <strong>${permissionHtml(emp ? permissionDisplayName(emp) : "직원 선택")}</strong>
          <span>${permissionHtml(emp ? `${emp.company} · ${emp.dept} · ${emp.grade}` : "")}</span>
        </div>
      </div>
      <label class="permission-role-select-wrap">
        <span>적용 권한등급</span>
        <select id="permissionEditorRole" onchange="updateEmployeePermissionRole(this.value)">
          ${getPermissionRoleOptions().map(role => `<option value="${permissionHtml(role)}" ${record.role === role ? "selected" : ""}>${permissionHtml(role)}</option>`).join("")}
        </select>
      </label>
      <div class="permission-summary-kpis">
        <div><b>${permissionCategories.length}</b><span>카테고리</span></div>
        <div><b>${approvedCount}</b><span>허용 항목</span></div>
        <div><b>${permissionActions.length}</b><span>권한 종류</span></div>
      </div>
    `;
  }

  window.updateEmployeePermissionRole = function(role) {
    const record = getPermissionRecord();
    record.role = role;
    record.updatedAt = new Date().toISOString();
    employeePermissionSettings[currentPermissionEmployeeId] = record;
    persistEmployeePermissionSettings();
    setPermissionRole(role, { silentToast: true });
    renderEmployeePermissionConsole();
  };

  function renderPermissionCategoryTabs() {
    const target = document.getElementById("permissionCategoryTabs");
    if (!target) return;
    target.innerHTML = permissionCategories.map(category => `
      <button type="button" class="permission-category-card ${permissionSelectedCategory === category.key ? "active" : ""}" onclick="selectPermissionCategory('${category.key}')">
        <span class="permission-category-thumb">${permissionHtml(category.visual)}</span>
        <strong>${permissionHtml(category.title)}</strong>
        <em>${permissionHtml(category.desc)}</em>
      </button>
    `).join("");
  }

  window.selectPermissionCategory = function(key) {
    permissionSelectedCategory = key || "work";
    renderEmployeePermissionConsole();
  };

  window.updateEmployeePermission = function(moduleKey, action, checked) {
    const record = getPermissionRecord();
    if (!record.modules[moduleKey]) record.modules[moduleKey] = {};
    record.modules[moduleKey][action] = !!checked;
    record.updatedAt = new Date().toISOString();
    persistEmployeePermissionSettings();
    renderEmployeePermissionConsole();
    window.dispatchEvent(new CustomEvent("permissionPolicy:changed", {
      detail: { employeeId: currentPermissionEmployeeId, role: record.role, moduleKey, action, checked: !!checked }
    }));
  };

  function renderPermissionModuleBoard() {
    const target = document.getElementById("permissionModuleBoard");
    if (!target) return;
    const category = permissionCategories.find(item => item.key === permissionSelectedCategory) || permissionCategories[0];
    const record = getPermissionRecord();
    target.innerHTML = category.modules.map(([moduleKey, title, desc]) => {
      const states = record.modules?.[moduleKey] || {};
      const allowed = permissionActions.filter(([action]) => states[action]).length;
      return `<article class="permission-module-card">
        <div class="permission-module-title">
          <div>
            <strong>${permissionHtml(title)}</strong>
            <span>${permissionHtml(desc)}</span>
          </div>
          <em>${allowed}/${permissionActions.length}</em>
        </div>
        <div class="permission-action-grid">
          ${permissionActions.map(([action, label]) => `
            <label class="permission-action-toggle ${states[action] ? "checked" : ""}">
              <input type="checkbox" ${states[action] ? "checked" : ""} onchange="updateEmployeePermission('${permissionHtml(moduleKey)}', '${action}', this.checked)">
              <span>${permissionHtml(label)}</span>
            </label>
          `).join("")}
        </div>
      </article>`;
    }).join("");
  }

  function renderPermissionPreview() {
    const emp = permissionEmployee();
    const category = permissionCategories.find(item => item.key === permissionSelectedCategory) || permissionCategories[0];
    const record = getPermissionRecord();
    const allowedModules = category.modules.filter(([moduleKey]) => {
      const state = record.modules?.[moduleKey] || {};
      return Object.values(state).some(Boolean);
    });
    setText("permissionPreviewCategory", category.title);
    setText("permissionPreviewTitle", category.visual);
    setText("permissionPreviewName", emp ? permissionDisplayName(emp) : "-");
    setText("permissionPreviewRole", record.role || "-");
    const actions = document.getElementById("permissionPreviewActions");
    if (actions) {
      actions.innerHTML = permissionActions.map(([action, label]) => {
        const enabled = category.modules.some(([moduleKey]) => record.modules?.[moduleKey]?.[action]);
        return `<span class="${enabled ? "enabled" : ""}">${permissionHtml(label)}</span>`;
      }).join("");
    }
    const modules = document.getElementById("permissionPreviewModules");
    if (modules) {
      modules.innerHTML = allowedModules.slice(0, 5).map(([, title, desc]) => `
        <div><strong>${permissionHtml(title)}</strong><span>${permissionHtml(desc)}</span></div>
      `).join("") || `<div><strong>허용 모듈 없음</strong><span>권한 토글을 켜면 미리보기에 표시됩니다.</span></div>`;
    }
  }

  window.renderEmployeePermissionConsole = function() {
    if (!document.getElementById("permissionEmployeeList")) return;
    renderPermissionCompanyTabs();
    renderPermissionEmployeeList();
    renderPermissionSummary();
    renderPermissionCategoryTabs();
    renderPermissionModuleBoard();
    renderPermissionPreview();
    renderPermissionRoleDropdown();
  };

  const legacyRenderPermissionRows = renderPermissionRows;
  renderPermissionRows = function renderPermissionRowsWithConsole() {
    const tbody = document.getElementById("permissionBody");
    if (tbody && typeof legacyRenderPermissionRows === "function") legacyRenderPermissionRows();
    renderEmployeePermissionConsole();
  };

  window.saveEmployeePermissionSettings = function() {
    persistEmployeePermissionSettings();
    const record = getPermissionRecord();
    setPermissionRole(record.role, { silentToast: true });
    showToast("직원별 권한 설정이 저장되었습니다.");
  };

  window.resetEmployeePermissionSettings = function() {
    const emp = permissionEmployee();
    if (!emp) return;
    if (!confirm(`${permissionDisplayName(emp)} 권한을 인사카드 기본값으로 복원할까요?`)) return;
    employeePermissionSettings[emp.empNo] = buildDefaultPermissionRecord(emp);
    persistEmployeePermissionSettings();
    selectPermissionEmployee(emp.empNo, { closeDropdown:false, silentToast:true });
    showToast("기본 권한값으로 복원되었습니다.");
  };

  function bootstrapPermissionConsole() {
    const emp = permissionEmployee(currentPermissionEmployeeId);
    if (emp) {
      const record = getPermissionRecord(emp.empNo);
      currentPermissionRoleValue = record.role || permissionRoleTextForEmployee(emp);
      setPermissionRole(currentPermissionRoleValue, { silentToast: true });
    }
    renderEmployeePermissionConsole();
    renderPermissionRoleDropdown();
  }

  document.addEventListener("DOMContentLoaded", bootstrapPermissionConsole);
  setTimeout(bootstrapPermissionConsole, 0);
})();
