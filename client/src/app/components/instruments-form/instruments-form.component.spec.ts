import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentsFormComponent } from './instruments-form.component';

describe('InstrumentsFormComponent', () => {
  let component: InstrumentsFormComponent;
  let fixture: ComponentFixture<InstrumentsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
