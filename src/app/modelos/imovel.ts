export interface Imovel {
  id: number;
  titulo: string;
  bairro: string;
  cidade: string;
  preco: number;
  area: number;
  suites: number;
  banheiros: number;
  vagas: number;
  tipo: 'apartamento' | 'casa' | 'cobertura';
  finalidade: 'venda' | 'aluguel';
  destaque: boolean;
  novo: boolean;
  imagens: string[];
  descricao: string;
}