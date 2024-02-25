import { StyleSheet, Text, View, Image, Modal, Button, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import PostTile from '../components/Post';
import ProfileTabs from '../components/ProfileTabs';

export default function Profile({ route }) {
  const { user, viewuser, navigation } = route.params;
  const [ userData, setUserData ] = useState([]);
  const [ userPosts, setUserPosts] = useState([]);
  const [ userComments, setUserComments] = useState([]);
  const [ userReviews, setUserReviews] = useState([]);
  const [ editVisible, setEditVisible] = useState('none');
  const [ editChatVisible, setEditChatVisible] = useState('visible');
  const [ modalVisible, setModalVisible] = useState(false);
  const [ index, setIndex ] = useState(0);
 

  useEffect(() =>{
    getUserData()
}, [])


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

    const postRequest = await fetch(`http://192.168.0.68:8000/api/get+user+posts/?user_id=${viewuser}`)
    const postResponse = await postRequest.json()
    
    const postData = postResponse.posts.map((a) =>({
      id: a.id,
      user: a.user.name,
      caption: a.caption,
      image: a.image,
      date: a.date,
      likes: a.likes,
      country: a.country,
      tags: a.tags,
    }));
    setUserPosts(postData)

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

  function sendToChat(){
    navigation.navigate('Message', {user: user, recipent: viewuser, navigation: navigation})
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
        <TouchableOpacity style={{display: editChatVisible, marginLeft: 'auto', paddingRight: 10, backgroundColor: 'pink'}} onPress={sendToChat}>
          <Ionicons name={'chatbubble'} size={30} color={'white'}/>
        </TouchableOpacity>
        <TouchableOpacity style={{display: editVisible, marginLeft: 'auto', paddingRight: 10, backgroundColor: 'pink'}}>
          <Ionicons name={'settings'} size={30} color={'white'}/>
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
            user_id={viewuser}
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
          <View>
            {/* Render favorite posts */}
          </View>
        )}
        {index === 2 && (
          <ScrollView style={ProfileStyle.commentsContainer}>
            {userComments.map((comment, index) => (
              <View key={index} style={ProfileStyle.commentContainer}>
                <Text style={ProfileStyle.commentUser}>{comment.user}</Text>
                <Text style={ProfileStyle.commentContent}>{comment.content}</Text>
                <Text style={ProfileStyle.commentDate}>{comment.date}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
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
    backgroundColor: 'pink', 
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
})