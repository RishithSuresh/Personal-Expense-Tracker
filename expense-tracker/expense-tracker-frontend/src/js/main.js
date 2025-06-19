// This file contains the JavaScript code for the Expense Tracker website.
// It handles user interactions, data management, and dynamic content updates.

document.addEventListener('DOMContentLoaded', () => {
    // Call functions to load expenses, income, or categories as needed
    if (document.getElementById('expenses-section')) {
        loadExpenses();
    }
    if (document.getElementById('income-section')) {
        loadIncomes();
    }
    if (document.getElementById('categories-section')) {
        loadCategories();
    }
});

// Function to load expenses
function loadExpenses() {
    console.log("Loading expenses...");
    fetchExpenses();
}


// Function to load incomes
function loadIncomes() {
    console.log("Loading incomes...");
    fetchIncomes();
}

// Function to load categories
function loadCategories() {
    // Placeholder for loading categories logic
    console.log("Loading categories...");
}

// Function to add a new expense
function addExpense(expense) {
    // Placeholder for adding expense logic
    console.log("Adding expense:", expense);
}

// Function to add a new income
function addIncome(income) {
    // Placeholder for adding an income logic
    console.log("Adding income:", income);
}

// Example: Replace these with real data from localStorage or your backend
const budget = localStorage.getItem('budget') || 0;
const income = localStorage.getItem('income') || 0;
const expenses = localStorage.getItem('expenses') || 0;

// Display values on the homepage
if (document.getElementById('current-budget')) {
    document.getElementById('current-budget').textContent = `₱${Number(budget).toLocaleString()}`;
}
if (document.getElementById('total-income')) {
    document.getElementById('total-income').textContent = `₱${Number(income).toLocaleString()}`;
}
if (document.getElementById('total-expenses')) {
    document.getElementById('total-expenses').textContent = `₱${Number(expenses).toLocaleString()}`;
}

// Draw the chart if on the homepage
if (document.getElementById('financeChart')) {
    const ctx = document.getElementById('financeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Budget', 'Income', 'Expenses'],
            datasets: [{
                label: 'Amount (₱)',
                data: [budget, income, expenses],
                backgroundColor: [
                    '#2d6cdf',
                    '#4caf50',
                    '#e74c3c'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '₱' + value.toLocaleString()
                    }
                }
            }
        }
    });
}

function getCategoryData(key) {
    // Returns [{category: "Food", amount: 1000}, ...] or []
    return JSON.parse(localStorage.getItem(key)) || [];
}

function renderPieChart(canvasId, dataArr, chartLabel) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const labels = dataArr.map(item => item.category);
    const data = dataArr.map(item => item.amount);
    const colors = [
        '#2d6cdf', '#4caf50', '#e74c3c', '#f1c40f', '#9b59b6', '#16a085', '#e67e22', '#34495e'
    ];
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: data,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Render pie charts if on homepage
    renderPieChart('budgetPieChart', getCategoryData('budgetCategories'), 'Budget');
    renderPieChart('incomePieChart', getCategoryData('incomeCategories'), 'Income');
    renderPieChart('expensePieChart', getCategoryData('expenseCategories'), 'Expenses');

    // Toggle expense form
    const showBtn = document.getElementById('show-expense-form');
    const form = document.getElementById('expense-form');
    if (showBtn && form) {
        showBtn.addEventListener('click', () => {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Show/hide budget form
    const showBtnBudget = document.getElementById('show-budget-form');
    const formBudget = document.getElementById('budget-form');
    if (showBtnBudget && formBudget) {
        showBtnBudget.addEventListener('click', () => {
            formBudget.style.display = formBudget.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Handle budget form submission
    const budgetsRow = document.getElementById('budgets-row');
    if (formBudget && budgetsRow) {
        formBudget.addEventListener('submit', function(e) {
            e.preventDefault();
            const category = document.getElementById('budget-category').value;
            const limit = document.getElementById('budget-limit').value;
            const spent = document.getElementById('budget-spent').value;

            // Create card
            const card = document.createElement('div');
            card.className = 'budget-card';
            card.innerHTML = `
                <strong>${category}</strong>
                <table class="budget-table">
                    <tr>
                        <td>Limit:</td>
                        <td class="budget-limit">₹${Number(limit).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Spent:</td>
                        <td class="budget-spent">₹${Number(spent).toLocaleString()}</td>
                    </tr>
                </table>
            `;
            budgetsRow.appendChild(card);

            // Optionally clear form and hide
            formBudget.reset();
            formBudget.style.display = 'none';
        });
    }

    // Handle expense form submission
    const expenseForm = document.getElementById('expense-form');
    const expensesTableBody = document.querySelector('#expenses-table tbody');
    if (expenseForm && expensesTableBody) {
        expenseForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const category_id = document.getElementById('category_id').value;
            const description = document.getElementById('description').value;
            const amount = document.getElementById('amount').value;
            const payment_method = document.getElementById('payment').value;
            const date = document.getElementById('date').value;

            const response = await fetch('http://localhost:5000/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_id, description, amount, payment_method, date })
            });

            const result = await response.json();
            if (result.message === 'Expense added') {
                this.reset();
                fetchExpenses();
            } else {
                alert('Failed to add expense: ' + (result.error || 'Unknown error'));
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-expense-btn')) {
            e.target.closest('tr').remove();
        }
    });

    // Add Category functionality
    const addCategoryBtn = document.getElementById('add-category');
    const newCategoryInput = document.getElementById('new-category');
    const categoryList = document.getElementById('category-list');

    if (addCategoryBtn && newCategoryInput && categoryList) {
        addCategoryBtn.addEventListener('click', function () {
            const value = newCategoryInput.value.trim();
            if (value) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
                categoryList.appendChild(tr);
                newCategoryInput.value = '';
            }
        });
    }

    // --- Income Section Logic ---

    const showIncomeFormBtn = document.getElementById('show-income-form');
    const incomeForm = document.getElementById('income-form');
    if (showIncomeFormBtn && incomeForm) {
        showIncomeFormBtn.addEventListener('click', () => {
            incomeForm.style.display = 'block';
        });
    }

    if (incomeForm) {
        incomeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const date = document.getElementById('income-date').value;
            const amount = document.getElementById('income-amount').value;
            const source = document.getElementById('income-source').value;
            const description = document.getElementById('income-description').value;

            await fetch('http://localhost:5000/api/incomes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, amount, source, description })
            });
            this.reset();
            incomeForm.style.display = 'none';
            loadIncomes();
        });
    }

    async function loadIncomes() {
        const incomeBody = document.getElementById('income-body');
        if (!incomeBody) return;
        const res = await fetch('http://localhost:5000/api/incomes');
        const incomes = await res.json();
        incomeBody.innerHTML = '';
        incomes.forEach(income => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${income.date}</td>
                <td>${income.description || ''}</td>
                <td>${income.amount}</td>
                <td>${income.source || ''}</td>
                <td>
                    <button onclick="deleteIncome(${income.id})" class="delete-btn">Delete</button>
                </td>
            `;
            incomeBody.appendChild(tr);
        });
    }

    window.deleteIncome = async function(id) {
        await fetch(`http://localhost:5000/api/incomes/${id}`, { method: 'DELETE' });
        loadIncomes();
    };

    window.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('income-section')) {
            loadIncomes();
        }
    });
});

const API_URL = 'http://localhost:5000/api/categories';

function fetchCategories() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('category-list');
            tbody.innerHTML = '';
            data.forEach(cat => {
                tbody.innerHTML += `
                    <tr>
                        <td>${cat.id}</td>
                        <td>${cat.name}</td>
                    </tr>
                `;
            });
        });
}

document.getElementById('category-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('category_id').value;
    const name = document.getElementById('category_name').value;
    await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
    });
    this.reset();
    loadCategories();
});

function fetchExpenses() {
    fetch('http://localhost:5000/api/expenses')
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('expenses-body');
            tbody.innerHTML = '';
            data.forEach(exp => {
                tbody.innerHTML += `
                    <tr>
                        <td>${exp.date}</td>
                        <td>${exp.description}</td>
                        <td>${exp.category_id}</td>
                        <td>${exp.amount}</td>
                        <td>${exp.payment_method}</td>
                        <td>
                            <button onclick="deleteExpense(${exp.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function showSection(sectionId) {
    document.getElementById('expenses-section').style.display = 'none';
    document.getElementById('budget-section').style.display = 'none';
    document.getElementById('categories-section').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

// Navigation event listeners
document.getElementById('nav-expenses').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('expenses-section');
    fetchExpenses();
});
document.getElementById('nav-budget').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('budget-section');
    // fetchBudget(); // if you have a function for budget
});
document.getElementById('nav-categories').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('categories-section');
    // fetchCategories(); // if you have a function for categories
});

// Show expenses section by default on page load
showSection('expenses-section');
fetchExpenses();

document.addEventListener('DOMContentLoaded', function() {
    fetchExpenses();
});

function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(result => {
        if (result.message === 'Expense deleted') {
            fetchExpenses(); // Refresh table
        } else {
            alert('Failed to delete expense: ' + (result.error || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error('Delete failed:', err);
        alert('An error occurred while deleting the expense.');
    });
}

// --- Budget Section Logic ---

// Fetch categories for the budget form dropdown
async function populateBudgetCategories() {
    const select = document.getElementById('budget-category');
    if (!select) return;
    select.innerHTML = '<option value="">Select a category</option>';
    try {
        const res = await fetch('http://localhost:5000/api/categories');
        const categories = await res.json();
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (err) {
        select.innerHTML = '<option value="">No categories found</option>';
    }
}

// Call this on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('budget-category')) {
        populateBudgetCategories();
    }
});

// Fetch and display budgets
async function fetchBudgets() {
    const userId = 1; // Replace with actual user ID if you have authentication
    const res = await fetch(`http://localhost:5000/api/budgets/${userId}`);
    const budgets = await res.json();
    const budgetsRow = document.getElementById('budgets-row');
    if (budgetsRow) {
        budgetsRow.innerHTML = '';
        budgets.forEach(budget => {
            const card = document.createElement('div');
            card.className = 'budget-card';
            card.innerHTML = `
                <strong>${budget.category_name}</strong>
                <table class="budget-table">
                    <tr>
                        <td>Limit:</td>
                        <td class="budget-limit">₱${Number(budget.limit_amount).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Spent:</td>
                        <td class="budget-spent">₱${Number(budget.spent_amount).toLocaleString()}</td>
                    </tr>
                </table>
                <button class="delete-budget-btn" data-id="${budget.id}">Delete</button>
            `;
            budgetsRow.appendChild(card);
        });
    }
}

// Handle budget form submission
const formBudget = document.getElementById('budget-form');
if (formBudget) {
    formBudget.addEventListener('submit', async function(e) {
        e.preventDefault();
        const category_id = document.getElementById('budget-category').value;
        const limit_amount = document.getElementById('budget-limit').value;
        const spent_amount = document.getElementById('budget-spent').value || 0;
        const user_id = 1; // Replace with actual user ID if you have authentication

        const response = await fetch('http://localhost:5000/api/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category_id, limit_amount, spent_amount, user_id })
        });

        const result = await response.json();
        if (result.message === 'Budget added') {
            this.reset();
            formBudget.style.display = 'none';
            fetchBudgets();
        } else {
            alert('Failed to add budget: ' + (result.error || 'Unknown error'));
        }
    });
}

// Show/hide budget form
const showBtnBudget = document.getElementById('show-budget-form');
if (showBtnBudget && formBudget) {
    showBtnBudget.addEventListener('click', () => {
        formBudget.style.display = formBudget.style.display === 'none' ? 'block' : 'none';
        populateBudgetCategories();
    });
}

// Delete budget
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('delete-budget-btn')) {
        const id = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this budget?')) {
            await fetch(`http://localhost:5000/api/budgets/${id}`, { method: 'DELETE' });
            fetchBudgets();
        }
    }
});

// On budget page load, fetch budgets and categories
if (document.getElementById('budgets-row')) {
    fetchBudgets();
    populateBudgetCategories();
}

// Update dashboard totals for expenses and income
async function updateDashboardTotals() {
    try {
        const expensesRes = await fetch('http://localhost:5000/api/expenses/total');
        const expensesData = await expensesRes.json();
        document.getElementById('total-expenses').textContent =
            '₱' + Number(expensesData.total || 0).toLocaleString();

        const incomesRes = await fetch('http://localhost:5000/api/incomes/total');
        const incomesData = await incomesRes.json();
        document.getElementById('total-income').textContent =
            '₱' + Number(incomesData.total || 0).toLocaleString();
    } catch (err) {
        document.getElementById('total-expenses').textContent = '₱0';
        document.getElementById('total-income').textContent = '₱0';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('total-expenses') && document.getElementById('total-income')) {
        updateDashboardTotals();
    }
});
