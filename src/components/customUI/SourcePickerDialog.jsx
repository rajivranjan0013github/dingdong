import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '../../components/ui/text';

const SourcePickerDialog = ({
  visible,
  onClose,
  onCamera,
  onGallery,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
      <View style={{ backgroundColor: '#111111', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 28 }}>
        <Text className="text-white text-base font-semibold mb-1">Ask Doubt</Text>
        <Text className="text-white/70 mb-4">Choose image source</Text>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onCamera}
            className="flex-1 rounded-2xl items-center justify-center px-4 py-5"
            style={{ backgroundColor: 'rgba(59,130,246,0.15)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)' }}
            activeOpacity={0.85}
          >
            <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: 'rgba(59,130,246,0.2)' }}>
              <Icon name="camera-outline" size={22} color="#3b82f6" />
            </View>
            <Text className="text-white font-medium">Camera</Text>
            <Text className="text-white/60 text-xs mt-1">Take a new photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onGallery}
            className="flex-1 rounded-2xl items-center justify-center px-4 py-5"
            style={{ backgroundColor: 'rgba(16,185,129,0.15)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' }}
            activeOpacity={0.85}
          >
            <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: 'rgba(16,185,129,0.2)' }}>
              <Icon name="image-outline" size={22} color="#10b981" />
            </View>
            <Text className="text-white font-medium">Gallery</Text>
            <Text className="text-white/60 text-xs mt-1">Choose from library</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onClose} className="mt-4 items-center justify-center py-3 rounded-2xl" style={{ backgroundColor: '#1F1F2E' }}>
          <Text className="text-white/80">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default SourcePickerDialog;


