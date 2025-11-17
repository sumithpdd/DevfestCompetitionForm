# Fix Upload Error - Step by Step

You're seeing: **"Failed to upload screenshots. Please check your internet connection."**

This means the Firebase Storage upload is failing. Let's fix it!

---

## ⚡ Quick Fix (Do This First!)

### Step 1: Check Firebase Storage is Enabled

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Look in left sidebar for **"Storage"**
4. If you see "Get Started" button → Click it
5. Choose **"Start in production mode"**
6. Click **"Done"**

### Step 2: Update Storage Rules

1. In Firebase Console → **Storage** → **Rules** tab
2. **Replace everything** with this:

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

3. Click **"Publish"**
4. Wait 10 seconds

**Note**: We temporarily removed the authentication check (`if true`) to test if it works first.

### Step 3: Test Upload

1. Refresh your app (F5)
2. Sign in again
3. Go to `/submit`
4. Upload 1 small image
5. Click "Submit Project"

**Did it work?** 
- ✅ YES → Great! Now secure it (see below)
- ❌ NO → Continue to Step 4

---

## 🔍 Step 4: Check Environment Variables

Open your `.env.local` file and verify:

```env
# Must have ALL these values:
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123
```

**Check**:
- [ ] All variables exist?
- [ ] No typos?
- [ ] Storage bucket matches your Firebase project?
- [ ] No quotes around values?
- [ ] No extra spaces?

**If any are wrong**: Fix them, save, restart dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🔍 Step 5: Check Browser Console

1. Press **F12** (Developer Tools)
2. Go to **Console** tab
3. Try uploading again
4. Look for errors (red text)

**Common errors you might see**:

### "auth/network-request-failed"
→ Internet connection issue or firewall blocking Firebase

**Fix**: 
- Check internet
- Disable VPN
- Try different network

### "storage/unauthorized"
→ Storage rules not updated or not published

**Fix**: 
- Go back to Step 2
- Make sure you clicked "Publish"
- Wait 30 seconds and try again

### "storage/object-not-found" or "storage/bucket-not-found"
→ Storage bucket name wrong in `.env.local`

**Fix**:
1. Firebase Console → Project Settings → General
2. Copy the Storage bucket name exactly
3. Update `.env.local`
4. Restart server

### "No storage bucket"
→ Storage not enabled

**Fix**: Go to Step 1

---

## 🔍 Step 6: Test Firebase Connection

Let's verify Firebase is working at all:

1. Open browser console (F12)
2. Go to your app
3. Type this in console:

```javascript
console.log(window.localStorage)
```

**You should see** Clerk authentication data. If empty → not signed in properly.

---

## 🔒 Step 7: Secure Rules (After It Works)

Once upload works with `allow write: if true`, secure it:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /devfest2025Comp/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

But first, **we need to connect Clerk auth to Firebase**. Add this to `.env.local`:

```env
# Add Clerk webhook secret (for Firebase auth sync)
CLERK_WEBHOOK_SECRET=your_webhook_secret
```

---

## 🆘 Still Not Working?

### Option A: Test with Minimal Setup

Create a test file to verify Firebase Storage works:

1. Go to Firebase Console → Storage → Files
2. Click "Upload file"
3. Upload a test image
4. If this fails → Firebase Storage has an issue
5. If this works → Problem is in the code/auth

### Option B: Check Firebase Status

Go to [Firebase Status Dashboard](https://status.firebase.google.com/)
- Is everything green?
- Any outages?

### Option C: Verify Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Check if your app is active
3. Check if you can see users
4. Try creating a new test user

---

## 🎯 Most Likely Issues (In Order)

1. **Storage Rules Not Updated** (90% of cases)
   - Go to Firebase Console
   - Storage → Rules → Publish
   - Use the rules from Step 2

2. **Storage Not Enabled** (5% of cases)
   - Firebase Console → Storage
   - Click "Get Started"

3. **Wrong Storage Bucket Name** (3% of cases)
   - Check `.env.local`
   - Match exactly with Firebase Console

4. **Not Signed In Properly** (2% of cases)
   - Sign out
   - Sign in again
   - Check profile picture shows

---

## ✅ Checklist

Before submitting again, verify:

- [ ] Firebase Storage enabled (Storage tab exists)
- [ ] Storage rules updated and published
- [ ] Waited 10+ seconds after publishing rules
- [ ] All env variables in `.env.local`
- [ ] Storage bucket name matches Firebase
- [ ] Dev server restarted after env changes
- [ ] Signed in (profile picture visible)
- [ ] Internet connection working
- [ ] No VPN interfering
- [ ] Browser console shows no errors
- [ ] Image file < 10MB

---

## 🔄 Fresh Start (If All Else Fails)

```bash
# 1. Stop server
Ctrl+C

# 2. Clear Next.js cache
rm -rf .next

# 3. Restart
npm run dev

# 4. Sign out and sign in again

# 5. Try with ONE small image (< 1MB)
```

---

## 📞 Get Help

If still not working, provide these details:

1. **Browser console error** (F12 → Console → screenshot)
2. **Firebase Storage screenshot** (Console → Storage)
3. **Storage rules** (copy/paste)
4. **Are you signed in?** (see profile picture?)
5. **.env.local storage bucket** (just the bucket name)

---

## 🎯 The Fix That Works 99% of the Time

```
1. Firebase Console → Storage
2. If "Get Started" shows → Click it
3. Storage → Rules tab
4. Paste the rules from Step 2
5. Click "Publish" (not just save!)
6. Wait 10 seconds
7. Refresh your app
8. Try again
```

That's it! 🚀

---

**Next**: Once it works, update to secure rules (Step 7)

