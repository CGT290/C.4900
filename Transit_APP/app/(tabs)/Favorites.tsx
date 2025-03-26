import React, { useEffect,useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSearchParams } from "expo-router";


export default function FavoritesPage({})  {
  //State for managing an array of favorites
  
  const { new_Favorites } = useSearchParams(); // Retrieve query parameter
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (new_Favorites && !favorites.includes(new_Favorites)) {
      setFavorites((prevFavorites) => [...prevFavorites, new_Favorites]);
    }
  }, [new_Favorites]);




  //using format route.params.key to access our key in navigation.navigate() 
  // key here is new_Favorites and  symbol is just apply opitional to its object
 

  return (
    <View style={styles.container}>
      <Text style = {styles.HeaderText}>Favorite Destinations</Text>

      <View style= {styles.FavoritesContainer}>
        <Text> New Favorite: {new_Favorites}

        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  HeaderText:{
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 5,
    fontWeight: 'bold',
  },
  FavoritesContainer:{

  },
  
} );

