# Virtual Pet - Claude Development Guidelines

This document provides Claude-specific guidelines for working with this Topia SDK Virtual Pet application.

## Project Context

- **Stack**: React + TypeScript (client), Node + Express (server)
- **SDK**: JavaScript RTSDK - Topia Client Library (@rtsdk/topia)
- **App Type**: Pet adoption and care game with spawned assets
- **SDK Documentation**: https://metaversecloud-com.github.io/mc-sdk-js/index.html

## Application Overview

Virtual Pet is a pet care game where players:
1. Adopt a virtual pet (creates a dropped asset in the world)
2. Care for their pet (feed, play, etc.)
3. Level up their pet through interactions
4. Pet follows the player around the world (using NPC system)

---

## Interactive Keys & Authentication

### Key Types

| Key | Storage | Purpose |
|-----|---------|---------|
| `INTERACTIVE_KEY` (publicKey) | `.env`, passed to clients | Identifies the app, linked to assets |
| `INTERACTIVE_SECRET` (secretKey) | `.env` only, **never expose** | Signs JWTs for API authentication |
| `API_KEY` | `.env` only | Optional admin-level access |
| `IMG_ASSET_ID` | `.env` | Base asset ID for spawning pet images |

### How Interactive Keys Work

```
Developer Setup (topia-gateway):
┌─────────────────────────────────────────────────────────────────┐
│ 1. Developer creates Interactive Key in topia-gateway           │
│    → Generates: publicKey (Firestore doc ID)                    │
│    → Generates: secretKey (base64-encoded UUID)                 │
│ 2. Developer links key to pet interaction assets                │
│    - Adoption kiosk asset                                       │
│    - Spawned pet assets (dynamically created)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
Runtime (when user clicks asset):
┌─────────────────────────────────────────────────────────────────┐
│ 1. Topia generates interactiveNonce (session-specific)          │
│ 2. Topia opens iframe with credentials in URL query params      │
│ 3. SDK app extracts credentials, signs JWT with secretKey       │
│ 4. public-api validates JWT signature + nonce                   │
└─────────────────────────────────────────────────────────────────┘
```

### JWT Signing Process

The SDK automatically signs requests using the `interactiveSecret`:

```typescript
// Inside SDK (SDKController.ts) - happens automatically
const payload = {
  interactiveNonce,
  visitorId,
  assetId,
  urlSlug,
  profileId,
  date: new Date(),
};
const jwt = jwt.sign(payload, topia.interactiveSecret);
```

### Server Initialization

**File:** `server/utils/topiaInit.ts`

```typescript
import { Topia, AssetFactory, DroppedAssetFactory, VisitorFactory, WorldFactory } from "@rtsdk/topia";

const topia = new Topia({
  apiDomain: process.env.INSTANCE_DOMAIN,
  apiProtocol: process.env.INSTANCE_PROTOCOL,
  apiKey: process.env.API_KEY,
  interactiveKey: process.env.INTERACTIVE_KEY,
  interactiveSecret: process.env.INTERACTIVE_SECRET,
});

export const Asset = new AssetFactory(topia);
export const DroppedAsset = new DroppedAssetFactory(topia);
export const Visitor = new VisitorFactory(topia);
export const World = new WorldFactory(topia);
```

---

## Platform-to-App Communication

SDK apps are **external applications** that you build and host. Topia communicates with your app via **iframes**.

### Iframes (Pet Interaction UI)

When a user clicks a pet-related asset, Topia opens your app in an **iframe drawer**:

```
User clicks adoption kiosk OR spawned pet → Topia opens iframe
                                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ YOUR PET APP (React frontend in iframe)                         │
│                                                                 │
│ URL: https://your-app.com/?visitorId=123&assetId=xyz&...        │
│                                                                 │
│ • Adoption kiosk: Choose pet type, name your pet                │
│ • Spawned pet: Feed, play, view stats                           │
│ • Display pet status, level, achievements                       │
└─────────────────────────────────────────────────────────────────┘
```

**Key Points:**
- You build the entire pet care UI
- Credentials tell you WHO clicked (visitorId, profileId)
- Credentials tell you WHAT was clicked (assetId)
- Your backend uses SDK to update pet state in Topia

---

## Session Credentials

### Credential Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `visitorId` | number | User's visitor ID in this world |
| `interactiveNonce` | string | One-time session token |
| `interactivePublicKey` | string | Your app's public key |
| `urlSlug` | string | Current world's URL slug |
| `profileId` | string | User's global profile ID |
| `assetId` | string | The clicked asset's ID |
| `keyAssetId` | string | Optional: Override asset ID for key lookups |

### Special Credential Handling

Virtual Pet has a special `keyAssetId` field for handling spawned pet assets:

```typescript
// server/utils/getCredentials.ts
interface Credentials {
  // ... standard fields
  keyAssetId?: string;  // Used when pet asset is different from clicked asset
}

// In controller
const credentials = getCredentials(req.query);
const { keyAssetId, petType, name } = req.body;
if (keyAssetId) credentials.assetId = keyAssetId;  // Override assetId
```

---

## Dropped Assets (Pet Spawning)

### Creating Pet Assets

Pets are dynamically spawned as dropped assets in the world:

**File:** `server/utils/droppedAssets/dropAsset.ts`

```typescript
import { Asset, DroppedAsset } from "../utils/topiaInit";
import { DroppedAssetClickType } from "@rtsdk/topia";

// 1. Create the base asset
const asset = await Asset.create(process.env.IMG_ASSET_ID || "webImageAsset", { credentials });

// 2. Drop the pet into the world
const petSpawnedDroppedAsset = await DroppedAsset.drop(asset, {
  position: { x: moveTo?.x + 100, y: moveTo?.y },
  uniqueName: `petSystem-${username}`,  // Unique per player
  urlSlug,
  flipped: Math.random() < 0.5,  // Random flip for variety

  // Make it interactive
  isInteractive: true,
  interactivePublicKey: process.env.INTERACTIVE_KEY,

  // Visual layers
  layer0: "",
  layer1: petImageUrl,  // Pet sprite image

  // Click behavior
  clickType: DroppedAssetClickType.LINK,
  clickableLink: `${BASE_URL}/asset-type/spawned`,
  clickableLinkTitle: "Virtual Pet",
  isOpenLinkInDrawer: true,
});

// 3. Store owner data on the pet asset
await petSpawnedDroppedAsset?.updateDataObject({ profileId });

// 4. Store pet asset reference on visitor
await visitor.updateDataObject({
  [`pet.petSpawnedDroppedAssetId`]: petSpawnedDroppedAsset?.id
});
```

### Pet Data Object

```typescript
interface PetAssetDataObject {
  profileId: string;  // Owner's profile ID
}
```

---

## Visitor Data Object (Pet State)

Pet status is stored on the visitor's data object:

**File:** `server/controllers/handleCreatePet.ts`

```typescript
const pet = {
  ...defaultPetStatus,
  username: displayName || username,
  experience: 0,
  petType,
  name,
  color: 0,
};

await visitor.setDataObject(
  { pet },
  {
    analytics: [
      { analyticName: `starts`, profileId, uniqueKey: profileId },
      { analyticName: `starts-${petType}`, profileId, uniqueKey: profileId },
    ],
  },
);
```

### Default Pet Status

**File:** `server/constants.ts`

```typescript
export const defaultPetStatus = {
  hunger: 100,
  happiness: 100,
  energy: 100,
  health: 100,
  lastFed: null,
  lastPlayed: null,
  // ... other status fields
};
```

---

## Extended DroppedAsset Interface

**File:** `server/types/DroppedAssetInterface.ts`

```typescript
import { DroppedAsset } from "@rtsdk/topia";

export interface IDroppedAsset extends DroppedAsset {
  dataObject?: {
    profileId?: string;
  };
}
```

---

## Pet Following (NPC System Integration)

Virtual pets follow players using Topia's inventory-based NPC system. NPCs are spawned from inventory items, enabling tracking, customization, and persistence.

### Inventory-Based NPC Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. SETUP (topia-gateway)                                        │
│    Developer creates NPC inventory items with type "NPC"        │
│    - Pet sprites as avatar images                               │
│    - Different pet types as different inventory items           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. GRANT (when player adopts pet)                               │
│    visitor.grantInventoryItem(petInventoryItemId, 1)            │
│    → Returns userInventoryItemId                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. SPAWN (create following avatar without nameplate)            │
│    visitor.createNpc(userInventoryItemId, { showNameplate: false })│
│    → Creates NPC in world following this visitor                │
└─────────────────────────────────────────────────────────────────┘
```

### SDK Methods

```typescript
// First, grant an NPC inventory item to the visitor (when adopting)
const npcItem = await visitor.grantInventoryItem(petInventoryItemId, 1);

// Spawn the NPC without a nameplate (pets don't need names above their heads)
const npc = await visitor.createNpc(npcItem.id, { showNameplate: false });

// Get existing NPC for this visitor (from this app's public key)
const existingNpc = await visitor.getNpc();

// Delete the NPC (when pet runs away, etc.)
await visitor.deleteNpc();
```

**`createNpc` Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showNameplate` | `boolean` | `true` | Whether to display a nameplate above the NPC |

Virtual Pet uses `showNameplate: false` since pets don't need name labels floating above them.

### NPC Inventory Item Setup

In topia-gateway, create inventory items with type `NPC`:

| Field | Value | Notes |
|-------|-------|-------|
| `itemType` | `NPC` | Required for NPC spawning |
| `avatarUrl` | Pet sprite URL | The NPC's visual appearance |
| `name` | "Cat Pet", "Dog Pet" | Display name |
| `isUnique` | `true` | One NPC per visitor recommended |

### Frontend Rendering

NPCs are rendered via the dedicated `NpcSystem` (separate from `PlayerSpriteSystem`):

- NPCs don't participate in proximity/WebRTC connections
- NPCs don't appear in player list UI
- NPCs are clickable via spatial hashing
- NPCs follow their owner player's position

### Key Integration Points

```typescript
// server/controllers/handleAdoptPet.ts
export async function handleAdoptPet(req, res) {
  const credentials = getCredentials(req.query);
  const { petType } = req.body;

  const visitor = await Visitor.get(visitorId, urlSlug, { credentials });

  // Get the inventory item ID for this pet type
  const petInventoryItemId = PET_TYPE_TO_INVENTORY_ITEM[petType];

  // Grant the inventory item
  const grantedItem = await visitor.grantInventoryItem(petInventoryItemId, 1);

  // Spawn the NPC without nameplate (pets don't need name labels)
  const npc = await visitor.createNpc(grantedItem.id, { showNameplate: false });

  // Store reference in visitor data
  await visitor.updateDataObject({
    pet: {
      userInventoryItemId: grantedItem.id,
      petType,
      // ... other pet data
    }
  });

  return res.json({ success: true, npc });
}
```

See `npcs.md` in the topia-stack root for full NPC documentation.

---

## Architecture & Data Flow

1. **Server-First Architecture**: All SDK calls happen in server routes/controllers
2. **API Flow**: UI → `client/backendAPI.ts` → server routes → Topia SDK
3. **Protected Files**: Do not modify `client/App.tsx`, `backendAPI.ts`, `getCredentials.ts`

### Key Controllers

| Controller | Purpose |
|------------|---------|
| `handleCreatePet.ts` | Create new pet, initialize visitor data |
| `handleGetVisitor.ts` | Fetch visitor's pet status |
| `handleFeedPet.ts` | Feed pet, update hunger |
| `handlePlayWithPet.ts` | Play with pet, update happiness |

### Key Utilities

| Utility | Purpose |
|---------|---------|
| `dropAsset.ts` | Spawn pet as dropped asset |
| `getVisitorAndPetStatus.ts` | Fetch combined visitor/pet data |

---

## Google Sheets Integration

Virtual Pet logs events to Google Sheets for analytics:

```typescript
import { addNewRowToGoogleSheets } from "../utils/addNewRowToGoogleSheets";

addNewRowToGoogleSheets([
  {
    identityId,
    displayName,
    event: "starts",
    urlSlug,
    username,
  },
]).catch(() => {});  // Fire and forget
```

---

## Backend Validation

When requests are made, Topia's `public-api` validates:

1. **JWT Signature**: Verifies JWT was signed with the correct `secretKey`
2. **Nonce Validation**: Checks `interactiveNonce` matches Redis
3. **Asset Configuration**: Confirms asset has `isInteractive=true` and matching `interactivePublicKey`

---

## Environment Setup

```env
API_KEY=your_api_key_here
INTERACTIVE_KEY=your_interactive_key_here
INTERACTIVE_SECRET=your_interactive_secret_here
INSTANCE_DOMAIN=api.topia.io
INSTANCE_PROTOCOL=https
IMG_ASSET_ID=webImageAsset
BASE_URL=https://your-app-url.com
```

---

## Key Source Paths

| Path | Purpose |
|------|---------|
| `server/utils/topiaInit.ts` | SDK initialization |
| `server/utils/getCredentials.ts` | Credential extraction |
| `server/utils/droppedAssets/dropAsset.ts` | Pet spawning |
| `server/utils/getVisitorAndPetStatus.ts` | Pet status utility |
| `server/controllers/handleCreatePet.ts` | Pet creation |
| `server/types/DroppedAssetInterface.ts` | Extended asset types |
| `server/constants.ts` | Default pet values |

---

## Key References

- **SDK Documentation**: https://metaversecloud-com.github.io/mc-sdk-js/index.html
- **NPC/Following Avatar Docs**: See `npcs.md` in topia-stack root
- **Topia Stack Docs**: See `CLAUDE.md` files in parent directories
