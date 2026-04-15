import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { timer, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-input-signal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 bg-gray-50 flex flex-col gap-6 w-100">
      
      <div style="padding: 20px; border: 1px solid #ccc; border-radius: 8px;" class="bg-white">
        <h3 style="margin-top: 0;">Input 1 (Validação no Blur)</h3>
        <label>Insira o código:</label>
        <br />
        <input 
          type="text" 
          [formControl]="codigoControl"
          placeholder="Ex: 12345"
          [maxlength]="5"
          style="background-color: #ebf8ff; border: 1px solid #bee3f8; padding: 5px;"
        />

        <p>Status "Digitando": <strong>{{ estaDigitando1() ? 'Ativo' : 'Inativo' }}</strong></p>
        
        @if (estaDigitando1()) {
          <p style="color: blue;">O valor foi atualizado via Blur! (Sumi em 5s)</p>
        }
      </div>

      <div style="padding: 20px; border: 1px solid #ccc; border-radius: 8px;" class="bg-white">
        <h3 style="margin-top: 0;">Input 2 (Validação ao Digitar)</h3>
        <label>Insira o código:</label>
        <br />
        <input 
          type="text" 
          [formControl]="codigoControl2"
          placeholder="Ex: 12345"
          [maxlength]="5"
          style="background-color: #ebf8ff; border: 1px solid #bee3f8; padding: 5px;"
        />

        <p>Status "Digitando": <strong>{{ estaDigitando2() ? 'Ativo' : 'Inativo' }}</strong></p>

        @if (estaDigitando2()) {
          <p style="color: orange;">Você está digitando agora! (Sumi em 5s)</p>
        }
      </div>
        <div class="bg-purple-200 p-4 rounded-lg">
          <p>Novo card</p>
        <input [formControl]="codigocontrole3" />
        <p>Status "Digitando": <strong>{{ codigocontrole3.value }}</strong></p>
       
      </div>
    </div>
  `
})
export class InputSignalComponent {
  // Controle 1: Só emite valueChanges quando perde o foco (blur)
  codigoControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)],
    updateOn: 'blur'
  });

  codigocontrole3 = new FormControl('',{
    nonNullable: true,
    updateOn: 'blur'
  });



  // Controle 2: Emite valueChanges a cada tecla (change default)
  codigoControl2 = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)],
    updateOn: 'change'
  });

  // Signals independentes
  readonly estaDigitando1 = signal(false);
  readonly estaDigitando2 = signal(false);

  constructor() {
    // Lógica para o Input 1 (Blur)
    this.codigoControl.valueChanges.pipe(
      takeUntilDestroyed(),
      tap(() => this.estaDigitando1.set(true)), // Liga o alerta
      switchMap(() => timer(5000)) // Espera 5s. Se houver novo evento, reinicia o timer.
    ).subscribe(() => {
      this.estaDigitando1.set(false); // Desliga após 5s
    });

    // Lógica para o Input 2 (Ao digitar)
    this.codigoControl2.valueChanges.pipe(
      takeUntilDestroyed(),
      tap(() => this.estaDigitando2.set(true)), // Liga o alerta
      switchMap(() => timer(5000)) // Espera 5s
    ).subscribe(() => {
      this.estaDigitando2.set(false); // Desliga após 5s
    });
  }
}