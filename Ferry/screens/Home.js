import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '@rneui/themed';
import PostTile from '../components/Post';
import { useNavigation } from '@react-navigation/native';
import Fav from '../assets/favicon.png';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ route}) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [password, setPassword] = useState([]);
  const [search, setSearch] = useState("");
  const [like, setLike] = useState(false);
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
    
      <FlatList
        data={password}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <PostTile
            id={item.id}
            name={item.user}
            user_image={item.user_profile}
            post_user_id={item.post_user_id}
            user_id={user}
            caption={item.caption}
            image={item.image}
            date={item.date}
            likes={item.likes}
            country={item.country}
            tags={item.tags}
            navigation={navigation}
          />
        )}
      />
     
      
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