import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';

export default function LiveFeed(){
  return (
    <View style={styles.container}>
      <Text style = {styles.HeadingText}>Live Feed</Text>

      <ScrollView style = {styles.feedContainer} contentContainerStyle = {styles.scrollContents}>
        <View style = {styles.smallerContainer}>
        <Text style = {styles.textStyle}>Feed1 
          asdasdasdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasd
        </Text>
        </View>
        <View style = {styles.smallerContainer}>
          <Text style = {styles.textStyle}>Feed2
          asdasdasdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasd
          </Text>
        </View>
        <View style = {styles.smallerContainer}>
          <Text style = {styles.textStyle}>Feed3
          asdasdasdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasd
          </Text>
        </View>
        <View style = {styles.smallerContainer}>
          <Text style = {styles.textStyle}>Feed4
          asdasdasdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasdasdasdasdadsdasdasdasdasdasdasdasdasd
          adasdasdasdasdadsadasd
          </Text>
        </View>
        <View style = {styles.smallerContainer}>
          <Text style = {styles.textStyle}>Feed5
          asdasdasdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasd
          </Text>
        </View>
        <View style = {styles.smallerContainer}>
          <Text style = {styles.textStyle}>Feed6
          asdasdasdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasd
          </Text>
        </View>
        <View style = {styles.smallerContainer}>
          <Text style = {styles.textStyle}>Feed7
          asdasdasdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasd
          </Text>
        </View>
        <View style = {styles.smallerContainer}>
          <Text style = {styles.textStyle}>Feed8
          asdasdasdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasd
          </Text>
        </View>
        <View style = {styles.smallerContainer}>
          <Text style = {styles.textStyle}>Feed9
          asdasdasdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasd
          </Text>
        </View>
        <View style = {styles.smallerContainer}>
          <Text style = {styles.textStyle}>Feed10
          asdasdasdasdasdasd
          asdasdasdasdasdasasdasdasdasdasasdasdasdasdasdasdayhygysdasdasd
          </Text>
        </View>
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  HeadingText:{
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: 15,
    fontSize: 25,
    marginBottom: 25,

  },
  feedContainer:{
   // flex: 0.87,
    maxHeight: 550,
    flexDirection: 'column', //to adjust the content(text in this case) to be top-bottom
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: 'rgb(245,245,245)', //keep this planning to change background color soon
    marginTop: 15,
    marginHorizontal: 11,
    
  },
  smallerContainer:{
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    padding: 2,
    borderRadius: 8,
    marginHorizontal: 10,

  },
  textStyle:{
    fontSize: 12,
    

  },
  scrollContents:{
    alignContent: 'center',

  },
});

