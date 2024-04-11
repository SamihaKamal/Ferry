import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PostScreen from '../components/CreatePost';
import HomeScreen from '../screens/Home';
import ChatScreen from '../screens/Chat';
import PagesScreen from '../screens/Pages';
import ListScreen from '../screens/Lists';
import { View, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';
import { Button, Overlay, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const Tab = createBottomTabNavigator();


const CustomAddPostButton = ({children, onPress, user}) => { 
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const toggleOverlay = () => {
    setModalVisible(!modalVisible);
  };
  
  return(
    <View>
      <TouchableOpacity style={{
          top: -20,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#7f5Df0',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          
        }}
        onPress={toggleOverlay} >
          <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#6B4E71'
          }}>
            {children}
          </View>
      </TouchableOpacity>
      <Overlay isVisible={modalVisible} onBackdropPress={toggleOverlay}>
        <TouchableOpacity onPress={() => {
            
            navigation.navigate('AddPost', {user: user}); // Pass the selected option to the onPress function
            toggleOverlay();
          }}>
            <Text style={styles.optionText}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            
            navigation.navigate('AddReview', {user: user}); // Pass the selected option to the onPress function
            toggleOverlay();
          }}>
            <Text style={styles.optionText}>Review</Text>
        </TouchableOpacity>
    </Overlay>
    </View>
  

  
);}; 

function MyTabs({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  return (
    <Tab.Navigator screenOptions={{
      tabBarShowLabel: false,
      
    }}>
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ user }}
      options={{
        title: 'Home',
        headerTitle: 'Ferry',
        tabBarIcon: ({ focused, color, size }) => {
          const iconColour = focused ? '#6B4E71' : 'grey';
          return <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} size={size} color={iconColour}/>

        },
      }} />
      <Tab.Screen name="Lists" component={ListScreen} initialParams={{ user }}
      options={{
        title: 'Lists',
        tabBarIcon: ({ focused, color, size }) => {
          const iconColour = focused ? '#6B4E71' : 'grey';
          return <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} color={iconColour} size={size} />
        }
      }}/>
      <Tab.Screen name="Add Post" component={PostScreen} initialParams={{ user }}
      options={{ 
        tabBarIcon: ({ focused, color, size }) => {
          const iconColour = focused ? 'grey' : 'white';
          return <Ionicons name={'add'} color={iconColour} size={size} />
        },
        tabBarButton: (props) => (
          <CustomAddPostButton {...props} user={user} />
        )
      }}/>
      <Tab.Screen name="Pages" component={PagesScreen} initialParams={{ user }}
      options={{
        title: 'Pages',
        tabBarIcon: ({ focused, color, size }) => {
          const iconColour = focused ? '#6B4E71' : 'grey';
          return <Ionicons name={focused ? 'earth' : 'earth-outline'} color={iconColour} size={size} />
        }
      }}/>
      <Tab.Screen name="Chat" component={ChatScreen} initialParams={{ user }}
      options={{
        title: 'Chat',
        tabBarIcon: ({ focused, color, size }) => {
          const iconColour = focused ? '#6B4E71' : 'grey';
          return <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} color={iconColour} size={size} />
        }
      }}/>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default MyTabs;