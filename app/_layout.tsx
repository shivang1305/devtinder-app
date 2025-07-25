import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="email-auth" options={{ headerShown: false }} />
        <Stack.Screen name="email-verify" options={{ headerShown: false }} />
        <Stack.Screen name="phone-auth" options={{ headerShown: false }} />
        <Stack.Screen name="otp-auth" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
