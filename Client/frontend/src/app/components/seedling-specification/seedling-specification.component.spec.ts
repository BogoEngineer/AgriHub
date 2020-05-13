import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedlingSpecificationComponent } from './seedling-specification.component';

describe('SeedlingSpecificationComponent', () => {
  let component: SeedlingSpecificationComponent;
  let fixture: ComponentFixture<SeedlingSpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeedlingSpecificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedlingSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
