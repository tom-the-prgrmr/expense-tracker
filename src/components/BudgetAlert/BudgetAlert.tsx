import { useToast } from '@/components/Toast/useToast';
import { type BudgetWithCategory } from '@/types/api';
import { type FC, useEffect, useState } from 'react';

interface BudgetAlertProps {
  budgets: BudgetWithCategory[];
}

const BudgetAlert: FC<BudgetAlertProps> = ({ budgets }) => {
  const toast = useToast();
  const [shownAlerts, setShownAlerts] = useState<Set<number>>(new Set());

  useEffect(() => {
    budgets.forEach((budget) => {
      const budgetId = budget.id;

      // Skip if already shown alert for this budget
      if (shownAlerts.has(budgetId)) {
        return;
      }

      const percentage = budget.percentage_used;

      // Show different alerts based on budget usage
      if (percentage >= 100) {
        toast.showError(
          `⚠️ Vượt quá hạn mức! Danh mục "${
            budget.category_name
          }" đã vượt quá hạn mức ${budget.amount.toLocaleString(
            'vi-VN'
          )}₫. Đã chi: ${budget.spent_amount.toLocaleString('vi-VN')}₫`
        );
        setShownAlerts((prev) => new Set(prev).add(budgetId));
      } else if (percentage >= 90) {
        toast.showError(
          `🚨 Cảnh báo hạn mức! Danh mục "${
            budget.category_name
          }" đã sử dụng ${percentage.toFixed(
            1
          )}% hạn mức. Còn lại: ${budget.remaining_amount.toLocaleString(
            'vi-VN'
          )}₫`
        );
        setShownAlerts((prev) => new Set(prev).add(budgetId));
      } else if (percentage >= 80) {
        toast.showError(
          `⚠️ Gần đạt hạn mức! Danh mục "${
            budget.category_name
          }" đã sử dụng ${percentage.toFixed(
            1
          )}% hạn mức. Còn lại: ${budget.remaining_amount.toLocaleString(
            'vi-VN'
          )}₫`
        );
        setShownAlerts((prev) => new Set(prev).add(budgetId));
      }
    });
  }, [budgets, toast, shownAlerts]);

  // Reset shown alerts when budgets change (e.g., new budget added)
  useEffect(() => {
    const currentBudgetIds = new Set(budgets.map((b) => b.id));
    setShownAlerts((prev) => {
      const newSet = new Set<number>();
      prev.forEach((id) => {
        if (currentBudgetIds.has(id)) {
          newSet.add(id);
        }
      });
      return newSet;
    });
  }, [budgets]);

  return null; // This component doesn't render anything visible
};

export default BudgetAlert;
