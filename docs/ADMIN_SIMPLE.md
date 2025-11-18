# 🛡️ Admin Setup (Simple Guide)

This guide shows you how to become an admin and manage users.

---

## 🤔 What is an Admin?

An **admin** is a special user who can:
- ✅ See ALL submissions (including drafts)
- ✅ Select competition winners (1st, 2nd, 3rd place)
- ✅ Delete submissions
- ✅ Make other users admins or moderators

Regular users can only:
- ❌ Submit their own projects
- ❌ View the public gallery

---

## 🎯 Three User Roles

### 1. Admin 🛡️ (Most Power)
- See everything
- Change everything
- Manage other users
- **Badge**: Red with shield icon

### 2. Moderator ⚙️ (View Only)
- See all submissions
- **Cannot** edit or delete
- **Cannot** manage users
- **Badge**: Blue with gear icon

### 3. User 👤 (Standard)
- Submit projects
- View gallery
- **Badge**: Gray with user icon

---

## 🚀 How to Become an Admin

### Option 1: Using Clerk Dashboard (First Admin)

This is for creating the **very first admin** in your app.

#### Step 1: Sign Up in Your App
1. Open your app:
   - Local: `http://localhost:3000`
   - Production: `https://comp.devfestlondon.com`
2. Click "Sign In"
3. Create an account with your email
4. Complete signup

#### Step 2: One-Time Clerk Configuration
**You only do this ONCE for your entire app:**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click your application
3. Click "**Sessions**" in left sidebar
4. Scroll down to "**Customize session token**"
5. In the editor, type:
   ```json
   {
     "metadata": "{{user.public_metadata}}"
   }
   ```
6. Click "**Save**"

**What this does**: Makes user roles available to your app without extra database queries.

#### Step 3: Make Yourself Admin
1. Still in Clerk Dashboard
2. Click "**Users**" in left sidebar
3. Click on **your email**
4. Click "**Metadata**" tab
5. Under "**Public**" section, click "**Edit**"
6. Type:
   ```json
   {
     "role": "admin"
   }
   ```
7. Click "**Save**"

#### Step 4: Refresh Your Session
**Important**: You MUST log out and back in!

1. In your app, click your profile picture
2. Click "**Sign out**"
3. Click "**Sign In**" again
4. Log back in

**Why?** Clerk creates your session when you log in. Changes to your role don't apply until you log in again.

#### Step 5: Verify It Worked
After logging back in, you should see:
- ✅ Red "**Admin**" badge next to your profile picture
- ✅ "**Admin Panel**" button in the header

If you don't see these, check [Troubleshooting](#-troubleshooting) below.

---

### Option 2: Using Admin Panel (After First Admin)

Once you have ONE admin, that admin can make others admins!

#### Steps:
1. **Log in as admin**
2. Click "**Admin Panel**" button (top right)
3. Click "**Manage User Roles**" button
4. Type user's **name** or **email** in search box
5. Click "**Search**"
6. Find the user in results
7. Click "**Make Admin**" or "**Make Moderator**"
8. Done! (User must log out/in to see change)

**This is much easier!** No need to go to Clerk Dashboard.

---

## 🎯 What Can You Do as Admin?

### View Admin Panel
- Go to your app
- Click "**Admin Panel**" button (top right)
- You'll see:
  - 📊 Statistics (total submissions, drafts, winners)
  - 🏆 Current winners section
  - 📋 All submissions (including drafts)

### Select Winners
1. In Admin Panel, scroll to a submission
2. Find the "**Select Winner**" dropdown
3. Click dropdown
4. Choose:
   - 🥇 **First Place**
   - 🥈 **Second Place**
   - 🥉 **Third Place**
   - ❌ **No Place** (remove winner)
5. Automatically saved!

Winners show up with badges in the gallery.

### Delete Submissions
1. Find submission you want to delete
2. Click red "**Delete**" button
3. Confirm in popup (it will ask "Are you sure?")
4. Submission and all photos are deleted

**Warning**: This is permanent! No undo button.

### Manage Users
1. Click "**Manage User Roles**" button
2. Search for user by name or email
3. Click:
   - "**Make Admin**" - Give full control
   - "**Make Moderator**" - Give view-only access
   - "**Remove Role**" - Make them a regular user

**Note**: User must log out and back in to see their new role.

---

## 🎨 Understanding the Admin Interface

### Main Dashboard (`/admin`)

```
┌─────────────────────────────────────────────┐
│  [Winners Section]                          │
│  🥇 First: [Name or "Not selected"]        │
│  🥈 Second: [Name or "Not selected"]       │
│  🥉 Third: [Name or "Not selected"]        │
├─────────────────────────────────────────────┤
│  [Statistics Cards]                         │
│  Total: 15  |  Submitted: 12  |  Drafts: 3 │
├─────────────────────────────────────────────┤
│  [Submissions List]                         │
│  ┌───────────────────────────────────┐     │
│  │ Project Name                      │     │
│  │ [Screenshots]  [Details]          │     │
│  │ [Select Winner ▼]  [Delete 🗑️]    │     │
│  └───────────────────────────────────┘     │
│  ┌───────────────────────────────────┐     │
│  │ Another Project...                │     │
│  └───────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

### User Management (`/admin/users`)

```
┌─────────────────────────────────────────────┐
│  [Search Box]                               │
│  Search for users... [Search]               │
├─────────────────────────────────────────────┤
│  [Search Results]                           │
│  ┌───────────────────────────────────┐     │
│  │ John Doe                          │     │
│  │ john@example.com                  │     │
│  │ Current Role: User                │     │
│  │ [Make Admin] [Make Moderator]     │     │
│  │ [Remove Role]                     │     │
│  └───────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

---

## 🔍 How It Works (Behind the Scenes)

### Where is Role Stored?

Your role is stored in **Clerk** (not Firebase):

```
Clerk Database
└── Users
    └── your-email@example.com
        └── Public Metadata
            └── { "role": "admin" }
```

### How Does the App Know You're Admin?

1. **You log in** → Clerk creates a session token
2. **Session token includes** → Your role (`admin`)
3. **Every page checks** → "Is this user admin?"
4. **If yes** → Show admin features
5. **If no** → Show "Access Denied"

### Why Log Out and Back In?

```
Old Session (before making admin):
{
  userId: "123",
  email: "you@email.com",
  metadata: {}  ← No role!
}

New Session (after making admin):
{
  userId: "123",
  email: "you@email.com",
  metadata: {
    role: "admin"  ← Now you're admin!
  }
}
```

The session is created at login. Changes don't apply to your current session.

---

## 🐛 Troubleshooting

### "I don't see the Admin badge"

**Check 1**: Did you add `metadata` to session token?
- Clerk Dashboard → Sessions → Should see `"metadata": "{{user.public_metadata}}"`
- If not there, add it and **click Save**

**Check 2**: Did you add `role: admin` to your user?
- Clerk Dashboard → Users → Your Email → Metadata tab
- Should see `{"role": "admin"}` under **Public** (not Private)

**Check 3**: Did you log out and back in?
- Click profile picture → Sign out
- Sign back in
- Refresh page (Ctrl+R)

**Check 4**: Clear browser cache
- Press Ctrl+Shift+Delete
- Clear cached data
- Try in incognito/private window

**Still not working?**
- Open browser console (F12)
- Look for error messages
- Check if `user.publicMetadata.role` shows "admin"

### "Badge shows 'User' instead of 'Admin'"

This means the role isn't in your session yet:

1. **Double-check spelling** in Clerk:
   - Must be exactly: `"role": "admin"` (lowercase)
   - Not: `"Role": "admin"` or `"role": "Admin"`

2. **Check metadata location**:
   - Must be in **Public** metadata (not Private or Unsafe)

3. **Force new session**:
   - Log out in your app
   - Go to Clerk Dashboard
   - Users → Your Email → Sessions → "Revoke all"
   - Log back into your app

### "Admin Panel button doesn't appear"

If you see "Admin" badge but no button:

1. **Check browser console** (F12) for errors
2. **Refresh the page** (Ctrl+R)
3. **Clear cache** and try again
4. **Verify component** `components/UserNav.tsx` exists

### "Can't access /admin page"

Even if you're admin, the page might not load:

1. **Check URL**: Should be `http://localhost:3000/admin`
2. **Check terminal**: Look for errors in your terminal/console
3. **Restart dev server**: Stop (Ctrl+C) and run `npm run dev` again
4. **Check Firebase rules**: Make sure Firestore allows reading

---

## 📊 Quick Reference

### Clerk Dashboard Locations

| Task | Path |
|------|------|
| Configure session token | Sessions → Customize session token |
| Add admin role | Users → Select User → Metadata → Public |
| View all users | Users |
| Revoke sessions | Users → Select User → Sessions |

### App Locations

| Feature | URL |
|---------|-----|
| Admin dashboard | `/admin` |
| User management | `/admin/users` |
| Your profile | Click profile picture |

### Key Terms

| Term | Meaning |
|------|---------|
| **Metadata** | Extra info stored with user account |
| **Public Metadata** | Metadata visible to your app |
| **Session Token** | Proof that you're logged in |
| **Claims** | Information inside session token |
| **Role** | Your permission level (admin/moderator/user) |

---

## ✅ Success Checklist

After setup, you should:

- [ ] See red "Admin" badge in header
- [ ] See "Admin Panel" button in header
- [ ] Click button goes to `/admin`
- [ ] Admin dashboard shows all submissions
- [ ] Can select winners from dropdown
- [ ] "Manage User Roles" button works
- [ ] Can search for users
- [ ] Can promote users to admin/moderator

If ALL checked: **You're successfully set up as admin!** 🎉

---

## 📚 What's Next?

Now that you're an admin:

1. **Explore the admin panel** - See what it can do
2. **Test selecting winners** - Try picking 1st, 2nd, 3rd place
3. **Add more admins** - Use the user management page
4. **Read features guide** - [FEATURES_SIMPLE.md](FEATURES_SIMPLE.md)

---

## 💡 Pro Tips

1. **Make backup admins** - Don't be the only admin!
2. **Use moderators** - For people who should see but not edit
3. **Be careful with delete** - It's permanent!
4. **Test in incognito** - See what non-admins see
5. **Keep Clerk Dashboard open** - Handy for checking users

---

**Ready to manage your competition! 🏆**

