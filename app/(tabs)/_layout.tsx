import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { Chrome as Home, Wallet, Send, ArrowDownToLine, CreditCard } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarStyle: {
          ...styles.tabBar,
        },
        tabBarItemStyle: {
          height: 50,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={22} color={color} />
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
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});