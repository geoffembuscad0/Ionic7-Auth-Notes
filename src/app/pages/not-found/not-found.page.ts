import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonText,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [IonContent, IonButton, IonText, IonIcon],
  template: `
    <ion-content class="ion-padding ion-text-center">
      <div class="container">
        <ion-icon name="home-outline" style="font-size: 80px;"></ion-icon>
        <h1>404</h1>
        <ion-text color="medium">
          <p>The path you seek is not here.</p>
        </ion-text>
        <ion-button expand="block" fill="clear" (click)="goHome()">
          Return to Dashboard
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    h1 { font-size: 4rem; margin: 0; }
  `]
})
export class NotFoundPage {
  private router = inject(Router);

  constructor() {
    addIcons({ homeOutline });
  }

  goHome() {
    this.router.navigate(['/dashboard'], { replaceUrl: true });
  }
}
