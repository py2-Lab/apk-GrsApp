
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  UserRound,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Monitor,
  MessageSquare,
  Database,
  Pencil,
  Save,
  Settings,
  ChevronLeft,
} from "lucide-react-native";

import { adminApi } from "../../services/api";
import { styles } from "../../styles/profile";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ProfileData = {
  username: string;
  email: string;
  fullName: string;
  location: string;
  education: string;
  monitoring: string;
  dailyFeedback: string;
  crudCount: string;
};

const initialProfile: ProfileData = {
  username: "",
  email: "",
  fullName: "",
  location: "",
  education: "",
  monitoring: "Admin Sistem",
  dailyFeedback: "5 - 10 Feedback",
  crudCount: "10 - 30 Data",
};

export default function ProfileAdminScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");

      if (!token) {
        Alert.alert("Sesi berakhir", "Silakan login kembali.");
        router.replace("/login");
        return;
      }

      const result = await adminApi.getProfile(token);

      setProfile({
        ...initialProfile,
        ...result.profile,
      });
    } catch (error) {
      Alert.alert(
        "Gagal memuat profil",
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    field: keyof ProfileData,
    value: string
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      if (!profile.username.trim()) {
        Alert.alert("Perhatian", "Username tidak boleh kosong.");
        return;
      }

      const token = await SecureStore.getItemAsync("authToken");

      if (!token) {
        throw new Error("Sesi login tidak ditemukan.");
      }

      setSaving(true);

      const result = await adminApi.updateProfile(
        {
          username: profile.username.trim(),
          fullName: profile.fullName.trim(),
          location: profile.location.trim(),
          education: profile.education.trim(),
          monitoring: profile.monitoring.trim(),
          dailyFeedback: profile.dailyFeedback.trim(),
          crudCount: profile.crudCount.trim(),
        },
        token
      );

      setProfile({
        ...initialProfile,
        ...result.profile,
      });

      setEditing(false);

      Alert.alert("Berhasil", "Profil Admin berhasil diperbarui.");
    } catch (error) {
      Alert.alert(
        "Gagal menyimpan",
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderField = (
    label: string,
    field: keyof ProfileData,
    Icon: React.ComponentType<any>
  ) => (
    <View style={styles.fieldRow} key={field}>
      <View style={styles.fieldIcon}>
        <Icon size={17} color="#568995" />
      </View>

      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>

        {editing ? (
          <TextInput
            style={styles.input}
            value={profile[field]}
            onChangeText={(value) => updateField(field, value)}
            placeholder={`Masukkan ${label.toLowerCase()}`}
            placeholderTextColor="#A0A9AA"
          />
        ) : (
          <Text style={styles.fieldValue}>
            {profile[field] || "-"}
          </Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#568995" />
        <Text style={styles.loadingText}>Memuat profil Admin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}

      <View
        style={[
          styles.header,
          {
            height: 53 + insets.top,
            paddingTop: insets.top,
          },
        ]}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.headerTitle}>Profile Admin</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* PROFILE COVER */}

        <View style={styles.cover}>
          <View style={styles.coverDecoration} />

          <View style={styles.avatar}>
            <UserRound size={43} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.identity}>
          <Text style={styles.name}>
            {profile.fullName || profile.username}
          </Text>

          <Text style={styles.email}>{profile.email}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>ADMIN GR SAPP</Text>
          </View>
        </View>

        {/* PROFILE DETAILS */}

        <View style={styles.card}>
          <View style={styles.cardHeading}>
            <View style={styles.headingIcon}>
              <UserRound size={20} color="#FFFFFF" />
            </View>

            <View style={styles.headingText}>
              <Text style={styles.cardTitle}>Detail Profile</Text>
              <Text style={styles.cardDescription}>
                Informasi dasar akun Anda.
              </Text>
            </View>

            <Pressable
              style={styles.editButton}
              onPress={() => setEditing(!editing)}
            >
              <Pencil size={13} color="#FFFFFF" />
              <Text style={styles.editText}>{editing ? "Batal" : "Edit"}</Text>
            </Pressable>
          </View>

          {renderField("Nama Lengkap", "fullName", UserRound)}
          {renderField("Username", "username", UserRound)}
          {renderField("Lokasi", "location", MapPin)}
          {renderField("Jenjang Pendidikan", "education", GraduationCap)}
        </View>

        {/* JOB DETAILS */}

        <View style={styles.card}>
          <View style={styles.cardHeading}>
            <View style={[styles.headingIcon, { backgroundColor: "#568995" }]}>
              <BriefcaseBusiness size={20} color="#FFFFFF" />
            </View>

            <View style={styles.headingText}>
              <Text style={styles.cardTitle}>Detail Pekerjaan</Text>
              <Text style={styles.cardDescription}>
                Informasi pekerjaan dan aktivitas.
              </Text>
            </View>
          </View>

          {renderField("Monitoring", "monitoring", Monitor)}
          {renderField("Feedback Per-hari", "dailyFeedback", MessageSquare)}
          {renderField("Jumlah CRUD", "crudCount", Database)}
        </View>

        {/* SAVE */}

        {editing && (
          <Pressable
            style={styles.saveButton}
            onPress={saveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Save size={17} color="#FFFFFF" />
                <Text style={styles.saveText}>Simpan Perubahan</Text>
              </>
            )}
          </Pressable>
        )}

        {/* ADVANCED SETTINGS */}

        <Pressable
          style={styles.settingsButton}
          onPress={() =>
            Alert.alert(
              "Pengaturan Lanjutan",
              "Pengaturan keamanan, preferensi akun, dan informasi sistem akan dikembangkan pada tahap berikutnya.",
            )
          }
        >
          <Settings size={18} color="#FFFFFF" />
          <Text style={styles.settingsText}>Pengaturan Lanjutan</Text>
        </Pressable>

        <Text style={styles.footer}>GrsApp Admin Management System</Text>
      </ScrollView>
    </View>
  );
}

