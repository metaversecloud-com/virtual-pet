// Caring for a pet: calling it into the world, the four actions, their XP, particles and cooldowns.
import { Page } from "@playwright/test";
import { ACTIONS, Action, KEY_ASSET_ID, NPC_POSITION, expect, makePet, minutesAgo, test } from "../../fixtures";

const actionButton = (page: Page, action: Action) => page.locator("button.btn-icon", { has: page.locator(`#${action}`) });
const ALL_ACTIONS = Object.keys(ACTIONS) as Action[];

test("calling a pet makes it follow the player as an NPC", async ({ page, world }) => {
  const pet = makePet("penguin", { name: "Pip" });
  await world.seed({ pets: [pet] });
  await page.goto(world.url("/"));

  await page.getByRole("heading", { name: "Pip" }).click();
  // Actions need the pet in the world.
  for (const action of ALL_ACTIONS) await expect(actionButton(page, action)).toBeDisabled();
  await expect(page.getByText("Call pet to take action.").first()).toBeAttached();

  await page.getByRole("button", { name: "Call Pet", exact: true }).click();

  await expect(page.getByRole("button", { name: "Pick up Pet" })).toBeVisible();
  await expect(actionButton(page, "FEED")).toBeEnabled();
  expect(await world.npc()).toBe("penguin:baby:0");
  expect(await world.events("create-npc")).toEqual([expect.objectContaining({ petDescription: "penguin:baby:0", showNameplate: false })]);
  expect((await world.events("grant-item")).map((g) => g.itemType)).toEqual(["NPC"]);
});

test("calling the pet again reuses the NPC item the player already owns", async ({ request, world }) => {
  const pet = makePet("dragon");
  await world.seed({ pets: [pet] });

  for (let i = 0; i < 2; i++) {
    const response = await request.post(world.api("/spawn-pet"), { data: { selectedPetId: pet.id, keyAssetId: KEY_ASSET_ID } });
    expect(response.ok()).toBe(true);
    expect((await response.json()).petStatus).toMatchObject({ id: pet.id, isPetInWorld: true });
  }

  expect(await world.npc()).toBe("dragon:baby:0");
  expect(await world.events("grant-item")).toHaveLength(1);
  expect(await world.events("create-npc")).toHaveLength(2);
});

test("feeding the pet from the drawer gives XP, a heart particle and starts the cooldown", async ({ page, world }) => {
  const pet = makePet("dragon", { name: "Max" });
  await world.seed({ pets: [pet], inWorld: pet.id });
  await page.goto(world.url("/"));

  await expect(page.getByRole("button", { name: "Pick up Pet" })).toBeVisible();
  await actionButton(page, "FEED").click();

  await expect(actionButton(page, "FEED")).toBeDisabled();
  await expect(page.getByText("I'm not hungry")).toBeAttached();
  const saved = await world.pet(pet.id);
  expect(saved).toMatchObject({ experience: 20, feed: { actionTakenCount: 1, timestamp: expect.any(Number) } });
  expect(Date.now() - saved.feed.timestamp).toBeLessThan(60_000);
  expect(await world.events("particles")).toEqual([
    expect.objectContaining({ particleName: "redHeart_float", position: NPC_POSITION, duration: 3 }),
  ]);
  expect((await world.events("analytics")).map((a) => a.analyticName)).toEqual(["interactions"]);
});

test("each action gives its own XP and particle", async ({ world }) => {
  const pet = makePet("dragon");
  await world.seed({ pets: [pet], inWorld: pet.id });

  for (const action of ALL_ACTIONS) expect((await world.act(action, pet.id)).ok()).toBe(true);

  const saved = await world.pet(pet.id);
  expect(saved.experience).toBe(ALL_ACTIONS.reduce((sum, a) => sum + ACTIONS[a].xp, 0));
  for (const action of ALL_ACTIONS) expect(saved[action.toLowerCase()].actionTakenCount).toBe(1);
  expect(await world.particles()).toEqual(ALL_ACTIONS.map((a) => ACTIONS[a].particle));
});

test("an action still cooling down gives no XP", async ({ world }) => {
  const cooldowns = Object.fromEntries(
    ALL_ACTIONS.map((a) => [a.toLowerCase(), { timestamp: minutesAgo(ACTIONS[a].cooldownMinutes - 1), actionTakenCount: 3 }]),
  );
  const pet = makePet("dragon", { experience: 200, ...cooldowns });
  await world.seed({ pets: [pet], inWorld: pet.id });

  for (const action of ALL_ACTIONS) await world.act(action, pet.id);

  const saved = await world.pet(pet.id);
  expect(saved.experience).toBe(200);
  for (const action of ALL_ACTIONS) expect(saved[action.toLowerCase()]).toEqual(cooldowns[action.toLowerCase()]);
});

test("an action still cooling down is refused and fires no particle", async ({ world }) => {
  test.fail(true, "EXP-440: the cooldown check returns the pet instead of refusing, so the request succeeds");
  const pet = makePet("dragon", { feed: { timestamp: minutesAgo(10), actionTakenCount: 1 } });
  await world.seed({ pets: [pet], inWorld: pet.id });

  const response = await world.act("FEED", pet.id);

  expect(response.status()).toBe(403);
  expect(await response.json()).toMatchObject({ success: false, message: "Pet doesn't want to feed at the moment." });
  expect(await world.particles()).toEqual([]);
});

test("an action is allowed again once its cooldown has passed", async ({ world }) => {
  const cooldowns = Object.fromEntries(
    ALL_ACTIONS.map((a) => [a.toLowerCase(), { timestamp: minutesAgo(ACTIONS[a].cooldownMinutes + 1), actionTakenCount: 3 }]),
  );
  const pet = makePet("dragon", { experience: 200, ...cooldowns });
  await world.seed({ pets: [pet], inWorld: pet.id });

  for (const action of ALL_ACTIONS) expect((await world.act(action, pet.id)).ok()).toBe(true);

  const saved = await world.pet(pet.id);
  expect(saved.experience).toBe(250);
  for (const action of ALL_ACTIONS) expect(saved[action.toLowerCase()].actionTakenCount).toBe(4);
});

test("the drawer shows which actions are cooling down", async ({ page, world }) => {
  const pet = makePet("dragon", { feed: { timestamp: minutesAgo(10), actionTakenCount: 1 }, play: { timestamp: minutesAgo(20) } });
  await world.seed({ pets: [pet], inWorld: pet.id });
  await page.goto(world.url("/"));

  await expect(actionButton(page, "FEED")).toBeDisabled();
  await expect(actionButton(page, "FEED")).toContainText("I'm not hungry");
  // PLAY's 15 minute cooldown is over; SLEEP and TRAIN were never used.
  for (const action of ["PLAY", "SLEEP", "TRAIN"] as Action[]) await expect(actionButton(page, action)).toBeEnabled();
  await expect(actionButton(page, "PLAY")).toContainText("Play");
});

test("refuses an action the app doesn't have and leaves the pet alone", async ({ world }) => {
  test.fail(true, "EXP-440: execute-action doesn't validate the action, so it corrupts the pet's XP");
  const pet = makePet("dragon", { experience: 450 });
  await world.seed({ pets: [pet], inWorld: pet.id });

  const dance = await world.act("DANCE", pet.id);
  // An action named after a pet field overwrites that field.
  const experience = await world.act("experience", pet.id);

  expect(dance.status()).toBe(400);
  expect(experience.status()).toBe(400);
  expect((await world.pet(pet.id)).experience).toBe(450);
});

test("spamming the same action at once only counts it once", async ({ world }) => {
  const pet = makePet("dragon");
  await world.seed({ pets: [pet], inWorld: pet.id });

  await Promise.all(Array.from({ length: 5 }, () => world.act("FEED", pet.id)));

  const saved = await world.pet(pet.id);
  expect(saved.experience).toBe(20);
  expect(saved.feed.actionTakenCount).toBe(1);
});

test("two different actions sent at the same time both count", async ({ world }) => {
  test.fail(true, "EXP-440: each action rewrites the whole pets map from a stale read, so concurrent actions overwrite each other");
  const pet = makePet("dragon");
  await world.seed({ pets: [pet], inWorld: pet.id });

  await Promise.all([world.act("FEED", pet.id), world.act("TRAIN", pet.id)]);

  const saved = await world.pet(pet.id);
  expect(saved.feed.actionTakenCount).toBe(1);
  expect(saved.train.actionTakenCount).toBe(1);
  expect(saved.experience).toBe(30);
});
