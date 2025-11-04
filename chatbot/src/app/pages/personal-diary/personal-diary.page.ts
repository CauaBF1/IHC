import { Component, OnInit } from '@angular/core';
import { DiaryService } from 'src/app/services/diary.service';

@Component({
  selector: 'app-personal-diary',
  templateUrl: './personal-diary.page.html',
  styleUrls: ['./personal-diary.page.scss'],
  standalone: false
})
export class PersonalDiaryPage implements OnInit {

  noteText = '';
  notes: any[] = [];

  constructor(private diaryService: DiaryService) {}

  async ngOnInit() {
    await this.loadNotes();
  }

  async loadNotes() {
    this.notes = await this.diaryService.getNotes();
  }

  async saveNote() {
    if (!this.noteText.trim()) return;

    await this.diaryService.saveNote(this.noteText.trim());
    this.noteText = '';
    await this.loadNotes();
  }

  async deleteNote(id: number) {
    await this.diaryService.deleteNote(id);
    await this.loadNotes();
  }
}
