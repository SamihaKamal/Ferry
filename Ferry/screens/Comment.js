import { StyleSheet, Text, View, Button, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import CommentTile from '../components/CommentTile';
import { Ionicons } from '@expo/vector-icons';

export default function Comment({ route }) {
    const { user, post, review, viewuser } = route.params;
    const [comments, setComments] = useState([]);
    const [userComment, setUserComment] = useState();

    useEffect(() =>{
        getComments() 
    }, [])

    async function refreshComments(){
      getComments();
    }

    function mapReplies(replies) {
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
      if (review == 0){
        const request = await fetch(`http://192.168.0.68:8000/api/get+comments/?id=${post}&tag=p`)
        const response = await request.json()
        const responseData = response.Comments.map((a) =>({
          id: a.id,
          user: a.user.name,
          content: a.content,
          date: a.date,
          likes: a.likes,
          replies: mapReplies(a.replies),
        }));

        setComments(responseData)
      }
      else if(post == 0){
        const request = await fetch(`http://192.168.0.68:8000/api/get+comments/?id=${review}&tag=r`)
        const response = await request.json()
        const responseData = response.Comments.map((a) =>({
          id: a.id,
          user: a.user.name,
          content: a.content,
          date: a.date,
          likes: a.likes,
          replies: mapReplies(a.replies),
        }));

        setComments(responseData)
      }
      else{
        console.log("error")
      }
          
    }

    async function addComment(){
      const data = {
        user_id: user,
        post_id: post,
        review_id: review,
        comment_body: userComment,
      }
      try{
        const request = await fetch('http://192.168.0.68:8000/api/create+comment/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
        
        const response = await request.json()
        if (response){
          getComments()
        }
        else{
          console.log("Uh oh theres an error!")
        }
      }
      catch (error){
        console.log("Something went wrong: ", error.message)
      }
    }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView  style={{ flex: 1 }}>
        {comments.map((a,index) => (
          <CommentTile key={index}
          id={a.id}
           name={a.user}
           user_id={user}
           post_id={post}
            content={a.content}
              date={a.date}
               likes={a.likes}
                 replies={a.replies}
                 refreshComments={refreshComments}/>
        ))}
      </ScrollView>
      <View style={CommentStyle.commentContainer}> 
        <TextInput
          style={[CommentStyle.commentBox]}
          multiline
          autoCorrect={true}
          numberOfLines={4}
          maxLength={60}
          placeholder="User Comment" 
          value={userComment} 
          onChangeText={setUserComment}/>
          <TouchableOpacity onPress={addComment}>
            <Ionicons name='arrow-forward-circle' size={50} color="#BDD7EE"/>
          </TouchableOpacity>
      </View>
     
    </View>
  );
}

const CommentStyle = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },

  commentBox: {
    flex: 1,
    backgroundColor: '#eee',
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  }
  
})