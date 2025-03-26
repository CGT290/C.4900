import { Text, View, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

import { useState } from "react";
import { useRouter } from "expo-router";



export default function Index({}) {
  const [text, setText] = useState("");
  //const [favorites] = useState([]); //State for managing an array of favorites
  const router = useRouter();

function favoritesIconClick() {
  //text.trim() removes leading space and also make sure its not an empty string
  if (text.trim()) { //Additional statement (!) to ensure no duplicate
    router.push({
       pathname: "/Favorites",
        params: { new_Favorites: text.trim() },
       });
    setText(""); //To clear the input after favorites icon has been clicked
  }
}
console.log("Navigating to Favorites with params:", {
  new_Favorites: text.trim(),
});

  return (
    <KeyboardAvoidingView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="always"> 
          <View style={styles.inputWithIcon}>
            <TextInput style={styles.TextInput} 
              placeholder="Enter Destination" 
              onChangeText={setText} 
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
            <Text style={styles.departText}>Departs In</Text>
          </View>
           
           
          <View style={styles.TransportOptions}>
            {/*This is just to get the idea of how the box will look will replace this soon */}
            
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
    marginTop: 10,
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
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 0.8,
    padding: 15,
    marginTop: 15,
    maxHeight: 20,

  },
  FavoriteIcon:{
    right: 0,
    marginLeft: 10,
  },
 
 

});


