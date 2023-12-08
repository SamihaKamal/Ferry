import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PostTile from '../components/Post';

export default function Home() {
  const cheese = [
    {name: "welpy", caption: "Cheese louise"},
    {name: "Thelpy", caption: "I am addicted to genshin"},
    {name: "Rocky", caption: "This is a test to see if long pieces of text look alright ok?"}
  ];
  return (
    <View>
      <Text>This a home screan yah TEST TO SEE ON BRANCH</Text>
      {/* Theres different components within home:
      - Profile picture/profile menu
      - Welcome back title
      - Search bar
      - Posts */}
      <StatusBar style="auto" />
      {cheese.map((cheese, index ) => (
        <PostTile key={index} name={cheese.name} caption={cheese.caption} />
      ))}
      <PostTile 
      />
      
    </View>
  );
}