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
  meta: '2015.09~ (만 11년) · React Native · Expo · TypeScript · Seoul',
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
  careerCmd: 'git log --oneline --author=broccoli',
  careerNote: '# 커리어 · 2015~현재 — 늘 주도적으로 만들어 온 11년',
  career: [
    {
      ref: '0e06d11',
      tag: '(HEAD → now)',
      date: '2023.03~',
      msg: 'RN 미션 스쿼드 & AX 전환 주도',
      isNow: true,
      details: [
        'AX 전환 주도 — AI가 "잘못할 수 없는" 개발 체계 구축 · 6개월 2,001커밋',
        '개인화 할인·숏폼·광고·핵심상품 미션 복수 참여 · 공용 컴포넌트/성능 챕터',
        '광고 캡처 100% 무인 자동화 — 회당 30분 수작업 × 하루 2~10회 제거, 새벽·심야 누락 0',
      ],
    },
    {
      ref: 'a3f1c90',
      date: '2022.11',
      msg: '웹뷰 → React Native 전면 전환 (결제까지)',
      details: [
        '리부트 첫 커밋부터 참여 · 공용 UI·공통모듈(카메라/공유/AB테스트)',
        'PG 연동·결제, 주문·클레임·편성표 등 커머스 로직',
      ],
      stack: ['expo', 'react-native', 'react-query', 'tailwind'],
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
    },
    {
      ref: 'c0ffee0',
      date: '2020~2021',
      msg: '웹 개발을 바닥부터 재학습 · 모바일 커머스로 전환',
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
  foot: '숫자는 git·코드 실측. 서비스 규모(MAU 등)는 사내 기밀이라 익명 매직니튜드로만. AX는 측정된 생산성 수치가 없어 "쟀다"가 아니라 "레일을 이 규모로 깔았다 + 강제 래칫 위반 -64%"로 정직하게 표현.',
}

const en: ResumeData = {
  whoamiCmd: 'whoami',
  name: 'Yongbeom Choi',
  handle: 'broccoli',
  role: 'Frontend Engineer',
  meta: 'Since 2015.09 (11 yrs) · React Native · Expo · TypeScript · Seoul',
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
  careerCmd: 'git log --oneline --author=broccoli',
  careerNote: '# Career · 2015–now — always building, always driving, 11 years',
  career: [
    {
      ref: '0e06d11',
      tag: '(HEAD → now)',
      date: '2023.03~',
      msg: 'RN mission squads & leading the AX transformation',
      isNow: true,
      details: [
        'Leading the AX transformation — a dev system where AI "cannot go wrong" · 2,001 commits in 6 months',
        'Personalized discounts, short-form, ads, featured products · shared components & performance chapter',
        'Ad capture 100% unattended — removed 30-min manual runs × 2–10/day, zero missed dawn/late slots',
      ],
    },
    {
      ref: 'a3f1c90',
      date: '2022.11',
      msg: 'WebView → React Native full migration (incl. payments)',
      details: [
        'In from the reboot\'s first commit · shared UI & core modules (camera/share/AB test)',
        'PG integration & checkout, orders · claims · broadcast schedule and commerce logic',
      ],
      stack: ['expo', 'react-native', 'react-query', 'tailwind'],
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
    },
    {
      ref: 'c0ffee0',
      date: '2020~2021',
      msg: 'Relearned web dev from the ground up · pivoted to mobile commerce',
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
  foot: 'Numbers are measured from git/code. Service scale (MAU, etc.) is proprietary, shown only as anonymized magnitudes. AX has no measured productivity figure, so it is framed honestly as "a rail built at this scale + enforced ratchet −64%", not "measured gains".',
}

export const RESUME: Record<Lang, ResumeData> = { ko, en }

export function getResume(): ResumeData {
  return RESUME[getLang()]
}
