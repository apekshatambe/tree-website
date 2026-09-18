document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("products-grid");

  if (!grid) return;


  // =============================
  // ELEMENTS
  // =============================

  const categorySelect =
    document.getElementById("filter-category");

  const sortSelect =
    document.getElementById("filter-sort");

  const clearBtn =
    document.querySelector(".filter-clear");

  const filterToggle =
    document.querySelector(".filter-toggle");

  const filterPanel =
    document.getElementById("filter-panel");

  const activeBadge =
    document.querySelector(".filter-active-badge");

  const resultsCount =
    document.querySelector(".filter-results-count");

  const noResults =
    document.querySelector(".no-results");

  const searchInput =
    document.getElementById("plant-search") ||
    document.querySelector(".search-container input");


  // =============================
  // PRODUCT CARDS
  // =============================

  const cards = Array.from(
    grid.querySelectorAll(".product-card")
  );


  // =============================
  // FILTER PANEL
  // =============================

  const setPanel = (open) => {

    if (!filterPanel || !filterToggle) {
      return;
    }

    filterPanel.hidden = !open;

    filterToggle.setAttribute(
      "aria-expanded",
      open ? "true" : "false"
    );
  };


  // =============================
  // CHECK PRODUCT
  // =============================

  const matches = (
    card,
    category,
    query
  ) => {

    // CATEGORY FILTER
    if (category !== "all") {

      const cardCategory =
        card.dataset.category || "";

      if (cardCategory !== category) {
        return false;
      }
    }


    // SEARCH FILTER
    if (query) {

      const searchText = query.toLowerCase();

      const name =
        card.dataset.name || "";

      const categoryText =
        card.dataset.category || "";

      const tag =
        card.querySelector(".product-tag");

      const title =
        card.querySelector("h3");

      const image =
        card.querySelector("img");


      const haystacks = [

        name,

        categoryText,

        tag ? tag.textContent : "",

        title ? title.textContent : "",

        image ? image.alt : ""

      ];


      const found = haystacks.some(
        (text) =>
          text
            .toLowerCase()
            .includes(searchText)
      );


      if (!found) {
        return false;
      }
    }


    return true;
  };


  // =============================
  // SORT PRODUCTS
  // =============================

  const sortCards = (
    list,
    sortBy
  ) => {

    return list.slice().sort(
      (a, b) => {

        // PRICE LOW → HIGH
        if (sortBy === "price-asc") {

          return (
            Number(a.dataset.price) -
            Number(b.dataset.price)
          );

        }


        // PRICE HIGH → LOW
        if (sortBy === "price-desc") {

          return (
            Number(b.dataset.price) -
            Number(a.dataset.price)
          );

        }


        // NAME A → Z
        if (sortBy === "name-asc") {

          return (
            (a.dataset.name || "")
              .localeCompare(
                b.dataset.name || ""
              )
          );

        }


        return 0;

      }
    );
  };


  // =============================
  // ACTIVE FILTER BADGE
  // =============================

  const updateBadge = () => {

    if (!activeBadge) {
      return;
    }

    let count = 0;


    // CATEGORY
    if (
      categorySelect &&
      categorySelect.value !== "all"
    ) {

      count++;

    }


    // SEARCH
    if (
      searchInput &&
      searchInput.value.trim()
    ) {

      count++;

    }


    activeBadge.textContent =
      String(count);

    activeBadge.hidden =
      count === 0;
  };


  // =============================
  // APPLY FILTERS
  // =============================

  const applyFilters = () => {

    const category =
      categorySelect
        ? categorySelect.value
        : "all";


    const sortBy =
      sortSelect
        ? sortSelect.value
        : "default";


    const query =
      searchInput
        ? searchInput.value.trim()
        : "";


    // FIND MATCHING PRODUCTS

    const visible =
      cards.filter(
        (card) =>
          matches(
            card,
            category,
            query
          )
      );


    // =============================
    // HIDE ALL PRODUCTS FIRST
    // =============================

    cards.forEach(
      (card) => {

        card.classList.toggle(
          "hidden",
          !visible.includes(card)
        );

      }
    );


    // =============================
    // SORT
    // =============================

    if (sortBy !== "default") {

      const sorted =
        sortCards(
          visible,
          sortBy
        );


      sorted.forEach(
        (card) => {

          grid.appendChild(card);

        }
      );

    }


    // =============================
    // RESULT COUNT
    // =============================

    const count =
      visible.length;


    if (resultsCount) {

      if (query && count === 0) {

        resultsCount.textContent =
          `No results for "${query}"`;

      }

      else if (
        count === cards.length &&
        !query &&
        category === "all"
      ) {

        resultsCount.textContent =
          `Showing all ${count} decorative items`;

      }

      else {

        resultsCount.textContent =
          `Showing ${count} of ${cards.length} decorative items`;

      }

    }


    // =============================
    // NO RESULTS
    // =============================

    if (noResults) {

      noResults.hidden =
        count > 0;


      if (query && count === 0) {

        noResults.textContent =
          `No decorative items match "${query}". Try another search.`;

      }

      else {

        noResults.textContent =
          "No decorative items match your filters. Try adjusting your selection.";

      }

    }


    // UPDATE BADGE

    updateBadge();

  };


  // =============================
  // CLEAR FILTERS
  // =============================

  const clearFilters = () => {

    if (categorySelect) {

      categorySelect.value =
        "all";

    }


    if (sortSelect) {

      sortSelect.value =
        "default";

    }


    if (searchInput) {

      searchInput.value =
        "";

    }


    applyFilters();

  };


  // =============================
  // FILTER BUTTON
  // =============================

  if (filterToggle) {

    filterToggle.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();


        if (!filterPanel) {
          return;
        }


        setPanel(
          filterPanel.hidden
        );

      }
    );

  }


  // =============================
  // CLOSE FILTER OUTSIDE CLICK
  // =============================

  document.addEventListener(
    "click",
    (event) => {

      if (
        !filterPanel ||
        filterPanel.hidden
      ) {
        return;
      }


      if (
        event.target.closest(
          ".shop-toolbar"
        ) ||
        event.target.closest(
          ".filter-toggle"
        )
      ) {
        return;
      }


      setPanel(false);

    }
  );


  // =============================
  // ESCAPE KEY
  // =============================

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {

        setPanel(false);

      }

    }
  );


  // =============================
  // CATEGORY CHANGE
  // =============================

  if (categorySelect) {

    categorySelect.addEventListener(
      "change",
      applyFilters
    );

  }


  // =============================
  // SORT CHANGE
  // =============================

  if (sortSelect) {

    sortSelect.addEventListener(
      "change",
      applyFilters
    );

  }


  // =============================
  // CLEAR BUTTON
  // =============================

  if (clearBtn) {

    clearBtn.addEventListener(
      "click",
      clearFilters
    );

  }


  // =============================
  // SEARCH
  // =============================

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      applyFilters
    );


    searchInput.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Enter") {

          event.preventDefault();

          applyFilters();

        }

      }
    );


    // =============================
    // URL SEARCH PARAMETER
    // =============================

    try {

      const q =
        new URLSearchParams(
          window.location.search
        ).get("q");


      if (q) {

        searchInput.value =
          q;

      }

    }

    catch (error) {

      console.error(
        "Could not read search query:",
        error
      );

    }

  }


  // =============================
  // INITIAL LOAD
  // =============================

  applyFilters();

});