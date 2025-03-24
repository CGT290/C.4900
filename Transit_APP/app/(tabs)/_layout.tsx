import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name = "Index" options={{
        headerTitle: 'HomePage'}}/>
      <Stack.Screen name = "FavoritesPage" options = {{headerTitle: 'Favorites'}}/>
      <Stack.Screen name = "LiveFeed" options = {{headerTitle: 'Feed'}}/>
      
    </Stack>
  );
}

