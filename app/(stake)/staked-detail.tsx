import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  useColorScheme 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { ArrowLeft, TrendingUp, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchCoinGeckoPrices } from '../../utils/marketData';
import Button from '@/components/Button';

// Type definitions
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

// Sample data
const STAKED_ASSETS: StakedAsset[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    stakedAmount: 0.5,
    rewards: 0.01,
    apr: 2.5,
    status: 'active',
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
    status: 'locked',
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
    status: 'completed',
    startDate: '2022-01-01',
    endDate: '2023-01-01',
  },
];

export default function StakedDetailScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : undefined;
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Find the staked asset from the STAKED_ASSETS array
  const stakedAsset = STAKED_ASSETS.find(asset => asset.id === id);

  useEffect(() => {
    async function loadPrice() {
      if (!stakedAsset) return;
      try {
        const prices = await fetchCoinGeckoPrices([stakedAsset.symbol]);
        setPrice(prices[stakedAsset.symbol] ?? null);
      } catch (error) {
        console.error('Failed to load price:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPrice();
  }, [stakedAsset]);

  if (!stakedAsset) {
    return (
      <View style={[
        styles.container,
        isDark && { backgroundColor: colors.dark.surface1 }
      ]}>
        <Text style={[
          styles.errorText,
          isDark && { color: colors.darkText }
        ]}>Staked asset not found</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'locked':
        return colors.warning;
      case 'completed':
        return colors.accent;
      default:
        return colors.grey;
    }
  };

  return (
    <View style={[
      styles.container,
      isDark && { backgroundColor: colors.dark.surface1 }
    ]}>
      <ScrollView 
        contentContainerStyle={[
          styles.content,
          { 
            paddingTop: insets.top + layout.spacing.lg,
            paddingBottom: insets.bottom + layout.spacing.lg
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={isDark ? colors.darkText : colors.text} />
          </TouchableOpacity>
          <Text style={[
            styles.title,
            isDark && { color: colors.darkText }
          ]}>Staked {stakedAsset.name}</Text>
        </View>

        {/* Asset Card */}
        <View style={[
          styles.card,
          isDark && { 
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border
          }
        ]}>
          <View style={styles.assetHeader}>
            <Image 
              source={{ uri: stakedAsset.logo }} 
              style={styles.assetLogo}
            />
            <View style={styles.assetInfo}>
              <Text style={[
                styles.assetName,
                isDark && { color: colors.darkText }
              ]}>{stakedAsset.name}</Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(stakedAsset.status) }
                ]} />
                <Text style={[
                  styles.statusText,
                  isDark && { color: colors.darkTextSecondary }
                ]}>
                  {stakedAsset.status.charAt(0).toUpperCase() + stakedAsset.status.slice(1)}
                </Text>
              </View>
            </View>
            <View style={styles.aprBox}>
              <Text style={[
                styles.aprLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>APR</Text>
              <Text style={[
                styles.aprValue,
                isDark && { color: colors.dark.primaryAccent }
              ]}>{stakedAsset.apr}%</Text>
            </View>
          </View>

          <View style={[
            styles.divider,
            isDark && { backgroundColor: colors.dark.border }
          ]} />

          {/* Staking Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={[
                styles.detailLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>Staked Amount</Text>
              <Text style={[
                styles.detailValue,
                isDark && { color: colors.darkText }
              ]}>{stakedAsset.stakedAmount} {stakedAsset.symbol}</Text>
              {price && (
                <Text style={[
                  styles.detailSubvalue,
                  isDark && { color: colors.darkTextSecondary }
                ]}>
                  ${(stakedAsset.stakedAmount * price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Text>
              )}
            </View>

            <View style={styles.detailItem}>
              <Text style={[
                styles.detailLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>Rewards Earned</Text>
              <Text style={[
                styles.detailValue,
                isDark && { color: colors.darkText }
              ]}>{stakedAsset.rewards} {stakedAsset.symbol}</Text>
              {price && (
                <Text style={[
                  styles.detailSubvalue,
                  isDark && { color: colors.darkTextSecondary }
                ]}>
                  ${(stakedAsset.rewards * price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Text>
              )}
            </View>
          </View>

          {/* Staking Period */}
          <View style={styles.periodSection}>
            <View style={styles.periodHeader}>
              <Clock 
                size={20} 
                color={isDark ? colors.darkTextSecondary : colors.grey} 
              />
              <Text style={[
                styles.periodTitle,
                isDark && { color: colors.darkTextSecondary }
              ]}>Staking Period</Text>
            </View>
            <View style={styles.periodDates}>
              <Text style={[
                styles.dateText,
                isDark && { color: colors.darkText }
              ]}>
                Start: {stakedAsset.startDate}
              </Text>
              <Text style={[
                styles.dateText,
                isDark && { color: colors.darkText }
              ]}>
                End: {stakedAsset.endDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {stakedAsset.status === 'active' && (
            <Button
              title="Claim Rewards"
              onPress={() => {/* Implement claim action */}}
              style={styles.claimButton}
              darkMode={isDark}
            />
          )}
          {stakedAsset.status === 'completed' && (
            <Button
              title="Restake"
              onPress={() => {/* Implement restake action */}}
              style={styles.restakeButton}
              darkMode={isDark}
            />
          )}
          <Button
            title="Withdraw"
            onPress={() => {/* Implement withdraw action */}}
            style={styles.withdrawButton}
            variant="secondary"
            darkMode={isDark}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: layout.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.xl,
  },
  backButton: {
    padding: layout.spacing.sm,
    marginRight: layout.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: layout.spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.lg,
    marginBottom: layout.spacing.xl,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    ...layout.shadow.md,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  assetLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: layout.spacing.md,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: layout.spacing.xs,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  aprBox: {
    alignItems: 'flex-end',
  },
  aprLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  aprValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGrey,
    marginVertical: layout.spacing.lg,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: layout.spacing.xl,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xs,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  detailSubvalue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  periodSection: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
    paddingTop: layout.spacing.lg,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  periodTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: layout.spacing.sm,
  },
  periodDates: {
    paddingLeft: layout.spacing.xl,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  actions: {
    marginTop: layout.spacing.lg,
  },
  claimButton: {
    marginBottom: layout.spacing.md,
  },
  restakeButton: {
    marginBottom: layout.spacing.md,
  },
  withdrawButton: {
    marginBottom: layout.spacing.md,
  },
});
