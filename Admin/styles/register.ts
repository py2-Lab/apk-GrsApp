import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  backgroundImage: {
    ...StyleSheet.absoluteFill,
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
    paddingTop: 28,
    paddingBottom: 28,
  },

  header: {
    alignItems: "center",
    marginBottom: 18,
  },

  logo: {
    width: 76,
    height: 58,
  },

  brandName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#087D43",
    marginTop: -4,
  },

  headerSubtitle: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  registerCard: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "rgba(255,255,255,0.84)",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
  },

  title: {
    fontSize: 19,
    fontWeight: "800",
    color: "#171717",
    marginBottom: 5,
  },

  description: {
    color: "#666666",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
    marginBottom: 17,
  },

  inputContainer: {
    width: "100%",
    minHeight: 42,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B7B7B7",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 9,
  },

  input: {
    flex: 1,
    height: 42,
    color: "#222222",
    fontSize: 11,
    paddingVertical: 0,
  },

  registerButton: {
    width: "100%",
    height: 42,
    borderRadius: 25,
    backgroundColor: "#55B580",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
    marginBottom: 17,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  infoBox: {
    width: "100%",
    minHeight: 46,
    backgroundColor: "rgba(76, 177, 125, 0.38)",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 17,
  },

  infoIcon: {
    color: "#FFFFFF",
    fontSize: 15,
    marginRight: 8,
  },

  infoText: {
    flex: 1,
    color: "#477A5C",
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "500",
  },

  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loginText: {
    color: "#666666",
    fontSize: 10,
  },

  loginLink: {
    color: "#45A977",
    fontSize: 10,
    fontWeight: "600",
  },
});
