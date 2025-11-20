# 🎓 AI Devcamp 2026 - Mentorship Program

Complete guide to the AI Devcamp 2026 mentorship program features.

---

## Overview

The AI Devcamp 2026 is a mentorship program starting early 2026 that connects aspiring developers (mentees) with experienced professionals (mentors) in AI and software development.

### Key Features
- 🎓 **Mentee Registration** - Apply to join as a learning participant
- 👨‍🏫 **Mentor Registration** - Apply to guide aspiring developers
- 🏷️ **Smart Tags** - Select or create custom tags for interests, expertise, and tech stack
- 📄 **Resume Upload** - Secure document upload for mentors
- 🔄 **Application Tracking** - Status management system
- 🎯 **Duplicate Prevention** - One application per user per role

---

## Mentee Application

### Access
- **Route**: `/join-mentee`
- **Auth Required**: Yes (sign in first)
- **Limit**: One application per user

### Form Fields

#### Personal Information
- **Name** (auto-filled from profile)
- **Email** (auto-filled from profile)
- **Social Link** (optional)
  - LinkedIn, Twitter, personal website, etc.

#### Program Details
- **Why Join?** (required, textarea)
  - Motivation for joining
  - Learning goals
  - What you hope to achieve

- **Portfolio** (required, URL)
  - Link to GitHub, personal website, or project showcase
  - Must be a valid URL

- **Time Commitment** (required, number)
  - Hours per week you can dedicate
  - Minimum: 1 hour
  - Helps match with appropriate mentors

#### Skills & Interests (Tag-Based)

Three tag categories:

1. **Interests** 🎯
   - What you want to learn
   - Career goals
   - Areas of curiosity
   - Examples: "Machine Learning", "Web Development", "Mobile Apps"

2. **Current Expertise** 💡
   - What you already know
   - Existing skills
   - Background knowledge
   - Examples: "JavaScript", "Python Basics", "Git"

3. **Technology Stack** 🛠️
   - Tools and technologies you use/want to learn
   - Frameworks and libraries
   - Development tools
   - Examples: "React", "TensorFlow", "Docker"

**Tag Features**:
- Select multiple tags per category
- Create custom tags if needed
- Tags are shared across all applications
- No limit on tag selection

### Submission Process

1. Fill all required fields
2. Select/add tags for interests, expertise, and tech stack
3. Click "Submit Application"
4. Receive confirmation toast
5. Can view application status in admin panel (if admin)

### Data Storage

**Collection**: `AIDevcamp2026Mentees`

```typescript
{
  userId: string                    // Firebase Auth UID
  name: string                      // Full name
  email: string                     // Email address
  socialLink?: string               // Optional social media link
  whyJoin: string                   // Motivation statement
  portfolio: string                 // Portfolio URL
  hoursPerWeek: number             // Time commitment
  interests: string[]              // Interest tags
  expertise: string[]              // Expertise tags
  techStack: string[]              // Tech stack tags
  status: "pending"                // Application status
  createdAt: Timestamp             // Application date
  updatedAt: Timestamp             // Last update
}
```

---

## Mentor Application

### Access
- **Route**: `/join-mentor`
- **Auth Required**: Yes (sign in first)
- **Limit**: One application per user

### Form Fields

#### Personal Information
- **Name** (auto-filled from profile)
- **Email** (auto-filled from profile)
- **Social Link** (optional)
  - Professional profiles (LinkedIn, etc.)

#### Professional Information
- **Company Name** (required)
  - Current employer or freelance
  - Organization name

- **Role/Title** (required)
  - Job title
  - Professional position
  - Examples: "Senior Software Engineer", "AI Researcher"

#### Program Details
- **Why Join?** (required, textarea)
  - Motivation for mentoring
  - What you can offer
  - Mentorship philosophy

- **Portfolio** (required, URL)
  - Professional website
  - GitHub profile
  - LinkedIn profile

- **Time Commitment** (required, number)
  - Hours per week available
  - Minimum: 1 hour
  - Helps with mentee matching

#### Resume Upload 📄
- **File Types**: PDF or Word documents (.pdf, .doc, .docx)
- **Max Size**: 5MB
- **Storage Path**: `aidevcamp2026/mentors/{userId}/resume.{ext}`
- **Access**: Private (only user and admins can view)

#### Skills & Interests (Tag-Based)

Same three categories as mentees:

1. **Interests** 🎯
   - Areas you're passionate about
   - Topics you want to teach
   - Examples: "AI/ML", "System Design", "Career Guidance"

2. **Expertise** 💡
   - Professional skills
   - Years of experience
   - Specialized knowledge
   - Examples: "Cloud Architecture", "Team Leadership", "Python Expert"

3. **Technology Stack** 🛠️
   - Technologies you work with
   - Tools you can teach
   - Examples: "AWS", "Kubernetes", "React Native"

### Submission Process

1. Fill all required fields
2. Upload resume (PDF or Word)
3. Select/add tags
4. Click "Submit Application"
5. Resume is uploaded to Firebase Storage
6. Application is saved to Firestore
7. Receive confirmation

### Data Storage

**Collection**: `AIDevcamp2026Mentors`

```typescript
{
  userId: string                    // Firebase Auth UID
  name: string                      // Full name
  email: string                     // Email address
  socialLink?: string               // Optional social link
  company: string                   // Company name
  role: string                      // Job title/role
  whyJoin: string                   // Motivation statement
  portfolio: string                 // Portfolio URL
  hoursPerWeek: number             // Time commitment
  resumeUrl: string                // Firebase Storage URL
  interests: string[]              // Interest tags
  expertise: string[]              // Expertise tags
  techStack: string[]              // Tech stack tags
  status: "pending"                // Application status
  createdAt: Timestamp             // Application date
  updatedAt: Timestamp             // Last update
}
```

---

## Tag System

### Overview
The tag system allows users to select from existing tags or create custom ones, building a shared library over time.

### Tag Categories

1. **Interests** (`AIDevcamp2026Tags/interests/tags`)
2. **Expertise** (`AIDevcamp2026Tags/expertise/tags`)
3. **Tech Stack** (`AIDevcamp2026Tags/techStack/tags`)

### Tag Document Structure

```typescript
{
  name: string                      // Tag name (e.g., "Machine Learning")
  createdBy: string                 // User ID who created it
  createdAt: Timestamp              // Creation date
  usageCount: number                // Number of times used
}
```

### Tag Features

#### Selection
- View all available tags in a category
- Click to select/deselect
- Visual feedback (badge styling)
- Multiple selections allowed

#### Creation
- Click "Add New" button
- Enter custom tag name
- Tag is immediately available
- Shared with all users

#### Display
- Selected tags shown as colored badges
- Easy removal by clicking
- Clear visual distinction

### Component: TagSelector

**Location**: `components/TagSelector.tsx`

**Props**:
```typescript
interface TagSelectorProps {
  category: "interests" | "expertise" | "techStack"
  selectedTags: string[]
  onChange: (tags: string[]) => void
}
```

**Features**:
- Loads tags from Firestore on mount
- Real-time tag selection
- Custom tag creation dialog
- Optimistic UI updates
- Error handling

---

## Application Status

### Status Values

- **`pending`** - Initial status after submission
- **`approved`** - Accepted into program (future)
- **`rejected`** - Not accepted (future)
- **`matched`** - Paired with mentor/mentee (future)

Currently, all applications default to `pending`. Admin dashboard for status management coming in future updates.

---

## Security & Privacy

### Authentication
- Must be signed in to access forms
- User data auto-filled from Firebase Auth
- User ID validated against auth state

### Data Access Rules

#### Mentee Applications
- **Read**: Own application + admins
- **Create**: Any authenticated user (once)
- **Update**: Own application + admins
- **Delete**: Admins only

#### Mentor Applications
- **Read**: Own application + admins
- **Create**: Any authenticated user (once)
- **Update**: Own application + admins
- **Delete**: Admins only

#### Tags
- **Read**: All authenticated users
- **Write**: All authenticated users

#### Resumes
- **Read**: Application owner + admins
- **Write**: Application owner only
- **Max Size**: 5MB
- **Allowed Types**: PDF, Word documents

### Duplicate Prevention

```typescript
// Checks for existing application before allowing submission
const existingApplication = await getDocs(
  query(collection(db, "AIDevcamp2026Mentees"), 
  where("userId", "==", user.uid))
);

if (!existingApplication.empty) {
  // Show error: Already applied
}
```

---

## Admin Features (Future)

### Planned Admin Dashboard

**Route**: `/admin/devcamp` (to be implemented)

#### Mentee Management
- View all mentee applications
- Filter by status, skills, availability
- Update application status
- View full profiles
- Export data

#### Mentor Management
- View all mentor applications
- Filter by expertise, company, availability
- Download resumes
- Update application status
- View full profiles

#### Matching System
- Algorithm to match mentees with mentors
- Based on skills, interests, availability
- Manual override option
- Track match success

#### Tag Management
- View all tags and usage statistics
- Merge duplicate tags
- Delete inappropriate tags
- Feature popular tags

---

## Homepage Integration

### New Section

Added to `app/page.tsx`:

```tsx
<section className="ai-devcamp-section">
  <h2>AI Devcamp 2026</h2>
  <p>Join our mentorship program starting early 2026</p>
  
  <div className="cards-container">
    <Card className="mentee-card">
      <CardHeader>
        <CardTitle>Become a Mentee</CardTitle>
        <CardDescription>
          Learn from experienced developers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => router.push("/join-mentee")}>
          Apply as Mentee
        </Button>
      </CardContent>
    </Card>
    
    <Card className="mentor-card">
      <CardHeader>
        <CardTitle>Become a Mentor</CardTitle>
        <CardDescription>
          Guide aspiring developers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => router.push("/join-mentor")}>
          Apply as Mentor
        </Button>
      </CardContent>
    </Card>
  </div>
</section>
```

### Styling
- Mentee card: Green theme (#10b981) - growth, learning
- Mentor card: Purple theme (#9333ea) - wisdom, leadership
- Responsive design
- Hover effects

---

## Testing Guide

### Test Mentee Application

1. Sign in to your app
2. Go to homepage
3. Click "Apply as Mentee"
4. Fill all required fields
5. Select/add tags
6. Submit application
7. Verify in Firestore: `AIDevcamp2026Mentees` collection
8. Try to apply again (should show error)

### Test Mentor Application

1. Sign in to your app
2. Go to homepage
3. Click "Apply as Mentor"
4. Fill all required fields
5. Upload resume (test with PDF and Word)
6. Select/add tags
7. Submit application
8. Verify in Firestore: `AIDevcamp2026Mentors` collection
9. Verify resume in Storage: `aidevcamp2026/mentors/{userId}/`
10. Try to apply again (should show error)

### Test Tag System

1. In any application form
2. Click existing tags to select
3. Click "Add New" button
4. Create custom tag
5. Tag appears immediately
6. Submit form
7. Check Firestore: `AIDevcamp2026Tags/{category}/tags`
8. Open form again - custom tag should be available

---

## Future Enhancements

### Phase 2: Matching System
- Automated mentee-mentor matching
- Based on skills, interests, availability
- Match score calculation
- Notification system

### Phase 3: Communication
- In-app messaging
- Video call scheduling
- Resource sharing
- Progress tracking

### Phase 4: Analytics
- Program metrics
- Success tracking
- User engagement
- Feedback system

---

## Summary

✅ **Two application forms** (Mentee & Mentor)  
✅ **Smart tag system** with custom tag creation  
✅ **Resume upload** for mentors  
✅ **Duplicate prevention** per user  
✅ **Secure & private** data storage  
✅ **Production-ready** code  

**Start accepting applications today!** 🚀

