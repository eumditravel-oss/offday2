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
        { title: "경영지원본부", employeeId: "CC-001", children: [{ employeeId: "CC-002" }, { employeeId: "CC-003" }, { employeeId: "CC-004" }, { employeeId: "CC-005" }] },
        { title: "개발 T/F", children: [{ employeeId: "EMP-2018-001" }, { employeeId: "CC-006" }, { employeeId: "CC-007" }] },
        { title: "QC", children: [{ employeeId: "CC-008" }, { employeeId: "CC-009" }] },
        { title: "기술본부", employeeId: "CC-010", children: [
          { title: "마감", employeeId: "CC-009", children: [{ employeeId: "CC-011" }, { employeeId: "CC-012" }, { employeeId: "CC-013" }, { employeeId: "CC-014" }, { employeeId: "CC-015" }, { employeeId: "CC-016" }, { employeeId: "CC-017" }, { employeeId: "CC-018" }, { employeeId: "CC-019" }, { employeeId: "CC-020" }, { employeeId: "CC-021" }, { employeeId: "CC-022" }] },
          { title: "BIM 파트", employeeId: "CC-029", children: [{ employeeId: "EMP-2018-001" }] },
          { title: "구조/토목 조경", employeeId: "CC-008", children: [{ employeeId: "CC-023" }, { employeeId: "CC-024" }, { employeeId: "CC-025" }, { employeeId: "CC-026" }, { employeeId: "CC-027" }, { employeeId: "CC-028" }, { title: "토목·조경파트", employeeId: "CC-030" }] }
        ] },
        { title: "클레임센터", employeeId: "CC-031", children: [{ employeeId: "CC-010" }, { employeeId: "CC-008" }, { employeeId: "CC-032" }, { employeeId: "CC-033" }] }
      ] },
      { title: "공사비닷컴", className: "dotted" }
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

function renderConcostOrgChart(root) {
  const execNodes = [root, ...(root.children || [])].slice(0, 3);
  const branchParent = (root.children || [])[0] || root;
  const branches = branchParent.children || [];
  const findBranch = title => branches.find(node => node.title === title) || { title, children: [] };

  const management = findBranch("경영지원본부");
  const tech = findBranch("기술본부");
  const finish = (tech.children || []).find(node => node.title === "마감") || { title: "마감", children: [] };
  const bim = (tech.children || []).find(node => node.title === "BIM 파트") || { title: "BIM 파트", children: [] };
  const structure = (tech.children || []).find(node => node.title === "구조/토목 조경") || { title: "구조/토목 조경", children: [] };
  const sideBranches = [findBranch("개발 T/F"), findBranch("QC"), findBranch("클레임센터")];
  const structureChildren = (structure.children || []).filter(child => child.employeeId !== structure.employeeId);
  const civilPartNodes = structureChildren.filter(child => child.title === "토목·조경파트" || child.employeeId === "CC-030");
  const structureTeamNodes = structureChildren.filter(child => child.employeeId !== "CC-030" && child.title !== "토목·조경파트");

  return `
    <div class="org-overview-fit concost-fit">
      <div class="org-overview-exec concost-exec">
        ${execNodes.map((node, index) => renderOrgPersonButton(node, index === 0 ? "primary" : "secondary")).join("")}
      </div>
      <div class="org-overview-line"></div>

      <div class="concost-org-layout">
        <div class="concost-left vertical-org-section">
          ${renderOrgBranchCard(management, "세로배치")}
        </div>

        <div class="concost-center">
          <section class="org-overview-card tech-main-card">
            <div class="org-overview-card-title">기술본부</div>
            ${renderOrgPersonButton(tech, "lead")}
            <div class="team-major-grid">
              <section class="team-major-card finish-card">
                <div class="team-major-title">마감</div>
                ${renderOrgPersonButton(finish, "lead")}
                <div class="team-mid-grid">
                  <section class="team-mid-card">
                    <div class="team-mid-title">마감팀</div>
                    <div class="org-overview-members compact-members vertical-members">
                      ${(finish.children || []).filter(child => child.employeeId !== finish.employeeId).map(child => renderOrgPersonButton(child)).join("") || `<div class="org-empty">하위 인원 없음</div>`}
                    </div>
                  </section>
                </div>
              </section>

              <section class="team-major-card structure-card">
                <div class="team-major-title">구조/토목·조경</div>
                ${renderOrgPersonButton(structure, "lead")}
                <div class="team-mid-grid three-col">
                  <section class="team-mid-card">
                    <div class="team-mid-title">구조/BIM 파트</div>
                    <div class="org-overview-members compact-members vertical-members">
                      ${[bim, ...(bim.children || [])].filter(Boolean).map(child => renderOrgPersonButton(child, child.employeeId === bim.employeeId ? "lead" : "")).join("") || `<div class="org-empty">하위 인원 없음</div>`}
                    </div>
                  </section>
                  <section class="team-mid-card">
                    <div class="team-mid-title">구조팀</div>
                    <div class="org-overview-members compact-members vertical-members">
                      ${structureTeamNodes.map(child => renderOrgPersonButton(child)).join("") || `<div class="org-empty">하위 인원 없음</div>`}
                    </div>
                  </section>
                  <section class="team-mid-card civil-only-card">
                    <div class="team-mid-title">토목·조경파트</div>
                    <div class="org-overview-members compact-members vertical-members">
                      ${civilPartNodes.map(child => renderOrgPersonButton(child)).join("") || `<div class="org-empty">하위 인원 없음</div>`}
                    </div>
                  </section>
                </div>
              </section>
            </div>
          </section>
        </div>

        <div class="concost-right vertical-org-section">
          ${sideBranches.map(branch => renderOrgBranchCard(branch, "세로배치")).join("")}
        </div>
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

function renderOrgEditor() {
  const target = document.getElementById("orgEditorGrid");
  if (!target) return;
  const rows = Object.entries(orgStructures).flatMap(([company, data]) => flattenOrgRows(data.root, company));
  target.innerHTML = rows.map((row, idx) => `
    <div class="org-edit-row">
      <div><span>회사</span><strong>${row.company}</strong></div>
      <div><span>상위조직</span><strong>${row.parent}</strong></div>
      <div><span>조직/직책</span><strong>${row.title}</strong></div>
      <div><span>연결 직원</span><strong>${row.name}</strong></div>
      <div><span>사번</span><strong>${row.empNo}</strong></div>
      <div class="org-edit-actions"><button class="btn btn-line" onclick="showToast('조직 행 ${idx + 1} 수정 기능 예시입니다.')">수정</button><button class="btn btn-line" onclick="showToast('표시순서 이동 기능 예시입니다.')">이동</button></div>
    </div>
  `).join("");
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
  projectReceive: ["프로젝트 접수", "계약 및 기초자료 수집, 도면/내역서 접수, 프로젝트 유형과 특이사항을 관리합니다."],
  pmSchedule: ["PM 배정 / 일정", "PM 지정, 인원 배정, 일정 승인, 지연사유 결재 흐름을 관리합니다."],
  quantityChecklist: ["QC 검토 / 승인", "수량산출 체크리스트는 QC 검토 / 승인 안에 포함됩니다."],
  qcReview: ["QC 검토 / 승인", "수량산출 체크리스트, 체크리스트 검토, 이의제기, 오류 소거, 최종 수량 검토를 한 화면에서 관리합니다."],
  estimateCondition: ["견적조건 작성", "작업자와 PM이 작성한 견적조건을 결합하고 Excel로 내려받습니다."],
  deliveryData: ["납품 및 데이터관리", "차수별 납품자료와 다운로드 권한 승인 흐름을 관리합니다."],
  dailyReport: ["업무일지 / 진행률", "아침 업무 계획, 저녁 최종 업무일지, 진행률과 지연사유를 관리합니다."]
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
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"프로젝트 수주 시점(PM,작업자,발주처 송부용)", trade:"계약방식", no:"001", item:"프로젝트 업무 특성 파악 (구조선수행, 입찰, 본실행, 설계내역 등)", method:"접수자료 확인. 특이사항 작성 후 프로젝트 PM 전달", owner:"QC TEAM", status:"진행중", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"프로젝트 수주 시점(PM,작업자,발주처 송부용)", trade:"접수자료", no:"002", item:"입찰 내역서, 산출기준서, 공사 특기사항 접수 파악", method:"접수자료 확인. 특이사항 작성 후 프로젝트 PM 전달", owner:"QC TEAM", status:"진행중", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"프로젝트 수주 시점(PM,작업자,발주처 송부용)", trade:"도면검토", no:"003", item:"도면 접수 여부 확인 (구조 / 건축 / 토목)", method:"도면목록표와 접수 도면상 일치 확인", owner:"QC TEAM", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"프로젝트 수주 시점(PM,작업자,발주처 송부용)", trade:"접수자료", no:"004", item:"내역서, 산출서, 기준서 접수 여부 확인", method:"내역서, 산출서, 기준서 파일 수신 여부 확인", owner:"QC TEAM", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"작업 착수 전 확인 필요사항(PM)", trade:"프로젝트 유형", no:"005", item:"프로젝트 유형 파악 (입찰 / 본실행 / 구조선수행 등)", method:"계약방식과 발주처 요청사항 기준으로 유형 분류", owner:"PM", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"작업 착수 전 확인 필요사항(PM)", trade:"특이사항", no:"006", item:"프로젝트별 특이사항 확인 및 정리", method:"정리 완료 후 내부 PM 및 외부 발주처 담당자에게 동시 발송", owner:"PM", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"작업 착수 전 확인 필요사항(PM)", trade:"파일공사", no:"007", item:"파일길이 및 항타장비, 동재하 정재하 시험횟수 확인", method:"지질조서도 확인", owner:"산출 담당자", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"작업 착수 전 확인 필요사항(PM)", trade:"토공사", no:"008", item:"토공사 산출유무 확인", method:"토목팀 투입 유무 확인 및 건축터파기 산출 여부 협의", owner:"산출 담당자", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"작업 착수 전 확인 필요사항(PM)", trade:"합벽", no:"009", item:"합벽유무 및 합벽구간 추가이음 발생 여부 확인", method:"토목도면 흙막이 또는 가시설계획도 확인", owner:"PM", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"작업 착수 전 확인 필요사항(PM)", trade:"끊어치기", no:"010", item:"끊어치기(C.J Joint) 구간 확인", method:"발주처 및 건설사 질의사항 작성. Zoning 및 분할타설 계획도 요청", owner:"PM", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"자가검토 체크리스트(QC)", trade:"커플러", no:"011", item:"커플러 산출기준 확인", method:"건설사별 견적지침서 확인. 별도 표현 없을 시 담당자 확인", owner:"QC TEAM", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"자가검토 체크리스트(QC)", trade:"철근강도", no:"012", item:"철근 강도에 따른 정착/이음값 오류 확인", method:"구조일반사항 및 구조계산서 검토", owner:"QC TEAM", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"자가검토 체크리스트(QC)", trade:"내진철근", no:"013", item:"내진철근 적용 유무 확인", method:"SD400S, SD500S, SD600S 등의 표현 유무 확인", owner:"QC TEAM", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"제출자료 검토사항(PM)", trade:"기초", no:"014", item:"버림두께 확인", method:"건축단면도 기준 적용. 미표현 시 60mm 적용", owner:"산출 담당자", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"자가검토 체크리스트(QC)", trade:"기둥", no:"015", item:"기초두께 입력시 이음 산출 유무 확인", method:"산출식 확인 후 기초두께 입력 시 주근 이음 산출 여부 검토", owner:"산출 담당자", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"제출자료 검토사항(PM)", trade:"보", no:"016", item:"각 층별 슬라브 두께별 공제 확인", method:"산출내용 재확인", owner:"산출 담당자", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"제출자료 검토사항(PM)", trade:"슬라브", no:"017", item:"부호별 데크타입 오류 확인", method:"RC 평면자료를 Excel 변환 후 필터로 데크부호별 코드입력 체크", owner:"산출 담당자", status:"진행전", comment:"" },
  { checked:false, done:false, checkedBy:"", checkedAt:"", history:[], group:"제출자료 검토사항(PM)", trade:"옹벽", no:"018", item:"옹벽 상부 슬라브 또는 보 공제값 오류 체크", method:"RC 프로그램 산식 확인", owner:"산출 담당자", status:"진행전", comment:"" }
];

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
    renderChecklistGrid();
  } else {
    support?.classList.add("active");
    document.querySelector('[data-module-tab="support"]')?.classList.add("active");
  }
}

function switchWorkPanel(panelId) {
  document.querySelectorAll(".work-panel").forEach(panel => panel.classList.remove("active"));
  document.querySelectorAll("[data-work-main]").forEach(btn => btn.classList.remove("active"));
  document.getElementById(panelId)?.classList.add("active");
  document.querySelector(`[data-work-main="${panelId}"]`)?.classList.add("active");
  const meta = workPageMeta[panelId] || workPageMeta.projectReceive;
  setText("workPageTitle", meta[0]);
  setText("workPageDesc", meta[1]);
  if (panelId === "qcReview" || panelId === "quantityChecklist") renderChecklistGrid();
}


function getChecklistCreatorByGroup(group) {
  const normalized = normalizeChecklistGroupName(group);
  const creatorMap = {
    "프로젝트 수주 시점(PM,작업자,발주처 송부용)": "QC TEAM",
    "작업 착수 전 확인 필요사항(PM)": "PM",
    "자가검토 체크리스트(QC)": "QC TEAM",
    "제출자료 검토사항(PM)": "PM"
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
  const thumbs = row.attachments.map((file, idx) => `
    <button class="attach-thumb" type="button" onclick="openImagePreview('${escapeJs(file.dataUrl)}')" title="${escapeHtml(file.name)}">
      <img src="${file.dataUrl}" alt="${escapeHtml(file.name)}">
    </button>
  `).join("");
  return `
    <div class="attachment-cell readonly-attachment-cell">
      <div class="attach-count">${row.attachments.length ? row.attachments.length + "개 첨부" : "첨부 없음"}</div>
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

function openImagePreview(src) {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<img src="${src}" style="max-width:100%;height:auto;">`);
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

function normalizeChecklistRow(row) {
  if (!row) return row;
  row.group = normalizeChecklistGroupName(row.group);
  row.creator = getChecklistCreatorByGroup(row.group);
  if (!row.createdAt) row.createdAt = "2026-04-29 09:00";
  ensureChecklistAttachments(row);
  row.history = Array.isArray(row.history) ? row.history : [];
  row.history = row.history.filter(h => h.action !== "최초작성");
  row.history.unshift({ action: "최초작성", worker: row.creator, time: row.createdAt });

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
  return row;
}

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

function getChecklistFilteredRows() {
  checklistRows.forEach(normalizeChecklistRow);
  const owner = document.getElementById("checklistOwnerFilter")?.value || "전체";
  const doneFilter = document.getElementById("checklistDoneFilter")?.value || "전체";
  const search = (document.getElementById("checklistSearch")?.value || "").trim().toLowerCase();
  return checklistRows.map((row, realIndex) => ({ row, realIndex })).filter(({ row }) => {
    const targets = getChecklistTargets(row);
    const ownerOk = owner === "전체" || targets.includes(owner);
    const state = getChecklistDoneState(row);
    const doneOk = doneFilter === "전체" || state === doneFilter;
    const text = `${row.group} ${row.trade} ${row.no} ${row.item} ${row.method} ${targets.join(" ")} ${state} ${row.comment}`.toLowerCase();
    return ownerOk && doneOk && (!search || text.includes(search));
  });
}

function renderChecklistGrid() {
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
  const isQuestion = isQuestionCategory(group);
  const locked = isChecklistCategoryLocked(group);
  const count = checklistRows.filter(row => normalizeChecklistGroupName(row.group) === group).length;
  const controls = [];
  if (group === firstCategoryName) controls.push(`<button class="btn btn-line group-mini-btn" onclick="downloadFirstCategoryCsv()">1번 항목 엑셀</button>`);
  if (isQuestion) {
    controls.push(`<button class="btn btn-line group-mini-btn" onclick="downloadQuestionCategoryCsv('${escapeJs(group)}')">질의 엑셀</button>`);
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
    row.history = row.history.filter(h => h.action !== "송부완료");
    row.history.push({ action: "송부완료", worker, time });
  });
  const next = getNextQuestionCategory(category);
  renderChecklistGrid();
  showToast(next ? `${category} 송부 완료. 이제 ${next} 작성이 가능합니다.` : `${category} 송부 완료 처리되었습니다.`);
}



document.querySelectorAll("[data-work-main]").forEach(btn => {
  btn.addEventListener("click", () => switchWorkPanel(btn.dataset.workMain));
});
renderChecklistGrid();
