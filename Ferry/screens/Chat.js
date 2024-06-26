import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ListItem, Avatar } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import IPAddress from '../components/IPAddress';

export default function Chat({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [ chatData, setChatData ] = useState([]);
  const [ userImage, setUserImage ] = useState();

  useEffect(() =>{
    getChats()
}, [])

  async function getChats(){
    const request = await fetch(`http://${IPAddress()}/api/get+user+chats/?user_id=${user}`)
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

   
  const sendToProfile = (toUserId) => {
    navigation.navigate('Profile', {user: user, viewuser: toUserId})
  }
  const sendToMessages = (toUserId, chatId) => {
    navigation.navigate('Message', {user: user, recipent: toUserId, chat: chatId})
  }

  return (
    <View>
      {chatData.map((a, index) => (
        // This lists out all who you chat with, when you press you get either sent to their profile or the messages page.
        <TouchableOpacity key={index} onPress={() => sendToMessages(a.to_user_id, a.id)}>
          <ListItem 
          bottomDivider>
            <TouchableOpacity onPress={() => sendToProfile(a.to_user_id)}>
              <Image 
                style={chatStyle.Image}
                source={{ uri: a.to_user_image }}
              />
            </TouchableOpacity>
            
            <ListItem.Content>
              <ListItem.Title>{a.to_user_name}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
        </TouchableOpacity>
        
      ))}
      
      <StatusBar style="auto" />
    </View>
  )
};

//Stylesheet for design
const chatStyle = StyleSheet.create({

  TouchableOpacity: {
    marginLeft: 'auto',
    marginRight: 10,
  },

  Image: {
    marginLeft: 'auto',
    width: 60,
    height: 60,
    aspectRatio: 1,
    borderRadius: 100,
  },
})