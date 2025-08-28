import LoadingIndicator from "@/components/LoadingIndicator";
import { Colors } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";

const { ACCENT, DARK_BG, LIGHT_TEXT, SUBTLE_TEXT, ERROR_TEXT } = Colors;

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function EmailAuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const router = useRouter();
  const { login, isLoading, error } = useAuth();

  useEffect(() => {
    if (error) {
      setLocalError(error.message || "Login failed. Please try again");
    }
  }, [error]);

  const handleContinue = async () => {
    setLocalError("");

    if (!validateEmail(email)) {
      setLocalError("Invalid email address");
    } else if (!password) {
      setLocalError("Password cannot be empty");
    } else if (password.length < 6) {
      setLocalError("Password must be atleast 6 characters");
    } else {
      try {
        // TODO: call the api to send verification email
        await login({ email, password });
        router.push("./email-verify");
      } catch (error) {
        setLocalError("Login failed: " + error);
        console.log(error);
      }
    }

    return;
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
          onChangeText={(text) => {
            setEmail(text);
            setLocalError("");
          }}
          editable={!isLoading}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={SUBTLE_TEXT}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setLocalError("");
          }}
          editable={!isLoading}
        />
      </View>
      {localError ? <Text style={styles.error}>{localError}</Text> : null}

      <CustomButton
        title={isLoading ? "Signing in..." : "Continue"}
        variant="filled"
        onPress={handleContinue}
        disabled={email === "" || password === "" || isLoading}
        style={{ marginTop: 32 }}
      />

      {isLoading && <LoadingIndicator />}
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
