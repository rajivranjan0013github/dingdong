import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import QuizAnalysisScreen from '../screens/QuizAnalysisScreen';
import QuestionBook from '../screens/QuestionBook';
import DemoScreen from '../screens/DemoScreen';
import GeneratingQuizScreen from '../screens/GeneratingQuizScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen}
        />
        <Stack.Screen 
          name="QuizResult" 
          component={QuizResultScreen} 
        />
        <Stack.Screen 
          name="QuizAnalysis" 
          component={QuizAnalysisScreen} 
        />
        <Stack.Screen 
          name="QuestionBook" 
          component={QuestionBook} 
          options={{
            animation : 'slide_from_right',
            headerRight: () => null, // Placeholder to allow component to set it
          }}
        />
        <Stack.Screen 
          name="Demo" 
          component={DemoScreen} 
          options={{
            animation : 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="GeneratingQuiz" 
          component={GeneratingQuizScreen} 
          options={{ headerShown: false }} // Hide header for this screen
        />
      </Stack.Navigator>
  );
};

export default AppNavigator; 