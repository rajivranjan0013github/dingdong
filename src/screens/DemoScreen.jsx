import React from 'react';
import { View, Text, Share } from 'react-native';
import { Button } from '../components/ui/button';

const DemoScreen = () => {
  return (
    <View>
      <Text>Demo Screen</Text>
      <Button onPress={() => Share.share({
        message: 'Hello, world!',
      })}>
        <Text>Share</Text>
      </Button>
    </View>
  );
};

export default DemoScreen;