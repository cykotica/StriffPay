import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';

export default function StakedDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staked Asset Detail</Text>
      <Text style={styles.text}>Staked Asset ID: {id}</Text>
      {/* Add more staked asset detail UI here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.extraLightGrey,
    padding: layout.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: layout.spacing.lg,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
});
