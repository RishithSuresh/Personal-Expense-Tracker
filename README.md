# 💰 Enhanced Personal Expense Tracker

A comprehensive web-based expense tracking application with advanced features including budget management, financial analytics, and beautiful data visualizations.

## ✨ Features

### 🎯 Core Functionality
- **Expense Management**: Track daily expenses with categories and payment methods
- **Income Tracking**: Monitor income from multiple sources
- **Category Management**: Create custom categories with icons and colors
- **Budget Planning**: Set monthly budgets and track spending progress

### 📊 Advanced Analytics
- **Financial Health Score**: Real-time assessment of your financial wellness
- **Interactive Charts**: Pie charts, line graphs, and progress bars
- **Spending Patterns**: Analyze spending by day, category, and time periods
- **Budget vs Actual**: Visual comparison of planned vs actual spending

### 🎨 User Experience
- **Dark Theme**: Modern, eye-friendly dark interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Color Consistency**: Category colors maintained across all charts and views
- **Real-time Updates**: Live data updates without page refresh

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **JavaScript (ES6+)** - Interactive functionality
- **Chart.js** - Data visualization library

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MySQL** - Database management
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
expense-tracker/
├── expense-tracker-frontend/
│   └── src/
│       ├── index.html          # Dashboard/Home page
│       ├── expenses.html       # Expense management
│       ├── income.html         # Income tracking
│       ├── budget.html         # Budget management
│       ├── category.html       # Category management
│       ├── analytics.html      # Financial analytics
│       ├── css/
│       │   └── styles.css      # Main stylesheet
│       └── js/
│           ├── main.js         # Core functionality
│           ├── budget.js       # Budget management
│           ├── categories.js   # Category management
│           └── analytics.js    # Analytics and charts
└── expense-tracker-backend/
    ├── server.js              # Main server file
    ├── db.js                  # Database connection
    ├── package.json           # Dependencies
    └── controllers/
        ├── categories.js      # Category API endpoints
        ├── expenses.js        # Expense API endpoints
        ├── incomes.js         # Income API endpoints
        └── budgets.js         # Budget API endpoints
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd expense-tracker
   ```

2. **Set up the database**
   - Create a MySQL database named `expense_tracker_enhanced`
   - Update database credentials in `expense-tracker-backend/db.js`

3. **Install backend dependencies**
   ```bash
   cd expense-tracker-backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd expense-tracker-frontend
   npm install
   ```

## 🏃‍♂️ Running the Application

### Step 1: Start the Backend Server
```bash
cd expense-tracker-backend
node server.js
```
**Expected output:**
```
Server running on port 5000
✅ Database connected successfully to: expense_tracker_enhanced
```

### Step 2: Start the Frontend Server
Open a new terminal window:
```bash
cd expense-tracker-frontend
npm start
```
**Expected output:**
```
Serving 'src' at http://127.0.0.1:8080
```

### Step 3: Access the Application
Open your web browser and navigate to:
```
http://127.0.0.1:8080
```

## 📖 Usage Guide

### 1. Create Categories
- Navigate to **Categories** page
- Click "Add New Category"
- Choose name, icon, color, and description
- Categories will be used across all features

### 2. Add Income
- Go to **Income** page
- Click "Add Income"
- Enter amount, source, date, and description

### 3. Track Expenses
- Visit **Expenses** page
- Click "Add Expense"
- Select category, enter details, and submit

### 4. Set Budgets
- Open **Budget** page
- Click "Add New Budget"
- Choose category, set limit, and select month/year

### 5. View Analytics
- Check **Analytics** page for:
  - Financial health score
  - Spending patterns
  - Category breakdowns
  - Monthly trends

## 🎨 Customization

### Adding New Categories
Categories support:
- **15 predefined icons** (🍔, 🚗, 🏠, etc.)
- **8 preset colors** plus custom color picker
- **Custom descriptions**

### Color Consistency
- Category colors are maintained across all charts
- Pie charts, progress bars, and line graphs use category colors
- Provides visual consistency throughout the application

## 🔧 Configuration

### Database Configuration
Update `expense-tracker-backend/db.js`:
```javascript
const dbConfig = {
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'expense_tracker_enhanced'
};
```

### Port Configuration
- **Backend**: Port 5000 (configurable in `server.js`)
- **Frontend**: Port 8080 (configurable in `package.json`)

## 📊 API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/by-category` - Get expenses grouped by category
- `GET /api/expenses/time-series` - Get expenses over time

### Income
- `GET /api/incomes` - Get all income entries
- `POST /api/incomes` - Create new income
- `GET /api/incomes/by-source` - Get income grouped by source

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `GET /api/budgets/summary` - Get budget summary
- `GET /api/budgets/alerts` - Get budget alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chart.js** for beautiful data visualizations
- **Express.js** for robust backend framework
- **MySQL** for reliable data storage

## 📞 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Ensure both servers are running
3. Verify database connection
4. Create an issue in the repository

---

**Happy expense tracking! 💰📊**