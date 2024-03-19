import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { ListItem, Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';


export default function Lists({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [ listData, setListData ] = useState([]);

  useEffect(() =>{
      getLists()
  }, [])

  async function getLists(){
      const request = await fetch(`http://192.168.0.68:8000/api/get+user+lists/?user_id=${user}`)
      const response = await request.json()

      const responseData = response.lists.map((a) => ({
          id: a.id,
          list_user_id: a.user.id,
          name: a.name,
      }))

      setListData(responseData)
  }

  const sendToList = (id) => {
    navigation.navigate('SpecificLists', {list: id, user: user})
  }

  return (
    <ScrollView>
      {listData.map((a, index) => (
        <TouchableOpacity key={index} onPress={() => sendToList(a.id)}>
          <ListItem 
          bottomDivider>  
            <ListItem.Content>
              <ListItem.Title>{a.name}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
        </TouchableOpacity>
      ))}
      <StatusBar style="auto" />
    </ScrollView>
  );
}