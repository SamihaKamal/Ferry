import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';

export default function CreatePost({ route }) {
  const { user } = route.params;
  const [caption, setCaption] = useState();
  const [image, setImage] = useState();
  const [tag, setTag] = useState();
  const [currentTags, setCurrentTags] = useState([]);

  async function savePost() {
    const data = new FormData();
    data.append('user_id', user);
    data.append('caption', caption);
    data.append('image', {
      uri: image,
      name: 'photo.jpg',
      type: 'image/jpg',
    })
    currentTags.forEach((tag) => {
      data.append('tag', tag)
    })

    const request = await fetch('http://192.168.0.68:8000/api/create_post/',{
      method: 'POST',
      body: data,
    })

    const response = await request.json()
    if (response) {
      navigation.navigate('MainPages', {user: user.user_id})
    }
  }

  const addTag = () => {
    if (tag.trim()) { // Only add non-empty tags
      setCurrentTags(currentTags => [...currentTags, tag]); // Add the new tag to the tags array
      setTag(''); // Clear the tag input field
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
      setImage(result.assets[0].uri)
    }
  }

  return (
    <View>
       <TextInput placeholder="Caption" value={caption} onChangeText={setCaption}/>
       <TextInput placeholder="Tag" value={tag} onChangeText={setTag}/>
       <Button title="Add tag" onPress={addTag}/>
       <Button title="Click me please" onPress={pickImage}/>
       <Image 
       style={{ width: 100, height: 100}}
       source={{ uri: image }}/>
      <StatusBar style="auto" />
      <Button title="Create post" onPress={savePost} />
    </View>
  );
}