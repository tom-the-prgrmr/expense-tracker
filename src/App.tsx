import Layout from '@/components/Layout/Layout';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Account from '@/pages/Account/Account';
import AddExpense from '@/pages/AddExpense/AddExpense';
import Dashboard from '@/pages/Dashboard/Dashboard';
import ExpenseCategories from '@/pages/ExpenseCategories/ExpenseCategories';
import Reports from '@/pages/Reports/Reports';
import SetBudget from '@/pages/SetBudget/SetBudget';
import TodayExpenses from '@/pages/TodayExpenses/TodayExpenses';
import { type FC } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import './App.css';

const App: FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='/' element={<Layout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='add-expense' element={<AddExpense />} />
            <Route path='today-expenses' element={<TodayExpenses />} />
            <Route path='expense-categories' element={<ExpenseCategories />} />
            <Route path='set-budget' element={<SetBudget />} />
            <Route path='reports' element={<Reports />} />
            <Route path='account' element={<Account />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
