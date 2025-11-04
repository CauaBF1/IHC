import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemporaryChatPage } from './temporary-chat.page';

describe('TemporaryChatPage', () => {
  let component: TemporaryChatPage;
  let fixture: ComponentFixture<TemporaryChatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
