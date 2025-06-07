# Expense Tracker

This project is a personal Expense Tracker application that allows users to manage their income and expenditures effectively. It consists of a frontend built with HTML, CSS, and JavaScript, and a backend powered by Node.js and Express, connected to a MySQL database.

## Project Structure

The project is organized into the following main directories:

- **frontend**: Contains all the client-side code.
  - **public**: Holds the HTML files for different pages of the application.
    - `index.html`: The main entry point of the application.
    - `expenses.html`: Displays and manages expenses.
    - `budget.html`: Allows users to set and view their budget.
    - `category.html`: Manages different categories of expenses.
  - **css**: Contains styles for the application.
    - `styles.css`: The main stylesheet for the frontend.
  - **js**: Contains JavaScript files for handling frontend logic.
    - `main.js`: Main JavaScript logic for the application.
    - `expenses.js`: Functions specific to the expenses page.
    - `budget.js`: Functions specific to the budget page.
    - `category.js`: Functions specific to the category page.
  - `README.md`: Documentation for the frontend part of the project.

- **backend**: Contains all the server-side code.
  - **src**: Holds the main application files.
    - `app.js`: Entry point of the backend application.
    - `db.js`: Handles MySQL database connection.
    - **routes**: Contains route definitions for the application.
      - `expenses.js`: Routes related to expenses.
      - `budget.js`: Routes related to budget management.
      - `category.js`: Routes related to expense categories.
    - **controllers**: Contains logic for handling requests.
      - `expensesController.js`: Logic for expenses.
      - `budgetController.js`: Logic for budget management.
      - `categoryController.js`: Logic for expense categories.
  - `package.json`: Configuration file for npm in the backend.
  - `README.md`: Documentation for the backend part of the project.

- **database**: Contains the SQL schema for the MySQL database.
  - `schema.sql`: SQL schema for setting up the database.

- **root**: Contains overall documentation for the entire project.
  - `README.md`: Overview and documentation for the project.

## Features

- Users can add, view, and manage their expenses.
- Users can set and track their budget.
- Users can categorize their expenses for better management.
- Data is stored in a MySQL database, ensuring persistence.
- Visual representation of income and expenditure through charts on the main page.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Set up the MySQL database using the `schema.sql` file located in the `database` directory.

4. Start the backend server:
   ```
   node src/app.js
   ```

5. Navigate to the frontend directory and open `public/index.html` in a web browser to access the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.