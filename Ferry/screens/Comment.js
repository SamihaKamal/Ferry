import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Comment({ route }) {
    console.log(route)
    console.log(route.params.user)
    const { user, post } = route.params;
    
    console.log("Heehee")
    console.log(user)
  return (
    <View>
      <Text>User is: {user}</Text>
      <Text>Post is: {post}</Text>
      <StatusBar style="auto" />
    </View>
  );
}