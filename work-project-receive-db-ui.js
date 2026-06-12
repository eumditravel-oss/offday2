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
  const hasFirstPlan = cols.some(v => normalizeEstimateDbText(v) === "1ì°¨ë©íìì ì¼");
  if (!hasFirstPlan) {
    const firstActualIndex = cols.findIndex(v => normalizeEstimateDbText(v) === "1ì°¨ë©íì¼ì");
    if (firstActualIndex >= 0) insertEstimateDbColumn(sheet, firstActualIndex, "1ì°¨ë©íìì ì¼", "", "1ì°¨ ë©í ìì ì¼ ìë ¥ë");
  }
  const colsAfterFirst = getEstimateDbLeafColumns(sheet);
  const hasSecondPlan = colsAfterFirst.some(v => normalizeEstimateDbText(v) === "2ì°¨ë©íìì ì¼");
  if (!hasSecondPlan) {
    const secondActualIndex = colsAfterFirst.findIndex(v => normalizeEstimateDbText(v) === "2ì°¨ë©íì¼ì");
    if (secondActualIndex >= 0) insertEstimateDbColumn(sheet, secondActualIndex, "2ì°¨ë©íìì ì¼", "", "2ì°¨ ë©í ìì ì¼ ìë ¥ë");
  }
}


function ensureEstimateDbProgressActualDeliveryColumnsOnce() {
  const sheet = estimateDbSheets?.progress;
  if (!sheet?.headerRows?.length) return;
  const topRow = sheet.headerRows[0] || [];
  const leafCols = getEstimateDbLeafColumns(sheet);
  const desiredLeaves = ["1ì°¨ë©í", "2ì°¨ë©í", "3ì°¨ë©í"];
  const requestText = "ì¤ì  ë©íì¼ ìë ¥ë: 260601 ìë ¥ ì 26ë6ì1ì¼ íìì¼ë¡ ì ì¥";

  const groupAt = (index) => {
    let current = "";
    for (let i = 0; i <= index; i += 1) {
      const text = normalizeEstimateDbText(topRow[i]);
      if (text) current = text;
    }
    return current;
  };
  const hasActualLeaf = (leaf) => leafCols.some((col, index) => normalizeEstimateDbText(col) === leaf && normalizeEstimateDbText(groupAt(index)).includes("ì¤ì ë©íì¼"));
  if (desiredLeaves.every(hasActualLeaf)) return;

  let targetIndex = -1;
  for (let i = 0; i < leafCols.length; i += 1) {
    if (normalizeEstimateDbText(groupAt(i)).includes("ë©íìì ì¼") && normalizeEstimateDbText(leafCols[i]) === "3ì°¨ë©í") {
      targetIndex = i + 1;
      break;
    }
  }
  if (targetIndex < 0) {
    targetIndex = leafCols.findIndex(col => normalizeEstimateDbText(col).includes("ì¸ê¸ê³ì°ì"));
    if (targetIndex < 0) targetIndex = leafCols.length;
  }

  const toInsert = desiredLeaves.filter(leaf => !hasActualLeaf(leaf));
  toInsert.forEach((leaf, offset) => {
    const insertAt = targetIndex + offset;
    (sheet.headerRows || []).forEach((row, headerRowIndex) => {
      if (!Array.isArray(row)) return;
      row.splice(insertAt, 0, headerRowIndex === 0 ? (offset === 0 ? "ì¤ì ë©íì¼" : "") : leaf);
    });
    if (Array.isArray(sheet.requestRow)) sheet.requestRow.splice(insertAt, 0, requestText);
    (sheet.rows || []).forEach(row => {
      if (Array.isArray(row)) row.splice(insertAt, 0, "");
    });
  });
}

function ensureEstimateDbProgressAccountInfoColumnOnce() {
  const sheet = estimateDbSheets?.progress;
  if (!sheet?.headerRows?.length) return;
  const cols = getEstimateDbLeafColumns(sheet);
  const currentIndex = cols.findIndex(v => normalizeEstimateDbText(v) === "ê³ì¢ì ë³´");
  const conditionIndex = cols.findIndex(v => normalizeEstimateDbText(v) === "ê¸°ì±ì¡°ê±´");
  const estimateDateIndex = cols.findIndex(v => normalizeEstimateDbText(v) === "ê²¬ì ìì¼ì");
  const targetIndex = conditionIndex >= 0 ? conditionIndex + 1 : (estimateDateIndex >= 0 ? estimateDateIndex : cols.length);

  if (currentIndex >= 0) {
    if (currentIndex !== targetIndex) {
      (sheet.headerRows || []).forEach(row => {
        const [cell] = row.splice(currentIndex, 1);
        row.splice(targetIndex, 0, cell || "ê³ì¢ì ë³´");
      });
      if (Array.isArray(sheet.requestRow)) {
        const [cell] = sheet.requestRow.splice(currentIndex, 1);
        sheet.requestRow.splice(targetIndex, 0, cell || "Enter í¤ë¡ ê³ì¢ì ë³´ ìë ¥ì°½ì ì´ì´ ìíëª/ê³ì¢ë²í¸ë¥¼ ì¬ë¬ ê° ê´ë¦¬");
      }
      (sheet.rows || []).forEach(row => {
        const [cell] = row.splice(currentIndex, 1);
        row.splice(targetIndex, 0, cell || "");
      });
    }
    (sheet.headerRows || []).forEach((row, headerRowIndex) => {
      if (Array.isArray(row)) row[targetIndex] = headerRowIndex === 0 ? "ê³ì¢ì ë³´" : "";
    });
    if (Array.isArray(sheet.requestRow)) sheet.requestRow[targetIndex] = "Enter í¤ë¡ ê³ì¢ì ë³´ ìë ¥ì°½ì ì´ì´ ìíëª/ê³ì¢ë²í¸ë¥¼ ì¬ë¬ ê° ê´ë¦¬";
    return;
  }

  insertEstimateDbColumn(sheet, targetIndex, "ê³ì¢ì ë³´", "", "Enter í¤ë¡ ê³ì¢ì ë³´ ìë ¥ì°½ì ì´ì´ ìíëª/ê³ì¢ë²í¸ë¥¼ ì¬ë¬ ê° ê´ë¦¬");
}

function ensureEstimateDbProgressBillingEmailColumnOnce() {
  const sheet = estimateDbSheets?.progress;
  if (!sheet?.headerRows?.length) return;
  const cols = getEstimateDbLeafColumns(sheet);
  const existingIndex = cols.findIndex(v => normalizeEstimateDbText(v) === "ë°íë©ì¼ì£¼ì");
  const clientIndex = cols.findIndex(v => normalizeEstimateDbText(v) === "ê±°ëì²ê¸°ì±ë´ë¹ì");
  const managerIndex = cols.findIndex(v => normalizeEstimateDbText(v) === "ê¸°ì±ë´ë¹ì");
  const targetIndex = clientIndex >= 0 ? clientIndex + 1 : (managerIndex >= 0 ? managerIndex : cols.length);
  const requestText = "ì¸ê¸ê³ì°ì/ê¸°ì± ê´ë ¨ ë°í ë©ì¼ì£¼ì ìë ¥ë";
  if (existingIndex >= 0) {
    let finalIndex = existingIndex;
    if (existingIndex !== targetIndex) {
      const toIndex = targetIndex > existingIndex ? targetIndex - 1 : targetIndex;
      (sheet.headerRows || []).forEach((row, headerRowIndex) => {
        if (!Array.isArray(row)) return;
        const [cell] = row.splice(existingIndex, 1);
        row.splice(toIndex, 0, headerRowIndex === 0 ? "ë°íë©ì¼ì£¼ì" : (cell || ""));
      });
      if (Array.isArray(sheet.requestRow)) {
        const [cell] = sheet.requestRow.splice(existingIndex, 1);
        sheet.requestRow.splice(toIndex, 0, cell || requestText);
      }
      (sheet.rows || []).forEach(row => {
        if (!Array.isArray(row)) return;
        const [cell] = row.splice(existingIndex, 1);
        row.splice(toIndex, 0, cell || "");
      });
      finalIndex = toIndex;
    }
    (sheet.headerRows || []).forEach((row, headerRowIndex) => {
      if (Array.isArray(row)) row[finalIndex] = headerRowIndex === 0 ? "ë°íë©ì¼ì£¼ì" : "";
    });
    if (Array.isArray(sheet.requestRow)) sheet.requestRow[finalIndex] = requestText;
    return;
  }
  insertEstimateDbColumn(sheet, targetIndex, "ë°íë©ì¼ì£¼ì", "", requestText);
}

function migrateEstimateDbCreatedDateHeaders() {
  ["pj", "progress", "mep"].forEach(tab => {
    const sheet = estimateDbSheets?.[tab];
    if (!sheet?.headerRows?.length) return;
    (sheet.headerRows || []).forEach(headerRow => {
      if (!Array.isArray(headerRow)) return;
      headerRow.forEach((value, index) => {
        if (normalizeEstimateDbText(value) === "ëë") headerRow[index] = "ìµì´ìì±ë ì§";
      });
    });
    const cols = getEstimateDbLeafColumns(sheet);
    const createdIndex = cols.findIndex(col => normalizeEstimateDbText(col) === "ìµì´ìì±ë ì§");
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
  const raw = normalizeEstimateDbText(value).replace(/,/g, "").replace(/ì/g, "");
  const num = Number(raw);
  return Number.isFinite(num) ? num : 0;
}
function parseEstimateDbYear(value) {
  const m = normalizeEstimateDbText(value).match(/(20\d{2})/);
  return m ? m[1] : String(new Date().getFullYear());
}
function parseEstimateDbMonth(value) {
  const raw = normalizeEstimateDbText(value);
  const direct = raw.match(/(?:^|[^0-9])(1[0-2]|0?[1-9])\s*ì/);
  if (direct) return Number(direct[1]);
  const compact = raw.match(/^(?:\d{2})?(0[1-9]|1[0-2])\d{2}$/);
  if (compact) return Number(compact[1]);
  const date = raw.match(/20\d{2}[.\/-](0?[1-9]|1[0-2])/);
  if (date) return Number(date[1]);
  return null;
}

const ESTIMATE_DB_CREATED_DATE_HEADER = "ìµì´ìì±ë ì§";

function formatEstimateDbKoreanDate(date = new Date()) {
  const pad = value => String(value).padStart(2, "0");
  return `${date.getFullYear()}ë ${pad(date.getMonth() + 1)}ì ${pad(date.getDate())}ì¼`;
}

function normalizeEstimateDbCreatedDate(value, fallbackDate = null) {
  const raw = normalizeEstimateDbText(value);
  if (/^20\d{2}ë\s*\d{1,2}ì\s*\d{1,2}ì¼$/.test(raw)) return raw.replace(/(\d{4})ë\s*(\d{1,2})ì\s*(\d{1,2})ì¼/, (_m, y, mo, d) => `${y}ë ${String(mo).padStart(2, "0")}ì ${String(d).padStart(2, "0")}ì¼`);
  const ymd = raw.match(/^(20\d{2})[.\/-](\d{1,2})[.\/-](\d{1,2})$/);
  if (ymd) return `${ymd[1]}ë ${String(ymd[2]).padStart(2, "0")}ì ${String(ymd[3]).padStart(2, "0")}ì¼`;
  const digits = raw.replace(/[^0-9]/g, "");
  const compact = digits.match(/^(20\d{2})(\d{2})(\d{2})$/);
  if (compact) return `${compact[1]}ë ${compact[2]}ì ${compact[3]}ì¼`;
  const shortCompact = digits.match(/^(\d{2})(\d{2})(\d{2})$/);
  if (shortCompact) {
    const year = 2000 + Number(shortCompact[1]);
    const month = Number(shortCompact[2]);
    const day = Number(shortCompact[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}ë ${String(month).padStart(2, "0")}ì ${String(day).padStart(2, "0")}ì¼`;
    }
  }
  const yearOnly = raw.match(/(20\d{2})/);
  if (yearOnly) return `${yearOnly[1]}ë 00ì 00ì¼`;
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
  const createdIndex = findEstimateDbColumnIndexByAnyName(header, [ESTIMATE_DB_CREATED_DATE_HEADER, "ëë"]);
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
  const legacyYearIndex = header.findIndex(col => normalizeEstimateDbText(col) === "ëë");
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
  ensureEstimateDbProgressActualDeliveryColumnsOnce?.();
  ensureEstimateDbProgressAccountInfoColumnOnce?.();
  ensureEstimateDbProgressBillingEmailColumnOnce?.();
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


/* === 2026-05-28 DBê´ë¦¬ ë ëë§ ê²½ëí/ì»¬ë¼ ì í©ì± ë³´ê° === */
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
  select.innerHTML = years.map(y => `<option value="${escapeEstimateDbHtml(y)}">${escapeEstimateDbHtml(y)}ë</option>`).join("");
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
  if (rich?.type === "progressDone") return rich.history || "ê¸°ì±ì²­êµ¬ìë£";
  if (rich?.type === "stageFormula") {
    const displayAmount = rich.amount ? formatEstimateDbCommaNumber(rich.amount) : "";
    return displayAmount || "0";
  }
  if (rich?.type === "progressStory") return rich.summary || "ê¸°ì±ì¤í ë¦¬";
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
    if (headerName === "ê³ì½ê¸ì¡(VATí¬í¨)" || topHeaderName === "ê³ì½ê¸ì¡(VATí¬í¨)") return 170;
    if (headerName === "ê³ì½ê¸ì¡" || topHeaderName === "ê³ì½ê¸ì¡") return 140;
    if (/^A-\d+$/.test(headerName)) return 150;
  }
  if (tab === "pj") {
    // PJê´ë¦¬ ê³ ì  ê°ëì± í­: ê¸°ì¡´ localStorage ì´ ëë¹ ì¡°ì ê°ë³´ë¤ ì°ì  ì ì©í©ëë¤.
    // - êµ­ë´/í´ì¸ë ì ë° ìì¤ì¼ë¡ ì¶ì
    // - ê±°ëì²ëªì íì¬ ê¸°ì¤ 1.3ë°° ìì¤ì¼ë¡ íëíê³  2ì¤ íì ê°ë¥íê² íë³´
    // - íë¡ì í¸ëªì ê¸°ì¡´ ê°ì  íì¥ í­(1040px)ì 1/2 ìì¤ì¼ë¡ ì¶ì
    if (headerName === "êµ­ë´/í´ì¸") return 58;
    if (headerName === "ê±°ëì²ëª") return 304;
    if (headerName === "íë¡ì í¸ëª") return 520;
    if (headerName === "ê±´ë¬¼ì©ë") return 90;
    // íë¡ì í¸ ì°ê²°ì Enter ëªë ¹ ìì´ë¯ë¡ ìµì í­ë§ íë³´í©ëë¤.
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
  const input = prompt("DBê´ë¦¬ í ì¸ë¡ê¸¸ì´ë¥¼ px ë¨ìë¡ ìë ¥íì¸ì.\nì: 44, 52, 60", String(current));
  if (input == null) return;
  const next = Math.round(Number(String(input).replace(/[^0-9.]/g, "")));
  if (!Number.isFinite(next) || next < 28 || next > 120) {
    if (typeof showToast === "function") showToast("í ì¸ë¡ê¸¸ì´ë 28~120px ì¬ì´ë¡ ìë ¥í´ ì£¼ì¸ì.");
    return;
  }
  estimateDbRowHeightPx = next;
  localStorage.setItem("estimateDbRowHeightPx", String(next));
  renderEstimateDbManage();
  if (typeof showToast === "function") showToast(`DBê´ë¦¬ í ì¸ë¡ê¸¸ì´ë¥¼ ${next}pxë¡ ë³ê²½íìµëë¤.`);
}
function toggleEstimateDbColumnResizeMode() {
  estimateDbColumnResizeMode = !estimateDbColumnResizeMode;
  renderEstimateDbManage();
  if (typeof showToast === "function") showToast(estimateDbColumnResizeMode ? "ì´ ëë¹ ì¡°ì  ëª¨ëë¥¼ ì¼°ìµëë¤. í¤ë ì¤ë¥¸ìª½ ì ì ëëê·¸íì¸ì." : "ì´ ëë¹ ì¡°ì  ëª¨ëë¥¼ ê»ìµëë¤.");
}
function renderEstimateDbColumnResizeHandle(colIndex) {
  return estimateDbColumnResizeMode ? `<span class="quote-db-col-resize-handle" title="ëëê·¸í´ì ì´ ëë¹ ì¡°ì " onmousedown="startEstimateDbColumnResize(event, ${colIndex})"></span>` : "";
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
  return firstText === "í©ê³" || (firstFourBlank && hasNumericAfter);
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
  if (parsed.type === "accountInfo") {
    if (parsed.summary) return parsed.summary;
    const accounts = Array.isArray(parsed.accounts) ? parsed.accounts : [];
    return accounts.map(item => [item.bank, item.account].filter(Boolean).join(" ")).filter(Boolean).join(" / ");
  }
  if (parsed.type === "progressBillingClientContact") {
    if (parsed.summary) return parsed.summary;
    const contacts = Array.isArray(parsed.contacts) ? parsed.contacts : [];
    return contacts.map(item => [item.name, item.position, item.mobile].filter(Boolean).join(" / ")).filter(Boolean).join(" | ");
  }
  if (parsed.type === "progressBillingManager") {
    if (parsed.summary) return parsed.summary;
    const managers = Array.isArray(parsed.managers) ? parsed.managers : [];
    return managers.map(item => item.label || [item.name, item.position].filter(Boolean).join("")).filter(Boolean).join(", ");
  }
  return value;
}
function getEstimateDbStoryColumnIndex() {
  return getEstimateDbColumnIndexByHeader("progress", "ê¸°ì±ì¤í ë¦¬");
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
  return getEstimateDbColumnIndexByHeader("progress", "ê³ì½ê¸ì¡");
}
function getEstimateDbContractVatColumnIndex() {
  return getEstimateDbColumnIndexByHeader("progress", "ê³ì½ê¸ì¡(VATí¬í¨)");
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
  if (!/^\d+ì°¨ê¸°ì±$/.test(label)) return false;
  const group = getEstimateDbProgressGroupNameByColumn(colIndex);
  return /ì¸ê¸ê³ì°ì|ìê¸ìì ì¼|ìê¸ì¼/.test(group);
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
    if (/ì¸ê¸ê³ì°ì|ìê¸ìì ì¼|ìê¸ì¼/.test(group) && /^[45]ì°¨ê¸°ì±$/.test(sub)) removeIndexes.push(i);
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
  if (!/^[0-9+\-*/().\s]+$/.test(raw)) throw new Error("íì©ëì§ ìë ë¬¸ìê° í¬í¨ëì´ ììµëë¤.");
  const result = Function(`"use strict"; return (${raw});`)();
  if (!Number.isFinite(result)) throw new Error("ê³ì° ê²°ê³¼ê° ì¬ë°ë¥´ì§ ììµëë¤.");
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
      <div class="estimate-db-dropdown-title">ê¸°ì±ì¤í ë¦¬ ìì¸ ìë ¥</div>
      <label class="estimate-db-amount-label">ìì½ë³¸<input id="estimateDbStorySummary" class="estimate-db-dropdown-search" placeholder="í ìì ë³´ì¼ ê°ëµ ë´ì©ì ìë ¥" /></label>
      <label class="estimate-db-amount-label">í ì¤í ë¦¬<textarea id="estimateDbStoryFull" class="estimate-db-dropdown-search" style="min-height:220px;resize:vertical;" placeholder="ìì¸ ë´ì©ì ìë ¥í©ëë¤. ì¤ë°ê¿ì Shift+Enter"></textarea></label>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbStoryModal()">ë«ê¸°</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbStoryModal()">ì ì¥</button>
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
      <div class="estimate-db-dropdown-title">Nì°¨ ê¸°ì± ê³ì° ìë ¥</div>
      <label class="estimate-db-amount-label">ê³ì°ì<input id="estimateDbStageFormulaExpr" class="estimate-db-dropdown-search" placeholder="ì: 100000+200000*0.5" /></label>
      <label class="estimate-db-amount-label">ë¹ê³ <textarea id="estimateDbStageFormulaNote" class="estimate-db-dropdown-search" style="min-height:150px;resize:vertical;" placeholder="ê¸°ì± ìì¸ ì¤í ë¦¬ ëë ë¹ê³ ë¥¼ ìë ¥í©ëë¤."></textarea></label>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbStageFormulaModal()">ë«ê¸°</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbStageFormulaModal()">ê³ì° ë°ì</button>
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
  catch (error) { if (typeof showToast === "function") showToast(error.message || "ê³ì°ìì íì¸í´ì£¼ì¸ì."); return; }
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
      <div class="estimate-db-dropdown-title" id="estimateDbContractAmountTitle">ê³ì½ê¸ì¡ ë¶í  ìë ¥</div>
      <label class="estimate-db-amount-label">ê¸ì¡<input id="estimateDbContractAmountValue" class="estimate-db-dropdown-search" placeholder="ì: 272250000" inputmode="numeric" /></label>
      <label class="estimate-db-amount-label">ë ì§<input id="estimateDbContractAmountDate" class="estimate-db-dropdown-search" placeholder="ì: 260529 ëë 2026-05-29" /></label>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbContractAmountModal()">ë«ê¸°</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbContractAmountModal()">ì ì¥</button>
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
  modal.querySelector("#estimateDbContractAmountTitle").textContent = `${getEstimateDbColumnName(estimateDbActiveTab, colIndex)} ê¸ì¡/ë ì§ ìë ¥`;
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
  const idx = getEstimateDbColumnIndexByHeader("progress", "ê¸°ì±ì²­êµ¬ìë£");
  if (idx >= 0) return;
  sheet.headerRows.forEach((row, rowIndex) => row.push(rowIndex === 0 ? "ê¸°ì±ì²­êµ¬ìë£" : ""));
  if (Array.isArray(sheet.requestRow)) sheet.requestRow.push("ê¸°ì±ì²­êµ¬ê° ìë£ëì´ ë ì´ì íì¸ì´ íì ìë íì ì²´í¬í©ëë¤.");
  (sheet.rows || []).forEach(row => row.push(""));
}

function sanitizeEstimateDbSheetsBeforeRender() {
  ensureEstimateDbProgressBillingEmailColumnOnce?.();
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
  let contractIndex = leaf.findIndex(v => normalizeEstimateDbText(v) === "ê³ì½ê¸ì¡");
  if (contractIndex < 0) contractIndex = top.findIndex(v => normalizeEstimateDbText(v) === "ê³ì½ê¸ì¡");
  if (contractIndex < 0) return;

  const hasVat = leaf.some(v => normalizeEstimateDbText(v) === "ê³ì½ê¸ì¡(VATí¬í¨)") || top.some(v => normalizeEstimateDbText(v) === "ê³ì½ê¸ì¡(VATí¬í¨)");
  if (!hasVat) {
    top.splice(contractIndex, 0, "ê³ì½ê¸ì¡(VATí¬í¨)");
    bottom.splice(contractIndex, 0, "");
    if (sheet.requestRow) sheet.requestRow.splice(contractIndex, 0, "ê³ì½ê¸ì¡A Ã 1.1 ìë ê³ì°");
    (sheet.rows || []).forEach(row => row.splice(contractIndex, 0, ""));
    contractIndex += 1;
  }

  const currentLeaf = getEstimateDbLeafColumns(sheet);
  contractIndex = currentLeaf.findIndex(v => normalizeEstimateDbText(v) === "ê³ì½ê¸ì¡");
  if (contractIndex < 0) contractIndex = top.findIndex(v => normalizeEstimateDbText(v) === "ê³ì½ê¸ì¡");
  const existingBreakdowns = getEstimateDbLeafColumns(sheet).filter(v => /^A-\d+$/.test(normalizeEstimateDbText(v)));
  if (!existingBreakdowns.length) {
    const existingAmounts = (sheet.rows || []).map(row => row?.[contractIndex] || "");
    for (let n = 1; n <= 3; n += 1) {
      const insertAt = contractIndex + n;
      top.splice(insertAt, 0, "");
      bottom.splice(insertAt, 0, `A-${n}`);
      if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, "ê³ì½ê¸ì¡ ë¶í  ìë ¥: Enterë¡ ê¸ì¡/ë ì§ ìë ¥");
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
      if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, "ê³ì½ê¸ì¡ ë¶í  ìë ¥: Enterë¡ ê¸ì¡/ë ì§ ìë ¥");
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
  if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, "ì¶ê° ê³ì½ê¸ì¡ ë¶í  ìë ¥: Enterë¡ ê¸ì¡/ë ì§ ìë ¥");
  (sheet.rows || []).forEach(row => row.splice(insertAt, 0, ""));
  estimateDbSelectedCell = { tab: "progress", sectionIndex: null, rowIndex: estimateDbSelectedCell?.rowIndex || 0, colIndex: insertAt };
  renderEstimateDbManage({ forceRecalc: true });
  requestAnimationFrame(() => focusEstimateDbCell(estimateDbSelectedCell.rowIndex || 0, insertAt));
  if (typeof showToast === "function") showToast(`ê³ì½ê¸ì¡A-${next} ì´ì ì¶ê°íìµëë¤.`);
}

function ensureEstimateDbProgressStageTotalColumns() {
  const sheet = estimateDbSheets.progress;
  if (!sheet?.headerRows || sheet.headerRows.length < 2) return;
  const top = sheet.headerRows[0];
  const bottom = sheet.headerRows[1];
  ["ì¸ê¸ê³ì°ì", "ìê¸ìì ì¼", "ìê¸ì¼"].forEach(group => {
    const indexes = getEstimateDbProgressGroupIndexes(group);
    if (!indexes.length) return;
    const last = Math.max(...indexes);
    if (normalizeEstimateDbText(bottom[last]) === "í©ê³") return;
    const insertAt = last + 1;
    top.splice(insertAt, 0, "");
    bottom.splice(insertAt, 0, "í©ê³");
    if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, "ê³ì½ê¸ë¶í° ë§ì§ë§ ê¸°ì± ì°¨ìê¹ì§ ìë í©ê³");
    (sheet.rows || []).forEach(row => row.splice(insertAt, 0, ""));
  });
}
function getEstimateDbProgressOutsourceIndexes() {
  const sheet = estimateDbSheets.progress;
  const top = sheet?.headerRows?.[0] || [];
  const leaf = getEstimateDbLeafColumns(sheet);
  const targets = ["ê¸°ê³", "ì ê¸°", "ì¸ì£¼", "ì¡ë¬´", "ê¸°í"];
  let activeGroup = "";
  return leaf.reduce((list, label, index) => {
    const topLabel = normalizeEstimateDbText(top[index]);
    if (topLabel) activeGroup = topLabel.replace(/\s+/g, "");
    if (activeGroup.includes("ì¸ì£¼ê¸ì¡") && targets.includes(normalizeEstimateDbText(label))) list.push(index);
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
    if (activeGroup.includes("ì¸ì£¼ê¸ì¡") && normalizeEstimateDbText(leaf[i]) === "í©ê³") return i;
  }
  return -1;
}
function getEstimateDbMepVendorTradeMap() {
  const rows = ensureEstimateDbMepVendorRows?.() || estimateDbSheets?.mep?.vendorRows || [];
  return rows.reduce((map, row) => {
    const vendorName = normalizeEstimateDbText(row?.[1]);
    const trade = normalizeEstimateDbText(row?.[2]);
    if (vendorName) map[vendorName] = trade;
    return map;
  }, {});
}
function getEstimateDbMepTradeForVendor(vendorName) {
  const target = normalizeEstimateDbText(vendorName);
  if (!target) return "";
  const tradeMap = getEstimateDbMepVendorTradeMap();
  if (tradeMap[target]) return tradeMap[target];
  const compactTarget = target.replace(/\s+/g, "");
  const key = Object.keys(tradeMap).find(name => name.replace(/\s+/g, "") === compactTarget);
  return key ? tradeMap[key] : "";
}
function getEstimateDbProgressPjNoIndex() {
  return getEstimateDbColumnIndexByHeader("progress", "PJ NO");
}
function buildEstimateDbMepOutsourceSummaryByPjNo() {
  const sheet = estimateDbSheets?.mep;
  const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
  const pjNoIndex = getEstimateDbColumnIndexByHeader("mep", "PJ NO");
  const companyIndex = getEstimateDbColumnIndexByHeader("mep", "ê³ì½ìì²´");
  const amountIndex = getEstimateDbColumnIndexByHeader("mep", "ê³ì½ê¸ì¡");
  const altAmountIndex = getEstimateDbColumnIndexByHeader("mep", "ì»¨ì½ì¤í¸ê³ì½ê¸");
  const validTrades = ["ê¸°ê³", "ì ê¸°", "ì¸ì£¼", "ì¡ë¬´", "ê¸°í"];
  const summary = {};
  if (pjNoIndex < 0 || companyIndex < 0) return summary;
  rows.forEach(row => {
    const pjNo = normalizeEstimateDbText(row?.[pjNoIndex]);
    const company = normalizeEstimateDbText(row?.[companyIndex]);
    if (!pjNo || !company) return;
    const trade = getEstimateDbMepTradeForVendor(company);
    if (!validTrades.includes(trade)) return;
    const amountRaw = amountIndex >= 0 ? row?.[amountIndex] : (altAmountIndex >= 0 ? row?.[altAmountIndex] : "");
    const amount = toEstimateDbNumber(amountRaw);
    if (!summary[pjNo]) summary[pjNo] = {};
    if (!summary[pjNo][trade]) summary[pjNo][trade] = { total: 0, companies: [] };
    summary[pjNo][trade].total += amount;
    if (!summary[pjNo][trade].companies.includes(company)) summary[pjNo][trade].companies.push(company);
  });
  return summary;
}
function stringifyEstimateDbMepOutsourceSummaryCell(summaryCell) {
  if (!summaryCell) return "";
  const total = Number(summaryCell.total) || 0;
  const companies = Array.isArray(summaryCell.companies) ? summaryCell.companies.filter(Boolean) : [];
  if (!companies.length && !total) return "";
  const companyLabel = companies.length > 1 ? `${companies[0]} ì¸ ${companies.length - 1}` : (companies[0] || "");
  if (companyLabel && total) return `${companyLabel}
${total}`;
  if (companyLabel) return companyLabel;
  return total ? String(total) : "";
}
function syncEstimateDbProgressOutsourceCellsFromMepByPjNo(options = {}) {
  const progressSheet = estimateDbSheets?.progress;
  if (!progressSheet?.rows?.length) return 0;
  const pjNoIndex = getEstimateDbProgressPjNoIndex();
  const outsourceIndexes = getEstimateDbProgressOutsourceIndexes();
  const leaf = getEstimateDbLeafColumns(progressSheet);
  if (pjNoIndex < 0 || !outsourceIndexes.length) return 0;
  const summaryByPjNo = buildEstimateDbMepOutsourceSummaryByPjNo();
  let changed = 0;
  progressSheet.rows.forEach(row => {
    const pjNo = normalizeEstimateDbText(row?.[pjNoIndex]);
    outsourceIndexes.forEach(colIndex => {
      const trade = normalizeEstimateDbText(leaf[colIndex]);
      const nextValue = stringifyEstimateDbMepOutsourceSummaryCell(summaryByPjNo[pjNo]?.[trade]);
      if ((row[colIndex] || "") !== nextValue) {
        row[colIndex] = nextValue;
        changed += 1;
      }
    });
    recalcEstimateDbProgressOutsourceTotal(row);
  });
  if (changed && options.markDirty) {
    estimateDbHasUnsavedChanges = true;
    updateEstimateDbSaveButtonState?.();
  }
  return changed;
}
function recalcEstimateDbProgressOutsourceTotal(row) {
  if (!row) return;
  const totalIndex = getEstimateDbProgressOutsourceTotalIndex();
  if (totalIndex < 0) return;
  const sum = getEstimateDbProgressOutsourceIndexes().reduce((acc, i) => {
    const parsed = parseEstimateDbAmountCellValue(row[i]);
    return acc + toEstimateDbNumber(parsed.amount || row[i]);
  }, 0);
  // ì¸ì£¼ê¸ì¡ ê¸°ê³/ì ê¸°/ì¸ì£¼/ì¡ë¬´/ê¸°íì í©ì°ê°ì í­ì ì¸ì£¼ê¸ì¡ í©ê³ì ë°ìí©ëë¤.
  row[totalIndex] = sum ? String(sum) : "";
}
function recalcEstimateDbProgressStageTotals(row) {
  if (!row) return;
  const sheet = estimateDbSheets.progress;
  const bottom = sheet?.headerRows?.[1] || [];
  ["ì¸ê¸ê³ì°ì", "ìê¸ìì ì¼", "ìê¸ì¼"].forEach(group => {
    const indexes = getEstimateDbProgressGroupIndexes(group);
    if (!indexes.length) return;
    const totalIndex = indexes.find(i => normalizeEstimateDbText(bottom[i]) === "í©ê³");
    if (totalIndex < 0) return;
    const sum = indexes.reduce((acc, i) => {
      const label = normalizeEstimateDbText(bottom[i]);
      if (i === totalIndex || label === "í©ê³") return acc;
      if (label === "ê³ì½ê¸" || /^\d+ì°¨ê¸°ì±$/.test(label)) return acc + toEstimateDbNumber(row[i]);
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
    const m2Index = idx("ì°ë©´ì (m2)");
    const pyIndex = idx("ì°ë©´ì (í)");
    if (m2Index >= 0 && pyIndex >= 0) {
      const m2Value = toEstimateDbNumber(row[m2Index]);
      const pyText = normalizeEstimateDbText(row[pyIndex]);
      if (m2Value && !pyText) {
        const pyValue = Math.ceil(m2Value * 0.3025);
        row[pyIndex] = String(pyValue);
      }
    }
  }
  if (tab === "progress") {
    const contractBreakdownSum = getEstimateDbContractAmountBreakdownIndexes().reduce((sum, i) => sum + toEstimateDbNumber(row[i]), 0);
    const contractIndex = getEstimateDbContractAmountColumnIndex();
    const vatIndex = getEstimateDbContractVatColumnIndex();
    if (contractIndex >= 0) row[contractIndex] = contractBreakdownSum ? String(contractBreakdownSum) : "";
    if (vatIndex >= 0) row[vatIndex] = contractBreakdownSum ? String(Math.round(contractBreakdownSum * 1.1)) : "";
    const balance = contractBreakdownSum - get("ìë ¹ì¡");
    set("ìì¡", balance);
    recalcEstimateDbProgressOutsourceTotal(row);
    const waiting = balance - get("ë°íìë£") - get("ë©íìë£") - get("ììì§íì¤") - get("ììì·¨ì");
    set("ììëê¸°ì¤", waiting);
    recalcEstimateDbProgressStageTotals(row);
  }
  if (tab === "mep") {
    const balance = get("ê³ì½ê¸ì¡") - get("ìë ¹ì¡");
    set("ìì¡", balance);
    const waiting = balance - get("ë°íìë£") - get("ë©íìë£") - get("ììì§íì¤") - get("ììì·¨ì");
    set("ììëê¸°ì¤", waiting);
  }
}
function recalcAllEstimateDbRows() {
  syncEstimateDbProgressOutsourceCellsFromMepByPjNo?.();
  Object.keys(estimateDbSheets).forEach(tab => (estimateDbSheets[tab].rows || []).forEach(row => recalcEstimateDbRow(tab, row)));
}

/* =========================================================
   DBê´ë¦¬ ì±ë¥ êµ¬ì¡° ë³ê²½
   - ì ì²´ í­ ì¬ê³ì° ëì  íì¬ í­ë§ ì¬ê³ì°
   - ëë íì 50ê° ë¨ì íì´ì§ ë ëë§
   ========================================================= */
const ESTIMATE_DB_RENDER_PAGE_SIZE = 50;
let estimateDbPageState = { pj: 0, progress: 0, mep: 0 };
let estimateDbMepSelectedVendorIndex = null;

function getEstimateDbMepVendorHeaders() {
  const sheet = estimateDbSheets?.mep || {};
  return Array.isArray(sheet.vendorHeaders) && sheet.vendorHeaders.length
    ? sheet.vendorHeaders
    : ["NO", "ìì²´ëª", "ê³µì¢", "ëíì´ì¬", "ì¼ë°ì í", "í´ëí°", "ì§íµì í", "EMAIL (ëí)", "ëíë²í¸", "EMAIL", "EMAIL1", "ì°ë½ì²(ê²½ì§)", "ì°ë½ì²(ê¸°ì )", "ê³ì¢", "ìí", "ì£¼ì", "ì¹íë", "ê¸°í"];
}

function ensureEstimateDbMepVendorRows() {
  const sheet = estimateDbSheets?.mep;
  if (!sheet) return [];
  const headers = getEstimateDbMepVendorHeaders();
  if (!Array.isArray(sheet.vendorRows)) sheet.vendorRows = [];
  if (!sheet.vendorRows.length) {
    const companyIdx = getEstimateDbColumnIndexByHeader("mep", "ê³ì½ìì²´");
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

function focusEstimateDbMepVendor(index) {
  estimateDbMepSelectedVendorIndex = Number(index);
}

function updateEstimateDbMepVendorCell(rowIndex, colIndex, value) {
  const rows = ensureEstimateDbMepVendorRows();
  if (!rows[rowIndex]) return;
  rows[rowIndex][colIndex] = value;
  estimateDbHasUnsavedChanges = true;
  updateEstimateDbSaveButtonState?.();
}

function focusEstimateDbMepVendorCell(rowIndex, colIndex) {
  const input = document.querySelector(`.quote-db-mep-vendor-input[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`);
  if (!input) return false;
  input.focus({ preventScroll: true });
  requestAnimationFrame(() => {
    input.scrollIntoView({ block: "nearest", inline: "nearest" });
    try { input.select(); } catch (error) {}
  });
  return true;
}

function handleEstimateDbMepVendorKeydown(event, rowIndex, colIndex) {
  const key = event?.key;
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) return;
  const rows = ensureEstimateDbMepVendorRows();
  const headers = getEstimateDbMepVendorHeaders();
  const maxRow = Math.max(0, rows.length - 1);
  const maxCol = Math.max(0, headers.length - 1);
  let nextRow = Number(rowIndex);
  let nextCol = Number(colIndex);

  if (key === "ArrowUp") nextRow -= 1;
  if (key === "ArrowDown") nextRow += 1;
  if (key === "ArrowLeft") nextCol -= 1;
  if (key === "ArrowRight") nextCol += 1;

  nextRow = Math.max(0, Math.min(maxRow, nextRow));
  nextCol = Math.max(0, Math.min(maxCol, nextCol));
  if (nextRow === Number(rowIndex) && nextCol === Number(colIndex)) return;

  event.preventDefault();
  event.stopPropagation();
  estimateDbMepSelectedVendorIndex = nextRow;
  focusEstimateDbMepVendorCell(nextRow, nextCol);
}

function getEstimateDbMepVendorName(vendorRow) {
  return normalizeEstimateDbText(vendorRow?.[1]);
}

function getEstimateDbMepDetailRowsForVendor(vendorName) {
  const sheet = estimateDbSheets?.mep;
  const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
  if (!vendorName) return [];
  const companyIdx = getEstimateDbColumnIndexByHeader("mep", "ê³ì½ìì²´");
  if (companyIdx < 0) return rows.map((row, sourceIndex) => ({ row, sourceIndex }));
  const matched = rows
    .map((row, sourceIndex) => ({ row, sourceIndex }))
    .filter(({ row }) => normalizeEstimateDbText(row?.[companyIdx]) === vendorName);
  return matched;
}

function addEstimateDbMepRowForSelectedVendor(options = {}) {
  const sheet = estimateDbSheets?.mep;
  const vendor = getEstimateDbMepSelectedVendor();
  const vendorName = getEstimateDbMepVendorName(vendor);
  if (!sheet || !vendorName) {
    if (typeof showToast === "function") showToast("ìì²´ ë¦¬ì¤í¸ìì ìì²´ë¥¼ ë¨¼ì  ì íí´ ì£¼ì¸ì.");
    return { ok: false, message: "ìì²´ ë¦¬ì¤í¸ìì ìì²´ë¥¼ ë¨¼ì  ì íí´ ì£¼ì¸ì." };
  }
  const columns = getEstimateDbLeafColumns(sheet);
  const next = Array(columns.length).fill("");
  const createdIdx = getEstimateDbColumnIndexByHeader("mep", "ìµì´ìì±ë ì§");
  const companyIdx = getEstimateDbColumnIndexByHeader("mep", "ê³ì½ìì²´");
  if (createdIdx >= 0) next[createdIdx] = formatEstimateDbKoreanDate?.() || "";
  if (companyIdx >= 0) next[companyIdx] = vendorName;
  if (!Array.isArray(sheet.rows)) sheet.rows = [];
  const sourceIndex = sheet.rows.length;
  sheet.rows.push(next);
  estimateDbHasUnsavedChanges = true;
  updateEstimateDbSaveButtonState?.();
  estimateDbMepSelectedVendorIndex = estimateDbMepSelectedVendorIndex ?? 0;
  if (!options.skipRender) renderEstimateDbManage({ forceRecalc: true, renderReportsNow: false });
  return { ok: true, sourceIndex, vendorName };
}

function addEstimateDbMepRowForVendorIndex(vendorIndex) {
  const rows = ensureEstimateDbMepVendorRows();
  const index = Number(vendorIndex);
  if (!Number.isFinite(index) || !rows[index]) {
    return { ok: false, message: "ì íí ìì²´ ì ë³´ë¥¼ ì°¾ì ì ììµëë¤. ì°½ì ë«ê³  ë¤ì ì´ì´ ì£¼ì¸ì." };
  }
  estimateDbMepSelectedVendorIndex = index;
  return addEstimateDbMepRowForSelectedVendor({ skipRender: true });
}

function updateEstimateDbMepDetailCellFromPopup(sourceIndex, colIndex, value) {
  const sheet = estimateDbSheets?.mep;
  const row = sheet?.rows?.[Number(sourceIndex)];
  if (!sheet || !row) return;
  row[Number(colIndex)] = value;
  recalcEstimateDbRow("mep", row);
  syncEstimateDbProgressOutsourceCellsFromMepByPjNo?.({ markDirty: true });
  estimateDbHasUnsavedChanges = true;
  updateEstimateDbSaveButtonState?.();
  if (estimateDbActiveTab === "progress") renderEstimateDbManage({ forceRecalc: true, renderReportsNow: false });
}

function removeEstimateDbMepDetailRowFromPopup(sourceIndex) {
  const sheet = estimateDbSheets?.mep;
  if (!sheet?.rows?.[Number(sourceIndex)]) return;
  sheet.rows.splice(Number(sourceIndex), 1);
  syncEstimateDbProgressOutsourceCellsFromMepByPjNo?.({ markDirty: true });
  estimateDbHasUnsavedChanges = true;
  updateEstimateDbSaveButtonState?.();
  if (estimateDbActiveTab === "mep" || estimateDbActiveTab === "progress") renderEstimateDbManage({ renderReportsNow: false });
}

function buildEstimateDbMepVendorDetailRowsHtml(vendorIndex) {
  const sheet = getEstimateDbSheet("mep");
  const vendorRows = ensureEstimateDbMepVendorRows();
  const vendor = vendorRows[Number(vendorIndex)] || null;
  const vendorName = getEstimateDbMepVendorName(vendor);
  const leafColumns = getEstimateDbLeafColumns(sheet);
  const detailRows = getEstimateDbMepDetailRowsForVendor(vendorName);
  if (!detailRows.length) {
    return `<tr><td class="empty" colspan="${leafColumns.length + 1}">ì íí ìì²´ì ì°ê²°ë ê³ì½/ì§ê¸ ë´ì­ì´ ììµëë¤. ì°ì¸¡ ìë¨ì [+ ê³ì½í ì¶ê°] ë²í¼ì ëë¬ ì íì ì¶ê°íì¸ì.</td></tr>`;
  }
  return detailRows.map(({ row, sourceIndex }) => `
      <tr data-source-index="${sourceIndex}">
        ${leafColumns.map((col, colIndex) => {
          const raw = row?.[colIndex] || "";
          const value = formatEstimateDbMoneyDisplay(getEstimateDbCellDisplayValue("mep", sourceIndex, colIndex, raw), "mep", colIndex, sheet);
          return `<td><input value="${escapeEstimateDbHtml(value)}" data-row-index="${sourceIndex}" data-col-index="${colIndex}" oninput="markDirty(this)" onchange="saveCell(this)" onkeydown="moveCell(event,this)" /></td>`;
        }).join("")}
        <td class="manage"><button type="button" onclick="deleteRow(${sourceIndex})">ì­ì </button></td>
      </tr>`).join("");
}

function buildEstimateDbMepVendorDetailWindowHtml(vendorIndex) {
  const sheet = getEstimateDbSheet("mep");
  const vendorRows = ensureEstimateDbMepVendorRows();
  const vendor = vendorRows[Number(vendorIndex)] || null;
  const vendorName = getEstimateDbMepVendorName(vendor);
  const leafColumns = getEstimateDbLeafColumns(sheet);
  const title = vendorName ? `${vendorName} ê¸°ì ìì²´ ê³ì½/ì§ê¸ ë´ì­` : "ê¸°ì ìì²´ ê³ì½/ì§ê¸ ë´ì­";
  const rowsHtml = buildEstimateDbMepVendorDetailRowsHtml(vendorIndex);
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>${escapeEstimateDbHtml(title)}</title>
<style>
  *{box-sizing:border-box} body{margin:0;background:#f5f7fb;color:#0f172a;font-family:Inter,Apple SD Gothic Neo,Malgun Gothic,sans-serif;font-size:13px} .top{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #dbe3ee;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;gap:14px} h1{margin:0;font-size:20px;font-weight:900} .sub{margin-top:6px;color:#64748b;font-size:12px;font-weight:700} .btns{display:flex;gap:8px} button{height:34px;border:1px solid #d8e1ee;background:#fff;border-radius:10px;padding:0 14px;font-weight:900;cursor:pointer} button.primary{background:#f97316;color:#fff;border-color:#f97316} .wrap{padding:18px 22px}.card{background:#fff;border:1px solid #dbe3ee;border-radius:16px;box-shadow:0 10px 24px rgba(15,23,42,.08);overflow:hidden}.table-wrap{overflow:auto;max-height:calc(100vh - 145px)} table{border-collapse:separate;border-spacing:0;min-width:max-content;width:100%} th{position:sticky;top:0;background:#f1f5f9;z-index:2;color:#0f172a;font-size:12px;font-weight:900;border-bottom:1px solid #dbe3ee} th,td{border-right:1px solid #e5ebf3;border-bottom:1px solid #e5ebf3;padding:6px;vertical-align:middle;min-width:120px} td input{width:100%;height:30px;border:1px solid #d8e1ee;border-radius:8px;padding:0 8px;font-weight:800;background:#fff} td input.dirty{border-color:#f97316;background:#fff7ed}.manage{position:sticky;right:0;background:#fff;min-width:82px;text-align:center;box-shadow:-4px 0 8px rgba(15,23,42,.06)} th.manage{background:#f1f5f9}.empty{padding:28px;text-align:center;color:#64748b;font-weight:900}.notice{margin:0 0 10px;color:#475569;font-size:12px;font-weight:800}
</style>
</head>
<body>
  <div class="top">
    <div><h1>${escapeEstimateDbHtml(title)}</h1><div class="sub">ìì²´ ë¦¬ì¤í¸ë¥¼ ëë¸í´ë¦­í´ ì´ë¦° ê³ì½/ì§ê¸ ë´ì­ ì ì°½ìëë¤. ìë ¥ê° ë³ê²½ í ì ì¥ ë²í¼ì ëë¥´ì¸ì.</div></div>
    <div class="btns"><button type="button" onclick="refreshRows()">ìë¡ê³ ì¹¨</button><button type="button" class="primary" onclick="addRow()">+ ê³ì½í ì¶ê°</button><button type="button" onclick="window.close()">ë«ê¸°</button></div>
  </div>
  <div class="wrap">
    <p class="notice">ì í ìì²´: ${escapeEstimateDbHtml(vendorName || "-")}</p>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr>${leafColumns.map(col => `<th>${escapeEstimateDbHtml(col || "").replace(/\n/g, "<br>")}</th>`).join("")}<th class="manage">ê´ë¦¬</th></tr></thead>
      <tbody id="mepDetailBody">${rowsHtml}</tbody>
    </table></div></div>
  </div>
<script>
  window.__CONCOST_MEP_VENDOR_INDEX__ = ${Number(vendorIndex) || 0};
  function markDirty(input){ input.classList.add('dirty'); }
  function saveCell(input){
    if(!window.opener || !window.opener.updateEstimateDbMepDetailCellFromPopup) return;
    window.opener.updateEstimateDbMepDetailCellFromPopup(Number(input.dataset.rowIndex), Number(input.dataset.colIndex), input.value);
    input.classList.remove('dirty');
  }
  function refreshRows(){
    var tbody = document.getElementById('mepDetailBody');
    if(!tbody) return;
    if(window.opener && typeof window.opener.buildEstimateDbMepVendorDetailRowsHtml === 'function'){
      tbody.innerHTML = window.opener.buildEstimateDbMepVendorDetailRowsHtml(window.__CONCOST_MEP_VENDOR_INDEX__);
    }
  }
  function addRow(){
    try {
      if(window.opener && typeof window.opener.addEstimateDbMepRowForVendorIndex === 'function'){
        var result = window.opener.addEstimateDbMepRowForVendorIndex(window.__CONCOST_MEP_VENDOR_INDEX__);
        if(result && result.ok === false){ alert(result.message || 'ê³ì½íì ì¶ê°íì§ ëª»íìµëë¤.'); return; }
        refreshRows();
        return;
      }
      alert('ìë³¸ DBê´ë¦¬ íë©´ê³¼ ì°ê²°ì´ ëê²¼ìµëë¤. ì´ ì°½ì ë«ê³  ìì²´ ë¦¬ì¤í¸ìì ë¤ì ì´ì´ ì£¼ì¸ì.');
    } catch (error) {
      alert('ê³ì½í ì¶ê° ì¤ ì¤ë¥ê° ë°ìíìµëë¤: ' + (error && error.message ? error.message : error));
    }
  }
  function deleteRow(sourceIndex){
    if(!confirm('í´ë¹ ê³ì½/ì§ê¸ ë´ì­ íì ì­ì í ê¹ì?')) return;
    if(window.opener && window.opener.removeEstimateDbMepDetailRowFromPopup){
      window.opener.removeEstimateDbMepDetailRowFromPopup(sourceIndex);
      refreshRows();
    }
  }
  function moveCell(event,input){
    const keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter'];
    if(!keys.includes(event.key)) return;
    saveCell(input);
    const row = Number(input.dataset.rowIndex);
    const col = Number(input.dataset.colIndex);
    let nextRow = row;
    let nextCol = col;
    if(event.key === 'ArrowUp') nextRow = row - 1;
    if(event.key === 'ArrowDown' || event.key === 'Enter') nextRow = row + 1;
    if(event.key === 'ArrowLeft') nextCol = col - 1;
    if(event.key === 'ArrowRight') nextCol = col + 1;
    const next = document.querySelector('input[data-row-index="' + nextRow + '"][data-col-index="' + nextCol + '"]');
    if(next){
      event.preventDefault();
      next.focus();
      next.select && next.select();
    }
  }
</script>
</body></html>`;
}

function openEstimateDbMepVendorDetailWindow(vendorIndex) {
  estimateDbMepSelectedVendorIndex = Number(vendorIndex);
  const vendor = ensureEstimateDbMepVendorRows()[Number(vendorIndex)] || null;
  const vendorName = getEstimateDbMepVendorName(vendor) || "ê¸°ì ìì²´";
  const safeName = String(vendorName).replace(/[^a-zA-Z0-9ê°-í£_-]/g, "_").slice(0, 40) || "mep_vendor";
  const win = window.open("", `CONCOST_MEP_VENDOR_${safeName}`, "width=1500,height=900,left=60,top=40,resizable=yes,scrollbars=yes");
  if (!win) {
    if (typeof showToast === "function") showToast("íì ì°¨ë¨ì í´ì í´ ì£¼ì¸ì.");
    return;
  }
  win.document.open();
  win.document.write(buildEstimateDbMepVendorDetailWindowHtml(vendorIndex));
  win.document.close();
  win.focus?.();
  renderEstimateDbManage({ renderReportsNow: false });
}
if (typeof window !== "undefined") {
  window.buildEstimateDbMepVendorDetailWindowHtml = buildEstimateDbMepVendorDetailWindowHtml;
  window.buildEstimateDbMepVendorDetailRowsHtml = buildEstimateDbMepVendorDetailRowsHtml;
  window.addEstimateDbMepRowForVendorIndex = addEstimateDbMepRowForVendorIndex;
  window.updateEstimateDbMepDetailCellFromPopup = updateEstimateDbMepDetailCellFromPopup;
  window.removeEstimateDbMepDetailRowFromPopup = removeEstimateDbMepDetailRowFromPopup;
}

window.buildEstimateDbMepVendorDetailWindowHtml = buildEstimateDbMepVendorDetailWindowHtml;
window.buildEstimateDbMepVendorDetailRowsHtml = buildEstimateDbMepVendorDetailRowsHtml;
window.openEstimateDbMepVendorDetailWindow = openEstimateDbMepVendorDetailWindow;
window.focusEstimateDbMepVendor = focusEstimateDbMepVendor;
window.updateEstimateDbMepDetailCellFromPopup = updateEstimateDbMepDetailCellFromPopup;
window.addEstimateDbMepRowForVendorIndex = addEstimateDbMepRowForVendorIndex;
window.removeEstimateDbMepDetailRowFromPopup = removeEstimateDbMepDetailRowFromPopup;

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
          <div class="quote-db-mep-section-head quote-db-mep-vendor-head">
            <div>
              <strong>ìì²´ ë¦¬ì¤í¸</strong>
              <span>ìë¨ì ìì²´ ê¸°ë³¸ì ë³´ ìë ¥ ìì­ìëë¤. ìì²´ íì ëë¸í´ë¦­íë©´ ê³ì½/ì§ê¸ë´ì­ì í° ì ì°½ì¼ë¡ íì¸Â·ìì í  ì ììµëë¤.</span>
            </div>

          </div>
          <div class="quote-db-mep-vendor-wrap">
            <table class="quote-db-mep-vendor-table">
              <thead>
                <tr>${vendorHeaders.map(h => `<th>${escapeEstimateDbHtml(h)}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${vendorRows.map((row, rowIndex) => `
                  <tr class="quote-db-mep-vendor-row${rowIndex === estimateDbMepSelectedVendorIndex ? " active" : ""}" onclick="selectEstimateDbMepVendor(${rowIndex})" ondblclick="openEstimateDbMepVendorDetailWindow(${rowIndex})" title="ëë¸í´ë¦­íë©´ ê³ì½/ì§ê¸ ë´ì­ì ì ì°½ì¼ë¡ ì½ëë¤.">
                    ${vendorHeaders.map((_, colIndex) => `<td><input class="quote-db-mep-vendor-input" value="${escapeEstimateDbHtml(row?.[colIndex] || "")}" data-row-index="${rowIndex}" data-col-index="${colIndex}" onclick="event.stopPropagation()" ondblclick="event.stopPropagation(); openEstimateDbMepVendorDetailWindow(${rowIndex})" onfocus="focusEstimateDbMepVendor(${rowIndex})" oninput="updateEstimateDbMepVendorCell(${rowIndex}, ${colIndex}, this.value)" onkeydown="handleEstimateDbMepVendorKeydown(event, ${rowIndex}, ${colIndex})" /></td>`).join("")}
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
          <div class="quote-db-mep-open-panel">
            <div>
              <strong>${selectedVendorName ? escapeEstimateDbHtml(selectedVendorName) : "ìì²´ë¥¼ ì ííì¸ì"}</strong>
              <span>${selectedVendorName ? "ì íë ìì²´ìëë¤. ê³ì½/ì§ê¸ë´ì­ì ìì²´ íì ëë¸í´ë¦­íë©´ ì ì°½ì¼ë¡ ì´ë¦½ëë¤." : "ìì²´ íì í´ë¦­í´ ì ííê³ , ëë¸í´ë¦­íë©´ ê³ì½/ì§ê¸ë´ì­ì í° íë©´ì¼ë¡ ë³¼ ì ììµëë¤."}</span>
            </div>

          </div>
        </div>
      </td>
    </tr>
  `;
  updateEstimateDbMepQuickActions();
  applyEstimateDbCommaFormatToRenderedInputs();
  if (options.renderReportsNow) renderEstimateDbReports();
  else scheduleEstimateDbReportsRender(220);
}

function renderEstimateDbMepDetailTable(detailRows, leafColumns, sheet) {
  if (!detailRows.length) {
    return `<div class="quote-db-mep-empty">ì íí ìì²´ì ì°ê²°ë ê³ì½/ì§ê¸ ë´ì­ì´ ììµëë¤. <button type="button" class="btn btn-primary btn-xs" onclick="addEstimateDbMepRowForSelectedVendor()">ê³ì½í ì¶ê°</button></div>`;
  }
  return `
    <table class="quote-db-mep-detail-table">
      <thead>
        <tr>${leafColumns.map((col, colIndex) => `<th ${makeEstimateDbCellStyle(colIndex, sheet)}>${escapeEstimateDbHtml(col || "").replace(/\n/g, "<br>")}</th>`).join("")}<th class="quote-db-manage-col">ê´ë¦¬</th></tr>
      </thead>
      <tbody>
        ${detailRows.map(({ row, sourceIndex }) => `
          <tr class="quote-db-mep-detail-row" data-row-index="${sourceIndex}">
            ${leafColumns.map((_, colIndex) => {
              const displayValue = formatEstimateDbMoneyDisplay(getEstimateDbCellDisplayValue("mep", sourceIndex, colIndex, row?.[colIndex] || ""), "mep", colIndex, sheet);
              const dirtyClass = getEstimateDbPendingEdit("mep", sourceIndex, colIndex) ? " quote-db-cell-dirty" : "";
              return `<td ${makeEstimateDbCellStyle(colIndex, sheet)}><input class="quote-db-cell-input${dirtyClass}" value="${escapeEstimateDbHtml(displayValue)}" data-row-index="${sourceIndex}" data-col-index="${colIndex}" onfocus="estimateDbSelectedCell={tab:'mep',sectionIndex:null,rowIndex:${sourceIndex},colIndex:${colIndex}}" oninput="handleEstimateDbCellInput(event, ${sourceIndex}, ${colIndex}, false)" onkeydown="handleEstimateDbKeydown(event)" /></td>`;
            }).join("")}
            <td class="quote-db-manage-col"><button class="btn btn-line btn-xs" type="button" onclick="removeEstimateDbRow(${sourceIndex})">ì­ì </button></td>
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
  // ê¸°ì±ê´ë¦¬/ê¸°ì ìì²´ë ì»¬ë¼ ìê° ë§ì¼ë¯ë¡ í­ ì§ì ì ì ì²´ íì ì¬ê³ì°íì§ ììµëë¤.
  // ì ìì /ì ì¥ ì ë³ê²½ íë§ recalcEstimateDbRow()ë¡ ê³ì°íê³ ,
  // ì ì²´ ì¬ê³ì°ì´ ê¼­ íìí ê²½ì°ìë§ force ìµìì ì¬ì©í©ëë¤.
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
    <div class="quote-db-pager-info">íì ${paged.total ? (paged.start + 1).toLocaleString('ko-KR') : 0}~${paged.end.toLocaleString('ko-KR')} / ì ì²´ ${paged.total.toLocaleString('ko-KR')}í</div>
    <div class="quote-db-pager-actions">
      <button class="btn btn-line btn-sm" type="button" ${disabledPrev} onclick="moveEstimateDbPage(-1)">ì´ì </button>
      <span>${(paged.page + 1).toLocaleString('ko-KR')} / ${(paged.maxPage + 1).toLocaleString('ko-KR')}</span>
      <button class="btn btn-line btn-sm" type="button" ${disabledNext} onclick="moveEstimateDbPage(1)">ë¤ì</button>
    </div>`;
}
function moveEstimateDbPage(delta = 0) {
  const current = getEstimateDbPageIndex(estimateDbActiveTab);
  setEstimateDbPageIndex(estimateDbActiveTab, current + Number(delta || 0));
  estimateDbSelectedCell = { tab: estimateDbActiveTab, sectionIndex: null, rowIndex: 0, colIndex: estimateDbSelectedCell?.colIndex || 0 };
  renderEstimateDbManage();
}
function getEstimateDbStageGroups() {
  return ["ì¸ê¸ê³ì°ì", "ìê¸ìì ì¼", "ìê¸ì¼"];
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
  const stageNumbers = cols.map(c => (normalizeEstimateDbText(c).match(/^(\d+)ì°¨ê¸°ì±$/) || [])[1]).filter(Boolean).map(Number);
  const next = (stageNumbers.length ? Math.max(...stageNumbers) : 5) + 1;
  const insertedIndexes = {};

  getEstimateDbStageGroups().forEach(group => {
    const groupIndexes = getEstimateDbProgressGroupIndexes(group);
    const totalIndex = groupIndexes.find(i => normalizeEstimateDbText(bottom[i]) === "í©ê³");
    const insertAt = totalIndex >= 0 ? totalIndex : (groupIndexes.length ? Math.max(...groupIndexes) + 1 : bottom.length);
    top.splice(insertAt, 0, "");
    bottom.splice(insertAt, 0, `${next}ì°¨ê¸°ì±`);
    if (sheet.requestRow) sheet.requestRow.splice(insertAt, 0, "ì¶ê°ë ê¸°ì± ì°¨ì ìë ¥ë");
    (sheet.rows || []).forEach(row => row.splice(insertAt, 0, ""));
    insertedIndexes[group] = insertAt;
  });

  const focusGroup = getEstimateDbStageGroups().includes(selectedGroup) ? selectedGroup : "ì¸ê¸ê³ì°ì";
  const focusCol = insertedIndexes[focusGroup] ?? Object.values(insertedIndexes)[0] ?? 0;
  estimateDbSelectedCell = { tab: "progress", sectionIndex: null, rowIndex: selected.rowIndex || 0, colIndex: focusCol };
  recalcAllEstimateDbRows();
  renderEstimateDbManage();
  requestAnimationFrame(() => focusEstimateDbCell(estimateDbSelectedCell.rowIndex || 0, focusCol));
  if (typeof showToast === "function") showToast(`${next}ì°¨ê¸°ì± ì´ì ì¶ê°íìµëë¤.`);
}


function normalizeEstimateDbSortValue(value) {
  const text = normalizeEstimateDbText(value);
  const numeric = Number(String(text).replace(/[,ì\s]/g, ""));
  if (text && !Number.isNaN(numeric) && /^-?[0-9,\.]+ì?$/.test(text)) return { type: "number", value: numeric };
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

  // PJê´ë¦¬, ê¸°ì±ê´ë¦¬, ê¸°ì ìì²´ ëª¨ë ê¸°ë³¸ ì ë ¬ì PJ NO ë´ë¦¼ì°¨ììëë¤.
  // ì¬ì©ìê° ë¤ë¥¸ í¤ëë¥¼ í´ë¦­íë©´ í´ë¹ ì ë ¬ì ì°ì  ì ì©íì§ë§,
  // í­ ìµì´ ì§ì/ì ì¥/Enter íì  ììë ë¤ì PJ NO ê¸°ì¤ì¼ë¡ ì ë ¬ë©ëë¤.
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
  // PJê´ë¦¬ / ê¸°ì±ê´ë¦¬ / ê¸°ì ìì²´ ê³µíµ: PJ NO ì´ì ê¸°ì¡´ ì ì¥ ì´í­ë³´ë¤ ê³ ì í­ì ì°ì  ì ì©í©ëë¤.
  if (header === "PJ NO") return " quote-db-col-pj-no";
  if (tab !== "pj") return "";
  if (header === "êµ­ë´/í´ì¸") return " quote-db-col-domestic";
  if (header === "ê±°ëì²ëª") return " quote-db-col-client-name";
  if (header === "íë¡ì í¸ëª") return " quote-db-col-project-name";
  return "";
}

function getEstimateDbGroupBoundaryClass(tab = estimateDbActiveTab, colIndex = 0, sheet = getEstimateDbSheet()) {
  const header = normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex));
  const boundaryHeadersByTab = {
    pj: ["íë¡ì í¸ëª", "ììê³µì¢", "ì¸ëì"],
    progress: ["ììì·¨ì", "ì¸ì£¼ê¸ì¡í©ê³", "2ì°¨ë©íê³µì¢"],
    mep: ["ììì·¨ì", "ì¸ì£¼ê¸ì¡í©ê³", "2ì°¨ë©íê³µì¢"]
  };
  const boundaryHeaders = boundaryHeadersByTab[tab] || [];
  return boundaryHeaders.includes(header) ? " quote-db-group-boundary" : "";
}

function renderEstimateDbSearchBox() {
  const box = document.getElementById("estimateDbSearchBox");
  if (!box) return;
  box.value = estimateDbSearchKeyword || "";
  box.placeholder = `${getEstimateDbSheet().title || "DB"} ê²ì`;
}

function ensureEstimateDbManualSaveButton() {
  if (document.getElementById("estimateDbManualSaveBtn")) return;
  const reorderBtn = document.getElementById("estimateDbColumnReorderBtn");
  const reorderOkBtn = document.getElementById("estimateDbColumnReorderOkBtn");
  if (reorderBtn) {
    reorderBtn.textContent = estimateDbColumnReorderMode ? "ì´ ìì¹ ë³ê²½ ì¤" : "ì´ ìì¹ ë³ê²½";
    reorderBtn.classList.toggle("active", estimateDbColumnReorderMode);
  }
  if (reorderOkBtn) reorderOkBtn.style.setProperty("display", estimateDbColumnReorderMode ? "inline-flex" : "none", "important");
  bindEstimateDbColumnReorderOkButton();
  const rowHeightBtn = document.getElementById("estimateDbRowHeightBtn");
  if (rowHeightBtn) rowHeightBtn.textContent = `í ëì´ ${estimateDbRowHeightPx}px`;
  const stageBtn = document.getElementById("estimateDbAddStageBtn");
  const exportBtn = Array.from(document.querySelectorAll("button")).find(btn => normalizeEstimateDbText(btn.textContent).includes("ìì ë´ë³´ë´ê¸°"));
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
    "ìµì´ìì±ë ì§","ì ìë²í¸","PJ NO",ESTIMATE_DB_PROJECT_LINK_HEADER,"êµ­ë´/í´ì¸","ê±°ëì²ëª","íë¡ì í¸ëª","ê±°ëì²","ê±°ëì²ë´ë¹ì","ì§ê¸","ì¼ë°ì í","í´ëí°","ì§íµì í","EMAIL","EMAIL2","ì¹íë","ID","PW","ê¸°í","ììê³µì¢","í´ëëª / ìë£ìì¹","PM(ë§ê°)","PM(êµ¬ì¡°)","PM(í ëª©,ì¡°ê²½)","PM(ê¸°ê³)","PM(ì ê¸°)","PM(ì¸íë¦¬ì´)","PM(ì² ê±°)","ììêµ¬ë¶","ìë¬´ì±ê²©","ìë¬´ë¨ê³2","ë¨ê°ììì¬ë¶","ê±´ë¬¼ì©ë","ì°ë©´ì (m2)","ì°ë©´ì (í)","ì¸µì","ëì","íìì","ì¸ëì","ìì£¼ì¼ì","ììì°©ìì¼ì","1ì°¨ë©íìì ì¼","1ì°¨ë©íì¼ì","1ì°¨ë©íê³µì¢","2ì°¨ë©íìì ì¼","2ì°¨ë©íì¼ì","2ì°¨ë©íê³µì¢","ìë´ / ì´ë©ì¼ / í¹ê¸°ì¬í­"
  ];
  const current = sheet.headerRows[0];
  if (desired.every((h, i) => current[i] === h) && current.length === desired.length) return;
  const oldIndex = new Map(current.map((h, i) => [h, i]));
  const aliases = { "ê±°ëì²": ["ê±°ëì²", "ë¶ìëª"] };
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
  // "ì´ ìì¹ ë³ê²½ ì¤" ë²í¼ì í¸ì§ëª¨ë ì¬ì§ì/ìííì ì©ëë¡ë§ ì¬ì©í©ëë¤.
  // í¸ì§ëª¨ë ì¢ë£ì ì ì¥ì ë°ëì "íì¸" ë²í¼ììë§ ì²ë¦¬í©ëë¤.
  if (estimateDbColumnReorderMode) {
    estimateDbColumnReorderSource = null;
    if (typeof showToast === "function") showToast("ì´ ìì¹ ë³ê²½ ëª¨ëìëë¤. ì¢ë£íë ¤ë©´ íì¸ ë²í¼ì ëë¥´ì¸ì.");
    renderEstimateDbManage();
    return;
  }
  estimateDbColumnReorderMode = true;
  estimateDbColumnReorderSource = null;
  if (typeof showToast === "function") showToast("ì´ ìì¹ ë³ê²½ ëª¨ëìëë¤. ì´ëí  í¤ëë¥¼ ëëê·¸í´ ë°ê¿ ìì¹ì ëê³  íì¸ì ëë¥´ì¸ì.");
  renderEstimateDbManage();
}
function confirmEstimateDbColumnReorder() {
  estimateDbColumnReorderMode = false;
  estimateDbColumnReorderSource = null;
  estimateDbColumnReorderPointerState = null;
  document.removeEventListener("mouseup", finishEstimateDbColumnReorderPointer, true);
  saveEstimateDbToStorage?.();
  if (typeof showToast === "function") showToast("ì´ ìì¹ ë³ê²½ì ì ì¥íìµëë¤.");
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

function updateEstimateDbMepQuickActions() {
  const wrap = document.getElementById("estimateDbMepQuickActions");
  const openBtn = document.getElementById("estimateDbMepQuickOpenBtn");
  if (!wrap) return;
  const isMep = estimateDbActiveTab === "mep";
  wrap.style.display = isMep ? "inline-flex" : "none";
  if (openBtn) {
    const selectedVendorName = getEstimateDbMepVendorName(getEstimateDbMepSelectedVendor());
    openBtn.disabled = !isMep || !selectedVendorName;
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
  updateEstimateDbMepQuickActions();
  updateEstimateDbSaveButtonState();
  const resizeBtn = document.getElementById("estimateDbColumnResizeBtn");
  if (resizeBtn) {
    resizeBtn.textContent = estimateDbColumnResizeMode ? "ì´ ì¡°ì  ì¢ë£" : "ì´ ëë¹ ì¡°ì íê¸°";
    resizeBtn.classList.toggle("active", estimateDbColumnResizeMode);
  }
  const reorderBtn = document.getElementById("estimateDbColumnReorderBtn");
  const reorderOkBtn = document.getElementById("estimateDbColumnReorderOkBtn");
  if (reorderBtn) {
    reorderBtn.textContent = estimateDbColumnReorderMode ? "ì´ ìì¹ ë³ê²½ ì¤" : "ì´ ìì¹ ë³ê²½";
    reorderBtn.classList.toggle("active", estimateDbColumnReorderMode);
  }
  if (reorderOkBtn) reorderOkBtn.style.setProperty("display", estimateDbColumnReorderMode ? "inline-flex" : "none", "important");
  bindEstimateDbColumnReorderOkButton();
  const rowHeightBtn = document.getElementById("estimateDbRowHeightBtn");
  if (rowHeightBtn) rowHeightBtn.textContent = `í ëì´ ${estimateDbRowHeightPx}px`;
  const contractBtn = document.getElementById("estimateDbAddContractAmountBtn");
  if (contractBtn) contractBtn.style.display = estimateDbActiveTab === "progress" ? "inline-flex" : "none";
  const stageBtn = document.getElementById("estimateDbAddStageBtn");
  if (stageBtn) stageBtn.textContent = `+ì°¨ì ì¶ê°(${ESTIMATE_DB_STAGE_ADD_SHORTCUT_LABEL})`;
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
        const sortMark = sort.colIndex === colIndex ? (sort.direction === "asc" ? " â²" : " â¼") : "";
        const reorderClass = estimateDbColumnReorderMode ? " reorder-mode" : "";
        const reorderAttrs = estimateDbColumnReorderMode
          ? `draggable="true" onmousedown="startEstimateDbColumnReorderPointer(event, ${colIndex})" ondragstart="startEstimateDbColumnReorder(event, ${colIndex})" ondragend="endEstimateDbColumnReorder(event)" ondragover="allowEstimateDbColumnDrop(event)" ondrop="dropEstimateDbColumn(event, ${colIndex})" onclick="event.preventDefault(); event.stopPropagation();" title="í¤ëë¥¼ ì¢í´ë¦­ ëëê·¸í´ì ë°ê¿ ì´ ìì¹ì ëì¼ë©´ ë ì´ì´ ìë¡ ë°ëëë¤."`
          : `onclick="toggleEstimateDbSort(${colIndex})" title="í´ë¦­íë©´ ì¤ë¦ì°¨ì/ë´ë¦¼ì°¨ì ì ë ¬ë©ëë¤."`;
        return `<th ${makeEstimateDbCellStyle(colIndex, sheet)} data-resize-col="${colIndex}" data-col-index="${colIndex}" class="quote-db-sortable-head ${estimateDbColumnResizeMode ? "resize-mode" : ""}${reorderClass}${getEstimateDbContactDetailClass(estimateDbActiveTab, colIndex)}${getEstimateDbScreenHiddenClass(estimateDbActiveTab, colIndex)}${getEstimateDbColumnVisualClass(estimateDbActiveTab, colIndex)}${getEstimateDbGroupBoundaryClass(estimateDbActiveTab, colIndex, sheet)}" ${reorderAttrs}><span class="quote-db-head-label">${escapeEstimateDbHtml((col || "") + sortMark).replace(/\n/g, "<br>")}</span>${renderEstimateDbColumnResizeHandle(colIndex)}</th>`;
      }).join("")}
      <th class="quote-db-manage-col">ê´ë¦¬</th>
    </tr>
  `;
  const allEntries = getEstimateDbDisplayRowEntries(sheet, estimateDbActiveTab);
  const paged = getEstimateDbPagedEntries(allEntries, estimateDbActiveTab);
  const entries = paged.entries;
  recalcEstimateDbVisibleRows(estimateDbActiveTab, entries);
  const totalRow = renderEstimateDbTotalRow(sheet, colCount);
  body.innerHTML = totalRow + (entries.map(({ row, sourceIndex }) => renderEstimateDbRow(row, sourceIndex, colCount)).join("") || `<tr><td colspan="${colCount + 1}" class="empty-cell">ê²ì ì¡°ê±´ì ë§ë DB íì´ ììµëë¤.</td></tr>`);
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
      <td class="quote-db-total-label" colspan="4">í©ê³</td>
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
  return ["ê¸°ê³", "ì ê¸°", "ì¸ì£¼", "ì¡ë¬´", "ê¸°í"].includes(header);
}
function formatEstimateDbAmountCellDisplay(value) {
  const parsed = parseEstimateDbAmountCellValue(value);
  const amount = parsed.amount ? formatEstimateDbCommaNumber(parsed.amount) : "";
  if (parsed.company && amount) return `${parsed.company}
${amount}ì`;
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
    ? ["ìì¡", "ììëê¸°ì¤", "í©ê³", "ì¸ê¸ê³ì°ì", "ìê¸ìì ì¼", "ìê¸ì¼"]
    : estimateDbActiveTab === "mep"
      ? ["ìì¡", "ììëê¸°ì¤"]
      : estimateDbActiveTab === "pj"
        ? ["ì°ë©´ì (í)"]
        : [];
  if (!calculatedHeaders.length) return;
  cols.forEach((header, colIndex) => {
    const topHeader = sheet.headerRows?.[0]?.[colIndex] || "";
    const topText = normalizeEstimateDbText(topHeader).replace(/\s+/g, "");
    const isStageTotal = normalizeEstimateDbText(header) === "í©ê³" && /ì¸ê¸ê³ì°ì|ìê¸ìì ì¼|ìê¸ì¼/.test(String(topHeader));
    const isOutsourceTotal = estimateDbActiveTab === "progress" && normalizeEstimateDbText(header) === "í©ê³" && topText.includes("ì¸ì£¼ê¸ì¡");
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

  // DBê´ë¦¬ ë´ ê¸ì¡ì± ì»¬ë¼ì ìë ¥ ì¤ìë 3ìë¦¬ ì½¤ë§ë¥¼ ì¦ì ë°ìí©ëë¤.
  // ì: 400000 -> 400,000 / 100000 -> 100,000
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
        const wrapTextCell = isEstimateDbColumnHeaderMatch(estimateDbActiveTab, colIndex, ["íë¡ì í¸ëª", "ê±°ëì²ëª"]);
        if (isEstimateDbProgressDoneColumn(estimateDbActiveTab, colIndex)) {
          const done = parseEstimateDbProgressDoneValue(value);
          return `<td ${makeEstimateDbCellStyle(colIndex, sheet)} data-resize-col="${colIndex}" class="quote-db-done-cell${cellExtraClass}${boundaryClass}"><label class="quote-db-done-box"><input type="checkbox" ${done.checked ? "checked" : ""} onchange="toggleEstimateDbProgressDone(event, ${rowIndex}, ${colIndex})" onfocus="selectEstimateDbCell(${rowIndex}, ${colIndex})" /><span>ìë£</span></label><div class="quote-db-done-history">${escapeEstimateDbHtml(done.history || "")}</div></td>`;
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
      <td class="quote-db-manage-col"><button class="btn btn-line btn-xs" type="button" onclick="removeEstimateDbRow(${rowIndex})">ì­ì </button></td>
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

  // ê¸°ì±ì²­êµ¬ìë£ ì²´í¬ë°ì¤ë ê³ì°/ì ë ¬/ì°ê³ ëìì´ ìë ìíê°ìëë¤.
  // ê¸°ì¡´ì²ë¼ renderEstimateDbManage()ë¥¼ ë¤ì í¸ì¶íë©´ 60ê° ì´ì ì»¬ë¼ì ê¸°ì±ê´ë¦¬ ì ì²´ í,
  // í©ê³í, ë¦¬í¬í¸ê° ëª¨ë ì¬ìì±ëì´ ì²´í¬ í ë²ìë ë¡ë©ì´ ë°ìí©ëë¤.
  // ë°ë¼ì í´ë¹ ì ê°ê³¼ íì¬ íì ìë£ íìë§ ì¦ì ê°±ì í©ëë¤.
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
  const clientIndex = columns.findIndex(c => normalizeEstimateDbText(c) === "ê±°ëì²ëª");
  const projectNameIndex = columns.findIndex(c => normalizeEstimateDbText(c) === "íë¡ì í¸ëª");
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

  // íë¡ì í¸ ì°ê²°ì ê¸°ì¡´ íë¡ì í¸ì íì¬ ì¶ê°ê³ì½/íìê³ì½ íì ë¬¶ë ì°¸ì¡°ê°ìëë¤.
  // ìì£¼ê¸ì¡, ììì¼ì, ë´ë¹ì ë± íì¬ íì ê³ì½ ì ë³´ë ì¶ê°ê³ì½ ìì  ê¸°ì¤ì¼ë¡ ë³ë ê´ë¦¬í´ì¼ íë¯ë¡
  // ê¸°ì¡´ íë¡ì í¸ íì ê°ì ë³µì¬íì§ ìê³  ì°ê²° PJ NOë§ ì ì¥í©ëë¤.
  const linkValue = selected ? selected.pjNo : normalizeEstimateDbText(selectedLabel);
  if (linkIndex >= 0) {
    while (target.length <= linkIndex) target.push("");
    target[linkIndex] = linkValue || "";
  }
  recalcEstimateDbRow("pj", target);
  return Boolean(linkValue);
}

let estimateDbContactDetailsCollapsed = false;

const ESTIMATE_DB_CONTACT_VISIBLE_HEADER = "ê±°ëì²";
const ESTIMATE_DB_CONTACT_HIDDEN_HEADERS = ["ê±°ëì²ë´ë¹ì", "ì§ê¸", "ì¼ë°ì í", "í´ëí°", "ì§íµì í", "EMAIL", "EMAIL2", "ì¹íë", "ID", "PW", "ê¸°í"];
const ESTIMATE_DB_PJ_SCREEN_HIDDEN_HEADERS = ["ì ìë²í¸"];

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
  // ê±°ëì² ì¸ë¶ì ë³´ë íë©´ììë ì¨ê¸°ê³ , ê±°ëì² ì Enter íìê³¼ ìì ë´ë³´ë´ê¸°ììë§ ì¬ì©í©ëë¤.
  estimateDbContactDetailsCollapsed = true;
  renderEstimateDbManage();
}

const ESTIMATE_DB_CONTACT_HEADERS = ["ê±°ëì²", "ê±°ëì²ë´ë¹ì", "ì§ê¸", "ì¼ë°ì í", "í´ëí°", "ì§íµì í", "EMAIL", "EMAIL2", "ì¹íë", "ID", "PW", "ê¸°í"];
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
    dept: idx["ê±°ëì²"] >= 0 ? row[idx["ê±°ëì²"]] || "" : "",
    name: idx["ê±°ëì²ë´ë¹ì"] >= 0 ? row[idx["ê±°ëì²ë´ë¹ì"]] || "" : "",
    role: idx["ì§ê¸"] >= 0 ? row[idx["ì§ê¸"]] || "" : "",
    tel: idx["ì¼ë°ì í"] >= 0 ? row[idx["ì¼ë°ì í"]] || "" : "",
    mobile: idx["í´ëí°"] >= 0 ? row[idx["í´ëí°"]] || "" : "",
    direct: idx["ì§íµì í"] >= 0 ? row[idx["ì§íµì í"]] || "" : "",
    email: idx["EMAIL"] >= 0 ? row[idx["EMAIL"]] || "" : "",
    email2: idx["EMAIL2"] >= 0 ? row[idx["EMAIL2"]] || "" : "",
    webhard: idx["ì¹íë"] >= 0 ? row[idx["ì¹íë"]] || "" : "",
    id: idx["ID"] >= 0 ? row[idx["ID"]] || "" : "",
    pw: idx["PW"] >= 0 ? row[idx["PW"]] || "" : "",
    etc: idx["ê¸°í"] >= 0 ? row[idx["ê¸°í"]] || "" : "",
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
    "ê±°ëì²": first.dept || "",
    "ê±°ëì²ë´ë¹ì": clean.length > 1 && first.name ? `${first.name} ì¸ ${clean.length - 1}ëª` : (first.name || ""),
    "ì§ê¸": first.role || "",
    "ì¼ë°ì í": first.tel || "",
    "í´ëí°": first.mobile || "",
    "ì§íµì í": first.direct || "",
    "EMAIL": first.email || "",
    "EMAIL2": first.email2 || "",
    "ì¹íë": first.webhard || "",
    "ID": first.id || "",
    "PW": first.pw || "",
    "ê¸°í": first.etc || ""
  };
  Object.entries(valueMap).forEach(([name, value]) => {
    if (idx[name] >= 0) row[idx[name]] = value;
  });
}


let estimateDbAccountModalState = null;

function parseEstimateDbAccountCellValue(value) {
  const rich = parseEstimateDbRichCellValue(value);
  if (rich?.type === "accountInfo") {
    return {
      summary: String(rich.summary || ""),
      accounts: Array.isArray(rich.accounts) ? rich.accounts.map(item => ({
        bank: String(item?.bank || ""),
        account: String(item?.account || ""),
        holder: String(item?.holder || ""),
        memo: String(item?.memo || "")
      })) : []
    };
  }
  const raw = normalizeEstimateDbText(value);
  return { summary: raw, accounts: raw ? [{ bank: "", account: raw, holder: "", memo: "" }] : [] };
}

function summarizeEstimateDbAccountInfo(accounts = []) {
  const filled = (accounts || []).filter(item => normalizeEstimateDbText(item.bank) || normalizeEstimateDbText(item.account) || normalizeEstimateDbText(item.holder) || normalizeEstimateDbText(item.memo));
  if (!filled.length) return "";
  return filled.map(item => [item.bank, item.account].filter(Boolean).join(" ")).filter(Boolean).join(" / ") || `${filled.length}ê° ê³ì¢`;
}

function ensureEstimateDbAccountModal() {
  let modal = document.getElementById("estimateDbAccountModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbAccountModal";
  modal.className = "estimate-db-dropdown-modal hidden estimate-db-account-modal";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box estimate-db-account-box" role="dialog" aria-modal="true">
      <div class="estimate-db-dropdown-title">ê³ì¢ì ë³´ ìë ¥</div>
      <div class="estimate-db-contact-help">ê¸°ì±ê´ë¦¬ì ê³ì¢ì ë³´ ììì Enterë¥¼ ëë¥´ë©´ ì´ë¦½ëë¤. ì¬ë¬ ê³ì¢ë¥¼ ìë ¥í  ì ìì¼ë©°, íìë ìíëªê³¼ ê³ì¢ë²í¸ ìì½ì´ íìë©ëë¤.</div>
      <div class="estimate-db-contact-grid-wrap">
        <table class="estimate-db-contact-grid estimate-db-account-grid">
          <thead>
            <tr><th>No</th><th>ìíëª</th><th>ê³ì¢ë²í¸</th><th>ìê¸ì£¼</th><th>ë¹ê³ </th></tr>
          </thead>
          <tbody id="estimateDbAccountRows"></tbody>
        </table>
      </div>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="addEstimateDbAccountModalRow()">+ ê³ì¢ ì¶ê°</button>
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbAccountModal()">ë«ê¸°</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbAccountModal()">ê³ì¢ì ë³´ ì ì¥</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("mousedown", event => { if (event.target === modal) closeEstimateDbAccountModal(); });
  modal.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); closeEstimateDbAccountModal(); }
  });
  return modal;
}

function renderEstimateDbAccountModalRows(accounts = []) {
  const modal = ensureEstimateDbAccountModal();
  const body = modal.querySelector("#estimateDbAccountRows");
  const rows = accounts.length ? accounts : Array.from({ length: 3 }, () => ({}));
  body.innerHTML = rows.map((account, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><input data-account-field="bank" data-account-index="${index}" value="${escapeEstimateDbHtml(account.bank || "")}" onkeydown="handleEstimateDbAccountModalKeydown(event)" /></td>
      <td><input data-account-field="account" data-account-index="${index}" value="${escapeEstimateDbHtml(account.account || "")}" onkeydown="handleEstimateDbAccountModalKeydown(event)" /></td>
      <td><input data-account-field="holder" data-account-index="${index}" value="${escapeEstimateDbHtml(account.holder || "")}" onkeydown="handleEstimateDbAccountModalKeydown(event)" /></td>
      <td><input data-account-field="memo" data-account-index="${index}" value="${escapeEstimateDbHtml(account.memo || "")}" onkeydown="handleEstimateDbAccountModalKeydown(event)" /></td>
    </tr>
  `).join("");
}

function collectEstimateDbAccountModalRows() {
  const modal = ensureEstimateDbAccountModal();
  const rows = [];
  modal.querySelectorAll("#estimateDbAccountRows tr").forEach((tr, index) => {
    const item = {};
    tr.querySelectorAll("input[data-account-field]").forEach(input => {
      item[input.dataset.accountField] = input.value || "";
    });
    if (Object.values(item).some(v => normalizeEstimateDbText(v))) rows[index] = item;
  });
  return rows.filter(Boolean);
}

function addEstimateDbAccountModalRow() {
  const accounts = collectEstimateDbAccountModalRows();
  accounts.push({});
  renderEstimateDbAccountModalRows(accounts);
  setTimeout(() => document.querySelector(`#estimateDbAccountRows tr:nth-child(${accounts.length}) input`)?.focus(), 0);
}

function handleEstimateDbAccountModalKeydown(event) {
  const input = event.currentTarget;
  const row = input.closest("tr");
  const inputs = Array.from(document.querySelectorAll("#estimateDbAccountRows input[data-account-field]"));
  const index = inputs.indexOf(input);
  if (event.key === "Enter") {
    event.preventDefault();
    const next = inputs[index + 1];
    if (next) next.focus();
    else addEstimateDbAccountModalRow();
    return;
  }
  const cols = row ? row.querySelectorAll("input[data-account-field]").length : 4;
  const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cols, ArrowDown: cols };
  if (map[event.key]) {
    event.preventDefault();
    const next = inputs[index + map[event.key]];
    if (next) next.focus();
  }
}

function openEstimateDbAccountModal(rowIndex, colIndex) {
  if (!isEstimateDbAccountInfoCell(estimateDbActiveTab, colIndex)) return false;
  commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
  const row = getEstimateDbRows()?.[rowIndex];
  const parsed = parseEstimateDbAccountCellValue(row?.[colIndex] || "");
  estimateDbAccountModalState = { tab: estimateDbActiveTab, rowIndex, colIndex };
  const modal = ensureEstimateDbAccountModal();
  renderEstimateDbAccountModalRows(parsed.accounts || []);
  modal.classList.remove("hidden");
  setTimeout(() => modal.querySelector("#estimateDbAccountRows input")?.focus(), 0);
  return true;
}

function closeEstimateDbAccountModal() {
  document.getElementById("estimateDbAccountModal")?.classList.add("hidden");
  const state = estimateDbAccountModalState;
  estimateDbAccountModalState = null;
  if (state) requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}

function saveEstimateDbAccountModal() {
  const state = estimateDbAccountModalState;
  if (!state) return;
  const accounts = collectEstimateDbAccountModalRows();
  const summary = summarizeEstimateDbAccountInfo(accounts);
  const value = stringifyEstimateDbRichCellValue({ type: "accountInfo", summary, accounts });
  updateEstimateDbCell(state.rowIndex, state.colIndex, value, { commit: true, silentRender: true });
  showToast('ê³ì¢ ì ë³´ê° ì ì¥ëììµëë¤.');
  closeEstimateDbAccountModal();
  renderEstimateDbManage();
  requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}


let estimateDbBillingClientModalState = null;
let estimateDbBillingManagerModalState = null;

function isEstimateDbProgressBillingClientColumn(tab = estimateDbActiveTab, colIndex = 0) {
  return tab === "progress" && normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex)) === "ê±°ëì²ê¸°ì±ë´ë¹ì";
}
function isEstimateDbProgressBillingManagerColumn(tab = estimateDbActiveTab, colIndex = 0) {
  return tab === "progress" && normalizeEstimateDbText(getEstimateDbColumnName(tab, colIndex)) === "ê¸°ì±ë´ë¹ì";
}
function parseEstimateDbBillingClientContactValue(value) {
  const rich = parseEstimateDbRichCellValue(value);
  if (rich?.type === "progressBillingClientContact") {
    return { summary: String(rich.summary || ""), contacts: Array.isArray(rich.contacts) ? rich.contacts.map(item => ({ name: String(item?.name || ""), position: String(item?.position || ""), mobile: String(item?.mobile || "") })) : [] };
  }
  const raw = normalizeEstimateDbText(value);
  return { summary: raw, contacts: raw ? [{ name: raw, position: "", mobile: "" }] : [] };
}
function summarizeEstimateDbBillingClientContacts(contacts = []) {
  const filled = (contacts || []).filter(item => normalizeEstimateDbText(item.name) || normalizeEstimateDbText(item.position) || normalizeEstimateDbText(item.mobile));
  if (!filled.length) return "";
  return filled.map(item => [item.name, item.position, item.mobile].filter(Boolean).join(" / ")).join(" | ");
}
function ensureEstimateDbBillingClientModal() {
  let modal = document.getElementById("estimateDbBillingClientModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbBillingClientModal";
  modal.className = "estimate-db-dropdown-modal hidden estimate-db-billing-client-modal";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box estimate-db-billing-client-box" role="dialog" aria-modal="true">
      <div class="estimate-db-dropdown-title">ê±°ëì² ê¸°ì±ë´ë¹ì ìë ¥</div>
      <div class="estimate-db-contact-help">ì´ë¦, ì§ì, í´ëì íë¥¼ ìë ¥í©ëë¤. ì¬ë¬ ë´ë¹ìë¥¼ ìë ¥í  ì ìì¼ë©°, íìë 3ê°ì§ ì ë³´ê° í ì¤ ìì½ì¼ë¡ íìë©ëë¤.</div>
      <div class="estimate-db-contact-grid-wrap">
        <table class="estimate-db-contact-grid estimate-db-billing-client-grid">
          <thead><tr><th>No</th><th>ì´ë¦</th><th>ì§ì</th><th>í´ëì í</th></tr></thead>
          <tbody id="estimateDbBillingClientRows"></tbody>
        </table>
      </div>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="addEstimateDbBillingClientModalRow()">+ ë´ë¹ì ì¶ê°</button>
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbBillingClientModal()">ë«ê¸°</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbBillingClientModal()">ë´ë¹ì ì ì¥</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("mousedown", event => { if (event.target === modal) closeEstimateDbBillingClientModal(); });
  modal.addEventListener("keydown", event => { if (event.key === "Escape") { event.preventDefault(); closeEstimateDbBillingClientModal(); } });
  return modal;
}
function renderEstimateDbBillingClientModalRows(contacts = []) {
  const modal = ensureEstimateDbBillingClientModal();
  const body = modal.querySelector("#estimateDbBillingClientRows");
  const rows = contacts.length ? contacts : Array.from({ length: 3 }, () => ({}));
  body.innerHTML = rows.map((contact, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><input data-billing-client-field="name" data-billing-client-index="${index}" value="${escapeEstimateDbHtml(contact.name || "")}" onkeydown="handleEstimateDbBillingClientModalKeydown(event)" /></td>
      <td><input data-billing-client-field="position" data-billing-client-index="${index}" value="${escapeEstimateDbHtml(contact.position || "")}" onkeydown="handleEstimateDbBillingClientModalKeydown(event)" /></td>
      <td><input data-billing-client-field="mobile" data-billing-client-index="${index}" value="${escapeEstimateDbHtml(contact.mobile || "")}" onkeydown="handleEstimateDbBillingClientModalKeydown(event)" /></td>
    </tr>`).join("");
}
function collectEstimateDbBillingClientModalRows() {
  const modal = ensureEstimateDbBillingClientModal();
  const rows = [];
  modal.querySelectorAll("#estimateDbBillingClientRows tr").forEach((tr, index) => {
    const item = {};
    tr.querySelectorAll("input[data-billing-client-field]").forEach(input => { item[input.dataset.billingClientField] = input.value || ""; });
    if (Object.values(item).some(v => normalizeEstimateDbText(v))) rows[index] = item;
  });
  return rows.filter(Boolean);
}
function addEstimateDbBillingClientModalRow() {
  const contacts = collectEstimateDbBillingClientModalRows();
  contacts.push({ name: "", position: "", mobile: "" });
  renderEstimateDbBillingClientModalRows(contacts);
  setTimeout(() => ensureEstimateDbBillingClientModal().querySelector(`input[data-billing-client-index="${contacts.length - 1}"][data-billing-client-field="name"]`)?.focus(), 0);
}
function handleEstimateDbBillingClientModalKeydown(event) {
  if (event.key === "Escape") { event.preventDefault(); closeEstimateDbBillingClientModal(); return; }
  if (event.key === "Enter") { event.preventDefault(); saveEstimateDbBillingClientModal(); return; }
  const map = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] };
  if (!map[event.key]) return;
  event.preventDefault();
  const fields = ["name", "position", "mobile"];
  const input = event.currentTarget;
  const rowIndex = Number(input.dataset.billingClientIndex || 0);
  const fieldIndex = fields.indexOf(input.dataset.billingClientField);
  const [dr, dc] = map[event.key];
  const nextRow = Math.max(0, rowIndex + dr);
  const nextField = Math.max(0, Math.min(fields.length - 1, fieldIndex + dc));
  ensureEstimateDbBillingClientModal().querySelector(`input[data-billing-client-index="${nextRow}"][data-billing-client-field="${fields[nextField]}"]`)?.focus();
}
function openEstimateDbBillingClientModal(rowIndex = estimateDbSelectedCell.rowIndex || 0, colIndex = estimateDbSelectedCell.colIndex || 0) {
  if (!isEstimateDbProgressBillingClientColumn(estimateDbActiveTab, colIndex)) return false;
  commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
  const row = getEstimateDbRows()?.[rowIndex] || [];
  const parsed = parseEstimateDbBillingClientContactValue(row[colIndex]);
  estimateDbBillingClientModalState = { tab: estimateDbActiveTab, rowIndex, colIndex };
  renderEstimateDbBillingClientModalRows(parsed.contacts || []);
  const modal = ensureEstimateDbBillingClientModal();
  modal.classList.remove("hidden");
  setTimeout(() => modal.querySelector('input[data-billing-client-field="name"]')?.focus(), 0);
  return true;
}
function closeEstimateDbBillingClientModal() {
  document.getElementById("estimateDbBillingClientModal")?.classList.add("hidden");
  const state = estimateDbBillingClientModalState;
  estimateDbBillingClientModalState = null;
  if (state) requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}
function saveEstimateDbBillingClientModal() {
  const state = estimateDbBillingClientModalState;
  if (!state) return;
  const contacts = collectEstimateDbBillingClientModalRows();
  const summary = summarizeEstimateDbBillingClientContacts(contacts);
  updateEstimateDbCell(state.rowIndex, state.colIndex, stringifyEstimateDbRichCellValue({ type: "progressBillingClientContact", summary, contacts }), { commit: true, silentRender: true });
  showToast('ì²­êµ¬ì² ì ë³´ê° ì ì¥ëììµëë¤.');
  closeEstimateDbBillingClientModal();
  renderEstimateDbManage();
  requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}
function getEstimateDbDefaultBillingManagers() {
  const fallback = [{ empNo: "CC-002", name: "ê°ëê· ", position: "ì¤ì¥", label: "ê°ëê· ì¤ì¥" }, { empNo: "CC-004", name: "ê¹íì", position: "ì ì", label: "ê¹íìì ì" }];
  try {
    const fromEmployees = ["ê°ëê· ", "ê¹íì"].map(name => {
      const emp = (typeof employees !== "undefined" && Array.isArray(employees)) ? employees.find(item => String(item?.name || item?.koreanName || "").includes(name)) : null;
      if (!emp) return null;
      const position = String(emp?.grade || emp?.position || "");
      return { empNo: String(emp?.empNo || emp?.id || ""), name: String(emp?.name || emp?.koreanName || name), position, label: `${String(emp?.name || emp?.koreanName || name)}${position}` };
    }).filter(Boolean);
    if (fromEmployees.length) return fromEmployees;
    if (typeof orgEmployeeSeed !== "undefined" && Array.isArray(orgEmployeeSeed)) {
      const mapped = ["ê°ëê· ", "ê¹íì"].map(name => {
        const emp = orgEmployeeSeed.find(item => String(item?.[1] || "").includes(name));
        if (!emp) return null;
        const position = String(emp?.[4] || emp?.[5] || "");
        return { empNo: String(emp?.[0] || ""), name: String(emp?.[1] || name), position, label: `${String(emp?.[1] || name)}${position}` };
      }).filter(Boolean);
      if (mapped.length) return mapped;
    }
  } catch (_) {}
  return fallback;
}
function parseEstimateDbBillingManagerValue(value) {
  const rich = parseEstimateDbRichCellValue(value);
  if (rich?.type === "progressBillingManager") {
    return { summary: String(rich.summary || ""), managers: Array.isArray(rich.managers) ? rich.managers.map(item => ({ empNo: String(item?.empNo || ""), name: String(item?.name || ""), position: String(item?.position || ""), label: String(item?.label || "") })) : [] };
  }
  const raw = normalizeEstimateDbText(value);
  return { summary: raw, managers: raw ? [{ empNo: "", name: raw, position: "", label: raw }] : [] };
}
function summarizeEstimateDbBillingManagers(managers = []) {
  const filled = (managers || []).filter(item => normalizeEstimateDbText(item.label) || normalizeEstimateDbText(item.name));
  if (!filled.length) return "";
  return filled.map(item => item.label || [item.name, item.position].filter(Boolean).join("")).filter(Boolean).join(", ");
}
function ensureEstimateDbBillingManagerModal() {
  let modal = document.getElementById("estimateDbBillingManagerModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbBillingManagerModal";
  modal.className = "estimate-db-dropdown-modal hidden estimate-db-billing-manager-modal";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box estimate-db-billing-manager-box" role="dialog" aria-modal="true">
      <div class="estimate-db-dropdown-title">ê¸°ì±ë´ë¹ì ì í</div>
      <div class="estimate-db-contact-help">ì¡°ì§ë/ì¸ì¬ì¹´ë ê¸°ì¤ ë´ë¹ìë¥¼ ì íí©ëë¤. ì°ë½ìì ì¼ ê¸°ì¤ ì´ë©ì¼ ìë¦¼ ì°ëì ìí´ ì§ìë²í¸ë í¨ê» ë³´ê´í©ëë¤.</div>
      <div id="estimateDbBillingManagerOptions" class="estimate-db-manager-option-list"></div>
      <div class="estimate-db-contact-help">ë´ë¹ì ì¶ê°ë ì´ë¦ë§ ê²ìí ë¤ ê²ìë ì¸ì¬ì¹´ëë¥¼ ì íí´ì ì¶ê°í©ëë¤. ì íí ì¸ì¬ì¹´ëì ì§ìë²í¸/ì§ì/ì´ë©ì¼ ì ë³´ê° í¨ê» ì°ê²°ë©ëë¤.</div>
      <div class="estimate-db-manager-search-row"><input id="estimateDbBillingManagerSearch" placeholder="ì´ë¦ ê²ì" autocomplete="off" oninput="renderEstimateDbBillingManagerSearchResults(this.value)" /><button type="button" class="btn btn-line btn-sm" onclick="addEstimateDbBillingManagerSearchActive()">+ ì¶ê°</button></div>
      <div id="estimateDbBillingManagerSearchResults" class="estimate-db-manager-search-results" aria-label="ì¸ì¬ì¹´ë ê²ì ê²°ê³¼"></div>
      <div class="estimate-db-dropdown-actions"><button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbBillingManagerModal()">ë«ê¸°</button><button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbBillingManagerModal()">ë´ë¹ì ì ì¥</button></div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("mousedown", event => { if (event.target === modal) closeEstimateDbBillingManagerModal(); });
  modal.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); closeEstimateDbBillingManagerModal(); return; }
    if (event.target?.matches?.("#estimateDbBillingManagerSearch")) {
      handleEstimateDbBillingManagerSearchKeydown(event);
      return;
    }
    handleEstimateDbBillingManagerModalKeydown(event);
  });
  return modal;
}
let estimateDbBillingManagerActiveIndex = 0;
function renderEstimateDbBillingManagerOptions(selectedManagers = []) {
  const modal = ensureEstimateDbBillingManagerModal();
  const body = modal.querySelector("#estimateDbBillingManagerOptions");
  const selectedLabels = new Set((selectedManagers || []).map(item => item.label || [item.name, item.position].filter(Boolean).join("")));
  const merged = [...getEstimateDbDefaultBillingManagers()];
  (selectedManagers || []).forEach(item => {
    const label = item.label || [item.name, item.position].filter(Boolean).join("");
    if (label && !merged.some(m => (m.label || [m.name, m.position].filter(Boolean).join("")) === label)) merged.push({ ...item, label });
  });
  body.innerHTML = merged.map((item, index) => {
    const label = item.label || [item.name, item.position].filter(Boolean).join("");
    const selected = selectedLabels.has(label) || (!selectedLabels.size && index === 0);
    const active = index === estimateDbBillingManagerActiveIndex;
    return `<button type="button" class="estimate-db-manager-option${selected ? " is-selected" : ""}${active ? " is-active" : ""}" data-manager-option="1" data-manager-index="${index}" data-selected="${selected ? "1" : "0"}" data-value="${escapeEstimateDbHtml(label)}" data-emp-no="${escapeEstimateDbHtml(item.empNo || "")}" data-name="${escapeEstimateDbHtml(item.name || "")}" data-position="${escapeEstimateDbHtml(item.position || "")}" onclick="selectEstimateDbBillingManagerOption(${index}, true)" ondblclick="confirmEstimateDbBillingManagerOption(${index})"><span class="estimate-db-manager-check">${selected ? "ì í" : ""}</span><strong>${escapeEstimateDbHtml(label)}</strong>${item.empNo ? `<em>${escapeEstimateDbHtml(item.empNo)}</em>` : ""}</button>`;
  }).join("");
  const options = Array.from(body.querySelectorAll('[data-manager-option="1"]'));
  if (options.length) {
    estimateDbBillingManagerActiveIndex = Math.max(0, Math.min(estimateDbBillingManagerActiveIndex, options.length - 1));
    options[estimateDbBillingManagerActiveIndex]?.classList.add("is-active");
  }
}
function getEstimateDbBillingManagerOptionButtons() {
  return Array.from(ensureEstimateDbBillingManagerModal().querySelectorAll('#estimateDbBillingManagerOptions [data-manager-option="1"]'));
}
function focusEstimateDbBillingManagerOption(index = 0) {
  const options = getEstimateDbBillingManagerOptionButtons();
  if (!options.length) return;
  estimateDbBillingManagerActiveIndex = Math.max(0, Math.min(index, options.length - 1));
  options.forEach((option, optionIndex) => option.classList.toggle("is-active", optionIndex === estimateDbBillingManagerActiveIndex));
  options[estimateDbBillingManagerActiveIndex]?.focus({ preventScroll: true });
  options[estimateDbBillingManagerActiveIndex]?.scrollIntoView({ block: "nearest" });
}
function selectEstimateDbBillingManagerOption(index = 0, toggle = false) {
  const options = getEstimateDbBillingManagerOptionButtons();
  if (!options.length) return;
  focusEstimateDbBillingManagerOption(index);
  const option = options[estimateDbBillingManagerActiveIndex];
  if (!option) return;
  if (toggle) {
    const nextSelected = option.dataset.selected !== "1";
    option.dataset.selected = nextSelected ? "1" : "0";
    option.classList.toggle("is-selected", nextSelected);
    option.querySelector(".estimate-db-manager-check").textContent = nextSelected ? "ì í" : "";
  }
}
function confirmEstimateDbBillingManagerOption(index = estimateDbBillingManagerActiveIndex) {
  const options = getEstimateDbBillingManagerOptionButtons();
  if (!options.length) return;
  focusEstimateDbBillingManagerOption(index);
  options.forEach((option, optionIndex) => {
    const selected = optionIndex === estimateDbBillingManagerActiveIndex;
    option.dataset.selected = selected ? "1" : "0";
    option.classList.toggle("is-selected", selected);
    option.querySelector(".estimate-db-manager-check").textContent = selected ? "ì í" : "";
  });
  saveEstimateDbBillingManagerModal();
}
function handleEstimateDbBillingManagerModalKeydown(event) {
  const isListKey = ["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(event.key);
  const targetIsAddInput = event.target?.matches?.("#estimateDbBillingManagerName,#estimateDbBillingManagerPosition");
  if (targetIsAddInput) return;
  if (!isListKey) return;
  event.preventDefault();
  event.stopPropagation();
  const options = getEstimateDbBillingManagerOptionButtons();
  if (!options.length) return;
  if (event.key === "ArrowDown") focusEstimateDbBillingManagerOption(estimateDbBillingManagerActiveIndex + 1);
  else if (event.key === "ArrowUp") focusEstimateDbBillingManagerOption(estimateDbBillingManagerActiveIndex - 1);
  else if (event.key === "Home") focusEstimateDbBillingManagerOption(0);
  else if (event.key === "End") focusEstimateDbBillingManagerOption(options.length - 1);
  else if (event.key === " ") selectEstimateDbBillingManagerOption(estimateDbBillingManagerActiveIndex, true);
  else if (event.key === "Enter") confirmEstimateDbBillingManagerOption(estimateDbBillingManagerActiveIndex);
}
let estimateDbBillingManagerSearchActiveIndex = 0;
function getEstimateDbHrEmployeeCards() {
  try {
    if (typeof employees !== "undefined" && Array.isArray(employees)) {
      return employees.map(emp => ({
        empNo: String(emp?.empNo || emp?.id || ""),
        name: String(emp?.name || emp?.koreanName || emp?.localName || ""),
        position: String(emp?.grade || emp?.position || ""),
        dept: String(emp?.dept || emp?.orgPath || ""),
        email: String(emp?.email || ""),
        phone: String(emp?.phone || "")
      })).filter(emp => normalizeEstimateDbText(emp.name));
    }
  } catch (_) {}
  return [];
}
function findEstimateDbHrEmployeeByName(name = "") {
  const keyword = normalizeEstimateDbText(name);
  if (!keyword) return null;
  return getEstimateDbHrEmployeeCards().find(emp => normalizeEstimateDbText(emp.name) === keyword)
    || getEstimateDbHrEmployeeCards().find(emp => normalizeEstimateDbText(emp.name).includes(keyword));
}
function getEstimateDbBillingManagerSearchMatches(query = "") {
  const keyword = normalizeEstimateDbText(query);
  if (!keyword) return [];
  return getEstimateDbHrEmployeeCards()
    .filter(emp => normalizeEstimateDbText(emp.name).includes(keyword))
    .slice(0, 12);
}
function renderEstimateDbBillingManagerSearchResults(query = "") {
  const modal = ensureEstimateDbBillingManagerModal();
  const box = modal.querySelector("#estimateDbBillingManagerSearchResults");
  if (!box) return;
  const matches = getEstimateDbBillingManagerSearchMatches(query);
  estimateDbBillingManagerSearchActiveIndex = Math.max(0, Math.min(estimateDbBillingManagerSearchActiveIndex, Math.max(matches.length - 1, 0)));
  if (!normalizeEstimateDbText(query)) {
    box.innerHTML = `<div class="estimate-db-manager-search-empty">ì´ë¦ì ìë ¥íë©´ ì¡°ì§ë/ì¸ì¬ì¹´ë ê²ì ê²°ê³¼ê° íìë©ëë¤.</div>`;
    return;
  }
  if (!matches.length) {
    box.innerHTML = `<div class="estimate-db-manager-search-empty">ê²ìë ì¸ì¬ì¹´ëê° ììµëë¤.</div>`;
    return;
  }
  box.innerHTML = matches.map((emp, index) => {
    const label = `${emp.name}${emp.position || ""}`;
    return `<button type="button" class="estimate-db-manager-search-item${index === estimateDbBillingManagerSearchActiveIndex ? " is-active" : ""}" data-manager-search-index="${index}" data-emp-no="${escapeEstimateDbHtml(emp.empNo)}" data-name="${escapeEstimateDbHtml(emp.name)}" data-position="${escapeEstimateDbHtml(emp.position)}" data-email="${escapeEstimateDbHtml(emp.email)}" data-label="${escapeEstimateDbHtml(label)}" onclick="addEstimateDbBillingManagerFromSearch(${index})"><strong>${escapeEstimateDbHtml(emp.name)}</strong><span>${escapeEstimateDbHtml(emp.position || "ì§ì ìì")}</span><em>${escapeEstimateDbHtml(emp.dept || emp.email || emp.empNo || "ì¸ì¬ì¹´ë")}</em></button>`;
  }).join("");
}
function focusEstimateDbBillingManagerSearchResult(index = 0) {
  const modal = ensureEstimateDbBillingManagerModal();
  const items = Array.from(modal.querySelectorAll("#estimateDbBillingManagerSearchResults [data-manager-search-index]"));
  if (!items.length) return;
  estimateDbBillingManagerSearchActiveIndex = Math.max(0, Math.min(index, items.length - 1));
  items.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === estimateDbBillingManagerSearchActiveIndex));
  items[estimateDbBillingManagerSearchActiveIndex]?.scrollIntoView({ block: "nearest" });
}
function addEstimateDbBillingManagerSearchActive() {
  addEstimateDbBillingManagerFromSearch(estimateDbBillingManagerSearchActiveIndex);
}
function addEstimateDbBillingManagerFromSearch(index = 0) {
  const modal = ensureEstimateDbBillingManagerModal();
  const items = Array.from(modal.querySelectorAll("#estimateDbBillingManagerSearchResults [data-manager-search-index]"));
  if (!items.length) return;
  const item = items[Math.max(0, Math.min(index, items.length - 1))];
  if (!item) return;
  const name = item.dataset.name || "";
  const position = item.dataset.position || "";
  const label = item.dataset.label || `${name}${position}`;
  const empNo = item.dataset.empNo || "";
  const body = modal.querySelector("#estimateDbBillingManagerOptions");
  const existing = Array.from(body.querySelectorAll('[data-manager-option="1"]')).find(option => (empNo && option.dataset.empNo === empNo) || option.dataset.value === label);
  if (existing) {
    existing.dataset.selected = "1";
    existing.classList.add("is-selected");
    existing.querySelector(".estimate-db-manager-check").textContent = "ì í";
    focusEstimateDbBillingManagerOption(Array.from(body.querySelectorAll('[data-manager-option="1"]')).indexOf(existing));
  } else {
    const optionIndex = body.querySelectorAll('[data-manager-option="1"]').length;
    body.insertAdjacentHTML("beforeend", `<button type="button" class="estimate-db-manager-option is-selected" data-manager-option="1" data-manager-index="${optionIndex}" data-selected="1" data-value="${escapeEstimateDbHtml(label)}" data-emp-no="${escapeEstimateDbHtml(empNo)}" data-name="${escapeEstimateDbHtml(name)}" data-position="${escapeEstimateDbHtml(position)}" onclick="selectEstimateDbBillingManagerOption(${optionIndex}, true)" ondblclick="confirmEstimateDbBillingManagerOption(${optionIndex})"><span class="estimate-db-manager-check">ì í</span><strong>${escapeEstimateDbHtml(label)}</strong>${empNo ? `<em>${escapeEstimateDbHtml(empNo)}</em>` : ""}</button>`);
    focusEstimateDbBillingManagerOption(optionIndex);
  }
  const searchInput = modal.querySelector("#estimateDbBillingManagerSearch");
  if (searchInput) searchInput.value = "";
  renderEstimateDbBillingManagerSearchResults("");
  setTimeout(() => searchInput?.focus(), 0);
}
function handleEstimateDbBillingManagerSearchKeydown(event) {
  const modal = ensureEstimateDbBillingManagerModal();
  const items = Array.from(modal.querySelectorAll("#estimateDbBillingManagerSearchResults [data-manager-search-index]"));
  if (["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (event.key === "ArrowDown") focusEstimateDbBillingManagerSearchResult(estimateDbBillingManagerSearchActiveIndex + 1);
  else if (event.key === "ArrowUp") focusEstimateDbBillingManagerSearchResult(estimateDbBillingManagerSearchActiveIndex - 1);
  else if (event.key === "Enter") addEstimateDbBillingManagerFromSearch(items.length ? estimateDbBillingManagerSearchActiveIndex : 0);
}
function collectEstimateDbBillingManagerModalRows() {
  return Array.from(ensureEstimateDbBillingManagerModal().querySelectorAll('[data-manager-option="1"][data-selected="1"]')).map(option => ({ empNo: option.dataset.empNo || "", name: option.dataset.name || "", position: option.dataset.position || "", label: option.dataset.value || "" })).filter(item => normalizeEstimateDbText(item.label));
}
function openEstimateDbBillingManagerModal(rowIndex = estimateDbSelectedCell.rowIndex || 0, colIndex = estimateDbSelectedCell.colIndex || 0) {
  if (!isEstimateDbProgressBillingManagerColumn(estimateDbActiveTab, colIndex)) return false;
  commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
  const row = getEstimateDbRows()?.[rowIndex] || [];
  const parsed = parseEstimateDbBillingManagerValue(row[colIndex]);
  estimateDbBillingManagerModalState = { tab: estimateDbActiveTab, rowIndex, colIndex };
  estimateDbBillingManagerActiveIndex = 0;
  renderEstimateDbBillingManagerOptions(parsed.managers || []);
  renderEstimateDbBillingManagerSearchResults("");
  const modal = ensureEstimateDbBillingManagerModal();
  const searchInput = modal.querySelector("#estimateDbBillingManagerSearch");
  if (searchInput) searchInput.value = "";
  modal.classList.remove("hidden");
  setTimeout(() => focusEstimateDbBillingManagerOption(estimateDbBillingManagerActiveIndex), 0);
  return true;
}
function closeEstimateDbBillingManagerModal() {
  document.getElementById("estimateDbBillingManagerModal")?.classList.add("hidden");
  const state = estimateDbBillingManagerModalState;
  estimateDbBillingManagerModalState = null;
  if (state) requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
}
function saveEstimateDbBillingManagerModal() {
  const state = estimateDbBillingManagerModalState;
  if (!state) return;
  const managers = collectEstimateDbBillingManagerModalRows();
  const summary = summarizeEstimateDbBillingManagers(managers);
  updateEstimateDbCell(state.rowIndex, state.colIndex, stringifyEstimateDbRichCellValue({ type: "progressBillingManager", summary, managers }), { commit: true, silentRender: true });
  showToast('ë´ë¹ ì ë³´ê° ì ì¥ëììµëë¤.');
  closeEstimateDbBillingManagerModal();
  renderEstimateDbManage();
  requestAnimationFrame(() => focusEstimateDbCell(state.rowIndex, state.colIndex));
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
      <div class="estimate-db-dropdown-title">ê±°ëì² / ë´ë¹ì / ì¹íë ê´ë¦¬</div>
      <div class="estimate-db-contact-help">ê±°ëì² ììì Enterë¥¼ ëë¥´ë©´ ì´ë¦½ëë¤. íë©´ììë ê±°ëì²ë§ íìíê³ , ë´ë¹ìÂ·ì°ë½ì²Â·ì¹íëÂ·IDÂ·PWÂ·ê¸°íë ì´ ì°½ê³¼ ìì ë´ë³´ë´ê¸°ìì ê´ë¦¬í©ëë¤.</div>
      <div class="estimate-db-contact-grid-wrap">
        <table class="estimate-db-contact-grid">
          <thead>
            <tr><th>No</th><th>ê±°ëì²</th><th>ë´ë¹ì</th><th>ì§ê¸</th><th>ì¼ë°ì í</th><th>í´ëí°</th><th>ì§íµì í</th><th>EMAIL</th><th>EMAIL2</th><th>ì¹íë</th><th>ID</th><th>PW</th><th>ê¸°í</th><th>ë¹ê³ </th></tr>
          </thead>
          <tbody id="estimateDbContactRows"></tbody>
        </table>
      </div>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbContactModal()">ë«ê¸°</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbContactModal()">ê±°ëì² ì ë³´ ì ì¥</button>
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
  showToast('ë´ë¹ì ì ë³´ê° ì ì¥ëììµëë¤.');
  closeEstimateDbContactModal();
  renderEstimateDbManage();
}

function isEstimateDbDropdownCell(tab, colIndex) {
  const request = getEstimateDbColumnRequest(tab, colIndex);
  const header = getEstimateDbColumnName(tab, colIndex);
  if (tab === "pj" && header === "PM(ì² ê±°)") return false;
  if (isEstimateDbContactColumn(tab, colIndex)) return true;
  return isEstimateDbProjectLinkColumn(tab, colIndex) || /ëë¡­ë¤ì´|ëë¶ë¥|ìë¶ë¥|ì¶ê° ê°ë¥|ì í/i.test(request) || ["êµ­ë´/í´ì¸", "ê±°ëì²ëª", "ììê³µì¢", "ììêµ¬ë¶", "ìë¬´ì±ê²©", "ìë¬´ë¨ê³2", "ë¨ê°ììì¬ë¶", "ê±´ë¬¼ì©ë"].includes(header);
}
function getEstimateDbUniqueColumnValues(tab, colIndex) {
  const sheet = estimateDbSheets[tab] || estimateDbSheets.pj;
  const values = new Set();
  (sheet.rows || []).forEach(row => {
    const value = normalizeEstimateDbText(row?.[colIndex]);
    if (value && !/^[-ââ]$/.test(value)) values.add(value);
  });
  return [...values];
}
const estimateDbUnitWorkOptions = ["ê³µë´ì­ì", "ë¹êµë´ì­ì", "ì¤ê³ìê°", "ë¨ê°ìì", "ê¸°í"];
function isEstimateDbUnitWorkOnlyValue(value = "") {
  return estimateDbUnitWorkOptions.includes(normalizeEstimateDbText(value));
}
function sanitizeEstimateDbUnitWorkValue(value = "") {
  const clean = normalizeEstimateDbText(value);
  return isEstimateDbUnitWorkOnlyValue(clean) ? clean : "";
}
const estimateDbDefaultOptions = {
  "êµ­ë´/í´ì¸": ["êµ­ë´", "í´ì¸"],
  "ììê³µì¢": ["ë§ê°", "ê³¨ì¡°ì±", "êµ¬ì¡°", "í ëª©", "ì¡°ê²½", "ê¸°ê³", "ì ê¸°", "ì¸íë¦¬ì´", "ì² ê±°"],
  "ììêµ¬ë¶": ["ì¤í", "ìì°°"],
  "ìë¬´ì±ê²©": ["ê°ì°ê²¬ì ", "ì ë¯¸ê²¬ì ", "ê³µì¬ë¹ê²ì¦", "í´ë ì", "ì¤ê³ê°", "ì¤ê³ë³ê²½", "ë³¸ì¬ ìì°°", "ë³¸ì¬ ì¤í", "íì¥ ì¤í", "ê¸°í"],
  "ë¨ê°ììì¬ë¶": estimateDbUnitWorkOptions,
  "ê±´ë¬¼ì©ë": ["ì°½ê³ ", "ê³µì¥", "ì ì½ê³µì¥", "ìíê³µì¥", "ë°ëì²´ê³µì¥", "ë¬¼ë¥ì¼í°", "ìíí¸íê³µì¥", "ê³µëì£¼í", "ì¤í¼ì¤í", "ì£¼ìë³µí©", "ìë¬´ìì¤", "ì¤í¼ì¤", "ê·¼ë¦°ìíìì¤", "ì§ìì°ìì¼í°", "ê¸°ìì¬", "ì°ìì", "íêµ", "êµì¡ì°êµ¬ìì¤", "ì°êµ¬ì", "ì­ì¬"]
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


function isEstimateDbWorkScopeOnlyValue(value = "") {
  const clean = normalizeEstimateDbText(value);
  return ["ë§ê°", "ê³¨ì¡°ì±", "êµ¬ì¡°", "í ëª©", "ì¡°ê²½", "ê¸°ê³", "ì ê¸°", "ì¸íë¦¬ì´", "ì² ê±°", "ì ê³µì "].includes(clean);
}
function sanitizeEstimateDbWorkScopeValue(value = "") {
  return String(value || "")
    .split(/[,ãï¼\/]+/)
    .map(v => normalizeEstimateDbText(v))
    .filter(v => v && isEstimateDbWorkScopeOnlyValue(v))
    .join(", ");
}

const estimateDbLinkedStageOptions = {
  "ê°ì°ê²¬ì ": ["1íì°¨", "2íì°¨", "3íì°¨", "ê¸°í"],
  "ì ë¯¸ê²¬ì ": ["ì ì¤í", "ë³¸ì¤í", "ê¸°í"],
  "ê³µì¬ë¹ê²ì¦": ["ë³ê²½ì ", "ë³ê²½í", "ë³ê²½ëì", "ê¸°í"],
  "í´ë ì": ["ì¬ê°ì ", "ë³¸ê°ì ", "ì¬ê°ì ", "ê¸°í"],
  "ì¤ê³ê°": ["ê¸°ë³¸", "ì¤ì", "ìì", "ëì", "ê¸°í"],
  "ì¤ê³ë³ê²½": ["ë³ê²½ì ", "ë³ê²½í", "ë³ê²½ëì", "ê¸°í"],
  "ë³¸ì¬ ìì°°": ["1íì°¨", "2íì°¨", "ê¸°í"],
  "ë³¸ì¬ ì¤í": ["1íì°¨", "2íì°¨", "ê¸°í"],
  "íì¥ ì¤í": ["1íì°¨", "2íì°¨", "ê¸°í"],
  "ê¸°í": ["ê¸°í"]
};
function getEstimateDbDropdownOptions(tab, rowIndex, colIndex) {
  const header = getEstimateDbColumnName(tab, colIndex);
  const sheet = estimateDbSheets[tab] || estimateDbSheets.pj;
  const custom = estimateDbCustomOptions[getEstimateDbCustomOptionKey(tab, colIndex)] || [];
  let options = [];
  if (tab === "pj" && header === ESTIMATE_DB_PROJECT_LINK_HEADER) {
    options = getEstimateDbProjectLinkOptions(rowIndex).map(item => item.label);
  } else if (tab === "pj" && header === "ìë¬´ë¨ê³2") {
    const headers = getEstimateDbLeafColumns(sheet);
    const parentIndex = headers.indexOf("ìë¬´ì±ê²©");
    const parentValue = normalizeEstimateDbText(sheet.rows?.[rowIndex]?.[parentIndex]);
    options = estimateDbLinkedStageOptions[parentValue] || [];
  } else if (estimateDbDefaultOptions[header]) {
    options = [...estimateDbDefaultOptions[header]];
  }
  let uniqueValues = header === "ììê³µì¢" ? [] : getEstimateDbUniqueColumnValues(tab, colIndex);
  let customValues = custom;
  if (header === "ë¨ê°ììì¬ë¶") {
    uniqueValues = uniqueValues.filter(isEstimateDbUnitWorkOnlyValue);
    customValues = customValues.filter(isEstimateDbUnitWorkOnlyValue);
  }
  options = [...options, ...uniqueValues, ...customValues];
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
      <div class="estimate-db-dropdown-title" id="estimateDbDropdownTitle">ëª©ë¡ ì í</div>
      <input id="estimateDbDropdownSearch" class="estimate-db-dropdown-search" placeholder="ê²ì ëë ì í­ëª© ìë ¥" />
      <div id="estimateDbDropdownMultiHelp" class="estimate-db-dropdown-help hidden">Ctrl+B ë¨ì¶í¤ë¡ ì¤ë³µì íì´ ê°ë¥í©ëë¤.</div>
      <div id="estimateDbDropdownList" class="estimate-db-dropdown-list"></div>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbDropdown()">ë«ê¸°</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="addEstimateDbDropdownOptionFromInput()">ëª©ë¡ ì¶ê°/ì í</button>
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
  const currentRawValue = normalizeEstimateDbText(getEstimateDbRows()[rowIndex]?.[colIndex] || "");
  const currentDisplayValue = header === "ììê³µì¢"
    ? sanitizeEstimateDbWorkScopeValue(currentRawValue)
    : (header === "ë¨ê°ììì¬ë¶" ? sanitizeEstimateDbUnitWorkValue(currentRawValue) : currentRawValue);
  const existingValues = currentDisplayValue
    .split(/[,ãï¼]+/)
    .map(v => normalizeEstimateDbText(v))
    .filter(Boolean);
  estimateDbDropdownState = {
    tab: estimateDbActiveTab,
    rowIndex,
    colIndex,
    activeIndex: 0,
    options: getEstimateDbDropdownOptions(estimateDbActiveTab, rowIndex, colIndex),
    fresh: true,
    multi: header === "ììê³µì¢",
    selectedValues: header === "ììê³µì¢" ? existingValues : []
  };
  modal.classList.remove("hidden");
  modal.querySelector("#estimateDbDropdownTitle").textContent = `${header} ì í`;
  modal.querySelector("#estimateDbDropdownMultiHelp")?.classList.toggle("hidden", header !== "ììê³µì¢");
  const search = modal.querySelector("#estimateDbDropdownSearch");
  search.value = "";
  search.placeholder = currentDisplayValue || "ê²ì ëë ì í­ëª© ìë ¥";
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
    list.innerHTML = `<div class="estimate-db-dropdown-empty">${state.tab === "pj" && getEstimateDbColumnName(state.tab, state.colIndex) === ESTIMATE_DB_PROJECT_LINK_HEADER ? "ì°ê²°í  íë¡ì í¸ê° ììµëë¤." : "ê¸°ì¡´ ë°ì´í°ì ìì±ë ë´ì©ì´ ììµëë¤.(Enterë¥¼ ëë¥¼ ì í´ë¹ ëª©ë¡ ì¶ê°)"}</div>`;
    return;
  }
  list.innerHTML = filtered.map((option, index) => {
    const selected = !!state.multi && (state.selectedValues || []).includes(option);
    return `<button type="button" class="estimate-db-dropdown-option ${index === state.activeIndex ? "active" : ""} ${selected ? "selected" : ""}" onclick="selectEstimateDbDropdownOption(${index})">${selected ? "â " : ""}${escapeEstimateDbHtml(option)}</button>`;
  }).join("") || `<div class="estimate-db-dropdown-empty">ëª©ë¡ì´ ììµëë¤. ìë ¥ í Enterë¥¼ ëë¥´ë©´ í´ë¹ ëª©ë¡ì ì¶ê°ë©ëë¤.</div>`;
}
function toggleEstimateDbDropdownMultiSelection(index = estimateDbDropdownState?.activeIndex || 0) {
  const state = estimateDbDropdownState;
  if (!state || !state.multi) return;
  const search = document.getElementById("estimateDbDropdownSearch");
  const typed = normalizeEstimateDbText(search?.value || "");
  const value = state.noMatch ? typed : (state.filtered?.[index] ?? typed);
  if (!value) return;
  if (getEstimateDbColumnName(state.tab, state.colIndex) === "ììê³µì¢" && !isEstimateDbWorkScopeOnlyValue(value)) {
    alert("ììê³µì¢ìë ë§ê°/ê³¨ì¡°ì±/êµ¬ì¡°/í ëª©/ì¡°ê²½/ê¸°ê³/ì ê¸°/ì¸íë¦¬ì´/ì² ê±°/ì ê³µì ë§ ì íí  ì ììµëë¤.");
    return;
  }
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
  if (header === "ììê³µì¢") {
    const nextScope = sanitizeEstimateDbWorkScopeValue(value);
    if (!nextScope) {
      alert("ììê³µì¢ìë ë¨ê°ìì í­ëª©ì ìë ¥í  ì ììµëë¤. ë§ê°/ê³¨ì¡°ì±/êµ¬ì¡°/í ëª©/ì¡°ê²½/ê¸°ê³/ì ê¸°/ì¸íë¦¬ì´/ì² ê±°/ì ê³µì  ì¤ìì ì ííì¸ì.");
      return;
    }
  }
  if (header === "ë¨ê°ììì¬ë¶" && !isEstimateDbUnitWorkOnlyValue(value)) {
    alert("ë¨ê°ììì¬ë¶ìë ê³µë´ì­ì/ë¹êµë´ì­ì/ì¤ê³ìê°/ë¨ê°ìì/ê¸°íë§ ì íí  ì ììµëë¤. ê°ì°ê²¬ì ì ê²¬ì ì ë°©ì í­ëª©ì´ë¯ë¡ íìíì§ ììµëë¤.");
    return;
  }
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
  if (header === "ìë¬´ì±ê²©" && getEstimateDbColumnName(state.tab, nextCol) === "ìë¬´ë¨ê³2") {
    requestAnimationFrame(() => openEstimateDbDropdown(row, nextCol));
  } else {
    requestAnimationFrame(() => focusEstimateDbCell(row, state.colIndex));
  }
}
function addEstimateDbDropdownOptionFromInput() {
  const search = document.getElementById("estimateDbDropdownSearch");
  const value = normalizeEstimateDbText(search?.value || "");
  if (!value || !estimateDbDropdownState) return;
  const header = getEstimateDbColumnName(estimateDbDropdownState.tab, estimateDbDropdownState.colIndex);
  if (header === "ììê³µì¢" && !isEstimateDbWorkScopeOnlyValue(value)) {
    alert("ììê³µì¢ìë ë¨ê°ìì í­ëª©ì ì¶ê°í  ì ììµëë¤. ë§ê°/ê³¨ì¡°ì±/êµ¬ì¡°/í ëª©/ì¡°ê²½/ê¸°ê³/ì ê¸°/ì¸íë¦¬ì´/ì² ê±°/ì ê³µì  ì¤ìì ì ííì¸ì.");
    return;
  }
  if (header === "ë¨ê°ììì¬ë¶" && !isEstimateDbUnitWorkOnlyValue(value)) {
    alert("ë¨ê°ììì¬ë¶ìë ê³µë´ì­ì/ë¹êµë´ì­ì/ì¤ê³ìê°/ë¨ê°ìì/ê¸°íë§ ì¶ê°í  ì ììµëë¤. ê°ì°ê²¬ì ì ê²¬ì ì ë°©ì í­ëª©ì´ë¯ë¡ ì¶ê°íì§ ììµëë¤.");
    return;
  }
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

function getEstimateDbAmountModalTradeFromColumn(colIndex) {
  const trade = normalizeEstimateDbText(getEstimateDbColumnName("progress", colIndex));
  return ["ê¸°ê³", "ì ê¸°", "ì¸ì£¼", "ì¡ë¬´", "ê¸°í"].includes(trade) ? trade : "";
}
function getEstimateDbMepVendorNameOptions() {
  return ensureEstimateDbMepVendorRows()
    .map(row => normalizeEstimateDbText(row?.[1]))
    .filter((name, index, list) => name && list.indexOf(name) === index);
}
function updateEstimateDbAmountCompanyDatalist() {
  const list = document.getElementById("estimateDbAmountCompanyList");
  if (!list) return;
  list.innerHTML = getEstimateDbMepVendorNameOptions()
    .map(name => `<option value="${escapeEstimateDbHtml(name)}"></option>`)
    .join("");
}
function ensureEstimateDbMepVendorByName(company, trade = "") {
  const name = normalizeEstimateDbText(company);
  if (!name) return null;
  const sheet = estimateDbSheets?.mep;
  if (!sheet) return null;
  const headers = getEstimateDbMepVendorHeaders();
  const rows = ensureEstimateDbMepVendorRows();
  const compactName = name.replace(/\s+/g, "");
  let row = rows.find(item => normalizeEstimateDbText(item?.[1]).replace(/\s+/g, "") === compactName);
  const normalizedTrade = normalizeEstimateDbText(trade);
  if (!row) {
    row = Array(headers.length).fill("");
    row[0] = String(rows.length + 1);
    row[1] = name;
    if (normalizedTrade) row[2] = normalizedTrade;
    rows.push(row);
    estimateDbHasUnsavedChanges = true;
  } else if (normalizedTrade && !normalizeEstimateDbText(row[2])) {
    row[2] = normalizedTrade;
    estimateDbHasUnsavedChanges = true;
  }
  return row;
}
function upsertEstimateDbMepContractFromProgressAmount(rowIndex, colIndex, company, amount) {
  const companyName = normalizeEstimateDbText(company);
  if (!companyName) return 0;
  const sheet = estimateDbSheets?.mep;
  const progressRow = estimateDbSheets?.progress?.rows?.[Number(rowIndex)];
  if (!sheet || !progressRow) return 0;
  const trade = getEstimateDbAmountModalTradeFromColumn(colIndex);
  ensureEstimateDbMepVendorByName(companyName, trade);
  const idx = name => getEstimateDbColumnIndexByHeader("mep", name);
  const pidx = name => getEstimateDbColumnIndexByHeader("progress", name);
  const pjNo = normalizeEstimateDbText(progressRow[pidx("PJ NO")]);
  const pjName = normalizeEstimateDbText(progressRow[pidx("PJëª")]) || normalizeEstimateDbText(progressRow[pidx("íë¡ì í¸ëª")]);
  const rows = Array.isArray(sheet.rows) ? sheet.rows : (sheet.rows = []);
  const pjNoIdx = idx("PJ NO");
  const companyIdx = idx("ê³ì½ìì²´");
  if (pjNoIdx < 0 || companyIdx < 0) return 0;
  const compactCompany = companyName.replace(/\s+/g, "");
  let target = rows.find(row => normalizeEstimateDbText(row?.[pjNoIdx]) === pjNo && normalizeEstimateDbText(row?.[companyIdx]).replace(/\s+/g, "") === compactCompany);
  if (!target) {
    target = Array(getEstimateDbLeafColumns(sheet).length).fill("");
    rows.push(target);
  }
  const set = (name, value) => {
    const i = idx(name);
    if (i >= 0 && target[i] !== value) target[i] = value;
  };
  set("ìµì´ìì±ë ì§", target[idx("ìµì´ìì±ë ì§")] || formatEstimateDbKoreanDate?.() || "");
  set("PJ NO", pjNo);
  set("PJëª", pjName);
  set("ê³ì½ìì²´", companyName);
  const normalizedAmount = normalizeEstimateDbText(amount).replace(/,/g, "");
  set("ê³ì½ê¸ì¡", normalizedAmount);
  set("ì»¨ì½ì¤í¸ê³ì½ê¸", normalizedAmount);
  recalcEstimateDbRow("mep", target);
  estimateDbHasUnsavedChanges = true;
  updateEstimateDbSaveButtonState?.();
  syncEstimateDbProgressOutsourceCellsFromMepByPjNo?.({ markDirty: true });
  return 1;
}

function ensureEstimateDbAmountModal() {
  let modal = document.getElementById("estimateDbAmountModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "estimateDbAmountModal";
  modal.className = "estimate-db-dropdown-modal hidden";
  modal.innerHTML = `
    <div class="estimate-db-dropdown-box estimate-db-amount-box" role="dialog" aria-modal="true">
      <div class="estimate-db-dropdown-title" id="estimateDbAmountTitle">ì¸ì£¼ ê¸ì¡ ìë ¥</div>
      <label class="estimate-db-amount-label">ìì²´ëª<input id="estimateDbAmountCompany" class="estimate-db-dropdown-search" list="estimateDbAmountCompanyList" placeholder="ê¸°ì ìì²´ ë¦¬ì¤í¸ìì ì ííê±°ë ì ìì²´ëªì ìë ¥" /></label><datalist id="estimateDbAmountCompanyList"></datalist>
      <label class="estimate-db-amount-label">ê¸ì¡<input id="estimateDbAmountValue" class="estimate-db-dropdown-search" placeholder="ì: 200000" /></label>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbAmountModal()">ë«ê¸°</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbAmountModal()">ì ì¥</button>
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
  updateEstimateDbAmountCompanyDatalist();
  modal.querySelector("#estimateDbAmountTitle").textContent = `${getEstimateDbColumnName(estimateDbActiveTab, colIndex)} ê¸ì¡ ìë ¥`;
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
  if (state.tab === "progress") {
    upsertEstimateDbMepContractFromProgressAmount(state.rowIndex, state.colIndex, company, amount);
  }
  showToast('ê¸ì¡ ì ë³´ê° ì ì¥ëììµëë¤.');
  closeEstimateDbAmountModal();
  renderEstimateDbManage({ forceRecalc: true, renderReportsNow: false });
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
  if (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbAccountInfoCell(estimateDbActiveTab, colIndex)) {
    event.preventDefault();
    commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
    openEstimateDbAccountModal(rowIndex, colIndex);
    return;
  }
  if (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbProgressBillingClientColumn(estimateDbActiveTab, colIndex)) {
    event.preventDefault();
    commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
    openEstimateDbBillingClientModal(rowIndex, colIndex);
    return;
  }
  if (!event.ctrlKey && !event.altKey && event.key === "Enter" && isEstimateDbProgressBillingManagerColumn(estimateDbActiveTab, colIndex)) {
    event.preventDefault();
    commitEstimateDbSinglePendingEdit(estimateDbActiveTab, rowIndex, colIndex, { skipRecalc: true });
    openEstimateDbBillingManagerModal(rowIndex, colIndex);
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

    // ë ì§ ìë ¥ ì»¬ë¼ì ì ì¥ ëê¸°ê°ì íì í ì§í íì¬ ì íë ìë ¥ì¹¸ìë
    // 260105 â 26ë1ì5ì¼ íìì¼ë¡ ì¦ì ë°ìí©ëë¤.
    // ì ì© ë²ì: ê²¬ì ìì¼ì, ìì£¼ì¼ì, ê³ì½ì¼ì, ë©íìì ì¼ 1~3ì°¨ë©í.
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

  // ì¢ì° ì´ëì ê°ì ë°ì´í° í ìììë§ ì´ëí©ëë¤.
  if (!rowDelta) {
    return { rowIndex, colIndex: nextCol };
  }

  // PJ NO ê¸°ë³¸ ë´ë¦¼ì°¨ìì²ë¼ íë©´ ì ë ¬ ììì ìë³¸ ë°°ì´ ììê° ë¤ë¥¼ ì ìì¼ë¯ë¡,
  // ì/ìë ë°©í¥í¤ë íì¬ DOMì íìë í ììë¥¼ ê¸°ì¤ì¼ë¡ ë¤ì íì ì°¾ìµëë¤.
  const visibleRows = Array.from(document.querySelectorAll("#estimateDbBody .quote-db-data-row"));
  if (!visibleRows.length) {
    const rows = getEstimateDbRows();
    return {
      rowIndex: Math.max(0, Math.min(rows.length - 1, rowIndex + rowDelta)),
      colIndex: nextCol
    };
  }

  let domIndex = visibleRows.findIndex(row => Number(row.dataset.rowIndex) === Number(rowIndex));

  // í¬ì»¤ì¤ ì ë³´ê° ì ë ¬ ì§í ì ê¹ ì´ê¸ë ê²½ì°, íì¬ íì± input ê¸°ì¤ì¼ë¡ ë³´ì í©ëë¤.
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
  // ì°ë ê¸°ì¤ì ëë/ì ìë²í¸/PJ NO ì¡°í©ì´ì§ë§, "ëëë§ ìë ë¹ í"ì ì°ë ëìì¼ë¡ ë³´ì§ ììµëë¤.
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
    year: value(ESTIMATE_DB_CREATED_DATE_HEADER) || value("ëë"),
    receiptNo: value("ì ìë²í¸"),
    pjNo: value("PJ NO"),
    pjName: value("íë¡ì í¸ëª"),
    company: value("ê±°ëì²ëª"),
    sourceIndex: pjRowIndex
  };
  payload.key = makeEstimateDbSyncKey(payload);
  // PJ NO/ì ìë²í¸/íë¡ì í¸ëª ì¤ íëë ìë ë¨ì ë¹ íì ì°ëíì§ ììµëë¤.
  if (!payload.key) return null;
  return payload;
}
function estimateDbTargetRowKey(tab, row) {
  return makeEstimateDbSyncKey({
    year: getEstimateDbRowValueByHeader(tab, row, ESTIMATE_DB_CREATED_DATE_HEADER) || getEstimateDbRowValueByHeader(tab, row, "ëë"),
    receiptNo: getEstimateDbRowValueByHeader(tab, row, "ì ìë²í¸"),
    pjNo: getEstimateDbRowValueByHeader(tab, row, "PJ NO"),
    pjName: getEstimateDbRowValueByHeader(tab, row, "PJëª") || getEstimateDbRowValueByHeader(tab, row, "íë¡ì í¸ëª")
  });
}
function syncEstimateDbLinkedRowsFromPj(pjRowIndex) {
  const payload = getEstimateDbPjSyncPayload(pjRowIndex);
  if (!payload) return 0;
  let changed = 0;
  changed += syncEstimateDbTargetRow("progress", payload.key, {
    "ìµì´ìì±ë ì§": payload.year,
    "ëë": payload.year,
    "ì ìë²í¸": payload.receiptNo,
    "PJ NO": payload.pjNo,
    "ìì²´ëª": payload.company,
    "PJëª": payload.pjName
  }, payload.sourceIndex);
  changed += syncEstimateDbTargetRow("mep", payload.key, {
    "ìµì´ìì±ë ì§": payload.year,
    "ëë": payload.year,
    "ì ìë²í¸": payload.receiptNo,
    "PJ NO": payload.pjNo,
    "PJëª": payload.pjName
  }, payload.sourceIndex);
  return changed;
}
function syncEstimateDbTargetRow(tab, syncKey, values, sourceIndex = null) {
  const sheet = estimateDbSheets[tab];
  if (!sheet || !syncKey) return 0;
  const cols = getEstimateDbLeafColumns(sheet);
  if (!sheet.rows) sheet.rows = [];

  // 1) íì¬ í¤ê° ìì í ì¼ì¹íë ê¸°ì¡´ í ì°ì  íì
  let target = sheet.rows.find(row => estimateDbTargetRowKey(tab, row) === syncKey);

  // 2) ê°ì PJê´ë¦¬ íìì ì´ì ì ì°ëíë íì´ë©´ PJ NO/ì ìë²í¸ê° ë°ëì´ë ê°ì íì ê°±ì 
  if (!target && sourceIndex !== null && sourceIndex !== undefined) {
    target = sheet.rows.find(row => row && row.__sourcePjRowIndex === sourceIndex);
  }

  // 3) ì´ì  ë²ì ìì __sourcePjRowIndexê° ìë í ë³´ì : PJê´ë¦¬ì ì í¨ í ììì ëì í­ ì í¨ í ììë¥¼ ë§ì¶° ê°±ì 
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
  // ìë ëê¸°íë ì¬ì©íì§ ììµëë¤. ì¬ì©ìê° Ctrl+Enter ëë ë²í¼ì¼ë¡ ëªì ì¤íí  ëë§ ë°ìí©ëë¤.
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
  const createdDateIndex = findEstimateDbColumnIndexByAnyName(columns, [ESTIMATE_DB_CREATED_DATE_HEADER, "ëë"]);
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
    if (changed) showToast(`ê¸°ì±ê´ë¦¬Â·ê¸°ì ìì²´ì ${changed}ê±´ì ì°ëíìµëë¤.`);
    else showToast(valid ? "ê¸°ì±ê´ë¦¬Â·ê¸°ì ìì²´ê° ì´ë¯¸ ìµì  ìíìëë¤." : "ì°ëí  ì ê·/ë³ê²½ í­ëª©ì´ ììµëë¤.");
  }
}
function exportEstimateDbJsonForAi() {
  removeEstimateDbPjReceiptColumnOnce();
  ensureEstimateDbPjProjectLinkColumnOnce();
  ensureEstimateDbPjIdentityColumnsOnce?.({ assignMissing: true });
  const payload = {
    exportedAt: new Date().toISOString(),
    note: "DBê´ë¦¬ ëë¯¸ë°ì´í° ìì²­ì© JSONìëë¤. ì´ ê°ì ìì /ì¶ê°í´ì ë¤ì ì ë¬íë©´ ëì¼ êµ¬ì¡°ë¡ ë°ìí  ì ììµëë¤.",
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
  const yearIndex = findEstimateDbColumnIndexByAnyName(columns, [ESTIMATE_DB_CREATED_DATE_HEADER, "ëë"]);
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
    const monthRows = rows.filter(row => parseEstimateDbMonth(row[idx["ìì£¼ì¼ì"]]) === month);
    const outRows = mepRows.filter(row => parseEstimateDbMonth(row[mepIdx["ì§ê¸ì¼ì1"]]) === month || parseEstimateDbMonth(row[mepIdx["ì§ê¸ì¼ì2"]]) === month);
    const orderAmount = monthRows.reduce((sum, row) => sum + toEstimateDbNumber(row[idx["ì°ë©´ì (í)"]]) * 14000, 0);
    const outAmount = outRows.reduce((sum, row) => sum + toEstimateDbNumber(row[mepIdx["ì§ê¸í©ê³"]] || row[mepIdx["ê³ì½ê¸ì¡"]]), 0);
    return [year, `${month}ì`, monthRows.length || "", orderAmount, 0, orderAmount, outAmount, Math.max(0, orderAmount - outAmount), ""];
  });
  const detailHeader = ["NO", "ìì£¼ì", "ê±°ëì²ëª", "íë¡ì í¸ëª", "ììê³µì¢", "ìì£¼ì¼ì", "ìµì¢ìì£¼ì¡", "ê¸°ì /ì¸ì£¼", "ì»¨ì½ì¤í¸", "PM(ë§ê°)", "PM(êµ¬ì¡°)", "PM(í ëª©,ì¡°ê²½)"];
  const detail = rows.map(row => {
    const amount = toEstimateDbNumber(row[idx["ì°ë©´ì (í)"]]) * 14000;
    const month = parseEstimateDbMonth(row[idx["ìì£¼ì¼ì"]]) || "";
    return [row[idx["ì ìë²í¸"]], month ? `${month}ì` : "", row[idx["ê±°ëì²ëª"]], row[idx["íë¡ì í¸ëª"]], row[idx["ììê³µì¢"]], row[idx["ìì£¼ì¼ì"]], amount, "", amount, row[idx["PM(ë§ê°)"]], row[idx["PM(êµ¬ì¡°)"]], row[idx["PM(í ëª©,ì¡°ê²½)"]]];
  });
  return { title: `${year}ë ìì£¼`, header: ["ëë", "ì", "ê±´ ì", "ìì£¼ì¡", "ì¡°ì ê¸ì¡", "ìµì¢ìì£¼ì¡(â )", "ê¸°ì /ì¸ì£¼(â¡)", "ì»¨ì½ì¤í¸(â -â¡)", "ë¹ê³ "], monthly, detailHeader, detail };
}
function buildSalesRows(year = getSelectedEstimateDbYear()) {
  const idx = estimateDbIndexMap("progress");
  const rows = getEstimateDbRowsByYear("progress", year);
  const monthly = Array.from({ length: 12 }, (_, m) => {
    const month = m + 1;
    const monthRows = rows.filter(row => parseEstimateDbMonth(row[idx["ê³ì½ì¼ì"]] || row[idx["ìì£¼ì¼ì"]]) === month);
    const amount = monthRows.reduce((sum, row) => sum + toEstimateDbNumber(row[idx["ê³ì½ê¸ì¡"]]), 0);
    const out = monthRows.reduce((sum, row) => sum + toEstimateDbNumber(row[idx["ì¸ì£¼í©ê³"]]), 0);
    return [year, `${month}ì`, monthRows.length || "", amount, Math.round(amount * 1.1), out, Math.max(0, amount - out), ""];
  });
  const detailHeader = ["PJ NO", "ìì²´ëª", "PJëª", "ê³ì½ê¸ì¡", "ìë ¹ì¡", "ìì¡", "ì¸ì£¼í©ê³", "ê³ì½ì¼ì", "ì´ê´PM", "ë©íìì ì¼", "í¹ì´ì¬í­"];
  const detail = rows.map(row => [row[idx["PJ NO"]], row[idx["ìì²´ëª"]], row[idx["PJëª"]], row[idx["ê³ì½ê¸ì¡"]], row[idx["ìë ¹ì¡"]], row[idx["ìì¡"]], row[idx["ì¸ì£¼í©ê³"]], row[idx["ê³ì½ì¼ì"]], row[idx["ì´ê´PM"]], row[idx["ë©íìì ì¼"]], row[idx["í¹ì´ì¬í­"]]]);
  return { title: `${year}ë ë§¤ì¶`, header: ["ëë", "ì", "ê±´ ì", "ë°íì¡(â )", "ë°íì¡(â )VATí¬í¨", "ê¸°ì /ì¸ì£¼(â¡)", "ì»¨ì½ì¤í¸(â -â¡)", "ë¹ê³ "], monthly, detailHeader, detail };
}
function buildDepositRows(year = getSelectedEstimateDbYear()) {
  const idx = estimateDbIndexMap("progress");
  const rows = getEstimateDbRowsByYear("progress", year);
  const detailHeader = ["NO", "ìì²´", "íë¡ì í¸ëª", "ê¸°ì±ë´ë¹ì", "ì´ì¡", "ê¸°ìë ¹ì¡", "ì²­êµ¬ì¡(ë³ë)", "ì²­êµ¬ì¡(í¬í¨)", "ì²­êµ¬íìì¡", "ê¸°ì /ì¸ì£¼", "ë°íì¼", "ì§ê¸ììì¼", "ì§ê¸ì¼", "ì§ê¸ì¡(vatë³ë)", "ì§ê¸ì¡(vatí¬í¨)", "ìíëª", "ì¢ë¥", "ë¹ê³ "];
  const detail = rows.map(row => {
    const total = toEstimateDbNumber(row[idx["ê³ì½ê¸ì¡"]]);
    const paid = toEstimateDbNumber(row[idx["ìë ¹ì¡"]]);
    const bill = Math.max(0, total - paid);
    return [row[idx["PJ NO"]], row[idx["ìì²´ëª"]], row[idx["PJëª"]], row[idx["ê¸°ì±ë´ë¹ì"]], total, paid, bill, Math.round(bill * 1.1), Math.max(0, total - paid - bill), row[idx["ì¸ì£¼í©ê³"]], row[idx["ê³ì½ê¸_ì¸ê¸ê³ì°ì"]], row[idx["ë©íìì ì¼"]], row[idx["ê³ì½ê¸_ìê¸ì¼"]], bill, Math.round(bill * 1.1), "", "", row[idx["í¹ì´ì¬í­"]]];
  });
  return { title: `${year}ë ìê¸`, detailHeader, detail };
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
    return [`${m + 1}ì`, orderTarget, orderAmount, orderOut, orderAmount - orderOut, pct(orderAmount - orderOut, orderTarget), pct(orderAmount, orderTarget), salesTarget, salesAmount, salesOut, salesAmount - salesOut, pct(salesAmount - salesOut, salesTarget), pct(salesAmount, salesTarget), depositTarget, depAmount, depOut, depAmount - depOut, pct(depAmount - depOut, depositTarget), pct(depAmount, depositTarget), ""];
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
      <div class="estimate-db-dropdown-title">ìë³ ëª©í ì¤ì </div>
      <div id="estimateDbSalesTargetGrid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0;"></div>
      <div class="estimate-db-dropdown-actions">
        <button type="button" class="btn btn-line btn-sm" onclick="closeEstimateDbSalesTargetModal()">ë«ê¸°</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="saveEstimateDbSalesTargetModal()">ì ì¥</button>
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
      return `<label class="estimate-db-amount-label">${month}ì ${type.label}<input class="estimate-db-dropdown-search estimate-db-sales-target-input" onkeydown="handleEstimateDbSalesTargetKeydown(event)" data-target-type="${type.key}" data-month="${month}" value="${escapeEstimateDbHtml(formatEstimateDbCommaNumber(value))}" oninput="this.value = formatEstimateDbCommaNumber(this.value.replace(/[^0-9.-]/g, ''))" /></label>`;
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
  if (typeof showToast === "function") showToast(`${year}ë ìë³ ëª©íë¥¼ ì ì¥íìµëë¤.`);
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
    html = renderReportTable(`${year}ë ìì£¼.ë§¤ì¶.ìê¸`, [["êµ¬ë¶", "ìì£¼ëª©í", "ìì£¼ë¬ì±", "ê¸°ì /ì¸ì£¼", "ì°¨ì¡", "ë¹ì¨1", "ë¹ì¨2", "ë§¤ì¶ëª©í", "ë§¤ì¶ë¬ì±", "ê¸°ì /ì¸ì£¼", "ì°¨ì¡", "ë¹ì¨1", "ë¹ì¨2", "ìê¸ëª©í", "ìê¸ë¬ì±", "ê¸°ì /ì¸ì£¼", "ì°¨ì¡", "ë¹ì¨1", "ë¹ì¨2", "ë¹ê³ "]], rows);
  } else if (estimateDbReportActiveTab === "order") {
    const data = buildOrderRows(year);
    html = renderReportTable(data.title, [data.header], data.monthly) + renderReportTable("ìì£¼ íë¡ì í¸ ìì¸", [data.detailHeader], data.detail);
  } else if (estimateDbReportActiveTab === "sales") {
    const data = buildSalesRows(year);
    html = renderReportTable(data.title, [data.header], data.monthly) + renderReportTable("ë§¤ì¶ íë¡ì í¸ ìì¸", [data.detailHeader], data.detail);
  } else {
    const data = buildDepositRows(year);
    html = renderReportTable(data.title, [data.detailHeader], data.detail);
  }
  target.innerHTML = html;
}
function renderReportTable(title, headerRows, rows) {
  return `<div class="quote-report-table-block" style="overflow-x:auto;overflow-y:visible;max-height:none;"><h3>${escapeEstimateDbHtml(title)}</h3><table class="quote-report-table"><thead>${headerRows.map(row => `<tr>${row.map(cell => `<th>${escapeEstimateDbHtml(cell)}</th>`).join("")}</tr>`).join("")}</thead><tbody>${rows.length ? rows.map(row => `<tr>${row.map(cell => `<td>${escapeEstimateDbHtml(formatEstimateDbReportCell(cell))}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headerRows[0]?.length || 1}" class="empty-cell">í´ë¹ ì°ë ë°ì´í°ê° ììµëë¤.</td></tr>`}</tbody></table></div>`;
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
  const num = typeof raw === "number" ? raw : (String(raw).trim() !== "" && !String(raw).includes("%") && !String(raw).match(/[ê°-í£A-Za-z/:]/) && !Number.isNaN(Number(String(raw).replace(/,/g, ""))) ? Number(String(raw).replace(/,/g, "")) : null);
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
  const getMonth = month => rowsByMonth.get(month) || [`${month}ì`, 100000000, "-", "-", "-", "0%", "0%", 100000000, "-", "-", "-", "0%", "0%", 100000000, "-", "-", "-", "0%", "0%", ""];
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
  const quarter1 = sumMonths("1ê¸°ìì ", [1,2,3]);
  const quarter1Fix = sumMonths("1ê¸°íì ", [4,5,6]);
  const half1 = sumMonths("1ê¸°(1~6ì)", [1,2,3,4,5,6]);
  const quarter2 = sumMonths("2ê¸°ìì ", [7,8,9]);
  const quarter2Fix = sumMonths("2ê¸°íì ", [10,11,12]);
  const half2 = sumMonths("2ê¸°(7~12ì)", [7,8,9,10,11,12]);
  const total = sumMonths(`${year}ë`, [1,2,3,4,5,6,7,8,9,10,11,12]);
  return [
    getMonth(1), getMonth(2), getMonth(3), quarter1,
    getMonth(4), getMonth(5), getMonth(6), quarter1Fix, half1,
    getMonth(7), getMonth(8), getMonth(9), quarter2,
    getMonth(10), getMonth(11), getMonth(12), quarter2Fix, half2,
    total
  ];
}
function summaryStyleForLabel(label) {
  if (String(label).includes("ë")) return "Total";
  if (String(label).includes("1ê¸°(") || String(label).includes("2ê¸°(")) return "Half";
  if (String(label).includes("ìì ") || String(label).includes("íì ")) return "Quarter";
  return "Body";
}
function worksheetXmlStyledSummary(year = getSelectedEstimateDbYear()) {
  const sub = ["â ìì£¼ëª©í", "â¡ìì£¼ë¬ì±", "â¢ê¸°ì /ì¸ì£¼", "â¡-â¢ì°¨ì¡", "ë¹ì¨1", "ë¹ì¨2"];
  const rows = buildStyledSummaryData(year);
  const cols = [68, 96, 96, 96, 96, 78, 78, 96, 96, 96, 96, 78, 78, 96, 96, 96, 96, 78, 78, 150].map(w => `<Column ss:Width="${w}"/>`).join("");
  let xml = `<Worksheet ss:Name="0.ìì£¼ë§¤ì¶ìê¸"><Table>${cols}`;
  xml += `<Row ss:Height="26"><Cell ss:StyleID="Title" ss:MergeAcross="19"><Data ss:Type="String">${escapeEstimateDbXml(year)}ë ìì£¼.ë§¤ì¶.ìê¸</Data></Cell></Row>`;
  xml += `<Row ss:Height="12">${Array.from({length:20}, () => estimateDbXmlCell("", "Blank")).join("")}</Row>`;
  xml += `<Row ss:Height="24">${estimateDbXmlCell("êµ¬ë¶", "Group", 0, 1)}${estimateDbXmlCell("ìì£¼", "Group", 5)}${estimateDbXmlCell("ë§¤ì¶", "Group", 5)}${estimateDbXmlCell("ìê¸", "Group", 5)}${estimateDbXmlCell("ë¹ê³ ", "Group", 0, 1)}</Row>`;
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
    { name: "0.ìì£¼ë§¤ì¶ìê¸", type: "summary", year },
    { name: "1.ìì£¼ íë¡ì í¸", type: "report", rows: [[order.title], order.header, ...order.monthly, [], order.detailHeader, ...order.detail] },
    { name: "2.ë§¤ì¶ íë¡ì í¸", type: "report", rows: [[sales.title], sales.header, ...sales.monthly, [], sales.detailHeader, ...sales.detail] },
    { name: "3.ìê¸ íë¡ì í¸", type: "report", rows: [[deposit.title], deposit.detailHeader, ...deposit.detail] }
  ];
}
function getEstimateDbWorkbookStylesXml() {
  const border = `<Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders>`;
  return `<Styles>
    <Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="10"/></Style>
    <Style ss:ID="Blank"><Font ss:FontName="ë§ì ê³ ë" ss:Size="10"/></Style>
    <Style ss:ID="Title"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="18" ss:Bold="1"/></Style>
    <Style ss:ID="ReportTitle"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="15" ss:Bold="1"/></Style>
    <Style ss:ID="Group"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="10" ss:Bold="1"/><Interior ss:Color="#E6E6E6" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="Header"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#E6E6E6" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="Cell"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="9"/>${border}</Style>
    <Style ss:ID="Body"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="9"/>${border}</Style>
    <Style ss:ID="BodyLabel"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="9"/>${border}</Style>
    <Style ss:ID="Quarter"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#E7E6E6" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="QuarterLabel"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#E7E6E6" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="Half"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#BDD7EE" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="HalfLabel"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#BDD7EE" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="Total"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="9" ss:Bold="1" ss:Color="#FF0000"/><Interior ss:Color="#FCE4D6" ss:Pattern="Solid"/>${border}</Style>
    <Style ss:ID="TotalLabel"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="ë§ì ê³ ë" ss:Size="9" ss:Bold="1"/><Interior ss:Color="#FCE4D6" ss:Pattern="Solid"/>${border}</Style>
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
    { name: "DB_íë¡ì í¸", rows: getEstimateDbExportRows("pj") },
    { name: "DB_ê¸°ì±", rows: getEstimateDbExportRows("progress") },
    { name: "DBê¸°ì ì¸ì£¼", rows: getEstimateDbExportRows("mep") }
  ];
  downloadEstimateDbWorkbook(`CONCOST_DB_${date}.xls`, sheets);
  showToast("DB 3ê° ìí¸ë¥¼ ìì íì¼ë¡ ë´ë³´ëëë¤.");
}
function exportEstimateDbReportsToExcel() {
  const year = getSelectedEstimateDbYear();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const sheets = getEstimateDbReportExportSheets(year);
  downloadEstimateDbWorkbook(`CONCOST_0_3_sheets_${year}_${date}.xls`, sheets);
  showToast(`${year}ë 0~3ë² ìí¸ë§ íì¬ íë©´ ê³ì°ê°ì¼ë¡ ë´ë³´ëëë¤.`);
}
function handleEstimateDbYearChange() { renderEstimateDbReports(); }

/* DBê´ë¦¬/íë¡ì í¸ ì ì ì¬ì´ë ë©ë´ ì í ë³´ì  */

document.addEventListener("click", event => {
  const workBtn = event.target?.closest?.("[data-work-main]");
  if (!workBtn) return;
  requestAnimationFrame(() => {
    const targetPanelId = workBtn.dataset.workMain;
    if (typeof syncWorkSideAccordion === "function") syncWorkSideAccordion(targetPanelId);
    // 패널 활성화: .work-panel.active CSS로 표시/숨김
    document.querySelectorAll('.work-panel').forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById(targetPanelId);
    if (targetPanel) targetPanel.classList.add('active');
    // 사이드 아이템 활성화 상태 업데이트
    document.querySelectorAll('.side-item[data-work-main]').forEach(s => {
      s.classList.remove('active', 'work-side-selected');
      s.removeAttribute('data-work-selected');
    });
    const selected = document.querySelector(`.side-item[data-work-main="${targetPanelId}"]`);
    selected?.classList.add("active", "work-side-selected");
    selected?.setAttribute("data-work-selected", "true");
    // 렌더 함수 호출
    if (targetPanelId === 'deliveryData' && typeof renderDeliveryData === 'function') renderDeliveryData();
    else if (targetPanelId === 'dailyReport' && typeof renderDailyReport === 'function') renderDailyReport();
    else if (targetPanelId === 'profitAnalysis' && typeof profitAnalysisModule !== 'undefined') profitAnalysisModule.render();
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
   FIX: DBê´ë¦¬ ì´ ìì¹ ë³ê²½ íì¸ ë²í¼ ì¢ë£ ë³´ì 
   - ì´ ìì¹ ë³ê²½ ì¤ ìíë ê·¸ëë¡ ì ì§ ë²í¼ ì­í ë§ ìí
   - ì¤ì  ì¢ë£/ì ì¥ì íì¸ ë²í¼ììë§ ì²ë¦¬
   - ë¤ë¥¸ ììê° ë²í¼ ìë¥¼ ë®ì´ë ì¢í ê¸°ì¤ì¼ë¡ íì¸ ë²í¼ í´ë¦­ì ê°ì§
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
        if (btn.id !== "estimateDbColumnReorderOkBtn" && text !== "íì¸") return false;
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
    if (typeof showToast === "function") showToast("ì´ ìì¹ ë³ê²½ì ì ì¥íìµëë¤.");
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
      if (typeof showToast === "function") showToast("ì´ ìì¹ ë³ê²½ ëª¨ëìëë¤. ì¢ë£íë ¤ë©´ íì¸ ë²í¼ì ëë¥´ì¸ì.");
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


/* === ê²¬ì ì ì¢ë¥ë³ ê´ë¦¬ v1: ìë¡ë ìì ìì 4ì¢ ì¹ ìì± íë©´ === */

/* =========================================================
   2026-05-29 PMë°°ì  â ê¸°ì±ê´ë¦¬ ì´ê´PM ì°ê³ ë³´ì 
   - ì´ê´PM ì°ì ìì: ë§ê°í PM â êµ¬ì¡°í PM â BIMíí¸ PM â í ëª©Â·ì¡°ê²½ PM
   - PJê´ë¦¬ PM ë³ê²½ ì ê¸°ì±ê´ë¦¬ ì´ê´PM ì¦ì ë°ì
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
    const finish = text(assignment.pmFinish ?? rowValue('pj', pjRow, 'PM(ë§ê°)'));
    const structure = text(assignment.pmStructure ?? rowValue('pj', pjRow, 'PM(êµ¬ì¡°)'));
    const bim = text(assignment.pmBim ?? rowValue('pj', pjRow, 'PM(BIM)'));
    const civil = text(assignment.pmCivil ?? rowValue('pj', pjRow, 'PM(í ëª©,ì¡°ê²½)'));
    return finish || structure || bim || civil || '';
  }
  function progressKeyFromPjRow(pjRow){
    if (!pjRow) return '';
    if (typeof makeEstimateDbSyncKey === 'function') {
      return makeEstimateDbSyncKey({
        year: rowValue('pj', pjRow, 'ìµì´ìì±ë ì§') || rowValue('pj', pjRow, 'ëë'),
        receiptNo: rowValue('pj', pjRow, 'ì ìë²í¸'),
        pjNo: rowValue('pj', pjRow, 'PJ NO'),
        pjName: rowValue('pj', pjRow, 'íë¡ì í¸ëª') || rowValue('pj', pjRow, 'PJëª')
      });
    }
    return [rowValue('pj', pjRow, 'PJ NO'), rowValue('pj', pjRow, 'íë¡ì í¸ëª')].map(text).filter(Boolean).join('::');
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
    const changed = setRowValue('progress', progressRow, 'ì´ê´PM', totalPm);
    if (changed && typeof recalcEstimateDbRow === 'function') recalcEstimateDbRow('progress', progressRow);
    return changed;
  }
  window.estimateDbSelectTotalPm = selectTotalPm;
  window.estimateDbSyncProgressTotalPmFromPjRow = syncOne;
  window.estimateDbSyncProgressTotalPmByKey = function estimateDbSyncProgressTotalPmByKey(projectKey, assignment = {}){
    if (!estimateDbSheets?.pj?.rows) return false;
    const keyText = text(projectKey);
    const idxs = ['PJ NO','receiveId','ì°ê³ID','DBì°ê³ID'].map(h => headerIndex('pj', h)).filter(i => i >= 0);
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
