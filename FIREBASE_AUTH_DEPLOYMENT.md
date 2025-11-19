# 🚀 Deploy to Vercel with Firebase Authentication

This guide covers deploying your DevFest Competition Form to Vercel using **Firebase Authentication** (no custom domain required!).

---

## ✅ Prerequisites

- GitHub account
- Vercel account ([sign up free](https://vercel.com))
- Firebase project configured
- Code pushed to GitHub

---

## 📋 Step 1: Firebase Setup

### Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Enable these providers:
   - ✅ **Email/Password** (Required)
   - ✅ **Google** (Recommended)

### Configure Authorized Domains

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add: `localhost` (for local development)
3. After Vercel deployment, add: `your-app.vercel.app`

### Update Firestore Rules

Add user management rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Existing competition submissions
    match /DevFestComp2025/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. **Go to**: [vercel.com/new](https://vercel.com/new)

2. **Import Repository**:
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Add Environment Variables**:

   Only **6 variables** needed (no Clerk!):

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

   **Where to find these**:
   - Firebase Console → Project Settings → Your apps → Web app

   **Important**: Select all 3 environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

---

## 🔧 Step 3: Post-Deployment Setup

### Update Firebase Authorized Domains

1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Click "Add domain"
3. Add your Vercel domain: `your-app-name.vercel.app`
4. Save

**⚠️ Important**: Without this step, authentication will fail on Vercel!

---

## 👤 Step 4: Set Up Admin User

To make a user an admin:

1. **Sign up** on your deployed app
2. Go to **Firebase Console** → **Firestore Database**
3. Find the `users` collection
4. Locate your user document (by email)
5. Edit the document:
   - Set `role` field to: `"admin"`
6. Log out and log back in

**Admin users can**:
- Access `/admin` panel
- Assign winners (1st, 2nd, 3rd place)
- Delete submissions
- View all user data

---

## ✅ Verification Checklist

After deployment, test:

- [ ] Visit your Vercel URL
- [ ] Click "Sign In" button
- [ ] Sign up with email/password works
- [ ] Sign in with Google works
- [ ] Go to `/submit` - can submit project
- [ ] Upload image works
- [ ] Check Firestore - submission saved
- [ ] Visit `/gallery` - submission displays
- [ ] Admin user sees "Admin Panel" button
- [ ] Admin panel works (`/admin`)

---

## 📊 Environment Variables Reference

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | `project-id` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | `project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | `1:123:web:abc` |

**Note**: No Clerk keys needed! ✅

---

## 🔄 Continuous Deployment

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

## 🐛 Troubleshooting

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
1. Check Firestore `users` collection
2. Find your user document
3. Set `role: "admin"`
4. Log out and log back in

### Images not uploading

**Fix**: Check Firebase Storage rules:
```javascript
allow write: if request.auth != null && 
  request.resource.size < 10 * 1024 * 1024; // 10MB
```

---

## 🎯 Local Development

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

## 🔒 Security Notes

- ✅ All Firebase config keys are safe to expose (they're meant to be public)
- ✅ Security is enforced by Firebase Rules, not by hiding keys
- ✅ Always use Firestore and Storage rules to protect data
- ⚠️ Never commit `.env.local` to Git (it's in `.gitignore`)

---

## 📚 Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🎉 Your App is Live!

Your deployment URL: `https://your-app-name.vercel.app`

**No custom domain needed!** ✅

Works perfectly with Firebase Auth on Vercel's `.vercel.app` domain.

---

## 💡 Optional: Custom Domain

If you want a custom domain later:

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records
4. Add domain to Firebase Authorized Domains

But remember: **Custom domains are optional!** Your app works great on `.vercel.app`

