import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name = "(tabs)" options={{
        headerTitle: 'HomePage',
        headerTitleAlign: 'center',
        headerShown: false, // To remove the extra HomePage header from each page
        }}/>

    <Stack.Screen name = "+not-found" options={{}}/>
      
    </Stack>
  );
}

