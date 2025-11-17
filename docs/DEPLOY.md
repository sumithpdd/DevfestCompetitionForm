# Deploy to Vercel

Quick guide to deploy your DevFest 2025 London AI Innovation Lab app to Vercel.

## Prerequisites

✅ GitHub account  
✅ Vercel account (sign up at [vercel.com](https://vercel.com))  
✅ Firebase project configured  
✅ Clerk account configured

---

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - DevFest 2025 Competition App"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Click **"Import"**

### Step 3: Configure Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app is live! 🎉

---

## Option 2: Deploy via Vercel CLI

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Deploy

```bash
# Development deployment
vercel

# Production deployment
vercel --prod
```

### Add Environment Variables

```bash
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... add all other variables
```

---

## Post-Deployment Checklist

### 1. Update Clerk Allowed Origins

Go to [Clerk Dashboard](https://dashboard.clerk.com):
- Settings → **Domains**
- Add your Vercel domain: `your-app.vercel.app`

### 2. Update Firebase Authorized Domains

Go to [Firebase Console](https://console.firebase.google.com):
- Authentication → Settings → **Authorized domains**
- Add: `your-app.vercel.app`

### 3. Update Admin Password (CRITICAL!)

⚠️ **For production, change the hardcoded admin credentials!**

Edit `app/admin/login/page.tsx`:

```typescript
// Current (demo only)
if (formData.username === "admin" && formData.password === "admin")

// Change to secure credentials or use environment variables
```

### 4. Verify Firebase Rules

Check that your Firebase rules are properly set:

```bash
# Firestore: DevFestComp2025 collection
# Storage: devfest2025Comp folder
```

See `firebase-rules.txt` for reference.

---

## Custom Domain (Optional)

### Add Custom Domain

1. Vercel Dashboard → Your Project → Settings → **Domains**
2. Add your domain (e.g., `devfest2025.yourdomain.com`)
3. Configure DNS:
   - **Type**: `CNAME`
   - **Name**: `devfest2025` (or `@` for root)
   - **Value**: `cname.vercel-dns.com`

### Update Clerk & Firebase

Add your custom domain to:
- Clerk: Settings → Domains
- Firebase: Authentication → Authorized domains

---

## Monitoring & Logs

### View Deployment Logs

```bash
vercel logs your-deployment-url
```

### Check Build Logs

Vercel Dashboard → Your Project → Deployments → Select deployment → View logs

---

## Troubleshooting

### Build Fails

**Issue**: Missing environment variables

**Fix**: Ensure all environment variables are added in Vercel Dashboard

### Clerk Authentication Not Working

**Issue**: Domain not whitelisted

**Fix**: Add Vercel domain to Clerk allowed origins

### Firebase Permission Errors

**Issue**: Rules not updated or wrong domain

**Fix**:
1. Check `firebase-rules.txt` and update Firebase Console
2. Add Vercel domain to Firebase authorized domains

### 404 on Routes

**Issue**: Next.js routing not configured

**Fix**: This shouldn't happen with Next.js 14 App Router, but check `vercel.json` if needed

---

## Environment Variables Reference

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | `pk_test_...` |
| `CLERK_SECRET_KEY` | ✅ | `sk_test_...` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | `project-id` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | `project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | `1:123:web:abc` |

---

## Continuous Deployment

Once connected to GitHub, Vercel automatically deploys:
- **Main branch** → Production
- **Other branches** → Preview deployments
- **Pull requests** → Preview deployments with unique URLs

---

## Need Help?

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)
- 🐛 Check deployment logs for errors

---

**Your app will be live at**: `https://your-project-name.vercel.app`

🎉 **Happy deploying!**

