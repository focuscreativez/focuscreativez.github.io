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
