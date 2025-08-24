// components/UserInitialsBadge.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const UserInitialsBadge = ({ name, onPress }) => {
  const initials = name
    ? name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.circle}>
        <Text style={styles.text}>{initials}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserInitialsBadge;
