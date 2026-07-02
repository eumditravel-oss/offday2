const fs = require('fs');

// 1. Update support-hr.js
let hrJs = fs.readFileSync('support-hr.js', 'utf8');

const newValidateModal = `function validateModal() {
  const modal = document.getElementById("employeeModal");
  if (!modal) return;

  const requiredInputs = modal.querySelectorAll("[required]");
  let valid = true;

  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add("invalid");
      valid = false;
    } else {
      input.classList.remove("invalid");
    }
  });

  if (valid) {
    const inputs = modal.querySelectorAll("input");
    const selects = modal.querySelectorAll("select");
    
    // Inputs: 0:성명, 1:한국표기명, 2:사번, 3:아이디, 4:입사일, 5:이메일, 6:휴대폰
    // Selects: 0:소속회사, 1:재직상태, 2:국가코드
    const empData = {
      empNo: inputs[2] ? inputs[2].value.trim() : "EMP-NEW",
      name: inputs[0] ? inputs[0].value.trim() : "신규입사자",
      koName: inputs[1] ? inputs[1].value.trim() : "",
      company: selects[0] ? selects[0].value : "CON-COST",
      department: "부서 미정", // 기본값
      grade: "사원",
      status: selects[1] ? selects[1].value : "입사예정",
      join: inputs[4] ? inputs[4].value : new Date().toISOString().split('T')[0],
      email: inputs[5] ? inputs[5].value.trim() : "",
      phone: inputs[6] ? inputs[6].value.trim() : "",
      history: [],
      performance: [],
      assets: []
    };

    if (window.employeeStore) {
      window.employeeStore.upsertEmployee(empData);
      
      // UI 리렌더링
      if (typeof renderEmployeeList === 'function') renderEmployeeList();
      if (typeof renderLedger === 'function') renderLedger();
      if (typeof renderKpis === 'function') renderKpis();
    }

    closeModal();
    showToast("신규 직원이 등록되었습니다.");
    
    // 폼 초기화
    inputs.forEach(i => i.value = "");
  } else {
    showToast("* 필수 입력값을 확인해 주세요.");
  }
}`;
hrJs = hrJs.replace(/function validateModal\([\s\S]*?\n\}/, newValidateModal);
fs.writeFileSync('support-hr.js', hrJs);

// 2. Update support-org.js
let orgJs = fs.readFileSync('support-org.js', 'utf8');

const oldSaveOrg = /function saveOrgVisualEditor\(\) \{[\s\S]*?\}\n\}/;
const matchSave = orgJs.match(oldSaveOrg);
if (matchSave) {
  let body = matchSave[0];
  body = body.replace('showToast("조직도 편집 설정이 저장되었습니다.");', `if (window.employeeStore) window.employeeStore.saveOrg();\n  showToast("조직도 편집 설정이 저장되었습니다.");`);
  orgJs = orgJs.replace(oldSaveOrg, body);
}

fs.writeFileSync('support-org.js', orgJs);

console.log("Phase 3 updates applied successfully.");
