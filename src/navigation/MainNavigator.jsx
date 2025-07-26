// AppNavigator.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { storage } from '../utils/MMKVStorage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import { View } from 'react-native';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const MainNavigator = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = storage.getString('user');
        if (savedUser) dispatch(setUser(JSON.parse(savedUser)));
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Show a loading view that matches the splash screen background
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }} />
    );
  }

  return <>{isLoggedIn ? <AppNavigator /> : <AuthNavigator />}</>;
};

export default MainNavigator;
