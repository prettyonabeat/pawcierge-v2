// Shared shell: one header/footer for all static pages.
const pageName = document.body.dataset.page || "home";
const LOGO_PATH = "images/Logo/mini.png";
const SPECIAL_ORDER_IMAGE = "images/Logo/special.jpg";

function renderSiteShell() {
  const headerHost = document.querySelector("[data-site-header]");
  const footerHost = document.querySelector("[data-site-footer]");
  const links = [
    ["home", "Home", "index.html"],
    ["puppies", "Puppies", "puppies.html"],
    ["reviews", "Reviews", "reviews.html"],
    ["delivery", "Delivery", "delivery.html"],
    ["about", "About", "about.html"],
    ["contact", "Contact", "contact.html"]
  ];
  const desktopLinks = links;
  const bottomLinks = links.filter(([key]) => ["home", "puppies", "reviews", "delivery", "contact"].includes(key));

  if (headerHost) {
    headerHost.innerHTML = `
      <header class="site-header" id="top">
        <a class="brand" href="index.html" aria-label="MiniMishkiBoo">
          <img class="brand__mark" src="${LOGO_PATH}" alt="">
          <span>MiniMishkiBoo</span>
        </a>
        <nav class="nav" aria-label="Main navigation">
          ${desktopLinks.map(([key, label, href]) => `<a class="${pageName === key ? "is-current" : ""}" href="${href}">${label}</a>`).join("")}
        </nav>
        <button class="menu-toggle" type="button" aria-label="Open mobile menu" aria-expanded="false" aria-controls="mobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
          <button class="mobile-menu__backdrop" type="button" aria-label="Close mobile menu" data-menu-close></button>
          <aside class="mobile-menu__panel" aria-label="Mobile navigation">
            <div class="mobile-menu__top">
              <a class="brand" href="index.html" aria-label="MiniMishkiBoo">
                <img class="brand__mark" src="${LOGO_PATH}" alt="">
                <span>MiniMishkiBoo</span>
              </a>
              <button class="mobile-menu__close" type="button" aria-label="Close mobile menu" data-menu-close></button>
            </div>
            <nav class="mobile-menu__nav" aria-label="Mobile navigation links">
              ${links.map(([key, label, href]) => `<a class="${pageName === key ? "is-current" : ""}" href="${href}">${label}</a>`).join("")}
            </nav>
            <a class="button button--primary mobile-menu__cta" href="contact.html">Find a Puppy</a>
            <p>Premium Pomeranian breeding, trusted kennels, worldwide sourcing, and personal care at every step.</p>
          </aside>
        </div>
      </header>
      <nav class="bottom-nav" aria-label="Mobile bottom navigation">
        ${bottomLinks.map(([key, label, href]) => `
          <a class="bottom-nav__link ${pageName === key ? "is-current" : ""}" href="${href}" aria-label="${label}" ${pageName === key ? 'aria-current="page"' : ""}>
            <span class="bottom-nav__icon" aria-hidden="true"></span>
            <span>${label}</span>
          </a>
        `).join("")}
      </nav>
    `;
  }

  if (footerHost) {
    footerHost.innerHTML = `
      <footer class="footer">
        <div class="footer__brand">
          <a class="brand" href="index.html">
            <img class="brand__mark" src="${LOGO_PATH}" alt="">
            <span>MiniMishkiBoo</span>
          </a>
          <p>Premium Pomeranian breeding and worldwide puppy sourcing with trusted kennels, personal care, and support at every step.</p>
        </div>
        <div class="footer__links">
          <a href="puppies.html">Available puppies</a>
          <a href="delivery.html">Delivery process</a>
          <a href="contact.html">Private request</a>
        </div>
        <div class="footer__meta">
          <p>With you since 2008</p>
          <p>Our family is based across different countries around the world.</p>
          <p>&copy; 2026 MiniMishkiBoo. All rights reserved.</p>
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

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobileMenu");
const mobileMenuPanel = document.querySelector(".mobile-menu__panel");
const menuCloseControls = document.querySelectorAll("[data-menu-close]");

function setMobileMenu(open) {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.toggle("is-open", open);
  mobileMenu.setAttribute("aria-hidden", String(!open));
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close mobile menu" : "Open mobile menu");
  document.body.classList.toggle("has-menu-open", open);
  if (open) mobileMenuPanel?.focus();
}

menuToggle?.addEventListener("click", () => {
  setMobileMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

menuCloseControls.forEach((control) => {
  control.addEventListener("click", () => setMobileMenu(false));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMobileMenu(false);
});

window.requestAnimationFrame(() => document.body.classList.add("page-ready"));

// The intro runs once on the site and can be dismissed with Skip intro.
const INTRO_SEEN_KEY = "miniMishkiBooIntroSeen";
const intro = document.querySelector("#intro");
const skipIntroButton = document.querySelector("#skipIntro");
const hasSeenIntro = document.documentElement.classList.contains("has-seen-intro");

function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    // localStorage.removeItem("miniMishkiBooIntroSeen");
  } catch (error) {
    // Storage may be unavailable in restricted browser modes.
  }
}

function closeIntro() {
  if (!intro || intro.classList.contains("intro--hidden")) return;
  markIntroSeen();
  intro.classList.add("intro--hidden");
  window.setTimeout(() => intro.remove(), 900);
}

if (intro && hasSeenIntro) {
  intro.remove();
}

window.addEventListener("load", () => {
  if (intro && !hasSeenIntro) window.setTimeout(closeIntro, 5200);
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
  return window.MINIMISHKIBOO_PUPPIES || [];
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
    return puppies;
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

function getSpecialOrderCardMarkup() {
  return `
    <article class="puppy-card special-order-card" data-card-href="special-order.html" tabindex="0" role="link" aria-label="Create a special puppy order">
      <a class="special-order-card__image" href="special-order.html" aria-label="Create a special puppy order">
        <img src="${SPECIAL_ORDER_IMAGE}" alt="Special Order concierge puppy sourcing" loading="lazy">
        <span>VIP Service</span>
      </a>
      <div class="puppy-card__body special-order-card__body">
        <div class="puppy-card__heading special-order-card__heading">
          <div>
            <h3><a href="special-order.html">Special Order</a></h3>
            <p>Personalized worldwide puppy sourcing with individual requirements and concierge support.</p>
          </div>
        </div>
        <a class="button button--primary special-order-card__button" href="special-order.html">Create Request</a>
      </div>
    </article>
  `;
}

function renderPuppies() {
  if (!puppyGrid || !getPuppies().length) return;
  const puppies = getFilteredPuppies();
  const specialOrderCard = getSpecialOrderCardMarkup();

  if (catalogCount) {
    catalogCount.textContent = `${puppies.length} curated ${puppies.length === 1 ? "puppy" : "puppies"} shown`;
  }

  if (!puppies.length) {
    puppyGrid.innerHTML = `${specialOrderCard}<p class="catalog-empty">No puppies match these filters yet. Send a request and we will curate a private shortlist.</p>`;
    return;
  }

  puppyGrid.innerHTML = specialOrderCard + puppies.map((puppy) => `
    <article class="puppy-card" data-status="${puppy.statusKey}" data-card-href="puppy-${puppy.id}.html" tabindex="0" role="link" aria-label="Open ${puppy.name}'s puppy profile">
      <a class="puppy-card__image" href="puppy-${puppy.id}.html" aria-label="Open ${puppy.name}'s profile">
        <img src="${puppy.image}" alt="${puppy.name}, ${puppy.breed}" loading="lazy">
        <span data-status="${puppy.statusKey}">${puppy.status}</span>
      </a>
      <div class="puppy-card__body">
        <div class="puppy-card__heading">
          <div>
            <h3><a href="puppy-${puppy.id}.html">${puppy.name}</a></h3>
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
  const gallery = document.querySelector("[data-profile-gallery]");
  let touchStartX = 0;

  function setProfileImage(src, button) {
    if (!mainImage || !src) return;
    mainImage.classList.remove("is-changing");
    void mainImage.offsetWidth;
    mainImage.classList.add("is-changing");
    mainImage.src = src;
    [...thumbs?.children || []].forEach((thumb) => thumb.classList.toggle("is-active", thumb === button || thumb.dataset.image === src));
  }

  thumbs?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-image]");
    if (!button || !mainImage) return;
    setProfileImage(button.dataset.image, button);
  });

  gallery?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });

  gallery?.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0]?.clientX || 0;
    const delta = endX - touchStartX;
    if (Math.abs(delta) < 44 || !thumbs?.children.length) return;
    const buttons = [...thumbs.querySelectorAll("button[data-image]")];
    const activeIndex = Math.max(0, buttons.findIndex((button) => button.classList.contains("is-active")));
    const nextIndex = delta < 0 ? Math.min(buttons.length - 1, activeIndex + 1) : Math.max(0, activeIndex - 1);
    setProfileImage(buttons[nextIndex]?.dataset.image, buttons[nextIndex]);
  });
}

function getPuppyDetailLink(puppy) {
  return `puppy-${puppy.id}.html`;
}

function getContactLink(puppy, topic = "profile") {
  return `contact.html?puppy=${encodeURIComponent(puppy.name)}&topic=${encodeURIComponent(topic)}`;
}

function getSimilarPuppies(currentPuppy) {
  const puppies = getPuppies().filter((puppy) => puppy.id !== currentPuppy.id);
  const sameBreed = puppies.filter((puppy) => puppy.breed === currentPuppy.breed);
  return [...sameBreed, ...puppies.filter((puppy) => puppy.breed !== currentPuppy.breed)].slice(0, 4);
}

function getPuppyProfileCard(puppy) {
  return `
    <a class="similar-puppy-card" href="${getPuppyDetailLink(puppy)}">
      <img src="${puppy.image}" alt="${puppy.name}, ${puppy.breed}" loading="lazy">
      <span data-status="${puppy.statusKey}">${puppy.status}</span>
      <strong>${puppy.name}</strong>
      <small>${puppy.breed} &middot; ${puppy.age}</small>
    </a>
  `;
}

function renderPuppyProfile() {
  const profile = document.querySelector("#puppyProfile");
  if (!profile) return;
  const puppyId = document.body.dataset.puppyId;
  const puppy = getPuppies().find((item) => item.id === puppyId) || getPuppies()[0];
  if (!puppy) return;
  activeDetailPuppy = puppy;
  document.title = `${puppy.name} - ${puppy.breed} | MiniMishkiBoo`;

  const similarPuppies = getSimilarPuppies(puppy);
  profile.innerHTML = `
    <section class="section puppy-profile-hero">
      <nav class="profile-breadcrumbs reveal" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <span>/</span>
        <a href="puppies.html">Puppies</a>
        <span>/</span>
        <span>${puppy.name}</span>
      </nav>
      <a class="profile-back reveal" href="puppies.html">Back to puppies</a>
      <div class="profile-layout">
        <div class="profile-gallery reveal" data-profile-gallery>
          <div class="profile-gallery__thumbs" id="detailThumbs" aria-label="${puppy.name} gallery thumbnails">
            ${puppy.gallery.map((image, index) => `
              <button class="${index === 0 ? "is-active" : ""}" type="button" data-image="${image}" aria-label="View ${puppy.name} image ${index + 1}">
                <img src="${image}" alt="" loading="lazy">
              </button>
            `).join("")}
          </div>
          <div class="profile-gallery__stage">
            <img id="detailMainImage" src="${puppy.gallery[0]}" alt="${puppy.name}, ${puppy.breed}">
            <div class="profile-gallery__badge">
              <span>${puppy.status}</span>
              <strong>${puppy.price}</strong>
            </div>
          </div>
        </div>
        <aside class="profile-card reveal" aria-label="${puppy.name} puppy facts">
          <p class="eyebrow">${puppy.status} puppy profile</p>
          <h1>${puppy.name}</h1>
          <p>${puppy.summary}</p>
          <dl class="profile-facts">
            <div><dt>Breed</dt><dd>${puppy.breed}</dd></div>
            <div><dt>Gender</dt><dd>${puppy.gender}</dd></div>
            <div><dt>Age</dt><dd>${puppy.age}</dd></div>
            <div><dt>Color</dt><dd>${puppy.color}</dd></div>
            <div><dt>Weight</dt><dd>${puppy.weight}</dd></div>
            <div><dt>Availability</dt><dd>${puppy.status}</dd></div>
            <div><dt>Price</dt><dd>${puppy.price}</dd></div>
            <div><dt>Vaccination</dt><dd>${puppy.vaccination}</dd></div>
            <div><dt>Feeding</dt><dd>${puppy.feeding}</dd></div>
            <div><dt>Delivery</dt><dd>${puppy.deliveryAvailable}</dd></div>
          </dl>
          <div class="trait-list profile-traits" aria-label="Personality traits">
            ${puppy.traits.map((trait) => `<span>${trait}</span>`).join("")}
          </div>
          <div class="profile-actions">
            <a class="button button--primary" href="https://t.me/" target="_blank" rel="noreferrer">Contact via Telegram</a>
            <a class="button button--glass" href="https://wa.me/" target="_blank" rel="noreferrer">Contact via WhatsApp</a>
            <a class="button button--primary" href="${getContactLink(puppy, "Reserve Puppy")}">Reserve Puppy</a>
            <a class="button button--glass" href="${getContactLink(puppy, "Ask About Delivery")}">Ask About Delivery</a>
          </div>
        </aside>
      </div>
    </section>
    <section class="section section--dark profile-story-section">
      <div class="profile-story reveal">
        <div>
          <p class="eyebrow">Personality story</p>
          <h2>${puppy.name}'s boutique profile</h2>
          <p>${puppy.story}</p>
          <p>${puppy.personalityDescription}</p>
          <p>${puppy.care}</p>
        </div>
        <div class="profile-note">
          <span>Personality</span>
          <strong>${puppy.personality}</strong>
          <p>${puppy.breed} placement is guided by temperament, home rhythm, grooming expectations, and travel readiness.</p>
        </div>
      </div>
    </section>
    <section class="section trust-section profile-trust-section">
      <div class="section__head reveal">
        <p class="eyebrow">Delivery & trust</p>
        <h2>Protected from reservation to arrival</h2>
      </div>
      <div class="trust-grid profile-trust-grid reveal">
        <article class="trust-card"><span>01</span><h3>Worldwide delivery</h3><p>${puppy.delivery}</p></article>
        <article class="trust-card"><span>02</span><h3>Health guarantee</h3><p>Health records, readiness notes, and reservation details are organized before handover.</p></article>
        <article class="trust-card"><span>03</span><h3>Vet checked</h3><p>${puppy.vaccination}</p></article>
        <article class="trust-card"><span>04</span><h3>After-purchase support</h3><p>Arrival routine, feeding transition, grooming rhythm, and first-week questions stay supported.</p></article>
      </div>
    </section>
    <section class="section section--dark">
      <div class="section__head reveal">
        <p class="eyebrow">You may also like</p>
        <h2>Similar puppies</h2>
      </div>
      <div class="similar-puppies reveal" aria-label="Similar puppy carousel">
        ${similarPuppies.map(getPuppyProfileCard).join("")}
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
  const card = event.target.closest("[data-card-href]");

  if (detailButton) openPuppyDetail(detailButton.dataset.puppyDetail);
  if (contactLink && preferredPuppySelect) {
    preferredPuppySelect.value = contactLink.dataset.puppyContact;
  }
  if (card && !event.target.closest("a, button")) {
    window.location.href = card.dataset.cardHref;
  }
});

puppyGrid?.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-card-href]");
  if (!card || !["Enter", " "].includes(event.key)) return;
  event.preventDefault();
  window.location.href = card.dataset.cardHref;
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

// Home feeding guide gives a gentle portion estimate for small breeds.
const feedingGuideForm = document.querySelector("#feedingGuideForm");
const feedingGuideResult = document.querySelector("#feedingGuideResult");
const feedingGuideResultTitle = document.querySelector("#feedingGuideResultTitle");
const feedingGuideAmount = document.querySelector("#feedingGuideAmount");
const feedingGuideFrequency = document.querySelector("#feedingGuideFrequency");
const feedingGuideSchedule = document.querySelector("#feedingGuideSchedule");
const feedingGuideMessage = document.querySelector("#feedingGuideMessage");
const feedingGuideBreedNote = document.querySelector("#feedingGuideBreedNote");

function getFeedingGuideRhythm(age) {
  if (age === "1-2 months" || age === "2-3 months") {
    return { frequency: "4 meals per day", schedule: "08:00 / 13:00 / 18:00 / 22:00" };
  }

  if (age === "3-6 months") {
    return { frequency: "3-4 meals per day", schedule: "08:00 / 13:00 / 18:00 / 22:00" };
  }

  if (age === "6-12 months") {
    return { frequency: "2-3 meals per day", schedule: "08:00 / 14:00 / 20:00" };
  }

  return { frequency: "2 meals per day", schedule: "08:00 / 19:00" };
}

function getFeedingGuideFactor(activity) {
  if (activity === "Low") return 0.9;
  if (activity === "Active") return 1.1;
  return 1;
}

function getFeedingGuideRange(weight, type, isAdult, factor, mixedPortion = false) {
  const gramsPerKg = {
    dry: isAdult ? [25, 35] : [45, 60],
    wet: isAdult ? [60, 90] : [100, 130]
  }[type];
  const portionFactor = mixedPortion ? 0.5 : 1;
  const low = Math.round(weight * gramsPerKg[0] * factor * portionFactor);
  const high = Math.round(weight * gramsPerKg[1] * factor * portionFactor);
  return `${low}-${high} g per day`;
}

function renderFeedingGuideAmount(lines) {
  if (!feedingGuideAmount) return;
  const label = document.createElement("span");
  label.textContent = "Recommended daily amount";
  feedingGuideAmount.replaceChildren(label);

  lines.forEach((line) => {
    const value = document.createElement("strong");
    value.textContent = line;
    feedingGuideAmount.append(value);
  });
}

function resetFeedingGuideResult(message, isError = false) {
  if (!feedingGuideForm || !feedingGuideMessage) return;
  feedingGuideForm.classList.toggle("has-error", isError);
  feedingGuideMessage.classList.toggle("is-error", isError);
  feedingGuideMessage.textContent = message;
  if (feedingGuideResultTitle) feedingGuideResultTitle.textContent = "Puppy feeding guide";
  if (feedingGuideFrequency) feedingGuideFrequency.textContent = "Gentle meal rhythm";
  if (feedingGuideSchedule) feedingGuideSchedule.textContent = "Based on age";
  if (feedingGuideBreedNote) feedingGuideBreedNote.hidden = true;
  renderFeedingGuideAmount(["Waiting for weight"]);
}

function updateFeedingGuide() {
  if (!feedingGuideForm) return;
  const formData = new FormData(feedingGuideForm);
  const breed = formData.get("breed");
  const age = formData.get("age");
  const foodType = formData.get("foodType");
  const activity = formData.get("activity");
  const weightField = feedingGuideForm.elements.weight;
  const rawWeight = weightField?.value.trim() || "";
  const weight = Number(rawWeight);

  if (!rawWeight) {
    resetFeedingGuideResult("Enter your puppy's weight to see recommendations.");
    return;
  }

  if (!Number.isFinite(weight) || weight < 0.3 || weight > 20) {
    resetFeedingGuideResult("Please enter a weight between 0.3 and 20 kg.", true);
    return;
  }

  const isAdult = age === "12+ months";
  const factor = getFeedingGuideFactor(activity);
  const rhythm = getFeedingGuideRhythm(age);
  const amountLines = foodType === "Mixed feeding"
    ? [
        `Dry portion: ${getFeedingGuideRange(weight, "dry", isAdult, factor, true)}`,
        `Wet portion: ${getFeedingGuideRange(weight, "wet", isAdult, factor, true)}`
      ]
    : [`${foodType}: ${getFeedingGuideRange(weight, foodType === "Wet food" ? "wet" : "dry", isAdult, factor)}`];

  feedingGuideForm.classList.remove("has-error");
  if (feedingGuideMessage) {
    feedingGuideMessage.classList.remove("is-error");
    feedingGuideMessage.textContent = foodType === "Mixed feeding"
      ? "Use around 50% of the dry food range + 50% of the wet food range."
      : "Estimate updated. Use the chosen food brand guide as a final check.";
  }
  if (feedingGuideResultTitle) feedingGuideResultTitle.textContent = `${breed} feeding estimate`;
  if (feedingGuideFrequency) feedingGuideFrequency.textContent = rhythm.frequency;
  if (feedingGuideSchedule) feedingGuideSchedule.textContent = rhythm.schedule;
  if (feedingGuideBreedNote) {
    const showBreedNote = breed === "French Bulldog" || breed === "Other small breed";
    feedingGuideBreedNote.hidden = !showBreedNote;
    feedingGuideBreedNote.textContent = showBreedNote
      ? "Please adjust portions carefully based on body condition and veterinary advice."
      : "";
  }
  renderFeedingGuideAmount(amountLines);

  if (feedingGuideResult) {
    feedingGuideResult.classList.remove("is-updated");
    void feedingGuideResult.offsetWidth;
    feedingGuideResult.classList.add("is-updated");
  }
}

feedingGuideForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  updateFeedingGuide();
});

feedingGuideForm?.addEventListener("input", updateFeedingGuide);
feedingGuideForm?.addEventListener("change", updateFeedingGuide);

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
  console.info("MiniMishkiBoo lead payload:", lead);
  return Promise.resolve({ ok: true });
}

function handlePuppyInquiry(inquiry) {
  console.info("MiniMishkiBoo puppy inquiry:", inquiry);
  return Promise.resolve({ ok: true });
}

function handleSpecialOrderRequest(request) {
  console.info("MiniMishkiBoo special order request:", request);
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

document.querySelectorAll("[data-special-order-form]").forEach((form) => {
  const message = form.querySelector(".form-message");
  const contactMethod = form.elements.contactMethod;
  const contactField = form.querySelector("[data-special-contact-field]");
  const contactLabel = form.querySelector("[data-special-contact-label]");
  const contactInput = form.elements.contactValue;

  function syncSpecialContactField(shouldReset = false) {
    if (!contactMethod || !contactLabel || !contactInput || !contactField) return;
    const isWhatsApp = contactMethod.value === "WhatsApp";

    contactField.classList.add("is-changing");
    contactLabel.textContent = isWhatsApp ? "WhatsApp phone number" : "Telegram username";
    contactInput.type = isWhatsApp ? "tel" : "text";
    contactInput.placeholder = isWhatsApp ? "+1 234 567 890" : "@username";
    contactInput.autocomplete = isWhatsApp ? "tel" : "off";
    contactInput.setAttribute("aria-label", contactLabel.textContent);
    contactInput.required = true;
    if (shouldReset) contactInput.value = "";

    window.setTimeout(() => {
      contactField.classList.remove("is-changing");
    }, 220);
  }

  syncSpecialContactField(false);
  contactMethod?.addEventListener("change", () => syncSpecialContactField(true));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const request = Object.fromEntries(formData.entries());
    const requiredFields = ["breed", "deliveryCountry", "name", "contactMethod", "contactValue"];
    const isValid = requiredFields.every((field) => request[field] && request[field].trim().length >= 2);

    form.classList.remove("has-error");

    if (!isValid) {
      form.classList.add("has-error");
      if (message) message.textContent = "Please complete breed, delivery country, name, and your preferred contact details.";
      return;
    }

    await handleSpecialOrderRequest({
      ...request,
      contactType: request.contactMethod,
      contactValue: request.contactValue.trim()
    });

    form.reset();
    syncSpecialContactField(false);
    if (message) {
      message.textContent = "Thank you. Your personalized puppy request has been received. Our team will contact you shortly.";
    }
  });
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
  detailFormMessage.textContent = "Thank you. A MiniMishkiBoo advisor will follow up with next steps.";
});
