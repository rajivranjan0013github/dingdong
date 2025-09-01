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
  Image,
  DeviceEventEmitter,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setCurrentQuestionBook } from '../redux/slices/questionBookSlice';
import { generateTopic } from '../redux/slices/topicSlice';
import { uploadPdf } from '../redux/slices/topicSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../components/customUI/Logo';
import { pick, types } from '@react-native-documents/picker';
import { Text } from '../components/ui/text';
import TypeWriter from '../components/customUI/TypeWriter';
import SelectedPDF from '../components/customUI/SelectedPDF';
import { storage } from '../utils/MMKVStorage';
import { DEEP_LINK_EVENT } from '../../App';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { generateTopicStatus } = useSelector(state => state.topic);
  const { pdfUploadStatus } = useSelector(state => state.topic);
  const [topic, setTopic] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const navigation = useNavigation();
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when component mounts
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleDeepLink = data => {
      if (data.screen === 'Questions') {
        navigation.navigate('QuestionBook', {
          questionBookId: data.url,
          isDeepLink: true,
        });
      }
    };

    DeviceEventEmitter.addListener(DEEP_LINK_EVENT, handleDeepLink);

    // Check pending deep link from storage
    const pending = storage.getString('pendingDeepLink');
    if (pending) {
      try {
        const deepLinkData = JSON.parse(pending);
        handleDeepLink(deepLinkData);
        storage.delete('pendingDeepLink');
      } catch (error) {
        console.error('Error parsing pending deep link:', error);
      }
    }

    return () => {
      DeviceEventEmitter.removeListener(DEEP_LINK_EVENT, handleDeepLink);
    };
  }, [navigation]);

  const isLoading =
    generateTopicStatus === 'loading' || pdfUploadStatus === 'loading';

  const handleDocumentSelection = async () => {
    try {
      const result = await pick({
        type: [types.pdf],
        allowMultipleSelection: false,
      });

      if (result && result.length > 0) {
        setSelectedDoc(result[0]); // store selected file
      }
    } catch (error) {}
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim() && !selectedDoc) return;

    try {
      navigation.navigate('GeneratingQuiz');
      dispatch(setCurrentQuestionBook(null));

      if (topic.trim()) {
        await dispatch(generateTopic(topic));
      } else if (selectedDoc) {
        const formData = new FormData();
        formData.append('file', {
          uri: selectedDoc.uri,
          type: selectedDoc.type,
          name: selectedDoc.name,
        });

        await dispatch(uploadPdf({ formData }));
      }

      setTopic('');
      setSelectedDoc(null);
      ToastAndroid.show('Quiz generation started!', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(
        'Failed to generate quiz. Please try again.',
        ToastAndroid.SHORT,
      );
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background/95">
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />

      {/* Logo + Title */}
      <View className="flex-1 justify-center items-center">
        <View
          className="w-24 h-24 items-center justify-center mb-2 border-2 border-border rounded-3xl"
          style={{
            shadowColor: '#FFFFFF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 80,
            elevation: 80,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <Image
            source={require('../assets/app-icon.png')}
            style={{ width: 85, height: 85 }}
            resizeMode="contain"
          />
        </View>
        <Logo width={200} height={50} />

        <TypeWriter
          texts={[
            "Try 'CAT Quant Questions'",
            "Try 'SSC CGL English Questions'",
            "Try 'SSC English Grammar'",
            "Try 'Indian History Basics'",
            "Try 'Integration IIT JEE advance level'",
            "Try 'Chemistry NEET level'",
            "Try 'Biolgy Female Human Anatomy'",
          ]}
          className="text-primary text-lg mt-2 mx-8 text-center opacity-80"
        />
      </View>

      {/* Bottom Input + Document Selection */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="px-4 py-4">
          {/* Selected PDF Display */}
          {selectedDoc && (
            <SelectedPDF
              file={selectedDoc}
              onRemove={() => setSelectedDoc(null)}
            />
          )}

          <View className="flex-row items-center bg-secondary rounded-3xl border border-border px-2">
            {/* Document Picker Button */}
            <TouchableOpacity
              onPress={handleDocumentSelection}
              className="w-10 h-10 rounded-full items-center justify-center mr-2"
            >
              <Icon name="document-attach-outline" size={22} color="#A0A0B2" />
            </TouchableOpacity>

            {/* Input */}
            <View className="flex-1 justify-center">
              <TextInput
                ref={inputRef}
                value={topic}
                onChangeText={setTopic}
                placeholder="Enter a topic or select a PDF"
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
                returnKeyType="send"
                onSubmitEditing={handleGenerateQuiz}
                blurOnSubmit={false}
                editable={!selectedDoc}
              />
            </View>

            {/* Send Button */}
            <TouchableOpacity
              onPress={handleGenerateQuiz}
              disabled={(!topic.trim() && !selectedDoc) || isLoading}
              className={`w-12 h-12 rounded-full items-center justify-center ml-2 ${
                (topic.trim() || selectedDoc) && !isLoading
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icon
                  name="send"
                  size={23}
                  color={topic.trim() || selectedDoc ? '#000' : '#666'}
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
