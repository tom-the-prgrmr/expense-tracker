# Expense Tracker

A modern, responsive expense tracking application built with React, TypeScript, and Vite. This application helps you manage your personal finances by tracking expenses, setting budgets, and generating reports.

## Features

- **Dashboard**: Overview of your financial status with charts and summaries
- **Add Expenses**: Record new expenses with categories and descriptions
- **Today's Expenses**: View and manage today's spending
- **Expense Categories**: Organize and manage expense categories
- **Budget Management**: Set and track spending budgets
- **Reports**: Generate detailed financial reports and analytics
- **Account Management**: Manage your account settings
- **Dark/Light Theme**: Toggle between dark and light themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Charts**: Custom chart components
- **Icons**: Custom icon system

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)

You can check your versions by running:

```bash
node --version
npm --version
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code quality issues

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/         # Button component
│   ├── Charts/         # Chart components (PieChart, RadialProgress)
│   ├── DataTable/      # Data table component
│   ├── Form/           # Form components (DatePicker, Dropdown, TextInput)
│   ├── Layout/         # Layout components
│   ├── Pagination/     # Pagination component
│   ├── Sidebar/        # Sidebar navigation
│   └── Toast/          # Toast notification system
├── pages/              # Page components
│   ├── Dashboard/      # Main dashboard
│   ├── AddExpense/     # Add expense form
│   ├── TodayExpenses/  # Today's expenses view
│   ├── ExpenseCategories/ # Category management
│   ├── SetBudget/      # Budget setting
│   ├── Reports/        # Financial reports
│   └── Account/        # Account settings
├── hooks/              # Custom React hooks
├── contexts/           # React contexts (Theme, GlobalLoading)
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── config/             # Configuration files
```

## Development

The application uses:

- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **React Router** for navigation
- **ESLint** for code linting

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build locally with:

```bash
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
