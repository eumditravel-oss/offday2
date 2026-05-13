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
    { label: "도면", checked: true, memo: "2026.05.11 접수", confirmed: true, confirmedBy: "장병선 / 2026.05.11 09:30" },
    { label: "시방서", checked: true, memo: "접수", confirmed: true, confirmedBy: "장병선 / 2026.05.11 09:35" },
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
  item.confirmedBy = item.confirmed ? "장병선 / 방금 확인" : "";
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
