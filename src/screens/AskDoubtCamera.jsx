import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, TouchableOpacity, StatusBar, Text, DeviceEventEmitter, Dimensions } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
 import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';

const AskDoubtCamera = () => {
   const navigation = useNavigation();
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    })();
  }, [hasPermission, requestPermission]);

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || isTakingPhoto) return;
    try {
      setIsTakingPhoto(true);
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'balanced',
        enableAutoDistortionCorrection: true,
      });
      // Navigate to edit with source context
      navigation.navigate('AskDoubtEdit', { path: photo?.path, source: 'camera' });
      // Emit event or store path if needed
    } catch (e) {
      // noop
    } finally {
      setIsTakingPhoto(false);
    }
  }, [isTakingPhoto, navigation]);

  if (!device) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Camera permission required</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: screenWidth - 35, aspectRatio: 3/4,  overflow: 'hidden', backgroundColor: '#000' }}>
          {isFocused && (
            <Camera
              ref={cameraRef}
              style={{ flex: 1 }}
              device={device}
              isActive={true}
              photo={true}
            />
          )}
        </View>
      </View>

      <View className="absolute top-12 left-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-black/50 items-center justify-center">
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="absolute bottom-10 w-full items-center">
        <TouchableOpacity
          onPress={takePhoto}
          activeOpacity={0.8}
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{ backgroundColor: isTakingPhoto ? 'rgba(255,255,255,0.5)' : '#ffffff' }}
        >
          <View className="w-16 h-16 rounded-full" style={{ backgroundColor: '#000000' }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AskDoubtCamera;


