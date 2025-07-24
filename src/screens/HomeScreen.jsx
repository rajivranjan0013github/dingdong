import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList
} from 'react-native';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopics } from '../redux/slices/topicSlice';
import { useNavigation } from '@react-navigation/native';
import { setCurrentQuestionBook } from '../redux/slices/questionBookSlice';
import { generateTopic } from '../redux/slices/topicSlice';
import { Toast } from 'toastify-react-native';
import { Skeleton } from '../components/ui/skeleton';
import { getRelativeTime } from '../assets/utility';

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
      await dispatch(generateTopic(topic));
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
  const filteredTopics = recentTopics?.filter(recentTopic =>
    recentTopic?.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log('filteredTopics', filteredTopics);

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
        {fetchTopicStatus === 'loading' ? (
          <FlatList
            data={Array.from({ length: 5 })}
            renderItem={({ index }) => (
              <Skeleton key={index} className="h-[76px] rounded-lg p-4 mb-3" />
            )}
            keyExtractor={(_, index) => String(index)}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={filteredTopics}
            keyExtractor={(item) => item._id}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={7}
            removeClippedSubviews={true}
            extraData={filteredTopics}
            // contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 24 }}
            renderItem={({ item: recentTopic }) => (
              <TouchableOpacity
                className="bg-card border border-border rounded-lg p-4 mb-3 flex-row justify-between items-center"
                onPress={() => handleTopicSelect(recentTopic)}
              >
                <View className="flex-col justify-between">
                  <View className="flex-row items-center">
                    <Text className="text-foreground font-semibold text-base mb-1 mr-2 capitalize">
                      {recentTopic?.topic && recentTopic.topic?.length > 25
                        ? recentTopic.topic.substring(0, 20) + '...'
                        : recentTopic?.topic}
                    </Text>
                    <Badge variant={recentTopic?.status === 'completed' ? 'success' : 'default'}>
                      <Text>{recentTopic?.status === 'completed' ? 'Completed' : 'Pending'}</Text>
                    </Badge>
                  </View>
                  <Text className="text-muted-foreground text-sm mt-1">
                  Questions: {recentTopic.questions?.length} | Answered: {recentTopic.questions?.filter(q => q.userAnswer !== undefined)?.length}
                </Text>
                </View>
                <Text className="text-muted-foreground text-sm">
                    {getRelativeTime(recentTopic.createdAt)}
                  </Text>
                
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={searchQuery ? (
              <View className="items-center py-10">
                <Text className="text-muted-foreground text-base">
                  No topics found
                </Text>
              </View>
            ) : null}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen; 