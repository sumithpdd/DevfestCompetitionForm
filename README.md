# DevFest 2025 London - AI Innovation Lab

> **🚀 Competition submission platform built with Next.js, Firebase, and Clerk**

A modern web application for managing AI project submissions for the DevFest 2025 London AI Innovation Lab competition.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14-orange)](https://firebase.google.com/)
[![Clerk](https://img.shields.io/badge/Clerk-5.7-purple)](https://clerk.com/)

---

## ✨ Features

- 🔐 **Authentication** - Secure sign-in with Clerk
- 📝 **Draft System** - Save and resume submissions
- 📸 **Multi-Upload** - Up to 5 screenshots per project
- 🏆 **Winner Selection** - Admin panel for selecting top 3
- 🎯 **Interests & Social** - Profile tags and social links
- 📱 **Responsive** - Works on all devices
- 🎨 **Modern UI** - Clean, light theme with DevFest colors

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Setup Firebase

Update Firebase rules from `firebase-rules.txt`:
- **Firestore**: Collection `DevFestComp2025`
- **Storage**: Folder `devfest2025Comp`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
DevfestCompetitionForm/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home page
│   ├── submit/              # Submission form
│   ├── gallery/             # Public gallery
│   └── admin/               # Admin panel
├── components/ui/           # shadcn UI components
├── lib/                     # Utilities
│   ├── firebase.ts          # Firebase config
│   ├── constants.ts         # App constants
│   └── validators.ts        # Input validation
├── types/                   # TypeScript types
├── docs/                    # Documentation
├── public/                  # Static assets
└── firebase-rules.txt       # Firebase security rules
```

---

## 🔥 Firebase Setup

### Firestore Rules

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

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /devfest2025Comp/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

---

## 🎯 Key Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/submit` | Protected (Clerk) | Submit projects (with drafts) |
| `/gallery` | Public | View all submissions |
| `/admin` | Admin (Clerk role) | Manage submissions & select winners |
| `/admin/users` | Admin (Clerk role) | User role management |

### Admin Access & Roles

Role-based access control following [Clerk's official RBAC guide](https://clerk.com/docs/guides/secure/basic-rbac):

- **Admin** 🛡️: Full access (manage submissions, users, winners)
- **Moderator** 👮: Read-only access to submissions
- **User** 👤: Submit projects, view gallery

**📖 Setup Guide**: [docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md)  
**🛡️ Technical Docs**: [docs/CLERK_RBAC_IMPLEMENTATION.md](docs/CLERK_RBAC_IMPLEMENTATION.md)

---

## 🚢 Deploy to Vercel

### Quick Deploy

```bash
npm install -g vercel
vercel
```

### Via Dashboard

1. Push to GitHub
2. Import to [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy! 🎉

**📖 See [docs/DEPLOY.md](docs/DEPLOY.md) for detailed instructions**

---

## 📚 Documentation

### 🌱 New to React/Next.js/Firebase? Start Here:
- **[docs/START_HERE.md](docs/START_HERE.md)** - Complete beginner's guide (technologies explained)
- **[docs/FEATURES_SIMPLE.md](docs/FEATURES_SIMPLE.md)** - What the app does (simple explanations)
- **[docs/ADMIN_SIMPLE.md](docs/ADMIN_SIMPLE.md)** - Become an admin (step-by-step)

### 🚀 Experienced Developer? Jump To:
- **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** - Technical setup guide
- **[docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md)** - Admin & role configuration
- **[docs/DEPLOY.md](docs/DEPLOY.md)** - Deploy to Vercel

### 📖 Complete Documentation:
- **[docs/README.md](docs/README.md)** - Full documentation index with all guides
- **[docs/CHECKLIST.md](docs/CHECKLIST.md)** - Pre-deployment checklist
- **[firebase-rules.txt](firebase-rules.txt)** - Firebase security rules

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.6
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **UI**: shadcn/ui + Tailwind CSS
- **Font**: Poppins
- **Deployment**: Vercel

---

## 🔒 Security

✅ Environment variables in `.env.local` (gitignored)  
✅ Firebase security rules configured  
✅ Clerk authentication on protected routes  
⚠️ **Change admin credentials for production!**

---

## 📝 Firebase Collection Structure

**Collection**: `DevFestComp2025`

```typescript
{
  fullName: string
  email: string
  githubUrl: string
  appPurpose: string
  screenshots: string[]
  interests: string[]
  linkedinUrl?: string
  twitterUrl?: string
  // ... other social links
  userId: string
  userEmail: string
  status: "draft" | "submitted"
  place: "first" | "second" | "third" | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🆘 Support

- 📖 Check [docs/](docs/) for guides
- 🐛 Open a [GitHub issue](../../issues)
- 💬 Check [discussions](../../discussions)

---

## 🎉 Event Details

- **Event**: DevFest 2025 London
- **Date**: November 22nd, 2025
- **Location**: LSE Centre Building (CBG), WC2A 2AE
- **Theme**: AI Innovation Lab Competition

---

**Built with ❤️ for DevFest 2025 London**

🔗 [Deploy Guide](docs/DEPLOY.md) | [Documentation](docs/) | [Firebase Rules](firebase-rules.txt)
