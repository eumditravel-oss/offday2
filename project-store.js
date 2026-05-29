/* =========================================================
   업무관리 중앙 프로젝트 저장소
   - 업무관리 카테고리 간 직접 연결 대신 projectUid 기준 중앙 저장소로 정리
   - 프로젝트 접수 / PM배정 / 운영현황 / 납품 / 업무일지를 같은 프로젝트 데이터로 연결
========================================================= */
(function(){
  const STORAGE_KEY = "concost.work.centralProjectStore.v1";
  const exposed = window.centralProjectStore || {};

  function clone(data){
    try { return JSON.parse(JSON.stringify(data || {})); } catch (_) { return {}; }
  }
  function text(value){ return String(value ?? "").replace(/\s+/g, " ").trim(); }
  function today(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  function now(){
    const d = new Date();
    return `${today()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }
  function uid(prefix = "PRJ"){
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  }
  function load(){
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        version: 1,
        projects: parsed.projects && typeof parsed.projects === "object" ? parsed.projects : {},
        order: Array.isArray(parsed.order) ? parsed.order : [],
        updatedAt: parsed.updatedAt || now()
      };
    } catch (_) {
      return { version: 1, projects: {}, order: [], updatedAt: now() };
    }
  }
  let state = load();
  function save(){
    state.updatedAt = now();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (err) { console.warn("중앙 프로젝트 저장소 저장 실패", err); }
  }
  function emit(){
    try { window.dispatchEvent(new CustomEvent("centralProjectStore:updated", { detail: clone(state) })); } catch (_) {}
  }
  function keyFromData(data = {}){
    const direct = text(data.projectUid || data.uid || data.centralProjectUid);
    if (direct) return `UID:${direct}`;
    const receiveId = text(data.receiveId || data.internalReceiveId || data.linkedReceiveId);
    if (receiveId) return `RCV:${receiveId}`;
    const no = text(data.projectNo || data.pjNo || data.dbPjNo || data.id);
    if (no) return `NO:${no}`;
    const name = text(data.projectName || data.name || data.project || data.title);
    const client = text(data.client || data.clientName || data.company || data.companyRaw);
    if (name || client) return `NAME:${name}::${client}`;
    return `TMP:${uid("KEY")}`;
  }
  function findUidByKey(key){
    const projects = Object.values(state.projects || {});
    const found = projects.find(p => Array.isArray(p.keys) && p.keys.includes(key));
    return found?.projectUid || "";
  }
  function projectStatusBySource(project, source, incomingStatus){
    const status = text(incomingStatus);
    if (source === "pm-schedule-approved") return "일정승인완료";
    if (source === "pm-schedule") return status || project.status || "PM배정중";
    if (source === "project-receive") return status || project.status || "프로젝트접수";
    if (source === "delivery") return "납품자료등록";
    if (source === "daily-report") return "작업진행중";
    return status || project.status || "진행중";
  }
  function baseProject(data = {}, source = "manual"){
    const projectUid = text(data.projectUid || data.uid || data.centralProjectUid) || uid("PRJ");
    return {
      projectUid,
      keys: [],
      projectNo: text(data.projectNo || data.pjNo || data.dbPjNo || data.id),
      projectName: text(data.projectName || data.name || data.project || data.title) || "프로젝트명 미입력",
      clientName: text(data.client || data.clientName || data.company || data.companyRaw) || "-",
      status: text(data.status) || "진행중",
      source,
      receive: {},
      estimate: {},
      pmSchedule: { assignments: {}, tasks: [], approvals: [] },
      qaQc: { checklistStatus: "미확인", qcStatus: "검토대기", openQuestionCount: 0 },
      delivery: { files: [], records: [] },
      dailyReports: [],
      progress: { progressRate: 0, currentStep: "대기" },
      history: [],
      createdAt: now(),
      updatedAt: now()
    };
  }
  function addHistory(project, action, detail){
    project.history = Array.isArray(project.history) ? project.history : [];
    project.history.unshift({ at: now(), action: action || "변경", detail: detail || "", user: window.currentUserName || "사용자" });
    project.history = project.history.slice(0, 300);
  }
  function upsertProject(data = {}, source = "manual", options = {}){
    const key = keyFromData(data);
    const incomingUid = text(data.projectUid || data.uid || data.centralProjectUid);
    const existingUid = incomingUid && state.projects[incomingUid] ? incomingUid : findUidByKey(key);
    const project = existingUid ? state.projects[existingUid] : baseProject(data, source);
    const beforeStatus = project.status;
    project.keys = Array.from(new Set([...(project.keys || []), key, incomingUid ? `UID:${incomingUid}` : ""].filter(Boolean)));
    project.projectNo = text(data.projectNo || data.pjNo || data.dbPjNo || project.projectNo || data.id);
    project.projectName = text(data.projectName || data.name || data.project || data.title || project.projectName) || "프로젝트명 미입력";
    project.clientName = text(data.client || data.clientName || data.company || data.companyRaw || project.clientName) || "-";
    project.status = projectStatusBySource(project, source, data.status);
    project.updatedAt = now();
    project.source = source || project.source;
    project.receive = { ...(project.receive || {}), ...clone(data), projectUid: project.projectUid };
    if (data.firstDelivery || data.finalDelivery || data.startDate) {
      project.receive.firstDelivery = data.firstDelivery || project.receive.firstDelivery || "";
      project.receive.finalDelivery = data.finalDelivery || project.receive.finalDelivery || "";
      project.receive.startDate = data.startDate || project.receive.startDate || "";
    }
    if (options.estimate) project.estimate = { ...(project.estimate || {}), ...clone(options.estimate) };
    if (!state.projects[project.projectUid]) {
      state.order.unshift(project.projectUid);
      addHistory(project, "중앙 프로젝트 생성", `${project.projectName} / ${source}`);
    } else if (beforeStatus !== project.status) {
      addHistory(project, "상태 변경", `${beforeStatus || "-"} → ${project.status}`);
    } else if (options.log !== false) {
      addHistory(project, "중앙 프로젝트 갱신", source);
    }
    state.projects[project.projectUid] = project;
    state.order = Array.from(new Set(state.order.filter(Boolean)));
    save(); emit();
    return clone(project);
  }
  function getProjects(){
    const ordered = (state.order || []).map(id => state.projects[id]).filter(Boolean);
    const missing = Object.values(state.projects || {}).filter(p => !ordered.some(o => o.projectUid === p.projectUid));
    return clone([...ordered, ...missing]);
  }
  function getProject(uid){ return clone(state.projects[uid] || null); }
  function mutateProject(uid, mutator, action = "변경"){
    const project = state.projects[uid];
    if (!project) return null;
    mutator(project);
    project.updatedAt = now();
    addHistory(project, action, "");
    save(); emit();
    return clone(project);
  }
  function upsertDelivery(projectUid, delivery = {}){
    const project = state.projects[projectUid];
    if (!project) return null;
    const item = {
      deliveryUid: delivery.deliveryUid || uid("DLV"),
      round: text(delivery.round) || `${(project.delivery?.files?.length || 0) + 1}차 납품자료`,
      date: text(delivery.date) || today(),
      fileName: text(delivery.fileName || delivery.name) || "파일명 미입력",
      fileSize: delivery.fileSize || "",
      memo: text(delivery.memo),
      uploadedAt: now(),
      approved: !!delivery.approved
    };
    project.delivery = project.delivery || { files: [], records: [] };
    project.delivery.files = Array.isArray(project.delivery.files) ? project.delivery.files : [];
    const idx = project.delivery.files.findIndex(f => f.deliveryUid === item.deliveryUid);
    if (idx >= 0) project.delivery.files[idx] = item; else project.delivery.files.unshift(item);
    project.delivery.records = Array.isArray(project.delivery.records) ? project.delivery.records : [];
    project.delivery.records.unshift({ at: now(), type: "납품자료 업로드", memo: `${item.round} / ${item.fileName} / ${item.memo || "메모 없음"}` });
    project.status = "납품자료등록";
    addHistory(project, "납품자료 등록", `${item.round} · ${item.fileName}`);
    save(); emit();
    return clone(item);
  }
  function addDeliveryRecord(projectUid, record = {}){
    const project = state.projects[projectUid];
    if (!project) return null;
    project.delivery = project.delivery || { files: [], records: [] };
    project.delivery.records = Array.isArray(project.delivery.records) ? project.delivery.records : [];
    const item = { recordUid: uid("DLR"), at: now(), type: text(record.type) || "기록", memo: text(record.memo), writer: text(record.writer) || "사용자" };
    project.delivery.records.unshift(item);
    addHistory(project, "납품기록 등록", item.memo);
    save(); emit();
    return clone(item);
  }
  function normalizeDate(value){ return text(value || today()).replaceAll(".", "-"); }
  function addDays(dateText, days){
    const d = new Date(normalizeDate(dateText));
    if (!Number.isFinite(d.getTime())) return normalizeDate(dateText);
    d.setDate(d.getDate() + Number(days || 0));
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  function upsertPmSchedule(projectLike = {}, scheduleLike = {}){
    const data = projectLike.project || projectLike.receive || projectLike;
    const project = upsertProject(data, projectLike.status === "approved" ? "pm-schedule-approved" : "pm-schedule", { log:false });
    const real = state.projects[project.projectUid];
    real.pmSchedule = real.pmSchedule || { assignments: {}, tasks: [], approvals: [] };
    real.pmSchedule.status = projectLike.status || real.pmSchedule.status || "pending";
    real.pmSchedule.approvedPlan = projectLike.approvedPlan || projectLike.selectedProposal || real.pmSchedule.approvedPlan || "";
    real.pmSchedule.approvedAt = projectLike.scheduleApprovedAt || real.pmSchedule.approvedAt || "";
    real.pmSchedule.startDate = projectLike.scheduleStartDate || real.pmSchedule.startDate || data.startDate || "";
    real.pmSchedule.assignments = { ...(real.pmSchedule.assignments || {}), ...(projectLike.assignment || {}) };
    if (Array.isArray(scheduleLike.tasks)) real.pmSchedule.tasks = scheduleLike.tasks;
    addHistory(real, "PM배정/일정 연계", real.pmSchedule.status);
    save(); emit();
    return clone(real);
  }
  function ensureTask(projectUid, task = {}){
    const project = state.projects[projectUid];
    if (!project) return null;
    project.pmSchedule = project.pmSchedule || { assignments: {}, tasks: [], approvals: [] };
    project.pmSchedule.tasks = Array.isArray(project.pmSchedule.tasks) ? project.pmSchedule.tasks : [];
    const taskUid = task.taskUid || uid("TSK");
    const start = normalizeDate(task.startDate || project.pmSchedule.startDate || project.receive?.startDate || today());
    const plannedDays = Math.max(1, Number(task.plannedDays || task.days || 1));
    const item = {
      taskUid,
      title: text(task.title) || `${project.projectName} 작업`,
      personName: text(task.personName || task.assignee) || "담당자 미지정",
      dept: text(task.dept),
      category: text(task.category),
      startDate: start,
      plannedDays,
      plannedEndDate: normalizeDate(task.plannedEndDate || addDays(start, plannedDays - 1)),
      remainingDays: Number.isFinite(Number(task.remainingDays)) ? Number(task.remainingDays) : plannedDays,
      progressRate: Number(task.progressRate || 0),
      status: task.status || "진행예정",
      interruptions: Array.isArray(task.interruptions) ? task.interruptions : []
    };
    const idx = project.pmSchedule.tasks.findIndex(t => t.taskUid === taskUid || (t.personName === item.personName && t.title === item.title));
    if (idx >= 0) project.pmSchedule.tasks[idx] = { ...project.pmSchedule.tasks[idx], ...item }; else project.pmSchedule.tasks.push(item);
    addHistory(project, "업무일정 등록", `${item.personName} · ${item.title} · ${item.plannedDays}일`);
    save(); emit();
    return clone(item);
  }
  function addDailyReport(projectUid, report = {}){
    const project = state.projects[projectUid];
    if (!project) return null;
    project.dailyReports = Array.isArray(project.dailyReports) ? project.dailyReports : [];
    const item = {
      reportUid: report.reportUid || uid("DR"),
      taskUid: text(report.taskUid),
      date: normalizeDate(report.date || today()),
      stage: text(report.stage) || "1차 작성",
      planMemo: text(report.planMemo),
      resultMemo: text(report.resultMemo),
      progressRate: Math.max(0, Math.min(100, Number(report.progressRate || 0))),
      delayReason: text(report.delayReason),
      overtimeReason: text(report.overtimeReason),
      approval: {
        pm: report.overtimeReason ? "PM승인대기" : (report.delayReason ? "PM확인대기" : "해당없음"),
        director: report.overtimeReason ? "실장승인대기" : "해당없음"
      },
      createdAt: now(),
      writer: text(report.writer) || "작성자"
    };
    project.dailyReports.unshift(item);
    if (item.taskUid && Array.isArray(project.pmSchedule?.tasks)) {
      const task = project.pmSchedule.tasks.find(t => t.taskUid === item.taskUid);
      if (task) {
        task.progressRate = Math.max(Number(task.progressRate || 0), item.progressRate);
        task.status = item.progressRate >= 100 ? "완료" : "진행중";
      }
    }
    project.progress = project.progress || {};
    project.progress.progressRate = Math.max(Number(project.progress.progressRate || 0), item.progressRate);
    project.progress.currentStep = item.stage;
    project.status = "작업진행중";
    addHistory(project, "업무일지 작성", `${item.stage} · 공정률 ${item.progressRate}%${item.delayReason ? " · 지연사유 PM/실장 전달" : ""}${item.overtimeReason ? " · 야근 승인요청" : ""}`);
    save(); emit();
    return clone(item);
  }
  function approveDailyReport(projectUid, reportUid, role){
    const project = state.projects[projectUid];
    if (!project) return null;
    const report = (project.dailyReports || []).find(r => r.reportUid === reportUid);
    if (!report) return null;
    report.approval = report.approval || {};
    if (role === "pm") report.approval.pm = "PM승인완료";
    if (role === "director") report.approval.director = "실장승인완료";
    addHistory(project, role === "pm" ? "PM 업무일지 승인" : "실장 야근 승인", `${report.stage} · ${report.date}`);
    save(); emit();
    return clone(report);
  }
  function assignInterruptingWork(projectUid, payload = {}){
    const project = state.projects[projectUid];
    if (!project) return null;
    const tasks = project.pmSchedule?.tasks || [];
    const activeTask = tasks.find(t => t.taskUid === payload.pausedTaskUid) || tasks.find(t => t.personName === payload.personName && t.status !== "완료");
    const start = normalizeDate(payload.startDate || today());
    const newDays = Math.max(1, Number(payload.days || 1));
    if (activeTask) {
      activeTask.interruptions = Array.isArray(activeTask.interruptions) ? activeTask.interruptions : [];
      activeTask.interruptions.push({ at: start, days: newDays, reason: text(payload.reason) || "추가 업무 배정", newTaskTitle: text(payload.title) });
      activeTask.plannedEndDate = addDays(activeTask.plannedEndDate || start, newDays);
      activeTask.status = "일시중지";
      addHistory(project, "기존 업무 일시중지", `${activeTask.title} · ${newDays}일 밀림`);
    }
    const newTask = ensureTask(projectUid, {
      title: text(payload.title) || "추가 업무",
      personName: text(payload.personName) || activeTask?.personName || "담당자 미지정",
      dept: text(payload.dept) || activeTask?.dept || "",
      category: text(payload.category) || "추가업무",
      startDate: start,
      plannedDays: newDays,
      status: "진행중"
    });
    const real = state.projects[projectUid];
    const task = real.pmSchedule.tasks.find(t => t.taskUid === newTask.taskUid);
    if (task) task.blocksTaskUid = activeTask?.taskUid || "";
    addHistory(real, "추가 업무 배정", `${newTask.personName} · ${newTask.title} · ${newDays}일`);
    save(); emit();
    return clone({ pausedTask: activeTask, newTask });
  }
  function clear(){ state = { version:1, projects:{}, order:[], updatedAt: now() }; save(); emit(); }

  Object.assign(exposed, {
    upsertProject,
    getProjects,
    getProject,
    mutateProject,
    upsertDelivery,
    addDeliveryRecord,
    upsertPmSchedule,
    ensureTask,
    addDailyReport,
    approveDailyReport,
    assignInterruptingWork,
    keyFromData,
    today,
    now,
    clear,
    _raw: () => clone(state)
  });
  window.centralProjectStore = exposed;
})();
