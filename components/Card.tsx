import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

interface CardProps {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  type: 'visa' | 'mastercard' | 'amex';
  variant?: 'primary' | 'secondary' | 'dark';
  balance?: string;
  onPress?: () => void;
}

export default function Card({
  cardNumber,
  cardHolderName,
  expiryDate,
  type,
  variant = 'primary',
  balance,
  onPress,
}: CardProps) {
  // Function to format card number with spaces
  const formatCardNumber = (num: string): string => {
    // Mask the card number except last 4 digits
    const lastFour = num.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  // Get gradient colors based on card variant
  const getGradientColors = (): string[] => {
    switch (variant) {
      case 'primary':
        return [colors.primary, colors.primaryDark];
      case 'secondary':
        return [colors.secondary, colors.secondaryDark];
      case 'dark':
        return ['#1A1A1A', '#000000'];
      default:
        return [colors.primary, colors.primaryDark];
    }
  };

  // Get card logo based on type
  const getCardTypeLogo = (): string => {
    switch (type) {
      case 'visa':
        return 'VISA';
      case 'mastercard':
        return 'MASTERCARD';
      case 'amex':
        return 'AMEX';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.container}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={styles.chip} />
          <Text style={styles.cardType}>{getCardTypeLogo()}</Text>
        </View>

        <Text style={styles.cardNumber}>{formatCardNumber(cardNumber)}</Text>

        <View style={styles.cardDetails}>
          <View>
            <Text style={styles.cardDetailLabel}>CARD HOLDER</Text>
            <Text style={styles.cardDetailValue}>{cardHolderName}</Text>
          </View>
          <View>
            <Text style={styles.cardDetailLabel}>EXPIRES</Text>
            <Text style={styles.cardDetailValue}>{expiryDate}</Text>
          </View>
        </View>

        {balance && (
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>BALANCE</Text>
            <Text style={styles.balanceValue}>{balance}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: layout.radius.lg,
    ...layout.shadow.lg,
    marginVertical: layout.spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.lg,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: '#E6C06A',
    borderRadius: 6,
  },
  cardType: {
    fontFamily: fonts.bold,
    fontSize: fonts.md,
    color: colors.white,
  },
  cardNumber: {
    fontFamily: fonts.regular,
    fontSize: fonts.xl,
    color: colors.white,
    letterSpacing: 2,
    marginVertical: layout.spacing.md,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetailLabel: {
    fontFamily: fonts.regular,
    fontSize: fonts.xs,
    color: colors.white,
    opacity: 0.8,
    marginBottom: layout.spacing.xxs,
  },
  cardDetailValue: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.white,
  },
  balanceContainer: {
    position: 'absolute',
    top: layout.spacing.lg,
    right: layout.spacing.lg,
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontFamily: fonts.regular,
    fontSize: fonts.xs,
    color: colors.white,
    opacity: 0.8,
  },
  balanceValue: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.lg,
    color: colors.white,
  },
});