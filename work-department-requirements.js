/* =========================================================
   2026-06-24 타부서 요청사항(260610) 반영
   - 견적 의뢰번호/편집잠금/추가 필드
   - 견적서 관리 통합 열, 정렬/필터, 의뢰메모 연결
   - DB관리 PJ 첫 열 표시 보정
   - 기전업체 샘플형 계약/지급 상세 화면
========================================================= */
(function applyDepartmentRequirements260610() {
  if (window.__departmentRequirements260610) return;
  window.__departmentRequirements260610 = true;

  const REQUEST_LOCK_PREFIX = "concost.estimate.request.edit-lock.";
  const REQUEST_LOCK_TTL = 120000;
  const MEP_META_KEY = "concost.estimate.mep.sample-meta.v1";
  const sessionId = (() => {
    const key = "concost.estimate.request.session-id";
    let value = sessionStorage.getItem(key);
    if (!value) {
      value = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem(key, value);
    }
    return value;
  })();

  const html = value => String(value ?? "").replace(/[&<>"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[char]));
  const text = value => String(value ?? "").replace(/\s+/g, " ").trim();
  const compact = value => text(value).replace(/\s+/g, "");
  const numberValue = value => {
    const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const money = value => {
    const amount = numberValue(value);
    return amount ? amount.toLocaleString("ko-KR") : "0";
  };
  const percent = value => `${Math.round(Math.max(0, numberValue(value)) * 1000) / 10}%`;

  function loadRequestRows() {
    if (typeof estimateRequestLoadRows === "function") estimateRequestLoadRows();
    return Array.isArray(estimateRequestRows) ? estimateRequestRows : [];
  }

  function requestDateCode(value) {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length >= 8) return digits.slice(2, 8);
    if (digits.length >= 6) return digits.slice(0, 6);
    return typeof estimateRequestToday === "function" ? estimateRequestToday() : "";
  }

  function nextEstimateRequestNumber(dateValue = "") {
    const dateCode = requestDateCode(dateValue);
    let max = 0;
    loadRequestRows().forEach(row => {
      const match = String(row?.requestNo || "").match(new RegExp(`^${dateCode}-(\\d{2})(?:-[A-Z])?$`));
      if (match) max = Math.max(max, Number(match[1]) || 0);
    });
    return `${dateCode}-${String(max + 1).padStart(2, "0")}`;
  }
  window.nextEstimateRequestNumber = nextEstimateRequestNumber;

  function ensureEstimateRequestNumbers() {
    const rows = loadRequestRows();
    const counters = {};
    let changed = false;
    rows.forEach(row => {
      if (text(row?.requestNo)) return;
      const dateCode = requestDateCode(row?.date);
      counters[dateCode] = (counters[dateCode] || 0) + 1;
      const used = rows
        .map(item => String(item?.requestNo || "").match(new RegExp(`^${dateCode}-(\\d{2})`)))
        .filter(Boolean)
        .map(match => Number(match[1]) || 0);
      const sequence = Math.max(counters[dateCode], used.length ? Math.max(...used) + 1 : 1);
      row.requestNo = `${dateCode}-${String(sequence).padStart(2, "0")}`;
      changed = true;
    });
    if (changed && typeof estimateRequestSaveRows === "function") estimateRequestSaveRows();
    return rows;
  }

  function getRequestLock(id) {
    try {
      const lock = JSON.parse(localStorage.getItem(`${REQUEST_LOCK_PREFIX}${id}`) || "null");
      if (!lock || Date.now() - Number(lock.at || 0) > REQUEST_LOCK_TTL) {
        localStorage.removeItem(`${REQUEST_LOCK_PREFIX}${id}`);
        return null;
      }
      return lock;
    } catch (_) {
      return null;
    }
  }

  function acquireEstimateRequestEditLock(id) {
    const lock = getRequestLock(id);
    if (lock && lock.owner !== sessionId) return false;
    localStorage.setItem(`${REQUEST_LOCK_PREFIX}${id}`, JSON.stringify({
      owner: sessionId,
      at: Date.now(),
      editor: "현재 사용자"
    }));
    return true;
  }

  function refreshEstimateRequestEditLock(id) {
    const lock = getRequestLock(id);
    if (!lock || lock.owner !== sessionId) return false;
    lock.at = Date.now();
    localStorage.setItem(`${REQUEST_LOCK_PREFIX}${id}`, JSON.stringify(lock));
    return true;
  }

  function releaseEstimateRequestEditLock(id) {
    const lock = getRequestLock(id);
    if (!lock || lock.owner === sessionId) localStorage.removeItem(`${REQUEST_LOCK_PREFIX}${id}`);
  }

  window.acquireEstimateRequestEditLock = acquireEstimateRequestEditLock;
  window.refreshEstimateRequestEditLock = refreshEstimateRequestEditLock;
  window.releaseEstimateRequestEditLock = releaseEstimateRequestEditLock;

  function decorateEstimateRequestLocks() {
    document.querySelectorAll("#estimateWorkflowBoard tr[data-request-id]").forEach(row => {
      const id = row.dataset.requestId || "";
      const lock = getRequestLock(id);
      row.classList.toggle("is-editing-locked", !!lock);
      row.querySelector(".request-edit-lock")?.remove();
      if (!lock) return;
      const target = row.querySelector("td[data-request-field='requestNo']") || row.querySelector("td");
      target?.insertAdjacentHTML("beforeend", `<span class="request-edit-lock">${lock.owner === sessionId ? "편집중" : "다른 사용자 편집중"}</span>`);
    });
  }

  if (typeof renderEstimateRequestManage === "function") {
    const baseRenderEstimateRequestManage = renderEstimateRequestManage;
    renderEstimateRequestManage = function renderEstimateRequestManage260610() {
      ensureEstimateRequestNumbers();
      const result = baseRenderEstimateRequestManage();
      decorateEstimateRequestLocks();
      return result;
    };
    window.renderEstimateRequestManage = renderEstimateRequestManage;
  }

  window.addEventListener("storage", event => {
    if (String(event.key || "").startsWith(REQUEST_LOCK_PREFIX)) decorateEstimateRequestLocks();
  });

  function findRequestForPeriodRow(row = {}) {
    const rows = ensureEstimateRequestNumbers();
    const ids = new Set([
      row.requestId,
      row.sourceEstimateId,
      row.estimateId,
      row.periodKey,
      row.centralKey
    ].filter(Boolean).map(String));
    let request = rows.find(item => [item.id, item.estimateId, item.periodKey, item.centralKey].filter(Boolean).some(id => ids.has(String(id))));
    if (request) return request;
    const project = compact(row.project);
    const company = compact(row.company || row.companyRaw);
    return rows.find(item => {
      const sameProject = project && compact(item.project) === project;
      const sameCompany = !company || !compact(item.company) || compact(item.company) === company;
      return sameProject && sameCompany;
    }) || null;
  }

  const periodViewState = {
    sortKey: "",
    direction: "desc",
    filters: {}
  };

  function configureEstimatePeriodColumns() {
    if (typeof ESTIMATE_PERIOD_COLUMNS === "undefined" || ESTIMATE_PERIOD_COLUMNS.__departmentConfigured) return;
    const byKey = key => ESTIMATE_PERIOD_COLUMNS.find(column => column.key === key) || { key, label: key, width: 100 };
    const columns = [
      { key: "requestNo", label: "의뢰번호", width: 116, align: "center", cls: "request-no" },
      { ...byKey("date"), label: "제출일" },
      byKey("company"),
      byKey("project"),
      byKey("area"),
      byKey("unitPrice"),
      byKey("amount"),
      byKey("scope"),
      byKey("usage"),
      byKey("count"),
      byKey("unitWork"),
      byKey("bid"),
      byKey("description"),
      { ...byKey("tender"), label: "투찰구분" },
      byKey("status"),
      byKey("memo"),
      { ...byKey("detail"), label: "견적서", width: 92 },
      { key: "requestMemo", label: "의뢰등록(메모장)", width: 132, align: "center", type: "requestMemo" }
    ];
    ESTIMATE_PERIOD_COLUMNS.splice(0, ESTIMATE_PERIOD_COLUMNS.length, ...columns);
    ESTIMATE_PERIOD_COLUMNS.__departmentConfigured = true;
  }
  configureEstimatePeriodColumns();

  if (typeof estimatePeriodAllRowsForList === "function") {
    const baseEstimatePeriodAllRowsForList = estimatePeriodAllRowsForList;
    estimatePeriodAllRowsForList = function estimatePeriodAllRowsForList260610() {
      return baseEstimatePeriodAllRowsForList().map(row => {
        const request = findRequestForPeriodRow(row);
        return {
          ...row,
          requestNo: request?.requestNo || row.requestNo || "",
          requestId: request?.id || row.requestId || "",
          requestMemo: request?.id || ""
        };
      });
    };
    window.estimatePeriodAllRowsForList = estimatePeriodAllRowsForList;
  }

  if (typeof estimatePeriodSortRowsDesc === "function") {
    const baseEstimatePeriodSortRowsDesc = estimatePeriodSortRowsDesc;
    estimatePeriodSortRowsDesc = function estimatePeriodSortRowsDesc260610(rows = []) {
      if (!periodViewState.sortKey) return baseEstimatePeriodSortRowsDesc(rows);
      const key = periodViewState.sortKey;
      const direction = periodViewState.direction === "asc" ? 1 : -1;
      return [...rows].sort((a, b) => {
        const left = ["area", "unitPrice", "amount"].includes(key) ? numberValue(a?.[key]) : text(a?.[key]).toLowerCase();
        const right = ["area", "unitPrice", "amount"].includes(key) ? numberValue(b?.[key]) : text(b?.[key]).toLowerCase();
        if (left === right) return 0;
        return left > right ? direction : -direction;
      });
    };
    window.estimatePeriodSortRowsDesc = estimatePeriodSortRowsDesc;
  }

  if (typeof estimatePeriodFilterRows === "function") {
    const baseEstimatePeriodFilterRows = estimatePeriodFilterRows;
    estimatePeriodFilterRows = function estimatePeriodFilterRows260610(rows = []) {
      return baseEstimatePeriodFilterRows(rows).filter(row => Object.entries(periodViewState.filters).every(([key, query]) => {
        if (!query) return true;
        return text(row?.[key]).toLowerCase().includes(String(query).toLowerCase());
      }));
    };
    window.estimatePeriodFilterRows = estimatePeriodFilterRows;
  }

  function openEstimatePeriodRequestMemo(rowId) {
    const row = (typeof estimatePeriodAllRowsForList === "function" ? estimatePeriodAllRowsForList() : [])
      .find(item => String(item.id) === String(rowId));
    const request = row ? findRequestForPeriodRow(row) : null;
    if (!request) {
      showToast?.("연결된 의뢰등록 메모를 찾지 못했습니다.");
      return;
    }
    openEstimateRequestMemoWindow?.(request.id);
  }
  window.openEstimatePeriodRequestMemo = openEstimatePeriodRequestMemo;

  function decorateEstimatePeriodTable() {
    const table = document.querySelector("#estimatePeriodSheetBody .estimate-period-manage-table");
    if (!table || typeof ESTIMATE_PERIOD_COLUMNS === "undefined") return;
    const headerRow = table.tHead?.rows?.[0];
    if (!headerRow) return;

    Array.from(headerRow.cells).forEach((cell, index) => {
      const column = ESTIMATE_PERIOD_COLUMNS[index];
      if (!column) return;
      cell.dataset.periodColumn = column.key;
      const active = periodViewState.sortKey === column.key;
      const arrow = active ? (periodViewState.direction === "asc" ? "▲" : "▼") : "↕";
      cell.innerHTML = `
        <button type="button" class="period-column-sort" data-sort-key="${html(column.key)}">${html(column.label)} <span>${arrow}</span></button>
        ${["detail", "requestMemo"].includes(column.key) ? "" : `<input class="period-column-filter" data-filter-key="${html(column.key)}" value="${html(periodViewState.filters[column.key] || "")}" placeholder="필터" aria-label="${html(column.label)} 필터">`}
      `;
    });

    headerRow.querySelectorAll(".period-column-sort").forEach(button => {
      button.addEventListener("click", () => {
        const key = button.dataset.sortKey || "";
        if (periodViewState.sortKey === key) periodViewState.direction = periodViewState.direction === "asc" ? "desc" : "asc";
        else {
          periodViewState.sortKey = key;
          periodViewState.direction = "asc";
        }
        renderEstimatePeriodManage?.();
      });
    });
    headerRow.querySelectorAll(".period-column-filter").forEach(input => {
      input.addEventListener("click", event => event.stopPropagation());
      input.addEventListener("input", () => {
        periodViewState.filters[input.dataset.filterKey || ""] = input.value;
        window.clearTimeout(input.__periodFilterTimer);
        input.__periodFilterTimer = window.setTimeout(() => renderEstimatePeriodManage?.(), 180);
      });
    });

    const requestNoIndex = ESTIMATE_PERIOD_COLUMNS.findIndex(column => column.key === "requestNo");
    const requestMemoIndex = ESTIMATE_PERIOD_COLUMNS.findIndex(column => column.key === "requestMemo");
    table.tBodies?.[0]?.querySelectorAll("tr[data-period-row-id]").forEach(row => {
      const rowId = row.dataset.periodRowId || "";
      if (requestNoIndex >= 0) {
        const input = row.cells[requestNoIndex]?.querySelector("input");
        if (input) {
          input.readOnly = true;
          input.title = "견적 의뢰관리에서 자동 연동되는 의뢰번호입니다.";
        }
      }
      if (requestMemoIndex >= 0 && row.cells[requestMemoIndex]) {
        row.cells[requestMemoIndex].className = "center";
        row.cells[requestMemoIndex].innerHTML = `<button class="estimate-period-request-btn" type="button" onclick="event.stopPropagation();openEstimatePeriodRequestMemo('${html(rowId)}')">의뢰등록 보기</button>`;
      }
    });
  }

  if (typeof renderEstimatePeriodManage === "function") {
    const baseRenderEstimatePeriodManage = renderEstimatePeriodManage;
    renderEstimatePeriodManage = function renderEstimatePeriodManage260610() {
      configureEstimatePeriodColumns();
      const result = baseRenderEstimatePeriodManage();
      decorateEstimatePeriodTable();
      return result;
    };
    window.renderEstimatePeriodManage = renderEstimatePeriodManage;
  }

  function loadMepMeta() {
    try {
      const data = JSON.parse(localStorage.getItem(MEP_META_KEY) || "{}");
      return data && typeof data === "object" ? data : {};
    } catch (_) {
      return {};
    }
  }
  function saveMepMeta(meta) {
    localStorage.setItem(MEP_META_KEY, JSON.stringify(meta || {}));
  }
  function mepIndex(name) {
    return typeof getEstimateDbColumnIndexByHeader === "function" ? getEstimateDbColumnIndexByHeader("mep", name) : -1;
  }
  function mepCell(row, name) {
    const index = mepIndex(name);
    return index >= 0 ? row?.[index] : "";
  }
  function setMepCell(row, name, value) {
    const index = mepIndex(name);
    if (index >= 0 && row) row[index] = value;
  }
  function mepRowKey(vendorName, row, sourceIndex) {
    const identity = compact(mepCell(row, "PJ NO")) || compact(mepCell(row, "PJ명")) || `row-${sourceIndex}`;
    return [compact(vendorName), identity].join("::");
  }
  function mepPaid(row) {
    const entered = numberValue(mepCell(row, "기지급액"));
    if (entered) return entered;
    return [1, 2, 3, 4, 5, 6].reduce((sum, order) => sum + numberValue(mepCell(row, `지급금액${order}`)), 0);
  }
  function mepReceivedRate(row) {
    let rate = numberValue(mepCell(row, "받은비율"));
    if (rate > 1) rate /= 100;
    if (!rate) {
      const contract = numberValue(mepCell(row, "컨코스트계약금"));
      const received = numberValue(mepCell(row, "수령액"));
      if (contract) rate = received / contract;
    }
    return Math.max(0, rate);
  }
  function mepPaymentDetails(row) {
    return [1, 2, 3, 4, 5, 6].map(order => {
      const amount = numberValue(mepCell(row, `지급금액${order}`));
      const date = text(mepCell(row, `지급일자${order}`));
      return amount || date ? `${date || "날짜 미입력"}: ₩${money(amount)}` : "";
    }).filter(Boolean).join("\n");
  }
  function getMepDisplayRows(vendorIndex) {
    const vendor = ensureEstimateDbMepVendorRows?.()[Number(vendorIndex)] || null;
    const vendorName = getEstimateDbMepVendorName?.(vendor) || "";
    const meta = loadMepMeta();
    return (getEstimateDbMepDetailRowsForVendor?.(vendorName) || []).map(({ row, sourceIndex }, index) => {
      const key = mepRowKey(vendorName, row, sourceIndex);
      const extra = meta[key] || {};
      const contract = numberValue(mepCell(row, "계약금액"));
      const paid = mepPaid(row);
      const receivedRate = mepReceivedRate(row);
      const actualRate = extra.actualRate === "" || extra.actualRate === undefined ? receivedRate : numberValue(extra.actualRate);
      return {
        key,
        sourceIndex,
        no: index + 1,
        project: text(mepCell(row, "PJ명")) || text(mepCell(row, "PJ NO")),
        contract,
        paid,
        balance: contract - paid,
        paymentRate: contract ? paid / contract : 0,
        unpaid: contract * receivedRate - paid,
        receivedRate,
        actualUnpaid: contract * actualRate - paid,
        actualRate,
        notes: extra.notes || "",
        paymentDetails: extra.paymentDetails || mepPaymentDetails(row),
        status: extra.status || "",
        hidden: !!extra.hidden
      };
    });
  }

  function updateDepartmentMepCell(sourceIndex, vendorIndex, field, value) {
    const sheet = estimateDbSheets?.mep;
    const row = sheet?.rows?.[Number(sourceIndex)];
    const vendor = ensureEstimateDbMepVendorRows?.()[Number(vendorIndex)] || null;
    const vendorName = getEstimateDbMepVendorName?.(vendor) || "";
    if (!row) return;
    if (field === "contract") setMepCell(row, "계약금액", numberValue(value) || "");
    else if (field === "paid") setMepCell(row, "기지급액", numberValue(value) || "");
    else if (field === "receivedRate") setMepCell(row, "받은비율", Math.max(0, numberValue(value) / (numberValue(value) > 1 ? 100 : 1)) || "");
    else {
      const meta = loadMepMeta();
      const key = mepRowKey(vendorName, row, Number(sourceIndex));
      meta[key] = { ...(meta[key] || {}) };
      if (field === "actualRate") meta[key].actualRate = Math.max(0, numberValue(value) / (numberValue(value) > 1 ? 100 : 1));
      else meta[key][field] = value;
      saveMepMeta(meta);
    }
    recalcEstimateDbRow?.("mep", row);
    estimateDbHasUnsavedChanges = true;
    updateEstimateDbSaveButtonState?.();
  }

  function toggleDepartmentMepHidden(sourceIndex, vendorIndex) {
    const sheet = estimateDbSheets?.mep;
    const row = sheet?.rows?.[Number(sourceIndex)];
    const vendor = ensureEstimateDbMepVendorRows?.()[Number(vendorIndex)] || null;
    const vendorName = getEstimateDbMepVendorName?.(vendor) || "";
    if (!row) return;
    const meta = loadMepMeta();
    const key = mepRowKey(vendorName, row, Number(sourceIndex));
    meta[key] = { ...(meta[key] || {}), hidden: !meta[key]?.hidden };
    saveMepMeta(meta);
  }
  window.updateDepartmentMepCell = updateDepartmentMepCell;
  window.toggleDepartmentMepHidden = toggleDepartmentMepHidden;

  function buildDepartmentMepRowsHtml(vendorIndex) {
    const rows = getMepDisplayRows(vendorIndex);
    if (!rows.length) return `<tr><td colspan="14" class="empty">연결된 계약/지급 내역이 없습니다. [+ 프로젝트 행 추가]를 눌러 시작하세요.</td></tr>`;
    return rows.map(row => `
      <tr data-source-index="${row.sourceIndex}" data-hidden="${row.hidden ? "1" : "0"}" class="${row.hidden ? "is-hidden-row" : ""}">
        <td class="center">${row.no}</td>
        <td><input data-field="project" value="${html(row.project)}" readonly></td>
        <td><input data-field="contract" value="${html(money(row.contract))}" onchange="saveCell(this)"></td>
        <td><input data-field="paid" value="${html(money(row.paid))}" onchange="saveCell(this)"></td>
        <td class="auto-cell" data-calc="balance">${money(row.balance)}</td>
        <td class="auto-cell" data-calc="paymentRate">${percent(row.paymentRate)}</td>
        <td class="auto-cell" data-calc="unpaid">${money(row.unpaid)}</td>
        <td><input data-field="receivedRate" value="${html(percent(row.receivedRate))}" onchange="saveCell(this)"></td>
        <td class="auto-cell" data-calc="actualUnpaid">${money(row.actualUnpaid)}</td>
        <td><input data-field="actualRate" value="${html(percent(row.actualRate))}" onchange="saveCell(this)"></td>
        <td><textarea data-field="notes" onchange="saveCell(this)">${html(row.notes)}</textarea></td>
        <td><textarea data-field="paymentDetails" onchange="saveCell(this)">${html(row.paymentDetails)}</textarea></td>
        <td><input data-field="status" value="${html(row.status)}" onchange="saveCell(this)" placeholder="대기중/처리완료"></td>
        <td class="manage"><button type="button" onclick="toggleHidden(${row.sourceIndex})">${row.hidden ? "숨김 해제" : "행 숨기기"}</button></td>
      </tr>
    `).join("");
  }
  window.buildDepartmentMepRowsHtml = buildDepartmentMepRowsHtml;

  function buildDepartmentMepTotalHtml(vendorIndex) {
    const visible = getMepDisplayRows(vendorIndex).filter(row => !row.hidden);
    const sum = key => visible.reduce((total, row) => total + numberValue(row[key]), 0);
    return `
      <tr>
        <th></th><th>VISIBLE TOTAL (${visible.length}건)</th>
        <th>${money(sum("contract"))}</th>
        <th>${money(sum("paid"))}</th>
        <th>${money(sum("balance"))}</th>
        <th>${percent(sum("contract") ? sum("paid") / sum("contract") : 0)}</th>
        <th>${money(sum("unpaid"))}</th>
        <th></th>
        <th>${money(sum("actualUnpaid"))}</th>
        <th></th><th></th><th></th><th></th><th></th>
      </tr>`;
  }
  window.buildDepartmentMepTotalHtml = buildDepartmentMepTotalHtml;

  function buildEstimateDbMepVendorDetailWindowHtml260610(vendorIndex) {
    const vendor = ensureEstimateDbMepVendorRows?.()[Number(vendorIndex)] || null;
    const vendorName = getEstimateDbMepVendorName?.(vendor) || "기전업체";
    const headers = ["NO", "프로젝트명", "계약금", "기지급금", "잔여금", "지급 비율", "수금 대비 미지급 금액", "컨코스트 수금 비율", "수금 대비 미지급 금액 (실제)", "실제 수금 비율", "비고", "지급처리 내용", "처리여부", "관리"];
    return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${html(vendorName)} 계약현황 및 잔액확인</title>
      <style>
        *{box-sizing:border-box}body{margin:0;background:#f4f7fb;color:#111827;font-family:Inter,'Malgun Gothic',sans-serif;font-size:13px}
        .top{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;gap:18px;padding:16px 20px;background:#fff;border-bottom:1px solid #dce4ef}
        h1{margin:0;font-size:22px}.sub{margin-top:5px;color:#64748b;font-weight:700}.actions{display:flex;gap:7px;flex-wrap:wrap}
        button{height:35px;border:1px solid #cfd9e7;border-radius:10px;background:#fff;padding:0 13px;font-weight:900;cursor:pointer}button.primary{background:#f97316;border-color:#f97316;color:#fff}
        .wrap{padding:18px}.legend{display:flex;gap:12px;margin-bottom:10px;color:#475569;font-weight:800}.legend i{width:14px;height:14px;border-radius:4px;display:inline-block;vertical-align:-2px;margin-right:5px}.legend .auto{background:#dcfce7}.legend .input{background:#fff;border:1px solid #cbd5e1}
        .card{background:#fff;border:1px solid #dbe3ee;border-radius:16px;box-shadow:0 12px 28px rgba(15,23,42,.08);overflow:hidden}.table-wrap{overflow:auto;max-height:calc(100vh - 190px)}
        table{border-collapse:separate;border-spacing:0;min-width:1900px;width:100%;table-layout:fixed}col{width:130px}col:nth-child(1){width:60px}col:nth-child(2){width:360px}col:nth-child(11){width:260px}col:nth-child(12){width:260px}col:nth-child(14){width:100px}
        th,td{border-right:1px solid #dbe3ee;border-bottom:1px solid #dbe3ee;padding:6px;vertical-align:middle}thead th{position:sticky;top:0;z-index:5;background:#eef2f7;font-size:12px;font-weight:900;text-align:center;height:48px}tfoot th{position:sticky;bottom:0;background:#111827;color:#fff;z-index:6;text-align:right}
        td input,td textarea{width:100%;border:1px solid #cbd5e1;border-radius:8px;background:#fff;padding:6px 8px;font:inherit;font-weight:800}td input{height:32px;text-align:right}td textarea{height:54px;resize:vertical;line-height:1.35}td:nth-child(2) input{text-align:left}
        .auto-cell{background:#dcfce7;color:#166534;font-weight:900;text-align:right}.center{text-align:center}.manage{text-align:center}.manage button{height:30px;padding:0 8px;font-size:11px}.is-hidden-row{display:none}.show-hidden .is-hidden-row{display:table-row;opacity:.48}.empty{text-align:center;padding:32px;color:#64748b;font-weight:900}
        .resizer{position:absolute;right:-3px;top:0;width:7px;height:100%;cursor:col-resize}.print-title{display:none}
        @media print{body{background:#fff}.top,.legend,.manage{display:none!important}.wrap{padding:0}.card{border:0;box-shadow:none}.table-wrap{overflow:visible;max-height:none}table{min-width:0;font-size:9px}.is-hidden-row{display:none!important}thead th,tfoot th{position:static}.print-title{display:block;margin:0 0 12px;font-size:18px}}
      </style></head><body>
      <div class="top"><div><h1>프로젝트 계약현황 및 잔액확인</h1><div class="sub">${html(vendorName)} · 숨긴 행은 합계와 내보내기에서 제외됩니다.</div></div>
        <div class="actions"><button onclick="toggleHiddenView()">숨긴 행 보기</button><button onclick="exportExcel()">엑셀 내보내기</button><button onclick="window.print()">PDF 내보내기</button><button onclick="refreshRows()">새로고침</button><button class="primary" onclick="addRow()">+ 프로젝트 행 추가</button><button onclick="window.close()">닫기</button></div></div>
      <div class="wrap"><h2 class="print-title">${html(vendorName)} 프로젝트 계약현황 및 잔액확인</h2><div class="legend"><span><i class="auto"></i>초록색: 자동 계산</span><span><i class="input"></i>흰색: 직접 입력</span></div>
        <div class="card"><div class="table-wrap"><table id="mepSampleTable"><colgroup>${headers.map((_, index) => `<col data-col="${index}">`).join("")}</colgroup>
          <thead><tr>${headers.map((header, index) => `<th>${html(header)}<span class="resizer" data-resize="${index}"></span></th>`).join("")}</tr></thead>
          <tbody id="mepSampleBody">${buildDepartmentMepRowsHtml(vendorIndex)}</tbody>
          <tfoot id="mepSampleTotal">${buildDepartmentMepTotalHtml(vendorIndex)}</tfoot>
        </table></div></div></div>
      <script>
        const VENDOR_INDEX=${Number(vendorIndex) || 0};
        function refreshRows(){
          if(!window.opener)return;
          document.getElementById('mepSampleBody').innerHTML=window.opener.buildDepartmentMepRowsHtml(VENDOR_INDEX);
          document.getElementById('mepSampleTotal').innerHTML=window.opener.buildDepartmentMepTotalHtml(VENDOR_INDEX);
        }
        function saveCell(input){
          const row=input.closest('tr'); if(!row||!window.opener)return;
          window.opener.updateDepartmentMepCell(Number(row.dataset.sourceIndex),VENDOR_INDEX,input.dataset.field,input.value);
          refreshRows();
        }
        function toggleHidden(sourceIndex){window.opener?.toggleDepartmentMepHidden(sourceIndex,VENDOR_INDEX);refreshRows()}
        function toggleHiddenView(){document.body.classList.toggle('show-hidden')}
        function addRow(){const result=window.opener?.addEstimateDbMepRowForVendorIndex?.(VENDOR_INDEX);if(result?.ok===false)alert(result.message||'행을 추가하지 못했습니다.');refreshRows()}
        function staticTableHtml(){
          const clone=document.getElementById('mepSampleTable').cloneNode(true);
          clone.querySelectorAll('tr[data-hidden="1"]').forEach(row=>row.remove());
          clone.querySelectorAll('.manage').forEach(cell=>cell.remove());
          clone.querySelectorAll('input,textarea').forEach(input=>{const span=document.createElement('span');span.textContent=input.value;input.replaceWith(span)});
          clone.querySelectorAll('.resizer').forEach(item=>item.remove());
          return clone.outerHTML;
        }
        function exportExcel(){
          const content='<html><head><meta charset="utf-8"><style>table{border-collapse:collapse}th,td{border:1px solid #777;padding:6px}.auto-cell{background:#dcfce7}</style></head><body><h2>${html(vendorName)} 프로젝트 계약현황 및 잔액확인</h2>'+staticTableHtml()+'</body></html>';
          const blob=new Blob(['\\ufeff',content],{type:'application/vnd.ms-excel;charset=utf-8'});
          const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='${String(vendorName).replace(/['"<>]/g, "")}_계약현황.xls';link.click();URL.revokeObjectURL(link.href);
        }
        function initResize(){
          const table=document.getElementById('mepSampleTable');
          table.querySelectorAll('[data-resize]').forEach(handle=>handle.addEventListener('mousedown',event=>{
            event.preventDefault();const index=Number(handle.dataset.resize);const col=table.querySelector('col[data-col="'+index+'"]');const startX=event.clientX;const startWidth=col.getBoundingClientRect().width;
            const move=e=>{col.style.width=Math.max(60,startWidth+e.clientX-startX)+'px'};const up=()=>{document.removeEventListener('mousemove',move);document.removeEventListener('mouseup',up)};
            document.addEventListener('mousemove',move);document.addEventListener('mouseup',up);
          }));
        }
        initResize();
      <\/script></body></html>`;
  }

  buildEstimateDbMepVendorDetailWindowHtml = buildEstimateDbMepVendorDetailWindowHtml260610;
  window.buildEstimateDbMepVendorDetailWindowHtml = buildEstimateDbMepVendorDetailWindowHtml260610;
  openEstimateDbMepVendorDetailWindow = function openEstimateDbMepVendorDetailWindow260610(vendorIndex) {
    estimateDbMepSelectedVendorIndex = Number(vendorIndex);
    const vendor = ensureEstimateDbMepVendorRows?.()[Number(vendorIndex)] || null;
    const vendorName = getEstimateDbMepVendorName?.(vendor) || "기전업체";
    const safeName = String(vendorName).replace(/[^a-zA-Z0-9가-힣_-]/g, "_").slice(0, 40) || "mep_vendor";
    const win = window.open("", `CONCOST_MEP_VENDOR_${safeName}`, "width=1700,height=920,left=30,top=30,resizable=yes,scrollbars=yes");
    if (!win) {
      showToast?.("팝업 차단을 해제해 주세요.");
      return;
    }
    win.document.open();
    win.document.write(buildEstimateDbMepVendorDetailWindowHtml260610(vendorIndex));
    win.document.close();
    win.focus?.();
  };
  window.openEstimateDbMepVendorDetailWindow = openEstimateDbMepVendorDetailWindow;

  function decorateEstimateDbScreen() {
    const noteHost = document.querySelector("#estimateDbManage .quote-db-tabs");
    if (noteHost && !document.getElementById("estimateDbPersonalSettingNote")) {
      noteHost.insertAdjacentHTML("afterend", `<div id="estimateDbPersonalSettingNote" class="estimate-db-personal-setting-note">열 너비·행 높이·열 위치는 현재 브라우저 사용자별로 저장됩니다.</div>`);
    }
    if (typeof estimateDbActiveTab !== "undefined" && estimateDbActiveTab === "pj") {
      document.querySelectorAll("#estimateDbHead th").forEach(th => {
        if (text(th.textContent) === "최초생성날짜") {
          th.textContent = "의뢰번호";
          th.title = "견적 의뢰관리에서 YYMMDD-01 형식으로 자동 연동됩니다.";
        }
      });
    }
    const openButton = document.getElementById("estimateDbMepQuickOpenBtn");
    if (openButton) openButton.textContent = "샘플형 계약현황 열기";
  }

  function ensurePjThirdDeliveryColumn() {
    const sheet = typeof estimateDbSheets !== "undefined" ? estimateDbSheets?.pj : null;
    if (!sheet?.headerRows?.[0]) return;
    const columns = typeof getEstimateDbLeafColumns === "function" ? getEstimateDbLeafColumns(sheet) : sheet.headerRows[0];
    if (columns.some(column => text(column) === "3차납품예정일")) return;
    let insertAt = columns.findIndex(column => text(column) === "상담 / 이메일 / 특기사항");
    if (insertAt < 0) insertAt = columns.length;
    sheet.headerRows.forEach((row, rowIndex) => row.splice(insertAt, 0, rowIndex === 0 ? "3차납품예정일" : ""));
    if (Array.isArray(sheet.requestRow)) sheet.requestRow.splice(insertAt, 0, "3차 납품 예정일 입력란");
    (sheet.rows || []).forEach(row => row.splice(insertAt, 0, ""));
  }

  if (typeof renderEstimateDbManage === "function") {
    const baseRenderEstimateDbManage = renderEstimateDbManage;
    renderEstimateDbManage = function renderEstimateDbManage260610(options = {}) {
      ensurePjThirdDeliveryColumn();
      const result = baseRenderEstimateDbManage(options);
      decorateEstimateDbScreen();
      return result;
    };
    window.renderEstimateDbManage = renderEstimateDbManage;
  }

  function migrateRequestNumbersToPj() {
    const requests = ensureEstimateRequestNumbers();
    const sheet = typeof estimateDbSheets !== "undefined" ? estimateDbSheets?.pj : null;
    const headers = sheet?.headerRows?.[0] || [];
    const firstIndex = headers.indexOf("최초생성날짜");
    const projectIndex = headers.indexOf("프로젝트명");
    const companyIndex = headers.indexOf("거래처명");
    if (firstIndex < 0 || !Array.isArray(sheet?.rows)) return;
    sheet.rows.forEach(row => {
      const request = requests.find(item => compact(item.project) === compact(row?.[projectIndex]) && (!compact(item.company) || compact(item.company) === compact(row?.[companyIndex])));
      if (request?.requestNo) row[firstIndex] = request.requestNo;
    });
  }

  function enhanceProjectReceiveScreen() {
    const materialCard = document.querySelector("#projectReceive .project-receive-material-card");
    if (materialCard && !materialCard.querySelector(".qc-detail-check-note")) {
      materialCard.querySelector(".project-receive-card-head")?.insertAdjacentHTML("afterend", `<div class="qc-detail-check-note">접수자료 상세 체크는 Q/C팀 확인 대상입니다. 자료별 상태·코멘트·확인자를 기록해 주세요.</div>`);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureEstimateRequestNumbers();
    ensurePjThirdDeliveryColumn();
    migrateRequestNumbersToPj();
    enhanceProjectReceiveScreen();
    window.setTimeout(() => {
      if (document.getElementById("estimateRequestManage")?.classList.contains("active")) renderEstimateRequestManage?.();
      if (document.getElementById("estimatePeriodManage")?.classList.contains("active")) renderEstimatePeriodManage?.();
      if (document.getElementById("estimateDbManage")?.classList.contains("active")) renderEstimateDbManage?.();
    }, 180);
  });
})();
