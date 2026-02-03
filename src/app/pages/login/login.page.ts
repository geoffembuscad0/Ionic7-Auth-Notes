import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  AlertController,
} from '@ionic/angular/standalone';
import { SupabaseService } from 'src/app/services/supabase.service'; // <-- Import the service

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonInput,
    IonButton
],
})
export class LoginPage {
  // Use Angular's modern inject() function
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  credentials = {
    email: '',
    password: '',
  };

  constructor() {}

  async login() {
    try {
      // Call the service method
      await this.supabaseService.signIn(this.credentials);

      // Navigate to the main app page (e.g., your CRUD page)
      // this.router.navigateByUrl('/folder/', { replaceUrl: true });
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });

    } catch (error: any) {
      this.presentAlert('Login Failed', error.message || 'An unknown error occurred.');
    }
  }
  navigateToRegister() {
    console.log('Navigating to /register');
    this.router.navigateByUrl('/register');
  }

  // Utility to show an Ionic alert on error
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
/**
 * Sample Login Credentials:
 * mayor.quezon_city@yahoo.com
 * joybelmonte1970
 */
