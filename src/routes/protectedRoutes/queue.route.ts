// routes/queue.ts
import Router from "express";
import { authenticateUser } from "../../middlewares/authMiddleware";
import {
  addSongToQueue,
  upvoteSong,
  getQueue,
} from "../../controller/Queue/queue.controller";

const router = Router();

// Protect these routes using the authenticateUser middleware
router.post("/queue", authenticateUser, addSongToQueue);
router.post("/queue/upvote", authenticateUser, upvoteSong);
router.get("/", authenticateUser, getQueue);

export default router;
