import { type DetailTab } from './types'

export const officeTabs: DetailTab[] = [
  {
    label: 'Architecture',
    items: [
      {
        title: 'Redesigning cross-screen state',
        period: '2022 – 2023',
        flow: {
          kind: 'compare',
          before: [
            'Each card kept its own server value',
            'Alarm state differed by screen',
          ],
          after: [
            'Server value + global overrides (on · off · changed)',
            'Same state on every screen',
          ],
        },
        situation: 'Turning an alarm on in a detail screen and going back left the list cards showing the old state, because each card held the server value it first received.',
        decision: 'I removed a syncing patch within four days and redesigned the model: only what the user changed lives in a global store, layered over the server value. Server data stays untouched, so user actions survive a refetch.',
        result: 'I solved the same problem with the same principle twice, in the WebView and in the app.',
      },
      {
        title: 'One shared video player',
        period: '2025',
        flow: {
          kind: 'compare',
          before: [
            'Short-form · live · PIP each built separately',
          ],
          after: [
            'One shared player',
            'Split into create · state · playback · event hooks',
          ],
        },
        situation: 'Short-form, live, highlights, and PIP each had their own video component, and the playback library needed replacing.',
        decision: 'I merged them into one component split by responsibility and moved it to expo-video. To save memory, only the playing and nearby videos load; retries (1·2·4 s, up to 3) live in one place. Crashes from touching released players on exit were fixed by deferring cleanup and making it cancellable.',
        result: 'After validating with an A/B test, I removed the old implementation entirely.',
      },
      {
        title: 'Replacing core components step by step',
        period: '2022',
        flow: {
          kind: 'steps',
          steps: [
            {
              label: 'Build v2 side by side',
            },
            {
              label: 'Move screen by screen',
            },
            {
              label: 'Verify',
            },
            {
              label: 'Delete old · restore names',
            },
          ],
        },
        situation: 'The base components used across the app (Text · Image · Card · Badge) had to be rebuilt — 116 files, about 20k lines.',
        decision: 'Instead of a big-bang swap, I built the new versions alongside, moved screens one at a time, then deleted the old ones and restored the names. The app stayed intact at every step.',
        result: 'Defaults such as image fallbacks were standardized along the way.',
      },
    ],
    more: [
      {
        title: 'Card discount price model',
        period: '2024',
        flow: {
          kind: 'compare',
          before: [
            'One best-card discount shared app-wide',
          ],
          after: [
            'Per product: eligible cards × my cards',
          ],
        },
        situation: 'After registering a card, list and detail screens showed different prices.',
        decision: 'Rather than patching numbers, I fixed the design that shared one global value and regrouped price components by domain.',
      },
      {
        title: 'Nested scroll to a single list',
        period: '2024 – 2025',
        situation: 'An infinite list nested inside a scroll view kept firing "end reached", calling the API endlessly.',
        decision: 'Instead of throttling calls, I moved the header and filters into the list header so only one list remains.',
      },
      {
        title: 'Types first, restructure later',
        period: '2025',
        situation: 'Every API lived in one untyped file.',
        decision: 'I did not restructure and type at once; I typed the current structure first, changing one thing at a time to split the risk.',
      },
    ],
  },
  {
    label: 'Troubleshooting',
    items: [
      {
        title: 'ANR on app start',
        period: '2025',
        flow: {
          kind: 'steps',
          steps: [
            {
              label: 'Measure',
              note: 'repeated start-time runs',
            },
            {
              label: 'Reproduce',
              note: 'ANR-inducing plugin',
            },
            {
              label: 'Cause',
              note: '8 init tasks awaited in sequence',
            },
            {
              label: 'Fix',
              note: 'essentials first, rest in parallel',
            },
          ],
        },
        situation: 'Android showed "App not responding" on launch.',
        decision: 'Before fixing anything I built a script that measures start time repeatedly and a plugin that triggers the ANR on purpose. The cause was awaiting init tasks and splash APIs one by one and registering the deep-link listener before the first frame. Only token setup stays first; the rest run in parallel, and the listener waits for the first render.',
        result: 'The same fix was ported to the previous release line.',
      },
      {
        title: 'Unknown crash: observe first',
        period: '2025',
        flow: {
          kind: 'steps',
          steps: [
            {
              label: 'Stopgap guard',
            },
            {
              label: 'Collection',
              note: 'stack · env · device',
            },
            {
              label: 'Pinpoint cause',
            },
          ],
        },
        situation: 'Crash logs piled up with no clue where they came from.',
        decision: 'After a stopgap guard, I built a collection path that sends stack, environment, and device info, with tests, instead of fixing by guesswork.',
      },
    ],
    more: [
      {
        title: 'Icon package OTA failure',
        period: '2025 – 2026',
        situation: 'Images moved into a shared package did not show after Android OTA updates.',
        decision: 'I rolled back immediately, then dropped increasingly complex fixes for the simplest structure: copy images into the project at install time (−486 lines).',
      },
      {
        title: 'Janky scroll animation',
        period: '2022',
        situation: 'A header image tied to scrolling stuttered.',
        decision: 'I traced it to JS re-renders and moved the animation out of React into CSS variables.',
      },
      {
        title: 'Server cache vs freshness',
        period: '2022',
        situation: 'A 30-minute server cache showed stale alarm and promotion screens.',
        decision: 'When a feature changes nature, its cache policy is revisited; I excluded those screens and documented why.',
      },
      {
        title: 'First-install OTA and stats order',
        period: '2025',
        situation: 'An OTA restart before the install event was sent could drop the stat.',
        decision: 'OTA now runs only after the event is sent, and a server flag turns it on or off.',
      },
    ],
  },
  {
    label: 'Productivity',
    items: [
      {
        title: 'Ad proof screenshot automation',
        period: '2024 –',
        flow: {
          kind: 'compare',
          before: [
            'Someone on standby for every ad slot',
            'Opening the app by hand, even at dawn',
          ],
          after: [
            'Schedule → cron → simulator + Maestro',
            'Capture → Slack report · cleanup and retry on failure',
          ],
        },
        situation: 'To prove ads actually ran, someone opened the app and captured the screen at every scheduled ad slot — including slots at dawn.',
        decision: 'I moved that routine to a simulator, Maestro, and cron, running only when ads are scheduled. Unattended-run problems were fixed structurally: completion is keyed by start time instead of ad ID to stop duplicate shots, and the simulator shuts down only after completion is recorded to prevent re-runs. A screenshot mode keeps PIP, rotating banners, and debug tools off screen, and failures page a person only on the 4th and 9th attempt.',
        result: 'Nobody waits for the clock anymore; it has run unattended since 2024.',
      },
      {
        title: 'OTA release pipeline',
        period: '2025',
        flow: {
          kind: 'compare',
          before: [
            'Version edited by hand',
            'Conflicts on every merge',
            'Manual tags and changelogs',
          ],
          after: [
            'push → deploy time injected as version',
            'Tags → change summary to Slack',
          ],
        },
        situation: 'Hand-written OTA versions caused merge conflicts every time.',
        decision: 'I removed the human-managed value and inject the deploy time as the version, then added tags and change summaries. Caching speeds up builds but is deliberately off for production — correctness over speed.',
      },
    ],
    more: [
      {
        title: 'Forced OTA for old builds only',
        period: '2024',
        situation: 'Old app builds could not handle new deep links.',
        decision: 'Instead of forcing everyone, only builds updated before a cutoff get a forced OTA.',
      },
    ],
  },
]

export const towerTabs: DetailTab[] = [
  {
    label: 'Why',
    items: [
      {
        title: 'What we are changing',
        flow: {
          kind: 'compare',
          before: [
            'AI drafts, people rewrite',
            'Rules live only in docs',
            'People relay messages between agents',
          ],
          after: [
            'AI implements; people set direction, review, approve',
            'Structure and mechanisms guarantee quality',
          ],
        },
        body: 'TypeScript coverage was 37% at the start, and AI could not find the edges of a task in loosely bounded code. For quality to hold without people reading every line, the structure — not the prompt — has to tell the right answer.',
      },
      {
        title: 'Where control lives',
        flow: {
          kind: 'stack',
          steps: [
            {
              label: 'Person · owner',
              note: 'direction · decisions · approval',
            },
            {
              label: 'Manager AI',
              note: 'analysis · splitting work · review',
            },
            {
              label: 'Worker AI × N',
              note: 'build in own workspace → PR',
            },
          ],
        },
        body: 'Control sits with neither people nor AI. Plan state, merge state, and CI gates are the source of truth — so the question is "how far has each task gone", not "who asked for it".',
      },
    ],
  },
  {
    label: 'Structure',
    items: [
      {
        title: 'One-way layers',
        flow: {
          kind: 'stack',
          steps: [
            {
              label: 'shell',
              note: 'composition',
            },
            {
              label: 'composite',
              note: 'combines domains',
            },
            {
              label: 'domains',
              note: 'business domains',
            },
            {
              label: 'core',
              note: 'global infrastructure',
            },
            {
              label: 'shared',
              note: 'pure utilities',
            },
            {
              label: 'libs',
              note: 'external SDK wrappers',
            },
          ],
        },
        body: 'Imports flow only downward. Folders are boundaries, enforced by lint and packages. Large domains live in their own packages so a boundary violation becomes a build failure, not a review comment.',
      },
      {
        title: 'One answer in one place',
        flow: {
          kind: 'steps',
          steps: [
            {
              label: 'Before writing',
              note: 'hand over helpers',
            },
            {
              label: 'While writing',
              note: 'look up canonical helpers',
            },
            {
              label: 'Right after',
              note: 'shape check on the diff',
            },
            {
              label: 'CI',
              note: 'block same-name redefinition',
            },
            {
              label: 'Later',
              note: 'sweep old debt',
            },
          ],
        },
        situation: 'AI workers have no memory, so they rewrite logic that already exists. Both copies look fine in place, so the drift shows up nowhere.',
        decision: 'Not one layer but five; what each layer misses is why the next exists. Cases reviewed and kept are silenced with a comment so the same warning does not return and cause fatigue.',
        result: 'The goal is convergence, not perfect blocking — and the known leaks are written down.',
      },
      {
        title: 'Server responses become app models',
        flow: {
          kind: 'steps',
          steps: [
            {
              label: 'Request',
            },
            {
              label: 'API',
            },
            {
              label: 'Adapter',
            },
            {
              label: 'App model',
            },
            {
              label: 'Screen',
            },
          ],
        },
        body: "An adapter turns responses into the app's canonical model so server field names and null habits never leak into screens. Screens see only app models.",
      },
    ],
  },
  {
    label: 'Harness',
    items: [
      {
        title: 'Skills execute the rules',
        flow: {
          kind: 'steps',
          steps: [
            {
              label: 'Plan',
              note: 'PRD → PLAN → split work',
            },
            {
              label: 'Build',
              note: 'scaffold skills',
            },
            {
              label: 'Self-check',
              note: 'diff review',
            },
            {
              label: 'PR',
            },
            {
              label: 'Human review · approved merge',
            },
          ],
        },
        body: 'Nobody memorizes rules. Skills that create screens, sections, and cards decide folder, naming, and boundaries, so the right structure comes out without knowing every rule. Operations — planning, splitting, review, merge, cleanup — run through skills too: 34 skills and 16 custom lint rules.',
      },
      {
        title: 'What fires when',
        flow: {
          kind: 'compare',
          before: [
            'Too many assets to remember what fires when',
          ],
          after: [
            'Six trigger types',
            'Only two enforced by machines',
          ],
        },
        body: 'As assets grow, "what fires when" blurs. I grouped triggers into six types and mapped which ones people may miss and which ones machines always block.',
      },
    ],
  },
  {
    label: 'Stats · Comms',
    items: [
      {
        title: 'Everyone uses the same name',
        flow: {
          kind: 'steps',
          steps: [
            {
              label: 'Turn on inspect mode',
            },
            {
              label: 'Korean name on each area',
            },
            {
              label: 'Tap for key · file · stats',
            },
            {
              label: 'Talk with the same name',
            },
          ],
        },
        situation: 'People called the same area by different names ("home header" vs "app header"), so conversations with teammates, planners, and AI drifted, and finding the file behind an area meant digging through code.',
        decision: 'Each screen and section carries just three pieces of metadata — key, Korean name, source file — shown when tapped in admin mode. AI skills generate names; names a person corrects are never overwritten. No new naming system: existing screen and section labels are the source, so no area has two names.',
        result: 'Zero cost for real users: markers pass through, and measuring happens only while inspect mode is on.',
      },
      {
        title: 'Declare stats once, show four channels alike',
        flow: {
          kind: 'stack',
          steps: [
            {
              label: 'Domain stat declaration',
              note: 'taxonomy in one file',
            },
            {
              label: 'Three fire paths',
              note: 'press · view · show',
            },
            {
              label: 'Same gate · same dedup',
            },
            {
              label: 'Four channels',
              note: 'internal logs · attribution · analytics · ads',
            },
          ],
        },
        situation: 'Stats go to four channels, but firing code was scattered, and the inspector showed only one channel properly — so we could not point at the same thing as marketers.',
        decision: 'Domains declare only their stat taxonomy in one file; data hooks know nothing about stats. External channels go through the same paths and gate, so firing rules and dedup exist once. Area names and stat taxonomy are deliberately not coupled — the inspector shows them side by side.',
        result: 'Tap an area and all four channels appear in the same layout, down to the actual payload each sends. Eight stray fire calls were declared and listed too.',
      },
    ],
  },
  {
    label: 'Decisions',
    items: [
      {
        title: 'A gate whose first design I threw away',
        flow: {
          kind: 'compare',
          before: [
            'Leave a "rules read" marker',
            'Fails in 4 cases, e.g. subagents',
          ],
          after: [
            'Check "is the read still in the transcript"',
            'All 4 problems closed at once',
          ],
        },
        situation: 'Rule files reach an agent only when it opens files a certain way, so agents that opened files another way edited code without the rules.',
        decision: 'I tested the first design against 68 real session logs, found four reasons it failed, and changed the criterion itself. Since a false block costs more than a miss, ambiguous cases pass but are logged.',
        result: 'It passed a six-step live check, and agents that read the block message switched to the right method on their own.',
      },
      {
        title: 'A check that had never fired',
        situation: 'A lint rule against cross-domain cycles was on but, missing a parser setting, never read TypeScript files — it had never fired.',
        decision: 'I fixed the setting and redefined the rule: "no cross-domain imports" was unkeepable, so it became "public API only, no cycles, one direction".',
        result: 'A hidden cycle was caught the moment it was fixed.',
      },
      {
        title: 'Where to put the new codebase',
        flow: {
          kind: 'compare',
          before: [
            'Refactor in place',
            'Separate repository',
          ],
          after: [
            'Isolated inside the existing repo',
            'Large domains as packages',
          ],
        },
        situation: 'Loose boundaries in the old app kept AI from scoping work.',
        decision: "Isolation meant no conflicts with teammates' work, contained mistakes, and a small start without team-wide sign-off. I accepted the loss of git history and the cost of syncing two codebases.",
      },
    ],
    more: [
      {
        title: 'Merge gate, limits included',
        situation: 'Right after we trimmed the rules, a session that did not know the process merged without approval.',
        decision: 'Instead of rewriting rules, merges without approval no longer run. When the first version blocked valid approvals too, approval moved into the command as the PR number — and the docs state it is a process guard, not a security control.',
      },
      {
        title: 'People as the message bus',
        situation: 'With many agents, a person ended up relaying messages between them — 5 to 7 round trips per task.',
        decision: 'Work starts with subagents that need no relay; if the same issue fails twice, it moves to a session that talks to the person directly. Two failures signal something text cannot carry, and switching costs about one round trip.',
      },
    ],
  },
  {
    label: 'Direction',
    items: [
      {
        title: 'Mechanisms decide compliance',
        flow: {
          kind: 'compare',
          before: [
            'Rules without detection',
            '69% followed',
          ],
          after: [
            'Rules with detection',
            '94% followed',
          ],
        },
        body: 'Rules in the same document split by whether a detector exists. So the direction is to attach mechanisms to existing rules rather than add more rules.',
      },
      {
        title: 'Keep the harness from becoming the goal',
        body: 'I track harness changes against app changes. If days of building mechanisms repeat without the app getting better, that signals the mechanisms have become the goal.',
      },
      {
        title: 'What we will not do',
        body: 'We do not gate skill calls — they leave no trace, so we check whether the contract held, not whether a skill ran. No lint that only checks a test file exists — it invites empty tests. No copying the same instruction into many skills.',
      },
    ],
  },
]
