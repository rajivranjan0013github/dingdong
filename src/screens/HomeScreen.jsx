import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  DeviceEventEmitter,
  RefreshControl,
} from 'react-native';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopics, fetchMoreTopics } from '../redux/slices/topicSlice';
import { useNavigation } from '@react-navigation/native';
import { setCurrentQuestionBook } from '../redux/slices/questionBookSlice';
import { generateTopic } from '../redux/slices/topicSlice';
import { Toast } from 'toastify-react-native';
import { Skeleton } from '../components/ui/skeleton';
import { getRelativeTime } from '../assets/utility';
import Icon from 'react-native-vector-icons/Ionicons';
import { storage } from '../utils/MMKVStorage';
import { DEEP_LINK_EVENT } from '../../App';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const {
    topics: recentTopics,
    fetchTopicStatus,
    generateTopicStatus,
    hasMore,
    isFetchingMore,
    skip,
    limit,
  } = useSelector(state => state.topic);
  const [topic, setTopic] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(fetchTopics({ skip: 0, limit: 10 }));
  }, [dispatch]);

  // Handle pending deep link from MMKV
  useEffect(() => {
    const checkPendingDeepLink = () => {
      try {
        const pendingDeepLink = storage.getString('pendingDeepLink');
        if (pendingDeepLink) {
          const deepLinkData = JSON.parse(pendingDeepLink);
          
          // Navigate to the target screen
          if (deepLinkData.screen === 'Questions') {
            
            navigation.navigate('QuestionBook', { questionBookId: deepLinkData.url, isDeepLink: true });
          } else if (deepLinkData.screen === 'Profile') {
            navigation.navigate('Profile');
          } else if (deepLinkData.screen === 'Quiz') {
            navigation.navigate('Quiz');
          }
          
          // Clear the pending deep link immediately after navigation
          storage.delete('pendingDeepLink');
        }
      } catch (error) {
        console.error('Error handling pending deep link:', error);
      }
    };

    // Check for deep link after a short delay to ensure navigation is ready
    const timer = setTimeout(checkPendingDeepLink, 100);
    
    // Listen for deep link events instead of polling
    const deepLinkListener = DeviceEventEmitter.addListener(DEEP_LINK_EVENT, (deepLinkData) => {
      // Navigate immediately when deep link is received
      if (deepLinkData.screen === 'Questions') {
        navigation.navigate('QuestionBook', { questionBookId: deepLinkData.url, isDeepLink: true });
      } else if (deepLinkData.screen === 'Profile') {
        navigation.navigate('Profile');
      } else if (deepLinkData.screen === 'Quiz') {
        navigation.navigate('Quiz');
      }
      
      // Clear the pending deep link immediately after navigation
      storage.delete('pendingDeepLink');
    });
    
    // Listen for screen focus to check for deep links
    const unsubscribe = navigation.addListener('focus', () => {
      checkPendingDeepLink();
    });

    return () => {
      clearTimeout(timer);
      deepLinkListener.remove();
      unsubscribe();
    };
  }, [navigation]);

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore && fetchTopicStatus === 'succeeded') {
      dispatch(fetchMoreTopics({ skip, limit }));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchTopics({ skip: 0, limit: 10 }));
    } catch (error) {
      console.error('Error refreshing topics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return;
    
    try {
      navigation.navigate('GeneratingQuiz');
      dispatch(setCurrentQuestionBook(null));
      await dispatch(generateTopic(topic));
      setTopic(''); // Clear input after sending
      ToastAndroid.show('Topic generated successfully!', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Failed to generate topic. Please try again.', ToastAndroid.SHORT);
    }
  };

  const handleTopicSelect = recentTopic => {
    navigation.navigate('QuestionBook', { questionBookId: recentTopic._id });
  };

  const filteredTopics = recentTopics;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      
      {/* Header */}
      {/* <View className="px-5  pb-2">
        <Text className="text-2xl font-bold">Recent Topics</Text>
      </View> */}

      {/* Topics List */}
      <View className="flex-1 px-5">
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
            keyExtractor={(item, index) => `${item._id}-${index}`}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={7}
            removeClippedSubviews={true}
            extraData={filteredTopics}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#888']}
                tintColor="#888"
              />
            }
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
                    <Badge
                      variant={
                        recentTopic?.status === 'completed'
                          ? 'success'
                          : 'default'
                      }
                    >
                      <Text>
                        {recentTopic?.status === 'completed'
                          ? 'Completed'
                          : 'Pending'}
                      </Text>
                    </Badge>
                  </View>
                  <Text className="text-muted-foreground text-sm mt-1">
                    Questions: {recentTopic?.questionLength} | Answered: {recentTopic?.answeredLength} | Correct: {recentTopic?.correctLength}
                  </Text>
                </View>
                <Text className="text-muted-foreground text-sm">
                  {getRelativeTime(recentTopic.createdAt)}
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={null}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingMore && hasMore ? (
                <View style={{ paddingVertical: 16 }}>
                  <ActivityIndicator size="small" color="#888" />
                </View>
              ) : null
            }
          />
        )}
      </View>

      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View className="bg-background px-2 py-3">
        <View className="flex-row items-end ">
          {/* Input Container */}
          {/* <View className="flex-1 bg-secondary rounded-3xl min-h-[44px] max-h-[120px] px-4 py-2 mr-2 justify-center border border-border">
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder="Describe a topic to generate questions"
              placeholderTextColor="#A0A0B2"
              multiline
              textAlignVertical="center"
              style={{
                fontSize: 16,
                lineHeight: 20,
                maxHeight: 100,
                paddingVertical: Platform.OS === 'ios' ? 8 : 4,
                color: '#fff',
              }}
              className="text-foreground"
              returnKeyType="send"
              onSubmitEditing={handleGenerateQuiz}
              blurOnSubmit={false}
            />
          </View> */}

<View 
  className="flex-1 bg-secondary rounded-3xl min-h-[44px] max-h-[120px] px-4 py-2 mr-2 justify-center border border-border"
  style={{
    shadowColor: '#ffffff', // or any color you prefer
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 5, 
  }}
>
  <TextInput
    value={topic}
    onChangeText={setTopic}
    placeholder="Describe a topic to generate questions"
    placeholderTextColor="#A0A0B2"
    multiline
    textAlignVertical="center"
    style={{
      fontSize: 16,
      lineHeight: 20,
      maxHeight: 100,
      paddingVertical: Platform.OS === 'ios' ? 8 : 4,
      color: '#fff',
    }}
    className="text-foreground"
    returnKeyType="send"
    onSubmitEditing={handleGenerateQuiz}
    blurOnSubmit={false}
  />
</View>

          <TouchableOpacity
            onPress={handleGenerateQuiz}
            disabled={!topic.trim() || generateTopicStatus === 'loading'}
            className={`w-12 h-12 p-2 rounded-full items-center justify-center ${
              topic.trim() && generateTopicStatus !== 'loading'
                ? 'bg-primary'
                : 'bg-muted'
            }`}
          >
            {generateTopicStatus === 'loading' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon
                name="send"
                size={23}
                color={topic.trim() ? '#000' : '#666'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
    
    </SafeAreaView>
  );
};

export default HomeScreen;
