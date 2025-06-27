import React, { useState, useEffect } from "react";
import EmailVerificationInput from "@/components/EmailVerificationInput";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://3d5e-31-42-58-30.ngrok-free.app';

const EmailVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!email) {
    // Redirect or show an error if email is not available
    navigate('/register');
    return null;
  }

  const handleComplete = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-email`, { email, code });
      toast.success("Email verified successfully! You can now log in.");
      navigate('/login');
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || "Failed to verify email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) {
      toast.error(`Please wait ${resendCooldown} seconds before requesting another code.`);
      return;
    }

    setIsResending(true);
    try {
      console.log('Sending resend request to:', `${API_BASE_URL}/api/auth/resend-verification`);
      const response = await axios.post(`${API_BASE_URL}/api/auth/resend-verification`, { email });
      console.log('Resend response:', response.data);
      toast.success("A new verification code has been sent to your email!");
      setResendCooldown(60); // 60 second cooldown
    } catch (error: any) {
      console.error('Resend error:', error);
      const errorMessage = error.response?.data?.message || "Failed to resend verification code.";
      toast.error(errorMessage);
      
      // If it's a network error, show more specific message
      if (!error.response) {
        toast.error("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <EmailVerificationInput
        onComplete={handleComplete}
        onResend={handleResend}
        email={email}
        isLoading={isLoading}
        isResending={isResending}
        resendCooldown={resendCooldown}
      />
    </div>
  );
};

export default EmailVerificationPage;
