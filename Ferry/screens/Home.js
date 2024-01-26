import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PostTile from '../components/Post';
import Fav from '../assets/favicon.png';

export default function Home({ route }) {
  // Fake data!!! To be replaced with the database yah
  const { user } = route.params;
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
        {cheese.map((cheese, index ) => (
          <PostTile key={index} name={cheese.name} caption={cheese.caption} img={cheese.img}/>
        ))}
        <PostTile 
        />
      </ScrollView>
     
      
    </View>
  );
}