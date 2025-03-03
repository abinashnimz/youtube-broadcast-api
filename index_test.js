const axios = require('axios');

const API_KEY = 'YOUR_API_KEY'; // Replace with your API key
const LIVE_CHAT_ID = 'YOUR_LIVE_CHAT_ID'; // Replace with your live chat ID
const BASE_URL = 'https://www.googleapis.com/youtube/v3/liveChat/messages';

let nextPageToken = ''; // Stores the nextPageToken for incremental fetching

async function getLiveChatMessages() {
    try {
        const params = {
            liveChatId: LIVE_CHAT_ID,
            part: 'snippet,authorDetails',
            key: API_KEY,
            pageToken: nextPageToken,
        };

        const response = await axios.get(BASE_URL, { params });
        const data = response.data;

        // Extract messages
        if (data.items.length > 0) {
            for (const item of data.items) {
                console.log(`[${item.authorDetails.displayName}]: ${item.snippet.displayMessage}`);
            }
        }

        // Update nextPageToken for subsequent requests
        nextPageToken = data.nextPageToken || nextPageToken;

        // Use the recommended polling interval to avoid unnecessary API calls
        const delay = data.pollingIntervalMillis || 5000; // Default to 5 seconds if not provided

        setTimeout(getLiveChatMessages, delay);
    } catch (error) {
        console.error('Error fetching live chat:', error.message);
        setTimeout(getLiveChatMessages, 5000); // Retry after 5 seconds on error
    }
}

// Start fetching live chat messages
getLiveChatMessages();



async function getLiveChatId() {
    try {
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${VIDEO_ID}&part=liveStreamingDetails&key=${API_KEY}`;
        const response = await axios.get(url);
        
        const liveChatId = response.data.items[0]?.liveStreamingDetails?.activeLiveChatId;

        if (liveChatId) {
            console.log(`Live Chat ID: ${liveChatId}`);
            return liveChatId;
        } else {
            console.log("No active live chat found for this video.");
        }
    } catch (error) {
        console.error("Error fetching live chat ID:", error.response?.data || error.message);
    }
}

getLiveChatId();