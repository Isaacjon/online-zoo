import { getPets, getFeedback } from "../../api";
import type { Pet, Feedback } from "../../api/types";
import { getPetSlug } from "./pet-slug";
import { initHamburgerMenu } from "../sign-in/hamburger";
import { initDonationModal } from "../../donate-modal/donate-modal";

const ASSETS_BASE = "../../assets";
const ERROR_MESSAGE =
  "Something went wrong. Please, refresh the page";

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function createLoaderHtml(): string {
  return `
    <div class="slider-loader" aria-busy="true">
      <div class="slider-loader__spinner"></div>
      <p class="slider-loader__text">Loading...</p>
    </div>
  `;
}

function createErrorHtml(): string {
  return `
    <div class="slider-error">
      <p class="slider-error__text">${escapeHtml(ERROR_MESSAGE)}</p>
    </div>
  `;
}

function renderFeedbackTile(feedback: Feedback): string {
  const meta = `${escapeHtml(feedback.city)}, ${escapeHtml(feedback.month)} ${escapeHtml(feedback.year)}`;
  return `
    <li class="feedback-tile">
      <span class="feedback-tile__quote" aria-hidden="true">
        <img src="${ASSETS_BASE}/icons/quote.svg" alt="" />
      </span>
      <h4 class="feedback-tile__meta">${meta}</h4>
      <p class="feedback-tile__body">${escapeHtml(feedback.text)}</p>
      <cite class="feedback-tile__author">${escapeHtml(feedback.name)}</cite>
    </li>
  `;
}

function renderPetCard(pet: Pet): string {
  const slug = getPetSlug(pet.id);
  const imageSrc = `${ASSETS_BASE}/images/pets/${slug}.jpg`;
  const commonName = encodeURIComponent(pet.commonName);
  const url = `../animal/index.html?animal=${slug}&commonName=${commonName}`;
  return `
    <article class="animal-card" data-animal="${slug}">
      <a href="${url}" class="animal-card__overlay" aria-label="View ${escapeHtml(pet.commonName)}"></a>
      <figure class="animal-card__media">
        <img src="${imageSrc}" alt="${escapeHtml(pet.commonName)}" loading="lazy" />
        <span class="animal-card__badge">${escapeHtml(pet.name)}</span>
      </figure>
      <div class="animal-card__info">
        <h3 class="animal-card__title">${escapeHtml(pet.commonName)}</h3>
        <p class="animal-card__desc">${escapeHtml(pet.description)}</p>
        <a href="${url}" class="btn_orange-ghost animal-card__cta">
          <span>VIEW LIVE CAM</span>
          <img src="${ASSETS_BASE}/icons/union.svg" alt="" width="24" height="22" class="btn__icon" />
        </a>
      </div>
    </article>
  `;
}

function initPetsSlider(carousel: HTMLElement): void {
  const prevBtn = document.querySelector(".pets-in-zoo__nav-btn--prev");
  const nextBtn = document.querySelector(".pets-in-zoo__nav-btn--next");

  if (!prevBtn || !nextBtn) return;

  const pageWidth = carousel.clientWidth;
  const setWidth = carousel.scrollWidth / 2;

  function handleScrollEnd(): void {
    const left = carousel.scrollLeft;
    if (left >= setWidth) {
      carousel.style.scrollBehavior = "auto";
      carousel.scrollLeft = left - setWidth;
      carousel.style.scrollBehavior = "";
    } else if (left <= 0) {
      carousel.style.scrollBehavior = "auto";
      carousel.scrollLeft = setWidth + left;
      carousel.style.scrollBehavior = "";
    }
  }

  let scrollEndTimeout: number | null = null;
  function onScroll(): void {
    if (scrollEndTimeout !== null) clearTimeout(scrollEndTimeout);
    scrollEndTimeout = window.setTimeout(() => {
      scrollEndTimeout = null;
      handleScrollEnd();
    }, 200);
  }

  carousel.addEventListener("scroll", onScroll, { passive: true });

  prevBtn.addEventListener("click", () => {
    if (carousel.scrollLeft <= 0) {
      carousel.style.scrollBehavior = "auto";
      carousel.scrollLeft = setWidth;
      carousel.style.scrollBehavior = "";
      carousel.scrollBy({ left: -pageWidth, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: -pageWidth, behavior: "smooth" });
    }
  });

  nextBtn.addEventListener("click", () => {
    const left = carousel.scrollLeft;
    if (left >= setWidth) {
      carousel.style.scrollBehavior = "auto";
      carousel.scrollLeft = left - setWidth;
      carousel.style.scrollBehavior = "";
    }
    carousel.scrollBy({ left: pageWidth, behavior: "smooth" });
  });
}

function initTestimonialsSlider(list: HTMLUListElement): void {
  const slider = document.getElementById("testimonials-scroll") as HTMLElement | null;
  const prevBtn = document.querySelector(".testimonials__nav-btn--prev");
  const nextBtn = document.querySelector(".testimonials__nav-btn--next");
  const pagerContainer = document.querySelector(".testimonials__pager");
  const cards = list.querySelectorAll(".feedback-tile");

  if (!slider || !list || !cards.length || !prevBtn || !nextBtn) return;

  cards.forEach((card) => list.appendChild(card.cloneNode(true)));

  const pageWidth = slider!.clientWidth;
  const setWidth = slider!.scrollWidth / 2;

  function handleScrollEnd(): void {
    const left = slider!.scrollLeft;
    if (left >= setWidth) {
      slider!.style.scrollBehavior = "auto";
      slider!.scrollLeft = left - setWidth;
      slider!.style.scrollBehavior = "";
    } else if (left <= 0) {
      slider!.style.scrollBehavior = "auto";
      slider!.scrollLeft = setWidth + left;
      slider!.style.scrollBehavior = "";
    }
  }

  let scrollEndTimeout: number | null = null;
  function onScroll(): void {
    if (scrollEndTimeout !== null) clearTimeout(scrollEndTimeout);
    scrollEndTimeout = window.setTimeout(() => {
      scrollEndTimeout = null;
      handleScrollEnd();
    }, 200);
  }

  slider!.addEventListener("scroll", onScroll, { passive: true });

  prevBtn.addEventListener("click", () => {
    if (slider!.scrollLeft <= 0) {
      slider!.style.scrollBehavior = "auto";
      slider!.scrollLeft = setWidth;
      slider!.style.scrollBehavior = "";
      slider!.scrollBy({ left: -pageWidth, behavior: "smooth" });
    } else {
      slider!.scrollBy({ left: -pageWidth, behavior: "smooth" });
    }
  });

  nextBtn.addEventListener("click", () => {
    const left = slider!.scrollLeft;
    if (left >= setWidth) {
      slider!.style.scrollBehavior = "auto";
      slider!.scrollLeft = left - setWidth;
      slider!.style.scrollBehavior = "";
    }
    slider!.scrollBy({ left: pageWidth, behavior: "smooth" });
  });

  const itemCount = cards.length;
  const dotCount = Math.min(4, Math.max(1, Math.ceil(itemCount / 2)));

  if (pagerContainer) {
    pagerContainer.innerHTML = "";
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `testimonials__pager-dot${i === 0 ? " testimonials__pager-dot--active" : ""}`;
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      if (i === 0) dot.setAttribute("aria-current", "true");
      pagerContainer.appendChild(dot);
    }
  }

  const pagerDots = pagerContainer?.querySelectorAll(".testimonials__pager-dot") ?? [];

  function getScrollPositions(): number[] {
    const maxScroll = setWidth - slider!.clientWidth;
    if (maxScroll <= 0) return [0];
    return Array.from({ length: dotCount }, (_, i) =>
      i === dotCount - 1 ? maxScroll : Math.round((maxScroll * i) / (dotCount - 1))
    );
  }

  function updateActiveDot(): void {
    const positions = getScrollPositions();
    const scrollLeft = slider!.scrollLeft % setWidth;
    let activeIndex = 0;
    let minDist = Infinity;
    positions.forEach((pos, i) => {
      const dist = Math.abs(scrollLeft - pos);
      if (dist < minDist) {
        minDist = dist;
        activeIndex = i;
      }
    });
    pagerDots.forEach((dot, i) => {
      dot.classList.toggle("testimonials__pager-dot--active", i === activeIndex);
      if (i === activeIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  pagerDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      const positions = getScrollPositions();
      const target = positions[index] ?? 0;
      slider!.scrollTo({ left: target, behavior: "smooth" });
    });
  });

  slider!.addEventListener("scroll", updateActiveDot);
  window.addEventListener("resize", updateActiveDot);
  updateActiveDot();
}

function initSupportAnimalsSlider(): void {
  const slider = document.querySelector(".support-animals__slider");
  const list = document.querySelector(".support-animals__list");
  const paginationItems = document.querySelectorAll(".support-animals__pagination-item");

  if (!slider || !list || !paginationItems.length) return;

  function getScrollPositions(): number[] {
    const maxScroll = (list as HTMLElement).scrollWidth - (slider as HTMLElement).clientWidth;
    if (maxScroll <= 0) return [0];
    const count = paginationItems.length;
    return Array.from({ length: count }, (_, i) =>
      i === count - 1 ? maxScroll : Math.round((maxScroll * i) / (count - 1))
    );
  }

  function updateActiveDot(): void {
    const positions = getScrollPositions();
    const scrollLeft = (slider as HTMLElement).scrollLeft;
    let activeIndex = 0;
    let minDist = Infinity;
    positions.forEach((pos, i) => {
      const dist = Math.abs(scrollLeft - pos);
      if (dist < minDist) {
        minDist = dist;
        activeIndex = i;
      }
    });
    paginationItems.forEach((item, i) => {
      item.classList.toggle("support-animals__pagination-item_active", i === activeIndex);
    });
  }

  paginationItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const positions = getScrollPositions();
      const target = positions[index] ?? 0;
      (slider as HTMLElement).scrollTo({ left: target, behavior: "smooth" });
    });
  });

  slider.addEventListener("scroll", updateActiveDot);
  window.addEventListener("resize", updateActiveDot);
  updateActiveDot();
}


async function loadLandingData(): Promise<void> {
  const petsSlider = document.querySelector(".pets-in-zoo__slider");

  if (!petsSlider) return;

  petsSlider.innerHTML = createLoaderHtml();

  try {
    const petsRes = await getPets();
    const pets = petsRes.data;

    if (pets.length > 0) {
      const petsHtml = pets.map(renderPetCard).join("");
      petsSlider.innerHTML = `
        <div class="pets-in-zoo__carousel" id="pets-carousel">
          ${petsHtml}${petsHtml}
        </div>
      `;
      const carousel = document.getElementById("pets-carousel");
      if (carousel) initPetsSlider(carousel);
    } else {
      petsSlider.innerHTML = createErrorHtml();
    }
  } catch {
    petsSlider.innerHTML = createErrorHtml();
  }
}

async function loadTestimonialsData(): Promise<void> {
  const scrollContainer = document.getElementById("testimonials-scroll");

  if (!scrollContainer) return;

  scrollContainer.innerHTML = createLoaderHtml();

  try {
    const feedbackRes = await getFeedback();
    const feedback = feedbackRes.data;

    if (feedback.length > 0) {
      const tilesHtml = feedback.map(renderFeedbackTile).join("");
      scrollContainer.innerHTML = `
        <ul class="testimonials__list">
          ${tilesHtml}
        </ul>
      `;
      const list = scrollContainer.querySelector(".testimonials__list");
      if (list) initTestimonialsSlider(list as HTMLUListElement);
    } else {
      scrollContainer.innerHTML = createErrorHtml();
    }
  } catch {
    scrollContainer.innerHTML = createErrorHtml();
  }
}

function init(): void {
  loadLandingData();
  loadTestimonialsData();
  initSupportAnimalsSlider();
  initDonationModal();
  initHamburgerMenu();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
