import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Settings01Icon } from '@hugeicons/core-free-icons';

import { UserContext } from '../context/UserContext';
import Colors from '../shared/Colors';

export default function HomeHeader() {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <Image
          source={require('./../assets/images/user.png')}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user?.name || 'User'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.settingsButton}>
        <HugeiconsIcon icon={Settings01Icon} size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.PRIMARY_CONTAINER,
  },
  textContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: Colors.ON_SURFACE_VARIANT,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  settingsButton: {
    padding: 10,
    backgroundColor: '#ebf5f1',
    borderRadius: 99,
  }
});