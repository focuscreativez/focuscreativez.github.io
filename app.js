const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileMenu.hidden = !open;
});
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileMenu.hidden = true;
}
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  document.getElementById('service').value = link.dataset.service;
}));
const dialogs = document.querySelectorAll('dialog');
dialogs.forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
});
function openDialog(dialog) { document.body.classList.add('dialog-open'); dialog.showModal(); }
let currentBrief = '';
document.getElementById('enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const dateValue = data.get('date');
  const date = dateValue ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateValue + 'T12:00:00')) : 'Flexible / to discuss';
  currentBrief = `Hi David,\n\nI’d like to discuss a project with you.\n\nName: ${data.get('name').trim()}\nEmail: ${data.get('email').trim()}\nService: ${data.get('service')}\nIdeal date: ${date}\nLocation: ${data.get('location').trim() || 'To discuss'}\nBudget: ${data.get('budget')}\n\nThe idea:\n${data.get('message').trim()}\n\nThanks,\n${data.get('name').trim()}`;
  document.getElementById('brief-preview').textContent = currentBrief;
  document.getElementById('email-enquiry').href = 'mailto:focuscreativez2020@gmail.com?subject=' + encodeURIComponent(`${data.get('service')} enquiry — ${data.get('name').trim()}`) + '&body=' + encodeURIComponent(currentBrief);
  document.getElementById('copy-status').textContent = '';
  openDialog(document.getElementById('enquiry-dialog'));
});
document.getElementById('copy-brief').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText(currentBrief); status.textContent = 'Brief copied. Paste it into your email to David.'; }
  catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('brief-preview'));
    selection.removeAllRanges(); selection.addRange(range);
    status.textContent = 'Your brief is selected. Copy it and paste it into your email.';
  }
});

const galleryFilters = document.querySelector('.gallery-filters');
const galleryFigures = [...document.querySelectorAll('.still-item')];
galleryFilters.hidden = false;
galleryFilters.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  galleryFilters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  galleryFigures.forEach(figure => { figure.hidden = button.dataset.filter !== 'All' && figure.dataset.category !== button.dataset.filter; });
  const count = galleryFigures.filter(figure => !figure.hidden).length;
  document.getElementById('gallery-count').textContent = count + (count === 1 ? ' photograph' : ' photographs');
});
const photoDialog = document.getElementById('photo-dialog');
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = index;
  const figure = galleryFigures[index];
  const image = figure.querySelector('img');
  document.getElementById('photo-full').src = figure.querySelector('a').href;
  document.getElementById('photo-full').alt = image.alt;
  document.getElementById('photo-caption').textContent = figure.querySelector('h4').textContent + ' / ' + figure.dataset.category;
}
document.querySelectorAll('[data-photo]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault(); showPhoto(Number(link.dataset.photo)); openDialog(photoDialog);
}));
function stepPhoto(direction) {
  const visible = galleryFigures.map((figure,index) => figure.hidden ? -1 : index).filter(index => index >= 0);
  const position = visible.indexOf(photoIndex);
  showPhoto(visible[(position + direction + visible.length) % visible.length]);
}
document.getElementById('photo-prev').addEventListener('click', () => stepPhoto(-1));
document.getElementById('photo-next').addEventListener('click', () => stepPhoto(1));
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); stepPhoto(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); stepPhoto(-1); }
});
