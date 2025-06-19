// Financial Analytics JavaScript

// API_BASE_URL is defined in main.js
let currentPeriod = 30;

document.addEventListener('DOMContentLoaded', () => {
    initializeAnalytics();
    setupPeriodSelector();
});

async function initializeAnalytics() {
    await loadFinancialHealth();
    await loadMonthlyTrends();
    await loadTopCategories();
    await loadIncomeSourceAnalysis();
    await loadDailySpendingPattern();
    await loadSpendingTrends();
    await loadMonthlySummary();
    await loadCategoriesAnalysis();
}

// Load financial health metrics
async function loadFinancialHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/financial-health`);
        const data = await response.json();
        
        const healthScore = data.metrics.financial_health_score;
        const savingsRate = data.metrics.savings_rate;
        const monthlySavings = data.current_month.monthly_savings;
        const incomeGrowth = data.metrics.income_growth;
        
        document.getElementById('health-score').textContent = healthScore;
        document.getElementById('savings-rate').textContent = savingsRate + '%';
        document.getElementById('monthly-savings').textContent = '₱' + Number(monthlySavings || 0).toLocaleString();
        document.getElementById('income-growth').textContent = incomeGrowth + '%';
        
        // Update health status
        const healthStatus = document.getElementById('health-status');
        const healthCard = document.querySelector('.health-card');
        
        if (healthScore >= 80) {
            healthStatus.textContent = 'Excellent';
            healthCard.classList.add('excellent');
        } else if (healthScore >= 60) {
            healthStatus.textContent = 'Good';
            healthCard.classList.add('good');
        } else if (healthScore >= 40) {
            healthStatus.textContent = 'Fair';
            healthCard.classList.add('fair');
        } else {
            healthStatus.textContent = 'Needs Improvement';
            healthCard.classList.add('poor');
        }
        
        // Update savings color
        const savingsElement = document.getElementById('monthly-savings');
        if (monthlySavings > 0) {
            savingsElement.className = 'dashboard-value income';
        } else if (monthlySavings < 0) {
            savingsElement.className = 'dashboard-value expenses';
        } else {
            savingsElement.className = 'dashboard-value';
        }
        
    } catch (err) {
        console.error('Error loading financial health:', err);
    }
}

// Load monthly trends chart
async function loadMonthlyTrends() {
    try {
        console.log('Loading monthly trends...');
        const response = await fetch(`${API_BASE_URL}/analytics/monthly`);
        const data = await response.json();
        console.log('Monthly trends data:', data);

        const ctx = document.getElementById('monthlyTrendChart');
        if (!ctx) {
            console.error('Monthly trend chart canvas not found!');
            return;
        }

        // Clear existing chart
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        if (!data || data.length === 0) {
            console.log('No monthly trends data available');
            // Show "No data" message
            const context = ctx.getContext('2d');
            context.clearRect(0, 0, ctx.width, ctx.height);
            context.font = '16px Arial';
            context.fillStyle = '#bfc9da';
            context.textAlign = 'center';
            context.fillText('No data available - Add income and expenses to see trends', ctx.width / 2, ctx.height / 2);
            return;
        }

        const labels = data.map(item => `${item.month_name} ${item.year}`);
        const incomeData = data.map(item => Number(item.total_income || 0));
        const expenseData = data.map(item => Number(item.total_expenses || 0));
        const savingsData = data.map(item => Number(item.net_savings || 0));

        console.log('Chart data prepared:', { labels, incomeData, expenseData, savingsData });
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.reverse(),
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData.reverse(),
                        borderColor: '#1ecb4f',
                        backgroundColor: '#1ecb4f20',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        data: expenseData.reverse(),
                        borderColor: '#ff4c29',
                        backgroundColor: '#ff4c2920',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Net Savings',
                        data: savingsData.reverse(),
                        borderColor: '#2d8cff',
                        backgroundColor: '#2d8cff20',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4
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

        console.log('✅ Monthly trends chart created successfully');
    } catch (err) {
        console.error('Error loading monthly trends:', err);
    }
}

// Load top categories chart
async function loadTopCategories() {
    try {
        // Load categories to get colors
        const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
        const categories = await categoriesRes.json();

        const response = await fetch(`${API_BASE_URL}/analytics/top-categories?period=${currentPeriod}`);
        const data = await response.json();

        const ctx = document.getElementById('topCategoriesChart');
        if (!ctx) return;

        // Clear existing chart
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        if (!data || data.length === 0) {
            ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
            return;
        }

        const labels = data.map(item => item.category || 'Unknown');
        const amounts = data.map(item => Number(item.total_amount));

        // Get colors from categories
        const colors = data.map(item => {
            const category = categories.find(cat => cat.name === item.category);
            return category ? category.color : '#ff4c29'; // fallback color
        });

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
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
                            padding: 10,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const percentage = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percent = ((percentage / total) * 100).toFixed(1);
                                return `${context.label}: ₱${percentage.toLocaleString()} (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.error('Error loading top categories:', err);
    }
}

// Load income source analysis
async function loadIncomeSourceAnalysis() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/income-sources?period=${currentPeriod}`);
        const data = await response.json();

        const ctx = document.getElementById('incomeSourcesChart');
        if (!ctx) return;

        // Clear existing chart
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        if (!data || data.length === 0) {
            ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
            return;
        }

        const labels = data.map(item => item.source || 'Unknown');
        const amounts = data.map(item => Number(item.total_amount));
        const colors = ['#1ecb4f', '#2d8cff', '#f1c40f', '#9b59b6', '#16a085', '#e67e22'];

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors.slice(0, amounts.length),
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
                            padding: 10,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const percentage = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percent = ((percentage / total) * 100).toFixed(1);
                                return `${context.label}: ₱${percentage.toLocaleString()} (${percent}%)`;
                            }
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.error('Error loading income sources:', err);
    }
}

// Load daily spending pattern
async function loadDailySpendingPattern() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/daily-pattern`);
        const data = await response.json();

        const ctx = document.getElementById('dailyPatternChart');
        if (!ctx) return;

        // Clear existing chart
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        const labels = data.map(item => item.day_name);
        const amounts = data.map(item => Number(item.avg_spending || 0));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Spending',
                    data: amounts,
                    backgroundColor: '#ff4c29',
                    borderColor: '#ff4c29',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Average: ₱${context.parsed.y.toLocaleString()}`;
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
        console.error('Error loading daily pattern:', err);
    }
}

// Load spending trends with category colors
async function loadSpendingTrends() {
    try {
        // Load categories to get colors
        const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
        const categories = await categoriesRes.json();

        const response = await fetch(`${API_BASE_URL}/analytics/spending-trends`);
        const data = await response.json();

        const ctx = document.getElementById('spendingTrendsChart');
        if (!ctx) return;

        // Clear existing chart
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        // Group data by category for the last 3 months
        const categoryNames = [...new Set(data.map(item => item.category))];
        const months = [...new Set(data.map(item => `${item.month}/${item.year}`))].slice(-3);

        const datasets = categoryNames.slice(0, 5).map((categoryName, index) => {
            const categoryData = months.map(month => {
                const [m, y] = month.split('/');
                const item = data.find(d => d.category === categoryName && d.month == m && d.year == y);
                return item ? Number(item.total_amount) : 0;
            });

            // Get color from categories or use fallback
            const category = categories.find(cat => cat.name === categoryName);
            const color = category ? category.color : '#ff4c29';

            return {
                label: categoryName || 'Unknown',
                data: categoryData,
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            };
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f5f6fa',
                            font: { size: 10 }
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
        console.error('Error loading spending trends:', err);
    }
}

// Load monthly summary table
async function loadMonthlySummary() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/monthly`);
        const data = await response.json();

        const tbody = document.getElementById('monthly-summary-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        data.forEach(item => {
            const savingsRate = item.total_income > 0 ?
                ((item.net_savings / item.total_income) * 100).toFixed(1) : 0;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.month_name} ${item.year}</td>
                <td>₱${Number(item.total_income || 0).toLocaleString()}</td>
                <td>₱${Number(item.total_expenses || 0).toLocaleString()}</td>
                <td class="${item.net_savings >= 0 ? 'positive' : 'negative'}">
                    ₱${Number(item.net_savings || 0).toLocaleString()}
                </td>
                <td>${savingsRate}%</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Error loading monthly summary:', err);
    }
}

// Load categories analysis table
async function loadCategoriesAnalysis() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/top-categories?period=${currentPeriod}`);
        const data = await response.json();

        const tbody = document.getElementById('categories-analysis-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.category || 'Unknown'}</td>
                <td>₱${Number(item.total_amount).toLocaleString()}</td>
                <td>${item.transaction_count}</td>
                <td>₱${Number(item.avg_amount).toLocaleString()}</td>
                <td>${item.percentage}%</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Error loading categories analysis:', err);
    }
}

// Setup period selector
function setupPeriodSelector() {
    const periodButtons = document.querySelectorAll('.period-btn');

    periodButtons.forEach(button => {
        button.addEventListener('click', async () => {
            // Remove active class from all buttons
            periodButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Update current period
            currentPeriod = parseInt(button.dataset.period);

            // Reload period-dependent data
            await loadTopCategories();
            await loadIncomeSourceAnalysis();
            await loadCategoriesAnalysis();
        });
    });
}
