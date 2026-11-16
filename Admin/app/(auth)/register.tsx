import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react-native";

import { authApi } from "../../services/api";
import { styles } from "../../styles/register";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password || !confirmPassword) {
      Alert.alert("Perhatian", "Semua kolom wajib diisi.");
      return;
    }

    if (cleanUsername.length < 3) {
      Alert.alert("Username tidak valid", "Username minimal 3 karakter.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert("Email tidak valid", "Masukkan alamat email yang benar.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Password terlalu pendek", "Gunakan minimal 8 karakter.");
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      Alert.alert(
        "Password kurang kuat",
        "Password harus mengandung huruf dan angka.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password tidak cocok",
        "Konfirmasi password belum sama.",
      );
      return;
    }

    try {
      setLoading(true);

      const result = await authApi.register({
        username: cleanUsername,
        email: cleanEmail,
        password,
      });

      Alert.alert(
        "Pendaftaran berhasil",
        result.message ||
          "Akun berhasil dibuat dan sedang menunggu persetujuan Super Admin.",
        [
          {
            text: "Kembali ke Login",
            onPress: () => router.replace("/login"),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Pendaftaran gagal",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan. Silakan coba kembali.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <Image
        source={require("../../assets/images/background-log-regis.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.overlay} />

      <StatusBar barStyle="dark-content" />

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

            {/* <Text style={styles.brandName}>GrsApp</Text> */}

            <Text style={styles.headerSubtitle}>
              Buat Akun Admin untuk mengelola sistem
            </Text>
          </View>

          {/* REGISTER CARD */}
          <View style={styles.registerCard}>
            <Text style={styles.title}>Buat Akun Baru</Text>

            <Text style={styles.description}>
              Daftarkan akun Anda untuk mengelola sistem{"\n"}
              CRUD dan keuangan lainnya.
            </Text>

            {/* USERNAME */}
            <View style={styles.inputContainer}>
              <UserRound size={18} color="#626262" />

              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#777"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={30}
                editable={!loading}
                returnKeyType="next"
              />
            </View>

            {/* EMAIL */}
            <View style={styles.inputContainer}>
              <Mail size={18} color="#626262" />

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                returnKeyType="next"
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputContainer}>
              <LockKeyhole size={18} color="#626262" />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                returnKeyType="next"
              />

              <Pressable
                onPress={() => setShowPassword((value) => !value)}
                hitSlop={10}
              >
                {showPassword ? (
                  <Eye size={18} color="#626262" />
                ) : (
                  <EyeOff size={18} color="#626262" />
                )}
              </Pressable>
            </View>

            {/* CONFIRM PASSWORD */}
            <View style={styles.inputContainer}>
              <LockKeyhole size={18} color="#626262" />

              <TextInput
                style={styles.input}
                placeholder="Konfirmasi Password"
                placeholderTextColor="#777"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

              <Pressable
                onPress={() =>
                  setShowConfirmPassword((value) => !value)
                }
                hitSlop={10}
              >
                {showConfirmPassword ? (
                  <Eye size={18} color="#626262" />
                ) : (
                  <EyeOff size={18} color="#626262" />
                )}
              </Pressable>
            </View>

            {/* REGISTER BUTTON */}
            <Pressable
              style={({ pressed }) => [
                styles.registerButton,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.registerButtonText}>
                    Register
                  </Text>

                  <ArrowRight size={17} color="#FFFFFF" />
                </View>
              )}
            </Pressable>

            {/* APPROVAL INFORMATION */}
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ⓘ</Text>

              <Text style={styles.infoText}>
                Password yang didaftarkan akan dienkripsi.
                Akun harus mendapatkan persetujuan Super Admin
                sebelum dapat digunakan untuk Login.
              </Text>
            </View>

            {/* LOGIN NAVIGATION */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Sudah Punya Akun?{" "}
              </Text>

              <Pressable
                onPress={() => router.replace("/login")}
              >
                <Text style={styles.loginLink}>
                  Login →
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}