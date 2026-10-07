export type Lang = 'ko' | 'en'

export type RegionId = 'init' | 'v01' | 'v15' | 'v19' | 'head'

export type EntryId =
  | 'plaza'
  | 'office'
  | 'tower'
  | 'meeting'
  | 'forge'
  | 'lab'
  | 'trustKey'
  | 'techTeam'
  | 'hospital'
  | 'overseas'
  | 'init'

export interface DetailCard {
  title: string
  body: string
}

export interface FlowStep {
  label: string
  note?: string
}

// Small diagrams drawn as boxes and arrows: before → after, a left-to-right
// sequence, or a top-to-bottom stack of layers.
export type Flow =
  | { kind: 'compare'; before: string[]; after: string[] }
  | { kind: 'steps'; steps: FlowStep[] }
  | { kind: 'stack'; steps: FlowStep[] }

export interface DetailItem {
  title: string
  period?: string
  flow?: Flow
  situation?: string
  decision?: string
  result?: string
  body?: string
}

// A tab shows its key items up front and folds the rest behind "more".
export interface DetailTab {
  label: string
  items: DetailItem[]
  more?: DetailItem[]
}

// An entry tells its story in the dialog. Entries with cards or tabs open a
// detail panel instead of more dialog lines when the visitor asks for more.
export interface Entry {
  title: string
  summary: string[]
  more: string[]
  cards?: DetailCard[]
  tabs?: DetailTab[]
  stack?: string
}

export interface RegionLabel {
  tag: string
  name: string
  period: string
}

export interface TimelineItem {
  period: string
  title: string
  detail: string
}

export interface TldrContent {
  heading: string
  tagline: string
  sections: { title: string; items: string[] }[]
  timelineTitle: string
  timeline: TimelineItem[]
  linksTitle: string
}

export type CoachTarget = 'player' | 'quest' | 'map'

export interface CoachStep {
  title: string
  body: string
  target: CoachTarget
}

export interface UiText {
  pressStart: string
  subtitle: string
  chooseLang: string
  tldr: string
  close: string
  more: string
  controlsHint: string
  touchHint: string
  hintSkip: string
  hintNext: string
  hintTalk: string
  warp: string
  pickedUp: string
  map: string
  titleMap: string
  mapTitle: string
  mapLead: string
  mapTravel: string
  mapVisited: string
  mapTldr: string
  mapReplayGuide: string
  questNext: string
  questDone: string
  coach: CoachStep[]
  coachNext: string
  coachSkip: string
  coachDone: string
  detailSituation: string
  detailDecision: string
  detailResult: string
  detailMore: string
  flowBefore: string
  flowAfter: string
}

export interface Content {
  ui: UiText
  regions: Record<RegionId, RegionLabel>
  entries: Record<EntryId, Entry>
  tldr: TldrContent
}
