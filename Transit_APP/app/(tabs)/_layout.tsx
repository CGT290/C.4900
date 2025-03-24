import { Tabs } from "expo-router";
import {Ionicons} from "@expo/vector-icons";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabsLayout() {
  /* Remainder of how to change the color of the icon, use color prop (color : "anycolor")
     
  <IconTypeName color = "red"/> 
  example:  <Ionicons name="home" size={30} color="blue" />

  For now this will just apply to vector-icons only not sure about the other types


  */
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: "rgb(0,120,15)",  //To control the color of current tab
       
      }}
    >
      <Tabs.Screen name = "index" options={{
        headerTitle: 'HomePage',
        headerTitleAlign: 'center',
        tabBarLabel: "Home", //to change the text below home tab icon
        tabBarIcon: () => <FontAwesome6 name ="train-subway" size = {27}/>
        }}/>
      

      <Tabs.Screen name = "Favorites" options = {{
      headerTitle: 'FavoritesPage',headerTitleAlign: 'center',
      tabBarIcon: () => <Ionicons name ="heart" size = {27}/>
      }}/>

      <Tabs.Screen name = "LiveFeed" options = {{
        headerTitle: 'Feed',
        headerTitleAlign: 'center',
        tabBarIcon: () => <FontAwesome name ="feed" size = {27}/>
        }}/>
      
    </Tabs>
  );
}

