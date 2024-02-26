import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ListItem, Avatar } from '@rneui/themed';
import { useEffect, useState } from 'react';

export default function Chat({ route, navigation }) {
  const { user } = route.params;
  const [ chatData, setChatData ] = useState([]);
  const [ userImage, setUserImage ] = useState();

  useEffect(() =>{
    getChats()
}, [])

  async function getChats(){
    const request = await fetch(`http://192.168.0.68:8000/api/get+user+chats/?user_id=${user}`)
    const response = await request.json()
  
    if (response) {
      const responseData = response.chats.flatMap(chat => chat); // Flatten the array
      const chatsData = responseData.map(a => ({
          id: a.id,
          user_id: a.user.id,
          user_name: a.user.name,
          user_image: a.user_image,
          to_user_id: a.to_user.id,
          to_user_image: a.to_user_image,
          to_user_name: a.to_user.name,
      }));
      setChatData(chatsData);
    }
  }

  
  function sendToMessages(toUserId){
    navigation.navigate('Message', {user: user, recipent: toUserId, navigation: navigation})
  }

  return (
    <View>
      {chatData.map((a, index) => (
        <TouchableOpacity key={index} onPress={() => sendToMessages(a.to_user_id)}>
          <ListItem 
          bottomDivider>
            <Image 
              style={chatStyle.Image}
              source={{ uri: a.to_user_image }}
            />
            <ListItem.Content>
              <ListItem.Title>{a.to_user_name}</ListItem.Title>
              <ListItem.Subtitle>President</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
        </TouchableOpacity>
        
      ))}
      
      <StatusBar style="auto" />
    </View>
  )
};

const chatStyle = StyleSheet.create({

  TouchableOpacity: {
    marginLeft: 'auto',
    marginRight: 10,
  },

  Image: {
    marginLeft: 'auto',
    width: 60,
    height: 60,
    aspectRatio: 1, // Maintain the aspect ratio to prevent distortion
    borderRadius: 100,
  },
})