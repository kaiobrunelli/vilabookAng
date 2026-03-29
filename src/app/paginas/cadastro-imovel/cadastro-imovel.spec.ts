import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroImovel } from './cadastro-imovel';

describe('CadastroImovel', () => {
  let component: CadastroImovel;
  let fixture: ComponentFixture<CadastroImovel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroImovel],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroImovel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
