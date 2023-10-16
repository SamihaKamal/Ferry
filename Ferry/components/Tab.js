import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PostScreen from '../components/CreatePost';
import HomeScreen from '../screens/Home';
import ChatScreen from '../screens/Chat';
import PagesScreen from '../screens/Pages';
import FollowingScreen from '../screens/Following';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Following" component={FollowingScreen} />
      <Tab.Screen name="Add Post" component={PostScreen} />
      <Tab.Screen name="Pages" component={PagesScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}

export default MyTabs;