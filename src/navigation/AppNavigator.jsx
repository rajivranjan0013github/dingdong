import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Changed to createDrawerNavigator
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import QuizAnalysisScreen from '../screens/QuizAnalysisScreen';
import QuestionBook from '../screens/QuestionBook';
import Feather from 'react-native-vector-icons/Feather';
import DemoScreen from '../screens/DemoScreen';
import GeneratingQuizScreen from '../screens/GeneratingQuizScreen';
import LoginScreen from '../screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, View, Text } from 'react-native'; // Added View and Text
import { useNavigation } from '@react-navigation/native'; // Added useNavigation
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator(); // Changed to Drawer

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setUser(user);
        }
      } catch (e) {
        console.error('Failed to load user from AsyncStorage', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = user => {
    setUser(user);
    setIsLoggedIn(true);
    // You might want to store the user object in state or context if needed elsewhere
  };
  console.log(user);

  if (isLoading) {
    // We could render a splash screen or loading indicator here
    return null; // Or a loading component
  }

  return (
    <Drawer.Navigator // Changed to Drawer.Navigator
      initialRouteName={user ? 'Home' : 'Login'}
      screenOptions={({ navigation }) => ({
        // Added navigation to screenOptions
        headerStyle: { backgroundColor: 'black' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          // Added headerLeft button
          <Feather
            name="menu"
            size={30}
            color="white"
            style={{ marginLeft: 16 }}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
      })}
      drawerContent={props => (
        <CustomDrawerContent
          {...props}
          user={user}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    >
  
  <Drawer.Screen name="Login" options={{ headerShown: false }}>
    {props => <LoginScreen onLogin={handleLogin} {...props} />}
  </Drawer.Screen>

  <Drawer.Screen
    name="Home"
    options={{ headerShown: !!user }}
  >
    {props => <HomeScreen {...props} user={user} />}
  </Drawer.Screen>
          <Drawer.Screen name="Quiz" component={QuizScreen} />
          <Drawer.Screen name="QuizResult" component={QuizResultScreen} />
          <Drawer.Screen name="QuizAnalysis" component={QuizAnalysisScreen} />
          <Drawer.Screen
            name="QuestionBook"
            component={QuestionBook}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Drawer.Screen // Changed to Drawer.Screen
            name="Demo"
            component={DemoScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Drawer.Screen // Changed to Drawer.Screen
            name="GeneratingQuiz"
            component={GeneratingQuizScreen}
            options={{ headerShown: false }} // Hide header for this screen
          />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
