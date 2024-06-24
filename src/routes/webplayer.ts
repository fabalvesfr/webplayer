import Router from "express";
import { getCountriesController, getPlaylistInfoController, getPlaylistTracksController, getTokenController } from "../controllers/webplayer";

const router = Router();

router.post("/gettoken", getTokenController);

router.get("/getcountries", getCountriesController);
router.get("/getplaylistinfo/:country", getPlaylistInfoController);
router.get("/getplaylisttracks/:playlistid", getPlaylistTracksController);

export default router