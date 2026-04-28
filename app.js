const gradeOrder = {
  "대표": 1, "CEO": 1,
  "부사장": 2, "Executive Vice President": 2,
  "상무": 3,
  "본부장": 4, "Director": 4,
  "센터장": 5,
  "General Manager": 6,
  "실장": 7,
  "팀장": 8, "Team Leader": 8,
  "파트장": 9, "Asst. Team Leader": 9,
  "수석": 10,
  "책임": 11,
  "선임": 12,
  "프로": 13,
  "사원": 14, "Staff": 14,
  "입사예정": 99
};

const pageMeta = {
  ledger: ["조직관리 · 사원대장", "조직관리 내 사원대장 화면입니다. 직원 목록, 회사, 부서, 재직상태, 직급순 정렬을 관리합니다."],
  card: ["조직관리 · 인사카드", "경영지원에서 직원 상세 인사정보, 인사변동, 반복정보, 자산, 증명서를 관리합니다."],
  orgManage: ["조직관리 · 조직도 관리", "CON-COST와 Viet QS 조직도를 관리합니다. 초기 등록 후 경영지원에서 수정할 수 있도록 확장하는 화면입니다."],
  analysis: ["조직관리 · 직원증감분석", "입사, 퇴사, 계약만료, 근속연수, 총 경력을 분석합니다."],
  approval: ["조직관리 · 승인관리", "증명서, 첨부파일, 인사정보 변경 승인 요청을 관리합니다."],
  cost: ["비용보고", "비용보고 대분류 화면입니다. 현재는 메뉴 구조 우선 구성 상태입니다."],
  asset: ["자산대장", "자산대장 대분류 화면입니다. 자산 등록, 배정, 반납 상태를 관리합니다."],
  admin: ["관리자 설정", "권한, 정책, 표시 순서, 캘린더 연동 기준을 관리합니다."],
  code: ["관리자 설정 · 코드관리", "관리자 설정 하위 메뉴로 코드값과 표시 순서를 관리합니다."]
};

const peopleSeed = [
  ["EMP-CEO-001","대표이사","", "", "CON-COST","대표이사","대표","대표","재직","2020-01-01"],
  ["EMP-VP-001","부사장","", "", "CON-COST","부사장","부사장","부사장","재직","2020-01-01"],
  ["EMP-MGT-001","이서진","", "", "CON-COST","경영지원본부","상무","상무","재직","2020-01-01"],
  ["EMP-MGT-002","강동균","", "", "CON-COST","경영지원본부","실장","실장","재직","2021-01-01"],
  ["EMP-MGT-003","김영은","", "", "CON-COST","경영지원본부","책임","책임","재직","2021-01-01"],
  ["EMP-MGT-004","김태영","", "", "CON-COST","경영지원본부","선임","선임","재직","2021-01-01"],
  ["EMP-MGT-005","현예은","", "", "CON-COST","경영지원본부","선임","선임","재직","2023-01-01"],

  ["EMP-DEV-001","박용진","", "", "CON-COST","개발 T/F","수석","수석","재직","2018-04-01"],
  ["EMP-DEV-002","탄프엉","Tan Phuong", "탄프엉", "CON-COST","개발 T/F","사원","사원","재직","2024-01-01"],
  ["EMP-DEV-003","고영","", "", "CON-COST","개발 T/F","사원","사원","재직","2024-01-01"],

  ["EMP-QC-001","장범선","Jang Beom Sun", "장범선", "CON-COST","QC","실장","실장","재직","2021-01-01"],
  ["EMP-QC-002","조한빈","Cho Han Bin", "조한빈", "CON-COST","QC","실장","실장","재직","2021-01-01"],

  ["EMP-TECH-001","최영배","Choi Young Bae", "최영배", "CON-COST","기술본부","본부장","본부장","재직","2020-01-01"],
  ["EMP-FIN-001","조한빈","Cho Han Bin", "조한빈", "CON-COST","마감","실장","실장","재직","2021-01-01"],
  ["EMP-FIN-002","김재현","", "", "CON-COST","마감","수석","수석","재직","2021-01-01"],
  ["EMP-FIN-003","성대용","", "", "CON-COST","마감","수석","수석","재직","2021-01-01"],
  ["EMP-FIN-004","양한규","", "", "CON-COST","마감","수석","수석","재직","2021-01-01"],
  ["EMP-FIN-005","원종수","", "", "CON-COST","마감","수석","수석","재직","2022-01-01"],
  ["EMP-FIN-006","송영길","", "", "CON-COST","마감","수석","수석","재직","2022-01-01"],
  ["EMP-FIN-007","이은지","", "", "CON-COST","마감","책임","책임","재직","2023-01-01"],
  ["EMP-FIN-008","남은주","", "", "CON-COST","마감","책임","책임","재직","2023-01-01"],
  ["EMP-FIN-009","송치영","", "", "CON-COST","마감","책임","책임","재직","2023-01-01"],
  ["EMP-FIN-010","임승주","", "", "CON-COST","마감","선임","선임","재직","2024-01-01"],
  ["EMP-FIN-011","박가림","", "", "CON-COST","마감","선임","선임","재직","2024-01-01"],
  ["EMP-FIN-012","임창열","", "", "CON-COST","마감","선임","선임","재직","2024-01-01"],
  ["EMP-FIN-013","김수겸","", "", "CON-COST","마감","프로","프로","재직","2025-01-01"],

  ["EMP-BIM-001","이성희","", "", "CON-COST","BIM 파트","파트장","파트장","재직","2020-01-01"],
  ["EMP-BIM-002","박용진","", "", "CON-COST","BIM 파트","수석","수석","재직","2018-04-01"],

  ["EMP-STC-001","장범선","Jang Beom Sun", "장범선", "CON-COST","구조/토목·조경","실장","실장","재직","2021-01-01"],
  ["EMP-STC-002","신동현","", "", "CON-COST","구조/토목·조경","팀장","팀장","재직","2021-01-01"],
  ["EMP-STC-003","오승균","", "", "CON-COST","토목·조경파트","파트장","파트장","재직","2021-01-01"],
  ["EMP-STC-004","김재원","", "", "CON-COST","구조/토목·조경","수석","수석","재직","2021-01-01"],
  ["EMP-STC-005","이정철","", "", "CON-COST","구조/토목·조경","수석","수석","재직","2021-01-01"],
  ["EMP-STC-006","박수현","", "", "CON-COST","구조/토목·조경","책임","책임","재직","2022-01-01"],
  ["EMP-STC-007","서화원","", "", "CON-COST","구조/토목·조경","책임","책임","재직","2022-01-01"],
  ["EMP-STC-008","양진혁","", "", "CON-COST","구조/토목·조경","프로","프로","재직","2025-01-01"],

  ["EMP-CLAIM-001","이경훈","", "", "CON-COST","클레임센터","센터장","센터장","재직","2020-01-01"],
  ["EMP-CLAIM-002","최영배","Choi Young Bae", "최영배", "CON-COST","클레임센터","본부장","본부장","재직","2020-01-01"],
  ["EMP-CLAIM-003","장범선","Jang Beom Sun", "장범선", "CON-COST","클레임센터","실장","실장","재직","2021-01-01"],
  ["EMP-CLAIM-004","김현수","", "", "CON-COST","클레임센터","기술이사","기술이사","재직","2020-01-01"],
  ["EMP-CLAIM-005","우상진","", "", "CON-COST","클레임센터","기술이사","기술이사","재직","2020-01-01"],

  ["VQS-CEO-001","Hyun Dong Myung","Hyun Dong Myung","현동명","Viet QS","CEO","CEO","CEO","재직","2020-01-01"],
  ["EMP-VP-002","이원희","Lee Won Hee","이원희","Viet QS","Executive","Executive Vice President","Executive Vice President","재직","2020-01-01"],
  ["EMP-TECH-001","최영배","Choi Young Bae","최영배","Viet QS","Structure/Civil","Director","Director","재직","2020-01-01"],

  ["VQS-MGT-001","Lan Phuong","Lan Phuong","프엉","Viet QS","Management Support","General Manager","General Manager","재직","2020-01-01"],
  ["VQS-MGT-002","Thanh Tuyen","Thanh Tuyen","뚜엔","Viet QS","Management Support","Staff","Staff","재직","2023-01-01"],
  ["VQS-MGT-003","Yen Phuong","Yen Phuong","프엉","Viet QS","Management Support","Staff","Staff","재직","2023-01-01"],

  ["EMP-FIN-001","조한빈","Cho Han Bin","조한빈","Viet QS","Finish","General Manager","General Manager","재직","2021-01-01"],
  ["EMP-QC-001","장범선","Jang Beom Sun","장범선","Viet QS","Civil","General Manager","General Manager","재직","2021-01-01"],

  ["VQS-FIN-001","Van Dung","Van Dung","융","Viet QS","Internal 1","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-FIN-002","Huyen Thu","Huyen Thu","투","Viet QS","Internal 2","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-FIN-003","Dinh Phi","Dinh Phi","피","Viet QS","Internal 3","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-FIN-004","Van Tung","Van Tung","뚱","Viet QS","Partition&Opening","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-FIN-005","Thi Thao","Thi Thao","타오","Viet QS","Partition&Opening","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-FIN-006","Nhut Duy","Nhut Duy","유이","Viet QS","External","Team Leader","Team Leader","재직","2023-01-01"],

  ["VQS-STR-001","Anh Tuan","Anh Tuan","뚜언","Viet QS","Vertical","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-STR-002","Danh Xuan","Danh Xuan","짠 수언","Viet QS","Vertical","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-STR-003","Van Toan","Van Toan","또안","Viet QS","Horizon/Foundation","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-STR-004","Thien Ngan","Thien Ngan","티엔 응언","Viet QS","Horizon/Foundation","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-STR-005","Huu Thai","Huu Thai","휴 타이","Viet QS","Horizon/Foundation","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-STR-006","Sy Dan","Sy Dan","단","Viet QS","Horizon/Foundation","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-STR-007","Thanh Phong","Thanh Phong","퐁","Viet QS","Horizon/Foundation","Team Leader","Team Leader","재직","2023-01-01"],
  ["VQS-DEV-001","Thanh Phuong","Thanh Phuong","탄 프엉","Viet QS","Development","Team Leader","Team Leader","재직","2023-01-01"]
];

const employeeMap = new Map();

peopleSeed.forEach(row => {
  const [empNo, name, localName, koreanName, company, dept, grade, position, status, join] = row;
  if (!employeeMap.has(empNo)) {
    employeeMap.set(empNo, {
      empNo,
      name,
      localName,
      koreanName,
      id: empNo.toLowerCase().replaceAll("-", ""),
      company,
      companies: [company],
      dept,
      grade,
      position,
      status,
      join,
      endDate: "",
      eval: "권한",
      project: Math.floor(Math.random() * 9),
      email: `${empNo.toLowerCase().replaceAll("-", "")}@con-cost.com`,
      phoneCountry: company === "Viet QS" ? "VN" : "KR",
      phone: company === "Viet QS" ? "0987-654-321" : "010-0000-0000",
      idCountry: company === "Viet QS" ? "VN" : "KR",
      nationalId: company === "Viet QS" ? "0792123456123" : "990301-1111111",
      birthday: "",
      wedding: "",
      nationality: company === "Viet QS" ? "베트남" : "대한민국",
      workplace: company === "Viet QS" ? "베트남 지사" : "서울 본사",
      address: "",
      emergency: "",
      externalCareerMonths: 0,
      usedLeave: "-",
      otTotal: "-",
      mainOtProject: "-",
      orgPath: `${company} > ${dept}`,
      reportLine: "",
      pmRole: "미사용",
      multiDept: "-",
      audit: {
        basic: "초기 조직도 등록 / 추후 경영지원 편집 가능",
        detail: "더미 인사카드 생성"
      },
      histories: {
        join: [{ type: "초기등록", before: "-", after: status, date: join, reason: "조직도 초기 세팅", manager: "경영지원" }],
        org: [{ type: "조직도", before: "-", after: `${company} > ${dept}`, date: "2026-04-28", reason: "조직도 반영", manager: "경영지원" }],
        leave: []
      },
      repeat: [],
      worklogs: [],
      files: []
    });
  } else {
    const emp = employeeMap.get(empNo);
    if (!emp.companies.includes(company)) emp.companies.push(company);
    emp.multiDept = emp.multiDept === "-" ? `${company} > ${dept}` : `${emp.multiDept} / ${company} > ${dept}`;
  }
});

const employees = Array.from(employeeMap.values());

const orgNodes = {
  "CON-COST": [
    { group: "대표/임원", members: [
      ["EMP-CEO-001","대표이사","dark"],
      ["EMP-VP-001","부사장","mid"],
      ["공사비닷컴","공사비닷컴","gray"]
    ]},
    { group: "경영지원본부", members: ["EMP-MGT-001","EMP-MGT-002","EMP-MGT-003","EMP-MGT-004","EMP-MGT-005"] },
    { group: "개발 T/F", members: ["EMP-DEV-001","EMP-DEV-002","EMP-DEV-003"] },
    { group: "QC", members: ["EMP-QC-001","EMP-QC-002"] },
    { group: "기술본부", members: ["EMP-TECH-001"] },
    { group: "마감", members: ["EMP-FIN-001","EMP-FIN-002","EMP-FIN-003","EMP-FIN-004","EMP-FIN-005","EMP-FIN-006","EMP-FIN-007","EMP-FIN-008","EMP-FIN-009","EMP-FIN-010","EMP-FIN-011","EMP-FIN-012","EMP-FIN-013"] },
    { group: "BIM 파트", members: ["EMP-BIM-001","EMP-BIM-002"] },
    { group: "구조/토목·조경", members: ["EMP-STC-001","EMP-STC-002","EMP-STC-003","EMP-STC-004","EMP-STC-005","EMP-STC-006","EMP-STC-007","EMP-STC-008"] },
    { group: "클레임센터", members: ["EMP-CLAIM-001","EMP-CLAIM-002","EMP-CLAIM-003","EMP-CLAIM-004","EMP-CLAIM-005"] }
  ],
  "Viet QS": [
    { group: "CEO / Executive", members: ["VQS-CEO-001","EMP-VP-002","EMP-TECH-001"] },
    { group: "Management Support", members: ["VQS-MGT-001","VQS-MGT-002","VQS-MGT-003"] },
    { group: "Finish", members: ["EMP-FIN-001","VQS-FIN-001","VQS-FIN-002","VQS-FIN-003","VQS-FIN-004","VQS-FIN-005","VQS-FIN-006"] },
    { group: "Structure/Civil", members: ["EMP-QC-001","VQS-STR-001","VQS-STR-002","VQS-STR-003","VQS-STR-004","VQS-STR-005","VQS-STR-006","VQS-STR-007"] },
    { group: "Development", members: ["VQS-DEV-001"] }
  ]
};

const assetLedger = [
  { category: "노트북", name: "LG Gram", code: "AS-2026-001", owner: "박용진", date: "2026-01-05", status: "사용중" },
  { category: "라이선스", name: "AutoCAD", code: "LIC-2026-018", owner: "박용진", date: "2026-01-01", status: "사용중" }
];

const permissionRows = [
  ["기본정보", "보기/수정", "보기/수정", "보기", "본인 수정", "일부 공개"],
  ["상세정보", "보기/수정", "보기/수정", "일부 보기", "본인 수정", "비공개"],
  ["평가/연봉", "보기", "보기", "비공개", "비공개", "비공개"],
  ["조직도 관리", "보기", "보기/수정", "보기", "비공개", "비공개"]
];

let selectedEmployeeId = employees[0].empNo;
let currentSortKey = "gradeOrder";
let sortDirection = 1;

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setFormValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function displayName(emp) {
  if (emp.company === "Viet QS" && emp.koreanName) return `${emp.localName || emp.name}(${emp.koreanName})`;
  if (emp.localName && emp.koreanName) return `${emp.localName}(${emp.koreanName})`;
  return emp.name;
}

function statusBadge(status) {
  const map = {
    "입사예정": "blue", "재직": "green", "휴직": "yellow", "퇴사예정": "yellow", "퇴사": "gray", "계약만료": "gray", "입사취소": "red"
  };
  return `<span class="badge ${map[status] || "gray"}">${status}</span>`;
}

function companyBadge(company, emp) {
  if (emp && emp.companies && emp.companies.length > 1) return `<span class="company-chip shared">겸직/중복</span>`;
  const cls = company === "Viet QS" ? "vietqs" : "concost";
  return `<span class="company-chip ${cls}">${company}</span>`;
}

function monthDiff(start, end = new Date()) {
  if (!start) return 0;
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(0, (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()));
}

function formatMonths(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}개월`;
  if (m === 0) return `${y}년`;
  return `${y}년 ${m}개월`;
}

function switchPanel(panelId) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".side-main, .side-item").forEach(b => b.classList.remove("active"));

  document.getElementById(panelId)?.classList.add("active");

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

    if (panelId) switchPanel(panelId);
  });
});

document.querySelectorAll(".side-item").forEach(btn => {
  btn.addEventListener("click", () => switchPanel(btn.dataset.main));
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
  setText("kpiConcost", employees.filter(e => e.companies.includes("CON-COST")).length);
  setText("kpiVietqs", employees.filter(e => e.companies.includes("Viet QS")).length);
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
  currentSortKey === key ? sortDirection *= -1 : (currentSortKey = key, sortDirection = 1);
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
      <td>${companyBadge(emp.company, emp)}</td>
      <td>${emp.id}</td>
      <td>${emp.dept}</td>
      <td>${emp.grade}</td>
      <td>${statusBadge(emp.status)}</td>
      <td>${emp.join}</td>
      <td>${emp.project}</td>
      <td><button class="btn btn-line" onclick="openCard('${emp.empNo}')">상세</button></td>
    </tr>
  `).join("");
}

function renderEmployeeList(list = employees) {
  const box = document.getElementById("employeeList");
  if (!box) return;

  box.innerHTML = list.map(emp => `
    <div class="employee-item ${emp.empNo === selectedEmployeeId ? "active" : ""}" onclick="selectEmployee('${emp.empNo}', this)">
      <div class="emp-photo">${displayName(emp)[0]}</div>
      <div>
        <div class="emp-name">${displayName(emp)}</div>
        <div class="emp-meta">${emp.companies.join(" / ")} · ${emp.dept} · ${emp.grade}<br>${emp.empNo}</div>
      </div>
    </div>
  `).join("");
}

function selectEmployee(empNo, el) {
  const emp = employees.find(e => e.empNo === empNo);
  if (!emp) return;

  selectedEmployeeId = empNo;

  document.querySelectorAll(".employee-item").forEach(item => item.classList.remove("active"));
  if (el) el.classList.add("active");

  setText("profilePhoto", displayName(emp)[0]);
  setText("profileName", displayName(emp));
  setText("quickTenure", formatMonths(monthDiff(emp.join)));
  setText("quickCareer", formatMonths(monthDiff(emp.join) + emp.externalCareerMonths));
  setText("quickProject", emp.project);
  setText("quickGrade", emp.eval);

  const profileTags = document.getElementById("profileTags");
  if (profileTags) {
    profileTags.innerHTML = `
      ${companyBadge(emp.company, emp)}
      <span class="badge blue">${emp.dept}</span>
      <span class="badge gray">${emp.grade}</span>
      ${statusBadge(emp.status)}
      <span class="badge blue">${emp.join} 입사</span>
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
  tbody.innerHTML = emp.repeat.length ? emp.repeat.map(row => `
    <tr><td>${row.type}</td><td>${row.content}</td><td>${row.start}</td><td>${row.end}</td><td>${row.period}</td><td>${row.file}</td><td>${row.note}</td></tr>
  `).join("") : `<tr><td colspan="7">등록된 반복 정보가 없습니다.</td></tr>`;
}

function renderEmployeeAssets(emp) {
  const tbody = document.getElementById("employeeAssetBody");
  if (!tbody) return;

  const assets = assetLedger.filter(a => a.owner === emp.name || a.owner === emp.localName || a.owner === displayName(emp));
  tbody.innerHTML = assets.length ? assets.map(a => `
    <tr><td>${a.category}</td><td>${a.name}</td><td>${a.code}</td><td>${a.date}</td><td>-</td><td><span class="badge green">${a.status}</span></td></tr>
  `).join("") : `<tr><td colspan="6">배정된 자산이 없습니다.</td></tr>`;
}

function renderWorklogs(emp) {
  setText("usedLeave", emp.usedLeave);
  setText("otTotal", emp.otTotal);
  setText("mainOtProject", emp.mainOtProject);

  const tbody = document.getElementById("worklogBody");
  if (!tbody) return;
  tbody.innerHTML = emp.worklogs.length ? emp.worklogs.map(row => `
    <tr><td>${row.date}</td><td>${row.type}</td><td>${row.project}</td><td>${row.time}</td><td>${row.reason}</td><td>${row.approver}</td></tr>
  `).join("") : `<tr><td colspan="6">등록된 업무/야근 이력이 없습니다.</td></tr>`;
}

function renderFiles(emp) {
  const tbody = document.getElementById("fileBody");
  if (!tbody) return;
  tbody.innerHTML = emp.files.length ? emp.files.map(file => `
    <tr><td>${file.type}</td><td>${file.name}</td><td>${file.date}</td><td><span class="badge ${file.status === "승인완료" ? "green" : "yellow"}">${file.status}</span></td><td><button class="btn btn-line">다운로드</button></td><td><button class="btn btn-line">변경신청</button></td></tr>
  `).join("") : `<tr><td colspan="6">등록된 파일이 없습니다.</td></tr>`;
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
    const searchTarget = [emp.name, emp.localName, emp.koreanName, emp.empNo, emp.id, emp.company, emp.companies.join(" "), emp.dept, emp.email].join(" ").toLowerCase();

    return (!q || searchTarget.includes(q)) &&
      (company === "전체" || emp.companies.includes(company)) &&
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
    [emp.name, emp.localName, emp.koreanName, emp.empNo, emp.id, emp.dept, emp.company, emp.email].join(" ").toLowerCase().includes(q)
  );
}

function renderAnalysis() {
  const body = document.getElementById("analysisBody");
  const careerBody = document.getElementById("careerSummaryBody");
  if (!body || !careerBody) return;

  const companies = ["CON-COST", "Viet QS"];
  body.innerHTML = companies.map(company => {
    const target = employees.filter(e => e.companies.includes(company));
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
    return `
      <tr>
        <td>${displayName(emp)}</td>
        <td>${emp.companies.join(" / ")}</td>
        <td>${emp.join}</td>
        <td>${formatMonths(tenureMonths)}</td>
        <td>${formatMonths(emp.externalCareerMonths)}</td>
        <td>${formatMonths(totalCareer)}</td>
        <td>없음</td>
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
    <tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td><td>${row[5]}</td></tr>
  `).join("");
}

function renderOrgManage() {
  const tbody = document.getElementById("orgManageBody");
  if (!tbody) return;

  const rows = [];
  Object.entries(orgNodes).forEach(([company, groups]) => {
    groups.forEach(group => {
      group.members.forEach(item => {
        const empNo = Array.isArray(item) ? item[0] : item;
        if (empNo === "공사비닷컴") {
          rows.push(`<tr><td>공사비닷컴</td><td>공사비닷컴</td><td>-</td><td>외부 연결</td><td>-</td><td>-</td><td><button class="btn btn-line">편집</button></td></tr>`);
          return;
        }
        const emp = employees.find(e => e.empNo === empNo);
        if (!emp) return;
        rows.push(`
          <tr>
            <td>${company}</td>
            <td>${group.group}</td>
            <td>${emp.grade}</td>
            <td>${emp.localName || emp.name}</td>
            <td>${emp.koreanName || "-"}</td>
            <td>${emp.companies.length > 1 ? "하나의 인사카드 사용" : "단일"}</td>
            <td><button class="btn btn-line" onclick="openMiniCardPopup('${emp.empNo}')">보기</button></td>
          </tr>
        `);
      });
    });
  });

  tbody.innerHTML = rows.join("");
}

function renderOrgChart(company = "CON-COST", activeBtn) {
  document.querySelectorAll(".org-tab").forEach(btn => btn.classList.remove("active"));
  if (activeBtn) activeBtn.classList.add("active");

  const area = document.getElementById("orgChartArea");
  if (!area) return;

  const groups = orgNodes[company];
  const date = company === "CON-COST" ? "2026. 4. 9." : "2026. 04.07";

  area.innerHTML = `
    <div class="org-chart">
      <div class="org-date">${date}</div>
      <div class="org-title">${company === "CON-COST" ? "(주)컨코스트 조직도" : "Viet QS Organization Chart"}</div>
      <div class="org-branch-grid ${company === "Viet QS" ? "wide" : ""}">
        ${groups.map(group => `
          <div class="org-card">
            <h3>${group.group}</h3>
            <div class="org-list ${group.members.length > 6 ? "compact" : ""}">
              ${group.members.map(item => renderOrgMember(item, company)).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderOrgMember(item, company) {
  if (Array.isArray(item)) {
    const [label, title, cls] = item;
    if (label === "공사비닷컴") return `<button class="org-node ${cls || ""}" onclick="showToast('공사비닷컴 연결 조직입니다.')">${title}</button>`;
    const emp = employees.find(e => e.empNo === label);
    return renderOrgEmployee(emp, cls);
  }

  const emp = employees.find(e => e.empNo === item);
  return renderOrgEmployee(emp, company === "Viet QS" ? "viet" : "");
}

function renderOrgEmployee(emp, cls = "") {
  if (!emp) return "";
  return `
    <button class="org-node ${cls}" onclick="openMiniCardPopup('${emp.empNo}')">
      ${emp.grade}<br>
      ${emp.localName || emp.name}<br>
      <small>${emp.koreanName || ""}</small>
    </button>
  `;
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

function openModal() { document.getElementById("employeeModal")?.classList.add("active"); }
function closeModal() { document.getElementById("employeeModal")?.classList.remove("active"); }
function openExcelModal() { document.getElementById("excelModal")?.classList.add("active"); }
function closeExcelModal() { document.getElementById("excelModal")?.classList.remove("active"); }
function openPermissionModal() { document.getElementById("permissionModal")?.classList.add("active"); }
function closePermissionModal() { document.getElementById("permissionModal")?.classList.remove("active"); }

function openOrgChart() {
  document.getElementById("orgChartModal")?.classList.add("active");
  renderOrgChart("CON-COST", document.querySelector(".org-tab"));
}

function closeOrgChart() {
  document.getElementById("orgChartModal")?.classList.remove("active");
}

function openMiniCardPopup(empNo) {
  const emp = employees.find(e => e.empNo === empNo);
  if (!emp) return;

  setText("miniPopupPhoto", displayName(emp)[0]);
  setText("miniPopupName", displayName(emp));
  setText("miniPopupCompany", emp.companies.join(" / "));
  setText("miniPopupDept", emp.dept);
  setText("miniPopupGrade", emp.grade);
  setText("miniPopupEmail", emp.email);
  setText("miniPopupPhone", emp.phone);
  setText("miniPopupWorkplace", emp.workplace);

  const tags = document.getElementById("miniPopupTags");
  if (tags) {
    tags.innerHTML = `
      ${companyBadge(emp.company, emp)}
      <span class="badge blue">${emp.dept}</span>
      <span class="badge gray">${emp.grade}</span>
      ${statusBadge(emp.status)}
    `;
  }

  document.getElementById("miniCardModal")?.classList.add("active");
}

function closeMiniCardPopup() {
  document.getElementById("miniCardModal")?.classList.remove("active");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("active");
  setTimeout(() => toast.classList.remove("active"), 2200);
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

  input.addEventListener("input", () => {
    input.value = formatPhoneByCountry(input.value, country.value);
  });

  country.addEventListener("change", () => {
    input.value = "";
    input.placeholder = country.value === "VN" ? "0987-654-321" : "010-1234-5678";
  });
}

function formatNationalId(value, country) {
  const digits = value.replace(/\D/g, "");
  if (country === "VN") return digits.slice(0, 13);
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 6)}-${digits.slice(6, 13)}`;
}

function bindNationalIdFormatter() {
  const input = document.getElementById("nationalId");
  const country = document.getElementById("idCountry");
  if (!input || !country) return;

  input.addEventListener("input", () => {
    input.value = formatNationalId(input.value, country.value);
  });

  country.addEventListener("change", () => {
    input.value = "";
    input.placeholder = country.value === "VN" ? "0792123456123" : "990301-1111111";
  });
}

document.addEventListener("click", e => {
  const employeeModal = document.getElementById("employeeModal");
  const permissionModal = document.getElementById("permissionModal");
  const excelModal = document.getElementById("excelModal");
  const orgChartModal = document.getElementById("orgChartModal");
  const miniCardModal = document.getElementById("miniCardModal");

  if (e.target === employeeModal) closeModal();
  if (e.target === permissionModal) closePermissionModal();
  if (e.target === excelModal) closeExcelModal();
  if (e.target === orgChartModal) closeOrgChart();
  if (e.target === miniCardModal) closeMiniCardPopup();
});

document.querySelectorAll(".switch-toggle input").forEach(toggle => {
  toggle.addEventListener("change", () => showToast("관리자 설정값이 변경되었습니다. 저장 버튼을 눌러 반영하세요."));
});

document.querySelectorAll(".permission-field, .permission-text, .permission-card").forEach(el => {
  el.addEventListener("click", openPermissionModal);
});

const ledgerSearch = document.getElementById("ledgerSearch");
if (ledgerSearch) {
  ledgerSearch.addEventListener("input", e => renderLedger(filterEmployees(e.target.value)));
}

["companyFilter", "deptFilter", "gradeFilter", "statusFilter", "yearFilter"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", () => applyLedgerFilters(false));
});

const employeeSearch = document.getElementById("employeeSearch");
if (employeeSearch) {
  employeeSearch.addEventListener("input", e => renderEmployeeList(filterEmployeesForList(e.target.value)));
}

bindPhoneFormatter("#phoneInput", "#phoneCountry");
bindNationalIdFormatter();

renderKpis();
renderLedger(filterEmployees(""));
renderEmployeeList();
renderAnalysis();
renderAssetLedger();
renderPermissionRows();
renderOrgManage();
selectEmployee("EMP-DEV-001");
