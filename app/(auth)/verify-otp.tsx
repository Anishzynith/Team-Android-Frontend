import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../service/auth';

export default function VerifyOTPScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { verifyOtp, resendOtp } = useAuth();

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }
    
    setLoading(true);
    try {
      await verifyOtp(email as string, otp);
      
      // ✅ Navigate to questionnaire after successful OTP verification
      Alert.alert(
        'Success', 
        'OTP verified successfully!',
        [
          { 
            text: 'Continue', 
            onPress: () => {
              console.log('Navigating to questionnaire...');
              router.replace('/(app)/questionnaire');
            }
          }
        ]
      );
      
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await resendOtp(email as string, 'registration');
      Alert.alert('Success', 'OTP resent successfully');
    } catch (error: any) {
      Alert.alert('Failed', error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to <Text style={styles.email}>{email}</Text></Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={handleResend}
        disabled={resendLoading}
      >
        <Text style={styles.link}>
          {resendLoading ? 'Sending...' : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: '#F4F7FC',
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 30, 
    textAlign: 'center',
  },
  email: {
    color: '#007AFF',
    fontWeight: '600',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    marginBottom: 15, 
    borderRadius: 8, 
    textAlign: 'center', 
    fontSize: 20,
    backgroundColor: '#fff',
    letterSpacing: 8,
  },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16,
  },
  link: { 
    color: '#007AFF', 
    textAlign: 'center', 
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
});