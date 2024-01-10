import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';


export default function Login({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const HandleLogin = () => {
      // Navigates to main pages through App.js
      navigation.navigate('MainPages')
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