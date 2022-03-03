import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdsLiftmentRiceonlyComponent } from './pds-liftment-riceonly.component';

describe('PdsLiftmentRiceonlyComponent', () => {
  let component: PdsLiftmentRiceonlyComponent;
  let fixture: ComponentFixture<PdsLiftmentRiceonlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdsLiftmentRiceonlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdsLiftmentRiceonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
