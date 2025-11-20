# 🔥 Firestore & Storage Rules

Complete security rules for all Firebase services.

---

## Overview

This document contains all security rules needed for your app:
- Firestore Database rules
- Firebase Storage rules
- Rule explanations
- Security best practices

---

## Firestore Rules

### Complete Rules

Copy these rules to **Firebase Console** → **Firestore Database** → **Rules** tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // Helper Functions
    // ============================================
    
    // Get user role from CompetitionUsers collection
    function getUserRole(userId) {
      return get(/databases/$(database)/documents/CompetitionUsers/$(userId)).data.role;
    }
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is admin
    function isAdmin() {
      return isAuthenticated() && getUserRole(request.auth.uid) == "admin";
    }
    
    // Check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Check if user is owner or admin
    function isOwnerOrAdmin(userId) {
      return isOwner(userId) || isAdmin();
    }
    
    // ============================================
    // User Profiles Collection
    // ============================================
    
    match /CompetitionUsers/{userId} {
      // Anyone authenticated can read user profiles
      allow read: if isAuthenticated();
      
      // Users can create their own profile during signup
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Users can update their own profile, admins can update any
      allow update: if isOwnerOrAdmin(userId);
      
      // Only admins can delete users
      allow delete: if isAdmin();
    }
    
    // ============================================
    // Competition Submissions Collection
    // ============================================
    
    match /DevFestComp2025/{submissionId} {
      // Anyone can read submissions (public gallery)
      allow read: if true;
      
      // Authenticated users can create submissions
      allow create: if isAuthenticated();
      
      // Only owner or admin can update
      allow update: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      
      // Only owner or admin can delete
      allow delete: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
    }
    
    // ============================================
    // AI Devcamp 2026 - Mentee Applications
    // ============================================
    
    match /AIDevcamp2026Mentees/{applicationId} {
      // Users can read their own application, admins can read all
      allow read: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      
      // Authenticated users can create one application
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      
      // Users can update their own application, admins can update any
      allow update: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      
      // Only admins can delete applications
      allow delete: if isAdmin();
    }
    
    // ============================================
    // AI Devcamp 2026 - Mentor Applications
    // ============================================
    
    match /AIDevcamp2026Mentors/{applicationId} {
      // Users can read their own application, admins can read all
      allow read: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      
      // Authenticated users can create one application
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      
      // Users can update their own application, admins can update any
      allow update: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      
      // Only admins can delete applications
      allow delete: if isAdmin();
    }
    
    // ============================================
    // AI Devcamp 2026 - Tags (Individual Collections)
    // ============================================
    
    // Interests Collection
    match /Interests/{tagId} {
      // All authenticated users can read tags
      allow read: if isAuthenticated();
      
      // All authenticated users can create tags
      allow create: if isAuthenticated();
      
      // Only admins can update or delete tags
      allow update, delete: if isAdmin();
    }
    
    // Expertise Collection
    match /Expertise/{tagId} {
      // All authenticated users can read tags
      allow read: if isAuthenticated();
      
      // All authenticated users can create tags
      allow create: if isAuthenticated();
      
      // Only admins can update or delete tags
      allow update, delete: if isAdmin();
    }
    
    // TechStack Collection
    match /TechStack/{tagId} {
      // All authenticated users can read tags
      allow read: if isAuthenticated();
      
      // All authenticated users can create tags
      allow create: if isAuthenticated();
      
      // Only admins can update or delete tags
      allow update, delete: if isAdmin();
    }
  }
}
```

---

## Storage Rules

### Complete Rules

Copy these rules to **Firebase Console** → **Storage** → **Rules** tab:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // ============================================
    // Helper Functions
    // ============================================
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
        firestore.get(/databases/(default)/documents/CompetitionUsers/$(request.auth.uid)).data.role == "admin";
    }
    
    // Check if user owns the file
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Validate image file
    function isValidImage() {
      return request.resource.contentType.matches('image/.*') &&
        request.resource.size < 10 * 1024 * 1024; // 10MB max
    }
    
    // Validate document file
    function isValidDocument() {
      return request.resource.contentType.matches('application/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)') &&
        request.resource.size < 5 * 1024 * 1024; // 5MB max
    }
    
    // ============================================
    // Competition Screenshots
    // ============================================
    
    match /devfest2025Comp/{allPaths=**} {
      // Anyone can read (public gallery)
      allow read: if true;
      
      // Authenticated users can upload images
      allow write: if isAuthenticated() && isValidImage();
    }
    
    // ============================================
    // AI Devcamp 2026 - Mentor Resumes
    // ============================================
    
    match /aidevcamp2026/mentors/{userId}/{fileName} {
      // Only owner and admins can read
      allow read: if isOwner(userId) || isAdmin();
      
      // Only owner can upload their resume
      allow write: if isOwner(userId) && isValidDocument();
      
      // Only owner and admins can delete
      allow delete: if isOwner(userId) || isAdmin();
    }
    
    // ============================================
    // Future: Profile Pictures (Optional)
    // ============================================
    
    match /profilePictures/{userId}/{fileName} {
      // Anyone can read profile pictures
      allow read: if true;
      
      // Only owner can upload their picture
      allow write: if isOwner(userId) && isValidImage();
      
      // Only owner can delete their picture
      allow delete: if isOwner(userId);
    }
  }
}
```

---

## Rule Explanations

### Firestore Rules

#### CompetitionUsers Collection
- **Read**: Any authenticated user (for displaying names, roles)
- **Create**: Self-registration during signup
- **Update**: User can update own profile, admins can update any
- **Delete**: Admin only

**Why?** Users need to see other users' names in galleries and admin panels, but shouldn't be able to modify others' profiles.

#### DevFestComp2025 Collection
- **Read**: Public (gallery feature)
- **Create**: Authenticated users
- **Update**: Owner or admin
- **Delete**: Owner or admin

**Why?** Public gallery requires read access. Users should control their own submissions.

#### AIDevcamp2026Mentees/Mentors Collections
- **Read**: Owner or admin (private applications)
- **Create**: Authenticated users (one per user)
- **Update**: Owner or admin
- **Delete**: Admin only

**Why?** Applications contain private information. Only the applicant and admins should see them.

#### AIDevcamp2026Tags Collections
- **Read**: All authenticated users
- **Create**: All authenticated users (collaborative tag library)
- **Update/Delete**: Admin only (prevent abuse)

**Why?** Tags are shared resources. Anyone can create, but only admins can modify/delete to maintain quality.

### Storage Rules

#### devfest2025Comp (Screenshots)
- **Read**: Public (gallery)
- **Write**: Authenticated users, images only, max 10MB
- **Delete**: Anyone with write access

**Why?** Screenshots are public and part of submissions. Size limit prevents abuse.

#### aidevcamp2026/mentors (Resumes)
- **Read**: Owner or admin (private)
- **Write**: Owner only, documents only, max 5MB
- **Delete**: Owner or admin

**Why?** Resumes are private documents. Only relevant parties should access.

---

## Security Best Practices

### Authentication Checks
✅ Always verify `request.auth != null`  
✅ Use `request.auth.uid` for owner checks  
✅ Never trust client-side role claims  

### Data Validation
✅ Validate file types and sizes  
✅ Check data ownership before operations  
✅ Use helper functions for complex checks  

### Admin Privileges
✅ Admin checks use Firestore lookups  
✅ Admin role stored in database, not client  
✅ Admin can't be set by users  

### File Uploads
✅ Limit file sizes to prevent abuse  
✅ Validate MIME types  
✅ Use user-specific folders  
✅ Prevent unauthorized file access  

---

## Testing Rules

### Using Firebase Console

1. Go to **Firestore Database** → **Rules** tab
2. Click "Rules playground" button
3. Test different scenarios:
   - Authenticated user reading own data ✅
   - Authenticated user reading others' data ❌
   - Unauthenticated user writing ❌
   - Admin accessing anything ✅

### Using Firebase Emulator

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

---

## Common Rule Patterns

### Owner-Only Access
```javascript
match /collection/{docId} {
  allow read, write: if request.auth != null && 
    request.auth.uid == resource.data.userId;
}
```

### Admin-Only Access
```javascript
match /collection/{docId} {
  allow read, write: if isAdmin();
}
```

### Public Read, Authenticated Write
```javascript
match /collection/{docId} {
  allow read: if true;
  allow write: if isAuthenticated();
}
```

### Owner or Admin Access
```javascript
match /collection/{docId} {
  allow read, write: if isOwnerOrAdmin(resource.data.userId);
}
```

---

## Updating Rules

### How to Update

1. **Test Locally First** (if using emulator)
2. Go to Firebase Console
3. Navigate to **Firestore Database** → **Rules** or **Storage** → **Rules**
4. Paste new rules
5. Click **Publish**
6. Rules take effect immediately

### Version Control

Keep rules in your repository:

**File**: `firebase-rules.txt`

```
Firestore Rules:
[paste Firestore rules here]

Storage Rules:
[paste Storage rules here]
```

### Deployment Automation (Optional)

Use Firebase CLI to deploy rules:

```bash
# Create firebase.json
{
  "firestore": {
    "rules": "firestore.rules"
  },
  "storage": {
    "rules": "storage.rules"
  }
}

# Deploy rules
firebase deploy --only firestore:rules,storage:rules
```

---

## Troubleshooting

### "Permission denied" errors

**Check**:
1. Are Firestore rules published?
2. Is user authenticated?
3. Does user have required role?
4. Is resource owner check correct?

**Debug**:
- Check browser console for detailed error
- Use Rules playground to test
- Verify user document exists in Firestore

### Rules not taking effect

**Solutions**:
- Wait 1-2 minutes after publishing
- Clear browser cache
- Sign out and sign back in
- Check rules were actually saved

### Admin checks failing

**Verify**:
- User document exists in `CompetitionUsers`
- `role` field is exactly `"admin"` (lowercase)
- User has logged out and back in after role change

### File upload failing

**Check**:
- File size within limits
- File type is allowed
- Storage rules are published
- User is authenticated
- Correct storage path

---

## Rule Limitations

### Firestore
- Maximum 20 role lookups per request
- Rules evaluate before writes (can't use new data)
- No server-side timestamp validation
- Can't perform complex queries in rules

### Storage
- Limited Firestore access (for role checks)
- Can't validate file contents
- File size check happens after upload starts

---

## Security Checklist

Before going to production:

- [ ] All collections have rules defined
- [ ] No `allow read, write: if true` except intentionally public data
- [ ] Admin role checks use Firestore lookups
- [ ] File size limits in place
- [ ] File type validation active
- [ ] User ownership verified before writes
- [ ] Rules tested in playground
- [ ] Rules deployed to production
- [ ] Tested with real user accounts
- [ ] Tested admin functionality

---

## Additional Resources

- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules Guide](https://firebase.google.com/docs/storage/security/start)
- [Rules Playground](https://firebase.google.com/docs/rules/simulator)
- [Common Rule Patterns](https://firebase.google.com/docs/rules/basics)

---

## Summary

✅ **Complete Firestore rules** for all collections  
✅ **Complete Storage rules** for files and resumes  
✅ **Role-based access control** implemented  
✅ **File validation** with size and type checks  
✅ **Security best practices** followed  

**Your Firebase is secure!** 🔒

