/* =========================
   Mail Store
   ========================= */

window.mailStore = {
  STORAGE_KEY: "concost.mail.v1",
  mails: [],

  load() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.mails = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load mailStore", e);
      this.mails = [];
    }
  },

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.mails));
    this.emit();
  },

  list({ box, type, projectUid, search } = {}) {
    let result = [...this.mails];
    if (box) result = result.filter(m => m.box === box);
    if (type && type !== "전체") result = result.filter(m => m.type === type);
    if (projectUid) result = result.filter(m => m.projectUid === projectUid);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(m => 
        (m.sender || "").toLowerCase().includes(s) ||
        (m.title || "").toLowerCase().includes(s) ||
        (m.projectName || "").toLowerCase().includes(s) ||
        (m.body || "").toLowerCase().includes(s)
      );
    }
    return result;
  },

  add(mailData) {
    const newMail = {
      id: "mail-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      box: mailData.box || "inbox",
      type: mailData.type || "일반",
      projectUid: mailData.projectUid || "",
      projectName: mailData.projectName || "",
      sender: mailData.sender || "Unknown",
      receivers: Array.isArray(mailData.receivers) ? mailData.receivers : [],
      title: mailData.title || "(제목 없음)",
      body: mailData.body || "",
      createdAt: mailData.createdAt || new Date().toLocaleString("ko-KR"),
      read: !!mailData.read,
      starred: !!mailData.starred,
      ...mailData
    };
    this.mails.push(newMail);
    this.save();
    return newMail;
  },

  markRead(id) {
    const m = this.mails.find(x => x.id === id);
    if (m && !m.read) {
      m.read = true;
      this.save();
    }
  },

  toggleStar(id) {
    const m = this.mails.find(x => x.id === id);
    if (m) {
      m.starred = !m.starred;
      this.save();
    }
  },

  reset() {
    this.mails = [];
    localStorage.removeItem(this.STORAGE_KEY);
  },

  emit() {
    window.dispatchEvent(new CustomEvent("mailStore:updated"));
  }
};

window.mailStore.load();
