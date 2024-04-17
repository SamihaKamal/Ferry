import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {  Card, Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import ListDetail from './ListDetail';

export default function SpecificLists({ route }) {
  const { user, list } = route.params;
  const navigation = useNavigation();
  const [ postData, setPostData ] = useState([]);
  const [ reviewData, setReviewData ] = useState([]);
  const [ commentData, setCommentData ] = useState([]);
  const [ listData, setListData ] = useState([]);

  useEffect(() =>{
    getListData()
    getPosts()
    getReviews()
    getComments()
  }, [])

  async function getListData(){
    const request = await fetch(`http://192.168.0.68:8000/api/get+list/?list_id=${list}`)
      const response = await request.json()

      const responseData = {
          id: response.list.id,
          list_user_id: response.list.user.id,
          name: response.list.name,
      }

      setListData(responseData)
  }

  async function getPosts() {
    const request = await fetch(`http://192.168.0.68:8000/api/get+list+post/?list_id=${list}`)
    const response = await request.json()

  
    if (response){
      const responseData = response.posts.map((a) =>({
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

      setPostData(responseData)
    }
  }

  async function getReviews() {
    const request = await fetch(`http://192.168.0.68:8000/api/get+list+review/?list_id=${list}`)
    const response = await request.json();

    if (response){
      const responseData = response.reviews.map((a) => ({
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
      }));

      setReviewData(responseData)
    }
  }

  async function getComments(){
    const request = await fetch(`http://192.168.0.68:8000/api/get+list+comment/?list_id=${list}`)
    const response = await request.json()

    if (response){
      const responseData = response.comments.map((a) =>({
        id: a.id,
        user: a.user.name,
        user_id: a.user.id,
        user_profile: a.user_image,
        content: a.content,
        date: a.date,
        likes: a.likes,
      }));

      setCommentData(responseData)
    }
  }

  const sendToProfile = (viewuser) => {
    navigation.navigate('Profile', {user: user, viewuser: viewuser})
  }

  const seeMore = (flag) => {
    navigation.navigate('ListExtention', {user: user, list: list, flag: flag})
  }

  const openDetail = (flag, id) => {
    navigation.navigate('ListDetail', {user: user, id: id, flag: flag})
  }

  return (
    <ScrollView style={{flex: 1}}>
      <Text style={{ fontSize: 50, alignSelf: 'center' }}>{listData.name}</Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={ ListStyle.titleText }>Posts:</Text>
        <TouchableOpacity style={{ marginLeft: 'auto', marginRight: 10,}} onPress={() => seeMore(0)}>
          <Text style={{ color: 'grey'}}>see more...</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{flexDirection: 'row'}} horizontal={true}>
        {postData.map((a, index) => (
          <Card key={index} containerStyle={{width: 200, borderRadius: 10}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => sendToProfile(a.post_user_id)}>
                  <Image 
                      style={ListStyle.SearchImage}
                      source={{ uri: a.user_profile }}
                    />
                </TouchableOpacity>
              <Card.Title>{a.user}</Card.Title>
            </View>
            <Card.Divider />
            <Image 
              style={{width: '100%', aspectRatio: 1, }}
              source={{ uri: a.image }}
            />
            <Text>{a.caption}</Text>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => openDetail('p', a.id)}>
              <Text style={{color: 'grey',}}>Click to view in detail</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>

      <View style={{flexDirection: 'row'}}>
        <Text style={ ListStyle.titleText }>Reviews:</Text>
        <TouchableOpacity style={{ marginLeft: 'auto', marginRight: 10,}} onPress={() => seeMore(1)}>
          <Text style={{ color: 'grey'}}>see more...</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {reviewData.map((a, index) => (
          <Card key={index} containerStyle={{width: 200, borderRadius: 10}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => sendToProfile(a.review_user_id)}>
                <Image 
                    style={ListStyle.SearchImage}
                    source={{ uri: a.review_user_profile }}
                  />
              </TouchableOpacity>
              <Card.Title>{a.review_user_name}</Card.Title>
            </View>
            <Card.Divider />
            <Text>{a.title}</Text>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => openDetail('r', a.id)}>
              <Text style={{color: 'grey',}}>Click to view in detail</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>

      <View style={{flexDirection: 'row'}}>
        <Text style={ ListStyle.titleText }>Comments:</Text>
        <TouchableOpacity style={{ marginLeft: 'auto', marginRight: 10,}} onPress={() => seeMore(2)}>
          <Text style={{ color: 'grey'}}>see more...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{flexDirection: 'row'}} horizontal={true}>
        {commentData.map((a, index) => (
          <Card key={index} containerStyle={{width: 200, borderRadius: 10}}>
             <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => sendToProfile(a.user_id)}>
                  <Image 
                      style={ListStyle.SearchImage}
                      source={{ uri: a.user_profile }}
                    />
                </TouchableOpacity>
              <Card.Title>{a.user}</Card.Title>
              </View>
            <Card.Divider />
            <Text>{a.content}</Text>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => openDetail('c', a.id)}>
              <Text style={{color: 'grey',}}>Click to view post in detail</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const ListStyle = StyleSheet.create({
  SearchImage: {
    marginBottom: 4,
    width: 40,
    height: 40,
    aspectRatio: 1, // Maintain the aspect ratio to prevent distortion
    borderRadius: 100,
  },

  titleText: {
    marginLeft: 20,
    fontSize: 20,
  }
})