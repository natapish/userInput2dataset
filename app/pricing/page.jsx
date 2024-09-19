'use client'

import React, { useEffect } from 'react';

function PricingPage() {
  useEffect(() => {
    // Load Stripe script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up the script when the component is unmounted
    };
  }, []);

  return (
    <div>
      <stripe-pricing-table
        pricing-table-id="prctbl_1PzSFUP4t1wI0MUygSJC2G3y"
        publishable-key="pk_test_51PzRkcP4t1wI0MUyKzlWNZgqN2JFiNyaayenRTDgwYEAbpMJOWAuOeT0BhcpivDukyJe67QPCmcRQTMIpGhYQIxD00pDc3LyvM"
      ></stripe-pricing-table>
    </div>
  );
}

export default PricingPage;
