import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RUNABLE_THEME } from '@/src/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: RUNABLE_THEME.colors.campusGreen,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#CBD5E1' : RUNABLE_THEME.colors.ink,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 86 : 72,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          backgroundColor:
            colorScheme === 'dark'
              ? RUNABLE_THEME.colors.panelBlack
              : RUNABLE_THEME.colors.paper,
          borderTopWidth: 2,
          borderTopColor: RUNABLE_THEME.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="clan"
        options={{
          title: 'Clan',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.3.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="resolved"
        options={{
          title: 'Resolved',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="checkmark.seal.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Development Log',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="book.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
