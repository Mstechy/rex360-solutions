# Admin Dashboard — Setup Required After The Fix

The code changes are done and the project builds cleanly. Two things must be
completed **manually** before the dashboard will show client data. Until you do
these, you will still see zero registrations.

---

## 1. Create the Supabase Auth user (REQUIRED — nothing works without this)

The admin no longer uses a hardcoded password. It signs in with Supabase Auth,
so a real user must exist.

1. Go to **Supabase Dashboard → Authentication → Users → Add user**
2. Email: the admin's own address. **Do not write it into this repo** — see the
   note below.
3. Click **Create user**, then set the password to your chosen admin password.
4. **Tick "Auto Confirm User".** This project has `mailer_autoconfirm: false`,
   so a user created without that box ticked *cannot* sign in — you get
   `email_not_confirmed` instead of a session.
5. Keep this password in a password manager — the old hardcoded admin password
   is no longer accepted anywhere.

> ## Log in at `/admin` with the exact email you entered in step 2
>
> ### Keep the admin email out of the repo
>
> There is exactly **one** admin account, so its email address is half of the
> credential. Do not commit it — not here, not in `.env`, not in a code comment,
> and not in the login form's `placeholder`. Anyone who learns the address can
> target that mailbox directly. It can always be read back from
> **Authentication → Users**, so it is never needed in code.
>
> ### If sign-in fails, check the email before the password
>
> A **wrong email and a wrong password return byte-identical errors**:
>
> ```
> {"code":400,"error_code":"invalid_credentials","msg":"Invalid login credentials"}
> ```
>
> Supabase returns this same response for an address that does not exist at all,
> which is deliberate (it prevents account enumeration). So a typo in the email
> is indistinguishable from a bad password, and the login form cannot tell you
> which is wrong.
>
> **Always confirm the email in Authentication → Users first.** The placeholder
> on the login form deliberately reads `Enter admin email` rather than an example
> address, precisely so it cannot send you chasing a password problem that does
> not exist.
>
> Also note `disable_signup` is `false` on this project, so anyone who reaches
> the auth endpoint can create accounts. The admin dashboard is protected by RLS
> and `authenticated` role, not by the absence of signup — keep that in mind
> before loosening any policy.

---

## 2. Confirm the RLS policies on `registrations`

Run this in **Supabase → SQL Editor**:

```sql
-- Which policies exist right now?
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'registrations';
```

You need at minimum:

| Operation | Who | Required because |
|---|---|---|
| `INSERT` | `public` (anon) | The public wizard submits without logging in |
| `SELECT` | `authenticated` | The admin dashboard must read the rows |
| `SELECT` | `public` | *(optional)* "check my own registration" lookup |
| `UPDATE` | `authenticated` | Admin status changes |
| `DELETE` | `authenticated` | Admin delete button |

If the `SELECT` policy is missing or restricted, the dashboard returns an empty
list **with no error**. That is the exact failure you hit before.

To re-apply the full policy set, run `REGISTRATIONS_RLS_POLICIES.sql` in the
SQL Editor. It drops and recreates all of the above.

---

## 3. Confirm the table shape

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'registrations'
ORDER BY ordinal_position;
```

`service_type`, `surname`, `firstname`, `phone`, `email` should be `NOT NULL`.
`amount`, `paystack_ref`, `payment_status`, `full_details`, `created_at` should
exist. If `payment_status` is missing, run `ADD_PAYMENT_STATUS_COLUMN.sql`.

---

## 4. The Paystack secret lives ONLY in Supabase Edge Function secrets

By design there is **no** `PAYSTACK_SECRET_KEY` anywhere in this repository, in
`.env`, or in Vercel. Payment verification runs as a **Supabase Edge Function**:

- code: `supabase/functions/verify-payment/index.ts`
- reads the secret with `Deno.env.get("PAYSTACK_SECRET_KEY")`
- the browser calls `https://<ref>.supabase.co/functions/v1/verify-payment`
  with the **public** anon key — that authenticates the call to Functions; it
  does not expose the secret or grant table access (RLS still applies to the
  insert that follows)

`.env` therefore contains only the three public `VITE_*` keys.

Set the secret once — either Dashboard → Edge Functions → Secrets, or:

```
supabase secrets set PAYSTACK_SECRET_KEY=sk_live_... --project-ref oohabvgbrzrewwrekkfy
```

Without it the function returns HTTP 500 with
`{"error":"PAYSTACK_SECRET_KEY is not configured on the server."}` and the
wizard will not write the row — which is intentional: we will not mark a record
`paid` on the strength of an unverified browser callback.

### Deploy the function

```
supabase functions deploy verify-payment --project-ref oohabvgbrzrewwrekkfy
```

If your Supabase account gets **403** on `supabase link` / `supabase functions
deploy`, your role on the project lacks permission (secrets need *Owner*). Either
fix the role under Project Settings → Members, or paste
`supabase/functions/verify-payment/index.ts` into Dashboard → Edge Functions and
keep **Verify JWT** on.

### Confirm it answers

```sh
curl -X POST https://oohabvgbrzrewwrekkfy.supabase.co/functions/v1/verify-payment \
  -H "Content-Type: application/json" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -d '{}'
```

Must return **400** `{"error":"Missing payment reference."}` — not 404, not 401.

---

## 4b. Why there is no Vercel `/api` function

`Payment verification failed (HTTP 404)` happened because verification used to
live at `/api/verify-payment` — a route Vite does not serve in dev, and which
`vercel.json` never built in production. Verification now lives in Supabase, so:

- `api/verify-payment.js` — **deleted**
- the `apiFunctionsDev()` plugin in `vite.config.js` — **deleted**
- the `@vercel/node` build entry in `vercel.json` — **removed**

`vercel.json` is static hosting only; all server-side logic runs in Supabase.


---

## 5. How to confirm it is working

1. `npm run dev` → open `http://localhost:3000/admin`
2. Log in with the Supabase Auth email/password from step 1
3. The header shows your email and a green **🟢 Connected** badge
4. If you are connected but the list is empty, an amber warning appears that
   names your account — that means auth is fine and the problem is RLS or an
   empty table, and the message tells you so
5. Complete a real registration at `/register` and pay
6. The wizard now verifies the payment server-side **before** writing, so a
   green success screen means the row is genuinely in the database

---

## Recovering already-paid customers

Any customer charged while the old code was inserting `NULL` surnames has **no
row** in the database — the insert failed, but Paystack kept the money. Their
reference is `Rex360<timestamp><suffix>`.

Use `verify-old-payments.js` (already in the repo) with your Paystack secret to
list recent successful transactions, then re-key those customers manually:

```sql
INSERT INTO public.registrations
  (service_type, surname, firstname, phone, email, amount, paystack_ref, payment_status, full_details)
VALUES
  ('Business Name', '...', '...', '...', '...', 35000, 'Rex360...', 'paid', '{}'::jsonb);
```

Ask each customer for the name, email and phone on their receipt to fill these in.
