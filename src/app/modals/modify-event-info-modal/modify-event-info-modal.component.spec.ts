import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyEventInfoModalComponent } from './modify-event-info-modal.component';

describe('ModifyEventInfoModalComponent', () => {
  let component: ModifyEventInfoModalComponent;
  let fixture: ComponentFixture<ModifyEventInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyEventInfoModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyEventInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
