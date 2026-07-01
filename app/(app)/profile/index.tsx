import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../../service/auth";

export default function ProfileScreen() {
  const { user } = useAuth();

  const fullName = `${user?.first_name || ""} ${
    user?.last_name || ""
  }`.trim();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        My Profile
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          First Name
        </Text>

        <Text style={styles.value}>
          {user?.first_name || "N/A"}
        </Text>

        <Text style={styles.label}>
          Last Name
        </Text>

        <Text style={styles.value}>
          {user?.last_name || "N/A"}
        </Text>

        <Text style={styles.label}>
          Username
        </Text>

        <Text style={styles.value}>
          {user?.username || "N/A"}
        </Text>

        <Text style={styles.label}>
          Email
        </Text>

        <Text style={styles.value}>
          {user?.email || "N/A"}
        </Text>

        <Text style={styles.label}>
          Phone
        </Text>

        <Text style={styles.value}>
          {user?.phone_number || user?.profile?.phone_number || "N/A"}
        </Text>

        <Text style={styles.label}>
          Date of Birth
        </Text>

        <Text style={styles.value}>
          {user?.profile?.date_of_birth || "N/A"}
        </Text>

        <Text style={styles.label}>
          Height
        </Text>

        <Text style={styles.value}>
          {user?.profile?.height_cm ? `${user.profile.height_cm} cm` : "N/A"}
        </Text>

        <Text style={styles.label}>
          Weight
        </Text>

        <Text style={styles.value}>
          {user?.profile?.weight_kg ? `${user.profile.weight_kg} kg` : "N/A"}
        </Text>
        <Text style={styles.label}>
          Gender
        </Text>

        <Text style={styles.value}>
          {user?.profile?.gender || "N/A"}
        </Text>

        <Text style={styles.label}>
          Blood Group
        </Text>

        <Text style={styles.value}>
          {user?.profile?.blood_group || "N/A"}
        </Text>

        <Text style={styles.label}>
          Full Name
        </Text>

        <Text style={styles.value}>
          {fullName || "N/A"}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push(
              "/(app)/profile/edit"
            )
          }
        >
          <Text style={styles.buttonText}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },

  label: {
    fontWeight: "bold",
    marginTop: 12,
    color: "#555",
  },

  value: {
    fontSize: 16,
    marginTop: 5,
    color: "#222",
  },

  button: {
    marginTop: 25,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});