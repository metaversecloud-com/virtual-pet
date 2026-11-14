// Adopting pets: the adoption screen, what create-pet stores and the adoption badges.
import { KEY_ASSET_ID, PetType, expect, makePet, test } from "../../fixtures";

const createPet = (world: { api: (p: string) => string }, request: any, data: Record<string, unknown>) =>
  request.post(world.api("/create-pet"), { data: { keyAssetId: KEY_ASSET_ID, ...data } });

test("a new player adopts a pet with the species and name they picked", async ({ page, world }) => {
  await world.seed();
  await page.goto(world.url("/"));

  await expect(page.getByRole("heading", { name: "Choose Your Virtual Pet" })).toBeVisible();
  await page.getByRole("combobox").selectOption("Luna");
  await page.getByRole("heading", { name: "Unicorn" }).click();
  await page.getByRole("button", { name: "Choose Unicorn" }).click();

  // The new pet's drawer opens; it isn't in the world until the player calls it.
  await expect(page.getByRole("button", { name: "Call Pet", exact: true })).toBeVisible();
  await expect(page.getByRole("combobox")).toHaveValue("Luna");
  await expect(page.getByText("Baby Unicorn")).toBeVisible();

  const pets = Object.values(await world.pets());
  expect(pets).toHaveLength(1);
  expect(pets[0]).toMatchObject({ petType: "unicorn", name: "Luna", color: 0, experience: 0, petAge: "baby" });
  expect(pets[0].id).toBe(`unicorn_${pets[0].createdDate}`);
  expect(await world.npc()).toBeNull();
  expect((await world.events("analytics")).map((a) => a.analyticName)).toEqual(["starts", "starts-unicorn"]);
});

test("a newly adopted pet starts at level 1, like every other level calculation", async ({ page, world }) => {
  test.fail(true, "EXP-440: create-pet stores currentLevel 0 from defaultPetStatus while getLevelAndAge puts 0 XP at level 1");
  await world.seed();
  await page.goto(world.url("/"));

  await page.getByRole("button", { name: "Choose Dragon" }).click();

  await expect(page.getByRole("heading", { name: /^Level \d+$/ })).toHaveText("Level 1");
  expect(Object.values(await world.pets())[0].currentLevel).toBe(1);
});

test("opening the app for the first time sets up an empty pet list", async ({ page, world }) => {
  await world.seed();
  await page.goto(world.url("/"));

  await expect(page.getByRole("button", { name: "Choose Dragon" })).toBeVisible();
  expect(await world.visitorData()).toEqual({ pets: {} });
});

const SPECIES_BADGES: Array<[PetType, string | null]> = [
  ["dragon", "Flamekeeper"],
  ["unicorn", "Dreamkeeper"],
  ["penguin", "Icebreaker"],
  ["dog", null],
  ["cat", null],
];

for (const [petType, speciesBadge] of SPECIES_BADGES) {
  test(`first ${petType} adoption awards Baby Steps${speciesBadge ? ` and ${speciesBadge}` : ""}`, async ({ request, world }) => {
    await world.seed();

    const response = await createPet(world, request, { petType, name: "Max" });

    expect(response.ok()).toBe(true);
    const expected = ["Baby Steps", ...(speciesBadge ? [speciesBadge] : [])];
    expect((await world.badges()).sort()).toEqual(expected.sort());
    const toasts = (await world.events("fire-toast")).map((t) => t.text);
    for (const badge of expected) expect(toasts).toContain(`You have earned the ${badge} badge!`);
  });
}

test("the third pet awards Pet Party, and badges already owned aren't granted again", async ({ request, world }) => {
  await world.seed({ pets: [makePet("dog"), makePet("cat")], badges: ["Baby Steps", "Flamekeeper"] });

  const response = await createPet(world, request, { petType: "dragon", name: "Rex" });

  expect(response.ok()).toBe(true);
  expect(Object.keys(await world.pets())).toHaveLength(3);
  expect((await world.events("grant-item")).map((g) => g.name)).toEqual(["Pet Party"]);
  expect((await world.events("fire-toast")).map((t) => t.text)).toEqual(["You have earned the Pet Party badge!"]);
});

test("refuses a species the app doesn't have", async ({ request, world }) => {
  test.fail(true, "EXP-440: create-pet doesn't validate petType or name");
  await world.seed();

  const response = await createPet(world, request, { petType: "phoenix", name: "Max" });

  expect(response.status()).toBe(400);
  expect(await world.pets()).toEqual({});
});

test("refuses a pet name that isn't on the list", async ({ request, world }) => {
  test.fail(true, "EXP-440: create-pet doesn't validate petType or name");
  await world.seed();

  // Other players see the name on the pet's card ("My owner is ...").
  const response = await createPet(world, request, { petType: "dragon", name: "<b>anything I like</b>".repeat(50) });

  expect(response.status()).toBe(400);
  expect(await world.pets()).toEqual({});
});

test("a player with pets sees them listed, opens one and can adopt another", async ({ page, world }) => {
  const max = makePet("dragon", { name: "Max" });
  const coco = makePet("cat", { name: "Coco", experience: 1200 });
  await world.seed({ pets: [max, coco] });
  await page.goto(world.url("/"));

  await expect(page.getByRole("heading", { name: "Max" })).toBeVisible();
  await expect(page.getByText("Baby Dragon")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Coco" })).toBeVisible();
  await expect(page.getByText("Teen Cat")).toBeVisible();

  await page.getByRole("button", { name: "Adopt a New Pet" }).click();
  await expect(page.getByRole("heading", { name: "Choose Your Virtual Pet" })).toBeVisible();
  await page.locator("button.icon-with-rounded-border").click();

  await page.getByRole("heading", { name: "Coco" }).click();
  await expect(page.getByRole("combobox")).toHaveValue("Coco");
  await expect(page.getByRole("button", { name: "Call Pet", exact: true })).toBeVisible();
});

test("a pet saved in the old single-pet format is migrated to the pet list", async ({ page, world }) => {
  const createdDate = Date.now() - 5 * 24 * 60 * 60 * 1000;
  await world.seed({ visitorData: { pet: { petType: "dog", name: "Rex", experience: 350, color: 0, createdDate } } });
  await page.goto(world.url("/"));

  await expect(page.getByRole("heading", { name: "Rex" })).toBeVisible();
  await expect(page.getByText("Puppy")).toBeVisible();
  const data = await world.visitorData();
  expect(data.pet).toBeUndefined();
  expect(data.pets[`dog_${createdDate}`]).toMatchObject({ name: "Rex", experience: 350, currentLevel: 3, petAge: "baby" });
});
