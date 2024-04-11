import { StyleSheet, Text, View, ScrollView, Image, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import PostTile from '../components/Post';
import ProfileTabs from '../components/ProfileTabs';
import { useNavigation } from '@react-navigation/native';

export default function CountrySpecificPage({ route }) {
  const { user, country } = route.params;
  const navigation = useNavigation();
  const [ countryData, setCountryData ] = useState([]);
  const [ postData, setPostData ] = useState([]);
  const [ imageData, setImageData ] = useState([]);
  const [ index, setIndex ] = useState(0);

  const window = useWindowDimensions().width;
  const imageSize = window/3;

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
            post_user_id: a.user.id,
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
      <View>
        <Text style={{margin: 30,
    fontSize: 30, textAlign: 'center' }}>{countryData.name}</Text>
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
          <View>
            {/* Render reviews */}
          </View>
        )}
        {index === 2 && (
          <ScrollView> 
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {imageData.map((a, index) => (
                <Image key={index}
                    style={[countryStyle.Image, { width: imageSize }]}
                    source={{ uri: a.image}}
                />
            ))}
            </View>
           
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
        height: 150,
        aspectRatio: 1, // Maintain the aspect ratio to prevent distortion      
        margin: 2,   
    }
})