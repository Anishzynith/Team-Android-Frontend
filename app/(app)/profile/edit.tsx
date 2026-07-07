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
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../../service/auth";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

// Define types for picker items
interface PickerItem {
  label: string;
  value: string;
}

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
  const [unitSystem, setUnitSystem] = useState(
    user?.profile?.unit_system || "metric"
  );

  const [loading, setLoading] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showBloodModal, setShowBloodModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const GENDERS: PickerItem[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
    { label: "Prefer not to say", value: "prefer_not" },
  ];

  const BLOOD_GROUPS: PickerItem[] = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
  ];

  const UNIT_SYSTEMS: PickerItem[] = [
    { label: "Metric (kg, cm)", value: "metric" },
    { label: "Imperial (lbs, ft)", value: "imperial" },
  ];

  const handleUpdate = async () => {
    if (!firstName || !lastName || !username) {
      Alert.alert("Validation Error", "All fields are required");
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
        unit_system: unitSystem || null,
      });

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        "Update Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // Generic modal picker component
  const ModalPicker = ({
    visible,
    onClose,
    data,
    selectedValue,
    onSelect,
    title,
  }: {
    visible: boolean;
    onClose: () => void;
    data: PickerItem[];
    selectedValue: string;
    onSelect: (value: string) => void;
    title: string;
  }) => {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = selectedValue === item.value;
                return (
                  <TouchableOpacity
                    style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                    onPress={() => {
                      onSelect(item.value);
                      onClose();
                    }}
                  >
                    <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity onPress={onClose} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Personal Information Section */}
      <Text style={styles.sectionTitle}>Personal Information</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name *"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name *"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Username *"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* Date of Birth */}
      <Pressable onPress={() => {
        if (Platform.OS === 'android') {
          const current = dateOfBirth ? new Date(dateOfBirth) : new Date();
          DateTimePickerAndroid.open({
            value: current,
            onChange: (event, selectedDate) => {
              if (!selectedDate) return;
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
        <View pointerEvents="none">
          <TextInput
            style={[styles.input, styles.pressableInput]}
            placeholder="Date of Birth"
            value={dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : ""}
            editable={false}
          />
        </View>
      </Pressable>

      {showDatePicker && Platform.OS !== 'android' && (
        <DateTimePicker
          value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
          mode="date"
          display="spinner"
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

      {/* Gender */}
      <Pressable onPress={() => setShowGenderModal(true)}>
        <View pointerEvents="none">
          <TextInput
            style={[styles.input, styles.pressableInput]}
            placeholder="Gender"
            value={GENDERS.find(g => g.value === gender)?.label || ""}
            editable={false}
          />
        </View>
      </Pressable>

      {/* Blood Group */}
      <Pressable onPress={() => setShowBloodModal(true)}>
        <View pointerEvents="none">
          <TextInput
            style={[styles.input, styles.pressableInput]}
            placeholder="Blood Group"
            value={BLOOD_GROUPS.find(b => b.value === bloodGroup)?.label || ""}
            editable={false}
          />
        </View>
      </Pressable>

      {/* Body Measurements Section */}
      <Text style={styles.sectionTitle}>Body Measurements</Text>

      <TextInput
        style={styles.input}
        placeholder={`Height (${unitSystem === 'metric' ? 'cm' : 'ft/in'})`}
        value={heightCm}
        onChangeText={setHeightCm}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder={`Weight (${unitSystem === 'metric' ? 'kg' : 'lbs'})`}
        value={weightKg}
        onChangeText={setWeightKg}
        keyboardType="numeric"
      />

      {/* Unit System */}
      <Text style={styles.subLabel}>Unit System</Text>
      <Pressable onPress={() => setShowUnitModal(true)}>
        <View pointerEvents="none">
          <TextInput
            style={[styles.input, styles.pressableInput]}
            placeholder="Unit System"
            value={UNIT_SYSTEMS.find(u => u.value === unitSystem)?.label || "Metric"}
            editable={false}
          />
        </View>
      </Pressable>

      {/* Email (Read-only) */}
      <Text style={styles.sectionTitle}>Account Information</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={user?.email || ""}
        editable={false}
      />

      {/* Modals */}
      <ModalPicker
        visible={showGenderModal}
        onClose={() => setShowGenderModal(false)}
        data={GENDERS}
        selectedValue={gender}
        onSelect={setGender}
        title="Select Gender"
      />

      <ModalPicker
        visible={showBloodModal}
        onClose={() => setShowBloodModal(false)}
        data={BLOOD_GROUPS}
        selectedValue={bloodGroup}
        onSelect={setBloodGroup}
        title="Select Blood Group"
      />

      <ModalPicker
        visible={showUnitModal}
        onClose={() => setShowUnitModal(false)}
        data={UNIT_SYSTEMS}
        selectedValue={unitSystem}
        onSelect={setUnitSystem}
        title="Select Unit System"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Profile</Text>
        )}
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 12,
  },
  subLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  pressableInput: {
    backgroundColor: "#fafafa",
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
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: 'center',
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemSelected: {
    backgroundColor: '#e8f0fe',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  modalClose: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});