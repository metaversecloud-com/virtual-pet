// Players can only touch their own pets: every route reads the caller's own visitor data object.
import { KEY_ASSET_ID, OtherVisitor, expect, makePet, test } from "../../fixtures";

const otherPet = makePet("unicorn", { name: "Sparkle", experience: 300 });
const other: OtherVisitor = {
  visitorId: 77,
  profileId: "profile-other",
  displayName: "Other Player",
  pets: [otherPet],
  inWorld: otherPet.id,
};

test("a player can't care for another player's pet", async ({ world }) => {
  const mine = makePet("dragon");
  await world.seed({ pets: [mine], inWorld: mine.id, otherVisitors: [other] });

  const response = await world.act("FEED", otherPet.id);

  expect(response.ok()).toBe(false);
  expect(await world.pet(otherPet.id, other.visitorId)).toEqual(otherPet);
  expect(await world.pets()).toEqual({ [mine.id]: mine });
  expect(await world.particles()).toEqual([]);
});

test("a player can't rename, recolor, call or give away another player's pet", async ({ request, world }) => {
  const mine = makePet("dragon");
  await world.seed({ pets: [mine], otherVisitors: [other] });

  const calls = [
    request.post(world.api("/update-pet"), {
      data: { selectedPetId: otherPet.id, selectedName: "Stolen", selectedColor: 1, keyAssetId: KEY_ASSET_ID },
    }),
    request.post(world.api("/spawn-pet"), { data: { selectedPetId: otherPet.id, keyAssetId: KEY_ASSET_ID } }),
    request.post(world.api("/trade-pet"), { data: { selectedPetId: otherPet.id, keyAssetId: KEY_ASSET_ID } }),
  ];
  for (const response of await Promise.all(calls)) expect(response.ok()).toBe(false);

  expect(await world.pet(otherPet.id, other.visitorId)).toEqual(otherPet);
  expect(await world.npc(other.visitorId)).toBe("unicorn:baby:0");
  expect(await world.npc()).toBeNull();
});

test("picking up only removes the caller's own pet", async ({ request, world }) => {
  const mine = makePet("dragon");
  await world.seed({ pets: [mine], inWorld: mine.id, otherVisitors: [other] });

  expect((await request.post(world.api("/pickup-pet"))).ok()).toBe(true);

  expect(await world.npc()).toBeNull();
  expect(await world.npc(other.visitorId)).toBe("unicorn:baby:0");
});

test("the drawer and the pet card only return the caller's own pets", async ({ request, world }) => {
  const mine = makePet("dragon");
  await world.seed({ pets: [mine], otherVisitors: [other] });

  const state = await (await request.get(world.api("/game-state"))).json();
  expect(Object.keys(state.pets)).toEqual([mine.id]);

  const card = await (await request.get(world.api("/pet"))).json();
  expect(Object.keys(card.pets)).toEqual([mine.id]);
  expect(card.isPetOwner).toBe(true);

  const theirs = await (await request.get(world.api("/game-state", world.as(other)))).json();
  expect(Object.keys(theirs.pets)).toEqual([otherPet.id]);
  expect(theirs.selectedPetId).toBe(otherPet.id);
});

test("opened without session credentials, the drawer shows an error", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".text-error")).toContainText("Error");
});
