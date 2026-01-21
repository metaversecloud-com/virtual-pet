import express from "express";
import {
  handleCreatePet,
  handleExecuteAction,
  handleGetGameState,
  handleGetKeyAsset,
  handleGetPet,
  handlePickupPet,
  handleRemoveAllPets,
  handleSpawnPet,
  handleTradePet,
  handleUpdatePet,
} from "./controllers/index.js";
import { getVersion } from "./utils/getVersion.js";

const router = express.Router();
const SERVER_START_DATE = new Date();

router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

router.get("/system/health", (req, res) => {
  return res.json({
    appVersion: getVersion(),
    status: "OK",
    serverStartDate: SERVER_START_DATE,
    envs: {
      NODE_ENV: process.env.NODE_ENV,
      INSTANCE_DOMAIN: process.env.INSTANCE_DOMAIN,
      INTERACTIVE_KEY: process.env.INTERACTIVE_KEY,
      S3_BUCKET: process.env.S3_BUCKET,
    },
  });
});

router.get("/key-asset", handleGetKeyAsset);
router.get("/game-state", handleGetGameState);
router.get("/pet", handleGetPet);
router.post("/create-pet", handleCreatePet);
router.post("/update-pet", handleUpdatePet);
router.post("/trade-pet", handleTradePet);
router.post("/spawn-pet", handleSpawnPet);
router.post("/pickup-pet", handlePickupPet);
router.post("/execute-action", handleExecuteAction);
router.post("/remove-dropped-assets", handleRemoveAllPets);

export default router;
