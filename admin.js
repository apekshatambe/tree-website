/* ==========================================================================
   PLANT BOOKING SYSTEM — ARVELI ADMIN JAVASCRIPT
   Minimal & Simple JavaScript for Mobile Menu & Basic Interactivity
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
