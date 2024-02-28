import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import PostTile from '../components/Post';
import ProfileTabs from '../components/ProfileTabs';

export default function CountrySpecificPage({ route }) {
  const { user, country, navigation } = route.params;
  const [ countryData, setCountryData ] = useState([]);
  const [ postData, setPostData ] = useState([]);
  const [ imageData, setImageData ] = useState([]);
  const [ index, setIndex ] = useState(0);


  useEffect(() =>{
    getCountry()
}, [])

  async function getCountry(){
    const request = await fetch(`http://192.168.0.68:8000/api/get+country+from+id/?country_id=${country}`)
    const response = await request.json()

    if (response){
        const responseData={
            id: response.country.id,
            name: response.country.name,
            tag: response.country.tag,
        }

        setCountryData(responseData)
    }

    const postrequest = await fetch(`http://192.168.0.68:8000/api/get+country+posts/?country_id=${country}`)
    const postresponse = await postrequest.json()

    if(postresponse){
        const postData = postresponse.posts.map((a) =>({
            id: a.id,
            user: a.user.name,
            user_profile: a.user_image,
            caption: a.caption,
            image: a.image,
            date: a.date,
            likes: a.likes,
            country: a.country,
            tags: a.tags,
        }));
        setPostData(postData)
    }

    const imagerequest = await fetch(`http://192.168.0.68:8000/api/get+country+image/?country_id=${country}`)
    const imageresponse = await imagerequest.json()

    if(imageresponse){
        const imageData = imageresponse.posts.map((a) =>({
            id: a.id,
            user: a.user.name,
            image: a.image,
        }));
        setImageData(imageData)
    }
  }

  return (
    <View style={countryStyle.container}>
      <Text>This a the following screen</Text>
      <View>
        <Text>{countryData.name}</Text>
      </View>

      <View style={{flex: 1}}>
       <ProfileTabs tabs={['Posts','Reviews','Images']}
       initalTab={0}
       onChange={setIndex}/>
       {index === 0 && (
        <ScrollView style={{ flex: 1 }}>
         {postData.map((password, index ) => (
          <PostTile key={index}
           id={password.id}
            name={password.user}
            user_image={password.user_profile}
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
          <View>
            {/* Render reviews */}
          </View>
        )}
        {index === 2 && (
          <ScrollView>
           {imageData.map((a, index) => (
            <Image key={index}
                style={countryStyle.Image}
                source={{ uri: a.image}}
            />
           ))}
          </ScrollView>
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const countryStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    Image: {           
        width: 50,
        height: 100,
        aspectRatio: 1, // Maintain the aspect ratio to prevent distortion         
    }
})