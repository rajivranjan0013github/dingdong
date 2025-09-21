import React, { useEffect } from 'react';
import { View, ActivityIndicator, StatusBar, Text, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const GeneratingSolutionScreen = () => {
  const navigation = useNavigation();
  const { imageUploadStatus, latestSolve, error } = useSelector(state => state.topic);

  useEffect(() => {
    if (imageUploadStatus === 'succeeded' && latestSolve) {
      // Reset stack so back from Solution goes to Home instead of edit/camera screens
      navigation.reset({
        index: 1,
        routes: [
          { name: 'HomeStack' },
          { name: 'Solution' },
        ],
      });
    } else if (imageUploadStatus === 'failed') {
      Alert.alert(
        'Upload Failed',
        error || 'An unexpected error occurred. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [imageUploadStatus, latestSolve, navigation, error]);

  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-white text-lg mt-4 text-center">
        Generating your  solution...
      </Text>
      <Text className="text-gray-400 text-sm mt-2 text-center">
        Good solution takes time. Please do wait patiently.
      </Text>
    </View>
  );
};

export default GeneratingSolutionScreen;


