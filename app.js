const gradeOrder = {
  "대표": 1,
  "부사장": 2,
  "상무": 3,
  "센터장": 4,
  "본부장": 5,
  "실장": 6,
  "팀장": 7,
  "수석": 8,
  "매니저": 9,
  "사원": 10,
  "입사예정": 99
};

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
    address: "서울특별시 강북구",
    emergency: "010-0000-0000",
    externalCareerMonths: 24,
    usedLeave: "7일",
    otTotal: "18시간",
    mainOtProject: "A-101 BIM 검토",
    orgPath: "경영지원 > BIM파트",
    reportLine: "PM → GM → 본부장",
    pmRole: "사용",
    multiDept: "개발지원 TF",
    audit: {
      basic: "등록자: 경영지원 / 최종수정자: 박용진 / 최종수정일: 2026-04-28 / 수정항목: 휴대폰",
      detail: "등록자: 경영지원 / 최종수정자: 경영지원 / 최종수정일: 2026-04-20 / 수정항목: 신분증번호"
    },
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
    },
    repeat: [
      { type: "학력", content: "대학교 / 전공명", start: "2011-03-01", end: "2015-02-28", period: "4년", file: "졸업증명서.pdf", note: "졸업" },
      { type: "경력", content: "이전 회사 구조팀", start: "2015-03-01", end: "2017-02-28", period: "2년", file: "-", note: "외부경력" },
      { type: "자격증", content: "관련 자격증", start: "2020-01-01", end: "-", period: "-", file: "certificate.pdf", note: "만료일 관리" },
      { type: "부양가족", content: "비상연락 가족", start: "-", end: "-", period: "-", file: "-", note: "단순 관리용" }
    ],
    worklogs: [
      { date: "2026-04-10", type: "야근", project: "A-101 BIM 검토", time: "3시간", reason: "납품 전 QC", approver: "PM" },
      { date: "2026-04-15", type: "야근", project: "A-101 BIM 검토", time: "2시간", reason: "오류 수정", approver: "GM" }
    ],
    files: [
      { type: "근로계약서", name: "contract_park.pdf", date: "2026-01-01", status: "승인완료" },
      { type: "자격증", name: "certificate.pdf", date: "2026-02-03", status: "승인대기" }
    ]
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
    address: "서울특별시",
    emergency: "010-1111-0000",
    externalCareerMonths: 36,
    usedLeave: "5일",
    otTotal: "6시간",
    mainOtProject: "경영지원 세팅",
    orgPath: "경영지원본부",
    reportLine: "본부장",
    pmRole: "미사용",
    multiDept: "-",
    audit: {
      basic: "등록자: 경영지원 / 최종수정자: 김철수 / 최종수정일: 2026-04-21 / 수정항목: 주소",
      detail: "등록자: 경영지원 / 최종수정자: 경영지원 / 최종수정일: 2026-04-21 / 수정항목: 계좌"
    },
    histories: {
      join: [{ type: "입사", before: "-", after: "재직", date: "2021-03-15", reason: "신규 입사", manager: "경영지원" }],
      org: [{ type: "직책", before: "사원", after: "매니저", date: "2024-01-01", reason: "승진", manager: "경영지원" }],
      leave: []
    },
    repeat: [
      { type: "경력", content: "이전 회사 총무팀", start: "2018-01-01", end: "2020-12-31", period: "3년", file: "-", note: "외부경력" }
    ],
    worklogs: [
      { date: "2026-03-12", type: "야근", project: "그룹웨어 검토", time: "2시간", reason: "자료 정리", approver: "본부장" }
    ],
    files: [
      { type: "근로계약서", name: "contract_kim.pdf", date: "2021-03-15", status: "승인완료" }
    ]
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
    address: "Ho Chi Minh",
    emergency: "0987-000-000",
    externalCareerMonths: 12,
    usedLeave: "3일",
    otTotal: "12시간",
    mainOtProject: "VQS-STRUCT-22",
    orgPath: "Viet QS > 구조팀",
    reportLine: "팀장 → 센터장",
    pmRole: "미사용",
    multiDept: "-",
    audit: {
      basic: "등록자: HR Manager / 최종수정자: HR Manager / 최종수정일: 2026-04-22 / 수정항목: 연락처",
      detail: "등록자: HR Manager / 최종수정자: HR Manager / 최종수정일: 2026-04-22 / 수정항목: 신분증번호"
    },
    histories: {
      join: [
        { type: "입사", before: "-", after: "수습", date: "2024-09-01", reason: "Viet QS 신규 채용", manager: "HR Manager" },
        { type: "수습전환", before: "수습", after: "정규직", date: "2024-11-01", reason: "2개월 수습 종료", manager: "HR Manager" }
      ],
      org: [{ type: "소속", before: "-", after: "Viet QS 구조팀", date: "2024-09-01", reason: "초기 배치", manager: "HR Manager" }],
      leave: []
    },
    repeat: [
      { type: "경력", content: "Local QS Office", start: "2023-01-01", end: "2023-12-31", period: "1년", file: "-", note: "외부경력" }
    ],
    worklogs: [
      { date: "2026-04-07", type: "야근", project: "VQS-STRUCT-22", time: "4시간", reason: "납품 대응", approver: "팀장" }
    ],
    files: [
      { type: "신분증", name: "id_an.pdf", date: "2024-09-01", status: "승인완료" }
    ]
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
    address: "",
    emergency: "",
    externalCareerMonths: 0,
    usedLeave: "-",
    otTotal: "-",
    mainOtProject: "-",
    orgPath: "마감팀",
    reportLine: "팀장",
    pmRole: "미사용",
    multiDept: "-",
    audit: {
      basic: "등록자: 경영지원 / 최종수정자: 경영지원 / 최종수정일: 2026-04-27 / 수정항목: 신규등록",
      detail: "등록자: - / 최종수정자: - / 최종수정일: -"
    },
    histories: {
      join: [{ type: "입사예정", before: "-", after: "입사예정", date: "2026-04-27", reason: "채용 확정", manager: "경영지원" }],
      org: [],
      leave: []
    },
    repeat: [],
    worklogs: [],
    files: []
  },
  {
    empNo: "VQS-2023-021",
    name: "Tran Thi Mai",
    localName: "Tran Thi Mai",
    koreanName: "쩐티마이",
    id: "maitran",
    company: "Viet QS",
    dept: "Viet QS 마감1팀",
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
    address: "Ho Chi Minh",
    emergency: "0912-000-000",
    externalCareerMonths: 48,
    usedLeave: "9일",
    otTotal: "0시간",
    mainOtProject: "-",
    orgPath: "Viet QS > 마감1팀",
    reportLine: "센터장",
    pmRole: "사용",
    multiDept: "-",
    audit: {
      basic: "등록자: HR Manager / 최종수정자: HR Manager / 최종수정일: 2026-01-09 / 수정항목: 계약만료",
      detail: "등록자: HR Manager / 최종수정자: HR Manager / 최종수정일: 2025-08-01"
    },
    histories: {
      join: [{ type: "계약만료", before: "재직", after: "계약만료", date: "2026-01-09", reason: "계약기간 종료", manager: "HR Manager" }],
      org: [{ type: "직책", before: "팀원", after: "팀장", date: "2024-06-01", reason: "업무역량 평가", manager: "HR Manager" }],
      leave: [{ type: "무급휴직", before: "정상근무", after: "무급휴직 14일", date: "2025-08-01", reason: "개인 사유", manager: "HR Manager" }]
    },
    repeat: [
      { type: "경력", content: "Local Design Office", start: "2019-01-01", end: "2022-12-31", period: "4년", file: "-", note: "외부경력" }
    ],
    worklogs: [],
    files: [
      { type: "계약서", name: "contract_mai.pdf", date: "2023-01-10", status: "승인완료" }
    ]
  }
];

const assetLedger = [
  { category: "노트북", name: "LG Gram", code: "AS-2026-001", owner: "박용진", date: "2026-01-05", status: "사용중" },
  { category: "라이선스", name: "AutoCAD", code: "LIC-2026-018", owner: "박용진", date: "2026-01-01", status: "사용중" },
  { category: "모니터", name: "Dell 27", code: "MN-2025-012", owner: "Nguyen Van An", date: "2025-03-02", status: "사용중" },
  { category: "노트북", name: "Lenovo ThinkPad", code: "AS-2024-021", owner: "Tran Thi Mai", date: "2024-01-10", status: "반납대기" }
];

const permissionRows = [
  ["기본정보", "보기/수정", "보기/수정", "보기", "본인 수정", "일부 공개"],
  ["상세정보", "보기/수정", "보기/수정", "일부 보기", "본인 수정", "비공개"],
  ["평가/연봉", "보기", "보기", "비공개", "비공개", "비공개"],
  ["주민등록번호/신분증", "보기", "보기/수정", "비공개", "비공개", "비공개"],
  ["계좌정보", "보기", "보기/수정", "비공개", "비공개", "비공개"],
  ["인사변동이력", "보기", "보기/수정", "보기", "일부 보기", "비공개"],
  ["자산관리", "보기", "보기/수정", "보기", "본인 보기", "비공개"]
];

const orderRows = [
  ["직급", "G001", "대표", 1, "사용"],
  ["직급", "G002", "부사장", 2, "사용"],
  ["직급", "G003", "상무", 3, "사용"],
  ["직급", "G004", "센터장", 4, "사용"],
  ["직급", "G005", "본부장", 5, "사용"],
  ["직급", "G006", "실장", 6, "사용"],
  ["직급", "G007", "팀장", 7, "사용"],
  ["직급", "G008", "수석", 8, "사용"],
  ["직책", "R001", "PM", 20, "사용"],
  ["직책", "R002", "파트장", 21, "사용"]
];

let selectedEmployeeId = employees[0].empNo;
let currentSortKey = "gradeOrder";
let sortDirection = 1;

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

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setFormValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
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

  const sorted = sortList(list);

  tbody.innerHTML = sorted.map(emp => `
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

  box.innerHTML = list.map(emp => `
    <div class="employee-item ${emp.empNo === selectedEmployeeId ? "active" : ""}" onclick="selectEmployee('${emp.empNo}', this)">
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
  renderMiniCard(emp);
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

function renderMiniCard(emp) {
  setText("miniPhoto", displayName(emp)[0]);
  setText("miniName", displayName(emp));
  setText("miniCompany", emp.company);
  setText("miniDept", emp.dept);
  setText("miniGrade", emp.grade);
  setText("miniEmail", emp.email);
  setText("miniPhone", emp.phone);
  setText("miniWorkplace", emp.workplace);

  const miniTags = document.getElementById("miniTags");
  if (miniTags) {
    miniTags.innerHTML = `
      ${companyBadge(emp.company)}
      <span class="badge blue">${emp.dept}</span>
      <span class="badge gray">${emp.grade}</span>
      ${statusBadge(emp.status)}
    `;
  }
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

function openMiniCard() {
  document.querySelector('[data-main="mini"]').click();
  const emp = employees.find(e => e.empNo === selectedEmployeeId);
  if (emp) renderMiniCard(emp);
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
    const active = target.filter(e => e.status === "재직").length;
    const join = target.filter(e => e.join.startsWith("2026")).length;
    const exit = target.filter(e => ["퇴사", "계약만료"].includes(e.status)).length;
    const expected = target.filter(e => e.status === "입사예정").length;
    const leave = target.filter(e => e.status === "휴직").length;

    return `
      <tr>
        <td>${company}</td>
        <td>${active}</td>
        <td>${join}</td>
        <td>${exit}</td>
        <td>${expected}</td>
        <td>${leave}</td>
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

function renderOrderRows() {
  const tbody = document.getElementById("orderBody");
  if (!tbody) return;

  tbody.innerHTML = orderRows.map(row => `
    <tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td>${row[3]}</td>
      <td><span class="badge green">${row[4]}</span></td>
      <td><button class="btn btn-line" onclick="showToast('표시순서 변경 예시입니다.')">↑↓</button></td>
    </tr>
  `).join("");
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

  if (e.target === employeeModal) closeModal();
  if (e.target === permissionModal) closePermissionModal();
  if (e.target === excelModal) closeExcelModal();
});

document.querySelectorAll(".switch-toggle input").forEach(toggle => {
  toggle.addEventListener("change", () => {
    showToast("관리자 설정값이 변경되었습니다. 저장 버튼을 눌러 반영하세요.");
  });
});

document.querySelectorAll(".permission-field, .permission-text, .permission-card").forEach(el => {
  el.addEventListener("click", openPermissionModal);
});

const ledgerSearch = document.getElementById("ledgerSearch");
if (ledgerSearch) {
  ledgerSearch.addEventListener("input", e => {
    renderLedger(filterEmployees(e.target.value));
  });
}

["companyFilter", "deptFilter", "gradeFilter", "statusFilter", "yearFilter"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", () => applyLedgerFilters(false));
});

const employeeSearch = document.getElementById("employeeSearch");
if (employeeSearch) {
  employeeSearch.addEventListener("input", e => {
    renderEmployeeList(filterEmployeesForList(e.target.value));
  });
}

bindPhoneFormatter("#phoneInput", "#phoneCountry");
bindPhoneFormatter(".modal-phone-input", ".modal-phone-country");
bindNationalIdFormatter();

renderKpis();
renderLedger(filterEmployees(""));
renderEmployeeList();
renderAnalysis();
renderAssetLedger();
renderPermissionRows();
renderOrderRows();
selectEmployee("EMP-2018-001");
