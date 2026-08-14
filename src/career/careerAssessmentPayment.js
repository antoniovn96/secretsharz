import { auth } from '../firebase';

let razorpayScriptPromise;

function loadRazorpay() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Payment is only available in the browser.'));
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.Razorpay), { once: true });
        existing.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

export async function startCareerAssessmentCheckout(assessmentAttemptId) {
  if (!assessmentAttemptId) throw new Error('Assessment attempt is required.');
  const user = auth.currentUser;
  if (!user) throw new Error('Please sign in before purchasing the report.');

  const token = await user.getIdToken();
  const response = await fetch('/api/payments/career-assessment/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ assessmentAttemptId }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error || 'Unable to start payment.');
  if (payload.provider !== 'razorpay' || !payload.orderId || !payload.keyId) {
    throw new Error('Razorpay payment configuration is incomplete.');
  }

  const Razorpay = await loadRazorpay();
  return new Promise((resolve, reject) => {
    const checkout = new Razorpay({
      key: payload.keyId,
      order_id: payload.orderId,
      amount: payload.amount,
      currency: payload.currency || 'INR',
      name: 'Secret Sharz',
      description: 'Comprehensive Career Assessment Report',
      notes: { assessmentAttemptId, productId: payload.productId },
      handler: (paymentResponse) => resolve(paymentResponse),
      modal: { ondismiss: () => reject(new Error('Payment window was closed.')) },
    });
    checkout.on('payment.failed', (event) => reject(new Error(event?.error?.description || 'Payment failed.')));
    checkout.open();
  });
}
