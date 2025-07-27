
import React, { useEffect } from 'react';
import { View, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Text } from '../components/ui/text';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const GeneratingQuizScreen = () => {
  const navigation = useNavigation();
  const { generateTopicStatus } = useSelector(state => state.topic);
  const { currentQuestionBook } = useSelector(state => state.questionBook);

  // useEffect(() => {
  //   if (generateTopicStatus === 'succeeded' && currentQuestionBook?._id) {
  //     navigation.replace('QuestionBook', { questionBookId: currentQuestionBook._id });
  //   } else if (generateTopicStatus === 'failed') {
  //     navigation.navigate('Home');
  //   }
  // }, [generateTopicStatus, currentQuestionBook, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      <ActivityIndicator size="large" color="white" />
      <Text className="text-foreground text-xl font-semibold mt-5 text-center px-4">
        Generating your personalized quiz...
      </Text>
      <Text className="text-muted-foreground text-base mt-2 text-center px-4">
        This might take a moment based on the complexity of your topic.
      </Text>
    </SafeAreaView>
  );
};

export default GeneratingQuizScreen; 