# Clerk RBAC Implementation Guide

This document explains how Role-Based Access Control (RBAC) is implemented in the DevFest Competition app, following the official [Clerk RBAC Guide](https://clerk.com/docs/guides/secure/basic-rbac).

---

## 📚 Overview

This app implements a complete RBAC system with three roles:
- **Admin**: Full control over submissions and user management
- **Moderator**: Read-only access to submissions
- **User**: Can submit own projects

---

## 🏗️ Implementation Steps

### Step 1: Configure Session Token ✅

**Location**: Clerk Dashboard → Sessions → Customize session token

**Configuration**:
```json
{
  "metadata": "{{user.public_metadata}}"
}
```

**Purpose**: Attaches user metadata to the session token, making roles available without additional network requests.

---

### Step 2: TypeScript Type Definitions ✅

**File**: `types/globals.d.ts`

```typescript
export {}

// Create a type for the roles
export type Roles = 'admin' | 'moderator' | 'user'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}
```

**Purpose**: 
- Provides TypeScript autocomplete for roles
- Extends Clerk's session claims interface
- Prevents typos and ensures type safety

---

### Step 3: Set Initial Admin Role ✅

**Location**: Clerk Dashboard → Users → Select User → Metadata

**Configuration**:
```json
{
  "role": "admin"
}
```

**Purpose**: Manually creates the first admin user who can then manage other users' roles.

---

### Step 4: Role Checking Helper ✅

**File**: `utils/roles.ts`

```typescript
import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role === role
}
```

**Purpose**: Reusable function to check if the current user has a specific role.

**Usage**:
```typescript
const isAdmin = await checkRole('admin')
const isModerator = await checkRole('moderator')
```

---

### Step 5: Server Actions for Role Management ✅

**File**: `app/admin/_actions.ts`

```typescript
'use server'

import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

export async function setRole(formData: FormData) {
  const client = await clerkClient()

  // Check that the user trying to set the role is an admin
  if (!(await checkRole('admin'))) {
    return { message: 'Not Authorized' }
  }

  try {
    const res = await client.users.updateUserMetadata(
      formData.get('id') as string,
      {
        publicMetadata: { role: formData.get('role') },
      }
    )
    return { message: res.publicMetadata }
  } catch (err) {
    return { message: err }
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient()

  if (!(await checkRole('admin'))) {
    return { message: 'Not Authorized' }
  }

  try {
    const res = await client.users.updateUserMetadata(
      formData.get('id') as string,
      {
        publicMetadata: { role: null },
      }
    )
    return { message: res.publicMetadata }
  } catch (err) {
    return { message: err }
  }
}
```

**Purpose**: Secure server actions that validate admin permissions before modifying user roles.

---

### Step 6: User Search Component ✅

**File**: `app/admin/SearchUsers.tsx`

```typescript
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export const SearchUsers = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="mb-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const queryTerm = formData.get('search') as string
          router.push(pathname + '?search=' + queryTerm)
        }}
        className="flex gap-2"
      >
        <Input
          id="search"
          name="search"
          type="text"
          placeholder="Search for users by name or email..."
          className="flex-1"
        />
        <Button type="submit">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>
    </div>
  )
}
```

**Purpose**: Client component that submits search queries via URL parameters.

---

### Step 7: User Management Page ✅

**File**: `app/admin/users/page.tsx`

Key features:
- **Server-side protection**: Uses `checkRole('admin')` to protect the route
- **User search**: Integrates with Clerk's `getUserList()` API
- **Role display**: Shows current role with badges
- **Role management**: Forms to promote/demote users
- **Server actions**: Uses `setRole()` and `removeRole()` actions

**Route Protection**:
```typescript
export default async function AdminUsersPage(props: {
  searchParams: Promise<{ search?: string }>
}) {
  if (!(await checkRole('admin'))) {
    redirect('/')
  }
  
  // ... rest of page
}
```

---

## 🎨 UI Components

### Admin Dashboard (`/admin`)
- Overview of submissions
- Winner selection
- Delete functionality
- Link to user management

### User Management (`/admin/users`)
- Search interface
- User list with current roles
- Action buttons for role changes
- Role definitions

---

## 🔐 Security Considerations

### Multi-Layer Protection

1. **Session Claims**: Role stored in JWT, validated on every request
2. **Server Actions**: All mutations check admin role
3. **Page Protection**: Routes redirect non-admins
4. **Client Checks**: UI hides admin features from non-admins

### Best Practices

✅ **Always validate on server**: Client checks are for UX only
✅ **Use TypeScript types**: Prevent role name typos
✅ **Centralize role checks**: Use `checkRole()` helper everywhere
✅ **Log security events**: Track role changes and access attempts

---

## 🧪 Testing Checklist

- [ ] Admin can access `/admin`
- [ ] Admin can access `/admin/users`
- [ ] Admin can search for users
- [ ] Admin can promote user to admin
- [ ] Admin can promote user to moderator
- [ ] Admin can remove roles
- [ ] Non-admin gets redirected from `/admin/users`
- [ ] Moderator has read-only access (if implemented)
- [ ] User sees "Access Denied" on admin pages
- [ ] Role changes require logout/login to take effect

---

## 📖 References

- [Clerk RBAC Guide](https://clerk.com/docs/guides/secure/basic-rbac)
- [Clerk Metadata Documentation](https://clerk.com/docs/users/metadata)
- [Clerk Backend SDK](https://clerk.com/docs/reference/backend/overview)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

## 🚀 Extending the System

### Adding New Roles

1. Update `types/globals.d.ts`:
   ```typescript
   export type Roles = 'admin' | 'moderator' | 'user' | 'viewer'
   ```

2. Add role check logic where needed:
   ```typescript
   const isViewer = await checkRole('viewer')
   ```

3. Update UI to show role in badges and buttons

### Role Hierarchies

To implement role hierarchies (e.g., admin has all moderator permissions):

```typescript
export const hasPermission = async (requiredRole: Roles) => {
  const { sessionClaims } = await auth()
  const userRole = sessionClaims?.metadata.role
  
  const hierarchy: Record<Roles, number> = {
    admin: 3,
    moderator: 2,
    user: 1,
  }
  
  return (hierarchy[userRole] || 0) >= hierarchy[requiredRole]
}
```

---

**Implementation Complete! 🎉**

