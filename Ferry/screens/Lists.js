import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ListItem, SpeedDial } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import IPAddress from '../components/IPAddress';

export default function Lists({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [ listData, setListData ] = useState([]);
  const [ open, setOpen ] = useState(false)

  //Unlike use effect, focus effect is when that screen is being focused on which makes it better for refreshing when I move from one tab to the other
  useFocusEffect(
    useCallback(() => {
      getLists()
    }, [])
  );

  useEffect(() =>{
      getLists()
  }, [])

  async function getLists(){
      const request = await fetch(`http://${IPAddress()}/api/get+user+lists/?user_id=${user}`)
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

  async function deleteList(id, name){
    //If cancel is clicked then we return to the normal page otherwise we delete.
    Alert.alert('Delete list', `Do you want to delete the list ${name}?`, [
      {
        text: 'Cancel',
        onPress: () => {return},
        style: 'cancel',
      },
      {text: 'Yes', onPress: async () => {
        const request = await fetch(`http://${IPAddress()}/api/delete+list/?list_id=${id}`, {
        method: 'DELETE'
      })
      const response = await request.json()

      if (response){
        getLists()
      }
        }
    },
    ]);
    
  }

  return (
    <View style={{flex : 1}}>
      <ScrollView style={{flex: 1}}>
      {/* Display all the lists of the user */}
      {listData.map((a, index) => (
        <TouchableOpacity key={index} onPress={() => sendToList(a.id)}>
          <ListItem 
          bottomDivider>  
            <ListItem.Content>
              <ListItem.Title>{a.name}</ListItem.Title>
            </ListItem.Content>
            <TouchableOpacity onPress={() => deleteList(a.id, a.name)}>
              <Ionicons name={'trash-bin-outline'} size={20} />
            </TouchableOpacity> 
        </ListItem>
        </TouchableOpacity>
      ))}
    </ScrollView>
    {/* This button is to add a new list */}
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