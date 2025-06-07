import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { layout } from '../../constants/layout';
import { fetchCoinGeckoPrices } from '../../utils/marketData';
import TransactionItem from '@/components/TransactionItem';
import TokenCard from '@/components/TokenCard';

// Asset type and mock data
type Asset = {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  priceUSD: number;
  logo: string;
  isFiat?: boolean;
};

const ASSETS: Asset[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: 0.3451,
    priceUSD: 73241.89,
    logo: 'btc',
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: 2.45,
    priceUSD: 3569.45,
    logo: 'eth',
  },
  {
    id: '3',
    name: 'USDT',
    symbol: 'USDT',
    balance: 1500,
    priceUSD: 1.00,
    logo: 'usdt',
  },
  {
    id: '4',
    name: 'Solana',
    symbol: 'SOL',
    balance: 32.5,
    priceUSD: 142.78,
    logo: 'sol',
  },
  {
    id: '5',
    name: 'US Dollar',
    symbol: 'USD',
    balance: 5000,
    priceUSD: 1.00,
    logo: 'usd',
    isFiat: true,
  },
  {
    id: '6',
    name: 'Euro',
    symbol: 'EUR',
    balance: 4200,
    priceUSD: 1.08,
    logo: 'eur',
    isFiat: true,
  },
];

export default function ConvertScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [fromAsset, setFromAsset] = useState(ASSETS[0]);
  const [toAsset, setToAsset] = useState(ASSETS[4]); // USD
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [enablePriceAlerts, setEnablePriceAlerts] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);

  // Fetch prices on mount and when assets change
  useEffect(() => {
    async function loadPrices() {
      setLoadingPrices(true);
      const symbols = ASSETS.map(a => a.symbol);
      try {
        const result = await fetchCoinGeckoPrices(symbols);
        setPrices(result);
      } catch (e) {
        // Optionally show error
      }
      setLoadingPrices(false);
    }
    loadPrices();
  }, []);

  // Update asset prices in state
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0 && prices[fromAsset.symbol] && prices[toAsset.symbol]) {
      const fromValue = parseFloat(fromAmount) * prices[fromAsset.symbol];
      const convertedAmount = fromValue / prices[toAsset.symbol];
      setToAmount(convertedAmount.toFixed(6));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromAsset, toAsset, prices]);

  const handleSwapAssets = () => {
    const tempAsset = fromAsset;
    const tempAmount = fromAmount;
    setFromAsset(toAsset);
    setToAsset(tempAsset);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleMaxAmount = () => {
    setFromAmount(fromAsset.balance.toString());
  };

  const handleConvert = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      Alert.alert('Invalid', 'Please enter a valid amount');
      return;
    }
    if (parseFloat(fromAmount) > fromAsset.balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough balance');
      return;
    }
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      Alert.alert('Success', `Successfully converted ${fromAmount} ${fromAsset.symbol} to ${toAmount} ${toAsset.symbol}`);
      // navigation.navigate('ConvertSuccess', { ... }) // You can implement this if you have a success screen
    }, 2000);
  };

  const renderAssetPicker = (
    assets: Asset[],
    selectedAsset: Asset,
    onSelect: (asset: Asset) => void,
    onClose: () => void
  ) => {
    return (
      <View style={[
        styles.assetPickerOverlay,
        isDark && { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
      ]}>
        <View style={[
          styles.assetPickerContainer,
          isDark && {
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border
          }
        ]}>
          <View style={styles.pickerHeader}>
            <Text style={[
              styles.pickerTitle,
              isDark && { color: colors.darkText }
            ]}>Select Asset</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? colors.darkText : colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.assetList}>
            {assets.map((asset) => (
              <TouchableOpacity
                key={asset.id}
                style={[
                  styles.assetItem,
                  selectedAsset.id === asset.id && styles.selectedAssetItem,
                  isDark && {
                    backgroundColor: selectedAsset.id === asset.id ?
                      colors.dark.primaryAccent : colors.dark.surface3,
                    borderColor: colors.dark.border
                  }
                ]}
                onPress={() => {
                  onSelect(asset);
                  onClose();
                }}
              >
                <View style={styles.assetItemLeft}>
                  <Image
                    source={{
                      uri: `https://api.a0.dev/assets/image?text=${asset.logo}%20${asset.isFiat ? 'currency' : 'cryptocurrency'}%20logo%20minimal&aspect=1:1&seed=${asset.id}`
                    }}
                    style={styles.assetLogo}
                  />
                  <View>
                    <Text style={[
                      styles.assetName,
                      isDark && {
                        color: selectedAsset.id === asset.id ?
                          colors.white : colors.darkText
                      }
                    ]}>{asset.name}</Text>
                    <Text style={[
                      styles.assetBalance,
                      isDark && { color: colors.darkTextSecondary }
                    ]}>
                      {asset.balance.toLocaleString()} {asset.symbol}
                    </Text>
                  </View>
                </View>
                <View style={styles.assetItemRight}>
                  <Text style={[
                    styles.assetPrice,
                    isDark && {
                      color: selectedAsset.id === asset.id ?
                        colors.white : colors.darkText
                    }
                  ]}>
                    ${(asset.balance * (prices[asset.symbol] ?? 0)).toLocaleString()}
                  </Text>
                  {!asset.isFiat && (
                    <Text style={[
                      styles.assetPriceUSD,
                      isDark && { color: colors.darkTextSecondary }
                    ]}>
                      ${prices[asset.symbol]?.toLocaleString()}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Defensive: fallback if asset is missing
  if (!fromAsset || !toAsset) {
    return (
      <SafeAreaView style={[
        { flex: 1, justifyContent: 'center', alignItems: 'center' },
        isDark && { backgroundColor: colors.dark.surface1 }
      ]}>
        <Text style={{
          color: isDark ? colors.errorLight : colors.error,
          fontSize: 18
        }}>Asset not found. Please go back and try again.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 24 }}
        >
          <Text style={{
            color: isDark ? colors.dark.primaryAccent : colors.primary,
            fontSize: 16
          }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Defensive: fallback if price lookup fails
  if (!prices[fromAsset.symbol] || !prices[toAsset.symbol]) {
    return (
      <SafeAreaView style={[
        { flex: 1, justifyContent: 'center', alignItems: 'center' },
        isDark && { backgroundColor: colors.dark.surface1 }
      ]}>
        <Text style={{
          color: isDark ? colors.errorLight : colors.error,
          fontSize: 18
        }}>Unable to fetch live prices. Please check your internet connection or try again later.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 24 }}
        >
          <Text style={{
            color: isDark ? colors.dark.primaryAccent : colors.primary,
            fontSize: 16
          }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[
      styles.container,
      isDark && { 
        backgroundColor: colors.dark.surface1,
      }
    ]}>
      <ScrollView style={[
        styles.scrollView,
        isDark && {
          backgroundColor: colors.dark.surface1
        }
      ]}>
        {/* Header */}
        <View style={[
          styles.header,
          isDark && {
            backgroundColor: colors.dark.surface1,
            borderBottomColor: colors.dark.border
          }
        ]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather
              name="arrow-left"
              size={24}
              color={isDark ? colors.darkText : colors.text}
            />
          </TouchableOpacity>
          <Text style={[
            styles.screenTitle,
            isDark && { color: colors.darkText }
          ]}>Convert & Swap</Text>
          <TouchableOpacity style={styles.historyButton}>
            <MaterialCommunityIcons
              name="history"
              size={24}
              color={isDark ? colors.dark.primaryAccent : colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Exchange Rate Card */}
        <View style={[
          styles.exchangeRateCard,
          isDark && {
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            elevation: 4
          }
        ]}>
          <Text style={[
            styles.exchangeRateLabel,
            isDark && { color: colors.darkTextSecondary }
          ]}>Exchange Rate</Text>
          <Text style={[
            styles.exchangeRate,
            isDark && { color: colors.darkText }
          ]}>
            1 {fromAsset.symbol} = {(prices[toAsset.symbol] ?? 0) / (prices[fromAsset.symbol] ?? 1)} {toAsset.symbol}
          </Text>
          <View style={styles.rateDetails}>
            <Text style={[
              styles.rateDetail,
              isDark && { color: colors.darkTextSecondary }
            ]}>
              24h Change:{' '}
              <Text style={[
                styles.positiveChange,
                isDark && { color: colors.successLight }
              ]}>+2.4%</Text>
            </Text>
            <Text style={[
              styles.rateDetail,
              isDark && { color: colors.darkTextSecondary }
            ]}>
              Slippage: {slippageTolerance}%
            </Text>
          </View>
        </View>

        {/* Conversion Form */}
        <View style={[
          styles.conversionContainer,
          isDark && {
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            elevation: 4
          }
        ]}>
          {/* From Asset */}
          <View style={styles.assetSection}>
            <Text style={[
              styles.sectionLabel,
              isDark && { color: colors.darkTextSecondary }
            ]}>From</Text>
            <TouchableOpacity
              style={[
                styles.assetSelector,
                isDark && {
                  backgroundColor: colors.dark.surface2,
                  borderColor: colors.dark.border
                }
              ]}
              onPress={() => setShowFromPicker(true)}
            >
              <View style={styles.selectedAsset}>
                <Image
                  source={{
                    uri: `https://api.a0.dev/assets/image?text=${fromAsset.logo}%20${fromAsset.isFiat ? 'currency' : 'cryptocurrency'}%20logo%20minimal&aspect=1:1&seed=${fromAsset.id}`
                  }}
                  style={styles.selectedAssetLogo}
                />
                <View>
                  <Text style={[
                    styles.selectedAssetName,
                    isDark && { color: colors.darkText }
                  ]}>{fromAsset.name}</Text>
                  <Text style={[
                    styles.selectedAssetBalance,
                    isDark && { color: colors.darkTextSecondary }
                  ]}>
                    Balance: {fromAsset.balance.toLocaleString()} {fromAsset.symbol}
                  </Text>
                </View>
              </View>
              <Feather
                name="chevron-down"
                size={20}
                color={isDark ? colors.darkTextSecondary : colors.textSecondary}
              />
            </TouchableOpacity>
            <View style={styles.amountContainer}>
              <TextInput
                style={[
                  styles.amountInput,
                  isDark && {
                    backgroundColor: colors.dark.surface3,
                    borderColor: colors.dark.border,
                    color: colors.darkText
                  }
                ]}
                placeholder="0.00"
                value={fromAmount}
                onChangeText={setFromAmount}
                keyboardType="numeric"
                placeholderTextColor={isDark ? colors.darkTextSecondary : colors.lightGrey}
              />
              <TouchableOpacity
                style={[
                  styles.maxButton,
                  isDark && { backgroundColor: colors.dark.primaryAccent }
                ]}
                onPress={() => setFromAmount(fromAsset.balance.toString())}
              >
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </View>
            <Text style={[
              styles.usdValue,
              isDark && { color: colors.darkTextSecondary }
            ]}>
              ≈ ${fromAmount ? (parseFloat(fromAmount) * (prices[fromAsset.symbol] ?? 0)).toLocaleString() : '0.00'}
            </Text>
          </View>

          {/* Swap Button */}
          <TouchableOpacity
            style={[
              styles.swapButton,
              isDark && { backgroundColor: colors.dark.surface2 }
            ]}
            onPress={() => {
              const tempAsset = fromAsset;
              setFromAsset(toAsset);
              setToAsset(tempAsset);
              setFromAmount(toAmount);
              setToAmount(fromAmount);
            }}
          >
            <MaterialCommunityIcons
              name="swap-vertical"
              size={24}
              color={isDark ? colors.dark.primaryAccent : colors.primary}
            />
          </TouchableOpacity>

          {/* To Asset */}
          <View style={styles.assetSection}>
            <Text style={[
              styles.sectionLabel,
              isDark && { color: colors.darkTextSecondary }
            ]}>To</Text>
            <TouchableOpacity
              style={[
                styles.assetSelector,
                isDark && {
                  backgroundColor: colors.dark.surface2,
                  borderColor: colors.dark.border
                }
              ]}
              onPress={() => setShowToPicker(true)}
            >
              <View style={styles.selectedAsset}>
                <Image
                  source={{
                    uri: `https://api.a0.dev/assets/image?text=${toAsset.logo}%20${toAsset.isFiat ? 'currency' : 'cryptocurrency'}%20logo%20minimal&aspect=1:1&seed=${toAsset.id}`
                  }}
                  style={styles.selectedAssetLogo}
                />
                <View>
                  <Text style={[
                    styles.selectedAssetName,
                    isDark && { color: colors.darkText }
                  ]}>{toAsset.name}</Text>
                  <Text style={[
                    styles.selectedAssetBalance,
                    isDark && { color: colors.darkTextSecondary }
                  ]}>
                    Balance: {toAsset.balance.toLocaleString()} {toAsset.symbol}
                  </Text>
                </View>
              </View>
              <Feather
                name="chevron-down"
                size={20}
                color={isDark ? colors.darkTextSecondary : colors.textSecondary}
              />
            </TouchableOpacity>
            <View style={styles.amountContainer}>
              <TextInput
                style={[
                  styles.amountInput,
                  styles.readOnlyInput,
                  isDark && {
                    backgroundColor: colors.dark.surface3,
                    borderColor: colors.dark.border,
                    color: colors.darkTextSecondary
                  }
                ]}
                placeholder="0.00"
                value={toAmount}
                editable={false}
                placeholderTextColor={isDark ? colors.darkTextSecondary : colors.lightGrey}
              />
            </View>
            <Text style={[
              styles.usdValue,
              isDark && { color: colors.darkTextSecondary }
            ]}>
              ≈ ${toAmount ? (parseFloat(toAmount) * (prices[toAsset.symbol] ?? 0)).toLocaleString() : '0.00'}
            </Text>
          </View>
        </View>

        {/* Advanced Settings */}
        <View style={[
          styles.advancedSettings,
          isDark && {
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            elevation: 4
          }
        ]}>
          <Text style={[
            styles.settingsTitle,
            isDark && { color: colors.darkText }
          ]}>Advanced Settings</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={[
                styles.settingLabel,
                isDark && { color: colors.darkText }
              ]}>Slippage Tolerance</Text>
              <Text style={[
                styles.settingDescription,
                isDark && { color: colors.darkTextSecondary }
              ]}>
                Maximum price difference you're willing to accept
              </Text>
            </View>
            <View style={styles.slippageButtons}>
              {[0.1, 0.5, 1.0].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.slippageButton,
                    slippageTolerance === value && styles.slippageButtonActive,
                    isDark && {
                      backgroundColor: slippageTolerance === value ?
                        colors.dark.primaryAccent : colors.dark.surface3,
                      borderColor: colors.dark.border
                    }
                  ]}
                  onPress={() => setSlippageTolerance(value)}
                >
                  <Text style={[
                    styles.slippageButtonText,
                    slippageTolerance === value && styles.slippageButtonTextActive,
                    isDark && {
                      color: slippageTolerance === value ?
                        colors.white : colors.darkTextSecondary
                    }
                  ]}>
                    {value}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={[
                styles.settingLabel,
                isDark && { color: colors.darkText }
              ]}>Price Alerts</Text>
              <Text style={[
                styles.settingDescription,
                isDark && { color: colors.darkTextSecondary }
              ]}>
                Get notified when rates change significantly
              </Text>
            </View>
            <Switch
              value={enablePriceAlerts}
              onValueChange={setEnablePriceAlerts}
              trackColor={{
                false: isDark ? colors.dark.surface3 : colors.extraLightGrey,
                true: isDark ? colors.dark.primaryAccent + '50' : 'rgba(30, 80, 200, 0.2)'
              }}
              thumbColor={enablePriceAlerts ?
                (isDark ? colors.dark.primaryAccent : colors.primary) :
                (isDark ? colors.darkTextSecondary : colors.lightGrey)
              }
            />
          </View>
        </View>

        {/* Transaction Summary */}
        {fromAmount && parseFloat(fromAmount) > 0 && (
          <View style={[
            styles.summaryCard,
            isDark && {
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              elevation: 4
            }
          ]}>
            <Text style={[
              styles.summaryTitle,
              isDark && { color: colors.darkText }
            ]}>Transaction Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={[
                styles.summaryLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>You Pay</Text>
              <Text style={[
                styles.summaryValue,
                isDark && { color: colors.darkText }
              ]}>{fromAmount} {fromAsset.symbol}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[
                styles.summaryLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>You Receive</Text>
              <Text style={[
                styles.summaryValue,
                isDark && { color: colors.darkText }
              ]}>{toAmount} {toAsset.symbol}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[
                styles.summaryLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>Exchange Rate</Text>
              <Text style={[
                styles.summaryValue,
                isDark && { color: colors.darkText }
              ]}>
                1 {fromAsset.symbol} = {(prices[toAsset.symbol] ?? 0) / (prices[fromAsset.symbol] ?? 1)} {toAsset.symbol}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[
                styles.summaryLabel,
                isDark && { color: colors.darkTextSecondary }
              ]}>Network Fee</Text>
              <Text style={[
                styles.summaryValue,
                isDark && { color: colors.darkText }
              ]}>$2.50</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Convert Button */}
      <View style={[
        styles.footer,
        isDark && {
          backgroundColor: colors.dark.surface1,
          borderTopColor: colors.dark.border
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.convertButton,
            (!fromAmount || isConverting) && styles.convertButtonDisabled,
            isDark && { opacity: (!fromAmount || isConverting) ? 0.5 : 1 }
          ]}
          onPress={() => {
            if (!fromAmount || parseFloat(fromAmount) <= 0) {
              Alert.alert('Invalid', 'Please enter a valid amount');
              return;
            }
            if (parseFloat(fromAmount) > fromAsset.balance) {
              Alert.alert('Insufficient Balance', 'You do not have enough balance');
              return;
            }
            setIsConverting(true);
            setTimeout(() => {
              setIsConverting(false);
              Alert.alert('Success', `Successfully converted ${fromAmount} ${fromAsset.symbol} to ${toAmount} ${toAsset.symbol}`);
            }, 2000);
          }}
          disabled={!fromAmount || isConverting}
        >
          <LinearGradient
            colors={isDark ?
              [colors.dark.primaryAccent, colors.dark.primaryAccent + '80'] :
              [colors.primary, colors.primaryDark || colors.primary]
            }
            style={[
              styles.convertButtonGradient,
              isDark && (!fromAmount || isConverting) && {
                opacity: 0.5
              }
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[
              styles.convertButtonText,
              isDark && {
                color: colors.white,
                opacity: (!fromAmount || isConverting) ? 0.7 : 1
              }
            ]}>
              {isConverting ? 'Converting...' : 'Convert Now'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Asset Pickers */}
      {showFromPicker && renderAssetPicker(
        ASSETS,
        fromAsset,
        (asset) => setFromAsset(asset),
        () => setShowFromPicker(false)
      )}
      {showToPicker && renderAssetPicker(
        ASSETS,
        toAsset,
        (asset) => setToAsset(asset),
        () => setShowToPicker(false)
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  backButton: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  historyButton: {
    padding: 8,
  },
  exchangeRateCard: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exchangeRateLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  exchangeRate: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 8,
  },
  rateDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateDetail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  positiveChange: {
    color: colors.success,
    fontWeight: '600',
  },
  conversionContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assetSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  assetSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  selectedAsset: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedAssetLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  selectedAssetName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectedAssetBalance: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  amountInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    fontSize: 16,
    color: colors.text,
  },
  maxButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  maxButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  usdValue: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  swapButton: {
    alignSelf: 'center',
    marginVertical: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  advancedSettings: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingLeft: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  slippageButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slippageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    marginRight: 8,
  },
  slippageButtonActive: {
    backgroundColor: colors.primary,
  },
  slippageButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  slippageButtonTextActive: {
    color: colors.white,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },
  convertButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertButtonDisabled: {
    backgroundColor: colors.lightGrey,
  },
  convertButtonGradient: {
    padding: 16,
    borderRadius: 12, // Increased for better visibility
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  convertButtonText: {
    fontSize: 16,
    fontWeight: '600', // Increased weight for better contrast
    color: colors.white,
  },
  assetPickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  assetPickerContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: 12, // Increased for consistency
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4, // Increased for better depth
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  assetList: {
    flex: 1,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    marginBottom: 8,
  },
  selectedAssetItem: {
    backgroundColor: colors.primary,
  },
  assetItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  assetBalance: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  assetItemRight: {
    alignItems: 'flex-end',
  },
  assetPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  assetPriceUSD: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  readOnlyInput: {
    color: colors.textSecondary,
  },
});
