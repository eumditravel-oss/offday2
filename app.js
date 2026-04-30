const gradeOrder = {
  "대표": 1,
  "부사장": 2,
  "상무": 3,
  "센터장": 4,
  "본부장": 5,
  "실장": 6,
  "팀장": 7,
  "수석": 8,
  "매니저": 9,
  "사원": 10,
  "입사예정": 99
};

const pageMeta = {
  ledger: ["조직관리 · 사원대장", "조직관리 내 사원대장 화면입니다. 직원 목록, 회사, 부서, 재직상태, 직급순 정렬을 관리합니다."],
  card: ["조직관리 · 인사카드", "경영지원에서 직원 상세 인사정보, 인사변동, 반복정보, 자산, 증명서를 관리합니다."],
  analysis: ["조직관리 · 직원증감분석", "입사, 퇴사, 계약만료, 근속연수, 총 경력을 분석합니다."],
  approval: ["조직관리 · 승인관리", "증명서, 첨부파일, 인사정보 변경 승인 요청을 관리합니다."],
  orgEdit: ["조직관리 · 조직도관리", "CON-COST와 Viet QS 조직도, 직원 연결, 표시순서, 상위/하위 조직을 관리합니다."],
  cost: ["비용보고", "비용보고 대분류 화면입니다. 현재는 메뉴 구조 우선 구성 상태입니다."],
  asset: ["자산대장", "자산대장 대분류 화면입니다. 자산 등록, 배정, 반납 상태를 관리합니다."],
  admin: ["관리자 설정", "권한, 정책, 표시 순서, 캘린더 연동 기준을 관리합니다."],
  code: ["관리자 설정 · 코드관리", "관리자 설정 하위 메뉴로 코드값과 표시 순서를 관리합니다."]
};

const employees = [
  {
    empNo: "EMP-2018-001",
    name: "박용진",
    localName: "",
    koreanName: "",
    id: "yjpark",
    company: "CON-COST",
    dept: "BIM파트",
    grade: "수석",
    position: "파트 담당",
    status: "재직",
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
    nationality: "대한민국",
    workplace: "서울 본사",
    address: "서울특별시 강북구",
    emergency: "010-0000-0000",
    externalCareerMonths: 24,
    usedLeave: "7일",
    otTotal: "18시간",
    mainOtProject: "A-101 BIM 검토",
    orgPath: "경영지원 > BIM파트",
    reportLine: "PM → GM → 본부장",
    pmRole: "사용",
    multiDept: "개발지원 TF",
    audit: {
      basic: "등록자: 경영지원 / 최종수정자: 박용진 / 최종수정일: 2026-04-28 / 수정항목: 휴대폰",
      detail: "등록자: 경영지원 / 최종수정자: 경영지원 / 최종수정일: 2026-04-20 / 수정항목: 신분증번호"
    },
    histories: {
      join: [{ type: "입사", before: "-", after: "재직", date: "2018-04-01", reason: "신규 입사", manager: "경영지원" }],
      org: [
        { type: "부서", before: "구조팀", after: "BIM파트", date: "2026-04-01", reason: "조직개편", manager: "경영지원" },
        { type: "직급", before: "선임", after: "수석", date: "2025-01-01", reason: "정기승급", manager: "경영지원" }
      ],
      leave: [{ type: "병가", before: "정상근무", after: "병가 3일", date: "2024-06-10", reason: "진단서 제출", manager: "경영지원" }]
    },
    repeat: [
      { type: "학력", content: "대학교 / 전공명", start: "2011-03-01", end: "2015-02-28", period: "4년", file: "졸업증명서.pdf", note: "졸업" },
      { type: "경력", content: "이전 회사 구조팀", start: "2015-03-01", end: "2017-02-28", period: "2년", file: "-", note: "외부경력" }
    ],
    worklogs: [
      { date: "2026-04-10", type: "야근", project: "A-101 BIM 검토", time: "3시간", reason: "납품 전 QC", approver: "PM" }
    ],
    files: [
      { type: "근로계약서", name: "contract_park.pdf", date: "2026-01-01", status: "승인완료" }
    ]
  },
  {
    empNo: "EMP-2021-014",
    name: "김철수",
    localName: "",
    koreanName: "",
    id: "chkim",
    company: "CON-COST",
    dept: "경영지원본부",
    grade: "매니저",
    position: "관리",
    status: "재직",
    join: "2021-03-15",
    endDate: "",
    eval: "A-",
    project: 3,
    email: "chkim@con-cost.com",
    phoneCountry: "KR",
    phone: "010-1111-2222",
    idCountry: "KR",
    nationalId: "900101-1234567",
    birthday: "1990-01-01",
    wedding: "2020-05-20",
    nationality: "대한민국",
    workplace: "서울 본사",
    address: "서울특별시",
    emergency: "010-1111-0000",
    externalCareerMonths: 36,
    usedLeave: "5일",
    otTotal: "6시간",
    mainOtProject: "경영지원 세팅",
    orgPath: "경영지원본부",
    reportLine: "본부장",
    pmRole: "미사용",
    multiDept: "-",
    audit: {
      basic: "등록자: 경영지원 / 최종수정자: 김철수 / 최종수정일: 2026-04-21 / 수정항목: 주소",
      detail: "등록자: 경영지원 / 최종수정자: 경영지원 / 최종수정일: 2026-04-21 / 수정항목: 계좌"
    },
    histories: {
      join: [{ type: "입사", before: "-", after: "재직", date: "2021-03-15", reason: "신규 입사", manager: "경영지원" }],
      org: [{ type: "직책", before: "사원", after: "매니저", date: "2024-01-01", reason: "승진", manager: "경영지원" }],
      leave: []
    },
    repeat: [{ type: "경력", content: "이전 회사 총무팀", start: "2018-01-01", end: "2020-12-31", period: "3년", file: "-", note: "외부경력" }],
    worklogs: [],
    files: []
  },
  {
    empNo: "VQS-2024-033",
    name: "Nguyen Van An",
    localName: "Nguyen Van An",
    koreanName: "응우옌반안",
    id: "annguyen",
    company: "Viet QS",
    dept: "Viet QS 구조팀",
    grade: "사원",
    position: "산출 담당",
    status: "재직",
    join: "2024-09-01",
    endDate: "",
    eval: "B+",
    project: 5,
    email: "an.nguyen@vietqs.com",
    phoneCountry: "VN",
    phone: "0987-654-321",
    idCountry: "VN",
    nationalId: "0792123456123",
    birthday: "1997-12-12",
    wedding: "",
    nationality: "베트남",
    workplace: "베트남 지사",
    address: "Ho Chi Minh",
    emergency: "0987-000-000",
    externalCareerMonths: 12,
    usedLeave: "3일",
    otTotal: "12시간",
    mainOtProject: "VQS-STRUCT-22",
    orgPath: "Viet QS > 구조팀",
    reportLine: "팀장 → 센터장",
    pmRole: "미사용",
    multiDept: "-",
    audit: {
      basic: "등록자: HR Manager / 최종수정자: HR Manager / 최종수정일: 2026-04-22 / 수정항목: 연락처",
      detail: "등록자: HR Manager / 최종수정자: HR Manager / 최종수정일: 2026-04-22 / 수정항목: 신분증번호"
    },
    histories: {
      join: [
        { type: "입사", before: "-", after: "수습", date: "2024-09-01", reason: "Viet QS 신규 채용", manager: "HR Manager" },
        { type: "수습전환", before: "수습", after: "정규직", date: "2024-11-01", reason: "2개월 수습 종료", manager: "HR Manager" }
      ],
      org: [{ type: "소속", before: "-", after: "Viet QS 구조팀", date: "2024-09-01", reason: "초기 배치", manager: "HR Manager" }],
      leave: []
    },
    repeat: [{ type: "경력", content: "Local QS Office", start: "2023-01-01", end: "2023-12-31", period: "1년", file: "-", note: "외부경력" }],
    worklogs: [{ date: "2026-04-07", type: "야근", project: "VQS-STRUCT-22", time: "4시간", reason: "납품 대응", approver: "팀장" }],
    files: [{ type: "신분증", name: "id_an.pdf", date: "2024-09-01", status: "승인완료" }]
  },
  {
    empNo: "EMP-2026-002",
    name: "이민수",
    localName: "",
    koreanName: "",
    id: "mslee",
    company: "CON-COST",
    dept: "마감팀",
    grade: "입사예정",
    position: "팀원",
    status: "입사예정",
    join: "2026-05-01",
    endDate: "",
    eval: "-",
    project: 0,
    email: "mslee@con-cost.com",
    phoneCountry: "KR",
    phone: "010-3333-4444",
    idCountry: "KR",
    nationalId: "",
    birthday: "",
    wedding: "",
    nationality: "대한민국",
    workplace: "서울 본사",
    address: "",
    emergency: "",
    externalCareerMonths: 0,
    usedLeave: "-",
    otTotal: "-",
    mainOtProject: "-",
    orgPath: "마감팀",
    reportLine: "팀장",
    pmRole: "미사용",
    multiDept: "-",
    audit: {
      basic: "등록자: 경영지원 / 최종수정자: 경영지원 / 최종수정일: 2026-04-27 / 수정항목: 신규등록",
      detail: "등록자: - / 최종수정자: - / 최종수정일: -"
    },
    histories: {
      join: [{ type: "입사예정", before: "-", after: "입사예정", date: "2026-04-27", reason: "채용 확정", manager: "경영지원" }],
      org: [],
      leave: []
    },
    repeat: [],
    worklogs: [],
    files: []
  },
  {
    empNo: "VQS-2023-021",
    name: "Tran Thi Mai",
    localName: "Tran Thi Mai",
    koreanName: "쩐티마이",
    id: "maitran",
    company: "Viet QS",
    dept: "Viet QS 마감1팀",
    grade: "팀장",
    position: "팀장",
    status: "계약만료",
    join: "2023-01-10",
    endDate: "2026-01-09",
    eval: "B",
    project: 2,
    email: "mai.tran@vietqs.com",
    phoneCountry: "VN",
    phone: "0912-345-678",
    idCountry: "VN",
    nationalId: "0791987654321",
    birthday: "1991-03-03",
    wedding: "2018-11-11",
    nationality: "베트남",
    workplace: "베트남 지사",
    address: "Ho Chi Minh",
    emergency: "0912-000-000",
    externalCareerMonths: 48,
    usedLeave: "9일",
    otTotal: "0시간",
    mainOtProject: "-",
    orgPath: "Viet QS > 마감1팀",
    reportLine: "센터장",
    pmRole: "사용",
    multiDept: "-",
    audit: {
      basic: "등록자: HR Manager / 최종수정자: HR Manager / 최종수정일: 2026-01-09 / 수정항목: 계약만료",
      detail: "등록자: HR Manager / 최종수정자: HR Manager / 최종수정일: 2025-08-01"
    },
    histories: {
      join: [{ type: "계약만료", before: "재직", after: "계약만료", date: "2026-01-09", reason: "계약기간 종료", manager: "HR Manager" }],
      org: [{ type: "직책", before: "팀원", after: "팀장", date: "2024-06-01", reason: "업무역량 평가", manager: "HR Manager" }],
      leave: [{ type: "무급휴직", before: "정상근무", after: "무급휴직 14일", date: "2025-08-01", reason: "개인 사유", manager: "HR Manager" }]
    },
    repeat: [{ type: "경력", content: "Local Design Office", start: "2019-01-01", end: "2022-12-31", period: "4년", file: "-", note: "외부경력" }],
    worklogs: [],
    files: [{ type: "계약서", name: "contract_mai.pdf", date: "2023-01-10", status: "승인완료" }]
  }
];


function createOrgEmployee(empNo, name, company, dept, grade, position, koreanName = "", localName = "") {
  return {
    empNo, name, localName, koreanName,
    id: empNo.toLowerCase().replaceAll("-", "_"),
    company, dept, grade, position: position || grade,
    status: "재직", join: "2026-04-01", endDate: "", eval: "-", project: 0,
    email: `${empNo.toLowerCase().replaceAll("-", "_")}@${company === "Viet QS" ? "vietqs.local" : "con-cost.local"}`,
    phoneCountry: company === "Viet QS" ? "VN" : "KR",
    phone: company === "Viet QS" ? "0900-000-000" : "010-0000-0000",
    idCountry: company === "Viet QS" ? "VN" : "KR",
    nationalId: "", birthday: "", wedding: "",
    nationality: company === "Viet QS" ? "베트남" : "대한민국",
    workplace: company === "Viet QS" ? "베트남 지사" : "서울 본사",
    address: "", emergency: "", externalCareerMonths: 0, usedLeave: "-", otTotal: "-", mainOtProject: "-",
    orgPath: `${company} > ${dept}`, reportLine: "조직도 기준", pmRole: "미사용", multiDept: "-",
    audit: { basic: "더미 인사카드 / 조직도 초기 세팅", detail: "더미 인사카드 / 상세정보 미입력" },
    histories: { join: [{ type: "초기등록", before: "-", after: "재직", date: "2026-04-28", reason: "조직도 일괄 반영", manager: "경영지원" }], org: [], leave: [] },
    repeat: [], worklogs: [], files: []
  };
}

const orgEmployeeSeed = [["CC-001", "이서진", "CON-COST", "경영지원본부", "상무", "상무", "", ""], ["CC-002", "강동균", "CON-COST", "경영지원본부", "실장", "실장", "", ""], ["CC-003", "김영은", "CON-COST", "경영지원본부", "책임", "책임", "", ""], ["CC-004", "김태영", "CON-COST", "경영지원본부", "선임", "선임", "", ""], ["CC-005", "현예은", "CON-COST", "경영지원본부", "선임", "선임", "", ""], ["CC-006", "탄프엉", "CON-COST", "개발 T/F", "사원", "개발", "", ""], ["CC-007", "끄엉", "CON-COST", "개발 T/F", "사원", "개발", "", ""], ["CC-008", "장범선", "CON-COST", "QC", "실장", "실장", "", ""], ["CC-009", "조한빈", "CON-COST", "QC", "실장", "실장", "", ""], ["CC-010", "최영배", "CON-COST", "기술본부", "본부장", "본부장", "", ""], ["CC-011", "김재현", "CON-COST", "마감", "수석", "수석", "", ""], ["CC-012", "성대용", "CON-COST", "마감", "수석", "수석", "", ""], ["CC-013", "양한규", "CON-COST", "마감", "수석", "수석", "", ""], ["CC-014", "원종수", "CON-COST", "마감", "수석", "수석", "", ""], ["CC-015", "송영길", "CON-COST", "마감", "수석", "수석", "", ""], ["CC-016", "이은지", "CON-COST", "마감", "책임", "책임", "", ""], ["CC-017", "남은주", "CON-COST", "마감", "책임", "책임", "", ""], ["CC-018", "송치영", "CON-COST", "마감", "책임", "책임", "", ""], ["CC-019", "임승주", "CON-COST", "마감", "선임", "선임", "", ""], ["CC-020", "박가림", "CON-COST", "마감", "선임", "선임", "", ""], ["CC-021", "임창열", "CON-COST", "마감", "선임", "선임", "", ""], ["CC-022", "김수겸", "CON-COST", "마감", "프로", "프로", "", ""], ["CC-023", "신동현", "CON-COST", "구조/토목 조경", "팀장", "팀장", "", ""], ["CC-024", "김재원", "CON-COST", "구조/토목 조경", "수석", "수석", "", ""], ["CC-025", "이정철", "CON-COST", "구조/토목 조경", "수석", "수석", "", ""], ["CC-026", "박수현", "CON-COST", "구조/토목 조경", "책임", "책임", "", ""], ["CC-027", "서화원", "CON-COST", "구조/토목 조경", "책임", "책임", "", ""], ["CC-028", "양진혁", "CON-COST", "구조/토목 조경", "프로", "프로", "", ""], ["CC-029", "이성희", "CON-COST", "BIM파트", "파트장", "파트장", "", ""], ["CC-030", "오승규", "CON-COST", "토목·조경파트", "파트장", "파트장", "", ""], ["CC-031", "이경훈", "CON-COST", "클레임센터", "센터장", "센터장", "", ""], ["CC-032", "김현수", "CON-COST", "클레임센터", "기술이사", "기술이사", "", ""], ["CC-033", "우상진", "CON-COST", "클레임센터", "기술이사", "기술이사", "", ""], ["VQS-001", "Hyun Dong Myung", "Viet QS", "경영진", "CEO", "CEO", "현동명", "Hyun Dong Myung"], ["VQS-002", "Lee Won Hee", "Viet QS", "경영진", "Executive Vice President", "Executive Vice President", "이원희", "Lee Won Hee"], ["VQS-003", "Lan Phuong", "Viet QS", "Management Support", "General Manager", "General Manager", "프엉", "Lan Phuong"], ["VQS-004", "Thanh Tuyen", "Viet QS", "Management Support", "Staff", "Staff", "뚜엔", "Thanh Tuyen"], ["VQS-005", "Yen Phuong", "Viet QS", "Management Support", "Staff", "Staff", "프엉", "Yen Phuong"], ["VQS-006", "Van Dung", "Viet QS", "Internal 1", "Team Leader", "Team Leader", "융", "Van Dung"], ["VQS-007", "Huyen Thu", "Viet QS", "Internal 1", "Team Leader", "Team Leader", "투", "Huyen Thu"], ["VQS-008", "Hong Phien", "Viet QS", "Internal 1", "Staff", "Staff", "피앤", "Hong Phien"], ["VQS-009", "Dong Phuong", "Viet QS", "Internal 1", "Staff", "Staff", "동 프엉", "Dong Phuong"], ["VQS-010", "Quang Truong", "Viet QS", "Internal 1", "Staff", "Staff", "쯔엉", "Quang Truong"], ["VQS-011", "Thanh Loc", "Viet QS", "Internal 1", "Staff", "Staff", "록", "Thanh Loc"], ["VQS-012", "Thanh Xuan", "Viet QS", "Internal 2", "Asst. Team Leader", "Asst. Team Leader", "수언", "Thanh Xuan"], ["VQS-013", "Kha Ai", "Viet QS", "Internal 2", "Staff", "Staff", "카 아이", "Kha Ai"], ["VQS-014", "Van Da", "Viet QS", "Internal 2", "Staff", "Staff", "따", "Van Da"], ["VQS-015", "Kim Tuyen", "Viet QS", "Internal 2", "Staff", "Staff", "김 뚜엔", "Kim Tuyen"], ["VQS-016", "Phuoc Nguyen", "Viet QS", "Internal 2", "Staff", "Staff", "응우옌", "Phuoc Nguyen"], ["VQS-017", "Dinh Phi", "Viet QS", "Internal 3", "Team Leader", "Team Leader", "피", "Dinh Phi"], ["VQS-018", "Minh Triet", "Viet QS", "Internal 3", "Asst. Team Leader", "Asst. Team Leader", "찌앳", "Minh Triet"], ["VQS-019", "Doan Nhut", "Viet QS", "Internal 3", "Staff", "Staff", "민느엇", "Doan Nhut"], ["VQS-020", "Minh Hai", "Viet QS", "Internal 3", "Staff", "Staff", "하이", "Minh Hai"], ["VQS-021", "Minh Kiet", "Viet QS", "Internal 3", "Staff", "Staff", "끼엣", "Minh Kiet"], ["VQS-022", "Van Tung", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "뚱", "Van Tung"], ["VQS-023", "Minh Luan", "Viet QS", "Partition&Opening", "Asst. Team Leader", "Asst. Team Leader", "루언", "Minh Luan"], ["VQS-024", "Tan Phat", "Viet QS", "Partition&Opening", "Staff", "Staff", "팓", "Tan Phat"], ["VQS-025", "Kim Thoa", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "김 톼", "Kim Thoa"], ["VQS-026", "Thi Thao", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "타오", "Thi Thao"], ["VQS-027", "Nhut Duy", "Viet QS", "External", "Team Leader", "Team Leader", "유이", "Nhut Duy"], ["VQS-028", "Kieu Duyen", "Viet QS", "External", "Asst. Team Leader", "Asst. Team Leader", "유엔", "Kieu Duyen"], ["VQS-029", "Quoc Bao", "Viet QS", "External", "Staff", "Staff", "빠오", "Quoc Bao"], ["VQS-030", "Ngoc Anh", "Viet QS", "External", "Staff", "Staff", "응옥 안", "Ngoc Anh"], ["VQS-031", "Thuc Nguyen", "Viet QS", "External", "Staff", "Staff", "응우옌", "Thuc Nguyen"], ["VQS-032", "Anh Tuan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "뚜언", "Anh Tuan"], ["VQS-033", "Danh Xuan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "짠 수언", "Danh Xuan"], ["VQS-034", "Van Toan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "또안", "Van Toan"], ["VQS-035", "Thien Ngan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "티엔 응언", "Thien Ngan"], ["VQS-036", "Huu Chau", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "쩌우", "Huu Chau"], ["VQS-037", "Minh Tu", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "뚜", "Minh Tu"], ["VQS-038", "Thanh Phong", "Viet QS", "Vertical", "Team Leader", "Team Leader", "퐁", "Thanh Phong"], ["VQS-039", "Dinh Nam", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "남", "Dinh Nam"], ["VQS-040", "Cam Tu", "Viet QS", "Vertical", "Staff", "Staff", "깜 뚜", "Cam Tu"], ["VQS-041", "Tien Thinh", "Viet QS", "Vertical", "Staff", "Staff", "띠엔 틴", "Tien Thinh"], ["VQS-042", "Quoc Hung", "Viet QS", "Vertical", "Staff", "Staff", "흥", "Quoc Hung"], ["VQS-043", "Khanh Duy", "Viet QS", "Vertical", "Staff", "Staff", "칸 유이", "Khanh Duy"], ["VQS-044", "Ngoc Thoa", "Viet QS", "Vertical", "Staff", "Staff", "옥 톼", "Ngoc Thoa"], ["VQS-045", "Thu Thuy", "Viet QS", "Vertical", "Staff", "Staff", "투 튀", "Thu Thuy"], ["VQS-046", "Quoc Huy", "Viet QS", "Vertical", "Staff", "Staff", "휘", "Quoc Huy"], ["VQS-047", "Ngoc Mai", "Viet QS", "Vertical", "Staff", "Staff", "마이", "Ngoc Mai"], ["VQS-048", "Xuan Hoang", "Viet QS", "Vertical", "Staff", "Staff", "쑨 황", "Xuan Hoang"], ["VQS-049", "Huu Thai", "Viet QS", "Horizon / Foundation", "Team Leader", "Team Leader", "휴 타이", "Huu Thai"], ["VQS-050", "Nhut Cuong", "Viet QS", "Horizon / Foundation", "Asst. Team Leader", "Asst. Team Leader", "늣끄엉", "Nhut Cuong"], ["VQS-051", "Sy Dan", "Viet QS", "Horizon / Foundation", "Team Leader", "Team Leader", "단", "Sy Dan"], ["VQS-052", "Thanh Phuong", "Viet QS", "Development", "Team Leader", "Team Leader", "탄 프엉", "Thanh Phuong"], ["VQS-053", "Dinh Van", "Viet QS", "Civil", "Staff", "Staff", "딘 반", "Dinh Van"], ["VQS-054", "Manh Cuong", "Viet QS", "Civil", "Staff", "Staff", "끄엉", "Manh Cuong"]];

orgEmployeeSeed.forEach(row => {
  if (!employees.some(emp => emp.empNo === row[0])) employees.push(createOrgEmployee(...row));
});

const assetLedger = [
  { category: "노트북", name: "LG Gram", code: "AS-2026-001", owner: "박용진", date: "2026-01-05", status: "사용중" },
  { category: "라이선스", name: "AutoCAD", code: "LIC-2026-018", owner: "박용진", date: "2026-01-01", status: "사용중" },
  { category: "모니터", name: "Dell 27", code: "MN-2025-012", owner: "Nguyen Van An", date: "2025-03-02", status: "사용중" },
  { category: "노트북", name: "Lenovo ThinkPad", code: "AS-2024-021", owner: "Tran Thi Mai", date: "2024-01-10", status: "반납대기" }
];


const orgStructures = {
  "CON-COST": {
    title: "㈜컨코스트 조직도",
    date: "2026. 4. 9.",
    root: { title: "대표이사", className: "primary", children: [
      { title: "부사장", className: "secondary", children: [
        { title: "경영지원본부", employeeId: "CC-001", children: [
          { employeeId: "CC-002" },
          { employeeId: "CC-003" },
          { employeeId: "CC-004" },
          { employeeId: "CC-005" },
          { title: "개발 T/F", children: [{ employeeId: "EMP-2018-001" }, { employeeId: "CC-006" }, { employeeId: "CC-007" }] },
          { title: "QC", children: [{ employeeId: "CC-008" }, { employeeId: "CC-009" }] }
        ] },
        { title: "기술본부", employeeId: "CC-010", children: [
          { title: "마감", employeeId: "CC-009", children: [{ employeeId: "CC-011" }, { employeeId: "CC-012" }, { employeeId: "CC-013" }, { employeeId: "CC-014" }, { employeeId: "CC-015" }, { employeeId: "CC-016" }, { employeeId: "CC-017" }, { employeeId: "CC-018" }, { employeeId: "CC-019" }, { employeeId: "CC-020" }, { employeeId: "CC-021" }, { employeeId: "CC-022" }] },
          { title: "구조/토목 조경", employeeId: "CC-008", children: [
            { title: "구조팀", children: [{ employeeId: "CC-023" }, { employeeId: "CC-024" }, { employeeId: "CC-025" }, { employeeId: "CC-026" }, { employeeId: "CC-027" }, { employeeId: "CC-028" }] },
            { title: "BIM 파트", employeeId: "CC-029", children: [{ employeeId: "EMP-2018-001" }] },
            { title: "토목·조경파트", employeeId: "CC-030" }
          ] }
        ] },
        { title: "클레임센터", employeeId: "CC-031", children: [{ employeeId: "CC-010" }, { employeeId: "CC-008" }, { employeeId: "CC-032" }, { employeeId: "CC-033" }] },
        { title: "공사비닷컴", className: "dotted" }
      ] }
    ] }
  },
  "Viet QS": {
    title: "Viet QS Organization Chart",
    date: "2026. 04.07",
    root: { employeeId: "VQS-001", className: "primary", children: [
      { employeeId: "VQS-002", className: "secondary", children: [
        { title: "Management Support", employeeId: "VQS-003", children: [{ employeeId: "VQS-004" }, { employeeId: "VQS-005" }] },
        { title: "Director", employeeId: "CC-010" },
        { title: "Finish", employeeId: "CC-009", children: [
          { title: "Internal 1", children: [{ employeeId: "VQS-006" }, { employeeId: "VQS-007" }, { employeeId: "VQS-008" }, { employeeId: "VQS-009" }, { employeeId: "VQS-010" }, { employeeId: "VQS-011" }] },
          { title: "Internal 2", children: [{ employeeId: "VQS-012" }, { employeeId: "VQS-013" }, { employeeId: "VQS-014" }, { employeeId: "VQS-015" }, { employeeId: "VQS-016" }] },
          { title: "Internal 3", children: [{ employeeId: "VQS-017" }, { employeeId: "VQS-018" }, { employeeId: "VQS-019" }, { employeeId: "VQS-020" }, { employeeId: "VQS-021" }] },
          { title: "Partition&Opening", children: [{ employeeId: "VQS-022" }, { employeeId: "VQS-023" }, { employeeId: "VQS-024" }, { employeeId: "VQS-025" }, { employeeId: "VQS-026" }] },
          { title: "External", children: [{ employeeId: "VQS-027" }, { employeeId: "VQS-028" }, { employeeId: "VQS-029" }, { employeeId: "VQS-030" }, { employeeId: "VQS-031" }] }
        ] },
        { title: "Structure/Civil", children: [
          { title: "Vertical", children: [{ employeeId: "VQS-032" }, { employeeId: "VQS-033" }, { employeeId: "VQS-034" }, { employeeId: "VQS-035" }, { employeeId: "VQS-036" }, { employeeId: "VQS-037" }, { employeeId: "VQS-038" }, { employeeId: "VQS-039" }, { employeeId: "VQS-040" }, { employeeId: "VQS-041" }, { employeeId: "VQS-042" }, { employeeId: "VQS-043" }, { employeeId: "VQS-044" }, { employeeId: "VQS-045" }, { employeeId: "VQS-046" }, { employeeId: "VQS-047" }, { employeeId: "VQS-048" }] },
          { title: "Horizon / Foundation", children: [{ employeeId: "VQS-049" }, { employeeId: "VQS-050" }, { employeeId: "VQS-051" }, { employeeId: "VQS-052" }] },
          { title: "Civil", employeeId: "CC-008", children: [{ employeeId: "VQS-053" }, { employeeId: "VQS-054" }] }
        ] }
      ] }
    ] }
  }
};

let currentOrgCompany = "CON-COST";
let currentOrgEditorCompany = "CON-COST";
let selectedOrgNodePath = "0";

const permissionRows = [
  ["기본정보", "보기/수정", "보기/수정", "보기", "본인 수정", "일부 공개"],
  ["상세정보", "보기/수정", "보기/수정", "일부 보기", "본인 수정", "비공개"],
  ["평가/연봉", "보기", "보기", "비공개", "비공개", "비공개"],
  ["주민등록번호/신분증", "보기", "보기/수정", "비공개", "비공개", "비공개"],
  ["계좌정보", "보기", "보기/수정", "비공개", "비공개", "비공개"],
  ["인사변동이력", "보기", "보기/수정", "보기", "일부 보기", "비공개"],
  ["자산관리", "보기", "보기/수정", "보기", "본인 보기", "비공개"]
];

const orderRows = [
  ["직급", "G001", "대표", 1, "사용"],
  ["직급", "G002", "부사장", 2, "사용"],
  ["직급", "G003", "상무", 3, "사용"],
  ["직급", "G004", "센터장", 4, "사용"],
  ["직급", "G005", "본부장", 5, "사용"],
  ["직급", "G006", "실장", 6, "사용"],
  ["직급", "G007", "팀장", 7, "사용"],
  ["직급", "G008", "수석", 8, "사용"],
  ["직책", "R001", "PM", 20, "사용"],
  ["직책", "R002", "파트장", 21, "사용"]
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
    "입사예정": "blue",
    "재직": "green",
    "휴직": "yellow",
    "퇴사예정": "yellow",
    "퇴사": "gray",
    "계약만료": "gray",
    "입사취소": "red"
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
  if (y === 0) return `${m}개월`;
  if (m === 0) return `${y}년`;
  return `${y}년 ${m}개월`;
}

function switchPanel(panelId) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".side-main, .side-item").forEach(b => b.classList.remove("active"));

  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add("active");

  const activeBtn = document.querySelector(`[data-main="${panelId}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const meta = pageMeta[panelId] || pageMeta.ledger;
  setText("pageTitle", meta[0]);
  setText("pageDesc", meta[1]);
}

document.querySelectorAll(".side-main").forEach(btn => {
  btn.addEventListener("click", () => {
    const groupId = btn.dataset.group;
    const panelId = btn.dataset.main;

    if (groupId) {
      document.querySelectorAll(".side-sub").forEach(s => s.classList.remove("active"));
      document.getElementById(groupId)?.classList.add("active");
      document.querySelectorAll(".side-main").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    }

    if (panelId) {
      switchPanel(panelId);
    }
  });
});

document.querySelectorAll(".side-item").forEach(btn => {
  btn.addEventListener("click", () => {
    switchPanel(btn.dataset.main);
  });
});

document.querySelectorAll(".inner-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".inner-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".detail-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.detail)?.classList.add("active");
  });
});

function renderKpis() {
  setText("kpiTotal", employees.length);
  setText("kpiConcost", employees.filter(e => e.company === "CON-COST").length);
  setText("kpiVietqs", employees.filter(e => e.company === "Viet QS").length);
  setText("kpiActive", employees.filter(e => e.status === "재직").length);
  setText("kpiExpected", employees.filter(e => e.status === "입사예정").length);
}

function getSortValue(emp, key) {
  if (key === "name") return displayName(emp);
  if (key === "gradeOrder") return gradeOrder[emp.grade] || 999;
  return emp[key] || "";
}

function sortList(list) {
  return [...list].sort((a, b) => {
    const av = getSortValue(a, currentSortKey);
    const bv = getSortValue(b, currentSortKey);
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * sortDirection;
    return String(av).localeCompare(String(bv), "ko") * sortDirection;
  });
}

function toggleSort(key) {
  if (currentSortKey === key) {
    sortDirection *= -1;
  } else {
    currentSortKey = key;
    sortDirection = 1;
  }
  applyLedgerFilters(false);
}

function renderLedger(list = employees) {
  const tbody = document.getElementById("ledgerBody");
  if (!tbody) return;

  tbody.innerHTML = sortList(list).map(emp => `
    <tr>
      <td><div class="emp-photo">${displayName(emp)[0]}</div></td>
      <td>${emp.empNo}</td>
      <td><strong>${displayName(emp)}</strong></td>
      <td>${companyBadge(emp.company)}</td>
      <td>${emp.id}</td>
      <td>${emp.dept}</td>
      <td>${emp.grade}</td>
      <td>${statusBadge(emp.status)}</td>
      <td>${emp.join}</td>
      <td><span class="badge blue">${emp.eval}</span></td>
      <td>${emp.project}</td>
      <td><button class="btn btn-line" onclick="openCard('${emp.empNo}')">상세</button></td>
    </tr>
  `).join("");
}

function renderEmployeeList(list = employees) {
  const box = document.getElementById("employeeList");
  if (!box) return;

  box.innerHTML = list.map(emp => `
    <div class="employee-item ${emp.empNo === selectedEmployeeId ? "active" : ""}" onclick="selectEmployee('${emp.empNo}', this)">
      <div class="emp-photo">${displayName(emp)[0]}</div>
      <div>
        <div class="emp-name">${displayName(emp)}</div>
        <div class="emp-meta">${emp.company} · ${emp.dept} · ${emp.grade} · ${emp.status}<br>${emp.empNo}</div>
      </div>
    </div>
  `).join("");
}

function selectEmployee(empNo, el) {
  const emp = employees.find(e => e.empNo === empNo);
  if (!emp) return;

  selectedEmployeeId = empNo;

  document.querySelectorAll(".employee-item").forEach(item => item.classList.remove("active"));
  if (el) el.classList.add("active");

  setText("profilePhoto", displayName(emp)[0]);
  setText("profileName", displayName(emp));
  setText("quickTenure", formatMonths(monthDiff(emp.join)));
  setText("quickCareer", formatMonths(monthDiff(emp.join) + emp.externalCareerMonths));
  setText("quickProject", emp.project);
  setText("quickGrade", emp.eval);

  const profileTags = document.getElementById("profileTags");
  if (profileTags) {
    profileTags.innerHTML = `
      ${companyBadge(emp.company)}
      <span class="badge blue">${emp.dept}</span>
      <span class="badge gray">${emp.grade}</span>
      ${statusBadge(emp.status)}
      <span class="badge blue">${emp.join} 입사</span>
      <span class="badge gray">${emp.empNo}</span>
    `;
  }

  setFormValue("cardName", emp.name);
  setFormValue("cardLocalName", emp.localName);
  setFormValue("cardKoreanName", emp.koreanName);
  setFormValue("cardEmpNo", emp.empNo);
  setFormValue("cardUserId", emp.id);
  setFormValue("cardCompany", emp.company);
  setFormValue("cardDept", emp.dept);
  setFormValue("cardGrade", emp.grade);
  setFormValue("cardPosition", emp.position);
  setFormValue("cardStatus", emp.status);
  setFormValue("cardJoin", emp.join);
  setFormValue("cardEndDate", emp.endDate);
  setFormValue("cardCorp", emp.company === "Viet QS" ? "베트남 지사" : "한국 본사");
  setFormValue("cardWorkplace", emp.workplace);
  setFormValue("cardEmail", emp.email);
  setFormValue("phoneCountry", emp.phoneCountry);
  setFormValue("phoneInput", emp.phone);
  setFormValue("cardAddress", emp.address);
  setFormValue("cardEmergency", emp.emergency);
  setFormValue("idCountry", emp.idCountry);
  setFormValue("nationalId", emp.nationalId);
  setFormValue("cardBirthday", emp.birthday);
  setFormValue("cardWedding", emp.wedding);
  setFormValue("cardNationality", emp.nationality);
  setFormValue("orgPath", emp.orgPath);
  setFormValue("reportLine", emp.reportLine);
  setFormValue("pmRole", emp.pmRole);
  setFormValue("multiDept", emp.multiDept);
  setText("basicAudit", emp.audit.basic);
  setText("detailAudit", emp.audit.detail);

  renderHistories(emp);
  renderRepeat(emp);
  renderEmployeeAssets(emp);
  renderWorklogs(emp);
  renderFiles(emp);
}

function renderHistories(emp) {
  renderHistoryRows("joinHistoryBody", emp.histories.join);
  renderHistoryRows("orgHistoryBody", emp.histories.org);
  renderHistoryRows("leaveHistoryBody", emp.histories.leave);
}

function renderHistoryRows(targetId, rows) {
  const tbody = document.getElementById(targetId);
  if (!tbody) return;

  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">등록된 이력이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(row => `
    <tr>
      <td>${row.type}</td>
      <td>${row.before}</td>
      <td>${row.after}</td>
      <td>${row.date}</td>
      <td>${row.reason}</td>
      <td>${row.manager}</td>
    </tr>
  `).join("");
}

function renderRepeat(emp) {
  const tbody = document.getElementById("repeatBody");
  if (!tbody) return;

  if (!emp.repeat || emp.repeat.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">등록된 반복 정보가 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = emp.repeat.map(row => `
    <tr>
      <td>${row.type}</td>
      <td>${row.content}</td>
      <td>${row.start}</td>
      <td>${row.end}</td>
      <td>${row.period}</td>
      <td>${row.file}</td>
      <td>${row.note}</td>
    </tr>
  `).join("");
}

function renderEmployeeAssets(emp) {
  const tbody = document.getElementById("employeeAssetBody");
  if (!tbody) return;

  const assets = assetLedger.filter(a => a.owner === emp.name || a.owner === emp.localName || a.owner === displayName(emp));

  if (assets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">배정된 자산이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = assets.map(a => `
    <tr>
      <td>${a.category}</td>
      <td>${a.name}</td>
      <td>${a.code}</td>
      <td>${a.date}</td>
      <td>-</td>
      <td><span class="badge green">${a.status}</span></td>
    </tr>
  `).join("");
}

function renderWorklogs(emp) {
  setText("usedLeave", emp.usedLeave);
  setText("otTotal", emp.otTotal);
  setText("mainOtProject", emp.mainOtProject);

  const tbody = document.getElementById("worklogBody");
  if (!tbody) return;

  if (!emp.worklogs || emp.worklogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">등록된 업무/야근 이력이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = emp.worklogs.map(row => `
    <tr>
      <td>${row.date}</td>
      <td>${row.type}</td>
      <td>${row.project}</td>
      <td>${row.time}</td>
      <td>${row.reason}</td>
      <td>${row.approver}</td>
    </tr>
  `).join("");
}

function renderFiles(emp) {
  const tbody = document.getElementById("fileBody");
  if (!tbody) return;

  if (!emp.files || emp.files.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">등록된 파일이 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = emp.files.map(file => `
    <tr>
      <td>${file.type}</td>
      <td>${file.name}</td>
      <td>${file.date}</td>
      <td><span class="badge ${file.status === "승인완료" ? "green" : "yellow"}">${file.status}</span></td>
      <td><button class="btn btn-line">다운로드</button></td>
      <td><button class="btn btn-line">변경신청</button></td>
    </tr>
  `).join("");
}

function openCard(empNo) {
  switchPanel("card");
  setTimeout(() => selectEmployee(empNo), 0);
}

function filterEmployees(keyword = "") {
  const q = keyword.trim().toLowerCase();
  const company = document.getElementById("companyFilter")?.value || "전체";
  const dept = document.getElementById("deptFilter")?.value || "전체";
  const grade = document.getElementById("gradeFilter")?.value || "전체";
  const status = document.getElementById("statusFilter")?.value || "재직";
  const year = document.getElementById("yearFilter")?.value || "전체";

  return employees.filter(emp => {
    const searchTarget = [emp.name, emp.localName, emp.koreanName, emp.empNo, emp.id, emp.company, emp.dept, emp.email].join(" ").toLowerCase();

    return (!q || searchTarget.includes(q)) &&
      (company === "전체" || emp.company === company) &&
      (dept === "전체" || emp.dept === dept) &&
      (grade === "전체" || emp.grade === grade) &&
      (status === "전체" || emp.status === status) &&
      (year === "전체" || emp.join.startsWith(year));
  });
}

function applyLedgerFilters(show = true) {
  const keyword = document.getElementById("ledgerSearch")?.value || "";
  renderLedger(filterEmployees(keyword));
  if (show) showToast("검색 조건이 적용되었습니다.");
}

function filterEmployeesForList(keyword) {
  const q = keyword.trim().toLowerCase();
  return employees.filter(emp =>
    emp.name.toLowerCase().includes(q) ||
    emp.localName.toLowerCase().includes(q) ||
    emp.koreanName.toLowerCase().includes(q) ||
    emp.empNo.toLowerCase().includes(q) ||
    emp.id.toLowerCase().includes(q) ||
    emp.dept.toLowerCase().includes(q) ||
    emp.company.toLowerCase().includes(q) ||
    emp.email.toLowerCase().includes(q)
  );
}

function renderAnalysis() {
  const body = document.getElementById("analysisBody");
  const careerBody = document.getElementById("careerSummaryBody");
  if (!body || !careerBody) return;

  const companies = ["CON-COST", "Viet QS"];
  body.innerHTML = companies.map(company => {
    const target = employees.filter(e => e.company === company);
    return `
      <tr>
        <td>${company}</td>
        <td>${target.filter(e => e.status === "재직").length}</td>
        <td>${target.filter(e => e.join.startsWith("2026")).length}</td>
        <td>${target.filter(e => ["퇴사", "계약만료"].includes(e.status)).length}</td>
        <td>${target.filter(e => e.status === "입사예정").length}</td>
        <td>${target.filter(e => e.status === "휴직").length}</td>
      </tr>
    `;
  }).join("");

  careerBody.innerHTML = employees.map(emp => {
    const tenureMonths = monthDiff(emp.join);
    const totalCareer = tenureMonths + emp.externalCareerMonths;
    const rejoin = emp.histories.join.some(h => h.type === "재입사") ? "있음" : "없음";

    return `
      <tr>
        <td>${displayName(emp)}</td>
        <td>${companyBadge(emp.company)}</td>
        <td>${emp.join}</td>
        <td>${formatMonths(tenureMonths)}</td>
        <td>${formatMonths(emp.externalCareerMonths)}</td>
        <td>${formatMonths(totalCareer)}</td>
        <td>${rejoin}</td>
      </tr>
    `;
  }).join("");

  const join2026 = employees.filter(e => e.join.startsWith("2026")).length;
  const exit2026 = employees.filter(e => ["퇴사", "계약만료"].includes(e.status)).length;
  const avgTenure = Math.round(employees.reduce((sum, e) => sum + monthDiff(e.join), 0) / employees.length);
  const avgCareer = Math.round(employees.reduce((sum, e) => sum + monthDiff(e.join) + e.externalCareerMonths, 0) / employees.length);

  setText("analysisJoin", join2026);
  setText("analysisExit", exit2026);
  setText("analysisExitRate", `${Math.round((exit2026 / employees.length) * 100)}%`);
  setText("analysisAvgTenure", formatMonths(avgTenure));
  setText("analysisAvgCareer", formatMonths(avgCareer));
}

function renderAssetLedger() {
  const tbody = document.getElementById("assetLedgerBody");
  if (!tbody) return;

  tbody.innerHTML = assetLedger.map(a => `
    <tr>
      <td>${a.category}</td>
      <td>${a.name}</td>
      <td>${a.code}</td>
      <td>${a.owner}</td>
      <td>${a.date}</td>
      <td><span class="badge ${a.status === "사용중" ? "green" : "yellow"}">${a.status}</span></td>
      <td><button class="btn btn-line" onclick="showToast('자산 배정/반납 관리 예시입니다.')">관리</button></td>
    </tr>
  `).join("");
}

function renderPermissionRows() {
  const tbody = document.getElementById("permissionBody");
  if (!tbody) return;

  tbody.innerHTML = permissionRows.map(row => `
    <tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td>${row[3]}</td>
      <td>${row[4]}</td>
      <td>${row[5]}</td>
    </tr>
  `).join("");
}

function renderOrderRows() {
  const tbody = document.getElementById("orderBody");
  if (!tbody) return;

  tbody.innerHTML = orderRows.map(row => `
    <tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td>${row[3]}</td>
      <td><span class="badge green">${row[4]}</span></td>
      <td><button class="btn btn-line" onclick="showToast('표시순서 변경 예시입니다.')">↑↓</button></td>
    </tr>
  `).join("");
}

function validateRequired() {
  const activePanel = document.querySelector(".detail-panel.active");
  if (!activePanel) return;

  const requiredInputs = activePanel.querySelectorAll("[required]");
  let valid = true;

  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add("invalid");
      valid = false;
    } else {
      input.classList.remove("invalid");
    }
  });

  showToast(valid ? "필수 입력값 검증 완료. 저장 처리 예시입니다." : "* 필수 입력값을 확인해 주세요.");
}

function validateModal() {
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
    closeModal();
    showToast("신규 직원 등록 예시가 저장되었습니다.");
  } else {
    showToast("* 필수 입력값을 확인해 주세요.");
  }
}

function openModal() {
  document.getElementById("employeeModal")?.classList.add("active");
}

function closeModal() {
  document.getElementById("employeeModal")?.classList.remove("active");
}

function openExcelModal() {
  document.getElementById("excelModal")?.classList.add("active");
}

function closeExcelModal() {
  document.getElementById("excelModal")?.classList.remove("active");
}

function openPermissionModal() {
  document.getElementById("permissionModal")?.classList.add("active");
}

function closePermissionModal() {
  document.getElementById("permissionModal")?.classList.remove("active");
}


function employeeById(empNo) {
  return employees.find(e => e.empNo === empNo);
}

function orgNodeLabel(node) {
  const emp = node.employeeId ? employeeById(node.employeeId) : null;
  const title = node.title || (emp ? emp.position || emp.grade : "조직");
  const name = emp ? displayName(emp) : "";
  return { emp, title, name };
}

function renderOrgPersonButton(node, extraClass = "") {
  const { emp, title, name } = orgNodeLabel(node);
  const labelName = name || title;
  const labelTitle = emp ? (emp.position || emp.grade || title) : title;
  const company = emp ? emp.company : "";
  const dept = emp ? emp.dept : "";
  const onclick = emp ? ` onclick="openMiniCardPopup('${emp.empNo}')"` : "";
  return `
    <button class="org-mini-person ${extraClass} ${emp ? "clickable" : ""}"${onclick}>
      <span>${labelTitle}</span>
      <strong>${labelName}</strong>
      ${company ? `<small>${company} · ${dept}</small>` : ""}
    </button>
  `;
}

function collectOrgMembers(node, rows = []) {
  if (node.employeeId) rows.push(node);
  (node.children || []).forEach(child => collectOrgMembers(child, rows));
  return rows;
}

function renderOrgBranchCard(node) {
  const { emp, title, name } = orgNodeLabel(node);
  const children = node.children || [];
  const directLead = emp ? renderOrgPersonButton(node, "lead") : "";
  const childMembers = children.flatMap(child => collectOrgMembers(child, []));
  const childOnly = childMembers.filter(child => child.employeeId !== node.employeeId);

  return `
    <section class="org-overview-card">
      <div class="org-overview-card-title">${title}</div>
      ${directLead || (name ? `<div class="org-overview-lead">${name}</div>` : "")}
      <div class="org-overview-members">
        ${childOnly.map(child => renderOrgPersonButton(child)).join("") || `<div class="org-empty">하위 인원 없음</div>`}
      </div>
    </section>
  `;
}

function splitOrgColumns(nodes, maxColumns = 3) {
  const list = (nodes || []).filter(Boolean);
  const columns = Math.min(maxColumns, Math.max(1, Math.ceil(list.length / 4)));
  const buckets = Array.from({ length: columns }, () => []);
  list.forEach((node, index) => buckets[index % columns].push(node));
  return buckets;
}

function renderOrgMemberColumns(nodes, maxColumns = 3) {
  const list = (nodes || []).filter(Boolean);
  if (!list.length) return `<div class="org-empty">하위 인원 없음</div>`;
  return `
    <div class="org-member-column-wrap cols-${Math.min(maxColumns, Math.max(1, Math.ceil(list.length / 4)))}">
      ${splitOrgColumns(list, maxColumns).map(col => `
        <div class="org-member-column">
          ${col.map(child => renderOrgPersonButton(child)).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

function renderOrgDepartmentBlock(node, options = {}) {
  if (!node) return "";
  const { emp, title, name } = orgNodeLabel(node);
  const children = (node.children || []).filter(child => child.employeeId !== node.employeeId);
  const subGroups = children.filter(child => (child.children || []).length);
  const directMembers = children.filter(child => !(child.children || []).length);
  const colCount = options.columns || 3;

  return `
    <section class="org-chart-block ${options.className || ""}">
      <div class="org-block-title">${title}</div>
      ${emp ? renderOrgPersonButton(node, "lead") : (name ? `<div class="org-overview-lead">${name}</div>` : "")}
      ${directMembers.length ? `<div class="org-block-members">${renderOrgMemberColumns(directMembers, colCount)}</div>` : ""}
      ${subGroups.length ? `
        <div class="org-subpart-grid ${subGroups.length > 2 ? "wide" : ""}">
          ${subGroups.map(group => renderOrgDepartmentBlock(group, { className: "subpart", columns: 2 })).join("")}
        </div>
      ` : ""}
      ${!directMembers.length && !subGroups.length ? `<div class="org-empty">하위 인원 없음</div>` : ""}
    </section>
  `;
}

function renderConcostOrgChart(root) {
  const ceo = root;
  const vice = (root.children || [])[0] || { title: "부사장", children: [] };
  const branches = vice.children || [];
  const findBranch = title => branches.find(node => node.title === title) || { title, children: [] };
  const management = findBranch("경영지원본부");
  const tech = findBranch("기술본부");
  const claim = findBranch("클레임센터");
  const dotted = findBranch("공사비닷컴");

  return `
    <div class="org-overview-fit concost-fit reference-layout">
      <div class="org-chart-title-box">㈜컨코스트 조직도</div>
      <div class="org-ref-date">2026. 4. 9.</div>
      <div class="org-ref-exec-stack">
        ${renderOrgPersonButton(ceo, "primary")}
        ${renderOrgPersonButton(vice, "secondary")}
      </div>
      <div class="org-ref-branch-row">
        ${renderOrgDepartmentBlock(management, { className: "management-block", columns: 1 })}
        ${renderOrgDepartmentBlock(tech, { className: "tech-block", columns: 3 })}
        ${renderOrgDepartmentBlock(claim, { className: "claim-block", columns: 1 })}
        ${dotted ? `<aside class="org-side-dotted">${renderOrgDepartmentBlock(dotted, { className: "dotted-block", columns: 1 })}</aside>` : ""}
      </div>
    </div>
  `;
}

function renderVietqsOrgChart(root) {
  const topNodes = [root, ...(root.children || [])].slice(0, 3);
  const branchParent = (root.children || [])[0] || root;
  const branchNodes = branchParent.children || root.children || [];

  return `
    <div class="org-overview-fit">
      <div class="org-overview-exec">
        ${topNodes.map((node, index) => renderOrgPersonButton(node, index === 0 ? "primary" : "secondary")).join("")}
      </div>
      <div class="org-overview-line"></div>
      <div class="org-overview-grid vietqs-grid">
        ${branchNodes.map(renderOrgBranchCard).join("")}
      </div>
    </div>
  `;
}

function renderOrgChart(company = currentOrgCompany) {
  const target = document.getElementById("orgChartContent");
  if (!target) return;

  const data = orgStructures[company];
  currentOrgCompany = company;

  const root = data.root;
  const totalMembers = collectOrgMembers(root, []).length;
  const linkedCards = new Set(collectOrgMembers(root, []).map(node => node.employeeId).filter(Boolean)).size;
  const chartMarkup = company === "CON-COST" ? renderConcostOrgChart(root) : renderVietqsOrgChart(root);

  target.innerHTML = `
    <div class="org-chart-header compact">
      <div>
        <span>${data.date}</span>
        <h3>${data.title}</h3>
      </div>
      <div class="org-chart-header-actions">
        <div class="org-stat"><span>조직도 표기 인원</span><strong>${totalMembers}</strong></div>
        <div class="org-stat"><span>단일 인사카드</span><strong>${linkedCards}</strong></div>
        <button class="btn btn-line" onclick="switchPanel('orgEdit'); closeOrgChart();">조직도관리로 이동</button>
      </div>
    </div>
    ${chartMarkup}
  `;
}

function switchOrgCompany(company, el) {
  document.querySelectorAll(".org-tab").forEach(tab => tab.classList.remove("active"));
  if (el) el.classList.add("active");
  renderOrgChart(company);
}

function flattenOrgRows(node, company, parent = "최상위", rows = []) {
  const { emp, title, name } = orgNodeLabel(node);
  rows.push({ company, parent, title, name: name || "-", empNo: emp ? emp.empNo : "-" });
  (node.children || []).forEach(child => flattenOrgRows(child, company, title, rows));
  return rows;
}


function getOrgNodeByPath(path, company = currentOrgEditorCompany) {
  const parts = String(path || "0").split("-").map(Number);
  let node = orgStructures[company]?.root;
  for (let i = 1; i < parts.length; i++) {
    node = node?.children?.[parts[i]];
  }
  return node || null;
}

function getOrgParentByPath(path, company = currentOrgEditorCompany) {
  const parts = String(path || "0").split("-").map(Number);
  if (parts.length <= 1) return null;
  return getOrgNodeByPath(parts.slice(0, -1).join("-"), company);
}

function getOrgEditorRows(node, company, path = "0", parent = "최상위", rows = []) {
  const { emp, title, name } = orgNodeLabel(node);
  rows.push({
    company,
    path,
    parent,
    title: title || "조직",
    name: name || "-",
    empNo: emp ? emp.empNo : "-"
  });
  (node.children || []).forEach((child, index) => {
    getOrgEditorRows(child, company, `${path}-${index}`, title || "조직", rows);
  });
  return rows;
}

function renderOrgEmployeeOptions(selectedEmpNo = "") {
  const currentCompany = currentOrgEditorCompany;
  const ordered = [...employees].sort((a, b) => {
    if (a.company !== b.company) return a.company === currentCompany ? -1 : 1;
    return displayName(a).localeCompare(displayName(b), "ko");
  });

  return `<option value="">직원 미연결</option>` + ordered.map(emp => `
    <option value="${emp.empNo}" ${emp.empNo === selectedEmpNo ? "selected" : ""}>
      ${displayName(emp)} · ${emp.company} · ${emp.dept} · ${emp.empNo}
    </option>
  `).join("");
}

function renderOrgParentOptions(selectedPath = "0") {
  const rows = getOrgEditorRows(orgStructures[currentOrgEditorCompany].root, currentOrgEditorCompany);
  const current = selectedPath;
  const parentPath = current.includes("-") ? current.split("-").slice(0, -1).join("-") : "";

  return rows
    .filter(row => row.path !== current && !row.path.startsWith(`${current}-`))
    .map(row => `
      <option value="${row.path}" ${row.path === parentPath ? "selected" : ""}>
        ${"— ".repeat(row.path.split("-").length - 1)}${row.title} ${row.name !== "-" ? `· ${row.name}` : ""}
      </option>
    `).join("");
}

function renderOrgVisualNode(node, path = "0") {
  const { emp, title, name } = orgNodeLabel(node);
  const children = node.children || [];
  const selected = path === selectedOrgNodePath ? "selected" : "";
  const typeClass = node.className || "";
  const displayTitle = title || (emp ? emp.position || emp.grade : "조직");
  const displayPerson = emp ? displayName(emp) : (name || "직원 미연결");
  const meta = emp ? `${emp.company} · ${emp.dept}` : "조직 노드";

  return `
    <div class="org-v-node-wrap">
      <div class="org-v-node ${selected} ${typeClass}" onclick="selectOrgVisualNode('${path}')">
        <div class="org-v-node-top">
          <span>${displayTitle}</span>
          <small>${path}</small>
        </div>
        <strong>${displayPerson}</strong>
        <em>${meta}</em>
        ${emp ? `<button class="org-card-link" onclick="event.stopPropagation(); openMiniCardPopup('${emp.empNo}')">인사카드</button>` : ""}
      </div>
      ${children.length ? `
        <div class="org-v-children">
          ${children.map((child, index) => renderOrgVisualNode(child, `${path}-${index}`)).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function renderOrgVisualEditor() {
  const target = document.getElementById("orgVisualCanvas");
  if (!target) return;

  const data = orgStructures[currentOrgEditorCompany];
  if (!data) return;

  if (!getOrgNodeByPath(selectedOrgNodePath, currentOrgEditorCompany)) {
    selectedOrgNodePath = "0";
  }

  setText("orgEditorCompanyLabel", currentOrgEditorCompany);
  setText("orgEditorTitle", data.title);

  target.innerHTML = `
    <div class="org-v-scroll">
      <div class="org-v-tree">
        ${renderOrgVisualNode(data.root, "0")}
      </div>
    </div>
  `;

  updateOrgInspector();
}

function updateOrgInspector() {
  const node = getOrgNodeByPath(selectedOrgNodePath);
  const inspectorTitle = document.getElementById("orgInspectorTitle");
  const titleInput = document.getElementById("orgNodeTitleInput");
  const employeeSelect = document.getElementById("orgNodeEmployeeSelect");
  const parentSelect = document.getElementById("orgNodeParentSelect");
  const classSelect = document.getElementById("orgNodeClassSelect");
  const summary = document.getElementById("orgNodeSummary");

  if (!node) {
    if (inspectorTitle) inspectorTitle.textContent = "선택 노드 없음";
    if (summary) summary.textContent = "좌측 캔버스에서 편집할 조직 또는 직원을 선택하세요.";
    return;
  }

  const { emp, title, name } = orgNodeLabel(node);
  if (inspectorTitle) inspectorTitle.textContent = name || title || "조직 노드";
  if (titleInput) titleInput.value = node.title || "";
  if (employeeSelect) employeeSelect.innerHTML = renderOrgEmployeeOptions(node.employeeId || "");
  if (parentSelect) {
    parentSelect.innerHTML = selectedOrgNodePath === "0"
      ? `<option value="">최상위 노드는 상위조직 변경 불가</option>`
      : renderOrgParentOptions(selectedOrgNodePath);
    parentSelect.disabled = selectedOrgNodePath === "0";
  }
  if (classSelect) classSelect.value = node.className || "";
  if (summary) {
    summary.innerHTML = `
      <strong>현재 선택 노드</strong>
      <span>회사: ${currentOrgEditorCompany}</span>
      <span>조직/직책: ${title || "-"}</span>
      <span>연결 직원: ${emp ? `${displayName(emp)} (${emp.empNo})` : "미연결"}</span>
      <span>하위 노드: ${(node.children || []).length}개</span>
    `;
  }
}

function selectOrgVisualNode(path) {
  selectedOrgNodePath = path;
  renderOrgVisualEditor();
}

function switchOrgEditorCompany(company, el) {
  currentOrgEditorCompany = company;
  currentOrgCompany = company;
  selectedOrgNodePath = "0";
  document.querySelectorAll("[data-org-editor-company]").forEach(tab => tab.classList.remove("active"));
  if (el) el.classList.add("active");
  renderOrgVisualEditor();
}

function updateSelectedOrgNodeField(field, value) {
  const node = getOrgNodeByPath(selectedOrgNodePath);
  if (!node) return;

  if (field === "employeeId" && !value) {
    delete node.employeeId;
  } else if (field === "title" && !value.trim()) {
    delete node.title;
  } else if (field === "className" && !value) {
    delete node.className;
  } else {
    node[field] = value;
  }

  renderOrgVisualEditor();
  renderOrgChart(currentOrgEditorCompany);
}

function addOrgChildNode() {
  const node = getOrgNodeByPath(selectedOrgNodePath);
  if (!node) return showToast("하위 노드를 추가할 조직을 선택해 주세요.");
  if (!node.children) node.children = [];
  node.children.push({ title: "신규 조직", children: [] });
  selectedOrgNodePath = `${selectedOrgNodePath}-${node.children.length - 1}`;
  renderOrgVisualEditor();
  renderOrgChart(currentOrgEditorCompany);
  showToast("하위 노드를 추가했습니다.");
}

function addOrgSiblingNode() {
  if (selectedOrgNodePath === "0") return addOrgChildNode();
  const parent = getOrgParentByPath(selectedOrgNodePath);
  if (!parent) return;
  const index = Number(selectedOrgNodePath.split("-").pop());
  parent.children.splice(index + 1, 0, { title: "신규 조직", children: [] });
  selectedOrgNodePath = `${selectedOrgNodePath.split("-").slice(0, -1).join("-")}-${index + 1}`;
  renderOrgVisualEditor();
  renderOrgChart(currentOrgEditorCompany);
  showToast("같은 단계 노드를 추가했습니다.");
}

function moveOrgNode(direction) {
  if (selectedOrgNodePath === "0") return showToast("최상위 노드는 이동할 수 없습니다.");
  const parent = getOrgParentByPath(selectedOrgNodePath);
  if (!parent?.children) return;
  const parts = selectedOrgNodePath.split("-");
  const index = Number(parts.pop());
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= parent.children.length) return showToast("더 이상 이동할 수 없습니다.");
  [parent.children[index], parent.children[nextIndex]] = [parent.children[nextIndex], parent.children[index]];
  selectedOrgNodePath = `${parts.join("-")}-${nextIndex}`;
  renderOrgVisualEditor();
  renderOrgChart(currentOrgEditorCompany);
}

function deleteOrgNode() {
  if (selectedOrgNodePath === "0") return showToast("최상위 노드는 삭제할 수 없습니다.");
  const parent = getOrgParentByPath(selectedOrgNodePath);
  if (!parent?.children) return;
  const index = Number(selectedOrgNodePath.split("-").pop());
  parent.children.splice(index, 1);
  selectedOrgNodePath = selectedOrgNodePath.split("-").slice(0, -1).join("-") || "0";
  renderOrgVisualEditor();
  renderOrgChart(currentOrgEditorCompany);
  showToast("선택 노드를 삭제했습니다.");
}

function changeSelectedOrgParent(newParentPath) {
  if (!newParentPath || selectedOrgNodePath === "0" || newParentPath === selectedOrgNodePath) return;
  const oldParent = getOrgParentByPath(selectedOrgNodePath);
  const movingNode = getOrgNodeByPath(selectedOrgNodePath);
  const newParent = getOrgNodeByPath(newParentPath);
  if (!oldParent?.children || !movingNode || !newParent) return;

  const oldIndex = Number(selectedOrgNodePath.split("-").pop());
  oldParent.children.splice(oldIndex, 1);
  if (!newParent.children) newParent.children = [];
  newParent.children.push(movingNode);
  selectedOrgNodePath = `${newParentPath}-${newParent.children.length - 1}`;
  renderOrgVisualEditor();
  renderOrgChart(currentOrgEditorCompany);
  showToast("상위 조직을 변경했습니다.");
}

function openSelectedOrgEmployeeCard() {
  const node = getOrgNodeByPath(selectedOrgNodePath);
  if (!node?.employeeId) return showToast("연결된 직원이 없습니다.");
  openMiniCardPopup(node.employeeId);
}

function saveOrgVisualEditor() {
  renderOrgVisualEditor();
  renderOrgChart(currentOrgEditorCompany);
  showToast("조직도 편집 설정이 저장되었습니다.");
}

function renderOrgEditor() {
  renderOrgVisualEditor();
}



let orgEditorPopupWindow = null;
let orgEditorDragSourcePath = null;
let orgEditorPopupZoom = 1;
let orgEditorPopupAutoFit = true;

function findOrgNodePathByReference(targetNode, company = currentOrgEditorCompany) {
  const root = orgStructures[company]?.root;
  let found = null;
  function walk(node, path) {
    if (!node || found) return;
    if (node === targetNode) {
      found = path;
      return;
    }
    (node.children || []).forEach((child, index) => walk(child, `${path}-${index}`));
  }
  walk(root, "0");
  return found;
}

function moveOrgNodeToParentByDrag(sourcePath, targetPath) {
  if (!sourcePath || !targetPath) return;
  if (sourcePath === "0") return showToast("최상위 노드는 드래그 이동할 수 없습니다.");
  if (sourcePath === targetPath || targetPath.startsWith(`${sourcePath}-`)) {
    return showToast("자기 자신 또는 하위 조직으로는 이동할 수 없습니다.");
  }

  const sourceParent = getOrgParentByPath(sourcePath);
  const movingNode = getOrgNodeByPath(sourcePath);
  const targetNode = getOrgNodeByPath(targetPath);
  if (!sourceParent?.children || !movingNode || !targetNode) return;

  const sourceIndex = Number(sourcePath.split("-").pop());
  sourceParent.children.splice(sourceIndex, 1);
  if (!targetNode.children) targetNode.children = [];
  targetNode.children.push(movingNode);
  selectedOrgNodePath = findOrgNodePathByReference(movingNode) || selectedOrgNodePath;

  renderOrgChart(currentOrgEditorCompany);
  renderOrgVisualEditor();
  renderOrgVisualEditorPopup();
  showToast("드래그한 노드를 선택 조직의 하위로 이동했습니다.");
}

function renderOrgPopupEmployeeOptions(selectedEmpNo = "") {
  const currentCompany = currentOrgEditorCompany;
  const ordered = [...employees].sort((a, b) => {
    if (a.company !== b.company) return a.company === currentCompany ? -1 : 1;
    return displayName(a).localeCompare(displayName(b), "ko");
  });
  return `<option value="">직원 미연결</option>` + ordered.map(emp => `
    <option value="${emp.empNo}" ${emp.empNo === selectedEmpNo ? "selected" : ""}>
      ${displayName(emp)} · ${emp.company} · ${emp.dept} · ${emp.empNo}
    </option>
  `).join("");
}

function renderOrgPopupParentOptions(selectedPath = "0") {
  const rows = getOrgEditorRows(orgStructures[currentOrgEditorCompany].root, currentOrgEditorCompany);
  const current = selectedPath;
  const parentPath = current.includes("-") ? current.split("-").slice(0, -1).join("-") : "";

  return rows
    .filter(row => row.path !== current && !row.path.startsWith(`${current}-`))
    .map(row => `
      <option value="${row.path}" ${row.path === parentPath ? "selected" : ""}>
        ${"— ".repeat(row.path.split("-").length - 1)}${row.title} ${row.name !== "-" ? `· ${row.name}` : ""}
      </option>
    `).join("");
}

function getOrgPopupNodeClass(node, depth) {
  const raw = (node.title || node.employeeId || "node").toString();
  const slug = raw
    .replace(/[^0-9a-zA-Z가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `depth-${depth} org-popup-${slug || "node"}`;
}

function isOrgBranchNode(node) {
  return Array.isArray(node.children) && node.children.length > 0;
}

function renderOrgPopupNode(node, path = "0", depth = 0) {
  const { emp, title, name } = orgNodeLabel(node);
  const children = node.children || [];
  const selected = path === selectedOrgNodePath ? "selected" : "";
  const typeClass = node.className || "";
  const layoutClass = getOrgPopupNodeClass(node, depth);
  const displayTitle = title || (emp ? emp.position || emp.grade : "조직");
  const displayPerson = emp ? displayName(emp) : (name || "직원 미연결");
  const meta = emp ? `${emp.company} · ${emp.dept}` : "조직 노드";

  const leafChildren = children
    .map((child, index) => ({ child, index }))
    .filter(item => !isOrgBranchNode(item.child));
  const branchChildren = children
    .map((child, index) => ({ child, index }))
    .filter(item => isOrgBranchNode(item.child));

  return `
    <div class="popup-node-wrap ${layoutClass}" data-path="${path}" data-title="${displayTitle}">
      <div class="popup-node ${selected} ${typeClass} depth-${depth}"
        draggable="true"
        ondragstart="if(event.ctrlKey){event.preventDefault();return false;} opener.startOrgPopupDrag('${path}')"
        ondragover="event.preventDefault(); this.classList.add('drop-ready')"
        ondragleave="this.classList.remove('drop-ready')"
        ondrop="event.preventDefault(); this.classList.remove('drop-ready'); opener.dropOrgPopupNode('${path}')"
        onclick="opener.selectOrgPopupNode('${path}')">
        <div class="popup-node-top"><span>${displayTitle}</span><small>${path}</small></div>
        <strong>${displayPerson}</strong>
        <em>${meta}</em>
        <div class="popup-node-actions">
          ${emp ? `<button onclick="event.stopPropagation(); opener.openMiniCardPopup('${emp.empNo}')">인사카드</button>` : `<button onclick="event.stopPropagation(); opener.selectOrgPopupNode('${path}')">속성편집</button>`}
        </div>
      </div>

      ${leafChildren.length ? `
        <div class="popup-member-children depth-${depth} count-${leafChildren.length}">
          ${leafChildren.map(({ child, index }) => renderOrgPopupNode(child, `${path}-${index}`, depth + 1)).join("")}
        </div>
      ` : ""}

      ${branchChildren.length ? `
        <div class="popup-branch-children depth-${depth} count-${branchChildren.length}">
          ${branchChildren.map(({ child, index }) => renderOrgPopupNode(child, `${path}-${index}`, depth + 1)).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function buildOrgPopupHtml() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CON-COST 조직도 대형 편집창</title>
<style>
  :root{--bg:#f4f6fb;--panel:#fff;--text:#0f172a;--muted:#64748b;--line:#dbe3ef;--blue:#2563eb;--blue2:#1d4ed8;--red:#dc2626;--shadow:0 16px 46px rgba(15,23,42,.10)}
  *{box-sizing:border-box;margin:0;padding:0} body{font-family:"Pretendard","Noto Sans KR",Arial,sans-serif;background:var(--bg);color:var(--text);overflow:hidden} button,input,select{font-family:inherit}
  .popup-shell{height:100vh;display:grid;grid-template-rows:64px 1fr}
  .popup-top{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:0 20px;background:#fff;border-bottom:1px solid var(--line)}
  .popup-title strong{display:block;font-size:18px}.popup-title span{display:block;margin-top:3px;color:var(--muted);font-size:12px;font-weight:800}.popup-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .btn{border:0;border-radius:13px;padding:10px 14px;font-weight:900;cursor:pointer;background:#fff;color:#334155;border:1px solid var(--line)}.btn-primary{background:var(--blue);color:#fff;border-color:var(--blue)}.btn-danger{background:#fee2e2;color:var(--red);border-color:#fecaca}.btn-dark{background:#0f172a;color:#fff;border-color:#0f172a}.btn:disabled{opacity:.45;cursor:not-allowed}
  .popup-main{display:grid;grid-template-columns:1fr 360px;height:calc(100vh - 64px);min-height:0}.popup-canvas-wrap{min-width:0;min-height:0;display:flex;flex-direction:column;background:#f8fafc}.canvas-head{height:56px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 16px;border-bottom:1px solid var(--line);background:#fff}.tabs{display:flex;gap:7px}.tab{border:1px solid var(--line);background:#fff;border-radius:999px;padding:8px 12px;font-weight:900;cursor:pointer}.tab.active{background:#0f172a;color:#fff;border-color:#0f172a}.guide{font-size:12px;color:var(--muted);font-weight:800}.popup-canvas{position:relative;flex:1;overflow:auto;background-color:#f8fbff;background-image:linear-gradient(#e8eef7 1px,transparent 1px),linear-gradient(90deg,#e8eef7 1px,transparent 1px);background-size:32px 32px;cursor:default}.popup-canvas.ctrl-pan{cursor:grabbing;user-select:none}.popup-tree{display:block;min-width:0;min-height:0;padding:46px 56px;transform-origin:top left}.popup-tree-inner{display:flex;justify-content:center;align-items:flex-start;transform-origin:top left}.popup-node-wrap{display:flex;flex-direction:column;align-items:center;position:relative}.popup-node-children{display:grid;grid-template-columns:repeat(auto-fit,minmax(184px,max-content));align-items:start;justify-content:center;gap:38px 20px;width:min(100%,1380px);padding-top:44px;position:relative}.popup-node-children::before{content:"";position:absolute;top:22px;left:40px;right:40px;height:2px;background:#bfccdc}.popup-node-wrap::before{content:"";position:absolute;top:-22px;width:2px;height:22px;background:#bfccdc}.popup-tree-inner>.popup-node-wrap::before{display:none}.popup-node{width:176px;min-height:116px;background:#fff;border:2px solid #cfe0f6;border-radius:18px;box-shadow:0 10px 24px rgba(15,23,42,.08);padding:12px;cursor:grab;line-height:1.35;transition:.12s}.popup-node:active{cursor:grabbing}.popup-node:hover{border-color:#2563eb;transform:translateY(-1px)}.popup-node.selected{border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.15),0 12px 28px rgba(15,23,42,.11)}.popup-node.drop-ready{outline:4px solid rgba(22,163,74,.22);border-color:#16a34a}.popup-node.primary{background:#1d4ed8;color:#fff;border-color:#1d4ed8}.popup-node.secondary{background:#3b82f6;color:#fff;border-color:#3b82f6}.popup-node.dotted{background:#94a3b8;color:#fff;border-color:#94a3b8}.popup-node-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px}.popup-node-top span{font-size:12px;font-weight:900;color:#1d4ed8}.popup-node.primary .popup-node-top span,.popup-node.secondary .popup-node-top span,.popup-node.dotted .popup-node-top span{color:#fff}.popup-node-top small{font-size:11px;color:#94a3b8;font-weight:900}.popup-node strong{display:block;font-size:15px;font-weight:900;margin-bottom:7px}.popup-node em{display:block;font-style:normal;color:#64748b;font-size:12px;font-weight:900}.popup-node.primary em,.popup-node.secondary em,.popup-node.dotted em{color:rgba(255,255,255,.86)}.popup-node-actions{margin-top:10px}.popup-node-actions button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;font-weight:900;cursor:pointer}.inspector{background:#fff;border-left:1px solid var(--line);padding:18px;overflow:auto}.inspector h3{font-size:12px;color:#2563eb;letter-spacing:1px;margin-bottom:7px}.inspector-title{font-size:20px;font-weight:900;padding-bottom:14px;margin-bottom:16px;border-bottom:1px solid var(--line)}.field{margin-bottom:14px}.field label{display:block;font-size:13px;font-weight:900;margin-bottom:7px;color:#334155}.field input,.field select{width:100%;border:1px solid var(--line);border-radius:14px;padding:12px;background:#fff;font-size:14px;outline:none}.field input:focus,.field select:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.10)}.inspector-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0}.summary{border:1px dashed #cfe0f6;background:#f8fbff;border-radius:16px;padding:13px;line-height:1.75;font-weight:800;color:#475569;font-size:12px}.summary strong{display:block;color:#0f172a;margin-bottom:6px}.summary span{display:block}.help{margin-top:14px;border:1px solid #fed7aa;background:#fff7ed;color:#9a3412;border-radius:16px;padding:12px;font-size:12px;line-height:1.7;font-weight:800}

  .popup-tree-inner.concost-tree{min-width:1550px;justify-content:center;}
  .popup-tree-inner.concost-tree>.popup-node-wrap>.popup-node-children.depth-0{display:flex;justify-content:center;width:100%;}
  .popup-tree-inner.concost-tree .popup-node-children.depth-1{display:grid;grid-template-columns:260px minmax(620px,1fr) 260px 170px;gap:34px;align-items:start;max-width:1480px;width:1480px;}
  .popup-tree-inner.concost-tree .popup-node-children.depth-2{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,max-content));gap:28px 16px;align-items:start;justify-content:center;}
  .popup-tree-inner.concost-tree .popup-node-children.depth-3,
  .popup-tree-inner.concost-tree .popup-node-children.depth-4{display:grid;grid-template-columns:repeat(3,174px);gap:12px 10px;align-items:start;justify-content:center;}
  .popup-tree-inner.concost-tree .depth-2>.popup-node:not(.primary):not(.secondary){background:#eff6ff;}
  .popup-tree-inner.concost-tree .depth-3>.popup-node,
  .popup-tree-inner.concost-tree .depth-4>.popup-node{width:160px;min-height:88px;padding:10px;border-radius:13px;}
  .popup-tree-inner.concost-tree .depth-3>.popup-node strong,
  .popup-tree-inner.concost-tree .depth-4>.popup-node strong{font-size:13px;}
  .popup-tree-inner.concost-tree .depth-3>.popup-node em,
  .popup-tree-inner.concost-tree .depth-4>.popup-node em{font-size:11px;}

  /* 조직도 기준 레이아웃 보정: 직원 노드와 부서 노드를 분리 배치하여 겹침 제거 */
  .popup-tree-inner.concost-tree{min-width:1760px;align-items:flex-start;justify-content:center;}
  .popup-tree-inner.concost-tree .popup-node-wrap{width:max-content;max-width:none;}
  .popup-tree-inner.concost-tree .popup-node-children{display:none;}
  .popup-member-children,.popup-branch-children{position:relative;display:grid;justify-content:center;align-items:start;width:max-content;margin-left:auto;margin-right:auto;}
  .popup-member-children::before,.popup-branch-children::before{content:"";position:absolute;top:18px;left:28px;right:28px;height:2px;background:#bfccdc;}
  .popup-member-children>.popup-node-wrap::before,.popup-branch-children>.popup-node-wrap::before{content:"";position:absolute;top:-22px;width:2px;height:22px;background:#bfccdc;}
  .popup-member-children{grid-template-columns:repeat(1,176px);gap:12px;padding-top:40px;}
  .popup-branch-children{grid-template-columns:repeat(auto-fit,minmax(190px,max-content));gap:34px 24px;padding-top:46px;}
  .popup-tree-inner.concost-tree>.popup-node-wrap>.popup-branch-children.depth-0{display:flex;justify-content:center;}
  .popup-tree-inner.concost-tree>.popup-node-wrap>.popup-branch-children.depth-0::before{display:none;}
  .popup-tree-inner.concost-tree .org-popup-부사장>.popup-branch-children.depth-1{grid-template-columns:300px 820px 260px 190px;gap:40px;align-items:start;}
  .popup-tree-inner.concost-tree .org-popup-경영지원본부>.popup-member-children{grid-template-columns:176px;}
  .popup-tree-inner.concost-tree .org-popup-경영지원본부>.popup-branch-children{grid-template-columns:repeat(2,190px);gap:28px;}
  .popup-tree-inner.concost-tree .org-popup-개발-t-f>.popup-member-children,.popup-tree-inner.concost-tree .org-popup-qc>.popup-member-children{grid-template-columns:176px;}
  .popup-tree-inner.concost-tree .org-popup-기술본부>.popup-branch-children{grid-template-columns:360px 430px;gap:54px;}
  .popup-tree-inner.concost-tree .org-popup-마감>.popup-member-children{grid-template-columns:repeat(3,176px);gap:12px 16px;}
  .popup-tree-inner.concost-tree .org-popup-구조-토목-조경>.popup-branch-children{grid-template-columns:repeat(3,190px);gap:24px;}
  .popup-tree-inner.concost-tree .org-popup-구조팀>.popup-member-children,.popup-tree-inner.concost-tree .org-popup-bim-파트>.popup-member-children,.popup-tree-inner.concost-tree .org-popup-토목-조경파트>.popup-member-children{grid-template-columns:176px;}
  .popup-tree-inner.concost-tree .org-popup-클레임센터>.popup-member-children{grid-template-columns:176px;}
  .popup-tree-inner.concost-tree .org-popup-공사비닷컴{padding-top:44px;}
  .popup-tree-inner.concost-tree .popup-member-children .popup-node{width:176px;min-height:94px;padding:10px 12px;border-radius:14px;}
  .popup-tree-inner.concost-tree .popup-member-children .popup-node strong{font-size:13px;}
  .popup-tree-inner.concost-tree .popup-member-children .popup-node em{font-size:11px;}
  .popup-tree-inner.concost-tree .popup-node-wrap .popup-node-wrap{margin:0;}

</style>
</head>
<body>
  <div class="popup-shell">
    <header class="popup-top">
      <div class="popup-title"><strong>조직도 대형 편집창</strong><span>노드 선택 · 드래그 이동 · 직원 연결 · 인사카드 연동</span></div>
      <div class="popup-actions">
        <button class="btn" onclick="opener.addOrgChildNodeFromPopup()">+ 하위 노드</button>
        <button class="btn" onclick="opener.addOrgSiblingNodeFromPopup()">+ 같은 단계</button>
        <button class="btn" onclick="opener.moveOrgNodeFromPopup(-1)">← 순서</button>
        <button class="btn" onclick="opener.moveOrgNodeFromPopup(1)">순서 →</button>
        <button class="btn" onclick="opener.fitOrgPopupToView(true)">화면맞춤</button>
        <button class="btn" onclick="opener.zoomOrgPopup(-0.1)">-</button>
        <button class="btn" onclick="opener.zoomOrgPopup(0.1)">+</button>
        <button class="btn btn-danger" onclick="opener.deleteOrgNodeFromPopup()">삭제</button>
        <button class="btn btn-primary" onclick="opener.saveOrgVisualEditor()">저장</button>
      </div>
    </header>
    <main class="popup-main">
      <section class="popup-canvas-wrap">
        <div class="canvas-head">
          <div class="tabs">
            <button id="popupTabConcost" class="tab" onclick="opener.switchOrgPopupCompany('CON-COST')">CON-COST</button>
            <button id="popupTabVietqs" class="tab" onclick="opener.switchOrgPopupCompany('Viet QS')">Viet QS</button>
          </div>
          <div class="guide">Ctrl + 좌클릭 드래그로 캔버스를 이동합니다. 노드는 다른 노드 위로 드래그하면 하위 조직으로 이동합니다.</div>
        </div>
        <div class="popup-canvas" id="popupCanvas"><div class="popup-tree" id="popupTree"></div></div>
      </section>
      <aside class="inspector">
        <h3>NODE INSPECTOR</h3>
        <div class="inspector-title" id="popupInspectorTitle">선택 노드 없음</div>
        <div class="field"><label>조직/직책명</label><input id="popupNodeTitleInput" oninput="opener.updateSelectedOrgNodeFieldFromPopup('title', this.value)" /></div>
        <div class="field"><label>연결 직원</label><select id="popupNodeEmployeeSelect" onchange="opener.updateSelectedOrgNodeFieldFromPopup('employeeId', this.value)"></select></div>
        <div class="field"><label>상위 조직 변경</label><select id="popupNodeParentSelect" onchange="opener.changeSelectedOrgParentFromPopup(this.value)"></select></div>
        <div class="field"><label>표시 타입</label><select id="popupNodeClassSelect" onchange="opener.updateSelectedOrgNodeFieldFromPopup('className', this.value)"><option value="">일반</option><option value="primary">대표/최상위</option><option value="secondary">임원/상위</option><option value="dotted">외부/참조</option></select></div>
        <div class="inspector-actions"><button class="btn" onclick="opener.openSelectedOrgEmployeeCard()">인사카드 열기</button><button class="btn btn-dark" onclick="opener.renderOrgVisualEditorPopup()">변경 반영</button></div>
        <div class="summary" id="popupNodeSummary">좌측 캔버스에서 편집할 조직 또는 직원을 선택하세요.</div>
        <div class="help">부서 추가는 ‘+ 하위 노드’ 또는 ‘+ 같은 단계’를 사용합니다. 캔버스 이동은 Ctrl + 좌클릭 드래그, 조직 이동은 노드 드래그 앤 드롭을 사용합니다.</div>
      </aside>
    </main>
  </div>

<script>
(function(){
  let isPanning=false;
  let startX=0, startY=0, startLeft=0, startTop=0;
  function getCanvas(){return document.getElementById('popupCanvas');}
  document.addEventListener('mousedown', function(e){
    const canvas=getCanvas();
    if(!canvas || !e.ctrlKey || e.button !== 0 || !canvas.contains(e.target)) return;
    isPanning=true;
    startX=e.clientX; startY=e.clientY;
    startLeft=canvas.scrollLeft; startTop=canvas.scrollTop;
    canvas.classList.add('ctrl-pan');
    e.preventDefault();
  }, true);
  document.addEventListener('mousemove', function(e){
    if(!isPanning) return;
    const canvas=getCanvas();
    canvas.scrollLeft = startLeft - (e.clientX - startX);
    canvas.scrollTop = startTop - (e.clientY - startY);
    e.preventDefault();
  }, true);
  document.addEventListener('mouseup', function(){
    if(!isPanning) return;
    isPanning=false;
    const canvas=getCanvas();
    if(canvas) canvas.classList.remove('ctrl-pan');
  }, true);
  document.addEventListener('dragstart', function(e){
    if(e.ctrlKey) e.preventDefault();
  }, true);
})();
</script>
</body>
</html>`;
}

function openOrgVisualEditorWindow() {
  orgEditorPopupAutoFit = true;
  orgEditorPopupWindow = window.open("", "CONCOST_ORG_VISUAL_EDITOR", "width=1900,height=1050,left=40,top=20,resizable=yes,scrollbars=yes");
  if (!orgEditorPopupWindow) return showToast("팝업이 차단되었습니다. 브라우저 팝업 허용 후 다시 실행해 주세요.");
  orgEditorPopupWindow.document.open();
  orgEditorPopupWindow.document.write(buildOrgPopupHtml());
  orgEditorPopupWindow.document.close();
  orgEditorPopupWindow.opener = window;
  setTimeout(() => renderOrgVisualEditorPopup(), 50);
}

function renderOrgVisualEditorPopup() {
  const win = orgEditorPopupWindow;
  if (!win || win.closed) return;
  const doc = win.document;
  const data = orgStructures[currentOrgEditorCompany];
  if (!data) return;
  if (!getOrgNodeByPath(selectedOrgNodePath, currentOrgEditorCompany)) selectedOrgNodePath = "0";

  const tree = doc.getElementById("popupTree");
  if (tree) {
    tree.innerHTML = `<div class="popup-tree-inner ${currentOrgEditorCompany === "CON-COST" ? "concost-tree" : "vietqs-tree"}">${renderOrgPopupNode(data.root, "0", 0)}</div>`;
    applyOrgPopupScale();
    if (orgEditorPopupAutoFit) {
      win.requestAnimationFrame(() => fitOrgPopupToView(false));
    }
  }

  doc.getElementById("popupTabConcost")?.classList.toggle("active", currentOrgEditorCompany === "CON-COST");
  doc.getElementById("popupTabVietqs")?.classList.toggle("active", currentOrgEditorCompany === "Viet QS");
  updateOrgPopupInspector();
}

function applyOrgPopupScale() {
  const win = orgEditorPopupWindow;
  if (!win || win.closed) return;
  const doc = win.document;
  const tree = doc.getElementById("popupTree");
  const inner = tree?.querySelector(".popup-tree-inner");
  if (!tree || !inner) return;

  const scale = Number(orgEditorPopupZoom.toFixed(3));
  inner.style.transform = `scale(${scale})`;
  const baseWidth = Math.max(inner.scrollWidth || inner.offsetWidth || 0, 1);
  const baseHeight = Math.max(inner.scrollHeight || inner.offsetHeight || 0, 1);
  tree.style.width = `${Math.ceil(baseWidth * scale + 96)}px`;
  tree.style.height = `${Math.ceil(baseHeight * scale + 96)}px`;
  tree.style.transform = "none";
}

function fitOrgPopupToView(force = false) {
  const win = orgEditorPopupWindow;
  if (!win || win.closed) return;
  const doc = win.document;
  const canvas = doc.getElementById("popupCanvas");
  const tree = doc.getElementById("popupTree");
  const inner = tree?.querySelector(".popup-tree-inner");
  if (!canvas || !tree || !inner) return;

  if (force) orgEditorPopupAutoFit = true;

  inner.style.transform = "scale(1)";
  tree.style.width = "auto";
  tree.style.height = "auto";

  const baseWidth = Math.max(inner.scrollWidth || inner.offsetWidth || 1, 1);
  const baseHeight = Math.max(inner.scrollHeight || inner.offsetHeight || 1, 1);
  const availableWidth = Math.max(canvas.clientWidth - 112, 360);
  const availableHeight = Math.max(canvas.clientHeight - 112, 360);
  const nextScale = Math.min(1, availableWidth / baseWidth, availableHeight / baseHeight);

  orgEditorPopupZoom = Math.max(0.32, Math.min(1, Number(nextScale.toFixed(3))));
  applyOrgPopupScale();
  canvas.scrollLeft = Math.max(0, (tree.scrollWidth - canvas.clientWidth) / 2);
  canvas.scrollTop = 0;
}
function updateOrgPopupInspector() {
  const win = orgEditorPopupWindow;
  if (!win || win.closed) return;
  const doc = win.document;
  const node = getOrgNodeByPath(selectedOrgNodePath);
  if (!node) return;
  const { emp, title, name } = orgNodeLabel(node);

  const inspectorTitle = doc.getElementById("popupInspectorTitle");
  const titleInput = doc.getElementById("popupNodeTitleInput");
  const employeeSelect = doc.getElementById("popupNodeEmployeeSelect");
  const parentSelect = doc.getElementById("popupNodeParentSelect");
  const classSelect = doc.getElementById("popupNodeClassSelect");
  const summary = doc.getElementById("popupNodeSummary");

  if (inspectorTitle) inspectorTitle.textContent = name || title || "조직 노드";
  if (titleInput) titleInput.value = node.title || "";
  if (employeeSelect) employeeSelect.innerHTML = renderOrgPopupEmployeeOptions(node.employeeId || "");
  if (parentSelect) {
    parentSelect.innerHTML = selectedOrgNodePath === "0"
      ? `<option value="">최상위 노드는 상위조직 변경 불가</option>`
      : renderOrgPopupParentOptions(selectedOrgNodePath);
    parentSelect.disabled = selectedOrgNodePath === "0";
  }
  if (classSelect) classSelect.value = node.className || "";
  if (summary) {
    summary.innerHTML = `
      <strong>현재 선택 노드</strong>
      <span>회사: ${currentOrgEditorCompany}</span>
      <span>조직/직책: ${title || "-"}</span>
      <span>연결 직원: ${emp ? `${displayName(emp)} (${emp.empNo})` : "미연결"}</span>
      <span>하위 노드: ${(node.children || []).length}개</span>
      <span>경로: ${selectedOrgNodePath}</span>
    `;
  }
}

function selectOrgPopupNode(path) {
  selectedOrgNodePath = path;
  renderOrgVisualEditor();
  renderOrgVisualEditorPopup();
}

function startOrgPopupDrag(path) {
  orgEditorDragSourcePath = path;
}

function dropOrgPopupNode(targetPath) {
  moveOrgNodeToParentByDrag(orgEditorDragSourcePath, targetPath);
  orgEditorDragSourcePath = null;
}

function switchOrgPopupCompany(company) {
  currentOrgEditorCompany = company;
  currentOrgCompany = company;
  selectedOrgNodePath = "0";
  orgEditorPopupAutoFit = true;
  renderOrgVisualEditor();
  renderOrgVisualEditorPopup();
}

function updateSelectedOrgNodeFieldFromPopup(field, value) {
  updateSelectedOrgNodeField(field, value);
  renderOrgVisualEditorPopup();
}

function changeSelectedOrgParentFromPopup(value) {
  changeSelectedOrgParent(value);
  renderOrgVisualEditorPopup();
}

function addOrgChildNodeFromPopup() {
  addOrgChildNode();
  renderOrgVisualEditorPopup();
}

function addOrgSiblingNodeFromPopup() {
  addOrgSiblingNode();
  renderOrgVisualEditorPopup();
}

function moveOrgNodeFromPopup(direction) {
  moveOrgNode(direction);
  renderOrgVisualEditorPopup();
}

function deleteOrgNodeFromPopup() {
  deleteOrgNode();
  renderOrgVisualEditorPopup();
}

function zoomOrgPopup(delta) {
  orgEditorPopupAutoFit = false;
  orgEditorPopupZoom = Math.max(0.22, Math.min(1.6, Number((orgEditorPopupZoom + delta).toFixed(2))));
  renderOrgVisualEditorPopup();
}


function openOrgChart() {
  document.getElementById("orgChartModal")?.classList.add("active");
  renderOrgChart(currentOrgCompany);
}

function closeOrgChart() {
  document.getElementById("orgChartModal")?.classList.remove("active");
}

function openMiniCardPopup(empNo) {
  const emp = employees.find(e => e.empNo === empNo);
  if (!emp) return;

  setText("miniPopupPhoto", displayName(emp)[0]);
  setText("miniPopupName", displayName(emp));
  setText("miniPopupCompany", emp.company);
  setText("miniPopupDept", emp.dept);
  setText("miniPopupGrade", emp.grade);
  setText("miniPopupEmail", emp.email);
  setText("miniPopupPhone", emp.phone);
  setText("miniPopupWorkplace", emp.workplace);

  const tags = document.getElementById("miniPopupTags");
  if (tags) {
    tags.innerHTML = `
      ${companyBadge(emp.company)}
      <span class="badge blue">${emp.dept}</span>
      <span class="badge gray">${emp.grade}</span>
      ${statusBadge(emp.status)}
    `;
  }

  document.getElementById("miniCardModal")?.classList.add("active");
}

function closeMiniCardPopup() {
  document.getElementById("miniCardModal")?.classList.remove("active");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("active");
  setTimeout(() => toast.classList.remove("active"), 2200);
}

function formatPhoneByCountry(value, country) {
  const digits = value.replace(/\D/g, "");

  if (country === "VN") {
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7, 10)}`;
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

function bindPhoneFormatter(inputSelector, countrySelector) {
  const input = document.querySelector(inputSelector);
  const country = document.querySelector(countrySelector);
  if (!input || !country) return;

  input.addEventListener("input", () => {
    input.value = formatPhoneByCountry(input.value, country.value);
  });

  country.addEventListener("change", () => {
    input.value = "";
    input.placeholder = country.value === "VN" ? "0987-654-321" : "010-1234-5678";
  });
}

function formatNationalId(value, country) {
  const digits = value.replace(/\D/g, "");
  if (country === "VN") return digits.slice(0, 13);
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 6)}-${digits.slice(6, 13)}`;
}

function bindNationalIdFormatter() {
  const input = document.getElementById("nationalId");
  const country = document.getElementById("idCountry");
  if (!input || !country) return;

  input.addEventListener("input", () => {
    input.value = formatNationalId(input.value, country.value);
  });

  country.addEventListener("change", () => {
    input.value = "";
    input.placeholder = country.value === "VN" ? "0792123456123" : "990301-1111111";
  });
}

document.addEventListener("click", e => {
  const employeeModal = document.getElementById("employeeModal");
  const permissionModal = document.getElementById("permissionModal");
  const excelModal = document.getElementById("excelModal");
  const orgChartModal = document.getElementById("orgChartModal");
  const miniCardModal = document.getElementById("miniCardModal");

  if (e.target === employeeModal) closeModal();
  if (e.target === permissionModal) closePermissionModal();
  if (e.target === excelModal) closeExcelModal();
  if (e.target === orgChartModal) closeOrgChart();
  if (e.target === miniCardModal) closeMiniCardPopup();
});

document.querySelectorAll(".switch-toggle input").forEach(toggle => {
  toggle.addEventListener("change", () => {
    showToast("관리자 설정값이 변경되었습니다. 저장 버튼을 눌러 반영하세요.");
  });
});

document.querySelectorAll(".permission-field, .permission-text, .permission-card").forEach(el => {
  el.addEventListener("click", openPermissionModal);
});

const ledgerSearch = document.getElementById("ledgerSearch");
if (ledgerSearch) {
  ledgerSearch.addEventListener("input", e => {
    renderLedger(filterEmployees(e.target.value));
  });
}

["companyFilter", "deptFilter", "gradeFilter", "statusFilter", "yearFilter"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", () => applyLedgerFilters(false));
});

const employeeSearch = document.getElementById("employeeSearch");
if (employeeSearch) {
  employeeSearch.addEventListener("input", e => {
    renderEmployeeList(filterEmployeesForList(e.target.value));
  });
}

bindPhoneFormatter("#phoneInput", "#phoneCountry");
bindPhoneFormatter(".modal-phone-input", ".modal-phone-country");
bindNationalIdFormatter();

renderKpis();
renderLedger(filterEmployees(""));
renderEmployeeList();
renderAnalysis();
renderAssetLedger();
renderPermissionRows();
renderOrderRows();
renderOrgEditor();
selectEmployee("EMP-2018-001");

/* =========================
   업무관리 탭 / QC 체크리스트
   ========================= */
const workPageMeta = {
  projectReceive: ["프로젝트 접수", "해당 업무관리 카테고리는 화면 준비 영역입니다."],
  pmSchedule: ["PM 배정 / 일정", "해당 업무관리 카테고리는 화면 준비 영역입니다."],
  quantityChecklist: ["프로젝트 질의응답 관리", "수량산출 체크리스트, 체크리스트 검토, 이의제기, 오류 소거, 최종 수량 검토를 한 화면에서 관리합니다."],
  qcReview: ["프로젝트 질의응답 관리", "수량산출 체크리스트, 체크리스트 검토, 이의제기, 오류 소거, 최종 수량 검토를 한 화면에서 관리합니다."],
  estimateCondition: ["견적조건 작성", "해당 업무관리 카테고리는 화면 준비 영역입니다."],
  deliveryData: ["납품 및 데이터관리", "해당 업무관리 카테고리는 화면 준비 영역입니다."],
  dailyReport: ["업무일지 / 진행률", "해당 업무관리 카테고리는 화면 준비 영역입니다."]
};


const checklistCategoryOptions = [
  "프로젝트 수주 시점(PM,작업자,발주처 송부용)",
  "QC팀 전달사항(유형 및 특이사항 관리)",
  "작업 착수 전 확인 필요사항(PM)",
  "작업 진행 중 추가 전달사항(PM)",
  "자가검토 체크리스트(QC)",
  "제출자료 검토사항(PM)",
  "최종자료 검토사항(QC)",
  "Z1. 질의사항(1차)",
  "Z2. 질의사항(2차)",
  "Z3. 질의사항(3차)",
  "Z4. 질의사항(4차)",
  "Z5. 질의사항(5차)",
  "Z6. 질의사항(6차)",
  "Z7. 견적조건(최종)"
];


let selectedChecklistCategoryFilter = "전체";
const checklistCategoryAliases = {
  "프로젝트 수주시": "프로젝트 수주 시점(PM,작업자,발주처 송부용)",
  "프로젝트 수주 시": "프로젝트 수주 시점(PM,작업자,발주처 송부용)",
  "프로젝트 초기": "작업 착수 전 확인 필요사항(PM)",
  "기초 산출 담당자": "작업 착수 전 확인 필요사항(PM)",
  "전체 공통": "자가검토 체크리스트(QC)",
  "기둥": "자가검토 체크리스트(QC)",
  "기초": "제출자료 검토사항(PM)",
  "보": "제출자료 검토사항(PM)",
  "슬라브": "제출자료 검토사항(PM)",
  "옹벽": "제출자료 검토사항(PM)"
};

const questionCategories = checklistCategoryOptions.filter(category => category.startsWith("Z") && category.includes("질의사항"));
const checklistSentCategories = new Set();
const firstCategoryName = checklistCategoryOptions[0];

function normalizeChecklistGroupName(group) {
  const value = String(group || "").trim();
  return checklistCategoryAliases[value] || value || firstCategoryName;
}

function getQuestionCategoryIndex(category) {
  return questionCategories.indexOf(category);
}

function isQuestionCategory(category) {
  return questionCategories.includes(category);
}

function isChecklistCategoryLocked(category) {
  return checklistSentCategories.has(category);
}

function canUseChecklistCategory(category, currentGroup = "") {
  category = normalizeChecklistGroupName(category);
  currentGroup = normalizeChecklistGroupName(currentGroup);
  if (!category) return false;
  if (category === currentGroup) return true;
  if (isChecklistCategoryLocked(category)) return false;
  const idx = getQuestionCategoryIndex(category);
  if (idx <= 0) return true;
  return checklistSentCategories.has(questionCategories[idx - 1]);
}

function getNextQuestionCategory(category) {
  const idx = getQuestionCategoryIndex(category);
  if (idx >= 0 && idx < questionCategories.length - 1) return questionCategories[idx + 1];
  return "";
}

let checklistRows = [
  {
    "group": "프로젝트 수주 시점(PM,작업자,발주처 송부용)",
    "trade": "계약",
    "no": "001",
    "item": "프로젝트 업무 특성 파악\n(구조선수행, 입찰, 본실행,\n설계내역 등)",
    "method": "접수자료 확인. 특이사항 작성 후 프로젝트\nPM 전달",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "프로젝트 수주 시점(PM,작업자,발주처 송부용)",
    "trade": "접수자료",
    "no": "002",
    "item": "입찰 내역서, 산출기준서, 공사\n특기사항 접수 파악",
    "method": "접수자료 확인. 특이사항 작성 후 프로젝트\nPM 전달",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "프로젝트 수주 시점(PM,작업자,발주처 송부용)",
    "trade": "도면검토",
    "no": "003",
    "item": "도면 접수 여부 확인 (구조 / 건축 /\n토목)",
    "method": "도면목록표와 접수 도면상 일치 확인",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "프로젝트 수주 시점(PM,작업자,발주처 송부용)",
    "trade": "접수자료",
    "no": "004",
    "item": "내역서, 산출서, 기준서 접수 여부\n확인",
    "method": "내역서, 산출서, 기준서 파일 수신 여부 확인",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "QC팀 전달사항(유형 및 특이사항 관리)",
    "trade": "프로젝트\n유형",
    "no": "005",
    "item": "프로젝트 유형 파악 (입찰 / 본실행\n/ 구조선수행 등)",
    "method": "계약방식과 발주처 요청사항 기준으로 유형\n분류",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "QC팀 전달사항(유형 및 특이사항 관리)",
    "trade": "토공사",
    "no": "008",
    "item": "토공사 산출유무 확인",
    "method": "토목팀 투입 유무 확인 및 건축터파기 산출\n여부 협의",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "QC팀 전달사항(유형 및 특이사항 관리)",
    "trade": "합벽",
    "no": "009",
    "item": "합벽유무 및 합벽구간 추가이음\n발생 여부 확인",
    "method": "토목도면 흙막이 또는 가시설계획도 확인",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "QC팀 전달사항(유형 및 특이사항 관리)",
    "trade": "도면목록표",
    "no": "019",
    "item": "도면목록표와 도서가 일치하는지\n확인",
    "method": "PM과 산출 담당자 모두 도면 누락본 확인할\n것",
    "owner": "PM, 산출 담당자",
    "targets": [
      "PM",
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 18:25",
    "comment": "누락본이 있을 시 질의사항 작성 바랍니다.",
    "attachments": [],
    "checks": [
      {
        "target": "PM",
        "done": true,
        "checkedBy": "박용진 수석",
        "checkedAt": "2026-04-29 18:25"
      },
      {
        "target": "산출 담당자",
        "done": true,
        "checkedBy": "박용진 수석",
        "checkedAt": "2026-04-29 18:25"
      }
    ],
    "history": [
      {
        "action": "확인완료(PM)",
        "worker": "박용진 수석",
        "time": "2026-04-29 18:25"
      },
      {
        "action": "확인완료(산출 담당자)",
        "worker": "박용진 수석",
        "time": "2026-04-29 18:25"
      },
      {
        "action": "최초작성",
        "worker": "QC TEAM",
        "time": "2026-04-29 18:25"
      }
    ]
  },
  {
    "group": "작업 착수 전 확인 필요사항(PM)",
    "trade": "특이사항",
    "no": "006",
    "item": "프로젝트별 특이사항 확인 및 정리",
    "method": "정리 완료 후 내부 PM 및 외부 발주처\n담당자에게 동시 발송",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "작업 착수 전 확인 필요사항(PM)",
    "trade": "파일공사",
    "no": "007",
    "item": "파일길이 및 항타장비, 동재하\n정재하 시험횟수 확인",
    "method": "지질조서도 확인",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "작업 착수 전 확인 필요사항(PM)",
    "trade": "끊어치기",
    "no": "010",
    "item": "끊어치기(C.J Joint) 구간 확인",
    "method": "발주처 및 건설사 질의사항 작성. Zoning 및\n분할타설 계획도 요청",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "작업 진행 중 추가 전달사항(PM)",
    "trade": "철근\n규격\n변경",
    "no": "020",
    "item": "데크 슬라브 구분이 필요하여 H-\nBAR → D-BAR 구분 필요",
    "method": "데크슬라브 철근만 D-BAR로 구분 바랍니다.",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 18:26",
    "comment": "만약 이음 값이 데이터에 입력되지 않았다면 질의 바랍니다.",
    "attachments": []
  },
  {
    "group": "작업 진행 중 추가 전달사항(PM)",
    "trade": "띠장\n이음",
    "no": "021",
    "item": "띠장구간 이음1회 추가",
    "method": "띠장 도면 참조하여 띠장이 걸리는 구간은 1회\n이음을 추가 해 주세요",
    "owner": "산출 담당자",
    "targets": [
      "PM"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 18:27",
    "comment": "",
    "attachments": []
  },
  {
    "group": "자가검토 체크리스트(QC)",
    "trade": "커플러",
    "no": "011",
    "item": "커플러 산출기준 확인",
    "method": "건설사별 견적지침서 확인. 별도 표현 없음 시\n담당자 확인",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "자가검토 체크리스트(QC)",
    "trade": "철근강도",
    "no": "012",
    "item": "철근 강도에 따른 정착/이음값 오류\n확인",
    "method": "구조일반사항 및 구조계산서 검토",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "자가검토 체크리스트(QC)",
    "trade": "내진철근",
    "no": "013",
    "item": "내진철근 적용 유무 확인",
    "method": "SD400S, SD500S, SD600S 등의 표현 유무\n확인",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "자가검토 체크리스트(QC)",
    "trade": "기둥",
    "no": "015",
    "item": "기초두께 입력시 이음 산출 유무\n확인",
    "method": "산출식 확인 후 기초두께 입력 시 주근 이음\n산출 여부 검토",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "제출자료 검토사항(PM)",
    "trade": "기초",
    "no": "014",
    "item": "버림두께 확인",
    "method": "건축단면도 기준 적용. 미표현 시 60mm 적용",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "제출자료 검토사항(PM)",
    "trade": "보",
    "no": "016",
    "item": "각 층별 슬라브 두께별 공제 확인",
    "method": "산출내용 재확인",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "제출자료 검토사항(PM)",
    "trade": "슬라브",
    "no": "017",
    "item": "부호별 데크타입 오류 확인",
    "method": "RC 평면자료를 Excel 변환 후 필터로\n데크부호별 코드입력 체크",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "제출자료 검토사항(PM)",
    "trade": "옹벽",
    "no": "018",
    "item": "옹벽 상부 슬라브 또는 보 공제값\n오류 체크",
    "method": "RC 프로그램 산식 확인",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 09:00",
    "comment": "",
    "attachments": []
  },
  {
    "group": "제출자료 검토사항(PM)",
    "trade": "보",
    "no": "022",
    "item": "B2G1 늑근 간격 150mm가 아닌\n300mm로 잘못 산출 됨",
    "method": "배근의 전반적인 검토가 필요함.",
    "owner": "산출 담당자",
    "targets": [
      "산출 담당자"
    ],
    "creator": "PM",
    "createdAt": "2026-04-29 18:29",
    "comment": "",
    "attachments": []
  },
  {
    "group": "최종자료 검토사항(QC)",
    "trade": "계수",
    "no": "023",
    "item": "유사 프로젝트 대비 콘크리트 계수\n확인",
    "method": "비슷한 형태의 프로젝트를 찾아 콘크리트\n계수가 비슷한지 확인 해 주세요",
    "owner": "PM, 산출 담당자",
    "targets": [
      "PM",
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 18:32",
    "comment": "",
    "attachments": []
  },
  {
    "group": "최종자료 검토사항(QC)",
    "trade": "계수",
    "no": "024",
    "item": "유사프로젝트 거푸집 계수 검토",
    "method": "비슷한 형식의 프로젝트를 찾아 거푸집 계수\n확인을 해 주세요",
    "owner": "PM, 산출 담당자",
    "targets": [
      "PM",
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 18:32",
    "comment": "",
    "attachments": []
  },
  {
    "group": "최종자료 검토사항(QC)",
    "trade": "계수",
    "no": "025",
    "item": "유사 프로젝트 대비 철근 계수 검토",
    "method": "비슷한 유형의 프로젝트를 찾아서 계수 검토\n해 주세요",
    "owner": "PM, 산출 담당자",
    "targets": [
      "PM",
      "산출 담당자"
    ],
    "creator": "QC TEAM",
    "createdAt": "2026-04-29 18:33",
    "comment": "",
    "attachments": []
  },
  {
    "group": "Z1. 질의사항(1차)",
    "trade": "동구분",
    "no": "026",
    "item": "구조 작업 상 실 구분으로 이뤄진\n경우 하나의 동으로 포함 산출\n※ APT\n- 주동부 지상(6401~6405 각\n동별 산출)\n- 주동부 PIT(6401~6405 각\n동별 산출)\n※ 주차장\n- 주차장+기계실\n※ 부대시설\n- 경로당\n- 어린이집\n- 다함께돌봄센터+작은도서관\n- 지역편의시설1+2+피트니스\n- 지역편의시설3\n- 자원봉사관+관리사무소\n- 게스트하우스+파티룸\n- 경비실1+키즈스테이션+문주\n- 경비실2\n- 근린생활시설",
    "method": "동 구분 확인 후 반영 예정",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "PM",
    "createdAt": "2026-04-30 09:51",
    "comment": "발주처 우선 송부 필요",
    "attachments": []
  },
  {
    "group": "Z1. 질의사항(1차)",
    "trade": "동바리",
    "no": "027",
    "item": "기준서 기준에 따르면 전이보를\n포함한 높이를 시스템으로\n작업하는 것으로 보이는데, 아래와\n같은 경우 산출기준 확인\n바랍니다.\n① 빨간색 영역 전체(전이보 밑면\n중복 계산)를 시스템(5.85m)산출\n② 보밑면 면적(초록색)무시하고\n빨간색 영역 전체 시스템(5.85m)\n산출\n③ 초록색 영역을 제외한 나머지\n영역 5.85m, 초록색 하부 5.15m\n상부 공간(빨간색 걸침영역)\n강관 산출",
    "method": "답변 후 적용",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "산출 담당자",
    "createdAt": "2026-04-30 09:53",
    "comment": "",
    "attachments": [
      {
        "name": "동바리_질의첨부.png",
        "dataUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMjQwIDE4MCI+CiAgPHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxODAiIHJ4PSIxOCIgZmlsbD0iIzBmMTcyYSIvPgogIDxyZWN0IHg9IjE4IiB5PSIxOCIgd2lkdGg9IjIwNCIgaGVpZ2h0PSIxNDQiIHJ4PSIxMiIgZmlsbD0iIzExMTgyNyIgc3Ryb2tlPSIjMjU2M2ViIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8dGV4dCB4PSIxMjAiIHk9IjgyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNmZmZmZmYiPuuPmeuwlOumrDwvdGV4dD4KICA8dGV4dCB4PSIxMjAiIHk9IjExMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjOTNjNWZkIj7sp4jsnZgg7LKo67aAPC90ZXh0Pgo8L3N2Zz4=",
        "addedBy": "산출 담당자",
        "addedAt": "2026-04-30 09:53"
      }
    ]
  },
  {
    "group": "Z7. 견적조건(최종)",
    "trade": "옥탑장식물",
    "no": "028",
    "item": "옥탑장식물 표기가 건축입면도 외\n확인이 되지 않습니다.\n옥탑장식물에 대한 도면 제공이\n가능한지 확인 바랍니다.",
    "method": "우선 임의 반영.",
    "owner": "PM",
    "targets": [
      "PM"
    ],
    "creator": "산출 담당자",
    "createdAt": "2026-04-30 10:01",
    "comment": "",
    "attachments": [
      {
        "name": "옥탑장식물_견적조건첨부.png",
        "dataUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMjQwIDE4MCI+CiAgPHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxODAiIHJ4PSIxOCIgZmlsbD0iIzBmMTcyYSIvPgogIDxyZWN0IHg9IjE4IiB5PSIxOCIgd2lkdGg9IjIwNCIgaGVpZ2h0PSIxNDQiIHJ4PSIxMiIgZmlsbD0iIzExMTgyNyIgc3Ryb2tlPSIjMjU2M2ViIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8dGV4dCB4PSIxMjAiIHk9IjgyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNmZmZmZmYiPuyYpe2DkeyepeyLneusvDwvdGV4dD4KICA8dGV4dCB4PSIxMjAiIHk9IjExMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjOTNjNWZkIj7qsqzsoIHsobDqsbQg7LKo67aAPC90ZXh0Pgo8L3N2Zz4=",
        "addedBy": "산출 담당자",
        "addedAt": "2026-04-30 10:01"
      }
    ]
  }
];
// QC 체크리스트 더미데이터가 기존 브라우저 저장값에 덮이지 않도록 초기 표시용 저장값만 제거
try {
  localStorage.removeItem("qcChecklistRows");
  localStorage.removeItem("checklistRows");
  localStorage.removeItem("workQcChecklistRows");
} catch (e) {}


const checklistStatuses = ["진행전", "진행중", "확인완료", "PM 검토", "수정요청", "최종완료"];
const checklistOwners = ["QC TEAM", "PM", "산출 담당자", "실장", "경영지원"];

function switchTopModule(moduleName) {
  document.querySelectorAll(".module-view").forEach(view => view.classList.remove("active"));
  document.querySelectorAll("[data-module-tab]").forEach(tab => tab.classList.remove("active"));

  const support = document.getElementById("supportModule");
  const work = document.getElementById("workModule");

  if (moduleName === "work") {
    work?.classList.add("active");
    document.querySelector('[data-module-tab="work"]')?.classList.add("active");

    const activeWork = document.querySelector("[data-work-main].active");
    switchWorkPanel(activeWork?.dataset.workMain || "projectReceive");
  } else {
    support?.classList.add("active");
    document.querySelector('[data-module-tab="support"]')?.classList.add("active");
  }
}

function switchWorkPanel(panelId) {
  const targetPanelId = panelId || "projectReceive";

  document.querySelectorAll(".work-panel").forEach(panel => panel.classList.remove("active"));
  document.querySelectorAll("[data-work-main]").forEach(btn => btn.classList.remove("active"));

  document.getElementById(targetPanelId)?.classList.add("active");
  document.querySelector(`[data-work-main="${targetPanelId}"]`)?.classList.add("active");

  const meta = workPageMeta[targetPanelId] || workPageMeta.projectReceive;
  setText("workPageTitle", meta[0]);
  setText("workPageDesc", meta[1]);

  if (targetPanelId === "qcReview" || targetPanelId === "quantityChecklist") {
    renderChecklistCategoryButtons();
    renderChecklistGrid();
  }
}


function getChecklistCreatorByGroup(group) {
  const normalized = normalizeChecklistGroupName(group);
  const creatorMap = {
    "프로젝트 수주 시점(PM,작업자,발주처 송부용)": "QC TEAM",
    "QC팀 전달사항(유형 및 특이사항 관리)": "QC TEAM",
    "작업 착수 전 확인 필요사항(PM)": "PM",
    "작업 진행 중 추가 전달사항(PM)": "PM",
    "자가검토 체크리스트(QC)": "QC TEAM",
    "제출자료 검토사항(PM)": "PM",
    "최종자료 검토사항(QC)": "QC TEAM"
  };
  return creatorMap[normalized] || "경영지원";
}

function getChecklistTargetsByGroup(group) {
  const normalized = normalizeChecklistGroupName(group);
  const targetMap = {
    "프로젝트 수주 시점(PM,작업자,발주처 송부용)": ["PM"],
    "작업 착수 전 확인 필요사항(PM)": ["산출 담당자"],
    "자가검토 체크리스트(QC)": ["산출 담당자"],
    "제출자료 검토사항(PM)": ["산출 담당자"]
  };
  return targetMap[normalized] || null;
}

function isObjectionAllowedRow(row) {
  return normalizeChecklistGroupName(row?.group) === "제출자료 검토사항(PM)";
}

function ensureChecklistAttachments(row) {
  if (!Array.isArray(row.attachments)) row.attachments = [];
  if (!Array.isArray(row.objectionFiles)) row.objectionFiles = [];
}

function renderChecklistAttachmentCell(row, realIndex) {
  ensureChecklistAttachments(row);
  const attachments = Array.isArray(row.attachments) ? row.attachments : [];

  if (!attachments.length) {
    return `<div class="attachment-cell readonly-attachment-cell"><div class="attach-count">첨부 없음</div></div>`;
  }

  const thumbs = attachments.map((file, idx) => {
    const src = getAttachmentImageSource(file);
    const name = file.name || `첨부 이미지 ${idx + 1}`;
    return `
      <button class="attach-thumb" type="button" onclick="openChecklistAttachmentImage(${realIndex}, ${idx})" title="${escapeHtml(name)}">
        <img src="${escapeHtml(src)}" alt="${escapeHtml(name)}">
      </button>
    `;
  }).join("");

  return `
    <div class="attachment-cell readonly-attachment-cell">
      <button type="button" class="attach-count-btn" onclick="openChecklistAttachmentGallery(${realIndex})">${attachments.length}개 첨부</button>
      <div class="attach-thumb-list">${thumbs}</div>
    </div>
  `;
}

function addChecklistAttachments(index, files) {
  const row = checklistRows[index];
  if (!row || !files || !files.length) return;
  normalizeChecklistRow(row);
  ensureChecklistAttachments(row);
  const fileList = Array.from(files).filter(file => file.type.startsWith("image/"));
  if (!fileList.length) {
    showToast("이미지 파일만 첨부할 수 있습니다.");
    return;
  }
  let loaded = 0;
  fileList.forEach(file => {
    const reader = new FileReader();
    reader.onload = event => {
      row.attachments.push({ name: file.name, dataUrl: event.target.result, addedAt: getChecklistTimeText(), addedBy: getCurrentWorkerName() });
      loaded += 1;
      if (loaded === fileList.length) {
        row.history.push({ action: "사진첨부", worker: getCurrentWorkerName(), time: getChecklistTimeText() });
        renderChecklistGrid();
        showToast(`${fileList.length}개 사진을 첨부했습니다.`);
      }
    };
    reader.readAsDataURL(file);
  });
}

function openImagePreview(src, title = "첨부 이미지") {
  openAttachmentImageWindow(src || makeAttachmentFallbackImage(title), title);
}

let pendingObjectionFiles = [];

function openObjectionModal(index) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  if (!isObjectionAllowedRow(row)) return;
  document.getElementById("objectionRowIndex").value = String(index);
  document.getElementById("objectionText").value = row.objection?.text || "";
  document.getElementById("objectionPreview").innerHTML = (row.objectionFiles || []).map(file => `<div class="attach-preview"><img src="${file.dataUrl}" alt="${escapeHtml(file.name)}"><span>${escapeHtml(file.name)}</span></div>`).join("");
  pendingObjectionFiles = [];
  document.getElementById("objectionModal")?.classList.add("active");
}

function closeObjectionModal() {
  document.getElementById("objectionModal")?.classList.remove("active");
  const files = document.getElementById("objectionFiles");
  if (files) files.value = "";
  pendingObjectionFiles = [];
}

function previewObjectionFiles(input) {
  pendingObjectionFiles = [];
  const preview = document.getElementById("objectionPreview");
  if (preview) preview.innerHTML = "";
  const files = Array.from(input.files || []).filter(file => file.type.startsWith("image/"));
  if (!files.length) return;
  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = event => {
      pendingObjectionFiles.push({ name: file.name, dataUrl: event.target.result, addedAt: getChecklistTimeText(), addedBy: getCurrentWorkerName() });
      if (preview) {
        preview.insertAdjacentHTML("beforeend", `<div class="attach-preview"><img src="${event.target.result}" alt="${escapeHtml(file.name)}"><span>${escapeHtml(file.name)}</span></div>`);
      }
      loaded += 1;
    };
    reader.readAsDataURL(file);
  });
}

function saveObjectionModal() {
  const index = Number(document.getElementById("objectionRowIndex")?.value);
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  const text = document.getElementById("objectionText")?.value.trim() || "";
  row.objection = {
    text,
    by: getCurrentWorkerName(),
    at: getChecklistTimeText(),
    accepted: false
  };
  row.objectionFiles = [...(row.objectionFiles || []), ...pendingObjectionFiles];
  row.history.push({ action: "이의제기", worker: row.objection.by, time: row.objection.at });
  closeObjectionModal();
  renderChecklistGrid();
  showToast("이의제기가 저장되었습니다.");
}

function toggleObjectionDetail(index) {
  const row = checklistRows[index];
  if (!row) return;
  row.showObjection = !row.showObjection;
  renderChecklistGrid();
}

function acceptObjectionAndEliminate(index) {
  const row = checklistRows[index];
  if (!row || !row.objection) return;
  normalizeChecklistRow(row);
  row.objection.accepted = true;
  row.eliminated = true;
  row.history.push({ action: "이의제기 인정·소거", worker: getCurrentWorkerName(), time: getChecklistTimeText() });
  renderChecklistGrid();
  showToast("이의제기 인정으로 해당 검토사항을 소거 처리했습니다.");
}

function renderObjectionArea(row, realIndex) {
  if (!isObjectionAllowedRow(row)) return "";
  const hasObjection = !!row.objection;
  const detail = hasObjection && row.showObjection ? `
    <div class="objection-detail-box">
      <strong>이의제기 내용</strong>
      <p>${escapeHtml(row.objection.text || "내용 없음")}</p>
      <small>${escapeHtml(row.objection.by)} · ${escapeHtml(row.objection.at)}</small>
      <div class="attach-thumb-list objection-thumbs">
        ${(row.objectionFiles || []).map(file => `<button class="attach-thumb" type="button" onclick="openImagePreview('${escapeJs(file.dataUrl)}')"><img src="${file.dataUrl}" alt="${escapeHtml(file.name)}"></button>`).join("")}
      </div>
      <button class="btn btn-line" onclick="acceptObjectionAndEliminate(${realIndex})">이의 인정 · 소거</button>
    </div>
  ` : "";
  return `
    <div class="objection-area">
      <button class="btn-objection" onclick="openObjectionModal(${realIndex})">이의제기</button>
      ${hasObjection ? `<button class="btn btn-line btn-mini" onclick="toggleObjectionDetail(${realIndex})">${row.showObjection ? "접기" : "내용보기"}</button>` : ""}
      ${detail}
    </div>
  `;
}


function normalizeSpecialChecklistCreator(row) {
  const group = normalizeChecklistGroupName(row.group);
  const no = String(row.no || "");

  if (group === "Z1. 질의사항(1차)" && no === "026") {
    row.creator = "PM";
    row.createdBy = "PM";
  }

  if (group === "Z1. 질의사항(1차)" && no === "027") {
    row.creator = "산출 담당자";
    row.createdBy = "산출 담당자";
  }

  if (group === "Z7. 견적조건(최종)" && no === "028") {
    row.creator = "산출 담당자";
    row.createdBy = "산출 담당자";
  }

  if (Array.isArray(row.history)) {
    row.history = row.history.map(history => {
      if (history && history.action === "최초작성") {
        return { ...history, worker: row.creator || row.createdBy || history.worker };
      }
      return history;
    });
  }

  return row;
}


function normalizeChecklistRow(row) {
  if (!row) return row;
  row.group = normalizeChecklistGroupName(row.group);
  row.project = row.project || "ㅇㅇ시설 신축공사";
  normalizeSpecialChecklistCreator(row);
  row.creator = getChecklistCreatorByGroup(row.group);
  if (!row.createdAt) row.createdAt = "2026-04-29 09:00";
  ensureChecklistAttachments(row);
  row.history = Array.isArray(row.history) ? row.history : [];
  row.history = row.history.filter(h => h.action !== "최초작성");
  row.history.push({ action: "최초작성", worker: row.creator, time: row.createdAt });

  const groupTargets = getChecklistTargetsByGroup(row.group);
  if (groupTargets) {
    row.targets = [...groupTargets];
  } else if (!Array.isArray(row.targets) || !row.targets.length) {
    row.targets = String(row.owner || "QC TEAM").split(/[,/]/).map(v => v.trim()).filter(Boolean);
  }

  if (!Array.isArray(row.checks)) row.checks = [];
  row.targets.forEach(target => {
    if (!row.checks.some(c => c.target === target)) row.checks.push({ target, done: false, checkedBy: "", checkedAt: "" });
  });
  row.checks = row.checks.filter(c => row.targets.includes(c.target));
  row.owner = row.targets.join(", ");
  row.done = isChecklistRowDone(row);
  row.status = row.done ? "확인완료" : getChecklistDoneState(row);
  return normalizeSpecialChecklistCreator(row);}

function getChecklistDoneState(row) {
  const checks = Array.isArray(row?.checks) ? row.checks : [];
  if (!checks.length || checks.every(c => !c.done)) return "미확인";
  if (checks.every(c => c.done)) return "확인완료";
  return "부분완료";
}

function isChecklistRowDone(row) {
  const checks = Array.isArray(row?.checks) ? row.checks : [];
  return checks.length > 0 && checks.every(c => c.done);
}

function getChecklistTargets(row) {
  normalizeChecklistRow(row);
  return Array.isArray(row.targets) ? row.targets : [];
}


function getChecklistCategoryLabel(category) {
  if (category === "전체") return "전체보기";
  return category;
}

function setChecklistCategoryFilter(category) {
  selectedChecklistCategoryFilter = category || "전체";
  renderChecklistCategoryButtons();
  renderChecklistGrid();
}

function renderChecklistCategoryButtons() {
  const wrap = document.getElementById("checklistCategoryFilter");
  if (!wrap) return;

  const categoryCounts = checklistCategoryOptions.reduce((acc, category) => {
    acc[category] = checklistRows.filter(row => normalizeChecklistGroupName(row.group) === category).length;
    return acc;
  }, {});

  const visibleCategories = checklistCategoryOptions.filter(category => categoryCounts[category] > 0);
  const categories = ["전체", ...visibleCategories];

  if (selectedChecklistCategoryFilter !== "전체" && !visibleCategories.includes(selectedChecklistCategoryFilter)) {
    selectedChecklistCategoryFilter = "전체";
  }

  wrap.innerHTML = categories.map(category => {
    const active = selectedChecklistCategoryFilter === category ? "active" : "";
    const count = category === "전체" ? checklistRows.length : categoryCounts[category];
    return `<button type="button" class="category-filter-btn ${active}" onclick="setChecklistCategoryFilter('${escapeJs(category)}')">${escapeHtml(getChecklistCategoryLabel(category))}<span>${count}</span></button>`;
  }).join("");
}

function getChecklistFilteredRows() {
  checklistRows.forEach(normalizeChecklistRow);

  const project = (document.getElementById("checklistProject")?.value || "").trim();
  const owner = document.getElementById("checklistOwnerFilter")?.value || "전체";
  const doneFilter = document.getElementById("checklistDoneFilter")?.value || "전체";
  const search = (document.getElementById("checklistSearch")?.value || "").trim().toLowerCase();
  const categoryFilter = selectedChecklistCategoryFilter || "전체";

  return checklistRows.map((row, realIndex) => ({ row, realIndex })).filter(({ row }) => {
    const targets = getChecklistTargets(row);
    const rowProject = row.project || "ㅇㅇ시설 신축공사";
    const projectOk = !project || rowProject.includes(project) || project.includes(rowProject);
    const group = normalizeChecklistGroupName(row.group);
    const categoryOk = categoryFilter === "전체" || group === categoryFilter;
    const ownerOk = owner === "전체" || targets.includes(owner);
    const state = getChecklistDoneState(row);
    const doneOk = doneFilter === "전체" || state === doneFilter;
    const text = `${rowProject} ${row.group} ${row.trade} ${row.no} ${row.item} ${row.method} ${targets.join(" ")} ${state} ${row.comment}`.toLowerCase();

    return projectOk && categoryOk && ownerOk && doneOk && (!search || text.includes(search));
  });
}

function renderChecklistGrid() {
  renderChecklistCategoryButtons();
  const body = document.getElementById("checklistGridBody");
  if (!body) return;
  const rows = getChecklistFilteredRows().sort((a, b) => {
    const ai = checklistCategoryOptions.indexOf(a.row.group);
    const bi = checklistCategoryOptions.indexOf(b.row.group);
    const ag = ai < 0 ? 999 : ai;
    const bg = bi < 0 ? 999 : bi;
    if (ag !== bg) return ag - bg;
    return String(a.row.no).localeCompare(String(b.row.no), "ko", { numeric: true });
  });
  let lastGroup = "";
  body.innerHTML = rows.map(({ row, realIndex }) => {
    normalizeChecklistRow(row);
    const locked = isChecklistCategoryLocked(row.group);
    const groupBand = row.group !== lastGroup ? renderChecklistGroupBand(row.group) : "";
    lastGroup = row.group;
    return `${groupBand}
      <tr class="${row.done ? "row-done" : ""} ${locked ? "locked-row" : ""} ${row.eliminated ? "eliminated-row" : ""}">
        <td><input type="checkbox" ${row.checked ? "checked" : ""} ${locked ? "disabled" : ""} onchange="updateChecklistCheck(${realIndex}, this.checked)" title="행 선택"></td>
        <td><div class="cell" ${locked ? "" : "contenteditable=\"true\""} onblur="updateChecklistCell(${realIndex}, 'trade', this.innerText)">${escapeHtml(row.trade)}</div></td>
        <td><div class="cell" ${locked ? "" : "contenteditable=\"true\""} onblur="updateChecklistCell(${realIndex}, 'no', this.innerText)">${escapeHtml(row.no)}</div></td>
        <td><div class="cell" ${locked ? "" : "contenteditable=\"true\""} onblur="updateChecklistCell(${realIndex}, 'item', this.innerText)">${escapeHtml(row.item)}</div></td>
        <td><div class="cell" ${locked ? "" : "contenteditable=\"true\""} onblur="updateChecklistCell(${realIndex}, 'method', this.innerText)">${escapeHtml(row.method)}</div></td>
        <td><div class="target-chip-list">${getChecklistTargets(row).map(t => `<span class="target-chip">${escapeHtml(t)}</span>`).join("")}</div></td>
        <td class="done-cell">${renderChecklistTargetChecks(row, realIndex)}</td>
        <td><div class="cell" ${locked ? "" : "contenteditable=\"true\""} onblur="updateChecklistCell(${realIndex}, 'comment', this.innerText)">${escapeHtml(row.comment)}</div></td>
        <td>${renderChecklistAttachmentCell(row, realIndex)}</td>
        <td><div class="history-cell">${renderChecklistHistory(row)}</div></td>
        <td><div class="row-actions"><button class="btn btn-line" ${locked ? "disabled" : ""} onclick="openChecklistModal(${realIndex})">수정</button><button class="btn btn-danger" ${locked ? "disabled" : ""} onclick="deleteChecklistRow(${realIndex})">삭제</button></div></td>
      </tr>`;
  }).join("");
}

function renderChecklistGroupBand(group) {
  group = normalizeChecklistGroupName(group);
  const isQuestion = isQuestionCategory(group);
  const isFinalEstimateCondition = group === "Z7. 견적조건(최종)";
  const locked = isChecklistCategoryLocked(group);
  const count = checklistRows.filter(row => normalizeChecklistGroupName(row.group) === group).length;
  const controls = [];

  if (group === firstCategoryName) {
    controls.push(`<button class="btn btn-line group-mini-btn" onclick="downloadFirstCategoryCsv()">발주처 송부용 엑셀 다운로드</button>`);
  }

  if (isQuestion || isFinalEstimateCondition) {
    controls.push(`<button class="btn btn-line group-mini-btn" onclick="downloadQuestionCategoryCsv('${escapeJs(group)}')">질의 엑셀</button>`);
  }

  if (isQuestion) {
    controls.push(`<button class="btn ${locked ? "btn-line" : "btn-primary"} group-mini-btn" ${locked ? "disabled" : ""} onclick="markQuestionCategorySent('${escapeJs(group)}')">${locked ? "송부완료" : "송부 완료 체크"}</button>`);
    const next = getNextQuestionCategory(group);
    if (locked && next) controls.push(`<span class="next-round-guide">다음 작성 가능: ${escapeHtml(next)}</span>`);
  }

  return `<tr class="group-separator-row ${locked ? "group-locked" : ""}"><td colspan="11"><div class="group-band-inner"><div><span>구분</span><strong>${escapeHtml(group)}</strong><em>${count}건</em>${locked ? `<b>잠금</b>` : ""}</div><div class="group-band-actions">${controls.join("")}</div></div></td></tr>`;
}

function renderChecklistTargetChecks(row, realIndex) {
  normalizeChecklistRow(row);
  const locked = isChecklistCategoryLocked(row.group);
  const checks = row.checks.map((check, checkIndex) => `
    <label class="done-check-wrap target-done-wrap" title="${escapeHtml(check.target)} 확인 체크">
      <input type="checkbox" ${check.done ? "checked" : ""} ${locked ? "disabled" : ""} onchange="toggleChecklistDone(${realIndex}, ${checkIndex}, this.checked)">
      <span>${escapeHtml(check.target)} · ${check.done ? "확인완료" : "미확인"}</span>
    </label>
  `).join("");
  return `${checks}${renderObjectionArea(row, realIndex)}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
}
function escapeJs(value) {
  return String(value ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
function getCurrentWorkerName() {
  return document.querySelector(".user")?.textContent?.trim() || "현재 작업자";
}

function getChecklistTimeText() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}


function formatHistoryBlock(worker, action, time) {
  const safeWorker = worker || "";
  const safeAction = action || "";
  const safeTime = time || "";

  const parts = String(safeTime).split(" ");
  const datePart = parts[0] || "";
  const timePart = parts.slice(1).join(" ") || "";

  return formatHistoryBlock(created.worker, created.action, created.time);
}

function renderChecklistHistory(row) {
  normalizeChecklistRow(row);
  const history = Array.isArray(row.history) ? row.history : [];
  if (!history.length) return `<span class="history-empty">이력 없음</span>`;
  return history.slice(-4).reverse().map(item => `
    <div class="history-line ${item.action === "최초작성" ? "created" : ""}"><strong>${escapeHtml(item.worker)}</strong><span>${escapeHtml(item.target ? item.action + "(" + item.target + ")" : item.action)} · ${escapeHtml(item.time)}</span></div>
  `).join("");
}

function toggleChecklistDone(index, checkIndex, checked) {
  const row = checklistRows[index];
  if (!row) return;
  normalizeChecklistRow(row);
  if (isChecklistCategoryLocked(row.group)) {
    showToast("송부 완료된 질의차수는 수정할 수 없습니다.");
    renderChecklistGrid();
    return;
  }
  const check = row.checks[checkIndex];
  if (!check) return;
  const worker = getCurrentWorkerName();
  const time = getChecklistTimeText();
  check.done = checked;
  check.checkedBy = checked ? worker : "";
  check.checkedAt = checked ? time : "";
  row.history = Array.isArray(row.history) ? row.history : [];
  row.history = row.history.filter(h => !(h.action === "확인완료" && h.target === check.target));
  if (checked) {
    row.history.push({ action: "확인완료", target: check.target, worker, time });
    showToast(`${row.no}번 항목의 ${check.target} 확인완료가 기록되었습니다.`);
  } else {
    showToast(`${row.no}번 항목의 ${check.target} 확인완료 로그를 제거했습니다.`);
  }
  row.done = isChecklistRowDone(row);
  row.status = getChecklistDoneState(row);
  renderChecklistGrid();
}

function updateChecklistCell(index, key, value) {
  if (!checklistRows[index]) return;
  normalizeChecklistRow(checklistRows[index]);
  if (isChecklistCategoryLocked(checklistRows[index].group)) {
    showToast("송부 완료된 질의차수는 수정할 수 없습니다.");
    renderChecklistGrid();
    return;
  }
  checklistRows[index][key] = key === "group" ? normalizeChecklistGroupName(value) : String(value).trim();
  if (key === "owner") {
    checklistRows[index].targets = String(value).split(/[,/]/).map(v => v.trim()).filter(Boolean);
    checklistRows[index].checks = [];
    normalizeChecklistRow(checklistRows[index]);
  }
}

function updateChecklistCheck(index, checked) { if (checklistRows[index]) checklistRows[index].checked = checked; }
function toggleAllChecklistRows(box) { getChecklistFilteredRows().forEach(({ realIndex }) => checklistRows[realIndex].checked = box.checked); renderChecklistGrid(); }
function nextChecklistNo() { const nums = checklistRows.map(r => Number(String(r.no).replace(/\D/g, ""))).filter(Boolean); return String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, "0"); }

function renderChecklistCategoryOptions(selectedGroup = "") {
  const select = document.getElementById("checklistModalGroup");
  if (!select) return;
  const current = normalizeChecklistGroupName(selectedGroup);
  select.innerHTML = checklistCategoryOptions.map(category => {
    const disabled = !canUseChecklistCategory(category, current);
    const label = isChecklistCategoryLocked(category) ? `${category} · 송부완료` : category;
    return `<option value="${escapeHtml(category)}" ${category === current ? "selected" : ""} ${disabled ? "disabled" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
  if (current && checklistCategoryOptions.includes(current)) select.value = current;
}

function renderChecklistTargetOptions(selectedTargets = []) {
  const wrap = document.getElementById("checklistTargetChecks");
  if (!wrap) return;
  wrap.innerHTML = checklistOwners.map(owner => `
    <label class="target-option"><input type="checkbox" value="${escapeHtml(owner)}" ${selectedTargets.includes(owner) ? "checked" : ""}> <span>${escapeHtml(owner)}</span></label>
  `).join("");
}

function getSelectedChecklistTargets() {
  return Array.from(document.querySelectorAll('#checklistTargetChecks input[type="checkbox"]:checked')).map(input => input.value);
}


let checklistModalAttachments = [];

function renderChecklistModalAttachmentPreview() {
  const preview = document.getElementById("checklistModalPreview");
  if (!preview) return;
  if (!checklistModalAttachments.length) {
    preview.innerHTML = `<div class="empty-attach-box">첨부된 사진이 없습니다.</div>`;
    return;
  }
  preview.innerHTML = checklistModalAttachments.map((file, idx) => `
    <div class="attach-preview">
      <img src="${file.dataUrl}" alt="${escapeHtml(file.name)}" onclick="openImagePreview('${escapeJs(file.dataUrl)}')">
      <span>${escapeHtml(file.name)}</span>
      <button type="button" class="attach-remove-btn" onclick="removeChecklistModalAttachment(${idx})">제거</button>
    </div>
  `).join("");
}

function previewChecklistModalFiles(input) {
  const files = Array.from(input.files || []).filter(file => file.type.startsWith("image/"));
  if (!files.length) return;
  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      checklistModalAttachments.push({
        name: file.name,
        dataUrl: e.target.result,
        addedBy: getCurrentWorkerName(),
        addedAt: getChecklistTimeText()
      });
      loaded += 1;
      if (loaded === files.length) {
        renderChecklistModalAttachmentPreview();
        input.value = "";
      }
    };
    reader.readAsDataURL(file);
  });
}

function removeChecklistModalAttachment(index) {
  checklistModalAttachments.splice(index, 1);
  renderChecklistModalAttachmentPreview();
}

function openChecklistModal(index = null) {
  renderChecklistTargetOptions();
  const isEdit = Number.isInteger(index) && checklistRows[index];
  const row = isEdit ? normalizeChecklistRow(checklistRows[index]) : null;
  if (row && isChecklistCategoryLocked(row.group)) {
    showToast("송부 완료된 질의차수는 수정할 수 없습니다.");
    return;
  }
  setText("checklistModalTitle", isEdit ? "수량산출 체크리스트 수정" : "수량산출 체크리스트 추가");
  const editIndex = document.getElementById("checklistEditIndex");
  if (editIndex) editIndex.value = isEdit ? String(index) : "";
  const values = {
    checklistModalGroup: row?.group || firstCategoryName,
    checklistModalTrade: row?.trade || "",
    checklistModalNo: row?.no || nextChecklistNo(),
    checklistModalItem: row?.item || "",
    checklistModalMethod: row?.method || "",
    checklistModalComment: row?.comment || ""
  };
  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = value;
      el.classList.remove("invalid");
    }
  });
  renderChecklistCategoryOptions(row?.group || firstCategoryName);
  renderChecklistTargetOptions(row ? getChecklistTargets(row) : (getChecklistTargetsByGroup(firstCategoryName) || ["QC TEAM"]));
  document.getElementById("checklistTargetError")?.classList.remove("show");
  checklistModalAttachments = row?.attachments ? [...row.attachments] : [];
  renderChecklistModalAttachmentPreview();
  const fileInput = document.getElementById("checklistModalFiles");
  if (fileInput) fileInput.value = "";
  document.getElementById("checklistItemModal")?.classList.add("active");
}

function closeChecklistModal() {
  document.getElementById("checklistItemModal")?.classList.remove("active");
  checklistModalAttachments = [];
  const preview = document.getElementById("checklistModalPreview");
  if (preview) preview.innerHTML = "";
  const fileInput = document.getElementById("checklistModalFiles");
  if (fileInput) fileInput.value = "";
}

function saveChecklistModal() {
  const requiredIds = ["checklistModalGroup", "checklistModalTrade", "checklistModalItem", "checklistModalMethod"];
  let ok = true;
  requiredIds.forEach(id => {
    const el = document.getElementById(id);
    const valid = !!el?.value.trim();
    el?.classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  const targets = getSelectedChecklistTargets();
  const targetError = document.getElementById("checklistTargetError");
  if (!targets.length) {
    targetError?.classList.add("show");
    ok = false;
  } else {
    targetError?.classList.remove("show");
  }
  if (!ok) return;

  const selectedGroup = normalizeChecklistGroupName(document.getElementById("checklistModalGroup")?.value || "");
  const editIndexRaw = document.getElementById("checklistEditIndex")?.value || "";
  const editIndex = editIndexRaw === "" ? null : Number(editIndexRaw);
  const previous = Number.isInteger(editIndex) ? checklistRows[editIndex] : null;
  const previousGroup = previous ? normalizeChecklistGroupName(previous.group) : "";
  if (!canUseChecklistCategory(selectedGroup, previousGroup)) {
    showToast("이전 질의차수가 송부 완료되어야 다음 차수 작성이 가능하거나, 이미 송부 완료된 차수입니다.");
    return;
  }
  const creator = previous?.creator || getCurrentWorkerName();
  const createdAt = previous?.createdAt || getChecklistTimeText();
  const row = {
    checked: previous?.checked || false,
    done: false,
    checkedBy: "",
    checkedAt: "",
    history: Array.isArray(previous?.history) ? previous.history.filter(h => h.action === "최초작성" || (h.action === "확인완료" && targets.includes(h.target))) : [],
    group: selectedGroup,
    trade: document.getElementById("checklistModalTrade").value.trim(),
    no: document.getElementById("checklistModalNo").value.trim() || nextChecklistNo(),
    item: document.getElementById("checklistModalItem").value.trim(),
    method: document.getElementById("checklistModalMethod").value.trim(),
    owner: targets.join(", "),
    targets,
    checks: targets.map(target => {
      const old = previous?.checks?.find(c => c.target === target);
      return old ? { ...old } : { target, done: false, checkedBy: "", checkedAt: "" };
    }),
    status: "미확인",
    comment: document.getElementById("checklistModalComment").value.trim(),
    creator: getChecklistCreatorByGroup(selectedGroup),
    createdAt,
    attachments: [...checklistModalAttachments],
    objection: previous?.objection || null,
    objectionFiles: Array.isArray(previous?.objectionFiles) ? previous.objectionFiles : [],
    eliminated: previous?.eliminated || false,
    showObjection: previous?.showObjection || false
  };
  normalizeChecklistRow(row);
  if (Number.isInteger(editIndex) && checklistRows[editIndex]) {
    checklistRows[editIndex] = row;
    showToast("체크리스트 항목이 수정되었습니다.");
  } else {
    checklistRows.push(row);
    showToast("체크리스트 항목이 추가되었습니다.");
  }
  closeChecklistModal();
  renderChecklistGrid();
}

function addChecklistRow() { openChecklistModal(); }
function insertChecklistRowAfter(index) { openChecklistModal(index); }
function deleteChecklistRow(index) { 
  if (!checklistRows[index]) return;
  normalizeChecklistRow(checklistRows[index]);
  if (isChecklistCategoryLocked(checklistRows[index].group)) {
    showToast("송부 완료된 질의차수는 삭제할 수 없습니다.");
    return;
  }
  checklistRows.splice(index, 1); 
  renderChecklistGrid(); 
}
function deleteCheckedRows() { 
  const before = checklistRows.length; 
  checklistRows = checklistRows.filter(row => {
    normalizeChecklistRow(row);
    return !row.checked || isChecklistCategoryLocked(row.group);
  }); 
  renderChecklistGrid(); 
  showToast(`${before - checklistRows.length}개 행을 삭제했습니다. 송부 완료된 항목은 제외되었습니다.`); 
}
function duplicateCheckedRows() {
  const duplicated = checklistRows.filter(row => { normalizeChecklistRow(row); return row.checked && !isChecklistCategoryLocked(row.group); }).map(row => {
    const copy = JSON.parse(JSON.stringify(row));
    copy.checked = false;
    copy.no = nextChecklistNo();
    copy.creator = getCurrentWorkerName();
    copy.createdAt = getChecklistTimeText();
    copy.history = [{ action: "최초작성", worker: copy.creator, time: copy.createdAt }];
    copy.checks = (copy.targets || [copy.owner || "QC TEAM"]).map(target => ({ target, done: false, checkedBy: "", checkedAt: "" }));
    copy.done = false;
    copy.status = "미확인";
    return copy;
  });
  checklistRows.push(...duplicated);
  renderChecklistGrid();
  showToast(`${duplicated.length}개 행을 복제했습니다.`);
}
function buildChecklistCsv(rows, fileName) {
  rows.forEach(normalizeChecklistRow);
  const headers = ["구분", "공종", "일련번호", "검토항목", "검토방법", "요청 대상", "체크 상태", "코멘트", "첨부사진수", "이의제기", "소거여부", "최초 작성자", "최초 작성일시", "확인완료 이력", "송부완료여부"];
  const bodyRows = rows.map(r => [
    r.group,
    r.trade,
    r.no,
    r.item,
    r.method,
    getChecklistTargets(r).join(" / "),
    getChecklistDoneState(r),
    r.comment,
    (r.attachments || []).length,
    r.objection?.text || "",
    r.eliminated ? "소거" : "",
    r.creator || "",
    r.createdAt || "",
    (r.history || []).filter(h => h.action === "확인완료").map(h => `${h.target}/${h.worker}/${h.time}`).join(" | "),
    isChecklistCategoryLocked(r.group) ? "송부완료" : ""
  ]);
  const csv = [headers, ...bodyRows].map(row => row.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadChecklistCsv() {
  buildChecklistCsv(checklistRows, "QC_수량산출_체크리스트_전체.csv");
}

function downloadFirstCategoryCsv() {
  const rows = checklistRows.filter(row => normalizeChecklistGroupName(row.group) === firstCategoryName);
  if (!rows.length) {
    showToast("1번 항목에 다운로드할 데이터가 없습니다.");
    return;
  }
  buildChecklistCsv(rows, "프로젝트_수주_시점_PM_작업자_발주처_송부용.csv");
}

function downloadQuestionCategoryCsv(category) {
  category = normalizeChecklistGroupName(category);
  const rows = checklistRows.filter(row => normalizeChecklistGroupName(row.group) === category);
  if (!rows.length) {
    showToast("해당 질의차수에 다운로드할 데이터가 없습니다.");
    return;
  }
  buildChecklistCsv(rows, `${category.replace(/[\\/:*?"<>|]/g, "_")}.csv`);
}

function markQuestionCategorySent(category) {
  category = normalizeChecklistGroupName(category);
  if (!isQuestionCategory(category)) return;
  const rows = checklistRows.filter(row => normalizeChecklistGroupName(row.group) === category);
  if (!rows.length) {
    showToast("송부 완료 처리할 질의사항이 없습니다.");
    return;
  }
  const worker = getCurrentWorkerName();
  const time = getChecklistTimeText();
  checklistSentCategories.add(category);
  rows.forEach(row => {
    normalizeChecklistRow(row);

    // 송부완료로 질의차수가 잠금 처리되면, 해당 차수의 PM 확인 상태를 일괄 완료 처리한다.
    // 화면상 "PM · 미확인"으로 남지 않고 "PM · 확인완료"로 표시되도록 checks/history/status를 함께 동기화한다.
    const pmCheck = Array.isArray(row.checks) ? row.checks.find(check => check.target === "PM") : null;
    if (pmCheck) {
      pmCheck.done = true;
      pmCheck.checkedBy = worker;
      pmCheck.checkedAt = time;
      row.history = row.history.filter(h => !(h.action === "확인완료" && h.target === "PM"));
      row.history.push({ action: "확인완료", target: "PM", worker, time });
    }

    row.done = isChecklistRowDone(row);
    row.status = getChecklistDoneState(row);
    row.history = row.history.filter(h => h.action !== "송부완료");
    row.history.push({ action: "송부완료", worker, time });
  });
  const next = getNextQuestionCategory(category);
  renderChecklistGrid();
  showToast(next ? `${category} 송부 완료. PM 확인완료 처리 후 ${next} 작성이 가능합니다.` : `${category} 송부 완료 및 PM 확인완료 처리되었습니다.`);
}



document.querySelectorAll("[data-work-main]").forEach(btn => {
  btn.addEventListener("click", () => switchWorkPanel(btn.dataset.workMain));
});
renderChecklistGrid();


// QC 체크리스트 내부 스크롤 제거 보정
function removeInternalChecklistScroll() {
  const selectors = [
    ".work-qc-table-wrap",
    ".qc-review-table-wrap",
    "#qcReviewTableWrap",
    "#workQcPanel .table-wrap",
    "#workQcApproval .table-wrap",
    ".excel-grid-wrap",
    ".checklist-grid-wrap",
    ".grid-scroll",
    ".table-scroll"
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.maxHeight = "none";
      el.style.height = "auto";
      el.style.overflowY = "visible";
    });
  });
}

document.addEventListener("DOMContentLoaded", removeInternalChecklistScroll);
window.addEventListener("resize", removeInternalChecklistScroll);


function renderAttachmentCell(row, rowIndex) {
  const attachments = Array.isArray(row.attachments) ? row.attachments : [];
  if (!attachments.length) {
    return `<div class="attachment-cell empty">첨부 없음</div>`;
  }

  return `
    <div class="attachment-cell has-attachment">
      <button type="button" class="attach-count-btn" onclick="openAttachmentGallery(${rowIndex})">${attachments.length}개 첨부</button>
      <div class="attach-thumb-list">
        ${attachments.map((file, fileIndex) => `
          <button type="button" class="attach-thumb" title="${escapeHtml(file.name || "첨부 이미지")}" onclick="openAttachmentImage(${rowIndex}, ${fileIndex})">
            <img src="${escapeHtml(file.dataUrl || file.url || "")}" alt="${escapeHtml(file.name || "첨부 이미지")}">
          </button>
        `).join("")}
      </div>
    </div>
  `;
}



function openAttachmentImage(rowIndex, fileIndex = 0) {
  openChecklistAttachmentImage(rowIndex, fileIndex);
}

function openAttachmentGallery(rowIndex) {
  openChecklistAttachmentGallery(rowIndex);
}

function openAttachmentImageWindow(imageUrl, title = "첨부 이미지") {
  const src = imageUrl || makeAttachmentFallbackImage(title);
  const popup = window.open("", "_blank", "width=1400,height=920,resizable=yes,scrollbars=yes");

  if (!popup) {
    showToast("팝업 차단을 해제해주세요.");
    return null;
  }

  popup.document.open();
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{min-height:100%;background:#0f172a;font-family:"Pretendard","Noto Sans KR",Arial,sans-serif}
        body{display:flex;align-items:center;justify-content:center;padding:24px;overflow:auto}
        .viewer{width:100%;min-height:calc(100vh - 48px);display:flex;align-items:center;justify-content:center}
        img{display:block;max-width:100%;max-height:calc(100vh - 48px);width:auto;height:auto;object-fit:contain;background:#fff;border-radius:14px;box-shadow:0 18px 60px rgba(0,0,0,.45)}
        .title{position:fixed;top:16px;left:20px;right:20px;color:#e5e7eb;font-size:13px;font-weight:800;text-align:center;pointer-events:none}
      </style>
    </head>
    <body>
      <div class="title">${escapeHtml(title)}</div>
      <div class="viewer"><img src="${src}" alt="${escapeHtml(title)}"></div>
    </body>
    </html>
  `);
  popup.document.close();
  return popup;
}


function openAttachmentGalleryByData(rowIndex) {
  openChecklistAttachmentGallery(rowIndex);
}


function makeAttachmentFallbackImage(label = "첨부 이미지") {
  const safeLabel = String(label || "첨부 이미지").replace(/[<>&"]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="620" viewBox="0 0 900 620">
      <rect width="900" height="620" rx="34" fill="#0f172a"/>
      <rect x="54" y="54" width="792" height="512" rx="28" fill="#111827" stroke="#2563eb" stroke-width="10"/>
      <text x="450" y="288" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="800" fill="#ffffff">${safeLabel}</text>
      <text x="450" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#93c5fd">첨부 이미지 미리보기</text>
    </svg>
  `;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}


function getAttachmentImageSource(file) {
  if (!file) return "";
  return file.dataUrl || file.url || file.src || file.preview || file.imageUrl || file.base64 || makeAttachmentFallbackImage(file.name || "첨부 이미지");
}


function openChecklistAttachmentImage(rowIndex, fileIndex = 0) {
  const row = checklistRows[rowIndex];
  if (!row || !Array.isArray(row.attachments) || !row.attachments[fileIndex]) {
    showToast("첨부 이미지를 찾을 수 없습니다.");
    return;
  }

  const file = row.attachments[fileIndex];
  const src = getAttachmentImageSource(file);
  const title = file.name || `${row.trade || "첨부"} 이미지`;
  openAttachmentImageWindow(src, title);
}


function openChecklistAttachmentGallery(rowIndex) {
  const row = checklistRows[rowIndex];
  if (!row || !Array.isArray(row.attachments) || !row.attachments.length) {
    showToast("첨부 이미지가 없습니다.");
    return;
  }

  if (row.attachments.length === 1) {
    openChecklistAttachmentImage(rowIndex, 0);
    return;
  }

  const popup = window.open("", "_blank", "width=1400,height=920,resizable=yes,scrollbars=yes");
  if (!popup) {
    showToast("팝업 차단을 해제해주세요.");
    return;
  }

  const title = `${row.trade || "첨부"} 첨부 이미지`;
  const cards = row.attachments.map((file, index) => {
    const src = getAttachmentImageSource(file);
    const name = escapeHtml(file.name || `첨부 이미지 ${index + 1}`);
    return `
      <figure class="image-card">
        <img src="${src}" alt="${name}">
        <figcaption>${name}</figcaption>
      </figure>
    `;
  }).join("");

  popup.document.open();
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{min-height:100vh;background:#0f172a;color:#fff;font-family:"Pretendard","Noto Sans KR",Arial,sans-serif;padding:28px}
        h1{font-size:22px;margin-bottom:18px;letter-spacing:-.4px}
        .gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:20px}
        .image-card{background:#111827;border:1px solid rgba(148,163,184,.35);border-radius:18px;padding:14px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
        .image-card img{display:block;width:100%;max-height:78vh;object-fit:contain;background:#fff;border-radius:14px}
        figcaption{margin-top:10px;color:#cbd5e1;font-size:13px;font-weight:800;text-align:center}
      </style>
    </head>
    <body>
      <h1>${escapeHtml(title)}</h1>
      <section class="gallery">${cards}</section>
    </body>
    </html>
  `);
  popup.document.close();
}


/* FINAL_ATTACHMENT_IMAGE_OPEN_PATCH */

function makeAttachmentFallbackImage(label = "첨부 이미지") {
  const safeLabel = String(label || "첨부 이미지").replace(/[<>&"]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="620" viewBox="0 0 900 620">
      <rect width="900" height="620" rx="34" fill="#0f172a"/>
      <rect x="54" y="54" width="792" height="512" rx="28" fill="#111827" stroke="#2563eb" stroke-width="10"/>
      <text x="450" y="288" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="800" fill="#ffffff">${safeLabel}</text>
      <text x="450" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#93c5fd">첨부 이미지 미리보기</text>
    </svg>
  `;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function getAttachmentImageSource(file) {
  if (!file) return "";
  return file.dataUrl || file.url || file.src || file.preview || file.imageUrl || file.base64 || makeAttachmentFallbackImage(file.name || "첨부 이미지");
}

function openChecklistAttachmentImage(rowIndex, fileIndex = 0) {
  const row = checklistRows[rowIndex];
  if (!row || !Array.isArray(row.attachments) || !row.attachments[fileIndex]) {
    showToast("첨부 이미지를 찾을 수 없습니다.");
    return;
  }

  const file = row.attachments[fileIndex];
  const src = getAttachmentImageSource(file);
  const title = file.name || `${row.trade || "첨부"} 이미지`;
  openAttachmentImageWindow(src, title);
}

function openChecklistAttachmentGallery(rowIndex) {
  const row = checklistRows[rowIndex];
  if (!row || !Array.isArray(row.attachments) || !row.attachments.length) {
    showToast("첨부 이미지가 없습니다.");
    return;
  }

  if (row.attachments.length === 1) {
    openChecklistAttachmentImage(rowIndex, 0);
    return;
  }

  const popup = window.open("", "_blank", "width=1400,height=920,resizable=yes,scrollbars=yes");
  if (!popup) {
    showToast("팝업 차단을 해제해주세요.");
    return;
  }

  const title = `${row.trade || "첨부"} 첨부 이미지`;
  const cards = row.attachments.map((file, index) => {
    const src = getAttachmentImageSource(file);
    const name = escapeHtml(file.name || `첨부 이미지 ${index + 1}`);
    return `
      <figure class="image-card">
        <img src="${src}" alt="${name}">
        <figcaption>${name}</figcaption>
      </figure>
    `;
  }).join("");

  popup.document.open();
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{min-height:100vh;background:#0f172a;color:#fff;font-family:"Pretendard","Noto Sans KR",Arial,sans-serif;padding:28px}
        h1{font-size:22px;margin-bottom:18px;letter-spacing:-.4px}
        .gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:20px}
        .image-card{background:#111827;border:1px solid rgba(148,163,184,.35);border-radius:18px;padding:14px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
        .image-card img{display:block;width:100%;max-height:78vh;object-fit:contain;background:#fff;border-radius:14px}
        figcaption{margin-top:10px;color:#cbd5e1;font-size:13px;font-weight:800;text-align:center}
      </style>
    </head>
    <body>
      <h1>${escapeHtml(title)}</h1>
      <section class="gallery">${cards}</section>
    </body>
    </html>
  `);
  popup.document.close();
}

function openAttachmentImageWindow(imageUrl, title = "첨부 이미지") {
  const src = imageUrl || makeAttachmentFallbackImage(title);
  const popup = window.open("", "_blank", "width=1400,height=920,resizable=yes,scrollbars=yes");

  if (!popup) {
    showToast("팝업 차단을 해제해주세요.");
    return null;
  }

  popup.document.open();
  popup.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{min-height:100%;background:#0f172a;font-family:"Pretendard","Noto Sans KR",Arial,sans-serif}
        body{display:flex;align-items:center;justify-content:center;padding:24px;overflow:auto}
        .viewer{width:100%;min-height:calc(100vh - 48px);display:flex;align-items:center;justify-content:center}
        img{display:block;max-width:100%;max-height:calc(100vh - 48px);width:auto;height:auto;object-fit:contain;background:#fff;border-radius:14px;box-shadow:0 18px 60px rgba(0,0,0,.45)}
        .title{position:fixed;top:16px;left:20px;right:20px;color:#e5e7eb;font-size:13px;font-weight:800;text-align:center;pointer-events:none}
      </style>
    </head>
    <body>
      <div class="title">${escapeHtml(title)}</div>
      <div class="viewer"><img src="${src}" alt="${escapeHtml(title)}"></div>
    </body>
    </html>
  `);
  popup.document.close();
  return popup;
}

function openImagePreview(src, title = "첨부 이미지") {
  openAttachmentImageWindow(src || makeAttachmentFallbackImage(title), title);
}

function openAttachmentGalleryByData(rowIndex) {
  openChecklistAttachmentGallery(rowIndex);
}

function openAttachmentImage(rowIndex, fileIndex = 0) {
  openChecklistAttachmentImage(rowIndex, fileIndex);
}

function openAttachmentGallery(rowIndex) {
  openChecklistAttachmentGallery(rowIndex);
}


function applyChecklistDisplayOverrides() {
  checklistRows.forEach(row => normalizeSpecialChecklistCreator(row));
}
