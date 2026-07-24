/**
 * EC CODE — Analytics e rastreamento de conversão (RNF05)
 */
(function () {
    const config = window.EC_SITE || {};

    function loadAnalytics() {
        if (config.plausibleDomain) {
            const script = document.createElement('script');
            script.defer = true;
            script.dataset.domain = config.plausibleDomain;
            script.src = 'https://plausible.io/js/script.js';
            document.head.appendChild(script);
        }

        if (config.ga4Id) {
            const loader = document.createElement('script');
            loader.async = true;
            loader.src = `https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}`;
            document.head.appendChild(loader);

            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag() {
                window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());
            window.gtag('config', config.ga4Id, { anonymize_ip: true });
        }
    }

    function trackEvent(name, params = {}) {
        if (typeof window.gtag === 'function' && config.ga4Id) {
            window.gtag('event', name, params);
        }
        if (typeof window.plausible === 'function' && config.plausibleDomain) {
            window.plausible(name, { props: params });
        }
    }

    window.ECAnalytics = { trackEvent };

    document.addEventListener('DOMContentLoaded', () => {
        loadAnalytics();

        document.querySelectorAll('[data-track="contact"]').forEach((el) => {
            el.addEventListener('click', () => {
                trackEvent('contact_click', {
                    channel: el.dataset.channel || 'unknown',
                    link_url: el.href || ''
                });
            });
        });

        document.getElementById('projectsGrid')?.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (!card) return;
            trackEvent('project_open', {
                project_id: card.dataset.projectId || '',
                project_title: card.dataset.title || ''
            });
        });

        const cvLink = document.querySelector('[data-track="cv"]');
        cvLink?.addEventListener('click', () => {
            trackEvent('cv_download', { link_url: cvLink.href || '' });
        });
    });
})();
