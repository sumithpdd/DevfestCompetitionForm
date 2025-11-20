# 🚀 Deployment Guide

Complete guide to deploying your DevFest Competition Form to Vercel with Firebase.

---

## Table of Contents
- [Quick Start (5 Minutes)](#quick-start-5-minutes)
- [Detailed Deployment](#detailed-deployment)
- [Post-Deployment Setup](#post-deployment-setup)
- [Troubleshooting](#troubleshooting)

---

## Quick Start (5 Minutes)

### Prerequisites
- ✅ Firebase project created
- ✅ Code pushed to GitHub
- ✅ Vercel account (free)

### Step 1: Enable Firebase Authentication (2 min)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Authentication** → **Sign-in method**
4. Enable **Email/Password** ✅
5. Enable **Google** ✅
6. Click **Save**

### Step 2: Deploy to Vercel (2 min)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repo
4. Click **"Import"**
5. Add these 6 environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Where to find these?**
- Firebase Console → ⚙️ (Settings) → Project settings → Your apps → Web app

6. Select **all 3 environments** (Production, Preview, Development)
7. Click **"Deploy"**
8. Wait 2-3 minutes ⏳

### Step 3: Configure Firebase Domain (1 min)

After deployment:

1. Copy your Vercel URL: `your-app-name.vercel.app`
2. Go back to Firebase Console
3. **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Paste: `your-app-name.vercel.app`
6. Click **"Add"**

**⚠️ Critical**: Without this step, authentication won't work!

### Step 4: Create Admin User (1 min)

1. Visit your deployed app: `https://your-app-name.vercel.app`
2. Click **"Sign In"** → **"Sign Up"**
3. Create an account
4. Go to Firebase Console → **Firestore Database**
5. Open the `CompetitionUsers` collection
6. Find your user document
7. Click to edit
8. Add/update field: `role` = `"admin"`
9. Log out and log back in

**Now you're an admin!** 🎉

---

## Detailed Deployment

### Option A: Vercel Dashboard (Recommended)

#### 1. Import Repository
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

#### 2. Configure Environment Variables

Add all 6 Firebase variables:

| Variable | Example Value | Where to Find |
|----------|---------------|---------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIza...` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `project.firebaseapp.com` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `project-id` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `project.appspot.com` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123:web:abc` | Firebase Console → Project Settings |

**Important**: Select all 3 environments (Production, Preview, Development)

#### 3. Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Done! 🎉

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

Follow the prompts to set environment variables.

---

## Post-Deployment Setup

### 1. Update Firebase Authorized Domains

**⚠️ Critical Step**

1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Click "Add domain"
3. Add your Vercel domain: `your-app-name.vercel.app`
4. Save

Without this step, users will see "auth/unauthorized-domain" errors!

### 2. Set Up Admin User

To make a user an admin:

1. **Sign up** on your deployed app
2. Go to **Firebase Console** → **Firestore Database**
3. Find the `CompetitionUsers` collection
4. Locate your user document (by email)
5. Edit the document:
   - Set `role` field to: `"admin"`
6. Log out and log back in

**Admin users can**:
- Access `/admin` panel
- Assign winners (1st, 2nd, 3rd place)
- Delete submissions
- View all user data
- Manage user roles at `/admin/users`

### 3. Update Firestore Rules

Ensure your Firestore rules are properly configured:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /CompetitionUsers/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == userId || get(/databases/$(database)/documents/CompetitionUsers/$(request.auth.uid)).data.role == "admin");
    }
    
    // Competition submissions
    match /DevFestComp2025/{submissionId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/CompetitionUsers/$(request.auth.uid)).data.role == "admin");
    }
    
    // AI Devcamp 2026 - Mentees
    match /AIDevcamp2026Mentees/{applicationId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/CompetitionUsers/$(request.auth.uid)).data.role == "admin");
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/CompetitionUsers/$(request.auth.uid)).data.role == "admin");
    }
    
    // AI Devcamp 2026 - Mentors
    match /AIDevcamp2026Mentors/{applicationId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/CompetitionUsers/$(request.auth.uid)).data.role == "admin");
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/CompetitionUsers/$(request.auth.uid)).data.role == "admin");
    }
    
    // AI Devcamp 2026 - Tags
    match /AIDevcamp2026Tags/{category}/tags/{tagId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Update Storage Rules

For resume uploads and screenshots:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Competition screenshots
    match /devfest2025Comp/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.resource.size < 10 * 1024 * 1024; // 10MB max
    }
    
    // Mentor resumes
    match /aidevcamp2026/mentors/{userId}/{fileName} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         firestore.get(/databases/(default)/documents/CompetitionUsers/$(request.auth.uid)).data.role == "admin");
      allow write: if request.auth != null && 
        request.auth.uid == userId && 
        request.resource.size < 5 * 1024 * 1024; // 5MB max
    }
  }
}
```

---

## Verification Checklist

After deployment, test:

- [ ] Visit your Vercel URL
- [ ] Click "Sign In" button
- [ ] Sign up with email/password works
- [ ] Sign in with Google works
- [ ] Go to `/submit` - can submit project
- [ ] Upload screenshot works
- [ ] Check Firestore - submission saved
- [ ] Visit `/gallery` - submission displays
- [ ] Admin user sees admin badge
- [ ] Admin panel works (`/admin`)
- [ ] User management works (`/admin/users`)
- [ ] Apply as Mentee works (`/join-mentee`)
- [ ] Apply as Mentor works (`/join-mentor`)
- [ ] Resume upload works

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update app"
git push origin main
```

- **Main branch** → Production deployment
- **Other branches** → Preview deployments
- **Pull requests** → Temporary preview URLs

---

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"

**Fix**: Add your Vercel domain to Firebase Authorized Domains:
1. Firebase Console → Authentication → Settings → Authorized domains
2. Add `your-app.vercel.app`

### "Permission denied" when submitting

**Fix**: Check Firestore rules allow authenticated writes:
```javascript
allow write: if request.auth != null;
```

### "Admin panel not showing"

**Fix**: 
1. Check Firestore `CompetitionUsers` collection
2. Find your user document
3. Set `role: "admin"`
4. Log out and log back in

### Images not uploading

**Fix**: Check Firebase Storage rules:
```javascript
allow write: if request.auth != null && 
  request.resource.size < 10 * 1024 * 1024; // 10MB
```

### Build fails on Vercel

**Common causes**:
- Missing environment variables
- TypeScript errors
- Linter errors

**Fix**:
1. Check Vercel build logs
2. Run `npm run build` locally
3. Fix any errors
4. Push changes

### "Failed to upload resume"

**Fix**:
- Check Storage rules are published
- Check file is < 5MB
- Check file type is PDF or Word
- Check Firebase Storage is enabled

### "Already applied" message

**Fix**:
- Users can only apply once per program
- Check Firestore to see existing application
- Delete document if testing

---

## Local Development

### Setup `.env.local`

Create `.env.local` in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Run Development Server

```bash
npm install
npm run dev
```

Visit: `http://localhost:3000`

---

## Security Notes

- ✅ All Firebase config keys are safe to expose (they're meant to be public)
- ✅ Security is enforced by Firebase Rules, not by hiding keys
- ✅ Always use Firestore and Storage rules to protect data
- ⚠️ Never commit `.env.local` to Git (it's in `.gitignore`)

---

## Optional: Custom Domain

If you want a custom domain:

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)
4. Add domain to Firebase Authorized Domains

**Remember**: Custom domains are optional! Your app works great on `.vercel.app`

---

## Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)
- [Firebase Setup Guide](./FIREBASE_SETUP.md)

---

## Summary

✅ **No custom domain required**  
✅ **Just 6 environment variables**  
✅ **Works perfectly on `.vercel.app`**  
✅ **Full authentication included**  
✅ **Production-ready in 5 minutes**

**Your app is now live!** 🚀

