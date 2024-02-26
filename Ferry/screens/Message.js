import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Message({ route }) {
  const { user, recipent, chat, navigation } = route.params;
  const [ messageData, setMessageData ] = useState([]);
  const [ userComment, setUserComment ] = useState('');
  const scrollViewRef = useRef(null);
 
  useEffect(() =>{
    // createChat()
    getMessages()
    scrollToBottom()
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

    const response = request.json()

    if(response){
      chat = response.chat
    }
  }

  async function getMessages(){
    const request = await fetch(`http://192.168.0.68:8000/api/get+messages+from+chat/?chat_id=${chat}`)
    const response = await request.json()

    const responseData = response.messages.map((a) => ({
      id: a.id,
      content: a.content,
      sender: a.sender.id,
      sender_name: a.sender.name,
      receiver: a.receiver.id,
      receiver_name: a.receiver.name,
      date: a.date
    }))
    
    setMessageData(responseData)
  }

  async function addMessage(){

    const data = {
      'user_id': user,
      'to_user_id': recipent,
      'chat_id': chat,
      'content': userComment,
    }
    const request = await fetch(`http://192.168.0.68:8000/api/create+message/`, {
      method: 'POST',
      headers: {
        'content-type' : 'application/json'
      },
      body: JSON.stringify(data)
    })

    const response = await request.json()

    if (response){
      getMessages()
      setUserComment('')  
    }

  }

  const scrollToBottom = () => {
    if (scrollViewRef.current){
      scrollViewRef.current.scrollToEnd({animated: false})
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} ref={scrollViewRef} onLayout={scrollToBottom}>
        {messageData.map((a, index) => (
          <View key={index} style={[messageStyle.message, a.sender===user? messageStyle.messageFromUser : messageStyle.messageToUser]}>
            <Text style={[messageStyle.userName, a.sender===user? messageStyle.fromUserName : messageStyle.messageToUser]}>
              {a.sender_name}</Text>
            <Text style={[messageStyle.content, a.sender===user? messageStyle.fromContent : messageStyle.messageToUser]}>
              {a.content}</Text>
          </View>
         
          
        ))}
      </ScrollView>
      
      <View style={messageStyle.commentContainer}> 
        <TextInput
          style={[messageStyle.commentBox]}
          multiline
          autoCorrect={true}
          numberOfLines={4}
          maxLength={60}
          placeholder="User Comment" 
          value={userComment} 
          onChangeText={setUserComment}/>
          <TouchableOpacity onPress={addMessage}>
            <Ionicons name='arrow-forward-circle' size={50} color="#BDD7EE"/>
          </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  )
};

const messageStyle = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },

  commentBox: {
    flex: 1,
    backgroundColor: '#eee',
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },

  message: {
    fontSize: 16,
    margin: 10
  },

  messageFromUser: {
    backgroundColor: 'pink',
    borderRadius: 10,
  },

  messageToUser: {
    backgroundColor: '#e18e96',
    borderRadius: 10,
  },

  userName: {
    fontSize: 20,
    paddingLeft: 10,
  },

  fromUserName: {
    marginLeft: 'auto',
    paddingRight: 10,
  },

  content: {
    paddingLeft: 10,
  },

  fromContent: {
    marginLeft: 'auto',
    paddingRight: 10,
  }
})