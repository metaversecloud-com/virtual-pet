import {
  getVisitor,
  deleteAll,
  spawn,
  pickup,
  get,
  create,
  action,
} from "./utils/index.js";
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

router.get("/visitor", getVisitor);

// Pet related routes
router.get("/pet", get);
router.post("/pet", create);
router.post("/pet/spawn", spawn);
router.post("/pet/pickup", pickup);
router.post("/pet/action", action);
router.delete("/pet", deleteAll);

export default router;
