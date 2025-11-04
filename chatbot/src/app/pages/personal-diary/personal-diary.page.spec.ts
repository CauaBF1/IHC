import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalDiaryPage } from './personal-diary.page';

describe('PersonalDiaryPage', () => {
  let component: PersonalDiaryPage;
  let fixture: ComponentFixture<PersonalDiaryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDiaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
