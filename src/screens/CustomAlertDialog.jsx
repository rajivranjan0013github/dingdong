import React from 'react';
import { Modal, View } from 'react-native';
import { Text } from '../components/ui/text';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const CustomAlertDialog = ({ visible, onCancel, onConfirm }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onCancel}
  >
    <View style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Card className="w-11/12 max-w-md items-center p-0 bg-secondary rounded-2xl shadow-2xl">
        {/* Warning Icon */}
        <View className="bg-orange-400 rounded-full w-14 h-14 items-center justify-center -mt-7 shadow-md">
          <Text className="text-3xl font-bold text-white">!</Text>
        </View>
        <CardHeader className="items-center mt-2">
          <CardTitle className="text-xl font-bold text-primary text-center mb-1">Reattempt All Questions?</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-0 pt-1">
          <Text className="text-base text-muted-foreground text-center mb-6">
            This will clear all your previous answers. Are you sure you want to reattempt?
          </Text>
          <View className="flex-row justify-center gap-3 mb-4">
            <Button
              variant="outline"
              className="flex-1 border-border"
              onPress={onCancel}
            >
              <Text className="text-base text-muted-foreground font-semibold">Cancel</Text>
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onPress={onConfirm}
            >
              <Text className="text-base text-white font-bold">Reattempt</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  </Modal>
);

export default CustomAlertDialog; 