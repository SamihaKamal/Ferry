import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {  Card, Button, Icon } from '@rneui/themed';

export default function SpecificLists({ route }) {
  const { user, list } = route.params;
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
        content: a.content,
        date: a.date,
        likes: a.likes,
      }));

      setCommentData(responseData)
    }
  }

  return (
    <ScrollView style={{flex: 1}}>
      <Text style={{margin: 'auto', fontSize: 50}}>{listData.name}</Text>
      <Text>Posts:</Text>
      <ScrollView style={{flexDirection: 'row'}} horizontal={true}>
        {postData.map((a, index) => (
          <Card key={index} containerStyle={{width: 200}}>
            <Card.Title>{a.user}</Card.Title>
            <Card.Divider />
            <Image 
              style={{width: 100, height: 100}}
              source={{ uri: a.image}}
            />
            <Text>{a.caption}</Text>
          </Card>
        ))}
      </ScrollView>
      <Text>Reviews:</Text>
      <ScrollView>
        {reviewData.map((a, index) => (
          <Card key={index} containerStyle={{width: 200}}>
            <Card.Title>{a.review_user_name}</Card.Title>
            <Card.Divider />
            <Text>{a.title}</Text>
          </Card>
        ))}
      </ScrollView>
      <Text>Comments</Text>
      <ScrollView style={{flexDirection: 'row'}} horizontal={true}>
        {commentData.map((a, index) => (
          <Card key={index} containerStyle={{width: 200}}>
            <Card.Title>{a.user}</Card.Title>
            <Card.Divider />
            <Text>{a.content}</Text>
          </Card>
        ))}
      </ScrollView>
    </ScrollView>
  );
}