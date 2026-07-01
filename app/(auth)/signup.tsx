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
import { router } from "expo-router";
import { authAPI } from "../../service/api";

export default function SignupScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const signupData = {
      email: email.trim(),
      username: username.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      password,
      password2,
    };

    if (
      !signupData.first_name ||
      !signupData.last_name ||
      !signupData.username ||
      !signupData.email ||
      !signupData.password ||
      !signupData.password2
    ) {
      Alert.alert(
        "Validation Error",
        "Please fill all fields"
      );
      return;
    }

    if (signupData.password !== signupData.password2) {
      Alert.alert(
        "Validation Error",
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      console.log("========== SIGNUP REQUEST ==========");
      console.log(signupData);

      const response = await authAPI.signup(signupData);

      console.log("========== SIGNUP RESPONSE ==========");
      console.log(response.data);

      Alert.alert(
        "Success",
        response?.data?.message ||
          "OTP sent to your email"
      );

      // Navigate to OTP verification first
      router.push({
        pathname: "/verify-otp",
        params: {
          email: signupData.email,
        },
      });
    } catch (error: any) {
      console.log("========== SIGNUP ERROR ==========");
      console.log(error);

      console.log("========== RESPONSE DATA ==========");
      console.log(error?.response?.data);

      let errorMessage = "Something went wrong";

      if (error?.response?.data) {
        const data = error.response.data;

        if (typeof data === "string") {
          errorMessage = data;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.errors) {
          errorMessage = JSON.stringify(
            data.errors,
            null,
            2
          );
        } else {
          errorMessage = JSON.stringify(
            data,
            null,
            2
          );
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        "Signup Failed",
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Sign Up
      </Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        value={password2}
        onChangeText={setPassword2}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Create Account
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.link}>
          Already have an account? Login
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
    backgroundColor: "#F4F7FC",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 20,
  },
});