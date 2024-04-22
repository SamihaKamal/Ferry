import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Dialog, ListItem } from '@rneui/themed';


export default function CommentTile({ id, name, user_id, post_id, review_id, content, date, likes, replies, refreshComments }) {
    const [userComment, setUserComment] = useState('');
    const [listReplyId, setListReplyId] = useState(null);
    const [showAddCommentBox, setShowAddCommentBox] = useState(false);
    const [showAddReplyCommentBox, setShowAddReplyCommentBox] = useState(false);
    const [replyID, setReplyID] = useState(null);
    const [ visible, setVisible ] = useState(false);
    const [ listData, setListData ] = useState([]);

    useEffect(() =>{
        getLists()
    }, [])

    async function getLists(){
        const request = await fetch(`http://192.168.0.68:8000/api/get+user+lists/?user_id=${user_id}`)
        const response = await request.json()

        const responseData = response.lists.map((a) => ({
            id: a.id,
            list_user_id: a.user.id,
            name: a.name,
        }))

        setListData(responseData)
    }

    async function saveList(listId){
        const data={
            user_id: user_id,
            list_id: listId,
            comment_id: listReplyId,
        }
        const request = await fetch('http://192.168.0.68:8000/api/save+comment+to+list/', {
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
        setListReplyId(id)
    };

    const toggleVisibleReply = (commentId) => {
        setVisible(!visible)
        setListReplyId(commentId)
    };

    const toggleAddCommentBox = (comment_id) => {
        setShowAddCommentBox(!showAddCommentBox);
        setReplyID(comment_id)
    };

    const toggleAddReplyCommentBox = (comment_id) => {
        setShowAddReplyCommentBox(!showAddReplyCommentBox);
        setReplyID(comment_id)
    };
    
    async function addComment(){
        const data = {
            comment_id: replyID,
            user_id: user_id,
            post_id: post_id,
            review_id: review_id,
            comment_body: userComment,
        }
        try{
            const request = await fetch('http://192.168.0.68:8000/api/create+reply+comments/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
           
            const response = await request.json()
            if (response){
                //Set all the variables to empty so they 'refresh'
                setUserComment('');
                refreshComments();
                //Close comment box if its opened.
                if (showAddCommentBox == true){
                    toggleAddCommentBox()
                }
                if (showAddReplyCommentBox == true){
                    toggleAddReplyCommentBox()
                }
            }
            else{
                console.log("Uh oh theres an error!")
            }
        }
        catch (error){
            console.log("Something went wrong: ", error.message)
        }
    }

    return (
        <View style={CTileStyle.commentContainer}>
            <View style={[CTileStyle.commentBox]}>
                <Text style={[CTileStyle.userName]}>{name}</Text>
                <Text>{content}</Text>
                <Text style={[CTileStyle.date]}>{date}</Text>
                <View style={CTileStyle.buttonsContainer}>
                    {/* These are all the buttons, such as the reply and the like and save buttons. */}
                    <TouchableOpacity style={CTileStyle.button} onPress={() => toggleAddCommentBox(id)}>
                        <Ionicons name='arrow-redo' size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={CTileStyle.button}>
                        <Ionicons name={'heart'} size={20} color="#F4B183" />
                    </TouchableOpacity>
                    <TouchableOpacity style={CTileStyle.button} onPress={toggleVisible}>
                            <Ionicons name={'add-outline'} size={20} color="#A9D18E"/>
                    </TouchableOpacity>
                </View>
                {/* If the showAddComments box is true and the replyId is equal to the comment id then you can see the comment container. */}
                {showAddCommentBox && replyID === id &&(
                    <View style={CTileStyle.addCommentContainer}>
                        <TextInput
                            style={[CTileStyle.addCommentBox]}
                            multiline
                            autoCorrect={true}
                            numberOfLines={4}
                            maxLength={60}
                            placeholder="User Comment"
                            value={userComment}
                            onChangeText={setUserComment} />
                        <TouchableOpacity onPress={addComment}>
                            <Ionicons name='arrow-forward-circle' size={50} color="#BDD7EE" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {/* Maps all the replies so that all the replies are also visible. */}
            {replies.map((reply, index) => (
                <View key={index} style={{ marginLeft: 20 }}>
                    <Text style={[CTileStyle.userName]}>{reply.user}</Text>
                    <Text>{reply.content}</Text>
                    <Text style={[CTileStyle.date]}>{reply.date}</Text>
                    <View style={CTileStyle.buttonsContainer}>
                        <TouchableOpacity style={CTileStyle.button} onPress={() => toggleAddReplyCommentBox(reply.id)}>
                            <Ionicons name='arrow-redo' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={CTileStyle.button}>
                            <Ionicons name={'heart'} size={20} color="#F4B183" />
                        </TouchableOpacity>
                        <TouchableOpacity style={CTileStyle.button} onPress={() => toggleVisibleReply(reply.id)}>
                            <Ionicons name={'add-outline'} size={20} color="#A9D18E"/>
                        </TouchableOpacity>
                    </View>
                    {showAddReplyCommentBox && replyID === reply.id &&(
                        <View style={CTileStyle.addCommentContainer}>
                            <TextInput
                                style={[CTileStyle.addCommentBox]}
                                multiline
                                autoCorrect={true}
                                numberOfLines={4}
                                maxLength={60}
                                placeholder="User Comment"
                                value={userComment}
                                onChangeText={setUserComment} />
                            <TouchableOpacity onPress={addComment}>
                                <Ionicons name='arrow-forward-circle' size={50} color="#BDD7EE" />
                            </TouchableOpacity>
                        </View>
                    )}
                    {/* If there is a reply to a comment and the length is more than 0 then we call the comment tile component again. */}
                    {reply.replies && reply.replies.length > 0 && (
                        <View style={{ marginLeft: 20 }}>
                            {reply.replies.map((nestedReply, nestedIndex) => (
                                <CommentTile
                                    key={nestedIndex}
                                    id={nestedReply.id}
                                    name={nestedReply.user}
                                    user_id={user_id}
                                    post_id={post_id}
                                    review_id={review_id}
                                    content={nestedReply.content}
                                    date={nestedReply.date}
                                    likes={nestedReply.likes}
                                    replies={nestedReply.replies}
                                />
                            ))}
                        </View>
                    )}
                </View>
            ))}
            {/* This is the list dialog that pops up when the + is clicked. */}
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
const CTileStyle = StyleSheet.create({
    addCommentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },

    addCommentBox: {
        flex: 1,
        backgroundColor: '#eee',
        marginRight: 10,
        padding: 10,
        borderRadius: 5,
    },

    date: {
        padding: 5,
        color: 'grey',
    },

    userName: {
        fontSize: 20,
    },

    commentContainer: {
        padding: 10,
    },

    commentBox: {
        backgroundColor: '#D9D9D9',
        padding: 10,
        borderRadius: 5,
    },

    lightBackground: {
        backgroundColor: '#F0F0F0',
    },

    darkBackground: {
        backgroundColor: '#CCCCCC',
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

