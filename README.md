# broccoli.log

A retro top-down walk through my commit log — the self-introduction behind
[github.com/broccoliInDB](https://github.com/broccoliInDB).

**Play:** https://broccoliindb.github.io/ · **TL;DR:** https://broccoliindb.github.io/#tldr

- Spawn at `HEAD` (now) and walk west into earlier versions; the world loses
  color as you go back in time.
- Korean / English, keyboard or on-screen pad, and a one-page TL;DR for anyone
  who would rather not walk.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:5173 (dev-only: ?start&x=..&y=..&entry=..)
pnpm typecheck && pnpm test && pnpm build
pnpm banner     # regenerate profile/banner.svg for the profile README
```

Vite + TypeScript + Canvas 2D, no game engine. Dialogue lives in
`src/content/{ko,en}.ts`; the map is hand-placed in `src/world/layout.ts`.

## Credits

- Font: [Galmuri](https://github.com/quiple/galmuri) by quiple — SIL OFL 1.1
- broccoli sprite: hand-drawn for this project
