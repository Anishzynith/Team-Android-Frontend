import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { authAPI } from "../../service/api";

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams();

  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleReset = async () => {
    if (!otpCode.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter OTP"
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter a new password"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Validation Error",
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      await authAPI.passwordResetConfirm({
        email: email as string,
        otp_code: otpCode,
        password,
        password2: confirmPassword,
      });

      Alert.alert(
        "Success",
        "Password reset successful",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace(
                "/(auth)/login"
              ),
          },
        ]
      );
    } catch (error: any) {
      console.log(
        "Reset Password Error:",
        error?.response?.data
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Reset Password
      </Text>

      <Text style={styles.subtitle}>
        Enter the OTP sent to your email
        and create a new password.
      </Text>

      <TextInput
        placeholder="OTP Code"
        value={otpCode}
        onChangeText={setOtpCode}
        style={styles.input}
        keyboardType="number-pad"
      />

      <TextInput
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={handleReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Reset Password
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.replace("/(auth)/login")
        }
      >
        <Text style={styles.backText}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
    fontSize: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  backText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
});