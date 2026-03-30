import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../../servicos/supabase';

@Component({
  selector: 'app-estudo',
  imports: [],
  templateUrl: './estudo.html',
  styleUrl: './estudo.css',
})
export class Estudo {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  imoveis: any[] = [];
  verPaginaHome(): void {
    this.router.navigate(['']);
  }
  async ngOnInit(): Promise<void> {
    await this.carregarMeusImoveis();
  }
  async carregarMeusImoveis(): Promise<void> {

    this.imoveis = await this.supabase.meusImoveis();

    this.cdr.detectChanges();
  }
}
