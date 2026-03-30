import { Component, inject, ViewChild, ElementRef, ChangeDetectorRef  } from '@angular/core';
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
 private cdr = inject(ChangeDetectorRef); 
  @ViewChild('inputFotos') inputFotos!: ElementRef<HTMLInputElement>;

  etapaAtual: Etapa = 1;
  salvando = false;
  erroUpload = '';
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

  validarEtapa(): string | null {
    if (this.etapaAtual === 1) {
      if (!this.form.tipo) return 'Selecione o tipo do imóvel';
      if (!this.form.finalidade) return 'Selecione a finalidade';
      if (!this.form.titulo.trim()) return 'Preencha o título do anúncio';
      if (!this.form.descricao.trim()) return 'Preencha a descrição';
    }
    if (this.etapaAtual === 2) {
      if (!this.form.area || this.form.area <= 0) return 'Informe a área do imóvel';
      if (!this.form.preco || this.form.preco <= 0) return 'Informe o valor do imóvel';
    }
    if (this.etapaAtual === 3) {
      if (!this.form.bairro.trim()) return 'Preencha o bairro';
      if (!this.form.cidade.trim()) return 'Preencha a cidade';
      if (!this.form.estado) return 'Selecione o estado';
    }
    return null;
  }

  avancarEtapa(): void {
    const erro = this.validarEtapa();
    if (erro) {
      this.erroUpload = erro;
      return;
    }
    this.erroUpload = '';
    if (this.etapaAtual < 3) {
      this.etapaAtual = (this.etapaAtual + 1) as Etapa;
    }
  }

  voltarEtapa(): void {
    if (this.etapaAtual > 1) {
      this.etapaAtual = (this.etapaAtual - 1) as Etapa;
    }
  }

  triggerInput(): void {
    this.inputFotos.nativeElement.value = '';
    this.inputFotos.nativeElement.click();
  }

  async onSelecionarImagens(event: Event, input: HTMLInputElement): Promise<void> {
    const arquivos = Array.from((event.target as HTMLInputElement).files ?? []);
    if (!arquivos.length) return;

    this.erroUpload = '';

    if (this.imagensPreview.length + arquivos.length > 5) {
      this.erroUpload = 'Máximo de 5 imagens permitidas.';
      return;
    }

    for (const arquivo of arquivos) {
      const comprimido = await this.comprimirImagem(arquivo);
      const url = URL.createObjectURL(comprimido);
      this.imagensPreview.push({ url, arquivo: comprimido });
    }

    input.value = '';
    this.cdr.detectChanges();  // ← força re-renderizar após async
  }

  async comprimirImagem(arquivo: File): Promise<File> {
    const opcoes = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    };
    try {
      return await imageCompression(arquivo, opcoes);
    } catch {
      return arquivo;
    }
  }

  removerImagem(indice: number): void {
    this.imagensPreview.splice(indice, 1);
  }

  async submeter(): Promise<void> {
    const erro = this.validarEtapa();
    if (erro) {
      this.erroUpload = erro;
      return;
    }
    if (this.salvando) return;

    try {
      this.salvando = true;
      this.erroUpload = '';

      const urlsImagens: string[] = [];
      for (const imagem of this.imagensPreview) {
        const url = await this.supabase.uploadImagem(imagem.arquivo);
        urlsImagens.push(url);
      }

      await this.supabase.cadastrarImovel({
        ...this.form,
        imagens: urlsImagens,
        novo: true,
        destaque: false,
      });

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