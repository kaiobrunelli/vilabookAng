import { Component, inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { CardImovel } from '../../componentes/card-imovel/card-imovel';
import { SupabaseService } from '../../servicos/supabase';
import { Imovel } from '../../modelos/imovel';

@Component({
  selector: 'app-pousadas',
  standalone: true,
  imports: [CommonModule, Cabecalho, CardImovel],
  templateUrl: './pousadas.html',
  styleUrl: './pousadas.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pousadas implements OnInit {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  pousadas: Imovel[] = [];
  carregando = true;

  async ngOnInit(): Promise<void> {
    const { data } = await this.supabase.client
      .from('imoveis')
      .select('*')
      .eq('finalidade', 'diaria')
      .order('criado_em', { ascending: false });

    this.pousadas = data ?? [];
    this.carregando = false;
    this.cdr.detectChanges();
  }

  abrirPousada(id: string): void {
    this.router.navigate(['/pousada', id]);
  }
}