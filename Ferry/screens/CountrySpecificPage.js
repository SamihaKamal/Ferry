import { StyleSheet, Text, View, ScrollView, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import PostTile from '../components/Post';
import { Dialog } from '@rneui/themed';
import ReviewTile from '../components/Review';
import ProfileTabs from '../components/ProfileTabs';
import { useNavigation } from '@react-navigation/native';
import IPAddress from '../components/IPAddress';

export default function CountrySpecificPage({ route }) {
  const { user, country } = route.params;
  const navigation = useNavigation();
  const [ countryData, setCountryData ] = useState([]);
  const [ visible, setVisible ] = useState(false);
  const [ imageModel, setImageModel ] = useState(false);
  const [ postData, setPostData ] = useState([]);
  const [ reviewData, setReviewData ] = useState([]);
  const [ imageData, setImageData ] = useState([]);
  const [ name, setName ] = useState();
  const [ info, setInfo ] = useState();
  const [ img, setImg ] = useState();
  const [ index, setIndex ] = useState(0);

  const window = useWindowDimensions().width;
  const imageSize = window/3;

  useEffect(() =>{
    getCountry()
    countryInfo()
}, [])

//This is a pretty inefficient way to display text, Right now i only have 4 country pages, but once i have more ill move this data to a proper database.
  const countryInfo = () => {
    if (country == 1){
      setName('England')
      setInfo('No travel advice for England')
    }
    else if (country == 2){
      setName('Sweden')
      setInfo('Terrorists are very likely to try to carry out attacks in Sweden. Attacks could be indiscriminate, including in places frequented by foreigners. The authorities in Sweden have successfully disrupted a number of planned attacks and made a number of arrests.\n\nDemonstrations in Sweden are usually peaceful. Avoid demonstrations wherever possible and follow the advice of the local authorities.\n\nTake particular care of your belongings in major cities as pickpockets often target tourists for passports and cash. Violent crime does occur. Gang-related crime, including knife crime, shootings and explosions, have been reported in Malmö, Stockholm and Gothenburg.\n\nThere are heavy punishments for importing illegal drugs. There is zero tolerance towards drugs; even petty drug use will lead to a penalty. Paying for sex is illegal. Physical punishment of children is illegal.\n\nYou can drive in Sweden on your UK driving licence.')
    }
    else if (country == 3){
      setName('Greenland')
      setInfo('No travel advice for Greenland')
    }
    else if (country == 4){
      setName('Germany')
      setInfo("Terrorists are very likely to try and carry out attacks in Germany. Attacks could be indiscriminate, including in public places frequented by foreign nationals.\n\nCrime levels are similar to the UK. Take sensible precautions to avoid mugging, bag snatching and pickpocketing. Be particularly vigilant at airports, railway stations and crowded public gatherings. Do not leave valuables unattended.\n\n If your passport has been lost or stolen, get a police report from the nearest police station. You don’t have to carry your passport with you in Germany. However, if you’re asked to show your passport and don’t have it with you, police may escort you to where your passport is being kept so that you can show it to them.\n\nSkiing and avalanches are a risk in some areas. Always check the local snow and weather conditions when you arrive")
    }
  }
  async function getCountry(){
    //This part gets the country
    const request = await fetch(`http://${IPAddress()}/api/get+country+from+id/?country_id=${country}`)
    const response = await request.json()

    if (response){
        const responseData={
            id: response.country.id,
            name: response.country.name,
            tag: response.country.tag,
        }

        setCountryData(responseData)
    }

    //Using the same method im getting all the country posts
    const postrequest = await fetch(`http://${IPAddress()}/api/get+country+posts/?country_id=${country}`)
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


  //Getting all the reviews from the country
    const reviewrequest = await fetch(`http://${IPAddress()}/api/get+country+reviews/?country_id=${country}`)
    const reviewresponse = await reviewrequest.json()

    if (reviewresponse){
      const reviewData = reviewresponse.reviews.map((a) => ({
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
      }));
      setReviewData(reviewData)
    }

    //Getting all the images for the country
    const imagerequest = await fetch(`http://${IPAddress()}/api/get+country+image/?country_id=${country}`)
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

  const toggleVisible = () => {
    setVisible(!visible)
  }

  const toggleImageModel = (img) => {
    setImageModel(!imageModel)
    setImg(img)
  }

  return (
    <View style={countryStyle.container}>
      <View>
        <Text style={{margin: 30,
      fontSize: 30, textAlign: 'center' }}>{countryData.name}</Text>
      </View>
      {/* Using the same tabs as the profile page, one is for posts, the other is for review and the last is for imaages. */}
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
          <ScrollView style={{flex: 1}}>
            {reviewData.map((a, index) => (
              <ReviewTile key={index}
              review_id={a.id}
              user_id = {user}
              review_user_id={a.review_user_id}
              review_user_name={a.review_user_name}
              review_user_image={a.review_user_profile}
              country={a.country}
              image={a.image}
              review_title={a.title}
              text={a.text}
              date={a.date}
              likes_counter={a.likes}
              tags={a.tags}
              navigation={navigation}
            />
            ))}
            
          </ScrollView>
        )}
        {index === 2 && (
          <ScrollView> 
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {imageData.map((a, index) => (
                  <TouchableOpacity key={index} onPress={() => toggleImageModel(a.image)}>
                    <Image 
                      style={[countryStyle.Image, { width: imageSize }]}
                      source={{ uri: a.image}}
                  />
                  </TouchableOpacity>
                
            ))}
            </View>
           
          </ScrollView>
        )}
      </View>
      {/* This button is the important information button */}
      <TouchableOpacity style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F5DDDD',
        margin: 10,
        marginLeft: 'auto', 
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',}} onPress={() => toggleVisible()} >
          <Text style={{color:'white', fontSize: 30}}>!</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
      {/* This dialog is for the important travel information */}
      <Dialog
        isVisible={visible}
        onBackdropPress={toggleVisible}
      >
        <Dialog.Title title={name}/>
        <Text>{info}</Text>
      </Dialog>
      {/* This dialog is for zooming into an image */}
      <Dialog
        isVisible={imageModel}
        onBackdropPress={toggleImageModel}
      >
      <Image style={{width: 'auto', aspectRatio: 1}} source={{uri: img}}/>
      </Dialog>
    </View>
  );
}

//Stylesheet
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