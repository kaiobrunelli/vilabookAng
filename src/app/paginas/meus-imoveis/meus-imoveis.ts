import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { SupabaseService } from '../../servicos/supabase';

@Component({
  selector: 'app-meus-imoveis',
  imports: [Cabecalho, FormsModule],
  templateUrl: './meus-imoveis.html',
  styleUrl: './meus-imoveis.css',
})
export class MeusImoveis implements OnInit {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  imoveis: any[] = [];
  carregando = true;
  erro = '';

  // Controle do modal de edição
  modalAberto = false;
  imovelEditando: any = null;
  salvando = false;

  // Controle de confirmação de remoção
  idRemovendo: string | null = null;

  async ngOnInit(): Promise<void> {
    await this.carregarMeusImoveis();
  }

  async carregarMeusImoveis(): Promise<void> {
    try {
      this.carregando = true;
      this.imoveis = await this.supabase.meusImoveis();
    } catch (e) {
      this.erro = 'Erro ao carregar seus imóveis.';
      console.error(e);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  abrirEdicao(imovel: any): void {
    // Cria uma cópia para não modificar o original antes de salvar
    this.imovelEditando = { ...imovel };
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.imovelEditando = null;
  }

  async salvarEdicao(): Promise<void> {
    if (!this.imovelEditando) return;
    try {
      this.salvando = true;
      await this.supabase.atualizarImovel(this.imovelEditando.id, {
        titulo: this.imovelEditando.titulo,
        preco: this.imovelEditando.preco,
        condominio: this.imovelEditando.condominio,
        iptu: this.imovelEditando.iptu,
        descricao: this.imovelEditando.descricao,
        finalidade: this.imovelEditando.finalidade,
      });
      await this.carregarMeusImoveis();
      this.fecharModal();
    } catch (e) {
      console.error(e);
    } finally {
      this.salvando = false;
    }
  }

  async remover(id: string): Promise<void> {
    if (this.idRemovendo !== id) {
      // Primeiro clique — pede confirmação
      this.idRemovendo = id;
      return;
    }
    // Segundo clique — confirma remoção
    try {
      await this.supabase.removerImovel(id);
      this.imoveis = this.imoveis.filter(i => i.id !== id);
      this.idRemovendo = null;
      this.cdr.detectChanges();
    } catch (e) {
      console.error(e);
    }
  }

  cancelarRemocao(): void {
    this.idRemovendo = null;
  }

  async toggleDestaque(imovel: any): Promise<void> {
    try {
      await this.supabase.toggleDestaque(imovel.id, !imovel.destaque);
      imovel.destaque = !imovel.destaque;
      this.cdr.detectChanges();
    } catch (e) {
      console.error(e);
    }
  }

  verDetalhes(id: string): void {
    this.router.navigate(['/imovel', id]);
  }

  get precoFormatado(): (imovel: any) => string {
    return (imovel) => imovel.preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}