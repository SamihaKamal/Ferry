import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PostScreen from '../components/CreatePost';
import HomeScreen from '../screens/Home';
import ChatScreen from '../screens/Chat';
import PagesScreen from '../screens/Pages';
import ListScreen from '../screens/Lists';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();


const CustomAddPostButton = ({children, onPress}) => (
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
        tabBarIcon: ({ focused, color, size }) => {
          const iconColour = focused ? 'red' : 'grey';
          return <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} size={size} color={iconColour}/>

        },
      }} />
      <Tab.Screen name="Lists" component={ListScreen} initialParams={{ user }}
      options={{
        title: 'Lists',
        tabBarIcon: ({ focused, color, size }) => {
          const iconColour = focused ? 'red' : 'grey';
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
          <CustomAddPostButton {...props} />
        )
      }}/>
      <Tab.Screen name="Pages" component={PagesScreen} initialParams={{ user }}
      options={{
        title: 'Pages',
        tabBarIcon: ({ focused, color, size }) => {
          const iconColour = focused ? 'red' : 'grey';
          return <Ionicons name={focused ? 'earth' : 'earth-outline'} color={iconColour} size={size} />
        }
      }}/>
      <Tab.Screen name="Chat" component={ChatScreen} initialParams={{ user }}
      options={{
        title: 'Chat',
        tabBarIcon: ({ focused, color, size }) => {
          const iconColour = focused ? 'red' : 'grey';
          return <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} color={iconColour} size={size} />
        }
      }}/>
    </Tab.Navigator>
  );
}

export default MyTabs;