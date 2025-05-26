import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';

export default function StakingDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staking Detail</Text>
      <Text style={styles.text}>Staking Option ID: {id}</Text>
      {/* Add more staking detail UI here */}
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
