import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ViewStyle,
  TextStyle,
  Platform
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../../constants/colors';
import { layout } from '../../constants/layout';
import { fetchCoinGeckoPrices } from '../../utils/marketData';
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

// Types
type CryptoType = 'BTC' | 'ETH' | 'USDT' | 'USDC';
type MethodType = 'onchain' | 'binance';

interface NetworkInfo {
  network: string;
  fee: string;
  minDeposit?: string;
}

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  label: TextStyle;
  pickerWrapper: ViewStyle;
  picker: TextStyle & ViewStyle; // Allow both text and view styles for picker
  methodRow: ViewStyle;
  methodBtn: ViewStyle;
  active: ViewStyle;
  methodText: TextStyle;
  qrContainer: ViewStyle;
  addressBox: ViewStyle;
  addressText: TextStyle;
  instructions: TextStyle;
  historyTitle: TextStyle;
  historyList: ViewStyle;
  historyCard: ViewStyle;
  historyAsset: TextStyle;
  historyAmount: TextStyle;
  historyDate: TextStyle;
  historyAddress: TextStyle;
  historyStatus: TextStyle;
  exchangeButton: ViewStyle;
  exchangeButtonText: TextStyle;
  livePriceContainer: ViewStyle;
  livePriceText: TextStyle;
  warningBox: ViewStyle;
  warningTitle: TextStyle;
  warningText: TextStyle;
  loadingSkeleton: ViewStyle;
  historyEmpty: TextStyle;
}

const NETWORK_INFO: Record<CryptoType, NetworkInfo> = {
  BTC: {
    network: 'Bitcoin Network',
    fee: '0.0001 BTC',
    minDeposit: '0.001 BTC'
  },
  ETH: {
    network: 'Ethereum Network (ERC20)',
    fee: '0.003 ETH',
    minDeposit: '0.01 ETH'
  },
  USDT: {
    network: 'Ethereum Network (ERC20)',
    fee: '$5-15 (varies)',
    minDeposit: '20 USDT'
  },
  USDC: {
    network: 'Ethereum Network (ERC20)',
    fee: '$5-15 (varies)',
    minDeposit: '20 USDC'
  }
};

const DEPOSIT_ADDRESSES: Record<CryptoType, Record<MethodType, string>> = {
  BTC: {
    onchain: 'bc1qxyzexamplebtcaddress',
    binance: 'btc-binancepay-id-123456',
  },
  ETH: {
    onchain: '0xEthExampleAddress',
    binance: 'eth-binancepay-id-654321',
  },
  USDT: {
    onchain: '0xUsdtExampleAddress',
    binance: 'usdt-binancepay-id-999999',
  },
  USDC: {
    onchain: '0xUsdcExampleAddress',
    binance: 'usdc-binancepay-id-888888',
  },
};

interface DepositHistoryItem {
  id: string;
  asset: CryptoType;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  address: string;
}

const MOCK_DEPOSIT_HISTORY: DepositHistoryItem[] = [
  {
    id: '1',
    asset: 'BTC',
    amount: 0.15,
    date: '2025-06-05 14:32',
    status: 'completed',
    address: 'bc1qxyzexamplebtcaddress',
  },
  {
    id: '2',
    asset: 'ETH',
    amount: 1.2,
    date: '2025-06-04 09:10',
    status: 'pending',
    address: '0xEthExampleAddress',
  },
  {
    id: '3',
    asset: 'USDT',
    amount: 500,
    date: '2025-06-01 18:45',
    status: 'failed',
    address: '0xUsdtExampleAddress',
  },
];

const DepositScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [crypto, setCrypto] = useState<CryptoType>('BTC');
  const [method, setMethod] = useState<MethodType>('onchain');
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const router = useRouter();

  const loadingAnimation = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.3, { duration: 800 }),
        withTiming(0.7, { duration: 800 })
      ),
      -1,
      true
    ),
  }));

  useEffect(() => {
    async function loadPrices() {
      setLoadingPrices(true);
      setPriceError(null);
      try {
        const result = await fetchCoinGeckoPrices(['BTC', 'ETH', 'USDT', 'USDC']);
        setPrices(result);
      } catch (e) {
        setPriceError('Failed to load price');
      }
      setLoadingPrices(false);
    }
    loadPrices();
  }, []);

  const depositAddress = DEPOSIT_ADDRESSES[crypto][method];
  const handleCopy = () => {
    Clipboard.setString(depositAddress);
    Alert.alert(
      'Address Copied',
      `The ${crypto} ${method === 'onchain' ? 'on-chain' : 'Binance Pay'} deposit address has been copied to your clipboard.`,
      [{ text: 'OK' }]
    );
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${crypto} Deposit Address`,
        text: `My ${crypto} ${method === 'onchain' ? 'on-chain' : 'Binance Pay'} deposit address:\n${depositAddress}`,
      });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        Alert.alert(
          'Sharing Failed',
          'Unable to share the deposit address. Please try copying it instead.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.container,
        isDark && { backgroundColor: colors.dark.surface1 }
      ]}
    > 
      <Text style={[
        styles.title,
        isDark && { color: colors.darkText }
      ]}>Deposit</Text>

      {/* Token Picker */}      <Text style={[
        styles.label,
        isDark && { color: colors.darkText }
      ]}>Select Cryptocurrency</Text>
      <View style={[
        styles.pickerWrapper,
        isDark && { 
          backgroundColor: colors.dark.surface2,
          borderColor: colors.dark.border 
        }
      ]}>
        <Picker
          selectedValue={crypto}
          onValueChange={(value: string) => setCrypto(value as CryptoType)}
          style={[styles.picker, isDark && { color: colors.darkText }]}
          dropdownIconColor={isDark ? colors.darkText : colors.text}
          accessibilityLabel="Select cryptocurrency for deposit"
          accessibilityHint="Choose which cryptocurrency you want to deposit"
        >
          <Picker.Item 
            label="Bitcoin (BTC)" 
            value="BTC" 
            color={isDark ? colors.darkText : colors.text}
          />
          <Picker.Item 
            label="Ethereum (ETH)" 
            value="ETH" 
            color={isDark ? colors.darkText : colors.text}
          />
          <Picker.Item 
            label="Tether (USDT)" 
            value="USDT" 
            color={isDark ? colors.darkText : colors.text}
          />
          <Picker.Item 
            label="USD Coin (USDC)" 
            value="USDC" 
            color={isDark ? colors.darkText : colors.text}
          />
        </Picker>
      </View>

      {/* Live Price */}      <View style={styles.livePriceContainer}>
        <MaterialCommunityIcons 
          name="chart-line" 
          size={16} 
          color={isDark ? colors.darkTextSecondary : colors.textSecondary}
          style={{ marginRight: 4 }}
        />
        {loadingPrices ? (
          <Animated.View style={[styles.loadingSkeleton, loadingAnimation]} />
        ) : (
          <Text style={[
            styles.livePriceText,
            isDark && { color: colors.darkTextSecondary }
          ]}>
            {priceError ? priceError : 
             prices[crypto] ? `1 ${crypto} ≈ $${prices[crypto].toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'Price unavailable'}
          </Text>
        )}
      </View>

      {/* Method Switch */}
      <Text style={[
        styles.label,
        isDark && { color: colors.darkText }
      ]}>Select Deposit Method</Text>
      <View style={styles.methodRow}>
        <TouchableOpacity
          style={[
            styles.methodBtn,
            method === 'onchain' && styles.active,
            isDark && { 
              backgroundColor: method === 'onchain' ? colors.dark.primaryAccent : colors.dark.surface2 
            }
          ]}
          onPress={() => setMethod('onchain')}
        >
          <Text style={[
            styles.methodText,
            isDark && { color: method === 'onchain' ? colors.white : colors.darkText }
          ]}>On-Chain</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.methodBtn,
            method === 'binance' && styles.active,
            isDark && { 
              backgroundColor: method === 'binance' ? colors.dark.primaryAccent : colors.dark.surface2 
            }
          ]}
          onPress={() => setMethod('binance')}
        >
          <Text style={[
            styles.methodText,
            isDark && { color: method === 'binance' ? colors.white : colors.darkText }
          ]}>Binance Pay</Text>
        </TouchableOpacity>
      </View>      {/* Network Warning Box */}
      {method === 'onchain' && (
        <View          style={[
            styles.warningBox,
            isDark && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border,
              borderWidth: 1
            }
          ]}
          accessible={true}
          accessibilityLabel={`Important network information for ${crypto}`}
          accessibilityRole="alert"
        >
          <MaterialCommunityIcons 
            name="alert-circle" 
            size={20} 
            color={isDark ? colors.textSecondary : colors.warning}
            style={{ marginRight: 8 }}
          />
          <View>
            <Text style={[
              styles.warningTitle,
              isDark && { color: colors.darkText }
            ]}>
              Important: Use {NETWORK_INFO[crypto].network} Only
            </Text>
            <Text style={[
              styles.warningText,
              isDark && { color: colors.darkTextSecondary }
            ]}>
              Network Fee: ~{NETWORK_INFO[crypto].fee}
              {NETWORK_INFO[crypto].minDeposit ? `\nMinimum Deposit: ${NETWORK_INFO[crypto].minDeposit}` : ''}
            </Text>
          </View>
        </View>
      )}

      {/* QR Code */}
      <View style={styles.qrContainer} accessible={true} accessibilityLabel={`QR code for ${crypto} deposit address`}>
        <QRCode 
          value={depositAddress} 
          size={180}
          backgroundColor={isDark ? colors.dark.surface1 : colors.white}
          color={isDark ? colors.darkText : colors.text}
        />
      </View>

      {/* Address Display */}
      <Text style={[
        styles.label,
        isDark && { color: colors.darkText }
      ]}>Deposit Address</Text>
      <View style={[
        styles.addressBox,
        isDark && { backgroundColor: colors.dark.surface2 }
      ]}>
        <Text 
          style={[
            styles.addressText,
            isDark && { color: colors.darkText }
          ]} 
          numberOfLines={1} 
          selectable
          accessibilityLabel={`${crypto} deposit address`}
        >
          {depositAddress}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={handleCopy} 
            style={{ marginRight: 8, padding: 8 }}
            accessibilityLabel="Copy address"
            accessibilityHint={`Copies the ${crypto} deposit address to clipboard`}
          >
            <MaterialCommunityIcons 
              name="content-copy" 
              size={24} 
              color={isDark ? colors.dark.primaryAccent : colors.primary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleShare} 
            style={{ padding: 8 }}
            accessibilityLabel="Share address"
            accessibilityHint={`Opens sharing options for the ${crypto} deposit address`}
          >
            <MaterialCommunityIcons 
              name="share-variant" 
              size={24} 
              color={isDark ? colors.dark.primaryAccent : colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[
        styles.instructions,
        isDark && { color: colors.darkTextSecondary }
      ]}>Send only {crypto} to this address. Use correct network. Deposits will reflect after
        sufficient confirmations.
      </Text>      {/* Exchange Button */}
      <TouchableOpacity
        style={[
          styles.exchangeButton,
          isDark && { backgroundColor: colors.dark.primaryAccent }
        ]}
        onPress={() => router.push('/(deposit)/convert')}
        accessibilityLabel="Open currency exchange"
        accessibilityHint="Navigate to the currency exchange screen"
      >
        <MaterialCommunityIcons          name="swap-horizontal" 
          size={20} 
          color={colors.white}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.exchangeButtonText}>
          Exchange Currencies
        </Text>
      </TouchableOpacity>

      {/* Deposit History Section */}      <Text style={[
        styles.historyTitle,
        isDark && { color: colors.darkText }
      ]}      accessibilityRole="text"
      >Deposit History</Text>
      <View 
        style={styles.historyList}        accessibilityLabel="List of recent deposits"
        accessibilityRole="scrollbar"
      >
        {MOCK_DEPOSIT_HISTORY.length > 0 ? (
          MOCK_DEPOSIT_HISTORY.map((item) => (
            <View 
              key={item.id} 
              style={[
                styles.historyCard,
                isDark && { backgroundColor: colors.dark.surface2 }
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${item.amount} ${item.asset} deposit, ${item.status}`}
              accessibilityHint={`Made on ${item.date}`}
            > 
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={[
                  styles.historyAsset,
                  isDark && { color: colors.dark.primaryAccent }
                ]}>{item.asset}</Text>
                <Text style={[
                  styles.historyAmount,
                  isDark && { color: colors.darkText }
                ]}> {item.amount} {item.asset}</Text>
              </View>
              <Text style={[
                styles.historyDate,
                isDark && { color: colors.darkTextSecondary }
              ]}>{item.date}</Text>
              <Text style={[
                styles.historyAddress,
                isDark && { color: colors.darkTextSecondary }
              ]} numberOfLines={1}>{item.address}</Text>
              <Text style={[
                styles.historyStatus,
                item.status === 'completed' ? 
                  { color: isDark ? colors.successLight : colors.success } : 
                item.status === 'pending' ? 
                  { color: isDark ? colors.warningLight : colors.warning } : 
                  { color: isDark ? colors.errorLight : colors.error }
              ]}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
            </View>
          ))
        ) : (
          <Text style={[
            styles.historyEmpty,
            isDark && { color: colors.darkTextSecondary }
          ]}>No deposit history yet</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default DepositScreen;

const styles = StyleSheet.create<Styles>({
  container: {
    padding: layout.spacing.xl,
    backgroundColor: colors.white,
    flexGrow: 1,
  },
  livePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: colors.extraLightGrey,
    padding: layout.spacing.sm,
    borderRadius: layout.radius.sm,
  },
  livePriceText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  exchangeButton: {
    marginTop: 32,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
  exchangeButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: layout.spacing.lg,
  },
  label: {
    fontSize: 16,
    marginVertical: layout.spacing.md,
    color: colors.text,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: layout.radius.md,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: layout.spacing.md,
  },
  methodBtn: {
    padding: layout.spacing.md,
    borderRadius: layout.radius.md,
    backgroundColor: colors.extraLightGrey,
    minWidth: 120,
    alignItems: 'center',
  },
  active: {
    backgroundColor: colors.primary,
  },
  methodText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: layout.spacing.lg,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.extraLightGrey,
    padding: layout.spacing.md,
    borderRadius: layout.radius.md,
    justifyContent: 'space-between',
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    marginRight: layout.spacing.md,
    color: colors.text,
  },
  instructions: {
    marginTop: layout.spacing.lg,
    fontSize: 14,
    color: colors.textSecondary,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 12,
    color: colors.primary,
  },
  historyList: {
    marginBottom: 32,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  historyAsset: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  historyAmount: {
    fontSize: 16,
    color: colors.text,
  },
  historyDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  historyAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  historyStatus: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: layout.spacing.md,
    backgroundColor: colors.warningLight,
    borderRadius: layout.radius.md,
    marginVertical: layout.spacing.md,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  loadingSkeleton: {
    height: 14,
    width: 120,
    backgroundColor: colors.lightGrey,
    borderRadius: 4,
  },
  historyEmpty: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: layout.spacing.lg,
  },
});
