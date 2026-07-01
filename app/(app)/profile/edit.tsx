import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Platform,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../../service/auth";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(
    user?.first_name || ""
  );

  const [lastName, setLastName] = useState(
    user?.last_name || ""
  );

  const [username, setUsername] = useState(
    user?.username || ""
  );

  const [dateOfBirth, setDateOfBirth] = useState(
    user?.profile?.date_of_birth || ""
  );
  const [gender, setGender] = useState(
    user?.profile?.gender || ""
  );
  const [bloodGroup, setBloodGroup] = useState(
    user?.profile?.blood_group || ""
  );
  const [heightCm, setHeightCm] = useState(
    user?.profile?.height_cm?.toString() || ""
  );
  const [weightKg, setWeightKg] = useState(
    user?.profile?.weight_kg?.toString() || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phone_number || user?.profile?.phone_number || ""
  );

  const [loading, setLoading] =
    useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showBloodModal, setShowBloodModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
  const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];

  const handleUpdate = async () => {
    if (
      !firstName ||
      !lastName ||
      !username
    ) {
      Alert.alert(
        "Validation Error",
        "All fields are required"
      );
      return;
    }

    try {
      setLoading(true);

      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        username,
        date_of_birth: dateOfBirth || null,
        gender: gender || null,
        blood_group: bloodGroup || null,
        height_cm: heightCm ? Number(heightCm) : null,
        weight_kg: weightKg ? Number(weightKg) : null,
        phone_number: phoneNumber || null,
      });

      Alert.alert(
        "Success",
        "Profile updated successfully"
      );

      router.back();
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Update Failed",
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Edit Profile
      </Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Pressable onPress={() => {
        if (Platform.OS === 'android') {
          const current = dateOfBirth ? new Date(dateOfBirth) : new Date();
          DateTimePickerAndroid.open({
            value: current,
            onChange: (event, selectedDate) => {
              if (!selectedDate) return; // dismissed
              const yyyy = selectedDate.getFullYear();
              const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
              const dd = String(selectedDate.getDate()).padStart(2, '0');
              setDateOfBirth(`${yyyy}-${mm}-${dd}`);
            },
            mode: 'date',
          });
          return;
        }
        setShowDatePicker(true);
      }}>
        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={dateOfBirth}
          editable={false}
        />
      </Pressable>
      {showDatePicker && Platform.OS !== 'android' && (
        <DateTimePicker
          value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
          mode="date"
          display={'spinner'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              const yyyy = selectedDate.getFullYear();
              const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
              const dd = String(selectedDate.getDate()).padStart(2, '0');
              setDateOfBirth(`${yyyy}-${mm}-${dd}`);
            }
          }}
        />
      )}

      <Pressable onPress={() => setShowGenderModal(true)}>
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          editable={false}
        />
      </Pressable>

      <Modal visible={showGenderModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={GENDERS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setGender(item);
                    setShowGenderModal(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowGenderModal(false)} style={styles.modalClose}>
              <Text style={{ color: '#007AFF' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Pressable onPress={() => setShowBloodModal(true)}>
        <TextInput
          style={styles.input}
          placeholder="Blood Group"
          value={bloodGroup}
          editable={false}
        />
      </Pressable>

      <Modal visible={showBloodModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={BLOOD_GROUPS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setBloodGroup(item);
                    setShowBloodModal(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowBloodModal(false)} style={styles.modalClose}>
              <Text style={{ color: '#007AFF' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={heightCm}
        onChangeText={setHeightCm}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weightKg}
        onChangeText={setWeightKg}
        keyboardType="numeric"
      />

      <TextInput
        style={[
          styles.input,
          styles.disabledInput,
        ]}
        value={user?.email || ""}
        editable={false}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Update Profile
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#777",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalClose: {
    marginTop: 12,
    alignSelf: 'center',
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});