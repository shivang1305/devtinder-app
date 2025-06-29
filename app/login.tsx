import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/D-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Sign in to continue</Text>

      {/* Email Button */}
      <TouchableOpacity style={styles.emailButton}>
        <Text style={styles.emailButtonText}>Continue with email</Text>
      </TouchableOpacity>

      {/* Phone Button */}
      <TouchableOpacity style={styles.phoneButton}>
        <Text style={styles.phoneButtonText}>Use phone number</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or sign in with</Text>
        <View style={styles.divider} />
      </View>

      {/* Social Buttons */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/images/linkedin-logo.png")}
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/images/google-logo.png")}
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/images/github-logo.png")}
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footerRow}>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Terms of use</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ACCENT = "#ff4b6e";
const DARK_BG = "#181A20";
const LIGHT_TEXT = "#fff";
const SUBTLE_TEXT = "#aaa";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  logo: {
    width: width * 0.36,
    height: width * 0.36,
    marginBottom: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: LIGHT_TEXT,
    marginBottom: 32,
  },
  emailButton: {
    width: "100%",
    backgroundColor: ACCENT,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  emailButtonText: {
    color: LIGHT_TEXT,
    fontSize: 17,
    fontWeight: "500",
  },
  phoneButton: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 32,
  },
  phoneButtonText: {
    color: ACCENT,
    fontSize: 17,
    fontWeight: "500",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: SUBTLE_TEXT,
    opacity: 0.3,
  },
  dividerText: {
    color: SUBTLE_TEXT,
    marginHorizontal: 12,
    fontSize: 13,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  socialButton: {
    backgroundColor: "#23242a",
    borderRadius: 14,
    padding: 8,
    marginHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 24,
  },
  footerLink: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: "400",
    marginHorizontal: 8,
  },
});
