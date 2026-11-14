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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Perhatian", "Email dan password wajib diisi.");
      return;
    }

    // TODO: Hubungkan dengan API autentikasi Admin.
    Alert.alert("Login Admin", "Form berhasil diisi.");
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

            <Text style={styles.brandName}>GrsApp</Text>

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
              <Text style={styles.inputIcon}>✉</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
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
              <Text style={styles.inputIcon}>▣</Text>

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
                <Text style={styles.eyeIcon}>{showPassword ? "◉" : "◎"}</Text>
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
            >
              <Text style={styles.loginButtonText}>Login →</Text>
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
                  source={require("../../assets/icons/sample3.png")}
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

              <Pressable
                onPress={() =>
                  Alert.alert(
                    "Register",
                    "Navigasi ke halaman Register akan dihubungkan.",
                  )
                }
              >
                <Text style={styles.registerLink}>Register →</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(20, 35, 15, 0.10)",
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 45,
    paddingBottom: 30,
  },

  // HEADER
  header: {
    alignItems: "center",
    marginBottom: 22,
  },

  logo: {
    width: 62,
    height: 48,
  },

  brandName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#087D43",
    marginTop: -2,
  },

  headerSubtitle: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 9,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // LOGIN CARD
  loginCard: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "rgba(255,255,255,0.84)",
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 23,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
  },

  welcomeTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#171717",
    marginBottom: 6,
  },

  description: {
    color: "#666666",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 23,
  },

  // INPUT
  inputContainer: {
    width: "100%",
    height: 44,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B7B7B7",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    marginBottom: 12,
  },

  inputIcon: {
    color: "#555555",
    fontSize: 17,
    marginRight: 9,
  },

  input: {
    flex: 1,
    height: "100%",
    color: "#222222",
    fontSize: 12,
    paddingVertical: 0,
  },

  eyeButton: {
    padding: 5,
  },

  eyeIcon: {
    fontSize: 17,
    color: "#555555",
  },

  // FORGOT PASSWORD
  forgotContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 1,
    marginBottom: 24,
  },

  forgotText: {
    fontSize: 11,
    color: "#45A977",
    fontWeight: "500",
  },

  // LOGIN BUTTON
  loginButton: {
    width: "100%",
    height: 43,
    borderRadius: 25,
    backgroundColor: "#55B580",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // DIVIDER
  dividerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 17,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(90,90,90,0.35)",
  },

  dividerText: {
    color: "#777777",
    fontSize: 11,
    marginHorizontal: 10,
  },

  // SOCIAL
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 35,
    marginBottom: 22,
  },

  socialButton: {
    width: 35,
    height: 35,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  socialIcon: {
    width: 20,
    height: 20,
  },

  // INFORMATION
  infoBox: {
    width: "100%",
    minHeight: 42,
    backgroundColor: "rgba(76, 177, 125, 0.38)",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginBottom: 18,
  },

  infoIcon: {
    color: "#FFFFFF",
    fontSize: 15,
    marginRight: 9,
  },

  infoText: {
    flex: 1,
    color: "#477A5C",
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "500",
  },

  // REGISTER
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  registerText: {
    color: "#666666",
    fontSize: 10,
  },

  registerLink: {
    color: "#45A977",
    fontSize: 10,
    fontWeight: "600",
  },
});
