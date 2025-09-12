# Pagination Component

A reusable pagination component with a custom hook for managing pagination state and logic.

## Features

- ✅ Smart pagination with ellipsis (...) for large page counts
- ✅ Customizable page size
- ✅ Optional page info display
- ✅ Fully accessible with keyboard navigation
- ✅ TypeScript support
- ✅ Reusable across all table components
- ✅ **Responsive design** - Optimized for mobile and desktop
- ✅ **Enhanced visual styling** - Better spacing and hover effects
- ✅ **Improved readability** - Clear visual hierarchy and contrast

## Usage

### Basic Usage

```tsx
import { Pagination } from '@/components/Pagination';
import { usePagination } from '@/hooks/usePagination';

const MyComponent = () => {
  const data = [
    /* your data array */
  ];
  const pageSize = 10;

  const pagination = usePagination({
    totalItems: data.length,
    pageSize,
    maxVisiblePages: 5, // optional, default is 5
  });

  const paginatedData = pagination.getPageData(data);

  return (
    <div>
      {/* Your table/list content */}
      {paginatedData.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}

      {/* Pagination component */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        paginationItems={pagination.paginationItems}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        onNextPage={pagination.goToNextPage}
        onPreviousPage={pagination.goToPreviousPage}
      />
    </div>
  );
};
```

### With Page Info

```tsx
<Pagination
  currentPage={pagination.currentPage}
  totalPages={pagination.totalPages}
  onPageChange={pagination.goToPage}
  paginationItems={pagination.paginationItems}
  hasNextPage={pagination.hasNextPage}
  hasPreviousPage={pagination.hasPreviousPage}
  onNextPage={pagination.goToNextPage}
  onPreviousPage={pagination.goToPreviousPage}
  showInfo={true}
  totalItems={pagination.totalItems}
  pageSize={pagination.pageSize}
  startIndex={pagination.startIndex}
  endIndex={pagination.endIndex}
/>
```

### Custom Labels

```tsx
<Pagination
  // ... other props
  prevLabel='Previous'
  nextLabel='Next'
/>
```

## Hook API

### usePagination(options)

#### Options

- `totalItems: number` - Total number of items to paginate
- `pageSize: number` - Number of items per page
- `initialPage?: number` - Initial page number (default: 1)
- `maxVisiblePages?: number` - Maximum visible page buttons (default: 5)

#### Returns

- `currentPage: number` - Current page number
- `totalPages: number` - Total number of pages
- `pageSize: number` - Current page size
- `totalItems: number` - Total number of items
- `startIndex: number` - Start index for current page
- `endIndex: number` - End index for current page
- `hasNextPage: boolean` - Whether there's a next page
- `hasPreviousPage: boolean` - Whether there's a previous page
- `paginationItems: (number | string)[]` - Array of page numbers and ellipsis
- `getPageData: <T>(data: T[]) => T[]` - Function to get paginated data
- `goToPage: (page: number) => void` - Go to specific page
- `goToNextPage: () => void` - Go to next page
- `goToPreviousPage: () => void` - Go to previous page
- `goToFirstPage: () => void` - Go to first page
- `goToLastPage: () => void` - Go to last page
- `setPageSize: (size: number) => void` - Change page size

## Component Props

### PaginationProps

- `currentPage: number` - Current page number
- `totalPages: number` - Total number of pages
- `onPageChange: (page: number) => void` - Page change handler
- `paginationItems: (number | string)[]` - Array of page numbers and ellipsis
- `hasNextPage: boolean` - Whether there's a next page
- `hasPreviousPage: boolean` - Whether there's a previous page
- `onNextPage: () => void` - Next page handler
- `onPreviousPage: () => void` - Previous page handler
- `showInfo?: boolean` - Show page info (default: false)
- `totalItems?: number` - Total number of items
- `pageSize?: number` - Current page size
- `startIndex?: number` - Start index for current page
- `endIndex?: number` - End index for current page
- `className?: string` - Additional CSS classes
- `prevLabel?: string` - Previous button label (default: "Trước")
- `nextLabel?: string` - Next button label (default: "Sau")
- `disabled?: boolean` - Disable pagination (default: false)

## Examples

### DataTable Integration

```tsx
const DataTable = ({ data }) => {
  const pagination = usePagination({
    totalItems: data.length,
    pageSize: 20,
  });

  const paginatedData = pagination.getPageData(data);

  return (
    <div>
      <table>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        paginationItems={pagination.paginationItems}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        onNextPage={pagination.goToNextPage}
        onPreviousPage={pagination.goToPreviousPage}
        showInfo={true}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
      />
    </div>
  );
};
```

### Dynamic Page Size

```tsx
const [pageSize, setPageSize] = useState(10);

const pagination = usePagination({
  totalItems: data.length,
  pageSize,
});

// Change page size
const handlePageSizeChange = (newSize: number) => {
  setPageSize(newSize);
  pagination.setPageSize(newSize);
};
```

## Responsive Design

The pagination component automatically adapts to different screen sizes:

### Mobile Layout (< 640px)

- **Stacked Layout**: Page size dropdown on top, pagination below
- **Centered Elements**: All elements are centered for better mobile UX
- **Compact Buttons**: Smaller buttons with adequate touch targets
- **Horizontal Scroll**: Page numbers can scroll horizontally if needed
- **Simplified Labels**: "Số mục:" instead of "Hiển thị:" for space

### Desktop Layout (≥ 640px)

- **Horizontal Layout**: All elements in a single row
- **Enhanced Styling**: Larger buttons with hover effects and animations
- **Better Spacing**: More generous spacing between elements
- **Visual Enhancements**: Page info in a styled container with highlights
- **Scale Effects**: Buttons scale on hover for better interactivity

### Visual Enhancements

- **Smooth Transitions**: All interactions have smooth 200ms transitions
- **Hover Effects**: Buttons scale and change color on hover
- **Active State**: Current page button has enhanced styling with scale effect
- **Border Separator**: Clean border separator above pagination area
- **Improved Contrast**: Better color contrast for accessibility
