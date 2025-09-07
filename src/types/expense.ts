export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface DashboardStats {
  totalExpenses: number;
  monthlyExpenses: number;
  categoryBreakdown: CategoryBreakdown[];
  recentExpenses: Expense[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  amount: number;
}
