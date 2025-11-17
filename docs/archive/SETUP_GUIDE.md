# Detailed Setup Guide for Junior Developers

This guide will walk you through every step of setting up the Devfest 2025 Competition Form application from scratch. Don't worry if you're new to web development – we'll explain everything!

## Table of Contents

1. [Understanding the Tech Stack](#understanding-the-tech-stack)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Project Setup](#project-setup)
4. [Clerk Authentication Setup](#clerk-authentication-setup)
5. [Firebase Setup](#firebase-setup)
6. [Running the Application](#running-the-application)
7. [Understanding the Code Structure](#understanding-the-code-structure)
8. [Common Issues and Solutions](#common-issues-and-solutions)

## Understanding the Tech Stack

### What is each technology used for?

- **Next.js**: A React framework that makes building web applications easier. It handles routing, server-side rendering, and optimization.
- **TypeScript**: JavaScript with types. It helps catch errors before you run your code.
- **Clerk**: Provides user authentication (sign up, sign in, user management) without building it yourself.
- **Firebase**: Google's platform that provides:
  - **Firestore**: A NoSQL database to store submission data
  - **Storage**: Cloud storage for uploaded images
- **shadcn/ui**: Pre-built, beautiful UI components that you can customize
- **Tailwind CSS**: A utility-first CSS framework for styling
- **Vercel**: A platform for deploying Next.js applications

## Prerequisites Installation

### 1. Install Node.js

Node.js is a JavaScript runtime that lets you run JavaScript on your computer.

**Windows:**
1. Go to [nodejs.org](https://nodejs.org)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Mac:**
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Verify
node --version
npm --version
```

### 2. Install Git

Git is a version control system.

**Windows:**
1. Download from [git-scm.com](https://git-scm.com)
2. Run installer with default options
3. Verify: `git --version`

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

### 3. Install a Code Editor

We recommend **Visual Studio Code**:
1. Download from [code.visualstudio.com](https://code.visualstudio.com)
2. Install recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

## Project Setup

### Step 1: Clone the Repository

```bash
# Navigate to where you want the project
cd ~/projects

# Clone the repository
git clone https://github.com/yourusername/DevfestCompetitionForm.git

# Navigate into the project
cd DevfestCompetitionForm
```

### Step 2: Install Dependencies

```bash
# This will install all packages listed in package.json
npm install

# Wait for it to complete (may take a few minutes)
```

### Step 3: Create Environment Variables File

```bash
# Copy the example file
cp .env.example .env.local

# Open it in your editor
code .env.local
```

Now you need to fill in the values. Don't worry, we'll get them in the next sections!

## Clerk Authentication Setup

Clerk handles all user authentication for us. Here's how to set it up:

### Step 1: Create a Clerk Account

1. Go to [clerk.com](https://clerk.com)
2. Click "Sign Up" (it's free!)
3. Verify your email

### Step 2: Create an Application

1. In Clerk Dashboard, click "Create Application"
2. Name it "Devfest Competition Form"
3. Choose authentication methods:
   - ✅ Email
   - ✅ Google
   - ✅ GitHub (optional)
4. Click "Create Application"

### Step 3: Get Your API Keys

1. In your Clerk application, go to "API Keys" in the sidebar
2. You'll see two keys:
   - **Publishable Key**: Starts with `pk_test_`
   - **Secret Key**: Starts with `sk_test_`

3. Copy these to your `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

### Step 4: Configure Clerk Settings

1. Go to "User & Authentication" → "Email, Phone, Username"
2. Make sure "Email Address" is required
3. Go to "Paths" and set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/submit`

## Firebase Setup

Firebase will store our data and images.

### Step 1: Create a Firebase Account

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click "Get Started"
3. Sign in with your Google account

### Step 2: Create a Project

1. Click "Create a project"
2. Project name: "Devfest Competition"
3. Enable Google Analytics (optional)
4. Click "Create project"
5. Wait for it to set up (takes ~30 seconds)

### Step 3: Set Up Firestore Database

1. In Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location close to you (e.g., `us-east1`)
5. Click "Enable"

### Step 4: Configure Firestore Rules

1. Go to "Firestore Database" → "Rules" tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{submission} {
      // Anyone can read submissions
      allow read: if true;
      
      // Only authenticated users can create
      allow create: if request.auth != null;
      
      // Only authenticated users can update
      allow update: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

### Step 5: Set Up Storage

1. Click "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in production mode"
4. Use the same location as Firestore
5. Click "Done"

### Step 6: Configure Storage Rules

1. Go to "Storage" → "Rules" tab
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /screenshots/{allPaths=**} {
      // Anyone can read screenshots
      allow read: if true;
      
      // Only authenticated users can upload
      allow write: if request.auth != null 
                   && request.resource.size < 10 * 1024 * 1024; // Max 10MB
    }
  }
}
```

3. Click "Publish"

### Step 7: Get Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the `</>` icon (Web)
5. Register app name: "Devfest Web App"
6. Don't set up Firebase Hosting
7. Copy the configuration values

8. Add to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 8: Set Admin Email

In `.env.local`, add your email for admin access:

```env
NEXT_PUBLIC_ADMIN_EMAIL=your.email@example.com
```

## Running the Application

### Development Mode

```bash
# Start the development server
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- info Loaded env from .env.local
```

Open your browser to [http://localhost:3000](http://localhost:3000)

### What You Should See

1. **Home Page**: Landing page with competition info
2. Click **"Sign In"**: Should open Clerk sign-in modal
3. Create an account
4. Navigate to **"/submit"**: Should see the submission form
5. Navigate to **"/admin"**: Should see admin panel (if using admin email)

## Understanding the Code Structure

### Key Files Explained

**`app/layout.tsx`**: 
- Root layout for your entire app
- Includes Clerk provider for authentication
- Sets up dark mode theme
- Applies Poppins font globally

**`app/page.tsx`**: 
- Home page component
- Shows landing page with features
- Sign in/sign up buttons

**`app/submit/page.tsx`**: 
- Submission form for users
- Handles file uploads
- Saves data to Firebase

**`app/admin/page.tsx`**: 
- Admin dashboard
- Shows all submissions
- Allows winner selection

**`lib/firebase.ts`**: 
- Initializes Firebase
- Exports database and storage instances

**`middleware.ts`**: 
- Protects routes requiring authentication
- Runs before page loads

**`components/ui/*`**: 
- Reusable UI components from shadcn/ui
- Button, Card, Input, etc.

### How Data Flow Works

1. **User submits form** → `app/submit/page.tsx`
2. **Images uploaded** → Firebase Storage
3. **Data saved** → Firestore Database
4. **Gallery fetches** → Firestore Database
5. **Admin updates winners** → Firestore Database

## Common Issues and Solutions

### Issue: "Module not found" Error

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Firebase "Permission Denied"

**Solution:**
- Check Firebase rules are published
- Verify you're signed in to the app
- Check environment variables are correct

### Issue: Clerk Sign-in Not Working

**Solution:**
- Verify API keys in `.env.local`
- Check Clerk dashboard application status
- Restart dev server after changing env variables

### Issue: "Cannot find module @/..."

**Solution:**
- Check `tsconfig.json` has correct paths configuration
- Restart your IDE/code editor
- Clear Next.js cache: `rm -rf .next`

### Issue: Styles Not Loading

**Solution:**
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Issue: Image Upload Fails

**Solution:**
- Check Firebase Storage rules
- Verify storage bucket name in `.env.local`
- Check file size (must be < 10MB)
- Check internet connection

## Next Steps

Now that you have the app running:

1. **Customize**: Change colors, fonts, text
2. **Add features**: More form fields, email notifications
3. **Test**: Try submitting projects, selecting winners
4. **Deploy**: Follow the deployment guide to put it online!

## Getting Help

- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Clerk Docs**: [clerk.com/docs](https://clerk.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Stack Overflow**: Search for specific errors
- **GitHub Issues**: Report bugs in the repository

---

Happy coding! 🚀

