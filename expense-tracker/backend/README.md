# Expense Tracker Backend Documentation

## Overview
This is the backend for the Expense Tracker application. It is built using Node.js and Express, and it connects to a MySQL database to manage user expenses, budgets, and categories.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MySQL Server

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd expense-tracker/backend
   ```
3. Install the required dependencies:
   ```
   npm install
   ```

### Database Setup
1. Create a MySQL database for the application.
2. Run the SQL schema provided in `database/schema.sql` to set up the necessary tables.

### Configuration
- Update the database connection settings in `src/db.js` to match your MySQL configuration.

### Running the Application
1. Start the server:
   ```
   npm start
   ```
2. The backend will be running on `http://localhost:3000` by default.

## API Endpoints
- **Expenses**
  - `GET /api/expenses` - Retrieve all expenses
  - `POST /api/expenses` - Add a new expense
  - `DELETE /api/expenses/:id` - Delete an expense by ID

- **Budget**
  - `GET /api/budget` - Retrieve the current budget
  - `POST /api/budget` - Set a new budget

- **Categories**
  - `GET /api/categories` - Retrieve all expense categories
  - `POST /api/categories` - Add a new category

## Contributing
Feel free to submit issues or pull requests for any improvements or features you would like to see.

## License
This project is licensed under the MIT License.