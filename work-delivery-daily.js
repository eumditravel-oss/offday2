/* =========================================================
   업무관리 > 납품 및 데이터관리 / 업무일지·진행률
   - 중앙 프로젝트 저장소(projectUid) 기준으로 프로젝트별 납품자료와 업무일지 기록 관리
========================================================= */
(function(){
  let selectedDeliveryProjectUid = "";
  let selectedDailyProjectUid = "";

  function esc(v){ return String(v ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch])); }
  function val(id){ return document.getElementById(id)?.value || ""; }
  function setVal(id, value){ const el = document.getElementById(id); if (el) el.value = value ?? ""; }
  function toast(msg){ if (typeof showToast === "function") showToast(msg); else alert(msg); }
  function refreshCentralStore(){
    if (!window.centralProjectStore) return [];
    try {
      if (typeof projectReceiveGetCanonicalListItems === "function") {
        projectReceiveGetCanonicalListItems().forEach(item => centralProjectStore.upsertProject(item.data || item, "project-receive", { log:false }));
      }
      const pmItems = (typeof pmScheduleProjects !== "undefined" ? pmScheduleProjects : (window.pmScheduleProjects || []));
      if (Array.isArray(pmItems)) {
        pmItems.forEach(item => syncPmScheduleToCentral(item));
      }
    } catch (err) { console.warn("중앙 프로젝트 저장소 동기화 실패", err); }
    return centralProjectStore.getProjects();
  }
  function projectOptions(projects, selected){
    return projects.map(p => `<option value="${esc(p.projectUid)}" ${p.projectUid === selected ? "selected" : ""}>${esc(p.projectNo || "PJ NO 미지정")} · ${esc(p.projectName)}</option>`).join("");
  }
  function getCurrentDeliveryProject(){
    const projects = refreshCentralStore();
    if (!selectedDeliveryProjectUid || !projects.some(p => p.projectUid === selectedDeliveryProjectUid)) selectedDeliveryProjectUid = projects[0]?.projectUid || "";
    return { projects, project: projects.find(p => p.projectUid === selectedDeliveryProjectUid) || null };
  }
  function getCurrentDailyProject(){
    const projects = refreshCentralStore();
    if (!selectedDailyProjectUid || !projects.some(p => p.projectUid === selectedDailyProjectUid)) selectedDailyProjectUid = projects[0]?.projectUid || "";
    return { projects, project: projects.find(p => p.projectUid === selectedDailyProjectUid) || null };
  }

  function renderDeliveryData(){
    const root = document.getElementById("deliveryDataBoard");
    if (!root || !window.centralProjectStore) return;
    const { projects, project } = getCurrentDeliveryProject();
    if (!projects.length) {
      root.innerHTML = `<div class="central-empty">프로젝트 리스트에 등록된 프로젝트가 없습니다. 프로젝트 접수 저장 후 납품자료를 등록할 수 있습니다.</div>`;
      return;
    }
    const files = project?.delivery?.files || [];
    const records = project?.delivery?.records || [];
    root.innerHTML = `
      <div class="central-toolbar">
        <label><span>프로젝트 선택</span><select id="deliveryProjectSelect" onchange="setDeliveryProject(this.value)">${projectOptions(projects, project.projectUid)}</select></label>
        <div class="central-summary"><b>${esc(project.projectName)}</b><span>${esc(project.clientName)} · ${esc(project.status)}</span></div>
      </div>
      <div class="delivery-grid-layout">
        <section class="central-card">
          <h3>납품자료 업로드</h3>
          <div class="central-form-grid">
            <label><span>납품차수</span><input id="deliveryRound" placeholder="예: 1차 납품자료" /></label>
            <label><span>납품일자</span><input id="deliveryDate" type="date" value="${centralProjectStore.today()}" /></label>
            <label class="wide"><span>납품파일</span><input id="deliveryFile" type="file" multiple /></label>
            <label class="wide"><span>메모</span><textarea id="deliveryMemo" placeholder="납품 범위, 발주처 요청사항, 제외자료 등을 기록"></textarea></label>
          </div>
          <div class="central-actions"><button class="btn btn-primary" type="button" onclick="saveDeliveryUpload()">납품자료 저장</button></div>
        </section>
        <section class="central-card">
          <h3>납품기록 작성</h3>
          <div class="central-form-grid">
            <label><span>기록구분</span><select id="deliveryRecordType"><option>발주처 전달</option><option>보완요청</option><option>내부검토</option><option>승인완료</option><option>기타</option></select></label>
            <label class="wide"><span>기록내용</span><textarea id="deliveryRecordMemo" placeholder="납품자료 관련 통화, 메일, 보완요청, 승인 내용을 기록"></textarea></label>
          </div>
          <div class="central-actions"><button class="btn btn-line" type="button" onclick="saveDeliveryRecord()">기록 추가</button></div>
        </section>
      </div>
      <section class="central-card">
        <h3>프로젝트별 납품자료</h3>
        <div class="central-table-wrap">
          <table class="central-table"><thead><tr><th>납품차수</th><th>납품일</th><th>파일명</th><th>메모</th><th>등록시간</th></tr></thead><tbody>
            ${files.map(f => `<tr><td>${esc(f.round)}</td><td>${esc(f.date)}</td><td>${esc(f.fileName)}</td><td>${esc(f.memo)}</td><td>${esc(f.uploadedAt)}</td></tr>`).join("") || `<tr><td colspan="5" class="central-muted">등록된 납품자료가 없습니다.</td></tr>`}
          </tbody></table>
        </div>
      </section>
      <section class="central-card">
        <h3>납품 기록</h3>
        <div class="central-log-list">
          ${records.map(r => `<div class="central-log"><b>${esc(r.type)}</b><span>${esc(r.at)} · ${esc(r.writer || "사용자")}</span><p>${esc(r.memo)}</p></div>`).join("") || `<div class="central-muted">등록된 납품기록이 없습니다.</div>`}
        </div>
      </section>`;
  }

  function setDeliveryProject(uid){ selectedDeliveryProjectUid = uid; renderDeliveryData(); }
  function saveDeliveryUpload(){
    if (!selectedDeliveryProjectUid) return;
    const input = document.getElementById("deliveryFile");
    const files = Array.from(input?.files || []);
    if (!files.length) { toast("납품파일을 선택해 주세요."); return; }
    const round = val("deliveryRound") || `${(centralProjectStore.getProject(selectedDeliveryProjectUid)?.delivery?.files?.length || 0) + 1}차 납품자료`;
    files.forEach(file => centralProjectStore.upsertDelivery(selectedDeliveryProjectUid, { round, date: val("deliveryDate"), fileName: file.name, fileSize: file.size, memo: val("deliveryMemo") }));
    setVal("deliveryRound", ""); setVal("deliveryMemo", ""); if (input) input.value = "";
    renderDeliveryData(); renderProjectManageIfOpen();
    toast("납품자료를 중앙 프로젝트 저장소에 저장했습니다.");
  }
  function saveDeliveryRecord(){
    if (!selectedDeliveryProjectUid) return;
    const memo = val("deliveryRecordMemo").trim();
    if (!memo) { toast("기록내용을 입력해 주세요."); return; }
    centralProjectStore.addDeliveryRecord(selectedDeliveryProjectUid, { type: val("deliveryRecordType"), memo });
    setVal("deliveryRecordMemo", ""); renderDeliveryData(); renderProjectManageIfOpen();
    toast("납품기록을 저장했습니다.");
  }

  function taskOptions(project){
    const tasks = project?.pmSchedule?.tasks || [];
    return tasks.map(t => `<option value="${esc(t.taskUid)}">${esc(t.personName)} · ${esc(t.title)} · ${esc(t.startDate)}~${esc(t.plannedEndDate)}</option>`).join("");
  }
  function renderDailyReport(){
    const root = document.getElementById("dailyReportBoard");
    if (!root || !window.centralProjectStore) return;
    const { projects, project } = getCurrentDailyProject();
    if (!projects.length) {
      root.innerHTML = `<div class="central-empty">프로젝트 리스트에 등록된 프로젝트가 없습니다. PM배정/일정 승인 후 업무일지를 작성할 수 있습니다.</div>`;
      return;
    }
    const tasks = project?.pmSchedule?.tasks || [];
    const reports = project?.dailyReports || [];
    root.innerHTML = `
      <div class="central-toolbar">
        <label><span>프로젝트 선택</span><select id="dailyProjectSelect" onchange="setDailyProject(this.value)">${projectOptions(projects, project.projectUid)}</select></label>
        <div class="central-summary"><b>${esc(project.projectName)}</b><span>전체 공정률 ${esc(project.progress?.progressRate || 0)}% · ${esc(project.status)}</span></div>
      </div>
      <div class="daily-grid-layout">
        <section class="central-card daily-write-card">
          <h3>업무일지 작성</h3>
          <div class="central-form-grid">
            <label><span>일정 매칭</span><select id="dailyTaskUid">${taskOptions(project) || `<option value="">승인된 일정 없음</option>`}</select></label>
            <label><span>작성단계</span><select id="dailyStage"><option>1차 작성</option><option>퇴근 전 최종 작성</option><option>야근 사전 보고</option><option>지연사유 보고</option></select></label>
            <label><span>작성일자</span><input id="dailyDate" type="date" value="${centralProjectStore.today()}" /></label>
            <label><span>공정률</span><input id="dailyProgress" type="number" min="0" max="100" value="0" /></label>
            <label class="wide"><span>아침 계획 / 오늘 할 일</span><textarea id="dailyPlanMemo" placeholder="아침에 오늘 진행할 프로젝트와 작업계획을 작성"></textarea></label>
            <label class="wide"><span>퇴근 전 최종 내용</span><textarea id="dailyResultMemo" placeholder="퇴근 전 실제 작업내용과 결과를 작성"></textarea></label>
            <label class="wide"><span>지연사유</span><textarea id="dailyDelayReason" placeholder="계획 일정 대비 늦는 경우 사유 작성. 저장 시 담당 PM/실장에게 전달 상태로 기록"></textarea></label>
            <label class="wide"><span>야근 사유</span><textarea id="dailyOvertimeReason" placeholder="야근 전 보고 사유 작성. PM 승인 후 실장 최종 승인 필요"></textarea></label>
          </div>
          <div class="central-actions"><button class="btn btn-primary" type="button" onclick="saveDailyReport()">업무일지 저장</button></div>
        </section>
        <section class="central-card">
          <h3>추가업무 배정 / 기존업무 일시중지</h3>
          <div class="central-help">기존 5일 업무 중 3일차에 새 업무가 생기면, 새 업무 기간만큼 기존업무 종료일이 자동으로 뒤로 밀립니다.</div>
          <div class="central-form-grid">
            <label><span>멈출 기존 일정</span><select id="interruptTaskUid">${taskOptions(project) || `<option value="">승인된 일정 없음</option>`}</select></label>
            <label><span>추가업무 기간</span><input id="interruptDays" type="number" min="1" value="1" /></label>
            <label><span>시작일</span><input id="interruptStartDate" type="date" value="${centralProjectStore.today()}" /></label>
            <label class="wide"><span>추가업무명</span><input id="interruptTitle" placeholder="예: 발주처 긴급 보완자료 작성" /></label>
            <label class="wide"><span>지연사유 / 배정사유</span><textarea id="interruptReason" placeholder="기존 일정이 밀리는 사유를 작성. PM/실장 전달 이력으로 기록"></textarea></label>
          </div>
          <div class="central-actions"><button class="btn btn-line" type="button" onclick="saveInterruptingWork()">추가업무 배정 및 일정 자동 변경</button></div>
        </section>
      </div>
      <section class="central-card">
        <h3>승인 일정 / 진행 현황</h3>
        <div class="central-table-wrap">
          <table class="central-table"><thead><tr><th>담당자</th><th>업무</th><th>기간</th><th>공정률</th><th>상태</th><th>일시중지/추가업무</th></tr></thead><tbody>
          ${tasks.map(t => `<tr><td>${esc(t.personName)}</td><td>${esc(t.title)}</td><td>${esc(t.startDate)} ~ ${esc(t.plannedEndDate)} / ${esc(t.plannedDays)}일</td><td>${esc(t.progressRate || 0)}%</td><td>${esc(t.status)}</td><td>${(t.interruptions || []).map(i => `${esc(i.at)} ${esc(i.days)}일 · ${esc(i.reason)}`).join("<br>") || "-"}</td></tr>`).join("") || `<tr><td colspan="6" class="central-muted">PM배정/일정에서 승인된 일정이 없습니다.</td></tr>`}
          </tbody></table>
        </div>
      </section>
      <section class="central-card">
        <h3>업무일지 / 승인요청 기록</h3>
        <div class="central-table-wrap">
          <table class="central-table"><thead><tr><th>일자</th><th>단계</th><th>공정률</th><th>지연/야근 사유</th><th>PM</th><th>실장</th><th>관리</th></tr></thead><tbody>
          ${reports.map(r => `<tr><td>${esc(r.date)}</td><td>${esc(r.stage)}</td><td>${esc(r.progressRate)}%</td><td>${esc(r.delayReason || r.overtimeReason || "-")}</td><td>${esc(r.approval?.pm || "-")}</td><td>${esc(r.approval?.director || "-")}</td><td><button class="mini-btn" onclick="approveDailyReport('${esc(project.projectUid)}','${esc(r.reportUid)}','pm')">PM승인</button><button class="mini-btn" onclick="approveDailyReport('${esc(project.projectUid)}','${esc(r.reportUid)}','director')">실장승인</button></td></tr>`).join("") || `<tr><td colspan="7" class="central-muted">작성된 업무일지가 없습니다.</td></tr>`}
          </tbody></table>
        </div>
      </section>`;
  }
  function setDailyProject(uid){ selectedDailyProjectUid = uid; renderDailyReport(); }
  function saveDailyReport(){
    if (!selectedDailyProjectUid) return;
    centralProjectStore.addDailyReport(selectedDailyProjectUid, {
      taskUid: val("dailyTaskUid"), date: val("dailyDate"), stage: val("dailyStage"), progressRate: val("dailyProgress"),
      planMemo: val("dailyPlanMemo"), resultMemo: val("dailyResultMemo"), delayReason: val("dailyDelayReason"), overtimeReason: val("dailyOvertimeReason")
    });
    ["dailyPlanMemo","dailyResultMemo","dailyDelayReason","dailyOvertimeReason"].forEach(id => setVal(id, ""));
    renderDailyReport(); renderProjectManageIfOpen();
    toast("업무일지를 저장하고 중앙 프로젝트 데이터에 반영했습니다.");
  }
  function saveInterruptingWork(){
    const project = centralProjectStore.getProject(selectedDailyProjectUid);
    const task = (project?.pmSchedule?.tasks || []).find(t => t.taskUid === val("interruptTaskUid"));
    if (!task) { toast("일시중지할 기존 일정을 선택해 주세요."); return; }
    centralProjectStore.assignInterruptingWork(selectedDailyProjectUid, {
      pausedTaskUid: task.taskUid, personName: task.personName, dept: task.dept, category: "추가업무", title: val("interruptTitle"),
      days: val("interruptDays"), startDate: val("interruptStartDate"), reason: val("interruptReason")
    });
    setVal("interruptTitle", ""); setVal("interruptReason", "");
    renderDailyReport(); renderProjectManageIfOpen();
    toast("추가업무 배정과 기존 일정 자동 변경을 반영했습니다.");
  }
  function approveDailyReport(projectUid, reportUid, role){
    centralProjectStore.approveDailyReport(projectUid, reportUid, role);
    renderDailyReport();
    toast(role === "pm" ? "PM 승인 처리했습니다." : "실장 최종 승인 처리했습니다.");
  }

  function buildTasksFromPmSchedule(item){
    if (!item) return [];
    const start = String(item.scheduleStartDate || item.project?.startDate || centralProjectStore.today()).replaceAll(".", "-");
    let rows = [];
    try {
      if (typeof getPmScheduleApprovedRows === "function" && item.status === "approved") rows = getPmScheduleApprovedRows(item);
    } catch (_) {}
    if (!rows.length) {
      const planId = item.approvedPlan || item.selectedProposal || "plan1";
      const plan = item.proposals?.[planId];
      rows = (plan?.rows || []).map((row, index) => ({ row, index, totalDays: Number(row?.[planId]?.totalDays || row?.[planId]?.workDays || row?.plan1?.totalDays || row?.plan1?.workDays || 0) })).filter(r => r.totalDays > 0);
    }
    return rows.map((entry, index) => {
      const row = entry.row || {};
      const days = Math.max(1, Number(entry.totalDays || row.totalDays || 1));
      return {
        taskUid: `TSK-${item.id || item.project?.receiveId || item.project?.projectNo || "PM"}-${index}`,
        title: `${item.project?.projectName || "프로젝트"} ${row.scope || row.dept || row.name || "작업"}`,
        personName: row.displayName || row.name || row.personName || row.dept || "담당자 미지정",
        dept: row.dept || row.middleDept || "",
        category: item.submittedCategory || "Structure",
        startDate: start,
        plannedDays: days,
        progressRate: item.status === "approved" ? 0 : 0,
        status: item.status === "approved" ? "진행예정" : "승인대기"
      };
    });
  }
  function syncPmScheduleToCentral(item){
    if (!window.centralProjectStore || !item?.project) return null;
    const tasks = buildTasksFromPmSchedule(item);
    const project = centralProjectStore.upsertPmSchedule(item, { tasks });
    tasks.forEach(task => centralProjectStore.ensureTask(project.projectUid, task));
    return project;
  }
  function renderProjectManageIfOpen(){
    if (document.getElementById("projectManage")?.classList.contains("active") && typeof initProjectManage === "function") initProjectManage();
  }

  function installWrappers(){
    if (window.__centralProjectWrappersInstalled) return;
    window.__centralProjectWrappersInstalled = true;
    const originalSave = window.saveProjectReceiveDraft;
    if (typeof originalSave === "function") {
      window.saveProjectReceiveDraft = function centralSaveProjectReceiveDraft(){
        const result = originalSave.apply(this, arguments);
        try { const receiveState = (typeof projectReceiveState !== "undefined" ? projectReceiveState : window.projectReceiveState); if (receiveState) centralProjectStore.upsertProject(receiveState, "project-receive"); } catch (err) { console.warn(err); }
        return result;
      };
      saveProjectReceiveDraft = window.saveProjectReceiveDraft;
    }
    const originalRegister = window.registerPmScheduleProjectFromReceive;
    if (typeof originalRegister === "function") {
      window.registerPmScheduleProjectFromReceive = function centralRegisterPmSchedule(data){
        const result = originalRegister.apply(this, arguments);
        try { centralProjectStore.upsertProject(data, "project-receive"); } catch (err) { console.warn(err); }
        return result;
      };
      registerPmScheduleProjectFromReceive = window.registerPmScheduleProjectFromReceive;
    }
    const originalApprove = window.approvePmScheduleProposal || (typeof approvePmScheduleProposal === "function" ? approvePmScheduleProposal : null);
    if (typeof originalApprove === "function") {
      window.approvePmScheduleProposal = function centralApprovePmSchedule(){
        const item = typeof getCurrentPmScheduleProject === "function" ? getCurrentPmScheduleProject() : null;
        const result = originalApprove.apply(this, arguments);
        try { if (item) syncPmScheduleToCentral(item); } catch (err) { console.warn(err); }
        return result;
      };
      approvePmScheduleProposal = window.approvePmScheduleProposal;
    }
    const originalPmBuilder = window.pmBuildProjectFromReceiveItem || (typeof pmBuildProjectFromReceiveItem === "function" ? pmBuildProjectFromReceiveItem : null);
    if (typeof originalPmBuilder === "function" && !window.__centralProjectManageBuilderPatched) {
      window.__centralProjectManageBuilderPatched = true;
      window.pmBuildProjectFromReceiveItem = function centralPmBuildProjectFromReceiveItem(item = {}){
        const built = originalPmBuilder.apply(this, arguments);
        try {
          const data = item.data || item;
          const key = centralProjectStore.keyFromData(data);
          const matched = centralProjectStore.getProjects().find(p => (p.keys || []).includes(key));
          const central = matched || centralProjectStore.upsertProject(data, "project-receive", { log:false });
          built.__centralProjectUid = central.projectUid;
          built.status = central.status || built.status;
          built.deliveries = (central.delivery?.files || []).map(f => ({ round: f.round, date: f.date, fileName: f.fileName, approved: !!f.approved }));
          built.completionHistory = [
            ...(built.completionHistory || []),
            ...((central.dailyReports || []).filter(r => r.delayReason).map(r => `${r.date} : 지연사유 보고 - ${r.delayReason}`)),
            ...((central.pmSchedule?.tasks || []).flatMap(t => (t.interruptions || []).map(i => `${i.at} : ${t.title} ${i.days}일 지연 - ${i.reason}`)))
          ];
          built.orderHistory = [
            ...(built.orderHistory || []),
            ...((central.history || []).slice(0, 5).map(h => `${h.at} : ${h.action}${h.detail ? ` - ${h.detail}` : ""}`))
          ];
          if (central.progress?.progressRate) built.status = `${central.status} · 공정률 ${central.progress.progressRate}%`;
        } catch (err) { console.warn("프로젝트 운영현황 중앙 데이터 반영 실패", err); }
        return built;
      };
      pmBuildProjectFromReceiveItem = window.pmBuildProjectFromReceiveItem;
    }

    const originalPmRefresh = window.pmRefreshLinkedEstimateProjects;
    if (typeof originalPmRefresh === "function") {
      window.pmRefreshLinkedEstimateProjects = function centralPmRefresh(){
        const result = originalPmRefresh.apply(this, arguments);
        try { refreshCentralStore(); } catch (err) { console.warn(err); }
        return result;
      };
      pmRefreshLinkedEstimateProjects = window.pmRefreshLinkedEstimateProjects;
    }
  }
  function patchSwitchWorkPanel(){
    const original = window.switchWorkPanel || (typeof switchWorkPanel === "function" ? switchWorkPanel : null);
    if (typeof original !== "function" || window.__centralSwitchWorkPatched) return;
    window.__centralSwitchWorkPatched = true;
    window.switchWorkPanel = function centralSwitchWorkPanel(panelId){
      const result = original.apply(this, arguments);
      if (panelId === "deliveryData") renderDeliveryData();
      if (panelId === "dailyReport") renderDailyReport();
      return result;
    };
    switchWorkPanel = window.switchWorkPanel;
  }

  window.renderDeliveryData = renderDeliveryData;
  window.setDeliveryProject = setDeliveryProject;
  window.saveDeliveryUpload = saveDeliveryUpload;
  window.saveDeliveryRecord = saveDeliveryRecord;
  window.renderDailyReport = renderDailyReport;
  window.setDailyProject = setDailyProject;
  window.saveDailyReport = saveDailyReport;
  window.saveInterruptingWork = saveInterruptingWork;
  window.approveDailyReport = approveDailyReport;
  window.syncPmScheduleToCentral = syncPmScheduleToCentral;
  window.refreshCentralProjectStore = refreshCentralStore;

  document.addEventListener("DOMContentLoaded", () => {
    installWrappers();
    patchSwitchWorkPanel();
    refreshCentralStore();
    renderDeliveryData();
    renderDailyReport();
  });
})();
