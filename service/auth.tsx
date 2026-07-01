import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import * as SecureStore from "expo-secure-store";
import { authAPI } from "./api";

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile?: {
    date_of_birth?: string;
    gender?: string;
    blood_group?: string;
    height_cm?: number | null;
    weight_kg?: number | null;
    phone_number?: string;
  };
}

interface SignupData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
}

interface ProfileData {
  first_name?: string;
  last_name?: string;
  username?: string;
  date_of_birth?: string | null;
  gender?: string | null;
  blood_group?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  phone_number?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;

  login: (
    identifier: string,
    password: string
  ) => Promise<void>;

  signup: (
    data: SignupData
  ) => Promise<any>;

  verifyOtp: (
    email: string,
    otpcode: string
  ) => Promise<void>;

  resendOtp: (
    email: string,
    purpose: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  updateProfile: (
    data: ProfileData
  ) => Promise<void>;

  refreshProfile: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token =
        await SecureStore.getItemAsync(
          "access_token"
        );

      if (token) {
        const response =
          await authAPI.getProfile();

        setUser(response.data.data);
      }
    } catch (error) {
      console.log(
        "Auth Init Error:",
        error
      );

      await SecureStore.deleteItemAsync(
        "access_token"
      );

      await SecureStore.deleteItemAsync(
        "refresh_token"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateToken = (
    value: unknown,
    name: string
  ): string => {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(
        `Invalid ${name} received from authentication response.`
      );
    }
    return value;
  };

  const storeTokens = async (
    access: string,
    refresh: string
  ) => {
    await SecureStore.setItemAsync(
      "access_token",
      access
    );

    await SecureStore.setItemAsync(
      "refresh_token",
      refresh
    );
  };

  const resolveAuthPayload = (response: any) => {
    const payload =
      response.data?.data || response.data || {};
    const tokens =
      payload.tokens || response.data?.tokens || response.tokens;
    const user =
      payload.user || response.data?.user || response.user;

    return {
      accessToken: validateToken(tokens?.access, "access token"),
      refreshToken: validateToken(tokens?.refresh, "refresh token"),
      user,
    };
  };

  const login = async (
    identifier: string,
    password: string
  ) => {
    const response =
      await authAPI.login({
        identifier,
        password,
      });

    const { accessToken, refreshToken, user: loggedInUser } =
      resolveAuthPayload(response);

    await storeTokens(
      accessToken,
      refreshToken
    );

    setUser(loggedInUser);
  };

  const signup = async (
    data: SignupData
  ) => {
    const response =
      await authAPI.signup(data);

    return response.data;
  };

  const verifyOtp = async (
    email: string,
    otpcode: string
  ) => {
    const response =
      await authAPI.verifyOtp({
        email,
        otp_code: otpcode,
      });

    const { accessToken, refreshToken, user: verifiedUser } =
      resolveAuthPayload(response);

    await storeTokens(
      accessToken,
      refreshToken
    );

    setUser(verifiedUser);
  };

  const resendOtp = async (
    email: string,
    purpose: string
  ) => {
    await authAPI.resendOtp({
      email,
      purpose,
    });
  };

  const refreshProfile =
    async () => {
      const response =
        await authAPI.getProfile();

      setUser(response.data.data);
    };

  const updateProfile =
    async (data: ProfileData) => {
      const response =
        await authAPI.updateProfile(
          data
        );

      setUser(response.data.data);
    };

  const logout = async () => {
    try {
      const refreshToken =
        await SecureStore.getItemAsync(
          "refresh_token"
        );

      await authAPI.logout({
        refresh: refreshToken || "",
      });
    } catch (error) {
      console.log(
        "Logout Error:",
        error
      );
    } finally {
      await SecureStore.deleteItemAsync(
        "access_token"
      );

      await SecureStore.deleteItemAsync(
        "refresh_token"
      );

      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};