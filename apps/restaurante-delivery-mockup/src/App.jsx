import { RestauranteDeliveryMockup } from './components/RestauranteDeliveryMockup';

export default function App() {
  return (
    <div className="min-h-screen bg-[#e8e4df] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#888]">
          Preview — não integrado ao modal ainda
        </p>

        {/* Simula o contexto do modal */}
        <div className="rounded-3xl border border-[#1a1a1a]/10 bg-[#f5f2ed] p-6 sm:p-8">
          <header className="mb-6 border-b border-[#1a1a1a]/8 pb-6">
            <span className="inline-block rounded-full border border-[#1a1a1a]/20 bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#666]">
              Operação ao vivo
            </span>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-[#1a1a1a] sm:text-3xl">
              Cardápio claro e pedido fácil
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#666]">
              Cardápio digital legível no celular: pratos do dia, fotos apetitosas e pedido em um toque — delivery ou mesa.
            </p>
          </header>

          <section>
            <h2 className="text-xs font-black uppercase tracking-wide text-[#1a1a1a]">
              App de delivery
            </h2>
            <p className="mb-4 mt-1 text-sm text-[#666]">
              Experiência de pedido com promoções, categorias e mais vendidos — tudo na palma da mão.
            </p>

            <RestauranteDeliveryMockup />
          </section>
        </div>
      </div>
    </div>
  );
}
