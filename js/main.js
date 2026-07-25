/**
 * EC CODE — Nav, GSAP animations, modal
 */
(function () {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = modal?.querySelector('[data-close-modal]');
    const deviceToggle = document.getElementById('deviceToggle');
    const phoneView = document.getElementById('phoneView');
    const pcView = document.getElementById('pcView');
    const modalTitle = document.getElementById('modalTitle');
    const modalLink = document.getElementById('modalLink');
    const modalCase = document.getElementById('modalCase');
    const modalBody = modal?.querySelector('.modal__body');
    const projectsGrid = document.getElementById('projectsGrid');

    if (projectsGrid && typeof window.renderProjectCards === 'function') {
        window.renderProjectCards(projectsGrid);
    }

    /* Inicializa animacoes ao carregar */
    window.addEventListener('load', () => {
        initGSAP();
    });

    /* Header scroll — esconde ao descer; so mostra apos subir ~3 rolagens */
    let lastScrollY = window.scrollY;
    let upAccum = 0;
    const REVEAL_UP = 260; // px acumulados subindo antes de reaparecer
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        header?.classList.toggle('scrolled', y > 50);

        const menuOpen = nav?.classList.contains('open');
        const delta = y - lastScrollY;

        if (!menuOpen) {
            if (delta > 0) {
                // Descendo: esconde e zera o acumulador de subida.
                upAccum = 0;
                if (y > 120) header?.classList.add('hidden');
            } else if (delta < 0) {
                // Subindo: acumula ate atingir o limite (ou perto do topo).
                upAccum += -delta;
                if (upAccum >= REVEAL_UP || y <= 120) {
                    header?.classList.remove('hidden');
                }
            }
        }
        lastScrollY = y;
    }, { passive: true });

    /* Nav mobile */
    navToggle?.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
    nav?.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            nav.classList.remove('open');
            navToggle?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    /* Âncoras via Lenis (scroll suave para #seções) */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            if (window.__lenis) {
                window.__lenis.scrollTo(target, { offset: -80 });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    let rocketScrollTween = null;
    let rocketRevealTween = null;
    let contactCoverTrigger = null;
    let resizeTimer = null;

    const VIEWBOX = { width: 200, height: 800, bottomY: 880 };
    const ROCKET_PATH_SCALE = 0.18;

    function getRocketPathContentTrack() {
        return Math.max(
            Math.round(window.innerHeight * 0.92 * ROCKET_PATH_SCALE),
            Math.round(520 * ROCKET_PATH_SCALE)
        );
    }

    function getRocketPathDepthExtra() {
        const rocketSize = parseFloat(
            getComputedStyle(document.querySelector('.skills-rocket__visual') || document.body)
                .getPropertyValue('--rocket-size')
        ) || 180;

        return Math.round(Math.max(
            window.innerHeight * 0.24,
            rocketSize * 1.15,
            200
        ));
    }

    function getPageScrollEnd() {
        return Math.max(
            document.documentElement.scrollHeight - window.innerHeight,
            0
        );
    }

    function getSkillsListTrack() {
        return Math.max(
            Math.round(window.innerHeight * 0.88),
            500
        );
    }

    function getRocketExitExtension() {
        const visual = document.querySelector('.skills-rocket__visual');
        const rocketSize = parseFloat(
            getComputedStyle(visual || document.body).getPropertyValue('--rocket-size')
        ) || 180;
        const contact = document.getElementById('contato');
        const contactHeight = contact?.offsetHeight || Math.round(window.innerHeight * 0.72);

        const basePad = Math.max(
            window.innerHeight * 0.26,
            rocketSize * 1.35,
            contactHeight * 0.22,
            210
        );
        const scaledPad = Math.round(basePad * ROCKET_PATH_SCALE);
        // Trecho minimo para o foguete sumir atras do contato (nao escala junto).
        const hidePad = Math.round(Math.max(
            window.innerHeight * 0.58,
            rocketSize * 3.25,
            520
        ));

        return Math.max(scaledPad, hidePad);
    }

    function syncContactVeil() {
        const contact = document.getElementById('contato');
        const backdrop = document.querySelector('.contact__backdrop');
        if (!contact || !backdrop) return;

        const rocketSize = parseFloat(
            getComputedStyle(document.querySelector('.skills-rocket__visual') || document.body)
                .getPropertyValue('--rocket-size')
        ) || 180;
        const pad = getRocketExitExtension();
        const veilHeight = Math.round(pad + rocketSize * 3.65);
        const sinkHeight = Math.round(rocketSize * 1.35 + pad * 0.55);

        backdrop.style.height = `${veilHeight}px`;
        contact.style.setProperty('--contact-veil-height', `${veilHeight}px`);

        const section = document.getElementById('skillsRocket');
        if (section) {
            section.style.setProperty('--skills-sink-height', `${sinkHeight}px`);
        }
    }

    function applyRocketExitPadding(section) {
        const pad = getRocketExitExtension();
        section.style.setProperty('--rocket-exit-pad', `${pad}px`);
        section.style.paddingBottom = 'var(--rocket-exit-pad)';

        // Puxa o contato para cima sobre o padding (sem vão) e estende o
        // fundo dele para baixo, cobrindo o foguete até o fim do site.
        const contact = document.getElementById('contato');
        if (contact) {
            const rocketSize = parseFloat(
                getComputedStyle(document.querySelector('.skills-rocket__visual') || document.body)
                    .getPropertyValue('--rocket-size')
            ) || 200;
            // Cobre o foguete enquanto ele passa por tras do contato.
            const coverExtra = Math.round(rocketSize * 0.5);
            const liftExtra = Math.round(rocketSize * 3.45 + window.innerHeight * 0.26);
            contact.style.marginTop = `${-(pad + liftExtra)}px`;
            contact.style.paddingBottom = `calc(0.5rem + ${coverExtra}px)`;
            contact.style.paddingTop = 'clamp(5rem, 12vw, 9rem)';
            syncContactVeil();
        }
    }

    function getPathBottomY(cfg, trackHeightPx) {
        const referenceTrack = 520;
        const vertSpan = VIEWBOX.bottomY - cfg.arcEndY;
        const scale = Math.max(1, trackHeightPx / referenceTrack);
        return cfg.arcEndY + vertSpan * scale;
    }

    function buildShanePathConfig(pathX, colWidth) {
        const radius = Math.max(52, Math.min(115, colWidth * 0.48));
        const arcEndX = pathX + radius;
        const entryLead = Math.max(160, colWidth * 1.15);
        const entryX = arcEndX + entryLead;
        const horizY = 78;
        return {
            entryX,
            horizY,
            radius,
            pathX,
            arcStartX: arcEndX,
            arcEndY: horizY + radius
        };
    }

    function buildShanePathD(pathX, colWidth, pathBottomY) {
        const cfg = buildShanePathConfig(pathX, colWidth);

        return [
            `M ${cfg.pathX.toFixed(1)} ${pathBottomY.toFixed(1)}`,
            `L ${cfg.pathX.toFixed(1)} ${cfg.arcEndY.toFixed(1)}`,
            `A ${cfg.radius.toFixed(1)} ${cfg.radius.toFixed(1)} 0 0 1 ${cfg.arcStartX.toFixed(1)} ${cfg.horizY.toFixed(1)}`,
            `L ${cfg.entryX.toFixed(1)} ${cfg.horizY.toFixed(1)}`
        ].join(' ');
    }
    const ROCKET_MIN_WIDTH = 768;

    function isRocketVisible() {
        const visual = document.querySelector('.skills-rocket__visual');
        if (!visual) return false;
        return window.matchMedia(`(min-width: ${ROCKET_MIN_WIDTH}px)`).matches
            && getComputedStyle(visual).display !== 'none';
    }

    function resetContactScrollEffects() {
        const contact = document.getElementById('contato');
        const backdrop = document.querySelector('.contact__backdrop');
        const sink = document.querySelector('.skills-rocket__sink');

        if (contactCoverTrigger) {
            contactCoverTrigger.kill();
            contactCoverTrigger = null;
        }

        if (contact) {
            contact.style.removeProperty('--contact-veil-height');
        }

        if (backdrop && typeof gsap !== 'undefined') {
            gsap.set(backdrop, { clearProps: 'transform' });
        }

        if (sink) {
            sink.style.transform = '';
        }
    }

    function resetRocketLayout(section) {
        if (!section) return;

        section.style.paddingBottom = '';
        section.style.removeProperty('--rocket-exit-pad');
        section.style.removeProperty('--num-skill-height');

        section?.querySelectorAll('.num-skill').forEach((skill) => {
            skill.style.minHeight = '';
        });

        const contact = document.getElementById('contato');
        if (contact) {
            contact.style.marginTop = '';
            contact.style.paddingBottom = '';
            contact.style.paddingTop = '';
        }

        resetContactScrollEffects();

        const visual = document.querySelector('.skills-rocket__visual');
        if (visual) {
            visual.style.clipPath = '';
            visual.style.visibility = '';
        }

        const rocketShip = document.getElementById('rocketShip');
        if (rocketShip && typeof gsap !== 'undefined') {
            gsap.set(rocketShip, { clearProps: 'all' });
            rocketShip.style.opacity = '0';
        }

        document.querySelector('.skills-rocket__visual')?.classList.remove('is-ready');
    }

    function syncRocketScale(visual) {
        if (!visual) return;
        const colWidth = visual.offsetWidth || 160;
        const size = Math.max(96, Math.min(190, Math.round(colWidth * 0.88)));
        visual.style.setProperty('--rocket-size', `${size}px`);
        visual.style.setProperty('--flame-size', `${Math.round(size * 0.58)}px`);
    }

    function syncSkillsTrackLayout(section, skills, content) {
        if (!skills.length) return 0;

        if (!isRocketVisible()) {
            section?.style.removeProperty('--num-skill-height');
            skills.forEach((skill) => {
                skill.style.minHeight = '';
            });
            return content?.offsetHeight || 0;
        }

        const targetTrack = getSkillsListTrack();
        const perSkill = Math.round(targetTrack / skills.length);

        section.style.setProperty('--num-skill-height', `${perSkill}px`);
        skills.forEach((skill) => {
            skill.style.minHeight = `${perSkill}px`;
        });

        return content.offsetHeight;
    }

    function buildSkillsPath() {
        const section = document.getElementById('skillsRocket');
        const pathEl = document.getElementById('skillsPath');
        const visual = document.querySelector('.skills-rocket__visual');
        const content = document.querySelector('.skills-rocket__content');
        const skills = section ? [...section.querySelectorAll('.num-skill')] : [];

        if (!section || !pathEl || !skills.length) return;

        if (!isRocketVisible()) {
            resetRocketLayout(section);
            return;
        }

        syncRocketScale(visual);
        applyRocketExitPadding(section);

        const exitPx = getRocketExitExtension();
        syncSkillsTrackLayout(section, skills, content);
        const pathTrack = getRocketPathContentTrack() + exitPx + getRocketPathDepthExtra();

        const colWidth = visual?.offsetWidth || 160;
        const pathX = Math.max(42, Math.min(68, colWidth * 0.32));
        const cfg = buildShanePathConfig(pathX, colWidth);
        const pathBottomY = getPathBottomY(cfg, pathTrack);
        const pathD = buildShanePathD(pathX, colWidth, pathBottomY);

        pathEl.setAttribute('d', pathD);

        const svg = visual?.querySelector('.skills-rocket__svg');
        if (svg) {
            const viewHeight = Math.ceil(Math.max(VIEWBOX.height, pathBottomY + 48));
            svg.setAttribute('viewBox', `0 0 ${VIEWBOX.width} ${viewHeight}`);
        }

        if (visual && content) {
            const nextHeight = `${getRocketPathContentTrack()}px`;
            if (visual.style.minHeight !== nextHeight) {
                visual.style.minHeight = nextHeight;
            }
        }
    }

    function initRocketScroll() {
        if (typeof MotionPathPlugin === 'undefined') return;

        buildSkillsPath();

        const rocketShip = document.getElementById('rocketShip');
        const skillsSection = document.getElementById('skillsRocket');
        const pathEl = document.getElementById('skillsPath');

        if (rocketScrollTween) {
            rocketScrollTween.scrollTrigger?.kill();
            rocketScrollTween.kill();
            rocketScrollTween = null;
        }

        if (rocketRevealTween) {
            rocketRevealTween.scrollTrigger?.kill();
            rocketRevealTween.kill();
            rocketRevealTween = null;
        }

        if (typeof destroyRocketFlame === 'function') {
            destroyRocketFlame();
        }

        if (!rocketShip || !skillsSection || !pathEl || !isRocketVisible()) {
            resetRocketLayout(skillsSection);
            return;
        }

        const visual = document.querySelector('.skills-rocket__visual');
        const visualStyles = visual ? getComputedStyle(visual) : null;
        const alignX = parseFloat(visualStyles?.getPropertyValue('--rocket-path-align-x')) || 0.5;
        const alignY = parseFloat(visualStyles?.getPropertyValue('--rocket-path-align-y')) || 0.5;

        const motionPathConfig = {
            path: pathEl,
            align: pathEl,
            alignOrigin: [alignX, alignY],
            autoRotate: 180
        };

        gsap.set(rocketShip, {
            opacity: 0,
            motionPath: { ...motionPathConfig, start: 1, end: 1 }
        });

        const revealTrigger = skillsSection;

        rocketRevealTween = gsap.fromTo(rocketShip, {
            opacity: 0
        }, {
            opacity: 1,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
                trigger: revealTrigger,
                start: 'top 82%',
                end: 'top 58%',
                scrub: 0.6,
                invalidateOnRefresh: true
            }
        });

        rocketScrollTween = gsap.fromTo(rocketShip, {
            motionPath: { ...motionPathConfig, start: 1, end: 1 }
        }, {
            motionPath: { ...motionPathConfig, start: 1, end: 0 },
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
                trigger: skillsSection,
                start: 'top center',
                end: () => getPageScrollEnd(),
                scrub: 0.3,
                invalidateOnRefresh: true
            }
        });

        if (typeof initRocketFlame === 'function') {
            initRocketFlame();
        }

        initContactRise();

        ScrollTrigger.refresh();
        document.querySelector('.skills-rocket__visual')?.classList.add('is-ready');
    }

    function scheduleRocketRefresh() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initRocketScroll();
            if (isRocketVisible()) {
                initContactRise();
            } else {
                resetContactScrollEffects();
            }
            ScrollTrigger.refresh();
        }, 120);
    }

    /* Smooth scroll (Lenis) — estilo Shane Sayers */
    function initSmoothScroll() {
        if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        document.documentElement.scrollLeft = 0;
        document.body.scrollLeft = 0;

        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.scrollerProxy(document.documentElement, {
            scrollTop(value) {
                if (arguments.length) {
                    lenis.scrollTo(value, { immediate: true });
                }
                return lenis.scroll;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            }
        });

        ScrollTrigger.addEventListener('refresh', () => lenis.resize());

        window.__lenis = lenis;
    }

    /* GSAP animations */
    function initContactRise() {
        const contactSection = document.getElementById('contato');
        const backdrop = document.querySelector('.contact__backdrop');
        const skillsSection = document.getElementById('skillsRocket');
        const visual = document.querySelector('.skills-rocket__visual');
        const sink = document.querySelector('.skills-rocket__sink');

        if (!contactSection || !backdrop || typeof gsap === 'undefined') return;

        if (!isRocketVisible()) {
            resetContactScrollEffects();
            return;
        }

        if (contactCoverTrigger) {
            contactCoverTrigger.kill();
            contactCoverTrigger = null;
        }

        const lockRocketHidden = () => {
            gsap.set(backdrop, { yPercent: 0 });
            if (sink) sink.style.transform = 'translateY(0)';
            if (visual) {
                visual.style.clipPath = '';
                visual.style.visibility = '';
            }
            const rocketShip = document.getElementById('rocketShip');
            if (rocketShip) gsap.set(rocketShip, { opacity: 0 });
        };

        const unlockRocketHidden = () => {
            gsap.set(backdrop, { yPercent: 100 });
            if (sink) sink.style.transform = 'translateY(100%)';
            if (visual) {
                visual.style.clipPath = '';
                visual.style.visibility = '';
            }
            const rocketShip = document.getElementById('rocketShip');
            if (rocketShip) gsap.set(rocketShip, { clearProps: 'opacity' });
        };

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(backdrop, { clearProps: 'transform' });
            lockRocketHidden();
            return;
        }

        contactCoverTrigger = ScrollTrigger.create({
            trigger: skillsSection || contactSection,
            start: () => getPageScrollEnd() - Math.round(getRocketExitExtension() * 1.28),
            end: () => getPageScrollEnd(),
            scrub: 0.45,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progress = Math.min(1, self.progress);
                const cover = 100 - progress * 100;

                gsap.set(backdrop, { yPercent: cover });
                if (sink) sink.style.transform = `translateY(${cover}%)`;
            },
            onLeave: lockRocketHidden,
            onEnterBack: unlockRocketHidden
        });

        if (contactCoverTrigger.progress >= 1 || window.scrollY >= getPageScrollEnd() - 2) {
            lockRocketHidden();
        }
    }

    function initContactIntro() {
        const contactSection = document.getElementById('contato');
        const intro = document.querySelector('.contact__intro');
        const introText = document.querySelector('.contact__intro-text');
        const contentItems = document.querySelectorAll(
            '.contact__big, .contact__label, .contact__email, .contact__social'
        );

        if (!contactSection || !intro || !introText || !contentItems.length) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            intro.style.display = 'none';
            return;
        }

        if (window.matchMedia('(max-width: 767px)').matches) {
            intro.style.display = 'none';
            gsap.set(contentItems, { opacity: 1 });
            return;
        }

        gsap.set(introText, { opacity: 0 });
        gsap.set(contentItems, { opacity: 0 });

        const tl = gsap.timeline({
            defaults: { ease: 'power2.out' },
            scrollTrigger: {
                trigger: contactSection,
                start: 'top 70%',
                once: true
            }
        });

        tl.to({}, { duration: 0.8 });                      // atraso antes de aparecer
        tl.to(introText, { opacity: 1, duration: 0.8 });   // EC CODE aparecendo
        tl.to({}, { duration: 0.5 });                      // pausa
        tl.to(introText, { opacity: 0, duration: 0.7 });   // EC CODE sumindo
        tl.set(intro, { display: 'none' });
        tl.to(contentItems, {                              // conteudo aparecendo
            opacity: 1,
            duration: 0.8,
            stagger: 0.1
        });
    }

    /* Hero Majd — pin + retrato gira e desce (igual referência) */
    function initHeroMajdScroll() {
        const section = document.querySelector('.hero-majd');
        const pin = document.querySelector('.hero-majd__pin');
        const stack = document.querySelector('.hero-majd__stack');
        const wrap = document.querySelector('.hero-majd__portrait-wrap');
        const portrait = document.querySelector('.hero-majd__portrait');
        if (!section || !pin || !stack || !wrap || !portrait || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(stack, { y: '-50%' });
            gsap.set(wrap, { left: '50%', xPercent: -50, y: 0, autoAlpha: 1 });
            if (window.matchMedia('(max-width: 767px)').matches) {
                gsap.set(portrait, { rotateY: 180, rotateX: 0, scale: 1.02 });
            } else {
                gsap.set(wrap, { bottom: 'auto', top: '50%', yPercent: -50 });
                gsap.set(portrait, { rotateY: 0, rotateX: 0, scale: 1 });
            }
            return;
        }

        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        const startScale = isMobile ? 0.78 : 0.72;
        const endScale = isMobile ? 1.02 : 1.12;

        gsap.set(wrap, { left: '50%', xPercent: -50, y: 0, autoAlpha: 1 });
        gsap.set(portrait, { rotateY: 0, rotateX: 0, scale: startScale, transformOrigin: '50% 50%' });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=110%',
                pin,
                scrub: true,
                anticipatePin: 0,
                invalidateOnRefresh: true,
                fastScrollEnd: true
            }
        });

        tl.to(stack, { y: '-50%', duration: 0.45, ease: 'none' }, 0);

        if (!isMobile) {
            tl.to(wrap, { bottom: '50%', yPercent: 50, duration: 0.42, ease: 'none' }, 0.04);
        }

        tl.to(portrait, { rotateY: 180, scale: endScale, duration: 0.48, ease: 'none' }, 0.06);
    }

    /* Texto estilo legenda — cada palavra acende de uma vez no scroll */
    function updateReadScrollWords(wordEls, progress, state) {
        const total = wordEls.length;
        const lit = progress >= 1 ? total : Math.floor(progress * total);

        if (state.lastLit === lit) return;

        if (lit > state.lastLit) {
            for (let i = Math.max(0, state.lastLit); i < lit; i++) {
                wordEls[i].classList.add('is-lit');
            }
        } else {
            for (let i = lit; i < state.lastLit; i++) {
                wordEls[i].classList.remove('is-lit');
            }
        }

        state.lastLit = lit;
    }

    function initReadScroll() {
        const sections = document.querySelectorAll('.read-scroll');
        if (!sections.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        sections.forEach((section) => {
            const el = section.querySelector('[data-read-scroll]');
            if (!el || el.dataset.readReady) return;

            const words = el.textContent.trim().split(/\s+/);
            el.innerHTML = words.map((word) => `<span class="read-scroll__word">${word}</span>`).join(' ');
            el.dataset.readReady = '1';

            const wordEls = el.querySelectorAll('.read-scroll__word');
            if (!wordEls.length) return;

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                wordEls.forEach((word) => word.classList.add('is-lit'));
                return;
            }

            const isMobile = window.matchMedia('(max-width: 767px)').matches;
            const readState = { lastLit: -1 };

            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: isMobile ? '+=130%' : '+=120%',
                pin: true,
                pinSpacing: true,
                pinReparent: false,
                scrub: true,
                anticipatePin: 0,
                fastScrollEnd: true,
                onUpdate: (self) => updateReadScrollWords(wordEls, self.progress, readState),
                onLeave: () => {
                    readState.lastLit = -1;
                    updateReadScrollWords(wordEls, 1, readState);
                },
                onLeaveBack: () => {
                    readState.lastLit = wordEls.length;
                    updateReadScrollWords(wordEls, 0, readState);
                }
            });
        });
    }

    function initFeaturedSectionMotion() {
        const projetos = document.getElementById('projetos');
        if (!projetos || typeof gsap === 'undefined') return;

        const header = projetos.querySelector('.gsap-reveal');
        if (header) {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 88%',
                    once: true
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                onComplete: () => {
                    header.classList.add('is-revealed');
                    gsap.set(header, { clearProps: 'transform,opacity' });
                }
            });
        }

        const cards = projetos.querySelectorAll('.featured-work__card');
        if (!cards.length) return;

        gsap.from(cards, {
            scrollTrigger: {
                trigger: projetos.querySelector('.featured-work__grid'),
                start: 'top 82%',
                once: true
            },
            y: 56,
            opacity: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power3.out',
            onComplete: () => {
                gsap.set(cards, { clearProps: 'transform,opacity' });
            }
        });
    }

    /* GSAP animations */
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        if (typeof MotionPathPlugin !== 'undefined') {
            gsap.registerPlugin(MotionPathPlugin);
        }

        initSmoothScroll();

        /* Hero Majd scroll */
        initHeroMajdScroll();
        initReadScroll();
        initFeaturedSectionMotion();

        initContactIntro();

        /* Numbered skills — fade simples no texto */
        gsap.utils.toArray('.num-skill').forEach((el) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%'
                },
                y: 40,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out'
            });
        });

        /* Foguete no path (estilo Shane Sayers) */
        initRocketScroll();
        initServicesHScroll();

        ScrollTrigger.refresh();

        window.addEventListener('resize', scheduleRocketRefresh);
        window.matchMedia(`(min-width: ${ROCKET_MIN_WIDTH}px)`).addEventListener('change', scheduleRocketRefresh);

        const skillsSection = document.getElementById('skillsRocket');
        if (skillsSection && typeof ResizeObserver !== 'undefined') {
            const rocketObserver = new ResizeObserver(scheduleRocketRefresh);
            rocketObserver.observe(skillsSection);
            const contactSection = document.getElementById('contato');
            if (contactSection) rocketObserver.observe(contactSection);
        }
    }

    /* Modal */
    function isAnyModalOpen() {
        return Boolean(
            document.getElementById('projectModal')?.classList.contains('open')
            || document.getElementById('serviceDetailModal')?.classList.contains('open')
        );
    }

    function lockPageScroll() {
        document.documentElement.classList.add('is-modal-open');
        document.body.style.overflow = 'hidden';
        window.__lenis?.stop();
    }

    function unlockPageScroll() {
        if (isAnyModalOpen()) return;
        document.documentElement.classList.remove('is-modal-open');
        document.body.style.overflow = '';
        window.__lenis?.start();
    }

    function populateCaseStudy(project) {
        if (!modalCase) return;

        const study = project?.caseStudy;
        if (!study) {
            modalCase.hidden = true;
            return;
        }

        modalCase.hidden = false;
        document.getElementById('modalContext').textContent = study.context || '';
        document.getElementById('modalStack').textContent = (study.stack || []).join(' · ');
        document.getElementById('modalChallenge').textContent = study.challenge || '';
        document.getElementById('modalSolution').textContent = study.solution || '';
        document.getElementById('modalResult').textContent = study.result || '';
    }

    function openModal(card) {
        const project = typeof window.getProjectById === 'function'
            ? window.getProjectById(card.dataset.projectId)
            : null;

        const data = {
            url: card.dataset.url,
            title: card.dataset.title,
            logo: card.dataset.logo,
            darkLogo: card.dataset.darkLogo === 'true'
        };

        modalTitle.textContent = data.title;
        modalLink.href = data.url || '#';
        modalLink.textContent = data.url && data.url !== '#'
            ? 'Abrir site ↗'
            : 'Link em breve';

        if (!data.url || data.url === '#') {
            modalLink.setAttribute('aria-disabled', 'true');
            modalLink.tabIndex = -1;
        } else {
            modalLink.removeAttribute('aria-disabled');
            modalLink.tabIndex = 0;
        }

        populateCaseStudy(project);

        const hasPreview = card.dataset.hasPreview === 'true' && data.url && data.url !== '#';

        window.DevicePreview?.reset();
        if (hasPreview) {
            window.DevicePreview?.setProject(data);
        }

        modal.classList.remove('view-pc');
        phoneView.hidden = !hasPreview;
        pcView.hidden = true;
        if (modalBody) modalBody.hidden = !hasPreview;
        deviceToggle.hidden = !hasPreview;
        deviceToggle.setAttribute('aria-label', 'Alternar para desktop');

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        lockPageScroll();

        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.modal__panel',
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' }
            );
        }
    }

    function closeModal() {
        modal.classList.remove('open', 'view-pc');
        modal.setAttribute('aria-hidden', 'true');
        unlockPageScroll();
        if (modalBody) modalBody.hidden = false;
        deviceToggle.hidden = false;
        window.DevicePreview?.reset();
    }

    function bindProjectCards() {
        /* Cards são links diretos para o site — analytics via delegação em analytics.js */
    }

    bindProjectCards();

    function initServicesDetailModal() {
        const cards = [...document.querySelectorAll('.services-detail__item')];
        const svcModal = document.getElementById('serviceDetailModal');
        const svcContext = document.getElementById('svcModalContext');
        const svcBody = document.getElementById('svcModalBody');
        const svcClose = document.getElementById('svcModalClose');
        const svcBackdrop = svcModal?.querySelector('[data-close-svc-modal]');
        const svcPanel = svcModal?.querySelector('.svc-modal__panel');
        if (!cards.length || !svcModal || !svcContext || !svcBody || !svcPanel) return;

        let lastFocusedCard = null;
        let isClosing = false;
        let treinoWidgetModule = null;
        let restauranteWidgetModule = null;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        async function mountTreinoWidget() {
            const mountEl = svcBody.querySelector('[data-treino-do-dia-mount]');
            if (!mountEl) return;

            try {
                if (!treinoWidgetModule) {
                    treinoWidgetModule = await import('./treino-do-dia/treino-do-dia.js');
                }
                treinoWidgetModule.mountTreinoDoDia(mountEl);
            } catch (err) {
                console.error('Treino do Dia: falha ao carregar widget', err);
            }
        }

        function unmountTreinoWidget() {
            const mountEl = svcBody.querySelector('[data-treino-do-dia-mount]');
            if (!mountEl || !treinoWidgetModule) return;
            treinoWidgetModule.unmountTreinoDoDia(mountEl);
        }

        let restauranteCssPromise = null;

        function ensureRestauranteCss() {
            if (restauranteCssPromise) return restauranteCssPromise;

            restauranteCssPromise = new Promise((resolve, reject) => {
                const existing = document.querySelector('link[data-restaurante-delivery-css]');
                if (existing) {
                    if (existing.sheet) resolve();
                    else existing.addEventListener('load', () => resolve(), { once: true });
                    return;
                }

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'js/restaurante-delivery/restaurante-delivery.css';
                link.dataset.restauranteDeliveryCss = 'true';
                link.onload = () => resolve();
                link.onerror = () => reject(new Error('Falha ao carregar CSS do mockup Restaurante'));
                document.head.appendChild(link);
            });

            return restauranteCssPromise;
        }

        async function mountRestauranteWidget() {
            const mountEl = svcBody.querySelector('[data-restaurante-delivery-mount]');
            if (!mountEl) return;

            try {
                await ensureRestauranteCss();
                if (!restauranteWidgetModule) {
                    restauranteWidgetModule = await import('./restaurante-delivery/restaurante-delivery.js');
                }
                restauranteWidgetModule.mountRestauranteDeliveryMockup(mountEl);
            } catch (err) {
                console.error('Restaurante Delivery: falha ao carregar widget', err);
            }
        }

        function unmountRestauranteWidget() {
            const mountEl = svcBody.querySelector('[data-restaurante-delivery-mount]');
            if (!mountEl || !restauranteWidgetModule) return;
            restauranteWidgetModule.unmountRestauranteDeliveryMockup(mountEl);
        }

        function initMasonryLazyImages(root) {
            const pending = [...root.querySelectorAll('img[data-src]')];
            if (!pending.length) return;

            const reveal = (img) => {
                const src = img.dataset.src;
                if (!src) return;
                img.src = src;
                img.removeAttribute('data-src');
            };

            if (!('IntersectionObserver' in window)) {
                pending.forEach(reveal);
                return;
            }

            const scrollRoot = root.closest('.svc-modal__body');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    reveal(entry.target);
                    observer.unobserve(entry.target);
                });
            }, {
                root: scrollRoot,
                rootMargin: '120px 0px',
                threshold: 0.01
            });

            pending.forEach((img) => observer.observe(img));

            const idle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 400));
            idle(() => {
                pending.forEach((img) => {
                    if (!img.dataset.src) return;
                    reveal(img);
                    observer.unobserve(img);
                });
            });
        }

        function initMasonryDemo(root) {
            if (!root || root.dataset.masonryInit === 'true') return;
            root.dataset.masonryInit = 'true';

            const filters = root.querySelectorAll('.masonry-demo__filter');
            const cards = root.querySelectorAll('.masonry-demo__card');
            const grid = root.querySelector('.masonry-demo__grid');
            const viewport = root.querySelector('.masonry-demo__viewport');
            const animMs = prefersReducedMotion ? 0 : 220;
            let resizeTimer;

            initMasonryLazyImages(root);

            function syncViewportHeight() {
                if (!viewport || !grid) return;
                viewport.style.minHeight = `${grid.offsetHeight}px`;
            }

            function applyFilter(filter, instant = false) {
                if (!grid) return;

                if (!instant) grid.classList.add('is-filtering');

                cards.forEach((card) => {
                    const category = card.dataset.category;
                    const show = filter === 'all' || category === filter;

                    if (show) {
                        card.classList.remove('is-hidden', 'is-filtered-out');
                        return;
                    }

                    if (instant || animMs === 0) {
                        card.classList.add('is-filtered-out', 'is-hidden');
                        return;
                    }

                    card.classList.add('is-filtered-out');
                    window.setTimeout(() => {
                        if (card.classList.contains('is-filtered-out')) {
                            card.classList.add('is-hidden');
                        }
                    }, animMs);
                });

                const finish = () => {
                    grid.classList.remove('is-filtering');
                    syncViewportHeight();
                };

                if (!instant && animMs > 0) {
                    window.setTimeout(finish, animMs);
                } else {
                    finish();
                }
            }

            filters.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const filter = btn.dataset.filter || 'all';

                    filters.forEach((item) => {
                        const active = item === btn;
                        item.classList.toggle('is-active', active);
                        item.setAttribute('aria-selected', active ? 'true' : 'false');
                    });

                    applyFilter(filter);
                });
            });

            root.querySelectorAll('.masonry-demo__open').forEach((btn) => {
                btn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    btn.classList.add('is-pressed');
                    window.setTimeout(() => btn.classList.remove('is-pressed'), 220);
                });
            });

            window.requestAnimationFrame(syncViewportHeight);

            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = window.setTimeout(syncViewportHeight, 120);
            }, { passive: true });
        }

        function renderHeader(card) {
            const top = card.querySelector('.services-detail__top');
            const badge = top?.querySelector('.services-detail__badge');
            const label = top?.querySelector('.services-detail__label');

            svcContext.innerHTML = '';

            if (badge) svcContext.appendChild(badge.cloneNode(true));

            if (label) {
                const labelEl = document.createElement('p');
                labelEl.className = 'svc-modal__header-label';
                labelEl.textContent = label.textContent;
                svcContext.appendChild(labelEl);
            }
        }

        const modalFragmentCache = new Map();

        async function fetchModalFragment(src) {
            if (!src) return '';
            const cached = modalFragmentCache.get(src);
            if (typeof cached === 'string') return cached;
            if (cached) return cached;

            const request = fetch(src)
                .then((response) => {
                    if (!response.ok) throw new Error(`Falha ao carregar modal: ${src}`);
                    return response.text();
                })
                .then((html) => {
                    modalFragmentCache.set(src, html);
                    return html;
                })
                .catch((err) => {
                    modalFragmentCache.delete(src);
                    throw err;
                });

            modalFragmentCache.set(src, request);
            return request;
        }

        function preloadModalFragment(src) {
            if (src) fetchModalFragment(src).catch(() => {});
        }

        function prefetchHeavyWidgets() {
            if (!treinoWidgetModule) {
                import('./treino-do-dia/treino-do-dia.js')
                    .then((mod) => { treinoWidgetModule = mod; })
                    .catch(() => {});
            }
            ensureRestauranteCss().catch(() => {});
            if (!restauranteWidgetModule) {
                import('./restaurante-delivery/restaurante-delivery.js')
                    .then((mod) => { restauranteWidgetModule = mod; })
                    .catch(() => {});
            }
        }

        function preloadCard(card, { includeHeavy = true } = {}) {
            preloadModalFragment(card.dataset.modalSrc);
            if (!includeHeavy) return;
            if (card.id === 'site-personal' || card.id === 'site-restaurante') {
                prefetchHeavyWidgets();
            }
            if (card.id === 'site-fotografia') {
                [
                    'assets/fotografia/retrato.jpg',
                    'assets/fotografia/produto.jpg',
                    'assets/fotografia/newborn.jpg'
                ].forEach((src) => {
                    const img = new Image();
                    img.decoding = 'async';
                    img.src = src;
                });
            }
        }

        function appendSvcModalTitle(card) {
            const title = card.querySelector('h3');
            if (!title) return;

            const titleEl = document.createElement('h2');
            titleEl.className = 'svc-modal__title';
            titleEl.id = 'svcModalTitle';
            titleEl.textContent = title.textContent;
            svcBody.appendChild(titleEl);
        }

        function setSvcModalLoading(isLoading) {
            svcBody.classList.toggle('is-loading', isLoading);
            let loader = svcBody.querySelector('.svc-modal__loading');

            if (isLoading) {
                if (!loader) {
                    loader = document.createElement('p');
                    loader.className = 'svc-modal__loading';
                    loader.textContent = 'Carregando…';
                    svcBody.appendChild(loader);
                }
                return;
            }

            loader?.remove();
        }

        function appendModalFragment(html, container) {
            const tpl = document.createElement('template');
            tpl.innerHTML = html.trim();

            tpl.content
                .querySelectorAll('.svc-modal__tag, .svc-modal__lead, .svc-modal__demo, .svc-modal__features, .svc-modal__foot, .svc-modal__list')
                .forEach((node) => container.appendChild(node.cloneNode(true)));
        }

        async function renderContentBody(card) {
            unmountTreinoWidget();
            unmountRestauranteWidget();

            const modalData = card.querySelector('.services-detail__modal-data');
            const modalSrc = card.dataset.modalSrc;
            const needsNetwork = Boolean(modalSrc) && typeof modalFragmentCache.get(modalSrc) !== 'string';

            svcBody.querySelectorAll('.svc-modal__tag, .svc-modal__lead, .svc-modal__demo, .svc-modal__features, .svc-modal__foot, .svc-modal__list, .svc-modal__text')
                .forEach((node) => node.remove());

            if (needsNetwork) setSvcModalLoading(true);

            try {
                if (modalData) {
                    modalData.querySelectorAll('.svc-modal__tag, .svc-modal__lead, .svc-modal__demo, .svc-modal__features, .svc-modal__foot, .svc-modal__list')
                        .forEach((node) => svcBody.appendChild(node.cloneNode(true)));
                } else if (modalSrc) {
                    const html = await fetchModalFragment(modalSrc);
                    appendModalFragment(html, svcBody);
                } else {
                    const text = card.querySelector('h3 + p');
                    const list = card.querySelector('h3 ~ ul');

                    if (text) {
                        const p = document.createElement('p');
                        p.className = 'svc-modal__text';
                        p.textContent = text.textContent;
                        svcBody.appendChild(p);
                    }

                    if (list) {
                        const ul = document.createElement('ul');
                        ul.className = 'svc-modal__list';
                        [...list.children].forEach((li) => ul.appendChild(li.cloneNode(true)));
                        svcBody.appendChild(ul);
                    }
                }
            } finally {
                setSvcModalLoading(false);
            }

            if (card.id === 'site-personal') {
                void mountTreinoWidget();
            }

            if (card.id === 'site-restaurante') {
                void mountRestauranteWidget();
            }

            const masonryRoot = svcBody.querySelector('.masonry-demo');
            if (masonryRoot) {
                const idle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 48));
                idle(() => initMasonryDemo(masonryRoot));
            }
        }

        function getSvcAnimateTargets() {
            const bodyTargets = [...svcBody.children].filter(
                (el) => !el.classList.contains('svc-modal__loading')
            );
            return [...svcContext.children, ...bodyTargets];
        }

        function animateBodyIn() {
            if (prefersReducedMotion || typeof gsap === 'undefined') return;

            gsap.fromTo(getSvcAnimateTargets(),
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.32, stagger: 0.04, ease: 'power2.out', delay: 0.06 }
            );
        }

        function animateOpen() {
            if (prefersReducedMotion || typeof gsap === 'undefined') return;

            const targets = getSvcAnimateTargets();
            gsap.killTweensOf([svcBackdrop, svcPanel, ...targets]);
            gsap.set(svcBackdrop, { opacity: 0 });
            gsap.set(svcPanel, { y: 24, scale: 0.96, opacity: 0 });
            gsap.set(targets, { y: 10, opacity: 0 });

            gsap.to(svcBackdrop, { opacity: 1, duration: 0.35, ease: 'power2.out' });
            gsap.to(svcPanel, {
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: 'power3.out'
            });
            animateBodyIn();
        }

        function closeSvcModal() {
            if (!svcModal.classList.contains('open') || isClosing) return;
            isClosing = true;

            const finishClose = () => {
                unmountTreinoWidget();
                unmountRestauranteWidget();
                svcModal.classList.remove('open');
                svcModal.setAttribute('aria-hidden', 'true');
                unlockPageScroll();
                svcContext.innerHTML = '';
                svcBody.innerHTML = '';
                isClosing = false;
                lastFocusedCard?.focus();
                lastFocusedCard = null;
            };

            if (prefersReducedMotion || typeof gsap === 'undefined') {
                finishClose();
                return;
            }

            gsap.killTweensOf([svcBackdrop, svcPanel, svcContext.children, svcBody.children]);
            gsap.to([...svcContext.children, ...svcBody.children], {
                y: 10,
                opacity: 0,
                duration: 0.18,
                stagger: 0.02,
                ease: 'power2.in'
            });
            gsap.to(svcPanel, {
                y: 24,
                scale: 0.96,
                opacity: 0,
                duration: 0.28,
                ease: 'power2.in'
            });
            gsap.to(svcBackdrop, {
                opacity: 0,
                duration: 0.28,
                ease: 'power2.in',
                onComplete: finishClose
            });
        }

        async function openSvcModal(card) {
            if (isClosing) return;

            lastFocusedCard = card;
            renderHeader(card);
            svcBody.innerHTML = '';
            appendSvcModalTitle(card);
            setSvcModalLoading(true);

            svcModal.classList.add('open');
            svcModal.setAttribute('aria-hidden', 'false');
            lockPageScroll();
            svcBody.scrollTop = 0;
            animateOpen();
            svcClose?.focus();

            try {
                await renderContentBody(card);
            } catch (err) {
                console.error('Modal de serviço:', err);
                closeSvcModal();
                return;
            }

            animateBodyIn();
        }

        /* Impede Lenis de capturar wheel/touch dentro do modal */
        svcPanel.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
        svcPanel.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });

        cards.forEach((card) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-haspopup', 'dialog');
            card.setAttribute('aria-controls', 'serviceDetailModal');

            card.addEventListener('mouseenter', () => preloadCard(card), { passive: true });
            card.addEventListener('focus', () => preloadCard(card), { passive: true });
            card.addEventListener('touchstart', () => preloadCard(card), { passive: true });

            card.addEventListener('click', () => openSvcModal(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openSvcModal(card);
                }
            });
        });

        svcClose?.addEventListener('click', closeSvcModal);
        svcBackdrop?.addEventListener('click', closeSvcModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && svcModal.classList.contains('open')) closeSvcModal();
        });

        const servicesDetail = document.querySelector('.services-detail');
        const warmCache = () => {
            cards.forEach((card, index) => {
                const run = () => preloadCard(card, { includeHeavy: false });
                const idle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 400 + index * 120));
                idle(run);
            });
        };

        if (servicesDetail && 'IntersectionObserver' in window) {
            const warmObserver = new IntersectionObserver((entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                warmObserver.disconnect();
                const idle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 800));
                idle(warmCache);
            }, { rootMargin: '40px 0px', threshold: 0.05 });
            warmObserver.observe(servicesDetail);
        } else {
            const idle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 1200));
            idle(warmCache);
        }
    }

    initServicesDetailModal();

    function initServicesDetailReveal() {
        const cards = [...document.querySelectorAll('.services-detail__item')];
        if (!cards.length) return;

        cards.forEach((card) => card.classList.add('svc-card'));

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            cards.forEach((card) => card.classList.add('is-visible'));
            return;
        }

        if (!('IntersectionObserver' in window)) {
            cards.forEach((card) => card.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const index = cards.indexOf(entry.target);
                const row = Math.floor(index / 3);
                const col = index % 3;
                const delay = row * 20 + col * 12;

                entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

        cards.forEach((card) => observer.observe(card));
    }

    initServicesDetailReveal();

    modalClose?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
    });

    deviceToggle?.addEventListener('click', () => {
        const isPc = modal.classList.toggle('view-pc');
        phoneView.hidden = isPc;
        pcView.hidden = !isPc;
        deviceToggle.setAttribute('aria-label', isPc ? 'Alternar para celular' : 'Alternar para desktop');
        window.DevicePreview?.reset();
    });
})();
