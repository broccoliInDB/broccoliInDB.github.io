import { getLang } from './index'
import { type Lang } from './types'

// The career page ("30초 요약" landing) is a self-contained surface — it reads
// its own data keyed by language so it never touches the game's Content type.

export interface CareerRow {
  ref: string
  tag?: string
  date: string
  msg: string
  details?: string[]
  stack?: string[]
  isNow?: boolean
  axDetail?: boolean
  adDetail?: boolean
  missionDetail?: boolean
  company?: string
}

export interface AxStructureBlock {
  n: string
  title: string
  body?: string
  list?: string[]
  chips?: string[]
  diagram?: string
}

export interface Stat {
  value: string
  unit?: string
  label: string
}

export interface Principle {
  k: string
  v: string
}

export interface CraftItem {
  name: string
  badge: string
  desc: string
  stack: string
}

export interface ResumeData {
  whoamiCmd: string
  name: string
  handle: string
  role: string
  meta: string
  thesisCmd: string
  thesisPre: string
  thesisHead: string
  thesisEm: string
  thesisSub: string[] // segments; index 1 is highlighted
  walk: string
  links: { label: string; href: string; primary?: boolean }[]
  stackCmd: string
  stackNote: string
  stackPrimary: { label: string; items: string[] }
  stackAi: { label: string; items: string[] }
  stackRest: { label: string; items: string[] }[]
  careerCmd: string
  careerNote: string
  career: CareerRow[]
  impactCmd: string
  impactNote: string
  stats: Stat[]
  principlesTitle: string
  principles: Principle[]
  axCmd: string
  axNote: string
  axHead: string
  axHeadEm1: string
  axHeadMid: string
  axHeadEm2: string
  axLede: string[] // segment 1 highlighted
  beforeTag: string
  before: string[]
  afterTag: string
  after: string[]
  gate: { k: string; v: string }[]
  gatePass: string
  axChips: { label: string; strong: string }[]
  axDetailLabel: string
  axStructureTitle: string
  axStructure: AxStructureBlock[]
  adDetailLabel: string
  adStructureTitle: string
  adStructure: AxStructureBlock[]
  missionDetailLabel: string
  missionStructureTitle: string
  missionStructure: AxStructureBlock[]
  craftCmd: string
  craftNote: string
  craft: CraftItem[]
  contactCmd: string
  foot: string
}

const ko: ResumeData = {
  whoamiCmd: 'whoami',
  name: '최용범',
  handle: 'broccoli',
  role: '프론트엔드 엔지니어',
  meta: '2015.09~ (만 11년) · React Native · Expo · TypeScript · Claude Code·AI 에이전트 오케스트레이션 · Seoul',
  thesisCmd: 'cat thesis.md',
  thesisPre: '# ',
  thesisHead: '저는, 일을 ',
  thesisEm: '되게 만듭니다.',
  thesisSub: [
    '눈에 잘 안 보이는 쪽 — 전환·자동화·품질 게이트처럼 어렵고 티 안 나는 일을 실제로 굴러가게 합니다. AI가 짠 코드조차 ',
    "'못 하게'",
    " 만들어 '되게' 만드는 것도 그 일부예요.",
  ],
  walk: '▶ broccoli.log — 걸어서 보기',
  links: [
    { label: 'GitHub', href: 'https://github.com/broccoliInDB' },
    { label: '블로그', href: 'https://velog.io/@broccoliindb/' },
    { label: '이메일', href: 'mailto:broccoliindb@gmail.com' },
  ],
  stackCmd: 'cat stack.md',
  stackNote: '# 기술 스택 — 주력·AI 중심, 나머지는 이력',
  stackPrimary: {
    label: '주력',
    items: [
      'React Native',
      'Expo (EAS·OTA)',
      'TypeScript',
      'React Query',
      'Zustand',
      'React Navigation',
      'Tailwind (NativeWind)',
      'FlashList',
      'Firebase/FCM',
    ],
  },
  stackAi: {
    label: 'AI',
    items: [
      'Claude Code — 스킬·훅·서브에이전트·품질 게이트 직접 구축',
      'MCP (활용 + 직접 구현)',
      'AI 에이전트 자율개발 하네스',
    ],
  },
  stackRest: [
    {
      label: '품질·인프라',
      items: ['pnpm', 'Turborepo', '커스텀 ESLint', 'vitest', 'GitHub Actions', 'Maestro'],
    },
    {
      label: '이전(웹뷰)',
      items: ['React', 'Recoil', 'SWR', 'Ant Design', 'Cypress', 'S3/CloudFront', 'k8s'],
    },
    { label: '과거', items: ['WPF', 'C#', '.NET', 'Oracle'] },
  ],
  careerCmd: 'git log --oneline --author=broccoli',
  careerNote: '# 커리어 · 2015~현재 — 늘 주도적으로 만들어 온 11년',
  career: [
    {
      ref: 'b8f20ac',
      tag: '(HEAD → now)',
      date: '2026.06~',
      msg: 'AX 전환 주도 — AI 자율개발 체계 구축',
      isNow: true,
      details: [
        'AI가 "잘못할 수 없는" 개발 체계·하네스를 직접 설계·구축 — 룰·훅·게이트·에이전트 오케스트레이션',
        '~6개월 2,000+ 커밋 · 사람이든 AI든 누가 짜도 방향이 유지되게 레일을 깖',
      ],
      stack: ['claude code', 'pnpm', 'turborepo', '커스텀 eslint', 'github actions'],
      axDetail: true,
      company: '버즈니 · 홈쇼핑모아',
    },
    {
      ref: 'a7c3e91',
      date: '2023.03 ~ 2026.06',
      msg: 'RN 미션 스쿼드 — 제품 기능·공용/성능',
      details: [
        '개인화 할인·숏폼·광고·핵심상품 미션 복수 참여 · 공용 컴포넌트/성능 챕터',
      ],
      stack: ['react native', 'expo', 'react-query', 'flashlist'],
      missionDetail: true,
      company: '버즈니 · 홈쇼핑모아',
    },
    {
      ref: 'c4d9f02',
      date: '2024',
      msg: '광고 캡처 100% 무인 자동화',
      details: [
        '회당 30분 수작업 × 하루 2~10회 제거 · 새벽·심야 누락 0',
        '실패 시 자가복구 · 디스크 자동정리 · Slack 통지',
      ],
      stack: ['maestro', 'node', 'slack'],
      adDetail: true,
      company: '버즈니 · 홈쇼핑모아',
    },
    {
      ref: 'a3f1c90',
      date: '2022.11',
      msg: '웹뷰 → React Native 전면 전환 (결제까지)',
      details: [
        '웹뷰 → RN 전면 전환 (구버전은 웹뷰로 흘리는 분기로 무중단)',
        '공용 UI·디자인시스템 토대 · 카메라/공유/A/B 공통모듈',
        'PG 결제 · 주문·클레임·편성표 커머스 코어',
      ],
      stack: ['expo', 'react-native', 'react-query', 'tailwind'],
      company: '버즈니 · 홈쇼핑모아',
    },
    {
      ref: '7b2e4d1',
      date: '2021.09',
      msg: '웹뷰 서비스 운영 · 노코드 툴 구축',
      details: [
        '기획전·아웃렛·모아차트·카테고리·고객센터 서비스 로직',
        'nocodb 커스텀 노코드 DB 툴 직접 구현',
      ],
      stack: ['react', 'swr', 'emotion', 'nocodb'],
      company: '버즈니 · 홈쇼핑모아',
    },
    {
      ref: '4d1ea9b',
      date: '2018.06',
      msg: '기술팀 — 공통 모듈·온보딩 체계를 주도',
      details: [
        '공통 모듈·공통 화면 · 기술문서 정적 사이트(Hugo) · 메모리/최적화',
        '신규 입사 프론트엔드 온보딩 교육 · 트러블슈팅 · 배포/버전관리',
      ],
      stack: ['ember', 'scss', 'hugo', 'jenkins'],
      company: '이지케어텍',
    },
    {
      ref: '15a7b00',
      date: '2015.09',
      msg: '병원정보시스템(HIS) 신규 화면 개발',
      details: [
        '국내·해외 대학병원 차세대 SI',
        '간호·의무기록·식이 신규화면 · 응급진료정보망(NEDIS) · 임상 현장 교육',
      ],
      stack: ['wpf', 'c#/.net', 'oracle'],
      company: '이지케어텍',
    },
  ],
  impactCmd: 'git stats && cloc .',
  impactNote: '# 임팩트 (코드·git 실측 · 서비스 규모는 익명화)',
  stats: [
    { value: '227', label: '화면 · 운영 중 커머스 앱' },
    { value: '410', label: '공용 컴포넌트 · Atomic' },
    { value: '24', unit: '만', label: 'LOC · 홈쇼핑모아' },
    { value: '1,573', label: '머지 PR · 저장소 #1 기여자' },
    { value: '4', unit: '년', label: '단일 프로덕트 연속 기여' },
    { value: '−64', unit: '%', label: '린트 위반 ↓ · CI 강제 래칫(3개월)' },
    { value: '100', unit: '%', label: '광고 캡처 무인·누락 0 · 회당 30분 제거' },
  ],
  principlesTitle: '이렇게 일합니다',
  principles: [
    {
      k: '방향부터 맞춥니다',
      v: '완성된 모습과 큰 방향을 먼저 정하고, 그게 문제없이 굴러갈 길로 끌고 갑니다. 결론 없는 회의 대신 요약·결론.',
    },
    {
      k: '문제를 미리 막습니다',
      v: '터질 곳을 먼저 보고 예방합니다. 문서·기준 없이 찍어내 나중에 프랑켄슈타인이 되는 흐름을 구조로 차단합니다. (적은 애자일이 아니라 "기준 없음"입니다.)',
    },
    {
      k: '방식은 방향에 맞춰 고릅니다',
      v: '"유일한 정답"을 믿지 않습니다. 우선순위에 따라 애자일도 적극 채택하되, 경중을 따져 "이 방향이 안전하게 되는가"로 판단합니다.',
    },
    {
      k: '소통으로 시야를 맞춥니다',
      v: '할 일을 명시적으로 정하고 나눕니다. 시야가 안 맞으면 최대한 쉽게 풀어 설명하고 맞춰갑니다.',
    },
  ],
  axCmd: './gate.sh',
  axNote: '# 작업 방식의 증거 — AX 전환',
  axHead: '리뷰로 "하지 마세요"라고 ',
  axHeadEm1: '말하는',
  axHeadMid: ' 대신, 시스템이 애초에 ',
  axHeadEm2: '못 하게',
  axLede: [
    'AI가 코드의 대부분을 쓰는 지금, 저는 코드量이 아니라 ',
    '무엇이 머지되는가를 결정하는 레일',
    '을 소유합니다. 홈쇼핑모아를 DDD·100% TS·에이전트 자율개발 구조로 재설계하는 AX 전환에서, 직접 만든 하네스가 그 레일입니다.',
  ],
  beforeTag: '// 사람에 의존 — "하지 마"',
  before: [
    '코드리뷰에서 매번 지적',
    '컨벤션 문서·구두 약속',
    '깜빡하면 그냥 통과',
    '품질이 리뷰어 컨디션에 좌우',
  ],
  afterTag: '// 시스템이 강제 — "못 하게"',
  after: [
    'block-raw-merge 훅',
    'fail-closed eslint 의존성 경계',
    'lint/test 자동수정·차단 훅',
    '품질이 구조에서 나옴',
  ],
  gate: [
    { k: 'hooks', v: 'secret-scan ✓  block-raw-merge ✓  auto-lint/test ✓  (15 hooks)' },
    { k: 'gate-ci', v: 'static ✓  lint ✓  test ✓  (병렬)' },
    { k: 'eslint', v: 'dependency-boundary ✓  (fail-closed, 단방향)' },
  ],
  gatePass: '✓ MERGE ALLOWED — 레일을 통과한 변경만 합쳐진다.',
  axChips: [
    { label: '커스텀 스킬', strong: '20' },
    { label: '강제 훅', strong: '15' },
    { label: '규칙 문서', strong: '11' },
    { label: 'AX 커밋', strong: '2,001/6개월' },
    { label: '강제 래칫 위반', strong: '1,710→617' },
  ],
  axDetailLabel: '구조 자세히 ▸',
  axStructureTitle: 'AX 전환 — 어떤 구조로 설계했나',
  axStructure: [
    {
      n: '1',
      title: "AI 워커를 '격리된 git worktree'에서 돌리는 3층 오케스트레이션",
      body: '먼저 PRD로 "무엇을·왜"를 정하고 tier(우선순위)로 경중을 나눔. 그다음 이슈를 근본(방향)/트랙(묶음)/워커(격리 worktree의 AI)로 분해. 각 워커가 설계→구현→셀프리뷰→게이트→PR을 혼자 돌리고, 막히면 추측 대신 "매니저에게 질문"으로 승격(환각 방지).',
      diagram:
        'PRD(무엇·왜) · tier(우선순위)\n       │ 분해\n이슈 ─ 근본(방향) ─ 트랙(묶음) ─ 워커(격리 worktree의 AI)\n                                  └ 설계→구현→셀프리뷰→게이트→PR, 막히면 질문',
    },
    {
      n: '2',
      title: "설계 원칙을 '못 어기는 린트 규칙'으로 — ~110개, 각각 테스트",
      body: 'noAdHoc*(손조립 금지)·noRaw*(원시값 금지)·require*(필수 강제). 원칙을 글이 아니라 CI가 깨뜨리는 규칙으로 박음.',
    },
    {
      n: '3',
      title: '전부 fail-closed — "애매하면 막는다"가 기본값',
      body: '셋 다 "의심되면 막기"야. ① 게이트는 비교 기준(--base) 없이 돌리면 그냥 죽어서, 변경 범위를 좁게 속여 몰래 통과시키는 걸 막음. ② 모듈이 서로 물고 도는 순환 import는 예외 0 — 한 건도 허용 안 함. ③ 새 코드베이스를 레거시와 한 저장소에 격리해 둠 — 규칙이 달라 섞이면 오염되니까. 그래서 세션이 어느 쪽에서 도는지 git으로 못 가리면, 허용이 아니라 차단.',
    },
    {
      n: '4',
      title: "무거운 검사(type·lint·test)를 '메모리 슬롯 스케줄러'로",
      body: '머신·세션 간 공유 레지스트리 + mkdir 락 + 실측 메모리 압력으로 병렬↔직렬 자동 결정 + 데드 슬롯 PID 회수.',
    },
    {
      n: '5',
      title: '되돌릴 수 없는 품질 래칫(betterer)',
      body: '위반 수를 장부로 박고 CI가 증가를 차단 → 늘 수 없고 줄기만. 한 규칙은 1,710에서 현재 570.',
    },
    {
      n: '6',
      title: '새 코드가 검사를 몰래 빠져나가지 못하게 (fail-closed)',
      body: '모노레포라 검사를 turbo로 전 패키지에 한 번에 돌리는데, 새 패키지가 type·lint·test 스크립트를 선언 안 하면 turbo가 "돌릴 게 없네" 하고 조용히 건너뛰고도 초록불을 냄 — 검사 안 된 코드가 그냥 통과. 그래서 ① 멤버 표식 ② 표준 검사 스크립트(type·lint·test) ③ 규율 설정, 셋을 다 갖춰야만 통과하게 강제함.',
    },
  ],
  adDetailLabel: '동작 자세히 ▸',
  adStructureTitle: '광고 캡처 무인 자동화 — 어떻게 돌아가나',
  adStructure: [
    { n: '1', title: '문제', body: '광고가 제대로 노출됐는지 증빙하려면 사람이 매번 손으로 캡처 — 회당 30분, 하루 2~10회. 새벽·심야 스케줄은 깜빡해서 누락.' },
    { n: '2', title: '시스템 — 편성 스케줄 기반 무인 캡처', body: '편성 스케줄을 읽어 iOS 시뮬레이터에서 앱을 Maestro로 몰고 다니며 화면을 캡처 → zip → Slack과 광고 어드민에 이중 업로드.', diagram: '크론 트리거\n  │\n  ▼\n편성 스케줄 fetch ─► done.json에 있으면 제외 (멱등)\n  │\n  ▼\n[가드] 시뮬레이터 이미 떠 있나?\n  ├─ 다른 채널 점유      ─► 중단\n  ├─ 좀비(bootedCount≥5) ─► 담당자 멘션 · kill · 종료\n  └─ 정상               ─► 채널 락 획득\n  │\n  ▼\n현재 방송 중 + 미완료 광고 1건 선택\n  │\n  ▼\n시뮬 부팅(close→open→boot) ─► Maestro로 화면 캡처\n  │\n  ▼\nzip ─► 이중 업로드(Slack + 광고 어드민)\n  │        └─ 실패 ─► 30회 재시도 ─► 실패 시 failed/ 보관(다음 런 재전송)\n  ▼\ndone 기록 ─► 시뮬 종료 · 정리 ─► exit\n\n[상시] 어느 단계든 실패 → 10회 재시도(5·9회차 멘션), 소진 시 kill·종료\n[상시] 디스크 임계치 초과 → 별도 크론: 시뮬 erase + 캐시 정리 + 3일 경과 삭제' },
    { n: '3', title: '견고함 — 혼자 돌면서 스스로 복구', body: '설계 원칙은 fail-closed — 실패를 전제로, 스스로 복구하거나 다음 런으로 넘겨 누락 0.' },
    { n: '4', title: '임팩트', body: '비개발팀이 매일 손으로 하던 반복 QA를 무인 잡으로 치환.', chips: ['광고 12종', '25h 커버', '누락 0', '회당 30분×2~10회 제거'] },
  ],
  missionDetailLabel: '자세히 ▸',
  missionStructureTitle: '주문·결제·검색·영상·광고·푸시',
  missionStructure: [
    { n: '✳', title: 'WHAT I’VE DONE',
      body: '같은 문제가 두 번 보이면 패치가 아니라 구조로 푼다 — 필요하면 네이티브까지 내려가서.',
      chips: ['비병합 커밋 2,800+', '파일 3,000+', 'top-3 기여자'],
      list: ['홈·편성표·검색·상품상세·주문/클레임', '숏폼·쇼핑라이브·모아TV·마이', '광고 지면·통계 · 푸시 전달 · 개인화 카드할인 · A/B 실험 운영'] },
    { n: '1', title: '영상 파이프라인 통일 → 네이티브 Swift 패치',
      body: '화면마다 따로 살던 플레이어를 컴포넌트 1벌로 통일 — 22개 화면 공유.',
      list: ['재생 컨트롤(바·시간·헤더 등)을 순수 props 레고로 공통화 — tick마다 재렌더 안 되게 분리', 'expo-av → expo-video 전 지면 이관', '남은 iOS 크래시는 라이브러리 안 NSHashTable 스레드 레이스를 직접 Swift로 패치', '원인을 업스트림 이슈로 특정해 근거 남김'] },
    { n: '2', title: '푸시 "가끔 안 옴" → 전달 경로 전체 재정의',
      body: '간헐 유실·토큰 덮어쓰기를 개별 버그가 아니라 전달 경로 문제로 봄.',
      list: ['FCM/notifee 책임을 앱 상태별로 재분할', '빈 값이 서버 토큰을 덮어쓰지 못하게 차단 + rotation 자동 갱신', 'fcmMessageId를 로그에 태워 "보냈는데 안 왔다"를 추적 가능하게'] },
    { n: '3', title: '앱 시작 ANR → 고치기 전에 재현기부터',
      body: '고치기 전에, ANR을 일부러 일으키는 재현기부터 만듦.',
      list: ['원인: 초기화 API를 하나씩 순서대로 await', '꼭 먼저여야 하는 것만 남기고 나머지 병렬화'] },
    { n: '4', title: '홈쇼핑사 웹뷰 연동 — 사별 로그인·결제',
      body: '구매가 완료되려면 각 홈쇼핑사 웹뷰를 통과해야 함 — 막히는 지점을 사별로 하나씩 뚫음.',
      list: ['CJ 로그인 Cloudflare Turnstile을 UA 전략으로 돌파', 'CJ 토스페이·NS샵 iOS·롯데 등 사별 결제 이슈 연달아 해결', '추적 안 되는 iOS 웹뷰는 webview-debug TestFlight 채널로 재현 후 수정'] },
    { n: '5', title: '리스트 공통화 + 성능 대청소',
      body: '제각각이던 무한스크롤을 FlashList 기반 공통 리스트로 통일 — 61개 파일 사용.',
      list: ['성능 패스에서 레거시 화면·1,100줄 구버전 포함 3,800여 줄 삭제', '가장 확실한 speedup은 지우는 것'] },
    { n: '6', title: '가격·할인 정합성 — 전 지면이 같은 숫자를',
      body: '지면마다 숫자가 다르면 그게 곧 신뢰 문제.',
      list: ['개인화 카드할인을 홈·편성표·상품상세·광고 카드까지 일관 적용', '서버 스키마 전환은 어댑터(productAdaptorV2)로 흡수 — 화면이 서버 사정을 모르게'] },
  ],
  craftCmd: 'ls ~/craft',
  craftNote: '# 직접 만든 것',
  craft: [
    {
      name: 'broccoli.log',
      badge: '이 페이지',
      desc: '커밋 로그를 거꾸로 걷는 레트로 탑다운 자기소개 게임. 엔진 없이 Canvas 2D.',
      stack: 'vite · typescript · canvas',
    },
    {
      name: 'ko-apt-finder',
      badge: '풀스택',
      desc: '부동산 검색 풀스택 앱 — 크롤러·PWA·CI/CD·암호화 시크릿. 실배포 운영 경험.',
      stack: 'next.js 15 · postgres · tanstack',
    },
    {
      name: 'projkit',
      badge: 'npm',
      desc: 'AI·Claude Code 워크플로우를 스캐폴딩하는 프로젝트 셋업 CLI.',
      stack: 'typescript · tsup · cli',
    },
    {
      name: 'stock-tracker',
      badge: 'MCP',
      desc: '기술적 지표를 계산해 제공하는 MCP 서버 — AI 툴링 실험.',
      stack: 'mcp sdk · node · playwright',
    },
  ],
  contactCmd: 'contact',
  foot: '',
}

const en: ResumeData = {
  whoamiCmd: 'whoami',
  name: 'Yongbeom Choi',
  handle: 'broccoli',
  role: 'Frontend Engineer',
  meta: 'Since 2015.09 (11 yrs) · React Native · Expo · TypeScript · Claude Code · AI-agent orchestration · Seoul',
  thesisCmd: 'cat thesis.md',
  thesisPre: '# ',
  thesisHead: 'I make things ',
  thesisEm: 'actually work.',
  thesisSub: [
    'On the side you do not see — migrations, automation, quality gates: the hard, invisible work that has to keep running. Even making AI-written code ',
    "'unable'",
    " to go wrong is part of making things work.",
  ],
  walk: '▶ broccoli.log — take a walk',
  links: [
    { label: 'GitHub', href: 'https://github.com/broccoliInDB' },
    { label: 'Blog', href: 'https://velog.io/@broccoliindb/' },
    { label: 'Email', href: 'mailto:broccoliindb@gmail.com' },
  ],
  stackCmd: 'cat stack.md',
  stackNote: '# Tech stack — core & AI first; the rest is history',
  stackPrimary: {
    label: 'Core',
    items: [
      'React Native',
      'Expo (EAS·OTA)',
      'TypeScript',
      'React Query',
      'Zustand',
      'React Navigation',
      'Tailwind (NativeWind)',
      'FlashList',
      'Firebase/FCM',
    ],
  },
  stackAi: {
    label: 'AI',
    items: [
      'Claude Code — built skills, hooks, subagents, quality gates',
      'MCP (used + built my own)',
      'AI-agent autonomous-dev harness',
    ],
  },
  stackRest: [
    {
      label: 'Quality & infra',
      items: ['pnpm', 'Turborepo', 'custom ESLint', 'vitest', 'GitHub Actions', 'Maestro'],
    },
    {
      label: 'Earlier (webview)',
      items: ['React', 'Recoil', 'SWR', 'Ant Design', 'Cypress', 'S3/CloudFront', 'k8s'],
    },
    { label: 'Past', items: ['WPF', 'C#', '.NET', 'Oracle'] },
  ],
  careerCmd: 'git log --oneline --author=broccoli',
  careerNote: '# Career · 2015–now — always building, always driving, 11 years',
  career: [
    {
      ref: 'b8f20ac',
      tag: '(HEAD → now)',
      date: '2026.06~',
      msg: 'Leading the AX transformation — an AI-autonomous dev system',
      isNow: true,
      details: [
        'Designed and built a harness where AI "cannot go wrong" — rules, hooks, gates, agent orchestration',
        '~6 months, 2,000+ commits · rails that keep direction intact no matter who (human or AI) writes the code',
      ],
      stack: ['claude code', 'pnpm', 'turborepo', 'custom eslint', 'github actions'],
      axDetail: true,
      company: 'Buzzni · Hsmoa',
    },
    {
      ref: 'a7c3e91',
      date: '2023.03 ~ 2026.06',
      msg: 'RN mission squad — product features, shared components & performance',
      details: [
        'Shipped personalization/discount, short-form, ads, key-product missions · shared-component & performance chapters',
      ],
      stack: ['react native', 'expo', 'react-query', 'flashlist'],
      missionDetail: true,
      company: 'Buzzni · Hsmoa',
    },
    {
      ref: 'c4d9f02',
      date: '2024',
      msg: 'Ad-capture fully unattended',
      details: [
        'Removed ~30 min of manual work × 2–10×/day · zero misses on dawn/late-night runs',
        'Self-recovers on failure · auto disk cleanup · Slack notifications',
      ],
      stack: ['maestro', 'node', 'slack'],
      adDetail: true,
      company: 'Buzzni · Hsmoa',
    },
    {
      ref: 'a3f1c90',
      date: '2022.11',
      msg: 'WebView → React Native full migration (incl. payments)',
      details: [
        'Full WebView → RN migration (zero-downtime: older versions routed to the old webview)',
        'Shared UI / design-system foundation · camera/share/A-B common modules',
        'PG payments · orders · claims · broadcast schedule — commerce core',
      ],
      stack: ['expo', 'react-native', 'react-query', 'tailwind'],
      company: 'Buzzni · Hsmoa',
    },
    {
      ref: '7b2e4d1',
      date: '2021.09',
      msg: 'WebView service ops · built a no-code tool',
      details: [
        'Promotions, outlet, charts, categories, support — service logic',
        'Built a custom no-code DB tool (nocodb) from scratch',
      ],
      stack: ['react', 'swr', 'emotion', 'nocodb'],
      company: 'Buzzni · Hsmoa',
    },
    {
      ref: '4d1ea9b',
      date: '2018.06',
      msg: 'Tech team — drove shared modules & onboarding',
      details: [
        'Shared modules/screens · docs static site (Hugo) · memory/perf',
        'Onboarding training for new frontend hires · troubleshooting · release/versioning',
      ],
      stack: ['ember', 'scss', 'hugo', 'jenkins'],
      company: 'ezCaretech',
    },
    {
      ref: '15a7b00',
      date: '2015.09',
      msg: 'Hospital Information System (HIS) — new screens',
      details: [
        'Next-gen SI for university hospitals at home and in the US',
        'Nursing/EMR/diet screens · emergency network (NEDIS) · on-site clinician training',
      ],
      stack: ['wpf', 'c#/.net', 'oracle'],
      company: 'ezCaretech',
    },
  ],
  impactCmd: 'git stats && cloc .',
  impactNote: '# Impact (measured from code/git · service scale anonymized)',
  stats: [
    { value: '227', label: 'screens · live commerce app' },
    { value: '410', label: 'shared components · Atomic' },
    { value: '240', unit: 'k', label: 'LOC · hsmoa app' },
    { value: '1,573', label: 'merged PRs · #1 contributor' },
    { value: '4', unit: 'yrs', label: 'continuous on one product' },
    { value: '−64', unit: '%', label: 'lint violations ↓ · CI-enforced ratchet (3mo)' },
    { value: '100', unit: '%', label: 'ad capture unattended · 0 missed' },
  ],
  principlesTitle: 'How I work',
  principles: [
    {
      k: 'Align on direction first',
      v: 'Set the end state and the big direction, then steer the work down a path that can run without problems. Summaries and decisions over conclusion-less meetings.',
    },
    {
      k: 'Prevent problems early',
      v: 'Spot where it will break and head it off. Block — structurally — the "no docs, no standards, ad-hoc" drift that turns into a Frankenstein. (The enemy is "no standards," not agile.)',
    },
    {
      k: 'Pick the method to fit the direction',
      v: 'No "one true way." I\'ll adopt agile when priorities call for it — judged by "will this direction safely work?", weighing the trade-offs.',
    },
    {
      k: 'Align vision through communication',
      v: 'Decide and split the work explicitly. When we don\'t see the same picture, I explain it as simply as I can and we converge.',
    },
  ],
  axCmd: './gate.sh',
  axNote: '# Proof of how I work — the AX transformation',
  axHead: 'Instead of ',
  axHeadEm1: 'telling',
  axHeadMid: ' reviewers "don\'t", the system makes it ',
  axHeadEm2: 'impossible',
  axLede: [
    'Now that AI writes most of the code, I own not the volume but ',
    'the rail that decides what gets merged',
    '. In the AX transformation — rebuilding hsmoa into DDD, 100% TS, agent-autonomous — the harness I built is that rail.',
  ],
  beforeTag: '// relies on people — "don\'t"',
  before: [
    'caught in code review, every time',
    'convention docs & verbal promises',
    'slips through when forgotten',
    'quality depends on the reviewer',
  ],
  afterTag: '// enforced by the system — "can\'t"',
  after: [
    'block-raw-merge hook',
    'fail-closed eslint dependency boundary',
    'auto-fix/blocking lint & test hooks',
    'quality comes from structure',
  ],
  gate: [
    { k: 'hooks', v: 'secret-scan ✓  block-raw-merge ✓  auto-lint/test ✓  (15 hooks)' },
    { k: 'gate-ci', v: 'static ✓  lint ✓  test ✓  (parallel)' },
    { k: 'eslint', v: 'dependency-boundary ✓  (fail-closed)' },
  ],
  gatePass: '✓ MERGE ALLOWED — only changes that pass the rail get merged.',
  axChips: [
    { label: 'custom skills', strong: '20' },
    { label: 'enforcement hooks', strong: '15' },
    { label: 'rule docs', strong: '11' },
    { label: 'AX commits', strong: '2,001/6mo' },
    { label: 'enforced ratchet', strong: '1,710→617' },
  ],
  axDetailLabel: 'See the structure ▸',
  axStructureTitle: 'The AX transformation — how it’s structured',
  axStructure: [
    {
      n: '1',
      title: 'A 3-tier orchestration running AI workers in isolated git worktrees',
      body: 'First a PRD pins down "what and why" and a tier sets priority; then the issue decomposes into root (direction) / track (grouping) / worker (an AI in an isolated git worktree). Each worker runs design→build→self-review→gate→PR on its own, escalating a "question to the manager" instead of guessing.',
      diagram:
        'PRD (what·why) · tier (priority)\n       │ decompose\nissue ─ root(direction) ─ track(grouping) ─ worker(AI in isolated worktree)\n                                             └ design→build→self-review→gate→PR, asks when stuck',
    },
    {
      n: '2',
      title: 'Design principles frozen into lint rules you can’t break — ~110, each tested',
      body: 'noAdHoc* (no hand-assembly), noRaw* (no raw primitives), require* (enforce the mandatory). Principles live as CI-breaking rules, not prose.',
    },
    {
      n: '3',
      title: 'Fail-closed everywhere — "when unsure, block" is the default',
      body: 'All three are "when in doubt, block." ① The gate just dies if run without a compare-base (--base), so you can’t shrink the diff to sneak something through. ② Import cycles between modules get a zero baseline — not one allowed. ③ The new codebase is isolated from the legacy one inside the same repo — their rules differ, so mixing them corrupts it. So if git can’t tell which side a session is on, it blocks rather than allows.',
    },
    {
      n: '4',
      title: 'Heavy checks (type·lint·test) behind a memory-slot scheduler',
      body: 'A cross-machine, cross-session registry + mkdir lock + parallel-vs-serial decided by live memory pressure + dead-slot reclamation by PID.',
    },
    {
      n: '5',
      title: 'An irreversible quality ratchet (betterer)',
      body: 'Violation counts are pinned in a ledger and CI blocks any increase → they can only fall, never rise. One rule went 1,710 → 570.',
    },
    {
      n: '6',
      title: 'No new code slips past the checks (fail-closed)',
      body: 'In the monorepo, checks run across every package at once via turbo — but if a new package doesn’t declare its type·lint·test scripts, turbo "has nothing to run," skips it, and still reports green, so unchecked code just slips through. So a package passes only if it carries all three: ① a membership marker, ② the standard check scripts (type·lint·test), and ③ the discipline config.',
    },
  ],
  adDetailLabel: 'How it runs ▸',
  adStructureTitle: 'Ad-capture automation — how it runs',
  adStructure: [
    { n: '1', title: 'The problem', body: 'Proving ads actually ran meant capturing every slot by hand — ~30 min per run, 2–10×/day. Dawn and late-night slots got forgotten and missed.' },
    { n: '2', title: 'The system — schedule-driven unattended capture', body: 'It reads the broadcast schedule and drives the app in an iOS simulator via Maestro to capture each screen → zips → dual-uploads to Slack and the ad admin.', diagram: 'cron trigger\n  │\n  ▼\nfetch ad schedule ─► skip anything already in done.json (idempotent)\n  │\n  ▼\n[guard] simulator already up?\n  ├─ held by another channel ─► abort\n  ├─ zombie (bootedCount≥5)   ─► @-mention owners · kill · exit\n  └─ ok                        ─► acquire channel lock\n  │\n  ▼\npick one ad: on air now + not done\n  │\n  ▼\nboot sim (close→open→boot) ─► Maestro captures screens\n  │\n  ▼\nzip ─► dual upload (Slack + ad admin)\n  │        └─ fail ─► retry 30× ─► still failing: park in failed/ (next run resends)\n  ▼\nrecord done ─► close sim · cleanup ─► exit\n\n[always] any step fails → retry 10× (@-mention at 5·9), kill·exit if exhausted\n[always] disk over threshold → separate cron: erase sim + clear caches + delete >3-day files' },
    { n: '3', title: 'Robustness — runs alone, recovers itself', body: 'Designed fail-closed — it assumes failure, recovering itself or deferring to the next run, for zero misses.' },
    { n: '4', title: 'Impact', body: 'A non-dev team’s daily manual QA, turned into an unattended job.', chips: ['12 ad types', '25h window', '0 misses', '~30 min × 2–10/day removed'] },
  ],
  missionDetailLabel: 'See detail ▸',
  missionStructureTitle: 'Orders · payments · search · video · ads · push',
  missionStructure: [
    { n: '✳', title: 'WHAT I’VE DONE',
      body: 'When a problem shows up twice, I solve it with structure, not a patch — down to the native layer if that’s what it takes.',
      chips: ['2,800+ non-merge commits', '3,000+ files', 'top-3 contributor'],
      list: ['Home · schedule · search · product detail · orders/claims', 'Short-form · shopping live · MoaTV · My', 'Ad surfaces & analytics · push delivery · personalized discounts · A/B experiments'] },
    { n: '1', title: 'Unified video pipeline → a native Swift patch',
      body: 'Every surface had its own player — unified into one component now shared by 22 screens.',
      list: ['Broke the playback controls (bar, time, header…) into pure-props lego and shared them — isolated so they don’t re-render each tick', 'Migrated the whole app from expo-av to expo-video', 'Patched the remaining iOS crash — an NSHashTable thread race — at the Swift level inside the library', 'Pinned the cause to the upstream issue'] },
    { n: '2', title: 'Push that "sometimes didn’t arrive" → the whole delivery path, redrawn',
      body: 'I treated intermittent loss and clobbered tokens as a delivery-path problem, not a bug list.',
      list: ['Split FCM/notifee responsibility per app state', 'Blocked empty values from overwriting the server token + auto-refresh on rotation', 'Threaded fcmMessageId through logs so "sent but never arrived" became traceable'] },
    { n: '3', title: 'Cold-start ANR → built the repro before the fix',
      body: 'Before fixing it, I built a way to trigger the ANR on demand.',
      list: ['Cause: init APIs awaited one by one', 'Kept only the order-dependent step; parallelized the rest'] },
    { n: '4', title: 'Broadcaster webviews — per-vendor login & payment',
      body: 'A purchase completes only if it survives each broadcaster’s WebView; I cleared the blockers one vendor at a time.',
      list: ['Passed CJ’s Cloudflare Turnstile login with a user-agent strategy', 'Closed vendor payment issues one by one (CJ Toss Pay, NS Shop iOS, Lotte…)', 'Built a webview-debug TestFlight channel to reproduce untraceable iOS WebView bugs, then fixed them'] },
    { n: '5', title: 'A common list + a performance teardown',
      body: 'Consolidated per-screen infinite scroll into one FlashList-based list — used by 61 files.',
      list: ['Deleted 3,800+ lines in the perf pass, incl. a 1,100-line legacy component', 'The most reliable speedup was deletion'] },
    { n: '6', title: 'Price/discount consistency — one number everywhere',
      body: 'A price that differs between surfaces is a trust bug.',
      list: ['Rolled personalized card discounts consistently across home, schedule, product detail, ad cards', 'Absorbed the server schema transition behind an adapter (productAdaptorV2) so screens never see server quirks'] },
  ],
  craftCmd: 'ls ~/craft',
  craftNote: '# things I built',
  craft: [
    {
      name: 'broccoli.log',
      badge: 'this page',
      desc: 'A retro top-down intro game that walks the commit log backwards. No engine, Canvas 2D.',
      stack: 'vite · typescript · canvas',
    },
    {
      name: 'ko-apt-finder',
      badge: 'full-stack',
      desc: 'Real-estate search full-stack app — crawlers, PWA, CI/CD, encrypted secrets. Ran in production.',
      stack: 'next.js 15 · postgres · tanstack',
    },
    {
      name: 'projkit',
      badge: 'npm',
      desc: 'A project-setup CLI that scaffolds AI / Claude Code workflows.',
      stack: 'typescript · tsup · cli',
    },
    {
      name: 'stock-tracker',
      badge: 'MCP',
      desc: 'An MCP server computing technical indicators — an AI-tooling experiment.',
      stack: 'mcp sdk · node · playwright',
    },
  ],
  contactCmd: 'contact',
  foot: '',
}

export const RESUME: Record<Lang, ResumeData> = { ko, en }

export function getResume(): ResumeData {
  return RESUME[getLang()]
}
