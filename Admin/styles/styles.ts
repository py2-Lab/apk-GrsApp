import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F6",
    paddingTop: 48,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  headerIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#238B57",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#183D2A",
  },
  subtitle: {
    fontSize: 11,
    color: "#829187",
    marginTop: 3,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E4EBE6",
  },
  summary: {
    flexDirection: "row",
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 25,
  },
  summaryCard: {
    flex: 1,
    minHeight: 86,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E9EFEB",
  },
  summaryNumber: {
    fontSize: 21,
    fontWeight: "800",
    color: "#284D37",
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 9,
    color: "#849188",
    marginTop: 3,
    textAlign: "center",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#203D2C",
  },
  sectionSubtitle: {
    fontSize: 11,
    color: "#87948B",
    marginTop: 4,
  },
  filters: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 7,
    marginBottom: 13,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#E9EFEB",
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#238B57",
  },
  filterText: {
    color: "#64756A",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 35,
    flexGrow: 1,
  },
  adminCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E7EEE9",
  },
  adminInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#E2F1E7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#238B57",
  },
  adminDetails: {
    flex: 1,
  },
  username: {
    fontSize: 13,
    fontWeight: "800",
    color: "#263E30",
  },
  email: {
    fontSize: 10,
    color: "#75847A",
    marginTop: 3,
  },
  date: {
    fontSize: 9,
    color: "#9AA59E",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    marginLeft: 5,
  },
  pendingBadge: {
    backgroundColor: "#FFF3D8",
  },
  approvedBadge: {
    backgroundColor: "#DDF3E5",
  },
  rejectedBadge: {
    backgroundColor: "#FCE4E4",
  },
  statusText: {
    fontSize: 8,
    fontWeight: "800",
  },
  pendingText: {
    color: "#B47A16",
  },
  approvedText: {
    color: "#238B57",
  },
  rejectedText: {
    color: "#CC4D4D",
  },
  actions: {
    flexDirection: "row",
    gap: 7,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEF2EF",
  },
  actionButton: {
    flex: 1,
    minHeight: 36,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  approveButton: {
    backgroundColor: "#238B57",
  },
  rejectButton: {
    backgroundColor: "#D95B5B",
  },
  deleteButton: {
    backgroundColor: "#66736B",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  processing: {
    marginTop: 14,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#52675A",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 11,
    color: "#91A096",
    marginTop: 7,
    textAlign: "center",
  },
});
