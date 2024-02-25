import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Message({ route }) {
  const { user } = route.params;
  return (
    <View>
      <Text>This a the MESSAGE SCREEN</Text>
      <StatusBar style="auto" />
    </View>
  )
};