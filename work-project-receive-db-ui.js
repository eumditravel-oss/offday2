let estimateDbActiveTab = "pj";
let estimateDbReportActiveTab = "summary";
let estimateDbSelectedCell = { tab: "pj", sectionIndex: null, rowIndex: 0, colIndex: 0 };
let estimateDbDropdownState = null;


function insertEstimateDbColumn(sheet, insertAt, topLabel, leafLabel, requestText = "") {
  if (!sheet?.headerRows?.length) return;
  sheet.headerRows.forEach((headerRow, index) => {
    headerRow.splice(insertAt, 0, index === 0 ? topLabel : leafLabel);
  });
  if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, requestText);
  (sheet.rows || []).forEach(row => row.splice(insertAt, 0, ""));
}
function ensureEstimateDbPjDeliveryPlanColumnsOnce() {
  const sheet = estimateDbSheets.pj;
  if (!sheet?.headerRows?.[0]) return;
  const cols = getEstimateDbLeafColumns(sheet);
  const hasFirstPlan = cols.some(v => normalizeEstimateDbText(v) === "1차납품예정일");
  if (!hasFirstPlan) {
    const firstActualIndex = cols.findIndex(v => normalizeEstimateDbText(v) === "1차납품일자");
    if (firstActualIndex >= 0) insertEstimateDbColumn(sheet, firstActualIndex, "1차납품예정일", "", "1차 납품 예정일 입력란");
  }
  const colsAfterFirst = getEstimateDbLeafColumns(sheet);
  const hasSecondPlan = colsAfterFirst.some(v => normalizeEstimateDbText(v) === "2차납품예정일");
  if (!hasSecondPlan) {
    const secondActualIndex = colsAfterFirst.findIndex(v => normalizeEstimateDbText(v) === "2차납품일자");
    if (secondActualIndex >= 0) insertEstimateDbColumn(sheet, secondActualIndex, "2차납품예정일", "", "2차 납품 예정일 입력란");
  }
}

function migrateEstimateDbCreatedDateHeaders() {
  ["pj", "progress", "mep"].forEach(tab => {
    const sheet = estimateDbSheets?.[tab];
    if (!sheet?.headerRows?.length) return;
    (sheet.headerRows || []).forEach(headerRow => {
      if (!Array.isArray(headerRow)) return;
      headerRow.forEach((value, index) => {
        if (normalizeEstimateDbText(value) === "년도") headerRow[index] = "최초생성날짜";
      });
    });
    const cols = getEstimateDbLeafColumns(sheet);
    const createdIndex = cols.findIndex(col => normalizeEstimateDbText(col) === "최초생성날짜");
    if (createdIndex < 0) return;
    (sheet.rows || []).forEach(row => {
      if (!Array.isArray(row)) return;
      while (row.length < cols.length) row.push("");
      row[createdIndex] = normalizeEstimateDbCreatedDate(row[createdIndex]);
    });
  });
}
function getEstimateDbNumericValueForTotal(row, colIndex, tabName, sheet) {
  const isProgress = sheet === estimateDbSheets.progress || tabName === "progress";
  if (isProgress && isEstimateDbOutsourceAmountCell("progress", colIndex)) {
    const parsed = parseEstimateDbAmountCellValue(row?.[colIndex]);
    return toEstimateDbNumber(parsed.amount || row?.[colIndex]);
  }
  return toEstimateDbNumber(row?.[colIndex]);
}

function normalizeEstimateDbText(value) { return String(value ?? "").trim(); }
function toEstimateDbNumber(value) {
  const rich = parseEstimateDbRichCellValue(value);
  if (rich && rich.type === "stageFormula") value = rich.amount || 0;
  if (rich && rich.type === "contractAmount") value = rich.amount || 0;
  const raw = normalizeEstimateDbText(value).replace(/,/g, "").replace(/원/g, "");
  const num = Number(raw);
  return Number.isFinite(num) ? num : 0;
}
function parseEstimateDbYear(value) {
  const m = normalizeEstimateDbText(value).match(/(20\d{2})/);
  return m ? m[1] : String(new Date().getFullYear());
}
function parseEstimateDbMonth(value) {
  const raw = normalizeEstimateDbText(value);
  const direct = raw.match(/(?:^|[^0-9])(1[0-2]|0?[1-9])\s*월/);
  if (direct) return Number(direct[1]);
  const compact = raw.match(/^(?:\d{2})?(0[1-9]|1[0-2])\d{2}$/);
  if (compact) return Number(compact[1]);
  const date = raw.match(/20\d{2}[.\/-](0?[1-9]|1[0-2])/);
  if (date) return Number(date[1]);
  return null;
}

const ESTIMATE_DB_CREATED_DATE_HEADER = "최초생성날짜";

function formatEstimateDbKoreanDate(date = new Date()) {
  const pad = value => String(value).padStart(2, "0");
  return `${date.getFullYear()}년 ${pad(date.getMonth() + 1)}월 ${pad(date.getDate())}일`;
}

function normalizeEstimateDbCreatedDate(value, fallbackDate = null) {
  const raw = normalizeEstimateDbText(value);
  if (/^20\d{2}년\s*\d{1,2}월\s*\d{1,2}일$/.test(raw)) return raw.replace(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/, (_m, y, mo, d) => `${y}년 ${String(mo).padStart(2, "0")}월 ${String(d).padStart(2, "0")}일`);
  const ymd = raw.match(/^(20\d{2})[.\/-](\d{1,2})[.\/-](\d{1,2})$/);
  if (ymd) return `${ymd[1]}년 ${String(ymd[2]).padStart(2, "0")}월 ${String(ymd[3]).padStart(2, "0")}일`;
  const digits = raw.replace(/[^0-9]/g, "");
  const compact = digits.match(/^(20\d{2})(\d{2})(\d{2})$/);
  if (compact) return `${compact[1]}년 ${compact[2]}월 ${compact[3]}일`;
  const shortCompact = digits.match(/^(\d{2})(\d{2})(\d{2})$/);
  if (shortCompact) {
    const year = 2000 + Number(shortCompact[1]);
    const month = Number(shortCompact[2]);
    const day = Number(shortCompact[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}년 ${String(month).padStart(2, "0")}월 ${String(day).padStart(2, "0")}일`;
    }
  }
  const yearOnly = raw.match(/(20\d{2})/);
  if (yearOnly) return `${yearOnly[1]}년 00월 00일`;
  return fallbackDate || formatEstimateDbKoreanDate();
}

function getEstimateDbCreatedDateYear(value) {
  const raw = normalizeEstimateDbText(value);
  const match = raw.match(/(20\d{2})/);
  return match ? match[1] : String(new Date().getFullYear());
}

function findEstimateDbColumnIndexByAnyName(columns = [], names = []) {
  const targets = names.map(normalizeEstimateDbText);
  return columns.findIndex(col => targets.includes(normalizeEstimateDbText(col)));
}

function getEstimateDbNextPjNoForYear(year, excludeRowIndex = -1) {
  const sheet = estimateDbSheets?.pj;
  const header = sheet?.headerRows?.[0] || [];
  const pjNoIndex = header.findIndex(col => normalizeEstimateDbText(col) === "PJ NO");
  const createdIndex = findEstimateDbColumnIndexByAnyName(header, [ESTIMATE_DB_CREATED_DATE_HEADER, "년도"]);
  let maxSeq = 0;
  (sheet?.rows || []).forEach((row, rowIndex) => {
    if (rowIndex === excludeRowIndex) return;
    const value = normalizeEstimateDbText(row?.[pjNoIndex]);
    const match = value.match(/^(20\d{2})(\d{3})$/);
    const rowYear = match ? match[1] : getEstimateDbCreatedDateYear(row?.[createdIndex]);
    if (rowYear !== String(year)) return;
    if (match) maxSeq = Math.max(maxSeq, Number(match[2]));
  });
  return `${year}${String(maxSeq + 1).padStart(3, "0")}`;
}

function ensureEstimateDbPjIdentityColumnsOnce(options = {}) {
  const sheet = estimateDbSheets?.pj;
  if (!sheet?.headerRows?.[0]) return;
  const header = sheet.headerRows[0];
  const legacyYearIndex = header.findIndex(col => normalizeEstimateDbText(col) === "년도");
  if (legacyYearIndex >= 0) header[legacyYearIndex] = ESTIMATE_DB_CREATED_DATE_HEADER;
  const createdIndex = header.findIndex(col => normalizeEstimateDbText(col) === ESTIMATE_DB_CREATED_DATE_HEADER);
  const pjNoIndex = header.findIndex(col => normalizeEstimateDbText(col) === "PJ NO");
  if (createdIndex < 0 || pjNoIndex < 0) return;

  (sheet.rows || []).forEach((row, rowIndex) => {
    if (!Array.isArray(row)) return;
    while (row.length < header.length) row.push("");
    row[createdIndex] = normalizeEstimateDbCreatedDate(row[createdIndex]);
    const year = getEstimateDbCreatedDateYear(row[createdIndex]);
    const currentPjNo = normalizeEstimateDbText(row[pjNoIndex]);
    const isValidCurrent = new RegExp(`^${year}\\d{3}$`).test(currentPjNo);
    const duplicateCount = (sheet.rows || []).filter((other, otherIndex) => otherIndex !== rowIndex && normalizeEstimateDbText(other?.[pjNoIndex]) === currentPjNo).length;
    const shouldAutoSet = options.assignMissing || !estimateDbPjIdentityColumnsEnsured;
    if (shouldAutoSet && (!currentPjNo || !isValidCurrent || duplicateCount > 0)) {
      row[pjNoIndex] = getEstimateDbNextPjNoForYear(year, rowIndex);
    }
  });

  estimateDbPjIdentityColumnsEnsured = true;
}

let estimateDbMaintenanceOnceDone = false;
function runEstimateDbStructureMaintenanceOnce(options = {}) {
  if (estimateDbMaintenanceOnceDone && !options.force) return;
  migrateEstimateDbCreatedDateHeaders?.();
  removeEstimateDbPjReceiptColumnOnce?.();
  ensureEstimateDbPjIdentityColumnsOnce?.({ assignMissing: options.assignMissing !== false });
  ensureEstimateDbPjProjectLinkColumnOnce?.();
  ensureEstimateDbPjDeliveryPlanColumnsOnce?.();
  estimateDbMaintenanceOnceDone = true;
}
function getEstimateDbSheet(tab = estimateDbActiveTab) {
  return estimateDbSheets?.[tab] || estimateDbSheets?.pj;
}
function getEstimateDbLeafColumns(sheet = getEstimateDbSheet()) {
  const rows = sheet.headerRows || [];
  if (!rows.length) return [];
  if (rows.length === 1) return rows[0];
  const top = rows[0] || [];
  const bottom = rows[rows.length - 1] || [];
  return Array.from({ length: Math.max(top.length, bottom.length) }, (_, i) => normalizeEstimateDbText(bottom[i]) || normalizeEstimateDbText(top[i]) || "");
}
function getEstimateDbDisplayColumns(sheet = getEstimateDbSheet()) {
  const rows = sheet.headerRows || [];
  if (!rows.length) return [];
  if (rows.length === 1) return rows[0];
  const top = rows[0] || [];
  const bottom = rows[rows.length - 1] || [];
  let group = "";
  return Array.from({ length: Math.max(top.length, bottom.length) }, (_, i) => {
    const main = normalizeEstimateDbText(top[i]);
    const sub = normalizeEstimateDbText(bottom[i]);
    if (main) group = main;
    if (main && sub && main !== sub) return `${main}
${sub}`;
    if (!main && sub && group) return `${group}
${sub}`;
    return main || sub || "";
  });
}


/* === 2026-05-28 DB관리 렌더링 경량화/컬럼 정합성 보강 === */
let estimateDbInitialSanitizeDone = false;
const estimateDbNormalizedTabSet = new Set();
function normalizeEstimateDbSheetColumnLengths(sheet = getEstimateDbSheet()) {
  if (!sheet) return 0;
  const headerRows = Array.isArray(sheet.headerRows) ? sheet.headerRows : [];
  const maxHeaderLen = Math.max(0, ...headerRows.map(row => Array.isArray(row) ? row.length : 0));
  const requestLen = Array.isArray(sheet.requestRow) ? sheet.requestRow.length : 0;
  const rowLen = Math.max(0, ...(sheet.rows || []).map(row => Array.isArray(row) ? row.length : 0));
  const colCount = Math.max(maxHeaderLen, requestLen, rowLen);
  headerRows.forEach(row => {
    while (row.length < colCount) row.push("");
    if (row.length > colCount) row.length = colCount;
  });
  if (Array.isArray(sheet.requestRow)) {
    while (sheet.requestRow.length < colCount) sheet.requestRow.push("");
    if (sheet.requestRow.length > colCount) sheet.requestRow.length = colCount;
  }
  (sheet.rows || []).forEach(row => {
    while (row.length < colCount) row.push("");
    if (row.length > colCount) row.length = colCount;
  });
  return colCount;
}
function normalizeEstimateDbActiveSheetColumns() {
  normalizeEstimateDbSheetColumnLengths(getEstimateDbSheet(estimateDbActiveTab));
  estimateDbNormalizedTabSet.add(estimateDbActiveTab);
}

function getEstimateDbRows(sheet = getEstimateDbSheet()) { return sheet.rows || []; }
function getEstimateDbYears() {
  const years = new Set();
  Object.values(estimateDbSheets).forEach(sheet => (sheet.rows || []).forEach(row => {
    const year = parseEstimateDbYear(row[0] || row[5] || "");
    if (year) years.add(year);
  }));
  if (!years.size) years.add(String(new Date().getFullYear()));
  return [...years].sort();
}
function getSelectedEstimateDbYear() {
  const select = document.getElementById("estimateDbYearSelect");
  return select?.value || getEstimateDbYears()[0] || String(new Date().getFullYear());
}
function syncEstimateDbYearOptions() {
  const select = document.getElementById("estimateDbYearSelect");
  if (!select) return;
  const current = select.value;
  const years = getEstimateDbYears();
  select.innerHTML = years.map(y => `<option value="${escapeEstimateDbHtml(y)}">${escapeEstimateDbHtml(y)}년</option>`).join("");
  select.value = years.includes(current) ? current : (years[0] || String(new Date().getFullYear()));
}
function setEstimateDbTab(tab) {
  if (!estimateDbSheets[tab]) return;
  estimateDbActiveTab = tab;
  setEstimateDbPageIndex(tab, 0);
  estimateDbSelectedCell = { tab, sectionIndex: null, rowIndex: 0, colIndex: 0 };
  renderEstimateDbManage({ renderReportsNow: false });
}
function setEstimateDbReportTab(tab) {
  if (!estimateDbReportTabs[tab]) return;
  estimateDbReportActiveTab = tab;
  renderEstimateDbReports();
}
function estimateDbDisplayLength(value) {
  return String(value ?? "").split("").reduce((sum, ch) => sum + (ch.charCodeAt(0) > 127 ? 1.65 : 1), 0);
}
function getEstimateDbColumnWidthMeasureValue(value, tab = estimateDbActiveTab, colIndex = 0, sheet = getEstimateDbSheet(tab)) {
  const rich = parseEstimateDbRichCellValue(value);
  if (rich?.type === "progressDone") return rich.history || "기성청구완료";
  if (rich?.type === "stageFormula") {
    const displayAmount = rich.amount ? formatEstimateDbCommaNumber(rich.amount) : "";
    return displayAmount || "0";
  }
  if (rich?.type === "progressStory") return rich.summary || "기성스토리";
  const display = getEstimateDbRichDisplayValue(value);
  if (isEstimateDbDateInputColumn(tab, colIndex)) return formatEstimateDbCompactDate(display);
  if (isEstimateDbMoneyLikeColumn(tab, colIndex, sheet) && isEstimateDbPureNumber(display)) return formatEstimateDbCommaNumber(display);
  return display || "";
}

function getEstimateDbColumnWidth(colIndex, sheet = getEstimateDbSheet(), tab = estimateDbActiveTab) {
  const headerName = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  const topHeaderName = normalizeEstimateDbText(sheet?.headerRows?.[0]?.[colIndex] || "");
  if (headerName === "PJ NO") return 94;
  if (tab === "progress") {
    if (headerName === "계약금액(VAT포함)" || topHeaderName === "계약금액(VAT포함)") return 170;
    if (headerName === "계약금액" || topHeaderName === "계약금액") return 140;
    if (/^A-\d+$/.test(headerName)) return 150;
  }
  if (tab === "pj") {
    // PJ관리 고정 가독성 폭: 기존 localStorage 열 너비 조절값보다 우선 적용합니다.
    // - 국내/해외는 절반 수준으로 축소
    // - 거래처명은 현재 기준 1.3배 수준으로 확대하고 2줄 표시 가능하게 확보
    // - 프로젝트명은 기존 강제 확장 폭(1040px)의 1/2 수준으로 축소
    if (headerName === "국내/해외") return 58;
    if (headerName === "거래처명") return 304;
    if (headerName === "프로젝트명") return 520;
    if (headerName === "건물용도") return 90;
    // 프로젝트 연결은 Enter 명령 셀이므로 최소 폭만 확보합니다.
    if (headerName === ESTIMATE_DB_PROJECT_LINK_HEADER) return 130;
  }

  const override = estimateDbColumnWidthOverrides?.[tab]?.[colIndex];
  if (Number.isFinite(Number(override)) && Number(override) > 0) return Number(override);

  const values = [];
  (sheet.headerRows || []).forEach(row => values.push(row[colIndex] || ""));
  (sheet.rows || []).slice(0, 30).forEach(row => values.push(getEstimateDbColumnWidthMeasureValue(row[colIndex] || "", tab, colIndex, sheet)));
  const maxLen = Math.max(8, ...values.map(estimateDbDisplayLength));
  return Math.max(140, Math.min(260, Math.ceil(maxLen * 11 + 56)));
}
function setEstimateDbColumnWidth(tab, colIndex, width) {
  const safeTab = estimateDbSheets[tab] ? tab : estimateDbActiveTab;
  if (!estimateDbColumnWidthOverrides[safeTab]) estimateDbColumnWidthOverrides[safeTab] = {};
  estimateDbColumnWidthOverrides[safeTab][colIndex] = Math.max(72, Math.min(760, Math.round(Number(width) || 140)));
}
function makeEstimateDbCellStyle(colIndex, sheet = getEstimateDbSheet()) {
  const width = getEstimateDbColumnWidth(colIndex, sheet, estimateDbActiveTab);
  return `style="min-width:${width}px;width:${width}px;max-width:${width}px;"`;
}

function openEstimateDbRowHeightPrompt() {
  const current = Number(estimateDbRowHeightPx) || 44;
  const input = prompt("DB관리 행 세로길이를 px 단위로 입력하세요.\n예: 44, 52, 60", String(current));
  if (input == null) return;
  const next = Math.round(Number(String(input).replace(/[^0-9.]/g, "")));
  if (!Number.isFinite(next) || next < 28 || next > 120) {
    if (typeof showToast === "function") showToast("행 세로길이는 28~120px 사이로 입력해 주세요.");
    return;
  }
  estimateDbRowHeightPx = next;
  localStorage.setItem("estimateDbRowHeightPx", String(next));
  renderEstimateDbManage();
  if (typeof showToast === "function") showToast(`DB관리 행 세로길이를 ${next}px로 변경했습니다.`);
}
function toggleEstimateDbColumnResizeMode() {
  estimateDbColumnResizeMode = !estimateDbColumnResizeMode;
  renderEstimateDbManage();
  if (typeof showToast === "function") showToast(estimateDbColumnResizeMode ? "열 너비 조절 모드를 켰습니다. 헤더 오른쪽 선을 드래그하세요." : "열 너비 조절 모드를 껐습니다.");
}
function renderEstimateDbColumnResizeHandle(colIndex) {
  return estimateDbColumnResizeMode ? `<span class="quote-db-col-resize-handle" title="드래그해서 열 너비 조절" onmousedown="startEstimateDbColumnResize(event, ${colIndex})"></span>` : "";
}
function startEstimateDbColumnResize(event, colIndex) {
  event.preventDefault();
  event.stopPropagation();
  const th = event.currentTarget?.closest?.("th");
  const sheet = getEstimateDbSheet();
  estimateDbColumnResizeState = {
    tab: estimateDbActiveTab,
    colIndex,
    startX: event.clientX,
    startWidth: th?.offsetWidth || getEstimateDbColumnWidth(colIndex, sheet, estimateDbActiveTab)
  };
  document.body.classList.add("estimate-db-resizing");
}
function handleEstimateDbColumnResizeMove(event) {
  const state = estimateDbColumnResizeState;
  if (!state) return;
  const nextWidth = state.startWidth + (event.clientX - state.startX);
  setEstimateDbColumnWidth(state.tab, state.colIndex, nextWidth);
  document.querySelectorAll(`.quote-db-table [data-resize-col="${state.colIndex}"]`).forEach(cell => {
    const width = getEstimateDbColumnWidth(state.colIndex, getEstimateDbSheet(state.tab), state.tab);
    cell.style.minWidth = `${width}px`;
    cell.style.width = `${width}px`;
    cell.style.maxWidth = `${width}px`;
  });
}
function stopEstimateDbColumnResize() {
  if (!estimateDbColumnResizeState) return;
  estimateDbColumnResizeState = null;
  document.body.classList.remove("estimate-db-resizing");
}
document.addEventListener("mousemove", handleEstimateDbColumnResizeMove);
document.addEventListener("mouseup", stopEstimateDbColumnResize);
function escapeEstimateDbHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isEstimateDbEmbeddedTotalRow(sheet, row) {
  if (!isEstimateDbTotalEnabled(sheet) || !row) return false;
  const firstText = normalizeEstimateDbText(row[0]);
  const firstFourBlank = [0, 1, 2, 3].every(i => !normalizeEstimateDbText(row[i]));
  const hasNumericAfter = row.slice(4).some(v => toEstimateDbNumber(v) !== 0);
  return firstText === "합계" || (firstFourBlank && hasNumericAfter);
}
function sanitizeEstimateDbSheetRows(sheet) {
  if (!sheet?.rows || !isEstimateDbTotalEnabled(sheet)) return;
  sheet.rows = sheet.rows.filter(row => !isEstimateDbEmbeddedTotalRow(sheet, row));
}

function parseEstimateDbRichCellValue(value) {
  const raw = String(value ?? "");
  if (!raw.startsWith("__ESTIMATE_DB_RICH__")) return null;
  try {
    return JSON.parse(raw.replace(/^__ESTIMATE_DB_RICH__/, ""));
  } catch (_) {
    return null;
  }
}
function stringifyEstimateDbRichCellValue(data) {
  return `__ESTIMATE_DB_RICH__${JSON.stringify(data || {})}`;
}
function getEstimateDbRichDisplayValue(value) {
  const parsed = parseEstimateDbRichCellValue(value);
  if (!parsed) return value;
  if (parsed.type === "stageFormula") return parsed.amount ? String(parsed.amount) : "";
  if (parsed.type === "contractAmount") {
    const amount = parsed.amount ? formatEstimateDbCommaNumber(parsed.amount) : "";
    const date = parsed.date ? formatEstimateDbFullKoreanDate(parsed.date) : "";
    return [amount, date].filter(Boolean).join("\n");
  }
  if (parsed.type === "progressStory") return parsed.summary || parsed.full || "";
  return value;
}
function getEstimateDbStoryColumnIndex() {
  return getEstimateDbColumnIndexByHeader("progress", "기성스토리");
}
function isEstimateDbContractAmountBreakdownColumn(tab = estimateDbActiveTab, colIndex = 0) {
  if (tab !== "progress") return false;
  const label = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  return /^A-\d+$/.test(label);
}
function getEstimateDbContractAmountBreakdownIndexes() {
  const sheet = estimateDbSheets.progress;
  return getEstimateDbLeafColumns(sheet)
    .map((label, index) => ({ label: normalizeEstimateDbText(label), index }))
    .filter(item => /^A-\d+$/.test(item.label))
    .sort((a, b) => Number(a.label.replace("A-", "")) - Number(b.label.replace("A-", "")))
    .map(item => item.index);
}
function getEstimateDbContractAmountColumnIndex() {
  return getEstimateDbColumnIndexByHeader("progress", "계약금액");
}
function getEstimateDbContractVatColumnIndex() {
  return getEstimateDbColumnIndexByHeader("progress", "계약금액(VAT포함)");
}
function parseEstimateDbContractAmountValue(value) {
  const rich = parseEstimateDbRichCellValue(value);
  if (rich?.type === "contractAmount") return { amount: String(rich.amount || ""), date: String(rich.date || "") };
  const text = String(value || "");
  const lines = text.split(/\n+/).map(v => v.trim()).filter(Boolean);
  return { amount: String(toEstimateDbNumber(lines[0] || text) || ""), date: lines[1] || "" };
}
function stringifyEstimateDbContractAmountValue(amount = "", date = "") {
  const normalizedAmount = String(amount || "").replace(/[^0-9.-]/g, "");
  const normalizedDate = normalizeEstimateDbCreatedDate(date || "");
  return stringifyEstimateDbRichCellValue({ type: "contractAmount", amount: normalizedAmount, date: normalizedDate });
}
function formatEstimateDbContractAmountDisplay(value) {
  const parsed = parseEstimateDbContractAmountValue(value);
  const amount = parsed.amount ? formatEstimateDbCommaNumber(parsed.amount) : "";
  const date = parsed.date ? formatEstimateDbFullKoreanDate(parsed.date) : "";
  return [amount, date].filter(Boolean).join("\n");
}

function isEstimateDbStoryCell(tab = estimateDbActiveTab, colIndex = 0) {
  return tab === "progress" && colIndex === getEstimateDbStoryColumnIndex();
}
function isEstimateDbStageEntryCell(tab = estimateDbActiveTab, colIndex = 0) {
  if (tab !== "progress") return false;
  const sheet = estimateDbSheets.progress;
  const bottom = sheet?.headerRows?.[1] || [];
  const label = normalizeEstimateDbText(bottom[colIndex]);
  if (!/^\d+차기성$/.test(label)) return false;
  const group = getEstimateDbProgressGroupNameByColumn(colIndex);
  return /세금계산서|입금예정일|입금일/.test(group);
}
function pruneEstimateDbProgressInitialStageColumns() {
  const sheet = estimateDbSheets.progress;
  if (!sheet || sheet.__stagePrunedToThree) return;
  const top = sheet.headerRows?.[0] || [];
  const bottom = sheet.headerRows?.[1] || [];
  let current = "";
  for (let i = bottom.length - 1; i >= 0; i -= 1) {
    const main = normalizeEstimateDbText(top[i]);
    if (main) current = "";
  }
  let group = "";
  const removeIndexes = [];
  top.forEach((cell, i) => {
    const main = normalizeEstimateDbText(cell);
    if (main) group = main;
    const sub = normalizeEstimateDbText(bottom[i]);
    if (/세금계산서|입금예정일|입금일/.test(group) && /^[45]차기성$/.test(sub)) removeIndexes.push(i);
  });
  removeIndexes.reverse().forEach(i => {
    top.splice(i, 1);
    bottom.splice(i, 1);
    if (sheet.requestRow) sheet.requestRow.splice(i, 1);
    (sheet.rows || []).forEach(row => row.splice(i, 1));
  });
  sheet.__stagePrunedToThree = true;
}
function evaluateEstimateDbFormulaExpression(expr) {
  const raw = String(expr || "").replace(/,/g, "").trim();
  if (!raw) return 0;
  if (!/^[0-9+\-*/().\s]+$/.test(raw)) throw new Error("허용되지 않는 문자가 포함되어 있습니다.");
  const result = Function(`"use strict"; return (${raw});`)();
  if (!Number.isFinite(result)) throw new Error("계산 결과가 올바르지 않습니다.");
  return Math.round(result);
}
function ensureEstimateDbStoryModal() {
  let modal = document.getElementById("estimateDbStoryModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbStoryModal";
  modal.className = "estimate-db-dropdown-modal hidden";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box estimate-db-story-box" role="dialog" aria-modal="true" style="max-width:820px;">
      <div class="estimate-db-dropdown-title">기성스토리 상세 입력</div>
      <label class="estimate-db-amount-label">요약본<input id="estimateDbStorySummary" class="estimate-db-dropdown-search" placeholder="표 셀에 보일 간략 내용을 입력" /></label>
      <label class="estimate-db-amount-label">풀 스토리<textarea id="estimateDbStoryFull" class="estimate-db-dropdown-search" style="min-height:220px;resize:vertical;" placeholder="상세 내용을 입력합니다. 줄바꿈은 Shift+Enter"></textarea></label>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbStoryModal()">닫기</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbStoryModal()">저장</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("mousedown", event => { if (event.target === modal) closeEstimateDbStoryModal(); });
  modal.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); closeEstimateDbStoryModal(); }
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); saveEstimateDbStoryModal(); }
  });
  return modal;
}
let estimateDbStoryModalState = null;
function openEstimateDbStoryModal(rowIndex, colIndex) {
  commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
  const row = getEstimateDbRows()?.[rowIndex];
  const raw = row?.[colIndex] || "";
  const parsed = parseEstimateDbRichCellValue(raw) || { type: "progressStory", summary: String(raw || ""), full: String(raw || "") };
  estimateDbStoryModalState = { rowIndex, colIndex };
  const modal = ensureEstimateDbStoryModal();
  modal.querySelector("#estimateDbStorySummary").value = parsed.summary || "";
  modal.querySelector("#estimateDbStoryFull").value = parsed.full || "";
  modal.classList.remove("hidden");
  setTimeout(() => modal.querySelector("#estimateDbStoryFull")?.focus(), 0);
}
function closeEstimateDbStoryModal() {
  document.getElementById("estimateDbStoryModal")?.classList.add("hidden");
  estimateDbStoryModalState = null;
}
function saveEstimateDbStoryModal() {
  const state = estimateDbStoryModalState;
  if (!state) return;
  const summary = document.getElementById("estimateDbStorySummary")?.value || "";
  const full = document.getElementById("estimateDbStoryFull")?.value || "";
  const value = stringifyEstimateDbRichCellValue({ type: "progressStory", summary, full });
  updateEstimateDbCell(state.rowIndex, state.colIndex, value, { commit: true, silentRender: true });
  closeEstimateDbStoryModal();
  renderEstimateDbManage();
  requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}
function ensureEstimateDbStageFormulaModal() {
  let modal = document.getElementById("estimateDbStageFormulaModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbStageFormulaModal";
  modal.className = "estimate-db-dropdown-modal hidden";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box estimate-db-stage-formula-box" role="dialog" aria-modal="true" style="max-width:760px;">
      <div class="estimate-db-dropdown-title">N차 기성 계산 입력</div>
      <label class="estimate-db-amount-label">계산식<input id="estimateDbStageFormulaExpr" class="estimate-db-dropdown-search" placeholder="예: 100000+200000*0.5" /></label>
      <label class="estimate-db-amount-label">비고<textarea id="estimateDbStageFormulaNote" class="estimate-db-dropdown-search" style="min-height:150px;resize:vertical;" placeholder="기성 상세 스토리 또는 비고를 입력합니다."></textarea></label>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbStageFormulaModal()">닫기</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbStageFormulaModal()">계산 반영</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("mousedown", event => { if (event.target === modal) closeEstimateDbStageFormulaModal(); });
  modal.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); closeEstimateDbStageFormulaModal(); return; }
    if (event.key === "ArrowDown" && event.target?.id === "estimateDbStageFormulaExpr") { event.preventDefault(); modal.querySelector("#estimateDbStageFormulaNote")?.focus(); return; }
    if (event.key === "ArrowUp" && event.target?.id === "estimateDbStageFormulaNote") { event.preventDefault(); modal.querySelector("#estimateDbStageFormulaExpr")?.focus(); return; }
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); saveEstimateDbStageFormulaModal(); }
  });
  return modal;
}
let estimateDbStageFormulaModalState = null;
function openEstimateDbStageFormulaModal(rowIndex, colIndex) {
  commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
  const row = getEstimateDbRows()?.[rowIndex];
  const raw = row?.[colIndex] || "";
  const parsed = parseEstimateDbRichCellValue(raw) || { type: "stageFormula", formula: String(raw || "").replace(/,/g, ""), note: "", amount: toEstimateDbNumber(raw) };
  estimateDbStageFormulaModalState = { rowIndex, colIndex };
  const modal = ensureEstimateDbStageFormulaModal();
  modal.querySelector("#estimateDbStageFormulaExpr").value = parsed.formula || parsed.amount || "";
  modal.querySelector("#estimateDbStageFormulaNote").value = parsed.note || "";
  modal.classList.remove("hidden");
  setTimeout(() => modal.querySelector("#estimateDbStageFormulaExpr")?.focus(), 0);
}
function closeEstimateDbStageFormulaModal() {
  document.getElementById("estimateDbStageFormulaModal")?.classList.add("hidden");
  estimateDbStageFormulaModalState = null;
}
function saveEstimateDbStageFormulaModal() {
  const state = estimateDbStageFormulaModalState;
  if (!state) return;
  const expr = document.getElementById("estimateDbStageFormulaExpr")?.value || "";
  const note = document.getElementById("estimateDbStageFormulaNote")?.value || "";
  let amount = 0;
  try { amount = evaluateEstimateDbFormulaExpression(expr); }
  catch (error) { if (typeof showToast === "function") showToast(error.message || "계산식을 확인해주세요."); return; }
  const value = stringifyEstimateDbRichCellValue({ type: "stageFormula", formula: expr, note, amount: String(amount) });
  updateEstimateDbCell(state.rowIndex, state.colIndex, value, { commit: true, silentRender: true });
  closeEstimateDbStageFormulaModal();
  renderEstimateDbManage();
  requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}

let estimateDbContractAmountModalState = null;
function ensureEstimateDbContractAmountModal() {
  let modal = document.getElementById("estimateDbContractAmountModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbContractAmountModal";
  modal.className = "estimate-db-dropdown-modal hidden";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box estimate-db-contract-amount-box" role="dialog" aria-modal="true" style="max-width:620px;">
      <div class="estimate-db-dropdown-title" id="estimateDbContractAmountTitle">계약금액 분할 입력</div>
      <label class="estimate-db-amount-label">금액<input id="estimateDbContractAmountValue" class="estimate-db-dropdown-search" placeholder="예: 272250000" inputmode="numeric" /></label>
      <label class="estimate-db-amount-label">날짜<input id="estimateDbContractAmountDate" class="estimate-db-dropdown-search" placeholder="예: 260529 또는 2026-05-29" /></label>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbContractAmountModal()">닫기</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbContractAmountModal()">저장</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("mousedown", event => {
    if (event.target === modal) closeEstimateDbContractAmountModal();
  });
  modal.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); closeEstimateDbContractAmountModal(); return; }
    if (event.key === "ArrowDown" && event.target?.id === "estimateDbContractAmountValue") {
      event.preventDefault();
      modal.querySelector("#estimateDbContractAmountDate")?.focus();
      return;
    }
    if (event.key === "ArrowUp" && event.target?.id === "estimateDbContractAmountDate") {
      event.preventDefault();
      modal.querySelector("#estimateDbContractAmountValue")?.focus();
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); saveEstimateDbContractAmountModal(); }
  });
  return modal;
}
function openEstimateDbContractAmountModal(rowIndex = estimateDbSelectedCell?.rowIndex || 0, colIndex = estimateDbSelectedCell?.colIndex || 0) {
  if (!isEstimateDbContractAmountBreakdownColumn(estimateDbActiveTab, colIndex)) return false;
  commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
  const row = getEstimateDbRows()?.[rowIndex];
  const parsed = parseEstimateDbContractAmountValue(row?.[colIndex] || "");
  estimateDbContractAmountModalState = { tab: estimateDbActiveTab, rowIndex, colIndex };
  const modal = ensureEstimateDbContractAmountModal();
  modal.querySelector("#estimateDbContractAmountTitle").textContent = `${getEstimateDbColumnName(estimateDbActiveTab, colIndex)} 금액/날짜 입력`;
  modal.querySelector("#estimateDbContractAmountValue").value = parsed.amount ? formatEstimateDbCommaNumber(parsed.amount) : "";
  modal.querySelector("#estimateDbContractAmountDate").value = parsed.date ? formatEstimateDbFullKoreanDate(parsed.date) : "";
  modal.classList.remove("hidden");
  setTimeout(() => modal.querySelector("#estimateDbContractAmountValue")?.focus(), 0);
  return true;
}
function closeEstimateDbContractAmountModal() {
  document.getElementById("estimateDbContractAmountModal")?.classList.add("hidden");
  estimateDbContractAmountModalState = null;
}
function saveEstimateDbContractAmountModal() {
  const state = estimateDbContractAmountModalState;
  if (!state) return;
  const amountInput = document.getElementById("estimateDbContractAmountValue");
  const dateInput = document.getElementById("estimateDbContractAmountDate");
  const amount = normalizeEstimateDbText(amountInput?.value || "");
  const date = normalizeEstimateDbText(dateInput?.value || "");
  const value = stringifyEstimateDbContractAmountValue(amount, date);
  updateEstimateDbCell(state.rowIndex, state.colIndex, value, { commit: true, silentRender: true });
  closeEstimateDbContractAmountModal();
  renderEstimateDbManage({ forceRecalc: true });
  requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}

function ensureEstimateDbProgressDoneColumn() {
  const sheet = estimateDbSheets.progress;
  if (!sheet?.headerRows?.length) return;
  const idx = getEstimateDbColumnIndexByHeader("progress", "기성청구완료");
  if (idx >= 0) return;
  sheet.headerRows.forEach((row, rowIndex) => row.push(rowIndex === 0 ? "기성청구완료" : ""));
  if (Array.isArray(sheet.requestRow)) sheet.requestRow.push("기성청구가 완료되어 더 이상 확인이 필요 없는 행을 체크합니다.");
  (sheet.rows || []).forEach(row => row.push(""));
}

function sanitizeEstimateDbSheetsBeforeRender() {
  ensureEstimateDbProgressDoneColumn();
  ensureEstimateDbProgressContractAmountColumns();
  pruneEstimateDbProgressInitialStageColumns();
  sanitizeEstimateDbSheetRows(estimateDbSheets.progress);
  sanitizeEstimateDbSheetRows(estimateDbSheets.mep);
}
function setEstimateDbValueByHeader(tab, row, headerName, value) {
  const idx = getEstimateDbColumnIndexByHeader(tab, headerName);
  if (idx >= 0) row[idx] = value;
}

function getEstimateDbProgressGroupIndexes(groupKeyword) {
  const sheet = estimateDbSheets.progress;
  const top = sheet?.headerRows?.[0] || [];
  let current = "";
  const indexes = [];
  top.forEach((cell, i) => {
    const text = normalizeEstimateDbText(cell);
    if (text) current = text;
    if (current.includes(groupKeyword)) indexes.push(i);
  });
  return indexes;
}
function ensureEstimateDbProgressContractAmountColumns() {
  const sheet = estimateDbSheets.progress;
  if (!sheet?.headerRows || sheet.headerRows.length < 2) return;
  const top = sheet.headerRows[0];
  const bottom = sheet.headerRows[1];
  const leaf = getEstimateDbLeafColumns(sheet);
  let contractIndex = leaf.findIndex(v => normalizeEstimateDbText(v) === "계약금액");
  if (contractIndex < 0) contractIndex = top.findIndex(v => normalizeEstimateDbText(v) === "계약금액");
  if (contractIndex < 0) return;

  const hasVat = leaf.some(v => normalizeEstimateDbText(v) === "계약금액(VAT포함)") || top.some(v => normalizeEstimateDbText(v) === "계약금액(VAT포함)");
  if (!hasVat) {
    top.splice(contractIndex, 0, "계약금액(VAT포함)");
    bottom.splice(contractIndex, 0, "");
    if (sheet.requestRow) sheet.requestRow.splice(contractIndex, 0, "계약금액A × 1.1 자동 계산");
    (sheet.rows || []).forEach(row => row.splice(contractIndex, 0, ""));
    contractIndex += 1;
  }

  const currentLeaf = getEstimateDbLeafColumns(sheet);
  contractIndex = currentLeaf.findIndex(v => normalizeEstimateDbText(v) === "계약금액");
  if (contractIndex < 0) contractIndex = top.findIndex(v => normalizeEstimateDbText(v) === "계약금액");
  const existingBreakdowns = getEstimateDbLeafColumns(sheet).filter(v => /^A-\d+$/.test(normalizeEstimateDbText(v)));
  if (!existingBreakdowns.length) {
    const existingAmounts = (sheet.rows || []).map(row => row?.[contractIndex] || "");
    for (let n = 1; n <= 3; n += 1) {
      const insertAt = contractIndex + n;
      top.splice(insertAt, 0, "");
      bottom.splice(insertAt, 0, `A-${n}`);
      if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, "계약금액 분할 입력: Enter로 금액/날짜 입력");
      (sheet.rows || []).forEach((row, rowIndex) => row.splice(insertAt, 0, n === 1 ? existingAmounts[rowIndex] || "" : ""));
    }
  } else {
    const nums = existingBreakdowns.map(v => Number(normalizeEstimateDbText(v).replace("A-", ""))).filter(Number.isFinite);
    const max = nums.length ? Math.max(...nums) : 0;
    for (let n = max + 1; n <= 3; n += 1) {
      const indexes = getEstimateDbContractAmountBreakdownIndexes();
      const insertAt = indexes.length ? Math.max(...indexes) + 1 : contractIndex + 1;
      top.splice(insertAt, 0, "");
      bottom.splice(insertAt, 0, `A-${n}`);
      if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, "계약금액 분할 입력: Enter로 금액/날짜 입력");
      (sheet.rows || []).forEach(row => row.splice(insertAt, 0, ""));
    }
  }
  sanitizeEstimateDbSheetRows(sheet);
}
function addEstimateDbProgressContractAmountColumn() {
  const sheet = estimateDbSheets.progress;
  if (!sheet?.headerRows || sheet.headerRows.length < 2) return;
  ensureEstimateDbProgressContractAmountColumns();
  const indexes = getEstimateDbContractAmountBreakdownIndexes();
  const next = indexes.length ? Math.max(...indexes.map(i => Number(normalizeEstimateDbText(getEstimateDbColumnName("progress", i)).replace("A-", "")))) + 1 : 1;
  const insertAt = indexes.length ? Math.max(...indexes) + 1 : getEstimateDbContractAmountColumnIndex() + 1;
  sheet.headerRows[0].splice(insertAt, 0, "");
  sheet.headerRows[1].splice(insertAt, 0, `A-${next}`);
  if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, "추가 계약금액 분할 입력: Enter로 금액/날짜 입력");
  (sheet.rows || []).forEach(row => row.splice(insertAt, 0, ""));
  estimateDbSelectedCell = { tab: "progress", sectionIndex: null, rowIndex: estimateDbSelectedCell?.rowIndex || 0, colIndex: insertAt };
  renderEstimateDbManage({ forceRecalc: true });
  requestAnimationFrame(() => focusEstimateDbCell(estimateDbSelectedCell.rowIndex || 0, insertAt));
  if (typeof showToast === "function") showToast(`계약금액A-${next} 열을 추가했습니다.`);
}

function ensureEstimateDbProgressStageTotalColumns() {
  const sheet = estimateDbSheets.progress;
  if (!sheet?.headerRows || sheet.headerRows.length < 2) return;
  const top = sheet.headerRows[0];
  const bottom = sheet.headerRows[1];
  ["세금계산서", "입금예정일", "입금일"].forEach(group => {
    const indexes = getEstimateDbProgressGroupIndexes(group);
    if (!indexes.length) return;
    const last = Math.max(...indexes);
    if (normalizeEstimateDbText(bottom[last]) === "합계") return;
    const insertAt = last + 1;
    top.splice(insertAt, 0, "");
    bottom.splice(insertAt, 0, "합계");
    if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, "계약금부터 마지막 기성 차수까지 자동 합계");
    (sheet.rows || []).forEach(row => row.splice(insertAt, 0, ""));
  });
}
function getEstimateDbProgressOutsourceIndexes() {
  const sheet = estimateDbSheets.progress;
  const top = sheet?.headerRows?.[0] || [];
  const leaf = getEstimateDbLeafColumns(sheet);
  const targets = ["기계", "전기", "외주", "송무", "기타"];
  let activeGroup = "";
  return leaf.reduce((list, label, index) => {
    const topLabel = normalizeEstimateDbText(top[index]);
    if (topLabel) activeGroup = topLabel.replace(/\s+/g, "");
    if (activeGroup.includes("외주금액") && targets.includes(normalizeEstimateDbText(label))) list.push(index);
    return list;
  }, []);
}
function getEstimateDbProgressOutsourceTotalIndex() {
  const sheet = estimateDbSheets.progress;
  const top = sheet?.headerRows?.[0] || [];
  const leaf = getEstimateDbLeafColumns(sheet);
  let activeGroup = "";
  for (let i = 0; i < leaf.length; i += 1) {
    const topLabel = normalizeEstimateDbText(top[i]);
    if (topLabel) activeGroup = topLabel.replace(/\s+/g, "");
    if (activeGroup.includes("외주금액") && normalizeEstimateDbText(leaf[i]) === "합계") return i;
  }
  return -1;
}
function recalcEstimateDbProgressOutsourceTotal(row) {
  if (!row) return;
  const totalIndex = getEstimateDbProgressOutsourceTotalIndex();
  if (totalIndex < 0) return;
  const sum = getEstimateDbProgressOutsourceIndexes().reduce((acc, i) => {
    const parsed = parseEstimateDbAmountCellValue(row[i]);
    return acc + toEstimateDbNumber(parsed.amount || row[i]);
  }, 0);
  // 외주금액 기계/전기/외주/송무/기타의 합산값은 항상 외주금액 합계에 반영합니다.
  row[totalIndex] = sum ? String(sum) : "";
}
function recalcEstimateDbProgressStageTotals(row) {
  if (!row) return;
  const sheet = estimateDbSheets.progress;
  const bottom = sheet?.headerRows?.[1] || [];
  ["세금계산서", "입금예정일", "입금일"].forEach(group => {
    const indexes = getEstimateDbProgressGroupIndexes(group);
    if (!indexes.length) return;
    const totalIndex = indexes.find(i => normalizeEstimateDbText(bottom[i]) === "합계");
    if (totalIndex < 0) return;
    const sum = indexes.reduce((acc, i) => {
      const label = normalizeEstimateDbText(bottom[i]);
      if (i === totalIndex || label === "합계") return acc;
      if (label === "계약금" || /^\d+차기성$/.test(label)) return acc + toEstimateDbNumber(row[i]);
      return acc;
    }, 0);
    row[totalIndex] = sum ? String(sum) : "";
  });
}
function recalcEstimateDbRow(tab, row) {
  if (!row) return;
  const idx = name => getEstimateDbColumnIndexByHeader(tab, name);
  const get = name => idx(name) >= 0 ? toEstimateDbNumber(row[idx(name)]) : 0;
  const set = (name, value) => { const i = idx(name); if (i >= 0) row[i] = value ? String(value) : ""; };
  if (tab === "pj") {
    const m2Index = idx("연면적(m2)");
    const pyIndex = idx("연면적(평)");
    if (m2Index >= 0 && pyIndex >= 0) {
      const m2Value = toEstimateDbNumber(row[m2Index]);
      if (m2Value) {
        const pyValue = Math.ceil(m2Value * 0.3025);
        row[pyIndex] = String(pyValue);
      } else if (!normalizeEstimateDbText(row[m2Index])) {
        row[pyIndex] = "";
      }
    }
  }
  if (tab === "progress") {
    const contractBreakdownSum = getEstimateDbContractAmountBreakdownIndexes().reduce((sum, i) => sum + toEstimateDbNumber(row[i]), 0);
    const contractIndex = getEstimateDbContractAmountColumnIndex();
    const vatIndex = getEstimateDbContractVatColumnIndex();
    if (contractIndex >= 0) row[contractIndex] = contractBreakdownSum ? String(contractBreakdownSum) : "";
    if (vatIndex >= 0) row[vatIndex] = contractBreakdownSum ? String(Math.round(contractBreakdownSum * 1.1)) : "";
    const balance = contractBreakdownSum - get("수령액");
    set("잔액", balance);
    recalcEstimateDbProgressOutsourceTotal(row);
    const waiting = balance - get("발행완료") - get("납품완료") - get("작업진행중") - get("작업취소");
    set("작업대기중", waiting);
    recalcEstimateDbProgressStageTotals(row);
  }
  if (tab === "mep") {
    const balance = get("계약금액") - get("수령액");
    set("잔액", balance);
    const waiting = balance - get("발행완료") - get("납품완료") - get("작업진행중") - get("작업취소");
    set("작업대기중", waiting);
  }
}
function recalcAllEstimateDbRows() {
  Object.keys(estimateDbSheets).forEach(tab => (estimateDbSheets[tab].rows || []).forEach(row => recalcEstimateDbRow(tab, row)));
}

/* =========================================================
   DB관리 성능 구조 변경
   - 전체 탭 재계산 대신 현재 탭만 재계산
   - 대량 행은 50개 단위 페이지 렌더링
   ========================================================= */
const ESTIMATE_DB_RENDER_PAGE_SIZE = 50;
let estimateDbPageState = { pj: 0, progress: 0, mep: 0 };
let estimateDbMepSelectedVendorIndex = null;

function getEstimateDbMepVendorHeaders() {
  const sheet = estimateDbSheets?.mep || {};
  return Array.isArray(sheet.vendorHeaders) && sheet.vendorHeaders.length
    ? sheet.vendorHeaders
    : ["NO", "업체명", "공종", "대표이사", "일반전화", "휴대폰", "직통전화", "EMAIL (대표)", "대표번호", "EMAIL", "EMAIL1", "연락처(경지)", "연락처(기술)", "계좌", "은행", "주소", "웹하드", "기타"];
}

function ensureEstimateDbMepVendorRows() {
  const sheet = estimateDbSheets?.mep;
  if (!sheet) return [];
  const headers = getEstimateDbMepVendorHeaders();
  if (!Array.isArray(sheet.vendorRows)) sheet.vendorRows = [];
  if (!sheet.vendorRows.length) {
    const companyIdx = getEstimateDbColumnIndexByHeader("mep", "계약업체");
    const rows = Array.isArray(sheet.rows) ? sheet.rows : [];
    const names = [...new Set(rows.map(row => normalizeEstimateDbText(row?.[companyIdx])).filter(Boolean))];
    sheet.vendorRows = names.map((name, index) => {
      const next = Array(headers.length).fill("");
      next[0] = String(index + 1);
      next[1] = name;
      return next;
    });
  }
  sheet.vendorRows.forEach((row, index) => {
    while (row.length < headers.length) row.push("");
    if (!normalizeEstimateDbText(row[0])) row[0] = String(index + 1);
  });
  return sheet.vendorRows;
}

function getEstimateDbMepSelectedVendor() {
  const rows = ensureEstimateDbMepVendorRows();
  if (estimateDbMepSelectedVendorIndex === null || estimateDbMepSelectedVendorIndex === undefined) return null;
  return rows[Number(estimateDbMepSelectedVendorIndex)] || null;
}

function selectEstimateDbMepVendor(index) {
  estimateDbMepSelectedVendorIndex = Number(index);
  renderEstimateDbManage({ renderReportsNow: false });
}

function updateEstimateDbMepVendorCell(rowIndex, colIndex, value) {
  const rows = ensureEstimateDbMepVendorRows();
  if (!rows[rowIndex]) return;
  rows[rowIndex][colIndex] = value;
  estimateDbHasUnsavedChanges = true;
  updateEstimateDbSaveButtonState?.();
}

function getEstimateDbMepVendorName(vendorRow) {
  return normalizeEstimateDbText(vendorRow?.[1]);
}

function getEstimateDbMepDetailRowsForVendor(vendorName) {
  const sheet = estimateDbSheets?.mep;
  const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
  if (!vendorName) return [];
  const companyIdx = getEstimateDbColumnIndexByHeader("mep", "계약업체");
  if (companyIdx < 0) return rows.map((row, sourceIndex) => ({ row, sourceIndex }));
  const matched = rows
    .map((row, sourceIndex) => ({ row, sourceIndex }))
    .filter(({ row }) => normalizeEstimateDbText(row?.[companyIdx]) === vendorName);
  return matched;
}

function addEstimateDbMepRowForSelectedVendor() {
  const sheet = estimateDbSheets?.mep;
  const vendor = getEstimateDbMepSelectedVendor();
  const vendorName = getEstimateDbMepVendorName(vendor);
  if (!sheet || !vendorName) {
    if (typeof showToast === "function") showToast("업체 리스트에서 업체를 먼저 선택해 주세요.");
    return;
  }
  const columns = getEstimateDbLeafColumns(sheet);
  const next = Array(columns.length).fill("");
  const createdIdx = getEstimateDbColumnIndexByHeader("mep", "최초생성날짜");
  const companyIdx = getEstimateDbColumnIndexByHeader("mep", "계약업체");
  if (createdIdx >= 0) next[createdIdx] = formatEstimateDbKoreanDate?.() || "";
  if (companyIdx >= 0) next[companyIdx] = vendorName;
  sheet.rows.push(next);
  estimateDbMepSelectedVendorIndex = estimateDbMepSelectedVendorIndex ?? 0;
  renderEstimateDbManage({ forceRecalc: true, renderReportsNow: false });
}

function renderEstimateDbMepManage(options = {}) {
  const head = document.getElementById("estimateDbHead");
  const body = document.getElementById("estimateDbBody");
  if (!head || !body) return;
  const sheet = getEstimateDbSheet("mep");
  const vendorHeaders = getEstimateDbMepVendorHeaders();
  const vendorRows = ensureEstimateDbMepVendorRows();
  const selectedVendor = getEstimateDbMepSelectedVendor();
  const selectedVendorName = getEstimateDbMepVendorName(selectedVendor);
  const detailRows = getEstimateDbMepDetailRowsForVendor(selectedVendorName);
  const leafColumns = getEstimateDbLeafColumns(sheet);
  document.querySelectorAll(".quote-db-table").forEach(table => table.style.setProperty("--estimate-db-row-height", `${estimateDbRowHeightPx}px`));
  head.innerHTML = "";
  body.innerHTML = `
    <tr class="quote-db-mep-layout-row">
      <td class="quote-db-mep-layout-cell" colspan="${Math.max(leafColumns.length + 1, 12)}">
        <div class="quote-db-mep-panel">
          <div class="quote-db-mep-section-head">
            <div>
              <strong>업체 리스트</strong>
              <span>업체를 클릭하면 아래에 해당 업체의 기전 계약/지급 내역이 표시됩니다.</span>
            </div>
            <button type="button" class="btn btn-line btn-xs" onclick="addEstimateDbMepVendorRow()">+ 업체 추가</button>
          </div>
          <div class="quote-db-mep-vendor-wrap">
            <table class="quote-db-mep-vendor-table">
              <thead>
                <tr>${vendorHeaders.map(h => `<th>${escapeEstimateDbHtml(h)}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${vendorRows.map((row, rowIndex) => `
                  <tr class="quote-db-mep-vendor-row${rowIndex === estimateDbMepSelectedVendorIndex ? " active" : ""}" onclick="selectEstimateDbMepVendor(${rowIndex})">
                    ${vendorHeaders.map((_, colIndex) => `<td><input class="quote-db-mep-vendor-input" value="${escapeEstimateDbHtml(row?.[colIndex] || "")}" onclick="event.stopPropagation()" onfocus="selectEstimateDbMepVendor(${rowIndex})" oninput="updateEstimateDbMepVendorCell(${rowIndex}, ${colIndex}, this.value)" /></td>`).join("")}
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
          <div class="quote-db-mep-section-head quote-db-mep-detail-head">
            <div>
              <strong>${selectedVendorName ? escapeEstimateDbHtml(selectedVendorName) : "업체를 선택하세요"}</strong>
              <span>${selectedVendorName ? "선택 업체의 기전업체 계약/지급 내역" : "상단 업체 리스트에서 하나를 선택하면 아래 표가 표시됩니다."}</span>
            </div>
            <button type="button" class="btn btn-primary btn-xs" onclick="addEstimateDbMepRowForSelectedVendor()" ${selectedVendorName ? "" : "disabled"}>+ 계약행 추가</button>
          </div>
          <div class="quote-db-mep-detail-wrap">
            ${selectedVendorName ? renderEstimateDbMepDetailTable(detailRows, leafColumns, sheet) : `<div class="quote-db-mep-empty">업체 리스트에서 업체를 선택해 주세요.</div>`}
          </div>
        </div>
      </td>
    </tr>
  `;
  applyEstimateDbCommaFormatToRenderedInputs();
  if (options.renderReportsNow) renderEstimateDbReports();
  else scheduleEstimateDbReportsRender(220);
}

function renderEstimateDbMepDetailTable(detailRows, leafColumns, sheet) {
  if (!detailRows.length) {
    return `<div class="quote-db-mep-empty">선택한 업체와 연결된 계약/지급 내역이 없습니다. <button type="button" class="btn btn-primary btn-xs" onclick="addEstimateDbMepRowForSelectedVendor()">계약행 추가</button></div>`;
  }
  return `
    <table class="quote-db-mep-detail-table">
      <thead>
        <tr>${leafColumns.map((col, colIndex) => `<th ${makeEstimateDbCellStyle(colIndex, sheet)}>${escapeEstimateDbHtml(col || "").replace(/\n/g, "<br>")}</th>`).join("")}<th class="quote-db-manage-col">관리</th></tr>
      </thead>
      <tbody>
        ${detailRows.map(({ row, sourceIndex }) => `
          <tr class="quote-db-mep-detail-row" data-row-index="${sourceIndex}">
            ${leafColumns.map((_, colIndex) => {
              const displayValue = formatEstimateDbMoneyDisplay(getEstimateDbCellDisplayValue("mep", sourceIndex, colIndex, row?.[colIndex] || ""), "mep", colIndex, sheet);
              const dirtyClass = getEstimateDbPendingEdit("mep", sourceIndex, colIndex) ? " quote-db-cell-dirty" : "";
              return `<td ${makeEstimateDbCellStyle(colIndex, sheet)}><input class="quote-db-cell-input${dirtyClass}" value="${escapeEstimateDbHtml(displayValue)}" data-row-index="${sourceIndex}" data-col-index="${colIndex}" onfocus="estimateDbSelectedCell={tab:'mep',sectionIndex:null,rowIndex:${sourceIndex},colIndex:${colIndex}}" oninput="handleEstimateDbCellInput(event, ${sourceIndex}, ${colIndex}, false)" onkeydown="handleEstimateDbKeydown(event)" /></td>`;
            }).join("")}
            <td class="quote-db-manage-col"><button class="btn btn-line btn-xs" type="button" onclick="removeEstimateDbRow(${sourceIndex})">삭제</button></td>
          </tr>`).join("")}
      </tbody>
    </table>`;
}

function addEstimateDbMepVendorRow() {
  const sheet = estimateDbSheets?.mep;
  if (!sheet) return;
  const headers = getEstimateDbMepVendorHeaders();
  const rows = ensureEstimateDbMepVendorRows();
  const next = Array(headers.length).fill("");
  next[0] = String(rows.length + 1);
  rows.push(next);
  estimateDbMepSelectedVendorIndex = rows.length - 1;
  estimateDbHasUnsavedChanges = true;
  updateEstimateDbSaveButtonState?.();
  renderEstimateDbManage({ renderReportsNow: false });
}

function recalcEstimateDbRowsByTab(tab = estimateDbActiveTab, options = {}) {
  const sheet = estimateDbSheets?.[tab];
  if (!sheet || !Array.isArray(sheet.rows)) return;
  // 기성관리/기전업체는 컬럼 수가 많으므로 탭 진입 시 전체 행을 재계산하지 않습니다.
  // 셀 수정/저장 시 변경 행만 recalcEstimateDbRow()로 계산하고,
  // 전체 재계산이 꼭 필요한 경우에만 force 옵션을 사용합니다.
  if ((tab === "progress" || tab === "mep") && !options.force) return;
  sheet.rows.forEach(row => recalcEstimateDbRow(tab, row));
}
function getEstimateDbPageIndex(tab = estimateDbActiveTab) {
  const value = Number(estimateDbPageState?.[tab] || 0);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}
function setEstimateDbPageIndex(tab = estimateDbActiveTab, page = 0) {
  estimateDbPageState = estimateDbPageState || { pj: 0, progress: 0, mep: 0 };
  estimateDbPageState[tab] = Math.max(0, Number(page) || 0);
}
function getEstimateDbPagedEntries(entries = [], tab = estimateDbActiveTab) {
  const total = entries.length;
  const pageSize = ESTIMATE_DB_RENDER_PAGE_SIZE;
  const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
  const page = Math.min(getEstimateDbPageIndex(tab), maxPage);
  setEstimateDbPageIndex(tab, page);
  const start = page * pageSize;
  return { entries: entries.slice(start, start + pageSize), page, maxPage, total, start, end: Math.min(total, start + pageSize) };
}
function renderEstimateDbPager(paged) {
  const wrap = document.querySelector('.quote-db-grid-wrap');
  if (!wrap || !paged) return;
  let pager = document.getElementById('estimateDbPager');
  if (!pager) {
    pager = document.createElement('div');
    pager.id = 'estimateDbPager';
    pager.className = 'quote-db-pager';
    wrap.insertAdjacentElement('afterend', pager);
  }
  const disabledPrev = paged.page <= 0 ? 'disabled' : '';
  const disabledNext = paged.page >= paged.maxPage ? 'disabled' : '';
  pager.innerHTML = `
    <div class="quote-db-pager-info">표시 ${paged.total ? (paged.start + 1).toLocaleString('ko-KR') : 0}~${paged.end.toLocaleString('ko-KR')} / 전체 ${paged.total.toLocaleString('ko-KR')}행</div>
    <div class="quote-db-pager-actions">
      <button class="btn btn-line btn-sm" type="button" ${disabledPrev} onclick="moveEstimateDbPage(-1)">이전</button>
      <span>${(paged.page + 1).toLocaleString('ko-KR')} / ${(paged.maxPage + 1).toLocaleString('ko-KR')}</span>
      <button class="btn btn-line btn-sm" type="button" ${disabledNext} onclick="moveEstimateDbPage(1)">다음</button>
    </div>`;
}
function moveEstimateDbPage(delta = 0) {
  const current = getEstimateDbPageIndex(estimateDbActiveTab);
  setEstimateDbPageIndex(estimateDbActiveTab, current + Number(delta || 0));
  estimateDbSelectedCell = { tab: estimateDbActiveTab, sectionIndex: null, rowIndex: 0, colIndex: estimateDbSelectedCell?.colIndex || 0 };
  renderEstimateDbManage();
}
function getEstimateDbStageGroups() {
  return ["세금계산서", "입금예정일", "입금일"];
}
function getEstimateDbProgressGroupNameByColumn(colIndex) {
  const sheet = estimateDbSheets.progress;
  const top = sheet?.headerRows?.[0] || [];
  let current = "";
  for (let i = 0; i <= colIndex; i += 1) {
    const text = normalizeEstimateDbText(top[i]);
    if (text) current = text;
  }
  return current;
}
function addEstimateDbProgressStageColumns() {
  const sheet = estimateDbSheets.progress;
  if (!sheet) return;
  if (estimateDbActiveTab !== "progress") estimateDbActiveTab = "progress";

  const selected = estimateDbSelectedCell || { rowIndex: 0, colIndex: 0 };
  const selectedGroup = getEstimateDbProgressGroupNameByColumn(selected.colIndex || 0);

  ensureEstimateDbProgressStageTotalColumns();
  const top = sheet.headerRows[0];
  const bottom = sheet.headerRows[1];
  const cols = getEstimateDbLeafColumns(sheet);
  const stageNumbers = cols.map(c => (normalizeEstimateDbText(c).match(/^(\d+)차기성$/) || [])[1]).filter(Boolean).map(Number);
  const next = (stageNumbers.length ? Math.max(...stageNumbers) : 5) + 1;
  const insertedIndexes = {};

  getEstimateDbStageGroups().forEach(group => {
    const groupIndexes = getEstimateDbProgressGroupIndexes(group);
    const totalIndex = groupIndexes.find(i => normalizeEstimateDbText(bottom[i]) === "합계");
    const insertAt = totalIndex >= 0 ? totalIndex : (groupIndexes.length ? Math.max(...groupIndexes) + 1 : bottom.length);
    top.splice(insertAt, 0, "");
    bottom.splice(insertAt, 0, `${next}차기성`);
    if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, "추가된 기성 차수 입력란");
    (sheet.rows || []).forEach(row => row.splice(insertAt, 0, ""));
    insertedIndexes[group] = insertAt;
  });

  const focusGroup = getEstimateDbStageGroups().includes(selectedGroup) ? selectedGroup : "세금계산서";
  const focusCol = insertedIndexes[focusGroup] ?? Object.values(insertedIndexes)[0] ?? 0;
  estimateDbSelectedCell = { tab: "progress", sectionIndex: null, rowIndex: selected.rowIndex || 0, colIndex: focusCol };
  recalcAllEstimateDbRows();
  renderEstimateDbManage();
  requestAnimationFrame(() => focusEstimateDbCell(estimateDbSelectedCell.rowIndex || 0, focusCol));
  if (typeof showToast === "function") showToast(`${next}차기성 열을 추가했습니다.`);
}


function normalizeEstimateDbSortValue(value) {
  const text = normalizeEstimateDbText(value);
  const numeric = Number(String(text).replace(/[,원\s]/g, ""));
  if (text && !Number.isNaN(numeric) && /^-?[0-9,\.]+원?$/.test(text)) return { type: "number", value: numeric };
  return { type: "text", value: text.toLowerCase() };
}

function compareEstimateDbValues(a, b, direction = "asc") {
  const av = normalizeEstimateDbSortValue(a);
  const bv = normalizeEstimateDbSortValue(b);
  let result = 0;
  if (av.type === "number" && bv.type === "number") result = av.value - bv.value;
  else result = String(av.value).localeCompare(String(bv.value), "ko", { numeric: true, sensitivity: "base" });
  return direction === "desc" ? -result : result;
}

function getEstimateDbDefaultSortState(tab = estimateDbActiveTab) {
  const sheet = estimateDbSheets[tab] || estimateDbSheets.pj;
  const cols = getEstimateDbLeafColumns(sheet);
  const pjIndex = cols.findIndex(col => normalizeEstimateDbText(col) === "PJ NO");

  // PJ관리, 기성관리, 기전업체 모두 기본 정렬은 PJ NO 내림차순입니다.
  // 사용자가 다른 헤더를 클릭하면 해당 정렬을 우선 적용하지만,
  // 탭 최초 진입/저장/Enter 확정 시에는 다시 PJ NO 기준으로 정렬됩니다.
  if (pjIndex >= 0) return { tab, colIndex: pjIndex, direction: "desc" };

  return { tab, colIndex: 0, direction: "asc" };
}

function getEstimateDbEffectiveSortState(tab = estimateDbActiveTab) {
  const sheet = estimateDbSheets[tab] || estimateDbSheets.pj;
  const cols = getEstimateDbLeafColumns(sheet);
  if (estimateDbSortState?.tab === tab && cols[estimateDbSortState.colIndex]) return estimateDbSortState;
  return getEstimateDbDefaultSortState(tab);
}

function isEstimateDbPjNoColumn(tab = estimateDbActiveTab, colIndex = 0) {
  return normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex)) === "PJ NO";
}

function applyEstimateDbPjDefaultSort() {
  const defaultSort = getEstimateDbDefaultSortState(estimateDbActiveTab);
  if (defaultSort) estimateDbSortState = defaultSort;
}

function toggleEstimateDbSort(colIndex) {
  const current = getEstimateDbEffectiveSortState(estimateDbActiveTab);
  const direction = current.tab === estimateDbActiveTab && current.colIndex === colIndex && current.direction === "asc" ? "desc" : "asc";
  estimateDbSortState = { tab: estimateDbActiveTab, colIndex, direction };
  estimateDbSelectedCell = { tab: estimateDbActiveTab, sectionIndex: null, rowIndex: 0, colIndex };
  renderEstimateDbManage();
}

function setEstimateDbSearchKeyword(value) {
  estimateDbSearchKeyword = String(value || "");
  setEstimateDbPageIndex(estimateDbActiveTab, 0);
  estimateDbSelectedCell = { tab: estimateDbActiveTab, sectionIndex: null, rowIndex: 0, colIndex: estimateDbSelectedCell?.colIndex || 0 };
  renderEstimateDbManage();
}

function rowMatchesEstimateDbSearch(row, keyword, tab = estimateDbActiveTab, rowIndex = -1) {
  const q = normalizeEstimateDbText(keyword).toLowerCase();
  if (!q) return true;
  return (row || []).some((cell, colIndex) => {
    const value = rowIndex >= 0 ? getEstimateDbCellDisplayValue(tab, rowIndex, colIndex, cell) : cell;
    return normalizeEstimateDbText(value).toLowerCase().includes(q);
  });
}

function getEstimateDbDisplayRowEntries(sheet = getEstimateDbSheet(), tab = estimateDbActiveTab) {
  const keyword = estimateDbSearchKeyword;
  const sort = getEstimateDbEffectiveSortState(tab);
  return (sheet.rows || [])
    .map((row, sourceIndex) => ({ row, sourceIndex }))
    .filter(entry => rowMatchesEstimateDbSearch(entry.row, keyword, tab, entry.sourceIndex))
    .sort((a, b) => {
      const aValue = getEstimateDbCellDisplayValue(tab, a.sourceIndex, sort.colIndex, a.row?.[sort.colIndex]);
      const bValue = getEstimateDbCellDisplayValue(tab, b.sourceIndex, sort.colIndex, b.row?.[sort.colIndex]);
      const result = compareEstimateDbValues(aValue, bValue, sort.direction);
      return result || a.sourceIndex - b.sourceIndex;
    });
}



function getEstimateDbColumnVisualClass(tab = estimateDbActiveTab, colIndex = 0) {
  const header = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  // PJ관리 / 기성관리 / 기전업체 공통: PJ NO 열은 기존 저장 열폭보다 고정폭을 우선 적용합니다.
  if (header === "PJ NO") return " quote-db-col-pj-no";
  if (tab !== "pj") return "";
  if (header === "국내/해외") return " quote-db-col-domestic";
  if (header === "거래처명") return " quote-db-col-client-name";
  if (header === "프로젝트명") return " quote-db-col-project-name";
  return "";
}

function getEstimateDbGroupBoundaryClass(tab = estimateDbActiveTab, colIndex = 0, sheet = getEstimateDbSheet()) {
  const header = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  const boundaryHeadersByTab = {
    pj: ["프로젝트명", "작업공종", "세대수"],
    progress: ["작업취소", "외주금액합계", "2차납품공종"],
    mep: ["작업취소", "외주금액합계", "2차납품공종"]
  };
  const boundaryHeaders = boundaryHeadersByTab[tab] || [];
  return boundaryHeaders.includes(header) ? " quote-db-group-boundary" : "";
}

function renderEstimateDbSearchBox() {
  const box = document.getElementById("estimateDbSearchBox");
  if (!box) return;
  box.value = estimateDbSearchKeyword || "";
  box.placeholder = `${getEstimateDbSheet().title || "DB"} 검색`;
}

function ensureEstimateDbManualSaveButton() {
  if (document.getElementById("estimateDbManualSaveBtn")) return;
  const reorderBtn = document.getElementById("estimateDbColumnReorderBtn");
  const reorderOkBtn = document.getElementById("estimateDbColumnReorderOkBtn");
  if (reorderBtn) {
    reorderBtn.textContent = estimateDbColumnReorderMode ? "열 위치 변경 중" : "열 위치 변경";
    reorderBtn.classList.toggle("active", estimateDbColumnReorderMode);
  }
  if (reorderOkBtn) reorderOkBtn.style.setProperty("display", estimateDbColumnReorderMode ? "inline-flex" : "none", "important");
  bindEstimateDbColumnReorderOkButton();
  const rowHeightBtn = document.getElementById("estimateDbRowHeightBtn");
  if (rowHeightBtn) rowHeightBtn.textContent = `행 높이 ${estimateDbRowHeightPx}px`;
  const stageBtn = document.getElementById("estimateDbAddStageBtn");
  const exportBtn = Array.from(document.querySelectorAll("button")).find(btn => normalizeEstimateDbText(btn.textContent).includes("엑셀 내보내기"));
  const anchor = stageBtn || exportBtn;
  if (!anchor?.parentElement) return;
  const btn = document.createElement("button");
  btn.id = "estimateDbManualSaveBtn";
  btn.type = "button";
  btn.className = "btn btn-line";
  btn.onclick = () => commitEstimateDbPendingEdits();
  anchor.parentElement.insertBefore(btn, anchor);
}


function migrateEstimateDbPjColumns() {
  const sheet = estimateDbSheets?.pj;
  if (!sheet?.headerRows?.[0]) return;
  const desired = [
    "최초생성날짜","접수번호","PJ NO",ESTIMATE_DB_PROJECT_LINK_HEADER,"국내/해외","거래처명","프로젝트명","거래처","거래처담당자","직급","일반전화","휴대폰","직통전화","EMAIL","EMAIL2","웹하드","ID","PW","기타","작업공종","폴더명 / 자료위치","PM(마감)","PM(구조)","PM(토목,조경)","PM(기계)","PM(전기)","PM(인테리어)","PM(철거)","작업구분","업무성격","업무단계2","단가작업여부","건물용도","연면적(m2)","연면적(평)","층수","동수","타입수","세대수","수주일자","작업착수일자","1차납품예정일","1차납품일자","1차납품공종","2차납품예정일","2차납품일자","2차납품공종","상담 / 이메일 / 특기사항"
  ];
  const current = sheet.headerRows[0];
  if (desired.every((h, i) => current[i] === h) && current.length === desired.length) return;
  const oldIndex = new Map(current.map((h, i) => [h, i]));
  const aliases = { "거래처": ["거래처", "부서명"] };
  const remap = row => desired.map(h => {
    const names = aliases[h] || [h];
    const key = names.find(name => oldIndex.has(name));
    const i = key == null ? null : oldIndex.get(key);
    return i == null ? "" : (row?.[i] || "");
  });
  sheet.headerRows[0] = desired;
  sheet.requestRow = remap(sheet.requestRow || []);
  sheet.rows = (sheet.rows || []).map(remap);
}
function toggleEstimateDbColumnReorderMode() {
  // "열 위치 변경 중" 버튼은 편집모드 재진입/상태표시 용도로만 사용합니다.
  // 편집모드 종료와 저장은 반드시 "확인" 버튼에서만 처리합니다.
  if (estimateDbColumnReorderMode) {
    estimateDbColumnReorderSource = null;
    if (typeof showToast === "function") showToast("열 위치 변경 모드입니다. 종료하려면 확인 버튼을 누르세요.");
    renderEstimateDbManage();
    return;
  }
  estimateDbColumnReorderMode = true;
  estimateDbColumnReorderSource = null;
  if (typeof showToast === "function") showToast("열 위치 변경 모드입니다. 이동할 헤더를 드래그해 바꿀 위치에 놓고 확인을 누르세요.");
  renderEstimateDbManage();
}
function confirmEstimateDbColumnReorder() {
  estimateDbColumnReorderMode = false;
  estimateDbColumnReorderSource = null;
  estimateDbColumnReorderPointerState = null;
  document.removeEventListener("mouseup", finishEstimateDbColumnReorderPointer, true);
  saveEstimateDbToStorage?.();
  if (typeof showToast === "function") showToast("열 위치 변경을 저장했습니다.");
  renderEstimateDbManage();
}

function bindEstimateDbColumnReorderOkButton() {
  const btn = document.getElementById("estimateDbColumnReorderOkBtn");
  if (!btn) return;
  btn.type = "button";
  btn.style.pointerEvents = "auto";
  btn.style.position = "relative";
  btn.style.zIndex = "30";
  btn.onclick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    confirmEstimateDbColumnReorder();
    return false;
  };
  btn.onmousedown = function(event) {
    event.stopPropagation();
  };
  btn.onmouseup = function(event) {
    event.stopPropagation();
  };
}

function startEstimateDbColumnReorder(event, colIndex) {
  if (!estimateDbColumnReorderMode) return;
  estimateDbColumnReorderSource = colIndex;
  event.dataTransfer?.setData("text/plain", String(colIndex));
  event.dataTransfer?.setDragImage?.(event.currentTarget, 12, 12);
  event.currentTarget?.classList?.add("quote-db-col-dragging");
}

function startEstimateDbColumnReorderPointer(event, colIndex) {
  if (!estimateDbColumnReorderMode || event.button !== 0) return;
  const th = event.currentTarget;
  estimateDbColumnReorderSource = colIndex;
  estimateDbColumnReorderPointerState = {
    sourceIndex: colIndex,
    startX: event.clientX,
    startY: event.clientY,
    sourceEl: th
  };
  th?.classList?.add("quote-db-col-dragging");
  document.removeEventListener("mouseup", finishEstimateDbColumnReorderPointer, true);
  document.addEventListener("mouseup", finishEstimateDbColumnReorderPointer, true);
}

function finishEstimateDbColumnReorderPointer(event) {
  if (event?.target?.closest?.("#estimateDbColumnReorderOkBtn")) return;
  if (!estimateDbColumnReorderMode || !estimateDbColumnReorderPointerState) return;
  document.removeEventListener("mouseup", finishEstimateDbColumnReorderPointer, true);
  const state = estimateDbColumnReorderPointerState;
  state.sourceEl?.classList?.remove("quote-db-col-dragging");
  estimateDbColumnReorderPointerState = null;

  const dx = Math.abs((event.clientX || 0) - (state.startX || 0));
  const dy = Math.abs((event.clientY || 0) - (state.startY || 0));
  if (dx < 4 && dy < 4) return;

  const targetEl = document.elementFromPoint(event.clientX, event.clientY)?.closest?.("th[data-col-index]");
  const targetIndex = Number(targetEl?.dataset?.colIndex);
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex === state.sourceIndex) return;

  swapEstimateDbColumns(state.sourceIndex, targetIndex);
  estimateDbColumnReorderSource = null;
  renderEstimateDbManage();
}

function endEstimateDbColumnReorder(event) { event.currentTarget?.classList?.remove("quote-db-col-dragging"); }
function allowEstimateDbColumnDrop(event) { if (estimateDbColumnReorderMode) event.preventDefault(); }
function dropEstimateDbColumn(event, targetIndex) {
  if (!estimateDbColumnReorderMode) return;
  event.preventDefault();
  const sourceIndex = Number(event.dataTransfer?.getData("text/plain") || estimateDbColumnReorderSource);
  if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex === targetIndex) return;
  swapEstimateDbColumns(sourceIndex, targetIndex);
  estimateDbColumnReorderSource = null;
  estimateDbColumnReorderPointerState = null;
  renderEstimateDbManage();
}
function swapEstimateDbColumns(a, b) {
  const sheet = getEstimateDbSheet();
  if (!sheet || a === b) return;
  [a, b] = [Number(a), Number(b)];
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) return;

  const swapCells = row => {
    if (!row) return;
    const max = Math.max(a, b);
    while (row.length <= max) row.push("");
    const tmp = row[a];
    row[a] = row[b];
    row[b] = tmp;
  };

  (sheet.headerRows || []).forEach(swapCells);
  swapCells(sheet.requestRow);
  (sheet.rows || []).forEach(swapCells);

  const tab = estimateDbActiveTab;
  if (estimateDbColumnWidthOverrides?.[tab]) {
    const widthA = estimateDbColumnWidthOverrides[tab][a];
    estimateDbColumnWidthOverrides[tab][a] = estimateDbColumnWidthOverrides[tab][b];
    estimateDbColumnWidthOverrides[tab][b] = widthA;
    localStorage.setItem("estimateDbColumnWidthOverrides", JSON.stringify(estimateDbColumnWidthOverrides));
  }
  estimateDbSortState = getEstimateDbDefaultSortState(tab);
  estimateDbSelectedCell = { tab, sectionIndex: null, rowIndex: 0, colIndex: b };
  updateEstimateDbSaveButtonState?.();
}

let estimateDbReportRenderTimer = null;
function scheduleEstimateDbReportsRender(delay = 180) {
  if (estimateDbReportRenderTimer) clearTimeout(estimateDbReportRenderTimer);
  const run = () => {
    estimateDbReportRenderTimer = null;
    try { renderEstimateDbReports(); } catch (error) { console.warn("DB report render skipped", error); }
  };
  if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
    estimateDbReportRenderTimer = window.setTimeout(() => window.requestIdleCallback(run, { timeout: 800 }), delay);
  } else {
    estimateDbReportRenderTimer = window.setTimeout(run, delay);
  }
}

function recalcEstimateDbVisibleRows(tab, entries = []) {
  if (tab !== "progress" && tab !== "mep") return;
  entries.forEach(entry => {
    if (entry?.row) recalcEstimateDbRow(tab, entry.row);
  });
}

function renderEstimateDbManage(options = {}) {
  runEstimateDbStructureMaintenanceOnce?.();
  initializeEstimateDbVisibleSeedRows();
  migrateEstimateDbPjColumns();
  const head = document.getElementById("estimateDbHead");
  const body = document.getElementById("estimateDbBody");
  if (!head || !body) return;
  syncEstimateDbYearOptions();
  ensureEstimateDbManualSaveButton();
  document.querySelectorAll(".quote-db-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.dbTab === estimateDbActiveTab));
  if (!estimateDbInitialSanitizeDone) {
    sanitizeEstimateDbSheetsBeforeRender();
    ensureEstimateDbProgressStageTotalColumns();
    Object.keys(estimateDbSheets || {}).forEach(tab => normalizeEstimateDbSheetColumnLengths(estimateDbSheets[tab]));
    estimateDbInitialSanitizeDone = true;
  } else if (!estimateDbNormalizedTabSet.has(estimateDbActiveTab)) {
    normalizeEstimateDbActiveSheetColumns();
  }
  if (options.forceRecalc) recalcEstimateDbRowsByTab(estimateDbActiveTab, { force: true });
  renderEstimateDbSearchBox();
  updateEstimateDbSaveButtonState();
  const resizeBtn = document.getElementById("estimateDbColumnResizeBtn");
  if (resizeBtn) {
    resizeBtn.textContent = estimateDbColumnResizeMode ? "열 조절 종료" : "열 너비 조절하기";
    resizeBtn.classList.toggle("active", estimateDbColumnResizeMode);
  }
  const reorderBtn = document.getElementById("estimateDbColumnReorderBtn");
  const reorderOkBtn = document.getElementById("estimateDbColumnReorderOkBtn");
  if (reorderBtn) {
    reorderBtn.textContent = estimateDbColumnReorderMode ? "열 위치 변경 중" : "열 위치 변경";
    reorderBtn.classList.toggle("active", estimateDbColumnReorderMode);
  }
  if (reorderOkBtn) reorderOkBtn.style.setProperty("display", estimateDbColumnReorderMode ? "inline-flex" : "none", "important");
  bindEstimateDbColumnReorderOkButton();
  const rowHeightBtn = document.getElementById("estimateDbRowHeightBtn");
  if (rowHeightBtn) rowHeightBtn.textContent = `행 높이 ${estimateDbRowHeightPx}px`;
  const contractBtn = document.getElementById("estimateDbAddContractAmountBtn");
  if (contractBtn) contractBtn.style.display = estimateDbActiveTab === "progress" ? "inline-flex" : "none";
  const stageBtn = document.getElementById("estimateDbAddStageBtn");
  if (stageBtn) stageBtn.textContent = `+차수 추가(${ESTIMATE_DB_STAGE_ADD_SHORTCUT_LABEL})`;
  if (estimateDbActiveTab === "mep") {
    renderEstimateDbMepManage(options);
    return;
  }
  const sheet = getEstimateDbSheet();
  document.querySelectorAll(".quote-db-table").forEach(table => table.style.setProperty("--estimate-db-row-height", `${estimateDbRowHeightPx}px`));
  const colCount = getEstimateDbLeafColumns(sheet).length;
  const displayColumns = getEstimateDbDisplayColumns(sheet);
  const sort = getEstimateDbEffectiveSortState(estimateDbActiveTab);
  head.innerHTML = `
    <tr class="quote-db-head-row quote-db-head-row-1 quote-db-head-row-merged">
      ${displayColumns.map((col, colIndex) => {
        const sortMark = sort.colIndex === colIndex ? (sort.direction === "asc" ? " ▲" : " ▼") : "";
        const reorderClass = estimateDbColumnReorderMode ? " reorder-mode" : "";
        const reorderAttrs = estimateDbColumnReorderMode
          ? `draggable="true" onmousedown="startEstimateDbColumnReorderPointer(event, ${colIndex})" ondragstart="startEstimateDbColumnReorder(event, ${colIndex})" ondragend="endEstimateDbColumnReorder(event)" ondragover="allowEstimateDbColumnDrop(event)" ondrop="dropEstimateDbColumn(event, ${colIndex})" onclick="event.preventDefault(); event.stopPropagation();" title="헤더를 좌클릭 드래그해서 바꿀 열 위치에 놓으면 두 열이 서로 바뀝니다."`
          : `onclick="toggleEstimateDbSort(${colIndex})" title="클릭하면 오름차순/내림차순 정렬됩니다."`;
        return `<th ${makeEstimateDbCellStyle(colIndex, sheet)} data-resize-col="${colIndex}" data-col-index="${colIndex}" class="quote-db-sortable-head ${estimateDbColumnResizeMode ? "resize-mode" : ""}${reorderClass}${getEstimateDbContactDetailClass(estimateDbActiveTab, colIndex)}${getEstimateDbScreenHiddenClass(estimateDbActiveTab, colIndex)}${getEstimateDbColumnVisualClass(estimateDbActiveTab, colIndex)}${getEstimateDbGroupBoundaryClass(estimateDbActiveTab, colIndex, sheet)}" ${reorderAttrs}><span class="quote-db-head-label">${escapeEstimateDbHtml((col || "") + sortMark).replace(/\n/g, "<br>")}</span>${renderEstimateDbColumnResizeHandle(colIndex)}</th>`;
      }).join("")}
      <th class="quote-db-manage-col">관리</th>
    </tr>
  `;
  const allEntries = getEstimateDbDisplayRowEntries(sheet, estimateDbActiveTab);
  const paged = getEstimateDbPagedEntries(allEntries, estimateDbActiveTab);
  const entries = paged.entries;
  recalcEstimateDbVisibleRows(estimateDbActiveTab, entries);
  const totalRow = renderEstimateDbTotalRow(sheet, colCount);
  body.innerHTML = totalRow + (entries.map(({ row, sourceIndex }) => renderEstimateDbRow(row, sourceIndex, colCount)).join("") || `<tr><td colspan="${colCount + 1}" class="empty-cell">검색 조건에 맞는 DB 행이 없습니다.</td></tr>`);
  renderEstimateDbPager(paged);
  applyEstimateDbCommaFormatToRenderedInputs();
  if (options.renderReportsNow) renderEstimateDbReports();
  else scheduleEstimateDbReportsRender(estimateDbActiveTab === "progress" ? 650 : 220);
  restoreEstimateDbFocus();
}
function isEstimateDbTotalEnabled(sheet = getEstimateDbSheet()) {
  return sheet === estimateDbSheets.progress || sheet === estimateDbSheets.mep;
}
function renderEstimateDbTotalRow(sheet, colCount) {
  if (!isEstimateDbTotalEnabled(sheet)) return "";
  const rows = getEstimateDbDataRowsForTotal(sheet);
  const tabName = sheet === estimateDbSheets.progress ? "progress" : sheet === estimateDbSheets.mep ? "mep" : estimateDbActiveTab;
  const totals = Array.from({ length: colCount }, (_, colIndex) => isEstimateDbTotalExcludedColumn(tabName, colIndex, sheet) ? 0 : rows.reduce((sum, row) => sum + getEstimateDbNumericValueForTotal(row, colIndex, tabName, sheet), 0));
  const formatTotal = (value, colIndex) => value ? formatEstimateDbMoneyDisplay(value, sheet === estimateDbSheets.progress ? "progress" : sheet === estimateDbSheets.mep ? "mep" : estimateDbActiveTab, colIndex, sheet) : "";
  return `
    <tr class="quote-db-total-row" style="height:${estimateDbRowHeightPx}px;">
      <td class="quote-db-total-label" colspan="4">합계</td>
      ${Array.from({ length: Math.max(0, colCount - 4) }, (_, offset) => {
        const colIndex = offset + 4;
        return `<td ${makeEstimateDbCellStyle(colIndex, sheet)} data-resize-col="${colIndex}" class="${(getEstimateDbColumnVisualClass(tabName, colIndex) + getEstimateDbGroupBoundaryClass(tabName, colIndex, sheet)).trim()}"><input class="quote-db-cell-input quote-db-total-input" value="${escapeEstimateDbHtml(formatTotal(totals[colIndex], colIndex))}" readonly tabindex="-1" /></td>`;
      }).join("")}
      <td class="quote-db-manage-col"></td>
    </tr>`;
}
function isEstimateDbOutsourceAmountCell(tab = estimateDbActiveTab, colIndex = 0) {
  if (tab !== "progress") return false;
  const header = getEstimateDbColumnName(tab, colIndex);
  return ["기계", "전기", "외주", "송무", "기타"].includes(header);
}
function formatEstimateDbAmountCellDisplay(value) {
  const parsed = parseEstimateDbAmountCellValue(value);
  const amount = parsed.amount ? formatEstimateDbCommaNumber(parsed.amount) : "";
  if (parsed.company && amount) return `${parsed.company}
${amount}원`;
  if (amount) return amount;
  return String(value || "");
}
function normalizeEstimateDbAmountCellStorage(value) {
  const parsed = parseEstimateDbAmountCellValue(value);
  const amount = parsed.amount ? String(parsed.amount).replace(/,/g, "") : "";
  if (parsed.company && amount) return `${parsed.company}
${amount}`;
  if (amount) return amount;
  return String(value || "");
}
function getEstimateDbDataRowsForTotal(sheet = getEstimateDbSheet()) {
  return (sheet.rows || []).filter(row => !isEstimateDbEmbeddedTotalRow(sheet, row));
}
function refreshEstimateDbTotalRowOnly() {
  const sheet = getEstimateDbSheet();
  if (!isEstimateDbTotalEnabled(sheet)) return;
  const totalRow = document.querySelector("#estimateDbBody .quote-db-total-row");
  if (!totalRow) return;
  const colCount = getEstimateDbLeafColumns(sheet).length;
  const rows = getEstimateDbDataRowsForTotal(sheet);
  rows.forEach(row => recalcEstimateDbRow(sheet === estimateDbSheets.progress ? "progress" : sheet === estimateDbSheets.mep ? "mep" : estimateDbActiveTab, row));
  const tabName = sheet === estimateDbSheets.progress ? "progress" : sheet === estimateDbSheets.mep ? "mep" : estimateDbActiveTab;
  const totals = Array.from({ length: colCount }, (_, colIndex) => isEstimateDbTotalExcludedColumn(tabName, colIndex, sheet) ? 0 : rows.reduce((sum, row) => sum + getEstimateDbNumericValueForTotal(row, colIndex, tabName, sheet), 0));
  totalRow.querySelectorAll(".quote-db-total-input").forEach((input, i) => {
    const colIndex = i + 4;
    input.value = totals[colIndex] ? formatEstimateDbMoneyDisplay(totals[colIndex], sheet === estimateDbSheets.progress ? "progress" : sheet === estimateDbSheets.mep ? "mep" : estimateDbActiveTab, colIndex, sheet) : "";
  });
}
function refreshEstimateDbCalculatedCells(rowIndex) {
  const sheet = getEstimateDbSheet();
  const row = getEstimateDbRows()?.[rowIndex];
  if (!sheet || !row) return;
  const cols = getEstimateDbLeafColumns(sheet);
  const calculatedHeaders = estimateDbActiveTab === "progress"
    ? ["잔액", "작업대기중", "합계", "세금계산서", "입금예정일", "입금일"]
    : estimateDbActiveTab === "mep"
      ? ["잔액", "작업대기중"]
      : estimateDbActiveTab === "pj"
        ? ["연면적(평)"]
        : [];
  if (!calculatedHeaders.length) return;
  cols.forEach((header, colIndex) => {
    const topHeader = sheet.headerRows?.[0]?.[colIndex] || "";
    const topText = normalizeEstimateDbText(topHeader).replace(/\s+/g, "");
    const isStageTotal = normalizeEstimateDbText(header) === "합계" && /세금계산서|입금예정일|입금일/.test(String(topHeader));
    const isOutsourceTotal = estimateDbActiveTab === "progress" && normalizeEstimateDbText(header) === "합계" && topText.includes("외주금액");
    const isCalculated = isEstimateDbColumnHeaderMatch(estimateDbActiveTab, colIndex, calculatedHeaders);
    if (!isCalculated && !isStageTotal && !isOutsourceTotal) return;
    const input = document.querySelector(`.quote-db-cell-input[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`);
    const nextValue = formatEstimateDbMoneyDisplay(row[colIndex] || "", estimateDbActiveTab, colIndex, sheet);
    if (input && input.value !== String(nextValue || "")) input.value = nextValue || "";
  });
}
function handleEstimateDbCellInput(event, rowIndex, colIndex, amountCell = false) {
  const input = event?.currentTarget;
  if (!input) return;
  let value = input.value;
  const sheet = getEstimateDbSheet();

  // DB관리 내 금액성 컬럼은 입력 중에도 3자리 콤마를 즉시 반영합니다.
  // 예: 400000 -> 400,000 / 100000 -> 100,000
  if (!amountCell && isEstimateDbMoneyLikeColumn(estimateDbActiveTab, colIndex, sheet)) {
    const selectionFromEnd = String(input.value || "").length - (input.selectionStart || 0);
    value = formatEstimateDbCommaNumber(String(value || "").replace(/,/g, ""));
    input.value = value;
    const nextCaret = Math.max(0, String(value).length - selectionFromEnd);
    try { input.setSelectionRange(nextCaret, nextCaret); } catch (_) {}
  }

  updateEstimateDbCell(rowIndex, colIndex, value, { pending: true });
}

function renderEstimateDbRow(row, rowIndex, colCount) {
  const sheet = getEstimateDbSheet();
  const safeRow = Array.from({ length: colCount }, (_, i) => row?.[i] || "");
  const doneRowClass = isEstimateDbProgressDoneRow(row) ? " quote-db-row-complete" : "";
  return `
    <tr class="quote-db-data-row${doneRowClass}" data-row-index="${rowIndex}" style="height:${estimateDbRowHeightPx}px;">
      ${safeRow.map((value, colIndex) => {
        const request = getEstimateDbColumnRequest(estimateDbActiveTab, colIndex);
        const dropdown = isEstimateDbDropdownCell(estimateDbActiveTab, colIndex);
        const amountCell = isEstimateDbOutsourceAmountCell(estimateDbActiveTab, colIndex);
        const memoCell = isEstimateDbPjMemoColumn(estimateDbActiveTab, colIndex);
        const commandCell = isEstimateDbEnterCommandCell(estimateDbActiveTab, colIndex) || memoCell;
        const projectLinkCell = isEstimateDbProjectLinkColumn(estimateDbActiveTab, colIndex);
        const cls = `${dropdown ? "quote-db-cell-input quote-db-cell-dropdown" : "quote-db-cell-input"}${amountCell ? " quote-db-amount-cell" : ""}${commandCell ? " quote-db-enter-command-cell" : ""}`;
        const title = request ? ` title="${escapeEstimateDbHtml(request)}"` : "";
        const dbl = memoCell ? `openEstimateDbPjMemoModal(${rowIndex}, ${colIndex})` : (isEstimateDbStoryCell(estimateDbActiveTab, colIndex) ? `openEstimateDbStoryModal(${rowIndex}, ${colIndex})` : (isEstimateDbStageEntryCell(estimateDbActiveTab, colIndex) ? `openEstimateDbStageFormulaModal(${rowIndex}, ${colIndex})` : (isEstimateDbContractAmountBreakdownColumn(estimateDbActiveTab, colIndex) ? `openEstimateDbContractAmountModal(${rowIndex}, ${colIndex})` : (amountCell ? `openEstimateDbAmountModal(${rowIndex}, ${colIndex})` : (isEstimateDbContactColumn(estimateDbActiveTab, colIndex) ? `openEstimateDbContactModal(${rowIndex}, ${colIndex})` : `openEstimateDbDropdown(${rowIndex}, ${colIndex})`)))));
        const displayValue = getEstimateDbCellDisplayValue(estimateDbActiveTab, rowIndex, colIndex, value);
        const formattedDisplayValue = memoCell
          ? summarizeEstimateDbPjMemoCell(displayValue)
          : (isEstimateDbContractAmountBreakdownColumn(estimateDbActiveTab, colIndex)
            ? formatEstimateDbContractAmountDisplay(value)
            : (amountCell ? formatEstimateDbAmountCellDisplay(displayValue) : formatEstimateDbMoneyDisplay(displayValue, estimateDbActiveTab, colIndex, sheet)));
        const dirtyClass = getEstimateDbPendingEdit(estimateDbActiveTab, rowIndex, colIndex) ? " quote-db-cell-dirty" : "";
        const cellExtraClass = getEstimateDbContactDetailClass(estimateDbActiveTab, colIndex) + getEstimateDbScreenHiddenClass(estimateDbActiveTab, colIndex) + getEstimateDbColumnVisualClass(estimateDbActiveTab, colIndex) + (projectLinkCell ? " quote-db-project-link-td" : "");
        const boundaryClass = getEstimateDbGroupBoundaryClass(estimateDbActiveTab, colIndex, sheet);
        const wrapTextCell = isEstimateDbColumnHeaderMatch(estimateDbActiveTab, colIndex, ["프로젝트명", "거래처명"]);
        if (isEstimateDbProgressDoneColumn(estimateDbActiveTab, colIndex)) {
          const done = parseEstimateDbProgressDoneValue(value);
          return `<td ${makeEstimateDbCellStyle(colIndex, sheet)} data-resize-col="${colIndex}" class="quote-db-done-cell${cellExtraClass}${boundaryClass}"><label class="quote-db-done-box"><input type="checkbox" ${done.checked ? "checked" : ""} onchange="toggleEstimateDbProgressDone(event, ${rowIndex}, ${colIndex})" onfocus="selectEstimateDbCell(${rowIndex}, ${colIndex})" /><span>완료</span></label><div class="quote-db-done-history">${escapeEstimateDbHtml(done.history || "")}</div></td>`;
        }
        if (amountCell || isEstimateDbContractAmountBreakdownColumn(estimateDbActiveTab, colIndex)) {
          const opener = commandCell ? renderEstimateDbCommandOpenButton(rowIndex, colIndex) : "";
          return `<td ${makeEstimateDbCellStyle(colIndex, sheet)} data-resize-col="${colIndex}" class="${commandCell ? "quote-db-command-td" : ""}${cellExtraClass}${boundaryClass}"><div class="quote-db-command-wrap"><textarea class="${cls}${dirtyClass}" data-row-index="${rowIndex}" data-col-index="${colIndex}"${title} onfocus="selectEstimateDbCell(${rowIndex}, ${colIndex})" oninput="handleEstimateDbCellInput(event, ${rowIndex}, ${colIndex}, true)" onkeydown="handleEstimateDbKeydown(event)" ondblclick="${dbl}">${escapeEstimateDbHtml(formattedDisplayValue)}</textarea>${opener}</div></td>`;
        }
        const opener = commandCell ? renderEstimateDbCommandOpenButton(rowIndex, colIndex) : "";
        if (wrapTextCell) {
          return `<td ${makeEstimateDbCellStyle(colIndex, sheet)} data-resize-col="${colIndex}" class="quote-db-wrap-text-td${commandCell ? " quote-db-command-td" : ""}${cellExtraClass}${boundaryClass}"><div class="quote-db-command-wrap"><textarea class="${cls}${dirtyClass} quote-db-wrap-text-cell" data-row-index="${rowIndex}" data-col-index="${colIndex}"${title} onfocus="selectEstimateDbCell(${rowIndex}, ${colIndex})" oninput="handleEstimateDbCellInput(event, ${rowIndex}, ${colIndex}, true)" onkeydown="handleEstimateDbKeydown(event)" ondblclick="${dbl}">${escapeEstimateDbHtml(formattedDisplayValue)}</textarea>${opener}</div></td>`;
        }
        return `<td ${makeEstimateDbCellStyle(colIndex, sheet)} data-resize-col="${colIndex}" class="${commandCell ? "quote-db-command-td" : ""}${cellExtraClass}${boundaryClass}"><div class="quote-db-command-wrap"><input class="${cls}${dirtyClass}" value="${escapeEstimateDbHtml(formattedDisplayValue)}" data-row-index="${rowIndex}" data-col-index="${colIndex}"${title} onfocus="selectEstimateDbCell(${rowIndex}, ${colIndex})" oninput="handleEstimateDbCellInput(event, ${rowIndex}, ${colIndex}, false)" onkeydown="handleEstimateDbKeydown(event)" ondblclick="${dbl}" />${opener}</div></td>`;
      }).join("")}
      <td class="quote-db-manage-col"><button class="btn btn-line btn-xs" type="button" onclick="removeEstimateDbRow(${rowIndex})">삭제</button></td>
    </tr>
  `;
}
function refreshEstimateDbProgressDoneCellOnly(rowIndex, colIndex, checked, history) {
  const rowEl = document.querySelector(`#estimateDbBody .quote-db-data-row[data-row-index="${rowIndex}"]`);
  const cellEl = rowEl?.querySelector(`.quote-db-done-cell[data-resize-col="${colIndex}"]`);
  if (rowEl) rowEl.classList.toggle("quote-db-row-complete", !!checked);
  const input = cellEl?.querySelector('input[type="checkbox"]');
  if (input && input.checked !== !!checked) input.checked = !!checked;
  const historyEl = cellEl?.querySelector(".quote-db-done-history");
  if (historyEl) historyEl.textContent = history || "";
}

function toggleEstimateDbProgressDone(event, rowIndex, colIndex) {
  const checkbox = event?.currentTarget;
  const checked = !!checkbox?.checked;
  const row = getEstimateDbRows()?.[rowIndex];
  if (!row) return;
  const current = parseEstimateDbProgressDoneValue(row?.[colIndex]);
  const history = checked ? (current.history || getEstimateDbProgressDoneHistory()) : "";

  // 기성청구완료 체크박스는 계산/정렬/연계 대상이 아닌 상태값입니다.
  // 기존처럼 renderEstimateDbManage()를 다시 호출하면 60개 이상 컬럼의 기성관리 전체 표,
  // 합계행, 리포트가 모두 재생성되어 체크 한 번에도 로딩이 발생합니다.
  // 따라서 해당 셀 값과 현재 행의 완료 표시만 즉시 갱신합니다.
  row[colIndex] = stringifyEstimateDbProgressDoneValue(checked, history);
  refreshEstimateDbProgressDoneCellOnly(rowIndex, colIndex, checked, history);
  setEstimateDbPendingEdit?.(estimateDbActiveTab, rowIndex, colIndex, row[colIndex]);
  updateEstimateDbSaveButtonState?.();
  if (typeof scheduleEstimateDbPersist === "function") scheduleEstimateDbPersist();
  requestAnimationFrame(() => checkbox?.focus?.());
}

function selectEstimateDbCell(rowIndex, colIndex) {
  estimateDbSelectedCell = { tab: estimateDbActiveTab, sectionIndex: null, rowIndex, colIndex };
  document.querySelectorAll(".quote-db-data-row").forEach(row => row.classList.remove("selected"));
  document.querySelector(`.quote-db-data-row[data-row-index="${rowIndex}"]`)?.classList.add("selected");
}
function applyEstimateDbCommaFormatToRenderedInputs() {
  const sheet = getEstimateDbSheet();
  document.querySelectorAll(".quote-db-cell-input[data-col-index]").forEach(input => {
    if (input.classList.contains("quote-db-amount-cell")) return;
    const colIndex = Number(input.dataset.colIndex);
    if (!Number.isFinite(colIndex)) return;
    if (!isEstimateDbMoneyLikeColumn(estimateDbActiveTab, colIndex, sheet)) return;
    const raw = String(input.value || "").replace(/,/g, "");
    if (!isEstimateDbPureNumber(raw)) return;
    input.value = formatEstimateDbCommaNumber(raw);
  });
}

function restoreEstimateDbFocus() {
  const cell = estimateDbSelectedCell;
  if (cell.tab !== estimateDbActiveTab) return;
  requestAnimationFrame(() => selectEstimateDbCell(cell.rowIndex || 0, cell.colIndex || 0));
}
function focusEstimateDbCell(rowIndex, colIndex) {
  if (!isEstimateDbColumnVisibleOnScreen(estimateDbActiveTab, colIndex)) {
    colIndex = getEstimateDbNextScreenVisibleCol(colIndex, 1) !== colIndex
      ? getEstimateDbNextScreenVisibleCol(colIndex, 1)
      : getEstimateDbNextScreenVisibleCol(colIndex, -1);
  }
  const rowEl = document.querySelector(`.quote-db-data-row[data-row-index="${rowIndex}"]`);
  const input = document.querySelector(`.quote-db-cell-input[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`)
    || rowEl?.querySelector(`.quote-db-done-cell[data-resize-col="${colIndex}"] input[type="checkbox"]`);
  if (!input) return;
  const wrap = input.closest(".quote-db-grid-wrap");
  const row = input.closest("tr");
  input.focus({ preventScroll: true });
  input.select?.();
  selectEstimateDbCell(rowIndex, colIndex);
  if (wrap && row) {
    const wrapRect = wrap.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const pad = 28;
    if (inputRect.right > wrapRect.right - pad) wrap.scrollLeft += inputRect.right - wrapRect.right + pad;
    if (inputRect.left < wrapRect.left + pad) wrap.scrollLeft -= wrapRect.left - inputRect.left + pad;
    const rowRect = row.getBoundingClientRect();
    if (rowRect.bottom > wrapRect.bottom - pad) wrap.scrollTop += rowRect.bottom - wrapRect.bottom + pad;
    if (rowRect.top < wrapRect.top + pad) wrap.scrollTop -= wrapRect.top - rowRect.top + pad;
  }
}

function getEstimateDbColumnRequest(tab, colIndex) {
  const sheet = estimateDbSheets[tab] || estimateDbSheets.pj;
  return sheet.requestRow?.[colIndex] || "";
}
function getEstimateDbColumnName(tab, colIndex) {
  const sheet = estimateDbSheets[tab] || estimateDbSheets.pj;
  return getEstimateDbLeafColumns(sheet)[colIndex] || "";
}
function getEstimateDbColumnIndexByHeader(tab, headerName) {
  const sheet = estimateDbSheets[tab] || estimateDbSheets.pj;
  const target = normalizeEstimateDbText(headerName);
  if (!sheet || !target) return -1;
  const top = sheet.headerRows?.[0] || [];
  const leaf = getEstimateDbLeafColumns(sheet);
  const display = getEstimateDbDisplayColumns(sheet);
  let idx = top.findIndex(v => normalizeEstimateDbText(v) === target);
  if (idx >= 0) return idx;
  idx = leaf.findIndex(v => normalizeEstimateDbText(v) === target);
  if (idx >= 0) return idx;
  idx = display.findIndex(v => normalizeEstimateDbText(v).split(/\n/)[0] === target);
  return idx;
}
function isEstimateDbColumnHeaderMatch(tab, colIndex, headerNames = []) {
  const sheet = estimateDbSheets[tab] || estimateDbSheets.pj;
  const targets = headerNames.map(normalizeEstimateDbText);
  const values = [
    sheet.headerRows?.[0]?.[colIndex],
    getEstimateDbLeafColumns(sheet)[colIndex],
    getEstimateDbDisplayColumns(sheet)[colIndex]?.split(/\n/)[0]
  ].map(normalizeEstimateDbText);
  return values.some(value => targets.includes(value));
}
function isEstimateDbProjectLinkColumn(tab, colIndex) {
  return tab === "pj" && normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex)) === ESTIMATE_DB_PROJECT_LINK_HEADER;
}

function getEstimateDbProjectLinkOptions(rowIndex = -1) {
  const sheet = estimateDbSheets.pj;
  const columns = getEstimateDbLeafColumns(sheet);
  const pjNoIndex = columns.findIndex(c => normalizeEstimateDbText(c) === "PJ NO");
  const clientIndex = columns.findIndex(c => normalizeEstimateDbText(c) === "거래처명");
  const projectNameIndex = columns.findIndex(c => normalizeEstimateDbText(c) === "프로젝트명");
  return (sheet.rows || [])
    .map((row, sourceIndex) => {
      const pjNo = normalizeEstimateDbText(row?.[pjNoIndex]);
      if (!pjNo || sourceIndex === rowIndex) return null;
      const client = normalizeEstimateDbText(row?.[clientIndex]);
      const projectName = normalizeEstimateDbText(row?.[projectNameIndex]);
      return {
        sourceIndex,
        pjNo,
        label: [pjNo, client, projectName].filter(Boolean).join(" | ")
      };
    })
    .filter(Boolean);
}

function applyEstimateDbProjectLink(rowIndex, selectedLabel) {
  const sheet = estimateDbSheets.pj;
  const rows = sheet.rows || [];
  const columns = getEstimateDbLeafColumns(sheet);
  const linkIndex = columns.findIndex(c => normalizeEstimateDbText(c) === ESTIMATE_DB_PROJECT_LINK_HEADER);
  const selected = getEstimateDbProjectLinkOptions(rowIndex).find(item => item.label === selectedLabel || item.pjNo === selectedLabel || selectedLabel.startsWith(`${item.pjNo} |`));
  const target = rows[rowIndex];
  if (!target) return false;

  // 프로젝트 연결은 기존 프로젝트와 현재 추가계약/후속계약 행을 묶는 참조값입니다.
  // 수주금액, 작업일자, 담당자 등 현재 행의 계약 정보는 추가계약 시점 기준으로 별도 관리해야 하므로
  // 기존 프로젝트 행의 값을 복사하지 않고 연결 PJ NO만 저장합니다.
  const linkValue = selected ? selected.pjNo : normalizeEstimateDbText(selectedLabel);
  if (linkIndex >= 0) {
    while (target.length <= linkIndex) target.push("");
    target[linkIndex] = linkValue || "";
  }
  recalcEstimateDbRow("pj", target);
  return Boolean(linkValue);
}

let estimateDbContactDetailsCollapsed = false;

const ESTIMATE_DB_CONTACT_VISIBLE_HEADER = "거래처";
const ESTIMATE_DB_CONTACT_HIDDEN_HEADERS = ["거래처담당자", "직급", "일반전화", "휴대폰", "직통전화", "EMAIL", "EMAIL2", "웹하드", "ID", "PW", "기타"];
const ESTIMATE_DB_PJ_SCREEN_HIDDEN_HEADERS = ["접수번호"];

function isEstimateDbPjScreenHiddenColumn(tab = estimateDbActiveTab, colIndex = 0) {
  if (tab !== "pj") return false;
  const name = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  return ESTIMATE_DB_PJ_SCREEN_HIDDEN_HEADERS.includes(name);
}

function isEstimateDbColumnVisibleOnScreen(tab = estimateDbActiveTab, colIndex = 0) {
  return !isEstimateDbPjScreenHiddenColumn(tab, colIndex) && !isEstimateDbContactDetailColumn(tab, colIndex);
}

function getEstimateDbScreenHiddenClass(tab = estimateDbActiveTab, colIndex = 0) {
  return isEstimateDbPjScreenHiddenColumn(tab, colIndex) ? " quote-db-pj-screen-hidden" : "";
}

function isEstimateDbContactDetailColumn(tab = estimateDbActiveTab, colIndex = 0) {
  if (tab !== "pj") return false;
  const name = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  return ESTIMATE_DB_CONTACT_HIDDEN_HEADERS.includes(name);
}

function getEstimateDbContactDetailClass(tab = estimateDbActiveTab, colIndex = 0) {
  return isEstimateDbContactDetailColumn(tab, colIndex) ? " quote-db-pj-contact-hidden" : "";
}

function toggleEstimateDbContactDetailColumns() {
  // 거래처 세부정보는 화면에서는 숨기고, 거래처 셀 Enter 팝업과 엑셀 내보내기에서만 사용합니다.
  estimateDbContactDetailsCollapsed = true;
  renderEstimateDbManage();
}

const ESTIMATE_DB_CONTACT_HEADERS = ["거래처", "거래처담당자", "직급", "일반전화", "휴대폰", "직통전화", "EMAIL", "EMAIL2", "웹하드", "ID", "PW", "기타"];
const ESTIMATE_DB_CONTACT_FIELDS = ["dept", "name", "role", "tel", "mobile", "direct", "email", "email2", "webhard", "id", "pw", "etc", "note"];

function isEstimateDbContactColumn(tab = estimateDbActiveTab, colIndex = 0) {
  return tab === "pj" && normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex)) === ESTIMATE_DB_CONTACT_VISIBLE_HEADER;
}

function getEstimateDbContactColumnIndexes() {
  const columns = getEstimateDbLeafColumns(estimateDbSheets.pj);
  return Object.fromEntries(ESTIMATE_DB_CONTACT_HEADERS.map(name => [name, columns.findIndex(col => normalizeEstimateDbText(col) === name)]));
}

function getEstimateDbRowContacts(row) {
  if (!row) return [];
  if (Array.isArray(row.__contacts) && row.__contacts.length) return row.__contacts;
  const idx = getEstimateDbContactColumnIndexes();
  const first = {
    dept: idx["거래처"] >= 0 ? row[idx["거래처"]] || "" : "",
    name: idx["거래처담당자"] >= 0 ? row[idx["거래처담당자"]] || "" : "",
    role: idx["직급"] >= 0 ? row[idx["직급"]] || "" : "",
    tel: idx["일반전화"] >= 0 ? row[idx["일반전화"]] || "" : "",
    mobile: idx["휴대폰"] >= 0 ? row[idx["휴대폰"]] || "" : "",
    direct: idx["직통전화"] >= 0 ? row[idx["직통전화"]] || "" : "",
    email: idx["EMAIL"] >= 0 ? row[idx["EMAIL"]] || "" : "",
    email2: idx["EMAIL2"] >= 0 ? row[idx["EMAIL2"]] || "" : "",
    webhard: idx["웹하드"] >= 0 ? row[idx["웹하드"]] || "" : "",
    id: idx["ID"] >= 0 ? row[idx["ID"]] || "" : "",
    pw: idx["PW"] >= 0 ? row[idx["PW"]] || "" : "",
    etc: idx["기타"] >= 0 ? row[idx["기타"]] || "" : "",
    note: ""
  };
  return Object.values(first).some(value => normalizeEstimateDbText(value)) ? [first] : [];
}

function setEstimateDbRowContacts(row, contacts) {
  if (!row) return;
  const clean = (contacts || [])
    .map(contact => ({
      dept: normalizeEstimateDbText(contact.dept),
      name: normalizeEstimateDbText(contact.name),
      role: normalizeEstimateDbText(contact.role),
      tel: normalizeEstimateDbText(contact.tel),
      mobile: normalizeEstimateDbText(contact.mobile),
      direct: normalizeEstimateDbText(contact.direct),
      email: normalizeEstimateDbText(contact.email),
      email2: normalizeEstimateDbText(contact.email2),
      webhard: normalizeEstimateDbText(contact.webhard),
      id: normalizeEstimateDbText(contact.id),
      pw: normalizeEstimateDbText(contact.pw),
      etc: normalizeEstimateDbText(contact.etc),
      note: normalizeEstimateDbText(contact.note)
    }))
    .filter(contact => Object.values(contact).some(Boolean))
    .slice(0, 10);

  row.__contacts = clean;
  const first = clean[0] || {};
  const idx = getEstimateDbContactColumnIndexes();
  const valueMap = {
    "거래처": first.dept || "",
    "거래처담당자": clean.length > 1 && first.name ? `${first.name} 외 ${clean.length - 1}명` : (first.name || ""),
    "직급": first.role || "",
    "일반전화": first.tel || "",
    "휴대폰": first.mobile || "",
    "직통전화": first.direct || "",
    "EMAIL": first.email || "",
    "EMAIL2": first.email2 || "",
    "웹하드": first.webhard || "",
    "ID": first.id || "",
    "PW": first.pw || "",
    "기타": first.etc || ""
  };
  Object.entries(valueMap).forEach(([name, value]) => {
    if (idx[name] >= 0) row[idx[name]] = value;
  });
}

let estimateDbContactModalState = null;

function ensureEstimateDbContactModal() {
  let modal = document.getElementById("estimateDbContactModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbContactModal";
  modal.className = "estimate-db-dropdown-modal hidden estimate-db-contact-modal";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box estimate-db-contact-box" role="dialog" aria-modal="true">
      <div class="estimate-db-dropdown-title">거래처 / 담당자 / 웹하드 관리</div>
      <div class="estimate-db-contact-help">거래처 셀에서 Enter를 누르면 열립니다. 화면에서는 거래처만 표시하고, 담당자·연락처·웹하드·ID·PW·기타는 이 창과 엑셀 내보내기에서 관리합니다.</div>
      <div class="estimate-db-contact-grid-wrap">
        <table class="estimate-db-contact-grid">
          <thead>
            <tr><th>No</th><th>거래처</th><th>담당자</th><th>직급</th><th>일반전화</th><th>휴대폰</th><th>직통전화</th><th>EMAIL</th><th>EMAIL2</th><th>웹하드</th><th>ID</th><th>PW</th><th>기타</th><th>비고</th></tr>
          </thead>
          <tbody id="estimateDbContactRows"></tbody>
        </table>
      </div>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbContactModal()">닫기</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbContactModal()">거래처 정보 저장</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("mousedown", event => { if (event.target === modal) closeEstimateDbContactModal(); });
  return modal;
}

function openEstimateDbContactModal(rowIndex = estimateDbSelectedCell.rowIndex || 0, colIndex = estimateDbSelectedCell.colIndex || 0) {
  if (estimateDbActiveTab !== "pj") return false;
  const row = estimateDbSheets.pj.rows?.[rowIndex];
  if (!row) return false;
  const modal = ensureEstimateDbContactModal();
  const contacts = getEstimateDbRowContacts(row);
  estimateDbContactModalState = { rowIndex, colIndex };
  const body = modal.querySelector("#estimateDbContactRows");
  body.innerHTML = Array.from({ length: 10 }, (_, index) => {
    const contact = contacts[index] || {};
    return `
      <tr>
        <td>${index + 1}</td>
        <td><input data-contact-field="dept" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.dept || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="name" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.name || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="role" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.role || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="tel" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.tel || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="mobile" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.mobile || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="direct" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.direct || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="email" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.email || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="email2" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.email2 || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="webhard" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.webhard || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="id" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.id || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="pw" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.pw || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="etc" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.etc || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
        <td><input data-contact-field="note" data-contact-index="${index}" value="${escapeEstimateDbHtml(contact.note || "")}" onkeydown="handleEstimateDbContactModalKeydown(event)" /></td>
      </tr>`;
  }).join("");
  modal.classList.remove("hidden");
  setTimeout(() => modal.querySelector('input[data-contact-index="0"][data-contact-field="dept"]')?.focus(), 0);
  return true;
}

function focusEstimateDbContactModalCell(rowIndex, fieldIndex) {
  const row = Math.max(0, Math.min(9, Number(rowIndex) || 0));
  const field = ESTIMATE_DB_CONTACT_FIELDS[Math.max(0, Math.min(ESTIMATE_DB_CONTACT_FIELDS.length - 1, Number(fieldIndex) || 0))];
  const input = document.querySelector(`#estimateDbContactRows input[data-contact-index="${row}"][data-contact-field="${field}"]`);
  if (!input) return;
  const wrap = input.closest(".estimate-db-contact-grid-wrap");
  input.focus({ preventScroll: true });
  input.select?.();
  if (wrap) {
    const wrapRect = wrap.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const pad = 32;
    if (inputRect.right > wrapRect.right - pad) wrap.scrollLeft += inputRect.right - wrapRect.right + pad;
    if (inputRect.left < wrapRect.left + pad) wrap.scrollLeft -= wrapRect.left - inputRect.left + pad;
    if (inputRect.bottom > wrapRect.bottom - pad) wrap.scrollTop += inputRect.bottom - wrapRect.bottom + pad;
    if (inputRect.top < wrapRect.top + pad) wrap.scrollTop -= wrapRect.top - inputRect.top + pad;
  }
}

function handleEstimateDbContactModalKeydown(event) {
  if (!event || event.isComposing) return;
  const input = event.currentTarget;
  const key = event.key;
  if (!input?.dataset) return;
  if (key === "Enter") {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    saveEstimateDbContactModal();
    return;
  }
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation?.();

  let nextRow = Number(input.dataset.contactIndex) || 0;
  let nextFieldIndex = ESTIMATE_DB_CONTACT_FIELDS.indexOf(input.dataset.contactField);
  if (nextFieldIndex < 0) nextFieldIndex = 0;

  if (key === "ArrowUp") nextRow -= 1;
  if (key === "ArrowDown") nextRow += 1;
  if (key === "ArrowLeft") nextFieldIndex -= 1;
  if (key === "ArrowRight") nextFieldIndex += 1;

  if (nextFieldIndex < 0) {
    nextFieldIndex = ESTIMATE_DB_CONTACT_FIELDS.length - 1;
    nextRow -= 1;
  }
  if (nextFieldIndex >= ESTIMATE_DB_CONTACT_FIELDS.length) {
    nextFieldIndex = 0;
    nextRow += 1;
  }
  nextRow = Math.max(0, Math.min(9, nextRow));
  focusEstimateDbContactModalCell(nextRow, nextFieldIndex);
}

function closeEstimateDbContactModal() {
  document.getElementById("estimateDbContactModal")?.classList.add("hidden");
  const state = estimateDbContactModalState;
  estimateDbContactModalState = null;
  if (state) requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}

function saveEstimateDbContactModal() {
  const state = estimateDbContactModalState;
  if (!state) return;
  const row = estimateDbSheets.pj.rows?.[state.rowIndex];
  if (!row) return;
  const contacts = Array.from({ length: 10 }, () => ({}));
  document.querySelectorAll("#estimateDbContactRows input[data-contact-index]").forEach(input => {
    const index = Number(input.dataset.contactIndex);
    const field = input.dataset.contactField;
    if (contacts[index] && field) contacts[index][field] = input.value;
  });
  setEstimateDbRowContacts(row, contacts);
  recalcEstimateDbRow("pj", row);
  closeEstimateDbContactModal();
  renderEstimateDbManage();
}

function isEstimateDbDropdownCell(tab, colIndex) {
  const request = getEstimateDbColumnRequest(tab, colIndex);
  const header = getEstimateDbColumnName(tab, colIndex);
  if (tab === "pj" && header === "PM(철거)") return false;
  if (isEstimateDbContactColumn(tab, colIndex)) return true;
  return isEstimateDbProjectLinkColumn(tab, colIndex) || /드롭다운|대분류|소분류|추가 가능|선택/i.test(request) || ["국내/해외", "거래처명", "작업공종", "작업구분", "업무성격", "업무단계2", "단가작업여부", "건물용도"].includes(header);
}
function getEstimateDbUniqueColumnValues(tab, colIndex) {
  const sheet = estimateDbSheets[tab] || estimateDbSheets.pj;
  const values = new Set();
  (sheet.rows || []).forEach(row => {
    const value = normalizeEstimateDbText(row?.[colIndex]);
    if (value && !/^[-–—]$/.test(value)) values.add(value);
  });
  return [...values];
}
const estimateDbDefaultOptions = {
  "국내/해외": ["국내", "해외"],
  "작업공종": ["마감", "골조성", "구조", "토목", "조경", "기계", "전기", "인테리어", "철거"],
  "작업구분": ["실행", "입찰"],
  "업무성격": ["개산견적", "정미견적", "공사비검증", "클레임", "설계가", "설계변경", "본사 입찰", "본사 실행", "현장 실행", "기타"],
  "단가작업여부": ["공내역서", "비교내역서", "설계예가", "단가작업", "기타"],
  "건물용도": ["창고", "공장", "제약공장", "식품공장", "반도체공장", "물류센터", "아파트형공장", "공동주택", "오피스텔", "주상복합", "업무시설", "오피스", "근린생활시설", "지식산업센터", "기숙사", "연수원", "학교", "교육연구시설", "연구소", "역사"]
};
const estimateDbCustomOptions = {};
function getEstimateDbCustomOptionKey(tab, colIndex) { return `${tab}::${colIndex}`; }
function addEstimateDbCustomOption(tab, colIndex, value) {
  const clean = normalizeEstimateDbText(value);
  if (!clean) return;
  const key = getEstimateDbCustomOptionKey(tab, colIndex);
  if (!estimateDbCustomOptions[key]) estimateDbCustomOptions[key] = [];
  if (!estimateDbCustomOptions[key].includes(clean)) estimateDbCustomOptions[key].push(clean);
}

const estimateDbLinkedStageOptions = {
  "개산견적": ["1회차", "2회차", "3회차", "기타"],
  "정미견적": ["선실행", "본실행", "기타"],
  "공사비검증": ["변경전", "변경후", "변경도서", "기타"],
  "클레임": ["사감정", "본감정", "재감정", "기타"],
  "설계가": ["기본", "실시", "원안", "대안", "기타"],
  "설계변경": ["변경전", "변경후", "변경도서", "기타"],
  "본사 입찰": ["1회차", "2회차", "기타"],
  "본사 실행": ["1회차", "2회차", "기타"],
  "현장 실행": ["1회차", "2회차", "기타"],
  "기타": ["기타"]
};
function getEstimateDbDropdownOptions(tab, rowIndex, colIndex) {
  const header = getEstimateDbColumnName(tab, colIndex);
  const sheet = estimateDbSheets[tab] || estimateDbSheets.pj;
  const custom = estimateDbCustomOptions[getEstimateDbCustomOptionKey(tab, colIndex)] || [];
  let options = [];
  if (tab === "pj" && header === ESTIMATE_DB_PROJECT_LINK_HEADER) {
    options = getEstimateDbProjectLinkOptions(rowIndex).map(item => item.label);
  } else if (tab === "pj" && header === "업무단계2") {
    const headers = getEstimateDbLeafColumns(sheet);
    const parentIndex = headers.indexOf("업무성격");
    const parentValue = normalizeEstimateDbText(sheet.rows?.[rowIndex]?.[parentIndex]);
    options = estimateDbLinkedStageOptions[parentValue] || [];
  } else if (estimateDbDefaultOptions[header]) {
    options = [...estimateDbDefaultOptions[header]];
  }
  const uniqueValues = header === "작업공종" ? [] : getEstimateDbUniqueColumnValues(tab, colIndex);
  options = [...options, ...uniqueValues, ...custom];
  return [...new Set(options.map(normalizeEstimateDbText).filter(Boolean))];
}
function ensureEstimateDbDropdownModal() {
  let modal = document.getElementById("estimateDbDropdownModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbDropdownModal";
  modal.className = "estimate-db-dropdown-modal hidden";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box" role="dialog" aria-modal="true">
      <div class="estimate-db-dropdown-title" id="estimateDbDropdownTitle">목록 선택</div>
      <input id="estimateDbDropdownSearch" class="estimate-db-dropdown-search" placeholder="검색 또는 새 항목 입력" />
      <div id="estimateDbDropdownMultiHelp" class="estimate-db-dropdown-help hidden">Ctrl+B 단축키로 중복선택이 가능합니다.</div>
      <div id="estimateDbDropdownList" class="estimate-db-dropdown-list"></div>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbDropdown()">닫기</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="addEstimateDbDropdownOptionFromInput()">목록 추가/선택</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("mousedown", event => { if (event.target === modal) closeEstimateDbDropdown(); });
  const search = modal.querySelector("#estimateDbDropdownSearch");
  search.addEventListener("keydown", handleEstimateDbDropdownKeydown);
  search.addEventListener("input", () => { search.dataset.fresh = "0"; if (estimateDbDropdownState) estimateDbDropdownState.fresh = false; renderEstimateDbDropdownList(); });
  return modal;
}
function openEstimateDbDropdown(rowIndex = estimateDbSelectedCell.rowIndex || 0, colIndex = estimateDbSelectedCell.colIndex || 0) {
  if (!isEstimateDbDropdownCell(estimateDbActiveTab, colIndex)) return false;
  const modal = ensureEstimateDbDropdownModal();
  const header = getEstimateDbColumnName(estimateDbActiveTab, colIndex);
  const existingValues = normalizeEstimateDbText(getEstimateDbRows()[rowIndex]?.[colIndex] || "")
    .split(/[,、，]+/)
    .map(v => normalizeEstimateDbText(v))
    .filter(Boolean);
  estimateDbDropdownState = {
    tab: estimateDbActiveTab,
    rowIndex,
    colIndex,
    activeIndex: 0,
    options: getEstimateDbDropdownOptions(estimateDbActiveTab, rowIndex, colIndex),
    fresh: true,
    multi: header === "작업공종",
    selectedValues: header === "작업공종" ? existingValues : []
  };
  modal.classList.remove("hidden");
  modal.querySelector("#estimateDbDropdownTitle").textContent = `${header} 선택`;
  modal.querySelector("#estimateDbDropdownMultiHelp")?.classList.toggle("hidden", header !== "작업공종");
  const search = modal.querySelector("#estimateDbDropdownSearch");
  search.value = "";
  search.placeholder = getEstimateDbRows()[rowIndex]?.[colIndex] || "검색 또는 새 항목 입력";
  search.dataset.fresh = "1";
  renderEstimateDbDropdownList();
  setTimeout(() => { search.focus(); }, 0);
  return true;
}
function closeEstimateDbDropdown() {
  document.getElementById("estimateDbDropdownModal")?.classList.add("hidden");
  const state = estimateDbDropdownState;
  estimateDbDropdownState = null;
  if (state) requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}
function renderEstimateDbDropdownList() {
  const state = estimateDbDropdownState;
  const list = document.getElementById("estimateDbDropdownList");
  const search = document.getElementById("estimateDbDropdownSearch");
  if (!state || !list || !search) return;
  const rawKeyword = normalizeEstimateDbText(search.value);
  const keyword = (search.dataset.fresh === "1" || state.fresh) ? "" : rawKeyword.toLowerCase();
  const filtered = (state.options || []).filter(v => !keyword || String(v).toLowerCase().includes(keyword));
  state.noMatch = !!keyword && !filtered.length;
  state.filtered = filtered;
  state.activeIndex = Math.max(0, Math.min(state.activeIndex || 0, Math.max(0, filtered.length - 1)));
  if (state.noMatch) {
    list.innerHTML = `<div class="estimate-db-dropdown-empty">${state.tab === "pj" && getEstimateDbColumnName(state.tab, state.colIndex) === ESTIMATE_DB_PROJECT_LINK_HEADER ? "연결할 프로젝트가 없습니다." : "기존 데이터에 작성된 내용이 없습니다.(Enter를 누를 시 해당 목록 추가)"}</div>`;
    return;
  }
  list.innerHTML = filtered.map((option, index) => {
    const selected = !!state.multi && (state.selectedValues || []).includes(option);
    return `<button type="button" class="estimate-db-dropdown-option ${index === state.activeIndex ? "active" : ""} ${selected ? "selected" : ""}" onclick="selectEstimateDbDropdownOption(${index})">${selected ? "✓ " : ""}${escapeEstimateDbHtml(option)}</button>`;
  }).join("") || `<div class="estimate-db-dropdown-empty">목록이 없습니다. 입력 후 Enter를 누르면 해당 목록에 추가됩니다.</div>`;
}
function toggleEstimateDbDropdownMultiSelection(index = estimateDbDropdownState?.activeIndex || 0) {
  const state = estimateDbDropdownState;
  if (!state || !state.multi) return;
  const search = document.getElementById("estimateDbDropdownSearch");
  const typed = normalizeEstimateDbText(search?.value || "");
  const value = state.noMatch ? typed : (state.filtered?.[index] ?? typed);
  if (!value) return;
  if (state.noMatch || !(state.options || []).includes(value)) {
    addEstimateDbCustomOption(state.tab, state.colIndex, value);
    if (!state.options.includes(value)) state.options.push(value);
  }
  const selected = state.selectedValues || (state.selectedValues = []);
  const pos = selected.indexOf(value);
  if (pos >= 0) selected.splice(pos, 1);
  else selected.push(value);
  if (search) {
    search.value = selected.join(",");
    search.dataset.fresh = "1";
  }
  state.fresh = true;
  renderEstimateDbDropdownList();
}
function selectEstimateDbDropdownOption(index = estimateDbDropdownState?.activeIndex || 0) {
  const state = estimateDbDropdownState;
  if (!state) return;
  const search = document.getElementById("estimateDbDropdownSearch");
  const typed = normalizeEstimateDbText(search?.value || "");
  const pickedValue = state.noMatch ? typed : (state.filtered?.[index] ?? typed);
  const value = state.multi && (state.selectedValues || []).length ? state.selectedValues.join(",") : pickedValue;
  if (!value) return;
  const header = getEstimateDbColumnName(state.tab, state.colIndex);
  const row = state.rowIndex;
  const nextCol = state.colIndex + 1;
  if (state.tab === "pj" && header === ESTIMATE_DB_PROJECT_LINK_HEADER) {
    applyEstimateDbProjectLink(state.rowIndex, value);
  } else {
    if (!state.multi && (state.noMatch || !(state.options || []).includes(value))) addEstimateDbCustomOption(state.tab, state.colIndex, value);
    updateEstimateDbCell(state.rowIndex, state.colIndex, value, { silentRender: true });
  }
  closeEstimateDbDropdown();
  renderEstimateDbManage();
  if (header === "업무성격" && getEstimateDbColumnName(state.tab, nextCol) === "업무단계2") {
    requestAnimationFrame(() => openEstimateDbDropdown(row, nextCol));
  } else {
    requestAnimationFrame(() => focusEstimateDbCell(row, state.colIndex));
  }
}
function addEstimateDbDropdownOptionFromInput() {
  const search = document.getElementById("estimateDbDropdownSearch");
  const value = normalizeEstimateDbText(search?.value || "");
  if (!value || !estimateDbDropdownState) return;
  addEstimateDbCustomOption(estimateDbDropdownState.tab, estimateDbDropdownState.colIndex, value);
  if (!estimateDbDropdownState.options.includes(value)) estimateDbDropdownState.options.push(value);
  estimateDbDropdownState.noMatch = true;
  selectEstimateDbDropdownOption(0);
}
function handleEstimateDbDropdownKeydown(event) {
  const state = estimateDbDropdownState;
  if (!state) return;
  if (event.key === "Escape") { event.preventDefault(); closeEstimateDbDropdown(); return; }
  if (event.ctrlKey && String(event.key || "").toLowerCase() === "b") { event.preventDefault(); toggleEstimateDbDropdownMultiSelection(state.activeIndex || 0); return; }
  if (event.key === "ArrowDown") { event.preventDefault(); state.activeIndex = Math.min((state.filtered?.length || 1) - 1, (state.activeIndex || 0) + 1); renderEstimateDbDropdownList(); return; }
  if (event.key === "ArrowUp") { event.preventDefault(); state.activeIndex = Math.max(0, (state.activeIndex || 0) - 1); renderEstimateDbDropdownList(); return; }
  if (event.key === "Enter") { event.preventDefault(); selectEstimateDbDropdownOption(state.activeIndex || 0); return; }
}

let estimateDbAmountModalState = null;
function parseEstimateDbAmountCellValue(value) {
  const raw = String(value || "").trim();
  if (!raw) return { company: "", amount: "" };
  const parts = raw.split(/\n|\s*\/\s*/).map(v => v.trim()).filter(Boolean);
  if (parts.length >= 2) return { company: parts[0], amount: parts.slice(1).join(" / ") };
  return /^[-+]?\d[\d,]*$/.test(parts[0] || "") ? { company: "", amount: parts[0] } : { company: parts[0] || "", amount: "" };
}
function ensureEstimateDbAmountModal() {
  let modal = document.getElementById("estimateDbAmountModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbAmountModal";
  modal.className = "estimate-db-dropdown-modal hidden";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box estimate-db-amount-box" role="dialog" aria-modal="true">
      <div class="estimate-db-dropdown-title" id="estimateDbAmountTitle">외주 금액 입력</div>
      <label class="estimate-db-amount-label">업체명<input id="estimateDbAmountCompany" class="estimate-db-dropdown-search" placeholder="예: (주)대신엔지니어링" /></label>
      <label class="estimate-db-amount-label">금액<input id="estimateDbAmountValue" class="estimate-db-dropdown-search" placeholder="예: 200000" /></label>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbAmountModal()">닫기</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbAmountModal()">저장</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("mousedown", event => { if (event.target === modal) closeEstimateDbAmountModal(); });
  modal.querySelectorAll("input").forEach(input => input.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); closeEstimateDbAmountModal(); }
    if (event.key === "Enter") { event.preventDefault(); saveEstimateDbAmountModal(); }
  }));
  return modal;
}
function openEstimateDbAmountModal(rowIndex = estimateDbSelectedCell.rowIndex || 0, colIndex = estimateDbSelectedCell.colIndex || 0) {
  if (!isEstimateDbOutsourceAmountCell(estimateDbActiveTab, colIndex)) return false;
  const modal = ensureEstimateDbAmountModal();
  const row = getEstimateDbRows()?.[rowIndex] || [];
  const parsed = parseEstimateDbAmountCellValue(row[colIndex]);
  estimateDbAmountModalState = { tab: estimateDbActiveTab, rowIndex, colIndex };
  modal.classList.remove("hidden");
  modal.querySelector("#estimateDbAmountTitle").textContent = `${getEstimateDbColumnName(estimateDbActiveTab, colIndex)} 금액 입력`;
  modal.querySelector("#estimateDbAmountCompany").value = parsed.company || "";
  modal.querySelector("#estimateDbAmountValue").value = parsed.amount ? formatEstimateDbCommaNumber(parsed.amount) : "";
  setTimeout(() => modal.querySelector("#estimateDbAmountCompany")?.focus(), 0);
  return true;
}
function closeEstimateDbAmountModal() {
  document.getElementById("estimateDbAmountModal")?.classList.add("hidden");
  const state = estimateDbAmountModalState;
  estimateDbAmountModalState = null;
  if (state) requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}
function saveEstimateDbAmountModal() {
  const state = estimateDbAmountModalState;
  if (!state) return;
  const company = normalizeEstimateDbText(document.getElementById("estimateDbAmountCompany")?.value || "");
  const amount = normalizeEstimateDbText(document.getElementById("estimateDbAmountValue")?.value || "");
  const value = company && amount ? `${company}\n${amount}` : [company, amount].filter(Boolean).join("\n");
  updateEstimateDbCell(state.rowIndex, state.colIndex, value, { silentRender: true });
  closeEstimateDbAmountModal();
  renderEstimateDbManage();
}
function handleEstimateDbKeydown(event) {
  const input = event.currentTarget;
  if (!input?.classList?.contains("quote-db-cell-input")) return;
  if (!document.getElementById("estimateDbManage")?.classList.contains("active")) return;
  if (!input.closest?.("#estimateDbManage .quote-db-grid-wrap")) return;
  event.stopPropagation();
  const rowIndex = Number(input.dataset.rowIndex || 0);
  const colIndex = Number(input.dataset.colIndex || 0);
  const rows = getEstimateDbRows();
  const colCount = getEstimateDbLeafColumns().length;
  const keyLower = String(event.key || "").toLowerCase();
  if (event.ctrlKey && keyLower === "s") {
    event.preventDefault();
    commitEstimateDbPendingEdits();
    requestAnimationFrame(() => focusEstimateDbCell(rowIndex, colIndex));
    return;
  }
  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    commitEstimateDbPendingEdits({ silent: true });
    syncEstimateDbNewPjRowsToLinkedSheets();
    return;
  }
  if (event.altKey && event.key === "Insert") {
    event.preventDefault();
    if (estimateDbActiveTab === "progress") {
      if (isEstimateDbContractAmountBreakdownColumn(estimateDbActiveTab, colIndex) || [getEstimateDbContractAmountColumnIndex(), getEstimateDbContractVatColumnIndex()].includes(colIndex)) {
        addEstimateDbProgressContractAmountColumn();
      } else {
        addEstimateDbProgressStageColumns();
      }
    }
    return;
  }
  if (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbPjNoColumn(estimateDbActiveTab, colIndex)) {
    event.preventDefault();
    commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
    applyEstimateDbPjDefaultSort();
    estimateDbSelectedCell = { tab: estimateDbActiveTab, sectionIndex: null, rowIndex, colIndex };
    renderEstimateDbManage();
    requestAnimationFrame(() => focusEstimateDbCell(rowIndex, colIndex));
    return;
  }
  if (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbPjMemoColumn(estimateDbActiveTab, colIndex)) {
    event.preventDefault();
    openEstimateDbPjMemoModal(rowIndex, colIndex);
    return;
  }
  if (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbStoryCell(estimateDbActiveTab, colIndex)) {
    event.preventDefault();
    const summary = input.value || "";
    const row = getEstimateDbRows()?.[rowIndex];
    const current = parseEstimateDbRichCellValue(row?.[colIndex]) || {};
    updateEstimateDbCell(rowIndex, colIndex, stringifyEstimateDbRichCellValue({ type: "progressStory", summary, full: current.full || summary }), { commit: true, silentRender: true });
    openEstimateDbStoryModal(rowIndex, colIndex);
    return;
  }
  if (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbContractAmountBreakdownColumn(estimateDbActiveTab, colIndex)) {
    event.preventDefault();
    commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
    openEstimateDbContractAmountModal(rowIndex, colIndex);
    return;
  }
  if (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbStageEntryCell(estimateDbActiveTab, colIndex)) {
    event.preventDefault();
    const currentText = String(input.value || "").replace(/,/g, "");
    if (currentText && !parseEstimateDbRichCellValue(getEstimateDbRows()?.[rowIndex]?.[colIndex])) {
      updateEstimateDbCell(rowIndex, colIndex, stringifyEstimateDbRichCellValue({ type: "stageFormula", formula: currentText, note: "", amount: String(toEstimateDbNumber(currentText)) }), { commit: true, silentRender: true });
    }
    openEstimateDbStageFormulaModal(rowIndex, colIndex);
    return;
  }
  if (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbOutsourceAmountCell(estimateDbActiveTab, colIndex)) {
    event.preventDefault();
    openEstimateDbAmountModal(rowIndex, colIndex);
    return;
  }
  if (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbContactColumn(estimateDbActiveTab, colIndex)) {
    event.preventDefault();
    commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
    openEstimateDbContactModal(rowIndex, colIndex);
    return;
  }
  if ((event.altKey && event.key === "ArrowDown") || (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbDropdownCell(estimateDbActiveTab, colIndex))) {
    event.preventDefault();
    openEstimateDbDropdown(rowIndex, colIndex);
    return;
  }
  if (!event.ctrlKey && !event.altKey && event.key === "Enter") {
    event.preventDefault();
    commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex);

    // 날짜 입력 컬럼은 저장 대기값을 확정한 직후 현재 선택된 입력칸에도
    // 260105 → 26년1월5일 형식으로 즉시 반영합니다.
    // 적용 범위: 견적서일자, 수주일자, 계약일자, 납품예정일 1~3차납품.
    if (isEstimateDbCreatedDateColumn(estimateDbActiveTab, colIndex)) {
      const storedValue = getEstimateDbRows()?.[rowIndex]?.[colIndex] || "";
      input.value = formatEstimateDbFullKoreanDate(storedValue);
      applyEstimateDbPjDefaultSort();
    } else if (isEstimateDbDateInputColumn(estimateDbActiveTab, colIndex)) {
      const storedValue = getEstimateDbRows()?.[rowIndex]?.[colIndex] || "";
      input.value = formatEstimateDbCompactDate(storedValue);
    }

    refreshEstimateDbCalculatedCells(rowIndex);
    refreshEstimateDbTotalRowOnly();
    renderEstimateDbReports();
    updateEstimateDbSaveButtonState();
    requestAnimationFrame(() => focusEstimateDbCell(rowIndex, colIndex));
    return;
  }
  if (event.ctrlKey && event.key === "F9") {
    event.preventDefault();
    addEstimateDbRow(null, rowIndex + 1);
    requestAnimationFrame(() => focusEstimateDbCell(rowIndex + 1, colIndex));
    return;
  }
  if (event.ctrlKey && event.key === "F3") {
    event.preventDefault();
    duplicateEstimateDbRow(rowIndex);
    requestAnimationFrame(() => focusEstimateDbCell(rowIndex + 1, colIndex));
    return;
  }
  if (event.ctrlKey && (event.key === "Delete" || event.key === "Del")) {
    event.preventDefault();
    removeEstimateDbRow(rowIndex);
    requestAnimationFrame(() => focusEstimateDbCell(Math.max(0, rowIndex - 1), Math.min(colIndex, colCount - 1)));
    return;
  }
  const arrowMap = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
  if (!event.ctrlKey && arrowMap[event.key]) {
    const [dr, dc] = arrowMap[event.key];
    const nextCell = getEstimateDbNextVisibleCell(rowIndex, colIndex, dr, dc, colCount);
    if (nextCell && (nextCell.rowIndex !== rowIndex || nextCell.colIndex !== colIndex)) {
      event.preventDefault();
      focusEstimateDbCell(nextCell.rowIndex, nextCell.colIndex);
    }
  }
}

function getEstimateDbNextScreenVisibleCol(colIndex, colDelta, colCount = getEstimateDbLeafColumns().length) {
  if (!colDelta) return colIndex;
  let nextCol = Math.max(0, Math.min(colCount - 1, colIndex + colDelta));
  while (nextCol >= 0 && nextCol < colCount && !isEstimateDbColumnVisibleOnScreen(estimateDbActiveTab, nextCol)) {
    const candidate = nextCol + colDelta;
    if (candidate < 0 || candidate >= colCount) break;
    nextCol = candidate;
  }
  if (!isEstimateDbColumnVisibleOnScreen(estimateDbActiveTab, nextCol)) return colIndex;
  return nextCol;
}

function getEstimateDbNextVisibleCell(rowIndex, colIndex, rowDelta, colDelta, colCount = getEstimateDbLeafColumns().length) {
  const nextCol = getEstimateDbNextScreenVisibleCol(colIndex, colDelta, colCount);

  // 좌우 이동은 같은 데이터 행 안에서만 이동합니다.
  if (!rowDelta) {
    return { rowIndex, colIndex: nextCol };
  }

  // PJ NO 기본 내림차순처럼 화면 정렬 순서와 원본 배열 순서가 다를 수 있으므로,
  // 위/아래 방향키는 현재 DOM에 표시된 행 순서를 기준으로 다음 행을 찾습니다.
  const visibleRows = Array.from(document.querySelectorAll("#estimateDbBody .quote-db-data-row"));
  if (!visibleRows.length) {
    const rows = getEstimateDbRows();
    return {
      rowIndex: Math.max(0, Math.min(rows.length - 1, rowIndex + rowDelta)),
      colIndex: nextCol
    };
  }

  let domIndex = visibleRows.findIndex(row => Number(row.dataset.rowIndex) === Number(rowIndex));

  // 포커스 정보가 정렬 직후 잠깐 어긋난 경우, 현재 활성 input 기준으로 보정합니다.
  if (domIndex < 0) {
    const activeRow = document.activeElement?.closest?.("#estimateDbBody .quote-db-data-row");
    if (activeRow) domIndex = visibleRows.indexOf(activeRow);
  }

  if (domIndex < 0) return { rowIndex, colIndex: nextCol };

  const nextDomIndex = Math.max(0, Math.min(visibleRows.length - 1, domIndex + rowDelta));
  const nextRowIndex = Number(visibleRows[nextDomIndex]?.dataset.rowIndex);

  if (!Number.isFinite(nextRowIndex)) return { rowIndex, colIndex: nextCol };
  return { rowIndex: nextRowIndex, colIndex: nextCol };
}
function getEstimateDbRowValueByHeader(tab, row, headerName) {
  const idx = getEstimateDbColumnIndexByHeader(tab, headerName);
  return idx >= 0 ? row?.[idx] : "";
}
function makeEstimateDbSyncKey(parts) {
  const year = normalizeEstimateDbText(parts.year);
  const receiptNo = normalizeEstimateDbText(parts.receiptNo);
  const pjNo = normalizeEstimateDbText(parts.pjNo);
  const pjName = normalizeEstimateDbText(parts.pjName);
  // 연동 기준은 년도/접수번호/PJ NO 조합이지만, "년도만 있는 빈 행"은 연동 대상으로 보지 않습니다.
  if (pjNo || receiptNo) return [year, receiptNo, pjNo].join("::");
  return pjName ? `name::${pjName}` : "";
}
function getEstimateDbPjSyncPayload(pjRowIndex) {
  const pjSheet = estimateDbSheets.pj;
  const pjCols = getEstimateDbLeafColumns(pjSheet);
  const row = pjSheet.rows?.[pjRowIndex];
  if (!row) return null;
  const value = name => row[pjCols.indexOf(name)] || "";
  const payload = {
    year: value(ESTIMATE_DB_CREATED_DATE_HEADER) || value("년도"),
    receiptNo: value("접수번호"),
    pjNo: value("PJ NO"),
    pjName: value("프로젝트명"),
    company: value("거래처명"),
    sourceIndex: pjRowIndex
  };
  payload.key = makeEstimateDbSyncKey(payload);
  // PJ NO/접수번호/프로젝트명 중 하나도 없는 단순 빈 행은 연동하지 않습니다.
  if (!payload.key) return null;
  return payload;
}
function estimateDbTargetRowKey(tab, row) {
  return makeEstimateDbSyncKey({
    year: getEstimateDbRowValueByHeader(tab, row, ESTIMATE_DB_CREATED_DATE_HEADER) || getEstimateDbRowValueByHeader(tab, row, "년도"),
    receiptNo: getEstimateDbRowValueByHeader(tab, row, "접수번호"),
    pjNo: getEstimateDbRowValueByHeader(tab, row, "PJ NO"),
    pjName: getEstimateDbRowValueByHeader(tab, row, "PJ명") || getEstimateDbRowValueByHeader(tab, row, "프로젝트명")
  });
}
function syncEstimateDbLinkedRowsFromPj(pjRowIndex) {
  const payload = getEstimateDbPjSyncPayload(pjRowIndex);
  if (!payload) return 0;
  let changed = 0;
  changed += syncEstimateDbTargetRow("progress", payload.key, {
    "최초생성날짜": payload.year,
    "년도": payload.year,
    "접수번호": payload.receiptNo,
    "PJ NO": payload.pjNo,
    "업체명": payload.company,
    "PJ명": payload.pjName
  }, payload.sourceIndex);
  changed += syncEstimateDbTargetRow("mep", payload.key, {
    "최초생성날짜": payload.year,
    "년도": payload.year,
    "접수번호": payload.receiptNo,
    "PJ NO": payload.pjNo,
    "PJ명": payload.pjName
  }, payload.sourceIndex);
  return changed;
}
function syncEstimateDbTargetRow(tab, syncKey, values, sourceIndex = null) {
  const sheet = estimateDbSheets[tab];
  if (!sheet || !syncKey) return 0;
  const cols = getEstimateDbLeafColumns(sheet);
  if (!sheet.rows) sheet.rows = [];

  // 1) 현재 키가 완전히 일치하는 기존 행 우선 탐색
  let target = sheet.rows.find(row => estimateDbTargetRowKey(tab, row) === syncKey);

  // 2) 같은 PJ관리 행에서 이전에 연동했던 행이면 PJ NO/접수번호가 바뀌어도 같은 행을 갱신
  if (!target && sourceIndex !== null && sourceIndex !== undefined) {
    target = sheet.rows.find(row => row && row.__sourcePjRowIndex === sourceIndex);
  }

  // 3) 이전 버전에서 __sourcePjRowIndex가 없던 행 보정: PJ관리의 유효 행 순서와 대상 탭 유효 행 순서를 맞춰 갱신
  if (!target && sourceIndex !== null && sourceIndex !== undefined) {
    const pjPayloads = (estimateDbSheets.pj.rows || []).map((_, i) => getEstimateDbPjSyncPayload(i)).filter(Boolean);
    const orderIndex = pjPayloads.findIndex(payload => payload.sourceIndex === sourceIndex);
    const linkedRows = sheet.rows.filter(row => !!estimateDbTargetRowKey(tab, row));
    if (orderIndex >= 0 && linkedRows[orderIndex]) target = linkedRows[orderIndex];
  }

  let changed = 0;
  if (!target) {
    target = Array(cols.length).fill("");
    sheet.rows.push(target);
    changed = 1;
  }
  if (sourceIndex !== null && sourceIndex !== undefined) target.__sourcePjRowIndex = sourceIndex;
  target.__syncKey = syncKey;

  Object.entries(values).forEach(([name, value]) => {
    const idx = getEstimateDbColumnIndexByHeader(tab, name);
    if (idx >= 0 && normalizeEstimateDbText(value) && normalizeEstimateDbText(target[idx]) !== normalizeEstimateDbText(value)) {
      target[idx] = value;
      changed = 1;
    }
  });
  recalcEstimateDbRow(tab, target);
  return changed;
}
function syncAllEstimateDbLinkedRows() {
  // 자동 동기화는 사용하지 않습니다. 사용자가 Ctrl+Enter 또는 버튼으로 명시 실행할 때만 반영합니다.
}
function updateEstimateDbCell(rowIndex, colIndex, value, options = {}) {
  const rows = getEstimateDbRows();
  if (!rows?.[rowIndex]) return;
  const tab = options.tab || estimateDbActiveTab;

  if (options.pending || !options.commit) {
    setEstimateDbPendingEdit(tab, rowIndex, colIndex, value);
    updateEstimateDbSaveButtonState();
    return;
  }

  const storedValue = normalizeEstimateDbCellForStorage(tab, colIndex, value);
  rows[rowIndex][colIndex] = storedValue;
  recalcEstimateDbRow(tab, rows[rowIndex]);
  if (tab === "pj") ensureEstimateDbPjIdentityColumnsOnce?.({ assignMissing: true });
  if (!options.silentRender) {
    refreshEstimateDbCalculatedCells(rowIndex);
    refreshEstimateDbTotalRowOnly();
    renderEstimateDbReports();
  }
}
function addEstimateDbRow(_sectionIndex = null, insertAt = null) {
  const sheet = getEstimateDbSheet();
  const columns = getEstimateDbLeafColumns(sheet);
  const next = Array(columns.length).fill("");
  const createdDateIndex = findEstimateDbColumnIndexByAnyName(columns, [ESTIMATE_DB_CREATED_DATE_HEADER, "년도"]);
  const pjNoIndex = columns.findIndex(c => normalizeEstimateDbText(c) === "PJ NO");
  if (createdDateIndex >= 0) next[createdDateIndex] = formatEstimateDbKoreanDate();
  if (estimateDbActiveTab === "pj" && pjNoIndex >= 0) {
    const year = getEstimateDbCreatedDateYear(next[createdDateIndex]);
    next[pjNoIndex] = getEstimateDbNextPjNoForYear(year);
  }
  const rows = getEstimateDbRows(sheet);
  if (insertAt === null || insertAt === undefined || insertAt > rows.length) rows.push(next);
  else rows.splice(Math.max(0, insertAt), 0, next);
  if (estimateDbActiveTab === "pj") ensureEstimateDbPjIdentityColumnsOnce?.({ assignMissing: true });
  applyEstimateDbPjDefaultSort();
  renderEstimateDbManage();
}
function duplicateEstimateDbRow(rowIndex = estimateDbSelectedCell.rowIndex || 0) {
  const rows = getEstimateDbRows();
  if (!rows?.[rowIndex]) return;
  rows.splice(rowIndex + 1, 0, [...rows[rowIndex]]);
  renderEstimateDbManage();
}
function removeEstimateDbRow(rowIndex = estimateDbSelectedCell.rowIndex || 0) {
  const rows = getEstimateDbRows();
  if (!rows?.[rowIndex]) return;
  rows.splice(rowIndex, 1);
  estimateDbSelectedCell = { tab: estimateDbActiveTab, sectionIndex: null, rowIndex: Math.max(0, rowIndex - 1), colIndex: estimateDbSelectedCell.colIndex || 0 };
  renderEstimateDbManage();
}
function syncEstimateDbNewPjRowsToLinkedSheets() {
  commitEstimateDbPendingEdits({ silent: true });
  if (!document.getElementById("estimateDbManage")?.classList.contains("active")) return;
  const focusBeforeSync = { ...(estimateDbSelectedCell || {}), tab: estimateDbActiveTab };
  const activeElement = document.activeElement;
  if (activeElement?.classList?.contains("quote-db-cell-input")) {
    focusBeforeSync.rowIndex = Number(activeElement.dataset.rowIndex || focusBeforeSync.rowIndex || 0);
    focusBeforeSync.colIndex = Number(activeElement.dataset.colIndex || focusBeforeSync.colIndex || 0);
  }
  const rows = estimateDbSheets.pj.rows || [];
  let changed = 0;
  let valid = 0;
  rows.forEach((_row, index) => {
    if (getEstimateDbPjSyncPayload(index)) {
      valid += 1;
      changed += syncEstimateDbLinkedRowsFromPj(index);
    }
  });
  recalcAllEstimateDbRows();
  estimateDbActiveTab = focusBeforeSync.tab || estimateDbActiveTab;
  estimateDbSelectedCell = {
    tab: estimateDbActiveTab,
    sectionIndex: null,
    rowIndex: focusBeforeSync.rowIndex || 0,
    colIndex: focusBeforeSync.colIndex || 0
  };
  renderEstimateDbManage();
  requestAnimationFrame(() => focusEstimateDbCell(estimateDbSelectedCell.rowIndex, estimateDbSelectedCell.colIndex));
  if (typeof showToast === "function") {
    if (changed) showToast(`기성관리·기전업체에 ${changed}건을 연동했습니다.`);
    else showToast(valid ? "기성관리·기전업체가 이미 최신 상태입니다." : "연동할 신규/변경 항목이 없습니다.");
  }
}
function exportEstimateDbJsonForAi() {
  removeEstimateDbPjReceiptColumnOnce();
  ensureEstimateDbPjProjectLinkColumnOnce();
  ensureEstimateDbPjIdentityColumnsOnce?.({ assignMissing: true });
  const payload = {
    exportedAt: new Date().toISOString(),
    note: "DB관리 더미데이터 요청용 JSON입니다. 이 값을 수정/추가해서 다시 전달하면 동일 구조로 반영할 수 있습니다.",
    activeTab: estimateDbActiveTab,
    sheets: Object.fromEntries(Object.entries(estimateDbSheets).map(([key, sheet]) => [key, {
      title: sheet.title,
      excelName: sheet.excelName,
      headers: getEstimateDbLeafColumns(sheet),
      requestRow: sheet.requestRow || [],
      rows: sheet.rows || []
    }]))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `concost_db_dummy_data_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function getEstimateDbRowsByYear(tab, year = getSelectedEstimateDbYear()) {
  const sheet = estimateDbSheets[tab];
  const columns = getEstimateDbLeafColumns(sheet);
  const yearIndex = findEstimateDbColumnIndexByAnyName(columns, [ESTIMATE_DB_CREATED_DATE_HEADER, "년도"]);
  return (sheet.rows || []).filter(row => {
    const val = yearIndex >= 0 ? row[yearIndex] : row[0];
    return parseEstimateDbYear(val) === String(year);
  });
}
function estimateDbIndexMap(tab) {
  const columns = getEstimateDbLeafColumns(estimateDbSheets[tab]);
  return Object.fromEntries(columns.map((name, i) => [name, i]));
}
function sumEstimateDbByMonth(rows, monthIndex, amountIndex, year = getSelectedEstimateDbYear()) {
  return rows.reduce((sum, row) => {
    const month = parseEstimateDbMonth(row[monthIndex]);
    if (month && month === Number(monthIndex === -1 ? 0 : row.__monthFilter)) return sum;
    return sum + toEstimateDbNumber(row[amountIndex]);
  }, 0);
}
function buildOrderRows(year = getSelectedEstimateDbYear()) {
  const idx = estimateDbIndexMap("pj");
  const mepIdx = estimateDbIndexMap("mep");
  const rows = getEstimateDbRowsByYear("pj", year);
  const mepRows = getEstimateDbRowsByYear("mep", year);
  const monthly = Array.from({ length: 12 }, (_, m) => {
    const month = m + 1;
    const monthRows = rows.filter(row => parseEstimateDbMonth(row[idx["수주일자"]]) === month);
    const outRows = mepRows.filter(row => parseEstimateDbMonth(row[mepIdx["지급일자1"]]) === month || parseEstimateDbMonth(row[mepIdx["지급일자2"]]) === month);
    const orderAmount = monthRows.reduce((sum, row) => sum + toEstimateDbNumber(row[idx["연면적(평)"]]) * 14000, 0);
    const outAmount = outRows.reduce((sum, row) => sum + toEstimateDbNumber(row[mepIdx["지급합계"]] || row[mepIdx["계약금액"]]), 0);
    return [year, `${month}월`, monthRows.length || "", orderAmount, 0, orderAmount, outAmount, Math.max(0, orderAmount - outAmount), ""];
  });
  const detailHeader = ["NO", "수주월", "거래처명", "프로젝트명", "작업공종", "수주일자", "최종수주액", "기전/외주", "컨코스트", "PM(마감)", "PM(구조)", "PM(토목,조경)"];
  const detail = rows.map(row => {
    const amount = toEstimateDbNumber(row[idx["연면적(평)"]]) * 14000;
    const month = parseEstimateDbMonth(row[idx["수주일자"]]) || "";
    return [row[idx["접수번호"]], month ? `${month}월` : "", row[idx["거래처명"]], row[idx["프로젝트명"]], row[idx["작업공종"]], row[idx["수주일자"]], amount, "", amount, row[idx["PM(마감)"]], row[idx["PM(구조)"]], row[idx["PM(토목,조경)"]]];
  });
  return { title: `${year}년 수주`, header: ["년도", "월", "건 수", "수주액", "조정금액", "최종수주액(①)", "기전/외주(②)", "컨코스트(①-②)", "비고"], monthly, detailHeader, detail };
}
function buildSalesRows(year = getSelectedEstimateDbYear()) {
  const idx = estimateDbIndexMap("progress");
  const rows = getEstimateDbRowsByYear("progress", year);
  const monthly = Array.from({ length: 12 }, (_, m) => {
    const month = m + 1;
    const monthRows = rows.filter(row => parseEstimateDbMonth(row[idx["계약일자"]] || row[idx["수주일자"]]) === month);
    const amount = monthRows.reduce((sum, row) => sum + toEstimateDbNumber(row[idx["계약금액"]]), 0);
    const out = monthRows.reduce((sum, row) => sum + toEstimateDbNumber(row[idx["외주합계"]]), 0);
    return [year, `${month}월`, monthRows.length || "", amount, Math.round(amount * 1.1), out, Math.max(0, amount - out), ""];
  });
  const detailHeader = ["PJ NO", "업체명", "PJ명", "계약금액", "수령액", "잔액", "외주합계", "계약일자", "총괄PM", "납품예정일", "특이사항"];
  const detail = rows.map(row => [row[idx["PJ NO"]], row[idx["업체명"]], row[idx["PJ명"]], row[idx["계약금액"]], row[idx["수령액"]], row[idx["잔액"]], row[idx["외주합계"]], row[idx["계약일자"]], row[idx["총괄PM"]], row[idx["납품예정일"]], row[idx["특이사항"]]]);
  return { title: `${year}년 매출`, header: ["년도", "월", "건 수", "발행액(①)", "발행액(①)VAT포함", "기전/외주(②)", "컨코스트(①-②)", "비고"], monthly, detailHeader, detail };
}
function buildDepositRows(year = getSelectedEstimateDbYear()) {
  const idx = estimateDbIndexMap("progress");
  const rows = getEstimateDbRowsByYear("progress", year);
  const detailHeader = ["NO", "업체", "프로젝트명", "기성담당자", "총액", "기수령액", "청구액(별도)", "청구액(포함)", "청구후잔액", "기전/외주", "발행일", "지급예상일", "지급일", "지급액(vat별도)", "지급액(vat포함)", "은행명", "종류", "비고"];
  const detail = rows.map(row => {
    const total = toEstimateDbNumber(row[idx["계약금액"]]);
    const paid = toEstimateDbNumber(row[idx["수령액"]]);
    const bill = Math.max(0, total - paid);
    return [row[idx["PJ NO"]], row[idx["업체명"]], row[idx["PJ명"]], row[idx["기성담당자"]], total, paid, bill, Math.round(bill * 1.1), Math.max(0, total - paid - bill), row[idx["외주합계"]], row[idx["계약금_세금계산서"]], row[idx["납품예정일"]], row[idx["계약금_입금일"]], bill, Math.round(bill * 1.1), "", "", row[idx["특이사항"]]];
  });
  return { title: `${year}년 입금`, detailHeader, detail };
}
function buildSummaryRows(year = getSelectedEstimateDbYear()) {
  const order = buildOrderRows(year).monthly;
  const sales = buildSalesRows(year).monthly;
  const deposit = buildDepositRows(year).detail;
  return Array.from({ length: 12 }, (_, m) => {
    const orderAmount = toEstimateDbNumber(order[m][5]);
    const orderOut = toEstimateDbNumber(order[m][6]);
    const salesAmount = toEstimateDbNumber(sales[m][3]);
    const salesOut = toEstimateDbNumber(sales[m][5]);
    const depRows = deposit.filter(row => parseEstimateDbMonth(row[12]) === m + 1 || parseEstimateDbMonth(row[10]) === m + 1);
    const depAmount = depRows.reduce((sum, row) => sum + toEstimateDbNumber(row[13]), 0);
    const depOut = depRows.reduce((sum, row) => sum + toEstimateDbNumber(row[9]), 0);
    const orderTarget = getEstimateDbMonthlyTarget("order", year, m + 1);
    const salesTarget = getEstimateDbMonthlyTarget("sales", year, m + 1);
    const depositTarget = getEstimateDbMonthlyTarget("deposit", year, m + 1);
    return [`${m + 1}월`, orderTarget, orderAmount, orderOut, orderAmount - orderOut, pct(orderAmount - orderOut, orderTarget), pct(orderAmount, orderTarget), salesTarget, salesAmount, salesOut, salesAmount - salesOut, pct(salesAmount - salesOut, salesTarget), pct(salesAmount, salesTarget), depositTarget, depAmount, depOut, depAmount - depOut, pct(depAmount - depOut, depositTarget), pct(depAmount, depositTarget), ""];
  });
}
function pct(value, total) { return total ? Math.round((value / total) * 1000) / 10 + "%" : "0%"; }

function ensureEstimateDbSalesTargetModal() {
  let modal = document.getElementById("estimateDbSalesTargetModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbSalesTargetModal";
  modal.className = "estimate-db-dropdown-modal hidden";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box estimate-db-sales-target-box" role="dialog" aria-modal="true" style="max-width:760px;">
      <div class="estimate-db-dropdown-title">월별 목표 설정</div>
      <div id="estimateDbSalesTargetGrid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0;"></div>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbSalesTargetModal()">닫기</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbSalesTargetModal()">저장</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("mousedown", event => { if (event.target === modal) closeEstimateDbSalesTargetModal(); });
  return modal;
}

function openEstimateDbSalesTargetModal() {
  const year = getSelectedEstimateDbYear();
  const modal = ensureEstimateDbSalesTargetModal();
  const grid = modal.querySelector("#estimateDbSalesTargetGrid");
  grid.innerHTML = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return ESTIMATE_DB_TARGET_TYPES.map(type => {
      const value = getEstimateDbMonthlyTarget(type.key, year, month);
      return `<label class="estimate-db-amount-label">${month}월 ${type.label}<input class="estimate-db-dropdown-search estimate-db-sales-target-input" onkeydown="handleEstimateDbSalesTargetKeydown(event)" data-target-type="${type.key}" data-month="${month}" value="${escapeEstimateDbHtml(formatEstimateDbCommaNumber(value))}" oninput="this.value = formatEstimateDbCommaNumber(this.value.replace(/[^0-9.-]/g, ''))" /></label>`;
    }).join("");
  }).join("");
  modal.classList.remove("hidden");
  setTimeout(() => modal.querySelector(".estimate-db-sales-target-input")?.focus(), 0);
}


function handleEstimateDbSalesTargetKeydown(event) {
  const input = event?.currentTarget;
  if (!input?.classList?.contains("estimate-db-sales-target-input")) return;
  const inputs = Array.from(document.querySelectorAll("#estimateDbSalesTargetModal .estimate-db-sales-target-input"));
  const index = inputs.indexOf(input);
  if (index < 0) return;
  const columns = 3;
  let nextIndex = index;
  if (event.key === "ArrowRight") nextIndex = Math.min(inputs.length - 1, index + 1);
  else if (event.key === "ArrowLeft") nextIndex = Math.max(0, index - 1);
  else if (event.key === "ArrowDown") nextIndex = Math.min(inputs.length - 1, index + columns);
  else if (event.key === "ArrowUp") nextIndex = Math.max(0, index - columns);
  else if (event.key === "Enter") {
    event.preventDefault();
    saveEstimateDbSalesTargetModal();
    return;
  } else {
    return;
  }
  event.preventDefault();
  inputs[nextIndex]?.focus();
  inputs[nextIndex]?.select?.();
}

function closeEstimateDbSalesTargetModal() {
  document.getElementById("estimateDbSalesTargetModal")?.classList.add("hidden");
}

function saveEstimateDbSalesTargetModal() {
  const year = getSelectedEstimateDbYear();
  document.querySelectorAll("#estimateDbSalesTargetModal .estimate-db-sales-target-input").forEach(input => {
    setEstimateDbMonthlyTarget(input.dataset.targetType || "sales", year, Number(input.dataset.month), input.value);
  });
  closeEstimateDbSalesTargetModal();
  renderEstimateDbReports();
  if (typeof showToast === "function") showToast(`${year}년 월별 목표를 저장했습니다.`);
}

function ensureEstimateDbReportActionHost() {
  const head = document.querySelector("#estimateDbManage .quote-db-report-head");
  const tabs = document.getElementById("estimateDbReportTabs");
  if (!head || !tabs) return null;
  let host = document.getElementById("estimateDbReportActionHost");
  if (!host) {
    host = document.createElement("div");
    host.id = "estimateDbReportActionHost";
    host.className = "estimate-db-report-action-host";
  }
  if (host.parentNode !== head.parentNode || host.previousElementSibling !== head) {
    head.parentNode.insertBefore(host, head.nextSibling);
  }
  return host;
}

function normalizeEstimateDbReportScrollArea() {
  const body = document.getElementById("estimateDbReportBody");
  if (!body) return;
  body.style.overflowY = "visible";
  body.style.maxHeight = "none";
  body.style.height = "auto";
  body.style.paddingTop = "0";
  body.style.position = "relative";

  const reportCard = body.closest(".quote-report-card, .estimate-db-report-card, .card, .panel, .work-card");
  if (reportCard) {
    reportCard.style.overflowY = "visible";
    reportCard.style.maxHeight = "none";
  }
}

function renderEstimateDbReportActions() {
  return "";
}

function renderEstimateDbReports() {
  const tabs = document.getElementById("estimateDbReportTabs");
  const target = document.getElementById("estimateDbReportBody");
  if (!tabs || !target) return;
  tabs.querySelectorAll("button").forEach(btn => btn.classList.toggle("active", btn.dataset.reportTab === estimateDbReportActiveTab));
  ensureEstimateDbReportLayoutStyle();
  normalizeEstimateDbReportScrollArea();
  const actionHost = ensureEstimateDbReportActionHost();
  if (actionHost) actionHost.innerHTML = renderEstimateDbReportActions();
  const year = getSelectedEstimateDbYear();
  let html = "";
  if (estimateDbReportActiveTab === "summary") {
    const rows = buildSummaryRows(year);
    html = renderReportTable(`${year}년 수주.매출.입금`, [["구분", "수주목표", "수주달성", "기전/외주", "차액", "비율1", "비율2", "매출목표", "매출달성", "기전/외주", "차액", "비율1", "비율2", "입금목표", "입금달성", "기전/외주", "차액", "비율1", "비율2", "비고"]], rows);
  } else if (estimateDbReportActiveTab === "order") {
    const data = buildOrderRows(year);
    html = renderReportTable(data.title, [data.header], data.monthly) + renderReportTable("수주 프로젝트 상세", [data.detailHeader], data.detail);
  } else if (estimateDbReportActiveTab === "sales") {
    const data = buildSalesRows(year);
    html = renderReportTable(data.title, [data.header], data.monthly) + renderReportTable("매출 프로젝트 상세", [data.detailHeader], data.detail);
  } else {
    const data = buildDepositRows(year);
    html = renderReportTable(data.title, [data.detailHeader], data.detail);
  }
  target.innerHTML = html;
}
function renderReportTable(title, headerRows, rows) {
  return `<div class="quote-report-table-block" style="overflow-x:auto;overflow-y:visible;max-height:none;"><h3>${escapeEstimateDbHtml(title)}</h3><table class="quote-report-table"><thead>${headerRows.map(row => `<tr>${row.map(cell => `<th>${escapeEstimateDbHtml(cell)}</th>`).join("")}</tr>`).join("")}</thead><tbody>${rows.length ? rows.map(row => `<tr>${row.map(cell => `<td>${escapeEstimateDbHtml(formatEstimateDbReportCell(cell))}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headerRows[0]?.length || 1}" class="empty-cell">해당 연도 데이터가 없습니다.</td></tr>`}</tbody></table></div>`;
}

function ensureEstimateDbReportLayoutStyle() {
  if (document.getElementById("estimateDbReportLayoutStyle")) return;
  const style = document.createElement("style");
  style.id = "estimateDbReportLayoutStyle";
  style.textContent = `
    #estimateDbReportActionHost { display:flex; justify-content:flex-end; align-items:center; margin:0 0 12px 0; }
    #estimateDbReportBody { overflow-y:visible !important; max-height:none !important; height:auto !important; }
    #estimateDbReportBody .quote-report-table-block { overflow-x:auto !important; overflow-y:visible !important; max-height:none !important; }
    #estimateDbReportBody .quote-report-table { width:max-content; min-width:100%; }
  `;
  document.head.appendChild(style);
}
function escapeEstimateDbExcelCell(value) { return escapeEstimateDbHtml(value); }
function estimateDbXmlCell(value, styleId = "Cell", mergeAcross = 0, mergeDown = 0) {
  const attrs = [`ss:StyleID="${styleId}"`];
  if (mergeAcross) attrs.push(`ss:MergeAcross="${mergeAcross}"`);
  if (mergeDown) attrs.push(`ss:MergeDown="${mergeDown}"`);
  const raw = value ?? "";
  const num = typeof raw === "number" ? raw : (String(raw).trim() !== "" && !String(raw).includes("%") && !String(raw).match(/[가-힣A-Za-z/:]/) && !Number.isNaN(Number(String(raw).replace(/,/g, ""))) ? Number(String(raw).replace(/,/g, "")) : null);
  if (num !== null && Number.isFinite(num)) return `<Cell ${attrs.join(" ")}><Data ss:Type="Number">${num}</Data></Cell>`;
  return `<Cell ${attrs.join(" ")}><Data ss:Type="String">${escapeEstimateDbXml(raw)}</Data></Cell>`;
}
function worksheetXml(name, rows, options = {}) {
  const widths = options.widths || [];
  const columns = widths.map(w => `<Column ss:Width="${w}"/>`).join("");
  const body = rows.map((row, rowIndex) => `<Row>${row.map(cell => estimateDbXmlCell(cell, rowIndex === 0 ? "Header" : "Cell")).join("")}</Row>`).join("");
  return `<Worksheet ss:Name="${escapeEstimateDbXml(name)}"><Table>${columns}${body}</Table></Worksheet>`;
}
function escapeEstimateDbXml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function getEstimateDbExportRows(tab) {
  const sheet = estimateDbSheets[tab];
  return [...(sheet.headerRows || []), ...(sheet.rows || [])];
}
function summarizeEstimateDbRows(rows, label, bgStyle = "Body") {
  const colCount = rows[0]?.length || 0;
  if (!colCount) return [];
  const out = Array(colCount).fill("");
  out[0] = label;
  for (let c = 1; c < colCount; c += 1) {
    const total = rows.reduce((sum, row) => {
      const value = String(row[c] ?? "").replace(/,/g, "");
      return /^-?\d+(\.\d+)?$/.test(value) ? sum + Number(value) : sum;
    }, 0);
    out[c] = total || "-";
  }
  return out;
}
function buildStyledSummaryData(year = getSelectedEstimateDbYear()) {
  const monthly = buildSummaryRows(year);
  const rowsByMonth = new Map(monthly.map(row => [parseEstimateDbMonth(row[0]), row]));
  const blank = Array(20).fill("");
  const getMonth = month => rowsByMonth.get(month) || [`${month}월`, 100000000, "-", "-", "-", "0%", "0%", 100000000, "-", "-", "-", "0%", "0%", 100000000, "-", "-", "-", "0%", "0%", ""];
  const sumMonths = (label, months) => {
    const base = Array(20).fill("");
    base[0] = label;
    [1,2,3,4,7,8,9,10,13,14,15,16].forEach(col => {
      base[col] = months.reduce((sum, month) => sum + toEstimateDbNumber(getMonth(month)[col]), 0);
    });
    base[5] = pct(base[4], base[1]);
    base[6] = pct(base[2], base[1]);
    base[11] = pct(base[10], base[7]);
    base[12] = pct(base[8], base[7]);
    base[17] = pct(base[16], base[13]);
    base[18] = pct(base[14], base[13]);
    base[19] = "";
    return base;
  };
  const quarter1 = sumMonths("1기예정", [1,2,3]);
  const quarter1Fix = sumMonths("1기확정", [4,5,6]);
  const half1 = sumMonths("1기(1~6월)", [1,2,3,4,5,6]);
  const quarter2 = sumMonths("2기예정", [7,8,9]);
  const quarter2Fix = sumMonths("2기확정", [10,11,12]);
  const half2 = sumMonths("2기(7~12월)", [7,8,9,10,11,12]);
  const total = sumMonths(`${year}년`, [1,2,3,4,5,6,7,8,9,10,11,12]);
  return [
    getMonth(1), getMonth(2), getMonth(3), quarter1,
    getMonth(4), getMonth(5), getMonth(6), quarter1Fix, half1,
    getMonth(7), getMonth(8), getMonth(9), quarter2,
    getMonth(10), getMonth(11), getMonth(12), quarter2Fix, half2,
    total
  ];
}
function summaryStyleForLabel(label) {
  if (String(label).includes("년")) return "Total";
  if (String(label).includes("1기(") || String(label).includes("2기(")) return "Half";
  if (String(label).includes("예정") || String(label).includes("확정")) return "Quarter";
  return "Body";
}
function worksheetXmlStyledSummary(year = getSelectedEstimateDbYear()) {
  const sub = ["①수주목표", "②수주달성", "③기전/외주", "②-③차액", "비율1", "비율2"];
  const rows = buildStyledSummaryData(year);
  const cols = [68, 96, 96, 96, 96, 78, 78, 96, 96, 96, 96, 78, 78, 96, 96, 96, 96, 78, 78, 150].map(w => `<Column ss:Width="${w}"/>`).join("");
  let xml = `<Worksheet ss:Name="0.수주매출입금"><Table>${cols}`;
  xml += `<Row ss:Height="26"><Cell ss:StyleID="Title" ss:MergeAcross="19"><Data ss:Type="String">${escapeEstimateDbXml(year)}년 수주.매출.입금</Data></Cell></Row>`;
  xml += `<Row ss:Height="12">${Array.from({length:20}, () => estimateDbXmlCell("", "Blank")).join("")}</Row>`;
  xml += `<Row ss:Height="24">${estimateDbXmlCell("구분", "Group", 0, 1)}${estimateDbXmlCell("수주", "Group", 5)}${estimateDbXmlCell("매출", "Group", 5)}${estimateDbXmlCell("입금", "Group", 5)}${estimateDbXmlCell("비고", "Group", 0, 1)}</Row>`;
  xml += `<Row ss:Height="22"><Cell ss:Index="2" ss:StyleID="Header"><Data ss:Type="String">${escapeEstimateDbXml(sub[0])}</Data></Cell>${[...sub.slice(1), ...sub, ...sub].map(v => estimateDbXmlCell(v, "Header")).join("")}</Row>`;
  rows.forEach(row => {
    const style = summaryStyleForLabel(row[0]);
    xml += `<Row ss:Height="21">${row.map((cell, idx) => {
      const cellStyle = idx === 0 ? `${style}Label` : style;
      return estimateDbXmlCell(cell, cellStyle);
    }).join("")}</Row>`;
  });
  xml += `</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/><SplitHorizontal>4</SplitHorizontal><TopRowBottomPane>4</TopRowBottomPane><ActivePane>2</ActivePane></WorksheetOptions></Worksheet>`;
  return xml;
}
function worksheetXmlStyledReport(sheet) {
  const rows = sheet.rows || [];
  const maxCols = Math.max(...rows.map(row => row.length), 1);
  const cols = Array.from({length: maxCols}, (_, c) => {
    const maxLen = Math.max(8, ...rows.map(r => estimateDbDisplayLength(r[c] || "")));
    return `<Column ss:Width="${Math.max(80, Math.min(240, Math.ceil(maxLen * 9 + 34)))}"/>`;
  }).join("");
  const body = rows.map((row, rowIndex) => {
    const isTitle = rowIndex === 0;
    const isHeader = rowIndex === 1 || rowIndex === 5 || (rows[rowIndex - 1] && rows[rowIndex - 1].length === 0);
    const style = isTitle ? "ReportTitle" : isHeader ? "Header" : "Cell";
    return `<Row>${row.map((cell, idx) => estimateDbXmlCell(cell, style, isTitle && idx === 0 ? Math.max(0, maxCols - 1) : 0)).join("")}</Row>`;
  }).join("");
  return `<Worksheet ss:Name="${escapeEstimateDbXml(sheet.name)}"><Table>${cols}${body}</Table></Worksheet>`;
}
function getEstimateDbReportExportSheets(year = getSelectedEstimateDbYear()) {
  const order = buildOrderRows(year);
  const sales = buildSalesRows(year);
  const deposit = buildDepositRows(year);
  return [
    { name: "0.수주매출입금", type: "summary", year },
    { name: "1.수주 프로젝트", type: "report", rows: [[order.title], order.header, ...order.monthly, [], order.detailHeader, ...order.detail] },
    { name: "2.매출 프로젝트", type: "report", rows: [[sales.title], sales.header, ...sales.monthly, [], sales.detailHeader, ...sales.detail] },
    { name: "3.입금 프로젝트", type: "report", rows: [[deposit.title], deposit.detailHeader, ...deposit.detail] }
  ];
}
function getEstimateDbWorkbookStylesXml() {
  const border = `<Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders>`;
  return `<Styles>
    <Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="10"/></Style>
    <Style ss:ID="Blank"><Font ss:FontName="맑은 고딕" ss:Size="10"/></Style>
    <Style ss:ID="Title"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="18" ss:Bold="1"/></Style>
    <Style ss:ID="ReportTitle"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="15" ss:Bold="1"/></Style>
    <Style ss:ID="Group"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="10" ss:Bold="1"/><Interior ss:Color="#E6E6E6" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="Header"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#E6E6E6" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="Cell"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="9"/>${border}</Style>
    <Style ss:ID="Body"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="9"/>${border}</Style>
    <Style ss:ID="BodyLabel"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="9"/>${border}</Style>
    <Style ss:ID="Quarter"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#E7E6E6" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="QuarterLabel"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#E7E6E6" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="Half"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#BDD7EE" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="HalfLabel"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#BDD7EE" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="Total"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="9" ss:Bold="1" ss:Color="#FF0000"/><Interior ss:Color="#FCE4D6" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="TotalLabel"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#FCE4D6" ss:Pattern="Solid"/>${border}</Style>
  </Styles>`;
}
function worksheetXmlBySpec(sheet) {
  if (sheet.type === "summary") return worksheetXmlStyledSummary(sheet.year || getSelectedEstimateDbYear());
  if (sheet.type === "report") return worksheetXmlStyledReport(sheet);
  return worksheetXml(sheet.name, sheet.rows || []);
}
function downloadEstimateDbWorkbook(fileName, sheets) {
  const safeName = String(fileName || "CONCOST_export.xls").replace(/\.xlsx$/i, ".xls").replace(/\.xml$/i, ".xls");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>CON-COST Groupware</Author><LastAuthor>CON-COST Groupware</LastAuthor><Created>${new Date().toISOString()}</Created></DocumentProperties><ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"><WindowHeight>12000</WindowHeight><WindowWidth>20000</WindowWidth><ProtectStructure>False</ProtectStructure><ProtectWindows>False</ProtectWindows></ExcelWorkbook>${getEstimateDbWorkbookStylesXml()}${sheets.map(worksheetXmlBySpec).join("")}</Workbook>`;
  const blob = new Blob(["\ufeff", xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = safeName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function exportEstimateDbToExcel() {
  migrateEstimateDbPjColumns();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const sheets = [
    { name: "DB_프로젝트", rows: getEstimateDbExportRows("pj") },
    { name: "DB_기성", rows: getEstimateDbExportRows("progress") },
    { name: "DB기전외주", rows: getEstimateDbExportRows("mep") }
  ];
  downloadEstimateDbWorkbook(`CONCOST_DB_${date}.xls`, sheets);
  showToast("DB 3개 시트를 엑셀 파일로 내보냅니다.");
}
function exportEstimateDbReportsToExcel() {
  const year = getSelectedEstimateDbYear();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const sheets = getEstimateDbReportExportSheets(year);
  downloadEstimateDbWorkbook(`CONCOST_0_3_sheets_${year}_${date}.xls`, sheets);
  showToast(`${year}년 0~3번 시트만 현재 화면 계산값으로 내보냅니다.`);
}
function handleEstimateDbYearChange() { renderEstimateDbReports(); }

/* DB관리/프로젝트 접수 사이드 메뉴 접힘 보정 */

document.addEventListener("click", event => {
  const workBtn = event.target?.closest?.("[data-work-main]");
  if (!workBtn) return;
  requestAnimationFrame(() => {
    const targetPanelId = workBtn.dataset.workMain;
    if (typeof syncWorkSideAccordion === "function") syncWorkSideAccordion(targetPanelId);
    if (typeof activateWorkSideSelection === "function") {
      activateWorkSideSelection(targetPanelId);
      return;
    }
    if (["estimateRequestManage", "estimateSheetManage", "estimatePeriodManage", "estimateDbManage", "estimateQuote", "estimateQuoteList", "projectReceive", "projectReceiveList"].includes(targetPanelId)) {
      const selected = document.querySelector(`.side-item[data-work-main="${targetPanelId}"]`);
      selected?.classList.add("active", "work-side-selected");
      selected?.setAttribute("data-work-selected", "true");
    }
  });
}, true);


(function installEstimateDbColumnReorderOkDelegatedClickInstalled(){
  if (window.estimateDbColumnReorderOkDelegatedClickInstalled) return;
  window.estimateDbColumnReorderOkDelegatedClickInstalled = true;
  document.addEventListener("click", function(event){
    const btn = event.target?.closest?.("#estimateDbColumnReorderOkBtn");
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof confirmEstimateDbColumnReorder === "function") confirmEstimateDbColumnReorder();
  }, true);
})();

/* Final hard fix: DB column reorder confirm button click guard */
(function installEstimateDbReorderConfirmHardFix(){
  if (window.__estimateDbReorderConfirmHardFixInstalled) return;
  window.__estimateDbReorderConfirmHardFixInstalled = true;

  function getConfirmBtn(){
    return document.getElementById("estimateDbColumnReorderOkBtn");
  }

  function isPointInsideBtn(event, btn){
    if (!btn || event.clientX == null || event.clientY == null) return false;
    const rect = btn.getBoundingClientRect();
    return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  }

  function forceConfirm(event){
    if (!window.estimateDbColumnReorderMode && typeof estimateDbColumnReorderMode !== "undefined" && !estimateDbColumnReorderMode) return false;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
    }
    if (typeof confirmEstimateDbColumnReorder === "function") {
      confirmEstimateDbColumnReorder();
      return true;
    }
    return false;
  }

  function handleAnyPointer(event){
    const btn = getConfirmBtn();
    if (!btn) return;
    const direct = event.target?.closest?.("#estimateDbColumnReorderOkBtn");
    const inside = isPointInsideBtn(event, btn);
    if (direct || inside) forceConfirm(event);
  }

  ["pointerdown", "mousedown", "mouseup", "click"].forEach(type => {
    document.addEventListener(type, handleAnyPointer, true);
  });

  const style = document.createElement("style");
  style.textContent = `
    #estimateDbColumnReorderOkBtn {
      position: relative !important;
      z-index: 2147483647 !important;
      pointer-events: auto !important;
      cursor: pointer !important;
    }
    .quote-db-col-dragging,
    .quote-db-col-reorder-mode th {
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(style);
})();


/* =========================================================
   FIX: DB관리 열 위치 변경 확인 버튼 종료 보정
   - 열 위치 변경 중 상태는 그대로 유지 버튼 역할만 수행
   - 실제 종료/저장은 확인 버튼에서만 처리
   - 다른 요소가 버튼 위를 덮어도 좌표 기준으로 확인 버튼 클릭을 감지
========================================================= */
(function installEstimateDbColumnReorderConfirmFinalPatch(){
  if (window.__estimateDbColumnReorderConfirmFinalPatchInstalled) return;
  window.__estimateDbColumnReorderConfirmFinalPatchInstalled = true;

  function isReorderModeOn(){
    try { return typeof estimateDbColumnReorderMode !== "undefined" && !!estimateDbColumnReorderMode; }
    catch (error) { return false; }
  }

  function getVisibleConfirmButtons(){
    return Array.from(document.querySelectorAll("#estimateDbColumnReorderOkBtn, button"))
      .filter(btn => {
        const text = (btn.textContent || "").trim();
        if (btn.id !== "estimateDbColumnReorderOkBtn" && text !== "확인") return false;
        const rect = btn.getBoundingClientRect();
        const style = window.getComputedStyle(btn);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      });
  }

  function isInsideButton(event, btn){
    if (!event || event.clientX == null || event.clientY == null || !btn) return false;
    const rect = btn.getBoundingClientRect();
    return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  }

  function findConfirmButtonFromEvent(event){
    const direct = event?.target?.closest?.("#estimateDbColumnReorderOkBtn");
    if (direct) return direct;
    return getVisibleConfirmButtons().find(btn => isInsideButton(event, btn));
  }

  window.forceEstimateDbColumnReorderConfirm = function(event){
    if (!isReorderModeOn()) return false;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
    }

    estimateDbColumnReorderMode = false;
    estimateDbColumnReorderSource = null;
    estimateDbColumnReorderPointerState = null;
    document.removeEventListener("mouseup", finishEstimateDbColumnReorderPointer, true);

    if (typeof saveEstimateDbToStorage === "function") saveEstimateDbToStorage();
    if (typeof updateEstimateDbSaveButtonState === "function") updateEstimateDbSaveButtonState();
    if (typeof showToast === "function") showToast("열 위치 변경을 저장했습니다.");
    if (typeof renderEstimateDbManage === "function") renderEstimateDbManage();
    return true;
  };

  const originalConfirm = typeof confirmEstimateDbColumnReorder === "function" ? confirmEstimateDbColumnReorder : null;
  confirmEstimateDbColumnReorder = function(){
    if (isReorderModeOn()) return window.forceEstimateDbColumnReorderConfirm();
    if (originalConfirm) return originalConfirm();
    return false;
  };

  function handleConfirmPointer(event){
    if (!isReorderModeOn()) return;
    const btn = findConfirmButtonFromEvent(event);
    if (!btn) return;
    window.forceEstimateDbColumnReorderConfirm(event);
  }

  ["pointerdown", "mousedown", "mouseup", "click"].forEach(type => {
    document.addEventListener(type, handleConfirmPointer, true);
  });

  const originalToggle = typeof toggleEstimateDbColumnReorderMode === "function" ? toggleEstimateDbColumnReorderMode : null;
  toggleEstimateDbColumnReorderMode = function(){
    if (isReorderModeOn()) {
      if (typeof showToast === "function") showToast("열 위치 변경 모드입니다. 종료하려면 확인 버튼을 누르세요.");
      return false;
    }
    return originalToggle ? originalToggle.apply(this, arguments) : false;
  };

  function bindCurrentConfirmButton(){
    const btn = document.getElementById("estimateDbColumnReorderOkBtn");
    if (!btn) return;
    btn.type = "button";
    btn.style.setProperty("pointer-events", "auto", "important");
    btn.style.setProperty("position", "relative", "important");
    btn.style.setProperty("z-index", "2147483647", "important");
    btn.onpointerdown = window.forceEstimateDbColumnReorderConfirm;
    btn.onmousedown = window.forceEstimateDbColumnReorderConfirm;
    btn.onclick = window.forceEstimateDbColumnReorderConfirm;
  }

  const originalRender = typeof renderEstimateDbManage === "function" ? renderEstimateDbManage : null;
  if (originalRender) {
    renderEstimateDbManage = function(){
      const result = originalRender.apply(this, arguments);
      bindCurrentConfirmButton();
      return result;
    };
  }

  document.addEventListener("DOMContentLoaded", bindCurrentConfirmButton);
  setTimeout(bindCurrentConfirmButton, 0);
})();


/* === 견적서 종류별 관리 v1: 업로드 엑셀 양식 4종 웹 작성 화면 === */

/* =========================================================
   2026-05-29 PM배정 → 기성관리 총괄PM 연계 보정
   - 총괄PM 우선순위: 마감팀 PM → 구조팀 PM → BIM파트 PM → 토목·조경 PM
   - PJ관리 PM 변경 시 기성관리 총괄PM 즉시 반영
   ========================================================= */
(function installEstimateDbTotalPmSyncPatch(){
  function text(value){
    return String(value ?? '').replace(/\s+/g, ' ').trim();
  }
  function headerIndex(tab, header){
    return typeof getEstimateDbColumnIndexByHeader === 'function' ? getEstimateDbColumnIndexByHeader(tab, header) : -1;
  }
  function rowValue(tab, row, header){
    const idx = headerIndex(tab, header);
    return idx >= 0 && row ? row[idx] : '';
  }
  function setRowValue(tab, row, header, value){
    const idx = headerIndex(tab, header);
    if (idx < 0 || !row) return false;
    const next = value ?? '';
    if (text(row[idx]) === text(next)) return false;
    row[idx] = next;
    return true;
  }
  function selectTotalPm(assignment = {}, pjRow = null){
    const finish = text(assignment.pmFinish ?? rowValue('pj', pjRow, 'PM(마감)'));
    const structure = text(assignment.pmStructure ?? rowValue('pj', pjRow, 'PM(구조)'));
    const bim = text(assignment.pmBim ?? rowValue('pj', pjRow, 'PM(BIM)'));
    const civil = text(assignment.pmCivil ?? rowValue('pj', pjRow, 'PM(토목,조경)'));
    return finish || structure || bim || civil || '';
  }
  function progressKeyFromPjRow(pjRow){
    if (!pjRow) return '';
    if (typeof makeEstimateDbSyncKey === 'function') {
      return makeEstimateDbSyncKey({
        year: rowValue('pj', pjRow, '최초생성날짜') || rowValue('pj', pjRow, '년도'),
        receiptNo: rowValue('pj', pjRow, '접수번호'),
        pjNo: rowValue('pj', pjRow, 'PJ NO'),
        pjName: rowValue('pj', pjRow, '프로젝트명') || rowValue('pj', pjRow, 'PJ명')
      });
    }
    return [rowValue('pj', pjRow, 'PJ NO'), rowValue('pj', pjRow, '프로젝트명')].map(text).filter(Boolean).join('::');
  }
  function findProgressRow(pjRowIndex){
    const pjSheet = estimateDbSheets?.pj;
    const progressSheet = estimateDbSheets?.progress;
    const pjRow = pjSheet?.rows?.[pjRowIndex];
    if (!pjRow || !progressSheet) return null;
    let target = (progressSheet.rows || []).find(row => row && row.__sourcePjRowIndex === pjRowIndex);
    if (target) return target;
    const key = progressKeyFromPjRow(pjRow);
    if (key && typeof estimateDbTargetRowKey === 'function') {
      target = (progressSheet.rows || []).find(row => estimateDbTargetRowKey('progress', row) === key);
      if (target) return target;
    }
    if (typeof syncEstimateDbLinkedRowsFromPj === 'function') {
      syncEstimateDbLinkedRowsFromPj(pjRowIndex);
      target = (progressSheet.rows || []).find(row => row && row.__sourcePjRowIndex === pjRowIndex);
      if (target) return target;
      if (key && typeof estimateDbTargetRowKey === 'function') {
        target = (progressSheet.rows || []).find(row => estimateDbTargetRowKey('progress', row) === key);
      }
    }
    return target || null;
  }
  function syncOne(pjRowIndex, assignment = {}){
    const pjRow = estimateDbSheets?.pj?.rows?.[pjRowIndex];
    const progressRow = findProgressRow(pjRowIndex);
    if (!pjRow || !progressRow) return false;
    const totalPm = selectTotalPm(assignment, pjRow);
    const changed = setRowValue('progress', progressRow, '총괄PM', totalPm);
    if (changed && typeof recalcEstimateDbRow === 'function') recalcEstimateDbRow('progress', progressRow);
    return changed;
  }
  window.estimateDbSelectTotalPm = selectTotalPm;
  window.estimateDbSyncProgressTotalPmFromPjRow = syncOne;
  window.estimateDbSyncProgressTotalPmByKey = function estimateDbSyncProgressTotalPmByKey(projectKey, assignment = {}){
    if (!estimateDbSheets?.pj?.rows) return false;
    const keyText = text(projectKey);
    const idxs = ['PJ NO','receiveId','연계ID','DB연계ID'].map(h => headerIndex('pj', h)).filter(i => i >= 0);
    let rowIndex = -1;
    if (keyText && idxs.length) {
      rowIndex = estimateDbSheets.pj.rows.findIndex(row => idxs.some(i => text(row?.[i]) === keyText));
    }
    if (rowIndex < 0 && typeof projectReceiveFindDbPjRowIndex === 'function') rowIndex = projectReceiveFindDbPjRowIndex(projectKey);
    if (rowIndex < 0) return false;
    return syncOne(rowIndex, assignment);
  };
  const prevSyncEstimateDbLinkedRowsFromPj = typeof syncEstimateDbLinkedRowsFromPj === 'function' ? syncEstimateDbLinkedRowsFromPj : null;
  if (prevSyncEstimateDbLinkedRowsFromPj && !prevSyncEstimateDbLinkedRowsFromPj.__totalPmPatched) {
    syncEstimateDbLinkedRowsFromPj = function syncEstimateDbLinkedRowsFromPjTotalPmPatched(pjRowIndex){
      const result = prevSyncEstimateDbLinkedRowsFromPj(pjRowIndex);
      syncOne(pjRowIndex);
      return result;
    };
    syncEstimateDbLinkedRowsFromPj.__totalPmPatched = true;
    window.syncEstimateDbLinkedRowsFromPj = syncEstimateDbLinkedRowsFromPj;
  }
})();
