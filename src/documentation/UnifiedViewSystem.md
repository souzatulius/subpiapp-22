
# Unified View System Documentation

This document describes the standardized view system used throughout the application for consistent search, filtering, and view toggling functionality.

## Core Components

### UnifiedFilterBar

A flexible filter bar component that provides:

1. **Standard Search Field**:
   - Consistent search input with icon
   - Placeholder text customization
   - Responsive design

2. **View Toggles**:
   - List view button
   - Card/grid view button
   - Visual indication of active view

3. **Filter Options**:
   - Primary filter dropdown (e.g., status, category)
   - Secondary filter dropdown (e.g., priority, date)
   - Expandable filter section

4. **Navigation**:
   - Optional back button with consistent styling
   - Mobile-friendly display

### UnifiedListView / UnifiedGridView

Standardized content display components that provide:

1. **Consistent Empty States**:
   - Customizable message and icon
   - Standard styling

2. **Loading States**:
   - Spinner with message
   - Consistent placement

3. **Item Rendering**:
   - Flexible item rendering via render props
   - Selection highlighting
   - Click handling

### UnifiedViewContainer

A composite component that combines:
- UnifiedFilterBar
- UnifiedListView or UnifiedGridView based on selected view mode
- Card container for consistent styling

## Usage Example

```tsx
<UnifiedViewContainer
  items={filteredItems}
  isLoading={isLoading}
  renderListItem={(item) => (
    <ItemCard item={item} isSelected={false} />
  )}
  renderGridItem={(item) => (
    <ItemGridCard item={item} isSelected={false} />
  )}
  idExtractor={(item) => item.id}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  onItemClick={handleSelectItem}
  selectedItemId={selectedItem?.id}
  filterOptions={{
    primaryFilter: {
      value: statusFilter,
      onChange: setStatusFilter,
      options: statusOptions,
      placeholder: 'Status'
    },
    secondaryFilter: {
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: priorityOptions,
      placeholder: 'Prioridade'
    }
  }}
  emptyStateMessage="Nenhum item encontrado"
  searchPlaceholder="Buscar itens..."
  defaultViewMode="list"
/>
```

## Implemented Pages

This unified view system has been implemented across multiple pages:

1. **Responder Demandas**:
   - List and grid views of demands
   - Filtering by area and priority
   - Search by demand title and content

2. **Aprovar Nota**:
   - List view of notes pending approval
   - Filtering by status
   - Search by note title, author, and content

3. **Consultar Demandas**:
   - List and grid views of all demands
   - Filtering by demand status
   - Search by demand details

4. **Releases**:
   - List and grid views of releases
   - Standard filtering and search

5. **E-SIC**:
   - List view of E-SIC requests
   - Filtering by status and category

## Customization

Each implementation can customize:
- Filter options
- Default view mode
- Card/grid layout (columns for different screen sizes)
- Empty state messages
- Search placeholder text
- Item rendering

## Benefits

1. **Consistency**: Users experience the same patterns across the application
2. **Maintainability**: Changes to filtering/viewing behavior can be made in one place
3. **Reduced Code Duplication**: Common patterns are extracted to reusable components
4. **Responsive Design**: All components adapt to different screen sizes
