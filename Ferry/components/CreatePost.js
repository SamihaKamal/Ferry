import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export default function CreatePost() {
  const [caption, setCaption] = useState();
  const [image, setImage] = useState();
  const [tag, setTag] = useState();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });

    console.log(result)

    if (!result.canceled){
      setImage(result.assets[0].uri)
    }
  }

  return (
    <View>
       <TextInput placeholder="Caption" value={caption} onChangeText={setCaption}/>
       <TextInput placeholder="Tag" value={tag} onChangeText={setCaption}/>
       <Button title="Click me please" onPress={pickImage}/>
       <Image 
       style={{ width: 100, height: 100}}
       source={{ uri: image }}/>
      <StatusBar style="auto" />
    </View>
  );
}