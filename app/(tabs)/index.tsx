import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Bell, 
  QrCode, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  ChartBar as BarChart4, 
  Plus,
  Send,
  ArrowDownToLine,
  CreditCard,
  PiggyBank
} from 'lucide-react-native';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';

// Mock data
const transactions = [
  { 
    id: '1', 
    type: 'send', 
    amount: '0.025 BTC', 
    value: '$1,125.00',
    to: 'John Smith',
    date: '2 hours ago',
  },
  { 
    id: '2', 
    type: 'receive', 
    amount: '150 USDT', 
    value: '$150.00',
    from: 'Sarah Johnson',
    date: 'Yesterday',
  },
  { 
    id: '3', 
    type: 'send', 
    amount: '0.5 ETH', 
    value: '$1,025.50',
    to: 'Coffee Shop',
    date: '2 days ago',
  },
];

const cryptoAssets = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    amount: '0.45 BTC',
    value: '$20,250.00',
    change: '+5.2%',
    trending: 'up',
    color: colors.bitcoin,
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    amount: '3.25 ETH',
    value: '$6,647.50',
    change: '-1.8%',
    trending: 'down',
    color: colors.ethereum,
  },
  {
    id: '3',
    name: 'Tether',
    symbol: 'USDT',
    amount: '350 USDT',
    value: '$350.00',
    change: '+0.1%',
    trending: 'up',
    color: colors.tether,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [balanceVisible, setBalanceVisible] = useState(true);
  const router = useRouter();

  // Header animations
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 60],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.animatedHeader,
          { 
            opacity: headerOpacity,
            height: headerHeight,
            paddingTop: insets.top,
          }
        ]}
      >
        <Text style={styles.headerTitle}>Home</Text>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + layout.spacing.lg }
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Investor</Text>
            <TouchableOpacity
              onPress={() => setBalanceVisible(!balanceVisible)}
              style={styles.balanceContainer}
            >
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>
                {balanceVisible ? '$27,247.50' : '******'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <QrCode size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/send')}>
            <View style={[styles.actionButtonIcon, { backgroundColor: colors.primary }]}> 
              <Send size={20} color={colors.white} />
            </View>
            <Text style={styles.actionButtonText}>Send</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/receive')}>
            <View style={[styles.actionButtonIcon, { backgroundColor: colors.secondary }]}> 
              <ArrowDownToLine size={20} color={colors.white} />
            </View>
            <Text style={styles.actionButtonText}>Receive</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/card')}>
            <View style={[styles.actionButtonIcon, { backgroundColor: colors.success }]}> 
              <CreditCard size={20} color={colors.white} />
            </View>
            <Text style={styles.actionButtonText}>Card</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('staking' as any)}>
            <View style={[styles.actionButtonIcon, { backgroundColor: colors.accent }]}> 
              <PiggyBank size={20} color={colors.white} />
            </View>
            <Text style={styles.actionButtonText}>Staking</Text>
          </TouchableOpacity>
        </View>

        {/* Portfolio Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Assets</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {cryptoAssets.map(asset => (
            <TouchableOpacity key={asset.id} style={styles.assetCard}>
              <View style={[styles.assetIconContainer, { backgroundColor: asset.color + '20' }]}>
                <Text style={[styles.assetIcon, { color: asset.color }]}>{asset.symbol.charAt(0)}</Text>
              </View>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Text style={styles.assetAmount}>{asset.amount}</Text>
              </View>
              <View style={styles.assetValues}>
                <Text style={styles.assetValue}>{asset.value}</Text>
                <View style={styles.assetChangeContainer}>
                  {asset.trending === 'up' ? (
                    <TrendingUp size={14} color={colors.success} />
                  ) : (
                    <TrendingDown size={14} color={colors.error} />
                  )}
                  <Text 
                    style={[
                      styles.assetChange,
                      { color: asset.trending === 'up' ? colors.success : colors.error }
                    ]}
                  >
                    {asset.change}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addAssetButton}>
            <Plus size={20} color={colors.primary} />
            <Text style={styles.addAssetText}>Add New Asset</Text>
          </TouchableOpacity>
        </View>

        {/* Market Trends Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Market Trends</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.marketTrendsContainer}>
            <View style={styles.marketChart}>
              <BarChart4 size={150} color={colors.primary} strokeWidth={1} />
            </View>
            <View style={styles.marketStats}>
              <View style={styles.marketStatItem}>
                <Text style={styles.marketStatLabel}>BTC/USD</Text>
                <Text style={styles.marketStatValue}>$45,000</Text>
                <Text style={[styles.marketStatChange, { color: colors.success }]}>+2.5%</Text>
              </View>
              <View style={styles.marketStatItem}>
                <Text style={styles.marketStatLabel}>ETH/USD</Text>
                <Text style={styles.marketStatValue}>$2,045</Text>
                <Text style={[styles.marketStatChange, { color: colors.error }]}>-1.3%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {transactions.map(transaction => (
            <TouchableOpacity key={transaction.id} style={styles.transactionCard}>
              <View 
                style={[
                  styles.transactionIconContainer, 
                  { backgroundColor: transaction.type === 'send' ? colors.accent + '20' : colors.success + '20' }
                ]}
              >
                {transaction.type === 'send' ? (
                  <Send size={20} color={colors.accent} />
                ) : (
                  <ArrowDownToLine size={20} color={colors.success} />
                )}
              </View>
              
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>
                  {transaction.type === 'send' ? 'Sent to ' : 'Received from '}
                  <Text style={styles.transactionName}>
                    {transaction.type === 'send' ? transaction.to : transaction.from}
                  </Text>
                </Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              
              <View style={styles.transactionValues}>
                <Text 
                  style={[
                    styles.transactionAmount,
                    { color: transaction.type === 'send' ? colors.accent : colors.success }
                  ]}
                >
                  {transaction.type === 'send' ? '-' : '+'}{transaction.amount}
                </Text>
                <Text style={styles.transactionValue}>{transaction.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.extraLightGrey,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    zIndex: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    ...layout.shadow.sm,
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.lg,
    color: colors.text,
  },
  scrollContent: {
    paddingBottom: layout.spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: layout.spacing.xl,
    paddingBottom: layout.spacing.xl,
  },
  greeting: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.xl,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  balanceContainer: {
    flexDirection: 'column',
  },
  balanceLabel: {
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xxs,
  },
  balanceAmount: {
    fontFamily: fonts.bold,
    fontSize: fonts.xxxl,
    color: colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: layout.spacing.sm,
    ...layout.shadow.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.spacing.xl,
    marginVertical: layout.spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.xs,
    ...layout.shadow.sm,
  },
  actionButtonText: {
    fontFamily: fonts.medium,
    fontSize: fonts.sm,
    color: colors.text,
  },
  sectionContainer: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    marginHorizontal: layout.spacing.xl,
    marginTop: layout.spacing.xl,
    padding: layout.spacing.lg,
    ...layout.shadow.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.lg,
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: fonts.medium,
    fontSize: fonts.sm,
    color: colors.primary,
    marginRight: layout.spacing.xxs,
  },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey,
  },
  assetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  assetIcon: {
    fontFamily: fonts.bold,
    fontSize: fonts.xl,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.xxs,
  },
  assetAmount: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  assetValues: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.xxs,
  },
  assetChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetChange: {
    fontFamily: fonts.medium,
    fontSize: fonts.sm,
    marginLeft: layout.spacing.xxs,
  },
  addAssetButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
    marginTop: layout.spacing.sm,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: layout.radius.md,
    borderStyle: 'dashed',
  },
  addAssetText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.primary,
    marginLeft: layout.spacing.xs,
  },
  marketTrendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: layout.radius.md,
    padding: layout.spacing.md,
  },
  marketChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketStats: {
    flex: 1,
    marginLeft: layout.spacing.md,
  },
  marketStatItem: {
    marginBottom: layout.spacing.md,
  },
  marketStatLabel: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xxs,
  },
  marketStatValue: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.lg,
    color: colors.text,
    marginBottom: layout.spacing.xxs,
  },
  marketStatChange: {
    fontFamily: fonts.medium,
    fontSize: fonts.sm,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.xxs,
  },
  transactionName: {
    fontFamily: fonts.semiBold,
  },
  transactionDate: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  transactionValues: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.md,
    marginBottom: layout.spacing.xxs,
  },
  transactionValue: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
});