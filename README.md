# Next.js Firebase Starter

Minimal, production-ready starter for building apps with:

- Next.js (App Router)
- TypeScript (strict)
- TailwindCSS
- shadcn/ui
- Firebase (Auth + Firestore)
- React Hook Form + Zod
- Onboarding flow (Guest / Host)

---

## 🚀 Features

- 🔐 Google Auth (Firebase)
- 👤 User Profile (Firestore)
- 🧠 AuthProvider with real-time sync
- 🛡️ Route Guards (auth / onboarding / signed-in)
- 🧾 Form validation (react-hook-form + zod)
- 🧩 Clean folder structure
- ⚡ Server-first architecture
- 🌱 Seed script for demo data

---

## 📦 Tech Stack

- Next.js (App Router)
- TypeScript (strict)
- TailwindCSS
- shadcn/ui
- Firebase (Auth, Firestore, Admin SDK)
- React Hook Form
- Zod

---

## 🧱 Project Structure

app/ components/ ui/ guards/ providers/ lib/ firebase/ config/ types/ scripts/

---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
```

---

### 2. Firebase Setup

Create a Firebase project:

https://console.firebase.google.com

Enable:

- Authentication → Google
- Firestore Database

---

### 3. Environment Variables

Create: .env.local

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

### 4. Firebase Admin (for scripts)

Place your service account file in project root: serviceAccountKey.json

⚠️ Never commit this file

---

## 🧪 Development

```bash
npm run dev
```

---

## 🌱 Seed Database

```bash
npm run seed
```

Creates demo host profiles in Firestore.

---

## 🔐 Auth Flow

- Google login via Firebase
- User profile auto-created on first login
- Auth state synced via AuthProvider
- Guards handle routing

### Guards

- AuthGuard → protects authenticated routes
- OnboardingGuard → controls onboarding flow
- SignedInGuard → blocks auth pages for logged-in users

---

## 🧾 Forms

- Built with react-hook-form
- Validated with zod
- Minimal client state
- Fully typed

---
