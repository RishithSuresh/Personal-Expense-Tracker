// Budget Management JavaScript

// API_BASE_URL is defined in main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Budget page DOM loaded');
    initializeBudgetPage();
});

async function initializeBudgetPage() {
    try {
        console.log('Initializing budget page...');
        await loadBudgetSummary();
        await loadBudgetAlerts();
        await loadBudgets();
        await populateBudgetCategories();
        setupBudgetEventListeners();
        setCurrentMonthYear();
        console.log('Budget page initialized successfully');
    } catch (error) {
        console.error('Error initializing budget page:', error);
    }
}

// Load budget summary data
async function loadBudgetSummary() {
    try {
        console.log('Loading budget summary...');
        const response = await fetch(`${API_BASE_URL}/budgets/summary`);
        const data = await response.json();
        console.log('Budget summary data:', data);

        const totalBudgetEl = document.getElementById('total-budget');
        const totalSpentEl = document.getElementById('total-spent');
        const totalRemainingEl = document.getElementById('total-remaining');
        const avgUsageEl = document.getElementById('avg-usage');

        if (totalBudgetEl) totalBudgetEl.textContent = '₱' + Number(data.total_budget_amount || 0).toLocaleString();
        if (totalSpentEl) totalSpentEl.textContent = '₱' + Number(data.total_spent || 0).toLocaleString();
        if (totalRemainingEl) totalRemainingEl.textContent = '₱' + Number(data.total_remaining || 0).toLocaleString();
        if (avgUsageEl) avgUsageEl.textContent = (data.avg_usage_percentage || 0) + '%';

        console.log('Budget summary updated successfully');
    } catch (err) {
        console.error('Error loading budget summary:', err);
        // Set default values on error
        const totalBudgetEl = document.getElementById('total-budget');
        const totalSpentEl = document.getElementById('total-spent');
        const totalRemainingEl = document.getElementById('total-remaining');
        const avgUsageEl = document.getElementById('avg-usage');

        if (totalBudgetEl) totalBudgetEl.textContent = '₱0';
        if (totalSpentEl) totalSpentEl.textContent = '₱0';
        if (totalRemainingEl) totalRemainingEl.textContent = '₱0';
        if (avgUsageEl) avgUsageEl.textContent = '0%';
    }
}

// Load budget alerts
async function loadBudgetAlerts() {
    try {
        console.log('Loading budget alerts...');
        const response = await fetch(`${API_BASE_URL}/budgets/alerts`);
        const alerts = await response.json();
        console.log('Budget alerts data:', alerts);

        const alertsSection = document.getElementById('budget-alerts-section');
        const alertsContainer = document.getElementById('budget-alerts');

        if (!alertsSection || !alertsContainer) {
            console.log('Budget alerts elements not found, skipping...');
            return;
        }

        if (alerts && alerts.length > 0) {
            alertsSection.style.display = 'block';
            alertsContainer.innerHTML = '';

            alerts.forEach(alert => {
                const alertCard = document.createElement('div');
                alertCard.className = 'alert-card';
                alertCard.innerHTML = `
                    <div class="alert-content">
                        <strong>${alert.category_name}</strong>
                        <p>Budget: ₱${Number(alert.limit_amount).toLocaleString()}</p>
                        <p>Spent: ₱${Number(alert.spent_amount).toLocaleString()}</p>
                        <p class="alert-percentage">${alert.percentage_used}% used</p>
                    </div>
                `;
                alertsContainer.appendChild(alertCard);
            });
            console.log('Budget alerts displayed successfully');
        } else {
            alertsSection.style.display = 'none';
            console.log('No budget alerts to display');
        }
    } catch (err) {
        console.error('Error loading budget alerts:', err);
        const alertsSection = document.getElementById('budget-alerts-section');
        if (alertsSection) {
            alertsSection.style.display = 'none';
        }
    }
}

// Load and display budgets
async function loadBudgets() {
    try {
        console.log('Loading budgets from:', `${API_BASE_URL}/budgets`);

        // Load categories and budgets in parallel
        const [budgetsRes, categoriesRes] = await Promise.all([
            fetch(`${API_BASE_URL}/budgets`),
            fetch(`${API_BASE_URL}/categories`)
        ]);

        const budgets = await budgetsRes.json();
        const categories = await categoriesRes.json();
        console.log('Budgets loaded:', budgets);

        const container = document.getElementById('budget-cards-container');
        if (!container) {
            console.error('Budget cards container not found!');
            return;
        }

        container.innerHTML = '';

        if (!budgets || budgets.length === 0) {
            container.innerHTML = '<p class="no-data">No budgets set for this month. Create your first budget!</p>';
            return;
        }

        budgets.forEach(budget => {
            const budgetCard = createBudgetCard(budget, categories);
            container.appendChild(budgetCard);
        });

        // Create budget chart
        await createBudgetChart(budgets);
        console.log('Budgets displayed successfully');
    } catch (err) {
        console.error('Error loading budgets:', err);
        const container = document.getElementById('budget-cards-container');
        if (container) {
            container.innerHTML = '<p class="no-data error">Error loading budgets. Check console for details.</p>';
        }
    }
}

// Create budget card element
function createBudgetCard(budget, categories = []) {
    const card = document.createElement('div');
    card.className = 'budget-card';

    const percentage = budget.percentage_used || 0;
    const statusClass = percentage >= 100 ? 'over-budget' :
                       percentage >= 80 ? 'warning' : 'good';

    // Get category color
    const category = categories.find(cat => cat.name === budget.category_name);
    const categoryColor = category ? category.color : '#2d8cff';

    card.innerHTML = `
        <div class="budget-card-header">
            <h4>${budget.category_name}</h4>
            <button class="delete-budget-btn" onclick="deleteBudget(${budget.id})">×</button>
        </div>
        <div class="budget-progress">
            <div class="progress-bar">
                <div class="progress-fill ${statusClass}" style="width: ${Math.min(percentage, 100)}%; background-color: ${categoryColor};"></div>
            </div>
            <span class="progress-text">${percentage}%</span>
        </div>
        <div class="budget-details">
            <div class="budget-row">
                <span>Budget:</span>
                <span>₱${Number(budget.limit_amount).toLocaleString()}</span>
            </div>
            <div class="budget-row">
                <span>Spent:</span>
                <span>₱${Number(budget.spent_amount || 0).toLocaleString()}</span>
            </div>
            <div class="budget-row">
                <span>Remaining:</span>
                <span class="${budget.remaining_amount >= 0 ? 'positive' : 'negative'}">
                    ₱${Number(budget.remaining_amount || 0).toLocaleString()}
                </span>
            </div>
        </div>
        <div class="budget-actions">
            <button class="edit-budget-btn" onclick="editBudget(${budget.id}, ${budget.limit_amount})">
                Edit Limit
            </button>
        </div>
    `;
    
    return card;
}

// Create budget chart with category colors
async function createBudgetChart(budgets) {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;

    // Clear existing chart
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    try {
        // Load categories to get colors
        const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
        const categories = await categoriesRes.json();

        const labels = budgets.map(b => b.category_name);
        const budgetData = budgets.map(b => Number(b.limit_amount));
        const spentData = budgets.map(b => Number(b.spent_amount || 0));

        // Get category colors for spent data
        const spentColors = budgets.map(budget => {
            const category = categories.find(cat => cat.name === budget.category_name);
            return category ? category.color : '#ff4c29';
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Budget',
                        data: budgetData,
                        backgroundColor: '#2d8cff',
                        borderColor: '#2d8cff',
                        borderWidth: 1
                    },
                    {
                        label: 'Spent',
                        data: spentData,
                        backgroundColor: spentColors,
                        borderColor: spentColors,
                        borderWidth: 1
                    }
                ]
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
    } catch (err) {
        console.error('Error creating budget chart:', err);
    }
}

// Populate categories dropdown
async function populateBudgetCategories() {
    try {
        console.log('Loading categories for budget dropdown...');
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories = await response.json();
        console.log('Categories for budget:', categories);

        const select = document.getElementById('budget-category');
        if (!select) {
            console.error('Budget category select element not found!');
            return;
        }

        select.innerHTML = '<option value="">Select a category</option>';

        if (!categories || categories.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No categories available - Create categories first';
            option.disabled = true;
            select.appendChild(option);
            console.log('No categories available for budget');
            return;
        }

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });

        console.log(`Populated budget categories dropdown with ${categories.length} categories`);
    } catch (err) {
        console.error('Error loading categories for budget:', err);
        const select = document.getElementById('budget-category');
        if (select) {
            select.innerHTML = '<option value="">Error loading categories</option>';
        }
    }
}

// Set current month and year as default
function setCurrentMonthYear() {
    try {
        const now = new Date();
        const monthEl = document.getElementById('budget-month');
        const yearEl = document.getElementById('budget-year');

        if (monthEl) monthEl.value = now.getMonth() + 1;
        if (yearEl) yearEl.value = now.getFullYear();

        console.log('Set current month/year:', now.getMonth() + 1, now.getFullYear());
    } catch (error) {
        console.error('Error setting current month/year:', error);
    }
}

// Setup event listeners
function setupBudgetEventListeners() {
    try {
        console.log('Setting up budget event listeners...');

        // Show/hide budget form
        const showFormBtn = document.getElementById('show-budget-form');
        if (showFormBtn) {
            // Track form state manually
            let formIsVisible = false;

            showFormBtn.addEventListener('click', () => {
                console.log('Show budget form button clicked');
                const form = document.getElementById('budget-form');
                if (form) {
                    console.log(`Current form state: ${formIsVisible ? 'VISIBLE' : 'HIDDEN'}`);

                    if (!formIsVisible) {
                        // Show the form
                        form.style.display = 'block';
                        showFormBtn.textContent = 'Cancel';
                        formIsVisible = true;
                        console.log('✅ Budget form is now VISIBLE');
                    } else {
                        // Hide the form
                        form.style.display = 'none';
                        showFormBtn.textContent = 'Add New Budget';
                        formIsVisible = false;
                        console.log('❌ Budget form is now HIDDEN');
                    }
                } else {
                    console.error('Budget form element not found!');
                }
            });

            // Also expose function to reset form state
            window.resetBudgetFormState = () => {
                formIsVisible = false;
                showFormBtn.textContent = 'Add New Budget';
            };

            console.log('Show budget form event listener added');
        } else {
            console.error('Show budget form button not found!');
        }

        // Cancel budget form
        const cancelBtn = document.getElementById('cancel-budget');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                const form = document.getElementById('budget-form');
                if (form) {
                    form.style.display = 'none';
                    form.reset();
                    setCurrentMonthYear();

                    // Reset the form state
                    if (window.resetBudgetFormState) {
                        window.resetBudgetFormState();
                    }

                    console.log('Budget form cancelled and hidden');
                }
            });
        }

        // Handle budget form submission
        const budgetForm = document.getElementById('budget-form');
        if (budgetForm) {
            budgetForm.addEventListener('submit', handleBudgetSubmission);
        }

        console.log('Budget event listeners set up successfully');
    } catch (error) {
        console.error('Error setting up budget event listeners:', error);
    }
}

// Handle budget form submission
async function handleBudgetSubmission(e) {
    e.preventDefault();
    console.log('Budget form submitted!');

    // Get form elements
    const categoryEl = document.getElementById('budget-category');
    const limitEl = document.getElementById('budget-limit');
    const monthEl = document.getElementById('budget-month');
    const yearEl = document.getElementById('budget-year');

    // Check if elements exist
    if (!categoryEl || !limitEl || !monthEl || !yearEl) {
        console.error('Budget form elements not found!');
        alert('Form elements missing. Please refresh the page.');
        return;
    }

    const formData = {
        category_id: parseInt(categoryEl.value),
        limit_amount: parseFloat(limitEl.value),
        month: parseInt(monthEl.value),
        year: parseInt(yearEl.value)
    };

    console.log('Budget form data:', formData);

    // Validate required fields
    if (!formData.category_id || isNaN(formData.category_id)) {
        alert('Please select a category');
        categoryEl.focus();
        return;
    }

    if (!formData.limit_amount || formData.limit_amount <= 0 || isNaN(formData.limit_amount)) {
        alert('Please enter a valid budget amount (greater than 0)');
        limitEl.focus();
        return;
    }

    if (!formData.month || !formData.year || isNaN(formData.month) || isNaN(formData.year)) {
        alert('Please select month and year');
        monthEl.focus();
        return;
    }

    try {
        console.log('Sending budget request to:', `${API_BASE_URL}/budgets`);
        const response = await fetch(`${API_BASE_URL}/budgets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        console.log('Budget response status:', response.status);
        const result = await response.json();
        console.log('Budget response data:', result);

        if (response.ok) {
            alert('Budget created successfully!');
            const form = document.getElementById('budget-form');

            if (form) {
                form.reset();
                form.style.display = 'none';
            }

            // Reset the form state
            if (window.resetBudgetFormState) {
                window.resetBudgetFormState();
            }

            setCurrentMonthYear();
            await initializeBudgetPage(); // Refresh all data
        } else {
            alert('Error: ' + (result.error || 'Unknown error'));
        }
    } catch (err) {
        console.error('Error creating budget:', err);
        alert('Network error: ' + err.message);
    }
}

// Delete budget function
window.deleteBudget = async function(id) {
    if (!confirm('Are you sure you want to delete this budget?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await initializeBudgetPage(); // Refresh all data
        } else {
            alert('Error deleting budget');
        }
    } catch (err) {
        console.error('Error deleting budget:', err);
        alert('An error occurred while deleting the budget.');
    }
};

// Edit budget function
window.editBudget = async function(id, currentAmount) {
    const newAmount = prompt('Enter new budget amount:', currentAmount);
    if (!newAmount || newAmount === currentAmount.toString()) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ limit_amount: newAmount })
        });
        
        if (response.ok) {
            await initializeBudgetPage(); // Refresh all data
        } else {
            alert('Error updating budget');
        }
    } catch (err) {
        console.error('Error updating budget:', err);
        alert('An error occurred while updating the budget.');
    }
};
