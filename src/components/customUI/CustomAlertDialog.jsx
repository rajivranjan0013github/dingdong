import React from 'react';
import { Modal, View } from 'react-native';
import { Text } from '../../components/ui/text';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const CustomAlertDialog = ({
  visible,
  onCancel,
  onConfirm,
  title = 'Are you sure?',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon,
  children,
}) => (
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
        {/* Icon or default warning icon */}
        <View className="items-center justify-center -mt-7 mb-2">
          {icon !== undefined ? (
            icon
          ) : (
            <View className="bg-orange-400 rounded-full w-14 h-14 items-center justify-center shadow-md">
              <Text className="text-3xl font-bold text-white">!</Text>
            </View>
          )}
        </View>
        <CardHeader className="items-center mt-2">
          <CardTitle className="text-xl font-bold text-primary text-center mb-1">
            <Text className="text-xl font-bold text-primary text-center mb-1">
              {title}
            </Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-0 pt-1">
          {children ? (
            children
          ) : (
            <Text className="text-base text-muted-foreground text-center mb-6">
              {message}
            </Text>
          )}
          <View className="flex-row justify-center gap-3 mb-4">
            <Button
              variant="outline"
              className="flex-1 border-border"
              onPress={onCancel}
            >
              <Text className="text-base text-muted-foreground font-semibold">{cancelText}</Text>
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onPress={onConfirm}
            >
              <Text className="text-base text-white font-bold">{confirmText}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  </Modal>
);

export default CustomAlertDialog; 