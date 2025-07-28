// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   FlatList,
//   ActivityIndicator,
//   ToastAndroid,
// } from 'react-native';
// import { Text } from '../components/ui/text';
// import { Button } from '../components/ui/button';
// import { Badge } from '../components/ui/badge';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTopics, fetchMoreTopics } from '../redux/slices/topicSlice';
// import { useNavigation } from '@react-navigation/native';
// import { setCurrentQuestionBook } from '../redux/slices/questionBookSlice';
// import { generateTopic } from '../redux/slices/topicSlice';
// import { Toast } from 'toastify-react-native';
// import { Skeleton } from '../components/ui/skeleton';
// import { getRelativeTime } from '../assets/utility';
// import Icon from 'react-native-vector-icons/Ionicons';

// const HomeScreen = () => {
//   const dispatch = useDispatch();
//   const {
//     topics: recentTopics,
//     fetchTopicStatus,
//     generateTopicStatus,
//     hasMore,
//     isFetchingMore,
//     skip,
//     limit,
//   } = useSelector(state => state.topic);
//   const [topic, setTopic] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigation = useNavigation();

//   useEffect(() => {
//     console.log('fetching topics');
//     dispatch(fetchTopics({ skip: 0, limit: 10 }));
//   }, [dispatch]);

//   const handleLoadMore = () => {
//     if (hasMore && !isFetchingMore && fetchTopicStatus === 'succeeded') {
//       dispatch(fetchMoreTopics({ skip, limit }));
//     }
//   };

//   const handleGenerateQuiz = async () => {
//     try {
//       navigation.navigate('GeneratingQuiz'); // Navigate to the loading screen
//       dispatch(setCurrentQuestionBook(null)); // Clear previous question book before generating a new one
//       await dispatch(generateTopic(topic));
//       setTopic('');
//       ToastAndroid.show('Topic generated successfully!', ToastAndroid.SHORT);
//     } catch (error) {
//       ToastAndroid.show('Failed to generate topic. Please try again.', ToastAndroid.SHORT);
//     }
//   };

//   const handleTopicSelect = recentTopic => {
//     navigation.navigate('QuestionBook', { questionBookId: recentTopic._id });
//     // dispatch(setCurrentQuestionBook(recentTopic));
//   };

//   // Filter recent topics based on search query
//   const filteredTopics = searchQuery
//     ? recentTopics?.filter(recentTopic =>
//         recentTopic?.topic?.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//     : recentTopics;
//   // console.log('filteredTopics', filteredTopics);

//   return (
//     <SafeAreaView className="flex-1 bg-background px-5">
//       <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
//       <Text className="text-2xl font-bold mt-4">Recent Topics</Text>

//       <View className="flex-1">
//         {fetchTopicStatus === 'loading' ? (
//           <FlatList
//             data={Array.from({ length: 5 })}
//             renderItem={({ index }) => (
//               <Skeleton key={index} className="h-[76px] rounded-lg p-4 mb-3" />
//             )}
//             keyExtractor={(_, index) => String(index)}
//             showsVerticalScrollIndicator={false}
//           />
//         ) : (
//           <FlatList
//             data={filteredTopics}
//             keyExtractor={item => item._id}
//             initialNumToRender={5}
//             maxToRenderPerBatch={5}
//             windowSize={7}
//             removeClippedSubviews={true}
//             extraData={filteredTopics}
//             renderItem={({ item: recentTopic }) => (
//               <TouchableOpacity
//                 className="bg-card border border-border rounded-lg p-4 mb-3 flex-row justify-between items-center"
//                 onPress={() => handleTopicSelect(recentTopic)}
//               >
//                 <View className="flex-col justify-between">
//                   <View className="flex-row items-center">
//                     <Text className="text-foreground font-semibold text-base mb-1 mr-2 capitalize">
//                       {recentTopic?.topic && recentTopic.topic?.length > 25
//                         ? recentTopic.topic.substring(0, 20) + '...'
//                         : recentTopic?.topic}
//                     </Text>
//                     <Badge
//                       variant={
//                         recentTopic?.status === 'completed'
//                           ? 'success'
//                           : 'default'
//                       }
//                     >
//                       <Text>
//                         {recentTopic?.status === 'completed'
//                           ? 'Completed'
//                           : 'Pending'}
//                       </Text>
//                     </Badge>
//                   </View>
//                   <Text className="text-muted-foreground text-sm mt-1">
//                   Questions: {recentTopic?.questionLength} | Answered: {recentTopic?.answeredLength} | Correct: {recentTopic?.correctLength}
//                 </Text>
//                 </View>
//                 <Text className="text-muted-foreground text-sm">
//                   {getRelativeTime(recentTopic.createdAt)}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={
//               searchQuery ? (
//                 <View className="items-center py-10">
//                   <Text className="text-muted-foreground text-base">
//                     No topics found
//                   </Text>
//                 </View>
//               ) : null
//             }
//             onEndReached={handleLoadMore}
//             onEndReachedThreshold={0.5}
//             ListFooterComponent={
//               isFetchingMore && hasMore ? (
//                 <View style={{ paddingVertical: 16 }}>
//                   <ActivityIndicator size="small" color="#888" />
//                 </View>
//               ) : null
//             }
//           />
//         )}
//       </View>
//       {/* Fixed Header Section */}
//       {/* <View className="gap-4 mb-4">
//         <View className="bg-card border border-border rounded-xl p-2 ">
//           <TextInput
//             className="text-foreground text-base min-h-[100] max-h-[150]"
//             placeholder="Enter your topic here..."
//             placeholderTextColor="#A0A0B2"
//             value={topic}
//             onChangeText={setTopic}
//             multiline
//             textAlignVertical="top"
//           />
//         </View>

//         <Button
//           className="w-full rounded-xl"
//           size="lg"
//           disabled={!topic.trim() || generateTopicStatus === 'loading'}
//           onPress={handleGenerateQuiz}
//         >
//           <Text className="text-primary-foreground font-semibold text-lg">
//             {generateTopicStatus === 'loading'
//               ? 'Generating...'
//               : 'Generate Question'}
//           </Text>
//         </Button>
//       </View> */}

//       <View className="flex-row items-end bg-card border border-border rounded-2xl px-4 py-2 mt-2">
//         <TextInput
//           className="flex-1 border border-yellow-500 text-foreground text-base max-h-[120] min-h-[50] py-2 pr-2"
//           placeholder="Type a topic to generate questions..."
//           placeholderTextColor="#A0A0B2"
//           value={topic}
//           onChangeText={setTopic}
//           multiline
//           textAlignVertical="top"
//         />
//         <TouchableOpacity
//           onPress={handleGenerateQuiz}
//           disabled={!topic.trim() || generateTopicStatus === 'loading'}
//           className="ml-2 bg-primary p-2 rounded-full"
//         >
//           {generateTopicStatus === 'loading' ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Icon name="send" size={24} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;
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
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    console.log('fetching topics');
    dispatch(fetchTopics({ skip: 0, limit: 10 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore && fetchTopicStatus === 'succeeded') {
      dispatch(fetchMoreTopics({ skip, limit }));
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

  const filteredTopics = searchQuery
    ? recentTopics?.filter(recentTopic =>
        recentTopic?.topic?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : recentTopics;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      
      {/* Header */}
      <View className="px-5  pb-2">
        <Text className="text-2xl font-bold">Recent Topics</Text>
      </View>

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
            keyExtractor={item => item._id}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={7}
            removeClippedSubviews={true}
            extraData={filteredTopics}
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
              searchQuery ? (
                <View className="items-center py-10">
                  <Text className="text-muted-foreground text-base">
                    No topics found
                  </Text>
                </View>
              ) : null
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

      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View className="bg-background px-2 py-3">
        <View className="flex-row items-end ">
          {/* Input Container */}
          <View className="flex-1 bg-secondary rounded-3xl min-h-[44px] max-h-[120px] px-4 py-2 mr-2 justify-center border border-border">
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder="Generate questions from any topic"
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
