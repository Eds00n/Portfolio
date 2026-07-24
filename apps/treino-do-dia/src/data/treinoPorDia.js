/**
 * Dados editáveis — modelo (react-body-highlighter) + lista exibida ao aluno.
 * muscles: ver README da lib (chest, upper-back, quadriceps, etc.)
 */

export const GRUPOS_ORDER = ['peito', 'costas', 'perna', 'ombro', 'braco'];

/** @type {Record<string, {
 *   label: string;
 *   type: 'anterior' | 'posterior';
 *   modelData: { name: string; muscles: string[] }[];
 *   exercicios: { nome: string; equipamento: string }[];
 * }>} */
export const TREINO_POR_DIA = {
  peito: {
    label: 'Peito',
    type: 'anterior',
    modelData: [
      { name: 'Supino reto', muscles: ['chest', 'triceps', 'front-deltoids'] },
    ],
    exercicios: [
      { nome: 'Supino reto', equipamento: 'barra' },
      { nome: 'Crucifixo', equipamento: 'halteres' },
      { nome: 'Crossover', equipamento: 'cabo' },
    ],
  },
  costas: {
    label: 'Costas',
    type: 'posterior',
    modelData: [
      { name: 'Puxada frontal', muscles: ['upper-back', 'biceps', 'trapezius'] },
    ],
    exercicios: [
      { nome: 'Puxada frontal', equipamento: 'barra fixa' },
      { nome: 'Remada curvada', equipamento: 'barra' },
      { nome: 'Pulldown', equipamento: 'cabo' },
    ],
  },
  perna: {
    label: 'Perna',
    type: 'anterior',
    modelData: [
      { name: 'Agachamento', muscles: ['quadriceps', 'gluteal', 'hamstring'] },
    ],
    exercicios: [
      { nome: 'Agachamento livre', equipamento: 'barra' },
      { nome: 'Leg press', equipamento: 'máquina' },
      { nome: 'Cadeira extensora', equipamento: 'máquina' },
    ],
  },
  ombro: {
    label: 'Ombro',
    type: 'anterior',
    modelData: [
      { name: 'Desenvolvimento', muscles: ['front-deltoids', 'back-deltoids', 'trapezius'] },
    ],
    exercicios: [
      { nome: 'Desenvolvimento', equipamento: 'halteres' },
      { nome: 'Elevação lateral', equipamento: 'halteres' },
      { nome: 'Face pull', equipamento: 'cabo' },
    ],
  },
  braco: {
    label: 'Braço',
    type: 'anterior',
    modelData: [
      { name: 'Rosca direta', muscles: ['biceps', 'triceps', 'forearm'] },
    ],
    exercicios: [
      { nome: 'Rosca direta', equipamento: 'barra W' },
      { nome: 'Tríceps corda', equipamento: 'cabo' },
      { nome: 'Rosca martelo', equipamento: 'halteres' },
    ],
  },
};

export const DEFAULT_GRUPO = 'peito';
