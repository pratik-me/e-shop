"use client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userEmail, setUserEmail] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [serverError, setServerError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const requestOTPMutation = useMutation({
    mutationFn: async (email: { email: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        { email }
      );
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setServerError(null);
      setCanResend(false);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid OTP. Try Again!";
      setServerError(errorMessage);
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        { email: userEmail, otp: otp.join("") }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("reset");
      setServerError(null);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid OTP. Try Again!";
      toast.error(errorMessage);
      setServerError(errorMessage);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        { email: userEmail, newPassword: password }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("email");
      toast.success(
        "Password reset successfully. Please login with your new password"
      );
      setServerError(null);
      router.push("/login");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to reset password. Please try again!";
      toast.error(errorMessage);
      setServerError(errorMessage);
    },
  });

  const handleOTPChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if user types over an existing digit
    const digit = value.substring(value.length - 1);
    newOtp[index] = digit;
    setOtp(newOtp);

    // Move focus forward
    if (digit && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      // If current input is empty, move focus back and clear that one
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = ""; // Clear previous
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const onSubmitEmail = ({ email }: { email: string }) => {
    requestOTPMutation.mutate({ email });
  };

  const onSubmitPassword = ({ password }: { password: string }) => {
    resetPasswordMutation.mutate({ password });
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        Forgot Password
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Forgot Password
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          {step === "email" && (
            <>
              <h3 className="text-3xl font-semibold text-center mb-2 ">
                Login to your account
              </h3>
              <p className="text-center text-gray-500 mb-4">
                Don't have an account?
                <Link href={"/signup"} className="text-blue-500">
                  {" "}
                  Sign Up
                </Link>
              </p>
              <div className="flex items-center my-5 text-gray-400 text-sm">
                <div className="flex-1 border-t border-gray-300" />
                <span className="px-3">or Sign in with email</span>
                <div className="flex-1 border-t border-gray-300" />
              </div>
              <form onSubmit={handleSubmit(onSubmitEmail)}>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="support@eshop.com"
                  className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={requestOTPMutation.isPending}
                  className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg mt-4"
                >
                  {requestOTPMutation.isPending ? "Sending OTP..." : "Send OTP"}
                </button>

                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            </>
          )}
          {step === "otp" && (
            <>
              <h3 className="text-xl font-semibold text-center mb-4">
                Enter OTP
              </h3>
              <div className="flex justify-center gap-6">
                {otp?.map((digit, index) => (
                  <input
                    type="text"
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 outline-none !rounded"
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>
              <button
                className="w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg"
                disabled={verifyOTPMutation.isPending}
                onClick={() => verifyOTPMutation.mutate()}
              >
                {verifyOTPMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    onClick={() =>
                      requestOTPMutation.mutate({ email: userEmail! })
                    }
                    className="text-blue-500 cursor-pointer"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <button className="text-blue-500 cursor-pointer">
                    Resend OTP in {timer} seconds
                  </button>
                )}
              </p>
              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
            </>
          )}

          {
            step === "reset" && (
              <>
                <h3 className="text-xl font-semibold text-center mb-4">
                  Reset Password
                </h3>
                <form onSubmit={handleSubmit(onSubmitPassword)}>
                  <label className="block text-gray-700 mb-1">New Password</label>
                  <input type="password" placeholder="Enter new password" className="w-full p-2 border border-gray-300 outline-0 !rounded mb-2" {...register("password", { 
                    required: "Password is required", minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long"
                    } 
                  })} />
                  {
                    errors.password && (
                      <p className="text-red-500 text-sm">
                        {String(errors.password.message)}
                      </p>
                    )
                  }

                  <button type="submit" className="w-full text-lg cursor-pointer bg-black text-white rounded-lg py-2 mt-4" disabled={resetPasswordMutation.isPending}>
                    {
                      resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"
                    }
                  </button>

                  {
                    serverError && (
                      <p className="text-red-500 text-sm mt-2">{serverError}</p>
                    )
                  }
                </form>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
