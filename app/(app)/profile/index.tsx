import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../../service/auth";

export default function ProfileScreen() {
  const { user } = useAuth();

  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

  const getUnitLabel = (unitSystem: string | undefined) => {
    if (unitSystem === 'imperial') return 'Imperial (lbs, ft)';
    return 'Metric (kg, cm)';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>My Profile</Text>

      {/* Profile Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.first_name?.[0] || ""}{user?.last_name?.[0] || ""}
          </Text>
        </View>
        <Text style={styles.name}>{fullName || "User"}</Text>
        <Text style={styles.email}>{user?.email || "No email"}</Text>
      </View>

      {/* Personal Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>{user?.first_name || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>{user?.last_name || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user?.username || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.value}>
            {user?.phone_number || user?.profile?.phone_number || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>
            {formatDate(user?.profile?.date_of_birth)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>
            {user?.profile?.gender || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Blood Group</Text>
          <Text style={styles.value}>
            {user?.profile?.blood_group || "N/A"}
          </Text>
        </View>
      </View>

      {/* Body Measurements */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Body Measurements</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Unit System</Text>
          <Text style={styles.value}>
            {getUnitLabel(user?.profile?.unit_system)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Height</Text>
          <Text style={styles.value}>
            {user?.profile?.height_cm 
              ? `${user.profile.height_cm} ${user?.profile?.unit_system === 'imperial' ? 'ft/in' : 'cm'}`
              : "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.value}>
            {user?.profile?.weight_kg 
              ? `${user.profile.weight_kg} ${user?.profile?.unit_system === 'imperial' ? 'lbs' : 'kg'}`
              : "N/A"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/(app)/profile/edit")}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          // Add logout logic here
        }}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F7FC",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
    color: "#1a1a1a",
  },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgb(9, 255, 0)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 14,
    color: "#666",
    flex: 0.4,
  },
  value: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "500",
    flex: 0.6,
    textAlign: "right",
  },
  editButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  editButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});