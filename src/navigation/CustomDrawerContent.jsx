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
import Icon from 'react-native-vector-icons/Ionicons';

const CustomDrawerContent = () => {
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

  console.log('recentTopics', recentTopics);

  useEffect(() => {
    dispatch(fetchTopics({ skip: 0, limit: 20 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore && fetchTopicStatus === 'succeeded') {
      dispatch(fetchMoreTopics({ skip, limit }));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchTopics({ skip: 0, limit: 20 }));
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
    <View className="flex-1 bg-[#1F1B24]">
      {/* Home Button */}
      {/* <TouchableOpacity
        onPress={() => navigation.navigate('HomeDrawer')}
        className="p-4 border-t border-border flex-row items-center"
      >
        <Icon name="home" size={24} color="#fff" />
        <Text className="text-foreground text-base ml-3">Home</Text>
      </TouchableOpacity> */}

      {/* Header */}
      <View className="p-4 border-b border-gray-700">
        <Text className="text-xl font-bold text-foreground">Question History</Text>
      </View>

      {/* History List */}
      <View className="flex-1">
        {fetchTopicStatus === 'loading' ? (
          <FlatList
            data={Array.from({ length: 10 })}
            renderItem={({ index }) => (
              <Skeleton key={index} className="h-[76px] p-4 mb-3" />
            )}
            keyExtractor={(_, index) => String(index)}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={recentTopics}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={20}
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
                className="border-b border-border p-4 flex-row justify-between items-center"
                onPress={() => handleTopicSelect(recentTopic)}
              >
                <View className="flex-1 flex-row justify-between items-center">
                  <Text className="text-foreground font-semibold capitalize flex-1 mr-2">
                    {recentTopic?.topic && recentTopic.topic?.length > 30
                      ? recentTopic.topic.substring(0, 30) + '...'
                      : recentTopic?.topic}
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    {getRelativeTime(recentTopic.createdAt)}
                  </Text>
                </View>
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

export default CustomDrawerContent;
