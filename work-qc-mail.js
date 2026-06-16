/* =========================
   업무관리 탭 / QC 체크리스트
   ========================= */
const workPageMeta = {
  estimateRequestManage: ["견적 의뢰관리", "클라이언트 최초 의뢰 메모부터 업체등록, 견적서 작성요청, 발송, 선착수, 작업시작까지 연결합니다."],
  estimateSheetManage: ["견적서 종류별 관리", "개산견적, 공내역서, 설계예가, 공사비검증 견적서를 엑셀 양식 그대로 작성·관리합니다."],
  estimatePeriodManage: ["기간별 견적서 관리", "발송 처리된 견적서를 기간별 견적서 관리표에 누적합니다."],
  estimateDbManage: ["DB관리", "PJ관리, 기성관리, 기전업체 기준 DB를 엑셀 형식으로 관리합니다."],
  estimateQuote: ["프로젝트 작성", "최초 견적 문의, 도면/웹하드 정보, 통화·이메일 기록을 작성합니다."],
  estimateQuoteList: ["프로젝트 리스트", "견적서 기록을 수정하고 견적서 양식 다운로드 및 착수 전환을 관리합니다."],
  projectReceive: ["프로젝트 접수", "수주소식, 프로젝트 개요, 접수자료, 담당 PM, 납품일정을 카드형 화면으로 관리합니다."],
  pmSchedule: ["PM 배정 / 일정", "PM 배정, 작업일정 결재, 전체 일정을 세부 카테고리로 관리합니다."],
  projectManage: ["프로젝트 운영현황", "프로젝트 개요, 회의록, 배정인원, 관련메일, 수주일정, 완료시점, 납품관리를 통합 관리합니다."],
  quantityChecklist: ["프로젝트 질의응답 관리", "수량산출 체크리스트, 체크리스트 검토, 이의제기, 오류 소거, 최종 수량 검토를 한 화면에서 관리합니다."],
  qcReview: ["프로젝트 질의응답 관리", "수량산출 체크리스트, 체크리스트 검토, 이의제기, 오류 소거, 최종 수량 검토를 한 화면에서 관리합니다."],
  deliveryData: ["납품 및 데이터관리", "해당 업무관리 카테고리는 화면 준비 영역입니다."],
  dailyReport: ["업무일지 / 진행률", "해당 업무관리 카테고리는 화면 준비 영역입니다."]
};


const checklistCategoryOptions = [
  "프로젝트 초기",
  "QC팀 전달사항",
  "PM 전달사항",
  "제출자료 검토사항",
  "최종자료 검토사항",
  "Z1. 질의사항(1차)",
  "Z2. 질의사항(2차)",
  "Z3. 질의사항(3차)",
  "Z4. 질의사항(4차)",
  "Z5. 질의사항(5차)",
  "Z6. 질의사항(6차)",
  "Z7. 견적조건(최종)"
];


let selectedChecklistCategoryFilter = "전체";
const checklistMiddleFilterOptions = ["구조", "마감", "토목"];
const selectedChecklistMiddleFilters = new Set(checklistMiddleFilterOptions);
let checklistCategoryPanelOpen = false;
const collapsedChecklistGroups = new Set();
const collapsedChecklistMiddles = new Set();
const collapsedChecklistSubs = new Set();
let currentChecklistFocus = null;
let openedChecklistTargetPicker = null;
const checklistCategoryAliases = {
  "프로젝트 초기(초기 내부 → 외부 제출용)": "프로젝트 초기",
  "프로젝트 초기(PM,작업자,발주처 송부용)": "프로젝트 초기",
  "프로젝트 수주시": "프로젝트 초기",
  "프로젝트 수주 시": "프로젝트 초기",
  "프로젝트 초기": "프로젝트 초기",

  "QC팀 전달사항(유형 및 특이사항 관리)": "QC팀 전달사항",
  "자가검토 체크리스트(QC)": "QC팀 전달사항",
  "QC 전달": "QC팀 전달사항",
  "전체 공통": "QC팀 전달사항",
  "기둥": "QC팀 전달사항",

  "작업 착수 전 확인 필요사항(PM)": "PM 전달사항",
  "작업 진행 중 추가 전달사항(PM)": "PM 전달사항",
  "기초 산출 담당자": "PM 전달사항",

  "제출자료 검토사항(PM)": "제출자료 검토사항",
  "제출자료 검토사항(PM→작업자)": "제출자료 검토사항",
  "기초": "제출자료 검토사항",
  "보": "제출자료 검토사항",
  "슬라브": "제출자료 검토사항",
  "옹벽": "제출자료 검토사항",

  "최종자료 검토사항(QC)": "최종자료 검토사항",
  "최종자료 검토사항(QC→작업자)": "최종자료 검토사항"
};

const checklistCategoryTree = {
  "프로젝트 초기": {
    mids: ["구조", "마감", "토목"],
    subs: { "구조": [], "마감": [], "토목": [] }
  },
  "QC팀 전달사항": {
    mids: ["구조팀", "마감팀", "토목팀"],
    subs: {
      "구조팀": ["QC팀", "공통", "PM", "수평팀", "수직팀", "한국팀"],
      "마감팀": ["QC팀", "공통", "PM", "내부팀", "외부팀", "조적ㆍ창호팀", "한국팀"],
      "토목팀": []
    }
  },
  "PM 전달사항": {
    mids: ["구조", "마감", "토목"],
    subs: {
      "구조": ["수평팀", "수직팀", "한국"],
      "마감": ["내부1", "내부2", "내부3", "조적ㆍ창호", "외부", "한국"],
      "토목": []
    }
  },
  "제출자료 검토사항": {
    mids: ["구조", "마감", "토목"],
    subs: {
      "구조": ["수평팀", "수직팀", "한국"],
      "마감": ["내부1", "내부2", "내부3", "조적ㆍ창호", "외부", "한국"],
      "토목": []
    },
    flow: "PM이 오류사항을 대분류·중분류·소분류로 지정하여 보내면 해당 팀장과 직원이 오류리스트에서 본인 프로젝트를 가져가 확인합니다."
  },
  "최종자료 검토사항": {
    mids: ["구조", "마감", "토목"],
    subs: {
      "구조": ["수평팀", "수직팀", "한국"],
      "마감": ["내부1", "내부2", "내부3", "조적ㆍ창호", "외부", "한국"],
      "토목": []
    },
    flow: "PM이 오류사항을 대분류·중분류·소분류로 지정하여 보내면 해당 팀장과 직원이 오류리스트에서 본인 프로젝트를 가져가 확인합니다."
  }
};

const questionCategories = checklistCategoryOptions.filter(category => category.startsWith("Z") && category.includes("질의사항"));
const checklistSentCategories = new Set();
const firstCategoryName = checklistCategoryOptions[0];

function normalizeChecklistGroupName(group) {
  const value = String(group || "").trim();
  return checklistCategoryAliases[value] || value || firstCategoryName;
}

function getChecklistProjectLinkKeyFromRow(row = {}) {
  return String(row.receiveId || row.linkedReceiveId || row.projectLinkKey || row.pjNo || row.projectNo || row.linkedProjectNo || "").replace(/\s+/g, " ").trim();
}

function isChecklistSharedSeedRow(row = {}) {
  const group = normalizeChecklistGroupName(row.group);
  const projectKey = getChecklistProjectLinkKeyFromRow(row);
  const projectName = String(row.project || "").replace(/\s+/g, " ").trim();
  const hasDefaultProjectName = !projectName || projectName === "ㅇㅇ시설 신축공사";
  return !projectKey && hasDefaultProjectName && checklistCategoryOptions.includes(group);
}

function normalizeChecklistNo(value) {
  const raw = String(value ?? "").trim();
  const digits = raw.match(/\d+/g)?.join("") || "";
  if (!digits) return "001";
  return digits.slice(-3).padStart(3, "0");
}

function getChecklistNoScopeKey(row) {
  const targetRow = row || {};
  const group = normalizeChecklistGroupName(targetRow.group);
  const middle = targetRow.middleCategory || inferChecklistMiddle(targetRow) || "기타";
  const subOptions = getChecklistSubOptions(group, middle);
  const sub = subOptions.length
    ? (targetRow.subCategory || inferChecklistSub(targetRow, middle) || subOptions[0] || "기타")
    : "__NO_SUB__";

  // 일련번호는 가장 하위 분류 단위로 001부터 다시 시작한다.
  // - 중분류 바로 아래에 항목이 있으면: 구분 + 중분류 기준 001, 002...
  // - 소분류 바로 아래에 항목이 있으면: 구분 + 중분류 + 소분류 기준 001, 002...
  return `${group}::${middle}::${sub}`;
}

function isQuestionOrEstimateGroup(group) {
  const normalized = normalizeChecklistGroupName(group);
  return /^Z[1-7]\./.test(normalized) && (normalized.includes("질의사항") || normalized.includes("견적조건"));
}

function getChecklistMiddleOptions(group) {
  const normalized = normalizeChecklistGroupName(group);
  if (isQuestionOrEstimateGroup(normalized)) return ["구조", "토목", "마감"];
  return checklistCategoryTree[normalized]?.mids || [];
}

function getChecklistSubOptions(group, middle) {
  const normalized = normalizeChecklistGroupName(group);
  if (isQuestionOrEstimateGroup(normalized)) return [];
  const tree = checklistCategoryTree[normalized];
  if (!tree || !middle) return [];
  return tree.subs?.[middle] || [];
}

function inferChecklistMiddle(row) {
  const group = normalizeChecklistGroupName(row?.group);
  const text = `${row?.middleCategory || ""} ${row?.trade || ""} ${row?.item || ""} ${row?.method || ""}`;
  if (group === "QC팀 전달사항") {
    if (/토목|토공|흙막이|가시설|터파기/.test(text)) return "토목팀";
    if (/마감|조적|창호|외부|내부|석재|타일|도장/.test(text)) return "마감팀";
    return "구조팀";
  }
  if (isQuestionOrEstimateGroup(group)) {
    if (/토목|토공|흙막이|가시설|터파기/.test(text)) return "토목";
    if (/마감|조적|창호|외부|내부|석재|타일|도장/.test(text)) return "마감";
    return "구조";
  }
  if (/토목|토공|흙막이|가시설|터파기/.test(text)) return "토목";
  if (/마감|조적|창호|외부|내부|석재|타일|도장/.test(text)) return "마감";
  return "구조";
}

function inferChecklistSub(row, middle) {
  const text = `${row?.subCategory || ""} ${row?.trade || ""} ${row?.item || ""} ${row?.method || ""}`;
  if (middle === "구조") {
    if (/수직|기둥|벽|옹벽/.test(text)) return "수직팀";
    if (/한국/.test(text)) return "한국";
    return "수평팀";
  }
  if (middle === "마감팀") {
    if (/조적|창호/.test(text)) return "조적ㆍ창호";
    if (/외부/.test(text)) return "외부";
    return "내부팀";
  }
  if (middle === "마감") {
    if (/조적|창호/.test(text)) return "조적ㆍ창호";
    if (/외부/.test(text)) return "외부";
    if (/한국/.test(text)) return "한국";
    return "내부1";
  }
  return "";
}

function normalizeChecklistClassification(row) {
  if (!row) return row;
  row.group = normalizeChecklistGroupName(row.group);
  const middleOptions = getChecklistMiddleOptions(row.group);
  if (middleOptions.length) {
    if (!middleOptions.includes(row.middleCategory)) row.middleCategory = inferChecklistMiddle(row);
    if (!middleOptions.includes(row.middleCategory)) row.middleCategory = middleOptions[0];
    const subOptions = getChecklistSubOptions(row.group, row.middleCategory);
    if (subOptions.length) {
      if (!subOptions.includes(row.subCategory)) row.subCategory = inferChecklistSub(row, row.middleCategory);
      if (!subOptions.includes(row.subCategory)) row.subCategory = subOptions[0];
    } else {
      row.subCategory = "";
    }
  } else {
    row.middleCategory = row.middleCategory || "";
    row.subCategory = row.subCategory || "";
  }
  return row;
}

function renderChecklistMiddleOptions(selectedMiddle = "") {
  const groupEl = document.getElementById("checklistModalGroup");
  const middleEl = document.getElementById("checklistModalMiddle");
  const subEl = document.getElementById("checklistModalSub");
  if (!groupEl || !middleEl || !subEl) return;
  const options = getChecklistMiddleOptions(groupEl.value);
  middleEl.innerHTML = options.length
    ? options.map(value => `<option value="${escapeHtml(value)}" ${value === selectedMiddle ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")
    : `<option value="">중분류 없음</option>`;
  middleEl.disabled = !options.length;
  if (options.length && !options.includes(middleEl.value)) middleEl.value = options[0];
  renderChecklistSubOptions(subEl.dataset.selected || "");
  renderChecklistTargetOptions();
}

function renderChecklistSubOptions(selectedSub = "") {
  const groupEl = document.getElementById("checklistModalGroup");
  const middleEl = document.getElementById("checklistModalMiddle");
  const subEl = document.getElementById("checklistModalSub");
  if (!groupEl || !middleEl || !subEl) return;
  const options = getChecklistSubOptions(groupEl.value, middleEl.value);
  subEl.innerHTML = options.length
    ? options.map(value => `<option value="${escapeHtml(value)}" ${value === selectedSub ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")
    : `<option value="">소분류 없음</option>`;
  subEl.disabled = !options.length;
  if (options.length && !options.includes(subEl.value)) subEl.value = options[0];
  subEl.dataset.selected = "";
  renderChecklistTargetOptions();
}

function handleChecklistGroupChange() {
  renderChecklistMiddleOptions("");
  renderChecklistTargetOptions();
}

function getQuestionCategoryIndex(category) {
  return questionCategories.indexOf(category);
}

function isQuestionCategory(category) {
  return questionCategories.includes(category);
}

function isChecklistCategoryLocked(category) {
  return checklistSentCategories.has(category);
}

function canUseChecklistCategory(category, currentGroup = "") {
  category = normalizeChecklistGroupName(category);
  currentGroup = normalizeChecklistGroupName(currentGroup);
  if (!category) return false;
  if (category === currentGroup) return true;
  if (isChecklistCategoryLocked(category)) return false;
  const idx = getQuestionCategoryIndex(category);
  if (idx <= 0) return true;
  return checklistSentCategories.has(questionCategories[idx - 1]);
}

function getNextQuestionCategory(category) {
  const idx = getQuestionCategoryIndex(category);
  if (idx >= 0 && idx < questionCategories.length - 1) return questionCategories[idx + 1];
  return "";
}

let checklistRows = [
  {
    "group": "프로젝트 초기(초기 내부 → 외부 제출용)",
    "trade": "계약",
    "no": "001",
    "item": "프로젝트 업무 특성 파악\n(구조선수행, 입찰, 본실행,\n설계내역 등)",
    "method": "접수자료 확인. 특이사항 작성 후 프로젝트\nPM 전달",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "프로젝트 초기(초기 내부 → 외부 제출용)",
    "trade": "접수자료",
    "no": "002",
    "item": "입찰 내역서, 산출기준서, 공사\n특기사항 접수 파악",
    "method": "접수자료 확인. 특이사항 작성 후 프로젝트\nPM 전달",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "프로젝트 초기(초기 내부 → 외부 제출용)",
    "trade": "도면검토",
    "no": "003",
    "item": "도면 접수 여부 확인 (구조 / 건축 /\n토목)",
    "method": "도면목록표와 접수 도면상 일치 확인",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "프로젝트 초기(초기 내부 → 외부 제출용)",
    "trade": "접수자료",
    "no": "004",
    "item": "내역서, 산출서, 기준서 접수 여부\n확인",
    "method": "내역서, 산출서, 기준서 파일 수신 여부 확인",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "QC팀 전달사항(유형 및 특이사항 관리)",
    "trade": "프로젝트\n유형",
    "no": "005",
    "item": "프로젝트 유형 파악 (입찰 / 본실행\n/ 구조선수행 등)",
    "method": "계약방식과 발주처 요청사항 기준으로 유형\n분류",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "QC팀 전달사항(유형 및 특이사항 관리)",
    "trade": "토공사",
    "no": "008",
    "item": "토공사 산출유무 확인",
    "method": "토목팀 투입 유무 확인 및 건축터파기 산출\n여부 협의",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "QC팀 전달사항(유형 및 특이사항 관리)",
    "trade": "합벽",
    "no": "009",
    "item": "합벽유무 및 합벽구간 추가이음\n발생 여부 확인",
    "method": "토목도면 흙막이 또는 가시설계획도 확인",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "QC팀 전달사항(유형 및 특이사항 관리)",
    "trade": "도면목록표",
    "no": "019",
    "item": "도면목록표와 도서가 일치하는지\n확인",
    "method": "PM과 산출 담당자 모두 도면 누락본 확인할\n것",
    "owner": "PM, 산출 담당자",
    "targets": [
      "PM",
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 18:25",
    "comment": "누락본이 있을 시 질의사항 작성 바랍니다.",
    "attachments": [],
    "checks": [
      {
        "target": "PM",
        "done": true,
        "checkedBy": "박용진 수석",
        "checkedAt": "2026-04-29 18:25"
      },
      {
        "target": "산출 담당자",
        "done": true,
        "checkedBy": "박용진 수석",
        "checkedAt": "2026-04-29 18:25"
      }
    ],
    "history": [
      {
        "action": "확인완료(PM)",
        "worker": "박용진 수석",
        "time": "2026-04-29 18:25"
      },
      {
        "action": "확인완료(산출 담당자)",
        "worker": "박용진 수석",
        "time": "2026-04-29 18:25"
      },
      {
        "action": "최초작성",
        "worker": "QC TEAM",
        "time": "2026-04-29 18:25"
      }
    ]
  },
  {
    "group": "작업 착수 전 확인 필요사항(PM)",
    "trade": "특이사항",
    "no": "006",
    "item": "프로젝트별 특이사항 확인 및 정리",
    "method": "정리 완료 후 내부 PM 및 외부 발주처\n담당자에게 동시 발송",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "작업 착수 전 확인 필요사항(PM)",
    "trade": "파일공사",
    "no": "007",
    "item": "파일길이 및 항타장비, 동재하\n정재하 시험횟수 확인",
    "method": "지질조서도 확인",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "작업 착수 전 확인 필요사항(PM)",
    "trade": "끊어치기",
    "no": "010",
    "item": "끊어치기(C.J Joint) 구간 확인",
    "method": "발주처 및 건설사 질의사항 작성. Zoning 및\n분할타설 계획도 요청",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "작업 진행 중 추가 전달사항(PM)",
    "trade": "철근\n규격\n변경",
    "no": "020",
    "item": "데크 슬라브 구분이 필요하여 H-\nBAR → D-BAR 구분 필요",
    "method": "데크슬라브 철근만 D-BAR로 구분 바랍니다.",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 18:26",
    "comment": "만약 이음 값이 데이터에 입력되지 않았다면 질의 바랍니다.",
    "attachments": []
  },
  {
    "group": "작업 진행 중 추가 전달사항(PM)",
    "trade": "띠장\n이음",
    "no": "021",
    "item": "띠장구간 이음1회 추가",
    "method": "띠장 도면 참조하여 띠장이 걸리는 구간은 1회\n이음을 추가 해 주세요",
    "owner": "산출 담당자",
    "targets": [
      "PM"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 18:27",
    "comment": "",
    "attachments": []
  },
  {
    "group": "자가검토 체크리스트(QC)",
    "trade": "커플러",
    "no": "011",
    "item": "커플러 산출기준 확인",
    "method": "건설사별 견적지침서 확인. 별도 표현 없음 시\n담당자 확인",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "자가검토 체크리스트(QC)",
    "trade": "철근강도",
    "no": "012",
    "item": "철근 강도에 따른 정착/이음값 오류\n확인",
    "method": "구조일반사항 및 구조계산서 검토",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "자가검토 체크리스트(QC)",
    "trade": "내진철근",
    "no": "013",
    "item": "내진철근 적용 유무 확인",
    "method": "SD400S, SD500S, SD600S 등의 표현 유무\n확인",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "자가검토 체크리스트(QC)",
    "trade": "기둥",
    "no": "015",
    "item": "기초두께 입력시 이음 산출 유무\n확인",
    "method": "산출식 확인 후 기초두께 입력 시 주근 이음\n산출 여부 검토",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "제출자료 검토사항(PM→작업자)",
    "trade": "기초",
    "no": "014",
    "item": "버림두께 확인",
    "method": "건축단면도 기준 적용. 미표현 시 60mm 적용",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "제출자료 검토사항(PM→작업자)",
    "trade": "보",
    "no": "016",
    "item": "각 층별 슬라브 두께별 공제 확인",
    "method": "산출내용 재확인",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "제출자료 검토사항(PM→작업자)",
    "trade": "슬라브",
    "no": "017",
    "item": "부호별 데크타입 오류 확인",
    "method": "RC 평면자료를 Excel 변환 후 필터로\n데크부호별 코드입력 체크",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "제출자료 검토사항(PM→작업자)",
    "trade": "옹벽",
    "no": "018",
    "item": "옹벽 상부 슬라브 또는 보 공제값\n오류 체크",
    "method": "RC 프로그램 산식 확인",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "제출자료 검토사항(PM→작업자)",
    "trade": "보",
    "no": "022",
    "item": "B2G1 늑근 간격 150mm가 아닌\n300mm로 잘못 산출 됨",
    "method": "배근의 전반적인 검토가 필요함.",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 18:29",
    "comment": "",
    "attachments": []
  },
  {
    "group": "최종자료 검토사항(QC→작업자)",
    "trade": "계수",
    "no": "023",
    "item": "유사 프로젝트 대비 콘크리트 계수\n확인",
    "method": "비슷한 형태의 프로젝트를 찾아 콘크리트\n계수가 비슷한지 확인 해 주세요",
    "owner": "PM, 산출 담당자",
    "targets": [
      "PM",
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 18:32",
    "comment": "",
    "attachments": []
  },
  {
    "group": "최종자료 검토사항(QC→작업자)",
    "trade": "계수",
    "no": "024",
    "item": "유사프로젝트 거푸집 계수 검토",
    "method": "비슷한 형식의 프로젝트를 찾아 거푸집 계수\n확인을 해 주세요",
    "owner": "PM, 산출 담당자",
    "targets": [
      "PM",
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 18:32",
    "comment": "",
    "attachments": []
  },
  {
    "group": "최종자료 검토사항(QC→작업자)",
    "trade": "계수",
    "no": "025",
    "item": "유사 프로젝트 대비 철근 계수 검토",
    "method": "비슷한 유형의 프로젝트를 찾아서 계수 검토\n해 주세요",
    "owner": "PM, 산출 담당자",
    "targets": [
      "PM",
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 18:33",
    "comment": "",
    "attachments": []
  },
  {
    "group": "Z1. 질의사항(1차)",
    "trade": "동구분",
    "no": "026",
    "item": "구조 작업 상 실 구분으로 이뤄진\n경우 하나의 동으로 포함 산출\n※ APT\n- 주동부 지상(6401~6405 각\n동별 산출)\n- 주동부 PIT(6401~6405 각\n동별 산출)\n※ 주차장\n- 주차장+기계실\n※ 부대시설\n- 경로당\n- 어린이집\n- 다함께돌봄센터+작은도서관\n- 지역편의시설1+2+피트니스\n- 지역편의시설3\n- 자원봉사관+관리사무소\n- 게스트하우스+파티룸\n- 경비실1+키즈스테이션+문주\n- 경비실2\n- 근린생활시설",
    "method": "동 구분 확인 후 반영 예정",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "PM",
    "createdAt": "2026-04-30 09:51",
    "comment": "발주처 우선 송부 필요",
    "attachments": []
  },
  {
    "group": "Z1. 질의사항(1차)",
    "trade": "동바리",
    "no": "027",
    "item": "기준서 기준에 따르면 전이보를\n포함한 높이를 시스템으로\n작업하는 것으로 보이는데, 아래와\n같은 경우 산출기준 확인\n바랍니다.\n① 빨간색 영역 전체(전이보 밑면\n중복 계산)를 시스템(5.85m)산출\n② 보밑면 면적(초록색)무시하고\n빨간색 영역 전체 시스템(5.85m)\n산출\n③ 초록색 영역을 제외한 나머지\n영역 5.85m, 초록색 하부 5.15m\n상부 공간(빨간색 걸침영역)\n강관 산출",
    "method": "답변 후 적용",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "산출 담당자",
    "createdAt": "2026-04-30 09:53",
    "comment": "",
    "attachments": [
      {
        "name": "동바리_질의첨부.png",
        "dataUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMjQwIDE4MCI+CiAgPHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxODAiIHJ4PSIxOCIgZmlsbD0iIzBmMTcyYSIvPgogIDxyZWN0IHg9IjE4IiB5PSIxOCIgd2lkdGg9IjIwNCIgaGVpZ2h0PSIxNDQiIHJ4PSIxMiIgZmlsbD0iIzExMTgyNyIgc3Ryb2tlPSIjMjU2M2ViIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8dGV4dCB4PSIxMjAiIHk9IjgyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNmZmZmZmYiPuuPmeuwlOumrDwvdGV4dD4KICA8dGV4dCB4PSIxMjAiIHk9IjExMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjOTNjNWZkIj7sp4jsnZgg7LKo67aAPC90ZXh0Pgo8L3N2Zz4=",
        "addedBy": "산출 담당자",
        "addedAt": "2026-04-30 09:53"
      }
    ]
  },
  {
    "group": "Z7. 견적조건(최종)",
    "trade": "옥탑장식물",
    "no": "028",
    "item": "옥탑장식물 표기가 건축입면도 외\n확인이 되지 않습니다.\n옥탑장식물에 대한 도면 제공이\n가능한지 확인 바랍니다.",
    "method": "우선 임의 반영.",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "산출 담당자",
    "createdAt": "2026-04-30 10:01",
    "comment": "",
    "attachments": [
      {
        "name": "옥탑장식물_견적조건첨부.png",
        "dataUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMjQwIDE4MCI+CiAgPHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxODAiIHJ4PSIxOCIgZmlsbD0iIzBmMTcyYSIvPgogIDxyZWN0IHg9IjE4IiB5PSIxOCIgd2lkdGg9IjIwNCIgaGVpZ2h0PSIxNDQiIHJ4PSIxMiIgZmlsbD0iIzExMTgyNyIgc3Ryb2tlPSIjMjU2M2ViIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8dGV4dCB4PSIxMjAiIHk9IjgyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNmZmZmZmYiPuyYpe2DkeyepeyLneusvDwvdGV4dD4KICA8dGV4dCB4PSIxMjAiIHk9IjExMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjOTNjNWZkIj7qsqzsoIHsobDqsbQg7LKo67aAPC90ZXh0Pgo8L3N2Zz4=",
        "addedBy": "산출 담당자",
        "addedAt": "2026-04-30 10:01"
      }
    ]
  },

  /* =========================================
     QC팀 전달사항 · 구조팀 이미지 추가 데이터
     - 사용자 제공 이미지 기준 신규 등록
     ========================================= */
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "공통",
      "trade": "기준서",
      "no": "QC-S001",
      "item": "프로젝트 건설사별 기준서 숙지",
      "method": "각 건설사별 기준서 숙지 특이한 내용이 있다면 별도로 체크후 수량산출시 반영",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 공통"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "기초",
      "no": "QC-S002",
      "item": "버림두께 확인",
      "method": "건축단면도 기준적용 [미표시 60mm 적용]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "기초",
      "no": "QC-S003",
      "item": "버림면적 대비 기초면적과 크게 차이 없는지 확인",
      "method": "\"버림수량/버림두께\"의 면적과 기초 산출의 면적 비교",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "기초",
      "no": "QC-S004",
      "item": "우마철근 기준 확인",
      "method": "건설사별 견적지침서 적용 [별도 표현없을시 기초주철근 2단계 아래, 최소철근 HD13적용]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "기초",
      "no": "QC-S005",
      "item": "내수압과 독립기초의 바닥 레벨이 같은경우 우마철근 추가분 반영확인",
      "method": "내수압과 독립기초의 기초형태일 경우, \"독립두께 - 내수압두께\" 차이만큼의 우마철근 다리보강 추가산출",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "기초",
      "no": "QC-S006",
      "item": "독립기초 및 단차구간 첫배움(현재Con'c) 산출기준 확인",
      "method": "산출 유무 확인 산출시 타설되는 콘크리트 재료강도 확인 [구체, 무근, C급 Con'c]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "기초",
      "no": "QC-S007",
      "item": "외부계단 및 주출입구 옹벽 및 기둥하부 줄기초 또는 독립기초 도면미표시 임의 산출 적용확인",
      "method": "옹벽 또는 기둥 하부에 기초 표현이 없더라도 임의적용하여 산출 [견적조건작성]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "보",
      "no": "QC-S008",
      "item": "각 층별 슬라브 두께별 공제확인",
      "method": "산출내역 재 확인",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "보",
      "no": "QC-S009",
      "item": "보 연결보에 대한 오류검토",
      "method": "산출내용 재 확인",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "보",
      "no": "QC-S010",
      "item": "데크+RC슬라브 일경우 경계부에 대한 보 밑면 거푸집 오류검토",
      "method": "슬라브 면적 산정 기준 확인 보 밑면 거푸집 유무 검토.",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "보",
      "no": "QC-S011",
      "item": "상세도에 보 덧침구간이 없는지 확인",
      "method": "구조 및 건축도면 전체적으로 검토 [참상세도 확인]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "보",
      "no": "QC-S012",
      "item": "인방보 산출시 보조근 정착값 누락확인",
      "method": "산식 확인 후 보조근 정착 누락시 산식 수정(PM에게 내용 전달)",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "보",
      "no": "QC-S013",
      "item": "인방보 산출시 창호 Open 높이값의 오류검토 확인",
      "method": "건축도면의 창호평면도와 개구부 OPEN 공제 비교 검토",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "보",
      "no": "QC-S014",
      "item": "지중보 산출시 버림(버림내민)산출오류검토 확인",
      "method": "보강 인력 재 확인.",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "보",
      "no": "QC-S015",
      "item": "산출 완료후 보 배근 재검토",
      "method": "배근입력 오류 재 확인.",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "슬라브",
      "no": "QC-S016",
      "item": "부호별 데크라인 오류 확인",
      "method": "산출완료후 RC 평면자료를 Excel로 변환하여 필터를 사용해 데크부호별 코드입력체크",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "슬라브",
      "no": "QC-S017",
      "item": "데크 연결근 및 보강근 산식 재확인.\n(RC 프로그램에 따라 산식 차이 존재)",
      "method": "RC 프로그램 산식 확인",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "슬라브",
      "no": "QC-S018",
      "item": "데크 슬라브 공제시 하부 보 공제 여부 확인.",
      "method": "RC 프로그램 산식 확인",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "슬라브",
      "no": "QC-S019",
      "item": "산출 완료후 슬라브 배근 재검토",
      "method": "배근입력 오류 재 확인.",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "기둥",
      "no": "QC-S020",
      "item": "기초두께 입력시 이음 산출 유무 확인",
      "method": "산출식 확인후 기초두께 입력시 주근 이음 산출유무 확인후 산출진행",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "기둥",
      "no": "QC-S021",
      "item": "연결기둥 입력시 주근의 이음개소 또는 정착 오류체크",
      "method": "산출식 확인후 연결기둥에 대한 산식 이해후 산출진행",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "기둥",
      "no": "QC-S022",
      "item": "기둥주근 중간이음과 최상층 HOOK 정착의 누락이 없는지 확인",
      "method": "산출 완료 후 기둥 주근의 중간 이음 및 HOOK 정착 누락 중복 여부 확인",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "기둥",
      "no": "QC-S023",
      "item": "층고가 높은 건물에 대한 주근 추가이음에 누락이 없는지 확인",
      "method": "(층고+기둥이음길이) = 80m 이상시 추가이음 1EA 산출적용",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "기둥",
      "no": "QC-S024",
      "item": "원형기둥일경우 원형거푸집 구분확인",
      "method": "원형기둥은 거푸집 별도 구분하여 산출적용. 아이템 누락 여부확인.",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "기둥",
      "no": "QC-S025",
      "item": "산출 완료후 기둥배근 재검토",
      "method": "배근입력 오류 재 확인.",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "옹벽",
      "no": "QC-S026",
      "item": "기초두께 입력시 이음의 산출 유무 확인",
      "method": "RC 프로그램 산식 확인",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "옹벽",
      "no": "QC-S027",
      "item": "옹벽 평면과 아파트Unit 산식을 확인후 산출진행",
      "method": "RC 프로그램 산식 확인",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "옹벽",
      "no": "QC-S028",
      "item": "옹벽 상부에 슬라브or보 공제값에 오류체크",
      "method": "RC 프로그램 산식 확인",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "옹벽",
      "no": "QC-S029",
      "item": "산출 완료후 옹벽 배근 재검토",
      "method": "배근입력 오류 재 확인.",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "한국팀",
      "trade": "동바리",
      "no": "QC-S030",
      "item": "동바리(시스템동바리) 단위를 확인 (m2, m3, 10공m3?)",
      "method": "FIN DATA 산출근거 집계표 검토",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 한국팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "한국팀",
      "trade": "동바리",
      "no": "QC-S031",
      "item": "동바리 수량 데크 면적을 제외확인",
      "method": "RC DATA [부재/층별집계], FIN DATA [수량] 비교검토",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 한국팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "한국팀",
      "trade": "동바리",
      "no": "QC-S032",
      "item": "동바리 수량 데크+RC보하부 동바리 누락체크",
      "method": "RC DATA [부재/층별집계], FIN DATA [수량] 비교검토",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 한국팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "한국팀",
      "trade": "동바리",
      "no": "QC-S033",
      "item": "2중 SLAB 구간 확인 [정화조관리층 ELEV PIT 등 재검토]",
      "method": "RC DATA [부재/층별집계], FIN DATA [수량] 비교검토",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 한국팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "한국팀",
      "trade": "동바리",
      "no": "QC-S034",
      "item": "동바리 수량에 계단면적 누락이 없는지 확인",
      "method": "RC DATA [부재/층별집계], FIN DATA [수량] 비교검토",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 한국팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "한국팀",
      "trade": "동바리",
      "no": "QC-S035",
      "item": "시스템동바리가 필요구간 재확인 [최상층 계단실]",
      "method": "건축단면도 확인후 필요시 시스템동바리 적용",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 한국팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "한국팀",
      "trade": "동바리",
      "no": "QC-S036",
      "item": "시스템동바리가 필요구간 재확인 [기계실 및 Open구간]",
      "method": "건축단면도 확인후 필요시 시스템동바리 적용",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 한국팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "자가검토",
      "no": "QC-S037",
      "item": "기초면적 확인",
      "method": "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "자가검토",
      "no": "QC-S038",
      "item": "독립기초 개소, 줄기초(지중보) 길이확인",
      "method": "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "자가검토",
      "no": "QC-S039",
      "item": "층별 기둥 개소 확인",
      "method": "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "자가검토",
      "no": "QC-S040",
      "item": "층별 보 길이 확인",
      "method": "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수평팀",
      "trade": "자가검토",
      "no": "QC-S041",
      "item": "층별 슬라브 면적 확인",
      "method": "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수평팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "수직팀",
      "trade": "자가검토",
      "no": "QC-S042",
      "item": "층별 옹벽 평면길이와 CAD 길이가 동일한지 확인",
      "method": "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · 수직팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "PM",
      "trade": "콘크리트",
      "no": "QC-S043",
      "item": "층별 및 부재별 콘크리트 강도확인",
      "method": "자가검토시 층별집계 조회 확인 필수",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · PM"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "PM",
      "trade": "장비패드",
      "no": "QC-S044",
      "item": "장비패드 배근도 유무 확인",
      "method": "일반적으로 구조도면에는 표현이 없고 건축참상세도 참고하여 적용",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · PM"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "PM",
      "trade": "PE필름",
      "no": "QC-S045",
      "item": "PE필름 아이템 산출기준 확인",
      "method": "건축단면도 기준으로 하며 별도 표현없을시 001'2검을 일반적으로 산출한다",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · PM"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },
  {
      "group": "QC팀 전달사항",
      "middleCategory": "구조팀",
      "subCategory": "PM",
      "trade": "잡석지정",
      "no": "QC-S046",
      "item": "파일기초에 잡석표현이 있는지 확인",
      "method": "파일기초일경우 잡석지정은 산출제외대상이므로 중복으로 산출하지않는다",
      "owner": "QC TEAM",
      "targets": [
          "구조팀 · PM"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-12 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
          {
              "action": "이미지 기준 구조팀 QC 전달사항 등록",
              "worker": "QC TEAM",
              "time": "2026-05-12 09:00"
          }
      ]
  },

  /* =========================================
     QC팀 전달사항 · 마감팀 엑셀 변환 더미데이터
     - 원본: 05. 수량산출 Check List_(컨코스트).xlsx
     - 내부팀 시트 → 내부팀
     - 외부팀 시트 → 외부
     - 창호팀/조적팀 시트 → 조적ㆍ창호
     ========================================= */
  {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "레미콘",
      "no": "QC-M001",
      "item": "재료 할증 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "레미콘",
      "no": "QC-M002",
      "item": "CON`C 강도에 맞게 산출되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "레미콘",
      "no": "QC-M003",
      "item": "높이를 곱하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "콘크리트타설",
      "no": "QC-M004",
      "item": "레미콘 미할증 수량과 동일한지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "콘크리트타설",
      "no": "QC-M005",
      "item": "높이를 곱하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "와이어메쉬",
      "no": "QC-M006",
      "item": "해당재로가 설치되는지 도면을 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "섬유보강재",
      "no": "QC-M007",
      "item": "해당재로가 설치되는지 도면을 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "지수판",
      "no": "QC-M008",
      "item": "끊어치기 구간 및 지하층 이어치기 구간에 맞게 산출되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "장비패드",
      "no": "QC-M009",
      "item": "사이즈별 수량확인을 하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "방수",
      "no": "QC-M010",
      "item": "방수계획도에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "방수",
      "no": "QC-M011",
      "item": "방수바탕면 정리 적용하였는가? (도막방수 & 복합방수)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "방수",
      "no": "QC-M012",
      "item": "석고보드 벽체 방수를 맞게 적용하였는가?(도막방수 & 시트방수)\n시멘트 액체방수, 침투성 방수 사용불가",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "방수",
      "no": "QC-M013",
      "item": "DA방수 적용을 \"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "코너 도막방수",
      "no": "QC-M014",
      "item": "바닥둘레 및 벽체 코너 길이로 산출되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "드레인 주위 도막 방수",
      "no": "QC-M015",
      "item": "드레인 주위에 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "배수판(바닥,벽체)",
      "no": "QC-M016",
      "item": "배수판 규격 제대로 확인 하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "배수판(바닥,벽체)",
      "no": "QC-M017",
      "item": "배수판 무근콘크리트 충진을 \"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "방수보호재 or 보호모르타르",
      "no": "QC-M018",
      "item": "방수 수량과 동일하게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "방수모르타르바름",
      "no": "QC-M019",
      "item": "트렌치에 맞게 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "신축줄눈[SAW CUT]",
      "no": "QC-M020",
      "item": "지하주차장 바닥에 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "수밀코킹(실리콘)",
      "no": "QC-M021",
      "item": "ELEV 주위를 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "수밀코킹(실리콘)",
      "no": "QC-M022",
      "item": "이질재료의 접합부를 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "부자재",
      "no": "QC-M023",
      "item": "보호모르타르 두께별로 부자재를 변경하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "타일",
      "no": "QC-M024",
      "item": "자재할증 3% 적용 확인 및 도면에 맞게 품명, 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "타일",
      "no": "QC-M025",
      "item": "단위세대일경우 타입별, 실별로 아이템을 구분하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "타일",
      "no": "QC-M026",
      "item": "타일 자재수량과 설치수량이 동일한가?(할증제외)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "바닥타일붙이기",
      "no": "QC-M027",
      "item": "도면에 맞게 품명, 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "바닥타일붙이기",
      "no": "QC-M028",
      "item": "단위세대일경우 실별로 설치를 구분하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "벽타일붙이기",
      "no": "QC-M029",
      "item": "도면에 맞게 품명, 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "벽타일붙이기",
      "no": "QC-M030",
      "item": "옹벽, 조적, 석고보드벽에 맞게 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "코너비드",
      "no": "QC-M031",
      "item": "적용부위에 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "부자재",
      "no": "QC-M032",
      "item": "타일설치 모르타르 두께별로 부자재를 변경하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "모르타르바름(내벽)/(초벌)",
      "no": "QC-M033",
      "item": "화장실 천정속 조적벽면 초벌미장 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "모르타르바름(바닥)",
      "no": "QC-M034",
      "item": "도면에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "판넬히팅",
      "no": "QC-M035",
      "item": "도면에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "쇠흙손마감/기계휘니셔",
      "no": "QC-M036",
      "item": "\"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "쇠흙손마감/기계휘니셔",
      "no": "QC-M037",
      "item": "방수하부를 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "쇠흙손마감/기계휘니셔",
      "no": "QC-M038",
      "item": "EPS/TPS 등 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "조면처리",
      "no": "QC-M039",
      "item": "램프바닥에 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "ELEV주위 모르타르 충전",
      "no": "QC-M040",
      "item": "ELEV 주위를 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "모르타르바름(벽)",
      "no": "QC-M041",
      "item": "도면에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "모르타르바름(벽)",
      "no": "QC-M042",
      "item": "높이별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "콘크리트면처리\n(마감미장)",
      "no": "QC-M043",
      "item": "부위별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "콘크리트면처리\n(마감미장)",
      "no": "QC-M044",
      "item": "높이별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "콘크리트면처리\n(마감미장)",
      "no": "QC-M045",
      "item": "방수하부를 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "부자재",
      "no": "QC-M046",
      "item": "바닥 및 벽체 모르타르 두께별로 부자재를 변경하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "경량철골천장틀",
      "no": "QC-M047",
      "item": "달대 높이 별 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "경량철골천장틀",
      "no": "QC-M048",
      "item": "달대 2M 이상 시 보강틀을 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "경량철골천장틀",
      "no": "QC-M049",
      "item": "천정재료 산출시 \"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "경량철골천장틀",
      "no": "QC-M050",
      "item": "천정틀 포함하는 아이템을 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "알루미늄시트",
      "no": "QC-M051",
      "item": "평판과 곡판을 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "알루미늄시트",
      "no": "QC-M052",
      "item": "기본적인틀 이외 추가적인 틀을 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "캐노피",
      "no": "QC-M053",
      "item": "규격 및 단위 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "사다리",
      "no": "QC-M054",
      "item": "도면에 맞게 규격 적용하였는가? (잡상세도 확인)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "사다리",
      "no": "QC-M055",
      "item": "ELEV PIT에 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "사다리",
      "no": "QC-M056",
      "item": "사다리에 안전케이지 포함 여부를 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "핸드레일",
      "no": "QC-M057",
      "item": "도면에 맞게 규격 적용하였는가? (상세도 확인)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "커텐박스 및 조명박스",
      "no": "QC-M058",
      "item": "도면에 맞게 규격 적용하였는가? (천정평면도 및 상세도 확인)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "장애인 관련 아이템",
      "no": "QC-M059",
      "item": "장애인설치계획도를 확인하여 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "코너비드",
      "no": "QC-M060",
      "item": "부위에 맞게 각종 비드를 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "코너비드",
      "no": "QC-M061",
      "item": "\"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "앵글코너가드/장비패드",
      "no": "QC-M062",
      "item": "상세도를 확인하여 적용부위에 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "집수정뚜껑",
      "no": "QC-M063",
      "item": "사이즈별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "집수정뚜껑",
      "no": "QC-M064",
      "item": "도면에 표시된 수량과 산출수량이 동일한가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "집수정뚜껑",
      "no": "QC-M065",
      "item": "강재 집수정을 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "AL 몰딩",
      "no": "QC-M066",
      "item": "누락없이 산출되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "PD 칸막이",
      "no": "QC-M067",
      "item": "재료를 확인하여 산출하였는가?\n(철재 : 내부팀, 조적 : 조적팀)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "엘리베이터 후크",
      "no": "QC-M068",
      "item": "엘리베이터 수량과 동일하게 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "천장점검구",
      "no": "QC-M069",
      "item": "도면에 표시가 되어있는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "천장점검구",
      "no": "QC-M070",
      "item": "사이즈별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "트렌치",
      "no": "QC-M071",
      "item": "도면 및 위치에 맞게 종류별로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "단열재",
      "no": "QC-M072",
      "item": "형별성능관계내역 및 단열계획도에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "단열재",
      "no": "QC-M073",
      "item": "\"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "단열재",
      "no": "QC-M074",
      "item": "보측면 누락없이 산출되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "단열재",
      "no": "QC-M075",
      "item": "아이템을 보기와 같이 정리하였는가?\n규격: (적용부위), (단열재 재질) (단열재 두께)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "석고판못붙임",
      "no": "QC-M076",
      "item": "자재와 수량 동일한지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "텍스 붙임",
      "no": "QC-M077",
      "item": "자재와 수량 동일한지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "도배바름(벽지)",
      "no": "QC-M078",
      "item": "기준서에 맞게 도배면 퍼티 관련 산출하였는가? (단위세대)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "도배바름(벽지)",
      "no": "QC-M079",
      "item": "타입별, 벽지 종류별, 실별 구분하여 산출하였는가? (단위세대)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "마루",
      "no": "QC-M080",
      "item": "타입별, 자재 종류별 구분 산출하였는가? (단위세대)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "마루",
      "no": "QC-M081",
      "item": "주방가구 하부 바닥면적 공제하였는가? (단위세대)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "재료분리대\n(현관디딤판)",
      "no": "QC-M082",
      "item": "현관디딤판과 온돌마루 경계부위에 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "악세스후로아",
      "no": "QC-M083",
      "item": "자재포함으로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "OA플로어",
      "no": "QC-M084",
      "item": "자재를 분리하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "OA플로어",
      "no": "QC-M085",
      "item": "자재를 \"00000 / OA플로어\"으로 구분하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "계단논슬립",
      "no": "QC-M086",
      "item": "석재 이외의 재료일경우 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "페인트",
      "no": "QC-M087",
      "item": "부위에 맞게 규격 적용되었는가? (내부,내천정,외부,외천정 등)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "페인트",
      "no": "QC-M088",
      "item": "바탕면에 맞게 적용하였는가? (석고보드면, CONC,몰탈면)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "페인트",
      "no": "QC-M089",
      "item": "도장 횟수를 확인하였는가? (재료마감표 NOTE란 확인)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "페인트",
      "no": "QC-M090",
      "item": "페인트를 도면에 맞게 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "분진방지페인트",
      "no": "QC-M091",
      "item": "악세스후로아 하부에 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "에폭시코팅, 라이닝, 페인트",
      "no": "QC-M092",
      "item": "도면에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "에폭시코팅, 라이닝, 페인트",
      "no": "QC-M093",
      "item": "주차통로구간, 주차구획구간에 대한 마감이 구분되어있는지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "주차장 마킹관련",
      "no": "QC-M094",
      "item": "주차마크 관련 주차계획도에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "그래픽 공사",
      "no": "QC-M095",
      "item": "색채계획도면 맞게 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "주방가구 하부 페인트",
      "no": "QC-M096",
      "item": "주방가구 하부 마루 공제부위에 적용하였는가? (단위세대)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "화강석붙임(바닥)",
      "no": "QC-M097",
      "item": "외부 지상출입구 바닥 및 외부계단 누락없이 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "화강석붙임(바닥)",
      "no": "QC-M098",
      "item": "바닥 모르타르 두께를 확인하며 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "디딤판",
      "no": "QC-M099",
      "item": "계단의 경우 디딤판을 M로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "챌판",
      "no": "QC-M100",
      "item": "계단의 경우 챌판을 M2로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "화강석붙임(벽)",
      "no": "QC-M101",
      "item": "(건식/앵커) or (건식/TRUSS) 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "화강석붙임(벽)",
      "no": "QC-M102",
      "item": "이격거리 W:200 이상일 경우 (건식/TRUSS)로 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "화강석붙임(벽)",
      "no": "QC-M103",
      "item": "내/외부 창문주위 창대석 및 마구리 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "세면대",
      "no": "QC-M104",
      "item": "WIDE별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "세면대",
      "no": "QC-M105",
      "item": "세면대 하부에 수납장이 있을경우 별도로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "부자재",
      "no": "QC-M106",
      "item": "바닥 및 벽체 모르타르 두께별로 부자재를 변경하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "부자재",
      "no": "QC-M107",
      "item": "디딤판 등 M로 산출하는 아이템 산정시 WIDE를 곱하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "카스토퍼 및 코너가드",
      "no": "QC-M108",
      "item": "도면에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "엘리베이터 및 에스컬레이터",
      "no": "QC-M109",
      "item": "도면에 해당항목이 있다면 적용하였는가? (산출 해야합니다.)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "기계식주차시스템",
      "no": "QC-M110",
      "item": "도면에 해당항목이 있다면 적용하였는가? (산출 해야합니다.)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "차수판",
      "no": "QC-M111",
      "item": "도면에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "가구",
      "no": "QC-M112",
      "item": "상세도면에 맞게 규격 적용하였는가? 또한 수량이 맞는지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "화장대 상판",
      "no": "QC-M113",
      "item": "상판 분리하여 산출하였는가? (단위세대)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "주방가구 상판",
      "no": "QC-M114",
      "item": "상판 분리하여 산출하였는가? (단위세대)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "내부팀",
      "trade": "가전",
      "no": "QC-M115",
      "item": "쿡탑, 후드 등 기본적인 산출 아이템 확인.",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 내부팀"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "강관쌍줄비계 or 시스템비계",
      "no": "QC-M116",
      "item": "건물의 외벽 및 구조체에서 0.9m 떨어진 외주길이에 건물높이+1.0M 까지의 외부면적으로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "강관쌍줄비계 or 시스템비계",
      "no": "QC-M117",
      "item": "저층부 비계산출시 높이를 흙에 뭍히는 구간까지 추가하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "강관쌍줄비계 or 시스템비계",
      "no": "QC-M118",
      "item": "골조용과 마감용 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "강관쌍줄비계 or 시스템비계",
      "no": "QC-M119",
      "item": "지하층 OPEN컷 구간 비계를 산출하였는가? 합벽거푸집 구간은 제외하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "강관쌍줄비계 or 시스템비계",
      "no": "QC-M120",
      "item": "갱폼 구간 제외하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "강관쌍줄비계 or 시스템비계",
      "no": "QC-M121",
      "item": "내부 OPEN부 높이 8M 이상인 구간 비계를 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "먹메김",
      "no": "QC-M122",
      "item": "연면적과 동일한지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "CON'C보양",
      "no": "QC-M123",
      "item": "연면적+건축면적과 동일한지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "타일 및 석재보양",
      "no": "QC-M124",
      "item": "석재 및 타일 바닥부분 수량과 동일한지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "건축물 현장정리",
      "no": "QC-M125",
      "item": "연면적과 동일한지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "면적당 규준틀",
      "no": "QC-M126",
      "item": "건축면적과 동일한지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "레미콘",
      "no": "QC-M127",
      "item": "재료 할증 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "레미콘",
      "no": "QC-M128",
      "item": "CON`C 강도에 맞게 산출되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "레미콘",
      "no": "QC-M129",
      "item": "높이를 곱하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "콘크리트타설",
      "no": "QC-M130",
      "item": "레미콘 미할증 수량과 동일한지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "콘크리트타설",
      "no": "QC-M131",
      "item": "높이를 곱하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "와이어메쉬",
      "no": "QC-M132",
      "item": "해당재로가 설치되는지 도면을 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "섬유보강재",
      "no": "QC-M133",
      "item": "해당재로가 설치되는지 도면을 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "장비패드",
      "no": "QC-M134",
      "item": "사이즈별 수량확인을 하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "시멘트벽돌 & 미장벽돌",
      "no": "QC-M135",
      "item": "재료 할증 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "0.5B or 1.0B 시멘트벽돌쌓기",
      "no": "QC-M136",
      "item": "길이값과 높이값이 제대로 적용되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "0.5B or 1.0B 시멘트벽돌쌓기",
      "no": "QC-M137",
      "item": "옥상 PD부위 상세도면을 확인하여 산출을 하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "0.5B or 1.0B 시멘트벽돌쌓기",
      "no": "QC-M138",
      "item": "피로티, 지하주차장 상부 슬라스 단차 등을 도면에서 확인하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "벽돌 운반",
      "no": "QC-M139",
      "item": "벽돌쌓기 합계수량과 동일한가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "각종인방",
      "no": "QC-M140",
      "item": "규격에 맞게 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "방수",
      "no": "QC-M141",
      "item": "방수계획도에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "방수",
      "no": "QC-M142",
      "item": "방수바탕면 정리 적용하였는가? (도막방수 & 복합방수)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "방수",
      "no": "QC-M143",
      "item": "노출형인지 비노출형인지 구분하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "방수",
      "no": "QC-M144",
      "item": "파라펫 방수설치 높이를 도면에서 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "방수",
      "no": "QC-M145",
      "item": "지하주차장 상부 슬라브 방수 산출시 단차구간을 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "방수",
      "no": "QC-M146",
      "item": "지하주차장 상부 슬라브 방수 산출시 외곽둘레로 방수내림을 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "방수",
      "no": "QC-M147",
      "item": "지하주차장 상부 슬라브 방수 산출시 각 동별로 벽체 방수를 누락없이 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "드레인 주위 도막 방수",
      "no": "QC-M148",
      "item": "드레인 주위에 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "방수보호재 or 보호모르타르",
      "no": "QC-M149",
      "item": "방수 수량과 동일하게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "방수보호재 or 보호모르타르",
      "no": "QC-M150",
      "item": "방수보호재인지 보호몰탈인지 도면에서 확인하고 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "방수모르타르바름",
      "no": "QC-M151",
      "item": "트렌치에 맞게 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "신축줄눈 and\nSAW CUT",
      "no": "QC-M152",
      "item": "무근콘크리트가 설치되는 옥상에 산출하였는가?\n(노출형 방수 미산출)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "신축줄눈 and\nSAW CUT",
      "no": "QC-M153",
      "item": "설치간격은 상세도면을 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "수밀코킹(실리콘)",
      "no": "QC-M154",
      "item": "파라펫 코킹이 설치되는지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "부자재",
      "no": "QC-M155",
      "item": "보호모르타르 두께별로 부자재를 변경하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "모르타르바름(바닥)",
      "no": "QC-M156",
      "item": "도면에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "쇠흙손마감/기계휘니셔",
      "no": "QC-M157",
      "item": "\"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "쇠흙손마감/기계휘니셔",
      "no": "QC-M158",
      "item": "무근콘크리트가 최종마감일경우 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "쇠흙손마감/기계휘니셔",
      "no": "QC-M159",
      "item": "지하주차장 상부 슬라브 무근콘크리트 산출시 제외하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "쇠흙손마감/기계휘니셔",
      "no": "QC-M160",
      "item": "방수하부를 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "쇠흙손마감/기계휘니셔",
      "no": "QC-M161",
      "item": "EPS/TPS 등 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "조면처리",
      "no": "QC-M162",
      "item": "램프바닥에 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "모르타르바름(바닥)",
      "no": "QC-M163",
      "item": "도면에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "모르타르바름(바닥)",
      "no": "QC-M164",
      "item": "높이별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "콘크리트면처리\n(마감미장)",
      "no": "QC-M165",
      "item": "부위별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "콘크리트면처리\n(마감미장)",
      "no": "QC-M166",
      "item": "높이별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "콘크리트면처리\n(마감미장)",
      "no": "QC-M167",
      "item": "방수하부를 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "콘크리트면처리\n(마감미장)",
      "no": "QC-M168",
      "item": "외벽이 도장이 경우 창호주위에 추가로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "부자재",
      "no": "QC-M169",
      "item": "바닥 및 벽체 모르타르 두께별로 부자재를 변경하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "경량철골천장틀",
      "no": "QC-M170",
      "item": "달대 높이 별 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "경량철골천장틀",
      "no": "QC-M171",
      "item": "달대 2M 이상 시 보강틀을 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "경량철골천장틀",
      "no": "QC-M172",
      "item": "천정재료 산출시 \"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "경량철골천장틀",
      "no": "QC-M173",
      "item": "천정틀 포함하는 아이템을 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "알루미늄시트",
      "no": "QC-M174",
      "item": "평판과 곡판을 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "알루미늄시트",
      "no": "QC-M175",
      "item": "기본적인틀 이외 추가적인 틀을 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "캐노피",
      "no": "QC-M176",
      "item": "규격 및 단위 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "사다리",
      "no": "QC-M177",
      "item": "도면에 맞게 규격 적용하였는가? (잡상세도 확인)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "사다리",
      "no": "QC-M178",
      "item": "옥탑지붕에 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "사다리",
      "no": "QC-M179",
      "item": "사다리에 안전케이지 포함 여부를 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "핸드레일",
      "no": "QC-M180",
      "item": "도면에 맞게 규격 적용하였는가? (상세도 확인)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "커텐박스 및 조명박스",
      "no": "QC-M181",
      "item": "도면에 맞게 규격 적용하였는가? (천정평면도 및 상세도 확인)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "장애인 관련 아이템",
      "no": "QC-M182",
      "item": "장애인설치계획도를 확인하여 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "코너비드",
      "no": "QC-M183",
      "item": "부위에 맞게 각종 비드를 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "코너비드",
      "no": "QC-M184",
      "item": "\"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "앵글코너가드/장비패드",
      "no": "QC-M185",
      "item": "상세도를 확인하여 적용부위에 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "AL 몰딩",
      "no": "QC-M186",
      "item": "누락없이 산출되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "천장점검구",
      "no": "QC-M187",
      "item": "도면에 표시가 되어있는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "천장점검구",
      "no": "QC-M188",
      "item": "사이즈별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "트렌치",
      "no": "QC-M189",
      "item": "도면 및 위치에 맞게 종류별로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "판넬설치",
      "no": "QC-M190",
      "item": "자재포함하여 종류별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "판넬설치",
      "no": "QC-M191",
      "item": "판넬공사에 설치되는 후레싱을 부위별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "판넬설치",
      "no": "QC-M192",
      "item": "지붕형태에 따른 후레싱은 \"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "익스펜션조인트",
      "no": "QC-M193",
      "item": "상세도 및 각종 도면을 확인하여 부위별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "파라펫링",
      "no": "QC-M194",
      "item": "설치간격을 상세도에서 확인하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "단열재",
      "no": "QC-M195",
      "item": "형별성능관계내역 및 단열계획도에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "단열재",
      "no": "QC-M196",
      "item": "\"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "단열재",
      "no": "QC-M197",
      "item": "보측면 누락없이 산출되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "단열재",
      "no": "QC-M198",
      "item": "아이템을 보기와 같이 정리하였는가?\n규격: (적용부위), (단열재 재질) (단열재 두께)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "페인트",
      "no": "QC-M199",
      "item": "부위에 맞게 규격 적용되었는가? (내부,내천정,외부,외천정 등)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "페인트",
      "no": "QC-M200",
      "item": "바탕면에 맞게 적용하였는가? (석고보드면, CONC,몰탈면)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "페인트",
      "no": "QC-M201",
      "item": "도장 횟수를 확인하였는가? (재료마감표 NOTE란 확인)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "페인트",
      "no": "QC-M202",
      "item": "페인트를 도면에 맞게 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "에폭시코팅, 라이닝, 페인트",
      "no": "QC-M203",
      "item": "도면에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "층간조인트 탄성페인트",
      "no": "QC-M204",
      "item": "아파트일경우 페인트 설치구간에 둘레길이로 층별로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "석재뿜칠",
      "no": "QC-M205",
      "item": "설치위치별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "화강석붙임(바닥)",
      "no": "QC-M206",
      "item": "외부 지상출입구 바닥 및 외부계단 누락없이 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "화강석붙임(바닥)",
      "no": "QC-M207",
      "item": "바닥 모르타르 두께를 확인하며 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "디딤판",
      "no": "QC-M208",
      "item": "계단의 경우 디딤판을 M로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "챌판",
      "no": "QC-M209",
      "item": "계단의 경우 챌판을 M2로 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "화강석붙임(벽)",
      "no": "QC-M210",
      "item": "(건식/앵커) or (건식/TRUSS) 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "화강석붙임(벽)",
      "no": "QC-M211",
      "item": "이격거리 W:200 이상일 경우 (건식/TRUSS)로 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "화강석붙임(벽)",
      "no": "QC-M212",
      "item": "내/외부 창문주위 창대석 및 마구리 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "옥외 송수관 마감",
      "no": "QC-M213",
      "item": "잡상세도 확인하여 누락없이 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "국기계양대",
      "no": "QC-M214",
      "item": "국기계양대에 설치되는 석재는 포함으로 산출하였는가?(산출 X)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "부자재",
      "no": "QC-M215",
      "item": "바닥 및 벽체 모르타르 두께별로 부자재를 변경하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "부자재",
      "no": "QC-M216",
      "item": "디딤판 등 M로 산출하는 아이템 산정시 WIDE를 곱하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "루프드레인",
      "no": "QC-M217",
      "item": "우수계획도를 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "루프드레인",
      "no": "QC-M218",
      "item": "사이포닉시스템은 산출제외하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "루프드레인",
      "no": "QC-M219",
      "item": "수직형, L형인지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "선홈통",
      "no": "QC-M220",
      "item": "높이에 맞게 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "외부",
      "trade": "상자홈통, 빗물받이블럭",
      "no": "QC-M221",
      "item": "루프드레인(L형) 개소와 동일한가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 외부"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "수밀코킹(실리콘)",
      "no": "QC-M222",
      "item": "창호주위를 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "수밀코킹(실리콘)",
      "no": "QC-M223",
      "item": "벽지가 설치되는 부위에는 제외 하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "접합코킹",
      "no": "QC-M224",
      "item": "유리와 유리가 만나는 부위(프레임이 없는경우)에 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "방화코킹",
      "no": "QC-M225",
      "item": "방화유리 설치구간에 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "창문틀 주위 충전\n(몰탈 OR 발포)",
      "no": "QC-M226",
      "item": "벽체 종류별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "창문틀 주위 충전\n(몰탈 OR 발포)",
      "no": "QC-M227",
      "item": "창호 종류별로 산출기준을 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "창호",
      "no": "QC-M228",
      "item": "CAD작업도면과 동일하게 수량을 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "창호",
      "no": "QC-M229",
      "item": "도면에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "창호",
      "no": "QC-M230",
      "item": "하드웨어는 일람표에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "창호",
      "no": "QC-M231",
      "item": "커튼월 수량 입력시 수량 확인 하였는가?(층별입력 X)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "창호",
      "no": "QC-M232",
      "item": "단위세대 창호 산출시 문선 및 람마 포함여부 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "창호",
      "no": "QC-M233",
      "item": "창호 설치 위치를 명기하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "창호",
      "no": "QC-M234",
      "item": "셔터일람표가 없지만 평면도를 보고 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "층간방화구획",
      "no": "QC-M235",
      "item": "산출 적용구간 확인하였는가? (누락주의)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "방충망",
      "no": "QC-M236",
      "item": "창호 종류별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "방충망",
      "no": "QC-M237",
      "item": "재질별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "방충망",
      "no": "QC-M238",
      "item": "프로젝트 창호 방충방을 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "배연창",
      "no": "QC-M239",
      "item": "사이즈별로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "SGP칸막이 창호",
      "no": "QC-M240",
      "item": "창호도에 표현이 되어있는지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "커튼월백판넬",
      "no": "QC-M241",
      "item": "도면에 맞게 규격 적용하였는가? (단열재 규격 등)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "자동폐쇠장치",
      "no": "QC-M242",
      "item": "설치위치를 확인하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "유리",
      "no": "QC-M243",
      "item": "도면에 맞게 유리 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "유리",
      "no": "QC-M244",
      "item": "스팬드럴구간을 확인하여 유리를 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "유리",
      "no": "QC-M245",
      "item": "유리가 이중으로 설치되는지 확인하고 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "유리",
      "no": "QC-M246",
      "item": "이중으로 설치될 경우 유리 사양이 다른지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "유리끼우기 및 닦기",
      "no": "QC-M247",
      "item": "유리 면적과 동일한지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "유리코킹",
      "no": "QC-M248",
      "item": "일반BAR 히든BAR에 맞게 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "유리문",
      "no": "QC-M249",
      "item": "규격에 맞게 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "유리문",
      "no": "QC-M250",
      "item": "플로어힌지, 손잡이 등 하드웨어 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "유리문",
      "no": "QC-M251",
      "item": "4면 프레임 유리문을 별도로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "자동문 & 회전문",
      "no": "QC-M252",
      "item": "도면에 맞게 규격 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "페인트",
      "no": "QC-M253",
      "item": "도어에 설치하는 페인트의 종류를 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "페인트",
      "no": "QC-M254",
      "item": "페인트 설치 구간을 확인하였는가?(문틀만 OR 전체)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "페인트",
      "no": "QC-M255",
      "item": "도어 종류별 도장배수를 확인하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "페인트",
      "no": "QC-M256",
      "item": "셔터도면에 페인트가 표현되어 있어도 산출 제외 하였는가? (산출 X)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "시멘트벽돌 & 미장벽돌",
      "no": "QC-M257",
      "item": "재료 할증 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "0.5B or 1.0B 시멘트벽돌쌓기",
      "no": "QC-M258",
      "item": "길이값과 높이값이 제대로 적용되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "0.5B or 1.0B 시멘트벽돌쌓기",
      "no": "QC-M259",
      "item": "슬라브 단차이가 생기는 부분을 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "0.5B or 1.0B 시멘트벽돌쌓기",
      "no": "QC-M260",
      "item": "보하부와 슬라브 하부를 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "벽돌 운반",
      "no": "QC-M261",
      "item": "벽돌쌓기 합계수량과 동일한가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "블럭보강쌓기",
      "no": "QC-M262",
      "item": "4\", 6\", 8\" 규격별, 쌓기 종류별(사춤1종, 한면치장, 양면치장) 구분 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "블럭보강쌓기",
      "no": "QC-M263",
      "item": "보강근,블록메쉬 등 부속자재들 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "블럭보강쌓기",
      "no": "QC-M264",
      "item": "방습벽점검구 및 횐기그릴 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "블럭보강쌓기",
      "no": "QC-M265",
      "item": "방습벽일경우 슬리브를 산출하였는가?\n(최하층, 기준층 분리)",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "블럭보강쌓기",
      "no": "QC-M266",
      "item": "방습벽일경우 상세도에서 몰탈받이 메쉬도면을 확인하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "SGP칸막이",
      "no": "QC-M267",
      "item": "\"01. Vietnam Educational Materials and Measures. VER.02(23.01.26)\"기준에 맞게 적용하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "SGP칸막이 창호",
      "no": "QC-M268",
      "item": "창호도에 표현이 되어있는지 확인하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "방수턱",
      "no": "QC-M269",
      "item": "수량확인 및 구조팀에게 이기 하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "각종인방",
      "no": "QC-M270",
      "item": "규격에 맞게 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "각종인방",
      "no": "QC-M271",
      "item": "오픈 길이에 맞는 아이템을 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "건식벽",
      "no": "QC-M272",
      "item": "건식벽체 리스트에 있는 벽체들이 다 산출이 되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "건식벽",
      "no": "QC-M273",
      "item": "건축마감과 인테리어 마감이 분리가 되었는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "건식벽",
      "no": "QC-M274",
      "item": "도면이 없을경우 일반, 방수, 방화를 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "창상후 보강",
      "no": "QC-M275",
      "item": "높이별로 단열 유/무로 구분하여 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    },
    {
      "group": "QC팀 전달사항",
      "middleCategory": "마감팀",
      "subCategory": "조적ㆍ창호",
      "trade": "벽공간 단열재",
      "no": "QC-M276",
      "item": "벽 공간 단열재 산출하였는가?",
      "method": "",
      "owner": "QC TEAM",
      "targets": [
        "마감팀 · 조적ㆍ창호"
      ],
      "creator": "QC TEAM",
      "createdAt": "2026-05-08 09:00",
      "status": "미확인",
      "objectionEnabled": false,
      "comment": "",
      "attachments": [],
      "history": [
        {
          "action": "엑셀 더미데이터 등록",
          "worker": "QC TEAM",
          "time": "2026-05-08 09:00"
        }
      ]
    }
];
checklistRows = checklistRows.map(row => ({
  ...row,
  group: normalizeChecklistGroupName(row.group)
}));

// QC팀 전달사항은 모든 프로젝트 공통 템플릿 자료이므로
// 초기 프로젝트 체크리스트 화면에는 표시하지 않고,
// 상단의 "QC팀 전달사항 편집하기"에서 선택 후 불러올 때만 현재 프로젝트에 반영한다.
const qcTeamTemplateSeedRows = checklistRows
  .filter(row => normalizeChecklistGroupName(row.group) === "QC팀 전달사항")
  .map(row => ({ ...row }));

checklistRows = checklistRows.filter(row => normalizeChecklistGroupName(row.group) !== "QC팀 전달사항");

// QC 체크리스트 더미데이터가 기존 브라우저 저장값에 덮이지 않도록 초기 표시용 저장값만 제거
try {
  localStorage.removeItem("qcChecklistRows");
  localStorage.removeItem("checklistRows");
  localStorage.removeItem("workQcChecklistRows");
} catch (e) {}


const checklistStatuses = ["진행전", "진행중", "확인완료", "PM 검토", "수정요청", "최종완료"];
const checklistOwners = ["QC TEAM", "PM", "산출 담당자", "실장", "경영지원"];

function switchTopModule(moduleName) {
  document.querySelectorAll(".module-view").forEach(view => view.classList.remove("active"));
  document.querySelectorAll("[data-module-tab]").forEach(tab => tab.classList.remove("active"));

  const support = document.getElementById("supportModule");
  const work = document.getElementById("workModule");
  const mail = document.getElementById("mailModule");

  if (moduleName === "mail") {
    mail?.classList.add("active");
    document.querySelector('[data-module-tab="mail"]')?.classList.add("active");
    renderMailInbox(currentMailFilter || "전체");
    return;
  }

  if (moduleName === "work") {
    work?.classList.add("active");
    document.querySelector('[data-module-tab="work"]')?.classList.add("active");

    const activePanel = document.querySelector("#workModule .work-panel.active");
    const activeSideItem = document.querySelector(".side-sub.active .side-item.active[data-work-main]");
    switchWorkPanel(activePanel?.id || activeSideItem?.dataset.workMain || "estimateDbManage");
  } else {
    support?.classList.add("active");
    document.querySelector('[data-module-tab="support"]')?.classList.add("active");
  }
}

let currentMailFilter = "전체";
let currentMailBox = "inbox";
let reviewNotificationRead = false;

function getChecklistReviewRequestRows() {
  const projectInput = document.getElementById("checklistProject");
  const fallbackProject = projectInput?.value || "ㅇㅇ시설 신축공사";
  return checklistRows
    .map((row, realIndex) => ({ row: normalizeChecklistRow(row), realIndex }))
    .filter(({ row }) => normalizeChecklistGroupName(row.group) === "제출자료 검토사항(PM→작업자)")
    .map(({ row, realIndex }) => {
      const itemText = String(row.item || "검토항목").replace(/\s+/g, " ").trim();
      return {
        id: `review-${realIndex}`,
        type: "검토요청",
        project: row.project || fallbackProject,
        sender: row.creator || "PM",
        title: `${row.project || fallbackProject} 검토요청_${itemText}`,
        item: row.item || "-",
        method: row.method || "-",
        trade: row.trade || "-",
        no: row.no || "-",
        targets: getChecklistTargets(row).join(", ") || "산출 담당자",
        createdAt: row.createdAt || "2026-04-29 09:00",
        comment: row.comment || "",
        rowIndex: realIndex
      };
    });
}

function getMailItems() {
  const reviewRequests = getChecklistReviewRequestRows();
  const projectName = document.getElementById("checklistProject")?.value || "ㅇㅇ시설 신축공사";
  const staticMails = [
    {
      id: "mail-checklist-001",
      type: "체크리스트",
      sender: "QC TEAM",
      title: `${projectName} 체크리스트 확인 요청`,
      createdAt: "2026-04-29 09:00",
      item: "프로젝트 초기 체크리스트",
      method: "체크리스트 구분별 확인 필요",
      comment: ""
    },
    {
      id: "mail-question-001",
      type: "질의사항",
      sender: "PM",
      title: `${projectName} 질의사항(1차) 확인 요청`,
      createdAt: "2026-04-30 13:00",
      item: "동구분 관련 질의사항",
      method: "발주처 회신 후 반영 예정",
      comment: ""
    },
    {
      id: "mail-delivery-001",
      type: "납품메일",
      sender: "PM",
      title: `${projectName} 납품자료 송부 확인`,
      createdAt: "2026-04-30 15:30",
      item: "납품자료 체크",
      method: "송부 전 최종 확인",
      comment: ""
    }
  ];
  return [...reviewRequests, ...staticMails];
}

function setMailBox(boxName) {
  currentMailBox = boxName || "inbox";
  document.querySelectorAll("[data-mail-box]").forEach(btn => btn.classList.toggle("active", btn.dataset.mailBox === currentMailBox));
  renderMailInbox(currentMailFilter || "전체");
}

function clearMailFilters() {
  const search = document.getElementById("mailSearchInput");
  const project = document.getElementById("mailProjectFilter");
  const tag = document.getElementById("mailTagFilter");
  if (search) search.value = "";
  if (project) project.value = "전체";
  if (tag) tag.value = "전체";
  renderMailInbox("전체");
}

function getFilteredMailItems(filter = "전체") {
  const searchValue = (document.getElementById("mailSearchInput")?.value || "").trim().toLowerCase();
  const projectValue = document.getElementById("mailProjectFilter")?.value || "전체";
  const tagValue = document.getElementById("mailTagFilter")?.value || "전체";

  let items = getMailItems();
  if (currentMailBox && currentMailBox !== "inbox") items = [];
  if (filter !== "전체") items = items.filter(mail => mail.type === filter);
  if (tagValue !== "전체") items = items.filter(mail => mail.type === tagValue);
  if (projectValue !== "전체") items = items.filter(mail => (mail.project || "").includes(projectValue));
  if (searchValue) {
    items = items.filter(mail => [mail.sender, mail.title, mail.item, mail.method, mail.project, mail.type]
      .join(" ").toLowerCase().includes(searchValue));
  }
  return items;
}

function renderMailInbox(filter = "전체") {
  currentMailFilter = filter;
  document.querySelectorAll(".mail-filter").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mailFilter === filter);
  });

  const list = document.getElementById("mailInboxList");
  const badge = document.getElementById("mailCountBadge");
  const sideCount = document.getElementById("mailInboxSideCount");
  if (!list) return;

  const inboxTotal = getMailItems().length;
  if (sideCount) sideCount.textContent = inboxTotal;

  const items = getFilteredMailItems(filter);
  if (badge) badge.textContent = `이메일 1~${items.length}개 표시 / 총 ${items.length}개`;

  if (!items.length) {
    list.innerHTML = `<tr><td colspan="5"><div class="empty-mail-box">표시할 메일이 없습니다.</div></td></tr>`;
    return;
  }

  list.innerHTML = items.map(mail => `
    <tr class="mail-row ${mail.type === "검토요청" ? "review-mail" : ""}" onclick="openMailDetail('${escapeJs(mail.id)}')">
      <td class="mail-star-col">☆</td>
      <td><strong>${escapeHtml(mail.sender)}</strong></td>
      <td><span class="mail-type-chip ${mail.type === "검토요청" ? "review" : ""}">${escapeHtml(mail.type)}</span></td>
      <td>
        <div class="mail-subject-line">
          <strong>${escapeHtml(mail.title)}</strong>
          <span>${escapeHtml(mail.method || mail.item || "")}</span>
        </div>
      </td>
      <td class="mail-time-cell">${escapeHtml(formatMailTime(mail.createdAt))}</td>
    </tr>
  `).join("");
}

function formatMailTime(value) {
  const text = String(value || "");
  if (!text) return "-";
  const datePart = text.split(" ")[0];
  return datePart.replace(/^2026-/, "").replace(/-/g, "/");
}

function openMailDetail(mailId) {
  const mail = getMailItems().find(item => item.id === mailId);
  if (!mail) return;
  if (mail.type === "검토요청") {
    openReviewNotificationPanel(mail.rowIndex);
    return;
  }
  showToast(`${mail.title} 메일을 열었습니다.`);
}

function openReviewNotificationPanel(focusRowIndex = null) {
  const panel = document.getElementById("reviewNotificationPanel");
  const list = document.getElementById("reviewNotificationList");
  if (!panel || !list) return;

  let requests = getChecklistReviewRequestRows();
  if (focusRowIndex !== null && focusRowIndex !== undefined) {
    const focused = requests.find(item => String(item.rowIndex) === String(focusRowIndex));
    if (focused) requests = [focused, ...requests.filter(item => item.rowIndex !== focused.rowIndex)];
  }

  list.innerHTML = requests.length ? requests.slice(0, 6).map(req => `
    <article class="review-popover-item" onclick="switchTopModule('mail'); renderMailInbox('검토요청'); closeReviewNotificationPanel();">
      <div class="review-popover-title">
        <strong>${escapeHtml(req.title)}</strong>
        <span>검토요청</span>
      </div>
      <p>${escapeHtml(req.method || req.item || "")}</p>
      <small>${escapeHtml(req.createdAt)} · 발신자 ${escapeHtml(req.sender)}</small>
    </article>
  `).join("") : `<div class="empty-mail-box">도착한 검토 요청이 없습니다.</div>`;

  panel.classList.toggle("active");
}

function closeReviewNotificationPanel() {
  document.getElementById("reviewNotificationPanel")?.classList.remove("active");
}

function markReviewNotificationsRead() {
  reviewNotificationRead = true;
  closeReviewNotificationPanel();
  updateBellReviewCount();
}

function updateBellReviewCount() {
  const bell = document.querySelector(".bell");
  if (!bell) return;
  const count = reviewNotificationRead ? 0 : getChecklistReviewRequestRows().length;
  bell.setAttribute("data-count", String(count));
  bell.classList.toggle("has-count", count > 0);
  bell.title = `검토 요청 알림 ${count}건`;
}


function syncWorkSideAccordion(targetPanelId) {
  const target = String(targetPanelId || "estimateDbManage");
  const estimatePanels = ["estimateRequestManage", "estimateSheetManage", "estimatePeriodManage", "estimateDbManage", "estimateQuote", "estimateQuoteList"];
  const projectReceivePanels = ["projectReceive", "projectReceiveList"];
  const pmSchedulePanels = ["pmSchedule"];
  const isEstimateQuote = estimatePanels.includes(target);
  const isProjectReceive = projectReceivePanels.includes(target);
  const isPmSchedule = pmSchedulePanels.includes(target);

  // 모든 대분류/중분류 상태를 먼저 완전히 초기화합니다.
  // 기존에는 다른 버튼 클릭 후에도 .project-receive-sub-menu의 active 상태가 남아
  // "프로젝트 작성 / 프로젝트 리스트"가 계속 펼쳐지는 문제가 발생할 수 있었습니다.
  document.querySelectorAll(".side-sub, .estimate-quote-sub-menu, .project-receive-sub-menu, .pm-schedule-sub-menu").forEach(menu => {
    menu.classList.remove("active");
  });
  document.querySelectorAll(".side-main, .side-item, [data-work-main]").forEach(btn => {
    btn.classList.remove("active", "work-side-selected");
    btn.removeAttribute("data-work-selected");
  });

  if (isEstimateQuote) {
    document.querySelectorAll(".estimate-quote-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".estimate-quote-side-group > .side-main[data-work-main]").forEach(btn => btn.classList.add("active"));
  } else if (isProjectReceive) {
    document.querySelectorAll(".project-receive-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".side-main[data-work-main='projectReceive']").forEach(btn => btn.classList.add("active"));
  } else if (isPmSchedule) {
    document.querySelectorAll(".pm-schedule-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".side-main[data-work-main='pmSchedule']").forEach(btn => btn.classList.add("active"));
  } else {
    document.querySelector(`.side-main[data-work-main="${target}"]`)?.classList.add("active");
  }
}

function activateWorkSideSelection(targetPanelId) {
  const target = String(targetPanelId || "estimateRequestManage");
  const estimatePanels = ["estimateRequestManage", "estimateSheetManage", "estimatePeriodManage", "estimateDbManage", "estimateQuote", "estimateQuoteList"];
  const projectReceivePanels = ["projectReceive", "projectReceiveList"];
  const markSelected = (el) => {
    if (!el) return;
    el.classList.add("active", "work-side-selected");
    el.setAttribute("data-work-selected", "true");
  };

  document.querySelectorAll(".work-side-selected, [data-work-selected='true']").forEach(el => {
    el.classList.remove("work-side-selected");
    el.removeAttribute("data-work-selected");
  });

  if (estimatePanels.includes(target)) {
    document.querySelectorAll(".estimate-quote-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".estimate-quote-side-group > .side-main[data-work-main]").forEach(markSelected);
    markSelected(document.querySelector(`.estimate-quote-sub-menu .side-item[data-work-main="${target}"]`));
    return;
  }

  if (projectReceivePanels.includes(target)) {
    document.querySelectorAll(".project-receive-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".project-receive-side-group > .side-main[data-work-main]").forEach(markSelected);
    markSelected(document.querySelector(`.project-receive-sub-menu .side-item[data-work-main="${target}"]`));
    return;
  }

  if (target === "pmSchedule") {
    const activeSection = typeof pmScheduleActiveSection !== "undefined" ? pmScheduleActiveSection : "assign";
    document.querySelectorAll(".pm-schedule-sub-menu").forEach(menu => menu.classList.add("active"));
    document.querySelectorAll(".pm-schedule-side-group > .side-main[data-work-main]").forEach(markSelected);
    markSelected(document.querySelector(`.pm-schedule-sub-menu .side-item[data-work-main="pmSchedule"][data-pm-section="${activeSection}"]`));
    return;
  }

  markSelected(document.querySelector(`.side-main[data-work-main="${target}"]`));
}

function switchWorkPanel(panelId) {
  const targetPanelId = panelId || "estimateDbManage";

  document.querySelectorAll(".work-panel").forEach(panel => panel.classList.remove("active"));
  document.querySelectorAll("[data-work-main]").forEach(btn => {
    btn.classList.remove("active", "work-side-selected");
    btn.removeAttribute("data-work-selected");
  });
  document.querySelectorAll(".side-sub").forEach(menu => menu.classList.remove("active"));

  document.getElementById(targetPanelId)?.classList.add("active");
  syncWorkSideAccordion(targetPanelId);

  if (typeof activateWorkSideSelection === "function") {
    activateWorkSideSelection(targetPanelId);
  }

  const meta = workPageMeta[targetPanelId] || workPageMeta.estimateDbManage || workPageMeta.projectReceive;
  setText("workPageTitle", meta[0]);
  setText("workPageDesc", meta[1]);

  if (targetPanelId === "estimateRequestManage" && typeof renderEstimateRequestManage === "function") {
    renderEstimateRequestManage();
  }

  if (targetPanelId === "estimateSheetManage" && typeof renderEstimateSheetManage === "function") {
    renderEstimateSheetManage();
  }

  if (targetPanelId === "estimatePeriodManage" && typeof renderEstimatePeriodManage === "function") {
    renderEstimatePeriodManage();
  }

  if (targetPanelId === "estimateDbManage" && typeof renderEstimateDbManage === "function") {
    renderEstimateDbManage();
  }

  if (targetPanelId === "estimateQuote" && typeof renderEstimateQuoteDashboard === "function") {
    renderEstimateQuoteDashboard();
  }

  if (targetPanelId === "estimateQuoteList" && typeof renderEstimateQuoteList === "function") {
    renderEstimateQuoteList();
  }

  if (targetPanelId === "projectReceive" && typeof renderProjectReceiveDashboard === "function") {
    renderProjectReceiveDashboard();
  }

  if (targetPanelId === "projectReceiveList" && typeof renderProjectReceiveListView === "function") {
    renderProjectReceiveListView();
  }

  if (targetPanelId === "projectManage" && typeof initProjectManage === "function") {
    initProjectManage();
  }

  if (targetPanelId === "pmSchedule" && typeof renderPmScheduleDashboard === "function") {
    renderPmScheduleDashboard();
    if (typeof setPmScheduleSection === "function") setPmScheduleSection(typeof pmScheduleActiveSection !== "undefined" ? pmScheduleActiveSection : "assign");
  }

  if (targetPanelId === "qcReview" || targetPanelId === "quantityChecklist") {
    renderChecklistCategoryButtons();
    renderChecklistGrid();
  }

  if (targetPanelId === "deliveryData" && typeof renderDeliveryData === "function") {
    renderDeliveryData();
  }

  if (targetPanelId === "dailyReport" && typeof renderDailyReport === "function") {
    renderDailyReport();
  }
}


function getChecklistCreatorByGroup(group) {
  const normalized = normalizeChecklistGroupName(group);
  const creatorMap = {
    "프로젝트 초기": "QC TEAM",
    "QC팀 전달사항": "QC TEAM",
    "PM 전달사항": "PM",
    "제출자료 검토사항": "PM",
    "최종자료 검토사항": "QC TEAM"
  };
  return creatorMap[normalized] || "경영지원";
}

function getChecklistRouteLabel(row) {
  if (!row) return "";
  const group = normalizeChecklistGroupName(row.group);
  const middle = row.middleCategory || getChecklistMiddleOptions(group)[0] || "";
  const sub = row.subCategory || "";
  if (sub) return `${middle} · ${sub}`;
  return middle || "PM";
}

function getChecklistTargetsByGroup(group, row = null) {
  const normalized = normalizeChecklistGroupName(group);
  if (row) return [getChecklistRouteLabel(row)].filter(Boolean);
  const mids = getChecklistMiddleOptions(normalized);
  return mids.length ? [mids[0]] : ["PM"];
}

function getChecklistTargetPool(row = null) {
  const group = normalizeChecklistGroupName(row?.group || document.getElementById("checklistModalGroup")?.value || selectedChecklistCategoryFilter || firstCategoryName);
  const mids = getChecklistMiddleOptions(group);
  if (!mids.length) return ["PM", "QC TEAM", "경영지원"];

  const pool = [];
  mids.forEach(mid => {
    const subs = getChecklistSubOptions(group, mid);
    if (subs.length) subs.forEach(sub => pool.push(`${mid} · ${sub}`));
    else pool.push(mid);
  });
  return pool.length ? pool : ["PM"];
}

function isObjectionAllowedRow(row) {
  return ["제출자료 검토사항", "최종자료 검토사항"].includes(normalizeChecklistGroupName(row?.group));
}

function ensureChecklistAttachments(row) {
  if (!Array.isArray(row.attachments)) row.attachments = [];
  if (!Array.isArray(row.objectionFiles)) row.objectionFiles = [];
}

function renderChecklistAttachmentCell(row, realIndex) {
  ensureChecklistAttachments(row);
  const locked = isChecklistCategoryLocked(row.group);
  const attachments = Array.isArray(row.attachments) ? row.attachments : [];
  const inputId = `checklistInlineFile_${realIndex}`;
  const addButton = `
    <input id="${inputId}" class="inline-attach-input" type="file" accept="image/*" multiple onchange="addChecklistAttachments(${realIndex}, this.files); this.value='';" ${locked ? "disabled" : ""}>
    <button type="button" class="attach-inline-add" ${locked ? "disabled" : ""} onclick="event.stopPropagation(); document.getElementById('${inputId}')?.click();">+ 첨부</button>
  `;

  if (!attachments.length) {
    return `<div class="attachment-cell readonly-attachment-cell inline-attachment-cell"><div class="attach-count">첨부 없음</div>${addButton}</div>`;
  }

  const thumbs = attachments.map((file, idx) => {
    const src = getAttachmentImageSource(file);
    const name = file.name || `첨부 이미지 ${idx + 1}`;
    return `
      <button class="attach-thumb" type="button" onclick="openChecklistAttachmentImage(${realIndex}, ${idx})" title="${escapeHtml(name)}">
        <img src="${escapeHtml(src)}" alt="${escapeHtml(name)}">
      </button>
    `;
  }).join("");

  return `
    <div class="attachment-cell readonly-attachment-cell inline-attachment-cell">
      <button type="button" class="attach-count-btn" onclick="openChecklistAttachmentGallery(${realIndex})">${attachments.length}개 첨부</button>
      <div class="attach-thumb-list">${thumbs}</div>
      ${addButton}
    </div>
  `;
}

function addChecklistAttachments(index, files) {
  const row = checklistRows[index];
  if (!row || !files || !files.length) return;
  normalizeChecklistRow(row);
  ensureChecklistAttachments(row);
  const fileList = Array.from(files).filter(file => file.type.startsWith("image/"));
  if (!fileList.length) {
    showToast("이미지 파일만 첨부할 수 있습니다.");
    return;
  }
  let loaded = 0;
  fileList.forEach(file => {
    const reader = new FileReader();
    reader.onload = event => {
      row.attachments.push({ name: file.name, dataUrl: event.target.result, addedAt: getChecklistTimeText(), addedBy: getCurrentWorkerName() });
      loaded += 1;
      if (loaded === fileList.length) {
        row.history.push({ action: "사진첨부", worker: getCurrentWorkerName(), time: getChecklistTimeText() });
        renderChecklistGrid();
        showToast(`${fileList.length}개 사진을 첨부했습니다.`);
      }
    };
    reader.readAsDataURL(file);
  });
}

function openImagePreview(src, title = "첨부 이미지") {
  openAttachmentImageWindow(src || makeAttachmentFallbackImage(title), title);
}

let pendingObjectionFiles = [];

function openObjectionModal(index) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  if (!isObjectionAllowedRow(row)) return;
  document.getElementById("objectionRowIndex").value = String(index);
  document.getElementById("objectionText").value = row.objection?.text || "";
  document.getElementById("objectionPreview").innerHTML = (row.objectionFiles || []).map(file => `<div class="attach-preview"><img src="${file.dataUrl}" alt="${escapeHtml(file.name)}"><span>${escapeHtml(file.name)}</span></div>`).join("");
  pendingObjectionFiles = [];
  document.getElementById("objectionModal")?.classList.add("active");
}

function closeObjectionModal() {
  document.getElementById("objectionModal")?.classList.remove("active");
  const files = document.getElementById("objectionFiles");
  if (files) files.value = "";
  pendingObjectionFiles = [];
}

function previewObjectionFiles(input) {
  pendingObjectionFiles = [];
  const preview = document.getElementById("objectionPreview");
  if (preview) preview.innerHTML = "";
  const files = Array.from(input.files || []).filter(file => file.type.startsWith("image/"));
  if (!files.length) return;
  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = event => {
      pendingObjectionFiles.push({ name: file.name, dataUrl: event.target.result, addedAt: getChecklistTimeText(), addedBy: getCurrentWorkerName() });
      if (preview) {
        preview.insertAdjacentHTML("beforeend", `<div class="attach-preview"><img src="${event.target.result}" alt="${escapeHtml(file.name)}"><span>${escapeHtml(file.name)}</span></div>`);
      }
      loaded += 1;
    };
    reader.readAsDataURL(file);
  });
}

function saveObjectionModal() {
  const index = Number(document.getElementById("objectionRowIndex")?.value);
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  const text = document.getElementById("objectionText")?.value.trim() || "";
  row.objection = {
    text,
    by: getCurrentWorkerName(),
    at: getChecklistTimeText(),
    accepted: false
  };
  row.objectionFiles = [...(row.objectionFiles || []), ...pendingObjectionFiles];
  row.history.push({ action: "이의제기", worker: row.objection.by, time: row.objection.at });
  closeObjectionModal();
  renderChecklistGrid();
  showToast("이의제기가 저장되었습니다.");
}

function toggleObjectionDetail(index) {
  const row = checklistRows[index];
  if (!row) return;
  row.showObjection = !row.showObjection;
  renderChecklistGrid();
}

function acceptObjectionAndEliminate(index) {
  const row = checklistRows[index];
  if (!row || !row.objection) return;
  normalizeChecklistRow(row);
  row.objection.accepted = true;
  row.eliminated = true;
  row.history.push({ action: "이의제기 인정·소거", worker: getCurrentWorkerName(), time: getChecklistTimeText() });
  renderChecklistGrid();
  showToast("이의제기 인정으로 해당 검토사항을 소거 처리했습니다.");
}

function renderObjectionArea(row, realIndex) {
  if (!isObjectionAllowedRow(row)) return "";
  const hasObjection = !!row.objection;
  const detail = hasObjection && row.showObjection ? `
    <div class="objection-detail-box">
      <strong>이의제기 내용</strong>
      <p>${escapeHtml(row.objection.text || "내용 없음")}</p>
      <small>${escapeHtml(row.objection.by)} · ${escapeHtml(row.objection.at)}</small>
      <div class="attach-thumb-list objection-thumbs">
        ${(row.objectionFiles || []).map(file => `<button class="attach-thumb" type="button" onclick="openImagePreview('${escapeJs(file.dataUrl)}')"><img src="${file.dataUrl}" alt="${escapeHtml(file.name)}"></button>`).join("")}
      </div>
      <button class="btn btn-line" onclick="acceptObjectionAndEliminate(${realIndex})">이의 인정 · 소거</button>
    </div>
  ` : "";
  return `
    <div class="objection-area">
      <button class="btn-objection" onclick="openObjectionModal(${realIndex})">이의제기</button>
      ${hasObjection ? `<button class="btn btn-line btn-mini" onclick="toggleObjectionDetail(${realIndex})">${row.showObjection ? "접기" : "내용보기"}</button>` : ""}
      ${detail}
    </div>
  `;
}


function normalizeSpecialChecklistCreator(row) {
  const group = normalizeChecklistGroupName(row.group);
  const no = String(row.no || "");

  if (group === "Z1. 질의사항(1차)" && no === "026") {
    row.creator = "PM";
    row.createdBy = "PM";
  }

  if (group === "Z1. 질의사항(1차)" && no === "027") {
    row.creator = "산출 담당자";
    row.createdBy = "산출 담당자";
  }

  if (group === "Z7. 견적조건(최종)" && no === "028") {
    row.creator = "산출 담당자";
    row.createdBy = "산출 담당자";
  }

  if (Array.isArray(row.history)) {
    row.history = row.history.map(history => {
      if (history && history.action === "최초작성") {
        return { ...history, worker: row.creator || row.createdBy || history.worker };
      }
      return history;
    });
  }

  return row;
}


function normalizeChecklistRow(row) {
  if (!row) return row;
  row.group = normalizeChecklistGroupName(row.group);
  normalizeChecklistClassification(row);
  row.no = normalizeChecklistNo(row.no);
  row.project = row.project || "ㅇㅇ시설 신축공사";
  normalizeSpecialChecklistCreator(row);
  row.creator = getChecklistCreatorByGroup(row.group);
  if (!row.createdAt) row.createdAt = "2026-04-29 09:00";
  ensureChecklistAttachments(row);
  row.history = Array.isArray(row.history) ? row.history : [];
  row.history = row.history.filter(h => h.action !== "최초작성");
  row.history.push({ action: "최초작성", worker: row.creator, time: row.createdAt });

  const groupTargets = getChecklistTargetsByGroup(row.group, row);
  if (row.manualTargets) {
    row.targets = Array.isArray(row.targets) && row.targets.length ? row.targets : [];
  } else if (groupTargets) {
    row.targets = [...groupTargets];
  } else if (!Array.isArray(row.targets) || !row.targets.length) {
    row.targets = String(row.owner || getChecklistRouteLabel(row) || "PM").split(/[,/]/).map(v => v.trim()).filter(Boolean);
  }
  row.targets = Array.from(new Set((row.targets || []).map(target => String(target || "").trim()).filter(Boolean)));
  if (!row.targets.length) row.targets = [getChecklistRouteLabel(row) || "PM"];

  if (!Array.isArray(row.checks)) row.checks = [];
  const requiredCheckTargets = Array.from(new Set(row.targets.map(getChecklistCheckTargetForAssignee)));
  requiredCheckTargets.forEach(target => {
    if (!row.checks.some(c => c.target === target)) row.checks.push({ target, done: false, na: false, checkedBy: "", checkedAt: "" });
  });
  row.checks = row.checks.filter(c => requiredCheckTargets.includes(c.target)).map(c => ({ ...c, na: Boolean(c.na) }));
  row.owner = row.targets.join(", ");
  row.done = isChecklistRowDone(row);
  row.status = row.done ? "확인완료" : getChecklistDoneState(row);
  return normalizeSpecialChecklistCreator(row);}

function getChecklistDoneState(row) {
  const checks = Array.isArray(row?.checks) ? row.checks : [];
  if (!checks.length || checks.every(c => !c.done && !c.na)) return "미확인";
  if (checks.every(c => c.done || c.na)) return "확인완료";
  return "부분완료";
}

function isChecklistRowDone(row) {
  const checks = Array.isArray(row?.checks) ? row.checks : [];
  return checks.length > 0 && checks.every(c => c.done || c.na);
}

function getChecklistTargets(row) {
  normalizeChecklistRow(row);
  return Array.isArray(row.targets) ? row.targets : [];
}


function getChecklistCategoryLabel(category) {
  if (category === "전체") return "전체보기";
  return category;
}

function setChecklistCategoryFilter(category) {
  selectedChecklistCategoryFilter = category || "전체";
  // 구분 필터는 사용자가 '구분 선택 닫기'를 누르기 전까지 접히지 않도록 유지합니다.
  checklistCategoryPanelOpen = true;
  renderChecklistGrid();
}

function toggleChecklistCategoryPanel() {
  checklistCategoryPanelOpen = !checklistCategoryPanelOpen;
  renderChecklistCategoryButtons();
}

function getVisibleChecklistGroups() {
  const groups = [];
  getChecklistFilteredRows().forEach(({ row }) => {
    const group = normalizeChecklistGroupName(row.group);
    if (!groups.includes(group)) groups.push(group);
  });
  return groups;
}

function areAllVisibleChecklistGroupsCollapsed() {
  const groups = getVisibleChecklistGroups();
  return groups.length > 0 && groups.every(group => collapsedChecklistGroups.has(group));
}

function toggleChecklistDetailVisibility() {
  if (areAllVisibleChecklistGroupsCollapsed()) {
    expandAllChecklistGroups();
  } else {
    collapseAllChecklistGroups();
  }
}

function toggleChecklistGroupCollapse(group) {
  const normalized = normalizeChecklistGroupName(group);
  if (collapsedChecklistGroups.has(normalized)) {
    collapsedChecklistGroups.delete(normalized);
  } else {
    collapsedChecklistGroups.add(normalized);
  }
  renderChecklistGrid();
}

function getChecklistMiddleCollapseKey(group, middle) {
  return `${normalizeChecklistGroupName(group)}::${middle || "기타"}`;
}

function toggleChecklistMiddleCollapse(group, middle) {
  const key = getChecklistMiddleCollapseKey(group, middle);
  if (collapsedChecklistMiddles.has(key)) {
    collapsedChecklistMiddles.delete(key);
  } else {
    collapsedChecklistMiddles.add(key);
  }
  renderChecklistGrid();
}

function expandAllChecklistGroups() {
  collapsedChecklistGroups.clear();
  collapsedChecklistMiddles.clear();
  renderChecklistGrid();
}

function collapseAllChecklistGroups() {
  getChecklistFilteredRows().forEach(({ row }) => collapsedChecklistGroups.add(normalizeChecklistGroupName(row.group)));
  renderChecklistGrid();
}

function collapseChecklistVisibleGroupsOnly() {
  getChecklistFilteredRows().forEach(({ row }) => {
    collapsedChecklistGroups.add(normalizeChecklistGroupName(row.group));
  });
}

function applyChecklistDefaultCollapsedView() {
  checklistCategoryPanelOpen = true;
  collapseChecklistVisibleGroupsOnly();
}


let checklistRenderFrame = 0;
let checklistRenderTimer = 0;
let checklistRenderMetaCache = { categoryCounts: {}, middleCounts: {}, subCounts: {} };
const CHECKLIST_DETAIL_RENDER_STEP = 80;
let checklistDetailRenderLimit = CHECKLIST_DETAIL_RENDER_STEP;
let checklistLastRenderSignature = "";

function resetChecklistDetailRenderLimit() {
  checklistDetailRenderLimit = CHECKLIST_DETAIL_RENDER_STEP;
}


function getChecklistMiddleFilterKey(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.includes("구조")) return "구조";
  if (text.includes("마감")) return "마감";
  if (text.includes("토목")) return "토목";
  return "";
}

function isChecklistMiddleFilterEnabled(value) {
  const key = getChecklistMiddleFilterKey(value);
  return !key || selectedChecklistMiddleFilters.has(key);
}

function getChecklistMiddleFilterCounts() {
  const counts = Object.fromEntries(checklistMiddleFilterOptions.map(option => [option, 0]));
  checklistRows.forEach(row => {
    normalizeChecklistRow(row);
    const key = getChecklistMiddleFilterKey(row.middleCategory);
    if (key && Object.prototype.hasOwnProperty.call(counts, key)) counts[key] += 1;
  });
  return counts;
}

function toggleChecklistMiddleFilter(option, checked) {
  if (!checklistMiddleFilterOptions.includes(option)) return;
  if (checked) selectedChecklistMiddleFilters.add(option);
  else selectedChecklistMiddleFilters.delete(option);
  scheduleChecklistGridRender(0);
}

function setAllChecklistMiddleFilters(checked) {
  selectedChecklistMiddleFilters.clear();
  if (checked) checklistMiddleFilterOptions.forEach(option => selectedChecklistMiddleFilters.add(option));
  scheduleChecklistGridRender(0);
}

function renderChecklistMiddleFilterBar() {
  const counts = getChecklistMiddleFilterCounts();
  const allChecked = checklistMiddleFilterOptions.every(option => selectedChecklistMiddleFilters.has(option));
  const items = checklistMiddleFilterOptions.map(option => {
    const checked = selectedChecklistMiddleFilters.has(option) ? "checked" : "";
    return `<label class="checklist-middle-filter-chip ${checked ? "active" : ""}">
      <input type="checkbox" ${checked} onchange="toggleChecklistMiddleFilter('${escapeJs(option)}', this.checked)">
      <span>${escapeHtml(option)}</span>
      <em>${counts[option] || 0}</em>
    </label>`;
  }).join("");
  return `<div class="checklist-middle-filter-bar" aria-label="중분류 필터">
    <span class="checklist-middle-filter-title">중분류 필터</span>
    ${items}
    <button type="button" class="checklist-middle-filter-reset" onclick="setAllChecklistMiddleFilters(${allChecked ? 'false' : 'true'})">${allChecked ? '전체 해제' : '전체 선택'}</button>
  </div>`;
}

function getChecklistRenderSignature() {
  const project = (document.getElementById("checklistProject")?.value || "").trim();
  const owner = document.getElementById("checklistOwnerFilter")?.value || "전체";
  const doneFilter = document.getElementById("checklistDoneFilter")?.value || "전체";
  const search = (document.getElementById("checklistSearch")?.value || "").trim().toLowerCase();
  return [project, owner, doneFilter, search, selectedChecklistCategoryFilter || "전체", Array.from(selectedChecklistMiddleFilters).sort().join(",")].join("||");
}

function loadMoreChecklistRows() {
  checklistDetailRenderLimit += CHECKLIST_DETAIL_RENDER_STEP;
  scheduleChecklistGridRender(0);
}

function scheduleChecklistGridRender(delay = 120) {
  window.clearTimeout(checklistRenderTimer);
  checklistRenderTimer = window.setTimeout(() => {
    if (checklistRenderFrame) window.cancelAnimationFrame(checklistRenderFrame);
    checklistRenderFrame = window.requestAnimationFrame(() => {
      checklistRenderFrame = 0;
      renderChecklistGrid();
    });
  }, delay);
}

function buildChecklistRenderMetaCache() {
  const categoryCounts = Object.create(null);
  const middleCounts = Object.create(null);
  const subCounts = Object.create(null);

  checklistRows.forEach(row => {
    normalizeChecklistRow(row);
    const group = normalizeChecklistGroupName(row.group);
    const middle = row.middleCategory || "기타";
    const sub = row.subCategory || "";
    categoryCounts[group] = (categoryCounts[group] || 0) + 1;
    middleCounts[`${group}::${middle}`] = (middleCounts[`${group}::${middle}`] || 0) + 1;
    if (sub) subCounts[`${group}::${middle}::${sub}`] = (subCounts[`${group}::${middle}::${sub}`] || 0) + 1;
  });

  checklistRenderMetaCache = { categoryCounts, middleCounts, subCounts };
}

function getChecklistCategoryCount(group) {
  return checklistRenderMetaCache.categoryCounts[normalizeChecklistGroupName(group)] || 0;
}

function getChecklistMiddleCount(group, middle) {
  return checklistRenderMetaCache.middleCounts[`${normalizeChecklistGroupName(group)}::${middle || "기타"}`] || 0;
}

function getChecklistSubCount(group, middle, sub) {
  return checklistRenderMetaCache.subCounts[`${normalizeChecklistGroupName(group)}::${middle || "기타"}::${sub || ""}`] || 0;
}

function renderChecklistCategoryButtons() {
  const wrap = document.getElementById("checklistCategoryFilter");
  if (!wrap) return;

  buildChecklistRenderMetaCache();
  const categoryCounts = checklistRenderMetaCache.categoryCounts;

  const visibleCategories = checklistCategoryOptions.filter(category => getChecklistCategoryCount(category) > 0);
  const categories = ["전체", ...visibleCategories];

  if (selectedChecklistCategoryFilter !== "전체" && !visibleCategories.includes(selectedChecklistCategoryFilter)) {
    selectedChecklistCategoryFilter = "전체";
  }

  const activeLabel = getChecklistCategoryLabel(selectedChecklistCategoryFilter);
  const activeCount = selectedChecklistCategoryFilter === "전체" ? checklistRows.length : getChecklistCategoryCount(selectedChecklistCategoryFilter);
  const optionButtons = categories.map(category => {
    const active = selectedChecklistCategoryFilter === category ? "active" : "";
    const count = category === "전체" ? checklistRows.length : getChecklistCategoryCount(category);
    return `<button type="button" class="category-filter-btn ${active}" onclick="setChecklistCategoryFilter('${escapeJs(category)}')"><span class="category-name">${escapeHtml(getChecklistCategoryLabel(category))}</span><span class="category-count">${count}</span></button>`;
  }).join("");

  const allVisibleCollapsed = areAllVisibleChecklistGroupsCollapsed();
  const detailButtonLabel = allVisibleCollapsed ? "펼치기" : "접기";
  const detailButtonTitle = allVisibleCollapsed ? "현재 조회된 구분의 세부 항목을 모두 펼칩니다." : "현재 조회된 구분의 세부 항목을 모두 숨기고 구분명만 표시합니다.";

  wrap.innerHTML = `
    <div class="checklist-filter-shell ${checklistCategoryPanelOpen ? "open" : ""}">
      <div class="checklist-filter-summary" title="구분 필터는 구분 선택 닫기 버튼으로만 접을 수 있습니다.">
        <div class="filter-summary-main">
          <span class="filter-summary-label">구분 필터</span>
          <strong>${escapeHtml(activeLabel)}</strong>
          <em>${activeCount}건</em>
        </div>
        <div class="filter-summary-actions">
          <button type="button" class="category-filter-reset ${selectedChecklistCategoryFilter === "전체" ? "disabled" : ""}" onclick="event.stopPropagation(); setChecklistCategoryFilter('전체')">전체보기</button>
          <button type="button" class="category-filter-toggle ${checklistCategoryPanelOpen ? "active" : ""}" onclick="event.stopPropagation(); toggleChecklistCategoryPanel()">구분 선택 <span>${checklistCategoryPanelOpen ? "닫기" : "열기"}</span></button>
          <button type="button" class="category-detail-toggle ${allVisibleCollapsed ? "expand" : "collapse"}" title="${detailButtonTitle}" onclick="event.stopPropagation(); toggleChecklistDetailVisibility()">${detailButtonLabel}</button>
        </div>
      </div>
      ${renderChecklistMiddleFilterBar()}
      <div class="category-filter-panel ${checklistCategoryPanelOpen ? "open" : ""}">
        <div class="category-filter-grid">${optionButtons}</div>
      </div>
    </div>`;
}
function getChecklistFilteredRows() {
  renumberAllChecklistRowsByClassification();
  checklistRows.forEach(normalizeChecklistRow);

  const project = (document.getElementById("checklistProject")?.value || "").trim();
  const owner = document.getElementById("checklistOwnerFilter")?.value || "전체";
  const doneFilter = document.getElementById("checklistDoneFilter")?.value || "전체";
  const search = (document.getElementById("checklistSearch")?.value || "").trim().toLowerCase();
  const categoryFilter = selectedChecklistCategoryFilter || "전체";

  return checklistRows.map((row, realIndex) => ({ row, realIndex })).filter(({ row }) => {
    const targets = getChecklistTargets(row);
    const rowProject = row.project || "ㅇㅇ시설 신축공사";
    const projectOk = !project || isChecklistSharedSeedRow(row) || rowProject.includes(project) || project.includes(rowProject);
    const group = normalizeChecklistGroupName(row.group);
    const categoryOk = categoryFilter === "전체" || group === categoryFilter;
    const middleOk = isChecklistMiddleFilterEnabled(row.middleCategory);
    const ownerOk = owner === "전체" || targets.includes(owner);
    const state = getChecklistDoneState(row);
    const doneOk = doneFilter === "전체" || state === doneFilter;
    const text = `${rowProject} ${row.group} ${row.middleCategory || ""} ${row.subCategory || ""} ${row.trade} ${row.no} ${row.item} ${row.method} ${targets.join(" ")} ${state} ${row.comment}`.toLowerCase();

    return projectOk && categoryOk && middleOk && ownerOk && doneOk && (!search || text.includes(search));
  });
}

let openedChecklistTranslationPanel = null;

/* =========================================================
   무료 번역 API + 전문용어 강제 치환 설정
   - 데모 목적: 결제수단/API Key 없이 MyMemory 무료 공개 API 사용
   - 전문용어는 번역 전 보호 토큰으로 치환하고, 번역 후 지정 베트남어로 복원
   - 운영 전환 시 무료 번역 API/Google/DeepL 서버 프록시 방식으로 교체 권장
   ========================================================= */
const CHECKLIST_TRANSLATION_SOURCE_LANG = "ko";
const CHECKLIST_TRANSLATION_TARGET_LANG = "vi";
const CHECKLIST_TRANSLATION_PROVIDER_NAME = "무료 번역 API · Google Translate 스타일 미리보기";
const FREE_TRANSLATION_ENDPOINT = "https://api.mymemory.translated.net/get";
const CHECKLIST_TERM_DICTIONARY_STORAGE_KEY = "checklistTermDictionaryRows";
const CHECKLIST_TERM_SCOPE_OPTIONS = ["공통", "구조", "마감", "토목"];
const CHECKLIST_TERM_SCOPE_DEFAULT = "공통";
const checklistTranslationState = {};
let checklistTermDictionaryRows = [];
let activeChecklistTermDictionaryScope = CHECKLIST_TERM_SCOPE_DEFAULT;

const defaultChecklistTermDictionaryRows = [
  { ko: "프로젝트", vi: "Dự án", enabled: true },
  { ko: "구조팀", vi: "Đội kết cấu", enabled: true },
  { ko: "수평팀", vi: "Đội kết cấu ngang", enabled: true },
  { ko: "수직팀", vi: "Đội kết cấu đứng", enabled: true },
  { ko: "한국팀", vi: "Đội Hàn Quốc", enabled: true },
  { ko: "QC팀", vi: "Đội QC", enabled: true },
  { ko: "PM", vi: "PM", enabled: true },
  { ko: "기준서", vi: "Tài liệu tiêu chuẩn", enabled: true },
  { ko: "검토항목", vi: "Hạng mục kiểm tra", enabled: true },
  { ko: "검토방법", vi: "Phương pháp kiểm tra", enabled: true },
  { ko: "수량산출", vi: "Bóc tách khối lượng", enabled: true },
  { ko: "산출", vi: "Bóc tách", enabled: true },
  { ko: "도면", vi: "Bản vẽ", enabled: true },
  { ko: "도면목록표", vi: "Danh mục bản vẽ", enabled: true },
  { ko: "구조도면", vi: "Bản vẽ kết cấu", enabled: true },
  { ko: "건축도면", vi: "Bản vẽ kiến trúc", enabled: true },
  { ko: "슬라브", vi: "Sàn", enabled: true },
  { ko: "보", vi: "Dầm", enabled: true },
  { ko: "기둥", vi: "Cột", enabled: true },
  { ko: "옹벽", vi: "Tường chắn", enabled: true },
  { ko: "기초", vi: "Móng", enabled: true },
  { ko: "철근", vi: "Cốt thép", enabled: true },
  { ko: "배근", vi: "Bố trí thép", enabled: true },
  { ko: "콘크리트", vi: "Bê tông", enabled: true },
  { ko: "레미콘", vi: "Bê tông thương phẩm", enabled: true },
  { ko: "동바리", vi: "Giàn giáo chống", enabled: true },
  { ko: "시스템동바리", vi: "Giàn giáo chống hệ thống", enabled: true },
  { ko: "거푸집", vi: "Ván khuôn", enabled: true },
  { ko: "우마철근", vi: "Thép kê mũ ngựa", enabled: true },
  { ko: "내진철근", vi: "Thép kháng chấn", enabled: true },
  { ko: "커플러", vi: "Coupler", enabled: true },
  { ko: "정착", vi: "Neo thép", enabled: true },
  { ko: "이음", vi: "Nối thép", enabled: true },
  { ko: "HOOK", vi: "HOOK", enabled: true },
  { ko: "데크", vi: "Deck", enabled: true },
  { ko: "데크슬라브", vi: "Sàn Deck", enabled: true },
  { ko: "끊어치기", vi: "Riblath", enabled: true }
];

function getChecklistTranslationKey(realIndex, field) {
  return `${realIndex}::${field}`;
}

function getChecklistTranslationText(realIndex, field) {
  const row = checklistRows[realIndex] || {};
  return String(row[field] || "").trim();
}


function normalizeChecklistTermScope(value) {
  const text = String(value || "").trim();
  if (!text) return CHECKLIST_TERM_SCOPE_DEFAULT;
  if (text.includes("구조")) return "구조";
  if (text.includes("마감")) return "마감";
  if (text.includes("토목")) return "토목";
  if (CHECKLIST_TERM_SCOPE_OPTIONS.includes(text)) return text;
  return CHECKLIST_TERM_SCOPE_DEFAULT;
}

function inferChecklistTermScopeFromTerm(row = {}) {
  const ko = String(row.ko || "").trim();
  const text = `${row.scope || ""} ${row.termScope || ""} ${row.middleCategory || ""} ${ko}`;
  if (/구조|구조팀|철근|콘크리트|레미콘|거푸집|동바리|기초|기둥|슬라브|옹벽|커플러|정착|이음|보|배근|내진|데크/.test(text)) return "구조";
  if (/마감|건축|창호|방수|견출|단열|타일|도장|수장|인테리어|철거/.test(text)) return "마감";
  if (/토목|우수|오수|포장|흙막이|부대토목|맨홀|관로/.test(text)) return "토목";
  return CHECKLIST_TERM_SCOPE_DEFAULT;
}

function getChecklistRowTermScope(row = {}) {
  return normalizeChecklistTermScope(row.middleCategory || row.trade || row.group || row.subCategory || "");
}

function normalizeChecklistTermDictionaryRow(row = {}) {
  const normalized = {
    ko: String(row.ko || "").trim(),
    vi: String(row.vi || "").trim(),
    enabled: row.enabled !== false,
    scope: normalizeChecklistTermScope(row.scope || row.termScope || row.category || "")
  };
  if (!row.scope && !row.termScope && !row.category) normalized.scope = inferChecklistTermScopeFromTerm(row);
  return normalized;
}

function getActiveChecklistTermRows(scope = CHECKLIST_TERM_SCOPE_DEFAULT) {
  const normalizedScope = normalizeChecklistTermScope(scope);
  return loadChecklistTermDictionaryRows()
    .filter(row => row.enabled !== false && row.ko && row.vi)
    .filter(row => row.scope === CHECKLIST_TERM_SCOPE_DEFAULT || row.scope === normalizedScope)
    .sort((a, b) => b.ko.length - a.ko.length);
}

function isChecklistTermBoundaryChar(ch) {
  return !!ch && /[0-9A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ_]/.test(ch);
}

function canReplaceChecklistTermAt(source, index, term) {
  const before = source[index - 1] || "";
  const after = source[index + term.length] || "";
  return !isChecklistTermBoundaryChar(before) && !isChecklistTermBoundaryChar(after);
}

function replaceChecklistTermOccurrences(source, term, replacement) {
  const text = String(source || "");
  const ko = String(term || "");
  if (!ko) return text;
  let output = "";
  let cursor = 0;
  let index = text.indexOf(ko, cursor);
  while (index !== -1) {
    if (canReplaceChecklistTermAt(text, index, ko)) {
      output += text.slice(cursor, index) + replacement;
      cursor = index + ko.length;
    } else {
      output += text.slice(cursor, index + ko.length);
      cursor = index + ko.length;
    }
    index = text.indexOf(ko, cursor);
  }
  output += text.slice(cursor);
  return output;
}

function findDuplicateChecklistTerms(rows = checklistTermDictionaryRows) {
  const seen = new Map();
  const duplicates = [];
  rows.forEach((row, index) => {
    const normalized = normalizeChecklistTermDictionaryRow(row);
    if (!normalized.ko || !normalized.vi) return;
    const key = `${normalized.scope}::${normalized.ko.replace(/\s+/g, " ").trim()}`;
    if (seen.has(key)) duplicates.push({ index, firstIndex: seen.get(key), scope: normalized.scope, ko: normalized.ko });
    else seen.set(key, index);
  });
  return duplicates;
}

function getChecklistTermScopeLabel(scope) {
  return normalizeChecklistTermScope(scope);
}

function setChecklistTermDictionaryScope(scope) {
  activeChecklistTermDictionaryScope = normalizeChecklistTermScope(scope);
  renderChecklistTermDictionaryModal();
}

function loadChecklistTermDictionaryRows() {
  if (checklistTermDictionaryRows.length) return checklistTermDictionaryRows;
  try {
    const saved = JSON.parse(localStorage.getItem(CHECKLIST_TERM_DICTIONARY_STORAGE_KEY) || "[]");
    if (Array.isArray(saved) && saved.length) {
      checklistTermDictionaryRows = saved
        .map(row => normalizeChecklistTermDictionaryRow(row))
        .filter(row => row.ko && row.vi);
      return checklistTermDictionaryRows;
    }
  } catch (error) {}
  checklistTermDictionaryRows = defaultChecklistTermDictionaryRows.map(row => normalizeChecklistTermDictionaryRow(row));
  saveChecklistTermDictionaryRows(false);
  return checklistTermDictionaryRows;
}

function saveChecklistTermDictionaryRows(showMessage = true) {
  checklistTermDictionaryRows = checklistTermDictionaryRows
    .map(row => normalizeChecklistTermDictionaryRow(row))
    .filter(row => row.ko || row.vi);
  const duplicates = findDuplicateChecklistTerms(checklistTermDictionaryRows);
  if (duplicates.length) {
    const first = duplicates[0];
    showToast(`중복 용어가 있습니다: [${first.scope}] ${first.ko}`);
    return false;
  }
  try {
    localStorage.setItem(CHECKLIST_TERM_DICTIONARY_STORAGE_KEY, JSON.stringify(checklistTermDictionaryRows));
  } catch (error) {}
  if (showMessage) showToast("전문용어 사전을 저장했습니다.");
  return true;
}

function resetChecklistTermDictionaryRows() {
  if (!confirm("전문용어 사전을 기본값으로 되돌릴까요?")) return;
  checklistTermDictionaryRows = defaultChecklistTermDictionaryRows.map(row => normalizeChecklistTermDictionaryRow(row));
  saveChecklistTermDictionaryRows(false);
  renderChecklistTermDictionaryModal();
  showToast("전문용어 사전을 기본값으로 복원했습니다.");
}

function addChecklistTermDictionaryRow() {
  loadChecklistTermDictionaryRows();
  checklistTermDictionaryRows.push({ ko: "", vi: "", enabled: true, scope: activeChecklistTermDictionaryScope });
  renderChecklistTermDictionaryModal();
}

function updateChecklistTermDictionaryCell(index, field, value) {
  loadChecklistTermDictionaryRows();
  const row = checklistTermDictionaryRows[index];
  if (!row) return;
  if (field === "enabled") row.enabled = !!value;
  else if (field === "scope") row.scope = normalizeChecklistTermScope(value);
  else row[field] = String(value || "").trim();
}

function deleteChecklistTermDictionaryRow(index) {
  loadChecklistTermDictionaryRows();
  checklistTermDictionaryRows.splice(index, 1);
  saveChecklistTermDictionaryRows(false);
  renderChecklistTermDictionaryModal();
}

function closeChecklistTermDictionaryModal() {
  document.getElementById("checklistTermDictionaryBackdrop")?.remove();
}

function openChecklistTermDictionaryModal() {
  loadChecklistTermDictionaryRows();
  let layer = document.getElementById("checklistTermDictionaryBackdrop");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "checklistTermDictionaryBackdrop";
    layer.className = "modal-backdrop checklist-term-dictionary-backdrop";
    document.body.appendChild(layer);
  }
  renderChecklistTermDictionaryModal();
}

function renderChecklistTermDictionaryModal() {
  const layer = document.getElementById("checklistTermDictionaryBackdrop");
  if (!layer) return;
  loadChecklistTermDictionaryRows();
  const visibleRows = checklistTermDictionaryRows
    .map((row, index) => ({ ...normalizeChecklistTermDictionaryRow(row), index }))
    .filter(row => activeChecklistTermDictionaryScope === "전체" || row.scope === activeChecklistTermDictionaryScope);
  const duplicateKeys = new Set(findDuplicateChecklistTerms(checklistTermDictionaryRows).map(item => `${item.scope}::${item.ko}`));
  const scopeTabs = CHECKLIST_TERM_SCOPE_OPTIONS.map(scope => `
    <button type="button" class="checklist-term-scope-tab ${activeChecklistTermDictionaryScope === scope ? "active" : ""}" onclick="setChecklistTermDictionaryScope('${scope}')">
      ${scope}
      <span>${checklistTermDictionaryRows.filter(row => normalizeChecklistTermDictionaryRow(row).scope === scope).length}</span>
    </button>
  `).join("");
  const rows = visibleRows.map((row) => {
    const duplicateClass = duplicateKeys.has(`${row.scope}::${row.ko}`) ? " is-duplicate" : "";
    return `
    <tr class="${duplicateClass}">
      <td><input type="checkbox" ${row.enabled !== false ? "checked" : ""} onchange="updateChecklistTermDictionaryCell(${row.index}, 'enabled', this.checked)"></td>
      <td>
        <select class="checklist-term-scope-select" onchange="updateChecklistTermDictionaryCell(${row.index}, 'scope', this.value); renderChecklistTermDictionaryModal();">
          ${CHECKLIST_TERM_SCOPE_OPTIONS.map(scope => `<option value="${scope}" ${row.scope === scope ? "selected" : ""}>${scope}</option>`).join("")}
        </select>
      </td>
      <td><input type="text" value="${escapeHtml(row.ko)}" placeholder="한글 전문용어" oninput="updateChecklistTermDictionaryCell(${row.index}, 'ko', this.value)"></td>
      <td><input type="text" value="${escapeHtml(row.vi)}" placeholder="베트남어 고정 번역" oninput="updateChecklistTermDictionaryCell(${row.index}, 'vi', this.value)"></td>
      <td>${duplicateClass ? `<span class="checklist-term-duplicate-badge">중복</span>` : `<span class="checklist-term-scope-badge">${getChecklistTermScopeLabel(row.scope)}</span>`}</td>
      <td><button type="button" class="btn btn-danger" onclick="deleteChecklistTermDictionaryRow(${row.index})">삭제</button></td>
    </tr>`;
  }).join("");
  layer.innerHTML = `
    <div class="checklist-term-dictionary-modal" onclick="event.stopPropagation()">
      <div class="checklist-term-dictionary-head">
        <div>
          <h2>전문용어 고정번역 사전</h2>
          <p>중분류별로 전문용어를 분리 관리합니다. 번역 시 현재 행의 중분류와 공통 사전만 적용됩니다.</p>
        </div>
        <button type="button" class="modal-close" onclick="closeChecklistTermDictionaryModal()">×</button>
      </div>
      <div class="checklist-term-dictionary-toolbar">
        <button type="button" class="btn btn-line" onclick="addChecklistTermDictionaryRow()">+ 용어 추가</button>
        <button type="button" class="btn btn-line" onclick="resetChecklistTermDictionaryRows()">기본값 복원</button>
        <button type="button" class="btn btn-primary" onclick="if (saveChecklistTermDictionaryRows(true)) closeChecklistTermDictionaryModal();">사전 저장</button>
      </div>
      <div class="checklist-term-scope-tabs">
        ${scopeTabs}
      </div>
      <div class="checklist-term-api-guide">
        <strong>중분류별 사전 적용</strong>
        <span><code>공통</code> 용어는 모든 행에 적용되고, <code>구조/마감/토목</code> 용어는 해당 중분류 행에서만 적용됩니다. 동일 중분류 안의 동일 한글 용어는 저장되지 않습니다.</span>
      </div>
      <div class="checklist-term-dictionary-body">
        <table>
          <thead><tr><th>사용</th><th>중분류</th><th>한글 전문용어</th><th>베트남어 고정 번역</th><th>상태</th><th>관리</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="6" class="empty">등록된 전문용어가 없습니다.</td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
  layer.onclick = closeChecklistTermDictionaryModal;
}

function applyChecklistTermTokenProtection(text, scope = CHECKLIST_TERM_SCOPE_DEFAULT) {
  const source = String(text || "");
  const terms = getActiveChecklistTermRows(scope);
  let protectedText = source;
  const tokenMap = [];
  terms.forEach((row, index) => {
    const token = `CCTERM${String(index).padStart(3, "0")}TOKEN`;
    const nextText = replaceChecklistTermOccurrences(protectedText, row.ko, token);
    if (nextText !== protectedText) {
      protectedText = nextText;
      tokenMap.push({ token, ko: row.ko, vi: row.vi, scope: row.scope });
    }
  });
  return { protectedText, tokenMap };
}

function escapeRegExpForChecklistTerm(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFlexibleTokenPattern(token) {
  const compact = String(token || "").replace(/[^A-Za-z0-9]/g, "");
  if (!compact) return null;
  const chars = compact.split("").map(ch => escapeRegExpForChecklistTerm(ch)).join("[\\s_\-]*");
  return new RegExp(chars, "gi");
}

function restoreChecklistTermTokens(text, tokenMap = []) {
  let output = String(text || "");
  tokenMap.forEach(({ token, vi }) => {
    const directVariants = [
      token,
      token.toLowerCase(),
      token.toUpperCase(),
      token.replaceAll("_", " "),
      token.replaceAll("_", ""),
      `__ ${token.replaceAll("_", " ")} __`,
      `__${token}__`
    ];
    directVariants.forEach(variant => {
      if (variant) output = output.split(variant).join(vi);
    });
    const flexiblePattern = buildFlexibleTokenPattern(token);
    if (flexiblePattern) output = output.replace(flexiblePattern, vi);
  });
  return output;
}


function normalizeChecklistTranslationResponse(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  return (
    data.responseData?.translatedText ||
    data.matches?.find(item => item?.translation)?.translation ||
    data.translatedText ||
    data.translation ||
    data.result ||
    data.message?.result?.translatedText ||
    data.data?.translatedText ||
    data.data?.translation ||
    data.data?.result ||
    ""
  );
}

function buildFreeTranslationUrl(text) {
  const params = new URLSearchParams({
    q: text,
    langpair: `${CHECKLIST_TRANSLATION_SOURCE_LANG}|${CHECKLIST_TRANSLATION_TARGET_LANG}`
  });
  return `${FREE_TRANSLATION_ENDPOINT}?${params.toString()}`;
}

function makeDictionaryOnlyTranslation(text, tokenMap = [], scope = CHECKLIST_TERM_SCOPE_DEFAULT) {
  let output = String(text || "");
  const terms = getActiveChecklistTermRows(scope);
  terms.forEach(({ ko, vi }) => {
    output = replaceChecklistTermOccurrences(output, ko, vi);
  });
  tokenMap.forEach(({ ko, vi }) => {
    output = replaceChecklistTermOccurrences(output, ko, vi);
  });
  return output;
}

async function requestChecklistTranslation(text, field = "", scope = CHECKLIST_TERM_SCOPE_DEFAULT) {
  const originalText = String(text || "").trim();
  if (!originalText) {
    return {
      translatedText: "번역할 내용이 없습니다.",
      source: "empty"
    };
  }

  const { protectedText, tokenMap } = applyChecklistTermTokenProtection(originalText, scope);

  try {
    const response = await fetch(buildFreeTranslationUrl(protectedText), {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`무료 번역 API 오류: ${response.status}${errorText ? " / " + errorText.slice(0, 160) : ""}`);
    }

    const data = await response.json();
    const translatedText = normalizeChecklistTranslationResponse(data);
    if (!translatedText) throw new Error("무료 번역 API 응답에서 번역문을 찾지 못했습니다.");

    return {
      translatedText: restoreChecklistTermTokens(translatedText, tokenMap),
      source: "free-api",
      provider: CHECKLIST_TRANSLATION_PROVIDER_NAME,
      raw: data
    };
  } catch (error) {
    const fallbackText = makeDictionaryOnlyTranslation(originalText, tokenMap, scope);
    if (fallbackText && fallbackText !== originalText) {
      return {
        translatedText: `${fallbackText}\n\n※ 무료 번역 API 호출이 실패하여 전문용어 고정 치환 결과만 표시했습니다.`,
        source: "dictionary-fallback",
        error: error?.message || "무료 번역 API 호출 실패"
      };
    }
    throw error;
  }
}

async function runChecklistTranslation(realIndex, field) {
  const key = getChecklistTranslationKey(realIndex, field);
  const text = getChecklistTranslationText(realIndex, field);
  const termScope = getChecklistRowTermScope(checklistRows[realIndex] || {});
  checklistTranslationState[key] = {
    status: "loading",
    originalText: text,
    translatedText: "",
    error: "",
    termScope
  };
  renderChecklistGrid();

  try {
    const result = await requestChecklistTranslation(text, field, termScope);
    checklistTranslationState[key] = {
      status: result.source === "dictionary-fallback" ? "ready-fallback" : "ready",
      originalText: text,
      translatedText: result.translatedText,
      error: ""
    };
  } catch (error) {
    checklistTranslationState[key] = {
      status: "error",
      originalText: text,
      translatedText: "",
      error: error?.message || "번역 중 오류가 발생했습니다."
    };
  }

  if (openedChecklistTranslationPanel === key) renderChecklistGrid();
}

function toggleChecklistTranslationPanel(event, realIndex, field) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const key = getChecklistTranslationKey(realIndex, field);
  if (openedChecklistTranslationPanel === key) {
    openedChecklistTranslationPanel = null;
    renderChecklistGrid();
    return;
  }

  openedChecklistTranslationPanel = key;
  renderChecklistGrid();
  runChecklistTranslation(realIndex, field);
}

function renderChecklistTranslateCell(realIndex, field, value, locked = false) {
  return `
    <div class="checklist-translate-cell">
      <div class="cell excel-editable-cell" ${locked ? '' : 'contenteditable="true" tabindex="0"'} data-row="${realIndex}" data-field="${field}" onfocus="setChecklistCellFocus(this)" onblur="updateChecklistCell(${realIndex}, '${field}', this.innerText)" onkeydown="moveChecklistCell(event, this)">${escapeHtml(value || "")}</div>
      <button type="button" class="checklist-translate-btn" onclick="toggleChecklistTranslationPanel(event, ${realIndex}, '${field}')" title="현재 셀의 한글 내용을 베트남어로 번역">번역</button>
    </div>`;
}

function renderChecklistTranslationPanel(realIndex) {
  if (!openedChecklistTranslationPanel) return "";
  const [rowKey, field] = openedChecklistTranslationPanel.split("::");
  if (String(realIndex) !== rowKey) return "";

  const key = getChecklistTranslationKey(realIndex, field);
  const state = checklistTranslationState[key] || {
    status: "idle",
    originalText: getChecklistTranslationText(realIndex, field),
    translatedText: "",
    error: ""
  };
  const fieldLabels = { item: "검토항목", method: "검토방법", comment: "코멘트" };
  const statusText = {
    idle: "대기",
    loading: "번역 요청 중",
    ready: "번역 완료",
    "ready-fallback": "전문용어 치환 결과",
    error: "오류"
  }[state.status] || "대기";

  const resultHtml = state.status === "loading"
    ? `<div class="google-style-translate-loading">무료 번역 API에 요청 중입니다.</div>`
    : state.status === "error"
      ? `<div class="google-style-translate-error">${escapeHtml(state.error || "번역 중 오류가 발생했습니다.")}</div>`
      : `<div class="google-style-translate-text">${escapeHtml(state.translatedText || "번역 결과가 여기에 표시됩니다.")}</div>`;

  const providerLabel = state.status === "ready-fallback"
    ? "전문용어 사전 치환 결과"
    : CHECKLIST_TRANSLATION_PROVIDER_NAME;

  return `
    <tr class="checklist-translation-row" data-translate-row="${realIndex}">
      <td colspan="11">
        <div class="google-style-translate-panel">
          <div class="google-style-translate-topbar">
            <div class="google-style-translate-brand">
              <span class="google-style-translate-dot blue"></span>
              <span class="google-style-translate-dot red"></span>
              <span class="google-style-translate-dot yellow"></span>
              <span class="google-style-translate-dot green"></span>
              <strong>Google Translate Style Preview</strong>
            </div>
            <div class="google-style-translate-actions">
              <span class="google-style-translate-provider">${escapeHtml(providerLabel)}</span>
              <span class="google-style-translate-status">${escapeHtml(statusText)}</span>
              <button type="button" class="google-style-translate-action" onclick="runChecklistTranslation(${realIndex}, '${field}')">다시 번역</button>
              <button type="button" class="google-style-translate-action close" onclick="openedChecklistTranslationPanel=null; renderChecklistGrid();">닫기</button>
            </div>
          </div>
          <div class="google-style-translate-langbar">
            <div class="google-style-translate-lang active">한국어</div>
            <div class="google-style-translate-swap">→</div>
            <div class="google-style-translate-lang active">베트남어</div>
            <div class="google-style-translate-field">${escapeHtml(fieldLabels[field] || field)} 셀 · 전문용어 고정번역 적용</div>
          </div>
          <div class="google-style-translate-grid">
            <div class="google-style-translate-box source">
              <div class="google-style-translate-box-head">원문</div>
              <div class="google-style-translate-source-text">${escapeHtml(state.originalText || "")}</div>
            </div>
            <div class="google-style-translate-box result">
              <div class="google-style-translate-box-head">번역 결과</div>
              ${resultHtml}
            </div>
          </div>
          <div class="google-style-translate-note">※ 실제 호출은 무료 번역 API로 처리되며, 화면만 Google Translate 스타일 템플릿으로 표시됩니다.</div>
        </div>
      </td>
    </tr>`;
}

function ensureChecklistTermDictionaryButton() {
  const existingButtons = Array.from(document.querySelectorAll("button"))
    .filter(btn => btn.textContent.trim() === "전문용어 사전" || btn.classList.contains("term-dictionary-open-btn") || btn.id === "checklistTermDictionaryOpenBtn");

  existingButtons.forEach((btn, index) => {
    if (index === 0) {
      btn.id = "checklistTermDictionaryOpenBtn";
      btn.type = "button";
      btn.classList.add("term-dictionary-open-btn");
      btn.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        openChecklistTermDictionaryModal();
      };
    } else {
      btn.remove();
    }
  });

  if (document.getElementById("checklistTermDictionaryOpenBtn")) return;

  const buttons = Array.from(document.querySelectorAll("button"));
  const qcTemplateButton = buttons.find(btn => btn.textContent.trim() === "QC팀 전달사항 편집하기");
  if (!qcTemplateButton || !qcTemplateButton.parentElement) return;

  const button = document.createElement("button");
  button.id = "checklistTermDictionaryOpenBtn";
  button.type = "button";
  button.className = "btn btn-line term-dictionary-open-btn";
  button.textContent = "전문용어 사전";
  button.onclick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    openChecklistTermDictionaryModal();
  };
  qcTemplateButton.parentElement.insertBefore(button, qcTemplateButton);
}

function renderChecklistGrid() {
  if (checklistRenderFrame) {
    window.cancelAnimationFrame(checklistRenderFrame);
    checklistRenderFrame = 0;
  }
  window.clearTimeout(checklistRenderTimer);

  const renderSignature = getChecklistRenderSignature();
  if (renderSignature !== checklistLastRenderSignature) {
    checklistLastRenderSignature = renderSignature;
    resetChecklistDetailRenderLimit();
  }

  renderChecklistCategoryButtons();
  ensureChecklistTermDictionaryButton();
  const body = document.getElementById("checklistGridBody");
  if (!body) return;

  const rows = getChecklistFilteredRows().sort((a, b) => {
    const ai = checklistCategoryOptions.indexOf(normalizeChecklistGroupName(a.row.group));
    const bi = checklistCategoryOptions.indexOf(normalizeChecklistGroupName(b.row.group));
    const ag = ai < 0 ? 999 : ai;
    const bg = bi < 0 ? 999 : bi;
    if (ag !== bg) return ag - bg;
    const mid = String(a.row.middleCategory || "").localeCompare(String(b.row.middleCategory || ""), "ko");
    if (mid !== 0) return mid;
    const sub = String(a.row.subCategory || "").localeCompare(String(b.row.subCategory || ""), "ko");
    if (sub !== 0) return sub;
    return String(a.row.no).localeCompare(String(b.row.no), "ko", { numeric: true });
  });

  const html = [];
  let lastGroup = "";
  let lastMiddleKey = "";
  let lastSubKey = "";
  let visibleDetailCount = 0;
  let skippedDetailCount = 0;

  rows.forEach(({ row, realIndex }) => {
    normalizeChecklistRow(row);
    const locked = isChecklistCategoryLocked(row.group);
    const normalizedGroup = normalizeChecklistGroupName(row.group);
    const middle = row.middleCategory || "기타";
    const sub = row.subCategory || "";
    const middleKey = `${normalizedGroup}::${middle}`;
    const subKey = `${middleKey}::${sub}`;

    if (normalizedGroup !== lastGroup) {
      html.push(renderChecklistGroupBand(normalizedGroup));
      lastGroup = normalizedGroup;
      lastMiddleKey = "";
      lastSubKey = "";
    }

    if (collapsedChecklistGroups.has(normalizedGroup)) return;

    if (middleKey !== lastMiddleKey) {
      html.push(renderChecklistMiddleBand(normalizedGroup, middle));
      lastMiddleKey = middleKey;
      lastSubKey = "";
    }

    if (collapsedChecklistMiddles.has(getChecklistMiddleCollapseKey(normalizedGroup, middle))) return;

    if (sub && subKey !== lastSubKey) {
      html.push(renderChecklistSubBand(normalizedGroup, middle, sub));
      lastSubKey = subKey;
    }

    if (sub && collapsedChecklistSubs.has(getChecklistSubCollapseKey(normalizedGroup, middle, sub))) return;

    visibleDetailCount += 1;
    if (visibleDetailCount > checklistDetailRenderLimit) {
      skippedDetailCount += 1;
      return;
    }

    html.push(`
      <tr class="checklist-detail-row ${row.done ? "row-done" : ""} ${locked ? "locked-row" : ""} ${row.eliminated ? "eliminated-row" : ""}" data-row-index="${realIndex}">
        <td><input type="checkbox" ${row.checked ? "checked" : ""} ${locked ? "disabled" : ""} onchange="updateChecklistCheck(${realIndex}, this.checked)" title="행 선택"></td>
        <td><div class="cell excel-editable-cell" ${locked ? '' : 'contenteditable="true" tabindex="0"'} data-row="${realIndex}" data-field="trade" onfocus="setChecklistCellFocus(this)" onblur="updateChecklistCell(${realIndex}, 'trade', this.innerText)" onkeydown="moveChecklistCell(event, this)">${escapeHtml(row.trade)}</div></td>
        <td class="serial-no-cell"><div class="cell excel-editable-cell serial-no-value" ${locked ? '' : 'contenteditable="true" tabindex="0"'} data-row="${realIndex}" data-field="no" onfocus="setChecklistCellFocus(this)" onblur="updateChecklistCell(${realIndex}, 'no', this.innerText)" onkeydown="moveChecklistCell(event, this)">${escapeHtml(normalizeChecklistNo(row.no))}</div></td>
        <td>${renderChecklistTranslateCell(realIndex, "item", row.item, locked)}</td>
        <td>${renderChecklistTranslateCell(realIndex, "method", row.method, locked)}</td>
        <td class="target-cell">${renderChecklistTargetCell(row, realIndex)}</td>
        <td class="done-cell">${renderChecklistTargetChecks(row, realIndex)}</td>
        <td>${renderChecklistTranslateCell(realIndex, "comment", row.comment, locked)}</td>
        <td>${renderChecklistAttachmentCell(row, realIndex)}</td>
        <td><div class="history-cell">${renderChecklistHistoryButton(row, realIndex)}</div></td>
        <td class="manage-cell"><div class="row-actions row-actions-center"><button class="btn btn-line" ${locked ? "disabled" : ""} onclick="openChecklistModal(${realIndex})">수정</button><button class="btn btn-danger" ${locked ? "disabled" : ""} onclick="deleteChecklistRow(${realIndex})">삭제</button></div></td>
      </tr>`);
    html.push(renderChecklistTranslationPanel(realIndex));
  });

  if (skippedDetailCount > 0) {
    html.push(`
      <tr class="checklist-more-row">
        <td colspan="11">
          <div class="checklist-more-inner">
            <strong>${skippedDetailCount}건이 추가로 있습니다.</strong>
            <span>초기 렌더링 부하를 줄이기 위해 ${checklistDetailRenderLimit}건까지만 먼저 표시합니다.</span>
            <button type="button" class="btn btn-line" onclick="loadMoreChecklistRows()">더 보기 +${Math.min(CHECKLIST_DETAIL_RENDER_STEP, skippedDetailCount)}건</button>
          </div>
        </td>
      </tr>`);
  }

  body.innerHTML = html.join("");
  updateBellReviewCount();
}
function renderChecklistMiddleBand(group, middle) {
  const normalized = normalizeChecklistGroupName(group);
  const count = getChecklistMiddleCount(normalized, middle);
  const collapsed = collapsedChecklistMiddles.has(getChecklistMiddleCollapseKey(normalized, middle));
  const flow = checklistCategoryTree[normalized]?.flow ? `<small>${escapeHtml(checklistCategoryTree[normalized].flow)}</small>` : "";
  return `<tr class="middle-separator-row ${collapsed ? "middle-collapsed" : ""}" onclick="toggleChecklistMiddleCollapse('${escapeJs(normalized)}', '${escapeJs(middle)}')"><td colspan="11"><div class="middle-band-inner"><button type="button" class="middle-toggle-btn" aria-label="중분류 접기 펼치기"><span>${collapsed ? "›" : "⌄"}</span></button><span>중분류</span><strong>${escapeHtml(middle)}</strong><em>${count}건</em><small class="middle-fold-guide">${collapsed ? "클릭하여 펼치기" : "클릭하여 접기"}</small>${flow}</div></td></tr>`;
}

function getChecklistSubCollapseKey(group, middle, sub) {
  return `${normalizeChecklistGroupName(group)}::${middle || "기타"}::${sub || ""}`;
}

function toggleChecklistSubCollapse(group, middle, sub) {
  const key = getChecklistSubCollapseKey(group, middle, sub);
  if (collapsedChecklistSubs.has(key)) collapsedChecklistSubs.delete(key);
  else collapsedChecklistSubs.add(key);
  renderChecklistGrid();
}

function renderChecklistSubBand(group, middle, sub) {
  const normalized = normalizeChecklistGroupName(group);
  const count = getChecklistSubCount(normalized, middle, sub);
  const collapsed = collapsedChecklistSubs.has(getChecklistSubCollapseKey(normalized, middle, sub));
  return `<tr class="sub-separator-row ${collapsed ? "sub-collapsed" : ""}" onclick="toggleChecklistSubCollapse('${escapeJs(normalized)}', '${escapeJs(middle)}', '${escapeJs(sub)}')"><td colspan="11"><div class="sub-band-inner"><button type="button" class="sub-toggle-btn" aria-label="소분류 접기 펼치기"><span>${collapsed ? "›" : "⌄"}</span></button><span>소분류</span><strong>${escapeHtml(sub)}</strong><em>${count}건</em><small class="sub-fold-guide">${collapsed ? "클릭하여 펼치기" : "클릭하여 접기"}</small></div></td></tr>`;
}

function renderChecklistGroupBand(group) {
  group = normalizeChecklistGroupName(group);
  const isQuestion = isQuestionCategory(group);
  const isFinalEstimateCondition = group === "Z7. 견적조건(최종)";
  const locked = isChecklistCategoryLocked(group);
  const collapsed = collapsedChecklistGroups.has(group);
  const count = getChecklistCategoryCount(group);
  const controls = [];

  controls.push(`<button class="btn btn-line group-mini-btn group-add-row-btn" ${locked ? "disabled" : ""} onclick="event.stopPropagation(); insertChecklistRowInGroup('${escapeJs(group)}')">+ 행 추가</button>`);

  if (group === firstCategoryName) {
    controls.push(`<button class="btn btn-line group-mini-btn" onclick="event.stopPropagation(); downloadFirstCategoryCsv();">발주처 송부용 엑셀 다운로드</button>`);
  }

  if (isQuestion || isFinalEstimateCondition) {
    controls.push(`<button class="btn btn-line group-mini-btn" onclick="event.stopPropagation(); downloadQuestionCategoryCsv('${escapeJs(group)}')">질의 엑셀</button>`);
  }

  if (isQuestion) {
    controls.push(`<button class="btn ${locked ? "btn-line" : "btn-primary"} group-mini-btn" ${locked ? "disabled" : ""} onclick="event.stopPropagation(); markQuestionCategorySent('${escapeJs(group)}')">${locked ? "송부완료" : "송부 완료 체크"}</button>`);
    const next = getNextQuestionCategory(group);
    if (locked && next) controls.push(`<span class="next-round-guide">다음 작성 가능: ${escapeHtml(next)}</span>`);
  }

  return `<tr class="group-separator-row ${locked ? "group-locked" : ""} ${collapsed ? "group-collapsed" : ""}" onclick="toggleChecklistGroupCollapse('${escapeJs(group)}')"><td colspan="11"><div class="group-band-inner"><div class="group-band-title"><button type="button" class="group-toggle-btn" aria-label="구분 접기 펼치기"><span class="group-toggle-icon">⌄</span></button><span>구분</span><strong>${escapeHtml(group)}</strong><em>${count}건</em>${locked ? `<b>잠금</b>` : ""}<small>${collapsed ? "클릭하여 펼치기" : "클릭하여 접기"}</small></div><div class="group-band-actions">${controls.join("")}</div></div></td></tr>`;
}



function renderChecklistTargetCell(row, realIndex) {
  normalizeChecklistRow(row);
  const locked = isChecklistCategoryLocked(row.group);
  const hasMiddleOptions = getChecklistMiddleOptions(row.group).length > 0;
  const manualTargets = row.manualTargets ? getChecklistTargets(row) : [];
  const targetChips = manualTargets.map(t => `<span class="target-chip target-assignee-chip target-stack-item">${escapeHtml(formatChecklistAssigneeLabel(t))}</span>`).join("");

  return `
    <div class="target-cell-wrap target-cell-center-wrap">
      <div class="target-stack-center">
        ${hasMiddleOptions ? `<button type="button" class="target-select-btn classify-select-btn target-stack-item" ${locked ? "disabled" : ""} onclick="openChecklistClassifyModal(${realIndex})">중분류 지정</button>` : ""}
        <button type="button" class="target-select-btn target-people-select-btn target-stack-item" ${locked ? "disabled" : ""} onclick="openChecklistTargetModal(${realIndex})">대상 선택</button>
        ${targetChips || `<span class="target-empty-guide target-stack-item">미지정</span>`}
      </div>
    </div>
  `;
}

function renderChecklistClassifyModal(index) {
  const row = checklistRows[index];
  if (!row) return "";
  normalizeChecklistRow(row);
  const locked = isChecklistCategoryLocked(row.group);
  const middleOptions = getChecklistMiddleOptions(row.group);
  const currentMiddle = row.middleCategory || middleOptions[0] || "";
  const subOptions = getChecklistSubOptions(row.group, currentMiddle);
  const currentSub = row.subCategory || subOptions[0] || "";
  const subField = subOptions.length ? `
        <div class="field"><label>소분류</label><select id="inlineChecklistSub" ${locked ? "disabled" : ""}>${subOptions.map(value => `<option value="${escapeHtml(value)}" ${value === currentSub ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}</select></div>` : "";

  return `
    <div class="target-modal-card classify-modal-card" onclick="event.stopPropagation();">
      <div class="target-modal-head">
        <div>
          <strong>중분류 지정</strong>
          <span>${escapeHtml(row.no || "-")} · ${escapeHtml(row.group || "")}</span>
        </div>
        <button type="button" class="close" onclick="closeChecklistClassifyModal()">×</button>
      </div>
      <div class="target-modal-body classify-modal-body">
        <div class="field"><label>중분류</label><select id="inlineChecklistMiddle" ${locked || !middleOptions.length ? "disabled" : ""} onchange="refreshInlineChecklistSubOptions(${index})">${middleOptions.length ? middleOptions.map(value => `<option value="${escapeHtml(value)}" ${value === currentMiddle ? "selected" : ""}>${escapeHtml(value)}</option>`).join("") : `<option value="">중분류 없음</option>`}</select></div>
        ${subField}
      </div>
      <div class="target-modal-foot">
        <button type="button" class="btn btn-line" onclick="closeChecklistClassifyModal()">닫기</button>
        <button type="button" class="btn btn-primary" ${locked ? "disabled" : ""} onclick="applyChecklistClassifyModal(${index})">적용</button>
      </div>
    </div>
  `;
}

function openChecklistClassifyModal(index) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  if (isChecklistCategoryLocked(row.group)) {
    showToast("송부 완료된 질의차수는 중분류를 수정할 수 없습니다.");
    return;
  }

  closeChecklistClassifyModal();
  closeChecklistTargetModal();
  const layer = document.createElement("div");
  layer.id = "checklistClassifyModal";
  layer.className = "target-modal-backdrop active";
  layer.innerHTML = renderChecklistClassifyModal(index);
  layer.addEventListener("click", closeChecklistClassifyModal);
  document.body.appendChild(layer);
  requestAnimationFrame(() => resetChecklistOrgChartView());
}

function closeChecklistClassifyModal() {
  document.getElementById("checklistClassifyModal")?.remove();
}

function refreshInlineChecklistSubOptions(index) {
  const row = checklistRows[index];
  if (!row) return;
  const group = normalizeChecklistGroupName(row.group);
  const middle = document.getElementById("inlineChecklistMiddle")?.value || "";
  const subEl = document.getElementById("inlineChecklistSub");
  if (!subEl) return;
  const options = getChecklistSubOptions(group, middle);
  subEl.innerHTML = options.length
    ? options.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")
    : `<option value="">소분류 없음</option>`;
  subEl.disabled = !options.length;
}

function applyChecklistClassifyModal(index) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  if (isChecklistCategoryLocked(row.group)) return;

  const middle = document.getElementById("inlineChecklistMiddle")?.value || "";
  const sub = document.getElementById("inlineChecklistSub")?.value || "";
  const validMiddles = getChecklistMiddleOptions(row.group);
  if (validMiddles.length && !validMiddles.includes(middle)) {
    showToast("선택 가능한 중분류가 아닙니다.");
    return;
  }

  row.middleCategory = middle;
  row.subCategory = getChecklistSubOptions(row.group, middle).length ? sub : "";
  row.manualTargets = false;
  row.targets = [];
  row.checks = [];
  normalizeChecklistRow(row);
  row.history.push({ action: "중분류 지정", target: getChecklistRouteLabel(row), worker: getCurrentWorkerName(), time: getChecklistTimeText() });
  closeChecklistClassifyModal();
  collapsedChecklistGroups.delete(normalizeChecklistGroupName(row.group));
  collapsedChecklistMiddles.delete(getChecklistMiddleCollapseKey(row.group, row.middleCategory));
  renderChecklistGrid();
  showToast("중분류가 반영되었습니다.");
}

function getChecklistAssigneeDepartments() {
  const deptSet = new Set();
  (employees || []).forEach(emp => {
    if (emp?.dept) deptSet.add(emp.dept);
  });
  return Array.from(deptSet).sort((a, b) => a.localeCompare(b, "ko"));
}

function getChecklistActiveEmployees() {
  return (employees || [])
    .filter(emp => emp && emp.status !== "퇴사" && emp.status !== "계약만료" && emp.status !== "입사취소")
    .sort((a, b) => {
      const deptCompare = String(a.dept || "").localeCompare(String(b.dept || ""), "ko");
      if (deptCompare) return deptCompare;
      return displayName(a).localeCompare(displayName(b), "ko");
    });
}

function makeChecklistDepartmentTarget(dept) {
  return `부서:${dept}`;
}

function makeChecklistEmployeeTarget(emp) {
  return `개인:${emp.empNo}`;
}

function makeChecklistClientSendTarget() {
  return "발주처 송부 필요";
}

function shouldShowChecklistClientSendTarget(row) {
  return normalizeChecklistGroupName(row?.group) === firstCategoryName;
}

function formatChecklistAssigneeLabel(target) {
  const value = String(target || "");
  if (value === makeChecklistClientSendTarget()) return "발주처 송부 필요";
  if (value.startsWith("부서:")) return value.replace("부서:", "부서 · ");
  if (value.startsWith("개인:")) {
    const empNo = value.replace("개인:", "");
    const emp = employees.find(e => e.empNo === empNo);
    return emp ? `개인 · ${displayName(emp)}` : `개인 · ${empNo}`;
  }
  return value;
}

function getChecklistCheckTargetForAssignee(target) {
  const value = String(target || "");
  if (value === makeChecklistClientSendTarget()) return "PM";
  return value;
}

function isChecklistTargetSelected(row, target) {
  return Array.isArray(row?.targets) && row.targets.includes(target);
}

function renderChecklistSelectedAssignees(row) {
  const targets = row.manualTargets ? getChecklistTargets(row) : [];
  if (!targets.length) return `<span class="target-selected-empty">선택된 부서/개인이 없습니다.</span>`;
  return targets.map(target => `
    <span class="target-selected-chip">
      ${escapeHtml(formatChecklistAssigneeLabel(target))}
      <button type="button" onclick="removeChecklistAssignee('${escapeJs(target)}')">×</button>
    </span>
  `).join("");
}

function getChecklistOrgCompanyList() {
  return Object.keys(typeof orgStructures !== "undefined" ? orgStructures : {}).filter(company => orgStructures[company]?.root);
}

function getChecklistOrgNodeLabel(node) {
  if (!node) return "";
  if (node.displayName) return String(node.displayName);
  if (node.employeeId) {
    const emp = employees.find(item => item.empNo === node.employeeId);
    if (emp) return displayName(emp);
  }
  return String(node.title || "조직");
}

function isChecklistOrgDepartmentNode(node) {
  return node?.nodeType === "department" || (!node?.employeeId && Array.isArray(node?.children));
}

function makeChecklistOrgNodeSearchText(node, company) {
  const emp = node?.employeeId ? employees.find(item => item.empNo === node.employeeId) : null;
  return [
    company,
    node?.title,
    node?.displayName,
    node?.nodeType,
    emp?.empNo,
    emp ? displayName(emp) : "",
    emp?.company,
    emp?.dept,
    emp?.grade,
    emp?.position
  ].filter(Boolean).join(" ").toLowerCase();
}

function getChecklistOrgNodeTarget(node, company) {
  const isDept = isChecklistOrgDepartmentNode(node);
  const emp = node?.employeeId ? employees.find(item => item.empNo === node.employeeId) : null;
  const label = getChecklistOrgNodeLabel(node) || node?.title || company || "조직";
  return isDept ? makeChecklistDepartmentTarget(label) : (emp ? makeChecklistEmployeeTarget(emp) : makeChecklistDepartmentTarget(label));
}

function getChecklistOrgNodeMeta(node, company) {
  const emp = node?.employeeId ? employees.find(item => item.empNo === node.employeeId) : null;
  if (emp) return `${emp.company || company} · ${emp.dept || "소속 미지정"}`;
  return "부서 전체 지정";
}

function getChecklistOrgNodeTitleText(node, depth = 0) {
  const emp = node?.employeeId ? employees.find(item => item.empNo === node.employeeId) : null;
  if (node?.nodeType === "department" || !node?.employeeId) return node?.title || node?.displayName || "부서";
  return node?.title || emp?.position || emp?.grade || "직원";
}

function getChecklistOrgNodeClass(node, depth = 0) {
  const base = typeof getOrgPopupNodeClass === "function" ? getOrgPopupNodeClass(node, depth).replaceAll("org-popup-", "actual-view-") : "";
  const title = String(node?.displayName || node?.title || "").trim().toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return [base, title ? `actual-view-${title}` : ""].filter(Boolean).join(" ");
}

function renderChecklistSelectableOrgNode(node, index, company, depth = 0, path = "0") {
  if (!node) return "";
  const children = Array.isArray(node.children) ? node.children : [];
  const emp = node.employeeId ? employees.find(item => item.empNo === node.employeeId) : null;
  const isDept = isChecklistOrgDepartmentNode(node);
  const label = isDept ? getChecklistOrgNodeLabel(node) : (emp ? displayName(emp) : getChecklistOrgNodeLabel(node));
  const title = getChecklistOrgNodeTitleText(node, depth);
  const meta = getChecklistOrgNodeMeta(node, company);
  const target = getChecklistOrgNodeTarget(node, company);
  const row = checklistRows[index];
  const checked = isChecklistTargetSelected(row, target);
  const searchText = makeChecklistOrgNodeSearchText(node, company);
  const typeClass = node.className || "";
  const layoutClass = getChecklistOrgNodeClass(node, depth);
  const childCount = children.length;
  const columnCount = childCount ? Math.min(childCount, typeof getOrgMemberColumnCount === "function" ? getOrgMemberColumnCount(node) : childCount) : 1;
  return `
    <div class="actual-view-node-wrap checklist-org-chart-node-wrap ${layoutClass} depth-${depth}" data-path="${escapeHtml(path)}" data-org-search="${escapeHtml(searchText)}">
      <button type="button" class="actual-view-node checklist-org-chart-node ${typeClass} depth-${depth} ${isDept ? "department" : "person"} ${checked ? "selected" : ""}"
        onclick="handleChecklistOrgTargetClick(${index}, '${escapeJs(target)}', event)"
        title="${escapeHtml(label)} 선택">
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(label)}</strong>
        <em>${escapeHtml(meta)}</em>
        <i class="checklist-org-chart-check">${checked ? "✓" : ""}</i>
      </button>
      ${emp ? `<button type="button" class="checklist-org-chart-card-btn" onclick="event.stopPropagation(); openMiniCardPopup('${escapeJs(emp.empNo)}')">인사카드</button>` : ""}
      ${childCount ? `
        <div class="actual-view-unified-children checklist-org-chart-children depth-${depth} count-${childCount} cols-${columnCount}" style="--org-child-count:${childCount};--org-child-cols:${columnCount};grid-template-columns:repeat(${columnCount}, max-content) !important;">
          ${children.map((child, childIndex) => renderChecklistSelectableOrgNode(child, index, company, depth + 1, `${path}-${childIndex}`)).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function getChecklistOrgViceRoot(company) {
  const root = (typeof orgStructures !== "undefined" ? orgStructures : {})?.[company]?.root;
  if (!root) return null;
  const stack = [root];
  while (stack.length) {
    const node = stack.shift();
    const title = String(node?.title || node?.displayName || "").trim();
    const emp = node?.employeeId ? employees.find(item => item.empNo === node.employeeId) : null;
    const empGrade = String(emp?.grade || "").trim();
    const empPosition = String(emp?.position || "").trim();
    const empName = emp ? displayName(emp) : "";

    if (title === "부사장" || empGrade === "부사장" || empPosition === "부사장") return node;
    if (company === "Viet QS" && (node?.employeeId === "VQS-002" || /Vice President/i.test(`${empGrade} ${empPosition}`) || empName.includes("Lee Won Hee") || empName.includes("이원희"))) return node;

    (node?.children || []).forEach(child => stack.push(child));
  }
  return root;
}

function getChecklistOrgBranchNodes(company) {
  const base = getChecklistOrgViceRoot(company);
  const children = Array.isArray(base?.children) ? base.children : [];
  if (!children.length) return [];

  // 대상 선택용 드롭박스는 대표/부사장/Director 같은 경영진 개인 노드가 아니라
  // 실제 업무 참여가 가능한 부사장 하위 조직 단위만 표시한다.
  // 예: 최영배 개인 노드 아래에 Finish, StructureㆍCivil 부서가 있으면
  //     드롭다운에는 개인명이 아니라 해당 하위 부서명을 표시한다.
  return children.flatMap(node => {
    const label = String(getChecklistOrgNodeLabel(node) || node?.title || node?.displayName || "").trim();
    const emp = node?.employeeId ? employees.find(item => item.empNo === node.employeeId) : null;
    const roleText = `${node?.title || ""} ${node?.displayName || ""} ${emp?.grade || ""} ${emp?.position || ""}`;
    const isExecutiveNode = label.includes("대표") || label.includes("부사장") || /CEO|Vice President|Director|본부장/i.test(roleText);
    const departmentChildren = (node?.children || []).filter(child => isChecklistOrgDepartmentNode(child));

    if (isExecutiveNode && departmentChildren.length) return departmentChildren;
    if (isExecutiveNode) return [];
    return [node];
  });
}

function getChecklistOrgBranchKey(node, index) {
  const label = getChecklistOrgNodeLabel(node) || node?.title || node?.displayName || "조직";
  return `${index}:${label}`;
}

function getChecklistDefaultOrgBranchKey(company) {
  const branches = getChecklistOrgBranchNodes(company);
  if (!branches.length) return "";

  // CON-COST 대상 선택 모달의 하위 조직 기본값은 항상 기술본부로 고정한다.
  // 조직도 구조가 변경되어도 라벨/제목/표시명 중 하나에 기술본부가 있으면 우선 선택한다.
  const techIndex = branches.findIndex(node => {
    const label = String(getChecklistOrgNodeLabel(node) || node?.title || node?.displayName || "").trim();
    return label.includes("기술본부");
  });
  if (company === "CON-COST" && techIndex >= 0) return getChecklistOrgBranchKey(branches[techIndex], techIndex);

  return getChecklistOrgBranchKey(branches[0], 0);
}

function renderChecklistOrgBranchOptions(company) {
  const branches = getChecklistOrgBranchNodes(company);
  if (!branches.length) return `<option value="">선택 가능한 하위 조직 없음</option>`;
  const defaultBranchKey = getChecklistDefaultOrgBranchKey(company);
  return branches.map((node, idx) => {
    const key = getChecklistOrgBranchKey(node, idx);
    const label = getChecklistOrgNodeLabel(node) || node?.title || `하위 조직 ${idx + 1}`;
    return `<option value="${escapeHtml(key)}" ${key === defaultBranchKey ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

function getChecklistOrgBranchNodeByKey(company, key) {
  const branches = getChecklistOrgBranchNodes(company);
  if (!branches.length) return null;
  if (!key) return branches[0];
  const index = Number(String(key).split(":")[0]);
  if (Number.isInteger(index) && branches[index]) return branches[index];
  return branches[0];
}

function renderChecklistOrgSelectedBranch(company, index) {
  const branchKey = getChecklistDefaultOrgBranchKey(company);
  const node = getChecklistOrgBranchNodeByKey(company, branchKey);
  if (!node) return `<div class="checklist-org-empty">표시할 하위 조직이 없습니다.</div>`;
  return renderChecklistSelectableOrgNode(node, index, company, 0, `branch-${branchKey}`);
}

function renderChecklistOrgSelectorTree(index) {
  const companies = getChecklistOrgCompanyList();
  const defaultCompany = companies.includes("CON-COST") ? "CON-COST" : companies[0];
  const companyTabs = companies.map(company => `<button type="button" class="checklist-org-tab ${company === defaultCompany ? "active" : ""}" data-org-company-tab="${escapeHtml(company)}" onclick="switchChecklistTargetOrgCompany('${escapeJs(company)}')">${escapeHtml(company)}</button>`).join("");
  return `
    <div class="target-selector-section checklist-org-selector-section checklist-org-chart-selector-section">
      <div class="target-selector-title checklist-org-selector-head checklist-org-chart-head">
        <div>
          <strong>조직도 대상 선택</strong>
          <small>부사장 하위 조직을 선택한 뒤 좌클릭: 단일 선택 / Ctrl+좌클릭: 다중 선택 / 휠: 확대·축소 / 휠 클릭 드래그: 시점 이동</small>
        </div>
      </div>
      <div class="checklist-org-tabs">${companyTabs}</div>
      ${companies.map(company => {
        const branchKey = getChecklistDefaultOrgBranchKey(company);
        return `
        <div class="checklist-org-tree-panel checklist-org-chart-panel ${company === defaultCompany ? "active" : ""}" data-org-company-panel="${escapeHtml(company)}">
          <div class="checklist-org-branch-toolbar">
            <label>
              <span>하위 조직 선택</span>
              <select class="checklist-org-branch-select" data-org-branch-select="${escapeHtml(company)}" onchange="switchChecklistTargetOrgBranch('${escapeJs(company)}', this.value)">
                ${renderChecklistOrgBranchOptions(company)}
              </select>
            </label>
          </div>
          <div class="checklist-org-chart-scroll" data-checklist-org-viewport onwheel="handleChecklistOrgChartWheel(event)" onmousedown="startChecklistOrgChartPan(event)">
            <div class="checklist-org-chart-canvas" data-checklist-org-canvas>
              <div class="actual-view-tree checklist-org-chart ${company === "CON-COST" ? "concost-tree" : "vietqs-tree"}" data-org-branch-chart="${escapeHtml(company)}" data-current-branch="${escapeHtml(branchKey)}">
                ${renderChecklistOrgSelectedBranch(company, index)}
              </div>
            </div>
          </div>
        </div>`;
      }).join("")}
    </div>
  `;
}

function switchChecklistTargetOrgBranch(company, branchKey) {
  const modal = document.getElementById("checklistTargetModal");
  const rowIndex = Number(modal?.querySelector(".org-target-modal-card")?.dataset.rowIndex);
  const panel = Array.from(modal?.querySelectorAll("[data-org-company-panel]") || []).find(item => item.dataset.orgCompanyPanel === company);
  const chart = panel?.querySelector("[data-org-branch-chart]");
  if (!modal || !chart || !Number.isInteger(rowIndex)) return;
  const node = getChecklistOrgBranchNodeByKey(company, branchKey);
  chart.dataset.currentBranch = branchKey || getChecklistDefaultOrgBranchKey(company);
  chart.innerHTML = node ? renderChecklistSelectableOrgNode(node, rowIndex, company, 0, `branch-${branchKey || "0"}`) : `<div class="checklist-org-empty">표시할 하위 조직이 없습니다.</div>`;
  const search = modal.querySelector(".checklist-org-search");
  if (search?.value) filterChecklistOrgOptions(search.value);
  requestAnimationFrame(() => resetChecklistOrgChartView());
}

function renderChecklistTargetModal(index) {
  const row = checklistRows[index];
  if (!row) return "";
  normalizeChecklistRow(row);
  const locked = isChecklistCategoryLocked(row.group);
  const routeLabel = getChecklistRouteLabel(row);
  const clientSendTarget = makeChecklistClientSendTarget();
  const showClientSendTarget = shouldShowChecklistClientSendTarget(row);
  const clientSendChecked = isChecklistTargetSelected(row, clientSendTarget);

  return `
    <div class="target-modal-card people-target-modal-card org-target-modal-card" onclick="event.stopPropagation();" data-row-index="${index}">
      <div class="target-modal-head">
        <div>
          <strong>대상 선택</strong>
          <span>${escapeHtml(row.no || "-")} · ${escapeHtml(row.group || "")} · ${escapeHtml(routeLabel || "중분류 미지정")}</span>
        </div>
        <button type="button" class="close" onclick="closeChecklistTargetModal()">×</button>
      </div>
      <div class="target-modal-guide">
        중분류는 작업 구분용입니다. 실제 확인 대상은 조직도에서 부서 또는 개인을 직접 선택합니다.
      </div>
      <div class="target-selected-area">
        <strong>선택된 대상</strong>
        <div class="target-selected-list">${renderChecklistSelectedAssignees(row)}</div>
      </div>
      <div class="target-modal-body people-target-modal-body org-target-modal-body">
        ${showClientSendTarget ? `
        <div class="target-selector-section client-send-selector-section">
          <div class="target-selector-title">발주처 송부 선택</div>
          <div class="target-selector-list client-send-selector-list">
            <label class="target-modal-option target-client-send-option ${clientSendChecked ? "selected" : ""}">
              <input type="checkbox" ${clientSendChecked ? "checked" : ""} ${locked ? "disabled" : ""} onchange="setChecklistTargetSelected(${index}, '${escapeJs(clientSendTarget)}', this.checked, true)">
              <span><b>발주처 송부 필요</b><small>PM이 확인 후 발주처에게 메일로 송부해야 할 때 선택</small></span>
            </label>
          </div>
        </div>` : ""}
        ${renderChecklistOrgSelectorTree(index)}
      </div>
      <div class="target-modal-foot">
        <button type="button" class="btn btn-line" onclick="clearChecklistAssignees(${index})" ${locked ? "disabled" : ""}>선택 초기화</button>
        <button type="button" class="btn btn-line" onclick="closeChecklistTargetModal()">닫기</button>
        <button type="button" class="btn btn-primary" onclick="closeChecklistTargetModal(); renderChecklistGrid();">적용</button>
      </div>
    </div>
  `;
}

function switchChecklistTargetOrgCompany(company) {
  document.querySelectorAll("#checklistTargetModal [data-org-company-tab]").forEach(btn => btn.classList.toggle("active", btn.dataset.orgCompanyTab === company));
  document.querySelectorAll("#checklistTargetModal [data-org-company-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.orgCompanyPanel === company));
  requestAnimationFrame(() => resetChecklistOrgChartView());
}


const CHECKLIST_ORG_CHART_MIN_ZOOM = 0.35;
const CHECKLIST_ORG_CHART_MAX_ZOOM = 1.8;
const CHECKLIST_ORG_CHART_ZOOM_STEP = 0.0018;
let checklistOrgPanState = null;

function getActiveChecklistOrgViewport() {
  return document.querySelector("#checklistTargetModal .checklist-org-chart-panel.active [data-checklist-org-viewport]");
}

function getChecklistOrgCanvas(viewport) {
  return viewport?.querySelector("[data-checklist-org-canvas]") || null;
}

function getChecklistOrgZoom(viewport) {
  const value = Number(viewport?.dataset.zoom || "1");
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function setChecklistOrgZoom(viewport, nextZoom, originX = null, originY = null) {
  if (!viewport) return;
  const canvas = getChecklistOrgCanvas(viewport);
  if (!canvas) return;

  const previousZoom = getChecklistOrgZoom(viewport);
  const zoom = Math.min(CHECKLIST_ORG_CHART_MAX_ZOOM, Math.max(CHECKLIST_ORG_CHART_MIN_ZOOM, nextZoom));
  if (Math.abs(previousZoom - zoom) < 0.001) return;

  const rect = viewport.getBoundingClientRect();
  const x = originX == null ? rect.width / 2 : originX - rect.left;
  const y = originY == null ? rect.height / 2 : originY - rect.top;
  const beforeLeft = (viewport.scrollLeft + x) / previousZoom;
  const beforeTop = (viewport.scrollTop + y) / previousZoom;

  viewport.dataset.zoom = String(zoom);
  if (Math.abs(zoom - 1) < 0.001) {
    canvas.style.transform = "";
    canvas.style.width = "";
    canvas.style.height = "";
  } else {
    canvas.style.transform = `scale(${zoom})`;
    canvas.style.width = `${100 / zoom}%`;
    canvas.style.height = `${100 / zoom}%`;
  }

  requestAnimationFrame(() => {
    viewport.scrollLeft = Math.max(0, beforeLeft * zoom - x);
    viewport.scrollTop = Math.max(0, beforeTop * zoom - y);
  });
}

function resetChecklistOrgChartView() {
  const viewport = getActiveChecklistOrgViewport();
  if (!viewport) return;
  const canvas = getChecklistOrgCanvas(viewport);
  viewport.dataset.zoom = "1";
  if (canvas) {
    canvas.style.transform = "";
    canvas.style.width = "";
    canvas.style.height = "";
  }
  requestAnimationFrame(() => {
    const horizontalCenter = Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2);
    viewport.scrollLeft = horizontalCenter;
    viewport.scrollTop = 0;
  });
}

function handleChecklistOrgChartWheel(event) {
  const viewport = event.currentTarget;
  if (!viewport?.matches("[data-checklist-org-viewport]")) return;
  event.preventDefault();
  event.stopPropagation();
  const currentZoom = getChecklistOrgZoom(viewport);
  const nextZoom = currentZoom * (1 - event.deltaY * CHECKLIST_ORG_CHART_ZOOM_STEP);
  setChecklistOrgZoom(viewport, nextZoom, event.clientX, event.clientY);
}

function startChecklistOrgChartPan(event) {
  const viewport = event.currentTarget;
  if (!viewport?.matches("[data-checklist-org-viewport]")) return;
  if (event.button !== 1) return;
  event.preventDefault();
  event.stopPropagation();
  checklistOrgPanState = {
    viewport,
    startX: event.clientX,
    startY: event.clientY,
    startScrollLeft: viewport.scrollLeft,
    startScrollTop: viewport.scrollTop
  };
  viewport.classList.add("is-panning");
  window.addEventListener("mousemove", moveChecklistOrgChartPan, { passive: false });
  window.addEventListener("mouseup", stopChecklistOrgChartPan, { passive: false });
}

function moveChecklistOrgChartPan(event) {
  if (!checklistOrgPanState) return;
  event.preventDefault();
  const { viewport, startX, startY, startScrollLeft, startScrollTop } = checklistOrgPanState;
  viewport.scrollLeft = startScrollLeft - (event.clientX - startX);
  viewport.scrollTop = startScrollTop - (event.clientY - startY);
}

function stopChecklistOrgChartPan() {
  if (checklistOrgPanState?.viewport) checklistOrgPanState.viewport.classList.remove("is-panning");
  checklistOrgPanState = null;
  window.removeEventListener("mousemove", moveChecklistOrgChartPan);
  window.removeEventListener("mouseup", stopChecklistOrgChartPan);
}

function filterChecklistOrgOptions(keyword) {
  const term = String(keyword || "").trim().toLowerCase();
  document.querySelectorAll("#checklistTargetModal .checklist-org-chart-node-wrap").forEach(node => {
    node.classList.remove("search-hidden", "search-self-match", "search-child-match");
  });
  if (!term) return;

  document.querySelectorAll("#checklistTargetModal .checklist-org-chart-node-wrap").forEach(node => {
    const text = node.dataset.orgSearch || node.textContent.toLowerCase();
    const selfMatch = text.includes(term);
    const childMatch = Array.from(node.querySelectorAll(":scope .checklist-org-chart-node-wrap")).some(child => {
      const childText = child.dataset.orgSearch || child.textContent.toLowerCase();
      return childText.includes(term);
    });
    node.classList.toggle("search-self-match", selfMatch);
    node.classList.toggle("search-child-match", !selfMatch && childMatch);
    node.classList.toggle("search-hidden", !selfMatch && !childMatch);
  });
}

function handleChecklistOrgTargetClick(index, target, event) {
  event.preventDefault();
  event.stopPropagation();
  const row = checklistRows[index];
  if (!row || isChecklistCategoryLocked(row.group)) return;
  const multi = event.ctrlKey || event.metaKey;
  if (!multi) {
    row.manualTargets = false;
    row.targets = [];
  }
  const already = isChecklistTargetSelected(row, target);
  setChecklistTargetSelected(index, target, multi ? !already : true, true);
}

function filterChecklistPeopleOptions(keyword) {
  const term = String(keyword || "").trim().toLowerCase();
  document.querySelectorAll("#checklistTargetModal .target-person-option").forEach(option => {
    const text = option.dataset.search || option.textContent.toLowerCase();
    option.style.display = !term || text.includes(term) ? "flex" : "none";
  });
}

function openChecklistTargetModal(index) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  if (isChecklistCategoryLocked(row.group)) {
    showToast("송부 완료된 질의차수는 요청 대상을 수정할 수 없습니다.");
    return;
  }

  closeChecklistTargetModal();
  closeChecklistClassifyModal();
  const layer = document.createElement("div");
  layer.id = "checklistTargetModal";
  layer.className = "target-modal-backdrop active";
  layer.innerHTML = renderChecklistTargetModal(index);
  layer.addEventListener("click", closeChecklistTargetModal);
  layer.addEventListener("wheel", trapChecklistTargetModalWheel, { passive: false });
  document.body.classList.add("checklist-target-modal-open");
  document.body.appendChild(layer);
  requestAnimationFrame(() => resetChecklistOrgChartView());
}

function closeChecklistTargetModal() {
  document.getElementById("checklistTargetModal")?.remove();
  document.body.classList.remove("checklist-target-modal-open");
}

function trapChecklistTargetModalWheel(event) {
  const modal = document.querySelector("#checklistTargetModal .people-target-modal-card");
  if (!modal) return;

  const scrollHost = event.target.closest(".checklist-org-chart-scroll, [data-checklist-org-viewport], .target-selector-list, .people-target-modal-body");
  if (!scrollHost || !modal.contains(scrollHost)) {
    event.preventDefault();
    return;
  }

  const canScroll = scrollHost.scrollHeight > scrollHost.clientHeight;
  if (!canScroll) {
    event.preventDefault();
    return;
  }

  const atTop = scrollHost.scrollTop <= 0;
  const atBottom = Math.ceil(scrollHost.scrollTop + scrollHost.clientHeight) >= scrollHost.scrollHeight;
  if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
    event.preventDefault();
  }
}

function refreshChecklistTargetModal(index) {
  const box = document.getElementById("checklistTargetModal");
  if (box) box.innerHTML = renderChecklistTargetModal(index);
}


function updateChecklistTargetModalSelectionState(index) {
  const modal = document.getElementById("checklistTargetModal");
  const row = checklistRows[index];
  if (!modal || !row) return;

  const selectedList = modal.querySelector(".target-selected-list");
  if (selectedList) selectedList.innerHTML = renderChecklistSelectedAssignees(row);

  modal.querySelectorAll(".checklist-org-chart-node").forEach(node => {
    const onclick = node.getAttribute("onclick") || "";
    const match = onclick.match(/handleChecklistOrgTargetClick\(\s*\d+\s*,\s*'([^']*)'/);
    if (!match) return;
    let target = match[1];
    try { target = target.replace(/\\'/g, "'").replace(/\\\\/g, "\\"); } catch (_) {}
    const selected = isChecklistTargetSelected(row, target);
    node.classList.toggle("selected", selected);
    const check = node.querySelector(".checklist-org-chart-check");
    if (check) check.textContent = selected ? "✓" : "";
  });

  const clientSendTarget = makeChecklistClientSendTarget();
  const clientOption = modal.querySelector(".target-client-send-option");
  if (clientOption) {
    const checked = isChecklistTargetSelected(row, clientSendTarget);
    clientOption.classList.toggle("selected", checked);
    const input = clientOption.querySelector('input[type="checkbox"]');
    if (input) input.checked = checked;
  }
}

function clearChecklistAssignees(index) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  row.manualTargets = false;
  row.targets = [getChecklistRouteLabel(row) || "PM"];
  row.checks = [];
  row.history = Array.isArray(row.history) ? row.history : [];
  row.history.push({ action: "요청대상 초기화", worker: getCurrentWorkerName(), time: getChecklistTimeText() });
  refreshChecklistTargetModal(index);
}

function removeChecklistAssignee(target) {
  const card = document.querySelector("#checklistTargetModal .people-target-modal-card");
  const index = Number(card?.dataset?.rowIndex);
  if (!Number.isFinite(index)) return;
  setChecklistTargetSelected(index, target, false, true);
}

function setChecklistTargetSelected(index, target, checked, keepModalOpen = false) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  if (isChecklistCategoryLocked(row.group)) return;

  const currentTargets = row.manualTargets ? row.targets : [];
  const targets = new Set(currentTargets || []);
  if (checked) targets.add(target);
  else targets.delete(target);

  row.manualTargets = targets.size > 0;
  row.targets = targets.size ? Array.from(targets) : [getChecklistRouteLabel(row) || "PM"];
  row.owner = row.targets.join(", ");
  const checkTargets = Array.from(new Set(row.targets.map(getChecklistCheckTargetForAssignee)));
  row.checks = checkTargets.map(name => {
    const old = row.checks?.find(check => check.target === name);
    return old ? { ...old } : { target: name, done: false, na: false, checkedBy: "", checkedAt: "" };
  });
  row.history = Array.isArray(row.history) ? row.history : [];
  row.history.push({ action: "요청대상 변경", target: row.targets.map(formatChecklistAssigneeLabel).join(", "), worker: getCurrentWorkerName(), time: getChecklistTimeText() });

  if (keepModalOpen) {
    updateChecklistTargetModalSelectionState(index);
  } else {
    renderChecklistGrid();
  }
}

function renderChecklistTargetChecks(row, realIndex) {
  normalizeChecklistRow(row);
  const checks = Array.isArray(row.checks) ? row.checks : [];
  const doneCount = checks.filter(check => check.done || check.na).length;
  const totalCount = checks.length || 0;
  const state = getChecklistDoneState(row);
  const stateClass = state === "확인완료" ? "complete" : (state === "부분확인" ? "partial" : "pending");
  return `
    <div class="done-cell-view-only">
      <button type="button" class="history-view-btn checklist-check-view-btn ${stateClass}" onclick="openChecklistCheckWindow(${realIndex})">
        보기 <span>${doneCount}/${totalCount}</span>
      </button>
      ${renderObjectionArea(row, realIndex)}
    </div>
  `;
}

function renderChecklistCheckModal(index) {
  const row = checklistRows[index];
  if (!row) return "";
  normalizeChecklistRow(row);
  const locked = isChecklistCategoryLocked(row.group);
  const checks = Array.isArray(row.checks) ? row.checks : [];
  const checkRows = checks.length ? checks.map((check, checkIndex) => {
    const isDone = Boolean(check.done);
    const isNa = Boolean(check.na);
    const statusLabel = isNa ? "해당 없음" : (isDone ? "확인완료" : "미확인");
    const statusClass = isNa ? "na" : (isDone ? "done" : "pending");
    const workerInfo = check.checkedBy || check.checkedAt
      ? `<small>${escapeHtml(check.checkedBy || "-")} · ${escapeHtml(check.checkedAt || "-")}</small>`
      : `<small>아직 처리 이력이 없습니다.</small>`;
    return `
      <div class="check-modal-row ${statusClass}">
        <div class="check-modal-target">
          <strong>${escapeHtml(formatChecklistAssigneeLabel(check.target))}</strong>
          <span>${escapeHtml(statusLabel)}</span>
          ${workerInfo}
        </div>
        <div class="check-modal-actions">
          <button type="button" class="btn ${isDone ? "btn-line" : "btn-primary"}" ${locked || isNa ? "disabled" : ""} onclick="toggleChecklistDoneFromModal(${index}, ${checkIndex}, ${isDone ? "false" : "true"})">
            ${isDone ? "확인 해제" : "담당자 확인"}
          </button>
          <button type="button" class="btn btn-line ${isNa ? "active" : ""}" ${locked ? "disabled" : ""} onclick="toggleChecklistNotApplicableFromModal(${index}, ${checkIndex})">
            해당 없음
          </button>
        </div>
      </div>
    `;
  }).join("") : `<div class="check-modal-empty">확인 대상이 없습니다.</div>`;

  return `
    <div class="check-modal-card" role="dialog" aria-modal="true" aria-label="체크 여부 보기">
      <div class="check-modal-head">
        <div>
          <h3>체크 여부</h3>
          <p>${escapeHtml(normalizeChecklistNo(row.no))} · ${escapeHtml(row.trade || "-")} · ${escapeHtml(row.item || "-")}</p>
        </div>
        <button type="button" class="modal-x" onclick="closeChecklistCheckModal()">×</button>
      </div>
      <div class="check-modal-body">
        ${locked ? `<div class="check-modal-notice">송부 완료된 질의차수는 수정할 수 없습니다.</div>` : ""}
        ${checkRows}
      </div>
      <div class="check-modal-footer">
        <button type="button" class="btn btn-line" onclick="closeChecklistCheckModal()">닫기</button>
      </div>
    </div>
  `;
}

function openChecklistCheckWindow(index) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  const oldLayer = document.getElementById("checklistCheckModalLayer");
  if (oldLayer) oldLayer.remove();
  const layer = document.createElement("div");
  layer.id = "checklistCheckModalLayer";
  layer.className = "check-modal-layer";
  layer.innerHTML = renderChecklistCheckModal(index);
  layer.addEventListener("click", event => {
    if (event.target === layer) closeChecklistCheckModal();
  });
  document.body.appendChild(layer);
}

function closeChecklistCheckModal() {
  document.getElementById("checklistCheckModalLayer")?.remove();
}

function refreshChecklistCheckModal(index) {
  const layer = document.getElementById("checklistCheckModalLayer");
  if (!layer) return;
  layer.innerHTML = renderChecklistCheckModal(index);
}

function toggleChecklistDoneFromModal(index, checkIndex, checked) {
  toggleChecklistDone(index, checkIndex, checked);
  refreshChecklistCheckModal(index);
}

function toggleChecklistNotApplicableFromModal(index, checkIndex) {
  toggleChecklistNotApplicable(index, checkIndex);
  refreshChecklistCheckModal(index);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
}
function escapeJs(value) {
  return String(value ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
function getCurrentWorkerName() {
  return document.querySelector(".user")?.textContent?.trim() || "현재 작업자";
}

function getChecklistTimeText() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}


function formatHistoryBlock(worker, action, time) {
  const safeWorker = worker || "";
  const safeAction = action || "";
  const safeTime = time || "";

  const parts = String(safeTime).split(" ");
  const datePart = parts[0] || "";
  const timePart = parts.slice(1).join(" ") || "";

  return formatHistoryBlock(created.worker, created.action, created.time);
}

function renderChecklistHistory(row) {
  normalizeChecklistRow(row);
  const history = Array.isArray(row.history) ? row.history : [];
  if (!history.length) return `<span class="history-empty">이력 없음</span>`;
  return history.slice(-4).reverse().map(item => `
    <div class="history-line ${item.action === "최초작성" ? "created" : ""}"><strong>${escapeHtml(item.worker)}</strong><span>${escapeHtml(item.target ? item.action + "(" + item.target + ")" : item.action)} · ${escapeHtml(item.time)}</span></div>
  `).join("");
}

function renderChecklistHistoryButton(row, realIndex) {
  normalizeChecklistRow(row);
  const history = Array.isArray(row.history) ? row.history : [];
  if (!history.length) return `<span class="history-empty">이력 없음</span>`;
  return `
    <button type="button" class="history-view-btn" onclick="openChecklistHistoryWindow(${realIndex})">
      보기 <span>${history.length}</span>
    </button>
  `;
}

function openChecklistHistoryWindow(index) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  const history = Array.isArray(row.history) ? [...row.history].reverse() : [];
  if (!history.length) {
    showToast("처리 이력이 없습니다.");
    return;
  }

  const title = `${row.no || ""} ${row.trade || ""} 처리 이력`.trim() || "처리 이력";
  const popup = window.open("", "_blank", "width=820,height=720,resizable=yes,scrollbars=yes");
  if (!popup) {
    showToast("팝업 차단을 해제해주세요.");
    return;
  }

  const rows = history.map((item, index) => `
    <tr>
      <td>${history.length - index}</td>
      <td>${escapeHtml(item.action || "-")}</td>
      <td>${escapeHtml(item.target || "-")}</td>
      <td>${escapeHtml(item.worker || "-")}</td>
      <td>${escapeHtml(item.time || "-")}</td>
    </tr>
  `).join("");

  popup.document.open();
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:"Pretendard","Noto Sans KR",Arial,sans-serif;background:#f4f6fb;color:#111827;padding:24px}
        .history-card{background:#fff;border:1px solid #dbe3ef;border-radius:20px;box-shadow:0 14px 44px rgba(15,23,42,.08);overflow:hidden}
        .history-head{padding:18px 20px;border-bottom:1px solid #e5e7eb;background:#fbfdff}
        .history-head h1{font-size:20px;letter-spacing:-.4px;margin-bottom:6px}
        .history-head p{font-size:13px;color:#64748b;font-weight:800}
        table{width:100%;border-collapse:collapse}
        th,td{padding:12px 14px;border-bottom:1px solid #edf2f7;text-align:left;font-size:13px;vertical-align:middle}
        th{background:#f8fafc;color:#475569;font-weight:900}
        td:first-child,th:first-child{width:64px;text-align:center;color:#64748b;font-weight:900}
        tr:last-child td{border-bottom:0}
      </style>
    </head>
    <body>
      <section class="history-card">
        <div class="history-head">
          <h1>${escapeHtml(title)}</h1>
          <p>구분: ${escapeHtml(row.group || "-")} / 검토항목: ${escapeHtml(row.item || "-")}</p>
        </div>
        <table>
          <thead>
            <tr><th>No</th><th>처리내용</th><th>대상</th><th>처리자</th><th>처리일시</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
    </body>
    </html>
  `);
  popup.document.close();
}

function toggleChecklistDone(index, checkIndex, checked) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  if (isChecklistCategoryLocked(row.group)) {
    showToast("송부 완료된 질의차수는 수정할 수 없습니다.");
    renderChecklistGrid();
    return;
  }
  const check = row.checks[checkIndex];
  if (!check) return;
  const worker = getCurrentWorkerName();
  const time = getChecklistTimeText();
  check.done = checked;
  if (checked) check.na = false;
  check.checkedBy = checked ? worker : "";
  check.checkedAt = checked ? time : "";
  row.history = Array.isArray(row.history) ? row.history : [];
  row.history = row.history.filter(h => !(h.target === check.target && (h.action === "확인완료" || h.action === "해당 없음")));
  if (checked) {
    row.history.push({ action: "확인완료", target: check.target, worker, time });
    showToast(`${row.no}번 항목의 ${check.target} 확인완료가 기록되었습니다.`);
  } else {
    showToast(`${row.no}번 항목의 ${check.target} 확인완료 로그를 제거했습니다.`);
  }
  row.done = isChecklistRowDone(row);
  row.status = getChecklistDoneState(row);
  renderChecklistGrid();
}

function toggleChecklistNotApplicable(index, checkIndex) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  if (isChecklistCategoryLocked(row.group)) {
    showToast("송부 완료된 질의차수는 수정할 수 없습니다.");
    renderChecklistGrid();
    return;
  }
  const check = row.checks[checkIndex];
  if (!check) return;

  const worker = getCurrentWorkerName();
  const time = getChecklistTimeText();
  const nextNa = !check.na;

  check.na = nextNa;
  if (nextNa) {
    check.done = false;
    check.checkedBy = worker;
    check.checkedAt = time;
  } else {
    check.checkedBy = "";
    check.checkedAt = "";
  }

  row.history = Array.isArray(row.history) ? row.history : [];
  row.history = row.history.filter(h => !(h.target === check.target && (h.action === "확인완료" || h.action === "해당 없음")));
  if (nextNa) {
    row.history.push({ action: "해당 없음", target: check.target, worker, time });
    showToast(`${row.no}번 항목의 ${check.target} 해당 없음 처리가 기록되었습니다.`);
  } else {
    showToast(`${row.no}번 항목의 ${check.target} 해당 없음 처리를 해제했습니다.`);
  }

  row.done = isChecklistRowDone(row);
  row.status = getChecklistDoneState(row);
  renderChecklistGrid();
}


function setChecklistCellFocus(el) {
  currentChecklistFocus = {
    row: Number(el.dataset.row),
    field: el.dataset.field,
    group: checklistRows[Number(el.dataset.row)]?.group || selectedChecklistCategoryFilter || firstCategoryName
  };
}

function focusChecklistCell(rowIndex, field = "trade") {
  const target = document.querySelector(`.excel-editable-cell[data-row="${rowIndex}"][data-field="${field}"]`);
  if (!target) return;
  target.focus();
  const range = document.createRange();
  range.selectNodeContents(target);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

document.addEventListener("keydown", event => {
  const target = event.target;
  if (target?.closest?.("#estimateDbManage, .quote-db-shell, .quote-db-grid-wrap, .quote-db-cell-input, .quote-db-panel")) return;
  const key = String(event.key || "").toLowerCase();

  if (event.ctrlKey && key === "f9") {
    event.preventDefault();
    if (document.getElementById("qcTeamTemplateModal")?.classList.contains("active")) {
      addQcTeamTemplateRowAfterActive();
      return;
    }
    const group = currentChecklistFocus?.group || (selectedChecklistCategoryFilter !== "전체" ? selectedChecklistCategoryFilter : firstCategoryName);
    insertChecklistRowInGroup(group);
    return;
  }

  if (event.ctrlKey && key === "f3") {
    event.preventDefault();
    openChecklistQuickAddModal();
  }
});

function updateChecklistCell(index, key, value) {
  if (!checklistRows[index]) return;
  normalizeChecklistRow(checklistRows[index]);
  if (isChecklistCategoryLocked(checklistRows[index].group)) {
    showToast("송부 완료된 질의차수는 수정할 수 없습니다.");
    renderChecklistGrid();
    return;
  }
  checklistRows[index][key] = key === "group" ? normalizeChecklistGroupName(value) : (key === "no" ? normalizeChecklistNo(value) : String(value).trim());
  if (key === "owner") {
    checklistRows[index].targets = String(value).split(/[,/]/).map(v => v.trim()).filter(Boolean);
    checklistRows[index].checks = [];
    normalizeChecklistRow(checklistRows[index]);
  }
}

function isChecklistRowVisibleForKeyboard(row) {
  normalizeChecklistRow(row);
  const group = normalizeChecklistGroupName(row.group);
  if (collapsedChecklistGroups.has(group)) return false;
  const middle = row.middleCategory || "기타";
  if (collapsedChecklistMiddles.has(getChecklistMiddleCollapseKey(group, middle))) return false;
  const sub = row.subCategory || "";
  if (sub && collapsedChecklistSubs.has(getChecklistSubCollapseKey(group, middle, sub))) return false;
  return true;
}

function getChecklistKeyboardScopeKey(row) {
  normalizeChecklistRow(row);
  const group = normalizeChecklistGroupName(row.group);
  const middle = row.middleCategory || "기타";
  const sub = row.subCategory || "";
  return sub ? `${group}::${middle}::${sub}` : `${group}::${middle}`;
}

function getChecklistKeyboardRows(currentRowIndex) {
  const currentRow = checklistRows[currentRowIndex];
  if (!currentRow) return [];
  const currentScope = getChecklistKeyboardScopeKey(currentRow);
  return getChecklistFilteredRows()
    .filter(({ row }) => isChecklistRowVisibleForKeyboard(row) && getChecklistKeyboardScopeKey(row) === currentScope)
    .sort((a, b) => {
      const ag = checklistCategoryOptions.indexOf(normalizeChecklistGroupName(a.row.group));
      const bg = checklistCategoryOptions.indexOf(normalizeChecklistGroupName(b.row.group));
      const ai = ag < 0 ? 999 : ag;
      const bi = bg < 0 ? 999 : bg;
      if (ai !== bi) return ai - bi;
      const mid = String(a.row.middleCategory || "").localeCompare(String(b.row.middleCategory || ""), "ko", { numeric: true });
      if (mid !== 0) return mid;
      const sub = String(a.row.subCategory || "").localeCompare(String(b.row.subCategory || ""), "ko", { numeric: true });
      if (sub !== 0) return sub;
      return String(a.row.no || "").localeCompare(String(b.row.no || ""), "ko", { numeric: true });
    })
    .map(item => item.realIndex);
}

function moveChecklistCell(event, el) {
  const editableKeys = ["Enter", "ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Tab"];
  if (!editableKeys.includes(event.key) || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;

  const currentRow = Number(el.dataset.row);
  const currentField = el.dataset.field;
  const fields = ["trade", "no", "item", "method", "comment"];
  const fieldIndex = fields.indexOf(currentField);
  if (!Number.isInteger(currentRow) || fieldIndex < 0) return;

  const visibleRows = getChecklistKeyboardRows(currentRow);
  const rowPosition = visibleRows.indexOf(currentRow);
  if (rowPosition < 0) return;

  let targetRow = currentRow;
  let targetField = currentField;

  if (event.key === "Enter" || event.key === "ArrowDown") {
    targetRow = visibleRows[rowPosition + 1] ?? currentRow;
  } else if (event.key === "ArrowUp") {
    targetRow = visibleRows[rowPosition - 1] ?? currentRow;
  } else if (event.key === "ArrowRight" || event.key === "Tab") {
    if (fieldIndex < fields.length - 1) targetField = fields[fieldIndex + 1];
    else {
      targetRow = visibleRows[rowPosition + 1] ?? currentRow;
      targetField = fields[0];
    }
  } else if (event.key === "ArrowLeft") {
    if (fieldIndex > 0) targetField = fields[fieldIndex - 1];
    else {
      targetRow = visibleRows[rowPosition - 1] ?? currentRow;
      targetField = fields[fields.length - 1];
    }
  }

  event.preventDefault();
  updateChecklistCell(Number(el.dataset.row), el.dataset.field, el.innerText);

  const selector = `.excel-editable-cell[data-row="${targetRow}"][data-field="${targetField}"]`;
  const target = document.querySelector(selector);
  if (!target || target === el) return;

  target.focus();
  const range = document.createRange();
  range.selectNodeContents(target);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}


function updateChecklistCheck(index, checked) { if (checklistRows[index]) checklistRows[index].checked = checked; }
function toggleAllChecklistRows(box) { getChecklistFilteredRows().forEach(({ realIndex }) => checklistRows[realIndex].checked = box.checked); renderChecklistGrid(); }
function nextChecklistNo(group = "", middle = "", sub = "") {
  const normalizedGroup = normalizeChecklistGroupName(group || selectedChecklistCategoryFilter || firstCategoryName);
  const scopeMiddle = middle || getChecklistMiddleOptions(normalizedGroup)[0] || "";
  const scopeSub = sub || getChecklistSubOptions(normalizedGroup, scopeMiddle)[0] || "";
  const scopeKey = getChecklistNoScopeKey({ group: normalizedGroup, middleCategory: scopeMiddle, subCategory: scopeSub });
  const nums = checklistRows
    .filter(row => {
      normalizeChecklistClassification(row);
      return getChecklistNoScopeKey(row) === scopeKey;
    })
    .map(row => Number(normalizeChecklistNo(row.no)))
    .filter(Boolean);
  return String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, "0");
}

function renderChecklistCategoryOptions(selectedGroup = "") {
  const select = document.getElementById("checklistModalGroup");
  if (!select) return;
  const current = normalizeChecklistGroupName(selectedGroup);
  select.innerHTML = checklistCategoryOptions.map(category => {
    const disabled = !canUseChecklistCategory(category, current);
    const label = isChecklistCategoryLocked(category) ? `${category} · 송부완료` : category;
    return `<option value="${escapeHtml(category)}" ${category === current ? "selected" : ""} ${disabled ? "disabled" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
  if (current && checklistCategoryOptions.includes(current)) select.value = current;
}

function renderChecklistTargetOptions(selectedTargets = []) {
  const wrap = document.getElementById("checklistTargetChecks");
  if (!wrap) return;
  const group = normalizeChecklistGroupName(document.getElementById("checklistModalGroup")?.value || firstCategoryName);
  const middle = document.getElementById("checklistModalMiddle")?.value || getChecklistMiddleOptions(group)[0] || "";
  const sub = document.getElementById("checklistModalSub")?.value || "";
  const tempRow = { group, middleCategory: middle, subCategory: sub };
  const pool = getChecklistTargetPool(tempRow);
  const selected = selectedTargets.length ? selectedTargets : [getChecklistRouteLabel(tempRow)].filter(Boolean);
  wrap.innerHTML = pool.map(owner => `
    <label class="target-option"><input type="checkbox" value="${escapeHtml(owner)}" ${selected.includes(owner) ? "checked" : ""}> <span>${escapeHtml(owner)}</span></label>
  `).join("");
}

function getSelectedChecklistTargets() {
  return Array.from(document.querySelectorAll('#checklistTargetChecks input[type="checkbox"]:checked')).map(input => input.value);
}


let checklistModalAttachments = [];

function renderChecklistModalAttachmentPreview() {
  const preview = document.getElementById("checklistModalPreview");
  if (!preview) return;
  if (!checklistModalAttachments.length) {
    preview.innerHTML = `<div class="empty-attach-box">첨부된 사진이 없습니다.</div>`;
    return;
  }
  preview.innerHTML = checklistModalAttachments.map((file, idx) => `
    <div class="attach-preview">
      <img src="${file.dataUrl}" alt="${escapeHtml(file.name)}" onclick="openImagePreview('${escapeJs(file.dataUrl)}')">
      <span>${escapeHtml(file.name)}</span>
      <button type="button" class="attach-remove-btn" onclick="removeChecklistModalAttachment(${idx})">제거</button>
    </div>
  `).join("");
}

function previewChecklistModalFiles(input) {
  const files = Array.from(input.files || []).filter(file => file.type.startsWith("image/"));
  if (!files.length) return;
  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      checklistModalAttachments.push({
        name: file.name,
        dataUrl: e.target.result,
        addedBy: getCurrentWorkerName(),
        addedAt: getChecklistTimeText()
      });
      loaded += 1;
      if (loaded === files.length) {
        renderChecklistModalAttachmentPreview();
        input.value = "";
      }
    };
    reader.readAsDataURL(file);
  });
}

function removeChecklistModalAttachment(index) {
  checklistModalAttachments.splice(index, 1);
  renderChecklistModalAttachmentPreview();
}

function openChecklistModal(index = null) {
  renderChecklistTargetOptions();
  const defaultGroup = typeof index === "string" ? normalizeChecklistGroupName(index) : "";
  const editIndexValue = typeof index === "number" ? index : null;
  const isEdit = Number.isInteger(editIndexValue) && checklistRows[editIndexValue];
  const row = isEdit ? normalizeChecklistRow(checklistRows[editIndexValue]) : null;
  if (row && isChecklistCategoryLocked(row.group)) {
    showToast("송부 완료된 질의차수는 수정할 수 없습니다.");
    return;
  }
  setText("checklistModalTitle", isEdit ? "수량산출 체크리스트 수정" : "수량산출 체크리스트 추가");
  const editIndex = document.getElementById("checklistEditIndex");
  if (editIndex) editIndex.value = isEdit ? String(editIndexValue) : "";
  const values = {
    checklistModalGroup: row?.group || defaultGroup || firstCategoryName,
    checklistModalTrade: row?.trade || "",
    checklistModalNo: normalizeChecklistNo(row?.no || nextChecklistNo(row?.group, row?.middleCategory, row?.subCategory)),
    checklistModalItem: row?.item || "",
    checklistModalMethod: row?.method || "",
    checklistModalComment: row?.comment || ""
  };
  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = value;
      el.classList.remove("invalid");
    }
  });
  const selectedGroup = row?.group || defaultGroup || firstCategoryName;
  renderChecklistCategoryOptions(selectedGroup);
  const subEl = document.getElementById("checklistModalSub");
  if (subEl) subEl.dataset.selected = row?.subCategory || "";
  renderChecklistMiddleOptions(row?.middleCategory || "");
  renderChecklistTargetOptions(row ? getChecklistTargets(row) : []);
  document.getElementById("checklistTargetError")?.classList.remove("show");
  checklistModalAttachments = row?.attachments ? [...row.attachments] : [];
  renderChecklistModalAttachmentPreview();
  const fileInput = document.getElementById("checklistModalFiles");
  if (fileInput) fileInput.value = "";
  document.getElementById("checklistItemModal")?.classList.add("active");
}

function closeChecklistModal() {
  document.getElementById("checklistItemModal")?.classList.remove("active");
  checklistModalAttachments = [];
  const preview = document.getElementById("checklistModalPreview");
  if (preview) preview.innerHTML = "";
  const fileInput = document.getElementById("checklistModalFiles");
  if (fileInput) fileInput.value = "";
}

function saveChecklistModal() {
  const requiredIds = ["checklistModalGroup", "checklistModalTrade", "checklistModalItem", "checklistModalMethod"];
  let ok = true;
  requiredIds.forEach(id => {
    const el = document.getElementById(id);
    const valid = !!el?.value.trim();
    el?.classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  const targets = getSelectedChecklistTargets();
  const targetError = document.getElementById("checklistTargetError");
  if (!targets.length) {
    targetError?.classList.add("show");
    ok = false;
  } else {
    targetError?.classList.remove("show");
  }
  if (!ok) return;

  const selectedGroup = normalizeChecklistGroupName(document.getElementById("checklistModalGroup")?.value || "");
  const editIndexRaw = document.getElementById("checklistEditIndex")?.value || "";
  const editIndex = editIndexRaw === "" ? null : Number(editIndexRaw);
  const previous = Number.isInteger(editIndex) ? checklistRows[editIndex] : null;
  const previousGroup = previous ? normalizeChecklistGroupName(previous.group) : "";
  if (!canUseChecklistCategory(selectedGroup, previousGroup)) {
    showToast("이전 질의차수가 송부 완료되어야 다음 차수 작성이 가능하거나, 이미 송부 완료된 차수입니다.");
    return;
  }
  const creator = previous?.creator || getCurrentWorkerName();
  const createdAt = previous?.createdAt || getChecklistTimeText();
  const row = {
    checked: previous?.checked || false,
    done: false,
    checkedBy: "",
    checkedAt: "",
    history: Array.isArray(previous?.history) ? previous.history.filter(h => h.action === "최초작성" || (h.action === "확인완료" && targets.includes(h.target))) : [],
    group: selectedGroup,
    middleCategory: document.getElementById("checklistModalMiddle")?.value || "",
    subCategory: document.getElementById("checklistModalSub")?.value || "",
    trade: document.getElementById("checklistModalTrade").value.trim(),
    no: normalizeChecklistNo(document.getElementById("checklistModalNo").value || nextChecklistNo(selectedGroup, document.getElementById("checklistModalMiddle")?.value || "", document.getElementById("checklistModalSub")?.value || "")),
    item: document.getElementById("checklistModalItem").value.trim(),
    method: document.getElementById("checklistModalMethod").value.trim(),
    owner: targets.join(", "),
    targets,
    manualTargets: true,
    checks: targets.map(target => {
      const old = previous?.checks?.find(c => c.target === target);
      return old ? { ...old } : { target, done: false, checkedBy: "", checkedAt: "" };
    }),
    status: "미확인",
    comment: document.getElementById("checklistModalComment").value.trim(),
    creator: getChecklistCreatorByGroup(selectedGroup),
    createdAt,
    attachments: [...checklistModalAttachments],
    objection: previous?.objection || null,
    objectionFiles: Array.isArray(previous?.objectionFiles) ? previous.objectionFiles : [],
    eliminated: previous?.eliminated || false,
    showObjection: previous?.showObjection || false
  };
  normalizeChecklistRow(row);
  if (Number.isInteger(editIndex) && checklistRows[editIndex]) {
    checklistRows[editIndex] = row;
    renumberChecklistGroup(selectedGroup);
    showToast("체크리스트 항목이 수정되었습니다.");
  } else {
    checklistRows.push(row);
    renumberChecklistGroup(selectedGroup);
    showToast("체크리스트 항목이 추가되었습니다.");
  }
  closeChecklistModal();
  renderChecklistGrid();
}


function getChecklistDefaultGroupForQuickAdd() {
  return currentChecklistFocus?.group || (selectedChecklistCategoryFilter !== "전체" ? selectedChecklistCategoryFilter : firstCategoryName);
}

function ensureChecklistQuickAddModal() {
  let modal = document.getElementById("checklistQuickAddModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "checklistQuickAddModal";
  modal.className = "modal-backdrop checklist-quick-add-backdrop";
  modal.innerHTML = `
    <div class="modal checklist-quick-add-modal" onclick="event.stopPropagation();">
      <div class="modal-head">
        <h2>분류 선택 후 행 추가</h2>
        <button class="close" onclick="closeChecklistQuickAddModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="notice">Ctrl+F3으로 열 수 있습니다. 구분, 중분류, 소분류를 선택한 뒤 해당 분류 안에 새 항목을 추가합니다.</div>
        <div class="form-grid checklist-quick-add-grid">
          <div class="field"><label>구분</label><select id="quickAddChecklistGroup" onchange="refreshChecklistQuickAddMiddleOptions()"></select></div>
          <div class="field"><label>중분류</label><select id="quickAddChecklistMiddle" onchange="refreshChecklistQuickAddSubOptions()"></select></div>
          <div class="field"><label>소분류</label><select id="quickAddChecklistSub"></select></div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-line" onclick="closeChecklistQuickAddModal()">취소</button>
        <button class="btn btn-primary" onclick="saveChecklistQuickAddModal()">해당 분류에 추가</button>
      </div>
    </div>`;
  modal.addEventListener("click", event => {
    if (event.target === modal) closeChecklistQuickAddModal();
  });
  document.body.appendChild(modal);
  return modal;
}

function openChecklistQuickAddModal() {
  const modal = ensureChecklistQuickAddModal();
  const currentGroup = normalizeChecklistGroupName(getChecklistDefaultGroupForQuickAdd());
  const groupSelect = modal.querySelector("#quickAddChecklistGroup");
  if (groupSelect) {
    groupSelect.innerHTML = checklistCategoryOptions.map(group => {
      const locked = isChecklistCategoryLocked(group);
      const selected = group === currentGroup ? "selected" : "";
      const disabled = locked ? "disabled" : "";
      const label = locked ? `${group} · 송부완료` : group;
      return `<option value="${escapeHtml(group)}" ${selected} ${disabled}>${escapeHtml(label)}</option>`;
    }).join("");
    if (checklistCategoryOptions.includes(currentGroup) && !isChecklistCategoryLocked(currentGroup)) groupSelect.value = currentGroup;
  }
  refreshChecklistQuickAddMiddleOptions();
  modal.classList.add("active");
  setTimeout(() => groupSelect?.focus(), 0);
}

function closeChecklistQuickAddModal() {
  document.getElementById("checklistQuickAddModal")?.classList.remove("active");
}

function refreshChecklistQuickAddMiddleOptions() {
  const modal = ensureChecklistQuickAddModal();
  const group = normalizeChecklistGroupName(modal.querySelector("#quickAddChecklistGroup")?.value || firstCategoryName);
  const middleSelect = modal.querySelector("#quickAddChecklistMiddle");
  if (!middleSelect) return;
  const options = getChecklistMiddleOptions(group);
  middleSelect.innerHTML = options.length
    ? options.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")
    : `<option value="">중분류 없음</option>`;
  const focusedRow = checklistRows[Number(currentChecklistFocus?.row)];
  if (focusedRow && normalizeChecklistGroupName(focusedRow.group) === group && options.includes(focusedRow.middleCategory)) {
    middleSelect.value = focusedRow.middleCategory;
  }
  refreshChecklistQuickAddSubOptions();
}

function refreshChecklistQuickAddSubOptions() {
  const modal = ensureChecklistQuickAddModal();
  const group = normalizeChecklistGroupName(modal.querySelector("#quickAddChecklistGroup")?.value || firstCategoryName);
  const middle = modal.querySelector("#quickAddChecklistMiddle")?.value || "";
  const subSelect = modal.querySelector("#quickAddChecklistSub");
  if (!subSelect) return;
  const options = getChecklistSubOptions(group, middle);
  subSelect.innerHTML = options.length
    ? [`<option value="">소분류 없음</option>`, ...options.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)].join("")
    : `<option value="">소분류 없음</option>`;
  const focusedRow = checklistRows[Number(currentChecklistFocus?.row)];
  if (focusedRow && normalizeChecklistGroupName(focusedRow.group) === group && focusedRow.middleCategory === middle && options.includes(focusedRow.subCategory)) {
    subSelect.value = focusedRow.subCategory;
  }
}

function saveChecklistQuickAddModal() {
  const modal = ensureChecklistQuickAddModal();
  const group = normalizeChecklistGroupName(modal.querySelector("#quickAddChecklistGroup")?.value || firstCategoryName);
  const middle = modal.querySelector("#quickAddChecklistMiddle")?.value || "";
  const sub = modal.querySelector("#quickAddChecklistSub")?.value || "";
  if (isChecklistCategoryLocked(group)) {
    showToast("송부 완료된 구분에는 행을 추가할 수 없습니다.");
    return;
  }
  const row = makeBlankChecklistRow(group);
  row.middleCategory = middle;
  row.subCategory = sub;
  row.no = nextChecklistNo(group, middle, sub);
  normalizeChecklistRow(row);

  const sameScopeIndexes = checklistRows.map((item, index) => {
    normalizeChecklistClassification(item);
    return normalizeChecklistGroupName(item.group) === group &&
      (item.middleCategory || "") === middle &&
      (item.subCategory || "") === sub ? index : -1;
  }).filter(index => index >= 0);
  const insertAt = sameScopeIndexes.length ? Math.max(...sameScopeIndexes) + 1 : checklistRows.length;
  checklistRows.splice(insertAt, 0, row);
  renumberChecklistGroup(group);
  selectedChecklistCategoryFilter = selectedChecklistCategoryFilter === "전체" ? "전체" : group;
  collapsedChecklistGroups.delete(group);
  collapsedChecklistMiddles.delete(getChecklistMiddleCollapseKey(group, middle || "기타"));
  if (sub) collapsedChecklistSubs.delete(getChecklistSubCollapseKey(group, middle || "기타", sub));
  closeChecklistQuickAddModal();
  renderChecklistGrid();
  requestAnimationFrame(() => focusChecklistCell(insertAt, "trade"));
  showToast(`${group}${middle ? ` / ${middle}` : ""}${sub ? ` / ${sub}` : ""} 분류에 새 행을 추가했습니다.`);
}

function makeBlankChecklistRow(group) {
  const normalizedGroup = normalizeChecklistGroupName(group || selectedChecklistCategoryFilter || firstCategoryName);
  const middle = getChecklistMiddleOptions(normalizedGroup)[0] || "";
  const sub = getChecklistSubOptions(normalizedGroup, middle)[0] || "";
  const tempRow = { group: normalizedGroup, middleCategory: middle, subCategory: sub };
  const targets = getChecklistTargetsByGroup(normalizedGroup, tempRow) || ["PM"];
  const now = getChecklistTimeText();
  const row = {
    checked: false,
    group: normalizedGroup,
    middleCategory: middle,
    subCategory: sub,
    trade: "",
    no: nextChecklistNo(normalizedGroup, middle, sub),
    item: "",
    method: "",
    owner: targets.join(", "),
    targets: [...targets],
    checks: targets.map(target => ({ target, done: false, na: false, checkedBy: "", checkedAt: "" })),
    creator: getChecklistCreatorByGroup(normalizedGroup),
    createdAt: now,
    comment: "",
    attachments: [],
    history: [{ action: "최초작성", worker: getChecklistCreatorByGroup(normalizedGroup), time: now }]
  };
  normalizeChecklistRow(row);
  return row;
}


function renumberAllChecklistRowsByClassification() {
  const counters = new Map();
  checklistRows.forEach(row => {
    normalizeChecklistClassification(row);
    const scopeKey = getChecklistNoScopeKey(row);
    const count = (counters.get(scopeKey) || 0) + 1;
    counters.set(scopeKey, count);
    row.no = String(count).padStart(3, "0");
  });
}

function renumberChecklistGroup(group) {
  const normalizedGroup = normalizeChecklistGroupName(group);
  const counters = new Map();
  checklistRows.forEach(row => {
    normalizeChecklistClassification(row);
    if (normalizeChecklistGroupName(row.group) !== normalizedGroup) return;
    const scopeKey = getChecklistNoScopeKey(row);
    const count = (counters.get(scopeKey) || 0) + 1;
    counters.set(scopeKey, count);
    row.no = String(count).padStart(3, "0");
  });
}

function insertChecklistRowInGroup(group = "") {
  const focusedIndex = Number(currentChecklistFocus?.row);
  const focusedRow = Number.isInteger(focusedIndex) ? checklistRows[focusedIndex] : null;
  if (focusedRow) normalizeChecklistRow(focusedRow);

  const normalizedGroup = normalizeChecklistGroupName(
    focusedRow?.group || group || currentChecklistFocus?.group || selectedChecklistCategoryFilter || firstCategoryName
  );

  if (isChecklistCategoryLocked(normalizedGroup)) {
    showToast("송부 완료된 질의차수는 행을 추가할 수 없습니다.");
    return;
  }

  const row = makeBlankChecklistRow(normalizedGroup);

  if (focusedRow && normalizeChecklistGroupName(focusedRow.group) === normalizedGroup) {
    row.middleCategory = focusedRow.middleCategory || "";
    row.subCategory = focusedRow.subCategory || "";
  }

  normalizeChecklistRow(row);

  const focusedScopeKey = focusedRow ? getChecklistNoScopeKey(focusedRow) : "";
  const insertAfterFocused = Boolean(
    focusedRow &&
    normalizeChecklistGroupName(focusedRow.group) === normalizedGroup &&
    getChecklistNoScopeKey(row) === focusedScopeKey
  );

  let insertAt = checklistRows.length;
  if (insertAfterFocused) {
    // Ctrl+F9는 현재 선택된 행 바로 아래에 추가한다.
    insertAt = focusedIndex + 1;
  } else {
    // 포커스가 없으면 동일 구분/중분류/소분류 범위의 마지막 행 아래에 추가한다.
    const rowScopeKey = getChecklistNoScopeKey(row);
    const sameScopeIndexes = checklistRows.map((item, index) => {
      normalizeChecklistClassification(item);
      return normalizeChecklistGroupName(item.group) === normalizedGroup && getChecklistNoScopeKey(item) === rowScopeKey ? index : -1;
    }).filter(index => index >= 0);
    if (sameScopeIndexes.length) insertAt = Math.max(...sameScopeIndexes) + 1;
    else {
      const sameGroupIndexes = checklistRows.map((item, index) => normalizeChecklistGroupName(item.group) === normalizedGroup ? index : -1).filter(index => index >= 0);
      if (sameGroupIndexes.length) insertAt = Math.max(...sameGroupIndexes) + 1;
    }
  }

  checklistRows.splice(insertAt, 0, row);
  renumberChecklistGroup(normalizedGroup);
  selectedChecklistCategoryFilter = selectedChecklistCategoryFilter === "전체" ? "전체" : normalizedGroup;
  collapsedChecklistGroups.delete(normalizedGroup);
  if (row.middleCategory) collapsedChecklistMiddles.delete(getChecklistMiddleCollapseKey(normalizedGroup, row.middleCategory));
  if (row.subCategory) collapsedChecklistSubs.delete(getChecklistSubCollapseKey(normalizedGroup, row.middleCategory || "기타", row.subCategory));
  renderChecklistGrid();
  requestAnimationFrame(() => focusChecklistCell(insertAt, currentChecklistFocus?.field || "trade"));
  const scopeLabel = [normalizedGroup, row.middleCategory, row.subCategory].filter(Boolean).join(" / ");
  showToast(`${scopeLabel} 범위에 새 행을 추가했습니다.`);
}

function addChecklistRow() { insertChecklistRowInGroup(selectedChecklistCategoryFilter === "전체" ? firstCategoryName : selectedChecklistCategoryFilter); }
function insertChecklistRowAfter(index) { insertChecklistRowInGroup(checklistRows[index]?.group || firstCategoryName); }
function deleteChecklistRow(index) { 
  if (!checklistRows[index]) return;
  normalizeChecklistRow(checklistRows[index]);
  if (isChecklistCategoryLocked(checklistRows[index].group)) {
    showToast("송부 완료된 질의차수는 삭제할 수 없습니다.");
    return;
  }
  const group = checklistRows[index].group;
  checklistRows.splice(index, 1);
  renumberChecklistGroup(group);
  renderChecklistGrid(); 
}
function deleteCheckedRows() { 
  const before = checklistRows.length; 
  checklistRows = checklistRows.filter(row => {
    normalizeChecklistRow(row);
    return !row.checked || isChecklistCategoryLocked(row.group);
  }); 
  renderChecklistGrid(); 
  showToast(`${before - checklistRows.length}개 행을 삭제했습니다. 송부 완료된 항목은 제외되었습니다.`); 
}
function duplicateCheckedRows() {
  const duplicated = checklistRows.filter(row => { normalizeChecklistRow(row); return row.checked && !isChecklistCategoryLocked(row.group); }).map(row => {
    const copy = JSON.parse(JSON.stringify(row));
    copy.checked = false;
    copy.no = nextChecklistNo(copy.group, copy.middleCategory, copy.subCategory);
    copy.creator = getCurrentWorkerName();
    copy.createdAt = getChecklistTimeText();
    copy.history = [{ action: "최초작성", worker: copy.creator, time: copy.createdAt }];
    copy.checks = (copy.targets || [copy.owner || "QC TEAM"]).map(target => ({ target, done: false, checkedBy: "", checkedAt: "" }));
    copy.done = false;
    copy.status = "미확인";
    return copy;
  });
  checklistRows.push(...duplicated);
  [...new Set(duplicated.map(row => normalizeChecklistGroupName(row.group)))].forEach(renumberChecklistGroup);
  renderChecklistGrid();
  showToast(`${duplicated.length}개 행을 복제했습니다.`);
}
function buildChecklistCsv(rows, fileName) {
  rows.forEach(normalizeChecklistRow);
  const headers = ["구분", "공종", "일련번호", "검토항목", "검토방법", "요청 대상", "체크 상태", "코멘트", "첨부사진수", "이의제기", "소거여부", "최초 작성자", "최초 작성일시", "확인완료 이력", "송부완료여부"];
  const bodyRows = rows.map(r => [
    r.group,
    r.trade,
    r.no,
    r.item,
    r.method,
    getChecklistTargets(r).join(" / "),
    getChecklistDoneState(r),
    r.comment,
    (r.attachments || []).length,
    r.objection?.text || "",
    r.eliminated ? "소거" : "",
    r.creator || "",
    r.createdAt || "",
    (r.history || []).filter(h => h.action === "확인완료").map(h => `${h.target}/${h.worker}/${h.time}`).join(" | "),
    isChecklistCategoryLocked(r.group) ? "송부완료" : ""
  ]);
  const csv = [headers, ...bodyRows].map(row => row.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}


function buildChecklistJsonPayload() {
  renumberAllChecklistRowsByClassification();
  const rows = checklistRows.map((row, index) => {
    normalizeChecklistRow(row);
    return {
      id: row.id || `QC-${String(index + 1).padStart(4, "0")}`,
      group: normalizeChecklistGroupName(row.group),
      middleCategory: row.middleCategory || "",
      subCategory: row.subCategory || "",
      trade: row.trade || "",
      no: normalizeChecklistNo(row.no),
      item: row.item || "",
      method: row.method || "",
      targets: getChecklistTargets(row),
      manualTargets: !!row.manualTargets,
      checks: Array.isArray(row.checks) ? row.checks : [],
      status: getChecklistDoneState(row),
      comment: row.comment || "",
      attachments: Array.isArray(row.attachments) ? row.attachments : [],
      history: Array.isArray(row.history) ? row.history : [],
      objection: row.objection || null,
      objectionFiles: Array.isArray(row.objectionFiles) ? row.objectionFiles : [],
      eliminated: !!row.eliminated,
      showObjection: !!row.showObjection,
      creator: row.creator || "",
      createdAt: row.createdAt || ""
    };
  });
  return {
    schema: "CON-COST_QC_CHECKLIST_DUMMY_DATA",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    rowCount: rows.length,
    categoryOptions: checklistCategoryOptions,
    rows
  };
}

function downloadChecklistJson() {
  const payload = buildChecklistJsonPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `QC_CHECKLIST_DUMMY_DATA_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("현재 체크리스트 데이터를 JSON으로 내보냈습니다.");
}

function downloadChecklistCsv() {
  buildChecklistCsv(checklistRows, "QC_수량산출_체크리스트_전체.csv");
}

function downloadFirstCategoryCsv() {
  const rows = checklistRows.filter(row => normalizeChecklistGroupName(row.group) === firstCategoryName);
  if (!rows.length) {
    showToast("1번 항목에 다운로드할 데이터가 없습니다.");
    return;
  }
  buildChecklistCsv(rows, "프로젝트_수주_시점_PM_작업자_발주처_송부용.csv");
}

function downloadQuestionCategoryCsv(category) {
  category = normalizeChecklistGroupName(category);
  const rows = checklistRows.filter(row => normalizeChecklistGroupName(row.group) === category);
  if (!rows.length) {
    showToast("해당 질의차수에 다운로드할 데이터가 없습니다.");
    return;
  }
  buildChecklistCsv(rows, `${category.replace(/[\\/:*?"<>|]/g, "_")}.csv`);
}

function markQuestionCategorySent(category) {
  category = normalizeChecklistGroupName(category);
  if (!isQuestionCategory(category)) return;
  const rows = checklistRows.filter(row => normalizeChecklistGroupName(row.group) === category);
  if (!rows.length) {
    showToast("송부 완료 처리할 질의사항이 없습니다.");
    return;
  }
  const worker = getCurrentWorkerName();
  const time = getChecklistTimeText();
  checklistSentCategories.add(category);
  rows.forEach(row => {
    normalizeChecklistRow(row);

    // 송부완료로 질의차수가 잠금 처리되면, 해당 차수의 PM 확인 상태를 일괄 완료 처리한다.
    // 화면상 "PM · 미확인"으로 남지 않고 "PM · 확인완료"로 표시되도록 checks/history/status를 함께 동기화한다.
    const pmCheck = Array.isArray(row.checks) ? row.checks.find(check => check.target === "PM") : null;
    if (pmCheck) {
      pmCheck.done = true;
      pmCheck.checkedBy = worker;
      pmCheck.checkedAt = time;
      row.history = row.history.filter(h => !(h.action === "확인완료" && h.target === "PM"));
      row.history.push({ action: "확인완료", target: "PM", worker, time });
    }

    row.done = isChecklistRowDone(row);
    row.status = getChecklistDoneState(row);
    row.history = row.history.filter(h => h.action !== "송부완료");
    row.history.push({ action: "송부완료", worker, time });
  });
  const next = getNextQuestionCategory(category);
  renderChecklistGrid();
  showToast(next ? `${category} 송부 완료. PM 확인완료 처리 후 ${next} 작성이 가능합니다.` : `${category} 송부 완료 및 PM 확인완료 처리되었습니다.`);
}



document.addEventListener("click", event => {
  const btn = event.target?.closest?.("[data-work-main]");
  if (!btn) return;

  const targetPanelId = btn.dataset.workMain || "estimateDbManage";

  if (btn.dataset.pmSection && typeof setPmScheduleSection === "function") {
    setPmScheduleSection(btn.dataset.pmSection);
  }

  switchWorkPanel(targetPanelId);

  // 클릭한 대분류 외의 하위 카테고리는 즉시 접습니다.
  // DB관리 클릭 시 프로젝트 접수 하위 메뉴가 남아 있는 현상을 방지합니다.
  if (typeof syncWorkSideAccordion === "function") {
    syncWorkSideAccordion(targetPanelId);
  }
  if (typeof activateWorkSideSelection === "function") {
    activateWorkSideSelection(targetPanelId);
  }

  if (btn.dataset.pmSection && typeof setPmScheduleSection === "function") {
    setPmScheduleSection(btn.dataset.pmSection);
  }
}, true);
renderChecklistGrid();


// QC 체크리스트 내부 스크롤 제거 보정
function removeInternalChecklistScroll() {
  const selectors = [
    ".work-qc-table-wrap",
    ".qc-review-table-wrap",
    "#qcReviewTableWrap",
    "#workQcPanel .table-wrap",
    "#workQcApproval .table-wrap",
    ".excel-grid-wrap",
    ".checklist-grid-wrap",
    ".grid-scroll",
    ".table-scroll"
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.maxHeight = "none";
      el.style.height = "auto";
      el.style.overflowY = "visible";
    });
  });
}

document.addEventListener("DOMContentLoaded", removeInternalChecklistScroll);
document.addEventListener("DOMContentLoaded", () => setTimeout(ensureChecklistTermDictionaryButton, 0));
window.addEventListener("resize", removeInternalChecklistScroll);


/* =========================================================
   프로젝트 질의응답 관리 휠 스크롤 보정
   - 테이블 영역 위에서 마우스 휠을 움직여도 페이지가 정상적으로 위/아래 이동되도록 처리
   - 대량 행 최적화용 contain/content-visibility가 휠 이벤트 전달을 막는 환경을 보정
   ========================================================= */
function setupChecklistPageWheelBridge() {
  if (window.__checklistPageWheelBridgeReady) return;
  window.__checklistPageWheelBridgeReady = true;

  document.addEventListener("wheel", event => {
    if (document.body.classList.contains("checklist-target-modal-open")) return;
    if (event.target.closest(".modal-backdrop, .target-modal-backdrop, .modal, .people-target-modal-card")) return;

    const workArea = event.target.closest("#qcReview, #workQcPanel, .qc-review-card, .checklist-card, #qcReviewTableWrap, .work-qc-table-wrap, .qc-review-table-wrap");
    if (!workArea) return;

    const scrollable = event.target.closest(".target-selector-list, .people-target-modal-body, .modal-body, textarea, select");
    if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) return;

    const deltaY = event.deltaY || 0;
    const deltaX = event.deltaX || 0;
    if (!deltaY && !deltaX) return;

    event.preventDefault();
    window.scrollBy({ top: deltaY, left: deltaX, behavior: "auto" });
  }, { passive: false, capture: true });
}

setupChecklistPageWheelBridge();


function renderAttachmentCell(row, rowIndex) {
  const attachments = Array.isArray(row.attachments) ? row.attachments : [];
  if (!attachments.length) {
    return `<div class="attachment-cell empty">첨부 없음</div>`;
  }

  return `
    <div class="attachment-cell has-attachment">
      <button type="button" class="attach-count-btn" onclick="openAttachmentGallery(${rowIndex})">${attachments.length}개 첨부</button>
      <div class="attach-thumb-list">
        ${attachments.map((file, fileIndex) => `
          <button type="button" class="attach-thumb" title="${escapeHtml(file.name || "첨부 이미지")}" onclick="openAttachmentImage(${rowIndex}, ${fileIndex})">
            <img src="${escapeHtml(file.dataUrl || file.url || "")}" alt="${escapeHtml(file.name || "첨부 이미지")}">
          </button>
        `).join("")}
      </div>
    </div>
  `;
}



function openAttachmentImage(rowIndex, fileIndex = 0) {
  openChecklistAttachmentImage(rowIndex, fileIndex);
}

function openAttachmentGallery(rowIndex) {
  openChecklistAttachmentGallery(rowIndex);
}

function openAttachmentImageWindow(imageUrl, title = "첨부 이미지") {
  const src = imageUrl || makeAttachmentFallbackImage(title);
  const popup = window.open("", "_blank", "width=1400,height=920,resizable=yes,scrollbars=yes");

  if (!popup) {
    showToast("팝업 차단을 해제해주세요.");
    return null;
  }

  popup.document.open();
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{min-height:100%;background:#0f172a;font-family:"Pretendard","Noto Sans KR",Arial,sans-serif}
        body{display:flex;align-items:center;justify-content:center;padding:24px;overflow:auto}
        .viewer{width:100%;min-height:calc(100vh - 48px);display:flex;align-items:center;justify-content:center}
        img{display:block;max-width:100%;max-height:calc(100vh - 48px);width:auto;height:auto;object-fit:contain;background:#fff;border-radius:14px;box-shadow:0 18px 60px rgba(0,0,0,.45)}
        .title{position:fixed;top:16px;left:20px;right:20px;color:#e5e7eb;font-size:13px;font-weight:800;text-align:center;pointer-events:none}
      </style>
    </head>
    <body>
      <div class="title">${escapeHtml(title)}</div>
      <div class="viewer"><img src="${src}" alt="${escapeHtml(title)}"></div>
    </body>
    </html>
  `);
  popup.document.close();
  return popup;
}


function openAttachmentGalleryByData(rowIndex) {
  openChecklistAttachmentGallery(rowIndex);
}


function makeAttachmentFallbackImage(label = "첨부 이미지") {
  const safeLabel = String(label || "첨부 이미지").replace(/[<>&"]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="620" viewBox="0 0 900 620">
      <rect width="900" height="620" rx="34" fill="#0f172a"/>
      <rect x="54" y="54" width="792" height="512" rx="28" fill="#111827" stroke="#2563eb" stroke-width="10"/>
      <text x="450" y="288" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="800" fill="#ffffff">${safeLabel}</text>
      <text x="450" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#93c5fd">첨부 이미지 미리보기</text>
    </svg>
  `;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}


function getAttachmentImageSource(file) {
  if (!file) return "";
  return file.dataUrl || file.url || file.src || file.preview || file.imageUrl || file.base64 || makeAttachmentFallbackImage(file.name || "첨부 이미지");
}


function openChecklistAttachmentImage(rowIndex, fileIndex = 0) {
  const row = checklistRows[rowIndex];
  if (!row || !Array.isArray(row.attachments) || !row.attachments[fileIndex]) {
    showToast("첨부 이미지를 찾을 수 없습니다.");
    return;
  }

  const file = row.attachments[fileIndex];
  const src = getAttachmentImageSource(file);
  const title = file.name || `${row.trade || "첨부"} 이미지`;
  openAttachmentImageWindow(src, title);
}


function openChecklistAttachmentGallery(rowIndex) {
  const row = checklistRows[rowIndex];
  if (!row || !Array.isArray(row.attachments) || !row.attachments.length) {
    showToast("첨부 이미지가 없습니다.");
    return;
  }

  if (row.attachments.length === 1) {
    openChecklistAttachmentImage(rowIndex, 0);
    return;
  }

  const popup = window.open("", "_blank", "width=1400,height=920,resizable=yes,scrollbars=yes");
  if (!popup) {
    showToast("팝업 차단을 해제해주세요.");
    return;
  }

  const title = `${row.trade || "첨부"} 첨부 이미지`;
  const cards = row.attachments.map((file, index) => {
    const src = getAttachmentImageSource(file);
    const name = escapeHtml(file.name || `첨부 이미지 ${index + 1}`);
    return `
      <figure class="image-card">
        <img src="${src}" alt="${name}">
        <figcaption>${name}</figcaption>
      </figure>
    `;
  }).join("");

  popup.document.open();
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{min-height:100vh;background:#0f172a;color:#fff;font-family:"Pretendard","Noto Sans KR",Arial,sans-serif;padding:28px}
        h1{font-size:22px;margin-bottom:18px;letter-spacing:-.4px}
        .gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:20px}
        .image-card{background:#111827;border:1px solid rgba(148,163,184,.35);border-radius:18px;padding:14px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
        .image-card img{display:block;width:100%;max-height:78vh;object-fit:contain;background:#fff;border-radius:14px}
        figcaption{margin-top:10px;color:#cbd5e1;font-size:13px;font-weight:800;text-align:center}
      </style>
    </head>
    <body>
      <h1>${escapeHtml(title)}</h1>
      <section class="gallery">${cards}</section>
    </body>
    </html>
  `);
  popup.document.close();
}


/* FINAL_ATTACHMENT_IMAGE_OPEN_PATCH */

function makeAttachmentFallbackImage(label = "첨부 이미지") {
  const safeLabel = String(label || "첨부 이미지").replace(/[<>&"]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="620" viewBox="0 0 900 620">
      <rect width="900" height="620" rx="34" fill="#0f172a"/>
      <rect x="54" y="54" width="792" height="512" rx="28" fill="#111827" stroke="#2563eb" stroke-width="10"/>
      <text x="450" y="288" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="800" fill="#ffffff">${safeLabel}</text>
      <text x="450" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#93c5fd">첨부 이미지 미리보기</text>
    </svg>
  `;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function getAttachmentImageSource(file) {
  if (!file) return "";
  return file.dataUrl || file.url || file.src || file.preview || file.imageUrl || file.base64 || makeAttachmentFallbackImage(file.name || "첨부 이미지");
}

function openChecklistAttachmentImage(rowIndex, fileIndex = 0) {
  const row = checklistRows[rowIndex];
  if (!row || !Array.isArray(row.attachments) || !row.attachments[fileIndex]) {
    showToast("첨부 이미지를 찾을 수 없습니다.");
    return;
  }

  const file = row.attachments[fileIndex];
  const src = getAttachmentImageSource(file);
  const title = file.name || `${row.trade || "첨부"} 이미지`;
  openAttachmentImageWindow(src, title);
}

function openChecklistAttachmentGallery(rowIndex) {
  const row = checklistRows[rowIndex];
  if (!row || !Array.isArray(row.attachments) || !row.attachments.length) {
    showToast("첨부 이미지가 없습니다.");
    return;
  }

  if (row.attachments.length === 1) {
    openChecklistAttachmentImage(rowIndex, 0);
    return;
  }

  const popup = window.open("", "_blank", "width=1400,height=920,resizable=yes,scrollbars=yes");
  if (!popup) {
    showToast("팝업 차단을 해제해주세요.");
    return;
  }

  const title = `${row.trade || "첨부"} 첨부 이미지`;
  const cards = row.attachments.map((file, index) => {
    const src = getAttachmentImageSource(file);
    const name = escapeHtml(file.name || `첨부 이미지 ${index + 1}`);
    return `
      <figure class="image-card">
        <img src="${src}" alt="${name}">
        <figcaption>${name}</figcaption>
      </figure>
    `;
  }).join("");

  popup.document.open();
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{min-height:100vh;background:#0f172a;color:#fff;font-family:"Pretendard","Noto Sans KR",Arial,sans-serif;padding:28px}
        h1{font-size:22px;margin-bottom:18px;letter-spacing:-.4px}
        .gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:20px}
        .image-card{background:#111827;border:1px solid rgba(148,163,184,.35);border-radius:18px;padding:14px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
        .image-card img{display:block;width:100%;max-height:78vh;object-fit:contain;background:#fff;border-radius:14px}
        figcaption{margin-top:10px;color:#cbd5e1;font-size:13px;font-weight:800;text-align:center}
      </style>
    </head>
    <body>
      <h1>${escapeHtml(title)}</h1>
      <section class="gallery">${cards}</section>
    </body>
    </html>
  `);
  popup.document.close();
}

function openAttachmentImageWindow(imageUrl, title = "첨부 이미지") {
  const src = imageUrl || makeAttachmentFallbackImage(title);
  const popup = window.open("", "_blank", "width=1400,height=920,resizable=yes,scrollbars=yes");

  if (!popup) {
    showToast("팝업 차단을 해제해주세요.");
    return null;
  }

  popup.document.open();
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{min-height:100%;background:#0f172a;font-family:"Pretendard","Noto Sans KR",Arial,sans-serif}
        body{display:flex;align-items:center;justify-content:center;padding:24px;overflow:auto}
        .viewer{width:100%;min-height:calc(100vh - 48px);display:flex;align-items:center;justify-content:center}
        img{display:block;max-width:100%;max-height:calc(100vh - 48px);width:auto;height:auto;object-fit:contain;background:#fff;border-radius:14px;box-shadow:0 18px 60px rgba(0,0,0,.45)}
        .title{position:fixed;top:16px;left:20px;right:20px;color:#e5e7eb;font-size:13px;font-weight:800;text-align:center;pointer-events:none}
      </style>
    </head>
    <body>
      <div class="title">${escapeHtml(title)}</div>
      <div class="viewer"><img src="${src}" alt="${escapeHtml(title)}"></div>
    </body>
    </html>
  `);
  popup.document.close();
  return popup;
}

function openImagePreview(src, title = "첨부 이미지") {
  openAttachmentImageWindow(src || makeAttachmentFallbackImage(title), title);
}

function openAttachmentGalleryByData(rowIndex) {
  openChecklistAttachmentGallery(rowIndex);
}

function openAttachmentImage(rowIndex, fileIndex = 0) {
  openChecklistAttachmentImage(rowIndex, fileIndex);
}

function openAttachmentGallery(rowIndex) {
  openChecklistAttachmentGallery(rowIndex);
}


function applyChecklistDisplayOverrides() {
  checklistRows.forEach(row => normalizeSpecialChecklistCreator(row));
}

/* =========================================================
   QC팀 전달사항 공통 템플릿 편집 / 프로젝트 불러오기
   ========================================================= */
const QC_TEMPLATE_STORAGE_KEY = "qcTeamCommonTemplateRows";
let qcTeamTemplateRows = [];
let qcTemplateFocusedRowId = null;
let qcTemplateScrollLockY = 0;

function cloneChecklistPlainRow(row) {
  return JSON.parse(JSON.stringify(row || {}));
}

function makeQcTemplateRowFromChecklist(row, index = 0) {
  const normalized = normalizeChecklistRow(cloneChecklistPlainRow(row));
  return {
    id: normalized.templateId || `qctpl_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 7)}`,
    group: "QC팀 전달사항",
    middleCategory: normalized.middleCategory || inferChecklistMiddle(normalized) || "구조팀",
    subCategory: normalized.subCategory || "",
    trade: normalized.trade || "",
    item: normalized.item || "",
    method: normalized.method || "",
    targets: Array.isArray(normalized.targets) ? [...normalized.targets] : getChecklistTargetsByGroup("QC팀 전달사항", normalized),
    comment: normalized.comment || ""
  };
}


function getDefaultStructureQcTeamTemplateRows() {
  const now = "2026-05-08 09:00";
  const rows = [
    {
      subCategory: "QC팀",
      trade: "계약방식",
      item: "프로젝트 업무 특성 파악 (구조선수행, 입찰, 본실행, 설계내역 등)",
      method: "접수자료 확인. (특이사항 작성 후 프로젝트 PM 전달)",
      comment: ""
    },
    {
      subCategory: "QC팀",
      trade: "접수자료",
      item: "입찰 내역서, 산출기준서, 공사 특기사항 접수 파악",
      method: "접수자료 확인. (특이사항 작성 후 프로젝트 PM 전달)",
      comment: ""
    },
    {
      subCategory: "QC팀",
      trade: "도면검토",
      item: "도면 접수 여부 확인",
      method: "도면목록표와 접수 도면상 일치 확인",
      comment: ""
    },
    {
      subCategory: "PM",
      trade: "합벽",
      item: "1. 합벽유무 확인\n2. 합벽구간일 경우 옹벽 및 기둥에 추가이음 발생하는지 확인",
      method: "토목도면 흙막이 or 가시설계획도 확인",
      comment: ""
    },
    {
      subCategory: "PM",
      trade: "끊어치기",
      item: "끊어치기(C.J Jont) 구간 확인",
      method: "발주처 및 건설사에 질의사항 작성 [Zoning 및 분할타설 계획도 요청]",
      comment: ""
    },
    {
      subCategory: "PM",
      trade: "커플러",
      item: "커플러 산출기준 확인",
      method: "건설사별 견적지침서 [별도 표현없을시 담당자에게 확인 후 진행]",
      comment: ""
    },
    {
      subCategory: "PM",
      trade: "철근강도",
      item: "철근 강도에 따른 정착/이음값 오류 확인",
      method: "구조일반사항 및 구조계산서",
      comment: ""
    },
    {
      subCategory: "PM",
      trade: "내진철근",
      item: "내진철근 적용 유무 확인",
      method: "구조일반사항 및 구조계산서 [SD400S, SD500S, SD600S 등의 표현유무]",
      comment: ""
    },
    {
      subCategory: "공통",
      trade: "기준서",
      item: "프로젝트 건설사별 기준서 숙지",
      method: "각 건설사별 기준서 숙지 특이한 내용이 있다면 별도로 체크후 수량산출시 반영",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "기초",
      item: "버림두께 확인",
      method: "건축단면도 기준적용 [미표시 60mm 적용]",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "기초",
      item: "버림면적 대비 기초면적과 크게 차이 없는지 확인",
      method: "\"버림수량/버림두께\"의 면적과 기초 산출의 면적 비교",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "기초",
      item: "우마철근 기준 확인",
      method: "건설사별 견적지침서 적용 [별도 표현없을시 기초주철근 2단계 아래, 최소철근 HD13적용]",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "기초",
      item: "내수압과 독립기초의 바닥 레벨이 같은경우 우마철근 추가분 반영확인",
      method: "내수압과 독립기초의 기초형태일 경우, \"독립두께 - 내수압두께\" 차이만큼의 우마철근 다리보강 추가산출",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "기초",
      item: "독립기초 및 단차구간 첫배움(현재Con'c) 산출기준 확인",
      method: "산출 유무 확인 산출시 타설되는 콘크리트 재료강도 확인 [구체, 무근, C급 Con'c]",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "기초",
      item: "외부계단 및 주출입구 옹벽 및 기둥하부 줄기초 또는 독립기초 도면미표시 임의 산출 적용확인",
      method: "옹벽 또는 기둥 하부에 기초 표현이 없더라도 임의적용하여 산출 [견적조건작성]",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "보",
      item: "각 층별 슬라브 두께별 공제확인",
      method: "산출내역 재 확인",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "보",
      item: "보 연결보에 대한 오류검토",
      method: "산출내용 재 확인",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "보",
      item: "데크+RC슬라브 일경우 경계부에 대한 보 밑면 거푸집 오류검토",
      method: "슬라브 면적 산정 기준 확인 보 밑면 거푸집 유무 검토.",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "보",
      item: "상세도에 보 덧침구간이 없는지 확인",
      method: "구조 및 건축도면 전체적으로 검토 [참상세도 확인]",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "보",
      item: "인방보 산출시 보조근 정착값 누락확인",
      method: "산식 확인 후 보조근 정착 누락시 산식 수정(PM에게 내용 전달)",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "보",
      item: "인방보 산출시 창호 Open 높이값의 오류검토 확인",
      method: "건축도면의 창호평면도와 개구부 OPEN 공제 비교 검토",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "보",
      item: "지중보 산출시 버림(버림내민)산출오류검토 확인",
      method: "보강 인력 재 확인.",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "보",
      item: "산출 완료후 보 배근 재검토",
      method: "배근입력 오류 재 확인.",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "슬라브",
      item: "부호별 데크라인 오류 확인",
      method: "산출완료후 RC 평면자료를 Excel로 변환하여 필터를 사용해 데크부호별 코드입력체크",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "슬라브",
      item: "데크 연결근 및 보강근 산식 재확인.\n(RC 프로그램에 따라 산식 차이 존재)",
      method: "RC 프로그램 산식 확인",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "슬라브",
      item: "데크 슬라브 공제시 하부 보 공제 여부 확인.",
      method: "RC 프로그램 산식 확인",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "슬라브",
      item: "산출 완료후 슬라브 배근 재검토",
      method: "배근입력 오류 재 확인.",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "기둥",
      item: "기초두께 입력시 이음 산출 유무 확인",
      method: "산출식 확인후 기초두께 입력시 주근 이음 산출유무 확인후 산출진행",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "기둥",
      item: "연결기둥 입력시 주근의 이음개소 또는 정착 오류체크",
      method: "산출식 확인후 연결기둥에 대한 산식 이해후 산출진행",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "기둥",
      item: "기둥주근 중간이음과 최상층 HOOK 정착의 누락이 없는지 확인",
      method: "산출 완료 후 기둥 주근의 중간 이음 및 HOOK 정착 누락 중복 여부 확인",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "기둥",
      item: "층고가 높은 건물에 대한 주근 추가이음에 누락이 없는지 확인",
      method: "(층고+기둥이음길이) = 80m 이상시 추가이음 1EA 산출적용",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "기둥",
      item: "원형기둥일경우 원형거푸집 구분확인",
      method: "원형기둥은 거푸집 별도 구분하여 산출적용. 아이템 누락 여부확인.",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "기둥",
      item: "산출 완료후 기둥배근 재검토",
      method: "배근입력 오류 재 확인.",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "옹벽",
      item: "기초두께 입력시 이음의 산출 유무 확인",
      method: "RC 프로그램 산식 확인",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "옹벽",
      item: "옹벽 평면과 아파트Unit 산식을 확인후 산출진행",
      method: "RC 프로그램 산식 확인",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "옹벽",
      item: "옹벽 상부에 슬라브or보 공제값에 오류체크",
      method: "RC 프로그램 산식 확인",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "옹벽",
      item: "산출 완료후 옹벽 배근 재검토",
      method: "배근입력 오류 재 확인.",
      comment: ""
    },
    {
      subCategory: "한국팀",
      trade: "동바리",
      item: "동바리(시스템동바리) 단위를 확인 (m2, m3, 10공m3?)",
      method: "FIN DATA 산출근거 집계표 검토",
      comment: ""
    },
    {
      subCategory: "한국팀",
      trade: "동바리",
      item: "동바리 수량 데크 면적을 제외확인",
      method: "RC DATA [부재/층별집계], FIN DATA [수량] 비교검토",
      comment: ""
    },
    {
      subCategory: "한국팀",
      trade: "동바리",
      item: "동바리 수량 데크+RC보하부 동바리 누락체크",
      method: "RC DATA [부재/층별집계], FIN DATA [수량] 비교검토",
      comment: ""
    },
    {
      subCategory: "한국팀",
      trade: "동바리",
      item: "2중 SLAB 구간 확인 [정화조관리층 ELEV PIT 등 재검토]",
      method: "RC DATA [부재/층별집계], FIN DATA [수량] 비교검토",
      comment: ""
    },
    {
      subCategory: "한국팀",
      trade: "동바리",
      item: "동바리 수량에 계단면적 누락이 없는지 확인",
      method: "RC DATA [부재/층별집계], FIN DATA [수량] 비교검토",
      comment: ""
    },
    {
      subCategory: "한국팀",
      trade: "동바리",
      item: "시스템동바리가 필요구간 재확인 [최상층 계단실]",
      method: "건축단면도 확인후 필요시 시스템동바리 적용",
      comment: ""
    },
    {
      subCategory: "한국팀",
      trade: "동바리",
      item: "시스템동바리가 필요구간 재확인 [기계실 및 Open구간]",
      method: "건축단면도 확인후 필요시 시스템동바리 적용",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "자가검토",
      item: "기초면적 확인",
      method: "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "자가검토",
      item: "독립기초 개소, 줄기초(지중보) 길이확인",
      method: "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "자가검토",
      item: "층별 기둥 개소 확인",
      method: "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "자가검토",
      item: "층별 보 길이 확인",
      method: "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      comment: ""
    },
    {
      subCategory: "수평팀",
      trade: "자가검토",
      item: "층별 슬라브 면적 확인",
      method: "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      comment: ""
    },
    {
      subCategory: "수직팀",
      trade: "자가검토",
      item: "층별 옹벽 평면길이와 CAD 길이가 동일한지 확인",
      method: "[CAD 도면과 RC DATA의 수량 검토 완료시 체크]",
      comment: ""
    },
    {
      subCategory: "PM",
      trade: "콘크리트",
      item: "층별 및 부재별 콘크리트 강도확인",
      method: "자가검토시 층별집계 조회 확인 필수",
      comment: ""
    },
    {
      subCategory: "PM",
      trade: "장비패드",
      item: "장비패드 배근도 유무 확인",
      method: "일반적으로 구조도면에는 표현이 없고 건축참상세도 참고하여 적용",
      comment: ""
    },
    {
      subCategory: "PM",
      trade: "PE필름",
      item: "PE필름 아이템 산출기준 확인",
      method: "건축단면도 기준으로 하며 별도 표현없을시 001'2검을 일반적으로 산출한다",
      comment: ""
    },
    {
      subCategory: "PM",
      trade: "잡석지정",
      item: "파일기초에 잡석표현이 있는지 확인",
      method: "파일기초일경우 잡석지정은 산출제외대상이므로 중복으로 산출하지않는다",
      comment: ""
    }
  ];

  return rows.map((row, index) => ({
    id: `qctpl_structure_${String(index + 1).padStart(3, "0")}`,
    group: "QC팀 전달사항",
    middleCategory: "구조팀",
    subCategory: row.subCategory,
    trade: row.trade,
    no: `QC-S${String(index + 1).padStart(3, "0")}`,
    item: row.item,
    method: row.method,
    owner: "QC TEAM",
    targets: [`구조팀 · ${row.subCategory}`],
    creator: "QC TEAM",
    createdAt: now,
    status: "미확인",
    objectionEnabled: false,
    comment: row.comment,
    attachments: [],
    history: [{ action: "구조팀 QC팀 전달사항 기본자료 등록", worker: "QC TEAM", time: now }]
  }));
}

function applyStructureQcTemplateDefaults(rows = []) {
  const otherRows = rows.filter(row => (row.middleCategory || "") !== "구조팀");
  return [
    ...getDefaultStructureQcTeamTemplateRows().map((row, index) => makeQcTemplateRowFromChecklist(row, index)),
    ...otherRows
  ];
}

function getDefaultQcTeamTemplateRows() {
  const seedRows = Array.isArray(qcTeamTemplateSeedRows) ? qcTeamTemplateSeedRows : [];
  const rows = seedRows.map((row, index) => makeQcTemplateRowFromChecklist(row, index));
  return applyStructureQcTemplateDefaults(rows);
}

function loadQcTeamTemplateRows() {
  if (qcTeamTemplateRows.length) return qcTeamTemplateRows;
  try {
    const saved = JSON.parse(localStorage.getItem(QC_TEMPLATE_STORAGE_KEY) || "[]");
    if (Array.isArray(saved) && saved.length) {
      qcTeamTemplateRows = applyStructureQcTemplateDefaults(saved.map((row, index) => makeQcTemplateRowFromChecklist(row, index)));
      saveQcTeamTemplateRows(false);
      return qcTeamTemplateRows;
    }
  } catch (e) {}
  qcTeamTemplateRows = getDefaultQcTeamTemplateRows();
  saveQcTeamTemplateRows(false);
  return qcTeamTemplateRows;
}

function saveQcTeamTemplateRows(showMessage = true) {
  try {
    localStorage.setItem(QC_TEMPLATE_STORAGE_KEY, JSON.stringify(qcTeamTemplateRows));
  } catch (e) {}
  if (showMessage) showToast("QC팀 전달사항 공통 템플릿을 저장했습니다.");
}

function getQcTemplateSelectedIds() {
  return Array.from(document.querySelectorAll('#qcTemplateBody input[data-qc-template-select]:checked')).map(input => input.value);
}


function lockQcTemplateBackgroundScroll() {
  if (document.body.classList.contains("qc-template-scroll-locked")) return;
  qcTemplateScrollLockY = window.scrollY || document.documentElement.scrollTop || 0;
  document.body.classList.add("qc-template-scroll-locked");
  document.body.style.position = "fixed";
  document.body.style.top = `-${qcTemplateScrollLockY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
}

function unlockQcTemplateBackgroundScroll() {
  if (!document.body.classList.contains("qc-template-scroll-locked")) return;
  document.body.classList.remove("qc-template-scroll-locked");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  window.scrollTo(0, qcTemplateScrollLockY || 0);
}

function setQcTemplateRowFocus(id) {
  qcTemplateFocusedRowId = id || null;
}

function getActiveQcTemplateRowId() {
  const active = document.activeElement;
  const tr = active?.closest?.("#qcTemplateBody tr[data-qc-template-id]");
  return tr?.dataset?.qcTemplateId || qcTemplateFocusedRowId;
}

function addQcTeamTemplateRowAfterActive() {
  const rows = loadQcTeamTemplateRows();
  const activeId = getActiveQcTemplateRowId();
  const activeIndex = rows.findIndex(row => row.id === activeId);
  const baseRow = activeIndex >= 0 ? rows[activeIndex] : null;
  const filterMid = document.getElementById("qcTemplateMiddleFilter")?.value || "구조팀";
  const middle = baseRow?.middleCategory || (filterMid === "전체" ? "구조팀" : filterMid);
  const subOptions = getChecklistSubOptions("QC팀 전달사항", middle);
  const filterSub = document.getElementById("qcTemplateSubFilter")?.value || "전체";
  const sub = baseRow?.subCategory || (filterSub !== "전체" && subOptions.includes(filterSub) ? filterSub : (subOptions[0] || ""));
  const newRow = {
    id: `qctpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    group: "QC팀 전달사항",
    middleCategory: middle,
    subCategory: sub,
    trade: "",
    item: "",
    method: "",
    targets: sub ? [`${middle} · ${sub}`] : [middle],
    comment: ""
  };
  const insertIndex = activeIndex >= 0 ? activeIndex + 1 : rows.length;
  rows.splice(insertIndex, 0, newRow);
  qcTemplateFocusedRowId = newRow.id;
  renderQcTeamTemplateModal();
  requestAnimationFrame(() => {
    const input = document.querySelector(`#qcTemplateBody tr[data-qc-template-id="${CSS.escape(newRow.id)}"] input[data-qc-template-field="trade"]`);
    input?.focus();
  });
}

function handleQcTemplateModalWheel(event) {
  const modal = document.getElementById("qcTeamTemplateModal");
  if (!modal?.classList.contains("active")) return;

  const modalBox = modal.querySelector(".qc-template-modal");
  if (!modalBox?.contains(event.target)) {
    event.preventDefault();
    return;
  }

  if (event.target.closest("textarea, select")) return;

  const scrollCandidates = Array.from(
    event.target.closest(".qc-template-table-wrap, .qc-template-body-wrap")
      ? [event.target.closest(".qc-template-table-wrap, .qc-template-body-wrap"), event.target.closest(".qc-template-body-wrap")]
      : [event.target.closest(".qc-template-body-wrap")]
  ).filter(Boolean);

  const wrap = scrollCandidates.find(el => el.scrollHeight > el.clientHeight + 1);
  if (!wrap) {
    event.preventDefault();
    return;
  }

  const delta = event.deltaY || 0;
  const atTop = wrap.scrollTop <= 0;
  const atBottom = wrap.scrollTop + wrap.clientHeight >= wrap.scrollHeight - 1;
  if ((delta < 0 && atTop) || (delta > 0 && atBottom)) event.preventDefault();
}

document.addEventListener("wheel", handleQcTemplateModalWheel, { passive: false, capture: true });

function openQcTeamTemplateModal() {
  loadQcTeamTemplateRows();
  let modal = document.getElementById("qcTeamTemplateModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "qcTeamTemplateModal";
    modal.className = "modal-backdrop qc-template-backdrop";
    modal.onclick = closeQcTeamTemplateModal;
    modal.innerHTML = `
      <div class="modal qc-template-modal" onclick="event.stopPropagation();">
        <div class="modal-head qc-template-head">
          <div>
            <h2>QC팀 전달사항 편집하기</h2>
            <p>모든 프로젝트에 공통으로 사용할 QC팀 전달사항을 저장하고, 선택한 항목을 현재 프로젝트로 불러옵니다.</p>
          </div>
          <button class="close" onclick="closeQcTeamTemplateModal()">×</button>
        </div>
        <div class="modal-body qc-template-body-wrap">
          <div class="qc-template-toolbar">
            <div class="qc-template-select-tools">
              <button type="button" class="btn btn-line" onclick="toggleAllQcTemplateRows(true)">전체 선택</button>
              <button type="button" class="btn btn-line" onclick="toggleAllQcTemplateRows(false)">전체 해제</button>
              <button type="button" class="btn btn-line" onclick="selectQcTemplateByCurrentCategory()">현재 중분류/소분류 묶음 선택</button>
            </div>
            <div class="qc-template-edit-tools">
              <button type="button" class="btn btn-line" onclick="addQcTeamTemplateRow()">+ 내용 추가</button>
              <button type="button" class="btn btn-danger" onclick="deleteSelectedQcTeamTemplateRows()">선택 삭제</button>
              <button type="button" class="btn btn-primary" onclick="saveQcTeamTemplateRows(true); renderQcTeamTemplateModal();">편집 내용 저장</button>
            </div>
          </div>
          <div class="qc-template-filter-row">
            <label>중분류<select id="qcTemplateMiddleFilter" onchange="renderQcTeamTemplateModal()"></select></label>
            <label>소분류<select id="qcTemplateSubFilter" onchange="renderQcTeamTemplateModal()"></select></label>
            <label>검색<input id="qcTemplateSearch" oninput="renderQcTeamTemplateModal()" placeholder="공종, 검토항목, 방법 검색"></label>
          </div>
          <div class="qc-template-table-wrap">
            <table class="qc-template-table">
              <thead><tr><th><input type="checkbox" onchange="toggleVisibleQcTemplateRows(this.checked)"></th><th>중분류</th><th>소분류</th><th>공종</th><th>검토항목</th><th>검토방법</th><th>코멘트</th></tr></thead>
              <tbody id="qcTemplateBody"></tbody>
            </table>
          </div>
        </div>
        <div class="modal-foot qc-template-foot">
          <span id="qcTemplateImportGuide">선택 항목을 현재 프로젝트에 불러옵니다.</span>
          <button type="button" class="btn btn-line" onclick="closeQcTeamTemplateModal()">닫기</button>
          <button type="button" class="btn btn-primary" onclick="importSelectedQcTeamTemplateRows()">선택 자료 불러오기</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  modal.classList.add("active");
  lockQcTemplateBackgroundScroll();
  renderQcTeamTemplateModal();
}

function closeQcTeamTemplateModal() {
  document.getElementById("qcTeamTemplateModal")?.classList.remove("active");
  unlockQcTemplateBackgroundScroll();
}

function renderQcTemplateFilterOptions() {
  const middleSelect = document.getElementById("qcTemplateMiddleFilter");
  const subSelect = document.getElementById("qcTemplateSubFilter");
  if (!middleSelect || !subSelect) return;
  const prevMiddle = middleSelect.value || "전체";
  const prevSub = subSelect.value || "전체";
  const mids = ["전체", ...getChecklistMiddleOptions("QC팀 전달사항")];
  middleSelect.innerHTML = mids.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  middleSelect.value = mids.includes(prevMiddle) ? prevMiddle : "전체";
  const subPool = new Set();
  const targetMids = middleSelect.value === "전체" ? getChecklistMiddleOptions("QC팀 전달사항") : [middleSelect.value];
  targetMids.forEach(mid => getChecklistSubOptions("QC팀 전달사항", mid).forEach(sub => subPool.add(sub)));
  const subs = ["전체", ...Array.from(subPool)];
  subSelect.innerHTML = subs.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  subSelect.value = subs.includes(prevSub) ? prevSub : "전체";
}

function getFilteredQcTemplateRows() {
  const mid = document.getElementById("qcTemplateMiddleFilter")?.value || "전체";
  const sub = document.getElementById("qcTemplateSubFilter")?.value || "전체";
  const search = (document.getElementById("qcTemplateSearch")?.value || "").trim().toLowerCase();
  return loadQcTeamTemplateRows().filter(row => {
    const midOk = mid === "전체" || row.middleCategory === mid;
    const subOk = sub === "전체" || (row.subCategory || "") === sub;
    const text = `${row.middleCategory || ""} ${row.subCategory || ""} ${row.trade || ""} ${row.item || ""} ${row.method || ""} ${row.comment || ""}`.toLowerCase();
    return midOk && subOk && (!search || text.includes(search));
  });
}

function renderQcTeamTemplateModal() {
  const body = document.getElementById("qcTemplateBody");
  if (!body) return;
  const selectedIds = new Set(getQcTemplateSelectedIds());
  renderQcTemplateFilterOptions();
  const rows = getFilteredQcTemplateRows();
  body.innerHTML = rows.length ? rows.map(row => {
    const subOptions = getChecklistSubOptions("QC팀 전달사항", row.middleCategory || "");
    return `
      <tr data-qc-template-id="${escapeHtml(row.id)}" onclick="setQcTemplateRowFocus('${escapeJs(row.id)}')">
        <td><input type="checkbox" data-qc-template-select value="${escapeHtml(row.id)}" ${selectedIds.has(row.id) ? "checked" : ""} onfocus="setQcTemplateRowFocus('${escapeJs(row.id)}')"></td>
        <td><select onfocus="setQcTemplateRowFocus('${escapeJs(row.id)}')" onchange="updateQcTeamTemplateRow('${escapeJs(row.id)}', 'middleCategory', this.value)">${getChecklistMiddleOptions("QC팀 전달사항").map(mid => `<option value="${escapeHtml(mid)}" ${mid === row.middleCategory ? "selected" : ""}>${escapeHtml(mid)}</option>`).join("")}</select></td>
        <td><select onfocus="setQcTemplateRowFocus('${escapeJs(row.id)}')" onchange="updateQcTeamTemplateRow('${escapeJs(row.id)}', 'subCategory', this.value)"><option value="">소분류 없음</option>${subOptions.map(sub => `<option value="${escapeHtml(sub)}" ${sub === row.subCategory ? "selected" : ""}>${escapeHtml(sub)}</option>`).join("")}</select></td>
        <td><input data-qc-template-field="trade" value="${escapeHtml(row.trade || "")}" onfocus="setQcTemplateRowFocus('${escapeJs(row.id)}')" oninput="updateQcTeamTemplateRow('${escapeJs(row.id)}', 'trade', this.value)"></td>
        <td><textarea rows="2" onfocus="setQcTemplateRowFocus('${escapeJs(row.id)}')" oninput="updateQcTeamTemplateRow('${escapeJs(row.id)}', 'item', this.value)">${escapeHtml(row.item || "")}</textarea></td>
        <td><textarea rows="2" onfocus="setQcTemplateRowFocus('${escapeJs(row.id)}')" oninput="updateQcTeamTemplateRow('${escapeJs(row.id)}', 'method', this.value)">${escapeHtml(row.method || "")}</textarea></td>
        <td><textarea rows="2" onfocus="setQcTemplateRowFocus('${escapeJs(row.id)}')" oninput="updateQcTeamTemplateRow('${escapeJs(row.id)}', 'comment', this.value)">${escapeHtml(row.comment || "")}</textarea></td>
      </tr>`;
  }).join("") : `<tr><td colspan="7" class="qc-template-empty">조건에 맞는 저장 자료가 없습니다.</td></tr>`;
  const guide = document.getElementById("qcTemplateImportGuide");
  if (guide) guide.textContent = `현재 표시 ${rows.length}건 / 전체 저장 ${qcTeamTemplateRows.length}건`;
}

function updateQcTeamTemplateRow(id, key, value) {
  const row = loadQcTeamTemplateRows().find(item => item.id === id);
  if (!row) return;
  row[key] = value;
  if (key === "middleCategory") {
    const subOptions = getChecklistSubOptions("QC팀 전달사항", value);
    if (!subOptions.includes(row.subCategory)) row.subCategory = subOptions[0] || "";
    row.targets = row.subCategory ? [`${value} · ${row.subCategory}`] : [value];
    renderQcTeamTemplateModal();
  }
  if (key === "subCategory") row.targets = value ? [`${row.middleCategory} · ${value}`] : [row.middleCategory];
}

function addQcTeamTemplateRow() {
  const mid = document.getElementById("qcTemplateMiddleFilter")?.value || "구조팀";
  const middle = mid === "전체" ? "구조팀" : mid;
  const subOptions = getChecklistSubOptions("QC팀 전달사항", middle);
  const sub = subOptions[0] || "";
  qcTeamTemplateRows.push({
    id: `qctpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    group: "QC팀 전달사항",
    middleCategory: middle,
    subCategory: sub,
    trade: "",
    item: "",
    method: "",
    targets: sub ? [`${middle} · ${sub}`] : [middle],
    comment: ""
  });
  renderQcTeamTemplateModal();
}

function deleteSelectedQcTeamTemplateRows() {
  const ids = new Set(getQcTemplateSelectedIds());
  if (!ids.size) {
    showToast("삭제할 QC팀 전달사항을 선택해 주세요.");
    return;
  }
  qcTeamTemplateRows = loadQcTeamTemplateRows().filter(row => !ids.has(row.id));
  saveQcTeamTemplateRows(false);
  renderQcTeamTemplateModal();
  showToast(`${ids.size}건을 삭제했습니다.`);
}

function toggleVisibleQcTemplateRows(checked) {
  document.querySelectorAll('#qcTemplateBody input[data-qc-template-select]').forEach(input => input.checked = checked);
}

function toggleAllQcTemplateRows(checked) {
  document.querySelectorAll('#qcTeamTemplateModal input[data-qc-template-select]').forEach(input => input.checked = checked);
}

function selectQcTemplateByCurrentCategory() {
  const mid = document.getElementById("qcTemplateMiddleFilter")?.value || "전체";
  const sub = document.getElementById("qcTemplateSubFilter")?.value || "전체";
  if (mid === "전체" && sub === "전체") {
    toggleVisibleQcTemplateRows(true);
    return;
  }
  document.querySelectorAll('#qcTemplateBody tr[data-qc-template-id]').forEach(tr => {
    const row = qcTeamTemplateRows.find(item => item.id === tr.dataset.qcTemplateId);
    const input = tr.querySelector('input[data-qc-template-select]');
    if (!row || !input) return;
    const midOk = mid === "전체" || row.middleCategory === mid;
    const subOk = sub === "전체" || (row.subCategory || "") === sub;
    input.checked = midOk && subOk;
  });
}

function importSelectedQcTeamTemplateRows() {
  saveQcTeamTemplateRows(false);
  const ids = new Set(getQcTemplateSelectedIds());
  if (!ids.size) {
    showToast("불러올 QC팀 전달사항을 선택해 주세요.");
    return;
  }
  const project = (document.getElementById("checklistProject")?.value || "ㅇㅇ시설 신축공사").trim() || "ㅇㅇ시설 신축공사";
  const selectedRows = loadQcTeamTemplateRows().filter(row => ids.has(row.id));
  selectedRows.forEach(template => {
    const middle = template.middleCategory || "구조팀";
    const sub = template.subCategory || "";
    const newRow = normalizeChecklistRow({
      group: "QC팀 전달사항",
      middleCategory: middle,
      subCategory: sub,
      project,
      trade: template.trade || "공통",
      no: nextChecklistNo("QC팀 전달사항", middle, sub),
      item: template.item || "",
      method: template.method || "",
      targets: template.targets?.length ? [...template.targets] : (sub ? [`${middle} · ${sub}`] : [middle]),
      manualTargets: false,
      done: false,
      checks: [],
      checked: false,
      creator: "QC TEAM",
      createdAt: getChecklistTimeText(),
      status: "미확인",
      objectionEnabled: false,
      comment: template.comment || "",
      attachments: [],
      history: [{ action: "QC팀 공통 전달사항 불러오기", worker: getCurrentWorkerName(), time: getChecklistTimeText() }]
    });
    checklistRows.push(newRow);
  });
  // QC팀 전달사항을 불러온 뒤에도 목록 기본 필터는 항상 전체보기로 유지합니다.
  // 특정 구분만 보고 싶은 경우 사용자가 구분 필터에서 직접 선택합니다.
  selectedChecklistCategoryFilter = "전체";
  checklistCategoryPanelOpen = true;
  collapseChecklistVisibleGroupsOnly();
  closeQcTeamTemplateModal();
  renderChecklistCategoryButtons();
  renderChecklistGrid();
  showToast(`${selectedRows.length}건을 현재 프로젝트에 불러왔습니다. 전체보기 기준으로 표시합니다.`);
}


document.addEventListener("DOMContentLoaded", () => {
  if (typeof bootEstimateDbDefaultScreen === "function") setTimeout(bootEstimateDbDefaultScreen, 0);
});

/* =========================================================
   2026-05-28 프로젝트 질의응답관리 프로젝트 리스트 연계/가독성 패치
   - 프로젝트 리스트의 프로젝트 NO/프로젝트명을 질의응답 필터 기준으로 사용
   - 프로젝트별 행 분리 기반 마련(pjNo/projectNo 필드 지원)
   - 카테고리 버튼을 핵심 단계형 칩으로 정리
   ========================================================= */
let checklistLinkedProjectNo = "";
function checklistLinkText(value) { return String(value ?? "").replace(/\s+/g, " ").trim(); }
function checklistProjectItems() {
  if (typeof projectReceiveGetCanonicalListItems === "function") return projectReceiveGetCanonicalListItems();
  if (typeof getProjectReceiveListItems === "function") return getProjectReceiveListItems();
  return [];
}
function checklistProjectLabel(data = {}) {
  return [data.projectNo, data.projectName || data.name, data.client].filter(Boolean).join(" · ");
}
function checklistFindProjectByInput(value = "") {
  const text = checklistLinkText(value);
  if (!text) return null;
  return checklistProjectItems().map(item => item.data || item).find(data => {
    const no = checklistLinkText(data.projectNo || data.pjNo);
    const name = checklistLinkText(data.projectName || data.name);
    return text === no || text.includes(no) || text.includes(name) || name.includes(text);
  }) || null;
}
function refreshChecklistProjectOptions() {
  const list = document.getElementById("checklistProjectList");
  if (!list) return;
  const items = checklistProjectItems().map(item => item.data || item).filter(data => data.projectName || data.projectNo);
  list.innerHTML = items.map(data => `<option value="${escapeHtml(checklistProjectLabel(data))}"></option>`).join("");
}
function updateChecklistLinkedProjectContext() {
  refreshChecklistProjectOptions();
  const input = document.getElementById("checklistProject");
  const data = checklistFindProjectByInput(input?.value || "");
  checklistLinkedProjectNo = checklistLinkText(data?.projectNo || "");
  let panel = document.getElementById("checklistLinkedProjectContext");
  const filter = document.getElementById("checklistCategoryFilter");
  if (!panel && filter?.parentElement) {
    panel = document.createElement("div");
    panel.id = "checklistLinkedProjectContext";
    panel.className = "checklist-project-context";
    filter.parentElement.insertBefore(panel, filter);
  }
  if (panel) {
    panel.innerHTML = data ? `
      <div><strong>프로젝트 연결</strong><span>${escapeHtml(data.projectNo || "NO 미입력")}</span><b>${escapeHtml(data.projectName || "프로젝트명 미입력")}</b><em>${escapeHtml(data.client || "")}</em></div>
      <button type="button" class="btn btn-line btn-sm" onclick="setChecklistCategoryFilter('전체')">전체 단계</button>
      <button type="button" class="btn btn-line btn-sm" onclick="setChecklistCategoryFilter('프로젝트 초기')">초기</button>
      <button type="button" class="btn btn-line btn-sm" onclick="setChecklistCategoryFilter('PM 전달사항')">PM</button>
      <button type="button" class="btn btn-line btn-sm" onclick="setChecklistCategoryFilter('질의사항(N차)')">질의</button>
      <button type="button" class="btn btn-line btn-sm" onclick="setChecklistCategoryFilter('최종자료 검토사항')">최종</button>
    ` : `<div><strong>프로젝트 연결</strong><span>프로젝트 리스트에서 프로젝트를 선택하면 PJ NO 기준으로 질의응답을 분리합니다.</span></div>`;
  }
}
const baseChecklistRenderSignature = typeof getChecklistRenderSignature === "function" ? getChecklistRenderSignature : null;
getChecklistRenderSignature = function checklistRenderSignatureWithProjectNo() {
  updateChecklistLinkedProjectContext();
  const base = baseChecklistRenderSignature ? baseChecklistRenderSignature() : "";
  return `${base}||${checklistLinkedProjectNo}`;
};
const baseGetChecklistFilteredRows = typeof getChecklistFilteredRows === "function" ? getChecklistFilteredRows : null;
getChecklistFilteredRows = function checklistFilteredRowsByProjectNo() {
  updateChecklistLinkedProjectContext();
  const rows = baseGetChecklistFilteredRows ? baseGetChecklistFilteredRows() : checklistRows.map((row, realIndex) => ({ row, realIndex }));
  if (!checklistLinkedProjectNo) return rows;
  return rows.filter(({ row }) => {
    const rowNo = checklistLinkText(row.pjNo || row.projectNo || row.linkedProjectNo);
    return !rowNo || rowNo === checklistLinkedProjectNo;
  });
};
const baseNormalizeChecklistRowForProject = typeof normalizeChecklistRow === "function" ? normalizeChecklistRow : null;
normalizeChecklistRow = function normalizeChecklistRowWithProject(row = {}) {
  if (baseNormalizeChecklistRowForProject) baseNormalizeChecklistRowForProject(row);
  if (!row.projectNo && row.pjNo) row.projectNo = row.pjNo;
  return row;
};
const baseUpdateChecklistCellForProject = typeof updateChecklistCell === "function" ? updateChecklistCell : null;
updateChecklistCell = function updateChecklistCellWithProject(realIndex, field, value) {
  const row = checklistRows[realIndex];
  if (row && checklistLinkedProjectNo && !row.projectNo && normalizeChecklistGroupName(row.group) !== "QC팀 전달사항") {
    row.projectNo = checklistLinkedProjectNo;
    row.linkedProjectNo = checklistLinkedProjectNo;
  }
  return baseUpdateChecklistCellForProject ? baseUpdateChecklistCellForProject(realIndex, field, value) : undefined;
};
setTimeout(() => {
  refreshChecklistProjectOptions();
  const input = document.getElementById("checklistProject");
  if (input) input.addEventListener("change", () => { updateChecklistLinkedProjectContext(); scheduleChecklistGridRender(0); });
  updateChecklistLinkedProjectContext();
}, 0);

/* =========================================================
   2026-05-28 질의응답 프로젝트 연결 안정화 패치
   - 프로젝트 리스트의 receiveId/PJ NO 기준으로 질의응답 행 분리
   - QC팀 전달사항만 공통행 허용, 그 외 미연결 행은 프로젝트 선택 시 숨김
   - 행 추가/복제 시 현재 선택 프로젝트 키를 즉시 부여
   - 질의사항(N차) 버튼은 Z1~Z7/질의사항 전체를 묶어 필터링
   ========================================================= */
(function installChecklistStableProjectLinkPatch(){
  function txt(v){ return String(v ?? '').replace(/\s+/g, ' ').trim(); }
  function projectKey(data = {}){
    if (typeof projectReceiveLinkKey === 'function') return projectReceiveLinkKey(data);
    const receiveId = txt(data.receiveId || data.internalReceiveId || data.linkedReceiveId);
    if (receiveId) return `RCV:${receiveId}`;
    const no = txt(data.projectNo || data.pjNo);
    if (no) return `NO:${no}`;
    return '';
  }
  function rowKey(row = {}){ return txt(row.receiveId || row.linkedReceiveId || row.projectLinkKey || row.pjNo || row.projectNo || row.linkedProjectNo); }
  function isQcCommon(row = {}){ return normalizeChecklistGroupName(row.group) === 'QC팀 전달사항' && !row.projectNo && !row.receiveId && !row.projectLinkKey; }
  function applyProjectToRow(row = {}){
    if (!row || !checklistLinkedProjectNo) return row;
    if (normalizeChecklistGroupName(row.group) === 'QC팀 전달사항') return row;
    if (!row.projectLinkKey && !row.receiveId && !row.projectNo) {
      row.projectLinkKey = checklistLinkedProjectNo;
      row.linkedReceiveId = checklistLinkedProjectNo;
      row.linkedProjectNo = checklistLinkedProjectNo;
    }
    return row;
  }
  checklistFindProjectByInput = function checklistFindProjectByInputStable(value = ''){
    const text = txt(value);
    if (!text) return null;
    return checklistProjectItems().map(item => item.data || item).find(data => {
      const key = projectKey(data);
      const no = txt(data.projectNo || data.pjNo);
      const receiveId = txt(data.receiveId || data.internalReceiveId);
      const name = txt(data.projectName || data.name);
      return text === key || text === no || text === receiveId || text.includes(no) || text.includes(receiveId) || (name && (text.includes(name) || name.includes(text)));
    }) || null;
  };
  updateChecklistLinkedProjectContext = function updateChecklistLinkedProjectContextStable(){
    refreshChecklistProjectOptions?.();
    const input = document.getElementById('checklistProject');
    const data = checklistFindProjectByInput(input?.value || '');
    checklistLinkedProjectNo = data ? projectKey(data) : '';
    let panel = document.getElementById('checklistLinkedProjectContext');
    const filter = document.getElementById('checklistCategoryFilter');
    if (!panel && filter?.parentElement) {
      panel = document.createElement('div');
      panel.id = 'checklistLinkedProjectContext';
      panel.className = 'checklist-project-context';
      filter.parentElement.insertBefore(panel, filter);
    }
    if (panel) {
      panel.innerHTML = data ? `
        <div><strong>프로젝트 연결</strong><span>${escapeHtml(data.projectNo || data.receiveId || 'NO 미입력')}</span><b>${escapeHtml(data.projectName || '프로젝트명 미입력')}</b><em>${escapeHtml(data.client || '')}</em></div>
        <button type="button" class="btn btn-line btn-sm" onclick="setChecklistCategoryFilter('전체')">전체</button>
        <button type="button" class="btn btn-line btn-sm" onclick="setChecklistCategoryFilter('프로젝트 초기')">초기</button>
        <button type="button" class="btn btn-line btn-sm" onclick="setChecklistCategoryFilter('PM 전달사항')">PM</button>
        <button type="button" class="btn btn-line btn-sm" onclick="setChecklistCategoryFilter('질의사항(N차)')">질의 N차</button>
        <button type="button" class="btn btn-line btn-sm" onclick="setChecklistCategoryFilter('최종자료 검토사항')">최종</button>
      ` : `<div><strong>프로젝트 연결</strong><span>프로젝트 리스트의 프로젝트를 선택하면 receiveId/PJ NO 기준으로 질의응답을 분리합니다.</span></div>`;
    }
  };
  window.updateChecklistLinkedProjectContext = updateChecklistLinkedProjectContext;
  const baseFiltered = typeof getChecklistFilteredRows === 'function' ? getChecklistFilteredRows : null;
  getChecklistFilteredRows = function checklistFilteredRowsByStableProject(){
    updateChecklistLinkedProjectContext?.();
    const rows = baseFiltered ? baseFiltered() : checklistRows.map((row, realIndex) => ({ row, realIndex }));
    const isQuestionBundle = selectedChecklistCategoryFilter === '질의사항(N차)';
    return rows.filter(({ row }) => {
      const group = normalizeChecklistGroupName(row.group);
      if (isQuestionBundle && !/질의사항|Z\d+/i.test(group)) return false;
      if (!checklistLinkedProjectNo) return true;
      if (isChecklistSharedSeedRow(row) || isQcCommon(row)) return true;
      const key = rowKey(row);
      return key === checklistLinkedProjectNo;
    });
  };
  window.getChecklistFilteredRows = getChecklistFilteredRows;
  const baseInsert = typeof insertChecklistRowInGroup === 'function' ? insertChecklistRowInGroup : null;
  insertChecklistRowInGroup = function insertChecklistRowInGroupWithProject(group = ''){
    const before = checklistRows.length;
    const result = baseInsert ? baseInsert(group) : undefined;
    if (checklistRows.length > before) {
      const inserted = checklistRows.find((row, idx) => idx >= before && row) || checklistRows[before];
      applyProjectToRow(inserted);
      renderChecklistGrid?.();
    }
    return result;
  };
  window.insertChecklistRowInGroup = insertChecklistRowInGroup;
  const baseUpdate = typeof updateChecklistCell === 'function' ? updateChecklistCell : null;
  updateChecklistCell = function updateChecklistCellWithStableProject(realIndex, field, value){
    applyProjectToRow(checklistRows[realIndex]);
    return baseUpdate ? baseUpdate(realIndex, field, value) : undefined;
  };
  window.updateChecklistCell = updateChecklistCell;
  const baseDuplicate = typeof duplicateCheckedRows === 'function' ? duplicateCheckedRows : null;
  duplicateCheckedRows = function duplicateCheckedRowsWithProject(){
    const before = checklistRows.length;
    const result = baseDuplicate ? baseDuplicate() : undefined;
    checklistRows.slice(before).forEach(applyProjectToRow);
    renderChecklistGrid?.();
    return result;
  };
  window.duplicateCheckedRows = duplicateCheckedRows;
})();

/* 2026-06-16 QC review central project sync */
(function installChecklistCentralProjectSync(){
  let lastSyncSignature = "";
  let syncTimer = 0;

  function syncText(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
  }

  function selectedProjectData() {
    const value = document.getElementById("checklistProject")?.value || "";
    try {
      if (typeof qcFindProjectByText === "function") return qcFindProjectByText(value);
    } catch (_) {}
    try {
      if (typeof checklistFindProjectByInput === "function") return checklistFindProjectByInput(value);
    } catch (_) {}
    return null;
  }

  function centralProjectForChecklist(projectData) {
    if (!window.centralProjectStore || !projectData) return null;
    const key = centralProjectStore.keyFromData(projectData);
    const found = centralProjectStore.getProjects().find(project => (project.keys || []).includes(key));
    return found || centralProjectStore.upsertProject(projectData, "project-receive", { log: false });
  }

  function rowMatchesProject(row, projectData) {
    const rowKey = syncText(row.projectLinkKey || row.linkedReceiveId || row.linkedProjectNo || row.projectNo || row.pjNo);
    if (!rowKey) return true;
    const values = [
      projectData.receiveId,
      projectData.internalReceiveId,
      projectData.linkedReceiveId,
      projectData.projectNo,
      projectData.pjNo,
      projectData.dbPjNo,
      projectData.id
    ].map(syncText).filter(Boolean);
    return values.includes(rowKey);
  }

  function rowCategory(row) {
    try { return normalizeChecklistGroupName(row.group); } catch (_) { return syncText(row.group); }
  }

  function rowContent(row) {
    return [
      row.item,
      row.method,
      row.comment
    ].map(syncText).filter(Boolean).join("\n");
  }

  function isQuestionRow(row) {
    const group = rowCategory(row);
    return /^Z[1-6]\./.test(group) || group.includes("질의사항");
  }

  function isEstimateConditionRow(row) {
    const group = rowCategory(row);
    return /^Z7\./.test(group) || group.includes("견적조건");
  }

  function questionStatus(row) {
    if (row.done || row.status === "확인완료") return "확인완료";
    if (row.status) return syncText(row.status);
    return row.checked ? "진행중" : "미회신";
  }

  function buildChecklistCentralSnapshot(projectData) {
    const rows = (Array.isArray(checklistRows) ? checklistRows : [])
      .map(row => {
        try { return normalizeChecklistRow(row); } catch (_) { return row; }
      })
      .filter(row => row && rowMatchesProject(row, projectData));

    const questions = rows.filter(isQuestionRow).map((row, index) => {
      const group = rowCategory(row);
      const content = rowContent(row) || syncText(row.item || row.method || group);
      const status = questionStatus(row);
      return {
        questionUid: row.questionUid || `CHK-${syncText(projectData.receiveId || projectData.projectNo || projectData.projectName)}-${group}-${syncText(row.no || index)}`,
        createdAt: row.createdAt || "",
        category: group,
        content,
        targetRecipient: Array.isArray(row.targets) ? row.targets.join(", ") : syncText(row.targets || row.target || row.creator || "PM"),
        status,
        answer: syncText(row.answer || row.result || row.workerComment || ""),
        answeredAt: row.answeredAt || "",
        checklistNo: row.no || "",
        middleCategory: row.middleCategory || "",
        subCategory: row.subCategory || ""
      };
    });

    const conditionText = rows.filter(isEstimateConditionRow).map(row => {
      const label = [row.no, row.item].map(syncText).filter(Boolean).join(". ");
      const body = [row.method, row.comment].map(syncText).filter(Boolean).join("\n");
      return [label, body].filter(Boolean).join("\n");
    }).filter(Boolean).join("\n\n");

    return { questions, conditionText };
  }

  function syncChecklistToCentralProject() {
    if (!window.centralProjectStore || !Array.isArray(checklistRows)) return null;
    const projectData = selectedProjectData();
    const centralProject = centralProjectForChecklist(projectData);
    if (!centralProject?.projectUid) return null;
    const snapshot = buildChecklistCentralSnapshot(projectData);
    const signature = JSON.stringify({ uid: centralProject.projectUid, snapshot });
    if (signature === lastSyncSignature) return centralProject;
    lastSyncSignature = signature;

    return centralProjectStore.mutateProject(centralProject.projectUid, project => {
      project.qaQc = project.qaQc || {};
      project.qaQc.questions = snapshot.questions;
      project.qaQc.openQuestionCount = snapshot.questions.filter(question => question.status !== "확인완료").length;
      project.qaQc.checklistStatus = snapshot.questions.length ? "연동완료" : (project.qaQc.checklistStatus || "미확인");
      project.qaQc.qcStatus = project.qaQc.openQuestionCount ? "질의진행" : (snapshot.questions.length ? "확인완료" : project.qaQc.qcStatus || "검토대기");
      project.qaQc.estimateConditions = project.qaQc.estimateConditions || { pm: "", worker: "", merged: "" };
      project.qaQc.estimateConditions.checklist = snapshot.conditionText;
      if (snapshot.conditionText) {
        const parts = [
          project.qaQc.estimateConditions.pm && `[PM]\n${project.qaQc.estimateConditions.pm}`,
          project.qaQc.estimateConditions.worker && `[작업자]\n${project.qaQc.estimateConditions.worker}`,
          `[체크리스트]\n${snapshot.conditionText}`
        ].filter(Boolean);
        project.qaQc.estimateConditions.merged = parts.join("\n\n");
      }
    }, "QC 질의응답 동기화");
  }

  function scheduleChecklistCentralSync(delay = 0) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      try { syncChecklistToCentralProject(); } catch (error) { console.warn("QC central sync failed", error); }
    }, delay);
  }

  function wrapFunction(name) {
    const base = window[name] || (typeof globalThis !== "undefined" ? globalThis[name] : null);
    if (typeof base !== "function") return;
    const wrapped = function checklistCentralSyncWrapper() {
      const result = base.apply(this, arguments);
      scheduleChecklistCentralSync(0);
      return result;
    };
    window[name] = wrapped;
    try { globalThis[name] = wrapped; } catch (_) {}
    try { eval(`${name} = window.${name}`); } catch (_) {}
  }

  [
    "renderChecklistGrid",
    "updateChecklistCell",
    "saveChecklistModal",
    "saveChecklistQuickAddModal",
    "insertChecklistRowInGroup",
    "deleteChecklistRow",
    "deleteCheckedRows",
    "duplicateCheckedRows"
  ].forEach(wrapFunction);

  window.syncChecklistToCentralProject = syncChecklistToCentralProject;
  window.scheduleChecklistCentralSync = scheduleChecklistCentralSync;
  setTimeout(scheduleChecklistCentralSync, 0);
})();



/* =========================================================
   QC 프로젝트 접속 경로 정리 패치
   - 새 창 기능 제거
   - 상단 프로젝트 검색은 전체 프로젝트 검색/선택 유지
   - 접속 경로 카드에는 현재 진행중인 프로젝트 리스트만 가로형으로 표시
   - 프로젝트 선택 시 접속 경로 영역 접기 / 상단 버튼으로 다시 펼치기
========================================================= */
(function installChecklistProjectRouteInlinePatch(){
  const QC_FALLBACK_PROJECTS = [
    { projectNo: '2026001', projectName: 'ㅇㅇ시설 신축공사', client: 'ㅇㅇ건설', status: '진행중' },
    { projectNo: '2026002', projectName: '공동주택 신축공사', client: 'ㅇㅇ건설', status: '진행중' },
    { projectNo: '2026003', projectName: '업무시설 증축공사', client: 'ㅇㅇ건설', status: '진행중' },
    { projectNo: '2026004', projectName: '물류센터 구조검토', client: 'ㅇㅇ건설', status: '진행중' },
    { projectNo: '2026005', projectName: '근린생활시설 리모델링', client: 'ㅇㅇ건설', status: '진행중' }
  ];

  function qcText(value){ return String(value ?? '').replace(/\s+/g, ' ').trim(); }
  function qcProjectNoFromData(data = {}, fallback = ''){
    const raw = qcText(data.projectNo || data.pjNo || data.dbPjNo || data.received || data.receiveNo || data.no || data.id || fallback);
    const digits = raw.match(/20\d{5}/)?.[0] || raw.match(/\d{7}/)?.[0];
    return digits || raw || fallback;
  }
  function qcProjectName(data = {}){ return qcText(data.projectName || data.name || data.project || data.title || 'ㅇㅇ시설 신축공사'); }
  function qcProjectClient(){ return 'ㅇㅇ건설'; }
  function qcProjectKey(data = {}){ return qcProjectNoFromData(data) || qcProjectName(data); }
  function qcProjectLabel(data = {}){
    return [qcProjectNoFromData(data), qcProjectName(data), qcProjectClient(data)].filter(Boolean).join(' · ');
  }
  function qcCollectProjectItems(){
    const map = new Map();
    const add = (raw, idx = 0) => {
      const data = raw?.data || raw || {};
      const fallbackNo = String(2026001 + map.size);
      const no = qcProjectNoFromData(data, fallbackNo);
      const name = qcProjectName(data);
      const key = no || name;
      if (!key || map.has(key)) return;
      map.set(key, {
        projectNo: no,
        projectName: name,
        client: qcProjectClient(data),
        status: qcText(data.status || data.progress || data.phase || '진행중') || '진행중'
      });
    };
    try { (window.projectReceiveCompletedProjects || []).forEach(add); } catch(_) {}
    try { (window.projectReceiveList || []).forEach(add); } catch(_) {}
    try { (window.pmScheduleProjects || []).forEach((item, idx) => add(item?.project || item, idx)); } catch(_) {}
    try { (typeof checklistProjectItems === 'function' ? checklistProjectItems() : []).forEach(add); } catch(_) {}
    QC_FALLBACK_PROJECTS.forEach(add);
    return Array.from(map.values());
  }
  function qcFindProjectByText(value){
    const text = qcText(value).toLowerCase();
    const projects = qcCollectProjectItems();
    if (!text) return projects[0] || null;
    return projects.find(item => {
      const no = qcText(item.projectNo).toLowerCase();
      const name = qcText(item.projectName).toLowerCase();
      const client = qcText(item.client).toLowerCase();
      const label = qcProjectLabel(item).toLowerCase();
      return label.includes(text) || text.includes(no) || text.includes(name) || no.includes(text) || name.includes(text) || client.includes(text);
    }) || projects[0] || null;
  }
  function syncChecklistProjectDatalist(){
    const list = document.getElementById('checklistProjectList');
    if (!list) return;
    list.innerHTML = qcCollectProjectItems().map(project => `<option value="${escapeHtml(qcProjectLabel(project))}"></option>`).join('');
  }
  function setChecklistProjectSelection(project){
    if (!project) return;
    const input = document.getElementById('checklistProject');
    if (input) input.value = qcProjectLabel(project);
    try { checklistLinkedProjectNo = qcProjectKey(project); } catch(_) {}
  }
  function renderChecklistRouteProjects(){
    const wrap = document.getElementById('checklistProjectAccessRoutes');
    if (!wrap) return;
    syncChecklistProjectDatalist();
    const projects = qcCollectProjectItems();
    const selected = qcFindProjectByText(document.getElementById('checklistProject')?.value || '') || projects[0];
    const rows = projects.map((item, idx) => {
      const active = selected && qcProjectKey(item) === qcProjectKey(selected) ? 'active' : '';
      return `<button type="button" class="qc-project-route-row ${active}" onclick="selectChecklistActiveProject(${idx})">
        <strong>${escapeHtml(item.projectNo)}</strong>
        <span>${escapeHtml(item.projectName)}</span>
        <em>${escapeHtml(item.client)}</em>
        <small>${escapeHtml(item.status || '진행중')}</small>
      </button>`;
    }).join('');
    wrap.innerHTML = `
      <div class="qc-project-route-card">
        <div class="qc-route-head compact">
          <div>
            <strong>프로젝트 질의응답 접속 경로</strong>
            <span>상단 프로젝트 검색 또는 현재 진행중인 프로젝트 리스트에서 선택 후 프로젝트 선택 버튼을 누릅니다.</span>
          </div>
        </div>
        <section class="qc-route-section qc-route-current-only">
          <div class="qc-route-section-title">
            <h3>현재 진행중인 프로젝트</h3>
            <p>리스트를 클릭하면 상단 프로젝트 검색 값에 반영됩니다.</p>
          </div>
          <div class="qc-current-project-list horizontal">${rows}</div>
        </section>
      </div>`;
  }
  function setChecklistRouteCollapsed(collapsed){
    const wrap = document.getElementById('checklistProjectAccessRoutes');
    if (!wrap) return;
    wrap.classList.toggle('is-collapsed', !!collapsed);
  }
  function setChecklistProjectPicked(picked){
    const panel = document.getElementById('qcReview');
    if (!panel) return;
    panel.classList.toggle('qc-project-picked', !!picked);
    panel.classList.toggle('qc-project-unpicked', !picked);
  }

  window.refreshChecklistProjectRoutes = function refreshChecklistProjectRoutes(){
    renderChecklistRouteProjects();
  };
  window.selectChecklistActiveProject = function selectChecklistActiveProject(index){
    const project = qcCollectProjectItems()[Number(index)] || qcCollectProjectItems()[0];
    setChecklistProjectSelection(project);
    renderChecklistRouteProjects();
    try { scheduleChecklistGridRender(0); } catch(_) { try { renderChecklistGrid(); } catch(__){} }
  };
  window.selectChecklistProjectAndCollapse = function selectChecklistProjectAndCollapse(){
    const project = qcFindProjectByText(document.getElementById('checklistProject')?.value || '') || qcCollectProjectItems()[0];
    setChecklistProjectSelection(project);
    setChecklistProjectPicked(true);
    setChecklistRouteCollapsed(true);
    checklistCategoryPanelOpen = true;
    try { updateChecklistLinkedProjectContext?.(); } catch(_) {}
    try { applyChecklistDefaultCollapsedView(); } catch(_) {}
    try { scheduleChecklistGridRender(0); } catch(_) { try { renderChecklistGrid(); } catch(__){} }
    try { showToast('프로젝트가 선택되었습니다.'); } catch(_) {}
  };
  window.openChecklistProjectSelector = function openChecklistProjectSelector(){
    setChecklistProjectPicked(false);
    setChecklistRouteCollapsed(false);
    renderChecklistRouteProjects();
    const wrap = document.getElementById('checklistProjectAccessRoutes');
    if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  window.openChecklistSelectedProjectWindow = window.selectChecklistProjectAndCollapse;

  const oldRenderChecklistGridForRoute = window.renderChecklistGrid || renderChecklistGrid;
  if (!window.__qcProjectRouteRenderHooked) {
    window.__qcProjectRouteRenderHooked = true;
    window.renderChecklistGrid = function renderChecklistGridWithProjectRoute(){
      const result = oldRenderChecklistGridForRoute.apply(this, arguments);
      try { renderChecklistRouteProjects(); } catch(_) {}
      return result;
    };
    try { renderChecklistGrid = window.renderChecklistGrid; } catch(_) {}
  }

  setTimeout(() => {
    setChecklistProjectPicked(false);
    setChecklistRouteCollapsed(false);
    syncChecklistProjectDatalist();
    renderChecklistRouteProjects();
    const input = document.getElementById('checklistProject');
    if (input && !input.__qcProjectSearchBound) {
      input.__qcProjectSearchBound = true;
      input.addEventListener('input', () => { syncChecklistProjectDatalist(); renderChecklistRouteProjects(); });
      input.addEventListener('change', () => { syncChecklistProjectDatalist(); renderChecklistRouteProjects(); });
    }
  }, 0);
})();

/* =========================================================
   QC 가독성 개선 우선순위 반영 패치
   - 선택 프로젝트 표시 강화
   - 구분/중분류/검색 필터 상태 칩 표시
   - 필터 초기화 버튼 제공
   - 구분필터는 사용자가 닫기 전까지 유지
   ========================================================= */
(function installChecklistReadabilityPriorityPatch(){
  function qcSafeText(value){ return String(value ?? '').replace(/\s+/g, ' ').trim(); }
  function qcCurrentProjectLabel(){
    const raw = qcSafeText(document.getElementById('checklistProject')?.value || '');
    return raw || '프로젝트 미선택';
  }
  function qcMiddleFilterLabel(){
    if (!Array.isArray(checklistMiddleFilterOptions) || !checklistMiddleFilterOptions.length) return '';
    const active = checklistMiddleFilterOptions.filter(option => selectedChecklistMiddleFilters.has(option));
    if (active.length === checklistMiddleFilterOptions.length) return '중분류 전체';
    if (!active.length) return '중분류 없음';
    return active.join(', ');
  }
  function qcBuildFilterStatusChips(){
    const owner = document.getElementById('checklistOwnerFilter')?.value || '전체';
    const done = document.getElementById('checklistDoneFilter')?.value || '전체';
    const search = qcSafeText(document.getElementById('checklistSearch')?.value || '');
    const category = getChecklistCategoryLabel(selectedChecklistCategoryFilter || '전체');
    const chips = [];
    chips.push(`<span class="qc-filter-state-chip strong">구분 · ${escapeHtml(category)}</span>`);
    chips.push(`<span class="qc-filter-state-chip">${escapeHtml(qcMiddleFilterLabel())}</span>`);
    if (owner !== '전체') chips.push(`<span class="qc-filter-state-chip">담당자 · ${escapeHtml(owner)}</span>`);
    if (done !== '전체') chips.push(`<span class="qc-filter-state-chip">체크 · ${escapeHtml(done)}</span>`);
    if (search) chips.push(`<span class="qc-filter-state-chip">검색 · ${escapeHtml(search)}</span>`);
    return chips.join('');
  }
  window.resetChecklistReadabilityFilters = function resetChecklistReadabilityFilters(){
    selectedChecklistCategoryFilter = '전체';
    selectedChecklistMiddleFilters.clear();
    checklistMiddleFilterOptions.forEach(option => selectedChecklistMiddleFilters.add(option));
    const owner = document.getElementById('checklistOwnerFilter');
    const done = document.getElementById('checklistDoneFilter');
    const search = document.getElementById('checklistSearch');
    if (owner) owner.value = '전체';
    if (done) done.value = '전체';
    if (search) search.value = '';
    checklistCategoryPanelOpen = true;
    try { applyChecklistDefaultCollapsedView(); } catch(_) {}
    try { scheduleChecklistGridRender(0); } catch(_) { try { renderChecklistGrid(); } catch(__){} }
  };
  renderChecklistCategoryButtons = function renderChecklistCategoryButtonsReadable() {
    const wrap = document.getElementById('checklistCategoryFilter');
    if (!wrap) return;

    buildChecklistRenderMetaCache();
    const visibleCategories = checklistCategoryOptions.filter(category => getChecklistCategoryCount(category) > 0);
    const categories = ['전체', ...visibleCategories];

    if (selectedChecklistCategoryFilter !== '전체' && !visibleCategories.includes(selectedChecklistCategoryFilter)) {
      selectedChecklistCategoryFilter = '전체';
    }

    checklistCategoryPanelOpen = checklistCategoryPanelOpen !== false;
    const activeLabel = getChecklistCategoryLabel(selectedChecklistCategoryFilter);
    const activeCount = selectedChecklistCategoryFilter === '전체' ? checklistRows.length : getChecklistCategoryCount(selectedChecklistCategoryFilter);
    const optionButtons = categories.map(category => {
      const active = selectedChecklistCategoryFilter === category ? 'active' : '';
      const count = category === '전체' ? checklistRows.length : getChecklistCategoryCount(category);
      return `<button type="button" class="category-filter-btn ${active}" onclick="setChecklistCategoryFilter('${escapeJs(category)}')"><span class="category-name">${escapeHtml(getChecklistCategoryLabel(category))}</span><span class="category-count">${count}</span></button>`;
    }).join('');

    const allVisibleCollapsed = areAllVisibleChecklistGroupsCollapsed();
    const detailButtonLabel = allVisibleCollapsed ? '펼치기' : '접기';
    const detailButtonTitle = allVisibleCollapsed ? '현재 조회된 구분의 세부 항목을 모두 펼칩니다.' : '현재 조회된 구분의 세부 항목을 모두 숨기고 구분명만 표시합니다.';

    wrap.innerHTML = `
      <div class="checklist-filter-shell readability-priority ${checklistCategoryPanelOpen ? 'open' : ''}">
        <div class="qc-current-project-strip">
          <div class="qc-current-project-main">
            <span>선택 프로젝트</span>
            <strong>${escapeHtml(qcCurrentProjectLabel())}</strong>
          </div>
          <button type="button" class="qc-filter-reset-btn" onclick="resetChecklistReadabilityFilters()">필터 초기화</button>
        </div>
        <div class="qc-active-filter-strip">
          <span class="qc-active-filter-title">적용 필터</span>
          <div class="qc-active-filter-chips">${qcBuildFilterStatusChips()}</div>
        </div>
        <div class="checklist-filter-summary" title="구분 필터는 구분 선택 닫기 버튼으로만 접을 수 있습니다.">
          <div class="filter-summary-main">
            <span class="filter-summary-label">구분 필터</span>
            <strong>${escapeHtml(activeLabel)}</strong>
            <em>${activeCount}건</em>
          </div>
          <div class="filter-summary-actions">
            <button type="button" class="category-filter-reset ${selectedChecklistCategoryFilter === '전체' ? 'disabled' : ''}" onclick="event.stopPropagation(); setChecklistCategoryFilter('전체')">전체보기</button>
            <button type="button" class="category-filter-toggle ${checklistCategoryPanelOpen ? 'active' : ''}" onclick="event.stopPropagation(); toggleChecklistCategoryPanel()">구분 선택 <span>${checklistCategoryPanelOpen ? '닫기' : '열기'}</span></button>
            <button type="button" class="category-detail-toggle ${allVisibleCollapsed ? 'expand' : 'collapse'}" title="${detailButtonTitle}" onclick="event.stopPropagation(); toggleChecklistDetailVisibility()">${detailButtonLabel}</button>
          </div>
        </div>
        ${renderChecklistMiddleFilterBar()}
        <div class="category-filter-panel ${checklistCategoryPanelOpen ? 'open' : ''}">
          <div class="category-filter-grid">${optionButtons}</div>
        </div>
      </div>`;
  };
  window.renderChecklistCategoryButtons = renderChecklistCategoryButtons;
  setTimeout(() => {
    try { renderChecklistCategoryButtons(); } catch(_) {}
  }, 0);
})();

/* 2026-06-15 QC review category filter final renderer */
(function installChecklistCategoryFilterFinalRenderer(){
  function text(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
  }
  function countOf(category) {
    return category === "전체" ? checklistRows.length : getChecklistCategoryCount(category);
  }
  function projectLabel() {
    return text(document.getElementById("checklistProject")?.value) || "프로젝트 미선택";
  }
  function middleLabel() {
    const active = checklistMiddleFilterOptions.filter(option => selectedChecklistMiddleFilters.has(option));
    if (!active.length) return "중분류 없음";
    if (active.length === checklistMiddleFilterOptions.length) return "중분류 전체";
    return active.join(", ");
  }
  function groupOf(category) {
    const label = getChecklistCategoryLabel(category);
    if (category === "전체") return "all";
    if (/견적조건/.test(label) || /^Z7\./.test(label)) return "final";
    if (/질의사항|^Z[1-6]\./.test(label)) return "question";
    if (/검토/.test(label)) return "review";
    return "flow";
  }
  function statusChips(activeLabel, activeCount) {
    const owner = text(document.getElementById("checklistOwnerFilter")?.value) || "전체";
    const done = text(document.getElementById("checklistDoneFilter")?.value) || "전체";
    const search = text(document.getElementById("checklistSearch")?.value);
    const chips = [
      `<span class="qc-filter-status-chip strong"><b>구분</b>${escapeHtml(activeLabel)} · ${activeCount}</span>`,
      `<span class="qc-filter-status-chip"><b>중분류</b>${escapeHtml(middleLabel())}</span>`
    ];
    if (owner !== "전체") chips.push(`<span class="qc-filter-status-chip"><b>대상</b>${escapeHtml(owner)}</span>`);
    if (done !== "전체") chips.push(`<span class="qc-filter-status-chip"><b>체크</b>${escapeHtml(done)}</span>`);
    if (search) chips.push(`<span class="qc-filter-status-chip"><b>검색</b>${escapeHtml(search)}</span>`);
    return chips.join("");
  }
  function pill(category, mode = "") {
    const active = selectedChecklistCategoryFilter === category ? "active" : "";
    return `<button type="button" class="qc-category-pill ${mode} ${active}" onclick="setChecklistCategoryFilter('${escapeJs(category)}')">
      <span>${escapeHtml(getChecklistCategoryLabel(category))}</span>
      <em>${countOf(category)}</em>
    </button>`;
  }
  function lane(title, categories, tone) {
    if (!categories.length) return "";
    return `<section class="qc-category-lane ${tone}">
      <h3>${escapeHtml(title)}</h3>
      <div class="qc-category-lane-items">${categories.map(category => pill(category)).join("")}</div>
    </section>`;
  }
  function lanes(categories) {
    const grouped = { flow: [], review: [], question: [], final: [] };
    categories.forEach(category => {
      const group = groupOf(category);
      if (grouped[group]) grouped[group].push(category);
    });
    return [
      lane("진행", grouped.flow, "flow"),
      lane("검토", grouped.review, "review"),
      lane("질의", grouped.question, "question"),
      lane("최종", grouped.final, "final")
    ].filter(Boolean).join("");
  }

  renderChecklistCategoryButtons = function renderChecklistCategoryButtonsFinal() {
    const wrap = document.getElementById("checklistCategoryFilter");
    if (!wrap) return;
    buildChecklistRenderMetaCache();
    const visibleCategories = checklistCategoryOptions.filter(category => getChecklistCategoryCount(category) > 0);
    if (selectedChecklistCategoryFilter !== "전체" && !visibleCategories.includes(selectedChecklistCategoryFilter)) {
      selectedChecklistCategoryFilter = "전체";
    }
    checklistCategoryPanelOpen = checklistCategoryPanelOpen !== false;
    const activeLabel = getChecklistCategoryLabel(selectedChecklistCategoryFilter || "전체");
    const activeCount = countOf(selectedChecklistCategoryFilter || "전체");
    const allVisibleCollapsed = areAllVisibleChecklistGroupsCollapsed();
    wrap.innerHTML = `
      <div class="checklist-filter-shell qc-filter-redesign ${checklistCategoryPanelOpen ? "open" : ""}">
        <div class="qc-filter-topbar">
          <div class="qc-filter-project">
            <span>프로젝트</span>
            <strong>${escapeHtml(projectLabel())}</strong>
          </div>
          <div class="qc-filter-actions">
            <button type="button" class="qc-filter-quiet-btn" onclick="resetChecklistReadabilityFilters()">초기화</button>
            <button type="button" class="qc-filter-quiet-btn" onclick="event.stopPropagation(); toggleChecklistDetailVisibility()">${allVisibleCollapsed ? "목록 펼치기" : "목록 접기"}</button>
          </div>
        </div>
        <div class="qc-filter-overview">
          ${pill("전체", "all")}
          <div class="qc-filter-current">
            <span>현재 필터</span>
            <div class="qc-filter-status-row">${statusChips(activeLabel, activeCount)}</div>
          </div>
        </div>
        <div class="qc-filter-middle-wrap">${renderChecklistMiddleFilterBar()}</div>
        <div class="qc-category-lanes open">${lanes(visibleCategories)}</div>
      </div>`;
  };
  window.renderChecklistCategoryButtons = renderChecklistCategoryButtons;
  setTimeout(() => {
    try { renderChecklistCategoryButtons(); } catch (_) {}
  }, 0);
})();
