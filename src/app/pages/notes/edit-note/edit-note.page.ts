import { Component, inject, OnInit } from '@angular/core'; // Use lowercase inject
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Added ActivatedRoute
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
  selector: 'app-edit-note',
  templateUrl: './edit-note.page.html',
  styleUrls: ['./edit-note.page.scss'],
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
  ]
})
export class EditNotePage implements OnInit {
  noteForm: FormGroup;
  noteId: string | null = null;

  // Use the lowercase inject() function for modern Angular
  private notesService = inject(NotesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // To get the ID from URL
  private fb = inject(FormBuilder);
  private toastCtrl = inject(ToastController);

  constructor() {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['']
    });
  }

  async ngOnInit() {
    // 1. Get the ID from the URL (e.g., /edit-note/123)
    this.noteId = this.route.snapshot.paramMap.get('id');

    if (this.noteId) {
      await this.loadNote(this.noteId);
    }
  }

  async loadNote(id: string) {
    try {
      const note = await this.notesService.getNote(id);
      if (note) {
        // 2. Fill the form with existing data
        this.noteForm.patchValue({
          title: note.title,
          content: note.content
        });
      }
    } catch (error) {
      this.presentToast('Error loading note');
    }
  }

  async updateNote() {
    if (this.noteForm.invalid || !this.noteId) {
      this.noteForm.markAllAsTouched();
      return;
    }

    const { title, content } = this.noteForm.value;

    try {
      // 3. Call the update method from your service
      await this.notesService.updateNote(this.noteId, { title, content });
      await this.presentToast('Note updated successfully!');
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    } catch (error: any) {
      console.error('Update note error', error);
      await this.presentToast(error?.message ?? 'Failed to update note');
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
