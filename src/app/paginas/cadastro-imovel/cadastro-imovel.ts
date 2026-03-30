import { Component, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { SupabaseService } from '../../servicos/supabase';
import imageCompression from 'browser-image-compression';
import { AuthService } from '../../servicos/auth';

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

  auth = inject(AuthService);
  etapaAtual: Etapa = 1;
  salvando = false;
  erroUpload = '';
  imagensPreview: { url: string; arquivo: File }[] = [];

  // Erros por campo
  erros: Record<string, string> = {};

  form = {
    tipo: '',
    finalidade: '',
    titulo: '',
    descricao: '',
    suites: 0,
    banheiros: 0,
    vagas: 0,
    area: 0,
    preco: 0,
    condominio: 0,
    iptu: 0,
    bairro: '',
    cidade: '',
    estado: '',
    endereco: '',
    telefone: '',
  };

  incrementar(campo: 'suites' | 'banheiros' | 'vagas'): void {
    this.form[campo]++;
  }

  decrementar(campo: 'suites' | 'banheiros' | 'vagas'): void {
    if (this.form[campo] > 0) this.form[campo]--;
  }

  // Limpa erro de um campo ao editar
  limparErro(campo: string): void {
    delete this.erros[campo];
  }

  // Método de máscara automática
  mascararTelefone(valor: string): void {
    // Remove tudo que não é número
    const numeros = valor.replace(/\D/g, '');

    // Aplica máscara:
    let mascarado = '';
    if (numeros.length <= 2) {
      mascarado = numeros;
    } else if (numeros.length <= 7) {
      mascarado = `${numeros.slice(0, 2)} ${numeros.slice(2)}`;
    } else if (numeros.length <= 11) {
      mascarado = `${numeros.slice(0, 2)} ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    } else {
      mascarado = `${numeros.slice(0, 2)} ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
    }

    this.form.telefone = mascarado;
  }
  validarEtapa(): boolean {
    this.erros = {}; // limpa erros anteriores

    if (this.etapaAtual === 1) {
      if (!this.form.tipo)
        this.erros['tipo'] = 'Selecione o tipo do imóvel';
      if (!this.form.finalidade)
        this.erros['finalidade'] = 'Selecione a finalidade';
      if (!this.form.titulo.trim())
        this.erros['titulo'] = 'O título é obrigatório';
      if (this.form.titulo.trim().length < 3)
        this.erros['titulo'] = 'O título deve ter pelo menos 10 caracteres';
      if (!this.form.descricao.trim())
        this.erros['descricao'] = 'A descrição é obrigatória';
      if (this.form.descricao.trim().length < 3)
        this.erros['descricao'] = 'A descrição deve ter pelo menos 20 caracteres';
      if (!this.form.telefone.trim())
        this.erros['telefone'] = 'O WhatsApp para contato é obrigatório';
  
    const apenasNumeros = this.form.telefone.replace(/\D/g, '');
       if (this.form.telefone.trim() && apenasNumeros.length < 10)
        this.erros['telefone'] = 'Informe um número válido com DDD';
    }

    if (this.etapaAtual === 2) {
      if (!this.form.area || this.form.area <= 0)
        this.erros['area'] = 'Informe a área do imóvel';
      if (!this.form.preco || this.form.preco <= 0)
        this.erros['preco'] = 'Informe o valor do imóvel';
    }

    if (this.etapaAtual === 3) {
      if (!this.form.endereco.trim())
        this.erros['endereco'] = 'O endereço é obrigatório';
      if (!this.form.bairro.trim())
        this.erros['bairro'] = 'O bairro é obrigatório';
      if (!this.form.cidade.trim())
        this.erros['cidade'] = 'A cidade é obrigatória';
 
    }

    return Object.keys(this.erros).length === 0;
  }

  temErro(campo: string): boolean {
    return !!this.erros[campo];
  }

  avancarEtapa(): void {
    if (!this.validarEtapa()) {
      this.cdr.detectChanges();
      return;
    }
    if (this.etapaAtual < 3) {
      this.etapaAtual = (this.etapaAtual + 1) as Etapa;
    }
  }

  voltarEtapa(): void {
    this.erros = {};
    if (this.etapaAtual > 1) {
      this.etapaAtual = (this.etapaAtual - 1) as Etapa;
    }
  }

  triggerInput(): void {
    this.inputFotos.nativeElement.value = '';
    this.inputFotos.nativeElement.click();
  }

  // Substitui onSelecionarImagens e comprimirImagem por isso:

  async onSelecionarImagens(event: Event, input: HTMLInputElement): Promise<void> {
    const arquivos = Array.from((event.target as HTMLInputElement).files ?? []);
    if (!arquivos.length) return;

    this.erroUpload = '';

    if (this.imagensPreview.length + arquivos.length > 5) {
      this.erroUpload = 'Máximo de 5 imagens permitidas.';
      input.value = '';
      return;
    }

    // Processa cada arquivo individualmente e força detecção após cada um
    for (const arquivo of arquivos) {
      const comprimido = await this.comprimirImagem(arquivo);
      const url = URL.createObjectURL(comprimido);

      // Cria novo array a cada iteração — força Angular a detectar mudança
      this.imagensPreview = [...this.imagensPreview, { url, arquivo: comprimido }];
      this.cdr.detectChanges();
    }

    input.value = '';
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
    this.imagensPreview = this.imagensPreview.filter((_, i) => i !== indice);
    this.cdr.detectChanges();
  }

  async submeter(): Promise<void> {
    if (!this.validarEtapa()) {
      this.cdr.detectChanges();
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
        estado: 'MG', // garante sempre MG independente do form
        criado_por: this.auth.usuario()?.uid,
        email_anunciante: this.auth.usuario()?.email,
        nome_anunciante: this.auth.usuario()?.displayName,
      });

      sessionStorage.setItem('imovel_cadastrado', '1');
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