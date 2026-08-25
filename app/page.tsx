'use client';

import { useEffect, useState } from 'react';

const airbnbUrl =
  'https://www.airbnb.com.br/rooms/1428350589621687078?adults=2&check_in=2026-10-02&check_out=2026-10-04';

const amenities = [
  ['01', 'Piscina aquecida', 'Borda infinita, horizonte aberto e temperatura perfeita em qualquer estação.'],
  ['02', 'Banheira com vista', 'Um banho de imersão com a paisagem inteira diante de você.'],
  ['03', 'Lareira dupla face', 'Lenha inclusa para noites demoradas entre o quarto e o deck.'],
  ['04', 'Cozinha completa', 'Nespresso, taças, forno, cooktop e tudo para preparar sem pressa.'],
];

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

export default function Home() {
  const [review, setReview] = useState(0);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.16 },
    );
    document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));

    let ticking = false;
    const updateParallax = () => {
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((node) => {
        const anchor = node.parentElement?.getBoundingClientRect();
        if (!anchor) return;
        const strength = Number(node.dataset.parallax ?? 0.12);
        const anchorCenter = anchor.top + anchor.height / 2;
        const offset = Math.round((anchorCenter - window.innerHeight / 2) * strength);
        node.style.setProperty('--parallax-y', `${offset}px`);
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    const parallaxEnabled = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)').matches;
    if (parallaxEnabled) {
      updateParallax();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <main>
      <section className="hero snap-panel" id="inicio">
        <img
          className="hero-media"
          src="/images/cabana-deck.jpg?v=2"
          alt="Interior da Cabana Monet com pedra natural, madeira e iluminação acolhedora"
          width={2560}
          height={1707}
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-shade" />
        <nav className="nav shell" aria-label="Navegação principal">
          <a className="brand" href="#inicio" aria-label="Cabana Monet — início">
            <span className="brand-mark">M</span><span>Cabana Monet</span>
          </a>
          <a className="nav-cta" href={airbnbUrl} target="_blank" rel="noreferrer">Reservar</a>
        </nav>
        <div className="hero-content shell">
          <div className="eyebrow">Alto da Galícia · Bom Jesus dos Perdões</div>
          <h1>Quando foi a última vez<br />que você não teve pressa?</h1>
          <div className="hero-actions">
            <a className="primary-btn" href={airbnbUrl} target="_blank" rel="noreferrer">
              Consultar disponibilidade <span aria-hidden="true">↗</span>
            </a>
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
            Não é sobre ir para longe.<br />
            É sobre <em>voltar para perto.</em>
          </p>
          <p className="manifesto-note reveal">
            Acorde com a luz atravessando as grandes janelas. Caminhe sem destino.
            Entre na água. Acenda o fogo. O resto pode esperar.
          </p>
        </div>
      </section>

      <section className="story snap-panel">
        <div className="story-image-wrap">
          <img className="parallax-image" data-parallax="0.1" src="/images/cabana-piscina.jpg?v=2" alt="Cabana Monet em pedra e madeira com piscina de borda infinita" width={2560} height={1440} loading="lazy" decoding="async" />
          <span className="image-caption">Vista aérea · Alto da Galícia</span>
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

      <section className="immersion snap-panel">
        <img className="immersion-media parallax-image" data-parallax="0.16" src="/images/cabana-banheira.jpg?v=2" alt="Banheira de imersão da Cabana Monet diante das montanhas" width={2560} height={3413} loading="lazy" decoding="async" />
        <div className="immersion-shade" />
        <div className="immersion-copy shell reveal">
          <span className="micro-label">Banheira de imersão</span>
          <h2>A vista também<br />entra no banho.</h2>
          <p>Vidro do chão ao teto. Água quente. Montanhas até onde os olhos alcançam.</p>
        </div>
      </section>

      <section className="amenities snap-panel" id="comodidades">
        <header className="amenities-head shell reveal">
          <div className="section-index">02 — Detalhes</div>
          <h2>Tudo o que você precisa.<br /><em>Nada do que distrai.</em></h2>
        </header>
        <div className="amenity-rail shell">
          {amenities.map(([number, title, description]) => (
            <article className="amenity-card reveal" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gallery snap-panel">
        <div className="gallery-title shell reveal">
          <span className="section-index">03 — Por dentro</span>
          <h2>Calma em<br /><em>cada detalhe.</em></h2>
        </div>
        <div className="gallery-grid shell">
          <figure className="gallery-a reveal"><img src="/images/cabana-interior.jpg?v=2" alt="Interior acolhedor da Cabana Monet" width={2560} height={3413} loading="lazy" decoding="async" /><figcaption>Luz, pedra e madeira</figcaption></figure>
          <figure className="gallery-b reveal"><img src="/images/cabana-sala.jpg?v=2" alt="Deck com espreguiçadeiras e lareira" width={2560} height={1707} loading="lazy" decoding="async" /><figcaption>Deck privativo</figcaption></figure>
          <figure className="gallery-c reveal"><img src="/images/cabana-deck.jpg?v=2" alt="Vista da Cabana Monet ao entardecer" width={2560} height={1707} loading="lazy" decoding="async" /><figcaption>O entardecer é parte da casa</figcaption></figure>
        </div>
      </section>

      <section className="reviews snap-panel" id="avaliacoes">
        <div className="reviews-inner shell">
          <div className="rating-seal reveal">
            <span>5,0</span>
            <small>★★★★★<br />53 avaliações</small>
          </div>
          <div className="review-stage reveal" aria-live="polite">
            <div className="review-kicker">O que fica depois da estadia</div>
            <blockquote>“{reviews[review].quote}”</blockquote>
            <p>{reviews[review].name} · <span>{reviews[review].detail}</span></p>
            <div className="review-nav">
              {reviews.map((item, index) => (
                <button key={item.name} onClick={() => setReview(index)} className={index === review ? 'active' : ''} aria-label={`Ver avaliação de ${item.name}`}>
                  {String(index + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="host snap-panel">
        <div className="host-copy shell">
          <div className="section-index reveal">04 — Seu anfitrião</div>
          <div className="host-main reveal">
            <span className="host-monogram">H</span>
            <div>
              <h2>Hospitalidade<br />que se percebe.</h2>
              <p>
                Heitor é Superhost, tem nota média 4,99 em 645 avaliações e responde
                em até uma hora. Criador do Alto da Galícia, une natureza, arquitetura
                e cuidado para criar estadias memoráveis.
              </p>
              <div className="host-stats">
                <span><strong>4,99</strong> nota média</span>
                <span><strong>5 anos</strong> hospedando</span>
                <span><strong>100%</strong> taxa de resposta</span>
              </div>
            </div>
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
          <a className="primary-btn light" href={airbnbUrl} target="_blank" rel="noreferrer">
            Consultar disponibilidade <span aria-hidden="true">↗</span>
          </a>
        </div>
        <footer className="footer shell">
          <a className="brand" href="#inicio"><span className="brand-mark">M</span><span>Cabana Monet</span></a>
          <p>Uma experiência Alto da Galícia</p>
          <a href={airbnbUrl} target="_blank" rel="noreferrer">Ver no Airbnb ↗</a>
        </footer>
      </section>

      <a className="mobile-book" href={airbnbUrl} target="_blank" rel="noreferrer">
        <span><small>Cabana Monet</small><strong>Ver disponibilidade</strong></span><b>↗</b>
      </a>
    </main>
  );
}
