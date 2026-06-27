export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { reference, amount } = request.body || {};
  if (!reference) {
    return response.status(400).json({ error: 'Missing payment reference.' });
  }

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecret) {
    return response.status(500).json({ error: 'PAYSTACK_SECRET_KEY is not configured on the server.' });
  }

  try {
    const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    const paystackResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        Accept: 'application/json'
      }
    });

    const data = await paystackResponse.json();
    if (!paystackResponse.ok) {
      return response.status(paystackResponse.status).json({
        error: 'Paystack verification failed. Please retry.',
        details: data
      });
    }

    if (!data?.data || data.data.status !== 'success') {
      return response.status(402).json({
        error: 'Payment was not successful.',
        paystack: data
      });
    }

    if (amount && Number(data.data.amount) !== Number(amount)) {
      return response.status(400).json({
        error: 'Payment amount mismatch.',
        expected: Number(amount),
        actual: Number(data.data.amount),
        paystack: data.data
      });
    }

    if (data.data.currency !== 'NGN') {
      return response.status(400).json({
        error: 'Unexpected payment currency.',
        currency: data.data.currency
      });
    }

    return response.status(200).json({
      message: 'Payment verified successfully.',
      verified: data.data
    });
  } catch (error) {
    console.error('Error verifying Paystack payment:', error);
    return response.status(500).json({ error: 'Server error verifying payment.', details: error.message });
  }
}
