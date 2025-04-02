
# Header Component Documentation

This document provides details on the header component implementation used throughout the application.

## Overview

The header component (`src/components/layouts/header/Header.tsx`) is displayed at the top of all authenticated pages and provides navigation controls, user profile access, and notifications.

## Component Structure

The header implementation is organized across several files:

1. **Main Header Component**:
   - `src/components/layouts/header/Header.tsx` - Main implementation
   - `src/components/layouts/Header.tsx` - Export wrapper

2. **Sub-Components**:
   - `src/components/layouts/header/ProfileMenu.tsx` - User profile dropdown
   - `src/components/layouts/header/NotificationsPopover.tsx` - Notifications system

3. **Related Hooks**:
   - `src/components/layouts/header/useUserProfile.ts` - User profile data
   - `src/components/layouts/header/useNotifications.ts` - Notification management

## Features and Functionality

### 1. Sidebar Control

The header includes a toggle button that controls the sidebar visibility:

```tsx
<button
  onClick={toggleSidebar}
  className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500"
>
  <MenuIcon />
</button>
```

This is connected to the parent component via the `toggleSidebar` prop.

### 2. Logo Placement

The logo is centrally positioned in the header with a three-column layout:
- Left section (1/3): Contains the sidebar toggle button
- Middle section (1/3): Contains the centered logo
- Right section (1/3): Contains user controls (notifications, profile)

```tsx
<div className="flex justify-between items-center px-4 py-2 max-w-screen-2xl mx-auto">
  <div className="flex items-center w-1/3">
    {/* Sidebar toggle */}
  </div>
  <div className="flex items-center justify-center w-1/3">
    {/* Centered logo */}
  </div>
  <div className="flex items-center justify-end space-x-3 w-1/3">
    {/* User controls */}
  </div>
</div>
```

### 3. User Profile

The user profile section includes:
- Profile photo display
- Dropdown menu with user information
- Quick links to profile settings
- Logout functionality

### 4. Notifications

The notifications system includes:
- Notification bell icon with unread count indicator
- Popup with recent notifications
- Ability to mark notifications as read
- Navigation to related content

### 5. Responsive Design

The header adapts to different screen sizes:
- Full controls on desktop
- Simplified controls on mobile
- Conditionally shown elements based on screen size

## Props Interface

```typescript
interface HeaderProps {
  showControls?: boolean;
  toggleSidebar?: () => void;
}
```

- `showControls`: Boolean to determine whether navigation controls are displayed
- `toggleSidebar`: Function to toggle the sidebar visibility

## Usage Pattern

```tsx
// Basic usage
<Header />

// With sidebar controls
<Header showControls={true} toggleSidebar={toggleSidebar} />
```

## Styling Guidelines

1. **Background**: 
   - White background (`bg-white`)
   - Bottom border (`border-b border-gray-200`)
   - Shadow for depth (`shadow-sm`)

2. **Logo**:
   - Centered within header
   - Height of 48px on desktop (h-12)
   - Height of 40px on mobile (h-10)

3. **Layout**:
   - Three-column grid with equal width sections
   - Flex container with space-between alignment
   - Padding left/right (`px-4`) to match content area

4. **Controls**:
   - Hover states for all interactive elements
   - Consistent icon sizes (20px)
   - Rounded corners for buttons

## Integration with Other Components

The header component works in conjunction with:

1. **DashboardSidebar**: Header toggle controls the sidebar state
2. **BreadcrumbBar**: Positioned directly below the header
3. **User Profile System**: Integrated with profile data and settings

## Visual Example

```
+----------------------------------------+
| [≡]     |      Logo      |   👤 🔔    |
+----------------------------------------+
| < Breadcrumb navigation goes here >    |
+----------------------------------------+
| Main content area                      |
|                                        |
|                                        |
```

This consistent header implementation ensures a cohesive user experience across the entire application.
