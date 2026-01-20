"use client";
import CreateShop from "apps/seller-ui/src/shared/modules/auth/create-shop";
import CreateAccount from "apps/seller-ui/src/shared/modules/auth/create-account";
import { useState } from "react";
import ConnectBank from "apps/seller-ui/src/shared/modules/auth/connect-bank";

export type FormData = {
    name: string;
    email: string;
    password: string;
    phone_number: number;
    country: string;
};

const Signup = () => {
    const totalSteps = 3;            // 1. Create Account -> 2. Setup Shop -> 3. Connect Bank
    const [activeStep, setActiveStep] = useState(1);
    const [sellerId, setSellerId] = useState("");

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
                        < CreateAccount setSellerId={setSellerId} setActiveStep={setActiveStep} />
                    )
                }
                {
                    activeStep === 2 && (
                        < CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />
                    )
                }
                {
                    activeStep === 3 && (
                        < ConnectBank sellerId={sellerId}/>
                    )
                }
            </div>
        </div>
    );
};

export default Signup;
