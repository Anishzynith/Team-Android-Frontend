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
import { GradientHeader } from "../../components/GradientHeader";
import { AppCard } from "../../components/AppCard";
import { StatCard } from "../../components/StatCard";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { BorderRadius, Colors, Spacing, Typography } from "../../constants/theme";

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

  // Example stats – replace with real HRMS data from your API
  const stats = {
    totalEmployees: 156,
    presentToday: 132,
    onLeave: 12,
    pendingRequests: 8,
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Dashboard"
        subtitle={`Welcome back, ${fullName || "User"}`}
        rightIcon={
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<Text>👥</Text>}
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={<Text>✅</Text>}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="On Leave"
            value={stats.onLeave}
            icon={<Text>🏖️</Text>}
          />
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={<Text>📋</Text>}
          />
        </View>

        {/* Quick Actions */}
        <AppCard variant="elevated" padding={Spacing.md} style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push("/(app)/profile/edit")}
            >
              <View style={styles.actionIcon}>
                <Text>👤</Text>
              </View>
              <Text style={styles.actionLabel}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {}}
            >
              <View style={styles.actionIcon}>
                <Text>📋</Text>
              </View>
              <Text style={styles.actionLabel}>Apply Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {}}
            >
              <View style={styles.actionIcon}>
                <Text>⏱️</Text>
              </View>
              <Text style={styles.actionLabel}>Timesheet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {}}
            >
              <View style={styles.actionIcon}>
                <Text>💰</Text>
              </View>
              <Text style={styles.actionLabel}>Payroll</Text>
            </TouchableOpacity>
          </View>
        </AppCard>

        {/* Recent Activity */}
        <AppCard variant="elevated" padding={Spacing.md}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>John Doe applied for annual leave</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Jane Smith checked in at 9:00 AM</Text>
            <Text style={styles.activityTime}>4 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Payroll for March processed</Text>
            <Text style={styles.activityTime}>Yesterday</Text>
          </View>
        </AppCard>

        <View style={styles.profileLink}>
          <PrimaryButton
            title="View Full Profile"
            onPress={() => router.push("/(app)/profile")}
            variant="outline"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  logoutText: {
    color: Colors.primary,
    ...Typography.button,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  quickActionsCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionItem: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  activityItem: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityText: {
    ...Typography.bodySmall,
    color: Colors.text,
  },
  activityTime: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  profileLink: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
});