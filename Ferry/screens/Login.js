import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import logo from '../assets/Logo.png'


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function HandleLogin() {
    // Check if null:
    if ((email=='') || (password=='')){
      Alert.alert("Missing information","Please enter your details")
    }else{
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
        setEmail('')
        setPassword('')
      }else{
        //Error message here
        Alert.alert("Unable to login","Please try again later")
      }  
    }  
}

  const SendToRegister = () => {
    //Navigates to register through App.js
    navigation.navigate('Register')
    setEmail('')
    setPassword('')
  }
  return (
    <View style={LoginStyle.Box}>
      <Image 
        style={LoginStyle.image}
        source={logo}
      />
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} style={LoginStyle.text}/>
      <TextInput placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry={true} style={LoginStyle.text}/>
      <TouchableOpacity style={LoginStyle.login} onPress={HandleLogin}>
        <Text style={{fontSize: 30, color: '#E4ECF9',}}>Login</Text>
      </TouchableOpacity>
      <Text style={{textAlign: 'center'}}>Already have a login?</Text>
      <TouchableOpacity style={LoginStyle.register} onPress={SendToRegister}>
        <Text style={{fontSize: 30, color: '#E4ECF9',}}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

//Stylesheet
const LoginStyle = StyleSheet.create({

  Box: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: "white",
    paddingTop: 20,
  },

  text: {
    borderBottomWidth: 1,
    height: 60,
    fontSize: 25,
    marginVertical: 10,
    marginHorizontal: 10,
    fontWeight: "300",
  },
  
  login: {
    height: 60,
    backgroundColor: "#3A4454",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  register: {
    height: 60,
    backgroundColor: "#53687E",
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    alignSelf: 'center',
    width: '40%',
    height: '30%',
  },
})