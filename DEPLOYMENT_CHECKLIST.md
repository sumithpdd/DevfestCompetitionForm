# 🚀 Vercel Deployment Checklist

Complete this checklist to deploy your DevFest 2025 Competition App.

---

## ✅ Pre-Deployment (Already Done!)

- [x] Code pushed to GitHub
- [x] `.env.example` created
- [x] `.env.local` in `.gitignore`
- [x] No hardcoded secrets in code
- [x] All environment variables documented

---

## 📝 Deployment Steps

### Step 1: Import to Vercel

- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Click "Import Git Repository"
- [ ] Select repository: `sumithpdd/DevfestCompetitionForm`
- [ ] Framework: Next.js (auto-detected)
- [ ] Root Directory: `./` (default)

### Step 2: Configure Build Settings

Vercel will auto-detect these (verify they're correct):

- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next` (auto)
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

Click "Environment Variables" and add these **8 variables**:

#### Clerk Variables (2)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = [your Clerk publishable key]
CLERK_SECRET_KEY = [your Clerk secret key]
```

**Where to find**: [Clerk Dashboard](https://dashboard.clerk.com) → Your App → API Keys

#### Firebase Variables (6)
```
NEXT_PUBLIC_FIREBASE_API_KEY = [your API key]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = [your-project].firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = [your-project-id]
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = [your-project].appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [your sender ID]
NEXT_PUBLIC_FIREBASE_APP_ID = [your app ID]
```

**Where to find**: [Firebase Console](https://console.firebase.google.com) → Project Settings → Web App

**Important**:
- Select all environments: Production, Preview, Development
- No quotes around values
- Copy entire key including prefixes

### Step 4: Deploy!

- [ ] Click "Deploy" button
- [ ] Wait 2-3 minutes for build
- [ ] Deployment complete! 🎉

---

## 🔧 Post-Deployment Configuration

### Update Clerk URLs

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **Domains**
4. Add your Vercel domain: `your-app.vercel.app`
5. Update these URLs in Clerk:
   - **Home URL**: `https://your-app.vercel.app`
   - **Sign in URL**: `https://your-app.vercel.app/sign-in`
   - **Sign up URL**: `https://your-app.vercel.app/sign-up`
   - **After sign in**: `https://your-app.vercel.app`
   - **After sign up**: `https://your-app.vercel.app`

### Update Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain: `your-app.vercel.app`

### Verify Deployment

- [ ] Visit your Vercel URL
- [ ] Home page loads correctly
- [ ] Click "Sign In" - Clerk modal appears
- [ ] Sign in successfully
- [ ] Navigate to `/submit` - form appears
- [ ] Upload test image - works without errors
- [ ] Check Firebase Console - submission appears
- [ ] Visit `/gallery` - your submission shows
- [ ] Admin badge appears (if you're admin)
- [ ] Click "Admin Panel" - works

---

## 🐛 Troubleshooting

### Build Fails

**Check**:
- All environment variables added?
- Correct variable names (case-sensitive)?
- No extra spaces in values?

**Solution**: Vercel Dashboard → Deployments → Click failed deployment → View logs

### "Clerk Error: Invalid publishable key"

**Solution**:
1. Verify key in Clerk Dashboard
2. Check environment variable in Vercel
3. Redeploy after fixing

### "Firebase: Permission denied"

**Solution**:
1. Check Firebase rules (see `firebase-rules.txt`)
2. Verify Storage rules allow public write
3. Verify Firestore rules allow public write

### Images Don't Upload

**Solution**:
1. Check Firebase Storage rules
2. Verify `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is correct
3. Check browser console (F12) for errors

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Build completes without errors  
✅ Site loads at your Vercel URL  
✅ Sign in/up works  
✅ Can submit projects  
✅ Images upload to Firebase  
✅ Gallery shows submissions  
✅ Admin panel accessible (if admin)  

---

## 🔄 Redeployment

If you make changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel automatically deploys on every push to `main`!

---

## 📊 Monitoring

### Vercel Dashboard

Monitor your app:
- **Deployments**: See all deployments
- **Analytics**: Track visits (paid feature)
- **Logs**: View server logs
- **Speed Insights**: Performance metrics

### Firebase Console

Monitor your data:
- **Firestore**: View submissions
- **Storage**: View uploaded images
- **Usage**: Check quotas

---

## 🎯 Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
   - Vercel Dashboard → Settings → Domains
   - Add your domain (e.g., `devfest2025.com`)

2. **Make yourself admin**
   - Follow [docs/ADMIN_SIMPLE.md](docs/ADMIN_SIMPLE.md)
   - Add `role: "admin"` in Clerk Dashboard

3. **Test everything**
   - Submit test project
   - Select winners
   - Verify emails work

4. **Share with users!**
   - Send link to participants
   - Monitor submissions
   - Select winners

---

## 💡 Pro Tips

- **Free tier limits**: Vercel free tier has 100GB bandwidth/month
- **Firebase limits**: Free tier: 50K reads/day, 20K writes/day
- **Custom domain**: Add in Vercel Settings → Domains
- **HTTPS**: Automatic with Vercel!
- **CI/CD**: Automatic deploys on every push

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Clerk Production Checklist](https://clerk.com/docs/deployments/production-checklist)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)

---

**Ready to launch! 🚀 Good luck with DevFest 2025!**

