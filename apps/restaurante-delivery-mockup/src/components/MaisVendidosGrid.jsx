import { memo, useCallback, useMemo, useState } from 'react';
import { DeliveryImage } from './DeliveryImage';
import { IconPlus, IconStar } from './icons';

/**
 * @param {{ produto: { id: string; nome: string; rating: number; preco: string; image: string; imageAlt?: string } }} props
 */
const ProductCard = memo(function ProductCard({ produto }) {
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback(() => {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 380);
  }, []);

  return (
    <article className="delivery-product-card group overflow-hidden rounded-lg border border-ink/12 bg-cream transition-shadow duration-300 hover:shadow-sm">
      <div className="relative aspect-4/3 overflow-hidden bg-cream-dark">
        <DeliveryImage
          src={produto.image}
          alt={produto.imageAlt ?? produto.nome}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 640px) 25vw, 50vw"
        />
        <button
          type="button"
          className={[
            'delivery-tap absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 bg-cream text-ink shadow-sm hover:scale-105 hover:border-ink/25',
            added ? 'delivery-pop' : '',
          ].join(' ')}
          aria-label={`Adicionar ${produto.nome}`}
          onClick={handleAdd}
        >
          <IconPlus className="h-4 w-4" />
        </button>
      </div>

      <div className="p-2.5 sm:p-3">
        <p className="truncate text-xs font-bold text-ink sm:text-[13px]">{produto.nome}</p>
        <div className="mt-1 flex items-center justify-between gap-1">
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-ink-muted">
            <IconStar className="h-3 w-3 text-accent" />
            {produto.rating}
          </span>
          <span className="text-xs font-black text-ink">{produto.preco}</span>
        </div>
      </div>
    </article>
  );
});

export const MaisVendidosGrid = memo(function MaisVendidosGrid({
  titulo,
  produtos,
  panelAnim = '',
  titleAnim = '',
}) {
  const gridClass = useMemo(
    () => [
      'mx-auto grid gap-3',
      produtos.length >= 4
        ? 'max-w-md grid-cols-2 sm:max-w-3xl sm:grid-cols-4'
        : 'max-w-md grid-cols-2 sm:max-w-xl sm:grid-cols-3',
    ].join(' '),
    [produtos.length],
  );

  return (
    <section className="mt-6" aria-labelledby="produtos-heading">
      <h3
        id="produtos-heading"
        className={['delivery-section-heading text-center text-sm font-black uppercase tracking-wide text-ink', titleAnim].join(' ')}
      >
        {titulo}
      </h3>

      <div className="delivery-grid-viewport">
        <div className={panelAnim}>
          {produtos.length === 0 ? (
            <p className="text-center text-sm text-ink-muted">Nenhum item nesta categoria.</p>
          ) : (
            <div className={gridClass}>
              {produtos.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
