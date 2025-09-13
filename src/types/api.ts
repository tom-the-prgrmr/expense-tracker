// Shared API types

export type ISODateString = string; // e.g., '2025-09-09'
export type EpochSeconds = number; // e.g., 1757339265

// Generic API response wrapper used by the backend
export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
}

// GET /api/v1/money-note request query params
export interface MoneyNotesQuery {
  start_date: EpochSeconds; // YYYY-MM-DD (local date)
  end_date: EpochSeconds; // YYYY-MM-DD (local date)
}

// Money note entity from the backend
export interface MoneyNoteDto {
  id: number;
  note: string;
  date: EpochSeconds;
  amount: number; // positive amount; type indicates expense/income
  type: number; // 1=expense, 2=income (assumed)
  category_id: number;
  status: number;
  created_at: EpochSeconds;
  updated_at: EpochSeconds;
}

// GET /api/v1/money-note response
export type MoneyNotesResponse = ApiSuccessResponse<MoneyNoteDto[]>;

// Category entity from the backend
export interface CategoryDto {
  id: number;
  name: string;
  type: number; // 1=expense, 2=income (assumed)
  status: number;
  created_at: EpochSeconds;
  updated_at: EpochSeconds;
}

// GET /api/v1/category response
export type CategoriesResponse = ApiSuccessResponse<CategoryDto[]>;

// Budget entity from the backend
export interface BudgetDto {
  id: number;
  category_id: number;
  amount: number; // budget limit amount
  period_type: number; // 1=daily, 2=weekly, 3=monthly, 4=yearly
  start_date: EpochSeconds;
  end_date: EpochSeconds;
  status: number; // 1=inactive, 2=active
  created_at: EpochSeconds;
  updated_at: EpochSeconds;
}

// Budget with category information
export interface BudgetWithCategory extends BudgetDto {
  category_name: string;
  spent_amount: number; // calculated spent amount for the period
  remaining_amount: number; // calculated remaining amount
  percentage_used: number; // calculated percentage used
}

// GET /api/v1/budget response
export type BudgetsResponse = ApiSuccessResponse<BudgetWithCategory[]>;

// POST /api/v1/budget request
export interface CreateBudgetRequest {
  category_id: number;
  amount: number;
  period_type: number;
  start_date: ISODateString;
  end_date: ISODateString;
}

// PUT /api/v1/budget/{id} request
export interface UpdateBudgetRequest {
  category_id: number;
  amount: number;
  period_type: number;
  start_date: ISODateString;
  end_date: ISODateString;
  status: number;
}

// Alert/Budget Alert entity from the backend
export interface AlertDto {
  id: number;
  title: string;
  start_date: EpochSeconds;
  end_date: EpochSeconds;
  threshold: number;
  type: number; // 1=daily, 2=monthly, 3=yearly
  category_id: number;
  status: number; // 1=inactive, 2=active
  created_at: EpochSeconds;
  updated_at: EpochSeconds;
}

// GET /api/v1/alert response
export type AlertsResponse = ApiSuccessResponse<AlertDto[]>;

// POST /api/v1/alert/{id} request
export interface UpdateAlertRequest {
  title: string;
  amount: number; // threshold amount
  status: number;
}
