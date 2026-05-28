/* =========================================================
   업무관리 > 프로젝트 접수
   엑셀 접수 양식의 주요 항목을 카드형 입력 화면으로 재구성한 파일입니다.
========================================================= */

const projectReceiveDefaultData = {
  projectName: "",
  projectNo: "",
  client: "",
  usage: "",
  area: "",
  buildings: "",
  floors: "",
  basementFloors: "",
  groundFloors: "",
  bidDate: "",
  unitPrice: "",
  businessTypes: [
    { label: "개산견적", checked: false },
    { label: "정미견적", checked: false },
    { label: "설계가", checked: false },
    { label: "설계변경", checked: false },
    { label: "공사비 검증", checked: false },
    { label: "클레임", checked: false },
    { label: "본사 입찰", checked: false },
    { label: "본사 실행", checked: false },
    { label: "현장 실행", checked: false },
    { label: "기타", checked: false }
  ],
  scopes: [
    { label: "마감", checked: false },
    { label: "구조팀", checked: false },
    { label: "BIM 파트", checked: false },
    { label: "토목ㆍ조경파트", checked: false },
    { label: "인테리어·철거", checked: false },
    { label: "비교내역서", checked: false },
    { label: "단가작업", checked: false },
    { label: "기계/전기", checked: false },
    { label: "클레임", checked: false },
    { label: "골조성", checked: false, children: [
      { label: "가설", checked: false },
      { label: "단열", checked: false },
      { label: "견출", checked: false },
      { label: "방수턱", checked: false }
    ] }
  ],
  contacts: [
    { name: "", role: "", dept: "", tel: "", mobile: "", email: "" }
  ],
  materials: [
    { label: "도면", memo: "", status: "미접수", comment: "", confirmedBy: "" },
    { label: "시방서", memo: "", status: "미접수", comment: "", confirmedBy: "" },
    { label: "현장설명서", memo: "", status: "미접수", comment: "", confirmedBy: "" },
    { label: "내역서", memo: "", status: "미접수", comment: "", confirmedBy: "" },
    { label: "기타자료", memo: "", status: "미접수", comment: "", confirmedBy: "" }
  ],
  webhardUrl: "",
  webhardId: "",
  webhardPw: "",
  webhardNote: "",
  pmTotal: "",
  pmFinish: "",
  pmStructure: "",
  startDate: "",
  firstDelivery: "",
  finalDelivery: "",
  workContent: "",
  notes: "",
  request: ""
};

const projectReceiveSampleData = {
  projectName: "홍익대학교 혁신성장캠퍼스 증축공사 견적용역",
  projectNo: "2026043",
  client: "현대건설㈜",
  usage: "교육연구시설",
  area: "45,013평",
  buildings: "4개동(금회변경)",
  floors: "B6/S9",
  basementFloors: "지하6층",
  groundFloors: "지상9층",
  bidDate: "2026.06말",
  unitPrice: "공내역서",
  businessTypes: [
    { label: "개산견적", checked: false },
    { label: "정미견적", checked: true },
    { label: "설계가", checked: false },
    { label: "설계변경", checked: false },
    { label: "공사비 검증", checked: false },
    { label: "클레임", checked: false },
    { label: "본사 입찰", checked: true },
    { label: "본사 실행", checked: false },
    { label: "현장 실행", checked: false },
    { label: "기타", checked: false }
  ],
  scopes: [
    { label: "마감", checked: true },
    { label: "구조팀", checked: true },
    { label: "BIM 파트", checked: true },
    { label: "토목ㆍ조경파트", checked: true },
    { label: "인테리어·철거", checked: true },
    { label: "비교내역서", checked: false },
    { label: "단가작업", checked: false },
    { label: "기계/전기", checked: false },
    { label: "클레임", checked: false },
    { label: "골조성", checked: false, children: [
      { label: "가설", checked: false },
      { label: "단열", checked: false },
      { label: "견출", checked: false },
      { label: "방수턱", checked: false }
    ] }
  ],
  contacts: [
    { name: "한동훈", role: "매니저", dept: "건축국내견적팀", tel: "02-746-8013", mobile: "010-3572-5478", email: "donghunhan@hdec.co.kr" },
    { name: "박태훈", role: "매니저", dept: "건축국내견적팀", tel: "02-746-0874", mobile: "", email: "" },
    { name: "남종현", role: "매니저", dept: "건축국내견적팀", tel: "02-746-5363", mobile: "010-2080-1933", email: "surnam@hdec.co.kr" }
  ],
  materials: [
    { label: "도면", memo: "2026.05.11", status: "일부접수", comment: "건축 구조 도면은 접수 받았으나 계약범위인 토목도서는 미접수 되었으므로 담당자 확인요망", confirmedBy: "박용진 수석 / 2026.05.13 13:17" },
    { label: "시방서", memo: "접수일 또는 메모", status: "확인완료", comment: "시방서 접수 확인.", confirmedBy: "박용진 수석 / 2026.05.13 13:14" },
    { label: "현장설명서", memo: "접수일 또는 메모", status: "확인완료", comment: "현장설명서 접수 확인.", confirmedBy: "박용진 수석 / 2026.05.13 13:14" },
    { label: "내역서", memo: "2026.05.11", status: "확인완료", comment: "공내역서 접수 확인.", confirmedBy: "박용진 수석 / 2026.05.13 13:14" },
    { label: "기타자료", memo: "접수일 또는 메모", status: "미접수", comment: "접수받은 내용 없음.", confirmedBy: "" }
  ],
  webhardUrl: "http://only.webhard.co.kr",
  webhardId: "hdeckucu",
  webhardPw: "s100",
  webhardNote: "폴더 접속KEY: 0505 / 폴더명: 260406 포항 AI DC",
  pmTotal: "",
  pmFinish: "",
  pmStructure: "",
  startDate: "2026.05.12(화)",
  firstDelivery: "2026.06.05(금)",
  finalDelivery: "",
  workContent: "구조, 마감, 인테리어, 철거공사 / 공내역서 작성",
  notes: "",
  request: "구조, 마감, 인테리어, 철거공사 / 공내역서 작성\n금회증축 연면적 45,013평이 과업 범위임"
};



function createProjectReceiveCompletedProject(config) {
  const businessTypeLabels = config.businessTypes || inferProjectReceiveBusinessTypes(config.projectName, config.workContent, config.request);
  const scopeLabels = config.scopes || inferProjectReceiveScopes(config.projectName, config.workContent, config.request);
  return {
    sourceFile: config.sourceFile,
    completedAt: config.completedAt || "2026.05.13 11:47",
    data: {
      ...projectReceiveSampleData,
      projectNo: config.projectNo,
      projectName: config.projectName,
      client: config.client,
      usage: config.usage || "",
      area: config.area || "",
      buildings: config.buildings || "",
      floors: config.floors || "",
      basementFloors: config.basementFloors || parseProjectReceiveFloors(config.floors || "").basementFloors,
      groundFloors: config.groundFloors || parseProjectReceiveFloors(config.floors || "").groundFloors,
      bidDate: config.bidDate || "",
      unitPrice: config.unitPrice || "공내역서",
      businessTypes: projectReceiveSampleData.businessTypes.map(item => ({ ...item, checked: businessTypeLabels.includes(item.label) })),
      scopes: projectReceiveSampleData.scopes.map(item => ({
        ...item,
        checked: scopeLabels.includes(item.label),
        children: item.children ? item.children.map(child => ({ ...child, checked: (config.scopeDetails?.[item.label] || []).includes(child.label) })) : undefined
      })),
      contacts: config.contacts || [{ name: "", role: "", dept: "", tel: "", mobile: "", email: "" }],
      materials: createProjectReceiveDummyMaterials(config.receivedDate),
      startDate: config.startDate || "",
      firstDelivery: config.firstDelivery || "담당자 협의 필요",
      finalDelivery: config.finalDelivery || "",
      workContent: config.workContent || config.request || config.projectName,
      notes: config.notes || "엑셀 수주소식 기준 작성완료 더미데이터",
      request: config.request || `${config.projectName} 접수 건`
    }
  };
}

function inferProjectReceiveBusinessTypes(...texts) {
  const source = texts.filter(Boolean).join(" ");
  const labels = new Set();
  if (/설계변경/.test(source)) labels.add("설계변경");
  if (/설계가|설계예가/.test(source)) labels.add("설계가");
  if (/검증|적정공사비|감정|소송|대응/.test(source)) labels.add("공사비 검증");
  if (/클레임|소송/.test(source)) labels.add("클레임");
  if (/실행|정산/.test(source)) labels.add("본사 실행");
  if (/견적|물량산출|공내역|정미/.test(source)) labels.add("정미견적");
  if (!labels.size) labels.add("정미견적");
  if (!labels.has("본사 실행")) labels.add("본사 입찰");
  return Array.from(labels);
}

function inferProjectReceiveScopes(...texts) {
  const source = texts.filter(Boolean).join(" ");
  const labels = new Set();
  if (/마감|건축|리모델링|내부|외부|철거|창호|골조성마감/.test(source)) labels.add("마감");
  if (/클레임|소송|분쟁|감정/.test(source)) labels.add("클레임");
  if (/골조성|가설|단열|견출|방수턱/.test(source)) labels.add("골조성");
  if (/구조|골조|철근|거푸집|철골|BIM|모델링|물량산출/.test(source)) labels.add("구조팀");
  if (/BIM|모델링|3D/.test(source)) labels.add("BIM 파트");
  if (/토목|조경|흙막이|부대토목|Civil/.test(source)) labels.add("토목ㆍ조경파트");
  if (/인테리어|철거/.test(source)) labels.add("인테리어·철거");
  if (/단가/.test(source)) labels.add("단가작업");
  if (/기계|전기/.test(source)) labels.add("기계\/전기");
  if (!labels.size) labels.add("마감");
  return Array.from(labels);
}

function createProjectReceiveDummyMaterials(receivedDate = "2026.05.13") {
  return [
    { label: "도면", memo: receivedDate, status: "확인완료", comment: "업로드된 엑셀 수주소식 기준 도면 접수 확인.", confirmedBy: "박용진 수석 / 2026.05.13 13:17" },
    { label: "시방서", memo: "접수일 또는 메모", status: "미접수", comment: "첨부 엑셀 기준 별도 시방서 접수 여부 확인 필요.", confirmedBy: "" },
    { label: "현장설명서", memo: "접수일 또는 메모", status: "미접수", comment: "현장설명서 접수 여부 확인 필요.", confirmedBy: "" },
    { label: "내역서", memo: receivedDate, status: "확인완료", comment: "공내역서 또는 원가자료 접수 확인.", confirmedBy: "박용진 수석 / 2026.05.13 13:17" },
    { label: "기타자료", memo: "엑셀 수주소식", status: "확인완료", comment: "수주소식 엑셀에서 기본 프로젝트 정보를 불러온 더미데이터.", confirmedBy: "박용진 수석 / 2026.05.13 13:17" }
  ];
}

const projectReceiveCompletedProjects = [
  createProjectReceiveCompletedProject({
    sourceFile: "2026015.[(주)정림건축종합건축사사무소]미국 한화 필리조선소 합리화 공사 견적용역.xlsx",
    projectNo: "2026015",
    projectName: "미국 한화 필리조선소 합리화 공사 견적용역",
    client: "(주)정림건축종합건축사사무소",
    usage: "조선소",
    area: "47,218평",
    unitPrice: "공내역서",
    startDate: "2026.02.27(금)",
    firstDelivery: "도서 접수 후 담당자 협의",
    workContent: "마감, 구조공사 / 공내역서 작성 / V.E공사 포함 / 우선협상대상자 선정 시 견적 지원",
    request: "마감, 구조공사 / 공내역서 작성 / V.E공사 포함 / 우선협상대상자 선정 시 견적 지원 업무 포함"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026016.[(주)대광건영]로제비앙 순창GC 클럽하우스 신축공사 견적용역.xlsx",
    projectNo: "2026016",
    projectName: "로제비앙 순창GC 클럽하우스 신축공사 견적용역",
    client: "(주)대광건영",
    usage: "체육시설",
    area: "2,823평",
    floors: "B1/S2",
    unitPrice: "공내역서",
    startDate: "2026.03.05(목)",
    firstDelivery: "2026.03.20(금)",
    workContent: "구조공사 및 골조성마감 / 공내역서 작성 / 3D 모델링 산출 조건",
    request: "구조공사 및 골조성마감(가설, 단열재 포함, 견출 제외) / 공내역서 작성"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026017.[예닮건축사사무소(주)]건축설계비 청구소송(2025나12266) 감정인 대응 용역.xlsx",
    projectNo: "2026017",
    projectName: "건축설계비 청구소송(2025나12266) 감정인 대응 용역",
    client: "예닮건축사사무소(주)",
    usage: "감정·소송 대응",
    startDate: "2026.03.05(목)",
    firstDelivery: "담당자 확인 필요",
    businessTypes: ["클레임", "공사비 검증"],
    scopes: ["마감"],
    workContent: "감정 보고서 검토, 감정 신청서 검토 및 대응 방안 작성, 관련 자료 및 도면 검토",
    request: "1차 감정 보고서 검토 / 감정 신청서 대응 / 감정인 회의 참석 및 협조"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026018.[삼성물산(주)]평택 P4 Ph2 물량산출 용역.xlsx",
    projectNo: "2026018",
    projectName: "평택 P4 Ph2 물량산출 용역",
    client: "삼성물산(주)",
    usage: "반도체공장",
    area: "FAB동 44,073평 / 복합동 7,893평",
    startDate: "미팅 후 작업 착수 예정",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["정미견적", "본사 실행"],
    scopes: ["마감", "구조팀"],
    workContent: "건축 공종별 외주 정산 수량 산출 및 확인, 협의",
    request: "P4 Ph2 마감 공사 공종별 외주 정산 물량 산출 및 확인, 협의"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026019.[SK에코플랜트(주)]노량진2 재정비촉진구역 주택재개발 정비사업 견적용역.xlsx",
    projectNo: "2026019",
    projectName: "노량진2 재정비촉진구역 주택재개발 정비사업 견적용역",
    client: "SK에코플랜트(주)",
    usage: "공동주택",
    area: "25,329평",
    floors: "B4/S45",
    unitPrice: "공내역서",
    startDate: "2026.03.09(월)",
    firstDelivery: "2026.03.27(금)",
    businessTypes: ["정미견적", "본사 실행"],
    scopes: ["마감", "구조팀"],
    workContent: "마감, 구조공사 / 선실행 + 본실행",
    request: "수량산출 매뉴얼 개정본 확인 / 선실행 및 본실행 견적용역"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026020.[(주)신영씨앤디]성수동2가 322-6번지 외 1필지 업무시설 신축공사 견적용역.xlsx",
    projectNo: "2026020",
    projectName: "성수동2가 322-6번지 외 1필지 업무시설 신축공사 견적용역",
    client: "(주)신영씨앤디",
    usage: "업무시설, 근린생활시설",
    area: "2,823평",
    floors: "B4/S11",
    unitPrice: "공내역서",
    startDate: "2026.03.11(수)",
    firstDelivery: "2026.03.31(화)",
    scopes: ["마감", "구조팀", "BIM 파트"],
    workContent: "골조성마감, 구조공사(철골·탑다운 포함) / 공내역서 작성",
    request: "골조성마감(무근, 단열재), 구조공사(철골·탑다운 포함) / 공내역서 작성"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026021.[(재)21세기경제연구소]강서구 염창동 오피스텔 신축공사 견적용역_수주소식.xlsx",
    projectNo: "2026021",
    projectName: "강서구 염창동 오피스텔 신축공사 견적용역",
    client: "(재)21세기경제연구소",
    usage: "오피스텔",
    floors: "B1/S14",
    startDate: "2026.03.24(화)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["설계가", "정미견적"],
    scopes: ["마감", "토목ㆍ조경파트"],
    workContent: "마감, 토목, 조경공사 / 설계예가 작성",
    request: "마감, 토목, 조경공사 / 설계예가 작성"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026022.[(주)공간창조]이천 군량리 물류센터(2025가합9652) 부당이득금 감정보고서 대응 용역_수주소식.xlsx",
    projectNo: "2026022",
    projectName: "이천 군량리 물류센터(2025가합9652) 부당이득금 감정보고서 대응 용역",
    client: "(주)공간창조",
    usage: "물류센터",
    startDate: "2026.03.27(금)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["클레임", "공사비 검증"],
    scopes: ["마감"],
    workContent: "소송 서류, 도급계약서 및 준공도면 검토",
    request: "부당이득금 감정보고서 대응을 위한 서류 검토"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026023.[(주)리얼디자인랩건축사사무소]오산세교 상업 589-1,2번지 오피스텔 신축공사 견적용역_수주소식.xlsx",
    projectNo: "2026023",
    projectName: "오산세교 상업 589-1,2번지 오피스텔 신축공사 견적용역",
    client: "(주)리얼디자인랩건축사사무소",
    usage: "오피스텔",
    floors: "B7/S19",
    startDate: "2026.03.31(화)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["설계가", "정미견적"],
    scopes: ["마감", "구조팀", "토목ㆍ조경파트", "기계/전기"],
    workContent: "전공정 작업 / 설계예가 작성",
    request: "전공정 작업 / 설계예가 작성"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026024.[효성중공업(주)]성남 중1구역 도시환경정비사업 설계변경 견적용역_수주소식.xlsx",
    projectNo: "2026024",
    projectName: "성남 중1구역 도시환경정비사업 설계변경 견적용역",
    client: "효성중공업(주)",
    usage: "공동주택, 오피스텔",
    floors: "B4/S35",
    startDate: "2026.04.03(금)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["설계변경", "정미견적"],
    scopes: ["마감", "구조팀"],
    workContent: "설계변경 LIST 항목 변경 후/변경 전 작업",
    request: "설계변경 LIST 항목 변경 후/변경 전 견적 작업"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026025.[디자인버그 건축사사무소]남부순환로 리모델링 견적용역.xlsx",
    projectNo: "2026025",
    projectName: "남부순환로 리모델링 견적용역",
    client: "디자인버그 건축사사무소",
    usage: "교육연구 및 복지시설",
    floors: "B1/S7",
    startDate: "2026.04.20(월)",
    firstDelivery: "담당자 협의 필요",
    scopes: ["마감", "구조팀", "인테리어·철거"],
    workContent: "정미물량산출 / 마감, 구조, 인테리어, 철거공사",
    request: "4월 3주차 확정 도면 기준 1회 작업 조건"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026026.[서진건설(주)]건강보험심사평가원 미래인재개발센터 건립공사 견적용역.xlsx",
    projectNo: "2026026",
    projectName: "건강보험심사평가원 미래인재개발센터 건립공사 견적용역",
    client: "서진건설(주)",
    usage: "교육연구시설",
    floors: "B2/S4",
    startDate: "2026.04.08(수)",
    firstDelivery: "담당자 협의 필요",
    scopes: ["구조팀"],
    workContent: "정미물량산출 / 구조_거푸집",
    request: "정미물량산출(구조_거푸집)"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026027.[(주)대광건영]양주회천지구 A8블럭 공동주택 신축공사 견적용역.xlsx",
    projectNo: "2026027",
    projectName: "양주회천지구 A8블럭 공동주택 신축공사 견적용역",
    client: "(주)대광건영",
    usage: "공동주택",
    floors: "B2/S29",
    startDate: "대기중",
    firstDelivery: "담당자 협의 필요",
    scopes: ["마감", "구조팀"],
    workContent: "정미물량산출 / 마감, 구조",
    request: "정미물량산출(마감, 구조)"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026028.[폴스트먼앤코아시아(주)]연희초등학교 신축공사 견적용역.xlsx",
    projectNo: "2026028",
    projectName: "연희초등학교 신축공사 견적용역",
    client: "폴스트먼앤코아시아(주)",
    usage: "교육연구시설",
    floors: "B1/S4",
    startDate: "2026.04.09(목)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["공사비 검증", "정미견적"],
    scopes: ["마감", "구조팀"],
    workContent: "물량산출 및 원가계산서를 기반으로 한 적정공사비 확인",
    request: "물량산출 및 원가계산서 기반 적정공사비 확인"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026029.[계룡건설산업(주)]서남부 종합스포츠타운 체육시설 건립공사 견적용역.xlsx",
    projectNo: "2026029",
    projectName: "서남부 종합스포츠타운 체육시설 건립공사 견적용역",
    client: "계룡건설산업(주)",
    usage: "문화 및 집회시설",
    startDate: "5월 중순경 도면 출도 예정",
    firstDelivery: "담당자 협의 필요",
    scopes: ["마감", "구조팀", "토목ㆍ조경파트"],
    workContent: "턴키공사 기본도서 기준 수량 산출",
    request: "기본도서 기준이지만 실시도서 수준의 수량 산출 요청"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026030.[(주)티디에이종합건설]기독교 대한성결교회 한성교회 신축공사 견적용역.xlsx",
    projectNo: "2026030",
    projectName: "기독교 대한성결교회 한성교회 신축공사 견적용역",
    client: "(주)티디에이종합건설",
    usage: "종교시설",
    floors: "B2/S7",
    startDate: "2026.04.15(수)",
    firstDelivery: "담당자 협의 필요",
    scopes: ["마감", "구조팀", "토목ㆍ조경파트"],
    workContent: "정미물량산출 / 마감, 구조, 토목, 조경",
    request: "정미물량산출(마감, 구조, 토목, 조경)"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026031.[현대건설(주)]더현대광주 신축공사 건축적산용역.xlsx",
    projectNo: "2026031",
    projectName: "더현대광주 신축공사 건축적산용역",
    client: "현대건설(주)",
    usage: "판매시설",
    startDate: "2026.04.20(월)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["정미견적", "본사 입찰"],
    scopes: ["마감", "구조팀", "BIM 파트"],
    workContent: "건축적산용역 / 마감, 구조공사 수량산출 및 공내역서 작성",
    request: "더현대광주 신축공사 건축 적산 자료 기준 수량산출 및 견적 지원"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026032.[HDC현대산업개발(주)]위례 복정역세권 도시지원시설용지 1블력 견적용역.xlsx",
    projectNo: "2026032",
    projectName: "위례 복정역세권 도시지원시설용지 1블럭 견적용역",
    client: "HDC현대산업개발(주)",
    usage: "도시지원시설",
    startDate: "2026.04.21(화)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["정미견적", "본사 입찰"],
    scopes: ["마감", "구조팀", "토목ㆍ조경파트"],
    workContent: "정미물량산출 / 마감, 구조, 토목ㆍ조경 공사 범위 검토",
    request: "위례 복정역세권 도시지원시설용지 1블럭 견적용역 접수 건"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026033.[SK에코플랜트(주)]노량진7구역 주택재개발정비사업 공사비검증용역.xlsx",
    projectNo: "2026033",
    projectName: "노량진7구역 주택재개발정비사업 공사비검증용역",
    client: "SK에코플랜트(주)",
    usage: "공동주택",
    startDate: "2026.04.22(수)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["공사비 검증", "정미견적"],
    scopes: ["마감", "구조팀"],
    workContent: "주택재개발정비사업 공사비 검증 / 마감, 구조공사 검토",
    request: "노량진7구역 주택재개발정비사업 공사비검증용역 접수 건"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026034.[계룡건설산업(주)]논산 내동 도시개발사업 공동주택 신축공사 견적용역.xlsx",
    projectNo: "2026034",
    projectName: "논산 내동 도시개발사업 공동주택 신축공사 견적용역",
    client: "계룡건설산업(주)",
    usage: "공동주택",
    startDate: "2026.04.23(목)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["정미견적", "본사 입찰"],
    scopes: ["마감", "구조팀", "토목ㆍ조경파트"],
    workContent: "공동주택 신축공사 정미물량산출 / 마감, 구조, 토목ㆍ조경 공사",
    request: "논산 내동 도시개발사업 공동주택 신축공사 견적용역 접수 건"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026035.[(재)21세기경제연구소]인천 청라국제도시 C17-2-3블럭 오피스텔 신축공사 견적용역_수주소식.xlsx",
    projectNo: "2026035",
    projectName: "인천 청라국제도시 C17-2-3블럭 오피스텔 신축공사 견적용역",
    client: "(재)21세기경제연구소",
    usage: "오피스텔",
    startDate: "2026.04.24(금)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["설계가", "정미견적"],
    scopes: ["마감", "구조팀", "토목ㆍ조경파트", "기계/전기"],
    workContent: "오피스텔 신축공사 설계예가 및 정미물량산출 / 전공정 검토",
    request: "인천 청라국제도시 C17-2-3블럭 오피스텔 신축공사 수주소식 접수 건"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026036.[(주)금호E&C종합건축사사무소]독산동 1006-80번지 노유자지설 증개축 개략공사비 작성용역.xlsx",
    projectNo: "2026036",
    projectName: "독산동 1006-80번지 노유자시설 증개축 개략공사비 작성용역",
    client: "(주)금호E&C종합건축사사무소",
    usage: "노유자시설",
    startDate: "2026.04.27(월)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["개산견적", "설계가"],
    scopes: ["마감", "구조팀"],
    workContent: "증개축 개략공사비 작성 / 마감, 구조공사 기준 검토",
    request: "독산동 1006-80번지 노유자시설 증개축 개략공사비 작성용역 접수 건"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026037.[SK에코플랜트(주)]의왕시청역 SK VEIW IPARK 신축공사 견적용역.xlsx",
    projectNo: "2026037",
    projectName: "의왕시청역 SK VIEW IPARK 신축공사 견적용역",
    client: "SK에코플랜트(주)",
    usage: "공동주택",
    startDate: "2026.04.28(화)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["정미견적", "본사 입찰"],
    scopes: ["마감", "구조팀", "BIM 파트"],
    workContent: "공동주택 신축공사 견적용역 / 마감, 구조공사 및 BIM 파트 검토",
    request: "의왕시청역 SK VIEW IPARK 신축공사 견적용역 접수 건"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026038.[(재)21세기경제연구소]인천광역시 계양구 효성동 623-113외 4필지 도시형생활주택 신축공사 견적용역.xlsx",
    projectNo: "2026038",
    projectName: "인천광역시 계양구 효성동 623-113외 4필지 도시형생활주택 신축공사 견적용역",
    client: "(재)21세기경제연구소",
    usage: "도시형생활주택",
    startDate: "2026.04.29(수)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["설계가", "정미견적"],
    scopes: ["마감", "구조팀", "토목ㆍ조경파트"],
    workContent: "도시형생활주택 신축공사 설계예가 및 정미물량산출",
    request: "인천광역시 계양구 효성동 623-113외 4필지 도시형생활주택 신축공사 견적용역 접수 건"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026039.[(주)케이알산업]천안 대홍리 151-5,157-4 물류센터 신축공사 견적용역.xlsx",
    projectNo: "2026039",
    projectName: "천안 대홍리 151-5,157-4 물류센터 신축공사 견적용역",
    client: "(주)케이알산업",
    usage: "물류센터",
    startDate: "2026.04.30(목)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["정미견적", "본사 입찰"],
    scopes: ["마감", "구조팀", "토목ㆍ조경파트"],
    workContent: "물류센터 신축공사 정미물량산출 / 마감, 구조, 토목ㆍ조경 공사",
    request: "천안 대홍리 151-5,157-4 물류센터 신축공사 견적용역 접수 건"
  }),
  createProjectReceiveCompletedProject({
    sourceFile: "2026040.[삼성물산(주)]NRD-K2 적산용역.xlsx",
    projectNo: "2026040",
    projectName: "NRD-K2 적산용역",
    client: "삼성물산(주)",
    usage: "연구시설",
    startDate: "2026.05.04(월)",
    firstDelivery: "담당자 협의 필요",
    businessTypes: ["정미견적", "본사 실행"],
    scopes: ["마감", "구조팀", "BIM 파트"],
    workContent: "NRD-K2 적산용역 / 마감, 구조공사 수량산출 및 실행 검토",
    request: "NRD-K2 적산용역 접수 건"
  })
];

let selectedProjectReceiveCompletedIndex = 0;

let projectReceiveState = JSON.parse(JSON.stringify(projectReceiveSampleData));

function setProjectReceiveValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function getProjectReceiveValue(id) {
  return document.getElementById(id)?.value || "";
}

function normalizeProjectReceiveFloorPart(value, type) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const compact = raw.replace(/\s+/g, "");
  const isBasement = type === "basement";
  const prefixText = isBasement ? "지하" : "지상";

  if (compact.includes(prefixText)) return compact.endsWith("층") ? compact : `${compact}층`;

  const letter = isBasement ? "B" : "S";
  const match = compact.match(new RegExp(`${letter}\\s*([0-9]+)`, "i"));
  if (match) return `${prefixText}${match[1]}층`;

  const numberMatch = compact.match(/([0-9]+)/);
  if (numberMatch) return `${prefixText}${numberMatch[1]}층`;

  return raw;
}

function parseProjectReceiveFloors(value) {
  const raw = String(value || "").trim();
  if (!raw) return { basementFloors: "", groundFloors: "" };
  const parts = raw.split(/[\/|,]/).map(item => item.trim()).filter(Boolean);
  let basementRaw = parts.find(item => /^B/i.test(item) || item.includes("지하")) || "";
  let groundRaw = parts.find(item => /^S/i.test(item) || item.includes("지상")) || "";

  if (!basementRaw && !groundRaw && parts.length >= 2) {
    basementRaw = parts[0];
    groundRaw = parts[1];
  }

  return {
    basementFloors: normalizeProjectReceiveFloorPart(basementRaw, "basement"),
    groundFloors: normalizeProjectReceiveFloorPart(groundRaw, "ground")
  };
}

function getProjectReceiveFloorNumber(value) {
  const match = String(value || "").match(/([0-9]+)/);
  return match ? match[1] : "";
}

function composeProjectReceiveFloors(basementFloors, groundFloors) {
  const basementNo = getProjectReceiveFloorNumber(basementFloors);
  const groundNo = getProjectReceiveFloorNumber(groundFloors);
  if (basementNo && groundNo) return `B${basementNo}/S${groundNo}`;
  if (basementNo) return `B${basementNo}`;
  if (groundNo) return `S${groundNo}`;
  return "";
}

function normalizeProjectReceiveFloorState(target = projectReceiveState) {
  if (!target) return;
  const parsed = parseProjectReceiveFloors(target.floors || "");
  target.basementFloors = target.basementFloors || parsed.basementFloors;
  target.groundFloors = target.groundFloors || parsed.groundFloors;
  target.floors = composeProjectReceiveFloors(target.basementFloors, target.groundFloors) || target.floors || "";
}


function ensureProjectReceiveScopeOptions() {
  const required = [
    { label: "클레임", checked: false },
    { label: "골조성", checked: false, children: [
      { label: "가설", checked: false },
      { label: "단열", checked: false },
      { label: "견출", checked: false },
      { label: "방수턱", checked: false }
    ] }
  ];
  if (!Array.isArray(projectReceiveState.scopes)) projectReceiveState.scopes = [];
  required.forEach(option => {
    const found = projectReceiveState.scopes.find(item => item.label === option.label);
    if (!found) {
      projectReceiveState.scopes.push(JSON.parse(JSON.stringify(option)));
      return;
    }
    if (option.children) {
      if (!Array.isArray(found.children)) found.children = [];
      option.children.forEach(child => {
        if (!found.children.find(item => item.label === child.label)) found.children.push({ ...child });
      });
    }
  });
}

function getProjectReceiveScopeDisplayText(scope) {
  if (!scope?.checked) return "";
  const selectedChildren = (scope.children || []).filter(child => child.checked).map(child => child.label);
  return selectedChildren.length ? `${scope.label}(${selectedChildren.join(" · ")})` : scope.label;
}

function renderProjectReceiveDashboard() {
  ensureProjectReceiveScopeOptions();
  if (!document.getElementById("projectReceiveShell")) return;

  setProjectReceiveValue("receiveProjectName", projectReceiveState.projectName);
  setProjectReceiveValue("receiveProjectNo", projectReceiveState.projectNo);
  setProjectReceiveValue("receiveClient", projectReceiveState.client);
  setProjectReceiveValue("receiveUsage", projectReceiveState.usage);
  setProjectReceiveValue("receiveArea", projectReceiveState.area);
  setProjectReceiveValue("receiveBuildings", projectReceiveState.buildings);
  normalizeProjectReceiveFloorState(projectReceiveState);
  setProjectReceiveValue("receiveBasementFloors", projectReceiveState.basementFloors);
  setProjectReceiveValue("receiveGroundFloors", projectReceiveState.groundFloors);
  setProjectReceiveValue("receiveBidDate", projectReceiveState.bidDate);
  setProjectReceiveValue("receiveUnitPrice", projectReceiveState.unitPrice);
  setProjectReceiveValue("receivePmTotal", projectReceiveState.pmTotal);
  setProjectReceiveValue("receivePmFinish", projectReceiveState.pmFinish);
  setProjectReceiveValue("receivePmStructure", projectReceiveState.pmStructure);
  setProjectReceiveValue("receiveStartDate", projectReceiveState.startDate);
  setProjectReceiveValue("receiveFirstDelivery", projectReceiveState.firstDelivery);
  setProjectReceiveValue("receiveFinalDelivery", projectReceiveState.finalDelivery);
  setProjectReceiveValue("receiveWorkContent", projectReceiveState.workContent);
  setProjectReceiveValue("receiveNotes", projectReceiveState.notes);
  setProjectReceiveValue("receiveRequest", projectReceiveState.request);
  setProjectReceiveValue("receiveWebhardUrl", projectReceiveState.webhardUrl);
  setProjectReceiveValue("receiveWebhardId", projectReceiveState.webhardId);
  setProjectReceiveValue("receiveWebhardPw", projectReceiveState.webhardPw);
  setProjectReceiveValue("receiveWebhardNote", projectReceiveState.webhardNote);

  renderProjectReceiveStatus();
  renderProjectReceiveChips("receiveBusinessTypeChips", "businessTypes");
  renderProjectReceiveChips("receiveScopeChips", "scopes");
  renderProjectReceiveContacts();
  renderProjectReceiveMaterials();
}

function renderProjectReceiveStatus() {
  const el = document.getElementById("projectReceiveStatus");
  if (!el) return;
  const checkedScope = projectReceiveState.scopes.map(getProjectReceiveScopeDisplayText).filter(Boolean);
  const checkedMaterials = projectReceiveState.materials.filter(item => normalizeProjectReceiveMaterialStatus(item) !== "미접수").length;
  el.innerHTML = `
    <div><span>접수상태</span><strong>작성중</strong></div>
    <div><span>선택 범위</span><strong>${checkedScope.length ? checkedScope.join(" · ") : "미선택"}</strong></div>
    <div><span>접수자료</span><strong>${checkedMaterials}/${projectReceiveState.materials.length}건</strong></div>
    <div><span>납품기준</span><strong>${projectReceiveState.firstDelivery || "미입력"}</strong></div>
  `;
}

function renderProjectReceiveChips(targetId, stateKey) {
  const wrap = document.getElementById(targetId);
  if (!wrap) return;
  wrap.innerHTML = projectReceiveState[stateKey].map((item, index) => {
    const childHtml = item.children && item.checked ? `
      <div class="receive-subchip-group">
        ${item.children.map((child, childIndex) => `
          <button class="receive-subchip ${child.checked ? "active" : ""}" type="button" onclick="toggleProjectReceiveScopeChild(${index}, ${childIndex}); event.stopPropagation();">
            <span>${child.checked ? "✓" : "+"}</span>${child.label}
          </button>
        `).join("")}
      </div>
    ` : "";
    return `
      <div class="receive-chip-wrap ${item.children ? "has-subchips" : ""}">
        <button class="receive-chip ${item.checked ? "active" : ""}" type="button" onclick="toggleProjectReceiveChip('${stateKey}', ${index})">
          <span>${item.checked ? "✓" : "+"}</span>${item.label}
        </button>
        ${childHtml}
      </div>
    `;
  }).join("");
}

function toggleProjectReceiveChip(stateKey, index) {
  if (!projectReceiveState[stateKey]?.[index]) return;
  const item = projectReceiveState[stateKey][index];
  item.checked = !item.checked;
  if (!item.checked && item.children) item.children.forEach(child => { child.checked = false; });
  renderProjectReceiveDashboard();
}

function toggleProjectReceiveScopeChild(scopeIndex, childIndex) {
  const scope = projectReceiveState.scopes?.[scopeIndex];
  const child = scope?.children?.[childIndex];
  if (!scope || !child) return;
  scope.checked = true;
  child.checked = !child.checked;
  renderProjectReceiveDashboard();
}

function renderProjectReceiveContacts() {
  const list = document.getElementById("receiveContactList");
  if (!list) return;
  list.innerHTML = projectReceiveState.contacts.map((contact, index) => `
    <div class="receive-contact-row">
      <div class="receive-contact-row-index">담당자 ${index + 1}</div>
      <label class="receive-field"><span>이름</span><input value="${escapeProjectReceiveHtml(contact.name)}" oninput="updateProjectReceiveContact(${index}, 'name', this.value)" /></label>
      <label class="receive-field"><span>직급</span><input value="${escapeProjectReceiveHtml(contact.role)}" oninput="updateProjectReceiveContact(${index}, 'role', this.value)" /></label>
      <label class="receive-field"><span>부서</span><input value="${escapeProjectReceiveHtml(contact.dept)}" oninput="updateProjectReceiveContact(${index}, 'dept', this.value)" /></label>
      <label class="receive-field"><span>일반전화</span><input value="${escapeProjectReceiveHtml(contact.tel)}" oninput="updateProjectReceiveContact(${index}, 'tel', this.value)" /></label>
      <label class="receive-field"><span>휴대폰</span><input value="${escapeProjectReceiveHtml(contact.mobile)}" oninput="updateProjectReceiveContact(${index}, 'mobile', this.value)" /></label>
      <label class="receive-field"><span>이메일</span><input value="${escapeProjectReceiveHtml(contact.email)}" oninput="updateProjectReceiveContact(${index}, 'email', this.value)" /></label>
      <button class="receive-contact-delete" type="button" onclick="removeProjectReceiveContact(${index})">삭제</button>
    </div>
  `).join("");
}

function updateProjectReceiveContact(index, key, value) {
  if (!projectReceiveState.contacts[index]) return;
  projectReceiveState.contacts[index][key] = value;
}

function addProjectReceiveContact() {
  projectReceiveState.contacts.push({ name: "", role: "", dept: "", tel: "", mobile: "", email: "" });
  renderProjectReceiveContacts();
}

function removeProjectReceiveContact(index) {
  if (projectReceiveState.contacts.length === 1) {
    projectReceiveState.contacts = [{ name: "", role: "", dept: "", tel: "", mobile: "", email: "" }];
  } else {
    projectReceiveState.contacts.splice(index, 1);
  }
  renderProjectReceiveContacts();
}

function renderProjectReceiveMaterials() {
  const list = document.getElementById("receiveMaterialList");
  if (!list) return;
  list.innerHTML = `
    <div class="receive-material-toolbar">
      <button class="receive-material-add-btn" type="button" onclick="addProjectReceiveMaterial()">+ 행 추가</button>
    </div>
    ${projectReceiveState.materials.map((item, index) => {
      const status = normalizeProjectReceiveMaterialStatus(item);
      const comment = item.comment || getProjectReceiveMaterialDefaultComment(status);
      const hasHistory = Boolean(item.confirmedBy);
      return `
      <div class="receive-material-item status-${getProjectReceiveMaterialStatusClass(status)}">
        <div class="receive-material-name">${escapeProjectReceiveHtml(item.label)}</div>
        <input class="receive-material-memo" value="${escapeProjectReceiveHtml(item.memo)}" placeholder="접수일 또는 메모" oninput="updateProjectReceiveMaterialMemo(${index}, this.value)" />
        <div class="receive-material-status-actions" role="group" aria-label="${escapeProjectReceiveHtml(item.label)} 접수 상태">
          ${["확인완료", "미접수", "일부접수"].map(option => `
            <button class="receive-material-status-btn ${status === option ? "active" : ""}" type="button" onclick="setProjectReceiveMaterialStatus(${index}, '${option}')">${option}</button>
          `).join("")}
        </div>
        <div class="receive-material-history">${hasHistory ? `확인: ${escapeProjectReceiveHtml(item.confirmedBy)}` : "확인 이력 없음"}</div>
        <button class="receive-material-delete-btn" type="button" onclick="removeProjectReceiveMaterial(${index})">삭제</button>
        <textarea class="receive-material-comment" rows="2" placeholder="미접수 또는 일부접수 사유/코멘트" oninput="updateProjectReceiveMaterialComment(${index}, this.value)">${escapeProjectReceiveHtml(comment)}</textarea>
        <div class="receive-material-attach-area">
          <button class="receive-material-attach-btn" type="button" onclick="openProjectReceiveMaterialUploadModal(${index})">파일첨부</button>
          <span>${getProjectReceiveMaterialUploadCountText(item)}</span>
        </div>
      </div>
    `;
    }).join("")}
  `;
}

function normalizeProjectReceiveMaterialStatus(item) {
  if (item?.status) return item.status;
  if (item?.confirmed) return "확인완료";
  if (item?.checked) return "일부접수";
  return "미접수";
}

function getProjectReceiveMaterialStatusClass(status) {
  if (status === "확인완료") return "complete";
  if (status === "일부접수") return "partial";
  return "missing";
}

function getProjectReceiveMaterialDefaultComment(status) {
  if (status === "일부접수") return "건축 구조 도면은 접수 받았으나 계약범위인 토목도서는 미접수 되었으므로 담당자 확인요망";
  if (status === "미접수") return "자료 미접수 상태입니다. 발주처 담당자 확인이 필요합니다.";
  return "";
}

function updateProjectReceiveMaterialMemo(index, value) {
  if (!projectReceiveState.materials[index]) return;
  projectReceiveState.materials[index].memo = value;
}

function updateProjectReceiveMaterialComment(index, value) {
  if (!projectReceiveState.materials[index]) return;
  projectReceiveState.materials[index].comment = value;
}

function getProjectReceiveMaterialUploadCountText(item) {
  const count = Array.isArray(item?.uploads) ? item.uploads.length : 0;
  return count ? `접수자료 ${count}건` : "첨부 없음";
}

function getProjectReceiveUploadStamp() {
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function ensureProjectReceiveMaterialUploads(index) {
  const item = projectReceiveState.materials[index];
  if (!item) return [];
  if (!Array.isArray(item.uploads)) item.uploads = [];
  return item.uploads;
}

let projectReceiveUploadMaterialIndex = null;

function openProjectReceiveMaterialUploadModal(index) {
  if (!projectReceiveState.materials[index]) return;
  projectReceiveUploadMaterialIndex = index;
  ensureProjectReceiveMaterialUploadModal();
  renderProjectReceiveMaterialUploadModal();
  document.getElementById("projectReceiveMaterialUploadModal")?.classList.add("active");
}

function closeProjectReceiveMaterialUploadModal() {
  document.getElementById("projectReceiveMaterialUploadModal")?.classList.remove("active");
  projectReceiveUploadMaterialIndex = null;
}

function ensureProjectReceiveMaterialUploadModal() {
  if (document.getElementById("projectReceiveMaterialUploadModal")) return;
  const modal = document.createElement("div");
  modal.id = "projectReceiveMaterialUploadModal";
  modal.className = "modal-backdrop receive-upload-modal";
  modal.innerHTML = `
    <div class="modal receive-upload-box">
      <div class="modal-head">
        <div>
          <h2 id="receiveUploadModalTitle">접수자료 파일첨부</h2>
          <p class="subcopy">파일을 추가할 때마다 접수자료(1차), 접수자료(2차) 순서로 이력이 생성됩니다.</p>
        </div>
        <button class="close" type="button" onclick="closeProjectReceiveMaterialUploadModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="receive-upload-control">
          <label class="receive-upload-button">
            <input id="receiveUploadFileInput" type="file" onchange="addProjectReceiveMaterialUploadFromInput(this)" />
            <span>업로드 파일 선택</span>
          </label>
          <em>파일 선택 시 현재 날짜와 함께 접수자료 차수가 자동 기록됩니다.</em>
        </div>
        <div id="receiveUploadHistoryList" class="receive-upload-history-list"></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-line" type="button" onclick="closeProjectReceiveMaterialUploadModal()">닫기</button>
      </div>
    </div>
  `;
  modal.addEventListener("click", event => {
    if (event.target === modal) closeProjectReceiveMaterialUploadModal();
  });
  document.body.appendChild(modal);
}

function addProjectReceiveMaterialUploadFromInput(input) {
  const index = projectReceiveUploadMaterialIndex;
  const item = projectReceiveState.materials[index];
  const file = input?.files?.[0];
  if (!item || !file) return;
  const uploads = ensureProjectReceiveMaterialUploads(index);
  const nextRound = uploads.length + 1;
  uploads.push({
    round: nextRound,
    title: `접수자료(${nextRound}차)`,
    fileName: file.name,
    uploadedAt: getProjectReceiveUploadStamp(),
    phoneComment: ""
  });
  input.value = "";
  if (item.status === "미접수") {
    item.status = "일부접수";
    item.checked = true;
    item.confirmedBy = getProjectReceiveConfirmStamp();
  }
  renderProjectReceiveMaterialUploadModal();
  renderProjectReceiveMaterials();
  renderProjectReceiveStatus();
}

function renderProjectReceiveMaterialUploadModal() {
  const index = projectReceiveUploadMaterialIndex;
  const item = projectReceiveState.materials[index];
  const title = document.getElementById("receiveUploadModalTitle");
  const list = document.getElementById("receiveUploadHistoryList");
  if (!item || !list) return;
  if (title) title.textContent = `${item.label} 파일첨부`;
  const uploads = ensureProjectReceiveMaterialUploads(index);
  if (!uploads.length) {
    list.innerHTML = `<div class="receive-upload-empty">아직 첨부된 파일이 없습니다.</div>`;
    return;
  }
  list.innerHTML = uploads.map((upload, uploadIndex) => `
    <div class="receive-upload-history-item">
      <div class="receive-upload-history-main">
        <strong>${escapeProjectReceiveHtml(upload.title || `접수자료(${uploadIndex + 1}차)`)}</strong>
        <span>${escapeProjectReceiveHtml(upload.fileName || "파일명 없음")}</span>
        <em>최초 업로드: ${escapeProjectReceiveHtml(upload.uploadedAt || "날짜 없음")}</em>
      </div>
      <textarea rows="2" placeholder="경영지원팀 유선 확인 내용 또는 추가 코멘트" oninput="updateProjectReceiveMaterialUploadComment(${index}, ${uploadIndex}, this.value)">${escapeProjectReceiveHtml(upload.phoneComment || "")}</textarea>
      <button class="receive-upload-remove-btn" type="button" onclick="removeProjectReceiveMaterialUpload(${index}, ${uploadIndex})">삭제</button>
    </div>
  `).join("");
}

function updateProjectReceiveMaterialUploadComment(materialIndex, uploadIndex, value) {
  const uploads = ensureProjectReceiveMaterialUploads(materialIndex);
  if (!uploads[uploadIndex]) return;
  uploads[uploadIndex].phoneComment = value;
}

function removeProjectReceiveMaterialUpload(materialIndex, uploadIndex) {
  const uploads = ensureProjectReceiveMaterialUploads(materialIndex);
  if (!uploads[uploadIndex]) return;
  uploads.splice(uploadIndex, 1);
  uploads.forEach((upload, index) => {
    upload.round = index + 1;
    upload.title = `접수자료(${index + 1}차)`;
  });
  renderProjectReceiveMaterialUploadModal();
  renderProjectReceiveMaterials();
  renderProjectReceiveStatus();
}

function addProjectReceiveMaterial() {
  projectReceiveState.materials.push({
    label: "추가자료",
    memo: "",
    status: "미접수",
    comment: "접수받은 내용 없음.",
    confirmedBy: "",
    uploads: []
  });
  renderProjectReceiveMaterials();
  renderProjectReceiveStatus();
}

function removeProjectReceiveMaterial(index) {
  if (!projectReceiveState.materials[index]) return;
  if (projectReceiveState.materials.length <= 1) {
    projectReceiveState.materials = [{ label: "기타자료", memo: "", status: "미접수", comment: "접수받은 내용 없음.", confirmedBy: "", uploads: [] }];
  } else {
    projectReceiveState.materials.splice(index, 1);
  }
  renderProjectReceiveMaterials();
  renderProjectReceiveStatus();
}

function setProjectReceiveMaterialStatus(index, status) {
  if (!projectReceiveState.materials[index]) return;
  const item = projectReceiveState.materials[index];
  item.status = status;
  item.checked = status !== "미접수";
  item.confirmed = status === "확인완료";
  item.confirmedBy = getProjectReceiveConfirmStamp();
  if ((status === "미접수" || status === "일부접수") && !item.comment) {
    item.comment = getProjectReceiveMaterialDefaultComment(status);
  }
  if (status === "확인완료" && !item.comment) {
    item.comment = `${item.label} 접수 확인.`;
  }
  renderProjectReceiveMaterials();
  renderProjectReceiveStatus();
}

function toggleProjectReceiveMaterial(index, checked) {
  if (!projectReceiveState.materials[index]) return;
  setProjectReceiveMaterialStatus(index, checked ? "확인완료" : "미접수");
}

function confirmProjectReceiveMaterial(index) {
  if (!projectReceiveState.materials[index]) return;
  const currentStatus = normalizeProjectReceiveMaterialStatus(projectReceiveState.materials[index]);
  setProjectReceiveMaterialStatus(index, currentStatus === "확인완료" ? "미접수" : "확인완료");
}

function syncProjectReceiveInputsToState() {
  projectReceiveState.projectName = getProjectReceiveValue("receiveProjectName");
  projectReceiveState.projectNo = getProjectReceiveValue("receiveProjectNo");
  projectReceiveState.client = getProjectReceiveValue("receiveClient");
  projectReceiveState.usage = getProjectReceiveValue("receiveUsage");
  projectReceiveState.area = getProjectReceiveValue("receiveArea");
  projectReceiveState.buildings = getProjectReceiveValue("receiveBuildings");
  projectReceiveState.basementFloors = normalizeProjectReceiveFloorPart(getProjectReceiveValue("receiveBasementFloors"), "basement");
  projectReceiveState.groundFloors = normalizeProjectReceiveFloorPart(getProjectReceiveValue("receiveGroundFloors"), "ground");
  projectReceiveState.floors = composeProjectReceiveFloors(projectReceiveState.basementFloors, projectReceiveState.groundFloors);
  projectReceiveState.bidDate = getProjectReceiveValue("receiveBidDate");
  projectReceiveState.unitPrice = getProjectReceiveValue("receiveUnitPrice");
  projectReceiveState.pmTotal = getProjectReceiveValue("receivePmTotal");
  projectReceiveState.pmFinish = getProjectReceiveValue("receivePmFinish");
  projectReceiveState.pmStructure = getProjectReceiveValue("receivePmStructure");
  projectReceiveState.startDate = getProjectReceiveValue("receiveStartDate");
  projectReceiveState.firstDelivery = getProjectReceiveValue("receiveFirstDelivery");
  projectReceiveState.finalDelivery = getProjectReceiveValue("receiveFinalDelivery");
  projectReceiveState.workContent = getProjectReceiveValue("receiveWorkContent");
  projectReceiveState.notes = getProjectReceiveValue("receiveNotes");
  projectReceiveState.request = getProjectReceiveValue("receiveRequest");
  projectReceiveState.webhardUrl = getProjectReceiveValue("receiveWebhardUrl");
  projectReceiveState.webhardId = getProjectReceiveValue("receiveWebhardId");
  projectReceiveState.webhardPw = getProjectReceiveValue("receiveWebhardPw");
  projectReceiveState.webhardNote = getProjectReceiveValue("receiveWebhardNote");
}

function saveProjectReceiveDraft() {
  syncProjectReceiveInputsToState();
  if (!validateProjectReceiveSkeletonScope()) {
    renderProjectReceiveDashboard();
    showToast("골조성을 선택한 경우 가설, 단열, 견출, 방수턱 중 최소 1개를 선택해야 접수저장이 가능합니다.");
    return;
  }
  renderProjectReceiveStatus();
  if (typeof registerPmScheduleProjectFromReceive === "function") {
    registerPmScheduleProjectFromReceive(projectReceiveState);
  } else {
    showToast("프로젝트 접수 내용이 임시 저장되었습니다.");
  }
}

function resetProjectReceiveForm() {
  projectReceiveState = JSON.parse(JSON.stringify(projectReceiveDefaultData));
  renderProjectReceiveDashboard();
  showToast("프로젝트 접수 입력값을 초기화했습니다.");
}

function loadProjectReceiveSample() {
  projectReceiveState = JSON.parse(JSON.stringify(projectReceiveSampleData));
  renderProjectReceiveDashboard();
  showToast("견적용역 예시 데이터를 불러왔습니다.");
}


function openProjectReceiveCompletedList() {
  ensureProjectReceiveCompletedModal();
  selectedProjectReceiveCompletedIndex = 0;
  renderProjectReceiveCompletedList();
  document.getElementById("projectReceiveCompletedModal")?.classList.add("active");
}

function closeProjectReceiveCompletedList() {
  document.getElementById("projectReceiveCompletedModal")?.classList.remove("active");
}

function ensureProjectReceiveCompletedModal() {
  if (document.getElementById("projectReceiveCompletedModal")) return;
  const modal = document.createElement("div");
  modal.id = "projectReceiveCompletedModal";
  modal.className = "modal-backdrop project-receive-completed-modal";
  modal.innerHTML = `
    <div class="modal project-receive-completed-box">
      <div class="modal-head">
        <div>
          <h3>작성완료 리스트</h3>
          <p>업로드된 엑셀 자료 기준으로 작성 완료된 수주소식을 선택해 수정할 수 있습니다.</p>
        </div>
        <button class="close" type="button" onclick="closeProjectReceiveCompletedList()">×</button>
      </div>
      <div class="modal-body">
        <div class="project-receive-completed-summary">
          <strong>총 ${projectReceiveCompletedProjects.length}건</strong>
          <span>프로젝트를 클릭한 뒤 하단의 수정 버튼을 누르면 접수 화면으로 불러옵니다.</span>
        </div>
        <div class="project-receive-completed-list" id="projectReceiveCompletedList"></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-line" type="button" onclick="closeProjectReceiveCompletedList()">닫기</button>
        <button class="btn btn-primary" type="button" onclick="loadSelectedProjectReceiveCompleted()">선택 프로젝트 수정</button>
      </div>
    </div>
  `;
  modal.addEventListener("click", event => {
    if (event.target === modal) closeProjectReceiveCompletedList();
  });
  document.body.appendChild(modal);
}

function renderProjectReceiveCompletedList() {
  const list = document.getElementById("projectReceiveCompletedList");
  if (!list) return;
  list.innerHTML = projectReceiveCompletedProjects.map((item, index) => {
    const data = item.data;
    const scopeText = data.scopes.map(getProjectReceiveScopeDisplayText).filter(Boolean).join(" · ") || "미선택";
    return `
      <button class="project-receive-completed-item ${selectedProjectReceiveCompletedIndex === index ? "active" : ""}" type="button" onclick="selectProjectReceiveCompleted(${index})">
        <span class="completed-no">${escapeProjectReceiveHtml(data.projectNo)}</span>
        <span class="completed-main">
          <strong>${escapeProjectReceiveHtml(data.projectName)}</strong>
          <em>${escapeProjectReceiveHtml(data.client)} · ${escapeProjectReceiveHtml(scopeText)}</em>
          <small>${escapeProjectReceiveHtml(item.sourceFile)}</small>
        </span>
        <span class="completed-date">작성완료<br>${escapeProjectReceiveHtml(item.completedAt)}</span>
      </button>
    `;
  }).join("");
}

function selectProjectReceiveCompleted(index) {
  selectedProjectReceiveCompletedIndex = index;
  renderProjectReceiveCompletedList();
}

function loadSelectedProjectReceiveCompleted() {
  const selected = projectReceiveCompletedProjects[selectedProjectReceiveCompletedIndex];
  if (!selected) return;
  projectReceiveState = JSON.parse(JSON.stringify(selected.data));
  renderProjectReceiveDashboard();
  closeProjectReceiveCompletedList();
  showToast(`${selected.data.projectNo} 수주소식을 수정 화면으로 불러왔습니다.`);
}


function getProjectReceiveConfirmStamp() {
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mi = pad(now.getMinutes());
  return `박용진 수석 / ${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

function escapeProjectReceiveHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function isEstimateDbManageActive() {
  return document.getElementById("estimateDbManage")?.classList.contains("active");
}

function handleEstimateDbScopedCommand(event) {
  if (!isEstimateDbManageActive()) return;
  const key = String(event.key || "");
  const lower = key.toLowerCase();
  const saveKey = event.ctrlKey && lower === "s";
  const linkSaveKey = event.ctrlKey && key === "Enter";
  const commandKey = event.ctrlKey && ["f9", "f3", "delete", "del"].includes(lower);
  const stageAddKey = event.altKey && (key === "Insert" || lower === "insert");
  const arrowKey = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key);
  if (!saveKey && !linkSaveKey && !commandKey && !stageAddKey && !arrowKey) return;

  const active = document.activeElement;
  const activeInput = active?.classList?.contains("quote-db-cell-input") ? active : null;
  if (saveKey) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    commitEstimateDbPendingEdits();
    return;
  }
  if (linkSaveKey) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    syncEstimateDbNewPjRowsToLinkedSheets();
    return;
  }
  if (activeInput && !stageAddKey) return;

  if (stageAddKey) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    if (estimateDbActiveTab === "progress") addEstimateDbProgressStageColumns();
    return;
  }

  if (commandKey) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    const cell = estimateDbSelectedCell || { rowIndex: 0, colIndex: 0 };
    if (lower === "f9") {
      addEstimateDbRow(null, (cell.rowIndex || 0) + 1);
      requestAnimationFrame(() => focusEstimateDbCell((cell.rowIndex || 0) + 1, cell.colIndex || 0));
    } else if (lower === "f3") {
      duplicateEstimateDbRow(cell.rowIndex || 0);
      requestAnimationFrame(() => focusEstimateDbCell((cell.rowIndex || 0) + 1, cell.colIndex || 0));
    } else {
      removeEstimateDbRow(cell.rowIndex || 0);
      requestAnimationFrame(() => focusEstimateDbCell(Math.max(0, (cell.rowIndex || 0) - 1), cell.colIndex || 0));
    }
  }
}

document.addEventListener("keydown", handleEstimateDbScopedCommand, true);

function bootEstimateDbDefaultScreen() {
  if (typeof switchWorkPanel === "function") {
    switchWorkPanel("estimateSheetManage");
  }
  estimateDbActiveTab = estimateDbActiveTab || "pj";
  estimateDbReportActiveTab = estimateDbReportActiveTab || "summary";
  renderEstimateDbManage();
  document.querySelectorAll(".side-sub").forEach(menu => {
    const isEstimate = menu.classList.contains("estimate-quote-sub-menu");
    menu.classList.toggle("active", isEstimate);
  });
  document.querySelectorAll(".project-receive-sub-menu, .pm-schedule-sub-menu").forEach(menu => menu.classList.remove("active"));
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjectReceiveDashboard();
  setTimeout(bootEstimateDbDefaultScreen, 0);
});


function getProjectReceiveListItems() {
  const completed = (typeof projectReceiveCompletedProjects !== "undefined" ? projectReceiveCompletedProjects : [])
    .map((item, index) => ({
      source: "completed",
      index,
      data: item.data || item,
      status: "작성완료"
    }));

  const current = (typeof projectReceiveState !== "undefined" && projectReceiveState?.projectNo)
    ? [{ source: "current", index: -1, data: projectReceiveState, status: "작성중" }]
    : [];

  const merged = [...current, ...completed];
  const seen = new Set();
  return merged.filter(item => {
    const key = item.data?.projectNo || `${item.data?.projectName || ""}-${item.data?.client || ""}`;
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getProjectReceiveListScopeText(data) {
  const scopes = Array.isArray(data?.scopes) ? data.scopes : [];
  return scopes
    .map(item => typeof item === "string" ? item : (item?.checked ? item.label : ""))
    .filter(Boolean)
    .join(" · ") || "미선택";
}


function getProjectReceivePmAssignment(data = {}) {
  const assignment = {
    pmFinish: data.pmFinish || "",
    pmStructure: data.pmStructure || "",
    pmBim: data.pmBim || "",
    pmCivil: data.pmCivil || ""
  };

  if (typeof pmScheduleProjects !== "undefined" && Array.isArray(pmScheduleProjects)) {
    const projectNo = String(data.projectNo || "").trim();
    const matched = pmScheduleProjects.find(item => String(item?.project?.projectNo || "").trim() === projectNo);
    if (matched?.assignment) {
      assignment.pmFinish = matched.assignment.pmFinish || assignment.pmFinish;
      assignment.pmStructure = matched.assignment.pmStructure || assignment.pmStructure;
      assignment.pmBim = matched.assignment.pmBim || assignment.pmBim;
      assignment.pmCivil = matched.assignment.pmCivil || assignment.pmCivil;
    }
  }

  return assignment;
}

function getProjectReceivePmAssignmentDisplay(data = {}) {
  const assignment = getProjectReceivePmAssignment(data);
  return [
    { label: "마감팀 PM", value: assignment.pmFinish },
    { label: "구조팀 PM", value: assignment.pmStructure },
    { label: "BIM파트 PM", value: assignment.pmBim },
    { label: "토목ㆍ조경파트 PM", value: assignment.pmCivil }
  ];
}

function applyPmScheduleAssignmentToProjectReceiveData(projectNo, assignment = {}) {
  const targetNo = String(projectNo || "").trim();
  if (!targetNo) return;

  const assignTo = data => {
    if (!data || String(data.projectNo || "").trim() !== targetNo) return;
    data.pmFinish = assignment.pmFinish || "";
    data.pmStructure = assignment.pmStructure || "";
    data.pmBim = assignment.pmBim || "";
    data.pmCivil = assignment.pmCivil || "";
  };

  if (typeof projectReceiveState !== "undefined") assignTo(projectReceiveState);
  if (typeof projectReceiveCompletedProjects !== "undefined" && Array.isArray(projectReceiveCompletedProjects)) {
    projectReceiveCompletedProjects.forEach(item => assignTo(item.data || item));
  }

  if (document.getElementById("projectReceiveListBody")) renderProjectReceiveListView();
}

function renderProjectReceiveListView() {
  const body = document.getElementById("projectReceiveListBody");
  const summary = document.getElementById("projectReceiveListSummary");
  if (!body) return;

  const query = (document.getElementById("projectReceiveListSearch")?.value || "").trim().toLowerCase();
  const scopeFilter = document.getElementById("projectReceiveListScopeFilter")?.value || "전체";
  const items = getProjectReceiveListItems();
  const filtered = items.filter(item => {
    const data = item.data || {};
    const scopeText = getProjectReceiveListScopeText(data);
    const searchTarget = [
      data.projectNo,
      data.projectName,
      data.client,
      data.usage,
      data.area,
      data.floors,
      data.basementFloors,
      data.groundFloors,
      scopeText,
      data.firstDelivery,
      item.status
    ].join(" ").toLowerCase();
    const matchesQuery = !query || searchTarget.includes(query);
    const matchesScope = scopeFilter === "전체" || scopeText.includes(scopeFilter);
    return matchesQuery && matchesScope;
  });

  if (summary) {
    const completedCount = items.filter(item => item.status === "작성완료").length;
    const currentCount = items.filter(item => item.status === "작성중").length;
    summary.innerHTML = `
      <div><span>전체 프로젝트</span><strong>${items.length}건</strong></div>
      <div><span>작성완료</span><strong>${completedCount}건</strong></div>
      <div><span>작성중</span><strong>${currentCount}건</strong></div>
      <div><span>현재 표시</span><strong>${filtered.length}건</strong></div>
    `;
  }

  if (!filtered.length) {
    body.innerHTML = `<tr><td colspan="10" class="project-list-empty">조건에 맞는 프로젝트가 없습니다.</td></tr>`;
    return;
  }

  body.innerHTML = filtered.map(item => {
    const data = item.data || {};
    const scopeText = getProjectReceiveListScopeText(data);
    const parsedFloors = parseProjectReceiveFloors(data.floors || "");
    const basementFloors = data.basementFloors || parsedFloors.basementFloors || "-";
    const groundFloors = data.groundFloors || parsedFloors.groundFloors || "-";
    const statusClass = item.status === "작성완료" ? "completed" : "writing";
    return `
      <tr class="project-list-clickable-row" onclick="openProjectReceiveListViewer('${escapeProjectReceiveHtml(item.source)}', ${Number(item.index)})">
        <td><strong>${escapeProjectReceiveHtml(data.projectNo || "-")}</strong></td>
        <td class="project-list-name">${escapeProjectReceiveHtml(data.projectName || "프로젝트명 미입력")}</td>
        <td>${escapeProjectReceiveHtml(data.client || "-")}</td>
        <td>${escapeProjectReceiveHtml(data.usage || "-")}</td>
        <td>${escapeProjectReceiveHtml(data.area || "-")}</td>
        <td>${escapeProjectReceiveHtml(basementFloors)}</td>
        <td>${escapeProjectReceiveHtml(groundFloors)}</td>
        <td>${escapeProjectReceiveHtml(scopeText)}</td>
        <td>${escapeProjectReceiveHtml(data.firstDelivery || "미입력")}</td>
        <td><span class="project-list-status ${statusClass}">${item.status}</span></td>
      </tr>
    `;
  }).join("");
}

function getProjectReceiveViewerItem(source, index) {
  if (source === "current") {
    return { source, index: -1, data: projectReceiveState, status: "작성중" };
  }
  if (source === "completed") {
    const item = projectReceiveCompletedProjects[index];
    return item ? { source, index, data: item.data || item, status: "작성완료", sourceFile: item.sourceFile || "", completedAt: item.completedAt || "" } : null;
  }
  return null;
}

function openProjectReceiveListViewer(source, index) {
  const item = getProjectReceiveViewerItem(source, index);
  if (!item) return;
  ensureProjectReceiveListViewerModal();
  const modal = document.getElementById("projectReceiveListViewerModal");
  const body = document.getElementById("projectReceiveListViewerBody");
  if (!modal || !body) return;

  const data = item.data || {};
  const scopeText = getProjectReceiveListScopeText(data);
  const businessText = (data.businessTypes || []).filter(v => v?.checked).map(v => v.label).join(" · ") || "미선택";
  const parsedFloors = parseProjectReceiveFloors(data.floors || "");
  const basementFloors = data.basementFloors || parsedFloors.basementFloors || "-";
  const groundFloors = data.groundFloors || parsedFloors.groundFloors || "-";
  const pmAssignmentRows = getProjectReceivePmAssignmentDisplay(data);
  const materialText = (data.materials || []).map(material => {
    const status = normalizeProjectReceiveMaterialStatus(material);
    return `<li><strong>${escapeProjectReceiveHtml(material.label || "자료")}</strong><span>${escapeProjectReceiveHtml(status)}</span><em>${escapeProjectReceiveHtml(material.comment || material.memo || "-")}</em></li>`;
  }).join("");

  body.innerHTML = `
    <div class="project-viewer-title-row">
      <div>
        <span class="project-list-status ${item.status === "작성완료" ? "completed" : "writing"}">${escapeProjectReceiveHtml(item.status || "작성중")}</span>
        <h3>${escapeProjectReceiveHtml(data.projectName || "프로젝트명 미입력")}</h3>
        <p>${escapeProjectReceiveHtml(data.projectNo || "NO 미입력")} · ${escapeProjectReceiveHtml(data.client || "의뢰처 미입력")}</p>
      </div>
      <button class="btn btn-primary" type="button" onclick="editProjectReceiveFromViewer('${escapeProjectReceiveHtml(item.source)}', ${Number(item.index)})">수정하기</button>
    </div>

    <div class="project-viewer-grid">
      <div><span>프로젝트 NO</span><strong>${escapeProjectReceiveHtml(data.projectNo || "-")}</strong></div>
      <div><span>의뢰처</span><strong>${escapeProjectReceiveHtml(data.client || "-")}</strong></div>
      <div><span>건물용도</span><strong>${escapeProjectReceiveHtml(data.usage || "-")}</strong></div>
      <div><span>연면적</span><strong>${escapeProjectReceiveHtml(data.area || "-")}</strong></div>
      <div><span>동수</span><strong>${escapeProjectReceiveHtml(data.buildings || "-")}</strong></div>
      <div><span>지하층수</span><strong>${escapeProjectReceiveHtml(basementFloors)}</strong></div>
      <div><span>지상층수</span><strong>${escapeProjectReceiveHtml(groundFloors)}</strong></div>
      <div><span>입찰일</span><strong>${escapeProjectReceiveHtml(data.bidDate || "-")}</strong></div>
      <div><span>단가작업여부</span><strong>${escapeProjectReceiveHtml(data.unitPrice || "-")}</strong></div>
      <div><span>납품기준</span><strong>${escapeProjectReceiveHtml(data.firstDelivery || "미입력")}</strong></div>
      <div><span>최종 납품</span><strong>${escapeProjectReceiveHtml(data.finalDelivery || "미입력")}</strong></div>
    </div>

    <div class="project-viewer-section">
      <h4>업무의 성격</h4>
      <p>${escapeProjectReceiveHtml(businessText)}</p>
    </div>
    <div class="project-viewer-section">
      <h4>작업범위</h4>
      <p>${escapeProjectReceiveHtml(scopeText)}</p>
    </div>
    <div class="project-viewer-section">
      <h4>PM 지정</h4>
      <div class="project-viewer-pm-list">
        ${pmAssignmentRows.map(row => `<div><span>${escapeProjectReceiveHtml(row.label)}</span><strong>${escapeProjectReceiveHtml(row.value || "미지정")}</strong></div>`).join("")}
      </div>
    </div>
    <div class="project-viewer-section">
      <h4>접수자료</h4>
      <ul class="project-viewer-material-list">${materialText || "<li><strong>자료 없음</strong><span>-</span><em>-</em></li>"}</ul>
    </div>
    <div class="project-viewer-section">
      <h4>웹하드 정보</h4>
      <p>${escapeProjectReceiveHtml([data.webhardUrl, data.webhardId ? `ID: ${data.webhardId}` : "", data.webhardPw ? `PW: ${data.webhardPw}` : "", data.webhardNote].filter(Boolean).join(" / ") || "입력 내용 없음")}</p>
    </div>
    <div class="project-viewer-section">
      <h4>작업내용 / 요청사항</h4>
      <p>${escapeProjectReceiveHtml(data.workContent || data.request || data.notes || "입력 내용 없음")}</p>
    </div>
  `;
  modal.classList.add("active");
}

function closeProjectReceiveListViewer() {
  document.getElementById("projectReceiveListViewerModal")?.classList.remove("active");
}

function editProjectReceiveFromViewer(source, index) {
  const item = getProjectReceiveViewerItem(source, index);
  if (!item) return;
  projectReceiveState = JSON.parse(JSON.stringify(item.data || {}));
  normalizeProjectReceiveFloorState(projectReceiveState);
  closeProjectReceiveListViewer();
  if (typeof switchWorkPanel === "function") switchWorkPanel("projectReceive");
  renderProjectReceiveDashboard();
  showToast(`${projectReceiveState.projectNo || "선택 프로젝트"} 프로젝트를 수정 화면으로 불러왔습니다.`);
}

function ensureProjectReceiveListViewerModal() {
  if (document.getElementById("projectReceiveListViewerModal")) return;
  const modal = document.createElement("div");
  modal.id = "projectReceiveListViewerModal";
  modal.className = "modal-backdrop project-receive-viewer-modal";
  modal.innerHTML = `
    <div class="modal modal-wide project-receive-viewer-box">
      <div class="modal-head">
        <div>
          <h3>프로젝트 접수 상세</h3>
          <p>프로젝트 작성 화면에 입력된 내용을 뷰어 형식으로 확인합니다.</p>
        </div>
        <button class="close" type="button" onclick="closeProjectReceiveListViewer()">×</button>
      </div>
      <div class="modal-body" id="projectReceiveListViewerBody"></div>
      <div class="modal-foot">
        <button class="btn btn-line" type="button" onclick="closeProjectReceiveListViewer()">닫기</button>
      </div>
    </div>
  `;
  modal.addEventListener("click", event => {
    if (event.target === modal) closeProjectReceiveListViewer();
  });
  document.body.appendChild(modal);
}


/* =========================================================
   프로젝트 관리 v1
   - 프로젝트 작성 / 프로젝트 관리 세부 카테고리
   - 견적 기록 저장, 수정, 프로젝트 접수 화면 불러오기
   - 업로드된 견적서 XLSX 양식 다운로드
========================================================= */

/* =========================================================
   2026-05-28 프로젝트 리스트 중심 연계 패치
   - DB관리까지는 정식 수주 전 후보 데이터로 유지
   - 프로젝트 접수/리스트 저장 이후부터 PM배정/일정, 프로젝트 관리, 질의응답의 기준 데이터로 사용
   - PM배정/일정에서 지정한 PM 값은 가장 최신값으로 프로젝트 리스트와 DB관리(PJ관리)에 역반영
   ========================================================= */
function projectReceiveLinkText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}
function projectReceiveLinkKey(data = {}) {
  const no = projectReceiveLinkText(data.projectNo || data.pjNo || data.dbPjNo);
  if (no) return `NO:${no}`;
  const project = projectReceiveLinkText(data.projectName || data.name);
  const client = projectReceiveLinkText(data.client || data.company);
  return `NAME:${project}::${client}`;
}
function projectReceiveFindCompletedIndexByKey(key) {
  if (!Array.isArray(projectReceiveCompletedProjects)) return -1;
  return projectReceiveCompletedProjects.findIndex(item => projectReceiveLinkKey(item.data || item) === key);
}
function projectReceiveUpsertCompleted(data = {}, meta = {}) {
  if (!data || !projectReceiveLinkText(data.projectName)) return null;
  const record = JSON.parse(JSON.stringify(data));
  const key = projectReceiveLinkKey(record);
  const now = new Date();
  const completedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const payload = {
    sourceFile: meta.sourceFile || "프로젝트 접수 저장",
    completedAt,
    data: record
  };
  const idx = projectReceiveFindCompletedIndexByKey(key);
  if (idx >= 0) {
    projectReceiveCompletedProjects[idx] = {
      ...projectReceiveCompletedProjects[idx],
      ...payload,
      completedAt: payload.completedAt || projectReceiveCompletedProjects[idx].completedAt
    };
    return projectReceiveCompletedProjects[idx];
  }
  projectReceiveCompletedProjects.unshift(payload);
  return payload;
}
function projectReceiveGetCanonicalListItems() {
  const items = typeof getProjectReceiveListItems === "function" ? getProjectReceiveListItems() : [];
  const seen = new Set();
  return items.filter(item => {
    const data = item.data || item;
    const key = projectReceiveLinkKey(data);
    if (!projectReceiveLinkText(data.projectName) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function projectReceiveFindDbPjRowIndex(projectNo = "") {
  const target = projectReceiveLinkText(projectNo);
  if (!target || typeof estimateDbSheets === "undefined" || !estimateDbSheets?.pj) return -1;
  const pjNoIdx = typeof getEstimateDbColumnIndexByHeader === "function" ? getEstimateDbColumnIndexByHeader("pj", "PJ NO") : -1;
  if (pjNoIdx < 0) return -1;
  return (estimateDbSheets.pj.rows || []).findIndex(row => projectReceiveLinkText(row[pjNoIdx]) === target);
}
function projectReceiveSetDbPjCell(rowIndex, header, value) {
  if (rowIndex < 0 || typeof estimateDbSheets === "undefined" || !estimateDbSheets?.pj) return;
  const col = typeof getEstimateDbColumnIndexByHeader === "function" ? getEstimateDbColumnIndexByHeader("pj", header) : -1;
  if (col < 0) return;
  estimateDbSheets.pj.rows[rowIndex][col] = value || "";
}
function projectReceiveSyncPmAssignmentToDb(projectNo, assignment = {}) {
  const rowIndex = projectReceiveFindDbPjRowIndex(projectNo);
  if (rowIndex < 0) return;
  projectReceiveSetDbPjCell(rowIndex, "PM(마감)", assignment.pmFinish || "");
  projectReceiveSetDbPjCell(rowIndex, "PM(구조)", assignment.pmStructure || assignment.pmBim || "");
  projectReceiveSetDbPjCell(rowIndex, "PM(토목,조경)", assignment.pmCivil || "");
  projectReceiveSetDbPjCell(rowIndex, "상담 / 이메일 / 특기사항", [
    "PM배정/일정 최신 반영",
    assignment.pmFinish ? `마감:${assignment.pmFinish}` : "",
    assignment.pmStructure ? `구조:${assignment.pmStructure}` : "",
    assignment.pmBim ? `BIM:${assignment.pmBim}` : "",
    assignment.pmCivil ? `토목·조경:${assignment.pmCivil}` : ""
  ].filter(Boolean).join(" / "));
}
const baseApplyPmScheduleAssignmentToProjectReceiveData = typeof applyPmScheduleAssignmentToProjectReceiveData === "function" ? applyPmScheduleAssignmentToProjectReceiveData : null;
applyPmScheduleAssignmentToProjectReceiveData = function projectReceiveLatestPmAssignment(projectNo, assignment = {}) {
  const targetNo = projectReceiveLinkText(projectNo);
  if (!targetNo) return;
  const assignTo = data => {
    if (!data || projectReceiveLinkText(data.projectNo) !== targetNo) return;
    data.pmFinish = assignment.pmFinish || "";
    data.pmStructure = assignment.pmStructure || "";
    data.pmBim = assignment.pmBim || "";
    data.pmCivil = assignment.pmCivil || "";
    data.pmTotal = [assignment.pmFinish, assignment.pmStructure, assignment.pmBim, assignment.pmCivil].filter(Boolean).join(" / ");
  };
  if (typeof projectReceiveState !== "undefined") assignTo(projectReceiveState);
  if (Array.isArray(projectReceiveCompletedProjects)) projectReceiveCompletedProjects.forEach(item => assignTo(item.data || item));
  projectReceiveSyncPmAssignmentToDb(targetNo, assignment);
  if (document.getElementById("projectReceiveListBody")) renderProjectReceiveListView();
  if (typeof pmRefreshLinkedEstimateProjects === "function") pmRefreshLinkedEstimateProjects();
  if (typeof pmRenderProjectList === "function" && document.getElementById("pmProjectListBoard")) pmRenderProjectList();
};
const baseSaveProjectReceiveDraft = typeof saveProjectReceiveDraft === "function" ? saveProjectReceiveDraft : null;
saveProjectReceiveDraft = function projectReceiveSaveAsCanonicalList() {
  syncProjectReceiveInputsToState();
  if (!validateProjectReceiveSkeletonScope()) {
    renderProjectReceiveDashboard();
    showToast("골조성을 선택한 경우 가설, 단열, 견출, 방수턱 중 최소 1개를 선택해야 접수저장이 가능합니다.");
    return;
  }
  projectReceiveUpsertCompleted(projectReceiveState, { sourceFile: "프로젝트 접수 저장" });
  renderProjectReceiveStatus();
  if (typeof registerPmScheduleProjectFromReceive === "function") registerPmScheduleProjectFromReceive(projectReceiveState);
  if (document.getElementById("projectReceiveListBody")) renderProjectReceiveListView();
  showToast("프로젝트 접수 내용이 프로젝트 리스트 기준 최신값으로 저장되었습니다.");
};
window.projectReceiveGetCanonicalListItems = projectReceiveGetCanonicalListItems;
window.projectReceiveLinkKey = projectReceiveLinkKey;
window.applyPmScheduleAssignmentToProjectReceiveData = applyPmScheduleAssignmentToProjectReceiveData;
window.saveProjectReceiveDraft = saveProjectReceiveDraft;
