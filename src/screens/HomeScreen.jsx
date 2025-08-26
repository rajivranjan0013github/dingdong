import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setCurrentQuestionBook } from '../redux/slices/questionBookSlice';
import { generateTopic } from '../redux/slices/topicSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../components/customUI/Logo';
import { Text } from '../components/ui/text';
import TypeWriter from '../components/customUI/TypeWriter';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { generateTopicStatus } = useSelector(state => state.topic);
  const [topic, setTopic] = useState('');
  const navigation = useNavigation();
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when component mounts
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

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

  return (
    <SafeAreaView className="flex-1 bg-background/95">
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      
      {/* Main Content - Logo and Name */}
      <View className="flex-1 justify-center items-center">
        <View
          className="w-24 h-24 items-center justify-center mb-2 border-2 border-border rounded-3xl"
          style={{
            shadowColor: '#FFFFFF',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 80,
            elevation: 80,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <Image
            source={require('../assets/app-icon.png')}
            style={{
              width: 85,
              height: 85,
            }}
            resizeMode="contain"
          />
        </View>
        <Logo width={200} height={50} />
        {/* <Text className="text-white text-md opacity-50">
          Enter a topic to generate questions
        </Text> */}
        <TypeWriter
          texts={[
            "Try 'React Native Basics JavaScript ES6 Features JavaScript ES6 Features'",
            "Try 'JavaScript ES6 Features'",
            "Try 'Data Structures and Algorithms'",
            "Try 'System Design Concepts'",
            "Try 'Machine Learning Fundamentals'"
          ]}
          className="text-primary text-lg mt-2 mx-8 text-center opacity-80"
        />
      </View>

      {/* Bottom Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="px-4 py-4">
          <View className="flex-row items-center">
            <View className="flex-1 bg-secondary rounded-3xl min-h-[44px] max-h-[120px] px-4 py-2 mr-2 justify-center border border-border">
              <TextInput
                ref={inputRef}
                value={topic}
                onChangeText={setTopic}
                placeholder="Enter a topic"
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
              className={`w-12 h-12 rounded-full items-center justify-center ${
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
