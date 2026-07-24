import { memo, useCallback, useMemo, useState } from 'react';
import { HeroPromo } from './HeroPromo';
import { CategoriasGrid } from './CategoriasGrid';
import { MaisVendidosGrid } from './MaisVendidosGrid';
import { produtosPorCategoria, tituloSecaoProdutos } from '../data/mockData';
import { useCategoriaTransition } from '../hooks/useCategoriaTransition';

export const RestauranteDeliveryMockup = memo(function RestauranteDeliveryMockup() {
  const {
    categoriaAtiva,
    displayCategoria,
    panelAnim,
    titleAnim,
    handleCategoriaClick,
    handleVerTodas,
  } = useCategoriaTransition();

  const produtosVisiveis = useMemo(
    () => produtosPorCategoria(displayCategoria),
    [displayCategoria],
  );

  const tituloSecao = useMemo(
    () => tituloSecaoProdutos(displayCategoria),
    [displayCategoria],
  );

  return (
    <div className="delivery-mockup">
      <HeroPromo />
      <div className="mt-6 sm:mt-8">
        <CategoriasGrid
          categoriaAtiva={categoriaAtiva}
          onCategoriaClick={handleCategoriaClick}
          onVerTodas={handleVerTodas}
        />
        <MaisVendidosGrid
          titulo={tituloSecao}
          produtos={produtosVisiveis}
          panelAnim={panelAnim}
          titleAnim={titleAnim}
        />
      </div>
    </div>
  );
});
