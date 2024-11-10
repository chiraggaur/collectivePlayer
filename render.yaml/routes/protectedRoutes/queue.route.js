"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/queue.ts
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const queue_controller_1 = require("../../controller/Queue/queue.controller");
const router = (0, express_1.default)();
// Protect these routes using the authenticateUser middleware
router.post("/queue", authMiddleware_1.authenticateUser, queue_controller_1.addSongToQueue);
router.post("/queue/upvote", authMiddleware_1.authenticateUser, queue_controller_1.upvoteSong);
router.get("/", authMiddleware_1.authenticateUser, queue_controller_1.getQueue);
exports.default = router;
