import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    const dispatch = useDispatch();

    const handleLogin = (user) => {
        dispatch(setUser(user));
      };
    

  return (
  <Stack.Navigator>
   
   <Stack.Screen name="Login" options={{ headerShown: false }}>
          {props => <LoginScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>
  </Stack.Navigator>
  );
};

export default AuthNavigator;
