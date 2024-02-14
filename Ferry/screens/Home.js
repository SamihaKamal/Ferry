import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '@rneui/themed';
import PostTile from '../components/Post';
import Fav from '../assets/favicon.png';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ route }) {
  // Fake data!!! To be replaced with the database yah
  const { user } = route.params;
  const [password, setPassword] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() =>{
    getPosts() 
    console.log("Check we get to this point") 
}, [])

  useFocusEffect(
    React.useCallback(() => {
      return () => getPosts();
    })
  );

  async function getPosts() {
    const request = await fetch('http://192.168.0.59:8000/api/get+all+posts/')
    const response = await request.json()

    const responseData = response.Posts.map((a) =>({
      id: a.id,
      user: a.user.name,
      caption: a.caption,
      image: a.image,
      likes: a.likes,
      country: a.country,
    }));
    console.log(responseData)
    console.log("Check we get to this point = GETPOSTS AFTER RESPONSE DATA")
    setPassword(responseData)
  }

  const updateSearch = (search) => {
    setSearch(search);
  };
  

  const cheese = [
    {name: "Plip Plop", img: Fav, caption: "Cheese louise"},
    {name: "Thelpy", img: Fav,caption: "I am addicted to genshin"},
    {name: "Rocky", img: Fav,caption: "This is a test to see if long pieces of text look alright ok aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa?"},
  ];

  return (
    <View>
      <SearchBar 
        placeholder='Type here....'
        onChangeText={updateSearch}
        value={search}
        platform='android'
      />
      <Text>itemId: {JSON.stringify(user)}</Text>
      <Text>This a home screan yah TEST TO SEE ON BRANCH user</Text>
      {console.log(search)}
      {/* Theres different components within home:
      - Profile picture/profile menu
      - Welcome back title
      - Search bar
      - Posts */}
      <StatusBar style="auto" />
      <ScrollView>
      {password.map((password, index ) => (
          <PostTile key={index} name={password.user} caption={password.caption} image={password.image} likes={password.likes} country={password.country}/>
        ))}
      </ScrollView>
     
      
    </View>
  );
}