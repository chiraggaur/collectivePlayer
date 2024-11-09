"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upvoteSong = exports.getQueue = exports.addSongToQueue = void 0;
const prismaClient_1 = __importDefault(require("../../services/prismaClient"));
const addSongToQueue = async (req, res) => {
    const { songId } = req.body;
    const user = req.body.user; // Authenticated user object from Supabase
    if (!user) {
        res.status(401).json({ message: "User not authenticated" });
        return; // Stop execution
    }
    try {
        const queueEntry = await prismaClient_1.default.queue.create({
            data: {
                userId: user.id,
                songId,
                upvotes: 0,
            },
        });
        res.status(201).json({ message: "Song added to queue", queueEntry });
    }
    catch (error) {
        console.error("Error adding song to queue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.addSongToQueue = addSongToQueue;
// Get the list of songs in the queue, ordered by upvotes
const getQueue = async (req, res) => {
    try {
        // Fetch the queue with song details
        const queue = await prismaClient_1.default.queue.findMany({
            include: {
                Song: true, // Include song details from the Song table
            },
            orderBy: { upvotes: "desc" }, // Order by the number of upvotes
        });
        res.status(200).json({ message: "Queue fetched successfully", queue });
    }
    catch (error) {
        console.error("Error fetching queue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getQueue = getQueue;
const upvoteSong = async (req, res) => {
    const { queueId } = req.body;
    const user = req.body.user; // Authenticated user object from Supabase
    if (!user) {
        res.status(401).json({ message: "User not authenticated" });
        return; // Stop execution
    }
    try {
        const queueEntry = await prismaClient_1.default.queue.findUnique({
            where: { id: queueId },
        });
        if (!queueEntry) {
            res.status(404).json({ error: "Queue entry not found" });
            return; // Stop execution
        }
        // Increment the upvotes count for the queue entry
        const updatedQueue = await prismaClient_1.default.queue.update({
            where: { id: queueId },
            data: {
                upvotes: { increment: 1 },
            },
        });
        res.status(200).json({
            message: "Song upvoted successfully",
            queueEntry: updatedQueue,
        });
    }
    catch (error) {
        console.error("Error upvoting song:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.upvoteSong = upvoteSong;
// played at time stamp  to impliment later
// export const markSongAsPlayed = async (req: Request, res: Response) => {
//     const { queueId } = req.body;
//     try {
//       const updatedQueue = await prisma.queue.update({
//         where: { id: queueId },
//         data: {
//           playedAt: new Date(), // Set the played timestamp to the current time
//         },
//       });
//       res.status(200).json({ message: "Song marked as played", queueEntry: updatedQueue });
//     } catch (error) {
//       console.error("Error marking song as played:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };
