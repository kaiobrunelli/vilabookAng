import { Component, inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { Galeria } from '../../componentes/galeria/galeria';
import { CalendarioReserva, PeriodoSelecionado } from '../../componentes/calendario-reserva/calendario-reserva';
import { SupabaseService } from '../../servicos/supabase';
import { ReservasService } from '../../servicos/reservas.service';
import { Imovel } from '../../modelos/imovel';

@Component({
  selector: 'app-detalhes-pousada',
  standalone: true,
  imports: [CommonModule, Cabecalho, Galeria, CalendarioReserva],
  templateUrl: './detalhes-pousada.html',
  styleUrl: './detalhes-pousada.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalhesPousada implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private reservasService = inject(ReservasService);
  private cdr = inject(ChangeDetectorRef);

  pousada: Imovel | null = null;
  datasOcupadas: { data_inicio: string; data_fim: string }[] = [];
  carregando = true;
  salvandoReserva = false;
  galeriaAberta = false;

  dataInicio: Date | null = null;
  dataFim: Date | null = null;
  erroReserva = '';
  reservaConfirmada = false;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/pousadas']); return; }

    const { data } = await this.supabase.client
      .from('imoveis')
      .select('*')
      .eq('id', id)
      .eq('categoria', 'pousada')
      .single();

    this.pousada = data;
    if (this.pousada) {
      this.datasOcupadas = await this.reservasService.buscarDatasOcupadas(id);
    }
    this.carregando = false;
    this.cdr.detectChanges();
  }

  onPeriodoSelecionado(periodo: PeriodoSelecionado): void {
    this.dataInicio = periodo.inicio;
    this.dataFim = periodo.fim;
    this.erroReserva = '';
    this.cdr.detectChanges();
  }

  get noites(): number {
    if (!this.dataInicio || !this.dataFim) return 0;
    return Math.round((this.dataFim.getTime() - this.dataInicio.getTime()) / 86400000);
  }

  get valorTotal(): number {
    return (this.pousada?.preco ?? 0) * this.noites;
  }

  formatarData(data: Date | null): string {
    if (!data) return 'Selecione';
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  async confirmarReserva(): Promise<void> {
    if (!this.dataInicio || !this.dataFim) {
      this.erroReserva = 'Selecione as datas de check-in e check-out.';
      return;
    }
    const { data: { user } } = await this.supabase.client.auth.getUser();
    if (!user) {
      this.erroReserva = 'Você precisa estar logado para reservar.';
      return;
    }

    this.salvandoReserva = true;
    this.erroReserva = '';

    try {
      const inicio = this.dataInicio.toISOString().split('T')[0];
      const fim = this.dataFim.toISOString().split('T')[0];

      const disponivel = await this.reservasService.verificarDisponibilidade(
        this.pousada!.id, inicio, fim
      );

      if (!disponivel) {
        this.erroReserva = 'As datas selecionadas não estão mais disponíveis.';
        this.salvandoReserva = false;
        this.cdr.detectChanges();
        return;
      }

      await this.reservasService.criarReserva({
        imovel_id: this.pousada!.id,
        hospede_id: user.id,
        data_inicio: inicio,
        data_fim: fim,
        valor_total: this.valorTotal,
        status: 'confirmada',
      });

      this.reservaConfirmada = true;
      this.datasOcupadas = await this.reservasService.buscarDatasOcupadas(this.pousada!.id);
    } catch {
      this.erroReserva = 'Erro ao confirmar reserva. Tente novamente.';
    } finally {
      this.salvandoReserva = false;
      this.cdr.detectChanges();
    }
  }
}