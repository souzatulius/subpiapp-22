
# Layout System Documentation

This document describes the standard layout structure used throughout the application to ensure consistency.

## Core Layout Components

### DashboardLayout (`src/components/layouts/DashboardLayout.tsx`)

A reusable layout component for dashboard pages that provides:

1. **Standard Structure**:
   - Header with navigation controls and centered logo
   - Sidebar navigation (desktop only)
   - Main content area with standardized spacing
   - Mobile bottom navigation (mobile only)
   - Breadcrumb navigation with path filtering

2. **Responsive Design**:
   - Uses `useIsMobile()` hook to adapt layout for different screen sizes
   - Different navigation patterns for mobile vs desktop
   - Minimal padding for maximized content area

3. **Implementation**:
   ```tsx
   <DashboardLayout>
     {/* Page specific content */}
   </DashboardLayout>
   ```

## Header Component

### Header (`src/components/layouts/header/Header.tsx`)

The main header component appears at the top of all authenticated pages with a three-column layout:

#### Features:

1. **Left Column (1/3 width)**: Contains sidebar toggle button
2. **Center Column (1/3 width)**: Contains centered application logo
3. **Right Column (1/3 width)**: Contains user profile and notifications
4. **Responsive Design**: Adapts to different screen sizes

## Main Content Area Standards

### Standard Containers and Spacing

1. **Maximum Width**:
   - `max-w-full mx-auto` to allow content to use maximum available width

2. **Standard Padding**:
   - Desktop: `p-4`
   - Mobile: `p-4 pb-20 md:pb-4` (extra bottom padding on mobile for the navigation bar)

3. **Content Layout Patterns**:
   - WelcomeCard at the top of most pages
   - Grid-based layout for card components
   - Section-based structure for more complex pages

4. **Breadcrumb Placement**:
   - Positioned at the top of the content area before the WelcomeCard
   - Small, gray text to provide context without visual distraction
   - Configured to hide specific paths like 'dashboard/dashboard', 'dashboard/comunicacao'

## Settings Dashboard Layout

### Settings Component Structure

1. **WelcomeCard**:
   - Blue gradient background (`bg-gradient-to-r from-blue-800 to-blue-950`)
   - Title and description without stat cards
   - Consistent styling with other welcome cards but specialized for settings

2. **Content Organization**:
   - Organized into logical sections based on functionality
   - Side navigation for different setting categories
   - Responsive layout that adapts to screen size

## Mobile-Specific Considerations

1. **Bottom Navigation**:
   - Fixed to bottom of viewport
   - Contains main navigation items
   - Includes visual indicators for active section

2. **Content Padding**:
   - Additional bottom padding to account for the fixed navigation bar

3. **Stack vs. Grid Layout**:
   - Single column layouts on mobile
   - Multi-column grid layouts on larger screens

## Standard Page Structure

Most pages follow this general structure:

```tsx
<div className="min-h-screen flex flex-col bg-gray-50">
  {/* Header with centered logo */}
  <Header showControls={true} toggleSidebar={toggleSidebar} />

  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar - desktop only */}
    {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}

    {/* Main content */}
    <main className="flex-1 overflow-auto">
      {/* Breadcrumb with filtered paths */}
      <BreadcrumbBar />
      
      {/* Content container */}
      <div className="max-w-full mx-auto">
        <div className="p-4 pb-20 md:pb-4">
          {/* Welcome card */}
          <WelcomeCard
            title={title}
            description={description}
            icon={icon}
            color={color}
          />
          
          {/* Page-specific content */}
          <div className="mt-6">
            {/* ... */}
          </div>
        </div>
      </div>
    </main>
  </div>
  
  {/* Mobile navigation - mobile only */}
  {isMobile && <MobileBottomNav />}
</div>
```

## Color System

The application uses a consistent color palette:

1. **Background Colors**:
   - Page background: `bg-gray-50`
   - Components: `bg-white`
   - Sidebar: `bg-[#051b2c]`

2. **Accent Colors**:
   - Primary blue gradients: `from-blue-600 to-blue-800`
   - Secondary orange: `text-[#f57737]`

3. **Text Colors**:
   - Headings: `text-gray-800`
   - Body text: `text-gray-600`
   - Subtle text: `text-gray-500`
   - Breadcrumbs: `text-gray-500`

## Settings Layout

Settings pages follow a slightly different structure:

1. **Settings Sidebar**: Replaces the standard dashboard sidebar
2. **SettingsSectionLayout**: Special component for settings section pages
3. **Mobile Navigation**: Uses a customized version with settings-specific items
4. **WelcomeCard**: Simplified version without stat cards
