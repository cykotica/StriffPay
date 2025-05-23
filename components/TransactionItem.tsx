import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { Send, ArrowDownToLine } from 'lucide-react-native';

interface TransactionItemProps {
  type: 'send' | 'receive';
  amount: string;
  value: string;
  recipient?: string;
  sender?: string;
  date: string;
  onPress?: () => void;
}

export default function TransactionItem({
  type,
  amount,
  value,
  recipient,
  sender,
  date,
  onPress,
}: TransactionItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: type === 'send' ? colors.accent + '20' : colors.success + '20' }
        ]}
      >
        {type === 'send' ? (
          <Send size={20} color={colors.accent} />
        ) : (
          <ArrowDownToLine size={20} color={colors.success} />
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.type}>
          {type === 'send' ? 'Sent to ' : 'Received from '}
          <Text style={styles.name}>
            {type === 'send' ? recipient : sender}
          </Text>
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      
      <View style={styles.values}>
        <Text 
          style={[
            styles.amount,
            { color: type === 'send' ? colors.accent : colors.success }
          ]}
        >
          {type === 'send' ? '-' : '+'}{amount}
        </Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey,
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