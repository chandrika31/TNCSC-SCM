import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyStatementPartyComponent } from './daily-statement-party.component';

describe('DailyStatementPartyComponent', () => {
  let component: DailyStatementPartyComponent;
  let fixture: ComponentFixture<DailyStatementPartyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyStatementPartyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyStatementPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
