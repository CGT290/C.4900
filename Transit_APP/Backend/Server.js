require('dotenv').config(); 
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

// Function to fetch tweets using the Run ID
const fetchTweets = async () => {
    try {
        const datasetUrl = `https://api.apify.com/v2/actor-runs/${process.env.RUN_ID}/dataset/items?token=${process.env.API_KEY}`;
        const response = await axios.get(datasetUrl); // Fetch results
        const tweets = response.data; // Extract tweets from the dataset

        // Save tweets to a JSON file
        fs.writeFileSync('TweetFetch.json', JSON.stringify(tweets, null, 2));
        console.log('Tweets updated successfully!');
    } catch (error) {
        console.error('Error fetching tweets:', error.message);
    }
};

// API endpoint to serve the latest tweets
app.get('/fetched-tweets', (_, res) => {
    try {
        const rawData = fs.readFileSync('TweetFetch.json', 'utf8');
        const tweets = JSON.parse(rawData);
        res.status(200).json(tweets);
    } catch (error) {
        console.error('Error fetching tweets:', error.message);
        res.status(500).json({ error: 'Failed to fetch tweets' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    fetchTweets(); // Run immediately on server startup
});