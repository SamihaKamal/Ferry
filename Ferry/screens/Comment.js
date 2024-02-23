import { StyleSheet, Text, View, Button, ScrollView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import CommentTile from '../components/CommentTile';

export default function Comment({ route }) {
    const { user, post } = route.params;
    const [comments, setComments] = useState([]);
    const [userComment, setUserComment] = useState();

    console.log("Heehee")
    console.log(user)
    useEffect(() =>{
        getComments() 
        console.log("Check we get to this point - COMMENT VERSION") 
    }, [])

    function mapReplies(replies) {
      console.log("IN MAP REPLIES")
      console.log(replies)
      if (!replies) return []

      return replies = replies.map((a) => ({
        id: a.id,
        user: a.user.name,
        content: a.content,
        date: a.date,
        likes: a.likes,
        replies: mapReplies(a.replies)
      }))
  }
  
    async function getComments(){
      const request = await fetch(`http://192.168.0.68:8000/api/get+comments+with+post/?post_id=${post}`)
      const response = await request.json()

      

      const responseData = response.Comments.map((a) =>({
        id: a.id,
        user: a.user.name,
        content: a.content,
        date: a.date,
        likes: a.likes,
        replies: mapReplies(a.replies),
      }));

      console.log(responseData)
      setComments(responseData)
      console.log("UNDERNEATH IS REPLIES!!!!")
      console.log(responseData.replies)

    }

    async function addComment(){
      const data = {
        user_id: user,
        post_id: post,
        comment_body: userComment,
      }
      try{
        const request = await fetch('http://192.168.0.68:8000/api/create+comments+for+post/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
        console.log("Do we get here mate222222?")
        const response = await request.json()
        console.log("Do we get here mate?")
        console.log("Response status:", response.status);
        if (response){
          getComments()
        }
        else{
          console.log("Uh oh theres an error!")
        }
        console.log("Lemme seee...")
        console.log(response)
      }
      catch (error){
        console.log("Something went wrong: ", error.message)
      }
      

    }

  return (
    <View>
      <Text>User is: {user}</Text>
      <Text>Post is: {post}</Text>
      <TextInput placeholder="User Comment" value={userComment} onChangeText={setUserComment}/>
      <Button title="Create post" onPress={addComment}/>
      <ScrollView  style={{ height: '80%' }}>
        {comments.map((a,index) => (
          <CommentTile key={index}
          id={a.id}
           name={a.user}
           user_id={user}
            content={a.content}
              date={a.date}
               likes={a.likes}
                 replies={a.replies}/>
        ))}
      
      <Button title="Register" onPress={getComments}/>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}