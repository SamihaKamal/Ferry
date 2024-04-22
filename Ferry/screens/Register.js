import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import logo from '../assets/Logo.png'
import IPAddress from '../components/IPAddress';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function HandleRegister() {
      //Check any null values:
      if((name=='') || (email=='') || (password=='')){
        Alert.alert("Missing information","Please enter your details")
      }
      else{
        const data = {
          email: email,
          password: password,
          name: name,
        }
        const request = await fetch(`http://${IPAddress()}/api/register/`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
  
        const response = await request.json()
        
        if (response.message == "User registered, please login"){
          const id_request = await fetch(`http://${IPAddress()}/api/get+user+with+email/?user_email=${email}`)
          const id_response = await id_request.json()
          navigation.navigate('MainPages', {user: id_response.user_id})
          setName('')
          setEmail('')
          setPassword('')
        }else{
          //error message here
          Alert.alert("Unable to register","Please try again later")
        }
      }
      
      
  }

  const SendToLogin = () => {
    // Navigates to login page through App.js
    navigation.navigate('Login')
    //Clear inputs just incase
    setName('')
    setEmail('')
    setPassword('')
  }

  const Test = () => {
    // Navigates to login page through App.js
    navigation.navigate('MainPages', {user: 1})
    //Clear inputs just incase
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <View style={RegisterStyle.Box}>
        <Image 
          style={RegisterStyle.image}
          source={logo}
        />
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={RegisterStyle.text}/>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={RegisterStyle.text}/>
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} style={RegisterStyle.text}/>
        <TouchableOpacity style={RegisterStyle.register} onPress={HandleRegister}>
          <Text style={{fontSize: 30, color: '#E4ECF9',}}>Register</Text>
        </TouchableOpacity>
        <Text style={{textAlign: 'center'}}>Already have a login?</Text>
        <TouchableOpacity style={RegisterStyle.login} onPress={SendToLogin}>
          <Text style={{fontSize: 30, color: '#E4ECF9',}}>Login</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={RegisterStyle.login} onPress={Test}>
          <Text style={{fontSize: 30, color: '#E4ECF9',}}>QUICKLOGIN</Text>
        </TouchableOpacity> */}
    </View>
  );
}

//Stylesheet
const RegisterStyle = StyleSheet.create({

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
  
  register: {
    height: 60,
    backgroundColor: "#3A4454",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  login: {
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