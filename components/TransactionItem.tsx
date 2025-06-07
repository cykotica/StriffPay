import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { Send, ArrowDownToLine } from 'lucide-react-native';

interface TransactionItemProps {
  type: 'send' | 'receive';
  amount: string;
  value: number;
  loading?: boolean;
  recipient?: string;
  sender?: string;
  date: string;
  onPress?: () => void;
  darkMode?: boolean;
}

export default function TransactionItem({
  type,
  amount,
  value,
  loading = false,
  recipient,
  sender,
  date,
  onPress,
  darkMode = false,
}: TransactionItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        darkMode && {
          backgroundColor: colors.dark.surface2,
          borderBottomColor: colors.dark.border
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View 
        style={[
          styles.iconContainer, 
          { 
            backgroundColor: type === 'send' 
              ? (darkMode ? colors.accent + '15' : colors.accent + '20')
              : (darkMode ? colors.success + '15' : colors.success + '20')
          }
        ]}
      >
        {type === 'send' ? (
          <Send size={20} color={darkMode ? colors.accentLight : colors.accent} />
        ) : (
          <ArrowDownToLine size={20} color={darkMode ? colors.successLight : colors.success} />
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={[styles.type, darkMode && { color: colors.darkText }]}>
          {type === 'send' ? 'Sent to ' : 'Received from '}
          <Text style={[styles.name, darkMode && { color: colors.darkText }]}>
            {type === 'send' ? recipient : sender}
          </Text>
        </Text>
        <Text style={[styles.date, darkMode && { color: colors.darkTextSecondary }]}>{date}</Text>
      </View>

      <View style={styles.values}>
        <Text style={[
          styles.amount,
          {
            color: type === 'send' 
              ? (darkMode ? colors.errorLight : colors.error)
              : (darkMode ? colors.successLight : colors.success)
          }
        ]}>
          {type === 'send' ? '-' : '+'}{amount}
        </Text>
        {loading ? (
          <View style={{ 
            height: 16, 
            width: 60, 
            backgroundColor: darkMode ? colors.dark.placeholder : '#eee',
            borderRadius: 4 
          }} />
        ) : (
          <Text style={[styles.value, darkMode && { color: colors.darkTextSecondary }]}>
            ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  info: {
    flex: 1,
  },
  type: {
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.xxs,
  },
  name: {
    fontFamily: fonts.semiBold,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  values: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.md,
    marginBottom: layout.spacing.xxs,
  },
  value: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
});