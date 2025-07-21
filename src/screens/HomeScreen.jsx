import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert as RNAlert, // Renamed to avoid conflict with UI Alert
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopics } from '../redux/slices/topicSlice';
import { useNavigation } from '@react-navigation/native';
import { setCurrentQuestionBook } from '../redux/slices/questionBookSlice';
import { generateTopic } from '../redux/slices/topicSlice';
import { Toast } from 'toastify-react-native';
import { Skeleton } from '../components/ui/skeleton';

// Utility function to calculate relative time
const getRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { topics: recentTopics, fetchTopicStatus, generateTopicStatus } = useSelector(state => state.topic);
  const [topic, setTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);


  const handleGenerateQuiz = async () => {
    try {
      dispatch(setCurrentQuestionBook(null)); // Clear previous question book before generating a new one
      navigation.navigate('GeneratingQuiz'); // Navigate to the loading screen
      await dispatch(generateTopic(topic)).unwrap();
      setTopic('');
      Toast.success('Topic generated successfully!');
    } catch (error) {
      Toast.error('Failed to generate topic. Please try again.');
    }
  };

  const handleTopicSelect = (recentTopic) => {
    dispatch(setCurrentQuestionBook(recentTopic));
    navigation.navigate('QuestionBook', { questionBookId: recentTopic._id });
  };

  // Filter recent topics based on search query
  const filteredTopics = recentTopics.filter(recentTopic =>
    recentTopic?.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background px-5">
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />

      {/* Fixed Header Section */}
      <View className="gap-4 mb-4">
        {/* Topic Input Section */}
        <View className="bg-card border border-border rounded-xl p-2 ">
          <TextInput
            className="text-foreground text-base min-h-[100] max-h-[150]"
            placeholder="Enter your topic here..."
            placeholderTextColor="#A0A0B2"
            value={topic}
            onChangeText={setTopic}
            multiline
            textAlignVertical="top"
          />
        </View>

        <Button
          className="w-full rounded-xl"
          size="lg"
          disabled={!topic.trim() || generateTopicStatus === 'loading'}
          onPress={handleGenerateQuiz}
        >
          <Text className="text-primary-foreground font-semibold text-lg">
            {generateTopicStatus === 'loading' ? 'Generating...' : 'Generate Question'}
          </Text>
        </Button>

        <Text className="text-2xl font-bold mt-4">Recent Topics</Text>
      </View>

      {/* Topics List - Takes remaining height */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {fetchTopicStatus === 'loading' ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-[76px] rounded-lg p-4 mb-3" />
            ))
          ) : filteredTopics.map((recentTopic, index) => (
            <TouchableOpacity
              key={index}
              className="bg-card border border-border rounded-lg p-4 mb-3"
              onPress={() => handleTopicSelect(recentTopic)}
            >
              <Text className="text-foreground font-semibold text-base mb-1">
                {recentTopic.topic}
              </Text>
              <Text className="text-muted-foreground text-sm">
                {getRelativeTime(recentTopic.createdAt)}
              </Text>
            </TouchableOpacity>
          ))}

          {filteredTopics.length === 0 && searchQuery && (
            <View className="items-center py-10">
              <Text className="text-muted-foreground text-base">
                No topics found
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen; 