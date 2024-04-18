import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ListItem, SpeedDial } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';


export default function Lists({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [ listData, setListData ] = useState([]);
  const [ open, setOpen ] = useState(false)

  useFocusEffect(
    useCallback(() => {
      getLists()
    }, [])
  );

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

  const createList = () =>{
    navigation.navigate('CreateList', {user: user})
  }

  return (
    <View style={{flex : 1}}>
      <ScrollView style={{flex: 1}}>
      
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
    <TouchableOpacity style={{width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#3A4454',
            margin: 10,
            marginLeft: 'auto', 
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',}} onPress={createList}>
              <Text style={{color:'white', fontSize: 15}}> New list</Text>
    </TouchableOpacity>
    </View>
    
    
  );
}