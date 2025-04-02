
# UX Standards Documentation

This document outlines the user experience standards established across the application to ensure consistency and usability.

## Visual Identity

### Logo

- Centered in header layout
- Height of 48px on desktop (h-12)
- Height of 40px on mobile (h-10)
- Consistent source: `/lovable-uploads/a94cbbfc-b0c9-4e5c-86e2-9f9db452dca3.png`

### Color Palette

1. **Primary Colors**:
   - Blue: `#003570` (subpi-blue)
   - Orange: `#f57b35` (subpi-orange)

2. **Background Colors**:
   - Page background: `bg-gray-50`
   - Content cards: `bg-white`
   - Sidebar: `bg-[#051b2c]`

3. **Text Colors**:
   - Primary text: `text-gray-800`
   - Secondary text: `text-gray-600`
   - Tertiary/hint text: `text-gray-500`
   - Inverted text: `text-white`

4. **Gradient Standards**:
   - Communication section: `from-orange-500 to-orange-700`
   - Settings section: `from-blue-800 to-blue-950`
   - Dashboard: `from-blue-600 to-blue-800`
   - Notas: `from-amber-500 to-amber-700`

## Typography

1. **Font Family**:
   - Primary: 'Poppins' (`font-poppins`)
   - Fallback: Sans-serif system fonts

2. **Text Sizes**:
   - Page titles: `text-2xl` to `text-3xl`
   - Section headings: `text-xl` to `text-2xl`
   - Card titles: `text-lg` to `text-xl`
   - Body text: `text-base`
   - Supporting text: `text-sm`
   - Small text/labels: `text-xs`

3. **Font Weights**:
   - Bold headings: `font-bold` (700)
   - Medium emphasis: `font-medium` (500)
   - Normal body text: `font-normal` (400)

## Layout Standards

### Page Structure

1. **Standard Container**:
   - Maximum width: `max-w-7xl`
   - Center aligned: `mx-auto`
   - Content padding: `p-6` (desktop), `p-6 pb-20` (mobile)

2. **Spacing System**:
   - Component spacing: `space-y-6` (vertical) or `space-x-4` (horizontal)
   - Section spacing: `mb-6` to `mb-8`
   - Internal padding: `p-4` to `p-6` for cards and containers

3. **Card Components**:
   - Rounded corners: `rounded-lg` or `rounded-xl`
   - Soft shadows: `shadow-sm` to `shadow-md`
   - White background: `bg-white`
   - Border accents: `border border-gray-200`

### Responsive Design

1. **Breakpoints**:
   - Mobile: Default
   - Tablet: `md:` (768px)
   - Desktop: `lg:` (1024px)
   - Large desktop: `xl:` (1280px)
   - Extra large: `2xl:` (1536px)

2. **Mobile Adaptations**:
   - Stack elements vertically: `flex-col`
   - Full width containers: `w-full`
   - Bottom navigation instead of sidebar
   - Simplified headers and reduced padding

## Interactive Elements

### Buttons

1. **Primary Action**:
   - Blue background: `bg-blue-600`
   - White text: `text-white`
   - Hover state: `hover:bg-blue-700`
   - Border radius: `rounded-md`
   - Padding: `px-4 py-2`

2. **Secondary Action**:
   - Gray outline: `border border-gray-300`
   - Dark text: `text-gray-700`
   - Hover state: `hover:bg-gray-50`
   - Same shape as primary: `rounded-md`

3. **Danger Action**:
   - Red background: `bg-red-600`
   - White text: `text-white`
   - Hover state: `hover:bg-red-700`

### Form Controls

1. **Text Inputs**:
   - Consistent height: `h-10`
   - Padding: `px-3`
   - Border: `border border-gray-300`
   - Border radius: `rounded-md`
   - Focus state: `focus:ring-2 focus:ring-blue-500`

2. **Selects/Dropdowns**:
   - Similar styling to text inputs
   - Custom dropdown icon
   - Consistent padding and height

3. **Checkboxes and Radios**:
   - Custom styled
   - Blue accent when selected
   - Properly sized for touch (min 20x20px)

## Feedback & Notifications

1. **Toast Messages**:
   - Success: Green background
   - Error: Red background
   - Info: Blue background
   - Warning: Yellow background
   - Position: Bottom right
   - Auto-dismiss after 5 seconds

2. **Loading States**:
   - Consistent spinners (Loader component)
   - Skeleton loaders for content
   - Disabled buttons during form submission

3. **Empty States**:
   - Helpful illustrations
   - Clear empty state messages
   - Action buttons when applicable

## Accessibility Standards

1. **Color Contrast**:
   - Minimum 4.5:1 for normal text
   - Minimum 3:1 for large text

2. **Focus Management**:
   - Visible focus indicators
   - Keyboard navigation support
   - Proper tab order

3. **Screen Reader Support**:
   - Semantic HTML elements
   - ARIA labels where needed
   - Alternative text for images

## Animation & Transitions

1. **Page Transitions**:
   - Subtle fade-in animations
   - Duration: 300-500ms

2. **Interactive Elements**:
   - Hover state transitions: 150ms
   - Scale/transform effects: Subtle (1.02-1.05 scale)

3. **Notification Animations**:
   - Slide-in/slide-out
   - Fade effects
   - Subtle attention animations

This document serves as the reference standard for consistent user experience across the application.
