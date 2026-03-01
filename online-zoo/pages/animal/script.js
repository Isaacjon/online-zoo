const STREAM_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

const SPECIES_CATALOG = {
  panda: {
    id: 'panda',
    name: 'Giant Panda',
    streamTitle: "Live Panda Cams",
    navLabel: "China's Panda Center live feed",
    icon: '../../assets/icons/map/panda.svg',
    image: '../../assets/images/zoos/panda/panda.jpg',
    mainCam: '../../assets/images/zoos/panda/main-cam.jpg',
    additionalCams: [
      '../../assets/images/zoos/panda/additional-cam-1.jpg',
      '../../assets/images/zoos/panda/additional-cam-2.jpg',
      '../../assets/images/zoos/panda/additional-cam-3.jpg',
    ],
    fundTitle: 'Support Bamboo for Pandas!',
    fundText:
      "Bamboo donations begin with a site visit. Our staff checks the growing location and identifies whether the species is suitable for our pandas. We appreciate your support.",
    funFact:
      "Pandas often eat while sitting with their legs stretched out. Despite looking calm, they climb trees and swim well.",
    info: [
      { label: 'Common name:', value: 'Giant Panda' },
      { label: 'Scientific name:', value: 'Ailuropoda melanoleuca' },
      { label: 'Type:', value: 'Herbivore' },
      { label: 'Size:', value: '4 to 5 feet' },
      { label: 'Diet:', value: 'Omnivore' },
      { label: 'Habitat:', value: 'Forests' },
      { label: 'Range:', value: 'Eastern Asia' },
    ],
    description:
      "Giant pandas eat mostly bamboo, which is low in nutrients. They have evolved many adaptations for this diet and are mostly solitary, using a strong sense of smell to find mates in spring.",
  },
  eagle: {
    id: 'eagle',
    name: 'West End Bald Eagles',
    streamTitle: "Live Eagle Cams",
    navLabel: "Bald Eagles Nest at West End",
    icon: '../../assets/icons/map/eagle.svg',
    image: '../../assets/images/zoos/eagle/eagle.jpg',
    mainCam: '../../assets/images/zoos/eagle/main-cam.jpg',
    additionalCams: [
      '../../assets/images/zoos/eagle/additional-cam-1.jpg',
      '../../assets/images/zoos/eagle/additional-cam-2.jpg',
      '../../assets/images/zoos/eagle/additional-cam-3.jpg',
    ],
    fundTitle: 'Keep the Bald Eagle cams Streaming!',
    fundText:
      "See this pair of eagle parents lay eggs, raise chicks, and teach them to hunt. Sam & Lora have won over thousands of viewers. All donations go directly to streaming and operational costs.",
    funFact:
      "As a US symbol and large predator, the bald eagle appears often in popular culture. Movie eagles usually have a fierce cry, but real bald eagles have a softer, chirpier call.",
    info: [
      { label: 'Common name:', value: 'Bald Eagle' },
      { label: 'Scientific name:', value: 'Haliaeetus leucocephalus' },
      { label: 'Type:', value: 'Bird of prey' },
      { label: 'Size:', value: '28 to 40 inches' },
      { label: 'Diet:', value: 'Carnivore' },
      { label: 'Habitat:', value: 'Forests, near water' },
      { label: 'Range:', value: 'North America' },
    ],
    description:
      "Bald eagles are the national bird of the United States. They are known for their distinctive white head and tail feathers. These birds build large nests, often in tall trees near water. Eagles are excellent hunters and primarily feed on fish.",
  },
  gorilla: {
    id: 'gorilla',
    name: 'Gorilla in Congo',
    streamTitle: "Live Gorilla Cams",
    navLabel: "Gorilla Forest Corridor habitat stream",
    icon: '../../assets/icons/map/gorilla.svg',
    image: '../../assets/images/zoos/gorilla/gorilla.jpg',
    mainCam: '../../assets/images/zoos/gorilla/main-cam.jpg',
    additionalCams: [
      '../../assets/images/zoos/gorilla/additional-cam-1.jpg',
      '../../assets/images/zoos/gorilla/additional-cam-2.jpg',
      '../../assets/images/zoos/gorilla/additional-cam-3.jpg',
    ],
    fundTitle: 'Make a difference for the gorillas!',
    fundText:
      "We aim to conserve and restore gorilla populations in Central Africa. Your help matters—support Glen and his family with a food donation.",
    funFact:
      "In addition to having distinctive fingerprints like humans do, gorillas also have unique nose prints. Gorillas are the largest of the great apes, but the western lowland gorilla is the smallest of the subspecies.",
    info: [
      { label: 'Common name:', value: 'Western Lowland Gorilla' },
      { label: 'Scientific name:', value: 'Gorilla gorilla gorilla' },
      { label: 'Type:', value: 'Herbivore' },
      { label: 'Size:', value: '4 to 5.5 feet' },
      { label: 'Diet:', value: 'Herbivore' },
      { label: 'Habitat:', value: 'Forests' },
      { label: 'Range:', value: 'Central Africa' },
    ],
    description:
      "Gorillas are intelligent and social animals. They live in family groups led by a dominant silverback male. Gorillas are primarily herbivorous, feeding on leaves, stems, and fruit. They are critically endangered due to habitat loss and poaching.",
  },
  lemur: {
    id: 'lemur',
    name: 'Madagascarian Lemur',
    streamTitle: "Live Lemur Cams",
    navLabel: "Ring-tailed lemurs in Madagascar, Lemuria Land",
    icon: '../../assets/icons/map/lemur.svg',
    image: '../../assets/images/zoos/lemur/lemur.jpg',
    mainCam: '../../assets/images/zoos/lemur/main-cam.jpg',
    additionalCams: [
      '../../assets/images/zoos/lemur/additional-cam-1.jpg',
      '../../assets/images/zoos/lemur/additional-cam-2.jpg',
      '../../assets/images/zoos/lemur/additional-cam-3.jpg',
    ],
    fundTitle: 'Provide Andy the lemur with fruits!',
    fundText:
      "Over 90% of lemur species are endangered. Watch ring-tailed lemurs play and climb, and help by donating for the fruits they love.",
    funFact:
      "Ring-tailed lemurs gather in forest clearings to sunbathe, often sitting with bellies toward the sun and limbs stretched out.",
    info: [
      { label: 'Common name:', value: 'Ring-tailed Lemur' },
      { label: 'Scientific name:', value: 'Lemur catta' },
      { label: 'Type:', value: 'Omnivore' },
      { label: 'Size:', value: '15 to 18 inches' },
      { label: 'Diet:', value: 'Omnivore' },
      { label: 'Habitat:', value: 'Forests' },
      { label: 'Range:', value: 'Madagascar' },
    ],
    description:
      "Ring-tailed lemurs are easily recognizable by their long, black and white striped tails. They live in social groups and are highly vocal. Lemurs are endemic to Madagascar, meaning they are found nowhere else on Earth.",
  },
  tiger: {
    id: 'tiger',
    name: 'Sumatran Tiger',
    streamTitle: "Live Tiger Cams",
    navLabel: "Watch Senja at the Sumatran Tiger habitat",
    icon: '../../assets/icons/map/tiger.svg',
    image: '../../assets/images/pets/tiger.jpg',
    fundTitle: 'Support the Tigers!',
    fundText:
      "Sumatran tigers are critically endangered. Your donation helps us provide care for Senja and support conservation efforts to protect these magnificent cats in the wild.",
    funFact:
      "Sumatran tigers are the smallest of the five tiger subspecies. They have narrower stripes than other tigers. These tigers are excellent swimmers and often cool off in water.",
    info: [
      { label: 'Common name:', value: 'Sumatran Tiger' },
      { label: 'Scientific name:', value: 'Panthera tigris sumatrae' },
      { label: 'Type:', value: 'Carnivore' },
      { label: 'Size:', value: '7 to 9 feet' },
      { label: 'Diet:', value: 'Carnivore' },
      { label: 'Habitat:', value: 'Tropical forests' },
      { label: 'Range:', value: 'Indonesia' },
    ],
    description:
      "Sumatran tigers are the smallest living tiger subspecies. They are critically endangered with fewer than 400 individuals left in the wild. Habitat loss and poaching are the main threats to their survival.",
  },
  alligator: {
    id: 'alligator',
    name: 'Chinese Alligator',
    streamTitle: "Live Alligator Cams",
    navLabel: "Watch Mike at the Chinese Alligator enclosure",
    icon: '../../assets/icons/map/alligator.svg',
    image: '../../assets/images/pets/alligator.jpg',
    fundTitle: 'Support the Alligators!',
    fundText:
      "Chinese alligators are critically endangered. Your donation helps us maintain Mike's habitat and support breeding programs to save this species from extinction.",
    funFact:
      "From nose to tail, belly to back, hard scales protect this petite alligator. Chinese alligators are smaller than American alligators and are one of the most endangered crocodilian species.",
    info: [
      { label: 'Common name:', value: 'Chinese Alligator' },
      { label: 'Scientific name:', value: 'Alligator sinensis' },
      { label: 'Type:', value: 'Carnivore' },
      { label: 'Size:', value: '4 to 5 feet' },
      { label: 'Diet:', value: 'Carnivore' },
      { label: 'Habitat:', value: 'Rivers, wetlands' },
      { label: 'Range:', value: 'Eastern China' },
    ],
    description:
      "Chinese alligators are one of the most endangered crocodilian species. They are smaller than their American cousins and have a more restricted range. Conservation efforts are underway to save this ancient species.",
  },
  koala: {
    id: 'koala',
    name: 'Australian Koala',
    streamTitle: "Live Koala Cams",
    navLabel: "Watch Liz in the elevated koala walkway",
    icon: '../../assets/icons/map/coala.svg',
    image: '../../assets/images/pets/koala.jpg',
    fundTitle: 'Support the Koalas!',
    fundText:
      "The elevated walkways bring you to eye level with the koalas. Your donation helps us provide eucalyptus and care for Liz and her friends. Koalas need our help now more than ever.",
    funFact:
      "Koalas sleep up to 22 hours a day. They have a special digestive system to process eucalyptus leaves, which are toxic to most animals. Koalas have fingerprints similar to humans.",
    info: [
      { label: 'Common name:', value: 'Koala' },
      { label: 'Scientific name:', value: 'Phascolarctos cinereus' },
      { label: 'Type:', value: 'Herbivore' },
      { label: 'Size:', value: '24 to 33 inches' },
      { label: 'Diet:', value: 'Herbivore' },
      { label: 'Habitat:', value: 'Eucalyptus forests' },
      { label: 'Range:', value: 'Australia' },
    ],
    description:
      "Koalas are marsupials native to Australia. They spend most of their time in eucalyptus trees, feeding on the leaves. Koalas are vulnerable due to habitat loss, disease, and climate change.",
  },
  lion: {
    id: 'lion',
    name: 'African Lion',
    streamTitle: "Live Lion Cams",
    navLabel: "Watch Shake on the African savanna exhibit",
    icon: '../../assets/icons/map/lion.svg',
    image: '../../assets/images/pets/lion.jpg',
    fundTitle: 'Support the Lions!',
    fundText:
      "Lions roam the savannas and grasslands of Africa. Your donation helps us provide care for Shake and support conservation efforts to protect lions in the wild.",
    funFact:
      "Lions are the only cats that live in groups, called prides. A pride typically consists of related females, their cubs, and a few males. Male lions have distinctive manes that darken with age.",
    info: [
      { label: 'Common name:', value: 'African Lion' },
      { label: 'Scientific name:', value: 'Panthera leo' },
      { label: 'Type:', value: 'Carnivore' },
      { label: 'Size:', value: '5.5 to 8 feet' },
      { label: 'Diet:', value: 'Carnivore' },
      { label: 'Habitat:', value: 'Savannas, grasslands' },
      { label: 'Range:', value: 'Sub-Saharan Africa' },
    ],
    description:
      "African lions are one of the most iconic animals. They are social predators that hunt in groups. Lions are vulnerable due to habitat loss and human-wildlife conflict. Conservation efforts aim to protect their remaining populations.",
  },
};

const DEFAULT_ANIMAL = 'panda';

function parseUrlSpecies() {
  const params = new URLSearchParams(window.location.search);
  let species = params.get('animal') || DEFAULT_ANIMAL;
  species = SPECIES_CATALOG[species] ? species : DEFAULT_ANIMAL;
  if (!params.get('animal')) {
    const url = new URL(window.location.href);
    url.searchParams.set('animal', species);
    window.history.replaceState({}, '', url.toString());
  }
  return species;
}

function buildNavPanel(activeId) {
  const list = document.getElementById('nav-panel-list');
  if (!list) return;

  const animals = Object.values(SPECIES_CATALOG);
  list.innerHTML = animals
    .map(
      (a) => `
    <li class="nav-panel__entry ${a.id === activeId ? 'nav-panel__entry--active' : ''}">
      <a href="index.html?animal=${a.id}" class="nav-panel__link" data-animal="${a.id}">
        <span class="nav-panel__icon">
          <img src="${a.icon}" alt="" width="80" height="60" />
        </span>
        <span class="nav-panel__label">${a.navLabel}</span>
      </a>
    </li>
  `
    )
    .join('');
}

function renderStreamContent(species) {
  const titleEl = document.getElementById('stream-title');
  const mainLink = document.getElementById('stream-main-link');
  const playBtn = document.getElementById('stream-play-btn');
  const mainImg = document.getElementById('stream-main-img');
  const camsEl = document.getElementById('stream-cams');

  if (titleEl) titleEl.textContent = species.streamTitle;
  if (mainLink) {
    mainLink.href = STREAM_URL;
    mainLink.setAttribute('aria-label', `Watch ${species.name} live on YouTube`);
  }
  if (playBtn) playBtn.href = STREAM_URL;
  if (mainImg) {
    mainImg.src = species.mainCam || species.image;
    mainImg.alt = `${species.name} live cam`;
  }

  if (camsEl) {
    const camImages = species.additionalCams || [species.image, species.image, species.image];
    camsEl.innerHTML = camImages
      .map(
        (img, i) => `
      <a href="${STREAM_URL}" class="stream__cams-item" target="_blank" rel="noopener noreferrer" data-cam="${i}">
        <div class="stream__cams-header">
          <span>Cam ${i + 1}</span>
          <img src="../../assets/icons/zoos/live-cam.svg" alt="Camera" class="stream-cam-icon" width="20" height="20" />
        </div>
        <img src="${img}" alt="${species.name} camera ${i + 1}" />
        <span class="stream__play-btn"></span>
      </a>
    `
      )
      .join('');
  }
}

function renderSupportSection(species) {
  const title = document.getElementById('support-title');
  const text = document.getElementById('support-text');
  if (title) title.textContent = species.fundTitle;
  if (text) text.textContent = species.fundText;
}

function renderFactsSection(species) {
  const subtitle = document.getElementById('facts-subtitle');
  const list = document.getElementById('facts-list');
  const image = document.getElementById('facts-image');
  const descr = document.getElementById('facts-descr');

  if (subtitle) subtitle.textContent = species.funFact;
  if (image) {
    image.src = species.image;
    image.alt = species.name;
  }
  if (descr) descr.textContent = species.description;

  if (list) {
    const listClass = { panda: 'facts__list--panda', eagle: 'facts__list--eagle', gorilla: 'facts__list--gorilla', lemur: 'facts__list--lemur' }[species.id] || 'facts__list--panda';
    list.className = `facts__list ${listClass}`;
    const rows = species.info
      .map(
        (item) => `
      <li class="facts__row"><span>${item.label}</span>${item.value}</li>
    `
      )
      .join('');
    list.innerHTML =
      rows +
      `
    <li class="facts__action">
      <a href="../map/index.html" class="btn_orange-ghost">
          <span>View Map</span>
          <img src="../../assets/icons/union.svg" alt="" width="24" height="22" class="btn__icon">
        </a>
    </li>
  `;
  }
}

function updatePageTitle(animal) {
  document.title = `${animal.name} - Online Zoo animals`;
}

function initNavPanelToggle() {
  const panel = document.getElementById('nav-panel');
  const toggle = panel?.querySelector('.nav-panel__toggle');
  if (!panel || !toggle) return;

  toggle.addEventListener('click', () => {
    panel.classList.toggle('nav-panel--collapsed');
  });
}

function initNavPanelScroll() {
  const list = document.getElementById('nav-panel-list');
  const bottom = document.querySelector('.nav-panel__footer');
  const scrollBtn = document.querySelector('.nav-panel__scroll');

  function updateArrowVisibility() {
    if (!list || !bottom) return;
    const hasOverflow = list.scrollHeight > list.clientHeight;
    bottom.classList.toggle('nav-panel__footer--hidden', !hasOverflow);
  }

  scrollBtn?.addEventListener('click', () => {
    if (!list) return;
    const itemHeight = list.querySelector('.nav-panel__link')?.offsetHeight ?? 172;
    list.scrollBy({ top: itemHeight, behavior: 'smooth' });
  });

  list?.addEventListener('scroll', updateArrowVisibility);
  window.addEventListener('resize', updateArrowVisibility);
  updateArrowVisibility();
}

function initStreamCarousel() {
  const cams = document.getElementById('stream-cams');
  const prevBtn = document.querySelector('.stream__nav--prev');
  const nextBtn = document.querySelector('.stream__nav--next');

  if (!cams || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener('click', () => {
    const firstItem = cams.querySelector('.stream__cams-item');
    if (firstItem) {
      const itemWidth = firstItem.offsetWidth + 20;
      cams.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  });

  nextBtn.addEventListener('click', () => {
    const firstItem = cams.querySelector('.stream__cams-item');
    if (firstItem) {
      const itemWidth = firstItem.offsetWidth + 20;
      cams.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  });
}

function initCareModal() {
  const modal = document.getElementById('care-modal');
  const triggers = document.querySelectorAll('.care-modal-trigger');
  const backdrop = modal?.querySelector('.care-modal__backdrop');
  const closeBtn = modal?.querySelector('.care-modal__close');
  const amounts = modal?.querySelectorAll('.care-modal__amount');

  function openModal() {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('care-modal-open');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('care-modal-open');
  }

  triggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  backdrop?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);

  amounts?.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.value || '10';
      closeModal();
      if (typeof window.openGiveModal === 'function') {
        window.openGiveModal(value === 'other' ? 'custom' : value);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function initGiveModal() {
  const modal = document.getElementById('give-modal');
  const triggers = document.querySelectorAll('.give-modal-trigger');
  const backdrop = modal?.querySelector('.give-modal__backdrop');
  const steps = modal?.querySelectorAll('.give-modal__step');
  const dots = modal?.querySelectorAll('.give-modal__dot');
  const nextBtns = modal?.querySelectorAll('.give-modal__btn--next');
  const backBtns = modal?.querySelectorAll('.give-modal__btn--back');
  const submitBtn = modal?.querySelector('.give-modal__btn--submit');
  const amountOptions = modal?.querySelectorAll('.give-modal__amount-option');
  const customBtn = modal?.querySelector('.give-modal__custom-btn');
  const customInput = modal?.querySelector('.give-modal__input--custom');
  const selectWrap = modal?.querySelector('.give-modal__select-wrap');
  const selectTrigger = modal?.querySelector('.give-modal__select-trigger');
  const selectText = modal?.querySelector('.give-modal__select-text');
  const selectItems = modal?.querySelectorAll('.give-modal__select-item');

  if (!modal) return;

  function showStep(stepNum) {
    const n = Number(stepNum);
    steps?.forEach((s) => {
      s.classList.toggle('give-modal__step--active', Number(s.dataset.step) === n);
    });
    dots?.forEach((d) => {
      d.classList.toggle('give-modal__dot--active', Number(d.dataset.step) <= n);
    });
  }

  function setAmount(value) {
    amountOptions?.forEach((btn) => {
      btn.classList.toggle('give-modal__amount-option--active', btn.dataset.value === value);
    });
    if (value === 'custom') {
      customBtn?.classList.add('is-active');
    } else {
      customBtn?.classList.remove('is-active');
      if (customInput) customInput.value = '';
    }
  }

  function openGiveModal(amount) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('give-modal-open');
    document.body.classList.remove('care-modal-open');
    showStep(1);
    setAmount(amount || '10');
  }
  window.openGiveModal = openGiveModal;

  function closeGiveModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('give-modal-open');
    showStep(1);
    selectWrap?.classList.remove('is-open');
  }

  triggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openGiveModal();
    });
  });

  backdrop?.addEventListener('click', closeGiveModal);

  nextBtns?.forEach((btn) => {
    btn.addEventListener('click', () => {
      const goto = btn.dataset.goto;
      if (goto) showStep(goto);
    });
  });

  backBtns?.forEach((btn) => {
    btn.addEventListener('click', () => {
      const goto = btn.dataset.goto;
      if (goto) showStep(goto);
    });
  });

  submitBtn?.addEventListener('click', closeGiveModal);

  amountOptions?.forEach((btn) => {
    btn.addEventListener('click', () => setAmount(btn.dataset.value || ''));
  });

  customBtn?.addEventListener('click', () => {
    setAmount('custom');
    customInput?.focus();
  });

  customInput?.addEventListener('input', () => {
    if (customInput.value.trim()) setAmount('custom');
  });

  selectTrigger?.addEventListener('click', () => {
    selectWrap?.classList.toggle('is-open');
    selectTrigger?.setAttribute('aria-expanded', selectWrap?.classList.contains('is-open'));
  });

  selectItems?.forEach((item) => {
    item.addEventListener('click', () => {
      selectItems.forEach((i) => i.classList.remove('give-modal__select-item--chosen'));
      item.classList.add('give-modal__select-item--chosen');
      if (selectText) selectText.textContent = item.textContent?.trim() || '';
      selectWrap?.classList.remove('is-open');
      selectTrigger?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (selectWrap && !selectWrap.contains(e.target)) {
      selectWrap.classList.remove('is-open');
      selectTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeGiveModal();
    }
  });
}

function initHamburger() {
  const body = document.body;
  const hamburger = document.querySelector('.header__hamburger');
  const sideMenu = document.querySelector('#side-menu');
  const sideMenuClose = document.querySelector('.side-menu__close');

  function openMenu() {
    body.classList.add('side-menu-open');
    sideMenu?.classList.add('side-menu--open');
    sideMenu?.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');
    hamburger?.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    body.classList.remove('side-menu-open');
    sideMenu?.classList.remove('side-menu--open');
    sideMenu?.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');
    hamburger?.setAttribute('aria-label', 'Open menu');
  }

  hamburger?.addEventListener('click', () => {
    body.classList.contains('side-menu-open') ? closeMenu() : openMenu();
  });
  sideMenuClose?.addEventListener('click', closeMenu);
}

function renderSpecies(speciesId) {
  const species = SPECIES_CATALOG[speciesId];
  if (!species) return;

  buildNavPanel(speciesId);
  renderStreamContent(species);
  renderSupportSection(species);
  renderFactsSection(species);
  updatePageTitle(species);
}

document.addEventListener('DOMContentLoaded', () => {
  const activeSpecies = parseUrlSpecies();
  renderSpecies(activeSpecies);
  initNavPanelToggle();
  initNavPanelScroll();
  initStreamCarousel();
  initCareModal();
  initGiveModal();
  initHamburger();
});
