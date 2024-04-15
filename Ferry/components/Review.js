import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    Button,
    Dialog,
    CheckBox,
    ListItem,
    Avatar,
    } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

function Review({review_id, user_id, review_user_id, review_user_name, review_user_image, country, image, review_title, text, date, likes_counter, tags, navigation }){
    const [ visible, setVisible ] = useState(false);
    const [ listData, setListData ] = useState([]);
    const [ reviewLikes, setReviewLikes ] = useState([])

    const OpenComments = () => {
        //Navigates to register through App.js
        navigation.navigate('Comment', {post: 0, user: user_id, review: review_id, viewuser: review_user_id})
    }

    const sendToProfile = () => {
        navigation.navigate('Profile', {user: user_id, viewuser: review_user_id })
    }

    const OpenReviewText = () => {
        navigation.navigate('ReviewText', {user: user_id, viewuser: review_user_id, id: review_id, image: image, date: date, title: review_title, text: text })
    }

    
    return(
        <View style={ReviewStyle.area}>
            <View style={ReviewStyle.reviews}>
                {/* Name and profile image of the review maker */}
                <View style={ReviewStyle.top}>
                    <TouchableOpacity style={ReviewStyle.reviewProfileImage} onPress={sendToProfile}>
                        <Image 
                            style={ReviewStyle.image}
                            source={{ uri: review_user_image }}
                        />
                    </TouchableOpacity>
                    <Text style ={[ReviewStyle.reviewUserName]}>{review_user_name}</Text> 
                </View>
                {/* Touchable opacity that redirects user to a seperate page with the review */}
                <TouchableOpacity style={[ReviewStyle.reviewContainer]} onPress={OpenReviewText}>
                    <Text style={ReviewStyle.title}>{review_title}</Text>
                    <Text style={{color: '#3A4454'}}>Click to view review</Text>
                </TouchableOpacity>
                {/* Tags */}
                <View style={[ReviewStyle.postTagBackground]}>
                    <Text style={[ReviewStyle.postCountry]}>{country}</Text>   
                    {tags.map((a, index) => (
                        <Text key={index} style={ReviewStyle.postTag}>{a}</Text>
                    ))}
                </View>
                {/* Comment section */}
                <TouchableOpacity style={[ReviewStyle.commentContainer]} onPress={OpenComments}>
                    <Text style={{color: 'white'}}>Click here to view comments</Text>
                </TouchableOpacity>
            </View>    
        </View>
    );
}

const ReviewStyle = StyleSheet.create({
    area: {
        width: 'auto',
        height: 'auto',
        padding: 10,
        paddingTop: 10,
        backgroundColor: 'white',
    },

    reviews: {
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white', 
    },

    top: {
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: 'white',
    },

    reviewProfileImage: {
        marginBottom: 10,
    },

    image: {
        marginRight: 'auto',
        width: 50,
        height: 50,
        aspectRatio: 1, // Maintain the aspect ratio to prevent distortion
        borderRadius: 100,
    },

    reviewUserName: {
        marginLeft: 10,
        fontSize: 30,  
    },

    reviewContainer: {
        width: 'auto',
        padding: 20,
        backgroundColor: '#F5DDDD',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },

    title: {
        fontSize: 20, 
    },

    postTagBackground: {
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Align items vertically
        padding: 5,
        flexWrap: 'wrap',
            
    },

    postTag: {
        borderRadius: 40,
        padding: 10,
        marginLeft: 4,
        backgroundColor: '#C2B2B4',
    },
    
    postCountry:{
        borderRadius: 40,
        padding: 10,
        color: 'white',
        backgroundColor: '#53687E',
    },

    commentContainer: {
        width: 'auto',
        padding: 20,
        backgroundColor: '#3A4454',
        alignItems: 'center',
        borderRadius: 10,
    },

})

export default Review;