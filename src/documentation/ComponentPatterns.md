
# Component Patterns Documentation

This document outlines the standard patterns and practices for components used throughout the application.

## Card Components

### Standard Card

The base card component is used for content containers throughout the application.

```tsx
<Card className="bg-white rounded-xl shadow p-6">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

### Welcome Card

Used at the top of major sections to provide context and introduction.

```tsx
<WelcomeCard
  title="Section Title"
  description="Brief description of this section's purpose."
  icon={<Icon className="h-6 w-6 mr-2" />}
  color="bg-gradient-to-r from-blue-600 to-blue-800"
/>
```

### Action Card

Used for navigation tiles and action buttons.

```tsx
<ActionCard
  id="card-id"
  title="Action Title"
  iconId="icon-id"
  path="/path/to/action"
  color="blue" // or other color
/>
```

### Data Card

Used for displaying statistics or data summaries.

```tsx
<StatCard
  title="Stat Title"
  value={value}
  description="Description" 
  section="section-name"
  highlight={true}
/>
```

## Layout Components

### Dashboard Layout

Standard layout for authenticated dashboard pages.

```tsx
<DashboardLayout>
  {/* Page content */}
</DashboardLayout>
```

### Auth Layout

Layout for authentication pages.

```tsx
<AuthLayout>
  {/* Authentication form */}
</AuthLayout>
```

### Settings Layout

Specialized layout for settings pages with sidebar navigation.

```tsx
<div className="flex">
  <SettingsSidebar 
    activeSection={activeSection}
    setActiveSection={setActiveSection}
  />
  <div className="flex-1">
    <SettingsContent activeSection={activeSection} />
  </div>
</div>
```

## Navigation Components

### Header

Standard application header with centralized logo.

```tsx
<Header showControls={true} toggleSidebar={toggleSidebar} />
```

### Breadcrumb Bar

Contextual navigation showing current location in app hierarchy.

```tsx
<BreadcrumbBar />
```

### Sidebar

Main navigation for desktop views.

```tsx
<DashboardSidebar isOpen={sidebarOpen} />
```

### Mobile Bottom Navigation

Main navigation for mobile views.

```tsx
<MobileBottomNav />
```

## Form Components

### Standard Form Layout

```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="field-id">Field Label</Label>
    <Input 
      id="field-id"
      placeholder="Placeholder"
      value={value}
      onChange={handleChange}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
  <Button type="submit">Submit</Button>
</form>
```

### Form Group Pattern

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="field-1">Field 1</Label>
    <Input id="field-1" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="field-2">Field 2</Label>
    <Input id="field-2" />
  </div>
</div>
```

## Table Components

### Standard Table

```tsx
<div className="overflow-x-auto">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Column 1</TableHead>
        <TableHead>Column 2</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.col1}</TableCell>
          <TableCell>{item.col2}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### With Loading State

```tsx
<div className="overflow-x-auto">
  {isLoading ? (
    <div className="flex justify-center p-6">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ) : (
    <Table>
      {/* Table content */}
    </Table>
  )}
</div>
```

## Dialog Components

### Confirmation Dialog

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirmation Title</DialogTitle>
      <DialogDescription>
        Are you sure you want to perform this action?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Empty State Components

```tsx
<div className="flex flex-col items-center justify-center p-12 text-center">
  <div className="rounded-full bg-gray-100 p-3 mb-4">
    <Icon className="h-6 w-6 text-gray-400" />
  </div>
  <h3 className="text-lg font-medium text-gray-900">No Items Found</h3>
  <p className="mt-1 text-sm text-gray-500">
    There are no items to display at this time.
  </p>
  <Button className="mt-4">Action Button</Button>
</div>
```

## Notification Components

### Toast Notifications

```tsx
// Success
toast({
  title: "Success!",
  description: "Operation completed successfully.",
});

// Error
toast({
  title: "Error!",
  description: "Something went wrong.",
  variant: "destructive",
});
```

## Loading State Components

### Loading Spinner

```tsx
<div className="flex justify-center items-center p-6">
  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
</div>
```

### Skeleton Loader

```tsx
<div className="space-y-3">
  <Skeleton className="h-6 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-4 w-5/6" />
</div>
```

This document serves as a reference for the standard component patterns used throughout the application to maintain consistency in implementation and visual design.
