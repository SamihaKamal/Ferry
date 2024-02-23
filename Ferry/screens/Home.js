import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '@rneui/themed';
import PostTile from '../components/Post';
import Fav from '../assets/favicon.png';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ route, navigation }) {
  // Fake data!!! To be replaced with the database yah
  const { user } = route.params;
  const [password, setPassword] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() =>{
    getPosts() 
    console.log("Check we get to this point") 
}, [])

  // useFocusEffect(
  //   React.useCallback(() => {
  //     return () => getPosts();
  //   })
  // );

  async function getPosts() {
    const request = await fetch('http://192.168.0.68:8000/api/get+all+posts/')
    const response = await request.json()

    const responseData = response.Posts.map((a) =>({
      id: a.id,
      user: a.user.name,
      caption: a.caption,
      image: a.image,
      date: a.date,
      likes: a.likes,
      country: a.country,
      tags: a.tags,
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
      {console.log(search)}
      {/* Theres different components within home:
      - Profile picture/profile menu
      - Welcome back title
      - Search bar
      - Posts */}
      <StatusBar style="auto" />
      <ScrollView>
      {password.map((password, index ) => (
          <PostTile key={index}
           id={password.id}
            name={password.user}
            user_id={user}
             caption={password.caption}
              image={password.image}
               date={password.date}
                likes={password.likes}
                 country={password.country}
                  tags={password.tags}
                  navigation={navigation}/>
        ))}
      </ScrollView>
     
      
    </View>
  );
}