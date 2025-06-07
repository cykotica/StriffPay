import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditCard, Lock, Shield, ChevronRight } from 'lucide-react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useDarkMode } from './more';
import { fetchCoinGeckoPrices } from '../../utils/marketData';

const mockCard = {
  cardNumber: '4111111111111111',
  cardHolderName: 'Michael Scott',
  expiryDate: '12/25',
  type: 'visa',
  balance: 1234.56, // fallback if price fetch fails
  symbol: 'USDC', // or the symbol for the card's asset
};

export default function CardScreen() {
  const insets = useSafeAreaInsets();
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(1234.56);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function loadPrice() {
      setLoading(true);
      setPriceError(null);
      try {
        // Replace 'USDC' with the real symbol if needed
        const prices = await fetchCoinGeckoPrices([mockCard.symbol]);
        if (prices[mockCard.symbol]) {
          setBalance(prices[mockCard.symbol]);
        }
      } catch (e) {
        setPriceError('Failed to fetch live card balance');
      }
      setLoading(false);
    }
    loadPrice();
  }, []);

  // Add accessibility announcements for loading states
  useEffect(() => {
    if (loading) {
      AccessibilityInfo.announceForAccessibility('Loading card balance');
    } else if (priceError) {
      AccessibilityInfo.announceForAccessibility('Failed to load card balance');
    }
  }, [loading, priceError]);

  const handleFreezeCard = () => {
    // Add freeze card logic
  };

  const mockCardData = {
    cardNumber: '4485 7197 5047 8025',
    cardHolderName: 'MICHAEL SCOTT',
    expiryDate: '09/25',
  };

  return (
    <View 
      style={[
        styles.container,
        darkMode && { backgroundColor: colors.dark.surface1 }
      ]}
      accessible={true}
      accessibilityLabel="Card screen"
    >
      <View 
        style={[
          styles.header,
          { paddingTop: insets.top + layout.spacing.md },
          darkMode && { 
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border,
            ...Platform.select({
              ios: {
                shadowColor: colors.dark.cardShadow,
                shadowOpacity: 0.3,
              },
              android: {
                elevation: 4,
              },
            }),
          }
        ]}
      >
        <Text 
          style={[
            styles.headerTitle, 
            darkMode && { color: colors.darkText }
          ]}
          accessible={true}
          accessibilityRole="header"
        >Card</Text>
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          darkMode && { backgroundColor: colors.dark.surface1 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card
          cardNumber={mockCardData.cardNumber}
          cardHolderName={mockCardData.cardHolderName}
          expiryDate={mockCardData.expiryDate}
          type="visa"
          variant={darkMode ? 'dark' : 'primary'}
          balance={balance}
          loading={loading}
        />
        {priceError && (
          <Text style={{ color: colors.error, textAlign: 'center', marginVertical: 8 }}>{priceError}</Text>
        )}

        <View 
          style={[
            styles.actionsContainer,
            darkMode && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border,
              ...Platform.select({
                ios: {
                  shadowColor: colors.dark.cardShadow,
                  shadowOpacity: 0.3,
                },
                android: {
                  elevation: 4,
                },
              }),
            }
          ]}
        >
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { borderBottomColor: darkMode ? colors.dark.border : colors.extraLightGrey }
            ]}
            onPress={handleFreezeCard}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Freeze card"
            accessibilityHint="Temporarily disable your card"
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.warning + '20' }]}>
              <Lock size={24} color={colors.warning} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[
                styles.actionTitle,
                darkMode && { color: colors.darkText }
              ]}>Freeze Card</Text>
              <Text style={[
                styles.actionDescription,
                darkMode && { color: colors.darkTextSecondary }
              ]}>Temporarily disable card</Text>
            </View>
            <ChevronRight size={20} color={darkMode ? colors.darkTextSecondary : colors.grey} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.actionButton,
              { borderBottomColor: darkMode ? colors.dark.border : colors.extraLightGrey }
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Security settings"
            accessibilityHint="Manage card security options"
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
              <Shield size={24} color={colors.success} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[
                styles.actionTitle,
                darkMode && { color: colors.darkText }
              ]}>Security Settings</Text>
              <Text style={[
                styles.actionDescription,
                darkMode && { color: colors.darkTextSecondary }
              ]}>Manage card security</Text>
            </View>
            <ChevronRight size={20} color={darkMode ? colors.darkTextSecondary : colors.grey} />
          </TouchableOpacity>
        </View>

        <View style={styles.limitsContainer}>
          <Text 
            style={[
              styles.sectionTitle,
              darkMode && { color: colors.darkText }
            ]}
            accessible={true}
            accessibilityRole="header"
          >Card Limits</Text>
          <View 
            style={[
              styles.limitCard,
              darkMode && { 
                backgroundColor: colors.dark.surface2,
                borderColor: colors.dark.border,
                ...Platform.select({
                  ios: {
                    shadowColor: colors.dark.cardShadow,
                    shadowOpacity: 0.3,
                  },
                  android: {
                    elevation: 4,
                  },
                }),
              }
            ]}
            accessible={true}
            accessibilityLabel="Daily payment limit information"
          >
            <View style={styles.limitItem}>
              <Text style={[
                styles.limitLabel,
                darkMode && { color: colors.darkText }
              ]}>Daily Payment Limit</Text>
              <Text style={[
                styles.limitValue,
                darkMode && { color: colors.dark.primaryAccent }
              ]}>$5,000</Text>
              <View style={[
                styles.limitBar,
                darkMode && { backgroundColor: colors.dark.surface3 }
              ]}>
                <View style={[
                  styles.limitProgress,
                  darkMode && { backgroundColor: colors.dark.primaryAccent },
                  { width: '45%' }
                ]} />
              </View>
              <Text style={[
                styles.limitRemaining,
                darkMode && { color: colors.darkTextSecondary }
              ]}>$2,750 remaining today</Text>
            </View>
          </View>
        </View>

        <View style={styles.recentTransactions}>
          <Text 
            style={[
              styles.sectionTitle,
              darkMode && { color: colors.darkText }
            ]}
            accessible={true}
            accessibilityRole="header"
          >Recent Transactions</Text>
          <View 
            style={[
              styles.transactionCard,
              darkMode && { 
                backgroundColor: colors.dark.surface2,
                borderColor: colors.dark.border,
                ...Platform.select({
                  ios: {
                    shadowColor: colors.dark.cardShadow,
                    shadowOpacity: 0.3,
                  },
                  android: {
                    elevation: 4,
                  },
                }),
              }
            ]}
          >
            <View style={styles.noTransactionsContainer}>
              <Text style={[
                styles.noTransactionsText,
                darkMode && { color: colors.darkTextSecondary }
              ]}>No recent transactions</Text>
              <Button
                title="Make First Payment"
                onPress={() => {}}
                style={styles.requestButton}
                variant="primary"
                darkMode={darkMode}
              />
            </View>
          </View>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
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
  noTransactionsContainer: {
    alignItems: 'center',
    padding: layout.spacing.xl,
  },
  noTransactionsText: {
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.textSecondary,
    marginBottom: layout.spacing.lg,
    textAlign: 'center',
  },
  requestButton: {
    marginTop: layout.spacing.lg,
  },
});