import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { useRouter } from 'expo-router';
import { fetchCoinGeckoPrices } from '../../utils/marketData';
import TransactionItem from '@/components/TransactionItem';
import TokenCard from '@/components/TokenCard';

// Type definitions for staking items
interface StakingOption {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  minAmount: number;
  apr: number;
  lockPeriod: string;
  description: string;
}

interface StakedAsset {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  stakedAmount: number;
  rewards: number;
  apr: number;
  status: 'active' | 'locked' | 'completed';
  startDate: string;
  endDate: string;
}

const STAKED_ASSETS = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    stakedAmount: 0.5,
    rewards: 0.01,
    apr: 2.5,
    status: 'active' as const,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    stakedAmount: 2,
    rewards: 0.05,
    apr: 3.0,
    status: 'locked' as const,
    startDate: '2023-01-01',
    endDate: '2024-01-01',
  },
  {
    id: '3',
    name: 'Litecoin',
    symbol: 'LTC',
    logo: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
    stakedAmount: 10,
    rewards: 0.1,
    apr: 4.0,
    status: 'completed' as const,
    startDate: '2022-01-01',
    endDate: '2023-01-01',
  },
];

const STAKING_OPTIONS: StakingOption[] = [
  {
    id: '1',
    name: 'Cardano',
    symbol: 'ADA',
    logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    minAmount: 10,
    apr: 5.0,
    lockPeriod: '30 days',
    description: 'Stake your ADA and earn rewards',
  },
  {
    id: '2',
    name: 'Polkadot',
    symbol: 'DOT',
    logo: 'https://cryptologos.cc/logos/polkadot-dot-logo.png',
    minAmount: 5,
    apr: 6.0,
    lockPeriod: '60 days',
    description: 'Participate in DOT staking',
  },
  {
    id: '3',
    name: 'Chainlink',
    symbol: 'LINK',
    logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
    minAmount: 15,
    apr: 4.5,
    lockPeriod: '45 days',
    description: 'Secure your LINK and earn interest',
  },
];

export default function StakingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('my-stakes');
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  useEffect(() => {
    async function loadPrices() {
      setLoadingPrices(true);
      setPriceError(null);
      const symbols = STAKED_ASSETS.map(a => a.symbol);
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

  const renderStakingItem = ({ item }: { item: StakingOption }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.stakingItem,
          isDark && { 
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border
          }
        ]}
        onPress={() => router.push(`staking-detail?id=${item.id}` as any)}
      >
        <View style={styles.stakingItemTop}>
          <View style={styles.stakingItemLeft}>
            <Image 
              source={{ uri: item.logo }} 
              style={styles.coinLogo} 
            />
            <View>
              <Text style={[
                styles.stakingName,
                isDark && { color: colors.darkText }
              ]}>
                {item.name}
              </Text>
              <Text style={[
                styles.lockPeriod,
                isDark && { color: colors.darkTextSecondary }
              ]}>
                {item.lockPeriod} lock
              </Text>
            </View>
          </View>
          <View style={styles.aprContainer}>
            <Text style={[
              styles.aprLabel,
              isDark && { color: colors.darkTextSecondary }
            ]}>APR</Text>
            <Text style={[
              styles.aprValue,
              isDark && { color: colors.dark.primaryAccent }
            ]}>{item.apr}%</Text>
          </View>
        </View>
        <View style={styles.stakingItemBottom}>
          <Text style={[
            styles.stakingDescription,
            isDark && { color: colors.darkTextSecondary }
          ]}>{item.description}</Text>
          <View style={styles.minStakeContainer}>
            <Text style={[
              styles.minStakeLabel,
              isDark && { color: colors.darkTextSecondary }
            ]}>Min. Stake:</Text>
            <Text style={[
              styles.minStakeValue,
              isDark && { color: colors.dark.primaryAccent }
            ]}>{item.minAmount} {item.symbol}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStakedItem = ({ item }: { item: StakedAsset }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.stakedItem,
          isDark && { 
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border
          }
        ]}
        onPress={() => router.push(`staked-detail?id=${item.id}` as any)}
      >
        <LinearGradient
          colors={isDark ? 
            [colors.dark.primaryAccent, colors.dark.surface3] :
            [colors.primary, colors.primaryDark || colors.primary]
          }
          style={styles.stakedItemTop}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.stakedItemHeader}>
            <View style={styles.stakedItemLeft}>
              <Image 
                source={{ uri: item.logo }} 
                style={styles.stakedLogo} 
              />
              <View>
                <Text style={[
                  styles.stakedName,
                  isDark && { color: colors.white }
                ]}>{item.name}</Text>
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusDot, 
                    item.status === 'active' ? styles.statusActive : 
                    item.status === 'locked' ? styles.statusLocked : styles.statusCompleted
                  ]} />
                  <Text style={[
                    styles.statusText,
                    isDark && { color: colors.darkTextSecondary }
                  ]}>
                    {item.status === 'active' ? 'Active' : 
                     item.status === 'locked' ? 'Locked' : 'Completed'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.stakedAprContainer}>
              <Text style={[
                styles.stakedAprLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>APR</Text>
              <Text style={[
                styles.stakedAprValue,
                isDark && { color: colors.white }
              ]}>{item.apr}%</Text>
            </View>
          </View>

          <View style={styles.stakedDetails}>
            <View style={styles.stakedDetailItem}>
              <Text style={[
                styles.stakedDetailLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>Staked</Text>
              <Text style={[
                styles.stakedDetailValue,
                isDark && { color: colors.white }
              ]}>{item.stakedAmount} {item.symbol}</Text>
              <Text style={[
                styles.stakedDetailSubvalue,
                isDark && { color: colors.darkTextSecondary }
              ]}>
                {loadingPrices ? '...' : `$${(item.stakedAmount * (prices[item.symbol] ?? 0)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              </Text>
            </View>
            <View style={styles.stakedDetailItem}>
              <Text style={[
                styles.stakedDetailLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>Rewards</Text>
              <Text style={[
                styles.stakedDetailValue,
                isDark && { color: colors.white }
              ]}>{item.rewards} {item.symbol}</Text>
              <Text style={[
                styles.stakedDetailSubvalue,
                isDark && { color: colors.darkTextSecondary }
              ]}>
                {loadingPrices ? '...' : `$${(item.rewards * (prices[item.symbol] ?? 0)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.stakedItemBottom}>
          <View style={styles.periodContainer}>
            <Text style={[
              styles.periodLabel,
              isDark && { color: colors.darkTextSecondary }
            ]}>Period:</Text>
            <Text style={[
              styles.periodValue,
              isDark && { color: colors.darkText }
            ]}>{item.startDate} - {item.endDate}</Text>
          </View>
          <TouchableOpacity style={[
            styles.actionButton,
            isDark && { backgroundColor: colors.dark.primaryAccent }
          ]}>
            <Text style={styles.actionButtonText}>
              {item.status === 'active' ? 'Claim Rewards' : 
               item.status === 'locked' ? 'View Details' : 'Restake'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      isDark && { backgroundColor: colors.dark.surface1 }
    ]}> 
      <View style={styles.header}>
        <Text style={[
          styles.screenTitle,
          isDark && { color: colors.darkText }
        ]}>Staking</Text>
        <TouchableOpacity style={[
          styles.infoButton,
          isDark && { backgroundColor: colors.dark.surface2 }
        ]}>
          <Feather 
            name="info" 
            size={22} 
            color={isDark ? colors.darkText : colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <View style={[
        styles.summaryCard,
        isDark && { 
          backgroundColor: colors.dark.surface2,
          borderColor: colors.dark.border
        }
      ]}>
        <View style={styles.summaryItem}>
          <Text style={[
            styles.summaryLabel,
            isDark && { color: colors.darkTextSecondary }
          ]}>Total Staked</Text>
          <Text style={[
            styles.summaryValue,
            isDark && { color: colors.dark.primaryAccent }
          ]}>$10,708.40</Text>
        </View>
        <View style={[
          styles.summaryDivider,
          isDark && { backgroundColor: colors.dark.border }
        ]} />
        <View style={styles.summaryItem}>
          <Text style={[
            styles.summaryLabel,
            isDark && { color: colors.darkTextSecondary }
          ]}>Total Rewards</Text>
          <Text style={[
            styles.summaryValue,
            isDark && { color: colors.dark.primaryAccent }
          ]}>$146.36</Text>
        </View>
      </View>

      <View style={[
        styles.tabsContainer,
        isDark && { 
          backgroundColor: colors.dark.surface2,
          borderColor: colors.dark.border
        }
      ]}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'my-stakes' && styles.activeTab,
            isDark && activeTab !== 'my-stakes' && { backgroundColor: colors.dark.surface2 }
          ]}
          onPress={() => setActiveTab('my-stakes')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'my-stakes' && styles.activeTabText,
            isDark && { color: activeTab === 'my-stakes' ? colors.white : colors.darkTextSecondary }
          ]}>My Stakes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'available' && styles.activeTab,
            isDark && activeTab !== 'available' && { backgroundColor: colors.dark.surface2 }
          ]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'available' && styles.activeTabText,
            isDark && { color: activeTab === 'available' ? colors.white : colors.darkTextSecondary }
          ]}>Available Assets</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'my-stakes' ? (
        <FlatList
          data={STAKED_ASSETS}
          renderItem={renderStakedItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={isDark ? colors.darkText : colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons 
                name="percent-outline" 
                size={60} 
                color={isDark ? colors.darkTextSecondary : colors.lightGrey} 
              />
              <Text style={[
                styles.emptyText,
                isDark && { color: colors.darkTextSecondary }
              ]}>You don't have any staked assets yet</Text>
              <TouchableOpacity 
                style={[
                  styles.stakeNowButton,
                  isDark && { backgroundColor: colors.dark.primaryAccent }
                ]}
                onPress={() => setActiveTab('available')}
              >
                <Text style={styles.stakeNowText}>Stake Now</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <FlatList
          data={STAKING_OPTIONS}
          renderItem={renderStakingItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={isDark ? colors.darkText : colors.primary}
            />
          }
        />
      )}

      {/* Example usage for asset and transaction lists:
      <TokenCard name="Bitcoin" symbol="BTC" amount="0.45 BTC" value={0.45 * (prices['BTC'] ?? 0)} loading={loadingPrices} change="+5.2%" trending="up" color={colors.bitcoin} />
      <TransactionItem type="receive" amount="0.1 BTC" value={0.1 * (prices['BTC'] ?? 0)} loading={loadingPrices} sender="John Doe" date="2025-06-01" />
      */}
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
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  infoButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: colors.lightGrey,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.extraLightGrey,
    marginVertical: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  activeTabText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
    marginTop: 10,
  },
  stakeNowButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  stakeNowText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  stakingItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
  },
  stakingItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stakingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  stakingName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary,
  },
  lockPeriod: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  aprContainer: {
    alignItems: 'flex-end',
  },
  aprLabel: {
    fontSize: 12,
    color: colors.darkGrey,
  },
  aprValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stakingItemBottom: {
    marginTop: 10,
  },
  stakingDescription: {
    fontSize: 14,
    color: colors.darkGrey,
    marginBottom: 10,
  },
  minStakeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  minStakeLabel: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  minStakeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stakedItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
  },
  stakedItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stakedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  stakedItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stakedLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  stakedName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusActive: {
    backgroundColor: colors.success,
  },
  statusLocked: {
    backgroundColor: colors.warning,
  },
  statusCompleted: {
    backgroundColor: colors.accent,
  },
  statusText: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  stakedAprContainer: {
    alignItems: 'flex-end',
  },
  stakedAprLabel: {
    fontSize: 12,
    color: colors.darkGrey,
  },
  stakedAprValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stakedDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  stakedDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  stakedDetailLabel: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  stakedDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stakedDetailSubvalue: {
    fontSize: 12,
    color: colors.grey,
  },
  stakedItemBottom: {
    marginTop: 10,
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  periodValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
});