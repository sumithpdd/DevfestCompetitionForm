# User Role Display & Navigation Guide

This guide explains how users see their role badges and navigate to admin areas.

---

## 🎨 Visual Display

### Role Badges (Header)

Every logged-in user sees their role badge in the header:

#### Admin Role 🛡️
```
┌─────────────────────────────────────────────────┐
│  [Logo]              [🛡️ Admin] [Admin Panel ▶]  │
└─────────────────────────────────────────────────┘
```
- **Badge**: Red background, white text, shield icon
- **Button**: "Admin Panel" button (links to `/admin`)
- **Access**: Full control over submissions and users

#### Moderator Role 👮
```
┌─────────────────────────────────────────────────┐
│  [Logo]        [⚙️ Moderator] [View Panel ▶]     │
└─────────────────────────────────────────────────┘
```
- **Badge**: Blue background, white text, gear icon
- **Button**: "View Panel" button (links to `/admin`)
- **Access**: Read-only view of submissions

#### User Role 👤
```
┌─────────────────────────────────────────────────┐
│  [Logo]                          [👤 User]       │
└─────────────────────────────────────────────────┘
```
- **Badge**: Gray background, user icon
- **No Button**: Standard users don't see admin navigation
- **Access**: Can submit projects and view gallery

---

## 📍 Where It Appears

The role badge and navigation appear on **all pages**:

- ✅ Home page (`/`)
- ✅ Submit page (`/submit`)
- ✅ Gallery page (`/gallery`)
- ✅ Admin pages (`/admin`, `/admin/users`)

---

## 🔧 Technical Implementation

### Component: `UserNav`

**Location**: `components/UserNav.tsx`

**How it works**:
1. Uses Clerk's `useUser()` hook
2. Reads `user.publicMetadata.role`
3. Displays appropriate badge and button
4. Renders client-side (marked with `"use client"`)

**Code snippet**:
```typescript
const role = (user.publicMetadata as any)?.role || 'user';

switch (role) {
  case 'admin':
    return <Badge>Admin</Badge> + <Button>Admin Panel</Button>
  case 'moderator':
    return <Badge>Moderator</Badge> + <Button>View Panel</Button>
  default:
    return <Badge>User</Badge>
}
```

---

## 🚀 Setup Checklist

To see your admin badge:

### 1. ✅ Configure Session Token (One-Time)

In Clerk Dashboard → Sessions → Customize session token:
```json
{
  "metadata": "{{user.public_metadata}}"
}
```

### 2. ✅ Set Your Role

In Clerk Dashboard → Users → Select User → Metadata:
```json
{
  "role": "admin"
}
```

### 3. ✅ Refresh Your Session

**Important**: You MUST log out and log back in after setting the role.

**Why?** The session token is generated at login. Metadata changes don't apply to existing sessions.

**How to refresh**:
1. Click your profile picture
2. Click "Sign out"
3. Sign back in
4. Role badge should now appear!

---

## 🐛 Troubleshooting

### "I don't see my Admin badge"

**Check #1: Session Token Configuration**
- Go to Clerk Dashboard → Sessions
- Verify the `metadata` field is in session token claims
- Should see: `"metadata": "{{user.public_metadata}}"`

**Check #2: User Metadata**
- Go to Clerk Dashboard → Users → Your User
- Click Metadata tab
- Verify: `{"role": "admin"}` in **Public** metadata (not Private or Unsafe)

**Check #3: Logged Out and Back In?**
- Session token is created at login
- You must log out and back in after role changes
- Clear browser cache if needed (Ctrl+Shift+Delete)

**Check #4: Browser Console**
- Press F12
- Go to Console tab
- Look for any error messages
- Check if `user.publicMetadata.role` shows your role

### "Badge shows 'User' instead of 'Admin'"

This means the metadata isn't in your session token yet:

1. **Verify metadata spelling**: Must be exactly `"role": "admin"` (lowercase)
2. **Check metadata location**: Must be in **Public** metadata
3. **Refresh session**: Log out completely and log back in
4. **Clear cache**: Try in incognito/private window

### "Admin Panel button doesn't appear"

If you see the "Admin" badge but no button:

1. Check browser console for JavaScript errors
2. Verify `components/UserNav.tsx` has the button code
3. Try refreshing the page (Ctrl+R)

---

## 📱 Responsive Design

The badge and button are responsive:

- **Desktop**: Badge + Button side-by-side
- **Mobile**: Stacks vertically if needed
- **Always visible**: Part of header on all pages

---

## 🎯 User Experience Flow

### New User Flow
```
1. Sign up → Shows "User" badge
2. Admin promotes them → Still shows "User" badge
3. User logs out and back in → Shows "Admin" badge ✓
4. Can now click "Admin Panel" button
```

### Admin Promoting Users Flow
```
1. Admin goes to /admin
2. Clicks "Manage User Roles"
3. Searches for user
4. Clicks "Make Admin" or "Make Moderator"
5. User must log out/in to see new badge
```

---

## 🔐 Security Note

The badge is for **display purposes only**. Actual access control happens on the server:

- Client shows badge based on `publicMetadata`
- Server validates role on every protected route
- Users can't fake their role badge (it's from Clerk)
- Even if someone hacks the UI, server blocks unauthorized access

---

## 📚 Related Documentation

- [ADMIN_SETUP.md](ADMIN_SETUP.md) - Setting up admin users
- [CLERK_RBAC_IMPLEMENTATION.md](CLERK_RBAC_IMPLEMENTATION.md) - Technical details
- [Clerk Metadata Docs](https://clerk.com/docs/users/metadata)

---

## ✅ Success Indicators

You know it's working when:

- ✅ You see your role badge in the header
- ✅ Badge color matches your role (Red=Admin, Blue=Moderator, Gray=User)
- ✅ Admin Panel button appears (if admin)
- ✅ Clicking button takes you to `/admin`
- ✅ Badge appears on all pages

---

**Questions?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or the browser console (F12).

