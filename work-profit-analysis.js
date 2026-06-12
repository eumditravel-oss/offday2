/* =============================================================
   수지분석 (Profit & Loss Analysis) Module  v1.0
   - 프로젝트별 수주금액(A) vs 발생비용(B) 분석
   - 1차/2차/3차 투입현황 관리 (인원별 일자별 캘린더)
   - 직급별 단가 연동 (일일표시트 단가 기준)
   - centralProjectStore와 통합
   - 권한별 접근 제어 (경영지원본부/QC/실장/PM/Staff)
============================================================= */
(function () {
  'use strict';

  // ════════════════════════════════════════════
  // 1. 상수 정의
  // ════════════════════════════════════════════
  const LABOR_CATEGORIES = ['구조공사', '마감/인테리어공사', '토목/조경공사'];
  const OTHER_CATEGORIES = ['기계공사', '전기공사', '외주', 'AS'];
  const ALL_CATEGORIES   = [...LABOR_CATEGORIES, ...OTHER_CATEGORIES];

  const GRADES = [
    { label: '본부장', key: '본부장', rank: 1 },
    { label: '실장',   key: '실장',   rank: 2 },
    { label: '팀장',   key: '팀장',   rank: 3 },
    { label: '파트장', key: '파트장', rank: 4 },
    { label: '수석',   key: '수석',   rank: 5 },
    { label: '책임',   key: '책임',   rank: 6 },
    { label: '선임',   key: '선임',   rank: 7 },
    { label: '프로',   key: '프로',   rank: 8 },
    { label: '베트남', key: '베트남', rank: 9 },
  ];
  const GRADE_KEYS = GRADES.map(g => g.key);

  const ROLE_LEVEL = {
    '경영지원': 5,
    'QC':       4,
    '실장':     3,
    'PM':       2,
    'Staff':    1,
  };

  const UNIT_PRICE_KEY = 'concost.profitAnalysis.unitPrices.v1';

  let _state = {
    currentProjectUid: null,
    currentRound: 1,
    unitPricesVisible: false,
    currentUserRole: '경영지원',
  };

  function getProjects() {
    return (window.centralProjectStore?.getProjects() || []);
  }

  function getAnalysis(projectUid) {
    const project = window.centralProjectStore?.getProject(projectUid);
    if (!project) return null;
    return project.profitAnalysis
      ? JSON.parse(JSON.stringify(project.profitAnalysis))
      : createEmptyAnalysis(projectUid);
  }

  function createEmptyAnalysis(projectUid) {
    return {
      projectUid,
      contractAmounts: Object.fromEntries(ALL_CATEGORIES.map(c => [c, 0])),
      rounds: [1, 2, 3].map(n => ({
        roundNo: n,
        startDate: '',
        endDate: '',
        members: [],
        otherCosts: Object.fromEntries(OTHER_CATEGORIES.map(c => [c, 0])),
      })),
      updatedAt: '',
    };
  }

  function getUnitPrices() {
    try {
      return JSON.parse(localStorage.getItem(UNIT_PRICE_KEY) || '{}');
    } catch (_) { return {}; }
  }

  function saveUnitPrices(prices) {
    try { localStorage.setItem(UNIT_PRICE_KEY, JSON.stringify(prices)); } catch (_) {}
    if (typeof showToast === 'function') showToast('단가 설정이 저장되었습니다.');
  }

  function saveAnalysis(projectUid, analysis) {
    if (!window.centralProjectStore) return;
    analysis.updatedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    window.centralProjectStore.mutateProject(
      projectUid,
      project => { project.profitAnalysis = analysis; },
      '수지분석 업데이트'
    );
  }
  function calcMember(member, unitPrices) {
    const days = Object.values(member.workDays || {}).filter(Boolean).length;
    const unitPrice = unitPrices[member.grade] || 0;
    return { days, cost: days * unitPrice, unitPrice };
  }

  function calcRound(round, unitPrices) {
    const byCat = {};
    ALL_CATEGORIES.forEach(c => { byCat[c] = { days: 0, cost: 0, memberRows: [] }; });
    (round.members || []).forEach(m => {
      const { days, cost, unitPrice } = calcMember(m, unitPrices);
      const cat = m.category || '구조공사';
      if (!byCat[cat]) byCat[cat] = { days: 0, cost: 0, memberRows: [] };
      byCat[cat].days += days;
      byCat[cat].cost += cost;
      byCat[cat].memberRows.push({ ...m, _days: days, _cost: cost, _unitPrice: unitPrice });
    });
    OTHER_CATEGORIES.forEach(c => {
      byCat[c].cost = round.otherCosts?.[c] || 0;
    });
    const total = Object.values(byCat).reduce((s, v) => s + v.cost, 0);
    return { byCat, total };
  }

  function calcSummary(analysis, unitPrices) {
    const contractTotal = Object.values(analysis.contractAmounts || {}).reduce((s, v) => s + (v || 0), 0);
    const roundSummaries = (analysis.rounds || []).map(r => calcRound(r, unitPrices));
    const byCat = {};
    ALL_CATEGORIES.forEach(c => {
      byCat[c] = {
        contractAmount: analysis.contractAmounts?.[c] || 0,
        roundCosts: roundSummaries.map(rs => rs.byCat[c]?.cost || 0),
        totalCost: roundSummaries.reduce((s, rs) => s + (rs.byCat[c]?.cost || 0), 0),
      };
    });
    const costTotal = Object.values(byCat).reduce((s, v) => s + v.totalCost, 0);
    return { contractTotal, costTotal, result: contractTotal - costTotal, byCat, roundTotals: roundSummaries.map(rs => rs.total) };
  }

  function injectStyles() {
    if (document.getElementById('pa-style')) return;
    const style = document.createElement('style');
    style.id = 'pa-style';
    style.textContent = `
/* ── 수지분석 레이아웃 ── */
.pa-wrap { font-family: inherit; color: #1e2327; }
.pa-header { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:2px solid #e5e7eb; background:#fafafa; }
.pa-header-left { display:flex; align-items:center; gap:10px; }
.pa-badge { background:#1e3a5f; color:#fff; font-size:11px; font-weight:700; padding:3px 8px; border-radius:4px; letter-spacing:.5px; }
.pa-project-select { border:1px solid #d1d5db; border-radius:6px; padding:5px 10px; font-size:13px; background:#fff; min-width:220px; }
.pa-header-actions { display:flex; gap:8px; }
.pa-btn { cursor:pointer; border:none; border-radius:6px; padding:6px 14px; font-size:12px; font-weight:600; background:#1e3a5f; color:#fff; transition:.15s; }
.pa-btn:hover { background:#2d5080; }
.pa-btn-sm { padding:4px 10px; font-size:11px; }
.pa-btn-ghost { background:transparent; color:#1e3a5f; border:1px solid #1e3a5f; }
.pa-btn-ghost:hover { background:#e8f0fe; }
.pa-btn-danger { background:#dc2626; }
.pa-btn-danger:hover { background:#b91c1c; }
.pa-summary-section { padding:16px; }
.pa-section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.pa-section-title { font-size:14px; font-weight:700; color:#1e3a5f; }
.pa-result { font-size:15px; font-weight:800; padding:6px 14px; border-radius:6px; }
.pa-result.positive { background:#dcfce7; color:#15803d; }
.pa-result.negative { background:#fee2e2; color:#dc2626; }
.pa-result.zero { background:#f3f4f6; color:#6b7280; }
.pa-table-scroll { overflow-x:auto; }
.pa-table { width:100%; border-collapse:collapse; font-size:12px; }
.pa-table th { background:#1e3a5f; color:#fff; padding:7px 10px; text-align:center; white-space:nowrap; font-weight:600; }
.pa-table td { padding:6px 10px; border-bottom:1px solid #e5e7eb; vertical-align:middle; }
.pa-table tr:hover td { background:#f0f4ff; }
.pa-table .cat-row td { background:#eef2f7; font-weight:700; color:#1e3a5f; }
.pa-table .total-row td { background:#f8fafc; font-weight:800; border-top:2px solid #1e3a5f; }
.pa-amount-cell { text-align:right; font-family:monospace; }
.pa-editable { cursor:text; }
.pa-editable:focus { outline:2px solid #3b82f6; background:#fff; }
.pa-center { text-align:center; }
.pa-unit-price-box { background:#fff; border:2px solid #1e3a5f; border-radius:8px; padding:16px; margin-top:12px; }
.pa-unit-price-title { font-weight:700; font-size:13px; color:#1e3a5f; margin-bottom:10px; }
.pa-unit-price-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:8px; }
.pa-unit-price-item { display:flex; flex-direction:column; gap:3px; }
.pa-unit-price-item label { font-size:11px; color:#6b7280; font-weight:600; }
.pa-unit-price-input { border:1px solid #d1d5db; border-radius:4px; padding:4px 8px; font-size:12px; text-align:right; }
.pa-unit-price-actions { display:flex; gap:8px; margin-top:12px; }
.pa-rank-badge { font-size:10px; color:#9ca3af; }
.pa-round-section { padding:0 16px 16px; }
.pa-tabs { display:flex; gap:4px; margin-bottom:12px; border-bottom:2px solid #e5e7eb; padding-bottom:0; align-items:flex-end; }
.pa-tab { background:transparent; border:none; border-bottom:3px solid transparent; padding:8px 16px; font-size:13px; font-weight:600; cursor:pointer; color:#6b7280; margin-bottom:-2px; transition:.15s; }
.pa-tab:hover { color:#1e3a5f; }
.pa-tab.active { color:#1e3a5f; border-bottom-color:#1e3a5f; }
.pa-tab-actions { margin-left:auto; display:flex; gap:6px; padding-bottom:6px; }
.pa-period-bar { display:flex; align-items:center; gap:8px; margin-bottom:10px; background:#f8fafc; padding:8px 12px; border-radius:6px; font-size:12px; }
.pa-period-bar label { font-weight:600; color:#374151; }
.pa-date-input { border:1px solid #d1d5db; border-radius:4px; padding:4px 8px; font-size:12px; }
.pa-calendar-wrap { overflow-x:auto; }
.pa-calendar-table { border-collapse:collapse; font-size:11px; white-space:nowrap; }
.pa-calendar-table th { background:#1e3a5f; color:#fff; padding:5px 6px; text-align:center; border:1px solid #2d4a6f; min-width:28px; }
.pa-calendar-table td { padding:4px 6px; border:1px solid #e5e7eb; text-align:center; vertical-align:middle; }
.pa-calendar-table .cat-header { background:#eef2f7; font-weight:700; color:#1e3a5f; text-align:left; padding:5px 8px; }
.pa-col-grade { min-width:50px; }
.pa-col-name  { min-width:70px; text-align:left !important; }
.pa-col-price, .pa-col-cost { min-width:80px; text-align:right !important; font-family:monospace; font-size:11px; }
.pa-col-days  { min-width:36px; }
.pa-day-cell  { cursor:pointer; transition:.1s; min-width:26px; }
.pa-day-cell:hover { background:#dbeafe; }
.pa-day-cell.checked { background:#bfdbfe; }
.pa-day-cell.weekend { background:#fef3c7; }
.pa-day-cell.weekend.checked { background:#fde68a; }
.pa-day-check { width:14px; height:14px; cursor:pointer; accent-color:#1e3a5f; }
.pa-other-input { width:90px; border:1px solid #d1d5db; border-radius:4px; padding:3px 6px; font-size:11px; text-align:right; }
.pa-del-btn { background:transparent; border:none; color:#dc2626; cursor:pointer; font-size:14px; padding:0 4px; }
.pa-del-btn:hover { color:#7f1d1d; }
.pa-total-footer td { background:#eef2f7 !important; font-weight:800; border-top:2px solid #1e3a5f; }
.pa-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:9999; }
.pa-modal { background:#fff; border-radius:10px; padding:24px; min-width:320px; box-shadow:0 20px 60px rgba(0,0,0,.3); }
.pa-modal-title { font-size:16px; font-weight:700; color:#1e3a5f; margin-bottom:16px; }
.pa-modal-form { display:flex; flex-direction:column; gap:10px; }
.pa-modal-form label { font-size:12px; font-weight:600; color:#374151; }
.pa-modal-select, .pa-modal-input { border:1px solid #d1d5db; border-radius:6px; padding:7px 10px; font-size:13px; }
.pa-modal-actions { display:flex; gap:8px; margin-top:16px; justify-content:flex-end; }
.pa-role-bar { display:flex; align-items:center; gap:8px; padding:6px 16px; background:#fffbeb; border-bottom:1px solid #fcd34d; font-size:11px; }
.pa-role-pill { padding:2px 8px; border-radius:10px; font-weight:700; font-size:10px; }
.pa-role-경영지원 { background:#dbeafe; color:#1e40af; }
.pa-role-QC { background:#dcfce7; color:#166534; }
.pa-role-실장 { background:#fef3c7; color:#92400e; }
.pa-role-PM { background:#f3e8ff; color:#6b21a8; }
.pa-role-Staff { background:#f1f5f9; color:#475569; }
.pa-empty { padding:48px; text-align:center; color:#9ca3af; font-size:14px; }
.pa-no-period { padding:24px; text-align:center; color:#9ca3af; }
`;
    document.head.appendChild(style);
  }
  function render(containerId) {
    injectStyles();
    const container = document.getElementById(containerId || 'profit-analysis-root');
    if (!container) return;
    const projects = getProjects();
    if (!projects.length) {
      container.innerHTML = '<div class="pa-empty">등록된 프로젝트가 없습니다.</div>';
      return;
    }
    if (!_state.currentProjectUid || !projects.find(p => p.projectUid === _state.currentProjectUid)) {
      _state.currentProjectUid = projects[0].projectUid;
    }
    const analysis  = getAnalysis(_state.currentProjectUid) || createEmptyAnalysis(_state.currentProjectUid);
    const unitPrices = getUnitPrices();
    const summary   = calcSummary(analysis, unitPrices);
    const currentProject = projects.find(p => p.projectUid === _state.currentProjectUid);
    const canEdit = ROLE_LEVEL[_state.currentUserRole] >= ROLE_LEVEL['PM'];
    const canViewFull = ROLE_LEVEL[_state.currentUserRole] >= ROLE_LEVEL['실장'];
    container.innerHTML = `
      ${renderRoleBar()}
      <div class="pa-wrap">
        ${renderHeader(projects, currentProject)}
        ${renderSummarySection(analysis, summary, unitPrices, canEdit)}
        ${renderRoundSection(analysis, unitPrices, canEdit)}
      </div>
    `;
    _bindEvents(analysis, unitPrices, canEdit);
  }

  function renderRoleBar() {
    const role = _state.currentUserRole;
    return `
      <div class="pa-role-bar">
        <span>현재 권한:</span>
        <span class="pa-role-pill pa-role-${role}">${role}</span>
        <span style="color:#92400e;">| 수지분석은 PM 이상 편집 가능 · 경영지원/실장은 전체 조회 가능</span>
        <select id="pa-role-selector" style="margin-left:auto;font-size:11px;padding:2px 6px;border-radius:4px;border:1px solid #fcd34d;">
          ${Object.keys(ROLE_LEVEL).map(r =>
            `<option value="${r}" ${r === role ? 'selected' : ''}>${r}</option>`
          ).join('')}
        </select>
      </div>
    `;
  }

  function renderHeader(projects, currentProject) {
    return `
      <div class="pa-header">
        <div class="pa-header-left">
          <span class="pa-badge">수지분석</span>
          <select id="pa-project-select" class="pa-project-select">
            ${projects.map(p =>
              `<option value="${p.projectUid}" ${p.projectUid === _state.currentProjectUid ? 'selected' : ''}>
                ${p.projectName || '(이름없음)'} ${p.projectNo ? `[${p.projectNo}]` : ''}
               </option>`
            ).join('')}
          </select>
        </div>
        <div class="pa-header-actions">
          <button id="pa-unit-price-btn" class="pa-btn pa-btn-ghost pa-btn-sm">📋 직급단가 설정</button>
        </div>
      </div>
    `;
  }

  function renderSummarySection(analysis, summary, unitPrices, canEdit) {
    const fmt = n => (n || n === 0) ? '₩ ' + Math.round(n).toLocaleString() : '-';
    const diff = summary.result;
    const resClass = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'zero';
    return `
      <div class="pa-summary-section">
        <div class="pa-section-header">
          <span class="pa-section-title">📊 수지분석 요약</span>
          <span class="pa-result ${resClass}">결과 (A−B) : ${fmt(diff)}</span>
        </div>
        <div class="pa-table-scroll">
          <table class="pa-table">
            <thead>
              <tr>
                <th rowspan="2" style="min-width:120px">구 분</th>
                <th rowspan="2">수주금액 (A)</th>
                <th colspan="3">발생비용 (B)</th>
                <th rowspan="2">B 합계</th>
              </tr>
              <tr><th>1차</th><th>2차</th><th>3차</th></tr>
            </thead>
            <tbody>
              ${ALL_CATEGORIES.map(cat => {
                const row = summary.byCat[cat];
                const amt = analysis.contractAmounts?.[cat] || 0;
                return `
                  <tr>
                    <td>${cat}</td>
                    <td class="pa-amount-cell ${canEdit ? 'pa-editable' : ''}"
                        ${canEdit ? 'contenteditable="true"' : ''}
                        data-field="contractAmount" data-cat="${cat}">
                      ${fmt(amt)}
                    </td>
                    ${row.roundCosts.map(c => `<td class="pa-amount-cell">${fmt(c)}</td>`).join('')}
                    <td class="pa-amount-cell" style="font-weight:600">${fmt(row.totalCost)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td><strong>TOTAL</strong></td>
                <td class="pa-amount-cell"><strong>${fmt(summary.contractTotal)}</strong></td>
                ${summary.roundTotals.map(t => `<td class="pa-amount-cell"><strong>${fmt(t)}</strong></td>`).join('')}
                <td class="pa-amount-cell"><strong>${fmt(summary.costTotal)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        ${renderUnitPriceBox(unitPrices)}
      </div>
    `;
  }

  function renderUnitPriceBox(unitPrices) {
    const display = _state.unitPricesVisible ? 'block' : 'none';
    return `
      <div id="pa-unit-price-box" class="pa-unit-price-box" style="display:${display}">
        <div class="pa-unit-price-title">📋 직급별 일일 단가 (일일표시트 기준)</div>
        <div class="pa-unit-price-grid">
          ${GRADES.map(g => `
            <div class="pa-unit-price-item">
              <label>${g.label} <span class="pa-rank-badge">(${g.rank})</span></label>
              <input type="number" class="pa-unit-price-input"
                data-grade="${g.key}"
                value="${unitPrices[g.key] || ''}"
                placeholder="₩ 단가 입력">
            </div>
          `).join('')}
        </div>
        <div class="pa-unit-price-actions">
          <button id="pa-save-unit-price" class="pa-btn">저장</button>
          <button id="pa-close-unit-price" class="pa-btn pa-btn-ghost">닫기</button>
        </div>
      </div>
    `;
  }
  function renderRoundSection(analysis, unitPrices, canEdit) {
    const round = (analysis.rounds || [])[_state.currentRound - 1] || {};
    const { byCat } = calcRound(round, unitPrices);
    return `
      <div class="pa-round-section">
        <div class="pa-tabs">
          ${[1, 2, 3].map(n => `
            <button class="pa-tab ${_state.currentRound === n ? 'active' : ''}" data-round="${n}">
              ${n}차 투입현황
            </button>
          `).join('')}
          ${canEdit ? `
            <div class="pa-tab-actions">
              <button id="pa-add-member-btn" class="pa-btn pa-btn-sm">+ 인원 추가</button>
            </div>
          ` : ''}
        </div>
        <div class="pa-period-bar">
          <label>${_state.currentRound}차 기간</label>
          <input type="date" id="pa-start-date" class="pa-date-input"
            value="${round.startDate || ''}" ${canEdit ? '' : 'disabled'}>
          <span>~</span>
          <input type="date" id="pa-end-date" class="pa-date-input"
            value="${round.endDate || ''}" ${canEdit ? '' : 'disabled'}>
        </div>
        ${renderCalendar(round, byCat, unitPrices, canEdit)}
      </div>
    `;
  }

  function renderCalendar(round, byCat, unitPrices, canEdit) {
    if (!round.startDate || !round.endDate) {
      return '<div class="pa-no-period">📅 기간을 먼저 설정해주세요.</div>';
    }
    const dates = getDateRange(round.startDate, round.endDate);
    if (dates.length > 62) {
      return '<div class="pa-no-period">⚠ 기간이 너무 깁니다. 최대 62일까지 지원합니다.</div>';
    }
    const fmt = n => n ? '₩' + Math.round(n).toLocaleString() : '-';
    const dateHeaders = dates.map(d => {
      const wk = isWeekend(d);
      const short = formatDateShort(d);
      return `<th class="pa-day-cell ${wk ? 'weekend' : ''}" title="${d.toISOString().slice(0,10)}">${short}</th>`;
    }).join('');
    let bodyHtml = '';
    LABOR_CATEGORIES.forEach(cat => {
      const members = byCat[cat]?.memberRows || [];
      bodyHtml += `<tr><td colspan="${7 + dates.length + 1}" class="cat-header">▸ ${cat}</td></tr>`;
      if (members.length === 0) {
        bodyHtml += `<tr><td colspan="${7 + dates.length + 1}" class="pa-no-period" style="padding:8px;font-size:11px;">- 인원 없음 -</td></tr>`;
      }
      members.forEach((m, idx) => {
        bodyHtml += `
          <tr data-member-uid="${m.memberUid}">
            <td class="pa-center">${idx + 1}</td>
            <td class="pa-col-grade">${m.grade || '-'}</td>
            <td class="pa-col-name">${m.name || '-'}</td>
            <td class="pa-col-price">${fmt(m._unitPrice)}</td>
            <td class="pa-col-cost pa-cost-cell">${fmt(m._cost)}</td>
            <td class="pa-col-days pa-days-cell pa-center">${m._days}</td>
            <td class="pa-col-days pa-center">${m._days}</td>
            ${dates.map(d => {
              const ds = d.toISOString().slice(0, 10);
              const checked = !!(m.workDays?.[ds]);
              const wk = isWeekend(d);
              return `<td class="pa-day-cell ${wk ? 'weekend' : ''} ${checked ? 'checked' : ''}"><input type="checkbox" class="pa-day-check" data-member="${m.memberUid}" data-date="${ds}" ${checked ? 'checked' : ''} ${canEdit ? '' : 'disabled'}></td>`;
            }).join('')}
            <td>${canEdit ? `<button class="pa-del-btn pa-remove-member" data-member="${m.memberUid}">×</button>` : ''}</td>
          </tr>
        `;
      });
    });
    bodyHtml += `<tr><td colspan="${7 + dates.length + 1}" class="cat-header">▸ 기타비용</td></tr>`;
    OTHER_CATEGORIES.forEach(cat => {
      const cost = round.otherCosts?.[cat] || 0;
      bodyHtml += `<tr><td colspan="4" style="padding-left:12px;font-size:12px;">${cat}</td><td class="pa-amount-cell">${canEdit ? `<input type="number" class="pa-other-input pa-other-cost-input" data-cat="${cat}" value="${cost}" placeholder="금액">` : fmt(cost)}</td><td colspan="${2 + dates.length + 1}"></td></tr>`;
    });
    const { total } = calcRound(round, unitPrices);
    bodyHtml += `<tr class="total-row"><td colspan="4"><strong>${_state.currentRound}차 TOTAL</strong></td><td class="pa-amount-cell" id="pa-round-total"><strong>${fmt(total)}</strong></td><td colspan="${2 + dates.length + 1}"></td></tr>`;
    return `<div class="pa-calendar-wrap"><table class="pa-calendar-table"><thead><tr><th>NO</th><th class="pa-col-grade">직책</th><th class="pa-col-name">이름</th><th class="pa-col-price">단가</th><th class="pa-col-cost">비용</th><th class="pa-col-days">DAYS<br><small>직책</small></th><th class="pa-col-days">DAYS<br><small>개별</small></th>${dateHeaders}<th></th></tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
  }
  function _bindEvents(analysis, unitPrices, canEdit) {
    const roleSelector = document.getElementById('pa-role-selector');
    if (roleSelector) {
      roleSelector.addEventListener('change', e => { _state.currentUserRole = e.target.value; render(); });
    }
    const projectSelect = document.getElementById('pa-project-select');
    if (projectSelect) {
      projectSelect.addEventListener('change', e => { _state.currentProjectUid = e.target.value; render(); });
    }
    document.querySelectorAll('.pa-tab[data-round]').forEach(tab => {
      tab.addEventListener('click', e => { _state.currentRound = parseInt(e.target.dataset.round, 10); render(); });
    });
    ['pa-start-date', 'pa-end-date'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => _savePeriod());
    });
    const unitPriceBtn = document.getElementById('pa-unit-price-btn');
    if (unitPriceBtn) {
      unitPriceBtn.addEventListener('click', () => {
        _state.unitPricesVisible = !_state.unitPricesVisible;
        const box = document.getElementById('pa-unit-price-box');
        if (box) box.style.display = _state.unitPricesVisible ? 'block' : 'none';
      });
    }
    const saveUP = document.getElementById('pa-save-unit-price');
    if (saveUP) {
      saveUP.addEventListener('click', () => {
        const prices = {};
        document.querySelectorAll('.pa-unit-price-input').forEach(inp => {
          prices[inp.dataset.grade] = parseFloat(inp.value) || 0;
        });
        saveUnitPrices(prices);
        render();
      });
    }
    const closeUP = document.getElementById('pa-close-unit-price');
    if (closeUP) {
      closeUP.addEventListener('click', () => {
        _state.unitPricesVisible = false;
        const box = document.getElementById('pa-unit-price-box');
        if (box) box.style.display = 'none';
      });
    }
    if (canEdit) {
      document.querySelectorAll('[data-field="contractAmount"]').forEach(cell => {
        cell.addEventListener('blur', e => {
          const cat = e.target.dataset.cat;
          const raw = e.target.textContent.replace(/[\u20a9\s,]/g, '');
          const val = parseFloat(raw) || 0;
          const a = getAnalysis(_state.currentProjectUid) || createEmptyAnalysis(_state.currentProjectUid);
          a.contractAmounts[cat] = val;
          saveAnalysis(_state.currentProjectUid, a);
          e.target.textContent = '\u20a9 ' + Math.round(val).toLocaleString();
        });
      });
    }
    if (canEdit) {
      document.querySelectorAll('.pa-other-cost-input').forEach(input => {
        input.addEventListener('change', e => {
          const cat = e.target.dataset.cat;
          const val = parseFloat(e.target.value) || 0;
          const a = getAnalysis(_state.currentProjectUid) || createEmptyAnalysis(_state.currentProjectUid);
          a.rounds[_state.currentRound - 1].otherCosts = a.rounds[_state.currentRound - 1].otherCosts || {};
          a.rounds[_state.currentRound - 1].otherCosts[cat] = val;
          saveAnalysis(_state.currentProjectUid, a);
        });
      });
    }
    const addMemberBtn = document.getElementById('pa-add-member-btn');
    if (addMemberBtn) {
      addMemberBtn.addEventListener('click', () => _showAddMemberModal());
    }
    document.querySelectorAll('.pa-remove-member').forEach(btn => {
      btn.addEventListener('click', e => {
        const memberUid = e.target.dataset.member;
        const a = getAnalysis(_state.currentProjectUid) || createEmptyAnalysis(_state.currentProjectUid);
        a.rounds[_state.currentRound - 1].members = a.rounds[_state.currentRound - 1].members.filter(m => m.memberUid !== memberUid);
        saveAnalysis(_state.currentProjectUid, a);
        render();
      });
    });
    document.querySelectorAll('.pa-day-check').forEach(checkbox => {
      checkbox.addEventListener('change', e => {
        const memberUid = e.target.dataset.member;
        const date = e.target.dataset.date;
        const checked = e.target.checked;
        const a = getAnalysis(_state.currentProjectUid) || createEmptyAnalysis(_state.currentProjectUid);
        const member = a.rounds[_state.currentRound - 1].members.find(m => m.memberUid === memberUid);
        if (!member) return;
        member.workDays = member.workDays || {};
        if (checked) member.workDays[date] = true;
        else delete member.workDays[date];
        saveAnalysis(_state.currentProjectUid, a);
        const cell = e.target.closest('.pa-day-cell');
        if (cell) cell.classList.toggle('checked', checked);
        const up = getUnitPrices();
        const { days, cost } = calcMember(member, up);
        const row = e.target.closest('tr[data-member-uid]');
        if (row) {
          const costCell = row.querySelector('.pa-cost-cell');
          const daysCell = row.querySelector('.pa-days-cell');
          if (costCell) costCell.textContent = cost ? '\u20a9' + Math.round(cost).toLocaleString() : '-';
          if (daysCell) daysCell.textContent = days;
        }
      });
    });
  }

  function _savePeriod() {
    const startEl = document.getElementById('pa-start-date');
    const endEl   = document.getElementById('pa-end-date');
    if (!startEl || !endEl) return;
    const a = getAnalysis(_state.currentProjectUid) || createEmptyAnalysis(_state.currentProjectUid);
    a.rounds[_state.currentRound - 1].startDate = startEl.value;
    a.rounds[_state.currentRound - 1].endDate   = endEl.value;
    saveAnalysis(_state.currentProjectUid, a);
    render();
    if (typeof showToast === 'function') showToast('기간 정보가 저장되었습니다.');
  }

  function _showAddMemberModal() {
    const employees = (window.employees || []).filter(e => e.status !== '퇴직');
    const overlay = document.createElement('div');
    overlay.className = 'pa-modal-overlay';
    overlay.innerHTML = `
      <div class="pa-modal">
        <div class="pa-modal-title">인원 추가 — ${_state.currentRound}차 투입현황</div>
        <div class="pa-modal-form">
          <label>공종</label>
          <select id="pa-mc-cat" class="pa-modal-select">
            ${LABOR_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
          <label>직책</label>
          <select id="pa-mc-grade" class="pa-modal-select">
            ${GRADES.map(g => `<option value="${g.key}">${g.label} (${g.rank})</option>`).join('')}
          </select>
          <label>이름</label>
          <input id="pa-mc-name" class="pa-modal-input" list="pa-emp-list" placeholder="이름 검색 또는 직접 입력">
          <datalist id="pa-emp-list">
            ${employees.map(e => `<option value="${e.name}">${e.dept || ''} · ${e.grade || ''}</option>`).join('')}
          </datalist>
        </div>
        <div class="pa-modal-actions">
          <button id="pa-mc-confirm" class="pa-btn">추가</button>
          <button id="pa-mc-cancel" class="pa-btn pa-btn-ghost">취소</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('pa-mc-grade').addEventListener('change', e => {
      const grade = e.target.value;
      const list = document.getElementById('pa-emp-list');
      if (list) {
        list.innerHTML = employees.filter(emp => emp.grade === grade || !grade)
          .map(emp => `<option value="${emp.name}">${emp.dept || ''} · ${emp.grade || ''}</option>`).join('');
      }
    });
    document.getElementById('pa-mc-confirm').addEventListener('click', () => {
      const cat   = document.getElementById('pa-mc-cat').value;
      const grade = document.getElementById('pa-mc-grade').value;
      const name  = (document.getElementById('pa-mc-name').value || '').trim();
      if (!name) { alert('이름을 입력해주세요.'); return; }
      const a = getAnalysis(_state.currentProjectUid) || createEmptyAnalysis(_state.currentProjectUid);
      a.rounds[_state.currentRound - 1].members.push({
        memberUid: 'MB-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 5).toUpperCase(),
        category: cat, grade, name, workDays: {},
      });
      saveAnalysis(_state.currentProjectUid, a);
      document.body.removeChild(overlay);
      render();
    });
    document.getElementById('pa-mc-cancel').addEventListener('click', () => { document.body.removeChild(overlay); });
    overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });
  }

  function getDateRange(startStr, endStr) {
    const dates = [];
    const start = new Date(startStr + 'T00:00:00');
    const end   = new Date(endStr   + 'T00:00:00');
    if (isNaN(start) || isNaN(end) || start > end) return dates;
    const cur = new Date(start);
    while (cur <= end) { dates.push(new Date(cur)); cur.setDate(cur.getDate() + 1); }
    return dates;
  }

  function formatDateShort(d) {
    const days = ['일','월','화','수','목','금','토'];
    return `${d.getMonth()+1}/${d.getDate()}<br><small style="font-size:9px">${days[d.getDay()]}</small>`;
  }

  function isWeekend(d) { const day = d.getDay(); return day === 0 || day === 6; }

  function _listenStore(containerId) {
    window.addEventListener('centralProjectStore:updated', () => {
      const el = document.getElementById(containerId || 'profit-analysis-root');
      if (el && el.offsetParent !== null) render(containerId);
    });
  }

  window.profitAnalysisModule = {
    render,
    setProject: uid => { _state.currentProjectUid = uid; },
    setRole:    role => { _state.currentUserRole = role; },
    getState:   () => Object.assign({}, _state),
  };

  function _autoMount() {
    _listenStore('profit-analysis-root');
    const el = document.getElementById('profit-analysis-root');
    if (el) render('profit-analysis-root');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _autoMount);
  } else {
    _autoMount();
  }

})();
