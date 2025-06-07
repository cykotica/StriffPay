import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { TrendingDown, TrendingUp } from 'lucide-react-native';

interface TokenCardProps {
  name: string;
  symbol: string;
  amount: string;
  value: number; // now expects a number (USD value)
  loading?: boolean; // show loading state for value
  change: string;
  trending: 'up' | 'down';
  color: string;
  onPress?: () => void;
  darkMode?: boolean;
}

export default function TokenCard({
  name,
  symbol,
  amount,
  value,
  loading = false,
  change,
  trending,
  color,
  onPress,
  darkMode = false,
}: TokenCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        darkMode && {
          backgroundColor: colors.dark.surface2,
          borderColor: colors.dark.border
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.tokenInfo}>
          <View style={[styles.tokenIcon, { backgroundColor: color + '20' }]}>
            <Text style={[styles.tokenSymbolText, { color }]}>{symbol.charAt(0)}</Text>
          </View>
          <View>
            <Text style={[styles.tokenName, darkMode && { color: colors.darkText }]}>{name}</Text>
            <Text style={[styles.tokenSymbol, darkMode && { color: colors.darkTextSecondary }]}>{symbol}</Text>
          </View>
        </View>
        <View style={styles.changeContainer}>
          <View style={styles.trendingContainer}>
            {trending === 'up' ? (
              <TrendingUp size={14} color={colors.success} />
            ) : (
              <TrendingDown size={14} color={colors.error} />
            )}
          </View>
          <Text style={[
            styles.changeText,
            { color: trending === 'up' ? colors.success : colors.error }
          ]}>{change}</Text>
        </View>
      </View>

      <View style={[styles.footer, darkMode && { borderTopColor: colors.dark.border }]}>
        <View>
          <Text style={[styles.detailLabel, darkMode && { color: colors.darkTextSecondary }]}>Amount</Text>
          <Text style={[styles.detailValue, darkMode && { color: colors.darkText }]}>{amount}</Text>
        </View>
        <View>
          <Text style={[styles.detailLabel, darkMode && { color: colors.darkTextSecondary }]}>Value USD</Text>
          {loading ? (
            <View style={{ 
              height: 20, 
              width: 80, 
              backgroundColor: darkMode ? colors.dark.placeholder : '#eee', 
              borderRadius: 4 
            }} />
          ) : (
            <Text style={[styles.detailValue, darkMode && { color: colors.darkText }]}>
              ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    marginBottom: layout.spacing.sm,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  tokenSymbolText: {
    fontFamily: fonts.bold,
    fontSize: fonts.lg,
  },
  tokenName: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.md,
    color: colors.text,
  },
  tokenSymbol: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  changeContainer: {
    alignItems: 'flex-end',
  },
  trendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontFamily: fonts.medium,
    fontSize: fonts.sm,
    marginLeft: layout.spacing.xxs,
  },
  footer: {
    paddingTop: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.extraLightGrey,
  },
  detailLabel: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xxs,
  },
  detailValue: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.md,
    color: colors.text,
  },
});