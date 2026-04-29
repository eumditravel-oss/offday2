:root{
  --bg:#f4f6fb;
  --panel:#ffffff;
  --text:#111827;
  --muted:#64748b;
  --line:#e5e7eb;
  --line2:#dbe3ef;
  --blue:#2563eb;
  --blue2:#1d4ed8;
  --sky:#eef6ff;
  --green:#16a34a;
  --red:#dc2626;
  --yellow:#d97706;
  --gray:#475569;
  --radius:22px;
  --shadow:0 14px 44px rgba(15,23,42,.06);
}

*{box-sizing:border-box;margin:0;padding:0}

body{
  background:var(--bg);
  color:var(--text);
  font-family:"Pretendard","Noto Sans KR",Arial,sans-serif;
  font-size:14px;
}

button,input,select,textarea{font-family:inherit}
.app{min-height:100vh}

.topbar{
  height:72px;
  background:#fff;
  border-bottom:1px solid var(--line);
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 34px;
  position:sticky;
  top:0;
  z-index:20;
}

.brand{display:flex;align-items:center;gap:12px}
.brand-mark{
  width:40px;height:40px;border-radius:14px;
  background:linear-gradient(135deg,#2563eb,#38bdf8);
  color:#fff;display:grid;place-items:center;font-weight:900;
}
.brand-text strong{display:block;font-size:18px;letter-spacing:-.5px}
.brand-text span{color:var(--muted);font-size:12px;font-weight:700}

.top-tabs{display:flex;gap:22px;font-weight:900;color:#475569}
.top-tabs span{cursor:pointer}
.top-tabs .active{color:var(--blue)}
.top-right{display:flex;align-items:center;gap:12px}

.lang,.bell,.user{
  border:1px solid var(--line2);
  background:#fff;
  border-radius:999px;
  padding:8px 12px;
  font-weight:900;
  color:#334155;
}

.bell{
  width:38px;height:38px;display:grid;place-items:center;padding:0;position:relative;
}
.bell::after{
  content:"3";position:absolute;top:-5px;right:-5px;width:18px;height:18px;
  border-radius:999px;background:var(--red);color:#fff;font-size:11px;display:grid;place-items:center;
}

.org-btn{
  background:#0f172a;
  color:#fff;
  border-color:#0f172a;
}

.content{padding:28px 34px 46px}
.page-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:22px}
.breadcrumb{font-size:13px;color:var(--blue);font-weight:900;margin-bottom:8px}
.page-head h1{font-size:30px;letter-spacing:-1px;margin-bottom:8px}
.page-head p{color:var(--muted);line-height:1.6}
.actions{display:flex;gap:8px;flex-wrap:wrap}

.workspace{
  display:grid;
  grid-template-columns:260px 1fr;
  gap:18px;
  align-items:start;
}

.side-nav{
  background:#fff;
  border:1px solid var(--line2);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
  padding:16px;
  position:sticky;
  top:92px;
}

.side-title{
  font-size:12px;
  font-weight:900;
  color:var(--muted);
  margin-bottom:12px;
}

.side-group{
  margin-bottom:10px;
}

.side-main,
.side-item{
  width:100%;
  border:0;
  text-align:left;
  cursor:pointer;
  font-weight:900;
}

.side-main{
  background:#f8fafc;
  color:#0f172a;
  border:1px solid var(--line2);
  border-radius:14px;
  padding:13px;
}

.side-main.active{
  background:#0f172a;
  color:#fff;
  border-color:#0f172a;
}

.side-sub{
  display:none;
  padding:8px 0 0 10px;
}

.side-sub.active{
  display:grid;
  gap:7px;
}

.side-item{
  background:#fff;
  color:#475569;
  border:1px solid var(--line2);
  border-radius:12px;
  padding:10px 12px;
}

.side-item.active{
  background:var(--blue);
  border-color:var(--blue);
  color:#fff;
}

.main-area{
  min-width:0;
}

.btn{
  border:0;border-radius:13px;padding:10px 15px;font-weight:900;cursor:pointer;white-space:nowrap;
}
.btn-primary{background:var(--blue);color:#fff}
.btn-primary:hover{background:var(--blue2)}
.btn-line{background:#fff;color:#334155;border:1px solid var(--line2)}
.btn-danger{background:#fee2e2;color:var(--red)}

.panel{display:none}
.panel.active{display:block}

.kpi-grid{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:14px;
  margin-bottom:18px;
}

.kpi-card{
  background:#fff;border:1px solid var(--line2);
  border-radius:var(--radius);box-shadow:var(--shadow);padding:18px;
}
.kpi-card span{display:block;color:var(--muted);font-weight:900;font-size:12px;margin-bottom:9px}
.kpi-card strong{font-size:26px;letter-spacing:-.7px}

.card{
  background:#fff;border:1px solid var(--line2);
  border-radius:var(--radius);box-shadow:var(--shadow);
  overflow:hidden;margin-bottom:18px;
}

.card-head{
  padding:17px 20px;background:#fbfdff;border-bottom:1px solid #edf2f7;
  display:flex;justify-content:space-between;align-items:center;gap:10px;
}
.card-head h2{font-size:18px;letter-spacing:-.4px}
.card-body{padding:20px}

.filter-grid{
  display:grid;
  grid-template-columns:1.4fr repeat(5,1fr) auto;
  gap:10px;
  align-items:end;
}

.field label{
  display:block;font-size:13px;font-weight:900;margin-bottom:7px;color:#334155;
}
.required::after{content:" *";color:var(--red)}

input,select,textarea{
  width:100%;
  border:1px solid var(--line2);
  border-radius:13px;
  padding:11px 12px;
  background:#fff;
  font-size:14px;
  outline:none;
}

input:focus,select:focus,textarea:focus{
  border-color:var(--blue);
  box-shadow:0 0 0 3px rgba(37,99,235,.08);
}

input.invalid,select.invalid,textarea.invalid{
  border-color:var(--red);
  background:#fff7f7;
}

.error-text{
  display:none;
  color:var(--red);
  font-size:12px;
  font-weight:800;
  margin-top:6px;
}

.invalid + .error-text{display:block}
.table-wrap{overflow-x:auto}

table{
  width:100%;
  border-collapse:collapse;
  min-width:980px;
}

th,td{
  padding:13px 11px;
  border-bottom:1px solid #edf2f7;
  text-align:left;
  vertical-align:middle;
  font-size:13px;
}

th{
  background:#f8fafc;
  color:#475569;
  font-weight:900;
  cursor:pointer;
}

tr:hover td{background:#fbfdff}

.badge{
  display:inline-flex;
  align-items:center;
  padding:5px 9px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
  white-space:nowrap;
}

.badge.green{background:#eaf7ef;color:var(--green)}
.badge.red{background:#fee2e2;color:var(--red)}
.badge.yellow{background:#fff7ed;color:var(--yellow)}
.badge.blue{background:var(--sky);color:var(--blue)}
.badge.gray{background:#f1f5f9;color:var(--gray)}

.company-chip{
  display:inline-flex;
  padding:6px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
}
.company-chip.concost{background:#eaf2ff;color:#1d4ed8}
.company-chip.vietqs{background:#ecfdf5;color:#047857}

.layout{
  display:grid;
  grid-template-columns:340px 1fr;
  gap:18px;
  align-items:start;
}

.employee-search{margin-bottom:14px}
.employee-list{display:grid;gap:10px;max-height:680px;overflow:auto;padding-right:4px}

.employee-item{
  border:1px solid var(--line2);
  background:#fff;
  border-radius:18px;
  padding:13px;
  display:flex;
  gap:12px;
  align-items:center;
  cursor:pointer;
}
.employee-item:hover{border-color:#bfdbfe}
.employee-item.active{border-color:var(--blue);background:#f8fbff;box-shadow:0 0 0 3px rgba(37,99,235,.06)}

.emp-photo{
  width:48px;height:48px;border-radius:16px;
  background:linear-gradient(135deg,#2563eb,#38bdf8);
  color:#fff;display:grid;place-items:center;font-weight:900;flex:0 0 auto;
}
.emp-name{font-weight:900;margin-bottom:4px}
.emp-meta{color:var(--muted);font-size:12px;line-height:1.4}

.profile-head{
  display:grid;
  grid-template-columns:108px 1fr auto;
  gap:18px;
  align-items:center;
}

.profile-photo{
  width:108px;height:132px;border-radius:24px;border:1px solid var(--line2);
  background:#e2e8f0;color:#64748b;display:grid;place-items:center;font-weight:900;
}

.profile-main h2{font-size:26px;letter-spacing:-.8px;margin-bottom:10px}
.profile-tags{display:flex;flex-wrap:wrap;gap:7px}
.profile-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}

.quick-grid,.summary-grid,.mini-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
  margin-top:18px;
}

.quick-box,.summary-box,.mini-box{
  border:1px solid var(--line2);
  background:#fbfdff;
  border-radius:18px;
  padding:15px;
}

.quick-box span,.summary-box span,.mini-box span{
  color:var(--muted);
  font-size:12px;
  font-weight:900;
}

.quick-box strong,.summary-box strong,.mini-box strong{
  display:block;
  margin-top:8px;
  font-size:20px;
}

.inner-tabs{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-bottom:18px;
}

.inner-tab{
  background:#fff;
  border:1px solid var(--line2);
  border-radius:999px;
  padding:9px 13px;
  font-weight:900;
  color:#475569;
  cursor:pointer;
}

.inner-tab.active{background:#0f172a;color:#fff;border-color:#0f172a}
.detail-panel{display:none}
.detail-panel.active{display:block}

.form-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:14px;
}
.field.full{grid-column:1/-1}

.phone-row{
  display:grid;
  grid-template-columns:180px 1fr;
  gap:10px;
}

.permission-field,.permission-text{
  cursor:pointer;
  color:#111827;
  background:#f8fafc;
  font-weight:800;
}

.permission-text{
  display:inline-flex;
  padding:5px 9px;
  border-radius:999px;
  background:#f1f5f9;
  border:1px solid var(--line2);
}

.audit-box{
  margin-top:18px;
  border:1px dashed var(--line2);
  border-radius:16px;
  padding:13px;
  color:#64748b;
  background:#fbfdff;
  font-size:12px;
  line-height:1.7;
  font-weight:800;
}

.history-group{margin-bottom:22px}
.history-group h3{font-size:16px;margin-bottom:10px;color:#0f172a}

.repeat-actions{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-bottom:14px;
}

.notice{
  border:1px solid #fed7aa;
  background:#fff7ed;
  color:#9a3412;
  border-radius:16px;
  padding:14px;
  line-height:1.7;
  font-weight:700;
  margin-bottom:16px;
}

.placeholder-box{
  border:1px dashed var(--line2);
  background:#fbfdff;
  border-radius:20px;
  padding:28px;
}

.placeholder-box h3{
  font-size:20px;
  margin-bottom:10px;
}

.placeholder-box p{
  color:var(--muted);
  line-height:1.7;
  font-weight:700;
}

.approval-flow{display:grid;gap:10px}
.flow-item{
  border:1px solid var(--line2);
  border-radius:16px;
  padding:14px;
  background:#fbfdff;
  display:flex;
  justify-content:space-between;
  gap:12px;
  align-items:center;
}
.flow-item span{color:var(--muted);font-size:13px}

.admin-layout{
  display:grid;
  grid-template-columns:1.45fr .85fr;
  gap:18px;
  align-items:start;
}

.admin-toggle-list{
  display:grid;
  gap:12px;
  margin-top:18px;
}

.admin-toggle-item{
  display:flex;
  justify-content:space-between;
  align-items:center;
  border:1px solid var(--line2);
  border-radius:16px;
  background:#fbfdff;
  padding:14px;
  font-weight:900;
}

.switch-toggle{
  position:relative;
  display:inline-block;
  width:50px;
  height:28px;
}
.switch-toggle input{opacity:0;width:0;height:0}
.slider{
  position:absolute;
  cursor:pointer;
  inset:0;
  background:#cbd5e1;
  border-radius:999px;
  transition:.2s;
}
.slider::before{
  content:"";
  position:absolute;
  width:22px;
  height:22px;
  left:3px;
  top:3px;
  background:#fff;
  border-radius:50%;
  transition:.2s;
}
.switch-toggle input:checked + .slider{background:var(--blue)}
.switch-toggle input:checked + .slider::before{transform:translateX(22px)}

.admin-save-area{
  display:flex;
  justify-content:flex-end;
  gap:8px;
  margin-top:18px;
}

.modal-backdrop,.permission-modal{
  position:fixed;
  inset:0;
  background:rgba(15,23,42,.36);
  display:none;
  align-items:center;
  justify-content:center;
  z-index:50;
  padding:20px;
}

.modal-backdrop.active,.permission-modal.active{display:flex}

.modal{
  width:min(960px,100%);
  background:#fff;
  border-radius:24px;
  box-shadow:0 30px 90px rgba(15,23,42,.25);
  overflow:hidden;
}

.modal-wide{
  width:min(1180px,100%);
}

.modal-head{
  padding:18px 22px;
  border-bottom:1px solid var(--line);
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.modal-body{padding:22px;max-height:72vh;overflow:auto}
.modal-foot{
  padding:16px 22px;
  border-top:1px solid var(--line);
  display:flex;
  justify-content:flex-end;
  gap:8px;
}

.permission-box{
  width:360px;
  background:#fff;
  border-radius:22px;
  padding:26px;
  box-shadow:0 30px 90px rgba(15,23,42,.25);
  text-align:center;
}

.permission-box h3{font-size:20px;margin-bottom:10px}
.permission-box p{color:#475569;margin-bottom:20px;font-weight:800}

.close{
  border:0;
  background:#f1f5f9;
  width:36px;
  height:36px;
  border-radius:12px;
  cursor:pointer;
  font-weight:900;
}

.org-chart{
  display:grid;
  gap:22px;
}

.org-level{
  display:flex;
  justify-content:center;
}

.org-branches{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
}

.org-card{
  border:1px solid var(--line2);
  background:#fbfdff;
  border-radius:22px;
  padding:20px;
}

.org-card h3{
  margin-bottom:14px;
  font-size:18px;
}

.org-row{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:12px;
}

.org-node{
  border:1px solid #bfdbfe;
  background:#fff;
  border-radius:18px;
  padding:14px;
  font-weight:900;
  cursor:pointer;
  line-height:1.5;
}

.org-node:hover{
  border-color:var(--blue);
  box-shadow:0 0 0 3px rgba(37,99,235,.08);
}

.org-node.ceo{
  width:220px;
  background:#0f172a;
  color:#fff;
  border-color:#0f172a;
}

.org-node.viet{
  border-color:#bbf7d0;
}

.mini-profile{
  display:flex;
  gap:18px;
  align-items:center;
  margin-bottom:18px;
}

.toast{
  position:fixed;
  right:24px;
  bottom:24px;
  background:#0f172a;
  color:#fff;
  border-radius:16px;
  padding:14px 18px;
  font-weight:900;
  display:none;
  z-index:80;
}
.toast.active{display:block}

@media(max-width:1280px){
  .workspace{grid-template-columns:1fr}
  .side-nav{position:static}
  .kpi-grid{grid-template-columns:repeat(3,1fr)}
  .filter-grid{grid-template-columns:repeat(3,1fr)}
  .layout{grid-template-columns:1fr}
  .admin-layout{grid-template-columns:1fr}
  .quick-grid,.summary-grid,.mini-grid{grid-template-columns:repeat(2,1fr)}
  .org-branches{grid-template-columns:1fr}
}

@media(max-width:760px){
  .topbar{height:auto;align-items:flex-start;flex-direction:column;gap:12px;padding:16px}
  .top-tabs{flex-wrap:wrap;gap:12px}
  .top-right{flex-wrap:wrap}
  .content{padding:18px}
  .page-head{display:block}
  .actions{margin-top:14px}
  .kpi-grid,.quick-grid,.summary-grid,.mini-grid,.form-grid,.filter-grid,.phone-row,.org-row{grid-template-columns:1fr}
  .profile-head{grid-template-columns:1fr}
  .profile-actions{justify-content:flex-start}
  .card-head{align-items:flex-start;flex-direction:column}
}


.modal-org-wide{width:min(96vw,1680px);max-height:92vh}
.org-modal-toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.org-tab{border:1px solid var(--line2);background:#fff;color:#334155;border-radius:999px;padding:10px 14px;font-weight:900;cursor:pointer}
.org-tab.active{background:#0f172a;color:#fff;border-color:#0f172a}
.org-chart-canvas{border:1px solid var(--line2);border-radius:24px;background:#fff;padding:18px;overflow:hidden}
.org-chart-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}
.org-chart-header span{color:#64748b;font-weight:900;font-size:12px}
.org-chart-header h3{font-size:24px;letter-spacing:-.7px;margin-top:4px}
.org-tree-scroll{overflow:auto;padding:8px 0 18px}
.org-tree{min-width:1180px;display:flex;justify-content:center}
.org-tree-item{display:flex;flex-direction:column;align-items:center;position:relative}
.org-tree-children{display:flex;justify-content:center;align-items:flex-start;gap:12px;padding-top:26px;position:relative}
.org-tree-children::before{content:"";position:absolute;top:10px;left:8%;right:8%;height:2px;background:#cbd5e1}
.org-tree-item::before{content:"";position:absolute;top:-16px;width:2px;height:16px;background:#cbd5e1}
.org-tree>.org-tree-item::before{display:none}
.org-tree-node{min-width:120px;max-width:160px;border:1px solid #bfdbfe;background:#fff;border-radius:14px;padding:10px 11px;font-weight:900;line-height:1.35;text-align:center;box-shadow:0 8px 20px rgba(15,23,42,.04)}
.org-tree-node strong{display:block;color:#1d4ed8;font-size:12px;margin-bottom:4px}
.org-tree-node b{display:block;color:#111827;font-size:13px}
.org-tree-node span,.org-tree-node small{display:block;color:#64748b;font-size:11px;margin-top:3px}
.org-tree-node.primary{background:#1d4ed8;border-color:#1d4ed8;color:#fff;min-width:210px}
.org-tree-node.primary strong,.org-tree-node.primary b,.org-tree-node.primary span,.org-tree-node.primary small,.org-tree-node.secondary strong,.org-tree-node.secondary b,.org-tree-node.secondary span,.org-tree-node.secondary small{color:#fff}
.org-tree-node.secondary{background:#3b82f6;border-color:#3b82f6;color:#fff;min-width:180px}
.org-tree-node.dotted{background:#94a3b8;border-color:#94a3b8;color:#fff}
.org-tree-node.clickable{cursor:pointer}
.org-tree-node.clickable:hover{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.12);transform:translateY(-1px)}
.org-editor-toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.org-edit-grid{display:grid;gap:10px}
.org-edit-row{display:grid;grid-template-columns:1fr 1.1fr 1.1fr 1.2fr 1fr auto;gap:10px;align-items:center;border:1px solid var(--line2);border-radius:16px;padding:12px;background:#fbfdff}
.org-edit-row span{display:block;color:#64748b;font-size:11px;font-weight:900;margin-bottom:4px}
.org-edit-row strong{font-size:13px}
.org-edit-actions{display:flex;gap:6px}
@media(max-width:1280px){.org-edit-row{grid-template-columns:repeat(2,1fr)}}

/* 조직도 한눈보기 개선 */
.modal-org-wide{
  width:calc(100vw - 28px) !important;
  max-width:1920px !important;
  height:calc(100vh - 28px) !important;
  max-height:calc(100vh - 28px) !important;
  border-radius:26px;
}

.modal-org-wide .modal-body{
  height:calc(100vh - 118px);
  overflow:hidden;
  display:flex;
  flex-direction:column;
  padding:14px 18px 18px;
}

.modal-org-wide .modal-head{
  min-height:64px;
}

.org-modal-toolbar{
  flex:0 0 auto;
  margin-bottom:10px;
}

.org-chart-canvas{
  flex:1 1 auto;
  overflow:hidden !important;
  padding:14px !important;
  display:flex;
  flex-direction:column;
  min-height:0;
}

.org-chart-header.compact{
  margin-bottom:10px;
  flex:0 0 auto;
}

.org-chart-header.compact h3{
  font-size:21px;
  margin-top:2px;
}

.org-chart-header-actions{
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
  justify-content:flex-end;
}

.org-stat{
  border:1px solid var(--line2);
  background:#fbfdff;
  border-radius:14px;
  padding:8px 11px;
  min-width:104px;
}

.org-stat span{
  display:block;
  font-size:10px !important;
  color:#64748b;
  font-weight:900;
  margin:0 0 2px;
}

.org-stat strong{
  display:block;
  font-size:17px;
  color:#0f172a;
}

.org-overview-fit{
  flex:1 1 auto;
  min-height:0;
  display:flex;
  flex-direction:column;
  gap:8px;
  overflow:hidden;
}

.org-overview-exec{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:10px;
  flex:0 0 auto;
}

.org-overview-line{
  height:2px;
  background:#cbd5e1;
  margin:0 4%;
  flex:0 0 auto;
}

.org-overview-grid{
  flex:1 1 auto;
  min-height:0;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:10px;
  overflow:hidden;
  align-items:stretch;
}

.org-overview-card{
  border:1px solid var(--line2);
  background:#fff;
  border-radius:16px;
  overflow:hidden;
  min-width:0;
  min-height:0;
  display:flex;
  flex-direction:column;
  box-shadow:0 8px 24px rgba(15,23,42,.035);
}

.org-overview-card-title{
  background:#eef6ff;
  color:#1d4ed8;
  font-weight:900;
  font-size:13px;
  text-align:center;
  padding:8px 8px;
  border-bottom:1px solid var(--line2);
}

.org-overview-lead{
  padding:7px 8px;
  text-align:center;
  font-size:12px;
  font-weight:900;
  color:#0f172a;
  border-bottom:1px solid #edf2f7;
}

.org-overview-members{
  padding:8px;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(92px,1fr));
  gap:6px;
  overflow:hidden;
  align-content:start;
}

.org-mini-person{
  border:1px solid #dbeafe;
  background:#fff;
  border-radius:11px;
  padding:6px 6px;
  min-width:0;
  min-height:54px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  gap:2px;
  line-height:1.2;
}

.org-mini-person span{
  display:block;
  color:#1d4ed8;
  font-size:10px;
  font-weight:900;
  max-width:100%;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.org-mini-person strong{
  display:block;
  color:#111827;
  font-size:12px;
  font-weight:900;
  max-width:100%;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.org-mini-person small{
  display:block;
  color:#64748b;
  font-size:9px;
  font-weight:800;
  max-width:100%;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.org-mini-person.primary{
  min-width:180px;
  min-height:48px;
  background:#1d4ed8;
  border-color:#1d4ed8;
}

.org-mini-person.secondary{
  min-width:150px;
  min-height:48px;
  background:#3b82f6;
  border-color:#3b82f6;
}

.org-mini-person.primary span,
.org-mini-person.primary strong,
.org-mini-person.primary small,
.org-mini-person.secondary span,
.org-mini-person.secondary strong,
.org-mini-person.secondary small{
  color:#fff;
}

.org-mini-person.lead{
  margin:8px;
  min-height:50px;
  background:#f8fbff;
}

.org-mini-person.clickable:hover{
  border-color:#2563eb;
  box-shadow:0 0 0 3px rgba(37,99,235,.10);
  transform:translateY(-1px);
}

.org-empty{
  color:#94a3b8;
  font-weight:900;
  text-align:center;
  font-size:12px;
  padding:12px;
}

.modal-org-wide + .notice,
.modal-org-wide .notice{
  flex:0 0 auto;
  margin-top:8px;
  margin-bottom:0;
  padding:10px 12px;
  font-size:12px;
}

@media(max-width:1400px){
  .org-overview-grid{grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px}
  .org-overview-members{grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:5px;padding:7px}
  .org-mini-person{min-height:50px;padding:5px}
  .org-mini-person strong{font-size:11px}
  .org-mini-person small{display:none}
}

@media(max-width:900px){
  .modal-org-wide .modal-body{overflow:auto;height:auto}
  .org-chart-canvas{overflow:auto !important}
  .org-overview-grid{grid-template-columns:1fr}
  .org-overview-fit{overflow:visible}
}


/* CON-COST 조직도: 중앙 기술본부 + 우측 개발/QC/클레임 배치 */
.concost-fit{min-width:0;}
.concost-exec{justify-content:center;}
.concost-org-layout{
  display:grid;
  grid-template-columns:minmax(190px,.9fr) minmax(560px,2.6fr) minmax(220px,1fr);
  gap:10px;
  align-items:stretch;
  height:430px;
  overflow:hidden;
}
.concost-left,.concost-center,.concost-right{min-width:0;display:grid;gap:8px;}
.concost-right{grid-template-rows:repeat(3,1fr);}
.concost-org-layout .org-overview-card{min-height:0;margin:0;}
.tech-main-card{border:2px solid #bfdbfe;background:#fbfdff;}
.team-major-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
  padding:8px;
  height:calc(100% - 92px);
  min-height:0;
}
.team-major-card{
  border:1px solid #cfe0f7;
  border-radius:16px;
  background:#fff;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  min-height:0;
}
.team-major-title{
  background:#dbeafe;
  color:#0b4ac7;
  font-weight:900;
  text-align:center;
  padding:8px 10px;
  border-bottom:1px solid #cfe0f7;
}
.team-mid-grid{display:grid;grid-template-columns:1fr;gap:7px;padding:7px;min-height:0;flex:1;}
.team-mid-grid.two-col{grid-template-columns:1fr 1fr;}
.team-mid-card{
  border:1px dashed #cbd5e1;
  border-radius:14px;
  background:#f8fafc;
  overflow:hidden;
  min-height:0;
  display:flex;
  flex-direction:column;
}
.team-mid-title{
  padding:7px 8px;
  text-align:center;
  font-size:12px;
  font-weight:900;
  color:#334155;
  border-bottom:1px solid #e2e8f0;
}
.compact-members{
  flex:1;
  overflow:auto;
  grid-template-columns:repeat(auto-fit,minmax(82px,1fr));
  align-content:start;
}
.concost-org-layout .org-overview-members{overflow:auto;}
.concost-org-layout .org-mini-person{min-height:48px;padding:5px 6px;}
.concost-org-layout .org-mini-person span{font-size:10px;}
.concost-org-layout .org-mini-person strong{font-size:11px;}
.concost-org-layout .org-mini-person small{font-size:9px;}
.vietqs-grid{grid-template-columns:repeat(4,minmax(230px,1fr));}

@media(max-width:1280px){
  .concost-org-layout{grid-template-columns:1fr;height:auto;overflow:visible;}
  .concost-right{grid-template-rows:auto;}
  .team-major-grid,.team-mid-grid.two-col{grid-template-columns:1fr;}
}

/* 2026-04-28 조직도 한눈보기 보정: 세로 잘림 방지 + CON-COST 중앙형 배치 압축 */
.modal-org-wide{
  width:100vw !important;
  max-width:100vw !important;
  height:100vh !important;
  max-height:100vh !important;
  border-radius:0 !important;
}

.modal-org-wide .modal-head{
  min-height:52px !important;
  padding:12px 18px !important;
}

.modal-org-wide .modal-body{
  height:calc(100vh - 52px) !important;
  padding:10px 14px 12px !important;
  overflow:hidden !important;
}

.org-modal-toolbar{
  margin-bottom:8px !important;
}

.org-tab{
  padding:8px 13px !important;
}

.org-chart-canvas{
  padding:10px 12px !important;
  border-radius:18px !important;
  min-height:0 !important;
}

.org-chart-header.compact{
  margin-bottom:6px !important;
  min-height:54px;
}

.org-chart-header.compact h3{
  font-size:20px !important;
  margin-top:0 !important;
}

.org-chart-header.compact span{
  font-size:11px !important;
}

.org-chart-header-actions{
  gap:6px !important;
}

.org-stat{
  min-width:92px !important;
  padding:6px 9px !important;
  border-radius:12px !important;
}

.org-stat strong{
  font-size:15px !important;
}

.org-overview-fit{
  gap:6px !important;
}

.org-overview-exec{
  gap:8px !important;
}

.org-overview-line{
  height:2px !important;
  margin:0 4% !important;
}

.org-overview-card{
  border-radius:14px !important;
}

.org-overview-card-title{
  padding:6px 8px !important;
  font-size:12px !important;
}

.org-overview-lead{
  padding:5px 7px !important;
  font-size:11px !important;
}

.org-overview-members{
  padding:6px !important;
  gap:5px !important;
}

.org-mini-person{
  min-height:42px !important;
  padding:4px 5px !important;
  border-radius:9px !important;
  gap:1px !important;
  line-height:1.08 !important;
}

.org-mini-person span{
  font-size:9px !important;
}

.org-mini-person strong{
  font-size:10.5px !important;
}

.org-mini-person small{
  font-size:8.5px !important;
}

.org-mini-person.primary,
.org-mini-person.secondary{
  min-height:42px !important;
  min-width:145px !important;
}

.org-mini-person.lead{
  margin:6px !important;
  min-height:42px !important;
}

.modal-org-wide .notice{
  margin-top:7px !important;
  padding:8px 11px !important;
  font-size:11px !important;
  line-height:1.45 !important;
}

.concost-org-layout{
  grid-template-columns:minmax(205px,.82fr) minmax(760px,2.85fr) minmax(210px,.9fr) !important;
  gap:8px !important;
  height:calc(100vh - 244px) !important;
  min-height:440px !important;
  max-height:560px !important;
  overflow:hidden !important;
}

.concost-left,
.concost-center,
.concost-right{
  gap:7px !important;
}

.concost-right{
  grid-template-rows:.9fr .75fr .9fr !important;
}

.tech-main-card{
  overflow:hidden !important;
}

.team-major-grid{
  grid-template-columns:1fr 1.05fr !important;
  gap:7px !important;
  padding:7px !important;
  height:calc(100% - 74px) !important;
}

.team-major-title{
  padding:6px 8px !important;
  font-size:13px !important;
}

.team-mid-grid{
  padding:6px !important;
  gap:6px !important;
}

.team-mid-title{
  padding:5px 7px !important;
  font-size:11px !important;
}

.compact-members{
  grid-template-columns:repeat(auto-fit,minmax(68px,1fr)) !important;
  gap:4px !important;
  padding:5px !important;
  overflow:hidden !important;
}

.concost-org-layout .org-overview-members{
  grid-template-columns:repeat(auto-fit,minmax(72px,1fr)) !important;
  overflow:hidden !important;
}

.concost-org-layout .org-mini-person{
  min-height:38px !important;
  padding:3px 4px !important;
}

.concost-org-layout .org-mini-person span{
  font-size:8.5px !important;
}

.concost-org-layout .org-mini-person strong{
  font-size:9.8px !important;
}

.concost-org-layout .org-mini-person small{
  display:none !important;
}

.concost-org-layout .org-mini-person.lead{
  min-height:40px !important;
  margin:5px !important;
}

.concost-left .org-overview-members,
.concost-right .org-overview-members{
  grid-template-columns:repeat(auto-fit,minmax(70px,1fr)) !important;
}

.vietqs-grid{
  grid-template-columns:repeat(4,minmax(220px,1fr)) !important;
  height:calc(100vh - 244px) !important;
  min-height:440px !important;
  max-height:560px !important;
}

.vietqs-grid .org-overview-members{
  grid-template-columns:repeat(auto-fit,minmax(74px,1fr)) !important;
  overflow:hidden !important;
}

.vietqs-grid .org-mini-person small{
  display:none !important;
}

@media(max-width:1280px){
  .concost-org-layout{
    grid-template-columns:1fr !important;
    height:auto !important;
    max-height:none !important;
    overflow:visible !important;
  }
  .modal-org-wide .modal-body{overflow:auto !important;}
  .org-chart-canvas{overflow:auto !important;}
}

/* 조직도 세로 배치 보정 - CON-COST */
.vertical-org-section .org-overview-members,
.vertical-members{
  display:grid !important;
  grid-template-columns:1fr !important;
  gap:5px !important;
  align-content:start;
}

.vertical-org-section .org-person,
.vertical-members .org-person{
  min-height:34px;
  padding:5px 7px;
  text-align:center;
}

.vertical-org-section .org-overview-card{
  min-height:auto;
}

.concost-org-layout{
  grid-template-columns:340px minmax(760px,1fr) 330px !important;
  align-items:start;
}

.team-mid-grid.three-col{
  display:grid;
  grid-template-columns:1fr 1.15fr .85fr;
  gap:7px;
  padding:7px;
  min-height:0;
  flex:1;
}

.team-mid-grid.three-col .team-mid-card{
  min-width:0;
}

.civil-only-card .org-overview-members{
  align-content:start;
}

.concost-left .org-overview-members,
.concost-right .org-overview-members{
  max-height:none;
  overflow:visible;
}

@media (max-width:1300px){
  .concost-org-layout{grid-template-columns:1fr !important;}
  .team-mid-grid.three-col{grid-template-columns:1fr;}
}

/* 업무관리 탭 */
.module-view{display:none}
.module-view.active{display:block}
.work-panel{display:none}
.work-panel.active{display:block}
.work-kpi-grid{grid-template-columns:repeat(5,1fr)}
.subcopy{color:var(--muted);font-size:13px;font-weight:700;line-height:1.6;margin-top:6px}
.process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.process-card{border:1px solid var(--line2);background:#fbfdff;border-radius:18px;padding:16px;min-height:120px}
.process-card strong{display:block;font-size:15px;margin-bottom:10px;color:#0f172a}
.process-card span{display:block;color:var(--muted);font-weight:800;line-height:1.55}
.checklist-card .card-head{align-items:flex-start}
.checklist-toolbar{display:grid;grid-template-columns:1.1fr .7fr .7fr 1.3fr;gap:10px;margin-bottom:14px;align-items:end}
.excel-grid-wrap{width:100%;overflow:auto;border:1px solid var(--line2);border-radius:16px;background:#fff;max-height:620px}
.excel-grid{min-width:1580px;border-collapse:separate;border-spacing:0}
.excel-grid th{position:sticky;top:0;background:#eef6ff;z-index:2;border-right:1px solid #dbe3ef;border-bottom:1px solid #cbd5e1;text-align:center;font-size:12px;padding:10px 8px;white-space:nowrap}
.excel-grid td{border-right:1px solid #edf2f7;border-bottom:1px solid #edf2f7;padding:0;background:#fff;vertical-align:top}
.excel-grid tr:hover td{background:#fbfdff}
.excel-grid .cell{min-height:40px;padding:9px 10px;outline:none;line-height:1.45;font-size:13px;font-weight:700;white-space:pre-wrap}
.excel-grid .cell:focus{background:#fff7ed;box-shadow:inset 0 0 0 2px rgba(37,99,235,.38)}
.excel-grid .col-check{width:46px;text-align:center}
.excel-grid td:first-child{text-align:center;padding:10px 0}
.excel-select{border:0;background:transparent;width:100%;height:40px;padding:0 8px;font-weight:800;color:#334155;outline:none}
.row-actions{display:flex;gap:6px;justify-content:center;align-items:center;padding:7px}
.row-actions .btn{padding:7px 9px;border-radius:10px;font-size:12px}
.status-pill{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:5px 8px;font-size:12px;font-weight:900;background:#f1f5f9;color:#475569}
@media(max-width:1280px){.process-grid{grid-template-columns:repeat(2,1fr)}.checklist-toolbar{grid-template-columns:repeat(2,1fr)}}
@media(max-width:760px){.process-grid,.checklist-toolbar{grid-template-columns:1fr}.work-kpi-grid{grid-template-columns:1fr 1fr}}

/* 수량산출 체크리스트 확인 체크/처리 이력 */
.excel-grid th:nth-child(9),
.excel-grid td:nth-child(9){
  width:92px;
  min-width:92px;
  text-align:center;
}

.excel-grid th:nth-child(11),
.excel-grid td:nth-child(11){
  width:190px;
  min-width:190px;
}

.done-cell{
  text-align:center !important;
  vertical-align:middle !important;
  padding:8px !important;
}

.done-check-wrap{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  border:1px solid var(--line2);
  border-radius:999px;
  padding:6px 8px;
  background:#fff;
  font-size:12px;
  font-weight:900;
  color:#475569;
  cursor:pointer;
  white-space:nowrap;
}

.done-check-wrap input{
  width:15px;
  height:15px;
  accent-color:var(--blue);
}

.row-done td{
  background:#f8fbff !important;
}

.row-done .done-check-wrap{
  border-color:#bfdbfe;
  background:#eef6ff;
  color:var(--blue);
}

.history-cell{
  min-height:40px;
  padding:7px 8px;
  display:grid;
  gap:4px;
  align-content:center;
}

.history-line{
  display:grid;
  gap:2px;
  line-height:1.25;
}

.history-line strong{
  font-size:12px;
  color:#0f172a;
}

.history-line span,
.history-empty{
  font-size:11px;
  color:#64748b;
  font-weight:800;
}


/* QC 검토/승인 안에 수량산출 체크리스트 포함 */
.qc-review-guide .notice{margin-bottom:0}
#qcReview .checklist-card{margin-bottom:18px}
#qcReview .excel-grid-wrap{max-height:560px}
#qcReview .card-head .subcopy{max-width:900px}

/* 요청 반영: QC 체크리스트 상태 컬럼 제거 / 요청 대상별 체크 / 구분 가로 구분선 / 추가 모달 */
.excel-grid{min-width:1460px}
.group-separator-row td{
  background:#f8fafc !important;
  border-top:2px solid #cbd5e1;
  border-bottom:1px solid #dbe3ef;
  padding:9px 12px !important;
  text-align:left !important;
}
.group-separator-row span{
  display:inline-flex;
  align-items:center;
  margin-right:8px;
  padding:3px 8px;
  border-radius:999px;
  background:#e2e8f0;
  color:#475569;
  font-size:11px;
  font-weight:900;
}
.group-separator-row strong{
  color:#0f172a;
  font-size:13px;
  font-weight:900;
}
.target-chip-list{
  min-height:40px;
  padding:7px 8px;
  display:flex;
  flex-wrap:wrap;
  gap:5px;
  align-content:flex-start;
}
.target-chip{
  display:inline-flex;
  align-items:center;
  border:1px solid #bfdbfe;
  background:#eef6ff;
  color:#1d4ed8;
  border-radius:999px;
  padding:4px 8px;
  font-size:11px;
  font-weight:900;
  white-space:nowrap;
}
.target-done-wrap{
  margin:3px;
}
.done-cell{
  min-width:190px;
}
.history-line.created strong,
.history-line.created span{
  color:#0f766e;
}
.target-check-grid{
  display:grid;
  grid-template-columns:repeat(5, minmax(130px, 1fr));
  gap:8px;
}
.target-option{
  display:flex;
  align-items:center;
  gap:8px;
  border:1px solid var(--line2);
  border-radius:13px;
  background:#fbfdff;
  padding:10px 12px;
  font-weight:900;
  color:#334155;
  cursor:pointer;
}
.target-option input{
  width:16px;
  height:16px;
  accent-color:var(--blue);
}
#checklistTargetError.show{
  display:block;
}
@media(max-width:760px){
  .target-check-grid{grid-template-columns:1fr 1fr}
}


/* 구분 드롭다운 고정 목록 / 질의차수 송부완료 잠금 */
.group-band-inner{display:flex;align-items:center;justify-content:space-between;gap:12px}
.group-band-inner em{margin-left:8px;font-style:normal;color:#64748b;font-size:12px;font-weight:900}
.group-band-inner b{display:inline-flex;margin-left:8px;padding:3px 8px;border-radius:999px;background:#fee2e2;color:#dc2626;font-size:11px;font-weight:900}
.group-band-actions{display:flex;align-items:center;justify-content:flex-end;gap:6px;flex-wrap:wrap}
.group-mini-btn{padding:6px 9px;border-radius:10px;font-size:11px}
.next-round-guide{color:#0f766e;font-size:11px;font-weight:900;white-space:nowrap}
.group-separator-row.group-locked td{background:#fff7ed !important}
.locked-row td{background:#f8fafc;color:#64748b}
.locked-row .cell,.locked-row .target-chip-list,.locked-row .history-cell{opacity:.78}
.row-actions .btn:disabled,.group-mini-btn:disabled,.done-check-wrap input:disabled,.excel-grid input:disabled{cursor:not-allowed;opacity:.55}

/* QC 승인 단계 제거 후 리스트 세로 확장 */
.qc-approval-card,
.qc-approval-stage,
.qc-stage-panel{
  display:none !important;
}

.qc-review-card .card-body.table-wrap,
.qc-review-table-wrap,
#qcReviewTableWrap{
  max-height:calc(100vh - 280px);
  overflow:auto;
}

.work-qc-table-wrap{
  max-height:calc(100vh - 280px);
  overflow:auto;
}

#qcReviewBody,
#reviewBody{
  min-height:520px;
}


#qc .table-wrap,
#qcApproval .table-wrap,
#workQcPanel .table-wrap,
#workQcApproval .table-wrap{
  max-height:calc(100vh - 260px);
  overflow:auto;
}

/* QC 검토/승인 상단 중복 안내 카드 제거 */
.qc-intro,
.qc-summary-card,
.qc-approval-intro,
.qc-review-intro{
  display:none !important;
}

/* 체크리스트 작성자/확인자/이의제기/첨부 반영 */
.attach-upload-btn{
  position:relative;
  overflow:hidden;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  margin-bottom:6px;
  padding:7px 10px;
  font-size:12px;
}

.attach-upload-btn input{
  position:absolute;
  inset:0;
  opacity:0;
  cursor:pointer;
}

.attach-thumb-list{
  display:flex;
  flex-wrap:wrap;
  gap:5px;
  margin-top:4px;
}

.attach-thumb{
  width:38px;
  height:38px;
  padding:0;
  border:1px solid var(--line2);
  border-radius:9px;
  overflow:hidden;
  background:#fff;
  cursor:pointer;
}

.attach-thumb img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

.btn-objection{
  margin-top:6px;
  border:1px solid #fdba74;
  background:#fff7ed;
  color:#c2410c;
  border-radius:10px;
  padding:6px 9px;
  font-size:12px;
  font-weight:900;
  cursor:pointer;
}

.btn-mini{
  margin-top:6px;
  padding:6px 9px;
  font-size:12px;
}

.objection-area{
  margin-top:6px;
}

.objection-detail-box{
  margin-top:8px;
  padding:10px;
  border:1px solid #fed7aa;
  border-radius:12px;
  background:#fff7ed;
  color:#7c2d12;
  text-align:left;
  text-decoration:none !important;
}

.objection-detail-box p{
  margin:6px 0;
  line-height:1.55;
  text-decoration:none !important;
}

.attachment-preview-list{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(120px,1fr));
  gap:10px;
  margin-top:10px;
}

.attach-preview{
  border:1px solid var(--line2);
  border-radius:14px;
  background:#fff;
  padding:8px;
}

.attach-preview img{
  width:100%;
  height:90px;
  object-fit:cover;
  border-radius:10px;
  display:block;
}

.attach-preview span{
  display:block;
  margin-top:6px;
  font-size:12px;
  color:var(--muted);
  word-break:break-all;
}

.eliminated-row td{
  background:#f3f4f6 !important;
  color:#94a3b8 !important;
  text-decoration:line-through;
}

.eliminated-row .objection-detail-box,
.eliminated-row .objection-detail-box *,
.eliminated-row .row-actions,
.eliminated-row .row-actions *,
.eliminated-row .attachment-cell,
.eliminated-row .attachment-cell *{
  text-decoration:none !important;
}

.eliminated-row::after{
  content:"소거";
}

/* 체크리스트 테이블 폭 조정 */
.comment-col{
  min-width:260px;
  width:22%;
}

.history-col{
  width:170px;
}

.manage-col{
  width:110px;
}

table th:nth-child(7),
table td:nth-child(7){
  width:140px;
  max-width:140px;
}

table th:last-child,
table td:last-child{
  width:90px;
}

table td:nth-child(8){
  min-width:260px;
  width:22%;
}

table td:nth-child(9){
  width:180px;
}

table td:nth-child(10){
  width:90px;
}

.cell[contenteditable="true"]{
  min-height:48px;
}

.attachment-preview-list{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(120px,1fr));
  gap:10px;
  margin-top:10px;
}

.attach-preview{
  border:1px solid var(--line2);
  border-radius:14px;
  background:#fff;
  padding:8px;
}

.attach-preview img{
  width:100%;
  height:90px;
  object-fit:cover;
  border-radius:10px;
}

.attach-preview span{
  display:block;
  margin-top:6px;
  font-size:12px;
  color:var(--muted);
  word-break:break-all;
}

/* 첨부자료 칸 복구 및 모달 업로드/제거 */
.excel-grid .comment-col,
.excel-grid td:nth-child(8){
  min-width:300px;
  width:24%;
}

.excel-grid .attach-col,
.excel-grid td:nth-child(9){
  min-width:110px;
  width:110px;
  text-align:center;
}

.excel-grid .history-col,
.excel-grid td:nth-child(10){
  width:170px;
  min-width:150px;
}

.excel-grid .manage-col,
.excel-grid td:nth-child(11){
  width:90px;
  min-width:80px;
}

.readonly-attachment-cell{
  display:grid;
  gap:5px;
  justify-items:center;
}

.attach-count{
  font-size:12px;
  font-weight:900;
  color:#334155;
}

.empty-attach-box{
  border:1px dashed var(--line2);
  border-radius:14px;
  padding:16px;
  color:var(--muted);
  font-weight:800;
  background:#fbfdff;
}

.attach-preview{
  position:relative;
}

.attach-preview img{
  cursor:pointer;
}

.attach-remove-btn{
  width:100%;
  margin-top:7px;
  border:0;
  border-radius:10px;
  padding:7px 8px;
  background:#fee2e2;
  color:#dc2626;
  font-weight:900;
  cursor:pointer;
}

.field-help{
  margin-top:6px;
  color:var(--muted);
  font-size:12px;
  font-weight:700;
}


/* === QC 체크리스트 테이블 깨짐 복구 최종 패치 ===
   기존 nth-child 강제 폭 지정 때문에 공종/일련번호가 세로로 찢어지는 문제를 방지합니다. */
.excel-grid{
  table-layout:fixed !important;
  width:100% !important;
  min-width:1540px !important;
  border-collapse:collapse;
}

/* colgroup 기준 폭 */
.excel-grid col.qc-col-select{width:44px;}
.excel-grid col.qc-col-trade{width:78px;}
.excel-grid col.qc-col-no{width:74px;}
.excel-grid col.qc-col-item{width:260px;}
.excel-grid col.qc-col-method{width:320px;}
.excel-grid col.qc-col-target{width:96px;}
.excel-grid col.qc-col-check{width:160px;}
.excel-grid col.qc-col-comment{width:230px;}
.excel-grid col.qc-col-attach{width:100px;}
.excel-grid col.qc-col-history{width:155px;}
.excel-grid col.qc-col-manage{width:90px;}

/* 기존 전역 nth-child 폭 강제값 무력화 후 재정렬 */
.excel-grid th,
.excel-grid td{
  box-sizing:border-box;
  vertical-align:middle !important;
  white-space:normal !important;
  word-break:keep-all !important;
  overflow:visible !important;
  text-align:left;
}

.excel-grid th:nth-child(1),
.excel-grid td:nth-child(1){
  text-align:center !important;
  padding:8px 6px !important;
}

.excel-grid th:nth-child(2),
.excel-grid td:nth-child(2),
.excel-grid th:nth-child(3),
.excel-grid td:nth-child(3){
  text-align:center !important;
  white-space:nowrap !important;
  word-break:keep-all !important;
  overflow:hidden !important;
  text-overflow:clip !important;
  padding:10px 8px !important;
}

.excel-grid th:nth-child(4),
.excel-grid td:nth-child(4),
.excel-grid th:nth-child(5),
.excel-grid td:nth-child(5){
  white-space:normal !important;
  word-break:keep-all !important;
  line-height:1.55 !important;
}

.excel-grid th:nth-child(6),
.excel-grid td:nth-child(6),
.excel-grid th:nth-child(9),
.excel-grid td:nth-child(9),
.excel-grid th:nth-child(10),
.excel-grid td:nth-child(10),
.excel-grid th:nth-child(11),
.excel-grid td:nth-child(11){
  text-align:center !important;
}

/* 체크 여부 칸: 한 줄 유지 */
.excel-grid td:nth-child(7){
  text-align:center !important;
  padding:8px 6px !important;
}

.excel-grid td:nth-child(7) .done-check-wrap,
.excel-grid td:nth-child(7) .target-done-wrap{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  gap:5px !important;
  max-width:148px !important;
  width:auto !important;
  padding:7px 10px !important;
  margin:0 auto !important;
  white-space:nowrap !important;
  word-break:keep-all !important;
  line-height:1 !important;
}

.excel-grid td:nth-child(7) .done-check-wrap span,
.excel-grid td:nth-child(7) .target-done-wrap span{
  display:inline-block !important;
  max-width:112px !important;
  white-space:nowrap !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  word-break:keep-all !important;
}

.excel-grid td:nth-child(7) input[type="checkbox"]{
  width:14px !important;
  height:14px !important;
  flex:0 0 14px !important;
  margin:0 !important;
}

.excel-grid td:nth-child(7) .objection-area{
  display:flex !important;
  flex-direction:column !important;
  align-items:center !important;
  gap:5px !important;
  margin-top:8px !important;
}

.excel-grid td:nth-child(7) .btn-objection{
  white-space:nowrap !important;
  padding:5px 8px !important;
  font-size:12px !important;
}

/* 관리 칸 compact */
.excel-grid td:nth-child(11) .row-actions,
.excel-grid td:nth-child(11) .actions{
  display:flex !important;
  flex-direction:column !important;
  gap:5px !important;
  align-items:center !important;
}

.excel-grid td:nth-child(11) button,
.excel-grid td:nth-child(11) .btn{
  padding:6px 8px !important;
  font-size:12px !important;
  min-width:44px !important;
}

/* 기존에 마지막 줄에서 넣은 전역 max-width 해제 */
table th:nth-child(7),
table td:nth-child(7),
table th:last-child,
table td:last-child{
  max-width:none !important;
}

/* 그룹행은 전체 폭 사용 */
.excel-grid .group-row td{
  text-align:left !important;
  white-space:nowrap !important;
}


/* 처리이력 형식 수정 */
.history-row{
  display:flex !important;
  flex-direction:column !important;
  justify-content:center !important;
  align-items:center !important;
  text-align:center !important;
  line-height:1.35 !important;
  gap:2px !important;
}

.history-row strong{
  display:block !important;
  font-size:13px !important;
  font-weight:900 !important;
  color:#0f766e !important;
  white-space:nowrap !important;
}

.history-row span{
  display:block !important;
  font-size:12px !important;
  color:#0f766e !important;
  font-weight:800 !important;
  white-space:nowrap !important;
}


/* === QC 체크리스트 한 화면 표시 최종 리사이징 ===
   목적: 우측 가로 스크롤 없이 '관리' 칸까지 한 화면에 보이도록 조정 */
.work-qc-table-wrap,
.qc-review-table-wrap,
#qcReviewTableWrap,
#workQcPanel .table-wrap,
#workQcApproval .table-wrap{
  overflow-x:hidden !important;
  overflow-y:auto !important;
  max-width:100% !important;
}

/* 기존 min-width 누적값 제거 */
.excel-grid{
  width:100% !important;
  min-width:0 !important;
  max-width:100% !important;
  table-layout:fixed !important;
  border-collapse:collapse !important;
}

/* colgroup 기준: 전체 합계 100% */
.excel-grid col.qc-col-select{width:3% !important;}
.excel-grid col.qc-col-trade{width:5% !important;}
.excel-grid col.qc-col-no{width:5% !important;}
.excel-grid col.qc-col-item{width:17% !important;}
.excel-grid col.qc-col-method{width:21% !important;}
.excel-grid col.qc-col-target{width:6% !important;}
.excel-grid col.qc-col-check{width:10% !important;}
.excel-grid col.qc-col-comment{width:15% !important;}
.excel-grid col.qc-col-attach{width:6% !important;}
.excel-grid col.qc-col-history{width:8% !important;}
.excel-grid col.qc-col-manage{width:4% !important;}

/* 모든 셀 폭 강제값 초기화 */
.excel-grid th,
.excel-grid td{
  min-width:0 !important;
  max-width:none !important;
  box-sizing:border-box !important;
  padding:10px 8px !important;
  vertical-align:middle !important;
  word-break:keep-all !important;
  overflow-wrap:anywhere !important;
  white-space:normal !important;
  line-height:1.45 !important;
}

/* 선택 / 공종 / 일련번호 */
.excel-grid th:nth-child(1),
.excel-grid td:nth-child(1){
  text-align:center !important;
  padding-left:4px !important;
  padding-right:4px !important;
}

.excel-grid th:nth-child(2),
.excel-grid td:nth-child(2),
.excel-grid th:nth-child(3),
.excel-grid td:nth-child(3){
  text-align:center !important;
  white-space:normal !important;
  word-break:keep-all !important;
  overflow-wrap:break-word !important;
  padding-left:4px !important;
  padding-right:4px !important;
}

/* 검토항목 / 검토방법 넓게 */
.excel-grid th:nth-child(4),
.excel-grid td:nth-child(4),
.excel-grid th:nth-child(5),
.excel-grid td:nth-child(5){
  text-align:left !important;
  white-space:normal !important;
  word-break:keep-all !important;
}

/* 요청 대상 */
.excel-grid th:nth-child(6),
.excel-grid td:nth-child(6){
  text-align:center !important;
  padding-left:4px !important;
  padding-right:4px !important;
}

.excel-grid td:nth-child(6) .badge{
  max-width:100% !important;
  padding:5px 7px !important;
  font-size:11px !important;
}

/* 체크 여부: 컴팩트하되 줄 넘어가지 않게 */
.excel-grid th:nth-child(7),
.excel-grid td:nth-child(7){
  text-align:center !important;
  padding-left:4px !important;
  padding-right:4px !important;
  overflow:visible !important;
}

.excel-grid td:nth-child(7) .done-check-wrap,
.excel-grid td:nth-child(7) .target-done-wrap{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  gap:4px !important;
  width:100% !important;
  max-width:100% !important;
  min-width:0 !important;
  padding:6px 6px !important;
  margin:0 auto !important;
  white-space:nowrap !important;
  line-height:1 !important;
  font-size:11px !important;
  overflow:hidden !important;
}

.excel-grid td:nth-child(7) .done-check-wrap input,
.excel-grid td:nth-child(7) .target-done-wrap input{
  width:13px !important;
  height:13px !important;
  flex:0 0 13px !important;
  margin:0 !important;
}

.excel-grid td:nth-child(7) .done-check-wrap span,
.excel-grid td:nth-child(7) .target-done-wrap span{
  display:inline-block !important;
  min-width:0 !important;
  max-width:calc(100% - 18px) !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
  word-break:keep-all !important;
}

.excel-grid td:nth-child(7) .objection-area{
  display:flex !important;
  flex-direction:column !important;
  align-items:center !important;
  gap:4px !important;
  margin-top:6px !important;
}

.excel-grid td:nth-child(7) .btn-objection,
.excel-grid td:nth-child(7) .btn-mini{
  max-width:100% !important;
  min-width:0 !important;
  padding:5px 6px !important;
  font-size:11px !important;
  white-space:nowrap !important;
}

/* 코멘트 */
.excel-grid th:nth-child(8),
.excel-grid td:nth-child(8){
  text-align:left !important;
}

/* 첨부 */
.excel-grid th:nth-child(9),
.excel-grid td:nth-child(9){
  text-align:center !important;
  padding-left:4px !important;
  padding-right:4px !important;
}

.excel-grid td:nth-child(9) .attach-count{
  font-size:11px !important;
}

.excel-grid td:nth-child(9) .attach-thumb{
  width:26px !important;
  height:26px !important;
}

/* 처리 이력 */
.excel-grid th:nth-child(10),
.excel-grid td:nth-child(10){
  text-align:center !important;
  padding-left:4px !important;
  padding-right:4px !important;
}

.history-cell .history-row,
.history-row{
  display:flex !important;
  flex-direction:column !important;
  align-items:center !important;
  justify-content:center !important;
  gap:2px !important;
  text-align:center !important;
  line-height:1.3 !important;
}

.history-cell .history-row strong,
.history-row strong{
  display:block !important;
  white-space:nowrap !important;
  font-size:12px !important;
  font-weight:900 !important;
  color:#0f766e !important;
}

.history-cell .history-row span,
.history-row span{
  display:block !important;
  white-space:nowrap !important;
  font-size:11px !important;
  font-weight:800 !important;
  color:#0f766e !important;
}

/* 관리: 한 화면에 보이도록 가장 컴팩트 */
.excel-grid th:nth-child(11),
.excel-grid td:nth-child(11){
  text-align:center !important;
  padding-left:3px !important;
  padding-right:3px !important;
}

.excel-grid td:nth-child(11) .row-actions,
.excel-grid td:nth-child(11) .actions{
  display:flex !important;
  flex-direction:column !important;
  gap:4px !important;
  align-items:center !important;
  justify-content:center !important;
}

.excel-grid td:nth-child(11) button,
.excel-grid td:nth-child(11) .btn{
  min-width:0 !important;
  width:42px !important;
  padding:5px 4px !important;
  font-size:11px !important;
  line-height:1.1 !important;
  border-radius:9px !important;
}

/* 그룹행은 전체 폭 유지 */
.excel-grid .group-row td{
  white-space:nowrap !important;
  text-align:left !important;
  padding:10px 8px !important;
}

/* 이전 전역 nth-child 설정 최종 무효화 */
table th:nth-child(7),
table td:nth-child(7),
table th:last-child,
table td:last-child{
  width:auto !important;
  min-width:0 !important;
  max-width:none !important;
}


/* === QC 체크리스트 중앙정렬 보정 ===
   요청 대상 / 체크 여부 / 코멘트 / 첨부 / 처리 이력 / 관리 칼럼의 시각적 중앙 정렬 */
.excel-grid th:nth-child(6),
.excel-grid td:nth-child(6),
.excel-grid th:nth-child(7),
.excel-grid td:nth-child(7),
.excel-grid th:nth-child(8),
.excel-grid td:nth-child(8),
.excel-grid th:nth-child(9),
.excel-grid td:nth-child(9),
.excel-grid th:nth-child(10),
.excel-grid td:nth-child(10),
.excel-grid th:nth-child(11),
.excel-grid td:nth-child(11){
  text-align:center !important;
  vertical-align:middle !important;
}

/* 요청 대상 배지 중앙 */
.excel-grid td:nth-child(6) .badge{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  margin:0 auto !important;
  text-align:center !important;
}

/* 체크 여부 칸 내부 중앙 */
.excel-grid td:nth-child(7) .done-check-wrap,
.excel-grid td:nth-child(7) .target-done-wrap{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  margin:0 auto !important;
  text-align:center !important;
}

.excel-grid td:nth-child(7) .objection-area{
  align-items:center !important;
  justify-content:center !important;
  text-align:center !important;
}

/* 코멘트 칼럼 헤더는 중앙, 본문은 입력/메모 가독성을 위해 좌측 정렬 */
.excel-grid th:nth-child(8){
  text-align:center !important;
}

.excel-grid td:nth-child(8){
  text-align:left !important;
  vertical-align:middle !important;
}

/* 첨부 칸 중앙 */
.excel-grid td:nth-child(9) .attachment-cell,
.excel-grid td:nth-child(9) .readonly-attachment-cell{
  display:flex !important;
  flex-direction:column !important;
  align-items:center !important;
  justify-content:center !important;
  text-align:center !important;
  margin:0 auto !important;
}

.excel-grid td:nth-child(9) .attach-thumb-list{
  display:flex !important;
  flex-direction:row !important;
  flex-wrap:wrap !important;
  align-items:center !important;
  justify-content:center !important;
  margin:0 auto !important;
}

/* 처리 이력 중앙 */
.excel-grid td:nth-child(10) .history-cell,
.excel-grid td:nth-child(10) .history-row{
  display:flex !important;
  flex-direction:column !important;
  align-items:center !important;
  justify-content:center !important;
  text-align:center !important;
  margin:0 auto !important;
}

.excel-grid td:nth-child(10) .history-row strong,
.excel-grid td:nth-child(10) .history-row span{
  text-align:center !important;
  white-space:nowrap !important;
}

/* 관리 버튼 중앙 */
.excel-grid td:nth-child(11) .row-actions,
.excel-grid td:nth-child(11) .actions{
  display:flex !important;
  flex-direction:column !important;
  align-items:center !important;
  justify-content:center !important;
  gap:5px !important;
  margin:0 auto !important;
  text-align:center !important;
}

.excel-grid td:nth-child(11) button,
.excel-grid td:nth-child(11) .btn{
  margin:0 auto !important;
}

/* 행 높이 안에서 세로 중앙이 어긋나지 않도록 보정 */
.excel-grid tr:not(.group-row) td{
  vertical-align:middle !important;
}


/* === 요청 대상 칼럼 중앙정렬 최종 보정 ===
   요청 대상 셀 안의 산출 담당자 배지가 칼럼 중앙에 오도록 강제 */
.excel-grid th:nth-child(6),
.excel-grid td:nth-child(6){
  text-align:center !important;
  vertical-align:middle !important;
  padding-left:4px !important;
  padding-right:4px !important;
}

/* 요청 대상 셀의 내부 요소를 중앙에 고정 */
.excel-grid td:nth-child(6){
  position:relative !important;
}

.excel-grid td:nth-child(6) > *{
  margin-left:auto !important;
  margin-right:auto !important;
}

/* badge / span / button 형태 모두 대응 */
.excel-grid td:nth-child(6) .badge,
.excel-grid td:nth-child(6) span,
.excel-grid td:nth-child(6) button,
.excel-grid td:nth-child(6) .target-badge,
.excel-grid td:nth-child(6) .request-target,
.excel-grid td:nth-child(6) .owner-chip{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  text-align:center !important;
  margin-left:auto !important;
  margin-right:auto !important;
  float:none !important;
}

/* 셀 안에 div wrapper가 있을 경우도 중앙 정렬 */
.excel-grid td:nth-child(6) div{
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  text-align:center !important;
  width:100% !important;
}

/* 요청 대상 배지 자체 폭은 내용 기준, 위치만 중앙 */
.excel-grid td:nth-child(6) .badge{
  width:auto !important;
  max-width:100% !important;
  white-space:nowrap !important;
}

/* 체크 여부와 관리도 같은 기준으로 중앙 유지 */
.excel-grid th:nth-child(7),
.excel-grid td:nth-child(7),
.excel-grid th:nth-child(11),
.excel-grid td:nth-child(11){
  text-align:center !important;
  vertical-align:middle !important;
}

/* 체크 여부 셀 내부 중앙 고정 */
.excel-grid td:nth-child(7){
  padding-left:4px !important;
  padding-right:4px !important;
}

.excel-grid td:nth-child(7) .done-check-wrap,
.excel-grid td:nth-child(7) .target-done-wrap{
  margin-left:auto !important;
  margin-right:auto !important;
}

/* 코멘트 헤더 중앙, 본문은 좌측 유지 */
.excel-grid th:nth-child(8){
  text-align:center !important;
}

.excel-grid td:nth-child(8){
  text-align:left !important;
}


/* === 검토항목 + 검토방법 중앙정렬 === */
.excel-grid th:nth-child(4),
.excel-grid td:nth-child(4),
.excel-grid th:nth-child(5),
.excel-grid td:nth-child(5){
  text-align:center !important;
  vertical-align:middle !important;
}

/* 셀 내부 텍스트 블럭 중앙 정렬 */
.excel-grid td:nth-child(4),
.excel-grid td:nth-child(5){
  padding-left:12px !important;
  padding-right:12px !important;
}

.excel-grid td:nth-child(4) > *,
.excel-grid td:nth-child(5) > *{
  margin-left:auto !important;
  margin-right:auto !important;
  text-align:center !important;
}

/* 줄바꿈이 있는 텍스트도 가운데 */
.excel-grid td:nth-child(4) div,
.excel-grid td:nth-child(5) div,
.excel-grid td:nth-child(4) span,
.excel-grid td:nth-child(5) span,
.excel-grid td:nth-child(4) p,
.excel-grid td:nth-child(5) p{
  display:block !important;
  text-align:center !important;
}


/* === 업무관리 상단 헤더 축소 및 불필요 버튼 제거 후 여백 보정 === */
#workModule .page-head,
.module-view#workModule .page-head,
.work-page-head{
  padding:18px 0 14px !important;
  margin-bottom:12px !important;
  align-items:center !important;
}

#workModule .page-head h1,
.module-view#workModule .page-head h1,
.work-page-head h1{
  font-size:28px !important;
  line-height:1.18 !important;
  margin-bottom:6px !important;
}

#workModule .page-head p,
.module-view#workModule .page-head p,
.work-page-head p{
  line-height:1.35 !important;
  margin:0 !important;
}

#workModule .page-head .breadcrumb,
.module-view#workModule .page-head .breadcrumb,
.work-page-head .breadcrumb{
  margin-bottom:6px !important;
}

/* 혹시 상단 QC 버튼 영역이 남아 있으면 화면에서 숨김 */
#workModule .page-head > .actions,
.module-view#workModule .page-head > .actions,
.work-page-head > .actions{
  display:none !important;
}

/* 전체 page-head도 과도한 세로 여백 방지 */
.page-head{
  padding-top:14px;
  padding-bottom:12px;
}


/* === QC 체크리스트 내부 스크롤 제거 ===
   내부 테이블/카드 스크롤을 없애고 페이지 전체 스크롤로만 하단 내용을 확인하도록 변경 */
#workModule,
#workModule .main-area,
#workModule .panel,
#workModule .card,
#workModule .card-body,
#workModule .table-wrap,
#workModule .work-qc-table-wrap,
#workModule .qc-review-table-wrap,
#workModule #qcReviewTableWrap,
#workModule #workQcPanel .table-wrap,
#workModule #workQcApproval .table-wrap,
#workModule .excel-grid-wrap,
#workModule .checklist-grid-wrap,
#workModule .grid-scroll,
#workModule .table-scroll,
.work-qc-table-wrap,
.qc-review-table-wrap,
#qcReviewTableWrap,
#workQcPanel .table-wrap,
#workQcApproval .table-wrap,
.excel-grid-wrap,
.checklist-grid-wrap,
.grid-scroll,
.table-scroll{
  max-height:none !important;
  height:auto !important;
  overflow-y:visible !important;
}

/* 세로 스크롤바가 카드 내부에 생기지 않도록 강제 */
#workModule .card,
#workModule .card-body,
#workModule .table-wrap,
#workModule .work-qc-table-wrap,
#workModule .qc-review-table-wrap,
#workModule #qcReviewTableWrap,
.work-qc-table-wrap,
.qc-review-table-wrap,
#qcReviewTableWrap{
  overflow-x:hidden !important;
  overflow-y:visible !important;
}

/* 테이블은 한 화면 폭 안에서 유지하고, 행은 전체 페이지 길이만큼 자연스럽게 확장 */
#workModule .excel-grid,
.excel-grid{
  width:100% !important;
  max-width:100% !important;
  min-width:0 !important;
  table-layout:fixed !important;
}

/* 혹시 tbody 또는 별도 리스트에 높이 제한이 걸린 경우 해제 */
#workModule tbody,
#workModule .excel-grid tbody,
#workModule #checklistBody,
#workModule #qcChecklistBody,
#workModule #reviewBody,
#workModule .checklist-body,
#workModule .grid-body{
  max-height:none !important;
  height:auto !important;
  overflow:visible !important;
}

/* 브라우저 큰 스크롤 사용을 명확히 유지 */
html,
body{
  overflow-y:auto !important;
}

body{
  min-height:100vh;
}

/* 내부 스크롤 제거 후 카드 하단 여백 보정 */
#workModule .card{
  margin-bottom:28px !important;
}

#workModule .card-body{
  padding-bottom:22px !important;
}

/* 테이블 하단이 잘리지 않도록 */
#workModule .excel-grid tr:last-child td{
  border-bottom:1px solid #dbe3ef !important;
}
