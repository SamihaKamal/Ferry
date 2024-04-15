import { StyleSheet, Text, View, Image, Modal, Button, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import PostTile from '../components/Post';
import ReviewTile from '../components/Review';
import { useNavigation } from '@react-navigation/native';
import ProfileTabs from '../components/ProfileTabs';
import {
  Dialog,
  CheckBox,
  ListItem,
  Avatar,
  } from '@rneui/themed';

export default function Profile({ route }) {
  const { user, viewuser } = route.params;
  const navigation = useNavigation();
  const [ userData, setUserData ] = useState([]);
  const [ userPosts, setUserPosts] = useState([]);
  const [ userComments, setUserComments] = useState([]);
  const [ userReviews, setUserReviews] = useState([]);
  const [ editVisible, setEditVisible] = useState('none');
  const [ editChatVisible, setEditChatVisible] = useState('visible');
  const [ index, setIndex ] = useState(0);
  const [ visible, setVisible ] = useState(false);
  const [ listData, setListData ] = useState([]);
  const [ commentID, setCommentID ] = useState(0);
 

  useEffect(() =>{
    getUserData()
    getLists()
}, [])

  async function getLists(){
    const request = await fetch(`http://192.168.0.68:8000/api/get+user+lists/?user_id=${user}`)
    const response = await request.json()

    const responseData = response.lists.map((a) => ({
        id: a.id,
        list_user_id: a.user.id,
        name: a.name,
    }))

    setListData(responseData)
  }



  async function getUserData(){
    if (user==viewuser){
      setEditVisible('visible')
      setEditChatVisible('none')
    }
    const request = await fetch(`http://192.168.0.68:8000/api/get+user/?user_id=${viewuser}`)
    const response = await request.json()

    if (response){
      setUserData(response.user)
    }

    // Getting posts
    const postRequest = await fetch(`http://192.168.0.68:8000/api/get+user+posts/?user_id=${viewuser}`)
    const postResponse = await postRequest.json()
    
    const postData = postResponse.posts.map((a) =>({
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
    setUserPosts(postData)

    // Getting reviews

    const reviewRequest = await fetch(`http://192.168.0.68:8000/api/get+user+reviews/?user_id=${viewuser}`)
    const reviewResponse = await reviewRequest.json()

    const reviewData = reviewResponse.reviews.map((a) => ({
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
    }))

    setUserReviews(reviewData)

    const commentRequest = await fetch(`http://192.168.0.68:8000/api/get+user+comments/?user_id=${viewuser}`)
    const commentResponse = await commentRequest.json()
    const commentData = commentResponse.comments.map((a) =>({
      id: a.id,
      user: a.user.name,
      content: a.content,
      date: a.date,
      likes: a.likes,
    }));

    setUserComments(commentData)
  }

  async function sendToChat(){
    const data={
      user_id: user,
      to_user_id: viewuser
    }
    const request = await fetch('http://192.168.0.68:8000/api/create+chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const response = await request.json()
    if(response){
      const chat_id = response.chat
      navigation.navigate('Message', {user: user, recipent: viewuser, chat: chat_id, navigation: navigation})
    }
    
  }

  const toggleVisible = (id) => {
    setCommentID(id)
    setVisible(!visible);
  };

  async function saveList(listId){
    const data={
        user_id: user,
        list_id: listId,
        comment_id: commentID,
    }
    const request = await fetch('http://192.168.0.68:8000/api/save+comment+to+list/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    toggleVisible(0)
    alert("Post saved!")
}

  const likeComment = () => {
    console.log("Clicked")
  }

  return (
    <View style={ProfileStyle.container}>
      <View style={ProfileStyle.profileContainer}>
        <TouchableOpacity style={ProfileStyle.TouchableOpacity}>
          <Image 
            style={ProfileStyle.Image}
            source={{ uri: userData.image}}
          />
        </TouchableOpacity>
        <View>
          <Text style={ProfileStyle.username}>{userData.name}</Text>
          <Text>{userData.email}</Text>
        </View>
        <TouchableOpacity style={{display: editChatVisible, marginLeft: 'auto', backgroundColor: 'white'}} onPress={sendToChat}>
          <Ionicons name={'chatbubble'} size={30} color={'white'}/>
        </TouchableOpacity>
        <TouchableOpacity style={{display: editVisible, marginLeft: 'auto', backgroundColor: 'white'}}>
          <Ionicons name={'settings'} size={30} color={'grey'}/>
        </TouchableOpacity>
        
      </View>
      <View style={{flex: 1}}>
       <ProfileTabs tabs={['Posts','Reviews','Comments']}
       initalTab={0}
       onChange={setIndex}/>
  
       {index === 0 && (
        <ScrollView style={{ flex: 1 }}>
           {userPosts.map((password, index ) => (
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
        )}
        {index === 1 && (
          <ScrollView>
            {userReviews.map((item, index ) => (
            <ReviewTile key={index}
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
          ))}
          </ScrollView>
        )}
        {index === 2 && (
          <ScrollView style={ProfileStyle.commentsContainer}>
            {userComments.map((comment, index) => (
              <View key={index} style={ProfileStyle.commentContainer}>
                <Text style={ProfileStyle.commentUser}>{comment.user}</Text>
                <Text style={ProfileStyle.commentContent}>{comment.content}</Text>
                <View style={ProfileStyle.infoContainer}>
                  <Text style={ProfileStyle.commentDate}>{comment.date}</Text>
                  <View style={[ProfileStyle.buttons]}>      
                      <TouchableOpacity style={ProfileStyle.smallButton} onPress={() => toggleVisible(comment.id)}>
                          <Ionicons name={'add-outline'} size={30} color="#A9D18E"/>
                      </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <Dialog
            isVisible={visible}
            onBackdropPress={() => toggleVisible(0)}>
                <Dialog.Title title="Choose List"/>
                {listData.map((a, index) => (
                    <ListItem
                    key={index}
                    onPress={() => saveList(a.id)}>
                        <ListItem.Content>
                            <ListItem.Title>
                                {a.name}
                            </ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </Dialog>
      <StatusBar style="auto" />
    </View>
  );
}

const ProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', 
  },

  TouchableOpacity: {
    marginRight: 10,
    margin: 20,
  },

  Image: {
    marginRight: 'auto',
    width: 100,
    height: 100,
    aspectRatio: 1, // Maintain the aspect ratio to prevent distortion
    borderRadius: 100,
  },

  username: {
    marginTop: 30,
    fontSize: 30,  
  },
  commentsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flex: 1
  },
  commentContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentContent: {
    marginTop: 5,
  },
  commentDate: {
    color: '#888',
    marginTop: 5,
  },

  infoContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Align items vertically
    justifyContent: 'space-between',
    marginTop: 'auto',
    position: 'relative',
  },

  buttons: {
      flexDirection: 'row', // Align items horizontally
      alignItems: 'center', // Align items vertically
      justifyContent: 'flex-end',
      padding: 5,
  },

  smallButton: {
      float: 'left',
      display: 'inline-block',
  },
})