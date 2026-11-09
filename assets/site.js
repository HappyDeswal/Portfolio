const filters = document.querySelector('.filters');
if (filters) {
  const buttons = [...filters.querySelectorAll('button')];
  const projects = [...document.querySelectorAll('.project')];
  const status = filters.querySelector('[role="status"]');
  filters.hidden = false;

  for (const button of buttons) {
    button.addEventListener('click', () => {
      for (const option of buttons) {
        option.setAttribute('aria-pressed', String(option === button));
      }

      const category = button.dataset.filter;
      for (const project of projects) {
        project.hidden = category !== 'ALL' && !project.dataset.category.split(' / ').includes(category);
      }
      const count = projects.filter(project => !project.hidden).length;
      status.textContent = count === 1 ? '1 project' : count + ' projects';
    });
  }
}

if ('IntersectionObserver' in window && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.1 });

  for (const section of document.querySelectorAll('[data-reveal]')) {
    observer.observe(section);
  }
}

const theme = document.querySelector('.theme-toggle');
if (theme) {
  const root = document.documentElement;
  function applyTheme(value) {
    root.dataset.theme = value;
    theme.setAttribute('aria-pressed', String(value === 'dark'));
  }

  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  theme.hidden = false;
  theme.addEventListener('click', () => {
    const value = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(value);
    try {
      localStorage.setItem('portfolio-theme', value);
    } catch {
      // Keep the selected theme for this page.
    }
  });
}

const menu = document.querySelector('.menu-toggle');
if (menu) {
  menu.hidden = false;
  menu.addEventListener('click', () => {
    menu.setAttribute('aria-expanded', String(menu.getAttribute('aria-expanded') === 'false'));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      menu.setAttribute('aria-expanded', 'false');
      menu.focus();
    }
  });
}

const backTop = document.querySelector('.back-top');
if (backTop) {
  const updateBackTop = () => { backTop.hidden = window.scrollY < 500; };
  window.addEventListener('scroll', updateBackTop, { passive: true });
  updateBackTop();
  backTop.addEventListener('click', () => {
    document.querySelector('.brand').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  });
}

const tiltMotion = matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)');
for (const card of document.querySelectorAll('[data-tilt], .project, .panel')) {
  card.addEventListener('pointermove', event => {
    if (!tiltMotion.matches || event.pointerType !== 'mouse') return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--tilt-x', (0.5 - (event.clientY - rect.top) / rect.height) * 9 + 'deg');
    card.style.setProperty('--tilt-y', ((event.clientX - rect.left) / rect.width - 0.5) * 9 + 'deg');
  });
  card.addEventListener('pointerleave', () => {
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  });
}

const messageForm = document.querySelector('[data-message]');
if (messageForm) {
  const button = messageForm.querySelector('button[type="submit"]');
  const status = messageForm.querySelector('[role="status"]');
  messageForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    button.disabled = true;
    status.textContent = 'Sending…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(messageForm.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(messageForm),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Form submission rejected');
      messageForm.reset();
      status.textContent = 'Message sent. Thank you!';
    } catch {
      status.textContent = controller.signal.aborted
        ? 'The request timed out. Delivery could not be confirmed. You can use the email link above.'
        : 'Could not send your message. Please try again or use the email link above.';
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
    }
  });
}

const printButton = document.querySelector('[data-print]');
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener('click', () => window.print());
}

const progress = document.querySelector('.reading-progress');
if (progress) {
  let scheduled = false;
  const updateProgress = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = height > 0 ? Math.max(0, Math.min(1, window.scrollY / height)) : 0;
      progress.style.setProperty('--reading-progress', fraction);
      scheduled = false;
    });
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

const counters = [...document.querySelectorAll('[data-count]')];
const motionPreference = matchMedia('(prefers-reduced-motion: no-preference)');
if (counters.length && 'IntersectionObserver' in window && motionPreference.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const counter = entry.target;
      const { count, prefix = '', suffix = '' } = counter.dataset;
      const decimals = count.split('.')[1]?.length ?? 0;
      const started = performance.now();
      const tick = now => {
        const fraction = motionPreference.matches ? Math.min(1, (now - started) / 650) : 1;
        const value = Number(count) * (1 - (1 - fraction) ** 3);
        counter.textContent = prefix + value.toFixed(decimals) + suffix;
        if (fraction < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.5 });
  for (const counter of counters) observer.observe(counter);
}

if ('IntersectionObserver' in window && motionPreference.matches) {
  const illustrations = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('art-visible');
      illustrations.unobserve(entry.target);
    }
  }, { threshold: 0.25 });
  for (const art of document.querySelectorAll('.art')) illustrations.observe(art);
}

const timerControls = document.querySelector('[data-timer]');
if (timerControls) {
  const duration = 25 * 60 * 1000;
  const display = document.querySelector('[data-timer-display]');
  const readable = timerControls.querySelector('[role="timer"]');
  const toggle = timerControls.querySelector('[data-timer-toggle]');
  const status = timerControls.querySelector('[data-timer-status]');
  let remaining = duration;
  let deadline = 0;
  let interval;

  function renderTime() {
    const seconds = Math.ceil(remaining / 1000);
    const time = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
    display.textContent = time;
    readable.textContent = time;
  }

  function stop() {
    clearInterval(interval);
    interval = undefined;
    display.parentElement.classList.remove('is-running');
  }

  function tick() {
    remaining = Math.max(0, deadline - Date.now());
    renderTime();
    if (remaining === 0) {
      stop();
      toggle.textContent = 'Start timer';
      status.textContent = 'Focus session complete.';
    }
  }

  toggle.addEventListener('click', () => {
    if (interval !== undefined) {
      tick();
      if (remaining === 0) return;
      stop();
      toggle.textContent = 'Resume timer';
      status.textContent = 'Timer paused.';
      return;
    }
    if (remaining === 0) remaining = duration;
    deadline = Date.now() + remaining;
    interval = setInterval(tick, 250);
    toggle.textContent = 'Pause timer';
    status.textContent = 'Timer running.';
    display.parentElement.classList.add('is-running');
    renderTime();
  });

  timerControls.querySelector('[data-timer-reset]').addEventListener('click', () => {
    stop();
    remaining = duration;
    toggle.textContent = 'Start timer';
    status.textContent = 'Timer reset.';
    renderTime();
  });
  timerControls.hidden = false;
}
