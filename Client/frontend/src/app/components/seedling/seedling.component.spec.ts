import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedlingComponent } from './seedling.component';

describe('SeedlingComponent', () => {
  let component: SeedlingComponent;
  let fixture: ComponentFixture<SeedlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeedlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
