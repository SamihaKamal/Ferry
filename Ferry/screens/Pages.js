import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Pages({ route }) {
  const { user } = route.params;
  return (
    <View>
      <Text>This is the country pages screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}