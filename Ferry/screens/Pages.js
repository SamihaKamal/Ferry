import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ListItem, Avatar } from '@rneui/themed';

export default function Pages({ route, navigation }) {
  const { user } = route.params;
  const [ country, setCountry ] = useState([])

  useEffect(() =>{
    getCountries()
}, [])


  async function getCountries(){
    const request = await fetch('http://192.168.0.68:8000/api/get+countries/')
    const response = await request.json()

    if(response){
      const responseData = response.countries.map((a) => ({
        'id': a.id,
        'name': a.name,
        'tag': a.tag
      }))

      setCountry(responseData)
    }

  }

  const sendToCountryPage = (countryID) => {
    navigation.navigate('CountrySpecificPage', {user: user, country: countryID, navigation: navigation})
  }

  return (
    <View>
      {country.map((a, index) => (
        <TouchableOpacity key={index} onPress={() => sendToCountryPage(a.id)}>
          <ListItem 
          bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{a.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
      ))}
      <StatusBar style="auto" />
    </View>
  );
}