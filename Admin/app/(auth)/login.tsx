import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react-native";

import { styles } from "../../styles/login";
import { authApi } from "../../services/api";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  

const handleLogin = async () => {
  const identifier = email.trim();

  if (!identifier || !password) {
    Alert.alert(
      "Perhatian",
      "Email atau username dan password wajib diisi."
    );
    return;
  }

  try {
    setLoading(true);

    const result = await authApi.login(identifier, password);

    await SecureStore.setItemAsync("authToken", result.token);
    await SecureStore.setItemAsync(
      "authUser",
      JSON.stringify(result.user)
    );

    if (result.user.role === "superadmin") {
      router.replace("/super-admin");
    } else {
      router.replace("/(dashboard)/home");
    }
  } catch (error) {
    Alert.alert(
      "Login gagal",
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat login."
    );
  } finally {
    setLoading(false);
  }



    // // TODO: Hubungkan dengan API autentikasi Admin.
    // Alert.alert("Login Admin", "Form berhasil diisi.");
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      "Login " + provider,
      "Fitur ini akan dihubungkan dengan autentikasi sosial.",
    );
  };

  return (
    <View style={styles.background}>
      <Image
        source={require("../../assets/images/background-log-regis.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <StatusBar barStyle="dark-content" />

      {/* Overlay agar elemen login lebih mudah dibaca */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/logoGrsApp.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.headerSubtitle}>
              Pendataan Pekerja di Page Admin
            </Text>
          </View>

          {/* LOGIN CARD */}
          <View style={styles.loginCard}>
            <Text style={styles.welcomeTitle}>Selamat Datang</Text>

            <Text style={styles.description}>
              Silahkan Login untuk memulai pekerjaan
              {"\n"}Anda.
            </Text>

            {/* EMAIL */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Mail size={19} color="#555555" strokeWidth={1.8} />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Email atau Username"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <LockKeyhole size={19} color="#555555" strokeWidth={1.8} />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <Eye size={20} color="#555555" strokeWidth={1.8} />
                ) : (
                  <EyeOff size={20} color="#555555" strokeWidth={1.8} />
                )}
              </Pressable>
            </View>

            {/* FORGOT PASSWORD */}
            <Pressable
              style={styles.forgotContainer}
              onPress={() =>
                Alert.alert(
                  "Lupa Password",
                  "Fitur pemulihan password akan ditambahkan.",
                )
              }
            >
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </Pressable>

            {/* LOGIN BUTTON */}
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Login →</Text>
              )}
            </Pressable>

            {/* DIVIDER */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Atau Login dengan</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* SOCIAL LOGIN */}
            <View style={styles.socialContainer}>
              <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Google")}
              >
                <Image
                  source={require("../../assets/icons/sample2.png")}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </Pressable>

              <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin("GitHub")}
              >
                <Image
                  source={require("../../assets/icons/sample1.png")}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </Pressable>

              <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin("LinkedIn")}
              >
                <Image
                  source={require("../../assets/icons/sample4.png")}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            {/* ADMIN INFORMATION */}
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ⓘ</Text>

              <Text style={styles.infoText}>
                Jika Mengalami Kendala saat Login, Hubungi Super Admin
              </Text>
            </View>

            {/* REGISTER */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Belum Punya Akun? </Text>

              <Pressable onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Register →</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

