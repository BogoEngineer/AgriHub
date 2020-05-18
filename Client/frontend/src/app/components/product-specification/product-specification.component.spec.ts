import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSpecificationComponent } from './product-specification.component';

describe('ProductSpecificationComponent', () => {
  let component: ProductSpecificationComponent;
  let fixture: ComponentFixture<ProductSpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSpecificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
