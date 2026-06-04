# Claude Development Guidelines

> This file is auto-loaded by the Claude Code CLI when a session opens in this directory. The canonical rules for every Topia SDK app live in the **[sdk-ai-boilerplate](../sdk-ai-boilerplate/)** sibling repo.

## Where to find the rules

The canonical source is [`../sdk-ai-boilerplate/.ai/`](../sdk-ai-boilerplate/.ai/). Use the first source you can reach — stop once you've found it; the second is a fallback for when the first isn't available:

1. **[`../sdk-ai-boilerplate/.ai/`](../sdk-ai-boilerplate/.ai/)** — canonical (in the topia-stack monorepo). Read `rules.md`, `sdk-fundamentals.md`, `style-guide.md`, `accessibility.md`; browse `examples/` as needed.
2. **https://github.com/metaversecloud-com/sdk-ai-boilerplate** — read directly from GitHub if the monorepo copy isn't reachable.

If both are reachable and disagree, the **sdk-ai-boilerplate** copy wins.

## Stack

- React + TypeScript (client), Node + Express (server)
- SDK: [`@rtsdk/topia`](https://metaversecloud-com.github.io/mc-sdk-js/index.html)

## App-specific context

This is **Virtual Pet** — a virtual-pet care app. See [`README.md`](README.md) for the gameplay overview, required dropped-asset unique names, and the API surface.

The previous version of this file contained reference material for the `mc-sdk-js` (`@rtsdk/topia`) library itself — class hierarchy, factory pattern, controller methods, data-object pattern, inventory cache pattern, and the NPC system. That content is **not virtual-pet-specific** and lives canonically at:

- **SDK reference**: https://metaversecloud-com.github.io/mc-sdk-js/index.html
- **Patterns in context**: `../sdk-ai-boilerplate/.ai/rules.md` (data objects, inventory cache, NPC voice chat) and `../sdk-ai-boilerplate/.ai/examples/` (badges, leaderboards, dropped assets, etc.)

## Local SDK development (yalc)

If iterating on `@rtsdk/topia` while building this app, link the local SDK:

```bash
# Push from the SDK repo
cd mc-sdk-js/clients/client-topia
npm run yalc-push

# Pull into this app
cd topia-sdk-apps/virtual-pet/server
npx yalc add @rtsdk/topia
cd ..
npm install
```

---

For architecture, SDK usage, protected files, data-object patterns, real-time updates, styling, accessibility, testing, workflow — defer to `../sdk-ai-boilerplate/.ai/rules.md`.
