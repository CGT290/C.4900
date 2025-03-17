import { Text, View, ScrollView, StyleSheet } from "react-native";

export default function Index() {
  return (
    <ScrollView>
    <View>
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
    </ScrollView>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
        justifyContent: "center",
        alignItems: "center",
        color: "red",

  },
  Text: {
    color: "red",
    
  }

}
);
