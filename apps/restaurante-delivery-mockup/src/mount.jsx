import { createRoot } from 'react-dom/client';
import { RestauranteDeliveryMockup } from './components/RestauranteDeliveryMockup';
import './index.css';

/** @type {WeakMap<HTMLElement, import('react-dom/client').Root>} */
const roots = new WeakMap();

/**
 * Monta <RestauranteDeliveryMockup /> no container (modal Restaurante & Delivery).
 * @param {HTMLElement | null} container
 */
export function mountRestauranteDeliveryMockup(container) {
  if (!container) return;

  unmountRestauranteDeliveryMockup(container);

  const root = createRoot(container, {
    onUncaughtError: (error) => console.error('Restaurante Delivery:', error),
  });
  roots.set(container, root);
  root.render(<RestauranteDeliveryMockup />);
}

/**
 * @param {HTMLElement | null} container
 */
export function unmountRestauranteDeliveryMockup(container) {
  if (!container) return;

  const root = roots.get(container);
  if (!root) return;

  root.unmount();
  roots.delete(container);
  container.innerHTML = '';
}
