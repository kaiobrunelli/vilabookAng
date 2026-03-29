import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-galeria',
  imports: [],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css',
})
export class Galeria implements OnChanges {
  @Input() imagens: string[] = [];
  @Input() indiceInicial: number = 0;
  @Output() fechar = new EventEmitter<void>();

  indiceAtivo: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indiceInicial']) {
      this.indiceAtivo = this.indiceInicial;
    }
    console.log('imagens recebidas:', this.imagens);
  }

  irPara(indice: number): void {
    this.indiceAtivo = indice;
  }

  anterior(): void {
    if (this.indiceAtivo === 0) {
      this.indiceAtivo = this.imagens.length - 1;
    } else {
      this.indiceAtivo--;
    }
  }

  proximo(): void {
    if (this.indiceAtivo === this.imagens.length - 1) {
      this.indiceAtivo = 0;
    } else {
      this.indiceAtivo++;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onTeclado(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft')  this.anterior();
    if (event.key === 'ArrowRight') this.proximo();
    if (event.key === 'Escape')     this.fechar.emit();
  }
}
