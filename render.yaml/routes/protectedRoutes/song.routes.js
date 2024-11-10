"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const songs_controller_1 = require("../../controller/Songs/songs.controller");
const router = (0, express_1.default)();
router.get("/spotifyPlalists", songs_controller_1.songsPlaylist);
router.get("/spotifyAlbums", songs_controller_1.songsAlbum);
// user selected song routes
//@ts-ignore
router.post("/addSong", songs_controller_1.addNewSong);
exports.default = router;
