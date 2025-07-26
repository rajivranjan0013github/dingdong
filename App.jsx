import 'react-native-gesture-handler';
import "./global.css"
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { StatusBar, useColorScheme, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastManager, { SuccessToast, ErrorToast, InfoToast, WarnToast } from 'toastify-react-native';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Initialize app and wait for everything to be ready
    const initializeApp = async () => {
      try {
        // Add any initialization logic here (e.g., loading fonts, checking auth, etc.)
        // For now, we'll just add a small delay to ensure smooth transition
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Mark app as ready
        setIsAppReady(true);
        
        // Hide splash screen after ensuring the app is fully rendered
        setTimeout(() => {
          SplashScreen.hide();
        }, 200);
      } catch (error) {
        console.error('App initialization failed:', error);
        // Even if there's an error, we should still show the app
        setIsAppReady(true);
        SplashScreen.hide();
      }
    };

    initializeApp();
  }, []);

  // Show a loading view that matches the splash screen background
  if (!isAppReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }} />
    );
  }

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