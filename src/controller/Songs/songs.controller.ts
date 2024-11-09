import { Request, Response } from "express";
import prisma from "../../services/prismaClient";
import { fetchAlbums, fetchPlaylist } from "../../services/spotifyClient";

export const songsPlaylist = async (req: Request, res: Response) => {
  const spotifyData = await fetchPlaylist();
  res.status(200).json({ playlist: spotifyData });
};

export const songsAlbum = async (req: Request, res: Response) => {
  const spotifyData = await fetchAlbums();
  res.status(200).json({ playlist: spotifyData });
};

export const addNewSong = async (req: Request, res: Response) => {
  const { title, artist, poster, genre } = req.body;

  try {
    // Check if the song already exists by title and artist
    const existingSong = await prisma.song.findFirst({
      where: {
        title,
        artist,
      },
    });

    if (existingSong) {
      // If the song already exists, return a conflict response
      return res.status(409).json({
        message: "Song already exists in the database",
        song: existingSong,
      });
    }

    // Create a new song entry with optional poster and genre
    const newSong = await prisma.song.create({
      data: {
        title,
        artist,
        genre: genre || null, // Explicitly setting optional values
        poster: poster || null, // Explicitly setting optional values
      },
    });

    return res.status(201).json({
      message: "Song added to the database successfully",
      song: newSong,
    });
  } catch (error) {
    console.error("Error adding new song:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
