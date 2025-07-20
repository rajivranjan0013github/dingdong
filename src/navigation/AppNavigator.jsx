import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import QuizAnalysisScreen from '../screens/QuizAnalysisScreen';
import QuestionBook from '../screens/QuestionBook';

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
        />
      </Stack.Navigator>
  );
};

export default AppNavigator; 