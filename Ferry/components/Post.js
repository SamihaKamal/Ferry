import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@rneui/base';

function Post({id, name, user_id, caption, image, date, likes, country, tags, navigation}) {
    const OpenComments = () => {
        //Navigates to register through App.js
        navigation.navigate('Comment', {post: id, user: user_id})
    }

    const a = !country || country.trim() === '';
    return (
        // Where all the posts are located
        <View style={[postStyle.postBox]}> 
            {/* Where each singular post is located */}
            <View style={[postStyle.extra]}>
                <View style={[postStyle.postTop]}>
                    {/* Title and profile picture */}
                    <Text style ={[postStyle.postText]}>{name}</Text> 
                </View>
                <Image 
                    style={postStyle.postImage}
                    source={{ uri: image}}
                />
                <View style={postStyle.InfoContainer}>
                    <Text style={postStyle.date}>{date}</Text>
                    <View style={[postStyle.Buttons]}>
                        <TouchableOpacity style={postStyle.LikeButton}>
                            <Ionicons name={'heart'} size={30} color="#F4B183"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={postStyle.LikeButton}>
                            <Ionicons name={'add-outline'} size={30} color="#A9D18E"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={[postStyle.postCaption]}>{caption}</Text>
                </View>
              
                <View style={[postStyle.postTagBackground]}>
                    {!a && (<Text style={[postStyle.postCountry]}>{country}</Text>)}    
                    <Text style={[postStyle.postTag]}>{tags}</Text>
                </View>
                <TouchableOpacity style={[postStyle.commentContainer]} onPress={OpenComments}>
                    <Text>Click here to view comments</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    );
    
}

const postStyle = StyleSheet.create({
    commentContainer: {
        width: 'auto',
        padding: 20,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
    },

    InfoContainer: {
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Align items vertically
        justifyContent: 'space-between',
    },
    
    Buttons: {
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Align items vertically
        justifyContent: 'flex-end',
        padding: 5,
    },
    
    date: {
        padding: 5,
        color: "grey",
    },

    LikeButton: {
        float: 'left',
        display: 'inline-block',
    },

    postImage: {
        alignContent: 'center',
        width: '100%',
        aspectRatio: 1, // Maintain the aspect ratio to prevent distortion
        borderRadius: 10,
    },

    postTagBackground: {
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Align items vertically
        padding: 5,
    },

    postCountry:{
        borderRadius: 40,
        padding: 10,
        backgroundColor: 'pink',
    },

    postTag: {
        borderRadius: 40,
        padding: 10,
        backgroundColor: '#BFBFBF',
    },

    postCaption: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10, 
    },

    postText: {
        marginLeft: 10,
        fontSize: 20,  
    },

    postTop: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#F2F2F2',
    },

    extra: {
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#F2F2F2', 
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
 