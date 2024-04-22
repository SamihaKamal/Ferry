import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import IPAddress from './IPAddress';

function Review({review_id, user_id, review_user_id, review_user_name, review_user_image, country, image, review_title, text, date, likes_counter, tags, navigation }){
    const [ deleteVisible, setDeleteVisible ] = useState('none');
    
    useEffect(() =>{
        checkDelete()
    }, [])

    //Can  only delete if the owner of the review is the user.
    const checkDelete = () => {
        if (user_id == review_user_id){
            setDeleteVisible('visible')
        }
    }

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

    async function deleteReview(){
        Alert.alert('Delete Review', `Do you want to delete this review?`, [
            {
              text: 'Cancel',
              onPress: () => {return},
              style: 'cancel',
            },
            {text: 'Yes', onPress: async () => {
                const request = await fetch(`http://${IPAddress()}/api/delete+review/?id=${review_id}`, {
                    method: 'DELETE'
                })
                const response = await request.json()
        
                if (response){
                    Alert.alert("Review deleted", "Please refresh page to see changes")
                }
              }
            },
        ]);
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
                    <TouchableOpacity style={{ display: deleteVisible, marginLeft: 'auto'}} onPress={deleteReview}>
                        <Ionicons name={'trash-bin-outline'} size={20} />
                    </TouchableOpacity>
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

//Stylesheet for design
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