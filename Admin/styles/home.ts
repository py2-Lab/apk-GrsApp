import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },

  header: {
    height: 53,
    backgroundColor: "#568995",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  headerButton: {
    width: 39,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  headerSpacer: {
    flex: 1,
  },

  profileButton: {
    width: 29,
    height: 29,
    borderRadius: 20,
    backgroundColor: "#E75C53",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 7,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 25,
  },

  heading: {
    marginBottom: 12,
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#568995",
    marginBottom: 3,
  },

  welcomeText: {
    fontSize: 10,
    color: "#666666",
  },

  recapTabs: {
    flexDirection: "row",
    gap: 7,
    marginTop: 11,
  },

  recapTab: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 5,
  },

  recapTabActive: {
    backgroundColor: "#55A5C4",
  },

  recapTabText: {
    fontSize: 9,
    color: "#568995",
    fontWeight: "500",
  },

  recapTabTextActive: {
    color: "#FFFFFF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 11,
  },

  cardHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  cardHeadingText: {
    fontSize: 11,
    color: "#999999",
    fontWeight: "500",
  },

  editButton: {
    backgroundColor: "#56B85D",
    paddingHorizontal: 17,
    paddingVertical: 5,
    borderRadius: 5,
  },

  editButtonText: {
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 9,
  },

  statItem: {
    width: "48.5%",
    minHeight: 64,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 7,
  },

  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  statInfo: {
    flex: 1,
  },

  statTitle: {
    fontSize: 8,
    color: "#999999",
    marginBottom: 3,
  },

  statValue: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
  },

  statDescription: {
    fontSize: 7,
    color: "#A65C5C",
  },

  projectHeading: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 11,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  projectHeadingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  projectIcon: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D7E5EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  projectTitle: {
    color: "#62A8D0",
    fontSize: 11,
    fontWeight: "500",
  },

  progressItem: {
    marginBottom: 9,
  },

  progressHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  progressTitle: {
    color: "#999999",
    fontSize: 9,
  },

  progressValue: {
    color: "#666666",
    fontSize: 8,
  },

  progressBackground: {
    height: 8,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#E8E8E8",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  guideHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 10,
  },

  guideTitle: {
    color: "#62A8D0",
    fontSize: 11,
    fontWeight: "500",
  },

  guideDescription: {
    fontSize: 9,
    color: "#888888",
    lineHeight: 14,
    textAlign: "justify",
    marginBottom: 12,
  },

  guideLink: {
    alignSelf: "flex-start",
  },

  guideLinkText: {
    fontSize: 9,
    color: "#5CA6C8",
  },

  footer: {
    alignItems: "center",
    paddingVertical: 9,
  },

  footerText: {
    fontSize: 9,
    color: "#8C8C8C",
  },

  footerVersion: {
    fontSize: 8,
    color: "#AAAAAA",
    marginTop: 3,
  },

  // DRAWER

  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.48)",
  },

  drawer: {
    width: "83%",
    maxWidth: 330,
    height: "100%",
    backgroundColor: "#F8F9F9",
    elevation: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 3,
      height: 0,
    },
  },

  drawerHeader: {
    backgroundColor: "#568995",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  drawerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  drawerLogo: {
    width: 39,
    height: 39,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.17)",
    alignItems: "center",
    justifyContent: "center",
  },

  drawerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  drawerSubtitle: {
    color: "#E3EFF1",
    fontSize: 10,
    marginTop: 2,
  },

  closeButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  drawerUser: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },

  drawerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: "#E5F0F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  drawerUserInfo: {
    flex: 1,
  },

  drawerUsername: {
    color: "#444444",
    fontSize: 12,
    fontWeight: "700",
  },

  drawerEmail: {
    color: "#999999",
    fontSize: 9,
    marginTop: 4,
  },

  menuLabel: {
    color: "#999999",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 17,
    paddingBottom: 9,
  },

  drawerMenu: {
    paddingHorizontal: 11,
    paddingBottom: 15,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    minHeight: 45,
    borderRadius: 7,
    marginBottom: 4,
    backgroundColor: "#FFFFFF",
    gap: 11,
  },

  menuItemText: {
    flex: 1,
    color: "#555555",
    fontSize: 10,
    fontWeight: "500",
  },

  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    padding: 13,
    alignItems: "center",
  },

  drawerFooterText: {
    fontSize: 9,
    color: "#A0A0A0",
  },
});
