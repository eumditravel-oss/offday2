const gradeOrder = {
  "ëí": 1,
  "ë¶ì¬ì¥": 2,
  "ìë¬´": 3,
  "ì¼í°ì¥": 4,
  "ë³¸ë¶ì¥": 5,
  "ì¤ì¥": 6,
  "íì¥": 3,
  "ìì": 8,
  "ë§¤ëì ": 9,
  "ì¬ì": 10,
  "ìì¬ìì ": 99
};

const pageMeta = {
  ledger: ["ì¡°ì§ê´ë¦¬ Â· ì¬ìëì¥", "ì¡°ì§ê´ë¦¬ ë´ ì¬ìëì¥ íë©´ìëë¤. ì§ì ëª©ë¡, íì¬, ë¶ì, ì¬ì§ìí, ì§ê¸ì ì ë ¬ì ê´ë¦¬í©ëë¤."],
  card: ["ì¡°ì§ê´ë¦¬ Â· ì¸ì¬ì¹´ë", "ê²½ìì§ììì ì§ì ìì¸ ì¸ì¬ì ë³´, ì¸ì¬ë³ë, ë°ë³µì ë³´, ìì°, ì¦ëªìë¥¼ ê´ë¦¬í©ëë¤."],
  analysis: ["ì¡°ì§ê´ë¦¬ Â· ì§ìì¦ê°ë¶ì", "ìì¬, í´ì¬, ê³ì½ë§ë£, ê·¼ìì°ì, ì´ ê²½ë ¥ì ë¶ìí©ëë¤."],
  approval: ["ì¡°ì§ê´ë¦¬ Â· ì¹ì¸ê´ë¦¬", "ì¦ëªì, ì²¨ë¶íì¼, ì¸ì¬ì ë³´ ë³ê²½ ì¹ì¸ ìì²­ì ê´ë¦¬í©ëë¤."],
  orgEdit: ["ì¡°ì§ê´ë¦¬ Â· ì¡°ì§ëê´ë¦¬", "CON-COSTì Viet QS ì¡°ì§ë, ì§ì ì°ê²°, íììì, ìì/íì ì¡°ì§ì ê´ë¦¬í©ëë¤."],
  cost: ["ë¹ì©ë³´ê³ ", "ë¹ì©ë³´ê³  ëë¶ë¥ íë©´ìëë¤. íì¬ë ë©ë´ êµ¬ì¡° ì°ì  êµ¬ì± ìíìëë¤."],
  asset: ["ìì°ëì¥", "ìì°ëì¥ ëë¶ë¥ íë©´ìëë¤. ìì° ë±ë¡, ë°°ì , ë°ë© ìíë¥¼ ê´ë¦¬í©ëë¤."],
  admin: ["ê´ë¦¬ì ì¤ì ", "ê¶í, ì ì±, íì ìì, ìºë¦°ë ì°ë ê¸°ì¤ì ê´ë¦¬í©ëë¤."],
  code: ["ê´ë¦¬ì ì¤ì  Â· ì½ëê´ë¦¬", "ê´ë¦¬ì ì¤ì  íì ë©ë´ë¡ ì½ëê°ê³¼ íì ììë¥¼ ê´ë¦¬í©ëë¤."]
};

const employees = [
  {
    empNo: "EMP-2018-001",
    name: "ë°ì©ì§",
    localName: "",
    koreanName: "",
    id: "yjpark",
    company: "CON-COST",
    dept: "BIMíí¸",
    grade: "ìì",
    position: "íí¸ ë´ë¹",
    status: "ì¬ì§",
    join: "2018-04-01",
    endDate: "",
    eval: "A",
    project: 8,
    email: "yjpark@con-cost.com",
    phoneCountry: "KR",
    phone: "010-7700-7859",
    idCountry: "KR",
    nationalId: "990301-1111111",
    birthday: "1992-02-23",
    wedding: "",
    nationality: "ëíë¯¼êµ­",
    workplace: "ìì¸ ë³¸ì¬",
    address: "ìì¸í¹ë³ì ê°ë¶êµ¬",
    emergency: "010-0000-0000",
    externalCareerMonths: 24,
    usedLeave: "7ì¼",
    otTotal: "18ìê°",
    mainOtProject: "A-101 BIM ê²í ",
    orgPath: "ê²½ìì§ì > BIMíí¸",
    reportLine: "PM â GM â ë³¸ë¶ì¥",
    pmRole: "ì¬ì©",
    multiDept: "ê°ë°ì§ì TF",
    audit: {
      basic: "ë±ë¡ì: ê²½ìì§ì / ìµì¢ìì ì: ë°ì©ì§ / ìµì¢ìì ì¼: 2026-04-28 / ìì í­ëª©: í´ëí°",
      detail: "ë±ë¡ì: ê²½ìì§ì / ìµì¢ìì ì: ê²½ìì§ì / ìµì¢ìì ì¼: 2026-04-20 / ìì í­ëª©: ì ë¶ì¦ë²í¸"
    },
    histories: {
      join: [{ type: "ìì¬", before: "-", after: "ì¬ì§", date: "2018-04-01", reason: "ì ê· ìì¬", manager: "ê²½ìì§ì" }],
      org: [
        { type: "ë¶ì", before: "êµ¬ì¡°í", after: "BIMíí¸", date: "2026-04-01", reason: "ì¡°ì§ê°í¸", manager: "ê²½ìì§ì" },
        { type: "ì§ê¸", before: "ì ì", after: "ìì", date: "2025-01-01", reason: "ì ê¸°ì¹ê¸", manager: "ê²½ìì§ì" }
      ],
      leave: [{ type: "ë³ê°", before: "ì ìê·¼ë¬´", after: "ë³ê° 3ì¼", date: "2024-06-10", reason: "ì§ë¨ì ì ì¶", manager: "ê²½ìì§ì" }]
    },
    repeat: [
      { type: "íë ¥", content: "ëíêµ / ì ê³µëª", start: "2011-03-01", end: "2015-02-28", period: "4ë", file: "ì¡¸ìì¦ëªì.pdf", note: "ì¡¸ì" },
      { type: "ê²½ë ¥", content: "ì´ì  íì¬ êµ¬ì¡°í", start: "2015-03-01", end: "2017-02-28", period: "2ë", file: "-", note: "ì¸ë¶ê²½ë ¥" }
    ],
    worklogs: [
      { date: "2026-04-10", type: "ì¼ê·¼", project: "A-101 BIM ê²í ", time: "3ìê°", reason: "ë©í ì  QC", approver: "PM" }
    ],
    files: [
      { type: "ê·¼ë¡ê³ì½ì", name: "contract_park.pdf", date: "2026-01-01", status: "ì¹ì¸ìë£" }
    ]
  }
];


function createOrgEmployee(empNo, name, company, dept, grade, position, koreanName = "", localName = "") {
  return {
    empNo, name, localName, koreanName,
    id: empNo.toLowerCase().replaceAll("-", "_"),
    company, dept, grade, position: position || grade,
    status: "ì¬ì§", join: "2026-04-01", endDate: "", eval: "-", project: 0,
    email: `${empNo.toLowerCase().replaceAll("-", "_")}@${company === "Viet QS" ? "vietqs.local" : "con-cost.local"}`,
    phoneCountry: company === "Viet QS" ? "VN" : "KR",
    phone: company === "Viet QS" ? "0900-000-000" : "010-0000-0000",
    idCountry: company === "Viet QS" ? "VN" : "KR",
    nationalId: "", birthday: "", wedding: "",
    nationality: company === "Viet QS" ? "ë² í¸ë¨" : "ëíë¯¼êµ­",
    workplace: company === "Viet QS" ? "ë² í¸ë¨ ì§ì¬" : "ìì¸ ë³¸ì¬",
    address: "", emergency: "", externalCareerMonths: 0, usedLeave: "-", otTotal: "-", mainOtProject: "-",
    orgPath: `${company} > ${dept}`, reportLine: "ì¡°ì§ë ê¸°ì¤", pmRole: "ë¯¸ì¬ì©", multiDept: "-",
    audit: { basic: "ëë¯¸ ì¸ì¬ì¹´ë / ì¡°ì§ë ì´ê¸° ì¸í", detail: "ëë¯¸ ì¸ì¬ì¹´ë / ìì¸ì ë³´ ë¯¸ìë ¥" },
    histories: { join: [{ type: "ì´ê¸°ë±ë¡", before: "-", after: "ì¬ì§", date: "2026-04-28", reason: "ì¡°ì§ë ì¼ê´ ë°ì", manager: "ê²½ìì§ì" }], org: [], leave: [] },
    repeat: [], worklogs: [], files: []
  };
}

const orgEmployeeSeed = [["CC-001", "ì´ìì§", "CON-COST", "ê²½ìì§ìë³¸ë¶", "ìë¬´", "ìë¬´", "", ""], ["CC-002", "ê°ëê· ", "CON-COST", "ê²½ìì§ìë³¸ë¶", "ì¤ì¥", "ì¤ì¥", "", ""], ["CC-003", "ê¹ìì", "CON-COST", "ê²½ìì§ìë³¸ë¶", "ì±ì", "ì±ì", "", ""], ["CC-004", "ê¹íì", "CON-COST", "ê²½ìì§ìë³¸ë¶", "ì ì", "ì ì", "", ""], ["CC-005", "íìì", "CON-COST", "ê²½ìì§ìë³¸ë¶", "ì ì", "ì ì", "", ""], ["CC-008", "ì¥ë²ì ", "CON-COST", "QC", "ì¤ì¥", "ì¤ì¥", "", ""], ["CC-009", "ì¡°íë¹", "CON-COST", "QC", "ì¤ì¥", "ì¤ì¥", "", ""], ["CC-010", "ìµìë°°", "CON-COST", "ê¸°ì ë³¸ë¶", "ë³¸ë¶ì¥", "ë³¸ë¶ì¥", "", ""], ["CC-011", "ê¹ì¬í", "CON-COST", "ë§ê°", "ìì", "ìì", "", ""], ["CC-012", "ì±ëì©", "CON-COST", "ë§ê°", "ìì", "ìì", "", ""], ["CC-013", "ìíê·", "CON-COST", "ë§ê°", "ìì", "ìì", "", ""], ["CC-014", "ìì¢ì", "CON-COST", "ë§ê°", "ìì", "ìì", "", ""], ["CC-015", "ì¡ìê¸¸", "CON-COST", "ë§ê°", "ìì", "ìì", "", ""], ["CC-016", "ì´ìì§", "CON-COST", "ë§ê°", "ì±ì", "ì±ì", "", ""], ["CC-017", "ë¨ìì£¼", "CON-COST", "ë§ê°", "ì±ì", "ì±ì", "", ""], ["CC-018", "ì¡ì¹ì", "CON-COST", "ë§ê°", "ì±ì", "ì±ì", "", ""], ["CC-019", "ìì¹ì£¼", "CON-COST", "ë§ê°", "ì ì", "ì ì", "", ""], ["CC-020", "ë°ê°ë¦¼", "CON-COST", "ë§ê°", "ì ì", "ì ì", "", ""], ["CC-021", "ìì°½ì´", "CON-COST", "ë§ê°", "ì ì", "ì ì", "", ""], ["CC-022", "ê¹ìê²¸", "CON-COST", "ë§ê°", "íë¡", "íë¡", "", ""], ["CC-023", "ì ëí", "CON-COST", "êµ¬ì¡°/í ëª© ì¡°ê²½", "íì¥", "íì¥", "", ""], ["CC-024", "ê¹ì±ì", "CON-COST", "êµ¬ì¡°/í ëª© ì¡°ê²½", "ìì", "ìì", "", ""], ["CC-025", "ì´ì ì² ", "CON-COST", "êµ¬ì¡°/í ëª© ì¡°ê²½", "ìì", "ìì", "", ""], ["CC-026", "ë°ìí", "CON-COST", "êµ¬ì¡°/í ëª© ì¡°ê²½", "ì±ì", "ì±ì", "", ""], ["CC-027", "ìíì", "CON-COST", "êµ¬ì¡°/í ëª© ì¡°ê²½", "ì±ì", "ì±ì", "", ""], ["CC-028", "ìì§í", "CON-COST", "êµ¬ì¡°/í ëª© ì¡°ê²½", "íë¡", "íë¡", "", ""], ["CC-029", "ì´ì±í¬", "CON-COST", "BIMíí¸", "íí¸ì¥", "íí¸ì¥", "", ""], ["CC-030", "ì¤ì¹ê· ", "CON-COST", "í ëª©Â·ì¡°ê²½íí¸", "íí¸ì¥", "íí¸ì¥", "", ""], ["CC-031", "ì´ê²½í", "CON-COST", "í´ë ìì¼í°", "ì¼í°ì¥", "ì¼í°ì¥", "", ""], ["CC-032", "ê¹íì", "CON-COST", "í´ë ìì¼í°", "ê¸°ì ì´ì¬", "ê¸°ì ì´ì¬", "", ""], ["CC-033", "ì°ìì§", "CON-COST", "í´ë ìì¼í°", "ê¸°ì ì´ì¬", "ê¸°ì ì´ì¬", "", ""], ["VQS-001", "Hyun Dong Myung", "Viet QS", "ê²½ìì§", "CEO", "CEO", "íëëª", "Hyun Dong Myung"], ["VQS-002", "Lee Won Hee", "Viet QS", "ê²½ìì§", "Executive Vice President", "Executive Vice President", "ì´ìí¬", "Lee Won Hee"], ["VQS-003", "Lan Phuong", "Viet QS", "Management Support", "General Manager", "General Manager", "íì", "Lan Phuong"], ["VQS-004", "Thanh Tuyen", "Viet QS", "Management Support", "Staff", "Staff", "ëì", "Thanh Tuyen"], ["VQS-005", "Yen Phuong", "Viet QS", "Management Support", "Staff", "Staff", "íì", "Yen Phuong"], ["VQS-006", "Van Dung", "Viet QS", "Internal 1", "Team Leader", "Team Leader", "ìµ", "Van Dung"], ["VQS-007", "Huyen Thu", "Viet QS", "Internal 1", "Team Leader", "Team Leader", "í¬", "Huyen Thu"], ["VQS-009", "Dong Phuong", "Viet QS", "Internal 1", "Staff", "Staff", "ë íì", "Dong Phuong"], ["VQS-010", "Quang Truong", "Viet QS", "Internal 1", "Staff", "Staff", "ì¯ì", "Quang Truong"], ["VQS-012", "Thanh Xuan", "Viet QS", "Internal 2", "Asst. Team Leader", "Asst. Team Leader", "ìì¸", "Thanh Xuan"], ["VQS-013", "Kha Ai", "Viet QS", "Internal 2", "Staff", "Staff", "ì¹´ ìì´", "Kha Ai"], ["VQS-014", "Van Da", "Viet QS", "Internal 2", "Staff", "Staff", "ë°", "Van Da"], ["VQS-015", "Kim Tuyen", "Viet QS", "Internal 2", "Staff", "Staff", "ê¹ ëì", "Kim Tuyen"], ["VQS-016", "Phuoc Nguyen", "Viet QS", "Internal 2", "Staff", "Staff", "ìì°ì", "Phuoc Nguyen"], ["VQS-017", "Dinh Phi", "Viet QS", "Internal 3", "Team Leader", "Team Leader", "í¼", "Dinh Phi"], ["VQS-018", "Minh Triet", "Viet QS", "Internal 3", "Asst. Team Leader", "Asst. Team Leader", "ì°ì³", "Minh Triet"], ["VQS-019", "Doan Nhut", "Viet QS", "Internal 3", "Staff", "Staff", "ë¯¼ëì", "Doan Nhut"], ["VQS-020", "Minh Hai", "Viet QS", "Internal 3", "Staff", "Staff", "íì´", "Minh Hai"], ["VQS-021", "Minh Kiet", "Viet QS", "Internal 3", "Staff", "Staff", "ë¼ì£", "Minh Kiet"], ["VQS-022", "Van Tung", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "ë±", "Van Tung"], ["VQS-023", "Minh Luan", "Viet QS", "Partition&Opening", "Asst. Team Leader", "Asst. Team Leader", "ë£¨ì¸", "Minh Luan"], ["VQS-024", "Tan Phat", "Viet QS", "Partition&Opening", "Staff", "Staff", "í", "Tan Phat"], ["VQS-025", "Kim Thoa", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "ê¹ í¼", "Kim Thoa"], ["VQS-026", "Thi Thao", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "íì¤", "Thi Thao"], ["VQS-027", "Nhut Duy", "Viet QS", "External", "Team Leader", "Team Leader", "ì ì´", "Nhut Duy"], ["VQS-028", "Kieu Duyen", "Viet QS", "External", "Asst. Team Leader", "Asst. Team Leader", "ì ì", "Kieu Duyen"], ["VQS-029", "Quoc Bao", "Viet QS", "External", "Staff", "Staff", "ë¹ ì¤", "Quoc Bao"], ["VQS-030", "Ngoc Anh", "Viet QS", "External", "Staff", "Staff", "ìì¥ ì", "Ngoc Anh"], ["VQS-032", "Anh Tuan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "ëì¸", "Anh Tuan"], ["VQS-033", "Danh Xuan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "ì§  ìì¸", "Danh Xuan"], ["VQS-034", "Van Toan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "ëì", "Van Toan"], ["VQS-035", "Thien Ngan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "í°ì ìì¸", "Thien Ngan"], ["VQS-036", "Huu Chau", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "ì©ì°", "Huu Chau"], ["VQS-037", "Minh Tu", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "ë", "Minh Tu"], ["VQS-038", "Thanh Phong", "Viet QS", "Vertical", "Team Leader", "Team Leader", "í", "Thanh Phong"], ["VQS-039", "Dinh Nam", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "ë¨", "Dinh Nam"], ["VQS-040", "Cam Tu", "Viet QS", "Vertical", "Staff", "Staff", "ê¹ ë", "Cam Tu"], ["VQS-042", "Quoc Hung", "Viet QS", "Vertical", "Staff", "Staff", "í¥", "Quoc Hung"], ["VQS-043", "Khanh Duy", "Viet QS", "Vertical", "Staff", "Staff", "ì¹¸ ì ì´", "Khanh Duy"], ["VQS-044", "Ngoc Thoa", "Viet QS", "Vertical", "Staff", "Staff", "ì¥ í¼", "Ngoc Thoa"], ["VQS-045", "Thu Thuy", "Viet QS", "Vertical", "Staff", "Staff", "í¬ í", "Thu Thuy"], ["VQS-046", "Quoc Huy", "Viet QS", "Vertical", "Staff", "Staff", "í", "Quoc Huy"], ["VQS-047", "Ngoc Mai", "Viet QS", "Vertical", "Staff", "Staff", "ë§ì´", "Ngoc Mai"], ["VQS-049", "Huu Thai", "Viet QS", "Horizon / Foundation", "Team Leader", "Team Leader", "í´ íì´", "Huu Thai"], ["VQS-050", "Nhut Cuong", "Viet QS", "Horizon / Foundation", "Asst. Team Leader", "Asst. Team Leader", "ë£ëì", "Nhut Cuong"], ["VQS-051", "Sy Dan", "Viet QS", "Horizon / Foundation", "Team Leader", "Team Leader", "ë¨", "Sy Dan"], ["VQS-052", "Thanh Phuong", "Viet QS", "Development", "Team Leader", "Team Leader", "í íì", "Thanh Phuong"], ["VQS-053", "Dinh Van", "Viet QS", "External", "Staff", "Staff", "ë ë°", "Dinh Van"], ["VQS-054", "Manh Cuong", "Viet QS", "Development", "Staff", "Staff", "ëì", "Manh Cuong"], ["VQS-055", "Phuong Loan", "Viet QS", "Internal 1", "Asst. Team Leader", "Asst. Team Leader", "ë¡ì", "Phuong Loan"], ["VQS-056", "Thi Anh", "Viet QS", "Partition&Opening", "Staff", "Staff", "í° ì", "Thi Anh"], ["VQS-057", "Thuy Tram", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "ì§¬", "Thuy Tram"], ["VQS-058", "Trong Nguyen", "Viet QS", "Partition&Opening", "Staff", "Staff", "ìì°ì", "Trong Nguyen"], ["VQS-059", "Hong Ngan", "Viet QS", "Partition&Opening", "Staff", "Staff", "í ìì¸", "Hong Ngan"], ["VQS-060", "Minh Chau", "Viet QS", "Partition&Opening", "Staff", "Staff", "ë¯¼ ì©ì°", "Minh Chau"], ["VQS-061", "Quynh Giao", "Viet QS", "External", "Staff", "Staff", "ìì¤", "Quynh Giao"], ["VQS-062", "Minh Tuyen", "Viet QS", "External", "Staff", "Staff", "ë¯¼ ëì", "Minh Tuyen"], ["VQS-063", "Quang Tri", "Viet QS", "Civil", "Staff", "Staff", "ì°", "Quang Tri"], ["VQS-064", "Trung Dan", "Viet QS", "Civil", "Staff", "Staff", "ì« ë¨", "Trung Dan"], ["VQS-065", "Ngoc Bich", "Viet QS", "Horizon / Foundation", "Staff", "Staff", "ë¹", "Ngoc Bich"]];

orgEmployeeSeed.forEach(row => {
  if (!employees.some(emp => emp.empNo === row[0])) employees.push(createOrgEmployee(...row));
});

const vietQsOrgDeptCorrections = {
  "VQS-001": "ê²½ìì§",
  "VQS-002": "ê²½ìì§",
  "VQS-003": "Management Support",
  "VQS-004": "Management Support",
  "VQS-005": "Management Support",
  "VQS-006": "Internal 1",
  "VQS-055": "Internal 1",
  "VQS-009": "Internal 1",
  "VQS-010": "Internal 1",
  "VQS-007": "Internal 2",
  "VQS-013": "Internal 2",
  "VQS-014": "Internal 2",
  "VQS-015": "Internal 2",
  "VQS-016": "Internal 2",
  "VQS-017": "Internal 3",
  "VQS-018": "Internal 3",
  "VQS-019": "Internal 3",
  "VQS-020": "Internal 3",
  "VQS-021": "Internal 3",
  "VQS-022": "Partition&Opening",
  "VQS-026": "Partition&Opening",
  "VQS-023": "Partition&Opening",
  "VQS-057": "Partition&Opening",
  "VQS-056": "Partition&Opening",
  "VQS-058": "Partition&Opening",
  "VQS-024": "Partition&Opening",
  "VQS-059": "Partition&Opening",
  "VQS-060": "Partition&Opening",
  "VQS-027": "External",
  "VQS-028": "External",
  "VQS-029": "External",
  "VQS-061": "External",
  "VQS-030": "External",
  "VQS-053": "External",
  "VQS-062": "External",
  "VQS-032": "Vertical",
  "VQS-033": "Vertical",
  "VQS-034": "Vertical",
  "VQS-036": "Vertical",
  "VQS-037": "Vertical",
  "VQS-012": "Vertical",
  "VQS-040": "Vertical",
  "VQS-042": "Vertical",
  "VQS-043": "Vertical",
  "VQS-045": "Vertical",
  "VQS-035": "Horizontal/Foundation",
  "VQS-038": "Horizontal/Foundation",
  "VQS-049": "Horizontal/Foundation",
  "VQS-025": "Horizontal/Foundation",
  "VQS-050": "Horizontal/Foundation",
  "VQS-051": "Horizontal/Foundation",
  "VQS-039": "Horizontal/Foundation",
  "VQS-065": "Horizontal/Foundation",
  "VQS-047": "Horizontal/Foundation",
  "VQS-044": "Horizontal/Foundation",
  "VQS-046": "Horizontal/Foundation",
  "VQS-063": "Civil",
  "VQS-064": "Civil",
  "VQS-052": "Development",
  "VQS-054": "Development"
};
employees.forEach(emp => {
  if (vietQsOrgDeptCorrections[emp.empNo]) {
    emp.dept = vietQsOrgDeptCorrections[emp.empNo];
    emp.orgPath = `Viet QS > ${emp.dept}`;
  }
});


const assetLedger = [
  { category: "ë¸í¸ë¶", name: "LG Gram", code: "AS-2026-001", owner: "ë°ì©ì§", date: "2026-01-05", status: "ì¬ì©ì¤" },
  { category: "ë¼ì´ì ì¤", name: "AutoCAD", code: "LIC-2026-018", owner: "ë°ì©ì§", date: "2026-01-01", status: "ì¬ì©ì¤" },
  { category: "ëª¨ëí°", name: "Dell 27", code: "MN-2025-012", owner: "Nguyen Van An", date: "2025-03-02", status: "ì¬ì©ì¤" },
  { category: "ë¸í¸ë¶", name: "Lenovo ThinkPad", code: "AS-2024-021", owner: "Tran Thi Mai", date: "2024-01-10", status: "ë°ë©ëê¸°" }
];


const orgStructures = {
  "CON-COST": {
    "title": "ãì»¨ì½ì¤í¸ ì¡°ì§ë",
    "date": "2026. 05.12",
    "root": {
      "title": "ëíì´ì¬",
      "memberColumns": 1,
      "children": [
        {
          "title": "ë¶ì¬ì¥",
          "memberColumns": 6,
          "children": [
            {
              "title": "ê²½ìì§ìë³¸ë¶",
              "memberColumns": 1,
              "children": [
                {
                  "title": "ìë¬´",
                  "memberColumns": 1,
                  "children": [],
                  "employeeId": "CC-001"
                },
                {
                  "title": "ì¤ì¥",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "CC-002"
                },
                {
                  "title": "ì±ì",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "CC-003"
                },
                {
                  "title": "ì ì",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "CC-004"
                },
                {
                  "title": "ì ì",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "CC-005"
                }
              ],
              "displayName": "ê²½ìì§ìë³¸ë¶",
              "nodeType": "department",
              "className": "secondary"
            },
            {
              "title": "ê°ë° T/F",
              "memberColumns": 1,
              "children": [
                {
                  "title": "ê°ë°",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "EMP-2018-001"
                },
                {
                  "title": "ê°ë°",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "VQS-052"
                },
                {
                  "title": "ê°ë°",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "VQS-054"
                }
              ],
              "displayName": "ê°ë° T/F",
              "nodeType": "department",
              "className": "secondary"
            },
            {
              "title": "QCí",
              "memberColumns": 1,
              "children": [
                {
                  "title": "ì¤ì¥",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "CC-008"
                },
                {
                  "title": "ì¤ì¥",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "CC-009"
                }
              ],
              "displayName": "QCí",
              "nodeType": "department",
              "className": "secondary"
            },
            {
              "title": "ê¸°ì ë³¸ë¶",
              "memberColumns": 1,
              "children": [
                {
                  "title": "ë³¸ë¶ì¥",
                  "memberColumns": 2,
                  "children": [
                    {
                      "title": "ë§ê°í",
                      "memberColumns": 3,
                      "children": [
                        {
                          "title": "íì¥",
                          "memberColumns": 3,
                          "children": [
                            {
                              "title": "ìì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-011"
                            },
                            {
                              "title": "ìì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-012"
                            },
                            {
                              "title": "ìì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-013"
                            },
                            {
                              "title": "ìì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-014"
                            },
                            {
                              "title": "ìì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-015"
                            },
                            {
                              "title": "ì±ì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-016"
                            },
                            {
                              "title": "ì±ì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-017"
                            },
                            {
                              "title": "ì±ì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-018"
                            },
                            {
                              "title": "ì ì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-019"
                            },
                            {
                              "title": "ì ì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-020"
                            },
                            {
                              "title": "ì ì",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-021"
                            },
                            {
                              "title": "íë¡",
                              "memberColumns": 3,
                              "children": [],
                              "employeeId": "CC-022"
                            }
                          ],
                          "employeeId": "CC-009"
                        }
                      ],
                      "displayName": "ë§ê°í",
                      "nodeType": "department",
                      "className": "secondary"
                    },
                    {
                      "title": "êµ¬ì¡°/í ëª©ãì¡°ê²½íí¸",
                      "memberColumns": 3,
                      "children": [
                        {
                          "title": "êµ¬ì¡°/í ëª© ì¡°ì ",
                          "memberColumns": 3,
                          "children": [
                            {
                              "title": "BIMíí¸",
                              "displayName": "BIMíí¸",
                              "memberColumns": 1,
                              "children": [
                                {
                                  "title": "íí¸ì¥",
                                  "memberColumns": 1,
                                  "children": [],
                                  "employeeId": "CC-029"
                                }
                              ],
                              "nodeType": "department",
                              "className": "secondary"
                            },
                            {
                              "title": "êµ¬ì¡°í",
                              "displayName": "êµ¬ì¡°í",
                              "memberColumns": 1,
                              "children": [
                                {
                                  "title": "êµ¬ì¡° íì¥",
                                  "memberColumns": 1,
                                  "children": [
                                    {
                                      "title": "ìì",
                                      "memberColumns": 1,
                                      "children": [],
                                      "employeeId": "CC-024"
                                    },
                                    {
                                      "title": "ìì",
                                      "memberColumns": 1,
                                      "children": [
                                        {
                                          "title": "ì±ì",
                                          "memberColumns": 1,
                                          "children": [],
                                          "employeeId": "CC-026"
                                        },
                                        {
                                          "title": "ì±ì",
                                          "memberColumns": 1,
                                          "children": [],
                                          "employeeId": "CC-027"
                                        },
                                        {
                                          "title": "íë¡",
                                          "memberColumns": 1,
                                          "children": [],
                                          "employeeId": "CC-028"
                                        }
                                      ],
                                      "employeeId": "CC-025"
                                    }
                                  ],
                                  "employeeId": "CC-023"
                                }
                              ],
                              "nodeType": "department",
                              "className": "secondary"
                            },
                            {
                              "title": "í ëª©ãì¡°ê²½íí¸",
                              "displayName": "í ëª©ãì¡°ê²½íí¸",
                              "memberColumns": 1,
                              "children": [
                                {
                                  "title": "íí¸ì¥",
                                  "memberColumns": 1,
                                  "children": [],
                                  "employeeId": "CC-030"
                                }
                              ],
                              "nodeType": "department",
                              "className": "secondary"
                            }
                          ],
                          "employeeId": "CC-008"
                        }
                      ],
                      "displayName": "êµ¬ì¡°/í ëª©ãì¡°ê²½íí¸",
                      "nodeType": "department",
                      "className": "secondary"
                    }
                  ],
                  "employeeId": "CC-010"
                }
              ],
              "displayName": "ê¸°ì ë³¸ë¶",
              "nodeType": "department",
              "className": "secondary"
            },
            {
              "title": "í´ë ìì¼í°",
              "memberColumns": 1,
              "children": [
                {
                  "title": "ì¼í°ì¥",
                  "memberColumns": 1,
                  "children": [],
                  "employeeId": "CC-031"
                },
                {
                  "title": "ë³¸ë¶ì¥",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "CC-010"
                },
                {
                  "title": "ì¤ì¥",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "CC-008"
                },
                {
                  "title": "ê¸°ì ì´ì¬",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "CC-032"
                },
                {
                  "title": "ê¸°ì ì´ì¬",
                  "memberColumns": 3,
                  "children": [],
                  "employeeId": "CC-033"
                }
              ],
              "displayName": "í´ë ìì¼í°",
              "nodeType": "department",
              "className": "secondary"
            },
            {
              "title": "ê³µì¬ë¹ë·ì»´",
              "memberColumns": 3,
              "children": [],
              "displayName": "ê³µì¬ë¹ë·ì»´",
              "nodeType": "department",
              "className": "secondary"
            }
          ],
          "employeeId": "VQS-002",
          "className": "secondary"
        }
      ],
      "employeeId": "VQS-001",
      "className": "primary"
    }
  },
  "Viet QS": {
  "title": "Viet QS Organization Chart",
  "date": "2026. 05.12",
  "root": {
    "title": "CEO",
    "memberColumns": 3,
    "children": [
      {
        "title": "Executive Vice President",
        "memberColumns": 6,
        "children": [
          {
            "title": "ë¶ìëª",
            "memberColumns": 1,
            "children": [
              {
                "title": "General Manager",
                "memberColumns": 1,
                "children": [
                  {
                    "title": "Staff",
                    "memberColumns": 3,
                    "children": [],
                    "employeeId": "VQS-004"
                  },
                  {
                    "title": "Staff",
                    "memberColumns": 3,
                    "children": [],
                    "employeeId": "VQS-005"
                  }
                ],
                "employeeId": "VQS-003"
              }
            ],
            "displayName": "Management Support",
            "nodeType": "department",
            "className": "secondary"
          },
          {
            "title": "Director",
            "memberColumns": 3,
            "children": [
              {
                "title": "ë¶ìëª",
                "memberColumns": 1,
                "children": [
                  {
                    "title": "General Manager",
                    "memberColumns": 5,
                    "children": [
                      {
                        "title": "ë¶ìëª",
                        "memberColumns": 1,
                        "children": [
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-006"
                          },
                          {
                            "title": "Asst. Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-055"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-009"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-010"
                          }
                        ],
                        "displayName": "Internal 1",
                        "nodeType": "department",
                        "className": "secondary"
                      },
                      {
                        "title": "ë¶ìëª",
                        "memberColumns": 1,
                        "children": [
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-007"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-013"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-014"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-015"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-016"
                          }
                        ],
                        "displayName": "Internal 2",
                        "nodeType": "department",
                        "className": "secondary"
                      },
                      {
                        "title": "ë¶ìëª",
                        "memberColumns": 1,
                        "children": [
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-017"
                          },
                          {
                            "title": "Asst. Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-018"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-019"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-020"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-021"
                          }
                        ],
                        "displayName": "Internal 3",
                        "nodeType": "department",
                        "className": "secondary"
                      },
                      {
                        "title": "ë¶ìëª",
                        "memberColumns": 2,
                        "children": [
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-022"
                          },
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-026"
                          },
                          {
                            "title": "Asst. Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-023"
                          },
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-057"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-056"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-058"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-024"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-059"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-060"
                          }
                        ],
                        "displayName": "Partition&Opening",
                        "nodeType": "department",
                        "className": "secondary"
                      },
                      {
                        "title": "ë¶ìëª",
                        "memberColumns": 1,
                        "children": [
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-027"
                          },
                          {
                            "title": "Asst. Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-028"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-029"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-061"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-030"
                          },
                          {
                            "title": "staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-053"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-062"
                          }
                        ],
                        "displayName": "External",
                        "nodeType": "department",
                        "className": "secondary"
                      }
                    ],
                    "employeeId": "CC-009"
                  }
                ],
                "displayName": "Finish",
                "nodeType": "department",
                "className": "secondary"
              },
              {
                "title": "ë¶ìëª",
                "memberColumns": 1,
                "children": [
                  {
                    "title": "General Manager",
                    "memberColumns": 3,
                    "children": [
                      {
                        "title": "ë¶ìëª",
                        "memberColumns": 3,
                        "children": [
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-032"
                          },
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-033"
                          },
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-034"
                          },
                          {
                            "title": "Asst. Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-036"
                          },
                          {
                            "title": "Asst. Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-037"
                          },
                          {
                            "title": "Asst. Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-012"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-040"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-042"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-043"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-045"
                          }
                        ],
                        "displayName": "Vertical",
                        "nodeType": "department",
                        "className": "secondary"
                      },
                      {
                        "title": "ë¶ìëª",
                        "memberColumns": 3,
                        "children": [
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-035"
                          },
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-038"
                          },
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-049"
                          },
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-025"
                          },
                          {
                            "title": "Asst. Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-050"
                          },
                          {
                            "title": "Team Leader",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-051"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-039"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-065"
                          },
                          {
                            "title": "ì ê· ì¡°ì§",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-047"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-044"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-046"
                          }
                        ],
                        "displayName": "Horizontal/Foundation",
                        "nodeType": "department",
                        "className": "secondary"
                      },
                      {
                        "title": "ë¶ìëª",
                        "memberColumns": 1,
                        "children": [
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-063"
                          },
                          {
                            "title": "Staff",
                            "memberColumns": 3,
                            "children": [],
                            "employeeId": "VQS-064"
                          }
                        ],
                        "displayName": "Civil",
                        "nodeType": "department",
                        "className": "secondary"
                      }
                    ],
                    "employeeId": "CC-008"
                  }
                ],
                "displayName": "StructureãCivil",
                "nodeType": "department",
                "className": "secondary"
              }
            ],
            "employeeId": "CC-010"
          },
          {
            "title": "ë¶ìëª",
            "memberColumns": 1,
            "children": [
              {
                "title": "Team Leader",
                "memberColumns": 3,
                "children": [],
                "employeeId": "VQS-052"
              },
              {
                "title": "Staff",
                "memberColumns": 3,
                "children": [],
                "employeeId": "VQS-054"
              }
            ],
            "displayName": "Development",
            "nodeType": "department",
            "className": "secondary"
          }
        ],
        "employeeId": "VQS-002",
        "className": "secondary"
      }
    ],
    "employeeId": "VQS-001",
    "className": "primary"
  }
}
};

let currentOrgCompany = "CON-COST";
let currentOrgEditorCompany = "CON-COST";
let selectedOrgNodePath = "0";

const permissionRows = [
  ["ê¸°ë³¸ì ë³´", "ë³´ê¸°/ìì ", "ë³´ê¸°/ìì ", "ë³´ê¸°", "ë³¸ì¸ ìì ", "ì¼ë¶ ê³µê°"],
  ["ìì¸ì ë³´", "ë³´ê¸°/ìì ", "ë³´ê¸°/ìì ", "ì¼ë¶ ë³´ê¸°", "ë³¸ì¸ ìì ", "ë¹ê³µê°"],
  ["íê°/ì°ë´", "ë³´ê¸°", "ë³´ê¸°", "ë¹ê³µê°", "ë¹ê³µê°", "ë¹ê³µê°"],
  ["ì£¼ë¯¼ë±ë¡ë²í¸/ì ë¶ì¦", "ë³´ê¸°", "ë³´ê¸°/ìì ", "ë¹ê³µê°", "ë¹ê³µê°", "ë¹ê³µê°"],
  ["ê³ì¢ì ë³´", "ë³´ê¸°", "ë³´ê¸°/ìì ", "ë¹ê³µê°", "ë¹ê³µê°", "ë¹ê³µê°"],
  ["ì¸ì¬ë³ëì´ë ¥", "ë³´ê¸°", "ë³´ê¸°/ìì ", "ë³´ê¸°", "ì¼ë¶ ë³´ê¸°", "ë¹ê³µê°"],
  ["ìì°ê´ë¦¬", "ë³´ê¸°", "ë³´ê¸°/ìì ", "ë³´ê¸°", "ë³¸ì¸ ë³´ê¸°", "ë¹ê³µê°"]
];

const orderRows = [
  ["ì§ê¸", "G001", "ëí", 1, "ì¬ì©"],
  ["ì§ê¸", "G002", "ë¶ì¬ì¥", 2, "ì¬ì©"],
  ["ì§ê¸", "G003", "ìë¬´", 3, "ì¬ì©"],
  ["ì§ê¸", "G004", "ì¼í°ì¥", 4, "ì¬ì©"],
  ["ì§ê¸", "G005", "ë³¸ë¶ì¥", 5, "ì¬ì©"],
  ["ì§ê¸", "G006", "ì¤ì¥", 6, "ì¬ì©"],
  ["ì§ê¸", "G007", "íì¥", 7, "ì¬ì©"],
  ["ì§ê¸", "G008", "ìì", 8, "ì¬ì©"],
  ["ì§ì±", "R001", "PM", 20, "ì¬ì©"],
  ["ì§ì±", "R002", "íí¸ì¥", 21, "ì¬ì©"]
];

let selectedEmployeeId = employees[0].empNo;
let currentSortKey = "gradeOrder";
let sortDirection = 1;

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setFormValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function displayName(emp) {
  if (emp.company === "Viet QS" && emp.koreanName) {
    return `${emp.localName || emp.name}(${emp.koreanName})`;
  }
  return emp.name;
}

function statusBadge(status) {
  const map = {
    "ìì¬ìì ": "blue",
    "ì¬ì§": "green",
    "í´ì§": "yellow",
    "í´ì¬ìì ": "yellow",
    "í´ì¬": "gray",
    "ê³ì½ë§ë£": "gray",
    "ìì¬ì·¨ì": "red"
  };
  return `<span class="badge ${map[status] || "gray"}">${status}</span>`;
}

function companyBadge(company) {
  const cls = company === "Viet QS" ? "vietqs" : "concost";
  return `<span class="company-chip ${cls}">${company}</span>`;
}

function monthDiff(start, end = new Date()) {
  if (!start) return 0;
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(0, (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()));
}

function formatMonths(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}ê°ì`;
  if (m === 0) return `${y}ë`;
  return `${y}ë ${m}ê°ì`;
}


// 전역 저장/반영 확인 팝업
window.showToast = function(message, type) {
  var el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
  var icon = (type === 'error') ? '\u2715' : '\u2713';
  var color = (type === 'error') ? '#ef4444' : '#10b981';
  el.innerHTML = '<div style="font-size:32px;margin-bottom:10px;color:'+color+'">'+icon+'<\/div><div>'+message+'<\/div>';
  el.className = 'toast active' + (type === 'error' ? ' toast-error' : '');
  var bd = document.getElementById('toast-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.id = 'toast-backdrop'; bd.className = 'toast-backdrop'; document.body.insertBefore(bd, el); }
  bd.style.display = 'block';
  clearTimeout(el._tt);
  el._tt = setTimeout(function() { el.classList.remove('active'); bd.style.display = 'none'; }, 2000);
};