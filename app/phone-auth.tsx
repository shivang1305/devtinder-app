import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import CustomButton from "../components/CustomButton";

const ACCENT = "#ff4b6e";
const DARK_BG = "#181A20";
const LIGHT_TEXT = "#fff";
const SUBTLE_TEXT = "#aaa";
const { width } = Dimensions.get("window");

export default function PhoneAuthScreen() {
  const [phone, setPhone] = useState("");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My mobile</Text>
      <Text style={styles.subtitle}>
        Please enter your valid phone number. We will send you a 4-digit code to
        verify your account.
      </Text>

      <View style={styles.inputRow}>
        {/* <TouchableOpacity style={styles.countryPicker}>
          <Image
            source={require("../assets/images/flag-us.png")}
            style={styles.flag}
          />
          <Text style={styles.countryCode}>(+1)</Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity> */}
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor={SUBTLE_TEXT}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <CustomButton
        title="Continue"
        variant="filled"
        onPress={() => router.push("/otp-auth")}
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
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#23242a",
  },
  flag: {
    width: 28,
    height: 20,
    marginRight: 4,
    borderRadius: 4,
  },
  countryCode: {
    color: LIGHT_TEXT,
    fontSize: 16,
    marginRight: 2,
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
