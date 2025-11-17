# Contributing Guide

Thank you for considering contributing to the Devfest 2025 Competition Form project! This guide will help you get started.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Ensure you have:
- Node.js 18+ installed
- Git installed
- A code editor (VS Code recommended)
- A GitHub account

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/DevfestCompetitionForm.git
   cd DevfestCompetitionForm
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/DevfestCompetitionForm.git
   ```

### Install Dependencies

```bash
npm install
```

### Set Up Environment

```bash
cp .env.example .env.local
# Add your environment variables
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed configuration.

### Run Development Server

```bash
npm run dev
```

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming Conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clear, concise code
- Follow the coding standards (see below)
- Test your changes locally
- Keep commits atomic and focused

### 3. Test Your Changes

```bash
# Build the project
npm run build

# Run the production build
npm run start

# Check for linting errors
npm run lint
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

See [Commit Guidelines](#commit-guidelines) below.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Fill out the PR template
4. Wait for review

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` type when possible
- Use type inference where appropriate

**Example:**
```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): User => {
  // ...
}

// Avoid
const getUser = (id: any): any => {
  // ...
}
```

### React Components

- Use functional components with hooks
- Keep components focused and small
- Use proper prop typing
- Extract reusable logic into custom hooks

**Example:**
```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function Button({ onClick, children, variant = "primary" }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {children}
    </button>
  );
}
```

### File Structure

- One component per file
- Co-locate related files
- Use index.ts for exports
- Keep file names consistent

**Naming Conventions:**
- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Hooks: camelCase with 'use' prefix (`useAuth.ts`)
- Types: PascalCase (`User.ts`)

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use shadcn/ui components when possible
- Keep custom CSS minimal

**Example:**
```tsx
// Good
<div className="flex flex-col md:flex-row gap-4 p-6">
  <Card className="bg-slate-900/50 border-slate-800">
    {/* Content */}
  </Card>
</div>

// Avoid inline styles
<div style={{ display: "flex", padding: "24px" }}>
  {/* Content */}
</div>
```

### State Management

- Use React hooks for local state
- Lift state up when needed
- Use context for global state (if needed)
- Keep state minimal

### Error Handling

- Always use try-catch for async operations
- Provide user-friendly error messages
- Log errors for debugging
- Show toast notifications for errors

**Example:**
```typescript
try {
  await submitForm(data);
  toast({
    title: "Success",
    description: "Form submitted successfully",
  });
} catch (error) {
  console.error("Form submission error:", error);
  toast({
    title: "Error",
    description: "Failed to submit form. Please try again.",
    variant: "destructive",
  });
}
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no code change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(submit): add file upload progress indicator"

# Bug fix
git commit -m "fix(gallery): resolve image loading issue on mobile"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(admin): simplify winner selection logic"
```

### Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep subject line under 72 characters
- Add body for complex changes
- Reference issues when applicable

## Pull Request Process

### Before Submitting

1. ✅ Test your changes locally
2. ✅ Run linting and fix errors
3. ✅ Update documentation if needed
4. ✅ Add tests if applicable
5. ✅ Ensure no console errors
6. ✅ Check responsive design
7. ✅ Build succeeds

### PR Title

Follow the same format as commit messages:
```
feat(scope): brief description
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
[Add screenshots here]

## Testing
How has this been tested?
- [ ] Local development
- [ ] Production build
- [ ] Mobile devices
- [ ] Different browsers

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested on multiple browsers/devices
```

### Review Process

1. Maintainer reviews your PR
2. Address any requested changes
3. Update your branch if needed:
   ```bash
   git checkout main
   git pull upstream main
   git checkout feature/your-feature
   git rebase main
   git push -f origin feature/your-feature
   ```
4. Once approved, your PR will be merged

## Testing

### Manual Testing

Test all affected functionality:

1. **Authentication Flow**
   - Sign up
   - Sign in
   - Sign out
   - Protected routes

2. **Form Submission**
   - Form validation
   - File upload
   - Success/error states
   - Data persistence

3. **Gallery**
   - Display submissions
   - Responsive layout
   - Loading states
   - Empty states

4. **Admin Panel**
   - Winner selection
   - Data updates
   - Access control

### Cross-browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Testing

Test on:
- iOS Safari
- Android Chrome
- Various screen sizes

### Automated Testing (Future)

We plan to add:
- Unit tests (Jest)
- Integration tests (React Testing Library)
- E2E tests (Playwright)

## Documentation

### When to Update Docs

Update documentation when:
- Adding new features
- Changing existing behavior
- Modifying API
- Updating dependencies
- Fixing bugs that affect usage

### Documentation Files

- `README.md` - Project overview
- `docs/SETUP_GUIDE.md` - Setup instructions
- `docs/DEPLOYMENT_GUIDE.md` - Deployment steps
- `docs/API_REFERENCE.md` - API documentation
- `docs/FEATURES.md` - Feature descriptions
- `docs/CONTRIBUTING.md` - This file

### Code Comments

Add comments for:
- Complex logic
- Non-obvious solutions
- Workarounds
- Important decisions

**Example:**
```typescript
// Firebase requires timestamp conversion from Firestore Timestamp to Date
const createdAt = doc.data().createdAt?.toDate();
```

## Getting Help

### Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

### Contact

- Open an issue for bugs
- Discussions for questions
- Email: support@example.com

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in relevant documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉

