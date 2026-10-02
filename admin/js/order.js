/* ==========================================================================
   ARVELI ADMIN — ORDERS PAGE
   Search, filter, view and update-status logic for order.html. Guarded so
   it does nothing on any page that lacks #ordersTableBody.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (!ordersTableBody) return; // Not on the Orders page.

    const orderSearch = document.getElementById('orderSearch');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const orderModal = document.getElementById('orderDetailsModal');
    const orderModalTitle = document.getElementById('orderModalTitle');
    const orderStatusSelect = document.getElementById('orderStatusSelect');
    const saveOrderStatusBtn = document.getElementById('saveOrderStatusBtn');
    const orderStatusForm = document.getElementById('orderStatusForm');
    const emptyState = document.getElementById('orderEmptyState');
    let selectedOrderId = '';

    const getOrderRows = () => Array.from(
        ordersTableBody.querySelectorAll('tr[data-order-id]')
    );

    const statusClass = (status) => `badge-${status.toLowerCase()}`;

    const updateOrderStatistics = () => {
        const rows = getOrderRows();
        const statusCounts = { Pending: 0, Confirmed: 0, Delivered: 0, Cancelled: 0 };

        rows.forEach((row) => {
            if (statusCounts[row.dataset.status] !== undefined) {
                statusCounts[row.dataset.status] += 1;
            }
        });

        document.getElementById('totalOrdersCount').textContent = rows.length;
        document.getElementById('pendingOrdersCount').textContent = statusCounts.Pending;
        document.getElementById('confirmedOrdersCount').textContent = statusCounts.Confirmed;
        document.getElementById('deliveredOrdersCount').textContent = statusCounts.Delivered;
        document.getElementById('cancelledOrdersCount').textContent = statusCounts.Cancelled;
    };

    const filterOrders = () => {
        const searchTerm = orderSearch.value.trim().toLowerCase();
        const selectedStatus = orderStatusFilter.value;
        let visibleOrderCount = 0;

        getOrderRows().forEach((row) => {
            const searchableText =
                `${row.dataset.orderId} ${row.dataset.customer} ${row.dataset.product}`.toLowerCase();

            const matchesSearch = searchableText.includes(searchTerm);
            const matchesStatus = selectedStatus === 'All' || row.dataset.status === selectedStatus;
            const shouldShow = matchesSearch && matchesStatus;

            row.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visibleOrderCount += 1;
        });

        if (emptyState) {
            emptyState.style.display = visibleOrderCount === 0 ? 'table-row' : 'none';
        }
    };

    const openOrderModal = (orderId, allowStatusUpdate) => {
        const row = ordersTableBody.querySelector(`tr[data-order-id="${orderId}"]`);
        if (!row || !orderModal) return;

        selectedOrderId = orderId;
        orderModalTitle.textContent = allowStatusUpdate ? `Update ${orderId}` : `${orderId} Details`;

        document.getElementById('modalOrderId').textContent = row.dataset.orderId;
        document.getElementById('modalCustomer').textContent = row.dataset.customer;
        document.getElementById('modalProduct').textContent = row.dataset.product;
        document.getElementById('modalQuantity').textContent = row.dataset.quantity;
        document.getElementById('modalAmount').textContent = row.dataset.amount;
        document.getElementById('modalDate').textContent = row.dataset.date;

        orderStatusSelect.value = row.dataset.status;
        orderStatusSelect.disabled = !allowStatusUpdate;
        saveOrderStatusBtn.style.display = allowStatusUpdate ? 'inline-flex' : 'none';

        orderModal.classList.add('active');
    };

    const closeOrderModal = () => {
        orderModal.classList.remove('active');
        selectedOrderId = '';
    };

    ordersTableBody.addEventListener('click', (event) => {
        const viewButton = event.target.closest('.order-view-btn');
        const updateButton = event.target.closest('.order-update-btn');

        if (viewButton) openOrderModal(viewButton.dataset.orderId, false);
        if (updateButton) openOrderModal(updateButton.dataset.orderId, true);
    });

    orderSearch.addEventListener('input', filterOrders);
    orderStatusFilter.addEventListener('change', filterOrders);

    orderStatusForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const row = ordersTableBody.querySelector(`tr[data-order-id="${selectedOrderId}"]`);
        if (!row) return;

        const newStatus = orderStatusSelect.value;
        const statusBadge = row.querySelector('.badge');

        row.dataset.status = newStatus;
        statusBadge.textContent = newStatus;
        statusBadge.className = `badge ${statusClass(newStatus)}`;

        // TODO: PATCH /api/orders/:id { status: newStatus }

        updateOrderStatistics();
        filterOrders();
        closeOrderModal();
    });

    document.getElementById('closeOrderModalBtn').addEventListener('click', closeOrderModal);
    document.getElementById('cancelOrderModalBtn').addEventListener('click', closeOrderModal);

    orderModal.addEventListener('click', (event) => {
        if (event.target === orderModal) closeOrderModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeOrderModal();
    });

    updateOrderStatistics();
    filterOrders();
});
