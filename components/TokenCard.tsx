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
  value: string;
  change: string;
  trending: 'up' | 'down';
  color: string;
  onPress?: () => void;
}

export default function TokenCard({
  name,
  symbol,
  amount,
  value,
  change,
  trending,
  color,
  onPress,
}: TokenCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.tokenInfo}>
          <View style={[styles.tokenIcon, { backgroundColor: color + '20' }]}>
            <Text style={[styles.tokenSymbolText, { color }]}>{symbol.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.tokenName}>{name}</Text>
            <Text style={styles.tokenSymbol}>{symbol}</Text>
          </View>
        </View>
        <View style={styles.changeContainer}>
          <View style={styles.trendingContainer}>
            {trending === 'up' ? (
              <TrendingUp size={14} color={colors.success} />
            ) : (
              <TrendingDown size={14} color={colors.error} />
            )}
            <Text
              style={[
                styles.tokenChange,
                {
                  color: trending === 'up' ? colors.success : colors.error,
                },
              ]}
            >
              {change}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.details}>
        <View>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>{amount}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.detailLabel}>Value</Text>
          <Text style={styles.detailValue}>{value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.lg,
    marginBottom: layout.spacing.md,
    ...layout.shadow.sm,
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
  tokenChange: {
    fontFamily: fonts.medium,
    fontSize: fonts.sm,
    marginLeft: layout.spacing.xxs,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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