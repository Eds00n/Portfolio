/**
 * <BonecoMuscular grupoAtivo="peito" />
 * Silhueta frontal minimalista — região ativa preenchida em preto.
 */

/** @type {Record<string, { d: string, type?: 'circle' | 'rect' }>} */
export const BONECO_PARTS = {
    'leg-l': { d: 'M 50 148 L 44 228 L 54 230 L 60 150 Z' },
    'leg-r': { d: 'M 70 148 L 66 230 L 76 228 L 70 150 Z' },
    'torso-lower': { d: 'M 48 132 L 72 132 L 68 148 L 52 148 Z' },
    'torso-upper': { d: 'M 44 96 L 76 96 L 80 50 L 40 50 Z' },
    'arm-l': { d: 'M 40 50 L 18 118 L 26 122 L 44 62 Z' },
    'arm-r': { d: 'M 80 50 L 102 118 L 94 122 L 76 62 Z' },
    'shoulder-l': { d: 'M 40 50 L 46 62 L 52 54 L 48 46 Z' },
    'shoulder-r': { d: 'M 80 50 L 74 62 L 68 54 L 72 46 Z' },
    neck: { d: 'M 54 38 L 66 38 L 64 50 L 56 50 Z' },
    head: { d: 'M 60 24 m -14 0 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0', type: 'circle' },
};

/** Partes sempre só contorno (nunca destacadas por grupo). */
const BONECO_STATIC = ['head', 'neck', 'torso-lower'];

/** Ordem de pintura (atrás → frente). */
const BONECO_RENDER_ORDER = [
    'leg-l', 'leg-r', 'torso-lower', 'torso-upper',
    'arm-l', 'arm-r', 'shoulder-l', 'shoulder-r', 'neck', 'head',
];

/**
 * @param {string} grupoAtivo
 * @param {import('./treino-do-dia-data.js').GrupoMuscular} grupoData
 */
function getActiveRegions(grupoAtivo, grupoData) {
    return new Set(grupoData?.regions ?? []);
}

/**
 * @param {SVGElement} svg
 * @param {string} grupoAtivo
 * @param {Record<string, import('./treino-do-dia-data.js').GrupoMuscular>} data
 */
export function renderBonecoMuscular(svg, grupoAtivo, data) {
    const grupo = data[grupoAtivo];
    const active = getActiveRegions(grupoAtivo, grupo);

    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 120 260');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `Silhueta corporal — grupo muscular: ${grupo?.label ?? grupoAtivo}`);

    BONECO_RENDER_ORDER.forEach((partId) => {
        const part = BONECO_PARTS[partId];
        if (!part) return;

        const isActive = active.has(partId);
        const isStatic = BONECO_STATIC.includes(partId);

        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('d', part.d);
        el.setAttribute('data-region', partId);
        el.classList.add('boneco-muscular__part');

        if (isActive) {
            el.classList.add('boneco-muscular__part--active');
        } else if (isStatic) {
            el.classList.add('boneco-muscular__part--static');
        } else {
            el.classList.add('boneco-muscular__part--idle');
        }

        svg.appendChild(el);
    });
}

/**
 * @param {string} [grupoAtivo='peito']
 * @returns {SVGElement}
 */
export function createBonecoMuscularSvg(grupoAtivo = 'peito') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('boneco-muscular__svg');
    return svg;
}
