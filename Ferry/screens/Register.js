import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';


export default function Register({ navigation }) {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();


  async function HandleRegister() {
      // Navigates to main pages through App.jrs
      navigation.navigate('MainPages')
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