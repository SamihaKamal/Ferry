import { StyleSheet, Text, View, Button, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Dialog, ListItem } from '@rneui/themed';

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

    async function likeReview(){

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
            posts_id: 0,
            review_id: id,
        }
        const request = await fetch('http://192.168.0.68:8000/api/save+to+list/', {
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
                {/* Where title and image is */}
                <View style={ReviewTextStyle.titleContainer}>
                    <Text style={ReviewTextStyle.title}>{title}</Text>
                </View>
                <Text style={ReviewTextStyle.text}>{text}</Text>
                <Image style={ReviewTextStyle.image} 
                source={{uri: image}}/>
            </ScrollView>
            {/* Info box  for all the important buttons*/}
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
            {/* Dialog for saving review to a list */}
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

//Stylesheet for design
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

    image: {
        margin: 5,
        width: 'auto',
        aspectRatio: 1,
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