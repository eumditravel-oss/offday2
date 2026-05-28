let estimateDbVisibleSeedRowsInitialized = false;
let estimateDbPjReceiptColumnRemoved = false;
let estimateDbPjProjectLinkColumnEnsured = false;
let estimateDbPjIdentityColumnsEnsured = false;
const ESTIMATE_DB_PROJECT_LINK_HEADER = "프로젝트 연결";
let estimateDbSortState = { tab: "pj", colIndex: 1, direction: "desc" };
let estimateDbColumnResizeMode = false;
let estimateDbColumnReorderMode = false;
let estimateDbColumnReorderSource = null;
let estimateDbColumnReorderPointerState = null;
let estimateDbRowHeightPx = Math.max(28, Math.min(120, Number(localStorage.getItem("estimateDbRowHeightPx") || 44)));
let estimateDbColumnWidthOverrides = { pj: {}, progress: {}, mep: {} };
let estimateDbColumnResizeState = null;
let estimateDbSearchKeyword = "";
const ESTIMATE_DB_STAGE_ADD_SHORTCUT_LABEL = "Alt+Insert";
const ESTIMATE_DB_MANUAL_SAVE_SHORTCUT_LABEL = "Ctrl+S";
const estimateDbPendingEdits = {};
let estimateDbHasUnsavedChanges = false;

function makeEstimateDbPendingKey(tab, rowIndex, colIndex) {
  return `${tab}::${Number(rowIndex)}::${Number(colIndex)}`;
}

function setEstimateDbPendingEdit(tab, rowIndex, colIndex, value) {
  const key = makeEstimateDbPendingKey(tab, rowIndex, colIndex);
  estimateDbPendingEdits[key] = { tab, rowIndex: Number(rowIndex), colIndex: Number(colIndex), value };
  estimateDbHasUnsavedChanges = true;
}

function getEstimateDbPendingEdit(tab, rowIndex, colIndex) {
  return estimateDbPendingEdits[makeEstimateDbPendingKey(tab, rowIndex, colIndex)];
}

function getEstimateDbCellDisplayValue(tab, rowIndex, colIndex, fallback = "") {
  const pending = getEstimateDbPendingEdit(tab, rowIndex, colIndex);
  return pending ? pending.value : fallback;
}

function getEstimateDbColumnGroupName(tab = estimateDbActiveTab, colIndex = 0) {
  const sheet = getEstimateDbSheet(tab);
  const top = sheet?.headerRows?.[0] || [];
  let current = "";
  for (let i = 0; i <= colIndex; i += 1) {
    const text = normalizeEstimateDbText(top[i]);
    if (text) current = text;
  }
  return current;
}

function isEstimateDbDateInputColumn(tab = estimateDbActiveTab, colIndex = 0) {
  if (tab !== "progress") return false;
  const header = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  const group = normalizeEstimateDbText(getEstimateDbColumnGroupName(tab, colIndex));
  if (["견적서일자", "수주일자", "계약일자"].includes(header)) return true;
  return group.includes("납품예정일") && /^\d+차납품$/.test(header);
}

function isEstimateDbCreatedDateColumn(tab = estimateDbActiveTab, colIndex = 0) {
  if (tab !== "pj") return false;
  const header = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  return header === "최초생성날짜" || header === "년도";
}

function formatEstimateDbFullKoreanDate(value) {
  const raw = normalizeEstimateDbText(value);
  if (!raw) return "";
  const pad = v => String(v).padStart(2, "0");
  let match = raw.match(/^(20\d{2})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
  if (match) return `${match[1]}년 ${pad(match[2])}월 ${pad(match[3])}일`;
  match = raw.match(/^(20\d{2})[.\/-](\d{1,2})[.\/-](\d{1,2})$/);
  if (match) return `${match[1]}년 ${pad(match[2])}월 ${pad(match[3])}일`;
  const digits = raw.replace(/[^0-9]/g, "");
  match = digits.match(/^(20\d{2})(\d{2})(\d{2})$/);
  if (match) return `${match[1]}년 ${match[2]}월 ${match[3]}일`;
  match = digits.match(/^(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    const year = 2000 + Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}년 ${pad(month)}월 ${pad(day)}일`;
    }
  }
  match = raw.match(/(20\d{2})/);
  if (match) return `${match[1]}년 00월 00일`;
  return raw;
}

function formatEstimateDbCompactDate(value) {
  const raw = normalizeEstimateDbText(value);
  if (!raw) return "";
  if (/^\d{2}년\s*\d{1,2}월\s*\d{1,2}일$/.test(raw)) return raw.replace(/\s+/g, "");
  const digits = raw.replace(/[^0-9]/g, "");
  const match = digits.match(/^(\d{2})(\d{2})(\d{2})$/);
  if (!match) return raw;
  const yy = Number(match[1]);
  const mm = Number(match[2]);
  const dd = Number(match[3]);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return raw;
  return `${String(yy).padStart(2, "0")}년${mm}월${dd}일`;
}

function normalizeEstimateDbCellForStorage(tab, colIndex, value) {
  if (parseEstimateDbRichCellValue(value)) return value;
  if (isEstimateDbCreatedDateColumn(tab, colIndex)) return formatEstimateDbFullKoreanDate(value);
  if (isEstimateDbDateInputColumn(tab, colIndex)) return formatEstimateDbCompactDate(value);
  const sheetForStorage = estimateDbSheets[tab];
  if (isEstimateDbOutsourceAmountCell(tab, colIndex)) return normalizeEstimateDbAmountCellStorage(value);
  if (isEstimateDbMoneyLikeColumn(tab, colIndex, sheetForStorage) && isEstimateDbPureNumber(value)) return String(value).replace(/,/g, "");
  return value;
}
function isEstimateDbProgressDoneColumn(tab = estimateDbActiveTab, colIndex = 0) {
  return tab === "progress" && normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex)) === "기성청구완료";
}

function parseEstimateDbProgressDoneValue(value) {
  const rich = parseEstimateDbRichCellValue(value);
  if (rich?.type === "progressDone") return { checked: !!rich.checked, history: String(rich.history || "") };
  const raw = normalizeEstimateDbText(value);
  return { checked: raw.includes("확인완료") || raw === "true" || raw === "1", history: raw.includes("확인완료") ? raw : "" };
}

function stringifyEstimateDbProgressDoneValue(checked, history = "") {
  return stringifyEstimateDbRichCellValue({ type: "progressDone", checked: !!checked, history: checked ? history : "" });
}

function formatEstimateDbProgressDoneTimestamp(date = new Date()) {
  const pad = value => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getEstimateDbProgressDoneHistory() {
  return `강동균 실장 확인완료_${formatEstimateDbProgressDoneTimestamp()}`;
}

function isEstimateDbProgressDoneRow(row) {
  const idx = getEstimateDbColumnIndexByHeader("progress", "기성청구완료");
  if (idx < 0) return false;
  return parseEstimateDbProgressDoneValue(row?.[idx]).checked;
}


function isEstimateDbTotalExcludedColumn(tab = estimateDbActiveTab, colIndex = 0, sheet = getEstimateDbSheet(tab)) {
  if (isEstimateDbProgressDoneColumn(tab, colIndex)) return true;
  if (isEstimateDbDateInputColumn(tab, colIndex)) return true;
  const header = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  const group = normalizeEstimateDbText(getEstimateDbColumnGroupName(tab, colIndex));
  return /일자|날짜|예정일|연락|전화|담당자|스토리|특이사항|조건|PM/.test(`${group} ${header}`);
}

function isEstimateDbEnterCommandCell(tab = estimateDbActiveTab, colIndex = 0) {
  return isEstimateDbStoryCell(tab, colIndex)
    || isEstimateDbStageEntryCell(tab, colIndex)
    || isEstimateDbOutsourceAmountCell(tab, colIndex)
    || isEstimateDbContactColumn(tab, colIndex)
    || isEstimateDbDropdownCell(tab, colIndex);
}


function openEstimateDbCommandCellFromButton(event, rowIndex, colIndex) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  const input = document.querySelector(`.quote-db-cell-input[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`);
  if (input) {
    selectEstimateDbCell(rowIndex, colIndex);
    input.focus({ preventScroll: true });
  }
  if (isEstimateDbPjMemoColumn(estimateDbActiveTab, colIndex)) {
    openEstimateDbPjMemoModal(rowIndex, colIndex);
    return;
  }
  if (isEstimateDbStoryCell(estimateDbActiveTab, colIndex)) {
    const summary = input?.value || "";
    const row = getEstimateDbRows()?.[rowIndex];
    const current = parseEstimateDbRichCellValue(row?.[colIndex]) || {};
    updateEstimateDbCell(rowIndex, colIndex, stringifyEstimateDbRichCellValue({ type: "progressStory", summary, full: current.full || summary }), { commit: true, silentRender: true });
    openEstimateDbStoryModal(rowIndex, colIndex);
    return;
  }
  if (isEstimateDbStageEntryCell(estimateDbActiveTab, colIndex)) {
    const currentText = String(input?.value || "").replace(/,/g, "");
    if (currentText && !parseEstimateDbRichCellValue(getEstimateDbRows()?.[rowIndex]?.[colIndex])) {
      updateEstimateDbCell(rowIndex, colIndex, stringifyEstimateDbRichCellValue({ type: "stageFormula", formula: currentText, note: "", amount: String(toEstimateDbNumber(currentText)) }), { commit: true, silentRender: true });
    }
    openEstimateDbStageFormulaModal(rowIndex, colIndex);
    return;
  }
  if (isEstimateDbOutsourceAmountCell(estimateDbActiveTab, colIndex)) {
    openEstimateDbAmountModal(rowIndex, colIndex);
    return;
  }
  if (isEstimateDbContactColumn(estimateDbActiveTab, colIndex)) {
    commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
    openEstimateDbContactModal(rowIndex, colIndex);
    return;
  }
  if (isEstimateDbDropdownCell(estimateDbActiveTab, colIndex)) {
    openEstimateDbDropdown(rowIndex, colIndex);
  }
}

function renderEstimateDbCommandOpenButton(rowIndex, colIndex) {
  return `<button type="button" class="quote-db-command-open-btn" title="입력창 열기" aria-label="입력창 열기" onclick="openEstimateDbCommandCellFromButton(event, ${rowIndex}, ${colIndex})"><span></span></button>`;
}

function commitEstimateDbPendingEdits(options = {}) {
  const entries = Object.values(estimateDbPendingEdits);
  if (!entries.length) {
    if (!options.silent && typeof showToast === "function") showToast("저장할 변경사항이 없습니다.");
    return 0;
  }

  let changed = 0;
  entries.forEach(({ tab, rowIndex, colIndex, value }) => {
    const sheet = estimateDbSheets[tab];
    const row = sheet?.rows?.[rowIndex];
    if (!row) return;
    const storedValue = normalizeEstimateDbCellForStorage(tab, colIndex, value);
    row[colIndex] = storedValue;
    recalcEstimateDbRow(tab, row);
    changed += 1;
  });

  Object.keys(estimateDbPendingEdits).forEach(key => delete estimateDbPendingEdits[key]);
  estimateDbHasUnsavedChanges = false;
  recalcAllEstimateDbRows();
  ensureEstimateDbPjIdentityColumnsOnce?.({ assignMissing: true });
  applyEstimateDbPjDefaultSort();
  renderEstimateDbManage();
  if (!options.silent && typeof showToast === "function") showToast(`DB관리 변경사항 ${changed}건을 저장했습니다.`);
  return changed;
}

function commitEstimateDbSinglePendingEdit(tab, rowIndex, colIndex, options = {}) {
  const pending = getEstimateDbPendingEdit(tab, rowIndex, colIndex);
  if (!pending) return 0;
  const sheet = estimateDbSheets[tab];
  const row = sheet?.rows?.[rowIndex];
  if (!row) return 0;
  const storedValue = normalizeEstimateDbCellForStorage(tab, colIndex, pending.value);
  row[colIndex] = storedValue;
  recalcEstimateDbRow(tab, row);
  if (tab === "pj") ensureEstimateDbPjIdentityColumnsOnce?.({ assignMissing: true });
  delete estimateDbPendingEdits[makeEstimateDbPendingKey(tab, rowIndex, colIndex)];
  estimateDbHasUnsavedChanges = Object.keys(estimateDbPendingEdits).length > 0;
  if (!options.skipRecalc) recalcAllEstimateDbRows();
  return 1;
}

function updateEstimateDbSaveButtonState() {
  const btn = document.getElementById("estimateDbManualSaveBtn");
  if (!btn) return;
  btn.classList.toggle("btn-primary", estimateDbHasUnsavedChanges);
  btn.classList.toggle("btn-line", !estimateDbHasUnsavedChanges);
  btn.textContent = estimateDbHasUnsavedChanges ? `저장 필요(${ESTIMATE_DB_MANUAL_SAVE_SHORTCUT_LABEL})` : `저장(${ESTIMATE_DB_MANUAL_SAVE_SHORTCUT_LABEL})`;
}


function initializeEstimateDbVisibleSeedRows() {
  removeEstimateDbPjReceiptColumnOnce();
  ensureEstimateDbPjIdentityColumnsOnce?.({ assignMissing: true });
  if (estimateDbVisibleSeedRowsInitialized) return;
  estimateDbVisibleSeedRowsInitialized = true;
  if (estimateDbSheets?.pj?.rows) estimateDbSheets.pj.rows = estimateDbSheets.pj.rows.slice(0, 2);
  if (estimateDbSheets?.progress?.rows) estimateDbSheets.progress.rows = estimateDbSheets.progress.rows.slice(0, 2);
  if (estimateDbSheets?.mep?.rows) estimateDbSheets.mep.rows = estimateDbSheets.mep.rows.slice(0, 2);
}

function removeEstimateDbPjReceiptColumnOnce() {
  if (estimateDbPjReceiptColumnRemoved) return;
  const sheet = estimateDbSheets?.pj;
  if (!sheet) return;
  const header = sheet.headerRows?.[0] || [];
  const receiptIndex = header.findIndex(col => normalizeEstimateDbText(col) === "접수번호");
  if (receiptIndex >= 0) {
    (sheet.headerRows || []).forEach(row => row.splice(receiptIndex, 1));
    if (Array.isArray(sheet.requestRow)) sheet.requestRow.splice(receiptIndex, 1);
    (sheet.rows || []).forEach(row => row.splice(receiptIndex, 1));
  }
  estimateDbPjReceiptColumnRemoved = true;
}

function clearEstimateDbPjProjectLinkValues() {
  const sheet = estimateDbSheets?.pj;
  if (!sheet) return;
  const header = sheet.headerRows?.[0] || [];
  const linkIndex = header.findIndex(col => normalizeEstimateDbText(col) === ESTIMATE_DB_PROJECT_LINK_HEADER);
  if (linkIndex < 0) return;
  (sheet.rows || []).forEach(row => {
    if (!Array.isArray(row)) return;
    while (row.length <= linkIndex) row.push("");
    row[linkIndex] = "";
  });
}

function ensureEstimateDbPjProjectLinkColumnOnce() {
  if (estimateDbPjProjectLinkColumnEnsured) return;
  const sheet = estimateDbSheets?.pj;
  if (!sheet) return;
  const header = sheet.headerRows?.[0] || [];
  const pjNoIndex = header.findIndex(col => normalizeEstimateDbText(col) === "PJ NO");
  const targetIndex = pjNoIndex >= 0 ? pjNoIndex + 1 : Math.min(2, header.length);
  const currentIndex = header.findIndex(col => normalizeEstimateDbText(col) === ESTIMATE_DB_PROJECT_LINK_HEADER);

  if (currentIndex >= 0) {
    if (currentIndex !== targetIndex) {
      (sheet.headerRows || []).forEach(row => {
        const [cell] = row.splice(currentIndex, 1);
        row.splice(targetIndex, 0, cell || ESTIMATE_DB_PROJECT_LINK_HEADER);
      });
      if (Array.isArray(sheet.requestRow)) {
        const [cell] = sheet.requestRow.splice(currentIndex, 1);
        sheet.requestRow.splice(targetIndex, 0, cell || "기존 프로젝트와 연결할 경우 Enter로 기존 PJ 리스트를 열어 선택");
      }
      (sheet.rows || []).forEach(row => {
        const [cell] = row.splice(currentIndex, 1);
        row.splice(targetIndex, 0, cell || "");
      });
    }
    header[targetIndex] = ESTIMATE_DB_PROJECT_LINK_HEADER;
    if (Array.isArray(sheet.requestRow)) sheet.requestRow[targetIndex] = "기존 프로젝트와 연결할 경우 Enter로 기존 PJ 리스트를 열어 선택(수주금액은 현재 행 기준 별도 관리)";
    estimateDbPjProjectLinkColumnEnsured = true;
    return;
  }

  (sheet.headerRows || []).forEach(row => row.splice(targetIndex, 0, ESTIMATE_DB_PROJECT_LINK_HEADER));
  if (Array.isArray(sheet.requestRow)) sheet.requestRow.splice(targetIndex, 0, "기존 프로젝트와 연결할 경우 Enter로 기존 PJ 리스트를 열어 선택(수주금액은 현재 행 기준 별도 관리)");
  (sheet.rows || []).forEach(row => row.splice(targetIndex, 0, ""));
  estimateDbPjProjectLinkColumnEnsured = true;
}

const estimateDbReportTabs = {
  summary: "0.수주매출입금",
  order: "1.수주 프로젝트",
  sales: "2.매출 프로젝트",
  deposit: "3.입금 프로젝트"
};

const estimateDbMonthlyTargets = { order: {}, sales: {}, deposit: {} };
const estimateDbMonthlySalesTargets = estimateDbMonthlyTargets.sales;
const ESTIMATE_DB_TARGET_TYPES = [
  { key: "order", label: "수주목표" },
  { key: "sales", label: "매출목표" },
  { key: "deposit", label: "입금목표" }
];

function getEstimateDbMonthlyTarget(type, year, month) {
  const targetType = ESTIMATE_DB_TARGET_TYPES.some(item => item.key === type) ? type : "sales";
  const y = String(year || getSelectedEstimateDbYear());
  const m = Number(month);
  const saved = estimateDbMonthlyTargets[targetType]?.[y]?.[m];
  return toEstimateDbNumber(saved) || 100000000;
}

function setEstimateDbMonthlyTarget(type, year, month, value) {
  const targetType = ESTIMATE_DB_TARGET_TYPES.some(item => item.key === type) ? type : "sales";
  const y = String(year || getSelectedEstimateDbYear());
  const m = Number(month);
  if (!estimateDbMonthlyTargets[targetType]) estimateDbMonthlyTargets[targetType] = {};
  if (!estimateDbMonthlyTargets[targetType][y]) estimateDbMonthlyTargets[targetType][y] = {};
  estimateDbMonthlyTargets[targetType][y][m] = toEstimateDbNumber(value);
}

function getEstimateDbMonthlySalesTarget(year, month) {
  return getEstimateDbMonthlyTarget("sales", year, month);
}

function setEstimateDbMonthlySalesTarget(year, month, value) {
  setEstimateDbMonthlyTarget("sales", year, month, value);
}

function formatEstimateDbCommaNumber(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const stripped = raw.replace(/,/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(stripped)) return raw;
  const [intPart, decimalPart] = stripped.split(".");
  const sign = intPart.startsWith("-") ? "-" : "";
  const digits = sign ? intPart.slice(1) : intPart;
  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${formatted}${decimalPart !== undefined ? `.${decimalPart}` : ""}`;
}

function isEstimateDbPureNumber(value) {
  const raw = String(value ?? "").trim().replace(/,/g, "");
  return /^-?\d+(\.\d+)?$/.test(raw);
}

function isEstimateDbMoneyLikeColumn(tab = estimateDbActiveTab, colIndex = 0, sheet = getEstimateDbSheet(tab)) {
  const header = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  const topHeader = normalizeEstimateDbText(sheet?.headerRows?.[0]?.[colIndex] || "");
  const label = `${topHeader} ${header}`;
  if (!header && !topHeader) return false;
  if (/년도|PJ\s*NO|프로젝트 연결|접수번호|일자|날짜|예정일|연락|전화|휴대폰|직통|EMAIL|ID|PW|층수|동수|타입수|세대수|연면적|비율|퍼센트|구분|비고|담당자|직급|부서명|프로젝트명|거래처명|업체명|국내\/해외/.test(label)) return false;
  return /금액|목표|달성|차액|잔액|합계|기성|입금|매출|수주|계약금|수령액|발행완료|납품완료|작업진행중|작업대기중|작업취소|기계|전기|외주|송무|기타|\bA\b|\bB\b|\bC\b|\bC1\b|\bC2\b|\bC3\b|\bC4\b|\bC5\b/.test(label);
}

function formatEstimateDbMoneyDisplay(value, tab = estimateDbActiveTab, colIndex = 0, sheet = getEstimateDbSheet(tab)) {
  value = getEstimateDbRichDisplayValue(value);
  if (isEstimateDbDateInputColumn(tab, colIndex)) return formatEstimateDbCompactDate(value);
  if (!isEstimateDbMoneyLikeColumn(tab, colIndex, sheet)) return String(value ?? "");
  if (!isEstimateDbPureNumber(value)) return String(value ?? "");
  return formatEstimateDbCommaNumber(value);
}

function formatEstimateDbReportCell(value) {
  const raw = String(value ?? "");
  if (!raw || raw.includes("%") || /월$/.test(raw) || /년$/.test(raw)) return raw;
  return isEstimateDbPureNumber(raw) ? formatEstimateDbCommaNumber(raw) : raw;
}
