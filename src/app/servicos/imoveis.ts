import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class ImoveisService {
  private supabase = inject(SupabaseService);

  async listarTodos() {
    return await this.supabase.listarImoveis();
  }

  async buscarPorId(id: string) {
    return await this.supabase.buscarPorId(id);
  }

  async cadastrar(imovel: any) {
    return await this.supabase.cadastrarImovel(imovel);
  }
}