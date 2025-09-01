import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '../ui/text';

const SelectedPDF = ({ file, onRemove }) => {
  if (!file) return null;

  return (
    <View className="flex-row items-center bg-secondary/50 rounded-xl p-3 mb-4 border border-border">
      <Icon name="document-text" size={24} color="#A0A0B2" />
      <View className="flex-1 ml-3">
        <Text className="text-sm text-primary font-medium">{file.name}</Text>
        <Text className="text-xs text-muted-foreground mt-1">
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </Text>
      </View>
      <TouchableOpacity
        onPress={onRemove}
        className="w-8 h-8 rounded-full items-center justify-center bg-destructive/10"
      >
        <Icon name="close" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};

export default SelectedPDF;



