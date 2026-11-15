import { APIRequestContext, test as base, expect } from "@playwright/test";
import { INTERACTIVE_KEY, MOCK_TOPIA_URL } from "./constants";

/**
 * Id of the dropped asset the app is opened from. Per world instead with test.use({ uniqueAssetId: true })
 * (then use world.assetId): apps that match SSE connections or caches by assetId alone would otherwise mix
 * up parallel tests, since real asset ids are globally unique.
 */
export const KEY_ASSET_ID = "key-asset";
export const SCENE_DROP_ID = "scene-1";
export const VISITOR_ID = 42;

// ---- Virtual Pet ----
export type PetType = "dragon" | "penguin" | "unicorn" | "dog" | "cat";
export type PetAge = "baby" | "teen" | "adult";
export type Action = "FEED" | "SLEEP" | "PLAY" | "TRAIN";

/** Badges in the mock ecosystem (same order as mock-topia, which ids them badge-1, badge-2, ...). */
export const BADGES = [
  "Baby Steps",
  "Pet Party",
  "Flamekeeper",
  "Dreamkeeper",
  "Icebreaker",
  "Growing up Fast",
  "All Grown Up",
  "Veteran Caretaker",
  "Loyal Friend",
  "Consistent Care",
  "Well Fed",
  "Well Rested",
  "Let's Play",
  "Trainer in the Making",
  "Fresh Look",
];

/** Production tuning from server/constants.ts (IS_LOCALHOST unset). */
export const ACTIONS: Record<Action, { cooldownMinutes: number; xp: number; particle: string; badge: string }> = {
  FEED: { cooldownMinutes: 60, xp: 20, particle: "redHeart_float", badge: "Well Fed" },
  SLEEP: { cooldownMinutes: 45, xp: 15, particle: "sleep_float", badge: "Well Rested" },
  PLAY: { cooldownMinutes: 15, xp: 5, particle: "guitar_float", badge: "Let's Play" },
  TRAIN: { cooldownMinutes: 30, xp: 10, particle: "pawPrint_float", badge: "Trainer in the Making" },
};

const MINUTE = 60 * 1000;
export const DAY = 24 * 60 * MINUTE;
export const minutesAgo = (minutes: number) => Date.now() - minutes * MINUTE;

// XP needed to reach each level (server/utils/getLevelAndAge.ts): level N lasts until LEVELS[N].
const LEVELS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500, 12000];

/** The level fields the app stores next to a pet's experience (for levels 1-15). */
export const levelFields = (experience: number) => {
  const level = LEVELS.findIndex((needed, i) => i > 0 && experience < needed);
  const currentLevel = level === -1 ? 15 : level;
  return {
    experience,
    currentLevel,
    experienceNeededForNextLevel: LEVELS[currentLevel],
    experienceNeededForTheLevelYouCurrentlyAchieved: currentLevel === 1 ? 0 : LEVELS[currentLevel - 1],
    petAge: (currentLevel < 5 ? "baby" : currentLevel < 10 ? "teen" : "adult") as PetAge,
  };
};

let petCounter = 0;

/** A pet as the app stores it in visitor.dataObject.pets (shared/constants defaultPetStatus + create-pet). */
export const makePet = (petType: PetType = "dragon", overrides: Record<string, any> = {}) => {
  const createdDate = overrides.createdDate ?? Date.now() - DAY - ++petCounter * 1000;
  return {
    id: `${petType}_${createdDate}`,
    username: "E2E Player",
    petType,
    name: "Max",
    color: 0,
    ...levelFields(overrides.experience ?? 0),
    isPetInWorld: false,
    feed: { timestamp: undefined },
    sleep: { timestamp: undefined },
    play: { timestamp: undefined },
    train: { timestamp: undefined },
    petSpawnedDroppedAssetId: null,
    createdDate,
    ...overrides,
  };
};
export type Pet = ReturnType<typeof makePet>;

/** Mock ecosystem id of the NPC item the app spawns for a pet (metadata.petDescription "type:age:color"). */
export const npcItemId = (petType: string, petAge: string, color: number) => `npc-${petType}-${petAge}-${color}`;

export const VISITOR_POSITION = { x: 600, y: 300 };
export const NPC_POSITION = { x: 640, y: 320 };

export type SeedOptions = {
  isAdmin?: boolean;
  /** Visitor is standing inside the asset's zone. */
  inZone?: boolean;
  /** false = the dropped asset the app was opened from doesn't exist in the world. */
  withAsset?: boolean;
  /** Extra dropped-asset fields (assetName, topLayerURL, uniqueName, ...). */
  asset?: Record<string, unknown>;
  /** The dropped asset's data object. */
  assetData?: Record<string, unknown>;
  /** The world's data object. */
  worldData?: Record<string, unknown>;
  /** The visitor's data object (the same record as its user data object, like the real API). */
  visitorData?: Record<string, unknown>;
  /** Badges the visitor already owns. */
  badges?: string[];
  /**
   * Catalog items the visitor already owns (any type), by catalog id or name, with their quantity
   * (default 1) and the user item's own metadata (default {}). Unknown items fail the seed.
   */
  inventory?: OwnedItem[];
  /** Extra fields on the visitor (expressions: ["emote-wave"] it owns, username, ...). */
  visitor?: Record<string, unknown>;
  /**
   * Other players in the world, keyed by visitorId. Act as one with world.as(id) / world.apiAs(id, path).
   * Default profileId "<world.profileId>-v<id>". A fixed explicit one ("profile-alice") is fine: mock-topia
   * keeps user data objects per world, so parallel tests using the same id don't share its data.
   */
  otherVisitors?: Record<number, OtherVisitor>;
  /** Data objects of profiles that aren't in the world, keyed by profileId (per world, like otherVisitors). */
  users?: Record<string, Record<string, unknown>>;
  /**
   * The ecosystem inventory catalog (GET /inventory, grants) for this world. Default: mock-topia/catalog.json
   * if the app has one, else four Quiz badges. Useless for apps that cache the catalog process-wide (they
   * keep the first world's): give those a catalog.json instead.
   */
  inventoryItems?: InventoryItem[];
  /** Unlockable expressions (GET /expressions, grant-expression). Default: the mock's Wave and Dance. */
  expressions?: Array<{ id: string; name: string } & Record<string, unknown>>;
  /**
   * The world's user group data objects, as Visitor.fetchUserGroupDataObject returns them (default none).
   */
  userGroupDataObjects?: Array<Record<string, unknown>>;
  /** Extra fields for GET /world-details (World.fetchDetails); default { urlSlug, name, width, height }. */
  worldDetails?: Record<string, unknown>;
  /** Further dropped assets in the world, keyed by id (their `id` defaults to the key). */
  extraAssets?: Record<string, Record<string, unknown>>;
  /**
   * Scenes GET /scenes/:sceneId (Scene.get / fetchSceneById) knows, keyed by scene id (their `id` is the key).
   * Read from the caller's world (the InteractiveJWT's urlSlug); an unknown id answers 200 with a null body,
   * like the real getSceneById.
   */
  scenes?: Record<string, Record<string, unknown>>;
  /** Delay for every public-API call into the world, so concurrent requests overlap. */
  latencyMs?: number;
  /**
   * Delay for matching public-API calls only: { "<substring of 'METHOD /api/v1/...'>": ms }, e.g.
   * { "PUT /api/v1/world": 300 } or { "/visitors/42/set-data-object": 400 }. Adds to latencyMs. Calls
   * outside /world/ (inventory, user data objects, ...) count for the world in the caller's JWT.
   */
  delays?: Record<string, number>;
  /**
   * Fail matching public-API calls: { "<substring of 'METHOD /api/v1/...'>": status }, e.g.
   * { "grant-visitor-inventory-item": 500 }. Matched like delays; logged as "injected-failure" events.
   */
  failures?: Record<string, number>;
  /**
   * Data-object writes with a lockId take the lock first and hold it for their delay (latencyMs + delays),
   * like a real write that takes time, so a concurrent write with the same lockId gets 409. Default false:
   * the delay runs before the write, which takes and frees the lock at once.
   */
  holdLocksDuringDelay?: boolean;
};

/** A catalog item a visitor owns: catalog id or name, quantity (default 1), user item metadata (default {}). */
export type OwnedItem = { item: string; quantity?: number; metadata?: Record<string, unknown> };

/**
 * Another player in the world. Defaults: profileId "<world.profileId>-v<id>", displayName "Player <id>",
 * username "player-<id>".
 */
export type OtherVisitor = {
  profileId?: string;
  displayName?: string;
  isAdmin?: boolean;
  /** Standing inside the asset's zone. Default true. */
  inZone?: boolean;
  visitorData?: Record<string, unknown>;
  badges?: string[];
  inventory?: OwnedItem[];
} & Record<string, unknown>;

/** An ecosystem inventory item as GET /inventory returns it. */
export type InventoryItem = {
  id: string;
  name: string;
  type: string;
  status?: string;
  description?: string;
  image_path?: string;
  metadata?: Record<string, unknown>;
} & Record<string, unknown>;

/** A visitor inventory entry shaped like GET get-visitor-inventory-items returns it. */
const ownedBadge = (name: string) => ({
  id: `owned-${name}`,
  item_id: `owned-${name}`,
  itemId: `owned-${name}`,
  name,
  type: "BADGE",
  image_url: "",
  quantity: 1,
  status: "ACTIVE",
  item: { id: `owned-${name}`, name, type: "BADGE", image_url: "" },
});

/** One isolated Topia world in mock-topia, plus helpers to open the app inside it. */
export class TopiaWorld {
  readonly displayName = "E2E Player";

  private others: Record<number, OtherVisitor> = {};

  constructor(
    readonly urlSlug: string,
    readonly profileId: string,
    /** Protected so app fixtures that subclass TopiaWorld can call mock-topia's control routes too. */
    protected request: APIRequestContext,
    /** Id of the dropped asset the app is opened from (KEY_ASSET_ID unless the test uses uniqueAssetId). */
    readonly assetId = KEY_ASSET_ID,
  ) {}

  async seed({
    isAdmin = false,
    inZone = true,
    withAsset = true,
    asset = {},
    assetData = {},
    worldData = {},
    visitorData = {},
    badges = [],
    inventory = [],
    visitor = {},
    otherVisitors = {},
    users = {},
    inventoryItems,
    expressions,
    worldDetails,
    userGroupDataObjects,
    extraAssets = {},
    scenes,
    latencyMs = 0,
    delays = {},
    failures = {},
    holdLocksDuringDelay = false,
  }: SeedOptions = {}) {
    this.others = otherVisitors;
    const assets: Record<string, any> = Object.fromEntries(
      Object.entries(extraAssets).map(([id, fields]) => [id, { id, ...fields }]),
    );
    if (withAsset) {
      assets[this.assetId] = {
        id: this.assetId,
        assetName: "E2E Asset",
        position: { x: 500, y: 500 },
        uniqueName: "e2e-asset",
        sceneDropId: SCENE_DROP_ID,
        topLayerURL: "https://example.invalid/e2e-asset.png",
        ...asset,
        dataObject: assetData,
      };
    }

    const response = await this.request.post(`${MOCK_TOPIA_URL}/__mock/worlds/${this.urlSlug}`, {
      data: {
        dataObject: worldData,
        latencyMs,
        delays,
        failures,
        holdLocksDuringDelay,
        worldDetails,
        userGroupDataObjects,
        scenes,
        assets,
        users,
        inventoryItems,
        expressions,
        visitors: {
          ...Object.fromEntries(
            Object.entries(otherVisitors).map(
              ([
                id,
                {
                  inZone: zoned = true,
                  visitorData: data = {},
                  badges: owned = [],
                  inventory: items = [],
                  isAdmin: admin = false,
                  ...rest
                },
              ]) => [
                id,
                {
                  ...this.player(Number(id)),
                  // Real visitors always have one; the same as world.as(id) sends.
                  username: `player-${id}`,
                  isAdmin: admin,
                  landmarkZonesString: zoned ? Object.keys(assets).join(",") : "",
                  privateZoneId: "",
                  dataObject: data,
                  inventory: owned.map(ownedBadge),
                  ownedItems: items,
                  ...rest,
                },
              ],
            ),
          ),
          [VISITOR_ID]: {
            isAdmin,
            profileId: this.profileId,
            displayName: this.displayName,
            // The same as world.credentials() sends.
            username: "e2e-player",
            landmarkZonesString: inZone ? Object.keys(assets).join(",") : "",
            privateZoneId: "",
            dataObject: visitorData,
            inventory: badges.map(ownedBadge),
            ownedItems: inventory,
            ...visitor,
          },
        },
      },
    });
    if (!response.ok()) throw new Error(`Seeding mock world failed: ${response.status()} ${await response.text()}`);
  }

  /**
   * Replaces the injected failures mid-test (same format as seed's `failures`); no argument stops them,
   * e.g. to check the app recovers once Topia answers again.
   */
  async setFailures(failures: Record<string, number> = {}) {
    const response = await this.request.patch(`${MOCK_TOPIA_URL}/__mock/worlds/${this.urlSlug}`, { data: { failures } });
    if (!response.ok()) throw new Error(`Changing mock failures failed: ${response.status()}`);
  }

  /**
   * An id unique to this world, for state the mock shares between worlds (S3 keys, webhook names, ...) or a
   * profileId the app itself keeps in a global store. Not needed for otherVisitors / users profileIds:
   * mock-topia keeps user data objects per world.
   */
  scopedId(name: string) {
    return `${this.profileId}-${name}`;
  }

  /** Changes visitor fields mid-test (moveTo, isAdmin, landmarkZonesString, ...). */
  async updateVisitor(fields: Record<string, unknown>, visitorId = VISITOR_ID) {
    const response = await this.request.patch(`${MOCK_TOPIA_URL}/__mock/worlds/${this.urlSlug}/visitors/${visitorId}`, {
      data: fields,
    });
    if (!response.ok()) throw new Error(`Updating mock visitor failed: ${response.status()}`);
  }

  async state() {
    const response = await this.request.get(`${MOCK_TOPIA_URL}/__mock/worlds/${this.urlSlug}`);
    return (await response.json()) as {
      dataObject: Record<string, any>;
      assets: Record<string, any>;
      visitors: Record<string, any>;
      events: Array<Record<string, any>>;
      unhandled: string[];
    };
  }

  async assetData(assetId = this.assetId) {
    return (await this.state()).assets[assetId]?.dataObject;
  }

  async visitorData(visitorId = VISITOR_ID) {
    return (await this.state()).visitors[visitorId].dataObject;
  }

  /** A profile's user data object as this world sees it (for a visitor, the same record as visitorData). */
  async userData(profileId = this.profileId) {
    const response = await this.request.get(`${MOCK_TOPIA_URL}/__mock/users/${profileId}?world=${this.urlSlug}`);
    return (await response.json()).dataObject as Record<string, any>;
  }

  /** Objects in mock-topia's fake S3, from every test: filter by key. */
  async s3Objects() {
    const response = await this.request.get(`${MOCK_TOPIA_URL}/__mock/s3`);
    return (await response.json()) as Array<{ bucket: string; key: string; size: number; contentType?: string }>;
  }

  /** Identity of a player in this world: VISITOR_ID or one seeded with otherVisitors. */
  player(visitorId: number) {
    if (visitorId === VISITOR_ID) return { visitorId, profileId: this.profileId, displayName: this.displayName };
    const seeded = this.others[visitorId] ?? {};
    return {
      visitorId,
      profileId: seeded.profileId ?? `${this.profileId}-v${visitorId}`,
      displayName: seeded.displayName ?? `Player ${visitorId}`,
    };
  }

  /**
   * Credential overrides that make a request come from another player, with their own nonce like a
   * separate drawer: world.url("/", world.as(43)), world.credentials(world.as(43)).
   */
  as(visitorId: number): Record<string, string> {
    if (visitorId === VISITOR_ID) return {};
    const { profileId, displayName } = this.player(visitorId);
    return {
      visitorId: String(visitorId),
      profileId,
      displayName,
      identityId: `identity-${visitorId}`,
      username: `player-${visitorId}`,
      interactiveNonce: `e2e-nonce-${this.urlSlug}-v${visitorId}`,
    };
  }

  /** App API path as another player's iframe calls it. */
  apiAs(visitorId: number, path: string, overrides: Record<string, string> = {}) {
    return this.api(path, { ...this.as(visitorId), ...overrides });
  }

  async events(type?: string) {
    const { events } = await this.state();
    return type ? events.filter((e) => e.type === type) : events;
  }

  /** Session credentials Topia appends to the app's iframe URL. */
  credentials(overrides: Record<string, string> = {}) {
    return new URLSearchParams({
      assetId: this.assetId,
      displayName: this.displayName,
      identityId: "identity-1",
      // Unique per world: apps that key state by nonce across worlds (SSE connections, caches) would
      // otherwise mix up parallel tests.
      interactiveNonce: `e2e-nonce-${this.urlSlug}`,
      interactivePublicKey: INTERACTIVE_KEY,
      profileId: this.profileId,
      sceneDropId: SCENE_DROP_ID,
      uniqueName: "e2e-asset",
      urlSlug: this.urlSlug,
      username: "e2e-player",
      visitorId: String(VISITOR_ID),
      ...overrides,
    });
  }

  /** App page URL as Topia opens it in the iframe. */
  url(path = "/", overrides: Record<string, string> = {}) {
    return `${path}?${this.credentials(overrides)}`;
  }

  /** App API path carrying the session credentials, as the client's backendAPI sends them. */
  api(path: string, overrides: Record<string, string> = {}) {
    return `/api${path}?${this.credentials(overrides)}`;
  }
}

/** A visitor's pets, as Virtual Pet seeds them. */
export type PetVisitorSeed = {
  isAdmin?: boolean;
  /** The visitor's pets (stored in visitor.dataObject.pets by id). */
  pets?: Pet[];
  /** Id of the pet that currently follows the visitor as an NPC. */
  inWorld?: string;
  /** Badges the visitor already owns (catalog items, so their ids match the ecosystem's). */
  badges?: string[];
  /** Raw visitor data object; replaces the one built from `pets`. */
  visitorData?: Record<string, unknown>;
};

/** Another player in the world, with their own pets. */
export type OtherPetOwner = PetVisitorSeed & { visitorId: number; profileId: string; displayName: string };

export type PetSeedOptions = Omit<SeedOptions, "otherVisitors" | "badges" | "visitorData"> &
  PetVisitorSeed & {
    /** Further players in the world: pet owners, or the boilerplate's otherVisitors record. */
    otherVisitors?: OtherPetOwner[] | SeedOptions["otherVisitors"];
  };

/** A world with Virtual Pet's key asset; visitors own pets and NPC items. */
export class PetWorld extends TopiaWorld {
  async seed({
    pets,
    inWorld,
    badges = [],
    visitorData,
    otherVisitors = {},
    visitor = {},
    inventory = [],
    ...options
  }: PetSeedOptions = {}) {
    const owners = Array.isArray(otherVisitors) ? otherVisitors : [];
    const items = (seed: PetVisitorSeed) => {
      const owned: OwnedItem[] = (seed.badges ?? []).map((item) => ({ item }));
      const pet = seed.inWorld ? seed.pets?.find((p) => p.id === seed.inWorld) : undefined;
      if (seed.inWorld && !pet) throw new Error(`inWorld pet ${seed.inWorld} isn't in pets`);
      if (pet) owned.push({ item: npcItemId(pet.petType, pet.petAge, pet.color) });
      return owned;
    };
    const data = (seed: PetVisitorSeed) =>
      seed.visitorData ?? (seed.pets ? { pets: Object.fromEntries(seed.pets.map((p) => [p.id, p])) } : {});
    const owner = (other: OtherPetOwner) => [
      other.visitorId,
      {
        profileId: other.profileId,
        displayName: other.displayName,
        isAdmin: other.isAdmin ?? false,
        inZone: false,
        visitorData: data(other),
        inventory: items(other),
        moveTo: VISITOR_POSITION,
      },
    ];
    await super.seed({
      asset: { assetName: "Virtual Pet", uniqueName: "", topLayerURL: "https://example.invalid/virtual-pet.png" },
      visitorData: data({ pets, visitorData }),
      inventory: [...items({ pets, inWorld, badges }), ...inventory],
      visitor: { moveTo: VISITOR_POSITION, ...visitor },
      otherVisitors: Array.isArray(otherVisitors) ? Object.fromEntries(owners.map(owner)) : otherVisitors,
      ...options,
    });
    // The NPC following each visitor whose pet is in the world, like the platform's (isNPCFromKey is
    // "{publicKey}|{inventoryItemId}|{userInventoryItemId}", the user item being the one granted at seed).
    const { visitors } = await this.state();
    const seeds: Array<[number, PetVisitorSeed]> = [[VISITOR_ID, { pets, inWorld }], ...owners.map((o) => [o.visitorId, o] as [number, PetVisitorSeed])];
    for (const [visitorId, seed] of seeds) {
      const pet = seed.inWorld ? seed.pets?.find((p) => p.id === seed.inWorld) : undefined;
      if (!pet) continue;
      const itemId = npcItemId(pet.petType, pet.petAge, pet.color);
      const owned = visitors[visitorId].inventory.find((entry: any) => entry.item_id === itemId);
      const isNPCFromKey = `${INTERACTIVE_KEY}|${itemId}|${owned.id}`;
      const npc = { playerId: 9000 + Number(visitorId), isNPC: true, isNPCFromKey, moveTo: NPC_POSITION, username: "" };
      await this.updateVisitor({ npc }, Number(visitorId));
    }
  }

  async pets(visitorId = VISITOR_ID): Promise<Record<string, Record<string, any>>> {
    return (await this.visitorData(visitorId)).pets;
  }

  async pet(id: string, visitorId = VISITOR_ID) {
    return (await this.pets(visitorId))[id];
  }

  /** Names of the badges the visitor owns. */
  async badges(visitorId = VISITOR_ID): Promise<string[]> {
    const inventory: any[] = (await this.state()).visitors[visitorId].inventory || [];
    return inventory.filter((vi) => vi.item.type === "BADGE").map((vi) => vi.item.name);
  }

  /** The NPC following the visitor, as petDescription ("dragon:baby:0"), or null. */
  async npc(visitorId = VISITOR_ID): Promise<string | null> {
    const visitor = (await this.state()).visitors[visitorId];
    if (!visitor.npc) return null;
    const itemId = visitor.npc.isNPCFromKey.split("|")[1];
    const [, petType, petAge, color] = itemId.split("-");
    return `${petType}:${petAge}:${color}`;
  }

  /** Names of the expressions the visitor owns (mock-topia stores their ids, "expression-<name>"). */
  async expressions(visitorId = VISITOR_ID): Promise<string[]> {
    return ((await this.state()).visitors[visitorId].expressions || []).map((id: string) => id.replace(/^expression-/, ""));
  }

  /** Names of the particles triggered in the world, in order. */
  async particles() {
    return (await this.events("particles")).map((e) => e.particleName);
  }

  credentials(overrides: Record<string, string> = {}) {
    return super.credentials({ uniqueName: "", ...overrides });
  }

  /** POST /api/execute-action the way the drawer's action buttons do. */
  act(action: string, selectedPetId: string, overrides: Record<string, string> = {}) {
    return this.request.post(this.api("/execute-action", overrides), {
      data: { action, selectedPetId, keyAssetId: KEY_ASSET_ID },
    });
  }
}

// A 24x24 stand-in for the SDK style's CDN icons (stubSdkIcons).
const ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24"/></svg>';

export const test = base.extend<{ world: PetWorld; uniqueAssetId: boolean; stubSdkIcons: boolean }>({
  uniqueAssetId: [false, { option: true }],
  /**
   * test.use({ stubSdkIcons: true }) answers https://sdk-style.s3.amazonaws.com/icons/* with a 24x24 SVG
   * instead of aborting it. A button whose only content is such an icon is otherwise 0x0 and Playwright
   * can't click it (or use press() from helpers/press.ts).
   */
  stubSdkIcons: [false, { option: true }],
  // The browser may only talk to the app: anything else (CDNs, analytics, real Topia) is aborted, so a
  // test can't pass or flake on the network.
  context: async ({ context, stubSdkIcons }, use) => {
    await context.route(
      (url) => !["localhost", "127.0.0.1"].includes(url.hostname),
      (route) => route.abort(),
    );
    // Registered last, so it's matched first.
    if (stubSdkIcons) {
      await context.route("https://sdk-style.s3.amazonaws.com/icons/**", (route) =>
        route.fulfill({ contentType: "image/svg+xml", body: ICON_SVG }),
      );
    }
    await use(context);
  },
  world: async ({ request, uniqueAssetId }, use, testInfo) => {
    const id = `${testInfo.testId}-${testInfo.repeatEachIndex}-${testInfo.retry}`.replace(/[^a-zA-Z0-9-]/g, "");
    const world = new PetWorld(
      `world-${id}`,
      `profile-${id}`,
      request,
      uniqueAssetId ? `key-asset-${id}` : KEY_ASSET_ID,
    );
    await use(world);

    // Fail the test if the app called a public-API endpoint the mock doesn't implement (e.g. after an
    // @rtsdk/topia upgrade): it would otherwise pass against a 501 the real API never returns.
    expect((await world.state()).unhandled, "public-API calls mock-topia doesn't implement").toEqual([]);
    const outside = await (await request.get(`${MOCK_TOPIA_URL}/__mock/unhandled`)).json();
    expect(outside, "public-API calls mock-topia doesn't implement").toEqual([]);
  },
});

export { expect } from "@playwright/test";
