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
      const userData= {
        email: email,
        password: password,
      }
      const HandleLogin = async() => {
        // Navigates to main pages through App.js
        const response = await fetch('http://192.168.0.59:8000/api/login/',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
      
        const data = await response.json()
        setCheese(data)
      } 
      HandleLogin()
    } catch (error) {
      console.error('Fetch error:', error);
    }   
  }, [email, password])



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
      <Button title="Login" onPress={Cheese}/>
      <Text>Dont have a login? Register here!!</Text>
      <Button title="Register" onPress={SendToRegister} />
      <StatusBar style="auto" />
    </View>
  );
}