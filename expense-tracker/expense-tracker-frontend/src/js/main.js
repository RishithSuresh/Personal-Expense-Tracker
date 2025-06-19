// This file contains the JavaScript code for the Expense Tracker website.
// It handles user interactions, data management, and dynamic content updates.

const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize page-specific functionality
    if (document.getElementById('expenses-section')) {
        loadExpenses();
    }
    if (document.getElementById('income-section')) {
        loadIncomes();
    }
    if (document.getElementById('categories-section')) {
        loadCategories();
    }

    // Initialize dashboard if on index page
    if (document.getElementById('total-expenses') && document.getElementById('total-income')) {
        updateDashboardTotals();
        loadDashboardCharts();
    }
});

// Function to load expenses
function loadExpenses() {
    console.log("Loading expenses...");
    fetchExpenses();
    loadExpensesChart();
}

// Income loading function
async function loadIncomesData() {
    const incomeBody = document.getElementById('income-body');
    if (!incomeBody) return;
    try {
        const res = await fetch(`${API_BASE_URL}/incomes`);
        const incomes = await res.json();
        incomeBody.innerHTML = '';
        incomes.forEach(income => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${income.date}</td>
                <td>${income.description || ''}</td>
                <td>₱${Number(income.amount).toLocaleString()}</td>
                <td>${income.source || ''}</td>
                <td>
                    <button onclick="deleteIncome(${income.id})" class="delete-btn">Delete</button>
                </td>
            `;
            incomeBody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error loading incomes:', err);
    }
}

// Function to load incomes
function loadIncomes() {
    console.log("Loading incomes...");
    loadIncomesData();
    loadIncomesChart();
}

// Load expenses time series chart
async function loadExpensesChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/expenses/time-series`);
        const data = await response.json();
        renderLineChart('expensesLineChart', data, 'Daily Expenses', '#ff4c29');
    } catch (err) {
        console.error('Error loading expenses chart:', err);
    }
}

// Load incomes time series chart
async function loadIncomesChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/incomes/time-series`);
        const data = await response.json();
        renderLineChart('incomeLineChart', data, 'Daily Income', '#1ecb4f');
    } catch (err) {
        console.error('Error loading incomes chart:', err);
    }
}

// Function to load categories
function loadCategories() {
    console.log("Loading categories...");
    fetchCategories();
}

// Update dashboard totals for expenses and income
async function updateDashboardTotals() {
    try {
        const expensesRes = await fetch(`${API_BASE_URL}/expenses/total`);
        const expensesData = await expensesRes.json();
        const totalExpensesElement = document.getElementById('total-expenses');
        if (totalExpensesElement) {
            totalExpensesElement.textContent = '₱' + Number(expensesData.total || 0).toLocaleString();
        }

        const incomesRes = await fetch(`${API_BASE_URL}/incomes/total`);
        const incomesData = await incomesRes.json();
        const totalIncomeElement = document.getElementById('total-income');
        if (totalIncomeElement) {
            totalIncomeElement.textContent = '₱' + Number(incomesData.total || 0).toLocaleString();
        }
    } catch (err) {
        console.error('Error loading dashboard totals:', err);
        const totalExpensesElement = document.getElementById('total-expenses');
        const totalIncomeElement = document.getElementById('total-income');
        if (totalExpensesElement) totalExpensesElement.textContent = '₱0';
        if (totalIncomeElement) totalIncomeElement.textContent = '₱0';
    }
}

// Load and render dashboard charts
async function loadDashboardCharts() {
    try {
        // Load categories to get colors
        const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
        const categories = await categoriesRes.json();

        // Load expenses by category
        const expensesRes = await fetch(`${API_BASE_URL}/expenses/by-category`);
        const expensesData = await expensesRes.json();
        renderPieChart('expensePieChart', expensesData, 'Expenses by Category', 'category', categories);

        // Load incomes by source (no category colors for income sources)
        const incomesRes = await fetch(`${API_BASE_URL}/incomes/by-source`);
        const incomesData = await incomesRes.json();
        renderPieChart('incomePieChart', incomesData, 'Income by Source', 'source');
    } catch (err) {
        console.error('Error loading dashboard charts:', err);
    }
}

function renderPieChart(canvasId, dataArr, chartLabel, labelKey, categories = null) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Clear any existing chart
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    if (!dataArr || dataArr.length === 0) {
        // Show "No data" message
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        const context = ctx.getContext('2d');
        context.font = '16px Arial';
        context.fillStyle = '#bfc9da';
        context.textAlign = 'center';
        context.fillText('No data available', ctx.width / 2, ctx.height / 2);
        return;
    }

    const labels = dataArr.map(item => item[labelKey] || 'Unknown');
    const data = dataArr.map(item => parseFloat(item.amount) || 0);

    // Get colors based on categories or use default colors
    let colors;
    if (categories && labelKey === 'category') {
        // Use category colors for expense charts
        colors = dataArr.map(item => {
            const category = categories.find(cat => cat.name === item[labelKey]);
            return category ? category.color : '#ff4c29'; // fallback color
        });
    } else {
        // Use default colors for income sources or when categories not available
        const defaultColors = [
            '#ff4c29', '#1ecb4f', '#2d8cff', '#f1c40f', '#9b59b6',
            '#16a085', '#e67e22', '#34495e', '#ff6b6b', '#4ecdc4'
        ];
        colors = defaultColors.slice(0, data.length);
    }

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#232733'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f5f6fa',
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ₱${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Line chart functionality for expenses and income pages
function renderLineChart(canvasId, dataArr, chartLabel, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Clear any existing chart
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    if (!dataArr || dataArr.length === 0) {
        // Show "No data" message
        const context = ctx.getContext('2d');
        context.clearRect(0, 0, ctx.width, ctx.height);
        context.font = '16px Arial';
        context.fillStyle = '#bfc9da';
        context.textAlign = 'center';
        context.fillText('No data available', ctx.width / 2, ctx.height / 2);
        return;
    }

    const labels = dataArr.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const data = dataArr.map(item => parseFloat(item.amount) || 0);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: data,
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: color,
                pointBorderColor: '#232733',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#f5f6fa'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ₱${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#bfc9da'
                    },
                    grid: {
                        color: '#3a3f4b'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#bfc9da',
                        callback: value => '₱' + value.toLocaleString()
                    },
                    grid: {
                        color: '#3a3f4b'
                    }
                }
            }
        }
    });
}

// Initialize form toggles and event listeners
document.addEventListener('DOMContentLoaded', () => {
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

            console.log('Adding expense:', { category_id, description, amount, payment_method, date });

            const response = await fetch(`${API_BASE_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_id, description, amount, payment_method, date })
            });

            const result = await response.json();
            console.log('Expense response:', result);

            if (result.message === 'Expense added') {
                alert('Expense added successfully!');
                this.reset();
                fetchExpenses();
                loadExpensesChart(); // Refresh chart after adding expense
                updateDashboardTotals(); // Update dashboard if on index page
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

            console.log('Adding income:', { date, amount, source, description });

            const response = await fetch(`${API_BASE_URL}/incomes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, amount, source, description })
            });

            const result = await response.json();
            console.log('Income response:', result);

            if (result.message === 'Income added') {
                alert('Income added successfully!');
                this.reset();
                incomeForm.style.display = 'none';
                loadIncomes();
                updateDashboardTotals(); // Update dashboard if on index page
            } else {
                alert('Failed to add income: ' + (result.error || 'Unknown error'));
            }
        });
    }

    // Delete income function
    window.deleteIncome = async function(id) {
        if (!confirm("Are you sure you want to delete this income?")) return;
        try {
            await fetch(`${API_BASE_URL}/incomes/${id}`, { method: 'DELETE' });
            loadIncomesData();
            loadIncomesChart(); // Refresh chart after deletion
        } catch (err) {
            console.error('Error deleting income:', err);
        }
    };
});

function fetchCategories() {
    fetch(`${API_BASE_URL}/categories`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('category-list');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.forEach(cat => {
                tbody.innerHTML += `
                    <tr>
                        <td>${cat.id}</td>
                        <td>${cat.name}</td>
                    </tr>
                `;
            });
        })
        .catch(err => {
            console.error('Error loading categories:', err);
        });
}

const catForm = document.getElementById('category-form');
if (catForm) {
    catForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('category_id').value;
        const name = document.getElementById('category_name').value;

        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name })
            });

            const result = await response.json();
            if (result.message === 'Category added') {
                this.reset();
                loadCategories();
            } else {
                alert('Failed to add category: ' + (result.error || 'Unknown error'));
            }
        } catch (err) {
            console.error('Error adding category:', err);
            alert('An error occurred while adding the category.');
        }
    });
}

function fetchExpenses() {
    fetch(`${API_BASE_URL}/expenses`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('expenses-body');
            if (!tbody) return;
            tbody.innerHTML = '';
            data.forEach(exp => {
                tbody.innerHTML += `
                    <tr>
                        <td>${exp.date}</td>
                        <td>${exp.description}</td>
                        <td>${exp.category_name || exp.category_id}</td>
                        <td>₱${Number(exp.amount).toLocaleString()}</td>
                        <td>${exp.payment_method}</td>
                        <td>
                            <button onclick="deleteExpense(${exp.id})" class="delete-btn">Delete</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => {
            console.error('Error loading expenses:', err);
        });
}

// Delete expense function
function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(result => {
        if (result.message === 'Expense deleted') {
            fetchExpenses(); // Refresh table
            loadExpensesChart(); // Refresh chart
            updateDashboardTotals(); // Update dashboard if on index page
        } else {
            alert('Failed to delete expense: ' + (result.error || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error('Delete failed:', err);
        alert('An error occurred while deleting the expense.');
    });
}

// Additional initialization for specific pages
document.addEventListener('DOMContentLoaded', function() {
    // This ensures expenses are loaded if we're on the expenses page
    if (document.getElementById('expenses-section')) {
        fetchExpenses();
    }
});

