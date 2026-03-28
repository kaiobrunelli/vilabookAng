import { Routes } from '@angular/router';

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
  }
];
