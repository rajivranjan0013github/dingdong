import 'react-native-gesture-handler';
import "./global.css"
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { useColorScheme, View, Linking, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import { storage } from './src/utils/MMKVStorage';
import { DeviceEventEmitter } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Custom event for deep link notifications
export const DEEP_LINK_EVENT = 'DEEP_LINK_RECEIVED';

const navTheme = {
 ...DarkTheme,
 colors: {
   ...DarkTheme.colors,
   background: '#09090b',
 },
};

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Handle deep links when app is running
    const handleDeepLink = (event) => {
      const url = event.url;
      if (url.includes('www.topicwise.app')) {
        const urlParts = url.split('/');
        if (urlParts.includes('questions')) {
          const urlIndex = urlParts.indexOf('questions');
          const questionUrl = urlParts[urlIndex + 1];
          const deepLinkData = {
            screen: 'Questions',
            url: questionUrl,
            timestamp: Date.now()
          };
          storage.set('pendingDeepLink', JSON.stringify(deepLinkData));
          // Emit event to notify HomeScreen
          DeviceEventEmitter.emit(DEEP_LINK_EVENT, deepLinkData);
        } else if (urlParts.includes('profile')) {
          const deepLinkData = {
            screen: 'Profile',
            timestamp: Date.now()
          };
          storage.set('pendingDeepLink', JSON.stringify(deepLinkData));
          DeviceEventEmitter.emit(DEEP_LINK_EVENT, deepLinkData);
        } else if (urlParts.includes('quiz')) {
          const deepLinkData = {
            screen: 'Quiz',
            timestamp: Date.now()
          };
          storage.set('pendingDeepLink', JSON.stringify(deepLinkData));
          DeviceEventEmitter.emit(DEEP_LINK_EVENT, deepLinkData);
        }
      }
    };

    // Handle initial URL when app starts
    const getInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink({ url: initialUrl });
        }
      } catch (error) {
        console.error('Error getting initial URL:', error);
      }
    };

    getInitialURL();

    // Listen for deep links when app is running
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription?.remove();
    };
  }, []);

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
    
    <SafeAreaProvider>
    <KeyboardProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
         <StatusBar barStyle={'light-content'} backgroundColor="transparent" translucent />
          {/* <ThemeProvider value={navTheme}> */}
            <NavigationContainer theme={navTheme}>
              <MainNavigator />
            </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
    </KeyboardProvider>
    </SafeAreaProvider>
  );
}