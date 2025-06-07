import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  darkMode?: boolean;
}

const styles = StyleSheet.create({
  button: {
    borderRadius: layout.radius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: layout.spacing.xl,
    paddingVertical: layout.spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.lg,
  },
  largeButton: {
    paddingVertical: layout.spacing.lg,
    paddingHorizontal: layout.spacing.xxl,
  },
  buttonText: {
    fontFamily: fonts.medium,
    fontSize: fonts.md,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
});

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  darkMode = false,
  ...rest
}: ButtonProps) {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = { ...styles.button };
    
    if (variant === 'primary') {
      buttonStyle = {
        ...buttonStyle,
        ...styles.primaryButton,
        ...(darkMode && {
          backgroundColor: colors.dark.primaryAccent,
        }),
      };
    } else if (variant === 'secondary') {
      buttonStyle = {
        ...buttonStyle,
        ...styles.secondaryButton,
        ...(darkMode && {
          backgroundColor: colors.dark.secondaryAccent,
        }),
      };
    } else if (variant === 'outline') {
      buttonStyle = {
        ...buttonStyle,
        ...styles.outlineButton,
        ...(darkMode && {
          borderColor: colors.dark.border,
        }),
      };
    } else if (variant === 'ghost') {
      buttonStyle = {
        ...buttonStyle,
        ...styles.ghostButton,
      };
    }
    
    if (size === 'small') {
      buttonStyle = { ...buttonStyle, ...styles.smallButton };
    } else if (size === 'large') {
      buttonStyle = { ...buttonStyle, ...styles.largeButton };
    }
    
    if (disabled || loading) {
      buttonStyle = { ...buttonStyle, opacity: 0.6 };
    }
    
    return buttonStyle;
  };

  const getTextStyle = () => {
    let textStyleObj: TextStyle = { ...styles.buttonText };
    
    if (variant === 'primary' || variant === 'secondary') {
      textStyleObj = {
        ...textStyleObj,
        ...styles.primaryText,
        ...(darkMode && { color: colors.darkText }),
      };
    } else if (variant === 'outline' || variant === 'ghost') {
      textStyleObj = {
        ...textStyleObj,
        ...(darkMode ? { color: colors.dark.primaryAccent } : styles.outlineText),
      };
    }
    
    return textStyleObj;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost'
            ? (darkMode ? colors.dark.primaryAccent : colors.primary)
            : colors.white} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}