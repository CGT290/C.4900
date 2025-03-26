import React, { useEffect,useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';



export default function FavoritesPage({})  {
  //State for managing an array of favorites useState([])
  
  const {new_Favorites}  = useLocalSearchParams();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (new_Favorites && !favorites.includes(new_Favorites)) {
      setFavorites((prevFavorites) => [...prevFavorites, new_Favorites]);
    }
  }, [new_Favorites]);

  
 

  return (
    <View style={styles.container}>
      <Text style = {styles.HeaderText}>Favorite Destinations</Text>

      <View style= {styles.FavoritesContainer}>
        {favorites.map((item, index) => (
          <Text key={index} style={styles.favoritesContent}
          >{item}
          </Text>
        ))}
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
    alignItems: 'center',

  },
  favoritesContent:{
    

  },
  
} );

