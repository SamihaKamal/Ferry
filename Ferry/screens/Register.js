import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';


export default function Register({ navigation }) {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cheese, setCheese] = useState([]);

  useEffect(() =>{
      HandleRegister()
  }, [])

  async function HandleRegister() {
      // Navigates to main pages through App.jrs
      const data = {
        email: email,
        password: password,
        name: name,
      }
      const request = await fetch('http://192.168.0.59:8000/api/register/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const response = await request.json()
      setCheese(response)
      
      if (response.message == "User registered, please login"){
        const id_request = await fetch(`http://192.168.0.59:8000/api/get+user+with+email?user_email=${email}`)
        const id_response = await id_request.json()
        console.log(id_response)
        navigation.navigate('MainPages', {user: id_response.user_id})
      }else{
        console.log("byebye")
      }
      console.log(cheese)
      
  }

  const SendToLogin = () => {
    // Navigates to login page through App.js
    navigation.navigate('Login')
  }
  return (
    <View>
      <Text>Register here!!</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName}/>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
      <Button title="Register" onPress={HandleRegister}/>
      <Text>Already have a login? Login here!</Text>
      <Button title="Login" onPress={SendToLogin} />
      <StatusBar style="auto" />
    </View>
  );
}