"use client";

import { useEffect } from "react";

function PricingPage() {
  useEffect(() => {
    // Load Stripe script dynamically
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up the script when the component is unmounted
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start pt-16">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
        Choose Your Plan
      </h1>
      <div className="w-full px-4">
        <stripe-pricing-table
          pricing-table-id="prctbl_1PzSFUP4t1wI0MUygSJC2G3y"
          publishable-key="pk_test_51PzRkcP4t1wI0MUyKzlWNZgqN2JFiNyaayenRTDgwYEAbpMJOWAuOeT0BhcpivDukyJe67QPCmcRQTMIpGhYQIxD00pDc3LyvM"
        ></stripe-pricing-table>
      </div>
    </div>
  );
}

export default PricingPage;
