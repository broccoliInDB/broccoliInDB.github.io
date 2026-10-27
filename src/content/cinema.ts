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
  heroTitle: '안 되던 걸\n{em}되게 만듭니다.{/em}',
  heroSub: '눈에 잘 안 보이는 일을 합니다 — 막힌 걸 뚫고, 한 번 터진 문제는 다시 안 생기게.',
  heroWho: '최용범 · broccoli · 프론트엔드 엔지니어 · 2015~',
  scrollCue: '스크롤해서 걸어보세요',
  scenes: [
    {
      year: '2015 · 시작',
      state: 'chaos',
      stateLabel: '정확하지 않으면 사람이 다치는 곳',
      heading: '병원 화면에서 시작했습니다.',
      body: [
        '국내 대학병원과 미국 병원의 차세대 시스템에서 {b}간호·의무기록 화면{/b}을 만들었어요. 한 글자만 틀려도 환자에게 영향이 가는 도메인.',
        '그래서 디자인보다 {b}"실제로 쓰는 사람(의료진)의 일하는 순서"{/b}를 먼저 봤습니다. 현장에서 교육까지 하며, 만든 게 어떻게 쓰이는지 가까이서 봤어요.',
      ],
    },
    {
      year: '2018 · 돕는 쪽으로',
      state: 'chaos',
      stateLabel: '각자 빨리, 그러나 팀은 자꾸 막힘',
      heading: '혼자 빠른 것보다,\n{em}팀이 안 막히게.{/em}',
      body: [
        '공통으로 쓰는 부품과 화면을 만들고, 문서와 {b}신규 입사자 교육{/b}을 맡았습니다. 다른 사람이 같은 데서 헤매지 않도록.',
        '"다른 개발자가 잘 일하게 돕는 것"에 처음 재미를 느꼈어요. {b}지금 AI가 잘 일하게 만드는 것도, 돌아보면 같은 일{/b}입니다.',
      ],
    },
    {
      year: '2022 · 뿌리부터 교체',
      state: 'order',
      stateLabel: '여기서부터 "정돈"으로',
      heading: '앱의 바닥을\n통째로 갈아끼웠습니다.',
      body: [
        '홈쇼핑모아를 {b}웹뷰에서 React Native로 전면 전환{/b}. 카메라·공유·결제·주문·클레임까지, 전환 첫 커밋부터 끝까지 맡았어요.',
        '사용자 눈엔 안 보이지만, {b}안 되면 앱이 안 굴러가는{/b} 바로 그 영역입니다.',
      ],
      result: '화면 · 공용 부품 410개를 운영',
      resultNum: '227',
    },
    {
      year: '2024 · 자동화',
      state: 'order',
      stateLabel: '사람이 놓치던 걸 기계가',
      heading: '새벽에 사람이 하던 일을,\n{em}아무도 안 건드리게.{/em}',
      body: [
        '광고가 제대로 노출됐는지 증빙하려면 {b}매번 사람이 손으로 캡처{/b}해야 했어요. 새벽·심야 스케줄은 깜빡하기 일쑤였고.',
        '이걸 {b}완전 무인 파이프라인{/b}으로 만들었습니다. 실패하면 스스로 복구하고, 디스크도 알아서 정리하고.',
      ],
      result: '무인 · 회당 30분 수작업 제거 · 누락 0',
      resultNum: '100%',
    },
    {
      year: '2026 · 지금(HEAD)',
      state: 'order',
      stateLabel: '품질을 사람이 아니라 구조가',
      heading: "AI에게 '하지 마' 대신,\n{em}못 하게 만듭니다.{/em}",
      body: [
        '이제 AI가 코드의 대부분을 씁니다. 저는 코드 양이 아니라 {b}"무엇이 통과되는가"를 정하는 레일{/b}을 만들어요.',
        '리뷰에서 "이렇게 하지 마세요"라고 {b}말하는{/b} 대신, 애초에 잘못된 변경은 {b}합쳐질 수 없게{/b} 장치로 막습니다. 아래 버튼을 눌러보세요.',
      ],
      gate: true,
      result: '강제 규칙으로 품질 위반 감소 (1,710→617)',
      resultNum: '−64%',
    },
  ],
  closeStateLabel: 'order / 시스템이 처리',
  closeHeading: '그래서, {em}안 되던 걸 되게.{/em}',
  closeBody: '9년 넘게 한 일은 결국 하나예요 — 눈에 안 보이는 데서, 일이 굴러가게 만드는 것.',
  ctaWalk: '▶ 커밋 로그를 직접 걸어보기',
  ctaResume: '이력서 자세히 보기',
  ctaContact: '이메일',
  gateButton: '▶ ./gate.sh 실행',
  gateButtonAgain: '▶ 다시 실행',
  gateIntro: '# 변경을 합치려면 이 레일을 통과해야 합니다',
  gateSteps: [
    '$ ./gate.sh',
    '▸ 비밀정보 검사 {ok}   {k}raw merge 차단{/k} {ok}',
    '▸ 자동 lint·test {ok}',
    '▸ 의존성 경계 {ok} {m}(통과 못하면 애초에 막힘){/m}',
    '{ok-line}✓ 통과 — 이 변경은 합쳐도 됩니다.{/ok-line}',
  ],
  stateChaos: 'chaos / 사람 의존',
  stateTransition: 'transition…',
  stateOrder: 'order / 시스템이 처리',
}

const en: CinemaData = {
  heroTitle: 'I make the stuck\n{em}actually work.{/em}',
  heroSub: 'I work where you cannot see — unblocking what is jammed, and making sure a problem that broke once never comes back.',
  heroWho: 'Yongbeom Choi · broccoli · Frontend Engineer · since 2015',
  scrollCue: 'scroll to take a walk',
  scenes: [
    {
      year: '2015 · the start',
      state: 'chaos',
      stateLabel: 'where a mistake can hurt someone',
      heading: 'It started with hospital screens.',
      body: [
        'At next-gen hospital systems at home and in the US, I built {b}nursing and medical-record screens{/b} — a domain where one wrong character reaches a patient.',
        'So before visuals, I studied {b}how the people who actually use it (clinicians) work{/b}. I even trained them on-site and watched how what I built got used.',
      ],
    },
    {
      year: '2018 · toward helping',
      state: 'chaos',
      stateLabel: 'everyone fast, yet the team keeps jamming',
      heading: 'Not me being fast —\n{em}the team not getting stuck.{/em}',
      body: [
        'I built the shared parts and screens, and owned the docs and {b}onboarding for new hires{/b}, so others would not get lost in the same places.',
        'That is where I first enjoyed helping other developers do their best work. {b}Making AI work well now is, looking back, the same job.{/b}',
      ],
    },
    {
      year: '2022 · rebuilt the floor',
      state: 'order',
      stateLabel: 'order begins here',
      heading: 'I swapped the entire\nfoundation of the app.',
      body: [
        'I led the {b}full migration of hsmoa from WebView to React Native{/b} — camera, sharing, payments, orders, claims — from the reboot’s very first commit.',
        'Invisible to users, but exactly the layer that, {b}if it breaks, the app stops running{/b}.',
      ],
      result: 'screens · 410 shared components in production',
      resultNum: '227',
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
      result: 'quality violations down, enforced (1,710→617)',
      resultNum: '−64%',
    },
  ],
  closeStateLabel: 'order / handled by the system',
  closeHeading: 'So — {em}making the stuck work.{/em}',
  closeBody: 'For 9+ years it has been one thing, really — making things run, from where you cannot see.',
  ctaWalk: '▶ walk the commit log yourself',
  ctaResume: 'see the full resume',
  ctaContact: 'Email',
  gateButton: '▶ run ./gate.sh',
  gateButtonAgain: '▶ run again',
  gateIntro: '# to merge a change, it must pass this rail',
  gateSteps: [
    '$ ./gate.sh',
    '▸ secret scan {ok}   {k}block raw merge{/k} {ok}',
    '▸ auto lint·test {ok}',
    '▸ dependency boundary {ok} {m}(cannot pass → cannot merge){/m}',
    '{ok-line}✓ passed — this change is safe to merge.{/ok-line}',
  ],
  stateChaos: 'chaos / relies on people',
  stateTransition: 'transition…',
  stateOrder: 'order / handled by the system',
}

export const CINEMA: Record<Lang, CinemaData> = { ko, en }

export function getCinema(): CinemaData {
  return CINEMA[getLang()]
}
