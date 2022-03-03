import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderregionrepComponent } from './tenderregionrep.component';

describe('TenderregionrepComponent', () => {
  let component: TenderregionrepComponent;
  let fixture: ComponentFixture<TenderregionrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderregionrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderregionrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
