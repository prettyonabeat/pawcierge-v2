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

function renderPuppies() {
  if (!puppyGrid || !window.PAWCIERGE_PUPPIES) return;

  puppyGrid.innerHTML = window.PAWCIERGE_PUPPIES.map((puppy) => `
    <article class="puppy-card">
      <div class="puppy-card__image">
        <img src="${puppy.image}" alt="${puppy.name}, ${puppy.breed}" loading="lazy">
        <span>${puppy.status}</span>
      </div>
      <div class="puppy-card__body">
        <div>
          <h3>${puppy.name}</h3>
          <p>${puppy.breed}</p>
        </div>
        <dl class="puppy-card__meta">
          <div><dt>Age</dt><dd>${puppy.age}</dd></div>
          <div><dt>Gender</dt><dd>${puppy.gender}</dd></div>
          <div><dt>Price</dt><dd>${puppy.price}</dd></div>
        </dl>
        <div class="puppy-card__actions">
          <a class="button button--glass" href="#lead">Learn more</a>
          <a class="button button--primary" href="#lead">Reserve</a>
        </div>
      </div>
    </article>
  `).join("");
}

renderPuppies();

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

const leadForm = document.querySelector("#leadForm");
const formMessage = document.querySelector("#formMessage");

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(leadForm);
  const lead = Object.fromEntries(formData.entries());
  const nameValid = lead.name && lead.name.trim().length >= 2;
  const phoneDigits = (lead.phone || "").replace(/\D/g, "");
  const phoneValid = phoneDigits.length >= 10;

  leadForm.classList.remove("has-error");

  if (!nameValid || !phoneValid) {
    leadForm.classList.add("has-error");
    formMessage.textContent = "Please enter your name and a valid phone number.";
    return;
  }

  await handleLeadSubmit({
    ...lead,
    name: lead.name.trim(),
    phone: lead.phone.trim()
  });

  leadForm.reset();
  leadForm.querySelector('input[name="channel"][value="WhatsApp"]').checked = true;
  formMessage.textContent = "Thank you! We will contact you soon.";
});
