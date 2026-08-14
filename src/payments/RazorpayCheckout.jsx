import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Checkout is browser-only.'));
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Unable to load Razorpay Checkout.'));
    document.body.appendChild(script);
  });
}

export default function RazorpayCheckout({ productId, buttonLabel = 'Pay securely', onSuccess, onError, disabled = false }) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { loadRazorpay().then(() => setReady(true)).catch(() => setReady(false)); }, []);

  async function startPayment() {
    if (!auth.currentUser) return onError?.(new Error('Please log in before making a payment.'));
    setBusy(true);
    try {
      await loadRazorpay();
      const token = await auth.currentUser.getIdToken();
      const orderResponse = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || 'Unable to start payment.');

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: order.name,
        description: order.description,
        order_id: order.orderId,
        prefill: {
          name: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
        },
        theme: { color: '#4A7C59' },
        handler: async (response) => {
          const verifyToken = await auth.currentUser.getIdToken(true);
          const verifyResponse = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { Authorization: `Bearer ${verifyToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentRecordId: order.paymentRecordId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verification = await verifyResponse.json();
          if (!verifyResponse.ok) throw new Error(verification.error || 'Payment verification failed.');
          onSuccess?.({ ...response, paymentRecordId: order.paymentRecordId, verification });
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      checkout.on('payment.failed', response => onError?.(new Error(response?.error?.description || 'Payment failed.')));
      checkout.open();
    } catch (err) {
      onError?.(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={startPayment} disabled={disabled || busy || !ready}>
      {busy ? 'Opening secure checkout…' : buttonLabel}
    </button>
  );
}
