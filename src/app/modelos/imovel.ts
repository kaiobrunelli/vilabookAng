export interface Imovel {
  id: string;
  titulo: string;
  bairro: string;
  cidade: string;
    estado: string; // ← adiciona aqui
  preco: number;
  area: number;
  quartos: number;
  suites: number;
  banheiros: number;
   categoria: 'imovel' | 'pousada'; // ← novo campo
  vagas: number;
  tipo: 'apartamento' | 'casa' | 'cobertura';
  finalidade: 'venda' | 'aluguel' | 'diaria';
  destaque: boolean;
  novo: boolean;
  imagens: string[];
  descricao: string;
}
export interface Reserva {
  id?: string;
  imovel_id: string;
  hospede_id: string;
  data_inicio: string; // 'YYYY-MM-DD'
  data_fim: string;
  valor_total: number;
  status: 'pendente' | 'confirmada' | 'cancelada';
  criado_em?: string;
}