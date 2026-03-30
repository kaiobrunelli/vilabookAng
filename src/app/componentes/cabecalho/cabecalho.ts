import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../servicos/auth';

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink],
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.css',
})
export class Cabecalho {
  auth = inject(AuthService);
  menuAberto = false;

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  async onAnunciarClick(): Promise<void> {
    if (!this.auth.estaLogado) {
      await this.auth.loginComGoogle();
    }
  }

  async onLogout(): Promise<void> {
    this.fecharMenu();
    await this.auth.logout();
  }
}