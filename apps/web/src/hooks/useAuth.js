
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [initialLoading, setInitialLoading] = useState(true);
  const [otpId, setOtpId] = useState(null);

  useEffect(() => {
    if (pb.authStore.isValid) {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      return { requiresMfa: false, user: authData.record };
    } catch (error) {
      if (error.response?.mfaId) {
        const otpResult = await pb.collection('users').requestOTP(email, { $autoCancel: false });
        return {
          requiresMfa: true,
          mfaId: error.response.mfaId,
          otpId: otpResult.otpId,
          email
        };
      }
      throw error;
    }
  };

  const signup = async (email, password, passwordConfirm, name) => {
    const userData = {
      email,
      password,
      passwordConfirm,
      name,
      role: 'user'
    };
    const record = await pb.collection('users').create(userData, { $autoCancel: false });
    return record;
  };

  const requestOTP = async (email) => {
    try {
      const tempPassword = crypto.randomUUID();
      await pb.collection('users').create({
        email: email,
        password: tempPassword,
        passwordConfirm: tempPassword,
      }, { $autoCancel: false });
    } catch (e) {
      // User already exists - continue
    }

    const result = await pb.collection('users').requestOTP(email, { $autoCancel: false });
    setOtpId(result.otpId);
    return result;
  };

  const authWithOTP = async (otpIdParam, code) => {
    const authData = await pb.collection('users').authWithOTP(otpIdParam, code, { $autoCancel: false });
    setCurrentUser(authData.record);
    return authData;
  };

  const completeMfaWithOtp = async (mfaId, otpId, code) => {
    const authData = await pb.collection('users').authWithOTP(otpId, code, { mfaId, $autoCancel: false });
    setCurrentUser(authData.record);
    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const updateProfile = async (userId, data) => {
    const updated = await pb.collection('users').update(userId, data, { $autoCancel: false });
    setCurrentUser(updated);
    return updated;
  };

  return {
    currentUser,
    initialLoading,
    otpId,
    login,
    signup,
    requestOTP,
    authWithOTP,
    completeMfaWithOtp,
    logout,
    updateProfile,
    isAuthenticated: pb.authStore.isValid,
    isAdmin: currentUser?.role === 'admin'
  };
};
