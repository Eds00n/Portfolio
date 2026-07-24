import { useRef, useState } from 'react';
import Model from 'react-body-highlighter';
import { DEFAULT_GRUPO, GRUPOS_ORDER, TREINO_POR_DIA } from '../data/treinoPorDia';

const INK = '#1a1a1a';
const BODY_IDLE = 'rgba(26, 26, 26, 0.12)';
const ANIM_MS = 300;

/** @param {string} from @param {string} to */
function getDirection(from, to) {
  const oldIdx = GRUPOS_ORDER.indexOf(from);
  const newIdx = GRUPOS_ORDER.indexOf(to);
  return newIdx > oldIdx ? 'next' : 'prev';
}

/** @param {string} from @param {string} to */
function isViewFlip(from, to) {
  return TREINO_POR_DIA[from].type !== TREINO_POR_DIA[to].type;
}

export function TreinoDoDia() {
  const [grupoAtivo, setGrupoAtivo] = useState(DEFAULT_GRUPO);
  const [displayGrupo, setDisplayGrupo] = useState(DEFAULT_GRUPO);
  const [modelAnim, setModelAnim] = useState('');
  const [listAnim, setListAnim] = useState('');
  const busyRef = useRef(false);

  const grupo = TREINO_POR_DIA[displayGrupo];

  function runAfter(ms, fn) {
    window.setTimeout(fn, ms);
  }

  function clearAnims() {
    setModelAnim('');
    setListAnim('');
    busyRef.current = false;
  }

  function selectGrupo(id) {
    if (id === grupoAtivo || busyRef.current) return;

    const dir = getDirection(grupoAtivo, id);
    const flip = isViewFlip(grupoAtivo, id);
    const outAnim = flip ? `flip-out-${dir}` : `slide-out-${dir}`;
    const inAnim = flip ? `flip-in-${dir}` : `slide-in-${dir}`;

    busyRef.current = true;
    setGrupoAtivo(id);
    setModelAnim(outAnim);
    setListAnim(`slide-out-${dir}`);

    runAfter(ANIM_MS, () => {
      setDisplayGrupo(id);
      setModelAnim(inAnim);
      setListAnim(`slide-in-${dir}`);
      runAfter(ANIM_MS, clearAnims);
    });
  }

  return (
    <div className="treino-do-dia">
      <div className="treino-do-dia__tabs" role="tablist" aria-label="Grupo muscular do dia">
        {GRUPOS_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={grupoAtivo === id}
            className={`treino-do-dia__tab${grupoAtivo === id ? ' is-active' : ''}`}
            onClick={() => selectGrupo(id)}
          >
            {TREINO_POR_DIA[id].label}
          </button>
        ))}
      </div>

      <div className="treino-do-dia__body">
        <figure className="treino-do-dia__figure">
          <div className="treino-do-dia__model-viewport">
            <div
              className={`treino-do-dia__model-panel${modelAnim ? ` ${modelAnim}` : ''}`}
              aria-label={`Músculos destacados: ${grupo.label}`}
              aria-live="polite"
            >
              <div className="treino-do-dia__model">
                <Model
                  key={`${displayGrupo}-${grupo.type}`}
                  type={grupo.type}
                  data={grupo.modelData}
                  bodyColor={BODY_IDLE}
                  highlightedColors={[INK]}
                  style={{
                    width: '9.5rem',
                    padding: 0,
                    margin: '0 auto',
                    background: 'transparent',
                    boxShadow: 'none',
                  }}
                  svgStyle={{ background: 'transparent' }}
                />
              </div>
            </div>
          </div>
        </figure>

        <div className="treino-do-dia__exercises">
          <p className="treino-do-dia__exercises-label">Exercícios de hoje</p>
          <div className="treino-do-dia__list-viewport">
            <ul
              className={`treino-do-dia__list${listAnim ? ` ${listAnim}` : ''}`}
              role="list"
              aria-live="polite"
            >
              {grupo.exercicios.map((ex) => (
                <li key={`${displayGrupo}-${ex.nome}`} className="treino-do-dia__item">
                  <span className="treino-do-dia__item-name">{ex.nome}</span>
                  <span className="treino-do-dia__item-eq"> — {ex.equipamento}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
