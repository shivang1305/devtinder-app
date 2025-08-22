import { tokenManager } from "@/services/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error && typeof error === "object" && "statusCode" in error) {
          const apiError = error as { statusCode: number };

          if (apiError.statusCode >= 400 && apiError.statusCode < 500)
            return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    const initialiseApp = async () => {
      try {
        await tokenManager.initialize();
        console.log("✅ API service initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize API service: " + error);
      }
    };

    initialiseApp();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
