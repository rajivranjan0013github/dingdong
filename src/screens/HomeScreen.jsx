import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert,
  DeviceEventEmitter,
  // KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setCurrentQuestionBook } from '../redux/slices/questionBookSlice';
import { generateTopic } from '../redux/slices/topicSlice';
import { uploadPdf } from '../redux/slices/topicSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { pick, types } from '@react-native-documents/picker';
import { Text } from '../components/ui/text';
import TypeWriter from '../components/customUI/TypeWriter';
import SelectedPDF from '../components/customUI/SelectedPDF';
import { storage } from '../utils/MMKVStorage';
import { DEEP_LINK_EVENT } from '../../App';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Card } from '../components/ui/card';


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
    }, 200);

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
      DeviceEventEmitter.removeAllListeners(DEEP_LINK_EVENT);
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

  const handleScanDoubt = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('Scan a doubt coming soon', ToastAndroid.SHORT);
    } else {
      Alert.alert('Coming soon', 'Scan a doubt is coming soon');
    }
  };

  const handleEnterTopic = () => {
    inputRef.current?.focus();
  };


  return (
    <SafeAreaView className="flex-1 ">
    <KeyboardAvoidingView
    behavior={'height'}
    keyboardVerticalOffset={100}
    style={{flex: 1}}
  >
    
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" translucent />

      {/* Feature cards + Typewriter */}
      <View className="flex-1 justify-center items-center">
        <View className="w-full px-4 mt-2">
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1" activeOpacity={0.8} onPress={handleScanDoubt}>
                <Card className="h-24 bg-card border-border rounded-xl">
                  <View className="flex-1 p-4 items-center justify-center gap-2">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(99,102,241,0.15)' }}
                    >
                      <Icon name="camera-outline" size={22} color="#6366f1" />
                    </View>
                    <Text className="text-card-foreground font-medium text-center text-gray-500">Ask  doubt</Text>
                  </View>
                </Card>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1" activeOpacity={0.8} onPress={handleDocumentSelection}>
                <Card className="h-24 bg-card border-border rounded-xl">
                  <View className="flex-1 p-4 items-center justify-center gap-2">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(16,185,129,0.15)' }}
                    >
                      <Icon name="document-text-outline" size={22} color="#10b981" />
                    </View>
                    <Text className="text-card-foreground font-medium text-center text-gray-500">Scan PDF</Text>
                  </View>
                </Card>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1" activeOpacity={0.8} onPress={handleEnterTopic}>
                <Card className="h-24 bg-card border-border rounded-xl">
                  <View className="flex-1 p-4 items-center justify-center gap-2">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(59,130,246,0.15)' }}
                    >
                      <Icon name="create-outline" size={22} color="#3b82f6" />
                    </View>
                    <Text className="text-card-foreground font-medium text-center text-gray-500">Enter topic</Text>
                  </View>
                </Card>
            </TouchableOpacity>
          </View>
        </View>

        <TypeWriter
          texts={[
            "Try 'World Map based questions for UPSC'",
            "Try 'Quit India Movement based questions for UPSC'",
            "Try 'Profit and Loss for SSC CGL'",
            "Try 'Indian History for SSC CGL'",
            "Try 'Quantitative Aptitude for CAT'",
            "Try 'Chemistry for NEET'",
            "Try 'Biolgy Female Human Anatomy'",
          ]}
          className="text-primary text-lg mt-4 mx-8 text-center opacity-80"
        />
      </View>

      
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
