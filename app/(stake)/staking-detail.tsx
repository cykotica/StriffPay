import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  useColorScheme,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/Button';

// Import types and constants from staking.tsx
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

// Import staking options from staking screen
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
  }
];

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  title: TextStyle;
  errorText: TextStyle;
  card: ViewStyle;
  assetHeader: ViewStyle;
  assetLogo: ImageStyle;
  assetInfo: ViewStyle;
  assetName: TextStyle;
  assetSymbol: TextStyle;
  divider: ViewStyle;
  detailsGrid: ViewStyle;
  detailItem: ViewStyle;
  detailLabel: TextStyle;
  detailValue: TextStyle;
  description: TextStyle;
  actions: ViewStyle;
  stakeButton: ViewStyle;
}

export default function StakingDetailScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : undefined;
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);

  // Find the staking option from the STAKING_OPTIONS array
  const stakingOption = STAKING_OPTIONS.find(option => option.id === id);

  useEffect(() => {
    // Simulate loading for demo purposes
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={[
        styles.container,
        isDark && { backgroundColor: colors.dark.surface1 },
        { justifyContent: 'center', alignItems: 'center' }
      ]}>
        <ActivityIndicator size="large" color={isDark ? colors.dark.primaryAccent : colors.primary} />
      </View>
    );
  }

  if (!stakingOption) {
    return (
      <View style={[
        styles.container,
        isDark && { backgroundColor: colors.dark.surface1 }
      ]}>
        <Text style={[
          styles.errorText,
          isDark && { color: colors.darkText }
        ]} accessibilityRole="alert">Staking option not found</Text>
      </View>
    );
  }
  return (    <View 
      style={[
        styles.container,
        isDark && { backgroundColor: colors.dark.surface1 }
      ]}
      accessible={true}
      accessibilityLabel="Staking details page">
      <ScrollView 
        contentContainerStyle={[
          styles.content,
          { 
            paddingTop: insets.top + layout.spacing.lg,
            paddingBottom: insets.bottom + layout.spacing.lg
          }
        ]}
        showsVerticalScrollIndicator={false}
        accessibilityRole="scrollbar"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Returns to the previous screen"
          >
            <ArrowLeft size={24} color={isDark ? colors.darkText : colors.text} />
          </TouchableOpacity>
          <Text style={[
            styles.title,
            isDark && { color: colors.darkText }
          ]} accessibilityRole="header">Stake {stakingOption.name}</Text>
        </View>

        {/* Asset Info Card */}
        <View style={[
          styles.card,
          isDark && { 
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border
          }
        ]}>
          <View style={styles.assetHeader}>
            <Image 
              source={{ uri: stakingOption.logo }} 
              style={styles.assetLogo}
            />
            <View style={styles.assetInfo}>
              <Text style={[
                styles.assetName,
                isDark && { color: colors.darkText }
              ]}>{stakingOption.name}</Text>
              <Text style={[
                styles.assetSymbol,
                isDark && { color: colors.darkTextSecondary }
              ]}>{stakingOption.symbol}</Text>
            </View>
          </View>          <View 
            style={[
              styles.divider,
              isDark && { backgroundColor: colors.dark.border }
            ]}          />

          {/* Staking Details */}
          <View style={styles.detailsGrid} accessible={true}>
            <View style={styles.detailItem}>
              <Text style={[
                styles.detailLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>APR</Text>
              <Text 
                style={[
                  styles.detailValue,
                  isDark && { color: colors.dark.primaryAccent }
                ]}
                accessibilityLabel={`Annual Percentage Rate ${stakingOption.apr}%`}
              >{stakingOption.apr}%</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[
                styles.detailLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>Lock Period</Text>
              <Text 
                style={[
                  styles.detailValue,
                  isDark && { color: colors.darkText }
                ]}
                accessibilityLabel={`Lock period ${stakingOption.lockPeriod}`}
              >{stakingOption.lockPeriod}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[
                styles.detailLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>Minimum Stake</Text>
              <Text 
                style={[
                  styles.detailValue,
                  isDark && { color: colors.darkText }
                ]}
                accessibilityLabel={`Minimum stake amount ${stakingOption.minAmount} ${stakingOption.symbol}`}
              >{stakingOption.minAmount} {stakingOption.symbol}</Text>
            </View>
          </View>

          <Text 
            style={[
              styles.description,
              isDark && { color: colors.darkTextSecondary }
            ]}
            accessibilityLabel={`Description: ${stakingOption.description}`}
          >{stakingOption.description}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title={`Stake ${stakingOption.symbol}`}
            onPress={() => {
              // To be implemented
              Alert.alert(
                'Coming Soon',
                'Staking functionality will be available soon!'
              );
            }}
            style={styles.stakeButton}
            darkMode={isDark}
            accessibilityLabel={`Stake ${stakingOption.symbol}`}
            accessibilityHint={`Opens the staking flow for ${stakingOption.symbol}`}
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
  assetSymbol: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGrey,
    marginVertical: layout.spacing.lg,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.spacing.lg,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  actions: {
    marginTop: layout.spacing.xl,
  },
  stakeButton: {
    marginBottom: layout.spacing.md,
  },
});
