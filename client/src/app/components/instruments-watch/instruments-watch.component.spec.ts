import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentsWatchComponent } from './instruments-watch.component';

describe('InstrumentsWatchComponent', () => {
  let component: InstrumentsWatchComponent;
  let fixture: ComponentFixture<InstrumentsWatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentsWatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentsWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
