import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtycommComponent } from './hoqtycomm.component';

describe('HoqtycommComponent', () => {
  let component: HoqtycommComponent;
  let fixture: ComponentFixture<HoqtycommComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtycommComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtycommComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
