import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Estudo } from './estudo';

describe('Estudo', () => {
  let component: Estudo;
  let fixture: ComponentFixture<Estudo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Estudo],
    }).compileComponents();

    fixture = TestBed.createComponent(Estudo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
