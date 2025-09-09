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
  start_date: ISODateString; // YYYY-MM-DD (local date)
  end_date: ISODateString; // YYYY-MM-DD (local date)
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
