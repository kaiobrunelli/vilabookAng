import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { CardImovel } from '../../componentes/card-imovel/card-imovel';
import { ImoveisService } from '../../servicos/imoveis';

type Filtro = 'todos' | 'venda' | 'aluguel';

@Component({
  selector: 'app-inicio',
  imports: [Cabecalho, CardImovel, FormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  private imoveisService = inject(ImoveisService);
  private cdr = inject(ChangeDetectorRef);  // ← novo

  termoBusca = '';
  filtroAtivo: Filtro = 'todos';
  todosImoveis: any[] = [];
  imoveis: any[] = [];
  carregando = true;
  erro = '';

  constructor() {
    this.carregarImoveis();
  }

  async carregarImoveis(): Promise<void> {
    this.carregando = true;

    const resultado = await this.imoveisService.listarTodos();
    this.todosImoveis = resultado ?? [];
    this.imoveis = [...this.todosImoveis];
    this.carregando = false;

    this.cdr.detectChanges();  // ← força o Angular a re-renderizar
  }

  aplicarFiltro(): void {
    let resultado = [...this.todosImoveis];

    if (this.filtroAtivo !== 'todos') {
      resultado = resultado.filter(i => i.finalidade === this.filtroAtivo);
    }

    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(i =>
        i.titulo.toLowerCase().includes(termo) ||
        i.bairro.toLowerCase().includes(termo) ||
        i.cidade.toLowerCase().includes(termo)
      );
    }

    this.imoveis = resultado;
    this.cdr.detectChanges();  // ← força re-renderizar ao filtrar
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