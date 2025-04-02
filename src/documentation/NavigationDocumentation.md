
# Navigation System Documentation

This document describes the current navigation components and structure used throughout the application to maintain consistency.

## Desktop Sidebar Navigation

### Component: `src/components/dashboard/DashboardSidebar.tsx`

The desktop sidebar provides the main navigation for the application on larger screens.

#### Key Features:

1. **Collapsible Design**:
   - Can be toggled between expanded and collapsed states
   - Expanded state shows icons and text
   - Collapsed state shows only icons

2. **Navigation Configuration**:
   - Navigation items are defined in `src/components/dashboard/sidebar/navigationConfig.tsx`
   - Each item has an ID, icon, label, and path

3. **Visual Design**:
   - Dark blue background (`bg-[#051b2c]`)
   - Navigation items with hover and active states
   - Orange accents for selected items

4. **Conditional Visibility**:
   - Only displayed on desktop screens (handled by `isMobile` check)
   - Admin sections conditionally displayed based on user permissions

#### Usage Pattern:

```tsx
<DashboardSidebar isOpen={sidebarOpen} />
```

## Mobile Bottom Navigation

### Component: `src/components/layouts/MobileBottomNav.tsx`

The mobile bottom navigation provides simplified navigation for mobile users.

#### Key Features:

1. **Fixed Position**:
   - Attached to the bottom of the screen
   - Only visible on mobile devices

2. **Simplified Menu**:
   - Uses the same navigation config as the desktop sidebar
   - Shows only the most important items
   - Simplified labels (e.g., "Ranking" instead of "Ranking das Subs")

3. **Visual Design**:
   - Dark blue background matching the sidebar
   - Orange icons for brand consistency
   - Active state with white background

4. **Implementation**:
   ```tsx
   {isMobile && <MobileBottomNav />}
   ```

## Header Navigation

### Component: `src/components/layouts/header/Header.tsx`

The header provides additional navigation controls and user-specific options.

#### Key Features:

1. **Sidebar Toggle**:
   - Button to collapse/expand the sidebar on desktop
   - Menu button on mobile that opens the sidebar as an overlay

2. **User Profile Menu**:
   - Access to user-specific settings and logout
   - Profile photo display

3. **Notifications**:
   - Notification bell icon
   - Popup with recent notifications

4. **Responsive Design**:
   - Adjusts controls and layout based on screen size
   - Different spacing and components for mobile vs. desktop

#### Usage Pattern:

```tsx
<Header showControls={true} toggleSidebar={toggleSidebar} />
```

## Navigation Configuration

### File: `src/components/dashboard/sidebar/navigationConfig.tsx`

This centralized configuration defines all navigation items used throughout the application.

#### Structure:

Each navigation item includes:
- `id`: Unique identifier
- `icon`: Lucide React icon component
- `label`: Display name
- `path`: URL path
- `isSection`: Boolean indicating if item is a section header

#### Current Main Sections:

1. Dashboard (Home)
2. Comunicação
3. Relatórios
4. Ranking das Subs

This configuration is used by both the desktop sidebar and mobile bottom navigation to maintain consistency.

## Integration Pattern

Most main page layouts follow this structure:

```tsx
<div className="min-h-screen flex flex-col bg-gray-50">
  <Header showControls={true} toggleSidebar={toggleSidebar} />
  
  <div className="flex flex-1 overflow-hidden">
    {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
    
    <main className="flex-1 overflow-auto">
      <BreadcrumbBar />
      <div className="max-w-7xl mx-auto">
        {/* Page content */}
      </div>
    </main>
  </div>
  
  {isMobile && <MobileBottomNav />}
</div>
```

This ensures a consistent layout and navigation experience across the entire application.
