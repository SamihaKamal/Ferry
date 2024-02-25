import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

export default function Message({ route }) {
  const { user, recipent, navigation } = route.params;

  useEffect(() =>{
    createChat()
}, [])

  async function createChat(){
    const data={
      user_id: user,
      to_user_id: recipent
    }
    const request = await fetch('http://192.168.0.68:8000/api/create+chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
  return (
    <View>
      <Text>This a the MESSAGE SCREEN</Text>
      <StatusBar style="auto" />
    </View>
  )
};