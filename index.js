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

const API_KEY = "AIzaSyANoeQcBUQYhF_3Zx0XT2DlYqr4FI-Shhk";
const LIVE_VIDEO_ID = "9ElsF45ejUg";

let chatMessages = [];

let hashTag = {
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

// Function to get Live Chat ID
async function getLiveChatId() {
    try {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${LIVE_VIDEO_ID}&key=${API_KEY}`;
        const response = await axios.get(url);
        return response.data.items[0]?.liveStreamingDetails?.activeLiveChatId || null;
    } catch (error) {
        console.error("Error fetching Live Chat ID:", error.response?.data || error.message);
        return null;
    }
}

// Function to fetch and store new chat messages
async function fetchLiveChatMessages(liveChatId) {
    try {
        const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${API_KEY}`;
        const response = await axios.get(url);

        response.data.items.forEach(item => {
            const messageData = {
                author: item.authorDetails.displayName,
                message: item.snippet.displayMessage,
                timestamp: item.snippet.publishedAt
            };
            // console.log(messageData);

            // Avoid duplicate messages
            if (!chatMessages.some(msg => msg.timestamp === messageData.timestamp)) {
                chatMessages.push(messageData);
                console.log("New message:", messageData);
                let newMsg = messageData.message;
                for(let key in hashTag){
                    if(newMsg.includes(`#${key}`)){
                        hashTag[key]+=1;
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching chat messages:", error.response?.data || error.message);
    }
}

console.log(chatMessages)

// API Route to get stored messages
app.get("/chats", (req, res) => {
    res.json(hashTag);
});

// Start fetching messages every 3 seconds
async function startFetching() {
    const liveChatId = await getLiveChatId();
    if (liveChatId) {
        console.log("Live Chat ID:", liveChatId);
        setInterval(() => fetchLiveChatMessages(liveChatId), 3000);
    } else {
        console.log("No active live chat found.");
    }
}

// Start server and fetching
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await startFetching();
});