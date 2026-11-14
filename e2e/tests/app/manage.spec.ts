// Managing pets: renaming, colors, picking up, calling a different pet and putting one up for adoption.
import { Page } from "@playwright/test";
import { KEY_ASSET_ID, expect, makePet, test } from "../../fixtures";

const colorSwatches = (page: Page) => page.locator(".grid-cols-4.gap-2 > .tooltip > .card");

test("renaming the pet saves the new name without awarding Fresh Look", async ({ page, world }) => {
  const pet = makePet("dragon", { name: "Max" });
  await world.seed({ pets: [pet], inWorld: pet.id });
  await page.goto(world.url("/"));

  await expect(page.getByRole("button", { name: "Put Up for Adoption" })).toBeVisible();
  await page.getByRole("combobox").selectOption("Rex");
  await page.getByRole("button", { name: "Save Changes" }).click();

  await expect(page.getByRole("button", { name: "Put Up for Adoption" })).toBeVisible();
  expect(await world.pet(pet.id)).toMatchObject({ name: "Rex", color: 0 });
  expect(await world.badges()).toEqual([]);
  expect(await world.events("create-npc")).toEqual([]);
  expect((await world.events("analytics")).map((a) => a.analyticName)).toEqual(["updates"]);
});

test("a new color unlocked by level re-dresses the pet in the world and awards Fresh Look", async ({ page, world }) => {
  // Colors unlock at levels 2, 3 and 4 (client/src/constants.ts petColors).
  const pet = makePet("penguin", { experience: 150 });
  await world.seed({ pets: [pet], inWorld: pet.id });
  await page.goto(world.url("/"));

  await expect(page.getByRole("heading", { name: "Level 2" })).toBeVisible();
  await colorSwatches(page).nth(1).click();
  await expect(colorSwatches(page).nth(1)).toHaveClass(/success/);
  await page.getByRole("button", { name: "Save Changes" }).click();

  await expect(page.getByRole("button", { name: "Put Up for Adoption" })).toBeVisible();
  expect((await world.pet(pet.id)).color).toBe(1);
  expect(await world.npc()).toBe("penguin:baby:1");
  expect(await world.badges()).toEqual(["Fresh Look"]);
});

test("colors above the pet's level can't be picked in the drawer", async ({ page, world }) => {
  const pet = makePet("dragon", { experience: 150 });
  await world.seed({ pets: [pet], inWorld: pet.id });
  await page.goto(world.url("/"));

  await expect(page.getByRole("heading", { name: "Level 2" })).toBeVisible();
  await colorSwatches(page).nth(3).click({ force: true });

  await expect(colorSwatches(page).nth(0)).toHaveClass(/success/);
  await expect(colorSwatches(page).nth(3)).not.toHaveClass(/success/);
  await expect(page.getByRole("button", { name: "Save Changes" })).toHaveCount(0);
  await expect(colorSwatches(page).nth(3)).toContainText("Level up to unlock new colors");
});

test("the server refuses a color the pet hasn't unlocked", async ({ request, world }) => {
  test.fail(true, "EXP-440: update-pet doesn't check the color against the pet's level");
  const pet = makePet("dragon");
  await world.seed({ pets: [pet], inWorld: pet.id });

  const response = await request.post(world.api("/update-pet"), {
    data: { selectedPetId: pet.id, selectedName: pet.name, selectedColor: 3, keyAssetId: KEY_ASSET_ID },
  });

  expect(response.ok()).toBe(false);
  expect((await world.pet(pet.id)).color).toBe(0);
  expect(await world.npc()).toBe("dragon:baby:0");
  expect(await world.badges()).toEqual([]);
});

test("recoloring a pet that isn't in the world doesn't swap out the one that is", async ({ request, world }) => {
  test.fail(true, "EXP-440: update-pet and level-ups spawn the edited pet whenever any pet is in the world");
  const max = makePet("dragon", { name: "Max" });
  const pip = makePet("penguin", { name: "Pip", experience: 150 });
  await world.seed({ pets: [max, pip], inWorld: max.id });

  const response = await request.post(world.api("/update-pet"), {
    data: { selectedPetId: pip.id, selectedName: "Pip", selectedColor: 1, keyAssetId: KEY_ASSET_ID },
  });

  expect(response.ok()).toBe(true);
  expect((await world.pet(pip.id)).color).toBe(1);
  expect(await world.npc()).toBe("dragon:baby:0");
});

test("levelling up a pet that isn't in the world doesn't swap out the one that is", async ({ world }) => {
  test.fail(true, "EXP-440: update-pet and level-ups spawn the edited pet whenever any pet is in the world");
  const max = makePet("dragon", { name: "Max" });
  const pip = makePet("penguin", { name: "Pip", experience: 995 });
  await world.seed({ pets: [max, pip], inWorld: max.id });

  expect((await world.act("FEED", pip.id)).ok()).toBe(true);

  expect((await world.pet(pip.id)).petAge).toBe("teen");
  expect(await world.npc()).toBe("dragon:baby:0");
});

test("picking up the pet removes it from the world but keeps it", async ({ page, world }) => {
  const pet = makePet("cat", { name: "Coco", experience: 120 });
  await world.seed({ pets: [pet], inWorld: pet.id });
  await page.goto(world.url("/"));

  await page.getByRole("button", { name: "Pick up Pet" }).click();

  await expect(page.getByRole("button", { name: "Call Pet", exact: true })).toBeVisible();
  expect(await world.npc()).toBeNull();
  expect(await world.events("delete-npc")).toHaveLength(1);
  expect(await world.pet(pet.id)).toMatchObject({ name: "Coco", experience: 120 });
});

test("calling another pet sends the first one away", async ({ request, world }) => {
  const max = makePet("dragon", { name: "Max" });
  const pip = makePet("penguin", { name: "Pip" });
  await world.seed({ pets: [max, pip], inWorld: max.id });

  const response = await request.post(world.api("/spawn-pet"), { data: { selectedPetId: pip.id, keyAssetId: KEY_ASSET_ID } });
  expect(response.ok()).toBe(true);
  expect(await world.npc()).toBe("penguin:baby:0");

  const state = await (await request.get(world.api("/game-state"))).json();
  expect(state.selectedPetId).toBe(pip.id);
  expect(state.pets[max.id].isPetInWorld).toBe(false);
  expect(state.pets[pip.id].isPetInWorld).toBe(true);
});

test("putting the only pet up for adoption removes it and returns to the adoption screen", async ({ page, world }) => {
  const pet = makePet("dragon", { name: "Max" });
  await world.seed({ pets: [pet], inWorld: pet.id });
  await page.goto(world.url("/"));

  await page.getByRole("button", { name: "Put Up for Adoption" }).click();
  await expect(page.getByRole("heading", { name: "Put Up for Adoption?" })).toBeVisible();
  await page.getByRole("button", { name: "Yes" }).click();

  await expect(page.getByRole("heading", { name: "Choose Your Virtual Pet" })).toBeVisible();
  expect(await world.pets()).toEqual({});
  expect(await world.npc()).toBeNull();
  expect((await world.events("analytics")).map((a) => a.analyticName)).toEqual(["trades"]);
});

test("putting up a pet that isn't in the world leaves the one that is", async ({ request, world }) => {
  const max = makePet("dragon", { name: "Max" });
  const pip = makePet("penguin", { name: "Pip" });
  await world.seed({ pets: [max, pip], inWorld: max.id });

  const response = await request.post(world.api("/trade-pet"), { data: { selectedPetId: pip.id, keyAssetId: KEY_ASSET_ID } });

  expect(response.ok()).toBe(true);
  expect(Object.keys(await world.pets())).toEqual([max.id]);
  expect(await world.npc()).toBe("dragon:baby:0");
});

test("with two look-alike pets, only the one called is shown as in the world", async ({ request, world }) => {
  test.fail(true, "EXP-440: the in-world pet is matched by species, age and color, not by pet");
  const max = makePet("dragon", { name: "Max" });
  const rex = makePet("dragon", { name: "Rex" });
  await world.seed({ pets: [max, rex], inWorld: max.id });

  const state = await (await request.get(world.api("/game-state"))).json();

  expect(state.selectedPetId).toBe(max.id);
  expect(state.pets[max.id].isPetInWorld).toBe(true);
  expect(state.pets[rex.id].isPetInWorld).toBe(false);
});
