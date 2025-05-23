import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Scan, Users as Users2, Clock, ArrowRight } from 'lucide-react-native';
import Button from '@/components/Button';

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
  { id: '1', name: 'Bitcoin', symbol: 'BTC', balance: '0.45 BTC', value: '$20,250.00', color: colors.bitcoin },
  { id: '2', name: 'Ethereum', symbol: 'ETH', balance: '3.25 ETH', value: '$6,647.50', color: colors.ethereum },
  { id: '3', name: 'Tether', symbol: 'USDT', balance: '350 USDT', value: '$350.00', color: colors.tether },
];

export default function SendScreen() {
  const insets = useSafeAreaInsets();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0]);
  const [fee, setFee] = useState('0.0001 BTC ($4.50)');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

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

  const handleSelectRecipient = (rec) => {
    setRecipient(rec.address);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={[
          styles.header,
          { paddingTop: insets.top + layout.spacing.md }
        ]}>
          <Text style={styles.headerTitle}>
            {step === 1 ? 'Send Crypto' : 'Confirm Transaction'}
          </Text>
          {step === 2 && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setStep(1)}
            >
              <Text style={styles.backButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {step === 1 ? (
            // Step 1: Send Form
            <>
              {/* Crypto Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Select Crypto</Text>
                <TouchableOpacity style={styles.cryptoSelector}>
                  <View style={[styles.cryptoIcon, { backgroundColor: selectedCrypto.color + '20' }]}>
                    <Text style={[styles.cryptoIconText, { color: selectedCrypto.color }]}>
                      {selectedCrypto.symbol.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.cryptoInfo}>
                    <Text style={styles.cryptoName}>{selectedCrypto.name}</Text>
                    <Text style={styles.cryptoBalance}>Balance: {selectedCrypto.balance}</Text>
                  </View>
                  <ChevronDown size={20} color={colors.grey} />
                </TouchableOpacity>
              </View>

              {/* Recipient */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Recipient</Text>
                <View style={styles.recipientInputContainer}>
                  <TextInput
                    placeholder="Enter address or username"
                    value={recipient}
                    onChangeText={setRecipient}
                    style={styles.recipientInput}
                    placeholderTextColor={colors.grey}
                  />
                  <TouchableOpacity style={styles.scanButton}>
                    <Scan size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Recent Recipients */}
              <View style={styles.recentsContainer}>
                <View style={styles.recentsHeader}>
                  <View style={styles.recentsHeaderIcon}>
                    <Clock size={14} color={colors.grey} />
                  </View>
                  <Text style={styles.recentsHeaderText}>Recent</Text>
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
                      <Text style={styles.recentName}>{rec.name}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={styles.contactsButton}>
                    <View style={styles.contactsIcon}>
                      <Users2 size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.contactsText}>Contacts</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Amount */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Amount</Text>
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
                <View style={styles.amountActions}>
                  <TouchableOpacity 
                    style={styles.amountActionButton}
                    onPress={() => setAmount('0.1')}
                  >
                    <Text style={styles.amountActionText}>0.1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.amountActionButton}
                    onPress={() => setAmount('0.2')}
                  >
                    <Text style={styles.amountActionText}>0.2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.amountActionButton}
                    onPress={() => setAmount('0.5')}
                  >
                    <Text style={styles.amountActionText}>0.5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.amountActionButton, styles.maxButton]}
                    onPress={() => setAmount('0.45')}
                  >
                    <Text style={[styles.amountActionText, styles.maxButtonText]}>MAX</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.amountValue}>
                  ≈ ${amount ? (parseFloat(amount) * 45000).toFixed(2) : '0.00'}
                </Text>
              </View>

              {/* Note */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Note (Optional)</Text>
                <TextInput
                  placeholder="Add a note for this transaction"
                  value={note}
                  onChangeText={setNote}
                  style={styles.noteInput}
                  placeholderTextColor={colors.grey}
                  multiline
                />
              </View>
            </>
          ) : (
            // Step 2: Confirmation
            <View style={styles.confirmationContainer}>
              <View style={styles.confirmationCard}>
                <Text style={styles.confirmationTitle}>Transaction Details</Text>
                
                <View style={styles.confirmationItem}>
                  <Text style={styles.confirmationLabel}>Sending</Text>
                  <View style={styles.confirmationValueContainer}>
                    <Text style={styles.confirmationValue}>{amount} {selectedCrypto.symbol}</Text>
                    <Text style={styles.confirmationSubvalue}>
                      ≈ ${amount ? (parseFloat(amount) * 45000).toFixed(2) : '0.00'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={styles.confirmationLabel}>To</Text>
                  <View style={styles.confirmationValueContainer}>
                    <Text style={styles.confirmationValue}>
                      {recipient.length > 15 ? 
                        recipient.substring(0, 6) + '...' + 
                        recipient.substring(recipient.length - 4) : 
                        recipient
                      }
                    </Text>
                  </View>
                </View>
                
                <View style={styles.confirmationItem}>
                  <Text style={styles.confirmationLabel}>Network Fee</Text>
                  <View style={styles.confirmationValueContainer}>
                    <Text style={styles.confirmationValue}>{fee}</Text>
                  </View>
                </View>
                
                {note ? (
                  <View style={styles.confirmationItem}>
                    <Text style={styles.confirmationLabel}>Note</Text>
                    <View style={styles.confirmationValueContainer}>
                      <Text style={styles.confirmationValue}>{note}</Text>
                    </View>
                  </View>
                ) : null}

                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>
                    {amount ? (parseFloat(amount) + 0.0001).toFixed(4) : '0.0000'} {selectedCrypto.symbol}
                  </Text>
                  <Text style={styles.totalValueUsd}>
                    ≈ ${amount ? ((parseFloat(amount) + 0.0001) * 45000).toFixed(2) : '0.00'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.securityNotice}>
                <Text style={styles.securityNoticeText}>
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
          />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
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
    padding: layout.spacing.sm,
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
  amountActions: {
    flexDirection: 'row',
    marginTop: layout.spacing.md,
  },
  amountActionButton: {
    flex: 1,
    backgroundColor: colors.extraLightGrey,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.radius.md,
    marginRight: layout.spacing.sm,
    alignItems: 'center',
  },
  maxButton: {
    backgroundColor: colors.primary + '20',
    marginRight: 0,
  },
  amountActionText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
  },
  maxButtonText: {
    color: colors.primary,
  },
  amountValue: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.textSecondary,
    marginTop: layout.spacing.sm,
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
  button: {
    marginTop: layout.spacing.lg,
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
    borderBottomColor: colors.extraLightGrey,
  },
  confirmationLabel: {
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.textSecondary,
  },
  confirmationValueContainer: {
    flex: 1,
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
    marginTop: layout.spacing.xxs,
  },
  totalContainer: {
    marginTop: layout.spacing.lg,
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: fonts.xxl,
    color: colors.primary,
  },
  totalValueUsd: {
    fontFamily: fonts.regular,
    fontSize: fonts.md,
    color: colors.textSecondary,
    marginTop: layout.spacing.xs,
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