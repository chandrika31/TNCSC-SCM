import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyStatementAriComponent } from './daily-statement-ari.component';

describe('DailyStatementAriComponent', () => {
  let component: DailyStatementAriComponent;
  let fixture: ComponentFixture<DailyStatementAriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyStatementAriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyStatementAriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
