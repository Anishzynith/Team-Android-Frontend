import { Redirect } from 'expo-router';
import { useAuth } from '../service/auth';

export default function Index() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  
  return user ? <Redirect href="/(app)/dashboard" /> : <Redirect href="/(auth)/login" />;
}