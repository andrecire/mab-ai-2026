(() => {
  'use strict';
  const dialog = document.querySelector('#detail-dialog');
  const content = document.querySelector('#detail-content');
  let opener = null;
  const programPanel = document.querySelector('#program-panel-content');
  const programChoices = [...document.querySelectorAll('.program-pick')];
  let programPage = 0;

  function showProgram(trigger) {
    const template = document.getElementById(`panel-program-${trigger.dataset.program}`);
    if (!programPanel || !template) return;
    programChoices.forEach(button => button.setAttribute('aria-pressed', String(button === trigger)));
    programPanel.replaceChildren(template.content.cloneNode(true));
    programPanel.parentElement.scrollTop = 0;
  }
  function changeProgramPage(delta) {
    programPage = Math.max(0, Math.min(Math.ceil(programChoices.length / 4) - 1, programPage + delta));
    programChoices.forEach((button, index) => { button.hidden = Math.floor(index / 4) !== programPage; });
    document.querySelector('#programs-page').textContent = `${programPage * 4 + 1}–${Math.min(programPage * 4 + 4, programChoices.length)} of ${programChoices.length} programs`;
    document.querySelector('#programs-back').disabled = programPage === 0;
    document.querySelector('#programs-forward').disabled = (programPage + 1) * 4 >= programChoices.length;
    const selected = programChoices.find(button => button.getAttribute('aria-pressed') === 'true');
    if (selected?.hidden) showProgram(programChoices[programPage * 4]);
  }
  document.querySelector('#programs-back')?.addEventListener('click', () => changeProgramPage(-1));
  document.querySelector('#programs-forward')?.addEventListener('click', () => changeProgramPage(1));
  // Let keyboard users scroll and expand the panel without advancing a slide.
  document.querySelector('#program-panel')?.addEventListener('keydown', event => event.stopPropagation());

  const strengthNodes = [...document.querySelectorAll('[data-strength]')];
  const strengthDetail = document.querySelector('#strength-detail');
  strengthNodes.forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.strength;
      const template = document.getElementById(`strength-${key}`);
      if (!template || !strengthDetail) return;
      strengthNodes.forEach(node => node.setAttribute('aria-pressed', String(node === button)));
      document.querySelectorAll('[data-connection]').forEach(path => {
        path.classList.toggle('is-active', path.dataset.connection === key || key === 'certificate');
      });
      strengthDetail.replaceChildren(template.content.cloneNode(true));
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        strengthDetail.animate([{opacity:0.35}, {opacity:1}], {duration:220});
      }
    });
    button.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
    });
  });

  // The whole route stays readable; animation only moves the student and emphasis.
  const journey = document.querySelector('#student-journey');
  let pauseJourney = () => {};
  if (journey) {
    const play = document.querySelector('#journey-play');
    const steps = [...journey.querySelectorAll('[data-journey-step]')];
    const cards = [...journey.querySelectorAll('[data-journey-card]')];
    const positions = [105, 415, 760, 1045];
    const messages = [
      'Build a foundation in business, data and responsible AI.',
      'Learn across tools through courses developed with industry.',
      'Demonstrate your work and meet potential recruiters.',
      'Take your skills directly into a company.'
    ];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0, timer, arrivalTimer, playing = false, hasPlayed = false;
    function showStep(index) {
      clearTimeout(arrivalTimer);
      current = index;
      journey.classList.remove('has-arrived');
      journey.style.setProperty('--student-x', `${positions[index]}px`);
      journey.style.setProperty('--route-progress', `${(positions[index] - 105) / 940 * 100}%`);
      cards.forEach((card, i) => card.classList.toggle('is-current', i === index));
      steps.forEach((step, i) => step.setAttribute('aria-pressed', String(i === index)));
      document.querySelector('#journey-status').textContent = messages[index];
      if (index === 3) arrivalTimer = setTimeout(() => journey.classList.add('has-arrived'), reducedMotion.matches ? 0 : 1300);
    }
    pauseJourney = () => {
      clearTimeout(timer);
      playing = false;
      play.textContent = current === 3 ? '↻ Replay journey' : '▶ Play journey';
    };
    function tick() {
      if (current === 3) { pauseJourney(); return; }
      showStep(current + 1);
      timer = setTimeout(tick, 7200);
    }
    function start() {
      hasPlayed = true;
      if (current === 3) showStep(0);
      playing = true;
      play.textContent = 'Ⅱ Pause journey';
      timer = setTimeout(tick, 7200);
    }
    play.addEventListener('click', () => playing ? pauseJourney() : start());
    steps.forEach((step, index) => step.addEventListener('click', () => { pauseJourney(); showStep(index); play.textContent = index === 3 ? '↻ Replay journey' : '▶ Play journey'; }));
    journey.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('button')) event.stopPropagation();
    });
    function onSlide(event) {
      const slide = event?.currentSlide || window.Reveal?.getCurrentSlide();
      if (slide?.id !== 'certificate') { pauseJourney(); clearTimeout(arrivalTimer); }
      else if (!hasPlayed && !reducedMotion.matches) start();
    }
    function bindJourney() {
      if (!window.Reveal) return;
      window.Reveal.on('ready', onSlide);
      window.Reveal.on('slidechanged', onSlide);
      if (window.Reveal.isReady()) onSlide();
    }
    if (document.readyState === 'complete') bindJourney();
    else window.addEventListener('load', bindJourney, {once:true});
    document.addEventListener('visibilitychange', () => { if (document.hidden) pauseJourney(); });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) pauseJourney(); });
  }

  function openDetail(templateId, trigger) {
    const template = document.getElementById(templateId);
    if (!dialog || !template) return;
    pauseJourney();
    opener = trigger;
    content.replaceChildren(template.content.cloneNode(true));
    const title = content.querySelector('h2');
    if (title) {
      title.id = 'dialog-title';
      dialog.setAttribute('aria-labelledby', 'dialog-title');
    }
    dialog.classList.remove('photo-dialog');
    if (window.Reveal?.isReady()) window.Reveal.configure({keyboard:false});
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector('.dialog-close').focus();
  }
  document.addEventListener('click', event => {
    const program = event.target.closest('[data-program]');
    const course = event.target.closest('[data-course]');
    const photo = event.target.closest('[data-photo]');
    if (program) showProgram(program);
    if (course) openDetail(`detail-course-${course.dataset.course}`, course);
    if (photo) {
      opener = photo;
      content.replaceChildren();
      const title = document.createElement('h2');
      title.id = 'dialog-title';
      title.textContent = 'MGOC15 with IBM Canada';
      const img = document.createElement('img');
      img.src = 'assets/images/mgoc15-ibm.png';
      img.alt = photo.querySelector('img').alt;
      img.className = 'dialog-photo';
      content.append(title, img);
      dialog.setAttribute('aria-labelledby', 'dialog-title');
      dialog.classList.add('photo-dialog');
      if (window.Reveal?.isReady()) window.Reveal.configure({keyboard:false});
      dialog.showModal();
      dialog.querySelector('.dialog-close').focus();
    }
  });
  dialog?.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    if (window.Reveal?.isReady()) window.Reveal.configure({keyboard:true});
    opener?.focus();
  });
  dialog?.addEventListener('keydown', event => event.stopPropagation());

  const entries = [...document.querySelectorAll('.program-entry')];
  if (entries.length) {
    const search = document.querySelector('#program-search');
    const region = document.querySelector('#region-filter');
    const category = document.querySelector('#category-filter');
    const pagination = document.querySelector('.directory-pagination');
    let page = 0;
    const perPage = 6;
    function filter(resetPage = false) {
      if (resetPage) page = 0;
      const query = search.value.trim().toLocaleLowerCase();
      const matches = entries.filter(el => (!query || el.dataset.search.includes(query)) && (region.value === 'all' || el.dataset.region === region.value) && (category.value === 'all' || el.dataset.category === category.value));
      const pages = Math.max(1, Math.ceil(matches.length / perPage));
      page = Math.min(page, pages - 1);
      entries.forEach(el => { el.hidden = true; });
      matches.slice(page * perPage, (page + 1) * perPage).forEach(el => { el.hidden = false; });
      document.querySelector('#program-count').textContent = `${matches.length} of ${entries.length} selected offerings · Research checked October 12, 2026`;
      document.querySelector('#directory-empty').hidden = matches.length > 0;
      pagination.hidden = matches.length <= perPage;
      document.querySelector('#program-page').textContent = `Page ${page + 1} of ${pages}`;
      document.querySelector('#previous-programs').disabled = page === 0;
      document.querySelector('#next-programs').disabled = page === pages - 1;
    }
    search.addEventListener('input', () => filter(true));
    region.addEventListener('change', () => filter(true));
    category.addEventListener('change', () => filter(true));
    document.querySelector('.directory-controls').addEventListener('reset', () => setTimeout(() => filter(true), 0));
    document.querySelector('#previous-programs').addEventListener('click', () => { page--; filter(); });
    document.querySelector('#next-programs').addEventListener('click', () => { page++; filter(); });
    filter();
    const targeted = entries.find(el => `#${el.id}` === location.hash);
    if (targeted) { search.value = ''; region.value = 'all'; category.value = 'all'; page = Math.floor(entries.indexOf(targeted) / perPage); filter(); targeted.open = true; targeted.scrollIntoView(); }
    let printStates;
    window.addEventListener('beforeprint', () => {
      printStates = [...document.querySelectorAll('details')].map(el => [el,el.open,el.hidden]);
      printStates.forEach(([el]) => { el.open = true; el.hidden = false; });
    });
    window.addEventListener('afterprint', () => {
      printStates?.forEach(([el,open,hidden]) => { el.open = open; el.hidden = hidden; });
    });
  }
  const scenarioSelect = document.querySelector('#scenario-select');
  scenarioSelect?.addEventListener('change', () => {
    const scenario = window.MAB_DATA.certificate.scenarios.find(s => s.id === scenarioSelect.value);
    document.querySelector('#scenario-question').textContent = scenario.question;
    document.querySelectorAll('[data-scenario]').forEach(el => { el.textContent = scenario[el.dataset.scenario]; });
  });
  document.querySelector('#print-reading')?.addEventListener('click', () => window.print());
})();

