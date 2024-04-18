import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { ListItem, Avatar, Dialog } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';



export default function CreateList({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [country, setCountry] = useState([]);
  const [displayCountry, setDisplayCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [ visible, setVisible ] = useState(false);
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

  const addTag = () => {
    if (tag.trim()) { // Only add non-empty tags
      setCurrentTags(currentTags => [...currentTags, tag]); // Add the new tag to the tags array
      setTag(''); // Clear the tag input field
    } 
  }

  const removeTag = (index) => {
    setCurrentTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  async function createList(){
    if (name == ''){
        Alert.alert("Unable to create list","Please enter a name")
        return
      }  
      
      const data = new FormData();
      data.append('user_id', user);
      data.append('name', name);
      currentTags.forEach((tag, index) => {
        data.append(`tag_${index}`, tag)
      })
  
      const request = await fetch('http://192.168.0.68:8000/api/create+list/',{
        method: 'POST',
        body: data,
      })
  
      const response = await request.json()
      if (response) {
        setCurrentTags([])
        setName('')
        navigation.navigate('MainPages', {user: user})
      }
  }


 
  return (
    <View style={ListStyle.container}>
    
       <Text style={ListStyle.label}>Enter name:</Text>
       <TextInput placeholder="name" value={name} onChangeText={setName} style={ListStyle.captionInput} />
       <Text style={ListStyle.label}>Enter tags:</Text>
       <TextInput placeholder="Tag" value={tag} onChangeText={setTag} style={ListStyle.input} />
       <TouchableOpacity onPress={addTag} style={ListStyle.selectCountryButton}>
        <Text style={ListStyle.buttonText}>Add Tag</Text>
       </TouchableOpacity>

       <View style={ListStyle.tagsContainer}>
        {currentTags.map((tag, index) => (
          <TouchableOpacity key={index} style={ListStyle.postTag} onPress={() => removeTag(index)}>
            <Text style={ListStyle.tagText}>{tag} x</Text>
          </TouchableOpacity>
        ))}
      </View>
       
      <TouchableOpacity style={ListStyle.create} onPress={createList}>
        <Text style={{fontSize: 30, color: '#E4ECF9',}}>Create list</Text>
      </TouchableOpacity>
    </View>
  );
}

const ListStyle = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 40,
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
      height: 50,
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