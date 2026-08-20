export function showToast(msg, kind = 'ok') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  const icon = kind === 'warn' ? 'fa-triangle-exclamation' : 'fa-check';
  el.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .4s';
    setTimeout(() => el.remove(), 400);
  }, 2800);
}
