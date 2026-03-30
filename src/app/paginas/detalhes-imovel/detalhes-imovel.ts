import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ImoveisService } from '../../servicos/imoveis';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { Galeria } from '../../componentes/galeria/galeria';
import { AuthService } from '../../servicos/auth';
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
  private cdr = inject(ChangeDetectorRef);  // ← adiciona
  auth = inject(AuthService);



  imovel: any = null;
  carregando = true;
  erro = '';
  galeriaAberta = false;
  indiceGaleria = 0;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') as string;
    this.carregarImovel(id);
  }

  async carregarImovel(id: string): Promise<void> {
    try {
      this.carregando = true;
      this.imovel = await this.imoveisService.buscarPorId(id);
    } catch (e) {
      this.erro = 'Imóvel não encontrado.';
      console.error(e);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();  // ← força re-renderizar
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
  get telefoneFormatado(): string {
    const tel = this.imovel?.telefone?.replace(/\D/g, '') || '';
    if (tel.length === 11) {
      return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
    }
    if (tel.length === 10) {
      return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`;
    }
    return this.imovel?.telefone || '';
  }
  get linkWhatsapp(): string {
    const telefone = this.imovel?.telefone || '';
    // Remove tudo que não é número
    const numero = telefone.replace(/\D/g, '');
    // Adiciona código do Brasil
    const numeroCompleto = `55${numero}`;
    const mensagem = encodeURIComponent(
      `Olá! Vi o imóvel "${this.imovel?.titulo}" no VilaBook e gostaria de mais informações. 🏠`
    );
    return `https://wa.me/${numeroCompleto}?text=${mensagem}`;
  }
  get primeiroNome(): string {
    if (!this.imovel?.nome_anunciante) return 'Anunciante';
    return this.imovel.nome_anunciante.split(' ')[0];
  }
}