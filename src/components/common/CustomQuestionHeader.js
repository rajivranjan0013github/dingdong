import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, EllipsisVertical } from 'lucide-react-native';

const CustomQuestionHeader = () => {
  const navigation = useNavigation();
 

  return (
    <View className='bg-black h-16 border-b border-secondary flex-row items-center justify-between px-4'>
        <View className='flex-row items-center gap-2'>
            <ChevronLeftIcon size={24} color='white' onPress={() => navigation.goBack()} />
            <Text className='text-white text-lg font-bold'>Playground</Text>
        </View>
        <View className='flex-row items-center gap-2'>
            <EllipsisVertical size={24} color='white' />
        </View>
    </View>
  );
};

export default CustomQuestionHeader;