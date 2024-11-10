"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewSong = exports.songsAlbum = exports.songsPlaylist = void 0;
const prismaClient_1 = __importDefault(require("../../services/prismaClient"));
const spotifyClient_1 = require("../../services/spotifyClient");
const songsPlaylist = async (req, res) => {
    const spotifyData = await (0, spotifyClient_1.fetchPlaylist)();
    res.status(200).json({ playlist: spotifyData });
};
exports.songsPlaylist = songsPlaylist;
const songsAlbum = async (req, res) => {
    const spotifyData = await (0, spotifyClient_1.fetchAlbums)();
    res.status(200).json({ playlist: spotifyData });
};
exports.songsAlbum = songsAlbum;
const addNewSong = async (req, res) => {
    const { title, artist, poster, genre } = req.body;
    try {
        // Check if the song already exists by title and artist
        const existingSong = await prismaClient_1.default.song.findFirst({
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
        const newSong = await prismaClient_1.default.song.create({
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
    }
    catch (error) {
        console.error("Error adding new song:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.addNewSong = addNewSong;
