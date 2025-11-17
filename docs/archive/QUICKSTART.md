# Quick Start Guide

Get the Devfest Competition Form up and running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git

## 1. Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/DevfestCompetitionForm.git
cd DevfestCompetitionForm

# Install dependencies
npm install
```

## 2. Set Up Environment Variables (5 minutes)

```bash
# Copy environment template
cp .env.example .env.local
```

### Get Clerk Keys (2 minutes)

1. Go to [clerk.com](https://clerk.com) → Sign up (free)
2. Create a new application
3. Copy API keys from dashboard
4. Paste into `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
```

### Get Firebase Keys (3 minutes)

1. Go to [firebase.google.com](https://firebase.google.com) → Sign in
2. Create a new project
3. Enable Firestore Database (production mode)
4. Enable Storage (production mode)
5. Go to Project Settings → Your apps → Web app
6. Copy configuration and paste into `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Set Admin Email

```env
NEXT_PUBLIC_ADMIN_EMAIL=your.email@example.com
```

## 3. Configure Firebase (2 minutes)

### Firestore Rules

In Firebase Console → Firestore → Rules:

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

Click "Publish"

### Storage Rules

In Firebase Console → Storage → Rules:

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

Click "Publish"

## 4. Run the App (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Test It Out

1. ✅ Click "Sign In" and create an account
2. ✅ Go to "Submit Your Project"
3. ✅ Fill out the form and upload screenshots
4. ✅ Submit and view in Gallery
5. ✅ Visit `/admin` to manage submissions

## Deployment to Vercel (5 minutes)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
3. Import your repository
4. Add all environment variables from `.env.local`
5. Deploy!

## Common Issues

**Port 3000 in use?**
```bash
PORT=3001 npm run dev
```

**Changes not reflecting?**
```bash
rm -rf .next
npm run dev
```

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- 📖 Read the full [README.md](README.md)
- 🛠️ Check [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for detailed setup
- 🚀 Follow [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for production
- 🤝 See [CONTRIBUTING.md](docs/CONTRIBUTING.md) to contribute

## Need Help?

- Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- Open an issue on GitHub
- Review the documentation in `/docs`

---

**That's it!** You're now ready to run Devfest 2025 Competition Form! 🎉

