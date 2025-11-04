import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SleepChatPage } from './sleep-chat.page';

describe('SleepChatPage', () => {
  let component: SleepChatPage;
  let fixture: ComponentFixture<SleepChatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
