import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Imovel } from '../../modelos/imovel';

@Component({
  selector: 'app-card-imovel',
  imports: [],
  templateUrl: './card-imovel.html',
  styleUrl: './card-imovel.css',
})
export class CardImovel {
  @Input() imovel!: Imovel;

  private router = inject(Router);

  indiceAtivo = 0;

  verDetalhes(): void {
    this.router.navigate(['/imovel', this.imovel.id]);
  }

  irParaFoto(indice: number, event: Event): void {
    event.stopPropagation(); // não navega para detalhes ao clicar
    this.indiceAtivo = indice;
  }

  fotoAnterior(event: Event): void {
    event.stopPropagation();
    this.indiceAtivo = this.indiceAtivo === 0
      ? this.imovel.imagens.length - 1
      : this.indiceAtivo - 1;
  }

  fotoProxima(event: Event): void {
    event.stopPropagation();
    this.indiceAtivo = this.indiceAtivo === this.imovel.imagens.length - 1
      ? 0
      : this.indiceAtivo + 1;
  }

  get precoFormatado(): string {
    const valor = this.imovel.preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    if (this.imovel.finalidade === 'aluguel') return `${valor}/mês`;
    if (this.imovel.finalidade === 'diaria') return `${valor}/diária`;
    return valor;
  }


  eBolinhAtiva(i: number): boolean {
    return i === this.indiceAtivo;
  }
}