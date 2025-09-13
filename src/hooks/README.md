# Reusable React Query Hooks

This directory contains reusable React Query hooks for managing API data in the expense tracker application.

## Important Notes

- **All API paths start with `/api/v1/`**
- **All timestamps are converted to UTC** for consistent API communication
- **Time conversion utilities** are available in `@/utils/time` for proper UTC handling

## Money Note Hooks

### `useMoneyNoteQuery`

Hook for fetching money notes with date range.

```typescript
import { useMoneyNoteQuery, useMoneyNoteQueryByTimestamp } from '@/hooks';

// Using ISO date strings
const { data, isLoading, error } = useMoneyNoteQuery({
  start_date: '2024-01-01',
  end_date: '2024-01-31',
});

// Using UTC epoch timestamps
const { data, isLoading, error } = useMoneyNoteQueryByTimestamp(
  startTimestamp,
  endTimestamp,
  { enabled: true, loadingMessage: 'Loading expenses...' }
);
```

### `useMoneyNoteMutations`

Hook for creating, updating, and deleting money notes.

```typescript
import { useMoneyNoteMutations } from '@/hooks';

const {
  create,
  update,
  delete: deleteNote,
  isPending,
} = useMoneyNoteMutations();

// Create multiple money notes
const handleCreate = async () => {
  await create.mutateAsync([
    {
      type: 1, // expense
      note: 'Coffee',
      amount: 50000,
      category_id: 1,
    },
  ]);
};

// Update a money note
const handleUpdate = async (noteId: number) => {
  await update.mutateAsync({
    noteId,
    data: {
      note: 'Updated note',
      amount: 60000,
      category_id: 1,
      type: 1,
    },
  });
};

// Delete a money note
const handleDelete = async (noteId: number) => {
  await deleteNote.mutateAsync(noteId);
};
```

## Budget Hooks

### `useBudgetQuery`

Hook for fetching budgets.

```typescript
import { useBudgetQuery, useBudgetQueryForDashboard } from '@/hooks';

// General budget query
const { data, isLoading, error } = useBudgetQuery({
  enabled: true,
  loadingMessage: 'Loading budgets...',
});

// Dashboard-specific budget query (with optimized caching)
const { data, isLoading, error } = useBudgetQueryForDashboard();
```

### `useBudgetMutations`

Hook for creating, updating, and deleting budgets.

```typescript
import { useBudgetMutations } from '@/hooks';

const {
  create,
  update,
  delete: deleteBudget,
  isPending,
} = useBudgetMutations();

// Create a budget
const handleCreate = async () => {
  await create.mutateAsync({
    category_id: 1,
    amount: 1000000,
    period_type: 3, // monthly
    start_date: '2024-01-01',
    end_date: '2024-01-31',
  });
};

// Update a budget
const handleUpdate = async (budgetId: number) => {
  await update.mutateAsync({
    budgetId,
    data: {
      category_id: 1,
      amount: 1200000,
      period_type: 3,
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      status: 2, // active
    },
  });
};

// Delete a budget
const handleDelete = async (budgetId: number) => {
  await deleteBudget.mutateAsync(budgetId);
};
```

## Alert Hooks

### `useAlertQuery`

Hook for fetching alerts with date range.

```typescript
import { useAlertQuery, useAlertQueryByDate } from '@/hooks';

// Using UTC epoch timestamps
const { data, isLoading, error } = useAlertQuery(startTimestamp, endTimestamp, {
  enabled: true,
  loadingMessage: 'Loading alerts...',
});

// Using ISO date strings (automatically converted to UTC)
const { data, isLoading, error } = useAlertQueryByDate(
  '2024-01-01',
  '2024-01-31'
);
```

### `useAlertMutations`

Hook for creating and updating alerts.

```typescript
import { useAlertMutations } from '@/hooks';

const { create, update, isPending } = useAlertMutations();

// Create an alert
const handleCreate = async () => {
  await create.mutateAsync({
    category_id: 1,
    title: 'Food Budget Alert',
    amount: 500000,
    start_date: startTimestamp,
    end_date: endTimestamp,
    type: 1, // daily
  });
};

// Update an alert
const handleUpdate = async (alertId: number) => {
  await update.mutateAsync({
    alertId,
    data: {
      title: 'Updated Alert',
      amount: 600000,
      status: 2, // active
    },
  });
};
```

## UTC Time Utilities

All hooks use UTC time conversion utilities for consistent API communication:

```typescript
import {
  // Basic UTC conversion
  localDateToUtcEpochSeconds,
  localDateToUtcStartOfDayEpochSeconds,
  localDateToUtcEndOfDayEpochSeconds,
  dateToUtcEpochSeconds,
  nowToUtcEpochSeconds,

  // Date range utilities
  getTodayUtcEpochRange,
  dateRangeToUtcEpochRange,
  isoDateRangeToUtcEpochRange,

  // Period utilities
  getStartOfMonthUtcEpochSeconds,
  getEndOfMonthUtcEpochSeconds,
  getStartOfWeekUtcEpochSeconds,
  getEndOfWeekUtcEpochSeconds,

  // Time manipulation
  addDaysToUtcEpochSeconds,
  addHoursToUtcEpochSeconds,
  addMinutesToUtcEpochSeconds,
  getDaysDifferenceUtcEpochSeconds,

  // Format conversion
  epochSecondsToUtcIsoDate,
  utcIsoDateToEpochSeconds,
} from '@/utils/time';

// Convert local date to UTC epoch seconds
const utcTimestamp = localDateToUtcEpochSeconds(new Date());
const currentUtcTimestamp = nowToUtcEpochSeconds();

// Get today's range in UTC
const { start, end } = getTodayUtcEpochRange();

// Get month range in UTC
const monthStart = getStartOfMonthUtcEpochSeconds(new Date());
const monthEnd = getEndOfMonthUtcEpochSeconds(new Date());

// Get week range in UTC
const weekStart = getStartOfWeekUtcEpochSeconds(new Date());
const weekEnd = getEndOfWeekUtcEpochSeconds(new Date());

// Convert date range to UTC epoch range
const { start: startUtc, end: endUtc } = dateRangeToUtcEpochRange(
  new Date('2024-01-01'),
  new Date('2024-01-31')
);

// Add time to UTC timestamp
const tomorrowUtc = addDaysToUtcEpochSeconds(utcTimestamp, 1);
const nextHourUtc = addHoursToUtcEpochSeconds(utcTimestamp, 1);

// Calculate difference
const daysDiff = getDaysDifferenceUtcEpochSeconds(startUtc, endUtc);
```

## Features

- **Automatic Cache Invalidation**: All mutation hooks automatically invalidate relevant queries
- **Loading States**: Built-in loading state management with global loading context
- **Error Handling**: Consistent error handling across all hooks
- **TypeScript Support**: Full TypeScript support with proper type inference
- **Optimized Caching**: Different caching strategies for different use cases
- **Flexible Options**: Customizable enabled state and loading messages
- **UTC Time Handling**: All timestamps are properly converted to UTC for API calls

## Usage Examples

### Complete Example with UTC Time Handling

```typescript
import {
  useMoneyNoteQuery,
  useMoneyNoteMutations,
  useAlertQuery,
} from '@/hooks';
import { useToast } from '@/components/Toast';
import {
  getTodayUtcEpochRange,
  getStartOfMonthUtcEpochSeconds,
  getEndOfMonthUtcEpochSeconds,
  dateRangeToUtcEpochRange,
} from '@/utils/time';

const ExpenseComponent = () => {
  const toast = useToast();

  // Get today's range in UTC epoch seconds
  const { start: todayStart, end: todayEnd } = getTodayUtcEpochRange();

  // Get current month range in UTC epoch seconds
  const monthStart = getStartOfMonthUtcEpochSeconds(new Date());
  const monthEnd = getEndOfMonthUtcEpochSeconds(new Date());

  // Get custom date range in UTC epoch seconds
  const { start: customStart, end: customEnd } = dateRangeToUtcEpochRange(
    new Date('2024-01-01'),
    new Date('2024-01-31')
  );

  // Fetch money notes using UTC epoch seconds
  const { data: todayExpenses, isLoading: todayLoading } =
    useMoneyNoteQueryByTimestamp(todayStart, todayEnd, {
      loadingMessage: "Loading today's expenses...",
    });

  // Fetch money notes using ISO date strings (automatically converted to UTC)
  const { data: monthExpenses, isLoading: monthLoading } = useMoneyNoteQuery({
    start_date: '2024-01-01',
    end_date: '2024-01-31',
  });

  // Fetch alerts using UTC epoch seconds
  const { data: alerts, isLoading: alertsLoading } = useAlertQuery(
    monthStart,
    monthEnd,
    { loadingMessage: 'Loading budget alerts...' }
  );

  const { create, isPending } = useMoneyNoteMutations();

  const handleAddExpense = async () => {
    try {
      await create.mutateAsync([
        {
          type: 1,
          note: 'New expense',
          amount: 100000,
          category_id: 1,
        },
      ]);
      toast.showSuccess('Expense added successfully');
    } catch (error) {
      toast.showError('Failed to add expense');
    }
  };

  if (todayLoading || monthLoading || alertsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>
        Today's Expenses (UTC: {todayStart} - {todayEnd})
      </h3>
      {todayExpenses?.data?.map((note) => (
        <div key={note.id}>
          {note.note}: {note.amount}
        </div>
      ))}

      <h3>Month's Expenses</h3>
      {monthExpenses?.data?.map((note) => (
        <div key={note.id}>
          {note.note}: {note.amount}
        </div>
      ))}

      <h3>Budget Alerts</h3>
      {alerts?.data?.map((alert) => (
        <div key={alert.id}>
          {alert.title}: {alert.threshold}
        </div>
      ))}

      <button onClick={handleAddExpense} disabled={isPending}>
        Add Expense
      </button>
    </div>
  );
};
```

### Error Handling Example

```typescript
import { useMoneyNoteQuery, useMoneyNoteMutations } from '@/hooks';
import { useToast } from '@/components/Toast';
import { getTodayUtcEpochRange } from '@/utils/time';

const ExpenseComponent = () => {
  const toast = useToast();
  const { start, end } = getTodayUtcEpochRange();

  const {
    data: moneyNotes,
    isLoading,
    error,
  } = useMoneyNoteQueryByTimestamp(start, end, {
    loadingMessage: 'Loading expenses...',
  });

  const { create, isPending } = useMoneyNoteMutations();

  const handleAddExpense = async () => {
    try {
      await create.mutateAsync([
        {
          type: 1,
          note: 'New expense',
          amount: 100000,
          category_id: 1,
        },
      ]);
      toast.showSuccess('Expense added successfully');
    } catch (error) {
      toast.showError('Failed to add expense');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {moneyNotes?.data?.map((note) => (
        <div key={note.id}>
          {note.note}: {note.amount}
        </div>
      ))}
      <button onClick={handleAddExpense} disabled={isPending}>
        Add Expense
      </button>
    </div>
  );
};
```
