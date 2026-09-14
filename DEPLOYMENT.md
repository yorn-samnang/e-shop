# Free portfolio deployment

This repository deploys as four managed resources:

| Resource | Provider | Repository root |
| --- | --- | --- |
| Storefront | Vercel | `Ecommerce` |
| Admin dashboard | Vercel | `AdminDashboard` |
| REST API | Render | `Backend` |
| PostgreSQL | Supabase | Managed outside this repository |

Product, banner, and avatar images share one **public Vercel Blob store**. Only
server-side Next.js routes receive its write token. Those routes validate the
caller's Django JWT before uploading.

## 1. Create the Supabase database

1. Create a Free Supabase project and save its database password.
2. Open **Connect** and copy the **Session pooler** URI (port `5432`). It works
   over IPv4 and is appropriate for the persistent Render backend.
3. Replace the password placeholder in the URI. Percent-encode special
   characters in the password.
4. Keep this URI for Render's `DATABASE_URL`. Do not expose it to either
   frontend.

Django runs committed migrations whenever the Render container starts.

## 2. Deploy Django on Render

1. In Render, create a **Blueprint** from this repository. Render reads
   `render.yaml` and creates the `csb-ecommerce-api` Free web service.
2. Supply the prompted environment variables:

   ```env
   DATABASE_URL=postgresql://postgres.project-ref:encoded-password@pooler-host:5432/postgres
   ALLOWED_HOSTS=csb-ecommerce-api.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-store.vercel.app https://your-admin.vercel.app
   CSRF_TRUSTED_ORIGINS=https://your-store.vercel.app https://your-admin.vercel.app
   GOOGLE_OAUTH_CLIENT_ID=your-web-client.apps.googleusercontent.com
   ```

3. Deploy and confirm that
   `https://csb-ecommerce-api.onrender.com/api/health/` returns
   `{"status": "ok"}`.

If the generated Render service name differs, use its actual hostname in every
following step.

## 3. Deploy the storefront on Vercel

1. Import this Git repository as a new Vercel project.
2. Set **Root Directory** to `Ecommerce`; keep the detected Next.js build
   settings.
3. Set these Production environment variables:

   ```env
   NEXT_PUBLIC_API_URL=https://csb-ecommerce-api.onrender.com/api
   NEXT_PUBLIC_BACKEND_BASE_URL=https://csb-ecommerce-api.onrender.com
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-web-client.apps.googleusercontent.com
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

## 4. Deploy the admin dashboard on Vercel

1. Import the same repository as a second Vercel project.
2. Set **Root Directory** to `AdminDashboard`.
3. Set these Production environment variables:

   ```env
   NEXT_PUBLIC_BACKEND_BASE_URL=https://csb-ecommerce-api.onrender.com
   BACKEND_INTERNAL_URL=https://csb-ecommerce-api.onrender.com
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

`BACKEND_INTERNAL_URL` is intentionally the public Render URL on Vercel. The
Docker-only value `http://backend:8000` must not be used in production.

## 5. Connect Vercel Blob

1. Create one **public** Blob store in Vercel Storage and connect it to the
   admin project.
2. Make the same `BLOB_READ_WRITE_TOKEN` available to the storefront project.
3. Redeploy both Vercel projects after setting the token.

Never create a variable named `NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN`; that would
expose write access in browser JavaScript.

## 6. Finish Google sign-in

In the Google Cloud Console, add the production storefront URL to the Web OAuth
client's **Authorized JavaScript origins**. This callback-based flow does not
need an Authorized Redirect URI. The client ID must exactly match the value in
the storefront and Render environments.

## 7. Create the portfolio admin account

Render Free does not include interactive shell access. Create the first admin
locally while connected to Supabase:

```bash
cd Backend/src
DATABASE_URL='your-session-pooler-uri' python manage.py createsuperuser
```

Alternatively, temporarily run the same command from a trusted machine with
the Render production environment values loaded.

## 8. Smoke test

Run these checks after all deployments finish:

1. Open `/api/health/` and `/api/docs/` on Render.
2. Register, log in, edit the profile, and upload an avatar in the storefront.
3. Log in as staff in the admin dashboard; create one product and one banner
   with images.
4. Confirm both images load in the storefront.
5. Place an order and confirm stock and order status in the admin dashboard.
6. Redeploy Render, then verify that database records and Blob images remain.

The first API request after 15 idle minutes can be slow because Render Free
spins the service down. This is expected for the portfolio deployment.
