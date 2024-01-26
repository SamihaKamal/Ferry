import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';


export default function Login({ navigation }) {
  const IPaddess =  '192.168.0.59';
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cheese, setCheese] = useState([]);

  useEffect(() =>{
      HandleLogin() 
  }, [])

  async function HandleLogin() {
    // Navigates to main pages through App.jrs
    const userData= {
      email: email,
      password: password,
    }
    const response = await fetch('http://192.168.0.59:8000/api/login/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
  
    const data = await response.json()
    setCheese(data)
    
    if (data.message == "User exists"){
      const id_request = await fetch(`http://192.168.0.59:8000/api/get+user+with+email?user_email=${email}`)
      const id_response = await id_request.json()
      console.log(id_response)
      navigation.navigate('MainPages', {user: id_response.user_id})
    }else{
      console.log("byebye")
    }
    console.log(data)
    
}

  const Cheese = () => {
    if (cheese.message == "User exists"){
      navigation.navigate('MainPages')
    }else{
      console.log("byebye")
    }
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
      <Button title="Login" onPress={HandleLogin}/>
      <Text>Dont have a login? Register here!!</Text>
      <Button title="Register" onPress={SendToRegister} />
      <StatusBar style="auto" />
    </View>
  );
}