import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '@rneui/themed';
import PostTile from '../components/Post';
import Fav from '../assets/favicon.png';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ route, navigation }) {
  const { user } = route.params;
  const [password, setPassword] = useState([]);
  const [search, setSearch] = useState("");
  const [userImage, setUserImage] = useState(null);

  useEffect(() =>{
    getPosts() 
    getUserProfile()
}, [])

  async function getUserProfile() {
    const request = await fetch(`http://192.168.0.68:8000/api/get+user+image/?user_id=${user}`)
    const response = await request.json()
    
    if (response){
      setUserImage(response.Image)
    }
  }

  async function getPosts() {
    const request = await fetch('http://192.168.0.68:8000/api/get+all+posts/')
    const response = await request.json()

    const responseData = response.Posts.map((a) =>({
      id: a.id,
      post_user_id: a.user.id,
      user: a.user.name,
      user_profile: a.user_image,
      caption: a.caption,
      image: a.image,
      date: a.date,
      likes: a.likes,
      country: a.country,
      tags: a.tags,
    }));

    if (responseData){
      setPassword(responseData)
    }
   
  }

  const updateSearch = (search) => {
    setSearch(search);
  };

  function sendToProfile(){
    navigation.navigate('Profile', {user: user, viewuser: user, navigation: navigation})
  }
  
  return (
    <View style={{ flex: 1 }}>
    
      <SearchBar 
        placeholder='Type here....'
        onChangeText={updateSearch}
        value={search}
        platform='android'
      />
      <View style={{flexDirection:'row', justifyContent: 'space-between', backgroundColor: 'white'}}>
        <Text style={homeStyle.welcomeText}>Welcome!</Text>
        <TouchableOpacity style={homeStyle.TouchableOpacity} onPress={sendToProfile}>
          <Image 
            style={homeStyle.Image}
            source={{ uri: userImage}}
          />
        </TouchableOpacity>
      </View>
      {/* Theres different components within home:
      - Profile picture/profile menu
      - Welcome back title
      - Search bar
      - Posts */}
      <StatusBar style="auto" />
      <ScrollView style={{ flex: 1 }}>
      
      {password.map((password, index ) => (
          <PostTile key={index}
           id={password.id}
            name={password.user}
            user_image={password.user_profile}
            post_user_id={password.post_user_id}
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

const homeStyle = StyleSheet.create({
  TouchableOpacity: {
    marginLeft: 'auto',
    marginRight: 10,
  },

  Image: {
    marginLeft: 'auto',
    width: 70,
    height: 70,
    aspectRatio: 1, // Maintain the aspect ratio to prevent distortion
    borderRadius: 100,
  },

  welcomeText: {
    marginLeft: 10,
    fontSize: 50, 
  }
})