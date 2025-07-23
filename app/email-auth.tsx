import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";

const ACCENT = "#ff4b6e";
const DARK_BG = "#181A20";
const LIGHT_TEXT = "#fff";
const SUBTLE_TEXT = "#aaa";
const ERROR_TEXT = "#ff4b6e";

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function EmailAuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (!validateEmail(email)) {
      setError("Invalid email address");
    } else if (!password) {
      setError("Password cannot be empty");
    } else {
      setError("");
      // TODO: call the api to send verification email
      router.push("./email-verify");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={{ color: ACCENT, fontSize: 28 }}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>My email</Text>
      <Text style={styles.subtitle}>
        Please enter your email and password. We will send you a code to verify
        your account.
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={SUBTLE_TEXT}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={SUBTLE_TEXT}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CustomButton
        title="Continue"
        variant="filled"
        onPress={handleContinue}
        disabled={email === "" || password === ""}
        style={{ marginTop: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    paddingHorizontal: 24,
    paddingTop: 96,
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
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: LIGHT_TEXT,
    marginBottom: 12,
  },
  subtitle: {
    color: SUBTLE_TEXT,
    fontSize: 16,
    marginBottom: 36,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23242a",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 24,
  },
  error: {
    color: ERROR_TEXT,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 0,
    marginLeft: 4,
    fontWeight: "500",
  },
  input: {
    flex: 1,
    color: LIGHT_TEXT,
    fontSize: 18,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
});
