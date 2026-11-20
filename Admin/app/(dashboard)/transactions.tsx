import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Share,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Receipt,
  RefreshCw,
} from "lucide-react-native";

import { adminApi } from "../../services/api";
import { styles } from "../../styles/transaction";

type Transaction = {
  _id: string;
  reference: string;
  userName: string;
  userEmail: string;
  paymentMethod: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
  transactionDate: string;
};

type Summary = {
  totalTransactions: number;
  totalAmount: number;
  previousAmount: number;
  growth: number;
};

type Period = "7d" | "30d" | "all";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const statusLabel = {
  paid: "Berhasil",
  pending: "Pending",
  failed: "Gagal",
  refunded: "Refund",
};

export default function TransactionsScreen() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalTransactions: 0,
    totalAmount: 0,
    previousAmount: 0,
    growth: 0,
  });

  const [period, setPeriod] = useState<Period>("7d");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const token = await SecureStore.getItemAsync("authToken");

        if (!token) {
          Alert.alert("Sesi berakhir", "Silakan login kembali.");
          router.replace("/login");
          return;
        }

        const result = await adminApi.getTransactions(
          {
            period,
            search: appliedSearch,
            page,
            limit: 10,
          },
          token,
        );

        setTransactions(result.transactions);
        setSummary(result.summary);
        setTotalPages(result.totalPages);
      } catch (error) {
        Alert.alert(
          "Gagal memuat transaksi",
          error instanceof Error ? error.message : "Terjadi kesalahan.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [period, appliedSearch, page, router],
  );

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const applySearch = () => {
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const changePeriod = (value: Period) => {
    setPeriod(value);
    setPage(1);
  };

  const showDetail = (item: Transaction) => {
    Alert.alert(
      "Detail Transaksi",
      [
        `ID: ${item.reference || item._id}`,
        `Pengguna: ${item.userName}`,
        `Email: ${item.userEmail || "-"}`,
        `Tanggal: ${formatDate(item.transactionDate)}`,
        `Metode: ${item.paymentMethod}`,
        `Jumlah: ${formatRupiah(item.amount)}`,
        `Status: ${statusLabel[item.status]}`,
      ].join("\n\n"),
      [{ text: "Tutup" }],
    );
  };

  const exportTransactions = async () => {
    try {
      if (transactions.length === 0) {
        Alert.alert("Tidak ada data", "Belum ada transaksi untuk diekspor.");
        return;
      }

      const header = [
        "Tanggal",
        "ID Transaksi",
        "Nama User",
        "Metode Pembayaran",
        "Jumlah",
        "Status",
      ];

      const rows = transactions.map((item) => [
        formatDate(item.transactionDate),
        item.reference || item._id,
        item.userName,
        item.paymentMethod,
        item.amount,
        item.status,
      ]);

      const escapeCSV = (value: unknown) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

      const csv = [header, ...rows]
        .map((row) => row.map(escapeCSV).join(","))
        .join("\n");

      await Share.share({
        title: "Data Transaksi GrsApp",
        message: csv,
      });
    } catch (error) {
      Alert.alert(
        "Ekspor gagal",
        error instanceof Error ? error.message : "Gagal mengekspor data.",
      );
    }
  };

  const renderTransaction = (item: Transaction) => (
    <View style={styles.transactionRow} key={item._id}>
      <View style={styles.dateColumn}>
        <Text style={styles.dateText}>{formatDate(item.transactionDate)}</Text>
        <Text style={styles.referenceText}>
          {(item.reference || item._id).slice(-9)}
        </Text>
      </View>

      <View style={styles.methodColumn}>
        <Text style={styles.methodText} numberOfLines={1}>
          {item.paymentMethod}
        </Text>
        <Text style={styles.userText} numberOfLines={1}>
          {item.userName}
        </Text>
      </View>

      <View style={styles.amountColumn}>
        <Text style={styles.amountText}>{formatRupiah(item.amount)}</Text>

        <View
          style={[
            styles.statusBadge,
            item.status === "paid" && styles.statusPaid,
            item.status === "pending" && styles.statusPending,
            item.status === "failed" && styles.statusFailed,
            item.status === "refunded" && styles.statusRefunded,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === "paid" && { color: "#268B55" },
              item.status === "pending" && { color: "#B78A27" },
              item.status === "failed" && { color: "#D34D4D" },
              item.status === "refunded" && { color: "#6384B2" },
            ]}
          >
            {statusLabel[item.status]}
          </Text>
        </View>
      </View>

      <Pressable style={styles.detailButton} onPress={() => showDetail(item)}>
        <Text style={styles.detailText}>Detail</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft color="#FFFFFF" size={23} />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Data Transaksi</Text>
          <Text style={styles.headerSubtitle}>
            Riwayat transaksi pengguna GrsApp
          </Text>
        </View>

        <Pressable
          style={styles.refreshButton}
          onPress={() => loadTransactions(true)}
        >
          <RefreshCw color="#FFFFFF" size={18} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadTransactions(true)}
            colors={["#568995"]}
          />
        }
        contentContainerStyle={styles.content}
      >
        {/* SUMMARY */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Wallet size={22} color="#568995" />
          </View>

          <Text style={styles.summaryLabel}>Total Transaksi Masuk</Text>

          <Text style={styles.summaryValue}>
            {formatRupiah(summary.totalAmount)}
          </Text>

          <Text style={styles.summaryDescription}>
            {summary.totalTransactions} transaksi tercatat
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeading}>
              <TrendingUp size={17} color="#55AC76" />
              <Text style={styles.statLabel}>Perubahan Periode</Text>
            </View>

            <Text
              style={[
                styles.statValue,
                { color: summary.growth >= 0 ? "#55AC76" : "#D65B5B" },
              ]}
            >
              {summary.growth > 0 ? "+" : ""}
              {summary.growth.toFixed(1)}%
            </Text>

            <Text style={styles.statDescription}>
              Dibanding periode sebelumnya
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeading}>
              <Receipt size={17} color="#568995" />
              <Text style={styles.statLabel}>Jumlah Transaksi</Text>
            </View>

            <Text style={styles.statValue}>{summary.totalTransactions}</Text>

            <Text style={styles.statDescription}>Pada periode terpilih</Text>
          </View>
        </View>

        {/* PERIOD FILTER */}

        <View style={styles.filterHeading}>
          <View>
            <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
            <Text style={styles.sectionDescription}>
              Pantau transaksi seluruh pengguna.
            </Text>
          </View>
        </View>

        <View style={styles.periodContainer}>
          {(
            [
              ["7d", "7 Hari Terakhir"],
              ["30d", "30 Hari Terakhir"],
              ["all", "Semua"],
            ] as [Period, string][]
          ).map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() => changePeriod(value)}
              style={[
                styles.periodButton,
                period === value && styles.periodActive,
              ]}
            >
              <CalendarDays
                size={13}
                color={period === value ? "#FFFFFF" : "#568995"}
              />

              <Text
                style={[
                  styles.periodText,
                  period === value && styles.periodTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* SEARCH */}

        <View style={styles.searchContainer}>
          <Search size={19} color="#888888" />

          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama user / ID transaksi..."
            placeholderTextColor="#999999"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={applySearch}
            returnKeyType="search"
          />

          <Pressable onPress={applySearch}>
            <Text style={styles.searchAction}>Cari</Text>
          </Pressable>
        </View>

        {/* EXPORT */}

        <Pressable style={styles.exportButton} onPress={exportTransactions}>
          <Download size={17} color="#FFFFFF" />
          <Text style={styles.exportText}>Export Data</Text>
        </Pressable>

        {/* TABLE */}

        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeading, { flex: 1.1 }]}>Tanggal</Text>
            <Text style={[styles.tableHeading, { flex: 1.3 }]}>
              Metode / User
            </Text>
            <Text style={[styles.tableHeading, { flex: 1.2 }]}>Jumlah</Text>
            <Text style={[styles.tableHeading, { width: 51 }]}>Aksi</Text>
          </View>

          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#568995" />
              <Text style={styles.emptyText}>Memuat transaksi...</Text>
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Building2 size={35} color="#A6B7B9" />
              <Text style={styles.emptyTitle}>Belum Ada Transaksi</Text>
              <Text style={styles.emptyText}>
                Data transaksi akan muncul di sini setelah tersedia.
              </Text>
            </View>
          ) : (
            transactions.map(renderTransaction)
          )}
        </View>

        {/* PAGINATION */}

        <View style={styles.pagination}>
          <Pressable
            style={[styles.pageButton, page <= 1 && styles.pageDisabled]}
            disabled={page <= 1}
            onPress={() => setPage((previous) => previous - 1)}
          >
            <ChevronLeft size={17} color="#568995" />
          </Pressable>

          <Text style={styles.pageText}>
            Halaman {page} dari {totalPages}
          </Text>

          <Pressable
            style={[
              styles.pageButton,
              page >= totalPages && styles.pageDisabled,
            ]}
            disabled={page >= totalPages}
            onPress={() => setPage((previous) => previous + 1)}
          >
            <ChevronRight size={17} color="#568995" />
          </Pressable>
        </View>

        <Text style={styles.footer}>GrsApp Transaction Management</Text>
      </ScrollView>
    </View>
  );
}

