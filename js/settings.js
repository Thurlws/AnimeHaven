// Anime Haven: settings the visitor can change (dark mode, closing the promo bar).
// This file loads in the <head> WITHOUT "defer", so it runs before the page is
// drawn. That way someone using dark mode never sees a flash of white first.

// localStorage can be blocked (private windows, some browsers on file://),
// so every read and write is wrapped in try/catch.
function loadSetting(name) {
  try {
    return localStorage.getItem(name);
  } catch (error) {
    return null;
  }
}

function saveSetting(name, value) {
  try {
    localStorage.setItem(name, value);
  } catch (error) {
    // not remembered, but it still works on this page
  }
}

const page = document.documentElement; // the <html> element

// 1. Dark mode: the saved choice, or else whatever the computer is set to.
// The CSS swaps its colours when <html> has data-theme="dark".
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
page.dataset.theme = loadSetting('theme') || systemTheme;

// 2. Promo bar: once closed, it stays closed (the CSS hides it)
if (loadSetting('promo-closed')) {
  page.classList.add('promo-closed');
}

// aria-pressed tells screen readers whether the dark mode button is on
function showThemeButton() {
  document.querySelectorAll('.theme-toggle').forEach(function (button) {
    button.setAttribute('aria-pressed', page.dataset.theme === 'dark');
  });
}

// The buttons don't exist yet, so wait for the page, and listen on the whole document
document.addEventListener('DOMContentLoaded', showThemeButton);

document.addEventListener('click', function (event) {
  if (event.target.closest('.theme-toggle')) {
    page.dataset.theme = page.dataset.theme === 'dark' ? 'light' : 'dark';
    saveSetting('theme', page.dataset.theme);
    showThemeButton();
  }

  if (event.target.closest('.promo-close')) {
    page.classList.add('promo-closed');
    saveSetting('promo-closed', 'yes');
  }
});
