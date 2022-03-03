import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtycommgrpComponent } from './hoqtycommgrp.component';

describe('HoqtycommgrpComponent', () => {
  let component: HoqtycommgrpComponent;
  let fixture: ComponentFixture<HoqtycommgrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtycommgrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtycommgrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
