/* =========================================================
   업무관리 > 프로젝트 접수
   엑셀 접수 양식의 주요 항목을 카드형 입력 화면으로 재구성한 파일입니다.
========================================================= */

const projectReceiveDefaultData = {
  projectName: "",
  projectNo: "",
  client: "",
  usage: "",
  area: "",
  buildings: "",
  floors: "",
  basementFloors: "",
  groundFloors: "",
  bidDate: "",
  unitPrice: "",
  businessTypes: [
    { label: "개산견적", checked: false },
    { label: "정미견적", checked: false },
    { label: "설계가", checked: false },
    { label: "설계변경", checked: false },
    { label: "공사비 검증", checked: false },
    { label: "클레임", checked: false },
    { label: "본사 입찰", checked: false },
    { label: "본사 실행", checked: false },
    { label: "현장 실행", checked: false },
    { label: "기타", checked: false }
  ],
  scopes: [
    { label: "마감", checked: false },
    { label: "구조팀", checked: false },
    { label: "BIM 파트", checked: false },
    { label: "토목ㆍ조경파트", checked: false },
    { label: "인테리어·철거", checked: false },
    { label: "비교내역서", checked: false },
    { label: "단가작업", checked: false },
    { label: "기계/전기", checked: false },
    { label: "클레임", checked: false },
    { label: "골조성", checked: false, children: [
      { label: "가설", checked: false },
      { label: "단열", checked: false },
      { label: "견출", checked: false },
      { label: "방수턱", checked: false }
    ] }
  ],
  contacts: [
    { name: "", role: "", dept: "", tel: "", mobile: "", email: "" }
  ],
  materials: [
    { label: "도면", memo: "", status: "미접수", comment: "", confirmedBy: "" },
    { label: "시방서", memo: "", status: "미접수", comment: "", confirmedBy: "" },
    { label: "현장설명서", memo: "", status: "미접수", comment: "", confirmedBy: "" },
    { label: "내역서", memo: "", status: "미접수", comment: "", confirmedBy: "" },
    { label: "기타자료", memo: "", status: "미접수", comment: "", confirmedBy: "" }
  ],
  webhardUrl: "",
  webhardId: "",
  webhardPw: "",
  webhardNote: "",
  pmTotal: "",
  pmFinish: "",
  pmStructure: "",
  startDate: "",
  firstDelivery: "",
  finalDelivery: "",
  workContent: "",
  notes: "",
  request: ""
};

const projectReceiveSampleData = {
  projectName: "홍익대학교 혁신성장캠퍼스 증축공사 견적용역",
  projectNo: "2026043",
  client: "현대건설㈜",
  usage: "교육연구시설",
  area: "45,013평",
  buildings: "4개동(금회변경)",
  floors: "B6/S9",
  basementFloors: "지하6층",
  groundFloors: "지상9층",
  bidDate: "2026.06말",
  unitPrice: "공내역서",
  businessTypes: [
    { label: "개산견적", checked: false },
    { label: "정미견적", checked: true },
    { label: "설계가", checked: false },
    { label: "설계변경", checked: false },
    { label: "공사비 검증", checked: false },
    { label: "클레임", checked: false },
    { label: "본사 입찰", checked: true },
    { label: "본사 실행", checked: false },
    { label: "현장 실행", checked: false },
    { label: "기타", checked: false }
  ],
  scopes: [
    { label: "마감", checked: true },
    { label: "구조팀", checked: true },
    { label: "BIM 파트", checked: true },
    { label: "토목ㆍ조경파트", checked: true },
    { label: "인테리어·철거", checked: true },
    { label: "비교내역서", checked: false },
    { label: "단가작업", checked: false },
    { label: "기계/전기", checked: false },
    { label: "클레임", checked: false },
    { label: "골조성", checked: false, children: [
      { label: "가설", checked: false },
      { label: "단열", checked: false },
      { label: "견출", checked: false },
      { label: "방수턱", checked: false }
    ] }
  ],
  contacts: [
    { name: "한동훈", role: "매니저", dept: "건축국내견적팀", tel: "02-746-8013", mobile: "010-3572-5478", email: "donghunhan@hdec.co.kr" },
    { name: "박태훈", role: "매니저", dept: "건축국내견적팀", tel: "02-746-0874", mobile: "", email: "" },
    { name: "남종현", role: "매니저", dept: "건축국내견적팀", tel: "02-746-5363", mobile: "010-2080-1933", email: "surnam@hdec.co.kr" }
  ],
  materials: [
    { label: "도면", memo: "2026.05.11", status: "일부접수", comment: "건축 구조 도면은 접수 받았으나 계약범위인 토목도서는 미접수 되었으므로 담당자 확인요망", confirmedBy: "박용진 수석 / 2026.05.13 13:17" },
    { label: "시방서", memo: "접수일 또는 메모", status: "확인완료", comment: "시방서 접수 확인.", confirmedBy: "박용진 수석 / 2026.05.13 13:14" },
    { label: "현장설명서", memo: "접수일 또는 메모", status: "확인완료", comment: "현장설명서 접수 확인.", confirmedBy: "박용진 수석 / 2026.05.13 13:14" },
    { label: "내역서", memo: "2026.05.11", status: "확인완료", comment: "공내역서 접수 확인.", confirmedBy: "박용진 수석 / 2026.05.13 13:14" },
    { label: "기타자료", memo: "접수일 또는 메모", status: "미접수", comment: "접수받은 내용 없음.", confirmedBy: "" }
  ],
  webhardUrl: "http://only.webhard.co.kr",
  webhardId: "hdeckucu",
  webhardPw: "s100",
  webhardNote: "폴더 접속KEY: 0505 / 폴더명: 260406 포항 AI DC",
  pmTotal: "",
  pmFinish: "",
  pmStructure: "",
  startDate: "2026.05.12(화)",
  firstDelivery: "2026.06.05(금)",
  finalDelivery: "",
  workContent: "구조, 마감, 인테리어, 철거공사 / 공내역서 작성",
  notes: "",
  request: "구조, 마감, 인테리어, 철거공사 / 공내역서 작성\n금회증축 연면적 45,013평이 과업 범위임"
};



function createProjectReceiveCompletedProject(config) {
  const businessTypeLabels = config.businessTypes || inferProjectReceiveBusinessTypes(config.projectName, config.workContent, config.request);
  const scopeLabels = config.scopes || inferProjectReceiveScopes(config.projectName, config.workContent, config.request);
  return {
    sourceFile: config.sourceFile,
    completedAt: config.completedAt || "2026.05.13 11:47",
    data: {
      ...projectReceiveSampleData,
      projectNo: config.projectNo,
      projectName: config.projectName,
      client: config.client,
      usage: config.usage || "",
      area: config.area || "",
      buildings: config.buildings || "",
      floors: config.floors || "",
      basementFloors: config.basementFloors || parseProjectReceiveFloors(config.floors || "").basementFloors,
      groundFloors: config.groundFloors || parseProjectReceiveFloors(config.floors || "").groundFloors,
      bidDate: config.bidDate || "",
      unitPrice: config.unitPrice || "공내역서",
      businessTypes: projectReceiveSampleData.businessTypes.map(item => ({ ...item, checked: businessTypeLabels.includes(item.label) })),
      scopes: projectReceiveSampleData.scopes.map(item => ({
        ...item,
        checked: scopeLabels.includes(item.label),
        children: item.children ? item.children.map(child => ({ ...child, checked: (config.scopeDetails?.[item.label] || []).includes(child.label) })) : undefined
      })),
      contacts: config.contacts || [{ name: "", role: "", dept: "", tel: "", mobile: "", email: "" }],
      materials: createProjectReceiveDummyMaterials(config.receivedDate),
      startDate: config.startDate || "",
      firstDelivery: config.firstDelivery || "담당자 협의 필요",
      finalDelivery: config.finalDelivery || "",
      workContent: config.workContent || config.request || config.projectName,
      notes: config.notes || "엑셀 수주소식 기준 작성완료 더미데이터",
      request: config.request || `${config.projectName} 접수 건`
    }
  };
}

function inferProjectReceiveBusinessTypes(...texts) {
  const source = texts.filter(Boolean).join(" ");
  const labels = new Set();
  if (/설계변경/.test(source)) labels.add("설계변경");
  if (/설계가|설계예가/.test(source)) labels.add("설계가");
  if (/검증|적정공사비|감정|소송|대응/.test(source)) labels.add("공사비 검증");
  if (/클레임|소송/.test(source)) labels.add("클레임");
  if (/실행|정산/.test(source)) labels.add("본사 실행");
  if (/견적|물량산출|공내역|정미/.test(source)) labels.add("정미견적");
  if (!labels.size) labels.add("정미견적");
  if (!labels.has("본사 실행")) labels.add("본사 입찰");
  return Array.from(labels);
}

function inferProjectReceiveScopes(...texts) {
  const source = texts.filter(Boolean).join(" ");
  const labels = new Set();
  if (/마감|건축|리모델링|내부|외부|철거|창호|골조성마감/.test(source)) labels.add("마감");
  if (/클레임|소송|분쟁|감정/.test(source)) labels.add("클레임");
  if (/골조성|가설|단열|견출|방수턱/.test(source)) labels.add("골조성");
  if (/구조|골조|철근|거푸집|철골|BIM|모델링|물량산출/.test(source)) labels.add("구조팀");
  if (/BIM|모델링|3D/.test(source)) labels.add("BIM 파트");
  if (/토목|조경|흙막이|부대토목|Civil/.test(source)) labels.add("토목ㆍ조경파트");
  if (/인테리어|철거/.test(source)) labels.add("인테리어·철거");
  if (/단가/.test(source)) labels.add("단가작업");
  if (/기계|전기/.test(source)) labels.add("기계\/전기");
  if (!labels.size) labels.add("마감");
  return Array.from(labels);
}

function createProjectReceiveDummyMaterials(receivedDate = "2026.05.13") {
  return [
    { label: "도면", memo: receivedDate, status: "확인완료", comment: "업로드된 엑셀 수주소식 기준 도면 접수 확인.", confirmedBy: "박용진 수석 / 2026.05.13 13:17" },
    { label: "시방서", memo: "접수일 또는 메모", status: "미접수", comment: "첨부 엑셀 기준 별도 시방서 접수 여부 확인 필요.", confirmedBy: "" },
    { label: "현장설명서", memo: "접수일 또는 메모", status: "미접수", comment: "현장설명서 접수 여부 확인 필요.", confirmedBy: "" },
    { label: "내역서", memo: receivedDate, status: "확인완료", comment: "공내역서 또는 원가자료 접수 확인.", confirmedBy: "박용진 수석 / 2026.05.13 13:17" },
    { label: "기타자료", memo: "엑셀 수주소식", status: "확인완료", comment: "수주소식 엑셀에서 기본 프로젝트 정보를 불러온 더미데이터.", confirmedBy: "박용진 수석 / 2026.05.13 13:17" }
  ];
}

const projectReceiveCompletedProjects = [];

/*
   연계 테스트용 초기화
   - 프로젝트 접수 화면은 빈 입력 상태로 시작합니다.
   - 프로젝트 리스트/작성완료 목록에 기존 수주소식 더미데이터를 자동 등록하지 않습니다.
*/

let selectedProjectReceiveCompletedIndex = 0;
let selectedProjectReceiveDbImportIndex = 0;

let projectReceiveState = JSON.parse(JSON.stringify(projectReceiveDefaultData));

function setProjectReceiveValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function getProjectReceiveValue(id) {
  return document.getElementById(id)?.value || "";
}

function normalizeProjectReceiveFloorPart(value, type) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const compact = raw.replace(/\s+/g, "");
  const isBasement = type === "basement";
  const prefixText = isBasement ? "지하" : "지상";

  if (compact.includes(prefixText)) return compact.endsWith("층") ? compact : `${compact}층`;

  const letter = isBasement ? "B" : "S";
  const match = compact.match(new RegExp(`${letter}\\s*([0-9]+)`, "i"));
  if (match) return `${prefixText}${match[1]}층`;

  const numberMatch = compact.match(/([0-9]+)/);
  if (numberMatch) return `${prefixText}${numberMatch[1]}층`;

  return raw;
}

function parseProjectReceiveFloors(value) {
  const raw = String(value || "").trim();
  if (!raw) return { basementFloors: "", groundFloors: "" };
  const parts = raw.split(/[\/|,]/).map(item => item.trim()).filter(Boolean);
  let basementRaw = parts.find(item => /^B/i.test(item) || item.includes("지하")) || "";
  let groundRaw = parts.find(item => /^S/i.test(item) || item.includes("지상")) || "";

  if (!basementRaw && !groundRaw && parts.length >= 2) {
    basementRaw = parts[0];
    groundRaw = parts[1];
  }

  return {
    basementFloors: normalizeProjectReceiveFloorPart(basementRaw, "basement"),
    groundFloors: normalizeProjectReceiveFloorPart(groundRaw, "ground")
  };
}

function getProjectReceiveFloorNumber(value) {
  const match = String(value || "").match(/([0-9]+)/);
  return match ? match[1] : "";
}

function composeProjectReceiveFloors(basementFloors, groundFloors) {
  const basementNo = getProjectReceiveFloorNumber(basementFloors);
  const groundNo = getProjectReceiveFloorNumber(groundFloors);
  if (basementNo && groundNo) return `B${basementNo}/S${groundNo}`;
  if (basementNo) return `B${basementNo}`;
  if (groundNo) return `S${groundNo}`;
  return "";
}

function normalizeProjectReceiveFloorState(target = projectReceiveState) {
  if (!target) return;
  const parsed = parseProjectReceiveFloors(target.floors || "");
  target.basementFloors = target.basementFloors || parsed.basementFloors;
  target.groundFloors = target.groundFloors || parsed.groundFloors;
  target.floors = composeProjectReceiveFloors(target.basementFloors, target.groundFloors) || target.floors || "";
}


function ensureProjectReceiveScopeOptions() {
  const required = [
    { label: "클레임", checked: false },
    { label: "골조성", checked: false, children: [
      { label: "가설", checked: false },
      { label: "단열", checked: false },
      { label: "견출", checked: false },
      { label: "방수턱", checked: false }
    ] }
  ];
  if (!Array.isArray(projectReceiveState.scopes)) projectReceiveState.scopes = [];
  required.forEach(option => {
    const found = projectReceiveState.scopes.find(item => item.label === option.label);
    if (!found) {
      projectReceiveState.scopes.push(JSON.parse(JSON.stringify(option)));
      return;
    }
    if (option.children) {
      if (!Array.isArray(found.children)) found.children = [];
      option.children.forEach(child => {
        if (!found.children.find(item => item.label === child.label)) found.children.push({ ...child });
      });
    }
  });
}


function projectReceiveNormalizeLinkedValue(value) {
  return String(value || "").replace(/\s+/g, "").trim();
}

function projectReceiveLinkedValuesFromBusinessTypes(data = {}) {
  const selected = (Array.isArray(data.businessTypes) ? data.businessTypes : [])
    .filter(item => typeof item === "string" ? item : item?.checked)
    .map(item => typeof item === "string" ? item : item.label);
  const text = selected.join(" ");
  let unitWork = String(data.unitPrice || "").trim();
  let bid = String(data.bid || data.businessNature || "").trim();

  if (!unitWork) {
    if (/설계가|설계예가|설계변경/.test(text)) unitWork = "설계예가";
    else if (/정미견적/.test(text)) unitWork = "공내역서";
    else if (/개산견적/.test(text)) unitWork = "개산견적";
    else if (/기타/.test(text)) unitWork = "기타";
  }

  if (!bid) {
    if (/본사\s*입찰|입찰/.test(text)) bid = "입찰";
    else if (/본사\s*실행|현장\s*실행|실행/.test(text)) bid = "실행";
    else if (/공사비\s*검증|검증/.test(text)) bid = "공사비검증";
    else if (/클레임/.test(text)) bid = "클레임";
    else if (/개산견적/.test(text)) bid = "개산견적";
  }

  return { unitWork, bid };
}

function projectReceiveBusinessTypesFromLinkedValues(unitWork = "", bid = "", fallbackText = "") {
  const source = [unitWork, bid, fallbackText].filter(Boolean).join(" ");
  return projectReceiveDefaultData.businessTypes.map(option => {
    const label = option.label;
    const normalized = projectReceiveNormalizeLinkedValue(source);
    const checked = (label === "개산견적" && /개산견적/.test(source))
      || (label === "정미견적" && /(정미견적|공내역서|비교내역서)/.test(source))
      || (label === "설계가" && /(설계가|설계예가)/.test(source))
      || (label === "설계변경" && /설계변경/.test(source))
      || (label === "공사비 검증" && /(공사비\s*검증|공사비검증|검증)/.test(source))
      || (label === "클레임" && /클레임/.test(source))
      || (label === "본사 입찰" && /입찰/.test(source))
      || (label === "본사 실행" && /실행/.test(source))
      || (label === "현장 실행" && /현장실행/.test(normalized))
      || (label === "기타" && /(기타|턴키)/.test(source));
    return { ...option, checked: !!checked };
  });
}

function projectReceiveApplyEstimateRequestLink(data = {}, row = {}) {
  if (!data || !row) return data;
  if (row.project) data.projectName = row.project;
  if (row.company) data.client = row.company;
  if (row.usage) data.usage = row.usage;
  const unitWork = String(row.unitWork || row.estimateType || data.unitPrice || "").trim();
  const bid = String(row.bid || row.startMode || "").trim();
  data.unitPrice = unitWork || data.unitPrice || "";
  data.businessTypes = projectReceiveBusinessTypesFromLinkedValues(unitWork, bid, [data.projectName, data.workContent, data.request].filter(Boolean).join(" "));
  if (row.scope || row.workType) {
    const linkedScope = typeof estimateRequestSanitizeWorkScope === "function"
      ? estimateRequestSanitizeWorkScope(row.scope || row.workType || "")
      : (row.scope || row.workType || "");
    data.scopes = projectReceiveApplyLabelChecks(linkedScope, projectReceiveDefaultData.scopes);
  }
  data.linkedUnitWork = unitWork;
  data.linkedBid = bid;
  return data;
}

function getProjectReceiveScopeDisplayText(scope) {
  if (!scope?.checked) return "";
  const selectedChildren = (scope.children || []).filter(child => child.checked).map(child => child.label);
  return selectedChildren.length ? `${scope.label}(${selectedChildren.join(" · ")})` : scope.label;
}

function renderProjectReceiveDashboard() {
  ensureProjectReceiveScopeOptions();
  if (!document.getElementById("projectReceiveShell")) return;

  setProjectReceiveValue("receiveProjectName", projectReceiveState.projectName);
  setProjectReceiveValue("receiveProjectNo", projectReceiveState.projectNo);
  setProjectReceiveValue("receiveClient", projectReceiveState.client);
  setProjectReceiveValue("receiveUsage", projectReceiveState.usage);
  setProjectReceiveValue("receiveArea", projectReceiveState.area);
  setProjectReceiveValue("receiveBuildings", projectReceiveState.buildings);
  normalizeProjectReceiveFloorState(projectReceiveState);
  setProjectReceiveValue("receiveBasementFloors", projectReceiveState.basementFloors);
  setProjectReceiveValue("receiveGroundFloors", projectReceiveState.groundFloors);
  setProjectReceiveValue("receiveBidDate", projectReceiveState.bidDate);
  setProjectReceiveValue("receiveUnitPrice", projectReceiveState.unitPrice);
  setProjectReceiveValue("receivePmTotal", projectReceiveState.pmTotal);
  setProjectReceiveValue("receivePmFinish", projectReceiveState.pmFinish);
  setProjectReceiveValue("receivePmStructure", projectReceiveState.pmStructure);
  setProjectReceiveValue("receiveStartDate", projectReceiveState.startDate);
  setProjectReceiveValue("receiveFirstDelivery", projectReceiveState.firstDelivery);
  setProjectReceiveValue("receiveFinalDelivery", projectReceiveState.finalDelivery);
  setProjectReceiveValue("receiveWorkContent", projectReceiveState.workContent);
  setProjectReceiveValue("receiveNotes", projectReceiveState.notes);
  setProjectReceiveValue("receiveRequest", projectReceiveState.request);
  setProjectReceiveValue("receiveWebhardUrl", projectReceiveState.webhardUrl);
  setProjectReceiveValue("receiveWebhardId", projectReceiveState.webhardId);
  setProjectReceiveValue("receiveWebhardPw", projectReceiveState.webhardPw);
  setProjectReceiveValue("receiveWebhardNote", projectReceiveState.webhardNote);

  renderProjectReceiveStatus();
  renderProjectReceiveChips("receiveBusinessTypeChips", "businessTypes");
  renderProjectReceiveChips("receiveScopeChips", "scopes");
  renderProjectReceiveContacts();
  renderProjectReceiveMaterials();
}

function renderProjectReceiveStatus() {
  const el = document.getElementById("projectReceiveStatus");
  if (!el) return;
  const checkedScope = projectReceiveState.scopes.map(getProjectReceiveScopeDisplayText).filter(Boolean);
  const checkedMaterials = projectReceiveState.materials.filter(item => normalizeProjectReceiveMaterialStatus(item) !== "미접수").length;
  el.innerHTML = `
    <div><span>접수상태</span><strong>작성중</strong></div>
    <div><span>선택 범위</span><strong>${checkedScope.length ? checkedScope.join(" · ") : "미선택"}</strong></div>
    <div><span>접수자료</span><strong>${checkedMaterials}/${projectReceiveState.materials.length}건</strong></div>
    <div><span>납품기준</span><strong>${projectReceiveState.firstDelivery || "미입력"}</strong></div>
  `;
}

function renderProjectReceiveChips(targetId, stateKey) {
  const wrap = document.getElementById(targetId);
  if (!wrap) return;
  wrap.innerHTML = projectReceiveState[stateKey].map((item, index) => {
    const childHtml = item.children && item.checked ? `
      <div class="receive-subchip-group">
        ${item.children.map((child, childIndex) => `
          <button class="receive-subchip ${child.checked ? "active" : ""}" type="button" onclick="toggleProjectReceiveScopeChild(${index}, ${childIndex}); event.stopPropagation();">
            <span>${child.checked ? "✓" : "+"}</span>${child.label}
          </button>
        `).join("")}
      </div>
    ` : "";
    return `
      <div class="receive-chip-wrap ${item.children ? "has-subchips" : ""}">
        <button class="receive-chip ${item.checked ? "active" : ""}" type="button" onclick="toggleProjectReceiveChip('${stateKey}', ${index})">
          <span>${item.checked ? "✓" : "+"}</span>${item.label}
        </button>
        ${childHtml}
      </div>
    `;
  }).join("");
}

function toggleProjectReceiveChip(stateKey, index) {
  if (!projectReceiveState[stateKey]?.[index]) return;
  const item = projectReceiveState[stateKey][index];
  item.checked = !item.checked;
  if (!item.checked && item.children) item.children.forEach(child => { child.checked = false; });
  renderProjectReceiveDashboard();
}

function toggleProjectReceiveScopeChild(scopeIndex, childIndex) {
  const scope = projectReceiveState.scopes?.[scopeIndex];
  const child = scope?.children?.[childIndex];
  if (!scope || !child) return;
  scope.checked = true;
  child.checked = !child.checked;
  renderProjectReceiveDashboard();
}

function renderProjectReceiveContacts() {
  const list = document.getElementById("receiveContactList");
  if (!list) return;
  list.innerHTML = projectReceiveState.contacts.map((contact, index) => `
    <div class="receive-contact-row">
      <div class="receive-contact-row-index">담당자 ${index + 1}</div>
      <label class="receive-field"><span>이름</span><input value="${escapeProjectReceiveHtml(contact.name)}" oninput="updateProjectReceiveContact(${index}, 'name', this.value)" /></label>
      <label class="receive-field"><span>직급</span><input value="${escapeProjectReceiveHtml(contact.role)}" oninput="updateProjectReceiveContact(${index}, 'role', this.value)" /></label>
      <label class="receive-field"><span>부서</span><input value="${escapeProjectReceiveHtml(contact.dept)}" oninput="updateProjectReceiveContact(${index}, 'dept', this.value)" /></label>
      <label class="receive-field"><span>일반전화</span><input value="${escapeProjectReceiveHtml(contact.tel)}" oninput="updateProjectReceiveContact(${index}, 'tel', this.value)" /></label>
      <label class="receive-field"><span>휴대폰</span><input value="${escapeProjectReceiveHtml(contact.mobile)}" oninput="updateProjectReceiveContact(${index}, 'mobile', this.value)" /></label>
      <label class="receive-field"><span>이메일</span><input value="${escapeProjectReceiveHtml(contact.email)}" oninput="updateProjectReceiveContact(${index}, 'email', this.value)" /></label>
      <button class="receive-contact-delete" type="button" onclick="removeProjectReceiveContact(${index})">삭제</button>
    </div>
  `).join("");
}

function updateProjectReceiveContact(index, key, value) {
  if (!projectReceiveState.contacts[index]) return;
  projectReceiveState.contacts[index][key] = value;
}

function addProjectReceiveContact() {
  projectReceiveState.contacts.push({ name: "", role: "", dept: "", tel: "", mobile: "", email: "" });
  renderProjectReceiveContacts();
}

function removeProjectReceiveContact(index) {
  if (projectReceiveState.contacts.length === 1) {
    projectReceiveState.contacts = [{ name: "", role: "", dept: "", tel: "", mobile: "", email: "" }];
  } else {
    projectReceiveState.contacts.splice(index, 1);
  }
  renderProjectReceiveContacts();
}

function renderProjectReceiveMaterials() {
  const list = document.getElementById("receiveMaterialList");
  if (!list) return;
  list.innerHTML = `
    <div class="receive-material-toolbar">
      <button class="receive-material-add-btn" type="button" onclick="addProjectReceiveMaterial()">+ 행 추가</button>
    </div>
    ${projectReceiveState.materials.map((item, index) => {
      const status = normalizeProjectReceiveMaterialStatus(item);
      const comment = item.comment || getProjectReceiveMaterialDefaultComment(status);
      const hasHistory = Boolean(item.confirmedBy);
      return `
      <div class="receive-material-item status-${getProjectReceiveMaterialStatusClass(status)}">
        <div class="receive-material-name">${escapeProjectReceiveHtml(item.label)}</div>
        <input class="receive-material-memo" value="${escapeProjectReceiveHtml(item.memo)}" placeholder="접수일 또는 메모" oninput="updateProjectReceiveMaterialMemo(${index}, this.value)" />
        <div class="receive-material-status-actions" role="group" aria-label="${escapeProjectReceiveHtml(item.label)} 접수 상태">
          ${["확인완료", "미접수", "일부접수"].map(option => `
            <button class="receive-material-status-btn ${status === option ? "active" : ""}" type="button" onclick="setProjectReceiveMaterialStatus(${index}, '${option}')">${option}</button>
          `).join("")}
        </div>
        <div class="receive-material-history">${hasHistory ? `확인: ${escapeProjectReceiveHtml(item.confirmedBy)}` : "확인 이력 없음"}</div>
        <button class="receive-material-delete-btn" type="button" onclick="removeProjectReceiveMaterial(${index})">삭제</button>
        <textarea class="receive-material-comment" rows="2" placeholder="미접수 또는 일부접수 사유/코멘트" oninput="updateProjectReceiveMaterialComment(${index}, this.value)">${escapeProjectReceiveHtml(comment)}</textarea>
        <div class="receive-material-attach-area">
          <button class="receive-material-attach-btn" type="button" onclick="openProjectReceiveMaterialUploadModal(${index})">파일첨부</button>
          <span>${getProjectReceiveMaterialUploadCountText(item)}</span>
        </div>
      </div>
    `;
    }).join("")}
  `;
}

function normalizeProjectReceiveMaterialStatus(item) {
  if (item?.status) return item.status;
  if (item?.confirmed) return "확인완료";
  if (item?.checked) return "일부접수";
  return "미접수";
}

function getProjectReceiveMaterialStatusClass(status) {
  if (status === "확인완료") return "complete";
  if (status === "일부접수") return "partial";
  return "missing";
}

function getProjectReceiveMaterialDefaultComment(status) {
  if (status === "일부접수") return "건축 구조 도면은 접수 받았으나 계약범위인 토목도서는 미접수 되었으므로 담당자 확인요망";
  if (status === "미접수") return "자료 미접수 상태입니다. 발주처 담당자 확인이 필요합니다.";
  return "";
}

function updateProjectReceiveMaterialMemo(index, value) {
  if (!projectReceiveState.materials[index]) return;
  projectReceiveState.materials[index].memo = value;
}

function updateProjectReceiveMaterialComment(index, value) {
  if (!projectReceiveState.materials[index]) return;
  projectReceiveState.materials[index].comment = value;
}

function getProjectReceiveMaterialUploadCountText(item) {
  const count = Array.isArray(item?.uploads) ? item.uploads.length : 0;
  return count ? `접수자료 ${count}건` : "첨부 없음";
}

function getProjectReceiveUploadStamp() {
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function ensureProjectReceiveMaterialUploads(index) {
  const item = projectReceiveState.materials[index];
  if (!item) return [];
  if (!Array.isArray(item.uploads)) item.uploads = [];
  return item.uploads;
}

let projectReceiveUploadMaterialIndex = null;

function openProjectReceiveMaterialUploadModal(index) {
  if (!projectReceiveState.materials[index]) return;
  projectReceiveUploadMaterialIndex = index;
  ensureProjectReceiveMaterialUploadModal();
  renderProjectReceiveMaterialUploadModal();
  document.getElementById("projectReceiveMaterialUploadModal")?.classList.add("active");
}

function closeProjectReceiveMaterialUploadModal() {
  document.getElementById("projectReceiveMaterialUploadModal")?.classList.remove("active");
  projectReceiveUploadMaterialIndex = null;
}

function ensureProjectReceiveMaterialUploadModal() {
  if (document.getElementById("projectReceiveMaterialUploadModal")) return;
  const modal = document.createElement("div");
  modal.id = "projectReceiveMaterialUploadModal";
  modal.className = "modal-backdrop receive-upload-modal";
  modal.innerHTML = `
    <div class="modal receive-upload-box">
      <div class="modal-head">
        <div>
          <h2 id="receiveUploadModalTitle">접수자료 파일첨부</h2>
          <p class="subcopy">파일을 추가할 때마다 접수자료(1차), 접수자료(2차) 순서로 이력이 생성됩니다.</p>
        </div>
        <button class="close" type="button" onclick="closeProjectReceiveMaterialUploadModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="receive-upload-control">
          <label class="receive-upload-button">
            <input id="receiveUploadFileInput" type="file" onchange="addProjectReceiveMaterialUploadFromInput(this)" />
            <span>업로드 파일 선택</span>
          </label>
          <em>파일 선택 시 현재 날짜와 함께 접수자료 차수가 자동 기록됩니다.</em>
        </div>
        <div id="receiveUploadHistoryList" class="receive-upload-history-list"></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-line" type="button" onclick="closeProjectReceiveMaterialUploadModal()">닫기</button>
      </div>
    </div>
  `;
  modal.addEventListener("click", event => {
    if (event.target === modal) closeProjectReceiveMaterialUploadModal();
  });
  document.body.appendChild(modal);
}

function addProjectReceiveMaterialUploadFromInput(input) {
  const index = projectReceiveUploadMaterialIndex;
  const item = projectReceiveState.materials[index];
  const file = input?.files?.[0];
  if (!item || !file) return;
  const uploads = ensureProjectReceiveMaterialUploads(index);
  const nextRound = uploads.length + 1;
  uploads.push({
    round: nextRound,
    title: `접수자료(${nextRound}차)`,
    fileName: file.name,
    uploadedAt: getProjectReceiveUploadStamp(),
    phoneComment: ""
  });
  input.value = "";
  if (item.status === "미접수") {
    item.status = "일부접수";
    item.checked = true;
    item.confirmedBy = getProjectReceiveConfirmStamp();
  }
  renderProjectReceiveMaterialUploadModal();
  renderProjectReceiveMaterials();
  renderProjectReceiveStatus();
}

function renderProjectReceiveMaterialUploadModal() {
  const index = projectReceiveUploadMaterialIndex;
  const item = projectReceiveState.materials[index];
  const title = document.getElementById("receiveUploadModalTitle");
  const list = document.getElementById("receiveUploadHistoryList");
  if (!item || !list) return;
  if (title) title.textContent = `${item.label} 파일첨부`;
  const uploads = ensureProjectReceiveMaterialUploads(index);
  if (!uploads.length) {
    list.innerHTML = `<div class="receive-upload-empty">아직 첨부된 파일이 없습니다.</div>`;
    return;
  }
  list.innerHTML = uploads.map((upload, uploadIndex) => `
    <div class="receive-upload-history-item">
      <div class="receive-upload-history-main">
        <strong>${escapeProjectReceiveHtml(upload.title || `접수자료(${uploadIndex + 1}차)`)}</strong>
        <span>${escapeProjectReceiveHtml(upload.fileName || "파일명 없음")}</span>
        <em>최초 업로드: ${escapeProjectReceiveHtml(upload.uploadedAt || "날짜 없음")}</em>
      </div>
      <textarea rows="2" placeholder="경영지원팀 유선 확인 내용 또는 추가 코멘트" oninput="updateProjectReceiveMaterialUploadComment(${index}, ${uploadIndex}, this.value)">${escapeProjectReceiveHtml(upload.phoneComment || "")}</textarea>
      <button class="receive-upload-remove-btn" type="button" onclick="removeProjectReceiveMaterialUpload(${index}, ${uploadIndex})">삭제</button>
    </div>
  `).join("");
}

function updateProjectReceiveMaterialUploadComment(materialIndex, uploadIndex, value) {
  const uploads = ensureProjectReceiveMaterialUploads(materialIndex);
  if (!uploads[uploadIndex]) return;
  uploads[uploadIndex].phoneComment = value;
}

function removeProjectReceiveMaterialUpload(materialIndex, uploadIndex) {
  const uploads = ensureProjectReceiveMaterialUploads(materialIndex);
  if (!uploads[uploadIndex]) return;
  uploads.splice(uploadIndex, 1);
  uploads.forEach((upload, index) => {
    upload.round = index + 1;
    upload.title = `접수자료(${index + 1}차)`;
  });
  renderProjectReceiveMaterialUploadModal();
  renderProjectReceiveMaterials();
  renderProjectReceiveStatus();
}

function addProjectReceiveMaterial() {
  projectReceiveState.materials.push({
    label: "추가자료",
    memo: "",
    status: "미접수",
    comment: "접수받은 내용 없음.",
    confirmedBy: "",
    uploads: []
  });
  renderProjectReceiveMaterials();
  renderProjectReceiveStatus();
}

function removeProjectReceiveMaterial(index) {
  if (!projectReceiveState.materials[index]) return;
  if (projectReceiveState.materials.length <= 1) {
    projectReceiveState.materials = [{ label: "기타자료", memo: "", status: "미접수", comment: "접수받은 내용 없음.", confirmedBy: "", uploads: [] }];
  } else {
    projectReceiveState.materials.splice(index, 1);
  }
  renderProjectReceiveMaterials();
  renderProjectReceiveStatus();
}

function setProjectReceiveMaterialStatus(index, status) {
  if (!projectReceiveState.materials[index]) return;
  const item = projectReceiveState.materials[index];
  item.status = status;
  item.checked = status !== "미접수";
  item.confirmed = status === "확인완료";
  item.confirmedBy = getProjectReceiveConfirmStamp();
  if ((status === "미접수" || status === "일부접수") && !item.comment) {
    item.comment = getProjectReceiveMaterialDefaultComment(status);
  }
  if (status === "확인완료" && !item.comment) {
    item.comment = `${item.label} 접수 확인.`;
  }
  renderProjectReceiveMaterials();
  renderProjectReceiveStatus();
}

function toggleProjectReceiveMaterial(index, checked) {
  if (!projectReceiveState.materials[index]) return;
  setProjectReceiveMaterialStatus(index, checked ? "확인완료" : "미접수");
}

function confirmProjectReceiveMaterial(index) {
  if (!projectReceiveState.materials[index]) return;
  const currentStatus = normalizeProjectReceiveMaterialStatus(projectReceiveState.materials[index]);
  setProjectReceiveMaterialStatus(index, currentStatus === "확인완료" ? "미접수" : "확인완료");
}

function syncProjectReceiveInputsToState() {
  projectReceiveState.projectName = getProjectReceiveValue("receiveProjectName");
  projectReceiveState.projectNo = getProjectReceiveValue("receiveProjectNo");
  projectReceiveState.client = getProjectReceiveValue("receiveClient");
  projectReceiveState.usage = getProjectReceiveValue("receiveUsage");
  projectReceiveState.area = getProjectReceiveValue("receiveArea");
  projectReceiveState.buildings = getProjectReceiveValue("receiveBuildings");
  projectReceiveState.basementFloors = normalizeProjectReceiveFloorPart(getProjectReceiveValue("receiveBasementFloors"), "basement");
  projectReceiveState.groundFloors = normalizeProjectReceiveFloorPart(getProjectReceiveValue("receiveGroundFloors"), "ground");
  projectReceiveState.floors = composeProjectReceiveFloors(projectReceiveState.basementFloors, projectReceiveState.groundFloors);
  projectReceiveState.bidDate = getProjectReceiveValue("receiveBidDate");
  projectReceiveState.unitPrice = getProjectReceiveValue("receiveUnitPrice");
  const linkedProjectReceiveBusiness = projectReceiveLinkedValuesFromBusinessTypes(projectReceiveState);
  projectReceiveState.linkedUnitWork = projectReceiveState.unitPrice || linkedProjectReceiveBusiness.unitWork || "";
  projectReceiveState.linkedBid = linkedProjectReceiveBusiness.bid || "";
  projectReceiveState.pmTotal = getProjectReceiveValue("receivePmTotal");
  projectReceiveState.pmFinish = getProjectReceiveValue("receivePmFinish");
  projectReceiveState.pmStructure = getProjectReceiveValue("receivePmStructure");
  projectReceiveState.startDate = getProjectReceiveValue("receiveStartDate");
  projectReceiveState.firstDelivery = getProjectReceiveValue("receiveFirstDelivery");
  projectReceiveState.finalDelivery = getProjectReceiveValue("receiveFinalDelivery");
  projectReceiveState.workContent = getProjectReceiveValue("receiveWorkContent");
  projectReceiveState.notes = getProjectReceiveValue("receiveNotes");
  projectReceiveState.request = getProjectReceiveValue("receiveRequest");
  projectReceiveState.webhardUrl = getProjectReceiveValue("receiveWebhardUrl");
  projectReceiveState.webhardId = getProjectReceiveValue("receiveWebhardId");
  projectReceiveState.webhardPw = getProjectReceiveValue("receiveWebhardPw");
  projectReceiveState.webhardNote = getProjectReceiveValue("receiveWebhardNote");
}

function saveProjectReceiveDraft() {
  syncProjectReceiveInputsToState();
  if (!validateProjectReceiveSkeletonScope()) {
    renderProjectReceiveDashboard();
    showToast("골조성을 선택한 경우 가설, 단열, 견출, 방수턱 중 최소 1개를 선택해야 접수저장이 가능합니다.");
    return;
  }
  renderProjectReceiveStatus();
  if (typeof registerPmScheduleProjectFromReceive === "function") {
    registerPmScheduleProjectFromReceive(projectReceiveState);
  } else {
    showToast("프로젝트 접수 내용이 임시 저장되었습니다.");
  }
}

function resetProjectReceiveForm() {
  projectReceiveState = JSON.parse(JSON.stringify(projectReceiveDefaultData));
  renderProjectReceiveDashboard();
  showToast("프로젝트 접수 입력값을 초기화했습니다.");
}

function loadProjectReceiveSample() {
  projectReceiveState = JSON.parse(JSON.stringify(projectReceiveDefaultData));
  renderProjectReceiveDashboard();
  showToast("연계 테스트를 위해 예시 더미데이터 불러오기를 비활성화했습니다.");
}


function openProjectReceiveCompletedList() {
  ensureProjectReceiveCompletedModal();
  selectedProjectReceiveCompletedIndex = 0;
  renderProjectReceiveCompletedList();
  document.getElementById("projectReceiveCompletedModal")?.classList.add("active");
}

function closeProjectReceiveCompletedList() {
  document.getElementById("projectReceiveCompletedModal")?.classList.remove("active");
}

function ensureProjectReceiveCompletedModal() {
  if (document.getElementById("projectReceiveCompletedModal")) return;
  const modal = document.createElement("div");
  modal.id = "projectReceiveCompletedModal";
  modal.className = "modal-backdrop project-receive-completed-modal";
  modal.innerHTML = `
    <div class="modal project-receive-completed-box">
      <div class="modal-head">
        <div>
          <h3>작성완료 리스트</h3>
          <p>업로드된 엑셀 자료 기준으로 작성 완료된 수주소식을 선택해 수정할 수 있습니다.</p>
        </div>
        <button class="close" type="button" onclick="closeProjectReceiveCompletedList()">×</button>
      </div>
      <div class="modal-body">
        <div class="project-receive-completed-summary">
          <strong>총 ${projectReceiveCompletedProjects.length}건</strong>
          <span>프로젝트를 클릭한 뒤 하단의 수정 버튼을 누르면 접수 화면으로 불러옵니다.</span>
        </div>
        <div class="project-receive-completed-list" id="projectReceiveCompletedList"></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-line" type="button" onclick="closeProjectReceiveCompletedList()">닫기</button>
        <button class="btn btn-primary" type="button" onclick="loadSelectedProjectReceiveCompleted()">선택 프로젝트 수정</button>
      </div>
    </div>
  `;
  modal.addEventListener("click", event => {
    if (event.target === modal) closeProjectReceiveCompletedList();
  });
  document.body.appendChild(modal);
}

function renderProjectReceiveCompletedList() {
  const list = document.getElementById("projectReceiveCompletedList");
  if (!list) return;
  list.innerHTML = projectReceiveCompletedProjects.map((item, index) => {
    const data = item.data;
    const scopeText = data.scopes.map(getProjectReceiveScopeDisplayText).filter(Boolean).join(" · ") || "미선택";
    return `
      <button class="project-receive-completed-item ${selectedProjectReceiveCompletedIndex === index ? "active" : ""}" type="button" onclick="selectProjectReceiveCompleted(${index})">
        <span class="completed-no">${escapeProjectReceiveHtml(data.projectNo)}</span>
        <span class="completed-main">
          <strong>${escapeProjectReceiveHtml(data.projectName)}</strong>
          <em>${escapeProjectReceiveHtml(data.client)} · ${escapeProjectReceiveHtml(scopeText)}</em>
          <small>${escapeProjectReceiveHtml(item.sourceFile)}</small>
        </span>
        <span class="completed-date">작성완료<br>${escapeProjectReceiveHtml(item.completedAt)}</span>
      </button>
    `;
  }).join("");
}

function selectProjectReceiveCompleted(index) {
  selectedProjectReceiveCompletedIndex = index;
  renderProjectReceiveCompletedList();
}

function loadSelectedProjectReceiveCompleted() {
  const selected = projectReceiveCompletedProjects[selectedProjectReceiveCompletedIndex];
  if (!selected) return;
  projectReceiveState = JSON.parse(JSON.stringify(selected.data));
  renderProjectReceiveDashboard();
  closeProjectReceiveCompletedList();
  showToast(`${selected.data.projectNo} 수주소식을 수정 화면으로 불러왔습니다.`);
}


/* =========================================================
   프로젝트 접수: DB자료 불러오기
   - DB관리(PJ관리)에만 존재하고 프로젝트 접수/리스트에 등록되지 않은 데이터를 수동 선택해 정식 프로젝트 리스트에 등록
   - DB 단계는 후보 데이터이므로 자동 등록하지 않고, 사용자가 선택한 건만 프로젝트 리스트 기준 데이터로 편입
========================================================= */
function projectReceiveNormalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function projectReceiveDbHeaderIndex(headerName) {
  if (typeof getEstimateDbColumnIndexByHeader === "function") {
    const idx = getEstimateDbColumnIndexByHeader("pj", headerName);
    if (idx >= 0) return idx;
  }
  const sheet = typeof estimateDbSheets !== "undefined" ? estimateDbSheets?.pj : null;
  const headers = Array.isArray(sheet?.headerRows?.[0]) ? sheet.headerRows[0] : [];
  return headers.findIndex(header => projectReceiveNormalizeText(header) === projectReceiveNormalizeText(headerName));
}

function projectReceiveDbCell(row, headerName) {
  const idx = projectReceiveDbHeaderIndex(headerName);
  return idx >= 0 ? String(row?.[idx] ?? "").trim() : "";
}

function projectReceiveFormatDbDate(value) {
  const text = projectReceiveNormalizeText(value);
  if (!text) return "";
  const m = text.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
  if (m) return `${m[1]}.${String(m[2]).padStart(2, "0")}.${String(m[3]).padStart(2, "0")}`;
  const compact = text.replace(/[^0-9]/g, "");
  if (compact.length === 6) return `20${compact.slice(0, 2)}.${compact.slice(2, 4)}.${compact.slice(4, 6)}`;
  if (compact.length === 8) return `${compact.slice(0, 4)}.${compact.slice(4, 6)}.${compact.slice(6, 8)}`;
  return text;
}

function projectReceiveBuildContactsFromDbRow(row) {
  const name = projectReceiveDbCell(row, "거래처담당자") || projectReceiveDbCell(row, "담당자");
  const dept = projectReceiveDbCell(row, "거래처");
  const role = projectReceiveDbCell(row, "직급");
  const tel = projectReceiveDbCell(row, "일반전화") || projectReceiveDbCell(row, "직통전화");
  const mobile = projectReceiveDbCell(row, "휴대폰");
  const email = projectReceiveDbCell(row, "EMAIL") || projectReceiveDbCell(row, "EMAIL2");
  return [{ name, role, dept, tel, mobile, email }];
}

function projectReceiveApplyLabelChecks(sourceText, items) {
  const source = projectReceiveNormalizeText(sourceText);
  return (items || []).map(item => ({
    ...item,
    checked: source ? source.includes(item.label) || item.label.split(/[ㆍ·,/]/).some(part => part && source.includes(part.trim())) : false,
    children: item.children ? item.children.map(child => ({
      ...child,
      checked: source ? source.includes(child.label) : false
    })) : undefined
  }));
}

function projectReceiveDataFromDbPjRow(row, sourceIndex = -1) {
  const projectName = projectReceiveDbCell(row, "프로젝트명");
  const client = projectReceiveDbCell(row, "거래처명") || projectReceiveDbCell(row, "의뢰처");
  const floors = projectReceiveDbCell(row, "층수");
  const parsedFloors = typeof parseProjectReceiveFloors === "function" ? parseProjectReceiveFloors(floors) : { basementFloors: "", groundFloors: "" };
  const workType = projectReceiveDbCell(row, "작업공종");
  const businessType = [projectReceiveDbCell(row, "업무성격"), projectReceiveDbCell(row, "업무단계2")].filter(Boolean).join(" ");
  const webhardNote = [
    projectReceiveDbCell(row, "폴더명 / 자료위치") ? `폴더명 / 자료위치: ${projectReceiveDbCell(row, "폴더명 / 자료위치")}` : "",
    projectReceiveDbCell(row, "기타") ? `기타: ${projectReceiveDbCell(row, "기타")}` : ""
  ].filter(Boolean).join(" / ");
  const memo = projectReceiveDbCell(row, "상담 / 이메일 / 특기사항");
  const data = JSON.parse(JSON.stringify(projectReceiveDefaultData));
  data.projectNo = projectReceiveDbCell(row, "PJ NO");
  data.dbPjNo = data.projectNo;
  data.dbPjRowIndex = sourceIndex;
  data.projectLink = projectReceiveDbCell(row, "프로젝트 연결");
  data.projectName = projectName;
  data.client = client;
  data.usage = projectReceiveDbCell(row, "건물용도");
  data.area = projectReceiveDbCell(row, "연면적(평)") || projectReceiveDbCell(row, "연면적(m2)");
  data.buildings = projectReceiveDbCell(row, "동수");
  data.floors = floors;
  data.basementFloors = parsedFloors.basementFloors || "";
  data.groundFloors = parsedFloors.groundFloors || "";
  data.bidDate = projectReceiveFormatDbDate(projectReceiveDbCell(row, "입찰일") || projectReceiveDbCell(row, "입찰월"));
  const linkedUnitWork = projectReceiveDbCell(row, "단가작업여부") || projectReceiveDbCell(row, "작업구분");
  const linkedBid = projectReceiveDbCell(row, "업무성격");
  data.unitPrice = linkedUnitWork;
  data.linkedUnitWork = linkedUnitWork;
  data.linkedBid = linkedBid;
  data.businessTypes = projectReceiveBusinessTypesFromLinkedValues(linkedUnitWork, linkedBid, businessType || projectName);
  data.scopes = projectReceiveApplyLabelChecks(`${workType} ${projectName}`, projectReceiveDefaultData.scopes);
  data.contacts = projectReceiveBuildContactsFromDbRow(row);
  data.webhardUrl = projectReceiveDbCell(row, "웹하드");
  data.webhardId = projectReceiveDbCell(row, "ID");
  data.webhardPw = projectReceiveDbCell(row, "PW");
  data.webhardNote = webhardNote;
  data.pmFinish = projectReceiveDbCell(row, "PM(마감)");
  data.pmStructure = projectReceiveDbCell(row, "PM(구조)");
  data.pmBim = projectReceiveDbCell(row, "PM(BIM)") || projectReceiveDbCell(row, "BIM파트 PM");
  data.pmCivil = projectReceiveDbCell(row, "PM(토목,조경)");
  data.pmTotal = [data.pmFinish, data.pmStructure, data.pmBim, data.pmCivil].filter(Boolean).join(" / ");
  data.startDate = projectReceiveFormatDbDate(projectReceiveDbCell(row, "작업착수일자"));
  data.firstDelivery = projectReceiveFormatDbDate(projectReceiveDbCell(row, "1차납품예정일"));
  data.finalDelivery = projectReceiveFormatDbDate(projectReceiveDbCell(row, "2차납품예정일"));
  data.workContent = [workType, projectReceiveDbCell(row, "작업구분"), projectReceiveDbCell(row, "업무성격")].filter(Boolean).join(" / ");
  data.notes = memo;
  data.request = memo || projectName;
  return data;
}

function getProjectReceiveDbImportItems() {
  const sheet = typeof estimateDbSheets !== "undefined" ? estimateDbSheets?.pj : null;
  const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
  const registeredKeys = new Set((Array.isArray(projectReceiveCompletedProjects) ? projectReceiveCompletedProjects : []).map(item => projectReceiveLinkKey(item.data || item)));
  return rows.map((row, sourceIndex) => {
    const data = projectReceiveDataFromDbPjRow(row, sourceIndex);
    return { row, sourceIndex, data, key: projectReceiveLinkKey(data) };
  }).filter(item => projectReceiveNormalizeText(item.data.projectName) && !registeredKeys.has(item.key));
}

function openProjectReceiveDbImportList() {
  ensureProjectReceiveDbImportModal();
  selectedProjectReceiveDbImportIndex = 0;
  renderProjectReceiveDbImportList();
  document.getElementById("projectReceiveDbImportModal")?.classList.add("active");
}

function closeProjectReceiveDbImportList() {
  document.getElementById("projectReceiveDbImportModal")?.classList.remove("active");
}

function ensureProjectReceiveDbImportModal() {
  if (document.getElementById("projectReceiveDbImportModal")) return;
  const modal = document.createElement("div");
  modal.id = "projectReceiveDbImportModal";
  modal.className = "modal-backdrop project-receive-completed-modal project-receive-db-import-modal";
  modal.innerHTML = `
    <div class="modal project-receive-completed-box">
      <div class="modal-head">
        <div>
          <h3>DB자료 불러오기</h3>
          <p>DB관리(PJ관리)에만 있는 후보 프로젝트를 선택해 프로젝트 리스트에 등록합니다.</p>
        </div>
        <button class="close" type="button" onclick="closeProjectReceiveDbImportList()">×</button>
      </div>
      <div class="modal-body">
        <div class="project-receive-completed-summary" id="projectReceiveDbImportSummary"></div>
        <div class="project-receive-completed-list" id="projectReceiveDbImportList"></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-line" type="button" onclick="closeProjectReceiveDbImportList()">닫기</button>
        <button class="btn btn-primary" type="button" onclick="loadSelectedProjectReceiveDbImport()">선택 DB자료 등록</button>
      </div>
    </div>
  `;
  modal.addEventListener("click", event => {
    if (event.target === modal) closeProjectReceiveDbImportList();
  });
  document.body.appendChild(modal);
}

function renderProjectReceiveDbImportList() {
  const list = document.getElementById("projectReceiveDbImportList");
  const summary = document.getElementById("projectReceiveDbImportSummary");
  if (!list) return;
  const items = getProjectReceiveDbImportItems();
  if (summary) {
    summary.innerHTML = `<strong>등록 가능 ${items.length}건</strong><span>이미 프로젝트 리스트에 등록된 DB자료는 제외됩니다.</span>`;
  }
  if (!items.length) {
    list.innerHTML = `<div class="project-list-empty">등록할 DB자료가 없습니다.</div>`;
    return;
  }
  if (selectedProjectReceiveDbImportIndex >= items.length) selectedProjectReceiveDbImportIndex = 0;
  list.innerHTML = items.map((item, index) => {
    const data = item.data || {};
    const scopeText = getProjectReceiveListScopeText(data);
    return `
      <button class="project-receive-completed-item ${selectedProjectReceiveDbImportIndex === index ? "active" : ""}" type="button" onclick="selectProjectReceiveDbImport(${index})">
        <span class="completed-no">${escapeProjectReceiveHtml(data.projectNo || "DB")}</span>
        <span class="completed-main">
          <strong>${escapeProjectReceiveHtml(data.projectName || "프로젝트명 미입력")}</strong>
          <em>${escapeProjectReceiveHtml(data.client || "거래처명 미입력")} · ${escapeProjectReceiveHtml(scopeText)}</em>
          <small>DB관리 PJ관리 ${item.sourceIndex + 1}행</small>
        </span>
        <span class="completed-date">DB후보<br>${escapeProjectReceiveHtml(data.firstDelivery || data.startDate || "-")}</span>
      </button>
    `;
  }).join("");
}

function selectProjectReceiveDbImport(index) {
  selectedProjectReceiveDbImportIndex = index;
  renderProjectReceiveDbImportList();
}

function loadSelectedProjectReceiveDbImport() {
  const items = getProjectReceiveDbImportItems();
  const selected = items[selectedProjectReceiveDbImportIndex];
  if (!selected) return;
  projectReceiveState = JSON.parse(JSON.stringify(selected.data));
  projectReceiveUpsertCompleted(projectReceiveState, { sourceFile: "DB관리 PJ관리 수동 불러오기" });
  renderProjectReceiveDashboard();
  if (document.getElementById("projectReceiveListBody")) renderProjectReceiveListView();
  if (typeof registerPmScheduleProjectFromReceive === "function") registerPmScheduleProjectFromReceive(projectReceiveState);
  if (typeof pmRefreshLinkedEstimateProjects === "function") pmRefreshLinkedEstimateProjects();
  closeProjectReceiveDbImportList();
  showToast(`${projectReceiveState.projectNo || projectReceiveState.projectName} DB자료를 프로젝트 리스트에 등록했습니다.`);
}

window.openProjectReceiveDbImportList = openProjectReceiveDbImportList;
window.closeProjectReceiveDbImportList = closeProjectReceiveDbImportList;
window.loadSelectedProjectReceiveDbImport = loadSelectedProjectReceiveDbImport;


function getProjectReceiveConfirmStamp() {
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mi = pad(now.getMinutes());
  return `박용진 수석 / ${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

function escapeProjectReceiveHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function isEstimateDbManageActive() {
  return document.getElementById("estimateDbManage")?.classList.contains("active");
}

function handleEstimateDbScopedCommand(event) {
  if (!isEstimateDbManageActive()) return;
  const key = String(event.key || "");
  const lower = key.toLowerCase();
  const saveKey = event.ctrlKey && lower === "s";
  const linkSaveKey = event.ctrlKey && key === "Enter";
  const commandKey = event.ctrlKey && ["f9", "f3", "delete", "del"].includes(lower);
  const stageAddKey = event.altKey && (key === "Insert" || lower === "insert");
  const arrowKey = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key);
  if (!saveKey && !linkSaveKey && !commandKey && !stageAddKey && !arrowKey) return;

  const active = document.activeElement;
  const activeInput = active?.classList?.contains("quote-db-cell-input") ? active : null;
  if (saveKey) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    commitEstimateDbPendingEdits();
    return;
  }
  if (linkSaveKey) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    syncEstimateDbNewPjRowsToLinkedSheets();
    return;
  }
  if (activeInput && !stageAddKey) return;

  if (stageAddKey) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    if (estimateDbActiveTab === "progress") addEstimateDbProgressStageColumns();
    return;
  }

  if (commandKey) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    const cell = estimateDbSelectedCell || { rowIndex: 0, colIndex: 0 };
    if (lower === "f9") {
      addEstimateDbRow(null, (cell.rowIndex || 0) + 1);
      requestAnimationFrame(() => focusEstimateDbCell((cell.rowIndex || 0) + 1, cell.colIndex || 0));
    } else if (lower === "f3") {
      duplicateEstimateDbRow(cell.rowIndex || 0);
      requestAnimationFrame(() => focusEstimateDbCell((cell.rowIndex || 0) + 1, cell.colIndex || 0));
    } else {
      removeEstimateDbRow(cell.rowIndex || 0);
      requestAnimationFrame(() => focusEstimateDbCell(Math.max(0, (cell.rowIndex || 0) - 1), cell.colIndex || 0));
    }
  }
}

document.addEventListener("keydown", handleEstimateDbScopedCommand, true);

function bootEstimateDbDefaultScreen() {
  const dashboardActive = document.getElementById("workDashboard")?.classList.contains("active");
  if (!dashboardActive && typeof switchWorkPanel === "function") {
    switchWorkPanel("estimateSheetManage");
  }
  estimateDbActiveTab = estimateDbActiveTab || "pj";
  estimateDbReportActiveTab = estimateDbReportActiveTab || "summary";
  renderEstimateDbManage();
  if (!dashboardActive) {
    document.querySelectorAll(".side-sub").forEach(menu => {
      const isEstimate = menu.classList.contains("estimate-quote-sub-menu");
      menu.classList.toggle("active", isEstimate);
    });
    document.querySelectorAll(".project-receive-sub-menu, .pm-schedule-sub-menu").forEach(menu => menu.classList.remove("active"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjectReceiveDashboard();
  setTimeout(bootEstimateDbDefaultScreen, 0);
});


function getProjectReceiveListItems() {
  const completed = (typeof projectReceiveCompletedProjects !== "undefined" ? projectReceiveCompletedProjects : [])
    .map((item, index) => ({
      source: "completed",
      index,
      data: item.data || item,
      status: "작성완료"
    }));

  const current = (typeof projectReceiveState !== "undefined" && projectReceiveState?.projectNo)
    ? [{ source: "current", index: -1, data: projectReceiveState, status: "작성중" }]
    : [];

  const merged = [...current, ...completed];
  const seen = new Set();
  return merged.filter(item => {
    const key = item.data?.projectNo || `${item.data?.projectName || ""}-${item.data?.client || ""}`;
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getProjectReceiveListScopeText(data) {
  const scopes = Array.isArray(data?.scopes) ? data.scopes : [];
  return scopes
    .map(item => typeof item === "string" ? item : (item?.checked ? item.label : ""))
    .filter(Boolean)
    .join(" · ") || "미선택";
}


function getProjectReceivePmAssignment(data = {}) {
  const assignment = {
    pmFinish: data.pmFinish || "",
    pmStructure: data.pmStructure || "",
    pmBim: data.pmBim || "",
    pmCivil: data.pmCivil || ""
  };

  if (typeof pmScheduleProjects !== "undefined" && Array.isArray(pmScheduleProjects)) {
    const projectNo = String(data.projectNo || "").trim();
    const matched = pmScheduleProjects.find(item => String(item?.project?.projectNo || "").trim() === projectNo);
    if (matched?.assignment) {
      assignment.pmFinish = matched.assignment.pmFinish || assignment.pmFinish;
      assignment.pmStructure = matched.assignment.pmStructure || assignment.pmStructure;
      assignment.pmBim = matched.assignment.pmBim || assignment.pmBim;
      assignment.pmCivil = matched.assignment.pmCivil || assignment.pmCivil;
    }
  }

  return assignment;
}

function getProjectReceivePmAssignmentDisplay(data = {}) {
  const assignment = getProjectReceivePmAssignment(data);
  return [
    { label: "마감팀 PM", value: assignment.pmFinish },
    { label: "구조팀 PM", value: assignment.pmStructure },
    { label: "BIM파트 PM", value: assignment.pmBim },
    { label: "토목ㆍ조경파트 PM", value: assignment.pmCivil }
  ];
}

function applyPmScheduleAssignmentToProjectReceiveData(projectNo, assignment = {}) {
  const targetNo = String(projectNo || "").trim();
  if (!targetNo) return;

  const assignTo = data => {
    if (!data || String(data.projectNo || "").trim() !== targetNo) return;
    data.pmFinish = assignment.pmFinish || "";
    data.pmStructure = assignment.pmStructure || "";
    data.pmBim = assignment.pmBim || "";
    data.pmCivil = assignment.pmCivil || "";
  };

  if (typeof projectReceiveState !== "undefined") assignTo(projectReceiveState);
  if (typeof projectReceiveCompletedProjects !== "undefined" && Array.isArray(projectReceiveCompletedProjects)) {
    projectReceiveCompletedProjects.forEach(item => assignTo(item.data || item));
  }

  if (document.getElementById("projectReceiveListBody")) renderProjectReceiveListView();
}

function renderProjectReceiveListView() {
  const body = document.getElementById("projectReceiveListBody");
  const summary = document.getElementById("projectReceiveListSummary");
  if (!body) return;

  const query = (document.getElementById("projectReceiveListSearch")?.value || "").trim().toLowerCase();
  const scopeFilter = document.getElementById("projectReceiveListScopeFilter")?.value || "전체";
  const items = getProjectReceiveListItems();
  const filtered = items.filter(item => {
    const data = item.data || {};
    const scopeText = getProjectReceiveListScopeText(data);
    const searchTarget = [
      data.projectNo,
      data.projectName,
      data.client,
      data.usage,
      data.area,
      data.floors,
      data.basementFloors,
      data.groundFloors,
      scopeText,
      data.firstDelivery,
      item.status
    ].join(" ").toLowerCase();
    const matchesQuery = !query || searchTarget.includes(query);
    const matchesScope = scopeFilter === "전체" || scopeText.includes(scopeFilter);
    return matchesQuery && matchesScope;
  });

  if (summary) {
    const completedCount = items.filter(item => item.status === "작성완료").length;
    const currentCount = items.filter(item => item.status === "작성중").length;
    summary.innerHTML = `
      <div><span>전체 프로젝트</span><strong>${items.length}건</strong></div>
      <div><span>작성완료</span><strong>${completedCount}건</strong></div>
      <div><span>작성중</span><strong>${currentCount}건</strong></div>
      <div><span>현재 표시</span><strong>${filtered.length}건</strong></div>
    `;
  }

  if (!filtered.length) {
    body.innerHTML = `<tr><td colspan="10" class="project-list-empty">조건에 맞는 프로젝트가 없습니다.</td></tr>`;
    return;
  }

  body.innerHTML = filtered.map(item => {
    const data = item.data || {};
    const scopeText = getProjectReceiveListScopeText(data);
    const parsedFloors = parseProjectReceiveFloors(data.floors || "");
    const basementFloors = data.basementFloors || parsedFloors.basementFloors || "-";
    const groundFloors = data.groundFloors || parsedFloors.groundFloors || "-";
    const statusClass = item.status === "작성완료" ? "completed" : "writing";
    return `
      <tr class="project-list-clickable-row" onclick="openProjectReceiveListViewer('${escapeProjectReceiveHtml(item.source)}', ${Number(item.index)})">
        <td><strong>${escapeProjectReceiveHtml(data.projectNo || "-")}</strong></td>
        <td class="project-list-name">${escapeProjectReceiveHtml(data.projectName || "프로젝트명 미입력")}</td>
        <td>${escapeProjectReceiveHtml(data.client || "-")}</td>
        <td>${escapeProjectReceiveHtml(data.usage || "-")}</td>
        <td>${escapeProjectReceiveHtml(data.area || "-")}</td>
        <td>${escapeProjectReceiveHtml(basementFloors)}</td>
        <td>${escapeProjectReceiveHtml(groundFloors)}</td>
        <td>${escapeProjectReceiveHtml(scopeText)}</td>
        <td>${escapeProjectReceiveHtml(data.firstDelivery || "미입력")}</td>
        <td><span class="project-list-status ${statusClass}">${item.status}</span></td>
      </tr>
    `;
  }).join("");
}

function getProjectReceiveViewerItem(source, index) {
  if (source === "current") {
    return { source, index: -1, data: projectReceiveState, status: "작성중" };
  }
  if (source === "completed") {
    const item = projectReceiveCompletedProjects[index];
    return item ? { source, index, data: item.data || item, status: "작성완료", sourceFile: item.sourceFile || "", completedAt: item.completedAt || "" } : null;
  }
  return null;
}

function openProjectReceiveListViewer(source, index) {
  const item = getProjectReceiveViewerItem(source, index);
  if (!item) return;
  ensureProjectReceiveListViewerModal();
  const modal = document.getElementById("projectReceiveListViewerModal");
  const body = document.getElementById("projectReceiveListViewerBody");
  if (!modal || !body) return;

  const data = item.data || {};
  const scopeText = getProjectReceiveListScopeText(data);
  const businessText = (data.businessTypes || []).filter(v => v?.checked).map(v => v.label).join(" · ") || "미선택";
  const parsedFloors = parseProjectReceiveFloors(data.floors || "");
  const basementFloors = data.basementFloors || parsedFloors.basementFloors || "-";
  const groundFloors = data.groundFloors || parsedFloors.groundFloors || "-";
  const pmAssignmentRows = getProjectReceivePmAssignmentDisplay(data);
  const materialText = (data.materials || []).map(material => {
    const status = normalizeProjectReceiveMaterialStatus(material);
    return `<li><strong>${escapeProjectReceiveHtml(material.label || "자료")}</strong><span>${escapeProjectReceiveHtml(status)}</span><em>${escapeProjectReceiveHtml(material.comment || material.memo || "-")}</em></li>`;
  }).join("");

  body.innerHTML = `
    <div class="project-viewer-title-row">
      <div>
        <span class="project-list-status ${item.status === "작성완료" ? "completed" : "writing"}">${escapeProjectReceiveHtml(item.status || "작성중")}</span>
        <h3>${escapeProjectReceiveHtml(data.projectName || "프로젝트명 미입력")}</h3>
        <p>${escapeProjectReceiveHtml(data.projectNo || "NO 미입력")} · ${escapeProjectReceiveHtml(data.client || "의뢰처 미입력")}</p>
      </div>
      <button class="btn btn-primary" type="button" onclick="editProjectReceiveFromViewer('${escapeProjectReceiveHtml(item.source)}', ${Number(item.index)})">수정하기</button>
    </div>

    <div class="project-viewer-grid">
      <div><span>프로젝트 NO</span><strong>${escapeProjectReceiveHtml(data.projectNo || "-")}</strong></div>
      <div><span>의뢰처</span><strong>${escapeProjectReceiveHtml(data.client || "-")}</strong></div>
      <div><span>건물용도</span><strong>${escapeProjectReceiveHtml(data.usage || "-")}</strong></div>
      <div><span>연면적</span><strong>${escapeProjectReceiveHtml(data.area || "-")}</strong></div>
      <div><span>동수</span><strong>${escapeProjectReceiveHtml(data.buildings || "-")}</strong></div>
      <div><span>지하층수</span><strong>${escapeProjectReceiveHtml(basementFloors)}</strong></div>
      <div><span>지상층수</span><strong>${escapeProjectReceiveHtml(groundFloors)}</strong></div>
      <div><span>입찰일</span><strong>${escapeProjectReceiveHtml(data.bidDate || "-")}</strong></div>
      <div><span>단가작업여부</span><strong>${escapeProjectReceiveHtml(data.unitPrice || "-")}</strong></div>
      <div><span>납품기준</span><strong>${escapeProjectReceiveHtml(data.firstDelivery || "미입력")}</strong></div>
      <div><span>최종 납품</span><strong>${escapeProjectReceiveHtml(data.finalDelivery || "미입력")}</strong></div>
    </div>

    <div class="project-viewer-section">
      <h4>업무의 성격</h4>
      <p>${escapeProjectReceiveHtml(businessText)}</p>
    </div>
    <div class="project-viewer-section">
      <h4>작업범위</h4>
      <p>${escapeProjectReceiveHtml(scopeText)}</p>
    </div>
    <div class="project-viewer-section">
      <h4>PM 지정</h4>
      <div class="project-viewer-pm-list">
        ${pmAssignmentRows.map(row => `<div><span>${escapeProjectReceiveHtml(row.label)}</span><strong>${escapeProjectReceiveHtml(row.value || "미지정")}</strong></div>`).join("")}
      </div>
    </div>
    <div class="project-viewer-section">
      <h4>접수자료</h4>
      <ul class="project-viewer-material-list">${materialText || "<li><strong>자료 없음</strong><span>-</span><em>-</em></li>"}</ul>
    </div>
    <div class="project-viewer-section">
      <h4>웹하드 정보</h4>
      <p>${escapeProjectReceiveHtml([data.webhardUrl, data.webhardId ? `ID: ${data.webhardId}` : "", data.webhardPw ? `PW: ${data.webhardPw}` : "", data.webhardNote].filter(Boolean).join(" / ") || "입력 내용 없음")}</p>
    </div>
    <div class="project-viewer-section">
      <h4>작업내용 / 요청사항</h4>
      <p>${escapeProjectReceiveHtml(data.workContent || data.request || data.notes || "입력 내용 없음")}</p>
    </div>
  `;
  modal.classList.add("active");
}

function closeProjectReceiveListViewer() {
  document.getElementById("projectReceiveListViewerModal")?.classList.remove("active");
}

function editProjectReceiveFromViewer(source, index) {
  const item = getProjectReceiveViewerItem(source, index);
  if (!item) return;
  projectReceiveState = JSON.parse(JSON.stringify(item.data || {}));
  normalizeProjectReceiveFloorState(projectReceiveState);
  closeProjectReceiveListViewer();
  if (typeof switchWorkPanel === "function") switchWorkPanel("projectReceive");
  renderProjectReceiveDashboard();
  showToast(`${projectReceiveState.projectNo || "선택 프로젝트"} 프로젝트를 수정 화면으로 불러왔습니다.`);
}

function ensureProjectReceiveListViewerModal() {
  if (document.getElementById("projectReceiveListViewerModal")) return;
  const modal = document.createElement("div");
  modal.id = "projectReceiveListViewerModal";
  modal.className = "modal-backdrop project-receive-viewer-modal";
  modal.innerHTML = `
    <div class="modal modal-wide project-receive-viewer-box">
      <div class="modal-head">
        <div>
          <h3>프로젝트 접수 상세</h3>
          <p>프로젝트 작성 화면에 입력된 내용을 뷰어 형식으로 확인합니다.</p>
        </div>
        <button class="close" type="button" onclick="closeProjectReceiveListViewer()">×</button>
      </div>
      <div class="modal-body" id="projectReceiveListViewerBody"></div>
      <div class="modal-foot">
        <button class="btn btn-line" type="button" onclick="closeProjectReceiveListViewer()">닫기</button>
      </div>
    </div>
  `;
  modal.addEventListener("click", event => {
    if (event.target === modal) closeProjectReceiveListViewer();
  });
  document.body.appendChild(modal);
}


/* =========================================================
   프로젝트 관리 v1
   - 프로젝트 작성 / 프로젝트 관리 세부 카테고리
   - 견적 기록 저장, 수정, 프로젝트 접수 화면 불러오기
   - 업로드된 견적서 XLSX 양식 다운로드
========================================================= */

/* =========================================================
   2026-05-28 프로젝트 리스트 중심 연계 패치
   - DB관리까지는 정식 수주 전 후보 데이터로 유지
   - 프로젝트 접수/리스트 저장 이후부터 PM배정/일정, 프로젝트 관리, 질의응답의 기준 데이터로 사용
   - PM배정/일정에서 지정한 PM 값은 가장 최신값으로 프로젝트 리스트와 DB관리(PJ관리)에 역반영
   ========================================================= */
function projectReceiveLinkText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}
function projectReceiveLinkKey(data = {}) {
  const no = projectReceiveLinkText(data.projectNo || data.pjNo || data.dbPjNo);
  if (no) return `NO:${no}`;
  const project = projectReceiveLinkText(data.projectName || data.name);
  const client = projectReceiveLinkText(data.client || data.company);
  return `NAME:${project}::${client}`;
}
function projectReceiveFindCompletedIndexByKey(key) {
  if (!Array.isArray(projectReceiveCompletedProjects)) return -1;
  return projectReceiveCompletedProjects.findIndex(item => projectReceiveLinkKey(item.data || item) === key);
}
function projectReceiveUpsertCompleted(data = {}, meta = {}) {
  if (!data || !projectReceiveLinkText(data.projectName)) return null;
  const record = JSON.parse(JSON.stringify(data));
  const key = projectReceiveLinkKey(record);
  const now = new Date();
  const completedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const payload = {
    sourceFile: meta.sourceFile || "프로젝트 접수 저장",
    completedAt,
    data: record
  };
  const idx = projectReceiveFindCompletedIndexByKey(key);
  if (idx >= 0) {
    projectReceiveCompletedProjects[idx] = {
      ...projectReceiveCompletedProjects[idx],
      ...payload,
      completedAt: payload.completedAt || projectReceiveCompletedProjects[idx].completedAt
    };
    return projectReceiveCompletedProjects[idx];
  }
  projectReceiveCompletedProjects.unshift(payload);
  return payload;
}
function projectReceiveGetCanonicalListItems() {
  const items = typeof getProjectReceiveListItems === "function" ? getProjectReceiveListItems() : [];
  const seen = new Set();
  return items.filter(item => {
    const data = item.data || item;
    const key = projectReceiveLinkKey(data);
    if (!projectReceiveLinkText(data.projectName) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function projectReceiveFindDbPjRowIndex(projectNo = "") {
  const target = projectReceiveLinkText(projectNo);
  if (!target || typeof estimateDbSheets === "undefined" || !estimateDbSheets?.pj) return -1;
  const pjNoIdx = typeof getEstimateDbColumnIndexByHeader === "function" ? getEstimateDbColumnIndexByHeader("pj", "PJ NO") : -1;
  if (pjNoIdx < 0) return -1;
  return (estimateDbSheets.pj.rows || []).findIndex(row => projectReceiveLinkText(row[pjNoIdx]) === target);
}
function projectReceiveSetDbPjCell(rowIndex, header, value) {
  if (rowIndex < 0 || typeof estimateDbSheets === "undefined" || !estimateDbSheets?.pj) return;
  const col = typeof getEstimateDbColumnIndexByHeader === "function" ? getEstimateDbColumnIndexByHeader("pj", header) : -1;
  if (col < 0) return;
  estimateDbSheets.pj.rows[rowIndex][col] = value || "";
}
function projectReceiveSyncPmAssignmentToDb(projectNo, assignment = {}) {
  const rowIndex = projectReceiveFindDbPjRowIndex(projectNo);
  if (rowIndex < 0) return;
  projectReceiveSetDbPjCell(rowIndex, "PM(마감)", assignment.pmFinish || "");
  projectReceiveSetDbPjCell(rowIndex, "PM(구조)", assignment.pmStructure || assignment.pmBim || "");
  projectReceiveSetDbPjCell(rowIndex, "PM(토목,조경)", assignment.pmCivil || "");
  if (typeof estimateDbSyncProgressTotalPmFromPjRow === "function") {
    estimateDbSyncProgressTotalPmFromPjRow(rowIndex, assignment);
  }
  projectReceiveSetDbPjCell(rowIndex, "상담 / 이메일 / 특기사항", [
    "PM배정/일정 최신 반영",
    assignment.pmFinish ? `마감:${assignment.pmFinish}` : "",
    assignment.pmStructure ? `구조:${assignment.pmStructure}` : "",
    assignment.pmBim ? `BIM:${assignment.pmBim}` : "",
    assignment.pmCivil ? `토목·조경:${assignment.pmCivil}` : ""
  ].filter(Boolean).join(" / "));
}
const baseApplyPmScheduleAssignmentToProjectReceiveData = typeof applyPmScheduleAssignmentToProjectReceiveData === "function" ? applyPmScheduleAssignmentToProjectReceiveData : null;
applyPmScheduleAssignmentToProjectReceiveData = function projectReceiveLatestPmAssignment(projectNo, assignment = {}) {
  const targetNo = projectReceiveLinkText(projectNo);
  if (!targetNo) return;
  const assignTo = data => {
    if (!data || projectReceiveLinkText(data.projectNo) !== targetNo) return;
    data.pmFinish = assignment.pmFinish || "";
    data.pmStructure = assignment.pmStructure || "";
    data.pmBim = assignment.pmBim || "";
    data.pmCivil = assignment.pmCivil || "";
    data.pmTotal = [assignment.pmFinish, assignment.pmStructure, assignment.pmBim, assignment.pmCivil].filter(Boolean).join(" / ");
  };
  if (typeof projectReceiveState !== "undefined") assignTo(projectReceiveState);
  if (Array.isArray(projectReceiveCompletedProjects)) projectReceiveCompletedProjects.forEach(item => assignTo(item.data || item));
  projectReceiveSyncPmAssignmentToDb(targetNo, assignment);
  if (document.getElementById("projectReceiveListBody")) renderProjectReceiveListView();
  if (typeof pmRefreshLinkedEstimateProjects === "function") pmRefreshLinkedEstimateProjects();
  if (typeof pmRenderProjectList === "function" && document.getElementById("pmProjectListBoard")) pmRenderProjectList();
};
const baseSaveProjectReceiveDraft = typeof saveProjectReceiveDraft === "function" ? saveProjectReceiveDraft : null;
saveProjectReceiveDraft = function projectReceiveSaveAsCanonicalList() {
  syncProjectReceiveInputsToState();
  if (!validateProjectReceiveSkeletonScope()) {
    renderProjectReceiveDashboard();
    showToast("골조성을 선택한 경우 가설, 단열, 견출, 방수턱 중 최소 1개를 선택해야 접수저장이 가능합니다.");
    return;
  }
  projectReceiveUpsertCompleted(projectReceiveState, { sourceFile: "프로젝트 접수 저장" });
  renderProjectReceiveStatus();
  if (typeof registerPmScheduleProjectFromReceive === "function") registerPmScheduleProjectFromReceive(projectReceiveState);
  if (document.getElementById("projectReceiveListBody")) renderProjectReceiveListView();
  showToast("프로젝트 접수 내용이 프로젝트 리스트 기준 최신값으로 저장되었습니다.");
};
window.projectReceiveGetCanonicalListItems = projectReceiveGetCanonicalListItems;
window.projectReceiveLinkKey = projectReceiveLinkKey;
window.applyPmScheduleAssignmentToProjectReceiveData = applyPmScheduleAssignmentToProjectReceiveData;
window.saveProjectReceiveDraft = saveProjectReceiveDraft;
