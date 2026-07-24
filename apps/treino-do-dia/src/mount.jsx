import { createRoot } from 'react-dom/client';
import { TreinoDoDia } from './components/TreinoDoDia';
import './styles/treino-do-dia-widget.css';

/** @type {WeakMap<HTMLElement, import('react-dom/client').Root>} */
const roots = new WeakMap();

/**
 * Monta <TreinoDoDia /> no container (modal Personal & Fitness).
 * @param {HTMLElement | null} container
 */
export function mountTreinoDoDia(container) {
  if (!container) return;

  unmountTreinoDoDia(container);

  const root = createRoot(container);
  roots.set(container, root);
  root.render(<TreinoDoDia />);
}

/**
 * @param {HTMLElement | null} container
 */
export function unmountTreinoDoDia(container) {
  if (!container) return;

  const root = roots.get(container);
  if (!root) return;

  root.unmount();
  roots.delete(container);
  container.innerHTML = '';
}
