import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  ShieldCheck,
  RefreshCw,
  Check,
  X,
  Trash2,
  LogOut,
  Users,
} from "lucide-react-native";

import { superAdminApi } from "../../../services/api";
import { styles } from "../../../styles/styles";

type AdminAccount = {
  _id: string;
  username: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function SuperAdminScreen() {
  const router = useRouter();

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadAdmins = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const token = await SecureStore.getItemAsync("authToken");

        if (!token) {
          Alert.alert("Sesi berakhir", "Silakan login kembali.", [
            {
              text: "OK",
              onPress: () => router.replace("/login"),
            },
          ]);
          return;
        }

        const result = await superAdminApi.getAdmins(token);
        setAdmins(result.users);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gagal mengambil data Admin.";

        Alert.alert("Gagal memuat data", message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router],
  );

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const updateStatus = (
    admin: AdminAccount,
    status: "approved" | "rejected",
  ) => {
    const action = status === "approved" ? "menyetujui" : "menolak";

    Alert.alert("Konfirmasi", `Yakin ingin ${action} akun ${admin.username}?`, [
      { text: "Batal", style: "cancel" },
      {
        text: status === "approved" ? "Approve" : "Deny",
        style: status === "rejected" ? "destructive" : "default",
        onPress: async () => {
          try {
            setProcessingId(admin._id);

            const token = await SecureStore.getItemAsync("authToken");
            if (!token) throw new Error("Sesi login tidak ditemukan.");

            await superAdminApi.updateStatus(admin._id, status, token);
            await loadAdmins(true);

            Alert.alert(
              "Berhasil",
              status === "approved"
                ? "Akun Admin berhasil disetujui."
                : "Pendaftaran Admin berhasil ditolak.",
            );
          } catch (error) {
            Alert.alert(
              "Gagal",
              error instanceof Error
                ? error.message
                : "Tindakan gagal dilakukan.",
            );
          } finally {
            setProcessingId(null);
          }
        },
      },
    ]);
  };

  const deleteAdmin = (admin: AdminAccount) => {
    Alert.alert(
      "Hapus akun Admin",
      `Akun ${admin.username} akan dihapus permanen. Lanjutkan?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessingId(admin._id);

              const token = await SecureStore.getItemAsync("authToken");
              if (!token) throw new Error("Sesi login tidak ditemukan.");

              await superAdminApi.deleteAdmin(admin._id, token);
              await loadAdmins(true);

              Alert.alert("Berhasil", "Akun Admin berhasil dihapus.");
            } catch (error) {
              Alert.alert(
                "Gagal",
                error instanceof Error ? error.message : "Akun gagal dihapus.",
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Yakin ingin keluar dari akun Super Admin?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("authToken");
          await SecureStore.deleteItemAsync("authUser");
          router.replace("/login");
        },
      },
    ]);
  };

  const filteredAdmins =
    filter === "all"
      ? admins
      : admins.filter((admin) => admin.status === filter);

  const counts = {
    all: admins.length,
    pending: admins.filter((item) => item.status === "pending").length,
    approved: admins.filter((item) => item.status === "approved").length,
    rejected: admins.filter((item) => item.status === "rejected").length,
  };

  const renderAdmin = ({ item }: { item: AdminAccount }) => {
    const busy = processingId === item._id;

    return (
      <View style={styles.adminCard}>
        <View style={styles.adminInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.username.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.adminDetails}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.date}>
              Terdaftar: {new Date(item.createdAt).toLocaleDateString("id-ID")}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              item.status === "pending" && styles.pendingBadge,
              item.status === "approved" && styles.approvedBadge,
              item.status === "rejected" && styles.rejectedBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === "pending" && styles.pendingText,
                item.status === "approved" && styles.approvedText,
                item.status === "rejected" && styles.rejectedText,
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {busy ? (
          <ActivityIndicator style={styles.processing} color="#238B57" />
        ) : (
          <View style={styles.actions}>
            {item.status === "pending" && (
              <>
                <Pressable
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => updateStatus(item, "approved")}
                >
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Approve</Text>
                </Pressable>

                <Pressable
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => updateStatus(item, "rejected")}
                >
                  <X size={16} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Deny</Text>
                </Pressable>
              </>
            )}

            <Pressable
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => deleteAdmin(item)}
            >
              <Trash2 size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Hapus</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <View style={styles.headerIcon}>
            <ShieldCheck size={25} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.title}>Super Admin</Text>
            <Text style={styles.subtitle}>Manajemen akun Admin GrsApp</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} onPress={() => loadAdmins(true)}>
            <RefreshCw size={19} color="#267A4B" />
          </Pressable>

          <Pressable style={styles.iconButton} onPress={handleLogout}>
            <LogOut size={19} color="#D64B4B" />
          </Pressable>
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Users size={19} color="#56836A" />
          <Text style={styles.summaryNumber}>{counts.all}</Text>
          <Text style={styles.summaryLabel}>Semua Admin</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: "#C58B22" }]}>
            {counts.pending}
          </Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: "#238B57" }]}>
            {counts.approved}
          </Text>
          <Text style={styles.summaryLabel}>Approved</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: "#D64B4B" }]}>
            {counts.rejected}
          </Text>
          <Text style={styles.summaryLabel}>Rejected</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daftar Pendaftaran</Text>
        <Text style={styles.sectionSubtitle}>
          Kelola akun Admin yang terdaftar
        </Text>
      </View>

      <View style={styles.filters}>
        {(["pending", "approved", "rejected", "all"] as FilterStatus[]).map(
          (status) => (
            <Pressable
              key={status}
              style={[
                styles.filterButton,
                filter === status && styles.activeFilter,
              ]}
              onPress={() => setFilter(status)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === status && styles.activeFilterText,
                ]}
              >
                {status === "all" ? "Semua" : status}
              </Text>
            </Pressable>
          ),
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#238B57" />
          <Text style={styles.emptyText}>Memuat data Admin...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAdmins}
          keyExtractor={(item) => item._id}
          renderItem={renderAdmin}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadAdmins(true)}
              colors={["#238B57"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Users size={36} color="#A5B5AA" />
              <Text style={styles.emptyTitle}>Belum ada akun</Text>
              <Text style={styles.emptyText}>
                Tidak ada akun Admin pada kategori ini.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
