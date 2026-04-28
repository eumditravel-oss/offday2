const employees = [
  {
    empNo: "EMP-2018-001",
    name: "박용진",
    localName: "",
    koreanName: "",
    id: "yjpark",
    company: "CON-COST",
    dept: "BIM파트",
    grade: "수석",
    position: "파트 담당",
    status: "재직",
    join: "2018-04-01",
    endDate: "",
    eval: "A",
    project: 8,
    email: "yjpark@con-cost.com",
    phoneCountry: "KR",
    phone: "010-7700-7859",
    idCountry: "KR",
    nationalId: "990301-1111111",
    birthday: "1992-02-23",
    wedding: "",
    nationality: "대한민국",
    workplace: "서울 본사",
    histories: {
      join: [
        { type: "입사", before: "-", after: "재직", date: "2018-04-01", reason: "신규 입사", manager: "경영지원" }
      ],
      org: [
        { type: "부서", before: "구조팀", after: "BIM파트", date: "2026-04-01", reason: "조직개편", manager: "경영지원" },
        { type: "직급", before: "선임", after: "수석", date: "2025-01-01", reason: "정기승급", manager: "경영지원" }
      ],
      leave: [
        { type: "병가", before: "정상근무", after: "병가 3일", date: "2024-06-10", reason: "진단서 제출", manager: "경영지원" }
      ]
    }
  },
  {
    empNo: "EMP-2021-014",
    name: "김철수",
    localName: "",
    koreanName: "",
    id: "chkim",
    company: "CON-COST",
    dept: "경영지원본부",
    grade: "매니저",
    position: "관리",
    status: "재직",
    join: "2021-03-15",
    endDate: "",
    eval: "A-",
    project: 3,
    email: "chkim@con-cost.com",
    phoneCountry: "KR",
    phone: "010-1111-2222",
    idCountry: "KR",
    nationalId: "900101-1234567",
    birthday: "1990-01-01",
    wedding: "2020-05-20",
    nationality: "대한민국",
    workplace: "서울 본사",
    histories: {
      join: [{ type: "입사", before: "-", after: "재직", date: "2021-03-15", reason: "신규 입사", manager: "경영지원" }],
      org: [{ type: "직책", before: "사원", after: "매니저", date: "2024-01-01", reason: "승진", manager: "경영지원" }],
      leave: []
    }
  },
  {
    empNo: "VQS-2024-033",
    name: "Nguyen Van An",
    localName: "Nguyen Van An",
    koreanName: "응우옌반안",
    id: "annguyen",
    company: "Viet QS",
    dept: "Viet QS 구조팀",
    grade: "사원",
    position: "산출 담당",
    status: "재직",
    join: "2024-09-01",
    endDate: "",
    eval: "B+",
    project: 5,
    email: "an.nguyen@vietqs.com",
    phoneCountry: "VN",
    phone: "0987-654-321",
    idCountry: "VN",
    nationalId: "0792123456123",
    birthday: "1997-12-12",
    wedding: "",
    nationality: "베트남",
    workplace: "베트남 지사",
    histories: {
      join: [{ type: "입사", before: "-", after: "재직", date: "2024-09-01", reason: "Viet QS 신규 채용", manager: "HR Manager" }],
      org: [{ type: "소속", before: "-", after: "Viet QS 구조팀", date: "2024-09-01", reason: "초기 배치", manager: "HR Manager" }],
      leave: []
    }
  },
  {
    empNo: "EMP-2026-002",
    name: "이민수",
    localName: "",
    koreanName: "",
    id: "mslee",
    company: "CON-COST",
    dept: "마감팀",
    grade: "입사예정",
    position: "팀원",
    status: "입사예정",
    join: "2026-05-01",
    endDate: "",
    eval: "-",
    project: 0,
    email: "mslee@con-cost.com",
    phoneCountry: "KR",
    phone: "010-3333-4444",
    idCountry: "KR",
    nationalId: "",
    birthday: "",
    wedding: "",
    nationality: "대한민국",
    workplace: "서울 본사",
    histories: {
      join: [{ type: "입사예정", before: "-", after: "입사예정", date: "2026-04-27", reason: "채용 확정", manager: "경영지원" }],
      org: [],
      leave: []
    }
  },
  {
    empNo: "VQS-2023-021",
    name: "Tran Thi Mai",
    localName: "Tran Thi Mai",
    koreanName: "쩐티마이",
    id: "maitran",
    company: "Viet QS",
    dept: "Viet QS 구조팀",
    grade: "팀장",
    position: "팀장",
    status: "계약만료",
    join: "2023-01-10",
    endDate: "2026-01-09",
    eval: "B",
    project: 2,
    email: "mai.tran@vietqs.com",
    phoneCountry: "VN",
    phone: "0912-345-678",
    idCountry: "VN",
    nationalId: "0791987654321",
    birthday: "1991-03-03",
    wedding: "2018-11-11",
    nationality: "베트남",
    workplace: "베트남 지사",
    histories: {
      join: [{ type: "계약만료", before: "재직", after: "계약만료", date: "2026-01-09", reason: "계약기간 종료", manager: "HR Manager" }],
      org: [{ type: "직책", before: "팀원", after: "팀장", date: "2024-06-01", reason: "업무역량 평가", manager: "HR Manager" }],
      leave: [{ type: "무급휴직", before: "정상근무", after: "무급휴직 14일", date: "2025-08-01", reason: "개인 사유", manager: "HR Manager" }]
    }
  }
];

const mainTabs = document.querySelectorAll(".menu-tab");
const panels = document.querySelectorAll(".panel");

mainTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    mainTabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.main).classList.add("active");
  });
});

const detailTabs = document.querySelectorAll(".inner-tab");
const detailPanels = document.querySelectorAll(".detail-panel");

detailTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    detailTabs.forEach(t => t.classList.remove("active"));
    detailPanels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.detail).classList.add("active");
  });
});

function displayName(emp) {
  if (emp.company === "Viet QS" && emp.koreanName) {
    return `${emp.localName || emp.name}(${emp.koreanName})`;
  }
  return emp.name;
}

function statusBadge(status) {
  const map = {
    "입사예정": "blue",
    "재직": "green",
    "휴직": "yellow",
    "퇴사예정": "yellow",
    "퇴사": "gray",
    "계약만료": "gray",
    "입사취소": "red"
  };

  return `<span class="badge ${map[status] || "gray"}">${status}</span>`;
}

function companyBadge(company) {
  const cls = company === "Viet QS" ? "vietqs" : "concost";
  return `<span class="company-chip ${cls}">${company}</span>`;
}

function renderKpis() {
  const total = employees.length;
  const concost = employees.filter(e => e.company === "CON-COST").length;
  const vietqs = employees.filter(e => e.company === "Viet QS").length;
  const active = employees.filter(e => e.status === "재직").length;
  const expected = employees.filter(e => e.status === "입사예정").length;

  setText("kpiTotal", total);
  setText("kpiConcost", concost);
  setText("kpiVietqs", vietqs);
  setText("kpiActive", active);
  setText("kpiExpected", expected);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderLedger(list = employees) {
  const tbody = document.getElementById("ledgerBody");
  if (!tbody) return;

  tbody.innerHTML = list.map(emp => `
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

  box.innerHTML = list.map((emp, index) => `
    <div class="employee-item ${index === 0 ? "active" : ""}" onclick="selectEmployee('${emp.empNo}', this)">
      <div class="emp-photo">${displayName(emp)[0]}</div>
      <div>
        <div class="emp-name">${displayName(emp)}</div>
        <div class="emp-meta">${emp.company} · ${emp.dept} · ${emp.grade} · ${emp.status}<br>${emp.empNo}</div>
      </div>
    </div>
  `).join("");
}

function selectEmployee(empNo, el) {
  const emp = employees.find(e => e.empNo === empNo);
  if (!emp) return;

  document.querySelectorAll(".employee-item").forEach(item => item.classList.remove("active"));
  if (el) el.classList.add("active");

  setText("profilePhoto", displayName(emp)[0]);
  setText("profileName", displayName(emp));
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
  setFormValue("idCountry", emp.idCountry);
  setFormValue("nationalId", emp.nationalId);
  setFormValue("cardBirthday", emp.birthday);
  setFormValue("cardWedding", emp.wedding);
  setFormValue("cardNationality", emp.nationality);

  renderHistories(emp);
}

function setFormValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
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

function openCard(empNo) {
  const cardTab = document.querySelector('[data-main="card"]');
  if (!cardTab) return;

  cardTab.click();

  setTimeout(() => {
    const items = [...document.querySelectorAll(".employee-item")];
    const targetIndex = employees.findIndex(e => e.empNo === empNo);

    if (items[targetIndex]) {
      selectEmployee(empNo, items[targetIndex]);
    } else {
      selectEmployee(empNo);
    }
  }, 0);
}

function filterEmployees(keyword = "") {
  const q = keyword.trim().toLowerCase();
  const company = document.getElementById("companyFilter")?.value || "전체";
  const dept = document.getElementById("deptFilter")?.value || "전체";
  const grade = document.getElementById("gradeFilter")?.value || "전체";
  const status = document.getElementById("statusFilter")?.value || "재직";
  const year = document.getElementById("yearFilter")?.value || "전체";

  return employees.filter(emp => {
    const searchTarget = [
      emp.name,
      emp.localName,
      emp.koreanName,
      emp.empNo,
      emp.id,
      emp.company,
      emp.dept,
      emp.email
    ].join(" ").toLowerCase();

    const matchKeyword = !q || searchTarget.includes(q);
    const matchCompany = company === "전체" || emp.company === company;
    const matchDept = dept === "전체" || emp.dept === dept;
    const matchGrade = grade === "전체" || emp.grade === grade;
    const matchStatus = status === "전체" || emp.status === status;
    const matchYear = year === "전체" || emp.join.startsWith(year);

    return matchKeyword && matchCompany && matchDept && matchGrade && matchStatus && matchYear;
  });
}

function applyLedgerFilters() {
  const keyword = document.getElementById("ledgerSearch")?.value || "";
  renderLedger(filterEmployees(keyword));
  showToast("검색 조건이 적용되었습니다.");
}

const ledgerSearch = document.getElementById("ledgerSearch");
if (ledgerSearch) {
  ledgerSearch.addEventListener("input", e => {
    renderLedger(filterEmployees(e.target.value));
  });
}

["companyFilter", "deptFilter", "gradeFilter", "statusFilter", "yearFilter"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", applyLedgerFilters);
});

const employeeSearch = document.getElementById("employeeSearch");
if (employeeSearch) {
  employeeSearch.addEventListener("input", e => {
    renderEmployeeList(filterEmployeesForList(e.target.value));
  });
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

  if (valid) {
    showToast("필수 입력값 검증 완료. 저장 처리 예시입니다.");
  } else {
    showToast("* 필수 입력값을 확인해 주세요.");
  }
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
  const modal = document.getElementById("employeeModal");
  if (modal) modal.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("employeeModal");
  if (modal) modal.classList.remove("active");
}

function openPermissionModal() {
  const modal = document.getElementById("permissionModal");
  if (modal) modal.classList.add("active");
}

function closePermissionModal() {
  const modal = document.getElementById("permissionModal");
  if (modal) modal.classList.remove("active");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("active");

  setTimeout(() => {
    toast.classList.remove("active");
  }, 2200);
}

function formatPhoneByCountry(value, country) {
  const digits = value.replace(/\D/g, "");

  if (country === "VN") {
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7, 10)}`;
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

function bindPhoneFormatter(inputSelector, countrySelector) {
  const input = document.querySelector(inputSelector);
  const country = document.querySelector(countrySelector);

  if (!input || !country) return;

  const apply = () => {
    input.value = formatPhoneByCountry(input.value, country.value);
  };

  input.addEventListener("input", apply);
  country.addEventListener("change", () => {
    input.value = "";
    input.placeholder = country.value === "VN" ? "0987-654-321" : "010-1234-5678";
  });
}

function formatNationalId(value, country) {
  const digits = value.replace(/\D/g, "");

  if (country === "VN") {
    return digits.slice(0, 13);
  }

  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 6)}-${digits.slice(6, 13)}`;
}

function bindNationalIdFormatter() {
  const input = document.getElementById("nationalId");
  const country = document.getElementById("idCountry");

  if (!input || !country) return;

  const apply = () => {
    input.value = formatNationalId(input.value, country.value);
  };

  input.addEventListener("input", apply);
  country.addEventListener("change", () => {
    input.value = "";
    input.placeholder = country.value === "VN" ? "0792123456123" : "990301-1111111";
  });
}

document.addEventListener("click", e => {
  const employeeModal = document.getElementById("employeeModal");
  const permissionModal = document.getElementById("permissionModal");

  if (e.target === employeeModal) closeModal();
  if (e.target === permissionModal) closePermissionModal();
});

document.querySelectorAll(".admin-edit-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    showToast("정책 편집 화면 예시입니다.");
  });
});

document.querySelectorAll(".switch-toggle input").forEach(toggle => {
  toggle.addEventListener("change", () => {
    showToast("관리자 설정값이 변경되었습니다. 저장 버튼을 눌러 반영하세요.");
  });
});

document.querySelectorAll(".permission-field, .permission-text").forEach(el => {
  el.addEventListener("click", openPermissionModal);
});

bindPhoneFormatter("#phoneInput", "#phoneCountry");
bindPhoneFormatter(".modal-phone-input", ".modal-phone-country");
bindNationalIdFormatter();

renderKpis();
renderLedger(filterEmployees(""));
renderEmployeeList();
selectEmployee("EMP-2018-001");
