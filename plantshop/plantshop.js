document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    const categorySelect = document.getElementById("filter-category");
    const careSelect = document.getElementById("filter-care");
    const lightSelect = document.getElementById("filter-light");
    const sortSelect = document.getElementById("filter-sort");
    const clearBtn = document.querySelector(".filter-clear");
    const filterToggle = document.querySelector(".filter-toggle");
    const filterPanel = document.getElementById("filter-panel");
    const activeBadge = document.querySelector(".filter-active-badge");
    const resultsCount = document.querySelector(".filter-results-count");
    const noResults = document.querySelector(".no-results");
    const searchInput = document.querySelector(".search-container input");

    const cards = Array.from(grid.querySelectorAll(".product-card"));

    function countActiveFilters() {
        let count = 0;
        if (categorySelect && categorySelect.value !== "all") count++;
        if (careSelect && careSelect.value !== "all") count++;
        if (lightSelect && lightSelect.value !== "all") count++;
        if (sortSelect && sortSelect.value !== "default") count++;
        if (searchInput && searchInput.value.trim()) count++;
        return count;
    }

    function updateActiveBadge() {
        if (!activeBadge) return;
        const count = countActiveFilters();
        activeBadge.textContent = count;
        activeBadge.hidden = count === 0;
    }

    function openFilterPanel() {
        if (!filterPanel || !filterToggle) return;
        filterPanel.hidden = false;
        filterToggle.setAttribute("aria-expanded", "true");
    }

    function closeFilterPanel() {
        if (!filterPanel || !filterToggle) return;
        filterPanel.hidden = true;
        filterToggle.setAttribute("aria-expanded", "false");
    }

    function toggleFilterPanel() {
        if (!filterPanel) return;
        if (filterPanel.hidden) {
            openFilterPanel();
        } else {
            closeFilterPanel();
        }
    }

    function matchesCategory(card, category) {
        if (category === "all") return true;
        const categories = (card.dataset.category || "").split(" ");
        return categories.includes(category);
    }

    function matchesCare(card, care) {
        if (care === "all") return true;
        return card.dataset.care === care;
    }

    function matchesLight(card, light) {
        if (light === "all") return true;
        return card.dataset.light === light;
    }

    function matchesSearch(card, query) {
        if (!query) return true;
        const name = (card.dataset.name || "").toLowerCase();
        return name.includes(query.toLowerCase());
    }

    function sortCards(visibleCards, sortBy) {
        return visibleCards.sort(function (a, b) {
            if (sortBy === "price-asc") {
                return Number(a.dataset.price) - Number(b.dataset.price);
            }
            if (sortBy === "price-desc") {
                return Number(b.dataset.price) - Number(a.dataset.price);
            }
            if (sortBy === "name-asc") {
                return (a.dataset.name || "").localeCompare(b.dataset.name || "");
            }
            return 0;
        });
    }

    function applyFilters() {
        const category = categorySelect ? categorySelect.value : "all";
        const care = careSelect ? careSelect.value : "all";
        const light = lightSelect ? lightSelect.value : "all";
        const sortBy = sortSelect ? sortSelect.value : "default";
        const query = searchInput ? searchInput.value.trim() : "";

        const visible = cards.filter(function (card) {
            return (
                matchesCategory(card, category) &&
                matchesCare(card, care) &&
                matchesLight(card, light) &&
                matchesSearch(card, query)
            );
        });

        cards.forEach(function (card) {
            card.classList.add("hidden");
        });

        const sorted = sortCards(visible, sortBy);
        sorted.forEach(function (card) {
            card.classList.remove("hidden");
            grid.appendChild(card);
        });

        const count = visible.length;
        if (resultsCount) {
            resultsCount.textContent =
                count === cards.length
                    ? "Showing all " + count + " plants"
                    : "Showing " + count + " of " + cards.length + " plants";
        }

        if (noResults) {
            noResults.hidden = count > 0;
        }

        updateActiveBadge();
    }

    function clearFilters() {
        if (categorySelect) categorySelect.value = "all";
        if (careSelect) careSelect.value = "all";
        if (lightSelect) lightSelect.value = "all";
        if (sortSelect) sortSelect.value = "default";
        if (searchInput) searchInput.value = "";
        applyFilters();
    }

    if (filterToggle) {
        filterToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleFilterPanel();
        });
    }

    document.addEventListener("click", function (e) {
        if (!filterPanel || filterPanel.hidden) return;
        if (e.target.closest(".shop-toolbar") || e.target.closest(".filter-toggle")) return;
        closeFilterPanel();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeFilterPanel();
    });

    [categorySelect, careSelect, lightSelect, sortSelect].forEach(function (el) {
        if (el) el.addEventListener("change", applyFilters);
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", clearFilters);
    }

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    applyFilters();
});