// app/tabs/index.tsx
import React, { useEffect, useState } from "react"
import {
  Text,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign'
import { useFavorites } from "./FavoritesContext"
import {
  setupDatabase,
  insertBus,
  getUpcomingBuses,
} from "./database"

export default function Index() {
  const [text, setText] = useState("")
  const { addFavorite } = useFavorites()
  const [busData, setBusData] = useState([])

  useEffect(() => {
    setupDatabase().catch(console.error)
  }, [])

  const favoritesIconClick = () => {
    if (text.trim()) {
      const added = addFavorite(text.trim())
      if (!added) {
        Alert.alert("Duplicate", "This item is already in your favorites list.")
      }
      setText("")
    }
  }

  const fetchTransitOptions = async () => {
    if (!text) return

    try {
      const response = await fetch(`https://your-api.com/search-transit/${text}`)
      const data = await response.json()

      // save each bus row
      for (const bus of data) {
        await insertBus(bus)
      }

      // then reload from SQLite
      const rows = await getUpcomingBuses(text)
      setBusData(rows)
    } catch (error) {
      console.error("API fetch failed:", error)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.TextInput}
              placeholder="Enter Destination"
              onChangeText={setText}
              value={text}
              keyboardType="default"
            />
            <TouchableOpacity onPress={favoritesIconClick} accessibilityLabel="Add to Favorites">
              <AntDesign name="hearto" size={25} color="black" style={styles.FavoriteIcon} />
            </TouchableOpacity>
            <Button title="Search" onPress={fetchTransitOptions} />
          </View>

          <View style={styles.TextContainer}>
            <Text style={styles.optionText}>Options</Text>
            <Text style={styles.departText}>Departs</Text>
          </View>

          <View style={styles.TransportOptions}>
            {busData.length > 0 ? (
              busData.map((option, idx) => (
                <View key={idx} style={styles.itemWrapper}>
                  <View style={styles.itemContainer}>
                    <View style={styles.itemsSymbol}>
                      <Text style={styles.symbolText}>{option.line}</Text>
                    </View>
                    <Text style={styles.locationText}>{option.destination}</Text>
                  </View>
                  <View style={styles.departureContainer}>
                    <Text>{option.arrivalTime || "Unknown Arrival"}</Text>
                  </View>
                  {option.departureTime && (
                    <View style={styles.departureContainer}>
                      <Text>{option.departureTime || "Unknown Departure"}</Text>
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
  )
}

const styles = StyleSheet.create({
  inputWithIcon: {
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
  container: {
    flex: 1,
    backgroundColor: 'rgb(245,245,245)',
    alignContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  TextContainer: {
    width: '98%',
    position: 'relative',
    height: 50,
    marginTop: 30,
  },
  optionText: {
    color: 'rgb(0,0,128)',
    marginTop: 30,
    position: 'absolute',
    left: 5,
    fontSize: 25,
  },
  departText: {
    color: "rgb(0,0,128)",
    marginTop: 30,
    position: 'absolute',
    right: 0,
    fontSize: 25,
  },
  TransportOptions: {
    flex: 0.9,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 0.8,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 15,
  },
  FavoriteIcon: {
    right: 0,
    marginLeft: 10,
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
    borderWidth: 2,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
  },
  itemsSymbol: {
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(245,245,5)',
    marginRight: 7,
  },
  locationText: {
    fontSize: 13.5,
    color: 'black',
    fontWeight: 'bold',
  },
  departureContainer: {
    backgroundColor: 'rgb(245,245,245)',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
  },
  symbolText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
})
