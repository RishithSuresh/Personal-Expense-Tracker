// filepath: personal-expense-tracker-frontend/app.js

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle adding a new expense
    const addExpenseForm = document.querySelector('.add-expense-form');
    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const date = addExpenseForm.querySelector('input[type="date"]').value;
            const description = addExpenseForm.querySelector('input[type="text"]').value;
            const category = addExpenseForm.querySelector('select').value;
            const amount = addExpenseForm.querySelector('input[type="number"]').value;
            const paymentMethod = addExpenseForm.querySelectorAll('select')[1].value;

            // Here you would typically send this data to a server or save it locally
            console.log('Expense Added:', { date, description, category, amount, paymentMethod });
            alert('Expense added successfully!');
            addExpenseForm.reset();
        });
    }

    // Function to handle adding a new budget
    const addBudgetForm = document.querySelector('.add-budget-form');
    if (addBudgetForm) {
        addBudgetForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const category = addBudgetForm.querySelector('select').value;
            const limit = addBudgetForm.querySelector('input[type="number"]').value;

            // Here you would typically send this data to a server or save it locally
            console.log('Budget Added:', { category, limit });
            alert('Budget added successfully!');
            addBudgetForm.reset();
        });
    }

    // Function to handle adding a new category
    const addCategoryForm = document.querySelector('.add-category-form');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const categoryName = addCategoryForm.querySelector('input[type="text"]').value;

            // Here you would typically send this data to a server or save it locally
            console.log('Category Added:', { categoryName });
            alert('Category added successfully!');
            addCategoryForm.reset();
        });
    }
});