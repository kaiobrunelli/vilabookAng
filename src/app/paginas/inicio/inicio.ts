import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { CardImovel } from '../../componentes/card-imovel/card-imovel';
import { ImoveisService } from '../../servicos/imoveis';
import { AuthService } from '../../servicos/auth';
import { SupabaseService } from '../../servicos/supabase';

type Filtro = 'todos' | 'venda' | 'aluguel';

@Component({
  selector: 'app-inicio',
  imports: [Cabecalho, CardImovel, FormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private imoveisService = inject(ImoveisService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
    private supabase = inject(SupabaseService);
auth = inject(AuthService);
  termoBusca = '';
  filtroAtivo: Filtro = 'todos';
  todosImoveis: any[] = [];
  imoveis: any[] = [];
  carregando = true;
  erro = '';
  snackVisivel = false;
  mostrarSnack = false;
  async ngOnInit(): Promise<void> {
    if (sessionStorage.getItem('imovel_cadastrado')) {
      sessionStorage.removeItem('imovel_cadastrado');
      this.mostrarSnack = true;

      setTimeout(() => {
        this.mostrarSnack = false;
        this.cdr.detectChanges(); // ← força Angular a ver a mudança
      }, 2000);
    }
    const { data: { user } } = await this.supabase.getUser();
    const nome_anunciante : string = user?.user_metadata?.['full_name'] 
               ?? user?.user_metadata?.['name'] 
               ?? user?.email;
    console.log(nome_anunciante);
    await this.carregarImoveis();
    
    this.route.queryParams.subscribe(params => {
      const filtro = params['filtro'] as Filtro;
      if (filtro && ['todos', 'venda', 'aluguel'].includes(filtro)) {
        this.alterarFiltro(filtro);
        setTimeout(() => {
          document.getElementById('listagem')?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    });
  }

  async carregarImoveis(): Promise<void> {
    this.carregando = true;

    const resultado = await this.imoveisService.listarTodos();
    this.todosImoveis = resultado ?? [];
    this.imoveis = [...this.todosImoveis];
    this.carregando = false;

    this.cdr.detectChanges();  // ← força o Angular a re-renderizar
  }

  aplicarFiltro(): void {
    let resultado = [...this.todosImoveis];

    if (this.filtroAtivo !== 'todos') {
      resultado = resultado.filter(i => i.finalidade === this.filtroAtivo);
    }

    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(i =>
        i.titulo.toLowerCase().includes(termo) ||
        i.bairro.toLowerCase().includes(termo) ||
        i.cidade.toLowerCase().includes(termo)
      );
    }

    this.imoveis = resultado;
    this.cdr.detectChanges();  // ← força re-renderizar ao filtrar
  }

  alterarFiltro(filtro: Filtro): void {
    this.filtroAtivo = filtro;
    this.aplicarFiltro();
  }

  onBuscar(): void {
    this.aplicarFiltro();
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.aplicarFiltro();
  }

  get totalResultados(): number {
    return this.imoveis.length;
  }
}