import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import ReviewTile from '../components/Review';
import PostTile from '../components/Post';
import { ListItem, Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';


export default function ListDetail({ route }) {
  const { user, flag, id } = route.params;
  const navigation = useNavigation();
  const [ itemData, setItemData ] = useState([]);
  const [ commentFlag, setCommentFlag ] = useState();

  useEffect(() =>{
    getData()
}, [])
    
  async function getData(){
    console.log(id, flag)
    const response = await fetch(`http://192.168.0.68:8000/api/get+item+by+id/?id=${id}&flag=${flag}`)
    const request = await response.json()
    
    if (flag == 'r'){
        a = request.review
        setItemData(serialiseReview(a))
    }
    else if (flag == 'p'){
        a = request.post
        console.log(a)
        setItemData(serialisePost(a))
    }
    else{
        
        if (request.review){
            a = request.review
            setCommentFlag('r')
            setItemData(serialiseReview(a))
        }
        else{
            a = request.post
            setCommentFlag('p')
            setItemData(serialisePost(a))
        }
    }
  }

  const serialisePost = (data) => {
    a = {
        id: data.id,
        post_user_id:data.user.id,
        user: data.user.name,
        user_profile: data.user_image,
        caption: data.caption,
        image: data.image,
        date: data.date,
        likes: data.likes,
        country: data.country,
        tags: data.tags, 
    }
    console.log(a)
    return a
  }

  const serialiseReview = (data) => {
    a = {
        id: data.id,
        review_user_id: data.user.id,
        review_user_name: data.user.name,
        review_user_profile: data.user_image,
        image: data.image,
        title: data.review_title,
        text: data.review_body,
        date: data.date,
        likes: data.likes,
        country: data.country,
        tags: data.tags,
    }
    console.log(a)
    return a
  }

  return (
    <View>
        {(flag === 'r' || commentFlag === 'r') && itemData && itemData.id && (
             <ReviewTile
                review_id={itemData.id}
                user_id = {user}
                review_user_id={itemData.review_user_id}
                review_user_name={itemData.review_user_name}
                review_user_image={itemData.review_user_profile}
                country={itemData.country}
                image={itemData.image}
                review_title={itemData.title}
                text={itemData.text}
                date={itemData.date}
                likes_counter={itemData.likes}
                tags={itemData.tags}
                navigation={navigation}
           />
        )}
        {(flag === 'p' || commentFlag === 'p') && itemData && itemData.id && (
            <PostTile
                id={itemData.id}
                name={itemData.user}
                user_image={itemData.user_profile}
                post_user_id={itemData.post_user_id}
                user_id={user}
                caption={itemData.caption}
                image={itemData.image}
                date={itemData.date}
                likes={itemData.likes}
                country={itemData.country}
                tags={itemData.tags}
                navigation={navigation}
          />
        )}
    </View>
  );
}