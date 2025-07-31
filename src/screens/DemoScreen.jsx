import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../components/ui/button';
import Share from 'react-native-share';

const DemoScreen = ({route}) => {
  const shareContent = async () => {
    const shareOptions = {
      title: 'hello',
      message: 'nothing',
      url: 'https://www.google.com', // Local file or base64
      type: 'text/plain',
      failOnCancel: false,
    };

    try {
      const result = await Share.open(shareOptions);
      console.log(result);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };


  return (
    <View>
      <Text>Demo Screen</Text>
      <Button onPress={shareContent}>
        <Text>Share</Text>
      </Button>
    </View>
  );
};

export default DemoScreen;