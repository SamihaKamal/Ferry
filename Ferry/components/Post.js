import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dialog, ListItem } from '@rneui/themed';
import { useEffect, useState } from 'react';

function Post({id, name, user_image, post_user_id, user_id, caption, image, date, likes, country, tags, navigation}) {   
    const [ visible, setVisible ] = useState(false);
    const [ deleteVisible, setDeleteVisible ] = useState('none');
    const [ listData, setListData ] = useState([]);
    const [ postLikes, setPostLikes ] = useState([])

    useEffect(() =>{
        getLists()
        getPostLikes()
    }, [])

  
    async function getLists(){
        if (post_user_id == user_id){
            setDeleteVisible('visible')
        }
        const request = await fetch(`http://192.168.0.68:8000/api/get+user+lists/?user_id=${user_id}`)
        const response = await request.json()

        const responseData = response.lists.map((a) => ({
            id: a.id,
            list_user_id: a.user.id,
            name: a.name,
        }))

        setListData(responseData)
    }

    async function getPostLikes(){
        const request = await fetch(`http://192.168.0.68:8000/api/get+likes/?id=${id}&tag=p`)
        const response = await request.json()

        setPostLikes(response.number)

    }

    async function likePost(){
        // call a function like likePost that takes the user and post.
        const data={
            user_id: user_id,
            post_id: id,
            review_id: '',
        }

        const request = await fetch('http://192.168.0.68:8000/api/like/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        })

        const response=await request.json()
        getPostLikes()
 
    }

    async function saveList(listId){
        const data={
            user_id: user_id,
            list_id: listId,
            posts_id: id,
            review_id: 0,
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
    
    const OpenComments = () => {
        //Navigates to register through App.js
        navigation.navigate('Comment', {post: id, user: user_id, review: 0})
    }

    const sendToProfile = () => {
        navigation.navigate('Profile', {user: user_id, viewuser: post_user_id})
    }

    async function deletePost(){
        Alert.alert('Delete Post', `Do you want to delete this post?`, [
            {
              text: 'Cancel',
              onPress: () => {return},
              style: 'cancel',
            },
            {text: 'Yes', onPress: async () => {
                const request = await fetch(`http://192.168.0.68:8000/api/delete+post/?id=${id}`, {
                    method: 'DELETE'
                })
                const response = await request.json()
        
                if (response){
                    Alert.alert("Post deleted", "Please refresh page to see changes")
                }
              }
            },
        ]);
    }
    const a = !country || country.trim() === '';
    return (
        // Where all the posts are located
        <View style={[postStyle.postBox]}> 
            {/* Where each singular post is located */}
            <View style={[postStyle.extra]}>
                <View style={[postStyle.postTop]}>
                    {/* Title and profile picture + dustbin icon */}
                    <TouchableOpacity style={postStyle.TouchableOpacity} onPress={sendToProfile}>
                        <Image 
                            style={postStyle.Image}
                            source={{ uri: user_image }}
                        />
                    </TouchableOpacity>
                    <Text style ={[postStyle.postText]}>{name}</Text> 
                    <TouchableOpacity style={{ display: deleteVisible, marginLeft: 'auto'}} onPress={deletePost}>
                        <Ionicons name={'trash-bin-outline'} size={20} />
                    </TouchableOpacity>
                </View>
                <Image 
                    style={postStyle.postImage}
                    source={{ uri: image}}
                />
                {/* Info container is where the dates and buttons like liking and saving to a list is */}
                <View style={postStyle.InfoContainer}>
                    <Text style={postStyle.date}>{date}</Text>
                    <View style={[postStyle.Buttons]}>      
                        <Text>{postLikes}</Text>
                        <TouchableOpacity style={postStyle.LikeButton} onPress={likePost}>      
                            <Ionicons name={'heart'} size={30} color="#F4B183"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={postStyle.LikeButton} onPress={toggleVisible}>
                            <Ionicons name={'add-outline'} size={30} color="#A9D18E"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={[postStyle.postCaption]}>{caption}</Text>
                </View>
                {/* Tag display */}
                <View style={[postStyle.postTagBackground]}>
                    {!a && (<Text style={[postStyle.postCountry]}>{country}</Text>)}    
                    {tags.map((a, index) => (
                        <Text key={index} style={postStyle.postTag}>{a}</Text>
                    ))}
                </View>
                <TouchableOpacity style={[postStyle.commentContainer]} onPress={OpenComments}>
                    <Text style={{color: 'white'}}>Click here to view comments</Text>
                </TouchableOpacity>
                
            </View>
            {/* This is what you see when you click the + button, lets you save to a post */}
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
const postStyle = StyleSheet.create({
    commentContainer: {
        width: 'auto',
        padding: 20,
        backgroundColor: '#3A4454',
        alignItems: 'center',
        borderRadius: 10,
    },

    TouchableOpacity: {
        marginBottom: 10,
    },

    Image: {
        marginRight: 'auto',
        width: 50,
        height: 50,
        aspectRatio: 1, // Maintain the aspect ratio to prevent distortion
        borderRadius: 100,
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
        flexWrap: 'wrap',
            
    },

    postCountry:{
        borderRadius: 40,
        padding: 10,
        color: 'white',
        backgroundColor: '#53687E',
    },

    postTag: {
        borderRadius: 40,
        padding: 10,
        marginLeft: 4,
        backgroundColor: '#C2B2B4',
    },

    postCaption: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10, 
    },

    postText: {
        marginLeft: 10,
        fontSize: 30,  
    },

    postTop: {
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: 'white',
    },

    extra: {
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white', 
    },

    postBox: {
        width: 'auto',
        height: 'auto',
        padding: 10,
        paddingTop: 10,
        backgroundColor: 'white',
    }
})

export default Post; 
 