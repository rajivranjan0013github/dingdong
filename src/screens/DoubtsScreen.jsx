import React, { useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '../components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoubts } from '../redux/slices/doubtsSlice';
import MarkdownMathView from 'react-native-markdown-math-view';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getRelativeTime } from '../assets/utility';

const DoubtSkeleton = () => (
  <View className="mb-4 bg-gray-900 border border-gray-800 rounded-lg p-4 h-28 opacity-50">
    <View className="flex-1">
      <View className="h-4 bg-gray-700 rounded w-3/4 mb-3" />
      <View className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
      <View className="h-3 bg-gray-700 rounded w-1/4" />
    </View>
  </View>
);

const DoubtsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { doubts, fetchDoubtsStatus } = useSelector(
    (state) => state.doubts
  );

  useEffect(() => {
    dispatch(fetchDoubts());
  }, [dispatch]);

  const renderDoubt = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Solution', { doubt: item })}>
      <View className="mb-4 bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <MarkdownMathView
              markdownStyle={{
                body: { color: '#e5e7eb', fontSize: 16 },
                text: { color: '#e5e7eb' },
                paragraph: { margin: 0 },
              }}
            >
              {item.question.length > 100 ? `${item.question.substring(0, 100)}...` : item.question}
            </MarkdownMathView>
            <Text className="text-gray-400 text-xs mt-3">
              {getRelativeTime(item.createdAt)}
            </Text>
          </View>
          <Icon name="chevron-forward-outline" size={24} color="#6b7280" />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (fetchDoubtsStatus === 'loading' && doubts.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <FlatList
          data={Array.from({ length: 5 })}
          renderItem={DoubtSkeleton}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={doubts}
        renderItem={renderDoubt}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <Icon name="help-circle-outline" size={64} color="#4b5563" />
            <Text className="text-muted-foreground text-lg mt-4">
              No Doubts Found
            </Text>
            <Text className="text-gray-500 text-center mt-2 px-4">
              You haven't asked any doubts yet. Use the camera to snap a question!
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
};

export default DoubtsScreen;
