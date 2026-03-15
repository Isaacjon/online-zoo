import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCameras, getPetById } from "../../api";
import type { Camera, PetDetail } from "../../api/types";
import { getPetSlug } from "../landing/pet-slug";
import { initHamburgerMenu } from "../sign-in/hamburger";

const ASSETS_BASE = "../../assets";
const STREAM_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const ERROR_MESSAGE = "Something went wrong. Please, refresh the page";

const SLUG_TO_MAP_ICON: Record<string, string> = {
  panda: "panda",
  lemur: "lemur",
  gorilla: "gorilla",
  eagle: "eagle",
  alligator: "alligator",
  tiger: "tiger",
  koala: "coala",
  lion: "lion",
};

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getMapIcon(slug: string): string {
  const icon = SLUG_TO_MAP_ICON[slug] ?? "panda";
  return `${ASSETS_BASE}/icons/map/${icon}.svg`;
}

function getMainCamPath(slug: string): string {
  return `${ASSETS_BASE}/images/zoos/${slug}/main-cam.jpg`;
}

function getPetImagePath(slug: string): string {
  return `${ASSETS_BASE}/images/pets/${slug}.jpg`;
}

function getAdditionalCamPaths(slug: string): string[] {
  const base = `${ASSETS_BASE}/images/zoos/${slug}`;
  return [
    `${base}/additional-cam-1.jpg`,
    `${base}/additional-cam-2.jpg`,
    `${base}/additional-cam-3.jpg`,
  ];
}

function createLoaderHtml(): string {
  return `
    <div class="zoos-loader" aria-busy="true">
      <div class="zoos-loader__spinner"></div>
      <p class="zoos-loader__text">Loading...</p>
    </div>
  `;
}

function createErrorHtml(): string {
  return `
    <div class="zoos-error">
      <p class="zoos-error__text">${escapeHtml(ERROR_MESSAGE)}</p>
    </div>
  `;
}

function buildNavPanel(cameras: Camera[], activePetId: number): void {
  const list = document.getElementById("nav-panel-list");
  if (!list) return;

  list.innerHTML = cameras
    .map(
      (cam) => {
        const slug = getPetSlug(cam.petId);
        const icon = getMapIcon(slug);
        const isActive = cam.petId === activePetId;
        return `
      <li class="nav-panel__entry ${isActive ? "nav-panel__entry--active" : ""}">
        <a href="index.html?animal=${slug}" class="nav-panel__link" data-pet-id="${cam.petId}">
          <span class="nav-panel__icon">
            <img src="${icon}" alt="" width="80" height="60" />
          </span>
          <span class="nav-panel__label">${escapeHtml(cam.text)}</span>
        </a>
      </li>
    `;
      }
    )
    .join("");
}

function renderStreamContent(slug: string, petDetail: PetDetail | null): void {
  const titleEl = document.getElementById("stream-title");
  const mainLink = document.getElementById("stream-main-link");
  const playBtn = document.getElementById("stream-play-btn");
  const mainImg = document.getElementById("stream-main-img");
  const camsEl = document.getElementById("stream-cams");

  const streamTitle = petDetail
    ? `Live ${petDetail.commonName} Cams`
    : "Live Cams";

  if (titleEl) titleEl.textContent = streamTitle;
  if (mainLink instanceof HTMLAnchorElement) {
    mainLink.href = STREAM_URL;
    mainLink.setAttribute("aria-label", `Watch ${petDetail?.commonName ?? slug} live on YouTube`);
  }
  if (playBtn instanceof HTMLAnchorElement) playBtn.href = STREAM_URL;
  if (mainImg) {
    const mainSrc = getMainCamPath(slug);
    (mainImg as HTMLImageElement).src = mainSrc;
    (mainImg as HTMLImageElement).alt = `${petDetail?.commonName ?? slug} live cam`;
    (mainImg as HTMLImageElement).onerror = function (this: HTMLImageElement) {
      this.onerror = null;
      this.src = getPetImagePath(slug);
    };
  }

  if (camsEl) {
    const camPaths = getAdditionalCamPaths(slug);
    camsEl.innerHTML = camPaths
      .map(
        (imgPath, i) => `
      <a href="${STREAM_URL}" class="stream__cams-item" target="_blank" rel="noopener noreferrer" data-cam="${i}">
        <div class="stream__cams-header">
          <span>Cam ${i + 1}</span>
          <img src="${ASSETS_BASE}/icons/zoos/live-cam.svg" alt="Camera" class="stream-cam-icon" width="20" height="20" />
        </div>
        <img src="${imgPath}" alt="${petDetail?.commonName ?? slug} camera ${i + 1}" onerror="this.onerror=null;this.src='${getPetImagePath(slug)}';" />
        <span class="stream__play-btn"></span>
      </a>
    `
      )
      .join("");
  }
}

function renderSupportSection(petDetail: PetDetail | null, cameraText: string): void {
  const title = document.getElementById("support-title");
  const text = document.getElementById("support-text");
  if (title) title.textContent = petDetail ? `Support ${petDetail.commonName}!` : "Support";
  if (text) text.textContent = petDetail?.description ?? cameraText;
}

function buildFactsContainerHtml(petDetail: PetDetail, slug: string): string {
  const listClass =
    { panda: "facts__list--panda", eagle: "facts__list--eagle", gorilla: "facts__list--gorilla", lemur: "facts__list--lemur" }[
      slug
    ] ?? "facts__list--panda";
  const rows = [
    { label: "Common name:", value: petDetail.commonName },
    { label: "Scientific name:", value: petDetail.scientificName },
    { label: "Type:", value: petDetail.type },
    { label: "Size:", value: petDetail.size },
    { label: "Diet:", value: petDetail.diet },
    { label: "Habitat:", value: petDetail.habitat },
    { label: "Range:", value: petDetail.range },
  ]
    .map((item) => `<li class="facts__row"><span>${escapeHtml(item.label)}</span>${escapeHtml(item.value)}</li>`)
    .join("");
  const imageSrc = getPetImagePath(slug);
  return `
    <div class="facts__header">
      <h4 class="facts__title">Did you know?</h4>
      <h5 class="facts__subtitle" id="facts-subtitle">${escapeHtml(petDetail.description)}</h5>
    </div>
    <div class="facts__content">
      <ul class="facts__list ${listClass}" id="facts-list">
        ${rows}
        <li class="facts__action">
          <button type="button" class="btn_orange-ghost view-map-btn" data-lat="${escapeHtml(petDetail.latitude)}" data-lng="${escapeHtml(petDetail.longitude)}" data-pet-name="${escapeHtml(petDetail.commonName)}">
            <span>View Map</span>
            <img src="${ASSETS_BASE}/icons/union.svg" alt="" width="24" height="22" class="btn__icon">
          </button>
        </li>
      </ul>
      <div class="facts__image">
        <img src="${imageSrc}" alt="${escapeHtml(petDetail.commonName)}" id="facts-image" />
      </div>
    </div>
    <p class="facts__descr" id="facts-descr">${escapeHtml(petDetail.detailedDescription)}</p>
  `;
}

function renderFactsSection(petDetail: PetDetail | null, slug: string): void {
  const factsContainer = document.querySelector(".facts__container");

  if (!factsContainer) return;

  if (petDetail) {
    factsContainer.innerHTML = buildFactsContainerHtml(petDetail, slug);
  } else {
    factsContainer.innerHTML = createErrorHtml();
  }
}

function updatePageTitle(petDetail: PetDetail | null): void {
  document.title = petDetail ? `${petDetail.commonName} - Online Zoo animals` : "Online Zoo animals";
}

function parseUrlSpecies(cameras: Camera[]): { slug: string; petId: number } {
  const params = new URLSearchParams(window.location.search);
  const animalParam = params.get("animal");
  const validSlugs = new Set(cameras.map((c) => getPetSlug(c.petId)));
  const slug = animalParam && validSlugs.has(animalParam) ? animalParam : getPetSlug(cameras[0]!.petId);
  const camera = cameras.find((c) => getPetSlug(c.petId) === slug);
  const petId = camera?.petId ?? cameras[0]!.petId;
  if (!params.get("animal")) {
    const url = new URL(window.location.href);
    url.searchParams.set("animal", slug);
    window.history.replaceState({}, "", url.toString());
  }
  return { slug, petId };
}

function initNavPanelToggle(): void {
  const panel = document.getElementById("nav-panel");
  const toggle = panel?.querySelector(".nav-panel__toggle");
  if (!panel || !toggle) return;
  toggle.addEventListener("click", () => {
    panel.classList.toggle("nav-panel--collapsed");
  });
}

function initNavPanelScroll(): void {
  const list = document.getElementById("nav-panel-list");
  const bottom = document.querySelector(".nav-panel__footer");
  const scrollBtn = document.querySelector(".nav-panel__scroll");

  function updateArrowVisibility(): void {
    if (!list || !bottom) return;
    const hasOverflow = list.scrollHeight > list.clientHeight;
    bottom.classList.toggle("nav-panel__footer--hidden", !hasOverflow);
  }

  scrollBtn?.addEventListener("click", () => {
    if (!list) return;
    const itemHeight = (list.querySelector(".nav-panel__link") as HTMLElement)?.offsetHeight ?? 172;
    list.scrollBy({ top: itemHeight, behavior: "smooth" });
  });

  list?.addEventListener("scroll", updateArrowVisibility);
  window.addEventListener("resize", updateArrowVisibility);
  updateArrowVisibility();
}

function initStreamCarousel(): void {
  const cams = document.getElementById("stream-cams");
  const prevBtn = document.querySelector(".stream__nav--prev");
  const nextBtn = document.querySelector(".stream__nav--next");

  if (!cams || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener("click", () => {
    const firstItem = cams.querySelector(".stream__cams-item");
    if (firstItem) {
      const itemWidth = (firstItem as HTMLElement).offsetWidth + 20;
      cams.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  });

  nextBtn.addEventListener("click", () => {
    const firstItem = cams.querySelector(".stream__cams-item");
    if (firstItem) {
      const itemWidth = (firstItem as HTMLElement).offsetWidth + 20;
      cams.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  });
}

function initMapModal(): void {
  const modal = document.getElementById("map-modal");
  const container = document.getElementById("map-modal-container");
  const backdrop = modal?.querySelector(".map-modal__backdrop");
  const closeBtn = modal?.querySelector(".map-modal__close");
  let map: L.Map | null = null;

  function closeMapModal(): void {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("map-modal-open");
    if (map) {
      map.remove();
      map = null;
    }
  }

  function openMapModal(lat: number, lng: number, petName: string): void {
    if (!modal || !container) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("map-modal-open");

    const titleEl = document.getElementById("map-modal-title");
    if (titleEl) titleEl.textContent = `${petName} on Map`;

    container.innerHTML = "";
    map = L.map(container).setView([lat, lng], 5);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> &copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);
    L.circleMarker([lat, lng], {
      radius: 12,
      fillColor: "#f58021",
      color: "#20113d",
      weight: 2,
      fillOpacity: 0.95,
    }).addTo(map);
  }

  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest(".view-map-btn");
    if (!btn) return;
    e.preventDefault();
    const latStr = (btn as HTMLElement).dataset.lat;
    const lngStr = (btn as HTMLElement).dataset.lng;
    const petName = (btn as HTMLElement).dataset.petName ?? "Animal";
    const lat = parseFloat(latStr ?? "0");
    const lng = parseFloat(lngStr ?? "0");
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      openMapModal(lat, lng, petName);
    }
  });

  backdrop?.addEventListener("click", closeMapModal);
  closeBtn?.addEventListener("click", closeMapModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) closeMapModal();
  });
}

function initCareModal(): void {
  const modal = document.getElementById("care-modal");
  const triggers = document.querySelectorAll(".care-modal-trigger");
  const backdrop = modal?.querySelector(".care-modal__backdrop");
  const closeBtn = modal?.querySelector(".care-modal__close");
  const amounts = modal?.querySelectorAll(".care-modal__amount");

  function openModal(): void {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("care-modal-open");
  }

  function closeModal(): void {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("care-modal-open");
  }

  triggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  backdrop?.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);

  amounts?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = (btn as HTMLElement).dataset.value ?? "10";
      closeModal();
      const openGive = (window as unknown as { openGiveModal?: (v: string) => void }).openGiveModal;
      if (typeof openGive === "function") {
        openGive(value === "other" ? "custom" : value);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
  });
}

function initGiveModal(): void {
  const modal = document.getElementById("give-modal");
  const triggers = document.querySelectorAll(".give-modal-trigger");
  const backdrop = modal?.querySelector(".give-modal__backdrop");
  const steps = modal?.querySelectorAll(".give-modal__step");
  const dots = modal?.querySelectorAll(".give-modal__dot");
  const nextBtns = modal?.querySelectorAll(".give-modal__btn--next");
  const backBtns = modal?.querySelectorAll(".give-modal__btn--back");
  const submitBtn = modal?.querySelector(".give-modal__btn--submit");
  const amountOptions = modal?.querySelectorAll(".give-modal__amount-option");
  const customBtn = modal?.querySelector(".give-modal__custom-btn");
  const customInput = modal?.querySelector(".give-modal__input--custom") as HTMLInputElement | null;
  const selectWrap = modal?.querySelector(".give-modal__select-wrap");
  const selectTrigger = modal?.querySelector(".give-modal__select-trigger");
  const selectText = modal?.querySelector(".give-modal__select-text");
  const selectItems = modal?.querySelectorAll(".give-modal__select-item");

  if (!modal) return;

  function showStep(stepNum: string): void {
    const n = Number(stepNum);
    steps?.forEach((s) => {
      s.classList.toggle("give-modal__step--active", Number((s as HTMLElement).dataset.step) === n);
    });
    dots?.forEach((d) => {
      d.classList.toggle("give-modal__dot--active", Number((d as HTMLElement).dataset.step) <= n);
    });
  }

  function setAmount(value: string): void {
    amountOptions?.forEach((btn) => {
      btn.classList.toggle("give-modal__amount-option--active", (btn as HTMLElement).dataset.value === value);
    });
    if (value === "custom") {
      customBtn?.classList.add("is-active");
    } else {
      customBtn?.classList.remove("is-active");
      if (customInput) customInput.value = "";
    }
  }

  function openGiveModal(amount?: string): void {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("give-modal-open");
    document.body.classList.remove("care-modal-open");
    showStep("1");
    setAmount(amount ?? "10");
  }
  (window as unknown as { openGiveModal?: (v?: string) => void }).openGiveModal = openGiveModal;

  function closeGiveModal(): void {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("give-modal-open");
    showStep("1");
    selectWrap?.classList.remove("is-open");
  }

  triggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openGiveModal();
    });
  });

  backdrop?.addEventListener("click", closeGiveModal);

  nextBtns?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const goto = (btn as HTMLElement).dataset.goto;
      if (goto) showStep(goto);
    });
  });

  backBtns?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const goto = (btn as HTMLElement).dataset.goto;
      if (goto) showStep(goto);
    });
  });

  submitBtn?.addEventListener("click", closeGiveModal);

  amountOptions?.forEach((btn) => {
    btn.addEventListener("click", () => setAmount((btn as HTMLElement).dataset.value ?? ""));
  });

  customBtn?.addEventListener("click", () => {
    setAmount("custom");
    customInput?.focus();
  });

  customInput?.addEventListener("input", () => {
    if (customInput?.value.trim()) setAmount("custom");
  });

  selectTrigger?.addEventListener("click", () => {
    selectWrap?.classList.toggle("is-open");
    selectTrigger?.setAttribute("aria-expanded", String(selectWrap?.classList.contains("is-open")));
  });

  selectItems?.forEach((item) => {
    item.addEventListener("click", () => {
      selectItems.forEach((i) => i.classList.remove("give-modal__select-item--chosen"));
      item.classList.add("give-modal__select-item--chosen");
      if (selectText) selectText.textContent = item.textContent?.trim() ?? "";
      selectWrap?.classList.remove("is-open");
      selectTrigger?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (selectWrap && !selectWrap.contains(e.target as Node)) {
      selectWrap.classList.remove("is-open");
      selectTrigger?.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) closeGiveModal();
  });
}

function initNavPanelClick(
  _cameras: Camera[],
  onSelect: (petId: number, slug: string) => void
): void {
  const list = document.getElementById("nav-panel-list");
  if (!list) return;

  list.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest("a[data-pet-id]");
    if (!link) return;
    e.preventDefault();
    const petId = Number((link as HTMLElement).dataset.petId);
    const slug = getPetSlug(petId);
    const url = new URL(window.location.href);
    url.searchParams.set("animal", slug);
    window.history.pushState({}, "", url.toString());
    onSelect(petId, slug);
  });
}

async function loadAndRender(cameras: Camera[]): Promise<void> {
  const { slug, petId } = parseUrlSpecies(cameras);
  const camera = cameras.find((c) => c.petId === petId) ?? cameras[0]!;

  let petDetail: PetDetail | null = null;
  try {
    const res = await getPetById(petId);
    petDetail = res.data;
  } catch {
    void 0;
  }

  buildNavPanel(cameras, petId);
  renderStreamContent(slug, petDetail);
  renderSupportSection(petDetail, camera.text);
  renderFactsSection(petDetail, slug);
  updatePageTitle(petDetail);

  initNavPanelClick(cameras, async (newPetId, newSlug) => {
    const newCamera = cameras.find((c) => c.petId === newPetId) ?? cameras[0]!;
    buildNavPanel(cameras, newPetId);

    const overlay = document.getElementById("facts-overlay");
    overlay?.classList.add("is-visible");
    overlay?.setAttribute("aria-hidden", "false");

    let newPetDetail: PetDetail | null = null;
    try {
      const res = await getPetById(newPetId);
      newPetDetail = res.data;
    } catch {
      void 0;
    }

    overlay?.classList.remove("is-visible");
    overlay?.setAttribute("aria-hidden", "true");

    renderStreamContent(newSlug, newPetDetail);
    renderSupportSection(newPetDetail, newCamera.text);
    renderFactsSection(newPetDetail, newSlug);
    updatePageTitle(newPetDetail);
  });
}

async function init(): Promise<void> {
  initHamburgerMenu();

  const main = document.querySelector("main.main");
  if (!main) return;

  const streamSection = main.querySelector(".stream");
  const supportSection = main.querySelector(".support");
  const factsSection = main.querySelector(".facts");

  if (!streamSection || !supportSection || !factsSection) return;

  const loaderContainer = document.createElement("div");
  loaderContainer.className = "zoos-loader-container";
  loaderContainer.innerHTML = createLoaderHtml();
  streamSection.insertAdjacentElement("afterend", loaderContainer);

  streamSection.setAttribute("aria-hidden", "true");
  supportSection.setAttribute("aria-hidden", "true");
  factsSection.setAttribute("aria-hidden", "true");

  const stickyAside = document.querySelector(".sticky-aside");

  try {
    const { data: cameras } = await getCameras();
    if (!cameras.length) {
      loaderContainer.innerHTML = createErrorHtml();
      stickyAside?.classList.add("sticky-aside--hidden");
      return;
    }
    await loadAndRender(cameras);
    loaderContainer.remove();
    streamSection.removeAttribute("aria-hidden");
    supportSection.removeAttribute("aria-hidden");
    factsSection.removeAttribute("aria-hidden");
  } catch {
    loaderContainer.innerHTML = createErrorHtml();
    stickyAside?.classList.add("sticky-aside--hidden");
  }

  initNavPanelToggle();
  initNavPanelScroll();
  initStreamCarousel();
  initMapModal();
  initCareModal();
  initGiveModal();
}

document.addEventListener("DOMContentLoaded", () => {
  void init();
});
