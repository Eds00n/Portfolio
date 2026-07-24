/** Caminhos relativos à raiz do portfólio — imagens em assets/restaurante/ */
const img = (file) => `assets/restaurante/${file}`;

export const navItems = [
  { id: 'inicio', label: 'Início', active: true },
  { id: 'cardapio', label: 'Cardápio' },
  { id: 'promocoes', label: 'Promoções' },
  { id: 'pedidos', label: 'Meus pedidos' },
  { id: 'favoritos', label: 'Favoritos' },
  { id: 'avaliacoes', label: 'Avaliações' },
];

export const heroPromo = {
  badge: 'Promoção do dia',
  title: ['Combo X-Burger', 'Especial'],
  description: 'Dois burgers artesanais, bacon crocante, queijo cheddar, batata frita e refri 350 ml.',
  priceOld: 'R$ 49,90',
  priceCurrent: 'R$ 34,90',
  image: img('hero-burger.jpg'),
  imageAlt: 'Combo X-Burger com batata frita',
};

export const categorias = [
  { id: 'hamburguer', label: 'Hambúrguer', image: img('cat-hamburger.jpg'), imageAlt: 'Hambúrguer artesanal' },
  { id: 'lanches', label: 'Lanches', image: img('cat-lanche.jpg'), imageAlt: 'Lanche com batata' },
  { id: 'pizzas', label: 'Pizzas', image: img('cat-pizza.jpg'), imageAlt: 'Pizza fatia' },
  { id: 'massas', label: 'Massas', image: img('cat-pasta.jpg'), imageAlt: 'Massa ao molho' },
  { id: 'bebidas', label: 'Bebidas', image: img('cat-drink.jpg'), imageAlt: 'Bebida gelada' },
  { id: 'sobremesas', label: 'Sobremesas', image: img('cat-dessert.jpg'), imageAlt: 'Sobremesa' },
];

/** @typedef {{ id: string; nome: string; categoria: string; rating: number; preco: string; image: string; imageAlt: string }} Produto */

/** @type {Produto[]} */
export const produtos = [
  {
    id: '1',
    nome: 'X-Bacon Premium',
    categoria: 'hamburguer',
    rating: 4.9,
    preco: 'R$ 28,90',
    image: img('prod-burger.jpg'),
    imageAlt: 'X-Bacon Premium',
  },
  {
    id: '2',
    nome: 'Smash Duplo',
    categoria: 'hamburguer',
    rating: 4.8,
    preco: 'R$ 32,00',
    image: img('prod-smash.jpg'),
    imageAlt: 'Smash burger duplo',
  },
  {
    id: '3',
    nome: 'Pizza Calabresa G',
    categoria: 'pizzas',
    rating: 4.8,
    preco: 'R$ 42,00',
    image: img('prod-pizza.jpg'),
    imageAlt: 'Pizza calabresa',
  },
  {
    id: '4',
    nome: 'Combo Kids',
    categoria: 'lanches',
    rating: 4.7,
    preco: 'R$ 24,90',
    image: img('prod-lanche.jpg'),
    imageAlt: 'Combo lanche kids',
  },
  {
    id: '5',
    nome: 'Espaguete Bolonhesa',
    categoria: 'massas',
    rating: 4.7,
    preco: 'R$ 36,50',
    image: img('cat-pasta.jpg'),
    imageAlt: 'Espaguete bolonhesa',
  },
  {
    id: '6',
    nome: 'Suco Natural 500 ml',
    categoria: 'bebidas',
    rating: 4.9,
    preco: 'R$ 12,90',
    image: img('cat-drink.jpg'),
    imageAlt: 'Suco natural',
  },
  {
    id: '7',
    nome: 'Refrigerante Lata',
    categoria: 'bebidas',
    rating: 4.6,
    preco: 'R$ 6,50',
    image: img('cat-drink.jpg'),
    imageAlt: 'Refrigerante lata',
  },
  {
    id: '8',
    nome: 'Brownie c/ Sorvete',
    categoria: 'sobremesas',
    rating: 4.9,
    preco: 'R$ 18,90',
    image: img('cat-dessert.jpg'),
    imageAlt: 'Brownie com sorvete',
  },
];

/** IDs exibidos na visão padrão "Mais vendidos" */
export const maisVendidosIds = ['1', '2', '3', '4'];

/** @deprecated use produtos */
export const maisVendidos = produtos.filter((p) => maisVendidosIds.includes(p.id));

export const cartSummary = {
  items: 3,
  total: 'R$ 62,80',
};

/**
 * @param {string | null} categoriaId
 * @returns {Produto[]}
 */
export function produtosPorCategoria(categoriaId) {
  if (!categoriaId) {
    return produtos.filter((p) => maisVendidosIds.includes(p.id));
  }
  return produtos.filter((p) => p.categoria === categoriaId);
}

/**
 * @param {string | null} categoriaId
 */
export function tituloSecaoProdutos(categoriaId) {
  if (!categoriaId) return 'Mais vendidos';
  return categorias.find((c) => c.id === categoriaId)?.label ?? 'Cardápio';
}
