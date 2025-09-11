import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExplainersScreen from '../screens/onboarding/ExplainersScreen';
import LanguageSelectScreen from '../screens/onboarding/LanguageSelectScreen';

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'black' },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: '#000' },
      }}
    >
      <Stack.Screen
        name="Explainers"
        component={ExplainersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LanguageSelect"
        component={LanguageSelectScreen}
        options={{ headerShown: false }}

      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;


