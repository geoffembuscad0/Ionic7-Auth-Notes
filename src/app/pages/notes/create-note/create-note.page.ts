import { Component, inject } from '@angular/core'; // Added inject
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonButton,
  ToastController
} from '@ionic/angular/standalone';
import { NotesService } from 'src/app/services/notes.services';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.page.html',
  styleUrls: ['./create-note.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton
    // Note: Removed FormBuilder, FormGroup, Validators from imports as they are classes, not components/directives
  ]
})
export class CreateNotePage {
  noteForm: FormGroup;

  // Use modern Angular 'inject' for cleaner DI
  private notesService = inject(NotesService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastCtrl = inject(ToastController);

  constructor() {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['']
    });
  }

  async createNote() {
    // 1. Mark as touched so errors show up if the user clicks 'Create' immediately
    if (this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      this.presentToast('Please check the required fields.');
      return;
    }
    // 2. Extract values directly from the form group
    const { title, content } = this.noteForm.value;

    try {
      await this.notesService.createNote({ title, content });

      await this.presentToast('Note created successfully!');
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    } catch (error: any) {
      console.error('Create note error', error);
      await this.presentToast(error?.message ?? 'Failed to create note');
    }
  }

  private async presentToast(message: string) {
    const t = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await t.present();
  }
}
