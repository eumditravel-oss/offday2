/* =========================
   Employee Store (HR / Org)
   ========================= */

window.employeeStore = {
  HR_STORAGE_KEY: "concost.hr.v1",
  ORG_STORAGE_KEY: "concost.org.v1",

  load() {
    try {
      // 1. 직원 데이터 처리
      const savedHr = localStorage.getItem(this.HR_STORAGE_KEY);
      if (savedHr) {
        const hrData = JSON.parse(savedHr);
        if (Array.isArray(hrData) && window.employees) {
          window.employees.splice(0, window.employees.length, ...hrData);
        }
      }

      // 2. 조직도 데이터 처리
      const savedOrg = localStorage.getItem(this.ORG_STORAGE_KEY);
      if (savedOrg) {
        const orgData = JSON.parse(savedOrg);
        if (orgData && window.orgStructures) {
          // in-place replace
          for (let key in window.orgStructures) {
            delete window.orgStructures[key];
          }
          Object.assign(window.orgStructures, orgData);
        }
      }
    } catch (e) {
      console.error("Failed to load employeeStore", e);
    }
  },

  save() {
    if (window.employees) {
      localStorage.setItem(this.HR_STORAGE_KEY, JSON.stringify(window.employees));
    }
  },

  saveOrg() {
    if (window.orgStructures) {
      localStorage.setItem(this.ORG_STORAGE_KEY, JSON.stringify(window.orgStructures));
    }
  },

  getAll() {
    return window.employees || [];
  },

  upsertEmployee(empData) {
    if (!window.employees) return;
    const idx = window.employees.findIndex(e => e.empNo === empData.empNo);
    if (idx !== -1) {
      window.employees[idx] = { ...window.employees[idx], ...empData };
    } else {
      window.employees.push(empData);
    }
    this.save();
    this.emit();
  },

  setStatus(empNo, status) {
    if (!window.employees) return;
    const idx = window.employees.findIndex(e => e.empNo === empNo);
    if (idx !== -1) {
      window.employees[idx].status = status;
      this.save();
      this.emit();
    }
  },

  reset() {
    localStorage.removeItem(this.HR_STORAGE_KEY);
    localStorage.removeItem(this.ORG_STORAGE_KEY);
  },

  emit() {
    window.dispatchEvent(new CustomEvent("employeeStore:updated"));
  }
};

// 최초 로드
window.employeeStore.load();
