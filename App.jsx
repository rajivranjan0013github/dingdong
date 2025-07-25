import 'react-native-gesture-handler';
import "./global.css"
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastManager, { SuccessToast, ErrorToast, InfoToast, WarnToast } from 'toastify-react-native';


export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        {/* <ThemeProvider value={navTheme}> */}
          <StatusBar barStyle={'light-content'} />
          <NavigationContainer>
          <MainNavigator />
          </NavigationContainer>
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