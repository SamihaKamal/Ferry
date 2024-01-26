import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Following({ route }) {
  const { user } = route.params;
  return (
    <View>
      <Text>This a the following screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}