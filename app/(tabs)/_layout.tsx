import * as React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { Home as HomeIcon, Wallet, Send, ArrowDownToLine, CreditCard, MoreHorizontal } from 'lucide-react-native';
import { DarkModeContext } from './more';

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const { darkMode } = React.useContext(DarkModeContext);
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: darkMode ? colors.dark.surface1 : colors.white 
    }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: darkMode ? colors.dark.primaryAccent : colors.primary,
          tabBarInactiveTintColor: darkMode ? colors.darkTextSecondary : colors.grey,
          tabBarLabelStyle: {
            fontFamily: fonts.medium,
            fontSize: 12,
            marginBottom: 4,
          },
          tabBarStyle: {
            backgroundColor: darkMode ? colors.dark.surface2 : colors.white,
            borderTopColor: darkMode ? colors.dark.border : colors.lightGrey,
            borderTopWidth: 1,
            shadowColor: darkMode ? colors.dark.cardShadow : colors.black,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: darkMode ? 0.3 : 0.1,
            shadowRadius: 4,
            elevation: 8,
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <HomeIcon size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            tabBarIcon: ({ color, size }) => (
              <Wallet size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="send"
          options={{
            title: 'Send',
            tabBarIcon: ({ color, size }) => (
              <Send size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="receive"
          options={{
            title: 'Receive',
            tabBarIcon: ({ color, size }) => (
              <ArrowDownToLine size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="card"
          options={{
            title: 'Card',
            tabBarIcon: ({ color, size }) => (
              <CreditCard size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color, size }) => (
              <MoreHorizontal size={22} color={color} />
            ),
          }}
        />
      </Tabs>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});