document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-container input[type='search']");
  if (!searchInput || document.getElementById("products-grid")) return;
  const searchForm = searchInput.closest("form");
  const suggestions = document.getElementById("home-search-suggestions");
  const clearButton = document.querySelector(".search-clear");
  let activeSuggestion = -1;

  const productOptions = [
    { label: "Snake Plant", hint: "Plant · ₹158", icon: "local_florist", image: "../images/snake-plant.jpg", target: "../plantshop/plantshop.html" },
    { label: "Areca Palm", hint: "Plant · ₹158", icon: "local_florist", image: "../images/areca-palm.jpg", target: "../plantshop/plantshop.html" },
    { label: "Peace Lily", hint: "Plant · ₹158", icon: "local_florist", image: "../images/peace-lily.jpg", target: "../plantshop/plantshop.html" },
    { label: "Pothos", hint: "Plant · ₹99", icon: "local_florist", image: "../images/pothos.jpg", target: "../plantshop/plantshop.html" },
    { label: "Cherry Tomato", hint: "Seed · ₹49", icon: "spa", image: "../images/seedimg/cherry-tomato.png", target: "../seedshop/seedshop.html" },
    { label: "Basil", hint: "Seed · ₹39", icon: "spa", image: "../images/seedimg/basil.png", target: "../seedshop/seedshop.html" },
    { label: "Sunflower", hint: "Seed · ₹59", icon: "spa", image: "../images/seedimg/sunflower.png", target: "../seedshop/seedshop.html" },
    { label: "Marigold", hint: "Seed · ₹45", icon: "spa", image: "../images/seedimg/marigold.png", target: "../seedshop/seedshop.html" },
    { label: "Arveli Handpainted Clay Pots", hint: "Pot · ₹199", icon: "yard", image: "../images/pot/clay pots.jfif", target: "../potshop/potshop.html" },
    { label: "White Ceramic", hint: "Pot · ₹349", icon: "yard", image: "../images/pot/WHITE CERAMIC.jfif", target: "../potshop/potshop.html" },
    { label: "Hanging Rope Pot", hint: "Pot · ₹279", icon: "yard", image: "../images/pot/Rope PoT.jfif", target: "../potshop/potshop.html" },
    { label: "Self-Watering Pot", hint: "Pot · ₹499", icon: "yard", image: "../images/pot/Self watering plant pots.jfif", target: "../potshop/potshop.html" },
    { label: "Large Floor Planter", hint: "Pot · ₹899", icon: "yard", image: "../images/pot/large pot.jfif", target: "../potshop/potshop.html" },
    { label: "Concrete Minimal", hint: "Pot · ₹429", icon: "yard", image: "../images/pot/DIY Faux Concrete Planters.jfif", target: "../potshop/potshop.html" },
    { label: "Gardening Hand Glove", hint: "Tool · ₹199", icon: "handyman", image: "../images/tool/gloves.jpg", target: "../toolshop/tool.html" },
    { label: "Organic Plant Fertilizer", hint: "Fertilizer · ₹249", icon: "compost", image: "../images/fer and soil/fertilizer.jfif", target: "../fertshop/fertshop.html" },
    { label: "Premium Potting Soil", hint: "Soil · ₹199", icon: "compost", image: "../images/fer and soil/soil.jfif", target: "../fertshop/fertshop.html" },
    { label: "Pebbles", hint: "Decorative · ₹149", icon: "auto_awesome", image: "../images/decorative/pebbles.jfif", target: "../decorative/decoratives.html" },
    { label: "Bamboo Plant Stand", hint: "Decorative · ₹899", icon: "auto_awesome", image: "../images/decorative/bamboo-plant-stand.jfif", target: "../decorative/decoratives.html" },
    { label: "Zen Garden", hint: "Decorative · ₹599", icon: "auto_awesome", image: "../images/decorative/zen-garden.jfif", target: "../decorative/decoratives.html" },
    { label: "Stepping Stones", hint: "Decorative · ₹399", icon: "auto_awesome", image: "../images/decorative/stepping-stones.jfif", target: "../decorative/decoratives.html" }
  ];
  const searchOptions = productOptions;

  const shopForQuery = (query) => {
    const value = query.toLowerCase();
    const product = value.length > 1
      ? productOptions.find((option) =>
        value.includes(option.label.toLowerCase()) || option.label.toLowerCase().includes(value)
      )
      : null;
    if (product) return product.target;
    if (/(fertilizer|fertiliser|soil|compost|manure)/.test(value)) return "../fertshop/fertshop.html";
    if (/(pot|planter|ceramic|terracotta|concrete)/.test(value)) return "../potshop/potshop.html";
    if (/(seed|basil|sunflower|marigold|tomato)/.test(value)) return "../seedshop/seedshop.html";
    if (/(tool|trowel|glove|pruner|shovel)/.test(value)) return "../toolshop/tool.html";
    if (/(decor|pebble|stone|bamboo|zen)/.test(value)) return "../decorative/decoratives.html";
    return "../plantshop/plantshop.html";
  };

  const goToSearch = (query, target = shopForQuery(query)) => {
    window.location.href = `${target}?q=${encodeURIComponent(query)}`;
  };

  const hideSuggestions = () => {
    if (!suggestions) return;
    suggestions.hidden = true;
    suggestions.replaceChildren();
    activeSuggestion = -1;
  };

  const showSuggestions = () => {
    if (!suggestions) return;
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      hideSuggestions();
      return;
    }
    const options = searchOptions;
    const matches = options.filter((option) =>
      !query || `${option.label} ${option.hint}`.toLowerCase().includes(query)
    );
    suggestions.replaceChildren();
    matches.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-suggestion";
      button.setAttribute("role", "option");
      button.dataset.index = String(index);
      button.innerHTML = `<img class="search-suggestion-image" src="${option.image}" alt=""><span class="search-suggestion-copy"><strong>${option.label}</strong><small>${option.hint}</small></span>`;
      button.addEventListener("click", () => {
        searchInput.value = option.label;
        goToSearch(option.label, option.target);
      });
      suggestions.appendChild(button);
    });
    suggestions.hidden = matches.length === 0;
    activeSuggestion = -1;
  };

  const updateClearButton = () => {
    if (clearButton) clearButton.hidden = !searchInput.value;
  };

  const submitSearch = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const query = searchInput.value.trim();
    if (query) goToSearch(query);
  };

  searchInput.addEventListener("input", () => {
    updateClearButton();
    showSuggestions();
  });
  searchInput.addEventListener("keydown", (event) => {
    const items = suggestions ? [...suggestions.querySelectorAll(".search-suggestion")] : [];
    if (event.key === "ArrowDown" && items.length) {
      event.preventDefault();
      activeSuggestion = (activeSuggestion + 1) % items.length;
      items[activeSuggestion].focus();
      return;
    }
    if (event.key === "ArrowUp" && items.length) {
      event.preventDefault();
      activeSuggestion = (activeSuggestion - 1 + items.length) % items.length;
      items[activeSuggestion].focus();
      return;
    }
    if (event.key === "Escape") {
      hideSuggestions();
      return;
    }
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const selected = items[activeSuggestion];
    if (selected) selected.click();
    else submitSearch(event);
  }, true);

  if (searchForm) searchForm.addEventListener("submit", submitSearch);
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      updateClearButton();
      showSuggestions();
    });
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-container")) hideSuggestions();
  });

  updateClearButton();
});
