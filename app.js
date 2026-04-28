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

const orgEmployeeSeed = [["CC-001", "이서진", "CON-COST", "경영지원본부", "상무", "상무", "", ""], ["CC-002", "강동균", "CON-COST", "경영지원본부", "실장", "실장", "", ""], ["CC-003", "김영은", "CON-COST", "경영지원본부", "책임", "책임", "", ""], ["CC-004", "김태영", "CON-COST", "경영지원본부", "선임", "선임", "", ""], ["CC-005", "현예은", "CON-COST", "경영지원본부", "선임", "선임", "", ""], ["CC-006", "탄프엉", "CON-COST", "개발 T/F", "사원", "개발", "", ""], ["CC-007", "고영", "CON-COST", "개발 T/F", "사원", "개발", "", ""], ["CC-008", "장범선", "CON-COST", "QC", "실장", "실장", "", ""], ["CC-009", "조한빈", "CON-COST", "QC", "실장", "실장", "", ""], ["CC-010", "최영배", "CON-COST", "기술본부", "본부장", "본부장", "", ""], ["CC-011", "김재현", "CON-COST", "마감", "수석", "수석", "", ""], ["CC-012", "성대용", "CON-COST", "마감", "수석", "수석", "", ""], ["CC-013", "양한규", "CON-COST", "마감", "수석", "수석", "", ""], ["CC-014", "원종수", "CON-COST", "마감", "수석", "수석", "", ""], ["CC-015", "송영길", "CON-COST", "마감", "수석", "수석", "", ""], ["CC-016", "이은지", "CON-COST", "마감", "책임", "책임", "", ""], ["CC-017", "남은주", "CON-COST", "마감", "책임", "책임", "", ""], ["CC-018", "송치영", "CON-COST", "마감", "책임", "책임", "", ""], ["CC-019", "임승주", "CON-COST", "마감", "선임", "선임", "", ""], ["CC-020", "박가림", "CON-COST", "마감", "선임", "선임", "", ""], ["CC-021", "임창열", "CON-COST", "마감", "선임", "선임", "", ""], ["CC-022", "김수겸", "CON-COST", "마감", "프로", "프로", "", ""], ["CC-023", "신동현", "CON-COST", "구조/토목 조경", "팀장", "팀장", "", ""], ["CC-024", "김재원", "CON-COST", "구조/토목 조경", "수석", "수석", "", ""], ["CC-025", "이정철", "CON-COST", "구조/토목 조경", "수석", "수석", "", ""], ["CC-026", "박수현", "CON-COST", "구조/토목 조경", "책임", "책임", "", ""], ["CC-027", "서화원", "CON-COST", "구조/토목 조경", "책임", "책임", "", ""], ["CC-028", "양진혁", "CON-COST", "구조/토목 조경", "프로", "프로", "", ""], ["CC-029", "이성희", "CON-COST", "BIM파트", "파트장", "파트장", "", ""], ["CC-030", "오승규", "CON-COST", "토목·조경파트", "파트장", "파트장", "", ""], ["CC-031", "이경훈", "CON-COST", "클레임센터", "센터장", "센터장", "", ""], ["CC-032", "김현수", "CON-COST", "클레임센터", "기술이사", "기술이사", "", ""], ["CC-033", "우상진", "CON-COST", "클레임센터", "기술이사", "기술이사", "", ""], ["VQS-001", "Hyun Dong Myung", "Viet QS", "경영진", "CEO", "CEO", "현동명", "Hyun Dong Myung"], ["VQS-002", "Lee Won Hee", "Viet QS", "경영진", "Executive Vice President", "Executive Vice President", "이원희", "Lee Won Hee"], ["VQS-003", "Lan Phuong", "Viet QS", "Management Support", "General Manager", "General Manager", "프엉", "Lan Phuong"], ["VQS-004", "Thanh Tuyen", "Viet QS", "Management Support", "Staff", "Staff", "뚜엔", "Thanh Tuyen"], ["VQS-005", "Yen Phuong", "Viet QS", "Management Support", "Staff", "Staff", "프엉", "Yen Phuong"], ["VQS-006", "Van Dung", "Viet QS", "Internal 1", "Team Leader", "Team Leader", "융", "Van Dung"], ["VQS-007", "Huyen Thu", "Viet QS", "Internal 1", "Team Leader", "Team Leader", "투", "Huyen Thu"], ["VQS-008", "Hong Phien", "Viet QS", "Internal 1", "Staff", "Staff", "피앤", "Hong Phien"], ["VQS-009", "Dong Phuong", "Viet QS", "Internal 1", "Staff", "Staff", "동 프엉", "Dong Phuong"], ["VQS-010", "Quang Truong", "Viet QS", "Internal 1", "Staff", "Staff", "쯔엉", "Quang Truong"], ["VQS-011", "Thanh Loc", "Viet QS", "Internal 1", "Staff", "Staff", "록", "Thanh Loc"], ["VQS-012", "Thanh Xuan", "Viet QS", "Internal 2", "Asst. Team Leader", "Asst. Team Leader", "수언", "Thanh Xuan"], ["VQS-013", "Kha Ai", "Viet QS", "Internal 2", "Staff", "Staff", "카 아이", "Kha Ai"], ["VQS-014", "Van Da", "Viet QS", "Internal 2", "Staff", "Staff", "따", "Van Da"], ["VQS-015", "Kim Tuyen", "Viet QS", "Internal 2", "Staff", "Staff", "김 뚜엔", "Kim Tuyen"], ["VQS-016", "Phuoc Nguyen", "Viet QS", "Internal 2", "Staff", "Staff", "응우옌", "Phuoc Nguyen"], ["VQS-017", "Dinh Phi", "Viet QS", "Internal 3", "Team Leader", "Team Leader", "피", "Dinh Phi"], ["VQS-018", "Minh Triet", "Viet QS", "Internal 3", "Asst. Team Leader", "Asst. Team Leader", "찌앳", "Minh Triet"], ["VQS-019", "Doan Nhut", "Viet QS", "Internal 3", "Staff", "Staff", "민느엇", "Doan Nhut"], ["VQS-020", "Minh Hai", "Viet QS", "Internal 3", "Staff", "Staff", "하이", "Minh Hai"], ["VQS-021", "Minh Kiet", "Viet QS", "Internal 3", "Staff", "Staff", "끼엣", "Minh Kiet"], ["VQS-022", "Van Tung", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "뚱", "Van Tung"], ["VQS-023", "Minh Luan", "Viet QS", "Partition&Opening", "Asst. Team Leader", "Asst. Team Leader", "루언", "Minh Luan"], ["VQS-024", "Tan Phat", "Viet QS", "Partition&Opening", "Staff", "Staff", "팓", "Tan Phat"], ["VQS-025", "Kim Thoa", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "김 톼", "Kim Thoa"], ["VQS-026", "Thi Thao", "Viet QS", "Partition&Opening", "Team Leader", "Team Leader", "타오", "Thi Thao"], ["VQS-027", "Nhut Duy", "Viet QS", "External", "Team Leader", "Team Leader", "유이", "Nhut Duy"], ["VQS-028", "Kieu Duyen", "Viet QS", "External", "Asst. Team Leader", "Asst. Team Leader", "유엔", "Kieu Duyen"], ["VQS-029", "Quoc Bao", "Viet QS", "External", "Staff", "Staff", "빠오", "Quoc Bao"], ["VQS-030", "Ngoc Anh", "Viet QS", "External", "Staff", "Staff", "응옥 안", "Ngoc Anh"], ["VQS-031", "Thuc Nguyen", "Viet QS", "External", "Staff", "Staff", "응우옌", "Thuc Nguyen"], ["VQS-032", "Anh Tuan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "뚜언", "Anh Tuan"], ["VQS-033", "Danh Xuan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "짠 수언", "Danh Xuan"], ["VQS-034", "Van Toan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "또안", "Van Toan"], ["VQS-035", "Thien Ngan", "Viet QS", "Vertical", "Team Leader", "Team Leader", "티엔 응언", "Thien Ngan"], ["VQS-036", "Huu Chau", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "쩌우", "Huu Chau"], ["VQS-037", "Minh Tu", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "뚜", "Minh Tu"], ["VQS-038", "Thanh Phong", "Viet QS", "Vertical", "Team Leader", "Team Leader", "퐁", "Thanh Phong"], ["VQS-039", "Dinh Nam", "Viet QS", "Vertical", "Asst. Team Leader", "Asst. Team Leader", "남", "Dinh Nam"], ["VQS-040", "Cam Tu", "Viet QS", "Vertical", "Staff", "Staff", "깜 뚜", "Cam Tu"], ["VQS-041", "Tien Thinh", "Viet QS", "Vertical", "Staff", "Staff", "띠엔 틴", "Tien Thinh"], ["VQS-042", "Quoc Hung", "Viet QS", "Vertical", "Staff", "Staff", "흥", "Quoc Hung"], ["VQS-043", "Khanh Duy", "Viet QS", "Vertical", "Staff", "Staff", "칸 유이", "Khanh Duy"], ["VQS-044", "Ngoc Thoa", "Viet QS", "Vertical", "Staff", "Staff", "옥 톼", "Ngoc Thoa"], ["VQS-045", "Thu Thuy", "Viet QS", "Vertical", "Staff", "Staff", "투 튀", "Thu Thuy"], ["VQS-046", "Quoc Huy", "Viet QS", "Vertical", "Staff", "Staff", "휘", "Quoc Huy"], ["VQS-047", "Ngoc Mai", "Viet QS", "Vertical", "Staff", "Staff", "마이", "Ngoc Mai"], ["VQS-048", "Xuan Hoang", "Viet QS", "Vertical", "Staff", "Staff", "쑨 황", "Xuan Hoang"], ["VQS-049", "Huu Thai", "Viet QS", "Horizon / Foundation", "Team Leader", "Team Leader", "휴 타이", "Huu Thai"], ["VQS-050", "Nhut Cuong", "Viet QS", "Horizon / Foundation", "Asst. Team Leader", "Asst. Team Leader", "늣끄엉", "Nhut Cuong"], ["VQS-051", "Sy Dan", "Viet QS", "Horizon / Foundation", "Team Leader", "Team Leader", "단", "Sy Dan"], ["VQS-052", "Thanh Phuong", "Viet QS", "Development", "Team Leader", "Team Leader", "탄 프엉", "Thanh Phuong"], ["VQS-053", "Dinh Van", "Viet QS", "Civil", "Staff", "Staff", "딘 반", "Dinh Van"], ["VQS-054", "Manh Cuong", "Viet QS", "Civil", "Staff", "Staff", "끄엉", "Manh Cuong"]];

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

  return `
    <div class="org-overview-fit concost-fit">
      <div class="org-overview-exec concost-exec">
        ${execNodes.map((node, index) => renderOrgPersonButton(node, index === 0 ? "primary" : "secondary")).join("")}
      </div>
      <div class="org-overview-line"></div>

      <div class="concost-org-layout">
        <div class="concost-left">
          ${renderOrgBranchCard(management)}
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
                    <div class="org-overview-members compact-members">
                      ${(finish.children || []).filter(child => child.employeeId !== finish.employeeId).map(child => renderOrgPersonButton(child)).join("") || `<div class="org-empty">하위 인원 없음</div>`}
                    </div>
                  </section>
                </div>
              </section>

              <section class="team-major-card structure-card">
                <div class="team-major-title">구조/토목·조경</div>
                ${renderOrgPersonButton(structure, "lead")}
                <div class="team-mid-grid two-col">
                  <section class="team-mid-card">
                    <div class="team-mid-title">구조/BIM 파트</div>
                    <div class="org-overview-members compact-members">
                      ${[bim, ...(bim.children || [])].filter(Boolean).map(child => renderOrgPersonButton(child, child.employeeId === bim.employeeId ? "lead" : "")).join("") || `<div class="org-empty">하위 인원 없음</div>`}
                    </div>
                  </section>
                  <section class="team-mid-card">
                    <div class="team-mid-title">토목·조경파트</div>
                    <div class="org-overview-members compact-members">
                      ${(structure.children || []).filter(child => child.title === "토목·조경파트" || child.employeeId !== structure.employeeId).map(child => renderOrgPersonButton(child)).join("") || `<div class="org-empty">하위 인원 없음</div>`}
                    </div>
                  </section>
                </div>
              </section>
            </div>
          </section>
        </div>

        <div class="concost-right">
          ${sideBranches.map(renderOrgBranchCard).join("")}
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
