# Admin Setup Guide

Complete guide to setting up admin users with Clerk roles following the official [Clerk RBAC documentation](https://clerk.com/docs/guides/secure/basic-rbac).

---

## 🔐 How It Works

The app uses **Clerk's Public Metadata** to assign roles to users with three role levels:

### Role Hierarchy

1. **Admin** 🛡️
   - View all submissions (including drafts)
   - Select competition winners (1st, 2nd, 3rd place)
   - Delete submissions and photos
   - Manage user roles (promote/demote users)
   - Access user management panel

2. **Moderator** 👮
   - View all submissions
   - Cannot modify or delete submissions
   - Cannot manage user roles

3. **User** 👤 (Default)
   - Submit their own projects
   - View public gallery
   - Save drafts

---

## 📝 Initial Setup (One-Time Configuration)

### Step 1: Configure Session Token

This step is required **once** for your Clerk application:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Sessions** in the left sidebar
4. Scroll to **Customize session token**
5. In the **Claims** editor, add:

```json
{
  "metadata": "{{user.public_metadata}}"
}
```

6. Click **Save**

This makes user metadata available in the session token without additional network requests.

---

## 👥 Assigning Roles to Users

### Making a User an Admin

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Click **Users** in the left sidebar
4. Find and click on the user
5. Click the **Metadata** tab
6. Under **Public metadata**, click **Edit**
7. Add the following JSON:

```json
{
  "role": "admin"
}
```

8. Click **Save**
9. User must **log out and log back in** for changes to take effect

### Making a User a Moderator

Follow the same steps but use:

```json
{
  "role": "moderator"
}
```

### Using the Admin Panel (Easier!)

Once you have at least one admin:

1. Log in as admin
2. Go to `/admin`
3. Click **"Manage User Roles"** button
4. Search for users by name or email
5. Click **"Make Admin"** or **"Make Moderator"** buttons
6. Changes apply immediately!

---

## 🎯 Features by Role

### Admin Features (`/admin`)

**Submissions Management:**
- View all submissions (drafts + submitted)
- Select competition winners (1st, 2nd, 3rd place)
- Delete submissions with confirmation
- Delete screenshots from Firebase Storage
- View all photos in full-screen viewer
- Dashboard statistics

**User Management (`/admin/users`):**
- Search users by name or email
- Promote users to Admin or Moderator
- Demote users to standard User role
- Remove roles from users
- See current role badges

### Moderator Features

- View all submissions (read-only)
- Cannot modify or delete
- Cannot access user management

### User Features

- Submit projects with multiple screenshots
- Save drafts and complete later
- View public gallery
- Edit own submissions

---

## 👥 Multiple Admins

You can have multiple admins! Repeat the steps above for each user you want to give admin access.

**Best Practices:**
- Only assign admin role to trusted team members
- Keep a list of admin users for security purposes
- Remove admin role when no longer needed

---

## 🔒 Security & Implementation

### Role-Based Access Control

Following the [official Clerk RBAC guide](https://clerk.com/docs/guides/secure/basic-rbac), roles are checked at multiple levels:

1. **TypeScript Types** (`types/globals.d.ts`):
   ```typescript
   export type Roles = 'admin' | 'moderator' | 'user'
   
   declare global {
     interface CustomJwtSessionClaims {
       metadata: {
         role?: Roles
       }
     }
   }
   ```

2. **Server-side Helper** (`utils/roles.ts`):
   ```typescript
   import { auth } from '@clerk/nextjs/server'
   
   export const checkRole = async (role: Roles) => {
     const { sessionClaims } = await auth()
     return sessionClaims?.metadata.role === role
   }
   ```

3. **Page Protection** (`app/admin/users/page.tsx`):
   ```typescript
   if (!(await checkRole('admin'))) {
     redirect('/')
   }
   ```

4. **Client-side Check** (`app/admin/page.tsx`):
   ```typescript
   const role = (user.publicMetadata as any)?.role;
   setIsAdmin(role === "admin");
   ```

5. **Server Actions** (`app/admin/_actions.ts`):
   ```typescript
   export async function setRole(formData: FormData) {
     if (!(await checkRole('admin'))) {
       return { message: 'Not Authorized' }
     }
     // ... update user role
   }
   ```

### Multi-Layer Protection

- **Session token contains role** - No extra database queries
- **Server-side validation** - Prevents unauthorized API calls
- **Client-side checks** - Better UX with immediate feedback
- **Form actions protected** - All mutations require admin role

---

## 🧪 Testing Admin Features

### Test Checklist

- [ ] Admin can access `/admin`
- [ ] Admin can see all submissions (drafts + submitted)
- [ ] Admin can assign winners
- [ ] Admin can remove winner assignments
- [ ] Admin can delete submissions
- [ ] Admin can view all photos
- [ ] Non-admin cannot access `/admin`
- [ ] Non-admin gets "Access Denied" message

---

## 🚨 Troubleshooting

### "Access Denied" for Admin User

**Problem**: User has admin role but still gets denied

**Solutions**:
1. **Log out and log back in** - Clerk needs to refresh the session
2. **Clear browser cache** - Old session data might be cached
3. **Check metadata spelling** - Must be exactly: `{"role": "admin"}`
4. **Verify in Clerk Dashboard** - Ensure the role was saved

### Admin Panel Not Loading

**Problem**: Page shows loading spinner forever

**Solutions**:
1. **Check Clerk configuration** - Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
2. **Check Firebase rules** - Admin needs read access to Firestore
3. **Check browser console** - Look for error messages

### Cannot Delete Submissions

**Problem**: Delete button doesn't work

**Solutions**:
1. **Check Firebase Storage rules** - Admin needs delete permission
2. **Check Firestore rules** - Admin needs write permission
3. **Check browser console** - Look for permission errors

---

## 📚 Related Documentation

- [Clerk Documentation](https://clerk.com/docs/users/metadata)
- [Firebase Security Rules](../firebase-rules.txt)
- [Features Guide](FEATURES.md)

---

## 🔄 Removing Admin Access

To remove admin role from a user:

1. Go to Clerk Dashboard → Users
2. Select the user
3. Go to **Metadata** tab
4. Edit **Public metadata**
5. Remove the `"role": "admin"` line or change to `"role": "user"`
6. Save changes
7. User must log out and log back in

---

## 💡 Best Practices

1. **Assign admin carefully** - Only to trusted team members
2. **Document admins** - Keep a list of who has access
3. **Regular audits** - Review admin list periodically
4. **Test after changes** - Verify access works as expected
5. **Remove when done** - Remove admin role after event

---

**Need help?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or open an issue.

