import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import CustomButton from "../components/CustomButton";

const DARK_BG = "#181A20";
const LIGHT_TEXT = "#fff";
const SUBTLE_TEXT = "#aaa";
const ERROR_TEXT = "#ff4b6e";

export default function PhoneAuthScreen() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePhoneNumber = (phoneNumber: string) => {
    if (!isNaN(Number(phoneNumber)) && phoneNumber.length <= 10)
      setPhone(phoneNumber);
    if (phoneNumber.length === 10) setError("");
    else if (phoneNumber.length < 10) setError("Invalid phone number...");
  };

  const handleContinue = () => {
    if (phone.length !== 10) {
      setError("Invalid phone number...");
    } else {
      // TODO: call the api to sent otp
      router.push("/otp-auth");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My mobile</Text>
      <Text style={styles.subtitle}>
        Please enter your valid phone number. We will send you a 4-digit code to
        verify your account.
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor={SUBTLE_TEXT}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={handlePhoneNumber}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CustomButton
        title="Continue"
        variant="filled"
        onPress={handleContinue}
        disabled={error === "" ? false : true}
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
    paddingTop: 80,
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
  chevron: {
    color: SUBTLE_TEXT,
    fontSize: 14,
    marginLeft: 2,
  },
  input: {
    flex: 1,
    color: LIGHT_TEXT,
    fontSize: 18,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
});
