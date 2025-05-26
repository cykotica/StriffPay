import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Copy, Share2, ChevronRight, QrCode } from 'lucide-react-native';
import Button from '@/components/Button';

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
  const [selectedCrypto, setSelectedCrypto] = useState(addresses[0]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  
  const optionsHeight = useRef(new Animated.Value(0)).current;
  const optionsOpacity = useRef(new Animated.Value(0)).current;

  const toggleCurrencyOptions = () => {
    if (showCurrencyOptions) {
      Animated.parallel([
        Animated.timing(optionsHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(optionsOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setShowCurrencyOptions(false));
    } else {
      setShowCurrencyOptions(true);
      Animated.parallel([
        Animated.timing(optionsHeight, {
          toValue: 180,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(optionsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleSelectCrypto = (crypto: typeof addresses[number]) => {
    setSelectedCrypto(crypto);
    toggleCurrencyOptions();
  };

  const handleCopyAddress = () => {
    Alert.alert(
      'Address Copied',
      'The address has been copied to your clipboard.',
      [{ text: 'OK' }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My ${selectedCrypto.name} address: ${selectedCrypto.address}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.header,
        { paddingTop: insets.top + layout.spacing.md }
      ]}>
        <Text style={styles.headerTitle}>Receive Crypto</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* QR Code */}
        <View style={styles.qrContainer}>
          <View style={styles.qrHeader}>
            <TouchableOpacity 
              style={styles.cryptoSelector}
              onPress={toggleCurrencyOptions}
            >
              <View style={[styles.cryptoIcon, { backgroundColor: selectedCrypto.color + '20' }]}>
                <Text style={[styles.cryptoIconText, { color: selectedCrypto.color }]}>
                  {selectedCrypto.symbol.charAt(0)}
                </Text>
              </View>
              <Text style={styles.cryptoName}>{selectedCrypto.name}</Text>
              <ChevronDown size={20} color={colors.grey} />
            </TouchableOpacity>
          </View>

          {/* Currency Options Dropdown */}
          {showCurrencyOptions && (
            <Animated.View 
              style={[
                styles.currencyOptions,
                { 
                  height: optionsHeight,
                  opacity: optionsOpacity,
                }
              ]}
            >
              {addresses.map(crypto => (
                <TouchableOpacity
                  key={crypto.id}
                  style={[
                    styles.currencyOption,
                    selectedCrypto.id === crypto.id && styles.selectedCurrencyOption
                  ]}
                  onPress={() => handleSelectCrypto(crypto)}
                >
                  <View style={[styles.currencyOptionIcon, { backgroundColor: crypto.color + '20' }]}>
                    <Text style={[styles.currencyOptionIconText, { color: crypto.color }]}>
                      {crypto.symbol.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.currencyOptionInfo}>
                    <Text style={styles.currencyOptionName}>{crypto.name}</Text>
                    <Text style={styles.currencyOptionSymbol}>{crypto.symbol}</Text>
                  </View>
                  {selectedCrypto.id === crypto.id && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          <View style={styles.qrCode}>
            <QrCode size={200} color={colors.primary} />
          </View>

          <Text style={styles.scanText}>
            Scan this QR code to receive {selectedCrypto.name}
          </Text>
        </View>

        {/* Address */}
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Your {selectedCrypto.name} Address</Text>
          <View style={styles.addressCard}>
            <Text style={styles.address}>{selectedCrypto.address}</Text>
            <View style={styles.addressActions}>
              <TouchableOpacity 
                style={styles.addressAction}
                onPress={handleCopyAddress}
              >
                <Copy size={20} color={colors.primary} />
                <Text style={styles.addressActionText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addressAction}
                onPress={handleShare}
              >
                <Share2 size={20} color={colors.primary} />
                <Text style={styles.addressActionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Request Specific Amount */}
        <View style={styles.requestContainer}>
          <Text style={styles.requestLabel}>Request Specific Amount (Optional)</Text>
          <View style={styles.amountContainer}>
            <TextInput
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              style={styles.amountInput}
              placeholderTextColor={colors.grey}
              keyboardType="decimal-pad"
            />
            <Text style={styles.amountSymbol}>{selectedCrypto.symbol}</Text>
          </View>
          <Text style={styles.amountValue}>
            ≈ ${amount ? (parseFloat(amount) * 45000).toFixed(2) : '0.00'}
          </Text>

          <Text style={styles.noteLabel}>Add Note (Optional)</Text>
          <TextInput
            placeholder="What's this payment for?"
            value={note}
            onChangeText={setNote}
            style={styles.noteInput}
            placeholderTextColor={colors.grey}
            multiline
          />

          <Button
            title="Generate Request QR"
            onPress={() => Alert.alert('QR Generated', 'Your payment request QR code has been updated.')}
            style={styles.generateButton}
          />
        </View>

        {/* Network Options */}
        <View style={styles.networkContainer}>
          <TouchableOpacity style={styles.networkSelector}>
            <View>
              <Text style={styles.networkLabel}>Network</Text>
              <Text style={styles.networkName}>
                {selectedCrypto.id === '1' ? 'Bitcoin Mainnet' : 
                 selectedCrypto.id === '2' ? 'Ethereum Mainnet' : 'Tron Network'}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.grey} />
          </TouchableOpacity>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityNoticeText}>
            This address can only receive {selectedCrypto.name}. 
            Sending any other asset to this address may result in permanent loss of funds.
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
    ...layout.shadow.sm,
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
    ...layout.shadow.sm,
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
  currencyOptions: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    marginBottom: layout.spacing.md,
    overflow: 'hidden',
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey,
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
  currencyOptionIconText: {
    fontFamily: fonts.bold,
    fontSize: fonts.md,
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
    ...layout.shadow.sm,
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
    ...layout.shadow.sm,
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
    ...layout.shadow.sm,
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
  },
  securityNoticeText: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.warning,
    lineHeight: 18,
  },
});