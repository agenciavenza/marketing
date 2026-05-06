// Bridge: glow burst fires only when mouse is over the logo image.
(() => {
  const logo  = document.querySelector('.bridge__logo');
  const glow  = document.querySelector('.bridge__glow');
  const burst = document.querySelector('.bridge__burst');
  if (!logo || !glow || !burst) return;

  logo.addEventListener('mouseenter', () => {
    glow.classList.add('is-burst');
    burst.classList.add('is-burst');
  });

  logo.addEventListener('mouseleave', () => {
    glow.classList.remove('is-burst');
    burst.classList.remove('is-burst');
  });
})();

// Photo Carousel (Audiovisual section): prev/next slide switching.
(() => {
  const slides = Array.from(document.querySelectorAll('.fotoc__slide'));
  const prevBtn = document.querySelector('.fotoc__arrow--prev');
  const nextBtn = document.querySelector('.fotoc__arrow--next');
  if (!slides.length || !prevBtn || !nextBtn) return;

  let current = 0;

  const goTo = (index) => {
    slides[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
  };

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-advance every 6 seconds
  let autoTimer = setInterval(() => goTo(current + 1), 6000);
  const resetTimer = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  };
  prevBtn.addEventListener('click', resetTimer);
  nextBtn.addEventListener('click', resetTimer);
})();

// Projects: sticky-stacking effect (poch.studio style).
// Each .case is position: sticky at top:0 with an opaque background and an
// increasing z-index, so the next case slides up and fully covers the
// previous one — no fade, no parallax, just a solid stack.
(() => {
  const cases = Array.from(document.querySelectorAll('.projects .case'));
  if (!cases.length) return;
  cases.forEach((c, i) => c.style.setProperty('--i', String(i + 1)));
})();

// Services cards: scrollbar indicator + prev/next buttons.
(() => {
  const track = document.querySelector('.cards');
  const fill = document.querySelector('.cards__track-fill');
  const prevBtn = document.querySelector('.cards__scroll-btn--prev');
  const nextBtn = document.querySelector('.cards__scroll-btn--next');
  if (!track) return;

  const step = () => {
    const card = track.querySelector('.card');
    if (!card) return 0;
    return card.offsetWidth + parseInt(getComputedStyle(track).gap || '18', 10);
  };

  const updateFill = () => {
    if (!fill) return;
    const max = track.scrollWidth - track.clientWidth;
    const pct = max > 0 ? (track.scrollLeft / max) * 80 + 20 : 20;
    fill.style.width = pct + '%';
  };

  track.addEventListener('scroll', updateFill, { passive: true });
  updateFill();

  if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
})();

// Testimonials carousel prev/next.
(() => {
  const list = document.querySelector('.testimonials__list');
  const fill = document.querySelector('.testi-nav__fill');
  const prevBtn = document.querySelector('.testi-nav__btn--prev');
  const nextBtn = document.querySelector('.testi-nav__btn--next');
  if (!list || !prevBtn || !nextBtn) return;

  const items = Array.from(list.querySelectorAll('.testimonial'));
  const total = items.length;
  let current = 0;

  const go = (index) => {
    current = Math.max(0, Math.min(total - 1, index));
    const w = list.parentElement.clientWidth;
    list.style.transform = `translateX(${-current * w}px)`;
    if (fill) fill.style.width = ((current + 1) / total * 100) + '%';
  };

  go(0);

  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));
})();

// Navbar: shrink on scroll + scroll-spy active link based on section in view.
(() => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const links = Array.from(navbar.querySelectorAll('[data-nav-link]'));
  const burger = navbar.querySelector('.navbar__burger');

  // Burger toggle
  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      navbar.querySelector('.navbar__dropdown').setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on link click (mobile)
    navbar.querySelectorAll('.navbar__dropdown a').forEach(a => {
      a.addEventListener('click', () => {
        navbar.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        navbar.querySelector('.navbar__dropdown').setAttribute('aria-hidden', 'true');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navbar.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        navbar.querySelector('.navbar__dropdown').setAttribute('aria-hidden', 'true');
      }
    });
  }

  const sections = links
    .map((link) => {
      const id = link.getAttribute('href');
      return id && id.startsWith('#') ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  const setScrolled = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  };

  // Track which sections are currently intersecting; pick the topmost.
  const visible = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      if (!visible.size) return;
      const top = [...visible].sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      )[0];
      setActive(top.id);
    },
    {
      // Trigger when section crosses ~30% from top of viewport.
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    }
  );
  sections.forEach((s) => io.observe(s));
})();

// Diferenciais: clickable cards swap the right-side image panel.
(() => {
  const items = Array.from(document.querySelectorAll('.diff__item'));
  const panels = Array.from(document.querySelectorAll('.diff__panel'));
  if (!items.length) return;

  const activate = (target) => {
    items.forEach((item) => {
      const isActive = item.dataset.diffTarget === target;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.diffPanel === target);
    });
  };

  items.forEach((item) => {
    item.addEventListener('click', () => activate(item.dataset.diffTarget));
  });
})();

// About section: video play/pause with overlay button.
(() => {
  const video = document.getElementById('about-video');
  const btn   = document.getElementById('about-play-btn');
  const wrap  = video ? video.closest('.about__video-wrap') : null;
  if (!video || !btn || !wrap) return;

  const setPlaying = (playing) => {
    btn.classList.toggle('is-hidden', playing);
    wrap.classList.toggle('is-playing', playing);
  };

  // Toggle on button click or clicking the video
  const toggle = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  btn.addEventListener('click', toggle);
  video.addEventListener('click', toggle);

  video.addEventListener('play',  () => setPlaying(true));
  video.addEventListener('pause', () => setPlaying(false));
  video.addEventListener('ended', () => setPlaying(false));
})();

// Team: always-expanded. Clicking a thumbnail triggers a FLIP swap animation.
(() => {
  const stage = document.querySelector('.team__stage');
  if (!stage) return;

  const members = [
    {
      name: 'João Pariz',
      role: 'Screen Director & Videomaker',
      photo: 'Images/socios/joao victor.png',
      bio: 'Videomaker especializado em narrativa visual, João participou na produção audiovisual de eventos comerciais, festivos e internos. Atuou com diversos segmentos e setores do mercado, acumulando versatilidade para executar produções complexas e conduzir histórias que traduzam a essência de cada marca e de cada cliente que ele trabalha e/ou já trabalhou.'
    },
    {
      name: 'Ruan Bueno',
      role: 'Founder & Creative Director',
      photo: 'Images/socios/ruan bueno.png',
      bio: 'Diretor Criativo focado em unir objetivo, ideia e propósito em cada criação. Ruan atua com produção de materiais gráficos para diversos setores e mercados, entregando resultados altamente técnicos com eficiência. Entre os projetos notórios que participou estão o Grupo Rafain, Moducasa, Kless e Itaipu Parquetec.'
    },
    {
      name: 'Liedson Cavalheiro',
      role: 'Founder & Sales Director',
      photo: 'Images/socios/liedon cavalheiro.png',
      bio: 'Diretor Comercial, Videomaker e Gestor de Tráfego. Liedson esteve à frente da produção audiovisual e na performance de campanhas de grandes marcas, unindo estratégias de audiovisual para social media com a distribuição desses materiais em múltiplos canais. Hábil para entender a necessidade de cada cliente e encontrar a solução que trará o melhor resultado.'
    }
  ];

  stage.innerHTML = `
    <div class="team__expanded">
      <div class="team__exp-left">
        <img class="team__exp-photo" src="" alt="">
      </div>
      <div class="team__exp-right">
        <div class="team__exp-info">
          <div class="team__exp-nameblock">
            <h3 class="team__exp-name"></h3>
            <p class="team__exp-role"></p>
          </div>
          <p class="team__exp-bio"></p>
        </div>
        <div class="team__thumbs"></div>
      </div>
    </div>
  `;

  const mainPhoto = stage.querySelector('.team__exp-photo');
  const leftEl    = stage.querySelector('.team__exp-left');
  const nameEl    = stage.querySelector('.team__exp-name');
  const roleEl    = stage.querySelector('.team__exp-role');
  const bioEl     = stage.querySelector('.team__exp-bio');
  const thumbsEl  = stage.querySelector('.team__thumbs');
  const rightEl   = stage.querySelector('.team__exp-right');

  const DURATION = 520;
  const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  let animating = false;

  const buildThumbs = (activeIdx) => {
    thumbsEl.innerHTML = '';
    members.forEach((other, i) => {
      if (i === activeIdx) return;
      const btn = document.createElement('button');
      btn.className = 'team__thumb';
      btn.dataset.idx = String(i);
      btn.innerHTML = `<img src="${other.photo}" alt="${other.name}"><span>${other.name}</span>`;
      btn.addEventListener('click', () => swap(i));
      thumbsEl.appendChild(btn);
    });
  };

  const setContent = (idx) => {
    const m = members[idx];
    mainPhoto.src = m.photo;
    mainPhoto.alt = m.name;
    nameEl.textContent = m.name;
    roleEl.textContent = m.role;
    bioEl.textContent  = m.bio;
    buildThumbs(idx);
  };

  const swap = (nextIdx) => {
    if (animating) return;
    animating = true;

    const thumbBtn = thumbsEl.querySelector(`[data-idx="${nextIdx}"]`);
    const thumbImg = thumbBtn ? thumbBtn.querySelector('img') : null;
    if (!thumbImg) { setContent(nextIdx); animating = false; return; }

    const toRect = leftEl.getBoundingClientRect();
    const easing = 'cubic-bezier(0.42, 0, 0.18, 1)';

    // Clip container sits exactly over the main photo — overflow:hidden kills the flash
    const clip = document.createElement('div');
    clip.style.cssText = [
      'position:fixed', 'z-index:9999', 'pointer-events:none',
      'overflow:hidden', 'border-radius:36px',
      `left:${toRect.left}px`, `top:${toRect.top}px`,
      `width:${toRect.width}px`, `height:${toRect.height}px`,
    ].join(';');

    const base = [
      'position:absolute', 'inset:0',
      'width:100%', 'height:100%',
      'object-fit:cover', 'object-position:top',
      'transform-origin:left center',
    ].join(';');

    // Current photo: exits left while shrinking
    const flyOut = document.createElement('img');
    flyOut.src = mainPhoto.src;
    flyOut.style.cssText = base + ';transform:translateX(0) scale(1)';

    // New photo: enters from right while growing to full size
    const flyIn = document.createElement('img');
    flyIn.src = members[nextIdx].photo;
    flyIn.style.cssText = base + ';transform:translateX(60%) scale(0.75)';

    clip.appendChild(flyOut);
    clip.appendChild(flyIn);
    document.body.appendChild(clip);
    mainPhoto.style.opacity = '0';

    const m = members[nextIdx];
    nameEl.textContent = m.name;
    roleEl.textContent = m.role;
    bioEl.textContent  = m.bio;

    // Force reflow
    clip.getBoundingClientRect();

    const tr = `transform ${DURATION}ms ${easing}`;
    flyOut.style.transition = tr + `, opacity ${DURATION * 0.5}ms ${easing}`;
    flyIn.style.transition  = tr;

    flyOut.style.transform = 'translateX(-40%) scale(0.85)';
    flyOut.style.opacity   = '0';
    flyIn.style.transform  = 'translateX(0) scale(1)';

    setTimeout(() => {
      clip.remove();
      buildThumbs(nextIdx);
      mainPhoto.src           = m.photo;
      mainPhoto.style.opacity = '1';
      animating = false;
    }, DURATION);
  };

  setContent(0);
})();
