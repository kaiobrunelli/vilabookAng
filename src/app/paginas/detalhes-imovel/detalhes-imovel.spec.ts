import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesImovel } from './detalhes-imovel';

describe('DetalhesImovel', () => {
  let component: DetalhesImovel;
  let fixture: ComponentFixture<DetalhesImovel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesImovel],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesImovel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
