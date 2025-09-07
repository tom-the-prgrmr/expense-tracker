import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import './App.css';
import Layout from './components/Layout/Layout';
import Account from './pages/Account/Account';
import AddExpense from './pages/AddExpense/AddExpense';
import Dashboard from './pages/Dashboard/Dashboard';
import Reports from './pages/Reports/Reports';
import SetBudget from './pages/SetBudget/SetBudget';
import TodayExpenses from './pages/TodayExpenses/TodayExpenses';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/' element={<Layout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='add-expense' element={<AddExpense />} />
          <Route path='set-budget' element={<SetBudget />} />
          <Route path='today-expenses' element={<TodayExpenses />} />
          <Route path='reports' element={<Reports />} />
          <Route path='account' element={<Account />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
