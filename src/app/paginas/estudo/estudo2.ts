import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';


type StatusKey = 'pago' | 'pendente' | 'atrasado';

const STATUS_LABEL: Record<StatusKey, string> = {
  pago: 'Pago',
  pendente: 'Pendente',
  atrasado: 'Atrasado',
};

const STATUS_BADGE_CLASS: Record<StatusKey, string> = {
  pago:     'text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700',
  pendente: 'text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100  text-amber-700',
  atrasado: 'text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-100    text-red-700',
};

@Component({
  selector: 'app-dashboard',
  imports: [  RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">

      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-display text-2xl font-semibold text-slate-900">
            Olá, síndico 👋
          </h1>
          <p class="text-slate-500 text-sm mt-0.5">
         ativo.nome
          </p>
        </div>
        <a
          routerLink="/despesas"
          class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <span class="material-symbols-rounded text-[18px]" aria-hidden="true">add</span>
          Nova Despesa
        </a>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" role="list" aria-label="Indicadores do mês">

        <article class="bg-white rounded-2xl border border-slate-100 shadow-card p-5" role="listitem">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-slate-500">Despesas do Mês</span>
            <div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center" aria-hidden="true">
              <span class="material-symbols-rounded text-red-500 text-[20px]">receipt_long</span>
            </div>
          </div>
          <p class="text-2xl font-display font-semibold text-slate-900">
           total_despesas | currency:'BRL':'symbol':'1.2-2'
          </p>
          <p class="text-xs text-slate-400 mt-1">qts despesas lançamentos</p>
        </article>

        <article class="bg-white rounded-2xl border border-slate-100 shadow-card p-5" role="listitem">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-slate-500">Pagas</span>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center" aria-hidden="true">
              <span class="material-symbols-rounded text-emerald-500 text-[20px]">check_circle</span>
            </div>
          </div>
          <p class="text-2xl font-display font-semibold text-slate-900">
           Depessas pagas
          </p>
          <div class="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden" role="progressbar"
      %
          >
            <div
  %
            ></div>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-100 shadow-card p-5" role="listitem">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-slate-500">Pendentes</span>
            <div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center" aria-hidden="true">
              <span class="material-symbols-rounded text-amber-500 text-[20px]">schedule</span>
            </div>
          </div>
          <p class="text-2xl font-display font-semibold text-slate-900">
           despesa pendentes
          </p>
          <p class="text-xs text-slate-400 mt-1">A vencer</p>
        </article>

        <article class="bg-white rounded-2xl border border-slate-100 shadow-card p-5" role="listitem">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-slate-500">Moradores</span>
            <div class="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center" aria-hidden="true">
              <span class="material-symbols-rounded text-primary-600 text-[20px]">groups</span>
            </div>
          </div>
          <p class="text-2xl font-display font-semibold text-slate-900">
      Total Moradores
          </p>
          <p class="text-xs text-slate-400 mt-1">
         total moradores2 
          </p>
        </article>
      </div>

      <!-- Saldo -->
<div>Saldo</div>

      <!-- Últimas despesas -->
      <section class="bg-white rounded-2xl border border-slate-100 shadow-card p-5" aria-labelledby="ultimas-despesas-title">
        <div class="flex items-center justify-between mb-4">
          <h2 id="ultimas-despesas-title" class="font-display font-semibold text-slate-800">
            Últimas Despesas
          </h2>
          <a
            routerLink="/despesas"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          >
            Ver todas →
          </a>
        </div>

 
      </section>

    </div>
  `,
})
export class DashboardPage  {




  private readonly mesAtual = new Date().toISOString().substring(0, 7);

  protected readonly mesAtualLabel = new Date().toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });







  protected badgeClass(status: string): string {
    return STATUS_BADGE_CLASS[status as StatusKey] ?? STATUS_BADGE_CLASS['pendente'];
  }

  protected statusLabel(status: string): string {
    return STATUS_LABEL[status as StatusKey] ?? status;
  }
}
