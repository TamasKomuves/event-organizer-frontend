import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesContainerBlockComponent } from './messages-container-block.component';

describe('MessagesContainerBlockComponent', () => {
  let component: MessagesContainerBlockComponent;
  let fixture: ComponentFixture<MessagesContainerBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesContainerBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesContainerBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
