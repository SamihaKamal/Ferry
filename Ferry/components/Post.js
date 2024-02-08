import { StyleSheet, Text, View, Image} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// This should have:
// - Persons picture and name
// - Pictures
// - Caption
// - Comments 
//     = Add Comments
//     = Remove Comments
//     = Like comments 

const Post = ({name, caption, image, likes, country}) => (
    // Where all the posts are located
    <View style={[postStyle.postBox]}> 
        {/* Where each singular post is located */}
        <View style={[postStyle.extra]}>
            <View style={[postStyle.postTop]}>
                {/* Title and profile picture */}
                <Text style ={[postStyle.postText]}>{name}</Text>
                
            </View>
            {console.log(image)}
            <Image 
                style={{ width:100, height: 100 }}
                source={{ uri: image}}
            />
            <View>
                {/* Caption here */}
                <Text style={[postStyle.postCaption]}>{caption}</Text>
            </View>
            <View>
                {/* This is where the likes and tags will go: */}
                <Text style={[postStyle.postSmall]}>Likes: {likes}</Text>
                <Text style={[postStyle.postSmall]}>Tags: {country}</Text>
            </View>
        </View>
    </View>
);

const postStyle = StyleSheet.create({
    postImage: {
        height: 'auto',
        width: 'auto',
    },

    postCaption: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10,
        
    },

    postSmall: {
        fontSize: 12,
        marginLeft: 10,
        marginRight: 10,
        
    },

    postText: {
        marginLeft: 10,
        fontSize: 20,
        color: 'green',
    },

    postTop: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: 'orange',
    },

    extra: {
        borderRadius: 10,
        backgroundColor: 'yellow',
        
    },

    postBox: {
        width: 'auto',
        height: 'auto',
        padding: 10,
        paddingTop: 10,
        backgroundColor: 'pink',
    }
})

export default Post; 
 