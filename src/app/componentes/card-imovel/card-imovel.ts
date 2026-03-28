import { Component, inject, Input } from '@angular/core';
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
  verDetalhes (): void {
    this.router.navigate(['imovel', this.imovel.id]);    
  }


  get precoFormatado(): string {
    const valor = this.imovel.preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    if (this.imovel.finalidade === 'aluguel') {
      return `${valor}/mês`;
    }
    return valor;
  }


}