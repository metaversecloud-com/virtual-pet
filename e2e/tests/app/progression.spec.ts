// Levels, ages, the emote unlock, progress badges and care streaks.
import { ACTIONS, Action, DAY, expect, makePet, minutesAgo, test } from "../../fixtures";

test("reaching level 5 makes the pet a teen and unlocks its emote", async ({ world }) => {
  const pet = makePet("unicorn", { experience: 995 });
  await world.seed({ pets: [pet], inWorld: pet.id });

  expect((await world.act("FEED", pet.id)).ok()).toBe(true);

  expect(await world.pet(pet.id)).toMatchObject({
    experience: 1015,
    currentLevel: 5,
    petAge: "teen",
    experienceNeededForNextLevel: 1500,
    experienceNeededForTheLevelYouCurrentlyAchieved: 1000,
  });
  expect(await world.npc()).toBe("unicorn:teen:0");
  await expect.poll(() => world.expressions()).toEqual(["pet_unicorn"]);
  await expect.poll(async () => (await world.events("fire-toast")).map((t) => t.title)).toContain("🔎 New Emote Unlocked");
  await expect.poll(() => world.particles()).toEqual(expect.arrayContaining(["redHeart_float", "medal_float", "whiteStar_burst"]));
  expect(await world.badges()).toEqual(["Growing up Fast"]);
});

test("a player who already unlocked the emote is told so when another pet becomes a teen", async ({ world }) => {
  const pet = makePet("dragon", { experience: 995 });
  await world.seed({ pets: [pet], inWorld: pet.id, expressions: ["pet_dragon"], badges: ["Growing up Fast"] });

  expect((await world.act("FEED", pet.id)).ok()).toBe(true);

  await expect
    .poll(async () => (await world.events("fire-toast")).map((t) => t.text))
    .toContain("You've already collected this reward. Trade in your pet to start over and collect a new emote!");
  expect(await world.events("grant-expression")).toEqual([]);
  expect(await world.badges()).toEqual(["Growing up Fast"]);
});

test("reaching level 10 makes the pet an adult", async ({ world }) => {
  // Level 10 runs from 4,500 to 5,500 XP.
  const pet = makePet("cat", { experience: 4495 });
  await world.seed({ pets: [pet], inWorld: pet.id, expressions: ["pet_cat"] });

  expect((await world.act("FEED", pet.id)).ok()).toBe(true);

  expect(await world.pet(pet.id)).toMatchObject({ experience: 4515, currentLevel: 10, petAge: "adult" });
  expect(await world.npc()).toBe("cat:adult:0");
  expect(await world.badges()).toEqual(["All Grown Up"]);
  expect(await world.events("grant-expression")).toEqual([]);
});

test("reaching level 15 awards Veteran Caretaker", async ({ world }) => {
  const pet = makePet("dog", { experience: 10495 });
  await world.seed({ pets: [pet], inWorld: pet.id });

  expect((await world.act("FEED", pet.id)).ok()).toBe(true);

  expect((await world.pet(pet.id)).currentLevel).toBe(15);
  expect(await world.badges()).toEqual(["Veteran Caretaker"]);
});

test("a pet past the last XP tier keeps sensible XP bounds", async ({ world }) => {
  test.fail(true, "EXP-440: past the last XP tier getLevelAndAge returns level numbers as the XP bounds");
  // The last tier in getLevelAndAge starts at 46,500 XP and ends at 49,600.
  const pet = makePet("dragon", { experience: 46490, currentLevel: 30, petAge: "adult" });
  await world.seed({ pets: [pet], inWorld: pet.id });

  expect((await world.act("FEED", pet.id)).ok()).toBe(true);

  const saved = await world.pet(pet.id);
  expect(saved.experience).toBe(46510);
  expect(saved.experienceNeededForTheLevelYouCurrentlyAchieved).toBeGreaterThanOrEqual(43500);
  expect(saved.experienceNeededForTheLevelYouCurrentlyAchieved).toBeLessThanOrEqual(saved.experience);
  expect(saved.experienceNeededForNextLevel).toBeGreaterThan(saved.experience);
});

for (const action of Object.keys(ACTIONS) as Action[]) {
  test(`the 15th ${action} awards ${ACTIONS[action].badge}`, async ({ world }) => {
    const pet = makePet("dragon", { [action.toLowerCase()]: { timestamp: minutesAgo(24 * 60), actionTakenCount: 14 } });
    await world.seed({ pets: [pet], inWorld: pet.id });

    expect((await world.act(action, pet.id)).ok()).toBe(true);

    expect((await world.pet(pet.id))[action.toLowerCase()].actionTakenCount).toBe(15);
    expect(await world.badges()).toEqual([ACTIONS[action].badge]);
  });
}

test("caring for a pet adopted over 30 days ago awards Loyal Friend", async ({ world }) => {
  const young = makePet("dragon", { createdDate: Date.now() - 29 * DAY });
  const old = makePet("dog", { createdDate: Date.now() - 31 * DAY });
  await world.seed({ pets: [young, old], inWorld: young.id });

  await world.act("FEED", young.id);
  expect(await world.badges()).toEqual([]);

  await world.act("FEED", old.id);
  expect(await world.badges()).toEqual(["Loyal Friend"]);
});

test("the drawer shows the pet's level and progress to the next one", async ({ page, world }) => {
  // Level 3 runs from 300 to 600 XP.
  const pet = makePet("dragon", { experience: 450 });
  await world.seed({ pets: [pet], inWorld: pet.id });
  await page.goto(world.url("/"));

  await expect(page.getByRole("heading", { name: "Level 3" })).toBeVisible();
  await expect(page.locator(".rounded-full.bg-gray-800")).toHaveAttribute("style", "width: 50%;");
});

test("the Badges tab shows the badges the player has earned", async ({ page, world }) => {
  test.fail(true, "EXP-440: SelectPet looks badges up in the wrong object, so every badge shows as not earned");
  await world.seed({ pets: [makePet("dragon")], badges: ["Baby Steps"] });
  await page.goto(world.url("/"));

  await page.getByRole("button", { name: "Badges" }).click();

  await expect(page.getByRole("img", { name: "Fresh Look" })).toHaveCSS("filter", "grayscale(1)");
  await expect(page.getByRole("img", { name: "Baby Steps" })).toHaveCSS("filter", "none");
});

// Streaks count consecutive days with an interaction (server/controllers/handleExecuteAction.ts). The
// app runs in UTC (playwright.config.ts), so "yesterday" is the previous UTC calendar day.
test.describe("streaks", () => {
  const yesterday = () => new Date(Date.now() - DAY).toISOString();
  const isFirstOfMonth = new Date().getUTCDate() === 1;
  const MONTH_BOUNDARY = "EXP-440: streaks compare day-of-month only, so yesterday doesn't count on the 1st";

  test("caring for the pet the day after extends the streak", async ({ world }) => {
    test.fail(isFirstOfMonth, MONTH_BOUNDARY);
    const pet = makePet("dragon", { lastInteractionDate: yesterday(), currentStreak: 2, longestStreak: 5 });
    await world.seed({ pets: [pet], inWorld: pet.id });

    await world.act("FEED", pet.id);

    expect(await world.pet(pet.id)).toMatchObject({ currentStreak: 3, longestStreak: 5 });
  });

  test("a new best streak is recorded as the longest", async ({ world }) => {
    test.fail(true, "EXP-440: longestStreak is set to the streak before the increment");
    const pet = makePet("dragon", { lastInteractionDate: yesterday(), currentStreak: 3, longestStreak: 3 });
    await world.seed({ pets: [pet], inWorld: pet.id });

    await world.act("FEED", pet.id);

    expect(await world.pet(pet.id)).toMatchObject({ currentStreak: 4, longestStreak: 4 });
  });

  test("a seven day streak awards Consistent Care", async ({ world }) => {
    test.fail(isFirstOfMonth, MONTH_BOUNDARY);
    const pet = makePet("dragon", { lastInteractionDate: yesterday(), currentStreak: 6, longestStreak: 6 });
    await world.seed({ pets: [pet], inWorld: pet.id });

    await world.act("FEED", pet.id);

    expect((await world.pet(pet.id)).currentStreak).toBe(7);
    expect(await world.badges()).toEqual(["Consistent Care"]);
  });

  test("missing a day ends the streak", async ({ world }) => {
    test.fail(true, "EXP-440: the streak is never reset after a missed day");
    const pet = makePet("dragon", {
      lastInteractionDate: new Date(Date.now() - 3 * DAY).toISOString(),
      currentStreak: 6,
      longestStreak: 6,
    });
    await world.seed({ pets: [pet], inWorld: pet.id });

    await world.act("FEED", pet.id);

    const saved = await world.pet(pet.id);
    expect(saved.currentStreak).toBeLessThanOrEqual(1);
    expect(saved.longestStreak).toBe(6);
    expect(await world.badges()).toEqual([]);
  });

  test("an interaction a month ago on the previous day of the month isn't a streak", async ({ world }) => {
    test.skip(isFirstOfMonth, "no earlier day of the month exists on the 1st");
    test.fail(true, "EXP-440: streaks compare day-of-month only, ignoring month and year");
    // The latest moment at least four weeks ago whose UTC day of the month is one less than today's.
    const target = new Date().getUTCDate() - 1;
    let lastInteraction = new Date(Date.now() - 28 * DAY);
    while (lastInteraction.getUTCDate() !== target) lastInteraction = new Date(lastInteraction.getTime() - DAY);
    const pet = makePet("dragon", { lastInteractionDate: lastInteraction.toISOString(), currentStreak: 6, longestStreak: 6 });
    await world.seed({ pets: [pet], inWorld: pet.id });

    await world.act("FEED", pet.id);

    expect((await world.pet(pet.id)).currentStreak).toBeLessThanOrEqual(1);
    expect(await world.badges()).toEqual([]);
  });
});
