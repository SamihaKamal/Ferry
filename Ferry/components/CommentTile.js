import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';


export default function CommentTile({ id, name, user_id, post_id, content, date, likes, replies, refreshComments }) {
    const [userComment, setUserComment] = useState('');
    const [showAddCommentBox, setShowAddCommentBox] = useState(false);
    const [showAddReplyCommentBox, setShowAddReplyCommentBox] = useState(false);
    const [replyID, setReplyID] = useState(null);

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
            comment_body: userComment,
        }
        try{
            const request = await fetch('http://192.168.0.68:8000/api/create+reply+comments+for+post/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
           
            const response = await request.json()
            if (response){
                setUserComment('');
                refreshComments();
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
                    <TouchableOpacity style={CTileStyle.button} onPress={() => toggleAddCommentBox(id)}>
                        <Ionicons name='arrow-redo' size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={CTileStyle.button}>
                        <Ionicons name={'heart'} size={20} color="#F4B183" />
                    </TouchableOpacity>
                    <TouchableOpacity style={CTileStyle.button}>
                            <Ionicons name={'add-outline'} size={20} color="#A9D18E"/>
                    </TouchableOpacity>
                </View>
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
                        <TouchableOpacity style={CTileStyle.button}>
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
                    {reply.replies && reply.replies.length > 0 && (
                        <View style={{ marginLeft: 20 }}>
                            {reply.replies.map((nestedReply, nestedIndex) => (
                                <CommentTile
                                    key={nestedIndex}
                                    id={nestedReply.id}
                                    name={nestedReply.user}
                                    user_id={user_id}
                                    post_id={post_id}
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
        </View>
    );
}

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

