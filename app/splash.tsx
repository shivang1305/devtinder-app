import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/devtinder-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  logoContainer: {
    backgroundColor: "#000000",
    borderRadius: 8,
    overflow: "hidden",
  },
  logo: {
    width: width - 20,
    height: height - 40,
    maxWidth: "100%",
    maxHeight: "100%",
  },
});
