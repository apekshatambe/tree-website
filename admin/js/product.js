/* ==========================================================================
   ARVELI ADMIN — PRODUCTS PAGE
   Only runs its logic if product.html's elements are present, so it is
   safe to leave this script off any page that doesn't need it.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const productModal = document.getElementById('productModal');
    if (!productModal) return; // Not on the Products page — do nothing.

    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');
    const idField = document.getElementById('productId');

    window.openAddProductModal = function () {
        if (form) form.reset();
        if (idField) idField.value = '';
        if (title) title.textContent = 'Add New Plant Product';
        productModal.classList.add('active');
    };

    window.openEditProductModal = function (id) {
        if (title) title.textContent = 'Edit Plant Product';
        if (idField) idField.value = id;
        productModal.classList.add('active');
    };

    window.closeProductModal = function () {
        productModal.classList.remove('active');
    };

    // Placeholder for the eventual API call — kept separate from the DOM
    // logic above so swapping dummy behaviour for a real request later
    // only touches this one function.
    window.saveProduct = function (event) {
        event.preventDefault();
        // TODO: POST to /api/products (create) or PUT /api/products/:id (edit)
        window.closeProductModal();
    };

    window.deleteProduct = function (id) {
        // TODO: DELETE /api/products/:id
        console.log('Delete product', id);
    };
});
