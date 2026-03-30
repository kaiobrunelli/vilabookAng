import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  // Signal — forma reativa de guardar o usuário logado
  usuario = signal<any>(null);
  carregando = signal<boolean>(true);

  constructor() {
    // Observa mudanças de login/logout em tempo real
    this.supabase.onAuthChange((user) => {
      this.usuario.set(user);
      this.carregando.set(false);
    });
  }

  async loginComGoogle(): Promise<void> {
    await this.supabase.loginComGoogle();
  }

  async logout(): Promise<void> {
    await this.supabase.logout();
    this.usuario.set(null);
    this.router.navigate(['/']);
  }

  get estaLogado(): boolean {
    return !!this.usuario();
  }
}