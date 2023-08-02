import {
  getVisitor,
  processTextWithAI,
  deleteAll,
  spawn,
  pickup,
  get,
  create,
  chatWithPet,
  action,
} from "./utils/index.js";
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

router.get("/visitor", getVisitor);
router.post("/assistant", processTextWithAI);

// Pet related routes
router.get("/pet", get);
router.post("/pet", create);
router.post("/pet/spawn", spawn);
router.post("/pet/pickup", pickup);
router.post("/pet/action", action);
router.delete("/pet", deleteAll);
router.post("/pet/chat", chatWithPet);

export default router;
