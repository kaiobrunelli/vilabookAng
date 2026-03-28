import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ImoveisService } from '../../servicos/imoveis';
import { Imovel } from '../../modelos/imovel';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';

@Component({
  selector: 'app-detalhes-imovel',
  imports: [Cabecalho],
  templateUrl: './detalhes-imovel.html',
  styleUrl: './detalhes-imovel.css',
})
export class DetalhesImovel {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private imoveisService = inject(ImoveisService);

  imovel: Imovel | undefined;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.imovel = this.imoveisService.buscarPorId(id);
  }

  voltar(): void {
    this.location.back();
  }

  get precoFormatado(): string {
    if (!this.imovel) return '';
    const valor = this.imovel.preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return this.imovel.finalidade === 'aluguel' ? `${valor}/mês` : valor;
  }
}