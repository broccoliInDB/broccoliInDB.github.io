import { en } from './en'
import { ko } from './ko'
import { type Content, type Lang } from './types'

const CONTENTS: Record<Lang, Content> = { ko, en }
const STORAGE_KEY = 'broccoli-log:lang'

let currentLang: Lang = readStoredLang() ?? detectLang()
const listeners = new Set<() => void>()

function readStoredLang(): Lang | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'ko' || stored === 'en' ? stored : null
  } catch {
    return null
  }
}

function detectLang(): Lang {
  return navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en'
}

export function getLang(): Lang {
  return currentLang
}

export function getContent(): Content {
  return CONTENTS[currentLang]
}

export function getContentFor(lang: Lang): Content {
  return CONTENTS[lang]
}

export function setLang(lang: Lang): void {
  currentLang = lang
  document.documentElement.lang = lang
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Storage can be unavailable (private mode); the choice still applies.
  }
  listeners.forEach((listener) => listener())
}

export function onLangChange(listener: () => void): void {
  listeners.add(listener)
}
