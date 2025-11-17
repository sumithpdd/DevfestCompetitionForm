# Environment Variables Guide

This guide explains all environment variables needed for the app and how to get them.

---

## 📋 Required Environment Variables

### Clerk (Authentication)

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public key for Clerk client | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Secret key for Clerk server | Clerk Dashboard → API Keys |

**How to get Clerk keys:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application (or create new one)
3. Click "API Keys" in left sidebar
4. Copy both keys

### Firebase (Database & Storage)

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain (format: `project-id.firebaseapp.com`) | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase project ID | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket (format: `project-id.appspot.com`) | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | Firebase Console → Project Settings |

**How to get Firebase config:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create new one)
3. Click gear icon → Project Settings
4. Scroll to "Your apps" section
5. Click "Web app" icon (`</>`) or select existing web app
6. Copy all config values

---

## 🔧 Setup Instructions

### Local Development

1. **Copy the example file:**
   ```bash
   # Windows
   copy .env.example .env.local
   
   # Mac/Linux
   cp .env.example .env.local
   ```

2. **Open `.env.local` in your editor**

3. **Replace placeholder values:**
   - Replace `your_publishable_key_here` with actual Clerk key
   - Replace `your_secret_key_here` with actual Clerk secret
   - Replace `your-project-id` with your Firebase project ID
   - Replace all other placeholders with actual values

4. **Save the file**

5. **Restart your dev server:**
   ```bash
   npm run dev
   ```

### Production (Vercel)

**Never commit `.env.local` to Git!**

Instead, add environment variables in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Value: Your actual Clerk publishable key
   - Environment: Production, Preview, Development (check all)
5. Click "Save"
6. Repeat for all variables

**After adding variables:**
- Redeploy your app for changes to take effect

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use `.env.local` for local development
- ✅ Add variables to Vercel for production
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use different keys for development and production
- ✅ Rotate keys if they're ever exposed

### ❌ DON'T:
- ❌ Commit `.env.local` to Git
- ❌ Share keys in Slack/Discord/Email
- ❌ Hardcode keys in source code
- ❌ Push keys to GitHub
- ❌ Use production keys in development

---

## 🔍 Understanding `NEXT_PUBLIC_` Prefix

### Variables with `NEXT_PUBLIC_`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
```

- **Accessible in browser** (client-side)
- **Included in JavaScript bundle**
- **Safe to expose** (they're meant to be public)
- Used in client components

### Variables without `NEXT_PUBLIC_`:
```
CLERK_SECRET_KEY
```

- **Only accessible on server**
- **Never sent to browser**
- **Must be kept secret**
- Used in server components and API routes

---

## 🧪 Verify Environment Variables

Create this test page to verify your variables are loaded:

**`app/test-env/page.tsx`** (Delete after testing!)
```typescript
export default function TestEnv() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="space-y-2">
        <div>
          <strong>Clerk Publishable Key:</strong>{' '}
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}
        </div>
        
        <div>
          <strong>Firebase Project ID:</strong>{' '}
          {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Missing'}
        </div>
        
        <div>
          <strong>Firebase API Key:</strong>{' '}
          {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-600">
        Delete this file after verifying!
      </p>
    </div>
  )
}
```

Visit `http://localhost:3000/test-env` to check.

---

## 🐛 Troubleshooting

### "Environment variable not found"

**Solution:**
1. Make sure `.env.local` exists in project root
2. Restart dev server (`npm run dev`)
3. Check variable name spelling (case-sensitive!)
4. Verify no extra spaces before/after `=`

### "Clerk error: Invalid publishable key"

**Solution:**
1. Check you copied the correct key from Clerk Dashboard
2. Make sure it starts with `pk_test_` or `pk_live_`
3. No extra spaces or quotes around the value
4. Try regenerating the key in Clerk Dashboard

### "Firebase: Error (auth/invalid-api-key)"

**Solution:**
1. Verify API key in Firebase Console
2. Check the key hasn't been restricted
3. Make sure you're using the Web API key (not iOS/Android)
4. Try creating a new Web app in Firebase

### Variables work locally but not in Vercel

**Solution:**
1. Go to Vercel → Project → Settings → Environment Variables
2. Make sure all variables are added
3. Check they're enabled for Production environment
4. Redeploy the project

---

## 📚 Related Documentation

- [Clerk Environment Variables](https://clerk.com/docs/deployments/clerk-environment-variables)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## ✅ Checklist

Before running the app:

- [ ] Created `.env.local` from `.env.example`
- [ ] Added Clerk publishable key
- [ ] Added Clerk secret key
- [ ] Added all 6 Firebase config values
- [ ] No placeholder text remaining
- [ ] Restarted dev server
- [ ] App runs without env errors

Before deploying to Vercel:

- [ ] All variables added to Vercel dashboard
- [ ] Variables enabled for Production
- [ ] Test deployment successful
- [ ] No hardcoded keys in code

---

**Keep your keys secure! 🔒**

