
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { styles } from "../../styles/home";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Menu,
  Bell,
  MessageSquare,
  UserRound,
  X,
  UsersRound,
  Wallet,
  AlertCircle,
  CalendarDays,
  FolderKanban,
  ChevronRight,
  FileText,
  ShoppingBag,
  Globe,
  ClipboardList,
  Newspaper,
  PencilLine,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react-native";

// ========================================
// TYPES
// ========================================

type AdminUser = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "superadmin";
};

type MenuItem = {
  label: string;
  route: Href;
  icon: React.ComponentType<any>;
};

// ========================================
// NAVIGATION - 9 HALAMAN ADMIN
// ========================================

const adminMenu: MenuItem[] = [
  {
    label: "Data Semua User Masuk",
    route: "/(dashboard)/users",
    icon: UsersRound,
  },
  {
    label: "Data Transaksi User",
    route: "/(dashboard)/transactions",
    icon: Wallet,
  },
  {
    label: "Data Keluhan User",
    route: "/(dashboard)/complaints",
    icon: AlertCircle,
  },
  {
    label: "Logs / Anomali User",
    route: "/(dashboard)/logs",
    icon: ClipboardList,
  },
  {
    label: "Create / Edit Produk",
    route: "/(dashboard)/products/create",
    icon: ShoppingBag,
  },
  {
    label: "Content Product Page",
    route: "/(dashboard)/products",
    icon: Newspaper,
  },
  {
    label: "Content Web Official",
    route: "/(dashboard)/contents",
    icon: Globe,
  },
  {
    label: "Create / Edit Konten",
    route: "/(dashboard)/contents/create",
    icon: FileText,
  },
  {
    label: "Profile Page (Admin)",
    route: "/(dashboard)/profile",
    icon: UserRound,
  },
];

// ========================================
// DATA SEMENTARA
// Nantinya diganti dengan response API
// ========================================

const dashboardStats = [
  {
    title: "Jumlah User",
    value: "24 User",
    description: "Pengguna User: 18",
    icon: UsersRound,
    color: "#4BA6C7",
  },
  {
    title: "Jumlah Transaksi",
    value: "Rp. 20 JT",
    description: "Transaksi: 1 Juta",
    icon: Wallet,
    color: "#50B85B",
  },
  {
    title: "Jumlah Keluhan",
    value: "Total: 12",
    description: "Keluhan Keluar: 2 User",
    icon: AlertCircle,
    color: "#A33D42",
  },
  {
    title: "Jumlah Jadwal Event",
    value: "2 Event",
    description: "Jadwal Mendatang: 5 Event",
    icon: CalendarDays,
    color: "#A87545",
  },
];

const projectProgress = [
  {
    title: "Update Maintenance",
    progress: 100,
    color: "#55B95D",
  },
  {
    title: "Aqi Security",
    progress: 70,
    color: "#C5D82F",
  },
  {
    title: "Safety Product",
    progress: 88,
    color: "#55B95D",
  },
  {
    title: "Hacker Trouble",
    progress: 59,
    color: "#A33D42",
  },
];

// ========================================
// MAIN SCREEN
// ========================================

export default function HomeAdminScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedRecap, setSelectedRecap] = useState(1);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  // Ambil informasi Admin dari sesi login yang sudah ada
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const savedUser = await SecureStore.getItemAsync("authUser");

        if (savedUser) {
          setAdmin(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Gagal membaca data Admin:", error);
      }
    };

    loadAdmin();
  }, []);

  // Navigasi halaman
  const navigateTo = (route: Href) => {
    setMenuVisible(false);
    router.push(route);
  };

  // Notifikasi
  const handleNotification = () => {
    Alert.alert(
      "Notifikasi",
      "Belum ada notifikasi baru.",
    );
  };

  // Pesan
  const handleMessage = () => {
    Alert.alert(
      "Pesan",
      "Fitur pesan akan segera tersedia.",
    );
  };

  // Edit rekap
  const handleEditRecap = () => {
    Alert.alert(
      "Edit Rekap Data",
      "Pengaturan rekap data akan dihubungkan pada tahap berikutnya.",
    );
  };

  // Project
  const handleProject = () => {
    Alert.alert(
      "Project Kamu",
      "Detail pengelolaan project akan dikembangkan berikutnya.",
    );
  };

  // Panduan
  const handleGuide = () => {
    Alert.alert(
      "Panduan Kerja Admin",
      "Gunakan menu navigasi untuk mengelola data pengguna, transaksi, keluhan, produk, konten, dan profil Admin.",
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ==================================
          HEADER
      ================================== */}

      <View
        style={[
          styles.header,
          {
            height: 53 + insets.top,
            paddingTop: insets.top,
          },
        ]}
      >
        <Pressable
          style={styles.headerButton}
          onPress={() => setMenuVisible(true)}
        >
          <Menu size={23} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerSpacer} />

        <Pressable style={styles.headerButton} onPress={handleNotification}>
          <Bell size={19} color="#FFFFFF" />
        </Pressable>

        <Pressable style={styles.headerButton} onPress={handleMessage}>
          <MessageSquare size={19} color="#FFFFFF" />
        </Pressable>

        <Pressable
          style={styles.profileButton}
          onPress={() => navigateTo("/(dashboard)/profile")}
        >
          <UserRound size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* DASHBOARD TITLE */}

        <View style={styles.heading}>
          <Text style={styles.pageTitle}>Dashboard</Text>

          <Text style={styles.welcomeText}>
            Selamat datang admin - {admin?.username || "Admin"}
          </Text>

          {/* REKAP BUTTONS */}

          <View style={styles.recapTabs}>
            <Pressable
              onPress={() => setSelectedRecap(1)}
              style={[
                styles.recapTab,
                selectedRecap === 1 && styles.recapTabActive,
              ]}
            >
              <Text
                style={[
                  styles.recapTabText,
                  selectedRecap === 1 && styles.recapTabTextActive,
                ]}
              >
                Rekap Data 1
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedRecap(2)}
              style={[
                styles.recapTab,
                selectedRecap === 2 && styles.recapTabActive,
              ]}
            >
              <Text
                style={[
                  styles.recapTabText,
                  selectedRecap === 2 && styles.recapTabTextActive,
                ]}
              >
                Rekap Data 2
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ==================================
            SUMMARY CARD
        ================================== */}

        <View style={styles.card}>
          <View style={styles.cardHeading}>
            <Text style={styles.cardHeadingText}>Rekap Keseluruhan Data</Text>

            <Pressable style={styles.editButton} onPress={handleEditRecap}>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            {dashboardStats.map((item, index) => {
              const Icon = item.icon;

              return (
                <View key={index} style={styles.statItem}>
                  <View
                    style={[styles.statIcon, { backgroundColor: item.color }]}
                  >
                    <Icon size={20} color="#FFFFFF" strokeWidth={2.2} />
                  </View>

                  <View style={styles.statInfo}>
                    <Text style={styles.statTitle}>{item.title}</Text>

                    <Text style={[styles.statValue, { color: item.color }]}>
                      {item.value}
                    </Text>

                    <Text style={styles.statDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ==================================
            PROJECT SECTION
        ================================== */}

        <Pressable style={styles.projectHeading} onPress={handleProject}>
          <View style={styles.projectHeadingLeft}>
            <View style={styles.projectIcon}>
              <FolderKanban size={17} color="#57A6D1" />
            </View>

            <Text style={styles.projectTitle}>Project Kamu</Text>
          </View>

          <ChevronRight size={21} color="#568995" />
        </Pressable>

        <View style={styles.card}>
          {projectProgress.map((item, index) => (
            <View key={index} style={styles.progressItem}>
              <View style={styles.progressHeading}>
                <Text style={styles.progressTitle}>{item.title}</Text>

                <Text style={styles.progressValue}>{item.progress}%</Text>
              </View>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${item.progress}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* ==================================
            WORK DESCRIPTION
        ================================== */}

        <View style={styles.card}>
          <View style={styles.guideHeading}>
            <ChartNoAxesCombined size={17} color="#55A6D0" />

            <Text style={styles.guideTitle}>Gambaran Kerja</Text>
          </View>

          <Text style={styles.guideDescription}>
            Di website ini kamu bertanggung jawab sebagai admin. Yang dimana
            tugas kamu mengelola berbagai data melalui menu yang tersedia
            seperti mengatur data pengguna, transaksi, keluhan, produk, serta
            konten informasi terbaru website official GrsApp.
          </Text>

          <Pressable onPress={handleGuide} style={styles.guideLink}>
            <Text style={styles.guideLinkText}>
              Lihat panduan yang disediakan →
            </Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>GrsApp Admin Dashboard</Text>
          <Text style={styles.footerVersion}>Admin Panel</Text>
        </View>
      </ScrollView>

      {/* ==================================
          HAMBURGER MENU / DRAWER
      ================================== */}

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* BACKDROP */}

          <Pressable
            style={styles.backdrop}
            onPress={() => setMenuVisible(false)}
          />

          {/* DRAWER */}

          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerBrand}>
                <View style={styles.drawerLogo}>
                  <ShieldCheck size={23} color="#FFFFFF" />
                </View>

                <View>
                  <Text style={styles.drawerTitle}>GrsApp</Text>
                  <Text style={styles.drawerSubtitle}>Admin Panel</Text>
                </View>
              </View>

              <Pressable
                onPress={() => setMenuVisible(false)}
                style={styles.closeButton}
              >
                <X size={22} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* ADMIN INFORMATION */}

            <View style={styles.drawerUser}>
              <View style={styles.drawerAvatar}>
                <UserRound size={23} color="#568995" />
              </View>

              <View style={styles.drawerUserInfo}>
                <Text style={styles.drawerUsername}>
                  {admin?.username || "Admin"}
                </Text>

                <Text style={styles.drawerEmail}>
                  {admin?.email || "admin@grsapp.local"}
                </Text>
              </View>
            </View>

            <Text style={styles.menuLabel}>MENU NAVIGASI</Text>

            {/* 9 OTHER PAGES */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.drawerMenu}
            >
              {adminMenu.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Pressable
                    key={index}
                    style={styles.menuItem}
                    onPress={() => navigateTo(item.route)}
                  >
                    <Icon size={19} color="#568995" />

                    <Text style={styles.menuItemText}>{item.label}</Text>

                    <ChevronRight size={17} color="#A0A0A0" />
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterText}>
                GrsApp Management System
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

