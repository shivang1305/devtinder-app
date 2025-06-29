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
const LIGHT_TEXT = "#fff";

interface CustomButtonProps {
  title: string;
  variant?: "filled" | "outlined";
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = "filled",
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === "filled" ? styles.filled : styles.outlined,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.baseText,
          variant === "filled" ? styles.filledText : styles.outlinedText,
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
  outlined: {
    borderWidth: 1.5,
    borderColor: ACCENT,
    backgroundColor: "transparent",
  },
  baseText: {
    fontSize: 17,
    fontWeight: "500",
  },
  filledText: {
    color: LIGHT_TEXT,
  },
  outlinedText: {
    color: ACCENT,
  },
});

export default CustomButton;
