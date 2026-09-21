document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const categorySelect = document.getElementById("filter-category");
  const sizeSelect = document.getElementById("filter-size");
  const useSelect = document.getElementById("filter-use");
  const sortSelect = document.getElementById("filter-sort");
  const clearButton = document.querySelector(".filter-clear");
  const filterToggle = document.querySelector(".filter-toggle");
  const filterPanel = document.getElementById("filter-panel");
  const activeBadge = document.querySelector(".filter-active-badge");
  const resultsCount = document.querySelector(".filter-results-count");
  const noResults = document.querySelector(".no-results");
  const searchInput = document.getElementById("fert-search");
  const cards = Array.from(grid.querySelectorAll(".product-card"));

  const matches = (card) => {
    const category = categorySelect.value;
    const size = sizeSelect.value;
    const use = useSelect.value;
    const query = searchInput.value.trim().toLowerCase();
    const text = `${card.dataset.name} ${card.dataset.category} ${card.dataset.size} ${card.dataset.use} ${card.textContent}`.toLowerCase();

    return (category === "all" || card.dataset.category === category) &&
      (size === "all" || card.dataset.size === size) &&
      (use === "all" || card.dataset.use.split(" ").includes(use)) &&
      (!query || text.includes(query));
  };

  const applyFilters = () => {
    const visible = cards.filter(matches);
    const sort = sortSelect.value;
    const ordered = visible.slice().sort((a, b) => {
      if (sort === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
      if (sort === "name-asc") return a.dataset.name.localeCompare(b.dataset.name);
      return cards.indexOf(a) - cards.indexOf(b);
    });

    cards.forEach((card) => card.classList.add("hidden"));
    ordered.forEach((card) => {
      card.classList.remove("hidden");
      grid.appendChild(card);
    });

    const query = searchInput.value.trim();
    resultsCount.textContent = query && visible.length === 0
      ? `No results for "${query}"`
      : visible.length === cards.length && !query
        ? `Showing all ${visible.length} soil and fertilizer products`
        : `Showing ${visible.length} of ${cards.length} products`;
    noResults.hidden = visible.length > 0;
    noResults.textContent = query && visible.length === 0
      ? `No soil or fertilizer products match "${query}". Try another search.`
      : "No soil or fertilizer products match your filters. Try adjusting your selection.";

    const activeFilters = [categorySelect, sizeSelect, useSelect].filter((select) => select.value !== "all").length + (query ? 1 : 0);
    activeBadge.textContent = String(activeFilters);
    activeBadge.hidden = activeFilters === 0;
  };

  filterToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    filterPanel.hidden = !filterPanel.hidden;
    filterToggle.setAttribute("aria-expanded", String(!filterPanel.hidden));
  });

  document.addEventListener("click", (event) => {
    if (!filterPanel.hidden && !event.target.closest(".shop-toolbar") && !event.target.closest(".filter-toggle")) {
      filterPanel.hidden = true;
      filterToggle.setAttribute("aria-expanded", "false");
    }
  });

  [categorySelect, sizeSelect, useSelect, sortSelect].forEach((select) => select.addEventListener("change", applyFilters));
  searchInput.addEventListener("input", applyFilters);
  clearButton.addEventListener("click", () => {
    categorySelect.value = "all";
    sizeSelect.value = "all";
    useSelect.value = "all";
    sortSelect.value = "default";
    searchInput.value = "";
    applyFilters();
  });

  applyFilters();
});
