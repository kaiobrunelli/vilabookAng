import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ImoveisService } from '../../servicos/imoveis';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { Galeria } from '../../componentes/galeria/galeria';

@Component({
  selector: 'app-detalhes-imovel',
  imports: [Cabecalho, Galeria],
  templateUrl: './detalhes-imovel.html',
  styleUrl: './detalhes-imovel.css',
})
export class DetalhesImovel {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private imoveisService = inject(ImoveisService);

  imovel: any = null;
  carregando = true;
  erro = '';
  galeriaAberta = false;
  indiceGaleria = 0;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') as string; // ← string, não Number()
    this.carregarImovel(id);
  }

  async carregarImovel(id: string): Promise<void> {
    try {
      this.carregando = true;
      this.imovel = await this.imoveisService.buscarPorId(id); // ← await
    } catch (e) {
      this.erro = 'Imóvel não encontrado.';
      console.error(e);
    } finally {
      this.carregando = false;
    }
  }

  abrirGaleria(indice: number): void {
    this.indiceGaleria = indice;
    this.galeriaAberta = true;
  }

  fecharGaleria(): void {
    this.galeriaAberta = false;
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