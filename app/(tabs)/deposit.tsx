import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Clipboard,
} from 'react-native';
// Workaround for React 19+ compatibility with CJS libraries
// Use typeof to help TypeScript understand the type for JSX
const QRCode: React.ComponentType<any> = require('react-native-qrcode-svg').default || require('react-native-qrcode-svg');
// Use the workaround for Picker.Item as well
const PickerModule = require('@react-native-picker/picker');
const Picker = PickerModule.Picker;
const PickerItem = PickerModule.Item;
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';

// Types
type Crypto = 'BTC' | 'ETH' | 'USDT' | 'USDC';
type Method = 'onchain' | 'binance';

const DEPOSIT_ADDRESSES: Record<Crypto, Record<Method, string>> = {
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

const DepositScreen: React.FC = () => {
  const [crypto, setCrypto] = useState<Crypto>('BTC');
  const [method, setMethod] = useState<Method>('onchain');
  const router = useRouter();

  const depositAddress = DEPOSIT_ADDRESSES[crypto][method];

  const handleCopy = () => {
    Clipboard.setString(depositAddress);
    Alert.alert('Copied', 'Deposit address copied to clipboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Deposit</Text>

      {/* Token Picker */}
      <Text style={styles.label}>Choose Asset</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={crypto}
          onValueChange={(value: string) => setCrypto(value as Crypto)}
          style={styles.picker}
        >
          <PickerItem label="Bitcoin (BTC)" value="BTC" />
          <PickerItem label="Ethereum (ETH)" value="ETH" />
          <PickerItem label="Tether (USDT)" value="USDT" />
          <PickerItem label="USD Coin (USDC)" value="USDC" />
        </Picker>
      </View>

      {/* Method Switch */}
      <Text style={styles.label}>Select Deposit Method</Text>
      <View style={styles.methodRow}>
        <TouchableOpacity
          style={[styles.methodBtn, method === 'onchain' && styles.active]}
          onPress={() => setMethod('onchain')}
        >
          <Text style={[styles.methodText, method === 'onchain' && { color: colors.white }]}>On-Chain</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.methodBtn, method === 'binance' && styles.active]}
          onPress={() => setMethod('binance')}
        >
          <Text style={[styles.methodText, method === 'binance' && { color: colors.white }]}>Binance Pay</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode value={depositAddress} size={180} />
      </View>

      {/* Address Display */}
      <Text style={styles.label}>Deposit Address</Text>
      <View style={styles.addressBox}>
        <Text style={styles.addressText} numberOfLines={1} selectable>
          {depositAddress}
        </Text>
        <TouchableOpacity onPress={handleCopy}>
          <MaterialCommunityIcons name="content-copy" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.instructions}>
        Send only {crypto} to this address. Use correct network. Deposits will reflect after
        sufficient confirmations.
      </Text>
    </ScrollView>
  );
};

export default DepositScreen;

const styles = StyleSheet.create({
  container: {
    padding: layout.spacing.xl,
    backgroundColor: colors.white,
    flexGrow: 1,
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
});
