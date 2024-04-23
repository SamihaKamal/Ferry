import { StyleSheet, Text, View, Image, Modal, Button, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import PostTile from '../components/Post';
import * as ImagePicker from 'expo-image-picker';
import ReviewTile from '../components/Review';
import { useNavigation } from '@react-navigation/native';
import ProfileTabs from '../components/ProfileTabs';
import {
  Dialog,
  CheckBox,
  ListItem,
  Tab, TabView
  } from '@rneui/themed';
  import IPAddress from '../components/IPAddress';

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
  const [ newName, setNewName ] = useState('');
  const [ editDialogVisible, setEditDialogVisible ] = useState(false);
  const [ visible, setVisible ] = useState(false);
  const [ listData, setListData ] = useState([]);
  const [ commentID, setCommentID ] = useState(0);
 

  useEffect(() =>{
    getUserData()
    getLists()
}, [])

  async function getLists(){
    const request = await fetch(`http://${IPAddress()}/api/get+user+lists/?user_id=${user}`)
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
    const request = await fetch(`http://${IPAddress()}/api/get+user/?user_id=${viewuser}`)
    const response = await request.json()

    if (response){
      setUserData(response.user)
    }

    // Getting posts
    const postRequest = await fetch(`http://${IPAddress()}/api/get+user+posts/?user_id=${viewuser}`)
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

    const reviewRequest = await fetch(`http://${IPAddress()}/api/get+user+reviews/?user_id=${viewuser}`)
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

    //Get comments of user

    const commentRequest = await fetch(`http://${IPAddress()}/api/get+user+comments/?user_id=${viewuser}`)
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
    const request = await fetch(`http://${IPAddress()}/api/create+chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const response = await request.json()
    if(response){
      const chat_id = response.chat
      navigation.navigate('Message', {user: user, recipent: viewuser, chat: chat_id })
    }
    
  }

  const toggleVisible = (id) => {
    setCommentID(id)
    setVisible(!visible);
  };

  //Change if edit button should be visible
  const toggleEditVisible = () => {
    setEditDialogVisible(!editDialogVisible)
  }

  async function saveList(listId){
    const data={
        user_id: user,
        list_id: listId,
        comment_id: commentID,
    }
    const request = await fetch(`http://${IPAddress()}/api/save+comment+to+list/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    toggleVisible(0)
    alert("Post saved!")
}

  async function editProfile() {
    if (newName == ''){
      Alert.alert("Unable to edit name","Please enter a name")
      toggleEditVisible()
      return;
    }
    const data = new FormData();
      data.append('user_id', user);
      data.append('user_name', newName )
     
      const request = await fetch(`http://${IPAddress()}/api/edit+user+name/`,{
        method: 'POST',
        body: data,
      })

      const response = await request.json()
      if (response){
        setNewName('')
        toggleEditVisible()
        getUserData()
      }
    
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });

    if (!result.canceled){
      const data = new FormData();
      data.append('user_id', user);
      data.append('user_image', {
        uri: result.assets[0].uri,
        name: 'photo.jpg',
        type: 'image/jpg',
      })
     
      const request = await fetch(`http://${IPAddress()}/api/edit+user+image/`,{
        method: 'POST',
        body: data,
      })
      const response = await request.json()
      if (response){
        getUserData()
      }
    }
  }

  return (
    <View style={ProfileStyle.container}>
      <View style={ProfileStyle.profileContainer}>
        {/* This place is where the user image and title is, there is also the chat button OR the edit button. depends on the user id and the id of the profile user */}
        <TouchableOpacity style={ProfileStyle.TouchableOpacity} onPress={pickImage}>
          <Image 
            style={ProfileStyle.Image}
            source={{ uri: userData.image}}
          />
        </TouchableOpacity>
        <View>
          <Text style={ProfileStyle.username}>{userData.name}</Text>
        </View>
        <TouchableOpacity style={{display: editChatVisible, marginLeft: 'auto', backgroundColor: 'white'}} onPress={sendToChat}>
          <Ionicons name={'chatbubble'} size={30} color={'grey'}/>
        </TouchableOpacity>
        <TouchableOpacity style={{display: editVisible, marginLeft: 'auto', backgroundColor: 'white'}} onPress={toggleEditVisible}>
          <Ionicons name={'settings'} size={30} color={'grey'}/>
        </TouchableOpacity>
        
      </View>
      {/* Displays all the posts reviews and comments using the react native element tabs */}
      <View style={{flex: 1}}>
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
          <Tab.Item
            title="Comments"
            titleStyle={{ color: "#6B4E71", fontSize: 12 }}
          />
        </Tab>

        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item style={{ width: '100%' }}>
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
          </TabView.Item>
          <TabView.Item style={{ width: '100%' }}>
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
          </TabView.Item>
          <TabView.Item  style={{ width: '100%' }}>
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
          </TabView.Item>
        </TabView>

      </View>
      {/* Dialog shown when you click + to save something to a list */}
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
        {/* This is the dialog to edit your name, (not picture thats done just by clicking the profile picture Touchable opacity) */}
        <Dialog
          isVisible={editDialogVisible}
          onBackdropPress={toggleEditVisible}
        >
          <Dialog.Title title="Edit name"/>
          <Text>To edit profile picture just click your picture on the profile screen</Text>
          <TextInput placeholder="Enter name here" value={newName} onChangeText={setNewName} style={{borderWidth: 1,
            width: 'auto',
            marginTop: 5,
            height: 50,
            borderColor: '#ccc',
            borderRadius: 5,}}/>
            <Dialog.Actions>
              <Dialog.Button title="Cancel" onPress={toggleEditVisible}/>
              <Dialog.Button title="Ok" onPress={editProfile}/>
            </Dialog.Actions>
        </Dialog>
      <StatusBar style="auto" />
    </View>
  );
}

//Stylesheet
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