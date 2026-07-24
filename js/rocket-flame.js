/**
 * EC CODE — Chama do foguete com Lottie (Noto Emoji 🔥)
 */
(function () {
    const FLAME_ID = 'rocketFlameLottie';
    const FLAME_PATH = 'assets/lottie/rocket-flame.json';
    let animation = null;
    let viewportObserver = null;

    function isRocketFlameVisible() {
        return window.matchMedia('(min-width: 768px)').matches;
    }

    function pauseRocketFlame() {
        if (animation && !animation.isPaused) {
            animation.pause();
        }
    }

    function playRocketFlame() {
        if (animation && animation.isPaused && isRocketFlameVisible()) {
            animation.play();
        }
    }

    function observeRocketFlameVisibility() {
        if (viewportObserver) {
            viewportObserver.disconnect();
            viewportObserver = null;
        }

        const visual = document.querySelector('.skills-rocket__visual');
        if (!visual) return;

        viewportObserver = new IntersectionObserver((entries) => {
            const visible = entries.some((entry) => entry.isIntersecting);

            if (!visible) {
                pauseRocketFlame();
                return;
            }

            playRocketFlame();
        }, { rootMargin: '100px 0px', threshold: 0 });

        viewportObserver.observe(visual);
    }

    function destroyRocketFlame() {
        if (viewportObserver) {
            viewportObserver.disconnect();
            viewportObserver = null;
        }

        if (animation) {
            animation.destroy();
            animation = null;
        }

        const el = document.getElementById(FLAME_ID);
        if (el) el.innerHTML = '';
    }

    function initRocketFlame() {
        const container = document.getElementById(FLAME_ID);
        if (!container || !isRocketFlameVisible() || typeof lottie === 'undefined') {
            destroyRocketFlame();
            return;
        }

        destroyRocketFlame();

        animation = lottie.loadAnimation({
            container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: FLAME_PATH
        });

        observeRocketFlameVisibility();
    }

    window.initRocketFlame = initRocketFlame;
    window.destroyRocketFlame = destroyRocketFlame;
})();