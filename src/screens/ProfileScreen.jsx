import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  // Alert, // Commented out Alert since we are replacing it
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { storage } from '../utils/MMKVStorage';
import { logout } from '../redux/slices/userSlice';
import CustomAlertDialog from '../components/customUI/CustomAlertDialog';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const [isLogoutDialogVisible, setIsLogoutDialogVisible] = useState(false);

  const handleLogout = async () => {
    setIsLogoutDialogVisible(true);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutDialogVisible(false);
    await storage.delete('user');
    dispatch(logout());
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="black" /> */}
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
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <Text style={styles.menuText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('TermsOfService')}
        >
          <Text style={styles.menuText}>Terms of Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <CustomAlertDialog
        visible={isLogoutDialogVisible}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // black background
    alignItems: 'center',
    justifyContent: 'flex-start',
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
