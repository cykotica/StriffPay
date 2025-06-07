import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, ChevronDown, Plus, Search, Filter, Clock } from 'lucide-react-native';
import Button from '@/components/Button';
import { useDarkMode } from './more';
import { useRouter } from 'expo-router';
import { fetchCoinGeckoPrices } from '../../utils/marketData';
import TokenCard from '@/components/TokenCard';
import TransactionItem from '@/components/TransactionItem';

// Mock data for coins (remove hardcoded USD values)
const coins = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    amount: '0.45 BTC',
    balance: 0.45,
    change: '+5.2%',
    trending: 'up',
    color: colors.bitcoin,
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
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
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
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
    image: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
  {
    id: '4',
    name: 'Litecoin',
    symbol: 'LTC',
    amount: '2.5 LTC',
    balance: 2.5,
    change: '+2.3%',
    trending: 'up',
    color: colors.litecoin,
    image: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
  },
  {
    id: '5',
    name: 'Ripple',
    symbol: 'XRP',
    amount: '500 XRP',
    balance: 500,
    change: '-0.8%',
    trending: 'down',
    color: colors.ripple,
    image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
  },
];

// Tabs
const tabs = [
  { id: 'assets', name: 'Assets' },
  { id: 'transactions', name: 'Transactions' },
  { id: 'rewards', name: 'Rewards' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;
const isMediumScreen = SCREEN_WIDTH < 430;

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('assets');
  const [sortOption, setSortOption] = useState('value');
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrices() {
      setLoadingPrices(true);
      setPriceError(null);
      const symbols = coins.map(c => c.symbol);
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

  // Calculate total balance
  const totalBalance = coins.reduce((sum, coin) => {
    const price = prices[coin.symbol] ?? 0;
    return sum + coin.balance * price;
  }, 0);

  return (
    <View style={[
      styles.container,
      darkMode && { backgroundColor: colors.dark.surface1 }
    ]}>
      {/* Header */}
      <View style={[
        styles.header,
        { paddingTop: insets.top + layout.spacing.md },
        darkMode && { 
          backgroundColor: colors.dark.surface2,
          borderBottomColor: colors.dark.border,
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
      ]}>
        <Text style={[
          styles.headerTitle,
          darkMode && { color: colors.darkText }
        ]}>Wallet</Text>
        <TouchableOpacity style={[
          styles.filterButton,
          darkMode && { backgroundColor: colors.dark.surface3 }
        ]}>
          <Filter size={20} color={darkMode ? colors.darkText : colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          darkMode && { backgroundColor: colors.dark.surface1 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View style={[
          styles.balanceCard,
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
        ]}>
          <View style={styles.balanceHeaderContainer}>
            <Text style={[
              styles.balanceHeader,
              darkMode && { color: colors.darkText }
            ]}>Total Balance</Text>
          </View>
          <Text style={[
            styles.balanceValue,
            darkMode && { color: colors.darkText }
          ]}>$2,458.00</Text>
          <View style={styles.balanceActions}>
            <Button 
              title="Send" 
              variant="primary" 
              size="small"
              style={styles.balanceButton}
              darkMode={darkMode}
              onPress={() => router.push('/(tabs)/send')}
            />
            <Button 
              title="Receive" 
              variant="primary" 
              size="small"
              style={styles.balanceButton}
              darkMode={darkMode}
              onPress={() => router.push('/(tabs)/receive')}
            />
            <Button 
              title="Convert" 
              variant="primary" 
              size="small"
              style={styles.balanceButton}
              darkMode={darkMode}
              onPress={() => router.push('/(deposit)/convert')}
            />
          </View>
        </View>

        {/* Tabs */}
        <View style={[
          styles.tabsContainer,
          darkMode && { 
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border,
          }
        ]}>
          <TouchableOpacity 
            style={[
              styles.tab,
              selectedTab === 'assets' && styles.activeTab,
              darkMode && selectedTab === 'assets' && { backgroundColor: colors.dark.primaryAccent }
            ]}
            onPress={() => setSelectedTab('assets')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'assets' && styles.activeTabText,
              darkMode && { color: selectedTab === 'assets' ? colors.white : colors.darkTextSecondary }
            ]}>Assets</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab,
              selectedTab === 'transactions' && styles.activeTab,
              darkMode && selectedTab === 'transactions' && { backgroundColor: colors.dark.primaryAccent }
            ]}
            onPress={() => setSelectedTab('transactions')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'transactions' && styles.activeTabText,
              darkMode && { color: selectedTab === 'transactions' ? colors.white : colors.darkTextSecondary }
            ]}>Transactions</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Sort */}
        <View style={styles.searchSortContainer}>
          <View style={[
            styles.searchContainer,
            darkMode && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border,
            }
          ]}>
            <Search size={18} color={darkMode ? colors.darkTextSecondary : colors.grey} style={styles.searchIcon} />
            <Text style={[
              styles.searchPlaceholder,
              darkMode && { color: colors.darkTextSecondary }
            ]}>Search coins</Text>
          </View>
          <TouchableOpacity style={[
            styles.sortContainer,
            darkMode && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border 
            }
          ]}>
            <Text style={[
              styles.sortText,
              darkMode && { color: colors.dark.primaryAccent }
            ]}>Sort by: {sortOption}</Text>
            <ChevronDown size={16} color={darkMode ? colors.dark.primaryAccent : colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Coins List */}
        {selectedTab === 'assets' && (
          <View style={styles.coinsContainer}>
            {coins.map((coin) => (
              <TokenCard
                key={coin.id}
                name={coin.name}
                symbol={coin.symbol}
                amount={coin.amount}
                value={coin.balance * (prices[coin.symbol] ?? 0)}
                loading={loadingPrices}
                change={coin.change}
                trending={coin.trending === 'up' ? 'up' : 'down'}
                color={coin.color}
                darkMode={darkMode}
                onPress={() => {}}
              />
            ))}
            <TouchableOpacity style={[
              styles.addCoinButton,
              darkMode && { 
                backgroundColor: colors.dark.surface2,
                borderColor: colors.dark.border 
              }
            ]} onPress={() => router.push('/(deposit)/deposit')}>
              <Plus size={20} color={darkMode ? colors.dark.primaryAccent : colors.primary} />
              <Text style={[
                styles.addCoinText,
                darkMode && { color: colors.dark.primaryAccent }
              ]}>Add New Coin</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedTab === 'transactions' && (
          <View style={styles.transactionsContainer}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.transactionsTitle}>Recent Transactions</Text>
              <TouchableOpacity style={styles.transactionsFilterContainer}>
                <Clock size={16} color={colors.primary} />
                <Text style={styles.transactionsFilter}>Past 7 days</Text>
                <ChevronDown size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {/* Example: Replace with real transaction data and live price */}
            {/* <TransactionItem
              type="send"
              amount="0.1 BTC"
              value={0.1 * (prices['BTC'] ?? 0)}
              loading={loadingPrices}
              recipient="John Doe"
              date="2025-06-01"
            /> */}
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
              <Text style={styles.emptyTransactionsSubtext}>
                Your transaction history will appear here
              </Text>
            </View>
          </View>
        )}

        {selectedTab === 'rewards' && (
          <View style={styles.rewardsContainer}>
            <View style={styles.rewardCard}>
              <View style={styles.rewardHeader}>
                <Text style={styles.rewardTitle}>Staking Rewards</Text>
                <TouchableOpacity style={styles.rewardAction}>
                  <Text style={styles.rewardActionText}>Claim All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardAmount}>$24.50</Text>
                <Text style={styles.rewardDescription}>Total rewards available</Text>
              </View>
              <Button
                title="Stake More"
                onPress={() => {}}
                style={{ marginTop: layout.spacing.md }}
              />
            </View>
            <View style={styles.rewardRateContainer}>
              <Text style={styles.rewardRateTitle}>Current Rates</Text>
              <View style={styles.rewardRateCard}>
                <View style={styles.rewardRateItem}>
                  <Text style={styles.rewardRateCoin}>Bitcoin (BTC)</Text>
                  <Text style={styles.rewardRateValue}>4.5% APY</Text>
                </View>
                <View style={styles.rewardRateItem}>
                  <Text style={styles.rewardRateCoin}>Ethereum (ETH)</Text>
                  <Text style={styles.rewardRateValue}>5.2% APY</Text>
                </View>
                <View style={styles.rewardRateItem}>
                  <Text style={styles.rewardRateCoin}>Tether (USDT)</Text>
                  <Text style={styles.rewardRateValue}>8.0% APY</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {priceError && <Text style={{ color: 'red', textAlign: 'center' }}>{priceError}</Text>}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? layout.spacing.lg : layout.spacing.xl,
    paddingBottom: isSmallScreen ? layout.spacing.sm : layout.spacing.md,
    backgroundColor: colors.white,
    ...layout.shadow.sm,
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? fonts.lg : fonts.xl,
    color: colors.text,
  },
  filterButton: {
    width: isSmallScreen ? 32 : 40,
    height: isSmallScreen ? 32 : 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.extraLightGrey,
  },
  scrollContent: {
    paddingBottom: isSmallScreen ? layout.spacing.xl : layout.spacing.xxxl,
  },
  balanceCard: {
    margin: isSmallScreen ? layout.spacing.lg : layout.spacing.xl,
    padding: isSmallScreen ? layout.spacing.lg : layout.spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: layout.radius.lg,
    ...layout.shadow.md,
  },
  balanceHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceHeader: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.white,
    opacity: 0.9,
    marginRight: layout.spacing.xs,
  },
  balanceValue: {
    fontFamily: fonts.bold,
    fontSize: isSmallScreen ? fonts.xxl : fonts.display,
    color: colors.white,
    marginTop: layout.spacing.sm,
    marginBottom: layout.spacing.xs,
  },
  balanceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallScreen ? layout.spacing.md : layout.spacing.lg,
  },
  balanceChange: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.success,
    marginLeft: layout.spacing.xs,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceButton: {
    flex: 1,
    marginHorizontal: layout.spacing.xs,
    minWidth: isSmallScreen ? 80 : 100,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: isSmallScreen ? layout.spacing.lg : layout.spacing.xl,
    marginBottom: isSmallScreen ? layout.spacing.md : layout.spacing.lg,
    borderRadius: layout.radius.md,
    overflow: 'hidden',
    backgroundColor: colors.white,
    ...layout.shadow.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: isSmallScreen ? layout.spacing.sm : layout.spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.text,
  },
  activeTabText: {
    color: colors.white,
  },
  searchSortContainer: {
    flexDirection: 'row',
    marginHorizontal: isSmallScreen ? layout.spacing.lg : layout.spacing.xl,
    marginBottom: isSmallScreen ? layout.spacing.md : layout.spacing.lg,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    paddingHorizontal: isSmallScreen ? layout.spacing.sm : layout.spacing.md,
    paddingVertical: isSmallScreen ? layout.spacing.xs : layout.spacing.sm,
    marginRight: layout.spacing.md,
    ...layout.shadow.sm,
  },
  searchIcon: {
    marginRight: layout.spacing.sm,
  },
  searchPlaceholder: {
    fontFamily: fonts.regular,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.grey,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    paddingHorizontal: isSmallScreen ? layout.spacing.sm : layout.spacing.md,
    paddingVertical: isSmallScreen ? layout.spacing.xs : layout.spacing.sm,
    ...layout.shadow.sm,
  },
  sortText: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? fonts.xs : fonts.sm,
    color: colors.primary,
    marginRight: layout.spacing.xs,
  },
  coinsContainer: {
    marginHorizontal: isSmallScreen ? layout.spacing.lg : layout.spacing.xl,
  },
  coinCard: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: isSmallScreen ? layout.spacing.md : layout.spacing.lg,
    marginBottom: layout.spacing.md,
    ...layout.shadow.sm,
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinImageContainer: {
    width: isSmallScreen ? 32 : 40,
    height: isSmallScreen ? 32 : 40,
    borderRadius: 20,
    backgroundColor: colors.extraLightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  coinSymbolPlaceholder: {
    fontFamily: fonts.bold,
    fontSize: isSmallScreen ? fonts.xs : fonts.sm,
  },
  coinName: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.text,
  },
  coinSymbol: {
    fontFamily: fonts.regular,
    fontSize: isSmallScreen ? fonts.xs : fonts.sm,
    color: colors.textSecondary,
  },
  coinChangeContainer: {
    alignItems: 'flex-end',
  },
  coinTrendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinChange: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? fonts.xs : fonts.sm,
    marginLeft: layout.spacing.xxs,
  },
  coinDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.extraLightGrey,
  },
  coinLabel: {
    fontFamily: fonts.regular,
    fontSize: isSmallScreen ? fonts.xs : fonts.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xxs,
  },
  coinAmount: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.text,
  },
  coinValue: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.text,
  },
  addCoinButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    paddingVertical: isSmallScreen ? layout.spacing.sm : layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderStyle: 'dashed',
    ...layout.shadow.sm,
  },
  addCoinText: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.primary,
    marginLeft: layout.spacing.xs,
  },
  transactionsContainer: {
    marginHorizontal: isSmallScreen ? layout.spacing.lg : layout.spacing.xl,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallScreen ? layout.spacing.md : layout.spacing.lg,
  },
  transactionsTitle: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? fonts.md : fonts.lg,
    color: colors.text,
  },
  transactionsFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    paddingHorizontal: isSmallScreen ? layout.spacing.sm : layout.spacing.md,
    paddingVertical: isSmallScreen ? layout.spacing.xxs : layout.spacing.xs,
    ...layout.shadow.sm,
  },
  transactionsFilter: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? fonts.xs : fonts.sm,
    color: colors.primary,
    marginHorizontal: layout.spacing.xs,
  },
  emptyTransactions: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: isSmallScreen ? layout.spacing.lg : layout.spacing.xl,
    alignItems: 'center',
    ...layout.shadow.sm,
  },
  emptyTransactionsText: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? fonts.md : fonts.lg,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  emptyTransactionsSubtext: {
    fontFamily: fonts.regular,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rewardsContainer: {
    marginHorizontal: isSmallScreen ? layout.spacing.lg : layout.spacing.xl,
  },
  rewardCard: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: isSmallScreen ? layout.spacing.md : layout.spacing.lg,
    marginBottom: layout.spacing.lg,
    ...layout.shadow.sm,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  rewardTitle: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? fonts.md : fonts.lg,
    color: colors.text,
  },
  rewardAction: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: isSmallScreen ? layout.spacing.sm : layout.spacing.md,
    paddingVertical: isSmallScreen ? layout.spacing.xxs : layout.spacing.xs,
    borderRadius: layout.radius.md,
  },
  rewardActionText: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? fonts.xs : fonts.sm,
    color: colors.primary,
  },
  rewardInfo: {
    alignItems: 'center',
    marginVertical: isSmallScreen ? layout.spacing.md : layout.spacing.lg,
  },
  rewardAmount: {
    fontFamily: fonts.bold,
    fontSize: isSmallScreen ? fonts.xl : fonts.xxxl,
    color: colors.success,
    marginBottom: layout.spacing.xs,
  },
  rewardDescription: {
    fontFamily: fonts.regular,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.textSecondary,
  },
  rewardRateContainer: {
    marginBottom: layout.spacing.lg,
  },
  rewardRateTitle: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? fonts.md : fonts.lg,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  rewardRateCard: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: isSmallScreen ? layout.spacing.md : layout.spacing.lg,
    ...layout.shadow.sm,
  },
  rewardRateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: isSmallScreen ? layout.spacing.sm : layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey,
  },
  rewardRateCoin: {
    fontFamily: fonts.medium,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.text,
  },
  rewardRateValue: {
    fontFamily: fonts.semiBold,
    fontSize: isSmallScreen ? fonts.sm : fonts.md,
    color: colors.success,
  },
});