document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const categorySelect = document.getElementById("filter-category");
  const sizeSelect = document.getElementById("filter-size");
  const useSelect = document.getElementById("filter-use");
  const sortSelect = document.getElementById("filter-sort");
  const clearBtn = document.querySelector(".filter-clear");
  const filterToggle = document.querySelector(".filter-toggle");
  const filterPanel = document.getElementById("filter-panel");
  const activeBadge = document.querySelector(".filter-active-badge");
  const resultsCount = document.querySelector(".filter-results-count");
  const noResults = document.querySelector(".no-results");
  const searchInput =
    document.getElementById("pot-search") ||
    document.querySelector(".search-container input");
  const cards = Array.from(grid.querySelectorAll(".product-card"));

  const val = (el, fallback) => (el ? el.value : fallback);

  const setPanel = (open) => {
    if (!filterPanel || !filterToggle) return;
    filterPanel.hidden = !open;
    filterToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const matches = (card, category, size, use, query) => {
    if (category !== "all") {
      const cats = (card.dataset.category || "").split(/\s+/);
      if (!cats.includes(category)) return false;
    }
    if (size !== "all" && card.dataset.size !== size) return false;
    if (use !== "all" && card.dataset.use !== use) return false;

    if (query) {
      const q = query.toLowerCase();
      const tag = card.querySelector(".product-tag");
      const title = card.querySelector("h3");
      const haystacks = [
        card.dataset.name || "",
        card.dataset.category || "",
        card.dataset.size || "",
        card.dataset.use || "",
        tag ? tag.textContent : "",
        title ? title.textContent : ""
      ];
      const found = haystacks.some((text) => text.toLowerCase().includes(q));
      if (!found) return false;
    }

    return true;
  };

  const sortCards = (list, sortBy) =>
    list.slice().sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sortBy === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
      if (sortBy === "name-asc") {
        return (a.dataset.name || "").localeCompare(b.dataset.name || "");
      }
      return 0;
    });

  const updateBadge = () => {
    if (!activeBadge) return;
    let count = 0;
    if (categorySelect && categorySelect.value !== "all") count++;
    if (sizeSelect && sizeSelect.value !== "all") count++;
    if (useSelect && useSelect.value !== "all") count++;
    if (searchInput && searchInput.value.trim()) count++;
    activeBadge.textContent = String(count);
    activeBadge.hidden = count === 0;
  };

  const applyFilters = () => {
    const category = val(categorySelect, "all");
    const size = val(sizeSelect, "all");
    const use = val(useSelect, "all");
    const sortBy = val(sortSelect, "default");
    const query = searchInput ? searchInput.value.trim() : "";

    const visible = cards.filter((card) =>
      matches(card, category, size, use, query)
    );

    if (sortBy === "default") {
      cards.forEach((card) => {
        card.classList.toggle("hidden", !visible.includes(card));
      });
    } else {
      cards.forEach((card) => card.classList.add("hidden"));
      sortCards(visible, sortBy).forEach((card) => {
        card.classList.remove("hidden");
        grid.appendChild(card);
      });
    }

    const count = visible.length;
    if (resultsCount) {
      if (query && count === 0) {
        resultsCount.textContent = `No results for "${query}"`;
      } else if (count === cards.length && !query) {
        resultsCount.textContent = `Showing all ${count} pots`;
      } else {
        resultsCount.textContent = `Showing ${count} of ${cards.length} pots`;
      }
    }

    if (noResults) {
      noResults.hidden = count > 0;
      noResults.textContent =
        query && count === 0
          ? `No pots match "${query}". Try another search.`
          : "No pots match your filters. Try adjusting your selection.";
    }

    updateBadge();
  };

  const clearFilters = () => {
    if (categorySelect) categorySelect.value = "all";
    if (sizeSelect) sizeSelect.value = "all";
    if (useSelect) useSelect.value = "all";
    if (sortSelect) sortSelect.value = "default";
    if (searchInput) searchInput.value = "";
    applyFilters();
  };

  if (filterToggle) {
    filterToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!filterPanel) return;
      setPanel(filterPanel.hidden);
    });
  }

  document.addEventListener("click", (e) => {
    if (!filterPanel || filterPanel.hidden) return;
    if (e.target.closest(".shop-toolbar") || e.target.closest(".filter-toggle")) return;
    setPanel(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setPanel(false);
  });

  [categorySelect, sizeSelect, useSelect, sortSelect].forEach((el) => {
    if (el) el.addEventListener("change", applyFilters);
  });

  if (clearBtn) clearBtn.addEventListener("click", clearFilters);

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyFilters();
      }
    });

    try {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q) searchInput.value = q;
    } catch (err) {}
  }

  applyFilters();
});
