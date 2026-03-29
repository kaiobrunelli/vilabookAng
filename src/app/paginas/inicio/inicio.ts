import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { CardImovel } from '../../componentes/card-imovel/card-imovel';
import { ImoveisService } from '../../servicos/imoveis';
import { Imovel } from '../../modelos/imovel';

type Filtro = 'todos' | 'venda' | 'aluguel';

@Component({
  selector: 'app-inicio',
  imports: [Cabecalho, CardImovel, FormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  private imoveisService = inject(ImoveisService);

  termoBusca = '';
  filtroAtivo: Filtro = 'todos';
  imoveis: Imovel[] = [];

  constructor() {
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    let resultado = this.imoveisService.listarTodos();

    // Filtra por finalidade
    if (this.filtroAtivo !== 'todos') {
      resultado = resultado.filter(i => i.finalidade === this.filtroAtivo);
    }

    // Filtra por termo de busca
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(i =>
        i.titulo.toLowerCase().includes(termo) ||
        i.bairro.toLowerCase().includes(termo) ||
        i.cidade.toLowerCase().includes(termo) ||
        i.tipo.toLowerCase().includes(termo)
      );
    }

    this.imoveis = resultado;
  }

  alterarFiltro(filtro: Filtro): void {
    this.filtroAtivo = filtro;
    this.aplicarFiltro();
  }

  onBuscar(): void {
    this.aplicarFiltro();
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.aplicarFiltro();
  }

  get totalResultados(): number {
    return this.imoveis.length;
  }
}