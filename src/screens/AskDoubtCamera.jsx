import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StatusBar, Text, Alert, Platform, PermissionsAndroid, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExpoImageCropTool from 'expo-image-crop-tool';
import { useDispatch } from 'react-redux';
import { uploadDoubtImage } from '../redux/slices/topicSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { Camera } from 'react-native-camera-kit';

const AskDoubtCamera = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isProcessingRef = useRef(false);
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(Platform.OS === 'ios' ? true : false);
  const [croppedImage, setCroppedImage] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
          );
          const granted = result === PermissionsAndroid.RESULTS.GRANTED;
          setHasPermission(granted);
          if (!granted) {
            Alert.alert('Permission required', 'Please allow Camera access to take a photo.');
          }
        } else {
          setHasPermission(true);
        }
      } catch (e) {
        setHasPermission(false);
      }
    };
    requestPermission();
  }, []);

  const handleCapture = async () => {
    try {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      const data = await cameraRef.current?.capture();
      const source = data?.uri || (data?.path ? `file://${data.path}` : null);
      if (!source) {
        throw new Error('No image captured');
      }

      const cropResult = await ExpoImageCropTool.openCropperAsync({
        imageUri: source,
        shape: 'rectangle',
        format: 'jpeg',
        compressImageQuality: 0.9,
      });

      const out = typeof cropResult === 'string' ? cropResult : cropResult?.uri || cropResult?.path;
      if (!out) throw new Error('Cropping cancelled');
      const finalUri = out.startsWith('file://') ? out : `file://${out}`;

      // Immediately upload and navigate to generating screen; do not show preview
      const formData = new FormData();
      formData.append('file', {
        uri: finalUri,
        type: 'image/jpeg',
        name: 'doubt.jpg',
      });
      navigation.navigate('GeneratingSolution');
      dispatch(uploadDoubtImage({ formData }));
    } catch (e) {
      navigation.goBack();
    } finally {
      isProcessingRef.current = false;
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {hasPermission ? (
        <>
          <Camera
            ref={cameraRef}
            style={{ flex: 1 }}
            cameraType={'back'}
            flashMode={'auto'}
            focusMode={'on'}
            zoomMode={'on'}
            resizeMode={'cover'}
          />

          <View className="absolute bottom-10 left-0 right-0 items-center justify-center">
            <TouchableOpacity onPress={handleCapture} className="w-16 h-16 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: '#fff' }}>
              <View style={{ width: 52, height: 52, borderRadius: 52, backgroundColor: '#fff' }} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white">Camera permission is required.</Text>
        </View>
      )}

      <View className="absolute top-12 left-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-black/50 items-center justify-center">
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AskDoubtCamera;