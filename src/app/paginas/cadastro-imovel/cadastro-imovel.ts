import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { SupabaseService } from '../../servicos/supabase';
import imageCompression from 'browser-image-compression';

type Etapa = 1 | 2 | 3;

@Component({
  selector: 'app-cadastro-imovel',
  imports: [Cabecalho, FormsModule],
  templateUrl: './cadastro-imovel.html',
  styleUrl: './cadastro-imovel.css',
})
export class CadastroImovel {
  private router = inject(Router);
  private supabase = inject(SupabaseService);

  etapaAtual: Etapa = 1;
  salvando = false;
  erroUpload = '';

  // Preview das imagens selecionadas
  imagensPreview: { url: string; arquivo: File }[] = [];

  form = {
    tipo: '',
    finalidade: '',
    titulo: '',
    descricao: '',
    suites: 1,
    banheiros: 1,
    vagas: 1,
    area: 0,
    preco: 0,
    condominio: 0,
    iptu: 0,
    bairro: '',
    cidade: '',
    estado: '',
    endereco: '',
  };

  incrementar(campo: 'suites' | 'banheiros' | 'vagas'): void {
    this.form[campo]++;
  }

  decrementar(campo: 'suites' | 'banheiros' | 'vagas'): void {
    if (this.form[campo] > 0) this.form[campo]--;
  }

  avancarEtapa(): void {
    if (this.etapaAtual < 3) {
      this.etapaAtual = (this.etapaAtual + 1) as Etapa;
    }
  }

  voltarEtapa(): void {
    if (this.etapaAtual > 1) {
      this.etapaAtual = (this.etapaAtual - 1) as Etapa;
    }
  }

  // Selecionar e comprimir imagens
  async onSelecionarImagens(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.erroUpload = '';
    const arquivos = Array.from(input.files);

    // Limite de 5 imagens
    if (this.imagensPreview.length + arquivos.length > 5) {
      this.erroUpload = 'Máximo de 5 imagens permitidas.';
      return;
    }

    for (const arquivo of arquivos) {
      // Comprime a imagem antes do preview
      const comprimido = await this.comprimirImagem(arquivo);
      const url = URL.createObjectURL(comprimido);
      this.imagensPreview.push({ url, arquivo: comprimido });
    }
  }

  // Comprimir imagem com browser-image-compression
  async comprimirImagem(arquivo: File): Promise<File> {
    const opcoes = {
      maxSizeMB: 0.8,          // máximo 800KB
      maxWidthOrHeight: 1920,   // máximo 1920px
      useWebWorker: true,       // não trava a UI
      fileType: 'image/webp',   // converte para WebP
    };

    try {
      return await imageCompression(arquivo, opcoes);
    } catch {
      return arquivo; // se falhar, usa o original
    }
  }

  // Remove imagem do preview
  removerImagem(indice: number): void {
    this.imagensPreview.splice(indice, 1);
  }

  // Submete o formulário
  async submeter(): Promise<void> {
    if (this.salvando) return;

    try {
      this.salvando = true;
      this.erroUpload = '';

      // 1. Faz upload de todas as imagens
      const urlsImagens: string[] = [];
      for (const imagem of this.imagensPreview) {
        const url = await this.supabase.uploadImagem(imagem.arquivo);
        urlsImagens.push(url);
      }

      // 2. Salva o imóvel no banco com as URLs
      await this.supabase.cadastrarImovel({
        ...this.form,
        imagens: urlsImagens,
        novo: true,
        destaque: false,
      });

      // 3. Redireciona para home
      this.router.navigate(['/']);

    } catch (e) {
      console.error(e);
      this.erroUpload = 'Erro ao cadastrar imóvel. Tente novamente.';
    } finally {
      this.salvando = false;
    }
  }

  get progressoPorcentagem(): number {
    return (this.etapaAtual / 3) * 100;
  }
}