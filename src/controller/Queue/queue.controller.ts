// queue.controller.ts
import { Request, Response } from "express";
import prisma from "../../services/prismaClient";

export const addSongToQueue = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { songId } = req.body;
  const user = req.body.user; // Authenticated user object from Supabase

  if (!user) {
    res.status(401).json({ message: "User not authenticated" });
    return; // Stop execution
  }

  try {
    const queueEntry = await prisma.queue.create({
      data: {
        userId: user.id,
        songId,
        upvotes: 0,
      },
    });
    res.status(201).json({ message: "Song added to queue", queueEntry });
  } catch (error) {
    console.error("Error adding song to queue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get the list of songs in the queue, ordered by upvotes
export const getQueue = async (req: Request, res: Response) => {
  try {
    // Fetch the queue with song details
    const queue = await prisma.queue.findMany({
      include: {
        Song: true, // Include song details from the Song table
      },
      orderBy: { upvotes: "desc" }, // Order by the number of upvotes
    });

    res.status(200).json({ message: "Queue fetched successfully", queue });
  } catch (error) {
    console.error("Error fetching queue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const upvoteSong = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { queueId } = req.body;
  const user = req.body.user; // Authenticated user object from Supabase

  if (!user) {
    res.status(401).json({ message: "User not authenticated" });
    return; // Stop execution
  }

  try {
    const queueEntry = await prisma.queue.findUnique({
      where: { id: queueId },
    });

    if (!queueEntry) {
      res.status(404).json({ error: "Queue entry not found" });
      return; // Stop execution
    }

    // Increment the upvotes count for the queue entry
    const updatedQueue = await prisma.queue.update({
      where: { id: queueId },
      data: {
        upvotes: { increment: 1 },
      },
    });

    res.status(200).json({
      message: "Song upvoted successfully",
      queueEntry: updatedQueue,
    });
  } catch (error) {
    console.error("Error upvoting song:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
