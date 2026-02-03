import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from 'src/app/services/supabase.service';
import { NotesService } from 'src/app/services/notes.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonButton
  ]
})
export class DashboardPage implements OnDestroy {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private notesService = inject(NotesService);

  isLoggedIn$!: Observable<boolean>;
  notes: Array<{ id: string; title: string; content?: string; inserted_at?: string }> = [];
  loading = false;

  private notesSub?: Subscription;

  constructor() {
    // 2. Setup that only needs to happen once can go in the constructor
    this.isLoggedIn$ = this.supabaseService.currentUser.pipe(
      map(user => !!user)
    );
    // 3. Keep the Subscription here so it stays active as long as the component exists
    this.setupNotesSubscription();
  }
  // 4. Use the Ionic Lifecycle Hook
  ionViewWillEnter() {
    console.log('Dashboard entering - refreshing notes');
    this.loadNotes();
  }

  private setupNotesSubscription() {
    this.notesSub = this.notesService.notesUpdated$.subscribe(updated => {
      const idx = this.notes.findIndex(n => n.id === updated.id);
      if (idx > -1) {
        this.notes[idx] = { ...this.notes[idx], ...updated };
      } else {
        this.notes.unshift({
          id: updated.id,
          title: updated.title ?? '',
          content: updated.content ?? '',
          inserted_at: new Date().toISOString()
        });
      }
    });
  }

  async loadNotes() {
    this.loading = true;
    try {
      this.notes = await this.notesService.getNotes();
    } catch (err) {
      console.error('Failed to load notes', err);
      this.notes = [];
    } finally {
      this.loading = false;
    }
  }

  openCreateNote() {
    // navigate to the create note page
    this.router.navigateByUrl('/notes/create');
  }

  openEdit(id: string) {
    if (!id) return;
    this.router.navigateByUrl(`/notes/edit/${id}`);
  }
  // Add to your DashboardPage class:
  // 1. Handles the Pull-to-Refresh logic
  async handleRefresh(event: any) {
    await this.loadNotes();
    event.target.complete();
  }

  // 2. Performance optimization for the list
  trackByFn(index: number, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.notesSub?.unsubscribe();
  }
}
