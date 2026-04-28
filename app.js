const gradeOrder = {
  "대표": 1,
  "대표이사": 1,
  "CEO": 1,
  "부사장": 2,
  "Executive Vice President": 2,
  "상무": 3,
  "Director": 4,
  "센터장": 5,
  "본부장": 6,
  "General Manager": 6,
  "실장": 7,
  "팀장": 8,
  "Team Leader": 8,
  "Asst. Team Leader": 9,
  "파트장": 9,
  "수석": 10,
  "책임": 11,
  "선임": 12,
  "프로": 13,
  "Staff": 14,
  "사원": 14,
  "더미": 99
};

const pageMeta = {
  ledger: ["조직관리 · 사원대장", "CON-COST와 Viet QS 조직도 인원을 기준으로 생성된 사원대장입니다."],
  card: ["조직관리 · 인사카드", "조직도 내 직원 클릭 시 연결되는 인사카드 원장을 관리합니다."],
  analysis: ["조직관리 · 직원증감분석", "회사별 인원, 더미 인사카드, 중복 연결 인원을 확인합니다."],
  approval: ["조직관리 · 승인관리", "인사카드 수정, 조직도 수정, 증명서 발급 승인 요청을 관리합니다."],
  orgManage: ["조직관리 · 조직도관리", "경영지원 부서에서 조직도와 인사카드 연결을 수정할 수 있는 관리 화면입니다."],
  cost: ["비용보고", "비용보고 대분류 화면입니다. 현재는 메뉴 구조 우선 구성 상태입니다."],
  asset: ["자산대장", "자산대장 대분류 화면입니다. 자산 등록, 배정, 반납 상태를 관리합니다."],
  admin: ["관리자 설정", "권한, 정책, 표시 순서, 조직도 수정 기준을 관리합니다."],
  code: ["관리자 설정 · 코드관리", "관리자 설정 하위 메뉴로 코드값과 표시 순서를 관리합니다."]
};

const orgUnits = {
  "CON-COST": [
    {
      title: "대표이사",
      people: [{ name: "대표이사", grade: "대표", position: "대표이사", dept: "대표이사", employeeKey: "ceo-concost" }]
    },
    {
      title: "부사장",
      people: [{ name: "부사장", grade: "부사장", position: "부사장", dept: "임원", employeeKey: "evp-concost" }]
    },
    {
      title: "경영지원본부",
      people: [
        { name: "이서진", grade: "상무", position: "상무", dept: "경영지원본부", employeeKey: "lee-seojin" },
        { name: "강동균", grade: "실장", position: "실장", dept: "경영지원본부", employeeKey: "kang-donggyun" },
        { name: "김영은", grade: "책임", position: "책임", dept: "경영지원본부", employeeKey: "kim-youngoeun" },
        { name: "김태영", grade: "선임", position: "선임", dept: "경영지원본부", employeeKey: "kim-taeyoung" },
        { name: "현예은", grade: "선임", position: "선임", dept: "경영지원본부", employeeKey: "hyun-yeeun" }
      ]
    },
    {
      title: "개발 T/F",
      people: [
        { name: "박용진", grade: "수석", position: "수석", dept: "개발 T/F", employeeKey: "park-yongjin" },
        { name: "탄프엉", grade: "프로", position: "프로", dept: "개발 T/F", employeeKey: "thanh-phuong" },
        { name: "고영", grade: "프로", position: "프로", dept: "개발 T/F", employeeKey: "goyoung" }
      ]
    },
    {
      title: "QC",
      people: [
        { name: "장범선", grade: "실장", position: "실장", dept: "QC", employeeKey: "jang-beomsun" },
        { name: "조한빈", grade: "실장", position: "실장", dept: "QC", employeeKey: "cho-hanbin" }
      ]
    },
    {
      title: "기술본부",
      people: [
        { name: "최영배", grade: "본부장", position: "본부장", dept: "기술본부", employeeKey: "choi-youngbae" }
      ]
    },
    {
      title: "마감",
      people: [
        { name: "조한빈", grade: "실장", position: "실장", dept: "마감", employeeKey: "cho-hanbin" },
        { name: "김채현", grade: "수석", position: "수석", dept: "마감", employeeKey: "kim-chaehyun" },
        { name: "성대용", grade: "수석", position: "수석", dept: "마감", employeeKey: "sung-daeyong" },
        { name: "양한규", grade: "수석", position: "수석", dept: "마감", employeeKey: "yang-hangyu" },
        { name: "원종수", grade: "수석", position: "수석", dept: "마감", employeeKey: "won-jongsu" },
        { name: "송영길", grade: "수석", position: "수석", dept: "마감", employeeKey: "song-younggil" },
        { name: "이은지", grade: "책임", position: "책임", dept: "마감", employeeKey: "lee-eunji" },
        { name: "남은주", grade: "책임", position: "책임", dept: "마감", employeeKey: "nam-eunju" },
        { name: "송치영", grade: "책임", position: "책임", dept: "마감", employeeKey: "song-chiyoung" },
        { name: "임승주", grade: "선임", position: "선임", dept: "마감", employeeKey: "lim-seungju" },
        { name: "박가림", grade: "선임", position: "선임", dept: "마감", employeeKey: "park-garim" },
        { name: "임창열", grade: "선임", position: "선임", dept: "마감", employeeKey: "lim-changyeol" },
        { name: "김수겸", grade: "프로", position: "프로", dept: "마감", employeeKey: "kim-sugyeom" }
      ]
    },
    {
      title: "구조/토목·조경",
      people: [
        { name: "장범선", grade: "실장", position: "실장", dept: "구조/토목·조경", employeeKey: "jang-beomsun" },
        { name: "신동현", grade: "팀장", position: "팀장", dept: "구조/토목·조경", employeeKey: "shin-donghyun" },
        { name: "김채원", grade: "수석", position: "수석", dept: "구조/토목·조경", employeeKey: "kim-chaewon" },
        { name: "이정철", grade: "수석", position: "수석", dept: "구조/토목·조경", employeeKey: "lee-jungchul" },
        { name: "박수현", grade: "책임", position: "책임", dept: "구조/토목·조경", employeeKey: "park-soohyun" },
        { name: "서화원", grade: "책임", position: "책임", dept: "구조/토목·조경", employeeKey: "seo-hwawon" },
        { name: "양진혁", grade: "프로", position: "프로", dept: "구조/토목·조경", employeeKey: "yang-jinhyeok" },
        { name: "이성희", grade: "파트장", position: "파트장", dept: "BIM 파트", employeeKey: "lee-sunghee" },
        { name: "박용진", grade: "수석", position: "수석", dept: "BIM 파트", employeeKey: "park-yongjin" },
        { name: "오승균", grade: "파트장", position: "파트장", dept: "토목·조경파트", employeeKey: "oh-seunggyun" }
      ]
    },
    {
      title: "클레임센터",
      people: [
        { name: "이경훈", grade: "센터장", position: "센터장", dept: "클레임센터", employeeKey: "lee-kyunghoon" },
        { name: "최영배", grade: "본부장", position: "본부장", dept: "클레임센터", employeeKey: "choi-youngbae" },
        { name: "장범선", grade: "실장", position: "실장", dept: "클레임센터", employeeKey: "jang-beomsun" },
        { name: "김현수", grade: "기술이사", position: "기술이사", dept: "클레임센터", employeeKey: "kim-hyunsu" },
        { name: "우상진", grade: "기술이사", position: "기술이사", dept: "클레임센터", employeeKey: "woo-sangjin" }
      ]
    }
  ],
  "Viet QS": [
    {
      title: "CEO / Executive",
      people: [
        { name: "Hyun Dong Myung", koreanName: "현동명", grade: "CEO", position: "CEO", dept: "Viet QS", employeeKey: "hyun-dongmyung" },
        { name: "Lee Won Hee", koreanName: "이원희", grade: "Executive Vice President", position: "Executive Vice President", dept: "Viet QS", employeeKey: "lee-wonhee" },
        { name: "Choi Young Bae", koreanName: "최영배", grade: "Director", position: "Director", dept: "Structure/Civil", employeeKey: "choi-youngbae" }
      ]
    },
    {
      title: "Management Support",
      people: [
        { name: "Lan Phuong", koreanName: "프엉", grade: "General Manager", position: "General Manager", dept: "Management Support", employeeKey: "lan-phuong" },
        { name: "Thanh Tuyen", koreanName: "뚜엔", grade: "Staff", position: "Staff", dept: "Management Support", employeeKey: "thanh-tuyen" },
        { name: "Yen Phuong", koreanName: "프엉", grade: "Staff", position: "Staff", dept: "Management Support", employeeKey: "yen-phuong" }
      ]
    },
    {
      title: "Finish / Internal",
      people: [
        { name: "Cho Han Bin", koreanName: "조한빈", grade: "General Manager", position: "General Manager", dept: "Finish", employeeKey: "cho-hanbin" },
        { name: "Van Dung", koreanName: "융", grade: "Team Leader", position: "Team Leader", dept: "Internal 1", employeeKey: "van-dung" },
        { name: "Huyen Thu", koreanName: "투", grade: "Team Leader", position: "Team Leader", dept: "Internal 2", employeeKey: "huyen-thu" },
        { name: "Dinh Phi", koreanName: "피", grade: "Team Leader", position: "Team Leader", dept: "Internal 3", employeeKey: "dinh-phi" },
        { name: "Kha Ai", koreanName: "카아이", grade: "Staff", position: "Staff", dept: "Internal 1", employeeKey: "kha-ai" },
        { name: "Tan Phat", koreanName: "팓", grade: "Staff", position: "Staff", dept: "Internal 1", employeeKey: "tan-phat" },
        { name: "Ngoc Anh", koreanName: "응옥안", grade: "Staff", position: "Staff", dept: "Internal 1", employeeKey: "ngoc-anh" },
        { name: "Ngoc Bich", koreanName: "빛", grade: "Staff", position: "Staff", dept: "Internal 1", employeeKey: "ngoc-bich" },
        { name: "Hong Phien", koreanName: "피앤", grade: "Staff", position: "Staff", dept: "Internal 1", employeeKey: "hong-phien" }
      ]
    },
    {
      title: "Partition & Opening / External",
      people: [
        { name: "Van Tung", koreanName: "뚱", grade: "Team Leader", position: "Team Leader", dept: "Partition&Opening", employeeKey: "van-tung" },
        { name: "Minh Luan", koreanName: "루언", grade: "Asst. Team Leader", position: "Asst. Team Leader", dept: "Partition&Opening", employeeKey: "minh-luan" },
        { name: "Thuy Tram", koreanName: "짬", grade: "Team Leader", position: "Team Leader", dept: "External", employeeKey: "thuy-tram" },
        { name: "Nhut Duy", koreanName: "유이", grade: "Team Leader", position: "Team Leader", dept: "External", employeeKey: "nhut-duy" },
        { name: "Quoc Bao", koreanName: "빠오", grade: "Staff", position: "Staff", dept: "External", employeeKey: "quoc-bao" },
        { name: "Quynh Giao", koreanName: "쨔오", grade: "Staff", position: "Staff", dept: "External", employeeKey: "quynh-giao" },
        { name: "Thi Anh", koreanName: "티안", grade: "Staff", position: "Staff", dept: "External", employeeKey: "thi-anh" }
      ]
    },
    {
      title: "Structure/Civil · Horizon/Foundation",
      people: [
        { name: "Huu Thai", koreanName: "휴타이", grade: "Team Leader", position: "Team Leader", dept: "Horizon/Foundation", employeeKey: "huu-thai" },
        { name: "Van Toan", koreanName: "또안", grade: "Team Leader", position: "Team Leader", dept: "Horizon/Foundation", employeeKey: "van-toan" },
        { name: "Nhut Cuong", koreanName: "늣끄엉", grade: "Asst. Team Leader", position: "Asst. Team Leader", dept: "Horizon/Foundation", employeeKey: "nhut-cuong" },
        { name: "Sy Dan", koreanName: "단", grade: "Team Leader", position: "Team Leader", dept: "Horizon/Foundation", employeeKey: "sy-dan" },
        { name: "Anh Tuan", koreanName: "뚜언", grade: "Team Leader", position: "Team Leader", dept: "Horizon/Foundation", employeeKey: "anh-tuan" },
        { name: "Thanh Phong", koreanName: "퐁", grade: "Team Leader", position: "Team Leader", dept: "Horizon/Foundation", employeeKey: "thanh-phong" },
        { name: "Quoc Huy", koreanName: "휘", grade: "Staff", position: "Staff", dept: "Horizon/Foundation", employeeKey: "quoc-huy" },
        { name: "Huu Chau", koreanName: "쩌우", grade: "Asst. Team Leader", position: "Asst. Team Leader", dept: "Horizon/Foundation", employeeKey: "huu-chau" },
        { name: "Ngoc Mai", koreanName: "마이", grade: "Staff", position: "Staff", dept: "Horizon/Foundation", employeeKey: "ngoc-mai" }
      ]
    },
    {
      title: "Structure/Civil · Vertical",
      people: [
        { name: "Danh Xuan", koreanName: "짠수언", grade: "Team Leader", position: "Team Leader", dept: "Vertical", employeeKey: "danh-xuan" },
        { name: "Dinh Nam", koreanName: "남", grade: "Asst. Team Leader", position: "Asst. Team Leader", dept: "Vertical", employeeKey: "dinh-nam" },
        { name: "Minh Tu", koreanName: "뚜", grade: "Asst. Team Leader", position: "Asst. Team Leader", dept: "Vertical", employeeKey: "minh-tu" },
        { name: "Ngoc Thoa", koreanName: "옥톼", grade: "Staff", position: "Staff", dept: "Vertical", employeeKey: "ngoc-thoa" }
      ]
    },
    {
      title: "Development / Civil",
      people: [
        { name: "Thanh Phuong", koreanName: "탄프엉", grade: "Team Leader", position: "Team Leader", dept: "Development", employeeKey: "thanh-phuong" },
        { name: "Minh Hai", koreanName: "하이", grade: "Staff", position: "Staff", dept: "Development", employeeKey: "minh-hai" },
        { name: "Minh Chau", koreanName: "민쩌우", grade: "Staff", position: "Staff", dept: "Development", employeeKey: "minh-chau" },
        { name: "Khanh Duy", koreanName: "칸유이", grade: "Staff", position: "Staff", dept: "Development", employeeKey: "khanh-duy" },
        { name: "Kim Tuyen", koreanName: "김뚜엔", grade: "Staff", position: "Staff", dept: "Development", employeeKey: "kim-tuyen" },
        { name: "Hong Ngan", koreanName: "홍응언", grade: "Staff", position: "Staff", dept: "Development", employeeKey: "hong-ngan" },
        { name: "Thuc Nguyen", koreanName: "응우옌", grade: "Staff", position: "Staff", dept: "Development", employeeKey: "thuc-nguyen" },
        { name: "Phuoc Nguyen", koreanName: "응우옌", grade: "Staff", position: "Staff", dept: "Development", employeeKey: "phuoc-nguyen" },
        { name: "Jang Beom Sun", koreanName: "장범선", grade: "General Manager", position: "General Manager", dept: "Civil", employeeKey: "jang-beomsun" }
      ]
    }
  ]
};

function makeEmployeeFromPerson(person, company, unitTitle) {
  const isViet = company === "Viet QS";
  const display = person.koreanName ? `${person.name}(${person.koreanName})` : person.name;
  const commonKeys = ["choi-youngbae", "cho-hanbin", "jang-beomsun", "park-yongjin", "thanh-phuong"];

  return {
    empNo: `${isViet ? "VQS" : "EMP"}-${person.employeeKey}`,
    employeeKey: person.employeeKey,
    name: person.name,
    localName: isViet ? person.name : "",
    koreanName: person.koreanName || "",
    displayName: display,
    company: commonKeys.includes(person.employeeKey) ? "공통" : company,
    companies: commonKeys.includes(person.employeeKey) ? ["CON-COST", "Viet QS"] : [company],
    dept: person.dept || unitTitle,
    orgUnit: unitTitle,
    grade: person.grade || "더미",
    position: person.position || person.grade || "더미",
    status: "더미",
    email: `${person.employeeKey}@con-cost.local`,
    phone: isViet ? "+84-000-000-000" : "010-0000-0000",
    workplace: isViet ? "베트남 지사" : "서울 본사",
    orgPath: `${company} > ${unitTitle} > ${person.dept || ""}`,
    memo: "조직도 기반 자동 생성 더미 인사카드"
  };
}

function buildEmployees() {
  const map = new Map();

  Object.entries(orgUnits).forEach(([company, units]) => {
    units.forEach(unit => {
      unit.people.forEach(person => {
        const key = person.employeeKey || person.name;
        if (!map.has(key)) {
          map.set(key, makeEmployeeFromPerson(person, company, unit.title));
        } else {
          const emp = map.get(key);
          if (!emp.companies.includes(company)) emp.companies.push(company);
          if (!emp.orgPath.includes(company)) emp.orgPath += ` / ${company} > ${unit.title}`;
          emp.company = "공통";
        }
      });
    });
  });

  return Array.from(map.values());
}

let employees = buildEmployees();
let selectedEmployeeId = employees[0]?.employeeKey || "";
let currentSortKey = "gradeOrder";
let sortDirection = 1;
let currentOrgCompany = "CON-COST";

function $(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value ?? "";
}

function setValue(id, value) {
  const el = $(id);
  if (el) el.value = value ?? "";
}

function badge(text, color = "gray") {
  return `<span class="badge ${color}">${text}</span>`;
}

function companyBadge(emp) {
  if (emp.company === "공통") return `<span class="company-chip common">CON-COST · Viet QS</span>`;
  const cls = emp.company === "Viet QS" ? "vietqs" : "concost";
  return `<span class="company-chip ${cls}">${emp.company}</span>`;
}

function getEmployeeByKey(key) {
  return employees.find(emp => emp.employeeKey === key);
}

function getSortValue(emp, key) {
  if (key === "gradeOrder") return gradeOrder[emp.grade] || 999;
  return emp[key] || "";
}

function sortEmployees(key) {
  if (currentSortKey === key) sortDirection *= -1;
  else {
    currentSortKey = key;
    sortDirection = 1;
  }
  renderLedger();
}

function filteredEmployees() {
  const keyword = ($("ledgerSearch")?.value || "").trim().toLowerCase();
  const company = $("companyFilter")?.value || "전체";
  const status = $("statusFilter")?.value || "전체";

  return employees.filter(emp => {
    const haystack = [
      emp.name,
      emp.koreanName,
      emp.localName,
      emp.company,
      emp.companies.join(" "),
      emp.dept,
      emp.grade,
      emp.position,
      emp.orgPath
    ].join(" ").toLowerCase();

    const keywordOk = !keyword || haystack.includes(keyword);
    const companyOk = company === "전체" || emp.company === company || emp.companies.includes(company);
    const statusOk = status === "전체" || emp.status === status;

    return keywordOk && companyOk && statusOk;
  }).sort((a, b) => {
    const av = getSortValue(a, currentSortKey);
    const bv = getSortValue(b, currentSortKey);
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * sortDirection;
    return String(av).localeCompare(String(bv), "ko") * sortDirection;
  });
}

function renderKpis() {
  setText("kpiTotal", employees.length);
  setText("kpiConcost", employees.filter(e => e.companies.includes("CON-COST")).length);
  setText("kpiVietqs", employees.filter(e => e.companies.includes("Viet QS")).length);
  setText("kpiLinked", employees.filter(e => e.company === "공통").length);

  const orgPeople = Object.values(orgUnits).flatMap(units => units.flatMap(unit => unit.people)).length;
  setText("kpiOrgPeople", orgPeople);

  setText("analysisConcost", employees.filter(e => e.companies.includes("CON-COST")).length);
  setText("analysisVietqs", employees.filter(e => e.companies.includes("Viet QS")).length);
  setText("analysisCommon", employees.filter(e => e.company === "공통").length);
  setText("analysisDummy", employees.filter(e => e.status === "더미").length);
}

function renderLedger() {
  const body = $("ledgerBody");
  if (!body) return;

  body.innerHTML = filteredEmployees().map(emp => `
    <tr>
      <td><strong>${emp.displayName}</strong></td>
      <td>${companyBadge(emp)}</td>
      <td>${emp.dept}</td>
      <td>${emp.grade}</td>
      <td>${emp.position}</td>
      <td>${badge(emp.status, "blue")}</td>
      <td>${emp.orgPath}</td>
      <td>
        <button class="btn btn-line" onclick="openCard('${emp.employeeKey}')">상세</button>
        <button class="btn btn-line" onclick="openMiniCard('${emp.employeeKey}')">팝업</button>
      </td>
    </tr>
  `).join("");
}

function renderEmployeeList() {
  const box = $("employeeList");
  if (!box) return;

  const keyword = ($("employeeSearch")?.value || "").trim().toLowerCase();
  const list = employees.filter(emp => {
    const text = `${emp.displayName} ${emp.dept} ${emp.grade} ${emp.company}`.toLowerCase();
    return !keyword || text.includes(keyword);
  });

  box.innerHTML = list.map(emp => `
    <div class="employee-item ${emp.employeeKey === selectedEmployeeId ? "active" : ""}" onclick="selectEmployee('${emp.employeeKey}')">
      <div class="emp-photo">${(emp.koreanName || emp.name || "-")[0]}</div>
      <div>
        <div class="emp-name">${emp.displayName}</div>
        <div class="emp-meta">${emp.company} · ${emp.dept} · ${emp.grade}<br>${emp.orgUnit}</div>
      </div>
    </div>
  `).join("");
}

function selectEmployee(key) {
  const emp = getEmployeeByKey(key);
  if (!emp) return;

  selectedEmployeeId = key;

  setText("profileInitial", (emp.koreanName || emp.name || "-")[0]);
  setText("profileName", emp.displayName);
  setText("profileCompany", emp.company === "공통" ? emp.companies.join(" · ") : emp.company);
  setText("profileDept", emp.dept);
  setText("profileGrade", emp.grade);
  setText("profileOrg", emp.orgUnit);

  const tags = $("profileTags");
  if (tags) {
    tags.innerHTML = `
      ${badge(emp.status, "blue")}
      ${badge(emp.position, "green")}
      ${emp.company === "공통" ? badge("중복 인물 단일 인사카드", "yellow") : ""}
    `;
  }

  setValue("cardName", emp.name);
  setValue("cardLocalName", emp.localName);
  setValue("cardKoreanName", emp.koreanName);
  setValue("cardCompany", emp.company === "공통" ? emp.companies.join(" / ") : emp.company);
  setValue("cardDept", emp.dept);
  setValue("cardGrade", emp.grade);
  setValue("cardPosition", emp.position);
  setValue("cardEmail", emp.email);
  setValue("cardPhone", emp.phone);
  setValue("cardOrgPath", emp.orgPath);
  setValue("cardMemo", emp.memo);

  renderEmployeeList();
}

function openCard(key) {
  switchPanel("card");
  selectEmployee(key);
}

function renderOrgChart(company = currentOrgCompany) {
  const canvas = $("orgChartContent");
  if (!canvas) return;

  const units = orgUnits[company] || [];

  canvas.innerHTML = `
    <div class="org-chart-title">
      <strong>${company} 조직도</strong>
      <span>${company === "CON-COST" ? "2026. 4. 9." : "2026. 04. 07"}</span>
    </div>
    <div class="org-grid">
      ${units.map(unit => `
        <div class="org-unit">
          <div class="org-unit-title">${unit.title}</div>
          <div class="org-people">
            ${unit.people.map(person => {
              const emp = getEmployeeByKey(person.employeeKey);
              const label = person.koreanName ? `${person.name}<br><em>${person.koreanName}</em>` : person.name;
              const linked = emp?.company === "공통" ? `<span class="org-linked">공통카드</span>` : "";
              return `
                <button class="org-person" onclick="openMiniCard('${person.employeeKey}')">
                  <span>${person.grade || ""}</span>
                  <strong>${label}</strong>
                  ${linked}
                </button>
              `;
            }).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function switchOrgCompany(company, btn) {
  currentOrgCompany = company;
  document.querySelectorAll(".org-tab").forEach(tab => tab.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderOrgChart(company);
}

function openOrgChart() {
  $("orgChartModal")?.classList.add("show");
  renderOrgChart(currentOrgCompany);
}

function closeOrgChart() {
  $("orgChartModal")?.classList.remove("show");
}

function openMiniCard(key) {
  const emp = getEmployeeByKey(key);
  if (!emp) return;

  setText("miniInitial", (emp.koreanName || emp.name || "-")[0]);
  setText("miniName", emp.displayName);
  setText("miniCompany", emp.company === "공통" ? emp.companies.join(" · ") : emp.company);
  setText("miniDept", emp.dept);
  setText("miniGrade", emp.grade);
  setText("miniPosition", emp.position);
  setText("miniEmail", emp.email);
  setText("miniPhone", emp.phone);

  const tags = $("miniTags");
  if (tags) {
    tags.innerHTML = `
      ${badge(emp.status, "blue")}
      ${badge(emp.workplace, "gray")}
      ${emp.company === "공통" ? badge("단일 인사카드 연결", "yellow") : ""}
    `;
  }

  $("miniCardModal")?.classList.add("show");
}

function closeMiniCard() {
  $("miniCardModal")?.classList.remove("show");
}

function renderOrgManageTable() {
  const body = $("orgManageBody");
  if (!body) return;

  const company = $("manageCompany")?.value || "CON-COST";
  const rows = (orgUnits[company] || []).flatMap(unit => {
    return unit.people.map(person => {
      const emp = getEmployeeByKey(person.employeeKey);
      return { unit: unit.title, person, emp };
    });
  });

  body.innerHTML = rows.map(row => `
    <tr>
      <td>${company}</td>
      <td>${row.unit}</td>
      <td><strong>${row.person.koreanName ? `${row.person.name}(${row.person.koreanName})` : row.person.name}</strong></td>
      <td>${row.person.grade}</td>
      <td>${row.person.position}</td>
      <td>${row.emp ? badge(row.emp.company === "공통" ? "공통 인사카드" : "연결됨", row.emp.company === "공통" ? "yellow" : "green") : badge("미연결", "red")}</td>
      <td>
        <button class="btn btn-line" onclick="openMiniCard('${row.person.employeeKey}')">인사카드</button>
        <button class="btn btn-line" onclick="showToast('조직도 편집 기능 예시입니다.')">수정</button>
      </td>
    </tr>
  `).join("");
}

function switchPanel(panelId) {
  document.querySelectorAll(".panel").forEach(panel => panel.classList.remove("active"));
  document.querySelectorAll(".side-main, .side-item").forEach(btn => btn.classList.remove("active"));

  const target = $(panelId);
  if (target) target.classList.add("active");

  const activeBtn = document.querySelector(`[data-panel="${panelId}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const group = activeBtn?.closest(".side-sub");
  if (group) {
    group.classList.add("active");
    const groupBtn = document.querySelector(`[data-group="${group.id}"]`);
    groupBtn?.classList.add("active");
  }

  const meta = pageMeta[panelId] || pageMeta.ledger;
  setText("pageTitle", meta[0]);
  setText("pageDesc", meta[1]);

  if (panelId === "orgManage") renderOrgManageTable();
}

function bindNavigation() {
  document.querySelectorAll(".side-main").forEach(btn => {
    btn.addEventListener("click", () => {
      const groupId = btn.dataset.group;
      const panelId = btn.dataset.panel;

      if (groupId) {
        document.querySelectorAll(".side-sub").forEach(sub => sub.classList.remove("active"));
        $(groupId)?.classList.add("active");
        document.querySelectorAll(".side-main").forEach(main => main.classList.remove("active"));
        btn.classList.add("active");
      }

      if (panelId) switchPanel(panelId);
    });
  });

  document.querySelectorAll(".side-item").forEach(btn => {
    btn.addEventListener("click", () => switchPanel(btn.dataset.panel));
  });
}

function openEmployeeModal() {
  $("employeeModal")?.classList.add("show");
}

function closeEmployeeModal() {
  $("employeeModal")?.classList.remove("show");
}

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function init() {
  bindNavigation();
  renderKpis();
  renderLedger();
  renderEmployeeList();
  renderOrgManageTable();

  if (employees.length) selectEmployee(employees[0].employeeKey);
}

document.addEventListener("DOMContentLoaded", init);
