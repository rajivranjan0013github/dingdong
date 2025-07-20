import React from 'react';
import { View } from 'react-native';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';

const HomeScreen = ({ navigation }) => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl mb-4">Welcome to the Quiz!</Text>
      <Button onPress={() => navigation.navigate('Quiz')}>
        <Text>Start</Text>
      </Button>
      <Button onPress={() => navigation.navigate('QuestionBook')} >
        <Text>Question Book</Text>
      </Button>
    </View>
  );
};

export default HomeScreen; 