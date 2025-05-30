import { ACTION_PARTICLE_EFFECTS } from "../constants.js";
import { Credentials } from "../types/index.js";
import { DroppedAsset, World, errorHandler } from "./index.js";

export const triggerParticleEffects = async ({
  credentials,
  petSpawnedDroppedAssetId,
  actionKey,
  option,
}: {
  credentials: Credentials;
  petSpawnedDroppedAssetId: string;
  actionKey: keyof typeof ACTION_PARTICLE_EFFECTS;
  option?: string;
}) => {
  try {
    const { urlSlug } = credentials;
    const world = World.create(urlSlug, { credentials });
    let particleEffect = ACTION_PARTICLE_EFFECTS[actionKey];
    let duration = 3;

    if (option == "leveledUp") {
      particleEffect = "medal_float";
      duration = 7;
    } else if (option == "grantExpression") {
      particleEffect = "whiteStar_burst";
      duration = 7;
    }

    if (petSpawnedDroppedAssetId) {
      const droppedAsset = await DroppedAsset.get(petSpawnedDroppedAssetId, urlSlug, {
        credentials,
      });
      world.triggerParticle({
        name: particleEffect,
        duration,
        position: {
          x: droppedAsset?.position?.x,
          y: droppedAsset?.position?.y,
        },
      });
    }
    return;
  } catch (error) {
    return errorHandler({
      error,
      functionName: "triggerParticleEffects",
      message: "Error triggering particle effects",
    });
  }
};
