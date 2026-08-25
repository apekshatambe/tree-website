document.addEventListener("DOMContentLoaded", function () {
  var grid = document.getElementById("products-grid");
  if (!grid) return;

  var categorySelect = document.getElementById("filter-category");
  var careSelect = document.getElementById("filter-care");
  var lightSelect = document.getElementById("filter-light");
  var sortSelect = document.getElementById("filter-sort");
  var clearBtn = document.querySelector(".filter-clear");
  var filterToggle = document.querySelector(".filter-toggle");
  var filterPanel = document.getElementById("filter-panel");
  var activeBadge = document.querySelector(".filter-active-badge");
  var resultsCount = document.querySelector(".filter-results-count");
  var noResults = document.querySelector(".no-results");
  var searchInput =
    document.getElementById("plant-search") ||
    document.querySelector(".search-container input");
  var cards = Array.from(grid.querySelectorAll(".product-card"));

  function val(el, fallback) {
    return el ? el.value : fallback;
  }

  function setPanel(open) {
    if (!filterPanel || !filterToggle) return;
    filterPanel.hidden = !open;
    filterToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function matches(card, category, care, light, query) {
    if (category !== "all") {
      var cats = (card.dataset.category || "").split(/\s+/);
      if (cats.indexOf(category) === -1) return false;
    }
    if (care !== "all" && card.dataset.care !== care) return false;
    if (light !== "all" && card.dataset.light !== light) return false;

    if (query) {
      var q = query.toLowerCase();
      var tag = card.querySelector(".product-tag");
      var title = card.querySelector("h3");
      var haystacks = [
        card.dataset.name || "",
        card.dataset.category || "",
        card.dataset.care || "",
        card.dataset.light || "",
        tag ? tag.textContent : "",
        title ? title.textContent : ""
      ];
      var found = haystacks.some(function (text) {
        return text.toLowerCase().indexOf(q) !== -1;
      });
      if (!found) return false;
    }

    return true;
  }

  function sortCards(list, sortBy) {
    return list.slice().sort(function (a, b) {
      if (sortBy === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sortBy === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
      if (sortBy === "name-asc") {
        return (a.dataset.name || "").localeCompare(b.dataset.name || "");
      }
      return 0;
    });
  }

  function updateBadge() {
    if (!activeBadge) return;
    var count = 0;
    if (categorySelect && categorySelect.value !== "all") count++;
    if (careSelect && careSelect.value !== "all") count++;
    if (lightSelect && lightSelect.value !== "all") count++;
    if (searchInput && searchInput.value.trim()) count++;
    activeBadge.textContent = String(count);
    activeBadge.hidden = count === 0;
  }

  function applyFilters() {
    var category = val(categorySelect, "all");
    var care = val(careSelect, "all");
    var light = val(lightSelect, "all");
    var sortBy = val(sortSelect, "default");
    var query = searchInput ? searchInput.value.trim() : "";

    var visible = cards.filter(function (card) {
      return matches(card, category, care, light, query);
    });

    if (sortBy === "default") {
      cards.forEach(function (card) {
        card.classList.toggle("hidden", visible.indexOf(card) === -1);
      });
    } else {
      cards.forEach(function (card) {
        card.classList.add("hidden");
      });
      sortCards(visible, sortBy).forEach(function (card) {
        card.classList.remove("hidden");
        grid.appendChild(card);
      });
    }

    var count = visible.length;
    if (resultsCount) {
      if (query && count === 0) {
        resultsCount.textContent = 'No results for "' + query + '"';
      } else if (count === cards.length && !query) {
        resultsCount.textContent = "Showing all " + count + " plants";
      } else {
        resultsCount.textContent =
          "Showing " + count + " of " + cards.length + " plants";
      }
    }

    if (noResults) {
      noResults.hidden = count > 0;
      noResults.textContent =
        query && count === 0
          ? 'No plants match "' + query + '". Try another search.'
          : "No plants match your filters. Try adjusting your selection.";
    }

    updateBadge();
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
      if (!filterPanel) return;
      setPanel(filterPanel.hidden);
    });
  }

  document.addEventListener("click", function (e) {
    if (!filterPanel || filterPanel.hidden) return;
    if (e.target.closest(".shop-toolbar") || e.target.closest(".filter-toggle")) return;
    setPanel(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setPanel(false);
  });

  [categorySelect, careSelect, lightSelect, sortSelect].forEach(function (el) {
    if (el) el.addEventListener("change", applyFilters);
  });

  if (clearBtn) clearBtn.addEventListener("click", clearFilters);

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        applyFilters();
      }
    });

    try {
      var q = new URLSearchParams(window.location.search).get("q");
      if (q) searchInput.value = q;
    } catch (err) {}
  }

  applyFilters();
});
