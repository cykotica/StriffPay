import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  TextInput,
  Share,
  Alert,
  Animated,
  Platform,
  Pressable,
  ActivityIndicator,
  BackHandler
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { ChevronDown, Copy, Share2, ChevronRight, QrCode } from 'lucide-react-native';
import Button from '@/components/Button';
import { useDarkMode } from './more';
import { fetchCoinGeckoPrices } from '../../utils/marketData';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

// Mock addresses
const addresses = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
    color: colors.bitcoin,
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    color: colors.ethereum,
  },
  {
    id: '3',
    name: 'Tether',
    symbol: 'USDT',
    address: 'TKrF3JcEEV8RhqRADyLR6E36MPVZqYExDB',
    color: colors.tether,
  },
];

export default function ReceiveScreen() {
  const insets = useSafeAreaInsets();
  const { darkMode } = useDarkMode();
  const [selectedCrypto, setSelectedCrypto] = useState<string>(addresses[0].id);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const optionsHeight = useRef(new Animated.Value(0)).current;
  const optionsOpacity = useRef(new Animated.Value(0)).current;

  const selectedCryptoInfo = addresses.find(c => c.id === selectedCrypto);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showCurrencyOptions) {
        toggleCurrencyOptions();
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
      // Cleanup animations
      optionsHeight.setValue(0);
      optionsOpacity.setValue(0);
    };
  }, [showCurrencyOptions]);

  const generateQR = () => {
    if (selectedCryptoInfo) {
      const qrData = {
        address: selectedCryptoInfo.address,
        amount: amount,
        note: note,
      };
      setQrValue(JSON.stringify(qrData));
    }
  };

  const toggleCurrencyOptions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (showCurrencyOptions) {
      Animated.parallel([
        Animated.timing(optionsHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(optionsOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start(() => setShowCurrencyOptions(false));
    } else {
      setShowCurrencyOptions(true);
      Animated.parallel([
        Animated.timing(optionsHeight, {
          toValue: 180,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(optionsOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleSelectCrypto = async (crypto: typeof addresses[number]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCrypto(crypto.id);
    toggleCurrencyOptions();
  };

  const handleCopyAddress = async () => {
    try {
      await Clipboard.setStringAsync(selectedCryptoInfo?.address || '');
      Alert.alert(
        'Address Copied',
        'The address has been copied to your clipboard.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to copy address to clipboard.');
    }
  };

  const handleShare = async () => {
    if (!selectedCryptoInfo) return;
    
    try {
      const result = await Share.share({
        message: `My ${selectedCryptoInfo.name} address: ${selectedCryptoInfo.address}`,
        title: `${selectedCryptoInfo.name} Address`,
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share address.');
    }
  };

  useEffect(() => {
    async function loadPrices() {
      setLoadingPrices(true);
      setPriceError(null);
      const symbols = addresses.map(a => a.symbol);
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

  return (
    <View style={[
      styles.container,
      darkMode && { backgroundColor: colors.dark.surface1 }
    ]}> 
      <View style={[
        styles.header,
        { paddingTop: insets.top + layout.spacing.md },
        darkMode && { 
          backgroundColor: colors.dark.surface2,
          borderColor: colors.dark.border 
        }
      ]}>
        <Text style={[
          styles.headerTitle,
          darkMode && { color: colors.darkText }
        ]}>Receive</Text>
      </View>

      <ScrollView 
        style={darkMode && { backgroundColor: colors.dark.surface1 }}
        contentContainerStyle={[
          styles.scrollContent,
          darkMode && { backgroundColor: colors.dark.surface1 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* QR Code Section */}
        <View style={[
          styles.qrContainer,
          darkMode && { 
            backgroundColor: colors.dark.surface2,
            borderColor: colors.dark.border,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            elevation: 4
          }
        ]}>
          <View style={styles.qrHeader}>
            {selectedCryptoInfo && (
              <TouchableOpacity 
                style={styles.cryptoSelector}
                onPress={toggleCurrencyOptions}
                accessibilityLabel={`Select cryptocurrency, currently ${selectedCryptoInfo.name}`}
                accessibilityHint="Opens a list of available cryptocurrencies"
              >
                <View style={[
                  styles.cryptoIcon,
                  { backgroundColor: selectedCryptoInfo.color + '20' }
                ]}>
                  <Text style={[
                    styles.cryptoIconText,
                    { color: selectedCryptoInfo.color }
                  ]}>{selectedCryptoInfo.symbol.charAt(0)}</Text>
                </View>
                <Text style={[
                  styles.cryptoName,
                  darkMode && { color: colors.darkText }
                ]}>{selectedCryptoInfo.name}</Text>
                <ChevronDown 
                  size={20} 
                  color={darkMode ? colors.darkTextSecondary : colors.grey} 
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={[
            styles.qrWrapper,
            darkMode && {
              backgroundColor: colors.dark.surface3,
              borderColor: colors.dark.border,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            }
          ]}>
            <QRCode 
              value={qrValue || selectedCryptoInfo?.address || ''}
              size={200}
              backgroundColor={darkMode ? colors.dark.surface3 : colors.white}
              color={darkMode ? colors.darkText : colors.text}
            />
          </View>
          <Text style={[
            styles.scanText,
            darkMode && { color: colors.darkTextSecondary }
          ]}>Scan QR code to receive payment</Text>
        </View>

        {/* Currency Options Modal */}
        {showCurrencyOptions && (
          <Pressable 
            style={[
              styles.modalOverlay,
              darkMode && { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
            ]}
            onPress={toggleCurrencyOptions}
          >
            <Animated.View 
              style={[
                styles.currencyOptions,
                {
                  height: optionsHeight,
                  opacity: optionsOpacity,
                },
                darkMode && {
                  backgroundColor: colors.dark.surface2,
                  borderColor: colors.dark.border,
                  shadowColor: 'rgba(0, 0, 0, 0.3)',
                }
              ]}
            >
              <Pressable style={{ flex: 1 }} onPress={e => e.stopPropagation()}>
                {addresses.map((crypto) => (
                  <TouchableOpacity
                    key={crypto.id}
                    style={[
                      styles.currencyOption,
                      crypto.id === selectedCrypto && styles.selectedCurrencyOption,
                      darkMode && {
                        borderBottomColor: colors.dark.border,
                        backgroundColor: crypto.id === selectedCrypto ? 
                          colors.dark.surface3 : colors.dark.surface2
                      }
                    ]}
                    onPress={() => handleSelectCrypto(crypto)}
                    accessibilityRole="radio"
                    accessibilityLabel={`Select ${crypto.name}`}
                    accessibilityState={{ selected: crypto.id === selectedCrypto }}
                  >
                    <View style={[
                      styles.currencyOptionIcon,
                      { backgroundColor: crypto.color + '20' }
                    ]}>
                      <Text style={{ color: crypto.color }}>{crypto.symbol.charAt(0)}</Text>
                    </View>
                    <View style={styles.currencyOptionInfo}>
                      <Text style={[
                        styles.currencyOptionName,
                        darkMode && { color: colors.darkText }
                      ]}>{crypto.name}</Text>
                      <Text style={[
                        styles.currencyOptionSymbol,
                        darkMode && { color: colors.darkTextSecondary }
                      ]}>{crypto.symbol}</Text>
                    </View>
                    {crypto.id === selectedCrypto && (
                      <View style={[
                        styles.selectedIndicator,
                        darkMode && { backgroundColor: colors.dark.primaryAccent }
                      ]} />
                    )}
                  </TouchableOpacity>
                ))}
              </Pressable>
            </Animated.View>
          </Pressable>
        )}

        {/* Address Section with accessibility */}
        <View style={styles.addressContainer}>
          <Text style={[
            styles.addressLabel,
            darkMode && { color: colors.darkText }
          ]}>Wallet Address</Text>
          <View style={[
            styles.addressCard,
            darkMode && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              elevation: 4
            }
          ]}>
            <Text 
              style={[
                styles.address,
                darkMode && { color: colors.darkText }
              ]}
              selectable={true}
              accessibilityLabel={`${selectedCryptoInfo?.name} wallet address`}
            >
              {selectedCryptoInfo?.address}
            </Text>
            <View style={[
              styles.addressActions,
              darkMode && { borderTopColor: colors.dark.border }
            ]}>
              <TouchableOpacity 
                style={styles.addressAction}
                onPress={handleCopyAddress}
                accessibilityLabel={`Copy ${selectedCryptoInfo?.name} address`}
                accessibilityHint="Copies the wallet address to clipboard"
              >
                <Copy 
                  size={20} 
                  color={darkMode ? colors.dark.primaryAccent : colors.primary} 
                />
                <Text style={[
                  styles.addressActionText,
                  darkMode && { color: colors.dark.primaryAccent }
                ]}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addressAction}
                onPress={handleShare}
                accessibilityLabel={`Share ${selectedCryptoInfo?.name} address`}
                accessibilityHint="Opens sharing options for the wallet address"
              >
                <Share2 
                  size={20} 
                  color={darkMode ? colors.dark.primaryAccent : colors.primary} 
                />
                <Text style={[
                  styles.addressActionText,
                  darkMode && { color: colors.dark.primaryAccent }
                ]}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Request Amount Section */}
        <View style={styles.requestContainer}>
          <Text style={[
            styles.requestLabel,
            darkMode && { color: colors.darkText }
          ]}>Request Amount</Text>
          <View style={[
            styles.amountContainer,
            darkMode && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              elevation: 4
            }
          ]}>
            <TextInput
              style={[
                styles.amountInput,
                darkMode && { color: colors.darkText }
              ]}
              placeholder="0.00"
              placeholderTextColor={darkMode ? colors.darkTextSecondary : colors.textSecondary}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              accessibilityLabel={`Enter amount in ${selectedCryptoInfo?.symbol}`}
              accessibilityHint="Enter the amount you want to request"
            />
            <Text style={[
              styles.amountSymbol,
              darkMode && { color: colors.darkTextSecondary }
            ]}>{selectedCryptoInfo?.symbol}</Text>
          </View>

          <View style={styles.priceContainer}>
            {loadingPrices ? (
              <ActivityIndicator 
                size="small" 
                color={darkMode ? colors.dark.primaryAccent : colors.primary} 
              />
            ) : priceError ? (
              <Text style={[
                styles.errorText,
                darkMode && { color: colors.errorLight }
              ]}>{priceError}</Text>
            ) : (
              <Text style={[
                styles.amountValue,
                darkMode && { color: colors.darkTextSecondary }
              ]}>
                ≈ ${amount && prices[selectedCryptoInfo?.symbol || ''] 
                  ? (parseFloat(amount) * prices[selectedCryptoInfo?.symbol || '']).toFixed(2) 
                  : '0.00'} USD
              </Text>
            )}
          </View>

          <Text style={[
            styles.noteLabel,
            darkMode && { color: colors.darkText }
          ]}>Add Note (Optional)</Text>
          <TextInput
            style={[
              styles.noteInput,
              darkMode && { 
                backgroundColor: colors.dark.surface2,
                borderColor: colors.dark.border,
                color: colors.darkText 
              }
            ]}
            placeholder="Enter note..."
            placeholderTextColor={darkMode ? colors.darkTextSecondary : colors.textSecondary}
            multiline
            value={note}
            onChangeText={setNote}
          />

          <Button
            title="Generate Payment QR"
            onPress={generateQR}
            style={styles.generateButton}
            variant="primary"
            darkMode={darkMode}
          />
        </View>

        {/* Network Section */}
        <View style={styles.networkContainer}>
          <View style={[
            styles.networkSelector,
            darkMode && { 
              backgroundColor: colors.dark.surface2,
              borderColor: colors.dark.border 
            }
          ]}>
            <View>
              <Text style={[
                styles.networkLabel,
                darkMode && { color: colors.darkTextSecondary }
              ]}>Network</Text>
              <Text style={[
                styles.networkName,
                darkMode && { color: colors.darkText }
              ]}>
                {selectedCryptoInfo?.name} Network
              </Text>
            </View>
            <ChevronRight 
              size={20} 
              color={darkMode ? colors.darkTextSecondary : colors.grey} 
            />
          </View>
        </View>

        {/* Security Notice */}
        <View style={[
          styles.securityNotice,
          darkMode && { 
            backgroundColor: colors.warning + '10',
            borderWidth: 1,
            borderColor: colors.warning + '30'
          }
        ]}>
          <Text style={[
            styles.securityNoticeText,
            darkMode && { 
              color: colors.warning,
              opacity: 0.9
            }
          ]}>
            ⚠️ Only send {selectedCryptoInfo?.symbol} to this address. Sending any other assets may result in permanent loss.
          </Text>
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
    borderBottomColor: colors.lightGrey,
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
  qrContainer: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.extraLightGrey,
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
  qrHeader: {
    width: '100%',
    marginBottom: layout.spacing.md,
  },
  cryptoSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.sm,
    alignSelf: 'center',
  },
  cryptoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.sm,
  },
  cryptoIconText: {
    fontFamily: fonts.bold,
    fontSize: fonts.md,
  },
  cryptoName: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.lg,
    color: colors.text,
    marginRight: layout.spacing.sm,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  currencyOptions: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    left: layout.spacing.xl,
    right: layout.spacing.xl,
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  selectedCurrencyOption: {
    backgroundColor: colors.extraLightGrey,
  },
  currencyOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  currencyOptionInfo: {
    flex: 1,
  },
  currencyOptionName: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.md,
    color: colors.text,
  },
  currencyOptionSymbol: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  selectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  qrCode: {
    margin: layout.spacing.xl,
    padding: layout.spacing.lg,
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    borderWidth: 1,
    borderColor: colors.extraLightGrey,
    ...layout.shadow.sm,
  },
  qrWrapper: {
    padding: layout.spacing.lg,
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    marginVertical: layout.spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  scanText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
    textAlign: 'center',
  },
  addressContainer: {
    marginTop: layout.spacing.xl,
  },
  addressLabel: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    padding: layout.spacing.lg,
    ...layout.shadow.sm,
  },
  address: {
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  addressActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.extraLightGrey,
    paddingTop: layout.spacing.md,
  },
  addressAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: layout.spacing.xl,
  },
  addressActionText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.primary,
    marginLeft: layout.spacing.xs,
  },
  requestContainer: {
    marginTop: layout.spacing.xl,
  },
  requestLabel: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    padding: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.extraLightGrey,
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
  amountInput: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: fonts.xl,
    color: colors.text,
  },
  amountSymbol: {
    fontFamily: fonts.medium,
    fontSize: fonts.lg,
    color: colors.textSecondary,
  },
  amountValue: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.textSecondary,
    marginTop: layout.spacing.sm,
    marginBottom: layout.spacing.lg,
  },
  noteLabel: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  noteInput: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    padding: layout.spacing.md,
    height: 100,
    textAlignVertical: 'top',
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.lg,
    borderWidth: 1,
    borderColor: colors.extraLightGrey,
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
  generateButton: {
    marginBottom: layout.spacing.xl,
  },
  networkContainer: {
    marginBottom: layout.spacing.xl,
  },
  networkSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    padding: layout.spacing.lg,
    borderWidth: 1,
    borderColor: colors.extraLightGrey,
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
  networkLabel: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xxs,
  },
  networkName: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
  },
  securityNotice: {
    padding: layout.spacing.md,
    backgroundColor: colors.warning + '20',
    borderRadius: layout.radius.md,
    marginBottom: layout.spacing.xl,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  securityNoticeText: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.warning,
    lineHeight: 18,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: fonts.sm,
    color: colors.error,
    textAlign: 'center',
  },
  priceContainer: {
    height: 24,
    justifyContent: 'center',
    marginTop: layout.spacing.xs,
    marginBottom: layout.spacing.lg,
  },
});