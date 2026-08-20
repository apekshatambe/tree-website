const WISHLIST_KEY = "plantWishlist";

function getWishlist() {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveWishlist(items) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

function getProductFromCard(card) {
    return {
        id: card.dataset.id,
        name: card.dataset.name,
        price: card.dataset.price || "",
        image: card.dataset.image
    };
}

function isInWishlist(id) {
    return getWishlist().some(function (item) {
        return item.id === id;
    });
}

function toggleWishlist(product) {
    let items = getWishlist();
    const exists = items.some(function (item) {
        return item.id === product.id;
    });

    if (exists) {
        items = items.filter(function (item) {
            return item.id !== product.id;
        });
    } else {
        items.push(product);
    }

    saveWishlist(items);
    updateWishlistUI();
}

function removeFromWishlist(id) {
    const items = getWishlist().filter(function (item) {
        return item.id !== id;
    });
    saveWishlist(items);
    updateWishlistUI();
}

function updateBadge() {
    const badge = document.querySelector(".wishlist-badge");
    const count = getWishlist().length;

    if (!badge) return;

    badge.textContent = count;
    badge.hidden = count === 0;
}

function syncProductButtons() {
    document.querySelectorAll(".product-card").forEach(function (card) {
        const btn = card.querySelector(".wishlist-btn");
        if (!btn) return;

        const active = isInWishlist(card.dataset.id);
        btn.classList.toggle("active", active);
        btn.setAttribute(
            "aria-label",
            active ? "Remove from wishlist" : "Add to wishlist"
        );
    });
}

function renderWishlistPanel() {
    const list = document.querySelector(".wishlist-items");
    const empty = document.querySelector(".wishlist-empty");
    const items = getWishlist();

    if (!list || !empty) return;

    list.innerHTML = "";

    if (items.length === 0) {
        empty.hidden = false;
        list.hidden = true;
        return;
    }

    empty.hidden = true;
    list.hidden = false;

    items.forEach(function (item) {
        const li = document.createElement("li");
        li.className = "wishlist-item";

        const priceHtml = item.price
            ? '<span class="wishlist-item-price">₹' + item.price + "</span>"
            : "";

        li.innerHTML =
            '<img src="' +
            item.image +
            '" alt="' +
            item.name +
            '" class="wishlist-item-img">' +
            '<div class="wishlist-item-info">' +
            '<span class="wishlist-item-name">' +
            item.name +
            "</span>" +
            priceHtml +
            "</div>" +
            '<button class="wishlist-remove" data-id="' +
            item.id +
            '" aria-label="Remove ' +
            item.name +
            ' from wishlist">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="18" y1="6" x2="6" y2="18"></line>' +
            '<line x1="6" y1="6" x2="18" y2="18"></line>' +
            "</svg>" +
            "</button>";

        list.appendChild(li);
    });
}

function updateWishlistUI() {
    updateBadge();
    syncProductButtons();
    renderWishlistPanel();
}

function openWishlistPanel() {
    const panel = document.querySelector(".wishlist-panel");
    const overlay = document.querySelector(".wishlist-overlay");
    if (panel) panel.classList.add("open");
    if (overlay) overlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeWishlistPanel() {
    const panel = document.querySelector(".wishlist-panel");
    const overlay = document.querySelector(".wishlist-overlay");
    if (panel) panel.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".product-card").forEach(function (card) {
        const btn = card.querySelector(".wishlist-btn");
        if (!btn) return;

        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(getProductFromCard(card));
        });
    });

    const wishlistToggle = document.querySelector(".wishlist-link");
    if (wishlistToggle) {
        wishlistToggle.addEventListener("click", function (e) {
            e.preventDefault();
            openWishlistPanel();
        });
    }

    const closeBtn = document.querySelector(".wishlist-close");
    const overlay = document.querySelector(".wishlist-overlay");

    if (closeBtn) {
        closeBtn.addEventListener("click", closeWishlistPanel);
    }

    if (overlay) {
        overlay.addEventListener("click", closeWishlistPanel);
    }

    document.addEventListener("click", function (e) {
        const removeBtn = e.target.closest(".wishlist-remove");
        if (removeBtn) {
            removeFromWishlist(removeBtn.dataset.id);
        }
    });

    updateWishlistUI();
});
