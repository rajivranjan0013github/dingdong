import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text } from '../components/ui/text';
import { Badge } from '../components/ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopics, fetchMoreTopics } from '../redux/slices/topicSlice';
import { useNavigation } from '@react-navigation/native';
import { Skeleton } from '../components/ui/skeleton';
import { getRelativeTime } from '../assets/utility';

const QuestionHistory = () => {
  const dispatch = useDispatch();
  const {
    topics: recentTopics,
    fetchTopicStatus,
    hasMore,
    isFetchingMore,
    skip,
    limit,
  } = useSelector(state => state.topic);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(fetchTopics({ skip: 0, limit: 10 }));
  }, [dispatch]);

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

  const handleTopicSelect = recentTopic => {
    navigation.navigate('QuestionBook', { questionBookId: recentTopic._id });
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-2">
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
            data={recentTopics}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={7}
            removeClippedSubviews={true}
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
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-muted-foreground text-base">No questions yet</Text>
              </View>
            }
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
    </View>
  );
};

export default QuestionHistory;
