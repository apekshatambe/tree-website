/* ==========================================================================
   ARVELI ADMIN — CUSTOMERS PAGE
   Rebuilt to match customer.html. Guarded so it does nothing on any page
   that lacks #customerTableBody.
   ========================================================================== */

// Dummy data — replace with a fetch('/api/customers') call later. Kept in
// its own array at the top so that swap is a one-line change.
let customers = [
    { id: 'CUST-01', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', totalOrders: 5, totalSpent: 3200, registered: '2026-03-12', status: 'Active' },
    { id: 'CUST-02', name: 'Priya Patel', email: 'priya@example.com', phone: '9876543211', totalOrders: 2, totalSpent: 950, registered: '2026-05-02', status: 'Active' },
    { id: 'CUST-03', name: 'Amit Verma', email: 'amit@example.com', phone: '9876543212', totalOrders: 8, totalSpent: 5400, registered: '2026-01-20', status: 'Inactive' },
    { id: 'CUST-04', name: 'Neha Gupta', email: 'neha@example.com', phone: '9876543213', totalOrders: 1, totalSpent: 499, registered: '2026-07-08', status: 'Active' },
];

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('customerTableBody');
    if (!tableBody) return; // Not on the Customers page.

    const searchInput = document.getElementById('customerSearchInput');
    const statusFilter = document.getElementById('customerStatusFilter');

    renderCustomerStats();
    renderCustomers(customers);

    searchInput.addEventListener('input', filterCustomers);
    statusFilter.addEventListener('change', filterCustomers);
});

function renderCustomerStats() {
    const total = customers.length;
    const active = customers.filter((c) => c.status === 'Active').length;
    const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);

    const grid = document.getElementById('customerStatsGrid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-title">Total Customers</span>
                <span class="stat-icon-bg purple">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
                        <circle cx="43" cy="22" r="9" fill="#8E7CC3" />
                        <path d="M29 48c1-10 7-16 14-16s13 6 14 16z" fill="#8E7CC3" />
                        <circle cx="25" cy="23" r="10" fill="#6C63B5" />
                        <path d="M7 50c1-11 8-18 18-18s17 7 18 18z" fill="#6C63B5" />
                        <circle cx="22" cy="20" r="3" fill="#A9A1E8" />
                    </svg>
                </span>
            </div>
            <h2 class="stat-value">${total}</h2>
            <span class="stat-trend trend-up">All registered customers</span>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-title">Active Customers</span>
                <span class="stat-icon-bg green">
                    <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13l4 4L19 7" stroke="#16a34a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
            </div>
            <h2 class="stat-value">${active}</h2>
            <span class="stat-trend trend-up">Currently active</span>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-title">Total Orders Placed</span>
                <span class="stat-icon-bg blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
                        <path d="M10 20L32 9l22 11v25L32 56 10 45z" fill="#E9B44C" />
                        <path d="M32 32l22-12v25L32 56z" fill="#D99A2B" />
                        <path d="M10 20l22 12v24L10 45z" fill="#F2C866" />
                    </svg>
                </span>
            </div>
            <h2 class="stat-value">${totalOrders}</h2>
            <span class="stat-trend trend-up">Across all customers</span>
        </div>
    `;
}

function renderCustomers(list) {
    const body = document.getElementById('customerTableBody');
    if (!body) return;

    if (list.length === 0) {
        body.innerHTML = `<tr class="empty-state"><td colspan="8">No customers found.</td></tr>`;
        return;
    }

    body.innerHTML = list.map((c) => `
        <tr>
            <td><strong>${c.id}</strong></td>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td>${c.totalOrders}</td>
            <td>₹${c.totalSpent}</td>
            <td>${c.registered}</td>
            <td><span class="badge ${c.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${c.status}</span></td>
            <td class="action-group">
                <button type="button" class="btn btn-sm btn-outline" onclick="viewCustomer('${c.id}')">View</button>
                <button type="button" class="btn btn-sm btn-outline" onclick="toggleCustomerStatus('${c.id}')">
                    ${c.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
            </td>
        </tr>
    `).join('');
}

function filterCustomers() {
    const query = document.getElementById('customerSearchInput').value.toLowerCase().trim();
    const statusValue = document.getElementById('customerStatusFilter').value;

    const filtered = customers.filter((c) => {
        const matchesSearch =
            c.id.toLowerCase().includes(query) ||
            c.name.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query) ||
            c.phone.includes(query);

        const matchesStatus = statusValue === 'All' || c.status === statusValue;
        return matchesSearch && matchesStatus;
    });

    renderCustomers(filtered);
}

function viewCustomer(id) {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return;

    document.getElementById('customerDetailGrid').innerHTML = `
        <div class="detail-item"><span class="detail-label">Customer ID</span><span class="detail-value">${customer.id}</span></div>
        <div class="detail-item"><span class="detail-label">Name</span><span class="detail-value">${customer.name}</span></div>
        <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${customer.email}</span></div>
        <div class="detail-item"><span class="detail-label">Phone</span><span class="detail-value">${customer.phone}</span></div>
        <div class="detail-item"><span class="detail-label">Total Orders</span><span class="detail-value">${customer.totalOrders}</span></div>
        <div class="detail-item"><span class="detail-label">Total Spent</span><span class="detail-value">₹${customer.totalSpent}</span></div>
        <div class="detail-item"><span class="detail-label">Registered On</span><span class="detail-value">${customer.registered}</span></div>
        <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value">${customer.status}</span></div>
    `;

    document.getElementById('customerViewModal').classList.add('active');
}

function closeCustomerViewModal() {
    document.getElementById('customerViewModal').classList.remove('active');
}

function toggleCustomerStatus(id) {
    const customer = customers.find((c) => c.id === id);
    if (customer) {
        customer.status = customer.status === 'Active' ? 'Inactive' : 'Active';
        // TODO: PATCH /api/customers/:id { status: customer.status }
    }
    renderCustomerStats();
    filterCustomers();
}
