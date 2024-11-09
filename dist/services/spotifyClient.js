"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPlaylist = fetchPlaylist;
exports.fetchAlbums = fetchAlbums;
const axios_1 = __importDefault(require("axios"));
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
// Function to get the Spotify access token
async function getSpotifyToken() {
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    try {
        const response = await axios_1.default.post(tokenUrl, new URLSearchParams({
            grant_type: "client_credentials",
            client_id: `${clientId}`,
            client_secret: `${clientSecret}`,
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${credentials}`,
            },
        });
        return response.data.access_token; // Return the access token
    }
    catch (error) {
        console.error("Error getting Spotify token:", error);
        throw error;
    }
}
async function fetchPlaylist() {
    try {
        const token = await getSpotifyToken();
        const response = await axios_1.default.get("https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}
async function fetchAlbums() {
    try {
        const token = await getSpotifyToken();
        const response = await axios_1.default.get("https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}
