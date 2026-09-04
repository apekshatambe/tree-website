/* ==========================================================================
   PLANT BOOKING SYSTEM — ARVELI ADMIN JAVASCRIPT
   Minimal & Simple JavaScript for Mobile Menu & Product Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Sidebar Drawer Toggle Logic
    const toggleBtn = document.getElementById('mobileToggleBtn');
    const closeBtn = document.getElementById('sidebarCloseBtn');
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (toggleBtn && sidebar && overlay) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeMobileSidebar);
    }
});

function closeMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}


function openEditProductModal(id) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    
    if (title) title.textContent = 'Edit Plant Product';
    if (document.getElementById('productId')) document.getElementById('productId').value = id;
    if (modal) modal.classList.add('active');
}

function openAddProductModal() {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    const form = document.getElementById('productForm');

    if (title) title.textContent = 'Add New Plant Product';
    if (document.getElementById('productId')) document.getElementById('productId').value = '';
    if (form) form.reset();
    if (modal) modal.classList.add('active');
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.classList.remove('active');
}

function deleteProduct(id) {
    if (!confirm('Delete this plant product?')) return;
    const row = document.querySelector(`button[onclick="deleteProduct(${id})"]`);
    const tr = row ? row.closest('tr') : null;
    if (tr) tr.remove();
}

function saveProduct(event) {
    event.preventDefault();

    const name = document.getElementById('productName')?.value.trim() || 'New Plant';
    const price = document.getElementById('productPrice')?.value || '0';
    const stock = document.getElementById('productStock')?.value || '0';
    const category = document.getElementById('productCategory')?.value || 'Indoor Plants';
    const image = document.getElementById('productImage')?.value.trim() || '../images/plant.jpeg';
    const description = document.getElementById('productDescription')?.value.trim() || '';
    const productId = document.getElementById('productId')?.value;
    const tbody = document.getElementById('productsTableBody');

    if (!tbody) {
        closeProductModal();
        return;
    }

    const stockClass = Number(stock) <= 5 ? 'badge-low-stock' : 'badge-in-stock';
    const newId = productId || String(Date.now());
    const rowHtml =
        '<td><img src="' + image + '" alt="' + name + '" class="tbl-thumb"></td>' +
        '<td><strong>' + name + '</strong><br><small style="color: #64748b;">' +
        (description || 'No description') +
        '</small></td>' +
        '<td><span class="badge badge-confirmed">' + category + '</span></td>' +
        '<td><strong>₹' + price + '</strong></td>' +
        '<td><span class="badge ' + stockClass + '">' + stock + ' units</span></td>' +
        '<td>' +
        '<button class="btn btn-sm btn-outline" onclick="openEditProductModal(' + newId + ')">Edit</button> ' +
        '<button class="btn btn-sm btn-danger" onclick="deleteProduct(' + newId + ')">Delete</button>' +
        '</td>';

    if (productId) {
        const editBtn = document.querySelector(`button[onclick="openEditProductModal(${productId})"]`);
        const existingRow = editBtn ? editBtn.closest('tr') : null;
        if (existingRow) {
            existingRow.innerHTML = rowHtml;
            closeProductModal();
            return;
        }
    }

    const tr = document.createElement('tr');
    tr.innerHTML = rowHtml;
    tbody.prepend(tr);
    closeProductModal();
}
