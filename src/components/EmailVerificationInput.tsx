import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmailVerificationInputProps {
  onComplete?: (code: string) => void;
  onResend?: () => void;
  email?: string;
  isLoading?: boolean;
  isResending?: boolean;
  resendCooldown?: number;
}

const EmailVerificationInput = ({ 
  onComplete, 
  onResend, 
  email,
  isLoading = false,
  isResending = false,
  resendCooldown = 0
}: EmailVerificationInputProps) => {
  const [value, setValue] = React.useState("");

  const handleComplete = (code: string) => {
    setValue(code);
    if (code.length === 6) {
      onComplete?.(code);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          {email ? (
            <>Enter the 6-digit code sent to <strong>{email}</strong></>
          ) : (
            "Enter the 6-digit verification code sent to your email"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={handleComplete}
            disabled={isLoading || isResending}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          {resendCooldown > 0 ? (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Resend available in {formatTime(resendCooldown)}
              </p>
              <Button 
                variant="link" 
                disabled
                className="text-muted-foreground cursor-not-allowed"
              >
                Resend Code
              </Button>
            </div>
          ) : (
            <Button 
              variant="link" 
              onClick={onResend}
              disabled={isLoading || isResending}
              className="text-primary hover:text-primary/80"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationInput;
