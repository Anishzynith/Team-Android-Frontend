import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../service/auth";

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const fullName = `${user?.first_name || ""} ${
    user?.last_name || ""
  }`.trim();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Dashboard
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.profileName}>
          {fullName || "User"}
        </Text>

        <Text style={styles.profileEmail}>
          {user?.email}
        </Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push(
              "/(app)/profile/edit"
            )
          }
        >
          <Text style={styles.editButtonText}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>
          Account Information
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            First Name
          </Text>

          <Text style={styles.infoValue}>
            {user?.first_name || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Last Name
          </Text>

          <Text style={styles.infoValue}>
            {user?.last_name || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Username
          </Text>

          <Text style={styles.infoValue}>
            {user?.username || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Email
          </Text>

          <Text style={styles.infoValue}>
            {user?.email || "N/A"}
          </Text>
        </View>
        
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Gender
            </Text>

            <Text style={styles.infoValue}>
              {user?.profile?.gender || "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Blood Group
            </Text>

            <Text style={styles.infoValue}>
              {user?.profile?.blood_group || "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Phone
            </Text>

            <Text style={styles.infoValue}>
              {user?.phone_number || user?.profile?.phone_number || "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Date of Birth
            </Text>

            <Text style={styles.infoValue}>
              {user?.profile?.date_of_birth || "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Height
            </Text>

            <Text style={styles.infoValue}>
              
              {user?.profile?.height_cm ? `${user.profile.height_cm} cm` : "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Weight
            </Text>

            <Text style={styles.infoValue}>
              {user?.profile?.weight_kg ? `${user.profile.weight_kg} kg` : "N/A"}
            </Text>
          </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  logoutText: {
    color: "#FF3B30",
    fontWeight: "600",
    fontSize: 16,
  },

  profileCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },

  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },

  profileEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },

  editButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  infoSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  infoLabel: {
    width: 100,
    fontWeight: "bold",
    color: "#333",
  },

  infoValue: {
    flex: 1,
    color: "#666",
  },
});