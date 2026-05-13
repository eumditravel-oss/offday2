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
    { label: "토목ㆍ조경 파트", checked: false },
    { label: "인테리어·철거", checked: false },
    { label: "비교내역서", checked: false },
    { label: "단가작업", checked: false },
    { label: "기계/전기", checked: false }
  ],
  contacts: [
    { name: "", role: "", dept: "", tel: "", mobile: "", email: "" }
  ],
  materials: [
    { label: "도면", checked: false, memo: "", confirmed: false, confirmedBy: "" },
    { label: "시방서", checked: false, memo: "", confirmed: false, confirmedBy: "" },
    { label: "현장설명서", checked: false, memo: "", confirmed: false, confirmedBy: "" },
    { label: "내역서", checked: false, memo: "", confirmed: false, confirmedBy: "" },
    { label: "기타자료", checked: false, memo: "", confirmed: false, confirmedBy: "" }
  ],
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
    { label: "토목ㆍ조경 파트", checked: true },
    { label: "인테리어·철거", checked: true },
    { label: "비교내역서", checked: false },
    { label: "단가작업", checked: false },
    { label: "기계/전기", checked: false }
  ],
  contacts: [
    { name: "한동훈", role: "매니저", dept: "건축국내견적팀", tel: "02-746-8013", mobile: "010-3572-5478", email: "donghunhan@hdec.co.kr" },
    { name: "박태훈", role: "매니저", dept: "건축국내견적팀", tel: "02-746-0874", mobile: "", email: "" },
    { name: "남종현", role: "매니저", dept: "건축국내견적팀", tel: "02-746-5363", mobile: "010-2080-1933", email: "surnam@hdec.co.kr" }
  ],
  materials: [
    { label: "도면", checked: true, memo: "2026.05.11 접수", confirmed: true, confirmedBy: getProjectReceiveConfirmStamp() },
    { label: "시방서", checked: true, memo: "접수", confirmed: true, confirmedBy: getProjectReceiveConfirmStamp() },
    { label: "현장설명서", checked: true, memo: "접수", confirmed: false, confirmedBy: "" },
    { label: "내역서", checked: true, memo: "접수", confirmed: false, confirmedBy: "" },
    { label: "기타자료", checked: false, memo: "", confirmed: false, confirmedBy: "" }
  ],
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



const projectReceiveCompletedProjects = [
  {
    sourceFile: "2026041.[한양산업개발(주)]창원 용원물류 골조공사 적정공사비 검증 기술자문 용역.xlsx",
    completedAt: "2026.05.13 11:47",
    data: {
      ...projectReceiveSampleData,
      projectNo: "2026041",
      projectName: "창원 용원물류 골조공사 적정공사비 검증 기술자문 용역",
      client: "한양산업개발㈜",
      usage: "물류시설",
      area: "",
      buildings: "",
      floors: "",
      bidDate: "",
      unitPrice: "공내역서",
      businessTypes: projectReceiveSampleData.businessTypes.map(item => ({ ...item, checked: ["공사비 검증", "본사 입찰"].includes(item.label) })),
      scopes: projectReceiveSampleData.scopes.map(item => ({ ...item, checked: ["구조팀", "BIM 파트", "토목ㆍ조경 파트"].includes(item.label) })),
      workContent: "구조, BIM, 토목ㆍ조경 / 적정공사비 검증 기술자문",
      request: "창원 용원물류 골조공사 적정공사비 검증 기술자문 용역 접수 건"
    }
  },
  {
    sourceFile: "2026042.[IPARK현대산업개발(주)]수원아이파크시티 D1블록 판매시설 신축공사 견적용역.xlsx",
    completedAt: "2026.05.13 11:47",
    data: {
      ...projectReceiveSampleData,
      projectNo: "2026042",
      projectName: "수원아이파크시티 D1블록 판매시설 신축공사 견적용역",
      client: "IPARK현대산업개발㈜",
      usage: "판매시설",
      area: "",
      buildings: "",
      floors: "",
      bidDate: "",
      unitPrice: "공내역서",
      businessTypes: projectReceiveSampleData.businessTypes.map(item => ({ ...item, checked: ["정미견적", "본사 입찰"].includes(item.label) })),
      scopes: projectReceiveSampleData.scopes.map(item => ({ ...item, checked: ["마감", "구조팀", "BIM 파트"].includes(item.label) })),
      workContent: "마감, 구조, BIM / 판매시설 신축공사 견적용역",
      request: "수원아이파크시티 D1블록 판매시설 신축공사 견적용역 접수 건"
    }
  },
  {
    sourceFile: "2026044.[(주)창조종합건축사사무소]영등포 금융전산센터 개발사업 설계 건축견적용역.xlsx",
    completedAt: "2026.05.13 11:47",
    data: {
      ...projectReceiveSampleData,
      projectNo: "2026044",
      projectName: "영등포 금융전산센터 개발사업 설계 건축견적용역",
      client: "㈜창조종합건축사사무소",
      usage: "업무시설",
      area: "",
      buildings: "",
      floors: "",
      bidDate: "",
      unitPrice: "공내역서",
      businessTypes: projectReceiveSampleData.businessTypes.map(item => ({ ...item, checked: ["설계가", "정미견적"].includes(item.label) })),
      scopes: projectReceiveSampleData.scopes.map(item => ({ ...item, checked: ["마감", "구조팀", "BIM 파트", "토목ㆍ조경 파트"].includes(item.label) })),
      workContent: "마감, 구조, BIM, 토목ㆍ조경 / 설계 건축견적용역",
      request: "영등포 금융전산센터 개발사업 설계 건축견적용역 접수 건"
    }
  }
];

let selectedProjectReceiveCompletedIndex = 0;

let projectReceiveState = JSON.parse(JSON.stringify(projectReceiveSampleData));

function setProjectReceiveValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function getProjectReceiveValue(id) {
  return document.getElementById(id)?.value || "";
}

function renderProjectReceiveDashboard() {
  if (!document.getElementById("projectReceiveShell")) return;

  setProjectReceiveValue("receiveProjectName", projectReceiveState.projectName);
  setProjectReceiveValue("receiveProjectNo", projectReceiveState.projectNo);
  setProjectReceiveValue("receiveClient", projectReceiveState.client);
  setProjectReceiveValue("receiveUsage", projectReceiveState.usage);
  setProjectReceiveValue("receiveArea", projectReceiveState.area);
  setProjectReceiveValue("receiveBuildings", projectReceiveState.buildings);
  setProjectReceiveValue("receiveFloors", projectReceiveState.floors);
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

  renderProjectReceiveStatus();
  renderProjectReceiveChips("receiveBusinessTypeChips", "businessTypes");
  renderProjectReceiveChips("receiveScopeChips", "scopes");
  renderProjectReceiveContacts();
  renderProjectReceiveMaterials();
}

function renderProjectReceiveStatus() {
  const el = document.getElementById("projectReceiveStatus");
  if (!el) return;
  const checkedScope = projectReceiveState.scopes.filter(item => item.checked).map(item => item.label);
  const checkedMaterials = projectReceiveState.materials.filter(item => item.checked).length;
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
  wrap.innerHTML = projectReceiveState[stateKey].map((item, index) => `
    <button class="receive-chip ${item.checked ? "active" : ""}" type="button" onclick="toggleProjectReceiveChip('${stateKey}', ${index})">
      <span>${item.checked ? "✓" : "+"}</span>${item.label}
    </button>
  `).join("");
}

function toggleProjectReceiveChip(stateKey, index) {
  if (!projectReceiveState[stateKey]?.[index]) return;
  projectReceiveState[stateKey][index].checked = !projectReceiveState[stateKey][index].checked;
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
  list.innerHTML = projectReceiveState.materials.map((item, index) => `
    <div class="receive-material-item ${item.checked ? "active" : ""}">
      <label class="receive-material-check">
        <input type="checkbox" ${item.checked ? "checked" : ""} onchange="toggleProjectReceiveMaterial(${index}, this.checked)" />
        <span>${item.label}</span>
      </label>
      <input class="receive-material-memo" value="${escapeProjectReceiveHtml(item.memo)}" placeholder="메모" oninput="updateProjectReceiveMaterialMemo(${index}, this.value)" />
      <button class="receive-material-confirm ${item.confirmed ? "confirmed" : ""}" type="button" onclick="confirmProjectReceiveMaterial(${index})">
        ${item.confirmed ? "확인완료" : "확인"}
      </button>
      <div class="receive-material-history">${item.confirmedBy ? `확인: ${escapeProjectReceiveHtml(item.confirmedBy)}` : "확인 이력 없음"}</div>
    </div>
  `).join("");
}

function toggleProjectReceiveMaterial(index, checked) {
  if (!projectReceiveState.materials[index]) return;
  projectReceiveState.materials[index].checked = checked;
  renderProjectReceiveDashboard();
}

function updateProjectReceiveMaterialMemo(index, value) {
  if (!projectReceiveState.materials[index]) return;
  projectReceiveState.materials[index].memo = value;
}

function confirmProjectReceiveMaterial(index) {
  if (!projectReceiveState.materials[index]) return;
  const item = projectReceiveState.materials[index];
  item.confirmed = !item.confirmed;
  item.confirmedBy = item.confirmed ? getProjectReceiveConfirmStamp() : "";
  renderProjectReceiveMaterials();
}

function syncProjectReceiveInputsToState() {
  projectReceiveState.projectName = getProjectReceiveValue("receiveProjectName");
  projectReceiveState.projectNo = getProjectReceiveValue("receiveProjectNo");
  projectReceiveState.client = getProjectReceiveValue("receiveClient");
  projectReceiveState.usage = getProjectReceiveValue("receiveUsage");
  projectReceiveState.area = getProjectReceiveValue("receiveArea");
  projectReceiveState.buildings = getProjectReceiveValue("receiveBuildings");
  projectReceiveState.floors = getProjectReceiveValue("receiveFloors");
  projectReceiveState.bidDate = getProjectReceiveValue("receiveBidDate");
  projectReceiveState.unitPrice = getProjectReceiveValue("receiveUnitPrice");
  projectReceiveState.pmTotal = getProjectReceiveValue("receivePmTotal");
  projectReceiveState.pmFinish = getProjectReceiveValue("receivePmFinish");
  projectReceiveState.pmStructure = getProjectReceiveValue("receivePmStructure");
  projectReceiveState.startDate = getProjectReceiveValue("receiveStartDate");
  projectReceiveState.firstDelivery = getProjectReceiveValue("receiveFirstDelivery");
  projectReceiveState.finalDelivery = getProjectReceiveValue("receiveFinalDelivery");
  projectReceiveState.workContent = getProjectReceiveValue("receiveWorkContent");
  projectReceiveState.notes = getProjectReceiveValue("receiveNotes");
  projectReceiveState.request = getProjectReceiveValue("receiveRequest");
}

function saveProjectReceiveDraft() {
  syncProjectReceiveInputsToState();
  renderProjectReceiveStatus();
  showToast("프로젝트 접수 내용이 임시 저장되었습니다.");
}

function resetProjectReceiveForm() {
  projectReceiveState = JSON.parse(JSON.stringify(projectReceiveDefaultData));
  renderProjectReceiveDashboard();
  showToast("프로젝트 접수 입력값을 초기화했습니다.");
}

function loadProjectReceiveSample() {
  projectReceiveState = JSON.parse(JSON.stringify(projectReceiveSampleData));
  renderProjectReceiveDashboard();
  showToast("견적용역 예시 데이터를 불러왔습니다.");
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
    const scopeText = data.scopes.filter(scope => scope.checked).map(scope => scope.label).join(" · ") || "미선택";
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

document.addEventListener("DOMContentLoaded", () => {
  renderProjectReceiveDashboard();
});
