import { getLang } from './index'
import { type Lang } from './types'

// The scroll cinema is the landing: an accessible, premium narrative that works
// for non-developers. It reads top→bottom; the background assembles from chaos
// (red, tangled) into order (green, grid) as the thesis is proven.

export interface Scene {
  year: string
  state: 'chaos' | 'order'
  stateLabel: string
  heading: string // may contain {em}…{/em}
  body: string[]
  result?: string
  resultNum?: string
  items?: string[]
  gate?: boolean
}

export interface CinemaData {
  heroTitle: string // {em}
  heroSub: string
  heroWho: string
  scrollCue: string
  scenes: Scene[]
  closeStateLabel: string
  closeHeading: string // {em}
  closeBody: string
  ctaWalk: string
  ctaResume: string
  ctaContact: string
  gateButton: string
  gateButtonAgain: string
  gateIntro: string
  gateSteps: string[] // html-ish; ✓ marks inserted by module
  stateChaos: string
  stateTransition: string
  stateOrder: string
}

const ko: CinemaData = {
  heroTitle: '품질을 사람이 아니라\n{em}구조가.{/em}',
  heroSub: '누가 짜도 같은 방향으로 가게 레일을 깔고, 반복해서 기대한 모양에 수렴시킴.',
  heroWho: '최용범 · broccoli · 프론트엔드 엔지니어 · 2015~',
  scrollCue: '스크롤해서 걸어보기',
  scenes: [
    {
      year: '2015 · 시작',
      state: 'chaos',
      stateLabel: '틀리면 안 되는 도메인',
      heading: '의료정보시스템(HIS)으로 커리어 시작',
      body: [
        '국내·미국 대학병원 {b}차세대 HIS{/b} 구축·운영에서 간호·식이·기록 영역 신규 화면을 만들고 유지관리 및 고도화 진행.',
        '요청문서 자체의 구조 및 디자인보다 {b}실제 쓰는 사람의 경험{/b}이 어떻게 유동적으로 변화할수 있고 반영해야함을 겪음. 도메인 특성상 안정성의 우선순위가 높아 배포 및 차세대 오픈시 까다로운 검수과정을 경험함.',
      ],
    },
    {
      year: '2018 · 문서보다 체계',
      state: 'chaos',
      stateLabel: '선순환을 어떻게 만들까',
      heading: '문제는 문서가 아니라,\n{em}선순환을 만드는 체계.{/em}',
      body: [
        '의료 도메인의 가장 큰 우선순위는 {b}안정성{/b}이었기 때문에 요청 없는 자발적 레거시 개선건들은 매번 도전적이고 어려웠고 {b}문서화의 중요성{/b}을 체감함.',
        '기술팀에서 시도해보려 했지만 {b}문서화를 위한 작업은 체계와 시스템을 갖추지 않고선 의미를 갖지 못함{/b}을 깨달음.',
      ],
    },
    {
      year: '2021 · 숫자로 정하는 UI',
      state: 'chaos',
      stateLabel: '감이 아니라 데이터로',
      heading: '감이 아니라,\n{em}숫자로 UI를 정함.{/em}',
      body: [
        '의료에서 {b}커머스로 전환{/b}. 기획전·알림센터·결제 같은 {b}고객이 직접 만지는 화면{/b}을 웹뷰로 만듦.',
        '팀이 함께 {b}가설 → A/B → 지표 확인{/b}으로 움직임. 감이 아니라 데이터로 {b}고객경험과 구매 전환{/b}을 끌어올리려고 함.',
      ],
    },
    {
      year: '2022 · RN으로 재건',
      state: 'order',
      stateLabel: '적은 인원, 빠른 배포',
      heading: '웹뷰 하이브리드를,\n{em}Expo RN으로.{/em}',
      body: [
        '스토어 배포 속도보다 {b}심사 없이 바로 나가는 OTA{/b}를 택해, Expo RN으로 전면 전환.',
      ],
      items: [
        '알림 상태 모델 재설계',
        '공용 컴포넌트 안전 교체',
        '무한스크롤 리스트 공통 구조',
        '영상 플레이어 공통 구조',
        'RN 리부트 토대',
        '커머스 코어 — 결제·주문·클레임',
        '외부 커머스 웹뷰 연동 — 로그인·결제·공유 호환',
        '릴리스·플랫폼 운영 (OTA·CI)',
      ],
    },
    {
      year: '2024 · 자동화',
      state: 'order',
      stateLabel: '사람이 놓치던 걸 기계가',
      heading: '새벽에 사람이 하던 일을,\n{em}아무도 안 건드리게.{/em}',
      body: [
        '광고가 제대로 노출됐는지 증빙하려면 {b}매번 사람이 손으로 캡처{/b}해야 했음. 새벽·심야 스케줄은 깜빡하기 일쑤.',
        '이걸 {b}완전 무인 파이프라인{/b}으로 만듦. 실패하면 스스로 복구하고 디스크도 알아서 정리함.',
      ],
      result: '무인 · 회당 30분 수작업 제거 · 누락 0',
      resultNum: '100%',
    },
    {
      year: '2026 · 지금(HEAD)',
      state: 'order',
      stateLabel: '품질을 사람이 아니라 구조가',
      heading: "AI에게 '하지 마' 대신,\n{em}못 하게 만듦.{/em}",
      body: [
        '이제 AI가 코드 대부분을 씀. 나는 코드 양이 아니라 {b}"무엇이 통과되는가"를 정하는 레일{/b}을 만듦.',
        '리뷰에서 "이렇게 하지 마세요" {b}말하는{/b} 대신, 잘못된 변경은 애초에 {b}합쳐질 수 없게{/b} 장치로 막음. 아래 버튼 눌러보기.',
      ],
      gate: true,
      result: '위반이 늘 수 없게 막고, 꼭 필요한 최소치까지 줄여나감',
    },
  ],
  closeStateLabel: 'order / 시스템이 처리',
  closeHeading: '그래서, {em}사람이 아니라 구조가.{/em}',
  closeBody: '10년 넘게 해온 건 결국 하나 — 사람 손이 아니라 구조가 품질을 지키게 만드는 것.',
  ctaWalk: '▶ 커밋 로그를 직접 걸어보기',
  ctaResume: '이력서 자세히 보기',
  ctaContact: '이메일',
  gateButton: '▶ ./gate.sh 실행',
  gateButtonAgain: '▶ 다시 실행',
  gateIntro: '# 변경을 합치려면 이 레일을 통과해야 함',
  gateSteps: [
    '$ ./gate.sh',
    '▸ 비밀번호·키가 섞였나 검사 {ok}',
    '▸ 모듈이 서로 얽혔나(순환) 검사 {ok}',
    '▸ 정한 규칙을 어긴 게 늘었나 검사 {ok} {m}(늘면 막고, 줄어야 통과){/m}',
    '▸ 타입·린트·테스트 자동 실행 {ok}',
    '{ok-line}✓ 통과 — 합쳐도 됨.{/ok-line}',
  ],
  stateChaos: 'chaos / 사람 의존',
  stateTransition: 'transition…',
  stateOrder: 'order / 시스템이 처리',
}

const en: CinemaData = {
  heroTitle: 'Quality held by structure,\n{em}not by people.{/em}',
  heroSub: 'I lay the rails so anyone’s work heads the same way, and iterate until it converges on the intended shape.',
  heroWho: 'Yongbeom Choi · broccoli · Frontend Engineer · since 2015',
  scrollCue: 'scroll to take a walk',
  scenes: [
    {
      year: '2015 · the start',
      state: 'chaos',
      stateLabel: 'a domain with no room for error',
      heading: 'Started my career on a hospital information system (HIS).',
      body: [
        'On {b}next-gen HIS builds{/b} for university hospitals at home and in the US, I built, maintained and advanced new screens across nursing, diet and records.',
        'I learned that {b}how real users actually work{/b} shifts fluidly and has to be reflected — more than the structure or design of the spec itself. A domain that puts stability first, with demanding review at each release and go-live.',
      ],
    },
    {
      year: '2018 · structure over docs',
      state: 'chaos',
      stateLabel: 'how do you make a virtuous cycle',
      heading: 'The problem wasn’t the docs —\n{em}it was the system that makes them.{/em}',
      body: [
        'Stability was the {b}medical domain’s{/b} top priority, so unrequested, self-driven legacy cleanups were a challenge every time — and I felt {b}how much documentation matters{/b}.',
        'I tried to tackle it from the tech team, but realized {b}documentation work means nothing without a system and structure behind it{/b}.',
      ],
    },
    {
      year: '2021 · UI decided by numbers',
      state: 'chaos',
      stateLabel: 'by data, not by gut',
      heading: 'Not by gut —\n{em}UI decided by numbers.{/em}',
      body: [
        'I moved from medical to {b}commerce{/b}, building {b}screens customers touch directly{/b} as webviews — promotions, the alarm center, payments.',
        'As a team we moved by {b}hypothesis → A/B → metrics{/b}, trying to lift {b}customer experience and purchase conversion{/b} by data, not gut.',
      ],
    },
    {
      year: '2022 · rebuilt on RN',
      state: 'order',
      stateLabel: 'fewer people, faster releases',
      heading: 'From a webview hybrid\n{em}to Expo RN.{/em}',
      body: [
        'Rather than store-release speed, I chose {b}OTA that ships without review{/b} — a full move to Expo RN.',
      ],
      items: [
        'Notification state model redesign',
        'Safe staged component replacement',
        'Shared infinite-scroll list structure',
        'Unified video player structure',
        'RN reboot foundation',
        'Commerce core — payments, orders, claims',
        'External-commerce webview integration — login, payment, share compat',
        'Release & platform ops (OTA, CI)',
      ],
    },
    {
      year: '2024 · automation',
      state: 'order',
      stateLabel: 'what people missed, a machine now catches',
      heading: 'The 3am manual job —\n{em}now no one has to touch it.{/em}',
      body: [
        'Proving ads actually ran meant {b}capturing every slot by hand{/b}. The dawn and late-night slots got forgotten.',
        'I turned it into a {b}fully unattended pipeline{/b} — it recovers from its own failures and cleans up its own disk.',
      ],
      result: 'unattended · removed 30-min manual runs · 0 missed',
      resultNum: '100%',
    },
    {
      year: '2026 · now (HEAD)',
      state: 'order',
      stateLabel: 'quality from structure, not people',
      heading: 'Instead of telling AI "don’t",\n{em}I make it unable to.{/em}',
      body: [
        'AI writes most of the code now. I own not the volume but {b}the rail that decides what gets merged{/b}.',
        'Instead of {b}saying{/b} "don’t do that" in review, a wrong change {b}simply cannot be merged{/b}. Press the button below.',
      ],
      gate: true,
      result: 'Violations can’t rise — only fall, toward the necessary minimum.',
    },
  ],
  closeStateLabel: 'order / handled by the system',
  closeHeading: 'So — {em}structure, not people.{/em}',
  closeBody: 'For 10+ years it has come down to one thing — structure, not hands, keeping quality in check.',
  ctaWalk: '▶ walk the commit log yourself',
  ctaResume: 'see the full resume',
  ctaContact: 'Email',
  gateButton: '▶ run ./gate.sh',
  gateButtonAgain: '▶ run again',
  gateIntro: '# to merge a change, it must pass this rail',
  gateSteps: [
    '$ ./gate.sh',
    '▸ secrets / keys scanned {ok}',
    '▸ modules checked for tangled cycles {ok}',
    '▸ rule violations checked for any increase {ok} {m}(an increase is blocked; only a decrease passes){/m}',
    '▸ types · lint · tests run automatically {ok}',
    '{ok-line}✓ passed — safe to merge.{/ok-line}',
  ],
  stateChaos: 'chaos / relies on people',
  stateTransition: 'transition…',
  stateOrder: 'order / handled by the system',
}

export const CINEMA: Record<Lang, CinemaData> = { ko, en }

export function getCinema(): CinemaData {
  return CINEMA[getLang()]
}
