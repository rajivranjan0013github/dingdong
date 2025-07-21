import 'react-native-gesture-handler';
import "./global.css"
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider value={navTheme}>
          <StatusBar barStyle={'light-content'} />
          <NavigationContainer theme={navTheme}>
          <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}