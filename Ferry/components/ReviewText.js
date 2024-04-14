import { StyleSheet, Text, View, Button, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    Dialog,
    CheckBox,
    ListItem,
    Avatar,
    } from '@rneui/themed';

export default function ReviewText({ route }) {
    const { user, viewuser, id, image, date, title, text } = route.params;
    const [ visible, setVisible ] = useState(false);
    const [ listData, setListData ] = useState([]);
    const [ reviewLikes, setReviewLikes ] = useState()

    useEffect(() =>{
        getLists()
        getReviewLikes()
    }, [])

  
    async function getLists(){
        const request = await fetch(`http://192.168.0.68:8000/api/get+user+lists/?user_id=${user}`)
        const response = await request.json()

        const responseData = response.lists.map((a) => ({
            id: a.id,
            list_user_id: a.user.id,
            name: a.name,
        }))

        setListData(responseData)
    }

    // CONVERT TO REVIEWS
    async function likeReview(){
        // call a function like likePost that takes the user and post.
        const data={
            user_id: user,
            review_id: id,
            post_id: '',
        }

        const request = await fetch('http://192.168.0.68:8000/api/like/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        })

        const response=await request.json()
        getReviewLikes()
 
    }

    async function getReviewLikes(){
        const request = await fetch(`http://192.168.0.68:8000/api/get+likes/?id=${id}&tag=r`)
        const response = await request.json()

        setReviewLikes(response.number)
        console.log(response.number)

    }

    async function saveList(listId){
        const data={
            user_id: user,
            list_id: listId,
            post_id: id,
        }
        const request = await fetch('http://192.168.0.68:8000/api/save+post+to+list/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        toggleVisible()
        alert("Post saved!")
    }
    
    const toggleVisible = () => {
        setVisible(!visible);
    };


    return (   
        <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
                <View style={ReviewTextStyle.titleContainer}>
                    <Text style={ReviewTextStyle.title}>{title}</Text>
                </View>
                <Text style={ReviewTextStyle.text}>{text}</Text>
            </ScrollView>
            {/* Info box */}
            <View style={ReviewTextStyle.infoContainer}>
                <Text style={ReviewTextStyle.date}>{date}</Text>
                <View style={[ReviewTextStyle.buttons]}>      
                    <Text>{reviewLikes}</Text>
                    <TouchableOpacity style={ReviewTextStyle.smallButton} onPress={likeReview}>      
                        <Ionicons name={'heart'} size={30} color="#F4B183"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={ReviewTextStyle.smallButton} onPress={toggleVisible}>
                        <Ionicons name={'add-outline'} size={30} color="#A9D18E"/>
                    </TouchableOpacity>
                </View>
            </View>
            <Dialog
            isVisible={visible}
            onBackdropPress={toggleVisible}>
                <Dialog.Title title="Choose List"/>
                {listData.map((a, index) => (
                    <ListItem
                    key={index}
                    onPress={() => saveList(a.id)}>
                        <ListItem.Content>
                            <ListItem.Title>
                                {a.name}
                            </ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </Dialog>
        </View>
    );
}

const ReviewTextStyle = StyleSheet.create({
    titleContainer: {
        alignItems: 'center',
    },

    title: {
        fontSize: 30,
    },

    text: {
        padding: 5,
    },

    infoContainer: {
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Align items vertically
        justifyContent: 'space-between',
        marginTop: 'auto',
        position: 'relative',
    },
    
    buttons: {
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Align items vertically
        justifyContent: 'flex-end',
        padding: 5,
    },

    date: {
        padding: 5,
        color: "grey",
    },

    smallButton: {
        float: 'left',
        display: 'inline-block',
    },
})