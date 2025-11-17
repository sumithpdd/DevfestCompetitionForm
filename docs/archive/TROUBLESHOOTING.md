# Troubleshooting Guide

Common issues and their solutions for the Devfest Competition Form application.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Development Server Issues](#development-server-issues)
3. [Authentication Issues](#authentication-issues)
4. [Firebase Issues](#firebase-issues)
5. [Build and Deployment Issues](#build-and-deployment-issues)
6. [UI and Styling Issues](#ui-and-styling-issues)
7. [Performance Issues](#performance-issues)

## Installation Issues

### Error: "npm install" fails

**Problem**: Dependencies fail to install

**Solutions**:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Alternative**: Try using a different package manager:
```bash
# Using yarn
yarn install

# Using pnpm
pnpm install
```

### Error: "Node version incompatible"

**Problem**: Your Node.js version is too old

**Solution**:
```bash
# Check your Node version
node --version

# Should be 18.0.0 or higher
# Update Node.js from nodejs.org or use nvm:

# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install correct Node version
nvm install 18
nvm use 18
```

### Error: "Cannot find module"

**Problem**: TypeScript can't find modules

**Solution**:
```bash
# Reinstall dependencies
npm install

# Clear Next.js cache
rm -rf .next

# Restart your IDE/editor
```

## Development Server Issues

### Error: Port 3000 already in use

**Problem**: Another application is using port 3000

**Solutions**:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Error: "Module not found: Can't resolve '@/...'"

**Problem**: Path alias not configured correctly

**Solution**:

Check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Restart your dev server and IDE.

### Hot Reload Not Working

**Problem**: Changes don't reflect automatically

**Solutions**:

```bash
# Stop the server (Ctrl+C)
# Clear cache
rm -rf .next

# Restart
npm run dev
```

**For WSL users**:
```bash
# Add to next.config.mjs
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}
```

## Authentication Issues

### Clerk Sign-in Modal Not Opening

**Problem**: Sign-in button does nothing

**Solutions**:

1. Check environment variables:
```bash
# .env.local must have:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

2. Restart dev server after adding env variables

3. Check browser console for errors

4. Verify Clerk dashboard shows application as active

### "Invalid publishable key" Error

**Problem**: Wrong or missing Clerk keys

**Solution**:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to "API Keys"
4. Copy the correct keys
5. Update `.env.local`
6. Restart server

### User Session Not Persisting

**Problem**: User gets signed out on page refresh

**Solutions**:

1. Check browser cookies are enabled
2. Check if running in incognito/private mode
3. Clear browser cache and cookies
4. Verify Clerk configuration:
   - Go to Clerk Dashboard → Sessions
   - Check "Session lifetime" settings

### Redirect Loop After Sign In

**Problem**: App keeps redirecting between sign-in and home

**Solution**:

Check `middleware.ts`:
```typescript
// Ensure sign-in pages are not protected
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/gallery',
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});
```

## Firebase Issues

### "Permission Denied" Error

**Problem**: Can't read/write to Firestore

**Solutions**:

1. Check Firebase rules in Console → Firestore → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{submission} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
```

2. Click "Publish" after updating rules

3. Verify user is signed in (check with `useUser()` hook)

### Firebase Connection Failed

**Problem**: Can't connect to Firebase

**Solutions**:

1. Verify all Firebase env variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

2. Check Firebase project exists and is active

3. Verify billing is enabled (required for some features)

4. Check network/firewall settings

### File Upload Fails

**Problem**: Screenshots don't upload to Storage

**Solutions**:

1. Check Storage rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /screenshots/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

2. Verify file size < 10MB

3. Check file is an image

4. Verify storage bucket name in env variables

5. Check Firebase Storage is enabled in Console

### "Quota Exceeded" Error

**Problem**: Reached Firebase free tier limits

**Solutions**:

Free tier limits:
- Firestore: 50k reads, 20k writes per day
- Storage: 5GB, 1GB download per day

1. Check usage in Firebase Console → Usage and billing

2. Wait for quota reset (daily)

3. Upgrade to Blaze plan if needed

4. Optimize queries to reduce reads

## Build and Deployment Issues

### Build Fails with TypeScript Errors

**Problem**: `npm run build` shows type errors

**Solution**:

```bash
# Check errors
npm run build

# Fix each type error
# Common fixes:
# 1. Add proper types to variables
# 2. Fix import paths
# 3. Add null checks

# Verify build succeeds
npm run build
```

### Vercel Deployment Fails

**Problem**: Build fails on Vercel

**Solutions**:

1. Check build logs in Vercel Dashboard

2. Test production build locally:
```bash
npm run build
npm run start
```

3. Verify all environment variables are set in Vercel

4. Check Node.js version matches (.nvmrc file)

5. Ensure no build warnings/errors

### Environment Variables Not Working in Vercel

**Problem**: App can't connect to Firebase/Clerk after deploy

**Solutions**:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. Verify all variables are added

3. Check "Production", "Preview", and "Development" are selected

4. Redeploy:
```bash
vercel --prod
```

### "Application Error" on Deployed Site

**Problem**: White screen or error page on production

**Solutions**:

1. Check Vercel Function logs:
   - Vercel Dashboard → Your Project → Deployments
   - Click deployment → "Functions" tab

2. Check browser console for errors

3. Verify all API keys are correct

4. Test each feature:
   - Authentication
   - Database connection
   - File upload

## UI and Styling Issues

### Tailwind Styles Not Applying

**Problem**: Components look unstyled

**Solutions**:

1. Check `tailwind.config.ts`:
```typescript
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
],
```

2. Verify `globals.css` imports Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. Restart dev server

### Dark Mode Not Working

**Problem**: App shows light mode

**Solution**:

Check `app/layout.tsx`:
```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem={false}
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### Font Not Loading

**Problem**: Poppins font not displaying

**Solutions**:

1. Check `app/layout.tsx`:
```tsx
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
```

2. Verify CSS variable in `tailwind.config.ts`:
```typescript
fontFamily: {
  sans: ['var(--font-poppins)', 'sans-serif'],
},
```

3. Check internet connection (Google Fonts CDN)

### Responsive Design Broken on Mobile

**Problem**: Layout looks wrong on mobile

**Solutions**:

1. Test with browser dev tools (mobile view)

2. Check Tailwind responsive prefixes:
```tsx
// Mobile first
<div className="flex flex-col md:flex-row">
```

3. Verify viewport meta tag in `app/layout.tsx`

## Performance Issues

### Slow Page Load

**Problem**: Pages take long to load

**Solutions**:

1. Optimize images:
   - Use Next.js Image component
   - Compress images before upload
   - Use WebP format

2. Check Firebase queries:
   - Add indexes
   - Limit query results
   - Use pagination

3. Enable caching

4. Check network tab in browser dev tools

### Firebase Reads Too High

**Problem**: Exceeding free tier read quota

**Solutions**:

1. Add client-side caching:
```typescript
const [submissions, setSubmissions] = useState<Submission[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Only fetch once
  if (submissions.length === 0) {
    fetchSubmissions();
  }
}, []);
```

2. Use Firebase local persistence

3. Implement pagination

4. Cache data in localStorage (with expiry)

### Large Bundle Size

**Problem**: Initial load is slow

**Solutions**:

1. Check bundle analyzer:
```bash
npm install @next/bundle-analyzer
```

2. Use dynamic imports:
```typescript
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <p>Loading...</p>,
});
```

3. Remove unused dependencies

4. Enable code splitting

## Getting More Help

### Useful Commands

```bash
# Clear everything and restart
rm -rf .next node_modules package-lock.json
npm install
npm run dev

# Check for updates
npm outdated

# Update dependencies
npm update

# Run linter
npm run lint
```

### Debug Mode

Enable verbose logging:

```typescript
// lib/firebase.ts
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase initialized:', app.name);
}
```

### Browser Console

Always check browser console:
- F12 or Ctrl+Shift+I (Windows/Linux)
- Cmd+Option+I (Mac)

Look for:
- ❌ Red errors
- ⚠️ Yellow warnings
- 🌐 Network errors

### Still Stuck?

1. Search existing issues on GitHub
2. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version, browser)
   - Screenshots
3. Ask in project discussions
4. Check documentation links in README

### Useful Links

- [Next.js Troubleshooting](https://nextjs.org/docs/messages)
- [Clerk Troubleshooting](https://clerk.com/docs/troubleshooting/overview)
- [Firebase Troubleshooting](https://firebase.google.com/support/troubleshooter)
- [Vercel Support](https://vercel.com/support)

---

If you found a solution not listed here, please contribute to this guide!

