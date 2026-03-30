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

  async onAnunciarClick(): Promise<void> {
    if (this.auth.estaLogado) {
      // já logado → vai direto para cadastro
      // o RouterLink no HTML cuida disso
    } else {
      // não logado → abre login com Google
      await this.auth.loginComGoogle();
    }
  }

  async onLogout(): Promise<void> {
    await this.auth.logout();
  }
}