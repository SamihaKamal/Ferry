import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SearchBar, ListItem, Tab, TabView} from '@rneui/themed';
import ReviewTile from '../components/Review';
import PostTile from '../components/Post';
import { useNavigation } from '@react-navigation/native';
import Fav from '../assets/favicon.png';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ route}) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [post, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers ] = useState(null);
  const [review, setReview] = useState([]); 
  const [userImage, setUserImage] = useState(null);
  const [index, setIndex] = useState(0);


 
  useFocusEffect(
    useCallback(() => {
      getPosts()
      getReviews()
    }, [])
  );
  
  
  useEffect(() =>{
    getPosts()
    getReviews()
    getUserProfile()
    searchUser()
}, [search])

  async function getUserProfile() {
    const request = await fetch(`http://192.168.0.68:8000/api/get+user+image/?user_id=${user}`)
    const response = await request.json()
    
    if (response){
      setUserImage(response.Image)
    }
  }

  async function getReviews() {
    const request = await fetch(`http://192.168.0.68:8000/api/get+reviews/`)
    const response = await request.json()

    const responseData = response.Reviews.map((a) => ({
      id: a.id,
      review_user_id: a.user.id,
      review_user_name: a.user.name,
      review_user_profile: a.user_image,
      image: a.image,
      title: a.review_title,
      text: a.review_body,
      date: a.date,
      likes: a.likes,
      country: a.country,
      tags: a.tags,
      class: 'r',
    }))

    if (responseData){
      setReview(responseData)
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
      class: 'p'
    }));

    if (responseData){
      setPost(responseData)
    }
   
  }


  async function searchUser(){
    if (search == ''){
      return
    }
    const request = await fetch(`http://192.168.0.68:8000/api/get+user+by+name/?user_name=${search}`)
    const response = await request.json()

    if (response.user){
      const responseData = {
        id: response.user.id,
        name: response.user.name,
        image: response.user.image,
      }

      setUsers(responseData)
    }
    else{
      setUsers(null)
    } 
  }

  const updateSearch = (search) => {
    setSearch(search);
  };

  function sendToProfile(user_id){
    navigation.navigate('Profile', {user: user, viewuser: user_id})
  }
  
  return (
    <View style={{ flex: 1 }}>
      {/* SEARCH BAR */}
      <SearchBar 
        placeholder='Search users...'
        onChangeText={updateSearch}
        value={search}
        platform='android'
      />
      {users !== null && (
        <View style={{ backgroundColor: 'white' }}>   
        <TouchableOpacity onPress={() => sendToProfile(users.id)}>
          <ListItem 
            bottomDivider>
              <Image 
                style={homeStyle.SearchImage}
                source={{ uri: users.image }}
              />
              <ListItem.Content>
                <ListItem.Title>{users.name}</ListItem.Title>
              </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
      </View>
      )}
      {/* USER PROFILE AND WELCOME */}
      <View style={{flexDirection:'row', justifyContent: 'space-between', backgroundColor: 'white'}}>
        <Text style={homeStyle.welcomeText}>Welcome!</Text>
        <TouchableOpacity style={homeStyle.TouchableOpacity} onPress={() => sendToProfile(user)}>
          <Image 
            style={homeStyle.Image}
            source={{ uri: userImage}}
          />
        </TouchableOpacity>
      </View>

      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: '#6B4E71',
          height: 3,
        }}
        variant='default'
      >
        <Tab.Item
          title="Reviews"
          titleStyle={{ color: "#6B4E71", fontSize: 12 }}
        />
        <Tab.Item
          title="Posts"
          titleStyle={{ color: "#6B4E71", fontSize: 12 }}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ width: '100%' }}>
          <FlatList 
            data={review}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <ReviewTile
                review_id={item.id}
                user_id = {user}
                review_user_id={item.review_user_id}
                review_user_name={item.review_user_name}
                review_user_image={item.review_user_profile}
                country={item.country}
                image={item.image}
                review_title={item.title}
                text={item.text}
                date={item.date}
                likes_counter={item.likes}
                tags={item.tags}
                navigation={navigation}
              />
            )}
          />
        </TabView.Item>
        <TabView.Item style={{ width: '100%' }}>
          <FlatList
            data={post}
            virtualized={true}
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
        </TabView.Item>
      </TabView>

      
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
    aspectRatio: 1, 
    borderRadius: 100,
  },

  SearchImage: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    aspectRatio: 1, 
    borderRadius: 100,
  },

  welcomeText: {
    marginLeft: 10,
    fontSize: 50, 
  }
})