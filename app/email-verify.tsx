import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ACCENT = "#ff4b6e";
const DARK_BG = "#181A20";
const LIGHT_TEXT = "#fff";
const SUBTLE_TEXT = "#aaa";

export default function EmailVerifyScreen() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newCode = [...code];
      newCode[idx] = text;
      setCode(newCode);
      if (text && idx < 3) {
        inputRefs.current[idx + 1]?.focus();
      }
      if (text === "" && idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCode(["", "", "", ""]);
    Keyboard.dismiss();
    // TODO: Trigger resend verification code logic
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={{ color: ACCENT, fontSize: 28 }}>{"<"}</Text>
      </TouchableOpacity>

      {/* Timer */}
      <Text style={styles.timer}>{`00:${timer
        .toString()
        .padStart(2, "0")}`}</Text>
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
      <TouchableOpacity
        disabled={timer > 0}
        onPress={handleResend}
        style={styles.resendBtn}
      >
        <Text
          style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}
        >
          Send again
        </Text>
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
  timer: {
    fontSize: 36,
    fontWeight: "700",
    color: LIGHT_TEXT,
    marginTop: 32,
    marginBottom: 8,
  },
  otpTitle: {
    color: SUBTLE_TEXT,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#23242a",
    backgroundColor: "#23242a",
    color: LIGHT_TEXT,
    fontSize: 28,
    fontWeight: "700",
    marginHorizontal: 8,
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
  resendTextDisabled: {
    color: "#ff4b6e55",
    opacity: 0.6,
  },
});
