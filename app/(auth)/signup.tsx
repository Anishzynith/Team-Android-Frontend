import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { authAPI } from "../../service/api";
import { useAuth } from "../../service/auth";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SignupScreen() {
  const { googleSignupData, setGoogleSignupData } = useAuth();
  
  const hasGoogleData = googleSignupData !== null;

  const [firstName, setFirstName] = useState(
    googleSignupData?.first_name || ""
  );
  const [lastName, setLastName] = useState(
    googleSignupData?.last_name || ""
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(
    googleSignupData?.email || ""
  );
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [unitSystem, setUnitSystem] = useState("metric");

  const [loading, setLoading] = useState(false);

  const bloodGroups = [
    { label: "Select Blood Group", value: "" },
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ];

  const genderOptions = [
    { label: "Select Gender", value: "" },
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
    { label: "Prefer not to say", value: "prefer_not" },
  ];

  const unitSystemOptions = [
    { label: "Metric (kg, cm)", value: "metric" },
    { label: "Imperial (lbs, ft)", value: "imperial" },
  ];

  useEffect(() => {
    return () => {
      if (googleSignupData) {
        setGoogleSignupData(null);
      }
    };
  }, []);

  const handleSignup = async () => {
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !password2 ||
      !gender ||
      !bloodGroup ||
      !phoneNumber ||
      !dateOfBirth
    ) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }

    if (password !== password2) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    if (phoneNumber.length < 10) {
      Alert.alert("Validation Error", "Please enter a valid phone number");
      return;
    }

    const signupData = {
      email: email.trim(),
      username: username.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      password,
      password2,
      phone_number: phoneNumber.trim(),
      date_of_birth: dateOfBirth.toISOString().split("T")[0],
      gender,
      blood_group: bloodGroup,
      unit_system: unitSystem,
    };

    try {
      setLoading(true);
      console.log("========== SIGNUP REQUEST ==========");
      console.log(signupData);

      const response = await authAPI.signup(signupData);

      console.log("========== SIGNUP RESPONSE ==========");
      console.log(response.data);

      Alert.alert(
        "Success",
        response?.data?.message || "OTP sent to your email"
      );

      router.push({
        pathname: "/verify-otp",
        params: {
          email: signupData.email,
        },
      });
    } catch (error: any) {
      console.log("========== SIGNUP ERROR ==========");
      console.log(error);

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
          errorMessage = JSON.stringify(data.errors, null, 2);
        } else {
          errorMessage = JSON.stringify(data, null, 2);
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Sign Up</Text>

      {hasGoogleData && (
        <View style={styles.googleInfoContainer}>
          <Text style={styles.googleInfoText}>
            🔵 Signing up with Google
          </Text>
          <Text style={styles.googleInfoSubtext}>
            Your email has been pre-filled from Google.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Personal Information</Text>

      <TextInput
        placeholder="First Name *"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <TextInput
        placeholder="Last Name *"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <TextInput
        placeholder="Username *"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Email *"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={[styles.input, hasGoogleData && styles.disabledInput]}
        editable={!hasGoogleData}
      />

      <TextInput
        placeholder="Phone Number *"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={dateOfBirth ? styles.dateText : styles.datePlaceholder}>
          {dateOfBirth ? formatDate(dateOfBirth) : "Date of Birth *"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          {genderOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={bloodGroup}
          onValueChange={(itemValue) => setBloodGroup(itemValue)}
          style={styles.picker}
        >
          {bloodGroups.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={unitSystem}
          onValueChange={(itemValue) => setUnitSystem(itemValue)}
          style={styles.picker}
        >
          {unitSystemOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>Password</Text>

      <TextInput
        placeholder="Password *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password *"
        value={password2}
        onChangeText={setPassword2}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} disabled={loading}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F7FC",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  datePlaceholder: {
    fontSize: 16,
    color: "#999",
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
    marginBottom: 30,
  },
  googleInfoContainer: {
    backgroundColor: "#e8f0fe",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4285F4",
  },
  googleInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  googleInfoSubtext: {
    fontSize: 13,
    color: "#666",
  },
});