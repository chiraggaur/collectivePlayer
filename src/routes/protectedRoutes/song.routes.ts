import Router from "express";
import {
  songsPlaylist,
  songsAlbum,
  addNewSong,
} from "../../controller/Songs/songs.controller";

const router = Router();

router.get("/spotifyPlalists", songsPlaylist);
router.get("/spotifyAlbums", songsAlbum);

// user selected song routes
//@ts-ignore
router.post("/addSong", addNewSong);

export default router;
