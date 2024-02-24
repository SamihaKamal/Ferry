import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@rneui/base';

function CommentTile({id, name, user_id, content, date, likes,replies}) {
    return (
        <View style={CTileStyle.commentContainer}>
            <View style={[CTileStyle.commentBox]}>
                <Text style={[CTileStyle.userName]}>{name}</Text>
                <Text>{content}</Text>
                <Text style={[CTileStyle.date]}>{date}</Text>
                <View style={CTileStyle.buttonsContainer}>
                <TouchableOpacity style={CTileStyle.button}>
                    <Ionicons name='arrow-redo' size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={CTileStyle.button}>
                    <Ionicons name={'heart'} size={20} color="#F4B183"/>
                </TouchableOpacity>
            </View>
            </View>
            {replies.map((reply, index) => (
                <View key={index} style={{ marginLeft: 20 }}>
                    <Text style={[CTileStyle.userName]}>{reply.user}</Text>
                    <Text>{reply.content}</Text>
                    <Text style={[CTileStyle.date]}>{reply.date}</Text>
                    <View style={CTileStyle.buttonsContainer}>
                        <TouchableOpacity style={CTileStyle.button}>
                            <Ionicons name='arrow-redo' size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={CTileStyle.button}>
                            <Ionicons name={'heart'} size={20} color="#F4B183"/>
                        </TouchableOpacity>
                    </View>
                    {reply.replies && reply.replies.length > 0 && (
                        <View style={{ marginLeft: 20 }}>
                            {reply.replies.map((nestedReply, nestedIndex) => (
                                <CommentTile
                                    key={nestedIndex}
                                    id={nestedReply.id}
                                    name={nestedReply.user}
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
    date: {
        padding: 5,
        color: "grey",
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


})

export default CommentTile; 
 