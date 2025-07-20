import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { ChevronDownIcon, ChevronLeftIcon } from 'lucide-react-native';

const CustomHeader = ({ title, timer = 0, onSubmit, totalQuestions = 0, currentQuestion = 0 }) => {
  const navigation = useNavigation();

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className='flex-row items-center justify-between bg-black py-2 px-4 border-b border-secondary'>
      <View className='flex-row items-center gap-4'>
        <View className='flex-col items-start gap-1'>
          <Text className='text-white text-xl font-bold'>{title}</Text>
          <Text className='text-white text-xs'>{formatTime(timer)}</Text>
        </View>
      </View>
      <View className='text-xs text-center justify-center items-center'>
        <Text className='text-sm text-white'>{currentQuestion}/{totalQuestions}</Text>
        <ChevronDownIcon size={16} color='white' />
      </View>
      <Button size='sm' className='h-8 text-xs' onPress={onSubmit}>
        <Text className='text-xs'>Submit</Text>
      </Button>
    </View>
  );
};

export default CustomHeader; 