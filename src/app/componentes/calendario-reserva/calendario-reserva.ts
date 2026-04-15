import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PeriodoSelecionado {
  inicio: Date;
  fim: Date;
}

@Component({
  selector: 'app-calendario-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario-reserva.html',
  styleUrl: './calendario-reserva.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioReserva implements OnChanges {
  @Input() datasOcupadas: { data_inicio: string; data_fim: string }[] = [];
  @Output() periodoSelecionado = new EventEmitter<PeriodoSelecionado>();

  private cdr = inject(ChangeDetectorRef);

  hoje = new Date();
  mesAtual: Date;
  mesProximo: Date;
  diasMesAtual: (Date | null)[] = [];
  diasMesProximo: (Date | null)[] = [];

  inicio: Date | null = null;
  fim: Date | null = null;
  hover: Date | null = null;

  DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
           'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  constructor() {
    this.mesAtual = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), 1);
    this.mesProximo = new Date(this.hoje.getFullYear(), this.hoje.getMonth() + 1, 1);
    this.gerarDias();
  }

  ngOnChanges(): void {
    this.gerarDias();
    this.cdr.markForCheck();
  }

  gerarDias(): void {
    this.diasMesAtual = this.gerarDiasDoMes(this.mesAtual);
    this.diasMesProximo = this.gerarDiasDoMes(this.mesProximo);
  }

  gerarDiasDoMes(primeiroDia: Date): (Date | null)[] {
    const dias: (Date | null)[] = [];
    const diaDaSemana = primeiroDia.getDay();
    for (let i = 0; i < diaDaSemana; i++) dias.push(null);
    const totalDias = new Date(primeiroDia.getFullYear(), primeiroDia.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= totalDias; d++) {
      dias.push(new Date(primeiroDia.getFullYear(), primeiroDia.getMonth(), d));
    }
    return dias;
  }

  avancarMes(): void {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 1);
    this.mesProximo = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 1);
    this.gerarDias();
    this.cdr.markForCheck();
  }

  voltarMes(): void {
    const anterior = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() - 1, 1);
    if (anterior >= new Date(this.hoje.getFullYear(), this.hoje.getMonth(), 1)) {
      this.mesAtual = anterior;
      this.mesProximo = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 1);
      this.gerarDias();
      this.cdr.markForCheck();
    }
  }

  clicarDia(dia: Date): void {
    if (this.isDiaPassado(dia) || this.isDiaOcupado(dia)) return;
    if (!this.inicio || (this.inicio && this.fim)) {
      this.inicio = dia;
      this.fim = null;
    } else {
      if (dia <= this.inicio) { this.inicio = dia; return; }
      if (this.temOcupadoNoRange(this.inicio, dia)) {
        this.inicio = dia; this.fim = null; return;
      }
      this.fim = dia;
      this.periodoSelecionado.emit({ inicio: this.inicio, fim: this.fim });
    }
    this.cdr.markForCheck();
  }

  hoverDia(dia: Date | null): void {
    this.hover = dia;
    this.cdr.markForCheck();
  }

  temOcupadoNoRange(de: Date, ate: Date): boolean {
    return this.datasOcupadas.some(r => {
      const ri = new Date(r.data_inicio + 'T00:00:00');
      const rf = new Date(r.data_fim + 'T00:00:00');
      return ri < ate && rf > de;
    });
  }

  isDiaPassado(dia: Date): boolean {
    const ontem = new Date(this.hoje); ontem.setDate(ontem.getDate() - 1);
    return dia <= ontem;
  }

  isDiaOcupado(dia: Date): boolean {
    return this.datasOcupadas.some(r => {
      const ri = new Date(r.data_inicio + 'T00:00:00');
      const rf = new Date(r.data_fim + 'T00:00:00');
      return dia >= ri && dia < rf;
    });
  }

  isDiaInicio(dia: Date): boolean {
    return !!this.inicio && dia.toDateString() === this.inicio.toDateString();
  }

  isDiaFim(dia: Date): boolean {
    return !!this.fim && dia.toDateString() === this.fim.toDateString();
  }

  isDentroDoRange(dia: Date): boolean {
    const fim = this.fim ?? this.hover;
    if (!this.inicio || !fim) return false;
    return dia > this.inicio && dia < fim;
  }

  get podevoltar(): boolean {
    return this.mesAtual > new Date(this.hoje.getFullYear(), this.hoje.getMonth(), 1);
  }

  resetar(): void {
    this.inicio = null;
    this.fim = null;
    this.hover = null;
    this.cdr.markForCheck();
  }
}