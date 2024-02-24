import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '@rneui/themed';
import PostTile from '../components/Post';
import Fav from '../assets/favicon.png';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ route, navigation }) {
  const { user } = route.params;
  const [password, setPassword] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() =>{
    getPosts() 
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

    setPassword(responseData)
  }

  const updateSearch = (search) => {
    setSearch(search);
  };
  
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