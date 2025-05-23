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

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = { ...styles.button };
    
    // Handle variants
    if (variant === 'primary') {
      buttonStyle = { ...buttonStyle, ...styles.primaryButton };
    } else if (variant === 'secondary') {
      buttonStyle = { ...buttonStyle, ...styles.secondaryButton };
    } else if (variant === 'outline') {
      buttonStyle = { ...buttonStyle, ...styles.outlineButton };
    } else if (variant === 'ghost') {
      buttonStyle = { ...buttonStyle, ...styles.ghostButton };
    }
    
    // Handle sizes
    if (size === 'small') {
      buttonStyle = { ...buttonStyle, ...styles.smallButton };
    } else if (size === 'large') {
      buttonStyle = { ...buttonStyle, ...styles.largeButton };
    }
    
    // Handle disabled state
    if (disabled || loading) {
      buttonStyle = { 
        ...buttonStyle, 
        opacity: 0.6,
      };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleObj: TextStyle = { ...styles.buttonText };
    
    if (variant === 'primary') {
      textStyleObj = { ...textStyleObj, ...styles.primaryText };
    } else if (variant === 'secondary') {
      textStyleObj = { ...textStyleObj, ...styles.secondaryText };
    } else if (variant === 'outline') {
      textStyleObj = { ...textStyleObj, ...styles.outlineText };
    } else if (variant === 'ghost') {
      textStyleObj = { ...textStyleObj, ...styles.ghostText };
    }
    
    if (size === 'small') {
      textStyleObj = { ...textStyleObj, ...styles.smallText };
    } else if (size === 'large') {
      textStyleObj = { ...textStyleObj, ...styles.largeText };
    }
    
    return textStyleObj;
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? colors.white : colors.primary} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  largeButton: {
    paddingHorizontal: 32,
    paddingVertical: 18,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
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
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  }
});