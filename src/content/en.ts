import { officeTabs, towerTabs } from './detail.en'
import { type Content } from './types'

export const en: Content = {
  ui: {
    pressStart: '▶ PRESS START',
    subtitle: 'Meet broccoli, a frontend engineer',
    chooseLang: 'Language',
    tldr: 'TL;DR',
    close: 'Close',
    more: 'See details',
    controlsHint: 'Arrows move · Shift run · Space enter · M map',
    touchHint: 'Pad to move · A to enter',
    hintSkip: 'Skip',
    hintNext: 'Next',
    hintTalk: 'Enter',
    warp: '$ git checkout HEAD · back to now',
    pickedUp: 'Picked up',
    map: '🗺 Map',
    titleMap: '🗺 Skip to the conclusions',
    mapTitle: 'Map · Just the conclusions',
    mapLead: 'Pick a place to jump straight there.',
    mapTravel: 'Go ▶',
    mapVisited: 'Seen',
    mapTldr: 'Read it all on one page (TL;DR)',
    mapReplayGuide: 'Show the guide again',
    questNext: 'Next',
    questDone: "You've seen everything · thanks!",
    coach: [
      {
        title: 'This is HEAD — me, today',
        body: 'Stand at a door and press Space (or A) to go in. The blinking ▼ arrow marks where to go next.',
        target: 'player',
      },
      {
        title: 'West is the past',
        body: 'The road runs like a git log. The top-left shows where you are and your next stop.',
        target: 'quest',
      },
      {
        title: 'Just want the conclusions?',
        body: 'Open 🗺 Map (M key) to read one line per place and jump anywhere instantly.',
        target: 'map',
      },
    ],
    coachNext: 'Next',
    coachSkip: 'Skip',
    coachDone: "Let's go",
    detailSituation: 'Situation',
    detailDecision: 'Decision',
    detailResult: 'Result',
    detailMore: 'More',
    flowBefore: 'Before',
    flowAfter: 'After',
  },
  regions: {
    head: {
      tag: 'HEAD',
      name: 'Now',
      period: '2021 – now',
    },
    v19: {
      tag: 'v1.9',
      name: 'A Pause',
      period: '2020 – 2021',
    },
    v15: {
      tag: 'v1.5',
      name: 'The Helper',
      period: '2018 – 2020',
    },
    v01: {
      tag: 'v0.1',
      name: 'The Builder',
      period: '2015 – 2018',
    },
    init: {
      tag: 'init',
      name: 'The Beginning',
      period: '2015',
    },
  },
  entries: {
    plaza: {
      title: 'Signpost · broccoli.log',
      summary: [
        "Hi, I'm broccoli. I've been building frontends since 2015.",
        'I picture the destination first, then design the route and the means to get there. Problems found along the way get fixed in the structure so they do not come back.',
      ],
      more: [
        'This is HEAD — who I am today.',
        'Walk west to meet earlier versions of me. The road runs like a git log.',
        'Short on time? Use 🗺 Map at the top right to jump anywhere, or TL;DR for a one-page summary.',
      ],
    },
    office: {
      title: 'Product · Hsmoa',
      summary: [
        'Since 2021 I have built Hsmoa, a commerce app that gathers TV home-shopping products in one place.',
        'Through its move from a WebView service to a React Native (Expo) app, I owned core areas from payments and orders to ads, video, and releases.',
      ],
      more: [],
      tabs: officeTabs,
      stack: 'TypeScript · React Native · Expo · GitHub Actions · Maestro · Turborepo',
    },
    tower: {
      title: 'AI Practice · AX',
      summary: [
        'I lead our AX transition: moving the team to a workflow where AI agents implement and people review.',
        'The key is structure, not prompts. Build a good structure and AI works accurately inside it.',
      ],
      more: [],
      tabs: towerTabs,
      stack: 'Claude Code (skills · hooks · subagents) · pnpm workspace · Turborepo · custom ESLint rules · GitHub Actions',
    },
    meeting: {
      title: 'How I Work',
      summary: [
        'We agree on the destination together; the means fit the situation.',
      ],
      more: [],
      cards: [
        {
          title: 'Destination first',
          body: 'I agree on user scenarios and the finished picture first, then work backwards to the implementation.',
        },
        {
          title: 'Core first, in depth',
          body: 'I cut what matters less and build the most important flow all the way through.',
        },
        {
          title: 'Fix repeats with structure',
          body: 'When the same mistake happens twice, I add a mechanism instead of a reminder.',
        },
        {
          title: 'Write it down',
          body: 'Decisions and their reasons go into documents so the next person does not have to ask again.',
        },
      ],
    },
    forge: {
      title: 'Tech Stack',
      summary: [
        'Core: TypeScript · React Native · Expo · React',
      ],
      more: [],
      cards: [
        {
          title: 'Data & state',
          body: 'TanStack Query · Zustand',
        },
        {
          title: 'Structure & quality',
          body: 'pnpm workspace · Turborepo · custom ESLint rules · Maestro',
        },
        {
          title: 'Release',
          body: 'GitHub Actions · EAS (OTA) · release-please',
        },
        {
          title: 'AI',
          body: 'Claude Code (skills · hooks · subagents · quality gates)',
        },
        {
          title: 'Side projects',
          body: 'Next.js · PostgreSQL',
        },
      ],
    },
    lab: {
      title: 'Side Projects',
      summary: [
        'For each idea I write the spec and plan first, then build it small to test it.',
      ],
      more: [
        'ko-apt-finder — apartment complex search web app (Next.js · PostgreSQL)',
        'arch-canvas — a chat-driven DDD design tool (in planning)',
        'projkit — CLI for scaffolding monorepo packages and syncing rules',
        'cli-typer — typing practice in the terminal',
        "And this game you're walking through is one of them.",
      ],
    },
    trustKey: {
      title: 'trust.key',
      summary: [
        '🗝 trust.key — proposals open with evidence.',
      ],
      more: [],
    },
    techTeam: {
      title: 'Tech Team · 2018 – 2020',
      summary: [
        "On ezCaretech's tech team I owned the web frontend of a cloud-based hospital information system.",
      ],
      more: [
        'I built shared modules and screens, maintained technical docs, and ran the frontend onboarding guide.',
        'This is where I first enjoyed helping other developers do their best work.',
        'Building an environment where AI agents work well today comes from the same interest.',
      ],
    },
    hospital: {
      title: 'Hospital · 2015 – 2018',
      summary: [
        'I started my career at ezCaretech, building hospital information systems.',
      ],
      more: [
        'I built nursing and medical-record screens for university hospital systems, from rollout to operations.',
        'In a domain where accuracy matters, I designed screens around the actual workflow of clinicians.',
      ],
    },
    overseas: {
      title: 'Overseas · 2015 – 2017',
      summary: [
        'I also worked on system rollouts for hospitals abroad.',
      ],
      more: [
        'Alongside building screens, I trained users and supported them on site.',
        'It showed me up close how the screens I made were used in real work.',
      ],
    },
    init: {
      title: 'git init',
      summary: [
        'This is where it all began.',
      ],
      more: [
        'I majored in information and communication engineering and made my first commit in 2015.',
        'Step on the stone pad next to me to warp back to HEAD.',
      ],
    },
  },
  tldr: {
    heading: 'broccoli',
    tagline: 'Frontend engineer since 2015. I picture the destination first, then design the route and the means to get there. Problems found along the way get fixed in the structure so they do not come back.',
    sections: [
      {
        title: 'What I do now',
        items: [
          'AX lead (2026.04–) — moving the team to AI-implements, people-review. Designed a TypeScript-only, domain-driven codebase, a harness that enforces rules through hooks, lint, and CI, and single-source stats with an inspect mode for non-developers',
          'Commerce app (2021.09–) — WebView → React Native (Expo) migration, orders, claims and payments, ad QA automation, video player migration, release automation',
        ],
      },
      {
        title: 'Highlights',
        items: [
          'Ad proof screenshot automation — manual captures, even at dawn, now run unattended (2024–)',
          'Cross-screen state model — replaced a syncing patch with "server value + user overrides" (2022–2023)',
          'ANR on app start — built measurement and repro first, then redesigned init order (2025)',
          'Single-source stats and inspect mode — four channels in one layout, one vocabulary with planners and marketers (2026)',
        ],
      },
      {
        title: 'How I work',
        items: [
          'Destination first — agree on the finished picture, then work backwards',
          'Core first, in depth — cut what matters less, finish the core flow',
          'Fix repeats with structure — mechanisms over reminders',
          'Write it down — decisions and reasons go into documents',
        ],
      },
      {
        title: 'Stack',
        items: [
          'TypeScript · React Native · Expo · React',
          'TanStack Query · Zustand',
          'pnpm workspace · Turborepo · custom ESLint rules · Maestro',
          'GitHub Actions · EAS (OTA) · release-please',
          'Claude Code (skills · hooks · subagents · quality gates)',
        ],
      },
    ],
    timelineTitle: 'Experience',
    timeline: [
      {
        period: '2021.09 – now',
        title: 'Hsmoa · Frontend',
        detail: 'WebView service → React Native (Expo) migration → payments, orders, ads, video, releases → AX lead (2026.04–)',
      },
      {
        period: '2020.05 – 2021.09',
        title: 'Career break',
        detail: '',
      },
      {
        period: '2018.06 – 2020.05',
        title: 'ezCaretech · Tech team',
        detail: 'Web frontend for a cloud-based hospital information system, shared modules and screens, technical docs, onboarding guide',
      },
      {
        period: '2015.09 – 2018.05',
        title: 'ezCaretech · Developer',
        detail: 'Hospital system rollouts and operations in Korea and abroad; nursing and medical-record screens',
      },
    ],
    linksTitle: 'Links',
  },
}
