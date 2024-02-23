import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@rneui/base';

function CommentTile({id, name, user_id, content, date, likes,replies}) {
    return (
        <View>
            <Text>---------------------------</Text>
            <Text>|{id}</Text>
            <Text>|{name}</Text>
            <Text>|{user_id}</Text>
            <Text>|{content}</Text>
            <Text>|{date}</Text>
            <Text>|{likes}</Text>
            {replies.map((reply, index) => (
                <View key={index}>
                    <Text> THIS IS THE KEY INDEX {index}</Text>
                    <Text>  |{reply.user}</Text>
                    <Text>  |{reply.content}</Text>
                    <Text>  |{reply.date}</Text>
                    <Text>  |{reply.likes}</Text>
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

const postStyle = StyleSheet.create({
    commentContainer: {
        width: 'auto',
        padding: 20,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
    }
})

export default CommentTile; 
 