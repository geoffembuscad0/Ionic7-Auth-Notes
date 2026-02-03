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
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPage {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  credentials = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor() {}

  async register() {
    if (this.credentials.password !== this.credentials.confirmPassword) {
      this.presentAlert('Error', 'Passwords do not match');
      return;
    }
    try {
      await this.supabaseService.signUp({
        email: this.credentials.email,
        password: this.credentials.password
      });
      this.presentAlert('Success', 'Registration successful! Please check your email for a confirmation link.');
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error: any) {
      this.presentAlert('Registration Failed', error.message || 'An unknown error occurred.');
    }
  }
  navigateToLogin() {
    console.log('Navigating to /login');
    this.router.navigateByUrl('/login');
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
