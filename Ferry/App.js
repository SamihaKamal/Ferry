import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, Screen } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyTabs from './components/Tab';
import Register from './screens/Register';
import Login from './screens/Login';
import Message from './screens/Message';
import Comment from './screens/Comment';
import Profile from './screens/Profile';
import Home from './screens/Home';
import CreateList from './components/CreateList';
import AddPost from './components/CreatePost';
import ListExtention from './screens/ListExtention';
import ListDetail from './screens/ListDetail';
import ReviewText from './components/ReviewText'
import AddReview from './components/CreateReview';
import CountrySpecificPage from './screens/CountrySpecificPage';
import SpecificLists from './screens/SpecificList';

export default function App() {
//This is all the screens that I need to navigate to, other screens can be accessed through the tab navigator
  const Stack = createNativeStackNavigator();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Register'>
          <Stack.Screen name="Register"component={Register} options={{
            headerShown: false,
          }}/>
          <Stack.Screen name="MainPages" component={MyTabs} options={{
            headerShown: false
          }}/>
          <Stack.Screen name="Login" component={Login} options={{
            headerShown: false
          }}/>
          <Stack.Screen name="Comment" component={Comment} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Message" component={Message} />
          <Stack.Screen name="CountrySpecificPage" component={CountrySpecificPage} />
          <Stack.Screen name="SpecificLists" component={SpecificLists} />
          <Stack.Screen name="AddPost" component={AddPost} />
          <Stack.Screen name="AddReview" component={AddReview} />
          <Stack.Screen name="ReviewText" component={ReviewText} />
          <Stack.Screen name="ListExtention" component={ListExtention} />
          <Stack.Screen name="ListDetail" component={ListDetail} />
          <Stack.Screen name="CreateList" component={CreateList} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
