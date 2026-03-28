import { Injectable } from '@angular/core';
import { Imovel } from '../modelos/imovel';

@Injectable({
  providedIn: 'root'
})
export class ImoveisService {

  private imoveis: Imovel[] = [
    {
      id: 1,
      titulo: 'Apartamento Moderno',
      bairro: 'Savassi',
      cidade: 'Belo Horizonte',
      preco: 770000,
      area: 85,
      suites: 3,
      banheiros: 2,
      vagas: 2,
      tipo: 'apartamento',
      finalidade: 'venda',
      destaque: false,
      novo: true,
      descricao: 'Lindo apartamento no coração da Savassi com acabamento de alto padrão.',
      imagens: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      ]
    },
    {
      id: 2,
      titulo: 'Cobertura Skyline',
      bairro: 'Lourdes',
      cidade: 'Belo Horizonte',
      preco: 2200000,
      area: 280,
      suites: 4,
      banheiros: 4,
      vagas: 3,
      tipo: 'cobertura',
      finalidade: 'venda',
      destaque: true,
      novo: false,
      descricao: 'Cobertura duplex com vista panorâmica e piscina privativa.',
      imagens: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ]
    },
    {
      id: 3,
      titulo: 'Casa no Belvedere',
      bairro: 'Belvedere',
      cidade: 'Belo Horizonte',
      preco: 3500000,
      area: 450,
      suites: 5,
      banheiros: 6,
      vagas: 4,
      tipo: 'casa',
      finalidade: 'venda',
      destaque: false,
      novo: false,
      descricao: 'Magnífica residência com jardim, piscina e churrasqueira.',
      imagens: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800',
      ]
    },
    {
      id: 4,
      titulo: 'Studio Pampulha',
      bairro: 'Pampulha',
      cidade: 'Belo Horizonte',
      preco: 3200,
      area: 38,
      suites: 1,
      banheiros: 1,
      vagas: 1,
      tipo: 'apartamento',
      finalidade: 'aluguel',
      destaque: false,
      novo: true,
      descricao: 'Studio completo e mobiliado próximo à UFMG.',
      imagens: [
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
      ]
    }
  ];

  listarTodos(): Imovel[] {
    return this.imoveis;
  }

  buscarPorId(id: number): Imovel | undefined {
    return this.imoveis.find(i => i.id === id);
  }

}
