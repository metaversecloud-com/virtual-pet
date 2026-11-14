import { APIRequestContext, test as base, expect } from "@playwright/test";
import { INTERACTIVE_KEY, MOCK_TOPIA_URL } from "./constants";

export const KEY_ASSET_ID = "key-asset";
export const SCENE_DROP_ID = "scene-1";
export const VISITOR_ID = 42;

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

const ownedItem = (id: string, item: { id: string; name: string; type: string; metadata?: unknown }, quantity = 1) => ({
  id,
  item_id: item.id,
  itemId: item.id,
  quantity,
  name: item.name,
  type: item.type,
  status: "ACTIVE",
  image_url: "",
  item: { ...item, description: "", metadata: item.metadata ?? null, image_url: "" },
});

const ownedBadge = (name: string) =>
  ownedItem(`owned-badge-${BADGES.indexOf(name) + 1}`, { id: `badge-${BADGES.indexOf(name) + 1}`, name, type: "BADGE" });

const ownedNpc = (petType: string, petAge: string, color: number) => {
  const id = npcItemId(petType, petAge, color);
  return ownedItem(`owned-${id}`, {
    id,
    name: `${petType} ${petAge} ${color}`,
    type: "NPC",
    metadata: { petDescription: `${petType}:${petAge}:${color}`, spriteUrl: "https://example.invalid/npc.png" },
  });
};

export const VISITOR_POSITION = { x: 600, y: 300 };
export const NPC_POSITION = { x: 640, y: 320 };

export type VisitorSeed = {
  isAdmin?: boolean;
  /** The visitor's pets (stored in visitor.dataObject.pets by id). */
  pets?: Pet[];
  /** Id of the pet that currently follows the visitor as an NPC. */
  inWorld?: string;
  /** Badges the visitor already owns. */
  badges?: string[];
  /** Expressions the visitor already owns (e.g. "pet_dragon"). */
  expressions?: string[];
  /** Raw visitor data object; replaces the one built from `pets`. */
  visitorData?: Record<string, unknown>;
};

export type OtherVisitor = VisitorSeed & { visitorId: number; profileId: string; displayName: string };

export type SeedOptions = VisitorSeed & {
  /** The key asset's data object. */
  assetData?: Record<string, unknown>;
  /** Further visitors in the world. */
  otherVisitors?: OtherVisitor[];
};

/** One isolated Topia world in mock-topia, plus helpers to open the app inside it. */
export class TopiaWorld {
  readonly displayName = "E2E Player";

  constructor(
    readonly urlSlug: string,
    readonly profileId: string,
    private request: APIRequestContext,
  ) {}

  private visitor(profileId: string, displayName: string, seed: VisitorSeed) {
    const { isAdmin = false, pets, inWorld, badges = [], expressions = [], visitorData } = seed;
    const inventory: unknown[] = badges.map(ownedBadge);
    let npc = null;
    if (inWorld) {
      const pet = pets?.find((p) => p.id === inWorld);
      if (!pet) throw new Error(`inWorld pet ${inWorld} isn't in pets`);
      const owned = ownedNpc(pet.petType, pet.petAge, pet.color);
      inventory.push(owned);
      npc = { playerId: 9001, isNPCFromKey: `${INTERACTIVE_KEY}|${owned.item_id}|${owned.id}`, moveTo: NPC_POSITION };
    }
    return {
      isAdmin,
      profileId,
      displayName,
      moveTo: VISITOR_POSITION,
      landmarkZonesString: "",
      privateZoneId: "",
      dataObject: visitorData ?? (pets ? { pets: Object.fromEntries(pets.map((p) => [p.id, p])) } : {}),
      inventory,
      expressions,
      npc,
    };
  }

  async seed({ assetData = {}, otherVisitors = [], ...me }: SeedOptions = {}) {
    const assets = {
      [KEY_ASSET_ID]: {
        id: KEY_ASSET_ID,
        assetName: "Virtual Pet",
        position: { x: 500, y: 500 },
        uniqueName: "",
        sceneDropId: SCENE_DROP_ID,
        topLayerURL: "https://example.invalid/virtual-pet.png",
        dataObject: assetData,
      },
    };
    const visitors: Record<string, unknown> = { [VISITOR_ID]: this.visitor(this.profileId, this.displayName, me) };
    for (const other of otherVisitors) visitors[other.visitorId] = this.visitor(other.profileId, other.displayName, other);

    const response = await this.request.post(`${MOCK_TOPIA_URL}/__mock/worlds/${this.urlSlug}`, {
      data: { dataObject: {}, assets, visitors },
    });
    if (!response.ok()) throw new Error(`Seeding mock world failed: ${response.status()}`);
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

  async visitorData(visitorId = VISITOR_ID) {
    return (await this.state()).visitors[visitorId].dataObject;
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

  async expressions(visitorId = VISITOR_ID): Promise<string[]> {
    return (await this.state()).visitors[visitorId].expressions || [];
  }

  async events(type?: string) {
    const { events } = await this.state();
    return type ? events.filter((e) => e.type === type) : events;
  }

  /** Names of the particles triggered in the world, in order. */
  async particles() {
    return (await this.events("particles")).map((e) => e.particleName);
  }

  /** Session credentials Topia appends to the app's iframe URL. */
  credentials(overrides: Record<string, string> = {}) {
    return new URLSearchParams({
      assetId: KEY_ASSET_ID,
      displayName: this.displayName,
      identityId: "identity-1",
      interactiveNonce: "e2e-nonce",
      interactivePublicKey: INTERACTIVE_KEY,
      profileId: this.profileId,
      sceneDropId: SCENE_DROP_ID,
      uniqueName: "",
      urlSlug: this.urlSlug,
      username: "e2e-player",
      visitorId: String(VISITOR_ID),
      ...overrides,
    });
  }

  /** Credentials of another visitor in this world. */
  as(other: OtherVisitor) {
    return { visitorId: String(other.visitorId), profileId: other.profileId, displayName: other.displayName };
  }

  /** App page URL as Topia opens it in the iframe. */
  url(path = "/", overrides: Record<string, string> = {}) {
    return `${path}?${this.credentials(overrides)}`;
  }

  /** App API path carrying the session credentials, as the client's backendAPI sends them. */
  api(path: string, overrides: Record<string, string> = {}) {
    return `/api${path}?${this.credentials(overrides)}`;
  }

  /** POST /api/execute-action the way the drawer's action buttons do. */
  act(action: string, selectedPetId: string, overrides: Record<string, string> = {}) {
    return this.request.post(this.api("/execute-action", overrides), {
      data: { action, selectedPetId, keyAssetId: KEY_ASSET_ID },
    });
  }
}

export const test = base.extend<{ world: TopiaWorld }>({
  // The app's pages load styles, fonts and pet images from S3 and Google; never let a test reach them.
  context: async ({ context }, use) => {
    await context.route(
      (url) => !["localhost", "127.0.0.1"].includes(url.hostname),
      (route) => route.abort(),
    );
    await use(context);
  },
  world: async ({ request }, use, testInfo) => {
    const id = `${testInfo.testId}-${testInfo.repeatEachIndex}-${testInfo.retry}`.replace(/[^a-zA-Z0-9-]/g, "");
    const world = new TopiaWorld(`world-${id}`, `profile-${id}`, request);
    await use(world);

    // Fail the test if the app called a public-API endpoint the mock doesn't implement (e.g. after an
    // @rtsdk/topia upgrade): it would otherwise pass against a 501 the real API never returns.
    expect((await world.state()).unhandled, "public-API calls mock-topia doesn't implement").toEqual([]);
    const outside = await (await request.get(`${MOCK_TOPIA_URL}/__mock/unhandled`)).json();
    expect(outside, "public-API calls mock-topia doesn't implement").toEqual([]);
  },
});

export { expect } from "@playwright/test";
