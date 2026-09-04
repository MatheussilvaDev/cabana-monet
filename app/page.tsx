'use client';

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from './site-data';

const reviews = [
  {
    quote: 'Nossa intenção era descansar com conforto e privacidade. A Cabana Monet fornece isso com excelência.',
    name: 'André',
    detail: 'hóspede verificado',
  },
  {
    quote: 'Um verdadeiro refúgio de paz, bom gosto e sofisticação. Cada detalhe é extremamente bem cuidado.',
    name: 'Rafaela',
    detail: 'hóspede verificada',
  },
  {
    quote: 'Ambiente incrível! Melhor do que nas fotos — e perfeito em todos os detalhes.',
    name: 'Matheus',
    detail: 'hóspede verificado',
  },
];

const interiorSlides = [
  { src: '/images/interior/01-sala.png', room: 'Sala de estar', alt: 'Sala de estar integrada ao deck da Cabana Monet', position: 'center' },
  { src: '/images/interior/02-sala.png', room: 'Sala de estar', alt: 'Lareira dupla face revestida em pedra natural', position: 'center' },
  { src: '/images/interior/03-sala.png', room: 'Sala de estar', alt: 'Sala de estar com portas de vidro abertas para a paisagem', position: 'center' },
  { src: '/images/interior/04-sala.png', room: 'Sala de estar', alt: 'Sala de estar com sofá, lareira e integração com o quarto', position: 'center' },
  { src: '/images/interior/05-cozinha.png', room: 'Cozinha', alt: 'Cozinha da Cabana Monet iluminada e revestida em pedra', position: 'center' },
  { src: '/images/interior/06-cozinha.png', room: 'Cozinha', alt: 'Detalhe da mesa posta na cozinha', position: 'center' },
  { src: '/images/interior/07-cozinha.png', room: 'Cozinha', alt: 'Ilha central e cozinha completa da Cabana Monet', position: 'center' },
  { src: '/images/interior/08-quarto.png', room: 'Quarto', alt: 'Quarto da Cabana Monet com iluminação acolhedora', position: 'center' },
  { src: '/images/interior/09-quarto.png', room: 'Quarto', alt: 'Quarto da Cabana Monet visto em perspectiva', position: 'center' },
];

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [review, setReview] = useState(0);
  const [reviewPaused, setReviewPaused] = useState(false);
  const [reviewsInView, setReviewsInView] = useState(false);
  const [interiorSlide, setInteriorSlide] = useState(0);
  const [interiorPaused, setInteriorPaused] = useState(false);
  const [interiorReady, setInteriorReady] = useState(false);
  const [interiorInView, setInteriorInView] = useState(false);
  const interiorRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  const openBooking = (origin: string) => {
    setBookingOpen(true);
    window.dispatchEvent(new CustomEvent('monet:booking-open', { detail: { origin } }));
  };

  const trackBooking = (platform: 'airbnb' | 'holmy', origin: string) => {
    const detail = { platform, origin, property: 'monet' };
    window.dispatchEvent(new CustomEvent('monet:booking-click', { detail }));
    const trackingWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
    trackingWindow.dataLayer?.push({ event: 'booking_click', ...detail });
  };

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.16 },
    );
    document.querySelectorAll<HTMLElement>('.reveal, .section-index').forEach((node, index) => {
      node.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
      revealObserver.observe(node);
    });

    let ticking = false;
    const parallaxEnabled = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)').matches;
    const updateScrollEffects = () => {
      if (parallaxEnabled) {
        document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((node) => {
          const anchor = node.parentElement?.getBoundingClientRect();
          if (!anchor) return;
          const strength = Number(node.dataset.parallax ?? 0.12);
          const anchorCenter = anchor.top + anchor.height / 2;
          const offset = Math.round((anchorCenter - window.innerHeight / 2) * strength);
          node.style.setProperty('--parallax-y', `${offset}px`);
        });
      }
      headerRef.current?.classList.toggle('is-scrolled', window.scrollY > 48);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      progressRef.current?.style.setProperty('transform', `scaleX(${progress})`);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    };
    updateScrollEffects();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!bookingOpen && !menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setBookingOpen(false);
        setMenuOpen(false);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [bookingOpen, menuOpen]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!reducedMotion.matches && !connection?.saveData) return;
    document.querySelectorAll<HTMLVideoElement>('video[data-ambient-video]').forEach((video) => {
      video.pause();
      video.removeAttribute('autoplay');
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      interiorSlides.map(
        (slide) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = slide.src;
            if (image.complete) resolve();
          }),
      ),
    ).then(() => {
      if (!cancelled) setInteriorReady(true);
    });

    const node = interiorRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setInteriorInView(entry.isIntersecting),
      { threshold: 0.28 },
    );
    if (node) observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!interiorReady || !interiorInView || interiorPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timeout = window.setTimeout(
      () => setInteriorSlide((current) => (current + 1) % interiorSlides.length),
      4800,
    );
    return () => window.clearTimeout(timeout);
  }, [interiorPaused, interiorReady, interiorInView, interiorSlide]);

  useEffect(() => {
    const node = reviewRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setReviewsInView(entry.isIntersecting),
      { threshold: 0.28 },
    );
    if (node) observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!reviewsInView || reviewPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timeout = window.setTimeout(
      () => setReview((current) => (current + 1) % reviews.length),
      5200,
    );
    return () => window.clearTimeout(timeout);
  }, [review, reviewPaused, reviewsInView]);

  return (
    <main>
      <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>
      <section className="hero snap-panel" id="inicio">
        <video
          className="hero-media"
          data-ambient-video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/cabana-deck.jpg?v=2"
          aria-hidden="true"
        >
          <source src="/hero.mp4?v=2" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <nav ref={headerRef} className="nav shell" aria-label="Navegação principal">
          <a className="brand" href="#inicio" aria-label="Cabana Monet — início">
            <span className="brand-mark">M</span>
            <span className="brand-lockup"><strong>Cabana Monet</strong><small>uma cabana Alto da Galícia</small></span>
          </a>
          <div className="nav-actions">
            <button className="nav-cta" type="button" onClick={() => openBooking('header')}>Reservar</button>
            <button className="menu-trigger" type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" aria-expanded={menuOpen}>
              <span /><span />
            </button>
          </div>
        </nav>
        <div className="hero-content shell">
          <div className="eyebrow">Uma cabana Alto da Galícia · Bom Jesus dos Perdões</div>
          <h1>Cabana Monet</h1>
          <div className="hero-actions">
            <button className="primary-btn" type="button" onClick={() => openBooking('hero')}>
              Consultar disponibilidade <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
        <div className="hero-scroll shell">
          <a href="#experiencia">Conheça a experiência <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="manifesto snap-panel" id="experiencia">
        <div className="manifesto-grid shell">
          <div className="section-index reveal">01 — A experiência</div>
          <p className="manifesto-copy reveal">
            Quando foi a última vez<br />
            que você <em>não teve pressa?</em>
          </p>
          <p className="manifesto-note reveal">
            Acorde com a luz atravessando as grandes janelas. Caminhe sem destino.
            Entre na água. Acenda o fogo. O resto pode esperar.
          </p>
        </div>
      </section>

      <section className="immersion snap-panel" id="exterior" data-video-slot="exterior-sunset">
        <video
          className="immersion-media parallax-image"
          data-ambient-video
          data-parallax="0.16"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/cabana-piscina.jpg?v=2"
          aria-hidden="true"
        >
          <source src="/videos/exterior-sunset.mp4" type="video/mp4" />
        </video>
        <div className="immersion-shade" />
        <div className="immersion-copy shell reveal">
          <span className="micro-label">Exterior &amp; horizonte</span>
          <h2>Tudo o que você precisa,<br />nada do que distrai.</h2>
          <p>O deck, a água aquecida e as montanhas encontram a luz lenta do pôr do sol.</p>
        </div>
      </section>

      <section className="story snap-panel" id="interiores">
        <div
          ref={interiorRef}
          className={`story-image-wrap interior-carousel${interiorPaused ? ' is-paused' : ''}${interiorReady && interiorInView ? ' is-running' : ''}`}
          onMouseEnter={() => setInteriorPaused(true)}
          onMouseLeave={() => setInteriorPaused(false)}
          onFocus={() => setInteriorPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setInteriorPaused(false);
          }}
          aria-roledescription="carrossel"
          aria-label="Ambientes internos da Cabana Monet"
        >
          {interiorSlides.map((slide, index) => (
            <figure className={`interior-slide${index === interiorSlide ? ' active' : ''}`} key={slide.src} aria-hidden={index !== interiorSlide}>
              <img
                src={slide.src}
                alt={slide.alt}
                width={index === 0 ? 1112 : 1102}
                height={739}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{ objectPosition: slide.position }}
              />
            </figure>
          ))}
          <div className="interior-shade" aria-hidden="true" />
          <div className="interior-caption" aria-live="polite">
            <span>{String(interiorSlide + 1).padStart(2, '0')} / {String(interiorSlides.length).padStart(2, '0')}</span>
            <strong>{interiorSlides[interiorSlide].room}</strong>
          </div>
          <div className="interior-controls">
            <button
              type="button"
              onClick={() => setInteriorSlide((current) => (current - 1 + interiorSlides.length) % interiorSlides.length)}
              aria-label="Imagem anterior"
            >
              ←
            </button>
            <div className="interior-dots" aria-label="Selecionar ambiente">
              {interiorSlides.map((slide, index) => (
                <button
                  type="button"
                  className={index === interiorSlide ? 'active' : ''}
                  onClick={() => setInteriorSlide(index)}
                  aria-label={`Ver ${slide.room}, imagem ${index + 1}`}
                  aria-current={index === interiorSlide ? 'true' : undefined}
                  key={slide.src}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setInteriorSlide((current) => (current + 1) % interiorSlides.length)}
              aria-label="Próxima imagem"
            >
              →
            </button>
          </div>
        </div>
        <div className="story-copy reveal">
          <span className="micro-label">Arquitetura que acolhe</span>
          <h2>Por fora, paisagem.<br />Por dentro, presença.</h2>
          <p>
            Pedra natural, madeira aquecida, vidro e uma vista que participa de todos os
            ambientes. A Cabana Monet foi pensada para duas pessoas viverem o tempo em
            outra velocidade.
          </p>
          <ul>
            <li><span>01</span> Espaço inteiro e privativo</li>
            <li><span>02</span> 1 quarto · 1 cama · 1 banheiro</li>
            <li><span>03</span> Máximo de 2 hóspedes</li>
          </ul>
        </div>
      </section>

      <section className="reviews snap-panel" id="avaliacoes">
        <div className="reviews-inner shell">
          <div className="rating-seal">
            <span>{siteConfig.rating.score}</span>
            <small>★★★★★<br />{siteConfig.rating.count} avaliações</small>
            <em>Dados de {siteConfig.rating.source}<br />verificados em {siteConfig.rating.verifiedAt}</em>
          </div>
          <div
            ref={reviewRef}
            className={`review-carousel${reviewPaused ? ' is-paused' : ''}${reviewsInView ? ' is-running' : ''}`}
            onMouseEnter={() => setReviewPaused(true)}
            onMouseLeave={() => setReviewPaused(false)}
            onFocus={() => setReviewPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setReviewPaused(false);
            }}
            aria-roledescription="carrossel"
            aria-label="Avaliações de hóspedes"
          >
            <div className="review-kicker">O que fica depois da estadia</div>
            <div className="review-viewport" aria-live="polite">
              <div className="review-track" style={{ transform: `translate3d(-${review * 100}%, 0, 0)` }}>
                {reviews.map((item, index) => (
                  <article className="review-card" key={item.name} aria-hidden={index !== review}>
                    <span className="review-number">0{index + 1}</span>
                    <blockquote>“{item.quote}”</blockquote>
                    <p>{item.name} · <span>{item.detail}</span></p>
                  </article>
                ))}
              </div>
            </div>
            <div className="review-controls">
              <button type="button" onClick={() => setReview((current) => (current - 1 + reviews.length) % reviews.length)} aria-label="Avaliação anterior">←</button>
              <div className="review-nav" aria-label="Selecionar avaliação">
              {reviews.map((item, index) => (
                <button key={item.name} onClick={() => setReview(index)} className={index === review ? 'active' : ''} aria-label={`Ver avaliação de ${item.name}`}>
                  <span />
                </button>
              ))}
              </div>
              <button type="button" onClick={() => setReview((current) => (current + 1) % reviews.length)} aria-label="Próxima avaliação">→</button>
            </div>
            <div className="review-progress" aria-hidden="true"><span key={review} /></div>
          </div>
        </div>
      </section>

      <section className="closing snap-panel">
        <img className="closing-media parallax-image" data-parallax="0.12" src="/images/cabana-piscina.jpg?v=2" alt="Cabana Monet integrada à natureza, com piscina de borda infinita" width={2560} height={1440} loading="lazy" decoding="async" />
        <div className="closing-shade" />
        <div className="closing-content shell reveal">
          <span>Bom Jesus dos Perdões · São Paulo</span>
          <h2>A paisagem está esperando.<br />Você também?</h2>
          <p>Seu tempo na Cabana Monet começa aqui.</p>
          <button className="primary-btn light" type="button" onClick={() => openBooking('closing')}>
            Consultar disponibilidade <span aria-hidden="true">↗</span>
          </button>
        </div>
        <footer className="footer shell">
          <a className="brand" href="#inicio">
            <span className="brand-mark">M</span>
            <span className="brand-lockup"><strong>Cabana Monet</strong><small>uma cabana Alto da Galícia</small></span>
          </a>
          <p>{siteConfig.location}</p>
          <button type="button" onClick={() => openBooking('footer')}>Ver disponibilidade ↗</button>
        </footer>
      </section>

      <button className="mobile-book" type="button" onClick={() => openBooking('mobile-sticky')}>
        <span><small>Cabana Monet</small><strong>Ver disponibilidade</strong></span><b>↗</b>
      </button>

      {menuOpen && (
        <div className="menu-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setMenuOpen(false)}>
          <aside className="menu-drawer" aria-label="Menu da Cabana Monet">
            <div className="menu-head">
              <span className="micro-label">Navegação</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">×</button>
            </div>
            <nav className="menu-primary" aria-label="Seções da página">
              <a href="#inicio" onClick={() => setMenuOpen(false)}><span>01</span>Início</a>
              <a href="#experiencia" onClick={() => setMenuOpen(false)}><span>02</span>A experiência</a>
              <a href="#exterior" onClick={() => setMenuOpen(false)}><span>03</span>Exterior &amp; horizonte</a>
              <a href="#interiores" onClick={() => setMenuOpen(false)}><span>04</span>Por dentro</a>
              <a href="#avaliacoes" onClick={() => setMenuOpen(false)}><span>05</span>Avaliações</a>
            </nav>
            <div className="menu-future">
              <span className="micro-label">Alto da Galícia</span>
              <div className="menu-ghost-link" aria-disabled="true"><span>Site institucional</span><small>em breve</small></div>
              <div className="menu-ghost-link" aria-disabled="true"><span>Cabana A’Uwe</span><small>em breve</small></div>
              <div className="menu-ghost-link" aria-disabled="true"><span>Cabana Maui</span><small>em breve</small></div>
              <div className="menu-ghost-link" aria-disabled="true"><span>Cabana Nativa</span><small>em breve</small></div>
            </div>
            <button className="menu-book" type="button" onClick={() => { setMenuOpen(false); openBooking('side-menu'); }}>
              Reservar <span aria-hidden="true">↗</span>
            </button>
          </aside>
        </div>
      )}

      {bookingOpen && (
        <div className="booking-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setBookingOpen(false)}>
          <section className="booking-panel" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="booking-close" type="button" onClick={() => setBookingOpen(false)} aria-label="Fechar opções de reserva">×</button>
            <span className="micro-label">Sua estadia</span>
            <h2 id="booking-title">Onde prefere reservar?</h2>
            <p>Você será direcionado à plataforma escolhida para consultar datas, valores e concluir a reserva.</p>
            <div className="booking-options">
              <a href={siteConfig.booking.airbnb} target="_blank" rel="noreferrer" onClick={() => trackBooking('airbnb', 'booking-modal')}>
                <span><strong>Airbnb</strong><small>Consulte datas e avaliações</small></span><b aria-hidden="true">↗</b>
              </a>
              <a href={siteConfig.booking.holmy} target="_blank" rel="noreferrer" onClick={() => trackBooking('holmy', 'booking-modal')}>
                <span><strong>Holmy</strong><small>Reserve diretamente pela plataforma</small></span><b aria-hidden="true">↗</b>
              </a>
            </div>
            <small className="booking-note">A disponibilidade e os valores são definidos em cada plataforma.</small>
          </section>
        </div>
      )}
    </main>
  );
}
