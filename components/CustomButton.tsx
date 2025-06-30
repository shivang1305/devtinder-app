import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

const ACCENT = "#ff4b6e";
const ACCENT_FAINT = "#ff4b6e55";
const LIGHT_TEXT = "#fff";
const OUTLINE_FAINT = "#ff4b6e33";

interface CustomButtonProps {
  title: string;
  variant?: "filled" | "outlined";
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = "filled",
  disabled = false,
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === "filled"
          ? disabled
            ? styles.filledDisabled
            : styles.filled
          : disabled
          ? styles.outlinedDisabled
          : styles.outlined,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <Text
        style={[
          styles.baseText,
          variant === "filled"
            ? disabled
              ? styles.filledTextDisabled
              : styles.filledText
            : disabled
            ? styles.outlinedTextDisabled
            : styles.outlinedText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  filled: {
    backgroundColor: ACCENT,
  },
  filledDisabled: {
    backgroundColor: ACCENT_FAINT,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: ACCENT,
    backgroundColor: "transparent",
  },
  outlinedDisabled: {
    borderWidth: 1.5,
    borderColor: OUTLINE_FAINT,
    backgroundColor: "transparent",
  },
  baseText: {
    fontSize: 17,
    fontWeight: "500",
  },
  filledText: {
    color: LIGHT_TEXT,
    opacity: 1,
  },
  filledTextDisabled: {
    color: LIGHT_TEXT,
    opacity: 0.5,
  },
  outlinedText: {
    color: ACCENT,
    opacity: 1,
  },
  outlinedTextDisabled: {
    color: ACCENT_FAINT,
    opacity: 0.6,
  },
});

export default CustomButton;
