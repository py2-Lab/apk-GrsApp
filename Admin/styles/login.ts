import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
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
    width: 100,
    height: 78,
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
    width: 22,
    alignItems: "center",
    justifyContent: "center",
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
