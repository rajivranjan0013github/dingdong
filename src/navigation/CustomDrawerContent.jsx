import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const CustomDrawerContent = props => {
  const { user, setIsLoggedIn } = props;

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');

      setIsLoggedIn(false);
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );

    } catch (e) {
      console.error('Failed to clear user from AsyncStorage', e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerHeaderText}>
            {user ? `Welcome, ${JSON.parse(user).name}` : 'Welcome Guest'}
          </Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      {user && (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    marginBottom: 10,
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: 'red',
  },
});

export default CustomDrawerContent;
