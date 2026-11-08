// Career-walk game content. Every fork below is mined and verified from the
// real codebases (webviews / hsmoa-app / ax-hsmoa) — the game must stay a
// deeper view of the résumé, never a conflicting one. The "right" option is
// broccoli's actual philosophy-aligned choice; "wrong" is the tempting
// anti-pattern, and picking it piles on debt that blocks the final merge gate.

export interface CwItem {
  icon: string
  name: string
}

export interface CwOption {
  kind: 'right' | 'wrong'
  text: string
  item: CwItem
  reveal: string
}

export interface CwEra {
  label: string
  co: string
  ctx: Array<[string, string]>
  code?: string // may contain <span class="dim|am"> highlight markup
  warn?: string
  options: CwOption[]
}

export const CW_ERAS: CwEra[] = [
  {
    label: '2015 · HIS',
    co: '이지케어텍',
    ctx: [
      ['요청서', '간호 기록 신규 화면, 스펙대로'],
      ['현장', '간호사 실제 동선이 요청서와 다름'],
    ],
    warn: '의료 도메인 — 틀리면 환자 안전 사고로 이어짐',
    options: [
      {
        kind: 'right',
        text: '현장 실사용·안정성 우선 — 까다로운 검수를 감수',
        item: { icon: '🛡️', name: '검수 게이트' },
        reveal:
          '빠른 것보다 맞는 걸 택함. 요청서의 구조보다 쓰는 사람 경험이 먼저라는 걸 몸으로 익힘.',
      },
      {
        kind: 'wrong',
        text: '요청 문서 스펙대로 일단 빨리 넘기기',
        item: { icon: '🧟', name: '안 맞는 화면' },
        reveal: '현장 흐름과 안 맞아 통째로 재작업. 검수에서 막히고 신뢰도만 깎임.',
      },
    ],
  },
  {
    label: '2018 · 체계',
    co: '이지케어텍',
    ctx: [
      ['제약', '안정성 1순위 → 요청 없는 개선은 매번 반려'],
      ['현실', '지식이 사람 머리에만, 문서를 써도 안 읽힘'],
    ],
    warn: '사람이 바뀌면 쌓은 게 리셋됨',
    options: [
      {
        kind: 'right',
        text: '체계·시스템을 먼저 — 온보딩/기술문서 사이트',
        item: { icon: '📐', name: '온보딩 체계' },
        reveal:
          '문서는 체계 없이는 의미를 못 가짐. 기술팀에서 직접 부딪혀 "문서만으론 안 된다"를 배움.',
      },
      {
        kind: 'wrong',
        text: '일단 문서부터 열심히 쓰기',
        item: { icon: '📄', name: '안 읽히는 위키' },
        reveal:
          '체계 없는 문서는 아무도 안 봄. 선순환을 만드는 건 문서가 아니라 그걸 굴리는 구조.',
      },
    ],
  },
  {
    label: '2021 · nocodb',
    co: '버즈니 · 홈쇼핑모아',
    code:
      "// my/faq/PhoneInfo.tsx\n" +
      "const CONTACT = [\n" +
      "  { name:'hnsmall', tel:'1666-1111' },\n" +
      "  { name:'cjmall',  tel:'1644-2525' },\n" +
      "  <span class='cw-dim'>… 채널 18개 하드코딩</span>\n" +
      ']',
    ctx: [['문제', '채널이 번호 바꿀 때마다 개발자가 고쳐 재배포']],
    warn: '틀린 CS 번호 = 고객이 엉뚱한 곳에 전화',
    options: [
      {
        kind: 'right',
        text: '콘텐츠를 nocodb로 빼서 비개발자가 직접 수정',
        item: { icon: '🧩', name: 'nocodb 노코드 DB' },
        reveal:
          '하드코딩 81줄을 지우고 cms://로 전환. 운영·CS가 날 안 거치게 — 내가 병목이 아니게 만듦.',
      },
      {
        kind: 'wrong',
        text: '계속 코드에 박아두고, 바뀌면 그때 고치기',
        item: { icon: '☎️', name: '낡은 전화번호' },
        reveal: '사소한 copy 하나에 개발·재배포가 묶임. 그 사이 틀린 번호는 고객 피해.',
      },
    ],
  },
  {
    label: '2021 · 계측',
    co: '버즈니 · 홈쇼핑모아',
    ctx: [
      ['규모', '고객이 만지는 화면 37개'],
      ['질문', 'UI를 감으로 정할까, 숫자로 정할까'],
      ['함정', '화면마다 제각각 로그 → 실험군이 안 붙음'],
    ],
    warn: '출처 불명 지표는 가설→A/B→지표 루프를 깸',
    options: [
      {
        kind: 'right',
        text: '선언적 계측 — 버튼에 data-tracking 하나로 실험군까지 자동 로깅',
        item: { icon: '📊', name: 'A/B 계측기' },
        reveal:
          '모든 이벤트에 실험군이 자동으로 붙게 토대를 깖. 감이 아니라 숫자로 UI를 정할 수 있게.',
      },
      {
        kind: 'wrong',
        text: '필요한 화면마다 그때그때 로그 심기',
        item: { icon: '🎲', name: '출처 불명 지표' },
        reveal:
          '어느 변형에서 온 클릭인지 못 가림. 스키마가 화면마다 제각각이라 비교 자체가 불가능.',
      },
    ],
  },
  {
    label: '2022 · RN 재건',
    co: '버즈니 · 홈쇼핑모아',
    code:
      "if (appVersion < '16.0.2') {\n" +
      "  <span class='cw-dim'>// 네이티브 화면이 아직 없음</span>\n" +
      "  <span class='cw-am'>???</span>\n" +
      '}',
    ctx: [
      ['전환', '웹뷰 하이브리드 → Expo RN 전면 전환 중'],
      ['문제', '구버전 앱엔 네이티브 화면이 아직 없음'],
    ],
    warn: '그냥 딥링크로 보내면 구버전 유저는 빈 화면/크래시',
    options: [
      {
        kind: 'right',
        text: '버전 분기 쉼 — 구버전은 웹뷰로 흘리고 신버전만 네이티브',
        item: { icon: '🪜', name: '버전 게이트' },
        reveal:
          '16.0.2 미만은 웹뷰 URL로, 이상은 네이티브로. 화면이 없으면 크래시 대신 OTA로 자가치유. 큰 전환일수록 한 번에 안 감.',
      },
      {
        kind: 'wrong',
        text: '네이티브로 한 번에 컷오버 + 강제 업데이트',
        item: { icon: '💥', name: '빈 화면 장애' },
        reveal:
          '구버전 유저가 강제 업데이트 벽을 만남. 전환 기간의 커머스 세션이 통째로 날아감.',
      },
    ],
  },
  {
    label: '2024 · 자동화',
    co: '버즈니 · 홈쇼핑모아',
    code:
      '03:00  cron ▸ 광고 캡처\n' +
      "       <span class='cw-dim'>↳ (사람이 깨어 있어야 함)</span>",
    ctx: [
      ['증빙', '광고 노출을 손으로 캡처해 보관'],
      ['현실', '새벽·심야 스케줄을 자주 깜빡'],
    ],
    warn: '한 번 누락되면 그날 증빙에 구멍',
    options: [
      {
        kind: 'right',
        text: '완전 무인 파이프라인 — 자가복구·재업로드·디스크 자동청소',
        item: { icon: '🤖', name: '무인 캡처봇' },
        reveal:
          '실패하면 10회 재시도(5·9차에만 호출), 올리다 실패하면 다음 차수 30회 재시도로 안 잃음, 디스크는 10GB/3일로 스스로 정리.',
      },
      {
        kind: 'wrong',
        text: '알림을 더 울려서 사람이 안 깜빡하게',
        item: { icon: '⏰', name: '알람 피로' },
        reveal: '알람이 많아질수록 더 놓침. 사람 손에 의존하는 한 새벽 누락은 안 사라짐.',
      },
    ],
  },
  {
    label: '2026 · AX (HEAD)',
    co: '버즈니 · 홈쇼핑모아',
    code:
      'AI: "그 패턴 안 쓸게요 ✔"\n' +
      "<span class='cw-dim'>→ 다음 세션,</span> <span class='cw-am'>571번째를 또 박음</span>",
    ctx: [
      ['상황', 'AI가 코드 대부분을 생성'],
      ['문제', '"하지 마"는 세션이 바뀌면 증발'],
    ],
    warn: '실제로 직접 머지가 게이트를 우회한 사고(#11346)가 그래서 반복됨',
    options: [
      {
        kind: 'right',
        text: '잘못된 변경이 애초에 못 합쳐지게 — 래칫·순환검사·게이트',
        item: { icon: '🚦', name: 'gate.sh' },
        reveal:
          '위반 수는 내려가기만(파일별 래칫), 순환 의존은 0건 fail-closed, 규칙 안 읽으면 편집 차단, 머지는 승인 토큰 없이 거부. 말하는 대신 구조가 막음.',
      },
      {
        kind: 'wrong',
        text: '리뷰에서 "이렇게 하지 마세요" 코멘트로 막기',
        item: { icon: '🗣️', name: '리뷰 잔소리' },
        reveal: '말로 한 규칙은 세션이 바뀌면 사라짐. 같은 실수가 다음에 또 머지됨.',
      },
    ],
  },
]

export const CW_END = {
  winTitle: '✓ MERGE ALLOWED',
  winBody:
    '레일을 통과한 변경만 합쳐진다. 10년 내내 해온 건 결국 하나 — 사람 손이 아니라 구조가 품질을 지키게 만드는 것.',
  blockTitle: '✗ CANNOT MERGE',
  blockBody: (debt: number): string =>
    `부채 ${debt}건이 막는다. 말로 "하지 마"는 다음에 또 터진다 — 잘못된 변경은 애초에 합쳐질 수 없어야 한다.`,
  blockBodyTail: '그게 내가 레일을 까는 이유.',
  replay: '↺ 다시 걷기',
}
