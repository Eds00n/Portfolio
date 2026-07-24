/**
 * Lógica de dispositivos (celular/PC) no modal — mesma dinâmica do portfólio anterior
 */
(function () {
    const FECHAR_APOS_MS = 5000;
    const DURACAO_TRANSICAO_MS = 550;

    function setupDevice(frame, opts) {
        const iframe = opts.iframe;
        const logo = opts.logo;
        const closingClass = opts.closingClass;
        const fadeClass = opts.fadeClass;
        let timeoutFechar = null;

        function fechar() {
            if (!frame.classList.contains('active')) return;
            if (timeoutFechar) clearTimeout(timeoutFechar);
            timeoutFechar = null;
            frame.classList.add(closingClass);
            requestAnimationFrame(() => logo.classList.add(fadeClass));
            setTimeout(() => {
                frame.classList.remove('active', closingClass);
                logo.classList.remove(fadeClass);
                iframe.src = 'about:blank';
            }, DURACAO_TRANSICAO_MS);
        }

        function iniciarTimer() {
            if (timeoutFechar) clearTimeout(timeoutFechar);
            timeoutFechar = setTimeout(fechar, FECHAR_APOS_MS);
        }

        function cancelarTimer() {
            if (timeoutFechar) clearTimeout(timeoutFechar);
            timeoutFechar = null;
        }

        frame.addEventListener('click', (e) => {
            if (frame.classList.contains('active')) return;
            if (iframe === e.target) return;
            const src = iframe.getAttribute('data-src');
            if (src) {
                iframe.src = src;
                frame.classList.add('active');
                iniciarTimer();
            }
        });

        frame.addEventListener('mouseenter', () => {
            if (frame.classList.contains('active')) cancelarTimer();
        });
        frame.addEventListener('mousemove', () => {
            if (frame.classList.contains('active')) cancelarTimer();
        });
        frame.addEventListener('mouseleave', (e) => {
            if (!frame.classList.contains('active')) return;
            if (e.relatedTarget == null) return;
            if (frame.contains(e.relatedTarget)) return;
            iniciarTimer();
        });

        iframe.addEventListener('click', (e) => e.stopPropagation());

        return { fechar, cancelarTimer };
    }

    window.DevicePreview = {
        phone: null,
        pc: null,

        init() {
            const phoneFrame = document.getElementById('modalPhone');
            const pcFrame = document.getElementById('modalPc');
            if (!phoneFrame || !pcFrame) return;

            this.phone = setupDevice(phoneFrame, {
                iframe: document.getElementById('modalPhoneIframe'),
                logo: document.getElementById('modalPhoneLogo'),
                closingClass: 'phone-closing',
                fadeClass: 'logo-fade-in'
            });

            this.pc = setupDevice(pcFrame, {
                iframe: document.getElementById('modalPcIframe'),
                logo: document.getElementById('modalPcLogo'),
                closingClass: 'pc-closing',
                fadeClass: 'pc-logo-fade-in'
            });
        },

        reset() {
            const phoneFrame = document.getElementById('modalPhone');
            const pcFrame = document.getElementById('modalPc');
            const phoneIframe = document.getElementById('modalPhoneIframe');
            const pcIframe = document.getElementById('modalPcIframe');

            [phoneFrame, pcFrame].forEach((f) => {
                if (!f) return;
                f.classList.remove('active', 'phone-closing', 'pc-closing');
            });
            [phoneIframe, pcIframe].forEach((ifr) => {
                if (ifr) {
                    ifr.src = 'about:blank';
                    ifr.removeAttribute('src');
                }
            });
        },

        setProject(data) {
            const url = data.url;
            const logo = data.logo;
            const darkLogo = data.darkLogo;

            const phoneFrame = document.getElementById('modalPhone');
            const pcFrame = document.getElementById('modalPc');
            const phoneLogo = document.getElementById('modalPhoneLogo');
            const pcLogo = document.getElementById('modalPcLogo');
            const phoneIframe = document.getElementById('modalPhoneIframe');
            const pcIframe = document.getElementById('modalPcIframe');

            phoneFrame.dataset.projectUrl = url;
            pcFrame.dataset.projectUrl = url;
            phoneIframe.setAttribute('data-src', url);
            pcIframe.setAttribute('data-src', url);
            phoneLogo.src = logo;
            pcLogo.src = logo;
            phoneLogo.alt = data.title;
            pcLogo.alt = data.title;

            phoneFrame.classList.toggle('dark-logo', darkLogo);
            pcFrame.classList.toggle('dark-logo', darkLogo);
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        window.DevicePreview.init();
    });
})();
