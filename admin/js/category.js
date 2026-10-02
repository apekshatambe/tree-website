/* ==========================================================================
   ARVELI ADMIN — CATEGORIES PAGE
   Simple CRUD-style list for plant categories (Indoor, Outdoor, Flowering,
   Succulents, ...). Guarded so it does nothing on any page that lacks
   #categoryTableBody.
   ========================================================================== */

// Dummy data — replace with fetch('/api/categories') later.
let categories = [
    { id: 'CAT-01', name: 'Indoor Plants', description: 'Plants suited for indoor spaces & low light.', productCount: 3 },
    { id: 'CAT-02', name: 'Outdoor Plants', description: 'Hardy plants for gardens & balconies.', productCount: 1 },
    { id: 'CAT-03', name: 'Flowering Plants', description: 'Plants grown for their blooms.', productCount: 1 },
    { id: 'CAT-04', name: 'Succulents', description: 'Low-maintenance, drought-tolerant plants.', productCount: 1 },
];

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('categoryTableBody');
    if (!tableBody) return; // Not on the Categories page.

    const searchInput = document.getElementById('categorySearchInput');
    const modal = document.getElementById('categoryModal');
    const form = document.getElementById('categoryForm');

    renderCategories(categories);
    searchInput.addEventListener('input', filterCategories);

    window.openAddCategoryModal = function () {
        form.reset();
        document.getElementById('categoryId').value = '';
        document.getElementById('categoryModalTitle').textContent = 'Add New Category';
        modal.classList.add('active');
    };

    window.openEditCategoryModal = function (id) {
        const category = categories.find((c) => c.id === id);
        if (!category) return;

        document.getElementById('categoryId').value = category.id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryDescription').value = category.description;
        document.getElementById('categoryModalTitle').textContent = 'Edit Category';
        modal.classList.add('active');
    };

    window.closeCategoryModal = function () {
        modal.classList.remove('active');
    };

    window.saveCategory = function (event) {
        event.preventDefault();

        const id = document.getElementById('categoryId').value;
        const name = document.getElementById('categoryName').value.trim();
        const description = document.getElementById('categoryDescription').value.trim();

        if (id) {
            const category = categories.find((c) => c.id === id);
            if (category) {
                category.name = name;
                category.description = description;
            }
        } else {
            const newId = `CAT-0${categories.length + 1}`;
            categories.push({ id: newId, name, description, productCount: 0 });
        }

        // TODO: POST/PUT to /api/categories

        renderCategories(categories);
        window.closeCategoryModal();
    };

    window.deleteCategory = function (id) {
        categories = categories.filter((c) => c.id !== id);
        // TODO: DELETE /api/categories/:id
        renderCategories(categories);
    };
});

function renderCategories(list) {
    const body = document.getElementById('categoryTableBody');
    if (!body) return;

    if (list.length === 0) {
        body.innerHTML = `<tr class="empty-state"><td colspan="4">No categories found.</td></tr>`;
        return;
    }

    body.innerHTML = list.map((c) => `
        <tr>
            <td><strong>${c.name}</strong><br><small class="cell-caption">${c.description}</small></td>
            <td><span class="badge badge-confirmed">${c.productCount} products</span></td>
            <td>${c.id}</td>
            <td class="action-group">
                <button type="button" class="btn btn-sm btn-outline" onclick="openEditCategoryModal('${c.id}')">Edit</button>
                <button type="button" class="btn btn-sm btn-danger" onclick="deleteCategory('${c.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function filterCategories() {
    const query = document.getElementById('categorySearchInput').value.toLowerCase().trim();
    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
    );
    renderCategories(filtered);
}
