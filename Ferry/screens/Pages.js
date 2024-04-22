import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ListItem, Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import IPAddress from '../components/IPAddress';

//Pages is the country pages.
export default function Pages({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [ country, setCountry ] = useState([])

  useEffect(() =>{
    getCountries()
}, [])


  async function getCountries(){
    const request = await fetch(`http://${IPAddress()}/api/get+countries/`)
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
    navigation.navigate('CountrySpecificPage', {user: user, country: countryID })
  }

  return (
    <View>
      {/* Lists out all the country pages in the database and redirecting to them */}
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