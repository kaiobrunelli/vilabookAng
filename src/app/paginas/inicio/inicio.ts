import { Component, inject } from '@angular/core';
import { Cabecalho } from '../../componentes/cabecalho/cabecalho';
import { CardImovel } from '../../componentes/card-imovel/card-imovel';
import { ImoveisService } from '../../servicos/imoveis';
import { Imovel } from '../../modelos/imovel';

@Component({
  selector: 'app-inicio',
  imports: [Cabecalho, CardImovel],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  private imoveisService = inject(ImoveisService);

  imoveis: Imovel[] = this.imoveisService.listarTodos();
}