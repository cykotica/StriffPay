import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Scan, Users as Users2, Clock, ArrowRight } from 'lucide-react-native';
import Button from '@/components/Button';
import { useDarkMode } from './more';
import { fetchCoinGeckoPrices } from '../../utils/marketData';
import TransactionItem from '@/components/TransactionItem';
import TokenCard from '@/components/TokenCard';
import { router } from 'expo-router';

// Mock recent recipients
const recentRecipients = [
  {
    id: '1',
    name: 'John Smith',
    address: '0x1a2...7d8e',
    initial: 'JS',
    color: colors.secondary,
  },
  {
    id: '2',
    name: 'Coffee Shop',
    address: '0x3b4...9f0g',
    initial: 'CS',
    color: colors.accent,
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    address: '0x5c6...1h2i',
    initial: 'SJ',
    color: colors.warning,
  },
];

// Mock crypto options
const cryptoOptions = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', balance: 0.45, color: colors.bitcoin },
  { id: '2', name: 'Ethereum', symbol: 'ETH', balance: 3.25, color: colors.ethereum },
  { id: '3', name: 'Tether', symbol: 'USDT', balance: 350, color: colors.tether },
];

export default function SendScreen() {
  const { darkMode } = useDarkMode();
  const insets = useSafeAreaInsets();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0]);
  const [fee, setFee] = useState('0.0001 BTC ($4.50)');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrices() {
      setLoadingPrices(true);
      setPriceError(null);
      const symbols = cryptoOptions.map(c => c.symbol);
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

  const handleSend = () => {
    if (step === 1) {
      // Validate input
      if (!recipient.trim()) {
        Alert.alert('Error', 'Please enter a recipient address');
        return;
      }
      if (!amount.trim() || isNaN(parseFloat(amount))) {
        Alert.alert('Error', 'Please enter a valid amount');
        return;
      }
      setStep(2);
    } else {
      // Process transaction
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Transaction Sent',
          `You have sent ${amount} ${selectedCrypto.symbol} to ${recipient}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form and go back to step 1
                setRecipient('');
                setAmount('');
                setNote('');
                setStep(1);
              },
            },
          ]
        );
      }, 2000);
    }
  };

  const handleSelectRecipient = (rec: { id: string; name: string; address: string; initial: string; color: string }) => {
    setRecipient(rec.address);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, darkMode && { backgroundColor: colors.dark.surface1 }]}> 
        <View style={[
          styles.header,
          { paddingTop: insets.top + layout.spacing.md },
          darkMode && { 
            backgroundColor: colors.dark.surface2,
            borderBottomColor: colors.dark.border 
          }
        ]}>
          <Text style={[styles.headerTitle, darkMode && { color: colors.darkText }]}>
            {step === 1 ? 'Send Crypto' : 'Confirm Transaction'}
          </Text>
          {step === 2 && (
            <TouchableOpacity 
              style={[styles.backButton, darkMode && { backgroundColor: colors.dark.surface3 }]}
              onPress={() => setStep(1)}
            >
              <Text style={[styles.backButtonText, darkMode && { color: colors.dark.primaryAccent }]}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, darkMode && { backgroundColor: colors.dark.surface1 }]}>
          {step === 1 ? (
            <>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, darkMode && { color: colors.darkText }]}>Select Crypto</Text>
                <TouchableOpacity style={[
                  styles.cryptoSelector,
                  darkMode && { 
                    backgroundColor: colors.dark.surface2,
                    borderColor: colors.dark.border
                  }
                ]}>
                  <View style={[styles.cryptoIcon, { backgroundColor: selectedCrypto.color + '20' }]}>
                    <Text style={[styles.cryptoIconText, { color: selectedCrypto.color }]}>
                      {selectedCrypto.symbol.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.cryptoInfo}>
                    <Text style={[styles.cryptoName, darkMode && { color: colors.darkText }]}>{selectedCrypto.name}</Text>
                    <Text style={[styles.cryptoBalance, darkMode && { color: colors.darkTextSecondary }]}>
                      Balance: {selectedCrypto.balance} {selectedCrypto.symbol}
                    </Text>
                  </View>
                  <ChevronDown size={20} color={darkMode ? colors.darkTextSecondary : colors.grey} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, darkMode && { color: colors.darkText }]}>Recipient</Text>
                <View style={[
                  styles.recipientInputContainer,
                  darkMode && { 
                    backgroundColor: colors.dark.surface2,
                    borderColor: colors.dark.border
                  }
                ]}>
                  <TextInput
                    placeholder="Enter address or username"
                    value={recipient}
                    onChangeText={setRecipient}
                    style={[styles.recipientInput, darkMode && { color: colors.darkText }]}
                    placeholderTextColor={darkMode ? colors.darkTextSecondary : colors.grey}
                  />
                  <TouchableOpacity style={styles.scanButton}>
                    <Scan size={20} color={darkMode ? colors.dark.primaryAccent : colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.recentsContainer}>
                <View style={styles.recentsHeader}>
                  <View style={styles.recentsHeaderIcon}>
                    <Clock size={14} color={darkMode ? colors.darkTextSecondary : colors.grey} />
                  </View>
                  <Text style={[styles.recentsHeaderText, darkMode && { color: colors.darkTextSecondary }]}>Recent</Text>
                </View>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recentsList}
                >
                  {recentRecipients.map((rec) => (
                    <TouchableOpacity
                      key={rec.id}
                      style={styles.recentItem}
                      onPress={() => handleSelectRecipient(rec)}
                    >
                      <View style={[styles.recentInitial, { backgroundColor: rec.color }]}>
                        <Text style={styles.recentInitialText}>{rec.initial}</Text>
                      </View>
                      <Text style={[styles.recentName, darkMode && { color: colors.darkText }]}>{rec.name}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={styles.contactsButton}>
                    <View style={[styles.contactsIcon, darkMode && { backgroundColor: colors.dark.surface3 }]}>
                      <Users2 size={20} color={darkMode ? colors.dark.primaryAccent : colors.primary} />
                    </View>
                    <Text style={[styles.contactsText, darkMode && { color: colors.dark.primaryAccent }]}>Contacts</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, darkMode && { color: colors.darkText }]}>Amount</Text>
                <View style={[
                  styles.amountContainer,
                  darkMode && { 
                    backgroundColor: colors.dark.surface2,
                    borderColor: colors.dark.border
                  }
                ]}>
                  <TextInput
                    placeholder="0.00"
                    value={amount}
                    onChangeText={setAmount}
                    style={[styles.amountInput, darkMode && { color: colors.darkText }]}
                    placeholderTextColor={darkMode ? colors.darkTextSecondary : colors.grey}
                    keyboardType="decimal-pad"
                  />
                  <Text style={[styles.amountSymbol, darkMode && { color: colors.darkTextSecondary }]}>
                    {selectedCrypto.symbol}
                  </Text>
                </View>
                <View style={styles.amountActions}>
                  <TouchableOpacity 
                    style={[
                      styles.amountActionButton,
                      darkMode && { 
                        backgroundColor: colors.dark.surface3,
                        borderColor: colors.dark.border
                      }
                    ]}
                    onPress={() => setAmount('0.1')}
                  >
                    <Text style={[styles.amountActionText, darkMode && { color: colors.darkText }]}>0.1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.amountActionButton,
                      darkMode && { 
                        backgroundColor: colors.dark.surface3,
                        borderColor: colors.dark.border
                      }
                    ]}
                    onPress={() => setAmount('0.2')}
                  >
                    <Text style={[styles.amountActionText, darkMode && { color: colors.darkText }]}>0.2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.amountActionButton,
                      darkMode && { 
                        backgroundColor: colors.dark.surface3,
                        borderColor: colors.dark.border
                      }
                    ]}
                    onPress={() => setAmount('0.5')}
                  >
                    <Text style={[styles.amountActionText, darkMode && { color: colors.darkText }]}>0.5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.maxButton, darkMode && { backgroundColor: colors.dark.primaryAccent }]}
                    onPress={() => setAmount('0.45')}
                  >
                    <Text style={[styles.maxButtonText, darkMode && { color: colors.white }]}>MAX</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.amountValue, darkMode && { color: colors.darkTextSecondary }]}>
                  {loadingPrices ? '...' : `≈ $${amount ? (parseFloat(amount) * (prices[selectedCrypto.symbol] ?? 0)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}`}
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, darkMode && { color: colors.darkText }]}>Note (Optional)</Text>
                <TextInput
                  placeholder="Add a note for this transaction"
                  value={note}
                  onChangeText={setNote}
                  style={[
                    styles.noteInput,
                    darkMode && { 
                      backgroundColor: colors.dark.surface2,
                      borderColor: colors.dark.border,
                      color: colors.darkText
                    }
                  ]}
                  placeholderTextColor={darkMode ? colors.darkTextSecondary : colors.grey}
                  multiline
                />
              </View>
            </>
          ) : (
            <View style={styles.confirmationContainer}>
              <View style={[
                styles.confirmationCard,
                darkMode && { 
                  backgroundColor: colors.dark.surface2,
                  borderColor: colors.dark.border
                }
              ]}>
                <Text style={[styles.confirmationTitle, darkMode && { color: colors.darkText }]}>Transaction Details</Text>
                
                <View style={styles.confirmationItem}>
                  <Text style={[styles.confirmationLabel, darkMode && { color: colors.darkTextSecondary }]}>Sending</Text>
                  <View style={styles.confirmationValueContainer}>
                    <Text style={[styles.confirmationValue, darkMode && { color: colors.darkText }]}>
                      {amount} {selectedCrypto.symbol}
                    </Text>
                    <Text style={[styles.confirmationSubvalue, darkMode && { color: colors.darkTextSecondary }]}>
                      ≈ ${amount ? (parseFloat(amount) * 45000).toFixed(2) : '0.00'}
                    </Text>
                  </View>
                </View>
                
                <View style={[styles.confirmationItem, darkMode && { borderBottomColor: colors.dark.border }]}>
                  <Text style={[styles.confirmationLabel, darkMode && { color: colors.darkTextSecondary }]}>To</Text>
                  <View style={styles.confirmationValueContainer}>
                    <Text style={[styles.confirmationValue, darkMode && { color: colors.darkText }]}>
                      {recipient.length > 15 ? 
                        recipient.substring(0, 6) + '...' + 
                        recipient.substring(recipient.length - 4) : 
                        recipient
                      }
                    </Text>
                  </View>
                </View>
                
                <View style={[styles.confirmationItem, darkMode && { borderBottomColor: colors.dark.border }]}>
                  <Text style={[styles.confirmationLabel, darkMode && { color: colors.darkTextSecondary }]}>Network Fee</Text>
                  <View style={styles.confirmationValueContainer}>
                    <Text style={[styles.confirmationValue, darkMode && { color: colors.darkText }]}>{fee}</Text>
                  </View>
                </View>

                {note ? (
                  <View style={[styles.confirmationItem, darkMode && { borderBottomColor: colors.dark.border }]}>
                    <Text style={[styles.confirmationLabel, darkMode && { color: colors.darkTextSecondary }]}>Note</Text>
                    <View style={styles.confirmationValueContainer}>
                      <Text style={[styles.confirmationValue, darkMode && { color: colors.darkText }]}>{note}</Text>
                    </View>
                  </View>
                ) : null}

                <View style={[styles.totalContainer, darkMode && { borderTopColor: colors.dark.border }]}>
                  <Text style={[styles.totalLabel, darkMode && { color: colors.darkText }]}>Total Amount</Text>
                  <Text style={[styles.totalValue, darkMode && { color: colors.darkText }]}>
                    ≈ ${amount ? ((parseFloat(amount) + 0.0001) * 45000).toFixed(2) : '0.00'}
                  </Text>
                  <Text style={[styles.totalValueUsd, darkMode && { color: colors.darkTextSecondary }]}>
                    {amount ? (parseFloat(amount) + 0.0001).toFixed(4) : '0.0000'} {selectedCrypto.symbol}                  
                  </Text>
                </View>
              </View>
              
              <View style={[styles.securityNotice, darkMode && { backgroundColor: colors.dark.surface2 + '20' }]}>
                <Text style={[styles.securityNoticeText, darkMode && { color: colors.warning }]}>
                  Double-check the recipient address before confirming. 
                  Cryptocurrency transactions cannot be reversed once they are sent.
                </Text>
              </View>
            </View>
          )}

          <Button
            title={step === 1 ? "Continue" : "Confirm and Send"}
            onPress={handleSend}
            loading={isLoading}
            style={styles.button}
            variant="primary"
            darkMode={darkMode}
          />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
  scrollContent: ViewStyle;
  formGroup: ViewStyle;
  formLabel: TextStyle;
  cryptoSelector: ViewStyle;
  cryptoIcon: ViewStyle;
  cryptoIconText: TextStyle;
  cryptoInfo: ViewStyle;
  cryptoName: TextStyle;
  cryptoBalance: TextStyle;
  recipientInputContainer: ViewStyle;
  recipientInput: TextStyle;
  scanButton: ViewStyle;
  recentsContainer: ViewStyle;
  recentsHeader: ViewStyle;
  recentsHeaderIcon: ViewStyle;
  recentsHeaderText: TextStyle;
  recentsList: ViewStyle;
  recentItem: ViewStyle;
  recentInitial: ViewStyle;
  recentInitialText: TextStyle;
  recentName: TextStyle;
  contactsButton: ViewStyle;
  contactsIcon: ViewStyle;
  contactsText: TextStyle;
  amountContainer: ViewStyle;
  amountInput: TextStyle;
  amountSymbol: TextStyle;
  amountActions: ViewStyle;
  amountActionButton: ViewStyle;
  amountActionText: TextStyle;
  maxButton: ViewStyle;
  maxButtonText: TextStyle;
  amountValue: TextStyle;
  noteInput: TextStyle;
  confirmationContainer: ViewStyle;
  confirmationCard: ViewStyle;
  confirmationTitle: TextStyle;
  confirmationItem: ViewStyle;
  confirmationLabel: TextStyle;
  confirmationValueContainer: ViewStyle;
  confirmationValue: TextStyle;
  confirmationSubvalue: TextStyle;
  totalContainer: ViewStyle;
  totalLabel: TextStyle;
  totalValue: TextStyle;
  totalValueUsd: TextStyle;
  button: ViewStyle;
  securityNotice: ViewStyle;
  securityNoticeText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.extraLightGrey,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  backButton: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.radius.md,
    backgroundColor: colors.extraLightGrey,
  },
  backButtonText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: layout.spacing.xl,
    paddingVertical: layout.spacing.xl,
    paddingBottom: layout.spacing.xxxl,
  },
  formGroup: {
    marginBottom: layout.spacing.xl,
  },
  formLabel: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  cryptoSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    padding: layout.spacing.md,
    ...layout.shadow.sm,
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  cryptoIconText: {
    fontFamily: fonts.bold,
    fontSize: fonts.lg,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.md,
    color: colors.text,
  },
  cryptoBalance: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  recipientInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    padding: layout.spacing.md,
    ...layout.shadow.sm,
  },
  recipientInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.text,
    padding: layout.spacing.sm,
  },
  scanButton: {
    padding: layout.spacing.sm,
  },
  recentsContainer: {
    marginBottom: layout.spacing.xl,
  },
  recentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  recentsHeaderIcon: {
    marginRight: layout.spacing.xs,
  },
  recentsHeaderText: {
    fontFamily: fonts.medium,
    fontSize: fonts.sm,
    color: colors.grey,
  },
  recentsList: {
    paddingBottom: layout.spacing.sm,
  },
  recentItem: {
    alignItems: 'center',
    marginRight: layout.spacing.lg,
  },
  recentInitial: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.xs,
  },
  recentInitialText: {
    fontFamily: fonts.bold,
    fontSize: fonts.lg,
    color: colors.white,
  },
  recentName: {
    fontFamily: fonts.medium,
    fontSize: fonts.sm,
    color: colors.text,
  },
  contactsButton: {
    alignItems: 'center',
  },
  contactsIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.extraLightGrey,
    marginBottom: layout.spacing.xs,
  },
  contactsText: {
    fontFamily: fonts.medium,
    fontSize: fonts.sm,
    color: colors.primary,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    padding: layout.spacing.md,
    ...layout.shadow.sm,
    marginBottom: layout.spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fonts.xl,
    color: colors.text,
  },
  amountSymbol: {
    fontFamily: fonts.medium,
    fontSize: fonts.lg,
    color: colors.textSecondary,
    marginLeft: layout.spacing.sm,
  },
  amountActions: {
    flexDirection: 'row',
    marginBottom: layout.spacing.sm,
  },
  amountActionButton: {
    flex: 1,
    backgroundColor: colors.extraLightGrey,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    marginHorizontal: layout.spacing.xs,
  },
  amountActionText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
  },
  maxButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    marginHorizontal: layout.spacing.xs,
  },
  maxButtonText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.white,
  },
  amountValue: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
    textAlign: 'right',
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
    ...layout.shadow.sm,
  },
  confirmationContainer: {
    marginBottom: layout.spacing.xl,
  },
  confirmationCard: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.xl,
    ...layout.shadow.sm,
  },
  confirmationTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.lg,
    color: colors.text,
    marginBottom: layout.spacing.lg,
    textAlign: 'center',
  },
  confirmationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  confirmationLabel: {
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.textSecondary,
  },
  confirmationValueContainer: {
    alignItems: 'flex-end',
  },
  confirmationValue: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
  },
  confirmationSubvalue: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: layout.spacing.xs,
  },
  totalContainer: {
    marginTop: layout.spacing.xl,
    paddingTop: layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
  },
  totalLabel: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: fonts.xl,
    color: colors.text,
  },
  totalValueUsd: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: layout.spacing.xs,
  },
  button: {
    marginTop: layout.spacing.lg,
  },
  securityNotice: {
    marginTop: layout.spacing.lg,
    padding: layout.spacing.md,
    backgroundColor: colors.warning + '20',
    borderRadius: layout.radius.md,
  },
  securityNoticeText: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.warning,
    lineHeight: 18,
  },
});