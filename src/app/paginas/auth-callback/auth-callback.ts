import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../servicos/supabase';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-slate-50">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent
                    rounded-full animate-spin"></div>
        <p class="text-slate-500 font-medium">Autenticando...</p>
      </div>
    </div>
  `,
})
export class AuthCallback implements OnInit {
  private router = inject(Router);
  private supabase = inject(SupabaseService);

  async ngOnInit(): Promise<void> {
    // Aguarda a sessão ser estabelecida pelo Supabase
    await this.aguardarSessao();
    this.router.navigate(['/cadastrar']);
  }

  private async aguardarSessao(): Promise<void> {
    // Tenta até 10 vezes com intervalo de 500ms
    for (let i = 0; i < 10; i++) {
      const usuario = await this.supabase.usuarioAtual();
      if (usuario) return; // sessão estabelecida!
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}