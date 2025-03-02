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

const API_KEY = "AIzaSyAq1inVZzJQyjbjBRLn16-obKkva71swEU";
const LIVE_VIDEO_ID = "cpTFHSpLNcs";

// let chatMessages = [];

let player_data = [
    {
        "player_name":"east",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"voltrux",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"uzm",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"haitdami",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"riley",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"rulz",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"sinister",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"falak",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"fury",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"delta",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"chari",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"sleepy",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"dok",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"goku",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"alex",
        "score":0,
        "player_photo":""
    },
    {
        "player_name":"blade",
        "score":0,
        "player_photo":""
    },
]

let team_data = [
    {
        "team_name":"falcons",
        "score":423,
        "team_logo":"C:/PUBG LOGO/FALCON FORCE.png",
    },
    {
        "team_name":"141",
        "score":1247,
        "team_logo":"C:/PUBG LOGO/141.png",
    },
    {
        "team_name":"asi8",
        "score":4347,
        "team_logo":"C:/PUBG LOGO/AS i8 Esports.png",
    },
    {
        "team_name":"leo",
        "score":3300,
        "team_logo":"C:/PUBG LOGO/LEO ESPORTS.png",
    },
    {
        "team_name":"ste",
        "score":327,
        "team_logo":"C:/PUBG LOGO/STE.png",
    },
    {
        "team_name":"t2k",
        "score":3927,
        "team_logo":"C:/PUBG LOGO/T2K ESPORTS.png",
    },
    {
        "team_name":"a1",
        "score":6008,
        "team_logo":"C:/PUBG LOGO/A1 AERO.PNG",
    },
    {
        "team_name":"4t",
        "score":5102,
        "team_logo":"C:/PUBG LOGO/4THRIVES.png",
    },
    {
        "team_name":"star",
        "score":325,
        "team_logo":"C:/PUBG LOGO/TEAM STAR x RD.png",
    },
    {
        "team_name":"drs",
        "score":10102,
        "team_logo":"C:/PUBG LOGO/DRS.PNG",
    },
    {
        "team_name":"asl",
        "score":3542,
        "team_logo":"C:/PUBG LOGO/ABRUPT SLAYERS.png",
    },
    {
        "team_name":"horaa",
        "score":11342,
        "team_logo":"C:/PUBG LOGO/HORAA ESPORTS.png",
    },
    {
        "team_name":"4mv",
        "score":636,
        "team_logo":"C:/PUBG LOGO/4Merical Vibes.png",
    },
    {
        "team_name":"7e",
        "score":314,
        "team_logo":"C:/PUBG LOGO/Seventh Element.png",
    },
    {
        "team_name":"ihc",
        "score":157,
        "team_logo":"C:/PUBG LOGO/IHC esports.png",
    },
    {
        "team_name":"r3g",
        "score":826,
        "team_logo":"C:/PUBG LOGO/THE R3GICIDE.png",
    },
];



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

            // Avoid duplicate messages
            if (!chatMessages.some(msg => msg.timestamp === messageData.timestamp)) {
                chatMessages.push(messageData);
                console.log("New message:", messageData);
                let newMsg = messageData.message.toLowerCase();
                // for(let key in hashTag){
                //     if(newMsg.includes(`#${key}`)){
                //         hashTag[key]+=1;
                //     }
                // }
                // for(let item of team_hashtags){
                //     if(newMsg.includes(`#${item.team_name}`)){
                //         item.score+=1;
                //     }
                // }
                for(let i=0; i<team_data.length; i++){
                    if(newMsg.includes(`#${team_data[i].team_name}`)){
                        team_data[i].score+=1;
                    }
                }
                for(let i=0; i<player_data.length; i++){
                    if(newMsg.includes(`#${player_data[i].player_name}`)){
                        player_data[i].score+=1;
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching chat messages:", error.response?.data || error.message);
    }
}

// API Route to get stored messages
app.get("/team-chats", (req, res) => {
    team_data.sort((a,b)=> b.score-a.score);
    res.json(team_data);
});

app.get("/player-chats", (req, res)=>{
    player_data.sort((a,b)=> b.score - a.score);
    res.json(player_data)
})

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
    // await startFetching();
});