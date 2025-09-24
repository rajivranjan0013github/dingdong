// navigators/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, TouchableOpacity } from 'react-native';
import { storage } from '../utils/MMKVStorage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import QuizAnalysisScreen from '../screens/QuizAnalysisScreen';
import GeneratingQuizScreen from '../screens/GeneratingQuizScreen';
import GeneratingSolutionScreen from '../screens/GeneratingSolutionScreen';
import QuestionBook from '../screens/QuestionBook';
import SolutionScreen from '../screens/SolutionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import UserInitialsBadge from './UserInitialsBadge';
import CustomDrawerContent from './CustomDrawerContent';
import LanguageSelectScreen from '../screens/onboarding/LanguageSelectScreen';
import AskDoubtCamera from '../screens/AskDoubtCamera';
import DoubtsScreen from '../screens/DoubtsScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => {
  const { user } = useSelector(state => state.user);
  
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: 'black' },
        headerTintColor: 'white',
        drawerStyle: {
          backgroundColor: '#000',
          width: '85%',
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitle: "",
          headerStyle: {
            backgroundColor: '#09090bf2',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 8, padding: 8 }}
            >
              <Icon name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <UserInitialsBadge
              name={user?.name}
              onPress={() => navigation.navigate('Profile')}
              style={{ marginRight: 8 }}
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = storage.getString('user');
      if (savedUser) {
        dispatch(setUser(JSON.parse(savedUser)));
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  if (isLoading) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'black' },
        headerTintColor: 'white',
      }}
    >
      {!isLoggedIn ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="HomeStack"
            component={HomeStack}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen 
            name="LanguageSelect" 
            component={LanguageSelectScreen}
            options={{ title: 'Choose Language' }}
          />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="QuizResult" component={QuizResultScreen} />
          <Stack.Screen name="QuizAnalysis" component={QuizAnalysisScreen} />
          <Stack.Screen
            name="AskDoubtCamera"
            component={AskDoubtCamera}
            options={{ headerShown: false }}
          />
         
          <Stack.Screen
            name="GeneratingSolution"
            component={GeneratingSolutionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Solution"
            component={SolutionScreen}
            options={{ title: 'Solution' }}
          />
          <Stack.Screen
            name="QuestionBook"
            component={QuestionBook}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="GeneratingQuiz"
            component={GeneratingQuizScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
          <Stack.Screen name="DoubtsScreen" component={DoubtsScreen} options={{ title: 'Your Doubts' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
