/* =========================
   업무관리 > 프로젝트 관리
   기존 업무관리 프로젝트 상세 화면을 모듈화한 파일입니다.
   ========================= */

const pmProjectData = [];

/*
   연계 테스트용 초기화
   - 프로젝트 운영현황/프로젝트 관리 초기 더미 프로젝트를 제거했습니다.
   - 목록은 프로젝트 접수에서 저장된 프로젝트 리스트만 1:1로 표시됩니다.
*/

let pmCurrentProjectIndex = null;
let pmInitialized = false;

function pmEstimateText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function pmEstimateProjectId(seed = "") {
  return `PJT-LINK-${pmEstimateText(seed).replace(/[^0-9a-zA-Z가-힣]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24) || Date.now()}`;
}

function pmBuildLinkedProjectFromEstimate(row = {}) {
  const name = pmEstimateText(row.project || row.title || row.projectName);
  if (!name) return null;
  const statusText = pmEstimateText(row.status);
  if (!/(수주|작업시작|선착수|진행)/.test(statusText)) return null;
  return {
    id: row.dbPjNo || row.pjNo || pmEstimateProjectId(name),
    name,
    client: pmEstimateText(row.company || row.client || row.companyRaw) || "-",
    dept: pmEstimateText(row.scope || row.usage || row.unitWork) || "견적관리 연계",
    pm: pmEstimateText(row.pm || row.manager) || "미배정",
    status: statusText.includes("선착수") ? "선착수" : "진행중",
    orderDate: pmEstimateText(row.date) || "-",
    startDate: statusText.includes("대기") ? "-" : (pmEstimateText(row.startDate) || pmEstimateText(row.date) || "-"),
    dueDate: pmEstimateText(row.dueDate || row.endDate) || "-",
    delayReasonRequired: false,
    delayReasonApproved: false,
    delayReasonText: "견적관리 연계 프로젝트입니다.",
    orderHistory: [
      `${pmEstimateText(row.date) || "-"} : 견적관리에서 프로젝트 후보 생성`,
      `${statusText || "진행중"} 상태 기준 프로젝트 관리 표시`
    ],
    completionChanged: false,
    completionHistory: ["완료예정일 미입력"],
    meetings: [],
    phoneCalls: [],
    assignments: [{ category: "연계", teams: [{ name: pmEstimateText(row.unitWork || row.bid || "견적"), members: ["PM 미배정"] }] }],
    emails: [],
    deliveries: []
  };
}

function pmRefreshLinkedEstimateProjects() {
  const existingNames = new Set(pmProjectData.map(p => pmEstimateText(p.name)));
  const existingLinked = new Set(pmProjectData.filter(p => p.__linkedEstimate).map(p => pmEstimateText(p.name)));
  const candidates = [];
  try {
    if (typeof estimateRequestLoadRows === "function") estimateRequestLoadRows();
    if (Array.isArray(estimateRequestRows)) {
      estimateRequestRows.forEach(row => {
        const normalized = typeof estimateRequestNormalizeRow === "function" ? estimateRequestNormalizeRow(row) : row;
        const project = pmBuildLinkedProjectFromEstimate(normalized);
        if (project) candidates.push(project);
      });
    }
    if (typeof estimatePeriodAllRowsForList === "function") {
      estimatePeriodAllRowsForList().forEach(row => {
        const project = pmBuildLinkedProjectFromEstimate(row);
        if (project) candidates.push(project);
      });
    }
  } catch (err) {
    console.warn("프로젝트 관리 연계 후보 생성 실패", err);
  }
  candidates.forEach(project => {
    const name = pmEstimateText(project.name);
    if (!name || existingNames.has(name) || existingLinked.has(name)) return;
    project.__linkedEstimate = true;
    pmProjectData.push(project);
    existingNames.add(name);
    existingLinked.add(name);
  });
}


function initProjectManage() {
  if (!document.getElementById("pmProjectListScreen")) return;
  if (!pmInitialized) {
    pmRenderProjectList();
    pmInitialized = true;
  }
  if (pmCurrentProjectIndex === null) {
    pmOpenProjectList();
  } else {
    pmRenderProject(pmCurrentProjectIndex);
  }
}

function pmOpenProjectList() {
  const listScreen = document.getElementById("pmProjectListScreen");
  const detailScreen = document.getElementById("pmProjectDetailScreen");
  if (listScreen) listScreen.classList.remove("hidden");
  if (detailScreen) detailScreen.classList.add("hidden");
  pmCurrentProjectIndex = null;
  pmRenderProjectList();
}

function pmRenderProjectList() {
  pmRefreshLinkedEstimateProjects();
  const board = document.getElementById("pmProjectListBoard");
  if (!board) return;
  board.innerHTML = `
    <div class="pm-project-list-table-wrap">
      <table class="pm-project-list-table">
        <thead>
          <tr>
            <th>PJ NO</th>
            <th>프로젝트명</th>
            <th>발주처</th>
            <th>담당부서</th>
            <th>PM</th>
            <th>상태</th>
            <th>수주일자</th>
            <th>완료예정일</th>
          </tr>
        </thead>
        <tbody>
          ${pmProjectData.map((p, index) => `
            <tr class="pm-project-list-row" onclick="pmOpenProjectDetailWindow(${index})">
              <td>${pmEscapeHtml(p.id)}</td>
              <td><strong>${pmEscapeHtml(p.name)}</strong></td>
              <td>${pmEscapeHtml(p.client)}</td>
              <td>${pmEscapeHtml(p.dept)}</td>
              <td>${pmEscapeHtml(p.pm)}</td>
              <td><span class="status-badge">${pmEscapeHtml(p.status)}</span></td>
              <td>${pmEscapeHtml(p.orderDate)}</td>
              <td>${pmEscapeHtml(p.dueDate)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}


function pmOpenProjectDetailWindow(index = 0) {
  const project = pmProjectData[index] || pmProjectData[0];
  if (!project) return;
  const popup = window.open("", "_blank", "width=1500,height=900,scrollbars=yes,resizable=yes");
  if (!popup) {
    alert("새 창이 차단되었습니다. 브라우저 팝업 허용 후 다시 선택해 주세요.");
    return;
  }
  popup.document.open();
  popup.document.write(pmBuildProjectDetailWindowHtml(project, index));
  popup.document.close();
}

function pmBuildProjectDetailWindowHtml(p, index = 0) {
  const centralUid = pmEscapeJs(p.__centralProjectUid || "");
  const pmName = pmEscapeJs(p.pm || "PM");
  const title = pmEscapeHtml(p.name || "프로젝트 상세");
  const subtitle = pmEscapeHtml(`${p.client || "-"} · ${p.dept || "-"} · ${p.pm || "-"}`);
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} - 프로젝트 운영현황</title>
  <style>
    :root{--bg:#f4f7fb;--card:#fff;--line:#e5e7eb;--line2:#dbe3ef;--text:#0f172a;--muted:#64748b;--orange:#f97316;--blue:#2563eb;}
    *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,'Noto Sans KR',sans-serif;font-size:14px;font-weight:800;}
    .pm-popup-shell{height:100vh;display:flex;flex-direction:column;min-width:1180px;}
    .pm-popup-fixed{flex:0 0 auto;background:#fff;border-bottom:1px solid var(--line);box-shadow:0 8px 22px rgba(15,23,42,.06);z-index:20;}
    .pm-popup-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 28px 16px;}
    .pm-popup-title{display:flex;gap:10px;align-items:flex-start}.pm-popup-title:before{content:'';width:4px;height:22px;background:var(--orange);border-radius:999px;margin-top:3px;}
    h1{font-size:22px;margin:0 0 7px;letter-spacing:-.5px}.subcopy{margin:0;color:var(--muted);font-size:13px;}
    .actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.btn{border:1px solid var(--line2);background:#fff;color:#111827;border-radius:12px;padding:11px 16px;font-weight:900;cursor:pointer;box-shadow:0 4px 10px rgba(15,23,42,.04)}.btn-primary{background:var(--orange);border-color:var(--orange);color:#fff}.btn-line:hover{background:#f8fafc}
    .pm-popup-tabs{display:flex;align-items:center;gap:8px;padding:10px 28px 14px;border-top:1px solid #f1f5f9;}
    .pm-back-list-btn{margin-right:auto}.pm-anchor-link{display:inline-flex;align-items:center;justify-content:center;min-height:34px;border:1px solid var(--line2);background:#fbfdff;border-radius:10px;padding:8px 11px;font-size:12px;font-weight:900;color:#334155;text-decoration:none}.pm-anchor-link:hover{background:#eff6ff;color:#1d4ed8}
    .pm-popup-scroll{flex:1 1 auto;overflow:auto;padding:28px;background:linear-gradient(180deg,#f8fafc 0,#f4f7fb 100%);}
    .pm-project-content{display:grid;gap:16px;width:100%;max-width:1500px;margin:0 auto}.pm-card{background:#fff;border:1px solid var(--line2);border-radius:18px;padding:18px;box-shadow:0 10px 24px rgba(15,23,42,.04);scroll-margin-top:150px}.pm-card-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.pm-card-header h3{font-size:17px;margin:0;letter-spacing:-.3px}.pm-card-header span{font-size:12px;color:var(--muted);font-weight:900}.pm-project-subtitle{color:var(--muted);font-weight:800;margin:0 0 14px}.status-badge{display:inline-flex;align-items:center;border-radius:999px;background:#eaf7ef;color:#16a34a;padding:6px 10px;font-weight:900;font-size:12px}.pm-overview-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.pm-info-box{border:1px solid var(--line2);border-radius:14px;background:#fbfdff;padding:13px}.pm-info-box span{display:block;font-size:12px;font-weight:900;color:var(--muted);margin-bottom:8px}.pm-info-box strong{font-size:15px;line-height:1.35}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;table-layout:fixed}th{height:38px;background:#f8fafc;color:#334155;border-bottom:1px solid var(--line);font-size:12px;text-align:left;padding:0 12px}td{border-bottom:1px solid #edf2f7;padding:12px;color:#334155;font-size:13px;vertical-align:middle}.pm-assignment-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.pm-assignment-card{border:1px solid var(--line2);border-radius:16px;background:#fbfdff;padding:14px}.pm-assignment-card h4{font-size:15px;margin:0 0 10px;color:#1d4ed8}.pm-team-row{display:grid;grid-template-columns:110px 1fr;gap:8px;padding:8px 0;border-top:1px solid #edf2f7;font-size:12px}.pm-team-row:first-of-type{border-top:0}.pm-team-row b{color:#6b7280}.pm-team-row span{color:var(--muted);font-weight:800}.pm-timeline{display:grid;gap:8px}.pm-timeline-item{border:1px solid var(--line2);border-radius:13px;background:#fbfdff;padding:11px 12px;font-weight:800;color:#334155}.pm-delivery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.pm-delivery-card{border:1px solid var(--line2);border-radius:16px;background:#fbfdff;padding:14px;display:grid;gap:6px}.pm-delivery-card strong{font-size:14px;color:#6b7280}.pm-delivery-card span,.pm-delivery-card small{color:var(--muted);font-weight:800}.pm-delivery-card em{font-style:normal;width:max-content;border-radius:999px;padding:5px 9px;font-size:12px;font-weight:900}.pm-delivery-card em.done{background:#eaf7ef;color:#16a34a}.pm-delivery-card em.pending{background:#fff7ed;color:#d97706}
  </style>
</head>
<body>
  <div class="pm-popup-shell">
    <div class="pm-popup-fixed">
      <div class="pm-popup-head">
        <div class="pm-popup-title"><div><h1>프로젝트 운영현황</h1><p class="subcopy">프로젝트별 개요, 회의록, 배정인원, 관련메일, 수주일정, 완료시점, 납품관리를 한 화면에서 확인합니다.</p></div></div>
        <div class="actions"><button class="btn btn-line" onclick="pmPopupEscalateDelay('${centralUid}','${pmName}')">착수지연 사유서 작성</button><button class="btn btn-line" onclick="alert('상부 승인 처리 화면 준비 영역입니다.')">상부 승인 처리</button><button class="btn btn-primary" onclick="pmPopupEscalateCompletion('${centralUid}','${pmName}')">완료일정 변경</button></div>
      </div>
      <div class="pm-popup-tabs">
        <button class="btn btn-line pm-back-list-btn" onclick="window.close()">프로젝트 목록 바로가기</button>
        <a class="pm-anchor-link" href="#pmOverview">프로젝트 개요</a><a class="pm-anchor-link" href="#pmMeeting">회의록</a><a class="pm-anchor-link" href="#pmPhoneCall">전화내용</a><a class="pm-anchor-link" href="#pmAssignment">배정인원</a><a class="pm-anchor-link" href="#pmEmails">관련메일</a><a class="pm-anchor-link" href="#pmOrder">수주일정</a><a class="pm-anchor-link" href="#pmCompletion">완료시점</a><a class="pm-anchor-link" href="#pmDelivery">납품관리</a>
      </div>
    </div>
    <div class="pm-popup-scroll">
      ${pmBuildProjectDetailContentHtml(p, title, subtitle)}
    </div>
  </div>
<script>
  function pmPopupEscalateDelay(centralUid, pmName) {
    var reason = prompt('착수지연 사유를 입력하세요 (부사장 결재로 전달됩니다):', '');
    if (!reason) return;
    if (centralUid && window.opener && window.opener.centralProjectStore) {
      window.opener.centralProjectStore.escalateToVP(centralUid, { type: '지연사유', reason: reason, requester: pmName || 'PM' });
      alert('착수지연 사유서가 부사장 결재 요청으로 등록되었습니다.');
    }
  }
  function pmPopupEscalateCompletion(centralUid, pmName) {
    var reason = prompt('완료일정 변경 사유를 입력하세요 (부사장 결재로 전달됩니다):', '');
    if (!reason) return;
    if (centralUid && window.opener && window.opener.centralProjectStore) {
      window.opener.centralProjectStore.escalateToVP(centralUid, { type: '납품일정변경', reason: reason, requester: pmName || 'PM' });
      alert('완료일정 변경 사유서가 부사장 결재 요청으로 등록되었습니다.');
    }
  }
</script></body>
</html>`;
}

function pmBuildProjectDetailContentHtml(p, title, subtitle) {
  return `<main class="pm-project-content">
    <section id="pmOverview" class="pm-card pm-overview-card">
      <div class="pm-card-header"><h3>${title}</h3><span class="status-badge">${pmEscapeHtml(p.status || "-")}</span></div>
      <p class="pm-project-subtitle">${subtitle}</p>
      <div class="pm-overview-grid">
        ${pmInfoBoxHtml("프로젝트명", p.name)}${pmInfoBoxHtml("발주처", p.client)}${pmInfoBoxHtml("담당부서", p.dept)}${pmInfoBoxHtml("프로젝트 PM", p.pm)}${pmInfoBoxHtml("수주일자", p.orderDate)}${pmInfoBoxHtml("착수일자", p.startDate)}${pmInfoBoxHtml("완료예정일", p.dueDate)}${pmInfoBoxHtml("납품차수", `${(p.deliveries || []).length}차`)}
      </div>
    </section>
    <section id="pmMeeting" class="pm-card"><div class="pm-card-header"><h3>회의록</h3><span>날짜 / 회의명 / 작성자 / 상세보기</span></div><div class="table-wrap"><table><thead><tr><th>날짜</th><th>회의명</th><th>작성자</th><th>상세</th></tr></thead><tbody>${(p.meetings || []).map(m => `<tr><td>${pmEscapeHtml(m.date)}</td><td>${pmEscapeHtml(m.title)}</td><td>${pmEscapeHtml(m.author)}</td><td><button class="btn btn-line" onclick="alert('${pmEscapeJs(m.body || m.title || '')}')">상세</button></td></tr>`).join("")}</tbody></table></div></section>
    <section id="pmPhoneCall" class="pm-card"><div class="pm-card-header"><h3>전화내용</h3><span>통화일시 / 통화자 / 상대방 / 연락처 / 통화내용 / 후속조치</span></div><div class="table-wrap"><table><thead><tr><th style="width:130px">통화일시</th><th style="width:100px">통화자</th><th style="width:170px">상대방</th><th style="width:130px">연락처</th><th>통화내용</th><th>후속조치</th></tr></thead><tbody>${(p.phoneCalls || []).map(call => `<tr><td>${pmEscapeHtml(call.date)}</td><td>${pmEscapeHtml(call.caller)}</td><td>${pmEscapeHtml(call.target)}</td><td>${pmEscapeHtml(call.contact)}</td><td>${pmEscapeHtml(call.memo)}</td><td>${pmEscapeHtml(call.followUp)}</td></tr>`).join("")}</tbody></table></div></section>
    <section id="pmAssignment" class="pm-card"><div class="pm-card-header"><h3>프로젝트 배정인원</h3><span>대분류 / 소분류 / 투입인원</span></div><div class="pm-assignment-grid">${(p.assignments || []).map(group => `<div class="pm-assignment-card"><h4>${pmEscapeHtml(group.category)}</h4>${(group.teams || []).map(team => `<div class="pm-team-row"><b>${pmEscapeHtml(team.name)}</b><span>${(team.members || []).map(pmEscapeHtml).join(" · ")}</span></div>`).join("")}</div>`).join("")}</div></section>
    <section id="pmEmails" class="pm-card"><div class="pm-card-header"><h3>관련메일</h3><span>프로젝트 관련 송수신 메일 리스트</span></div><div class="table-wrap"><table><thead><tr><th>일자</th><th>구분</th><th>발신</th><th>수신</th><th>제목</th></tr></thead><tbody>${(p.emails || []).map(mail => `<tr><td>${pmEscapeHtml(mail.date)}</td><td>${pmEscapeHtml(mail.type)}</td><td>${pmEscapeHtml(mail.from)}</td><td>${pmEscapeHtml(mail.to)}</td><td>${pmEscapeHtml(mail.subject)}</td></tr>`).join("")}</tbody></table></div></section>
    <section id="pmOrder" class="pm-card"><div class="pm-card-header"><h3>수주일정</h3><span>수주 등록부터 착수 승인까지 이력</span></div><div class="pm-timeline">${(p.orderHistory || []).map(item => `<div class="pm-timeline-item">${pmEscapeHtml(item)}</div>`).join("")}</div></section>
    <section id="pmCompletion" class="pm-card"><div class="pm-card-header"><h3>완료시점 관리</h3><span>완료예정일 변경 이력</span></div><div class="pm-timeline">${(p.completionHistory || []).map(item => `<div class="pm-timeline-item">${pmEscapeHtml(item)}</div>`).join("")}</div></section>
    <section id="pmDelivery" class="pm-card"><div class="pm-card-header"><h3>납품관리</h3><span>차수별 납품 파일과 승인 상태</span></div><div class="pm-delivery-grid">${(p.deliveries || []).map(d => `<div class="pm-delivery-card"><strong>${pmEscapeHtml(d.round)}</strong><span>${pmEscapeHtml(d.date)}</span><small>${pmEscapeHtml(d.fileName)}</small><em class="${d.approved ? 'done' : 'pending'}">${d.approved ? '승인완료' : '승인대기'}</em></div>`).join("")}</div></section>
  </main>`;
}

function pmInfoBoxHtml(label, value) {
  return `<div class="pm-info-box"><span>${pmEscapeHtml(label)}</span><strong>${pmEscapeHtml(value || "-")}</strong></div>`;
}

function pmRenderProject(index = 0) {
  pmCurrentProjectIndex = index;
  const p = pmProjectData[index] || pmProjectData[0];
  if (!p) return;

  const listScreen = document.getElementById("pmProjectListScreen");
  const detailScreen = document.getElementById("pmProjectDetailScreen");
  if (listScreen) listScreen.classList.add("hidden");
  if (detailScreen) detailScreen.classList.remove("hidden");
  pmSetText("pmProjectTitle", p.name);
  pmSetText("pmProjectSubtitle", `${p.client} · ${p.dept} · ${p.pm}`);
  pmSetText("pmProjectStatusBadge", p.status);
  pmSetText("pmSummaryProjectName", p.name);
  pmSetText("pmSummaryClient", p.client);
  pmSetText("pmSummaryDept", p.dept);
  pmSetText("pmSummaryPm", p.pm);
  pmSetText("pmSummaryOrderDate", p.orderDate);
  pmSetText("pmSummaryStartDate", p.startDate);
  pmSetText("pmSummaryDueDate", p.dueDate);
  pmSetText("pmSummaryDeliveryCount", `${p.deliveries.length}차`);

  pmRenderMeetings(p.meetings);
  pmRenderPhoneCalls(p.phoneCalls);
  pmRenderAssignments(p.assignments);
  pmRenderEmails(p.emails);
  pmRenderTimeline("pmOrderTimeline", p.orderHistory);
  pmRenderTimeline("pmCompletionTimeline", p.completionHistory);
  pmRenderDeliveries(p.deliveries);
}

function pmRenderMeetings(items = []) {
  const body = document.getElementById("pmMeetingTableBody");
  if (!body) return;
  body.innerHTML = items.map(m => `<tr><td>${m.date}</td><td>${pmEscapeHtml(m.title)}</td><td>${pmEscapeHtml(m.author)}</td><td><button class="btn btn-line" onclick="showToast('${pmEscapeJs(m.title)} 회의록을 열었습니다.')">상세</button></td></tr>`).join("");
}

function pmRenderPhoneCalls(items = []) {
  const body = document.getElementById("pmPhoneCallTableBody");
  if (!body) return;
  body.innerHTML = items.map(call => `<tr><td>${pmEscapeHtml(call.date)}</td><td>${pmEscapeHtml(call.caller)}</td><td>${pmEscapeHtml(call.target)}</td><td>${pmEscapeHtml(call.contact)}</td><td>${pmEscapeHtml(call.memo)}</td><td>${pmEscapeHtml(call.followUp)}</td></tr>`).join("");
}

function pmRenderAssignments(assignments = []) {
  const grid = document.getElementById("pmAssignmentGrid");
  if (!grid) return;
  grid.innerHTML = assignments.map(group => `
    <div class="pm-assignment-card">
      <h4>${pmEscapeHtml(group.category)}</h4>
      ${group.teams.map(team => `<div class="pm-team-row"><b>${pmEscapeHtml(team.name)}</b><span>${team.members.map(pmEscapeHtml).join(" · ")}</span></div>`).join("")}
    </div>
  `).join("");
}

function pmRenderEmails(items = []) {
  const body = document.getElementById("pmEmailTableBody");
  if (!body) return;
  body.innerHTML = items.map(m => `<tr><td>${m.date}</td><td>${m.type}</td><td>${pmEscapeHtml(m.from)}</td><td>${pmEscapeHtml(m.to)}</td><td>${pmEscapeHtml(m.subject)}</td></tr>`).join("");
}

function pmRenderTimeline(targetId, items = []) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = items.map(item => `<div class="pm-timeline-item">${pmEscapeHtml(item)}</div>`).join("");
}

function pmRenderDeliveries(items = []) {
  const grid = document.getElementById("pmDeliveryGrid");
  if (!grid) return;
  grid.innerHTML = items.map(d => `
    <div class="pm-delivery-card">
      <strong>${pmEscapeHtml(d.round)}</strong>
      <span>${pmEscapeHtml(d.date)}</span>
      <small>${pmEscapeHtml(d.fileName)}</small>
      <em class="${d.approved ? "done" : "pending"}">${d.approved ? "승인완료" : "승인대기"}</em>
    </div>
  `).join("");
}

function pmSimulateDelayReason() {
  const p = pmProjectData[pmCurrentProjectIndex];
  showToast(p.delayReasonText || "착수지연 사유가 등록되었습니다.");
}

function pmSimulateApproval() {
  showToast("상부 승인 처리 예시가 반영되었습니다.");
}

function pmSimulateCompletionChange() {
  const p = pmProjectData[pmCurrentProjectIndex];
  p.completionChanged = true;
  p.completionHistory.push(`${pmTodayText()} : 완료예정일 변경 시뮬레이션 반영`);
  pmRenderProject(pmCurrentProjectIndex);
  showToast("완료일정 변경 이력이 추가되었습니다.");
}

function pmSetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "-";
}

function pmTodayText() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function pmEscapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[ch]));
}

function pmEscapeJs(value) {
  return String(value ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, " ");
}

/* =========================================================
   2026-05-28 프로젝트 관리 = 프로젝트 리스트 1:1 미러링 패치
   - 프로젝트 관리 목록은 프로젝트 리스트에 존재하는 건만 표시
   - 견적관리/DB관리 후보 데이터는 직접 표시하지 않음
   - PM배정/일정 최신 PM 값을 우선 표시
   ========================================================= */
function pmProjectLinkKeyFromReceive(data = {}) {
  if (typeof projectReceiveLinkKey === "function") return projectReceiveLinkKey(data);
  const no = pmEstimateText(data.projectNo || data.pjNo || data.dbPjNo);
  if (no) return `NO:${no}`;
  return `NAME:${pmEstimateText(data.projectName || data.name)}::${pmEstimateText(data.client || data.company)}`;
}
function pmProjectGetScheduleAssignment(projectNo = "") {
  const no = pmEstimateText(projectNo);
  if (!no || typeof pmScheduleProjects === "undefined") return {};
  const matched = (pmScheduleProjects || []).find(item => pmEstimateText(item?.project?.projectNo) === no);
  return matched?.assignment || {};
}
function pmBuildProjectFromReceiveItem(item = {}) {
  const data = item.data || item;
  const assignment = pmProjectGetScheduleAssignment(data.projectNo);
  const pmText = [assignment.pmFinish, assignment.pmStructure, assignment.pmBim, assignment.pmCivil, data.pmTotal, data.pmFinish, data.pmStructure]
    .filter(Boolean).join(" / ") || "미배정";
  const scopes = Array.isArray(data.scopes) ? data.scopes.filter(s => typeof s === "string" ? s : s?.checked).map(s => typeof s === "string" ? s : s.label).join(" · ") : "";
  return {
    id: data.projectNo || pmProjectLinkKeyFromReceive(data),
    name: data.projectName || "프로젝트명 미입력",
    client: data.client || "-",
    dept: scopes || data.usage || "프로젝트 리스트 연계",
    pm: pmText,
    status: data.status || "진행중",
    orderDate: data.bidDate || data.orderDate || data.startDate || "-",
    startDate: data.startDate || "-",
    dueDate: data.finalDelivery || data.firstDelivery || "-",
    delayReasonRequired: false,
    delayReasonApproved: false,
    delayReasonText: "프로젝트 리스트 기준 연계 프로젝트입니다.",
    orderHistory: [`${item.completedAt || "-"} : 프로젝트 리스트 기준 최신값 반영`],
    completionChanged: false,
    completionHistory: [data.finalDelivery || data.firstDelivery ? `완료 예정: ${data.finalDelivery || data.firstDelivery}` : "완료예정일 미입력"],
    meetings: [],
    phoneCalls: data.phoneCalls || [],
    assignments: [{ category: "PM", teams: [{ name: "PM 배정", members: pmText === "미배정" ? ["PM 미배정"] : pmText.split(" / ") }] }],
    emails: [],
    deliveries: []
  };
}
pmRefreshLinkedEstimateProjects = function pmRefreshProjectListMirror() {
  const items = typeof projectReceiveGetCanonicalListItems === "function" ? projectReceiveGetCanonicalListItems() : (typeof getProjectReceiveListItems === "function" ? getProjectReceiveListItems() : []);
  pmProjectData.splice(0, pmProjectData.length, ...items.map(pmBuildProjectFromReceiveItem));
};
window.pmRefreshLinkedEstimateProjects = pmRefreshLinkedEstimateProjects;
  window.pmEscalateDelay = function(centralUid, pm){
    if(!centralUid||!window.centralProjectStore) return;
    var reason = prompt('착수지연 사유를 입력하세요:','');
    if(!reason) return;
    centralProjectStore.escalateToVP(centralUid,{type:'지연사유',reason,requester:pm||'PM'});
    if(typeof showToast==='function') showToast('착수지연 사유서가 부사장 결재 요청으로 등록되었습니다.');
  };
  window.pmEscalateCompletion = function(centralUid, pm){
    if(!centralUid||!window.centralProjectStore) return;
    var reason = prompt('완료일정 변경 사유를 입력하세요:','');
    if(!reason) return;
    centralProjectStore.escalateToVP(centralUid,{type:'납품일정변경',reason,requester:pm||'PM'});
    if(typeof showToast==='function') showToast('완료일정 변경 사유서가 부사장 결재 요청으로 등록되었습니다.');
  }

/* =========================================================
   2026-05-28 프로젝트 관리 상세 이력 보존 패치
   - 프로젝트 관리 목록은 프로젝트 리스트를 1:1 미러링
   - 회의록/전화내용/관련메일/납품/완료변경 등 상세 이력은 별도 store로 보존
   - receiveId 기준으로 PJ NO 변경 전/후에도 상세 이력 유지
   ========================================================= */
(function installProjectManagementStableMirrorPatch(){
  function txt(v){ return String(v ?? '').replace(/\s+/g, ' ').trim(); }
  function keyFromData(data = {}){
    if (typeof projectReceiveLinkKey === 'function') return projectReceiveLinkKey(data);
    const receiveId = txt(data.receiveId || data.internalReceiveId || data.linkedReceiveId);
    if (receiveId) return `RCV:${receiveId}`;
    const no = txt(data.projectNo || data.pjNo);
    if (no) return `NO:${no}`;
    return `LEGACY:${txt(data.projectName || data.name)}::${txt(data.client)}`;
  }
  window.pmProjectDetailStore = window.pmProjectDetailStore || {};
  function extractDetail(p = {}){
    return {
      delayReasonRequired: !!p.delayReasonRequired,
      delayReasonApproved: !!p.delayReasonApproved,
      delayReasonText: p.delayReasonText || '',
      orderHistory: Array.isArray(p.orderHistory) ? p.orderHistory : [],
      completionChanged: !!p.completionChanged,
      completionHistory: Array.isArray(p.completionHistory) ? p.completionHistory : [],
      meetings: Array.isArray(p.meetings) ? p.meetings : [],
      phoneCalls: Array.isArray(p.phoneCalls) ? p.phoneCalls : [],
      emails: Array.isArray(p.emails) ? p.emails : [],
      deliveries: Array.isArray(p.deliveries) ? p.deliveries : []
    };
  }
  function saveExistingDetails(){
    (pmProjectData || []).forEach(p => {
      const key = p.__linkKey || keyFromData(p);
      if (!key) return;
      window.pmProjectDetailStore[key] = { ...(window.pmProjectDetailStore[key] || {}), ...extractDetail(p) };
    });
  }
  const baseBuilder = typeof pmBuildProjectFromReceiveItem === 'function' ? pmBuildProjectFromReceiveItem : null;
  pmBuildProjectFromReceiveItem = function pmBuildProjectFromReceiveItemStable(item = {}){
    const data = item.data || item;
    const key = keyFromData(data);
    const built = baseBuilder ? baseBuilder(item) : {
      id: data.projectNo || data.receiveId || key,
      name: data.projectName || '프로젝트명 미입력',
      client: data.client || '-',
      dept: data.usage || '프로젝트 리스트 연계',
      pm: [data.pmFinish, data.pmStructure, data.pmBim, data.pmCivil].filter(Boolean).join(' / ') || '미배정',
      status: data.status || '진행중',
      orderDate: data.bidDate || '-',
      startDate: data.startDate || '-',
      dueDate: data.finalDelivery || data.firstDelivery || '-'
    };
    built.__linkKey = key;
    built.receiveId = data.receiveId || data.internalReceiveId || built.receiveId;
    const detail = window.pmProjectDetailStore[key] || extractDetail(built);
    return { ...built, ...detail, id: built.id || data.projectNo || data.receiveId || key };
  };
  window.pmBuildProjectFromReceiveItem = pmBuildProjectFromReceiveItem;
  pmRefreshLinkedEstimateProjects = function pmRefreshProjectListMirrorStable(){
    saveExistingDetails();
    const items = typeof projectReceiveGetCanonicalListItems === 'function' ? projectReceiveGetCanonicalListItems() : (typeof getProjectReceiveListItems === 'function' ? getProjectReceiveListItems() : []);
    pmProjectData.splice(0, pmProjectData.length, ...items.map(pmBuildProjectFromReceiveItem));
  };
  window.pmRefreshLinkedEstimateProjects = pmRefreshLinkedEstimateProjects;
})();
