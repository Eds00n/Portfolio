import { memo, useCallback, useState } from 'react';
import { heroPromo } from '../data/mockData';
import { DeliveryImage } from './DeliveryImage';
import { IconCart } from './icons';

export const HeroPromo = memo(function HeroPromo() {
  const [ordered, setOrdered] = useState(false);

  const handlePedir = useCallback(() => {
    setOrdered(true);
    window.setTimeout(() => setOrdered(false), 400);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-lg border border-ink/12 bg-cream-dark">
      <div className="relative z-10 flex min-h-[210px] flex-col justify-center px-5 py-7 sm:min-h-[230px] sm:px-7 sm:py-9 lg:max-w-[55%] lg:px-8">
        <div className="delivery-hero__content">
          <span className="delivery-hero__badge rounded-full border border-ink/15 bg-cream text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            {heroPromo.badge}
          </span>

          <div className="delivery-hero__copy">
            <h2 className="delivery-hero__title text-2xl font-black uppercase text-ink sm:text-[1.75rem]">
              <span className="delivery-hero__title-line">{heroPromo.title[0]}</span>
              <span className="delivery-hero__title-line">{heroPromo.title[1]}</span>
            </h2>

            <p className="delivery-hero__description text-xs text-ink-muted sm:text-[13px]">
              {heroPromo.description}
            </p>
          </div>

          <div className="delivery-hero__actions">
            <div className="delivery-hero__pricing">
              <span className="text-sm text-ink-muted/60 line-through">{heroPromo.priceOld}</span>
              <span className="text-xl font-black text-ink">{heroPromo.priceCurrent}</span>
            </div>

            <button
              type="button"
              className={[
                'delivery-btn-primary delivery-tap border border-ink bg-ink text-xs font-bold uppercase tracking-wide text-cream transition-all duration-200 hover:bg-ink/90 hover:scale-[1.02]',
                ordered ? 'delivery-pop bg-accent border-accent' : '',
              ].join(' ')}
              onClick={handlePedir}
            >
              <IconCart className="h-4 w-4 shrink-0" />
              Pedir agora
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 w-[48%] sm:w-[44%]">
        <DeliveryImage
          src={heroPromo.image}
          alt={heroPromo.imageAlt ?? ''}
          className="h-full w-full object-cover object-center"
          priority
          sizes="(min-width: 640px) 44vw, 48vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-cream-dark via-cream-dark/85 to-transparent" />
      </div>

      <div className="absolute bottom-3 right-4 z-20 flex gap-1.5" aria-hidden>
        <span className="h-1.5 w-4 rounded-full bg-ink" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
      </div>
    </section>
  );
});
