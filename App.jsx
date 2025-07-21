import 'react-native-gesture-handler';
import "./global.css"
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastManager, { BaseToast, SuccessToast, ErrorToast, InfoToast, WarnToast } from 'toastify-react-native';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        {/* <ThemeProvider value={navTheme}> */}
          <StatusBar barStyle={'light-content'} />
          <NavigationContainer>
          <AppNavigator />
          </NavigationContainer>
        {/* </ThemeProvider> */}
      </Provider>
      <ToastManager config={{
        success: (props) => <SuccessToast {...props} theme={theme} />,
        error: (props) => <ErrorToast {...props} theme={theme} />,
        info: (props) => <InfoToast {...props} theme={theme} />,
        warn: (props) => <WarnToast {...props} theme={theme} />,
        default: (props) => <InfoToast {...props} theme={theme} />,
      }} />
    </GestureHandlerRootView>
  );
}