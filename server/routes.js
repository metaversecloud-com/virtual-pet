import {
  getVisitor,
  deleteAll,
  spawn,
  pickup,
  get,
  create,
  update,
  action,
} from "./utils/index.js";
import express from "express";
import { validationMiddleware } from "./middleware/validation.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

router.get("/visitor", getVisitor);

// Pet related routes
router.get("/pet", validationMiddleware, get);
router.post("/pet", validationMiddleware, create);
router.put("/pet", validationMiddleware, update);
router.post("/pet/spawn", validationMiddleware, spawn);
router.post("/pet/pickup", validationMiddleware, pickup);
router.post("/pet/action", validationMiddleware, action);
router.delete("/pet", validationMiddleware, deleteAll);

export default router;
