// app/tabs/index.tsx
import { Text, View, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert, Button } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState, useEffect } from "react";
import { useFavorites } from "./FavoritesContext"; 
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('transit.db');

const API_URL = `http://192.168.86.138:5000`;



export default function Index({}) {
    const [text, setText] = useState("");
    const { addFavorite } = useFavorites();
    const [busData, setBusData] = useState([]);

    useEffect(() => {
        setupDatabase();
    }, []);

    const setupDatabase = () => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS buses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    stopID TEXT,
                    arrivalTime TEXT,
                    line TEXT,
                    destination TEXT,
                    direction TEXT,
                    latitude REAL,
                    longitude REAL
                );`
            );
        });
    };

    const fetchTransitOptions = async () => {
        if (!text) return;

        try {
            const response = await fetch(`${API_URL}/search-transit/${text}`);
            const data = await response.json();

            // Insert into SQLite
            data.forEach(bus => {
                db.transaction(tx => {
                    tx.executeSql(
                        `INSERT INTO buses (stopID, arrivalTime, line, destination, direction, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                        [bus.stopID, bus.arrivalTime, bus.line, bus.destination, bus.direction, bus.latitude, bus.longitude],
                        (_, result) => console.log(`Inserted Bus Data:`, result),
                        (_, error) => console.error("Error inserting bus data:", error)
                    );
                });
            });

            getUpcomingTransit(text); 
        } catch (error) {
            console.error("Error fetching transit options:", error);
        }
    };

    const getUpcomingTransit = (destination) => {
        const currentTime = new Date();
        const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes()}`;

        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM buses WHERE LOWER(destination) LIKE LOWER(?) AND arrivalTime > ? ORDER BY arrivalTime ASC;`,
                [`%${destination.toLowerCase()}%`, formattedTime],
                (_, result) => setBusData(result.rows._array),
                (_, error) => console.error("Error fetching transit options:", error)
            );
        });
    };

    const favoritesIconClick = () => {
        if (text.trim()) {
            const added = addFavorite(text.trim());
            if (!added) {
                Alert.alert("Duplicate", "This item is already in your favorites list.");
            }
            setText("");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="always"> 
                    <View style={styles.inputWithIcon}>
                        <TextInput style={styles.TextInput} 
                            placeholder="Enter Destination" 
                            onChangeText={(newText)=>{ setText(newText); fetchTransitOptions(); }} 
                            value={text} 
                            editable={true} 
                            keyboardType="default"
                        />
                        <TouchableOpacity onPress={favoritesIconClick} accessibilityLabel="Add to Favorites">
                            <AntDesign name="hearto" size={25} color="black" style={styles.FavoriteIcon} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.TextContainer}>
                        <Text style={styles.optionText}>Options</Text>
                        <Text style={styles.departText}>Departs </Text>
                    </View>

                    <View style={styles.TransportOptions}>
                        {busData.length > 0 ? (
                            busData.map((option, index) => (
                                <View key={index} style={styles.itemWrapper}>
                                    <View style={styles.itemContainer}>
                                        <View style={styles.itemsSymbol}>
                                            <Text style={styles.symbolText}>{option.line || option.routeId}</Text> 
                                        </View>
                                        <Text style={styles.locationText}>{option.destination || option.stopId}</Text> 
                                    </View>
                                    <View style={styles.departureContainer}>
                                        <Text>{option.arrivalTime ? `${option.arrivalTime}` : "Unknown Arrival"}</Text> 
                                    </View>
                                    {option.departureTime && (
                                        <View style={styles.departureContainer}>
                                            <Text>{option.departureTime ? `${option.departureTime}` : "Unknown Departure"}</Text> 
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <Text>No transit options found.</Text>
                        )}
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  inputWithIcon:{
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 20,
    width: '90%',
    height: 35,
    
  },
  TextInput: {
    flex: 1,
    color: 'black',
    paddingVertical: 0,
    fontSize: 18,
    backgroundColor: 'transparent',

  },

  container:{
    flex: 1,
    backgroundColor: 'rgb(245,245,245)',    //'rgb(10,30,50)' other option
    alignContent: 'center',
    
    
  },
  scrollContainer:{
    flexGrow: 1,// to make sure that our  scrollview  items are scrollable
  },
  
  TextContainer:{
    width: '98%', //adjusting the width between the 2 text
    position: 'relative',
    height: 50,
    marginTop: 30,
  },
  optionText:{
    color: 'rgb(0,0,128)',
    marginTop: 30,
    position: 'absolute',
    left: 5,
    fontSize: 25
  },

  departText:{
    color: "rgb(0,0,128)",
    marginTop: 30,
    position: 'absolute',
    right: 0,
    fontSize: 25,
  },
  TransportOptions:{
    flex: 0.9,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 0.8,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 15,
  },
  FavoriteIcon:{
    right: 0,
    marginLeft: 10,
  },
  //only needed when testing page not found link, DO NOT REMOVE
  gotToFeed:{
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 15,
    textDecorationLine: 'underline',

  },
  itemWrapper: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row', 
    alignItems: 'center', // makes sure item (Location: (someLocation)) is centered 
    padding: 7, // Space inside the container
    borderWidth: 2,
    borderRadius: 15,
    flex: 1, // Allow itemContainer to grow and take up any available space
    marginRight: 10, // Add space between itemContainer and departureContainer
    
  },
  itemsSymbol: {
    width: 25, // Circle diameter
    height: 25, // To make the circle make sure its the same as width
    borderRadius: 20, // Make it circular
    borderWidth: 2, 
    alignItems: 'center', //Same as justifyContent, push the item from left to the center
    justifyContent: 'center', // To place the text B6 for example in the center of the container
    backgroundColor: 'rgb(245,245,5)',
    marginRight: 7, // To adjust the position of the location text next to the symbol
  },
  //to edit the text location
  locationText: {
    fontSize: 13.5, 
    color: 'black',
    fontWeight: 'bold',
  },
  departureContainer: {
    backgroundColor: 'rgb(245,245,245)', 
    padding: 5, 
    borderRadius: 15, // making the corners of the container rounder
    borderWidth: 2,
    borderColor: 'black',
  },

  //to edit the text itemsSymbols
  symbolText:{
    fontSize: 10,
    fontWeight:  'bold',
  },

});