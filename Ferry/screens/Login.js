import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';


export default function Login({ navigation }) {
  const IPaddess =  '192.168.0.59';
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() =>{
      HandleLogin() 
  }, [])

  async function HandleLogin() {
    // Navigates to main pages through App.jrs
    const userData= {
      email: email,
      password: password,
    }
    const response = await fetch('http://192.168.0.68:8000/api/login/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
  
    const data = await response.json()
    
    if (data.message == "User exists"){
      const id_request = await fetch(`http://192.168.0.68:8000/api/get+user+with+email/?user_email=${email}`)
      const id_response = await id_request.json()
      navigation.navigate('MainPages', {user: id_response.user_id, navigation: navigation})
    }else{
      //Error message here
      console.log("byebye")
    }  
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
      <Button title="Login" onPress={HandleLogin}/>
      <Text>Dont have a login? Register here!!</Text>
      <Button title="Register" onPress={SendToRegister} />
      <StatusBar style="auto" />
    </View>
  );
}