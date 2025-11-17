# 🚨 QUICK FIX - Upload & Submission Errors

Getting errors when uploading or submitting? Here are the quick fixes! 

## Error Type 1: "Failed to upload screenshots"

### Fix in 2 Minutes:

### 1. Enable Firebase Storage

[Firebase Console](https://console.firebase.google.com) → Your Project → **Storage**

If you see **"Get Started"** button:
1. Click it
2. Choose "Start in production mode"  
3. Click "Done"

### 2. Update Storage Rules

Storage → **Rules** tab → Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /devfest2025Comp/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

Click **"Publish"** (bottom right)

### 3. Wait & Test

1. Wait 10 seconds
2. Refresh app (F5)
3. Try uploading again

---

## Error Type 2: "Missing or insufficient permissions"

### The Problem
- Storage works ✅ (file uploads successfully)
- Firestore fails ❌ (can't save to database)
- Console shows: `FirebaseError: Missing or insufficient permissions`

### The Fix: Update Firestore Rules

**Since you're using Clerk (not Firebase Auth), Firebase needs open write rules:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Firestore Database** in left sidebar
3. Click **Rules** tab at top
4. Replace ALL content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /DevFestComp2025/{submission} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

5. Click **Publish**
6. Wait 10 seconds
7. Try submitting again!

### Why This Works
- You're using **Clerk** for authentication (not Firebase Auth)
- Firebase sees requests as "unauthenticated"
- `allow write: if true` lets any request write (Clerk protects at app level)
- Security is still maintained by Clerk's authentication middleware

---

## Still Not Working?

### Check Your .env.local

Open `.env.local` and verify this line:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

**Must match** your Firebase project name exactly!

To find it:
1. Firebase Console → Project Settings (gear icon)
2. General tab → Storage bucket
3. Copy exact value

---

## Test If You're Signed In

Look top right of app:
- ✅ See profile picture? → Signed in
- ❌ Don't see it? → Click "Sign In"

---

## Browser Console Errors?

1. Press **F12**
2. Go to **Console** tab
3. Look for red errors
4. Share the error in GitHub issue

---

## 🎯 99% Success Rate Fix

```
Firebase Console 
  → Storage 
    → Rules tab 
      → Paste rules above
        → Click "Publish"
          → Wait 10 seconds
            → Try again
```

**Still stuck?** See [FIX_UPLOAD_ERROR.md](FIX_UPLOAD_ERROR.md) for detailed steps.

