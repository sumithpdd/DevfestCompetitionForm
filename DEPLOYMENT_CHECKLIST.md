# 🚀 Deploy to Vercel - Quick Guide

Your domain: **comp.devfestlondon.com**

---

## Step 1: Push to GitHub ✅ (Done!)

Your code is already on GitHub: `sumithpdd/DevfestCompetitionForm`

---

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. **Go to**: [vercel.com/new](https://vercel.com/new)

2. **Import Repository**:
   - Click "Import Git Repository"
   - Select `sumithpdd/DevfestCompetitionForm`
   - Click "Import"

3. **Add Environment Variables**:

Click "Environment Variables" and add these **8 variables**:

```
# Clerk (2 variables)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = [your-key]
CLERK_SECRET_KEY = [your-secret]

# Firebase (6 variables)
NEXT_PUBLIC_FIREBASE_API_KEY = [your-key]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = [your-project].firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = [your-project-id]
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = [your-project].appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [your-id]
NEXT_PUBLIC_FIREBASE_APP_ID = [your-app-id]
```

**Where to find these**:
- Clerk: [dashboard.clerk.com](https://dashboard.clerk.com) → API Keys
- Firebase: [console.firebase.google.com](https://console.firebase.google.com) → Project Settings

**Important**: Select all 3 environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Step 3: Configure Custom Domain

### In Vercel:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add domain: `comp.devfestlondon.com`
3. Vercel will show DNS records to add

### In Your DNS Provider:

Add these DNS records (values from Vercel):

```
Type: CNAME
Name: comp
Value: cname.vercel-dns.com
```

Or if using A record:
```
Type: A
Name: comp
Value: [IP from Vercel]
```

**DNS propagation takes 5-60 minutes**

---

## Step 4: Update Clerk URLs

After deployment, update these in [Clerk Dashboard](https://dashboard.clerk.com):

1. Go to **Domains** section
2. Add domain: `comp.devfestlondon.com`
3. Update redirect URLs:
   - Home: `https://comp.devfestlondon.com`
   - Sign in: `https://comp.devfestlondon.com/sign-in`
   - Sign up: `https://comp.devfestlondon.com/sign-up`
   - After sign in: `https://comp.devfestlondon.com`

---

## Step 5: Update Firebase

In [Firebase Console](https://console.firebase.google.com):

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add: `comp.devfestlondon.com`
3. Save

---

## ✅ Verification Checklist

After deployment, test:

- [ ] Visit `https://comp.devfestlondon.com`
- [ ] Home page loads
- [ ] Click "Sign In" - Clerk modal appears
- [ ] Sign in successfully
- [ ] Go to `/submit` - form works
- [ ] Upload test image
- [ ] Check Firebase - submission saved
- [ ] Visit `/gallery` - submission shows
- [ ] Admin badge appears (if admin)
- [ ] Click "Admin Panel" - works

---

## 🎯 Quick Reference

| What | URL |
|------|-----|
| **Your App** | https://comp.devfestlondon.com |
| **GitHub** | github.com/sumithpdd/DevfestCompetitionForm |
| **Vercel Dashboard** | vercel.com/dashboard |
| **Clerk Dashboard** | dashboard.clerk.com |
| **Firebase Console** | console.firebase.google.com |

---

## 🐛 Common Issues

### Build Fails

**Check**: Environment variables added correctly?

**Fix**: Vercel → Settings → Environment Variables → Verify all 8 are there

### "Clerk Error"

**Fix**: Update Clerk domains to include `comp.devfestlondon.com`

### Images Don't Upload

**Fix**: Firebase → Storage Rules → Verify `allow write: if request.resource.size < 10 * 1024 * 1024;`

### "Access Denied" in Admin Panel

**Fix**: 
1. Clerk Dashboard → Users → Select your user
2. Metadata → Public → Add: `{"role": "admin"}`
3. Log out and log back in

---

## 🔄 Redeployment

Vercel auto-deploys on every push to `main`:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically rebuild and deploy!

---

## 📊 Monitoring

### Vercel Dashboard

- **Deployments**: See all deploys
- **Logs**: View server logs
- **Analytics**: Track visits (if enabled)

### Firebase Console

- **Firestore**: View submissions
- **Storage**: View images
- **Usage**: Check quotas

---

**🎉 Your app is live at https://comp.devfestlondon.com!**
