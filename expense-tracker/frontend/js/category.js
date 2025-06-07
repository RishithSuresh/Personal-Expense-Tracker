// frontend/js/category.js

document.addEventListener('DOMContentLoaded', function() {
    const categoryForm = document.getElementById('category-form');
    const categoryList = document.getElementById('category-list');

    // Fetch categories from the server
    fetchCategories();

    // Add event listener for form submission
    categoryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const categoryName = document.getElementById('category-name').value;
        addCategory(categoryName);
    });

    function fetchCategories() {
        fetch('/api/categories')
            .then(response => response.json())
            .then(data => {
                displayCategories(data);
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    function displayCategories(categories) {
        categoryList.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category.name;
            categoryList.appendChild(li);
        });
    }

    function addCategory(name) {
        fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        })
        .then(response => response.json())
        .then(data => {
            fetchCategories(); // Refresh the category list
            categoryForm.reset(); // Clear the form
        })
        .catch(error => console.error('Error adding category:', error));
    }
});