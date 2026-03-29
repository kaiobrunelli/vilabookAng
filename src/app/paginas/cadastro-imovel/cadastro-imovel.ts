import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';

type Etapa = 1 | 2 | 3;

@Component({
  selector: 'app-cadastro-imovel',
  imports: [Cabecalho, FormsModule],
  templateUrl: './cadastro-imovel.html',
  styleUrl: './cadastro-imovel.css',
})
export class CadastroImovel {
  private router = inject(Router);

  etapaAtual: Etapa = 1;

  // Dados do formulário
  form = {
    // Etapa 1 — Informações básicas
    tipo: '',
    finalidade: '',
    titulo: '',
    descricao: '',

    // Etapa 2 — Detalhes
    suites: 1,
    banheiros: 1,
    vagas: 1,
    area: 0,
    preco: 0,
    condominio: 0,
    iptu: 0,

    // Etapa 3 — Localização
    bairro: '',
    cidade: '',
    estado: '',
    endereco: '',
  };
incrementar(campo: 'suites' | 'banheiros' | 'vagas'): void {
  this.form[campo]++;
}

decrementar(campo: 'suites' | 'banheiros' | 'vagas'): void {
  if (this.form[campo] > 0) {
    this.form[campo]--;
  }
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

  submeter(): void {
    console.log('Imóvel cadastrado:', this.form);
    // futuramente: chamar o service para salvar
    this.router.navigate(['/']);
  }

  get progressoPorcentagem(): number {
    return (this.etapaAtual / 3) * 100;
  }
}