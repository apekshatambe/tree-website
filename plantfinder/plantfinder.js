/* ==========================================================================
   PLANT BOOKING SYSTEM — PLANT FINDER JAVASCRIPT (plantfinder.js)
   Simple, Beginner-Friendly Vanilla JS with Plant Dataset & Recommendation Logic
   ========================================================================== */

// 1. PLANT DATASET
const plantDatabase = [
  {
    id: "snake-plant",
    name: "Snake Plant (Sansevieria)",
    category: "Indoor Air Purifier",
    environment: "indoor",
    sunlight: ["low", "medium", "bright"],
    watering: "low",
    maintenance: "easy",
    purpose: ["air-purifying", "beginner", "decoration"],
    image: "../images/snake-plant.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1599598425947-0206455429d5?q=80&w=600&auto=format&fit=crop",
    description: "Hardy, air-purifying plant that thrives on neglect. Perfect for bedrooms and dimly lit corners.",
    lightText: "Low to Bright Indirect",
    waterText: "Water Every 2-3 Weeks",
    careText: "Super Easy",
    link: "../productpage/snakelant.html"
  },
  {
    id: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    category: "Tropical Indoor Feature",
    environment: "indoor",
    sunlight: ["medium", "bright"],
    watering: "moderate",
    maintenance: "easy",
    purpose: ["decoration", "beginner"],
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600&auto=format&fit=crop",
    fallbackImage: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600&auto=format&fit=crop",
    description: "Famous for its Swiss-cheese split leaves. Adds a dramatic tropical aesthetic to bright living spaces.",
    lightText: "Medium to Bright Indirect",
    waterText: "Water Weekly",
    careText: "Easy Care",
    link: "../plantshop/plantshop.html"
  },
  {
    id: "areca-palm",
    name: "Areca Palm",
    category: "Outdoor / Indoor Palm",
    environment: "indoor",
    sunlight: ["medium", "bright"],
    watering: "moderate",
    maintenance: "moderate",
    purpose: ["air-purifying", "decoration"],
    image: "../images/areca-palm.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?q=80&w=600&auto=format&fit=crop",
    description: "Feathery tropical fronds that naturally humidify and purify indoor air or bright sheltered balconies.",
    lightText: "Bright Indirect Light",
    waterText: "Water 1-2 Times a Week",
    careText: "Moderate",
    link: "../productpage/areca-palm.html"
  },
  {
    id: "peace-lily",
    name: "Peace Lily",
    category: "Flowering Air Purifier",
    environment: "indoor",
    sunlight: ["low", "medium"],
    watering: "moderate",
    maintenance: "easy",
    purpose: ["air-purifying", "decoration", "beginner"],
    image: "../images/peace-lily.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?q=80&w=600&auto=format&fit=crop",
    description: "Elegant white blooms with glossy dark foliage. Expresses thirst by drooping gently when it needs water.",
    lightText: "Low to Medium Shade",
    waterText: "Keep Moist / Weekly",
    careText: "Easy Care",
    link: "../productpage/peace-lily.html"
  },
  {
    id: "pothos",
    name: "Golden Pothos",
    category: "Trailing Vine",
    environment: "indoor",
    sunlight: ["low", "medium", "bright"],
    watering: "low",
    maintenance: "easy",
    purpose: ["beginner", "decoration", "air-purifying"],
    image: "../images/pothos.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1596724809804-94982635905c?q=80&w=600&auto=format&fit=crop",
    description: "Fast-growing trailing vine ideal for hanging planters or shelves. Very adaptable to various lighting.",
    lightText: "Low to Bright Light",
    waterText: "Water When Top Soil Dries",
    careText: "Beginner Friendly",
    link: "../productpage/pothos.html"
  },
  {
    id: "aloe-vera",
    name: "Aloe Vera",
    category: "Medicinal Succulent",
    environment: "outdoor",
    sunlight: ["bright"],
    watering: "low",
    maintenance: "easy",
    purpose: ["beginner", "air-purifying"],
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=600&auto=format&fit=crop",
    fallbackImage: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=600&auto=format&fit=crop",
    description: "Sun-loving succulent known for its soothing gel. Requires bright direct sun and minimal water.",
    lightText: "Direct Bright Sun",
    waterText: "Water Sparingly (Every 3 wks)",
    careText: "Super Easy",
    link: "../plantshop/plantshop.html"
  },
  {
    id: "fiddle-leaf-fig",
    name: "Fiddle Leaf Fig",
    category: "Statement Tree",
    environment: "indoor",
    sunlight: ["bright"],
    watering: "moderate",
    maintenance: "high",
    purpose: ["decoration"],
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop",
    fallbackImage: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop",
    description: "Architectural favorite with broad violin-shaped leaves. Rewards consistent light and care with regal height.",
    lightText: "Bright Consistent Light",
    waterText: "Water Weekly",
    careText: "High Attention",
    link: "../plantshop/plantshop.html"
  },
  {
    id: "bougainvillea",
    name: "Bougainvillea",
    category: "Outdoor Flowering Climber",
    environment: "outdoor",
    sunlight: ["bright"],
    watering: "moderate",
    maintenance: "moderate",
    purpose: ["decoration"],
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=600&auto=format&fit=crop",
    fallbackImage: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=600&auto=format&fit=crop",
    description: "Vibrant outdoor bloomer that loves hot sunny balconies, fences, and garden pergolas.",
    lightText: "Full Outdoor Sunlight",
    waterText: "Moderate Water",
    careText: "Moderate Care",
    link: "../plantshop/plantshop.html"
  }
];

// 2. USER SELECTION STATE (Starts unselected/null by default)
const currentPreferences = {
  environment: null,
  sunlight: null,
  watering: null,
  maintenance: null,
  purpose: null
};

// 3. INITIALIZE INTERACTIVITY ON DOM LOADED
document.addEventListener("DOMContentLoaded", () => {
  setupQuizOptionClickHandlers();
  setupActionButtons();
  // Display initial prompt guiding user to select options
  renderInitialPrompt();
});

// 4. OPTION BUTTON CLICK HANDLER
function setupQuizOptionClickHandlers() {
  const quizGroups = document.querySelectorAll(".quiz-group");

  quizGroups.forEach((group) => {
    const questionKey = group.getAttribute("data-question");
    const optionButtons = group.querySelectorAll(".quiz-btn");

    optionButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Deselect all sibling buttons in this group
        optionButtons.forEach((b) => b.classList.remove("active"));
        
        // Select clicked button
        btn.classList.add("active");

        // Save selected value in preference state
        const selectedValue = btn.getAttribute("data-value");
        if (questionKey && selectedValue) {
          currentPreferences[questionKey] = selectedValue;
        }
      });
    });
  });
}

// 5. ACTION BUTTON HANDLERS
function setupActionButtons() {
  const findBtn = document.getElementById("findPlantsBtn");
  const resetBtn = document.getElementById("resetQuizBtn");

  if (findBtn) {
    findBtn.addEventListener("click", () => {
      if (findAndRenderRecommendations()) {
        scrollToResults();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetQuizSelections();
    });
  }
}

// Reset Quiz Selections to clean unselected state
function resetQuizSelections() {
  currentPreferences.environment = null;
  currentPreferences.sunlight = null;
  currentPreferences.watering = null;
  currentPreferences.maintenance = null;
  currentPreferences.purpose = null;

  const optionButtons = document.querySelectorAll(".quiz-btn");
  optionButtons.forEach((btn) => btn.classList.remove("active"));

  renderInitialPrompt();
}

// 6. INITIAL PROMPT WHEN NO OPTIONS HAVE BEEN SEARCHED YET
function renderPrompt(title, message) {
  const container = document.getElementById("recommendationsGrid");
  const countSubtext = document.getElementById("resultsCountText");

  if (!container) return;

  container.innerHTML = `
    <div class="empty-results">
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;

  if (countSubtext) {
    countSubtext.textContent = message;
  }
}

function renderInitialPrompt() {
  renderPrompt(
    "Ready to find your plant?",
    "Select your preferences above and click \"Find My Recommended Plants\" to discover recommendations tailored for your home."
  );
}

// 7. PLANT MATCHING & FILTERING ALGORITHM
function findAndRenderRecommendations() {
  // Check if at least one preference is selected
  const hasSelections = Object.values(currentPreferences).some((val) => val !== null);

  if (!hasSelections) {
    renderPrompt(
      "Tell us a little more",
      "Select at least one preference above, then click \"Find My Recommended Plants\" to see your matches."
    );
    scrollToResults();
    return false;
  }

  // Score each plant based on criteria matches
  const scoredPlants = plantDatabase.map((plant) => {
    let score = 0;

    // Environment match
    if (currentPreferences.environment) {
      if (plant.environment === currentPreferences.environment) score += 35;
    } else {
      score += 10;
    }

    // Sunlight match
    if (currentPreferences.sunlight) {
      if (Array.isArray(plant.sunlight)) {
        if (plant.sunlight.includes(currentPreferences.sunlight)) score += 25;
      } else if (plant.sunlight === currentPreferences.sunlight) {
        score += 25;
      }
    }

    // Watering match
    if (currentPreferences.watering) {
      if (plant.watering === currentPreferences.watering) score += 20;
    }

    // Maintenance match
    if (currentPreferences.maintenance) {
      if (plant.maintenance === currentPreferences.maintenance) score += 10;
    }

    // Purpose match
    if (currentPreferences.purpose) {
      if (Array.isArray(plant.purpose) && plant.purpose.includes(currentPreferences.purpose)) {
        score += 10;
      }
    }

    return { plant, score };
  });

  // Filter & sort results
  const matchingResults = scoredPlants
    .filter((item) => item.score > 20)
    .sort((a, b) => b.score - a.score);

  renderPlantCards(matchingResults);
  return true;
}

// 8. RENDER RECOMMENDATION CARDS TO HTML
function renderPlantCards(results) {
  const container = document.getElementById("recommendationsGrid");
  const countSubtext = document.getElementById("resultsCountText");

  if (!container) return;

  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = `
      <div class="empty-results">
        <h3>No Exact Plant Match Found</h3>
        <p>Try selecting different sunlight or care options to explore more plants.</p>
        <button type="button" class="btn btn--primary" onclick="resetQuizSelections()">Clear Selections</button>
      </div>
    `;
    if (countSubtext) countSubtext.textContent = "Showing 0 matched plants";
    return;
  }

  if (countSubtext) {
    countSubtext.textContent = `Found ${results.length} recommended plant match${results.length > 1 ? "es" : ""} for your choices:`;
  }

  results.forEach((item) => {
    const p = item.plant;
    const matchPercent = Math.min(100, Math.max(70, item.score));

    const card = document.createElement("div");
    card.className = "recommend-card";

    card.innerHTML = `
      <div class="recommend-image-wrapper">
        <span class="recommend-match-badge">${matchPercent}% Match</span>
        <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null; this.src='${p.fallbackImage}';" />
      </div>
      <div class="recommend-card-body">
        <span class="recommend-category">${p.category}</span>
        <h3 class="recommend-title">${p.name}</h3>
        <p class="recommend-desc">${p.description}</p>
        
        <div class="recommend-specs">
          <span class="spec-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ${p.lightText}
          </span>
          <span class="spec-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            ${p.waterText}
          </span>
          <span class="spec-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            ${p.careText}
          </span>
        </div>

        <div class="recommend-card-footer">
          <a href="${p.link}" class="btn-view-plant">View Plant Details &rarr;</a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// 9. SMOOTH SCROLL TO RESULTS
function scrollToResults() {
  const resultsSection = document.getElementById("results");
  if (resultsSection) {
    resultsSection.scrollIntoView({ behavior: "smooth" });
  }
}