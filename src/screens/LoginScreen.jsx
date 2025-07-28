import {
  signUpWithGoogle,
  signUpWithApple,
} from 'react-native-credentials-manager';

import React, { useState } from 'react';
import { API_URL } from '../constants/config.js';
import {
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  ToastAndroid,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { googleLoginSignUp } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { LogIn } from 'lucide-react-native';

async function platformSpecificSignUp() {
  try {
    if (Platform.OS === 'android') {
      // Android: Google Sign-In
      const googleCredential = await signUpWithGoogle({
        serverClientId:
          '545625865420-95ut16at09ds28eb7o0bum7dgmdug8uf.apps.googleusercontent.com',
        autoSelectEnabled: false,
      });

      const ans = await fetch(`${API_URL}/api/login/google/loginSignUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: googleCredential.idToken,
        }),
      });
      const data = await ans.json();
      // console.log(data);
      return data;
    } else {
      // iOS: Apple Sign In
      const appleCredential = await signUpWithApple({
        nonce: 'OPTIONAL_NONCE_FOR_SECURITY',
        requestedScopes: ['fullName', 'email'],
      });

      return {
        type: 'apple',
        token: appleCredential.idToken,
        id: appleCredential.id,
        user: {
          name: appleCredential.displayName,
          givenName: appleCredential.givenName,
          familyName: appleCredential.familyName,
          email: appleCredential.email,
        },
      };
    }
  } catch (error) {
    // console.error('Platform-specific sign-up failed:', error);
    ToastAndroid.show('Platform-specific sign-up failed:', ToastAndroid.SHORT);
    throw error;
  }
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      if (Platform.OS === 'android') {
        const googleCredential = await signUpWithGoogle({
          serverClientId:
            '545625865420-95ut16at09ds28eb7o0bum7dgmdug8uf.apps.googleusercontent.com',
          autoSelectEnabled: false,
        });
        const result = await dispatch(
          googleLoginSignUp(googleCredential.idToken),
        );
      } else {
        // iOS: Apple Sign In
        const appleCredential = await signUpWithApple({
          nonce: 'OPTIONAL_NONCE_FOR_SECURITY',
          requestedScopes: ['fullName', 'email'],
        });

        return {
          type: 'apple',
          token: appleCredential.idToken,
          id: appleCredential.id,
          user: {
            name: appleCredential.displayName,
            givenName: appleCredential.givenName,
            familyName: appleCredential.familyName,
            email: appleCredential.email,
          },
        };
      }
    } catch (error) {
      // console.error('Sign-in failed', error);
      ToastAndroid.show('Sign-in failed', ToastAndroid.SHORT);  
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background/95">
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      
      <View className="flex-1 justify-center px-8">
        {/* Logo and Title */}
                  <View className="items-center mb-10">
            <View 
              className="w-32 h-32 items-center justify-center mb-6 border-2 border-border rounded-3xl"
              style={{
                shadowColor: '#FFFFFF',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 1,
                shadowRadius: 80,
                elevation: 60,
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
              }}
            >
              <Image 
                source={require('../assets/app-icon.png')}
                style={{ 
                  width: 120, 
                  height: 120,
                }}
                resizeMode="contain"
              />
            </View>
          
          <Text className="text-3xl font-bold text-foreground mb-2">
            TopicWise
          </Text>
          
          <Text className="text-lg text-muted-foreground text-center">
            Please sign in to continue to TopicWise
          </Text>
        </View>

        {/* Sign In Button */}
        <View className="mb-8">
          <Button
            variant="outline"
            size="lg"
            className="border-white rounded-2xl"
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <View className="flex-row items-center justify-center w-full">
              {isLoading ? (
                <View className="flex-row items-center justify-center w-full">
                  <ActivityIndicator size="small" color="#007AFF" style={{ marginRight: 16 }} />
                  <Text className="text-foreground font-bold text-lg">
                    Signing in...
                  </Text>
                </View>
              ) : (
                <>
                  <View className="mr-4">
                    <Svg width="24" height="24" viewBox="0 0 48 48">
                      <Path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <Path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <Path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <Path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </Svg>
                  </View>
                  <Text className="text-foreground font-bold text-lg">
                    {Platform.OS === 'ios' ? 'Sign in with Apple' : 'Sign in with Google'}
                  </Text>
                </>
              )}
            </View>
          </Button>
        </View>

        {/* Footer */}
        <View className="items-center">
          <Text className="text-muted-foreground text-center text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Login;
