# Breadcrumb Implementation Documentation

This document describes the current implementation of breadcrumbs throughout the application to establish a consistent pattern for future development.

## Component Structure

The breadcrumb implementation uses the `@/components/ui/breadcrumb.tsx` component, which is a Shadcn UI component that provides the following:

- `Breadcrumb`: The main wrapper for breadcrumb navigation
- `BreadcrumbList`: Container for the list of breadcrumb items
- `BreadcrumbItem`: Individual breadcrumb item
- `BreadcrumbLink`: Link component for breadcrumb navigation
- `BreadcrumbSeparator`: Separator between breadcrumb items (typically chevron)
- `BreadcrumbPage`: Current page indicator
- `BreadcrumbEllipsis`: Ellipsis for truncated breadcrumb paths

## Current Implementation

The breadcrumb bar is implemented in `src/components/layouts/BreadcrumbBar.tsx`.

### Key Features

1. **Dynamic Path Parsing**:
   - Automatically parses the current location path
   - Splits into segments for hierarchical representation

2. **Display Name Mapping**:
   - Maps URL segments to user-friendly display names
   - Contains a dictionary of standard page names

3. **Navigation**:
   - Each breadcrumb item is clickable
   - Navigates to the corresponding path when clicked
   - Special handling for settings pages

4. **Home Link**:
   - Always includes a home link with a house icon
   - Navigates to the dashboard

5. **Styling**:
   - Small, light gray text for minimal visual impact
   - Positioned above the main content area
   - Consistent padding (px-6 py-2)

### Placement

Breadcrumbs are placed at the top of the page content area, before any welcome cards or other content. This provides context for the user's current location without taking up too much visual space.

### Mobile Considerations

The breadcrumb text is small enough (text-xs) to fit well on mobile screens. The component itself is responsive and adjusts to different screen sizes.

## Usage Pattern

To add breadcrumbs to a new page:

1. Import the BreadcrumbBar component:
   ```tsx
   import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
   ```

2. Place it at the top of the main content area:
   ```tsx
   <main className="flex-1 overflow-auto">
     <BreadcrumbBar />
     <div className="max-w-7xl mx-auto">
       {/* Rest of the page content */}
     </div>
   </main>
   ```

3. Update the display names mapping in `BreadcrumbBar.tsx` if adding new sections.

## Special Handlers

For sections like Settings that need special navigation handling, use the `onSettingsClick` prop:

```tsx
<BreadcrumbBar onSettingsClick={() => navigate('/settings')} />
```

This allows for custom behavior when specific breadcrumb sections are clicked.
