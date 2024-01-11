import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';


export default function Login({ navigation }) {
  const IPaddess =  '192.168.0.59';
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cheese, setCheese] = useState([]);

  useEffect(() =>{
    try {
      const HandleLogin = async() => {
        // Navigates to main pages through App.js
        const response = await fetch('http://192.168.0.59:8000/api/login/')
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json()
        setCheese(data.Users)
      }
      
      HandleLogin()
    } catch (error) {
      console.error('Fetch error:', error);
    }

    
  }, [])

  

  const Cheese = () => {
    console.log(cheese)
  }

  const SendToRegister = () => {
    //Navigates to register through App.js
    navigation.navigate('Register')
  }
  return (
    <View>
      <Text>Login here!!</Text>
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} />
      <TextInput placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry={true}/>
      <Button title="Login" onPress={Cheese}/>
      <Text>Dont have a login? Register here!!</Text>
      <Button title="Register" onPress={SendToRegister} />
      <StatusBar style="auto" />
    </View>
  );
}