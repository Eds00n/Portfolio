import { navItems, cartSummary } from '../data/mockData';
import { IconCart, NavIcon } from './icons';

export function SidebarNav({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'z-40 flex w-[220px] shrink-0 flex-col bg-surface-sidebar px-4 py-5',
          'border-r border-white/5',
          'fixed inset-y-0 left-0 transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="mb-8 flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">Restaurante</p>
            <p className="text-lg font-black tracking-tight text-white">Sabor &amp; Arte</p>
          </div>
          <button
            type="button"
            className="rounded-full p-1.5 text-white/60 hover:bg-white/10 lg:hidden"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5" aria-label="Navegação principal">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={[
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                item.active
                  ? 'bg-accent/15 text-accent'
                  : 'text-white/55 hover:bg-white/5 hover:text-white/90',
              ].join(' ')}
            >
              <NavIcon id={item.id} className="h-[18px] w-[18px]" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/8 pt-4">
          <button
            type="button"
            className="w-full rounded-xl border border-white/15 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5"
          >
            Entrar
          </button>

          <div className="flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <IconCart className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] text-white/45">Carrinho</p>
                <p className="text-xs font-semibold text-white">{cartSummary.items} itens</p>
              </div>
            </div>
            <p className="text-sm font-bold text-accent">{cartSummary.total}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
