(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.remove('no-motion');
  const gsap = window.gsap;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'ora.light.v1';
  const defaults = { brightness: 70, temperature: 3000, on: true, name: 'Evening glow' };
  const presets = {
    unwind: { brightness: 35, temperature: 2200, name: 'Wind down' },
    settle: { brightness: 70, temperature: 3000, name: 'Settle in' },
    focus: { brightness: 90, temperature: 4200, name: 'Find focus' }
  };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const safeNumber = (value, fallback, min, max, step = 1) => {
    if (value === null || value === undefined || value === '') return fallback;
    const number = Number(value);
    return Number.isFinite(number) ? clamp(Math.round(number / step) * step, min, max) : fallback;
  };
  const safeName = value => Array.from(String(value ?? defaults.name).replace(/\s+/g, ' ').trim()).slice(0, 36).join('') || 'Your light';
  function cleanState(value) {
    return {
      brightness: safeNumber(value?.brightness, defaults.brightness, 10, 100),
      temperature: safeNumber(value?.temperature, defaults.temperature, 2200, 4500, 100),
      on: typeof value?.on === 'boolean' ? value.on : defaults.on,
      name: safeName(value?.name)
    };
  }
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { /* The light works when storage is unavailable. */ }
  const params = new URLSearchParams(location.search);
  const shared = ['level', 'warmth', 'power', 'light'].some(key => params.has(key));
  let state = cleanState(shared ? {
    brightness: params.get('level'), temperature: params.get('warmth'),
    on: params.get('power') !== 'off', name: params.get('light') || defaults.name
  } : saved || defaults);
  const visual = { level: state.on ? state.brightness / 100 : 0, temperature: state.temperature, power: state.on ? 1 : 0 };
  const brightnessInputs = [...document.querySelectorAll('[data-brightness]')];
  const warmthInput = document.querySelector('#warmth');
  const nameInput = document.querySelector('#light-name');
  const feedback = document.querySelector('#save-feedback');
  const announcement = document.querySelector('#light-announcement');

  function paintLight() {
    const mix = clamp((visual.temperature - 2200) / 2300, 0, 1);
    const warm = [255, 170, 80], cool = [235, 241, 226];
    const color = warm.map((value, index) => Math.round(value + (cool[index] - value) * mix));
    root.style.setProperty('--glow', color.join(' '));
    root.style.setProperty('--glow-opacity', String(clamp(visual.level * .95 + visual.power * .1, 0, 1)));
    root.style.setProperty('--lamp-exposure', String(.43 + visual.level * .67));
    root.style.setProperty('--room-exposure', String(.40 + visual.level * .65));
    root.style.setProperty('--light-saturation', String(.3 + visual.power * .7));
    root.style.setProperty('--room-tint', String((1 - mix) * .32 * visual.power));
  }
  function updateLight(immediate = false) {
    document.body.classList.toggle('is-off', !state.on);
    document.querySelectorAll('[data-power]').forEach(button => button.setAttribute('aria-pressed', String(state.on)));
    document.querySelectorAll('[data-power-label]').forEach(label => { label.textContent = state.on ? 'Light is on' : 'Light is off'; });
    document.querySelectorAll('[data-brightness-value]').forEach(output => { output.textContent = `${state.brightness}%`; });
    document.querySelectorAll('[data-temperature-value]').forEach(output => { output.textContent = `${state.temperature} K`; });
    document.querySelector('[data-scene-label]').textContent = state.on ? `${state.temperature} K · ${state.brightness}%` : 'Light is off';
    brightnessInputs.forEach(input => {
      input.value = String(state.brightness);
      input.style.setProperty('--range-fill', `${(state.brightness - 10) / 90 * 100}%`);
      input.setAttribute('aria-valuetext', `${state.brightness} percent`);
    });
    warmthInput.value = String(state.temperature);
    warmthInput.setAttribute('aria-valuetext', `${state.temperature} kelvin`);
    nameInput.value = state.name;
    document.querySelectorAll('[data-preset]').forEach(button => {
      const preset = presets[button.dataset.preset];
      button.setAttribute('aria-pressed', String(state.on && preset.brightness === state.brightness && preset.temperature === state.temperature));
    });
    const next = { level: state.on ? state.brightness / 100 : 0, temperature: state.temperature, power: state.on ? 1 : 0 };
    if (!gsap || preference.matches || immediate) {
      gsap?.killTweensOf(visual);
      Object.assign(visual, next);
      paintLight();
    } else gsap.to(visual, { ...next, duration: .45, ease: 'power2.out', overwrite: true, onUpdate: paintLight });
  }
  function announceLight() {
    announcement.textContent = state.on ? `Light on. ${state.temperature} kelvin, ${state.brightness} percent brightness.` : 'Light off. Your warmth and brightness settings are retained.';
  }
  document.querySelectorAll('[data-power]').forEach(button => button.addEventListener('click', () => {
    state.on = !state.on; updateLight(); announceLight();
  }));
  brightnessInputs.forEach(input => {
    input.addEventListener('input', () => { state.brightness = Number(input.value); state.on = true; updateLight(); });
    input.addEventListener('change', announceLight);
  });
  warmthInput.addEventListener('input', () => { state.temperature = Number(warmthInput.value); state.on = true; updateLight(); });
  warmthInput.addEventListener('change', announceLight);
  document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
    state = { ...presets[button.dataset.preset], on: true }; updateLight(); announceLight();
  }));
  nameInput.addEventListener('input', () => { state.name = nameInput.value; });
  document.querySelector('#reset-light').addEventListener('click', () => {
    state = { ...defaults };
    try { localStorage.removeItem(storageKey); } catch { /* Reset the current preview regardless. */ }
    try {
      const url = new URL(location.href);
      ['level', 'warmth', 'power', 'light'].forEach(key => url.searchParams.delete(key));
      history.replaceState(null, '', url);
    } catch { /* Local file previews can restrict history. */ }
    feedback.textContent = 'Back to the evening glow. Make it yours again.';
    updateLight(); announceLight();
  });
  document.querySelector('#save-light-form').addEventListener('submit', event => {
    event.preventDefault();
    state.name = safeName(nameInput.value);
    nameInput.value = state.name;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      feedback.textContent = `“${state.name}” is saved on this device for your next visit.`;
    } catch { feedback.textContent = 'This browser could not save your light. You can still copy a link to keep it.'; }
  });
  const shareDialog = document.querySelector('#share-dialog');
  document.querySelector('#share-light').addEventListener('click', async () => {
    state.name = safeName(nameInput.value);
    nameInput.value = state.name;
    const url = new URL(location.href);
    url.searchParams.set('level', String(state.brightness));
    url.searchParams.set('warmth', String(state.temperature));
    url.searchParams.set('power', state.on ? 'on' : 'off');
    url.searchParams.set('light', state.name);
    url.hash = 'light-studio';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url.href);
      feedback.textContent = `Link copied. Pass “${state.name}” on.`;
    } catch {
      const textarea = document.querySelector('#share-url');
      textarea.value = url.href;
      shareDialog.showModal();
      textarea.focus(); textarea.select();
    }
  });
  shareDialog.addEventListener('click', event => { if (event.target === shareDialog) shareDialog.close(); });
  if (shared) feedback.textContent = `You're exploring “${state.name}”. Save it to keep it here.`;
  else if (saved) feedback.textContent = `Welcome back. “${state.name}” is ready for you.`;
  updateLight(true);

  // The header samples the current section; the lighting controls never capture
  // wheel or touch input. The room sequence below uses natural scroll position.
  const header = document.querySelector('#site-header');
  const hero = document.querySelector('.hero');
  let headerFrame;
  function updateHeader() {
    headerFrame = null;
    header.classList.toggle('is-scrolled', scrollY > 20);
    const atHeader = document.elementFromPoint(innerWidth / 2, 100)?.closest('section,footer');
    header.classList.toggle('is-light', !!atHeader?.matches('.light-section,.save-section'));
  }
  addEventListener('scroll', () => { if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader); }, { passive: true });
  addEventListener('resize', updateHeader);
  updateHeader();
  document.querySelectorAll('main,section[id]').forEach(target => { target.tabIndex = -1; });

  const revealElements = [...document.querySelectorAll('[data-reveal]')];
  const heroElements = [...document.querySelectorAll('.hero-enter,.hero h1')];
  const footerLetters = [...document.querySelectorAll('.footer-wordmark>span')];
  const seen = new WeakSet();
  let revealObserver, footerObserver, heroTimeline, footerTimeline, footerPlayed = false;
  function setupMotion(initial = false) {
    revealObserver?.disconnect(); footerObserver?.disconnect();
    heroTimeline?.kill(); footerTimeline?.kill();
    if (!gsap) return;
    const animated = [...revealElements, ...heroElements, ...footerLetters];
    gsap.killTweensOf(animated);
    gsap.set(animated, { clearProps: 'transform,opacity,visibility' });
    if (preference.matches || !('IntersectionObserver' in window)) return;
    if (initial && scrollY < 100) {
      heroTimeline = gsap.timeline();
      heroTimeline.fromTo(heroElements, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .95, stagger: .07, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
    revealObserver = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      revealObserver.unobserve(target); seen.add(target);
      gsap.to(target, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', clearProps: 'transform,opacity' });
    }), { threshold: .1, rootMargin: '0px 0px -28px 0px' });
    revealElements.forEach(element => {
      if (seen.has(element) || element.getBoundingClientRect().bottom < 0) return;
      gsap.set(element, { y: 24, opacity: 0 });
      revealObserver.observe(element);
    });
    if (!footerPlayed) {
      footerObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        footerPlayed = true; footerObserver.disconnect();
        footerTimeline = gsap.timeline();
        footerTimeline.fromTo(footerLetters, { y: 36, opacity: .2 }, { y: 0, opacity: 1, duration: 1.1, stagger: .09, ease: 'power3.out', clearProps: 'transform,opacity' });
      }, { threshold: .2 });
      footerObserver.observe(document.querySelector('.footer-signature'));
    }
  }
  preference.addEventListener('change', () => { updateLight(true); setupMotion(); });
  setupMotion(true);

  // A single scroll clock drives the room aperture and dusk.
  // No wheel interception; reverse scrolling reverses the same composition.
  const journey = document.querySelector('.day-night');
  const journeyTime = document.querySelector('.journey-time');
  const journeyStage = document.querySelector('.day-night-sticky');
  let compositionFrame = 0;
  function compose() {
    compositionFrame = 0;
    const reduced = preference.matches;
    const rect = journey.getBoundingClientRect();
    const progress = reduced ? 1 : clamp(-rect.top / Math.max(1, rect.height - innerHeight), 0, 1);
    journey.style.setProperty('--journey', progress.toFixed(4));
    const fullRadius = Math.hypot(journeyStage.clientWidth, journeyStage.clientHeight) / 2 + 2;
    journey.style.setProperty('--reveal-radius', `${28 + (fullRadius - 28) * progress}px`);
    journey.style.setProperty('--journey-scale', String(1.12 - progress * .12));
    journey.style.setProperty('--journey-light', String(1.1 - progress * .42));
    const minutes = Math.round(17 * 60 + progress * 270);
    journeyTime.textContent = `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
  }
  function requestComposition() { if (!compositionFrame) compositionFrame = requestAnimationFrame(compose); }
  addEventListener('scroll', requestComposition, { passive: true });
  addEventListener('resize', requestComposition);
  preference.addEventListener('change', compose);
  compose();
})();
