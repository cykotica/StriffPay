import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditCard, Lock, Shield, ChevronRight } from 'lucide-react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';

const mockCard = {
  cardNumber: '4111111111111111',
  cardHolderName: 'Michael Scott',
  expiryDate: '12/25',
  type: 'visa',
  balance: '$1,234.56',
};

export default function CardScreen() {
  const insets = useSafeAreaInsets();
  const [isCardFrozen, setIsCardFrozen] = useState(false);

  const handleFreezeCard = () => {
    setIsCardFrozen(!isCardFrozen);
    Alert.alert(
      isCardFrozen ? 'Card Unfrozen' : 'Card Frozen',
      isCardFrozen ? 'Your card has been unfrozen and is ready to use.' : 'Your card has been frozen for security.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.header,
        { paddingTop: insets.top + layout.spacing.md }
      ]}>
        <Text style={styles.headerTitle}>Card</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card
          cardNumber={mockCard.cardNumber}
          cardHolderName={mockCard.cardHolderName}
          expiryDate={mockCard.expiryDate}
          type="visa"
          balance={mockCard.balance}
        />

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleFreezeCard}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.warning + '20' }]}>
              <Lock size={24} color={colors.warning} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>
                {isCardFrozen ? 'Unfreeze Card' : 'Freeze Card'}
              </Text>
              <Text style={styles.actionDescription}>
                {isCardFrozen ? 'Enable card for payments' : 'Temporarily disable card'}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.grey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
              <CreditCard size={24} color={colors.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Card Details</Text>
              <Text style={styles.actionDescription}>View card information</Text>
            </View>
            <ChevronRight size={20} color={colors.grey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
              <Shield size={24} color={colors.success} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Security Settings</Text>
              <Text style={styles.actionDescription}>Manage card security</Text>
            </View>
            <ChevronRight size={20} color={colors.grey} />
          </TouchableOpacity>
        </View>

        <View style={styles.limitsContainer}>
          <Text style={styles.sectionTitle}>Card Limits</Text>
          <View style={styles.limitCard}>
            <View style={styles.limitItem}>
              <Text style={styles.limitLabel}>Daily Payment Limit</Text>
              <Text style={styles.limitValue}>$5,000</Text>
              <View style={styles.limitBar}>
                <View style={[styles.limitProgress, { width: '45%' }]} />
              </View>
              <Text style={styles.limitRemaining}>$2,750 remaining today</Text>
            </View>

            <View style={styles.limitItem}>
              <Text style={styles.limitLabel}>ATM Withdrawal Limit</Text>
              <Text style={styles.limitValue}>$1,000</Text>
              <View style={styles.limitBar}>
                <View style={[styles.limitProgress, { width: '20%' }]} />
              </View>
              <Text style={styles.limitRemaining}>$800 remaining today</Text>
            </View>
          </View>
        </View>

        <View style={styles.recentTransactions}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.transactionCard}>
            <Text style={styles.emptyTransactions}>No recent card transactions</Text>
          </View>
        </View>

        <Button
          title="Request New Card"
          onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
          style={styles.requestButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.extraLightGrey,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.xl,
    paddingBottom: layout.spacing.md,
    backgroundColor: colors.white,
    ...layout.shadow.sm,
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.xl,
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: layout.spacing.xl,
    paddingVertical: layout.spacing.xl,
    paddingBottom: layout.spacing.xxxl,
  },
  actionsContainer: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    marginVertical: layout.spacing.xl,
    ...layout.shadow.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.xxs,
  },
  actionDescription: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  limitsContainer: {
    marginBottom: layout.spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.lg,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  limitCard: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.lg,
    ...layout.shadow.sm,
  },
  limitItem: {
    marginBottom: layout.spacing.lg,
  },
  limitLabel: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  limitValue: {
    fontFamily: fonts.bold,
    fontSize: fonts.xl,
    color: colors.primary,
    marginBottom: layout.spacing.sm,
  },
  limitBar: {
    height: 8,
    backgroundColor: colors.extraLightGrey,
    borderRadius: layout.radius.sm,
    marginBottom: layout.spacing.xs,
  },
  limitProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: layout.radius.sm,
  },
  limitRemaining: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  recentTransactions: {
    marginBottom: layout.spacing.xl,
  },
  transactionCard: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.xl,
    ...layout.shadow.sm,
  },
  emptyTransactions: {
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  requestButton: {
    marginTop: layout.spacing.lg,
  },
});