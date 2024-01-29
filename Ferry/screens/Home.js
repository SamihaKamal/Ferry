import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PostTile from '../components/Post';
import Fav from '../assets/favicon.png';

export default function Home({ route }) {
  // Fake data!!! To be replaced with the database yah
  const { user } = route.params;

  async function getPosts() {
    const request = await fetch('http://192.168.0.59:8000/api/login/')
    const response = await request.json()

    for (a in response.Posts){
      const cheese2 = [{
        id: a.id,
        user: a.user.name,
        username: a.user.email,
        caption: a.caption,
        date: a.date,
        likes: a.likes,
        country: a.country,
      }]
    }
  }
  const cheese = [
    {name: "Plip Plop", img: Fav, caption: "Cheese louise"},
    {name: "Thelpy", img: Fav,caption: "I am addicted to genshin"},
    {name: "Rocky", img: Fav,caption: "This is a test to see if long pieces of text look alright ok aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa?"},
  ];
  return (
    <View>
      <Text>itemId: {JSON.stringify(user)}</Text>
      <Text>This a home screan yah TEST TO SEE ON BRANCH user</Text>
      {/* Theres different components within home:
      - Profile picture/profile menu
      - Welcome back title
      - Search bar
      - Posts */}
      <StatusBar style="auto" />
      <ScrollView>
        {cheese2.map((cheese2, index ) => (
          <PostTile key={index} name={cheese2.user} caption={cheese2.caption} img={cheese.img}/>
        ))}
        <PostTile 
        />
      </ScrollView>
     
      
    </View>
  );
}