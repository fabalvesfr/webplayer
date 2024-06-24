import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import webPlayerRoute from "./routes/webplayer"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Route is working!")
});

app.use("/webplayer", webPlayerRoute);

dotenv.config();
const port = process.env.PORT || 3001;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}.`)
})