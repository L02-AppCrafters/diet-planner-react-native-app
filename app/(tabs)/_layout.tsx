import React from 'react';
import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { AnalyticsUpIcon, Home03Icon, SpoonAndForkIcon, UserSquareIcon, Calendar02Icon } from '@hugeicons/core-free-icons';

import Colors from './../../shared/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.PRIMARY,
      headerShown: false
    }}>
      <Tabs.Screen
        name='Home'
        options={{
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon = {Home03Icon}
              size = {size}
              color = {color}
              strokeWidth = {1.5}
            />
          ),
          tabBarLabel: 'Home'
        }}
      />
      <Tabs.Screen
        name='Log'
        options={{
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon = {Calendar02Icon}
              size = {size}
              color = {color}
              strokeWidth = {1.5}
            />
          ),
          tabBarLabel: 'Log'
        }}
      />
      <Tabs.Screen
        name='Meals'
        options={{
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon = {SpoonAndForkIcon}
              size = {size}
              color = {color}
              strokeWidth = {1.5}
            />
          ),
          tabBarLabel: 'Recipes'
        }}
      />
      <Tabs.Screen
        name='Progress'
        options={{
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon = {AnalyticsUpIcon}
              size = {size}
              color = {color}
              strokeWidth = {1.5}
            />
          ),
          tabBarLabel: 'Progress'
        }}
      />
      <Tabs.Screen
        name='Profile'
        options={{
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon = {UserSquareIcon}
              size = {size}
              color = {color}
              strokeWidth = {1.5}
            />
          ),
          tabBarLabel: 'Profile'
        }}
      />
    </Tabs>
  )
}