import { officeTabs, towerTabs } from './detail.ko'
import { type Content } from './types'

export const ko: Content = {
  ui: {
    pressStart: '▶ PRESS START',
    subtitle: '프론트엔드 엔지니어 브로콜리를 소개합니다',
    chooseLang: '언어',
    tldr: 'TL;DR',
    close: '닫기',
    more: '자세히 보기',
    controlsHint: '방향키 이동 · Shift 달리기 · Space 들어가기 · M 지도',
    touchHint: '패드로 이동 · A 들어가기',
    hintSkip: '넘기기',
    hintNext: '다음',
    hintTalk: '들어가기',
    warp: '$ git checkout HEAD · 현재로 돌아왔어요',
    pickedUp: '획득',
    map: '🗺 지도',
    titleMap: '🗺 결론만 빠르게 보기',
    mapTitle: '지도 · 결론만 빠르게',
    mapLead: '보고 싶은 곳을 고르면 바로 이동해서 보여드려요.',
    mapTravel: '이동 ▶',
    mapVisited: '읽음',
    mapTldr: '한 페이지로 보기 (TL;DR)',
    mapReplayGuide: '안내 다시 보기',
    questNext: '다음',
    questDone: '전부 둘러봤어요 · 고마워요!',
    coach: [
      {
        title: '여기는 HEAD, 지금의 저예요',
        body: '건물 문 앞에서 Space(또는 A)를 눌러 들어가 보세요. 깜빡이는 ▼ 화살표가 다음에 가볼 곳이에요.',
        target: 'player',
      },
      {
        title: '서쪽으로 가면 과거예요',
        body: '길은 git log처럼 이어져 있어요. 왼쪽 위에 지금 위치와 다음 목적지가 보여요.',
        target: 'quest',
      },
      {
        title: '결론만 보고 싶다면',
        body: '🗺 지도(M 키)에서 장소마다 결론 한 줄을 보고, 원하는 곳으로 바로 이동할 수 있어요.',
        target: 'map',
      },
    ],
    coachNext: '다음',
    coachSkip: '건너뛰기',
    coachDone: '시작하기',
    detailSituation: '상황',
    detailDecision: '판단',
    detailResult: '결과',
    detailMore: '더 보기',
    flowBefore: '전',
    flowAfter: '후',
  },
  regions: {
    head: {
      tag: 'HEAD',
      name: '지금',
      period: '2021 – 현재',
    },
    v19: {
      tag: 'v1.9',
      name: '쉼표',
      period: '2020 – 2021',
    },
    v15: {
      tag: 'v1.5',
      name: '돕는 사람',
      period: '2018 – 2020',
    },
    v01: {
      tag: 'v0.1',
      name: '만드는 사람',
      period: '2015 – 2018',
    },
    init: {
      tag: 'init',
      name: '시작',
      period: '2015',
    },
  },
  entries: {
    plaza: {
      title: '안내판 · broccoli.log',
      summary: [
        '안녕하세요, 브로콜리입니다. 2015년부터 프론트엔드를 만들어 왔습니다.',
        '도착점을 먼저 그리고, 그곳까지 가는 경로와 수단을 설계합니다. 가는 길에 드러난 문제는 구조로 고쳐 다시 생기지 않게 합니다.',
      ],
      more: [
        '여기는 HEAD, 지금의 저입니다.',
        '서쪽으로 걸어가면 과거의 저를 만날 수 있습니다. 길은 git log처럼 이어져 있습니다.',
        '걷기 번거롭다면 오른쪽 위 🗺 지도에서 바로 이동하거나, TL;DR에서 한 페이지 요약을 볼 수 있습니다.',
      ],
    },
    office: {
      title: '제품 개발 · 홈쇼핑모아',
      summary: [
        'TV 홈쇼핑 상품을 모아 보여주는 커머스 앱, 홈쇼핑모아를 2021년부터 개발했습니다.',
        '웹뷰 서비스에서 React Native(Expo) 앱으로 넘어가는 전환기를 거치며, 결제·주문부터 광고·영상·배포까지 앱의 핵심 영역을 맡았습니다.',
      ],
      more: [],
      tabs: officeTabs,
      stack: 'TypeScript · React Native · Expo · GitHub Actions · Maestro · Turborepo',
    },
    tower: {
      title: 'AI 활용 · AX 전환',
      summary: [
        'AI 에이전트가 구현하고 사람이 검토하는 개발 방식으로 팀을 옮기는 AX 전환을 주도하고 있습니다.',
        '핵심은 프롬프트가 아니라 구조입니다. 좋은 구조를 만들면 AI도 정확하게 일합니다.',
      ],
      more: [],
      tabs: towerTabs,
      stack: 'Claude Code (스킬 · 훅 · 서브에이전트) · pnpm workspace · Turborepo · 커스텀 ESLint 룰 · GitHub Actions',
    },
    meeting: {
      title: '일하는 태도',
      summary: [
        '도착점은 함께 맞추고, 수단은 상황에 맞게 고릅니다.',
      ],
      more: [],
      cards: [
        {
          title: '도착점부터',
          body: '사용자 시나리오와 완성된 모습을 먼저 합의하고, 구현은 거기서 거꾸로 짚어 갑니다.',
        },
        {
          title: '핵심부터 깊게',
          body: '덜 중요한 것은 덜어내고, 가장 중요한 흐름을 끝까지 만듭니다.',
        },
        {
          title: '반복되는 문제는 구조로',
          body: '같은 실수가 두 번 나오면 주의를 당부하는 대신 장치로 막습니다.',
        },
        {
          title: '기록으로 남깁니다',
          body: '결정과 근거를 문서로 남겨 다음 사람이 다시 묻지 않게 합니다.',
        },
      ],
    },
    forge: {
      title: '기술 스택',
      summary: [
        '주력: TypeScript · React Native · Expo · React',
      ],
      more: [],
      cards: [
        {
          title: '데이터·상태',
          body: 'TanStack Query · Zustand',
        },
        {
          title: '구조·품질',
          body: 'pnpm workspace · Turborepo · 커스텀 ESLint 룰 · Maestro',
        },
        {
          title: '배포',
          body: 'GitHub Actions · EAS(OTA) · release-please',
        },
        {
          title: 'AI',
          body: 'Claude Code (스킬 · 훅 · 서브에이전트 · 품질 게이트)',
        },
        {
          title: '사이드 프로젝트',
          body: 'Next.js · PostgreSQL',
        },
      ],
    },
    lab: {
      title: '사이드 프로젝트',
      summary: [
        '아이디어마다 스펙과 계획을 먼저 쓰고, 작게 만들어 검증합니다.',
      ],
      more: [
        'ko-apt-finder — 아파트 단지 검색 웹앱 (Next.js · PostgreSQL)',
        'arch-canvas — 대화로 DDD 설계를 돕는 도구 (기획 중)',
        'projkit — 모노레포 패키지 세팅·룰 동기화 CLI',
        'cli-typer — 터미널 타자 연습',
        '지금 걷고 있는 이 게임도 그중 하나입니다.',
      ],
    },
    trustKey: {
      title: 'trust.key',
      summary: [
        '🗝 trust.key — 제안은 근거로 열린다.',
      ],
      more: [],
    },
    techTeam: {
      title: '기술팀 · 2018 – 2020',
      summary: [
        '이지케어텍 기술팀에서 클라우드 기반 병원 정보 시스템의 웹 프론트엔드를 맡았습니다.',
      ],
      more: [
        '공통 모듈과 공통 화면을 만들고, 기술 문서와 신규 입사자 프론트엔드 가이드를 맡았습니다.',
        '다른 개발자가 잘 일하도록 돕는 일에 이때 처음 재미를 느꼈습니다.',
        '지금 AI 에이전트가 잘 일하도록 환경을 만드는 것도, 돌아보면 같은 관심입니다.',
      ],
    },
    hospital: {
      title: '대학병원 · 2015 – 2018',
      summary: [
        '이지케어텍에서 병원 정보 시스템 개발로 경력을 시작했습니다.',
      ],
      more: [
        '국내 대학병원 시스템 구축과 운영에서 간호·의무기록 화면을 만들었습니다.',
        '정확성이 중요한 도메인에서, 사용자인 의료진의 업무 흐름을 기준으로 화면을 설계했습니다.',
      ],
    },
    overseas: {
      title: '해외 의료기관 · 2015 – 2017',
      summary: [
        '해외 병원의 시스템 구축 프로젝트에도 참여했습니다.',
      ],
      more: [
        '화면 개발과 함께 사용자 교육과 현장 지원을 맡았습니다.',
        '만든 화면이 실제 업무에서 어떻게 쓰이는지 가까이서 본 시간이었습니다.',
      ],
    },
    init: {
      title: 'git init',
      summary: [
        '모든 것은 여기서 시작됐습니다.',
      ],
      more: [
        '정보통신공학을 전공하고, 2015년에 첫 커밋을 남겼습니다.',
        '옆의 돌판을 밟으면 HEAD로 돌아갑니다.',
      ],
    },
  },
  tldr: {
    heading: '브로콜리',
    tagline: '프론트엔드 엔지니어 (2015–). 도착점을 먼저 그리고, 그곳까지 가는 경로와 수단을 설계합니다. 가는 길에 드러난 문제는 구조로 고쳐 다시 생기지 않게 합니다.',
    sections: [
      {
        title: '지금 하는 일',
        items: [
          'AX 전환 리드 (2026.04–) — AI가 구현하고 사람이 검토하는 개발 방식으로 전환. TypeScript 100%·도메인 단위 코드베이스, 규칙을 훅·린트·CI로 강제하는 하네스, 통계 단일 선언과 비개발자용 검사 모드를 설계',
          '커머스 앱 개발 (2021.09–) — 웹뷰 → React Native(Expo) 전환, 주문·클레임·결제, 광고 검수 자동화, 영상 플레이어 전환, 배포 자동화',
        ],
      },
      {
        title: '대표 사례',
        items: [
          '광고 노출 증빙 자동화 — 새벽에도 사람이 직접 하던 캡처를 무인 운영으로 (2024–)',
          '화면 간 상태 모델 재설계 — 임시 패치를 걷고 "서버 값 + 사용자 변경분" 모델로 (2022–2023)',
          '앱 시작 ANR — 측정·재현 장치부터 만들고 초기화 순서를 재설계 (2025)',
          '통계 단일 선언과 검사 모드 — 4개 채널을 같은 모양으로, 기획자·마케터와 같은 이름으로 (2026)',
        ],
      },
      {
        title: '일하는 태도',
        items: [
          '도착점부터 — 완성된 모습을 먼저 합의하고 구현은 거꾸로 짚어 간다',
          '핵심부터 깊게 — 덜 중요한 것은 덜어내고 핵심 흐름을 끝까지',
          '반복되는 문제는 구조로 — 주의 대신 장치로 막는다',
          '기록으로 남긴다 — 결정과 근거는 문서로',
        ],
      },
      {
        title: '기술',
        items: [
          'TypeScript · React Native · Expo · React',
          'TanStack Query · Zustand',
          'pnpm workspace · Turborepo · 커스텀 ESLint 룰 · Maestro',
          'GitHub Actions · EAS(OTA) · release-please',
          'Claude Code (스킬 · 훅 · 서브에이전트 · 품질 게이트)',
        ],
      },
    ],
    timelineTitle: '경력',
    timeline: [
      {
        period: '2021.09 – 현재',
        title: '홈쇼핑모아 · 프론트엔드',
        detail: '웹뷰 서비스 → React Native(Expo) 전환 → 결제·주문·광고·영상·배포 → AX 전환 리드 (2026.04–)',
      },
      {
        period: '2020.05 – 2021.09',
        title: '재정비 기간',
        detail: '',
      },
      {
        period: '2018.06 – 2020.05',
        title: '이지케어텍 · 기술팀',
        detail: '클라우드 기반 병원 정보 시스템 웹 프론트엔드, 공통 모듈·화면, 기술 문서, 신규 입사자 가이드',
      },
      {
        period: '2015.09 – 2018.05',
        title: '이지케어텍 · 개발',
        detail: '국내외 병원 시스템 구축·운영, 간호·의무기록 화면',
      },
    ],
    linksTitle: '링크',
  },
}
