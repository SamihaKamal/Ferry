import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PostScreen from '../components/CreatePost';
import HomeScreen from '../screens/Home';
import ChatScreen from '../screens/Chat';
import PagesScreen from '../screens/Pages';
import FollowingScreen from '../screens/Following';
import { View, TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

const CustomAddPostButton = ({children, onPress}) => (
  <TouchableOpacity style={{
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7f5Df0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }}
  onPress={onPress} >
    <View style={{
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#e32f45'
    }}>
      {children}
    </View>
  </TouchableOpacity>
);

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen}
      options={{
        title: 'Home',
        tabBarIcon: ({ focused, color, size }) => {
          // This is just to test out different colours for the icon will change later
          // When I have a colour scheme cough
          const iconColour = focused ? 'red' : 'green';
          return <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} size={size} color={iconColour}/>

        },
      }} />
      <Tab.Screen name="Following" component={FollowingScreen} 
      options={{
        title: 'Following',
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} color={color} size={size} />
        }
      }}/>
      <Tab.Screen name="Add Post" component={PostScreen} 
      options={{
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={'add'} color={color} size={size} />
        },
        tabBarButton: (props) => (
          <CustomAddPostButton {...props} />
        )
      }}/>
      <Tab.Screen name="Pages" component={PagesScreen} 
      options={{
        title: 'Pages',
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={focused ? 'earth' : 'earth-outline'} color={color} size={size} />
        }
      }}/>
      <Tab.Screen name="Chat" component={ChatScreen} 
      options={{
        title: 'Chat',
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} size={size} />
        }
      }}/>
    </Tab.Navigator>
  );
}

export default MyTabs;