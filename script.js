// Shared shell: one header/footer for all static pages.
const pageName = document.body.dataset.page || "home";

function renderSiteShell() {
  const headerHost = document.querySelector("[data-site-header]");
  const footerHost = document.querySelector("[data-site-footer]");
  const links = [
    ["home", "Home", "index.html"],
    ["puppies", "Puppies", "puppies.html"],
    ["reviews", "Reviews", "reviews.html"],
    ["delivery", "Delivery", "delivery.html"],
    ["nutrition", "Nutrition", "nutrition.html"],
    ["about", "About", "about.html"],
    ["contact", "Contact", "contact.html"]
  ];

  if (headerHost) {
    headerHost.innerHTML = `
      <header class="site-header" id="top">
        <a class="brand" href="index.html" aria-label="PawCierge">
          <img class="brand__mark" src="images/Logo/logo-1.png" alt="">
          <span>PawCierge</span>
        </a>
        <nav class="nav" aria-label="Main navigation">
          ${links.map(([key, label, href]) => `<a class="${pageName === key ? "is-current" : ""}" href="${href}">${label}</a>`).join("")}
        </nav>
      </header>
    `;
  }

  if (footerHost) {
    footerHost.innerHTML = `
      <footer class="footer">
        <div class="footer__brand">
          <a class="brand" href="index.html">
            <img class="brand__mark" src="images/Logo/logo-1.png" alt="">
            <span>PawCierge</span>
          </a>
          <p>A premium concierge service for matching, delivering, and helping small-breed puppies adjust at home.</p>
        </div>
        <div class="footer__links">
          <a href="puppies.html">Available puppies</a>
          <a href="delivery.html">Delivery process</a>
          <a href="nutrition.html">Nutrition guide</a>
          <a href="contact.html">Private request</a>
        </div>
        <div class="footer__meta">
          <p>International Puppy Concierge Service</p>
          <p>Working since 2024</p>
          <p>&copy; 2026 PawCierge. All rights reserved.</p>
          <nav aria-label="Social links">
            <a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://t.me/" target="_blank" rel="noreferrer">Telegram</a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer">WhatsApp</a>
          </nav>
        </div>
      </footer>
    `;
  }
}

renderSiteShell();
window.requestAnimationFrame(() => document.body.classList.add("page-ready"));

// The intro runs once on the home page and can be dismissed with Skip intro.
const intro = document.querySelector("#intro");
const skipIntroButton = document.querySelector("#skipIntro");

function closeIntro() {
  if (!intro || intro.classList.contains("intro--hidden")) return;
  intro.classList.add("intro--hidden");
  window.setTimeout(() => intro.remove(), 900);
}

window.addEventListener("load", () => {
  if (intro) window.setTimeout(closeIntro, 5200);
});

skipIntroButton?.addEventListener("click", closeIntro);

// Render puppy cards from data/puppies.js.
const puppyGrid = document.querySelector("#puppyGrid");
const catalogControls = document.querySelector("#catalogControls");
const catalogCount = document.querySelector("#catalogCount");
const preferredPuppySelect = document.querySelector("#preferredPuppySelect");
const puppyDetail = document.querySelector("#puppyDetail");
const detailPanel = puppyDetail?.querySelector(".puppy-detail__panel");
const detailMainImage = document.querySelector("#detailMainImage");
const detailThumbs = document.querySelector("#detailThumbs");
const detailStatus = document.querySelector("#detailStatus");
const puppyDetailTitle = document.querySelector("#puppyDetailTitle");
const detailSummary = document.querySelector("#detailSummary");
const detailBreed = document.querySelector("#detailBreed");
const detailAge = document.querySelector("#detailAge");
const detailGender = document.querySelector("#detailGender");
const detailPrice = document.querySelector("#detailPrice");
const detailTraits = document.querySelector("#detailTraits");
const detailFeeding = document.querySelector("#detailFeeding");
const detailVaccination = document.querySelector("#detailVaccination");
const detailDelivery = document.querySelector("#detailDelivery");
const detailInquiryForm = document.querySelector("#detailInquiryForm");
const detailFormMessage = document.querySelector("#detailFormMessage");
let activeDetailPuppy = null;

function getPuppies() {
  return window.PAWCIERGE_PUPPIES || [];
}

function populateCatalogFilters() {
  if (!catalogControls) return;
  const breedSelect = catalogControls.elements.breed;
  const breeds = [...new Set(getPuppies().map((puppy) => puppy.breed))].sort();

  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed;
    option.textContent = breed;
    breedSelect.append(option);
  });
}

function populatePreferredPuppies() {
  const selects = [...document.querySelectorAll("#preferredPuppySelect, [data-preferred-puppy]")];
  if (!selects.length) return;
  const requested = new URLSearchParams(window.location.search).get("puppy");

  selects.forEach((select) => {
    const existing = new Set([...select.options].map((option) => option.value));
    getPuppies().forEach((puppy) => {
      if (existing.has(puppy.name)) return;
      const option = document.createElement("option");
      option.value = puppy.name;
      option.textContent = `${puppy.name} - ${puppy.breed}`;
      select.append(option);
    });
    if (requested && [...select.options].some((option) => option.value === requested)) {
      select.value = requested;
    }
  });
}

function getFilteredPuppies() {
  const puppies = [...getPuppies()];
  if (!catalogControls) {
    return puppyGrid?.dataset.featured === "true" ? puppies.slice(0, 3) : puppies;
  }

  const formData = new FormData(catalogControls);
  const breed = formData.get("breed");
  const gender = formData.get("gender");
  const age = formData.get("age");
  const status = formData.get("status");
  const sort = formData.get("sort");

  const filtered = puppies.filter((puppy) => {
    const breedMatch = breed === "all" || puppy.breed === breed;
    const genderMatch = gender === "all" || puppy.gender === gender;
    const statusMatch = status === "all" || puppy.statusKey === status;
    const ageMatch = age === "all"
      || (age === "under3" && puppy.ageMonths < 3)
      || (age === "3to4" && puppy.ageMonths >= 3 && puppy.ageMonths <= 4)
      || (age === "over4" && puppy.ageMonths >= 4);

    return breedMatch && genderMatch && statusMatch && ageMatch;
  });

  if (sort === "priceAsc") filtered.sort((a, b) => a.priceValue - b.priceValue);
  if (sort === "priceDesc") filtered.sort((a, b) => b.priceValue - a.priceValue);
  if (sort === "ageAsc") filtered.sort((a, b) => a.ageMonths - b.ageMonths);

  return filtered;
}

function renderPuppies() {
  if (!puppyGrid || !getPuppies().length) return;
  const puppies = getFilteredPuppies();

  if (catalogCount) {
    catalogCount.textContent = `${puppies.length} curated ${puppies.length === 1 ? "puppy" : "puppies"} shown`;
  }

  if (!puppies.length) {
    puppyGrid.innerHTML = `<p class="catalog-empty">No puppies match these filters yet. Send a request and we will curate a private shortlist.</p>`;
    return;
  }

  puppyGrid.innerHTML = puppies.map((puppy) => `
    <article class="puppy-card" data-status="${puppy.statusKey}">
      <div class="puppy-card__image">
        <img src="${puppy.image}" alt="${puppy.name}, ${puppy.breed}" loading="lazy">
        <span data-status="${puppy.statusKey}">${puppy.status}</span>
      </div>
      <div class="puppy-card__body">
        <div class="puppy-card__heading">
          <div>
            <h3>${puppy.name}</h3>
            <p>${puppy.breed}</p>
          </div>
          <strong class="puppy-card__price">${puppy.price}</strong>
        </div>
        <p class="puppy-card__summary">${puppy.summary}</p>
        <dl class="puppy-card__meta">
          <div><dt>Age</dt><dd>${puppy.age}</dd></div>
          <div><dt>Gender</dt><dd>${puppy.gender}</dd></div>
          <div><dt>Status</dt><dd>${puppy.status}</dd></div>
        </dl>
        <div class="puppy-card__actions">
          <a class="button button--glass" href="puppy-${puppy.id}.html">Details</a>
          <a class="button button--primary" href="contact.html?puppy=${encodeURIComponent(puppy.name)}" data-puppy-contact="${puppy.name}">Contact</a>
        </div>
      </div>
    </article>
  `).join("");
}

function getInquiryFormMarkup(preferredPuppy = "Not sure yet") {
  return `
    <form class="lead-form" data-lead-form novalidate>
      <label>
        <span>Name</span>
        <input type="text" name="name" autocomplete="name" placeholder="Your name" required minlength="2">
      </label>
      <label>
        <span>Country</span>
        <input type="text" name="country" autocomplete="country-name" placeholder="United States" required>
      </label>
      <fieldset class="contact-choice">
        <legend>Where should we contact you?</legend>
        <label class="radio-card">
          <input type="radio" name="channel" value="WhatsApp" checked>
          <span>WhatsApp</span>
        </label>
        <label class="radio-card">
          <input type="radio" name="channel" value="Telegram">
          <span>Telegram</span>
        </label>
      </fieldset>
      <label>
        <span>Telegram / WhatsApp</span>
        <input type="text" name="contact" autocomplete="tel" placeholder="@username or +1 555 000 0000" required>
      </label>
      <label>
        <span>Budget</span>
        <select name="budget" required>
          <option value="$3,000-$4,000">$3,000-$4,000</option>
          <option value="$4,000-$6,000">$4,000-$6,000</option>
          <option value="$6,000-$9,000">$6,000-$9,000</option>
          <option value="$9,000+">$9,000+</option>
          <option value="Private consultation">Private consultation</option>
        </select>
      </label>
      <label>
        <span>Preferred puppy</span>
        <select name="preferredPuppy" data-preferred-puppy>
          <option value="${preferredPuppy}">${preferredPuppy}</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows="4" placeholder="Breed, age, timeline, delivery country"></textarea>
      </label>
      <button class="button button--primary" type="submit">Send request</button>
      <p class="form-message" role="status"></p>
    </form>
  `;
}

function bindGalleryThumbs() {
  const mainImage = document.querySelector("#detailMainImage");
  const thumbs = document.querySelector("#detailThumbs");
  thumbs?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-image]");
    if (!button || !mainImage) return;
    mainImage.src = button.dataset.image;
    [...thumbs.children].forEach((thumb) => thumb.classList.toggle("is-active", thumb === button));
  });
}

function renderPuppyProfile() {
  const profile = document.querySelector("#puppyProfile");
  if (!profile) return;
  const puppyId = document.body.dataset.puppyId;
  const puppy = getPuppies().find((item) => item.id === puppyId) || getPuppies()[0];
  if (!puppy) return;
  activeDetailPuppy = puppy;
  document.title = `${puppy.name} - ${puppy.breed} | PawCierge`;

  profile.innerHTML = `
    <section class="section puppy-page-hero">
      <div class="puppy-detail__gallery reveal">
        <img id="detailMainImage" src="${puppy.gallery[0]}" alt="${puppy.name}, ${puppy.breed}">
        <div class="puppy-detail__thumbs" id="detailThumbs">
          ${puppy.gallery.map((image, index) => `
            <button class="${index === 0 ? "is-active" : ""}" type="button" data-image="${image}" aria-label="View ${puppy.name} image ${index + 1}">
              <img src="${image}" alt="" loading="lazy">
            </button>
          `).join("")}
        </div>
      </div>
      <div class="puppy-detail__content reveal">
        <p class="eyebrow">${puppy.status}</p>
        <h1>${puppy.name} - ${puppy.breed}</h1>
        <p>${puppy.summary}</p>
        <dl class="puppy-detail__facts">
          <div><dt>Breed</dt><dd>${puppy.breed}</dd></div>
          <div><dt>Age</dt><dd>${puppy.age}</dd></div>
          <div><dt>Gender</dt><dd>${puppy.gender}</dd></div>
          <div><dt>Price</dt><dd>${puppy.price}</dd></div>
        </dl>
        <div class="trait-list">${puppy.traits.map((trait) => `<span>${trait}</span>`).join("")}</div>
        <div class="hero__actions">
          <a class="button button--primary" href="contact.html?puppy=${encodeURIComponent(puppy.name)}">Inquire about ${puppy.name}</a>
          <a class="button button--glass" href="puppies.html">Back to puppies</a>
        </div>
      </div>
    </section>
    <section class="section section--dark">
      <div class="detail-info-grid reveal">
        <section>
          <h3>Personality</h3>
          <p>${puppy.summary}</p>
        </section>
        <section>
          <h3>Breed info</h3>
          <p>${puppy.breed} puppies are matched with attention to lifestyle, grooming rhythm, temperament, and travel readiness.</p>
        </section>
        <section>
          <h3>Feeding info</h3>
          <p>${puppy.feeding}</p>
        </section>
        <section>
          <h3>Vaccination info</h3>
          <p>${puppy.vaccination}</p>
        </section>
        <section>
          <h3>Delivery info</h3>
          <p>${puppy.delivery}</p>
        </section>
        <section>
          <h3>Concierge support</h3>
          <p>We prepare arrival routine, first-night guidance, and follow-up support after handover.</p>
        </section>
      </div>
    </section>
    <section class="section lead-section">
      <div class="lead-panel reveal">
        <div class="lead-panel__copy">
          <p class="eyebrow">Private inquiry</p>
          <h2>Request ${puppy.name}'s full profile</h2>
          <p>Share your country, timeline, and preferred contact method. A PawCierge advisor will confirm availability and next steps.</p>
        </div>
        ${getInquiryFormMarkup(puppy.name)}
      </div>
    </section>
  `;

  bindGalleryThumbs();
  populatePreferredPuppies();
  bindLeadForms();
  observeReveals(profile);
}

function setDetailImage(src, alt) {
  if (!detailMainImage) return;
  detailMainImage.src = src;
  detailMainImage.alt = alt;
  [...detailThumbs.children].forEach((button) => {
    button.classList.toggle("is-active", button.dataset.image === src);
  });
}

function openPuppyDetail(puppyId) {
  const puppy = getPuppies().find((item) => item.id === puppyId);
  if (!puppy || !puppyDetail) return;
  activeDetailPuppy = puppy;

  detailStatus.textContent = puppy.status;
  puppyDetailTitle.textContent = `${puppy.name} - ${puppy.breed}`;
  detailSummary.textContent = puppy.summary;
  detailBreed.textContent = puppy.breed;
  detailAge.textContent = puppy.age;
  detailGender.textContent = puppy.gender;
  detailPrice.textContent = puppy.price;
  detailFeeding.textContent = puppy.feeding;
  detailVaccination.textContent = puppy.vaccination;
  detailDelivery.textContent = puppy.delivery;
  detailTraits.innerHTML = puppy.traits.map((trait) => `<span>${trait}</span>`).join("");
  detailThumbs.innerHTML = puppy.gallery.map((image, index) => `
    <button type="button" data-image="${image}" aria-label="View ${puppy.name} image ${index + 1}">
      <img src="${image}" alt="" loading="lazy">
    </button>
  `).join("");
  setDetailImage(puppy.gallery[0], `${puppy.name}, ${puppy.breed}`);

  puppyDetail.hidden = false;
  document.body.classList.add("has-detail-open");
  detailPanel?.focus();
}

function closePuppyDetail() {
  if (!puppyDetail) return;
  puppyDetail.hidden = true;
  document.body.classList.remove("has-detail-open");
}

populateCatalogFilters();
populatePreferredPuppies();
renderPuppies();

catalogControls?.addEventListener("change", renderPuppies);

puppyGrid?.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-puppy-detail]");
  const contactLink = event.target.closest("[data-puppy-contact]");

  if (detailButton) openPuppyDetail(detailButton.dataset.puppyDetail);
  if (contactLink && preferredPuppySelect) {
    preferredPuppySelect.value = contactLink.dataset.puppyContact;
  }
});

detailThumbs?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-image]");
  if (!button || !activeDetailPuppy) return;
  setDetailImage(button.dataset.image, `${activeDetailPuppy.name}, ${activeDetailPuppy.breed}`);
});

document.querySelectorAll("[data-detail-close]").forEach((element) => {
  element.addEventListener("click", closePuppyDetail);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePuppyDetail();
});

// Reviews carousel with arrows, dots, and swipe support.
const reviewTrack = document.querySelector("#reviewsTrack");
const reviewCards = [...document.querySelectorAll(".review-card")];
const reviewDots = document.querySelector("#reviewDots");
let currentReview = 0;
let touchStartX = 0;

function setReview(index) {
  if (!reviewCards.length) return;
  currentReview = (index + reviewCards.length) % reviewCards.length;
  reviewCards.forEach((card, cardIndex) => {
    card.classList.toggle("is-active", cardIndex === currentReview);
  });
  [...reviewDots.children].forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentReview);
  });
}

function initReviewCarousel() {
  if (!reviewDots || !reviewCards.length) return;

  reviewCards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show review ${index + 1}`);
    dot.addEventListener("click", () => setReview(index));
    reviewDots.append(dot);
  });

  document.querySelector("[data-review-prev]")?.addEventListener("click", () => setReview(currentReview - 1));
  document.querySelector("[data-review-next]")?.addEventListener("click", () => setReview(currentReview + 1));

  reviewTrack?.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  reviewTrack?.addEventListener("touchend", (event) => {
    const diff = touchStartX - event.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) setReview(currentReview + (diff > 0 ? 1 : -1));
  }, { passive: true });

  setReview(0);
}

initReviewCarousel();

// Puppy Nutrition Match gives gentle, non-medical feeding guidance.
const nutritionForm = document.querySelector("#nutritionForm");
const nutritionResult = document.querySelector("#nutritionResult");
const nutritionResultTitle = document.querySelector("#nutritionResultTitle");
const nutritionStyle = document.querySelector("#nutritionStyle");
const nutritionFrequency = document.querySelector("#nutritionFrequency");
const nutritionPortion = document.querySelector("#nutritionPortion");
const nutritionHydration = document.querySelector("#nutritionHydration");
const nutritionWarning = document.querySelector("#nutritionWarning");
const nutritionNeedInputs = [...document.querySelectorAll('.nutrition-needs input[name="needs"]')];

function getNutritionFrequency(age) {
  if (age === "1-2 months" || age === "2-4 months") return "3-4 small meals";
  if (age === "4-6 months") return "3 small meals";
  if (age === "6-12 months") return "2-3 balanced meals";
  return "2 balanced meals";
}

function getNutritionStyle(feeding, needs) {
  if (needs.includes("allergies")) return "Veterinary-guided small-breed puppy formula";
  if (needs.includes("sensitive stomach")) return "Gentle small-breed puppy formula with simple ingredients";
  if (feeding === "wet food") return "High-quality wet puppy food for small breeds";
  if (feeding === "mixed feeding") return "Balanced mixed feeding with a puppy-specific base";
  if (feeding === "natural food") return "Veterinarian-planned natural diet for puppies";
  if (feeding === "not sure yet") return "High-quality small-breed puppy formula";
  return "High-quality dry puppy food for small breeds";
}

function getPortionGuidance(weight, feeding, needs) {
  const base = `Use the food maker's puppy guideline as a starting point for the ${weight} range, then adjust gently by body condition, appetite and stool quality.`;
  const feedingNote = feeding === "natural food"
    ? " Natural feeding should be planned with a veterinarian or canine nutrition specialist so calcium, protein and calories stay balanced."
    : " Keep portions small and consistent, especially during the first week after any diet change.";
  const needsNote = needs.some((need) => ["picky eater", "low appetite"].includes(need))
    ? " For picky eating or low appetite, avoid frequent food switching and ask a veterinarian if appetite drops suddenly."
    : "";

  return `${base}${feedingNote}${needsNote}`;
}

function updateNutritionNeeds(changedInput) {
  const noNeedsInput = nutritionNeedInputs.find((input) => input.value === "no special needs");
  if (!noNeedsInput || !changedInput?.checked) return;

  if (changedInput === noNeedsInput) {
    nutritionNeedInputs.forEach((input) => {
      if (input !== noNeedsInput) input.checked = false;
    });
    return;
  }

  noNeedsInput.checked = false;
}

nutritionNeedInputs.forEach((input) => {
  input.addEventListener("change", () => updateNutritionNeeds(input));
});

nutritionForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(nutritionForm);
  const breed = formData.get("breed");
  const age = formData.get("age");
  const weight = formData.get("weight");
  const feeding = formData.get("feeding");
  const needs = formData.getAll("needs").filter((need) => need !== "no special needs");
  const needsText = needs.length ? ` with ${needs.join(", ")}` : "";

  nutritionResultTitle.textContent = `${breed} nutrition match`;
  nutritionStyle.textContent = getNutritionStyle(feeding, needs);
  nutritionFrequency.textContent = `${getNutritionFrequency(age)} per day`;
  nutritionPortion.textContent = `For a small-breed puppy aged ${age}${needsText}, choose a puppy-specific food and split meals into calm, predictable servings. ${getPortionGuidance(weight, feeding, needs)}`;
  nutritionHydration.textContent = "Keep fresh water available at all times, and refresh the bowl often during warm days, travel, or active play.";
  nutritionWarning.textContent = "If your puppy has allergies, digestion issues, poor appetite, vomiting, diarrhea, or sudden weight changes, consult a veterinarian before changing the diet.";

  nutritionResult.hidden = false;
  nutritionResult.classList.remove("is-visible");
  void nutritionResult.offsetWidth;
  nutritionResult.classList.add("is-visible");
});

// Reveal animations on scroll.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

function observeReveals(scope = document) {
  scope.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

renderPuppyProfile();
observeReveals();

// Puppy name generator.
const puppyNames = {
  boy: [
    "Archie", "Theo", "Milo", "Oliver", "Hugo", "Leo", "Louis", "Winston", "Oscar", "Jasper",
    "Finn", "Teddy", "Benny", "Alfie", "Rupert", "Remy", "Cosmo", "Henry", "Monty", "Bowie",
    "Felix", "Casper", "Rocco", "Nico", "Bruno", "Elio", "Otis", "Percy", "Romeo", "Sunny",
    "Toby", "Luca", "Enzo", "Charlie", "Maxwell"
  ],
  girl: [
    "Bella", "Luna", "Coco", "Sophie", "Chloe", "Mia", "Daisy", "Rosie", "Stella", "Ruby",
    "Lola", "Gigi", "Lily", "Mila", "Nala", "Poppy", "Pearl", "Fifi", "Mimi", "Sienna",
    "Ava", "Clara", "Elsie", "Flora", "Ivy", "Lottie", "Margot", "Noelle", "Suki", "Zara",
    "Vivi", "Amelie", "Bijou", "Celeste", "Honey"
  ],
  luxury: [
    "Bijou", "Dior", "Chanel", "Cartier", "Prada", "Versace", "Valentino", "Hermes", "Celine", "Armani",
    "Monaco", "Bentley", "Aston", "Royce", "Velvet", "Cashmere", "Sterling", "Saffron", "Baccarat", "Duchess",
    "Prince", "Baron", "Caviar", "Pearl", "Opal", "Sable", "Satin", "Bellini", "Pomelo", "Gatsby",
    "Milan", "Vienna", "Portofino", "Astoria", "Majesty"
  ],
  cute: [
    "Biscuit", "Mochi", "Peaches", "Cookie", "Cupcake", "Waffles", "Bubbles", "Pumpkin", "Pudding", "Toffee",
    "Marshmallow", "Buttons", "Sprinkles", "Noodle", "Pip", "Doodle", "Pickle", "Taffy", "Bonbon", "Muffin",
    "Snuggles", "Twinkle", "Pebble", "Bambi", "Bunny", "Chewie", "Cuddles", "Fluffy", "Kiki", "Peanut",
    "Pippa", "Sugar", "Toto", "Yuki", "Zuzu"
  ],
  tiny: [
    "Pip", "Pixie", "Bean", "Dot", "Mini", "Pebble", "Nori", "Tiki", "Pico", "Tiny",
    "Bitsy", "Midge", "Bibi", "Flea", "Plum", "Pea", "Miso", "Nibi", "Toto", "Pom",
    "Poppyseed", "Didi", "Koko", "Lulu", "Mimi", "Nunu", "Puck", "Tilly", "Chip", "Boba",
    "Fig", "Gumdrop", "Niblet", "Tinker", "Wisp"
  ]
};

const nameResult = document.querySelector("#puppyNameResult");
const generateNameButton = document.querySelector("#generateNameButton");
const nameCategoryButtons = [...document.querySelectorAll("[data-name-category]")];
let activeNameCategory = "boy";
let lastGeneratedName = nameResult?.textContent.trim() || "";

function generatePuppyName() {
  if (!nameResult) return;
  const names = puppyNames[activeNameCategory] || puppyNames.boy;
  let nextName = names[Math.floor(Math.random() * names.length)];

  if (names.length > 1) {
    while (nextName === lastGeneratedName) {
      nextName = names[Math.floor(Math.random() * names.length)];
    }
  }

  lastGeneratedName = nextName;
  nameResult.classList.remove("is-changing");
  void nameResult.offsetWidth;
  nameResult.textContent = nextName;
  nameResult.classList.add("is-changing");
}

nameCategoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeNameCategory = button.dataset.nameCategory;
    nameCategoryButtons.forEach((categoryButton) => {
      categoryButton.classList.toggle("is-active", categoryButton === button);
    });
    generatePuppyName();
  });
});

generateNameButton?.addEventListener("click", generatePuppyName);

// Placeholder for a future Telegram Bot API, n8n webhook, or CRM integration.
function handleLeadSubmit(lead) {
  console.info("PawCierge lead payload:", lead);
  return Promise.resolve({ ok: true });
}

function handlePuppyInquiry(inquiry) {
  console.info("PawCierge puppy inquiry:", inquiry);
  return Promise.resolve({ ok: true });
}

function bindLeadForms() {
  document.querySelectorAll("#leadForm, [data-lead-form]").forEach((form) => {
    if (form.dataset.bound === "true") return;
    form.dataset.bound = "true";
    const message = form.querySelector(".form-message");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const lead = Object.fromEntries(formData.entries());
      const nameValid = lead.name && lead.name.trim().length >= 2;
      const countryValid = lead.country && lead.country.trim().length >= 2;
      const contactValid = lead.contact && lead.contact.trim().length >= 3;

      form.classList.remove("has-error");

      if (!nameValid || !countryValid || !contactValid) {
        form.classList.add("has-error");
        if (message) message.textContent = "Please enter your name, country, and preferred contact.";
        return;
      }

      await handleLeadSubmit({
        ...lead,
        name: lead.name.trim(),
        country: lead.country.trim(),
        contact: lead.contact.trim()
      });

      form.reset();
      const whatsapp = form.querySelector('input[name="channel"][value="WhatsApp"]');
      if (whatsapp) whatsapp.checked = true;
      if (message) message.textContent = "Thank you! We will contact you soon.";
    });
  });
}

bindLeadForms();

detailInquiryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(detailInquiryForm);
  const inquiry = Object.fromEntries(formData.entries());
  const nameValid = inquiry.name && inquiry.name.trim().length >= 2;
  const contactValid = inquiry.contact && inquiry.contact.trim().length >= 3;

  if (!nameValid || !contactValid) {
    detailFormMessage.textContent = "Please add your name and preferred contact.";
    return;
  }

  await handlePuppyInquiry({
    ...inquiry,
    puppy: activeDetailPuppy?.name || "Unknown puppy",
    breed: activeDetailPuppy?.breed || ""
  });

  detailInquiryForm.reset();
  detailFormMessage.textContent = "Thank you. A PawCierge advisor will follow up with next steps.";
});
