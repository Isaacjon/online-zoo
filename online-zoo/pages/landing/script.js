const PETS_DATA = [
  {
    id: 'panda',
    petName: 'Lucas',
    name: 'Giant Panda',
    description:
      'Native to central China, giant pandas have come to symbolize vulnerable species.',
    image: '../../assets/images/pets/panda.jpg',
    url: '../animal/index.html?animal=panda',
  },
  {
    id: 'lemur',
    petName: 'Andy',
    name: 'Madagascarian Lemur',
    description:
      "Lemurs are considered the world's most endangered group of mammals.",
    image: '../../assets/images/pets/lemur.jpg',
    url: '../animal/index.html?animal=lemur',
  },
  {
    id: 'gorilla',
    petName: 'Glen',
    name: 'Gorilla in Congo',
    description:
      'Variety of snacks very important for the healthy life of gorillas and his plenty of babies.',
    image: '../../assets/images/pets/gorilla.jpg',
    url: '../animal/index.html?animal=gorilla',
  },
  {
    id: 'alligator',
    petName: 'Mike',
    name: 'Chinese Alligator',
    description:
      'From nose to tail, belly to back, hard scales protect this petite alligator.',
    image: '../../assets/images/pets/alligator.jpg',
    url: '../animal/index.html?animal=alligator',
  },
  {
    id: 'eagle',
    petName: 'Sam & Lora',
    name: 'West End Bald Eagles',
    description:
      'Pair of eagle parents lay and protect eggs, feed their chicks and teach them to hunt and fly.',
    image: '../../assets/images/pets/eagle.jpg',
    url: '../animal/index.html?animal=eagle',
  },
  {
    id: 'koala',
    petName: 'Liz',
    name: 'Australian Koala',
    description:
      'The elevated walkways bring you to eye level with the koalas as they perch in their forest.',
    image: '../../assets/images/pets/koala.jpg',
    url: '../animal/index.html?animal=koala',
  },
  {
    id: 'lion',
    petName: 'Shake',
    name: 'African Lion',
    description:
      'Lions roam the savannas and grasslands of Africa, hunting and raising cubs in the pride.',
    image: '../../assets/images/pets/lion.jpg',
    url: '../animal/index.html?animal=lion',
  },
  {
    id: 'tiger',
    petName: 'Senja',
    name: 'Sumatran Tiger',
    description:
      'Sumatran Tigers are the smallest of the five sub-species, and are found in Indonesia.',
    image: '../../assets/images/pets/tiger.jpg',
    url: '../animal/index.html?animal=tiger',
  },
];

function renderAnimalCards(container) {
  if (!container) return;
  container.innerHTML = PETS_DATA.map(
    (pet) => `
    <article class="animal-card" data-animal="${pet.id}">
      <a href="${pet.url}" class="animal-card__overlay" aria-label="View ${pet.name}"></a>
      <figure class="animal-card__media">
        <img src="${pet.image}" alt="${pet.name}" loading="lazy" />
        <span class="animal-card__badge">${pet.petName}</span>
      </figure>
      <div class="animal-card__info">
        <h3 class="animal-card__title">${pet.name}</h3>
        <p class="animal-card__desc">${pet.description}</p>
        <a href="${pet.url}" class="btn_orange-ghost animal-card__cta">
          <span>VIEW LIVE CAM</span>
          <img src="../../assets/icons/union.svg" alt="" width="24" height="22" class="btn__icon" />
        </a>
      </div>
    </article>
  `
  ).join('');
}

function initPetsSlider() {
  const carousel = document.getElementById('pets-carousel');
  const prevBtn = document.querySelector('.pets-in-zoo__nav-btn--prev');
  const nextBtn = document.querySelector('.pets-in-zoo__nav-btn--next');

  renderAnimalCards(carousel);

  const firstCard = carousel?.querySelector('.animal-card');
  if (!carousel || !firstCard || !prevBtn || !nextBtn) return;

  const gap = parseFloat(getComputedStyle(carousel).gap) || 20;
  const getScrollAmount = () => firstCard.offsetWidth + gap;

  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });
}

function initTestimonialsSlider() {
  const slider = document.getElementById('testimonials-scroll');
  const list = document.querySelector('.testimonials__list');
  const card = document.querySelector('.feedback-tile');
  const prevBtn = document.querySelector('.testimonials__nav-btn--prev');
  const nextBtn = document.querySelector('.testimonials__nav-btn--next');
  const pagerDots = document.querySelectorAll('.testimonials__pager-dot');

  if (!slider || !list || !card || !prevBtn || !nextBtn) return;

  const cardWidth = card.offsetWidth;
  const cardGap = parseFloat(getComputedStyle(list).gap) || 30;
  const move = cardWidth + cardGap;

  function getScrollPositions() {
    const maxScroll = list.scrollWidth - slider.clientWidth;
    if (maxScroll <= 0) return [0];
    const count = pagerDots.length;
    return Array.from({ length: count }, (_, i) =>
      i === count - 1 ? maxScroll : Math.round((maxScroll * i) / (count - 1))
    );
  }

  function updateActiveDot() {
    const positions = getScrollPositions();
    const scrollLeft = slider.scrollLeft;
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
      dot.classList.toggle('testimonials__pager-dot--active', i === activeIndex);
      if (i === activeIndex) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -move, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: move, behavior: 'smooth' });
  });

  pagerDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const positions = getScrollPositions();
      const target = positions[index] ?? 0;
      slider.scrollTo({ left: target, behavior: 'smooth' });
    });
  });

  slider.addEventListener('scroll', updateActiveDot);
  window.addEventListener('resize', () => {
    updateActiveDot();
  });

  updateActiveDot();
}

function initSupportAnimalsSlider() {
  const slider = document.querySelector('.support-animals__slider');
  const list = document.querySelector('.support-animals__list');
  const paginationItems = document.querySelectorAll('.support-animals__pagination-item');

  if (!slider || !list || !paginationItems.length) return;

  function getScrollPositions() {
    const maxScroll = list.scrollWidth - slider.clientWidth;
    if (maxScroll <= 0) return [0];
    const count = paginationItems.length;
    return Array.from({ length: count }, (_, i) =>
      i === count - 1 ? maxScroll : Math.round((maxScroll * i) / (count - 1))
    );
  }

  function updateActiveDot() {
    const positions = getScrollPositions();
    const scrollLeft = slider.scrollLeft;
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
      item.classList.toggle('support-animals__pagination-item_active', i === activeIndex);
    });
  }

  paginationItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const positions = getScrollPositions();
      const target = positions[index] ?? 0;
      slider.scrollTo({ left: target, behavior: 'smooth' });
    });
  });

  slider.addEventListener('scroll', updateActiveDot);
  window.addEventListener('resize', updateActiveDot);
  updateActiveDot();
}

function initGiveModal() {
  const modal = document.getElementById('give-modal');
  const careModal = document.getElementById('care-modal');
  const triggers = document.querySelectorAll('.donate-trigger');
  const careTriggers = document.querySelectorAll('.care-modal-trigger');
  const backdrop = modal?.querySelector('.give-modal__backdrop');
  const careBackdrop = careModal?.querySelector('.care-modal__backdrop');
  const careClose = careModal?.querySelector('.care-modal__close');
  const careAmounts = careModal?.querySelectorAll('.care-modal__amount');
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

  if (!modal && !careModal) return;

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
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('give-modal-open');
    document.body.classList.remove('care-modal-open');
    showStep(1);
    setAmount(amount || '10');
  }

  function closeGiveModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('give-modal-open');
    showStep(1);
    selectWrap?.classList.remove('is-open');
  }

  function openCareModal() {
    careModal?.classList.add('is-open');
    careModal?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('care-modal-open');
  }

  function closeCareModal() {
    careModal?.classList.remove('is-open');
    careModal?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('care-modal-open');
  }

  triggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openGiveModal();
    });
  });

  careTriggers?.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openCareModal();
    });
  });

  if (careClose) careClose.addEventListener('click', closeCareModal);
  if (careBackdrop) careBackdrop.addEventListener('click', closeCareModal);

  careAmounts?.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.value || '10';
      closeCareModal();
      openGiveModal(value === 'other' ? 'custom' : value);
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
    if (e.key !== 'Escape') return;
    if (careModal?.classList.contains('is-open')) {
      closeCareModal();
    } else if (modal?.classList.contains('is-open')) {
      closeGiveModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPetsSlider();
  initTestimonialsSlider();
  initSupportAnimalsSlider();
  initGiveModal();

  const body = document.body;
  const hamburger = document.querySelector('.header__hamburger');
  const sideMenu = document.querySelector('#side-menu');
  const sideMenuClose = document.querySelector('.side-menu__close');

  function openMenu() {
    body.classList.add('side-menu-open');
    if (sideMenu) sideMenu.classList.add('side-menu--open');
    if (sideMenu) sideMenu.setAttribute('aria-hidden', 'false');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
    }
  }

  function closeMenu() {
    body.classList.remove('side-menu-open');
    if (sideMenu) sideMenu.classList.remove('side-menu--open');
    if (sideMenu) sideMenu.setAttribute('aria-hidden', 'true');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    }
  }

  function toggleMenu() {
    const isOpen = body.classList.contains('side-menu-open');
    isOpen ? closeMenu() : openMenu();
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (sideMenuClose) {
    sideMenuClose.addEventListener('click', closeMenu);
  }
});
