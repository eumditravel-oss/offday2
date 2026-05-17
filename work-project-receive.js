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

document.addEventListener("DOMContentLoaded", () => {
  renderProjectReceiveDashboard();
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
   견적서 관리 v1
   - 견적서 작성 / 견적서 관리 세부 카테고리
   - 견적 기록 저장, 수정, 프로젝트 접수 화면 불러오기
   - 업로드된 견적서 XLSX 양식 다운로드
========================================================= */
const estimateQuoteTemplateBase64 = "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";
const estimateQuoteTemplateFilename = "260514_HDEC_Pohang_AI_Factory_quote_template.xlsx";

const estimateQuoteDefaultData = {
  projectName: "",
  projectNo: "",
  client: "",
  usage: "",
  areaM2: "",
  areaPy: "",
  buildings: "",
  floors: "",
  structureContract: "",
  finishContract: "",
  scopes: [
    { label: "마감", checked: false },
    { label: "구조팀", checked: false },
    { label: "BIM 파트", checked: false },
    { label: "토목ㆍ조경파트", checked: false },
    { label: "인테리어·철거", checked: false },
    { label: "골조성", checked: false, children: [
      { label: "가설", checked: false },
      { label: "단열", checked: false },
      { label: "견출", checked: false },
      { label: "방수턱", checked: false }
    ] }
  ],
  downloadUrl: "",
  webhardId: "",
  webhardPw: "",
  accessKey: "",
  folderName: "",
  requesterName: "",
  requesterDept: "",
  requesterPhone: "",
  requesterEmail: "",
  callMemo: "",
  emailMemo: "",
  notes: "",
  status: "견적작성중"
};

const estimateQuoteSampleData = {
  projectName: "포항 AI Factory 데이터센터 증축공사 견적용역",
  projectNo: "260514",
  client: "현대건설(주)",
  usage: "데이터센터",
  areaM2: "19,460㎡",
  areaPy: "5,887평",
  buildings: "2개층 1개동",
  floors: "B0/S2",
  structureContract: "1회 구조 착수 요청",
  finishContract: "구조 선 투입 후 마감 일정 협의",
  scopes: [
    { label: "마감", checked: true },
    { label: "구조팀", checked: true },
    { label: "BIM 파트", checked: false },
    { label: "토목ㆍ조경파트", checked: false },
    { label: "인테리어·철거", checked: false },
    { label: "골조성", checked: false, children: [
      { label: "가설", checked: false },
      { label: "단열", checked: false },
      { label: "견출", checked: false },
      { label: "방수턱", checked: false }
    ] }
  ],
  downloadUrl: "http://only.webhard.co.kr",
  webhardId: "hdeckucu",
  webhardPw: "s100",
  accessKey: "0505",
  folderName: "260406 포항 AI DC",
  requesterName: "최경혁",
  requesterDept: "건축국내견적팀 매니저",
  requesterPhone: "010-6886-5038",
  requesterEmail: "choikyhy@hdec.co.kr",
  callMemo: "26/05/14 0차 구조라고 표현한 이유 확인. 구조 선착수 일정은 5/18, 1차 구조/마감 착수는 5/29 목표로 공유됨. 일정 변경 시 견적서 회신 요청.",
  emailMemo: "아래 프로젝트 적산 가능여부 문의. 포항 AI 데이터센터, 연면적 19,460㎡(5,887평), 적산범위 마감 2회 구조 2회 VE 적산 1회. 웹하드 접속 정보 및 폴더 접속KEY 공유.",
  notes: "도면 수령 후 구조 적산 선 투입 요청. 가능여부 및 일정 변경 요청 필요 시 회신.",
  status: "견적작성중"
};

let estimateQuoteState = JSON.parse(JSON.stringify(estimateQuoteDefaultData));
let estimateQuoteRecords = [JSON.parse(JSON.stringify(estimateQuoteSampleData))];
let estimateQuoteEditingIndex = null;

function getEstimateQuoteValue(id) {
  return document.getElementById(id)?.value?.trim() || "";
}
function setEstimateQuoteValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}
function estimateQuoteScopeText(item) {
  if (!item?.checked) return "";
  const children = (item.children || []).filter(child => child.checked).map(child => child.label);
  return children.length ? `${item.label}(${children.join(" · ")})` : item.label;
}
function renderEstimateQuoteScopeChips() {
  const wrap = document.getElementById("quoteScopeChips");
  if (!wrap) return;
  wrap.innerHTML = (estimateQuoteState.scopes || []).map((item, index) => `
    <div class="quote-chip-block ${item.children ? "has-children" : ""}">
      <button class="receive-chip ${item.checked ? "active" : ""}" type="button" onclick="toggleEstimateQuoteScope(${index})"><span>${item.checked ? "✓" : "+"}</span>${item.label}</button>
      ${item.children && item.checked ? `<div class="receive-subchip-group">${item.children.map((child, childIndex) => `<button class="receive-subchip ${child.checked ? "active" : ""}" type="button" onclick="toggleEstimateQuoteScopeChild(${index}, ${childIndex})"><span>${child.checked ? "✓" : "+"}</span>${child.label}</button>`).join("")}</div>` : ""}
    </div>
  `).join("");
}
function toggleEstimateQuoteScope(index) {
  const item = estimateQuoteState.scopes?.[index];
  if (!item) return;
  item.checked = !item.checked;
  if (!item.checked && item.children) item.children.forEach(child => child.checked = false);
  renderEstimateQuoteScopeChips();
}
function toggleEstimateQuoteScopeChild(index, childIndex) {
  const item = estimateQuoteState.scopes?.[index];
  const child = item?.children?.[childIndex];
  if (!child) return;
  item.checked = true;
  child.checked = !child.checked;
  renderEstimateQuoteScopeChips();
}
function renderEstimateQuoteDashboard() {
  if (!document.getElementById("estimateQuoteShell")) return;
  setEstimateQuoteValue("quoteProjectName", estimateQuoteState.projectName);
  setEstimateQuoteValue("quoteProjectNo", estimateQuoteState.projectNo);
  setEstimateQuoteValue("quoteClient", estimateQuoteState.client);
  setEstimateQuoteValue("quoteUsage", estimateQuoteState.usage);
  setEstimateQuoteValue("quoteAreaM2", estimateQuoteState.areaM2);
  setEstimateQuoteValue("quoteAreaPy", estimateQuoteState.areaPy);
  setEstimateQuoteValue("quoteBuildings", estimateQuoteState.buildings);
  setEstimateQuoteValue("quoteFloors", estimateQuoteState.floors);
  setEstimateQuoteValue("quoteStructureContract", estimateQuoteState.structureContract);
  setEstimateQuoteValue("quoteFinishContract", estimateQuoteState.finishContract);
  setEstimateQuoteValue("quoteDownloadUrl", estimateQuoteState.downloadUrl);
  setEstimateQuoteValue("quoteWebhardId", estimateQuoteState.webhardId);
  setEstimateQuoteValue("quoteWebhardPw", estimateQuoteState.webhardPw);
  setEstimateQuoteValue("quoteAccessKey", estimateQuoteState.accessKey);
  setEstimateQuoteValue("quoteFolderName", estimateQuoteState.folderName);
  setEstimateQuoteValue("quoteRequesterName", estimateQuoteState.requesterName);
  setEstimateQuoteValue("quoteRequesterDept", estimateQuoteState.requesterDept);
  setEstimateQuoteValue("quoteRequesterPhone", estimateQuoteState.requesterPhone);
  setEstimateQuoteValue("quoteRequesterEmail", estimateQuoteState.requesterEmail);
  setEstimateQuoteValue("quoteCallMemo", estimateQuoteState.callMemo);
  setEstimateQuoteValue("quoteEmailMemo", estimateQuoteState.emailMemo);
  setEstimateQuoteValue("quoteNotes", estimateQuoteState.notes);
  renderEstimateQuoteScopeChips();
}
function syncEstimateQuoteInputsToState() {
  estimateQuoteState.projectName = getEstimateQuoteValue("quoteProjectName");
  estimateQuoteState.projectNo = getEstimateQuoteValue("quoteProjectNo");
  estimateQuoteState.client = getEstimateQuoteValue("quoteClient");
  estimateQuoteState.usage = getEstimateQuoteValue("quoteUsage");
  estimateQuoteState.areaM2 = getEstimateQuoteValue("quoteAreaM2");
  estimateQuoteState.areaPy = getEstimateQuoteValue("quoteAreaPy");
  estimateQuoteState.buildings = getEstimateQuoteValue("quoteBuildings");
  estimateQuoteState.floors = getEstimateQuoteValue("quoteFloors");
  estimateQuoteState.structureContract = getEstimateQuoteValue("quoteStructureContract");
  estimateQuoteState.finishContract = getEstimateQuoteValue("quoteFinishContract");
  estimateQuoteState.downloadUrl = getEstimateQuoteValue("quoteDownloadUrl");
  estimateQuoteState.webhardId = getEstimateQuoteValue("quoteWebhardId");
  estimateQuoteState.webhardPw = getEstimateQuoteValue("quoteWebhardPw");
  estimateQuoteState.accessKey = getEstimateQuoteValue("quoteAccessKey");
  estimateQuoteState.folderName = getEstimateQuoteValue("quoteFolderName");
  estimateQuoteState.requesterName = getEstimateQuoteValue("quoteRequesterName");
  estimateQuoteState.requesterDept = getEstimateQuoteValue("quoteRequesterDept");
  estimateQuoteState.requesterPhone = getEstimateQuoteValue("quoteRequesterPhone");
  estimateQuoteState.requesterEmail = getEstimateQuoteValue("quoteRequesterEmail");
  estimateQuoteState.callMemo = getEstimateQuoteValue("quoteCallMemo");
  estimateQuoteState.emailMemo = getEstimateQuoteValue("quoteEmailMemo");
  estimateQuoteState.notes = getEstimateQuoteValue("quoteNotes");
}
function saveEstimateQuoteDraft() {
  syncEstimateQuoteInputsToState();
  if (!estimateQuoteState.projectName) {
    showToast("프로젝트명을 입력해야 견적서를 저장할 수 있습니다.");
    return;
  }
  const record = JSON.parse(JSON.stringify(estimateQuoteState));
  if (estimateQuoteEditingIndex === null || estimateQuoteEditingIndex < 0) {
    estimateQuoteRecords.unshift(record);
  } else {
    estimateQuoteRecords[estimateQuoteEditingIndex] = record;
  }
  estimateQuoteEditingIndex = null;
  showToast("견적서 기록을 저장했습니다.");
  switchWorkPanel("estimateQuoteList");
}
function resetEstimateQuoteForm() {
  estimateQuoteState = JSON.parse(JSON.stringify(estimateQuoteDefaultData));
  estimateQuoteEditingIndex = null;
  renderEstimateQuoteDashboard();
  showToast("견적서 작성 화면을 초기화했습니다.");
}
function loadEstimateQuoteSample() {
  estimateQuoteState = JSON.parse(JSON.stringify(estimateQuoteSampleData));
  estimateQuoteEditingIndex = null;
  renderEstimateQuoteDashboard();
  showToast("포항 AI Factory 견적서 예시를 불러왔습니다.");
}
function renderEstimateQuoteList() {
  const body = document.getElementById("estimateQuoteListBody");
  if (!body) return;
  const keyword = (document.getElementById("estimateQuoteSearch")?.value || "").trim().toLowerCase();
  const status = document.getElementById("estimateQuoteStatusFilter")?.value || "전체";
  const rows = estimateQuoteRecords.filter(row => {
    const scopeText = (row.scopes || []).map(estimateQuoteScopeText).filter(Boolean).join(" ");
    const hay = [row.projectNo, row.projectName, row.client, row.requesterName, scopeText, row.areaM2, row.areaPy].join(" ").toLowerCase();
    return (!keyword || hay.includes(keyword)) && (status === "전체" || row.status === status);
  });
  body.innerHTML = rows.map(row => {
    const index = estimateQuoteRecords.indexOf(row);
    const scopeText = (row.scopes || []).map(estimateQuoteScopeText).filter(Boolean).join(" · ") || "미선택";
    const areaText = [row.areaM2, row.areaPy].filter(Boolean).join(" / ") || "-";
    return `<tr onclick="editEstimateQuoteRecord(${index})">
      <td>${row.projectNo || "-"}</td>
      <td><strong>${row.projectName || "미입력"}</strong></td>
      <td>${row.client || "-"}</td>
      <td>${areaText}</td>
      <td>${row.floors || "-"}</td>
      <td>${scopeText}</td>
      <td>${row.requesterName || "-"}<br><small>${row.requesterEmail || ""}</small></td>
      <td><span class="quote-status-badge">${row.status || "견적작성중"}</span></td>
      <td class="quote-action-cell" onclick="event.stopPropagation();">
        <button class="btn btn-line btn-xs" type="button" onclick="editEstimateQuoteRecord(${index})">수정</button>
        <button class="btn btn-line btn-xs" type="button" onclick="markEstimateQuoteSent(${index})">발송</button>
        <button class="btn btn-primary btn-xs" type="button" onclick="startProjectFromEstimateQuote(${index})">착수</button>
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="9" class="empty-cell">조건에 맞는 견적서 기록이 없습니다.</td></tr>`;
}
function editEstimateQuoteRecord(index) {
  if (!estimateQuoteRecords[index]) return;
  estimateQuoteState = JSON.parse(JSON.stringify(estimateQuoteRecords[index]));
  estimateQuoteEditingIndex = index;
  switchWorkPanel("estimateQuote");
  renderEstimateQuoteDashboard();
}
function markEstimateQuoteSent(index) {
  if (!estimateQuoteRecords[index]) return;
  estimateQuoteRecords[index].status = "견적발송";
  renderEstimateQuoteList();
  showToast("견적서 발송 상태로 변경했습니다.");
}
function startProjectFromEstimateQuote(index) {
  const row = estimateQuoteRecords[index];
  if (!row) return;
  row.status = "착수확정";
  const parsed = parseProjectReceiveFloors(row.floors || "");
  projectReceiveState = JSON.parse(JSON.stringify({
    ...projectReceiveDefaultData,
    projectName: row.projectName,
    projectNo: row.projectNo,
    client: row.client,
    usage: row.usage,
    area: row.areaPy || row.areaM2,
    buildings: row.buildings,
    floors: row.floors,
    basementFloors: parsed.basementFloors,
    groundFloors: parsed.groundFloors,
    unitPrice: "견적서 관리에서 착수 전환",
    scopes: JSON.parse(JSON.stringify(row.scopes || projectReceiveDefaultData.scopes)),
    contacts: [{ name: row.requesterName, role: row.requesterDept, dept: "", tel: row.requesterPhone, mobile: row.requesterPhone, email: row.requesterEmail }],
    materials: createProjectReceiveDummyMaterials("견적서 관리"),
    workContent: `견적서 관리에서 착수 전환: ${row.structureContract || "구조 계약 미입력"} / ${row.finishContract || "마감 계약 미입력"}`,
    notes: row.notes,
    request: [row.callMemo, row.emailMemo, row.downloadUrl ? `자료주소: ${row.downloadUrl} / ID: ${row.webhardId} / PW: ${row.webhardPw} / KEY: ${row.accessKey}` : ""].filter(Boolean).join("\n\n")
  }));
  switchWorkPanel("projectReceive");
  renderProjectReceiveDashboard();
  showToast("견적서 기록을 프로젝트 작성 화면으로 불러왔습니다. 미비된 내용만 추가 작성하세요.");
}
function downloadEstimateQuoteTemplate() {
  try {
    const byteChars = atob(estimateQuoteTemplateBase64);
    const bytes = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i += 1) bytes[i] = byteChars.charCodeAt(i);
    const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = estimateQuoteTemplateFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("견적서 엑셀 양식을 다운로드합니다.");
  } catch (error) {
    console.error(error);
    showToast("견적서 양식 다운로드 중 오류가 발생했습니다.");
  }
}


/* =========================================================
   견적서 관리 > DB관리 / 연도별 0~3 시트 연결 화면 v12
   - DB_프로젝트 / DB_기성 / DB기전외주 형식 적용
   - DB 값을 기준으로 0.수주매출입금, 1.수주 프로젝트, 2.매출 프로젝트, 3.입금 프로젝트 산출
   - 연도별 화면 조회 및 Excel XML 다중 시트 내보내기 지원
========================================================= */
const estimateDbSheets = {
  pj: {
    title: "DB_프로젝트",
    excelName: "DB_프로젝트",
    headerRows: [["년도", "접수번호", "PJ NO", "국내/해외", "거래처명", "프로젝트명", "부서명", "거래처담당자", "작업공종", "작업구분", "업무성격", "건물용도", "연면적(평)", "층수", "수주일자", "수주월", "작업착수일자", "1차납품일자", "2차납품일자", "PM(마감)", "PM(구조)", "PM(토목,조경)"]],
    rows: [["2026", "260515", "2026002", "국내", "현대건설㈜", "00 신축공사 견적용역", "견적부", "홍길동", "마감", "실행", "개산견적", "창고", "10000", "B4/S25", "2026.01.05", "1", "2026.01.05", "2026.01.31", "2026.08월경", "", "", ""]]
  },
  progress: {
    title: "DB_기성",
    excelName: "DB_기성",
    headerRows: [["년도", "PJ NO", "업체명", "PJ명", "계약금액", "수령액", "잔액", "외주합계", "기성조건", "견적서일자", "수주일자", "수주월", "계약일자", "총괄PM", "납품예정일", "계약금_세금계산서", "1차기성_세금계산서", "2차기성_세금계산서", "3차기성_세금계산서", "4차기성_세금계산서", "5차기성_세금계산서", "계약금_입금일", "1차기성_입금일", "2차기성_입금일", "3차기성_입금일", "4차기성_입금일", "5차기성_입금일", "특이사항", "거래처기성담당자", "기성담당자", "연락예정일"]],
    rows: [["2026", "2026002", "(주)00건설", "00 프로젝트", "1000000", "300000", "700000", "300000", "계약분 30%\n납품후 20%\n최종 50%", "260103", "260105", "1", "260107", "박ㅇㅇ", "260131", "300000", "200000", "", "", "", "50000", "300000", "", "", "", "", "", "", "2월14일에 다시 연락하기로", "서현대실장\n010-0000-0000", "강동균"]]
  },
  mep: {
    title: "DB기전외주",
    excelName: "DB기전외주",
    headerRows: [["업체명", "계좌정보", "은행명", "계좌번호", "예금주", "년도", "PJ NO", "PJ명", "계약금액", "기지급액", "금회발행요청액", "요청후잔액", "지급금액1", "지급일자1", "지급금액2", "지급일자2", "지급금액3", "지급일자3", "지급금액4", "지급일자4", "지급금액5", "지급일자5", "지급금액6", "지급일자6", "계약업체", "컨코스트계약금", "수령액", "잔액", "받은비율", "받은비율대비 미지급액", "지급합계", "지급월1", "지급월2"]],
    rows: [["㈜AA적산엔지니어링", "계좌정보", "우리은행", "445-028489-13-001", "예금주: ㈜AA적산엔지어링", "2026", "2026001", "00 프로젝트", "2000000", "200000", "800000", "1000000", "100000", "260102", "100000", "260204", "", "", "", "", "", "", "", "", "00건설", "10000000", "5000000", "5000000", "0.5", "800000", "200000", "1", "2"]]
  }
};

const estimateDbReportTabs = {
  summary: "0.수주매출입금",
  order: "1.수주 프로젝트",
  sales: "2.매출 프로젝트",
  deposit: "3.입금 프로젝트"
};
let estimateDbActiveTab = "pj";
let estimateDbReportActiveTab = "summary";
let estimateDbSelectedCell = { tab: "pj", sectionIndex: null, rowIndex: 0, colIndex: 0 };

function normalizeEstimateDbText(value) { return String(value ?? "").trim(); }
function toEstimateDbNumber(value) {
  const raw = normalizeEstimateDbText(value).replace(/,/g, "").replace(/원/g, "");
  const num = Number(raw);
  return Number.isFinite(num) ? num : 0;
}
function parseEstimateDbYear(value) {
  const m = normalizeEstimateDbText(value).match(/(20\d{2})/);
  return m ? m[1] : String(new Date().getFullYear());
}
function parseEstimateDbMonth(value) {
  const raw = normalizeEstimateDbText(value);
  const direct = raw.match(/(?:^|[^0-9])(1[0-2]|0?[1-9])\s*월/);
  if (direct) return Number(direct[1]);
  const compact = raw.match(/^(?:\d{2})?(0[1-9]|1[0-2])\d{2}$/);
  if (compact) return Number(compact[1]);
  const date = raw.match(/20\d{2}[.\/-](0?[1-9]|1[0-2])/);
  if (date) return Number(date[1]);
  return null;
}
function getEstimateDbSheet(tab = estimateDbActiveTab) { return estimateDbSheets[tab] || estimateDbSheets.pj; }
function getEstimateDbLeafColumns(sheet = getEstimateDbSheet()) { return sheet.headerRows?.[sheet.headerRows.length - 1] || []; }
function getEstimateDbRows(sheet = getEstimateDbSheet()) { return sheet.rows || []; }
function getEstimateDbYears() {
  const years = new Set();
  Object.values(estimateDbSheets).forEach(sheet => (sheet.rows || []).forEach(row => {
    const year = parseEstimateDbYear(row[0] || row[5] || "");
    if (year) years.add(year);
  }));
  if (!years.size) years.add(String(new Date().getFullYear()));
  return [...years].sort();
}
function getSelectedEstimateDbYear() {
  const select = document.getElementById("estimateDbYearSelect");
  return select?.value || getEstimateDbYears()[0] || String(new Date().getFullYear());
}
function syncEstimateDbYearOptions() {
  const select = document.getElementById("estimateDbYearSelect");
  if (!select) return;
  const current = select.value;
  const years = getEstimateDbYears();
  select.innerHTML = years.map(y => `<option value="${escapeEstimateDbHtml(y)}">${escapeEstimateDbHtml(y)}년</option>`).join("");
  select.value = years.includes(current) ? current : (years[0] || String(new Date().getFullYear()));
}
function setEstimateDbTab(tab) {
  if (!estimateDbSheets[tab]) return;
  estimateDbActiveTab = tab;
  estimateDbSelectedCell = { tab, sectionIndex: null, rowIndex: 0, colIndex: 0 };
  renderEstimateDbManage();
}
function setEstimateDbReportTab(tab) {
  if (!estimateDbReportTabs[tab]) return;
  estimateDbReportActiveTab = tab;
  renderEstimateDbReports();
}
function estimateDbDisplayLength(value) {
  return String(value ?? "").split("").reduce((sum, ch) => sum + (ch.charCodeAt(0) > 127 ? 1.65 : 1), 0);
}
function getEstimateDbColumnWidth(colIndex, sheet = getEstimateDbSheet()) {
  const values = [];
  (sheet.headerRows || []).forEach(row => values.push(row[colIndex] || ""));
  (sheet.rows || []).slice(0, 30).forEach(row => values.push(row[colIndex] || ""));
  const maxLen = Math.max(8, ...values.map(estimateDbDisplayLength));
  return Math.max(140, Math.min(520, Math.ceil(maxLen * 11 + 56)));
}
function makeEstimateDbCellStyle(colIndex, sheet = getEstimateDbSheet()) {
  const width = getEstimateDbColumnWidth(colIndex, sheet);
  return `style="min-width:${width}px;width:${width}px;"`;
}
function escapeEstimateDbHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function renderEstimateDbManage() {
  const head = document.getElementById("estimateDbHead");
  const body = document.getElementById("estimateDbBody");
  if (!head || !body) return;
  syncEstimateDbYearOptions();
  document.querySelectorAll(".quote-db-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.dbTab === estimateDbActiveTab));
  const sheet = getEstimateDbSheet();
  const colCount = getEstimateDbLeafColumns(sheet).length;
  head.innerHTML = (sheet.headerRows || []).map((headerRow, index) => `
    <tr class="quote-db-head-row quote-db-head-row-${index + 1}">
      ${headerRow.map((col, colIndex) => `<th ${makeEstimateDbCellStyle(colIndex, sheet)}>${escapeEstimateDbHtml(col || "")}</th>`).join("")}
      ${index === 0 ? `<th class="quote-db-manage-col" rowspan="${Math.max(1, sheet.headerRows.length)}">관리</th>` : ""}
    </tr>
  `).join("");
  const rows = sheet.rows || [];
  body.innerHTML = rows.map((row, rowIndex) => renderEstimateDbRow(row, rowIndex, colCount)).join("") || `<tr><td colspan="${colCount + 1}" class="empty-cell">등록된 DB 행이 없습니다.</td></tr>`;
  renderEstimateDbReports();
  restoreEstimateDbFocus();
}
function renderEstimateDbRow(row, rowIndex, colCount) {
  const sheet = getEstimateDbSheet();
  const safeRow = Array.from({ length: colCount }, (_, i) => row?.[i] || "");
  return `
    <tr class="quote-db-data-row" data-row-index="${rowIndex}">
      ${safeRow.map((value, colIndex) => `<td ${makeEstimateDbCellStyle(colIndex, sheet)}><input class="quote-db-cell-input" value="${escapeEstimateDbHtml(value)}" data-row-index="${rowIndex}" data-col-index="${colIndex}" onfocus="selectEstimateDbCell(${rowIndex}, ${colIndex})" oninput="updateEstimateDbCell(${rowIndex}, ${colIndex}, this.value)" onkeydown="handleEstimateDbKeydown(event)" /></td>`).join("")}
      <td class="quote-db-manage-col"><button class="btn btn-line btn-xs" type="button" onclick="removeEstimateDbRow(${rowIndex})">삭제</button></td>
    </tr>
  `;
}
function selectEstimateDbCell(rowIndex, colIndex) {
  estimateDbSelectedCell = { tab: estimateDbActiveTab, sectionIndex: null, rowIndex, colIndex };
  document.querySelectorAll(".quote-db-data-row").forEach(row => row.classList.remove("selected"));
  document.querySelector(`.quote-db-data-row[data-row-index="${rowIndex}"]`)?.classList.add("selected");
}
function restoreEstimateDbFocus() {
  const cell = estimateDbSelectedCell;
  if (cell.tab !== estimateDbActiveTab) return;
  requestAnimationFrame(() => selectEstimateDbCell(cell.rowIndex || 0, cell.colIndex || 0));
}
function focusEstimateDbCell(rowIndex, colIndex) {
  const input = document.querySelector(`.quote-db-cell-input[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`);
  if (input) { input.focus(); input.select?.(); }
}
function handleEstimateDbKeydown(event) {
  const input = event.currentTarget;
  const rowIndex = Number(input.dataset.rowIndex || 0);
  const colIndex = Number(input.dataset.colIndex || 0);
  const rows = getEstimateDbRows();
  const colCount = getEstimateDbLeafColumns().length;
  if (event.ctrlKey && event.key === "F9") {
    event.preventDefault();
    addEstimateDbRow(null, rowIndex + 1);
    requestAnimationFrame(() => focusEstimateDbCell(rowIndex + 1, colIndex));
    return;
  }
  if (event.ctrlKey && event.key === "F3") {
    event.preventDefault();
    duplicateEstimateDbRow(rowIndex);
    requestAnimationFrame(() => focusEstimateDbCell(rowIndex + 1, colIndex));
    return;
  }
  if (event.ctrlKey && (event.key === "Delete" || event.key === "Del")) {
    event.preventDefault();
    removeEstimateDbRow(rowIndex);
    requestAnimationFrame(() => focusEstimateDbCell(Math.max(0, rowIndex - 1), Math.min(colIndex, colCount - 1)));
    return;
  }
  const arrowMap = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
  if (!event.ctrlKey && arrowMap[event.key]) {
    const [dr, dc] = arrowMap[event.key];
    const nextRow = Math.max(0, Math.min(rows.length - 1, rowIndex + dr));
    const nextCol = Math.max(0, Math.min(colCount - 1, colIndex + dc));
    if (nextRow !== rowIndex || nextCol !== colIndex) {
      event.preventDefault();
      focusEstimateDbCell(nextRow, nextCol);
    }
  }
}
function updateEstimateDbCell(rowIndex, colIndex, value) {
  const rows = getEstimateDbRows();
  if (!rows?.[rowIndex]) return;
  rows[rowIndex][colIndex] = value;
  renderEstimateDbReports();
}
function addEstimateDbRow(_sectionIndex = null, insertAt = null) {
  const sheet = getEstimateDbSheet();
  const columns = getEstimateDbLeafColumns(sheet);
  const next = Array(columns.length).fill("");
  const yearIndex = columns.findIndex(c => c === "년도");
  if (yearIndex >= 0) next[yearIndex] = getSelectedEstimateDbYear();
  const rows = getEstimateDbRows(sheet);
  if (insertAt === null || insertAt === undefined || insertAt > rows.length) rows.push(next);
  else rows.splice(Math.max(0, insertAt), 0, next);
  renderEstimateDbManage();
}
function duplicateEstimateDbRow(rowIndex = estimateDbSelectedCell.rowIndex || 0) {
  const rows = getEstimateDbRows();
  if (!rows?.[rowIndex]) return;
  rows.splice(rowIndex + 1, 0, [...rows[rowIndex]]);
  renderEstimateDbManage();
}
function removeEstimateDbRow(rowIndex = estimateDbSelectedCell.rowIndex || 0) {
  const rows = getEstimateDbRows();
  if (!rows?.[rowIndex]) return;
  rows.splice(rowIndex, 1);
  estimateDbSelectedCell = { tab: estimateDbActiveTab, sectionIndex: null, rowIndex: Math.max(0, rowIndex - 1), colIndex: estimateDbSelectedCell.colIndex || 0 };
  renderEstimateDbManage();
}
function getEstimateDbRowsByYear(tab, year = getSelectedEstimateDbYear()) {
  const sheet = estimateDbSheets[tab];
  const columns = getEstimateDbLeafColumns(sheet);
  const yearIndex = columns.findIndex(c => c === "년도");
  return (sheet.rows || []).filter(row => {
    const val = yearIndex >= 0 ? row[yearIndex] : row[0];
    return parseEstimateDbYear(val) === String(year);
  });
}
function estimateDbIndexMap(tab) {
  const columns = getEstimateDbLeafColumns(estimateDbSheets[tab]);
  return Object.fromEntries(columns.map((name, i) => [name, i]));
}
function sumEstimateDbByMonth(rows, monthIndex, amountIndex, year = getSelectedEstimateDbYear()) {
  return rows.reduce((sum, row) => {
    const month = parseEstimateDbMonth(row[monthIndex]);
    if (month && month === Number(monthIndex === -1 ? 0 : row.__monthFilter)) return sum;
    return sum + toEstimateDbNumber(row[amountIndex]);
  }, 0);
}
function buildOrderRows(year = getSelectedEstimateDbYear()) {
  const idx = estimateDbIndexMap("pj");
  const mepIdx = estimateDbIndexMap("mep");
  const rows = getEstimateDbRowsByYear("pj", year);
  const mepRows = getEstimateDbRowsByYear("mep", year);
  const monthly = Array.from({ length: 12 }, (_, m) => {
    const month = m + 1;
    const monthRows = rows.filter(row => parseEstimateDbMonth(row[idx["수주일자"]]) === month);
    const outRows = mepRows.filter(row => parseEstimateDbMonth(row[mepIdx["지급일자1"]]) === month || parseEstimateDbMonth(row[mepIdx["지급일자2"]]) === month);
    const orderAmount = monthRows.reduce((sum, row) => sum + toEstimateDbNumber(row[idx["연면적(평)"]]) * 14000, 0);
    const outAmount = outRows.reduce((sum, row) => sum + toEstimateDbNumber(row[mepIdx["지급합계"]] || row[mepIdx["계약금액"]]), 0);
    return [year, `${month}월`, monthRows.length || "", orderAmount, 0, orderAmount, outAmount, Math.max(0, orderAmount - outAmount), ""];
  });
  const detailHeader = ["NO", "수주월", "거래처명", "프로젝트명", "작업공종", "수주일자", "최종수주액", "기전/외주", "컨코스트", "PM(마감)", "PM(구조)", "PM(토목,조경)"];
  const detail = rows.map(row => {
    const amount = toEstimateDbNumber(row[idx["연면적(평)"]]) * 14000;
    const month = parseEstimateDbMonth(row[idx["수주일자"]]) || "";
    return [row[idx["접수번호"]], month ? `${month}월` : "", row[idx["거래처명"]], row[idx["프로젝트명"]], row[idx["작업공종"]], row[idx["수주일자"]], amount, "", amount, row[idx["PM(마감)"]], row[idx["PM(구조)"]], row[idx["PM(토목,조경)"]]];
  });
  return { title: `${year}년 수주`, header: ["년도", "월", "건 수", "수주액", "조정금액", "최종수주액(①)", "기전/외주(②)", "컨코스트(①-②)", "비고"], monthly, detailHeader, detail };
}
function buildSalesRows(year = getSelectedEstimateDbYear()) {
  const idx = estimateDbIndexMap("progress");
  const rows = getEstimateDbRowsByYear("progress", year);
  const monthly = Array.from({ length: 12 }, (_, m) => {
    const month = m + 1;
    const monthRows = rows.filter(row => parseEstimateDbMonth(row[idx["계약일자"]] || row[idx["수주일자"]]) === month);
    const amount = monthRows.reduce((sum, row) => sum + toEstimateDbNumber(row[idx["계약금액"]]), 0);
    const out = monthRows.reduce((sum, row) => sum + toEstimateDbNumber(row[idx["외주합계"]]), 0);
    return [year, `${month}월`, monthRows.length || "", amount, Math.round(amount * 1.1), out, Math.max(0, amount - out), ""];
  });
  const detailHeader = ["PJ NO", "업체명", "PJ명", "계약금액", "수령액", "잔액", "외주합계", "계약일자", "총괄PM", "납품예정일", "특이사항"];
  const detail = rows.map(row => [row[idx["PJ NO"]], row[idx["업체명"]], row[idx["PJ명"]], row[idx["계약금액"]], row[idx["수령액"]], row[idx["잔액"]], row[idx["외주합계"]], row[idx["계약일자"]], row[idx["총괄PM"]], row[idx["납품예정일"]], row[idx["특이사항"]]]);
  return { title: `${year}년 매출`, header: ["년도", "월", "건 수", "발행액(①)", "발행액(①)VAT포함", "기전/외주(②)", "컨코스트(①-②)", "비고"], monthly, detailHeader, detail };
}
function buildDepositRows(year = getSelectedEstimateDbYear()) {
  const idx = estimateDbIndexMap("progress");
  const rows = getEstimateDbRowsByYear("progress", year);
  const detailHeader = ["NO", "업체", "프로젝트명", "기성담당자", "총액", "기수령액", "청구액(별도)", "청구액(포함)", "청구후잔액", "기전/외주", "발행일", "지급예상일", "지급일", "지급액(vat별도)", "지급액(vat포함)", "은행명", "종류", "비고"];
  const detail = rows.map(row => {
    const total = toEstimateDbNumber(row[idx["계약금액"]]);
    const paid = toEstimateDbNumber(row[idx["수령액"]]);
    const bill = Math.max(0, total - paid);
    return [row[idx["PJ NO"]], row[idx["업체명"]], row[idx["PJ명"]], row[idx["기성담당자"]], total, paid, bill, Math.round(bill * 1.1), Math.max(0, total - paid - bill), row[idx["외주합계"]], row[idx["계약금_세금계산서"]], row[idx["납품예정일"]], row[idx["계약금_입금일"]], bill, Math.round(bill * 1.1), "", "", row[idx["특이사항"]]];
  });
  return { title: `${year}년 입금`, detailHeader, detail };
}
function buildSummaryRows(year = getSelectedEstimateDbYear()) {
  const order = buildOrderRows(year).monthly;
  const sales = buildSalesRows(year).monthly;
  const deposit = buildDepositRows(year).detail;
  return Array.from({ length: 12 }, (_, m) => {
    const orderAmount = toEstimateDbNumber(order[m][5]);
    const orderOut = toEstimateDbNumber(order[m][6]);
    const salesAmount = toEstimateDbNumber(sales[m][3]);
    const salesOut = toEstimateDbNumber(sales[m][5]);
    const depRows = deposit.filter(row => parseEstimateDbMonth(row[12]) === m + 1 || parseEstimateDbMonth(row[10]) === m + 1);
    const depAmount = depRows.reduce((sum, row) => sum + toEstimateDbNumber(row[13]), 0);
    const depOut = depRows.reduce((sum, row) => sum + toEstimateDbNumber(row[9]), 0);
    return [`${m + 1}월`, 100000000, orderAmount, orderOut, orderAmount - orderOut, pct(orderAmount - orderOut, 100000000), pct(orderAmount, 100000000), 100000000, salesAmount, salesOut, salesAmount - salesOut, pct(salesAmount - salesOut, 100000000), pct(salesAmount, 100000000), 100000000, depAmount, depOut, depAmount - depOut, pct(depAmount - depOut, 100000000), pct(depAmount, 100000000), ""];
  });
}
function pct(value, total) { return total ? Math.round((value / total) * 1000) / 10 + "%" : "0%"; }
function renderEstimateDbReports() {
  const tabs = document.getElementById("estimateDbReportTabs");
  const target = document.getElementById("estimateDbReportBody");
  if (!tabs || !target) return;
  tabs.querySelectorAll("button").forEach(btn => btn.classList.toggle("active", btn.dataset.reportTab === estimateDbReportActiveTab));
  const year = getSelectedEstimateDbYear();
  let html = "";
  if (estimateDbReportActiveTab === "summary") {
    const rows = buildSummaryRows(year);
    html = renderReportTable(`${year}년 수주.매출.입금`, [["구분", "수주목표", "수주달성", "기전/외주", "차액", "비율1", "비율2", "매출목표", "매출달성", "기전/외주", "차액", "비율1", "비율2", "입금목표", "입금달성", "기전/외주", "차액", "비율1", "비율2", "비고"]], rows);
  } else if (estimateDbReportActiveTab === "order") {
    const data = buildOrderRows(year);
    html = renderReportTable(data.title, [data.header], data.monthly) + renderReportTable("수주 프로젝트 상세", [data.detailHeader], data.detail);
  } else if (estimateDbReportActiveTab === "sales") {
    const data = buildSalesRows(year);
    html = renderReportTable(data.title, [data.header], data.monthly) + renderReportTable("매출 프로젝트 상세", [data.detailHeader], data.detail);
  } else {
    const data = buildDepositRows(year);
    html = renderReportTable(data.title, [data.detailHeader], data.detail);
  }
  target.innerHTML = html;
}
function renderReportTable(title, headerRows, rows) {
  return `<div class="quote-report-table-block"><h3>${escapeEstimateDbHtml(title)}</h3><table class="quote-report-table"><thead>${headerRows.map(row => `<tr>${row.map(cell => `<th>${escapeEstimateDbHtml(cell)}</th>`).join("")}</tr>`).join("")}</thead><tbody>${rows.length ? rows.map(row => `<tr>${row.map(cell => `<td>${escapeEstimateDbHtml(cell)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headerRows[0]?.length || 1}" class="empty-cell">해당 연도 데이터가 없습니다.</td></tr>`}</tbody></table></div>`;
}
function escapeEstimateDbExcelCell(value) { return escapeEstimateDbHtml(value); }
function worksheetXml(name, rows) {
  return `<Worksheet ss:Name="${escapeEstimateDbXml(name)}"><Table>${rows.map(row => `<Row>${row.map(cell => `<Cell><Data ss:Type="String">${escapeEstimateDbXml(cell)}</Data></Cell>`).join("")}</Row>`).join("")}</Table></Worksheet>`;
}
function escapeEstimateDbXml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function getEstimateDbExportRows(tab) {
  const sheet = estimateDbSheets[tab];
  return [...(sheet.headerRows || []), ...(sheet.rows || [])];
}
function getEstimateDbReportExportSheets(year = getSelectedEstimateDbYear()) {
  const order = buildOrderRows(year);
  const sales = buildSalesRows(year);
  const deposit = buildDepositRows(year);
  return [
    { name: "0.수주매출입금", rows: [[`${year}년 수주.매출.입금`], ["구분", "수주목표", "수주달성", "기전/외주", "차액", "비율1", "비율2", "매출목표", "매출달성", "기전/외주", "차액", "비율1", "비율2", "입금목표", "입금달성", "기전/외주", "차액", "비율1", "비율2", "비고"], ...buildSummaryRows(year)] },
    { name: "1.수주 프로젝트", rows: [[order.title], order.header, ...order.monthly, [], order.detailHeader, ...order.detail] },
    { name: "2.매출 프로젝트", rows: [[sales.title], sales.header, ...sales.monthly, [], sales.detailHeader, ...sales.detail] },
    { name: "3.입금 프로젝트", rows: [[deposit.title], deposit.detailHeader, ...deposit.detail] }
  ];
}
function downloadEstimateDbWorkbook(fileName, sheets) {
  const xml = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="맑은 고딕" ss:Size="10"/></Style></Styles>${sheets.map(s => worksheetXml(s.name, s.rows)).join("")}</Workbook>`;
  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function exportEstimateDbToExcel() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const sheets = [
    { name: "DB_프로젝트", rows: getEstimateDbExportRows("pj") },
    { name: "DB_기성", rows: getEstimateDbExportRows("progress") },
    { name: "DB기전외주", rows: getEstimateDbExportRows("mep") }
  ];
  downloadEstimateDbWorkbook(`CONCOST_DB_${date}.xls`, sheets);
  showToast("DB 3개 시트를 엑셀 파일로 내보냅니다.");
}
function exportEstimateDbReportsToExcel() {
  const year = getSelectedEstimateDbYear();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  downloadEstimateDbWorkbook(`CONCOST_수주매출입금_${year}_${date}.xls`, getEstimateDbReportExportSheets(year));
  showToast(`${year}년 0~3번 결과 시트를 엑셀 파일로 내보냅니다.`);
}
function handleEstimateDbYearChange() { renderEstimateDbReports(); }
