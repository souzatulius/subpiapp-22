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

1. **Custom Path Configuration**:
   - Predefined breadcrumb paths for specific routes
   - Each route has a customized breadcrumb trail
   - Fallback to dynamic generation for unconfigured routes

2. **Standard Breadcrumb Paths**:
   - Releases: Início / Comunicação / Releases e Notícias
   - Novo Release: Início / Comunicação / Releases e Notícias / Novo Release
   - Aprovar Notas: Início / Comunicação / Notas de Imprensa / Aprovar Notas
   - Demandas: Início / Comunicação / Demandas
   - Gerar Nota: Início / Comunicação / Notas de Imprensa / Gerar Nota
   - Nova Solicitação: Início / Comunicação / Demandas / Nova Solicitação
   - Notas de Imprensa: Início / Comunicação / Notas de Imprensa

3. **Display Name Mapping**:
   - Maps URL segments to user-friendly display names
   - Contains a dictionary of standard page names

4. **Hidden Segments**:
   - Certain paths are explicitly hidden from breadcrumb display:
     - 'zeladoria'
     - 'dashboard/dashboard'

5. **Navigation**:
   - Each breadcrumb item is clickable
   - Navigates to the corresponding path when clicked
   - Special handling for settings pages

6. **Home Link**:
   - Always includes a home link with a house icon
   - Navigates to the dashboard

7. **Styling**:
   - Small, light gray text for minimal visual impact
   - Positioned above the main content area
   - Consistent padding (px-6 py-2)

### Placement

Breadcrumbs are placed at the top of the page content area, before any welcome cards or other content. This provides context for the user's current location without taking up too much visual space.

### Mobile Considerations

The breadcrumb text is small enough (text-xs) to fit well on mobile screens. The component itself is responsive and adjusts to different screen sizes.

## Usage Pattern

To add breadcrumbs to a new page:

1. Update the custom breadcrumb configuration in `getBreadcrumbItems()` in `BreadcrumbBar.tsx`:
   ```tsx
   const customBreadcrumbs = [
     // Your new path configuration
     {
       path: '/your/new/path',
       items: [
         { label: 'Início', path: '/dashboard' },
         { label: 'Some Section', path: '/dashboard/some-section' },
         { label: 'Your Page', path: '/your/new/path' }
       ]
     },
     // ...existing configurations
   ];
   ```

2. Add any new display names to the `displayNames` dictionary in the `getDisplayName()` function.

## Special Handlers

For sections like Settings that need special navigation handling, use the `onSettingsClick` prop:

```tsx
<BreadcrumbBar onSettingsClick={() => navigate('/settings')} />
```

This allows for custom behavior when specific breadcrumb sections are clicked.

## Default Fallback Behavior

For routes that don't have an explicit custom configuration, the component falls back to dynamically generating breadcrumbs based on the URL path, similar to the previous implementation. This ensures that all pages have appropriate breadcrumb navigation.
