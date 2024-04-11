import { StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Dialog,
  ListItem,
  } from '@rneui/themed';

export default function CreatePost({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [caption, setCaption] = useState('');
  const [country, setCountry] = useState([]);
  const [displayCountry, setDisplayCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [ visible, setVisible ] = useState(false);
  const [image, setImage] = useState(null);
  const [tag, setTag] = useState();
  const [currentTags, setCurrentTags] = useState([]);

  useEffect(() =>{
    getCountryTags()
}, [])

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const saveCountry = (countryid, countryname) => {
    setSelectedCountry(countryid)
    setDisplayCountry(countryname)
    toggleVisible()
  }

  async function getCountryTags() {
    const request = await fetch(`http://192.168.0.68:8000/api/get+country+tags/`)
    const response = await request.json()

    const Data = response.country.map((a) =>({
      id: a.id,
      name: a.name,
      tag: a.tag,
    }));

    setCountry(Data)
  }

  async function savePost() {
    if (caption == ''){
      Alert.alert("Unable to create post","Please enter a caption")
      return
    }  
    if (currentTags.length === 0){
      Alert.alert("Unable to create post","Please enter atleast one tag")
      return
    }  
    if (image == null){
      Alert.alert("Unable to create post","Please add an image")
      return
    }  
    const data = new FormData();
    data.append('user_id', user);
    data.append('caption', caption);
    data.append('country_tag', selectedCountry)
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
      setCurrentTags([])
      setCaption('')
      setImage(null)
      navigation.navigate('MainPages', {user: user.user_id})
    }
  }

  const addTag = () => {
    if (tag.trim()) { // Only add non-empty tags
      setCurrentTags(currentTags => [...currentTags, tag]); // Add the new tag to the tags array
      setTag(''); // Clear the tag input field
    } 
  }

  const removeTag = (index) => {
    setCurrentTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

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
    <View style={PostStyle.container}>
       <TouchableOpacity onPress={toggleVisible} style={PostStyle.selectCountryButton}>
        <Text style={PostStyle.buttonText}>Click to select country tag</Text>
       </TouchableOpacity>
       <View style={PostStyle.selectedCountryContainer}>
        <Text style={PostStyle.selectedCountry}>{displayCountry}</Text>
       </View>
       <Dialog
            isVisible={visible}
            onBackdropPress={toggleVisible}>
                <Dialog.Title title="Choose Tag"/>
                {country.map((a, index) => (
                    <ListItem
                    key={index}
                    onPress={() => saveCountry(a.id, a.name)}>
                        <ListItem.Content>
                            <ListItem.Title>
                                {a.tag}
                            </ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </Dialog>
       <Text style={PostStyle.label}>Enter caption:</Text>
       <TextInput placeholder="Caption" value={caption} onChangeText={setCaption} style={PostStyle.captionInput} />
       <Text style={PostStyle.label}>Enter tags:</Text>
       <TextInput placeholder="Tag" value={tag} onChangeText={setTag} style={PostStyle.input} />
       <TouchableOpacity onPress={addTag} style={PostStyle.selectCountryButton}>
        <Text style={PostStyle.buttonText}>Add Tag</Text>
       </TouchableOpacity>

       <View style={PostStyle.tagsContainer}>
        {currentTags.map((tag, index) => (
          <TouchableOpacity key={index} style={PostStyle.postTag} onPress={() => removeTag(index)}>
            <Text style={PostStyle.tagText}>{tag} x</Text>
          </TouchableOpacity>
        ))}
      </View>

       <View style={PostStyle.imageContainer}>
        <TouchableOpacity onPress={pickImage} style={PostStyle.cameraIcon}>
          <Ionicons name={'camera-outline'} />
          <Text style={PostStyle.addImageText}>Add Image</Text>
        </TouchableOpacity>
        <Image 
        style={{ width: 200, height: 200, marginLeft: 'auto'}}
        source={{ uri: image }}/>
       </View>
       
      <StatusBar style="auto" />
      <TouchableOpacity style={PostStyle.create} onPress={savePost}>
        <Text style={{fontSize: 30, color: '#E4ECF9',}}>Create post</Text>
      </TouchableOpacity>
    </View>
  );
}

const PostStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  create: {
    height: 60,
    backgroundColor: "#53687E",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedCountryContainer: {
    width: 'auto',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },

  selectCountryButton: {
    backgroundColor: '#6B4E71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 5,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

  selectedCountry: {
    fontSize: 16,
    marginBottom: 10,
    
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },

  captionInput: {
    borderWidth: 1,
    width: 'auto',
    height: 100,
    borderColor: '#ccc',
    borderRadius: 5,
  },

  input: {
    borderWidth: 1,
    width: 'auto',
    height: 50,
    borderColor: '#ccc',
    borderRadius: 5, 
  },

  cameraIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  addImageText: {
    fontSize: 16,
    marginLeft: 5,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  postTag: {
    borderRadius: 40,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 4,
    backgroundColor: '#C2B2B4',
  },

  tagText: {
    fontSize: 16,
  },
})