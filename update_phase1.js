const fs = require('fs');

let coreJs = fs.readFileSync('work-project-receive-core.js', 'utf8');

// Replace getProjectReceiveListItems()
const newListItems = `function getProjectReceiveListItems() {
  if (!window.centralProjectStore) return [];
  return centralProjectStore.getProjects().map((p, index) => ({
    source: p.status === '프로젝트접수' || p.status === '작성완료' ? 'completed' : 'current',
    index,
    data: p.receive || p,
    status: p.status
  }));
}`;
coreJs = coreJs.replace(/function getProjectReceiveListItems\(\) \{[\s\S]*?\n\}/, newListItems);

// Update saveProjectReceiveDraft to use centralProjectStore
const oldSaveDraft = /function saveProjectReceiveDraft\(\) \{[\s\S]*?\n\}/;
const newSaveDraft = `function saveProjectReceiveDraft() {
  syncProjectReceiveInputsToState();
  if (!validateProjectReceiveSkeletonScope()) {
    renderProjectReceiveDashboard();
    showToast("골조성을 선택한 경우 가설, 단열, 견출, 방수턱 중 최소 1개를 선택해야 접수저장이 가능합니다.");
    return;
  }
  renderProjectReceiveStatus();
  const dbRowIndex = Number.isFinite(Number(projectReceiveState.dbPjRowIndex))
    ? Number(projectReceiveState.dbPjRowIndex)
    : projectReceiveFindDbPjRowIndex(projectReceiveState.projectNo);
  if (dbRowIndex >= 0) {
    projectReceiveSetDbPjCell(dbRowIndex, "작업착수일자", projectReceiveState.startDate);
    projectReceiveSetDbPjCell(dbRowIndex, "1차납품예정일", projectReceiveState.firstDelivery);
    projectReceiveSetDbPjCell(dbRowIndex, "2차납품예정일", projectReceiveState.secondDelivery);
    projectReceiveSetDbPjCell(dbRowIndex, "3차납품예정일", projectReceiveState.thirdDelivery);
  }
  
  if (window.centralProjectStore) {
    centralProjectStore.upsertProject(projectReceiveState, "project-receive");
  }

  if (typeof registerPmScheduleProjectFromReceive === "function") {
    registerPmScheduleProjectFromReceive(projectReceiveState);
  } else {
    showToast("프로젝트 접수 내용이 임시 저장되었습니다.");
  }
}`;
coreJs = coreJs.replace(oldSaveDraft, newSaveDraft);

// Replace projectReceiveUpsertCompleted to use centralProjectStore
const newUpsert = `function projectReceiveUpsertCompleted(data = {}, meta = {}) {
  if (!data || !projectReceiveLinkText(data.projectName)) return null;
  const record = JSON.parse(JSON.stringify(data));
  const payload = {
    sourceFile: meta.sourceFile || "프로젝트 접수 저장",
    data: record
  };
  
  if (window.centralProjectStore) {
    centralProjectStore.upsertProject(record, "project-receive");
  }
  return payload;
}`;
coreJs = coreJs.replace(/function projectReceiveUpsertCompleted\([\s\S]*?\n\}/, newUpsert);

fs.writeFileSync('work-project-receive-core.js', coreJs);
console.log('Updated work-project-receive-core.js');

let pmJs = fs.readFileSync('work-pm-schedule.js', 'utf8');

const newRegisterPm = `function registerPmScheduleProjectFromReceive(data) {
  if (window.centralProjectStore) {
     centralProjectStore.upsertPmSchedule(data, { status: "pending" });
  }
  initPmScheduleProjects();
  pmScheduleSelectedIndex = 0;
  renderPmScheduleDashboard();
  showToast("신규 프로젝트가 접수되었습니다. PM 배정 화면에 등록했습니다.");
}`;
pmJs = pmJs.replace(/function registerPmScheduleProjectFromReceive\([\s\S]*?\n\}/, newRegisterPm);

const newInitPm = `initPmScheduleProjects = function initPmScheduleProjectsStableMirror(){
  if (!window.centralProjectStore) return;
  const centralItems = centralProjectStore.getProjects().filter(p => p.source === 'pm-schedule-approved' || p.source === 'pm-schedule' || p.status === '프로젝트접수' || p.receive?.projectNo);
  
  pmScheduleProjects = centralItems.map(p => {
    return {
      source: p.source,
      project: p.receive || p,
      status: p.pmSchedule?.status || "pending",
      manager: p.pmSchedule?.assignments?.manager || "-",
      checker: p.pmSchedule?.assignments?.checker || "-",
      worker: p.pmSchedule?.assignments?.worker || "-"
    };
  });
};
window.initPmScheduleProjects = initPmScheduleProjects;`;
pmJs = pmJs.replace(/initPmScheduleProjects = function initPmScheduleProjectsStableMirror\(\)\{[\s\S]*?window\.initPmScheduleProjects = initPmScheduleProjects;/m, newInitPm);

fs.writeFileSync('work-pm-schedule.js', pmJs);
console.log('Updated work-pm-schedule.js');
