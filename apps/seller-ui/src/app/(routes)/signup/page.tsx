"use client";
import { useMutation } from "@tanstack/react-query";
import { countries } from "apps/seller-ui/src/utils/countries";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

type FormData = {
    name: string;
    email: string;
    password: string;
    phone_number: number;
    country: string;
};

const Signup = () => {
    const totalSteps = 3;            // 1. Create Account -> 2. Setup Shop -> 3. Connect Bank
    const [activeStep, setActiveStep] = useState(1);
    const [sellerId, setSellerId] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [showOtp, setShowOtp] = useState(false);
    const [sellerData, setSellerData] = useState<FormData | null>(null);
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

    const signupMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/seller-registration`,
                data
            );
            return response.data;
        },
        onSuccess: (_, formData) => {
            setSellerData(formData);
            setShowOtp(true);
            setCanResend(false);
            setTimer(60);
            startResendTimer();
        },
    });

    const verifyOTPMutation = useMutation({
        mutationFn: async () => {
            if (!sellerData) return;
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-seller`,
                { ...sellerData, otp: otp.join("") }
            );
            return response.data;
        },
        onSuccess: (data) => {
            setSellerId(data?.seller?.id);
            setActiveStep(2);
        },
    });

    const handleOTPChange = (value: string, index: number) => {
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

    const resendOTP = () => {
        if (sellerData) {
            signupMutation.mutate(sellerData);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        signupMutation.mutate(data);
    };

    return (
        <div className="w-full flex flex-col items-center pt-10 min-h-screen">
            {/* Stepper */}
            <div className="relative flex items-center justify-between md:w-[60%] mb-12 px-5">
                <div className="absolute top-5 left-10 right-10 h-1 bg-gray-300 -z-10">

                    <div
                        className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
                        style={{ width: `${((activeStep - 1) / (totalSteps - 1)) * 100}%` }}
                    />
                </div>

                {/* --- STEPS --- */}
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center relative">
                        <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-colors duration-500 ${step <= activeStep ? "bg-blue-600" : "bg-gray-300"
                                }`}
                        >
                            {step}
                        </div>

                        <div className="absolute top-12 whitespace-nowrap text-sm font-medium text-gray-600 text-center">
                            {step === 1 ? "Create Account" : step === 2 ? "Setup Shop" : "Connect Bank"}
                        </div>
                    </div>
                ))}
            </div>

            {/* Steps content */}
            <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
                {
                    activeStep === 1 && (
                        <>
                            {!showOtp ? (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h3 className="text-2xl font-semibold text-center mb-4">
                                        Create Account
                                    </h3>
                                    <label className="block text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                                        {...register("name", { required: "Name is required" })}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}

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

                                    <label className="block text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="99999999"
                                        className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                                        {...register("phone_number", {
                                            required: "Phone Number is required",
                                            pattern: {
                                                value: /^\+?[1-9]\d{1,14}$/,        // Ensures E.164 format
                                                message: "Invalid phone number format",
                                            },
                                            minLength: {
                                                value: 10,
                                                message: "Phone number can not be less than 10 digits",
                                            },
                                            maxLength: {
                                                value: 15,
                                                message: "Phone number can not exceed 15 digits",
                                            }
                                        })}
                                    />
                                    {errors.phone_number && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.phone_number.message}
                                        </p>
                                    )}

                                    <label className="block text-gray-700 mb-1">Country</label>
                                    <select className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" {...register("country", { required: "Country is required" })}>
                                        <option value="">Select your country</option>
                                        {countries.map(country => (
                                            <option key={country.code} value="country.code">{country.name}</option>
                                        ))}

                                    </select>
                                    {errors.country && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.country.message}
                                        </p>
                                    )}

                                    <label className="block text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            placeholder="Min. 6 characters"
                                            className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters long",
                                                },
                                                maxLength: {
                                                    value: 20,
                                                    message: "Password must be at most 20 characters long",
                                                },
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                                        >
                                            {passwordVisible ? <Eye /> : <EyeOff />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={signupMutation.isPending}
                                        className="w-full text-lg cursor-pointer mt-5 bg-black text-white py-2 rounded-lg"
                                    >
                                        {signupMutation.isPending ? "Signing up..." : "Signup"}
                                    </button>
                                    {
                                        signupMutation.error instanceof AxiosError && (
                                            <p className="text-red-500 text-sm mt-1">
                                            {signupMutation.error.response?.data?.mesage || signupMutation.error.message}
                                        </p>
                                        )
                                    }

                                    <p className="pt-3 text-center">
                                        Already have an account? <Link href={"/login"} className="text-blue-500">Login</Link>
                                    </p>
                                </form>
                            ) : (
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
                                                onChange={(e) => handleOTPChange(e.target.value, index)}
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
                                                onClick={resendOTP}
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
                                    {verifyOTPMutation?.isError &&
                                        verifyOTPMutation.error instanceof AxiosError && (
                                            <p className="text-red-500 text-sm mt-2">
                                                {verifyOTPMutation.error.response?.data?.message ||
                                                    verifyOTPMutation.error.message}
                                            </p>
                                        )}
                                </>
                            )}
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default Signup;
