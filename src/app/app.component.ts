
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from './services/supabase.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, addCircleOutline, addCircleSharp } from 'ionicons/icons';
import { User } from '@supabase/supabase-js';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule,RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {
  // Inject services
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  // Observable to track the login status
  isLoggedIn$!: Observable<boolean>;
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {
    addIcons({ mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, addCircle, addCircleOutline, addCircleSharp });
  }
  ngOnInit() {
    this.isLoggedIn$ = this.supabaseService.currentUser.pipe(
      map((user: User | null) => !!user) // Maps the User object to true/false
    );
  }
  async logout() {
    try {
      await this.supabaseService.signOut();

      // Navigate to the login page and clear the history
      this.router.navigateByUrl('/login', { replaceUrl: true });

    } catch (error) {
      console.error('Logout error:', error);
      // Optional: Add an Ionic alert here to inform the user of a failed logout
    }
  }
}
