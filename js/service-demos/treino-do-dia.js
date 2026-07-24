/**
 * <TreinoDoDia /> — vanilla equivalent
 * Monta abas, boneco SVG e lista de exercícios com estado local.
 */

import {
    TREINO_DO_DIA_DATA,
    TREINO_DO_DIA_ORDER,
    TREINO_DO_DIA_DEFAULT,
} from './treino-do-dia-data.js';
import { createBonecoMuscularSvg, renderBonecoMuscular } from './boneco-muscular.js';

/**
 * @param {HTMLElement} container
 * @param {{ initialGrupo?: string }} [options]
 */
export function initTreinoDoDia(container, options = {}) {
    if (!container || container.dataset.treinoInitialized === 'true') return;

    let grupoAtivo = options.initialGrupo ?? TREINO_DO_DIA_DEFAULT;

    container.innerHTML = `
        <div class="treino-do-dia">
            <div class="treino-do-dia__tabs" role="tablist" aria-label="Grupo muscular do dia"></div>
            <div class="treino-do-dia__body">
                <figure class="treino-do-dia__figure" aria-hidden="false">
                    <div class="boneco-muscular" data-boneco-root></div>
                </figure>
                <div class="treino-do-dia__exercises">
                    <p class="treino-do-dia__exercises-label">Exercícios de hoje</p>
                    <ul class="treino-do-dia__list" role="list"></ul>
                </div>
            </div>
        </div>
    `;

    const tabsEl = container.querySelector('.treino-do-dia__tabs');
    const bonecoRoot = container.querySelector('[data-boneco-root]');
    const listEl = container.querySelector('.treino-do-dia__list');
    const svg = createBonecoMuscularSvg(grupoAtivo);
    bonecoRoot?.appendChild(svg);

    TREINO_DO_DIA_ORDER.forEach((id) => {
        const grupo = TREINO_DO_DIA_DATA[id];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'treino-do-dia__tab';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', id === grupoAtivo ? 'true' : 'false');
        btn.dataset.grupo = id;
        btn.textContent = grupo.label;
        if (id === grupoAtivo) btn.classList.add('is-active');
        btn.addEventListener('click', () => selectGrupo(id));
        tabsEl?.appendChild(btn);
    });

    function renderExercicios() {
        const grupo = TREINO_DO_DIA_DATA[grupoAtivo];
        if (!listEl || !grupo) return;

        listEl.classList.add('is-fading');
        window.requestAnimationFrame(() => {
            listEl.innerHTML = grupo.exercicios
                .map(
                    (ex) => `
                    <li class="treino-do-dia__item">
                        <span class="treino-do-dia__item-name">${ex.nome}</span>
                        <span class="treino-do-dia__item-eq">— ${ex.equipamento}</span>
                    </li>
                `
                )
                .join('');

            window.requestAnimationFrame(() => {
                listEl.classList.remove('is-fading');
            });
        });
    }

    function selectGrupo(id) {
        if (id === grupoAtivo || !TREINO_DO_DIA_DATA[id]) return;
        grupoAtivo = id;

        tabsEl?.querySelectorAll('.treino-do-dia__tab').forEach((tab) => {
            const isActive = tab.dataset.grupo === id;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        renderBonecoMuscular(svg, grupoAtivo, TREINO_DO_DIA_DATA);
        renderExercicios();
    }

    renderBonecoMuscular(svg, grupoAtivo, TREINO_DO_DIA_DATA);
    renderExercicios();

    container.dataset.treinoInitialized = 'true';
}
