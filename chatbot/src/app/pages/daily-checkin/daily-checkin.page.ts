import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-checkin',
  templateUrl: './daily-checkin.page.html',
  styleUrls: ['./daily-checkin.page.scss'],
  standalone: false,
})
export class DailyCheckinPage {
  form: FormGroup;
  submitted = false;

  moods = [
    { value: 'feliz', label: 'Feliz 😀' },
    { value: 'neutro', label: 'Neutro 😐' },
    { value: 'triste', label: 'Triste 😔' },
    { value: 'ansioso', label: 'Ansioso 😰' }
  ];

  energyLevels = [1,2,3,4,5];

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      mood: [null, Validators.required],
      sleepHours: [null, [Validators.required, Validators.min(0), Validators.max(24)]],
      energy: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      notes: ['']
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted = true;
    // Futuro: enviar para backend (/save-daily-checkin) ou armazenar local
    console.log('[DailyCheckin] Dados enviados', this.form.value);
    // Redireciona para chat após salvar
    this.router.navigate(['/chat']);
  }
}
