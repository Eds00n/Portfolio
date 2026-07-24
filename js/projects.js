/**
 * EC CODE — Showcase de projetos (RF01, RNF06)
 * Adicione novos projetos neste array; o grid e o modal são gerados automaticamente.
 */
window.EC_PROJECTS = [
    {
        id: 'ec-routine',
        title: 'EC Routine',
        subtitle: 'App web · Rotinas e produtividade',
        logo: 'assets/ec-routine-logo.svg',
        cover: null,
        coverAlt: 'Logo EC Routine',
        darkLogo: false,
        url: 'https://white-lark-769069.hostingersite.com/auth.html?view=login',
        hasPreview: true,
        directLink: false,
        caseStudy: {
            context: 'Pequenos negócios e profissionais autônomos precisavam de uma forma simples de organizar rotinas diárias sem depender de apps genéricos ou planilhas soltas.',
            stack: ['HTML', 'CSS', 'JavaScript', 'LocalStorage', 'UI responsiva'],
            challenge: 'Criar fluxo de login leve, telas claras no mobile e persistência de dados sem backend complexo na primeira versão.',
            solution: 'Interface focada em hábitos e tarefas recorrentes, com telas de autenticação enxutas, feedback visual imediato e layout adaptável a celular e desktop.',
            result: 'Produto funcional publicado online, usado como case de produto digital completo — da interface ao deploy.'
        }
    }
];

window.renderProjectCards = function renderProjectCards(container) {
    if (!container || !window.EC_PROJECTS?.length) return;

    container.innerHTML = window.EC_PROJECTS.map((project) => {
        const mediaClass = project.cover
            ? 'featured-work__media featured-work__media--cover'
            : 'featured-work__media featured-work__media--logo';
        const mediaContent = project.cover
            ? `<img src="${project.cover}" alt="${project.coverAlt || project.title}" loading="lazy" />`
            : `<img src="${project.logo}" alt="${project.coverAlt || project.title}" loading="lazy" />`;

        return `
            <a class="featured-work__card project-card" href="${project.url}"
                target="_blank" rel="noopener noreferrer"
                data-project-id="${project.id}"
                data-title="${project.title}"
                aria-label="Abrir site: ${project.title}">
                <div class="${mediaClass}">
                    ${mediaContent}
                </div>
                <div class="featured-work__meta">
                    <h3>${project.title}</h3>
                    <p>${project.subtitle}</p>
                </div>
            </a>
        `;
    }).join('');
};

window.getProjectById = function getProjectById(id) {
    return window.EC_PROJECTS.find((project) => project.id === id) || null;
};
