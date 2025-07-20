import 'react-native-gesture-handler';
import "./global.css"
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Theme, ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { NAV_THEME } from './src/lib/constants';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function App() {

  return (
    <Provider store={store}>
      <ThemeProvider value={navTheme}>
        <StatusBar barStyle={'light-content'} />
        <NavigationContainer theme={navTheme}>
        <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}