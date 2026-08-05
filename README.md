<div align="center">
<img src="https://global-uploads.webflow.com/62e7004a0f9b3a63b980ac3c/62e70c84dd3aac06fb2ac2b6_topia-logo-blue-2x.png" style="width: 120px; margin-bottom: 20px" alt="Topia logo">
</div>

# Virtual Pet

## Introduction / Summary

Virtual Pet lets a visitor adopt, raise, and travel with a persistent pet inside a Topia world. The visitor picks a species (dragon, penguin, unicorn, dog, or cat), names it, and feeds / plays with / trains / puts it to sleep on cooldowns to earn experience. As the pet levels up it ages from **baby → teen → adult**, unlocks new colors, grants its owner an emote expression, and awards badges. Behind the scenes each pet is spawned as a per-visitor **NPC** (via `visitor.createNpc`) — pets follow their owner around the world rather than being placed as static dropped assets. Ownership and state live on the **Visitor data object**, so a visitor can keep up to several pets across worlds that share the same interactive key.

## Key Features

- **Adoption:** pick from five species (`dragon`, `penguin`, `unicorn`, `dog`, `cat`), name the pet from a preset list.
- **Care loop:** four actions — **Feed**, **Sleep**, **Play**, **Train** — each with its own cooldown, XP reward, and particle effect. Attempting an action while it's still cooling down returns a `403` "Pet doesn't want to …" response.
- **Level & age progression:** 30 XP tiers; the pet ages `baby` (< L5) → `teen` (< L10) → `adult` (≥ L10). Age drives the NPC sprite that gets resolved from the ecosystem inventory.
- **Multiple pets:** a visitor's `pets` map can hold arbitrarily many pets, keyed by `${petType}_${createdDate}`. Only one is "in world" as an NPC at a time — spawning another auto-despawns the first.
- **Colors:** four color variants per species, unlocked at levels 1 / 2 / 3 / 4. Changing color re-spawns the NPC with the new sprite and awards the _Fresh Look_ badge.
- **Emote unlock:** on first reaching teen (level 5) the owner is granted a `pet_{petType}` expression with a `whiteStar_burst` particle.
- **Streaks:** the pet tracks `currentStreak` / `longestStreak` for consecutive day-over-day interactions; a 7-day streak awards _Consistent Care_.
- **Badges:** 14+ ecosystem badges awarded on adoption, level milestones, action counts, streaks, and long-term ownership (see [Analytics & Badges](#analytics)).
- **Owner vs. visitor view:** clicking the app's key asset opens the visitor's own pet drawer; clicking a spawned pet NPC surfaces the pet's read-only card, including a non-owner code path that resolves state from the _owner's_ `User` data object.
- **Force-refresh inventory:** append `&forceRefreshInventory=true` to the iframe `src` to bypass the 6-hour ecosystem inventory cache.

## Required Assets with Unique Names

None. This app does not look up dropped assets by unique name — the visitor's pet is a per-visitor NPC (`visitor.createNpc`), not a dropped asset, and the key asset is identified by whichever `assetId` the iframe was launched from (`credentials.assetId` / `keyAssetId`).

For reference, the credentials query still carries `uniqueName` (for parity with other SDK apps) but no controller reads it.

> **Note:** the previously`virtualPetKeyAsset` and `petSystem-{username}` unique names were required — those belong to an older dropped-asset spawn flow that has been fully replaced by the NPC-based flow in `spawnPetNpc.ts`. They are no longer referenced anywhere in `server/` or `client/src/`.

## Technical Architecture

### Ecosystem inventory (source of NPC sprites & badges)

Pet sprites and badge icons live as **ecosystem inventory items** (fetched via `Ecosystem.fetchInventoryItems`). The app matches them by shape:

| Inventory item type | Match rule                                                                        | Used for                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NPC`               | `metadata.petDescription === "{petType}:{petAge}:{color}"` (e.g. `dragon:baby:0`) | The NPC that follows the visitor. Granted to the visitor with `grantInventoryItem` if not already owned, then spawned via `visitor.createNpc(userItemId, { showNameplate: false })`. |
| `BADGE`             | `item.name === badgeName`                                                         | Awarded via `grantInventoryItem` + `fireToast`. Skipped if the visitor already holds the badge.                                                                                      |

Inventory results are memoized in-process for **6 hours** via `getCachedInventoryItems` (`server/utils/inventoryCache.ts`); on a stale-cache fetch failure the app falls back to the last good snapshot rather than erroring.

### Data Objects

#### Visitor (`visitor.dataObject`)

The primary owner-state surface. Keyed by pet id.

```ts
{
  pets: {
    [petId]: {              // petId = `${petType}_${createdDate}`
      id: string;
      username: string;                // display name at creation
      petType: "dragon" | "penguin" | "unicorn" | "dog" | "cat";
      name: string;                    // chosen from petNames[]
      color: 0 | 1 | 2 | 3;
      experience: number;
      currentLevel: number;            // 1..30
      experienceNeededForNextLevel: number;
      experienceNeededForTheLevelYouCurrentlyAchieved: number;
      petAge: "baby" | "teen" | "adult";
      isPetInWorld: boolean;           // derived from getNpc() on read
      feed:  { timestamp?: number; actionTakenCount?: number };
      sleep: { timestamp?: number; actionTakenCount?: number };
      play:  { timestamp?: number; actionTakenCount?: number };
      train: { timestamp?: number; actionTakenCount?: number };
      createdDate?: number;            // ms epoch
      lastInteractionDate?: string;    // ISO
      currentStreak?: number;
      longestStreak?: number;
      petSpawnedDroppedAssetId?: string; // legacy field, read-only fallback
    };
  };
}
```

**Legacy migration:** if `visitor.dataObject.pet` (singular) exists from an older deployment, `getVisitorAndPetStatus` and `handleGetPet` transparently rewrite it into `pets` via `convertPetToPets` and persist the new shape with `setDataObject`.

Also stored on the visitor via SDK calls (not the data object):

- **`visitor.inventoryItems`** — badges & NPC items granted with `grantInventoryItem`.
- **NPC** — created by `visitor.createNpc`, removed by `visitor.deleteNpc`. The active NPC (from `visitor.getNpc`) is matched back to a pet by comparing the item's `petDescription` to each pet's `${petType}:${petAge}:${color}`.
- **Expression** — `pet_{petType}` granted by `visitor.grantExpression` when the pet first reaches level 5.

#### User (`user.dataObject`) — non-owner view fallback

When a visitor clicks a _spawned pet_ they don't own, `handleGetPet` loads the owner via `User.create({ profileId })` and reads their `pet` / `pets` from the User data object. If the owner still has the legacy `pet` field it is migrated to `pets` and re-saved with `setDataObject`.

#### Dropped Asset (`droppedAsset.dataObject`) — owner lookup

`handleGetPet` reads `droppedAsset.dataObject.profileId` on the clicked asset to determine whether the current visitor is the owner. This field is a legacy hook (nothing in the current controllers writes it); when it is absent, the current visitor is treated as the owner.

#### World

The world is used for `triggerParticle` on actions and receives an `updateDataObject({})` call in `handlePickupPet` purely to attach a `trades` analytic. No world state is persisted.

### Pet lifecycle

```
CreatePet ──► pets[petId] persisted ──► (Baby Steps / adoption-species badges)
     │
     ▼
GetGameState / GetPet ──► spawnPetNpc ──► visitor.createNpc(petSprite, { showNameplate: false })
     │
     ▼
ExecuteAction (feed/sleep/play/train)
     ├─ cooldown gate (ACTION_COOLDOWNS)
     ├─ +XP (ACTION_EXPERIENCE_GAIN) → recompute level & age
     ├─ triggerParticle (ACTION_PARTICLE_EFFECTS)
     ├─ streak bookkeeping
     ├─ checkForLevelUp
     │     ├─ level 5 crossed → grantExpression(pet_{petType}) + medal_float
     │     ├─ level 10 crossed → medal_float
     │     └─ re-spawn NPC at the new age tier
     └─ conditional badge grants (see Analytics table)
     ▼
UpdatePet (rename / recolor) ──► re-spawn NPC on color change; Fresh Look badge
     ▼
TradePet ──► delete pets[petId], deleteNpc()   |   PickupPet ──► deleteNpc() only
```

### Action tuning (`server/constants.ts`)

| Action | Cooldown (prod) | Cooldown (`IS_LOCALHOST=true`) | XP  | Particle         |
| ------ | --------------- | ------------------------------ | --- | ---------------- |
| PLAY   | 15 min          | 500 ms                         | 5   | `guitar_float`   |
| SLEEP  | 45 min          | 500 ms                         | 15  | `sleep_float`    |
| FEED   | 60 min          | 500 ms                         | 20  | `redHeart_float` |
| TRAIN  | 30 min          | 500 ms                         | 10  | `pawPrint_float` |

XP thresholds for levels 1–30 are defined in `server/utils/getLevelAndAge.ts` (100, 300, 600, 1000, … 49600).

## API Endpoints

All routes mount under `/api`. Every request goes through `getCredentials` (which verifies `INTERACTIVE_KEY === interactivePublicKey`) and the `cleanReturnPayload` response middleware.

| Method | Route             | Purpose                                                                                                                                                                                                                                                                |
| ------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/system/health`  | App version, server start date, and non-secret env flags.                                                                                                                                                                                                              |
| `GET`  | `/game-state`     | Full drawer bootstrap. Returns `pets`, `selectedPetId`, `petStatus`, `isPetOwner`, `isAdmin`, `badges` (ecosystem catalog), and `visitorInventory` (granted badges + NPCs). Accepts `keyAssetId` and `forceRefreshInventory`.                                          |
| `GET`  | `/pet`            | Read-only pet lookup keyed by `assetId`. If the current visitor isn't the owner (per `droppedAsset.dataObject.profileId`), falls back to reading the owner's `User.dataObject`.                                                                                        |
| `POST` | `/create-pet`     | Body `{ petType, name, keyAssetId }`. Adds a new entry to `visitor.dataObject.pets`, fires `starts` / `starts-{petType}` analytics, appends a row to Google Sheets, awards adoption + count badges.                                                                    |
| `POST` | `/update-pet`     | Body `{ selectedPetId, selectedName, selectedColor, keyAssetId }`. Renames / recolors; on color change re-spawns the NPC and awards _Fresh Look_. Fires `updates` analytic.                                                                                            |
| `POST` | `/spawn-pet`      | Body `{ selectedPetId, keyAssetId }`. Resolves the matching NPC sprite from ecosystem inventory and calls `visitor.createNpc`.                                                                                                                                         |
| `POST` | `/execute-action` | Body `{ action: "FEED" \| "SLEEP" \| "PLAY" \| "TRAIN", selectedPetId, keyAssetId }`. Applies cooldown → XP → age recompute → particle → level-up hooks → badge grants. Returns 403 with `success: false` if the action is on cooldown. Fires `interactions` analytic. |
| `POST` | `/trade-pet`      | Body `{ selectedPetId, keyAssetId }`. Deletes the pet from `pets`, despawns the NPC if it was the in-world pet. Fires `trades` analytic.                                                                                                                               |
| `POST` | `/pickup-pet`     | Despawns the visitor's current NPC (`visitor.deleteNpc`). Fires `trades` analytic on the world data object.                                                                                                                                                            |

There is also a base `GET /api/` route that returns `{ message: "Hello from server!" }` (smoke-test only).

### Force-refresh inventory cache

The 6-hour ecosystem inventory cache can be bypassed per-request from the drawer:

1. Open the app by clicking the key asset in the world.
2. Right-click inside the drawer → **Inspect**.
3. Find the `<iframe>` and locate its `src` attribute.
4. Append `&forceRefreshInventory=true` to the URL and press **Enter**.

## Analytics

Analytics are attached to Visitor / World data-object writes via the SDK's `analytics` option. All are per-profile (`uniqueKey: profileId`) except world-scoped events.

| Event                         | Fired when                                                                                                                    | Where                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `starts`                      | A visitor creates their first (or any) pet.                                                                                   | `POST /create-pet` (visitor data object). Also appended to Google Sheets. |
| `starts-{petType}`            | A visitor creates a pet, tagged by species (`starts-dragon`, `starts-penguin`, `starts-unicorn`, `starts-dog`, `starts-cat`). | `POST /create-pet`.                                                       |
| `interactions`                | Any successful feed / sleep / play / train action.                                                                            | `POST /execute-action`.                                                   |
| `updates`                     | Pet rename or color change.                                                                                                   | `POST /update-pet`.                                                       |
| `trades`                      | Pet traded in (deleted) or picked up (NPC despawned).                                                                         | `POST /trade-pet`, `POST /pickup-pet`.                                    |
| `pet_{petType}-emoteUnlocked` | The `pet_{petType}` expression is granted for the first time (pet crosses level 5).                                           | `grantExpression` (called from `checkForLevelUp`).                        |

### Badge grants

Every badge grant additionally causes an ecosystem inventory event (`grantInventoryItem`) plus a "Badge Awarded" toast. Grants are idempotent — `awardBadge` short-circuits if the visitor already holds the badge.

| Badge                                                       | Trigger                                                                |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| Baby Steps                                                  | Create your first pet.                                                 |
| Pet Party                                                   | Reach 3 pets.                                                          |
| Flamekeeper / Dreamkeeper / Icebreaker                      | Adopt a dragon / unicorn / penguin.                                    |
| Growing up Fast                                             | Level a pet across into the teen range (updated level < 10, from < 5). |
| All Grown Up                                                | Level a pet into the adult range (updated level ≥ 10).                 |
| Veteran Caretaker                                           | Reach level 15 on any pet.                                             |
| Loyal Friend                                                | Interact with a pet whose `createdDate` is ≥ 30 days ago.              |
| Consistent Care                                             | 7-day interaction streak (`currentStreak === 7`).                      |
| Well Fed / Well Rested / Let's Play / Trainer in the Making | Perform the corresponding action 15 times on one pet.                  |
| Fresh Look                                                  | Change a pet's color.                                                  |

### Google Sheets logging

If `GOOGLESHEETS_SHEET_ID`, `GOOGLESHEETS_CLIENT_EMAIL`, and `GOOGLESHEETS_PRIVATE_KEY` are set, `starts` events from `/create-pet` are also appended as a row `[date, time, identityId, displayName, "Virtual Pet", event, urlSlug]` to the configured sheet / range (default `Sheet1`). Any other analytics event is Sheet-silent.

## Environment Variables

Create a `.env` at the app root. See `.env-example` for the minimal template.

| Variable                    | Description                                                                                                            | Required                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `INTERACTIVE_KEY`           | Topia interactive app key. Also verified against `interactivePublicKey` on every request.                              | Yes                           |
| `INTERACTIVE_SECRET`        | Topia interactive app secret.                                                                                          | Yes                           |
| `INSTANCE_DOMAIN`           | Topia API domain (`api.topia.io` for production, `api-stage.topia.io` for staging). Defaults to `api.topia.io`.        | No (but strongly recommended) |
| `INSTANCE_PROTOCOL`         | `https` for prod/staging, `http` for local dev. Defaults to `https`.                                                   | No                            |
| `S3_BUCKET`                 | S3 bucket the client fetches pet reference images from (`assets/{petType}/normal/…`). Defaults to `sdk-virtual-pet`.   | No                            |
| `PORT`                      | Server port. Defaults to `3000`.                                                                                       | No                            |
| `NODE_ENV`                  | Node environment. When not `"development"` the server serves the built React client from `client/build/`.              | No                            |
| `IS_LOCALHOST`              | If set (any truthy value), collapses all action cooldowns to 500 ms and inflates SLEEP / FEED XP for faster iteration. | No                            |
| `GOOGLESHEETS_CLIENT_EMAIL` | Google service-account email for optional analytics logging.                                                           | No                            |
| `GOOGLESHEETS_PRIVATE_KEY`  | Google service-account private key (escape `\n` as `\\n`).                                                             | No                            |
| `GOOGLESHEETS_SHEET_ID`     | Sheet id to log `starts` events to. If unset, Sheets logging is skipped.                                               | No                            |
| `GOOGLESHEETS_SHEET_RANGE`  | Sheet range. Defaults to `Sheet1`.                                                                                     | No                            |

### Where to find `INTERACTIVE_KEY` and `INTERACTIVE_SECRET`

- [Topia Dev Account Dashboard](https://dev.topia.io/t/dashboard/integrations)
- [Topia Production Account Dashboard](https://topia.io/t/dashboard/integrations)

## Getting Started

Requires Node 20+.

```bash
# from the app root
npm install

# create .env at the app root (see Environment Variables above)
cp .env-example .env

# run server + client concurrently
npm run dev
```

- Server: `http://localhost:3000` (Express)
- Client (Vite dev): `http://localhost:5173`

The dev client proxies `/api` to the server; in production the server itself statically serves `client/build/`.

### Production mode

```bash
npm install
npm run build    # builds client + server workspaces
npm start        # runs the compiled server; serves client/build
```

## For Developers

### Built With

#### Client

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

#### Server

![Node.js](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-%23000000.svg?style=for-the-badge&logo=express&logoColor=white)

### App-specific notes

- **Auth guard on every request.** `getCredentials` enforces `INTERACTIVE_KEY === query.interactivePublicKey`; mismatched keys are rejected before any SDK call.
- **Pets are NPCs, not dropped assets.** `spawnPetNpc` finds the ecosystem inventory item whose `metadata.petDescription` matches `${petType}:${petAge}:${color}`, grants it to the visitor if needed, and calls `visitor.createNpc(userItemId, { showNameplate: false })`. `visitor.deleteNpc` runs at the top of `spawnPetNpc` so a re-spawn (age tier crossed, color changed) always cleans up the previous NPC.
- **Owner detection on `/pet`.** `handleGetPet` first tries the current visitor's `pets` map; if the clicked `droppedAsset.dataObject.profileId` belongs to someone else it loads _their_ `User.dataObject` and returns a read-only view (`isPetOwner: false`).
- **Legacy shape migration.** Both `visitor.dataObject.pet` (singular) and `user.dataObject.pet` are rewritten to `pets` via `convertPetToPets` on read, then persisted with `setDataObject`.
- **Streak logic quirk.** `handleExecuteAction` bumps `currentStreak` when `new Date().getDate() - new Date(lastInteractionDate).getDate() === 1` — i.e. it's based on **day-of-month arithmetic**, which is not month-boundary safe (Feb 28 → Mar 1 is not `+1`). Worth aware of before you build dashboards off it.
- **Level-up expression.** Crossing level 5 grants `pet_{petType}` via `visitor.grantExpression`; if already granted, the toast informs the owner they can trade in the pet to earn another emote. Only fires once per pet-type per visitor.
- **Client S3 assets.** The client resolves reference sprites (`baby-color-0.png`, etc.) from `https://${S3_BUCKET}.s3.amazonaws.com/assets/{petType}/normal/…` — no upload path exists on the server; S3 is read-only from this app.
- **Local SDK dev via yalc.** See [`CLAUDE.md`](CLAUDE.md) for `yalc-push` / `yalc add` steps against `mc-sdk-js`.
- **Dead client route.** `App.tsx` still calls `backendAPI.get("/key-asset")` when the URL contains `spawned`, but no `/key-asset` route exists on the current server. This path is exercised only when someone opens the app from a URL containing `spawned` (legacy dropped-asset flow) and will surface as an error handler.

### Helpful links

- [SDK Developer docs](https://metaversecloud-com.github.io/mc-sdk-js/index.html)
- View it in action: [Dev](https://topia.io/virtual-pet-dev), [Prod](https://topia.io/virtual-pet-prod)
- [Notion One Pager](https://www.notion.so/topiaio/Virtual-Pet-App-fdc8fc22cc55463fa9f26dbb13d3061c)
