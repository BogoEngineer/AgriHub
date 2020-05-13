import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurserySpecificationComponent } from './nursery-specification.component';

describe('NurserySpecificationComponent', () => {
  let component: NurserySpecificationComponent;
  let fixture: ComponentFixture<NurserySpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurserySpecificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurserySpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
