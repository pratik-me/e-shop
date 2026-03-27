"use client";

import { useStore } from "apps/user-ui/src/store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, Truck } from "lucide-react";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const router = useRouter();

  useEffect(() => {
    useStore.setState({ cart: [] });
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
    });
  }, []);
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
  <div className="bg-white shadow-xl border border-gray-100 rounded-2xl p-8 w-full max-w-md text-center">
    {/* Success Icon */}
    <div className="text-green-500 mb-6 flex justify-center">
      <CheckCircle className="w-20 h-20" />
    </div>

    {/* Header Content */}
    <h2 className="text-3xl font-bold text-gray-900 mb-3">
      Payment Successful!
    </h2>
    <p className="text-gray-600 mb-8 leading-relaxed">
      Thank you for your purchase. Your order has been placed successfully and is now being processed.
    </p>

    {/* Primary Action - Centered */}
    <div className="flex justify-center">
      <button
        onClick={() => router.push(`/profile?active=My+Orders`)}
        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        <Truck className="w-5 h-5" />
        Track Order
      </button>
    </div>

    {/* Session Footer */}
    <div className="mt-10 pt-6 border-t border-gray-100">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
        Payment Session ID
      </p>
      <span className="font-mono text-[10px] text-gray-500 break-all bg-gray-50 px-2 py-1 rounded">
        {sessionId}
      </span>
    </div>
  </div>
</div>
  );
};

export default PaymentSuccessPage;
