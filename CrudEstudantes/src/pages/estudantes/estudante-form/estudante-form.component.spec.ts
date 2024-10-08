import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudanteFormComponent } from './estudante-form.component';

describe('UserFormComponent', () => {
  let component: EstudanteFormComponent;
  let fixture: ComponentFixture<EstudanteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudanteFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudanteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
