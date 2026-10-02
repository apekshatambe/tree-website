/* ==========================================================================
   ARVELI ADMIN — SHARED SIDEBAR COMPONENT
   ==========================================================================
   Every admin page used to carry its own hand-copied ~100-line sidebar.
   That's now defined ONCE here. A page just needs:

       <div id="sidebarPlaceholder"></div>
       <body data-page="orders">

   ...and this script renders the sidebar into that placeholder, marking
   the link matching data-page as active, then wires up the mobile
   open/close behaviour. Adding a new sidebar link now means editing one
   file instead of six.
   ========================================================================== */

const SIDEBAR_LINKS = [
    {
        page: 'dashboard',
        href: 'admin.html',
        label: 'Dashboard',
        icon: `<rect x="7" y="7" width="50" height="50" rx="8" fill="#EAF4EE" />
               <rect x="15" y="35" width="7" height="14" rx="2" fill="#74C69D" />
               <rect x="27" y="27" width="7" height="22" rx="2" fill="#52B788" />
               <rect x="39" y="19" width="7" height="30" rx="2" fill="#2D6A4F" />
               <path d="M14 31l12-7 10 3 14-13" fill="none" stroke="#F4C95D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
               <path d="M46 14h4v4" fill="none" stroke="#F4C95D" stroke-width="3" stroke-linecap="round" />`
    },
    {
        page: 'products',
        href: 'product.html',
        label: 'Products',
        icon: `<path d="M18 38h28l-4 20H22z" fill="#C47A4A" />
               <path d="M16 36h32v6H16z" rx="2" fill="#A85D35" />
               <path d="M32 38V20" stroke="#2D6A4F" stroke-width="4" stroke-linecap="round" />
               <path d="M31 27C21 27 16 21 18 15c9 0 14 4 13 12z" fill="#52B788" />
               <path d="M33 24C42 24 48 18 46 12c-9 0-14 5-13 12z" fill="#40916C" />
               <path d="M31 19C25 18 22 13 24 8c6 1 9 5 7 11z" fill="#74C69D" />`
    },
    {
        page: 'orders',
        href: 'order.html',
        label: 'Orders',
        icon: `<path d="M10 20L32 9l22 11v25L32 56 10 45z" fill="#E9B44C" />
               <path d="M32 32l22-12v25L32 56z" fill="#D99A2B" />
               <path d="M10 20l22 12v24L10 45z" fill="#F2C866" />
               <path d="M28 11l8 4v20l-8-4z" fill="#FFF1C1" />
               <path d="M10 20l22 12 22-12" fill="none" stroke="#B57920" stroke-width="2" />`
    },
    {
        page: 'customers',
        href: 'customer.html',
        label: 'Customers',
        icon: `<circle cx="43" cy="22" r="9" fill="#8E7CC3" />
               <path d="M29 48c1-10 7-16 14-16s13 6 14 16z" fill="#8E7CC3" />
               <circle cx="25" cy="23" r="10" fill="#6C63B5" />
               <path d="M7 50c1-11 8-18 18-18s17 7 18 18z" fill="#6C63B5" />
               <circle cx="22" cy="20" r="3" fill="#A9A1E8" />`
    },
    {
        page: 'categories',
        href: 'category.html',
        label: 'Categories',
        icon: `<path d="M8 10 H35 L56 31 L32 55 L8 32 Z" fill="#F4C95D" />
               <path d="M12 14H33L50 31L32 49L12 30Z" fill="#FFD86B" />
               <circle cx="22" cy="22" r="5" fill="#FFF8E1" />
               <circle cx="22" cy="22" r="2" fill="#D9A441" />`
    }
];

const SIDEBAR_SYSTEM_LINKS = [
    {
        page: 'settings',
        href: 'settings.html',
        label: 'Settings',
        icon: `<path d="M27 8h10l2 7a19 19 0 0 1 5 3l7-2 5 9-5 5a19 19 0 0 1 0 6l5 5-5 9-7-2a19 19 0 0 1-5 3l-2 7H27l-2-7a19 19 0 0 1-5-3l-7 2-5-9 5-5a19 19 0 0 1 0-6l-5-5 5-9 7 2a19 19 0 0 1 5-3z" fill="#6C8E7B" />
               <circle cx="32" cy="32" r="9" fill="#F7F3EA" />
               <circle cx="32" cy="32" r="4" fill="#6C8E7B" />`
    }
];

function renderMenuLink(link, activePage) {
    const isActive = link.page === activePage;
    return `
        <a href="${link.href}" class="menu-item${isActive ? ' active' : ''}">
            <span class="menu-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">${link.icon}</svg>
            </span>
            <span class="menu-text">${link.label}</span>
        </a>`;
}

function renderSidebar(activePage) {
    const placeholder = document.getElementById('sidebarPlaceholder');
    if (!placeholder) return;

    const mainLinksHtml = SIDEBAR_LINKS.map((link) => renderMenuLink(link, activePage)).join('');
    const systemLinksHtml = SIDEBAR_SYSTEM_LINKS.map((link) => renderMenuLink(link, activePage)).join('');

    placeholder.innerHTML = `
        <aside class="admin-sidebar" id="adminSidebar">
            <div class="sidebar-brand">
                <a href="admin.html" class="brand-logo-box">
                    <img src="../images/tre1.png" alt="ARVELI Logo" class="brand-logo-img">
                </a>
                <button class="sidebar-close-btn" id="sidebarCloseBtn" aria-label="Close Sidebar">&times;</button>
            </div>

            <nav class="sidebar-menu">
                <p class="menu-label">Main Menu</p>
                ${mainLinksHtml}

                <p class="menu-label">System</p>
                ${systemLinksHtml}

                <a href="../home/index.html" class="menu-item text-link" target="_blank">
                    <span class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="24" fill="#5DADE2" />
                            <path d="M8 32h48M32 8c7 7 10 15 10 24s-3 17-10 24M32 8c-7 7-10 15-10 24s3 17 10 24" fill="none" stroke="#EAF6FF" stroke-width="3" />
                            <path d="M13 20c6 4 12 5 19 5s13-1 19-5M13 44c6-4 12-5 19-5s13 1 19 5" fill="none" stroke="#EAF6FF" stroke-width="2.5" />
                        </svg>
                    </span>
                    <span class="menu-text">View Customer Site</span>
                </a>
            </nav>

            <div class="sidebar-user">
                <div class="user-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="30" fill="#E8F3EC" />
                        <circle cx="32" cy="23" r="10" fill="#F2C6A0" />
                        <path d="M16 54 C17 43 23 37 32 37 C41 37 47 43 48 54 Z" fill="#4F8A5B" />
                        <path d="M25 40 C27 42 29 43 32 43 C35 43 37 42 39 40" fill="none" stroke="#74C69D" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </div>
                <div class="user-info">
                    <span class="user-name">Owner</span>
                    <span class="user-role">Nursery Admin</span>
                </div>
            </div>
        </aside>

        <div class="sidebar-overlay" id="sidebarOverlay"></div>`;
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function initSidebarBehavior() {
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
}

document.addEventListener('DOMContentLoaded', () => {
    const activePage = document.body.dataset.page || '';
    renderSidebar(activePage);
    initSidebarBehavior();
});
