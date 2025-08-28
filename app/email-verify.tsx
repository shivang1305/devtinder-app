import { Colors } from "@/constants/Colors";
import { OTP_DIGITS } from "@/constants/Constants";
import { isSingleDigitorEmptyString } from "@/utils/helpers";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { ACCENT, DARK_BG, LIGHT_TEXT, SUBTLE_TEXT } = Colors;

export default function EmailVerifyScreen() {
  const digitsArr = new Array(OTP_DIGITS).fill("");
  const [code, setCode] = useState(digitsArr);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();

  const handleChange = (text: string, idx: number) => {
    if (isSingleDigitorEmptyString(text)) {
      const newCode = [...code];
      newCode[idx] = text;
      setCode(newCode);
      if (text && idx < OTP_DIGITS - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
      if (text === "" && idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  const handleResend = () => {
    setCode(digitsArr);
    Keyboard.dismiss();
    // TODO: Trigger resend verification code logic
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={{ color: ACCENT, fontSize: 28 }}>{"<"}</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.otpTitle}>
        Type the verification code we&apos;ve sent to your email
      </Text>

      {/* Code boxes */}
      <View style={styles.otpRow}>
        {code.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={(ref) => {
              inputRefs.current[idx] = ref;
            }}
            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, idx)}
            textAlign="center"
            selectionColor={ACCENT}
            placeholder=""
            placeholderTextColor={SUBTLE_TEXT}
          />
        ))}
      </View>

      {/* Resend link */}
      <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
        <Text style={styles.resendText}>Send again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 48,
    left: 24,
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#23242a",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  otpTitle: {
    color: SUBTLE_TEXT,
    fontSize: 18,
    textAlign: "center",
    marginTop: 56, // push title below back button
    marginBottom: 32,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#23242a",
    backgroundColor: "#23242a",
    color: LIGHT_TEXT,
    fontSize: 28,
    fontWeight: "700",
    marginHorizontal: 6,
    textAlign: "center",
    textAlignVertical: "center", // for Android vertical centering
  },
  otpBoxFilled: {
    borderColor: ACCENT,
    backgroundColor: ACCENT,
    color: LIGHT_TEXT,
  },
  resendBtn: {
    marginTop: 16,
  },
  resendText: {
    color: ACCENT,
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },
});
