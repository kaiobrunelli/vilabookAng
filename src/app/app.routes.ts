import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
    {
    path: '',                        // → URL: /
    loadComponent: () =>
      import('./paginas/inicio/inicio')
      .then(m => m.Inicio)
  }, 
  {
    path:'imovel/:id',
    loadComponent: () => 
           import('./paginas/detalhes-imovel/detalhes-imovel')
      .then(m => m.DetalhesImovel)
  },
      {
    path: 'cadastrar',                        // → URL: /
    loadComponent: () =>
      import('./paginas/cadastro-imovel/cadastro-imovel')
      .then(m => m.CadastroImovel),
      canActivate: [authGuard]
  }, 
 {
  path: 'auth/callback',
  loadComponent: () =>
    import('./paginas/auth-callback/auth-callback')
    .then(m => m.AuthCallback)
}
];
