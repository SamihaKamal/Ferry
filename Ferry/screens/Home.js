import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PostTile from '../components/Post';
import Fav from '../assets/favicon.png';

export default function Home({ route }) {
  // Fake data!!! To be replaced with the database yah
  const { user } = route.params;
  const [password, setPassword] = useState();

  useEffect(() =>{
    getPosts()
    console.log("Check we get to this point") 
}, [])

  async function getPosts() {
    const request = await fetch('http://192.168.0.59:8000/api/get+all+posts/')
    const response = await request.json()

    const responseData = response.Posts.map((a) =>({
      id: a.id,
      user: a.user.name,
      caption: a.caption,
      likes: a.likes,
      country: a.country,
    }));
    console.log(responseData)
    console.log("Check we get to this point = GETPOSTS AFTER RESPONSE DATA")
    setPassword(responseData)
  }
  

  const cheese = [
    {name: "Plip Plop", img: Fav, caption: "Cheese louise"},
    {name: "Thelpy", img: Fav,caption: "I am addicted to genshin"},
    {name: "Rocky", img: Fav,caption: "This is a test to see if long pieces of text look alright ok aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa?"},
  ];

  return (
    <View>
      <Text>itemId: {JSON.stringify(user)}</Text>
      <Text>This a home screan yah TEST TO SEE ON BRANCH user</Text>
      {/* Theres different components within home:
      - Profile picture/profile menu
      - Welcome back title
      - Search bar
      - Posts */}
      <StatusBar style="auto" />
      <ScrollView>
        {password.map((password, index ) => (
          <PostTile key={index} name={password.user} caption={password.caption} img={password.likes}/>
        ))}
      </ScrollView>
     
      
    </View>
  );
}