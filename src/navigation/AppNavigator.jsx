// navigators/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  View } from 'react-native';
import { storage } from '../utils/MMKVStorage';
import Svg, { Path } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from '../redux/slices/userSlice';
import Logo from '../components/customUI/Logo';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import QuizAnalysisScreen from '../screens/QuizAnalysisScreen';
import GeneratingQuizScreen from '../screens/GeneratingQuizScreen';
import QuestionBook from '../screens/QuestionBook';
import ProfileScreen from '../screens/ProfileScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import UserInitialsBadge from './UserInitialsBadge';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector(state => state.user);
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
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: 'black' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () =>
          isLoggedIn && user?.name ? (
            <UserInitialsBadge
              name={user.name}
              onPress={() => navigation.navigate('Profile')}
            />
          ) : null,
      })}
    >
      {!isLoggedIn && (
        <Stack.Screen name="Login">{props => <LoginScreen />}</Stack.Screen>
      )}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => (
          <View style={{ marginLeft: -20}}>
            <Logo width={150} height={35} />
          </View>
          ),
        }}
      />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} />
      <Stack.Screen name="QuizAnalysis" component={QuizAnalysisScreen} />
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

      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
