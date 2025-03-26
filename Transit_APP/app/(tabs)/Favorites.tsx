import React, { useEffect,useState} from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

      <ScrollView style= {styles.FavoritesContainer} contentContainerStyle = {styles.FavoritesContainer}> 
        <Text style={styles.firstItem}>{favorites[0]}</Text>
        <Text style={styles.restOfItems}>{favorites[1]}</Text>
        <Text style={styles.restOfItems}>{favorites[2]}</Text>
        <Text style={styles.restOfItems}>{favorites[3]}</Text>
        <Text style={styles.restOfItems}>{favorites[4]}</Text>
        <Text style={styles.restOfItems}>{favorites[5]}</Text>
        <Text style={styles.restOfItems}>{favorites[6]}</Text>
        <Text style={styles.restOfItems}>{favorites[7]}</Text>
        <Text style={styles.restOfItems}>{favorites[8]}</Text>
        <Text style={styles.restOfItems}>{favorites[9]}</Text>
        <Text style={styles.lastItem}>{favorites[10]}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  HeaderText:{
    alignSelf: 'center',
    fontSize: 25,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  FavoritesContainer:{
    
   // borderWidth: 2,
   // borderRadius: 5,
    maxHeight: 600,
    marginTop: 15,
    backgroundColor: 'rgb(245,245,245)',

  },
  FavoritesContentContainer:{
    alignItems: 'center',
  },
  restOfItems:{
    fontSize: 15,
    marginTop: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderRadius: 5,
    padding: 2,
    marginHorizontal: 40,
  },
  firstItem:{
    fontSize: 15,
    marginBottom: 8,
    marginTop: 15,
    borderWidth: 2,
    borderRadius: 5,
    padding: 2,
    marginHorizontal: 40,

  },
  lastItem:{
    fontSize: 15,
    marginTop: 8,
    marginBottom: 15,
    borderWidth: 2,
    borderRadius: 5,
    padding: 2,
    marginHorizontal: 40,
  }
  
} );

