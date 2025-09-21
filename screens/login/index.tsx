import { supabase } from "@/services/supabase";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);

    router.push({
      pathname: "/(private)/search-destination",
    });
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 justify-center px-6"
    >
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Back
        </Text>
        <Text className="text-gray-500">Sign in to continue</Text>
      </View>

      {/* Email Input */}
      <TextInput
        className="bg-white rounded-xl p-4 mb-4 border border-gray-300 text-gray-800"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        className="bg-white rounded-xl p-4 mb-6 border border-gray-300 text-gray-800"
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      {/* Sign In Button */}
      <Pressable
        className={`bg-blue-600 rounded-xl p-4 mb-4 items-center ${loading ? "opacity-50" : ""}`}
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text className="text-white font-semibold text-lg">Sign In</Text>
      </Pressable>

      {/* Sign Up Button */}
      <Pressable
        className={`border border-blue-600 rounded-xl p-4 items-center ${loading ? "opacity-50" : ""}`}
        onPress={signUpWithEmail}
        disabled={loading}
      >
        <Text className="text-blue-600 font-semibold text-lg">Sign Up</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
