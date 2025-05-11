const express = require('express');
require('dotenv').config(); 
const cors = require('cors');
const axios = require('axios');
const fs = require('fs'); // need fs for file based purposes like reading a file or checking if the file exist. fs.readFileSync(), fs.existsSync
const gtfs = require('gtfs-realtime-bindings');
const path = require('path'); 
const app = express();
app.use(cors()); 
const PORT = 5000; 
const API_KEY = process.env.MTA_BUS_TIME_API_KEY;

const cron = require("node-cron");

const {LRUCache} = require('lru-cache'); //regular LRU gives me a typeError telling me LRU is a class constructor
const cache = new LRUCache({
    max: 200, // amount of items to store, each entry is an item
    ttl: 1000 * 30, // cached entry expires after 30 seconds
    updateAgeOnGet: true, // to reset fetch data retrieval expiration timer
    allowStale: false, //so that stale(old) data isn't return
    });

function  convertTimeToEDT12hr(time){
    if(!time){
        return "Unkown or Undefined time";
    }
    const date = new Date(time);
    const option = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };
    return date.toLocaleString('en-US', option);
}

async function getDestinationIDs() {
    const url = `https://bustime.mta.info/api/siri/stop-monitoring.json?key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        const busStopData = response.data?.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit || [];

        if (!Array.isArray(busStopData)) {
            return busStopData ? [busStopData] : [];
        }

        const destinationIDs = busStopData.map(stop => stop?.MonitoredVehicleJourney?.MonitoredCall?.StopPointRef).filter(Boolean);

        console.log("Fetched Destination IDs:", destinationIDs);
        return destinationIDs;
    } catch (error) {
        console.error("Error getting Destination IDs:", error.message);
        return [];
    }
}

let dynamicDestinationIDs = []; 
async function updateDestinationIDs() {
    console.log("Updating list of dynamic destination IDs...");
    const newIDs = await getDestinationIDs();
    
    if (newIDs.length > 0) {
        dynamicDestinationIDs = newIDs; // Update the list
        console.log("Updated Destination ID List:", dynamicDestinationIDs);
    } else {
        console.log("No new valid destination IDs found.");
    }
}

// Schedule fetching every 30 seconds and **refresh destination IDs every 5 minutes**
cron.schedule('*/30 * * * * *', async () => {
    console.log('Fetching bus stop data every 30 seconds...');
    for (const destinationID of dynamicDestinationIDs) {
        await fetchBusStopData(destinationID);
    }
});

// Refresh destination ID list every /x minutes
cron.schedule('*/1 * * * *', async () => {
    await updateDestinationIDs();
});


app.get('/bus-info/destination/:destinationID', async (req, res) => {
    const destinationID = req.params.destinationID;

    if (!destinationID) {
        return res.status(400).json({ error: 'Please provide a destination ID.' });
    }

    const cachedDatas = cache.get(destinationID);

    // Force new fetch if requested with ?forceRefresh=true
    if (!cachedDatas || req.query.forceRefresh === "true") {
        console.log(`Fetching new data for ${destinationID}...`);
        await fetchBusStopData(destinationID);
    }

    const updatedData = cache.get(destinationID);
    return res.status(200).json(updatedData || { message: 'No data available at this time.' });
});
/*
 MTAs GTFS feed GTFS-Realtime is encoded in Protocol Buffers (protobuf), some sort of binary format, 
 we'll need to parsed it properly else we'll be getting garbage data.

 Articles i found: 
 - https://medium.com/@subwayexpert/using-protocol-buffers-with-the-nyc-subway-a40688544dfb
 - https://www.npmjs.com/package/mta-gtfs-realtime-bindings

 FeedMessage class is generated from the GTFS-Realtime.proto file, we'll use it to parse the GTFS data.
*/

const Train_Feeds = { //Placed this object route handler outside for subway arrivals so that its not recreated during every request
    'Subway_ACE': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace', //For A,C,E trains and S^R rail 
    'Subway_G': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g', //G train
    'Subway_NQRW': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw', //N,Q,R,W trains 
    'Subway_1-7': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs', //1,2,3,4,5,6,7 trains and S 
    'Subway_BDFM': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm', //B,D,F,M trains and S^F
    'Subway_JZ': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz', //J,Z trains
    'Subway_L': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l', //L train
    'Subway_SIR': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si', //SIR train
};

async function fetchSubwayArrival(endpointURL){
    try{
        const response = await axios.get(endpointURL, {
            headers: { "x-api-key": API_KEY },
            responseType: 'arraybuffer', // Set the response type to arraybuffer to handle binary data
        });
        
    if (!response.data || response.data.length === 0) {
        throw new Error("No data received from the GTFS feed.");
    } 
       const feed = gtfs.transit_realtime.FeedMessage.decode(new Uint8Array(response.data)); // Decode the binary data using the FeedMessage class       
       /* Was using this log to figure out why for some train lines the times(arrival and departure), were the same. Thought it was an
       error turns out that how its actually set up
       console.log("Raw Feed Data:", JSON.stringify(feed.entity, null, 2)); // To check full feeds data and figure out why some lines aren't working
       */
       return feed.entity; 
    }catch(error){
        console.error("Error fetching subway arrival data:", error.message);
        return {error: "Failed to fetch subway data"};
    }
}

const formatTimestamp = (timestamp) => {
                if (timestamp) {  
                    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour12: true, timeZone: 'America/New_York' });
                }
                return 'Unknown';  
};

app.get('/subway-arrival/:trainLines', async (req, res) => {
    const trainLines = req.params.trainLines;
    const endpointURL = Train_Feeds[trainLines];
    const cacheTrain = cache.get(trainLines);

    if (!endpointURL) {
        return res.status(400).json({ error: 'Invalid train line provided.' });
    }

    if (cacheTrain) {//The 2 filteredDatas are different
        console.log(`HIT for train line: ${trainLines}`);
        // getting only the necessary info for thats been cached and displaying it
        const filteredData = cacheTrain.flatMap(entry => {
            const tripUpdate = entry.tripUpdate || {};
            const stopTimeUpdates = tripUpdate.stopTimeUpdate || [];
 
            if(!Array.isArray(stopTimeUpdates)){
                stopTimeUpdates = stopTimeUpdates ? [stopTimeUpdates] : []; 
            }

            return stopTimeUpdates.map(update => ({
                RouteId: tripUpdate.trip?.routeId || "Unknown", 
                StopId: update?.stopId || "Unknown",
                ArrivalTime: formatTimestamp(update?.arrival?.time),
                DepartureTime: formatTimestamp(update?.departure?.time),
                Delay: update?.arrival?.delay || "No Delay info"
            }));
        });
        return res.status(200).json(filteredData); 
    }

    console.log(`MISS cached for train line: ${trainLines}`);  //When the data set is new/not cached

    try {
        const subwayData = await fetchSubwayArrival(endpointURL);

        if (!subwayData || subwayData.length === 0) {
            return res.status(200).json({ message: 'No data found for the specified train line.' });
        }

        cache.set(trainLines, subwayData);

        const filteredData = subwayData.flatMap(entry => { // to filter and return the new responses
            const tripUpdate = entry.tripUpdate || {};
            const stopTimeUpdates = tripUpdate.stopTimeUpdate || [];

            if(!Array.isArray(stopTimeUpdates)){
                stopTimeUpdates = stopTimeUpdates ? [stopTimeUpdates] : [];
            }

            return stopTimeUpdates.map(update => ({
                RouteId: tripUpdate.trip?.routeId || "Unknown",  //Example: A, for the A train
                StopId: update?.stopId || "Unknown",
                ArrivalTime: formatTimestamp(update?.arrival?.time), //arrival time of the train at the stop
                DepartureTime: formatTimestamp(update?.departure?.time),//departure time of the train from the stop
                Delay: update?.arrival?.delay || "No Delay info", // delayed in seconds
            }));
        });

        return res.status(200).json(filteredData); 
    } catch (error) {
        console.error("Error fetching subway data:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

async function fetchBusStopData(destinationID) {
    const url = `https://bustime.mta.info/api/siri/stop-monitoring.json?key=${API_KEY}&MonitoringRef=${destinationID}`;

    try {
        const response = await axios.get(url);
        let busStopData = response.data?.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit || [];

        if (!Array.isArray(busStopData)) {
            busStopData = busStopData ? [busStopData] : [];
        }

        const formattedData = busStopData.map(stop => {
            const vehicleJourney = stop?.MonitoredVehicleJourney || {};
            const MonitoredCall = vehicleJourney?.MonitoredCall || {};

            return {
                stopID: MonitoredCall.StopPointName || "Unknown Stop",
                arrivalTime: MonitoredCall.ExpectedArrivalTime ? convertTimeToEDT12hr(MonitoredCall.ExpectedArrivalTime) : "Expected Arrival Time not available",
                line: vehicleJourney.PublishedLineName || "Unknown Bus Route",
                destination: MonitoredCall.DestinationDisplay || vehicleJourney.DestinationName || "Unknown Destination",
                direction: vehicleJourney.DirectionRef || "Unknown",
                vehiclePosition: {
                    latitude: vehicleJourney.VehicleLocation?.Latitude || "Unknown Latitude",
                    longitude: vehicleJourney.VehicleLocation?.Longitude || "Unknown Longitude"
                }
            };
        });

        console.log(`Updating cache for ${destinationID}:`, formattedData);

        // to delete old cache before updating it
        cache.delete(destinationID);
        cache.set(destinationID, formattedData);
    } catch (error) {
        console.error(`Error fetching data for ${destinationID}:`, error.message);
    }
}

app.listen(PORT, () => {
    console.log(`Transit server is running on port ${PORT}`);
    
});

