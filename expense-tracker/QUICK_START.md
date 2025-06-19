# 🚀 Quick Start Guide - Enhanced Personal Expense Tracker

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- ✅ **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- ✅ **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- ✅ **Git** (for cloning) - [Download here](https://git-scm.com/)

## 🗄️ Database Setup

### Step 1: Create Database
1. **Open MySQL Command Line** or **MySQL Workbench**
2. **Create the database**:
   ```sql
   CREATE DATABASE expense_tracker_enhanced;
   ```
3. **Verify creation**:
   ```sql
   SHOW DATABASES;
   ```

### Step 2: Configure Database Connection
1. **Navigate to**: `expense-tracker-backend/db.js`
2. **Update credentials**:
   ```javascript
   const dbConfig = {
       host: 'localhost',
       user: 'your_mysql_username',     // Usually 'root'
       password: 'your_mysql_password', // Your MySQL password
       database: 'expense_tracker_enhanced'
   };
   ```

## 💻 Installation Commands

### Step 1: Clone and Navigate
```bash
# Clone the repository
git clone <your-repository-url>
cd expense-tracker
```

### Step 2: Install Backend Dependencies
```bash
# Navigate to backend folder
cd expense-tracker-backend

# Install dependencies
npm install
```

### Step 3: Install Frontend Dependencies
```bash
# Navigate to frontend folder (from project root)
cd expense-tracker-frontend

# Install dependencies
npm install
```

## 🏃‍♂️ Running the Application

### Terminal 1: Start Backend Server
```bash
# Navigate to backend directory
cd expense-tracker-backend

# Start the server
node server.js
```

**✅ Success indicators:**
```
Server running on port 5000
✅ Database connected successfully to: expense_tracker_enhanced
```

**❌ If you see errors:**
- Check MySQL is running
- Verify database credentials in `db.js`
- Ensure database `expense_tracker_enhanced` exists

### Terminal 2: Start Frontend Server
**Open a NEW terminal window:**
```bash
# Navigate to frontend directory
cd expense-tracker-frontend

# Start the development server
npm start
```

**✅ Success indicators:**
```
Serving 'src' at http://127.0.0.1:8080
```

### Step 3: Access Application
**Open your web browser and go to:**
```
http://127.0.0.1:8080
```

## 🎯 First-Time Usage

### 1. Create Your First Category
1. **Click** "Categories" in navigation
2. **Click** "Add New Category"
3. **Fill out**:
   - Name: "Food"
   - Icon: 🍔 Food & Dining
   - Color: Red (#ff4c29)
   - Description: "Food and dining expenses"
4. **Click** "Create Category"

### 2. Add Income
1. **Click** "Income" in navigation
2. **Click** "Add Income"
3. **Fill out**:
   - Date: Today's date
   - Amount: 3000
   - Source: "Salary"
   - Description: "Monthly salary"
4. **Click** "Add Income"

### 3. Add Expense
1. **Click** "Expenses" in navigation
2. **Click** "Add Expense"
3. **Fill out**:
   - Category: Food (from dropdown)
   - Description: "Lunch"
   - Amount: 25
   - Payment Method: "Credit Card"
   - Date: Today's date
4. **Click** "Add Expense"

### 4. Set Budget
1. **Click** "Budget" in navigation
2. **Click** "Add New Budget"
3. **Fill out**:
   - Category: Food
   - Budget Limit: 400
   - Month: Current month
   - Year: Current year
4. **Click** "Create Budget"

### 5. View Analytics
1. **Click** "Analytics" in navigation
2. **Explore**:
   - Financial health score
   - Spending charts
   - Category breakdowns

## 🔧 Troubleshooting

### Backend Won't Start
**Error**: `Database connection failed`
**Solution**:
1. Check MySQL is running
2. Verify credentials in `expense-tracker-backend/db.js`
3. Ensure database exists: `CREATE DATABASE expense_tracker_enhanced;`

### Frontend Won't Start
**Error**: `npm start` fails
**Solution**:
1. Run `npm install` in `expense-tracker-frontend`
2. Check Node.js version: `node --version` (should be v14+)

### Can't Access Application
**Error**: Browser shows "This site can't be reached"
**Solution**:
1. Ensure frontend server is running on port 8080
2. Try: `http://localhost:8080` instead of `127.0.0.1:8080`

### Categories/Forms Not Working
**Error**: JavaScript errors in browser console
**Solution**:
1. Ensure backend is running on port 5000
2. Check browser console (F12) for specific errors
3. Verify both servers are running simultaneously

## 📱 Browser Compatibility

**Recommended browsers:**
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 🎉 You're Ready!

Once both servers are running and you can access `http://127.0.0.1:8080`, you're all set!

**Next steps:**
1. Create categories for your spending
2. Add your income sources
3. Start tracking expenses
4. Set monthly budgets
5. Monitor your financial health

**Need help?** Check the main README.md for detailed documentation and API references.

---

**Happy expense tracking! 💰📊**
