import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// This should have:
// - Persons picture and name
// - Pictures
// - Caption
// - Comments 
//     = Add Comments
//     = Remove Comments
//     = Like comments 

const Post = ({name, caption}) => (
    <View>
        <Text>{name}</Text>
        <Text>{caption}</Text>
    </View>
);


export default Post; 
 