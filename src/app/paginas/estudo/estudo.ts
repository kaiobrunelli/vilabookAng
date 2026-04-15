import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../../servicos/supabase';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, firstValueFrom, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TibiaBoostableBossesResponse, TibiaBoss, TibiaCreature } from './estudo.interface';
import { DashboardPage } from './estudo2';
import { InputSignalComponent } from "./estudoSignal";
import { MoradoresPage } from "../../paginasCondominio/pages/moradores/moradores";
import { RelatorioPage } from "../../paginasCondominio/pages/relatorio/relatorio";

@Component({
  selector: 'app-estudo',
  imports: [ReactiveFormsModule, DashboardPage, InputSignalComponent, RelatorioPage],
  templateUrl: './estudo.html',
  styleUrl: './estudo.css',
})
export class Estudo {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  carregando = false;
  erro = '';
  abrirPaginaRelatorioxp(): void {
    this.router.navigate(['/relatorioxp']);
  }
  boostedBoss: TibiaBoss | null = null;

  async consultarBossDestaque(): Promise<void> {
    this.carregando = true;
    this.erro = '';

    try {
      const resposta = await firstValueFrom(
        this.http.get<TibiaBoostableBossesResponse>('https://api.tibiadata.com/v4/boostablebosses')
      );

      this.boostedBoss = resposta.boostable_bosses.boosted;
      this.cdr.detectChanges();

    } catch (e) {
      this.erro = 'Erro ao consultar boss em destaque';
      console.error(e);
      this.cdr.detectChanges();
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }


  imoveis: any[] = [];
  indiceAtivo = 0;

  async carregarMeusImoveis(): Promise<void> {

    this.imoveis = await this.supabase.meusImoveis();

    this.cdr.detectChanges();
  }






  respostaStatus = '';

  verPaginaHome(): void {
    this.router.navigate(['']);
  }

  abrirPaginaHome(): void {
    this.router.navigate(['/mimos-neuza']);
  }

  consultarStatus(codigo: string): void {

    this.supabase.consultarCodigoStatus(codigo)
      .then(status => {
        this.respostaStatus = `Status do código ${codigo}: ${status}`;
        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error('Erro ao consultar status:', error);
        this.respostaStatus = 'Erro ao consultar status. Tente novamente.';
        this.cdr.detectChanges();
      });

  }
  cidadeBusca = new FormControl('');
  buscarCodigo = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnInit() {

    this.cidadeBusca.valueChanges.pipe(
      debounceTime(400),
      takeUntil(this.destroy$)
    );
    this.buscarCodigo.valueChanges.pipe(
      debounceTime(400),
      takeUntil(this.destroy$)
    );
    this.carregarMeusImoveis();

  }

}

// async ngOnInit(): Promise<void> {
//   await this.carregarMeusImoveis();
// }
