# OpenAI API Setup

## To fix the "AI Enhancement" feature:

### 1. Get your OpenAI API Key
- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Sign up/login and create a new API key
- Copy the key (starts with `sk-...`)

### 2. Add the API Key to your project
- Create a file named `.env` in the `server` folder
- Add this line to the file:
```
OPENAI_API_KEY=sk-your_actual_api_key_here
```

### 3. Restart the server
- Stop the server (Ctrl+C)
- Start it again: `npm start`

### 4. Test the AI Enhancement
- Fill in your resume details
- Click "Enhance with AI"
- It should now work!

---

## PDF Download Fix
The PDF download has been fixed to include all your form data. Just fill in the form and click "Download as PDF".

---

**Note:** The API key is only needed for AI enhancement. The basic resume builder and PDF download work without it.

---

## Jobs Near You (Dashboard)

The Dashboard's "Jobs near you" panel calls Adzuna's job search API.

1. Sign up for a free key at [Adzuna Developer](https://developer.adzuna.com/)
2. Add these to `server/.env`:
```
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
ADZUNA_COUNTRY=gb
```
`ADZUNA_COUNTRY` is the two-letter country code Adzuna's API expects (e.g. `gb`, `us`, `za`, `in`) — check [their docs](https://developer.adzuna.com/docs/search) for currently supported countries.

Without these keys, the Dashboard shows sample job listings instead, so nothing breaks — it just won't be live data.

---

## Chatbot

The chatbot widget (bottom-right bubble, on every page) reuses the same `OPENROUTER_API_KEY` you already set up above — no extra key needed. Without a key, it still works using a small set of canned answers about templates, downloads, AI enhancement, and sign-in.

---

## Google Sign-In

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID** of type "Web application"
3. Add your app's URL (e.g. `http://localhost:3000`) to **Authorized JavaScript origins**
4. Copy the generated Client ID
5. Create a file named `.env` in the `client` folder and add:
```
REACT_APP_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```
6. Restart the client (`npm start`)

If this variable isn't set, the "Sign in with Google" button simply doesn't render — email/password sign-in still works as before.

**Note:** Google accounts are matched by email into the app's existing local user store (the same `localStorage`-based system used for email/password accounts) — there's no separate backend database.
