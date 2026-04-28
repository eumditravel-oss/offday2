const employees = [
  {
    empNo: "EMP-2018-001",
    name: "박용진",
    id: "yjpark",
    dept: "BIM파트",
    grade: "수석",
    status: "재직",
    join: "2018-04-01",
    eval: "A",
    project: 8,
    email: "yjpark@con-cost.com"
  },
  {
    empNo: "EMP-2021-014",
    name: "김태영",
    id: "tykim",
    dept: "경영지원본부",
    grade: "매니저",
    status: "재직",
    join: "2021-03-15",
    eval: "A-",
    project: 3,
    email: "tykim@con-cost.com"
  },
  {
    empNo: "EMP-2024-033",
    name: "홍길동",
    id: "gdhong",
    dept: "구조·BIM팀",
    grade: "사원",
    status: "재직",
    join: "2024-09-01",
    eval: "B+",
    project: 5,
    email: "gdhong@con-cost.com"
  },
  {
    empNo: "EMP-2020-006",
    name: "이민수",
    id: "mslee",
    dept: "마감팀",
    grade: "팀장",
    status: "휴직",
    join: "2020-02-10",
    eval: "B",
    project: 2,
    email: "mslee@con-cost.com"
  },
  {
    empNo: "EMP-2019-021",
    name: "정하늘",
    id: "hnjung",
    dept: "토목팀",
    grade: "실장",
    status: "퇴사",
    join: "2019-06-20",
    eval: "-",
    project: 0,
    email: "hnjung@con-cost.com"
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

function statusBadge(status) {
  if (status === "재직") return `<span class="badge green">재직</span>`;
  if (status === "휴직") return `<span class="badge yellow">휴직</span>`;
  return `<span class="badge gray">퇴사</span>`;
}

function renderLedger(list = employees) {
  const tbody = document.getElementById("ledgerBody");

  tbody.innerHTML = list.map(emp => `
    <tr>
      <td><div class="emp-photo">${emp.name[0]}</div></td>
      <td>${emp.empNo}</td>
      <td><strong>${emp.name}</strong></td>
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

  box.innerHTML = list.map((emp, index) => `
    <div class="employee-item ${index === 0 ? "active" : ""}" onclick="selectEmployee('${emp.empNo}', this)">
      <div class="emp-photo">${emp.name[0]}</div>
      <div>
        <div class="emp-name">${emp.name}</div>
        <div class="emp-meta">${emp.dept} · ${emp.grade} · ${emp.status}<br>${emp.empNo}</div>
      </div>
    </div>
  `).join("");
}

function selectEmployee(empNo, el) {
  const emp = employees.find(e => e.empNo === empNo);
  if (!emp) return;

  document.querySelectorAll(".employee-item").forEach(item => item.classList.remove("active"));
  if (el) el.classList.add("active");

  document.getElementById("profilePhoto").textContent = emp.name[0];
  document.getElementById("profileName").textContent = emp.name;
  document.getElementById("quickProject").textContent = emp.project;
  document.getElementById("quickGrade").textContent = emp.eval;

  document.getElementById("profileTags").innerHTML = `
    <span class="badge blue">${emp.dept}</span>
    <span class="badge gray">${emp.grade}</span>
    ${statusBadge(emp.status)}
    <span class="badge blue">${emp.join} 입사</span>
    <span class="badge gray">${emp.empNo}</span>
  `;
}

function openCard(empNo) {
  document.querySelector('[data-main="card"]').click();

  setTimeout(() => {
    const items = [...document.querySelectorAll(".employee-item")];
    const targetIndex = employees.findIndex(e => e.empNo === empNo);

    if (items[targetIndex]) {
      selectEmployee(empNo, items[targetIndex]);
    }
  }, 0);
}

function filterEmployees(keyword) {
  const q = keyword.trim().toLowerCase();

  return employees.filter(emp =>
    emp.name.toLowerCase().includes(q) ||
    emp.empNo.toLowerCase().includes(q) ||
    emp.id.toLowerCase().includes(q) ||
    emp.dept.toLowerCase().includes(q) ||
    emp.email.toLowerCase().includes(q)
  );
}

document.getElementById("ledgerSearch").addEventListener("input", e => {
  renderLedger(filterEmployees(e.target.value));
});

document.getElementById("employeeSearch").addEventListener("input", e => {
  renderEmployeeList(filterEmployees(e.target.value));
});

function validateRequired() {
  const activePanel = document.querySelector(".detail-panel.active");
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
  document.getElementById("employeeModal").classList.add("active");
}

function closeModal() {
  document.getElementById("employeeModal").classList.remove("active");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("active");

  setTimeout(() => {
    toast.classList.remove("active");
  }, 2200);
}

document.addEventListener("click", e => {
  const modal = document.getElementById("employeeModal");

  if (e.target === modal) {
    closeModal();
  }
});

renderLedger();
renderEmployeeList();
selectEmployee("EMP-2018-001");
