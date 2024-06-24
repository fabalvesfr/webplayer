import {Request, Response} from "express"
import dotenv from "dotenv"
import { getCountriesService, getPlaylistInfoService, getPlaylistTracksService, getTokenService } from "../services/webplayer";

dotenv.config();

export async function getCountriesController(req:Request, res:Response){
    try{
        const countries = await getCountriesService();
        res.status(200).json(countries);
    }catch(error){
        console.error("getConutriesController error: ", error);
        res.status(501).json({message: "Unable to retrieve countries from country-flag-icons library."})
    }
}

export async function getTokenController(req:Request, res:Response){
    try{
        
        const token = await getTokenService();
        res.status(200).json(token);
    }catch(error){
        console.error("getTokenController error: ", error);
        res.status(501).json({message: "Unable to retrieve Spotify token."})
    }
}

export async function getPlaylistInfoController(req:Request, res:Response){
    try{
        const {country} = req.params;
        const playlistInfo = await getPlaylistInfoService(country);
        res.status(200).json(playlistInfo);
    }catch(error){
        console.error("getTokenController error: ", error);
        res.status(501).json({message: "Unable to retrieve Spotify token."})
    }
}

export async function getPlaylistTracksController(req:Request, res:Response){
    try{
        const {playlistid} = req.params;
        const playlistInfo = await getPlaylistTracksService(playlistid);
        res.status(200).json(playlistInfo);
    }catch(error){
        console.error("getTokenController error: ", error);
        res.status(501).json({message: "Unable to retrieve Spotify token."})
    }
}

export async function getCountryNamesController(req: Request,res: Response){
    try{
        res.status(200).json({message:"Spotify API data retrieval was successful!"})
    }catch(error){
        console.error(error);
        return res.status(501).json({message:"Could not source country data from Spotify API"})
    }
}