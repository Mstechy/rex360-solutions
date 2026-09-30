// ---------------------------------------------------------------------------
// Supabase Edge Function: verify-payment
//
// Checks a Paystack transaction SERVER-SIDE before we write `payment_status`
// to the database. The Paystack SECRET key lives only in Supabase Edge
// Function secrets — it is never committed and never reaches the browser.
//
//   supabase secrets set PAYSTACK_SECRET_KEY=sk_live_... --project-ref <ref>
//   supabase functions deploy verify-payment --project-ref <ref>
//
// The response contract is identical to the old Vercel handler
// (api/verify-payment.js): `{ message, verified }` on 200, `{ error }` on
// failure — so the wizard's existing checks keep working unchanged.
// ---------------------------------------------------------------------------

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });

Deno.serve(async (request: Request): Promise<Response> => {
  // The browser sends a preflight because of the JSON content type.
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed. Use POST." });
  }

  const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!paystackSecret) {
    return json(500, { error: "PAYSTACK_SECRET_KEY is not configured on the server." });
  }

  let body: { reference?: string; amount?: number } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const reference = typeof body.reference === "string" ? body.reference.trim() : "";
  const amount = body.amount;

  if (!reference) {
    return json(400, { error: "Missing payment reference." });
  }

  try {
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          Accept: "application/json",
        },
      },
    );

    const data = await paystackResponse.json();

    if (!paystackResponse.ok) {
      return json(paystackResponse.status, {
        error: "Paystack verification failed. Please retry.",
        details: data,
      });
    }

    if (!data?.data || data.data.status !== "success") {
      return json(402, { error: "Payment was not successful.", paystack: data });
    }

    if (amount !== undefined && amount !== null) {
      const expected = Number(amount);
      const charged = Number(data.data.amount);

      // Paystack adds its fee ON TOP when the customer bears it, so a
      // ₦100.00 request is charged as ₦101.53 (fees = 153 kobo). The
      // amount we initialized the transaction with is reported back as
      // `requested_amount`, which is the value that must match.
      const requestedRaw = data.data.requested_amount;
      const requested =
        requestedRaw === undefined || requestedRaw === null
          ? Number.NaN
          : Number(requestedRaw);

      const amountMatches =
        charged === expected ||
        (Number.isFinite(requested) && requested === expected) ||
        charged >= expected; // fee-bearing charge covers what we asked for

      if (!amountMatches) {
        return json(400, {
          error: "Payment amount mismatch.",
          expected,
          actual: charged,
          requested: Number.isFinite(requested) ? requested : null,
          paystack: data.data,
        });
      }
    }

    if (data.data.currency !== "NGN") {
      return json(400, { error: "Unexpected payment currency.", currency: data.data.currency });
    }

    return json(200, { message: "Payment verified successfully.", verified: data.data });
  } catch (error) {
    console.error("Error verifying Paystack payment:", error);
    return json(500, {
      error: "Server error verifying payment.",
      details: (error as Error).message,
    });
  }
});
