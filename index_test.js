// //initializing and configure dotenv secret fiel.
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import axios from "axios";

// //Static files
const PORT=process.env.PORT

// //Express app initialization
const app = express();

// //middleware for accepting json
app.use(express.json());

// //listening the port and starting the app
// app.listen(PORT, ()=>{
//     console.log(`Server started on PORT:${PORT}`);
// });



const API_KEY = "AIzaSyCoL4zmj1TCBh-XaNAG1eCSoZbMfBA1oLM";
const LIVE_VIDEO_ID = "rK2p4dFniQo";
let chatMessages = {
    "falcons":0,
    "141":0,
    "asi8":0,
    "leo":0,
    "ste":0,
    "t2k":0,
    "a1":0,
    "4t":0,
    "star":0,
    "drs":0,
    "asl":0,
    "horaa":0,
    "4mv":0,
    "7e":0,
    "ihc":0,
    "r3g":0,
    "east":0,
    "voltrux":0,
    "uzm":0,
    "haitdami":0,
    "riley":0,
    "rulz":0,
    "sinister":0,
    "falak":0,
    "fury":0,
    "delta":0,
    "chari":0,
    "sleepy":0,
    "dok":0,
    "goku":0,
    "alex":0,
    "blade":0,
};


async function getLiveChatId(videoId) {
    try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
            params: {
                part: "liveStreamingDetails",
                id: videoId,
                key: API_KEY,
            },
        });

        const liveChatId = response.data.items[0]?.liveStreamingDetails?.activeLiveChatId;
        return liveChatId;
    } catch (error) {
        console.error("Error getting live chat ID:", error.response?.data || error.message);
        return null;
    }
}

async function fetchLiveChatMessages(liveChatId) {
    try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/liveChat/messages", {
            params: {
                part: "snippet,authorDetails",
                liveChatId: liveChatId,
                key: API_KEY,
            },
        });


        // console.log(response);

        // const messages = response.data.items.map((item) => ({
        //     id: item.id,
        //     author: item.authorDetails.displayName,
        //     message: item.snippet.displayMessage,
        //     timestamp: item.snippet.publishedAt,
        // }));
        // console.log(messages);

    

        // for(let key in chatMessages){
        //     if(msg.includes(`#${key}`)){
        //         chatMessages[key]+=1;
        //     }
        // }


        // chatMessages = messages;
    } catch (error) {
        console.error("Error fetching live chat messages:", error.response?.data || error.message);
    }
}

async function startFetching() {
    const liveChatId = await getLiveChatId(LIVE_VIDEO_ID);
    if (!liveChatId) {
        console.error("Live chat ID not found.");
        return;
    }

    console.log("Fetching chat messages...");

    setInterval(() => {
        fetchLiveChatMessages(liveChatId);
    }, 10000); // Fetch messages every 5 seconds
}

console.log(chatMessages)

app.get("/chat", (req, res) => {
    res.json({ hashtags: chatMessages });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    startFetching();
});