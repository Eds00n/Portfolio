import { memo } from 'react';
import { categorias } from '../data/mockData';
import { DeliveryImage } from './DeliveryImage';

export const CategoriasGrid = memo(function CategoriasGrid({
  categoriaAtiva,
  onCategoriaClick,
  onVerTodas,
}) {
  return (
    <section aria-labelledby="categorias-heading">
      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <span aria-hidden="true" />
        <h3 id="categorias-heading" className="text-sm font-black uppercase tracking-wide text-ink">
          Categorias
        </h3>
        <button
          type="button"
          className={[
            'delivery-btn-link delivery-tap justify-self-end text-xs font-semibold transition-colors duration-200 hover:underline',
            categoriaAtiva ? 'text-accent' : 'text-ink-muted',
          ].join(' ')}
          onClick={onVerTodas}
        >
          Ver todas
        </button>
      </div>

      <div
        className="mx-auto grid max-w-xl grid-cols-3 gap-x-2 gap-y-4 sm:max-w-2xl sm:grid-cols-6"
        role="tablist"
        aria-label="Filtrar por categoria"
      >
        {categorias.map((cat) => {
          const ativo = categoriaAtiva === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={ativo}
              className={[
                'delivery-tap group flex flex-col items-center gap-2 text-center transition-transform duration-300',
                ativo ? 'scale-105' : 'hover:scale-[1.03]',
              ].join(' ')}
              onClick={() => onCategoriaClick(cat.id)}
            >
              <span
                className={[
                  'relative h-14 w-14 overflow-hidden rounded-full border bg-cream transition-all duration-300 sm:h-16 sm:w-16',
                  ativo
                    ? 'border-ink shadow-sm ring-2 ring-ink/15'
                    : 'border-ink/12 group-hover:border-ink/30',
                ].join(' ')}
              >
                <DeliveryImage
                  src={cat.image}
                  alt={cat.imageAlt ?? cat.label}
                  className={[
                    'h-full w-full object-cover transition-transform duration-300',
                    ativo ? 'scale-110' : 'group-hover:scale-105',
                  ].join(' ')}
                  sizes="64px"
                />
              </span>
              <span
                className={[
                  'text-[10px] font-semibold leading-tight transition-colors duration-300 sm:text-[11px]',
                  ativo ? 'text-ink' : 'text-ink-muted group-hover:text-ink/80',
                ].join(' ')}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
});
