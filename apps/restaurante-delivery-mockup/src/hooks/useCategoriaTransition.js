import { useCallback, useEffect, useRef, useState } from 'react';
import { categorias } from '../data/mockData';

const ANIM_MS = 280;
const CATEGORIA_ORDER = categorias.map((cat) => cat.id);

/**
 * @param {'next' | 'prev'} direction
 */
function getDirection(from, to) {
  if (from === to) return 'next';

  if (from === null) return 'next';
  if (to === null) return 'prev';

  const oldIdx = CATEGORIA_ORDER.indexOf(from);
  const newIdx = CATEGORIA_ORDER.indexOf(to);

  if (oldIdx === -1 || newIdx === -1) return 'next';
  return newIdx > oldIdx ? 'next' : 'prev';
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useCategoriaTransition() {
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [displayCategoria, setDisplayCategoria] = useState(null);
  const [panelAnim, setPanelAnim] = useState('');
  const [titleAnim, setTitleAnim] = useState('');
  const busyRef = useRef(false);
  const categoriaAtivaRef = useRef(null);
  const timersRef = useRef([]);

  categoriaAtivaRef.current = categoriaAtiva;

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const queueTimeout = useCallback((fn, delay) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const selectCategoria = useCallback((next) => {
    if (next === categoriaAtivaRef.current || busyRef.current) return;

    if (prefersReducedMotion()) {
      setCategoriaAtiva(next);
      setDisplayCategoria(next);
      return;
    }

    const direction = getDirection(categoriaAtivaRef.current, next);

    busyRef.current = true;
    setCategoriaAtiva(next);
    setPanelAnim(`delivery-slide-out-${direction}`);
    setTitleAnim('delivery-title-out');

    queueTimeout(() => {
      setDisplayCategoria(next);
      setPanelAnim(`delivery-slide-in-${direction}`);
      setTitleAnim('delivery-title-in');

      queueTimeout(() => {
        setPanelAnim('');
        setTitleAnim('');
        busyRef.current = false;
      }, ANIM_MS);
    }, ANIM_MS);
  }, [queueTimeout]);

  const handleCategoriaClick = useCallback(
    (categoriaId) => {
      selectCategoria(categoriaAtivaRef.current === categoriaId ? null : categoriaId);
    },
    [selectCategoria],
  );

  const handleVerTodas = useCallback(() => {
    selectCategoria(null);
  }, [selectCategoria]);

  return {
    categoriaAtiva,
    displayCategoria,
    panelAnim,
    titleAnim,
    handleCategoriaClick,
    handleVerTodas,
  };
}
