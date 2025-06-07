import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  Easing,
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
import { useDarkMode } from './more';
import { fetchCoinGeckoPrices } from '../../utils/marketData';
import TransactionItem from '@/components/TransactionItem';
import TokenCard from '@/components/TokenCard';

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
    balance: 0.45,
    change: '+5.2%',
    trending: 'up',
    color: colors.bitcoin,
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    amount: '3.25 ETH',
    balance: 3.25,
    change: '-1.8%',
    trending: 'down',
    color: colors.ethereum,
  },
  {
    id: '3',
    name: 'Tether',
    symbol: 'USDT',
    amount: '350 USDT',
    balance: 350,
    change: '+0.1%',
    trending: 'up',
    color: colors.tether,
  },
];

// Shimmer effect for balance
function Shimmer({ width, height, style }: { width: number; height: number; style?: any }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);
  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });
  return (
    <View style={[{ width, height, backgroundColor: '#222', overflow: 'hidden', borderRadius: 8 }, style]}>
      <Animated.View
        style={{
          width: width * 1.5,
          height,
          backgroundColor: '#444',
          opacity: 0.5,
          position: 'absolute',
          left: 0,
          top: 0,
          transform: [{ translateX }],
        }}
      />
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [balanceVisible, setBalanceVisible] = useState(true);
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

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

  // Animation values for sections
  const sectionAnim = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  React.useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(sectionAnim[0], { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.exp) }),
      Animated.timing(sectionAnim[1], { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.exp) }),
      Animated.timing(sectionAnim[2], { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.exp) }),
    ]).start();
  }, []);

  useEffect(() => {
    async function loadPrices() {
      setLoadingPrices(true);
      setPriceError(null);
      const symbols = cryptoAssets.map(a => a.symbol);
      try {
        const result = await fetchCoinGeckoPrices(symbols);
        setPrices(result);
      } catch (e) {
        setPriceError('Failed to load prices');
      }
      setLoadingPrices(false);
    }
    loadPrices();
  }, []);

  // Calculate total portfolio value
  const totalPortfolio = cryptoAssets.reduce((sum, asset) => {
    const price = prices[asset.symbol] ?? 0;
    return sum + asset.balance * price;
  }, 0);

  return (
    <View style={[styles.container, darkMode && { backgroundColor: '#121212' }]}> 
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.animatedHeader,
          { 
            opacity: headerOpacity,
            height: headerHeight,
            paddingTop: insets.top,
            backgroundColor: darkMode ? '#1a1a1a' : styles.animatedHeader.backgroundColor,
            borderBottomColor: darkMode ? '#222' : styles.animatedHeader.borderBottomColor,
          }
        ]}
      >
        <Text style={[styles.headerTitle, darkMode && { color: '#fff' }]}>Home</Text>
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
        <View style={[styles.header, darkMode && { backgroundColor: '#181818' }]}> {/* Add bg for header in dark mode */}
          <View>
            <Text style={[styles.greeting, darkMode && { color: '#fff' }]}>Hello, Investor</Text>
            <TouchableOpacity
              onPress={() => setBalanceVisible(!balanceVisible)}
              style={styles.balanceContainer}
              activeOpacity={0.7}
            >
              <Text style={[styles.balanceLabel, darkMode && { color: '#bbb' }]}>Total Balance</Text>
              {balanceVisible ? (
                <Animated.Text style={[styles.balanceAmount, darkMode && { color: colors.primary }, { opacity: balanceVisible ? 1 : 0.5 }]}> {/* keep accent color for balance */}
                  ${totalPortfolio.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Animated.Text>
              ) : (
                <Shimmer width={120} height={32} style={{ marginTop: 4, marginBottom: 4 }} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.iconButton, darkMode && { backgroundColor: '#232323' }]} activeOpacity={0.7}>
              <QrCode size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, darkMode && { backgroundColor: '#232323' }]} activeOpacity={0.7}>
              <Bell size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {[
            { label: 'Send', icon: <Send size={20} color={colors.white} />, color: colors.primary, route: '/(tabs)/send' },
            { label: 'Receive', icon: <ArrowDownToLine size={20} color={colors.white} />, color: colors.secondary, route: '/(tabs)/receive' },
            { label: 'Card', icon: <CreditCard size={20} color={colors.white} />, color: colors.success, route: '/(tabs)/card' },
            { label: 'Staking', icon: <PiggyBank size={20} color={colors.white} />, color: colors.accent, route: '/(stake)/staking' },
          ].map((btn, i) => (
            <Animated.View
              key={btn.label}
              style={{
                transform: [
                  {
                    scale: scrollY.interpolate({
                      inputRange: [0, 40],
                      outputRange: [1, 0.95],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(btn.route as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.actionButtonIcon, { backgroundColor: btn.color }]}> {btn.icon} </View>
                <Text style={[styles.actionButtonText, darkMode && { color: '#fff' }]}>{btn.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Portfolio Section */}
        <Animated.View
          style={{
            opacity: sectionAnim[0],
            transform: [{ translateY: sectionAnim[0].interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
          }}
        >
          <View style={[styles.sectionContainer, darkMode && { backgroundColor: '#181818', borderColor: '#232323' }]}> 
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, darkMode && { color: '#fff' }]}>Your Assets</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={[styles.seeAllText, darkMode && { color: colors.primary }]}>See All</Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {cryptoAssets.map(asset => (
              <TokenCard 
                key={asset.id}
                name={asset.name}
                symbol={asset.symbol}
                amount={asset.amount}
                value={asset.balance * (prices[asset.symbol] ?? 0)}
                loading={loadingPrices}
                change={asset.change}
                trending={asset.trending === 'up' ? 'up' : 'down'} // fix type
                color={asset.color}
                darkMode={darkMode}
              />
            ))}

            <TouchableOpacity style={styles.addAssetButton} onPress={() => router.push('/(deposit)/deposit')}>
              <Plus size={20} color={colors.primary} />
              <Text style={[styles.addAssetText, darkMode && { color: colors.primary }]}>Add New Asset</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Market Trends Section */}
        <Animated.View
          style={{
            opacity: sectionAnim[1],
            transform: [{ translateY: sectionAnim[1].interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
          }}
        >
          <View style={[styles.sectionContainer, darkMode && { backgroundColor: '#181818', borderColor: '#232323' }]}> 
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, darkMode && { color: '#fff' }]}>Market Trends</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={[styles.seeAllText, darkMode && { color: colors.primary }]}>See All</Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.marketTrendsContainer, darkMode && { borderColor: '#232323', backgroundColor: '#181818' }]}> {/* Add bg for market trends in dark mode */}
              <View style={styles.marketChart}>
                <BarChart4 size={150} color={colors.primary} strokeWidth={1} />
              </View>
              <View style={styles.marketStats}>
                <View style={styles.marketStatItem}>
                  <Text style={[styles.marketStatLabel, darkMode && { color: '#bbb' }]}>BTC/USD</Text>
                  <Text style={[styles.marketStatValue, darkMode && { color: '#fff' }]}>${(prices['BTC'] ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                  <Text style={[styles.marketStatChange, { color: colors.success }]}>+2.5%</Text>
                </View>
                <View style={styles.marketStatItem}>
                  <Text style={[styles.marketStatLabel, darkMode && { color: '#bbb' }]}>ETH/USD</Text>
                  <Text style={[styles.marketStatValue, darkMode && { color: '#fff' }]}>${(prices['ETH'] ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                  <Text style={[styles.marketStatChange, { color: colors.error }]}>-1.3%</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Recent Transactions Section */}
        <Animated.View
          style={{
            opacity: sectionAnim[2],
            transform: [{ translateY: sectionAnim[2].interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
          }}
        >
          <View style={[styles.sectionContainer, darkMode && { backgroundColor: '#181818', borderColor: '#232323' }]}> 
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, darkMode && { color: '#fff' }]}>Recent Transactions</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={[styles.seeAllText, darkMode && { color: colors.primary }]}>See All</Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {transactions.map(transaction => (
              <TransactionItem 
                key={transaction.id}
                type={transaction.type === 'send' ? 'send' : 'receive'}
                amount={transaction.amount}
                value={(() => {
                  // Parse amount and symbol for live price
                  const match = transaction.amount.match(/([\d.]+)\s*(\w+)/);
                  if (!match) return 0;
                  const [, amt, sym] = match;
                  return parseFloat(amt) * (prices[sym] ?? 0);
                })()}
                loading={loadingPrices}
                recipient={transaction.type === 'send' ? transaction.to : transaction.from || ''}
                sender={transaction.type === 'receive' ? transaction.from : undefined}
                date={transaction.date}
                darkMode={darkMode}
              />
            ))}
          </View>
        </Animated.View>
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