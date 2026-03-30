import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicos/auth';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Aguarda o carregamento inicial da sessão
  await aguardarCarregamento(auth);

  if (auth.estaLogado) {
    return true;
  }

  await auth.loginComGoogle();
  return false;
};

function aguardarCarregamento(auth: AuthService): Promise<void> {
  return new Promise(resolve => {
    if (!auth.carregando()) {
      resolve();
      return;
    }
    // Verifica a cada 100ms até o carregamento terminar
    const intervalo = setInterval(() => {
      if (!auth.carregando()) {
        clearInterval(intervalo);
        resolve();
      }
    }, 100);
  });
}