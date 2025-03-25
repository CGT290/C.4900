import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FavoritesPage()  {
  return (
    <View style={styles.container}>
      <Text style = {styles.HeaderText}>Favorite Destinations</Text>

      <View style= {styles.FavoritesContainer}></View>
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
});

