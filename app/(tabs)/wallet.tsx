import React, { useState } from 'react';
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
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, ChevronDown, Plus, Search, Filter, Clock } from 'lucide-react-native';
import Button from '@/components/Button';

// Mock data for coins
const coins = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    amount: '0.45 BTC',
    value: '$20,250.00',
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
    value: '$6,647.50',
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
    value: '$350.00',
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
    value: '$225.00',
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
    value: '$325.00',
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
  const [selectedTab, setSelectedTab] = useState('assets');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [sortOption, setSortOption] = useState('value');

  return (
    <View style={styles.container}>
      <View style={[
        styles.header,
        { paddingTop: insets.top + layout.spacing.md }
      ]}>
        <Text style={styles.headerTitle}>Wallet</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <TouchableOpacity 
            onPress={() => setBalanceVisible(!balanceVisible)}
            style={styles.balanceHeaderContainer}
          >
            <Text style={styles.balanceHeader}>Total Balance</Text>
            <ChevronDown size={18} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.balanceValue}>
            {balanceVisible ? '$27,797.50' : '******'}
          </Text>
          <View style={styles.balanceChangeContainer}>
            <TrendingUp size={16} color={colors.success} />
            <Text style={styles.balanceChange}>+2.4% ($654.30)</Text>
          </View>
          <View style={styles.balanceActions}>
            <Button
              title="Deposit"
              variant="outline"
              onPress={() => {}}
              style={{ ...styles.balanceButton, borderColor: colors.white }}
              textStyle={{ color: colors.white }}
            />
            <Button
              title="Withdraw"
              variant="outline"
              onPress={() => {}}
              style={{ ...styles.balanceButton, borderColor: colors.white }}
              textStyle={{ color: colors.white }}
            />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && styles.activeTab,
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search and Sort */}
        <View style={styles.searchSortContainer}>
          <View style={styles.searchContainer}>
            <Search size={18} color={colors.grey} style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Search coins</Text>
          </View>
          <TouchableOpacity style={styles.sortContainer}>
            <Text style={styles.sortText}>
              Sort by: {sortOption === 'value' ? 'Value' : sortOption === 'name' ? 'Name' : 'Change'}
            </Text>
            <ChevronDown size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Coins List */}
        {selectedTab === 'assets' && (
          <View style={styles.coinsContainer}>
            {coins.map((coin) => (
              <TouchableOpacity key={coin.id} style={styles.coinCard}>
                <View style={styles.coinHeader}>
                  <View style={styles.coinInfo}>
                    <View style={styles.coinImageContainer}>
                      <Text style={[styles.coinSymbolPlaceholder, { color: coin.color }]}>
                        {coin.symbol}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.coinName}>{coin.name}</Text>
                      <Text style={styles.coinSymbol}>{coin.symbol}</Text>
                    </View>
                  </View>
                  <View style={styles.coinChangeContainer}>
                    <View style={styles.coinTrendingContainer}>
                      {coin.trending === 'up' ? (
                        <TrendingUp size={14} color={colors.success} />
                      ) : (
                        <TrendingDown size={14} color={colors.error} />
                      )}
                      <Text
                        style={[
                          styles.coinChange,
                          {
                            color: coin.trending === 'up' ? colors.success : colors.error,
                          },
                        ]}
                      >
                        {coin.change}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.coinDetails}>
                  <View>
                    <Text style={styles.coinLabel}>Amount</Text>
                    <Text style={styles.coinAmount}>{coin.amount}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.coinLabel}>Value</Text>
                    <Text style={styles.coinValue}>{coin.value}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addCoinButton}>
              <Plus size={20} color={colors.primary} />
              <Text style={styles.addCoinText}>Add New Coin</Text>
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