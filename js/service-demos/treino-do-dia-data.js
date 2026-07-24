/**
 * Dados do bloco "Treino do Dia" — editar exercícios por grupo aqui.
 * @typedef {{ nome: string, equipamento: string }} Exercicio
 * @typedef {{ id: string, label: string, musculo: string, regions: string[], exercicios: Exercicio[] }} GrupoMuscular
 */

/** @type {Record<string, GrupoMuscular>} */
export const TREINO_DO_DIA_DATA = {
    peito: {
        id: 'peito',
        label: 'Peito',
        musculo: 'chest',
        regions: ['torso-upper'],
        exercicios: [
            { nome: 'Supino reto', equipamento: 'barra' },
            { nome: 'Crucifixo', equipamento: 'halteres' },
            { nome: 'Crossover', equipamento: 'cabo' },
        ],
    },
    costas: {
        id: 'costas',
        label: 'Costas',
        musculo: 'back',
        regions: ['torso-upper'],
        exercicios: [
            { nome: 'Puxada frontal', equipamento: 'barra fixa' },
            { nome: 'Remada curvada', equipamento: 'barra' },
            { nome: 'Pulldown', equipamento: 'cabo' },
        ],
    },
    perna: {
        id: 'perna',
        label: 'Perna',
        musculo: 'legs',
        regions: ['leg-l', 'leg-r'],
        exercicios: [
            { nome: 'Agachamento livre', equipamento: 'barra' },
            { nome: 'Leg press', equipamento: 'máquina' },
            { nome: 'Cadeira extensora', equipamento: 'máquina' },
        ],
    },
    ombro: {
        id: 'ombro',
        label: 'Ombro',
        musculo: 'shoulders',
        regions: ['shoulder-l', 'shoulder-r'],
        exercicios: [
            { nome: 'Desenvolvimento', equipamento: 'halteres' },
            { nome: 'Elevação lateral', equipamento: 'halteres' },
            { nome: 'Face pull', equipamento: 'cabo' },
        ],
    },
    braco: {
        id: 'braco',
        label: 'Braço',
        musculo: 'arms',
        regions: ['arm-l', 'arm-r'],
        exercicios: [
            { nome: 'Rosca direta', equipamento: 'barra W' },
            { nome: 'Tríceps corda', equipamento: 'cabo' },
            { nome: 'Rosca martelo', equipamento: 'halteres' },
        ],
    },
};

export const TREINO_DO_DIA_ORDER = ['peito', 'costas', 'perna', 'ombro', 'braco'];

export const TREINO_DO_DIA_DEFAULT = 'peito';
