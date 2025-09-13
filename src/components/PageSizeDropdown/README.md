# PageSizeDropdown Component

A reusable dropdown component for selecting the number of items to display per page in tables.

## Features

- ✅ Customizable page size options
- ✅ Vietnamese labels ("mục/trang")
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Disabled state support
- ✅ Consistent styling with existing design system

## Usage

### Basic Usage

```tsx
import PageSizeDropdown from '@/components/PageSizeDropdown/PageSizeDropdown';

const MyComponent = () => {
  const [pageSize, setPageSize] = useState(20);

  return (
    <PageSizeDropdown
      currentPageSize={pageSize}
      onPageSizeChange={setPageSize}
    />
  );
};
```

### With Custom Options

```tsx
<PageSizeDropdown
  currentPageSize={pageSize}
  onPageSizeChange={setPageSize}
  options={[10, 20, 50, 100]}
/>
```

### With Custom Styling

```tsx
<PageSizeDropdown
  currentPageSize={pageSize}
  onPageSizeChange={setPageSize}
  className='my-custom-class'
  disabled={isLoading}
/>
```

## Props

### PageSizeDropdownProps

| Prop               | Type                         | Default             | Description                     |
| ------------------ | ---------------------------- | ------------------- | ------------------------------- |
| `currentPageSize`  | `number`                     | -                   | Current page size value         |
| `onPageSizeChange` | `(pageSize: number) => void` | -                   | Callback when page size changes |
| `options`          | `number[]`                   | `[10, 20, 50, 100]` | Available page size options     |
| `className`        | `string`                     | `''`                | Additional CSS classes          |
| `disabled`         | `boolean`                    | `false`             | Disable the dropdown            |

## Examples

### DataTable Integration

```tsx
const DataTable = ({ data }) => {
  const [pageSize, setPageSize] = useState(20);
  const pagination = usePagination({
    totalItems: data.length,
    pageSize,
  });

  return (
    <div>
      <table>{/* table content */}</table>

      <div className='flex justify-between items-center'>
        <PageSizeDropdown
          currentPageSize={pagination.pageSize}
          onPageSizeChange={pagination.setPageSize}
          options={[10, 20, 50, 100]}
        />

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
          // ... other pagination props
        />
      </div>
    </div>
  );
};
```

### Dashboard Integration

```tsx
const Dashboard = () => {
  const pagination = usePagination({
    totalItems: todayList.length,
    pageSize: 4,
  });

  return (
    <div>
      {/* Today's expenses list */}

      <div className='flex justify-between items-center'>
        <PageSizeDropdown
          currentPageSize={pagination.pageSize}
          onPageSizeChange={pagination.setPageSize}
          options={[10, 20, 50, 100]}
        />

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
          // ... other pagination props
        />
      </div>
    </div>
  );
};
```

## Styling

The component uses Tailwind CSS classes and follows the existing design system:

- **Label**: `text-sm text-muted whitespace-nowrap`
- **Dropdown**: Uses the existing `Dropdown` component styling
- **Container**: `flex items-center gap-2`

## Accessibility

- Proper labeling with "Hiển thị:" prefix
- Keyboard navigation support through the underlying Dropdown component
- Screen reader friendly with descriptive labels

## Integration with usePagination

The PageSizeDropdown works seamlessly with the `usePagination` hook:

```tsx
const pagination = usePagination({
  totalItems: data.length,
  pageSize: 20,
});

// When page size changes, it automatically:
// 1. Updates the page size
// 2. Resets to page 1
// 3. Recalculates total pages
// 4. Updates pagination items

<PageSizeDropdown
  currentPageSize={pagination.pageSize}
  onPageSizeChange={pagination.setPageSize}
/>;
```
