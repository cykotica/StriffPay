import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CreditCard, PiggyBank, Settings, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, BellRing, Moon, DollarSign, User, Lock, Gift, Heart } from 'lucide-react-native';

const menuItems = [
  {
    title: 'Account',
    items: [
      { 
        id: 'profile', 
        name: 'Profile', 
        icon: User, 
        route: '/profile'
      },
      { 
        id: 'card', 
        name: 'Card Management', 
        icon: CreditCard, 
        route: '/card'
      },
      { 
        id: 'security', 
        name: 'Security & Privacy', 
        icon: Shield, 
        route: '/security'
      },
    ]
  },
  {
    title: 'Finance',
    items: [
      { 
        id: 'staking', 
        name: 'Staking', 
        icon: PiggyBank, 
        route: '/staking'
      },
      { 
        id: 'deposit', 
        name: 'Deposit', 
        icon: DollarSign, 
        route: '/deposit'
      },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { 
        id: 'settings', 
        name: 'Settings', 
        icon: Settings, 
        route: '/settings'
      },
      { 
        id: 'notifications', 
        name: 'Notifications', 
        icon: BellRing, 
        route: '/notifications',
        toggle: true,
        toggled: true,
      },
      { 
        id: 'darkMode', 
        name: 'Dark Mode', 
        icon: Moon, 
        toggle: true,
        toggled: false,
      },
    ]
  },
  {
    title: 'Support',
    items: [
      { 
        id: 'help', 
        name: 'Help & Support', 
        icon: HelpCircle, 
        route: '/help'
      },
      { 
        id: 'referral', 
        name: 'Invite Friends', 
        icon: Gift, 
        route: '/referral',
        badge: 'Earn $10'
      },
      { 
        id: 'about', 
        name: 'About CryptoPay', 
        icon: Heart, 
        route: '/about'
      },
    ]
  }
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const [toggles, setToggles] = React.useState({
    notifications: true,
    darkMode: false,
  });

  const handleToggle = (id) => {
    setToggles(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.header,
        { paddingTop: insets.top + layout.spacing.md }
      ]}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => router.push('/profile')}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>MS</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Michael Scott</Text>
            <Text style={styles.profileEmail}>michael.scott@example.com</Text>
          </View>
          <ChevronRight size={20} color={colors.grey} />
        </TouchableOpacity>

        {/* Menu Sections */}
        {menuItems.map((section, index) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    itemIndex !== section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => item.toggle ? handleToggle(item.id) : router.push(item.route)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuItemIcon, { backgroundColor: getIconBackground(item.id) }]}>
                      <item.icon size={20} color={getIconColor(item.id)} />
                    </View>
                    <Text style={styles.menuItemText}>{item.name}</Text>
                    {item.badge && (
                      <View style={styles.menuItemBadge}>
                        <Text style={styles.menuItemBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  {item.toggle ? (
                    <Switch
                      value={toggles[item.id]}
                      onValueChange={() => handleToggle(item.id)}
                      trackColor={{ false: colors.lightGrey, true: colors.primary + '80' }}
                      thumbColor={toggles[item.id] ? colors.primary : colors.white}
                      ios_backgroundColor={colors.lightGrey}
                    />
                  ) : (
                    <ChevronRight size={20} color={colors.grey} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          Version 1.0.0 (200)
        </Text>
      </ScrollView>
    </View>
  );
}

// Helper function to get icon background color
const getIconBackground = (id) => {
  switch (id) {
    case 'profile':
    case 'settings':
      return colors.primary + '20';
    case 'card':
    case 'deposit':
      return colors.secondary + '20';
    case 'security':
    case 'notifications':
      return colors.warning + '20';
    case 'staking':
    case 'darkMode':
      return colors.success + '20';
    case 'help':
    case 'about':
      return colors.accent + '20';
    case 'referral':
      return colors.bitcoin + '20';
    default:
      return colors.primary + '20';
  }
};

// Helper function to get icon color
const getIconColor = (id) => {
  switch (id) {
    case 'profile':
    case 'settings':
      return colors.primary;
    case 'card':
    case 'deposit':
      return colors.secondary;
    case 'security':
    case 'notifications':
      return colors.warning;
    case 'staking':
    case 'darkMode':
      return colors.success;
    case 'help':
    case 'about':
      return colors.accent;
    case 'referral':
      return colors.bitcoin;
    default:
      return colors.primary;
  }
};

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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.lg,
    marginBottom: layout.spacing.xl,
    ...layout.shadow.sm,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.lg,
  },
  profileInitials: {
    fontFamily: fonts.bold,
    fontSize: fonts.xl,
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: fonts.semiBold,
    fontSize: fonts.lg,
    color: colors.text,
    marginBottom: layout.spacing.xxs,
  },
  profileEmail: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  menuSection: {
    marginBottom: layout.spacing.xl,
  },
  menuSectionTitle: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
    paddingHorizontal: layout.spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    overflow: 'hidden',
    ...layout.shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.spacing.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  menuItemText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.text,
    flex: 1,
  },
  menuItemBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xxs,
    borderRadius: layout.radius.sm,
    marginLeft: layout.spacing.sm,
  },
  menuItemBadgeText: {
    fontFamily: fonts.medium,
    fontSize: fonts.xs,
    color: colors.success,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.lg,
    marginBottom: layout.spacing.lg,
    ...layout.shadow.sm,
  },
  logoutText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    color: colors.error,
    marginLeft: layout.spacing.sm,
  },
  versionText: {
    fontFamily: fonts.regular,
    fontSize: fonts.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});