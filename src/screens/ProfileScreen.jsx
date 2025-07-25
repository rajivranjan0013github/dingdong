import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../redux/slices/userSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          dispatch(logout());
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.avatar}>
        <Text style={styles.initials}>
          {user?.name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()}
        </Text>
      </View>
      <Text style={styles.name}>{user?.name}</Text>
      {user?.email && <Text style={styles.email}>{user.email}</Text>}

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // black background
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  avatar: {
    backgroundColor: '#4a90e2',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  initials: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 40,
  },
  menu: {
    width: '100%',
    paddingHorizontal: 30,
  },
  menuItem: {
    backgroundColor: '#1c1c1e',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  menuText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ProfileScreen;
