import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusImoveis } from './meus-imoveis';

describe('MeusImoveis', () => {
  let component: MeusImoveis;
  let fixture: ComponentFixture<MeusImoveis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeusImoveis],
    }).compileComponents();

    fixture = TestBed.createComponent(MeusImoveis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
