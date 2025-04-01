
# Authentication Pages Standard

**IMPORTANT: DO NOT MODIFY THESE PAGES WITHOUT APPROVAL**

This document serves as a reference for the standard layout, design, UX, fields, and logic of the authentication pages. These pages have been finalized and approved, and should not be modified unless absolutely necessary.

## Protected Pages

The following pages are protected by this standard:

1. **Index Page** (`src/pages/Index.tsx`)
2. **Register Page** (`src/pages/Register.tsx`)
3. **Login Page** (`src/pages/Login.tsx`)
4. **Email Verified Page** (`src/pages/EmailVerified.tsx`)
5. **Forgot Password Page** (`src/pages/ForgotPassword.tsx`)

## Components Used in These Pages

- **AuthLayout** (`src/components/AuthLayout.tsx`)
- **LoginForm** (`src/components/login/LoginForm.tsx`)
- **RegisterForm** (`src/components/register/RegisterForm.tsx`)
- **LeftContentSection** (`src/components/shared/LeftContentSection.tsx`)
- **PWAButton** (`src/components/PWAButton.tsx`)

## Design Standards

### Layout
- Two-column layout on desktop (content on left, image/form on right)
- Single-column layout on mobile with full-width form
- Image background on desktop, solid background on mobile

### Colors
- Main blue: `#003570` (subpi-blue)
- Main orange: `#f57c35` (subpi-orange)
- Dark background for mobile: `slate-900`
- Form background: white with rounded corners and shadow

### UX Standards
- Clear form labels
- Form validation with helpful error messages
- Password requirements display
- Email suffix completion
- Google Sign-in option
- PWA installation button

## Authentication Flow Logic
1. Users can register with email/password
2. Users can sign in with email/password or Google
3. Users can request password reset
4. Email verification is handled
5. Protected routes redirect to login

## Note

These standards were established on [DATE] and should be preserved for consistency across the application.

**Any proposed changes to these pages must be reviewed and approved before implementation.**
