
# WelcomeCard Component Standards

This document outlines the standard implementation and usage patterns for the WelcomeCard component across the application.

## Component Overview

The WelcomeCard component (`src/components/settings/components/WelcomeCard.tsx` and similar variants) serves as the entry point for major sections of the application, providing context, title information, and sometimes action buttons or statistics.

## Standard Implementation

### Basic Structure

```tsx
<WelcomeCard
  title="Section Title"
  description="Brief description of this section's purpose"
  icon={<Icon className="h-6 w-6 mr-2" />}
  color="bg-gradient-to-r from-blue-600 to-blue-800"
/>
```

### Variants

1. **Standard Welcome Card**:
   - Title, description, and icon
   - Gradient background
   - No additional actions or stats

2. **Settings Welcome Card**:
   - Blue gradient background (`bg-gradient-to-r from-blue-800 to-blue-950`)
   - Settings icon
   - No stat cards as of current standards
   - Optional action button

3. **Dashboard Welcome Card**:
   - Personalized greeting
   - Quick summary of pending items
   - Action buttons for common tasks

4. **Section Welcome Card**:
   - Section-specific icon and color
   - Brief explanation of section purpose
   - Optional stat counters

## Styling Standards

### Colors

- **Comunicação**: Orange gradient (`from-orange-500 to-orange-700`)
- **Settings**: Dark blue gradient (`from-blue-800 to-blue-950`)
- **Dashboard**: Blue gradient (`from-blue-600 to-blue-800`)
- **Notas**: Amber gradient (`from-amber-500 to-amber-700`)

### Layout

- Full width within content container
- Consistent padding (`p-6`)
- Flexible responsive layout (stacks on mobile)
- Card header with title and icon
- Optional footer for buttons or additional actions

### Typography

- Title: `text-2xl font-bold text-white`
- Description: `text-lg text-white/90` or lighter variant of background
- Button text: `text-sm font-medium`

## Usage Guidelines

1. **Placement**:
   - Always at the top of the main content area
   - Below breadcrumb navigation
   - Above any content cards or data displays

2. **Content**:
   - Keep titles concise (ideally 1-3 words)
   - Descriptions should be 1-2 sentences maximum
   - Icons should be relevant to the section purpose

3. **Actions**:
   - Include buttons only when there are clear primary actions
   - Limit to 1-2 actions maximum
   - Use consistent button styling

## Current Implementation in Settings

The settings welcome card uses a simplified version without stat cards:

```tsx
<WelcomeCard 
  color="bg-gradient-to-r from-blue-800 to-blue-950"
/>
```

This includes:
- Settings icon
- "Central de Configurações" title
- Description text about managing system settings
- No stat cards or additional metrics

## Integration with Layout System

The WelcomeCard is a key element in the standard page structure and should be consistently implemented across all major sections of the application to maintain visual coherence and user orientation.
