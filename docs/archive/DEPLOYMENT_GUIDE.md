# Deployment Guide to Vercel

This comprehensive guide will walk you through deploying your Devfest Competition Form to Vercel, making it live on the internet!

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Preparing for Deployment](#preparing-for-deployment)
3. [Method 1: Deploy via Vercel Dashboard (Recommended for Beginners)](#method-1-deploy-via-vercel-dashboard)
4. [Method 2: Deploy via Vercel CLI](#method-2-deploy-via-vercel-cli)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Continuous Deployment](#continuous-deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, make sure you have:

✅ Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
✅ A Vercel account (free tier is sufficient)
✅ All environment variables ready
✅ Firebase and Clerk configured
✅ The app running successfully locally

## Preparing for Deployment

### Step 1: Push Your Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Devfest Competition Form"

# Create a repository on GitHub, then:
git remote add origin https://github.com/yourusername/DevfestCompetitionForm.git

# Push to GitHub
git push -u origin main
```

### Step 2: Test Production Build Locally

```bash
# Build the application
npm run build

# This should complete without errors
# If you get errors, fix them before deploying

# Test the production build
npm run start
```

### Step 3: Verify Environment Variables

Make sure your `.env.local` has all required variables:
- Clerk keys
- Firebase configuration
- Admin email

**Important**: Never commit `.env.local` to GitHub! It should be in `.gitignore`.

## Method 1: Deploy via Vercel Dashboard

This is the easiest method, perfect for beginners.

### Step 1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your repositories

### Step 2: Import Your Project

1. Click "Add New" → "Project"
2. You'll see a list of your GitHub repositories
3. Find "DevfestCompetitionForm"
4. Click "Import"

### Step 3: Configure Project Settings

1. **Framework Preset**: Next.js (should be auto-detected)
2. **Root Directory**: `./` (default)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)

**Don't click Deploy yet!** We need to add environment variables first.

### Step 4: Add Environment Variables

Click "Environment Variables" section:

Add each variable one by one:

1. **Name**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   **Value**: Your Clerk publishable key
   
2. **Name**: `CLERK_SECRET_KEY`
   **Value**: Your Clerk secret key
   
3. **Name**: `NEXT_PUBLIC_FIREBASE_API_KEY`
   **Value**: Your Firebase API key
   
4. **Name**: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   **Value**: Your Firebase auth domain
   
5. **Name**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   **Value**: Your Firebase project ID
   
6. **Name**: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   **Value**: Your Firebase storage bucket
   
7. **Name**: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   **Value**: Your Firebase messaging sender ID
   
8. **Name**: `NEXT_PUBLIC_FIREBASE_APP_ID`
   **Value**: Your Firebase app ID
   
9. **Name**: `NEXT_PUBLIC_ADMIN_EMAIL`
   **Value**: Your admin email

**Important**: Select "Production", "Preview", and "Development" for all variables.

### Step 5: Deploy

1. Click "Deploy"
2. Watch the build logs
3. Wait 2-5 minutes for deployment
4. You'll see "Congratulations!" when done

Your app is now live! 🎉

## Method 2: Deploy via Vercel CLI

For developers who prefer the command line.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

```bash
# From your project directory
cd DevfestCompetitionForm

# Deploy (first time)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Choose your account
# - Link to existing project? No
# - Project name? DevfestCompetitionForm
# - Directory? ./
# - Override settings? No
```

### Step 4: Add Environment Variables

```bash
# Add each environment variable
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# When prompted, paste the value
# Select: Production, Preview, Development

# Repeat for all variables
```

Or add them via the Vercel Dashboard as described in Method 1.

### Step 5: Deploy to Production

```bash
vercel --prod
```

## Post-Deployment Configuration

### Update Clerk Settings

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to "Paths"
4. Add your Vercel domain to allowed domains:
   - `https://your-app.vercel.app`
5. Update redirect URLs if needed

### Update Firebase Settings

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to "Authentication" → "Settings" → "Authorized domains"
4. Add your Vercel domain:
   - `your-app.vercel.app`
5. Click "Add domain"

### Test Your Deployment

Visit your Vercel URL and test:

1. ✅ Home page loads
2. ✅ Sign in works
3. ✅ Can submit a project
4. ✅ Gallery shows submissions
5. ✅ Admin panel works (with admin email)
6. ✅ File uploads work
7. ✅ Winner selection works

## Custom Domain Setup

Want to use your own domain like `devfest.yourdomain.com`?

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Enter your domain
4. Click "Add"

### Step 2: Configure DNS

Vercel will show you DNS records to add:

**For a subdomain (e.g., devfest.yourdomain.com):**
- Type: `CNAME`
- Name: `devfest`
- Value: `cname.vercel-dns.com`

**For a root domain (e.g., yourdomain.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`

Add these records in your domain registrar (GoDaddy, Namecheap, etc.).

### Step 3: Wait for DNS Propagation

- Can take 1-48 hours (usually < 1 hour)
- Check status in Vercel Dashboard
- You'll see "Valid Configuration" when ready

### Step 4: Update Clerk and Firebase

Add your custom domain to Clerk and Firebase authorized domains (see Post-Deployment Configuration).

## Continuous Deployment

Once set up, deployments are automatic!

### How It Works

Every time you push to GitHub:
1. Vercel detects the push
2. Automatically builds your app
3. Deploys to a preview URL
4. If you push to `main` branch, updates production

### Preview Deployments

Every branch and pull request gets a unique preview URL:
- `your-app-git-branch-name-yourusername.vercel.app`
- Perfect for testing before merging to production

### Manual Deployments

```bash
# Deploy current branch
vercel

# Deploy to production
vercel --prod

# Deploy specific branch
git checkout feature-branch
vercel
```

## Troubleshooting

### Build Fails with "Module not found"

**Solution:**
```bash
# Ensure all dependencies are in package.json
npm install

# Commit updated package-lock.json
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Environment Variables Not Working

**Solution:**
1. Check variable names match exactly (including `NEXT_PUBLIC_` prefix)
2. Redeploy after adding variables:
   ```bash
   vercel --prod
   ```
3. Check you selected "Production" when adding variables

### "Application Error" After Deployment

**Solution:**
1. Check build logs in Vercel Dashboard
2. Look for errors in the "Functions" tab
3. Verify all environment variables are set
4. Check Firebase and Clerk configurations

### Firebase Connection Fails

**Solution:**
1. Add Vercel domain to Firebase authorized domains
2. Check Firebase security rules
3. Verify environment variables
4. Check Firebase billing (some features require Blaze plan)

### Clerk Authentication Redirects Wrong

**Solution:**
1. Update Clerk authorized domains
2. Check redirect URLs in Clerk dashboard
3. Update environment variables
4. Clear browser cache and test

### Images Not Uploading

**Solution:**
1. Check Firebase Storage rules
2. Verify storage bucket in environment variables
3. Check file size limits
4. Test locally first to isolate issue

### Admin Panel Not Working

**Solution:**
1. Verify `NEXT_PUBLIC_ADMIN_EMAIL` is set in Vercel
2. Sign in with exact email (case-sensitive)
3. Check browser console for errors
4. Verify Firebase permissions

## Monitoring Your Application

### Vercel Analytics

1. Go to your project in Vercel
2. Click "Analytics"
3. See page views, performance metrics

### Check Logs

1. Go to your project in Vercel
2. Click "Deployments"
3. Click on a deployment
4. View "Build Logs" and "Function Logs"

### Performance

Vercel automatically provides:
- ✅ CDN caching
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Edge functions
- ✅ Global deployment

## Best Practices

1. **Always test locally before deploying**
   ```bash
   npm run build
   npm run start
   ```

2. **Use preview deployments for testing**
   - Create a branch
   - Make changes
   - Push and test preview URL
   - Merge when ready

3. **Keep environment variables secure**
   - Never commit to Git
   - Use Vercel's environment variables
   - Rotate keys regularly

4. **Monitor your deployment**
   - Check build logs
   - Review analytics
   - Test after each deployment

5. **Use custom domain**
   - More professional
   - Better for SEO
   - Easier to remember

## Updating Your Application

```bash
# Make changes to your code
# Commit changes
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin main

# Vercel automatically deploys!
```

## Rollback to Previous Version

If something goes wrong:

1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find the working deployment
4. Click "..." → "Promote to Production"

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Custom Domains Guide](https://vercel.com/docs/concepts/projects/domains)

---

Congratulations! Your app is now live and accessible to the world! 🌍✨

