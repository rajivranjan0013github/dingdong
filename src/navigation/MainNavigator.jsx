// AppNavigator.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const MainNavigator = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) dispatch(setUser(JSON.parse(savedUser)));
      setIsLoading(false);
    };
    loadUser();
  }, []);

  if (isLoading) return null;

  return (<>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
  </>);
};

export default MainNavigator;
