/**
 * EC CODE — Serviços (scroll horizontal otimizado)
 */
(function () {
    function getTrackPadding(track) {
        const styles = getComputedStyle(track);
        return {
            left: parseFloat(styles.paddingLeft) || 0,
            right: parseFloat(styles.paddingRight) || 0
        };
    }

    function getTrackBounds(track, viewport, cards, padding = null) {
        if (!viewport || !cards.length) return { minX: 0, maxX: 0, range: 0, snapXs: [0] };

        const pad = padding || getTrackPadding(track);
        const firstCard = cards[0];
        const lastCard = cards[cards.length - 1];

        const minX = Math.min(
            0,
            viewport.clientWidth - pad.right - lastCard.offsetLeft - lastCard.offsetWidth
        );

        const maxX = Math.min(0, pad.left - firstCard.offsetLeft);

        const range = Math.abs(minX - maxX);
        const snapXs = cards.map((card) =>
            gsap.utils.clamp(minX, maxX, pad.left - card.offsetLeft)
        );

        return { minX, maxX, range, snapXs };
    }

    function nearestSnapIndex(x, snapXs) {
        let nearest = 0;
        let minDistance = Infinity;

        snapXs.forEach((snapX, index) => {
            const distance = Math.abs(x - snapX);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = index;
            }
        });

        return nearest;
    }

    function wrapCardInners(cards) {
        cards.forEach((card) => {
            const existingInner = card.querySelector('.service-card__inner');

            if (existingInner) {
                const nestedHole = existingInner.querySelector(':scope > .service-card__hole');
                if (nestedHole) {
                    card.insertBefore(nestedHole, existingInner);
                }
                return;
            }

            const inner = document.createElement('div');
            inner.className = 'service-card__inner';

            [...card.children].forEach((child) => {
                if (child.classList.contains('service-card__connector')) return;
                if (child.classList.contains('service-card__hole')) return;
                inner.appendChild(child);
            });

            card.appendChild(inner);
        });
    }

    function setCardSwingOrigin(inner, viewport) {
        if (!inner || !viewport) return;

        const tabHeight = parseFloat(getComputedStyle(viewport).getPropertyValue('--services-tab-h')) || 69;
        inner.style.transformOrigin = `center ${Math.round(tabHeight * 0.5)}px`;
    }

    function cacheCardLayout(cards) {
        return cards.map((card) => ({
            card,
            inner: card.querySelector('.service-card__inner'),
            holeConnector: card.querySelector('.service-card__hole-connector'),
            left: card.offsetLeft,
            width: card.offsetWidth
        }));
    }

    function finishCardEntrance(card, inner, holeConnector, immediate = false) {
        card?.classList.remove('is-swinging');

        if (immediate) {
            if (card) gsap.set(card, { x: '0%' });
            if (inner) gsap.set(inner, { rotation: 0 });
            if (holeConnector) gsap.set(holeConnector, { rotation: 0 });
            return gsap.timeline();
        }

        const settle = gsap.timeline({ defaults: { ease: 'power2.out', overwrite: 'auto' } });

        if (card) {
            const cardX = gsap.getProperty(card, 'x') || 0;
            if (Math.abs(cardX) > 0.5) {
                settle.to(card, { x: '0%', duration: 0.28 }, 0);
            } else {
                gsap.set(card, { x: '0%' });
            }
        }

        if (inner) {
            const innerRot = gsap.getProperty(inner, 'rotation') || 0;
            if (Math.abs(innerRot) > 0.04) {
                settle.to(inner, { rotation: 0, duration: 0.3 }, 0);
            } else {
                gsap.set(inner, { rotation: 0 });
            }
        }

        if (holeConnector) {
            const holeRot = gsap.getProperty(holeConnector, 'rotation') || 0;
            if (Math.abs(holeRot) > 0.04) {
                settle.to(holeConnector, { rotation: 0, duration: 0.26 }, 0);
            } else {
                gsap.set(holeConnector, { rotation: 0 });
            }
        }

        return settle;
    }

    function initServicesEntrance(section, track, cards, cardLayout, viewport, onReady) {
        if (typeof ScrollTrigger === 'undefined') {
            section.dataset.entranceReady = 'true';
            return null;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(cards, { x: '0%' });
            cardLayout.forEach(({ inner, holeConnector, card }) => finishCardEntrance(card, inner, holeConnector, true));
            section.dataset.entranceReady = 'true';
            return null;
        }
        if (window.matchMedia('(max-width: 767px)').matches) {
            gsap.set(cards, { x: '0%' });
            cardLayout.forEach(({ inner, holeConnector, card }) => finishCardEntrance(card, inner, holeConnector, true));
            section.dataset.entranceReady = 'true';
            onReady?.();
            return null;
        }

        section.dataset.entranceReady = 'false';

        gsap.set(cards, { x: '100vw' });

        cardLayout.forEach(({ inner, holeConnector }) => {
            if (inner) {
                setCardSwingOrigin(inner, viewport);
                gsap.set(inner, { rotation: -4 });
            }
            if (holeConnector) gsap.set(holeConnector, { rotation: 4 });
        });

        const timelines = [];
        let cardsSlidIn = 0;
        const entranceCardCount = cards.filter((_, index) => Boolean(cardLayout[index]?.inner)).length;

        const tryEnableInteraction = () => {
            if (section.dataset.entranceReady === 'true') return;
            section.dataset.entranceReady = 'true';
            section.classList.remove('is-entrance-active');
            onReady?.();
        };

        const finishEntranceImmediate = () => {
            timelines.forEach((tl) => tl.progress(1).kill());
            gsap.set(cards, { x: '0%' });
            cardLayout.forEach(({ inner, holeConnector, card }) => finishCardEntrance(card, inner, holeConnector, true));
            tryEnableInteraction();
        };

        cards.forEach((card, index) => {
            const inner = cardLayout[index]?.inner;
            const holeConnector = cardLayout[index]?.holeConnector;
            if (!inner) return;

            const stagger = index * 0.08;
            const cardTl = gsap.timeline({
                paused: true,
                onComplete: () => {
                    finishCardEntrance(card, inner, holeConnector, true);
                }
            });

            cardTl
                .to(card, {
                    x: '0%',
                    duration: 0.72,
                    ease: 'power2.out',
                    delay: stagger,
                    overwrite: 'auto',
                    onComplete: () => {
                        cardsSlidIn += 1;
                        if (cardsSlidIn >= entranceCardCount) tryEnableInteraction();
                    }
                })
                .to(inner, {
                    rotation: 0,
                    duration: 0.45,
                    ease: 'power2.out',
                    overwrite: 'auto'
                }, '-=0.35');

            if (holeConnector) {
                cardTl.to(holeConnector, {
                    rotation: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    overwrite: 'auto'
                }, '-=0.45');
            }

            timelines.push(cardTl);
        });

        let entranceStarted = false;
        let scrollIdleTimer = null;
        let scrollActive = false;

        const markScrollActivity = () => {
            scrollActive = true;
            window.clearTimeout(scrollIdleTimer);
            scrollIdleTimer = window.setTimeout(() => {
                scrollActive = false;
            }, 140);
        };

        window.addEventListener('wheel', markScrollActivity, { passive: true });
        window.addEventListener('touchmove', markScrollActivity, { passive: true });
        window.__lenis?.on?.('scroll', markScrollActivity);

        const waitForScrollIdle = (callback) => {
            const attempt = () => {
                if (scrollActive) {
                    window.requestAnimationFrame(attempt);
                    return;
                }
                callback();
            };
            attempt();
        };

        const playEntrance = () => {
            if (entranceStarted || !timelines.length) return;
            if (section.dataset.entranceReady === 'true') return;

            entranceStarted = true;
            section.classList.add('is-entrance-active');
            timelines.forEach((tl) => tl.play(0));
        };

        const scheduleEntrance = () => {
            waitForScrollIdle(playEntrance);
        };

        ScrollTrigger.create({
            trigger: track,
            start: 'top 82%',
            once: true,
            onEnter: scheduleEntrance
        });

        const maybePlayEntrance = () => {
            const rect = track.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.82 && rect.bottom > 0) {
                scheduleEntrance();
            }
        };

        requestAnimationFrame(maybePlayEntrance);
        window.addEventListener('load', maybePlayEntrance, { once: true });

        if ('IntersectionObserver' in window) {
            const abortObserver = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) return;
                if (!entranceStarted || section.dataset.entranceReady === 'true') return;
                finishEntranceImmediate();
            }, { threshold: 0.05 });
            abortObserver.observe(section);
        }

        return timelines;
    }

    function buildServicesHScroll(section) {
        const viewport = section.querySelector('.services-hscroll__viewport');
        const track = section.querySelector('.services-hscroll__track');
        const cards = [...section.querySelectorAll('.service-card')];

        if (!viewport || !track || !cards.length) return;
        if (typeof gsap === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        if (typeof Draggable !== 'undefined') {
            gsap.registerPlugin(Draggable);
        }
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        let ctx = null;
        let draggable = null;
        let cardLayout = [];
        let trackPadding = getTrackPadding(track);
        let bounds = getTrackBounds(track, viewport, cards, trackPadding);
        let resizeTimer = null;
        let trackSnapTween = null;

        const getSnapDuration = (distance) => gsap.utils.clamp(distance / 900, 0.4, 0.65);

        const clampTrackX = (x) => gsap.utils.clamp(bounds.minX, bounds.maxX, x);

        const setTrackX = (x) => {
            gsap.set(track, { x, force3D: true });
        };

        const syncDraggableX = (x) => {
            if (!draggable) return;
            draggable.x = x;
            draggable.endX = x;
        };

        const applyTrackX = (x, { syncDraggable = true } = {}) => {
            const clamped = clampTrackX(x);
            setTrackX(clamped);
            if (syncDraggable) syncDraggableX(clamped);
            return clamped;
        };

        const refreshBounds = () => {
            trackPadding = getTrackPadding(track);
            cardLayout = cacheCardLayout(cards);
            bounds = getTrackBounds(track, viewport, cards, trackPadding);

            if (!draggable) return;

            draggable.applyBounds({ minX: bounds.minX, maxX: bounds.maxX });
            applyTrackX(gsap.getProperty(track, 'x'));
        };

        const bindLenisPause = () => {
            const lenis = window.__lenis;
            if (!lenis) return { pause: () => {}, resume: () => {}, destroy: () => {} };

            let paused = false;

            const pause = () => {
                if (paused) return;
                lenis.stop();
                paused = true;
            };

            const resume = () => {
                if (!paused) return;
                lenis.start();
                paused = false;
            };

            window.addEventListener('pointerup', resume, { passive: true });
            window.addEventListener('pointercancel', resume, { passive: true });

            return {
                pause,
                resume,
                destroy() {
                    window.removeEventListener('pointerup', resume);
                    window.removeEventListener('pointercancel', resume);
                    resume();
                }
            };
        };

        const snapToNearest = () => {
            if (!bounds.snapXs.length || !draggable) return;

            trackSnapTween?.kill();

            const currentX = clampTrackX(draggable.x);
            const snapIndex = nearestSnapIndex(currentX, bounds.snapXs);
            const targetX = clampTrackX(bounds.snapXs[snapIndex]);
            const distance = Math.abs(currentX - targetX);
            const duration = getSnapDuration(distance);

            if (distance < 4) {
                applyTrackX(targetX);
                return;
            }

            trackSnapTween = gsap.to(track, {
                x: targetX,
                duration,
                ease: 'power3.out',
                overwrite: true,
                force3D: true,
                onUpdate: () => {
                    syncDraggableX(clampTrackX(gsap.getProperty(track, 'x')));
                },
                onComplete: () => {
                    applyTrackX(targetX);
                    trackSnapTween = null;
                }
            });
        };

        const snapToIndex = (index) => {
            if (!draggable || !bounds.snapXs.length) return;
            const clampedIndex = gsap.utils.clamp(0, bounds.snapXs.length - 1, index);
            const targetX = clampTrackX(bounds.snapXs[clampedIndex]);
            trackSnapTween?.kill();
            trackSnapTween = gsap.to(track, {
                x: targetX,
                duration: 0.45,
                ease: 'power3.out',
                overwrite: true,
                force3D: true,
                onUpdate: () => {
                    syncDraggableX(clampTrackX(gsap.getProperty(track, 'x')));
                },
                onComplete: () => {
                    applyTrackX(targetX);
                    trackSnapTween = null;
                }
            });
        };

        const initKeyboardNav = () => {
            if (!viewport || viewport.dataset.keyboardBound === 'true') return;
            viewport.dataset.keyboardBound = 'true';

            viewport.addEventListener('keydown', (event) => {
                if (!draggable) return;

                const currentX = clampTrackX(draggable.x);
                const snapIndex = nearestSnapIndex(currentX, bounds.snapXs);
                let nextIndex = snapIndex;

                switch (event.key) {
                    case 'ArrowLeft':
                        nextIndex = snapIndex - 1;
                        break;
                    case 'ArrowRight':
                        nextIndex = snapIndex + 1;
                        break;
                    case 'Home':
                        nextIndex = 0;
                        break;
                    case 'End':
                        nextIndex = bounds.snapXs.length - 1;
                        break;
                    default:
                        return;
                }

                event.preventDefault();
                snapToIndex(nextIndex);
            });
        };

        const createDraggable = () => {
            if (draggable || typeof Draggable === 'undefined') return;

            bounds = getTrackBounds(track, viewport, cards, trackPadding);
            const lenisControl = bindLenisPause();
            let dragStarted = false;

            draggable = Draggable.create(track, {
                type: 'x',
                bounds: { minX: bounds.minX, maxX: bounds.maxX },
                inertia: false,
                dragClickables: true,
                edgeResistance: 1,
                dragResistance: 0,
                minimumMovement: 2,
                cursor: 'inherit',
                activeCursor: 'grabbing',
                zIndexBoost: false,
                liveSnap: (x) => clampTrackX(x),
                onPress() {
                    dragStarted = false;
                    trackSnapTween?.kill();
                    trackSnapTween = null;
                    refreshBounds();
                    section.classList.add('is-dragging');
                    applyTrackX(this.x);
                },
                onDrag() {
                    if (!dragStarted) {
                        dragStarted = true;
                        lenisControl.pause();
                    }

                    const clamped = clampTrackX(this.x);
                    if (this.x !== clamped) this.x = clamped;
                    setTrackX(clamped);
                },
                onRelease() {
                    applyTrackX(this.x);
                    section.classList.remove('is-dragging');
                    lenisControl.resume();
                    snapToNearest();
                }
            })[0];

            requestAnimationFrame(refreshBounds);

            return () => {
                lenisControl.destroy?.();
            };
        };

        let destroyDraggableExtras = null;

        const enableDragging = () => {
            if (!draggable) {
                destroyDraggableExtras = createDraggable();
            }
            draggable?.enable();
            initKeyboardNav();
        };

        wrapCardInners(cards);
        cardLayout = cacheCardLayout(cards);

        cards.forEach((card, index) => {
            card.style.zIndex = String(index + 1);
        });

        cardLayout.forEach(({ inner }) => setCardSwingOrigin(inner, viewport));

        gsap.set(track, { x: 0, force3D: true });

        ctx = gsap.context(() => {
            initServicesEntrance(section, track, cards, cardLayout, viewport, enableDragging);
        }, section);

        if (section.dataset.entranceReady === 'true') {
            enableDragging();
        }

        if (!buildServicesHScroll.resizeBound) {
            buildServicesHScroll.resizeBound = true;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(refreshBounds, 120);
            }, { passive: true });
        }

        section._servicesHScrollCleanup = () => {
            section.classList.remove('is-dragging');
            trackSnapTween?.kill();
            trackSnapTween = null;
            ctx?.revert();
            ctx = null;
            draggable?.kill();
            draggable = null;
            destroyDraggableExtras?.();
            destroyDraggableExtras = null;
            gsap.set(track, { clearProps: 'x' });
        };
    }

    function initServicesHScroll() {
        const section = document.querySelector('.services-hscroll');
        if (!section || section.dataset.hscrollBuilt === 'true') return;

        const start = () => {
            if (section.dataset.hscrollBuilt === 'true') return;
            section.dataset.hscrollBuilt = 'true';
            buildServicesHScroll(section);
        };

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                start();
            }, { rootMargin: '80px 0px', threshold: 0.08 });

            io.observe(section);

            requestAnimationFrame(() => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight + 80 && rect.bottom > -80) {
                    start();
                }
            });
            return;
        }

        start();
    }

    window.initServicesHScroll = initServicesHScroll;
})();

