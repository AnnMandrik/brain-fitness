import {FocusLock} from '../utils/focus-lock';
import {disablePageScroll, enablePageScroll} from '../vendor/scroll-lock';

const focusLock = new FocusLock();

const header = document.querySelector('.header');
const menuToggleBtn = header ? header.querySelector('[data-nav-toggle]') : null;
const mainNav = header ? header.querySelector('.main-nav') : null;

const mainMenuLinks = mainNav ? Array.from(mainNav.querySelectorAll('.main-nav__item > a, .main-nav__item > button')) : null;
const mainOtherLinks = mainNav ? Array.from(mainNav.querySelectorAll('.main-nav__wrapper > a')) : null;

const breakpoint = window.matchMedia('(max-width: 767px)');


const openMenu = () => {
  if (!header.classList.contains('is-opened')) {
    menuToggleBtn.setAttribute('aria-label', 'Закрыть меню');
    menuToggleBtn.setAttribute('aria-pressed', 'true');
    header.classList.add('is-opened');
    mainNav.classList.add('is-visible');
    mainMenuLinks.forEach((item) => item.removeAttribute('tabindex'));
    mainOtherLinks.forEach((item) => item.removeAttribute('tabindex'));


    document.addEventListener('keydown', onDocumentKeydown);
    focusLock.lock('.header__wrapper');
    disablePageScroll(mainNav);
  }
};

const closeMenu = () => {
  if (header.classList.contains('is-opened')) {
    menuToggleBtn.setAttribute('aria-label', 'Открыть меню');
    menuToggleBtn.setAttribute('aria-pressed', 'false');
    mainMenuLinks.forEach((item) => item.setAttribute('tabindex', '-1'));
    mainOtherLinks.forEach((item) => item.setAttribute('tabindex', '-1'));

    mainNav.classList.remove('is-visible');
    setTimeout(() => {
      header.classList.remove('is-opened');
    }, 300);

    document.removeEventListener('keydown', onDocumentKeydown);
    focusLock.unlock(true);
    enablePageScroll(mainNav);
  }
};


const onDocumentClick = (evt) => {
  // клик за пределами меню
  if (!evt.target.closest('.header__wrapper')) {
    closeMenu();
  }
  // кнопка закрытия
  if (breakpoint.matches && evt.target.closest('[data-nav-toggle]')) {
    if (header.classList.contains('is-opened')) {
      menuToggleBtn.removeAttribute('data-focus');
      closeMenu();
    } else {
      menuToggleBtn.setAttribute('data-focus', 'true');
      openMenu();
    }
  }
};

const onDocumentKeydown = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeMenu();
  }
};

// const beginScrolling = (menu) => {
//   const screenHeight = document.documentElement.clientHeight;
//   const menuTop = menu.getBoundingClientRect().top;
//   if (screenHeight < menu.getBoundingClientRect().bottom + 10) {
//     menu.style.maxHeight = (screenHeight - menuTop) + 'px';
//     menu.classList.add('scroll-container');
//   }
//   disablePageScroll(menu);
// };

// const endScrolling = (menu) => {
//   enablePageScroll(menu);
//   menu.style.maxHeight = null;
//   menu.classList.remove('scroll-container');
// };

const breakpointChecker = () => {
  // чтобы при смене брейка меню не моргало
  mainNav.style.display = 'none';
  setTimeout(() => {
    mainNav.style.display = null;
  }, 300);

  if (breakpoint.matches) {
    mainMenuLinks.forEach((item) => item.setAttribute('tabindex', '-1'));
    mainOtherLinks.forEach((item) => item.setAttribute('tabindex', '-1'));
  }

  if (!breakpoint.matches) {
    closeMenu();
    mainMenuLinks.forEach((item) => item.removeAttribute('tabindex'));
    mainOtherLinks.forEach((item) => item.removeAttribute('tabindex'));
  }
};


const initMainNav = () => {
  if (header && mainNav) {
    document.addEventListener('click', onDocumentClick);

    breakpoint.addListener(breakpointChecker);

    if (breakpoint.matches) {
      mainMenuLinks.forEach((item) => item.setAttribute('tabindex', '-1'));
      mainOtherLinks.forEach((item) => item.setAttribute('tabindex', '-1'));
    }
  }
};

export {initMainNav};
