export interface Imovel {
  id: number;
  titulo: string;
  bairro: string;
  cidade: string;
  preco: number;
  area: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  tipo: 'apartamento' | 'casa' | 'cobertura';
  finalidade: 'venda' | 'aluguel' | 'diaria';
  destaque: boolean;
  novo: boolean;
  imagens: string[];
  descricao: string;
}