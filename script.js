// The intro runs once on page load and can be dismissed with Skip intro.
const intro = document.querySelector("#intro");
const skipIntroButton = document.querySelector("#skipIntro");

function closeIntro() {
  if (!intro || intro.classList.contains("intro--hidden")) return;
  intro.classList.add("intro--hidden");
  window.setTimeout(() => intro.remove(), 900);
}

window.addEventListener("load", () => {
  window.setTimeout(closeIntro, 5200);
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
  if (!preferredPuppySelect) return;
  getPuppies().forEach((puppy) => {
    const option = document.createElement("option");
    option.value = puppy.name;
    option.textContent = `${puppy.name} - ${puppy.breed}`;
    preferredPuppySelect.append(option);
  });
}

function getFilteredPuppies() {
  const puppies = [...getPuppies()];
  if (!catalogControls) return puppies;

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
          <button class="button button--glass" type="button" data-puppy-detail="${puppy.id}">Details</button>
          <a class="button button--primary" href="#lead" data-puppy-contact="${puppy.name}">Contact</a>
        </div>
      </div>
    </article>
  `).join("");
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

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

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

const leadForm = document.querySelector("#leadForm");
const formMessage = document.querySelector("#formMessage");

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(leadForm);
  const lead = Object.fromEntries(formData.entries());
  const nameValid = lead.name && lead.name.trim().length >= 2;
  const countryValid = lead.country && lead.country.trim().length >= 2;
  const contactValid = lead.contact && lead.contact.trim().length >= 3;

  leadForm.classList.remove("has-error");

  if (!nameValid || !countryValid || !contactValid) {
    leadForm.classList.add("has-error");
    formMessage.textContent = "Please enter your name, country, and preferred contact.";
    return;
  }

  await handleLeadSubmit({
    ...lead,
    name: lead.name.trim(),
    country: lead.country.trim(),
    contact: lead.contact.trim()
  });

  leadForm.reset();
  leadForm.querySelector('input[name="channel"][value="WhatsApp"]').checked = true;
  formMessage.textContent = "Thank you! We will contact you soon.";
});

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
